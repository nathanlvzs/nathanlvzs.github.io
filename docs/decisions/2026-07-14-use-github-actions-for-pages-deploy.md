# 使用 GitHub Actions 发布 GitHub Pages
date: 2026-07-14
status: 已确认
research:
  - [GitHub Pages 现状核查](../research/2026-05-13-github-pages-status.md)

## 背景

本站已经升级到当前 GitHub Pages 依赖版本，但本地默认 shell 仍可能落到 macOS 系统 Ruby，导致 Bundler 和 Jekyll 构建不可复现。后续如果接入更多发布前校验，也需要可观测的构建日志。

## 选项

- 继续使用 `Deploy from a branch`，依赖 GitHub Pages 默认 Jekyll 构建。
- 切换到 GitHub Actions，自定义 Jekyll build 和 Pages deploy。
- 迁移到新的静态站点框架并重新设计部署链路。

## 决策

本站发布升级为 GitHub Actions workflow。继续使用 Jekyll，不迁移站点框架，不改变历史 URL。

## 原因

- GitHub Actions 是 GitHub Pages 当前推荐的自动化发布方式。
- workflow 能明确展示 checkout、Pages 配置、Jekyll build、artifact 上传和部署步骤。
- 后续可以在同一条流水线中加入内容校验、链接检查或导出脚本。
- 相比迁移框架，Actions 升级能解决当前发布可观测性问题，风险更小。

## 影响

- 需要在 GitHub 仓库 `Settings > Pages` 中把 Source 切换为 `GitHub Actions`。
- 后续部署以 `.github/workflows/pages.yml` 为准。
- 本地预览仍使用 `bundle exec jekyll build` 和 `bundle exec jekyll serve`。
