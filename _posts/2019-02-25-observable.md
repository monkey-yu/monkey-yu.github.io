---
layout:     post
title:      "Observable详解"
subtitle:   " \"RxJS Observable详解 \""
date:       2019-02-25 15:00:00
author:     "monkey-yu"
header-img: "img/post-sea.jpeg"
catalog: true
tags:
    - 技术
    - js
---

在介绍Observable之前，先了解两个设计模式：

- Observer Pattern(观察者模式)
- Iterator Pattern(迭代器模式)

这两个模式是Observable的基础。

#### 观察者模式

观察者模式也叫发布订阅模式，它定义了一种一对多的关系，让多个观察者对象同时监听某一主题对象，这个主题对象的状态发生变化就会通知所有的观察者对象，使得他们能够更新自己。

在观察者模式中有两个主要角色：Subject(主题)、Observer(观察者)

##### 观察者模式优点：

1. 支持简单的广播通信，自动通知所有已经订阅过的对象
2. 目标对象与观察者之间的抽象耦合关系能够单独扩展以及重用

##### 观察者模式缺点：

1. 如果有多个直接或间接的观察者的话，将所有观察者通知到耗时久
2. 如果观察者和观察目标之间有循环依赖的话，循环调用可能会导致系统崩溃

##### 观察者模式的应用

DOM对象添加事件监听。

```
<button id="btn">确认</button>
function clickHandle(event){
    console.log('用户已点击按钮')
}
document.getElementById("btn").addEventListener('click',clickHandle);
```

##### 观察者模式实战

Subject 类定义：

```
class Subject{
    constructor(){
        this.observerCollection = []
    }
    registerObserver(observer){
        this.observerCollection.push(observer)
    };
    unregisterObserver(observer){
       let index =this.observerCollection.indexOf(observer) ;
       if(index >= 0) this.observerCollection.splice(index,1)
    };
    notifyObservers(){
        this.observerCollection.forEach((observer)=>observer.notify())
    }
}
```

Observer类定义：

```
class Observer{
    constructor(name){
        this.name =name
    }
    notify(){
        console.log(`${this.name} has been notified `)
    }
}
```

使用示例：

```
let subject =new Subject();       // 创建主题
let observer1 = new Observer('yu');   // 创建观察者1
let observer2 = new Observer('jian');  // 创建观察者2
subject.registerObserver(observer1);   // 注册观察者1
subject.registerObserver(observer2);   // 注册观察者2
subject.notifyObservers();   // 通知观察者
subject.unregisterObserver(observer1); // 移除观察者1
subject.notifyObservers(); // 验证是否成功移除
```

#### 迭代器模式

迭代器模式也叫游标（cursor)模式。它提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。

##### 迭代器模式优点：

1. 简化遍历方式
2. 封装性良好，用户只需要得到迭代器就可以遍历，而不用去关心遍历算法

##### 迭代器模式缺点：

1. 遍历过程是一个单向且不可逆的遍历

一个迭代器对象，知道如何每次访问集合中的一项，并记录它的档期在序列中所在的位置。在js中迭代器就是一个对象，它提供了一个next()方法，返回序列中的下一项。

- 在最后一个元素前：`{done:false,value:elementValue}`
- 最后一个元素：`{done:true, value:undefined}`

##### ES5迭代器

```
function makeIterator(array){
    var nextIndex =0;
    return {
        next:function(){
            return nextIndex < array.length ? {value:array[nextIndex++],done:false} : 	{done:true};
        }
    }
}
var it = makeIterator['yo','ma'];
console.log(it.next().value);  // 'yo'
console.log(it.next().value);  // 'ma'
console.log(it.next().done);  // 'true'
```

##### ES6迭代器

在ES6中，可以通过Symbol.iterator来创建可迭代对象的内部迭代器。

```
let arr=['a','b','c'];
let iter = arr[Symbol.iterator]();
```

调用next()方法来获取数组中的元素：

```
> iter.next()
{ value: 'a', done: false }
> iter.next()
{ value: 'b', done: false }
> iter.next()
{ value: 'c', done: false }
> iter.next()
{ value: undefined, done: true }
```

ES6中可迭代对象：Arrays、Strings、Maps、Sets 、DOM data structures

#### Observable

RxJS是基于观察者模式和迭代器模式以函数式编程思维来实现的。RxJS里含有两个基本概念：Observable 和Observer。Observables作为被观察者，是一个值或事件的流集合；而Observer则作为观察者，根据Observables进行处理。

Observables 与 Observer 之间的订阅发布关系(观察者模式) 如下:

- **订阅**：Observer 通过 Observable 提供的 subscribe() 方法订阅 Observable。
- **发布**：Observable 通过回调 next 方法向 Observer 发布事件。

https://segmentfault.com/a/1190000008809168#articleHeader28