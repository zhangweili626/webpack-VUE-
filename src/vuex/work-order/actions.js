import api from '../../common/api'
import * as types from './mutation-types.js'
import { getType } from 'common/api-common'

export const setTableList = ({commit}, params) => {
    commit(types.WORKORDERLIST_SET_LIST, params)
}
export const setSearchParam = ({commit}, params) => {
    commit(types.WORKORDERLIST_SET__PARAM, params)
}
export const setPages = ({commit}, params) => {
    commit(types.WORKORDERLIST_SET__PAGES, params)
}
export const getWorkOrderList = ({commit}, params) => {
    api.purchaseReturn.search(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.WORKORDERLIST_SET__PARAM, params);          
            commit(types.WORKORDERLIST_SET_LIST, res.data.obj.list);
            commit(types.WORKORDERLIST_SET__PAGES, pages);
        }
    })
}

export const updatePurchaseReturnTabList = ({commit}, params) => {
    params.pageStart = 1;
    api.purchaseReturn.search(params, (res) => {
        if(res.data.code === 'success') {
            let pages = {
                pageNo: params.pageStart,
                total:  res.data.obj.total,
                totalPages: res.data.obj.pages
            }
            commit(types.WORKORDERLIST_SET__PARAM, params);          
            commit(types.WORKORDERLIST_SET_LIST, res.data.obj.list);
            commit(types.WORKORDERLIST_SET__PAGES, pages);
        }
    })
}

export const getPriceType = ({ commit }, params) => {
    getType(params, items => {
        let arr = []
        items.forEach(item => {
            let data = {
                text: item.refDetailName,
                value: item.refDetailCode
            }
            arr.push(data)
        })
        commit(types.SET_PRICE_TYPE, arr)
    })
}

export const getStoreInfo = ({ commit }, params) => {
    api.storeManage.queryByCode(params, res => {
        if(res.data.code === 'success') {
            let obj = res.data.obj
            commit(types.SET_STORE_INFO, obj)
        }
    })
}

export const getWhListByStoreCode = ({ commit }, params) => {
    api.warehouse.query(params).then(res => {
        let obj = res.data.obj
        if (res.data.code === "success" && obj) {
            let arr = []
            obj.list.forEach((item, index) => {
                let obj = {
                    value: item.warehouseCode,
                    text: item.warehouseName
                }
                arr.push(obj)
            })
            commit(types.SET_WH_LIST, arr)
        }
    })   
}
// 查询数据字典获取开放性服务
export const getOpenService = ({ commit }, _refDetailCode) => {
    let params = {
        refDetailCode: _refDetailCode
    }
    api.systemInit.isShowFactory(params).then(res => {
        let obj = res.data.obj
        if(res.data.code === 'success' && obj) {
            commit(types.SET_OPEN_SERVICE, obj)
        }
    })
}