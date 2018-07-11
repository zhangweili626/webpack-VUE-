import api from '../../common/api'
import * as types from './mutation-types.js'

export const setTableList = ({commit}, params) => {
    commit(types.CHECKPLANLIST_SET_LIST, params)
}
export const setQueryCondition = ({commit}, params) => {
    commit(types.CHECKPLANLIST_SET_CONDITION, params)
}
export const applicationAgain = ({commit}, params) => {
    api.checkPlan.query(params, (res) => {
        if(res.data.code === 'success') {
            commit(types.CHECKPLANLIST_SET_LIST, res.data.obj.list)
        }
    })
}
export const setCheckPage = ({ commit }, params) => {
    commit(types.CHECKPLANLIST_SET_PAGE, params)
}