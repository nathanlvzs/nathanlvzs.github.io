---
layout: post
title: Python virtualenv
categories: [Python]
tags: [Python]
published: true
---

> 注：本文内容主要改译自【**Practical Data Science Cookbook**】第一章中关于virtualenv的内容。如有纰漏，敬请指正。


virtualenv是一个非常有用的python工具，它能够使用已安装的python发行版来创建新的本地虚拟python环境。一旦你在shell中启用了该环境，你就可以轻松地在这个本地虚拟python环境中使用`pip install`来安装packages。


## 为何要使用virtualenv

- 能够有效解决packages的依赖以及版本问题：设想一下你要开发两个应用（分别为AppA，AppB），它们都依赖于同一个库（称之为LibraryA），但是AppA要求LibraryA的0.8版本，AppB要求LibraryA的1.0版本。而系统的python环境只能允许安装LibraryA的一个版本，这时候virtualenv就可以大显神通啦，我们可以为这两个应用分别创建一个本地环境（分别为EnvA，EnvB），然后在EnvA中安装AppA依赖的所有库，在EnvB中安装AppB依赖的所有库即可，这样不会弄乱系统python环境。这样在开发相应的应用时切换到相应的环境中即可。

- 不需要系统权限：通常我们在系统python环境中安装packages时需要管理员权限，而是用virtualenv，我们可以不需要管理员权限，快速地搭建好依赖环境。

- 帮助有效开发协作：虚拟环境能够确保开发的软件在不同的机器（开发机器、部署机器等）上、在不同的依赖情况下运行，使得软件能够被独立测试，协同开发。


## 安装及使用virtualenv

### 安装

使用pip来安装virtualenv。

{% highlight sh %}

pip install virtualenv

{% endhighlight %}

由于我的机器上跑的是windows，使用了Anaconda套件，conda提供了类似的虚拟环境功能，尝试安装virtualenv时会有如下的提示。

![Image]({{ site.url }}/images/posts/2015/2015-09-10/2015-09-10-conda-pip-virtualenv.png)


### 使用

下面是linux上使用virtualenv的过程。

首先创建一个目录（名称为temp），然后切换工作目录到该目录，创建一个虚拟环境。

{% highlight sh %}

mkdir temp
cd temp
virtualenv venv

{% endhighlight %}

创建过程中会出现一些提示文本。完成之后我们就可以使用该虚拟环境了。使用下面的指令来启用该虚拟环境。

{% highlight sh %}

source ./venv/bin/activate

{% endhighlight %}

值得注意的是，用来启用虚拟环境的脚本并不是可执行的，只能通过`source`指令来启用。

接下来可以使用`which python`指令来查看当前python环境的指向路径，在这个例子下，该指令的输出是以“/temp/venv/bin/python”结尾的，也就是说虚拟环境启用之后，当你输入`python`，运行的就是本地python啦。

然后我们使用pip来安装一些库，比如

{% highlight sh %}

pip install flask

{% endhighlight %}

在安装了一些依赖库之后，可以使用如下的指令来将所有安装的库的记录输出

{% highlight sh %}

pip freeze > requirements.txt

{% endhighlight %}

可以使用`cat requirements.txt`来查看输出的文件的内容，里面的每一行就是一条安装记录，包含库的名称以及版本号，比如

{% highlight text %}

Flask==0.10.1

{% endhighlight %}

以后如果我们有一个新的虚拟环境，需要安装requirements.txt里面那些指定名称和版本的库的话，只需要执行如下的指令即可。

{% highlight sh %}

pip install -r requirements.txt

{% endhighlight %}


要停用虚拟环境的话，只需要在命令行中输入`deactivate`即可。


## 其他注意事项

对于那些复杂库，如果需要在虚拟环境中安装，通常需要外部依赖才能编译安装，编译不仅繁琐而且可能容易失败。

通常的做法是：使用操作系统的包管理器来安装这些复杂库到系统python环境中，在初始化虚拟环境时使用`--system-site-packages`标志，这个标志告诉virtualenv工具使用那些已经在系统环境中安装的包从而避免重新编译安装那些库。如果需要在虚拟环境中安装某个已在系统环境中安装的库，可以使用`pip install -I`指令来实现，`-I`选项用于忽略系统环境库。

上述这个做法通常适用于你只在系统环境中安装规模较大的库，而使用virtualenv来满足其他的开发需求。


## 更多参考

- [http://docs.python-guide.org/en/latest/dev/virtualenvs/](http://docs.python-guide.org/en/latest/dev/virtualenvs/)

- [https://pypi.python.org/pypi/virtualenv](https://pypi.python.org/pypi/virtualenv)


> 好吧，发现书上这部分内容跟python virtualenv官方文档几乎一模一样。。。权当学习翻译一下了==

