import { boot } from "quasar/wrappers";
import axios from "axios";
import { useUserStore } from "src/store/user.store";
import {api_base_backend} from "src/helpers.js";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: api_base_backend+'/api/v1' });

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

api.interceptors.request.use(function (config) {
  const userStore = useUserStore();

  if (userStore.getToken) {
    config.headers.Authorization = `Bearer ${userStore.getToken}`;
  }

  return config;
});

api.interceptors.response.use(
  function (config) {
    return config;
  },
  function (error) {
    const userStore = useUserStore();

    if (error?.response?.status === 401) {
      userStore.setAuth(false);
      window.location.href = '/login';
    } 

    return Promise.reject(error);
  }
);
export { api };
