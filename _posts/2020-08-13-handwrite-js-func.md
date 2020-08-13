---
layout:     post
title:      "js题目解答"
date:       2020-08-13 12:00:00
author:     "monkey-yu"
header-img: "img/mountain.jpg"
catalog: True
tags:
    - JS
---

#### 1.将多维数组降为一维数组

```javascript
var arr1 = [1,2,3,[4,5,[6,7,8],[9,[11]]],[10]];
// 方法一 ：手写flatDeep函数
let flatDeep = (arr) => {
    return arr.reduce((res,cur)=>{
        if(Array.isArray(cur)){
            return [...res,...flatDeep(cur)]
        }else {
            return [...res,cur];
        }
    },[])
};
flatDeep(arr1); 
// 方法二： Array.prototype.flat(num) 其中num 表示维度，也可以使用Infinity
arr1.flat(Infinity);
// 或者 如下。因为arr1是3维数组
arr1.flat(3);
// 结果输出： [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 10]
```

#### 2.给定一个整数 (32 位有符号整数)，请编写一个函数来判断它是否是 4 的幂次方。

例如： 输入16，返回true

​			 输入5，返回false

```javascript
var isPowerOf4= function(num){
  return Math.log10(num) / Math.log10(4) % 1 === 0
};
isPowerOf4(16);    // true
```

换底公式： log10(16) / log10(4) = log4(16)  = 4

#### 3.用正则实现trim()

```javascript
function trim(string){
  return string.replace(/^\s+|\s+$/g,'')
}
// 或者
String.prototype.trim = function(string){
  return this.replace(/^\s+|\s+$,'')
}
```

正则符号解释：

-  ^ : 匹配输入字符串的起始位置
- \s :任何空白字符串
- +：匹配前面的子表达式一次或多次
- |：或者，两项之间的一个选择
- $: 匹配字符串的结束位置

#### 4.10进制转换

给定10进制数，转换成[2-16]进制区间数

```javascript
function Conver(number,base=2){
  let rem,res='',digits='0123456789ABCDEF', stack =[];
  while(number){
    rem = number % base;
    stack.push(rem);
    number = number.floor(number / bbase);
  }
  while(stack.length) {
    res += digits[stack.pop()].toString();
  }
  return res;
}
```

