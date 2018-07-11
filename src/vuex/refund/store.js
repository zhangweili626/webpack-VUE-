import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import config from '../../common/config'
const state = {
    refundList: [],
    page: {
        pageNo: 1,
        pageSize:config.pageNums,
        total: 1,
        totalPages: 1
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}