# Brownfield remediation observation runner review

Read-only static review2026-10-20 of `/private/tmp/factory-least-privilege-nextjs-20261019/scripts/remediation-acceptance.py` against original Spec001 AC1–8. No expensive checks, remote requests, database actions, protected reads or source edits. This report is outside frozen publication/maintenance manifests. The implementation is in progress; the author has been notified and is correcting findings. Re-review corrected bytes before treating these findings as closed.

## Required corrections found

1. **Native historical source binding — AC2/AC4.** `native_baseline()` compares `data.source_sha256` to current application hashes and captured run.head_sha to caller-supplied observed_head_sha. It never derives application hashes from that observed immutable Git commit or compares that commit's workflow bytes. A successful unrelated historical run plus an invented current source map could receive local AC2/AC4 credit. Derive observed application and workflow source from Git, require exact equivalence to the declared exercised scope, and validate captured run/job/attempt identity. Source equivalence permits honest historical credit; it is not a substitute for AC6 authenticated independent review.

2. **Database historical source binding — AC5.** `database_source_sha256 == source` is a caller assertion. Checking a referenced JSON's status and seven check names does not bind those observations to the actually exercised snapshot. Require the retained observation's source identity and explicit immutable source manifest/commit to match the current exercised database closure. A deliberately narrow closure is appropriate: actual waitlist route and imported validation/runtime helpers, migration/RLS, package/lock and relevant runtime configuration. Unrelated UI/E2E files need not match. Do not call two arbitrary caller-supplied source fields independent evidence. Preserve the exact historical disposable-local scope and never award hosted/current-head/native execution credit.

3. **Working-tree source completeness and ancestor symlinks.** `source_check()` only checks tracked selected paths and rejects leaf symlinks. An untracked selected application file can influence runtime/tests without entering the source manifest, and an ancestor directory symlink can pass the leaf check. Require source paths resolve inside the root without symlink traversal, and reject relevant untracked source files. Artifact references already compare resolved/absolute paths and enforce root containment; preserve that boundary.

4. **AC8 frozen zero/FAIL assumption.** At initial inspection AC8 required literal0/N and FAIL in the final body regardless of actual collector values. This is a stale reporting contract, not the criterion. Validate the collector's actual total/proven/unproven/verdict and its matching complete body block, while requiring the body to disclose remaining findings and gates honestly. Source-only, historical and native limits must remain visible. Parent had already flagged this; no additional expansion is needed.

## Correct boundaries to preserve

- AC6 unconditionally fails until an independently reviewed authenticated exact-candidate review adapter exists. No local boolean, captured successful baseline JSON or passing fixture may confer independent native code/security-review credit.
- All supplied files/logs remain untrusted local observations. SHA256 establishes byte integrity/source equivalence, not authorship or native authority. Retain that statement in both output metadata and criterion descriptions.
- Original Spec001 requires complete criteria. Avoid passing a whole AC on an isolated check: AC1 needs detailed complete dependency/advisory analysis and any actual residual decision; current residual-low handling is conservatively pending without an authenticated decision adapter. AC3's textual assertion preservation is a bounded check, not a semantic guarantee against a dishonest test rewrite; genuine independent review remains essential. AC7's change reasons similarly support review without proving migration necessity by themselves.
- Passing local AC2/4 after authentic source-equivalence validation can describe source-equivalent historical native baseline observations, but must not claim the new candidate was itself executed in that run. AC5 must distinguish mocked browser/API tests from the real disposable database observation.
- Keep original AC numbers and honest aggregate failure. A runner that passes five local observation contracts and fails three criteria must report5/8 with the actual three failures, not0/8 and not full readiness. No detector, test, scope or acceptance weakening is warranted.

## Publication/readiness verdict

The initial runner needs the four corrections above before its local whole-criterion mapping is reliable. These are evidence-binding/reporting fixes within the current task, not authorization for provider/deployment/state operations. Original native independent review and factory activation remain pending even after local observation parsing is corrected. No successful application, native CI, product or factory acceptance run was performed by this reviewer.

