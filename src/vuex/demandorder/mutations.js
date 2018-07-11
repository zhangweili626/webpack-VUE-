import * as types from './mutation-types.js'

export default {
    [types.SET_ALLOT_DATA](state, data) {
    	state.allot = data
    },
    [types.SET_PURCHASE_DATA](state, data) {
    	state.purchase = data
    },
    [types.SET_ORDERLIST](state, data) {
    	state.orderList = data
    },
    [types.SET_PAGE](state, data) {
    	state.page = data
    },
    [types.SET_CARD_TEMPLATE](state, data) {
        state.cardTemplatePage = data
        state.cardTemplateList = data.list
    },
    [types.SET_CAR_DSALE_ORDER](state, data) {
        state.cardSaleOrderPage = data
        state.cardSaleOrderList = data.list
    },
}