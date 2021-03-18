---
layout:     post
title:      "websocket通信"
date:       2021-03-04 18:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: true
tags:
    - JS
---

​	最近在做的项目中与websocket打交道，并且同时与2个服务端连接。

#### 第一个websocket连接：

1. 安装 VueNativeSock

   ```
   yarn add vue-native-websocket
   or
   npm install vue-native-websocket --save
   ```

2. 建立连接

   在main.js 中

   ```js
   import VueNativeSock from 'vue-native-websocket';
   
   // 在外面的配置文件中，将需连接的地址挂在window下面configUrlToUE属性上
   const socketUrl = window.configUrlToUE;        
   
   Vue.use(VueNativeSock, socketUrl, {
     reconnection: true, // (Boolean) whether to reconnect automatically (false)
     reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
     reconnectionDelay: 3000,
   });
   ```

3. 在vue.js 实例中的用法

   ```js
   var vm = new Vue({
       methods:{
            clickButton: function(val) {
           // $socket is [WebSocket]
           this.$socket.send('some data')
           // or with {format: 'json'} enabled
           this.$socket.sendObj({awesome: 'data'})
       } 
   })
   ```

4. 创建websocket事件监听器

   ```js
   this.$options.sockets.onmessage = (data) => console.log(data)
   ```

当我想创建第二个连接地址不一样的websocket的时候，上面的方法不能重复。

#### 第二个websocket连接:

1. 创建一个全局的websocket

   新建global.js

   ```js
   export default {
     ws: {},
     setWs (newWs) {
       this.ws = newWs;
     },
   };
   ```

   在main.js中引入

   ```
   import global from './global';
   
   Vue.prototype.$global = global;
   ```

   在App.vue中使用$global 并创建

   ```js
   export default {
     name: 'App',
     methods: {
       localSocket () {
         const that = this;
         if ('WebSocket' in window) {
           that.ws = new WebSocket(window.configUrl);
           that.$global.setWs(that.ws);
         } else {
           // 浏览器不支持 WebSocket
           console.log('您的浏览器不支持 WebSocket!');
         }
       },
     },
     created () {
       this.localSocket();
     },
   };
   ```

2. 建立连接，写发送和接收的方法

   在Home.vue中

   ```
    methods: {
       // 向硬件发送信息
       toSendSocketFromHome (data) {
         const that = this;
         if (that.$global.ws && that.$global.ws.readyState === 1) {
           that.$global.ws.send(JSON.stringify(data));
           console.log('发送给硬件：', JSON.stringify(data));
         }
         that.$global.ws.onmessage = function (res) {
           console.log('收到服务器内容home', res.data);
         };
       },
     },
   ```

   在其子页面中调用该方法

   ```javascript
    	toAllReset () {
         const res = { allReset: true };
         this.$parent.toSendSocketFromHome(res);
       },
   ```

    上面整理了在项目中使用两个websocket的知识点。供以后回顾复习。