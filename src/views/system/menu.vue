<template>
    <div>
        <Row :gutter="16">
            <Col span="9">
                <Card>
                    <p slot="title">菜单层级</p>
                    <Button size="small" type="primary" slot="extra" @click="add(0)">
                        <Icon type="md-add"/>
                        添加一级菜单
                    </Button>
                    <Tree :data="menu" :render="renderContent"></Tree>
                </Card>
            </Col>
            <Col span="15">
                <Card v-if="ieEditIng">
                    <p slot="title">{{current.id ? '编辑菜单' : '添加菜单'}}</p>
                    <div slot="extra">
                        <Button size="small" type="error" style="margin-right: 10px" @click="cancelSetCurrent()">放弃
                        </Button>
                        <Button size="small" type="primary" @click="saveSetCurrent()">保存</Button>
                    </div>
                    <Form :label-width="80">
                        <FormItem label="名称">
                            <Input v-model="current.name" placeholder="菜单名称"></Input>
                        </FormItem>
                        <FormItem label="父菜单ID">
                            <Input v-model="current.parent_id" placeholder="父菜单ID 0为一级菜单"></Input>
                        </FormItem>
                        <FormItem label="链接">
                            <Input v-model="current.url" placeholder="叶子节点的菜单url不能为空，非叶子节点要置空"></Input>
                        </FormItem>
                        <FormItem label="图标">
                            <Icon v-if="current.icon" :type="current.icon" size="24" style="margin-right: 10px">
                                {{current.icon}}
                            </Icon>
                            <span v-if="current.icon" style="margin-right: 10px">{{current.icon}}</span>
                            <Button @click="iconSelect()">选择</Button>
                        </FormItem>
                        <FormItem label="描述">
                            <Input v-model="current.description" placeholder=""></Input>
                        </FormItem>
                    </Form>
                </Card>
            </Col>
        </Row>
        <icon-select v-model="current.icon" ref="iconSelect"></icon-select>
    </div>
</template>
<script>
    import $ from "jquery"
    import iconSelect from '../../components/system/iconSelect.vue'

    export default {
        data() {
            return {
                lists: [],
                current: {},
                ieEditIng: false
            }
        },
        components: {
            'icon-select': iconSelect
        },
        computed: {
            menu() {
                return this.tree(this.lists, 0, 1);
            }
        },
        created() {
            this.load();
        },
        methods: {
            renderContent(h, {data, node, root}) {
                console.log(node)
                // 获取同级节点
                let brother = [];
                // 一级节点
                if (data.level === 1) {
                    root.forEach(function (value) {
                        if (value.node.level === data.level) {
                            brother.push(value.node.menu)
                        }
                    });
                } else {
                    root[node.parent].node.children.forEach(function (value) {
                        brother.push(value.menu)
                    })
                }
                let currentIndex = 0;
                brother.forEach(function (menu, k) {
                    if (menu.id === data.menu.id) {
                        currentIndex = k;
                    }
                });
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%',
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: data.menu['url'] ? 'ios-paper-outline' : 'ios-folder-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', '[' + data.menu.id + ']' + data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    }, [
                        h('Button', {
                            props: {
                                icon: 'md-arrow-round-down',
                                size: 'small',
                                disabled: brother.length === currentIndex + 1
                            },
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => {
                                    this.down(brother, currentIndex)
                                }
                            }
                        }),
                        h('Button', {
                            props: {
                                icon: 'md-arrow-round-up',
                                size: 'small',
                                disabled: currentIndex === 0
                            },
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => {
                                    this.up(brother, currentIndex)
                                }
                            }
                        }),
                        h('Button', {
                            props: {icon: 'md-create', type: 'success', size: 'small'},
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => {
                                    this.edit(data)
                                }
                            }
                        }),
                        h('Button', {
                            props: {icon: 'md-add', type: 'primary', size: 'small', disabled: data.level > 1},
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => {
                                    this.add(data.menu.id)
                                }
                            }
                        }),
                        h('Button', {
                            props: {
                                icon: 'md-remove', 
                                type: 'warning', 
                                size: 'small',
                                disabled: node.children.length > 0
                            },
                            on: {
                                click: () => {
                                    this.remove(data)
                                }
                            }
                        })
                    ])
                ]);
            },
            load() {
                let $this = this;
                this.$api('system/Menu').get('lists', {
                    success(r) {
                        $this.lists = r.data
                    },
                })
            },
            tree(menus, pid, level) {
                let $this = this;
                let menu = [];
                menus.forEach(function (item) {
                    if (item['parent_id'] === pid) {
                        menu.push({
                            menu: item,
                            title: item.name,
                            level: level,
                            expand: true,
                            children: item['url'] ? [] : $this.tree(menus, item['id'], level + 1),
                        });
                    }
                });
                return menu;
            },
            add(parent_id) {
                this.setCurrent({
                    parent_id: parent_id,
                });
            },
            edit(data) {
                this.setCurrent(data.menu);
            },
            remove(data) {
                this.$Modal.confirm({
                    title: "确认要移除当前菜单[" + data.title + "]?",
                    onOk: () => {
                        this.$api('system/Menu').post('remove', {
                            data: {id: data.menu.id},
                            success: () => {
                                this.load();
                            },
                        })
                    }
                });
            },
            setCurrent(data) {
                if (this.ieEditIng) {
                    return this.$Notice.error({title: "请先保存或放弃当前编辑/添加的菜单"});
                }
                this.current = $.extend(true, {}, data);
                this.ieEditIng = true;
            },
            cancelSetCurrent() {
                this.$Modal.confirm({
                    title: "确认要放弃当前编辑/添加的菜单?",
                    onOk: () => {
                        this.current = {};
                        this.ieEditIng = false;
                    }
                });
            },
            saveSetCurrent() {
                this.$api('system/Menu').post('save', {
                    data: this.current,
                    success: () => {
                        this.current = {};
                        this.load();
                        this.ieEditIng = false;
                    },
                })
            },
            down(brother, currentIndex) {
                let current = brother[currentIndex];
                let next = brother[currentIndex + 1];
                brother.splice(currentIndex, 1, next);
                brother.splice(currentIndex + 1, 1, current);
                let menus = brother.map(function ({id, name}, sort) {
                    return {id, sort, name}
                });
                this.$api('system/Menu').post('sort', {
                    data: {menus},
                    success: () => this.load(),
                })
            },
            up(brother, currentIndex) {
                let current = brother[currentIndex];
                let before = brother[currentIndex - 1];
                brother.splice(currentIndex, 1, before);
                brother.splice(currentIndex - 1, 1, current);
                let menus = brother.map(function ({id, name}, sort) {
                    return {id, sort, name}
                });
                this.$api('system/Menu').post('sort', {
                    data: {menus},
                    success: () => this.load(),
                })
            },
            iconSelect() {
                this.$refs.iconSelect.open();
            }
        },
    }
</script>
<style scoped>
</style>

