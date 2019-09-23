<template>
    <Menu :active-name="active" :open-names="openNames" theme="dark" width="auto" :class="menuClass"
          @on-select="goto" :accordion="true">
        <MenuItem name="site-name">
            <Icon type="ios-home"/>
            <span>{{siteName}}</span>
        </MenuItem>
        <div v-for="menu in menus" :key="menu.id">
            <MenuItem :name="menu.id" v-if="menu.url">
                <Icon type="menu.icon"></Icon>
                <span>{{menu.name}}</span>
            </MenuItem>
            <Submenu :name="menu.id" v-else>
                <template slot="title">
                    <Icon :type="menu.icon" v-if="menu.icon"/>
                    <span>{{menu.name}}</span>
                </template>
                <div v-for="second in menu['sub_menu']" :key="second.id">
                    <MenuItem :name="second.id" v-if="second.url">
                        <Icon :type="second.icon" v-if="second.icon"></Icon>
                        <span>{{second.name}}</span>
                    </MenuItem>
                    <Submenu :name="second.id" v-else>
                        <template slot="title">
                            <Icon :type="second.icon" v-if="second.icon"/>
                            <span>{{second.name}}</span>
                        </template>
                        <div v-for="third in second['sub_menu']" :key="third.id">
                            <MenuItem :name="third.id">
                                <Icon :type="third.icon" v-if="third.icon"></Icon>
                                <span>{{third.name}}</span>
                            </MenuItem>
                        </div>
                    </Submenu>
                </div>
            </Submenu>
        </div>
    </Menu>
</template>

<script>
    import _ from "lodash";
    import { config } from '../../../helper'

    let tree = function (menus, pid) {
        let menu = [];
        menus.forEach(function (item) {
            if (item['parent_id'] === pid) {
                item['sub_menu'] = item['url'] ? [] : tree(menus, item['id']);
                menu.push(item)
            }
        });
        return menu;
    };

    export default {
        name: 'LeftMenu',
        data() {
            return {}
        },
        props: {
            menuClass: Array,
            isCollapsed: Boolean,
        },
        computed: {
            siteName() {
                return config('SITE_NAME');
            },
            menus() {
                return tree(_.cloneDeep(this.$store.getters.getAdminMenu), 0);
            },
            pageMenus() {
                let menu = [];
                this.$store.getters.getAdminMenu.forEach(function (v) {
                    if (v['url']) {
                        menu.push(v);
                    }
                });
                return menu;
            },
            openNames() {
                return !this.isCollapsed ? this.$store.getters.getCurrentMenuIds : [];
            },
            active() {
                let menu = "";
                let path = this.$route.path;
                this.pageMenus.forEach(function ({url, id}) {
                    if (url === path) {
                        menu = id;
                    }
                });
                return menu;
            }
        },
        methods: {
            goto(menuId) {
                if (menuId === "site-name") {
                    return this.$router.push('/');
                }
                this.pageMenus.forEach(({url, id}) => {
                    if (id === menuId) {
                        if (url.indexOf('://') !== -1) {
                            // 外部链接
                            return window.open(url);
                        } else {
                            return this.$router.push(url);
                        }
                    }
                });
            },
        }
    }
</script>
<style>
    .collapsed-menu .ivu-menu-submenu-title .ivu-menu-submenu-title-icon {
        display: none;
        transition: display .2s ease;
    }

    .collapsed-menu .ivu-menu {
        display: none;
        transition: display .2s ease;
    }
</style>
<style scoped>
    .menu-item span {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
        transition: width .2s ease .2s;
    }

    .menu-item i {
        transform: translateX(0px);
        transition: font-size .2s ease,
        transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }

    .collapsed-menu span {
        width: 0;
        transition: width .2s ease;
    }

    .collapsed-menu i {
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
</style>