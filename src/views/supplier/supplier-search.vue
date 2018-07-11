<template>
	<div>
		<b-card header="查询">
			<!-- <div slot="header">
				<strong>查询</strong>
			</div> -->
			<div class="row">
				<b-col md="6">
					<b-form-fieldset horizontal label="供应商编码" :label-cols="4" class="text-right">
						<input type="text" class="form-control" v-model="searchModel.supplierCode" @keyup.enter="query(1)"/>
						<!-- <b-form-input v-model="searchModel.supplierCode" @click="query(1)"/> -->
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="供应商名称" :label-cols="4" class="text-right">
						<input type="text" class="form-control" v-model="searchModel.supplierName" @keyup.enter="query(1)"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="邓白氏编码" :label-cols="4" class="text-right">
						<input type="text" class="form-control" v-model="searchModel.dbEncoding" @keyup.enter="query(1)"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="供应商类型" :label-cols="4" class="text-right">
						<b-form-select :options="supplierTypeList" v-model="searchModel.supplierType"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="区域门店" :label-cols="4" class="text-right">
						<areaqueryshop ref="areaqueryshop" :storeAll="true" @select-change="selectedfun"></areaqueryshop>
					</b-form-fieldset>
				</b-col>
			</div>
			<b-row></b-row>
				<div class="col-md-12 text-right">
					<b-button size="sm" variant="default" @click="clear">重置</b-button>
					<b-button size="sm" variant="primary" @click="query(1)">查询</b-button>
				</div>
			</b-row>
		</b-card>
		<b-card>
			<div>
				<b-button size="sm" variant="success" @click="addRouterTo">新增</b-button>
			</div>
			<div class="table-scrollable pt-1 suplier-table-special-style" id="suplier-table-special-id">
				<b-table striped hover bordered show-empty :items="supplierList" :fields="fields">
					 <template slot="index" slot-scope="data">
                        {{ data.index + (pager.pageNo - 1)* pager.pageSize + 1  }}</a>
                    </template>
					<template slot="supplierCode" slot-scope="data">
						<a href="javascript:;" @click="routerTo(data.item.supplierCode)">{{data.item.supplierCode}}</a>
					</template>
					<template slot="areaNames" slot-scope="data">
						<el-tooltip class="item" effect="dark" :content="data.item.areaNames" placement="top">
							<!-- {{ data.item.areaNames | namefilter }} -->
							<el-button type="text">{{ data.item.areaNames | namefilter }}</el-button>
						</el-tooltip>
					</template>
					<template slot="storeNames" slot-scope="data">
						<el-tooltip class="item" effect="dark" :content="data.item.storeNames" placement="top">
							<!-- {{ data.item.storeNames | namefilter }} -->
							<el-button type="text">{{ data.item.storeNames | namefilter }}</el-button>
						</el-tooltip>
					</template>
					<template slot="contractSupplierFlag" slot-scope="data">
						{{data.item.contractSupplierFlag=="0"?'否':'是'}}
					</template>
					<template slot="empty">
						暂无数据...
					</template>
				</b-table>
			</div>
			<v-pagination @page-change="pageChange"
                        :page-no="pager.pageNo"
                        :page-size="pager.pageSize"
                        :total-result="pager.total"
                        :total-pages="pager.totalPages">
			</v-pagination>
		</b-card>
	</div>
</template>

