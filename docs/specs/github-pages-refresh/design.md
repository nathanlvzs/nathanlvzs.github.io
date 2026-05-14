# GitHub Pages 维护刷新设计

## 方案
保留 Jekyll 和现有仓库结构，做最小必要修改：

- `_config.yml` 使用 `plugins` 替代旧的 `gems`。
- `_config.yml` 的 `url` 和 `author.site` 使用 HTTPS。
- `_layouts/post.html` 继续使用 MathJax 2.x 配置，加载 cdnjs 上的固定版本 `2.7.9`，避免迁移到 MathJax 3 引入公式渲染行为变化。
- `_layouts/post.html` 移除友言评论区脚本，避免 HTTP 混合内容和失效第三方脚本影响页面。
- `README.md` 中的站点入口更新为 HTTPS。

## 后续方案边界
- GitHub Actions 发布 workflow 单独处理，不和本轮配置修复混在一起。
- 评论系统如果恢复，优先选择基于 GitHub Discussions 或 Issues 的方案，例如 giscus 或 utterances。
- 统计系统如果恢复，优先新增 GA4 或轻量替代；旧 Universal Analytics 代码不再作为长期方案。

## 验证方式
- 使用文本搜索确认旧配置和旧脚本不再出现于站点关键文件。
- 本地构建需要先解决 Ruby/Bundler 环境，不作为本轮必要验收。
- 线上部署后在 GitHub Actions 或 Pages 构建日志中确认构建成功。
