import api from '../../common/api'
import config from '../../common/config'
import * as types from './mutation-types.js'

export const setTableList = ({commit}, params) => {
    commit(types.ALLOTOUT_SET_TABLELIST, params)
}

export const setPage = ({commit}, params) => {
    commit(types.ALLOT_SET_PAGE, params)
}