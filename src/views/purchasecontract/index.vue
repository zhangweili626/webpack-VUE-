<template>
    <div>
        <b-card header="查询">
			<div class="row">		
				 <b-col md="6">
					<b-form-fieldset horizontal label="合同编码" :label-cols="4" class="text-right">
						<b-form-input v-model="searchModel.contractNo"/>
					</b-form-fieldset>
				</b-col>						
				<b-col md="6">
					<b-form-fieldset horizontal label="合同名称" :label-cols="4" class="text-right">
						<b-form-input v-model="searchModel.contractName"/>
					</b-form-fieldset>
				</b-col>     
				<b-col md="6">
					<b-form-fieldset horizontal label="供应商类型" :label-cols="4" class="text-right">
						 <b-form-select :options="supplierTypeList" v-model="searchModel.supplierType"></b-form-select>
					</b-form-fieldset>
				</b-col>          
				<b-col md="6">
					<b-form-fieldset horizontal label="供应商名称" :label-cols="4" class="text-right">
						<b-form-input v-model="searchModel.supplierName"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="合同有效期" :label-cols="4" class="text-right">
						<el-date-picker
							v-model="searchModel.date"
							type="daterange"
							:clearable="true"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期">
						</el-date-picker>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="审批状态" :label-cols="4" class="text-right">
						  <b-form-select :options="approStatus" v-model="searchModel.wfStatus"></b-form-select>
					</b-form-fieldset>
				</b-col>
			</div>
			<b-row>
				<div class="col-md-12 text-right">
					<b-button size="sm" variant="default" @click="reset()">重置</b-button>
					<b-button size="sm" variant="primary" @click="puContractSearch()">查询</b-button>
				</div>
			</b-row>
		</b-card>
        <b-card>
			<b-row class="mb-0">
				<div class="pull-left ml-3 mb-1">
                    <b-button size="sm" variant="success"  @click="createContract" v-if="creatPurchContract">新建</b-button>
					<b-button size="sm" variant="primary" @click="eidtContract" v-if="eidtPurchContract">编辑</b-button>
				</div>
			</b-row>
			<div class="table-scrollable">
				<b-table striped hover bordered show-empty :items="purchContractlist" :fields="fields">
					<template slot="sel" slot-scope="data">
						<input type="radio" name="radio"  v-model="selCont" :value="data.item" :disabled="!eidtPurchContract"/> 
					</template>
					<template slot="contractNo" slot-scope="data">
						<a href="javascript:;" @click.prevent="detailContract(data.value)">{{ data.value }}</a>						
					</template>
					<template slot="contractName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="supplierName" slot-scope="data">
						{{ data.value}}
					</template>		
					<template slot="beginDateStr" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="endDateStr" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="settlementTypeName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="externalCode" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="fileNums" slot-scope="data">						
						<a  href="###" @click="getAccessory(data.item.contractNo)" variant="outline-primary">{{ data.value}}</a>
					</template>
                    <template slot="confirmOperatorName" slot-scope="data">
						{{ data.value}}
					</template>
                    <template slot="confirmOperatorTime" slot-scope="data">
						{{ data.value}}
					</template>
                    <template slot="auditPassOperatorName" slot-scope="data">
						{{ data.value}}
					</template>
                    <template slot="auditPassTime" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="wfStatus" slot-scope="data">
						{{data.value | approStatus}}						
					</template>
					<template slot="empty">
						暂无数据...
					</template>
				</b-table>
				<b-modal id="modal-center" centered title="附件" hide-footer ref='accessory'>
					<b-row v-for='item in uploadList' :key='item.id' class="text-right mt-3"  >
						<b-col  md="2"></b-col>	
						<b-col  md="8" class="text-left">
							<i class="el-icon-document"></i>
							<a href="###" @click="preview(item)" class="preview-name" :title="item.name">{{item.name}}</a>
							<a :href="getDownloadUrl(urlApi,item.filePath)" download>
								<b-button size="sm" variant="primary" class="p-1 ml-2">下载</b-button>
							</a>
							
						</b-col>
					</b-row>
				</b-modal>
			</div>
			<v-pagination @page-change="puContractSearch" :total-result="pages.total"
						  :page-no='pages.pageNo' :total-pages="pages.totalPages"
						  :page-size="paginationData.pageSize"></v-pagination>
		</b-card>
    </div>
