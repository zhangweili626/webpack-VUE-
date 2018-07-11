import * as types from './mutation-types'
export default {
    [types.SERVICE_SET_PAGE](state, data) {
    	state.page = data
    },
    [types.SERVICE_SET_TABLELIST](state, data) {
        state.servicelist = data
    }
}