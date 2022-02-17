---

layout:     post
title:      "web网站性能优化"
date:       2022-02-15 18:00:00
author:     "monkey-yu"
header-img: "img/whale.jpg"
catalog: true
tags:
    - Web
---

#### 一、等待中 (TTFB)

TTFB 是 Time to First Byte 的缩写，指的是浏览器开始收到服务器响应数据的时间（后台处理时间+重定向时间），是反映服务端响应速度的重要指标。

​	![web-1](/img/post_img/web-performance/web-1.png)

TTFB 过长的原因

我们知道，对于动态网页来说，服务器收到用户打开一个页面的请求时，首先要从数据库中读取该页面需要的数据，然后把这些数据传入到模版中，模版渲染后，再返回给用户。由于查询数据和渲染模版需要需要一定的时间，在这个过程没有完成之前，浏览器就一致处于等待接收服务器响应的状态。有些服务的性能比较低，或者优化没做好，这个时间就会比较长。

Waiting (TTFB) 时间过长的解决办法

那就是缩短服务器响应时间，最简单直接并且有效的办法就是使用缓存，把 PHP 和 MySQL 的执行时间最小化，一些缓存插件可以把 SQL 查询结果缓存起来，把几十次查询结果转换为几次；一些缓存插件可以直接把用户所请求的页面静态化，用户打开网页时，相当于直接从服务器上下载了静态页面。

如果是网络原因，换一个服务器是比较直接的解决办法。如果因为一些原因不能换服务器，可以使用一个 CDN，把页面同步到离用户比较近的 CDN 节点上，也是一个不错的解决办法。

如果是 Cookie 的原因，可以通过修改应用程序，删除一些不必要的 Cookie，或者精简 Cookie 内容，缩短 Cookie 的有效期等，都是解决办法。

网站加载 Waiting (TTFB) 时间达到了 50 ms以下，表示性能好的。50ms以上，需优化。。

结论： 需要CDN。

#### 二、利用webpack-bundle-analyzer 分析器，分析项目依赖关系.

插件使用：

```javascript
// 文件路径 build --> webpack.prod.conf.js   
//增加以下配置
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
...
plugins: [
	...
    new BundleAnalyzerPlugin(),
    ...
]
```

添加上面代码之后， 运行打包命令 **npm run build**,打包成功后会自动弹出 **127.0.0.1:8888** 像下面一样，看到许多小块，每个小块对应每个模块，小块越大文件越大。

![web-2](/img/post_img/web-performance/web-2.png)

结论：

1）先检查package.json里每个依赖，是否存在引入但没有使用的闲置依赖包。

2）依赖优化之 CDN 加速。

​	![web-3](/img/post_img/web-performance/web-3.png)

3） gzip暴力压缩：

nginx开启 gzip模式；

vue 开启gzip:

先安装**compression-webpack-plugin**

```
npm i compression-webpack-plugin@1.1.12 --save-dev
```

**配置 gzip**：

```javascript
//文件路径  config --> index.js
 build: {
    // Gzip off by default as many popular static hosts such as
   	// Surge or Netlify already gzip all static assets for you.
   	// Before setting to `true`, make sure to:
   	// npm install --save-dev compression-webpack-plugin
   	productionGzip: true,      //之前时false  改为true
   	productionGzipExtensions: ['js', 'css'],
 }
```

#### 三、图片优化：

日常项目中经常会用到全屏的图片， .png 和 .jpg 的图片都太大，加载缓慢。

我们可以使用[webP格式](https://www.upyun.com/webp)的图片或者分辨率较低的压缩图，再叠加一层清晰的 png 图片，实现快速显示的效果。

叠加 png 图片的目的是防止某些浏览器不支持 webP 格式。

CSS代码：

```css
<style>
    body{
        background-image: url("img/beijing.webp"),url("img/beijing.png");
    }
</style>
```

两张图会进行叠加，先显示 webP 格式，再显示 png 格式，因为 webP 图片会比 png 小很多，可以实现快速显示的效果。

![web-4](/img/post_img/web-performance/web-4.png)

又拍云网站： https://www.upyun.com/products/process#pic ， 可以优化图片为webp等，需付费。

网站的图片优化：还可以拉着设计一起，在不失真的情况下 提供最小的图片。

------

上面是优化特效库网站时候的一些调研。
