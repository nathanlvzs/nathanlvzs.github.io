# NathanLVZS GitHub Pages

个人 GitHub Pages 站点，使用 Jekyll 构建并通过 GitHub Actions 发布。

线上入口：[https://nathanlvzs.github.io/](https://nathanlvzs.github.io/)

## 技术栈

- GitHub Pages
- Jekyll
- Ruby/Bundler

## 本地构建

```bash
bundle install
bundle exec jekyll build
```

## 本地预览

```bash
bundle exec jekyll serve
```

浏览器访问 `http://127.0.0.1:4000/`。

## 部署

推送到 `master` 后，由 `.github/workflows/pages.yml` 构建并部署到 GitHub Pages。

部署流程会同时 checkout 私有仓库 `NathanLvzs/invest_learn`，运行内容结构校验，并把投资学习子站导出到当前站点工作区后再执行 Jekyll 构建。

需要在本仓库 GitHub Actions secrets 中配置：

- `INVEST_LEARN_READ_TOKEN`：fine-grained PAT，仅授予 `NathanLvzs/invest_learn` 单仓库 `Contents: Read-only`。

如果自动部署失败，优先查看 Actions 日志中的 `Validate invest_learn content`、`Export invest_learn site` 和 `Build with Jekyll` 三个步骤。回滚方式是 revert 最近一次修改 `.github/workflows/pages.yml` 或 `invest_learn` 导出脚本的提交后重新推送。

Pages workflow 中的官方 Pages actions 应保持在当前主版本，避免 GitHub Actions runner 的 Node.js 20 deprecation warning：

- `actions/configure-pages@v6`
- `actions/upload-pages-artifact@v5`
- `actions/deploy-pages@v5`
