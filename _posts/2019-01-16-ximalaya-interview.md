---
layout:     post
title:      "喜马拉雅面试"
subtitle:   " \"喜马拉雅面试 \""
date:       2019-01-16 12:00:00
author:     "monkey-yu"
header-img: "img/post-bg-mac.jpg"
catalog: true
tags:
    - 面试
---
> 2019年1月16日，我参加了喜马拉雅前端面试。以下是自己整理的面试题汇总，答案是当时的口述答案以及事后自己网上查询补全的，如有不准确的地方，请指正。联系邮箱📮：zhao_yu914888156@qq.com。 下面开始正文。

#### Q1.介绍下Promise,以及它的使用场景，内部原理？

Promise是承诺的意思，是指在未来一定时间后会给出答复。一般有三种状态，pending、resolved、rejected。这个状态一旦从pending变为resolved或者rejected后，状态不会再改变。

使用场景：（1）解决嵌套函数问题，防止回调地狱。（2）配合Ajax使用。

```
function PromiseGet(url){
    return new Promise((resolve,reject) =>{
        let xhr = new XMLHttpRequest()
        xhr.open('GET',url,true)
        xhr.onreadystatechange = function(){
            if(this.readyState === 4){
                if(this.status === 200){
                    resolve(this.responseText,this)
                }else{
                    let resJson ={
                        code:this.status,
                        response:this.response
                    }
                    reject(resJson,this)
                }
            }
        }
        xhr.send()
    })
}
```

用promise结合ajax,只是在promise实例中引入ajax,在ajax请求处理的结果中使用了resolve和reject状态。resolve()返回执行then()代表完成，那么reject()代表失败，返回执行catch(),同时运行中抛出的错误也会执行catch()。

#### Q2..call,.apply,.bind的作用，区别?

call()、apply()可以看作是某个对象的方法，通过调用方法的形式来间接调用函数。bind()就是将某个函数绑定到某个对象上。通俗来讲，call()、apply()它们的作用是： 让函数在某个指定的对象下执行。

```
var obj={x:1};
function foo(){console.log(this.x)};
foo.call(obj);   // 1
```

call()和apply()的第一个参数相同，就是指定的对象，这个对象就是该函数的执行上下文。

call()和apply()的区别就在于，两者之间的参数。call()在第一个参数之后的，后续所有参数就是传人该函数的值。apply()只有2个参数，第一个是对象，第二个是数组，这个数组就是该函数的参数。

```
var obj={};
function foo(a,b,c){
    console.log(b);
}
foo.call(obj,1,2,3);     // 2
foo.apply(obj,[1,2,3]);   // 2
```

bind()方法会返回执行上下文被改变的函数而不会立即执行，call()和apply()是立即执行函数。bind()的参数和call()相同。

#### Q3.浏览器调试工具有哪些，performance怎么用？

以谷歌的devtool来讲，（1）Elements是显示页面代码的，查看编辑修改元素及属性。（2）Console 执行js代码。(3)Sources 调试窗口，进行断点调试。普通断点和条件断点。（4）NetWorks 请求窗口，测试页面在不同网速下打开速度。（5）Performance 查看时间线，关注哪一块占用时间长。（6）application查看存储信息。

performance怎么用？ 还是不很清楚。

#### Q4.浏览器的默认行为有哪些？怎样取消默认事件？

javascript中的默认行为是指javascript中事件本身具有的属性，如<a>标签可以跳转，文本框可输入文字、字母等，右键浏览器会出现菜单等行为便被称为浏览器的默认行为。

为什么我们要消除浏览器的默认行为呢？因为有时在你给内容添加一个事件时，浏览器默认的为冒泡型事件触发机制,所以会触发你不想触发的事件。我们就需要消除浏览器的默认行为来使我们设置的事件能被正确触发。

（1）阻止事件冒泡，使成为捕获事件触发机制。

```
function stopBubble(e){
    // 如果提供了事件对象，则这是一个非IE浏览器
    if(e && e.stopPropagation)
    	// 因此它支持w3c的stopPropagation()方法
    	e.stopPropagation();
    else
    	// 否则，我们需要使用IE的方式来取消事件冒泡
    	window.event.cancelBubble = true;
}
```

(2)当按键后，不希望按键继续传递给如HTML文本框对象时，可以取消返回值，即停止默认事件默认行为：

```
// 阻止浏览器的默认行为
function stopDefault(e){
    //阻止默认浏览器动作（w3c）
    if(e && e.preventDefault)
    	e.preventDefault();
    // IE中阻止函数器默认动作的方式
    else
    	window.event.returnValue = false;
    return false;
}
```

#### Q5.写一个正则匹配，中国大陆的11位电话号码？

```
var regExp = /^1[0-9]{10}$/;
```

#### Q6.对象原型上有哪些方法？

没搞明白面试官的问题。对象属性：

- 属性读写
- 属性删除 `delete 对象.属性` 或者 `delete 对象[属性]`
- 属性检测   `in操作符`  `obj.hasOwnProperty('属性')`  
- 属性是否可枚举  `obj.propertyIsEnumerable('属性')`
- 定义属性  Object.defineProperty()

![obj-1](/Users/mac13/Desktop/obj-1.png)

用Object.defineProperty()定义的属性的参数都是false,即可枚举、可修改等参数都为false。

属性的方法：

- getter/setter方法

```
var man={
    name:'monkey-yu',
    get age(){
        return new Date().getFullYear()-1992;
    },
    set age(val){
        console.log("age can\'t be set to " + val)
    }
}
console.log(man.age)  // 27
man.age = 100;        // age can't be set to 100
console.log(man.age)  // 27

```

属性的标签：

- writable  该属性是否可写
- enumerable  该属性是否可遍历
- configurable  该属性是否可修改

```
var person ={};
Object.defineProperty(person,'name',{
    configurable:false,
    writable:false,
    enumerable:true,
    value:"monkey-yu"
})
person.name      // monkey-yu
person.name ='zhaoyu' ;
person.name ;    // monkey-yu
delete person.name ;    // false
```

#### Q7.map 和for是否可以break?

保留。

#### Q8.跨域是什么？JsonP 返回的值怎么处理？

保留。

#### Q9.前端路由？

保留。

#### Q10.数据管理？

Redux 、vuex 、rxjs

#### Q11.双向绑定怎么实现的？

define.propertype, proxy ,脏检查机制

#### Q12.前端有哪些安全问题？

csrf 攻击 、 http 

#### Q13.flex布局，参数？主轴如何定义？

保留。

#### Q14.css动画？

transition 、translate 、 animate

