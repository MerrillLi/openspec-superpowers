# 插件内技能清单与相对 Superpowers 的删减（PLAN §5）

本仓库 `skills/` 下 **实际包含** 的文件如下；**未纳入** 项见表末。

| 技能目录 | 说明 |
|----------|------|
| `using-oh-my-research` | 精简版「入口说明」，替代上游 `using-superpowers` 的完整行为 |
| `openspec-explore` | OPSX explore + §3 强清单；**非**独立 `brainstorming` 入口 |
| `openspec-propose` | OPSX propose + §3.2 writing-plans 粒度 |
| `openspec-verify-change` | OPSX verify + §3.1 内嵌 Code quality |
| `subagent-driven-development` | 改编：去掉 Final reviewer；计划路径改为 OpenSpec |
| `dispatching-parallel-agents` | 纳入 |
| `test-driven-development` | 纳入 |
| `systematic-debugging` | 纳入（路径引用已去 `superpowers:` 前缀） |
| `verification-before-completion` | 纳入 |
| `using-git-worktrees` | 纳入 |
| `finishing-a-development-branch` | 纳入 |

## 未纳入（第一版）

| 上游 | 策略 |
|------|------|
| `brainstorming` | 行为并入 `openspec-explore`，不单包入口 |
| `writing-plans` | 形态并入 `openspec-propose`，不单包阶段 |
| Code quality 独立门禁 | 语义并入 `openspec-verify-change` |
| `executing-plans` | 不纳入 |
| `requesting-code-review` / `receiving-code-review` | 不纳入 |
| `writing-skills` | 不面向终端用户 |

## OpenSpec 模板

上游 `3rdparty/openspec` 内 **TS 模板**（`explore.ts` 等）为 **只读参照**；本产品的 **可执行** 改编落在 **本仓库 `skills/openspec-*`** 与 **PLAN.md** 对齐的约定中。若需与 `openspec init` 生成物逐字一致，可在后续步骤将本技能正文同步到 OpenSpec 的 skill 生成流程（不修改 `openspec` CLI 对外接口）。
