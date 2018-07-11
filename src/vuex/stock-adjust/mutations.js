import * as types from './mutation-types'

export default {
    [types.SET_STOCK_ADJUST_ORDER_INFO](state, stockAdjustOrderInfo) {
        state.stockAdjustOrderInfo = stockAdjustOrderInfo
    },
    [types.SET_COST_CALCULATION_TYPE](state, costCalculationTypes) {
        state.costCalculationTypes = costCalculationTypes
    },
}