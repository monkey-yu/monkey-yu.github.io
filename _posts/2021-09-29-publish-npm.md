---
layout:     post
title:      "将自己的vue组件发布为npm包"
date:       2021-09-29 14:00:00
author:     "monkey-yu"
header-img: "img/buildings.jpg"
catalog: true
tags:
    - npm
---

**首先问题：**开发中我们往往需要做某些功能，这个功能可能会出现很多次，也会出现在不同的项目。需要使用时候又不想重新写，怎么办呢？

**解决思路：**把这个特殊的需求功能做成属于自己的组件，当下次需要去使用它的时候。那么我们就可以打包这个组件并上传到`npm`管理库，这个库可以是自己的私有库，也可以是`npmjs`公共库。

#### 一、初始化一个空项目

1、新建一个文件夹，然后进入到该文件夹目录下，执行

```kotlin
npm init
```

初始化项目。然后会让你填一些项目相关的信息，跟着提示填就是了。没啥说的。注意`name`不要和现有的其他`npm`包重名了，不然一会儿发Npm包的时候会失败，可以先去`npmjs.com`搜一下有没有重名的。
 这一步完成后，目录下会生成`package.json`文件。

2、由于本教程是发布一个`vue`的组件包，而且使用了`es6`和`webpack`，所以在`devDependencies`字段中，应该至少加入对应的依赖，可以参考我这个配置`name` 为`npm`包的名称，一定不能跟别人的重复，可以自己去`npmjs.com` 上面检查下是否重复，否则提交不成功的
 `main` 自己定义的程序的入口文件，比如我希望打包后是 `dist/flowHeatmap.js`。`private` 要设置为 `false`

```kotlin
{
  "name": "flow-heatmap",
  "version": "1.0.0",
  "description": "a vue for flow-heatmap",
  "author": "monkey-yu",
  "license": "MIT",
  "main": "dist/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server --hot --inline",
    "build": "webpack --display-error-details --config webpack.config.js"
  },
  "dependencies": {
    "vue": "^2.5.11"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-preset-env": "^1.6.0",
    "babel-preset-stage-3": "^6.24.1",
    "cross-env": "^5.0.5",
    "css-loader": "^0.28.7",
    "file-loader": "^1.1.4",
    "style-loader": "^0.23.1",
    "node-sass": "^4.7.2",
    "sass-loader": "^6.0.6",
    "vue-loader": "^13.0.5",
    "vue-template-compiler": "^2.4.4",
    "webpack": "^3.12.0",
    "webpack-dev-server": ">=3.4.1"
  }
}
```

因为我的组件中使用到了scss,因此要安装 `node-sass`和  `sass-loader`,并且注意他们的版本不能过高，需要和`webpack`版本兼容，版本过高可能会在打包步骤报错。

3、执行`npm install`，下载这些依赖包。
4、项目根目录下创建2个文件夹：`dist` 和 `src`，名字按照个人习惯可以变动。我习惯使用`dist`代表发布的目录，`src`是开发目录。`dist`文件夹里的js是到时候通过webpack打包后的文件。待会只会提交`dist`目录到`npm`官网上，`src`不提交。

1.  src下新建一个vue文件，flow-heatmap.vue内容大致如下：

   ```vue
   <template>
     <div class="heat-map">
        <transition
           appear
           enter-active-class="animate__animated animate__fadeIn"
           leave-active-class="animate__animated animate__fadeOut">
         <div class="heatmap-box">
           <div class="title">
             <div>
               <span class="name">{{title}}</span>
               <span class="decorator-triangle"></span>
             </div>
             </div>
             <ul class="map-ul">
               <li class="map-li" v-for="(item,index) in heatMapLegend" :key="index">
                 <p class="legend" :style="{background: item.color}"></p>
                 <p class="name">{{item.text}}</p>
                 <p class="desc">{{item.desc}}</p>
               </li>
             </ul>
         </div>
         </transition>
     </div>
   </template>
   <script>
   export default {
     name: 'HeatMap',
     props: {
       title: {
         type: String,
         default: ''
       } 
     },
     computed: {
     },
     data () {
       return {
         heatMapLegend: [
           {
             color: '#15EA91',
             text: '畅通',
             desc: '<10'
           },
           {
             color: '#79E126',
             text: '基本畅通',
             desc: '10-30'
           },
           {
             color: '#FFC633',
             text: '轻度拥挤',
             desc: '30-80'
           }
         ]
       };
     },
     methods: {
     }
   };
   </script>
   <style lang="scss" scoped>
   .heat-map{
     position: absolute;
     left: 8px;
     bottom: 8px;
     z-index: 1;
     left: 800px;
     .heatmap-box{
       width: 408px;
       height: 160px;
       background: url('./images/heat-map-bg.png');
       .title{
         display: flex;
         justify-content: space-between;
         align-items: center;
         padding: 12px 18px;
         ...
     }
   }
   </style>
   ```

