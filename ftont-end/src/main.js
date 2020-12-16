import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//axios配置
import axios from 'axios'
Vue.prototype.$axios = axios;
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './static/js/gt.js'
//视频播放
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

Vue.config.productionTip = false

Vue.use(Element);
import "./static/css/global.css"

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
