<template>
    <div class="filter-con">
        <slot></slot>
        <div class="filter-con-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "listFilter"
    }
</script>

<style scoped>
    .filter-con-right{
        float: right;
    }
    .filter-con {
        min-height: 42px;
        padding: 0 0 10px 0;;
    }
    .filter-con .filter-item{
        display: inline-block;
        width: 150px;
        margin-left: 2px;
    }
    .filter-con .filter-item.ivu-btn{
        width: auto;
    }
</style>