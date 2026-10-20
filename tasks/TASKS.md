# Tasks

Append-only product authority. Add tasks only from approved specifications and plans.

## Active

## Archive

## Factory credential boundary hardening — 2026-10-19

- [x] T-001 Narrow adopter reporting and shadow credential capabilities without activating factory authority. | spec:001 | phase:implementation | priority:normal | created:2026-10-19 | est:1h
  spec: specs/active/001-dependency-and-ci-remediation.md
  accept: bash scripts/verify-factory-least-privilege.sh

## Complete-criterion evidence mapping

- [x] T-002 Validate source-bound complete remediation observations without granting native review or residual-risk approval. | spec:001 | phase:implementation | priority:normal | created:2026-10-20 | est:1h
  spec: specs/active/001-dependency-and-ci-remediation.md
  accept: python3 scripts/test-remediation-acceptance.py

## Approved local verifier-image publisher implementation

- [x] T-004 Implement/test disabled fixed-context image publication guards; no live publication. | spec:002 | phase:implementation | priority:security | created:2026-10-21 | est:1h
  spec: specs/active/002-verifier-image-publication.md
  accept: python3 scripts/test-verifier-image-publication.py
  continuation: plans/active/002-verifier-image-publication.md
