---
layout: post
title: 知乎日报XXX
categories: [python]
tags: [python]
published: true
---


## 前言

路线

1. 下载新闻数据，保存到MongoDB或保存成文件

2. 根据已下载数据生成网页供本地查看

3. 对文本数据进行清洗处理供分析使用

4. 文本数据分类，提取主题

代码见[【我是占位符，待更新】](https://github.com/NathanLvzs)

将通过以下文章进行阐述：

- [【我是占位符，待更新】](http://nathanlvzs.github.io/blog/)

- [【我是占位符，待更新】](http://nathanlvzs.github.io/blog/)

- [【我是占位符，待更新】](http://nathanlvzs.github.io/blog/)


对于知乎日报数据的下载保存，可以分为如下的几个部分的处理：

## 生成本地网页

样式的处理：CSS样式暂时从文件获取，如有需要可以在html头部添加<style></style>标签。
加载显示文章的时候替换图片原地址为本地地址


html结构补齐

{% highlight html %}

<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<link rel="stylesheet" href="file:///C:/Users/Zishen/Documents/Python Scripts/news_qa.auto.css">
</head>
<body>

{% endhighlight %}


中间为文章内容


{% highlight html %}

</body>
</html>

{% endhighlight %}


## html数据的处理

一开始打算使用正则表达式来清除html标签，去除无关的信息，从而得到正文的内容。但是这么做十分麻烦，需要确定那些无关信息的正则表达式，需要不断的调试，可能会事倍功半。于是去查找有没有别的解决方法。经过一番搜索之后发现了[PyQuery](http://pythonhosted.org/pyquery/)这个库，它是JQuery的Python实现，移植了JQuery大部分的功能。之前使用过JQuery，感觉挺方便的，于是决定使用PyQuery来处理。

通过分析发现，下载下来的文章html中包含一些跟文章内容无关的标签：





[Link](https://github.com/NathanLvzs)

![Image]({{ site.url }}/images/posts/2015/2015-04-18/2015-04-18-CDF.png)



{% highlight python %}

{% endhighlight %}







