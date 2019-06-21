import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
    // 引入home 路由
    // 给路由组建起个名，这样如果锚点地址太长的话，就使用 this.$router.push({name:'r-home
    // '})来调用
    name: 'r-home',
    path: '/',
    component: () => import('@/views/home')

  }, {
    // 引入login路由
    name: 'r-login',
    path: '/login',
    component: () => import('@/views/login/')
  }]
})
