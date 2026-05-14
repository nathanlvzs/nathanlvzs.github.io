# GitHub Pages 维护刷新任务

- [x] 确认线上 `https://nathanlvzs.github.io/` 当前返回 `HTTP 200`。
- [x] 将 `_config.yml` 的 `gems` 改为 `plugins`。
- [x] 将站点 URL 和作者站点 URL 改为 HTTPS。
- [x] 将 MathJax 从 `cdn.mathjax.org` 换到 cdnjs 固定版本。
- [x] 移除旧友言 HTTP 评论脚本。
- [x] 更新 README 中的站点入口。
- [x] 记录 GitHub Pages 现状调研、短期决策和后续计划。
- [x] 在 GitHub 仓库 `Settings > Pages` 中确认并勾选 `Enforce HTTPS`。
- [x] 记录本地 Ruby/Bundler/Jekyll 操作指引。
- [x] 记录 GitHub Pages Source 和 Actions 设置检查指引。
- [x] 为页面声明现有 `puppy.jpg` favicon，减少本地预览的 `/favicon.ico` 请求提示。
- [x] 修复新版 Liquid 对分类页旧 `assign` 写法的警告。
- [x] 在 GitHub 仓库 `Settings > Pages` 中确认发布 Source。
- [x] 验证隐私政策完整 URL 可访问，且首页、分类页、RSS、sitemap 不暴露入口。
- [ ] 评估是否加入 GitHub Actions Pages workflow。
- [ ] 决定是否恢复评论系统，候选为 giscus 或 utterances。
- [ ] 决定是否恢复统计系统，候选为 GA4 或轻量统计方案。
- [x] 升级本地 Ruby/Bundler 并验证 Jekyll build 和 serve。
