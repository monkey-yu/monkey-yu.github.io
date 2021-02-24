---
layout:     post
title:      "build生成的包本地运行"
date:       2021-02-24 12:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: true
tags:
    - 技术
---

​		在vue等项目中开发，然后npm run build 或者yarn build 之后生成的包文件夹dist 。 通常情况下直接打开dist 里的index.html 文件在浏览器里运行即可。但如果想要别人也可以查看到你本地包里的项目，可以分享他一个网址，当然前提是在同一个局域网内。 

1. npm 全局安装serve 。

   ```
   npm i serve -g
   ```

2. 在dist 外的一层路径下cmd 执行 serve dist 即可。这时候会显示访问的链接地址，通常为5000端口。

   如果打开的项目图片不显示或者缺失文件。可能是build 之前。 vue.confif.js 文件里的

   ```
   publicPath: './',
   ```

   路径配置不正确。

   详情可参考 [相关blog](https://monkey-yu.github.io/2020/11/04/vue-build%E5%90%8E%E6%9C%AC%E5%9C%B0%E8%BF%90%E8%A1%8C.html)。

   

