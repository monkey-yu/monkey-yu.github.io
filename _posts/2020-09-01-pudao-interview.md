---
layout:     post
title:      "普道科技"
date:       2020-09-01 12:00:00
author:     "monkey-yu"
header-img: "img/babousan.jpg"
catalog: True
tags:
    - 实战面经
---

#### 1. 手写深拷贝方法

`string`，`number`等这些值类型不存在深拷贝浅拷贝问题。只是针对`object`, `Array`这些复杂对象类型处理深拷贝。

下面是手写一个深拷贝方法：

```javascript
function deepClone(obj){
	let objClone = Array.isArray(obj) ? [] : {};
	if(obj && typeof obj === 'object') {
		for(key in obj){
			if(obj[key] && typeof obj[key] === 'object'){
				objClone[key] = deepClone(obj[key]);
			}else {
				objClone[key] = obj[key];
			}
		}
	}
   return objClone;
}
```

另一个方法是：

JSON.stringfy() : 将一个对象或数组转换为一个JSON字符串；

JSON.parse(): 将JSON字符串解析成字符串描述的对象或数组。

```javascript
function jsonClone(obj){
	return JSON.parse(JSON.Stringfy(obj));
}
```

#### 2. 数组去重能想到哪几种方法？

例： 

```javascript
let arr1 = ['a','b',null,'a',1,null];
```

1. ES6 中set方法

   ```javascript
   function unique(arr){
   	return Array.from(new Set(arr));
   }
   ```

2. indexOf方法

   ```javascript
   function unique(arr){
     let res = [];
     for(let i=0;i<arr.length;i++){
       if(res.indexOf(arr[i]) === -1){
         res.push(arr[i]);
       }
     }
     return res;
   }
   ```

3. Filter 方法

   ```javascript
   function unique(arr){
     return Array.filter(function(item,index,arr){
       return arr.indexOf(item) === index ;
     })
   }
   ```

#### 3. vue的生命周期

1. **beforeCreate**: 此时组件的选项对象还未创建，el 和data 并未初始化，因此无法访问methods, data,computed等属性和数据。
2. **created**:实例已完成以下配置：数据观测、属性和方法的运算、watch\event事件回调、完成data数据的初始化。el并没有。$el 属性目前不可见。
3. **beforeMount**: 挂载开始前被调用。虚拟dom生成。实例完成以下配置：编译模版，把data数据和模版生成html,完成了el 和data初始化。此时还没有挂载html到页面上。
4. **mounted**: 挂载完成。可以获取到真实的dom节点
5. **beforeUpdate**
6. **Updated**
7. **beforeDestroy**
8. **Destroyed**

#### 4.Vue的路由导航

Vue-router提供的导航守卫主要用来通过跳转或取消的方式守卫导航。有3种导航守卫：全局导航守卫、单个路由独享的、组件级的。

参数或查询的改变并不会触发进入/离开的导航守卫。

一、全局导航守卫

1. 全局前置守卫：
   可以使用 `router.beforeEach`注册一个全局前置守卫：

   ```javascript
   const router = new VueRouter({...});
   router.beforeEach((to,from,next) => {
   	// ...
   })
   ```

   每个守卫方法接收3个参数：

   - to: route 即将要进入的目标 路由对象
   - from: route 当前导航正要离开的路由
   - next : function 一定要调用该方法来resolve这个钩子。执行效果依赖next方法的调用参数。
     - next():进行管道中的下一个钩子。如果钩子全部执行完毕，则导航的状态是confirmed
     - next(false) : 中断当前的导航。如果浏览器的url改变了，那么url地址会重置到from路由对应的地址
     - next('/') 或者next({path:'/'}): 跳转到一个不同的地址。当前导航被中断，然后进行下一个新的导航。
     - next(error): 导航会被终止且该错误会被传递给router.onError()注册过的回调。

   ```typescript
   router.beforeEach((to,from,next) => {
     if(to.name !== 'Login' && !isAuthenticated) next ({name: 'Login'})
     else next()
   })
   ```

2. 全局后置钩子

   这些钩子不会接受next函数也不会改变导航本身：

   ```typescript
   router.afterEach((to,from) => {
   	// ...
   })
   ```

二、 路由独享的守卫

可以在路由配置上直接定义beforeEnter守卫

```typescript
const router = new VueRouter({
	rouers: [
		{
      path:'/foo',
      component: Foo,
      beforeEnter:(to,from,next) => {
				//...
      }
		}
	]
})
```

三、组件内的守卫

可以在路由组件内直接定义以下路由导航守卫：

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`

```typescript
const Foo ={
  template: `...`,
  beforeRouteEnter (to,from,next){
    //在渲染该组件的对应路由被confirm前调用
    // 不能获取组件实例 this
    // 因为当守卫执行前，组件实例嗨没被创建
  },
  beforeRouteUpdate(to,from,next){
    //在当前路由改变，但是该组件被复用是调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    this.name = to.params.name
  	next()
  },
  beforeRouteLeave(to,from,next){
    // 导航离开该组件的对应路由时调用
    //可以访问组件实例 this
    const answer = window.confirm('do you really want to leave?');
    if(answer){
      next()
    }else {
      next(false)
    }
  }
}
```

##### 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

#### 5.vue-router 的两种模式

- hash 模式
- history模式

##### hash模式：

即地址栏url中的#符号

该模式的原理是onhashchange事件，可以通过window对象来监听该事件。

hash也称做锚点，本身就是用来做页面定位的，他可以使对应id的元素显示在可视区域内。

hash虽然出现在url中，单不会被包括在http请求中，对后端完全没有影响，因此改变hash不会重新加载页面。

hash值的变化，不会向服务器发送请求。浏览器的进后退也能对其进行控制。

##### history模式：

利用了HTML5 History interface 中新增的pushState() 和 replaceState()方法。

history模式改变url的方式会导致浏览器向服务器发送强求。这不是我们想要的，因此我们需要在服务端做处理：如果匹配不到任何静态资源文件，则应该始终返回同一个html 页面。

#### 6.虚拟dom是什么？

一颗真实的dom树的渲染需要先解析css样式和dom树，然后将其整合成一颗渲染树，通过布局算法去计算每个节点在浏览器中的位置，进而输出到显示屏上。

虚拟DOM可以理解为DOM树被渲染前所包含的所有信息，这些信息通过对象的形式保存在内存中，并通过j s来进行维护。

**Vue通过建立一个虚拟DOM树对真实DOM发生的变化保持追踪。**

######  (1) 当数据发生变化，vue是怎么更新节点的？

渲染真实DOM的开销是很大的。有时修改某个数据，如果直接渲染到真实dom会引起整个dom树的重绘和重排。利用虚拟DOM 和diff算法来只局部更新，从而减小开销。

根据真实DOM生成一颗虚拟DOM。当虚拟dom某个节点的数据改变会生成一个新的Vnode,然后Vnode和oldVno de作对比，发现不一样的地方就直接修改在真实DOM上，并将oldVnode的值为Vnode。

diff的过程就是调用名为patch的函数，比较新旧节点，一边比较一边给真实DOM打补丁。

######  (2) VDOM 和DOM的区别？

dom是这样：

```html
<div>
	<p>123</p>
</div>
```

对应的Vdom：

```javascript
var Vnode = {
  tag: 'div',
  children: {
    tag: 'p',
    text: '123'
  }
}
```

###### 	(3)  diff的比较方式？

diff算法进行新旧节点比较的时候，比较只会在同层级进行，不会跨层比较。

#### 7.v-model的实现？

```html
<input v-model="sth" />
// 相当于
<input :value="sth" @input="sth = $event.target.value"/>
```

