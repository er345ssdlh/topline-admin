import Vue from 'vue'
import App from './App.vue'
import router from './router/'

// 全局使用
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 全局配置css
import '@/styles/index.css'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
