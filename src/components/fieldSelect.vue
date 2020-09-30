<template>
  <Select :value="value" :style="{width:selectWidth}" :placeholder="defaultDesc" @on-change="changePage" transfer>
    <Option :value="defaultValue">{{ defaultDesc }}</Option>
    <Option v-for="item in map" :value="item[valueField]" :key="item[valueField]">{{ item[descField] }}</Option>
  </Select>

</template>
<script>
    export default {
        name: 'fieldSelect',
        props: {
            value: {
                type: [String, Number],
                default: function () {
                    return ''
                },
            },
            map: {
                type: Array,
                default: function () {
                    return []
                },
            },
            valueField: {
                type: String,
                default: function () { return 'v'},
            },
            descField: {
                type: String,
                default: function () { return 'n'},
            },
            defaultDesc: {
                type: String,
                default: function () {
                    return '请选择选项'
                },
            },
            defaultValue: {
                type: [String, Number],
                default: function () {
                    return ''
                },
            },
            width: {
                type: [Number, String],
                default: function () {
                    return '100%'
                },
            },
        },
        computed: {
            selectWidth () {
                if (!isNaN(this.width)) {
                    return this.width + 'px'
                }
                return this.width
            },
        },
        methods: {
            changePage (value) {
                this.$emit('input', value)
            },
        },
    }
</script>