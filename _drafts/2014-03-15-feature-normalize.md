---
layout: post
title: 特征归一化
categories: [Machine Learning]
---

1. 验证matlab norm()函数

[How to normalize a vector in MATLAB efficiently?](http://stackoverflow.com/questions/1061276/how-to-normalize-a-vector-in-matlab-efficiently-any-related-built-in-function)

```matlab
>> a =[2,2,4;2,2,4]

a =

     2     2     4
     2     2     4

>> sqrt(2^2+2^2+4^2+2^2+2^2+4^2)

ans =

    6.9282

>> norm(a)

ans =

    6.9282




