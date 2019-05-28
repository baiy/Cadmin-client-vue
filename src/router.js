import $ from 'jquery';
import Vue from 'vue'
import Router from 'vue-router'
import {config, trim} from './helper'

// 默认title
document.title = config('SITE_NAME');
// title 模板
const siteTitleTpl = config('SITE_TITLE_TPL');

// 路由配置
const routes = [
    {path: '/', name: 'index', component: () => import('./views/index.vue')},
];

// 路由自动加载
const routeComponent = require.context(
    './views',
    true,
    /\.vue$/
);

routeComponent.keys().forEach(fileName => {
    // 过滤组件
    if (fileName.indexOf('components/') !== -1 || fileName === "index") {
        return;
    }
    const path = '/' + trim(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'), '/', 'left');
    routes.push({
        path: path,
        name: path,
        component: routeComponent(fileName).default
    })
});

Vue.use(Router);

const router = new Router({routes});

// title 设置
export const setTitle = function (to) {
    let title = config('SITE_NAME');
    let currentMenu = {};
    if (router.app.$store.getters.getAdminMenu.length) {
        router.app.$store.getters.getAdminMenu.forEach(item => {
            if (item.url === to.path) {
                title = siteTitleTpl.replace(/{title}/g, item.name);
                currentMenu = $.extend(true, {}, item);
            }
        });
    }
    router.app.$store.dispatch('updateCurrentMenu', currentMenu);
    document.title = title;
};

router.afterEach(to => {
    if (router.app.$store.getters.getAdminMenu.length !== 0) {
        setTitle(to)
    }
    window.scrollTo(0, 0);
});

export default router