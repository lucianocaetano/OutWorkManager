import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem("token"),
    auth: localStorage.getItem("auth"),
    user: localStorage.getItem('user')? JSON.parse(localStorage.getItem("user")): null,
  }),
  getters: {
    getToken() {
      return this.token;
    },
    getUser() {
      return this.user;
    },
    getAuth() {
      return this.auth;
    },
    getUsers() {
      return this.users; // Nuevo getter para acceder a la lista de usuarios
    }
  },
  actions: {
    setToken(token) {
      localStorage.setItem("token", token);
      this.token = token;
    },
    setAuth(auth) {
      localStorage.setItem("auth", auth);
      if (!auth) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.token = null;
        this.user = null;
      }
      this.auth = auth;
    },
    setUser(user) {
      localStorage.setItem("user", JSON.stringify(user));
      this.user = JSON.parse(localStorage.getItem('user'));
    },
    clearSession() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.token = null;
      this.user = null;
    },
    logout() {
      this.setAuth(false); // Esto también llamará a clearSession() si auth es falso
    }  
  },
});
