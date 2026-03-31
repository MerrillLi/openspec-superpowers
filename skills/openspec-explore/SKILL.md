---
name: openspec-explore
description: OpenSpec explore mode with strong checklist discipline — one question at a time, confirm by chunks, then write only to OpenSpec change artifacts. Use before propose when clarifying intent.
---

# OpenSpec explore (`/opsx:explore`)

## Normative alignment (product PLAN §3)

- **Single entry:** “Think before code” happens **only** here — **not** via a separate `brainstorming` skill as a parallel primary path.
- **Strong checklist (brainstorming-inspired):**
  - **One question per turn** when clarifying; use follow-up turns for more.
  - For complex topics, **present content in chunks** and **get explicit confirmation** before moving on.
  - Only after alignment, **write or update** artifacts — never dump large specs without prior chunk alignment.
- **Paths:** All design/spec **output** lives under the **current OpenSpec change** tree (`openspec/changes/<name>/...`) per **`openspec init`** schema and **`openspec/config.yaml`**. **Do not** use `docs/superpowers/specs/YYYY-MM-DD-*-design.md` as the primary spec path.
- **No implementation:** You **must not** write application code or scaffold production features. Reading/searching the repo is allowed. Creating/updating OpenSpec artifacts (proposal, design, specs, tasks) **is** allowed — that is specification work, not implementation.

---

## Stance (within the above guardrails)

- Curious and visual: ASCII diagrams when they clarify.
- Ground discussions in the real codebase when relevant.
- Adaptive: follow useful tangents; still respect one-question / chunk-confirm when eliciting decisions.

---

## OpenSpec context

At the start (or when the user names a change):

```bash
openspec list --json
```

If a change exists, read its artifacts under `openspec/changes/<name>/` for continuity.

### Where to capture (after alignment)

| Insight | Typical artifact |
|---------|------------------|
| New/changed requirement | `specs/<capability>/spec.md` under the change |
| Design decision | `design.md` |
| Scope | `proposal.md` |
| New work item | `tasks.md` |

Offer to update; do not silently overwrite large sections without the chunk-confirm flow for complex edits.

---

## Anti-patterns

- Funneling many questions in one message when clarification is still needed.
- Writing specs to non-OpenSpec paths.
- Implementing code “just to try it.”

---

## Handoff

When exploration is sufficient: suggest **`openspec-propose`** / **`/opsx:propose`** to produce the full change artifacts (see **openspec-propose** skill for writing-plans-level task granularity).

**Input:** The text after `/opsx:explore` — topic, change name, or free-form thinking context.
