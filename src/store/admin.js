import {config} from '../helper'
import localStorage from "localStorage";

export default {
    state: {
        adminUser: {},
        adminMenu: [],
        adminAllUser: [],
        currentMenu: "",
    },
    getters: {
        getAdminUser(state) {
            return state.adminUser;
        },
        getAdminMenu(state) {
            return state.adminMenu;
        },
        getAdminAllUser(state) {
            return state.adminAllUser;
        },
        getCurrentMenu(state) {
            return state.currentMenu;
        },
        getCurrentMenuIds(state) {
            if (state.currentMenu){
                let ids = [state.currentMenu.id];
                let current = state.currentMenu;
                const allMenu = state.adminMenu;
                while (current.parent_id) {
                    for (let i = 0; i < allMenu.length; i++) {
                        if (current.parent_id === allMenu[i].id) {
                            ids.push(allMenu[i].id);
                            current = allMenu[i];
                            break;
                        }
                    }
                }
                return ids.reverse();
            }
            return [];
        },
    },
    mutations: {
        setAdminUser(state, user) {
            state.adminUser = user ? user : {};
        },
        setAdminAllUser(state, user) {
            state.adminAllUser = user ? user : [];
        },
        setAdminMenu(state, menu) {
            state.adminMenu = menu ? menu : [];
        },
        setCurrentMenu(state, menu) {
            state.currentMenu = menu ? menu : {};
        }
    },
    actions: {
        initialize({commit}, {user, menu, allUser}) {
            commit('setAdminUser', user);
            commit('setAdminMenu', menu);
            commit('setAdminAllUser', allUser);
        },
        logout({commit}) {
            localStorage.removeItem(config('ADMIN_TOKEN_NAME'));
            commit('setAdminUser', {});
            commit('setAdminMenu', []);
        },
        login(context, {token}) {
            localStorage.setItem(config('ADMIN_TOKEN_NAME'), token);
        },
        updateCurrentMenu({commit}, menu) {
            commit('setCurrentMenu', menu);
        },
    }
}
