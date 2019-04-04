import $ from 'jquery';
import Vue from 'vue'
import Router from 'vue-router'
import {config} from './admin.js'

// 默认title
document.title = config('SITE_NAME');
// title 模板
const siteTitleTpl = config('SITE_TITLE_TPL');

// 路由黑名单
const blacklist = ['home', 'example'];

// 路由配置
const routes = [
    {path: '/', name: 'home', component: () => import('./views/home.vue')},
];

const requireAll = context => context.keys().map(context);

// 路由自动加载
requireAll(require.context('./views', true, /\.vue$/)).forEach(({default: item}) => {
    let name = item.__file.replace(/src\/views\//, '').replace(/.vue/, '');
    if ($.inArray(name, blacklist) === -1) {
        routes.push({
            path: '/' + name,
            name: name,
            component: item
        })
    }
});

Vue.use(Router);

const router = new Router({routes});

// title 设置
export const setTitle = function (to) {
    let title = config('SITE_NAME');
    if (router.app.$store.getters.getAdminMenu.length){
        router.app.$store.getters.getAdminMenu.forEach(item => {
            if (item.url === to.path) {
                title = siteTitleTpl.replace(/{title}/g, item.name);
                router.app.$store.dispatch('updateCurrentMenu',item);
            }
        });
    }
    document.title = title;
};

router.afterEach(to => {
    if (router.app.$store.getters.getAdminMenu.length !== 0) {
        setTitle(to)
    }
    window.scrollTo(0, 0);
});

export default router