---
layout:     post
title:      "Vue中Select Option Value不能是对象"
date:       2019-05-30 16:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: false
tags:
    - Vue
    - 实例
---

> Vue中Select Option Value不能是对象，下面是具体介绍及解决方式。

Vue中的select选择器，使用elm框架实现的代码是：

```html
// html 
<el-select v-model="value" placeholder="请选择" @change="toAdd">
  <el-option
    v-for="item in options"
    :key="item.value"
    :label="item.label"
    :value="item.value">
  </el-option>
</el-select>
```

```js
// js
export default {
    data() {
      return {
        options: [{
          value: '选项1',label: '黄金糕'
        }, {
          value: '选项2',label: '双皮奶'
        }, {
          value: '选项3',label: '蚵仔煎'
        }, {
          value: '选项4',label: '龙须面'
        }],
        value: ''
      }
    }
  }
```

上述代码中如果使用 `v-model` 那么 `option` 值不能使用对象，需要将对象转换成字符串。

我的实际开发情景，如下图：

在添加标签的select框选中的值，点击添加后，显示在当前标签中，最后点击确认，发送到服务器。其中option中的`value` ：`String`;当前标签为`Object`。`toAdd`事件传送的值是string格式的value。

![vue-select1](/img/post_img/vue/vue-select1.png)

解决思路：

**绑定 `option value` 的时候使用 `JSON.stringify` 将对象转换成字符串；**

**返回当前选中值的时候使用 `JSON.pares()` 将字符串转成Object。**

下面是具体解决方式：

```html
// html value后面传item 对象，使用object2String过滤器
<el-select v-model="value" placeholder="请选择" size="mini" @change="toAdd">
  <el-option
    v-for="item in selectTagsOptions"
    :key="item.labelId"
    :label="item.title"
    :value="item | object2String">
  </el-option>
</el-select> 
```

```js
// ts 1. 添加过滤器
  filters: {
    object2String:function(obj){
      return JSON.stringify(obj)
    }
  }
// ts 2. 选中值字符串转对象，然后添加到需显示的当前标签数组中
toAdd(item){
    const selectedObj = JSON.parse(item);
    if(this.currentLabels.indexOf(selectedObj) < 0){
      this.currentLabels.push(selectedObj);
    }
}
```

> end ！