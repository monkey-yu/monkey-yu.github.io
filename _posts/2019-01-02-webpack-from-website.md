---
layout:     post
title:      "webpack官网"
subtitle:   " \"webpack官网学习（一） \""
date:       2019-01-02 12:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: true
tags:
    - 技术
    - 工具
---

> webpack官网请戳 [这里](https://www.webpackjs.com/concepts/)
>
> 目前webpack版本是v4.28.3 （2019.01.02）

webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

从 webpack v4.0.0 开始，可以不用引入一个配置文件。然而，webpack 仍然还是[高度可配置的](https://www.webpackjs.com/configuration)。在开始前你需要先理解四个核心概念：

- 入口(entry)
- 输出(output)
- loader
- 插件(plugins)

#### 入口(entry)

入口起点(entry point)指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。

每个依赖项随即被处理，最后输出到称之为 bundles 的文件中。

可以通过在 [webpack 配置](https://www.webpackjs.com/configuration)中配置 entry 属性，来指定一个入口起点（或多个入口起点）。

#### 出口(output)

output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。基本上，整个应用程序结构，都会被编译到你指定的输出路径的文件夹中。

![](/img/post_img/webpack/webpack-code-1.png)

<!--上面的path模块是node.js的一个核心模块，用于操作文件路径。-->

#### loader

loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效[模块](https://www.webpackjs.com/concepts/modules)，然后你就可以利用 webpack 的打包能力，对它们进行处理。

webpack loader 将所有类型的文件，转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。

在更高层面，在 webpack 的配置中 loader 有两个目标：

1. test 属性，用于标识出应该被对应的 loader 进行转换的某个或某些文件。

2. use 属性，表示进行转换时，应该使用哪个 loader。

![](/img/post_img/webpack/webpack-code-2.png)

> “嘿，webpack 编译器，当你碰到「在 require()/import 语句中被解析为 '.txt' 的路径」时，在你对它打包之前，先使用 raw-loader 转换一下。”

<!--在 webpack 配置中定义 loader 时，要定义在 module.rules 中，而不是 rules。-->

#### 插件(plugins)

loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。[插件接口](https://www.webpackjs.com/api/plugins)功能极其强大，可以用来处理各种各样的任务。

想要使用一个插件，你只需要 **require()** 它，然后把它添加到 **plugins** 数组中。多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 **new** 操作符来创建它的一个实例。

![](/img/post_img/webpack/webpack-code-3.png)

#### 模式

通过选择 development 或 production 之中的一个，来设置 **mode** 参数，你可以启用相应模式下的 webpack 内置的优化。

![](/img/post_img/webpack/webpack-code-4.png)



