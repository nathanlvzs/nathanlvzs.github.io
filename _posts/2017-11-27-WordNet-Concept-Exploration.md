---
layout: post
title: WordNet相关概念探索梳理
categories: [NLP]
tags: [WordNet, NLP]
language: zh
published: true
---


WordNet是一个英语词汇数据库（词汇参照系统），是以同义词集合作为基本构建单位进行组织的。

本文基于NLTK库中的WordNet实现来探索梳理其相关概念，下文中的内容也可见于这个[Notebook](/media/attachment/2017/11/WordNet.ipynb)，可以下载自行修改跑跑看。


```python
from nltk.corpus import wordnet as wn

# synonym 同义词
# lemma 词条

```

<br>


```python
# wordnet支持多种语言，但是没有中文
# 部分nltk的resource没有下载，就不跑这个代码块啦
# sorted(wn.langs())
# 运行结果：
# ['als', 'arb', 'cat', 'cmn', 'dan', 'eng', 'eus', 'fas',
# 'fin', 'fra', 'fre', 'glg', 'heb', 'ind', 'ita', 'jpn', 'nno',
# 'nob', 'pol', 'por', 'spa', 'tha', 'zsm']
```

## Synset


```python
# 查找单词，获取它全部的同义词集合synsets
# 所谓synset，表示set of synonyms，是拥有同一个意思的同义词的集合
# 一个单词，由于语言的发展，会存在有一种或多种意思，比如dog，会有如下的一些不同的意思。
print(wn.synsets('dog'))
# synset的标识由三部分组成：词语.词性.编号，表示一个概念？？？

# 可以在synsets方法中指定pos参数来限制返回结果集的词性，NOUN,VERB,ADJ,ADV（顺序对应：名词、动词、形容词、副词）
print(wn.synsets('dog', pos=wn.VERB))

# 获取某一个同义词集合
dog01 = wn.synset('dog.n.01')
# 该同义词集合的概念定义
print(dog01.definition())
# 该同义词集合表示的概念的使用例子
print(dog01.examples())

```

运行结果：
```text
[Synset('dog.n.01'), Synset('frump.n.01'), Synset('dog.n.03'), Synset('cad.n.01'), Synset('frank.n.02'), Synset('pawl.n.01'), Synset('andiron.n.01'), Synset('chase.v.01')]
[Synset('chase.v.01')]
a member of the genus Canis (probably descended from the common wolf) that has been domesticated by man since prehistoric times; occurs in many breeds
['the dog barked all night']
```

<br>

```python
# 获取该同义词集合中所有的词条
print(dog01.lemmas())
for lemma in dog01.lemmas():
    print(lemma.name())
# 从某个词典获取其对应的同义词集合
lemma = dog01.lemmas()[0]
print(lemma.synset())

```

运行结果：
```text
[Lemma('dog.n.01.dog'), Lemma('dog.n.01.domestic_dog'), Lemma('dog.n.01.Canis_familiaris')]
dog
domestic_dog
Canis_familiaris
Synset('dog.n.01')
```



### 上位词hypernym

所谓hypernym，表示某一个概念的上位词，假如A的上位词是B，简单的理解即是B是一个大的概念，A是B概念的一种情况，A更加具体。


```python
# 例如，A概念表示狗，B概念表示家养动物，我们知道狗是家养动物的一种，则可以称家养动物是狗的一个上位词。
print(dog01.hypernyms())

# 最顶层的上位词
print(dog01.root_hypernyms())
```

运行结果：
```text
[Synset('canine.n.02'), Synset('domestic_animal.n.01')]
[Synset('entity.n.01')]
```


### 下位词hyponym



```python
# 跟上位词对应，也有下位词概念，英文单词为hyponym
# 在下面的例子中，basenji、corgi等都是狗的不同品种，都是狗这个具体概念下的更加具体的概念
print(dog01.hyponyms())
```

运行结果：
```text
[Synset('basenji.n.01'), Synset('corgi.n.01'), Synset('cur.n.01'), Synset('dalmatian.n.02'), Synset('great_pyrenees.n.01'), Synset('griffon.n.02'), Synset('hunting_dog.n.01'), Synset('lapdog.n.01'), Synset('leonberg.n.01'), Synset('mexican_hairless.n.01'), Synset('newfoundland.n.01'), Synset('pooch.n.01'), Synset('poodle.n.01'), Synset('pug.n.01'), Synset('puppy.n.01'), Synset('spitz.n.01'), Synset('toy_dog.n.01'), Synset('working_dog.n.01')]
```



### 整体关系词holonym

假如A是B的整体关系词，则意味着B是A的一个组成部分，A是一个整体


```python
# member表示成员。假如A的member_holonym是B，既然是成员，A本身就是一个独立的个体，B表示一个群体。
# 比如下面的例子中，dog是犬属动物（canis）的一种，也是犬群（pack）的组成部分。wolf pack 狼群
print(dog01.member_holonyms())

```

运行结果：
```text
[Synset('canis.n.01'), Synset('pack.n.06')]
```

<br>

```python
# part表示部分，假如A的part_holonym是B，A只是一个组成部分，并不是独立个体，B是由A以及其他部分所组成的
# dog并没有part_holonym，我们换一个词，换成eye眼睛看看
# 这个例子中，眼睛是脸、视觉系统的组成部分
print(wn.synset('eye.n.01').part_holonyms())
```

运行结果：
```text
[Synset('face.n.01'), Synset('visual_system.n.01')]
```

<br>


