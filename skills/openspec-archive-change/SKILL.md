---
name: openspec-archive-change
description: Archive a completed change in the experimental workflow. Use when the user wants to finalize and archive a change after implementation is complete.
---

# OpenSpec archive (`openspec-archive-change`, `/opsx:archive`)

Archive a completed change in the experimental workflow.

This skill follows the upstream OpenSpec archive flow for readiness checks, task warnings, and spec-sync assessment.
In this plugin, it does **not** require `verify` before archive.

---

**Input:** Optionally specify a change name. If omitted, infer from context when safe; if ambiguous, ask.

## Steps

1. **If no change name is provided, prompt for selection**

Run:

```bash
openspec list --json
```

Show only active changes, not already archived ones.
Include the schema used for each change if available.

Do not guess or auto-select when more than one plausible change exists.

2. **Check artifact completion status**

Run:

```bash
openspec status --change "<name>" --json
```

Parse the JSON to understand:

- `schemaName`
- `artifacts`
- current completion state

If any artifacts are not `done`:

- display a warning listing incomplete artifacts
- ask whether the user still wants to proceed
- continue only if the user confirms

3. **Check task completion status**

Read the tasks artifact if one exists.

- count `- [ ]` vs `- [x]`
- if incomplete tasks exist, show the count and ask whether the user still wants to proceed
- if no tasks artifact exists, continue without a task warning

4. **Assess delta spec sync state**

Check for delta specs under `openspec/changes/<name>/specs/`.

If none exist, proceed without sync prompting.

If delta specs exist:

- compare each delta spec with its corresponding main spec
- determine the likely adds, modifications, removals, or renames
- show a combined summary before prompting

Prompt options should follow the upstream intent:

- if changes need syncing: `Sync now (recommended)` or `Archive without syncing`
- if specs already appear synced: `Archive now`, `Sync anyway`, or `Cancel`

If the user chooses sync, use the repository's available sync flow before continuing.
Proceed to archive based on the user's choice.

5. **Perform the archive**

Create the archive directory if needed:

```bash
mkdir -p openspec/changes/archive
```

Generate the target name using the current date: `YYYY-MM-DD-<change-name>`.

Check whether the target already exists.

- if yes, fail clearly and ask the user how they want to resolve the name conflict
- if no, move the change directory into archive

```bash
mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
```

6. **Display summary**

Show archive completion summary including:

- change name
- schema used
- archive location
- whether specs were synced, skipped, or not applicable
- whether there were warnings about incomplete artifacts or tasks

## Output On Success

```text
## Archive Complete

Change: <change-name>
Schema: <schema-name>
Archived to: openspec/changes/archive/YYYY-MM-DD-<name>/
Specs: synced | skipped | not applicable
```

---

## Guardrails

- Always prompt for change selection if the target is ambiguous.
- Use `openspec status --json` as the source of artifact completion truth.
- Do not block archive on warnings alone; warn and confirm.
- Preserve the change metadata when moving the directory.
- Always run the sync assessment when delta specs exist.
- Do not require or suggest `verify` as part of this flow.
