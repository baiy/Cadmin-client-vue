<template>
    <div class="login">
        <Row style="margin-top: 150px">
            <Col span="6" offset="9">
                <Card>
                    <p slot="title">用户登录</p>
                    <Form ref="form" :model="form" :rules="rule">
                        <FormItem prop="username">
                            <Input size="large" type="text" v-model="form.username" placeholder="用户名">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input size="large" type="password" v-model="form.password" placeholder="密码">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button size="large" type="primary" long @click="handleSubmit('form')">登 录</Button>
                        </FormItem>
                    </Form>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
    import {setTitle} from '../../router'
    export default {
        name: 'Login',
        data() {
            return {
                form: {
                    username: '',
                    password: ''
                },
                rule: {
                    username: [
                        {required: true, message: '请填写用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请填写密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                let $this = this;
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        return;
                    }
                    $this.$api('system/User').post('login', {
                        data: $this.form,
                        success(r) {
                            // 设置登录
                            $this.$store.dispatch('login', r.data);
                            // 重新初始化系统
                            $this.$api('system/User').get('load', {
                                success(r) {
                                    $this.$store.dispatch('initialize', r.data);
                                    setTitle($this.$route)
                                },
                                error(r) {
                                    $this.$Notice.error({title: '系统初始化发送异常', desc: r.info, duration: 5});
                                    $this.$store.dispatch('logout');
                                }
                            });
                        }
                    });
                })
            }
        }
    }
</script>
<style scoped>
    .login {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: url(//gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg) #f0f2f5 no-repeat center 110px;
        background-size: 100%;
    }
</style>