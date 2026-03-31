# 兼容性与版本冻结（Scaffold）

本仓库在 **§8 TODO** 中承诺依据 **实际锁定版本** 记录兼容性；当前以 vendored 上游为参照。

| 组件 | 参照版本 / 来源 |
|------|------------------|
| OpenSpec CLI | `3rdparty/openspec/package.json` — **1.2.0**（随上游更新时请改此表） |
| Superpowers | `3rdparty/superpowers` — 仅作改编来源，无运行时版本绑定 |
| OpenCode | 插件 API 与 `3rdparty/superpowers/.opencode/plugins/superpowers.js` 同模式 |

**OpenSpec profile：** 默认 **不** 以「仅暴露五阶段主流程」为目标删减 OPSX 命令；若对默认 profile 做删减，须在变更说明中记录以便复核。
