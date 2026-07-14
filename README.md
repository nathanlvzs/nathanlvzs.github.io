# NathanLVZS GitHub Pages

个人 GitHub Pages 站点，使用 Jekyll 构建并通过 GitHub Actions 发布。

线上入口：[https://nathanlvzs.github.io/](https://nathanlvzs.github.io/)

## 技术栈

- GitHub Pages
- Jekyll
- Ruby/Bundler

## 本地构建

```bash
bundle install
bundle exec jekyll build
```

## 本地预览

```bash
bundle exec jekyll serve
```

浏览器访问 `http://127.0.0.1:4000/`。

## 部署

推送到 `master` 后，由 `.github/workflows/pages.yml` 构建并部署到 GitHub Pages。
