---
layout:     post
title:      "vue细节点"
date:       2020-09-14 12:00:00
author:     "monkey-yu"
header-img: "img/whale.jpg"
catalog: True
tags:
    - Vue 
    - JS
---

#### 1. vuejs里面的变量如何在浏览器的console中查看？

解决方案：

在main.js文件里声明window.Vue = new Vue

```typescript
window.Vue = new Vue ({
  el:'#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
```

在控制台里用Vue就可以访问了。

#### 2.设置一个全局的属性绑定在Vue上

解决方案：

在main.js文件里去设置vue的全局属性

```typescript
import { hasPermission } from './utils/hasPermission';

Vue.use(ElementUI, {locale});
//设置全局属性
Vue.prototype.hasPerm = hasPermission
```

```javascript
// hasPermission.js 文件
import store from '../store';
export function hasPermission(permission){
  let myPermissions = store.getters.permissions;
  return myPermission.indexOf(permission) > -1;
}
```

#### 3.数据结构处理

题目：

```javascript
@param rs对象，格式为 {h, d}, h/d分别是一个数组，表示一张表的表头字段与内容。
@return 一个数组，每一项为一个对象。
示例：
 var rs = {
  h: ["id", "name"], 
  d: [ [100, "Tom"], [101, "Jane"] ] 
 };
 var arr = rs2Array(rs); 
 // 结果为
 arr = [
  {id: 100, name: "Tom"},
  {id: 101, name: "Jane"} 
 ];
```

实现：

```javascript
function rs2Array(rs){
	let res = [];
	let keyArr = Object.values(rs)[0];
	let valuesArr = Object.values(rs)[1];
	for(let i=0;i < valuesArr.length;i++){
		let item ={};
		for (let j=0;j<keyArr.length;j++){
			item[keyArr[j]] = valuesArr[i][j];
		}
		res.push(item);
	}
	return res;
}
```

