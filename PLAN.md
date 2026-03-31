# 自定义 OpenCode 插件 — 规范与实施说明

本文档路径为仓库根目录下的 `PLAN.md`。本文档规定本仓库 **自研 OpenCode 插件** 的规范性约束与实施事项，并作为该主题的 **单一正式载体**，行业语境下与 **single source of truth** 同义：**产品能力溯源**、**SHALL 级要求**、**非规范性说明**及 **工程任务清单** 均在本文件 **定义、修订与版本控制**。**本仓库内不得在其他路径另行发布与本文件冲突或重复的规范性要求**。`3rdparty/` 目录仅供上游只读参照，**不构成**本产品的规范文本。

**上游仓库：** 实现时 **只读对照、不修改上游**。

| 路径 | 与产品的关系 |
|------|----------------|
| [3rdparty/openspec](3rdparty/openspec) | 功能参考来源，规范侧 — 见 §2 |
| [3rdparty/superpowers](3rdparty/superpowers) | 功能参考来源，工程与编排侧 — 见 §2 |

---

## 1. 产品定义

**目标交付物**为本仓库 **自行实现并维护** 的 **OpenCode 插件**，而非仅将上游现成发行物拼接使用。插件在 **OpenCode** 中 **对接并沿用 OpenSpec 的 OPSX 工作流与命令面**：对话侧使用 **`/opsx:*`** 形式入口，并与 **`openspec` CLI**、仓库内变更目录、artifact 及 schema 协作，使 **spec-driven 迭代** 以 OpenSpec 语义为主路径。

插件 **整合** [3rdparty/superpowers](3rdparty/superpowers) 中 **经本规范选定并改编的 Skills**，涵盖子代理 prompt 链、TDD、调试、并行派发等 **工程侧能力**，并与 OPSX 规范活动 **衔接**。运行时 **主 Agent** 负责编排与合并结果，**子 Agent** 依 §4 角色与模板执行。

**OpenSpec** 与 **Superpowers** 在本文档中仅作为 **溯源与改编来源**，详见 §2；**不表示**由上游仓库代为交付本插件。

---

## 2. 产品能力溯源

本节描述目标产品中各项能力 **自哪个上游仓库继承或映射至何处**。表述对象为 **provenance**，即 **溯源**，**不是**运行时调用关系或部署架构说明。

### 2.1 OpenSpec — [3rdparty/openspec](3rdparty/openspec)

| 产品侧能力 | 上游参考位置 |
|------------|----------------|
| spec-driven 主循环：变更 propose → 实现 apply → 收尾 archive | OPSX、`openspec` CLI、工作流 profile |
| **explore**：以思考与阅读为主、禁止写实现代码，可起草变更 | `explore` 工作流模板与生成技能，例如 `src/core/templates/workflows/explore.ts` 及 init 产物 |
| 仓库内 **变更目录、artifact、schema** | `schemas/`、`openspec init` 后的约定、`openspec/config.yaml` |
| **强清单式 explore**：一次一问、分段确认、再写入规范 | **本产品约定**：纪律取自 Superpowers `brainstorming`，详见 §3；落盘路径 **仅** 遵循 OpenSpec |
| **verify**，入口含 `/opsx:verify` 与 `openspec-verify-change` 技能 | [verify-change.ts](3rdparty/openspec/src/core/templates/workflows/verify-change.ts)，对变更 artifact 做完整性、正确性、一致性核对；**本产品约定**为将 Superpowers **Code quality** 纪律与评审语义 **并入 verify 模板**，策略与 §3 中 explore 并入 brainstorming 强清单相同，详见 **§3.1** |
| **propose**：形成正式变更并 **一次性交付** 与 Superpowers **writing-plans** 同款粒度的可验证实施计划 | OPSX **`propose`** 工作流及模板；**本产品约定**为将 **writing-plans** 的文档结构、可验证小步与追踪写法 **并入 `propose` 产出**，**不设**独立 **writing-plans** 工作流阶段，详见 **§3.2** |

### 2.2 Superpowers — [3rdparty/superpowers](3rdparty/superpowers)

