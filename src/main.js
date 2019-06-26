import Vue from 'vue'
import App from './App.vue'
import router from './router/'
// 全局使用
// 总结：第三方包如果带有视图的在引入他的时候还要引入css
// 他的包已经处理了内部有export default 可以用这种引入方法
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入axios
import axios from 'axios'
import 'nprogress/nprogress.css'
// 全局配置css
import '@/styles/index.css'
// 本地存储
import { getUser, removeUser } from '@/utils/auth'
// 优化：配置基础路径
axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0'
// 添加请求拦截器
axios.interceptors.request.use(config => {
  const user = JSON.parse(getUser())
  if (user) {
    // 如果能获取到user的本地存储
    config.headers.Authorization = `Bearer ${user.token}`
    // 这时候所有的接口 请求头都有Authorization
  }
  return config
  // 允许通过开关
}, (error) => {
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(response => {
  return response
}, (error) => {
  console.log(error)
  // 响应401 说明是伪造的 先把他本地存储删除，再把页面跳转login
  if (error.response.status === 401) {
    removeUser()
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})
// 用外网
// 'http://ttapi.research.itcast.cn/mp/v1_0'
// 配置好的局域网用
// toutiao.course.itcast.cn/mp/v1_0
// axios频繁使用  我们可以给Vue实例设置一个共有属性就可以，这个属性值要加上$ 防止与
// 实例对象的数据发生冲突
Vue.prototype.$http = axios
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
