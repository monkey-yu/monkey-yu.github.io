---
layout:     post
title:      "JS基础知识点"
subtitle:   " \"JS基础知识点及常考面试题（二） \""
date:       2019-01-10 12:00:00
author:     "monkey-yu"
header-img: "img/post-bg-mac.jpg"
catalog: true
tags:
    - 技术
    - 面试
---

> JS基础知识点及常考面试题（二） 来自掘金小册

### == VS ===

#### Q1.== 和===的区别？

对于==来说，如果对比双方的类型不一样，就会进行类型转换。判断流程如下：

1. 首先判断两者类型是否相同，相同的话就是比大小了；
2. 类型不相同的话，就会进行类型转换；
3. 会判断是否在对比null 和undefined，是的话就返回true;
4. 判断两者类型是否为string和number,是的话将string转为number;
5. 判断一方是否为boolean,是的话把boolean转为number再判断；
6. 判断一方是否为object 且另一方为string、number或者symbol,是的话把objext转为原始类型再判断。

如果你觉得记忆步骤太麻烦的话，我还提供了流程图供大家使用：

![](/img/post_img/js-interview/js-21.png)

对于===来说，就是判断两者的类型和值是否相同。

### 闭包

#### Q2.什么是闭包？

闭包的定义其实很简单：函数A内部有一个函数B,函数B可以访问到函数A中的变量，那么函数B就是闭包。

```
function A(){
    let a =1;
    window.B = function(){
        console.log(a);
    }
};
A(); 
B();     // 1
```

很多人对于闭包的解释可能是函数嵌套了函数，然后返回一个函数。其实这个解释是不完整的，就比如上面这个例子就反驳了这个观点。

在JS中，闭包存在的意义是**让我们可以间接访问函数内部的变量**。

#### Q3.循环中使用闭包解决‘var’定义函数的问题？

```
for(var i =1;i<=5;i++){
    setTimeout(function timer(){
       console.log(i) 
    },i*1000)
}
```

首先因为setTimeout 是异步函数，所以会把循环全部执行完毕，这时候i 就是6了，所以会输出一堆6。

解决方法有三种：

##### 第一种：使用闭包的方式

```
for(var i =1;i<=5;i++){
    ;(function(j){
        setTimeout(function timer(){
       		console.log(j) 
    	},j*1000)
    })(i)
}
```

使用立即执行函数将i传入函数内部，这个时候值就被固定在了参数j上面不会改变，当下次执行timer这个闭包是会，就可以用外部函数的变量j，从而达到目的。

##### 第二种：使用setTimeout的第三个参数，这个参数会被当成timer函数的参数传入。

```
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function timer(j) {
      console.log(j)
    },
    i * 1000,
    i
  )
}
```

##### 第三种：使用let定义i(最推荐)

```
for(let i =0;i<=5;i++){
    setTimeout(function timer(){
        console.log(i)
    },i*1000)
}
```

### 深浅拷贝

#### Q4.什么是浅拷贝？如何实现浅拷贝？什么是深拷贝？如何实现深拷贝？

在之前，我们了解了对象类型在赋值的过程中其实是复制了地址，从而会导致改变了一方其他也都被改变的情况。通常在开发中，我们不希望出现这样的问题，我们可是使用浅拷贝来解决这个问题。

```
let a ={
    age:1
}
let b =a;
a.age =2;
console.log(b.age)   // 2
```

##### 浅拷贝

首先可以通过Object.assign来解决这个问题，很多人以为这个函数是用来深拷贝的。其实并不是，Object.assign只会拷贝所有的属性值到新的对象中，如果属性值是对象的话，拷贝的是地址，所以并不是深拷贝。

```
let a={
    age:1
}
let b =Object.assign({},a);
a.age =2;
console.log(b.age)   // 1
```

另外我们还可以通过展开运算符…来实现浅拷贝。

```
let a={
    age:1
}
let b ={...a}
a.age =2;
console.log(b.age)   // 1
```

通常浅拷贝能解决大部分问题了，但是浅拷贝只能解决第一层的问题，如果接下去的值中还有对象的话，那么就又回到最开始的话题了，两者享有相同的地址。如下面：

```
let a={
    age:1,
    jobs:{
        first:'FE'
    }
}
let b ={...a}
a.jobs.first = 'native'
console.log(b.jobs.first)      // native
```

要解决这个问题，我们就得使用深拷贝了。

##### 深拷贝

这个问题通过JSON.parse(JSON.stringify(object))来解决。

```
let a={
    age:1,
    jobs:{
        first:'FE'
    }
}
let b =JSON.parse(JSON.stringfy(a));
a.jobs.first = 'native'
console.log(b.jobs.first)          // FE
```

但是该方法也是有局限性的：

- 会忽略undefined
- 会忽略symbol
- 不能序列化函数
- 不能解决循环引用的对象

在遇到函数、 `undefined` 或者 `symbol` 的时候，该对象也不能正常的序列化

```
let a = {
  age: undefined,
  sex: Symbol('male'),
  jobs: function() {},
  name: 'zhang san'
}
let b = JSON.parse(JSON.stringify(a))
console.log(b) // {name: "zhang san"}
```

### 原型

#### Q5.如何理解原型？如何理解原型链？

当我们创建一个对象obj时，在浏览器中打印obj时你会发现，在obj上居然有一个`_proto_` 属性。其实每个JS对象都有 `_proto_`属性,这个属性指向了原型。这个属性在现在来说已经不推荐直接去使用它了，这只是浏览器在早期为了让我们访问到内部属性 `[[prototype]]` 来实现的一个东西。

![js-22](/img/post_img/js-interview/js-22.png)

对于obj来说，可以通过`_proto_`找到一个原型对象，在该对象中定义了很多函数让我们来使用。在上面的图中我们还可以发现一个 `constructor` 属性，也就是构造函数。打开`constructor`属性我们又可以发现其中还有一个`prototype`属性，并且这个属性对应的值和先前我们在`_proto_`中看到的一模一样。所以：原型的`constructor`属性指向构造函数，构造函数又通过`prototype`属性指回原型，但是并不是所有函数都具有这个属性，`Function.prototype.bind()` 就没有这个属性。

其实原型就是那么简单，接下来我们再来看一张图，相信这张图能让你彻底明白原型和原型链。

![](/img/post_img/js-interview/js-23.png)

原型链就是多个对象通过 `__proto__` 的方式连接了起来。为什么 `obj` 可以访问到 `valueOf` 函数，就是因为 `obj` 通过原型链找到了 `valueOf` 函数。

总结：

- `Object` 是所有对象的爸爸，所有对象都可以通过 `__proto__` 找到它
- `Function` 是所有函数的爸爸，所有函数都可以通过 `__proto__` 找到它
- 函数的 `prototype` 是一个对象
- 对象的 `__proto__` 属性指向原型， `__proto__` 将对象和原型连接起来组成了原型链