---
name: openspec-verify-change
description: Verify a change against specs/tasks/design with four dimensions including embedded Code quality; sole pre-archive gate. Use before archive.
---

# OpenSpec verify (`openspec-verify-change`, `/opsx:verify`)

## Normative alignment (product PLAN §3.1)

- **Single archive gate:** Code quality for **archive** is **only** expressed through this flow — **not** a parallel “code quality only” skill or command.
- **Embedded Code quality:** Add a fourth reporting area, **Implementation quality / Code quality**, with the same priority levels (CRITICAL / WARNING / SUGGESTION) as other dimensions. Semantics derive from the **code quality reviewer** prompt pattern:
  - Clear responsibility per file/unit; decomposition for testability.
  - Alignment with planned file structure and scope.
  - Avoid pre-existing file-size noise; focus on **this** change’s impact.
  - Strengths, issues (Critical / Important / Minor), overall assessment.
- **Where results live:** In the **same** verification report markdown (and any schema fields your project defines) under the change — **no** standalone `CODE_QUALITY.md` unless the project schema explicitly names it.

Optional: dispatch a **subagent** for deep code-quality pass when complexity warrants; conclusions still merge into this report.

---

## Steps

**Input:** Change name, or infer from context; if ambiguous, list changes and ask.

1. **Select change**

```bash
openspec list --json
```

Do not auto-guess; user picks when unclear.

2. **Schema / status**

```bash
openspec status --change "<name>" --json
```

3. **Load artifacts**

```bash
openspec instructions apply --change "<name>" --json
```

Read all `contextFiles`.

4. **Report skeleton (four dimensions)**

| Dimension | Covers |
|-----------|--------|
| **Completeness** | Tasks checkboxes, requirements coverage |
| **Correctness** | Req→code mapping, scenarios |
| **Coherence** | design.md adherence, project patterns |
| **Implementation quality** | Code quality criteria above (same report, same exit criteria) |

5. **Completeness** — task checkboxes, delta specs vs codebase signals.

6. **Correctness** — requirement and scenario coverage; evidence with paths.

7. **Coherence** — design vs implementation; pattern consistency (SUGGESTION-level when minor).

8. **Implementation quality** — structured review of the **changed** code and tests: maintainability, test quality, scope creep, risky shortcuts. Escalate blockers to CRITICAL when they would fail a professional code review.

9. **Summary scorecard** — extend the table:

```
| Dimension                 | Status |
|---------------------------|--------|
| Completeness              | ...    |
| Correctness               | ...    |
| Coherence                 | ...    |
| Implementation quality    | ...    |
```

10. **Final assessment** — CRITICAL must be cleared before archive; document warnings.

---

## Heuristics

- Prefer SUGGESTION over WARNING when uncertain; never invent CRITICAL without evidence.
- Note skipped checks (e.g., missing design) explicitly.

**Input suffix:** `/opsx:verify [<change-name>]`
