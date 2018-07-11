import api from '../../common/api'
import * as types from './mutation-types.js'

export const setStoreList = ({ commit }, params) => {
    commit(types.STORE_SET_TABLELIST, params)
}

export const setStorePage = ({ commit }, params) => {
    commit(types.STORE_SET_PAGE, params)
}