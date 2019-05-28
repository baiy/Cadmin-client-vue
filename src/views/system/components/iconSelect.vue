<template>
    <Modal v-model="show" fullscreen title="选择图标" footer-hide>
        <div style="text-align: center;line-height: 40px">
            <Input style="width: 500px" v-model="keyword" placeholder="输入英文关键词搜索，比如 success"></Input>
        </div>
        <Row class="icon-lists">
            <Col span="3" v-for="icon in icons" :key="icon">
                <a @click="select(icon)">
                    <Icon :type="icon" :size="38"/>
                    <p style="text-align: center">{{icon}}</p>
                </a>
            </Col>
        </Row>
    </Modal>
</template>

<script>
    import icon from './icon.js'

    export default {
        name: "iconSelect",
        data() {
            return {
                keyword: "",
                show: false
            };
        },
        props: {
            value: {
                type: String,
                default: ""
            },
        },
        computed: {
            icons() {
                let lists = [];
                if (!this.keyword) {
                    lists = icon;
                } else {
                    icon.forEach((v) => {
                        if (v.indexOf(this.keyword) !== -1) {
                            lists.push(v);
                        }
                    });
                }
                return lists;
            }
        },
        methods: {
            select(icon) {
                this.$emit('input', icon);
                this.show = false
            },
            open() {
                this.show = true
            }
        }
    }
</script>

<style scoped>
    .icon-lists{
        margin-top: 10px;
    }
    .icon-lists a {
        text-align: center;
        display: block;
        color: #5c6b77;
        padding: 10px;
    }
</style>