import * as types from './mutation-types'
export default {
    [types.SERVICESTATIC_SET_PAGE](state, data) {
    	state.page = data
    },
    [types.SERVICESTATIC_SET_TABLELIST](state, data) {
        state.serviceStaticlist = data
    }
}