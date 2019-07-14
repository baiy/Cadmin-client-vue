<template>
    <div>
        <table-lists ref="tableLists" v-model="data" :filter="filter" requestApi="/system/auth/getRequest">
            <template slot="filterContent">
                <FormItem>
                    <Input type="text" v-model="filter.keyword" placeholder="搜索关键词"/>
                </FormItem>
            </template>
            <Table :columns="columns" :data="data[0]" stripe height="270">
                <template slot-scope="{ row }" slot="op">
                    <Button size="small" type="success" @click="add(row)">加入权限组</Button>
                </template>
            </Table>
        </table-lists>
        <Table style="margin-top: 10px" :columns="columns" :data="data[1]" stripe height="270">
            <template slot-scope="{row,index}" slot="op">
                <Button size="small" type="error" @click="remove(row,index)">移出权限组</Button>
            </template>
        </Table>
    </div>
</template>

<script>
    export default {
        name: 'AssignRequest',
        data() {
            return {
                data: [],
                filter: {
                    keyword: "",
                    id: 0,
                },
                columns: [
                    {
                        type: 'ID',
                        key: 'id',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name',
                        width: 200
                    },
                    {
                        title: 'ACTION',
                        key: 'action',
                    },
                    {
                        title: '操作',
                        slot: 'op',
                        width: 140,
                    },
                ]
            }
        },
        props: {
            groupId: Number,
        },
        created() {
            this.filter.id = this.groupId;
        },
        methods: {
            remove(row) {
                this.$request('/system/auth/removeRequest').data({
                    groupId: this.groupId,
                    requestId: row.id
                }).success(() => {
                    this.reload();
                }).get();
            },
            add(row) {
                this.$request('/system/auth/assignRequest').data({
                    groupId: this.groupId,
                    requestId: row.id
                }).success(() => {
                    this.reload();
                }).get();
            },
            reload() {
                this.$refs.tableLists.reload(true);
                this.$emit('reload')
            }
        }
    }
</script>