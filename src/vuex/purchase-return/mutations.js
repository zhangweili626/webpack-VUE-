import * as types from './mutation-types.js'

export default {
    [types.PURCHASERETURNLIST_SET_LIST](state, data) {
    	state.purchaseReturnList = data
    },
    [types.PURCHASERETURNLIST_SET__PARAM](state, data) {
        state.searchParam = data
    },
    [types.PURCHASERETURNLIST_SET__PAGES](state, data) {
        state.pages = data
    }
}