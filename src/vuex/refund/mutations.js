import * as types from './mutation-types'

const mutations = {
    [types.SET_REFUND_LIST] (state, parms) {
        state.refundList = parms
    },
    [types.SET_PAGE] (state, parms) {
        state.page = parms
    },

}

export default mutations