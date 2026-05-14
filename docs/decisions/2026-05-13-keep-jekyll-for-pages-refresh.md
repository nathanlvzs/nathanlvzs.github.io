# 短期保留 Jekyll 发布方案
date: 2026-05-13
status: 已确认
research:
  - [GitHub Pages 现状核查](../research/2026-05-13-github-pages-status.md)

## 背景
本站自 2017 年后长期未维护，但线上 GitHub Pages 站点仍可访问。当前目标是先确认并恢复可持续部署能力，而不是重做博客系统。

## 选项
- 继续使用 GitHub Pages 内置 Jekyll，从分支根目录发布。
- 继续使用 Jekyll，但改为 GitHub Actions 构建和发布。
- 迁移到 Hugo、Astro、Next.js 等新的静态站点生成器。

## 决策
短期保留 Jekyll 和现有目录结构，只做兼容当前 GitHub Pages 的小修。暂不迁移站点生成器。

## 原因
- 当前站点结构与 GitHub Pages 的 Jekyll 支持仍匹配，迁移收益不足以覆盖短期成本。
- 老文章、固定链接、RSS 和静态资源路径已经形成历史外部入口，应避免无必要的 URL 变化。
- 当前主要风险来自配置和外部脚本老化，而不是 Jekyll 方案本身。

## 影响
- 本轮修改保持低风险，不改变文章 URL 和主题结构。
- 后续仍可以单独引入 GitHub Actions，提高构建可观测性。
- 如果将来要重做视觉和写作体验，再重新评估是否迁移到新的静态站点生成器。
