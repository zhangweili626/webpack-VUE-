import * as types from './mutation-types.js'

export default {
    [types.WORKORDERLIST_SET_LIST](state, data) {
    	state.workOrderList = data
    },
    [types.WORKORDERLIST_SET__PARAM](state, data) {
        state.searchParam = data
    },
    [types.WORKORDERLIST_SET__PAGES](state, data) {
        state.pages = data
    },
    [types.SET_PRICE_TYPE](state, priceTypes) {
        state.priceTypes = priceTypes
    },
    [types.SET_STORE_INFO](state, storeInfo) {
        state.storeInfo = storeInfo
    },
    [types.SET_WH_LIST](state, whList) {
        state.whList = whList
    },
    [types.SET_OPEN_SERVICE](state, openServiceInfo) {
        state.openServiceInfo = openServiceInfo
    },
}