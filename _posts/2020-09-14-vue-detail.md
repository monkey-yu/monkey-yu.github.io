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



