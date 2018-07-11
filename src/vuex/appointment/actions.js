import api from '../../common/api'
import * as types from './mutation-types.js'

export const setTableList = ({commit}, params) => {
    commit(types.APPOINTMENTORDERLIST_SET_LIST, params)
}
export const setSearchParam = ({commit}, params) => {
    commit(types.APPOINTMENTORDERLIST_SET__PARAM, params)
}
export const setPages = ({commit}, params) => {
    commit(types.APPOINTMENTORDERLIST_SET__PAGES, params)
}
export const getAppointmentOrderList = ({commit}, params) => {
    api.appointment.queryBookOrderInfoList(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.APPOINTMENTORDERLIST_SET__PARAM, params);          
            commit(types.APPOINTMENTORDERLIST_SET_LIST, res.data.obj.list);
            commit(types.APPOINTMENTORDERLIST_SET__PAGES, pages);
        }
    })
}

export const updateAppointmentTabList = ({commit}, params) => {
    params.pageStart = 1;
    api.appointment.queryBookOrderInfoList(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.APPOINTMENTORDERLIST_SET__PARAM, params);          
            commit(types.APPOINTMENTORDERLIST_SET_LIST, res.data.obj.list);
            commit(types.APPOINTMENTORDERLIST_SET__PAGES, pages);
        }
    })
}