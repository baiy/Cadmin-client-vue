<template>
    <div>
        <table-lists ref="tableLists" v-model="lists" :filter="filter" :filterType="2" requestApi="/system/user/lists">
            <template slot="filterContent">
                <FormItem>
                    <Input type="text" v-model="filter.keyword" placeholder="搜索关键词" clearable/>
                </FormItem>
            </template>
            <template slot="filterRight">
                <Button type="success" icon="md-add" @click="add()">添加</Button>
            </template>
            <Table :columns="columns" :data="lists" stripe>
                <template slot-scope="{ row }" slot="_status">
                    {{ $fieldMapNameByValue(map.status,row.status) }}
                </template>
                <template slot-scope="{ row }" slot="_group">
                    <Button size="small" @click="relateGroupInit(row)">关联权限组({{row.groups.length}})</Button>
                </template>
                <template slot-scope="{ row }" slot="op">
                    <Button size="small" type="primary" @click="edit(row)" style="margin-right: 5px">编辑</Button>
                    <Button v-if="row.id" size="small" type="error" @click="remove(row)">删除</Button>
                </template>
            </Table>
        </table-lists>
        <Modal v-model="current.show" :title="current.data['id'] ? '编辑用户' : '添加用户'" :width="500">
            <Form :label-width="80">
                <FormItem label="用户名">
                    <Input v-model="current.data.username" type="text"></Input>
                </FormItem>
                <FormItem label="密码">
                    <Input v-model="current.data.password" type="password"></Input>
                </FormItem>
                <FormItem label="状态">
                    <Select v-model="current.data.status">
                        <Option v-for="item in map.status" :value="item.v" :key="item.v">{{ item.n }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="save">提交</Button>
            </div>
        </Modal>
        <Drawer :title="relateGroup.user.username+' 权限组关联'" v-model="relateGroup.show" width="300" :mask-closable="false">
            <RelateGroup v-if="relateGroup.show" :userid="relateGroup.user.id" @reload="reload"></RelateGroup>
        </Drawer>
    </div>
</template>
<script>
    import {userStatus} from './listsConst.js'
    import RelateGroup from './components/RelateGroup'
    import _ from "lodash";

    export default {
        components: {
            RelateGroup,
        },
        methods: {
            add() {
                this.current.data = {status: 1};
                this.current.show = true;
            },
            edit(row) {
                this.current.data = _.cloneDeep(row);
                this.current.show = true;
            },
            remove(row) {
                this.$Modal.confirm({
                    title: "确认要删除当前[" + row.username + "]请求?",
                    onOk: () => {
                        this.$request("/system/user/remove").data({id: row.id}).showSuccessTip().success(() => {
                            this.$refs.tableLists.reload(true);
                        }).get()
                    }
                });
            },
            save() {
                this.$request("/system/user/save").data(this.current.data).showSuccessTip().success(() => {
                    this.current.show = false;
                    this.$refs.tableLists.reload(true);
                }).post();
            },
            relateGroupInit(row) {
                this.relateGroup.user = _.cloneDeep(row);
                this.relateGroup.show = true;
            }
        },
        data() {
            return {
                relateGroup: {
                    show: false,
                    user: {},
                },
                map: {
                    status: userStatus
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
                        title: '用户名',
                        key: 'username',
                        width: 150
                    },
                    {
                        title: '最后登录IP',
                        key: 'last_login_ip',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '最后登录时间',
                        key: 'last_login_time',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '状态',
                        slot: '_status',
                        width: 100
                    },
                    {
                        title: '权限组',
                        slot: '_group',
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