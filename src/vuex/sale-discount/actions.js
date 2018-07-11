import api from '../../common/api'
import * as types from './mutation-types.js'

export const setTableList = ({commit}, params) => {
    commit(types.SALEDISCOUNTLIST_SET_LIST, params)
}
export const setSearchParam = ({commit}, params) => {
    commit(types.SALEDISCOUNTLIST_SET__PARAM, params)
}
export const setPages = ({commit}, params) => {
    commit(types.SALEDISCOUNTLIST_SET__PAGES, params)
}
export const geSaleDiscountList = ({commit}, params) => {
    api.saleDiscount.search(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.SALEDISCOUNTLIST_SET__PARAM, params);          
            commit(types.SALEDISCOUNTLIST_SET_LIST, res.data.obj.list);
            commit(types.SALEDISCOUNTLIST_SET__PAGES, pages);
        }
    })
}

export const updateSaleDiscountTabList = ({commit}, params) => {
    params.pageStart = 1;
    api.saleDiscount.search(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.SALEDISCOUNTLIST_SET__PARAM, params);          
            commit(types.SALEDISCOUNTLIST_SET_LIST, res.data.obj.list);
            commit(types.SALEDISCOUNTLIST_SET__PAGES, pages);
        }
    })
}