---
layout:     post
title:      "网站中英文切换"
date:       2020-08-26 12:00:00
author:     "monkey-yu"
header-img: "img/whale.jpg"
catalog: False
tags:
    - 实例
---

网站实现国际化，大多数开发者都会用到vue-i18n这个国际化插件。我参与的项目中没有用到这个插件，而实现的国际化功能。思路如下：

#### 1. 新建text.service.js

```javascript
// 引入中文、英文的语言包
import { ZHCNMESSAGES } from '../constants/texts/zh-cn/messages';
import { ENUSMESSAGES } from '../constants/texts/en-us/messages';
// 引入store文件
import store from '../store';

export class TextService {
  static getLanguage(){
    let lang = store.state.lang;
    if (!lang){
      return 'en-us';
    }
    return lang || 'en-us';
  }
  // 当点击切换时候调用setLanguage函数
  static setLanguage(){
    store.dispatch('commitLocalLang', lang)
  }
}
TextService.lang = TextService.getLanguage();
switch (TextService.lang){
  case 'zh-cn':
    TextService.messages = ZHCNMESSAGES;
    break;
  case 'en-us':
    TextService.messages = ENUSMESSAGES;
    break;
  default:
    TextService.messages = ZHCNMESSAGES;
    break;
}
```

#### 2. 将lang 存储在store中，便于使用

新建/store/index.ts

```typescript
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    lang:null;
  },
  actions: {
    commitLocalLang({commit},value){
      commit('updateLocalLang',value)
    }
  },
  mutations: {
    updateLocalLang(state,lang){
      state.lang =lang;
    }
  }
})
```

#### 3. 新建message.ts

```typescript
import { Messages } from '../text-interface';

export const ZHCNMESSAGES: Messages = {
  info: {
    failed: '请求失败',
    loginSuccess: '登录成功！用户信息将在7天后过期'
 	}
 }
```

#### 4.创建接口，新建text-interface.ts

```typescript
export interface Messages {
  info: {
    loginSuccess: string;
    failed: string;
  }
}
```

#### 5.在组件内引用TextService 即可