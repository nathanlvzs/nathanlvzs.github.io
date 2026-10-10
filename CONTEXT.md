当前任务：将 8 个育儿互动工具发布为独立的 `/parenting/` 子站。
本次完成：新增工具首页、成长/照护/安全/入园分组、8 个稳定 URL、专属导航和样式；保留所有原有交互、打印与 `localStorage` 逻辑，并保留 Google Analytics。`robots.txt` 已声明 sitemap。
页面组织：工具页不进入 `_posts`，各自保留完整独立 HTML，以免与博客的日期流及上一篇/下一篇导航混用。
验证：原始内容逐页比对、内联 JavaScript 和 Liquid 模板语法均通过；完整 `bundle exec jekyll build` 仍被环境禁止读取 `/etc/resolv.conf` 阻断。
下一步行动：提交后观察 GitHub Pages Actions 构建与线上 `/parenting/` 页面；投资与跨境电商子站的 GA4 需在各自内容源仓库中接入，当前仓库内的布局副本是导出产物。
