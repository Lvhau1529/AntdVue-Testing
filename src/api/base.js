import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { getToken } from "@/helper/auth";

/**
 * Service to call HTTP request via Axios
 */
const http = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = process.env.VUE_APP_API_URL;
  },

  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    this.init();
    if (getToken()) {
      Vue.axios.defaults.headers["Authorization"] = `${getToken()}`;
    }
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param config
   * @returns {*}
   */
  get(resource, config) {
    this.setHeader();
    return Vue.axios.get(`${resource}`, config);
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param params
   * @param config
   * @returns {*}
   */
  post(resource, params) {
    this.setHeader();
    return Vue.axios.post(`${resource}`, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param params
   * @param config
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params, config) {
    this.setHeader();
    return Vue.axios.put(`${resource}`, params, config);
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @param config
   * @returns {*}
   */
  delete(resource, config) {
    this.setHeader();
    return Vue.axios.delete(resource, config);
  },

  /**
   * Set the UPLOAD HTTP request
   * @param resource
   * @param params
   * @returns {*}
   */
  upload(resource, params) {
    this.setHeader();
    return Vue.axios.post(`${resource}`, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default http;
