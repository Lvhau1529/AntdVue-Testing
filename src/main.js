import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import filters from "./filters";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./assets/styles/main.scss";
import BreadcrumbField from "./components/BreadcrumbField.vue";

Vue.config.productionTip = false;

Vue.component("BreadcrumbField", BreadcrumbField);

Vue.use(Antd);

new Vue({
  router,
  store,
  filters,
  render: (h) => h(App),
}).$mount("#app");
