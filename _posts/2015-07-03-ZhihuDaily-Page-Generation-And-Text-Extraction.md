---
layout: post
title: 知乎日报数据网页输出及提取文章正文
categories: [python]
tags: [python]
published: true
---


## 前言

代码见[【我是占位符，待更新】](https://github.com/NathanLvzs)

系列博文：

- [知乎日报数据下载存储]({{ site.url }}/blog/ZhihuDaily-Data-Download.html)

- [知乎日报数据网页输出及提取文章正文]({{ site.url }}/blog/ZhihuDaily-Page-Generation-And-Text-Extraction.html)（即本文）

- [【我是占位符，待更新】]({{ site.url }}/blog/)


数据下载完成之后，可在本地生成日报文章的网页供阅读查看。生成本地网页，可以分为如下的几个部分的处理：

## CSS的处理

我们可以通过在浏览器上访问知乎日报中的任意文章，然后使用开发人员工具找出CSS样式文件的url，访问该url将CSS样式文件保存到本地即可。在我电脑上的保存路径为 `C:/Users/Zishen/Documents/Python Scripts/news_qa.auto.css` ，可以按需调整里面的样式，这里没有改动。


## html结构补齐

由于下载的文章html内容中缺失html头部等，需要补充上。参照网页端知乎日报文章的html代码，稍加修改，并将样式文件的地址指向本地的样式文件。

{% highlight html %}

<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<link rel="stylesheet" href="file:///C:/Users/Zishen/Documents/Python Scripts/news_qa.auto.css">
</head>
<body>

<!-- 将下载的文章html内容填充在body标签中 -->

</body>
</html>

{% endhighlight %}

将下载的文章html内容填充在body标签中即可得到要保存到html文件中的全部内容。


## 图像标签src的处理

至此，我们还需要将图像标签中的src属性值设置为本地路径。根据上一篇博文中提及的图像存储路径规则生成图像的本地路径字符串，然后用其来替换掉原来该图像的url值即可。

{% highlight python %}

imgdatepath = os.path.join(imgbasepath, str(dd.year), str(dd.month), str(dd.day))
for img in imgs: # imgs为一篇日报文章中所有图像的ImageUrlMap对象list
    imgpath = os.path.join(imgdatepath, img['localName'])
    imgpath = "{0}{1}".format("file:///", imgpath)
    filecontent = filecontent.replace(img['oriUrl'], imgpath)

{% endhighlight %}


替换完成之后即可将内容保存成html文件了，文件命名格式为 `id-title.html`。打开之后页面瞬间就加载完成了，接着就可以愉快的阅读日报文章了~



## 提取文章正文

一开始打算使用正则表达式来清除html标签，去除无关的信息，从而得到正文的内容。但是这么做十分麻烦，需要确定那些无关信息的正则表达式，需要不断的调试，可能会事倍功半。于是后来决定用[PyQuery](http://pythonhosted.org/pyquery/)来处理。

通过分析发现，下载下来的文章html中包含一些跟文章内容无关的标签，对应有答题者的信息以及最后的“查看更多”。通过使用PyQuery可以很简单地将它们清除掉。

{% highlight python %}

# id对应的Article对象
arti = artiCollOper.findOneByValue('id', id)
domTree = pquery(arti['body'])
# 去除答题者信息，“查看更多”
domTree.remove(".meta")
domTree.remove(".view-more")
# 提取class=content-inner的标签的text内容
pcontent = domTree.find(".content-inner").text().encode('utf-8')
# 拼接文章标题和上面的text内容，一同作为该文章的正文
pcontent = "{0} {1}".format(arti['title'].encode('utf-8'), pcontent)

{% endhighlight %}

上面的代码比较简单，也加了注释，就不再赘述了。

通过上面的处理，可以得到每一篇日报文章的正文，然后连同该文章的id、对应的日期信息存储到MongoDB中，以方便后面的处理分析。


