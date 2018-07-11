import * as types from './mutation-types.js'

export default {
    [types.CARDPAYLIST_SET_LIST](state, data) {
    	state.cardPayList = data
    },
    [types.CARDPAYLIST_SET__PARAM](state, data) {
        state.searchParam = data
    },
    [types.CARDPAYLIST_SET__PAGES](state, data) {
        state.pages = data
    }
}