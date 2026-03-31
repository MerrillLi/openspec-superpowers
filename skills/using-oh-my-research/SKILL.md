---
name: using-oh-my-research
description: Read first — how this plugin combines OpenSpec OPSX with adapted engineering skills; use when orienting or choosing workflows.
---

# Using oh-my-research (OpenSpec + engineering skills)

This plugin is **not** a second copy of upstream Superpowers or OpenSpec. It **orchestrates**:

1. **OpenSpec** — `openspec` CLI, change directories, artifacts, and chat commands **`/opsx:*`** (after `openspec init` in the target repo).
2. **Adapted skills** — from Superpowers (TDD, debugging, SDD subagents, parallel dispatch, git worktrees, branch finish) with paths and entry points aligned to **PLAN.md** in this repo.

## Single entry for “think before code”

- Use **`openspec-explore`** / **`/opsx:explore`** only. It embeds **strong checklist** behavior (one question at a time, chunk confirmation) inspired by upstream brainstorming, but **all** design/spec output goes to **OpenSpec change artifacts**, not a parallel `docs/superpowers/...` tree.

## Single entry for “plan to implement”

- Use **`openspec-propose`** / **`/opsx:propose`**. Plan detail must match **writing-plans-style** granularity (verifiable small steps, checkboxes, traceability) **inside** OpenSpec artifacts — **no** mandatory separate `writing-plans` phase.

## Single pre-archive verification entry

- Use **`openspec-verify-change`** / **`/opsx:verify`**. It includes **Code quality** semantics (from the code-quality reviewer prompt) **inside** the same report as Completeness / Correctness / Coherence — **no** parallel “code quality only” gate for archive.

## Apply vs verify

- **apply** + subagent/TDD skills may run **Code quality reviewer** for iteration.
- **Archive** depends on **`verify`** only for the **final** quality bar (see PLAN §4).

When a skill might apply, load it via the platform **skill** tool before acting.
