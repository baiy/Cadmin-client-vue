<template>
    <div>
        <Alert type="warning">未配置首页地址 可以在 <code>.env</code> 中配置 <code>INDEX_URL</code></Alert>
    </div>
</template>

<script>
    export default {
        created() {
            if (this.$config('INDEX_URL')) {
                this.$router.replace(this.$config('INDEX_URL'))
            }
        },
    }
</script>
