# openspec-superpowers

本仓库是 `openspec-superpowers` 发行包：  
在 OpenCode 里接入 OpenSpec，并在初始化业务仓库时自动注入一套更稳的 `/opsx:*` 工作流能力。

## 安装（只用 Git 仓库）

```bash
npm install -g git+https://github.com/MerrillLi/openspec-superpowers.git
```

## 配置 OpenCode

在 `~/.config/opencode/opencode.json` 或目标仓库根目录 `opencode.json` 中加入：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["openspec-superpowers"]
}
```

保存后重启 OpenCode。插件加载后会同步使用：

- `using-openspec-superpowers`
- `openspec-explore`
- `openspec-propose`
- `openspec-verify-change`
- 以及 `skills/` 中其他能力包

## 在业务仓库中启用

```bash
openspec init
```

若你后续更新了技能/工作流配置，执行：

```bash
openspec update
```

## 目录说明

- `index.js`：OpenCode 插件入口
- `.opencode/plugins/`：插件加载文件
- `skills/`：自带技能定义（已包含 `using-openspec-superpowers`）
- `3rdparty/openspec/`：定制化 OpenSpec 分发代码与文档
- `docs/`：安装与技能说明

## 常用检查

1. 重启后确认 `openspec-superpowers` 已生效（可在 OpenCode 日志查看）
2. 在对话里检查技能列表包含 `openspec-explore` / `openspec-propose` / `openspec-verify-change`
3. 在业务仓库执行 `openspec init` 成功后再开始 `/opsx:*` 工作流
