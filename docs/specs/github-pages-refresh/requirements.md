# GitHub Pages 维护刷新需求

## 目标
让 2017 年版本的个人 GitHub Pages 站点在当前 GitHub Pages 环境下继续可部署、可访问，并记录后续维护事项。

## 范围
- 更新 Jekyll 配置中的旧键名。
- 将站点 canonical URL 切换到 HTTPS。
- 替换已经停用的 MathJax CDN。
- 移除不可控的旧友言 HTTP 评论脚本。
- 记录后续需要人工确认的 GitHub Pages 设置、统计和评论方案。

## 非目标
- 不重做主题视觉。
- 不改变历史文章固定链接。
- 不迁移到新的静态站点生成器。
- 不批量修改历史文章中的外部参考链接。

## 验收标准
- 源码中不再使用 `_config.yml` 的 `gems` 插件配置键。
- 新生成的站点 URL 使用 `https://nathanlvzs.github.io`。
- 文章页不再加载 `cdn.mathjax.org` 和 `v2.uyan.cc`。
- 后续建议和行动计划沉淀在 `docs/` 中。
