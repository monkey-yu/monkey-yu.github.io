---
layout:     post
title:      "常用的设计模式"
subtitle:   " \"前端常用的设计模式 \""
date:       2019-02-22 16:00:00
author:     "monkey-yu"
header-img: "img/post-sea.jpeg"
catalog: true
tags:
    - 技术
---

> 设计模式 来自掘金小册

设计模式（Design pattern）是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。设计模式现在共有23种，前端常用的设计模式大约如下几种。

#### 工厂模式

##### 工厂模式的定义：

提供创建对象的可口，根据领导（调用者）的指示（参数），生产相应的产品（对象）。工厂起到的作用就是隐藏创建实例的复杂度，只提供一个接口，简单清晰。

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

#### 单例模式

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

在 Vuex 源码中，你也可以看到单例模式的使用，虽然它的实现方式不大一样，通过一个外部变量来控制只安装一次 Vuex.

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

