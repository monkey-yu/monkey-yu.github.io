---
layout:     post
title:      "手写节流throttle和防抖debounce"
date:       2020-08-02 12:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: True
tags:
    - JS
---

> 在开发过程中，我们经常需要绑定一些持续触发的事件。比如：resize、scroll、mousemove等等，但有时候我们并不希望在事件持续触发的过程中特别频繁的去执行函数。

#### 一、防抖debounce

防抖，是指触发事件后在n秒内函数只执行一次，如果在n秒内又触发了事件，则会重新计算函数执行时间。

使用场景：

- 浏览器窗口大小resize避免次数过于频繁
- 登陆，发短信等按钮避免发送多次请求
- 文本编辑器实时保存

防抖重点在于清零: **clearTimeout(timer)**

手写debounce函数：

```javascript
function debounce(func,wait){
  let timer = null;
  return function(...args){
    let context = this;
    if(timer) clearTimeout(timer);
    timer = setTimeout(function(){
      func.apply(context,args)
    },wait)
  }
}
```

```javascript
<div id="content" style="height:150px;line-height:150px;text-align:center; color: #fff;background-color:#ccc;font-size:80px;"></div>
<script>
    let num = 1;
    let content = document.getElementById('content');

    function count() {
        content.innerHTML = num++;
    };
	// 使用debounce函数
    content.onmousemove = debounce(count,1000);
</script>
```

#### 二、节流throttle

节流，是指在一段时间内函数只执行一次。如果这个时间段内多次触发，只有一次生效。

使用场景：

- scroll滚动事件，每隔特定秒执行回调函数
- input输入框，每隔特定时间发送请求（debounce也可以）

节流重点在于： **flag=false**

手写throttle函数：

```javascript
function throttle(fn,delay){
	let flag = true;
  let timer =null;
  return function(...args){
    let context =this;
    if(!flag) return 
    flag = false;
    clearTimeout(timer);
    timer = setTimeout(function(){
      fn.apply(context,args);
      flag = true;
    },delay)
  }
}
```

