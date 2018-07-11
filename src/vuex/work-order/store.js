import * as getters from './getters.js'
import * as actions from './actions.js'
import mutations from './mutations.js'

const state = {
    workOrderList: [],
    searchParam: {},
    pages: {},
    priceTypes: [],
    storeInfo: {},
    whList: [],
    openServiceInfo: {}
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

