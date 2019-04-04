import {config} from '../admin'
import localStorage from "localStorage";

export default {
    state: {
        adminUser: {},
        adminMenu: [],
        currentMenu: "",
    },
    getters: {
        getAdminUser(state) {
            return state.adminUser;
        },
        getAdminMenu(state) {
            return state.adminMenu;
        },
        getCurrentMenu(state) {
            return state.currentMenu;
        },
    },
    mutations: {
        setAdminUser(state, user) {
            state.adminUser = user ? user : {};

        },
        setAdminMenu(state, menu) {
            state.adminMenu = menu ? menu : [];
        },
        setCurrentMenu(state, menu) {
            state.currentMenu = menu ? menu : {};
        }
    },
    actions: {
        initialize({commit}, {user, menu}) {
            commit('setAdminUser', user);
            commit('setAdminMenu', menu);
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
