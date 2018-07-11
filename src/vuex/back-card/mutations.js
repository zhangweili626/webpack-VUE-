import * as types from './mutation-types.js'

export default {
    [types.BACKCARDLIST_SET_LIST](state, data) {
    	state.backCardList = data
    },
    [types.BACKCARDLIST_SET__PARAM](state, data) {
        state.searchParam = data
    },
    [types.BACKCARDLIST_SET__PAGES](state, data) {
        state.pages = data
    }
}