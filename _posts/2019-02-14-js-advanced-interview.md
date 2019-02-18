---
layout:     post
title:      "JS进阶知识点"
subtitle:   " \"JS进阶知识点及常考面试题 \""
date:       2019-02-14 12:00:00
author:     "monkey-yu"
header-img: "img/post-bg-mac.jpg"
catalog: true
tags:
    - 面试
    - JS
---

> JS进阶知识点及常考面试题 来自掘金小册

### 手写call、apply及bind函数

#### Q1.call、apply及bind函数内部实现是怎样的？

首先从以下几点来考虑如何实现这几个函数：

- 不传入第一个参数，那么上下文默认为window.
- 改变了this指向，让新的对象可以执行该函数，并能接受参数

先来实现call:

```
Function.prototype.myCall =function(context){
    if(typeof this !== 'function'){
        throw new TypeError('Error)
    }
    context =context || window
    context.fn =this
    const args=[...arguments].slice(1)
    const result = context.fn(...args)
    delete context.fn
    return result
}
```

以下是实现的分析：

1. 首先context 为可选参数，不传的话默认为window.
2. 接下来给context创建一个fn属性，并将值设置为需要调用的函数
3. 因为call可以传入多个参数，所以需要将参数剥离出来
4. 然后调用函数并将对象上的函数删除

apply的实现也类似，区别只在于对参数的处理。

```
Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  let result
  // 处理参数和 call 有区别
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}
```

`bind` 的实现对比其他两个函数略微地复杂了一点，因为 `bind` 需要返回一个函数，需要判断一些边界问题，以下是 `bind` 的实现：

```
Function.prototype.myBind =function (context){
    if(typeof this!== 'function'){
        throw new TypeError('Error')
    }
    const _this =this
    const args=[...arguments].slice(1)
    // 返回一个函数
    return function F(){
        //因为返回了一个函数，我们可以 new F()，所以需要判断
        if(this intanceOf F){
            return new _this(...args,...arguments)
        }
        return _this.apply(context,args.concat(...arguments))
    }
}
```

上述实现的分析：

1. `bind` 返回了一个函数，对于函数来说有两种方式调用，一种是直接调用，一种是通过 `new` 的方式，我们先来说直接调用的方式

2. 对于直接调用来说，这里选择了 `apply` 的方式实现，但是对于参数需要注意以下情况：因为 `bind` 可以实现类似这样的代码 `f.bind(obj, 1)(2)`，所以我们需要将两边的参数拼接起来，于是就有了这样的实现 `args.concat(...arguments)`

3. 最后来说通过 `new` 的方式，在之前的章节中我们学习过如何判断 `this`，对于 `new` 的情况来说，不会被任何方式改变 `this`，所以对于这种情况我们需要忽略传入的 `this`

### new

#### Q2.new的原理是什么？通过new的方式创建对象和通过字面量创建有什么区别？

在调用new的过程中会发生以下四件事：

1. 新生成一个对象
2. 链接到原型
3. 绑定this
4. 返回新对象

自己实现一个new:

```
function create(){
	//创建一个空对象
    let obj ={}
    // 获取构造函数
    let Con = [].shift.call(arguments)
    // 设置空对象的原型
    obj._proto_=Con.prototype
    // 绑定this并执行构造函数
    let result=Con.apply(obj,arguments)
    // 确保返回值为对象
    return result instanceOf Object ? result : obj
}
```

### instanceOf 的原理

#### Q3.instanceOf的原理是什么？

instanceOf 可以正确的判断对象类型，因为内部机制是通过判断对象的原型连中是不是能找到类型的prototype。

### 垃圾回收机制

#### Q4.v8下的垃圾回收机制是怎样的？

V8实现了准确式GC,GC算法采用了分代式垃圾回收机制。因此，V8将内存（堆）分为新生代和老生代两部分。

##### 新生代算法：

新生代中的对象一般存活时间较短，使用Scavenge GC 算法。

在新生代空间中，内存空间分为两部分，分别为From 空间 和 To 空间。这两个空间中，必定一个在使用中，一个在空闲中。新分配的对象会被放入到From 空间中，当From空间被占满时，新生代GC 就会启动了。算法会检查From 空间中存活的对象并复制到To 空间中，如果有失活就会销毁。当复制完成后将From 空间和To空间互换，这样GC 就结束了。

##### 老生代算法：

老生代中的对象一般存活时间较长且数量也多，使用了两个算法，分别是标记清除算法和标记压缩算法。

在讲算法前，先来说下什么情况下对象会出现在老生代空间中：

- 新生代中的对象是否已经经历过一次 Scavenge 算法，如果经历过的话，会将对象从新生代空间移到老生代空间中。
- To 空间的对象占比大小超过 25 %。在这种情况下，为了不影响到内存分配，会将对象从新生代空间移到老生代空间中。

在老生代中，以下情况会先启动标记清除算法：

- 某一个空间没有分块的时候
- 空间中被对象超过一定限制
- 空间不能保证新生代中的对象移动到老生代中

在这个阶段中，会遍历堆中所有的对象，然后标记活的对象，在标记完成后，销毁所有没有被标记的对象。在标记大型对内存时，可能需要几百毫秒才能完成一次标记。这就会导致一些性能上的问题。为了解决这个问题，2011 年，V8 从 stop-the-world 标记切换到增量标志。在增量标记期间，GC 将标记工作分解为更小的模块，可以让 JS 应用逻辑在模块间隙执行一会，从而不至于让应用出现停顿情况。但在 2018 年，GC 技术又有了一个重大突破，这项技术名为并发标记。该技术可以让 GC 扫描和标记对象时，同时允许 JS 运行，你可以点击 [该博客](https://link.juejin.im/?target=https%3A%2F%2Fv8project.blogspot.com%2F2018%2F06%2Fconcurrent-marking.html) 详细阅读。

清除对象后会造成堆内存出现碎片的情况，当碎片超过一定限制后会启动压缩算法。在压缩过程中，将活的对象像一端移动，直到所有对象都移动完成然后清理掉不需要的内存。

