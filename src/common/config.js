/*skuComb// 配置文件*/
import common from './common.js'
export default {
    //登录页面的链接 暂时写死
    loginUrl: '/web/login/login.html',
    //登录token键值名
    empTokenKey: 'e_token',
    // 设置不受权限空值的区域code
    rootArea: '000001',
    // 初始化pageNums
    pageNums: process.env.NODE_ENV === 'development' ? 10 : 15,
    // 最大分页数量
    maxPageNums: 100,
    //文件上传地址
	uploadUrl: common.getUploadUrl() + '/v1/fileSys/file/upload',
	serviceId: common.getUploadUrl(),
    // 提示信息 统一配置项目
    messInfo: {
        supplierInfo: '请补全信息后保存',
        success: '操作成功',
        fail: '操作失败',
        requestFail: '请求失败',
        select: '请选择一条数据',
        suppliceInvoice: '每个供应商最多有三条发票信息',
    },
    //适用范围相关
    scope: 'RangeTpye', //获取适用范围类型的编码,
    addFinanceCode: {
        salesCode: "FINORGUR" //门店编码
    },
    //适用范围编码
    scopeType: {
        government: "rangeTpyeChinaArea",
        sales: "rangeTpyeSalesArea",
        shop: "rangeTpyeDealer"
    },
    //行政、销售、配送、采购区域树状图根节点获取参数
    areaRoot: {
        org: "000001",
        area: "000001",
        sale: "000001",
        darea: "000001",
        parea: "000001"
    },
    checkTicket: {
        seqCode: 'INVENTORYSEQ'
    },
    // 车型选择开始（false：从厂家，true：品牌）
    carFlag: common.getShowFactory(),
    //盘点单配置
    blitem: {
        blitemUploadCode: 'BLITEMDETAILS',
        seqCode: 'INVENTORY'
    },
     //采购合同配置
     purchaseContract: {
        accessory: 'CONTRACTACCESSORY',
        seqReg: 'PURCHASECONTRACTSEQ',
        seqRangs: 'PURCHASECONTRACTUSERRANGESEQ',
        seqDetail: 'PURCHASECONTRACTDETAILSEQ',
        settlementCode: 'SettlementType',
        rateValueCode: 'RateValue',
        approStatus: [
            {
                text: '',
                value: ''
            },
            {
                text: '待提交',
                value: -1
            },
            {
                text: '已提交',
                value: 0
            },
            {
                text: '审批通过',
                value: 1
            }
        ],
        isMainSupplierList:[
            {
                text: '是',
                value: 1
            },
            {
                text: '否',
                value: 0
            },
        ],
    },
    // 员工管理配置
    staff: {
        refEmpType: 'EmpType',
        refEmpStatus: 'EmpStatus',
        refEmpAdd: 'EmpAdd',
        uploadCode: 'empPic',
        emp: 'EMP',
        sexList:[
            {
                text: '男',
                value: 0
            },
            {
                text: '女',
                value: 1
            }
        ],
       onJobList:[
            {
                text: '离职',
                value: 0
            },
            {
                text: '在职',
                value: 1
            }
        ],
        empStatusList:[
            {
                text: '正式员工',
                value: '正式员工'
            },
            {
                text: '临时员工',
                value: '临时员工'
            }
        ]
    },
    // 商品适配SKU
    skuCar:{
        skuCarCode:'SKUCARRELATIONSEQ',
        skuCarAddCode:'SKUCARADDSEQ',
        modelAdd: 'MainModelAdd'
    },
    // 打卡
    clock:{
        workTypeCode:'WorkType',
    },
    cardRefund: {
        cardRefundseq: 'CARDREFUNDORDERSEQ',
        paymentRefCode: 'PaymentModeType'
    },
    skuPlace: {
        seq: 'SKULOCATIONINFOSEQ',
        url: '/v2/fileSys/file/skuLocationInfoExcelFile.htm'
    },
    // 对账单
    statementAccount: {
        sourceType: {
            refund: 'OutWhSourceTypePurchaseReturnSku',
            allot: 'InWhSourceTypeTransInternal',
            purchase: 'inWhSourceTypeGoodPurchase'
        },
        mainSeq: 'RECONCILIATIONORDERSEQ',
        detailSeq: 'RECONCILIATIONDETAILSEQ',
        isBelong: [
            {
                text: '否',
                value: 0
            },
            {
                text: '是',
                value: 1
            }
        ],
        dimensionalities: [
            {
                text: '批次维度',
                value: 1
            },
            {
                text: '商品维度',
                value: 2
            }
        ],
        accountType: [
            {
                text: '',
                value: ''
            },
            {
                text: '采购对账',
                value: 0
            },
            {
                text: '集团内部对账',
                value: 1
            }
        ],
        inOutTypeSpecial: [
            {
                text: '采购入库对账',
                value: 1
            },
            {
                text: '采购退货出库对账',
                value: -1
            }
        ],
        ticketType: [
            {
                text: '',
                value: ''
            },
            {
                text: '未生效',
                value: 0
            },
            {
                text: '已生效',
                value: 1
            },
            {
                text: '已作废',
                value: -1
            }
        ],
        accountState: [
            {
                text: '',
                value: ''
            },
            {
                text: '未对账',
                value: 0
            },
            {
                text: '已对账',
                value: 1
            },
            {
                text: '已核销',
                value: 10
            }
        ],
        inoutType: [
            {
                text: '',
                value: ''
            },
            {
                text: '采购入库对账',
                value: 1
            },
            {
                text: '采购退货出库对账',
                value: -1
            }
        ],
        queryCondition: [
            {
                text: '批次',
                value: 1
            },
            {
                text: '商品',
                value: 2
            }
        ],
        orderState: [
            {
                text: '',
                value: ''
            },
            {
                text: '未生效',
                value: 0
            },
            {
                text: '已生效',
                value: 1
            },
            {
                text: '已作废',
                value: -1
            }
        ]
    },
    // 卡卷
    cardRelative: {
        cardTypesRefCode: 'CardType',
        cardUserTypeCode: 'CardUserType',
        userPropertyCode: 'UseProperty',
        frozenSeq: 'CARDFROZENORDERSEQ',
        indateList: [
            {
                text: '',
                value: ''
            },
            {
                text: '固定时长',
                value: 0
            },
            {
                text: '标定日期',
                value: 1
            },
            {
                text: '销售单无有效期',
                value: -1
            }
        ],
        couponIndateList: [
            {
                text: '',
                value: ''
            },
            {
                text: '固定时长',
                value: 0
            },
            {
                text: '有效期限',
                value: 1
            },
           
        ],
        cardStatus: [
            {
                text: '',
                value: ''
            },
            {
                text: '未销售',
                value: 0
            },
            {
                text: '挂售中',
                value: 1
            },
            {
                text: '已销售',
                value: 2
            },
            {
                text: '退办中',
                value: 8
            },
            {
                text: '已退办',
                value: 9
            },
            {
                text: '已作废',
                value: -1
            }
        ],
      	couponStatus: [
            {
                text: '',
                value: ''
            },
            {
                text: '未销售',
                value: 0
            },
            {
                text: '挂售中',
                value: 1
            },
            {
                text: '已销售',
                value: 2
            },
            {
                text: '退办中',
                value: 8
            },
            {
                text: '已退办',
                value: 9
            },
            {
                text: '已作废',
                value: -1
            }
        ],
        frozenStatus: [
            {
                text: '',
                value: ''
            },
            {
                text: '未冻结',
                value: 0
            },
            {
                text: '已冻结',
                value: 1
            }
        ],
        piciSeq: 'CARDMAKEORDERSEQ',
        detailSeq: 'CARDMAKEDETAILSEQ',
        /*券*/
        piciSeq_: 'COUPONMAKEORDERSEQ',
        detailSeq_: 'COUPONMAKEDETAILSEQ',
        frozenSeq_: 'CONPONFROZENORDERSEQ',
        couponUserTypeCode: 'CouponUserType',
        cardExpireTypes: [
            {
                text: '',
                value: ''
            },
            {
                text: '固定时长',
                value: 0
            },
            {
                text: '标定天数',
                value: 1
            },
            {
                text: '销售单无有效期',
                value: -1
            }
        ],
        isDedicated: [
            {
                text: '',
                value: ''
            },
            {
                text: '是',
                value: 1
            },
            {
                text: '否',
                value: 0
            }
        ],
        isUsed: [
            {
                text: '',
                value: ''
            },
            {
                text: '已使用',
                value: 1
            },
            {
                text: '未使用',
                value: 0
            }
        ]
    },
    // storemanage 配置
    storeManage: {
        refCode: 'RateRelation',
        seq: 'STORE',
        financeseq: 'STOREFINANCESEQ',
        carseq: 'STORECAR',
        storeTypeRef: 'StoreType',
        statelist: [
            {
                text: '',
                value: ''
            },
            {
                text: '可用',
                value: 0
            },
            {
                text: '不可用',
                value: 1
            }
        ],
        // typelist: [
        //     {
        //         text: '直营',
        //         value: 'storeTypeDirectly'
        //     }
        // ]
    },
    // 服务固定价格配置
    serviceStaticPrice: {
        // 价格seq
        priceSeq: 'SERVICEPRICESEQ',
        // 渠道
        channelRef: 'ChannelCode',    //  暂不替换  ChannelCode
        statelist: [
            {
                value: 0,
                text: '下架'
            },
            {
                value: 1,
                text: '上架'
            }
        ]
    },
    // 盘点计划配置
    checkPlan: {
        seqCode: 'INVENTORYPLANSEQ',
        seqReg: 'INVENTORYPLANRULESEQ',
        status: [
            {
                text: '',
                value: '',
            },
            {
                text: '停用',
                value: 1
            },
            {
                text: '启用',
                value: 0
            }
        ],
        typelist: [
            // {
            //     text: '整车盘点',
            //     value: 0
            // },
            {
                text: '非整车商品盘点',
                value: 1
            },
            {
                text: '临时商品盘点',
                value: 2
            }
        ],
        comparelist: [
            {
                text: '大于等于',
                value: 0
            },
            {
                text: '小于等于',
                value: 1
            }
        ],
        isStockInOutChangeList: [
            {
                text: '否',
                value: 0
            },
            {
                text: '是',
                value: 1
            },
            {
                text: '全部',
                value: -1
            }
        ]
    },
    //商品档案模块
    archives: {
        getSkuCode: "SKU",
        refCode: 'CarloadProAdd',
        archivesType: '', //整车商品
        boutuqueType: 'goodsTypeGood', //精品商品
        temporaryType: 'goodgoodsTypeCarsTypeTemporary', //临时商品
        getlockCode: 'SKULOCK'
        },
    // 商品分类
    classification: {
        rootCode: '000001',
        getCategoryCode: 'SKUCATEGORY'
    },
     // 商品目录
    catalog: {
        rootCode: '000001',
        getCatlogCode: 'SKUCATLOG'
    },
    // 商品价格
    skuPrice: {
        sequence: 'SKUPRICE'
    },
    // 账期账务
    account: {
        list: [
            {
                text: '',
                value: ''
            },
            {
                text: '已关账',
                value: 1
            },
            {
                text: '未关账',
                value: 0
            },
            {
                text: '逾期未操作',
                value: 2
            }
        ]
    },
    //供应商
    supplier: {
        contractSupplierFlag: [                 //是否合同供应商
            {
                text: '是',
                value: '1',
            },
            {
                text: '否',
                value: '0',
            },
        ],
        contractSupplierFlags: [                 //是否合同供应商
            {
                text: '需要合同',
                value: '1',
            },
            {
                text: '无需合同',
                value: '0',
            },
        ],
        supplyType: [                           //供货类型
            {
                text: '整车',
                value: '0',
            },
            {
                text: '非整车',
                value: '1',
            },
            {
                text: '整车+非整车',
                value: '2',
            },
        ],
        contactSex: [                           //联系人性别
            {
                text: '男',
                value: '0',
            },
            {
                text: '女',
                value: '1',
            },
        ],
        refSupplierType: 'SupplierType',        //获取供应商类型
        refSupplierInvoiceType: 'RateRelation',   //供应商发票类型
        sequence: 'SUPPLIER',
        invoiceSequence: 'SUPPLIERINV',
        getUseRangeer: "QUUSERANGE",
        supplierTypeDialCode: {
            yes: 'REFD2000179',
            no: 'REFD2000181',
            temporary: 'REFD2000182',
            epiboly: 'REFD2000178',
        },
    },
    // 服务信息
    serviceitem: {
        relseq: 'SERVICECARADDSEQ',
        seq: 'SERVICESEQ',
        jobtype: 'WorkType',
        rate: 'RateValue',
        jobseq: 'SERVICEWORKTYPESEQ',
        pricetype: [
            {
                text: '固定价格',
                value: 1
            },
            {
                text: '非固定价格',
                value: 2
            },
            {
                text: '自定义价格',
                value: 3
            }
        ],
        carType: 'MainModelAdd',
        categoryCode: '000001',
        catlogCode: '000001',
        personType: [
            {
                text: '比例',
                value: 0
            },
            {
                text: '固定值',
                value: 1
            }
        ],
        yesOrno: [
            // {
            //     text: '',
            //     value: ''
            // },
            {
                text: '是',
                value: '1'
            },
            {
                text: '否',
                value: '0'
            }
        ]
    },
    // 调拨入库
    allotin: {
        seqCode: 'TRANSFERINORDERSEQ'
    },
    allotTicket: {
        transferTypes: [
            // {
            //     text: '',
            //     value: ''
            // },
            {
                value: 0,
                text: '内部调拨'
            },
            {
                value: 1,
                text: '集团内转售'
            }
        ],
        transferStatus: [
            // {
            //     value: '',
            //     text: ''
            // },
            {
                value: 2,
                text: '已生效'
            },
            {
                value: 3,
                text: '已完成'
            },
            {
                value: 4,
                text: '已关闭'
            }
        ]
    },
    //调拨出库
    allotOut:{
    	seqCode: 'TRANSFEROUTORDERSEQ',
    	salesCode:'TRANSFEROUTSKUDETAILSEQ',//
    	salesZCode:'TRANSFEROUTSALESKUDETAILSEQ',//集团内转售商品编码
    	billType:[
            {
                text: '非整车',
                value: '1',
            },
    	],
    	billSubType:[
    		{
                text: '内部调拨',
                value: '0',
            },
           
    	],
    	billStatus:[
    		{
                text: '未生效',
                value: '0',
            },
            {
                text: '已提交',
                value: '1',
            },{
                text: '已生效',
                value: '2',
            },
            {
                text: '已完成',
                value: '3',
            },
            {
                text: '已关闭',
                value: '4',
            },
            {
                text: '作废',
                value: '-1',
            },
    	],
    	//退票状态
	 	AbillStatus:[
    		{
                text: '未生效',
                value: 0,
            },
            {
                text: '已提交',
                value: 1,
            },{
                text: '已生效',
                value: 2,
            },
            {
                text: '作废',
                value: -1,
            },
    	],
    	approStatus: [
            {
                text: '待提交',
                value: -1
            },
            {
                text: '审批中',
                value: 0
            },
            {
                text: '审批通过',
                value: 1
            }
        ],

    },
    adjust: {
        adjustSEQ: "ADJUSTORDERSEQ",
        adjustDetailSEQ:'ADJUSTSKUDETAILSEQ'
    },
    // 门店工位信息
    storeStation: {
        seqCode: 'STORESTATIONSEQ',
        refCode: 'WorkPositionType',
        workTypeRef: 'WorkType',
        supportPppointmentList: [
            {
                text: '是',
                value: 1
            },
            {
                text: '否',
                value: 0
            }
        ]
    },
    //服务分类
    serviceCategory:{
    	rootCode: '000001',
    	seqCode:'SERVICECATLOGSEQ',
    },
    // 服务目录
	serviceCatalog:{
	    rootCode: '000001',
	   getCatlogCode:'SERVICECATLOGSEQ'
	},
    //成本计算类型
    CostCalculationType:{
        average: "average",//平均
        byCount: "byCount"//计件
    },
    empScheduling: {
        postRefCode: 'PositionType',
        seqCode: 'EMPSCHEDULSEQ',
        
    },

	staffJobs:{
	   getCode:'STORESTATIONWORKTYPESEQ',//工种关系
	   getSyset:'SYSEP',//岗位人员关联信息
	},

    skuInfo: {
        skuCode: 'SKU',
        goodsTypeGood: "goodsTypeGood"
    },

    // 服务工时
    serManhours: {
        channel: 'ChannelCode',
        seqCode: 'SERVICECARWORKHOURSEQ',
        extendCode: 'MainModelAdd',
        subSeqCode: 'SERVICECARADDWORKHOURSEQ'
    },
    skuInfoPic:{
        big:'big',
        mid:"mid",
        small:'small'
    },
    //组合
    skuComb: {
        sequence: 'SKUCOMB',
        detail: {
            sequence: 'COMBDETAILSEQ'
        },
        price: {
            sequence: 'COMBPRICESEQ'
        },
        useRange: {
            sequence: 'COMBRANGESEQ'
        }
    },

    channelType: {
            refCode: 'ChannelCode',
        },
    serviceSkurelationseq:'SERVICESKURELATIONSEQ',
    dailyfill:{
        dailyfillSEQ:"REPLENISHMENTPLANSEQ",
        dailyfillDetailSEQ:"REPLENISHMENTPLANDETAILSEQ"
    },
    demandOrder: {
        columW: 16,
    },
    ownPurchase:{
        supplierBatchOrder: 'TSELFPURCHASEBATCHINFOSEQ',
        skuTempcode:'SKUTEMPCODESEQ',
        rateRelation:'RateRelation',
        purchaseStatusList: [
            {
                text: '',
                value: ''
            },
            {
                text: '未处理',
                value: '0'
            },
            {
                text: '已暂存',
                value: '1'
            },
            {
                text: '已采购',
                value: '2'
            },
            {
                text: '已完成',
                value: '3'
            },
        ]
    },
    // 组合分类
    groupClass:{
    	rootCode: '000001',
    	seqCode:'COMBINATIONCATEGORYSEQ',
    },
    // 组合目录
	groupCatalog:{
	    rootCode: '000001',
	    seqCode:'COMBINATIONCATLOGSEQ'
    },
    PODETALL:'PODETAIL',
    payMethod: {
        refCode: 'PaymentModeType'
    },
    cardPay: {
        sourceOrderTypeCode: 'CardRechargeOrder',
        invoiceContentStart: 'CardRecharge',
        frozenStateList: [
            {
                text: '',
                value: ''
            },
            {
                text: '未冻结',
                value: '0'
            },
            {
                text: '已冻结',
                value: '1'
            },
        ],
        orderStatusList: [
            {
                text: '',
                value: ''
            },
            {
                text: '未结算',
                value: '0'
            },
            {
                text: '已结算',
                value: '1'
            },
            {
                text: '已作废',
                value: '-1'
            },
        ],
        orderTypeList: [
            {
                text: '',
                value: ''
            },
            {
                text: '已销售',
                value: '2'
            },
            {
                text: '退办中',
                value: '8'
            },
            {
                text: '已退办',
                value: '9'
            },
            {
                text: '已作废',
                value: '-1'
            },
        ],
        isElectronicAccountList: [
            {
                text: '',
                value: ''
            },
            {
                text: '否',
                value: '0'
            },
            {
                text: '是',
                value: '1'
            },
        ],
        invoiceStatusList: [
            {
                text: '',
                value: ''
            },
            {
                text: '未开票',
                value: '0'
            },
            {
                text: '已开票',
                value: '1'
            },
        ]

    },
    checkTemplate:{
        checkTemplateStatusList: [
            {
                text: '',
                value: ''
            },
            {
                text: '启用',
                value: '0'
            },
            {
                text: '停用',
                value: '1'
            },
        ],
        templateTypeList: [
            {
                text: '通用',
                value: '0'
            },
            {
                text: '自定义',
                value: '1'
            },
        ],

    },
    // 促销折扣
    saleDiscount: {
        useTypeList: [
            {
                text: '',
                value: null
            },
            {
                text: '全场',
                value: '0'
            },
            {
                text: '人工费',
                value: '1'
            },
            {
                text: '商品',
                value: '2'
            },
        ],
        useTypeAddList: [
            {
                text: '全场',
                value: '0'
            },
            {
                text: '人工费',
                value: '1'
            },
            {
                text: '商品',
                value: '2'
            },
        ],
        discountTypeList:[
            {
                text: '',
                value: ''
            },
            {
                text: '固定金额',
                value: '0'
            },
            {
                text: '百分比',
                value: '1'
            },
        ],
        discountItemTypeList: [
            {
                text: '',
                value: ''
            },
            {
                text: '商品分类',
                value: '0'
            },
            {
                text: '商品',
                value: '1'
            },
            {
                text: '服务分类',
                value: '2'
            },
            {
                text: '服务',
                value: '3'
            },
        ]
    },
    // 非整车采购退货
    purchaseReturn: {
        purchaseReturnOrderTypeList: [
            {
                text: '',
                value: ''
            },
            {
                text: '整车订单',
                value: '0'
            },
            {
                text: '非整车订单',
                value: '1'
            },
        ],
        orderStatusList: [
            {
                text: '',
                value: ''
            },
            {
                text: '未生效',
                value: '0'
            },
            {
                text: '已提交',
                value: '1'
            },
            {
                text: '已完成',
                value: '3'
            },
            {
                text: '已作废',
                value: '-1'
            },
        ],
    },
    seqCode:{
        PODETAIL:'PODETAIL',
        PO:'PO'
    },
    provincesAbbr: [
        {
            text: '',
            value: ''
        },
        {
            text: '京',
            value: '京'
        },
        {
            text: '津',
            value: '津'
        },
        {
            text: '冀',
            value: '冀'
        },
        {
            text: '晋',
            value: '晋'
        },
        {
            text: '蒙',
            value: '蒙'
        },
        {
            text: '辽',
            value: '辽'
        },
        {
            text: '吉',
            value: '吉'
        },
        {
            text: '黑',
            value: '黑'
        },
        {
            text: '沪',
            value: '沪'
        },
        {
            text: '苏',
            value: '苏'
        },
        {
            text: '浙',
            value: '浙'
        },
        {
            text: '皖',
            value: '皖'
        },
        {
            text: '闽',
            value: '闽'
        },
        {
            text: '赣',
            value: '赣'
        },
        {
            text: '鲁',
            value: '鲁'
        },
        {
            text: '豫',
            value: '豫'
        },
        {
            text: '鄂',
            value: '鄂'
        },
        {
            text: '湘',
            value: '湘'
        },
        {
            text: '粤',
            value: '粤'
        },
        {
            text: '桂',
            value: '桂'
        },
        {
            text: '琼',
            value: '琼'
        },
        {
            text: '渝',
            value: '渝'
        },
        {
            text: '川',
            value: '川'
        },
        {
            text: '贵',
            value: '贵'
        },
        {
            text: '滇',
            value: '滇'
        },
        {
            text: '藏',
            value: '藏'
        },
        {
            text: '陕',
            value: '陕'
        },
        {
            text: '甘',
            value: '甘'
        },
        {
            text: '青',
            value: '青'
        },
        {
            text: '宁',
            value: '宁'
        },
        {
            text: '新',
            value: '新'
        },
        {
            text: '港',
            value: '港'
        },
        {
            text: '澳',
            value: '澳'
        },
        {
            text: '台',
            value: '台'
        },
    ],
    order: {
        orderTypeCode: {
            refCode: 'OrderBusinessType'
        }
    },
    repairOrder: {
        outsideTypeList: [
            {
                text: '供应商外包',
                value: '0'
            },
            {
                text: '集团内外包',
                value: '1'
            },
        ],
    },
    precheck: {
        carRadioCode: [
            'CHETMPDET20180101000002', 
            'CHETMPDET20180101000009', 
            'CHETMPDET20180101000010', 
            'CHETMPDET20180101000011'
        ],
        tyreTreadCode: [
            'CHETMPDET20180101000027', 
            'CHETMPDET20180101000028', 
            'CHETMPDET20180101000029', 
            'CHETMPDET20180101000030', 
            'CHETMPDET20180101000031'
        ],
        rimsCode: [
            'CHETMPDET20180101000032',
            'CHETMPDET20180101000033', 
            'CHETMPDET20180101000034', 
            'CHETMPDET20180101000035', 
            'CHETMPDET20180101000036'
        ], 
        spareTyreCode: [
            'CHETMPDET20180101000003', 
            'CHETMPDET20180101000004', 
            'CHETMPDET20180101000005', 
            'CHETMPDET20180101000006',
            'CHETMPDET20180101000007', 
            'CHETMPDET20180101000008'
        ],
        frontTyreCode: [
            'CHETMPDET20180101000014', 
            'CHETMPDET20180101000015', 
            'CHETMPDET20180101000016', 
            'CHETMPDET20180101000017',
            'CHETMPDET20180101000018', 
            'CHETMPDET20180101000019'
        ],
        backTyreCode: [
            'CHETMPDET20180101000020', 
            'CHETMPDET20180101000021', 
            'CHETMPDET20180101000022', 
            'CHETMPDET20180101000023',
            'CHETMPDET20180101000024', 
            'CHETMPDET20180101000025'
        ],
        otherRadioCode: [
            'CHETMPDET20180101000038', 
            'CHETMPDET20180101000039', 
            'CHETMPDET20180101000040', 
            'CHETMPDET20180101000041'
        ],
        fuelCode: 'CHETMPDET20180101000001',
        fireCode: 'CHETMPDET20180101000012',
        dirtyCarCode: 'CHETMPDET20180101000013',
        noteCode: 'CHETMPDET20180101000042',
        addCostCode: 'CHETMPDET20180101000037'
    },
    // 预约单 
    appointment: {
        // 预约单状态
        bookOrderStatusList: [
            {
                text: '',
                value: ''
            },
            {
                text: '待确认',
                value: 0
            },
            {
                text: '已确认',
                value: 1
            },
        ],
         // 工单状态
        orderStatusList: [
            {
                text: '待处理',
                value: 0
            },
            {
                text: '处理中',
                value: 1
            },
            {
                text: '待结算',
                value: 9
            },
            {
                text: '已结算',
                value: 10
            },
        ],
    },
    storeAppointmentService: {
        uploadExeclCode: 'storeAppointmentService',
        categoryFlagList: [
            {
                text: '服务分类',
                value: 1
            },
            {
                text: '服务目录',
                value: 0
            },
        ],
    },
}
