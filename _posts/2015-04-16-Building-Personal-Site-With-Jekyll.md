---
layout: post
title: 使用Jekyll建立个人站点
categories: [Jekyll]
tags: [Jekyll, GitHub, Blog]
---

## Jekyll简介
Jekyll是一个基于Ruby的静态站点生成器，提供了模板、插件、变量等多种功能，将你使用Markdown编写的内容转化成完全的静态网页，而且可以托管在GitHub Pages上，GitHub Pages 后台使用的就是 Jekyll 。对于托管你不需要耗费什么精力，因为GitHub Pages能够直接使用你的GitHub仓库提供网站服务。详细介绍可见其[中文官网](http://jekyllcn.com/)。


## GitHub Pages设置
每一个GitHub用户都可以免费建立一个“个人”网站，地址为 [http://用户名.github.io](http://用户名.github.io)，其对应于你在GitHub上名字为“用户名.github.io”的仓库。
使用GitHub Pages建立你的个人网站，有如下几种做法：

- 直接fork别人个人网站的仓库，把名字改为“用户名.github.io”，将这里的“用户名”替换为你的GitHub用户名，然后使用浏览器在GitHub网站上进行修改，修改完成之后即可访问来查看效果
- 自己直接建立名字为“用户名.github.io”的仓库，然后使用浏览器在GitHub网站上添加文件及内容，编辑完成之后即可访问查看效果
- 自己直接建立名字为“用户名.github.io”的仓库，然后克隆仓库，在本地进行添加修改等，完成之后在提交推送到GitHub仓库上，查看效果

	> Jekyll 提供了 `jekyll new` 命令可以在本地生成一个默认的网站。我是直接Copy了 [YongYuan](http://yongyuan.name/) 的网站作为自己网站的模板再做修改。推荐直接使用已有的网站作为模板进行修改，这样方便很多，网上有很多挺漂亮的主题模板，Google一下“jekyll theme”。


## 本地环境搭建
> 由于我是在本地编辑修改，在本地查看效果之后再推送到GitHub仓库上，所以需要在本地搭建环境来使用Jekyll。

1. 下载安装包安装 [Ruby](http://rubyinstaller.org/downloads/)，注意路径中不要包含空格，并且勾选添加path变量的选项。

2. 解压Ruby的开发工具包 [Ruby DevKit](http://rubyinstaller.org/downloads/)，解压到一个路径下面，注意路径中不要包含空格。在命令行中切换到该文件夹下面，运行 `ruby dk.rb init` 命令会自动检测Ruby的安装信息，并将这些信息添加到配置文件中供下一步使用；然后下一步运行 `ruby dk.rb install` 来安装开发工具并绑定到Ruby。

3. 我机子的系统是win8.1 ×64， 在安装Jekyll过程中提示出错，Ruby不能使用ssl连接服务器，所以多这一步，移除原来https的源，添加一个不安全的源。[参考链接](http://stackoverflow.com/questions/15305350/gem-install-fails-with-openssl-failure)   

	```sh
	gem source -r https://rubygems.org/
	gem source -a http://rubygems.org/ 或者 http://ruby.taobao.org/
	```

4. 安装Jekyll和github-pages

	```sh
	gem install jekyll -V
	gem install github-pages
	```

5. 安装代码语法高亮支持
Jekyll支持两种代码高亮机制。[参考链接](参考：http://jekyllrb.com/docs/templates/#code-snippet-highlighting)
	- pygments，它是基于Python的，要使用它，必须在windows上安装 Python, pip 和 Pygments 和 pip 之后， 可以使用 `python -m pip install Pygments` 命令来安装Pygments。不过我机子上已经安装了AnaConda，而Anaconda已经自带了Pygments。然后在_config.yml文件中设置 `highlighter: pygments` 。
	- Rouge，它是基于Ruby的，不过支持的语言较少。使用命令 `gem install rouge` 安装之后，在_config.yml文件中设置 `highlighter: rouge` 就行了。


6. 生成和服务
Jekyll 内置了可以自动监测源文件夹的变动并自动重新生成站点的机制。使用 --watch 选项（等效于 -w）即可使Jekyll自动重新生成站点。在命令行下切换到网站所在的目录，生成和托管服务站点之后，就可以在本地查看网站了，访问 [http://localhost:4000](http://localhost:4000) 即可。  
相关生成和服务的命令如下   

	```sh
	jekyll build
	jekyll build --watch
	jekyll build -w
	jekyll serve
	jekyll serve --watch
	jekyll serve -w
	```


## 编辑配置
> 编辑根目录下的_config.yml文件，没有则创建一个

下面是我的配置

```yaml
markdown: redcarpet
highlighter: pygments
redcarpet:
  extensions: ["no_intra_emphasis", "fenced_code_blocks", "autolink", "tables", "with_toc_data"]
lsi: false
safe: true

encoding: utf-8
timezone: Asia/Chongqing

permalink: /blog/:title.html

include:
  - .well-known

gems:
  - jekyll-sitemap

comments :
  provider : duoshuo
  duoshuo :
    short_name : nathan

title: Nathan Lui
url: # http://NathanLvzs.github.io
twitter: https://twitter.com/NathanLZS
github: https://github.com/NathanLvzs
baseurl: /
author:
  name: Nathan Lui
  nickname: Nathan
  email: lvzshen@outlook.com
  site: https://github.com/NathanLvzs/NathanLvzs.github.io
```


## 文章编写

举个栗子^_^   
在 /_posts 文件夹下建立一个文件，文件名包含今天的日期和文章的题目，格式为“year-month-day-title.md”，比如“2015-04-16-Give-Me-Five.md”，注意连字符是必要的。然后使用 Frontmatter 更新这篇文章的题目，设置相关的变量值（有permalink， tags，categories等）。更多关于Frontmatter的内容可以看看这里 [传送门](http://jekyllrb.com/docs/frontmatter/)

```
---
title: Yoyo，Give Me Five
layout: post
---
```
上面的Frontmatter指定了文章的题目为“Yoyo，Give Me Five”，使用名称为“post”的模板（当然模板也是要自己弄咯，或者用别人现成的）。
然后使用markdown或者html编写文章的主题内容即可。


## 其他
Jekyll 还有很多强大的功能，本文只是谈及了一些基本，更多的内容可以查看Jekyll的[文档](http://jekyllcn.com/docs/home/)。对于我而言，GitHub Pages 提供了一个很方便的建站渠道，结合一些插件满足了我大部分的需求，大家都可以试试哦:-)