| 产品侧能力 | 上游参考位置 |
|------------|----------------|
| 子代理 **Implementer / Spec reviewer / Code quality reviewer** 及 prompt 链 | [skills/subagent-driven-development/](3rdparty/superpowers/skills/subagent-driven-development/) 下各 `*-prompt.md` 与 `SKILL.md`；已排除 Final 等 |
| 多域 **并行派子代理** | [skills/dispatching-parallel-agents/SKILL.md](3rdparty/superpowers/skills/dispatching-parallel-agents/SKILL.md) |
| **writing-plans** 所定义的计划形态：可验证小步、任务级清单与追踪约定 | [skills/writing-plans/](3rdparty/superpowers/skills/writing-plans/) 的 **SKILL 与行文**；**本产品**中该形态 **并入 OpenSpec `propose` 交付物**，**不**再作为独立 OPSX 阶段，详见 **§3.2** |
| **TDD** | [skills/test-driven-development/](3rdparty/superpowers/skills/test-driven-development/) |
| **结构化调试** | [skills/systematic-debugging/](3rdparty/superpowers/skills/systematic-debugging/) |
| **完成前验证** | [skills/verification-before-completion/](3rdparty/superpowers/skills/verification-before-completion/) |
| explore 内 **强清单纪律**：一问一答、分段确认 | [skills/brainstorming/SKILL.md](3rdparty/superpowers/skills/brainstorming/SKILL.md) 的流程要求；**仅借鉴行为**，不沿用其默认设计文档路径，详见 §3 |
| **worktree / 分支收尾** | **纳入** `using-git-worktrees`、`finishing-a-development-branch`，详见 §5 |

---

## 3. OpenSpec `explore` 与 Superpowers `brainstorming`

**背景。** `brainstorming` 与 OpenSpec `explore` 在「先想清楚再写代码」上重叠；前者具备 **强清单**，即一次一问、分段确认、收口后再继续，后者偏 **姿态化、步骤不固定**。

**已决议条款。**

1. **不**再单独将 Superpowers **`brainstorming`** 作为第二条并行入口，避免双轨设计文档。
2. 在 **OpenSpec `explore` 工作流** 及其 OPSX 模板与生成技能中 **显式引入** `brainstorming` SKILL 中保留的 **纪律**：**一次一问**，必要时多轮；**分段展示与分段确认**，复杂内容按块对齐；对齐完成后再 **写入或更新规范产物**。
3. **文档与路径。** 所有设计、规格类 **产出** 一律遵循 OpenSpec 约定，即当前 change 目录下、由 schema 定义的 proposal、design、specs 等 artifact。**禁止** 使用 Superpowers 默认的 `docs/superpowers/specs/YYYY-MM-DD-...-design.md` 作为主规范路径。若需固定文件名，在 **`openspec init` 后的项目 schema**、**`openspec/config.yaml`** 或 OPSX 模板中约定，**禁止** 另建与 OpenSpec 并行的目录结构。

**实施提示。** `explore` 指令模板须写入上述约束，并明确落笔至 OpenSpec artifact 的步骤；实现以 **OpenSpec CLI** 与 **仓库内约定目录** 为准。

---

## 3.1 OpenSpec `verify` 与 Superpowers Code quality

**与 §3 对称。** §3 将 `brainstorming` 强清单并入 **`explore`**，不设第二条入口，产物仅走 OpenSpec；本节将 Code quality 评审语义并入 **`verify`**，同样不设第二条验证入口，产物仅走 OpenSpec 的 verify 出口。

**背景。** Superpowers **Code quality reviewer** 见 [code-quality-reviewer-prompt.md](3rdparty/superpowers/skills/subagent-driven-development/code-quality-reviewer-prompt.md)，原属子代理链；OpenSpec **verify** 已有 Completeness、Correctness、Coherence 等维度。若二者各自独立执行，会出现两套验收叙事。

**已决议条款。**

