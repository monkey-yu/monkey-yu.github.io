---
layout:     post
title:      "JS 异步编程"
subtitle:   " \"JS 异步编程及常考面试题 \""
date:       2019-01-09 12:00:00
author:     "monkey-yu"
header-img: "img/post-bg-mac.jpg"
catalog: true
tags:
    - 技术
    - 面试
---
> JS 异步编程及常考面试题 来自掘金小册

## 并发（concurrency）和并行（parallelism）区别

#### Q1.并发与并行的区别？

并发是宏观概念，分别有任务A和任务B,在一段时间内通过任务间的切换完成了这两个任务，这种情况就可以称之为并发。

并行是微观概念，假设 CPU 中存在两个核心，那么我就可以同时完成任务 A、B。同时完成多个任务的情况就可以称之为并行。

## 回调函数（Callback）

#### Q2.什么是回调函数？回调函数有什么缺点？如何解决回调地狱？

回调函数例子：

```
ajax(url,()=>{
    
})
```

回调函数的致命弱点是回调地狱。假设多个请求存在依赖性，你可能就会写出如下代码：

```
ajax(url,()=>{
    // 处理逻辑
    ajax(url1,()=>{
         // 处理逻辑
        ajax(url2,()=>{
			// 处理逻辑
        })
    })
})
```

回调地狱的根本问题是：

- 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身；
- 嵌套函数一多，就很难处理错误。

回调函数还存在其他缺点，比如：不能使用try catch捕获错误，不能直接return。

### Generator

#### Q3.你理解的generator是什么？

Generator最大的特点是可以控制函数的执行。

```
function *foo(x){
    let y = 2*yield(x+1);
    let z = yield(y/3);
    return (x+y+z);
}
let it = foo(5);
console.log(it.next());      // {value:6,done:false}
console.log(it.next(12));    // {value:8,done:false}
console.log(it.next(13));    // {value:42,done:true}
```

分析上例：

- 首先generator函数调用和普通函数不一样，它会返回一个迭代器；
- 当执行第一次next,传参会被忽略，并且函数暂停在yield (x+1)处，所以返回5+1 =6；
- 当执行第二次next时，传入的参数等于上一个yield的返回值，如果你不传参，yield永远返回undefined。此时 let y = 2 * 12,所以第2个yield等于2 * 12/3=8。
- 当执行第三次next时，传入的参数会给到z,所以z =13,y=24,x=5,相加等于42。

`Generator` 函数一般见到的不多，其实也于他有点绕有关系，并且一般会配合 co 库去使用。当然，我们可以通过 `Generator` 函数解决回调地狱的问题，可以把之前的回调地狱例子改写为如下代码：

```
function *fetch(){
    yield ajax(url,()=>{});
    yield ajax(url1,()=>{});
    yield ajax(url2,()=>{})
}
let it = fetch();
let result1 = it.next();
let result2 = it.next();
let result3 = it.next();
```

## Promise

#### Q4.Promise的特点是什么？有什么优缺点？什么是Promise链？Promise构造函数执行和then函数执行有什么区别？

Promise翻译过来是承诺的意思，这个承诺会在未来一定时间后给出答复，一般有三种状态，分别是等待中（pending）、完成了（resolved）、拒绝了（rejected）。这个状态一旦从等待状态转变为完成状态后，状态就不会再改变了。

```
new Promise((resolve,reject)=>{
    resolve('success')
    // 下面是无效的
    reject('reject')
})
```

当我们在构造Promise的时候，构造函数内部的代码是立即执行的。

```
new Promise((resolve, reject) => {
  console.log('new Promise')
  resolve('success')
})
console.log('finifsh')
// new Promise -> finifsh
```

Promise实现链式调用，也就是说每次调用then之后返回的都是一个Promise,并且是一个全新的Promise,原因也是因为状态不可变。如果你在then中使用了return，那么return的值会被Promise.resolve()包装。

```
Promise.resolve(1)
	.then(res =>{
        console.log(res)  // 1
        return 2
	})
	.then(res =>{
        console.log(res);   //2
	})
```

