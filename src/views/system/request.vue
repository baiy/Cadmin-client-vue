<template>
  <div>
    <table-lists ref="tableLists" v-model="lists" :filter="filter" :filterType="2" requestApi="/system/request/lists">
      <template slot="filterContent">
        <FormItem>
          <Input type="text" v-model="filter.keyword" placeholder="搜索关键词" clearable/>
        </FormItem>
      </template>
      <template slot="filterRight">
        <Button type="success" icon="md-add" @click="add()">添加</Button>
      </template>
      <Table ref="selection" :columns="columns" :data="lists" stripe>
        <template slot-scope="{ row }" slot="type">
          <field-map :value="row.type" :map="type"></field-map>
        </template>
        <template slot-scope="{ row }" slot="_action">
          <Tooltip :content="row.call" :max-width="500">
            {{row.action}}
          </Tooltip>
        </template>
        <template slot-scope="{ row }" slot="_auth">
          <Poptip trigger="click" word-wrap transfer>
            <Button size="small">权限({{row.auth.length}})</Button>
            <template slot="content">
              <div v-if="row.auth.length < 1">暂无</div>
              <div v-for="auth in row.auth" :key="auth.id">{{auth.id}}:{{auth.name}}</div>
            </template>
          </Poptip>
        </template>
        <template slot-scope="{ row}" slot="op">
          <Button size="small" type="primary" @click="edit(row)" style="margin-right: 5px">编辑</Button>
          <Button size="small" type="error" @click="remove(row)" style="margin-right: 5px">删除</Button>
          <Button size="small" @click="copy(row)">复制</Button>
        </template>
      </Table>
    </table-lists>
    <Modal v-model="current.show" :title="current.data['id'] ? '编辑' : '添加'" :width="800">
      <Form :label-width="80">
        <FormItem label="名称">
          <Input v-model="current.data.name"></Input>
        </FormItem>
        <FormItem label="ACTION">
          <Input v-model="current.data.action"></Input>
        </FormItem>
        <FormItem label="类型">
          <Select v-model="current.data.type">
            <Option v-for="item in type" :value="item.v" :key="item.v">{{ item.n }}</Option>
          </Select>
        </FormItem>
        <FormItem label="类型配置">
          <Input v-model="current.data['call']" type="textarea"></Input>
        </FormItem>
        <FormItem label="类型说明" v-if="currentTypeDescription">
            <div v-html="currentTypeDescription"></div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" @click="save">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
    import _ from 'lodash'

    export default {
        computed: {
            type () {
                return this.requestType.map((item) => {
                    return { v: item.type, n: item.name }
                })
            },
            currentTypeDescription () {
                let description = "";
                this.requestType.forEach((item)=>{
                    if (item.type === this.current.data.type){
                        description = item.description
                    }
                })
                return description
            }
        },
        created () {
            this.$request('/system/request/type').success((r) => {
                this.requestType = r.data
            }).get()
        },
        methods: {
            add () {
                this.current.data = { type: 'default' }
                this.current.show = true
            },
            copy ({ type, name, action, call }) {
                this.current.data = { type, name, action, call }
                this.current.show = true
            },
            edit (row) {
                this.current.data = _.cloneDeep(row)
                this.current.show = true
            },
            remove (row) {
                this.$Modal.confirm({
                    title: '确认要删除[' + row.name + ']?',
                    onOk: () => {
                        this.$request('/system/request/remove').data({ id: row.id }).showSuccessTip().success(() => {
                            this.reload()
                        }).get()
                    }
                })
            },
            save () {
                this.$request('/system/request/save').data(this.current.data).showSuccessTip().success(() => {
                    this.reload()
                    this.current.show = false
                }).post()
            },
            reload () {
                this.$refs.tableLists.reload(true)
            }
        },
        data () {
            return {
                requestType: [],
                filter: {
                    keyword: '',
                },
                columns: [
                    {
                        type: 'ID',
                        key: 'id',
                        width: 70,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name',
                        width: 260
                    },
                    {
                        title: '类型',
                        slot: 'type',
                        width: 150
                    },
                    {
                        title: 'action',
                        slot: '_action',
                    },
                    {
                        title: '创建时间',
                        key: 'create_time',
                        align: 'center',
                        width: 200
                    },
                    {
                        title: '权限',
                        slot: '_auth',
                        width: 80
                    },
                    {
                        title: '操作',
                        slot: 'op',
                        width: 200
                    },
                ],
                lists: [],
                current: {
                    show: false,
                    data: {},
                },
            }
        },
    }
</script>