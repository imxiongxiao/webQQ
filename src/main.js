import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(BootstrapVue)

new Vue({
  render: h => h(App),
}).$mount('#app')
