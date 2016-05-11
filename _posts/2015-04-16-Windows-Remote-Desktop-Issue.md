---
layout: post
title: Windows远程桌面Credentials did not work
categories: [Miscellaneous]
tags: [Windows]
language: zh
published: true
---

电脑（暂且叫做小C）系统装的是win8.1 ×64，当初使用的是微软账号，最近需要将其设置为本地账号，账号名为LZS，除此之外其他设置是没有改变的。之前在另外一台电脑（小A，win8.1 ×64）上使用微软账号 destinydev@outlook.com 作为用户名是可以远程连接到小C的，远程桌面连接页面如下图所示。

![Original-Username]({{ site.url }}/media/images/posts/2015/2015-04-16/2015-04-16-Original-Username.png)

但是将小C设置为使用本地账号之后，在小A那里使用LZS的用户名没法远程到小C了，错误提示页面如下图所示。

![Credentials-didn't-work]({{ site.url }}/media/images/posts/2015/2015-04-16/2015-04-16-Credentials-didn't-work.png)

在网络上搜索了一下，并尝试了一些做法，还是没效果。不过看到一篇帖子（其具体做法不适用）之后，依稀想起好像见过用户名前面带有主机名的，然后将用户名设置为LZS-PC\LZS，如下图所示。

![Correct-Username]({{ site.url }}/media/images/posts/2015/2015-04-16/2015-04-16-Correct-Username.png)

然后就能远程了。。。原来前面加的“LZS-PC”是用来指定所谓的“域”的。接着在别人的Windows7（称为小B吧）上尝试远程桌面连接小C，直接使用LZS的用户名也是无法连接，也是用LZS-PC\LZS才行；接着用小B尝试连接另外一台Windows7的机子（小D），不需要指定域，直接使用小D的用户名就可以连接了。

从上面的试验中可以得知，显然是由于目标主机的系统是Windows8.1。猜测之前直接使用用户名 destinydev@outlook.com 可以直接远程连接的原因是远程桌面的程序是根据用户名是邮箱来使用默认的域MicrosoftAccount。

也没什么兴趣深究下去，此文权当记录一下。

以上。

