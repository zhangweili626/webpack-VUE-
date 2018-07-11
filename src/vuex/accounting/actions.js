import api from '../../common/api'
import * as types from './mutation-types'

export const setPageIndex = ({ commit }, params) => {
    commit(types.ACCOUNTING_SET_PAGE, params)
}

export const setTableList = ({ commit }, params) => {
    commit(types.ACCOUNTING_SET_TABLELIST, params)
}
