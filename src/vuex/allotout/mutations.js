import * as types from './mutation-types.js'

export default {
    [types.ALLOTOUT_SET_TABLELIST](state, data) {
    	state.allotoutlist = data
    },
    [types.ALLOT_SET_PAGE](state, data) {
        state.page = data
    }
}