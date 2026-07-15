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
- [x] 评估是否加入 GitHub Actions Pages workflow。
- [x] 新增 GitHub Actions Pages workflow。
- [x] 在 GitHub 仓库 `Settings > Pages` 中把 Source 切换为 `GitHub Actions`。
- [x] 推送后确认 GitHub Actions Pages workflow 构建和部署成功。
- [ ] 决定是否恢复评论系统，候选为 giscus 或 utterances。
- [ ] 决定是否恢复统计系统，候选为 GA4 或轻量统计方案。
- [x] 升级本地 Ruby/Bundler 并验证 Jekyll build 和 serve。
- [x] 接入 `invest_learn` 私有仓库导出流程，并确认 GitHub Actions build/deploy 成功。
- [x] 将投资学习本地生成物加入 `.gitignore`，避免提交 `/invest/`、`/media/invest/` 和专用 layout 生成物。
- [x] 本地升级 Pages actions 到 Node.js 24 对应主版本，处理 Node.js 20 deprecation warning。
- [ ] 推送 Pages actions 版本升级，并确认线上 workflow 不再出现 Node.js 20 deprecation warning。

## 后续可选事项

- 评论系统：可视需求继续评估 giscus 或 utterances；当前不急于恢复，避免重新引入第三方脚本和隐私/维护成本。
- 统计系统：可视需求继续评估 GA4 或轻量统计方案；旧 Universal Analytics 不再作为长期方案。
- 现代框架迁移：只有当主站整体视觉、信息架构、搜索、学习进度、复杂交互都要重做时，才值得评估 Astro、Next.js、Docusaurus 等迁移。
- 暂不迁移原因：现在迁移会同时触碰历史 URL、RSS、模板、MathJax、资源路径，收益不够覆盖风险。
- 文档清理：已删除历史追溯价值较低的 `docs/research/` 和 `docs/decisions/` 发布过程文档；当前核心结论保留在本 spec 和 README。
