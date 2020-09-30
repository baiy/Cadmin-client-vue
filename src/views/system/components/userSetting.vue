<template>
  <Modal v-model="modelShow" title="用户设置" :width="500">
    <Form :label-width="80">
      <FormItem label="用户ID">
        {{userId}}
      </FormItem>
      <FormItem label="用户名">
        <Input v-model="current.username" type="text"></Input>
      </FormItem>
      <FormItem label="密码">
        <Input v-model="current.password" type="password"></Input>
      </FormItem>
      <FormItem label="重复密码">
        <Input v-model="current.repeatPassword" type="password"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" size="large" @click="save">提交</Button>
    </div>
  </Modal>
</template>

<script>
    export default {
        name: 'userSetting',
        data () {
            return {
                modelShow: false,
                userId:"",
                current: {
                    username: '',
                    password: '',
                    repeatPassword: '',
                },
            }
        },
        methods: {
            save () {
                this.$request('/current/user/setting').data(this.current).showSuccessTip().success(() => {
                    this.modelShow = false
                    this.$request("/load").success((r) => {
                        this.$store.dispatch('initialize', r.data)
                    }).get()
                }).post()
            },
            show () {
                this.current = {
                    username: '',
                    password: '',
                    repeatPassword: '',
                }
                this.current.username = this.$store.getters.getAdminUser.username
                this.userId = this.$store.getters.getAdminUser.id
                this.modelShow = true
            }
        }
    }
</script>