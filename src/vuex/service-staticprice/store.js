import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import config from '../../common/config'

const state = {
    serviceStaticlist: [],
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