```python
# substance表示物质，类似一种物质是某化合物中的一个组成成分的关系
# dog并不是物质，我们换一个词，换成carbon碳看看
# 这个例子中，carbon碳是煤炭、石灰岩、汽油的组成物质
print(wn.synset('carbon.n.01').substance_holonyms())
```

运行结果：
```text
[Synset('coal.n.01'), Synset('limestone.n.01'), Synset('petroleum.n.01')]
```



### 部分关系词meronym

也称局部关系词。跟整体关系词相对应。



```python
print(wn.synset('canis.n.01').member_meronyms())

print(wn.synset('face.n.01').part_meronyms())

print(wn.synset('coal.n.01').substance_meronyms())
```

运行结果：
```text
[Synset('dog.n.01'), Synset('jackal.n.01'), Synset('wolf.n.01')]
[Synset('beard.n.01'), Synset('brow.n.01'), Synset('cheek.n.01'), Synset('chin.n.01'), Synset('eye.n.01'), Synset('eyebrow.n.01'), Synset('facial.n.01'), Synset('facial_muscle.n.01'), Synset('facial_vein.n.01'), Synset('feature.n.02'), Synset('jaw.n.02'), Synset('jowl.n.02'), Synset('mouth.n.02'), Synset('nose.n.01')]
[Synset('carbon.n.01')]
```



### 反义词antonym

定义在lemma上而不是synset上


```python
good = wn.synset('good.a.01')
print(good.lemmas()[0].antonyms())

```

运行结果：
```text
[Lemma('bad.a.01.bad')]
```


## Lemmas

```python
# 词条名称%词性编号%词条的_lexname_index%词条的_lex_id%词条所属synset的第一个相似synset的第一个词条（head_lemma）名称%head_lemma的_lex_id
tup = (lemma._name, WordNetCorpusReader._pos_numbers[synset._pos],
       lemma._lexname_index, lemma._lex_id, head_name, head_id)
lemma._key = ('%s%%%d:%02d:%02d:%s:%s' % tup).lower()
```

<br>

```python
eat = wn.lemma('eat.v.03.eat')
print(eat, eat.key())
# 在wordnet中的出现次数
print(eat.count())

print()

dog = wn.lemma('dog.n.01.dog')
print(dog, dog.key())
print(dog.count())
```

运行结果：
```text
Lemma('feed.v.06.eat') eat%2:34:02::
4

Lemma('dog.n.01.dog') dog%1:05:00::
42
```

<br>

```python
# 定义在lemma上的一些关系
vocal = wn.lemma('vocal.a.01.vocal')

# 相关形态变化得到的词条
print(vocal.derivationally_related_forms())

# pertainym n. 适用，存在，相关
print(vocal.pertainyms())

print(vocal.antonyms())
```

运行结果：
```text
[Lemma('vocalize.v.02.vocalize')]
[Lemma('voice.n.02.voice')]
[Lemma('instrumental.a.01.instrumental')]
```



## 相似度计算

`synset1.path_similarity(synset2)`: Return a score denoting how similar two word senses are, based on the shortest path that connects the senses in the is-a (hypernym/hypnoym) taxonomy. The score is in the range 0 to 1. By default, there is now a fake root node added to verbs so for cases where previously a path could not be found---and None was returned---it should return a value. The old behavior can be achieved by setting simulate_root to be False. A score of 1 represents identity i.e. comparing a sense with itself will return 1.

相关源码如下：
```python
distance = self.shortest_path_distance(other, simulate_root=simulate_root and self._needs_root())
if distance is None or distance < 0:
    return None
return 1.0 / (distance + 1)
```
`synset1.lch_similarity(synset2)`: Leacock-Chodorow Similarity: Return a score denoting how similar two word senses are, based on the shortest path that connects the senses (as above) and the maximum depth of the taxonomy in which the senses occur. The relationship is given as -log(p/2d) where p is the shortest path length and d the taxonomy depth.

`synset1.wup_similarity(synset2)`: Wu-Palmer Similarity: Return a score denoting how similar two word senses are, based on the depth of the two senses in the taxonomy and that of their Least Common Subsumer (most specific ancestor node). Note that at this time the scores given do _not_ always agree with those given by Pedersen's Perl implementation of Wordnet Similarity.

还有其他的相似度计算方式，大同小异。。。


```python
dog = wn.synset('dog.n.01')
cat = wn.synset('cat.n.01')
corgi = wn.synset('corgi.n.01')

print(dog.path_similarity(cat))
print(dog.path_similarity(corgi))
```

运行结果：
```text
0.2
0.5
```


## 其他


通过morphy来查找不在wordnet中的形态



```python
print(wn.morphy('denied', wn.NOUN))
print(wn.morphy('denied', wn.VERB))

print(wn.synsets('denied', wn.NOUN))
print(wn.synsets('denied', wn.VERB))
```

运行结果：
```text
None
deny
[]
[Synset('deny.v.01'), Synset('deny.v.02'), Synset('deny.v.03'), Synset('deny.v.04'), Synset('deny.v.05'), Synset('traverse.v.03'), Synset('deny.v.07')]
```
    
<br>

```python
# Morphy uses a combination of inflectional ending rules and exception lists to handle a variety of different possibilities
print(wn.morphy('dogs'))
print(wn.morphy('churches'))
print(wn.morphy('aardwolves'))
print(wn.morphy('book', wn.NOUN))
```

运行结果：
```text
dog
church
aardwolf
book
```


## Reference

- [http://www.nltk.org/howto/wordnet.html](http://www.nltk.org/howto/wordnet.html)

- [http://www.nltk.org/_modules/nltk/corpus/reader/wordnet.html](http://www.nltk.org/_modules/nltk/corpus/reader/wordnet.html)



