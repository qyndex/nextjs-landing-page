---
id: 001
slug: dependency-and-ci-remediation
status: review
spec: specs/active/001-dependency-and-ci-remediation.md
created: 2026-10-19
updated: 2026-10-19
---

# Plan001: Approved dependency and browser baseline remediation

Operator approved the exact nine-file migration on2026-10-19 (patchSHA256 e9a3bc9f336c5afb3e8326f5613a6a560e11ab91d8598eecc4980f16a629b66d), its stated browser support floor and browser-baseline repairs. Merge and factory activation remain blocked pending their own evidence/review. Database/schema/policy/deployment changes are excluded.

1. Preserve original audit/native/unit/browser failures and bind exact approved package/lockfile/config migration (AC1/2).
2. Apply the reviewed patch after baseline/hash validation; clean npmci with lifecycle scripts disabled (AC2).
3. Prove noninteractive lint and seeded rejection, strict typecheck and all existing tests; add per-form label/error isolation regression before fixing duplicateIDs (AC3/7).
4. Build the actual application, run full desktop/mobile journey and inspect screenshots. Repair selector ambiguity and actual mobile interactions without deleting assertions or adding skips (AC4/5/7).
5. Keep the full audit and two low residual Supabase-chain findings visible. Obtain fresh native CI and independent exact-head code/security review (AC1/6/8).
6. Retain complete collector output in the draft PR. No genuine database integration, deployment, missing factory producer proof or source-pilot receipt is substituted for target acceptance (AC5/6/8).

Rollback is a reviewed code/lockfile revert; never reset database or reporting state. Original vulnerabilities mean rollback does not authorize activation.

## Bounded credential hardening continuation

Resolve retained bootstrap F5/F7 in adopter workflow definitions only: require App-only reporting jobs, avoid unused legacy credentials/ordinary token write authority, and select Contents/PR-read for shadow while preserving eligibility Checks-write. Reject forbidden merge before write-token mint. Keep all live flags, secrets, profile registrations and protection unchanged; whole-spec/native acceptance remains pending. scripts/verify-factory-least-privilege.sh provides offline authorization/route regressions, with separate YAML validation and later genuine native permission checks.
