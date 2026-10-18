当前任务：将广东麻将速算训练小游戏迁入 `/fun/mahjong/`，为后续通用互动页面预留分类。
本次完成：从被忽略的 `tmp/gdmj/` 复制静态发布文件至 `fun/mahjong/`；保留原生 HTML/CSS/JS、横屏布局与本地 `localStorage` 数据。
页面组织：`fun/mahjong/index.html` 使用 `layout: null`，避免博客布局挤压牌桌；已补齐 canonical、描述、Open Graph/Twitter 元数据与 GA4，不在页内或首页增加博客入口。
验证：发布目录及资源路径存在，所有游戏 JavaScript 均通过 `node --check`，且 `git diff --check` 通过；完整 `bundle exec jekyll build` 仍被环境禁止读取 `/etc/resolv.conf` 阻断。
下一步行动：提交后观察 GitHub Pages Actions 构建及线上 `/fun/mahjong/` 页面；不在首页增加入口。
