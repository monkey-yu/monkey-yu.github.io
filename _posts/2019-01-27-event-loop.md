---
layout:     post
title:      "Event Loop"
subtitle:   " \"Event Loop\""
date:       2019-01-27 09:00:00
author:     "monkey-yu"
header-img: "img/post-bg-mac.jpg"
catalog: true
tags:
    - 面试
    - 前端
---
> Event Loop 来自掘金小册

### 进程与线程

#### Q1.进程与线程的区别？JS单线程带来的好处？

大家都知道JS是单线程执行的。线程与进程，都是**CPU工作时间片**的一个描述。

进程描述了CPU在**运行指令集加载和保存上下文所需的时间**，放在应用上来说就代表了一个程序。线程是进程中的更小单位，描述了执行一段指令所需的时间。

把这些概念拿到浏览器中来说，就是当你打开一个tab页时，其实就创建了一个进程，一个进程中可以有多个线程，比如渲染线程、JS引擎线程、HTTP请求线程等。当你发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能会被销毁。

在JS运行的时候可能会阻止UI渲染，这说明JS引擎线程和渲染线程是互斥的。这其中原因就是因为JS可以修改DOM,如果在JS执行的时候UI线程还在工作，就可能导致不安全的渲染UI。这其实也是JS为单线程的好处，得益于JS是单线程运行的，可以达到节省内存，节约上下文切换时间，没有锁的问题的好处。

### 执行栈

#### Q2.什么是执行栈？

可以把执行栈认为是一个存储函数调用的栈结构，遵循先进后出的原则。

![](https://user-gold-cdn.xitu.io/2018/11/13/1670d2d20ead32ec?imageslim)

当开始执行JS代码时，首先会执行一个main函数，然后执行我们的代码。根据先进后出原则，后执行的函数会先弹出栈，在上图中，foo函数执行完毕后就从栈中弹出了。

即入栈顺序： main() --> log() --> bar() --> foo()

出栈顺序：foo() --> bar() --> log() --> main()

平时在开发中，大家也可以在报错中找到执行栈的痕迹：

```
function foo() {
  throw new Error('error')
}
function bar() {
  foo()
}
bar()
```

![](/img/post_img/js-interview/event-loop-1.jpg)

大家可以在上图清晰的看到报错在 `foo` 函数，`foo` 函数又是在 `bar` 函数中调用的。

当我们使用递归的时候，因为栈可存放的函数是有限制的，一旦存放过多函数且没得到释放，会出现爆栈的问题：

```
function bar(){
    bar()
}
bar()
```

![](/img/post_img/js-interview/event-loop-2.jpg)

### 浏览器中的Event Loop 

#### Q3.异步代码执行顺序？解释一下什么是Event Loop?

当我们执行 JS 代码的时候其实就是往执行栈中放入函数，那么遇到异步代码的时候该怎么办？当遇到异步代码时，会被挂起并在需要执行的时候加入到task队列中。一旦执行栈为空，Event Loop就会从Task队列中拿出需要执行的代码并放入到执行栈中。所以本质上来说JS中的异步还是同步行为。

![](/img/post_img/js-interview/event-loop-3.jpg)

不同的任务源会被分配到不同的task队列中，任务源可以氛围微任务（microtask）和宏任务（macrotask）。在ES6规范中，microtask称为jobs,macrotask称为task。下面来看段代码的执行顺序：

```
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
// script start => async2 end => Promise => script end => promise1 => promise2 => async1 end => setTimeout
```

首先解释下`async` 和 `await` 的执行顺序：当我们调用`async1`函数时，会马上输出`async2 end`，并且函数返回一个`Promise`,接下来在遇到`await`的时候就会让出线程开始执行`async1` 外的代码，所以我们完全可以把`await`看成是***让出线程***的标志。

当同步代码全部执行完毕后，就去执行所有的异步代码，那么又会回到`await`的位置执行返回的`Promise`的`resolve`函数，这又会把`resolve`丢到微任务队列中，接下来去执行`then`中的回调，当2个`then`执行完毕以后，又会回到`await`的位置处理返回值，这时候可以看成是`Promise`,`resolve(返回值).then()`,然后`await`后的代码全部被包裹进`then`的回调中，所以 `console.log('async1 end')` 会优先执行于 `setTimeout`。

把 上面`async` 的这两个函数改造成容易理解的代码：

```
new Promise((resolve,reject)=>{
    console.log('async2 end')
    // Promise.resolve()将代码插入微任务队列尾部
    // resolve再次插入微任务队列尾部
    resolve(Promise.resolve())
}).then(()=>{
    console.log('async1 end)
})
```

也就是说，如果 `await` 后面跟着 `Promise` 的话，`async1 end` 需要等待三个 tick 才能执行到。那么其实这个性能相对来说还是略慢的，所以 V8 团队借鉴了 Node 8 中的一个 Bug，在引擎底层将三次 tick 减少到了二次 tick。但是这种做法其实是违法了规范的，当然规范也是可以更改的，这是 V8 团队的一个 [PR](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fecma262%2Fpull%2F1250)，目前已被同意这种做法。

所以 Event Loop 执行顺序如下所示：

- 首先执行同步代码，这属于宏任务；
- 当执行完所有同步任务后，执行栈为空，查询是否有异步代码需执行；
- 执行所有微任务；
- 当执行完所有微任务后，如有必要会渲染页面；
- 然后开始下一轮Event Loop,执行宏任务中的异步代码，也就是setTimeout 中的回调函数

***微任务***包括：process.nextTick ,promise ,MutationObserver.

***宏任务***包括：script ，setTimeout ,setInterval , setImmediate,I/O,UI rendering.

### Node 中的 Event Loop

#### Q4.Node 中的 Event Loop 和浏览器中的有什么区别？process.nexttick 执行顺序？

Node 中的 Event Loop 和浏览器中的是完全不相同的东西。

Node 的 Event Loop 分为 6 个阶段，它们会按照**顺序**反复运行。每当进入某一个阶段的时候，都会从对应的回调队列中取出函数去执行。当队列为空或者执行的回调函数数量到达系统设定的阈值，就会进入下一阶段。

![](/img/post_img/js-interview/event-loop-4.jpg)

> end !