# Code Quality Reviewer Prompt Template

Use when dispatching a **development-time** code quality reviewer subagent (e.g. during **apply**). **Pre-archive** quality is still decided by **`openspec-verify-change`** / **`/opsx:verify`** (PLAN §3.1).

**Purpose:** Verify implementation is well-built (clean, tested, maintainable).

**Only dispatch after spec compliance review passes.**

**Dispatch (adapt to your platform):** subagent / Task with role “code quality reviewer”, passing:

```
WHAT_WAS_IMPLEMENTED: [from implementer's report]
PLAN_OR_REQUIREMENTS: Task N from openspec change tasks artifact
BASE_SHA: [commit before task]
HEAD_SHA: [current commit]
DESCRIPTION: [task summary]
```

**In addition to standard code quality concerns, the reviewer should check:**
- Does each file have one clear responsibility with a well-defined interface?
- Are units decomposed so they can be understood and tested independently?
- Is the implementation following the file structure from the plan?
- Did this implementation create new files that are already large, or significantly grow existing files? (Don't flag pre-existing file sizes — focus on what this change contributed.)

**Code reviewer returns:** Strengths, Issues (Critical/Important/Minor), Assessment
