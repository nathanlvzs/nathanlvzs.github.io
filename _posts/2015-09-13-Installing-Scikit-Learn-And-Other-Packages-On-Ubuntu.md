---
layout: post
title: 在Ubuntu上安装scikit-learn等Python packages
categories: [python, ubuntu]
tags: [python, ubuntu]
published: true
---

最近在看关于文本处理的一些东西，想按照scikit-learn的[Working With Text Data](http://scikit-learn.org/stable/tutorial/text_analytics/working_with_text_data.html)教程来学习一下。机子上跑的windows，平时用python的话都是用Anaconda，到Anaconda的scikit-learn包文件夹下面没有找到教程上面说的`scikit-learn/doc/tutorial/text_analytics/`文件夹，于是想在Ubuntu虚拟机上安装scikit-learn，这样估计就能有需要的教程资源。


## 安装Python

Ubuntu 14.04 自带了Python 2.7 和Python 3.4，默认使用Python 2.7。所以这里并不需要做什么，只要通过下面的指令看看python是否安装正确。

在命令行中输入：

{% highlight sh %}

which python

{% endhighlight %}

Ubuntu14.04输出结果：

{% highlight text %}

/usr/bin/python

{% endhighlight %}

在命令行中输入：

{% highlight sh %}

python --version

{% endhighlight %}

Ubuntu14.04输出结果：

{% highlight text %}

Python 2.7.6

{% endhighlight %}


## 安装常用packages

在命令行中输入：

{% highlight sh %}

sudo apt-get install build-essential python-dev python-setuptools python-numpy python-scipy python-matplotlib ipython ipython-notebook python-pandas python-sympy python-nose

{% endhighlight %}

提示依赖`dpkg-dev`，故需先安装它。

在命令行中输入：

{% highlight sh %}

sudo apt-get install dpkg-dev

{% endhighlight %}

又提示失败，依赖libdpkg-perl，而且还是1.17.5ubuntu5版本的，系统里已经有了更加新的版本。。。所以要先安装libdpkg-perl。

于是，安装上面所述的依赖顺序来安装即可。

在命令行中输入：

{% highlight sh %}

sudo apt-get install libdpkg-perl=1.17.5ubuntu5

sudo apt-get install dpkg-dev

sudo apt-get install build-essential python-dev python-setuptools python-numpy python-scipy python-matplotlib ipython ipython-notebook python-pandas python-sympy python-nose

{% endhighlight %}


## 安装pip

下载[get-pip.py](https://bootstrap.pypa.io/get-pip.py)，切换工作目录到保存get-pip.py的目录，执行下面指令即可安装pip。

{% highlight sh %}

sudo python get-pip.py

{% endhighlight %}

查看已安装的packages，在python中输入：

{% highlight python %}

import pip
print(pip.get_installed_distributions())

{% endhighlight %}


## 安装scikit-learn

根据官方的[安装教程](http://scikit-learn.org/stable/install.html#installation-instructions)来安装。上面已经安装了scikit-learn的一部分依赖库，所以下面命令中只输入了缺少的依赖库。

在命令行中输入：

{% highlight sh %}

sudo apt-get install libatlas-dev libatlas3gf-base

sudo update-alternatives --set libblas.so.3 \
    /usr/lib/atlas-base/atlas/libblas.so.3

sudo update-alternatives --set liblapack.so.3 \
    /usr/lib/atlas-base/atlas/liblapack.so.3

pip install --user -U scikit-learn

{% endhighlight %}

这样就可以成功安装scikit-learn了，由于加了`--user`参数，scikit-learn是安装在用户目录下`.local`文件夹下的。

当然还有更加简单的方法。直接使用如下的指令，它会自动安装scikit-learn依赖的那些库，不像上面那么费劲。

{% highlight sh %}

sudo apt-get install python-sklearn

{% endhighlight %}


## 安装其他packages

{% highlight sh %}

sudo pip install networkx ggplot virtualenv

{% endhighlight %}


## 后记

一番折腾之后，到scikit-learn的目录下面找，还是没有找到苦苦寻觅的教程资源。。。使用文件管理器搜索，在系统中也没有找到相关记录。。。坑啊，只好另想方法。一阵尝试之后，最后到Github上搜索`scikit-learn`，找到官方的Repo，发现有doc文件夹，点进去看果然有text_analytics文件夹！如下图。

![Image]({{ site.url }}/images/posts/2015/2015-09-13/2015-09-13-Tutorial-Repository-Screenshot.png)

此时意识教程上面可能默认大家的安装方式是将它的repo pull下来自己build安装。怪不得之前到处找不到`scikit-learn`文件夹，只能找到`sklearn`文件夹。现在这样子的话`scikit-learn/doc/tutorial/text_analytics/`这个路径也就说得通了。最后把官方的repo整个clone了下来。

汗，一点小事情折腾了好久。。。时间啊。。。


## 更多参考

- [http://scikit-learn.org/stable/install.html#installation-instructions](http://scikit-learn.org/stable/install.html#installation-instructions)

- [http://stackoverflow.com/questions/739993/how-can-i-get-a-list-of-locally-installed-python-modules](http://stackoverflow.com/questions/739993/how-can-i-get-a-list-of-locally-installed-python-modules)

