---
layout:     post
title:      "2020前端试题详解（三）"
date:       2020-09-07 12:00:00
author:     "monkey-yu"
header-img: "img/mountain.jpg"
catalog: True
tags:
    - 面试
---

#### 10. 如何解决浏览器兼容性问题？

- 据兼容需求选择技术框架/库（jquery）
- 条件注释、css hack、js能力检测做一些修补
- 渐进增强： 针对低版本浏览器进行构建页面，保证最基本的功能。然后再针对高版本浏览器做一些改进或追加效果提升用户体验
- 优雅降级：一开始就做构建完整的功能，然后对低版本浏览器做一些兼容。

#### 11.前端性能优化？

- 减少http请求
- 优化css选择器
- 减少dom 操作
- 使用cdn加速，适当对文件进行缓存
- 合理控制cookie大小
- 尽量减少重绘和重排，尽量使用div 代替table
- css 文件放在顶部，js文件放在底部  

#### 12. 前端的安全性问题？

1. XSS攻击：跨站脚本攻击

   例如：用户在评论框中输入恶意的代码，程序未进行校验直接将用户评论显示在页面上，被其他用户点击后。可能会获取到其他用户的信息，cookie,或者钓鱼网站等。

   解决方式：

   - 对用户的input输入或输出做一个检查。 对<script> 标签进行正则匹配，来将'<' 或'>' 删除或过滤
   - 不允许浏览器获取cookie ，设置 http-only :true。
   - 对表单数据进行值的类型规定等。

2. CSRF攻击： 跨站请求伪造

   通过伪装来自受信任用户的请求来利用受信任的网站。

   防御方式：

   - 通过refer、token或者验证码来检测用户提交
   - 尽量不要在页面的链接中暴露用户的隐私信息
   - 对于用户修改删除等操作最好用post
   - 避免全站通用cookie，严格设置cookie的域

#### 13.前端如何解决跨域问题？

浏览器的同源策略防止javascript发起跨域请求。即协议、域名、端口号有任一不相同，则被称为跨域。此策略可防止页面上的恶意脚本通过该页面的文档对象模型，访问另一个网页上的敏感数据。

解决：

- jsonp 。允许script 加载第三方资源
- 反向代理。
- cors 前后端协作设置请求头部，Access-control-Allow-Origin 等头部信息
- iframe 嵌套通讯，postMessage

#### 14.什么是原型链？

所有的js对象都有prototype属性，该属性可以指向对象的原型。当试图访问一个对象的属性时，如果当前对象上没找到这个属性，会搜索该对象的原型，以及该对象的原型的原型，层层向上搜索，直到找到名字匹配的属性或者到达原型链的末尾。

#### 15.什么是闭包？

如果一个函数的内部访问了外部的变量，就是闭包。

因为闭包引用着另一个函数的变量，导致另一个函数已经不使用了但也无法销毁。所以闭包使用过多，占用较多的内存，会引起内存泄漏。

#### 16. 有一个函数，参数是函数，返回值也是一个函数，返回的函数功能和入参的函数相似，但这个函数只能执行3次，再次执行无效。请实现？

```javascript
function sayHi(){
	console.log('hi');
}
function threeTimes(fn){
	let times = 0;
	return () => {
		if(times ++ < 3){
			fn();
		}
	}
}
const newFn = threeTimes(sayHi);
newFn();  // hi
newFn();  // hi
newFn();  // hi
newFn();  // 无效
```

#### 17.创建对象的四种方式

1. 字面量方式

   ```
   let a = {name: 'admin'};
   ```

2. 工厂模式

   ```javascript
   function factory(){
   	return {
   		name: 'admin'
   	}
   }
   let a = factory();
   ```

3. 构造函数

   ```
   function Fn(){
   	this.name = 'admin'
   }
   let a = new Fn();
   ```

4. class 方式

   ```
   class fn(){
   	constructor(){
   		this.name ='admin'
   	}
   }
   let a = new Fn();
   ```

#### 18.改变this指向的方式有哪些？

bind 、call 、apply、new 、箭头函数

call 和apply 是一样的，都是在调用是生效，改变调用者的this指向。区别是 call的传参是一个个传。apply的传参是一个数组。

bind也是改变this指向，不过不是在调用时生效，而是返回一个新函数。

```javascript
let name = 'jack';
let obj = { name: 'tom'};
function sayHi(){
	console.log('hi ' +  this.name)
}
sayHi();  // hi jack；
sayHi.call(obj);  // hi，tom
sayHi.apply(obj);  // hi，tom
const newFunc = sayHi.bind(obj);
newFunc();      // hi，tom
```

箭头函数： 不对this操作，是外围的指向

new : 指向新创建的这个函数

**如何确定this的指向？**

1. 由new 调用，则绑定到新创建的对象上
2. 由call 或者apply调用，则绑定到指定的对象
3. 由上下文调用，则绑定到那个上下文
4. 默认： 在严格模式下，绑定到undefined 。否则绑定到全局对象。

