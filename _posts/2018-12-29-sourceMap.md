---
layout:     post
title:      "Source Map"
subtitle:   " \"Source Map in Webpack \""
date:       2018-12-29 16:00:00
author:     "monkey-yu"
header-img: "img/post-bg-2015.jpg"
catalog: true
tags:
    - 技术
    - 工具
---

> source map in webpack

### 什么是 Source Map

在现今的前端开发过程中，无论是开发环境或是生产环境，运行在浏览器（甚至 Node.js）中的代码（JavaScript, CSS, Less 等等），都经过了不同程度的转换和加工（语法转换、混淆、压缩）。那么，当我们在定位问题位置时，就显得异常困难。Source Map 便提供了一个快捷、高效的解决方案，既满足了代码的转换的同时保持正常的开发体验。

Source Map 的原理是通过在构建时，依赖特定的 .json 文件，记录构建前后代码的映射关系。得益于浏览器的对其支持，通过开发者工具便能直接查看对应的代码位置。

浏览器在加载bundle时，若bundle存在//# sourceMappingURL=?.map，会同时加载对应的.map文件。

### Webpack 2.0+ 的 Source Map 配置项

一共有 10 种 source map 配置策略，其中新增了 `nosources-source-map` 类型, 还包括图中没有提及的 `inline-source-map` 与 `hidden-source-map`。

![](/Users/mac13/Desktop/source-map-01.jpg)

### Source Map 选项之间的区别

不同选项之间差别主要体现在 source map 策略的质量（源码定位，构建与再构建速度等），这些选项之间通常都是互相约束的。

1. `eval` 包裹源码，并在文件尾部添加 source map 文件位置或编码后的 source map 信息。
2.  `cheap` 转换（loader）代码，不支持列信息，且不使用 loader 自身的 source map。
3. `module` 使经过转换后得代码（loader）映射到源代码。

举例：

> 这部分参考链接：https://www.jianshu.com/p/dace0845bf36

**（1）eval**
生成文件：bundle（eval 包裹）
Source URL：fileURL（源码文件）
错误追踪：文件名、源码行和列位置。

**（2）cheap-source-map**
生成文件：bundle 和对应 source-map
Source Map 方式：dataURL（base64）
Sources Content：转换后的代码、源码文件名
错误追踪：行位置（转换后）

**（3）cheap-eval-source-map**
生成文件：bundle（eval 包裹）
Source Map 方式：dataURL（base64）
Sources Content：转后的代码、源码文件名
错误追踪：行位置（转换后 ）

**（4）cheap-module-eval-source-map**
生成文件：bundle （eval 包裹）
Source Map 方式：dataURL（base64）
Sources Content：源代码、源码文件名
错误追踪：文件名、源码行位置

### 根据环境配置 Source Map

**开发环境**
 需求：

1. 快速 build 与 rebuild 速度（配合 HMR）
2. 清晰的 debug 定位信息
3. 尽可能小的 bundle 和 source map 体积

`eval` 优势是快速构建速度，但如果直接使用 `eval-source-map`  会导致在 bundle 尾部的 dataURL 过大（包含源代码），导致包体积增大。`cheap-source-map` 直接得出转换后得代码，由于经过转换，在 debug 时，代码定位不直观。通过 `cheap-module-source-map` 后在 sourcesContent 中可查看源代码。另外，`cheap-source-map` 中 sourcesContent 的体积也相对 `cheap-moudle-source-map` 中的要较大（转换）。结合 `eval` 可以把 devtool 配置为 `cheap-module-eval-source-map`，既能保证一定的 build 与rebuild 速度，同时能确保在 debug 时正确定位代码位置，又能相对地降低 source map 的体积。

推荐使用：`cheap-module-eval-source-map`

**生产环境**
 需求：

1. 清晰的 debug 定位信息
2. 尽可能小的 bundle 且只包含 source map 加载链接
3. 在打开 {Browser} Dev Tool 时才加载 source map

`eval` 的方式不适合在生产环境使用（鉴于 `eval` 本身的安全性和性能等问题），`source-map`  与 `cheap-module-source-map` 的区别在于后者会忽略代码的列信息。source map 通过 mappings 保存转换前后字符的对应位置（Base64 VLQ 编码）。当文件越大，需要记录的位置也越多，就会导致 source map 文件过大，从而降低项目构建性能。在 debug 时，列信息较行信息的重要新更低，可以忽略处理。

推荐使用：`cheap-module-eval-source-map`

> 参考：
>
> [Source Maps](https://link.jianshu.com/?t=https://survivejs.com/webpack/building/source-maps/)
>
> [Webpack Devtool](https://link.jianshu.com/?t=https://webpack.js.org/configuration/devtool/)

