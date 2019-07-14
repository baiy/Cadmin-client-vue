<template>
    <Tree ref="tree" :data="lists" show-checkbox multiple @on-check-change="change"></Tree>
</template>

<script>
    export default {
        name: 'RelateGroup',
        data() {
            return {
                lists: [],
            }
        },
        props: {
            userid: Number,
        },
        created() {
            this.load();
        },
        methods: {
            load() {
                this.$request('/system/auth/getGroupByUser').data({userid: this.userid}).success((r) => {
                    this.lists = r.data.map((group) => {
                        return {
                            expand: true,
                            title: group.name,
                            itemId: group.id,
                            checked: group.checked,
                        }
                    });
                }).get();
            },
            change() {
                let check = this.$refs.tree.getCheckedAndIndeterminateNodes();
                let request = this.$request('/system/auth/relateGroupToUser').data({
                    ids: check.map(item => {
                        return item.itemId;
                    }),
                    userid: this.userid
                }).success(() => {
                    this.$emit('reload')
                });
                if (check.length < 1) {
                    return this.$Modal.confirm({
                        title: "确定要清空当前的所有用户?",
                        onOk: () => {
                            request.post();
                        },
                        onCancel: () => {
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