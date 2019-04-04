<template>
    <div>
        <Tag v-for="(item,index) in assign" :key="item.id" closable @on-close="remove(item,index)">{{item.username}}
        </Tag>
        <Select ref="select" style="width: 150px" size="small"
                placeholder="请求搜索关键字"
                @on-change="add"
                filterable
                remote
                :remote-method="searchUser"
                :loading="loading">
            <Option v-for="(user,index) in options" :value="index" :key="index">{{user.username}}</Option>
        </Select>
    </div>
</template>

<script>
    export default {
        name: 'AssignUser',
        data() {
            return {
                loading: false,
                assign: [],
                keyword: "",
                options: [],
            }
        },
        props: {
            group: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        created() {
            this.assign = this.group.users;
            console.log(this.group)
        },
        methods: {
            remove(row, index) {
                this.$api('system/Authorize').get('deleteUser', {
                    data: {groupId: this.group.id, userId: row.id},
                    success: () => {
                        this.assign.splice(index, 1);
                        this.syncAssign();
                    }
                });
            },
            add(index) {
                if (this.options[index]){
                    this.$api('system/Authorize').get('addUser', {
                        data: {groupId: this.group.id, userId: this.options[index].id},
                        success: () => {
                            this.assign = this.assign.concat([this.options[index]]);
                            this.syncAssign();
                            this.$refs.select.setQuery(null)
                        }
                    });
                }
            },
            searchUser(query) {
                if (query !== '') {
                    this.loading = true;
                    this.$api('system/Authorize').get('getNotAssignUsers', {
                        data: {groupId: this.group.id, keyword: query},
                        success: (r) => {
                            this.loading = false;
                            this.options = r.data;
                        }
                    });
                } else {
                    this.options = [];
                }
            },
            syncAssign() {
                this.$emit('syncAssign', this.assign);
            }
        }
    }
</script>
<style scoped>

</style>