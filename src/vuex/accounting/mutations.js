import * as types from './mutation-types'
export default {
    [types.ACCOUNTING_SET_PAGE](state, data) {
    	state.page = data
    },
    [types.ACCOUNTING_SET_TABLELIST](state, data) {
        state.accountTablelist = data
    }
}