import * as getters from './getters.js'
import * as actions from './actions.js'
import mutations from './mutations.js'

const state = {
    skuCarList: [],
    skuCarParam: {},
    skuCarPages: {},
    carSkuList: [],
    carSkuParam: {},
    carSkuPages: {},
    skuCarAllList: [],
    skuCarAllParam: {},
    skuCarAllPages: {},
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

