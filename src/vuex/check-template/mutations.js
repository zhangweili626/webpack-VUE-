import * as types from './mutation-types.js'

export default {
    [types.TEMPLATELIST_SET_LIST](state, data) {
    	state.templateList = data
    },
    [types.TEMPLATELIST_SET__PARAM](state, data) {
        state.searchParam = data
    },
    [types.TEMPLATELIST_SET__PAGES](state, data) {
        state.pages = data
    }
}