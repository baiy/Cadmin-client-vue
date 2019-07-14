<template>
    <div>
        <table-lists ref="tableLists" v-model="lists" :filter="filter" :filterType="2" requestApi="/system/group/lists">
            <template slot="filterContent">
                <FormItem>
                    <Input type="text" v-model="filter.keyword" placeholder="搜索关键词"/>
                </FormItem>
            </template>
            <template slot="filterRight">
                <Button type="success" icon="md-add" @click="add()">添加</Button>
            </template>
            <Table :columns="columns" :data="lists" stripe>
                <template slot-scope="{ row }" slot="_request">
                    <Button size="small" @click="showAssign(row,'request')">
                        分配请求({{row['request_length']}})
                    </Button>
                </template>
                <template slot-scope="{ row }" slot="_user">
                    <Button size="small" @click="showAssign(row,'user')">
                        分配用户({{row['user_length']}})
                    </Button>
                </template>
                <template slot-scope="{ row }" slot="_menu">
                    <Button size="small" @click="showAssign(row,'menu')">
                        分配菜单({{row['menu_length']}})
                    </Button>
                </template>
                <template slot-scope="{ row }" slot="op">
                    <Button size="small" type="primary" @click="edit(row)" style="margin-right: 5px">编辑
                    </Button>
                    <Button size="small" type="error" @click="remove(row)">删除</Button>
                </template>
            </Table>
        </table-lists>
        <Drawer :title="assign.data.name+' 已关联用户'" v-model="assign.show.user" width="300" :mask-closable="false">
            <AssignUser v-if="assign.show.user" :groupId="assign.data.id"></AssignUser>
        </Drawer>
        <Drawer :title="assign.data.name+' 菜单分配'" v-model="assign.show.menu" width="300" :mask-closable="false">
            <AssignMenu v-if="assign.show.menu" :groupId="assign.data.id" @reload="reload"></AssignMenu>
        </Drawer>
        <Drawer :title="assign.data.name+' 请求分配'" v-model="assign.show.request" width="900" :mask-closable="false">
            <AssignRequest v-if="assign.show.request" :groupId="assign.data.id" @reload="reload"></AssignRequest>
        </Drawer>
        <Modal v-model="current.show" :title="current.data['id'] ? '编辑权限' : '添加权限'" :width="400" @on-ok="save">
            <Form :label-width="50">
                <FormItem label="名称">
                    <Input v-model="current.data.name" placeholder="权限名称"></Input>
                </FormItem>
            </Form>
            <template slot="footer">
                <Button type="primary" size="large" @click="save">保存</Button>
            </template>
        </Modal>
    </div>
</template>
<script>
    import AssignRequest from './components/AssignRequest'
    import AssignUser from './components/AssignUser'
    import AssignMenu from './components/AssignMenu'
    import _ from "lodash";

    export default {
        components: {
            AssignRequest,
            AssignUser,
            AssignMenu
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
                    title: "确认要删除[" + row.name + "]权限?",
                    onOk: () => {
                        this.$request('/system/group/remove').data({id: row.id}).showSuccessTip().success(() => {
                            this.$refs.tableLists.reload(false);
                        }).get();
                    }
                });
            },
            save() {
                this.$request('/system/group/save').data(this.current.data).showSuccessTip().success(() => {
                    this.$refs.tableLists.reload(true);
                    this.current.show = false;
                }).post();
            },
            showAssign(row,type){
                this.assign.data = _.cloneDeep(row);
                this.assign.show[type] = true;
            },
            reload(){
                this.$refs.tableLists.reload(true);
            }
        },
        data() {
            return {
                assign:{
                    data:{},
                    show:{
                        request:false,
                        user:false,
                        menu:false,
                    },
                },
                filter: {
                    keyword: "",
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
                        title: '创建时间',
                        key: 'create_time',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '请求',
                        slot: '_request',
                        width: 140,
                        align: 'center',
                    },
                    {
                        title: '用户',
                        slot: '_user',
                        width: 140,
                        align: 'center',
                    },
                    {
                        title: '菜单',
                        slot: '_menu',
                        width: 140,
                        align: 'center',
                    },
                    {
                        title: '操作',
                        slot: 'op',
                    },
                ],
                lists: [],
                current:{
                    show:false,
                    data:{},
                },
            }
        }
    }
</script>
