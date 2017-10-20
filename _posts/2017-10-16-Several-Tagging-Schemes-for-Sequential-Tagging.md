---
layout: post
title: 序列标注中的几种标签方案
categories: [NLP]
tags: [NLP]
language: zh
published: true
---

在自然语言处理的序列标注问题中，标签方案的使用可能因人而异。

## 标签说明

标签方案中通常都使用一些简短的英文字符[串]来编码。

标签是打在token上的。

对于英文，token可以是一个单词（e.g. awesome），也可以是一个字符（e.g. a）。

对于中文，token可以是一个词语（分词后的结果），也可以是单个汉字字符。

为便于说明，以下都将token试作等同于字符。

标签列表如下：

- B，即Begin，表示开始
- I，即Intermediate，表示中间
- E，即End，表示结尾
- S，即Single，表示单个字符
- O，即Other，表示其他，用于标记无关字符

## 常见标签方案

基于上面的标签列表，通过选择该列表的子集，可以得到不同的标签方案。同样的标签列表，不同的使用方法，也可以得到不同的标签方案。

常用的较为流行的标签方案有如下几种：

- IOB1: 标签I用于文本块中的字符，标签O用于文本块之外的字符，标签B用于在该文本块前面接续则一个同类型的文本块情况下的第一个字符。
- IOB2: 每个文本块都以标签B开始，除此之外，跟IOB1一样。 
- IOE1: 标签I用于独立文本块中，标签E仅用于同类型文本块连续的情况，假如有两个同类型的文本块，那么标签E会被打在第一个文本块的最后一个字符。
- IOE2: 每个文本块都以标签E结尾，无论该文本块有多少个字符，除此之外，跟IOE1一样。
- START/END （也叫SBEIO、IOBES）: 包含了全部的5种标签，文本块由单个字符组成的时候，使用S标签来表示，由一个以上的字符组成时，首字符总是使用B标签，尾字符总是使用E标签，中间的字符使用I标签。 
- IO: 只使用I和O标签，显然，如果文本中有连续的同种类型实体的文本块，使用该标签方案不能够区分这种情况。

其中最常用的是IOB2、IOBS、IOBES。

下面是个例子，来自于GitHub，可参见第二个参考链接。

| Example: | Bill | works | for | Bank | of | America | and | takes | the | Boston | Philadelphia | train. |
| -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
| IO: | I-PER | O | O | I-ORG | I-ORG | I-ORG | O | O | O | I-LOC | I-LOC | O |
| IOB1: | I-PER | O | O | I-ORG | I-ORG | I-ORG | O | O | O | I-LOC | B-LOC | O |
| IOB2: | B-PER | O | O | B-ORG | I-ORG | I-ORG | O | O | O | B-LOC | B-LOC | O |
| IOE1: | I-PER | O | O | I-ORG | I-ORG | I-ORG | O | O | O | E-LOC | I-LOC | O |
| IOE2: | E-PER | O | O | I-ORG | I-ORG | E-ORG | O | O | O | E-LOC | E-LOC | O |
| BILOU: | U-PER | O | O | B-ORG | I-ORG | L-ORG | O | O | O | U-LOC | U-LOC | O |
| SBEIO: | S-PER | O | O | B-ORG | I-ORG | E-ORG | O | O | O | S-LOC | S-LOC | O |

上面的`BILOU`方案猜想应该是跟`SBEIO`一致的，只不过使用的标签不完全一样，其中`U`（Unitary，单一的）应该对应`S`，`L`（Last，最后的）应该对应`E`。这里没有再做考证。

## 参考

> - [KrishnanGanapathy-NamedEntityRecognition.pdf](http://cs229.stanford.edu/proj2005/KrishnanGanapathy-NamedEntityRecognition.pdf)
> - [https://github.com/stanfordnlp/CoreNLP/pull/230](https://github.com/stanfordnlp/CoreNLP/pull/230)