1. **禁止**将「单独再执行一次 Code quality 技能」作为与 **OpenSpec verify** **并列**的第二条归档前门禁；用户 **仅** 使用 **`openspec-verify-change`** 与 **`/opsx:verify`**。
2. 在 **OpenSpec `verify` 工作流** 及其 OPSX 模板与生成技能中 **显式写入** Code quality 应覆盖的内容：评审焦点、通过或关注标准、必要时 **子代理 dispatch** 的写法。语义来自 **code-quality-reviewer-prompt**，但 **嵌入 verify 的 Steps**，成为 verify 的 **内建维度**，可与现有三维并列扩展为「实现质量 / Code quality」章节，或融入 Coherence 的延伸检查；**同一套验证报告、同一出口**。上游模板见 [verify-change.ts](3rdparty/openspec/src/core/templates/workflows/verify-change.ts)。
3. **产物与路径。** 验证结果落在 **OpenSpec 约定的变更目录与报告结构**，文件名与章节由 schema 或模板约定。**禁止**另建仅属于 Superpowers 的并行 `CODE_QUALITY.md` 主路径；Code quality 结论写入 **verify 报告中的结构化字段或章节**。

**实施提示。** 与 `explore` 模板一致：在 **`openspec-verify-change`** 指令模板或插件覆盖的同名技能中纳入 `code-quality-reviewer-prompt` 的检查项与约束；**禁止**以独立 code quality 命令或技能与 **`verify` 构成并列的归档前验收入口**。

---

## 3.2 OpenSpec `propose` 与 Superpowers `writing-plans`

**与 §3、§3.1 同一策略。** §3 将 **brainstorming** 强清单并入 **`explore`**；§3.1 将 **Code quality** 并入 **`verify`**；本节将 **writing-plans** 所要求的 **计划形态与详细程度** 并入 **`propose`** 的交付物，**不设**第二条「先粗后细」的主路径。

**背景。** 上游 Superpowers 常在设计批准后用 **writing-plans** 将工作拆为 **可验证小步** 并附追踪清单。若 **OpenSpec `propose`** 仅产出粗粒度 proposal 而另开 **writing-plans** 阶段补细，会出现 **双轨计划文档** 与额外入口。

**已决议条款。**

1. **禁止**将 **Superpowers `writing-plans`** 作为与 **`propose` 并列** 的独立 OPSX 工作流阶段或用户必经命令；实施顺序上 **`explore` 收敛之后直接进入 `propose`**，**不**插入单独的 **writing-plans** 环节。
2. **`propose` 的产出**，在 **项目 schema** 所约束的 proposal、tasks、specs、design 等 artifact 中，**须达到** [skills/writing-plans](3rdparty/superpowers/skills/writing-plans/) 所体现的 **详细程度**：**可验证小步**、逐步可核对、具备与上游 **writing-plans** 同类的 **任务拆解与执行追踪** 写法；具体章节与字段名 **以项目 schema 为准**，由 **OPSX `propose` 模板** 固化上述约束，而非另写一套仅存在于 Superpowers 路径下的计划文件。
3. 插件实现中 **可保留** 对 **writing-plans** SKILL 的 **改编副本或引用**，用于 **约束 `propose` 生成逻辑与审阅清单**；**用户主路径**上的「正式、可执行计划」**仅** 以 **OpenSpec 变更目录内、`propose` 所落盘内容** 为准。

**实施提示。** 改编 **OPSX `propose`** 指令模板或生成技能时，**显式对齐** `writing-plans` SKILL 中对步骤粒度、验证点与勾选追踪的要求；**禁止**依赖「先 `propose` 粗稿再手动跑 **writing-plans**」作为默认流程。

---

## 4. Superpowers 子代理角色

来源：[subagent-driven-development](3rdparty/superpowers/skills/subagent-driven-development/)、[dispatching-parallel-agents](3rdparty/superpowers/skills/dispatching-parallel-agents/SKILL.md)。

**保留的角色，prompt 链**

| 角色 | 参考 |
|------|------|
| **Implementer** | `implementer-prompt.md` |
| **Spec reviewer** | `spec-reviewer-prompt.md` |
| **Code quality reviewer** | `code-quality-reviewer-prompt.md` |

**不纳入**

- **Final reviewer**，全流程终裁一轮；第一版不包含。
- **独立 `agents/code-reviewer.md`**；不单独维护，需要时由主会话或上表评审链覆盖。

