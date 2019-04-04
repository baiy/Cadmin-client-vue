<template>
    <div>
        <table-lists ref="tableLists" v-model="lists" :filter="filter" :filterType="2" requestApi="system/Log/lists">
            <template slot="filterContent">
                <Input type="text" v-model="filter.keyword" class="filter-item" placeholder="搜索url关键词" clearable/>
                <Input type="text" v-model="filter.userid" class="filter-item" placeholder="后台用户ID" clearable/>
            </template>
            <template slot="filterRight">
                <Button type="error" icon="md-remove-circle" class="filter-item" @click="clear()">清空日志
                </Button>
            </template>
            <Table :columns="columns" :data="lists" stripe>
                <template slot-scope="{ row }" slot="op">
                    <Button size="small" type="primary" @click="details(row)">详情</Button>
                </template>
            </Table>
        </table-lists>
        <Drawer title="日志详情" v-model="views.show" :width="1000">
            <Form>
                <FormItem label="请求数据" label-position="top">
                    <Input type="textarea" v-model="views.request" :rows="8"/>
                </FormItem>
                <FormItem label="响应数据" label-position="top">
                    <Input type="textarea" v-model="views.response" :rows="8"/>
                </FormItem>
                <FormItem label="SQL语句" label-position="top">
                    <Input type="textarea" v-model="views.sql" :rows="8"/>
                </FormItem>
            </Form>
        </Drawer>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                views: {
                    show: false,
                    sql: "",
                    request: "",
                    response: "",
                },
                filter: {
                    keyword: "",
                    userid: ""
                },
                columns: [
                    {
                        type: 'ID',
                        key: 'id',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '用户ID',
                        key: 'admin_user_id',
                        width: 100
                    },
                    {
                        title: 'url',
                        key: 'url',
                        width: 300
                    },
                    {
                        title: '请求方法',
                        key: 'method',
                        width: 400
                    },
                    {
                        title: '时间',
                        key: 'create_time',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '查看',
                        slot: 'op',
                    },
                ],
                lists: [],
            }
        },
        methods: {
            clear() {
                this.$Modal.confirm({
                    title: "确认要清空所有日志?",
                    onOk: () => {
                        this.$api('system/Log').get('clear', {
                            success: () => {
                                this.$refs.tableLists.renewLoad(true);
                            }
                        });
                    }
                });
            },
            details(row) {
                this.views.sql = JSON.stringify(row.sql, null, 4);
                this.views.request = JSON.stringify(row.request, null, 4);
                this.views.response = JSON.stringify(row.response, null, 4);
                this.views.show = true;
            }
        }
    }
</script>
<style scoped>

</style>
