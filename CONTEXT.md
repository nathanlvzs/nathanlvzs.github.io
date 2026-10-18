当前任务：将穿戴健康与 AI 健康教练长文作为独立 HTML 博文发布。
本次完成：新增 `_posts/2026-10-18-wearable-health-sensors-and-ai-health-coach.html`，使用 `layout: null` 保留独立侧栏、主题切换与目录交互。
内容修订：收紧监管、CGM、PPG/PRV、Agent 分诊、产品规格与 HealthKit/FHIR 表述；移除不可逐项溯源的性能卡，补一手来源、适用边界、canonical、社交元信息与 GA4。
验证：HTML 标题锚点唯一、外部来源链接存在、客户端脚本和 Liquid 语法通过；完整 `bundle exec jekyll build` 仍被环境禁止读取 `/etc/resolv.conf` 阻断。
下一步行动：提交后观察 GitHub Pages Actions 构建及线上 `/wearable-health-sensors-and-ai-health-coach.html` 页面；Markdown 源稿保留在 `tmp/`，由用户后续自行移除。
