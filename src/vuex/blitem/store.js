import * as getters from './getters.js'
import * as actions from './actions.js'
import mutations from './mutations.js'

const state = {
    blitemlist: [],
    pages:{},
    param: {}
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