<script>
	import Vue from 'vue'
	import {mapState, mapMutations, mapActions} from 'vuex'
	import {DatePicker, Tooltip, Button} from 'element-ui'
	import vPagination from 'components/pagination/pagination.vue'
	import areaqueryshop from 'components/iris-areaqueryshop/'
	import api from 'common/api'
	import config from 'common/config'
	Vue.use(Tooltip)
	Vue.use(DatePicker)
	Vue.use(Button)
	export default {
		components: {
			vPagination,
			areaqueryshop
		},
		data() {
			return {
				entreList: {},
				searchModel: {
					areaCode: [],
					storeCode: '',
					storeCodes: [],
					supplierCode: '',
					supplierName: '',
					dbEncoding: '',
					supplierType: '',
					pageNums: config.pageNums,
                    pageStart: 1
				},
				selBlit: {},
				fields: {
					index: {
						label: "序号"
					},
					supplierCode: {
						label: "供应商编码"
					},
					supplierName: {
						label: "供应商名称"
					},
					supplierTypeName: {
						label: "供应商类型"
					},
					dbEncoding: {
						label: "邓白氏编码"
					},
					supplierDesc: {
						label: "供应商简介"
					},
					areaNames: {
						label: '区域'
					},
					storeNames: {
						label: '门店'
					},
					contractSupplierFlag: {
						label: "合同供应商"
					},
					purchaseContractCount: {
						label: "合同数"
					},
					
					// f: {
					// 	label: "采购合同"
					// },
					contactName: {
						label: "联系人"
					},
					contactMobile: {
						label: "联系电话"
					}
				},
			};
		},
		computed: {
			...mapState('supplier', [
				'pager',
				'supplierTypeList',
				'supplierList'
			])
		},
		created() {
			this.setSupplierType()
		},
		methods: {
			...mapActions('supplier', [
				'getSupplierType',
				'querySupplierList',
				'getSupplierInvoiceInfo',
				'getSupplierInfo',
			]),
			clear: function() {
					this.searchModel.supplierCode = ''
					this.searchModel.supplierName = ''
					this.searchModel.dbEncoding = ''
					this.searchModel.supplierType = ''
					this.searchModel.storeCode = ''
					this.searchModel.storeCodes = []
					this.$refs.areaqueryshop.resetToStart()
			},
			addRouterTo: function() {
				this.$router.push({
					path: `supplierAdd`
				})
			},
			routerTo: function(code) {
				this.getSupplierInfo(
					{
						poros: {supplierCode: code},
						callBack: res => {
							this.$router.push({
								path: `/supplier/supplierDetail/${code}`
							})
						},
					}
				)
			},
			//门店相关操作
			selectedfun(val1, val2) {
				console.log(val1, val2)
				if(Array.isArray(val2)) {
					this.searchModel.storeCode = ''
					this.searchModel.storeCodes = []
					val2.forEach(element => {
						this.searchModel.storeCodes.push(element.value)
					})
				}else {
					this.searchModel.storeCodes = []
					this.searchModel.storeCode = val2.value
				}
			},
			//获取供应商类型
			setSupplierType: function() {
				let params = {
					refCode: config.supplier.refSupplierType
				}
				this.getSupplierType(params)
			},
			//查询供应商列表
			query: function(page) {
				this.searchModel.pageStart = page
				console.log(this.searchModel)
				this.querySupplierList(this.searchModel)
			},
			pageChange: function(page) {
				// this.searchModel.pageStart = page
				this.query(page)
			},
			blitemSearch(pageNo) {
				pageNo ? this.searchModel.pageStart = pageNo : this.searchModel.pageStart = 1;
				let param = {
					inventoryNo: this.searchModel.inventoryNo,
					inventoryName: this.searchModel.inventoryName,
					inventoryPlanName: this.searchModel.inventoryPlanName,
					inventoryDate: this.searchModel.date,
					areaCode: this.searchModel.areaCode,
					storeCodes: this.searchModel.storeCodes,
					storeCode: this.searchModel.storeCode,
					whCode: this.searchModel.whCode,
					pageNums: this.searchModel.pageNums,
					pageStart: this.searchModel.pageStart,
				}
				api.blitem.getBlitemSearch(param, function (data) {
					console.log(data)
				})
			}
		},
		filters: {
			namefilter: function(val) {
				if(!val) {
					return
				}else {
					if(val.length > 6) {
						return val.substring(0, 6) + '...'
					}else {
						return val
					}
				}
			}
		}
	};
</script>

<style>
	#suplier-table-special-id table tr td button {
		color: #151b1e !important;
		border: none !important;
	}
	#suplier-table-special-id table tr td button:hover {
		border-color: transparent !important;
		/* border-color: black !important; */
	}
	#suplier-table-special-id table tr td .el-button:focus {
		border-color: transparent !important;
		outline: none !important;
		/* border-color: black !important; */
	}
	#suplier-table-special-id table tr td button:active {
		border-color: transparent !important;
		/* border-color: black !important; */
	}
	#suplier-table-special-id table tr td button:visited {
		/* border-color: transparent !important; */
		border-color: black !important;
	}
	.el-input .el-input__inner {
		border-radius: 0 !important;
	}

	.el-input.is-disabled .el-input__inner {
		background-color: #c2cfd6 !important;
		border-radius: 0 !important;
	}

	.el-input__icon {
		color: #536c79 !important;
	}

	.el-input {
		width: 100% !important;
	}
</style>
