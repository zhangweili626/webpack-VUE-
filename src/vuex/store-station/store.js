import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
    stationType: [],
    storeStationObj: {},
    params: {
        pageStart: 1
    },
    
    empSchedulingObj: [],
    empList: [],
    empType: [],
    postType: [],
    empParams: {},
    storeInfo: {},
    requiredStore: false,

    arriveHandleParams: {},
    arriveHandleInfo: {},

    cardInfoVo: {},
    rangeList: [],
    cardSalesOrderInfo: {}
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}