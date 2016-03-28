---
layout: post
title: 互信息的公式推导
categories: [DataMining, Derivation]
tags: [DataMining, Derivation]
language: zh
published: true
---

> 公式排版略难看，暂且将就一下。。    
> Update: 看了一下Mathjax的文档后，决定用公式自动编号，看起来舒服多了。2016-03-28

一般的，熵与条件熵之间的差称为互信息。两个随机变量的互信息可通过如下两个公式计算。

\begin{equation}
   MI(X,Y) = H(Y) - H(Y|X)
\end{equation}

\begin{equation}
   MI(X,Y) = H(X) - H(X|Y)
\end{equation}

前不久看到如下的互信息公式。

\begin{equation}
   MI(X,Y) = H(X) + H(Y) - H(X,Y)
\end{equation}

乍一看跟公式(1)和(2)联系不起来，于是根据定义推导一下。

主要利用了如下两个公式

\begin{equation}
   \sum\limits_{j = 1}^n {p({y_j}|{x_i})} = 1
\end{equation}

\begin{equation}
\begin{array}{l}
p({x_i},{y_j})\log p({x_i},{y_j}) & = p({y_j}|{x_i})p({x_i})\log (p({y_j}|{x_i})p({x_i}))\\\
& = p({y_j}|{x_i})p({x_i})(logp({y_j}|{x_i}) + \log p({x_i}))
\end{array}
\end{equation}

推导过程如下：

\begin{array}{l}
H(X) - H(X,Y) & =  - \sum\limits_{i = 1}^m {p({x_i})\log (} p({x_i})) + \sum\limits_{i = 1}^m {\sum\limits_{j = 1}^n {p({x_i},{y_j})} } \log (p({x_i},{y_j}))\\\
& =  - \sum\limits_{i = 1}^m {[p({x_i})\log (} p({x_i})) - \sum\limits_{j = 1}^n {p({x_i},{y_j})\log p({x_i},{y_j})} ]\\\
& =  - \sum\limits_{i = 1}^m {[p({x_i})\log (} p({x_i})) - \sum\limits_{j = 1}^n {p({x_i},{y_j})\log p({x_i},{y_j})} ]\\\
& =  - \sum\limits_{i = 1}^m {[p({x_i})\log (} p({x_i})) - \sum\limits_{j = 1}^n {p({y_j}|{x_i})p({x_i})(logp({y_j}|{x_i}) + \log p({x_i}))} ]\\\
& =  - \sum\limits_{i = 1}^m {p({x_i})\log p({x_i})}  + \sum\limits_{i = 1}^m {p({x_i})\sum\limits_{j = 1}^n {p({y_j}|{x_i})(logp({y_j}|{x_i})} }  + \sum\limits_{j = 1}^n {p({y_j}|{x_i})p({x_i})\log p({x_i})} \\\
& = H(X) - \sum\limits_{i = 1}^m {p({x_i})H(Y|X = {x_i})}  + \sum\limits_{i = 1}^m {p({x_i})\log (} p({x_i}))\\\
& = H(X) - H(Y|X) - H(X)\\\
& =  - H(Y|X)
\end{array}

推导所得结果即

\begin{equation}
   H(X,Y) - H(X) = H(Y|X)
\end{equation}

意思很明显，X和Y的联合不确定性减去X的不确定性即为在X已知的情况下Y的不确定性。

将公式(6)代入公式(3)即可得到公式(2)。

类似地，可得到公式(1)。


