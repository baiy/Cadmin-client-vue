<template>
    <Tree :data="user"></Tree>
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
                this.$request('/system/auth/getUserByGroup').data({groupId: this.groupId}).success((r) => {
                    this.user = r.data.map((user)=>{
                        return {
                            expand: true,
                            title: user.username,
                            userId: user.id
                        }
                    });
                }).get();
            },
        }
    }
</script>