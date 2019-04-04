import Vue from 'vue'
import App from './App.vue'
import './plugins/iview.js'
import {adminVue} from './admin.js'
import router from './router'
import store from './store'
import listFilter from './components/common/listFilter.vue'
import tableLists from './components/common/tableLists.vue'

Vue.config.productionTip = false;
Vue.use(adminVue);

Vue.component('list-filter',listFilter);
Vue.component('table-lists',tableLists);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