**保留的模式**

- **dispatching-parallel-agents**：多独立问题域并行派子代理，与上表三角色组合使用。

**apply 阶段与 §3.1 `verify` 的关系**

- **apply 阶段**：SDD 子链 **可以** 按上游习惯派发 **Code quality reviewer** 子代理，用于开发期迭代与快速反馈。
- **归档前**：代码质量的 **最终门禁** **唯一** 以 **`verify`** 的结论为准，**verify** 含 §3.1 内嵌 Code quality；**禁止**依赖与 `verify` 无关的另一套并行终审流程。
- **apply** 可重复执行代码质量相关子代理以收敛实现；**archive** 所依赖的 **最终** 代码质量结论 **仅** 来自 §3.1 与 §9 规定的 **`verify`**。二者为 **阶段职责划分**，**不是**两套并列的规范性终审。

---

## 5. Superpowers Skills 迁入策略

**原则：** 与 OpenSpec 重叠处 **单一入口**：**explore**，§3；**verify**，§3.1；**propose**，§3.2；工程类技能 **能迁入则迁入** 或 **语义并入 OPSX**，见下表。

| Skill | 策略 |
|-------|------|
| **brainstorming** | **不单独打包为第二入口**；强清单行为 **并入 §3 `explore` 模板** |
| **Code quality**，`code-quality-reviewer-prompt` 语义 | **不单独打包为 verify 之外的第二入口**；**并入 §3.1 `verify` 模板**，与上条对称 |
| **writing-plans** | **不单独作为工作流阶段或必经命令**；其 **计划形态、可验证小步与追踪要求** **并入 §3.2 `propose` 产出**；可保留改编 SKILL 或模板片段 **仅供 `propose` 生成与审阅引用** |
| **subagent-driven-development** | **纳入并改编**；与 §4 三角色一致；去掉 Final 终裁步骤 |
| **dispatching-parallel-agents** | **纳入** |
| **executing-plans** | **不纳入**；OpenCode 支持子代理，执行路径以 **subagent-driven-development** 及 §4 为准；不打包与 SDD 并列的同会话或并行会话批量执行技能 |
| **test-driven-development** | **纳入** |
| **systematic-debugging** | **纳入** |
| **verification-before-completion** | **纳入** |
| **requesting-code-review** / **receiving-code-review** | **第一版不纳入**；由 SDD 与 §3.1 **`verify`** 覆盖 |
| **using-git-worktrees** / **finishing-a-development-branch** | **纳入**；第一版默认插件包包含二者 |
| **using-superpowers** | **精简版**；仅说明本插件与 OpenSpec 的协作关系 |
| **writing-skills** | **不面向终端用户**；可置于维护者文档或 dev 目录，不纳入默认插件包 |

---

## 6. 主流程

**顺序说明。** 先完成 OpenSpec 侧规范活动，再执行 Superpowers 侧工程活动；归档前须完成 **`verify`**，且 **`verify`** 含 §3.1 内嵌 Code quality。本节 **仅用文字** 叙述阶段顺序，**不附流程图**。

**阶段 1 — 发散与澄清，OpenSpec `explore`**  
使用 `explore` 工作流。行为须带 **brainstorming 式强清单**：一次一问、分段确认、对齐后再落笔；产出 **仅** 写入 **OpenSpec 变更目录下的 artifact**，详见 §3。**禁止**将 Superpowers **`brainstorming`** 作为与 **`explore` 并列的首选入口**。

**阶段 2 — 形成正式变更与可执行计划，OpenSpec `propose`**  
在 `explore` 收敛后执行 **`propose`**。`propose` 在 OPSX 与项目 schema 约束下，将变更写成仓库内可跟踪的 proposal、specs、design、tasks 等 artifact；**须同时满足 §3.2**：交付物 **须达到** Superpowers **writing-plans** 同款 **详细程度**，含 **可验证小步** 与 **执行追踪** 写法，**禁止**再设独立的 **writing-plans** 阶段补细。

