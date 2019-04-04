<template>
    <div>
        <table-lists v-model="lists" :filter="filter" :filterType="2" requestApi="system/Request/lists">
            <template slot="filterContent">
                <Input type="text" v-model="filter.keyword" class="filter-item" placeholder="搜索关键词" clearable/>
                <Select class="filter-item" v-model="filter.type" placeholder="请选择类型" clearable>
                    <Option v-for="item in map.type" :value="item.v" :key="item.v">{{ item.n }}</Option>
                </Select>
            </template>
            <template slot="filterRight">
                <Button type="success" icon="md-add" class="filter-item" @click="add()">添加</Button>
            </template>
            <Table ref="selection" :columns="columns" :data="tableLists" stripe>
                <template slot-scope="{ row }" slot="name">
                    <Input v-if="row._edit" type="text" v-model="row.name"/>
                    <span v-else>{{ row.name }}</span>
                </template>
                <template slot-scope="{ row }" slot="type">
                    <Select v-if="row._edit" v-model="row.type">
                        <Option v-for="item in map.type" :value="item.v" :key="item.v">{{ item.n }}</Option>
                    </Select>
                    <span v-else>{{ $fieldMapNameByValue(map.type,row.type) }}</span>
                </template>
                <template slot-scope="{ row }" slot="value">
                    <Input v-if="row._edit" type="text" v-model="row.value"/>
                    <span v-else>{{ row.value }}</span>
                </template>
                <template slot-scope="{ row }" slot="_Authorize">
                    <Button v-if="row.groups" size="small" @click="viewGroup(row)">{{row.groups.length}}个权限</Button>
                </template>
                <template slot-scope="{ row ,index}" slot="op">
                    <template v-if="row._edit">
                        <Button size="small" type="error" @click="waive(row,index)" style="margin-right: 5px">放弃
                        </Button>
                        <Button size="small" type="success" @click="save(row,index)">保存</Button>
                    </template>
                    <template v-else>
                        <Button size="small" type="primary" @click="row._edit=true" style="margin-right: 5px">编辑
                        </Button>
                        <Button v-if="row.id" size="small" type="error" @click="remove(row,index)">删除</Button>
                    </template>
                </template>
            </Table>
        </table-lists>
        <Modal v-model="groupView.isShow" title="关联权限查看" footer-hide :width="800">
            <Table :columns="groupView.columns" :data="groupView.data" stripe>
            </Table>
        </Modal>
    </div>
</template>
<script>
    import $ from 'jquery'
    import {requestType} from './listsConst.js'

    export default {
        data() {
            return {
                groupView: {
                    isShow: false,
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
                    type: ""
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
                        slot: 'name',
                        width: 200
                    },
                    {
                        title: '类型',
                        slot: 'type',
                        width: 150
                    },
                    {
                        title: '值',
                        slot: 'value',
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
                        width: 150
                    },
                ],
                lists: [],
                tableLists: []
            }
        },
        watch: {
            lists: {
                handler() {
                    this.tableLists = $.extend([], true, this.lists).map((item) => {
                        item._edit = false;
                        return item;
                    });
                },
                deep: true
            }
        },
        methods: {
            add() {
                this.tableLists = [{id: 0, _edit: true, type: 2}].concat(this.tableLists)
            },
            remove(row, index) {
                this.$Modal.confirm({
                    title: "确认要删除当前[" + row.name + "]请求?",
                    onOk: () => {
                        this.$api('system/Request').get('remove', {
                            data: {id: row.id},
                            success: () => {
                                this.tableLists.splice(index, 1);
                            }
                        });

                    }
                });
            },
            waive(row, index) {
                if (row.id) {
                    row._edit = false;
                } else {
                    this.tableLists.splice(index, 1);
                }
            },
            save(row, index) {
                this.$api('system/Request').post('save', {
                    data: {
                        id: row.id || 0,
                        type: row.type,
                        name: row.name,
                        value: row.value
                    },
                    success: (r) => {
                        row.id = r.data.id;
                        row._edit = false;
                        this.tableLists.splice(index, 1, row);
                    }
                });
            },
            viewGroup(row) {
                this.groupView.data = row.groups.map(({id, name, users}) => {
                    return {
                        id,
                        name,
                        users: users.map(({username}) => {
                            return username
                        }).join(',')
                    }
                });
                this.groupView.isShow = true
            },
        },
    }
</script>
<style scoped>

</style>
