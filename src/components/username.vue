<template>
    <span>{{username}}</span>
</template>
<script>
    export default {
        name: 'username',
        props: {
            id: {
                type: [String, Number],
                default: function () {
                    return 0
                }
            },
            default: {
                type: String,
                default: function () {
                    return "未知用户"
                }
            },
        },
        computed: {
            username () {
                let id = parseInt(this.id)
                let allUser = this.$store.getters.getAdminAllUser
                let username = this.default
                allUser.forEach(user => {
                    if (user.id === id) {
                        username = user.username
                    }
                })
                return username
            },
        }
    }
</script>