import localStorage from "localStorage";

export const trim = function (str, char, type) {
    if (char) {
        if (type === 'left') {
            return str.replace(new RegExp('^\\' + char + '+', 'g'), '');
        } else if (type === 'right') {
            return str.replace(new RegExp('\\' + char + '+$', 'g'), '');
        }
        return str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
    }
    return str.replace(/^\s+|\s+$/g, '');
};

// 配置获取
export const config = function (key) {
    return process.env['VUE_APP_' + key];
};

export const serverUrl = function (data = {}) {
    let query = [];
    Object.keys(data).forEach((item) => {
        query.push(item + '=' + encodeURIComponent(data[item]))
    });
    return config('API_URL_PREFIX') + (query.length > 0 ? ('?' + query.join('&')) : "")
};

export const actionUrl = function (action) {
    let data = {"_action": action};
    if (localStorage.getItem(config('ADMIN_TOKEN_NAME'))) {
        data["_token"] = localStorage.getItem(config('ADMIN_TOKEN_NAME'))
    }
    return serverUrl(data)
}