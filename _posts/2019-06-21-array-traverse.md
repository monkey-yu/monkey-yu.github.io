---
layout:     post
title:      "数组的几种遍历方法"
date:       2019-06-21 12:00:00
author:     "monkey-yu"
header-img: "img/post-sea.jpeg"
catalog: true
tags:
    - JS
---

> 开发过程中，最常遇到数据处理的问题了，尤其是数组的数据转换。今天总结下几种常见的数组遍历方法。

#### 一、forEach方法

forEach是最常用的遍历方法，它提供一个回调函数，可用于处理数组中每个元素，默认没有返回值。

回调函数的参数：1. 处于当前循环的元素 2. 该元素下标 3. 数组本身。 三个参数均可选。

```javascript
// 计算数组中>=3的元素的个数
let arr=[1,2,3,4,5];
let res = 0;
arr.forEach(item => {
	item >=3 ? res++ : res
});
console.log(res);    // 3
```

#### 二、map方法

map，是对数组元素的映射，它提供一个回调函数。默认返回一个数组，这个新数组的每一个元素是原数组元素执行了回调函数之后的返回值。

回调函数的参数：1. 处于当前循环的元素 2. 该元素下标 3. 数组本身。 三个参数均可选。

```javascript
// 把原数组的每一项乘以自身下标+1的数
let arr=[1,2,3,4,5];
let res = arr.mao((item,index) => {
	return item*(index+1)
});
console.log(arr);  // [1,2,3,4,5]
console.log(res);  // [1,4,9,16,25]
```

map不改变原数组。

#### 三、filter方法

filter,过滤，是对数组元素的一个条件筛选。它提供一个回调函数。默认返回一个数组，原数组的元素执行了回调函数之后返回值若为true，则会将这个元素放入返回的数组中。

回调函数的参数：1. 处于当前循环的元素 2. 该元素下标 3. 数组本身。 三个参数均可选。

```javascript
// 筛选元素 自身乘以下标>=3的元素
let arr =[1,2,3,4,5];
let res = arr.filter( (item,index) => {
	return item*index >=3
});
console.log(arr);  // [1,2,3,4,5]
console.log(res);  // [3,4,5]
```

filter不改变原数组。

#### 四、some、every 方法

some和every方法相似，提供一个回调函数。

some方法：数组的每一个元素执行回调函数后，有一个为true,则为true;全部为false,则为false。

every方法：数组的每一个元素执行回调函数后，所有都为true,则为true；有一个为false,则为false。

回调函数的参数：1. 处于当前循环的元素 2. 该元素下标 3. 数组本身。 三个参数均可选。

```javascript
let arr=[1,2,3,4,5];
let resSome = arr.some((item)=> {
	return item > 4
});
let resEvery = arr.every( (item) => {
	return item >4
});
console.log(resSome);   // true 有至少一个元素大于4
console.log(resEvery);  // false  不是所有的元素都大于4
```

#### 五、reduce方法

reduce方法有两个参数，第一个为一个回调函数（必须），第二个为初始值（可选）。

回调函数的参数：1. 本轮循环的累计值 2. 当前循环元素（必须）3. 该元素的下标（可选） 4. 数组本身（可选）。

reduce方法，会让数组的每一个元素都执行一次回调函数，并将上一次循环时回调函数的返回值作为下一次循环的初始值，最后将这个结果返回。

如果没有初始值，则reduce会将数组的第一个元素作为循环开始的初始值，第二个元素开始执行回调函数。

```js
// 初始值为10，累加每一项元素*下标
let arr = [1,2,3,4,5];
let res = arr.reduce((val,item,index)=>{
	return val+ item*index
},10)
console.log(res);  // 50
```

reduce不改变原数组。

#### 六、for of方法

es6新增了interator接口的概念。所有有interator接口的数据，都能用for of遍历。常见的包括数组、类数组、Set、Map等。

```javascript
let arr = [1,2,3,4,5];
for (let value of arr) {
	console.log(value)
};
// 1
// 2
// 3
// 4
// 5
```

如果想用for of遍历数组，又想用index,可以for of 遍历arr.entries()

```javascript
let arr = [1,2,3,4,5];
for( let [value,index] of arr.entries()){
	console.log(value,index)
}
// 1 0
// 2 1
// 3 2
// 4 3
// 5 4
```

> end！