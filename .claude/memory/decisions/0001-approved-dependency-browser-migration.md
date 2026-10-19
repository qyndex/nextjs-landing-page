---
name: 0001-approved-dependency-browser-migration
description: Approved exact migration and browser baseline repairs; activation remains blocked
status: accepted
created: 2026-10-19
metadata:
  type: decision
  status: accepted
---

# ADR0001: Approved dependency and browser migration

- **Date**: 2026-10-19
- **Deciders**: @qyndex
- **Owners**: [@qyndex]
- **written_by**: architect
- **source_session**: Explicit operator reply in Codex,2026-10-19
- **last_verified**: 2026-10-19
- **Tags**: architecture dependencies browser-baseline
- **subsystem**: application

## Context

Next14 baseline had four critical/sixteen high audit findings, unconfigured lint and eight browser failures. Disposable compatibility preparation passed lint/type/46unit/build and exposed two low residual SDK-chain findings; all original failures were retained.

## Decision

Operator approved the exact manifest-bound Next16/React19/Tailwind4/toolchain migration and browser-baseline repairs, accepting Safari16.4+,Chrome111+,Firefox128+ support floor. Preserve independent code/security review, full before/after evidence and all main gates. Keep database changes, deployment, secrets, merging and factory activation outside this approval.

## Consequences and alternatives

Modern browser support is an explicit compatibility change. The unchanged Supabase SDK retains two low audit findings; no finding is suppressed. Deferring the migration would leave the known baseline critical/high findings and activation blocked. Blind audit-force fixes and replacing tests with skips were rejected.

## Re-verification triggers

Revisit for changed advisory/lockfile bytes, older-browser requirements, actual waitlist integration or deployment. Such changes do not inherit this exact approval silently.

## References

- Spec: specs/active/001-dependency-and-ci-remediation.md
- Plan: plans/active/001-dependency-and-ci-remediation.md
- Exact migration: docs/adoption/approved-migration/
