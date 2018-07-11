import api from '../../common/api'
import * as types from './mutation-types'

export const setPageOfStatic = ({ commit }, params) => {
    commit(types.SERVICESTATIC_SET_PAGE, params)
}

export const setTableListOfStatic = ({ commit }, params) => {
    commit(types.SERVICESTATIC_SET_TABLELIST, params)
}