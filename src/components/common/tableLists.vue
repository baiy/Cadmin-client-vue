<template>
    <div class="table-lists">
        <list-filter v-if="!hiddenFilter">
            <slot name="filterContent"></slot>
            <slot name="filterButton" v-if="filterType === 1">
                <Button type="primary" class="filter-item" @click="filterLoad()">查 询</Button>
            </slot>
            <div slot="right">
                <slot name="filterRight"></slot>
            </div>
        </list-filter>
        <slot></slot>
        <Row :gutter="16" style="margin-top: 10px">
            <Col span="8" style="min-height: 1px">
                <slot name="options"></slot>
            </Col>
            <Col span="16" style="text-align: right">
                <page @on-change="changePage" :current="page" :page-size="pageSizeData" :total="total" show-total
                      show-elevator show-sizer @on-page-size-change="pageSizeChange" :page-size-opts="[10,20,50,100,200]"></page>
            </Col>
        </Row>
    </div>
</template>

<script>
    import $ from 'jquery'

    export default {
        name: "tableLists",
        data() {
            return {
                page: 1,
                total: 0,
                result: [],
                pageSizeData:this.pageSize,
            };
        },
        props: {
            value: {
                type: Array,
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
            requestMethod: {
                type: String,
                default: "get",
            },
            requestApi: {
                type: String,
                required: true
            },
            requestOption: {
                type: Object,
                default: function () {
                    return {}
                }
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
                        this.filterLoad()
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
        mounted() {
        },
        methods: {
            changePage: function (page) {
                this.page = page;
                this.load();
            },
            pageSizeChange: function (size) {
                this.pageSizeData  = size;
                this.filterLoad();
            },
            load() {
                let $this = this;
                let ajaxOption = $.extend(true, {}, this.requestOption);
                ajaxOption.data = $.extend(true, {}, this.filter);
                ajaxOption.data.page = this.page;
                ajaxOption.data.pageSize = this.pageSizeData;

                ajaxOption.success = function (r) {
                    $this.total = r.data['total'];
                    $this.result = r.data;
                    $this.$emit('input', r.data['lists']);
                    $this.requestOption.success && $this.requestOption.success(r)
                };
                ajaxOption.error = function (r) {
                    $this.requestOption.error && $this.requestOption.error(r)
                };
                ajaxOption.type = this.requestMethod;
                this.$api(this.requestApi).ajax(ajaxOption);
            },
            filterLoad(isPage) {
                if (!isPage) {
                    this.page = 1;
                }
                this.load();
            },
            filterResult() {
                return this.result;
            },

        },
    }
</script>