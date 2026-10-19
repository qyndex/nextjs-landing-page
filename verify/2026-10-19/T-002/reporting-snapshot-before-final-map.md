## Summary

Reporting previously exposed an unused legacy state credential and shadow unnecessarily received Contents/PR write. The patch requires App-only reporting, ordinary read-scoped source access and validated merge mode before write-token mint. A repository-specific observation validator now checks complete remediation criteria and source-equivalent historical evidence without changing generic gates or granting independent-review authority.

**Draft only. Full unskipped Spec001 collector: FAIL0/8, smoke0 on a0f2bf641f940616d264a95526a4850f3d5f2fa6.** The separate supplemental mapping last completed5/8 with CLIexit1; these are untrusted local observations, not full/native acceptance. Factory activation, readiness exceptions, production and merging remain unapproved.

## Spec / Plan

- Spec: `specs/active/001-dependency-and-ci-remediation.md`
- Plan: `plans/active/001-dependency-and-ci-remediation.md`
- Tasks: `T-001`, `T-002`

## What changed

- Four reporting workflows require App-only state writes; shadow uses Contents/PR-read while conservatively retaining Checks-write.
- Fifteen offline credential/route authorization methods and twenty-one acceptance-contract fixture methods pass, with genuine initial failures retained.
- The acceptance validator rejects stale source/artifact hashes, partial observations, unrelated native runs, changed helper closures, dirty/symlinked source and inconsistent counts. Actual browser argv and raw native log bytes are preserved.
- AC6 stays failed without a separately reviewed authenticated exact-candidate independent-review adapter. No supplied approval boolean accepts residual risk.

## Evidence Bundle

## Evidence Bundle — Spec 001 (001-dependency-and-ci-remediation)
Spec: `specs/active/001-dependency-and-ci-remediation.md` · Commit: `a0f2bf6`

Retained results: [verify/2026-10-20-001-dependency-and-ci-remediation/attempt-6OstxolE/results.json](verify/2026-10-20-001-dependency-and-ci-remediation/attempt-6OstxolE/results.json)

### Acceptance criteria (0/8 proven)
| AC | Proven by | Result |
|----|-----------|--------|
| AC-1 | — | ✗ UNPROVEN |
| AC-2 | — | ✗ UNPROVEN |
| AC-3 | — | ✗ UNPROVEN |
| AC-4 | — | ✗ UNPROVEN |
| AC-5 | — | ✗ UNPROVEN |
| AC-6 | — | ✗ UNPROVEN |
| AC-7 | — | ✗ UNPROVEN |
| AC-8 | — | ✗ UNPROVEN |

### Smoke test (exit codes are load-bearing)
```
# Smoke test — 2026-10-20T00:13:39+11:00
$ bash .claude/scripts/verify.sh

→ Integration coverage gate
  ✓ changed API/DB files have integration tests

verify: PASS
exit: 0
---
```

### Visual proof
0 screenshot(s) captured under `verify/2026-10-20-001-dependency-and-ci-remediation/screenshots/` (named by AC).

### API traces
0 API trace file(s) under `verify/2026-10-20-001-dependency-and-ci-remediation/traces/`; full HAR at `verify/2026-10-20-001-dependency-and-ci-remediation/network.har`.

### Coverage
line 97.94% · branch 94% (gate: line≥90 branch≥85)

### Verdict: **FAIL**


## Supplemental local observation mapping

Earlier complete-input attempt:2/8, CLIexit1; corrected source-equivalent native logs plus actual seeded lint negative:5/8, CLIexit1. These observations remain separate from the unchanged full unskipped collector0/8. AC1 residual-risk decision and AC6 authenticated independent review remain pending; a newly located original baseline audit is being added to the reporting observation separately, without rerunning or relabeling it.

Original audit:28 findings (4 critical,16 high,5 moderate,3 low) on original930c7e8. Fresh complete audit on unchanged package/lock bytes:2 low,0 moderate/high/critical. The residual low Supabase-chain assessment is proposed, not operator accepted. No omit flag, scanner suppression or deleted assertion hides a finding. All original database files stay unchanged.

Actual published-head native baseline run39255960045 attempt1 has seven successful jobs at b408a374f04533f3efe9bda0634277a381573206. Its logs/metadata are supplied local observations, source-equivalent to the application/helper closure, not claims that a0f2 or subsequent proof commits ran CI. Actual disposable-local database checks bind d356cc1 and the narrow verified route/type/migration/package/lock/startup closure; hosted database/deployment are unproven. The small seeded lint control actually rejected its one declared temporary fixture, which was removed afterward.

## Tests and limits

Local credential suite15PASS; acceptance fixtures21PASS. Actual native application lint/typecheck/unit/build/browser/audit outputs are retained on their exact historical head. Independent local review closed four source-binding/count findings and ran21fixtures; it is not authenticated native review. Final-source Semgrep has0findings/0errors. Raw observation manifests trigger secret-scanner false positives on verified public source SHA256 values; findings/adjudication and lossless path+sha256 presentation remain explicit, without scanner suppression or value hiding. Selected public proof scanning is recorded separately.

## Risk + rollback

Full acceptance and native exact-candidate independent code/security review remain unproven. Supplied hashes detect drift, not authorship. No keys, live flags, state, protected environment or protection policy were changed. Reporting stays disabled. Roll back any later merge through a reviewed revert PR against its recorded merge SHA; no database migration or production release is introduced.

## Reviewer checklist

- [ ] Full Spec001 acceptance (unskipped collector remains0/8)
- [x] Bounded local negative contracts and honest historical/source-equivalent evidence
- [ ] Authenticated exact-candidate independent code/security review
- [ ] Residual-risk decision and separately authorized activation/merge
