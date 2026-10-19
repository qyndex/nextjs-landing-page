#!/usr/bin/env python3
"""Offline contract fixtures; every record here is synthetic, never live acceptance."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import sys
sys.dont_write_bytecode = True
import unittest

SPEC = importlib.util.spec_from_file_location('acceptance', Path(__file__).with_name('remediation-acceptance.py'))
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class AcceptanceContract(unittest.TestCase):
    def setUp(self):
        self.folder = tempfile.TemporaryDirectory(prefix='remediation-contract-')
        self.addCleanup(self.folder.cleanup)
        self.root = Path(self.folder.name)
        for name, content in {'src/original.test.ts': 'expect(actual).toBe(expected);\n',
                              'package.json': '{}\n', 'package-lock.json': '{}\n',
                              'scripts/helper.py': 'print(1)\n',
                              '.github/workflows/adopter-baseline.yml': 'permissions:\n  contents: read\n',
                              'tsconfig.json': '{"compilerOptions":{"strict":true}}\n',
                              'vitest.config.mts': 'thresholds: { lines: 90, branches: 85 }\n'}.items():
            p = self.root / name;p.parent.mkdir(parents=True, exist_ok=True);p.write_text(content)
        for command in (['git', 'init', '-q'], ['git', 'add', '.'],
                        ['git', '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'fixture']):
            subprocess.run(command, cwd=self.root, check=True, capture_output=True)
        self.commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=self.root, text=True).strip()
        old_baseline = MODULE.APPROVED_BASELINE
        MODULE.APPROVED_BASELINE = self.commit
        self.addCleanup(setattr, MODULE, 'APPROVED_BASELINE', old_baseline)
        self.source = MODULE.source_manifest(self.root, self.commit, 'application')
        self.value = {'schema_version': 1, 'candidate_sha': self.commit,
                      'source_sha256': MODULE.source_manifest(self.root, self.commit, 'complete'),
                      'baseline_sha': self.commit, 'criteria': {}}
        records = {}
        for name, argv, exit_code, text in [
            ('lint', ['npm', 'run', 'lint'], 0, 'eslint src e2e\n'),
            ('seeded_lint', ['npm', 'run', 'lint'], 1, 'error Unexpected any @typescript-eslint/no-explicit-any\n'),
            ('typecheck', ['npm', 'run', 'typecheck'], 0, 'tsc --noEmit\n'),
            ('unit', ['npm', 'run', 'test:coverage'], 0, 'Tests 58 passed (58)\n')]:
            records[name] = {'argv': argv, 'exit': exit_code, 'source_sha256': self.source,
                             'scope': 'historical-source-equivalent', 'observed_commit': self.commit, 'log': self.artifact(name + '.log', text)}
        coverage = {'total': {'lines': {'pct': 97.94}, 'branches': {'pct': 94}}}
        self.value['criteria']['AC-3'] = {'records': records, 'coverage': self.artifact('coverage.json', json.dumps(coverage))}

    def artifact(self, name, content):
        path = self.root / 'verify/fixture' / name;path.parent.mkdir(parents=True, exist_ok=True);path.write_text(content)
        return {'path': str(path.relative_to(self.root)), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}

    def result(self, value=None):
        return MODULE.evaluate(self.root, value or self.value)

    def test_complete_source_equivalent_local_criterion_passes_only_its_own_ac(self):
        result = self.result()
        self.assertEqual(result['AC-3']['status'], 'passed')
        self.assertEqual(result['AC-6']['status'], 'failed')
        self.assertEqual(result['AC-1']['status'], 'failed')

    def test_stale_candidate_manifest_cannot_pass(self):
        value = copy.deepcopy(self.value);value['source_sha256']['package.json'] = '0' * 64
        self.assertEqual(self.result(value)['AC-3']['status'], 'failed')

    def test_changed_working_source_cannot_pass(self):
        (self.root / 'package.json').write_text('{"changed":true}\n')
        self.assertEqual(self.result()['AC-3']['status'], 'failed')

    def test_partial_criterion_is_not_proved_by_one_green_check(self):
        del self.value['criteria']['AC-3']['records']['seeded_lint']
        self.assertEqual(self.result()['AC-3']['status'], 'failed')

    def test_stale_historical_source_cannot_be_relabelled_current(self):
        self.value['criteria']['AC-3']['records']['unit']['source_sha256']['package.json'] = '1' * 64
        self.assertEqual(self.result()['AC-3']['status'], 'failed')

    def test_modified_log_hash_is_rejected(self):
        record = self.value['criteria']['AC-3']['records']['unit']
        (self.root / record['log']['path']).write_text('Tests 58 passed (58)\nforged extra bytes\n')
        self.assertEqual(self.result()['AC-3']['status'], 'failed')

    def test_failed_or_missing_actual_unit_output_is_rejected(self):
        for failure in ('exit', 'text'):
            value = copy.deepcopy(self.value)
            if failure == 'exit':
                value['criteria']['AC-3']['records']['unit']['exit'] = 1
            else:
                value['criteria']['AC-3']['records']['unit']['log'] = self.artifact('partial.log', 'one selected test passed\n')
            self.assertEqual(self.result(value)['AC-3']['status'], 'failed')

    def test_caller_booleans_and_fake_native_json_never_prove_ac6(self):
        self.value['criteria']['AC-6'] = {'passed': True, 'independent': True, 'head_sha': self.commit,
                                        'checks': [{'conclusion': 'success'}], 'reviews': ['code', 'security']}
        self.assertEqual(self.result()['AC-6']['status'], 'failed')

    def test_external_or_symlink_artifact_is_rejected(self):
        record = self.value['criteria']['AC-3']['records']['unit']
        record['log']['path'] = '../outside.log'
        self.assertEqual(self.result()['AC-3']['status'], 'failed')

    def test_wrong_baseline_cannot_hide_removed_assertions(self):
        self.value['baseline_sha'] = '0' * 40
        self.assertEqual(self.result()['AC-3']['status'], 'failed')

    def test_existing_residual_low_findings_stay_pending_despite_claimed_approval(self):
        self.value['criteria']['AC-1'] = {
            'source_sha256': self.source, 'argv': ['npm', 'audit', '--json'],
            'approved': True, 'risk_accepted': True,
            'audit': self.artifact('audit.json', json.dumps({'metadata': {
                'vulnerabilities': {'low': 2, 'moderate': 0, 'high': 0, 'critical': 0, 'total': 2}}}))}
        self.assertEqual(self.result()['AC-1']['status'], 'failed')

    def test_partial_database_observations_do_not_prove_browser_criterion(self):
        names = ['hero section is visible with main headline', 'navigation links are present and functional',
                 'pricing section is visible with three plans', 'FAQ section is visible and interactive',
                 'email signup shows validation error for empty submit']
        self.value['criteria']['AC-5'] = {
            'browser': {'argv': ['npm', 'run', 'test:e2e', '--', '--workers=1', '--retries=0', '--reporter=line'],
                        'exit': 0, 'scope': 'historical-source-equivalent', 'observed_commit': self.commit, 'source_sha256': self.source,
                        'log': self.artifact('browser.log', '[chromium] [Mobile Chrome] 25 passed 1 skipped\n' + '\n'.join(names))},
            'database_source_sha256': self.source,
            'database_scope': 'historical-source-equivalent disposable local only; not hosted or native acceptance',
            'database': self.artifact('db.json', json.dumps({'status': 'pass', 'checks': ['actual-api-insert-201']}))}
        self.assertEqual(self.result()['AC-5']['status'], 'failed')

    def report_fixture(self, proven=3, verdict='FAIL'):
        return {
            'baseline_audit': self.artifact('before.json', json.dumps({'metadata': {'vulnerabilities': {'critical': 4, 'high': 16}}})),
            'final_audit': self.artifact('after.json', json.dumps({'metadata': {'vulnerabilities': {'critical': 0, 'high': 0, 'low': 2}}})),
            'collector': self.artifact('collector.json', json.dumps({'ac_proven': proven, 'ac_total': 8, 'ac_unproven': [f'AC-{n}' for n in range(proven + 1, 9)], 'verdict': verdict, 'smoke_exit_max': 0, 'runner_exit': 0})),
            'body': self.artifact('body.md', f'Verdict {verdict}; {proven}/8 proven; 2 low; native review pending'),
            'audit_source_sha256': self.source, 'audit_observed_commit': self.commit,
        }

    def test_truthful_nonzero_counts_and_later_pass_verdict_are_reportable(self):
        for proven, verdict in ((3, 'FAIL'), (8, 'PASS')):
            self.value['criteria']['AC-8'] = self.report_fixture(proven, verdict)
            self.assertEqual(self.result()['AC-8']['status'], 'passed')

    def test_false_counts_or_stale_audit_cannot_pass_reporting(self):
        for change in ('counts', 'audit'):
            data = self.report_fixture()
            if change == 'counts':
                data['body'] = self.artifact('false-body.md', 'FAIL 8/8 2 low native pending')
            else:
                data['audit_source_sha256'] = {}
            self.value['criteria']['AC-8'] = data
            self.assertEqual(self.result()['AC-8']['status'], 'failed')

    def test_native_capture_cannot_relabel_an_unrelated_successful_commit(self):
        (self.root / 'package.json').write_text('{"unrelated":true}\n')
        subprocess.run(['git', 'add', 'package.json'], cwd=self.root, check=True, capture_output=True)
        subprocess.run(['git', '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'unrelated'], cwd=self.root, check=True, capture_output=True)
        foreign = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=self.root, text=True).strip()
        subprocess.run(['git', 'reset', '--hard', self.commit], cwd=self.root, check=True, capture_output=True)
        workflow = self.root / '.github/workflows/adopter-baseline.yml'
        data = {'source_sha256': self.source, 'observed_head_sha': foreign, 'run_attempt': 1,
                'workflow_sha256': hashlib.sha256(workflow.read_bytes()).hexdigest()}
        with self.assertRaisesRegex(MODULE.Incomplete, 'observed native commit application differs'):
            MODULE.native_baseline(self.root, data, self.source)

    def test_historical_command_commit_is_derived_not_accepted_from_caller_hashes(self):
        self.value['criteria']['AC-3']['records']['unit']['observed_commit'] = '0' * 40
        self.assertEqual(self.result()['AC-3']['status'], 'failed')

    def test_native_capture_rejects_changed_executed_helper_even_with_same_app(self):
        (self.root / 'scripts/helper.py').write_text('print(2)\n')
        subprocess.run(['git', 'add', 'scripts/helper.py'], cwd=self.root, check=True, capture_output=True)
        subprocess.run(['git', '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.test', 'commit', '-qm', 'helper drift'], cwd=self.root, check=True, capture_output=True)
        workflow = self.root / '.github/workflows/adopter-baseline.yml'
        data = {'source_sha256': self.source, 'observed_head_sha': self.commit, 'run_attempt': 1,
                'workflow_sha256': hashlib.sha256(workflow.read_bytes()).hexdigest()}
        with self.assertRaisesRegex(MODULE.Incomplete, 'native executed runtime/helper closure differs'):
            MODULE.native_baseline(self.root, data, self.source)

    def test_untracked_selected_source_and_symlink_ancestor_are_rejected(self):
        new = self.root / 'scripts/untracked.py';new.write_text('print(9)\n')
        self.assertEqual(self.result()['AC-3']['status'], 'failed')
        new.unlink()
        with tempfile.TemporaryDirectory(prefix='external-source-') as outside:
            external = Path(outside);(external / 'original.test.ts').write_text('expect(actual).toBe(expected);\n')
            (self.root / 'src/original.test.ts').unlink();(self.root / 'src').rmdir()
            (self.root / 'src').symlink_to(external, target_is_directory=True)
            self.assertEqual(self.result()['AC-3']['status'], 'failed')

    def test_overcount_and_partial_pass_verdict_are_rejected(self):
        for counts in ({'ac_proven': 9, 'ac_total': 8, 'ac_unproven': [], 'verdict': 'PASS'},
                       {'ac_proven': 3, 'ac_total': 8, 'ac_unproven': ['AC-4', 'AC-5', 'AC-6', 'AC-7', 'AC-8'], 'verdict': 'PASS'}):
            data = self.report_fixture()
            data['collector'] = self.artifact('inconsistent.json', json.dumps(counts))
            self.value['criteria']['AC-8'] = data
            self.assertEqual(self.result()['AC-8']['status'], 'failed')

    def test_native_styled_unit_output_is_read_without_modifying_artifact(self):
        text = '^[[2m      Tests ^[[22m ^[[1m^[[32m58 passed^[[39m^[[22m^[[90m (58)^[[39m\n'
        reference = self.artifact('styled-unit.log', text)
        self.value['criteria']['AC-3']['records']['unit']['log'] = reference
        self.assertEqual(self.result()['AC-3']['status'], 'passed')
        self.assertEqual((self.root / reference['path']).read_text(), text)

    def test_results_emit_real_failed_assertions_without_skip_credit(self):
        result = MODULE.jest_results(self.result(), self.value)
        assertions = result['testResults'][0]['assertionResults']
        self.assertEqual(len(assertions), 8)
        self.assertFalse(result['success'])
        self.assertEqual({r['status'] for r in assertions}, {'passed', 'failed'})
        self.assertNotIn('pending', {r['status'] for r in assertions})


if __name__ == '__main__':
    unittest.main(verbosity=2)
