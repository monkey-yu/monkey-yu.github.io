---
layout:     post
title:      "ES6 知识点"
subtitle:   " \"ES6 知识点及常考面试题 \""
date:       2019-01-08 12:00:00
author:     "monkey-yu"
header-img: "img/post-bg-mac.jpg"
catalog: true
tags:
    - 技术
    - 面试
---

> ES6知识点及常考面试题 来自掘金小册

### var、let及const区别

#### Q1.什么是提升？什么是暂时性死区？var、let 、const区别？

```
console.log(a) // undefined
var a = 1
```

提升：指虽然这个变量还未声明，但却可以使用这个未声明的变量。这种情况叫提升，并且提升的是声明。

```
console.log(a);  // f a(){}
function a(){}
var a=1;
```

不仅变量会被提升，函数也会被提升。并且函数优先于变量提升。

因此，使用 `var` 声明的变量会被提升到作用域的顶部。

```
var a = 1
let b = 1
const c = 1
console.log(window.b) // undefined
console.log(window. c) // undefined

function test(){
  console.log(a)
  let a
}
test()
```

分析上面代码：

- 首先，在全局作用域下使用let和const声明变量，不会被挂载到window上。这一点和var 有区别的。
- 当我们再声明a前使用了a,会报错。报错的原因是因为存在暂时性死区，我们不能再声明前使用变量，这是let 和 const 优于var的一点。

为什么要存在提升？其实提升存在的根本原因就是为了解决函数间互相调用的情况。

```
function test1() {
    test2()
}
function test2() {
    test1()
}
test1()
```

提升解决test1 和test2 互相调用。

总结：

- 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部
- `var` 存在提升，我们能在声明之前使用。`let`、`const` 因为暂时性死区的原因，不能在声明前使用
- `var` 在全局作用域下声明变量会导致变量挂载在 `window` 上，其他两者不会
- `let` 和 `const` 作用基本一致，但是后者声明的变量不能再次赋值

### 原型继承和class继承

#### Q2.原型如何实现继承？Class如何实现继承？Class本质是什么？

class，其实js中不存在类，class只是语法糖，本质还是函数。

```
class Person{}
Person instanceof Function    // true
```

##### 组合继承

```
function Parent(value){
    this.val = value;
}
Parent.prototype.getValue = function(){
    console.log(this.val)
}
function Child(value){
    Parent.call(this,value)
}
Child.prototype = new Parent()
const child =new Child(1);
child.getValue();     // 1
child instanceof Parent   // true
```

以上继承方式的核心是在子类的构造函数中通过`Parent.call(this)`继承父类的属性，然后改变子类的原型为`new Parent()`来继承父类的函数。

这种继承方式优点在于构造函数可以传参，不会与父类引用属性共享，可以复用父类的函数，但是也存在一个缺点就是在继承父类函数的时候调用了父类构造函数，导致子类的原型上多了不需要的父类属性，存在内存上的浪费。

##### 寄生组合继承

```
function Parent(value) {
  this.val = value
}
Parent.prototype.getValue = function() {
  console.log(this.val)
}

function Child(value) {
  Parent.call(this, value)
}
Child.prototype = Object.create(Parent.prototype, {
  constructor: {
    value: Child,
    enumerable: false,
    writable: true,
    configurable: true
  }
})

const child = new Child(1)

child.getValue() // 1
child instanceof Parent // true
```

以上继承实现的核心就是将父类的原型赋值给了子类，并且将构造函数设置为子类，这样既解决了无用的父类属性问题，还能正确的找到子类的构造函数。

##### Class继承

以上两种继承方式都是通过原型去解决的，ES6中，可以使用class去实现继承，并且实现很简单。

```
class Parent{
    constructor(value){
        this.val = value;
    }
    getValue(){
        console.log(this.val)
    }
}
class Child extends Parent{
    constructor(value){
        super(value)
        this.val = value;
    }
}
let child = new Child(1)
child.getValue()  // 1
child instanceof Parent   // true
```

class实现继承的核心在于使用`extends`表明继承自哪个父类，并且在子类构造器中必须使用`super`,这段代码可以看成是`Parent.call(this,value)`。

### 模块化

#### Q3.为什么要使用模块化？都有哪几种方式可以实现模块化，各有什么特点？

使用模块化的好处：

- 避免命名冲突
- 提供复用性
- 提高代码可维护性

##### 方式一：立即执行函数

在早期，使用立即执行函数实现模块化是常见手段，通过函数作用域解决命名冲突，污染全局作用域的问题。

```
(function(globalVariable){
   globalVariable.test = function() {}
   // ... 声明各种变量、函数都不会污染全局作用域
})(globalVariable)
```

##### 方式二：AMD和CMD

AMD，即异步模块定义。它是一个在浏览器端模块化开发的规范。由于不是javascript原生支持，使用AMD需用到对应的库函数，即RequireJS。

```
// AMD
define(['./a', './b'], function(a, b) {
  // 加载模块完毕可以使用
  a.do()
  b.do()
})
```

