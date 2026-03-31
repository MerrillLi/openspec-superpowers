# openspec-superpowers

`openspec-superpowers` 是在 OpenCode 里使用的 OpenSpec + Superpowers 改造版分发层：  
一端接 OpenSpec CLI，为仓库注入强化后的 `/opsx:*` 工作流；一端在 OpenCode 里加载本仓库的技能入口与自带技能集。

与上游 `oh-my-research` 的区别是：仓库与文档已改名为 `openspec-superpowers`，并保留统一的技能分发路径。

## 快速开始

### 1) 安装插件

```bash
npm install -g file:///Users/you/openspec-superpowers
```

或者使用 git 仓库：

```bash
npm install -g git+https://github.com/MerrillLi/openspec-superpowers.git
```

### 2) 配置 OpenCode

在 `~/.config/opencode/opencode.json` 或项目根 `opencode.json` 中配置：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["openspec-superpowers"]
}
```

重启 OpenCode 后，插件会通过 `skills` 自动加载：

- `using-openspec-superpowers`（入口说明）
- `openspec-explore`
- `openspec-propose`
- `openspec-verify-change`
- 以及其它同步到仓库中的增强技能

### 3) 在业务仓库里启动 OpenSpec

```bash
openspec init
```

如果后续改动了技能或 OpenSpec 模板：

```bash
openspec update
```

## 仓库结构

- `index.js`：OpenCode 插件入口
- `.opencode/plugins/`：供 OpenCode 装载入口的插件文件
- `skills/`：核心技能入口（含 `using-openspec-superpowers`）
- `docs/`：安装/克隆/技能说明等文档
- `3rdparty/openspec`：OpenSpec 分发核心（内置了定制 workflow 与 skill 打包）
- `3rdparty/superpowers`：上游子模块

## 开发与发布（简述）

- 本项目内置文档与示例都以 `openspec-superpowers` 为新名。
- OpenSpec 子模块在 `3rdparty/openspec`，可按需本地构建并发布：

```bash
cd 3rdparty/openspec
npm install --ignore-scripts --no-audit
npm run build
npm install -g .
```

## 参考文档

- `docs/INSTALL.md`
- `docs/CLONE.md`
- `docs/NPM.md`
- `3rdparty/openspec/README.md`
- `3rdparty/openspec/docs/fork-and-release.md`
