### 项目初始化
```
npm install
```

### 本地开发
```
npm run serve
```

### 项目编译
```
npm run build
```

### 项目配置
```ini
./.env
// 前端 `localStorage` token存储key名
VUE_APP_ADMIN_TOKEN_NAME = 'admin_token'
// 后端api请求前缀,即服务端注册的api入口地址 前后端域名不同时填写绝对地址
VUE_APP_API_URL_PREFIX = ''
// 后台首页地址
VUE_APP_INDEX_URL = '/'
// 后台项目名称
VUE_APP_SITE_NAME = '后台管理'
// 后台 title 模板
VUE_APP_SITE_TITLE_TPL = '{title} - 后台管理'
```

### 对应服务端项目
<https://github.com/baiy/admin-service>

> 服务端内置`Thinkphp`/`Laravel`框架支持

### 更多配置选项
查看 [https://cli.vuejs.org](https://cli.vuejs.org/config/).
