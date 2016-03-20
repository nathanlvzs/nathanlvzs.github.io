---
layout: post
title: 互信息的公式推导
categories: [DataMining, Derivation]
tags: [DataMining, Derivation]
language: zh
published: true
---

> 公式排版略难看，暂且将就一下。。

一般的，熵与条件熵之间的差称为互信息。两个随机变量的互信息可通过如下两个公式计算。

{% raw %}{::nomarkdown}
    <div>
    公式1
    $$ MI(X,Y) = H(Y) - H(Y|X) $$
    </div>
    <div>
    公式2
    $$ MI(X,Y) = H(X) - H(X|Y) $$
    </div>
{:/}{% endraw %}

前不久看到如下的互信息公式。

{% raw %}{::nomarkdown}
    <div>
    公式3
    $$ MI(X,Y) = H(X) + H(Y) - H(X,Y) $$
    </div>
{:/}{% endraw %}

乍一看跟公式1和2联系不起来，于是根据定义推导一下。

{% raw %}{::nomarkdown}
    <div>
    $$ \begin{array}{l}
H(X) - H(X,Y) \\
 =  - \sum\limits_{i = 1}^m {p({x_i})\log (} p({x_i})) + \sum\limits_{i = 1}^m {\sum\limits_{j = 1}^n {p({x_i},{y_j})} } \log (p({x_i},{y_j}))\\
 =  - \sum\limits_{i = 1}^m {[p({x_i})\log (} p({x_i})) - \sum\limits_{j = 1}^n {p({x_i},{y_j})\log p({x_i},{y_j})} ]\\
 =  - \sum\limits_{i = 1}^m {[p({x_i})\log (} p({x_i})) - \sum\limits_{j = 1}^n {p({x_i},{y_j})\log p({x_i},{y_j})} ]\\
 =  - \sum\limits_{i = 1}^m {[p({x_i})\log (} p({x_i})) - \sum\limits_{j = 1}^n {p({y_j}|{x_i})p({x_i})(logp({y_j}|{x_i}) + \log p({x_i}))} ]\\
 =  - \sum\limits_{i = 1}^m {p({x_i})\log p({x_i})}  + \sum\limits_{i = 1}^m {p({x_i})\sum\limits_{j = 1}^n {p({y_j}|{x_i})(logp({y_j}|{x_i})} }  + \sum\limits_{j = 1}^n {p({y_j}|{x_i})p({x_i})\log p({x_i})} \\
 = H(X) - \sum\limits_{i = 1}^m {p({x_i})H(Y|X = {x_i})}  + \sum\limits_{i = 1}^m {p({x_i})\log (} p({x_i}))\\
 = H(X) - H(Y|X) - H(X)\\
 =  - H(Y|X)
\end{array} $$
    </div>
{:/}{% endraw %}

上面的推导主要利用了如下关系（公式4和5）。

{% raw %}{::nomarkdown}
    <div>
    公式4
    $$ \sum\limits_{j = 1}^n {p({y_j}|{x_i})} = 1 $$ 
    公式5
    $$ \begin{array}{l}
p({x_i},{y_j})\log p({x_i},{y_j})\\
 = p({y_j}|{x_i})p({x_i})\log (p({y_j}|{x_i})p({x_i}))\\
 = p({y_j}|{x_i})p({x_i})(logp({y_j}|{x_i}) + \log p({x_i}))
\end{array} $$
    </div>
{:/}{% endraw %}


将推导的结果代入公式3即可得到公式2。

推导所得结果即

{% raw %}{::nomarkdown}
    <div>
    $$ H(X,Y) - H(X) = H(Y|X) $$
    </div>
{:/}{% endraw %}

意思很明显啦，X和Y的联合不确定性减去X的不确定性即为在X已知的情况下Y的不确定性。

以上。


