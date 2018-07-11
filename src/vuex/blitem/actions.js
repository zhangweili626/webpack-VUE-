import api from '../../common/api'
import * as types from './mutation-types.js'

export const setTableList = ({commit}, params) => {
    commit(types.BLITEMLIST_SET_LIST, params)
}
export const setSearchParam = ({commit}, params) => {
    commit(types.BLITEMLIST_SET_PARAM, params)
}
export const setPages = ({commit}, params) => {
    commit(types.BLITEMLIST_SET_PAGES, params)
}
export const getBlitemTabList = ({commit}, params) => {
    api.blitem.getBlitemSearch(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.BLITEMLIST_SET_PARAM, params);          
            commit(types.BLITEMLIST_SET_LIST, res.data.obj.list);
            commit(types.BLITEMLIST_SET_PAGES, pages);
        }
    })
}