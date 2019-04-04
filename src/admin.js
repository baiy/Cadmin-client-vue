import $ from "jquery";
import localStorage from "localStorage";

function trim(str, char, type) {
    if (char) {
        if (type === 'left') {
            return str.replace(new RegExp('^\\' + char + '+', 'g'), '');
        } else if (type === 'right') {
            return str.replace(new RegExp('\\' + char + '+$', 'g'), '');
        }
        return str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
    }
    return str.replace(/^\s+|\s+$/g, '');
}

// 配置获取
export const config = function (key) {
    return process.env['VUE_APP_' + key];
};

// 后台插件注入
export const adminVue = {
    install: function (Vue) {
        // ajax 请求
        Vue.prototype.$api = function (path) {
            let $this = this;
            let $ajax = function ({type, async, dataType, contentType, data, url, success, error, complete}) {
                if (url.indexOf("://") === -1) {
                    url = trim(config('API_URL_PREFIX'), '/') + '/' + trim(url, '/');
                }
                let token = localStorage.getItem(config('ADMIN_TOKEN_NAME'));
                if (token) {
                    url += (url.indexOf('?') === -1 ? '?' : '&') + '_token=' + token;
                }

                $this.$Loading.start();
                $.ajax({
                    type: type || "post",
                    async: typeof async === "undefined",
                    dataType: dataType || 'json',
                    contentType: contentType || 'application/x-www-form-urlencoded;charset=utf-8',
                    data: data,
                    url: url,
                    success: function (data) {
                        let notice = {title: data.info};
                        if (typeof (data.data) === "string" && !data.data) {
                            notice.desc = data.data;
                        }
                        switch (data.status) {
                            case "tip_success":
                                notice.duration = 2;
                                $this.$Notice.success(notice);
                                success && success(data);
                                break;
                            case "success":
                                success && success(data);
                                break;
                            case "tip_error":
                                notice.duration = 5;
                                $this.$Notice.error(notice);
                                error && error(data);
                                break;
                            case "error":
                                error && error(data);
                                break;
                        }
                    },
                    error: function () {
                        $this.$Notice.error({title: '对不起您请求的数据不存在', duration: 5});
                    },
                    complete: function () {
                        complete && complete();
                        $this.$Loading.finish();
                    }
                });
            };
            return {
                get(func, options) {
                    options = options || {};
                    options.type = 'get';
                    options.url = trim(path, '/') + '/' + trim(func, '/');
                    $ajax(options);
                },
                post(func, options) {
                    options = options || {};
                    options.type = 'post';
                    options.url = trim(path, '/') + '/' + trim(func, '/');
                    $ajax(options);
                },
                ajax(options) {
                    options.url = path;
                    $ajax(options);
                }
            };
        };
        // 配置获取
        Vue.prototype.$config = function(key){
            return config(key);
        };
        //
        Vue.prototype.$fieldMapNameByValue = function(map,value){
            for (let i = 0;i<map.length;i++){
                if (map[i]['v'] === value) {
                    return map[i]['n'];
                }
            }
            return "";
        }
    }
};
