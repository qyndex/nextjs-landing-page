# qyndex/nextjs-landing-page factory adoption readiness

Status: local installation proposal; activation is disabled. Application readiness and autonomous readiness are separate gates.

Repository baseline: `930c7e80fe530323c7b5284f0fd53da20d4147b7`. Harness source: [`a76b258353c0c692a80c0e40ae0ccf4d2cb4c246`](https://github.com/qyndex/claude-init/tree/a76b258353c0c692a80c0e40ae0ccf4d2cb4c246). The final source checkout was clean and immutable. Initial installation used the previously merged source; the separately recorded exact upgrade preserves the original observation. The exact installation observation is [recorded here](adoption/installation-observation.json).

## Installation observed

The initial transactional installer proposed 637 files. The [upgrade observation](adoption/upgrade-observation.json) records the subsequent merged-source upgrade. Installation, unchanged repeat (zero writes), exact revert and reinstall passed locally. Existing application/product baseline files remain byte-identical except the deliberately composed root instructions and, for brownfield, shared Claude settings. Brownfield originals are preserved in `docs/adoption/original/`; its original permission allow entries are retained alongside the harness guard settings.

`CLAUDE.md` is intentionally customized for this application. `.mcp.json` is also customized: all inherited optional servers are kept in a disabled catalog and `mcpServers` is empty, so opening an adopted session does not inherit provider connections or tool processes. Brownfield `.claude/settings.json` is also customized. The unchanged upstream ownership manifest is preserved: a subsequent automatic upgrade correctly rejects these files. Before upgrading, reconcile the upstream changes with these project customizations in an isolated branch. Do not rewrite ownership hashes to pretend customized files match stock bytes.

The installer omits generic supporting scaffold files required by structural validation. This branch explicitly adds the pinned neutral autopilot/swarm manuals and three swarm templates, plus repository-owned empty objectives/roadmap/SLO/deprecation scaffolds. These are supplemental project files, not inherited source-pilot authority. An empty SLO registry does not certify production readiness.

## Protected boundaries

No source pilot policy, receipt trust, active backlog, fleet state or live factory workflows were imported. No GitHub App was installed, no secret was copied, no main policy was changed and no production adapter was activated. Native prompts remain advisory until the guarded console and the repository's own trusted intake configuration are established. Never interpret stock prompt hooks as authenticated human-origin proof.

The selected reporting destination is the existing private `qyndex-alerts` channel, team `T0B2VADDUG4`, channel `C0C7T1Y29K5`, operator `U0B3L0TRCTA`. Each repository must have its own protected state and reporting origin; do not share the source pilot state branch, feedback database or receipt archive. Reporting is disabled pending per-repository configuration and a real receipt. Keep tokens and private keys out of this branch and chat.

## Remaining acceptance

- Run actual application lint, typecheck, tests, build and meaningful browser journey; retain failures honestly.
- Approve the bounded product/remediation specs before feature or dependency implementation.
- Review per-repository workflow/producer identities, protected environments, App scope, approved spec paths and signed exact-head evidence.
- Prove shadow eligibility and stale-head, failed-check, forged-proof, out-of-scope and recovery negatives.
- Prove real reporting and authenticated feedback delivery if those capabilities are enabled.
- Supply deployment platform, health/SLO and rollback contract before any production activation.

Use the pinned source [adopter setup](https://github.com/qyndex/claude-init/blob/a76b258353c0c692a80c0e40ae0ccf4d2cb4c246/docs/FACTORY-ADOPTER-SETUP.md), [activation guide](https://github.com/qyndex/claude-init/blob/a76b258353c0c692a80c0e40ae0ccf4d2cb4c246/docs/FACTORY-ACTIVATION.md) and [quickstart](https://github.com/qyndex/claude-init/blob/a76b258353c0c692a80c0e40ae0ccf4d2cb4c246/docs/FACTORY-ADOPTER-QUICKSTART.md) for documents intentionally not distributed locally. Source-pilot success does not certify this target.

## Native baseline CI

The new `adopter-baseline.yml` workflow uses only a read-only GitHub token, pinned checkout/runtime actions and no secrets or protected environments. It records process validation separately from application readiness. It grants no merge authority. The matrix exposes existing lint, audit and browser failures alongside the actual typecheck, unit and build results.

## Approved remediation update — 2026-10-19

The operator separately approved the exact nine-file major/toolchain migration and browser-baseline repairs. The original application baseline above is historical. The current candidate upgrades the approved dependencies/configs, fixes per-instance signup label/error IDs and repairs ambiguous hero/pricing selectors and actual mobile menu interaction. No database/schema/policy or waitlist API contract changes are included.

Local lint, strict typecheck,47unit tests and production build pass. Browser:25passed0failed1existing desktop-inapplicable mobile test skip. Audit:2low,0moderate/high/critical; no suppression. Coverage remains58.9%lines/58%branches, below90/85, and is not represented as passing. See verify/2026-10-19/T-B001-remediation for failed-first regression, before/after browser evidence, logs, screenshots and source hashes. Real database integration, complete AC proof, native exact-head independent review and factory producer/bootstrap gates remain pending. Authority/reporting/production remain disabled and this candidate remains draft.
