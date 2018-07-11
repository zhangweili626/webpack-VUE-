import * as types from './mutation-types'

const mutations = {
    [types.STORE_REQUISITION_GET_ORDER_LIST](state, { list }) {
        state.orderList = list
    },
    [types.STORE_REQUISITION_GET_ORDER_TYPES](state, { options }) {
        state.orderTypes = options 
    },
    [types.STORE_REQUISITION_SET_PAGER](state, { pager }) {
        state.pager = pager
    }
}

export default mutations