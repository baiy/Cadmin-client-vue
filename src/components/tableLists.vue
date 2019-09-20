<template>
    <div class="table-lists">
        <page-bar v-if="!hiddenFilter">
            <slot name="filterContent"></slot>
            <slot name="filterButton" v-if="filterType === 1">
                <Button type="primary" @click="reload()">查 询</Button>
            </slot>
            <div slot="right">
                <slot name="filterRight"></slot>
            </div>
        </page-bar>
        <slot></slot>
        <page-bar style="margin-top: 10px" :rightWidth="750">
            <slot name="options"></slot>
            <div slot="right">
                <page @on-change="changePage" :current="page" :page-size="pageSizeData" :total="total" show-total
                      show-elevator show-sizer @on-page-size-change="pageSizeChange"
                      :page-size-opts="[10,20,50,100,200]"></page>
            </div>
        </page-bar>
    </div>
</template>

<script>
    import _ from 'lodash'

    export default {
        name: "tableLists",
        data() {
            return {
                page: 1,
                total: 0,
                pageSizeData: this.pageSize,
            };
        },
        props: {
            value: {
                type: [Array,Object],
                default: function () {
                    return []
                }
            },
            filter: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            pageSize: {
                type: Number,
                default: 20
            },
            requestApi: {
                type: String,
                required: true
            },
            autoLoad: {
                type: Boolean,
                default: true
            },
            hiddenFilter: {
                type: Boolean,
                default: false
            },
            // 0 不显示按钮 1 搜索按钮触发 2 筛选条件发生变化触发筛选
            filterType: {
                type: Number,
                default: 1
            }
        },
        watch: {
            filter: {
                handler: function () {
                    if (this.filterType === 2) {
                        this.reload()
                    }
                },
                deep: true
            }
        },
        created() {
            if (this.autoLoad) {
                this.load();
            }
        },
        methods: {
            changePage: function (page) {
                this.page = page;
                this.load();
            },
            pageSizeChange: function (size) {
                this.pageSizeData = size;
                this.reload();
            },
            load() {
                this.$request(this.requestApi).data({
                    offset: (this.page - 1) * this.pageSizeData,
                    pageSize: this.pageSizeData,
                    ..._.cloneDeep(this.filter)
                }).success((r) => {
                    this.total = r.data['total'];
                    this.$emit('input', r.data['lists']);
                }).get()
            },
            reload(isPage) {
                if (!isPage) {
                    this.page = 1;
                }
                this.load();
            },
        },
    }
</script>