---
layout:     post
title:      "讯联面试"
subtitle:   " \"讯联面试 \""
date:       2019-02-26 12:00:00
author:     "monkey-yu"
header-img: "img/post-flower.png"
catalog: true
tags:
    - 实战面经
---
> 2019年2月26日上午，参加了讯联的面试，现在整理回顾。

### 笔试

笔试题目，一张A4纸正反两面。笔试问题比较基础，这里只回忆题目，不提供答案了。

同源策略、css属性选择器、css3新特性、css伪类、http method 、es6新特性、基本类型转换、js题目考察this指向、js题目考查定时器等。

### 面试

#### 第一轮：

先有2个面试官。自我介绍以及简历提到的前工作经验。

##### 第一个面试官考察angular相关问题，具体如下：

1. Angular 的路由？

angular 内部的库提供routes，angular路由有2个属性：path 和 component。（*这部分再补充学习*）

2. 懒加载模块怎么实现？

将上级路由中想要懒加载的路径改为空，即' ',将上级路由中想要懒加载的`component：xxComponent`替换为`loadChildren:'app/component/xx.module#xxModule'`,在`xxModule`的路由中写原上级路由的参数

```
{
    path:'login',
    component:LoginComponent
}
```

3. 路由守卫？

路由守卫是指当用户满足了某些要求之后才可以离开或者进入某个页面或者场景的时候使用。比如说只有当用户填写了用户名和密码之后才可以进入首页，比如说用户离开某个页面时显示保存信息提示用户是否保存信息后再离开等操作，控制这些要求的就叫路由守卫。

4. 父子组件的传递？

方法一：@Input 、@output

Input属性装饰器，用来实现父组件向子组件传递数据。在子组件的ts文件中加入@Input() 属性名，在父组件的html中加入[属性名]；

Output属性装饰器，实现子组件将信息通过事件的形式通知到父级组件。会用到EventEmitter 用来触发自定义事件。

EventEmitter应用场景：子指令创建一个EventEmitter实例，并将其作为输出属性导出。子指令调用已创建的EventEmitter实例中的emit(payload)方法来触发一个世界，父组件通过事件绑定（eventName）的方式监听该事件，并通过$event对象来获取payload对象。下面实例：

children.conponent.ts

```
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'exe-counter',
    template: `
      <p>当前值: {{ count }}</p>
      <button (click)="increment()"> + </button>
      <button (click)="decrement()"> - </button>
    `
})
export class CounterComponent {
    @Input() count: number = 0;

    @Output() change: EventEmitter<number> = new EventEmitter<number>();

    increment() {
        this.count++;
        this.change.emit(this.count);
    }

    decrement() {
        this.count--;
        this.change.emit(this.count);
    }
}
```

App.component.ts

```
import { Component } from '@angular/core';

@Component({
  selector: 'exe-app',
  template: `
   <p>{{changeMsg}}</p> 
   <exe-counter [count]="initialCount" 
    (change)="countChange($event)"></exe-counter>
  `
})
export class AppComponent {
  initialCount: number = 5;

  changeMsg: string;

  countChange(event: number) {
    this.changeMsg = `子组件change事件已触发，当前值是: ${event}`;
  }
}
```

方法二：写一个公共的service，定义get set方法，来实现父子传值。

5. observable 和promise区别？

- observable可取消，使用unsubscribe，promise不可取消；
- observable可以发射多次，promise只能发射一次；

observer可以再次订阅。promise的状态：resolved ,rejected。

6. rxjs的操作符有哪些？

map、filter 、reduce 、every 等。

7. 有没有实现自定义组件？

实现了一个公共模块。自定义报告那块。使用了ngx-dnd插件。balabala...

8. angular 的生命周期？

ngOninit 、ngOnDocheck、ngAftercheckinit 、ngAfterchecked、ngOnchanges 、ngOndestroy等。

##### 第一个人问题问完了，然后是codepen上写一个**遮罩的效果。**

##### 第二个人开始问，主要依据笔试题目问些问题。具体如下：

1. http 与 https?

多了一层ssl加密…具体没讲，不清楚。

2. 前端的路由组成部分？

协议 、域名、url 、参数、锚点定位。

3. url过程介绍？

纠结于开头是否要讲三次握手，域名解析等问题，后来面试官说主要考察前端部分。

发起请求，获取数据，解析html为DOM 树，解析css 为cssOM 树，合并两个树生成渲染树，同时解析js文件，最后页面渲染。

4. cookie 的安全问题？在console里就可以document.cookie获取怎么办？

添加http-only参数，不允许js访问cookie。

5. es6 let 和const ?

不会变量提升，不会挂载到window上。const定义一个对象，内部可修改等等。

6. get 和post 请求方法的区别？

get请求参数紧跟url后面，post将参数写在body体内。请求数据量大小不同。

#### 第二轮：

前2个面试官 + 1个新面试官。一起问问题，忘记问的啥问题了。还有问近期想学的技术栈，我回答了python,因为自己有个公众号想开发维护，面试官说挺好的…问angular和vue相比较，更想使用哪个？我回答了vue轻量级，上手快，angular较重等。

#### 第三轮：

第2轮中最后那个面试官，不全问技术问题，介绍了公司内部架构之类,3个事业部，技术栈，人员配置等等。其他不记得了。

#### 第四轮：

好像是研发部的老大（前几个貌似是各事业部的leader）,问了自定义控件：日期控件，算法等。

1. 自己实现日期控件？

自己没有思路，请他给提示。他说两方面，一方面是数据获取，将日期与周对应，我说使用getDay()。另一方面是画页面，分为横纵轴。还有更改月份年份等，先提前加载好数据。

2. 写出冒泡排序？

我说不会，最近才开始学习数据结构和接触算法。

3. 页面卡顿，排障？

判断是数据的问题还是页面渲染的问题。数据的问题可以添加缓存，页面渲染优化css等文件。可以使用开发者工具中的performance 来定位哪部分耗时较长从而来优化。