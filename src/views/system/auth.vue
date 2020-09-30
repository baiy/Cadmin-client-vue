<template>
    <div>
        <table-lists ref="tableLists" v-model="lists" :filter="filter" :filterType="2" requestApi="/system/auth/lists">
            <template slot="filterContent">
                <FormItem>
                    <Input type="text" v-model="filter.keyword" placeholder="搜索关键词"/>
                </FormItem>
            </template>
            <template slot="filterRight">
                <Button type="success" icon="md-add" @click="add()">添加</Button>
            </template>
            <Table :columns="columns" :data="lists" stripe border>
                <template slot-scope="{ row }" slot="_request">
                    <Button size="small" @click="showAssign(row,'request')">
                        关联请求({{row.request.length}})
                    </Button>
                </template>
                <template slot-scope="{ row }" slot="_userGroup">
                    <Button size="small" @click="showAssign(row,'userGroup')">
                        关联用户组({{row.userGroup.length}})
                    </Button>
                </template>
                <template slot-scope="{ row }" slot="_menu">
                    <Button size="small" @click="showAssign(row,'menu')">
                        关联菜单({{row.menu.length}})
                    </Button>
                </template>
                <template slot-scope="{ row }" slot="op">
                    <Button size="small" type="primary" @click="edit(row)" style="margin-right: 5px">编辑
                    </Button>
                    <Button size="small" type="error" @click="remove(row)">删除</Button>
                </template>
            </Table>
        </table-lists>
        <Drawer :title="assign.data.name+' 菜单关联'" v-model="assign.show.menu" width="300" :mask-closable="false">
            <AssignMenu v-if="assign.show.menu" :id="assign.data.id" @reload="reload"></AssignMenu>
        </Drawer>
        <Drawer :title="assign.data.name+' 请求关联'" v-model="assign.show.request" width="900" :mask-closable="false">
            <AssignRequest v-if="assign.show.request" :id="assign.data.id" @reload="reload"></AssignRequest>
        </Drawer>
        <Drawer :title="assign.data.name+' 用户组关联'" v-model="assign.show.userGroup" width="900" :mask-closable="false">
            <AssignUserGroup v-if="assign.show.userGroup" :id="assign.data.id" @reload="reload"></AssignUserGroup>
        </Drawer>
        <Modal v-model="current.show" :title="current.data['id'] ? '编辑' : '添加'" :width="400" @on-ok="save">
            <Form :label-width="50">
                <FormItem label="名称">
                    <Input v-model="current.data.name" type="text"></Input>
                </FormItem>
                <FormItem label="描述">
                    <Input v-model="current.data.description" type="textarea"></Input>
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
    import AssignUserGroup from './components/AssignUserGroup'
    import AssignMenu from './components/AssignMenu'
    import _ from "lodash";

    export default {
        components: {
            AssignRequest,
            AssignUserGroup,
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
                    title: "确认要删除[" + row.name + "]?",
                    onOk: () => {
                        this.$request('/system/auth/remove').data({id: row.id}).showSuccessTip().success(() => {
                            this.reload()
                        }).get();
                    }
                });
            },
            save() {
                this.$request('/system/auth/save').data(this.current.data).showSuccessTip().success(() => {
                    this.reload()
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
                        userGroup:false,
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
                        slot: '_userGroup',
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
