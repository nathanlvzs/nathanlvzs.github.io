# GitHub Pages 现状核查
date: 2026-05-13

## 问题
确认 2017 年维护过的 GitHub Pages + Jekyll 个人站点，在 2026 年是否仍能正常发布，以及哪些旧配置需要优先更新。

## 调研范围
- 当前仓库结构、Jekyll 配置、页面布局和外部脚本。
- 线上站点 `https://nathanlvzs.github.io/` 的可访问性。
- GitHub Pages 当前推荐的发布方式和 Jekyll 依赖版本。

## 结论
- 线上站点仍可访问，`https://nathanlvzs.github.io/` 返回 `HTTP 200`，服务端显示最近发布内容时间为 2017-12-18。
- 仓库仍是 GitHub Pages 可识别的 Jekyll 结构：根目录有 `index.html`、`_config.yml`、`_layouts/`、`_posts/`。
- GitHub Pages 仍支持 Jekyll，但 GitHub Actions 已成为更推荐的自动化和自定义构建方式。
- 当前配置里最需要先处理的是：`gems` 旧键名、站点 URL 仍使用 HTTP、MathJax 旧 CDN、友言 HTTP 评论脚本、未强制 HTTPS 的 Pages 设置。
- 本地 Ruby 为 2.6.10，Bundler 为 1.17.2，低于 GitHub Pages 当前构建环境。后续如果要稳定本地构建，应升级本地 Ruby/Bundler 或使用 GitHub Actions 固化构建环境。

## 对本项目的启发和行动建议
- 短期保留 Jekyll，不迁移站点生成器；先修复会影响构建、HTTPS、外部脚本加载的老化点。
- 下一步进入 GitHub 仓库设置，确认 `Settings > Pages` 的 Source、Actions 状态和 `Enforce HTTPS`。
- 如果后续继续写博客，建议加入 GitHub Actions Pages workflow，让每次部署有明确构建日志。
- 如果要恢复访问统计，把 Universal Analytics 的 `UA-` 代码替换为 GA4 或更轻量的隐私友好统计工具。
- 如果要恢复评论，优先评估 giscus 或 utterances；不要继续使用已经不可控的旧 HTTP 评论脚本。

## 参考资料
- [GitHub Pages and Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll)
- [Configuring a publishing source for your GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages dependency versions](https://pages.github.com/versions/)
- [Securing your GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [MathJax CDN shutting down on April 30, 2017](https://www.mathjax.org/cdn-shutting-down/)
