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
// 优化：配置基础路径
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
// axios频繁使用  我们可以给Vue实例设置一个共有属性就可以，这个属性值要加上$ 防止与
// 实例对象的数据发生冲突
Vue.prototype.$http = axios
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
