import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import api from "./api/index.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/style/main.less";
import { config } from "@/utils/cfg_data_tree.js";

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$config = config;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
