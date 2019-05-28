<template>
    <Tree ref="tree" :data="user" show-checkbox multiple @on-check-change="change"></Tree>
</template>

<script>
    export default {
        name: 'AssignUser',
        data() {
            return {
                user: [],
            }
        },
        props: {
            groupId: Number,
        },
        created() {
            this.load();
        },
        methods: {
            load() {
                this.$request('/system/authorize/getUserAssign').data({id: this.groupId}).success((r) => {
                    this.user = r.data.map((user)=>{
                        return {
                            expand: true,
                            title: user.username,
                            userId: user.id,
                            checked: user.checked,
                        }
                    });
                }).get();
            },
            change() {
                let user = this.$refs.tree.getCheckedAndIndeterminateNodes();
                let request = this.$request('/system/authorize/assignUser').data({
                    ids: user.map(item => {
                        return item.userId;
                    }),
                    groupId:this.groupId
                }).success(() => {
                    this.$emit('reload')
                });
                if (user.length < 1) {
                    return this.$Modal.confirm({
                        title: "确定要清空当前的所有用户?",
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