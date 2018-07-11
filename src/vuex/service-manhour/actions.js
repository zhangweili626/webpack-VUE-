import api from 'common/api'
import * as types from './mutation-types'

export const getServiceHoursObj = ({ commit }, params) => {
    api.serviceHours.pagingQuery(params).then(res => {
        if (res.data.code === 'success') {
            let obj = res.data.obj;
            commit(types.SET_SERVICE_HOURS_OBJ, obj)  
        }
    })
}

export const getSubServiceHoursList = ({ commit }, params) => {
    api.serviceHours.querySub(params).then(res => {
        if (res.data.code === 'success') {
            let obj = res.data.obj;
            commit(types.SET_SUB_SERVICE_HOURS_LIST, obj)  
        }
    })
}

export const setInsertParams = ({ commit }, params) => {
    commit(types.SET_MAIN_INFO, params.mainInfo)  
    commit(types.SET_CAR_INFO, params.carInfo)  
}