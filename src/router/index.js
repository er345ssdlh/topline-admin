import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   // 在整个项目中，模块路径中的 @ 表示的是 src 目录
    //   // 无论你当前模块在哪里，@ 都可以直接定位到 src
    //   // 加载一个目录可以默认加载它的 index.js、index.vue、index.json。。。
    //   component: () => import('@/views/home')
    // },
    { // layout 显示到 App 根组件的路由出口
      // name: 'layout', // 使用 JavaScript 命名路由导航不会渲染默认子路由
      path: '/',
      component: () => import('@/views/layout'),
      // 嵌套路由：https://router.vuejs.org/zh/guide/essentials/nested-routes.html
      // 所有 children 路由都显示到父路由的 router-view 中
      children: [
        {
          name: 'r-home',
          path: '', // 父路由的默认内容
          component: () => import('@/views/home')
        },
        {
          name: 'r-article',
          path: '/article',
          component: () => import('@/views/article/')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
