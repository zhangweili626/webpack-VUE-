import * as types from './mutation-types'

const mutations = {
    [types.SET_SUPPLIER_TYPE] (state, list) {
        state.supplierTypeList = list
    },
    [types.SET_SUPPLIER_INVOICE_TYPE] (state, list) {
        state.supplierInvoiceTypeList = list
    },
    [types.GET_SUPPLIER_LIST] (state, obj) {
        state.supplierList = obj.list 
        state.pager = obj.page 
    },
    [types.GET_SUPPLIER_INFO] (state, obj) {
        state.supplierInfo = obj
    },
    [types.GET_SUPPLIER_INVOICE_INFO] (state, obj) {
        state.supplierInvoiceInfo = obj
    },
    [types.GET_SUPPLIER_CONTRACT_INFO] (state, obj) {
        state.contractList = obj
    }
}

export default mutations