当然了，`Promise` 也很好地解决了回调地狱的问题，可以把之前的回调地狱例子改写为如下代码：

```
ajax(url)
	.then(res =>{
        console.log(res);
        return ajax(url1)
	})
	.then(res =>{
         console.log(res);
        return ajax(url2)
	}).then(res => console.log(res))
```

Promise的缺点是无法取消Promise,错误需要通过回调函数捕获。

### Async 及await

#### Q5.async 及 await 的特点，它们的优点和缺点分别是什么？await 原理是什么？

一个函数如果加上async,那么该函数就会返回一个Promise:

```
async function test(){
    return "1"
}
console.log(test());  // -> Promise {<resolved>: "1"}
```

`async` 就是将函数返回值使用 `Promise.resolve()` 包裹了下，和 `then` 中处理返回值一样，并且 `await` 只能配套 `async` 使用。

```
async function test() {
  let value = await sleep()
}
```

`async` 和 `await` 可以说是异步终极解决方案了，相比直接使用 `Promise` 来说，优势在于处理 `then` 的调用链，能够更清晰准确的写出代码，毕竟写一大堆 `then` 也很恶心，并且也能优雅地解决回调地狱问题。当然也存在一些缺点，因为 `await` 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 `await` 会导致性能上的降低。

```
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch(url)
  await fetch(url1)
  await fetch(url2)
}
```

下面看一个await的例子：

```
let a =0;
let b = async() =>{
    a =a + await 10
    console.log('2',a);     // '2',10
}
b()
a++;
console.log('1',a)          // '1',1
```

对于以上代码你可能会有疑惑，让我来解释下原因

- 首先函数 `b` 先执行，在执行到 `await 10` 之前变量 `a` 还是 0，因为 `await` 内部实现了 `generator` ，`generator` 会保留堆栈中东西，所以这时候 `a = 0` 被保存了下来
- 因为 `await` 是异步操作，后来的表达式不返回 `Promise` 的话，就会包装成 `Promise.reslove(返回值)`，然后会去执行函数外的同步代码
- 同步代码执行完毕后开始执行异步代码，将保存下来的值拿出来使用，这时候 `a = 0 + 10`

上述解释中提到了 `await` 内部实现了 `generator`，其实 `await` 就是 `generator` 加上 `Promise`的语法糖，且内部实现了自动执行 `generator`。如果你熟悉 co 的话，其实自己就可以实现这样的语法糖。

## 常用定时器函数

#### Q6.setTimeout、setInterval、requestAnimationFrame 各有什么特点？

异步编程当然少不了定时器了，常见的定时器函数有 `setTimeout`、`setInterval`、`requestAnimationFrame`。

由于js是单线程执行的，如果前面的代码影响了性能，可能会导致setTimeout 不能按期执行。

setInterval和setTimeout作用基本一致，只是该函数是每隔一段时间执行一次回调函数。通常不建议使用setInterval，原因有二：（1）同setTimeout 一样，可能不会按时执行。（2）它存在执行累积的问题。

如果你有循环定时器的需求，其实完全可以通过 `requestAnimationFrame` 来实现。

```
function setInterval(callback, interval) {
  let timer
  const now = Date.now
  let startTime = now()
  let endTime = startTime
  const loop = () => {
    timer = window.requestAnimationFrame(loop)
    endTime = now()
    if (endTime - startTime >= interval) {
      startTime = endTime = now()
      callback(timer)
    }
  }
  timer = window.requestAnimationFrame(loop)
  return timer
}

let a = 0
setInterval(timer => {
  console.log(1)
  a++
  if (a === 3) cancelAnimationFrame(timer)
}, 1000)
```

首先 `requestAnimationFrame` 自带函数节流功能，基本可以保证在 16.6 毫秒内只执行一次（不掉帧的情况下），并且该函数的延时效果是精确的，没有其他定时器时间不准的问题，当然你也可以通过该函数来实现 `setTimeout`。

> JS异步编程，end!

