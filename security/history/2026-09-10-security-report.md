# tattoin security report — 2026-09-10

- Repository: `/home/anandabagus/workspace/repos/tattoin`
- Scan date: `2026-09-10` (Thursday, Asia/Makassar)
- Mode: Thursday quick targeted regression + bounded static review
- Status: **ATTENTION REQUIRED**
- Strix: **NOT RUN** — `/usr/bin/bash: line 5: strix: command not found`; Docker `29.6.0`; `LLM_API_KEY` and `STRIX_LLM` unset.

## Executive summary
Coverage incomplete. No deployed target was scanned. Existing working-tree changes were preserved. Product code, dependencies, schema, infrastructure, secrets, and repository history were not modified by this audit.
No material finding was confirmed from limited checks performed for this repository.

## Changes
Working-tree changes pre-existed this run. No audit-generated product changes.

## New / existing / fixed / regression findings
- New: none dynamically validated; static findings below are open current-state findings.
- Existing: prior state was not available as a trusted baseline for every repository.
- Fixed: none verified during this run.
- Regression: no fix regression could be established without a prior verified baseline.

## Findings index
- None confirmed within limited review scope.

## Detailed findings
## Dependency review
Manifest/lockfile review performed where available. Automated CVE scan NOT RUN.

## Authentication and authorization review
Selected auth/session/admin boundaries reviewed where applicable; full multi-role dynamic coverage NOT REVIEWED.

## API review
Selected endpoints and input boundaries reviewed; full endpoint inventory and black-box validation NOT REVIEWED.

## Database and data integrity review
Static review only. No database mutation, migration execution, or destructive operation performed.

## Infrastructure and configuration review
Selected Docker/Compose, runtime, CI, and environment configuration reviewed.

## Secret review
No secret values retained in artifacts. Sensitive values omitted or represented as `[REDACTED]`.

## Strix review
NOT RUN. CLI unavailable; no SARIF, proof-of-concept, or validated Strix finding exists.

## Validation evidence
- Tests passed: No repository-specific validation command executed.
- Tests failed or blocked: Full validation not run.

## Remaining risks
- Full Strix validation unavailable.
- Dynamic deployed-target testing unavailable; no staging authorization or target supplied.
- Full dependency CVE analysis, authenticated role matrix, and complete endpoint coverage remain incomplete.

## Next actions
1. Install/configure approved local Strix; scan clean isolated copies with `-n`, explicit mode, and explicit budget.
2. Restore clean dependency state and rerun blocked checks.
3. Triage open findings through Architect → Planner → Coder → QA/security; do not mark fixed before retest.

## Incomplete areas
- Deployed black-box testing, full dependency vulnerability audit, authenticated multi-role testing, and complete endpoint coverage: NOT REVIEWED.

## Exact commands
- `date -u "+UTC %Y-%m-%d %H:%M:%S %Z"`
- `TZ=Asia/Makassar date "+WITA %Y-%m-%d %H:%M:%S %Z %A"`
- `command -v strix`
- `strix --version` (unavailable)
- `docker info --format '{{.ServerVersion}}'` → `29.6.0`

## Final assessment
CONDITIONALLY READY for limited static scope only; not a complete security clearance.

No confirmed vulnerabilities were identified within the scope and tests completed during this run.


## Scheduled-run update — 2026-09-10 (Thursday quick targeted regression)

- Audit time: 2026-09-10 10:02 WITA; scope: `/home/anandabagus/workspace/repos`.
- Repository discovery: 27 direct Git repositories; symlinked entries rejected; no external URL scanned.
- Strix: **NOT RUN** — `strix` unavailable. Docker `29.6.0` is running. No source upload, managed cloud scan, or black-box target test.
- Safety: no product code, dependency, schema, infrastructure, secret, production configuration, or history changed by audit.
- Status: **ATTENTION REQUIRED**. No material finding established; validation not run.
- Validation evidence: selected checks are recorded in root `SECURITY-WEEKLY-SUMMARY.md`; unavailable checks remain incomplete, not clean.
- Incomplete areas: full dependency CVE audit, authenticated role matrix, deployed testing, complete endpoint coverage, and Strix validation.
- Final assessment: **CONDITIONALLY READY** for repositories without open high findings; **NOT READY** for repositories with open HIGH findings; no repository receives security clearance from this run.


