---
layout:     post
title:      "前端换肤"
date:       2019-04-12 15:00:00
author:     "monkey-yu"
header-img: "img/daytime-flow.jpg"
catalog: true
tags:
    - CSS
---

> 前端主题（换肤）经常会遇到，下面聊聊换肤的几种方式。

#### 一、一般实现

我们在某些网站看到几个颜色块，点击不同的颜色，该网站的整体颜色就会切换成对应颜色。一般的实现方式：**点击不同的颜色选择不同的样式表**。如：

- theme-green.css
- Theme-red.css
- Theme-yellow.css

缺陷：方式笨拙，扩展性差，加载成本高。

#### 二、ElementUi的实现

先看它的[官网](<http://element-cn.eleme.io/#/zh-CN/component/installation>) 以及尝试其换肤效果。这种实现效果可以由用户自定义选择颜色，而且展示效果也很优雅。他的实现思路：

- 先把默认主题文件中涉及的颜色替换成关键词；
- 根据用户选择的颜色生成一系列对应的色值；
- 把关键词再换回刚刚生成的色值；
- 直接在页面上加style标签，把生成的样式填进去

源码地址：<https://github.com/ElementUI/theme-preview/blob/master/src/app.vue#L250-L274>

下面是核心代码：

```
changeTheme = color => {
        // 这里防止两次替换颜色值相同，省的造成不必要的替换，同时验证颜色值的合法性
        if (color !== this.state.themeColor && (ABBRRE.test(color) || HEXRE.test(color))) {
            const styles =
                document.querySelectorAll('.so-ui-react-theme').length > 0
                    ? Array.from(document.querySelectorAll('.so-ui-react-theme')) // 这里就是上说到的
                    : Array.from(document.querySelectorAll('style')).filter(style => {  // 找到需要进行替换的style标签
                          const text = style.innerText;
                          const re = new RegExp(`${this.initStyleReg}`, 'i');
                          return re.test(text);
                      });

            const oldColorCluster = this.initColorCluster.slice();
            const re = new RegExp(`${this.initStyleReg}`, 'ig');  // 老的颜色簇正则，全局替换，且不区分大小写

            this.clusterDeal(color);  // 此时 initColorCluster 已是新的颜色簇

            styles.forEach(style => {
                const { innerText } = style;
                style.innerHTML = innerText.replace(re, match => {
                    let index = oldColorCluster.indexOf(match.toLowerCase().replace('.', '0.'));

                    if (index === -1) index = oldColorCluster.indexOf(match.toUpperCase().replace('.', '0.'));
                    // 进行替换
                    return this.initColorCluster[index].toLowerCase().replace(/0\./g, '.');
                });

                style.setAttribute('class', 'so-ui-react-theme');
            });
          

            this.setState({
                themeColor: color,
            });
        }
    };

```

#### 三、antd的实现

antd的样式是基于less来编写的，在换肤的时候也是利用了less可以**直接编译css变量**的特性。

```
.test-block {
    width: 300px;
    height: 300px;
    text-align: center;
    line-height: 300px;
    margin: 20px auto;
    color: @primary-color;
    background: @bg-color;
}
```

点击色块换肤的时候，直接去加载less.js,具体代码：

```
import React from 'react';
import { loadScript } from '../../shared/utils';
import './index.less';
const colorCluters = ['red', 'blue', 'green'];

export default class ColorPicker extends React.Component {
    handleColorChange = color => {
        const changeColor = () => {
            window.less
                .modifyVars({  // 调用 `less.modifyVars` 方法来改变变量值
                    '@primary-color': color,
                    '@bg-color': '#2f54eb',
                })
                .then(() => {
                    console.log('修改成功');
                });
        };
        const lessUrl =
            'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js';

        if (this.lessLoaded) {
            changeColor();
        } else {
            window.less = {
                async: true,
            };

            loadScript(lessUrl).then(() => {
                this.lessLoaded = true;
                changeColor();
            });
        }
    };

    render() {
        return (
            <ul className="color-picker">
                {colorCluters.map(color => (
                    <li
                        style={{ color }}
                        onClick={() => {
                            this.handleColorChange(color);
                        }}>
                        color
                    </li>
                ))}
            </ul>
        );
    }
}
```

记得将下面这行引入html:

<link rel="stylesheet/less" type="text/css" href="styles.less" />

#### 四、自定义变量实现

css自定义变量，它拥有像less/sass那种定义变量的能力。声明变量的时候，变量名前面要加两根连线词（—），在使用时候需要var()来访问即可。

```
/* 使用sass定义变量*/
$font-size: 20px

.test {
  font-size: $font-size
}

/* 使用css自定义变量*/
:root{
    --font-size:20px;
}
.test{
    font-size:var(--font-size)
}
```

使用 `css 自定义变量` 的好处就是我们可以使用 `js` 来改变这个变量：

- 使用 `document.body.style.setProperty('--bg', '#7F583F');` 来设置变量
- 使用 `document.body.style.getPropertyValue('--bg');` 来获取变量
- 使用 `document.body.style.removeProperty('--bg');` 来删除变量

css自定义变量：<https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties>