**阶段 3 — 实现，OpenSpec `apply` 与 Superpowers 工程技能**  
执行 **apply**，按 **`propose` 已落盘的计划** 实现代码。此阶段可并行使用 **子代理链**，含 Implementer、Spec reviewer 等，§4、**TDD**、必要时 **systematic-debugging**。主 Agent **仅协调、派工与合并结果**；子代理按模板执行。调试可在实现中反复发生，不单独列为阶段。**禁止**在实现未满足变更要求时进入 **`archive`**，见阶段 4、5。

**阶段 4 — 验证，OpenSpec `verify`，内嵌 Code quality**  
实现完成后，运行 **`openspec-verify-change`** 与 **`/opsx:verify`**。该步骤 **必须** 同时完成：对变更 artifact 的完整性、正确性、一致性核对，以及 **内嵌的 Code quality** 评审语义，与 §3.1、**§9** 一致。**禁止**增设与 **`verify` 并列的、仅针对 code quality 的归档前验收入口。阶段 3 子代理链与 TDD 的产物在本阶段 **统一验收**。

**阶段 5 — 收尾，OpenSpec `archive`**  
仅在 **verify 通过** 或 **必须修复项已处理完毕** 后，对变更执行 **archive**，合并或归档 living spec。

**依赖关系**  
`explore` → `propose`，含 §3.2 **writing-plans** 粒度 → `apply`，含子代理、TDD、可选调试 → `verify`，含内嵌 Code quality → `archive`。**verify** 须在 **archive** 之前；**apply** 内子代理与 TDD 均 **汇入** `verify`，**禁止**绕过 **`verify`** 直接进入 **`archive`**。

---

## 7. 安装与依赖

**目标：** 在 **不修改 OpenSpec CLI 对外接口** 的前提下，通过 **改编 OpenSpec 在仓库内的行为与 OPSX 生成物**、并叠加 **本插件及甄选 Superpowers Skills**，使 **OpenSpec CLI**、**OpenCode** 与 **Superpowers** 三者 **协同一致**。

**环境与顺序。**

1. **OpenSpec CLI** 在开发环境中 **全局可用**；用户通过 **`openspec init`** 在 **目标仓库** 内生成 OpenCode 可用的 OPSX 命令、配置与变更目录约定。  
2. **第二步**：在 **完成上述初始化** 后，再 **安装本插件** 及 §5 所列 **甄选、定制后的 Skills**；用户文档采用 **两步说明**，**不**要求合并为单一不可分拆的安装包形态。  
3. **接口与行为：** **不**变更 **`openspec` CLI 的命令行接口**；与 OpenCode、Superpowers 的 **紧耦合** 通过 **改编后的工作流模板、OPSX 技能、插件内 Skills 与 prompt** 落实，具体以本仓库实现为准，对照 [3rdparty/openspec](3rdparty/openspec)。

**版本：** **最低兼容版本号** 不在本文锁定；在 **Scaffold 与依赖冻结** 阶段，依据 `3rdparty/openspec` 等 **实际锁定版本** 另列 **兼容性说明**，见 §8 TODO。

---

## 8. 实施 TODO

完成一项将 `[ ]` 改为 `[x]`。

- [x] 在 **OPSX / explore 模板** 中落地 §3：强清单，且仅写入 OpenSpec artifact（见 `skills/openspec-explore/SKILL.md`）
- [x] 在 **OPSX / propose** 模板或生成技能中落地 §3.2：**propose** 产出须对齐 **writing-plans** 的粒度与可验证小步、追踪写法；**禁止**默认依赖独立 **writing-plans** 阶段（见 `skills/openspec-propose/SKILL.md`）
- [x] 在 **OPSX / verify**，`openspec-verify-change` 模板中落地 §3.1：内嵌 Code quality；与 explore 内嵌 brainstorming 强清单 **同一策略**；`code-quality-reviewer-prompt` 语义进入 verify 步骤与报告（见 `skills/openspec-verify-change/SKILL.md`）
- [x] 冻结 **OpenSpec profile**：与上游 **OPSX 默认 profile** **最大兼容**；对默认命令集的删减须 **有记录、可复核**；**不**将「仅暴露 §6 五阶段主流程」作为默认目标（见 `docs/COMPATIBILITY.md`）
- [x] 编写 **安装文档**：按 §7 **两步**，OpenSpec CLI + **`openspec init`**，再安装本插件与甄选 Skills；并在此后 **补充 OpenSpec / 插件的兼容版本表**（见 `docs/INSTALL.md`、`docs/COMPATIBILITY.md`）
- [x] 按 §5 列出插件内 **实际包含的 SKILL 文件** 及相对 `3rdparty/superpowers` 的删减说明（见 `docs/SKILLS.md`）
- [x] 编写 **主 Agent 编排契约**：协调不执行、§4 角色、无子代理 API 时顺序内联降级（见 `docs/AGENT_ORCHESTRATION.md`）
- [x] **Scaffold OpenCode 插件**：OpenCode 插件入口、skills 目录、与 `openspec` CLI 的协作说明（见 `.opencode/plugins/oh-my-research.js`、`docs/INSTALL.md`；**OpenCode 使用 JS 插件而非 Codex `plugin.json`**，与上游 Superpowers 对齐）
- [x] 一页文档：何时 **explore** 与 **apply**，何时派发子代理（见 `docs/EXPLORE_VS_APPLY.md`）

