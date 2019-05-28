import $ from "jquery";
import localStorage from "localStorage";
import {config, serverUrl} from "../helper"

export const request = function ({type, data, dataType, url, success, error, complete}) {
    $.ajax({
        type: type || "get",
        dataType: dataType || "json",
        data: data || {},
        url: url,
        success: function (response) {
            success && success(response)
        },
        error: function () {
            error && error();
        },
        complete: function () {
            complete && complete();
        }
    });
};

class ActionRequest {
    _type = "get";
    _action = "";
    _data = {};
    _tipSuccess = false;
    _tipError = true;
    _dataType = "json";
    _success = null;
    _error = null;
    _complete = null;

    constructor(vue) {
        this.vue = vue
    }

    static urlGenerate(action) {
        let data = {"_action": action};
        if (localStorage.getItem(config('ADMIN_TOKEN_NAME'))) {
            data["_token"] = localStorage.getItem(config('ADMIN_TOKEN_NAME'))
        }
        return serverUrl(data)
    }

    dataType(dataType) {
        this._dataType = dataType;
        return this;
    }

    action(action) {
        this._action = action;
        return this;
    }

    data(data) {
        this._data = data;
        return this;
    }

    showSuccessTip() {
        this._tipSuccess = true;
        return this;
    }

    hideErrorTip() {
        this._tipError = false;
        return this;
    }

    success(success) {
        this._success = success;
        return this;
    }

    error(error) {
        this._error = error;
        return this;
    }

    complete(complete) {
        this._complete = complete;
        return this;
    }

    get() {
        return this.execute("get");
    }

    post() {
        return this.execute("post");
    }

    execute(type) {
        this._type = type;
        request({
            type: this._type,
            dataType: this._dataType,
            data: this._data,
            url: ActionRequest.urlGenerate(this._action),
            success: (response) => {
                if (response.status === "success") {
                    if (this._tipSuccess) {
                        this.vue.$Notice.success({
                            title: "操作提示",
                            desc: response.info,
                            duration: 5
                        });
                    }
                    this['_success'] && this['_success'](response);
                } else {
                    if (this._tipError) {
                        this.vue.$Notice.error({
                            title: '错误提示',
                            desc: response.info,
                            duration: 0
                        });
                    }
                    this['_error'] && this['_error'](response);
                }
            },
            error: () => {
                this.vue.$Notice.error({title: '对不起您请求的数据不存在或者返回异常', duration: 5});
            },
            complete: () => {
                this.vue.$Loading.finish();
                this['_complete'] && this['_complete']();
            }
        });
    }
}

export const vueRequest = {
    install: function (Vue) {
        Vue.prototype.$request = function (action) {
            let actionRequest = new ActionRequest(this);
            actionRequest.action(action);
            return actionRequest
        };
    }
};
