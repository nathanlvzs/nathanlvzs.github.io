---
layout: post
title: Python基本用法备忘
categories: [python]
tags: [python]
published: true
---

> 之前接触过Python，但使用不多。最近由于跟UC-Berkeley的Spark入门课程（[传送门](https://www.edx.org/course/introduction-big-data-apache-spark-uc-berkeleyx-cs100-1x)）和拉取知乎日报的数据需要使用Python，使用过程中经常要不断搜索、查看文档，比较繁琐，于是将自己不熟的用法以及一些tricks记录一下，供以后补充及翻阅。


## 常用帮助函数

{% highlight python %}

# 用于查看对象的类型
type(object)

# 用于查看对象的所有属性
dir(object)

# 用于查看关于对象的帮助信息
help(object)

{% endhighlight %}


## tuple

tuple是不可变类型，一旦创建就不可再更改

{% highlight python %}

pair = (3,5)
x,y = pair  # x=3, y=5

{% endhighlight %}


## list

list中存的每一个元素可以是任意Python对象。索引从0开始。

{% highlight python %}

# 创建一个list并打印所有元素
ll = [1, 2, 3]
for num in ll:
    print num

# 获取索引从start到stop-1的元素
ll[start:stop]

# 拼接两个list
[1, 2] + [3, 4] # 得到[1, 2, 3, 4]

# 获取list中不重复元素
set([1, 1, 2, 3]) # 返回[1, 2, 3]

# list comprehension
nums = [1,2,3,4,5,6]
oddNums = [x for x in nums if x % 2 == 1]
strings = ['Hello World','Python','Hi']
print [x.lower() for x in strings if len(x) > 5]

{% endhighlight %}


## set

常见集合操作

{% highlight python %}

setOfBooks - setOfFavoriteBooks # 差difference

setOfBooks & setOfFavoriteBooks # 交intersection

setOfBooks | setOfFavoriteBooks # 并union

{% endhighlight %}


## dictionary

键必须是不可变类型immutable type (string, number, or tuple)

{% highlight python %}

# 遍历键值对
dd = {"1": 1, "2": 2, "3": 3}
for word, num in dd.items():
    print word, num

# 判断是否含有指定的键key
dd.has_key(key)

# 返回键对象的迭代器
dd.iterkeys()

# 返回键值对对象的迭代器
dd.iteritems()

# 返回包含所有键的list对象
dd.keys()

# 返回包含所有值的list对象
dd.values()

# dictionary comprehension
[dd[k] for k in dd]

{% endhighlight %}


## class

- 使用名为__init__的方法完成初始化

- 使用名为__del__的方法完成析构操作

- 所有的实例方法都拥有一个self参数来传递当前实例，类似this

- 静态方法使用@staticmethod来标记

- 使用__class__来访问类型成员

- 类有一些特殊的属性，比如__doc__类型帮助信息，__name__类型名称，__module__所在模块，__bases__所继承的基类，__dict__类型字典

- 支持多继承，基类的初始化和析构方法要显式调用。继承方法的调用和基类声明顺序有关

- 类包含类型和实例两种成员。在成员名称前面加“__”使其成为私有成员


class定义示例（源自UCBerkeley某个课程的某个网页，记不清了。。删了个别方法定义以控制篇幅）：

{% highlight python %}

class FruitShop:

    def __init__(self, name, fruitPrices):
        """
            name: Name of the fruit shop
            
            fruitPrices: Dictionary with keys as fruit 
            strings and prices for values e.g. 
            {'apples':2.00, 'oranges': 1.50, 'pears': 1.75} 
        """
        self.fruitPrices = fruitPrices
        self.name = name
        print 'Welcome to the %s fruit shop' % (name)
        
    def getCostPerPound(self, fruit):
        """
            fruit: Fruit string
        Returns cost of 'fruit', assuming 'fruit'
        is in our inventory or None otherwise
        """
        if fruit not in self.fruitPrices:
            print "Sorry we don't have %s" % (fruit)
            return None
        return self.fruitPrices[fruit]
    
    def getName(self):
        return self.name

{% endhighlight %}


## 其他

使用Python实现快速排序的代码很简短，如下：

{% highlight python %}

def quickSort(lst):
    if len(lst) <= 1: 
        return lst
    smaller = [x for x in lst[1:] if x < lst[0]]
    larger = [x for x in lst[1:] if x >= lst[0]]
    return quickSort(smaller) + [lst[0]] + quickSort(larger)

{% endhighlight %}


关于range和xrange：range方法执行返回包含整型数值的list对象，而xrange返回一个生成器，它只有在需要的时候才会生成数值，在需要生成一个很大范围的整型数值集合时，xrange内存效率高。
{% highlight python %}

# 1 .. 10000
data = xrange(1, 10001)

{% endhighlight %}



