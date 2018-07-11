import * as types from './mutation-types.js'

export default {
    [types.APPOINTMENTORDERLIST_SET_LIST](state, data) {
    	state.tableList = data
    },
    [types.APPOINTMENTORDERLIST_SET__PARAM](state, data) {
        state.searchParam = data
    },
    [types.APPOINTMENTORDERLIST_SET__PAGES](state, data) {
        state.pages = data
    },
}