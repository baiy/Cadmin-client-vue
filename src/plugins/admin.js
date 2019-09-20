import {config} from "../helper"
// 后台插件注入
export const adminVue = {
    install: function (Vue) {
        // todo
        // 配置获取
        Vue.prototype.$config = function (key) {
            return config(key);
        };
        // 字段映射 // 格式:src/views/system/listsConst.js
        Vue.prototype.$fieldMapNameByValue = function (map, value) {
            for (let i = 0; i < map.length; i++) {
                if (map[i]['v'] === value) {
                    return map[i]['n'];
                }
            }
            return "";
        };

        // 用户信息
        Vue.prototype.$getAdminUserById = function (id) {
            let allUser = this.$store.getters.getAdminAllUser;
            let result = {};
            allUser.forEach(function (user) {
                if (user.id === parseInt(id)) {
                    result = user;
                }
            });
            return result
        };
    }
};