## Corrected-source re-review — 2026-10-20

Ran only `python3 -B scripts/test-remediation-acceptance.py`:19 offline fixture tests passed in3.800s. No expensive app/browser/database checks or remote operations ran. These fixtures do not confer native acceptance.

- Finding1 **closed statically**: native application hashes are derived from observed Git commit; full committed runtime/helper closure and observed workflow bytes must match current source. Only the standalone new validator and its fixture suite are excluded, with checks preventing their explicit introduction into the package/workflow/least-privilege verifier execution entrypoints. This intentionally scoped source equivalence is not an assertion the new validator ran historically.
- Finding2 **closed statically**: database binding derives a fixed seven-file route/migration/package/lock/config/type closure at current and observed commits, rejects new local route imports pending closure review, binds the retained harness to committed evidence and requires the source/cleanup observation's exact database results. Scope remains historical disposable-local, not hosted/current native execution.
- Finding3 **closed statically**: selected untracked sources and ancestor symlink traversal now fail before criterion evaluation. Existing artifact containment/hash bounds remain intact.
- Finding4 **partly closed, one small correction remains**: AC8 accepts matching nonzero counts and later PASS instead of hardcoded0/FAIL, with stale audit source derivation. It still does not validate internal collector count/verdict consistency. A collector claiming9/8 or PASS3/8 can satisfy the current substring comparison if the body repeats it. Require integer total8, bounded proven count, matching unique original unproven IDs and a verdict consistent with AC/smoke/runner failures. Add bounded negative fixtures for overcount and contradictory partial PASS. The author has been notified; no broad framework expansion is requested.

AC6 remains correctly fail closed. No independent factory/product/native acceptance credit is granted by this re-review.

## Final bounded re-review — 2026-10-20

Finding4 **closed**: AC8 now requires integer total8, bounded proven count, a unique valid unproven set of matching size, and full proof/no missing IDs/zero smoke and runner exits for PASS. Matching body text cannot admit9/8 or partial PASS. Ran `python3 -B scripts/test-remediation-acceptance.py` again:20 offline fixture tests passed in2.321s, including both inconsistency negatives.

Immutable Git manifest caching stores tuples keyed by resolved repository, exact commit and scope; callers receive fresh dictionaries. Working-tree bytes and artifact bytes are still read and checked each evaluation. This does not cache mutable working source or weaken drift detection.

Final reviewed source SHA256: `bf5a61a0d4b9d297527cc96ccf42c4d89a9e640ad5163cf198d957955c418b6f`; fixture suite SHA256: `138633fb1f06caf42e81fc70cfb72899ba7aaf28a641f876e2cff41a94d91db9`.

No remaining blocker from these four findings for the expressly untrusted local observation runner. Residual-low risk decision and authenticated independent native AC6 remain genuinely pending. No native acceptance, expensive application/browser/database checks or live effects were performed during this review.

## Narrow log-display compatibility re-review

Reviewed only the two-script diff `56fbe3..a0f2bf641f940616d264a95526a4850f3d5f2fa6`. Raw artifact hashing still occurs before parsing. `record()` strips only actual ESC or literal caret-rendered SGR display decorations for text matching; it does not rewrite the retained artifact. Browser argv is bound to the exact actually observed `--workers=1 --retries=0 --reporter=line` command. Neither change grants extra command, source or native-review authority.

Independently ran the bounded fixture suite:21 tests passed in3.245s, including styled-unit output without artifact mutation. No blocker found in this narrow compatibility change. Final reviewed runner SHA256 `756d472b9f55ef016b829fdf067dd1d0aa3548d2ee650ea00aa463f7425f2a60`; test SHA256 `d5a3097098a442d5b36ce00bf444e8e46a8c778b7655465b5e4ec1df56fbcf42`. Earlier hashes above remain historical review observations. Full application collection and native acceptance were not run by this reviewer.
