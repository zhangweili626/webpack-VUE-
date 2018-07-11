import * as types from './mutation-types.js'

export default {
    [types.PURCHASECONTRACTLIST_SET_LIST](state, data) {
    	state.purchContractlist = data
    },
    [types.PURCHASECONTRACTLIST_SET__PARAM](state, data) {
        state.searchParam = data
    },
    [types.PURCHASECONTRACTLIST_SET__PAGES](state, data) {
        state.pages = data
    }
}