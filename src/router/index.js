/**
 * create by lwx on 2018/03/09 12:08
 *
 * 注意: 1. 配置路由时, 请严格注重层级结构， 父子之间有严格的格式关系，
 *       2. 缩进（ 4个空格 ）
 *       3. 在开始每个大模块之前请添加注释
 *       4. 路由配置好之后关注浏览器控制台是否有warning, 如果有请及时处理掉
 *
 * @see  这个文件以后大家操作可能最频繁，为了更少的代码冲突，请严格参照以上四点执行
 */
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
var base = process.env.NODE_ENV === 'development' ? '/' : '/livecs';
const router =  new Router({
	mode: 'history',
	base: base,
	routes: [
		{
			path: '/',
			// redirect: {name:'vehicle-cleaning'},
			name: '首页',
			meta: {
				label: '首页'
			},
			component: resolve => require(['components/containers/Full.vue'], resolve),
			children: [
				{
					path: 'menulist',
					name: 'menulist',
					meta: {
						label: 'menulist'
					},
					component: resolve => require(['views/menulist/menu.vue'], resolve)
				},
				{
					path: 'blitem',
					redirect: { name: 'blitemSearch' },
					name: 'blitem',
					meta: {
						label: '盘点单'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'blitemSearch',
							name: 'blitemSearch',
							meta: {
								label: '盘点单查询'
							},
							component: resolve => require(['views/blitem/blitem-search'], resolve)
						},
						{
							path: 'blitemDetails',
							name: 'blitemDetails',
							meta: {
								label: '盘点单详情'
							},
							component: resolve => require(['views/blitem/blitem-details'], resolve)
						},
						{
							path: 'tempadd',
							name: 'tempadd',
							meta: {
								label: '新增临时盘点单'
							},
							component: resolve => require(['views/checkplan/tempadd'], resolve)
						}
					]
				},
				// 采购合同
				{
					path: 'purchasecontract',
					redirect: {name:'purchasecontractSearch'},
					name: 'purchasecontract',
					meta: {
						label: '采购合同'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'search',
							name: 'purchasecontractSearch',
							meta: {
								label: '采购合同查询'
							},
							component: resolve => require(['views/purchasecontract'], resolve)
						},
						{
							path: 'delital',
							name: 'purchasecontractDelital',
							meta: {
								label: '采购合同详情'
							},
							component: resolve => require(['views/purchasecontract/eidt'], resolve)
						},
						{
							path: 'eidt',
							name: 'purchasecontractEidt',
							meta: {
								label: '采购合同编辑'
							},
							component: resolve => require(['views/purchasecontract/eidt'], resolve)
						},
						{
							path: 'add',
							name: 'purchasecontractAdd',
							meta: {
								label: '采购合同新增'
							},
							component: resolve => require(['views/purchasecontract/eidt'], resolve)
						},
					]
				},
				// 员工管理
				{
					path: 'staff',
					redirect: {name:"staffSearch"},
					name: 'staff',
					meta: {
						label: '员工管理'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'search',
							name: 'staffSearch',
							meta: {
								label: '员工查询'
							},
							component: resolve => require(['views/staff'], resolve)
						},
						{
							path: 'add',
							name: 'staffAdd',
							meta: {
								label: '员工信息新增'
							},
							component: resolve => require(['views/staff/eidt'], resolve)
						},
						{
							path: 'delital',
							name: 'staffDetail',
							meta: {
								label: '员工信息详情'
							},
							component: resolve => require(['views/staff/eidt'], resolve)
						},
						{
							path: 'eidt',
							name: 'staffEidt',
							meta: {
								label: '员工信息编辑'
							},
							component: resolve => require(['views/staff/eidt'], resolve)
						},
					]
				},
				// 商品车型适配
				{
					path: 'skuCar',
					redirect: {name:"skuCarSearch"},
					name: 'skuCar',
					meta: {
						label: '商品车型适配'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'skuCarSearch',
							name: 'skuCarSearch',
							meta: {
								label: '商品车型适配信息'
							},
							component: resolve => require(['views/skucar/skucar-search'], resolve)
						},
						{
							path: 'skuCarAdd',
							name: 'skuCarAdd',
							meta: {
								label: '新增'
							},
							component: resolve => require(['views/skucar/skucar-eidt'], resolve)
						},
						{
							path: 'skuCarEift',
							name: 'skuCarEidt',
							meta: {
								label: '编辑'
							},
							component: resolve => require(['views/skucar/skucar-eidt'], resolve)
						},
						{
							path: 'skuCarDetail',
							name: 'skuCarDetail',
							meta: {
								label: '详情'
							},
							component: resolve => require(['views/skucar/skucar-eidt'], resolve)
						},
					]
				},
				{
					path: 'carSku',
					name: 'carSku',
					meta: {
						label: '车型查询适配SKU'
					},
					component: resolve => require(['views/skucar/carsku-search'], resolve)
				},
				{
					path: 'skuCarAll',
					name: 'skuCarAll',
					meta: {
						label: 'SKU车型适配全数据预览'
					},
					component: resolve => require(['views/skucar/skucarall-search'], resolve)
				},
				// 打卡
                {
                    path: 'clock',
                    name: 'clock',
                    redirect: {name:"Punch the clock"},
                    meta: {
                        label: '打卡'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [
						{
							path: 'clock',
							name: 'Punch the clock',
							meta: {
								label: '打卡'
							},
							component: resolve => require(['views/clock/index'], resolve)
						},
						{
							path: 'technician-tdetail/:id',
							name: 'clockDetail',
							meta: {
								label: '详情'
							},
							component: resolve => require(['views/clock/technician/detail/detail'], resolve)
						},
						{
							path: 'station-tdetail/:id',
							name: 'clockDetail2',
							meta: {
								label: '打卡'
							},
							component: resolve => require(['views/clock/station/detail/detail'], resolve)
						},
					]
                },
				// 盘点计划
				{
					path: 'checkplan',
					redirect: {name: 'checkplan-query'},
					name: 'check-plan',
					meta: {
						label: '盘点计划'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'checkplan-query',
							meta: {
								label: '盘点计划查询'
							},
							component: resolve => require(['views/checkplan'], resolve)
						},
						{
							path: 'add/:orderNo',
							name: 'checkplan-add',
							meta: {
								label: '盘点计划新增'
							},
							component: resolve => require(['views/checkplan/add'], resolve)
						},
						{
							path: 'edit/:orderNo',
							name: 'checkplan-edit',
							meta: {
								label: '盘点计划编辑'
							},
							component: resolve => require(['views/checkplan/add'], resolve)
						},
						{
							path: 'overView/:orderNo',
							name: 'checkplan-detail',
							meta: {
								label: '盘点计划详情'
							},
							component: resolve => require(['views/checkplan/add'], resolve)
						}
					]
				},
				// 卡管理
				{
					path: 'card-manager',
					redirect: {name: 'card-manager-query'},
					name: 'card-manager',
					meta: {
						label: '卡管理'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'card-manager-query',
							meta: {
								label: '查询'
							},
							component: resolve => require(['views/card-manage'], resolve)
						},
						{
							path: 'add/:code',
							name: 'card-manager-add',
							meta: {
								label: '新增'
							},
							component: resolve => require(['views/card-manage/add.vue'], resolve)
						},
						{
							path: 'operate/:code',
							name: 'card-manager-operate',
							meta: {
								label: '卡操作'
							},
							component: resolve => require(['views/card-manage/card-edit-page.vue'], resolve)
						}
					]
				},
				// 券管理
				{
					path: 'ticket-manager',
					redirect: {name: 'ticket-manager-query'},
					name: 'ticket-manager',
					meta: {
						label: '券管理'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'ticket-manager-query',
							meta: {
								label: '查询'
							},
							component: resolve => require(['views/ticket-manage'], resolve)
						},
						{
							path: 'add/:code',
							name: 'ticket-manager-add',
							meta: {
								label: '新增'
							},
							component: resolve => require(['views/ticket-manage/add.vue'], resolve)
						},
						{
							path: 'operate/:code',
							name: 'ticket-manager-operate',
							meta: {
								label: '券操作'
							},
							component: resolve => require(['views/ticket-manage/ticket-edit-page.vue'], resolve)
						}
					]
				},
				// 账期账务
				{
					path: 'accounting',
					redirect: {name: 'accounting-query'},
					name: 'accounting',
					meta: {
						label: '账期账务'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'accounting-query',
							meta: {
								label: '账期账务查询'
							},
							component: resolve => require(['views/accounting'], resolve)
						},
						{
							path: 'edit/:accountingcode',
							name: 'accounting-edit',
							meta: {
								label: '编辑'
							},
							component: resolve => require(['views/accounting/edit.vue'], resolve)
						}
					]
				},
				// 服务项目
				{
					path: 'serviceitem',
					redirect: {name: 'serviceitem-query'},
					name: 'service-item',
					meta: {
						label: '服务信息'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'serviceitem-query',
							meta: {
								label: '服务信息查询'
							},
							component: resolve => require(['views/serviceitem/'], resolve)
						},
						{
							path: 'edit/:code',
							name: 'serviceitem-edit',
							meta: {
								label: '编辑'
							},
							component: resolve => require(['views/serviceitem/add.vue'], resolve)
						},
						{
							path: 'add/:code',
							name: 'serviceitem-add',
							meta: {
								label: '新增'
							},
							component: resolve => require(['views/serviceitem/add.vue'], resolve)
						},
						{
							path: 'show/:code',
							name: 'serviceitem-show',
							meta: {
								label: '查看'
							},
							component: resolve => require(['views/serviceitem/add.vue'], resolve)
						}
					]
				},
				// 门店管理
				{
					path: 'storemanage',
					redirect: {name: 'storemanage-query'},
					name: 'storemanage',
					meta: {
						label: '门店管理'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'storemanage-query',
							meta: {
								label: '查询'
							},
							component: resolve => require(['views/storemanage'], resolve)
						},
						{
							path: 'add/:code',
							name: 'storemanage-add',
							meta: {
								label: '新增'
							},
							component: resolve => require(['views/storemanage/add.vue'], resolve)
						},
						{
							path: 'edit/:code',
							name: 'storemanage-edit',
							meta: {
								label: '编辑'
							},
							component: resolve => require(['views/storemanage/add.vue'], resolve)
						},
						{
							path: 'show/:code',
							name: 'storemanage-show',
							meta: {
								label: '详情'
							},
							component: resolve => require(['views/storemanage/add.vue'], resolve)
						}
					]
				},
				// 服务固定价格
				{
					path: 'service-staticprice',
					redirect: {	name: 'service-staticprice-query'},
					name: 'service-staticprice',
					meta: {
						label: '服务固定价格'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'service-staticprice-query',
							meta: {
								label: '查询'
							},
							component: resolve => require(['views/service-staticprice'], resolve)
						},
						{
							path: 'add/:code',
							name: 'service-staticprice-add',
							meta: {
								label: '新增'
							},
							component: resolve => require(['views/service-staticprice/add.vue'], resolve)
						}
					]
				},
				// 服务工时  creat by lwx
				{
					path: 'service-manhour',
					redirect: {name:'service-manhour-query'},
					name: 'service-manhour',
					meta: {
						label: '服务工时'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'service-manhour-query',
							meta: {
								label: '查询'
							},
							component: resolve => require(['views/service-manhour'], resolve)
						},
						{
							path: 'insert',
							name: 'service-manhour-insert',
							meta: {
								label: '新增'
							},
							component: resolve => require(['views/service-manhour/insert/insert'], resolve)
						},
						{
							path: 'subinsert',
							name: 'service-manhour-insert-add',
							meta: {
								label: '新增扩展属性'
							},
							component: resolve => require(['views/service-manhour/insert/sub-insert'], resolve)
						}
					]
				},
				// 调拨入库单
				{
					path: 'allotin',
					redirect: {name:'allotin-query'},
					name: 'allotin',
					meta: {
						label: '调拨入库单-非整车'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'allotin-query',
							meta: {
								label: '调拨入库单查询'
							},
							component: resolve => require(['views/allotin'], resolve)
						},
						{
							path: 'add',
							name: 'allotin-add',
							meta: {
								label: '新增调拨入库单'
							},
							component: resolve => require(['views/allotin/add.vue'], resolve)
						},
						{
							path: 'show',
							name: 'allotin-show',
							meta: {
								label: '详情页'
							},
							component: resolve => require(['views/allotin/add.vue'], resolve)
						},

					]
				},
				// 集团内调拨入库单
				{
					path: 'group-allotin',
					redirect: {name:'group-allotin-query'},
					name: 'group-allotin',
					meta: {
						label: '调拨入库单-集团内'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'group-allotin-query',
							meta: {
								label: '调拨入库单查询'
							},
							component: resolve => require(['views/group-allotin'], resolve)
						},
						{
							path: 'add',
							name: 'group-allotin-add',
							meta: {
								label: '新增调拨入库单'
							},
							component: resolve => require(['views/group-allotin/add.vue'], resolve)
						},
						{
							path: 'show',
							name: 'group-allotin-show',
							meta: {
								label: '详情页'
							},
							component: resolve => require(['views/group-allotin/add.vue'], resolve)
						},

					]
				},
				// 调拨相关清单
				{
					path: 'allot-relative',
					redirect: {name:'allot-relative-query'},
					name: 'allot-relative',
					meta: {
						label: '调拨相关清单'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'allot-relative-query',
							meta: {
								label: '调拨相关清单查询'
							},
							component: resolve => require(['views/allot-relative-ticket'], resolve)
						}
					]
				},
				// 商品摆放目录
				{
					path: 'sku-place',
					redirect: {name:'sku-place-query'},
					name: 'sku-place',
					meta: {
						label: '商品摆放目录'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'sku-place-query',
							meta: {
								label: '查询'
							},
							component: resolve => require(['views/sku-place'], resolve)
						}
					]
				},
				// 对账单
				{
					path: 'statement-account',
					redirect: {name:'statement-account-query'},
					name: 'statement-account',
					meta: {
						label: '对账单'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'statement-account-query',
							meta: {
								label: '查询'
							},
							component: resolve => require(['views/statement-account'], resolve)
						},
						{
							path: 'addaccount',
							name: 'statement-account-addaccount',
							meta: {
								label: '新建对账单'
							},
							component: resolve => require(['views/statement-account/account-detail.vue'], resolve)
						},
						{
							path: 'editaccount',
							name: 'statement-account-editaccount',
							meta: {
								label: '编辑页'
							},
							component: resolve => require(['views/statement-account/account-detail.vue'], resolve)
						},
						{
							path: 'showaccount',
							name: 'statement-account-showaccount',
							meta: {
								label: '详情页'
							},
							component: resolve => require(['views/statement-account/account-detail.vue'], resolve)
						},
						{
							path: 'addrefund',
							name: 'statement-account-addrefund',
							meta: {
								label: '新建退货单'
							},
							component: resolve => require(['views/statement-account/refund-detail.vue'], resolve)
						},
						{
							path: 'editrefund',
							name: 'statement-account-editrefund',
							meta: {
								label: '编辑页'
							},
							component: resolve => require(['views/statement-account/refund-detail.vue'], resolve)
						},
						{
							path: 'showrefund',
							name: 'statement-account-showrefund',
							meta: {
								label: '详情页'
							},
							component: resolve => require(['views/statement-account/refund-detail.vue'], resolve)
						},
					]
				},
				// 对账核销
				{
					path: 'statement-account-cancel',
					redirect: {name:'statement-account-cancel-query'},
					name: 'statement-account-cancel',
					meta: {
						label: '对账核销'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'statement-account-cancel-query',
							meta: {
								label: '查询'
							},
							component: resolve => require(['views/statement-account-cancel/'], resolve)
						},
						{
							path: 'create',
							name: 'statement-account-cancel-create',
							meta: {
								label: '对账核销单'
							},
							component: resolve => require(['views/statement-account-cancel/createStatement'], resolve)
						},
						{
							path: 'edit',
							name: 'statement-account-cancel-edit',
							meta: {
								label: '对账核销单'
							},
							component: resolve => require(['views/statement-account-cancel/verifiedStatement'], resolve)
						}
					]
				},
				// 调拨出库单
				{
					path: 'allotout',
					redirect: {name:'allotout-query'},
					name: 'allotout',
					meta: {
						label: '调拨出库单-非整车'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'allotout-query',
							meta: {
								label: '调拨出库单查询'
							},
							component: resolve => require(['views/allotout'], resolve)
						},
						{
							path: 'add',
							name: 'allotout-add',
							meta: {
								label: '调拨出库单查询'
							},
							component: resolve => require(['views/allotout/add.vue'], resolve)
						},
						{
							path: 'edit/:transferOutOrderNo',
							name: 'allotout-edit',
							meta: {
								label: '编辑调拨出库单'
							},
							component: resolve => require(['views/allotout/add.vue'], resolve)
						},
						{
							path: 'details/:transferOutOrderNo',
							name: 'allotout-details',
							meta: {
								label: '详情调拨出库单'
							},
							component: resolve => require(['views/allotout/add.vue'], resolve)
						}
					]
				},
				{
					path: 'supplier',
					redirect: {name:"supplierSearch"},
					name: 'supplier',
					meta: {
						label: '供应商'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'supplierSearch',
							name: 'supplierSearch',
							meta: {
								label: '供应商查询'
							},
							component: resolve => require(['views/supplier/supplier-search.vue'], resolve)
						},
						{
							path: 'supplierDetail/:id',
							name: 'supplierDetail',
							meta: {
								label: '供应商详情'
							},
							component: resolve => require(['views/supplier/supplier-details.vue'], resolve)
						},
						{
							path: 'supplierAdd',
							name: 'supplierAdd',
							meta: {
								label: '新建供应商'
							},
							component: resolve => require(['views/supplier/addsupplier.vue'], resolve)
						}
					]
				},
				{
					path: 'decrease-overflow',
					name: 'decrease-overflow',
					meta: {
						label: '报损报溢'
					},
					redirect: {name:"decreaseoverflowquery"},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'decreaseoverflowquery',
							meta: {
								label: '报损报溢'
							},
							component: resolve => require(['views/decrease-overflow/index.vue'], resolve)
						},
						{
							path: 'insert',
							name: 'insertdecreaseoverflow',
							meta: {
								label: '新增报损报溢'
							},
							component: resolve => require(['views/decrease-overflow/insert.vue'], resolve)
						},
						{
							path: 'updata',
							name: 'updatadecreaseoverflow',
							meta: {
								label: '编辑报损报溢'
							},
							component: resolve => require(['views/decrease-overflow/upData.vue'], resolve)
						},
						{
							path: 'detail',
							name: 'detaildecreaseoverflow',
							meta: {
								label: '报损报溢详情'
							},
							component: resolve => require(['views/decrease-overflow/upData.vue'], resolve)
						}
					]
				},
				// 门店工位信息  creat by lwx
				{
					path: 'store-station',
					name: 'store-station',
					meta: {
						label: '门店工位信息'
					},
					component: resolve => require(['views/store-station/index'], resolve)
				},
				// 员工排班  creat by lwx
				{
					path: 'emp-scheduling',
					name: 'emp-scheduling',
					meta: {
						label: '员工排班'
					},
					component: resolve => require(['views/emp-scheduling/index'], resolve)
				},
				//服务目录
				{
					path: 'serviceCatalog',
					redirect: {name:'serviceCatalog-query'},
					name: 'serviceCatalog',
					meta: {
						label: '服务目录'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'serviceCatalog-query',
							meta: {
								label: '服务目录查询'
							},
							component: resolve => require(['views/catalog'], resolve)
						},

					]
				},
				//组合目录
				{
					path: 'groupCatalog',
					redirect: {name:'groupCatalog-query'},
					name: 'groupCatalog',
					meta: {
						label: '组合目录'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'groupCatalog-query',
							meta: {
								label: '组合目录查询'
							},
							component: resolve => require(['views/group-catalog'], resolve)
						},

					]
				},
				// 服务分类
				{
					path: 'serviceClassify',
					redirect: {name:'serviceClassify-query'},
					name: 'serviceClassify',
					meta: {
						label: '服务分类'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'serviceClassify-query',
							meta: {
								label: '服务分类查询'
							},
							component: resolve => require(['views/classification'], resolve)
						},

					]
				},
				// 组合分类
				{
					path: 'groupClassify',
					redirect: {name:'groupClassify-query'},
					name: 'groupClassify',
					meta: {
						label: '组合分类'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'groupClassify-query',
							meta: {
								label: '组合分类查询'
							},
							component: resolve => require(['views/group-classification'], resolve)
						},

					]
				},
				//员工岗位
				{
					path: 'staffjobs',
					redirect: {name:'staffjobs-query'},
					name: 'staffjobs',
					meta: {
						label: '员工岗位'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'staffjobs-query',
							meta: {
								label: '员工岗位查询'
							},
							component: resolve => require(['views/staffjobs'], resolve)
						},
						{
							path: 'addJobs/:staffNo',
							name: 'add-jobs',
							meta: {
								label: '配置岗位'
							},
							component: resolve => require(['views/staffjobs/addJobs'], resolve)
						},
						{
							path: 'addWorks/:staffNo',
							name: 'add-works',
							meta: {
								label: '配置工种'
							},
							component: resolve => require(['views/staffjobs/addWorks'], resolve)
						},

					]
				},
				{
					path: 'skuinfo',
					redirect: {name:'skuinfo-query'},
					name: 'skuinfo',
					meta: {
						label: '商品信息'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'skuinfo-query',
							meta: {
								label: '商品信息查询'
							},
							component: resolve => require(['views/skuinfo'], resolve)
						},
						{
							path: 'add',
							name: 'skuinfo-add',
							meta: {
								label: '新增商品信息'
							},
							component: resolve => require(['views/skuinfo/addskuinfo'], resolve)
						},
						{
							path: 'udata',
							name: 'skuinfo-updata',
							meta: {
								label: '编辑商品信息'
							},
							component: resolve => require(['views/skuinfo/updataskuinfo'], resolve)
						},
						{
							path: 'udata',
							name: 'skuinfo-detail',
							meta: {
								label: '商品信息详情'
							},
							component: resolve => require(['views/skuinfo/updataskuinfo'], resolve)
						},
					]
				},
				{
					path: 'servicesku',
					name: 'servicesku',
					meta: {
						label: '服务-SKU关系及数量配置'
					},
					component: resolve => require(['views/servicesku'], resolve),
				},
				{
					path: 'demo',
					name: 'demo',
					meta: {
						label: 'demo'
					},
					component: resolve => require(['views/demo/index'], resolve)
				},
				// 组合商品
                {
                    path: 'skuComb',
                    name: 'skuComb',
                    redirect: {name:'querySkuComb'},
                    meta: {
                        label: '组合'
                    },
                    component: {
                        render(b) {
                            return b('router-view')
                        }
                    },
                    children: [{
                            path: 'query',
                            name: 'querySkuComb',
                            meta: {
                                label: '组合商品查询'
                            },
                            component: resolve => require(['views/sku-comb'], resolve)
                        },
                        {
                            path: 'add',
                            name: 'addSkuComb',
                            meta: {
                                label: '新增组合商品'
                            },
                            component: resolve => require(['views/sku-comb/editSkuComb'], resolve)
                        },
                        {
                            path: 'edit/:combinationCode',
                            name: 'editSkuComb',
                            meta: {
                                label: '编辑组合商品'
                            },
                            component: resolve => require(['views/sku-comb/editSkuComb'], resolve)
                        }
                    ]
				},
				// 售后主业务 - 资源利用看板  creat by lwx
                {
                    path: 'resource-utilization',
                    name: 'afterSale',
                    redirect: {name:"resource-utilization"},
                    meta: {
                        label: '派工'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'resource-utilization',
                        name: 'resource-utilization',
                        meta: {
                            label: '工位利用看板'
                        },
                        component: resolve => require(['views/main-business/resource-utilization/resource-utilization'], resolve)
                    }, {
                        path: 'detail/:id',
                        name: 'detail',
                        meta: {
                            label: '工位利用看板'
                        },
                        component: resolve => require(['views/main-business/resource-utilization/tc-detail/tc-detail'], resolve)
                    }, {
                        path: 'query',
                        name: '派工',
                        meta: {
                            label: '派工'
                        },
                        component: resolve => require(['views/main-business/dispatch-info'], resolve)
                    }, {
                        path: 'dispatching',
                        name: 'editdispatch',
                        meta: {
                            label: '编辑派工'
                        },
                        component: resolve => require(['views/main-business/dispatching/dispatching'], resolve)
					}
					// , {
                    //     path: 'newWorkList',
                    //     name: 'newWorkList',
                    //     meta: {
                    //         label: '新建工单'
                    //     },
                    //     component: resolve => require(['views/main-business/newWorkList'], resolve)
					// }
				]
				},
				{
					path: 'dailyfill',
					redirect: {name:'dailyfill-query'},
					name: 'dailyfill',
					meta: {
						label: '日常补货计划'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'dailyfill-query',
							meta: {
								label: '日常补货单查询'
							},
							component: resolve => require(['views/dailyfill'], resolve)
						},
						{
							path: 'add',
							name: 'dailyfill-add',
							meta: {
								label: '新增日常补货单'
							},
							component: resolve => require(['views/dailyfill/adddailyfill'], resolve)
						},
						{
							path: 'udata',
							name: 'dailyfill-updata',
							meta: {
								label: '编辑日常补货单'
							},
							component: resolve => require(['views/dailyfill/updatadailyfill'], resolve)
						},
						{
							path: 'udata',
							name: 'dailyfill-detail',
							meta: {
								label: '日常补货单详情'
							},
							component: resolve => require(['views/dailyfill/updatadailyfill'], resolve)
						},
					]
				},
				// 集团内转售调拨出库单
				{
					path: 'group-allotout',
					redirect: {name:'group-allotout-query'},
					name: 'group-allotout',
					meta: {
						label: '集团调拨出库单-非整车'
					},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'group-allotout-query',
							meta: {
								label: '集团调拨出库单查询'
							},
							component: resolve => require(['views/group-allotout'], resolve)
						},
						{
							path: 'add',
							name: 'group-allotout-add',
							meta: {
								label: '调拨出库单查询'
							},
							component: resolve => require(['views/group-allotout/add.vue'], resolve)
						},
						{
							path: 'edit/:transferOutOrderNo',
							name: 'group-allotout-edit',
							meta: {
								label: '编辑调拨出库单'
							},
							component: resolve => require(['views/group-allotout/add.vue'], resolve)
						},
						{
							path: 'details/:transferOutOrderNo',
							name: 'group-allotout-details',
							meta: {
								label: '详情调拨出库单'
							},
							component: resolve => require(['views/group-allotout/add.vue'], resolve)
						}
					]
				},
				// 需求单
                {
                    path: 'demand-order',
                    name: 'demandOrder',
                    redirect: {name:"require-goods"},
                    meta: {
                        label: '需求单'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'require-goods',
                        name: 'require-goods',
                        meta: {
                            label: '要货管理'
                        },
                        component: resolve => require(['views/demand-order/require-goods'], resolve)
					},
					{
                        path: 'purchase-manage',
                        name: 'purchase-manage',
                        meta: {
                            label: '采购管理'
                        },
                        component: resolve => require(['views/demand-order/purchase-manage'], resolve)
					},{
                        path: 'allot',
                        name: 'allot',
                        meta: {
                            label: '调拨处理'
                        },
                        component: resolve => require(['views/demand-order/allot'], resolve)
					},]
				},
				// 门店自采管理
                {
                    path: 'store-ownpurchase',
                    name: 'store-ownpurchase',
                    redirect: {name:"store-ownpurchase-search"},
                    meta: {
                        label: '自采管理'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'search',
                        name: 'store-ownpurchase-search',
                        meta: {
                            label: '自采查询'
                        },
                        component: resolve => require(['views/store-ownpurchase/index'], resolve)
					},
					{
                        path: 'store-ownpurchase-handle',
                        name: 'store-ownpurchase-handle',
                        meta: {
                            label: '自采处理'
                        },
                        component: resolve => require(['views/store-ownpurchase/handle'], resolve)
                    }]
				},
				// 自采到货处理  creat by lwx
                {
                    path: 'arrive-handle',
                    name: 'arrive-handle',
                    redirect: {name:"arrive-handle-query"},
                    meta: {
                        label: '自采到货处理'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'query',
                        name: 'arrive-handle-query',
                        meta: {
                            label: '到货处理查询'
                        },
                        component: resolve => require(['views/demand-order/arrive-handle/index'], resolve)
					},
					{
                        path: 'comfirm',
                        name: 'arrive-handle-comfirm',
                        meta: {
                            label: '确认处理'
                        },
                        component: resolve => require(['views/demand-order/arrive-handle/comfirm/index'], resolve)
					},]
				},
				//审批流
				{
					path:'approval-flow',
					name:'approval-flow',
					redirect: {name:"approval-flow-details"},//2018、7.2 修改，默认注释掉
					meta: {
                            label: '审批详情'
                        },
                  	/*component:resolve => require(['views/approval-flow/index'], resolve)*/
          	  	   component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'details',
                        name: 'approval-flow-details',
                        meta: {
                            label: '审批详情查看 '
                        },
                        component:resolve => require(['views/approval-flow/index'], resolve)
					},
					/*{
                        path: 'error',
                        name: 'approval-flow-error',
                        meta: {
                            label: ' '
                        },
                     	component: resolve => require(['views/error/index.vue'], resolve)
					},*/
					]
                  	
				},
				// 卡销售  creat by lwx, pkl, pjl
                {
                    path: 'card-sale-order',
                    name: 'card-sale-order',
                    redirect: {name:"card-sale-order-query"},
                    meta: {
                        label: '卡销售单'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'query',
                        name: 'card-sale-order-query',
                        meta: {
                            label: '卡销售单查询'
                        },
                        component: resolve => require(['views/card-sale/card-sale-order/index'], resolve)
					},
					{
                        path: 'card-sale-query',
                        name: 'card-sale-query',
                        meta: {
                            label: '卡查询'
                        },
                        component: resolve => require(['views/card-sale/card-sale/index'], resolve)
					},
					{
                        path: 'insert',
                        name: 'card-sale-insert',
                        meta: {
                            label: '新增'
                        },
                        component: resolve => require(['views/card-sale/edit/edit'], resolve)
					},
					{
                        path: 'edit',
                        name: 'card-sale-edit',
                        meta: {
                            label: '编辑'
                        },
                        component: resolve => require(['views/card-sale/edit/edit'], resolve)
					},
					{
                        path: 'detail',
                        name: 'card-sale-detail',
                        meta: {
                            label: '详情'
                        },
                        component: resolve => require(['views/card-sale/edit/edit'], resolve)
					},]
				},
				// 检查模板
                {
                    path: 'check-template',
                    name: 'check-template',
                    redirect: {name:"check-template-search"},
                    meta: {
                        label: '检查模板'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'check-template-search',
                        name: 'check-template-search',
                        meta: {
                            label: '模板信息查询'
                        },
                        component: resolve => require(['views/check-template/index'], resolve)
					},
					{
                        path: 'check-template-add',
                        name: 'check-template-add',
                        meta: {
                            label: '模板信息新增'
                        },
                        component: resolve => require(['views/check-template/eidt'], resolve)
					},
					{
                        path: 'check-template-eidt',
                        name: 'check-template-eidt',
                        meta: {
                            label: '模板信息编辑'
                        },
                        component: resolve => require(['views/check-template/eidt'], resolve)
					},
					{
                        path: 'check-template-detail',
                        name: 'check-template-detail',
                        meta: {
                            label: '模板信息详情'
                        },
                        component: resolve => require(['views/check-template/eidt'], resolve)
					},]
				},
				{
                    path: 'ticket-template-counting',
                    name: 'ticket-template-counting',
                    redirect: {name:"ticket-template-counting-query"},
                    meta: {
                        label: '券模板'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
					},
					children: [{
                        path: 'ticket-template-counting-add',
                        name: 'ticket-template-counting-add',
                        meta: {
                            label: '券模板新增'
                        },
                        component: resolve => require(['views/ticket-template-counting/add-template'], resolve)
					},
					{
                        path: 'ticket-template-counting-updata',
                        name: 'ticket-template-counting-updata',
                        meta: {
                            label: '券模板编辑'
                        },
                        component: resolve => require(['views/ticket-template-counting/updata-template'], resolve)
					},{
                        path: 'ticket-template-counting-detail',
                        name: 'ticket-template-counting-detail',
                        meta: {
                            label: '券模板详情'
                        },
                        component: resolve => require(['views/ticket-template-counting/updata-template'], resolve)
					},{
                        path: 'ticket-template-counting-query',
                        name: 'ticket-template-counting-query',
                        meta: {
                            label: '券模板查询'
                        },
                        component: resolve => require(['views/ticket-template-counting'], resolve)
					},
					{
						path: 'makeTicket/:code',
						name: 'ticket-template-counting-makeTicket',
						meta: {
							label: '制券'
						},
						component: resolve => require(['views/ticket-manage/add.vue'], resolve)
					},	
					]
				},
				// 卡模板
                {
                    path: 'card-template-storedvalue',
                    name: 'card-template-storedvalue',
                    redirect: {name:"card-template-storedvalue-query"},
                    meta: {
                        label: '卡模板（储值）'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
					},
					children: [{
                        path: 'card-template-storedvalue-add',
                        name: 'card-template-storedvalue-add',
                        meta: {
                            label: '卡模板新增'
                        },
                        component: resolve => require(['views/card-template-storedvalue/updata-template'], resolve)
					},
					{
                        path: 'card-template-storedvalue-updata',
                        name: 'card-template-storedvalue-updata',
                        meta: {
                            label: '卡模板编辑'
                        },
                        component: resolve => require(['views/card-template-storedvalue/updata-template'], resolve)
					},{
                        path: 'card-template-storedvalue-detail',
                        name: 'card-template-storedvalue-detail',
                        meta: {
                            label: '卡模板详情'
                        },
                        component: resolve => require(['views/card-template-storedvalue/updata-template'], resolve)
					},{
                        path: 'card-template-storedvalue-query',
                        name: 'card-template-storedvalue-query',
                        meta: {
                            label: '卡模板查询'
                        },
                        component: resolve => require(['views/card-template-storedvalue'], resolve)
					},]
				},
				// 退卡
                {
                    path: 'back-card',
                    name: 'back-card',
                    redirect: {name:"back-card-query"},
                    meta: {
                        label: '退卡退款'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [
					{
                        path: 'back-card-add',
                        name: 'back-card-add',
                        meta: {
                            label: '计次卡退卡'
                        },
                        component: resolve => require(['views/back-card/return-card/add-back-card.vue'], resolve)
					},
					{
                        path: 'back-card-edit',
                        name: 'back-card-edit',
                        meta: {
                            label: '计次卡退卡'
                        },
                        component: resolve => require(['views/back-card/return-card/add-back-card.vue'], resolve)
					},
					{
                        path: 'back-card-query',
                        name: 'back-card-query',
                        meta: {
                            label: '查询'
                        },
                        component: resolve => require(['views/back-card'], resolve)
					},
					{
                        path: 'add-drawback',
                        name: 'add-drawback',
                        meta: {
                            label: '储值卡退款'
                        },
                        component: resolve => require(['views/back-card/drawback/add-drawback.vue'], resolve)
					},
					{
                        path: 'back-card-refund/:code',
                        name: 'back-card-refund',
                        meta: {
                            label: '储值卡退款'
                        },
                        component: resolve => require(['views/back-card/refund.vue'], resolve)
					},
				]
				},
				// 卡模板
                {
                    path: 'card-template-counting',
                    name: 'card-template-counting',
                    redirect: {name:"card-template-counting-query"},
                    meta: {
                        label: '卡模板（计次）'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [
					{
						path: 'makeCard/:code',
						name: 'card-template-counting-makeCard',
						meta: {
							label: '制卡'
						},
						component: resolve => require(['views/card-manage/add.vue'], resolve)
					},	
					{
                        path: 'card-template-counting-add',
                        name: 'card-template-counting-add',
                        meta: {
                            label: '卡模板新增'
                        },
                        component: resolve => require(['views/card-template-counting/add-template'], resolve)
					},{
                        path: 'card-template-counting-query',
                        name: 'card-template-counting-query',
                        meta: {
                            label: '卡模板查询'
                        },
                        component: resolve => require(['views/card-template-counting'], resolve)
					},{
                        path: 'card-template-counting-updata',
                        name: 'card-template-counting-updata',
                        meta: {
                            label: '卡模板编辑'
                        },
                        component: resolve => require(['views/card-template-counting/updata-template.vue'], resolve)
					},{
                        path: 'card-template-counting-detail',
                        name: 'card-template-counting-detail',
                        meta: {
                            label: '卡模板详情'
                        },
                        component: resolve => require(['views/card-template-counting/updata-template.vue'], resolve)
					},{
                        path: 'card-template-counting-cancel',
                        name: 'card-template-counting-cancel',
                        meta: {
                            label: '卡模板作废'
                        },
                        component: resolve => require(['views/card-template-counting/cancel-template.vue'], resolve)
					}]
				},
				//退票
				{
                    path: 'refund',
                    name: 'refund',
                    redirect: {name:"refund-query"},
                    meta: {
                        label: '退票'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'refund-query',
                        name: 'refund-query',
                        meta: {
                            label: '退票列表查询'
                        },
                        component: resolve => require(['views/refund/index'], resolve)
					},
					{
                        path: 'refund-add',
                        name: 'refund-add',
                        meta: {
                            label: '退票列表新增'
                        },
                        component: resolve => require(['views/refund/add-note'], resolve)
					},
					{
                        path: 'refund-detail',
                        name: 'refund-detail',
                        meta: {
                            label: '退票详情'
                        },
                        component: resolve => require(['views/refund/add-note'], resolve)
					},
					{
                        path: 'refund-edit',
                        name: 'refund-edit',
                        meta: {
                            label: '退票列表编辑'
                        },
                        component: resolve => require(['views/refund/add-note'], resolve)
					},]
				},
				// 卡充值
                {
                    path: 'card-pay',
                    name: 'card-pay',
                    redirect: {name:"card-pay-search"},
                    meta: {
                        label: '卡充值'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'card-pay-search',
                        name: 'card-pay-search',
                        meta: {
                            label: '查询'
                        },
                        component: resolve => require(['views/card-pay/index'], resolve)
					},
					{
                        path: 'card-pay-add',
                        name: 'card-pay-add',
                        meta: {
                            label: '新增充值单'
                        },
                        component: resolve => require(['views/card-pay/detail'], resolve)
					},
					{
                        path: 'card-pay-eidt',
                        name: 'card-pay-eidt',
                        meta: {
                            label: '编辑'
                        },
                        component: resolve => require(['views/card-pay/detail'], resolve)
					},
					{
                        path: 'card-pay-detail',
                        name: 'card-pay-detail',
                        meta: {
                            label: '详情'
                        },
                        component: resolve => require(['views/card-pay/detail'], resolve)
					},]
				},
				// 促销折扣
                {
                    path: 'sale-discount',
                    name: 'sale-discount',
                    redirect: {name:"sale-discount-search"},
                    meta: {
                        label: '促销折扣权限'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'sale-discount-search',
                        name: 'sale-discount-search',
                        meta: {
                            label: '查询'
                        },
                        component: resolve => require(['views/sale-discount/index'], resolve)
					},
					{
                        path: 'sale-discount-add',
                        name: 'sale-discount-add',
                        meta: {
                            label: '添加'
                        },
                        component: resolve => require(['views/sale-discount/eidt'], resolve)
					},
					{
                        path: 'sale-discount-eidt',
                        name: 'sale-discount-eidt',
                        meta: {
                            label: '编辑'
                        },
                        component: resolve => require(['views/sale-discount/eidt'], resolve)
					},
					{
                        path: 'sale-discount-detail',
                        name: 'sale-discount-detail',
                        meta: {
                            label: '详情'
                        },
                        component: resolve => require(['views/sale-discount/eidt'], resolve)
					},]
				},
				// 非整车采购退货
                {
                    path: 'purchase-return',
                    name: 'purchase-return',
                    redirect: {name:"purchase-return-search"},
                    meta: {
                        label: '非整车采购退货'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'purchase-return-search',
                        name: 'purchase-return-search',
                        meta: {
                            label: '查询'
                        },
                        component: resolve => require(['views/purchase-return/index'], resolve)
					},
					{
                        path: 'purchase-return-add',
                        name: 'purchase-return-add',
                        meta: {
                            label: '新建采购退货单'
                        },
                        component: resolve => require(['views/purchase-return/eidt'], resolve)
					},
					{
                        path: 'purchase-return-eidt',
                        name: 'purchase-return-eidt',
                        meta: {
                            label: '编辑'
                        },
                        component: resolve => require(['views/purchase-return/eidt'], resolve)
					},
					{
                        path: 'purchase-return-detail',
                        name: 'purchase-return-detail',
                        meta: {
                            label: '详情'
                        },
                        component: resolve => require(['views/purchase-return/eidt'], resolve)
					},]
				},
				//出入库清单明细
				{
					path:'warehousing-list',
					name:'warehousing-list',
					meta:{
						label:'出入库清单明细'
					},
					component:resolve => require(['views/warehousing-list/index'],resolve)
				},
				//入库清单明细
				{
					path:'inventory-list',
					name:'inventory-list',
					meta:{
						label:'入库清单明细'
					},
					component:resolve => require(['views/inventory-list/index'],resolve)
				},
				// 服务推荐  creat by lwx
                {
                    path: 'service-recommend',
                    name: 'service-recommend',
                    redirect: {name:"service-recommend-query"},
                    meta: {
                        label: '服务推荐'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'query',
                        name: 'service-recommend-query',
                        meta: {
                            label: '查询'
                        },
                        component: resolve => require(['views/service-recommend/index'], resolve)
					},
					{
                        path: 'insert',
                        name: 'service-recommend-insert',
                        meta: {
                            label: '新增'
                        },
                        component: resolve => require(['views/service-recommend/edit'], resolve)
					},
					{
                        path: 'edit',
                        name: 'service-recommend-edit/:id',
                        meta: {
                            label: '编辑'
                        },
                        component: resolve => require(['views/service-recommend/edit'], resolve)
					},
					{
                        path: 'detail',
                        name: 'service-recommend-detail/:id',
                        meta: {
                            label: '查看'
                        },
                        component: resolve => require(['views/service-recommend/edit'], resolve)
					}]
				},
				//人车
			  	{
                    path: 'mancar',
                    name: 'mancar',
                    redirect: {name:"mancar-query"},
                    meta: {
                        label: '人车-会员车辆信息'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'add',
                        name: 'mancar-add',
                        meta: {
                            label: '新增客户'
                        },
                        component: resolve => require(['views/mancar/add'], resolve)
					},
					{
                        path: 'edit',
                        name: 'mancar-edit',
                        meta: {
                            label: '客户编辑'
                        },
                        component: resolve => require(['views/mancar/add'], resolve)
					},
					{
                        path: 'query',
                        name: 'mancar-query',
                        meta: {
                            label: '查询'
                        },
                        component: resolve => require(['views/mancar/query'], resolve)
					},
					]
				},
				{
                    path: 'purchase-order',
                    name: 'purchase-order',
                    redirect: {name:"purchase-query"},
                    meta: {
                        label: '非整车商品采购'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'purchase-add',
                        name: 'purchase-add',
                        meta: {
                            label: '采购订单新增'
                        },
                        component: resolve => require(['views/purchase-order/purchase-add'], resolve)
					},
					{
                        path: 'purchase-edit',
                        name: 'purchase-edit',
                        meta: {
                            label: '采购订单编辑'
                        },
                        component: resolve => require(['views/purchase-order/purchase-edit'], resolve)
					},
					{
                        path: 'purchase-detail',
                        name: 'purchase-detail',
                        meta: {
                            label: '采购订单详情'
                        },
                        component: resolve => require(['views/purchase-order/purchase-edit'], resolve)
					},
					{
                        path: 'purchase-query',
                        name: 'purchase-query',
                        meta: {
                            label: '查询'
                        },
                        component: resolve => require(['views/purchase-order'], resolve)
					},
					]
				},
				//非整车商品入库
				{
                    path: 'notarchives-put',
                    name: 'notarchives-put',
                    redirect: {name:"notarchives-query"},
                    meta: {
                        label: '非整车商品入库'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [
                    {
                        path: 'notarchives-query',
                        name: 'notarchives-query',
                        meta: {
                            label: '入库'
                        },
                        component: resolve => require(['views/notarchives-put/'], resolve)
					},
                    {
                        path: 'notarchives-create',
                        name: 'notarchives-create',
                        meta: {
                            label: '新建采购入库'
                        },
                        component: resolve => require(['views/notarchives-put/notarchives-detail'], resolve)
					},
					{
                        path: 'notarchives-detail',
                        name: 'notarchives-detail',
                        meta: {
                            label: '采购入库详情'
                        },
                        component: resolve => require(['views/notarchives-put/notarchives-detail'], resolve)
                    }
                    ]
				},
				// 库存调整 create by lwx
				{
					path: 'stock-adjust',
					name: 'stock-adjust',
					meta: {
						label: '库存调整'
					},
					redirect: {name: "stock-adjust-query"},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'stock-adjust-query',
							meta: {
								label: '库存调整查询'
							},
							component: resolve => require(['views/stock-adjust/index.vue'], resolve)
						},
						{
							path: 'detail',
							name: 'insert-detail',
							meta: {
								label: '库存调整明细'
							},
							component: resolve => require(['views/stock-adjust/detail.vue'], resolve)
						},
					]
				},
				//自采单对账
				{
					path: 'account-check',
					name: 'account-check',
					meta: {
						label: '自采单对账'
					},
					redirect: {name: "account-check-index"},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'index',
							name: 'account-check-index',
							meta: {
								label: '自采单对账'
							},
							component: resolve => require(['views/account-check/index.vue'], resolve)
						},
					]
				},
				//快速洗车
				{
					path: 'vehicle-cleaning',
					name: 'vehicle-cleaning',
					meta: {
						label: '快速洗车单'
					},
					redirect: {name: "vehicle-cleaning-add"},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'vehicle-cleaning-query',
							name: 'vehicle-cleaning-query',
							meta: {
								label: '快速洗车单'
							},
							component: resolve => require(['views/vehicle-cleaning/index.vue'], resolve)
						},
						{
							path: 'vehicle-cleaning-add',
							name: 'vehicle-cleaning-add',
							meta: {
								label: '新建快速洗车单'
							},
							component: resolve => require(['views/vehicle-cleaning/add.vue'], resolve)
						},
						{
							path: 'vehicle-cleaning-updata',
							name: 'vehicle-cleaning-updata',
							meta: {
								label: '编辑快速洗车单'
							},
							component: resolve => require(['views/vehicle-cleaning/updata.vue'], resolve)
						},
						{
							path: 'vehicle-cleaning-detailed',
							name: 'vehicle-cleaning-detailed',
							meta: {
								label: '查看快速洗车单'
							},
							component: resolve => require(['views/vehicle-cleaning/updata.vue'], resolve)
						},
					]
				},
				// 维修工单详情
				{
					path: 'repair-order',
					name: 'repair-order',
					meta: {
						label: '维修工单'
					},
					redirect: {name: "repair-order-detail"},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'repair-order-detail',
							name: 'repair-order-detail',
							meta: {
								label: '维修工单详情'
							},
							component: resolve => require(['views/repair-order/index.vue'], resolve)
						},
					]
				},
				// 预检
				{
					path: 'precheck',
                    name: 'precheck',
                    meta: {
                        label: '预检'
                    },
                    redirect: {name: "precheck"},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: '',
							name: 'precheck',
							meta: {
								label: '预检'
							},
							component: resolve => require(['views/precheck/index'], resolve)
						},
						{
							path: 'tyre',
							name: 'tyre',
							meta: {
								label: '轮胎信息'
							},
							component: resolve => require(['views/precheck/tyre'], resolve),
						}
					]
				},
				//工单支付列表
				{
					path: 'workOrderPay',
					name: 'workOrderPay',
					meta: {
						label: '工单支付列表'
					},
					redirect: {name: 'workOrderPayFix'},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'workOrderPay',
							name: 'workOrderPayFix',
							meta: {
								label: '工单查询'
							},
							component: resolve => require(['views/check-fix-list/index.vue'], resolve)
						},
						{
							path: 'workOrderPayDetail',
							name: 'workOrderPayDetail',
							meta: {
								label: '工单支付明细'
							},
							component: resolve => require(['views/work-order-pay/detail.vue'], resolve)
						}
					]
				},
				//工单开票列表
				{
					path: 'workOrderInvoice',
					name: 'workOrderInvoice',
					meta: {
						label: '工单开票列表'
					},
					redirect: {name: 'workOrderInvoiceFix'},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'workOrderInvoice',
							name: 'workOrderInvoiceFix',
							meta: {
								label: '工单查询'
							},
							component: resolve => require(['views/check-fix-list/index.vue'], resolve)
						},
						{
							path: 'workOrderInvoiceDetail',
							name: 'workOrderInvoiceDetail',
							meta: {
								label: '工单开票明细'
							},
							component: resolve => require(['views/work-order-invoice/detail.vue'], resolve)
						}
					]
				},
				// 结算
				{
					path: 'checkout-counter',
					name: 'checkout-counter',
					meta: {
						label: '订单结算'
					},
					redirect: {name: 'checkout-counter-query'},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'checkout-counter-query',
							name: 'checkout-counter-query',
							meta: {
								label: '订单结算查询列表'
							},
							component: resolve => require(['views/checkout-counter/index.vue'], resolve)
						},
						{
							path: 'checkout-counter-detail',
							name: 'checkout-counter-detail',
							meta: {
								label: '订单结算详情'
							},
							component: resolve => require(['views/checkout-counter/index.vue'], resolve)
						}
					]
				},
				// 领料
				{
					path: 'store-requisition',
					name: 'store-requisition',
					meta: {
						label: '订单领料查询'
					},
					redirect: {name: 'store-requisition-queryFix'},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'store-requisition-queryFix',
							meta: {
								label: '工单查询'
							},
							component: resolve => require(['views/check-fix-list'], resolve)
						},
                        {
							path: 'edit/:orderNo',
							name: 'store-requisition-edit',
							meta: {
								label: '订单领料明细'
							},
							component: resolve => require(['views/store-requisition/edit'], resolve)
						},
					]
				},
				// 维修工单查询
				{
					path: 'check-fix-list',
					name: 'check-fix-list',
					meta: {
						label: '维修工单'
					},
					redirect: {name: 'check-fix-list-query'},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'query',
							name: 'check-fix-list-query',
							meta: {
								label: '工单查询'
							},
							component: resolve => require(['views/check-fix-list'], resolve)
						},
						{
							path: 'precheck-fix',
							name: 'precheck-fix',
							meta: {
								label: '预检单查询'
							},
							component: resolve => require(['views/check-fix-list'], resolve)
						}
					]
				},
				// 预检单查询
				{
					path: 'precheck-fix',
					name: 'precheck-fix',
					meta: {
						label: '预检单查询'
					},
					redirect: {name: 'precheck-fix-query'},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'precheck-fix-query',
							name: 'precheck-fix-query',
							meta: {
								label: '工单查询'
							},
							component: resolve => require(['views/check-fix-list'], resolve)
						}
					]
				},
				// 预约单新建
				{
					path: 'appointment-new',
					name: 'appointment-new',
					meta: {
						label: '预约单'
					},
					redirect: {name: 'appointment-search'},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'appointment-search',
							name: 'appointment-search',
							meta: {
								label: '查询'
							},
							component: resolve => require(['views/appointment'], resolve)
						},
						{
							path: 'appointment-edit',
							name: 'appointment-edit',
							meta: {
								label: '预约单操作'
							},
							component: resolve => require(['views/appointment/edit'], resolve)
						}
					]
				},
				// 预约推荐服务配置
				{
					path: 'store-appointment-service',
					name: 'store-appointment-service',
					meta: {
						label: '预约推荐服务配置'
					},
					redirect: {name: 'store-appointment-service-query'},
					component: {
						render(c) {
							return c('router-view')
						}
					},
					children: [
						{
							path: 'store-appointment-service-query',
							name: 'store-appointment-service-query',
							meta: {
								label: '查询'
							},
							component: resolve => require(['views/store-appointment-service'], resolve)
						},
					]
				},
				// 卷销售  creat by lwx, bj
                {
                    path: 'coupons-sale-order',
                    name: 'coupons-sale-order',
                    redirect: {name:"coupons-sale-order-query"},
                    meta: {
                        label: '券销售单'
                    },
                    component: {
                        render(c) {
                            return c('router-view')
                        }
                    },
                    children: [{
                        path: 'query',
                        name: 'coupons-sale-order-query',
                        meta: {
                            label: '券销售单查询'
                        },
                        component: resolve => require(['views/coupons-sale/coupons-sale-order/coupons-sale-order'], resolve)
					},
					{
                        path: 'insert',
                        name: 'coupons-sale-insert',
                        meta: {
                            label: '新增'
                        },
                        component: resolve => require(['views/coupons-sale/edit/edit'], resolve)
					},
					{
                        path: 'edit',
                        name: 'coupons-sale-edit',
                        meta: {
                            label: '编辑'
                        },
                        component: resolve => require(['views/coupons-sale/edit/edit'], resolve)
					},
					{
                        path: 'detail',
                        name: 'coupons-sale-detail',
                        meta: {
                            label: '详情'
                        },
                        component: resolve => require(['views/coupons-sale/edit/edit'], resolve)
					},
					{
						path: 'select',
                        name: 'select-coupons',
                        meta: {
                            label: '详情'
                        },
                        component: resolve => require(['views/coupons-sale/coupons-sale-order/select-coupons'], resolve)
					}]
				},
	        ]
		},
		// 404 页面
	    {
	        path: '/*',
	        name: 'notfile',
	        meta: {
	            label: '报错页面'
	        },
	        component: resolve => require(['views/error/index.vue'], resolve)
	    },
	]
})
// 配置基础模块连接 当连接为 html的时候  页面进行跳转
// router.beforeEach((to, from, next) => {
//     if (to.fullPath.match(/^(.*\.html)$/)) {
//         window.location.href = window.location.origin + to.fullPath;
//         return;
// 	}
//     next();
// }) 
export default router
