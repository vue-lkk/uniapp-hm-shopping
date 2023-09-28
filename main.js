import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import { $http } from '@escook/request-miniprogram'
// 1. 导入 store 的实例对象
import store from '@/store/store.js'

Vue.config.productionTip = false
App.mpType = 'app'
uni.$http = $http
// 配置请求路径
// $http.baseUrl = 'https://www.uinav.com'
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
	uni.showLoading({
		title:'数据加载中...'
	})
}

$http.afterRequest = function (){
	uni.hideLoading()
}

// 封装 uni.$showMsg() 方法
uni.$showMsg = function (title="数据加载失败", duration=1000){
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}

const app = new Vue({
  ...App,
	// 2. 将 store 挂载到 Vue 实例上
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif