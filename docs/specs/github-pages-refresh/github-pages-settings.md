# GitHub Pages 设置检查指引

## 目标
确认 GitHub 仓库当前 Pages 发布来源、HTTPS 状态和 Actions 能力，避免本地构建成功但线上发布链路不可见。

## 检查 Pages Source
1. 打开 GitHub 仓库 `nathanlvzs/nathanlvzs.github.io`。
2. 进入 `Settings`。
3. 左侧进入 `Pages`。
4. 查看 `Build and deployment` 区域的 `Source`。

历史短期配置：

```text
Source: Deploy from a branch
Branch: master
Folder: / (root)
```

升级后推荐配置：

```text
Source: GitHub Actions
```

说明：
- 当前项目是用户主页仓库，根目录就是 Jekyll 站点源码。
- `.github/workflows/pages.yml` 已负责 Jekyll 构建和 Pages 部署。
- 切换前应先提交 workflow；切换后后续发布以 workflow 运行为准。
- 如果仓库 Actions 被禁用，GitHub Actions Source 无法部署。

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

如果希望更收敛，至少需要允许 GitHub 官方 action 以及 Pages workflow 所需能力。

同时检查页面下方：

- `Workflow permissions` 可先保持默认只读。
- 当前 workflow 在部署 job 中声明 `permissions: pages: write, id-token: write`，一般不需要在全局把权限放宽到写。

## 检查 Actions 运行入口
1. 打开仓库顶部 `Actions` 标签页。
2. 如果页面提示 Actions 被禁用，按页面提示启用。
3. 打开 `Deploy GitHub Pages` workflow。
4. 推送到发布分支后，可在 Actions 里查看 build 和 deploy 两个 job 的运行记录。

## 何时切换到 GitHub Actions Source
已满足以下切换条件：

- 需要固定 Ruby、Bundler 或 GitHub Pages gem 版本。
- 需要更清晰的构建日志和失败定位。
- 后续需要在发布前加入额外检查，例如链接检查、HTML 验证或资源处理。

下一步是在 GitHub 仓库 `Settings > Pages` 中把 Source 改为 `GitHub Actions`，推送后确认 workflow 构建和部署成功。

## Repo 可见性

GitHub Pages 现在不再限定只能从 public repo 发布。GitHub Free 支持 public repositories 的 Pages；GitHub Pro、Team、Enterprise Cloud 和 Enterprise Server 支持 public 和 private repositories 的 Pages。

注意：repo 设为 private 只控制源码仓库可见性，不应默认等同于已限制网站访问。如果页面内容不应公开访问，需要单独确认当前账号或组织是否支持 Pages 访问控制，并在 Pages 设置中显式配置。

## 参考资料
- [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
