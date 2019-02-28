---
layout:     post
title:      "pwc面试"
date:       2019-02-21 12:00:00
author:     "monkey-yu"
header-img: "img/post-bg-mac.jpg"
catalog: true
tags:
    - 实战面经
---
> 2019年2月21日上午，参加了pwc(普华永道)的面试。几乎全部考察了angular2+知识点，现在整理回顾。

#### Q1.ng1和ng2脏检查的区别？

##### angular1中的脏值检测：

1. 首先，在指令ng-model和ng-bind内部绑定了多个watcher(监视器)；
2. 接下来，当指定的事件发生后，angular循环遍历所有的监视器，并执行对应scope上下文的表达式。这里就是digest循环；
3. 最后，比对两次结果，如果不同就调用回调函数。

但这种发生特定事件会调用digest循环有缺点。比如回调函数有setTimeout定时器，定时器把绑定到scope上的属性给修改了，那么angular就无法察觉对象的改变了。ng2解决了这个问题。

##### agular2更优的脏检查：

1. zone.js库。zone.js是angular2的一个库，可以在js实现各种分区，分区代表一个执行上下文。ng2利用zone.js来拦截浏览器中的各种异步事件，然后在正确的时间调用digest循环，完全消除了需要开发者显示调用digest循环的情况。
2. 单向数据流。上述ng1中在ng-model指令下发生改变，也会通知双大括号表达式改变值，这隐含了指令之间互相影响、有依赖关系。跨监视器的依赖会创建出各种纠缠不清的数据流，导致很难追踪。因此ng2强制使用了单向数据流。

**实现的方式：**

禁止不同监视器的互相依赖，digest循环只运行一次就好。单向数据流也让性能提高了。

3. 增强ng1的脏值检测。

   我们说到digest循环有比较的步骤，比较操作的最佳算法是根据表达式返回值的类型进行比较。angular1有的是浅比较，有的是深比较，而且开发者并不能自己预先决定使用哪种比较。angular2团队把比较功能分离到了differ(差异比较器)中，那么开发者就可以通过2个基础类扩展自定义算法了，从而有了对脏值检测机制的完全控制。

   ●KeyValueDiffer。键值对型差异比较器。

   ●IterableDiffer。迭代型差异比较器。

##### 补充AngularJS1.x 与Angular2的主要区别：

|                   | AngularJS1.x                                                 | Angular2                                                     |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 编程语言          | Javascript,可以直接在浏览器中运行代码                        | TypeScript,必须经过编译后才能在浏览器运行，所以需要使用构建工具 |
| 作用域Scope       | 作用域链（相当于试图模型）                                   | 无                                                           |
| 控制器Controller  | 非常重要，用于封装视图控制逻辑甚至业务逻辑                   | 无，组件化开发                                               |
| 脏值检测          | $digest机制，多次检查整个作用域链                            | 采用zone.js库，取消主动脏值检查                              |
| 指令              | 指令数量较多，指令与组件区别较少                             | 指令数量少，但指令更强大了；指令与组件区别明显，指令有的使用*符号，如\*nfGor、\*ngIf |
| 组件              | 通过组件定义对象CDO进行组件定义                              | 通过装饰器元数据和组件类进行定义，组件呈现和控制页面上的一块区域；大量直接使用组件构建应用页面 |
| 过滤器            | filter                                                       | 名字改为pipe,增加async、slice、percent去掉filter、limit、orderby .Angular2认为筛选/分页/排序属于视图控制逻辑/业务逻辑 |
| 绑定              | 通过大量指令和模板插值实现，单向绑定双向绑定区别不明显       | （）从视图到数据方向，指事件；[]从数据到视图方向；[()]双向绑定；{{}}模板插值。严格区分两种单向绑定，区分单向和双向绑定 |
| 父子组件/指令传值 | 作用域链继承；广播/发射事件；属性传值；服务共享              | 订阅事件；属性传值；服务共享                                 |
| 服务              | 按照angular规定好的方式定义服务，服务属于模块级，定义时自动注册到模块中 | 普通类，需要在模块或组件级别的providers元数据中声明          |
| 模块              | 分为根模块和特性模块                                         | 官方模块、第三方模块、自定义模块                             |
| 路由              | 内置的路由机制不支持嵌套，通常复杂点的页面需要第三方路由ui-router | 支持平级多路由，支持基于组件的多级嵌套路由，支持路由守卫     |
| 元数据            | 无明显概念                                                   | 有明确的基于装饰器的元数据概念                               |
| 组件生命周期      | 无明显生命周期机制                                           | 有明确的精心设计生命周期，如：OnInit、OnDoCheck、AfterContentInit、AfterContentChecked、AfterViewInit、AfterViewChecked、Onchanges 、OnDestroy |
| 依赖注入          | 基于名字（字符串）的注入                                     | 基于类（要利用强类型机制）的注入                             |

使用Angular2的原因：使用Typescript语言提高开发效率。Typescript是强类型的所以开发工具可以提供更强大的错误检查机制、代码重构机制，开发体验更好。

#### Q2.angular2的指令用过哪些？带\*和不带\*指令有什么区别？

