---
name: openspec-propose
description: Propose a new change with all apply-ready artifacts generated in one step. Use when the user wants a complete proposal, design, and task set ready for implementation.
---

# OpenSpec propose (`openspec-propose`, `/opsx:propose`)

Propose a new change - create the change and generate all artifacts in one step.

I'll create a change with artifacts such as:

- `proposal.md` (what and why)
- `design.md` (how)
- `tasks.md` (implementation steps)

When ready to implement, run `/opsx:apply`.

---

**Input:** The user's request should include a change name (kebab-case) or a description of what they want to build.

## Steps

1. **If no clear input is provided, ask what they want to build**

Ask an open-ended question such as:

> "What change do you want to work on? Describe what you want to build or fix."

From their description, derive a kebab-case name.

Do not proceed without understanding what the user wants to build.

2. **Create the change directory**

```bash
openspec new change "<name>"
```

This creates a scaffolded change at `openspec/changes/<name>/` with `.openspec.yaml`.

3. **Get the artifact build order**

```bash
openspec status --change "<name>" --json
```

Parse the JSON to get:

- `applyRequires`: artifact IDs needed before implementation
- `artifacts`: all artifacts with status and dependencies

4. **Create artifacts in sequence until apply-ready**

Loop through artifacts in dependency order.

For each artifact that is ready:

```bash
openspec instructions <artifact-id> --change "<name>" --json
```

Use the returned:

- `template`
- `instruction`
- `outputPath`
- `dependencies`
- `context`
- `rules`

Read completed dependency artifacts for context.

Create the artifact using the `template` structure and follow the `instruction`, while treating `context` and `rules` as constraints for you, not content to copy into the file.

5. **Artifact quality bar in this plugin**

The schema still defines artifact structure, but in this plugin the generated artifacts must also meet these expectations.

### `proposal.md`

Keep it high-level and decision-oriented.

- explain **why** this change exists
- define the intended **scope**
- state clear **success criteria**
- state explicit **non-goals**

Do not turn `proposal.md` into a low-level implementation plan.

### `design.md`

Use it for architecture and key technical decisions.

- describe module or subsystem boundaries
- describe key interfaces and data flow
- explain important design decisions and trade-offs
- clarify responsibilities between major parts of the system

Do not expand `design.md` into a step-by-step execution checklist.

### `tasks.md`

`tasks.md` must absorb the useful rigor of **writing-plans** without becoming a giant code dump.

For each task:

- use checkbox tracking (`- [ ]` / `- [x]`)
- keep steps small, concrete, and verifiable
- include exact file paths to create or modify where they are known
- include validation steps and commands where they matter
- make the work executable by someone with little prior context

For the overall task set:

- break work into sensible, independently checkable chunks
- make sure tasks cover the scope promised by proposal and design
- prefer actionable instructions over vague placeholders
- do not require large embedded code snippets unless the schema explicitly calls for them

This is a **middle-weight** planning bar:

- more executable than a generic task list
- less prescriptive than full writing-plans code-per-step output

6. **Continue until all apply-required artifacts are done**

After creating each artifact, re-run:

```bash
openspec status --change "<name>" --json
```

Stop when every artifact ID in `applyRequires` is marked `done`.

7. **Show final status**

```bash
openspec status --change "<name>"
```

Summarize:

- change name and location
- artifacts created
- what is ready for implementation
- that `/opsx:apply` is the next step

---

## Artifact Creation Guidelines

- Follow the `instruction` field from `openspec instructions` for each artifact type.
- The schema defines what each artifact should contain; follow it.
- Read dependency artifacts before creating new ones.
- Use `template` as the structure for the output file.
- Do not copy raw `context`, `rules`, or similar instruction blocks into artifacts.
- If details are still imperfect, prefer producing a reviewable draft that the user can inspect rather than blocking unnecessarily.

---

## Guardrails

- Create all artifacts needed for implementation as defined by the schema's `applyRequires`.
- Do not tell the user to run a separate `writing-plans` skill as the default next step.
- If a change with that name already exists, ask whether to continue it or create a new one.
- Verify each artifact file exists after writing before proceeding.
