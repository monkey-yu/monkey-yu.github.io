---
layout:     post
title:      "Vue组件间通信方式"
date:       2019-06-29 16:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: false
tags:
    - Vue
---

> Vue组件间通信，是开发过程中经常需要使用的。

组件是Vue.js最强大的功能之一，而组件实例的作用域是相互独立的。意味着不同组件之间的数据无法互相引用。因此，本文就是介绍组件之间通信的方式。

一般来说，组件有以下几种关系：

![vue-com1](/img/post_img/vue/vue-com1.jpg)

父子关系、兄弟关系、隔代关系。

#### props / $emit

父向子传递通过props的方式： 

```javascript
// 父组件
<template>
  <div id="app">
    <users v-bind:users="users"></users>//前者自定义名称便于子组件调用，后者要传递数据名
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

#### `$emit`  和 `$on`

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

