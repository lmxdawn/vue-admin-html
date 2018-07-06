import 'babel-polyfill' // 兼容ie9
import Vue from 'vue'
// import '../theme/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filtres/index' // 全局过滤器
import './errorLog'// error log
import './role' // 权限
import './element'

import './assets/icons/iconfont'
import IconSvg from './components/common/IconSvg.vue'// svg组件

// import './mock' // 模拟数据

// 注册全局组件（register globally）
Vue.component('icon-svg', IconSvg)

// 注册全局实用程序过滤器（register global utility filters）.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
