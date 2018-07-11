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
                        <b-form-input placeholder="" v-model="edit.supplierName" :readonly="createdLock" :state="checkout.supplierName" />
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="联系人" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.contactName" :readonly="createdLock"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="联系电话" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.contactMobile" :readonly="createdLock"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="公司电话" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.compPhone" :readonly="createdLock"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="公司传真" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.contactFax" :readonly="createdLock"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="邓白氏编码" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.dbEncoding" :readonly="createdLock" />
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="外部编码" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.externalCode" :readonly="createdLock"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="性别" label-text-align="right" :label-cols="4">
                        <b-form-select :options="contactSexOption" v-model="edit.contactSex" :disabled="createdLock" :state="checkout.contactSex"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="供应商类型" label-text-align="right" :label-cols="4">
                        <div class="row supplier-warp">
							<div class="col-md-7">
								<b-form-select 
									:options="supplierTypeList" 
									v-model="edit.supplierType" 
									:disabled="createdLock" 
									:state="checkout.supplierType">
								</b-form-select>
							</div>
							<div class="col-md-5">
								<b-form-select 
									:options="contractSupplierFlagOption"  
									v-model="edit.contractSupplierFlag" 
									:disabled="flagStatus || createdLock"
									:state="checkout.contractSupplierFlag">
								</b-form-select>
							</div>
						</div>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="供货类型" label-text-align="right" :label-cols="4">
                        <b-form-select 
							:options="supplyTypeOption"  
							v-model="edit.supplyType" 
							:disabled="createdLock" 
							:state="checkout.supplyType"/>
                    </b-form-fieldset>
				</b-col>
                <!-- <b-col md="6">
					<b-form-fieldset horizontal label="采购区域" label-text-align="right" :label-cols="4">
                        <treepicker :load="loadPurchaseData" @ok-click="setdata":clearButton="true" placeholder="选择采购区域"></treepicker>
                    </b-form-fieldset>
				</b-col> -->
				<b-col md="6">
					<b-form-fieldset horizontal label="邮编" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder=""  v-model="edit.postCode" :readonly="createdLock"/>
                    </b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="供应商简介" label-text-align="right" :label-cols="4">
                        <b-form-input placeholder="" v-model="edit.supplierDesc" :readonly="createdLock"/>
                    </b-form-fieldset>
				</b-col>
			</div>
			<div v-if="!createdLock">
				<b-button size="sm" variant="info" class="pull-right" @click="addSupplier">保存</b-button>
			</div>
		</b-card>
		<b-card header="供应商附加信息" v-if="showAddition">
			<div>
                <b-tabs pills>
                    <b-tab title="供应商发票信息" active="">
                        <v-invoice :supplierCode="addSupplierCode"></v-invoice>
                    </b-tab>
                    <b-tab title="供应商适用范围">
                        <v-suitscope :supplierCode="addSupplierCode"></v-suitscope>
                    </b-tab>
                </b-tabs>
            </div>
		</b-card>
	</div>
</template>

<script>
	import Vue from 'vue'
	import {mapState, mapMutations, mapActions} from 'vuex'
	import { MessageBox, Message } from 'element-ui'

    import api from 'common/api'
	import config from 'common/config'
	import {DatePicker} from 'element-ui'
	import vPagination from 'components/pagination/pagination.vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import treepicker from 'components/treepicker/treepicker'
    import VSuitscope from './suitscope'
    import VInvoice from './supplierinvoice'
	
	Vue.use(DatePicker)
	export default {
		components: {
			vPagination,
            areaqueryshop,
            treepicker,
            VSuitscope,
            VInvoice
		},
		data() {
			return {
				createdLock: false,
				contractSupplierFlagOption: config.supplier.contractSupplierFlags,
				supplyTypeOption: config.supplier.supplyType,
                contactSexOption: config.supplier.contactSex,
				showAddition: false,
				flagStatus: false,
                addSupplierCode: '',
				edit: {
					compPhone: '',
					contactFax: '',
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
					postCode: '',
					supplierDesc: '',
				},
				entreList: {},
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
			]),
			_supplier: function() {
				return this.edit.supplierType
			}
		},
		created() {
            this.setSupplierType()
            this.getSequence()
		},
		watch: {
			_supplier: function(newVal, oldVal) {
				if(newVal === config.supplier.supplierTypeDialCode.yes) {
					this.flagStatus = true;
					this.edit.contractSupplierFlag = '1'
				} else if(newVal === config.supplier.supplierTypeDialCode.no) {
					this.flagStatus = false;
					this.edit.contractSupplierFlag = ''
				} else if (newVal === config.supplier.supplierTypeDialCode.epiboly) {
					this.flagStatus = false;
					this.edit.contractSupplierFlag = ''
				} else if (newVal === config.supplier.supplierTypeDialCode.temporary) {
					this.flagStatus = true;
					this.edit.contractSupplierFlag = '0'
				}
			}
		},
		methods: {
			...mapActions('supplier', [
				'getSupplierType',
                'insertSupplierInfo',
                'getSupplierCode',
                'getSalesAreaInfoByAreaCode'
			]),
			//获取供应商类型
			setSupplierType: function() {
				let params = {
					refCode: config.supplier.refSupplierType
				}
				this.getSupplierType(params)
			},
			//新增供应商
			addSupplier: function () {
				const $this = this
				let judge;
				let required = {
					supplierName: this.edit.supplierName,
					supplyType: this.edit.supplyType,
					supplierType: this.edit.supplierType,
					supplierType: this.edit.supplierType,
					contactSex: this.edit.contactSex,
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
					this.insertSupplierInfo({
						props:this.edit,
						callBack: res => {
							if (res.data.code === "success") {
								for(let i in required) {
									$this.checkout[i] = null;
								}
								this.showAddition = true
								this.createdLock = true
								this.addSupplierCode = res.data.obj.supplierCode
							}
						}
					})
				}
            },
            getSequence: function() {
                this.getSupplierCode((supplierCode) => {
                    this.edit.supplierCode = supplierCode
                })
            },
            // loadPurchaseData: function(node, resolve) {
            //      let _this = this
            //      if(node.level === 0) {
            //          _this.getSalesAreaInfoByAreaCode({
            //              areaCode: config.areaRoot.parea,
            //              level: node.level,
            //              callback: resolve 
            //          }) 
            //      } else {
            //          _this.getSalesAreaInfoByAreaCode({
            //              areaCode: node.data.code,
            //              level: node.level,
            //              callback: resolve 
            //          })
            //      }  
            // },
            // setdata: function(data) {
            //     this.edit.purchasingAreaCode = data[0].code
            // },
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
	.supplier-warp {
		position: relative;
	}
	.ofh {
		overflow: hidden;
	}
</style>
