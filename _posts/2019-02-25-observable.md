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
    - JS
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

#### 自定义Observable

Observable就是一个函数，它接受一个Observer作为参数然后返回另一个函数。

它的基本特征：

- 是一个函数
- 接受一个observer对象（包含next、error、complete方法的对象）作为参数
- 返回一个unsubscribe函数，用于取消订阅

接下来实现一个Observable的基础实现：

DataSource -数据源

```
class DataSource{
    constructor(){
        let i =0;
        this._id = setInterval(()=> this.emit(i++),200)
    }
    emit(n){
        const limit =10;
        if(this.ondata){
            this.ondata(n)
        }
        if(n === limit){
            if(this.oncomplete){
                this.oncomplete()
            }
            this.destroy()
        }
    }
    destroy(){
        clearInterval(this._id);
    }
}
```

myObservable

```
function myObservable(observer){
    let datasource = new DataSource();
    datasource.ondata = (e)=> observer.next(e);   // 处理数据流
    datasource.onerror = ()=>observer.error(err);  // 处理异常
    datasource.oncomplete = ()=>observer.complete();  //处理数据流终止
    return () =>{     // 返回一个函数用于，销毁数据源
        datasource.destroy()
    }
}
```

使用示例：

```
const unsub = myObservable({
    next(x){console.log(x)},
    error(err){console.error(err)},
    complete(){console.log('done')}
});
// 下面是测试取消订阅的
// setTimeout(unsub,500);
```

#### safeObserver - 更好的Observer

在Rxjs5里面，为开发者提供了一些保障机制，来保证一个更安全的观察者。以下是一些比较重要的原则：

- 传入的Observer对象可以不实现所有规定的方法（next、error、complete）
- 在complete 或者error触发之后再调用next方法是没用的
- 调用unsubscribe方法后，任何方法不能再被调用了
- complete 和error触发后，unsubscribe 也会自动调用
- 当next、complete 和error出现异常时，unsubscribe也会自动调用以保证资源不会浪费
- next、complete 和error是可选的，按需处理，不必全部处理

#### Rx.Observable.create

Rxjs的核心特性时它的异步处理能力，但它也可以用来处理同步的行为。

```
var observable = Rx.Observable.create(function(observer){
    boserver.next('yu');
    observer.next('jian')
})
console.log('start');
observable.subscribe(function(value){
    console.log(value)
});
console.log('end');
```

上述代码，控制台的输出结果：

```
start
yu
jian
end
```

 Observable 可以应用于同步和异步的场合。

#### Observable 操作符

Rxjs中提供了很多操作符，用于创建Observable对象，常见的操作符如下：

create 、of 、from 、fromEvent 、fromPromise 、empty 、never 、throw 、 timer 、interval

##### of 示例

```
var source =Rx.Observable.of('yu','jian');
source.subscribe({
    next:function(value){
        console.log(value)
    },
    complete:function(){
        console.log('complete')
    },
    error:function(){
        console.log(error)
    }
})
```

上述代码，控制台的输出结果：

```
yu
jian
complete
```

##### from  与of 类似，但其后接的参数是数组，或者字符串。输出结果是数组里每一项。

##### fromEvent 示例

```
Rx.Observable.fromEvent(document.querySelector('button'),'click');
```

##### fromPromise 示例

```
var source = Rx.Observable
  .fromPromise(new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello RxJS!');
    },3000)
}));
  
source.subscribe({
    next: function(value) {
        console.log(value);
    },
    complete: function() {
        console.log('complete!');
    },
    error: function(error) {
        console.log(error);
    }
});
```

输出结果：

```
Hello RxJS!
complete!
```

##### empty 

```
var source =Rx.observable.empty();
// 后面同上
```

empty操作符返回一个空的Observable对象，如果我们订阅该对象，它会立即返回complete信息。

##### never

never 操作符会返回一个无穷的 Observable，当我们订阅它后，什么事情都不会发生，它是一个一直存在却什么都不做的 Observable 对象。

##### throw

```
var source = Rx.Observable.throw('oop!');
source.subscribe({
    next: function(value) {
        console.log(value);
    },
    complete: function() {
        console.log('complete!');
    },
    error: function(error) {
        console.log('Throw Error: ' + error);
    }
});
```

以上代码运行后，控制台的输出结果：

```
Throw Error:oop!
```

throw操作符，只做一件事就是抛出异常。

##### interval

```
var source =Rx.observable.interval(1000);
// 后面同上
```

以上代码运行后，控制台的输出结果：

```
0
1
2
...
```

interval操作符支持一个数值类型的参数，用于表示时间的间隔。上面代码表示每隔1s，会输出一个递增的值，初始值从0开始。

#### Subscription

有些时候对于一些 Observable 对象 (如通过 interval、timer 操作符创建的对象)，当我们不需要的时候，要释放相关的资源，以避免资源浪费。针对这种情况，我们可以调用 `Subscription` 对象的 `unsubscribe` 方法来释放资源。

#### Rxjs - Observer

Observer（观察者）是一个包含三个方法的对象，每当observable触发事件是，便会自动调用观察者的对应方法。

Observer接口定义：

```
interface Observer<T>{
    closed?:boolean;  // 标识是否已经取消Observable对象的订阅
    next:(value:T) => void;
    error:(err:any) => void;
    complete:() => void;
}
```

Observer 中的三个方法的作用：

- next - 每当 Observable 发送新值的时候，next 方法会被调用
- error - 当 Observable 内发生错误时，error 方法就会被调用
- complete - 当 Observable 数据终止后，complete 方法会被调用。在调用 complete 方法之后，next 方法就不会再次被调用

#### Observable VS Promise

- Promise
  - 返回单个值
  - 不可取消的
- Observable
  - 随着时间的推移发出多个值
  - 可以取消的
  - 支持 map、filter、reduce 等操作符
  - 延迟执行，当订阅的时候才会开始执行

#### 延迟计算 & 渐进式取值

##### 延迟计算

所有的observable对象一定会等到订阅后才开始执行，如果没有订阅不会执行。

```
var source = Rx.Observable.from([1,2,3,4,5]);
var example = source.map(x => x + 1);
```

上面的示例中，因为 example 对象还未被订阅，所以不会进行运算。这跟数组不一样，具体如下：

```
var source = [1,2,3,4,5];
var example = source.map(x => x + 1); 
```

以上代码运行后，example 中就包含已运算后的值。

##### 渐进式取值

数组中的操作符如：filter、map 每次都会完整执行并返回一个新的数组，才会继续下一步运算。具体示例如下：

```
var source = [1,2,3,4,5];
var example = source
                .filter(x => x % 2 === 0) // [2, 4]
                  .map(x => x + 1) // [3, 5]
```

![observable1](/img/post_img/observable/observable1.gif)

虽然 Observable 运算符每次都会返回一个新的 Observable 对象，但每个元素都是渐进式获取的，且每个元素都会经过操作符链的运算后才输出，而不会像数组那样，每个阶段都得完整运算。具体示例如下：

```
var source = Rx.Observable.from([1,2,3,4,5]);
var example = source
              .filter(x => x % 2 === 0)
              .map(x => x + 1)

example.subscribe(console.log);
```

![observable2](/img/post_img/observable/observable2.gif)

> end！