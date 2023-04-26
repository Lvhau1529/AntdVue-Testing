import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedRowKeys: [],
  },
  getters: {},
  mutations: {
    SET_SELECTED_ROW_KEYS(state, payload) {
      state.selectedRowKeys = payload;
    },
  },
  actions: {
    setSelectedRowKeys(context, payload) {
      context.commit("SET_SELECTED_ROW_KEYS", payload);
    },
  },
  modules: {},
});
