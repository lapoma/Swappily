import {createStore} from "vuex";

export default createStore({
    state: {
    isLoggedIn: !!localStorage.getItem("token"),
    username: localStorage.getItem("username") || "",
    userId: localStorage.getItem('userId'),
    usertype: localStorage.getItem("usertype") || "user",
  },
  mutations: {
    setLoginState(state, { isLoggedIn, username, userId, usertype }) {
      state.isLoggedIn = isLoggedIn;
      state.username = username;
      state.userId = userId;
      state.usertype = usertype;
    },
  },
  actions: {
    login({ commit }, user) {
      localStorage.setItem("username", user.username);
      localStorage.setItem('userId', user.userId);
      localStorage.setItem("usertype", user.usertype);
      commit("setLoginState", { isLoggedIn: true, username: user.username,userID: user.userId, role: user.usertype });
    },
    logout({ commit }) {
      // Rimuovi il nome utente dal localStorage e aggiorna lo stato
      localStorage.removeItem("username");
      localStorage.removeItem('userId');
      localStorage.removeItem("usertype");
      localStorage.removeItem("token");
      commit("setLoginState", { isLoggedIn: false, username: "",userId: '', usertype: "user" });
    },
  },
})