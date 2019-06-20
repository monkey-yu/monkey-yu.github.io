---
layout:     post
title:      "Vue中v-for生成的input框"
date:       2019-06-20 16:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: false
tags:
    - Vue
    - 实例
---

> 每次你以为你已经把vue用的很熟练的时候，它总会给你惊喜

最近做的一个功能是显示许许多多的input框，填入数据后可筛选获得菜单。如图：

![](/img/post_img/vue/vue-input-1.png)

其中食物种数后端接口返回，如：

```
category = [{id: 1, name: "谷薯芋、杂豆、主食"},{id: 2, name: "蛋类、肉类及制品"}...]
```

`input`框的最小值-最大值默认为 0-0。要求至少填写一项。

下面是实现方式：

```html
 <el-row>
          <el-col
            :span="7"
            :key="tag.id"
            v-for="(tag,index) in category">
            <div class="food-select-group">
              <label class="input-label">{{tag.name}}</label>
              <el-input
                type="number"
                class="foods-dialog-input"
                v-model="dialogAmountFields.minArr[index]"
                :placeholder="labelsText.placeholderMin"
                size="small">
              </el-input>
            </div>
            <label class="symbol-label"> ~ </label>
            <div class="food-second-select-group">
              <el-input
                type="number"
                class="foods-dialog-input"
                v-model="dialogAmountFields.maxArr[index]"
                :placeholder="labelsText.placeholderMax"
                size="small">
              </el-input>
            </div>
          </el-col>
        </el-row>
```

```javascript
// 定义对象数组，来存储input中v-model的值
  dialogAmountFields = {
      minArr: [],
      maxArr: []
  };
// 点击生成button 
  generateForm(){
    // amountConditions存储食物种数的id、最小值 、最大值
    let amountConditions = this.category.map((item,index)=> {
      return {
        categoryId: item.categoryId,
        min: this.dialogAmountFields.minArr[index]-0 || 0,
        max: this.dialogAmountFields.maxArr[index]-0 || 0
      }
    });
    // amountLen 存储用户有填最小值or最大值的项，并且最小值 < 最大值 ，此为有效的筛选信息
    let amountLen = [];
    amountLen = amountConditions.filter(item => {
      return (item.min !== 0 || item.max !== 0) && (item.min < item.max);
    });
    // 发送ajax post请求 ,使用到amountLen 该字段
    ... 
	}
```

效果如下：

![vue-input-2](/img/post_img/vue/vue-input-2.png)

![vue-input-3](/img/post_img/vue/vue-input-3.png)

**说明：**

 	1. `v-model="dialogAmountFields.minArr[index]"`利用了`category`的index来区分每一项；
 	2. 定义的`minArr` 和`maxArr`数组必须包含在一个对象里，否则失效。

> end ！