2. 还需要创建一个`js`文件。`index.js` 内容如下（这里的写法主要是把这个组件 `export` 出去）：

   ```javascript
   import flowHeatmap from './flow-heatmap.vue'
   export default flowHeatmap;
   ```

3. 如果有其他静态文件，比如图片等，可以在src下新建文件夹存放，在vue组件中引入。

4. 接下来配置 `webpack` 打包，把src中的内容打包进 `dist` 目录内。

5. 在根目录下新建一个webpack.config.js文件：

   ```javascript
   var path = require('path')
   var webpack = require('webpack')
   
   module.exports = {
     entry: './src/index.js',
     output: {
       path: path.resolve(__dirname, './dist'),//输出路径，就是上步骤中新建的dist目录
       publicPath: '/dist/',//路径
   
       filename: 'flowHeatmap.js',//打包之后的名称
       library: 'flowHeatmap', // 指定的就是你使用require时的模块名
   
       libraryTarget: 'umd', // 指定输出格式
       umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
     },
   
     module: {
       rules: [
         {
           test: /\.scss$/,
           use: [
             'style-loader',
             'css-loader',
             'sass-loader'
           ]
         },
         {
           test: /\.css$/,
           use: [
             'style-loader',
             'css-loader'
           ],
         },
         {
           test: /\.vue$/,
           loader: 'vue-loader',
           options: {
             loaders: {
             }
             // other vue-loader options go here
           }
         },
         {
           test: /\.js$/,
           loader: 'babel-loader',
           exclude: /node_modules/
         },
         {
           test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
           loader: 'file-loader',
           options: {
             name: '[name].[ext]?[hash]'
           }
         }
       ]
     },
     resolve: {
       alias: {
         'vue$': 'vue/dist/vue.js'
       },
       extensions: ['*', '.js', '.vue', '.json']
     },
     devServer: {
       historyApiFallback: true,
       noInfo: true,
       overlay: true
     },
     performance: {
       hints: false
     },
     devtool: '#eval-source-map'
   }
   
   if (process.env.NODE_ENV === 'production') {
     module.exports.devtool = '#source-map'
     // http://vue-loader.vuejs.org/en/workflow/production.html
     module.exports.plugins = (module.exports.plugins || []).concat([
       new webpack.DefinePlugin({
         'process.env': {
           NODE_ENV: '"production"'
         }
       }),
       new webpack.optimize.UglifyJsPlugin({
         sourceMap: true,
         compress: {
           warnings: false
         }
       }),
       new webpack.LoaderOptionsPlugin({
         minimize: true
       })
     ])
   }
   ```

6. 新建一个文件，名为`.npmignore`，是不需要发布到npm的文件和文件夹，规则和`.gitignore`一样。如果你的项目底下有`.gitignore`但是没有`.npmignore`，那么会使用`.gitignore`里面的配置。大致可以参考我的`.npmignore`

   ```kotlinko
   .DS_Store
   node_modules/
   dist/
   build/
   npm-debug.log
   yarn-error.log
   package-lock.json
   
   # Editor directories and files
   .idea
   *.suo
   *.ntvs*
   *.njsproj
   *.sln
   ```

5、然后执行`npm run build`，就会在`dist`目录下生成`helloWorld.js`。**这个`js`即是我们这个`npm`包的主文件。**

至此，一个`npm`组件包就做完了，剩下的，只是提交到`npm`官网去。

### 二、发布到`NPM`上的流程

1、前提，得有个`npm`账号，没有就新注册一个账号
 `https://www.npmjs.com/signup`

  这里邮箱有验证，需要去点击验证。

2、进入到项目的根目录下，运行 `npm login` 执行登录
 一般情况下回提示你输入 你的用户名，密码和邮箱，若登录成功一般会显示：

```csharp
`Logged in as` 你的名字 `on https://registry.npmjs.org/`.
```

 在登录这步可能会报错或者超时。

​	错误原因：npm 使用了淘宝镜像导致的。

​	解决方法：切换源为npm

​	方法：全局安装nrm小工具做快速切换

```bash
npm install -g nrm 
nrm use taobao
nrm use npm
123
```

  然后再登录 npm：

```bash
npm login
```

3、登录成功后就可以执行 `npm publish`  即可将这个`npm`包发布到`npm`官网。大概过个10来分钟就可以搜索到并下载，我们执行`npm install hello-world --save-dev` 即可在自己的项目中import导入进来当做组件使用了。
 4、更新包的时候，需要手动修改 `package.json` 中的`version`版本号，一般惯例都是`+1`，比如`1.0.0 --> 1.0.1`。更改完成后，分别执行打包、登录`npm`、发布即可。

```undefined
npm run build

npm login
npm publish
```

至此，发布包完成。可以去npm官网上看到自己的包。

参考链接： https://www.jianshu.com/p/0fd669635b76
