---
layout:     post
title:      "微信公众号开发"
subtitle:   " \"微信公众号开发 \""
date:       2019-01-30 16:00:00
author:     "monkey-yu"
header-img: "img/post-bg-mac.jpg"
catalog: true
tags:
    - 微信
    - 博文
---
自己开通个人的微信公众号（订阅号：小猴子日常）已有一年之久了。一直只是发发文字记录生活的，粉丝也不多，十几个。为了对这十几位观众负责，当然更是为了多一项技能（现在很多公司面试要求都有微信开发经验），开始了此趟学习之路。下面开始具体介绍：

> 主要工具： SAE + 微信公众号 + Git + Python本地环境

#### 1.微信公众号

注册一个个人的微信公众号（个人账号不支持认证），按照[https://mp.weixin.qq.com/](http://link.zhihu.com/?target=https%3A//mp.weixin.qq.com/) 给出的过程依次填写需要的信息就可以完成申请，如果已有账号的话可以直接登录。

登录以后可以看到左边栏的**自动回复**功能，该功能只能实现一个基本的自动回复功能。但如果需要对不同用户的不同输入给出不同的输出结果，例如：查询快递，查询地区+天气等。这种情况下就要使用开发者模式了。

![](/Users/mac13/Desktop/weixin-1.png)

在基本配置中，只需要修改URL 、Token 、EncodingAESKey 三项即可。这里URL 需要你拥有自己的服务器。

