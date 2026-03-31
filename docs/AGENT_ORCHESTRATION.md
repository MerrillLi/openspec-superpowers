# 主 Agent 编排契约（PLAN §8）

## 角色

- **主 Agent（主会话）：** 编排、派工、合并结果；**不**代替子代理执行实现细节。
- **子 Agent：** 按模板执行 **Implementer**、**Spec reviewer**、**Code quality reviewer**（见 `skills/subagent-driven-development/`），并与 **dispatching-parallel-agents** 组合用于多域并行。

## 不包含

- **Final reviewer**（首轮不纳入；见 PLAN §4）。
- 独立 **code-reviewer** 文档路径（由 SDD 与 verify 覆盖）。

## 无子代理 API 时的降级

若环境无法派发子代理，主 Agent **顺序内联**同一套检查清单：

1. 实现 → 自检（按 implementer 意图）。
2. Spec 对照 → 按 spec-reviewer 清单逐项核对。
3. Code quality → 按 `code-quality-reviewer-prompt.md` 与 **openspec-verify-change** 中的 Code quality 维度执行。

**归档前**仍以 **`openspec-verify-change`** / **`/opsx:verify`** 为唯一验收入口（PLAN §3.1、§9）。
