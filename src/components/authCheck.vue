<template>
  <div style="display: inline">
    <template v-if="is">
        <slot></slot>
    </template>
    <template v-else>
      <slot name="without"></slot>
    </template>
  </div>
</template>
<script>
    export default {
        name: 'authCheck',
        props: {
            action: {
                type: String,
                default: function () {
                    return ''
                }
            }
        },
        computed: {
            is () {
                let is = false
                this.$store.getters.getAdminRequest.forEach(item => {
                    if (item.action === this.action) {
                        is = true
                    }
                })
                return is
            }
        }
    }
</script>