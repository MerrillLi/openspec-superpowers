---
name: finishing-a-development-branch
description: Use when implementation is complete and you want a concise handoff summary before managing git yourself.
---

# Finishing a Development Branch

## Overview

Guide completion of development work by summarizing the current state clearly and leaving git actions to the user.

**Core principle:** Verify the work, summarize the branch state, then stop unless the user explicitly asks for a git action.

**Announce at start:** "I'm using the finishing-a-development-branch skill to summarize this work before handoff."

## The Process

### Step 1: Verify Work Status

Before handoff, gather the best available verification evidence:

```bash
# Run the relevant test or verification commands for this project
npm test / cargo test / pytest / go test ./...
```

If verification fails, report that clearly and stop.

### Step 2: Gather Branch Context

Collect concise context such as:

```bash
git branch --show-current
git status --short
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

Use this to understand:

- current branch
- whether the worktree is clean or dirty
- likely base branch, if relevant

### Step 3: Provide Handoff Summary

Report:

- current branch name
- verification status
- whether all intended work appears complete
- whether the worktree is clean or has uncommitted changes
- any important follow-up items the user should know before doing git work

Keep the summary concise and factual.

### Step 4: Stop At Handoff

Do not merge, commit, push, create a PR, delete branches, or clean up worktrees unless the user explicitly asks.

You may present concise next-step options such as:

```text
Implementation work is complete. You can now handle git however you prefer:

1. Commit the work
2. Create a PR
3. Merge later
4. Keep iterating
```

But do not perform any git action by default.

## Common Mistakes

**Taking over git workflow**
- **Problem:** Assistant starts merging, pushing, or cleaning up without explicit request
- **Fix:** Stop at a clear handoff summary

**Skipping verification status**
- **Problem:** User makes git decisions without knowing the current validation state
- **Fix:** Always summarize the available test or verification evidence

**Automatic cleanup**
- **Problem:** Assistant removes branches or worktrees the user still needs
- **Fix:** Never clean up unless explicitly asked

## Red Flags

**Never:**
- Proceed as if work is complete without checking verification evidence
- Merge, push, discard, or clean up without explicit request
- Force-push without explicit request

**Always:**
- Provide a clear handoff summary
- State whether verification passed, failed, or was not run
- Leave git management to the user by default

## Integration

**Called by:**
- any workflow that wants a final implementation handoff without taking git control

**Pairs with:**
- `openspec-apply-change`
- `subagent-driven-development`
