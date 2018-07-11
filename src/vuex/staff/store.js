import * as getters from './getters.js'
import * as actions from './actions.js'
import mutations from './mutations.js'

const state = {
    staffList: [],
    searchParam: {},
    pages: {},
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

