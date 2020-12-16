import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    course_len:0
  },
  mutations: {
    add_cart(state,data){
      state.course_len=data
    }
  },
  actions: {
  },
  modules: {
  }
})
