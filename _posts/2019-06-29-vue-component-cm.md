---
layout:     post
title:      "Vue组件间通信方式"
date:       2019-06-29 16:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: true
tags:
    - Vue
---

> Vue组件间通信，是开发过程中经常需要使用的。

组件是Vue.js最强大的功能之一，而组件实例的作用域是相互独立的。意味着不同组件之间的数据无法互相引用。因此，本文就是介绍组件之间通信的方式。

一般来说，组件有以下几种关系：

![vue-com1](/img/post_img/vue/vue-com1.jpg)

父子关系、兄弟关系、隔代关系。

#### 方法一： props / $emit

父向子传递通过props的方式： 

```javascript
// 父组件
<template>
  <div id="app">
    <users v-bind:users="users"></users>
  </div>
</template>
<script>
  import Users from "./components/Users"
  export default {
    name: 'App',
    data(){
      return{
        users:["Henry","Bucky","Emily"]  // 被传递的值
      }
    },
    components:{
      "users":Users // 子组件name
    }
  }
</script>
```

```javascript
//users子组件
<template>
  <div class="hello">
    <ul>
      <li v-for="user in users">{{user}}</li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'Users',
    props:{							// 在props中
      users:{           //这个就是父组件中子标签自定义名字
        type:Array,
        required:true
      }
    }
  }
</script>
```

**总结：父组件通过props向下传递数据给子组件。注：组件中的数据共有三种形式：data、props、computed**

子向父传递通过$emit：

```javascript
// 子组件
<template>
  <header>
    <h1 @click="changeTitle">{{title}}</h1>//绑定一个点击事件
  </header>
</template>
<script>
export default {
	...
	 methods:{
    changeTitle() {
      this.$emit("titleChanged","子向父组件传值");//自定义事件  传递值“子向父组件传值”
    }
  }
}
</script>
```

```javascript
// 父组件
<template>
  <div id="app">
    <app-header v-on:titleChanged="updateTitle" ></app-header>
		//与子组件titleChanged自定义事件保持一致
   // updateTitle($event)接受传递过来的文字
    <h2>{{title}}</h2>
  </div>
</template>
<script>
  import Header from "./components/Header"
  export default {
		...
		methods:{
      updateTitle(e){   //声明这个函数
        this.title = e;
      }
    }
  }
</script>
```

**总结：子组件通过events给父组件发送消息，实际上就是子组件把自己的数据发送到父组件。**

#### 方法二：`$emit`  和 `$on`

**这种方法通过一个空的Vue实例作为中央事件总线（事件中心），用它来触发事件和监听事件,巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级**。

```javascript
// 实现方式
var Event=new Vue();
Event.$emit(事件名,数据);
Event.$on(事件名,data => {});
```

```javascript
// 例子
<div id="itany">
	<my-a></my-a>
	<my-b></my-b>
	<my-c></my-c>
</div>
<template id="a">
  <div>
    <h3>A组件：{{name}}</h3>
    <button @click="send">将数据发送给C组件</button>
  </div>
</template>
<template id="b">
  <div>
    <h3>B组件：{{age}}</h3>
    <button @click="send">将数组发送给C组件</button>
  </div>
</template>
<template id="c">
  <div>
    <h3>C组件：{{name}}，{{age}}</h3>
  </div>
</template>
<script>
var Event = new Vue();//定义一个空的Vue实例
var A = {
	template: '#a',
	data() {
	  return {
	    name: 'tom'
	  }
	},
	methods: {
	  send() {
	    Event.$emit('data-a', this.name);
	  }
	}
}
var B = {
	template: '#b',
	data() {
	  return {
	    age: 20
	  }
	},
	methods: {
	  send() {
	    Event.$emit('data-b', this.age);
	  }
	}
}
var C = {
	template: '#c',
	data() {
	  return {
	    name: '',
	    age: ""
	  }
	},
	mounted() {//在模板编译完成后执行
	 Event.$on('data-a',name => {
	     this.name = name;//箭头函数内部不会产生新的this，这边如果不用=>,this指代Event
	 })
	 Event.$on('data-b',age => {
	     this.age = age;
	 })
	}
}
var vm = new Vue({
	el: '#itany',
	components: {
	  'my-a': A,
	  'my-b': B,
	  'my-c': C
	}
});	
</script>
```

