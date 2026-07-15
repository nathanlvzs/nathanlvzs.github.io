当前任务：修复 GitHub Pages 把维护文档和构建文件发布到 sitemap/站点的问题。
上次停在：已在 `_config.yml` 排除 `README.md`、`CONTEXT.md`、`docs/`、`Gemfile*`、`Rakefile` 和 `tmp/`，本地构建验证 `_site/sitemap.xml` 不再包含这些路径。
待确认事项：Pages actions 版本升级仍未提交/推送；本次 sitemap 排除修复也尚未提交/推送。
下一步行动：提交并推送 `_config.yml` 和 `CONTEXT.md`，等待 GitHub Actions 部署后复查线上 sitemap 与旧维护文件 URL。
