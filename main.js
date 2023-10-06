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
	console.log('@',options)
	// 判断请求的是否为有权限的 API 接口
	if(options.url.indexOf('/my') !== -1) {
		// 为请求头添加身份认证字段
		options.header = {
			// 字段的值可以直接从 vuex 中进行获取
			Authorization:store.state.m_user.token
		}
	}
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