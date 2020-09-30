import Vue from 'vue'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import { vueRequest } from './plugins/request'
import store from './store'
import router from './router'
import pageBar from './components/pageBar'
import tableLists from './components/tableLists'
import username from './components/username'
import authCheck from './components/authCheck'
import uploadFile from './components/uploadFile'
import fieldMap from './components/fieldMap'
import fieldSelect from './components/fieldSelect'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(ViewUI)
Vue.use(vueRequest)

Vue.component('page-bar', pageBar)
Vue.component('username', username)
Vue.component('auth-check', authCheck)
Vue.component('table-lists', tableLists)
Vue.component('upload-file', uploadFile)
Vue.component('field-map', fieldMap)
Vue.component('field-select', fieldSelect)

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
