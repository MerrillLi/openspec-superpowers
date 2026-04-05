---
name: using-openspec-superpowers
description: Use when starting a conversation - establishes lightweight engineering superpowers without taking over OpenSpec workflows.
---

# Using openspec-superpowers

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, skip this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
This skill is a lightweight bootstrap.

Treat the engineering skills in this plugin as available capabilities you should actively remember and use when they fit the task.

Do not let this bootstrap take over the repo's workflow. User instructions and repo instructions remain higher priority.
</EXTREMELY-IMPORTANT>

## Instruction Priority

1. **User instructions and repo instructions** — highest priority
2. **This bootstrap and other loaded skills** — shape how to work when they apply
3. **Default system behavior** — lowest priority

If the repo or user asks for a specific process, follow that process.

## What This Skill Is For

This plugin gives you lightweight engineering superpowers. When helpful, default to remembering these capabilities:

- Load relevant skills with the native `skill` tool instead of relying on memory alone.
- Use subagents for isolated research, implementation, or review work.
- Use parallel agents when work can be split into independent tracks.
- Prefer TDD for non-trivial changes when it fits the task.
- Use systematic debugging when behavior is unclear instead of guess-and-check.
- Verify important work before declaring completion.

## OpenSpec Boundary

OpenSpec remains an independent workflow in this repo.

- Do not assume OpenSpec is required for every task.
- Do not inject `/opsx:*` steps unless the task or repo context actually calls for them.
- When OpenSpec work is needed, use the relevant `openspec-*` skills or `/opsx:*` commands.

## How To Use Skills Here

When a skill might apply, load it via the native **`skill`** tool before acting.

Use this bootstrap as the reminder to check for relevant skills; use other skills for the concrete workflow.
