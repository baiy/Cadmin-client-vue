<template>
    <div>
        <page-bar>
            <FormItem>
                <Input type="text" placeholder="文本框" clearable/>
            </FormItem>
            <FormItem>
                <AutoComplete v-model="autoComplete.value" :data="autoComplete.data"
                              @on-search="handleSearch1"
                              placeholder="输入框搜索"
                              style="width:200px"></AutoComplete>
            </FormItem>
            <FormItem>
                <Cascader :data="cascader.data" v-model="cascader.value" placeholder="级联选择"></Cascader>
            </FormItem>
            <FormItem>
                <i-switch v-model="isSwitch">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
            </FormItem>
            <FormItem>
                <Checkbox>多选框</Checkbox>
                <Checkbox>多选框</Checkbox>
            </FormItem>
            <FormItem>
                <Radio>单选按钮</Radio>
                <Radio>单选按钮</Radio>
                <Radio>单选按钮</Radio>
                <Radio>单选按钮</Radio>
            </FormItem>
            <FormItem>
                <Select v-model="datepPicker" style="width:200px" placeholder="下拉菜单">
                    <Option v-for="(item,k) in select" :value="k" :key="k">{{ item }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem>
                <DatePicker :type="datepPicker || 'date'" :placeholder="select[datepPicker || 'date']" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem>
                <Button>查询</Button>
            </FormItem>
            <div slot="right">
                <Button type="success" icon="md-add">添加</Button>
            </div>
        </page-bar>
        <Card title="文件上传">
            <upload-file v-model="uploadFileUrl"></upload-file>
        </Card>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                uploadFileUrl:"",
                isSwitch: true,
                select: {
                    date: "日期",
                    daterange: "日期范围",
                    datetime: "日期时间",
                    datetimerange: "日期时间范围",
                    year: "年",
                    month: "月",
                },
                datepPicker: "",
                autoComplete: {
                    value: '',
                    data: []
                },
                cascader:{
                    value: [],
                    data: [{
                        value: 'beijing',
                        label: '北京',
                        children: [
                            {
                                value: 'gugong',
                                label: '故宫'
                            },
                            {
                                value: 'tiantan',
                                label: '天坛'
                            },
                            {
                                value: 'wangfujing',
                                label: '王府井'
                            }
                        ]
                    }, {
                        value: 'jiangsu',
                        label: '江苏',
                        children: [
                            {
                                value: 'nanjing',
                                label: '南京',
                                children: [
                                    {
                                        value: 'fuzimiao',
                                        label: '夫子庙',
                                    }
                                ]
                            },
                            {
                                value: 'suzhou',
                                label: '苏州',
                                children: [
                                    {
                                        value: 'zhuozhengyuan',
                                        label: '拙政园',
                                    },
                                    {
                                        value: 'shizilin',
                                        label: '狮子林',
                                    }
                                ]
                            }
                        ],
                    }]
                }
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            handleSearch1(value) {
                this.autoComplete.data = !value ? [] : [
                    value,
                    value + value,
                    value + value + value
                ];
            }
        },
    }
</script>
<style scoped>

</style>