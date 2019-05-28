<template>
    <div class="lists-filter">
        <Layout :style="{background:'none'}">
            <Content>
                <Form inline>
                    <slot></slot>
                </Form>
            </Content>
            <Sider hide-trigger :style="{background:'none'}" :width="rightWidth" style="text-align: right">
                <slot name="right"></slot>
            </Sider>
        </Layout>
    </div>
</template>

<script>
    export default {
        name: "pageBar",
        props: {
            rightWidth: {
                type: [Number, String],
                default: 100
            },
        },
    }
</script>

<style>
    .lists-filter .ivu-layout.ivu-layout-has-sider>.ivu-layout, .lists-filter .ivu-layout.ivu-layout-has-sider>.ivu-layout-content{
        overflow-x: visible;
    }
    .lists-filter .ivu-form-item{
        margin-bottom: 10px;
    }
</style>