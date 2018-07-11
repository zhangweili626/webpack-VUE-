import * as types from './mutation-types.js'

export default {
    [types.SKUCARLIST_SET_LIST](state, data) {
    	state.skuCarList = data
    },
    [types.SKUCARLIST_SET__PARAM](state, data) {
        state.skuCarparam = data
    },
    [types.SKUCARLIST_SET__PAGES](state, data) {
        state.skuCarPages = data
    },

    [types.CARSKULIST_SET_LIST](state, data) {
    	state.carSkuList = data
    },
    [types.CARSKULIST_SET__PARAM](state, data) {
        state.carSkuparam = data
    },
    [types.CARSKULIST_SET__PAGES](state, data) {
        state.carSkuPages = data
    },

    [types.SKUCARALLLIST_SET_LIST](state, data) {
    	state.skuCarAllList = data
    },
    [types.SKUCARALLLIST_SET__PARAM](state, data) {
        state.skuCarAllparam = data
    },
    [types.SKUCARALLLIST_SET__PAGES](state, data) {
        state.skuCarAllPages = data
    }
}