---
layout:     post
title:      "前端常用的设计模式"
date:       2019-02-22 16:00:00
author:     "monkey-yu"
header-img: "img/post-sea.jpeg"
catalog: true
tags:
    - 技术
---

> 设计模式 来自掘金小册

设计模式（Design pattern）是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。设计模式现在共有23种，前端常用的设计模式大约如下几种。

#### 1.工厂模式

##### 工厂模式的定义：

提供创建对象的接口，根据领导（调用者）的指示（参数），生产相应的产品（对象）。工厂起到的作用就是隐藏创建实例的复杂度，只提供一个接口，简单清晰。

##### 分类：简单工厂模式、复杂工程模式

ES5 的工厂模式示例代码：

```
<script>
	function Car(name,year,country){
        var obj = new Object();
        obj.year = year;
        obj.name=name;
        obj.country = country;
        obj.sayName = function(){
            console.log(this.name)
        }
        return obj
	}
	var myCar = Car('BMW',2017,'Germany');
	var yourCar = Car('Benz',2016,'Germany');
</script>
```

ES6的工厂模式示例代码：

```
class Man{
    constructor(name){
        this.name =name
    }
    alertName(){
        alert(this.name)
    }
}
class Factory{
    static create(name){
        return new Man(name)
    }
}
Factory.create('monkey-yu').alertName()
```

#### 2.单例模式

单例模式很长远，比如全局缓存、全局状态管理等这些只需要一个对象，就可以使用单例模式。

单例模式的核心就是保证全局只有一个对象可以访问。即只需要用一个变量确保实例只创建一次就行。

单例模式的示例代码：

```
class Singleton{
    constructor(){}
}
Singleton.getInstance = (function(){
    let instance
    return function(){
        if(!instance){
            instance = new Singleton()
        }
        return instance
    }
})()

let s1 = Singleton.getInstance();
let s2 = Singleton.getInstance();
console.log(s1 === s2)    // true
```

在 Vuex 源码中，你也可以看到单例模式的使用，虽然它的实现方式不大一样，通过一个外部变量来控制只安装一次 Vuex。

```
let Vue // bind on install

export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    // 如果发现 Vue 有值，就不重新创建实例了
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```

#### 3.装饰模式

装饰模式不需要改变已有的接口，作用是给对象添加功能。装饰器模式是使用了ES7中的装饰器的语法。

装饰模式的示例代码：

```
function readonly(target,key,descriptor){
    descriptor.writable = false;
    return descriptor
}
class Test{
    @readonly
    name = 'monkey-yu'
}
let c = new Test()
c.name = '111';  // 不可修改，仍然是monkey-yu
```

在 React 与Angular中，装饰模式随处可见。

#### 4.代理模式

代理是为了控制对对象的访问，不让外部直接访问到对象。在实际代码中，代理的例子很多，事件代理就是用到了代理模式。

事件代理的实例代码：

```
<ul id="ul">
	<li>1</li>
	<li>2</li>
	<li>3</li>
	<li>4</li>
</ul>
<script>
	let ul = document.querySelector('#ul');
	ul.addEventListener('click',(event)=>{
        console.log(event.target)
	})
</script>
```

因为存在太多li元素，不能每一个都去绑定事件，因此在其父元素上绑定一个事件，让父节点作为代理去拿到真实点击的节点。

#### 5.发布-订阅模式

发布-订阅模式也叫做观察者模式。通过一对一或者一对多的依赖关系，当对象发生改变时，订阅方会收到通知。在实际代码中发布-订阅模式也很常见，比如点击一个按钮就会触发点击事件就是使用了该模式。

```
<ul id="ul"></ul>
<script>
    let ul = document.querySelector('#ul')
    ul.addEventListener('click', (event) => {
        console.log(event.target);
    })
</script>
```

在vue中，如何实现响应式就是使用了这种模式。对于需要实现响应式的对象来说，在get的时候会进行依赖收集，当改变了对象的属性时，就会触发派发更新。

#### 6.外观模式

外观模式提供了一个接口，隐藏了内部的逻辑，更加方便外部调用。

比如实现一个兼容多种浏览器的添加事件方法，示例代码：

```
function addEvent(elm,evType,fn,useCapture){
    if(elm.addEventListener){
    	elm.addEventListener(evType, fn, useCapture)
        return true
    }else if(elm.attachEvent){
        var r=elm.attachEvent("on"+evType,fn);
        return r
    }else{
        elm['on'+evType]=fn
    }
}
```

对于不同的浏览器，添加事件的方法可能是不同的。如果每次都去写一遍的话，肯定是不能接受的。所以我们将这些逻辑都封装在一个接口中，外部需要添加事件只需要调用`addEvent`即可。

#### 7.迭代器模式

迭代器模式是提供一种方法顺序的访问一个聚合对象中各个元素，而又不暴露该对象的内部表示。在ES5中给数组扩展了很多原型方法，其中有一个很好用的迭代器forEach。forEach的参数就是一个函数，该函数的参数分别是值、索引、数组引用。它会按顺序遍历数组中的每一个元素，并且执行函数。

示例代码：

```
var arr=['a','b','c'];
arr.forEach(function(value,index,arr){
    console.log(value,index,arr)
});
// a 0 ['a','b','c']
// b 1 ['a','b','c']
// c 2 ['a','b','c']
```

类似的还有jQuery框架中的$.forEach()静态函数。

迭代器分为内部迭代器、外部迭代器。

在ES6中，常用的集合对象（数组、set/map集合）和字符串都是可迭代对象。这些对象都有默认的迭代器和`Symbol.iterator`属性。ES6封装了一个生成器来创建迭代器，显然生成器是返回迭代器的函数。

#### 8.原型模式

原型模式是用原型实例指向创建对象的类，使用于创建新的对象的类的共享原型的属性与方法。

对于原型模式，我们可以利用js特有的原型继承特性去创建对象的方式，也就是创建的一个对象作为另外一个对象的prototype属性值。原型对象本身就是有效地利用了每个构造器创建的对象，例如，如果一个构造函数的原型包含了一个name属性（见后面的例子），那通过这个构造函数创建的对象都会有这个属性。

使用`Object.create`方法来创建这样的对象，该方法创建指定的对象，其对象的`prototype`有指定的对象（也就是该方法传进的第一个参数对象），也可以包含其他可选的指定属性。

```
var vehicle ={
    getModel:function(){
        console.log('车辆的模具是：'+ this.model);
    }
}
var car = Object.create(vehicle,{
    'id':{
        value:MY_GLOBAL.nextId(),
        enumerable: true // 默认writable:false, configurable:false
    },
    'model':{
        value:'福特'，
        enumerable: true
    }
})
```

原型模式在JavaScript里的使用简直是无处不在，其它很多模式有很多也是基于prototype的。原型模式适合在创建复杂对象时，对于那些需求一直在变化而导致对象结构不停地改变时，将那些比较稳定的属性与方法共用而提取的继承的实现。