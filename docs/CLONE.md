# 克隆本仓库

`3rdparty/openspec` 与 `3rdparty/superpowers` 为 **Git 子模块**，指向公开上游：

| 路径 | 上游 |
|------|------|
| `3rdparty/openspec` | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) |
| `3rdparty/superpowers` | [obra/superpowers](https://github.com/obra/superpowers) |

首次克隆请带上子模块：

```bash
git clone --recurse-submodules https://github.com/YOUR_USER/oh-my-research.git
```

若已克隆但未拉取子模块：

```bash
git submodule update --init --recursive
```
