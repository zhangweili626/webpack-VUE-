/**
 *  common config
 */
import common from './common.js'
export default {
    // 子菜单与父菜单匹配归类
    menuCataLog: [
        {
            modulName: '页头',
            iconClass: "iconfont icon-xiaoshouxiansuo",
            children: [],
        },
        {
            modulName: '系统设置',
            iconClass: "iconfont icon-jichushezhi",
            //         数据字典   账务账期   业务序号  菜单管理  系统任务调度 GP归属设置  SNP归属设置  角色管理   工作流管理
            children: ['000001', '000662', '000011', '000018', '000167',   '000048',  '000056',   '000039', '000530']
        },
        {
            modulName: '行政管理',
            iconClass: "iconfont icon-xiaoshouhangzhengguanli",
            //         组织管理   岗位管理   员工管理  员工岗位
            children: ['000024', '000030', '000979', '001015']
        },
        {
            modulName: '门店管理',
            iconClass: "iconfont icon-xiaoshouhangzhengguanli",
            //         门店管理   销售车型管理  仓库信息   库区管理  库位管理   工位管理   摆放管理  店长折扣
            children: ['001069', '000183',    '000402', '000442', '000448', '000970', '001425', '001390']
        },
        {
            modulName: '区域管理',
            iconClass: "iconfont icon-jichushezhi",
            //         行政区域   销售区域   采购区域  配送区域
            children: ['000071', '000091', '000085', '000079']
        },
        {
            modulName: '车型管理',
            iconClass: "iconfont icon-chexingguanli",
            //         厂家管理   品牌管理   车系管理  车型管理   排量管理   进气方式   销售车型  售后车型
            children: ['000111', '000118', '000125', '000132', '000139', '000146', '000153', '001050']
        },
        {
            modulName: '金融管理',
            iconClass: "iconfont icon-jinrongguanli",
            //         金融机构   金融产品   协作报价  贷款申请
            children: ['000186', '000201', '001186', '001187']
        },
        {
            modulName: '保险管理',
            iconClass: "iconfont icon-baoxianguanli",
            //         保险公司   保险方案   协作报价  保险出单
            children: ['000232', '000246', '001613', '001670']
        },
        {
            modulName: '市场活动',
            iconClass: "iconfont icon-shichanghuodongguanlicopy",
            //         活动管理
            children: ['000217']
        },
        {
            modulName: 'CRM管理',
            iconClass: "iconfont icon-CRMtiaoyan",
            //         问卷设置   调研任务
            children: ['000252', '000275']
        },
        {
            modulName: '商品中心',
            iconClass: "iconfont icon-shangpinguanli",
            children: [
                '000288', // 分类管理
                '000315', // 目录管理
                {
                    childName: '整车信息',
                    //        整车信息  整车锁定/解锁 
                    textCode: ['000321', '000333',]
                }, {
                    childName: '商品信息',
                    //        商品管理   品牌管理  产地管理   包装管理  单位管理   商品定价   商品车型适配  商品适配概览  车型适配查询
                    textCode: ['000323', '000282', '000302', '000337', '000343', '000294', '000308', '001093',    '001091',]
                }, {
                    childName: '组合信息',
                    //        组合商品   组合分类   组合目录
                    textCode: ['001032', '001161', '001155']
                }
            ],
        },
        {
            modulName: '服务管理',
            iconClass: "iconfont icon-xiaoshouhangzhengguanli",
            children: [
                '000786', // 分类管理 
                '000791', // 目录管理   
                {
                    childName: '服务信息',
                    //        服务管理  服务商品用量 
                    textCode: ['000877', '000906',]
                }, {
                    childName: '服务定价',
                    //        车型工时管理   套餐售价设置
                    textCode: ['000884',    '000897',]
                },
                '001343' // 推荐服务
            ],
        },
        {
            modulName: '客户管理',
            iconClass: "iconfont icon-xiaoshouhangzhengguanli",
            //         客户档案
            children: ['000367']
        },
        {
            modulName: '供应商管理',
            iconClass: "iconfont icon-gongyinglianguanli",
            //         供应商信息   采购合同
            children: ['000393',  '000670']
        },
        {
            modulName: '供应链管理',
            iconClass: "iconfont icon-jichushezhi",
            children: [
                {
                    childName: '需求管理',
                    //        日常补货计划  需求处理 
                    textCode: ['001103',  '001126',]
                }, {
                    childName: '整车采购',
                    //        采购订单    采购付款   采购开票   采购入库 
                    textCode: ['000410', '000425', '000421', '000417',]
                }, {
                    childName: '整车共享',
                    //        车辆分享   车辆发布  调拨出库   调拨入库  
                    textCode: ['000767', '000769', '000818', '000826',]
                }, {
                    childName: '商品供应链',
                    //        商品采购   采购入库   采购退货   调拨出库   调拨入库   内售出库   内售入库   自采管理   自采到货处理  商品库存调整 报损/报溢 
                    textCode: ['000429',  '000434', '001326', '000698', '000720', '000962',  '000957', '001601',  '001602',  '001615',   '000684',]
                }, {
                    childName: '库存信息',
                    //        商品库存   整车库存   入库批次查询   出入库查询   调拨在途查询 
                    textCode: ['000454', '001340', '001319',     '001322',   '001564',]
                }, {
                    childName: '盘点管理',
                    //        盘点计划   盘点处理
                    textCode: ['000622', '000610',]
                }, {
                    childName: '对账/核销',
                    //        对账单管理   核销单管理 
                    textCode: ['001539',   '001549',]
                }, 
                '001780' // 自采对账核销
            ]
        },
        {
            modulName: '整车交易',
            iconClass: "iconfont icon-jichushezhi",
            children: [
                {
                    childName: '行政设置',
                    //        销售目标   商务政策   历史客流导入
                    textCode: ['000499', '000516', '001740',]
                }, {
                    childName: '新车销售',
                    //        前台接待   销售线索   整车订单   订单收款  订单开票  订单退款
                    textCode: ['000463', '000481', '000551', '000601', '000607', '000608']
                }
            ],
        },
        {
            modulName: '售后交易',
            iconClass: "iconfont icon-jichushezhi",
            children: [
                {
                    childName: '行政设置',
                    //        员工排班   检查模板
                    textCode: ['000836', '001351',]
                }, 
                '001742', // 快捷洗车
                {
                    childName: '售后维修',
                    //         预约单     预检单查询   工单查询   派工管理   打卡管理   维修领料  质检查询   工单收款   工单开票
                    textCode: ['001913', '001697',  '001672', '000929', '000951', '001741',          '001724', '001371']
                }
            ],
        },
        {
            modulName: '卡券中心',
            iconClass: "iconfont icon-jichushezhi",
            children: [
                {
                    childName: '卡中心',
                    //        计次卡模版  储值卡模版  卡管理     卡销售    卡充值     卡退换
                    textCode: ['001216',  '001566',  '001261', '001226', '001239', '001307']
                },
                {
                    childName: '券中心',
                    //        // 券模板    券管理    券销售
                    textCode: [ '001469', '001667', '001952']
                }
            ],
        },
        {
            modulName: '财务管理',
            iconClass: "iconfont icon-jichushezhi",
            children: [
                {
                    childName: '发票管理',
                    //        退票管理
                    textCode: ['001376']
                }
            ],
        },
        {
            modulName: '数据报表',
            iconClass: "iconfont icon-jichushezhi",
            children: [
                {
                    childName:'整车交易',
                    //         展厅客流日志   CRM回访跟进表   跨部门策略表   DCC线索跟进转化表   SC线索跟进转化表   LPE展厅客流日志   销售管理报表   经销商财务报表  SC线索电话跟进清单
                    textCode: ['000740',    '000796',      '001203',     '001119',          '001120',         '001306',        '001660',     '001415',      '001671']
                }
            ],
        },
    ],
    //菜单sidebar 渲染
    menuMap: {
        // ==========================================以下为基础模块
        //数据字典
        '000001': {
            url:common.isweb() + '/dataDictionary/dataDictionary.html',
            isNative:false
        },
        //业务序号
        '000011': {
            url: common.isweb() + '/ordinal-info/ordinal-info.html',
            isNative:false
        },
        //菜单管理
        '000018': {
            url: common.isweb() + '/menu/menu.html',
            isNative:false
        },
        //组织管理
        '000024': {
            url: common.isweb() + '/organization/organization.html',
            isNative:false            
        },
        //岗位管理
        '000030': {
            url:  common.isweb() + '/position/position.html',
            isNative:false                        
        },
        //角色管理
        '000039': {
            url: common.isweb() + '/role/role.html',
            isNative:false                                    
        },
        //行政区域管理
        '000071': {
            url: common.isweb() + '/china/china.html',
            isNative:false                                                
        },
        //配送区域管理
        '000079': {
            url: common.isweb() + '/distribution/distribution.html',
            isNative:false                                                            
        },
        //采购区域管理
        '000085': {
            url: common.isweb() + '/purchase/purchase.html',
            isNative: false
        },
        //销售区域管理
        '000091': {
            url: common.isweb() + '/sale/sale.html',
            isNative: false            
        },
        //员工信息管理
        '000099': {
            url: common.isweb() + '/employee/employee.html',
            isNative: false                        
        },
        //车型-厂家信息
        '000111': {
            url: common.isweb() + '/carType/factory/factory.html',
            isNative: false                                    
        },
        //车型-品牌信息
        '000118': {
            url: common.isweb() + '/carType/brand/brand.html',
            isNative: false                                                
        },
        //车型-车系信息
        '000125': {
            url: common.isweb() + '/carType/series/series.html',
            isNative: false                                                            
        },
        //车型-车型信息
        '000132': {
            url: common.isweb() + '/carType/model/model.html',
            isNative: false                                                            
        },
        //车型-排量信息
        '000139': {
            url: common.isweb() + '/carType/displacement/displacement.html',
            isNative: false                                                                        
        },
        //车型-进气方式
        '000146': {
            url: common.isweb() + '/carType/inlet/inlet.html',
            isNative: false                                                                        
        },
        //主车型信息
        '000153': {
            url: common.isweb() + '/carType/mainCarType/mainCarType.html',
            isNative: false                                                                        
        },
        //统一任务调度
        '000167': {
            url: common.isweb() + '/task/tasklist.html',
            isNative: false                                                                                    
        },
        //门店管理
        // '000174': {
        //     url: common.isweb() + '/store/storeInfo/storeInfo.html',
        //     isNative: false                                                                                                
        // },
        //门店可见车型设置
        '000183': {
            url: common.isweb() + '/store/storeVisibleCar/storeVisibleCar.html',
            isNative: false                                                                                                            
        },
        //主车型信息V2
        '001050': {
            url: common.isweb() + '/carType/saleMainCarType/saleMainCarType.html',
            isNative: false
        },
        // ==========================================以下为销售模块
        //商品关联车型设置
        '000308':  {
            url: common.islivePro() + '/models/query',
            isNative: false                                                                                                                        
        },
        //市场活动
        "000217": {
            url: common.islivePro() + '/market/query',
            isNative: false                                                                                                                        
        },
        //金融机构
        "000186": {
            url: common.islivePro() + '/finance/mainFinance',
            isNative: false                                                                                                                                    
        },
        //金融产品
        "000201": {
            url: common.islivePro() + '/financePro/mainFinancePro',
            isNative: false                                                                                                                                                
        },
        //金融协作报价
        '001186': {
            url: common.islivePro() + '/financeWb/quote',
            isNative: false                                                                                                                        
        },
        //金融贷款申请
        '001187': {
            url: common.islivePro() + '/financeWb/loan',
            isNative: false                                                                                                                        
        },  
        //保险协作报价
        "001613": {
            url: common.islivePro() + '/insuranceWorkbench/quote',
            isNative: false
        },
        //保险出单管理
        "001670": {
            url: common.islivePro() + '/insuranceWorkbench/out',
            isNative: false
        },
        //保险公司
        "000232": {
            url: common.islivePro() + '/insurance/query',
            isNative: false                                                                                                                                                            
        },
        //保险方案
        "000246": {
            url:common.islivePro() + '/insurancepro/query',
            isNative: false                                                                                                                                                                        
        },
        //调查问卷设置
        "000252": {
            url:common.islivePro() + '/questionnaire/query',
            isNative: false
        },
        //调研任务工作台
        "000275": {
            url: common.islivePro() + '/research/query',
            isNative: false            
        },
        // 商品分类
        "000288": {
            url:common.islivePro() + '/classification',
            isNative: false                        
        },
        // 商品目录
        "000315": {
            url:common.islivePro() + '/catalog',
            isNative: false                                    
        },
        //商品品牌
        '000282': {
            url:common.islivePro() + '/commoditybrand',
            isNative: false                                                
        },
        //商品价格
        '000294': {
            url:common.islivePro() + '/skuPrice/query',
            isNative: false                                                            
        },
        //商品产地
        '000302': {
            url: common.islivePro() + '/birthplace',
            isNative: false                                                                        
        },
        //整车商品
        '000321': {
            url: common.islivePro() + '/archives/query',
            isNative: false                                                                        
        },
        //商品包装
        '000337': {
            url: common.islivePro() + '/pack',
            isNative: false                                                                                    
        },
        //商品单位
        '000343': {
            url: common.islivePro() + '/commodityunit',
            isNative: false                                                                                    
        },
        //供应商信息
        // '000393': {
        //     url: common.islivePro() + '/supplier',
        //     isNative: false                                                                                                
        // },
        //仓库信息
        '000402': {
            url: common.islivePro() + '/warehouse/query',
            isNative: false                                                                                                                        
        },
        //仓库库区
        '000442': {
            url: common.islivePro() + '/whArea',
            isNative: false                                                                                                                        
        },
        //仓库库位
        '000448': {
            url: common.islivePro() + '/whLocation',
            isNative: false                                                                                                                        
        },
        //DCC线索管理
        '000481': {
            url: common.islivePro() + '/dccthread/queryclientmain',
            isNative: false                                                                                                                        
        },
        //前台接待
        '000463': {
            url: common.islivePro() + '/receptionist',
            isNative: false                                                                                                                        
        },
        //订单收款
        '000601': {
            url: common.islivePro() + '/incollectmoney/query',
            isNative: false                                                                                                                        
        },
        //订单退款
        '000608': {
            url: common.islivePro() + '/outcollectmoney/query',
            isNative: false                                                                                                                        
        },
        //订单开票
        '000607': {
            url: common.islivePro() + '/billing/query',
            isNative: false                                                                                                                        
        },
        //销售订单
        '000551': {
            url: common.islivePro() + '/order',
            isNative: false                                                                                                                        
        },
        //精品库存查询
        '000454': {
            url: common.islivePro() + '/storeInfo/sku',
            isNative: false
        },
        //整车库存查询
        '001340':{
            url: common.islivePro() +  '/storeInfo/car',
            isNative: false
        },
        //整车锁定管理
        '000333': {
            url: common.islivePro() + '/archiveslock',
            isNative: false                                                                                                                        
        },
        //整车采购订单
        '000410': {
            url: common.islivePro() + '/procurement/orderForm',
            isNative: false                                                                                                                        
        },
        //整车采购付款
        '000425': {
            url: common.islivePro() + '/pay/query',
            isNative: false                                                                                                                        
        },
        //整车采购开票
        '000421': {
            url: common.islivePro() + '/ticket/query',
            isNative: false                                                                                                                        
        },
        //整车采购入库
        '000417': {
            url: common.islivePro() + '/storage/query',
            isNative: false                                                                                                                        
        },
        //车辆资源共享平台
         '000767': {
            url: common.islivePro() + '/vehicle/share',
            isNative: false
        },
        //车辆资源发布
         '000769': {
            url: common.islivePro() + '/vehicle/release/main',
            isNative: false
        },
        //GP归属设置
        '000048': {
            url: common.islivePro() + '/gpbelonging/gp',
            isNative: false                                                                                                                        
        },
        //SNP归属设置
        '000056': {
            url: common.islivePro() + '/snpbelonging/snp',
            isNative: false                                                                                                                        
        },
        //销售目标
        '000499': {
            url: common.islivePro() + '/salesTargetPlan/query',
            isNative: false                                                                                                                        
        },
        //商务政策
        '000516': {
            url: common.islivePro() + '/businessaffairs',
            isNative: false                                                                                                                        
        },
        //门店审批流设置
        '000530': {
            url: common.islivePro() + '/salesAdmin/query',
            isNative: false                                                                                                                        
        },
        //展厅客流日志
        '000740': {
            url: common.islivePro() + '/dataReport/exHallPassengerLog',
            isNative: false                                                                                                                        
        },
        //展厅历史客流导入
        '001740': {
            url: common.islivePro() + '/dataReport/exHallPassengerToChannel',
            isNative: false
        },
        //CRM跟进情况表
         '000796': {
            url: common.islivePro() + '/dataReport/crmFollowUp',
            isNative: false
        },
        //SC线索电话跟进清单
        '001671': {
            url: common.islivePro() + '/dataReport/phonecalllist',
            isNative: false
        },
         //SC线索跟进及转化表
         '001120': {
            url: common.islivePro() + '/dataReport/scThreadFollowUp',
            isNative: false
        },
        //DCC线索跟进及转化表
        '001119': {
            url: common.islivePro() + '/dataReport/dccThreadReport',
            isNative: false
        },
        //经销商财务报表
        '001415': {
            url: common.islivePro() + '/dataReport/financeReport',
            isNative: false
        },
        //销售管理报表
        '001660': {
            url: common.islivePro() + '/dataReport/salesManageOrder',
            isNative: false
        },
        //跨部门策略表
        '001203': {
            url: common.islivePro() + '/policyTable/list',
            isNative: false
        },
        //LPE展厅客流日志
        '001306': {
            url: common.islivePro() + '/lpe/index',
            isNative: false
        },
         //内采内销调出单
         '000818': {
            url: common.islivePro() + '/vehicle/callOut/main',
            isNative: false
        },
         //内采内销调入单
         '000826': {
            url: common.islivePro() + '/vehicle/callIn/main',
            isNative: false
        },
        //组合商品
        '001032':{
            url:  common.islivePro() + '/skuComb/query',
            isNative: false                   
        },      
        //商品关联车型设置V1
        '001000':{
            url: common.islivePro() + '/models/query',
            isNative: false                     
        },  
        // ==========================================以下为售后模块
        //精品商品
        '000323': {
            url: common.isliveCs() + '/skuinfo/query',
            isNative: true                                                                                                                        
        },
        //精品采购订单
        '000429': {
            url: common.isliveCs() + '/purchase-order/purchase-query',
            isNative: true                                                                                                           
        },
        //精品采购入库
        '000434': {
            url: common.isliveCs()  + '/notarchives-put/notarchives-query',
            isNative: true                                                                                                                      
        },
        //客户主档
        '000367': {
            url: common.isliveCs() + '/mancar/query',
            isNative: true                                                                                                                        
        },
        //员工岗位
        '001015': {
            url: common.isliveCs() + '/staffjobs/query',
            isNative: true                                                                                                                        
        },
        //员工打卡
        '000951': {
            url:  common.isliveCs() + '/clock/clock',
            isNative: true                                                                                                                     
        },
        //盘点单 
        '000610': {
            url:  common.isliveCs() + '/blitem/blitemSearch',
            isNative: true                                                                                                                      
        },
        //采购合同
        '000670': {
            url:  common.isliveCs() + '/purchasecontract/search',
            isNative: true                                                                                                                      
        },
        //员工管理
        '000979': {
            url:  common.isliveCs() + '/staff/search',
            isNative: true                                                                                                                       
        },
        //盘点计划
        '000622': {
            url:  common.isliveCs() + '/checkplan/query',
            isNative: true                                                                                                                        
        },
        //账务账期
        '000662': {
            url:  common.isliveCs() + '/accounting/query',
            isNative: true                                                                                                                        
        },
        //服务信息
        '000877': {
            url:  common.isliveCs() + '/serviceitem/query',
            isNative: true                                                                                                                        
        },
        //服务固定价格
        '000897': {
            url:  common.isliveCs() + '/service-staticprice/query',
            isNative: true                                                                                                                      
        },
        //服务工时车型适配
        '000884': {
            url:  common.isliveCs() + '/service-manhour/query',
            isNative: true                                                                                                                      
        },
        //非整车调拨入库单
        '000720': {
            url:  common.isliveCs() + '/allotin/query',
            isNative: true                                                                                                                       
        },
        //非整车调拨出库单
        '000698': {
            url:  common.isliveCs() + '/allotout/query',
            isNative: true                                                                                                                       
        },
        //报损报溢
        '000684': {
            url:  common.isliveCs() + '/decrease-overflow/query',
            isNative: true                                                                                                                      
        },
        //库存调整单
        '001615': {
            url:  common.isliveCs() + '/stock-adjust/query',
            isNative: true                                                                                                                        
        },
        //员工排班
        '000836': {
            url:  common.isliveCs() + '/emp-scheduling',
            isNative: true                                                                                                                       
        },
        //商品服务目录
        '000791': {
            url:  common.isliveCs() + '/serviceCatalog/query',
            isNative: true                                                                                                                      
        },
        //商品服务分类
        '000786': {
            url:  common.isliveCs() + '/serviceClassify/query',
            isNative: true                                                                                                                      
        },
        //商品服务-服务商品关系及数量信息
        '000906': {
            url:  common.isliveCs() + '/servicesku',
            isNative: true                                                                                                                       
        },
        //售后主业务（派工管理）
        '000929': {
            url: common.isliveCs() + '/resource-utilization/resource-utilization',
            isNative: true                                                                                                                      
        },
        //门店管理
        // '001076': {
        //     url: '/storemanage',
        //     isNative: true                                                                                                
        // },
        //供应商信息
        '000393': {
            url: common.isliveCs() + '/supplier/supplierSearch',
            isNative: true                                                                                                
        }, 
        //车型查询适配SKU
        '001091':{
            url: common.isliveCs() + '/carSku',
            isNative: true                     
        },
        //SKU车型适配全数据预览
        '001093':{
            url: common.isliveCs() + '/skuCarAll',
            isNative: true                      
        },
         /*==========================================演示测试==============================================================*/
        //非整车采购订单
        '000955' :{
            url: common.isliveCs() + '/purchase-order',
            isNative: true
        },
        // 自采管理
        '001601' :{
            url: common.isliveCs() + '/store-ownpurchase/search',
            isNative: true
        },
        // 自采到货处理
        '001602' :{
            url: common.isliveCs() + '/arrive-handle/query',
            isNative: true
        },
        //日常补货计划
        '001103' :{
            url: common.isliveCs() + '/dailyfill/query',
            isNative: true
        },
        //商品摆放目录
        '001425' :{
            url: common.isliveCs() + '/sku-place/query',
            isNative: true
        },
        //非整车采购退货
        '001326' :{
            url: common.isliveCs() + '/purchase-return/purchase-return-search',
            isNative: true
        },
        //出入库清单明细
        '001322' :{
            url: common.isliveCs() + '/warehousing-list',
            isNative: true
        },
        //入库清单明细
        '001319' :{
            url: common.isliveCs() + '/inventory-list',
            isNative: true
        },
        //集团内调拨入库单
        '000957' :{
            url: common.isliveCs() + '/group-allotin/query',
            isNative: true
        },
        //集团调拨出库单
        '000962' :{
            url: common.isliveCs() + '/group-allotout/query',
            isNative: true
        },
        //需求单
        '001126' :{
            url: common.isliveCs() + '/demand-order/require-goods',
            isNative: true
        },
        //组合商品
        '000349': {
            url: common.isliveCs() + '/skuComb',
            isNative: true                                                                                                                     
        },
        // 组合分类
        '001161' :{
            url: common.isliveCs() + '/groupClassify/query',
            isNative: true
        },
        // 组合目录
        '001155' :{
            url: common.isliveCs() + '/groupCatalog/query',
            isNative: true
        },
        // 门店管理
        '001069' :{
            url: common.isliveCs() + '/storemanage/query',
            isNative: true
        },
        //门店工位信息
        '000970' :{
            url: common.isliveCs() + '/store-station',
            isNative: true
        },
        //卡模板管理计次卡
        '001216' :{
            url: common.isliveCs() + '/card-template-counting/card-template-counting-query',
            isNative: true
        },
        //卡充值
        '001239' :{
            url: common.isliveCs() + '/card-pay/card-pay-search',
            isNative: true
        },
        //卡管理
        '001261' :{
            url: common.isliveCs() + '/card-manager/query',
            isNative: true
        },
        //卡销售单
        '001226' :{
            url: common.isliveCs() + '/card-sale-order/query',
            isNative: true
        },
        //退卡退款
        '001307' :{
            url: common.isliveCs() + '/back-card/back-card-query',
            isNative: true
        },

        // 券模板  
        '001469': {
            url: common.isliveCs() + '/ticket-template-counting/ticket-template-counting-query',
            isNative: true
        },
        // 券管理 
        '001667': {
            url: common.isliveCs() + '/ticket-manager/query',
            isNative: true
        },
        // 券销售
        '001952': {
            url: common.isliveCs() + '/coupons-sale-order/query',
            isNative: true
        },

        // 检查模板
        '001351' :{
            url: common.isliveCs() + '/check-template/check-template-search',
            isNative: true
        },
        // 对账单
        '001539' :{
            url: common.isliveCs() + '/statement-account/query',
            isNative: true
        },
        // 对账核销单
        '001549' : {
            url: common.isliveCs() + '/statement-account-cancel/query',
            isNative: true
        },
        // 自采对账核销
        '001780' : {
            url: common.isliveCs() + '/account-check/index',
            isNative: true
        },
        // 调拨相关清单
        '001564' :{
            url: common.isliveCs() + '/allot-relative/query',
            isNative: true
        },
        // 卡模版储值
        '001566' :{
            url: common.isliveCs() + '/card-template-storedvalue/card-template-storedvalue-query',
            isNative: true
        },
        // 退票
        '001376' :{
            url: common.isliveCs() + '/refund/refund-query',
            isNative: true
        },
        // 开票
        '001371' :{
            url: common.isliveCs() + '/workOrderInvoice/workOrderInvoice',
            isNative: true
        },
        // 洗车
        '001742': {
            url: common.isliveCs() + '/vehicle-cleaning/vehicle-cleaning-add',
            isNative: true
        },
        // 维修合同
        '001689': {
            url: common.isliveCs() + '/work-order/work-order-search',
            isNative: true
        },
        // 预约单
        '001913': {
            url: common.isliveCs() + '/appointment-new',
            isNative: true
        },
        // 预检单
        '001697': {
            url: common.isliveCs() + '/precheck-fix/precheck-fix-query',
            isNative: true
        },
        // 订单结算
        '001724': {
            url: common.isliveCs() + '/workOrderPay/workOrderPay',
            isNative: true
        },
        // 领料
        '001741': {
            url: common.isliveCs() + '/store-requisition/query',
            isNative: true
        },
        // 非整车工单基础包
        '001672': {
            url: common.isliveCs() + '/check-fix-list/query',
            isNative: true
        },
        // 促销折扣权限
        '001390' :{
            url: common.isliveCs() + '/sale-discount/sale-discount-search',
            isNative: true
        },
        //供应商
        '000636' :{
            url: common.isliveCs() + '/supplier/supplierSearch',
            isNative: true
        },
        // 服务推荐
        '001343' :{
            url: common.isliveCs() + '/service-recommend/query',
            isNative: true
        },
        // 人车-会员车辆信息
        '001437' :{
            url: common.isliveCs() + '/mancar/query',
            isNative: true
        },
        // 商品信息
        '000905' :{
            url: common.isliveCs() + '/skuinfo/query',
            isNative: true
        },
        // 服务信息
        '000803' :{
            url: common.isliveCs() + '/serviceitem/query',
            isNative: true
        },
        // 非整车商品采购
        '001506' :{
            url: common.isliveCs() + '/notarchives-put/notarchives-query',
            isNative: true
        }
    }
}