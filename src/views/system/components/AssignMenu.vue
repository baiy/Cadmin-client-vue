<template>
    <Tree ref="tree" :data="menu" show-checkbox multiple @on-check-change="change"></Tree>
</template>

<script>
    import { menuSort } from '../../../helper'

    export default {
        name: 'AssignMenu',
        data() {
            return {
                menu: [],
            }
        },
        props: {
            groupId: Number,
        },
        created() {
            this.load();
        },
        methods: {
            tree(menus, pid, level) {
                let menu = [];
                menus.forEach(item => {
                    if (item['parent_id'] === pid) {
                        let data = {
                            menu: item,
                            title: item.name,
                            level: level,
                            expand: true,
                            children: item['url'] ? [] : this.tree(menus, item['id'], level + 1),
                        };
                        if (item['url'] && item.checked) {
                            data.checked = true;
                        }
                        menu.push(data);
                    }
                });
                return menu;
            },
            load() {
                this.$request('/system/auth/getMenu').data({id: this.groupId}).success((r) => {
                    this.menu = this.tree(menuSort(r.data), 0, 1);
                }).get();
            },
            change() {
                let menu = this.$refs.tree.getCheckedAndIndeterminateNodes();
                let request = this.$request('/system/auth/assignMenu').data({
                    ids: menu.map(item => {
                        return item.menu.id;
                    }),
                    groupId:this.groupId
                }).success(() => {
                    this.$emit('reload')
                });
                if (menu.length < 1) {
                    return this.$Modal.confirm({
                        title: "确定要清空当前的所有菜单?",
                        onOk: () => {
                            request.post();
                        },
                        onCancel:() => {
                            this.load();
                        },
                    });
                }
                request.post();
            },
            reload() {
                this.$emit('reload')
            }
        }
    }
</script>
<style scoped>

</style>