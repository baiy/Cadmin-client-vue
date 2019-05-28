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
                                <DropdownItem name="logout">退出</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Header>
                    <Content style="margin:10px 10px 0;background: #fff;padding: 10px">
                        <router-view/>
                    </Content>
                </Layout>
            </Layout>
        </div>
    </div>
</template>

<script>
    import Login from './views/system/components/Login.vue'
    import LeftMenu from './views/system/components/LeftMenu.vue'
    import {setTitle} from './router'
    import $ from 'jquery'

    export default {
        components: {
            Login,
            LeftMenu
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
                const allMenu = this.$store.getters.getAdminMenu;
                let menus = [this.$store.getters.getCurrentMenu];
                let parentId = this.$store.getters.getCurrentMenu.parent_id;
                let is = true;
                while (parentId && is) {
                    is = false;
                    for (let i = 0; i < allMenu.length; i++) {
                        if (allMenu[i].id === parentId) {
                            menus = [allMenu[i], ...menus];
                            parentId = allMenu[i].parent_id;
                            is = true;
                        }
                    }
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
                this.$request("/load").success((r) => {
                    this.$store.dispatch('initialize', r.data)
                }).error(() => {
                    this.$store.dispatch('logout');
                }).complete(() => {
                    $("#loading").remove()
                }).get();
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