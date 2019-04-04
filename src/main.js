import Vue from 'vue'
import './plugins/iview.js'
import {adminVue} from './admin.js'
import store from './store'
import router from './router'
import listFilter from './components/common/listFilter.vue'
import tableLists from './components/common/tableLists.vue'
import App from './App.vue'

Vue.config.productionTip = false;
Vue.use(adminVue);

Vue.component('list-filter',listFilter);
Vue.component('table-lists',tableLists);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