Angular2 指令主要用来对模板的标签或者元素附加一些新的特性或功能，改变一个DOM元素的外观或行为。

Angular2指令分为两种：

- 属性型指令：用于改变组件的外观或行为。Angular2内置有：ngModel 、ngStyle 、ngClass。

- 结构型指令：用于动态添加或删除DOM元素来改变DOM布局。Angular2内置有：\*ngIf 、\*ngFor 、、*ngSwitch 、\*ngSwitchCase等。

  由上可以看出，结构指令是以\*作为前缀。这个\*是一个语法糖。用于避免使用复杂的语法。

#### Q3.创建一个自定义结构指令？

步骤：

- 引入Directive装饰器
- 添加一个css的属性选择器（在括号内），用于标识我们的指令；
- 把装饰器应用到我们实现的类上

#### Q4.promise和observable区别？

promise代码如下：

```
let promise = new Promise((resolve) =>{
    setTimeout(()=>{
        resolve('chen')
    },2000)
});
promise.then((value)=>{
    console.log(value)
})
```

observable代码如下：

```
let start=new Observable((observer) =>{
    let timeOut = setTimeout(()=>{
        observer.next('chen2')
    },4000)
})
let str=start.subscribe((value)=>{
    console.log(value)
})
```

##### 区别一：observable可以取消subscribe,promise不可以。使用unsubscribe()

```
setTimeout(()=>{
    str.unsubscribe();
},1000)
```

##### 区别二：observable可以发射多次，promise只能发射一次

```
let setTime2;
    let start2 = new Observable( (observable) => {
      let count = 0;
      setTime2 = setInterval( () => {
        observable.next(count++);
      },1000)
    })
    let str2 = start2.subscribe( (num) => {
        console.log(num);
        if(num > 10){
          str2.unsubscribe();
          clearInterval(setTime2);
        } 
    })

```

##### 区别三： rxjs 自带了许多的工具函数，如filter等

##### 区别四：Observer对象 包含三个参数：next、error、complete；Promise参数 resolved、rejected

##### 补充：[obserbable学习链接](https://segmentfault.com/a/1190000008809168#articleHeader28)

#### Q5.rxjs是什么？用过什么？

RxJS是一个库，它通过使用observable序列来编写异步和基于事件的程序。它提供一个核心类型Observable,附带类型（Observer、Schedulers、Subjects）和一些操作符（map、filter、reduce、every等等），这些数组操作符可以把异步事件作为集合处理。

#### Q6.ES6知道哪些？用过哪些？从中挑一些问问题。

1. let,const 不会提升变量，不会挂载到window上。var会提升变量。const 是常量，一旦定义就不会改变。但如果const 一个对象，内容是可以改变的，地址问题。
2. promise。
3. generator。可以控制和恢复代码的执行。关键字yield,next()。
4. 进而提到async await ，是generator函数的语法糖。
5. class 类的继承 extends.

#### Q7.interface 接口是什么？和抽象类的区别？

含有abstract 修饰符的class即为抽象类，abstract 类不能创建实例对象。抽象类中的方法不必是抽象的。

接口interface是抽象类的一种特例，接口中的所有方法都必须是抽象的。接口中的方法定义默认为public anstract类型。

##### 两者区别：

1. 抽象类可以有构造方法，接口中不能有构造方法
2. 抽象类中有普通成员变量，接口中没有
3. 抽象类中可以包含非抽象的普通方法，接口中所有方法必须都是抽象的，不能有非抽象的普通方法
4. 抽象类中的抽象方法的访问类型可以是public 、proteced,接口中只能是public
5. 抽象类中可以包含静态方法，接口不能
6. 一个类可以实现多个接口，但只能继承一个抽象类。

#### Q8.用过angular的什么管道（pipe）？如何自定义管道？

管道是将数据作为输入，然后按照规则将其转换并输出。Angular2中内置的pipe有：DatePipe 、UpperCasePipe 、CurrencyPipe、PercentPipe等。

##### 管道自定义：

```
import {PipeTransform,Pipe} from '@angular/core';
/*
	users:Array<any> =[
        {name:'1',id:1},
        {name:'2',id:2},
        {name:'3',id:3},
        {name:'4',id:4},
	];
*/
@Pipe({name:'filterUser'})
export class FilterUserPipe implement PipeTransform{
    transform(allUsers:Array<any>,...args:any[]):any{
        return allUser.filter(user => user.id >2);
    }
}
```

上述代码所示：

- 需要使用@Pipe来装饰类
- 实现PipeTransform的transform方法，该方法接收一个输入值和一些可选参数
- 在@Pipe中指定管道名字，在模版中使用
- 当定义完成后，不要忘记在Module的declarations数组中包含这个管道

#### Q9.Angular2 中的service?

在Angular中，我们所说的服务是指哪些能够被其他组件或指令调用的**单一的、可共享的**代码块。服务能够使我们提高代码的利用率，方便组件之间共享数据和方法，方便测试和维护。

#### Q10.css3中的flex布局？一个子元素如何实现上下左右都居中？

父元素display:flex；align-item:center;justify-content：center。

#### Q11.css3中的动画，animation？

基于@keyframes，通过百分比来规定发生改变的时间。

