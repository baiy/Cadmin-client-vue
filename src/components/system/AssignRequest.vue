<template>
    <div>
        <table-lists ref="tableLists" v-model="notAssign" :filter="filter" :filterType="2"
                     requestApi="system/Authorize/getNotAssignRequests">
            <template slot="filterContent">
                <Input type="text" v-model="filter.keyword" class="filter-item" placeholder="搜索关键词"/>
            </template>
            <Table :columns="columns" :data="notAssign" stripe height="270">
                <template slot-scope="{ row }" slot="type">
                    {{ $fieldMapNameByValue(map.requestType,row.type) }}
                </template>
                <template slot-scope="{ row }" slot="op">
                    <Button size="small" type="success" @click="add(row)">加入权限组</Button>
                </template>
            </Table>
        </table-lists>
        <Table style="margin-top: 10px" :columns="columns" :data="assign" stripe height="270">
            <template slot-scope="{ row }" slot="type">
                {{ $fieldMapNameByValue(map.requestType,row.type) }}
            </template>
            <template slot-scope="{row,index}" slot="op">
                <Button size="small" type="error" @click="remove(row,index)">移出权限组</Button>
            </template>
        </Table>
    </div>
</template>

<script>
    import {requestType} from '../../views/system/listsConst.js'

    export default {
        name: 'AssignRequest',
        data() {
            return {
                notAssign: [],
                assign: [],
                filter: {
                    keyword: ""
                },
                map: {requestType},
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
                        title: '类型',
                        slot: 'type',
                        width: 100,
                        align: 'center',
                    },
                    {
                        title: '值',
                        key: 'value',
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
            group: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        created() {
            this.assign = this.group.requests;
            this.filter.groupId = this.group.id;
        },
        methods: {
            remove(row, index) {
                this.$api('system/Authorize').get('deleteRequest', {
                    data: {groupId: this.group.id, requestId: row.id},
                    success: () => {
                        this.assign.splice(index, 1);
                        this.$refs.tableLists.renewLoad(true);
                        this.syncAssign();
                    }
                });
            },
            add(row) {
                this.$api('system/Authorize').get('addRequest', {
                    data: {groupId: this.group.id, requestId: row.id},
                    success: () => {
                        this.$refs.tableLists.renewLoad(true);
                        this.assign = [row].concat(this.assign);
                        this.syncAssign();
                    }
                });
            },
            syncAssign() {
                this.$emit('syncAssign', this.assign)
            }
        }
    }
</script>
<style scoped>

</style>