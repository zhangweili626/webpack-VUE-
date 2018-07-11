import * as types from './mutation-types.js'

export default {
    [types.ALLOT_SET_TABLELIST](state, data) {
    	state.allotinlist = data
    },
    [types.ALLOT_SET_PAGE](state, data) {
        state.page = data
    }
}