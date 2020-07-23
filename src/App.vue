<template>
    <div id="app">
        <Login v-if="!isLogin"></Login>
        <div class="main layout" v-if="isLogin">
            <Layout>
                <Sider :style="{height: '100vh'}" ref="side1" hide-trigger collapsible :collapsed-width="80"
                       v-model="isCollapsed">
                    <LeftMenu :menuClass="menuitemClasses" :isCollapsed="isCollapsed"></LeftMenu>
                </Sider>
                <Layout>
                    <Header style="padding: 0;height:50px;line-height: 50px" class="layout-header-bar">
                        <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 10px 0 20px'}"
                              type="md-menu" size="28"></Icon>
                        <Breadcrumb class="nav">
                            <BreadcrumbItem v-for="item in nav" :key="item.id">
                                <Icon :type="item.icon"></Icon>
                                {{item.name}}
                            </BreadcrumbItem>
                        </Breadcrumb>
                        <Dropdown @on-click="selectDropdown" style="float: right;margin-right: 20px">
                            <a href="javascript:void(0)">
                                {{user.username}}
                                <Icon type="ios-arrow-down"></Icon>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="userSetting">用户设置</DropdownItem>
                                <DropdownItem name="logout">退出</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Header>
                    <Content style="margin:10px 10px 0;background: #fff;padding: 10px">
                        <router-view/>
                    </Content>
                </Layout>
            </Layout>
            <userSetting ref="userSetting"></userSetting>
        </div>
    </div>
</template>

<script>
    import Login from './views/system/components/Login.vue'
    import LeftMenu from './views/system/components/LeftMenu.vue'
    import userSetting from './views/system/components/userSetting.vue'
    import {setTitle} from './router'
    import {token} from './helper'
    import _ from 'lodash'

    export default {
        components: {
            Login,
            LeftMenu,
            userSetting
        },
        data() {
            return {
                isCollapsed: false,
            }
        },
        computed: {
            isLogin() {
                return this.$store.getters.getAdminUser.hasOwnProperty('id');
            },
            nav() {
                let menus = [];
                let ids = this.$store.getters.getCurrentMenuIds;
                for(let i = 0;i<ids.length;i++){
                    this.$store.getters.getAdminMenu.forEach((item) => {
                        if (ids[i] === item.id) {
                            menus.push(item)
                        }
                    });
                }
                return menus
            },
            user() {
                return this.$store.getters.getAdminUser;
            },
            rotateIcon() {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses() {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        created() {
        },
        mounted() {
            this.$router.onReady(() => {
                this.initialize();
            });
        },
        methods: {
            // 初始化系统
            initialize() {
                if (token()){
                    this.$request("/load").success((r) => {
                        this.$store.dispatch('initialize', r.data)
                        setTitle(this.$route)
                    }).error(() => {
                        this.$store.dispatch('logout');
                    }).complete(() => {
                        document.querySelector("#loading").remove();
                    }).get();
                }
                else{
                    document.querySelector("#loading").remove();
                }
            },
            selectDropdown(name) {
                this[name]();
            },
            logout() {
                this.$request("/logout").success(() => {
                    this.$store.dispatch('logout');
                    setTitle(this.$route)
                }).get();
            },
            userSetting() {
                this.$refs.userSetting.show();
            },
            collapsedSider() {
                this.$refs.side1.toggleCollapse();
            }
        },
    }
</script>
<style scoped>
    .layout {
        background: #f5f7f9;
        position: relative;
        overflow: hidden;
    }

    .layout-header-bar {
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    }

    .menu-icon {
        transition: all .3s;
    }

    .rotate-icon {
        transform: rotate(-90deg);
    }

    .nav {
        display: inline-block;
        width: 500px;
        vertical-align: middle;
    }
</style>