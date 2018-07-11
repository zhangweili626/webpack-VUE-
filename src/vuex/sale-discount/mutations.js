import * as types from './mutation-types.js'

export default {
    [types.SALEDISCOUNTLIST_SET_LIST](state, data) {
    	state.saleDiscountList = data
    },
    [types.SALEDISCOUNTLIST_SET__PARAM](state, data) {
        state.searchParam = data
    },
    [types.SALEDISCOUNTLIST_SET__PAGES](state, data) {
        state.pages = data
    }
}