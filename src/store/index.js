import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, setUser } from '@/utils/auth.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 所有需要公用的数据放在这里
    user: getUser() || {}
    // || 第一个有就停止 第一个没有看第二个有没有  只要有就停止
    // && 第一个有不停止 没有就停止
  },
  mutations: {
    changeUser (state, user) {
      // 设置本身的值
      Object.assign(state.user, user)
      // 并且设置本地存储
      setUser(state.user)
    }
  }
})
export default store
