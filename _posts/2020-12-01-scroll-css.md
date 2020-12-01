---
layout:     post
title:      "css设置滚动条样式"
date:       2020-12-01 12:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: true
tags:
    - CSS
---

> 虽然大部分情况下不会关注到滚动条的样式，但是有些网站优化会对滚动条样式有要求。可以用css来设置滚动条样式。下面整理了css滚动条的几个属性。

#### 1. webkit下css设置滚动条

主要有下面几个属性：

```css
::-webkit-scrollbar  // 滚动条整体，可以设置宽度等①
::-webkit-scrollbar-button // 滚动条两端的按钮②
::-webkit-scrollbar-track // 外层轨道③
::-webkit-scrollbar-track-piece // 内层滚动槽④
::-webkit-scrollbar-thumb // 滚动的滑块⑤
::-webkit-scrollbar-corner // 边角⑥
::-webkit-resizer // 下角拖动块的样式⑦
```

![scroll-1](/img/post_img/css/scroll-1.png)

还有更详尽的一些属性：

`:horizontal` 水平方向的滚动条

`:vertical` 垂直 方向的滚动条

`:decrement` 应用于按钮和内层轨道(track piece)。它用来指示按钮或者内层轨道是否会减小视窗的位置(比如，垂直滚动条的上面，水平滚动条的左边。)

`:increment` decrement 类似，用来指示按钮或内层轨道是否会增大视窗的位置(比如，垂直滚动条的下面和水平滚动条的右边。)

`:start` 伪类也应用于按钮和滑块。它用来定义对象是否放到滑块的前面。

`:end` 类似于 start 伪类，标识对象是否放到滑块的后面。

`:double-button` 该伪类以用于按钮和内层轨道。用于判断一个按钮是不是放在滚动条同一端的一对按钮中的一个。对于内层轨道来说，它表示内层轨道是否紧靠一对按钮。

`:single-button` 类似于 double-button 伪类。对按钮来说，它用于判断一个按钮是否自己独立的在滚动条的一段。对内层轨道来说，它表示内层轨道是否紧靠一个 single-button 。

`:no-button` 用于内层轨道，表示内层轨道是否要滚动到滚动条的终端，比如，滚动条两端没有按钮的时候。

`:corner-present` 用于所有滚动条轨道，指示滚动条圆角是否显示。

`:window-inactive `用于所有的滚动条轨道，指示应用滚动条的某个页面容器(元素)是否当前被激活。

实例：

```css
/* 设置滚动条的样式 */
::-webkit-scrollbar {
    width: 12px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(255, 0, 0, 0.4);
}
```

#### 2. IE下的css设置滚动条

自定义项目比较少，基本都是颜色的设置。

```css
.scrollbar {
    scrollbar-arrow-color: red; /*三角箭头的颜色*/
    scrollbar-face-color: red; /*立体滚动条的颜色（包括箭头部分的背景色）*/
    scrollbar-3dlight-color: red; /*立体滚动条亮边的颜色*/
    scrollbar-highlight-color: red; /*滚动条的高亮颜色（左阴影？）*/
    scrollbar-shadow-color: red; /*立体滚动条阴影的颜色*/
    scrollbar-darkshadow-color: red; /*立体滚动条外阴影的颜色*/
    scrollbar-track-color: red; /*立体滚动条背景颜色*/
    scrollbar-base-color: red; /*滚动条的基色*/
}
```

#### 3. 取消/隐藏滚动条

firefox浏览器：

```
scrollbar-width: none;
```

IE浏览器：

```
-ms-overflow-style: none;
```

chrome和 safari 浏览器：

```
::-webkit-scrollbar {
	display: none;
}
```

当需要隐藏水平滚动条，同时允许垂直滚动条：

```
.scrollbar {
	scrollbar-width: none;  /* firefox */
	-ms-overflow-style: none; /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
}
```

