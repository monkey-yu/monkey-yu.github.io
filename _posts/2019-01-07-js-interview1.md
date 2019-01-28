---
layout:     post
title:      "JS基础知识点"
subtitle:   " \"JS基础知识点及常考面试题（一） \""
date:       2019-01-07 12:00:00
author:     "monkey-yu"
header-img: "img/post-bg-mac.jpg"
catalog: true
tags:
    - 前端
    - 面试
---

> JS基础知识点及常考面试题（一） 来自掘金小册

### 原始类型

#### Q1.原始类型有哪几种？null是对象吗？

在JS中，存在6种原始值，分别是：boolean、null 、undefined 、number 、string 、symbol。

原始类型存储的都是值，是没有函数调用的。但举例 

```
'1'.toString（）
```

是可以使用的。因为此时的'1'已不是原始类型，而是被强制转换成了String类型也就是对象类型，可以调用`toString`函数。

null 是原始类型，但由于 `typeof null` 会输出object,误以为是对象类型。这是由于在JS的最初版本中使用的是32位系统，为了性能考虑，000开头代表是对象，然而null 全为0，所以将它错误的判断为`object`。

### 对象类型

#### Q2.对象类型和原始类型的不同之处？

原始类型存储的是值，对象类型存储的是地址（指针）。当你创建一个对象类型的时候，计算机会在内存中帮我们开辟一个空间来存放值，但是我们需要找到这个空间，这个空间会拥有一个地址。

```js
const a = []
```

对于常量 `a` 来说，假设内存地址（指针）为 `#001`，那么在地址 `#001` 的位置存放了值 `[]`，常量 `a` 存放了地址（指针） `#001`，再看以下代码

```
const a = []
const b = a
b.push(1)
```

当我们将变量赋值给另外一个变量时，复制的是原本变量的地址（指针），也就是说当前变量 `b` 存放的地址（指针）也是 `#001`，当我们进行数据修改的时候，就会修改存放在地址（指针） `#001` 上的值，也就导致了两个变量的值都发生了改变。

接下来我们来看函数参数是对象的情况

```
function test(person) {
  person.age = 26
  person = {
    name: 'yyy',
    age: 30
  }

  return person
}
const p1 = {
  name: 'yck',
  age: 25
}
const p2 = test(p1)
console.log(p1) // -> {name: "yck", age: 26}
console.log(p2) // -> {name: "yyy", age: 30}
```

- 首先函数传参是传递对象指针的副本；
- 到函数内部修改参数的属性这部，当前p1的值也被修改了；
- 但是当我们重新为了 `person` 分配了一个对象时就出现了分歧，请看下图![](/img/post_img/js-interview/js-1.png)

所以最后 `person` 拥有了一个新的地址（指针），也就和 `p1` 没有任何关系了，导致了最终两个变量的值是不相同的。

## typeof vs instanceof

#### Q3.typeof 是否能正确判断类型？instanceof 能正确判断对象的原理是什么？

`typeof` 对于原始类型，除了null都可以正确显示类型。

`typeof`对于对象来说，除了函数都会显示object,所以说typeof不能准确判断变量到底是什么类型。

如果想判断对象的正确类型，可以使用`instanceof`,因为内部机制是通过原型链来判断的。

```
const Person = function() {}
const p1 = new Person()
p1 instanceof Person // true

var str = 'hello world'
str instanceof String // false

var str1 = new String('hello world')
str1 instanceof String // true
```

对于原始类型来说，你想直接通过 `instanceof` 来判断类型是不行的。

### 类型转换

> 该知识点常在笔试题中见到，熟悉了转换规则就不惧怕此类题目了。

在 JS 中类型转换只有三种情况,分别是：

- 转换为布尔值
- 转换为数字
- 转换为字符串

类型转换表格：

![](/img/post_img/js-interview/js-2.png)

##### 转Boolean：

在条件判断时，除了undefined,null,false,NaN,'',0,-0,其它所有都转为true,包含所有对象。

##### 对象转原始类型：

对象在转换类型的时候，会调用内置的 `[[ToPrimitive]]` 函数，对于该函数来说，算法逻辑一般来说如下：

- 如果已经是原始类型了，那就不需要转换了
- 调用 `x.valueOf()`，如果转换为基础类型，就返回转换的值
- 调用 `x.toString()`，如果转换为基础类型，就返回转换的值
- 如果都没有返回原始类型，就会报错

##### 四则运算符：

加法运算符，特点：

- 运算中其中一方为字符串，会把另一方也转为字符串；
- 如果一方不是字符串或数字，那么会将它转换为数字或字符串。

```
1 + '1' // '11'
true + true // 2
4 + [1,2,3] // "41,2,3"
```

另外对于加法还需要注意这个表达式 `'a' + + 'b'`

```
'a' + + 'b' // -> "aNaN"
```

因为 `+ 'b'` 等于 `NaN`，所以结果为 `"aNaN"`，你可能也会在一些代码中看到过 `+ '1'` 的形式来快速获取 `number` 类型。

```
4 * '3' // 12
4 * [] // 0
4 * [1, 2] // NaN
```

### this

#### Q4.如何正确判断 this？箭头函数的 this 是什么？

```
function foo() {
  console.log(this.a)
}
var a = 1
foo()

const obj = {
  a: 2,
  foo: foo
}
obj.foo()

const c = new foo()
```

分析上面几个场景：

- 对于直接调用foo来说，不管foo函数放在什么地方，this一定是`window`;
- 对于`obj.foo()`来说，谁调用了函数，谁就是this,这里foo函数中的this就是`obj`对象；
- 对于`new`的方式来说，this被永远绑定在了c上面，不会被任何方式改变this.

接下来看看箭头函数中的 `this`：

```
function a() {
  return () => {
    return () => {
      console.log(this)
    }
  }
}
console.log(a()()())
```

箭头函数其实是没有this的，箭头函数中的this只取决包裹箭头函数的第一个普通函数的this。在上面例子中，包裹箭头函数的第一个普通函数是a,所以此时的this是`window`。

另外对箭头函数使用bind这类函数是无效的。

基于上面所有例子，首先，`new` 的方式优先级最高，接下来是 `bind` 这些函数，然后是 `obj.foo()` 这种调用方式，最后是 `foo` 这种调用方式，同时，箭头函数的 `this` 一旦被绑定，就不会再被任何方式所改变。

![](/img/post_img/js-interview/js-3.png)