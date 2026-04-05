# 发布到 npm 与在 OpenCode 中验证

## 发布（需你本机执行）

当前 npm 账户若开启 **双因素认证（2FA）**，在终端执行 `npm publish` 时需要 **一次性验证码**，无法由他人代操作。

```bash
cd /path/to/openspec-superpowers
npm whoami    # 确认已登录
npm publish --access public
```

若提示需要 token：在 [npm Access Tokens](https://www.npmjs.com/settings/~/tokens) 创建 **Granular Access Token**，勾选 **Publish packages**，并在本机配置 `~/.npmrc` 或使用 `npm login`（支持 2FA 时按提示输入 OTP）。

发布成功后可在网页确认：  
https://www.npmjs.com/package/openspec-superpowers

## 在 OpenCode 里启用插件

编辑 **`~/.config/opencode/opencode.json`**（或项目根目录的 `opencode.json`）：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["openspec-superpowers"]
}
```

保存后 **完全退出并重启 OpenCode**。首次启动时 OpenCode 会用 Bun 把包装进 `~/.cache/opencode/node_modules/`。

## 如何确认「能看到」插件

1. **技能列表**：在对话里让助手用内置 **skill** 工具列出技能，应出现 `openspec-explore`、`using-openspec-superpowers` 等（名称以实际解析为准）。
2. **首条消息引导**：插件通过 `experimental.chat.messages.transform` 将 **using-openspec-superpowers** 作为 bootstrap 一次性前置到会话中的第一条用户消息；新开会话后模型应默认记得 `skill`、subagent、parallel、TDD、debugging、verification 等能力。
3. **日志**（可选）：终端运行 `opencode` 时加 `--print-logs` 或查看 OpenCode 日志里是否加载 `openspec-superpowers`。

## 版本升级

修改 `package.json` 的 `version`（如 `0.1.1`），再执行 `npm publish --access public`，重启 OpenCode 以拉取新版本（视客户端缓存行为，必要时清缓存后再试）。
