---
layout: post
title: PAC代理网络下Python网络请求
categories: [Python, Web]
tags: [Python, PAC]
language: zh
published: true
---

在一些公司环境中，办公机器的网络请求往往要经过PAC代理脚本的处理。

打开IE，查看`Internet选项`窗口中的`连接`标签页，点击下方的`局域网设置`按钮，即会弹出`局域网(LAN)设置`的新窗口，如果公司公司使用了PAC代理的话，则可以在该窗口中看到`使用自动配置脚本`是被勾选了的，`地址`对应的文本框即是该PAC脚本的地址，举一个虚拟的例子：http://proxy.server.com/proxy.pac 。

那么，在Python中，直接进行网络请求是行不通的，那怎么办呢？

经过搜索了解，我找到了一个包，pypac，在通常情况下，可以直接pip安装。

```bash
pip install pypac
```

然而，直接pip安装肯定是不行的，想想就知道了。搜索了一番，也没找到方法可以使得pip在PAC代理的情况下工作。

于是只好把pypac以及它的依赖包全都下载下来然后离线安装了。

安装完成后，没有什么意外的话，就可以在Python中进行网络请求了。

使用代码如下。

{% highlight python %}

from requests.auth import HTTPProxyAuth
from pypac import PACSession

username = 'username'
password = 'password'

requester = PACSession(proxy_auth=HTTPProxyAuth(username, password))
r = requester.get('http://www.baidu.com')
print(r.status_code)

{% endhighlight %}

在使用过程中，发现pypac所依赖的js2py会超过最大的递归深度，通过在代码中加大了允许的递归深度最大值解决了这个问题。代码示例如下。

{% highlight python %}

import sys
sys.setrecursionlimit(10000)

{% endhighlight %}

再后来，出现了`Python IndentionError: too many levels of indentation`问题。

通过查看pypac的源码，判断是由pypac所依赖的js2py根据PAC这个js脚本文件转换生成的Python结果代码中缩进层级过多造成的。由于之前没有出现过这个问题，猜测是由于PAC文件更新了，里面的条件判断语句变得更加复杂了。

由于我的网络请求目标主要是百度和必应，阅读PAC文件内容后发现并没有对这两个网站的特殊判断处理，那么可以按如下的方式解决。

1. 下载PAC脚本文件到本地，在其判断条件过多的分支语句中，将（对自己而言）不需要的条件删除。

2. 修改pypac包中的api.py文件中的`get_pac`方法，让其直接读取 修改后的PAC脚本文件 ，而不是每次被调用时都访问公司PAC文件所在的地址。


以上。


