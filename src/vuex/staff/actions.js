import api from '../../common/api'
import * as types from './mutation-types.js'

export const setTableList = ({commit}, params) => {
    commit(types.STAFFLIST_SET_LIST, params)
}
export const setSearchParam = ({commit}, params) => {
    commit(types.STAFFLIST_SET__PARAM, params)
}
export const setPages = ({commit}, params) => {
    commit(types.STAFFLIST_SET__PAGES, params)
}
export const getStaffTablist = ({commit}, params) => {
    api.staff.search(params, function (res) {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.STAFFLIST_SET__PARAM, params)
            commit(types.STAFFLIST_SET_LIST, res.data.obj.list)
            commit(types.STAFFLIST_SET__PAGES, pages)
        }

    })
}