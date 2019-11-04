---
layout:     post
title:      "一些trick的javascript题目"
date:       2019-11-04 12:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: True
tags:
    - JS
---

> 一些有心机的JavaScript面试题。

#### 1.意外的全局变量

问题：

```javascript
function foo(){
	let a=b=0;
	a++;
	return a;
}
foo();
typeOf a;  => ???
typeOf b;  => ???
```

答案： 

```javascript
typeOf a;  =>  undefined
typeOf b;  =>  number
```

解释：

`let a=b=0;`这行语句中， 在foo函数中声明了一个局部变量a,同时创建了一个全局变量b。

上述代码片段相当于：

```javascript
function foo(){
	let a; window.b = 0 ;a =window.b; 
	a++;
	return a;
}
foo();
typeOf a;  =>  undefined
typeOf b;  =>  number
```

`typeOf a;  =>  undefined`: 变量a 是仅在foo()内声明；

`typeOf b;  =>  number`: b是一个值为0的全局变量。

#### 2.数组length属性

问题：

```javascript
const clothes = ['jacket', 't-shirt'];
clothes.length = 0;

clothes[0]; // => ???
```

答案：

```javascript
 clothes[0]; // => undefined
```

解释：

减少length属性的值，会删除索引位于新旧长度之间的元素。

这里 `clothes.length = 0;`数组中的所有项被删除了，因此 `clothes[0]; // => undefined`。

#### 3.for循环后的分号

问题：

```javascript
const length = 4;
const numbers = [];
for (var i = 0; i < length; i++);{
  numbers.push(i + 1);
}

numbers; // => ???
```

答案：

```javascript
numbers; // => [5]
```

解释：

for() 后面紧跟的 `;`创建了一个空语句，即for()在空语句上执行了4遍，然后才执行了后面的push语句。上述代码相当于：

```javascript
const length = 4;
const numbers = [];
var i;
for (i = 0; i < length; i++) {
  // does nothing
}
{ 
  // a simple block
  numbers.push(i + 1);
}
numbers; // => [5]
```

`for()`递增变量`i`直到`4`。然后JavaScript 进入代码块 `{ numbers.push(i + 1); }`，将`4 + 1` 添加 到`numbers`数组中。

#### 4.自动插入分号

问题：

```javascript
function arrayFromValue(item) {
  return
    [items];
}
arrayFromValue(10); // => ???
```

答案：

```javascript
arrayFromValue(10); // => undefined
```

解释：

`return`关键字和`[items]`表达式之间的换行。

换行使JavaScript自动在`return`和`[items]`表达式之间插入一个分号。

这里有一段等价的代码，它在`return`后插入分号：

```javascript
function arrayFromValue(item) {
  return;  [items];
}
arrayFromValue(10); // => undefined
```

函数中的 `return;` 导致它返回 `undefined`。

因此 `arrayFromValue(10)` 的值是 `undefined`。

#### 5.闭包问题

问题

以下脚本将会在控制台输出什么：

```javascript
let i;
for (i = 0; i < 3; i++) {
  const log = () => {
    console.log(i);  }
  setTimeout(log, 100);
}
```

答案：

```javascript
3，3，3
```

解释：

 **步骤 1**：

for()循环执行3次，每次迭代过程中都会创建一个新的函数log()，它捕获变量i。然后`setTimout()`执行`log()`。

当`for()`循环完成时，`i`变量的值为`3`。

**`log()`是一个捕获变量 `i` 的闭包，它在`for()`循环的外部作用域定义。重要的是要理解闭包从词法上捕获了*变量*`i` 。**

**步骤 2**：

`setTimeout()`调用了队列中的3个`log()` 回调。`log()` 读取变量 `i`的*当前值*，即`3`，并记录到控制台`3`。

因此控制台输出`3`, `3` 和`3`。

#### 6. 浮点数问题

问题：

```javascript
0.1 + 0.2 === 0.3 // => ???
```

答案：

```javascript
0.1 + 0.2 === 0.3 // => false
```

解释：

首先，我们看看`0.1 + 0.2` 的值：

```javascript
0.1 + 0.2; // => 0.30000000000000004
```

`0.1` 和 `0.2` 的和 *不完全等于*  `0.3`，而是略大于 `0.3`。

由于浮点数在二进制中的编码机制，像浮点数的加法这样的操作会受到舍入误差的影响。

简单地说，直接比较浮点数是不精确的。

#### 7.变量提升

问题：

如果在声明之前访问`myVar`和`myConst`会发生什么?

```javascript
myVar;   // => ???   myConst; // => ???
var myVar = 'value';
const myConst = 3.14;
```

答案：

```javascript
myVar;   // => undefiend  
myConst; // => 报错
```

解释：

在声明之前访问 `myVar` 结果为`undefined`。一个被提升的`var`变量，在它的初始化之前，有一个 `undefined`的值。

但是，在声明之前访问`myConst`会抛出 `ReferenceError`。在声明行`const myConst = 3.14`之前，`const` 变量处于暂时死区。

> end !