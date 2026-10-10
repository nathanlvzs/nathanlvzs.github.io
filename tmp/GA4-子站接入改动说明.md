# GA4 接入：两个内容源仓库的改动说明

## 目标与边界

让主站使用的 GA4 测量 ID `G-LLZX5SJ7ET` 覆盖：

- `/invest/` 及其文章、卡片、模板、图谱页面；
- `/crossborder-ecom/` 及其课程、模板、调研页面。

这两个子站的 Jekyll layout 不受本仓库直接管理。GitHub Pages workflow 会在构建时 checkout 两个内容源仓库，并由各自的导出脚本生成到本仓库的 `_layouts/`。因此不要修改当前仓库中被 `.gitignore` 忽略的 `_layouts/invest*.html` 与 `_layouts/crossborder_ecom.html` 副本。

不引入新的第三方服务，不发送自定义事件、表单字段、`localStorage` 内容或用户标识；仅复用主站现有的默认 `gtag('config', ...)` 初始化。

## 1. `NathanLvzs/invest_learn`

### 应改文件

`scripts/export_jekyll_site/page_rendering.rb`

### 应改位置

在以下两个方法中、`</head>` 前插入相同的 Liquid 片段：

- `invest_layout`（约第 381 行）
- `invest_graph_layout`（约第 412 行）

### 插入内容

```liquid
{% if site.google_analytics_measurement_id %}
  <script async src="https://www.googletagmanager.com/gtag/js?id={{ site.google_analytics_measurement_id }}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '{{ site.google_analytics_measurement_id }}');
  </script>
{% endif %}
```

`scripts/export_jekyll_site.rb` 已经把这两个函数的输出写入目标站点：

- `_layouts/invest.html`
- `_layouts/invest_graph.html`

所以无需改导出入口或生成资源目录。

### 源仓库验证

```bash
ruby scripts/validate_content_structure.rb
ruby scripts/export_jekyll_site.rb --output /private/tmp/invest-export-check
rg -n 'google_analytics_measurement_id|gtag/js' /private/tmp/invest-export-check/_layouts/invest.html /private/tmp/invest-export-check/_layouts/invest_graph.html
```

## 2. `NathanLvzs/crossborder_ecom_learn`

### 应改文件

`scripts/export_jekyll_site.rb`

### 应改位置

在 `render_layout` 方法中、`</head>` 前插入与上一节完全相同的 Liquid 片段（当前约第 291 行）。

该脚本末尾会将 `render_layout` 的结果写入：

```text
_layouts/crossborder_ecom.html
```

无需修改 `media/crossborder-ecom/site.css` 或任何内容 Markdown。

### 源仓库验证

```bash
ruby scripts/validate_publishable_content.rb
ruby scripts/export_jekyll_site.rb --output /private/tmp/crossborder-export-check
rg -n 'google_analytics_measurement_id|gtag/js' /private/tmp/crossborder-export-check/_layouts/crossborder_ecom.html
```

## 联合发布验证

两仓库的更改合入后，主站现有 workflow 会自动执行各自的校验和导出。待 GitHub Pages Actions 成功后，打开以下任一页面并检查 HTML `<head>`：

- `https://nathanlvzs.github.io/invest/`
- `https://nathanlvzs.github.io/invest/graph/`
- `https://nathanlvzs.github.io/crossborder-ecom/`

应能看到 `https://www.googletagmanager.com/gtag/js?id=G-LLZX5SJ7ET`，并在 GA4 Realtime 报表中看到对应页面访问。

## 回滚

分别 revert 两个源仓库中向导出 layout 字符串添加的 GA4 片段即可。主站工作流、内容数据和 URL 不需要回滚或迁移。