CMD,即通用模块定义，CMD规范是国内发展出来的，就像AMD有个RequireJS,CMD有个浏览器的实现SeaJS.SeaJS要解决的问题和requireJS一样，只不过在模块定义方式和模块加载时机上有所不同。

```
// CMD
define(function(require, exports, module) {
  // 加载模块
  // 可以把 require 写在函数体的任意地方实现延迟加载
  var a = require('./a')
  a.doSomething()
})
```

鉴于目前这两种实现方式已经很少见到，所以不再对具体特性细聊，只需要了解这两者是如何使用的。

##### 方式三：CommonJS

CommonJS 最早是 Node 在使用，目前也仍然广泛使用，比如在 Webpack 中你就能见到它，当然目前在 Node 中的模块管理已经和 CommonJS 有一些区别了。

```
// a.js
module.exports = {
    a: 1
}
// or 
exports.a = 1

// b.js
var module = require('./a.js')
module.a // -> log 1
```

另外虽然 `exports` 和 `module.exports` 用法相似，但是不能对 `exports` 直接赋值。因为 `var exports = module.exports` 这句代码表明了 `exports` 和 `module.exports` 享有相同地址，通过改变对象的属性值会对两者都起效，但是如果直接对 `exports` 赋值就会导致两者不再指向同一个内存地址，修改并不会对 `module.exports` 起效。

##### 方式四：ES Module

ES Module 是原生实现的模块化方案，与CommonJS的区别：

- CommonJS支持动态导入，也就是require(${path}/xx.js),后者目前不支持，但已有提案；
- CommonJS是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需下载文件，如果也采用同步会对渲染有大影响；
- CommonJS在导出时都是值拷贝，就算导出值变了，导入值不会改变，所以如果想更新必须重新导。但ES Module采用实时绑定的方式，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化；
- ES Module 会编译成require/exports 来执行。

```
// 引入模块 API
import XXX from './a.js'
import { XXX } from './a.js'
// 导出模块 API
export function a() {}
export default function() {}
```

### Proxy

#### Q4.Proxy 可以实现什么功能？

在Vue3.0中将会通过Proxy来替换原本的Object.defineProperty来实现数据响应式。Proxy是ES6中新增的功能，可以用来自定义对象中的操作。

```
let p =new Proxy(target,handle)
```

target代表需要添加代理的对象，handle用来自定义对象中的操作。比如set 或者get 函数。

如果需要实现一个 Vue 中的响应式，需要我们在 `get` 中收集依赖，在 `set` 派发更新，之所以 Vue3.0 要使用 `Proxy` 替换原本的 API 原因在于 `Proxy` 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好，并且原本的实现有一些数据更新不能监听到，但是 `Proxy` 可以完美监听到任何方式的数据改变，唯一缺陷可能就是浏览器的兼容性不好了。

### Map, filter,reduce

#### Q5.map,filter,reduce 各自有什么作用？

`map`作用是生成一个新数组，遍历原数组，将每个元素拿出来做一些变换然后放入到新数组中。

```
[1,2,3].map(v => v +1)   // [2,3,4]
```

另外`map`的回调函数接受三个参数，分别是当前索引元素，索引，原数组。

`filter` 的作用是生成一个新数组，在遍历数组的时候将返回值为true的元素放入新数组，我们可以利用这个函数删除一些不需要的元素。

```
let array = [1,2,3,4,6]
let newArray = array.filter(item => item < 5)
console.log(newArray);    // [1,2,3,4]
```

和 `map` 一样，`filter` 的回调函数也接受三个参数，用处也相同。

`reduce` 可以将数组中的元素通过回调函数最终转换为一个值。

如果我们想实现一个功能将函数里的元素全部相加得到一个值，可以这样：

```
const arr = [1,2,3]
let total =0;
for(let i=0;i<arr.length;i++){
    total += arr[i]
}
console.log(total);
```

如果使用reduce的话，可以将遍历部分的代码优化为一行代码：

```
const arr =[1,2,3]
const sum = arr.reduce((acc,current) => acc + current,0)
```

对于 `reduce` 来说，它接受两个参数，分别是回调函数和初始值，接下来我们来分解上述代码中 `reduce` 的过程:

- 首先初始值为 `0`，该值会在执行第一次回调函数时作为第一个参数传入
- 回调函数接受四个参数，分别为累计值、当前元素、当前索引、原数组，后三者想必大家都可以明白作用，这里着重分析第一个参数
- 在一次执行回调函数时，当前值和初始值相加得出结果 `1`，该结果会在第二次执行回调函数时当做第一个参数传入
- 所以在第二次执行回调函数时，相加的值就分别是 `1` 和 `2`，以此类推，循环结束后得到结果 `6`

`reduce` 是如何通过回调函数将所有元素最终转换为一个值的，当然 `reduce` 还可以实现很多功能，接下来我们就通过 `reduce` 来实现 `map` 函数:

```
const arr = [1, 2, 3]
const mapArray = arr.map(value => value * 2)
const reduceArray = arr.reduce((acc, current) => {
  acc.push(current * 2)
  return acc
}, [])
console.log(mapArray, reduceArray) // [2, 4, 6]
```

> 当前章节 end!

