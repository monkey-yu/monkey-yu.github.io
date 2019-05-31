---
layout:     post
title:      "Vue Router"
date:       2019-04-26 09:00:00
author:     "monkey-yu"
header-img: "img/daytime-flow.jpg"
catalog: false
tags:
    - Vue
---

> 看了遍Vue Router文档，总结出重点内容。

1. this.$router 访问路由器， this.$route访问当前路由。
2. 当 <router-link> 对应的路由匹配成功，将自动设置 class 属性值 .router-link-active。
3. 动态路由匹配：

    | 模式                          | 匹配路径            | $route.params                   |
    | ----------------------------- | ------------------- | ------------------------------- |
    | /user/:username               | /user/evan          | {username:'evan'}               |
    | /user/:username/post/:post_id | /user/evan/post/123 | {username:'evan',post_id:'123'} |

4. 动态路由中，从 /user/evan 导航到 /user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。不过，这也意味着**组件的生命周期钩子不会再被调用**。

5. 组件复用时，想对参数的变化做出响应，可以简单的watch(监测变化)$route对象：

    ```js
    const User = {   
        template: '...',   
        watch: {     
            '$route' (to, from) {       
                // 对路由变化作出响应...     
            }   
        } 
    } 
    ```

    或者使用beforeRouteUpdate导航守卫：

    ```js
    const User = {   
        template: '...',   
        beforeRouteUpdate (to, from, next) {     
            // react to route changes...     
            // don't forget to call next()   
        }
    } 
    ```


6. 404页面路由：如果想匹配任意路径，我们可以使用通配符 (*)，不过要注意通配符路由一定要放在最后。使用一个*通配符*时，$route.params 内会自动添加一个名为 pathMatch 参数。

7. 匹配优先级：

   同一个路径可以匹配多个路由，此时，匹配的优先级就按照路由的定义顺序：谁先定义的，谁的优先级就最高。

8. 路由可以多层嵌套，children配置同外层一样。

9. 编程式导航：使用this.$router.push。

   ```js
   const userId = '123' 
   // 参数： name + 参数 
   router.push({ name: 'user', params: { userId }}) // -> /user/123  
   // 参数： 完整的path 
   router.push({ path: `/user/${userId}` }) // -> /user/123 
   // 带查询参数 
   router.push({ path: 'register', query: { plan: 'private' }})   
   -> /register?plan=private 
   ```

    | 声明式                  | 编程式           |
    | ----------------------- | ---------------- |
    | <router-link :to="..."> | router.push(...) |

10. 操作history:

    router.push、 router.replace 和 router.go(n), n为整数，向前或者后退多少步 

    跟 window.history.pushState、 window.history.replaceState 和 window.history.go相同。

11. 路由命名使用：

    ```html
    <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link> 
    // 与下行代码功能相同 
    router.push({ name: 'user', params: { userId: 123 }}) 
    ```
12. 一个路由展示多个视图，不是嵌套关系：

    ```html
    <router-view class="view one"></router-view>
    <router-view class="view two" name="a"></router-view> 
    <router-view class="view three" name="b"></router-view> 
    const router = new VueRouter({   
    	routes: [     
    	{       
    		path: '/',       
    		components: {         
    			default: Foo,         
    			a: Bar,         
    			b: Baz       
    		}     
    	}   
    	] 
    }) 
    ``` 

13. 重定向：可以是一个字符串、对象、方法

    ```js
    //这里举例 对象 
    const router = new VueRouter({   
    	routes: [     
    	{ path: '/a', redirect: { name: 'foo' }}   
    	] 
    }) 
    ```
14. 路由组件传参，使用props解藕：

    ```js
    const User = {   
    	props: ['id'],   
    	template: '<div>User {{ id }}</div>' }
        const router = new VueRouter({   
        	routes: [     
        		{ path: '/user/:id', component: User, props: true },      
        		// 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：     
        		{ path: '/user/:id', components: { default: User, sidebar: Sidebar },      props: { default: true, sidebar: false }     
        		}   
        	] 
        }) 
    ```
15. HTML5 History 模式：默认是hash模式，导航不好看。不过使用history模式，后端服务器需配置，以防出错。

    ```js
    const router = new VueRouter({   mode: 'history',   routes: [...] }) 
    ```

    > 导航守卫部分，未总结，不在此博客中！后续添加。