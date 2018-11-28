import Vue from 'vue'
import App from './App.vue'
import SuiVue from 'semantic-ui-vue'
import VueRouter from 'vue-router'

import Asset from './components/Asset'

Vue.use(SuiVue)
Vue.use(VueRouter)
Vue.config.productionTip = false

const router = new VueRouter({
  // mode: 'history',
  routes: [{
    path: '/:symbol',
    component: Asset,
    props: true
  },{
    path: '/',
    component: Asset,
    props: false
  },{
    path: '*',
    redirect: '/'
  }]
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
