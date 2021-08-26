---
layout:     post
title:      "vue题目详解一"
date:       2020-08-31 12:00:00
author:     "monkey-yu"
header-img: "img/whale.jpg"
catalog: True
tags:
    - 面试
---

#### 1. Vue的优点？

轻量级框架：只关注试图层，是一个构建数据的试图集合。大小只有几十kb。

简单易学：国人开发，易于理解和学习。

双向数据绑定：保留了angular的特点，在数据操作方面更简单。

组件化：保留了react的优点。

试图、数据、结构分离。

虚拟dom: 不再使用原生dom操作节点。

#### 2. 父向子组件传递数据？

通过props。

#### 3. 子向父组件传递数据？

$emit方法。

#### 4. v-show和v-if的区别？

v-if： 动态添加或删除dom节点。性能消耗高。适用于只一次，不频繁切换节点的场景。

v-show: 就是该节点的显示或隐藏。适用于频繁切换的场景。

#### 5. 如何让css只在当前组件中起作用？

在该组件引用的style标签中添加 scoped属性。

#### 6. keep-alive的作用是什么？

keep-alive是vue内置的一个组件。可以使包含的组件保留状态，避免重新渲染。比如tab切换时候可用到。

#### 7. 说出几种vue中的指令和用法？

- v-model: 双向数据绑定
- v-for： 遍历数组或对象
- v-on:绑定事件
- v-if / v-show： 显示，隐藏

#### 8. Vue-loader是什么？使用它的用途有哪些？

是vue文件的一个加载器。用来将template转换成html;将sass、less转换成css;将es6、es7转换成js

#### 9. 为什么使用key?

使用key来给每个节点做一个唯一标识，diff算法可以正确使用此标识

#### 10. v-model的作用？

实现双向数据绑定。其实是做了2件事。v-bind绑定一个value属性;v-on指令给当前元素绑定input事件。

#### 11. 双向数据绑定是如何实现的？

是通过数据劫持结合发布订阅模式的方式来实现的。也就是说数据和视图的同步，数据发生核心：Object.defineProperty()。

#### 12. 简述computed和watch的区别？

computed: 当一个属性受到多个属性的影响时用。比如： 购物车商品结算。

watch:当一条数据影响多条数据的时候用。 比如：搜索数据。