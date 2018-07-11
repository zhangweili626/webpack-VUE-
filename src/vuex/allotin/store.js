import * as getters from './getters.js'
import * as actions from './actions.js'
import mutations from './mutations.js'
import config from '../../common/config'

const state = {
    allotinlist: [],
    page: {
        pageNo: 1,
        pageSize: config.pageNums,
        totalResult: 0,
        totalPages: 1
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}