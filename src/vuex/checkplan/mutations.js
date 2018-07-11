import * as types from './mutation-types.js'

export default {
    [types.CHECKPLANLIST_SET_LIST](state, data) {
    	state.checkplanlist = data
    },
    [types.CHECKPLANLIST_SET_CONDITION](state, data) {
        state.condition = data
    },
    [types.CHECKPLANLIST_SET_PAGE](state, data) {
        state.page = data
    }
}