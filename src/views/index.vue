<template>
    <div>
        <Alert type="success">默认后台首页地址 可以在 <code>.env</code> 中配置 <code>INDEX_URL</code></Alert>
        <Button type="primary" @click="$router.push('/example')">例子页面</Button>
    </div>
</template>

<script>
    import { config } from '../helper'

    export default {
        created() {
            if (config('INDEX_URL') !== "/") {
                this.$router.replace(config('INDEX_URL'))
            }
        },
    }
</script>
