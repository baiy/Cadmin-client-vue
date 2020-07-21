<template>
    <div>
        <table-lists ref="tableLists" v-model="lists" :filter="filter" :filterType="2" requestApi="/system/userGroup/lists">
            <template slot="filterContent">
                <FormItem>
                    <Input type="text" v-model="filter.keyword" placeholder="搜索关键词" clearable/>
                </FormItem>
            </template>
            <template slot="filterRight">
                <Button type="success" icon="md-add" @click="add()">添加</Button>
            </template>
            <Table :columns="columns" :data="lists" stripe>
                <template slot-scope="{ row }" slot="_user">
                    <Button size="small" @click="showAssign(row,'user')">
                        用户({{row.user.length}})
                    </Button>
                </template>
                <template slot-scope="{ row }" slot="_auth">
                    <Poptip trigger="click" word-wrap transfer>
                        <Button size="small">权限({{row.auth.length}})</Button>
                        <template slot="content">
                            <div v-if="row.auth.length < 1">暂无</div>
                            <div v-for="auth in row.auth" :key="auth.id">{{auth.id}}:{{auth.name}}</div>
                        </template>
                    </Poptip>
                </template>
                <template slot-scope="{ row }" slot="op">
                    <Button size="small" type="primary" @click="edit(row)" style="margin-right: 5px">编辑</Button>
                    <Button v-if="row.id" size="small" type="error" @click="remove(row)">删除</Button>
                </template>
            </Table>
        </table-lists>
        <Modal v-model="current.show" :title="current.data['id'] ? '编辑' : '添加'" :width="500">
            <Form :label-width="80">
                <FormItem label="名称">
                    <Input v-model="current.data.name" type="text"></Input>
                </FormItem>
                <FormItem label="描述">
                    <Input v-model="current.data.description" type="textarea"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="save">提交</Button>
            </div>
        </Modal>
        <Drawer :title="assign.data.name+' 用户关联'" v-model="assign.show.user" width="900" :mask-closable="false">
            <AssignUser v-if="assign.show.user" :id="assign.data.id" @reload="reload"></AssignUser>
        </Drawer>
    </div>
</template>
<script>
    import _ from "lodash";
    import AssignUser from './components/AssignUser'
    export default {
        components: {
            AssignUser
        },
        methods: {
            add() {
                this.current.data = {};
                this.current.show = true;
            },
            edit(row) {
                this.current.data = _.cloneDeep(row);
                this.current.show = true;
            },
            remove(row) {
                this.$Modal.confirm({
                    title: "确认要删除当前[" + row.name + "]?",
                    onOk: () => {
                        this.$request("/system/userGroup/remove").data({id: row.id}).showSuccessTip().success(() => {
                            this.reload();
                        }).get()
                    }
                });
            },
            save() {
                this.$request("/system/userGroup/save").data(this.current.data).showSuccessTip().success(() => {
                    this.current.show = false;
                    this.reload();
                }).post();
            },
            reload(){
                this.$refs.tableLists.reload(true);
            },
            showAssign(row,type){
                this.assign.data = _.cloneDeep(row);
                this.assign.show[type] = true;
            },
        },
        data() {
            return {
                assign:{
                    data:{},
                    show:{
                        user:false
                    },
                },
                filter: {
                    keyword: ""
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
                        width: 150
                    },
                    {
                        title: '更新时间',
                        key: 'create_time',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '创建时间',
                        key: 'update_time',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '权限',
                        slot: '_auth',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '用户',
                        slot: '_user',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '操作',
                        slot: 'op',
                    },
                ],
                lists: [],
                current: {
                    show: false,
                    data: {},
                },
            }
        },
    }
</script>