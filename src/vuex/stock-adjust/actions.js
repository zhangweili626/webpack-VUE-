import api from 'common/api'
import * as types from './mutation-types'
import { getType } from 'common/api-common'

export const getCostCalculationTypes = ({ commit }, params) => {
    getType(params, items => {
        let arr = []
        items.forEach(item => {
            let data = {
                text: item.refDetailName,
                value: item.refDetailCode
            }
            arr.push(data)
        })
        commit(types.SET_COST_CALCULATION_TYPE, arr)
    })
}

export const getStockAdjustOrderInfo = ({ commit }, params) => {
    api.stockAdjust.queryStockAdjustOrderInfos(params).then(res => {
        if (res.data.code === 'success') {
            let obj = res.data.obj
            commit(types.SET_STOCK_ADJUST_ORDER_INFO, obj)  
        }
    })
}

