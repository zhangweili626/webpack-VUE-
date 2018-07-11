import api from '../../common/api'
import * as types from './mutation-types.js'

export const setAllotData = ({commit}, params) => {
    commit(types.SET_ALLOT_DATA, params)
}
export const setPurchaseData = ({commit}, params) => {
    commit(types.SET_PURCHASE_DATA, params)
}
export const setOrderList = ({commit}, params) => {
    commit(types.SET_ORDERLIST, params)
}
export const setPage = ({commit}, params) => {
    commit(types.SET_PAGE, params)
}
export const setCardTemplate = ({commit}, params) => {
    commit(types.SET_CARD_TEMPLATE, params)
}
export const setCardSaleOrder = ({commit}, params) => {
    commit(types.SET_CAR_DSALE_ORDER, params)
}

