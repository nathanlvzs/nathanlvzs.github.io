# 本地 Jekyll 环境操作指引

## 目标
在本地使用和 GitHub Pages 接近的 Ruby 环境构建、预览本站，避免系统 Ruby 版本过旧导致构建结果不可复现。

## 前置条件
- 已安装 Homebrew。
- 已安装 `rbenv` 和 `ruby-build`。
- 项目目录为 `/Users/nathanlvzs/projects/workspace/nathanlvzs.github.io`。

## 安装 Ruby
```bash
brew install rbenv ruby-build
rbenv install 3.3.4
```

进入项目目录并固定项目 Ruby 版本：

```bash
cd /Users/nathanlvzs/projects/workspace/nathanlvzs.github.io
rbenv local 3.3.4
```

如果 `ruby -v` 仍显示系统 Ruby，说明 shell 没加载 rbenv shims。将下面一行加入 `~/.zshrc`：

```bash
eval "$(rbenv init - zsh)"
```

重开终端后检查：

```bash
cd /Users/nathanlvzs/projects/workspace/nathanlvzs.github.io
command -v ruby
ruby -v
rbenv version
```

期望结果：

```text
/Users/nathanlvzs/.rbenv/shims/ruby
ruby 3.3.4 ...
3.3.4 (set by .../.ruby-version)
```

## 安装依赖
```bash
gem install bundler
bundle install
```

如果 `bundle install` 或构建提示 `github-pages` 依赖冲突，先更新 GitHub Pages 依赖组：

```bash
bundle update github-pages
bundle install
```

## 本地构建
```bash
bundle exec jekyll build
```

构建成功后会生成 `_site/`。该目录是构建产物，不需要提交。

## 本地预览
```bash
bundle exec jekyll serve
```

浏览器访问：

```text
http://127.0.0.1:4000/
```

停止服务时在终端按 `Ctrl-C`。

## 常见问题

### `ruby -v` 仍显示系统 Ruby
原因是 shell 没加载 rbenv。确认 `~/.zshrc` 中存在：

```bash
eval "$(rbenv init - zsh)"
```

然后重开终端，不要只在旧终端里重复运行 `rbenv local`。

### `bundler: command not found: jekyll`
原因是当前 Ruby 环境中还没有安装项目依赖。进入项目目录后执行：

```bash
bundle install
bundle exec jekyll build
```

### `ERROR '/favicon.ico' not found`
这是浏览器默认请求根目录 favicon 的提示。站点布局已显式声明 `/media/images/puppy.jpg` 作为 favicon；如果仍出现，先强制刷新页面或清理浏览器缓存。
