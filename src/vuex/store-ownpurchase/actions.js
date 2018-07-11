import api from '../../common/api'
import * as types from './mutation-types.js'

// 门店自采管理
export const setOwnPurchaseTableList = ({commit}, params) => {
    commit(types.OWNPURCHASE_SET_LIST, params)
}
export const setOwnPurchaseSearchParam = ({commit}, params) => {
    commit(types.OWNPURCHASE_SET__PARAM, params)
}
export const setOwnPurchasePages = ({commit}, params) => {
    commit(types.OWNPURCHASE_SET__PAGES, params)
}
export const setOwnPurchaseAddSkuList = ({commit}, params) => {
    commit(types.OWNPURCHASE_SET__AdDDSKULIST, params)
}
export const setspoOrderNo = ({commit}, params) => {
    commit(types.OWNPURCHASE_SET__ORDERNO, params)
}
export const getOwnPurchaseTabList = ({commit}, params) => {
    api.ownPurchase.search(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.OWNPURCHASE_SET__PARAM, params);          
            commit(types.OWNPURCHASE_SET_LIST, res.data.obj.list);
            commit(types.OWNPURCHASE_SET__PAGES, pages);
        }
    })
}