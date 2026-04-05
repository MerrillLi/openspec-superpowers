---
name: openspec-apply-change
description: Implement tasks from an OpenSpec change. Use when the user wants to start implementing, continue implementation, or work through tasks.
---

# OpenSpec apply (`openspec-apply-change`, `/opsx:apply`)

Implement tasks from an OpenSpec change.

This plugin keeps the upstream OpenSpec apply flow, but execution should integrate naturally with the engineering skills in this repo:

- use **`subagent-driven-development`** when tasks are good candidates for isolated execution
- use **`test-driven-development`** for core, high-risk, or behavior-critical work
- use **`systematic-debugging`** when implementation or tests reveal unexpected behavior

Do **not** treat `verify` as the mandatory next step after apply.
Do **not** take over git management from the user.

---

**Input:** Optionally specify a change name. If omitted, infer from context when safe; if ambiguous, ask.

## Steps

1. **Select the change**

If a name is provided, use it. Otherwise:

- infer from conversation context if the user mentioned a change
- auto-select only if one active change exists
- if ambiguous, run `openspec list --json` and ask the user which change to use

Always announce which change is being used and how to override it.

2. **Check status to understand the schema**

```bash
openspec status --change "<name>" --json
```

Parse the JSON to understand:

- `schemaName`
- which artifact contains tasks
- current artifact readiness

3. **Get apply instructions**

```bash
openspec instructions apply --change "<name>" --json
```

Use this to obtain:

- `contextFiles`
- task progress
- task list
- dynamic apply instruction

Handle states:

- if `state: "blocked"`, explain what is missing and suggest the appropriate artifact-completion flow
- if `state: "all_done"`, report that implementation tasks are already complete and stop
- otherwise continue

4. **Read context files**

Read the files listed in `contextFiles`.

Use the CLI output rather than assuming a fixed schema layout.

5. **Show current progress**

Display:

- schema being used
- progress summary
- remaining tasks overview
- any dynamic instruction from the CLI

6. **Execute tasks**

For each pending task:

- decide whether it should be handled in the current session or through **`subagent-driven-development`**
- prefer subagents for tasks that are reasonably isolated, reviewable, or parallel-safe at the task level
- prefer direct execution for tightly coupled work, small mechanical edits, or situations where shared context matters more than isolation

Execution discipline:

- keep changes minimal and focused
- use **`test-driven-development`** when the task changes important behavior, introduces meaningful logic, or carries regression risk
- for smaller or low-risk edits, use testing pragmatically without forcing a full TDD ceremony
- if unexpected behavior or failing tests appear, switch into **`systematic-debugging`** rather than guessing
- mark completed tasks in the tasks artifact immediately: `- [ ]` -> `- [x]`

Pause and ask the user if:

- a task is materially unclear
- implementation reveals a real design conflict
- the task should be re-scoped
- you hit a blocker that needs a product or architecture decision

7. **On completion or pause, report status**

Display:

- tasks completed this session
- updated overall progress
- any blockers or unresolved design issues
- relevant verification evidence gathered during implementation

If all tasks are complete, stop after reporting. Wait for the user to decide the next step.

---

## Guardrails

- Keep going through tasks until done, blocked, or interrupted by the user.
- Always read `contextFiles` before starting.
- Pause instead of guessing when requirements are unclear.
- Suggest artifact updates when implementation genuinely invalidates the current plan.
- Keep code changes scoped to the task at hand.
- Update task checkboxes as work completes.
- Do not auto-commit, auto-branch, auto-push, or otherwise manage git on the user's behalf.
- Do not force `verify` as the next step after apply.
