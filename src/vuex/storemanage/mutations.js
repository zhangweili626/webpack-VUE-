import * as types from './mutation-types.js'

export default {
    [types.STORE_SET_TABLELIST](state, data) {
        state.storelist = data
    },
    [types.STORE_SET_PAGE](state, data) {
        state.page = data
    }
}