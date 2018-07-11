<template>
	<div>
		<b-card header="供应商基础信息">
			<div class="row">
				<b-col md="6">
					<b-form-fieldset horizontal label="供应商编码" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.supplierCode" :readonly="true"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="供应商名称" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.supplierName" :readonly="!startedit" :state="checkout.supplierName"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="联系人" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.contactName" :readonly="!startedit"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="联系电话" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.contactMobile" :readonly="!startedit"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="公司电话" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.compPhone" :readonly="!startedit"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="公司传真" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.contactFax" :readonly="!startedit"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="邓白氏编码" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.dbEncoding" :readonly="!startedit" />
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="外部编码" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.externalCode" :readonly="!startedit"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="性别" label-text-align="right" :label-cols="4">
                        <b-form-select :options="contactSexOption" v-model="edit.contactSex" :disabled="!startedit"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="供应商类型" label-text-align="right" :label-cols="4">
                        <div class="row supplier-warp">
							<div class="col-md-7">
								<b-form-select 
									:options="supplierTypeList" 
									v-model="edit.supplierType" 
									:disabled="!startedit || canEdit"
									:state="checkout.supplierType"
									></b-form-select>
							</div>
							<div class="col-md-5">
								<b-form-select 
									:options="contractSupplierFlagOption"  
									v-model="edit.contractSupplierFlag" 
									:disabled=" !startedit || flagStatus || canEdit"
									:state="checkout.contractSupplierFlag"
									></b-form-select>
							</div>
						</div>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="供货类型" label-text-align="right" :label-cols="4">
                        <b-form-select :options="supplyTypeOption"  
						v-model="edit.supplyType"  
						:disabled="!startedit" :state="checkout.supplyType" />
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="邮编" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder=""  v-model="edit.postCode"  :readonly="!startedit"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="供应商简介" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.supplierDesc"  :readonly="!startedit"/>
                    </b-form-fieldset>
				</b-col>
			</div>
			<div>
				<b-button v-if="!startedit" size="sm" variant="success" class="pull-right" @click="startedit=true">编辑</b-button>
				<b-button v-if="startedit" size="sm" variant="info" class="pull-right" @click="updataSupplier">保存</b-button>
			</div>
		</b-card>
		<v-editinvoice ref="editinvoice" @showModal="showModal" @showAddModal="showAddInvoiceModal"></v-editinvoice>
		<v-contract></v-contract>
		<b-card header="适用范围信息">
			<v-suitscope :supplierCode="supplierCode"></v-suitscope>
		</b-card>
		<v-invoicemodal ref="invoiceModal" @clearRadio="clearRadio"></v-invoicemodal>
		<v-addinvoicemodal ref="addInvoiceModal"></v-addinvoicemodal>		
	</div>
