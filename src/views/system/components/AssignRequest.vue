<template>
    <div>
        <table-lists ref="tableLists" v-model="data" :filter="filter" requestApi="/system/auth/getRequest">
            <template slot="filterContent">
                <FormItem>
                    <Input type="text" v-model="filter.keyword" placeholder="搜索关键词"/>
                </FormItem>
            </template>
            <Table :columns="columns" :data="data['noAssign']" stripe height="270">
                <template slot-scope="{ row }" slot="op">
                    <Button size="small" type="success" @click="add(row)">加入</Button>
                </template>
            </Table>
        </table-lists>
        <Table style="margin-top: 10px" :columns="columns" :data="data['assign']" stripe height="270">
            <template slot-scope="{row,index}" slot="op">
                <Button size="small" type="error" @click="remove(row,index)">移出</Button>
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
            id: Number,
        },
        created() {
            this.filter.id = this.id;
        },
        methods: {
            remove(row) {
                this.$request('/system/auth/removeRequest').data({
                    id: this.id,
                    requestId: row.id
                }).success(() => {
                    this.reload();
                }).get();
            },
            add(row) {
                this.$request('/system/auth/assignRequest').data({
                    id: this.id,
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