---

## 9. 规范要求

以下条款为 **规范性要求**，**SHALL** 与 **SHALL NOT** 用语遵循 **RFC 2119**，适用于插件实现及对 OPSX 模板的改编；与 §3、§3.1、§3.2、§4 一致，**以供**实现对照与验证。

**explore**

- `explore` 工作流 **SHALL** 体现 **brainstorming 式强清单**：一次一问，必要时多轮；分段展示与分段确认；对齐后再写入规范产物。
- **`explore` SHALL NOT** 与独立 **`brainstorming` 技能** 构成两条并列的「想清楚再写」主入口；用户 **SHALL** **仅** 通过 OpenSpec **`explore`** 完成该阶段。
- 落盘路径与 artifact 名称 **SHALL** 符合 **`openspec init` 后项目 schema** 与 **`openspec/config.yaml`**，或 OPSX 模板约定；**SHALL NOT** 以 Superpowers 默认的 `docs/superpowers/specs/YYYY-MM-DD-*-design.md` 作为 **主** 规范路径。

**propose**

- **`propose` 工作流** 所落盘的变更计划相关 artifact **SHALL** 达到 Superpowers **writing-plans** SKILL 所体现的实施计划 **详细程度**，含 **可验证小步**、逐步可执行与可追踪的清单结构；字段与章节名 **以项目 schema 为准**，由 OPSX 模板固化。
- **`propose` SHALL NOT** 与独立 **Superpowers `writing-plans` 技能或命令** 构成用户必经的 **第二条**「拆步与定稿计划」主入口；**禁止**以「先粗 `propose`、再跑 **writing-plans** 补细」作为默认流程。

**verify**

- **`openspec-verify-change`** 与 **`/opsx:verify`** 所代表的 `verify` 流程 **SHALL** 在 OpenSpec 既有维度，如 Completeness、Correctness、Coherence 之外 **内嵌** `code-quality-reviewer-prompt.md` 所表达的代码质量评审语义，含焦点、通过或关注标准、必要时子代理 dispatch。
- **`verify` SHALL NOT** 与独立「仅 Code quality」技能或命令构成两条并列的归档前验收入口；含代码质量的验证 **SHALL** **仅** 通过 **`openspec-verify-change`** 与 **`/opsx:verify`** 完成。
- Code quality 结论 **SHALL** 进入 OpenSpec 约定的验证报告或变更目录结构，含章节或结构化字段；**SHALL NOT** 另建仅属 Superpowers 的并行 **`CODE_QUALITY.md` 主路径**，除非项目 schema **显式**约定同名 artifact。

**apply 与 verify**

- **归档前** 最终代码质量门禁 **SHALL** 以 **`verify`** 为准，**verify** 含内嵌 Code quality；**SHALL NOT** 依赖与 `verify` 无关的另一套并行终审流程。
- 本规范 **不禁止** apply 阶段子代理链按 §4 使用 **Code quality reviewer** 做开发期迭代；与上条的关系见 **§4** 小节 **apply 阶段与 §3.1 verify 的关系**。
