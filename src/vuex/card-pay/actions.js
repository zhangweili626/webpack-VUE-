import api from '../../common/api'
import * as types from './mutation-types.js'

export const setTableList = ({commit}, params) => {
    commit(types.CARDPAYLIST_SET_LIST, params)
}
export const setSearchParam = ({commit}, params) => {
    commit(types.CARDPAYLIST_SET__PARAM, params)
}
export const setPages = ({commit}, params) => {
    commit(types.CARDPAYLIST_SET__PAGES, params)
}
export const getCardPayTabList = ({commit}, params) => {
    api.cardPay.search(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.CARDPAYLIST_SET__PARAM, params);          
            commit(types.CARDPAYLIST_SET_LIST, res.data.obj.list);
            commit(types.CARDPAYLIST_SET__PAGES, pages);
        }
    })
}

export const updateCardPayTabList = ({commit}, params) => {
    params.pageStart = 1;
    api.cardPay.search(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.CARDPAYLIST_SET__PARAM, params);          
            commit(types.CARDPAYLIST_SET_LIST, res.data.obj.list);
            commit(types.CARDPAYLIST_SET__PAGES, pages);
        }
    })
}