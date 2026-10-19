# Brownfield application baseline

Baseline: `930c7e80fe530323c7b5284f0fd53da20d4147b7`.

- Existing unit/component suite: 46 tests across six files passed before adoption.
- Existing TypeScript check: passed. Next.js generated its normal declaration file during baseline commands.
- Lint: exits 1 and prompts to initialize ESLint; there is no committed ESLint configuration or dependency. Do not report this as a successful lint gate.
- Initial production build: failed because sandbox DNS could not fetch Google Inter font. The unchanged network-permitted rerun passed; the initial failure remains visible.
- Registry lockfile audit: 28 findings (4 critical, 16 high, 5 moderate, 3 low). This is a dependency inventory count, not 28 proven reachable exploits. The proposed Next.js fix crosses a major version; do not run force-fix during adoption. Review the separate remediation spec.
- Existing desktop/mobile browser suite after installation: 17 passed, 8 failed, 1 skipped. Failures include ambiguous signup/pricing locators and mobile navigation expectations. Source and tests are unchanged; these are baseline test/application mismatches, not passing acceptance. The skipped signup case does not verify a real database.
- Post-adoption unit suite: all 46 tests still pass.
- No GitHub Actions workflows existed at the baseline.
- Real database, waitlist delivery and deployment/rollback are not verified by mocked unit tests or a fallback-content browser run.

The adoption branch preserves all `src/`, `supabase/`, package/lockfile, Docker and existing test bytes. New product work must use an approved specification. Activation remains blocked until the applicable baseline failures are resolved and independent exact-head acceptance is recorded.
