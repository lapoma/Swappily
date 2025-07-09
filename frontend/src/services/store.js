import {createStore} from "vuex";

export default createStore({
    state: {
    isLoggedIn: !!localStorage.getItem("username"),
    username: localStorage.getItem("username") || "",
    userId: localStorage.getItem('userId'),
    userType: localStorage.getItem("userType") || "user",
  },
  mutations: {
    setLoginState(state, { isLoggedIn, username, userId, userType }) {
      state.isLoggedIn = isLoggedIn;
      state.username = username;
      state.userId = userId;
      state.userType = userType;
    },
  },
  actions: {
    login({ commit }, user) {
      localStorage.setItem("username", user.username);
      localStorage.setItem('userId', user.userId);
      localStorage.setItem("userType", user.userType);
      commit("setLoginState", { isLoggedIn: true, username: user.username,userID: user.userId, role: user.userType });
    },
    logout({ commit }) {
      // Rimuovi il nome utente dal localStorage e aggiorna lo stato
      localStorage.removeItem("username");
      localStorage.removeItem('userId');
      localStorage.removeItem("userType");
      localStorage.removeItem("accessToken");
      commit("setLoginState", { isLoggedIn: false, username: "",userId: '', userType: "user" });
    },
  },
})