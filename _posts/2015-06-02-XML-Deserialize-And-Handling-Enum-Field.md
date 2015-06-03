---
layout: post
title: C#中XML反序列化以及Enum字段的处理
categories: [.Net]
tags: [.Net, Deserialize, Enum]
published: true
---

> 环境：VS2013，.Net Framework 4

## XML反序列化

我有一个Config类，使用单例模式，里面有一些静态字段用以保存程序的相关配置信息，有一些成员字段作为辅助。我需要将其中的静态字段保存成文件，通常可以将其序列化存储为XML或者JSON格式的文本文件，我选择的是XML文件，由于配置项比较少，保存和加载时性能要求低，所以选哪个都差不多。

序列化的实现就不赘述了。

当程序启动时，会寻找XML配置文件，如果存在则加载其中的配置，否则使用程序中hard-coded的配置。

加载配置主要是读取该XML文件中的节点内容并将其赋值给Config类中相应的静态字段。主要使用了反射，先找出Config类中的私有静态字段的集合，然后遍历该集合，对每一个字段，找出其在XML文档中的值字符串，将值字符串转换为该字段的类型数据，再给该字段赋值即可。代码如下。

{% highlight c# %}

/// <summary>
/// 获取XML文档的根节点对象
/// </summary>
/// <param name="xmlpath">XML路径</param>
/// <returns></returns>
public static XElement GetRootElement(string xmlpath)
{
    return XElement.Load(xmlpath);
}

/// <summary>
/// 获取一个节点的内容
/// </summary>
/// <param name="root">根节点对象</param>
/// <param name="nodeName">子节点名称</param>
/// <returns></returns>
public static string GetSingleNodeValue(XElement root, string nodeName)
{
    var xElement = root.Element(nodeName);
    return xElement == null ? null : xElement.Value;
}

/// <summary>
/// 加载XML文件，设置泛型的所有私有静态字段的值
/// </summary>
/// <typeparam name="T">泛型类型</typeparam>
/// <param name="loadpath">XML路径</param>
public static void LoadGenericStaticXml<T>(string loadpath)
{
    Type curtype = typeof(T);
    XElement root = GetRootElement(loadpath);
    FieldInfo[] fis = curtype.GetFields(BindingFlags.Static | BindingFlags.NonPublic);
    // 遍历，设置各字段的值
    foreach (FieldInfo item in fis)
    {
        string fieldstrval = GetSingleNodeValue(root, item.Name);
        object obj = Convert.ChangeType(fieldstrval, item.FieldType);
        item.SetValue(null, obj);
    }
}
{% endhighlight %}

## Enum字段的处理

上面的代码在处理枚举字段时会抛出无效转换的异常。我定义的枚举如下：

{% highlight c# %}
public enum CalculationMode
{
    Single = 1,
    Async = 2,
    Mixed = 3
}
{% endhighlight%}

看了下FieldInfo的文档，它有个BaseType属性，表示该字段数据类型直接继承的类型，对于枚举引用，它的BaseType为Enum，这个可以将其和其他类型对象区分开来。改进之后的LoadGenericStaticXml方法代码如下。

{% highlight c# %}

/// <summary>
/// 加载XML文件，设置泛型的所有私有静态字段的值
/// </summary>
/// <typeparam name="T">泛型类型</typeparam>
/// <param name="loadpath">XML路径</param>
public static void LoadGenericStaticXml<T>(string loadpath)
{
    Type curtype = typeof(T);
    XElement root = GetRootElement(loadpath);
    FieldInfo[] fis = curtype.GetFields(BindingFlags.Static | BindingFlags.NonPublic);
    // 遍历，设置各字段的值
    foreach (FieldInfo item in fis)
    {
        string fieldstrval = GetSingleNodeValue(root, item.Name);
        if (item.FieldType.BaseType == typeof (Enum))
        {// 枚举类型
            item.SetValue(null, Enum.Parse(item.FieldType, fieldstrval));
        }
        else
        {
            object obj = Convert.ChangeType(fieldstrval, item.FieldType);
            item.SetValue(null, obj);
        }
    }
}
{% endhighlight %}

