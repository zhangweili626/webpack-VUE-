import * as types from './mutation-types.js'

export default {
    [types.STAFFLIST_SET_LIST](state, data) {
    	state.staffList = data
    },
    [types.STAFFLIST_SET__PARAM](state, data) {
        state.param = data
    },
    [types.STAFFLIST_SET__PAGES](state, data) {
        state.pages = data
    }
}