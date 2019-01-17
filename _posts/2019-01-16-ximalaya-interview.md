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