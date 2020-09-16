---
layout:     post
title:      "数组、对象数据结构转换（一）"
subtitle:   " \"数组、对象数据结构转换（一） \""
date:       2020-09-15 12:00:00
author:     "monkey-yu"
header-img: "img/post-bg-mac.jpg"
catalog: true
tags:
    - JS
---
#### 题目1:

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

#### 题目2：

```javascript
实现 @fn rs2MultiHash(rs, key)
@param rs对象，格式为 {h, d}, h/d分别是一个数组，表示一张表的表头字段与内容。
@return 一个对象，内容是键值对。
示例：
	var rs = {
		h: ["id", "name"], 
		d: [ [100, "Tom"], [101, "Jane"], [102, "Tom"] ] 
	};
	var hash = rs2MultiHash(rs, "name");  
	// 结果为
	hash = {
		"Tom": [{id: 100, name: "Tom"}, {id: 102, name: "Tom"}],
		"Jane": [{id: 101, name: "Jane"}]
	};
参数key为"name"，表示将rs对象中"name"字段作为键值，将名字相同的对象组织到同一个"name"字段对象的值数组中。
```

```javascript
function rs2MultiHash(rs,key){
  let h = Object.values(rs)[0];
  let d = Object.values(rs)[1];
  let map = {};
  d.forEach(item => {
    let newItem = {};
    h.forEach((field,i) => {
      newItem[field] = item[i]
    })
    const itemKey = newItem[key];
    if(map[itemKey]){
      map[itemKey].push(newItem)
    }else {
      map[itemKey] = [newItem]
    }
  })
  return map;
}
```

