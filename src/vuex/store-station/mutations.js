import * as types from './mutation-types'

export default {
    [types.SET_STATION_TYPE](state, stationType) {
        state.stationType = stationType
    },
    [types.SET_STORE_STATION_OBJ](state, storeStationObj) {
        state.storeStationObj = storeStationObj
    },
    [types.SET_PARAMS](state, params) {
        state.params = params
    },
    [types.SET_EMP_SCHEDULING_OBJ](state, empSchedulingObj) {
        state.empSchedulingObj = empSchedulingObj
    },
    [types.SET_EMP_LIST] (state, empList) {
        state.empList = empList
    },
    [types.SET_EMP_TYPE] (state, empType) {
        state.empType = empType
    },
    [types.SET_POST_TYPE] (state, postType) {
        state.postType = postType
    },
    [types.SET_EMP_PARAMS] (state, empParams) {
        state.empParams = empParams
    },
    [types.SET_STORE_INFO] (state, storeInfo) {
        state.storeInfo = storeInfo
    },
    [types.SET_REQUIRED_STORE] (state, requiredStore) {
        state.requiredStore = requiredStore
    },
    [types.SET_EMP_STATUS] (state, empStatus) {
        state.empStatus = empStatus
    },
    [types.SET_ARRIVE_HANDLE_PARAMS] (state, arriveHandleParams) {
        state.arriveHandleParams = arriveHandleParams
    },
    [types.SET_ARRIVE_HANDLE_INFO] (state, arriveHandleInfo) {
        state.arriveHandleInfo = arriveHandleInfo
    },
    [types.SET_CARD_INFO] (state, cardInfoVo) {
        state.cardInfoVo = cardInfoVo
    },
    [types.SET_CARD_SALES_ORDER_INFO] (state, cardSalesOrderInfo) {
        state.cardSalesOrderInfo = cardSalesOrderInfo
    },
    [types.SET_RANGE_LIST] (state, rangeList) {
        state.rangeList = rangeList
    },
}