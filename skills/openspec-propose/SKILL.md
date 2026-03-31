---
name: openspec-propose
description: Create an OpenSpec change and all apply-ready artifacts in one pass; tasks must match writing-plans-style verifiable steps and checkbox tracking. Use after explore.
---

# OpenSpec propose (`/opsx:propose`)

## Normative alignment (product PLAN §3.2)

- **No second plan stage:** Do **not** treat upstream **writing-plans** as a separate mandatory OPSX phase. The **same** `propose` run must produce plans detailed enough to match **writing-plans** expectations.
- **Detail bar:** `tasks.md` (and any task-bearing artifact your schema uses) **shall** include:
  - **Verifiable small steps** (each step completable and checkable in isolation where possible).
  - **Checkbox tracking** (`- [ ]` / `- [x]`) for execution.
  - Enough context that someone with **no prior codebase context** could follow (files to touch, commands to run, expected outcomes) — within what the schema allows.
- **Paths:** Only OpenSpec change artifacts; field names follow **project schema** from `openspec instructions`.

---

## Steps

**Input:** Change name (kebab-case) **or** description of what to build.

1. **If input is missing or vague**, ask what to build (open-ended). Derive a kebab-case name.

2. **Create the change**

```bash
openspec new change "<name>"
```

3. **Artifact order**

```bash
openspec status --change "<name>" --json
```

Use `applyRequires` and dependency order from `artifacts`.

4. **For each ready artifact**

```bash
openspec instructions <artifact-id> --change "<name>" --json
```

Use `template`, `instruction`, `outputPath`; apply `context`/`rules` as constraints **without** copying them into files.

5. **tasks artifact — required shape (PLAN §3.2)**

When generating **tasks** (or equivalent):

- Mirror **writing-plans** structure: header with goal, architecture summary, tracking note for implementers.
- Each task: **Files** (create/modify/test), then **steps** with `- [ ]`, each step **small**, **testable**, and **numbered** where helpful.
- Include explicit verification commands and expected results per step when applicable (TDD: failing test → pass → commit).

6. Re-run `openspec status --change "<name>" --json` until all `applyRequires` artifacts are `done`.

7. **Final status**

```bash
openspec status --change "<name>"
```

Summarize artifacts, remind: next is **`/opsx:apply`** and engineering skills (TDD, SDD) as needed.

---

## Guardrails

- Do not point users to a separate “run writing-plans skill” as the default way to refine the plan.
- If a change name already exists, ask whether to continue or rename.
- Verify each file exists after writing before proceeding.