</template>
<script>
	import Vue from 'vue'
	import {mapState, mapMutations, mapActions} from 'vuex'
	import {DatePicker, MessageBox, Message} from 'element-ui'
	import api from 'common/api'
	import config from 'common/config'
	import vPagination from 'components/pagination/pagination.vue'
	import areaqueryshop from 'components/iris-areaqueryshop/'
	import VContract from './contract-list'
	import VEditinvoice from './editInvoice'
	import VInvoicemodal from './invoiceModal'
	import VAddinvoicemodal from './addInvoiceModal'
	import VSuitscope from './suitscope'
	Vue.use(DatePicker)
	export default {
		components: {
			vPagination,
			areaqueryshop,
			VContract,
			VEditinvoice,
			VInvoicemodal,
			VAddinvoicemodal,
			VSuitscope
		},
		data() {
			return {
				contactSexOption: config.supplier.contactSex,
				contractSupplierFlagOption: config.supplier.contractSupplierFlags,
				supplyTypeOption: config.supplier.supplyType,
				startedit: false,
				flagStatus: false,
				canEdit: false,
				// editItemInfo: {},
				edit: {
					id: '',
					supplierCode: '',
					supplierName: '',
					dbEncoding: '',
					externalCode: '',
					contactName: '',
					contactSex: '',
					contactMobile: '',
					supplierType: '',
					supplyType: '',
					contractSupplierFlag: '',
					purchasingAreaCode: '',
					postCode: '',
					supplierDesc: '',
				},
				entreList: {},
				searchModel: {
					inventoryNo: '',
					inventoryName: '',
					inventoryPlanName: '',
					inventoryDate: '',
					areaCode: [],
					storeCode: '',
					whCode: '',
					pageNums: '',
					pageStart: ''
				},
				tHead: ['选择', '发票类型', '发票名称', '税率', '发票抬头', '公司地址', '公司电话', '邮编', '账号', '税号', '开户行', '开户行地址'],
				invoiceList: [],
				checkout: {
					supplierName: null,
					supplyType: null,
					supplierType: null,
					contractSupplierFlag: null,
					contactSex: null,
				}
			};
		},
		computed: {
			...mapState('supplier', [
				'supplierTypeList',
				'supplierInfo',
				'contractList'
			]),
			_supplier: function() {
				return this.edit.supplierType
			},
			supplierCode() {
				return this.$route.params.id
			}

		},
		watch: {
			_supplier: function(newVal, oldVal) {
				if(newVal === config.supplier.supplierTypeDialCode.yes) {
					this.flagStatus = true;
					this.edit.contractSupplierFlag = '1'
				} else if(newVal === config.supplier.supplierTypeDialCode.no) {
					this.flagStatus = false;
					if (this.startedit) {
						this.edit.contractSupplierFlag = ''
					}
				} else if (newVal === config.supplier.supplierTypeDialCode.epiboly) {
					this.flagStatus = false;
					if (this.startedit) {
						this.edit.contractSupplierFlag = ''
					}
				} else if (newVal === config.supplier.supplierTypeDialCode.temporary) {
					this.flagStatus = true;
					this.edit.contractSupplierFlag = '0'
				}
			}
		},
		created() {
			this.setSupplierType()
			this.setEditInfo()
		},
		methods: {
			...mapActions('supplier', [
				'getSupplierType',
				'updataSupplierInfo',
				'getSupplierInfo',
			]),
			clearRadio: function(val) {
				this.$refs.editinvoice.clearRadio(val)
			},
			showModal: function(item) {
				// this.editItemInfo = item
				this.$refs.invoiceModal.show()
				this.$refs.invoiceModal.setEditInfo(item)
			},
			showAddInvoiceModal: function(code, num) {
				this.$refs.addInvoiceModal.show(code, num)
			},
			setEditInfo:function() {
				this.getSupplierInfo(
					{
						poros: {supplierCode: this.$route.params.id},
						callBack: res => {
							if(res === 'basis') {
								for (let item in this.supplierInfo) {
									this.edit[item] = this.supplierInfo[item]
									if(this.supplierInfo.isPurchaseContractEdit == '1') {
										this.canEdit = false
									}else {
										this.canEdit = true
									}
								}
							} else if (res === 'contract') {
								
							}
						},
					}
				)
				
			},
			//获取供应商类型
			setSupplierType: function() {
				let params = {
					refCode: config.supplier.refSupplierType
				}
				this.getSupplierType(params)
			},
			//编辑供应商
			updataSupplier: function () {
				const $this = this
				let judge;
				let required = {
					supplierName: this.edit.supplierName,
					supplyType: this.edit.supplyType,
					supplierType: this.edit.supplierType,
					supplierType: this.edit.supplierType,
					contractSupplierFlag: this.edit.contractSupplierFlag
				}
				for(let i in required) {
					if (required[i] == '') {
						judge = true
					}
				}
				if(judge) {
					for(let i in required) {
						if (required[i]) {
							$this.checkout[i] = null;
						} else {
							$this.checkout[i] = false;
						}
					}
					Message({
                        type: 'warning',
                        message: config.messInfo.supplierInfo
					});
				} else {
					this.updataSupplierInfo({
						props:this.edit,
						callBack: res => {
							Message({
								type: 'info',
								message: config.messInfo.success
							});
							for(let i in $this.checkout) {
								$this.checkout[i] = null;
							}
							this.startedit = !this.startedit
						}
					})
				}
			},
			addInvoice: function () {
				let obj = {};
				obj.invoiceType = '';
				obj.invoiceName = '';
				obj.taxRate = '';
				obj.invoiceTitle = '';
				obj.companyAddress = '';
				obj.companyPhoneNumber = '';
				// obj.companyPhoneNumber = '';   邮编
				obj.bankAccount = '';
				obj.taxRegistrationNumber = '';
				obj.bankName = '';
				// obj.bankName = '';   开户行地址
				this.invoiceList.push(obj)
			},
			blitemSearch(pageNo) {
				pageNo ? this.searchModel.pageStart = pageNo : this.searchModel.pageStart = 1;
				let param = {
					inventoryNo: this.searchModel.inventoryNo,
					inventoryName: this.searchModel.inventoryName,
					inventoryPlanName: this.searchModel.inventoryPlanName,
					inventoryDate: this.searchModel.date,
					areaCode: this.searchModel.areaCode,
					storeCodes: this.searchModel.storeCode,
					whCode: this.searchModel.whCode,
					pageNums: this.searchModel.pageNums,
					pageStart: this.searchModel.pageStart,
				}
				api.blitem.getBlitemSearch(param, function (data) {
					console.log(data)
				})
			}
		}
	};
</script>

<style>
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
	.table-scrollable tr td {
        /* max-width: 150px !important;
        min-width: 150px !important; */
    }
	.ofh {
		overflow: hidden;
	}
	.contract {
		overflow: hidden;
		position: absolute;
		z-index: 10;
	}
    /* .table-scrollable tr td:nth-child(2) {
        max-width: 80px !important;
        min-width: 80px !important;
    } */
</style>
