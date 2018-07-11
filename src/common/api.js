import axios from 'axios'
import common from "./common.js"
import config from "./config.js"
import collectionApi from './api-collection.js'
axios.defaults.headers.post['Content-Type'] = 'application/json' //请求头
axios.defaults.headers.Accept = 'application/json' //请求头
axios.defaults.baseURL = '/'
axios.defaults.withCredentials = true
axios.defaults.timeout = 20000

import { Loading, Message } from 'element-ui'

const options = {
    text: '加载中. . .'
}
let _loading;

// post传参序列化
axios.interceptors.request.use((config) => {
    // if (config.method === 'post') {
    //     config.data = JSON.stringify(config.data);
    //     // console.info(55);
    // }
    // console.info(config);
    // console.log('正在请求中...')
    _loading = Loading.service(options)
    return config;
}, (error) => {
    // console.log("错误的传参", 'fail');
    Message({
        message: '参数错误',
        type: 'error',
        duration: 0,
        showClose: true
    })
    return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use((res) => {
    // console.log('请求结束了,返回结果...')
    _loading.close()
    if (!res.data) {
        return Promise.reject(res);
    }
    if (res.data.code === 'login') {
        // window.location.href = "http://dev.iris.com/web/login/login.html";
    } else if (res.data.code === 'fail') {
        Message.closeAll()
        Message({
            message: res.data.message,
            type: 'error',
        })
    }
    return res;
}, (error) => {
    var originalRequest = error.config;
    if(error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!=-1 && !originalRequest._retry){
        originalRequest._retry = true
        Message.closeAll()
        Message({
            message: '网络超时',
            type: 'error',
        })
        // return axios.request(originalRequest)
    }
    _loading.close()
    // Message({
    //     message: '网络错误',
    //     type: 'error'
    // })
    return Promise.reject(error);
});

var setParams = function (params, type) {
    var params = common.parseData(params);
    var pm = common.parseData(params.body) || params;
    var type = type == 'GET' ? 'GET' : 'POST';
    return pm;
}

export default {
    currentTime: function(params, sc) {
        axios.post(common.isdev() + collectionApi.currentTime, params)
            .then((r) => {
                sc(r)
            })
    },
    // 接口请求
    toLogin: {
        //获取用户菜单
        getUserMenu: function (params) {
            var params = setParams(params);
             return axios.post(common.isdev() + collectionApi.toLogin.getUserMenu, params);
        },
        //获取登录信息
        getLoginInfo: function (params) {
            var params = setParams(params);
            return axios.post(common.isdev() + collectionApi.toLogin.getLoginInfo, params);
        },
        //获取组织信息
        getOrg: function (params) {
            var params = setParams(params);
            return axios.post(common.isdev() + collectionApi.toLogin.getOrg, params);
        },
        //切换组织
        changeLoginInfo: function (params) {
            var params = setParams(params);
            return axios.post(common.isdev() + collectionApi.toLogin.changeLoginInfo, params);
        },
        logout: function (params) {
            var params = setParams(params);
            return axios.post(common.isdev() + collectionApi.toLogin.logout, params);
        },
    },
    //适用范围相关
    getUserAvailableInfo: function(sc) {
        axios.post(common.isdev() + collectionApi.suitScope.getUserAvailableInfo)
            .then((r) => {
                sc(r)
            })
    },
    menu: {
        getReferenceInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.suitScope.getReferenceInfo, params)
                .then((r) => {
                    sc(r)
                })
        }
    },
    // 车辆信息
    car: {
        queryCarInfoByCarSearch: function(params, sc) {
            axios.post(common.isdev() + collectionApi.car.queryCarInfoByCarSearch, params)
                .then((r) => {
                    sc(r)
                })
        }
    },
    ordinalInfo: {
        //根据应用编码获得相关的应用序列
        getSequence: function (params, sc) {
            var params = setParams(params);
            return axios.post(common.isdev() + collectionApi.ref.seq, params)
                .then((r) => {
                    sc(r)
                })
        },
        getSequenceList(params, sc) {
            return axios.post(common.isdev() + collectionApi.ref.seqList, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    finance: {
        //查询经销商门店信息
        queryShopInfo(params, sc) {
            return axios.post(common.isdev() + collectionApi.suitScope.queryShopInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 获取用户信息
    getUserAvailableInfo: function (sc) {
        axios.post(common.isdev() + collectionApi.toLogin.getUserAvailableInfo)
            .then((r) => {
                sc(r)
            })
    },
    // 获取仓库信息
    getEntrepot: function (params, sc) {
        axios.post(common.isdev() + collectionApi.toLogin.getEntrepot, params)
            .then((r) => {
                sc(r)
            })
    },
    getSalesAreaInfoByUserAvailableAllLevel: function (sc) {
        axios.post(common.isdev() + collectionApi.checkPlan.suppliLever)
            .then((r) => {
                sc(r)
            })
    },
     //解析Excel
     analysisExcel: {
        methods: function(params, url) {
            return axios.post(common.isdev() + url, params);
        }
    },
    //获取数据字典配置信息
    ref: {
        //从数据字典获取主表信息
        getDataDictionarys(params, sc) {
            axios.post(common.isdev() + collectionApi.ref.getRefDetailInfo, params)
                .then(r => {
                    sc(r)
                })
        },
        getRefDetailInfoQuery(params, sc) {
            axios.post(common.isdev() + collectionApi.ref.getRefDetailInfoQuery, params)
                .then(r => {
                    sc(r)
                })
        },
        getDataDictionarysPages(params, sc) {
            axios.post(common.isdev() + collectionApi.ref.getRefDetailInfoPages, params)
                .then(r => {
                    sc(r)
                })
        },
        queryRefDetail(params, sc) {
            axios.post(common.isdev() + collectionApi.ref.queryRefDetail, params)
                .then(r => {
                    sc(r)
                })
        },
        //
        queryDetail(params, sc) {
            axios.post(common.isdev() + collectionApi.ref.query, params)
                .then(r => {
                    sc(r)
                })
        }
    },
    //业务信息
    ordinalInfo: {
        insert: function (params) {
            return axios.post(common.isdev() + collectionApi.ref.inseq, params)
        },
        search: function (params) {
            var params = setParams(params);
            return axios.post(common.isdev() + collectionApi.ref.shseq, params)
        },
        edit: function (params) {
            var params = setParams(params);
            return axios.post(common.isdev() + collectionApi.ref.upseq, params)
        },
        //根据应用编码获得相关的应用序列
        getSequence: function (params, sc) {
            var params = setParams(params);
            return axios.post(common.isdev() + collectionApi.ref.seq, params)
                .then((r) => {
                    sc(r)
                })
        },
        //根据应用编码获得相关的应用序列List
        getSequenceList: function (params, sc) {
            var params = setParams(params);
            return axios.post(common.isdev() + collectionApi.ref.getseq, params)
                .then((r) => {
                    sc(r)
                })
        },
        getDatafromref: function(params, sc) {
            var params = setParams(params);
            return axios.post(common.isdev() + collectionApi.ref.query)
                .then((r) => {
                    sc(r)
                })
        },
        //数据同步
        dataSync: function (params) {
            var params = setParams(params);
            return axios.post(common.isdev() + collectionApi.ref.sycseq, params)
        }
    },
    // 区域树状图接口
    area: {
        getChinaAreaInfoByAreaCode(params) {
            return axios.post(common.isdev() + collectionApi.area.china, params);
        },
        getSalesAreaInfoByAreaCode(params, sc) {
            return axios.post(common.isdev() + collectionApi.area.charea, params)
                .then((r) => {
                    sc(r)
                });
        },
        getDeliveryAreaInfoByAreaCode(params) {
            return axios.post(common.isdev() + collectionApi.area.dlyarea, params);
        },
        getOrg(params) {
            return axios.post(common.isdev() + collectionApi.area.getorg, params);
        },
        workFlowGetOrg(params, sc) {
            axios.post(common.isdev() + collectionApi.area.getorg, params)
                .then((r) => {
                    sc(r)
                })
        },
        //查询经销商门店信息
        queryShopInfo(params, sc) {
            return axios.post(common.isdev() + collectionApi.area.shopinfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 获取采购区域名称
    purchase: {
        getPurchasingAreaInfoByAreaCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.area.caigouarea, params)
                .then((r) => {
                    sc(r)
                })
        }
    },
    // 附件
    accessory: {
        del: function(params, sc) {
            axios.post(common.isdev() + collectionApi.accessory.del, params)
                .then((r) => {
                    sc(r)
                })
        },
        pvw: function(params, sc) {
            axios.post(common.isdev() + collectionApi.accessory.pvw, params)
                .then((r) => {
                    sc(r)
                })
        },
        list: function(params, sc) {
            axios.post(common.isdev() + collectionApi.accessory.list, params)
                .then((r) => {
                    sc(r)
                })
        },
        download: function(params, sc) {
            axios.post(common.isdev() + collectionApi.accessory.download, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // SKU信息查询
    skuData:{
        getInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuData.getInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    skuPlace: {
        queryWarehouseAreaInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuPlace.queryWarehouseAreaInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryWarehouseLocationInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuPlace.queryWarehouseLocationInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        querySkuLocationInfos: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuPlace.querySkuLocationInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertSkuLocationInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuPlace.insertSkuLocationInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateSkuLocationInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuPlace.updateSkuLocationInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getSkuLocationInfoByCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuPlace.getSkuLocationInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        skuLocationInfoExcelFile: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuPlace.skuLocationInfoExcelFile, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertSkuLocationInfoList: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuPlace.insertSkuLocationInfoList, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据商品, 仓库查询库区库位  add by lwx
        querySkuLocationInfoNoPage(params, sc) {
            axios.post(common.isdev() + collectionApi.skuPlace.querySkuLocationInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        }
    },
    // 对账单接口
    statementAccount: {
        queryPurchaseReturnOrderInfos: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.queryPurchaseReturnOrderInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryInventoryList: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.queryInventoryList, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryReconciliationOrderInfos: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.queryReconciliationOrderInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryReconciliationOrderInfoNoPage: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.queryReconciliationOrderInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateReconciliationOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.updateReconciliationOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertReconciliationOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.insertReconciliationOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getReconciliationOrderInfoByCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.getReconciliationOrderInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryStoreInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.queryStoreInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        querySupplierInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.querySupplierInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        editReconciliationDetailInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.editReconciliationDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getReconciliationDetailInfoByCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.getReconciliationDetailInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCountStockDetailBatch: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.queryCountStockDetailBatch, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryPurchaseOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.queryPurchaseOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryReconciliationVerifyOrderInfoExts: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.queryReconciliationVerifyOrderInfoExts, params)
                .then((r) => {
                    sc(r)
                })
        },
        cleanReconciliationOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.cleanReconciliationOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        confirmReconciliationOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccount.confirmReconciliationOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    //对账核销
    statementAccountCancel:{
        queryReconciliationVerifyOrderInfoExts: function(params, sc){
            axios.post(common.isdev() + collectionApi.statementAccountCancel.queryReconciliationVerifyOrderInfoExts, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryReconciliationVerifyOrderInfoNoPage: function(params, sc){
            axios.post(common.isdev() + collectionApi.statementAccountCancel.queryReconciliationVerifyOrderInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        //对账核销单撤销
        withdrawReconciliationVerifyOrderInfo:function(params, sc){
            axios.post(common.isdev() + collectionApi.statementAccountCancel.withdrawReconciliationVerifyOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //根据条件查询接口，带分页
        queryReconciliationVerifyOrderInfos: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccountCancel.queryReconciliationVerifyOrderInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        //对账核销单作废
        cancelReconciliationVerifyOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccountCancel.cancelReconciliationVerifyOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //核销处理
        verifyPurchaseBatchInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccountCancel.verifyPurchaseBatchInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //对账核销付款明细查询
        queryReconciliationVerifyPaymentInfoNoPage: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccountCancel.queryReconciliationVerifyPaymentInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        //对账核销付款明细接口新增
        editReconciliationVerifyPaymentInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccountCancel.editReconciliationVerifyPaymentInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryReconciliationDetailInfoNoPage: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccountCancel.queryReconciliationDetailInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertReconciliationVerifyOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccountCancel.insertReconciliationVerifyOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        submitReconciliationVerifyOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccountCancel.submitReconciliationVerifyOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateReconciliationVerifyOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccountCancel.updateReconciliationVerifyOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        ReconciliationCloseOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.statementAccountCancel.ReconciliationCloseOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        }
    },
    // 盘点计划接口
    checkPlan: {
        // 查询商品接口v2
        querySkuInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.checkPlan.skuInfoV2, params)
            .then((r) => {
                sc(r)
            })
        },
        // 盘点计划条件查询 POST /v1/inventory/queryInventoryPlanInfoNoPage
        queryByCondition: function(params, sc) {
            axios.post(common.isdev() + collectionApi.checkPlan.queryByCondition, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 查询 分页POST /v1/inventory/queryInventoryPlanInfos
        query: function(params, sc) {
            axios.post(common.isdev() + collectionApi.checkPlan.query, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据业务编码查询盘点计划 POST /v1/inventory/getInventoryPlanInfoByCode
        queryAccordingCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.checkPlan.queryAccordingCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 新增主表 POST /v1/inventory/insertInventoryPlanInfo
        addMain: function(params, sc) {
            axios.post(common.isdev() + collectionApi.checkPlan.addMain, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据盘点计划  生产盘点单 POST /v1/inventory/generateInventoryInfo
        productPageByPlan: function(params, sc) {
            axios.post(common.isdev() + collectionApi.checkPlan.productPageByPlan, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 盘点计划编辑  POST /v1/inventory/editInventoryPlanInfo
        editCheckPlan: function(params, sc) {
            axios.post(common.isdev() + collectionApi.checkPlan.editCheckPlan, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据商品分类编码获取直属下级所有信息
        getSkuCategoryInfoBycategoryCode(params) {
            return axios.post(common.isdev() + collectionApi.checkPlan.categorySku, params)
        },
        // 批量新增盘点规则POST /v2/inventory/batchAddOrEditInventoryPlanRuleInfo
        addRegulation: function(params, sc) {
            axios.post(common.isdev() + collectionApi.checkPlan.regulation, params)
                .then((r) => {
                    sc(r)
                })
        },
        // SKU名称查询
        querySku: function(params, sc) {
            axios.post(common.isdev() + collectionApi.checkPlan.skuInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        // editMainState
        editMainState: function(params, sc) {
            axios.post(common.isdev() + collectionApi.checkPlan.stop, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 生产临时盘点规则
        createTemp: function(params, sc) {
            axios.post(common.isdev() + collectionApi.blitem.creatBlitemDetails, params)
                .then((r) => {
                    sc(r)
                })
        },
        //根据商品编码获取商品详情
        skuDetailInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.checkPlan.skuDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        }
    },
    // 盘点单接口
	blitem: {
		// 盘点单分页查询
		getBlitemSearch: function (params, sc) {
			axios.post(common.isdev() + collectionApi.blitem.getBlitemSearch, params)
				.then((r) => {
				sc(r)
			})
		},
		// 盘点单详情查询
		getBlitemDetails: function (params, sc) {
			axios.post(common.isdev() + collectionApi.blitem.getBlitemDetails, params)
				.then((r) => {
				sc(r)
			})
		},
		// 盘点单详情查询
		creatBlitemDetails: function (params, sc) {
			axios.post(common.isdev() + collectionApi.blitem.creatBlitemDetails, params)
				.then((r) => {
				sc(r)
			})
		},
		// 盘点单详情编辑
		BlitemEditDetails: function (params, sc) {
			axios.post(common.isdev() + collectionApi.blitem.BlitemEditDetails, params)
				.then((r) => {
				sc(r)
			})
        },
        // 盘点单新增
		creatTampblitem: function (params, sc) {
			axios.post(common.isdev() + collectionApi.blitem.creatTampblitem, params)
				.then((r) => {
				sc(r)
			})
        },
            //盘点明细上传解析接口
        analysisExcel:  function (params, sc) {
            axios.post(common.isdev() + collectionApi.blitem.BlitemdetailsAnalysis, params)
                .then((r) => {
                    sc(r)
                })
        }
    },
    // 采购合同
    purchaseContract: {
         // 查询供应商列表
         suplierList: function (params, sc) {
			axios.post(common.isdev() + collectionApi.purchaseContract.suplierList, params)
				.then((r) => {
				sc(r)
			})
        },
        // 采购合同分页查询
		search: function (params, sc) {
			axios.post(common.isdev() + collectionApi.purchaseContract.search, params)
				.then((r) => {
				sc(r)
			})
        },
          // 采购合同作废
          invalidContract: function (params, sc) {
			axios.post(common.isdev() + collectionApi.purchaseContract.invalidContract, params)
				.then((r) => {
				sc(r)
			})
        },
         // 采购主表新增
         addPurchase: function (params, sc) {
			axios.post(common.isdev() + collectionApi.purchaseContract.addPurchase, params)
				.then((r) => {
				sc(r)
			})
        },
         // 采购编辑
         eidtPurchase: function (params, sc) {
			axios.post(common.isdev() + collectionApi.purchaseContract.eidtPurchase, params)
				.then((r) => {
				sc(r)
			})
        },
         // 采购合同信息查询
         PurchaseInfo: function (params, sc) {
			axios.post(common.isdev() + collectionApi.purchaseContract.PurchaseInfo, params)
				.then((r) => {
				sc(r)
			})
        },
         // 采购合同适用范围编辑
         eidtUseRange: function (params, sc) {
			axios.post(common.isdev() + collectionApi.purchaseContract.eidtUseRange, params)
				.then((r) => {
				sc(r)
			})
        },
         // 采购合同适用范围查询
         getUseRange: function (params, sc) {
			axios.post(common.isdev() + collectionApi.purchaseContract.getUseRange, params)
				.then((r) => {
				sc(r)
			})
        },
         // 采购合同明细编辑
         eidtDetail: function (params, sc) {
			axios.post(common.isdev() + collectionApi.purchaseContract.eidtDetail, params)
				.then((r) => {
				sc(r)
			})
        },
         // 采购合同明细查询
         getdetail: function (params, sc) {
			axios.post(common.isdev() + collectionApi.purchaseContract.getdetail, params)
				.then((r) => {
				sc(r)
			})
        },
        // 采购合同审批提交
        contractApproSubmit: function (params, sc) {
			axios.post(common.isdev() + collectionApi.purchaseContract.contractApproSubmit, params)
				.then((r) => {
				sc(r)
			})
        },
        // 采购合同审批撤回
        contractApprovalWithdrawn: function (params, sc) {
			axios.post(common.isdev() + collectionApi.purchaseContract.contractApprovalWithdrawn, params)
				.then((r) => {
				sc(r)
			})
        },
        //盘点明细上传解析接口
        analysisExcel:  function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseContract.contractdetailsAnalysis, params)
                .then((r) => {
                    sc(r)
                })
        }
    },
    // 员工管理
    staff: {
        // 员工信息分页查询
        search: function(params, sc) {
            axios.post(common.isdev() + collectionApi.staff.search, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 新增员工信息
        creatStaff: function(params, sc) {
            axios.post(common.isdev() + collectionApi.staff.creatStaff, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 编辑员工信息
        eidtStaff: function(params, sc) {
            axios.post(common.isdev() + collectionApi.staff.eidtStaff, params)
                .then((r) => {
                    sc(r)
                })
        },
         // 获取员工信息
         getDetail: function(params, sc) {
            axios.post(common.isdev() + collectionApi.staff.getDetail, params)
                .then((r) => {
                    sc(r)
                })
        },
         // 重置密码
         resetPassword: function(params, sc) {
            axios.post(common.isdev() + collectionApi.staff.resetPassword, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 商品车型适配
    skuCar: {
        // 商品车型适配查询
        skuCarSearch: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuCar.skuCarsearch, params)
                .then((r) => {
                    sc(r)
                })
        },
         // 车型查询适配商品
         carSkuSearch: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuCar.carSkuSearch, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 车型查询适配商品
        carSkuSearch: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuCar.carSkuSearch, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 新增SKU适配车型信息
        skuCarAdd: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuCar.skuCarAdd, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 编辑SKU适配车型信息
        skuCarEidt: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuCar.skuCarEidt, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 批量编辑SKU适配车型信息
        skuCarEidtList: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuCar.skuCarEidtList, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 编辑车型扩展信息
        carAddEidt: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuCar.carAddEidt, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据sku获取适配车型
        getSkuCar: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuCar.getSkuCar, params)
                .then((r) => {
                    sc(r)
                })
        },
         // 根据适配车型查询扩展信息
         getSkuCarAdd: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuCar.getSkuCarAdd, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 获取carCode
        getCarCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuCar.getCarCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据适配车型查询扩展信息选项
        getCarAdd: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuCar.getCarAdd, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
     // 打卡
     clock: {
        // 获取工位打卡列表
        getStationList: function(params, sc) {
            axios.post(common.isdev() + collectionApi.clock.getStationList, params)
                .then((r) => {
                    sc(r)
                })
        },
         // 获取技师打卡列表
         getTechnicianList: function(params, sc) {
            axios.post(common.isdev() + collectionApi.clock.getTechnicianList, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 获取工位人员列表
        getEmpList: function(params, sc) {
            axios.post(common.isdev() + collectionApi.clock.getEmpList, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 关卡
        closeCard: function(params, sc) {
            axios.post(common.isdev() + collectionApi.clock.closeCard, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 开卡
        openCard: function(params, sc) {
            axios.post(common.isdev() + collectionApi.clock.openCard, params)
                .then((r) => {
                    sc(r)
                })
        },
         // 根据技师编码获取工单
         getDispatch: function(params, sc) {
            axios.post(common.isdev() + collectionApi.clock.getDispatch, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    //供应商
    supplier: {
        querySupplierList: function(params, sc) {
            axios.post(common.isdev() + collectionApi.supplier.querySupplierList, params)
                .then((r) => {
                    sc(r)
                })
        },
        //新增供应商信息
        insertSupplierInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.supplier.insertSupplierInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //更新供应商信息
        updataSupplierInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.supplier.updataSupplierInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //新增适用范围
        addSupplierSuitScope: function(params, sc) {
            axios.post(common.isdev() + collectionApi.supplier.addSupplierSuitScope, params)
                .then((r) => {
                    sc(r)
                })
        },
        //查询适用范围
        querySupplierSuitScope: function(params, sc) {
            axios.post(common.isdev() + collectionApi.supplier.querySupplierSuitScope, params)
                .then((r) => {
                    sc(r)
                })
        },
        //新增或编辑供应商发票信息
        addSupplierInvoice: function(params, sc) {
            axios.post(common.isdev() + collectionApi.supplier.addSupplierInvoice, params)
                .then((r) => {
                    sc(r)
                })
        },
        //根据编码获取供应商信息
        getSupplierInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.supplier.getSupplierInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //根据编码获取供应商合同信息
        getSupplierContractInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.supplier.getSupplierContractInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //根据编码获取供应商发票信息
        getSupplierInvoiceInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.supplier.getSupplierInvoiceInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 账期账务
    accounting: {
        query: function (params, sc) {
			axios.post(common.isdev() + collectionApi.accounting.query, params)
				.then((r) => {
				sc(r)
			})
		},
        queryByCode: function (params, sc) {
			axios.post(common.isdev() + collectionApi.accounting.queryBycode, params)
				.then((r) => {
				sc(r)
			})
		},
        closeAccounting: function (params, sc) {
			axios.post(common.isdev() + collectionApi.accounting.editState, params)
				.then((r) => {
				sc(r)
			})
		}
    },
    adjust: {
        addAdjust: function (params, sc) {
            axios.post(common.isdev() + collectionApi.adjust.addAdjust, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryAdjust: function (params, sc) {
            axios.post(common.isdev() + collectionApi.adjust.queryAdjust, params)
                .then((r) => {
                    sc(r)
                })
        },
        addAdjustQuery: function (params, sc) {
            axios.post(common.isdev() + collectionApi.adjust.addAdjustQuery, params)
                .then((r) => {
                    sc(r)
                })
        },
        addAdjustDetail: function (params, sc) {
            axios.post(common.isdev() + collectionApi.adjust.addAdjustDetail, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryAdjustDetail: function (params, sc) {
            axios.post(common.isdev() + collectionApi.adjust.queryAdjustDetail, params)
                .then((r) => {
                    sc(r)
                })
        },
        submitExamine: function (params, sc) {
            axios.post(common.isdev() + collectionApi.adjust.submitExamine, params)
                .then((r) => {
                    sc(r)
                })
        },
        upDataAdjust: function (params, sc) {
            axios.post(common.isdev() + collectionApi.adjust.upDataAdjust, params)
                .then((r) => {
                    sc(r)
                })
        },
        cancelAdjustOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.adjust.cancelAdjustOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        withdrawAdjustOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.adjust.withdrawAdjustOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getAdjustSkuDetailInfoByCode:function (params, sc) {
            axios.post(common.isdev() + collectionApi.adjust.getAdjustSkuDetailInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    storeInfo:{
        //查询经销商门店信息
        queryShopInfo(params, sc) {
            return axios.post(common.isdev() + collectionApi.store.queryShopInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
   //调拨出库
   allotout:{
   		//分页查询
   		 query: function (params, sc) {
			axios.post(common.isdev() + collectionApi.allotout.query, params)
				.then((r) => {
				sc(r)
			})
		},
		//编辑出库单
		editQuery: function (params, sc) {
			axios.post(common.isdev() + collectionApi.allotout.editQuery, params)
				.then((r) => {
				sc(r)
			})
		},
		//新增主库单
		addQuery: function (params, sc) {
			axios.post(common.isdev() + collectionApi.allotout.addQuery, params)
				.then((r) => {
				sc(r)
			})
		},

		//编辑产品明细
		editDetail: function (params, sc) {
			axios.post(common.isdev() + collectionApi.allotout.editDetail, params)
				.then((r) => {
				sc(r)
			})
		},
		//编辑产品明细集团内转售
		editSaleOutDetail: function (params, sc) {
			axios.post(common.isdev() + collectionApi.allotout.editSaleOutDetail, params)
				.then((r) => {
				sc(r)
			})
		},
		//编辑查询
		selectQuery: function (params, sc) {
			axios.post(common.isdev() + collectionApi.allotout.selectQuery, params)
				.then((r) => {
				sc(r)
			})
		},
	   //编辑查询子表明细
	   seleSkuQuery: function (params, sc) {
			axios.post(common.isdev() + collectionApi.allotout.seleSkuQuery, params)
				.then((r) => {
				sc(r)
			})
		},
		 //主表作废
	   destroy: function (params, sc) {
			axios.post(common.isdev() + collectionApi.allotout.destroy, params)
				.then((r) => {
				sc(r)
			})
		},
		// 提交主表信息
		submitTable: function (params, sc) {
				axios.post(common.isdev() + collectionApi.allotout.submitTable, params)
					.then((r) => {
					sc(r)
				})
			},
		//更新审批状态回调
		updateApprove: function (params, sc) {
				axios.post(common.isdev() + collectionApi.allotout.updateApprove, params)
					.then((r) => {
					sc(r)
				})
			},
		//撤销接口
		revocation: function (params, sc) {
				axios.post(common.isdev() + collectionApi.allotout.revocation, params)
					.then((r) => {
					sc(r)
				})
			},
		queryStockInfoVosByCodeAndSku: function (params, sc) {
				axios.post(common.isdev() + collectionApi.allotout.queryStockInfoVosByCodeAndSku, params)
					.then((r) => {
					sc(r)
				})
			},
		//查询价格
		querySkuPrice: function (params, sc) {
				axios.post(common.isdev() + collectionApi.allotout.querySkuPrice, params)
					.then((r) => {
					sc(r)
				})
			},

   },
    // 调拨清单
    allotTicket: {
        queryByPage: function(params, sc) {
            axios.post(common.isdev() + collectionApi.allotTicket.query, params)
                .then((r) => {
                sc(r)
            })
        }
    },
   // 调拨入库
    allotin: {
        // 分页查询
        query: function(params, sc) {
            axios.post(common.isdev() + collectionApi.allotin.query, params)
                .then((r) => {
                sc(r)
            })
        },
        // 根据业务编码查询
        queryByCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.allotin.queryBycode, params)
                .then((r) => {
                sc(r)
            })
        },
        // 查询入库单信息
        queryByInCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.allotin.queryByInCode, params)
                .then((r) => {
                sc(r)
            })
        },
        // 模态框新增
        // add: function(params, sc) {
        //     axios.post(common.isdev() + collectionApi.allotin.add, params)
        //         .then((r) => {
        //         sc(r)
        //     })
        // },
        // 入库操作
        instorage: function(params, sc) {
            axios.post(common.isdev() + collectionApi.allotin.instorage, params)
                .then((r) => {
                sc(r)
            })
        }
    },
    // 服务固定价格
    serviceStatic: {
        // 分页查询
        queryByPage: function(params, sc) {
            axios.post(common.isdev() + collectionApi.serviceStatic.queryByPage, params)
                .then((r) => {
                sc(r)
            })
        },
        // 根据业务编码查询
        queryByCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.serviceStatic.queryByCode, params)
                .then((r) => {
                sc(r)
            })
        },
        queryAmountByCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.serviceStatic.queryAmountByCode, params)
                .then((r) => {
                sc(r)
            })
        },
        // 新增
        add: function(params, sc) {
            axios.post(common.isdev() + collectionApi.serviceStatic.add, params)
                .then((r) => {
                sc(r)
            })
        },
        // 更新
        update: function(params, sc) {
            axios.post(common.isdev() + collectionApi.serviceStatic.edit, params)
                .then((r) => {
                sc(r)
            })
        },
        // 批量上下架 或删除
        deleteItems: function(params, sc) {
            axios.post(common.isdev() + collectionApi.serviceStatic.deleteItem, params)
                .then((r) => {
                sc(r)
            })
        }
    },
    // 服务项目
    serviceitem: {
        // 分页查询
        queryByPage: function(params, sc) {
            axios.post(common.isdev() + collectionApi.serviceitem.query, params)
                .then((r) => {
                sc(r)
            })
        },
        // 查询分类信息
        queryCategory: function(params, sc) {
            return axios.post(common.isdev() + collectionApi.serviceitem.queryCategory, params)
        },
        // 查询目录信息
        queryCatalog: function(params, sc) {
            return axios.post(common.isdev() + collectionApi.serviceitem.queryCatalog, params)
        },
        // 根据信息编码查询
        queryByCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.serviceitem.queryBycode, params)
                .then((r) => {
                sc(r)
            })
        },
        // 新增服务信息主表
        insertService: function(params, sc) {
            axios.post(common.isdev() + collectionApi.serviceitem.insert, params)
                .then((r) => {
                sc(r)
            })
        },
        // 删除明细
        deleteDetail: function(params, sc) {
            axios.post(common.isdev() + collectionApi.serviceitem.deleteDetail, params)
                .then((r) => {
                sc(r)
            })
        },
        // 数据同步
        dataSync: function(sc) {
            axios.post(common.isdev() + collectionApi.serviceitem.dataSync)
            .then((r) => {
                sc(r)
            })
        }
    },
    // 门店管理
    storeManage: {
        // 查询款型
        getCarStyles: function(params, sc) {
            axios.post(common.isdev() + collectionApi.store.getCarStyle, params)
                .then((r) => {
                sc(r)
            })
        },
        // 分页查询
        queryByPage: function(params, sc) {
            axios.post(common.isdev() + collectionApi.store.queryByPage, params)
                .then((r) => {
                sc(r)
            })
        },
        // 根据门店code  查询门店全部信息
        queryByCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.store.queryByCode, params)
                .then((r) => {
                sc(r)
            })
        },
        // 查询门店附加信息
        queryAllInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.store.queryAllInfo, params)
                .then((r) => {
                sc(r)
            })
        },
        // 门店新增
        addStore: function(params, sc) {
            axios.post(common.isdev() + collectionApi.store.addStore, params)
                .then((r) => {
                sc(r)
            })
        },
        // 门店信息更新
        updateStore: function(params, sc) {
            axios.post(common.isdev() + collectionApi.store.updateStore, params)
                .then((r) => {
                sc(r)
            })
        },
        // 门店信息更新v2
        updateStore2: function(params, sc) {
            axios.post(common.isdev() + collectionApi.store.updateStore2, params)
                .then((r) => {
                sc(r)
            })
        },
        // 财务信息接口
        updateFinance: function(params, sc) {
            axios.post(common.isdev() + collectionApi.store.financeSave, params)
                .then((r) => {
                sc(r)
            })
        },
        // 查询财务信息
        queryFinance: function(params, sc) {
            axios.post(common.isdev() + collectionApi.store.queryFinance, params)
                .then((r) => {
                sc(r)
            })
        },
        // 更新车型信息
        updateCar: function(params, sc) {
            axios.post(common.isdev() + collectionApi.store.carSave, params)
                .then((r) => {
                sc(r)
            })
        },
        // 查询车型
        queryCar: function(params, sc) {
            axios.post(common.isdev() + collectionApi.store.queryCar, params)
                .then((r) => {
                sc(r)
            })
        },
        // 数据同步
        dataSync: function(sc) {
            axios.post(common.isdev() + collectionApi.store.dataSync)
            .then((r) => {
                sc(r)
            })
        }
    },
    // 门店工位信息
    storeStation: {
        insert(params) {
            return axios.post(common.isdev() + collectionApi.storeStation.insert, params);
        },
        update(params) {
            return axios.post(common.isdev() + collectionApi.storeStation.update, params);
        },
        queryByCode(params) {
            return axios.post(common.isdev() + collectionApi.storeStation.queryByCode, params);
        },
        pagingQuery(params) {
            return axios.post(common.isdev() + collectionApi.storeStation.pagingQuery, params);
        },
        queryNoPage(params) {
            return axios.post(common.isdev() + collectionApi.storeStation.queryNoPage, params);
        },
        init() {
            return axios.post(common.isdev() + collectionApi.storeStation.init);
        }
    },
    chinaarea: {
        querychinaarea: function (params, sc) {
            axios.post(common.isdev() + collectionApi.area.querychinaarea, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    //服务分类
    serviceCategory:{
    	query: function (params, sc) {
            axios.post(common.isdev() + collectionApi.serviceCategory.query, params)
                .then((r) => {
                    sc(r)
                })
        },
        insert: function (params, sc) {
            axios.post(common.isdev() + collectionApi.serviceCategory.insert, params)
                .then((r) => {
                    sc(r)
                })
        },
        update: function (params, sc) {
            axios.post(common.isdev() + collectionApi.serviceCategory.update, params)
                .then((r) => {
                    sc(r)
                })
        },
        getService: function (params, sc) {
            axios.post(common.isdev() + collectionApi.serviceCategory.getService, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 初始化缓存
        init: function (params, sc) {
            axios.post(common.isdev() + collectionApi.serviceCategory.init, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    stockInfo: {
        queryBatchStockInfoVosByWhCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.stockInfo.queryBatchStockInfoVosByWhCode, params).then((r) => {
                sc(r)
            })
        },
        queryInfoByCode(params,sc) {
            axios.post(common.isdev() + collectionApi.stockInfo.queryInfoByCode, params).then((r)=>{
                sc(r)
            })
        },
    },
    //服务目录
    serviceCatLog:{
    	query: function (params, sc) {
            axios.post(common.isdev() + collectionApi.serviceCatLog.query, params)
                .then((r) => {
                    sc(r)
                })
        },
        insert: function (params, sc) {
            axios.post(common.isdev() + collectionApi.serviceCatLog.insert, params)
                .then((r) => {
                    sc(r)
                })
        },
        update: function (params, sc) {
            axios.post(common.isdev() + collectionApi.serviceCatLog.update, params)
                .then((r) => {
                    sc(r)
                })
        },
        getService: function (params, sc) {
            axios.post(common.isdev() + collectionApi.serviceCatLog.getService, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 初始化缓存
        init: function (params, sc) {
            axios.post(common.isdev() + collectionApi.serviceCatLog.init, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 员工排班
    empScheduling: {
        edit(params) {
            return axios.post(common.isdev() + collectionApi.empScheduling.edit, params);
        },
        copyInsert(params) {
            return axios.post(common.isdev() + collectionApi.empScheduling.copyInsert, params);
        },
        queryByCode(params) {
            return axios.post(common.isdev() + collectionApi.empScheduling.queryByCode, params);
        },
        query(params) {
            return axios.post(common.isdev() + collectionApi.empScheduling.query, params);
        },
        pagingQuery(params) {
            return axios.post(common.isdev() + collectionApi.empScheduling.pagingQuery, params);
        },
        delete(params) {
            return axios.post(common.isdev() + collectionApi.empScheduling.delete, params);
        },
        queryEmpByStoreCode(params) {
            return axios.post(common.isdev() + collectionApi.empScheduling.queryEmp, params)
        },
        queryEmpByStore(params) {
            return axios.post(common.isdev() + collectionApi.empScheduling.queryEmpByStore, params)
        },
        queryEmpByStore2:function (params, sc) {
            axios.post(common.isdev() + collectionApi.empScheduling.queryEmpByStore, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    //员工岗位
    staffJob:{
    	query: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.query, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.queryInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //分页查询岗位
        queryPostnInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.queryPostnInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //分页查询岗位
        queryWorkTypeInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.queryWorkTypeInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //获取相关组织
     	/*getPostOrg: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.getPostOrg, params)
                .then((r) => {
                    sc(r)
                })
        },*/
        //更新岗位
        updateJob: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.updateJob, params)
                .then((r) => {
                    sc(r)
                })
        },
        //同步数据
        init: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.init, params)
                .then((r) => {
                    sc(r)
                })
        },
        //添加工位
        batchWorkTypeInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.batchWorkTypeInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //更新工种
        updateWorkTypeInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.updateWorkTypeInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //获取相关的组织信息
        getPostOrg(params) {
            return axios.post(common.isdev() + collectionApi.staffJob.getPostOrg, params);
        },
        getPostn: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.getPostn, params)
                .then((r) => {
                    sc(r)
                })
        },
        //根据门店查询工种
        queryWorkType: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.queryWorkType, params)
                .then((r) => {
                    sc(r)
                })
        },
         queryEmpPost: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.queryEmpPost, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryPostByEmpCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.staffJob.queryPostByEmpCode, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    skuInfo:{
        cogradient: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuInfo.cogradient, params)
                .then((r) => {
                    sc(r)
                })
        },
        querySkuBrandInfoForPageByVo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.skuInfo.querySkuBrandInfoForPageByVo, params)
                .then((r) => {
                    sc(r)
                })
        },
        querySkuUnitAvailableInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.skuInfo.querySkuUnitAvailableInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getSkuCatLogInfoByCatlogCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.skuInfo.getSkuCatLogInfoByCatlogCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        getSkuAreaInfoByRedisCache: function (params, sc) {
            axios.post(common.isdev() + collectionApi.skuInfo.getSkuAreaInfoByRedisCache, params)
                .then((r) => {
                    sc(r)
                })
        },
        querySkuPackInfoForPageByVo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.skuInfo.querySkuPackInfoForPageByVo, params)
                .then((r) => {
                    sc(r)
                })
        },
        insert: function (params, sc) {
            axios.post(common.isdev() + collectionApi.skuInfo.insert, params)
                .then((r) => {
                    sc(r)
                })
        },
        querySkuInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.skuInfo.querySkuInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        update: function (params, sc) {
            axios.post(common.isdev() + collectionApi.skuInfo.update, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 服务工时
    serviceHours: {
        edit(params) {
            return axios.post(common.isdev() + collectionApi.serviceHours.edit, params);
        },
        pagingQuery(params) {
            return axios.post(common.isdev() + collectionApi.serviceHours.pagingQuery, params);
        },
        insert(params) {
            return axios.post(common.isdev() + collectionApi.serviceHours.insert, params);
        },
        querySub(params) {
            return axios.post(common.isdev() + collectionApi.serviceHours.querySub, params);
        }
    },
    fileUpdata:function (params, sc) {
        axios.post(config.uploadUrl, params)
            .then((r) => {
                sc(r)
            })
    },

   // 组合
    skuComb: {
    	querySkuInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.querySkuInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    	 // 根据商品目录编码获取直属下级所有信息
         getSkuCatLogInfoByCatlogCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.getSkuCatLogInfoByCatlogCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据商品分类编码获取直属下级所有信息
         getSkuCategoryInfoBycategoryCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.getSkuCategoryInfoBycategoryCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCombinationInfoForPageByVo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.queryCombinationInfoForPageByVo, params)
                .then((r) => {
                    sc(r)
                })
        },
        editCombinationInfos: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.editCombinationInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        addOrUpdateCombinationDetailInfoBatch: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.addOrUpdateCombinationDetailInfoBatch, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCombinationDetailInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.getCombinationDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        addOrUpdateCombinationPriceInfoBatch: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.addOrUpdateCombinationPriceInfoBatch, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCombinationPriceInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.getCombinationPriceInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        addOrUpdateCombinationUseRangeBatch: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.addOrUpdateCombinationUseRangeBatch, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCombinationUseRange: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.getCombinationUseRange, params)
                .then((r) => {
                    sc(r)
                })
        },
        getQueryService: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.getQueryService, params)
                .then((r) => {
                    sc(r)
                })
        },
        getComGory: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.getComGory, params)
                .then((r) => {
                    sc(r)
                })
        },
        getComLog: function(params, sc) {
            axios.post(common.isdev() + collectionApi.skuComb.getComLog, params)
                .then((r) => {
                    sc(r)
                })
        },

    },
    //服务商品关系数量
    serviceSku:{
        queryServiceSkuRelationInfoForPageByVo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.serviceSku.queryServiceSkuRelationInfoForPageByVo, params)
                .then((r) => {
                    sc(r)
                })
        },
        editServiceSkuRelationInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.serviceSku.editServiceSkuRelationInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    mainBusiness: {
        queryDispatchEmpDetailInfoNoPage:function (params, sc) {
            axios.post(common.isdev() + collectionApi.mainBusiness.queryDispatchEmpDetailInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryServiceWorkTypeInfoNoPage:function (params, sc) {
            axios.post(common.isdev() + collectionApi.mainBusiness.queryServiceWorkTypeInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCar(params) {
            return axios.post(common.isdev() + collectionApi.mainBusiness.queryCar, params);
        },
        queryTechnicianListByDate(params) {
            return axios.post(common.isdev() + collectionApi.mainBusiness.queryTechnicianListByDate, params)
        },
        queryStationListByDate(params) {
            return axios.post(common.isdev() + collectionApi.mainBusiness.queryStationListByDate, params)
        },
        // getTechnicianDetailByDate(params) {
        //     return axios.post(common.isdev() + collectionApi.mainBusiness.getTechnicianDetailByDate, params)
        // },
        getStationDetailByDate(params,sc) {
            return axios.post(common.isdev() + collectionApi.mainBusiness.getStationDetailByDate, params)
            .then((r) => {
                sc(r)
            })
        },
        getInfoByCode:function (params, sc) {
            axios.post(common.isdev() + collectionApi.mainBusiness.getInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        getTechnicianDetail(params) {
            return axios.post(common.isdev() + collectionApi.mainBusiness.getTechnicianDetail, params)
        },
        getAllTechnicianDetail(params) {
            return axios.post(common.isdev() + collectionApi.mainBusiness.getAllTechnicianDetail, params)                                                
        },
        queryEmpByStoreWorkTypeStation: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mainBusiness.queryEmpByStoreWorkTypeStation, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertDispatchOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mainBusiness.insertDispatchOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        editDispatchDetailInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mainBusiness.editDispatchDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    dailyfill:{
        dailyfillQuerySku: function (params, sc) {
            axios.post(common.isdev() + collectionApi.dailyfill.dailyfillQuerySku, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertReplenishmentPlanInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.dailyfill.insertReplenishmentPlanInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        editReplenishmentPlanDetailInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.dailyfill.editReplenishmentPlanDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateReplenishmentPlanInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.dailyfill.updateReplenishmentPlanInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryReplenishmentPlanInfos:function (params, sc) {
            axios.post(common.isdev() + collectionApi.dailyfill.queryReplenishmentPlanInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        getReplenishmentPlanInfoByCode:function (params, sc) {
            axios.post(common.isdev() + collectionApi.dailyfill.getReplenishmentPlanInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        getReplenishmentPlanDetailInfoByCode:function (params, sc) {
            axios.post(common.isdev() + collectionApi.dailyfill.getReplenishmentPlanDetailInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    ownPurchase: {
        search: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ownPurchase.search, params)
                .then((r) => {
                    sc(r)
                })
        },
        editSelfPurchaseBatchInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ownPurchase.editSelfPurchaseBatchInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据门店code、 sku状态查询
        querySelfPurchaseOrderInfoNoPage: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ownPurchase.querySelfPurchaseOrderInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 获取指定状态采购单
        querySelfPurchaseBatchInfoNoPage: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ownPurchase.querySelfPurchaseBatchInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 删除已暂存自采订单
        delPurchaseBatch: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ownPurchase.delPurchaseBatch, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 打印预览
        printOrder: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ownPurchase.printOrder, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 自采到货处理
    arriveHandle: {
        query(params) {
            return axios.post(common.isdev() + collectionApi.arriveHandle.query, params)
        },
        getDetailByCode(params) {
            return axios.post(common.isdev() + collectionApi.arriveHandle.getDetailByCode, params)
        },
        arriveComfirm(params) {
            return axios.post(common.isdev() + collectionApi.arriveHandle.arriveComfirm, params)
        },
        print(params) {
            return axios.post(common.isdev() + collectionApi.arriveHandle.print, params)
        },
        // 授权自采
        ownPurchaseRequirement(params) {
            return axios.post(common.isdev() + collectionApi.arriveHandle.ownPurchaseRequirement, params)
        }
    },
    allot:{
        queryStockInfoVosBySku: function (params, sc) {
            axios.post(common.isdev() + collectionApi.allot.queryStockInfoVosBySku, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    requirement:{
        queryPrSkuDetailInfos: function (params, sc) {
            axios.post(common.isdev() + collectionApi.requirement.queryPrSkuDetailInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        querySkuPriceInfoBySkuCodeSet:function (params, sc) {
            axios.post(common.isdev() + collectionApi.requirement.querySkuPriceInfoBySkuCodeSet, params)
                .then((r) => {
                    sc(r)
                })
        },
        immediateAttentionByCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.requirement.immediateAttentionByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertPurchaseOrderAndPoSkuInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.requirement.insertPurchaseOrderAndPoSkuInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        operatorRequirementInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.requirement.operatorRequirementInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        querySupplierBySkuCodeAndStoreCodes: function (params, sc) {
            axios.post(common.isdev() + collectionApi.requirement.querySupplierBySkuCodeAndStoreCodes, params)
                .then((r) => {
                    sc(r)
                })
        },
        generatePdfReport: function (params, sc) {
            axios.post(common.isdev() + collectionApi.requirement.generatePdfReport, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 组合分类
    groupClass: {
        // 根据商品分类编码获取直属下级所有信息
        getSubInfoByCode(params) {
            return axios.post(common.isdev() + collectionApi.groupClass.getSubInfoByCode, params)
        },
        insert(params) {
            return axios.post(common.isdev() + collectionApi.groupClass.insert, params)
        },
        update(params) {
            return axios.post(common.isdev() + collectionApi.groupClass.update, params)
        },
        query(params) {
            return axios.post(common.isdev() + collectionApi.groupClass.query, params)
        },
        init() {
            return axios.post(common.isdev() + collectionApi.groupClass.init, {})
        },
    },
    // 组合目录
    groupCatalog: {
        // 根据商品目录编码获取直属下级所有信息
        getSubInfoByCode(params) {
            return axios.post(common.isdev() + collectionApi.groupCatalog.getSubInfoByCode, params)
        },
        insert(params) {
            return axios.post(common.isdev() + collectionApi.groupCatalog.insert, params)
        },
        update(params) {
            return axios.post(common.isdev() + collectionApi.groupCatalog.update, params)
        },
        query(params) {
            return axios.post(common.isdev() + collectionApi.groupCatalog.query, params)
        },
        init() {
            return axios.post(common.isdev() + collectionApi.groupCatalog.init, {})
        },
    },
    //审批流
    approval:{
    	query: function (params, sc) {
            axios.post(common.isdev() + collectionApi.approval.query, params)
                .then((r) => {
                    sc(r)
                })
        },
        ajustByCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.approval.ajustByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        getDetails: function (params, sc) {
            axios.post(common.isdev() + collectionApi.approval.getDetails, params)
                .then((r) => {
                    sc(r)
                })
        },
    	agree: function (params, sc) {
            axios.post(common.isdev() + collectionApi.approval.agree, params)
                .then((r) => {
                    sc(r)
                })
        },
        reject: function (params, sc) {
            axios.post(common.isdev() + collectionApi.approval.reject, params)
                .then((r) => {
                    sc(r)
                })
        },
        WfDetailInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.approval.WfDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 卡销售单
    cardSale: {
        getCardInfoByCode(params) {
            return axios.post(common.isdev() + collectionApi.cardSale.getCardInfoByCode, params)
        },
        toVoid(params) {
            return axios.post(common.isdev() + collectionApi.cardSale.toVoid, params)
        },
        insert(params) {
            return axios.post(common.isdev() + collectionApi.cardSale.insert, params)
        },
        update(params) {
            return axios.post(common.isdev() + collectionApi.cardSale.update, params)
        },
        queryCardSalesOrderInfos: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardSale.queryCardSalesOrderInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCardSaleInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardSale.queryCardSaleInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 卡信息查询
        queryCardInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardSale.queryCardInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryRange(params) {
            return axios.post(common.isdev() + collectionApi.cardSale.queryRange, params)
        },
        getCardSalesOrderInfo(params) {
            return axios.post(common.isdev() + collectionApi.cardSale.getCardSalesOrderInfo, params)
        },
        editCardSalesPayment(params) {
            return axios.post(common.isdev() + collectionApi.cardSale.editCardSalesPayment, params)
        },
        editCardSalesInvoice(params) {
            return axios.post(common.isdev() + collectionApi.cardSale.editCardSalesInvoice, params)
        },
        queryFileInfo(params) {
            return axios.post(common.isdev() + collectionApi.cardSale.queryFileInfo, params)
        }
    },
    ticketTemlate:{
        queryCouponTemplateInfos: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketTemlate.queryCouponTemplateInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertCouponTemplateInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketTemlate.insertCouponTemplateInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateCouponTemplateInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketTemlate.updateCouponTemplateInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        editCouponTemplateDetailInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketTemlate.editCouponTemplateDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCouponTemplateDetailInfoNoPage: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketTemlate.queryCouponTemplateDetailInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        editCouponTemplateUseRangeInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketTemlate.editCouponTemplateUseRangeInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCouponTemplateUseRangeInfoNoPage: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketTemlate.queryCouponTemplateUseRangeInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        editCouponTemplatePriceRangeInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketTemlate.editCouponTemplatePriceRangeInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCouponTemplatePriceRangeInfoNoPage: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketTemlate.queryCouponTemplatePriceRangeInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        releaseCouponTemplateInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketTemlate.releaseCouponTemplateInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    carTemlate:{
        insertCardTemplateInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.insertCardTemplateInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCardTemplateInfoByCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.getCardTemplateInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        editCardTemplateDetailInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.editCardTemplateDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCardTemplateDetailInfoNoPage: function (params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.queryCardTemplateDetailInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        batchAddOrEditCardTemplateUseRangeInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.batchAddOrEditCardTemplateUseRangeInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCardTemplateUseRangeInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.queryCardTemplateUseRangeInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCardTemplateInfos: function (params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.queryCardTemplateInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateCardTemplateInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.updateCardTemplateInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCardTemplateRechargeRangeInfos: function (params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.queryCardTemplateRechargeRangeInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryMainInfoCard: function(params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.queryMainInfoCard, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryDetailInfoCard: function(params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.queryDetailInfoCard, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryShouldAreaCard: function(params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.queryShouldAreaCard, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryMadeDetail: function(params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.queryMadeDetail, params)
            .then((r) => {
                sc(r)
            })
        },
        queryMakeCardInfos: function(params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.queryMakeCardInfos, params)
            .then((r) => {
                sc(r)
            })
        },
        cleanCardTemplateInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.cleanCardTemplateInfo, params)
            .then((r) => {
                sc(r)
            })
        },
        releaseCardTemplateInfo:function(params, sc) {
            axios.post(common.isdev() + collectionApi.carTemlate.releaseCardTemplateInfo, params)
            .then((r) => {
                sc(r)
            })
        },
    },
    // 券管理
    ticketManage: {
    	/*查询总数*/
    	queryTableTotal: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.queryTableTotal, params)
                .then((r) => {
                    sc(r)
                })
        },
    	/*查询页*/
    	queryTableList: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.queryTableList, params)
                .then((r) => {
                    sc(r)
                })
        },
        
        /*查询券价格*/
    	queryCouponPriceInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.queryCouponPriceInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
         // 查询履历
        queryRecordFrozen: function(params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.queryRecordFrozen, params)
                .then((r) => {
                    sc(r)
                })
        },
         // 冻结或解冻
        frozenOrNot: function(params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.frozenOrNot, params)
                .then((r) => {
                    sc(r)
                })
        },
          // 查询券的详细信息
        getCardDetail: function(params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.getCardDetail, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 查询券的详细信息
        queryMadeDetail: function(params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.queryMadeDetail, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryMainInfoCard: function(params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.queryMainInfoCard, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryShouldAreaCoupon: function(params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.queryShouldAreaCoupon, params)
                .then((r) => {
                    sc(r)
                })
        },
   		queryStoreStatus: function(params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.queryStoreStatus, params)
                .then((r) => {
                    sc(r)
                })
        },
        /*批次制券*/
        makeCouponPici: function(params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.makeCouponPici, params)
                .then((r) => {
                    sc(r)
                })
        },
      /*  getCouponListByCustomer: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.getCouponListByCustomer, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCouponInfoByCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.getCouponInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryOrderServiceCouponInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.ticketManage.queryOrderServiceCouponInfo, params)
                .then((r) => {
                    sc(r)
                })
        },*/
    },
    // 卡管理
    cardManage: {
        queryTableList: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.queryTableList, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryTableTotal: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.queryTableTotal, params)
                .then((r) => {
                    sc(r)
                })
        },
        makeCardPici: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.makeCardPici, params)
                .then((r) => {
                    sc(r)
                })
        },
        ruinsPici: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.ruinsPici, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 查询卡的详细信息
        getCardDetail: function(params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.getCardDetail, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 冻结或解冻
        frozenOrNot: function(params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.frozenOrNot, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 作废
        cancelCard: function(params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.cancelCard, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 查询履历
        queryRecordFrozen: function(params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.queryRecordFrozen, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 查询门店是否制卡
        queryStoreStatus: function(params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.queryStoreStatus, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据卡编码查询卡详情
        getCardInfoByCode: function(params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.getCardInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryusableCardInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.queryusableCardInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryusableCardInfos: function(params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.queryusableCardInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryOrderServiceCardLockNum: function(params, sc) {
            axios.post(common.isdev() + collectionApi.cardManage.queryOrderServiceCardLockNum, params)
                .then((r) => {
                    sc(r)
                })
        }
    },
     // 卡充值
    cardPay: {
        search: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardPay.search, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertCardRecharge: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardPay.insertCardRecharge, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateCardRecharge: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardPay.updateCardRecharge, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCardRechargeInfoByCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardPay.getCardRechargeInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCardRechargePaymentInfoNoPage: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardPay.queryCardRechargePaymentInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        editCardRechargePaymentInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardPay.editCardRechargePaymentInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCardRechargeInvoiceInfoNoPage: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardPay.queryCardRechargeInvoiceInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        editCardRechargeInvoiceInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardPay.editCardRechargeInvoiceInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCardDetial: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardPay.getCardDetial, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCardRang: function (params, sc) {
            axios.post(common.isdev() + collectionApi.cardPay.getCardRang, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    outInWarehouse:{
    	 queryOutInventoryList: function (params, sc) {
            axios.post(common.isdev() + collectionApi.outInWarehouse.queryOutInventoryList, params)
                .then((r) => {
                    sc(r)
                })
        },
         queryInventoryList: function (params, sc) {
            axios.post(common.isdev() + collectionApi.outInWarehouse.queryInventoryList, params)
                .then((r) => {
                    sc(r)
                })
        },
   		exportOutInventoryList: function (params, sc) {
            axios.post(common.isdev() + collectionApi.outInWarehouse.exportOutInventoryList, params)
                .then((r) => {
                    sc(r)
                })
        },
        exportInventoryList: function (params, sc) {
            axios.post(common.isdev() + collectionApi.outInWarehouse.exportInventoryList, params)
                .then((r) => {
                    sc(r)
                })
        },
        download: function (params, sc) {
            axios.post(common.isdev() + collectionApi.outInWarehouse.download, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    returnCard:{
        getCardRefundOrderInfoByCardCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.returnCard.getCardRefundOrderInfoByCardCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCustomInfoByMobilePhone: function (params, sc) {
            axios.post(common.isdev() + collectionApi.returnCard.queryCustomInfoByMobilePhone, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCardRefundOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.returnCard.queryCardRefundOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        submitRefundOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.returnCard.submitRefundOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertCardRefundOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.returnCard.insertCardRefundOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateCardRefundOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.returnCard.updateCardRefundOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        withDrawCardRefundOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.returnCard.withDrawCardRefundOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        cancelCardRefundOrderInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.returnCard.cancelCardRefundOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCardRefundPaymentInfoNoPage: function(params, sc) {
            axios.post(common.isdev() + collectionApi.returnCard.queryCardRefundPaymentInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        editCardRefundPaymentInfo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.returnCard.editCardRefundPaymentInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 检查模板
    checkTemplate: {
        search: function (params, sc) {
            axios.post(common.isdev() + collectionApi.checkTemplate.search, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCheckTemplateInfoByCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.checkTemplate.getCheckTemplateInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertCheckTemplateInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.checkTemplate.insertCheckTemplateInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateCheckTemplateInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.checkTemplate.updateCheckTemplateInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCheckTemplateInfoNoPage: function (params, sc) {
            axios.post(common.isdev() + collectionApi.checkTemplate.queryCheckTemplateInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        editCheckTemplateDetailInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.checkTemplate.editCheckTemplateDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCheckTemplateDetailInfoNoPage: function (params, sc) {
            axios.post(common.isdev() + collectionApi.checkTemplate.queryCheckTemplateDetailInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        editCheckTemplateUseRangeInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.checkTemplate.editCheckTemplateUseRangeInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCheckTemplateUseRangeInfoNoPage: function (params, sc) {
            axios.post(common.isdev() + collectionApi.checkTemplate.queryCheckTemplateUseRangeInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    //退票
    refund:{
    	query: function (params, sc) {
            axios.post(common.isdev() + collectionApi.refund.query, params)
                .then((r) => {
                    sc(r)
                })
        },
        chooseRefund: function (params, sc) {
            axios.post(common.isdev() + collectionApi.refund.chooseRefund, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertRefund: function (params, sc) {
            axios.post(common.isdev() + collectionApi.refund.insertRefund, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryRefund: function (params, sc) {
            axios.post(common.isdev() + collectionApi.refund.queryRefund, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateRefund: function (params, sc) {
            axios.post(common.isdev() + collectionApi.refund.updateRefund, params)
                .then((r) => {
                    sc(r)
                })
        },
        submitRefund: function (params, sc) {
            axios.post(common.isdev() + collectionApi.refund.submitRefund, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryEmp: function (params, sc) {
            axios.post(common.isdev() + collectionApi.refund.queryEmp, params)
                .then((r) => {
                    sc(r)
                })
        },
        withdrawRefund: function (params, sc) {
            axios.post(common.isdev() + collectionApi.refund.withdrawRefund, params)
                .then((r) => {
                    sc(r)
                })
        },
        cancelRefund: function (params, sc){
            axios.post(common.isdev() + collectionApi.refund.cancelRefund, params)
                .then((r) => {
                    sc(r)
                })
        },

    },
    //人车
   	mancar:{
    	query: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mancar.query, params)
                .then((r) => {
                    sc(r)
                })
        },
        update: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mancar.update, params)
                .then((r) => {
                    sc(r)
                })
        },
        customInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mancar.customInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertCustomInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mancar.insertCustomInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateCustomInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mancar.updateCustomInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertContactInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mancar.insertContactInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryContactInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mancar.queryContactInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateContactInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mancar.updateContactInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertReceiverInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mancar.insertReceiverInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateReceiverInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.mancar.updateReceiverInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryReceiverInfo: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.queryReceiverInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertFinanceInfo: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.insertFinanceInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateFinanceInfo: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.updateFinanceInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryFinanceInfo: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.queryFinanceInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
      	insertCustomVehicleInfo: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.insertCustomVehicleInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
       	queryCustomVehicleInfos: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.queryCustomVehicleInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
      	updateCustomVehicleInfo: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.updateCustomVehicleInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCustomInfoByMobilePhone(params) {
            return axios.post(common.isdev() + collectionApi.mancar.queryCustomInfoByMobilePhone, params)
        },
        queryCompanyInfoByCodesAndPagination: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.queryCompanyInfoByCodesAndPagination, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCustomVehicleInfoByCode: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.getCustomVehicleInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertcertificateTypeInfo: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.insertcertificateTypeInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        querycertificateTypeInfo: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.querycertificateTypeInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updatecertificateTypeInfo: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.updatecertificateTypeInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCertificateTypeInfoByCode: function (params, sc){
            axios.post(common.isdev() + collectionApi.mancar.queryCertificateTypeInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },

    },

    //推荐服务
    serviceRecommend:{
        //新增
        insertServiceRecommendationInfo: function(params, sc){
            axios.post(common.isdev() + collectionApi.serviceRecommon.insert, params)
                .then((r) => {
                    sc(r)
                })
        },
        //服务明细
        queryServiceRecommendationInfos: function(params, sc){
            axios.post(common.isdev() + collectionApi.serviceRecommon.queryServiceRecommendationInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        //推荐服务更新
        updateServiceRecommendationInfo: function(params, sc){
            axios.post(common.isdev() + collectionApi.serviceRecommon.updateServiceRecommendationInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //分页查询
        queryServiceRecommendationInfoNoPage:function(params, sc){
            axios.post(common.isdev() + collectionApi.serviceRecommon.queryServiceRecommendationInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        }
    },
    //推荐服务(售后，新2018年5月30日添加)
    afterSaleServiceRecommend:{
        //售后服务推荐查询
        queryService: function(params, sc){
            axios.post(common.isdev() + "/v2/sku/recommendation/groupByServices.htm", params)
                .then((r) => {
                    sc(r)
                })
        }
    },
    // 促销折扣
    saleDiscount: {
        search: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.search, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertPromotionDiscountOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.insertPromotionDiscountOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updatePromotionDiscountOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.updatePromotionDiscountOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        submitPromotionDiscountOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.submitPromotionDiscountOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 撤销
        withdrawPromotionDiscountOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.withdrawPromotionDiscountOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 作废
        cancelPromotionDiscountOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.cancelPromotionDiscountOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getPromotionDiscountOrderInfoByCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.getPromotionDiscountOrderInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        editPromotionDiscountRuleInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.editPromotionDiscountRuleInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryPromotionDiscountRuleInfoExts: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.queryPromotionDiscountRuleInfoExts, params)
                .then((r) => {
                    sc(r)
                })
        },
        editPromotionDiscountRuleInfoDiscountRuleDetailInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.editPromotionDiscountRuleInfoDiscountRuleDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryPromotionDiscountRuleDetailInfos: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.queryPromotionDiscountRuleDetailInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        getPromotionDiscountRuleDetailInfoByCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.getPromotionDiscountRuleDetailInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        getSkuInfoByCategoryCodeAll: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.getSkuInfoByCategoryCodeAll, params)
                .then((r) => {
                    sc(r)
                })
        },
        getServiceCategoryInfoByCategoryCodeAll: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.getServiceCategoryInfoByCategoryCodeAll, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryServiceAvailableInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.queryServiceAvailableInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getStoreAllPost: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.getStoreAllPost, params)
                .then((r) => {
                    sc(r)
                })
        },
        getStorePostEmp: function (params, sc) {
            axios.post(common.isdev() + collectionApi.saleDiscount.getStorePostEmp, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 供应链
    supplyChain: {
        //库存查询
        queryInventory(params, sc) {
            return axios.post(common.isdev() + '/v1/supplyChain/stockInfo/queryStockInfoVos.htm', params)
                .then((r) => {
                    sc(r)
                })
        },
        //领料模板导出(打印)
        generatePdfReportOutStock(params, sc) {
            return axios.post(common.isdev() + '/v2/supplychain/stockInfo/generatePdfReportOutStock.htm', params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    purchaseOrder: {
        insertPurchaseOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseOrder.insertPurchaseOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        submitPurchaseOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseOrder.submitPurchaseOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryPurchaseSkuDetailBySupplierCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseOrder.queryPurchaseSkuDetailBySupplierCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryPurchaseOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseOrder.queryPurchaseOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        querySupplierInfoNoPageBySupplierInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseOrder.querySupplierInfoNoPageBySupplierInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getPurchaseOrderInfoByCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseOrder.getPurchaseOrderInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        updatePurchaseOrderInfoAndPoSkuInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseOrder.updatePurchaseOrderInfoAndPoSkuInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        cancelPurchaseOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseOrder.cancelPurchaseOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        editPoSkuDetailInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseOrder.editPoSkuDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryContractBySkuAndStoreAndSupplier: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseOrder.queryContractBySkuAndStoreAndSupplier, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 非整车采购退货
    purchaseReturn: {
        search: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseReturn.search, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertPurchaseReturnOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseReturn.insertPurchaseReturnOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updatePurchaseReturnOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseReturn.updatePurchaseReturnOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        submitPurchaseReturnOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseReturn.submitPurchaseReturnOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        cancelPurchaseReturnOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseReturn.cancelPurchaseReturnOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        withdrawPurchaseReturnOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseReturn.withdrawPurchaseReturnOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getPurchaseReturnOrderInfoByCode: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseReturn.getPurchaseReturnOrderInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryPurchaseReturnSkuDetailInfos: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseReturn.queryPurchaseReturnSkuDetailInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        PurchaseReturnSkuDetailInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseReturn.PurchaseReturnSkuDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryStockInfoByStoreSku: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseReturn.queryStockInfoByStoreSku, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryStockDetailBatch: function (params, sc) {
            axios.post(common.isdev() + collectionApi.purchaseReturn.queryStockDetailBatch, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 库存调整 by lwx
    stockAdjust: {
        queryStockAdjustOrderInfos(params) {
            return axios.post(common.isdev() + collectionApi.stockAdjust.queryStockAdjustOrderInfos, params)
        },
        // 查询当前库存数的
        queryBeStockInfo(params) {
            return axios.post(common.isdev() + collectionApi.stockAdjust.queryBeStockInfo, params)
        },
        update(params) {
            return axios.post(common.isdev() + collectionApi.stockAdjust.update, params)
        },
        insert(params) {
            return axios.post(common.isdev() + collectionApi.stockAdjust.insert, params)
        },
        queryByCode(params) {
            return axios.post(common.isdev() + collectionApi.stockAdjust.queryByCode, params)
        },
        submit(params) {
            return axios.post(common.isdev() + collectionApi.stockAdjust.submit, params)
        },
        toVoid(params) {
            return axios.post(common.isdev() + collectionApi.stockAdjust.toVoid, params)
        },
        revoke(params) {
            return axios.post(common.isdev() + collectionApi.stockAdjust.revoke, params)
        },
        queryStockDetailBatch(params) {
            return axios.post(common.isdev() + collectionApi.stockAdjust.queryStockDetailBatch, params)
        },
        queryStockDetailByBatchNo(params) {
            return axios.post(common.isdev() + collectionApi.stockAdjust.queryStockDetailByBatchNo, params)
        },
        // 根据门店查询账期
        queryBeTermInfoNoPage(params) {
            return axios.post(common.isdev() + collectionApi.stockAdjust.queryBeTermInfoNoPage, params)
        }
    },
    // 仓库 by lwx
    warehouse: {
        queryInfoByCode(params) {
            return axios.post(common.isdev() + collectionApi.warehouse.queryInfoByCode, params)
        },
        query(params) {
            return axios.post(common.isdev() + collectionApi.warehouse.query, params)
        }
    },
    // 非整车采购入库 2018年6月1日18点51分张禀奇添加
    notCarSharePurchaseInfo: {
        //条件查询
        queryInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.notCarSharePurchaseInfo.queryInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 详情查询
        getDetailInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.notCarSharePurchaseInfo.getDetailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //入库
        inStockListV2: function (params, sc) {
            axios.post(common.isdev() + collectionApi.notCarSharePurchaseInfo.inStockListV2, params)
                .then((r) => {
                    sc(r)
                })
        }
    },
    // 系统初始化接口
    systemInit: {
        isShowFactory(params) {
            return axios.post(common.isdev() + collectionApi.systemInit.isShowFactory, params)
        }
    },
    vehicleCleaning:{
        orderCompleteByOrderNo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.orderCompleteByOrderNo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCustomVehicleInfoByPlateNumber:function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.getCustomVehicleInfoByPlateNumber, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCertificateTypeInfoByCustom: function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.getCertificateTypeInfoByCustom, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryIsCarWashAndPriceServiceInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.queryIsCarWashAndPriceServiceInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertcertificateTypeInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.insertcertificateTypeInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertOrderInfo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.insertOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateOrderAndServiceInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.updateOrderAndServiceInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateServiceOrderDetailInfoForDisCount:function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.updateServiceOrderDetailInfoForDisCount, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateOrderInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.updateOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        resetServiceOrderInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.resetServiceOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCouponCountByCustomer:function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.getCouponCountByCustomer, params)
                .then((r) => {
                    sc(r)
                })
        },
        getOrderInfoByCondition:function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.getOrderInfoByCondition, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryAllServiceOrderInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.queryAllServiceOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateServiceOrderDatailInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.vehicleCleaning.updateServiceOrderDatailInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 维修工单
    repairOrder: {
        editCustomVehicleAddInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.editCustomVehicleAddInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryCarAddInfos:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.queryCarAddInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryServiceSkuList:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.queryServiceSkuList, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryServicePriceALL:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.queryServicePriceALL, params)
                .then((r) => {
                    sc(r)
                })
        },
        editOrderSkuInfoList:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.editOrderSkuInfoList, params)
                .then((r) => {
                    sc(r)
                })
        },
        getSkuOrderInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.getSkuOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据工单号查询 工单信息
        queryAllOrderInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.queryAllOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据领料状态查询工单
        queryOrderInfoPageForPicking: function(params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.queryOrderInfoPageForPicking, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据单号查询单条领料数据
        queryPickingInfoByOrderNo: function(params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.queryPickingInfoByOrderNo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateSkuOrderOutStockList: function(params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.updateSkuOrderOutStockList, params)
                .then((r) => {
                    sc(r)
                })
        }, 
        // 删除精品sku
        deleteSkuOrderDetailByCondition:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.deleteSkuOrderDetailByCondition, params)
                .then((r) => {
                    sc(r)
                })
        },
        //新新增支付明细接口
        editOrderPaymentInfoList:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.editOrderPaymentInfoList, params)
                .then((r) => {
                    sc(r)
                })
        },
        //新增支付明细
        insertOrderPaymentInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.insertOrderPaymentInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //查询支付明细
        queryOrderPaymentInfoNoPage:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.queryOrderPaymentInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        //删除支付明细
        updateOrderPaymentInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.updateOrderPaymentInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 总编辑接口
        insertOrUpdateOrderInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.insertOrUpdateOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 跟据serviceOrderDetailCode服务明细查询接口
        getServiceOrderDetailInfoByCode:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.getServiceOrderDetailInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        editDispatch:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.editDispatch, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 工单结算
        settlementOrderInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.settlementOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        orderCompleteByOrderNo: function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.orderCompleteByOrderNo, params)
            .then((r) => {
                sc(r)
            })
        },
        preview:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.preview, params)
                .then((r) => {
                    sc(r)
                })
        }, 
        getOutsideOrderDetailInfoByCode:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.getOutsideOrderDetailInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 工单删除
        routeCancelOrderInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.routeCancelOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        //用户电子卡号查询
        queryCardinfoByCustCode:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.queryCardinfoByCustCode, params)
                .then((r) => {
                    sc(r)
                })
        }, 
        toVoidOrderInfo:function (params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.toVoidOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryServiceInfoCodeOrName(params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.queryServiceInfoCodeOrName, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryDispatchDetailInfos(params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.queryDispatchDetailInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        checkCoupon(params, sc) {
            axios.post(common.isdev() + collectionApi.repairOrder.checkCoupon, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    precheck: {
        queryCheckTemplateInfoNoPage(params, sc) {
            axios.post(common.isdev() + collectionApi.precheck.queryCheckTemplateInfoNoPage, params).then((r) => {
                sc(r)
            })
        },
        insertPrecheckOrderInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.precheck.insertPrecheckOrderInfo, params).then((r) => {
                sc(r)
            })
        },
        queryusableCardInfosAndCouponDetailInfos(params, sc) {
            axios.post(common.isdev() + collectionApi.precheck.queryusableCardInfosAndCouponDetailInfos, params).then(r => {
                sc(r)
            })
        },
        queryServiceAvailableInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.precheck.queryServiceAvailableInfo, params).then(r => {
                sc(r)
            })
        },
        uploadbase64Img(params, sc) {
            axios.post(common.isdev() + collectionApi.precheck.uploadbase64Img, params).then(r => {
                sc(r)
            })
        },
        queryServiceInfoByCaraddcode(params, sc) {
            axios.post(common.isdev() + collectionApi.precheck.queryServiceInfoByCaraddcode, params).then(r => {
                sc(r)
            })
        },
        getPrecheckOrderInfoByCode(params, sc) {
            axios.post(common.isdev() + collectionApi.precheck.getPrecheckOrderInfoByCode, params).then(r => {
                sc(r)
            })
        },
        updatePrecheckOrderInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.precheck.updatePrecheckOrderInfo, params).then(r => {
                sc(r)
            })
        },
        generatePdfprecheckOrder(params, sc) {
            axios.post(common.isdev() + collectionApi.precheck.generatePdfprecheckOrder, params).then(r => {
                sc(r)
            })
        },
        editPrecheckRecommendationInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.precheck.editPrecheckRecommendationInfo, params).then(r => {
                sc(r)
            })
        },
        checkRecommendationAndAnswerInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.precheck.checkRecommendationAndAnswerInfo, params).then(r => {
                sc(r)
            })
        },
    },
    factory: {
        queryFactoryInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.factory.queryFactoryInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    // 预约单
    appointment: {
        queryBookOrderInfoList(params, sc) {
            axios.post(common.isdev() + collectionApi.appointment.queryBookOrderInfoList, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryBookOrderHistoryList(params, sc) {
            axios.post(common.isdev() + collectionApi.appointment.queryBookOrderHistoryList, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryBookOrderDetailListNoPage(params, sc) {
            axios.post(common.isdev() + collectionApi.appointment.queryBookOrderDetailListNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        groupByServices(params, sc) {
            axios.post(common.isdev() + collectionApi.appointment.groupByServices, params)
                .then((r) => {
                    sc(r)
                })
        },
        cancelBookOrderInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.appointment.cancelBookOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        generatePdfReportBookOrderInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.appointment.generatePdfReportBookOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getCategoryInfoByStoreCode(params, sc) {
            axios.post(common.isdev() + collectionApi.appointment.getCategoryInfoByStoreCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryAllInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.appointment.queryAllInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        getServiceInfoByStoreCodeAndCategoryCode(params, sc) {
            axios.post(common.isdev() + collectionApi.appointment.getServiceInfoByStoreCodeAndCategoryCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        queryAllBookOrder(params, sc) {
            axios.post(common.isdev() + collectionApi.appointment.queryAllBookOrder, params)
                .then((r) => {
                    sc(r)
                })
        },
        insertOrUpdateBookOrderInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.appointment.insertOrUpdateBookOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        updateBookOrderInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.appointment.updateBookOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        
    },
    // 券
    coupon: {
        queryCouponPriceInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.coupon.queryCouponPriceInfo, params)
                .then((r) => {
                    sc(r)
                })
        }, 
        queryCouponInfos(params, sc) {
            axios.post(common.isdev() + collectionApi.coupon.queryCouponInfos, params)
                .then((r) => {
                    sc(r)
                })
        }, 
    },
    // 券销售
    couponSale: {
        queryCouponSalesOrderInfosByInvoice(params, sc) {
            axios.post(common.isdev() + collectionApi.couponSale.queryCouponSalesOrderInfosByInvoice, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 销售单分页查询
        queryCouponSalesOrderInfos(params, sc) {
            axios.post(common.isdev() + collectionApi.couponSale.queryCouponSalesOrderInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 新增券销售单
        insertCouponSalesOrder(params, sc) {
            axios.post(common.isdev() + collectionApi.couponSale.insertCouponSalesOrder, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 更新券销售单
        updateCouponSalesOrder(params, sc) {
            axios.post(common.isdev() + collectionApi.couponSale.updateCouponSalesOrder, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 作废券销售单
        cancelCouponSalesOrderInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.couponSale.cancelCouponSalesOrderInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 根据券销售单号查询销售单明细
        getCouponSalesOrderInfoByCode(params, sc) {
            axios.post(common.isdev() + collectionApi.couponSale.getCouponSalesOrderInfoByCode, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 支付
        editCouponSalesPaymentInfo(params, sc) {
            axios.post(common.isdev() + collectionApi.couponSale.editCouponSalesPaymentInfo, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
    storeAppointmentService: {
        // 门店推荐服务分页查询
        queryStoreServiceInfos(params, sc) {
            axios.post(common.isdev() + collectionApi.storeAppointmentService.queryStoreServiceInfos, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 门店推荐服务查询不分页
        queryStoreServiceInfoNoPage(params, sc) {
            axios.post(common.isdev() + collectionApi.storeAppointmentService.queryStoreServiceInfoNoPage, params)
                .then((r) => {
                    sc(r)
                })
        },
        // 门店推荐服务新增
        editStoreServiceInfoList(params, sc) {
            axios.post(common.isdev() + collectionApi.storeAppointmentService.editStoreServiceInfoList, params)
                .then((r) => {
                    sc(r)
                })
        },
    },
}
