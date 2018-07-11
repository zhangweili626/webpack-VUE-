import api from 'common/api'
import * as types from './mutation-types'

import { getType } from 'common/api-common'

export const getStationType = ({ commit }, params) => {
    getType(params, (items) => {
        let arr = [
            {
                text: '全部',
                value: ''
            }
        ]
        items.forEach(item => {
            let data = {
                text: item.refDetailName,
                value: item.refDetailCode
            }
            arr.push(data)
        })
        commit(types.SET_STATION_TYPE, arr)
    })
}

export const getStoreStationObj = ({ commit }, params) => {
    commit(types.SET_PARAMS, params)
    commit(types.SET_STORE_STATION_OBJ, {
        lsit:[]
    })  
    api.storeStation.pagingQuery(params).then(res => {
        if (res.data.code === 'success') {
            let obj = res.data.obj;
            commit(types.SET_STORE_STATION_OBJ, obj)  
        }
    })
}

// 员工排版
export const getEmpSchedulingObj = ({ commit }, params) => {
    api.empScheduling.query(params).then(res => {
        if (res.data.code === 'success') {
            let obj = res.data.obj;
            commit(types.SET_EMP_SCHEDULING_OBJ, obj)  
        }
    })
}

export const getEmpList = ({ commit }, params) => {
    api.empScheduling.queryEmpByStoreCode(params).then(res => {
        if (res.data.code === 'success') {
            let obj = res.data.obj;
            commit(types.SET_EMP_LIST, obj)  
        }
    })
}

export const getEmpType = ({ commit }, params) => {
    getType(params, (items) => {
        let arr = []
        items.forEach(item => {
            let data = {
                text: item.refDetailName,
                value: item.refDetailCode
            }
            arr.push(data)
        })
        commit(types.SET_EMP_TYPE, arr)
    })
}

export const getPostType = ({ commit }, params) => {
    getType(params, (items) => {
        let arr = [{
            text: '全部岗位类型',
            value: ''
        }]
        items.forEach(item => {
            let data = {
                text: item.refDetailName,
                value: item.refDetailCode
            }
            arr.push(data)
        })
        commit(types.SET_POST_TYPE, arr)
    })
}

export const getEmpStatus = ({ commit }, params) => {
    getType(params, (items) => {
        let arr = []
        items.forEach(item => {
            if(item.refDetailCode !== 'Shutdown') {
                arr.push(item.refDetailCode)
            }
        })
        commit(types.SET_EMP_STATUS, arr)
    })
}

export const getStoreInfo = ({ commit }, params) => {
    api.storeManage.queryByCode(params, res => {
        if (res.data.code === 'success') {
            let obj = res.data.obj;
            commit(types.SET_STORE_INFO, obj)  
        }
    })
}

// 自采到货处理
export const getArriveHandleInfo = ({ commit }, params) => {
    commit(types.SET_ARRIVE_HANDLE_PARAMS, params)
    api.arriveHandle.query(params).then(res => {
        if (res.data.code === 'success') {
            let obj = res.data.obj;
            commit(types.SET_ARRIVE_HANDLE_INFO, obj)  
        }
    })
}

// 卡销售单
export const getCardInfoByCode = ({ commit }, params) => {
    api.cardSale.getCardInfoByCode(params).then(res => {
        if (res.data.code === 'success') {
            let obj = res.data.obj
            commit(types.SET_CARD_INFO, obj)  
            params.next(res)
        }
    })
}

export const queryRange = ({ commit }, params) => {
    api.cardSale.queryRange(params).then(res => {
        if (res.data.code === 'success') {
            let obj = res.data.obj
            commit(types.SET_RANGE_LIST, obj)  
        }
    })
}

export const getCardSalesOrderInfo = ({ commit }, params) => {
    api.cardSale.getCardSalesOrderInfo(params).then(res => {
        if (res.data.code === 'success') {
            let obj = res.data.obj
            commit(types.SET_CARD_SALES_ORDER_INFO, obj)  
        }
    })
}
