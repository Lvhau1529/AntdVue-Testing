const state = {
  selectedRowKeys: [],
};

// getters
const getters = {};

// mutations
const mutations = {
  SET_SELECTED_ROW_KEYS(state, payload) {
    state.selectedRowKeys = payload;
  },
};

// actions
const actions = {
  setSelectedRowKeys({ commit }, payload) {
    commit("SET_SELECTED_ROW_KEYS", payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
