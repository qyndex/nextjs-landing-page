---
id: 001
slug: dependency-and-ci-remediation
status: draft
owner: "@codex"
human_owner: "@qyndex"
created: 2026-10-19
updated: 2026-10-19
complexity: M
service_tier: T2
---

# Spec 001: Resolve the application verification baseline

## Problem statement

The existing landing page passes 46 unit/component tests and its TypeScript check, but has no noninteractive ESLint configuration or CI workflows. Its locked dependency audit reports 28 findings: four critical, sixteen high, five moderate and three low. Npm proposes a major Next.js upgrade for some findings. These are registry dependency findings; exploitability and residual risk require analysis rather than treating the count as proof of reachable exploits.

This draft is authorized for preparation only. Do not change application dependencies, contracts or deployment until the operator approves the scope and migration decision. Preserve the harness adoption change separately from remediation.

## Goals

- Establish reproducible noninteractive lint, typecheck, tests, production build and browser checks.
- Resolve critical/high findings where a supported fix exists; document exact residual risk and obtain explicit review for any exception.
- Preserve the existing landing page, responsive behavior, accessibility, fallback content and waitlist API contract.
- Keep database migrations, RLS and production deployment unchanged unless a separately approved requirement needs them.

## Acceptance criteria

1. **AC-1**: A refreshed audit binds exact package/lockfile bytes and identifies advisory IDs, dependency paths, affected runtime/development surfaces and remediation or exact residual-risk decisions. Critical/high findings cannot disappear through omit flags, scanner suppression or removed tests.
2. **AC-2**: The approved dependency migration uses exact reviewed direct dependency versions, a consistent committed lockfile and a clean `npm ci` install. No blind `npm audit fix --force` or unrelated stack rewrite is allowed.
3. **AC-3**: Lint runs noninteractively from a clean checkout and fails on a known seeded violation. TypeScript checking and the full existing 46-test suite pass without weakening strictness or deleting assertions.
4. **AC-4**: The production build passes in the supported CI environment. External font-fetch requirements are either explicitly provisioned or replaced by a reviewed local-font approach; an offline failure is retained separately from a successful network-enabled build.
5. **AC-5**: The actual desktop/mobile browser suite verifies headline, navigation, pricing, FAQ and signup validation behavior. Mocked API tests remain distinct from a real database-backed waitlist integration; the latter remains blocked until an isolated test database is explicitly configured.
6. **AC-6**: Repository CI runs the stack checks with read-only default token permissions, no production credentials and no automatic deployment or merge activation. A clean candidate gets actual native CI results and independent exact-head code/security review.
7. **AC-7**: All existing source/database behavior changes are explained by migration necessity and covered by regression evidence. Database policy changes, schema/data migrations and service-role credential use are excluded unless separately approved.
8. **AC-8**: The final PR reports baseline and final scanner/check results, any remaining findings and the precise tested limits. Application and autonomous-factory readiness remain blocked by unresolved applicable critical/high findings or unproven gates.

## Migration decision before implementation

Compare a supported patched release on the current major, if one addresses the actual advisories, with a supported newer Next.js major. Verify current official advisories and migration instructions before selecting a version. If a major migration is necessary, present the exact compatibility changes and rollback plan for approval. Align ESLint and React tooling with the selected framework; do not add a linter version incompatible with it merely to silence the initialization prompt.

The registry suggested Next.js 16.4.2 in the initial observation; this is an audit suggestion, not an approved version choice or evidence of compatibility. Recheck before implementation.

## Sequence and rollback

Approve the migration proposal; establish reproducible red checks; update the smallest dependency/tooling set; verify unit/type/lint/build/browser behavior; obtain independent review; merge through the adopter's own protected process. Revert the migration commit/lockfile through a reviewed PR if needed; do not roll back database data or reporting state. Production remains disabled until a separate target-specific health/rollback contract is proven.
