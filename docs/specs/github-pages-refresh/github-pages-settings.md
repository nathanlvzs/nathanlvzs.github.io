# GitHub Pages 设置检查指引

## 目标
确认 GitHub 仓库当前 Pages 发布来源、HTTPS 状态和 Actions 能力，避免本地构建成功但线上发布链路不可见。

## 检查 Pages Source
1. 打开 GitHub 仓库 `nathanlvzs/nathanlvzs.github.io`。
2. 进入 `Settings`。
3. 左侧进入 `Pages`。
4. 查看 `Build and deployment` 区域的 `Source`。

推荐当前短期配置：

```text
Source: Deploy from a branch
Branch: master
Folder: / (root)
```

如果仓库默认分支已经改为 `main`，则对应选择：

```text
Branch: main
Folder: / (root)
```

说明：
- 当前项目是用户主页仓库，根目录就是 Jekyll 站点源码。
- 保持 `Deploy from a branch` 可以继续使用 GitHub Pages 内置 Jekyll 构建。
- 只有在后续加入自定义 workflow 时，才把 `Source` 改为 `GitHub Actions`。
- 即使使用 branch 发布，GitHub Pages 现在也会通过 GitHub Actions 的内置 Pages workflow 执行构建和部署，因此仓库 Actions 不能被禁用。

## 检查 Enforce HTTPS
1. 仍在 `Settings > Pages`。
2. 找到 `Enforce HTTPS`。
3. 确认复选框已勾选。

当前状态：已由用户确认勾选。

## 检查 Actions 是否启用
1. 打开仓库 `Settings`。
2. 左侧进入 `Actions > General`。
3. 查看 `Actions permissions`。

如果当前设置为禁用 Actions，需要启用。推荐允许：

```text
Allow all actions and reusable workflows
```

如果希望更收敛，至少需要允许 GitHub 官方 action 以及 Pages 内置 workflow 所需能力。

同时检查页面下方：

- `Workflow permissions` 可先保持默认只读。
- 如果后续使用 GitHub Actions 发布 Pages，需要 workflow 配置 `permissions: pages: write, id-token: write`，一般不需要在全局把权限放宽到写。

## 检查 Actions 运行入口
1. 打开仓库顶部 `Actions` 标签页。
2. 如果页面提示 Actions 被禁用，按页面提示启用。
3. 如果当前没有自定义 workflow，这是正常的；branch 发布会使用 GitHub Pages 内置 workflow。
4. 后续推送到发布分支后，可在 Actions 里查看 Pages build/deployment 相关运行记录。

## 何时切换到 GitHub Actions Source
满足以下任一条件时再切换：

- 需要固定 Ruby、Bundler 或 GitHub Pages gem 版本。
- 需要更清晰的构建日志和失败定位。
- 需要使用 GitHub Pages 默认安全模式不支持的插件。
- 需要在发布前加入额外检查，例如链接检查、HTML 验证或资源处理。

切换前应先新增 `.github/workflows/pages.yml`，确认 Actions 构建成功后，再把 Pages Source 改为 `GitHub Actions`。

## 参考资料
- [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