#### 方法三： Vuex

Vuex是一个状态管理模式，它采用集中式存储管理应用的所有组件的状态。

这个状态管理器主要包含以下几部分：

- **State**,驱动应用的数据源；
- **view**,以声明方式讲state映射到视图；
- **actions**,响应在view上的用户输入导致的状态变化。

![vue-com2](/img/post_img/vue/vue-com2.jpg)

##### 1.简要介绍Vuex原理

Vuex实现了一个单向数据流，在全局拥有一个state存放数据，当组件要更改state中的数据时，必须通过Mutation 进行，Mutation同时提供了订阅者模式供外部插件调用获取state数据的更新。当所有异步操作或批量的同步操作需要走Action,但Action也是无法直接修改state的，还是需要提交 mutation 来修改数据。最后，根据state的变化，渲染到视图上。 

##### 2.介绍各模块在流程中的功能

创建vuex状态管理文件：

```typescript
// ./store/index.ts 文件
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store ({
  state: {
    loginUser: null,
    userInfomation: null
  },
  getters: {},
  mutations: {
     updateLoginUser(state,info){
      store.loginUser = info;
    },
    updateUserInformation(state,info){
      store.userInfomation = info;
    }
  },
  actions: {
    commitUserInfo(context,value){
      context.commit('updateUserInformation',value)
    },
    commitLoginInfo(context,value){
      context.commit('updateLoginUser',value)
    },
  }
})
```

在login 页面登陆后，将登陆信息派发给对应action：

```typescript
// login.ts 
export default class Login extends Vue {
	login(){
		Service.login('api').then(res => {
			// 在事件中触发方法，派发commitLoginInfo 这个action
			this.$store.dispatch('commitLoginInfo',res.data)
		}).catch(err=>{
			...
		})
	}
}
```

```typescript
// 内部页面 需要使用loginUser 
export default class DetailPage extends Vue {
	...
	created(){
		// 读取state 
		let storeData = this.$store.state.loginUser 
	}
	...
}
```

- dispatch：操作行为触发方法，是唯一能执行action的方法。

- actions：**操作行为处理模块,由组件中的$store.dispatch('action 名称', data1)来触发。然后由commit()来触发mutation的调用 , 间接更新 state**。负责处理Vue Components接收到的所有交互行为。包含同步/异步操作，支持多个同名方法，按照注册的顺序依次触发。向后台API请求的操作就在这个模块中进行，包括触发其他action以及提交mutation的操作。该模块提供了Promise的封装，以支持action的链式触发。

- commit：状态改变提交操作方法。对mutation进行提交，是唯一能执行mutation的方法。
- mutations：**状态改变操作方法，由actions中的commit('mutation 名称')来触发**。是Vuex修改state的唯一推荐方法。
- state：页面状态管理容器对象。
- getters：state对象读取方法。图中没有单独列出该模块，应该被包含在了render中，Vue Components通过该方法读取全局state对象。

##### 3. Vuex 与 localStorage

Vuex 是 vue 的状态管理器，存储的数据是响应式的。但是并不会保存起来，刷新之后就回到了初始状态，具体做法应该是**在vuex 里数据改变的时候吧数据拷贝一份保存到localStorage里面，刷新之后，如果localStorage里有保存的数据，取出来再替换store 里的state.**

```javascript
let defaultCity = "上海"
try {   // 用户关闭了本地存储功能，此时在外层加个try...catch
  if (!defaultCity){
    defaultCity = JSON.parse(window.localStorage.getItem('defaultCity'))
  }
}catch(e){}
export default new Vuex.Store({
  state: {
    city: defaultCity
  },
  mutations: {
    changeCity(state, city) {
      state.city = city
      try {
      window.localStorage.setItem('defaultCity', JSON.stringify(state.city));
      // 数据改变的时候把数据拷贝一份保存到localStorage里面
      } catch (e) {}
    }
  }
})

```

这里需要注意的是：由于vuex里，我们保存的状态，都是数组，而localStorage只支持字符串，所以需要用JSON转换：

```javascript
JSON.stringify(state.subscribeList);   // array -> string
JSON.parse(window.localStorage.getItem("subscribeList"));    // string -> array 
```

> end！