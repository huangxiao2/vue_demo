import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import qs from 'qs'
import TreeTable from 'vue-table-with-tree-grid'

Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)
// 设置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:9090/'
Vue.config.productionTip = false

// 设置axios 请求拦截器
axios.interceptors.request.use(function (config) {
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  // 设置axios的token令牌
  config.headers.Authorization = window.sessionStorage.getItem('token')
  config.transformRequest = [function (data) {
    // 请求参数更改为FormData形式
    data = qs.stringify(data)
    return data
  }]
  return config
}, function (error) {
  return Promise.reject(error)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
