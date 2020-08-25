---
layout:     post
title:      "2020前端试题详解（一）"
date:       2020-08-20 12:00:00
author:     "monkey-yu"
header-img: "img/mountain.jpg"
catalog: True
tags:
    - 面试
---

#### 1.什么是BFC、IFC、GFC、FFC?

BFC: 块级格式上下文。是web页面的可视c s s渲染的一部分，是块盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

触发BFC的方式：

- 跟元素 （html 、body）
- 浮动元素（ float不为none的）
- 绝对定位元素 （position为absolue 或fixed）
- 行内块元素（display为inline-block）
- 表格单元格 （display为tabel-cell）
- Overflow 不为visibility的块元素 （auto 、scroll 、hidden）
- 弹性元素（display为flex的）

BFC的特性及应用：

- 同一个BFC下外边距折叠
- 可以清除浮动

IFC: 行内格式上下文。display为inline 

GFC:网格格式上下文。display:grid

FFC:自适应格式上下文。 display： flex

#### 2.div水平垂直居中的方法

1. 方法一：

   ```css
   div {
     position:absolute;
     top:50%;
     left:50%;
     transform:translate(-50%,-50%)
   }
   ```

2. 方法二：需要知道div的宽高

   ```css
   div {
     width:600px;
     height:600px;
     position:absolute;
     top:50%;
     left:50%;
     margin-left:-300px;
     margin-top:-300px
   }
   ```

3. 方法三：不需要知道div的宽高

   ```css
   div{
     position:absolute;
     top:0;
     left:0;
     right:0;
     bottom:0;
     margin:auto;
   }
   ```

4. 方法四：在父元素上设置弹性布局方式

   ```css
   .box {
     display:flex;
     align-items:center;
     justify-content:center;
   }
   .box div{
     width:100px;
     height:100px;
   }
   ```

5. 方法五：文字或行内元素

   ```css
   div {
     display:table-cell;
     vertical-align: middle;
     text-align:center;
     .child {
       display:inline-block
     }
   }
   ```

6. 方法六：calc 函数方式

#### 3.display、visbility、opacity的区别

|                  | 文档占位 | trasition过度效果                 | 继承             | 事件监听     | 性能                   |
| ---------------- | -------- | --------------------------------- | ---------------- | ------------ | ---------------------- |
| Display:none     | 否       | 无                                | 不会被子元素继承 | 无法进行监听 | 会引起重排，性能较差   |
| visiblity:hidden | 是       | visiblity会立即显示，hidden会延时 | 会被继承         | 无法进行监听 | 引起重绘，性能较高     |
| opacity:0        | 是       | 延时显示和隐藏                    | 会被继承         | 可以进行监听 | 不会触发重绘，性能较高 |

#### 4.不改变以下这行代码，使这种图片宽度为300px?

```css
<img src="1.png" style="width:480px!important"/>
```

1. css方法：

```css
<img src="1.png" style="width:480px!important；max-width：300px"/>
<img src="1.png" style="width:480px!important; transform:scale(0.625,1)"/>
<img src="1.png" style="width:480px!important; width:300px!important"/>
```

2.js方法：

```javascript
document.getElementsByTagName("img")[0].setAttribute("style","width:300px!important")
```

#### 5.解决移动端retina屏幕1px的边距问题

在css中设置1px,则在移动设备屏幕上实际为2px。现在需要让在移动设备上屏幕为1px。

window.devicePixelRatio = 2,即为2倍

- 方法一：0.5px的边框

  ```css
  div {
  	border:1px solid #000;
  }
  div .hairline{
   border-width:0.5px;
  }
  ```

- 方法二：使用border-image实现

  ```css
  .border-bottom-1px{
  	border-width:0,0,1px,0;
  	border-image:url(linenew.png) 0 0 2 0 stretch;
  }
  ```

- 方法三：使用box-shadow实现

  ```css
  .box-shadow-1px {
  	box-shadow: inset 0px -1px 1px -1px #666;
  }
  ```