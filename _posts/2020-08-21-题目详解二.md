---
layout:     post
title:      "2020前端试题详解（二）"
date:       2020-08-21 12:00:00
author:     "monkey-yu"
header-img: "img/mountain.jpg"
catalog: True
tags:
    - 面试
---

#### 6. set 、map、weakSet、weakMap的区别

Set:

- 成员唯一，不重复
- [value,value]键值与键名一致，或者说只有键值
- 可以遍历。方法有：add、delete、has

WeakSet:

- 成员都是对象
- 成员都是弱引用，可以被垃圾回收机制回收掉，可以用来保存DOM节点，不容易造成内存泄漏
- 不可以遍历。方法有：add、delete、has

Map:

- 本质上是键值对的集合，类似集合
- 可以遍历。方法很多可以和各种数据转换

WeakMap:

- 只接受对象作为键名
- 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收
- 不可以遍历。方法有get、set、has、delete

#### 7. ParseInt与map遍历组合题

例： 

```
['1','2','3'].map(parseInt);
```

首先结果不是：

```
[1,2,3]
```

而是：

```
[1,NaN,NaN]
```

解释：

parseInt()函数可解析一个字符串，并返回一个整数。

```
parseInt(string,radix)
```

String: 被解释的字符串。必需

radix:表示要解析的字符串的基数，该值介于2～36之间。如果省略该参数或其值为0，则以10为基础解析；如果它以“0x”或“0X”开头，以16为基数；如果该参数小于2或大于36，则返回NaN。 可选参数

因此：

```javascript
['1','2','3'].map(parseInt)
// 等价于
['1','2','3'].map((item,index)=>{
  return parseInt(item,index)
})
```

即返回的值分别为：

```
parseInt('1',0);  // 1
parseInt('2',1);  // NaN
parseInt('3',2);  // NaN     2进制数不会出现3
```

同理，另一例子：

```
['10','10','10','10'].map(parseInt);
// [10,NaN,2,3]
```

#### 8.判断数组的方法有哪些？

1. `Object.prototype.toString.call()`

每一个继承Object的对象都有`toString`方法，返回一般是[Object Type],其中type为对象的类型。使用call 或apply方法改变toString的执行上下文。

```javascript
let a=[1,2,3]；
Object.prototype.toString.call(a)；  // [object Array]
Object.prototype.toString.apply(a)； // [object Array]
```

2. `instanceof`

instanceof的机制是通过判断对象的原型链中是不是能找到类型的prototype.

```javascript
[] instanceof Array ;       // true
```

3. `Array.isArray()`

用来判断对象是否为数组。

当不存在Array.isArray()时可以用Object.prototype.toString.call()来判断

```javascript
if(!Array.isArray){
	Array.isArray = function(arg){
		return Object.prototype.toString.call(arg) === '[Object Array]';
	}
}
```

#### 9.ES5/ES6的定义对象的区别

1. class 声明会提升，但并不会初始化赋值。类似于let、const声明变量

   ```javascript
   //ES5
   const bar = new Bar();     // ok
   function Bar(){
     this.bar = 42;
   }
   // ES6
   const foo = new Foo();    // ReferenceError: Foo is not defined
   class Foo{
     constructor(){
       this.foo = 42;
     }
   }
   ```

2. class声明内部会使用严格模式

   ```javascript
   // ES5  引用一个未声明的变量
   function Bar(){
     baz = 42;      // ok ，相当于window.baz = 42
   }
   // ES6
   class Foo{
     constructor(){
       fol = 42;      // ReferenceError: fol is not defined
     }
   }
   const foo = new Foo();
   ```

3. class的所有方法都是不可枚举的

   ```javascript
   //ES5
   function Bar(){
   	this.baz =42;
   }
   Bar.answer = function(){
   	return 42;
   }
   Bar.prototype.print = function(){
     console.log(thia.baz);
   }
   const BarKey = Object.keys(Bar);  // ['answer']
   const BarProtoKeys=Object.prototype.keys(Bar);  // ['print']
   // ES6
   class Foo{
     constructior(){
       this.foo =42;
       Foo = 'FOl';        // 报错，class内部无法重写类名
     }
     static answer(){
       return 42;
     }
   }
   const fooKeys = Object.keys(Foo);  // [] 不能遍历出class上的方法
   ```

4. class内部无法重写类名

