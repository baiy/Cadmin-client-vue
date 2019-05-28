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