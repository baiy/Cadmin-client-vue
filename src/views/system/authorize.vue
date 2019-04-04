<template>
    <div>
        <table-lists v-model="lists" :filter="filter" :filterType="2" requestApi="system/Authorize/lists">
            <template slot="filterContent">
                <Input type="text" v-model="filter.keyword" class="filter-item" placeholder="搜索关键词"/>
            </template>
            <template slot="filterRight">
                <Button type="success" icon="md-add" class="filter-item" @click="add()">添加</Button>
            </template>
            <Table :columns="columns" :data="tableLists" stripe>
                <template slot-scope="{ row }" slot="name">
                    <Input v-if="row._edit" type="text" v-model="row.name"/>
                    <span v-else>{{ row.name }}</span>
                </template>
                <template slot-scope="{ row ,index}" slot="_request">
                    <Button v-if="row.requests" size="small" @click="assignRequest(row,index)">
                        分配请求({{row.requests.length}})
                    </Button>
                </template>
                <template slot-scope="{ row ,index}" slot="_user">
                    <Button v-if="row.users" size="small" @click="assignUser(row,index)">
                        分配用户({{row.users.length}})
                    </Button>
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
        <Modal v-model="userView.isShow" :title="userView.title" footer-hide>
            <AssignUser v-if="userView.isShow" :group="userView.group" @syncAssign="assignUserSync"></AssignUser>
        </Modal>
        <Modal v-model="requestView.isShow" :title="requestView.title" footer-hide :width="1000"
               :styles="{top: '20px'}">
            <AssignRequest v-if="requestView.isShow" :group="requestView.group"
                           @syncAssign="assignRequestSync"></AssignRequest>
        </Modal>
    </div>
</template>
<script>
    import $ from 'jquery'
    import {requestType} from './listsConst.js'
    import AssignRequest from '../../components/system/AssignRequest.vue'
    import AssignUser from '../../components/system/AssignUser.vue'

    export default {
        components: {
            'AssignRequest': AssignRequest,
            'AssignUser': AssignUser,
        },
        data() {
            return {
                userView: {
                    title: "",
                    isShow: false,
                    group: {},
                    _index: 0,
                },
                requestView: {
                    title: "",
                    isShow: false,
                    group: {},
                    _index: 0,
                },
                map: {requestType},
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
                        return item;
                    });
                },
                deep: true
            }
        },
        methods: {
            add() {
                this.tableLists = [{id: 0, _edit: true}].concat(this.tableLists)
            },
            remove(row, index) {
                this.$Modal.confirm({
                    title: "确认要删除当前[" + row.name + "]请求?",
                    onOk: () => {
                        this.$api('system/Authorize').get('remove', {
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
                this.$api('system/Authorize').post('save', {
                    data: {
                        id: row.id || 0,
                        name: row.name,
                    },
                    success: (r) => {
                        row.id = r.data.id;
                        row._edit = false;
                        this.tableLists.splice(index, 1, row);
                    }
                });
            },
            assignUser(row, index) {
                this.userView.group = $.extend({}, true, row);
                this.userView._index = index;
                this.userView.isShow = true;
                this.userView.title = '[' + row.name + '] 用户分配';
            },
            assignUserSync(assign) {
                let group = this.tableLists[this.userView._index];
                group.users = assign;
                this.tableLists.splice(this.userView._index, 1, group);
            },
            assignRequest(row, index) {
                this.requestView.group = $.extend({}, true, row);
                this.requestView._index = index;
                this.requestView.isShow = true;
                this.requestView.title = '[' + row.name + '] 请求分配';
            },
            assignRequestSync(assign) {
                let group = this.tableLists[this.requestView._index];
                group.requests = assign;
                this.tableLists.splice(this.requestView._index, 1, group);
            },
        },
    }
</script>
<style scoped>

</style>
