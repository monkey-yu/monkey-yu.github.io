---
layout:     post
title:      "手写div拖拽事件"
date:       2020-08-11 12:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: True
tags:
    - JS
---

#### 实现一个可以拖拽的DIV

```html
<!-- html 部分 -->  
<div id="dragBox">拖拽我</div>

<!-- css 部分 -->
<style>
	#dragBox {
		width:100px;
		height:100px;
		background:red;
		position: absolute;
	}
</style>
```

```javascript
<!-- js 部分 -->  
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js"></script>
  <script>
    var dragging = false;
    var position = null;
    dragBox.addEventListener('mousedown',function(e){
      dragging = true;
      position = [e.clientX,e.clientY];
    });
    document.addEventListener('mouseover',function(e){
      if(dragging === false) return null;
      const x = e.clientX;
      const y = e.clientY;
      const deltaX = x -position[0];
      const deltaY = y - position[1];
      const left = parseInt(dragBox.style.left || 0);
      const top = parseInt(dragBox.style.top || 0);
      dragBox.style.left = left + deltaX + 'px';
      dragBox.style.top = left + deltaY + 'px';
      position = [x,y];
    })
    document.addEventListener('mouseup',function(e){
      dragging = false;
    })
  </script>
```

知识点：

1. mousedown()鼠标按下事件；mouseover()鼠标移动事件；mouseup()鼠标放开事件
2. clienx是鼠标指针在当前窗口下的水平坐标
3. deltaX 是鼠标移动后的位置 - 最初位置。即位移距离
4. 将计算出的水平、垂直位移距离，加入到元素的样式上left 和top。 记得css 中要定义position才可以移动。