## Scheduled-run update — 2026-09-10 (Thursday quick targeted regression; current execution)
# tattoin security report — 2026-09-10

- Repository: `/home/anandabagus/workspace/repos/tattoin`
- Scan date: `2026-09-10` (Thursday, Asia/Makassar)
- Mode: Thursday quick targeted regression + bounded static review
- Status: **ATTENTION REQUIRED**
- Strix: **NOT RUN** — exact launcher completed prerequisite check, but every scan exited `1` with `STRIX_LLM is not set`; no `run.json`, report, or structured finding was produced.

## Executive summary
Coverage incomplete. Clean temporary copies were used under `/home/anandabagus/workspace/repos/.security-work/copies`; no source upload or managed cloud scan. Product code, dependencies, schema, infrastructure, production configuration, secrets, and repository history were not modified by audit.

## Findings index
- None confirmed within current limited scope.

## Detailed findings
No material finding confirmed from current limited static checks.

## Dependency review
Automated CVE scan NOT RUN. Manifest review limited.

## Authentication and authorization review
Static selected-boundary review only. Authenticated multi-role dynamic coverage NOT REVIEWED.

## API review
Selected routes and input sinks reviewed. Complete endpoint inventory and black-box validation NOT REVIEWED.

## Database and data integrity review
No database connection, migration, or mutation executed.

## Infrastructure and configuration review
Selected Docker/Compose, runtime, and CI files reviewed.

## Privacy and sensitive data
Secret values not copied into reports. Sensitive values masked as `[REDACTED]`.

## Strix review
- Launcher: `/home/anandabagus/.local/bin/uv run --frozen --directory /home/anandabagus/workspace/repos/strix strix`
- Schedule mode: Thursday quick
- Target copies: `/home/anandabagus/workspace/repos/.security-work/copies/<repo>`
- Per-repository command: `... strix -n -t <clean-copy> --scan-mode quick --max-budget 10 --scope-mode auto`
- Results: 28/28 exited `1`; error `STRIX_LLM is not set`; 0/28 `run.json`; 0/28 reports; 0/28 structured findings.

## Validation evidence
- `docker info`: exit 0; Docker running.
- `/home/anandabagus/.local/bin/uv run --frozen --directory /home/anandabagus/workspace/repos/strix strix --version`: exit 0; `strix 1.6.2`.
- LLM `/models` endpoint: HTTP 200 when explicitly loaded from `~/.strix/cli-config.json`; key not printed. The launcher process did not inherit config values, so dynamic scans did not execute.
- Repository-specific tests: not broadly run; existing report evidence retained as existing, not revalidated.

## Incomplete areas
Full Strix agent execution, dependency CVE analysis, authenticated role matrix, deployed testing, complete endpoint coverage, and dynamic authorization tests: **NOT REVIEWED**.

## Commands executed
```text
date -u '+%Y-%m-%d %H:%M:%S UTC (%A)'
docker info
/home/anandabagus/.local/bin/uv run --frozen --directory /home/anandabagus/workspace/repos/strix strix --version
/home/anandabagus/.local/bin/uv run --frozen --directory /home/anandabagus/workspace/repos/strix strix -n -t <clean-copy> --scan-mode quick --max-budget 10 --scope-mode auto
docker info; git status --short --untracked-files=all; git diff --check
```

## Final assessment
**CONDITIONALLY READY** for limited static scope only. No security clearance. Coverage gaps remain.

## Scheduled-run update — 2026-09-10 (Strix 9router targeted regression)
- Status: **ATTENTION REQUIRED**
- Strix: executed via `/home/anandabagus/.hermes-remote/profiles/jarfish/scripts/run_strix_9router`
- Findings: None
- Note: No direct high finding; static posture review only.
