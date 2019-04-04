<template>
    <div>
        <table-lists v-model="lists" :filter="filter" :filterType="2" requestApi="system/User/lists">
            <template slot="filterContent">
                <Input type="text" v-model="filter.keyword" class="filter-item" placeholder="搜索关键词" clearable/>
            </template>
            <template slot="filterRight">
                <Button type="success" icon="md-add" class="filter-item" @click="add()">添加</Button>
            </template>
            <Table :columns="columns" :data="tableLists" stripe>
                <template slot-scope="{ row }" slot="username">
                    <Input v-if="row._edit" type="text" v-model="row.username"/>
                    <span v-else>{{ row.username }}</span>
                </template>
                <template slot-scope="{ row }" slot="password">
                    <Input v-if="row._edit" type="text" v-model="row.password"/>
                </template>
                <template slot-scope="{ row }" slot="_status">
                    <Select v-if="row._edit" v-model="row.status">
                        <Option v-for="item in map.status" :value="item.v" :key="item.v">{{ item.n }}</Option>
                    </Select>
                    <span v-else>{{ $fieldMapNameByValue(map.status,row.status) }}</span>
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
        <Modal v-model="groupView.isShow" title="关联权限查看" footer-hide>
            <Tag v-for="item in groupView.data" :key="item.id">{{item.name}}</Tag>
        </Modal>
    </div>
</template>
<script>
    import $ from 'jquery'
    import {userStatus} from './listsConst.js'

    export default {
        data() {
            return {
                groupView: {
                    isShow: false,
                    data: [],
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
                        slot: 'username',
                        width: 150
                    },
                    {
                        title: '密码',
                        slot: 'password',
                        width: 150
                    },
                    {
                        title: '最后登录IP',
                        key: 'lastloginip',
                        align: 'center',
                        width: 150
                    },
                    {
                        title: '最后登录时间',
                        key: 'lastlogintime',
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
                        title: '权限',
                        slot: '_Authorize',
                        align: 'center',
                        width: 120
                    },
                    {
                        title: '操作',
                        slot: 'op',
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
                        item.password = "";
                        return item;
                    });
                },
                deep: true
            }
        },
        methods: {
            add() {
                this.tableLists = [{id: "", _edit: true, status: 1}].concat(this.tableLists);
            },
            remove(row, index) {
                this.$Modal.confirm({
                    title: "确认要删除当前[" + row.username + "]请求?",
                    onOk: () => {
                        this.$api('system/User').get('remove', {
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
            save(row,index) {
                this.$api('system/User').post('save', {
                    data: {
                        id: row.id || 0,
                        username: row.username,
                        password: row.password,
                        status: row.status
                    },
                    success:(r)=> {
                        row.id = r.data.id;
                        row._edit = false;
                        this.tableLists.splice(index, 1, row);
                    }
                });
            },
            viewGroup(row) {
                this.groupView.data = row.groups.map(({id, name}) => {
                    return {
                        id,
                        name
                    }
                });
                this.groupView.isShow = true
            },
        },
    }
</script>
<style scoped>

</style>
