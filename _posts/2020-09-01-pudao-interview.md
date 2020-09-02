---
layout:     post
title:      "普道科技面经"
date:       2020-09-01 12:00:00
author:     "monkey-yu"
header-img: "img/babousan.jpg"
catalog: True
tags:
    - 实战面经
---

#### 1. 手写深拷贝方法

`string`，`number`等这些值类型不存在深拷贝浅拷贝问题。只是针对`object`, `Array`这些复杂对象类型处理深拷贝。

下面是手写一个深拷贝方法：

```javascript
function deepClone(obj){
	let objClone = Array.isArray(obj) ? [] : {};
	if(obj && typeof obj === 'object') {
		for(key in obj){
			if(obj[key] && typeof obj[key] === 'object'){
				objClone[key] = deepClone(obj[key]);
			}else {
				objClone[key] = obj[key];
			}
		}
	}
   return objClone;
}
```

另一个方法是：

JSON.stringfy() : 将一个对象或数组转换为一个JSON字符串；

JSON.parse(): 将JSON字符串解析成字符串描述的对象或数组。

```javascript
function jsonClone(obj){
	return JSON.parse(JSON.Stringfy(obj));
}
```

#### 2. 数组去重能想到哪几种方法？

例： 

```javascript
let arr1 = ['a','b',null,'a',1,null];
```

1. ES6 中set方法

   ```javascript
   function unique(arr){
   	return Array.from(new Set(arr));
   }
   ```

2. indexOf方法

   ```javascript
   function unique(arr){
     let res = [];
     for(let i=0;i<arr.length;i++){
       if(res.indexOf(arr[i]) === -1){
         res.push(arr[i]);
       }
     }
     return res;
   }
   ```

3. Filter 方法

   ```javascript
   function unique(arr){
     return Array.filter(function(item,index,arr){
       return arr.indexOf(item) === index ;
     })
   }
   ```

#### 3. vue的生命周期

1. **beforeCreate**: 此时组件的选项对象还未创建，el 和data 并未初始化，因此无法访问methods, data,computed等属性和数据。
2. **created**:实例已完成以下配置：数据观测、属性和方法的运算、watch\event事件回调、完成data数据的初始化。el并没有。$el 属性目前不可见。
3. **beforeMount**: 挂载开始前被调用。虚拟dom生成。实例完成以下配置：编译模版，把data数据和模版生成html,完成了el 和data初始化。此时还没有挂载html到页面上。
4. **mounted**: 挂载完成。可以获取到真实的dom节点
5. 