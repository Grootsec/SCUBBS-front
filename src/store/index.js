import Vue from 'vue'
import Vuex from 'vuex'
import userinfo from "./modules/info"
import addressInfo from "./modules/addressInfo"
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
      info: userinfo,
      addressInfo: addressInfo,
    }
  });
export default store;