</template>
<script>
    import Vue from 'vue'
	import {DatePicker, Message} from 'element-ui'
	import {mapState, mapMutations, mapActions} from 'vuex'
	import vPagination from 'components/pagination/pagination.vue'
	import areaqueryshop from 'components/iris-areaqueryshop/'
	import api from 'common/api'
	import config from 'common/config.js'
	import common from 'common/common.js'
	import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'
	import filters from 'common/filters.js'
    
    Vue.use(DatePicker)
    export default {
        components: {
			vPagination,
			areaqueryshop
		},
		data() {
			return {
				paginationData: {
					total: 0,
					totalPages: 1,
					pageNo: 1,
					pageSize: config.pageNums
				},
				supplierTypeList: [],
				approStatus:config.purchaseContract.approStatus,
				entreList: [],
				searchModel: {
					supplierType: '',
					supplierName: '',
					contractNo: '',
					contractName: '',
					date: [],
					wfStatus: '',
				},
				selCont:'',
                fields: {
					sel: {
						label: "选择"
					},
					contractNo: {
						label: "合同编号"
					},
					contractName: {
						label: "合同名称"
					},
					supplierName: {
						label: "供应商名称"
					},				
					beginDateStr: {
						label: "生效日期"
					},
					endDateStr: {
						label: "失效日期"
					},
					settlementTypeName: {
						label: "结算方式"
					},
					externalCode: {
						label: "外部编码"
					},
					fileNums: {
						label: "附件"
					},
					confirmOperatorName: {
						label: "最近提交人"
                    },
                    confirmOperatorTime: {
						label: "最近提交时间"
                    },
                    auditPassOperatorName: {
						label: "审批通过人"
                    },
                    auditPassTime: {
						label: "审批通过时间"
                    },
                    wfStatus: {
						label: "审批状态"
                    }
				},
				list:[],
				uploadList:[]
            }
		},
		computed: {
			...mapState('purchasecontract',[
				'purchContractlist',
				'searchParam',
				'pages'
			]),
			creatPurchContract(){
				return hasBtn(collectionApi.purchaseContract.addPurchase);
			},
			eidtPurchContract(){
				return hasBtn(collectionApi.purchaseContract.eidtDetail);
			},
			urlApi() {
				return common.getUploadUrl();
			}
		},
		created(){
			this.getSupplierType();
		},
		methods: {
			...mapActions('purchasecontract',[
				'setTableList',
				'setSearchParam',
				'setPages',
				'getPurchContractTabList'
			]),
			getSupplierType() {
				let params = {
					refCode: config.supplier.refSupplierType
				}
				api.ref.getDataDictionarys(params, (res) => {
					if (res.data.code === 'success') {
						let data = res.data.obj.referenceDetailInfos;
						let arr = [];
						if(data != null) {
							data.forEach((item, index) => {
								let obj = {
									text: item.refDetailName,
									value: item.refDetailCode
								}
								arr.push(obj)
							})
							this.supplierTypeList = arr;
						}						
					}
				})
			},
			reset() {
				this.searchModel.supplierType = '';
				this.searchModel.supplierName = '';
				this.searchModel.contractNo = '';
				this.searchModel.contractName = '';
				this.searchModel.date = [];
				this.searchModel.wfStatus = '';
				this.paginationData.pageNo = 0;
				this.setTableList([]);
				this.paginationData.total = 0;
				this.paginationData.totalPages = 0;
			},
			puContractSearch(pageNo) {
				let _this = this;
				 pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
				let param = {
					supplierType: this.searchModel.supplierType,
					supplierName: this.searchModel.supplierName,
					contractNo: this.searchModel.contractNo,
					contractName: this.searchModel.contractName,
					beginDate : common.eleTimeFormat(this.searchModel.date[0]) == '1970-01-01' ? '':common.eleTimeFormat(this.searchModel.date[0]),
					endDate  : common.eleTimeFormat(this.searchModel.date[1]) == '1970-01-01' ? '':common.eleTimeFormat(this.searchModel.date[1]),
					wfStatus: this.searchModel.wfStatus,
					pageNums: this.paginationData.pageSize,
					pageStart: this.paginationData.pageNo
				};
				_this.getPurchContractTabList(param)
				// _this.setSearchParam(param);
				// api.purchaseContract.search(param, function (result) {
				// 	let data = result.data;
				// 	if(data.code === 'success') {
				// 		_this.paginationData.total = data.obj.total;
				// 		_this.paginationData.totalPages = data.obj.pages;
				// 		_this.list = data.obj.list;
				// 		_this.setTableList(data.obj.list);
				// 		_this.setPages({
                //             pageNo: _this.paginationData.pageNo,
                //             total:  data.obj.total,
                //             totalPages: data.obj.pages
                //         });
				// 	}
					
				// })
			},
			eidtContract() {			
				if (!this.selCont.contractNo) {
					Message({
						message: '未选择采购合同！',
						type: 'warning'
					});
				} else {
					this.$router.push({name: 'purchasecontractEidt', query: {contractNo: this.selCont.contractNo, onlySee: false}})
				}
			},
			detailContract(val) {
				if(val) {
					this.$router.push({name: 'purchasecontractDelital', query: {contractNo: val, onlySee: true}});
					return;
				}
			},
			createContract() {
				this.$router.push({path: '/purchaseContract/add'});
			},
			// 附件查询
			getAccessory(val) {
				let _this = this;
				let param = {
					relationCode: val
				}				
				api.accessory.list(param, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						_this.uploadList = data.obj;
						if(_this.uploadList.length > 0){
							for(let i = 0; i <_this.uploadList.length; i++){
								_this.uploadList[i].name = _this.uploadList[i].fileOrgName;
							}
							_this.$refs.accessory.show();
						}else{
							Message('该合同无附件!');
						}
						
						
					}
				})
			},
			// 附件预览
			preview(val) {
				api.accessory.pvw(val, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						if(data.obj) {
							window.open(common.getUploadUrl() + data.obj);
						}else {
							Message('该附件不支持预览!');
						}
						
					}
				})
			},
			// 附件下载
			download(val) {
				console.log(val)
				api.accessory.download(val, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						if(data.obj) {
							//window.open(common.getUploadUrl() + data.obj);
						}else {
							Message('该附件不支持下载!');
						}
						
					}
				})
			},
			// 附件下载地址
			getDownloadUrl(a,b) {
				return b;
			}
		},
		
    }
</script>
<style scoped>
.wd100{
	width: 100px;
}
.preview-name{
	display: inline-block;
	width: 200px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
