import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import {vueRequest} from './plugins/request'
import store from './store'
import router from './router'
import pageBar from './components/pageBar'
import tableLists from './components/tableLists'
import username from './components/username'
import authCheck from './components/authCheck'
import uploadFile from './components/uploadFile'
import fieldMap from './components/fieldMap'
import App from './App.vue'

Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(vueRequest);

Vue.component('page-bar',pageBar);
Vue.component('username',username);
Vue.component('auth-check',authCheck);
Vue.component('table-lists',tableLists);
Vue.component('upload-file',uploadFile);
Vue.component('field-map',fieldMap);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
