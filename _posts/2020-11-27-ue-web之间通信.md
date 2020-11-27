---
layout:     post
title:      "ue4与WebUI引擎之间的通信"
date:       2020-11-27 12:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: true
tags:
    - JS
---

> 目前的项目是使用UE做引擎，将前端UI 叠加上去，这样不可避免需要web与UE通信。下面介绍webUI与引擎之间的通信方式。

1. H5页面事件监听

   ```javascriptj
   "object"!=typeof ue||"object"!=typeof ue.interface?("object"!=typeof ue&&(ue={}),ue.interface={},ue.interface.broadcast=function(e,t){if("string"==typeof e){var o=[e,""];void 0!==t&&(o[1]=t);var n=encodeURIComponent(JSON.stringify(o));"object"==typeof history&&"function"==typeof history.pushState?(history.pushState({},"","#"+n),history.pushState({},"","#"+encodeURIComponent("[]"))):(document.location.hash=n,document.location.hash=encodeURIComponent("[]"))}}):function(e){ue.interface={},ue.interface.broadcast=function(t,o){"string"==typeof t&&(void 0!==o?e.broadcast(t,JSON.stringify(o)):e.broadcast(t,""))}}(ue.interface),(window.ue4=ue.interface.broadcast);
   window.ue = ue;
   ```

   ​	当你的项目是vue 项目时，可以把上面代码放在index.html下面，script标签中。上面代码中已	经把ue挂在window下面。后面就可以使用了。

2.  接收来自ue的信息

   ```js
   ue.interface.print = function(data){
       console.log('接收数据'，data)
   }
   ```

3. web向ue发送事件

   ```javascript
   ue4("setTime",'06:00');
   ```

   这样就执行了引擎定义的事件setTimes并且传递参数为'06:00'.

------

我只是个前端，ue引擎完全不懂。我只是个代码搬运工。