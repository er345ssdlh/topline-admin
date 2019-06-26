import Vue from 'vue'
import Router from 'vue-router'
import nprogress from 'nprogress'
// 获取登录信息，按需引入
import { getUser } from '../utils/auth'

Vue.use(Router)

const router = new Router({
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
router.beforeEach((to, from, next) => {
  nprogress.start()
  // 路由导航前，先进性判断
  // 本地存储的登录账号信息，可以进行一下优化
  // const userinfo = window.localStorage.getItem('userInfo')
  const userinfo = getUser()
  // 非登陆页面
  if (to.path !== '/login') {
    // 如果没有登录信息
    if (!userinfo) {
      alert('请先登录')
      if (from.path === '/login') {
        nprogress.done()
      }
      next({ name: 'login' })
    } else {
      // 登录了
      next()
    }
  } else {
    // 登录了页面
    if (userinfo) {
      next({ name: 'r-home' })
      window.location.reload()
    } else {
      next()
    }
  }
})
router.afterEach((to, from) => {
// 路由导航完成
  nprogress.done()
})
export default router
