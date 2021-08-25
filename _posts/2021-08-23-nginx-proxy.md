---
layout:     post
title:      "vue 配置代理与Nginx 代理"
date:       2021-08-23 14:00:00
author:     "monkey-yu"
header-img: "img/buildings.jpg"
catalog: true
tags:
    - nginx
    - Vue
---

在项目开发过程中，经常会遇到跨域问题。可以使用代理来绕过跨域问题。 

#### 一、vue中使用代理

1. 在vue.config.js文件中配置代理：

   ```javascript
   devServer: { // 本地启动项
       open: false, // 编译完成是否打开网页
       host: '0.0.0.0', // 默认localhost,0.0.0.0代表可以被外界访问
       port: 8080, // 访问端口
       https: false, 
       hot: true, // 开启热加载
       hotOnly: false,
       // 设置代理
       proxy: {
         '/huawei-token': {
           target: 'https://121.37.XX.XX/', // 鉴权地址
           changeOrigin: true,
           pathRewrite: {
             '/huawei-token': ''
           }
         },
         '/huawei-device': {
           target: 'https://124.71.XX.XX/', // 应用地址
           changeOrigin: true,
           pathRewrite: {
             '/huawei-device': ''
           },
           // 代理中设置请求头
           onProxyReq (proxyReq, req) {
             proxyReq.setHeader('X-Auth-Token', req.headers['x-auth-token']);
           }
         }
       },
       overlay: {
         // 全屏模式下是否显示脚本错误
         warnings: true,
         errors: true
       },
       before: app => {}
     },
   ```

   在配置文件中代理了两个地址，分别：`/huawei-token`、`/huawei-device`。

   2. 在请求的服务中：

      ```javascript
        async login (params) {
          const res = await this.client.post('/huawei-token/v3/auth/tokens', params);
          return res;
        }
      //或者
        async rsuList (projectId) {
          const res = await this.client.get(`/huawei-device/v1/${projectId}/rsus`);
          return res;
        }
      ```

   在项目中发起请求时候，遇到 `/huawei-token`会将其前面的以及这个字符转为 `https://121.37.XX.XX/`，从而实现代理转发。

   #### 二、nginx 配置代理

   1. 官网下载 nginx，并安装。 并配置下环境变量

   2. 前端项目build，打包出来dist文件夹

   3. 修改nginx的配置文件

      nginx.conf:

      ```
          server {
              listen       8080;
              server_name  localhost;
      
              # 前端服务反向代理配置
              location / {
                  root html;  // 前端打包文件的路径,把dist里的文件copy到 html文件夹里
                  index index.html index.htm;
              }
              # 后端服务反向代理配置
             location /huawei-device/ {
                 proxy_pass https://124.71.XX.XX/;  # 华为云获取 设备的服务器地址
             }
      
             location /huawei-token/ {
                 proxy_pass https://121.37.XX.XX/;  # 华为云 鉴权的服务器地址
             }
      
            
              error_page   500 502 503 504  /50x.html;
              location = /50x.html {
                  root   html;
              }
          }
      ```

      4. nginx 命令：

         ```
         开始： start nginx 
         
         停止： nginx.exe -s stop  
         
         重新载入Nginx： nginx.exe -s reload 
         
         重新打开日志文件： nginx.exe -s reopen
         ```

         参考： https://www.jianshu.com/p/01f3626cf25d

      5.  浏览器打开 访问地址 ： localhost:8080

         

