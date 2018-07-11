import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

const state = {
    supplierTypeList: [],
    supplierList: [],
    contractList: [],
    supplierInvoiceTypeList: [],
    pager: {
        pageNo: 1,
        pageSize: 15,
        total: 1,
        totalPages: 1
    },
    supplierInfo: {},
    supplierInvoiceInfo: [],
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}