---
layout: post
title: DistriFrame
categories: [DistriFrame, .NET]
tags: [DistriFrame, .NET]
published: false
---


## 项目背景

2014.10 - 2015年初，当时我在读研一。实验室开发了【中大声图】软件用以模拟大范围城市道路交通噪声，之前在计算大区域（比如广州市）的交通噪声情况，往往都会使用实验室的服务器来进行计算，虽然该服务器性能比普通台式机强大很多，但是计算仍然耗时很久。而实验室有着挺多台台式机，老马跟我商量说想利用这些台式机来做多机并行计算，这样能够显著降低计算耗时。

然后开始着手，花了一些时间了解分布式计算的一些知识和技术。由于【中大声图】是使用C#写的，在了解了.NET平台的分布式技术框架之后，决定用WCF来设计实现一个局域网分布式计算通用小框架【DistriFrame】，使得【中大声图】的计算模块在实现该小框架要求的接口之后即可实现多机并行计算。当时由于上课等种种原因，并没有较多时间来推进。再后来决定去HK读CS MSc，考雅思、申请等占据了部分时间，还有由于设计的变更导致部分代码的重写等，导致推进速度比较慢。

到了三月份的时候，老马做毕业设计需要用到这部分的功能，问我什么时候能够弄得差不多，我说来不及，然后老马就自己上了，基于ASP.NET MVC搭建了服务端，在中大声图的基础上实现了计算客户端（如果没记错的话），最后他弄好之后效果还不错的样子。

我还是沿着自己的想法在弄，慢慢地逐步实现，大致实现了一个比较简陋的小框架。不过设计和实现上可能还存在一些问题，模式比较单一，待添加更多更灵活的模式功能。

现在，离开了原来的实验室，没有了需要并行计算的任务，感觉继续这个项目貌似仅剩提升锻炼自我之用了，虽然这个动力挺大的，但苦于没那么多时间。现在打算逐步整理一下，以后有空再慢慢继续完善它吧。



开发环境：Windows8.1 ×64，Visual Studio 2013，.NET Framework 4.0。

DistriFrame在设计上主要参考了[【BONIC】](http://boinc.berkeley.edu/)。

代码见[GitHub](https://github.com/NathanLvzs/DistriFrame)


## 概要说明

- 基于.NET平台：使用.NET 4.0实现；为已实现本框架要求接口的.NET程序提供局域网分布式计算能力。

- C/S架构，服务端程序为DistriServer，客户端程序为DistriClient。DistriInterface为相关的类和接口程序集，计算程序必须实现其中的一些类和接口才能进行分布式计算。

- project表示一个完整的计算项目；project segment表示从一个project中分解出来的多个子计算项目中的一个，作为计算的单元。

- 服务端用于project的建立和对计算任务的分配及管理，如果一个project的各个segment都已计算完成并返回，则服务端会对计算结果进行合并。

- 客户端相当于一个分布式计算节点，用于真正执行分布式计算任务。客户端向服务端请求计算任务进行计算，计算完成之后将结果返回给服务端。

- 客户端支持单线程、多线程模式进行计算。

- 客户端使用AppDomain构建分布式任务的执行环境。每个计算任务在一个独立的AppDomain中执行。

- 客户端使用反射动态加载程序集和调用计算方法。

- 使用WCF技术处理服务端和客户端之间的通信。

- 使用序列化技术来传递被调用的对象。



## 设计说明

### 文件目录设计

确保project、segment的文件夹命名唯一：使用普通字符串组合GUID的形式

- 服务端project文件夹命名：ProjectName-ProjectID

- 客户端segment文件夹命名：ProjectName-ProjectID

#### 服务端

{% highlight text %}

- 服务端程序及配置

- project list file

- projects（下面是每个子文件夹的布局）

    > - bin（执行文件的文件夹）

    > - config（配置文件）

    > - data（最原始、未分割的数据）

    > - segments（其子文件夹即为各Segment，再下面包含segment的xml、数据、结果等）

    > - result（汇总的结果文件夹）

{% endhighlight %}


#### 客户端

{% highlight text %}

- 客户端程序及配置

- project segment list file

- projects（下面是每个子文件夹的布局）
    > - bin

    > - config

    > - data

    > - result

    > - 该project的基础信息、统计信息等，XML格式

{% endhighlight %}


### 设置

所有的设置都以XML文件的形式保存，在程序启动时自动加载，如果设置文件不存在，则使用默认设置并保存成文件。

客户端设置项

{% highlight text %}

服务端IP及端口

计算模式

并发计算数量

{% endhighlight %}


服务端设置项

{% highlight text %}

IP及端口

{% endhighlight %}


### project建立模式

project建立时增加是否需要split、是否需要merge的勾选项，也在程序中进行判断勾选的选项是否正确。

{% highlight text %}

- SplitOnly
> 指定一个文件夹，里面包含bin、config、data文件夹，data文件夹中的文件用以split形成projectsegment的数据，config待考虑。。。不需要merge
- MergeOnly
> 指定一个文件夹，里面包含bin、config、data文件夹，data文件夹中包含多个子文件夹，一个子文件夹对应一个projectsegment（严格来说是对应一个projectsegment的数据），该子文件夹的名称将被作为projectsegment的名称，其中的内容将被作为projectsegment的计算数据，已经分割好任务了。需要merge
- SplitAndMerge
> 指定一个文件夹，里面包含bin、config、data文件夹，data文件夹中的文件用以split形成projectsegment的数据，config待考虑。。。需要merge
- NotSplitNorMerge
> 不需要split，有两种情况：单独一个segment，已经split好了。也不需要merge

{% endhighlight %}


### 处理流程

#### 服务端

- 本地创建project：保存文件并生成segment、保存segment和project信息、更新project list并保存

- 接收客户端返回的结果并更新：保存计算结果、更新并保存segment信息、检查合并、更新并保存project、更新并保存project list

#### 客户端

- 远程获取并本地创建：segment文件保存、加入segment list

- 本地获取：查询segment list、（update segment）

- 本地计算：持有单个segment、update并保存segment信息、保存segment list

### 客户端计算模式

- Single单线程模式：同步向服务端获取计算任务，获取完成之后向本地的segment manager获取待计算任务，计算完成之后将结果返回到服务端。

- Multiple多线程模式：异步向服务端获取计算任务；一旦检测到本地有待计算任务时就会启用新线程进行计算，计算完成之后将结果返回服务端。注：进行中任务数量有上限（可设置），当上限设为1时，并不等同于Single模式。


### 计算任务DLL设计



{% highlight c# %}

{% endhighlight %}


