import axios from 'axios'
import api from 'common/api'
import config from 'common/config'
import * as types from './mutation-types'

export const getSupplierType = ({ commit }, params) => {                //获取供应商类型
    api.ref.getDataDictionarys(params, (res) => {
        if (res.data.code === 'success') {
            let data = res.data.obj.referenceDetailInfos;
            let supplierTypeList = []
            data.forEach((item, index) => {
                let obj = {
                    text: item.refDetailName,
                    value: item.refDetailCode
                }
                supplierTypeList.push(obj)
            })
            commit(types.SET_SUPPLIER_TYPE, supplierTypeList)
        }
    })
}

export const getSupplierInvoiceType = ({ commit }, params) => {                //获取供应商发票类型
    api.ref.getDataDictionarys(params, (res) => {
        if (res.data.code === 'success') {
            let data = res.data.obj.referenceDetailInfos;
            let supplierInvoiceTypeList = []
            data.forEach((item, index) => {
                let obj = {
                    text: item.refDetailName,
                    value: item.refDetailCode,
                    rate: item.refDetailValue,
                }
                supplierInvoiceTypeList.push(obj)
            })
            commit(types.SET_SUPPLIER_INVOICE_TYPE, supplierInvoiceTypeList)
        }
    })
}

export const querySupplierList = ({ commit }, params) => {
    api.supplier.querySupplierList(params, (res) => {
        if (res.data.code === 'success') {
            let listInfo = res.data.obj.list
            let pager = {
                pageNo: 1,
                pageSize: 15,
                total: 1,
                totalPages: 1
            }
            pager.pageNo = res.data.obj.pageNum
            pager.totalPages = res.data.obj.pages
            pager.pageSize = res.data.obj.pageSize
            pager.total = res.data.obj.total
            commit(types.GET_SUPPLIER_LIST, {list: listInfo, page: pager})
        }
    })
}

export const getSupplierCode = ({ commit }, callBack) => {
    let params = {'serviceCode': config.supplier.sequence}
    api.ordinalInfo.getSequence(params, (res) => {
        if (res.data.code === 'success') {
            callBack(res.data.obj)
        }
    })
}

export const insertSupplierInfo = ({ commit }, params) => {
    api.supplier.insertSupplierInfo(params.props, (res) => {
        if (res.data.code === "success") {
            params.callBack(res)
        }
    })
}

export const updataSupplierInfo = ({ commit }, params) => {
    api.supplier.updataSupplierInfo(params.props, (res) => {
        if (res.data.code === "success") {
            params.callBack(res)
        }
    })
}

export const getSalesAreaInfoByAreaCode = ({ commit }, params) => {
    api.purchase
        .getPurchasingAreaInfoByAreaCode({
            areaCode: params.areaCode
        }, (res) => {
            if (res.data.code === 'success') {
                let list = []
                let options = []
                if (params.level === 0) {
                    let obj = res.data.obj
                    if (obj != null) {
                        list = [obj]
                    }
                } else {
                    list = res.data.obj.purchasingAreaSubInfo
                }
                if (list != null) {
                    list.forEach((item) => {
                        options.push({
                            name: item.areaName,
                            code: item.areaCode
                        })
                    })
                }
                params.callback(options)
            }
        })
}

//适用范围相关
export const getSuitScopeCode = ({ commit }, callBack) => {
    let params = {'serviceCode': config.supplier.getUseRangeer}
    api.ordinalInfo.getSequence(params, (res) => {
        if (res.data.code === 'success') {
            callBack(res.data.obj)
        }
    })
}

export const querySupplierSuitScope = ({ commit }, params) => {
    api.supplier.querySupplierSuitScope(params.poros, (res) => {
        if (res.data.code === "success") {
            params.callBack(res)
        }
    })
}

export const addSupplierSuitScope = ({ commit }, params) => {
    api.supplier.addSupplierSuitScope(params.poros, (res) => {
        if (res.data.code === "success") {
            params.callBack(res)
        }
    })
}

export const getSupplierInvoiceCode = ({ commit }, callBack) => {
    let params = {'serviceCode': config.supplier.invoiceSequence}
    api.ordinalInfo.getSequence(params, (res) => {
        if (res.data.code === 'success') {
            callBack(res.data.obj)
        }
    })
}

export const addSupplierInvoice = ({ commit }, params) => {
    
    api.supplier.addSupplierInvoice(params.poros, res => {
        if (res.data.code === 'success') {
            params.callBack(res)
        }
    })
}

export const getSupplierInfo = ({ commit }, params) => {
    function supplierInfo() {
        api.supplier.getSupplierInfo(params.poros, res => {
            if (res.data.code === 'success') {
                let data = res.data.obj
                commit(types.GET_SUPPLIER_INFO, data)
                params.callBack('basis')
            }
        })
    }
    function contractInfo() {
        api.supplier.getSupplierContractInfo(params.poros, res => {
            if (res.data.code === 'success') {
                let data = res.data.obj
                commit(types.GET_SUPPLIER_CONTRACT_INFO, data)
                params.callBack('contract')
            }
        })
    }
    axios.all([supplierInfo(), contractInfo()])
    .then(axios.spread((acct, pemas) => {
        params.callBack('')
    }))
    // api.supplier
}

export const getSupplierInvoiceInfo = ({ commit }, params) => {
    api.supplier.getSupplierInvoiceInfo(params.poros, res => {
        if (res.data.code === 'success') {
            let data = res.data.obj
            commit(types.GET_SUPPLIER_INVOICE_INFO, data)
            params.callBack(res)
        }
    })
}