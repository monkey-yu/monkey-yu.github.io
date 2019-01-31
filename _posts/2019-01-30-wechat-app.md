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

![weixin-1](/img/post_img/weixin-app/weixin-1.png)

在基本配置中，只需要修改URL 、Token 、EncodingAESKey 三项即可。这里URL 需要你拥有自己的服务器。

![](/img/post_img/weixin-app/weixin-2.png)

#### 2.服务器 SAE

这里我们使用新浪云作为服务器。注册新浪云[sinacloud.com](http://link.zhihu.com/?target=https%3A//www.sinacloud.com) ，新用户会有一定的优惠云豆，所以几乎足够免费完成该学习任务了。

选择云应用，创建一个新应用，选择配置，我用的是：Python + 共享运行环境 + Git ,然后填写二级域名 及 应用名称。

![weixin-3](/img/post_img/weixin-app/weixin-3.png)

成功创建后，会获得相应的一些配置数据和密钥，以及登录账号和安全密码。

SAE平台的代码版本控制，我使用的是Git，可以看到git 仓库信息，代码部署说明等。Git这里不多说。

#### 3.服务器配置和Token认证

由于我们之前在 SAE 平台创建的是空应用，所以我们需要做一些基础的配置工作。这次我们选择使用 web.py （Python 2.7）来进行服务器搭建，如果本地没有 web.py 库的话可以通过 pip 命令进行安装（pip install web.py）。

之后我们需要创建一个项目，比如：monkey 。并编辑如下代码：

config.yaml ，配置我们需要安装的包及版本号

```
name: monkey
version: 1

libraries:
- name: webpy
  version: "0.36"

- name: lxml
  version: "2.3.4"
```

Index.wsgi ，该文件是SAE应用的入口文件

```
import os
import sae
import web
from handle import Handle
urls = (
    '/', 'Handle' 
)
app = web.application(urls, globals()).wsgifunc()

application = sae.create_wsgi_app(app)

```

这两部分是web.py的基础配置文件，之后我们需要实现微信公众平台功能的代码。鉴于index.wsgi文件也可以看出需要引入handle文件。因此：

新建handle.py 

```
# -*- coding: utf-8 -*-
# filename: handle.py

import hashlib
import reply
import receive
import web
class Handle(object):
    def GET(self):
        try:
            data = web.input()
            if len(data) == 0:
                return "hello, world"
            signature = data.signature
            timestamp = data.timestamp
            nonce = data.nonce
            echostr = data.echostr
            token = "monkey2019" #请按照公众平台官网\基本配置中信息填写

            list = [token, timestamp, nonce]
            list.sort()
            sha1 = hashlib.sha1()
            map(sha1.update, list)
            hashcode = sha1.hexdigest()
            print "handle/GET func: hashcode, signature: ", hashcode, signature
            if hashcode == signature:
                return echostr
            else:
                return ""
        except Exception, Argument:
            return Argument
```

编写好这三部分代码后，我们就实现了简单的微信平台认证配置，handle文件中的token字段需要配置，即为微信平台中输入的token一致。认证token我们只需要用到上文中的GET方法。

将上面文件通过git 传到SAE的代码托管中，过程中会需要输入SAE的用户名和安全密码，具体命令如下：

```
git init
git remote add sae https://git.sinacloud.com/monkey
git add .
git commit -m 'your commit message'
git push sae master:1
```

之后回到公众平台的开发者页面，填写 URL 为 [http://xxxx.sinaapp.com ](http://link.zhihu.com/?target=http%3A//XXXX.sinaapp.com/)填写 Token 与代码中的 token 一致，EncodingAESKey 随机生成，然后点击提交认证，如果上面步骤没有操作错误，这一步就可以认证成功了。

***注意⚠️*：python代码有严格缩进，并且空格与tab不能混用，否则报错！！！**

#### 4.实现简单的消息回复机制

在微信公众号的认证完成以后，就可以针对用户的消息搞一些事情了。比如通过用户发送的某些关键字，来实现查询快递、查询天气、回复用户。

用户与公众号之间的消息交互类型分为文本、图片、语音、视频、小饰品、地理位置、链接等。用户消息以XML形式传至我们搭建好的服务器中，我们需要解析XML信息，获取需要的信息，进行处理后返回给用户结果。

文本消息的XML结构：

```
<xml>
 <ToUserName><![CDATA[toUser]]></ToUserName>
 <FromUserName><![CDATA[fromUser]]></FromUserName>
 <CreateTime>1348831860</CreateTime>
 <MsgType><![CDATA[text]]></MsgType>
 <Content><![CDATA[this is a test]]></Content>
 <MsgId>1234567890123456</MsgId>
 </xml>

```

图片消息的XML结构：

```
<xml>
 <ToUserName><![CDATA[toUser]]></ToUserName>
 <FromUserName><![CDATA[fromUser]]></FromUserName>
 <CreateTime>1348831860</CreateTime>
 <MsgType><![CDATA[image]]></MsgType>
 <PicUrl><![CDATA[this is a url]]></PicUrl>
 <MediaId><![CDATA[media_id]]></MediaId>
 <MsgId>1234567890123456</MsgId>
 </xml>
```

可以看到，两者共有的字段为ToUserName、FromUserName、CreateTime、MsgType和MsgId，对于文本消息，我们可以通过Content字段直接提取出消息文本内容，但是对于图片消息，我们需要通过PicUrl或MediaId获取图片信息后进行处理。

下面，我们来实现对用户发送的消息（文本和图片），返回给他该消息：

handle文件，新增POST函数：

```
# -*- coding: utf-8 -*-
# filename: handle.py

import hashlib
import reply
import receive
import web
class Handle(object):
    def POST(self):
        try:
            webData = web.data()
            print "Handle Post webdata is ", webData
   #后台打日志
            recMsg = receive.parse_xml(webData)
            # 用户发送文本，返回给用户该文本
            if isinstance(recMsg, receive.Msg) and recMsg.MsgType == 'text':
                toUser = recMsg.FromUserName
                fromUser = recMsg.ToUserName
                content = recMsg.Content
                replyMsg = reply.TextMsg(toUser, fromUser, content)
                return replyMsg.send()
            # 用户发送图片，返回给图片
            elif isinstance(recMsg, receive.Msg) and recMsg.MsgType == 'image':
                toUser = recMsg.FromUserName
                fromUser = recMsg.ToUserName
                mediaId = recMsg.MediaId
                replyMsg = reply.ImageMsg(toUser, fromUser, mediaId)
                return replyMsg.send()
            else:
                print "暂且不处理"
                return "success"
        except Exception, Argment:
            return Argment

```

另外，新增reply.py文件:

```
# -*- coding: utf-8 -*-
# filename: reply.py
import time
class Msg(object):
    def __init__(self):
        pass
    def send(self):
        return "success"
class TextMsg(Msg):
    def __init__(self, toUserName, fromUserName, content):
        self.__dict = dict()
        self.__dict['ToUserName'] = toUserName
        self.__dict['FromUserName'] = fromUserName
        self.__dict['CreateTime'] = int(time.time())
        self.__dict['Content'] = content
    def send(self):
        XmlForm = """
        <xml>
        <ToUserName><![CDATA[{ToUserName}]]></ToUserName>
        <FromUserName><![CDATA[{FromUserName}]]></FromUserName>
        <CreateTime>{CreateTime}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[{Content}]]></Content>
        </xml>
        """
        return XmlForm.format(**self.__dict)
class ImageMsg(Msg):
    def __init__(self, toUserName, fromUserName, mediaId):
        self.__dict = dict()
        self.__dict['ToUserName'] = toUserName
        self.__dict['FromUserName'] = fromUserName
        self.__dict['CreateTime'] = int(time.time())
        self.__dict['MediaId'] = mediaId
    def send(self):
        XmlForm = """
        <xml>
        <ToUserName><![CDATA[{ToUserName}]]></ToUserName>
        <FromUserName><![CDATA[{FromUserName}]]></FromUserName>
        <CreateTime>{CreateTime}</CreateTime>
        <MsgType><![CDATA[image]]></MsgType>
        <Image>
        <MediaId><![CDATA[{MediaId}]]></MediaId>
        </Image>
        </xml>
        """
        return XmlForm.format(**self.__dict)
```

新增receive.py文件：

```
# -*- coding: utf-8 -*-
# filename: receive.py
import xml.etree.ElementTree as ET
def parse_xml(web_data):
    if len(web_data) == 0:
        return None
    xmlData = ET.fromstring(web_data)
    msg_type = xmlData.find('MsgType').text
    if msg_type == 'text':
        return TextMsg(xmlData)
    elif msg_type == 'image':
        return ImageMsg(xmlData)
class Msg(object):
    def __init__(self, xmlData):
        self.ToUserName = xmlData.find('ToUserName').text
        self.FromUserName = xmlData.find('FromUserName').text
        self.CreateTime = xmlData.find('CreateTime').text
        self.MsgType = xmlData.find('MsgType').text
        self.MsgId = xmlData.find('MsgId').text
class TextMsg(Msg):
    def __init__(self, xmlData):
        Msg.__init__(self, xmlData)
        self.Content = xmlData.find('Content').text.encode("utf-8")
class ImageMsg(Msg):
    def __init__(self, xmlData):
        Msg.__init__(self, xmlData)
        self.PicUrl = xmlData.find('PicUrl').text
        self.MediaId = xmlData.find('MediaId').text
```

上述文件修改完成后，重新git操作push回远程仓库中。

#### 5.消息回复功能的测试

回到微信公众平台，点击“开发者工具 ==> 公众平台测试账号”,扫码确认登录，进入该页面https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index。

输入接口配置 和域名配置，如图：

![weixin-4](/img/post_img/weixin-app/weixin-4.png)

配置成功后，扫描下方的测试号二维码进行输入信息测试，上述功能实现后如下图：

![weixin-5](/img/post_img/weixin-app/weixin-5.png)

#### 6.SAE添加第三方依赖包

上述的简单功能已完成，如需开发复杂的功能，并需要依赖于第三方包应该怎么做呢？新浪云上官方提供的方法：

https://www.sinacloud.com/doc/sae/python/tools.html#tian-jia-di-san-fang-yi-lai-bao。

当然也可以不拘泥于上述链接提供的方法。也可通过以下步骤：

1. 在本地仓库新建文件夹vendor
2. 使用pip -t 选项指定第三方库安装地址
3. 添加路径到index.wsgi文件中。

举例安装requests：

![weixin-6](/img/post_img/weixin-app/weixin-6.jpg)

之后编辑 index.wsgi，在顶部添加代码即可:

```
# coding: UTF-8
import os
import sae
import web
sae.add_vendor_dir('vendor')
```

#### 7.启用服务器

将我们实现的功能运用到微信公众平台中，只需要在“开发 ==>  基本配置”中 将服务器配置 右侧的***启用***按钮点击即可。

![](/img/post_img/weixin-app/weixin-7.png)

> 已完结。