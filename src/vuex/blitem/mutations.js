import * as types from './mutation-types.js'

export default {
    [types.BLITEMLIST_SET_LIST](state, data) {
    	state.blitemlist = data
    },
    [types.BLITEMLIST_SET_PARAM](state, data) {
        state.param = data
    },
    [types.BLITEMLIST_SET_PAGES](state, data) {
        state.pages = data
    }
}