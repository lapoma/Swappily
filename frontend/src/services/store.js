import {createStore} from "vuex";

export default createStore({
    state: {
        isLoggedIn: !!localStorage.getItem("token"),
        authUser: {
            username: localStorage.getItem("username") || "",
            userId: localStorage.getItem('userId') || null,
            usertype: localStorage.getItem("usertype") || "user",
            token: localStorage.getItem("token") || null
        }
    },
    mutations: {
        SET_AUTH_USER(state, userData) {
            state.isLoggedIn = true;
            state.authUser = {
                username: userData.username,
                userId: userData.userId,
                usertype: userData.usertype,
                token: userData.token
            };
        },
        CLEAR_AUTH(state) {
            state.isLoggedIn = false;
            state.authUser = {
                username: "",
                userId: null,
                usertype: "user",
                token: null
            };
        }
    },
    actions: {
        login({ commit }, { token, userId, username, usertype }) {
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("username", username);
            localStorage.setItem("usertype", usertype);
            
            commit("SET_AUTH_USER", {
                token,
                userId,
                username,
                usertype
            });
        },
        logout({ commit }) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            localStorage.removeItem("usertype");
            
            commit("CLEAR_AUTH");
        }
    },
    getters: {
        currentUser: state => state.authUser,
        isAuthenticated: state => state.isLoggedIn
    }
});