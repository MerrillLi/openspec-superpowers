---
name: openspec-verify-change
description: Verify implementation matches change artifacts. Use when the user wants a structured whole-change verification pass.
---

# OpenSpec verify (`openspec-verify-change`, `/opsx:verify`)

Verify that an implementation matches the change artifacts such as specs, tasks, and design.

In this plugin, `verify` is a **structured whole-change assessment flow**.
It is **not** a required gate before `archive`.

---

**Input:** Optionally specify a change name. If omitted, infer from context when safe; if ambiguous, ask.

## Steps

1. **Select the change**

If a name is provided, use it. Otherwise:

- infer from conversation context if safe
- if only one active implementation change exists, you may use it
- if ambiguous, run `openspec list --json` and ask the user which change to verify

Do not guess when multiple plausible choices exist.

2. **Check status to understand the schema**

```bash
openspec status --change "<name>" --json
```

Parse the JSON to understand:

- `schemaName`
- which artifacts exist for this change
- current artifact state

3. **Load artifacts and context**

```bash
openspec instructions apply --change "<name>" --json
```

Read all available `contextFiles` returned by the CLI.

4. **Initialize verification report structure**

Create one report with four dimensions:

- **Completeness**: tasks and declared requirement coverage
- **Correctness**: implementation behavior against requirements and scenarios
- **Coherence**: design adherence and project-pattern consistency
- **Implementation quality**: maintainability, test quality, decomposition, risky shortcuts

Each dimension may contain `CRITICAL`, `WARNING`, or `SUGGESTION` issues.

5. **Verify Completeness**

Check objective coverage first.

- If a tasks artifact exists, parse checkboxes and count complete vs incomplete work
- If incomplete tasks exist, record them with actionable recommendations
- If delta specs exist, extract requirements and assess whether the implementation appears to cover them
- If requirements appear missing, record that clearly with supporting evidence

6. **Verify Correctness**

For each requirement or scenario you can extract from the change artifacts:

- search for implementation evidence in the codebase
- note file paths and code references when relevant
- compare implementation intent with requirement intent
- check whether scenarios appear implemented and tested

Prefer evidence-backed warnings over speculation.

7. **Verify Coherence**

Check whether the implementation still matches the design and surrounding codebase.

- if `design.md` exists, compare implementation against its key decisions
- note meaningful design drift
- review consistency with project structure, naming, layering, and local patterns
- use lower severity for minor stylistic drift; reserve stronger severity for real architectural mismatch

8. **Verify Implementation Quality**

Review the changed code and tests using the embedded code-quality standard from this plugin.

Focus on:

- whether files have clear responsibilities
- whether decomposition supports understanding and testing
- whether the implementation stayed aligned with planned scope
- whether tests verify behavior meaningfully
- whether the change introduced avoidable complexity, shortcuts, or fragile design

If the change is large or nuanced, you may dispatch a deeper code-quality review subagent, but the conclusions must still be merged back into this same report.

9. **Generate Verification Report**

Use clear markdown with a summary scorecard, for example:

```text
## Verification Report: <change-name>

### Summary
| Dimension              | Status |
|------------------------|--------|
| Completeness           | ...    |
| Correctness            | ...    |
| Coherence              | ...    |
| Implementation quality | ...    |
```

Then group findings by priority:

- `CRITICAL`
- `WARNING`
- `SUGGESTION`

Every issue should be specific and actionable. Include code references such as `file.ts:123` when useful.

10. **Final assessment**

Summarize:

- what is solid
- what remains risky or incomplete
- what the user should fix, review, or consciously accept

Do not frame the result as an automatic archive decision.

---

## Verification Heuristics

- Prefer evidence over confidence.
- When uncertain, use a lower severity rather than inventing certainty.
- Always note which checks were skipped because artifacts were missing.
- If only partial artifacts exist, degrade gracefully rather than failing the whole process.
- Keep the report focused on this change, not longstanding unrelated codebase issues.

---

## Guardrails

- Use one integrated report, not separate parallel reports for code quality.
- Do not require `verify` before `archive`.
- Do not invent missing requirements or design intent.
- Do not hide uncertainty; name it explicitly.

**Input suffix:** `/opsx:verify [<change-name>]`
