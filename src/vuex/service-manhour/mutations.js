import * as types from './mutation-types'
export default {
    [types.SET_SERVICE_HOURS_OBJ](state, serviceHoursObj) {
        state.serviceHoursObj = serviceHoursObj
    },
    [types.SET_SUB_SERVICE_HOURS_LIST](state, subServiceHoursList) {
        state.subServiceHoursList = subServiceHoursList
    },
    [types.SET_MAIN_INFO](state, mainInfo) {
        state.mainInfo = mainInfo
    },
    [types.SET_CAR_INFO](state, carInfo) {
        state.carInfo = carInfo
    },
    [types.SET_QUERY_PARAMS](state, queryParams) {
        state.queryParams = queryParams
    },
}