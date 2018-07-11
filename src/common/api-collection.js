export default {
    // /v2/supplychain/supplychain
    analysisExcel: '/v2/supplychain/file/inventorySkuDetailExcelFile.htm',
    currentTime:'/v2/system/getCurrentTime.htm',
    ref: {
        getRefDetailInfo: '/v1/sys/ref/get.htm',
        getRefDetailInfoQuery: '/v1/sys/ref/query.htm',
        getRefDetailInfoPages: '/v1/sys/refDetail/query.htm',
        queryRefDetail:"/v1/sys/refDetail/get.htm",
        query: '/v1/sys/refDetail/query.htm',
        seq: '/v1/sys/seq/getSequence.htm',
        upseq: '/v1/sys/seq/updateSequenceInfo.htm',
        shseq: '/v1/sys/seq/querySequenceInfo.htm',
        inseq: '/v1/sys/seq/insertSequenceInfo.htm',
        getseq: '/v1/sys/seq/getSequenceList.htm',
        sycseq: '/v1/sys/seq/initSequenceToCache.htm',
        seqList: '/v1/sys/seq/getSequenceList.htm'
    },
    area: {
        charea: '/v1/sys/salesArea/getSalesAreaInfoByAreaCode.htm',
        dlyarea: '/v1/sys/deliveryArea/getDeliveryAreaInfoByAreaCode.htm',
        getorg: '/v1/sys/org/get.htm',
        shopinfo: '/v1/sys/store/queryStoreInfoBySalesCode.htm',
        caigouarea: '/v1/sys/purchasingArea/getPurchasingAreaInfoByAreaCode.htm',
        querychinaarea:'/v2/sys/chinaArea/queryChinaAreaInfoNoPage.htm',
        china: '/v1/sys/chinaArea/getChinaAreaInfoByAreaCode.htm'
    },
    store:{
        queryShopInfo: "/v1/sys/store/get.htm",
        queryByPage: '/v2/sys/store/queryStoreInfo.htm',
        addStore: '/v1/sys/store/insert.htm',
        updateStore: '/v1/sys/store/update.htm',
        updateStore2: '/v2/sys/store/update.htm',
        queryAllInfo: '/v1/sys/store/queryAllInfo.htm',
        queryByCode: '/v1/sys/store/get.htm',
        financeSave: '/v2/system/storeFinance/editStoreFinanceInfo.htm',
        carSave: '/v1/sys/store/batchEditStoreCarInfos.htm',
        queryCar: '/v1/sys/store/queryStoreCarInfo.htm',
        queryFinance: '/v2/system/storeFinance/queryStoreFinanceInfoNoPage.htm',
        dataSync: '/v1/sys/store/initRedisCache.htm',
        getCarStyle: '/v1/sys/car/queryExactCar.htm'
    },
    // 调拨相关清单
    allotTicket: {
        query: '/v2/report/supplychain/queryTransferOutReport.htm'
    },
    // 服务固定价格
    serviceStatic: {
        queryByPage: '/v2/sku/service/queryServicePriceInfos.htm',
        queryByCode: '/v2/sku/service/queryServicePriceInfoNoPage.htm',
        add: '/v2/sku/service/insertServicePriceInfoList.htm',
        edit: '/v2/sku/service/editServicePriceInfos.htm',
        deleteItem: '/v2/sku/service/editServicePriceInfos.htm',
        queryAmountByCode: '/v2/sku/service/ssr/getServiceSkuRelationInfoByServiceCodeFromRedisCache.htm'
    },
    car:{
        queryCarInfoByCarSearch: '/v2/sys/car/queryCarInfoByCarSearch.htm'
    },
    skuData: {
        getInfo: '/v2/sku/skuInfo/query.htm'
    },
    storeStation: {
        insert: '/v2/system/storestation/insertStoreStationInfo.htm',
        update: '/v2/system/storestation/updateStoreStationInfo.htm',
        queryByCode: '/v2/system/storestation/getStoreStationInfoByCode.htm',
        queryNoPage: '/v2/system/storestation/queryStoreStationInfoNoPage.htm',
        pagingQuery: '/v2/system/storestation/queryStoreByStationTypeCodePage.htm',
        init: '/v2/system/storestation/initRedisCache.htm'
    },
    suitScope: {
        getUserAvailableInfo: '/v1/getUserAvailableInfo.htm',
        getReferenceInfo: '/v1/sys/ref/get.htm',
        queryShopInfo: '/v1/sys/store/queryStoreInfoBySalesCode.htm',
    },
    toLogin: {
        changeLoginInfo: '/v1/login/changeLoginInfo.htm',
        getUserMenu: '/v1/getUserMenu.htm',
        getLoginInfo: '/v1/getLoginInfo.htm',
        getOrg: '/v1/login/getOrg.htm',
        getUserAvailableInfo: '/v1/getUserAvailableInfo.htm',
        getEntrepot: '/v1/supplyChain/getWarehouseInfoWithNoPage/get.htm',
        logout:'/v1/logout.htm'
    },
    accessory: {
        del: '/v1/fileSys/file/delete/file.htm',
        pvw: '/v1/fileSys/file/preview/html.htm',
        list: '/v1/fileSys/file/selectByRelationCode.htm',
        download: '/v1/fileSys/file/download.htm'
    },
    checkPlan: {
        queryByCondition: '/v2/supplychain/inventory/queryInventoryPlanInfoNoPage.htm',
        query: '/v2/supplychain/inventory/queryInventoryPlanInfos.htm',
        queryAccordingCode: '/v2/supplychain/inventory/getInventoryPlanInfoByCode.htm',
        addMain: '/v2/supplychain/inventory/insertInventoryPlanInfo.htm',
        productPageByPlan: '/v2/supplychain/inventory/generateInventoryInfo.htm',
        editCheckPlan: '/v2/supplychain/inventory/editInventoryPlanInfo.htm',
        suppliLever: '/v1/sys/SalesArea/getSalesAreaInfoByUserAvailableOnlyOneLevel.htm',
        categorySku: '/v1/sku/category/getSkuCategoryInfoBycategoryCode.htm',
        regulation: '/v2/supplychain/inventory/editInventoryPlanRuleInfo.htm',
        skuInfo: '/v1/sku/skuInfo/query.htm',
        stop: '/v2/supplychain/inventory/cancelInventoryPlanInfo.htm',
        skuDetailInfo:'/v1/sku/skuInfo/get.htm',
        skuInfoV2: '/v2/sku/skuInfo/query.htm'
    },
    blitem: {
        creatTampblitem: '/v2/supplychain/inventory/insertInventoryInfo.htm',
		getBlitemSearch: '/v2/supplychain/inventory/queryInventoryInfos.htm',
		creatBlitemDetails: '/v2/supplychain/inventory/createInventoryDetailsByInventoryNo.htm',
		getBlitemDetails: '/v2/supplychain/inventory/getInventoryInfoByCode.htm',
        BlitemEditDetails: '/v2/supplychain/inventory/editInventorySkuDetailInfo.htm',
        BlitemdetailsAnalysis: '/v2/fileSys/file/inventorySkuDetailExcelFile.htm'
    },
    purchaseContract: {
        search: '/v2/supplychain/purchase/queryPurchaseContractInfos.htm',
        invalidContract: '/v2/supplychain/purchase/cancelPurchaseContractInfo.htm',
        addPurchase: '/v2/supplychain/purchase/insertPurchaseContractInfo.htm',
        eidtPurchase: '/v2/supplychain/purchase/updatePurchaseContractInfo.htm',
        PurchaseInfo: '/v2/supplychain/purchase/getPurchaseContractInfoByCode.htm',
        eidtUseRange: '/v2/supplychain/purchase/editPurchaseContractUseRangeInfo.htm',
        getUseRange: '/v2/supplychain/purchase/queryPurchaseContractUseRangeInfoNoPage.htm',
        eidtDetail: '/v2/supplychain/purchase/editPurchaseContractDetailInfo.htm',
        getdetail: '/v2/supplychain/purchase/queryPurchaseContractDetailInfoNoPage.htm',
        supplierList: '/v2/supplychain/supplier/querySupplierInfoNoPage.htm',
        contractApproSubmit:'/v2/supplychain/purchase/submitPurchaseContractInfo.htm',
        contractApprovalWithdrawn:'/v2/supplychain/purchase/approvalWithdrawnPurchaseContractInfo.htm',
        contractdetailsAnalysis:'/v2/fileSys/file/purchaseContractDetailExcelFile.htm',
    },
    staff: {
        search: '/v2/sys/emp/queryMainInfo.htm',
        creatStaff: '/v2/sys/emp/insertEmployeeInfo.htm',
        eidtStaff: '/v2/sys/emp/updateEmployeeInfo.htm',
        getDetail: '/v1/sys/emp/queryAllInfo.htm',
        resetPassword: '/v1/sys/emp/adminUpdatePassword.htm',
    },
    skuCar: {
        skuCarsearch: "/v2/sku/skuCarRelationInfo/querySkuCarRelationInfoPage.htm",
        carSkuSearch: "/v2/sku/skuCarRelationInfo/querySkuCarRelationInfoListPage.htm",
        skuCarAdd:'/v1/sku/skuCarRelationInfo/insert.htm',
        skuCarEidt: "/v1/sku/skuCarRelationInfo/update.htm",
        skuCarEidtList: '/v2/sku/skuCarRelationInfo/editSkuCarRelationInfos.htm',
        carAddEidt:'/v2/sku/skucarrelationinfo/editSkuCarAddRelationInfo.htm',
        getSkuCar:'/v2/sku/skuCarRelationInfo/querySkuCarRelationInfoBySkuCode.htm',
        getSkuCarAdd: "/v2/sku/skucarrelationinfo/getSkuCarAddRelationInfoByCode.htm",
        getCarCode: "/v1/sys/car/queryExactCar.htm",
        getCarAdd:"/v2/sys/car/queryCarAddInfoByFunnel.htm"
    },
    clock: {
        getStationList: '/v2/clearingsettlement/dispatch/queryDispatchDetailInfoNoPage.htm',
        getTechnicianList: '/v2/clearingsettlement/dispatch/queryDispatchEmpDetailInfoNoPage.htm',
        getEmpList: '/v2/clearingsettlement/dispatch/getEmpCodeByStationCode.htm',
        closeCard: '/v2/clearingsettlement/dispatch/closeTheCard.htm',
        openCard: '/v2/clearingsettlement/dispatch/openTheCard.htm',
        getDispatch: '/v2/clearingsettlement/dispatch/getDispatchOrderInfoByEmpCode.htm'
    },
    accounting: {
        query: '/v2/system/term/queryBeTermInfos.htm',
        queryBycode: '/v2/system/term/getBeTermInfoByCode.htm',
        editState: '/v2/system/term/updateBeTermInfo.htm'
    },
    supplier: {
        querySupplierList: '/v2/supplychain/supplier/querySupplierInfo.htm',
        insertSupplierInfo: '/v2/supplychain/supplier/insertSupplierInfo.htm',
        updataSupplierInfo: '/v2/supplychain/supplier/updateSupplierInfo.htm',
        addSupplierSuitScope: '/v2/supplychain/supplier/batchAddOrEditSupplierUseRangeInfo.htm',
        querySupplierSuitScope: '/v2/supplychain/supplier/querySupplierUseRangeInfo.htm',
        addSupplierInvoice: '/v2/supplyChain/supplierInvoice/batchEditSupplierInvoiceInfos.htm',
        getSupplierInfo: '/v2/supplychain/supplier/getSupplierInfoByCode.htm',
        getSupplierInvoiceInfo: '/v2/supplychain/supplierInvoice/getSupplierInvoiceInfoByCode.htm',
        getSupplierContractInfo: '/v2/supplychain/purchase/queryPurchaseContractInfoNoPage.htm'
    },
    adjust: {
        addAdjust: "/v2/supplychain/adjust/insertAdjustOrderInfo.htm",
        queryAdjust: "/v2/supplychain/adjust/queryAdjustOrderInfos.htm",
        addAdjustQuery:"/v2/supplychain/adjust/getAdjustOrderInfoByCode.htm",
        addAdjustDetail:"/v2/supplychain/adjust/editAdjustSkuDetailInfo.htm",
        queryAdjustDetail: '/v2/supplychain/adjust/queryAdjustSkuDetailInfos.htm',
        submitExamine: "/v2/supplychain/adjust/submitAdjustOrderInfo.htm",
        upDataAdjust: "/v2/supplychain/adjust/updateAdjustOrderInfo.htm"   ,
        cancelAdjustOrderInfo:'/v2/supplychain/adjust/cancelAdjustOrderInfo.htm',
        withdrawAdjustOrderInfo:'/v2/supplychain/adjust/withdrawAdjustOrderInfo.htm',
        getAdjustSkuDetailInfoByCode:'/v2/supplychain/adjust/getAdjustSkuDetailInfoByCode.htm'
    },
    allotout:{
    	query:"/v2/supplychain/transfer/queryTransferOutOrderInfos.htm",
    	editQuery:"/v2/supplychain/transfer/updateTransferOutOrderInfo.htm",
    	addQuery:"/v2/supplychain/transfer/insertTransferOutOrderInfo.htm",
    	editDetail:"/v2/supplychain/transfer/editTransferOutSkuDetailInfo.htm",//新增产品出库明细
    	editSaleOutDetail:'/v2/supplychain/transfer/editTransferSaleOutSkuDetailInfo.htm',//集团内转售明细
    	selectQuery:"/v2/supplychain/transfer/getTransferOutOrderInfoByCode.htm",
    	getSaleQuery:'/v2/supplychain/transfer/getTransferSaleOutSkuDetailInfoByCode.htm',//集团内出库单查询
    	querySkuPrice:'/v2/supplychain/transfer/querySkuPrice.htm',//商品价格查询
    	seleSkuQuery:"/v2/supplychain/transfer/getTransferOutSkuDetailInfoByCode.htm",//查询明细
    	destroy:"/v2/supplychain/transfer/cancelTransferOutOrderInfo.htm",//作废接口
    	submitTable:"/v2/supplychain/transfer/submitTransferOutOrderInfo.htm",//提交主表
    	updateApprove:"/v2/supplychain/transfer/updateWfForTransferOutOrderInfo.htm",//调拨单工作流状态更新回调
    	revocation:'/v2/supplychain/transfer/withdrawTransferOutOrderInfo.htm',//撤销接口
    	queryStockInfoVosByCodeAndSku:'/v2/supplychain/stockInfo/queryStockInfoVosByCodeAndSku.htm',//通过sku查询单位，库存
    },
    allotin: {
        query: '/v2/supplychain/transfer/queryTransferInOrderInfos.htm',
        queryBycode: '/v2/supplychain/transfer/getTransferOutOrderInfoByCode.htm',
        // add: '/v2/supplychain/transfer/insertTransferInOrderInfoByOutOrderNo.htm',
        instorage: '/v2/supplychain/transfer/insertTransferInOrderInfo.htm',
        queryByInCode: '/v2/supplychain/transfer/getTransferInOrderInfoByCode.htm'
    },
    serviceCategory:{//服务分类
    	query:'/v2/sku/service/category/queryServiceCategoryInfo.htm',
    	insert:'/v2/sku/service/category/insertServiceCategoryInfo.htm',
    	update:'/v2/sku/service/category/updateServiceCategoryInfo.htm',
    	getService:'/v2/sku/service/category/getServiceCategoryInfoBycategoryCode.htm',
    	init:'/v2/sku/service/category/initServiceCategoryToCache.htm',

    },
    serviceCatLog:{
    	query:'/v2/sku/service/catlog/queryServiceCatLogInfo.htm',
    	insert:'/v2/sku/service/catlog/insertServiceCatLogInfo.htm',
    	update:'/v2/sku/service/catlog/updateServiceCatLogInfo.htm',
    	getService:'/v2/sku/service/catlog/getServiceCatLogInfoByCatlogCode.htm',
    	init:'/v2/sku/service/catlog/initServiceCatLogToCache.htm',
    },
    serviceitem: {
        query: '/v1/service/service/queryServiceInfoForPageByVo.htm',
        queryBycode: '/v1/service/service/queryServiceAvailableInfo.htm',
        insert: '/v1/service/service/editServiceInfo.htm',
        deleteDetail: '/v2/sku/service/editServiceCarAddInfo.htm',
        queryCategory: '/v2/sku/service/category/getServiceCategoryInfoBycategoryCode.htm',
        queryCatalog: '/v2/sku/service/catlog/getServiceCatLogInfoByCatlogCode.htm',
        dataSync: '/v1/service/service/initServiceInfoToRedisCache.htm'
    },
    stockInfo: {
        queryBatchStockInfoVosByWhCode: '/v2/supplychain/stockInfo/queryStockInfoVosByCodeAndSku.htm',
        queryInfoByCode:'/v1/supplyChain/warehouseInfo/get.htm'
    },
    empScheduling: {
        edit: '/v2/hr/empscheduling/editEmpSchedulingInfo.htm',
        copyInsert: '/v2/hr/empscheduling/updateEmpCopySchedulingInfo.htm',
        queryByCode: '/v2/hr/empscheduling/getEmpSchedulingInfoByCode.htm',
        query: '/v2/hr/empscheduling/queryEmpSchedulingInfoNoPage.htm',
        pagingQuery: '/v2/hr/empscheduling/queryEmpSchedulingInfos.htm',
        delete: '/v2/hr/empscheduling/deleteEmpSchedulingInfo.htm',
        // 根据门店, 组织, 员工状态... 查询门店员工 => 排班用
        queryEmpByStore: '/v1/sys/emp/queryEmpByStoreCode.htm',
        // 根据门店查询门店员工 => 卡销售单用
        queryEmp: '/v2/system/emp/queryEmpByStore.htm'
    },
    staffJob:{
    	query:'/v2/system/emp/queryEmpPostWorkTypeInfos.htm',//分页查询
    	queryInfo:'/v1/sys/emp/queryAllInfo.htm',//获取员工信息
    	queryPostnInfo:'/v2/system/emp/queryEmpPostnInfoPage.htm',//分页查询员工岗位
    	queryWorkTypeInfo:'/v2/system/emp/queryEmpWorkTypeInfos.htm',//分页查询员工工种
    	updateJob:'/v2/system/emp/editEmpPostInfos.htm',//更新岗位
    	getPostOrg:'/v2/system/org/getPostOrg.htm',//获取相关组织
    	batchWorkTypeInfo:'/v2/system/emp/batchEditEmpWorkTypeInfos.htm',//添加员工工种
    	updateWorkTypeInfo:'/v2/system/emp/updateEmpWorkTypeInfo',//更新工种
    	getPostn:'/v2/system/postn/getPostnByOrgCodePostTypeCode.htm',//获取岗位
    	init:'/v2/system/emp/initRedis.htm',
    	queryWorkType:'/v2/system/emp/queryEmpWorkTypeInfoNoPage.htm',//根据门店查询工种
    	queryEmpPost:'/v2/system/emp/queryEmpPostByPostn.htm',//岗位详情
    	queryPostByEmpCode:'/v2/system/emp/queryPostByEmpCode.htm',//获取主岗位

    },
    skuInfo:{
        cogradient:"/v1/sku/skuInfo/initRedisCache.htm",
        querySkuBrandInfoForPageByVo:'/v1/sku/brand/querySkuBrandInfoForPageByVo.htm',
        querySkuUnitAvailableInfo:'/v1/sku/unit/querySkuUnitAvailableInfo.htm',
        getSkuCatLogInfoByCatlogCode:'/v1/sku/catlog/getSkuCatLogInfoByCatlogCode.htm',
        getSkuAreaInfoByRedisCache:'/v1/sku/area/querySkuAreaInfoForPageByVo.htm',
        querySkuPackInfoForPageByVo:"/v1/sku/pack/querySkuPackInfoForPageByVo.htm",
        insert:'/v1/sku/skuInfo/insert.htm',
        querySkuInfo:"/v1/sku/skuInfo/get.htm",
        update:'/v1/sku/skuInfo/update.htm',
    },
    // 服务工时配置
    serviceHours: {
        pagingQuery: '/v2/sku/service/queryServiceCarWorkhourInfosGruopByServiceCode.htm',
        // 新增, 修改
        edit: '/v2/sku/service/editServiceCarWorkhourInfo.htm',
        querySub: '/v2/sku/service/queryServiceCarWorkhourInfosAndAddInfos.htm',
        insertRange: '/v2/sku/service/insertServiceCarWorkhourInfo.htm',
        updateRange: '/v2/sku/service/updateServiceCarWorkhourInfo.htm',

    },
    serviceSku:{
        queryServiceSkuRelationInfoForPageByVo: '/v2/sku/service/ssr/queryServiceSkuRelationInfoForPageByVo.htm',
        editServiceSkuRelationInfo:'/v2/sku/service/ssr/editServiceSkuRelationInfo.htm'
    },
    mainBusiness: {
        queryCar: '/v2/clearingsettlement/dispatch/queryDispatchOrderInfoNoPage.htm',
        queryTechnicianListByDate: '/v2/clearingsettlement/dispatch/queryDispatchEmpDetailInfoNoPage.htm',
        queryStationListByDate: '/v2/clearingsettlement/dispatch/queryDispatchDetailInfoNoPage.htm',
        getTechnicianDetailByDate: '/v2/clearingsettlement/dispatch/getDispatchEmpDetailInfoByCode.htm',
        getStationDetailByDate: '/v2/clearingsettlement/dispatch/getDispatchDetailInfoByCode.htm',
        getInfoByCode: '/v2/clearingsettlement/dispatch/getDispatchOrderInfoByCode.htm',
        queryServiceWorkTypeInfoNoPage:'/v2/sku/service/queryServiceWorkTypeInfoNoPage.htm',
        // 技师 某一个时间段 明细
        getTechnicianDetail: '/v2/clearingsettlement/dispatch/getDispatchDetailInfoByCode.htm',
        getAllTechnicianDetail: '/v2/clearingsettlement/dispatch/queryDispatchEmpDetailInfoNoPage.htm',
        queryEmpByStoreWorkTypeStation: '/v2/system/emp/queryEmpByStoreWorkTypeStation.htm',
        editDispatchDetailInfo:'/v2/clearingsettlement/dispatch/editDispatchDetailInfo.htm',
        queryDispatchEmpDetailInfoNoPage:'/v2/clearingsettlement/dispatch/queryDispatchEmpDetailInfoNoPage.htm'
    },
    dailyfill:{
        dailyfillQuerySku:'/v2/sku/skuInfo/selectSkuInfo.htm',
        insertReplenishmentPlanInfo:'/v2/supplychain/replenishment/insertReplenishmentPlanInfo.htm',
        editReplenishmentPlanDetailInfo:'/v2/supplychain/replenishment/editReplenishmentPlanDetailInfo.htm',
        updateReplenishmentPlanInfo:'/v2/supplychain/replenishment/updateReplenishmentPlanInfo.htm',
        queryReplenishmentPlanInfos:'/v2/supplychain/replenishment/queryReplenishmentPlanInfos.htm',
        getReplenishmentPlanInfoByCode:'/v2/supplychain/replenishment/getReplenishmentPlanInfoByCode.htm',
        getReplenishmentPlanDetailInfoByCode:'/v2/supplychain/replenishment/queryReplenishmentPlanDetailInfoNoPage.htm'
    },
    ownPurchase:{
        search: '/v2/report/supplychain/querySelfPurchaseOrderInfos.htm',
        querySpoSkuDetailInfos:'/v2/supplychain/purchase/querySpoSkuDetailInfos.htm',
        editSelfPurchaseBatchInfo:'/v2/supplychain/purchase/editSelfPurchaseBatchInfo.htm',
        querySelfPurchaseOrderInfoNoPage: '/v2/supplychain/purchase/querySelfPurchaseOrderInfoNoPage.htm',
        querySelfPurchaseBatchInfoNoPage:'/v2/supplychain/purchase/querySelfPurchaseBatchInfoNoPage.htm',
        delPurchaseBatch:'/v2/supplychain/purchase/deleteSelfPurchaseBatchInfoByCode.htm',
        printOrder:'/v2/supplychain/purchase/generateSelfOrderPdfReport.htm',
    },
    // 自采到货处理
    arriveHandle: {
        query: '/v2/supplychain/purchase/querySelfPurchaseBatchInfos.htm',
        getDetailByCode: '/v2/supplychain/purchase/getSelfPurchaseBatchInfoByCode.htm',
        arriveComfirm: '/v2/supplychain/purchase/editSelfPurchaseBatchInfo.htm',
        print: '/v2/supplychain/purchase/generatePdfReport.htm',
        ownPurchaseRequirement: '/v2/supplychain/requirement/operatorRequirementInfo.htm'
    },
    allot:{
        queryStockInfoVosBySku:'/v2/supplychain/stockInfo/queryStockInfoVosBySku.htm'
    },
    requirement:{
        queryPrSkuDetailInfos:'/v2/supplychain/requirement/queryPrSkuDetailInfos.htm',
        querySkuPriceInfoBySkuCodeSet:'/v1/sku/skuPriceInfo/querySkuPriceInfoBySkuCodeSet.htm',
        immediateAttentionByCode:'/v2/supplychain/replenishment/immediateAttentionByCode.htm',
        insertPurchaseOrderAndPoSkuInfo:'/v2/supplychain/purchaseOrder/insertPurchaseOrderAndPoSkuInfo.htm'  ,
        operatorRequirementInfo:'/v2/supplychain/requirement/operatorRequirementInfo.htm',
        querySupplierBySkuCodeAndStoreCodes:'/v2/supplychain/purchase/querySupplierBySkuCodeAndStoreCodes.htm',
        generatePdfReport:'/v2/supplychain/requirement/generatePdfReport.htm'
    },
    skuComb:{
    	querySkuInfo:'/v2/sku/skuInfo/query.htm',
    	getSkuCatLogInfoByCatlogCode:'/v1/sku/catlog/getSkuCatLogInfoByCatlogCode.htm',
    	getSkuCategoryInfoBycategoryCode:'/v1/sku/category/getSkuCategoryInfoBycategoryCode.htm',
    	queryCombinationInfoForPageByVo:'/v2/sku/comb/queryCombinationInfoForPageByVo.htm',
    	editCombinationInfos:'/v1/sku/comb/editCombinationInfos.htm',
    	addOrUpdateCombinationDetailInfoBatch:'/v1/sku/comb/addOrUpdateCombinationDetailInfoBatch.htm',
    	getCombinationDetailInfo:'/v2/sku/comb/getCombinationDetailInfos.htm',
    	addOrUpdateCombinationPriceInfoBatch:'/v1/sku/comb/addOrUpdateCombinationPriceInfoBatch.htm',
    	getCombinationPriceInfo:'/v1/sku/comb/getCombinationPriceInfo.htm',
    	addOrUpdateCombinationUseRangeBatch:'/v2/sku/userange/addOrUpdateCombinationUseRangeBatch.htm',
    	getCombinationUseRange:'/v1/sku/userange/getCombinationUseRange.htm',
        getQueryService:'/v2/service/service/queryServiceInfoForPageByVo.htm',
    	getComGory:'/v2/sku/service/category/getCombinationCategoryInfoBycategoryCode.htm',
    	getComLog:'/v2/sku/service/catlog/getCombinationCatLogInfoByCatlogCode.htm'
    },
    // 组合分类
    groupClass: {
        getSubInfoByCode: '/v2/sku/service/category/getCombinationCategoryInfoBycategoryCode.htm',
        insert: '/v2/sku/service/category/insertCombinationCategoryInfo.htm',
        update: '/v2/sku/service/category/updateCombinationCategoryInfo.htm',
        query: '/v2/sku/service/category/queryCombinationCategoryInfo.htm',
        init: '/v2/sku/service/category/initCombinationCategoryToCache.htm'
    },
    // 组合目录
    groupCatalog: {
        getSubInfoByCode: '/v2/sku/service/catlog/getCombinationCatLogInfoByCatlogCode.htm',
        insert: '/v2/sku/service/catlog/insertCombinationCatLogInfo.htm',
        update: '/v2/sku/service/catlog/updateCombinationCatLogInfo.htm',
        query: '/v2/sku/service/catlog/queryCombinationCatLogInfo.htm',
        init: '/v2/sku/service/catlog/initCombinationCatLogToCache.htm'
    },
    //审批流
    approval:{
    	query:'/v2/workFlow/orderwf/queryOrderWfInfoByPostnCode.htm',
    	getDetails:'/v2/workFlow/orderwf/getOrderWfInfoByCode.htm',
    	agree:'/v2/workFlow/orderwf/approvalOrderWfNode.htm',
    	reject:'/v2/workFlow/orderwf/refuseOrderWfNode.htm',
    	ajustByCode:'/v2/supplychain/adjust/getAdjustOrderInfoByCode.htm',//根据业务编码查询调整单信息
    	WfDetailInfo:'/v2/workFlow/orderwf/queryOrderWfDetailInfoByOrderNo.htm'//公查看审批履历接口
    },
    ticketTemlate:{
        queryCouponTemplateInfos:'/v2/cardcoupons/template/queryByCouponTemplateInfos.htm',
        insertCouponTemplateInfo:'/v2/cardcoupons/template/insertCouponTemplateInfo.htm',
        updateCouponTemplateInfo:'/v2/cardcoupons/template/updateCouponTemplateInfo.htm',
        editCouponTemplateDetailInfo:'/v2/cardcoupons/template/editCouponTemplateDetailInfo.htm',
        queryCouponTemplateDetailInfoNoPage:'/v2/cardcoupons/template/queryCouponTemplateDetailInfoNoPage.htm',
        editCouponTemplateUseRangeInfo:'/v2/cardcoupons/template/editCouponTemplateUseRangeInfo.htm',
        queryCouponTemplateUseRangeInfoNoPage:'/v2/cardcoupons/template/queryCouponTemplateUseRangeInfoNoPage.htm',
        editCouponTemplatePriceRangeInfo:'/v2/cardcoupons/template/editCouponTemplatePriceRangeInfo.htm',
        queryCouponTemplatePriceRangeInfoNoPage:'/v2/cardcoupons/template/queryCouponTemplatePriceRangeInfoNoPage.htm',
        releaseCouponTemplateInfo:'/v2/cardcoupons/template/releaseCouponTemplateInfo.htm',
    },
    carTemlate:{
        insertCardTemplateInfo:'/v2/cardcoupons/template/insertCardTemplateInfo.htm',
        getCardTemplateInfoByCode:'/v2/cardcoupons/template/getCardTemplateInfoByCode.htm',
        editCardTemplateDetailInfo:'/v2/cardcoupons/template/editCardTemplateDetailInfo.htm',
        queryCardTemplateDetailInfoNoPage:'/v2/cardcoupons/template/queryCardTemplateDetailInfoNoPage.htm',
        batchAddOrEditCardTemplateUseRangeInfo:'/v2/cardcoupons/template/editCardTemplateUseRangeInfo.htm',
        queryCardTemplateInfos:'/v2/cardcoupons/template/queryByCardTemplateInfos.htm',
        queryCardTemplateUseRangeInfo:'/v2/cardcoupons/template/queryCardTemplateUseRangeInfos.htm',
        updateCardTemplateInfo:'/v2/cardcoupons/template/updateCardTemplateInfo.htm',
        // 根据卡模板编码查询卡模板主信息
        queryMainInfoCard: '/v2/cardcoupons/template/getCardTemplateInfoByCode.htm',
        // 根据模板编码查询模板明细
        queryDetailInfoCard: '/v2/cardcoupons/template/queryCardTemplateDetailInfoNoPage.htm',
        // 查询卡模板适用范围
        queryShouldAreaCard: '/v2/cardcoupons/template/queryStoreBySalesAreaCode.htm',
        queryCardTemplateRechargeRangeInfos:'/v2/cardcoupons/template/queryCardTemplateRechargeRangeInfos.htm',
        // 查询已制卡明细
        queryMadeDetail: '/v2/cardcoupons/card/queryMakeCardInfos.htm',
        queryMakeCardInfos:'/v2/cardcoupons/card/queryMakeCardInfos.htm',
        cleanCardTemplateInfo:'/v2/cardcoupons/template/cleanCardTemplateInfo.htm',
        releaseCardTemplateInfo:'/v2/cardcoupons/template/releaseCardTemplateInfo.htm'
    },
    // 卡管理
    cardManage: {
        queryTableList: '/v2/cardcoupons/card/queryCardInfos.htm',
        queryTableTotal: '/v2/cardcoupons/card/statisticsCard.htm',
        makeCardPici: '/v2/cardcoupons/make/batchCardByCardMakeOrderNo.htm',
        ruinsPici: '/v2/cardcoupons/make/cleanCardMakeOrderNo.htm',
        getCardDetail: '/v2/cardcoupons/card/getCardInfoByCode.htm',
        frozenOrNot: '/v2/cardcoupons/card/editCardFrozenOrderInfo.htm',
        cancelCard: '/v2/cardcoupons/card/cancelCardList.htm',
        queryRecordFrozen: '/v2/cardcoupons/card/queryCardFrozenOrderInfoNoPage.htm',
        queryStoreStatus: '/v2/cardcoupons/card/queryStoreCardInfo.htm',
        getCardInfoByCode: '/v2/cardcoupons/make/getCardInfoByCode.htm',
        queryusableCardInfo: '/v2/cardcoupons/card/queryusableCardInfo.htm',
        queryusableCardInfos: '/v2/cardcoupons/card/queryusableCardInfos.htm',
        queryOrderServiceCardLockNum: '/v2/clearingSettlement/orderservice/queryOrderServiceCardLockNum.htm',
    },
    // 券管理
    ticketManage: {
    	frozenOrNot: '/v2/cardcoupons/coupons/insertCouponFrozenOrderInfo.htm',//冻结解冻
    	queryRecordFrozen: '/v2/cardcoupons/coupons/queryCouponFrozenOrderInfoNoPage.htm',//查询冻结履历
    	queryTableList: '/v2/cardcoupons/coupons/queryCouponSalesInfo.htm',//券管理查询页
    	queryCouponPriceInfo:'/v2/cardcoupons/coupons/queryCouponPriceInfo.htm',//查询券售价
    	getCardDetail: '/v2/cardcoupons/coupons/getCouponInfoByCode.htm',//查询券信息
    	 // 查询已制券明细
        queryMadeDetail: '/v2/cardcoupons/coupons/queryMakeCouponInfos.htm',
        // 根据券模板编码查询卡模板主信息
        queryMainInfoCard: '/v2/cardcoupons/template/getCouponTemplateInfoByCode.htm',
         // 查询券模板适用范围
        queryShouldAreaCoupon: '/v2/cardcoupons/template/queryStoreByPriceRangeInfo.htm',
        queryStoreStatus: '/v2/cardcoupons/coupons/queryStoreCouponInfo.htm',
        makeCouponPici: '/v2/cardcoupons/template/batchCardByCouponMakeOrderNo.htm',//批次制券
        queryTableTotal: '/v2/cardcoupons/coupons/statisticsCoupon.htm',
      /*  getCouponListByCustomer:'/v2/cardcoupons/coupons/getCouponListByCustomer.htm',
        getCouponInfoByCode:'/v2/cardcoupons/coupons/getCouponInfoByCode.htm',
        queryOrderServiceCouponInfo:'/v2/clearingSettlement/orderservice/queryOrderServiceCouponInfo.htm',*/
    },
   //退票
    refund:{
    	query:'/v2/report/clearingsettlement/queryRefundInvoiceOrderInfo.htm',
    	chooseRefund:'/v2/clearingsettlement/invoice/chooseRefundInvoiceInfo.htm',//可选发票查询
    	insertRefund:'/v2/clearingsettlement/invoice/insertRefundInvoiceOrderInfo.htm',//新增
    	updateRefund:'/v2/clearingsettlement/invoice/updateRefundInvoiceOrderInfo.htm',//编辑
    	queryRefund:'/v2/clearingsettlement/invoice/queryRefundInvoiceOrderInfoById.htm',//查询发票信息
    	ajustByCode:'/v2/supplychain/adjust/getAdjustOrderInfoByCode.htm',//根据业务编码查询调整单信息
    	submitRefund:'/v2/clearingsettlement/invoice/submitRefundInvoiceOrderInfo.htm',//流程确认
    	withdrawRefund:'/v2/clearingsettlement/invoice/withdrawRefundInvoiceOrderInfo.htm',//撤销
    	cancelRefund:'/v2/clearingsettlement/invoice/cancelRefundInvoiceOrderInfo.htm',//作废
    	queryEmp:'/v1/sys/emp/queryEmpByStoreCode.htm',//查创建人
    },
    // 卡销售单
    cardSale: {
        getCardInfoByCode: '/v2/cardcoupons/card/getCardInfoByCode.htm',
        toVoid: '/v2/cardcoupons/sales/cancelCardSalesOrderInfo.htm',
        insert: '/v2/cardcoupons/sales/insertCardSalesOrderInfo.htm',
        update: '/v2/cardcoupons/sales/updateCardSalesOrderInfo.htm',
        queryCardSalesOrderInfos:'/v2/cardcoupons/sales/queryCardSalesOrderInfosByInvoice.htm',
        queryRange: '/v2/cardcoupons/template/queryStoreBySalesAreaCode.htm',
        getCardSalesOrderInfo: '/v2/cardcoupons/sales/getCardSalesOrderInfoByCode.htm',
        editCardSalesPayment: '/v2/cardcoupons/sales/editCardSalesPaymentInfo.htm',
        //卡销售   卡信息接口
        queryCardInfo: '/v2/cardcoupons/card/queryCardInfos.htm',
        editCardSalesInvoice: '/v2/cardcoupons/invoice/editCardSalesInvoiceInfo.htm',
        print: '/v2/cardcoupons/sales/generatePdfReportCardSalesOrder.htm',
        // 查询销售卡的信息
        queryCardSaleInfo: '/v2/cardcoupons/card/queryCardSalesInfo.htm',
        queryFileInfo: '/v1/fileSys/file/queryFileInfo.htm'
    },
    // 卡充值
    cardPay: {
        search: '/v2/cardcoupons/recharge/queryRechargeOrderInfoByCard.htm',
        insertCardRecharge: '/v2/cardcoupons/recharge/insertCardRechargeOrderInfo.htm',
        updateCardRecharge: '/v2/cardcoupons/recharge/updateCardRechargeOrderInfo.htm',
        getCardRechargeInfoByCode: '/v2/cardcoupons/recharge/getCardRechargeOrderInfoByCode.htm',
        queryCardRechargePaymentInfoNoPage: '/v2/cardcoupons/recharge/getCardRechargePaymentInfoByCode.htm',
        editCardRechargePaymentInfo: '/v2/cardcoupons/recharge/editCardRechargePaymentInfo.htm',
        queryCardRechargeInvoiceInfoNoPage: '/v2/clearingsettlement/invoice/queryInvoiceDetailInfoNoPage.htm',
        editCardRechargeInvoiceInfo: '/v2/clearingsettlement/invoice/editInvoiceDetailInfo.htm',
        getCardDetial: '/v2/cardcoupons/card/getCardInfoByCode.htm',
        getCardRang: '/v2/cardcoupons/template/queryStoreByRechargeRange.htm',
    },
    //出入库
    outInWarehouse:{
    	queryOutInventoryList:'/v2/report/supplyChain/stockDetailInfo/queryOutInventoryList.htm',
    	queryInventoryList:'/v2/report/supplyChain/stockDetailInfo/queryInventoryList.htm',
    	exportOutInventoryList:'/v2/fileSys/supplyChain/stockDetailInfo/exportOutInventoryList.htm',
    	exportInventoryList:'/v2/fileSys/supplyChain/stockDetailInfo/exportInventoryList.htm',
    	download:'/v1/fileSys/file/download.htm',
    },
    // 退卡/退款
    returnCard:{
        getCardRefundOrderInfoByCardCode:'/v2/cardcoupons/refund/getCardRefundOrderInfoByCardCode.htm',
        queryCardRefundOrderInfo:'/v2/cardcoupons/refund/queryCardRefundOrderInfo.htm',
        submitRefundOrderInfo: '/v2/cardcoupons/refund/submitCardRefundOrderInfo.htm',
        insertCardRefundOrderInfo: '/v2/cardcoupons/refund/insertCardRefundOrderInfo.htm',
        updateCardRefundOrderInfo: '/v2/cardcoupons/refund/updateCardRefundOrderInfo.htm',
        withDrawCardRefundOrderInfo: '/v2/cardcoupons/refund/withDrawCardRefundOrderInfo.htm',
        cancelCardRefundOrderInfo: '/v2/cardcoupons/refund/cancelCardRefundOrderInfo.htm',
        queryCardRefundPaymentInfoNoPage:'/v2/cardcoupons/refund/queryCardRefundPaymentInfoNoPage.htm',
        editCardRefundPaymentInfo: '/v2/cardcoupons/refund/editCardRefundPaymentInfo.htm',
        queryCustomInfoByMobilePhone: '/v1/cus/custom/queryCustomInfoByMobilePhone.htm'
    },
    // 商品摆放目录
    skuPlace: {
        queryWarehouseAreaInfo: '/v1/supplyChain/warehouse/queryWarehouseAreaInfo.htm',
        queryWarehouseLocationInfo: '/v1/supplyChain/warehouse/queryWarehouseLocationInfo.htm',
        querySkuLocationInfos: '/v2/supplychain/sku/querySkuLocationInfos.htm',
        insertSkuLocationInfo: '/v2/supplychain/sku/insertSkuLocationInfo.htm',
        updateSkuLocationInfo: '/v2/supplychain/sku/updateSkuLocationInfo.htm',
        getSkuLocationInfoByCode: '/v2/supplychain/sku/getSkuLocationInfoByCode.htm',
        skuLocationInfoExcelFile: '/v2/fileSys/file/skuLocationInfoExcelFile.htm',
        insertSkuLocationInfoList: '/v2/supplychain/sku/insertSkuLocationInfoList.htm',
        querySkuLocationInfoNoPage: '/v2/supplychain/sku/querySkuLocationInfoNoPage.htm'
    },
    // 对账单
    statementAccount: {
        queryPurchaseReturnOrderInfos: '/v2/supplychain/purchase/queryPurchaseReturnOrderInfos.htm',
        queryInventoryList: '/v2/report/supplyChain/stockDetailInfo/queryInventoryList.htm',
        queryPurchaseOrderInfo: '/v2/supplychain/purchaseOrder/queryPurchaseOrderInfoNoPage.htm',
        queryCountStockDetailBatch: '/v2/report/supplyChain/stockDetailInfo/queryCountStockDetailBatch.htm',
        queryReconciliationOrderInfos: '/v2/supplychain/reconciliation/queryReconciliationOrderInfos.htm',
        queryReconciliationOrderInfoNoPage: '/v2/supplychain/reconciliation/queryReconciliationOrderInfoNoPage.htm',
        updateReconciliationOrderInfo: '/v2/supplychain/reconciliation/updateReconciliationOrderInfo.htm',
        insertReconciliationOrderInfo: '/v2/supplychain/reconciliation/insertReconciliationOrderInfo.htm',
        getReconciliationOrderInfoByCode: '/v2/supplychain/reconciliation/getReconciliationOrderInfoByCode.htm',
        querySupplierInfo: '/v2/supplychain/supplier/querySupplierInfo.htm',
        queryStoreInfo: '/v2/sys/store/queryStoreInfo.htm',
        editReconciliationDetailInfo: '/v2/supplychain/reconciliation/editReconciliationDetailInfo.htm',
        getReconciliationDetailInfoByCode: '/v2/supplychain/reconciliation/getReconciliationDetailInfoByCode.htm',
        queryReconciliationVerifyOrderInfoExts: '/v2/supplychain/reconciliation/queryReconciliationOrderExts.htm',
        confirmReconciliationOrderInfo: '/v2/supplychain/reconciliation/confirmReconciliationOrderInfo.htm',
        cleanReconciliationOrderInfo: '/v2/supplychain/reconciliation/cleanReconciliationOrderInfo.htm',
    },
    //对账核销
    statementAccountCancel: {
        queryReconciliationVerifyOrderInfoExts: '/v2/supplychain/reconciliation/queryReconciliationVerifyOrderInfoExts.htm',
        queryReconciliationVerifyOrderInfoNoPage:'/v2/supplychain/reconciliation/queryReconciliationVerifyOrderInfoNoPage.htm',
        queryReconciliationVerifyOrderInfos:'/v2/supplychain/reconciliation/queryReconciliationVerifyOrderInfos.htm',
        withdrawReconciliationVerifyOrderInfo:'/v2/supplychain/reconciliation/withdrawReconciliationVerifyOrderInfo.htm',//对账核销单撤销
        cancelReconciliationVerifyOrderInfo:'/v2/supplychain/reconciliation/cancelReconciliationVerifyOrderInfo.htm',//对账核销单作废
        verifyPurchaseBatchInfo:'/v2/supplychain/purchase/verifyPurchaseBatchInfo.htm',//核销处理
        queryReconciliationVerifyPaymentInfoNoPage:'/v2/supplychain/reconciliation/queryReconciliationVerifyPaymentInfoNoPage.htm', //对账核销付款明细查询
        editReconciliationVerifyPaymentInfo:'/v2/supplychain/reconciliation/editReconciliationVerifyPaymentInfo.htm', //付款明细接口新增
        insertReconciliationVerifyOrderInfo:'/v2/supplychain/reconciliation/insertReconciliationVerifyOrderInfo.htm', //对账核销新增 保存及提交
        queryReconciliationDetailInfoNoPage:'/v2/supplychain/reconciliation/queryReconciliationDetailInfoNoPage.htm', //对账单明细信息
        submitReconciliationVerifyOrderInfo:'/v2/supplychain/reconciliation/submitReconciliationVerifyOrderInfo.htm', //新增对账核销单提交接口
        updateReconciliationVerifyOrderInfo:'/v2/supplychain/reconciliation/updateReconciliationVerifyOrderInfo.htm', //更新对账核销单结构
        ReconciliationCloseOrderInfo:'/v2/supplychain/reconciliation/ReconciliationCloseOrderInfo.htm'//核销完结
    },
    // 检查模板
    checkTemplate: {
        search: '/v2/aftersale/template/getCheckTemplateInfo.htm',
        getCheckTemplateInfoByCode: '/v2/aftersale/template/getCheckTemplateInfoByCode.htm',
        insertCheckTemplateInfo: '/v2/aftersale/template/insertCheckTemplateInfo.htm',
        updateCheckTemplateInfo: '/v2/aftersale/template/updateCheckTemplateInfo.htm',
        queryCheckTemplateInfoNoPage: '/v2/aftersale/template/getCheckTemplateInfoByCode.htm',
        editCheckTemplateDetailInfo:'/v2/aftersale/template/editCheckTemplateDetailInfo.htm',
        queryCheckTemplateDetailInfoNoPage:'/v2/aftersale/template/queryCheckTemplateDetailInfoNoPage.htm',
        editCheckTemplateUseRangeInfo:'/v2/aftersale/template/editCheckTemplateUseRangeInfo.htm',
        queryCheckTemplateUseRangeInfoNoPage:'/v2/aftersale/template/queryCheckTemplateUseRangeInfoNoPage.htm',
    },
    //人车-会员车辆信息
    mancar: {
        query: '/v2/cus/custom/queryCustomMainInfo.htm',
        update: '/v2/cus/custom/updateCustomInfo.htm',
        customInfo: '/v2/cus/custom/queryCustomAllInfo.htm',
        insertCustomInfo: '/v2/cus/custom/insertCustomInfo.htm',//保存客户信息
        updateCustomInfo:'/v2/cus/custom/updateCustomInfo.htm',//编辑客户信息
        insertContactInfo: '/v2/cus/contact/insertContactInfo.htm',//新增联系人
        queryContactInfo:'/v2/cus/contact/queryContactInfo.htm',//查询联系人
        updateContactInfo:'/v2/cus/contact/updateContactInfo.htm',//编辑联系人
        insertReceiverInfo:'/v2/cus/receiver/insertReceiverInfo.htm',//新增地址信息
        updateReceiverInfo:'/v2/cus/receiver/updateReceiverInfo.htm',//编辑地址信息
        queryReceiverInfo:'/v2/cus/receiver/queryReceiverInfo.htm',//获取收货信息
        insertFinanceInfo:'/v2/cus/finance/insertFinanceInfo.htm',//新增财务信息
        updateFinanceInfo:'/v2/cus/finance/updateFinanceInfo.htm',//更新财务信息
        queryFinanceInfo:'/v2/cus/finance/queryFinanceInfo.htm',//查询财务信息
        insertCustomVehicleInfo:'/v2/custom/vehicle/insertCustomVehicleInfo.htm',//新增车辆信息
        queryCustomVehicleInfos:'/v2/custom/vehicle/queryCustomVehicleInfos.htm',//查询车辆信息
        updateCustomVehicleInfo:'/v2/custom/vehicle/updateCustomVehicleInfo.htm',//编辑车辆信息
        queryCompanyInfoByCodesAndPagination:'/v1/insurance/companyInfo/queryCompanyInfoByCodesAndPagination.htm',//查询保险公司
        getCustomVehicleInfoByCode:'/v2/custom/vehicle/getCustomVehicleInfoByCode.htm',//根据业务编码查询车辆信息
        editCheckTemplateUseRangeInfo:'/v2/aftersale/template/editCheckTemplateUseRangeInfo.htm',
        queryCheckTemplateUseRangeInfoNoPage:'/v2/aftersale/template/queryCheckTemplateUseRangeInfoNoPage.htm',
        queryCustomInfoByMobilePhone: '/v2/cus/custom/queryCustomInfoByMobilePhone.htm',
        insertcertificateTypeInfo:'/v2/cus/contact/insertcertificateTypeInfo.htm',//新增证件类型
        querycertificateTypeInfo:'/v2/cus/contact/querycertificateTypeInfo.htm',//查询证件列表
        updatecertificateTypeInfo:'/v2/cus/contact/updatecertificateTypeInfo.htm',//编辑证件类型
        queryCertificateTypeInfoByCode:'/v2/cus/contact/queryCertificateTypeInfoByCode.htm',//查证证件详情
    },

    //服务推荐
    serviceRecommon:{
        insert:'/v2/sku/recommendation/insertServiceRecommendationInfo.htm',     //新增
        queryServiceRecommendationInfos:'/v2/sku/recommendation/queryServiceRecommendationInfos.htm',//查询服务详情车型
        updateServiceRecommendationInfo:'/v2/sku/recommendation/updateServiceRecommendationInfo.htm',//更新
        analysisUrl:'/v2/fileSys/file/parseServiceRecommendationServiceExcelFile.htm',//详情页面上传
        queryServiceRecommendationInfoNoPage:'/v2/sku/recommendation/queryServiceRecommendationInfoNoPage.htm',//列表查询
        analysisUrlList:'/v2/fileSys/file/parseServiceRecommendationExcelFile.htm'//推荐服务列表导入
    },
    // 促销折扣
    saleDiscount: {
        search: '/v2/promotion/discount/queryPromotionDiscountOrderInfoExts.htm',
        insertPromotionDiscountOrderInfo: '/v2/promotion/discount/insertPromotionDiscountOrderInfo.htm',
        updatePromotionDiscountOrderInfo: '/v2/promotion/discount/updatePromotionDiscountOrderInfo.htm',
        getPromotionDiscountOrderInfoByCode: '/v2/promotion/discount/getPromotionDiscountOrderInfoByCode.htm',
        submitPromotionDiscountOrderInfo: '/v2/promotion/discount/submitPromotionDiscountOrderInfo.htm',
        withdrawPromotionDiscountOrderInfo: '/v2/promotion/discount/withdrawPromotionDiscountOrderInfo.htm',
        cancelPromotionDiscountOrderInfo: '/v2/promotion/discount/cancelPromotionDiscountOrderInfo.htm',
        editPromotionDiscountRuleInfo: '/v2/promotion/discount/editPromotionDiscountRuleInfo.htm',
        queryPromotionDiscountRuleInfoExts: '/v2/promotion/discount/queryPromotionDiscountRuleInfoExts.htm',
        editPromotionDiscountRuleInfoDiscountRuleDetailInfo: '/v2/promotion/discount/editPromotionDiscountRuleInfoDiscountRuleDetailInfo.htm',
        queryPromotionDiscountRuleDetailInfos: '/v2/promotion/discount/queryPromotionDiscountRuleDetailInfos.htm',
        getPromotionDiscountRuleDetailInfoByCode: '/v2/promotion/discount/getPromotionDiscountRuleDetailInfoByCode.htm',
        getSkuInfoByCategoryCodeAll: '/v2/sku/category/getSkuInfoByCategoryCodeAll.htm',
        getServiceCategoryInfoByCategoryCodeAll: '/v2/sku/service/category/getServiceCategoryInfoByCategoryCodeAll.htm',
        queryServiceAvailableInfo: '/v1/service/service/queryServiceAvailableInfo.htm',
        getStoreAllPost: '/v2/system/emp/getStoreAllPost.htm',
        getStorePostEmp: '/v2/sys/emp/getStorePostEmp.htm',
    },
    purchaseOrder: {
        insertPurchaseOrderInfo:'/v1/purchaseOrder/insertPurchaseOrderInfo.htm',
        submitPurchaseOrderInfo:'/v1/purchaseOrder/submitPurchaseOrderInfo.htm',
        queryPurchaseSkuDetailBySupplierCode:'/v2/supplychain/purchaseContract/queryPurchaseSkuDetailBySupplierCode.htm',
        queryPurchaseOrderInfo:'/v2/supplychain/purchaseOrder/queryPurchaseOrderInfo.htm',
        querySupplierInfoNoPageBySupplierInfo:'/v2/supplychain/supplier/querySupplierInfoNoPageBySupplierInfo.htm',
        getPurchaseOrderInfoByCode:'/v2/supplychain/purchaseOrder/getPurchaseOrderInfoByCode.htm',
        updatePurchaseOrderInfoAndPoSkuInfo:'/v2/supplychain/purchaseOrder/updatePurchaseOrderInfoAndPoSkuInfo.htm',
        cancelPurchaseOrderInfo:'/v1/purchaseOrder/cancelPurchaseOrderInfo.htm',
        editPoSkuDetailInfo:'/v1/purchaseOrder/editPoSkuDetailInfo.htm',
        queryContractBySkuAndStoreAndSupplier:'/v2/supplychain/purchaseContract/queryContractBySkuAndStoreAndSupplier.htm'
    },
    purchaseReturn: {
        search: '/v2/supplychain/purchase/queryPurchaseReturnOrderInfos.htm',
        insertPurchaseReturnOrderInfo: '/v2/supplychain/purchase/insertPurchaseReturnOrderInfo.htm',
        updatePurchaseReturnOrderInfo: '/v2/supplychain/purchase/updatePurchaseReturnOrderInfo.htm',
        submitPurchaseReturnOrderInfo: '/v2/supplychain/purchase/submitPurchaseReturnOrderInfo.htm',
        cancelPurchaseReturnOrderInfo: '/v2/supplychain/purchase/cancelPurchaseReturnOrderInfo.htm',
        withdrawPurchaseReturnOrderInfo: '/v2/supplychain/purchase/withdrawPurchaseReturnOrderInfo.htm',
        getPurchaseReturnOrderInfoByCode: '/v2/supplychain/purchase/getPurchaseReturnOrderInfoByCode.htm',
        queryPurchaseReturnSkuDetailInfos: '/v2/supplychain/purchase/queryPurchaseReturnSkuDetailInfos.htm',
        PurchaseReturnSkuDetailInfo: '/v2/supplychain/purchase/PurchaseReturnSkuDetailInfo.htm',
        queryStockInfoByStoreSku: '/v2/supplychain/stockInfo/queryStockInfoByStoreSku.htm',
        queryStockDetailBatch: '/v2/supplyChain/stockDetailInfo/queryStockDetailBatch.htm',
    },
    // 库存调整
    stockAdjust: {
        queryStockAdjustOrderInfos: '/v2/supplychain/stockadjust/queryStockAdjustOrderInfos.htm',
        queryBeStockInfo: '/v2/supplyChain/stock/queryBeStockInfo.htm',
        update: '/v2/supplychain/stockadjust/updateStockAdjustOrderInfo.htm',
        insert: '/v2/supplychain/stockadjust/insertStockAdjustOrderInfo.htm',
        queryByCode: '/v2/supplychain/stockadjust/getStockAdjustOrderInfoByCode.htm',
        submit: '/v2/supplychain/stockadjust/submitStockAdjustOrderInfo.htm',
        toVoid: '/v2/supplychain/stockadjust/cancelStockAdjustOrderInfo.htm',
        revoke: '/v2/supplychain/stockadjust/withdrawStockAdjustOrderInfo.htm',
        queryStockDetailBatch: '/v2/supplyChain/stockDetailInfo/queryStockDetailBatch.htm',
        queryStockDetailByBatchNo: '/v2/supplyChain/stockDetailInfo/queryStockDetailByBatchNo.htm',
        // 根据门店查询账期
        queryBeTermInfoNoPage: '/v2/system/term/queryBeTermInfoNoPage.htm'
    },
    // 仓库
    warehouse: {
        queryInfoByCode: '/v1/supplyChain/warehouseInfo/get.htm',
        query: '/v1/supplyChain/warehouseInfo/query.htm'
    },
    // 非整车采购入库 2018年6月1日18点51分张禀奇添加
    notCarSharePurchaseInfo:{
        queryInfo: '/v2/supplychain/purchaseOrder/queryPurchaseOrderInfo.htm',
        getDetailInfo: '/v2/supplychain/purchaseOrder/queryPoSkuDetailInfo.htm',
        inStockListV2: '/v2/supplyChain/stockInfo/inStockList.htm',
        generatePdfReportInStock: '/api/v2/supplychain/stockInfo/generatePdfReportInStock.htm'
    },
    // 系统初始化接口地址
    systemInit: {
        isShowFactory: '/v1/sys/refDetail/get.htm'
    },
    vehicleCleaning:{
        getCustomVehicleInfoByPlateNumber:'/v2/custom/vehicle/getCustomVehicleInfoByPlateNumber.htm',
        getCertificateTypeInfoByCustom:'/v2/cus/contact/getCertificateTypeInfoByCustom.htm',
        queryIsCarWashAndPriceServiceInfo:'/v1/service/service/queryIsCarWashAndPriceServiceInfo.htm',
        insertcertificateTypeInfo:'/v2/cus/contact/insertcertificateTypeInfo.htm',
        insertOrderInfo:'/v2/clearingSettlement/order/insertOrderInfo.htm',
        updateOrderAndServiceInfo:'/v2/clearingSettlement/order/updateOrderAndServiceInfo.htm',
        updateServiceOrderDetailInfoForDisCount:'/v2/clearingsettlement/orderservice/updateServiceOrderDetailInfoForDisCount.htm',
        orderCompleteByOrderNo:'/v2/clearingsettlement/order/orderCompleteByOrderNo.htm',
        updateOrderInfo:'/v2/clearingSettlement/order/updateOrderInfo.htm',
        resetServiceOrderInfo:'/v2/clearingsettlement/orderservice/resetServiceOrderInfo.htm',
        getCouponCountByCustomer:'/v2/cardcoupons/coupons/getCouponCountByCustomer.htm',
        getOrderInfoByCondition:'/v2/clearingSettlement/order/getOrderInfoByCondition.htm',
        queryAllServiceOrderInfo:'/v2/clearingsettlement/orderservice/queryAllServiceOrderInfo.htm',
        updateServiceOrderDatailInfo:'/v2/clearingsettlement/orderservice/updateServiceOrderDatailInfo.htm',
    },
    // 预检
    precheck: {
        queryCheckTemplateInfoNoPage: '/v2/aftersale/template/queryCheckTemplateInfoNoPage.htm',
        insertPrecheckOrderInfo: '/v2/clearingsettlement/precheck/insertPrecheckOrderInfo.htm',
        queryAllServiceOrderInfo:'/v2/clearingsettlement/orderservice/queryAllServiceOrderInfo.htm',
        queryusableCardInfosAndCouponDetailInfos: '/v2/cardcoupons/card/queryusableCardInfosAndCouponDetailInfos.htm',
        queryServiceInfoByCaraddcode: '/v2/service/service/queryServiceInfoByCaraddcode.htm',
        updateServiceOrderDatailInfo:'/v2/clearingsettlement/orderservice/updateServiceOrderDatailInfo.htm',
        uploadbase64Img: '/v2/fileSys/file/uploadbase64Img.htm',
        getPrecheckOrderInfoByCode: '/v2/clearingsettlement/precheck/getPrecheckOrderInfoByCode.htm',
        updatePrecheckOrderInfo: '/v2/clearingsettlement/precheck/updatePrecheckOrderInfo.htm',
        generatePdfprecheckOrder: '/v2/clearingsettlement/precheck/generatePdfprecheckOrder.htm',
        editPrecheckRecommendationInfo: '/v2/clearingsettlement/precheck/editPrecheckRecommendationInfo.htm',
        checkRecommendationAndAnswerInfo: '/v2/clearingsettlement/precheck/checkRecommendationAndAnswerInfo.htm'
    },
    // 维修工单
    repairOrder: {
        editCustomVehicleAddInfo: '/v2/custom/vehicle/editCustomVehicleAddInfo.htm',
        queryCarAddInfos:'/v2/sys/car/queryCarAddInfos.htm',
        queryServiceSkuList: '/v2/sku/service/ssr/queryServiceSkuList.htm',
        queryServicePriceALL: '/v2/service/service/queryServicePriceALL.htm',
        editOrderSkuInfoList:'/v2/clearingSettlement/ordersku/editOrderSkuInfoList.htm',
        getSkuOrderInfo: '/v2/clearingSettlement/ordersku/getSkuOrderInfo.htm',
        queryAllOrderInfo: '/v2/clearingSettlement/order/queryAllOrderInfo.htm',
        queryOrderInfoPageForPicking: '/v2/clearingSettlement/order/queryOrderInfoPageForPicking.htm',
        insertOrderPaymentInfo: '/v2/clearingSettlement/paymentInfo/insertOrderPaymentInfo.htm',
        updateOrderPaymentInfo: '/v2/clearingSettlement/paymentInfo/updateOrderPaymentInfo.htm',
        queryOrderPaymentInfoNoPage: '/v2/clearingSettlement/orderPayment/queryOrderPaymentInfoNoPage.htm',
        updateSkuOrderOutStockList: '/v2/clearingSettlement/ordersku/updateSkuOrderOutStockList.htm',
        queryPickingInfoByOrderNo: '/v2/clearingsettlement/order/queryPickingInfoByOrderNo.htm',// 领料
        deleteSkuOrderDetailByCondition: '/v2/clearingSettlement/ordersku/deleteSkuOrderDetailByCondition.htm',
        insertOrUpdateOrderInfo: '/v2/clearingsettlement/order/insertOrUpdateOrderInfo.htm',
        editDispatch: '/v2/clearingsettlement/order/insertDispatchDetailByOrderNo.htm',
        getServiceOrderDetailInfoByCode: '/v2/clearingsettlement/orderservice/getServiceOrderDetailInfoByCode.htm',
        settlementOrderInfo: '/v2/clearingsettlement/order/settlementOrderInfo.htm',
        preview: '/v2/clearingsettlement/order/previewQuotationByOrderNo.htm',
        print: '/v2/clearingsettlement/order/getOrderInfoPrintData.htm',
        editOrderPaymentInfoList: '/v2/clearingSettlement/orderPayment/editOrderPaymentInfoList.htm',
        orderCompleteByOrderNo: '/v2/clearingsettlement/order/orderCompleteByOrderNo.htm',
        getOutsideOrderDetailInfoByCode: '/v2/clearingsettlement/outsideorder/getOutsideOrderDetailInfoByCode.htm',
        routeCancelOrderInfo: '/v2/clearingsettlement/order/routeCancelOrderInfo.htm', // 作废
        queryDispatchDetailInfos: '/v2/clearingsettlement/dispatch/queryDispatchDetailInfos.htm',
        
        //获取会员电子卡号  用于工单支付明细添加
        queryCardinfoByCustCode: '/v2/cardcoupons/card/queryCardinfoByCustCode.htm',
        toVoidOrderInfo: '/v2/clearingsettlement/order/routeCancelOrderInfo.htm',
        queryServiceInfoCodeOrName: '/v2/service/service/queryServiceInfoForPageByVo.htm',
         //校验券是否可用
        checkCoupon:'/v2/cardcoupons/coupons/queryCouponIfUsableByCouponNo.htm',
    },
    factory: {
        queryFactoryInfo: '/v1/sys/car/queryCarFactory.htm'
    },
    supplyChain: { // 打印
        generatePdfReportOutStock: '/v2/supplychain/stockInfo/generatePdfReportOutStock.htm'
    },
    // 预约单
    appointment: {
        queryBookOrderInfoList: '/v2/report/aftersales/bookOrder/queryBookOrderInfoList.htm',
        groupByServices: '/v2/sku/recommendation/groupByServices.htm', // 精品推荐信息
        queryBookOrderHistoryList: '/v2/report/aftersales/bookOrder/queryBookOrderHistoryList.htm',
        queryBookOrderDetailListNoPage: '/v2/report/aftersales/bookOrder/queryBookOrderDetailListNoPage.htm',
        // 预约单信息作废
        cancelBookOrderInfo: '/v2/aftersales/book/cancelBookOrderInfo.htm',
        // 预约单打印
        generatePdfReportBookOrderInfo: '/v2/aftersales/book/generatePdfReportBookOrderInfo.htm',
        // 根据门店查询服务类别信息(推荐button)
        getCategoryInfoByStoreCode: '/v2/aftersales/storeservice/getCategoryInfoByStoreCode.htm',
        // 新增预检单信息
        insertOrUpdateBookOrderInfo: '/v2/aftersales/book/insertOrUpdateBookOrderInfo.htm',
        // 新增预约单中（T+N）中的N
        queryAllInfo: '/v1/sys/store/queryAllInfo.htm',
        // (推荐butn之下的内容)
        getServiceInfoByStoreCodeAndCategoryCode: '/v2/aftersales/storeservice/getServiceInfoByStoreCodeAndCategoryCode.htm',
        // 查询预约单的所有接口
        queryAllBookOrder: '/v2/aftersales/book/queryAllBookOrder.htm',
        // 预约单信息更新
        updateBookOrderInfo: '/v2/aftersales/book/updateBookOrderInfo.htm',
    },
    // 券
    coupon: {
        queryCouponPriceInfo: '/v2/cardcoupons/coupons/queryCouponPriceInfo.htm',
        queryCouponInfos: '/v2/cardcoupons/coupons/queryCouponInfos.htm',
        groupByServices: '/v2/sku/recommendation/groupByServices.htm', // 精品推荐信息
        queryBookOrderHistoryList: '/v2/report/aftersales/bookOrder/queryBookOrderHistoryList.htm',
        queryBookOrderDetailListNoPage: '/v2/report/aftersales/bookOrder/queryBookOrderDetailListNoPage.htm',
    },
    // 券销售
    couponSale: { 
        queryCouponSalesOrderInfos: '/v2/cardcoupons/sales/queryCouponSalesOrderInfos.htm',
        insertCouponSalesOrder: '/v2/cardcoupons/sales/insertCouponSalesOrderInfo.htm',
        updateCouponSalesOrder: '/v2/cardcoupons/sales/updateCouponSalesOrderInfo.htm',
        cancelCouponSalesOrderInfo: '/v2/cardcoupons/sales/cancelCouponSalesOrderInfo.htm',
        getCouponSalesOrderInfoByCode: '/v2/cardcoupons/sales/getCouponSalesOrderInfoByCode.htm',
        queryCouponSalesOrderInfosByInvoice: '/v2/cardcoupons/sales/queryCouponSalesOrderInfosByInvoice.htm',
        editCouponSalesPaymentInfo: '/v2/cardcoupons/sales/editCouponSalesPaymentInfo.htm',
        print: '/v2/cardcoupons/sales/generatePdfReportCouponSales.htm'
    },
    storeAppointmentService: {
        queryStoreServiceInfos: '/v2/aftersales/storeservice/queryStoreServiceInfos.htm',
        queryStoreServiceInfoNoPage: '/v2/aftersales/storeservice/queryStoreServiceInfoNoPage.htm',
        editStoreServiceInfoList: '/v2/aftersales/storeservice/editStoreServiceInfoList.htm',
        parseStoreServiceInfoExcelFile: '/v2/fileSys/file/parseStoreServiceInfoExcelFile.htm',
    },
}
