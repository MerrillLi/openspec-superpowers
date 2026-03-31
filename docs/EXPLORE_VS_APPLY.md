# 何时 explore / 何时 apply / 何时派子代理

## explore（`/opsx:explore`，技能 `openspec-explore`）

- **用途：** 发散、澄清、对比方案、在落盘前对齐需求与设计。
- **行为：** 强清单（一次一问、分段确认）；**只**写入 OpenSpec 变更目录下的 artifact，**不写**业务实现代码。
- **典型：** 新需求模糊、多方案权衡、变更中途发现 scope 漂移。

## apply（`/opsx:apply`，配合工程技能）

- **用途：** 按 **`propose` 已落盘** 的 tasks 与 specs **实现代码**。
- **行为：** 可配合 **TDD**、**systematic-debugging**、**subagent-driven-development**；主 Agent 协调，子代理执行独立任务。

## 子代理派发

- **多域并行、独立问题：** 用 **dispatching-parallel-agents** 思路，与 Implementer / Spec / Code quality 角色组合。
- **单域多步实现：** SDD 子链按任务派发；开发期可用 Code quality reviewer 迭代。
- **归档前：** 不再依赖「单独再跑一遍 Code quality 技能」作为与 **verify** 并列的门禁；**唯一**归档前验证入口是 **`openspec-verify-change`** / **`/opsx:verify`**（PLAN §6 阶段 4–5）。

## 顺序记忆

`explore` → `propose`（含 writing-plans 粒度）→ `apply` → `verify`（含内嵌 Code quality）→ `archive`。
