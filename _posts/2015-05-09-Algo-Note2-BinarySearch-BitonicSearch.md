---
layout: post
title: 二分查找、双调查找
categories: [Algorithm Notes]
tags: [Algorithm Notes]
published: true
---

前言：在学习《算法》第四版的时候，挑了一些习题来做，使用IDEA来写的，代码托管在 [GitHub](https://github.com/NathanLvzs/AlgoPractice) 上，其中使用了作者提供的stdlib.jar，我重新打包了一次，作为项目的依赖库。吐槽一下，书里面的习题太多了==

## 二分查找

二分查找是比较常用的算法，在最坏情况下查找的时间复杂度为~lgN。二分查找要求输入数组是有序的，所说的有序默认情况下都是指升序。

将待查找的元素记为key，则二分查找的基本过程为：

1. 将数组中间的元素跟key比较，如果等于key则返回该元素的索引

2. 如果小于key，则在数组左半部分继续查找；如果大于key，则在数组右半部份继续查找

这一过程使用递归很容易实现，迭代式实现也比较简单，如下所示。递归式实现比较直观灵活一些。
当数组为降序的时候，简单改一下比较符号就行了。

{% highlight java %}
public class BinarySearch {
    // 迭代式二分查找，数组a为升序
    public static int rank(int key, int[] a) {
        int lo = 0;
        int hi = a.length - 1;
        while (lo <= hi) {
            // Key is in a[lo..hi] or not present.
            int mid = lo + (hi - lo) / 2;
            if (key < a[mid]) hi = mid - 1;
            else if (key > a[mid]) lo = mid + 1;
            else return mid;
        }
        return -1;
    }

	// 递归式二分查找，数组a为升序
    public static int rank(int key, int[] a, int lo, int hi) {
        if (hi < lo) return -1;
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == key) return mid;
        else if (a[mid] < key)
            return rank(key, a, mid + 1, hi);
        else
            return rank(key, a, lo, mid - 1);
    }

    // 递归式二分查找，数组a为降序
    public static int rankReverse(int key, int[] a, int lo, int hi) {
        if (hi < lo) return -1;
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == key) return mid;
        else if (a[mid] > key)
            return rankReverse(key, a, mid + 1, hi);
        else
            return rankReverse(key, a, lo, mid - 1);
    }
}
{% endhighlight %}



## 双调查找

1.4.20 双调查找：数组中所有元素先递增后递减，则称这个数组为双调的。给定一个含有N个不同整数的双调数组，判断它是否有给定的整数。最坏情况下所需的比较次数为~3lgN

上面是题目要求，下面是我的解法。

类似二分查找，其基本过程为：

1. 将数组中间的元素a[mid]跟key比较，如果等于key则返回该元素的索引

2. 比较a[mid]和a[mid+1]（由于是N个不同整数，故不会出现a[mid]等于a[mid+1]的情况）

3. 如果a[mid]小于a[mid+1]，说明a[mid]位于升序的一边，对mid左边部分进行二分查找，如果找到key则返回索引，否则继续对右半部份进行双调查找

4. 如果a[mid]大于a[mid+1]，说明a[mid]位于降序的一遍，对mid右边部分进行二分查找，如果找到key则返回索引，否则继续对左半部分进行双调查找


实现代码和测试代码如下。

{% highlight java %}
public static int bitonicSearch(int[] a, int key, int lo, int hi) {
    if (hi < lo) return -1;
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == key) return mid;
    if (a[mid] < a[mid + 1]) {// mid处在升序的一边
        int temp = BinarySearch.rank(key, a, lo, mid - 1);
        if (temp == -1)
            return bitonicSearch(a, key, mid + 1, hi);
        else return temp;
    }
    else {// mid处在降序的一边
        int temp = BinarySearch.rankReverse(key, a, mid + 1, hi);
        if (temp == -1)
            return bitonicSearch(a, key, lo, mid - 1);
        else return temp;
    }
}

public static void bitonicSearchTest() {
    StdRandom.setSeed(23300);
    int len1 = StdRandom.uniform(3, 12);
    int len2 = StdRandom.uniform(3, 12);
    System.out.println("len1: " + len1 + ", len2: " + len2);
    int[] arr1 = new int[len1];
    int[] arr2 = new int[len2];
    int[] arr = new int[len1 + len2];
    for (int i = 0; i < len1; i++)
        arr1[i] = StdRandom.uniform(1, 30);
    for (int i = 0; i < len2; i++)
        arr2[i] = StdRandom.uniform(1, 30);
    Arrays.sort(arr1);
    Arrays.sort(arr2);
    for (int i = 0; i < len1; i++)
        arr[i] = arr1[i];
    for (int i = 1; i <= len2; i++)
        arr[len1 + len2 - i] = arr2[i - 1];
    for (int i = 0; i < len1 + len2; i++)
        System.out.print(arr[i] + "\t");
    System.out.println();
    int selectedIndex = StdRandom.uniform(0, len1 + len2);
    int index = bitonicSearch(arr, 9, 0, arr.length - 1);//arr[selectedIndex]
    System.out.print("bitonicSearch: " + "selectedIndex=" + selectedIndex + " foundIndex=" + index);
    if (index != -1)
        System.out.println(" value=" + arr[index]);
}
{% endhighlight %}





