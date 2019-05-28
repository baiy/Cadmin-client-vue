<template>
    <div>
        <table-lists ref="tableLists" v-model="lists" :filter="filter" :filterType="2" requestApi="/system/request/lists">
            <template slot="filterContent">
                <FormItem>
                    <Input type="text" v-model="filter.keyword" placeholder="搜索关键词" clearable/>
                </FormItem>
            </template>
            <template slot="filterRight">
                <Button type="success" icon="md-add" @click="add()">添加</Button>
            </template>
            <Table ref="selection" :columns="columns" :data="lists" stripe>
                <template slot-scope="{ row }" slot="type">
                    {{ $fieldMapNameByValue(map.type,row.type) }}
                </template>
                <template slot-scope="{ row }" slot="_action">
                    <Tooltip :content="row.call" :max-width="500">
                        {{row.action}}
                    </Tooltip>
                </template>
                <template slot-scope="{ row }" slot="_Authorize">
                    <Button v-if="row.groups" size="small" @click="viewGroup(row)">{{row.groups.length}}个权限</Button>
                </template>
                <template slot-scope="{ row}" slot="op">
                    <Button size="small" type="primary" @click="edit(row)" style="margin-right: 5px">编辑</Button>
                    <Button size="small" type="error" @click="remove(row)" style="margin-right: 5px">删除</Button>
                    <Button size="small" @click="copy(row)">复制</Button>
                </template>
            </Table>
        </table-lists>
        <Modal v-model="groupView.show" title="关联权限查看" footer-hide :width="800">
            <Table :columns="groupView.columns" :data="groupView.data" stripe>
            </Table>
        </Modal>
        <Modal v-model="current.show" :title="current.data['id'] ? '编辑请求' : '添加请求'" :width="800">
            <Form :label-width="80">
                <FormItem label="名称">
                    <Input v-model="current.data.name" placeholder="请求名称"></Input>
                </FormItem>
                <FormItem label="ACTION">
                    <Input v-model="current.data.action"></Input>
                </FormItem>
                <FormItem label="类型">
                    <Select v-model="current.data.type">
                        <Option v-for="item in map.type" :value="item.v" :key="item.v">{{ item.n }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="类型配置">
                    <Input v-model="current.data['call']"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" size="large" @click="save">提交</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import $ from 'jquery'
    import {requestType} from './listsConst'

    export default {
        methods: {
            add() {
                this.current.data = {type:1};
                this.current.show = true;
            },
            copy({type,name,action,call}) {
                this.current.data = {type,name,action,call};
                this.current.show = true;
            },
            edit(row) {
                this.current.data = $.extend(true, {}, row);
                this.current.show = true;
            },
            remove(row) {
                this.$Modal.confirm({
                    title: "确认要删除[" + row.name + "]?",
                    onOk: () => {
                        this.$request('/system/request/remove').data({id:row.id}).showSuccessTip().success(()=>{
                            this.$refs.tableLists.reload(false);
                        }).get();
                    }
                });
            },
            save() {
                this.$request('/system/request/save').data(this.current.data).showSuccessTip().success(()=>{
                    this.$refs.tableLists.reload(true);
                    this.current.show = false;
                }).post();
            },
            viewGroup(row) {
                this.groupView.data = row.groups.map(({id, name, uids}) => {
                    return {
                        id,
                        name,
                        users: uids.map((id) => {
                            return this.$getAdminUserById(id)['username'];
                        }).join(',')
                    }
                });
                this.groupView.show = true
            }
        },
        data() {
            return {
                groupView: {
                    show: false,
                    data: [],
                    columns: [
                        {
                            type: 'ID',
                            key: 'id',
                            width: 70,
                            align: 'center'
                        },
                        {
                            title: '权限名称',
                            key: 'name',
                            width: 240
                        },
                        {
                            title: '关联用户',
                            key: 'users',
                        },
                    ]
                },
                map: {
                    type: requestType
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
                        width: 260
                    },
                    {
                        title: '类型',
                        slot: 'type',
                        width: 150
                    },
                    {
                        title: 'ACTION',
                        slot: '_action',
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '权限',
                        slot: '_Authorize',
                        width: 80
                    },
                    {
                        title: '操作',
                        slot: 'op',
                        width: 200
                    },
                ],
                lists: [],
                current:{
                    show:false,
                    data:{},
                },
            }
        },
    }
</script>