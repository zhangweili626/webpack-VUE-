import * as getters from './getters.js'
import * as actions from './actions.js'
import mutations from './mutations.js'

const state = {
    // 门店自采管理
    ownPurchaseTabList: [],
    ownPurchaseParam: {},
    ownPurchasePages: {},
    addSkuList:[],
    spoOrderNo: ''
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

