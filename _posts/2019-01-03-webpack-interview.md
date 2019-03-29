---
layout:     post
title:      "webpack面试总结"
date:       2019-01-03 12:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: true
tags:
    - 工具
---
> webpack面试总结篇

本文主要是对webpack面试会常被问到的问题做一些总结。

##### 1.webpack打包原理？

把所有依赖打包成一个bundle.js文件，通过代码分割成单元片段并按需加载。

##### 2.webpack优势？

（1）**高适配性**：webpack是以commonJS的形式来书写脚本的，但对AMD/CMD的支持也很全面，方便旧项目代码迁移。

（2）丰富的loaders。webpack可以打包任何静态文件。

（3）开发便捷，能替代部分grunt.gulp的工作，比如打包，压缩混淆，图片转base64。

（4）插件化。扩展性强。

##### 3.什么是loader,什么是plugin?

loader用于加载某些资源文件，对css,img等资源进行转化，从而加载。webpack本身是只能打包规范的js文件的。

plugin用于扩展webpack的功能。不同于loader, plugin的功能更加丰富，比如压缩打包，优化等。

##### 4.什么是bundle, chunk，module?

bundle : 由webpack打包出来的文件；

chunk : 指webpack在进行模块依赖分析时候，代码分割出来的片段；

module : 开发中的单个模块。

##### 5.webpack 和gulp 的区别？

webpack是一个模块打包器，强调的是一个前端模块化方案，更侧重模块打包，我们可以把开发中的所有资源都看成是模块，通过loader和plugin对资源进行处理。

gulp是一个前端自动化构建工具，强调的是前端开发的工作流程，可以通过配置一系列的task，定义task处理的事情（如代码压缩，合并，编译以及浏览器实时更新等）。然后定义这些执行顺序，来让glup执行这些task，从而构建项目的整个开发流程。自动化构建工具并不能把所有的模块打包到一起，也不能构建不同模块之间的依赖关系。

##### 6.如何自动生成webpack配置文件？

Webpack-cli/Vue-vli

##### 7.什么是模热更新？有什么优点？

模块热更新是webpack的一个功能，它可以使得代码修改之后，不用刷新浏览器就可以更新。在应用过程中替换添加删出模块，无需重新加载整个页面，是高级版的自动刷新浏览器。

优点：只更新变更内容，以节省宝贵的开发时间。调整样式更加快速，几乎相当于在浏览器中更改样式。

##### 8.webpack-dev-server 和 http服务器的区别？

webpack-dev-server使用内存来存储webpack开发环境下的打包文件，并且可以使用模块热更新，比传统的http服务对开发更加有效。

##### 9.什么是长缓存？在webpack中如何做到长缓存优化？

浏览器在用户访问页面的时候，为了加快加载速度，会对用户访问的静态资源进行存储，但是每一次代码升级或者更新，都需要浏览器去下载新的代码，最方便和最简单的更新方式就是引入新的文件名称。

在webpack中，可以在output给出输出的文件制定chunkhash，并且分离经常更新的代码和框架代码，通过NameModulesPlugin或者HashedModulesPlugin使再次打包文件名不变。

##### 10.什么是Tree-sharking?

tree-sharking 是指在打包中去除那些引入了，但是在代码中没有被用到的那些死代码。

##### 11.举例一些webpack 插件？

![webpack-plugin](/img/post_img/webpack/webpack-plugin.png)