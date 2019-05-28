import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import {adminVue} from './plugins/admin'
import {vueRequest} from './plugins/request'
import store from './store'
import router from './router'
import pageBar from './components/pageBar'
import tableLists from './components/tableLists.vue'
import App from './App.vue'

Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(adminVue);
Vue.use(vueRequest);

Vue.component('page-bar',pageBar);
Vue.component('table-lists',tableLists);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
