#!/usr/bin/env python3
"""Validate local remediation observations; never independent factory authority.

Supplied records are untrusted local evidence. Hashes detect drift, not authorship.
AC6 stays failed until a separately reviewed authenticated native-review adapter
exists. No caller boolean or successful baseline JSON can confer that credit.
"""
import argparse
from collections import Counter
import tempfile
import hashlib
from functools import lru_cache
import json
from pathlib import Path
import re
import subprocess


APPROVED_BASELINE = '930c7e80fe530323c7b5284f0fd53da20d4147b7'
APPROVED_PACKAGES = {
    'package.json': 'de9469c0af3778fefd0a3ae3eb1c5091d2f23f5697b54b87499f5d111c83c15f',
    'package-lock.json': 'af2077c414a9ddf0df825af418e7bf92b33404eb7a7128291c83e542ec5fda5e',
}


class Incomplete(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise Incomplete(message)


def git(root, *args):
    return subprocess.check_output(['git', *args], cwd=root, stderr=subprocess.DEVNULL)


def selected(name, scope):
    if scope == 'application':
        return name.startswith(('src/', 'e2e/', 'supabase/')) or name in {
            'package.json', 'package-lock.json', 'tsconfig.json', 'vitest.config.mts',
            'playwright.config.ts', 'eslint.config.mjs', 'next.config.js',
            'postcss.config.js', 'tailwind.config.ts'}
    if '__pycache__/' in name or name.endswith('.pyc'):
        return False
    return not name.startswith(('verify/', 'docs/', 'plans/', 'tasks/', 'coverage/', 'node_modules/', '.next/', 'test-results/', 'playwright-report/')) and not ('/' not in name and name.endswith('.md'))


@lru_cache(maxsize=128)
def source_items(root_name, commit, scope):
    root = Path(root_name)
    names = git(root, 'ls-tree', '-r', '--name-only', commit).decode().splitlines()
    return tuple((name, hashlib.sha256(git(root, 'show', commit + ':' + name)).hexdigest())
                 for name in names if selected(name, scope))


def source_manifest(root, commit, scope):
    require(isinstance(commit, str) and re.fullmatch(r'[0-9a-f]{40}', commit), 'invalid source commit')
    # Cache immutable Git objects only; return a copy, and check working bytes separately.
    return dict(source_items(str(root.resolve()), commit, scope))


def artifact(root, reference, *, parse=False):
    require(isinstance(reference, dict), 'missing artifact reference')
    name = reference.get('path', '')
    require(isinstance(name, str) and name.startswith(('verify/', 'docs/')), 'artifact outside evidence roots')
    path = root.resolve() / name
    require(path.resolve().is_relative_to(root.resolve()) and path.resolve() == path.absolute(), 'external/symlink artifact')
    blob = path.read_bytes()
    require(len(blob) <= 2_000_000, 'artifact exceeds bounded size')
    require(hashlib.sha256(blob).hexdigest() == reference.get('sha256'), 'artifact hash mismatch: ' + name)
    return json.loads(blob) if parse else blob.decode()


def source_check(root, value):
    require(isinstance(value, dict), 'observation manifest must be an object')
    require(value.get('schema_version') == 1, 'unsupported observation contract')
    expected = source_manifest(root, value.get('candidate_sha'), 'complete')
    require(expected == value.get('source_sha256'), 'candidate source manifest mismatch')
    require(subprocess.run(['git', 'merge-base', '--is-ancestor', value['candidate_sha'], 'HEAD'],
                           cwd=root, capture_output=True).returncode == 0, 'foreign candidate commit')
    untracked = git(root, 'ls-files', '--others', '--exclude-standard', '-z').decode().split('\0')
    require(not any(name and selected(name, 'complete') for name in untracked), 'untracked source files are not candidate-bound')
    tracked = git(root, 'ls-files', '-z').decode().split('\0')
    require(set(expected) == {p for p in tracked if p and selected(p, 'complete')}, 'tracked source set changed')
    for name, digest in expected.items():
        path = root / name
        require(path.resolve().is_relative_to(root.resolve()) and path.resolve() == root.resolve() / name and path.is_file() and not path.is_symlink() and hashlib.sha256(path.read_bytes()).hexdigest() == digest,
                'working source drift: ' + name)
    return source_manifest(root, value['candidate_sha'], 'application')


def record(root, data, source, argv, *, exit_code=0):
    require(isinstance(data, dict) and data.get('source_sha256') == source, 'missing/stale observation source scope')
    require(data.get('scope') in ('observed-current', 'historical-source-equivalent'), 'observation scope missing')
    require(source_manifest(root, data.get('observed_commit'), 'application') == source, 'observed command commit differs from current application')
    require(data.get('argv') == argv and type(data.get('exit')) is int and data['exit'] == exit_code,
            'missing/failed complete command observation')
    # Ignore only display SGR decorations while preserving/hash-checking raw bytes.
    raw = artifact(root, data.get('log'))
    return re.sub(r'(?:\x1b|\^\[)\[[0-9;]*m', '', raw)


def uncommented_test_code(text):
    code = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
    return re.sub(r'^[ \t]*//.*$', '', code, flags=re.M)


def test_lexical_controls(text):
    # Deliberately bounded lexical tripwires, not a TypeScript AST or semantic proof.
    code = uncommented_test_code(text)
    assertions = len(re.findall(r'^[ \t]*(?:await[ \t]+)?expect[ \t]*\(', code, re.M))
    disabled = Counter(re.findall(r'\b(?:test|it|describe)\s*\.\s*(?:skip|only)\b|\b(?:xit|xdescribe|xtest|fit|fdescribe)\s*\(', code))
    return assertions, disabled


def preserved_tests(root, baseline):
    require(baseline == APPROVED_BASELINE, 'baseline differs from approved original application')
    original = source_manifest(root, baseline, 'application')
    for name in original:
        if name.startswith(('src/', 'e2e/')) and ('.test.' in name or '.spec.' in name):
            before = git(root, 'show', baseline + ':' + name).decode()
            after = (root / name).read_text()
            prior_count, prior_disabled = test_lexical_controls(before)
            current_count, current_disabled = test_lexical_controls(after)
            if name.startswith('src/'):
                current_lines = {line.strip() for line in uncommented_test_code(after).splitlines()}
                for line in before.splitlines():
                    if 'expect(' in line:
                        require(line.strip() in current_lines, 'original src assertion changed/removed: ' + name)
            require(current_count >= prior_count, 'original assertion count reduced: ' + name)
            require(not (current_disabled - prior_disabled), 'new disabled/focused test control: ' + name)
    require(json.loads((root / 'tsconfig.json').read_text())['compilerOptions']['strict'] is True,
            'TypeScript strictness weakened')


def native_source_manifest(root, commit):
    # All committed runtime/workflow/application source, except this new standalone
    # validator and its fixture suite: neither is invoked by adopter-baseline.
    excluded = {'scripts/remediation-acceptance.py', 'scripts/test-remediation-acceptance.py'}
    manifest = source_manifest(root, commit, 'complete')
    for path in ('package.json', '.github/workflows/adopter-baseline.yml', 'scripts/verify-factory-least-privilege.sh'):
        if path in manifest:
            require(b'remediation-acceptance' not in git(root, 'show', commit + ':' + path), 'standalone acceptance runner entered native execution closure')
    return {name: digest for name, digest in manifest.items() if name not in excluded}


def database_source_manifest(root, commit):
    paths = ('src/app/api/waitlist/route.ts', 'supabase/migrations/20240101000000_initial_schema.sql',
             'package.json', 'package-lock.json', 'next.config.js', 'tsconfig.json', 'src/types/database.ts')
    manifest = source_manifest(root, commit, 'application')
    require(all(name in manifest for name in paths), 'database execution closure incomplete')
    route = git(root, 'show', commit + ':' + paths[0]).decode()
    route = re.sub(r'^import type .*?;\n', '', route, flags=re.M)
    require(not re.search(r"from [\"'](?:@/|\.)", route), 'new local route import requires closure review')
    return {name: manifest[name] for name in paths}


def native_baseline(root, data, source):
    require(data.get('source_sha256') == source, 'native application source mismatch')
    workflow = root / '.github/workflows/adopter-baseline.yml'
    require(hashlib.sha256(workflow.read_bytes()).hexdigest() == data.get('workflow_sha256'), 'native workflow source mismatch')
    text = workflow.read_text()
    require('  contents: read\n' in text and 'secrets.' not in text and not re.search(r'^\s+[a-z-]+: write$', text, re.M),
            'baseline credential boundary changed')
    require(isinstance(data.get('observed_head_sha'), str) and re.fullmatch(r'[0-9a-f]{40}', data['observed_head_sha']), 'native source identity missing')
    require(type(data.get('run_attempt')) is int and data['run_attempt'] > 0, 'native attempt identity missing')
    require(source_manifest(root, data['observed_head_sha'], 'application') == source, 'observed native commit application differs')
    current = git(root, 'rev-parse', 'HEAD').decode().strip()
    require(native_source_manifest(root, data['observed_head_sha']) == native_source_manifest(root, current), 'native executed runtime/helper closure differs')
    observed_workflow = git(root, 'show', data['observed_head_sha'] + ':.github/workflows/adopter-baseline.yml')
    require(observed_workflow == workflow.read_bytes(), 'observed native workflow differs from current source')
    run = artifact(root, data.get('run'), parse=True)
    jobs = artifact(root, data.get('jobs'), parse=True)
    require(run.get('repository', {}).get('full_name') == 'qyndex/nextjs-landing-page' and
            run.get('path') == '.github/workflows/adopter-baseline.yml' and run.get('status') == 'completed' and
            run.get('conclusion') == 'success' and run.get('head_sha') == data.get('observed_head_sha'), 'native run identity/status mismatch')
    require(type(run.get('id')) is int and run.get('run_attempt') == data.get('run_attempt'), 'native attempt missing')
    required = {'application-baseline (' + name + ')' for name in ('lint', 'typecheck', 'unit', 'build', 'browser', 'audit')}
    required.add('process-validation')
    rows = jobs.get('jobs', [])
    require(required == {row.get('name') for row in rows}, 'native job set incomplete/ambiguous')
    require(len(rows) == len(required), 'duplicate native jobs')
    for row in rows:
        require(row.get('run_id') == run['id'] and row.get('head_sha') == run['head_sha'] and
                row.get('status') == 'completed' and row.get('conclusion') == 'success', 'native job not successful for captured run')
    return rows


def criterion(root, ac, data, source, value):
    require(isinstance(data, dict), 'complete criterion observation missing')
    if ac == 'AC-1':
        audit = artifact(root, data.get('audit'), parse=True)
        require(data.get('source_sha256') == source and data.get('argv') == ['npm', 'audit', '--json'], 'audit source/complete graph command missing')
        counts = audit['metadata']['vulnerabilities']
        require(not any(counts.get(k, 0) for k in ('critical', 'high', 'moderate')), 'applicable moderate/high/critical findings remain')
        require(counts.get('total') == 0, 'residual risk has no authenticated decision adapter; AC1 remains pending')
    elif ac == 'AC-2':
        approved = artifact(root, data.get('approved_manifest'), parse=True)
        for path in ('package.json', 'package-lock.json'):
            require(approved[path]['proposed_sha256'] == source[path] == APPROVED_PACKAGES[path], 'package/lock differs from exact approved migration')
        rows = native_baseline(root, data.get('native', {}), source)
        for row in rows:
            if row['name'].startswith('application-baseline'):
                steps = [s for s in row.get('steps', []) if s.get('name') == 'Install the existing lockfile without lifecycle hooks']
                require(len(steps) == 1 and steps[0].get('conclusion') == 'success', 'clean npm ci step not successful')
    elif ac == 'AC-3':
        records = data.get('records', {})
        record(root, records.get('lint'), source, ['npm', 'run', 'lint'])
        negative = record(root, records.get('seeded_lint'), source, ['npm', 'run', 'lint'], exit_code=1)
        require('error' in negative and '@typescript-eslint/no-explicit-any' in negative, 'known seeded violation not rejected')
        record(root, records.get('typecheck'), source, ['npm', 'run', 'typecheck'])
        unit = record(root, records.get('unit'), source, ['npm', 'run', 'test:coverage'])
        match = re.search(r'Tests\s+(\d+) passed \((\d+)\)', unit)
        require(match is not None and int(match[1]) == int(match[2]) and int(match[1]) >= 46, 'complete original unit suite not passing')
        coverage = artifact(root, data.get('coverage'), parse=True)['total']
        require(coverage['lines']['pct'] >= 90 and coverage['branches']['pct'] >= 85, 'coverage gate not met')
        preserved_tests(root, value['baseline_sha'])
    elif ac == 'AC-4':
        native_baseline(root, data.get('native', {}), source)
        require(data.get('font_route') == 'existing public Google font download; no production credentials', 'font connectivity route unresolved')
        require('fonts.googleapis.com' in artifact(root, data.get('historical_offline_failure')), 'historical offline failure not retained')
        build = record(root, data.get('build'), source, ['npm', 'run', 'build'])
        require('Compiled successfully' in build and 'Next.js 16.' in build, 'current-major production build output missing')
    elif ac == 'AC-5':
        browser = record(root, data.get('browser'), source, ['npm', 'run', 'test:e2e', '--', '--workers=1', '--retries=0', '--reporter=line'])
        count = re.search(r'\b(\d+) passed\b', browser)
        require(count is not None and int(count[1]) >= 25 and '1 skipped' in browser and not re.search(r'\b[1-9]\d* failed\b', browser), 'complete applicable browser run not successful')
        for title in ('hero section is visible with main headline', 'navigation links are present and functional',
                      'pricing section is visible with three plans', 'FAQ section is visible and interactive',
                      'email signup shows validation error for empty submit'):
            require(title in browser, 'required browser behavior missing: ' + title)
        require('[chromium]' in browser and '[Mobile Chrome]' in browser, 'both browser projects not observed')
        expected_database = database_source_manifest(root, value['candidate_sha'])
        require(data.get('database_source_sha256') == expected_database, 'historical database source scope differs')
        require(database_source_manifest(root, data.get('database_observed_commit')) == expected_database, 'observed database commit execution closure differs')
        harness = artifact(root, data.get('database_harness'))
        harness_path = data['database_harness']['path']
        require(harness.encode() == git(root, 'show', value['candidate_sha'] + ':' + harness_path), 'database harness not bound to committed evidence')
        db_observation = artifact(root, data.get('database_observation'), parse=True)
        require(db_observation.get('candidate') == data['database_observed_commit'] and db_observation.get('status') == 'integration-passed-cleanup-complete', 'database run source/cleanup binding missing')
        db = artifact(root, data.get('database'), parse=True)
        checks = {
            'invalid-input-400',
            'actual-api-insert-201',
            'normalized-duplicate-409',
            'independent-sql-single-normalized-row',
            'anonymous-read-no-disclosure',
            'anonymous-patch-no-mutation',
            'anonymous-delete-no-mutation',
        }
        require(db.get('status') == 'pass' and set(db.get('checks', [])) == checks, 'real isolated database observations incomplete')
        require(db_observation.get('database_results') == db, 'database observation/result mismatch')
        require(data.get('database_scope') == 'historical-source-equivalent disposable local only; not hosted or native acceptance', 'database scope must stay explicit')
    elif ac == 'AC-6':
        raise Incomplete('Authenticated exact-candidate independent code/security review adapter unavailable; local records confer no native AC6 credit')
    elif ac == 'AC-7':
        preserved_tests(root, value['baseline_sha'])
        before = source_manifest(root, value['baseline_sha'], 'application')
        changed = {name for name in set(before) | set(source) if before.get(name) != source.get(name)}
        require(set(data.get('change_reasons', {})) == changed, 'complete migration behavior change explanation missing')
        require(all(isinstance(reason, str) and len(reason.strip()) >= 20 for reason in data['change_reasons'].values()), 'change explanation too short')
        require(all(before.get(name) == source.get(name) for name in set(before) | set(source) if name.startswith('supabase/')), 'database bytes changed')
        delta = git(root, 'diff', value['baseline_sha'], value['candidate_sha'], '--', 'src', 'supabase').decode()
        require(not any(re.search(r'SERVICE_ROLE|service_role', line) for line in delta.splitlines() if line.startswith('+') and not line.startswith('+++')), 'service-role addition outside scope')
    elif ac == 'AC-8':
        before = artifact(root, data.get('baseline_audit'), parse=True)['metadata']['vulnerabilities']
        after = artifact(root, data.get('final_audit'), parse=True)['metadata']['vulnerabilities']
        evidence = artifact(root, data.get('collector'), parse=True)
        body = artifact(root, data.get('body'))
        total, proven = evidence.get('ac_total'), evidence.get('ac_proven')
        missing = evidence.get('ac_unproven')
        require(type(total) is int and total == 8 and type(proven) is int and 0 <= proven <= total, 'collector counts invalid')
        require(isinstance(missing, list) and len(missing) == len(set(missing)) == total - proven and set(missing).issubset({f'AC-{n}' for n in range(1, 9)}), 'collector missing-criterion list inconsistent')
        if evidence.get('verdict') == 'PASS':
            require(proven == total and not missing and evidence.get('smoke_exit_max') == 0 and evidence.get('runner_exit') == 0, 'collector PASS contradicts acceptance/check outcomes')
        require(before['critical'] == 4 and before['high'] == 16 and after['critical'] == 0 and after['high'] == 0,
                'baseline/final audit comparison incomplete')
        require(evidence['verdict'] in ('FAIL', 'PASS') and evidence['verdict'] in body and f"{evidence['ac_proven']}/{evidence['ac_total']}" in body, 'incomplete gate reporting missing')
        require(data.get('audit_source_sha256') == source and source_manifest(root, data.get('audit_observed_commit'), 'application') == source, 'reported audit source differs')
        require(str(after['low']) + ' low' in body and 'native' in body.lower() and 'pending' in body.lower(), 'remaining findings/native limits not disclosed')
    else:
        raise Incomplete('unknown criterion')


def evaluate(root, value):
    outcomes = {}
    try:
        source = source_check(root, value)
    except (Incomplete, KeyError, OSError, subprocess.CalledProcessError, TypeError, AttributeError, json.JSONDecodeError) as error:
        return {f'AC-{n}': {'status': 'failed', 'reason': 'source binding: ' + str(error)} for n in range(1, 9)}
    for n in range(1, 9):
        ac = f'AC-{n}'
        try:
            criterion(root, ac, value.get('criteria', {}).get(ac), source, value)
            outcomes[ac] = {'status': 'passed', 'reason': 'complete local observation contract; not independent acceptance'}
        except (Incomplete, KeyError, OSError, TypeError, ValueError, AttributeError, subprocess.CalledProcessError) as error:
            outcomes[ac] = {'status': 'failed', 'reason': str(error)}
    return outcomes


def jest_results(outcomes, value):
    assertions = [{'fullName': ac + ' complete remediation criterion', 'title': ac,
                   'status': result['status'], 'failureMessages': [] if result['status'] == 'passed' else [result['reason']]}
                  for ac, result in outcomes.items()]
    return {'success': all(row['status'] == 'passed' for row in assertions),
            'numPassedTests': sum(row['status'] == 'passed' for row in assertions),
            'numFailedTests': sum(row['status'] == 'failed' for row in assertions), 'numPendingTests': 0,
            'testResults': [{'name': 'repository remediation acceptance', 'assertionResults': assertions}],
            'observation_contract': {'candidate_sha': value.get('candidate_sha') if isinstance(value, dict) else None, 'authority': 'untrusted-local-observations-only',
                                     'native_ac6_adapter': 'unavailable; fail closed'}}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--observations', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    def save(results):
        with tempfile.NamedTemporaryFile('w', dir=args.output.parent, prefix='.' + args.output.name + '.', delete=False) as stream:
            temporary = Path(stream.name)
            try:
                stream.write(json.dumps(results, indent=2) + '\n');stream.flush()
            except BaseException:
                temporary.unlink(missing_ok=True);raise
        try:
            temporary.replace(args.output)
        finally:
            temporary.unlink(missing_ok=True)
    failed = {f'AC-{n}': {'status': 'failed', 'reason': 'observation validation not completed'} for n in range(1, 9)}
    save(jest_results(failed, {}))
    try:
        value = json.loads(args.observations.read_text())
        results = jest_results(evaluate(args.root.resolve(), value), value)
    except (OSError, ValueError, TypeError, AttributeError) as error:
        results = jest_results({ac: {'status': 'failed', 'reason': 'manifest validation: ' + str(error)} for ac in failed}, {})
    save(results)
    for row in results['testResults'][0]['assertionResults']:
        print(row['title'] + ': ' + row['status'] + (' — ' + '; '.join(row['failureMessages']) if row['failureMessages'] else ''))
    return 0 if results['success'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
