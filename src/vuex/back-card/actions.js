import api from '../../common/api'
import * as types from './mutation-types.js'

export const setTableList = ({commit}, params) => {
    commit(types.BACKCARDLIST_SET_LIST, params)
}
export const setSearchParam = ({commit}, params) => {
    commit(types.BACKCARDLIST_SET__PARAM, params)
}
export const setPages = ({commit}, params) => {
    commit(types.BACKCARDLIST_SET__PAGES, params)
}
export const getBackCardTabList = ({commit}, params) => {
    api.returnCard.queryCardRefundOrderInfo(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.BACKCARDLIST_SET__PARAM, params);          
            commit(types.BACKCARDLIST_SET_LIST, res.data.obj.list);
            commit(types.BACKCARDLIST_SET__PAGES, pages);
        }
    })
}

export const updateBackCardTabList = ({commit}, params) => {
    params.pageStart = 1;
    api.returnCard.queryCardRefundOrderInfo(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.BACKCARDLIST_SET__PARAM, params);          
            commit(types.BACKCARDLIST_SET_LIST, res.data.obj.list);
            commit(types.BACKCARDLIST_SET__PAGES, pages);
        }
    })
}