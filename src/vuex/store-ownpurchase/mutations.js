import * as types from './mutation-types.js'

export default {
    // 门店自采管理
    [types.OWNPURCHASE_SET_LIST](state, data) {
    	state.ownPurchaseTabList = data
    },
    [types.OWNPURCHASE_SET__PARAM](state, data) {
        state.ownPurchaseParam = data
    },
    [types.OWNPURCHASE_SET__PAGES](state, data) {
        state.ownPurchasePages = data
    },
    [types.OWNPURCHASE_SET__AdDDSKULIST](state, data) {
        state.addSkuList = data
    },
    [types.OWNPURCHASE_SET__ORDERNO](state, data) {
        state.spoOrderNo = data
    }
}