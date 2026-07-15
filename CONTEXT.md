当前任务：接入 `invest_learn` 私有仓库到 Pages GitHub Actions 自动化发布。
上次停在：`.github/workflows/pages.yml` 已改为 checkout `site/` 和 `invest_learn/`，校验内容后导出到 `site/` 并构建 `site/_site`。
待确认事项：需要在本仓库 Actions secrets 配置 `INVEST_LEARN_READ_TOKEN`，然后推送触发线上 workflow 并检查日志。
下一步行动：配置 secret 后 push workflow，确认 Pages 部署成功且日志未输出 token。
