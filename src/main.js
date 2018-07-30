import Vue from 'vue'
import App from './App'
import config from './config'

Vue.config.productionTip = false
App.mpType = 'app'
var Fly = require('flyio/dist/npm/wx')
var fly = new Fly()
// 设置超时
fly.config.timeout = 10000
fly.config.baseURL = config.baseUrl
// 添加请求拦截器
fly.interceptors.request.use((request) => {
  // 给所有请求添加自定义header
  request.headers['X-Tag'] = 'flyio'
  request.headers['Content-Type'] = 'application/json'
})

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
    if (response.data.status !== 0) {
      wx.showToast({
        title: response.data.msg,
        icon: 'none',
        duration: 2000
      })
    }
    // 只将请求结果的data字段返回
    return response.data.data
  },
  (err) => {
    // 发生网络错误后会走到这里
    // return Promise.resolve("ssss")
    console.log(err)
    wx.showToast({
      title: '加载出错',
      icon: 'none',
      duration: 2000
    })
  }
)
// 将fly实例挂在vue原型上
Vue.prototype.$http = fly
Vue.prototype.api = config.serverApi

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/index/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#EA5149',
      navigationBarTitleText: '蜗牛读书',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      selectedColor: '#EA5149',
      list: [{
        pagePath: 'pages/index/main',
        text: '书城',
        iconPath: '/static/img/book.png',
        selectedIconPath: '/static/img/book-active.png'
      }, {
        pagePath: 'pages/comment/main',
        text: '评论',
        iconPath: '/static/img/todo.png',
        selectedIconPath: '/static/img/todo-active.png'
      }, {
        pagePath: 'pages/my/main',
        text: '我的',
        iconPath: '/static/img/me.png',
        selectedIconPath: '/static/img/me-active.png'
      }]
    }
  }
}
