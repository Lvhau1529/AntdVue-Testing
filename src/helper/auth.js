import Vue from "vue";
// import store from "src/store";
// import constants from "src/constants";

const KEY_ACCESS_TOKEN = "access_token";

export function getToken() {
  return JSON.parse(localStorage.getItem(KEY_ACCESS_TOKEN));
}

export function setToken(data) {
  return localStorage.setItem(KEY_ACCESS_TOKEN, JSON.stringify(data.token));
}

export function removeToken() {
  return Vue?.prototype?.$q?.cookies?.remove(KEY_ACCESS_TOKEN, {
    path: "/",
  });
}

export function isLogged() {
  return !!getToken();
}

// export function state() {
//   return store.state;
// }

export function redirectUrl(val, target) {
  if (window) {
    window.open(val, target);
  }
}
