// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Bootstrap from 'bootstrap-vue'
import store from './vuex/store.js'
import common from './common/common'
import 'element-ui/lib/theme-default/index.css'
import "./assets/css/themes/default.scss";
import "./assets/iocnfont/iconfont.css";
import "./assets/iocnfont/vehicle/iconfont.css";
import "./assets/Porsche/iconfont.css";
import './assets/css/loading.css'
Vue.use(Bootstrap)
Vue.filter('pickingStatus', function (status) {
  let result = ''
  let stat = parseInt(status)
  switch (stat) {
      case 0:
          result = '未领料'; break;
      case 1:
          result = '部分领料'; break;
      case 2:
          result = '完全领料'; break;
  }
  return result
})

Vue.filter('orderSourceType', function (status) {
  let result = ''
  let stat = parseInt(status)
  switch (stat) {
      case 0:
          result = '门店散客'; break;
      case 1:
          result = '售后预约'; break;
      case 2:
          result = '销售预约'; break;
      case 3:
          result = '客服预约'; break;    
  }
  return result
})

Vue.filter('invoiceStatus', function (status) {
  let result = ''
  let stat = parseInt(status)
  switch (stat) {
      case 0:
          result = '未开票'; break;
      case 1:
          result = '已开票'; break;
  }
  return result
})

Vue.filter('paymentStatus', function (status) {
  let result = ''
  let stat = parseInt(status)
  switch (stat) {
      case 0:
          result = '未支付'; break;
      case 1:
          result = '已支付'; break;
  }
  return result
})

Vue.filter('detailStatus', function (status) {
  let result = ''
  let stat = parseInt(status)
  switch (stat) {
      case 0:
          result = '缺货'; break;
      case 1:
          result = '已备货'; break;
      case 2:
          result = '已出库'; break;     
  }
  return result
})

Vue.filter('formatDate', function(time) {
  if (time != null && time != '') {
     return common.eleTimeFormatim2(time)
  } else {
     return ''
  }
})

import api from 'common/api'
import { FACTORY_FLAG } from 'common/ref-code'

api.toLogin.getLoginInfo({}).then(res => {
  // 拿用户权限信息
  let userInfo = res.data.obj
  api.getUserAvailableInfo(msg => {
    if(msg.data.code === 'success') {
      userInfo.userAvailableInfo = msg.data.obj
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
      // 拿是否显示厂家标志位
      let params = { refDetailCode: FACTORY_FLAG }
      api.systemInit.isShowFactory(params).then(res => {
        if(res.data.code === 'success') {
          let refDetailValue = res.data.obj.refDetailValue
          sessionStorage.setItem('showFactory', refDetailValue)
          /* eslint-disable no-new */
          new Vue({
            el: '#app',
            store,
            router,
            render: h => h(App)
          })
        }
      })
    }
  })
})



