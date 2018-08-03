const addressInfo = {
  state:{
    address: []
  },
  getters:{
    getnameById: (state) => (id) => {
      return state.address.find(todo => todo.value === id)
    }
  },
  mutations: {
    fetchAddressInfo(state, info){
      state.address = info;
    }
  }
};

export default addressInfo;
