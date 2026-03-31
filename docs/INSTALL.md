# 安装 oh-my-research（OpenCode 插件）

与 **PLAN.md §7** 一致：分两步，**不**合并为单一不可拆安装包。

## 1. OpenSpec CLI 与仓库初始化

1. 在开发环境中全局安装 **OpenSpec CLI**（参见 [OpenSpec 上游](https://github.com/Fission-AI/OpenSpec) 的安装说明）。
2. 在**目标业务仓库**根目录执行：

```bash
openspec init
```

按提示生成 OPSX 命令、配置与变更目录约定；对话中使用 **`/opsx:*`** 与 CLI 协作。

## 2. 安装本插件与技能

在 **OpenCode** 配置（全局 `~/.config/opencode/opencode.json` 或项目根目录 `opencode.json`）的 **`plugin`** 数组中加入本插件。OpenCode 会在启动时用 **Bun** 安装 npm 插件并缓存到 `~/.cache/opencode/node_modules/`（见 [官方 Plugins 文档](https://opencode.ai/docs/plugins/)）。

### 方式 A：从 npm 安装（推荐，启动自动装载）

1. 在仓库根目录已提供 **`package.json`**，包名默认为 **`oh-my-research`**（若与 npm 上已有包重名，请改成 **`@你的作用域/oh-my-research`** 等唯一名称）。
2. 登录并发布（首次需 [注册 npm 账号](https://www.npmjs.com/signup)）：

```bash
cd /path/to/oh-my-research
npm login
npm publish --access public
```

若使用 **作用域包**（如 `@username/oh-my-research`），在 `package.json` 里把 `name` 改为作用域形式，并确保含 `"publishConfig": { "access": "public" }`。

3. 在 `opencode.json` 中写 **包名**（与 `package.json` 的 `name` 一致）：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["oh-my-research"]
}
```

作用域包示例：`"plugin": ["@username/oh-my-research"]`。

4. 重启 OpenCode。之后每次启动都会按该版本解析并加载插件（与社区插件如 `opencode-helicone-session` 相同机制）。

**本地试打包（不发布）：** `npm pack` 会生成 `oh-my-research-0.1.0.tgz`，可用于检查打进包里的只有 `index.js` 与 `skills/`。

### 方式 B：本地路径（开发调试）

**file URL**（路径按你的克隆位置调整）：

```json
{
  "plugin": ["file:///Users/you/oh-my-research"]
}
```

此时 OpenCode 会把该目录当作包，读取根目录 **`package.json` 的 `main`**（即 `./index.js`），与 npm 安装行为一致。

### 方式 C：Git 远程（不经过 npm）

```json
{
  "plugin": ["oh-my-research@git+https://github.com/OWNER/oh-my-research.git"]
}
```

重启后插件会注册 **`skills/`** 并注入 **using-oh-my-research** 引导。

**验证：** 使用 skill 工具列出技能，应能看到 `openspec-explore`、`openspec-propose`、`openspec-verify-change` 等。

## 兼容性

详见 [COMPATIBILITY.md](./COMPATIBILITY.md)。
