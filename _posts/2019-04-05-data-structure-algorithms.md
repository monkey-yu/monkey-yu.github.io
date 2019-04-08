---
layout:     post
title:      "数据结构与算法（一）"
date:       2019-04-05 15:00:00
author:     "monkey-yu"
header-img: "img/buildings.jpg"
catalog: true
tags:
    - JS
---

> 惭愧自己不是计算机专业！前几天看完了《JavaScript数据结构与算法》这本书。这里总结一下。

### 数据结构

#### 一、数组

数组常用的一些方法：

- push -- 把元素添加到数组末尾
- pop --  删除数组最后一项，并返回该项
- unshift -- 把元素添加到数组开头
- shift -- 移除数组第一个元素
- splice(5,3,1,2)  — 查找到索引5开始，删除3项，然后添加1，2 两项

还有其他一些方法：

![data-structure1](/img/post_img/data-structure/data-structure1.png)

#### 二、栈

栈的数据结构类似于数组，但在添加和删除元素时更可控。

栈是遵从后进先出（LIFO）原则的有序集合。新增加或待删除的元素在栈的末尾，叫做**栈顶**。另一端叫做**栈底**。

栈的创建：

```
function Stack{
    var items = [];
    // 入栈
    this.push = function(element){
        items.push(element);
    };
    // 出栈
    this.pop = function(){
        items.pop();
    };
    // 栈顶元素
    this.peek = function(){
        return items[items.length-1];
    };
    // 是否是空栈
    this.isEmpty = function(){
        return items.length == 0;
    };
    // 输出字符串
     this.join =function(){
        return items.join('');
    }
    ... 
}
```

使用栈的例子：

```
var stack =new Stack();
stack.push(5);
stack.peek();       // 5
...
```

栈的应用：十进制转二进制，或者其他进制

![data-structure2](/img/post_img/data-structure/data-structure2.png)

代码实现：

```
// 实现10进制转2进制
function devideBy2(DecNumber){
    var remStack = [], rem , resultString = '';
    while(DecNumber>0){
        rem = Math.floor(DecNumber%2);
        remStack.push(rem);
        DecNumber = Math.floor(DecNumber/2);
    }
    return remStack.join();
}
devideBy2(10);
```

#### 三、队列

和栈类似，不过是先进先出（FIFO）的有序集合。队列在尾部添加，在顶部移除。

队列的创建：

```
function Queue{
    var items =[];
    // 进入队列
    this.enqueue = function(element){
        items.push(element);
    };
    // 出队列
    this.dequeue =function(){
        items.shift();
    };
    // 取队列首个元素
    this.front = function(){
        return items[0];
    }
    ...
}
```

使用队列：

```
var queue = new Queue();
queue.enqueue(5);
queue.front();      // 5
```

##### 优先队列

有2种：（1）设置优先级，然后在正确位置添加元素。 （2）用入队操作添加元素，按优先级出队，移除它们。

优先队列的创建：priority值越小，优先级越高

```
function PriorityQuene{
    var items =[];
    function QueneElement(element,priority){
        this.element =element;
        this.priority =priority;
    };
    this.quene = function(element,priority){
        var queneElement = new QueneElement(element,priority);
        if(this.isEmpty()){
            items.push(queneElement);
        }else{
            var added =false;
            for(var i =0;i<items.length;i++){
                if(queneElement.priority < items[i].priority){
                    items.splice(i,0,queneElement);
                    added =true;
                    break;
                }
            }
            if(!added){
              items.push(queneElement);  
            }
        }
    }
}
```

使用优先队列：

```
var priorityQueue = new PriorityQueue();
priorityQueue.enqueue("John", 2);
priorityQueue.enqueue("Jack", 1);
priorityQueue.enqueue("Camila", 1);
priorityQueue.print();
```

##### 循环队列

循环队列的一个例子就是击鼓传花游戏。

> 接下一博客 [数据结构与算法（二）](https://monkey-yu.github.io/2019/04/08/data-structure-algorithms2.html)

