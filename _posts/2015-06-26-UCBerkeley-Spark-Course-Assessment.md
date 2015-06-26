---
layout: post
title: UCBerkeley的Spark入门课程评价
categories: [MOOC]
tags: [MOOC]
published: true
---

> 这门课程（[传送门](https://www.edx.org/course/introduction-big-data-apache-spark-uc-berkeleyx-cs100-1x)）是在edX平台上的。参与的人数很多，毕竟Big Data、Spark什么的现在很热。。。开课时的那段时间我有些空闲，而且想跟的几门课程都还要过一段时间才开，想着体验一下UCBerkeley的MOOC，涨涨姿势，于是就跟了这门课程。


## 课程讲授及内容

课程内容主要是介绍了Data Science相关的知识。Syllabus上五周的课程内容为：

- Big Data and Data Science

- Introduction to Apache Spark

- Data Management

- Data Quality, Exploratory Data Analysis, and Machine Learning

- Data Management

现在第四周结束，一路下来，感觉内容上介绍性的东西比较多，概念比较多，可能对于了解比较少的同学帮助大一些，由于我之前有过一些接触，所以对这部分不是挺感冒。对于Spark，涉及了设计理念、Spark与hadoop相关的比较、一些常用的Spark API的介绍等等，note做的不错，条理性也挺好的。不过毕竟是入门课程，想要深入的话必须get your hands dirty，不断实战才行。

这门课程的quiz的答题次数是不限制的。。。课程的quiz只包含了一些选择题，而且都是比较直白的，听完相应小节的课程或者看了lecture note的话都可以容易地得到答案，当然有一些DS基础的话不听课不看note也可以挺容易地得到正确答案。所以，quiz的设计比较一般。

关于老师的讲授，个人感觉基本上是在念pp的样子啦。一开始的两周我都还坚持把课程视频看完，但慢慢地觉得看视频需要先把视频下下来（个人习惯，总是觉得本地看视频的体验比线上好多了），比较麻烦，而且视频上的讲授跟自己看lecture note差不多，看完视频后还是要看note的，要花费的时间太多，于是后来就没怎么看课程视频了。


## Lab

Lab 0是关于环境搭建的。所有的lab需要使用virtual box和vagrant，课程中有step by step的搭建教程。在安装好那两个软件之后，需要使用vagrant up命令在命令行下联网到vagrant的网站下载课程的虚拟机镜像，貌似需要翻墙，下了几次老是出错，于是找到该镜像文件的下载地址然后用QQ旋风去下载，接着看了一下vagrant的文档鼓捣了一下就好了。

Lab的评分是使用部署在亚马逊云上的autograder，可自动伸缩扩展，但效果比较一般，有可能是由于没有预料到参与人数太多，购置的资源稍少吧，有时候提交作业需要等不止半个小时才能得到反馈。不过总体来说还好。Lab的due date之后还有三天的grace period，所以用来完成Lab的时间还是挺充裕的，每次Lab有10次的有效提交次数。

四个lab的主题如下：

- Lab 1: Learning Apache Spark

- Lab 2: Web Server Log Analysis with Apache Spark 

- Lab 3: Text Analysis and Entity Resolution

- Lab 4: Introduction to Machine Learning with Apache Spark

个人觉得，这门课最大亮点之一就是Lab了。Lab的设计贴近实际使用场景，也比较有趣实用，个人比较喜欢。每个Lab都十分详细，不过个别可能称得上繁琐了（篇幅太长了，看得眼睛难受==）。Lab里面覆盖了涉及的相关理论、比较详细的实施步骤等，然后让你实现某一些步骤。

基本上是使用PySpark的API和Python的基本知识就能完成了。让你体验一下使用Spark处理分布式任务，考虑如何使用Spark的计算框架来实现分布式计算任务。要得到一个结果，中间过程可能需要进行很多的transform，比如：

{% highlight python %}

amazonInvPairsRDD
                .join(googleInvPairsRDD).map(lambda x: swap(x)).groupByKey()
                .cache()

{% endhighlight %}

Lab还挺锻炼你如何用一条Python语句来完成很多事情(● ω ●)，比如下面的语句，以前我都是写一个for循环的，要三行语句的样子。

{% highlight python %}

sum([(amazonWeightsBroadcast.value[amazonRec][tk] * googleWeightsBroadcast.value[googleRec][tk]) for tk in tokens])

{% endhighlight %}

关于Lab，值得吐槽的是涉及的中间变量太多了，我做lab的时候比较多的时间都是花费在搞清每个变量的数据结构，处理完一部分之后就忘了其他变量的，每做一部分都要重新去弄清相关变量的结构（个人觉得如果在做Lab的过程中将所有的变量的结构记录在纸上，需要时查查可能效率高一些）。。。而且错误信息以及调用堆栈信息感觉没多大帮助，debug难度比较大。

Lab 1 用了三个多钟；Lab 2 用时四个钟左右；Lab 3 用了差不多8个钟。。。做lab 3 的时候由于变量的数据结构混淆以及autograder的问题搞得很烦躁== 有点期待Lab 4~

不过，总体来说Lab很赞！


## Discussion

课程的讨论并没有使用edX自身的discussion forum，而是使用了piazza。piazza用户体验比edX的论坛好多了。由于参与这门课的人数特别多，piazza上讨论挺热烈的。piazza还会每天都推送当天的相关讨论到你的邮箱中，这点也挺好的。piazza是这门课的另一个大亮点。

我讨论热情比较一般，都没怎么发言。一般都是有问题时到论坛上搜索一下别人问相关问题的帖子，看了别人的回答之后一般也就解决了。这点需要改进一下，还是要多交流才好。


## 后记

虽然五周的课程长度稍微短了些，不过毕竟是入门课程。总体上，蛮好的，Lab让我收获挺大。当初跟这门课程也只是赶赶潮流，满足一下好奇心，涨涨姿势，现在看来收获超出预期了~

还剩最后一周的内容，课程还没完就开始写评价了也是有些心急。。。今天想写写就写了吧，课程完结之后如有需要再补充了。最后，贴上当前的完成进度~

![Image]({{ site.url }}/images/posts/2015/2015-06-26/2015-06-26-SparkCurrentProgress.png)


