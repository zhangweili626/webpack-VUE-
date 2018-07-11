import api from '../../common/api'
import config from '../../common/config'
import common from '../../common/common'
import collectionApi from '../../common/api-collection.js'
import * as types from './mutation-types'

export const getOrderInfoList = ({ commit }, params) => { 
    api.repairOrder
       .queryOrderInfoPageForPicking(params, (res) => { // 查询领料列表
           if (res.data.code === 'success') {
               let list = res.data.obj.list
               let pager = {
                   pageNo: res.data.obj.pageNum,
                   pageSize: res.data.obj.pageSize,
                   total: res.data.obj.total,
                   totalPages: res.data.obj.pages
               }
               commit(types.STORE_REQUISITION_GET_ORDER_LIST, {
                   list
               })
               commit(types.STORE_REQUISITION_SET_PAGER, {
                   pager
               })
           }
       })
}
export const PdfReportOutStock = ({ commit, state }, params) => {
    common.printPreview(common.isdev() + collectionApi.supplyChain.generatePdfReportOutStock, params)
}
export const getPickingInfoByOrderNo = ({ dispatch, commit, state }, params) => {
    api.repairOrder
        .queryPickingInfoByOrderNo(params, (res) => { // 根据单号查询单条领料数据
            if (res.data.code === 'success') {
                let orderInfo = res.data.obj.orderInfoVo
                let skuDetaiInfos = []
                if (res.data.obj.skuDetaiInfos) {
                    skuDetaiInfos = res.data.obj.skuDetaiInfos
                }
                dispatch('getOrderInfoByCondition', { // 通过领料数据去解决表格信息
                    custCode: orderInfo.custCode,
                    sortRule: 1,
                    orderStatus: 10,
                    callback: (order) => {
                        orderInfo.lastStoreName = order.storeName
                        orderInfo.lastClosingDate = order.closingDate
                        orderInfo.lastActualTotalPrice = order.actualTotalPrice 
                        params.callback(orderInfo, skuDetaiInfos)
                    }
                })
            }
        })
}

export const getOrderInfoByCondition = ({ commit }, params) => {
    api.vehicleCleaning
        .getOrderInfoByCondition(params, (res) => { // 查询表格信息
            if (res.data.code === 'success') {
                let orderInfo = res.data.obj
                params.callback(orderInfo) 
            }
        }) 
}


export const updateSkuOrderOutStockList = ({ commit }, params) => {
    api.repairOrder
        .updateSkuOrderOutStockList(params.groupCodes, (res) =>  { // 领料出库
            if (res.data.code === 'success') {
                let batchNo = res.data.obj
                common.printPreview( common.isdev() + collectionApi.supplyChain.generatePdfReportOutStock, {
                    name: 'outBatchNo',
                    value: batchNo
                })
                params.callback(batchNo)// 要求缓存在页面里面方便下次打印
            }    
        })
}     

export const getOrderTypes = ({ commit }) => {
    let params = { 'refCode': config.order.orderTypeCode.refCode }
    api.ref
        .getDataDictionarys(params, (res) => { // 数据字典
            if (res.data.code === 'success') {
                let options = []
                let arr = []
                arr = res.data.obj.referenceDetailInfos
                if (arr != null) {
                    options.unshift({
                        text: '请选择',
                        value: ''
                    })
                    arr.forEach((item, index) => {
                        options.push({
                            text: item.refDetailName,
                            value: item.refDetailCode
                        })
                    })
                }
                commit(types.STORE_REQUISITION_GET_ORDER_TYPES, {
                    options
                })
            }
        })
}