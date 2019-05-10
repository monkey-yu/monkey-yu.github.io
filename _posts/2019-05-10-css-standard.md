---
layout:     post
title:      "CSS 规范"
date:       2019-05-10 09:00:00
author:     "monkey-yu"
header-img: "img/buildings.jpg"
catalog: false
tags:
    - CSS
---

一、命名：

可以用连字符或者下滑线，也可以用驼峰命名形式。.title-my或者.title_my或者.titleMy。

**使用BEM命名方式**: block-name__element-name--modifier-name，也就是模块名 + 元素名 + 修饰器名。

二、属性书写顺序：

1.位置属性（position,top,right,z-index.display,float等）

2.大小属性（width,height,padding,margin）

3.文字系列（font,line-height,letter-spacing等）

4.背景（background,border等）

5.其他（transition等）

三、css属性缩写：

margin,padding,background，font等属性。

四、去掉0和简写：

有些值是0，这时候我们可以省略后面的px单位；

有时候是零点几，这时候我们可以省略这个零；

再简写class名称的时候一定要让其他人看得明白。

五、css文件名命名规则：

主要的 master.css

模块 module.css

基本共用 base.css

布局，版面 layout.css

主题 themes.css

专栏 columns.css

文字 font.css

表单 form.css

> end !

