import Vue from 'vue'
import App from './App.vue'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
import router from '@/router'
import store from '@/store'
import helpers from '@/helpers'


window.helpers = helpers;

Vue.config.productionTip = false

// Vue.prototype.$http = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
