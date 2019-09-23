<template>
  <span>{{desc}}</span>
</template>
<script>
    export default {
        name: 'fieldMap',
        props: {
            value: {
                type: [String, Number],
                default: function () {
                    return ''
                }
            },
            map: {
                type: Array,
                default: function () {
                    return []
                }
            },
            valueField: {
                type: String,
                default: function () { return 'v'}
            },
            descField: {
                type: String,
                default: function () { return 'n'}
            },
            default: {
                type: String,
                default: function () { return ''}
            }
        },
        computed: {
            desc () {
                let desc = this.default
                this.map.forEach(item => {
                    if (String(this.value) === String(item[this.valueField])) {
                        desc = String(item[this.descField])
                    }
                })
                return desc
            },
        }
    }
</script>