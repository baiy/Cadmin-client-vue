import axios from 'axios'
import qs from 'qs'

import { actionUrl } from '../helper'
import _ from 'lodash'

export const request = function ({ type, data, dataType,contentType, url, success, error, complete }) {
    type = (type || 'get').toUpperCase()
    let config = {
        method: type || 'get',
        url: url,
        headers: { 'content-type': contentType },
        responseType: dataType || 'json'
    }
    if (_.indexOf(['POST', 'PUT', 'PATCH'], type) === -1) {
        config.params = data
    } else {
        config.data = qs.stringify(data)
    }
    axios(config).then((response) => {
        complete && complete()
        success && success(response.data)
    }).catch((e) => {
        complete && complete()
        error && error(e)
    })
}

export const requestSuccessHandle = function (vue, response, tipSuccess, tipError, success, error) {
    if (response.status === 'success') {
        if (tipSuccess) {
            vue.$Notice.success({
                title: '操作提示',
                desc: response.info,
                duration: 5
            })
        }
        success && success(response)
    } else {
        if (tipError) {
            vue.$Notice.error({
                title: '错误提示',
                desc: response.info,
                duration: 10
            })
        }
        error && error(response)
    }
}

class ActionRequest {
    _type = 'get'
    _action = ''
    _data = {}
    _tipSuccess = false
    _tipError = true
    _dataType = 'json'
    _contentType = 'application/x-www-form-urlencoded'
    _success = null
    _error = null
    _complete = null

    constructor (vue) {
        this.vue = vue
    }

    dataType (dataType) {
        this._dataType = dataType
        return this
    }

    contentType (contentType) {
        this._contentType = contentType
        return this
    }

    action (action) {
        this._action = action
        return this
    }

    data (data) {
        this._data = data
        return this
    }

    showSuccessTip () {
        this._tipSuccess = true
        return this
    }

    hideErrorTip () {
        this._tipError = false
        return this
    }

    success (success) {
        this._success = success
        return this
    }

    error (error) {
        this._error = error
        return this
    }

    complete (complete) {
        this._complete = complete
        return this
    }

    get () {
        return this.execute('get')
    }

    post () {
        return this.execute('post')
    }

    execute (type) {
        this._type = type
        request({
            type: this._type,
            dataType: this._dataType,
            contentType: this._contentType,
            data: this._data,
            url: actionUrl(this._action),
            success: (response) => {
                requestSuccessHandle(
                    this.vue,
                    response,
                    this._tipSuccess,
                    this._tipError,
                    this['_success'],
                    this['_error']
                )
            },
            error: () => {
                this.vue.$Notice.error({ title: '对不起您请求的数据不存在或者返回异常', duration: 5 })
            },
            complete: () => {
                this.vue.$Loading.finish()
                this['_complete'] && this['_complete']()
            }
        })
    }
}

export const vueRequest = {
    install: function (Vue) {
        Vue.prototype.$request = function (action) {
            let actionRequest = new ActionRequest(this)
            actionRequest.action(action)
            return actionRequest
        }
    }
}
