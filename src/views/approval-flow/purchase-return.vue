<template>
	<div>
		<b-card :header="`单号：${this.$route.query.orderNo}&nbsp;&nbsp;创建人：${this.headData.createBy}&nbsp;&nbsp;创建时间：${this.headData.createTimeStr}`">
		   <div class="row mt-2">
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="门店*" :label-cols="4" class="text-right">
                        <AreaTree ref="areaqueryshop" :storeAll='true' readonly></AreaTree>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="供应商*" :label-cols="4" class="text-right" disabled="">
                        <b-form-input v-model="headData.supplierName" disabled=""></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="退换单类型*" :label-cols="4" class="text-right">
                        <b-form-input  v-model="headData.purchaseReturnOrderType" disabled></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="预计退货日期*" :label-cols="4" class="text-right">
                        <b-form-input disabled="" v-model="headData.estimatedReturnDateStr" ></b-form-input>
                    </b-form-fieldset>
                </div>              
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="实际退货日期" :label-cols="4" class="text-right">
                        <b-form-input v-model="headData.actualReturnDate" disabled></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="审批通过日期" :label-cols="4" class="text-right">
                        <b-form-input  v-model="headData.auditPassTime" disabled></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-12">
                    <b-form-fieldset horizontal label="退货原因*" :label-cols="1" class="text-right ml-3 pl-3">
                        <b-form-input  v-model="headData.returnReason" disabled="" ></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-3">
                    <b-form-fieldset horizontal label="退货总数*" :label-cols="4" class="text-right  ml-3 pl-3">
                        <b-form-input  v-model="headData.totalNums"   disabled style=" margin-left: 12px;"></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-3 pr-0">
                    <b-form-fieldset horizontal label="运费" :label-cols="4" class="text-right pr-3">
                        <b-form-input type="number" v-model="headData.totalFreightFee" min='0' disabled></b-form-input>
                         <span class="input-append-yuan">元</span>
                    </b-form-fieldset>
                </div>
                <div class="col-md-2">
                    <b-form-fieldset horizontal label="" class="text-left">
                        <b-form-group>
                            <b-form-checkbox-group id="checkboxes2" class="mt-1" v-model="headData.calFreigthFlag" disabled="" >
                                <b-form-checkbox value="1">计入退货金额</b-form-checkbox>
                            </b-form-checkbox-group>
                        </b-form-group>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="退货总金额*" :label-cols="4" class="text-right pr-3">
                        <b-form-input  v-model="headData.totalMoney" disabled></b-form-input>
                        <span class="input-append-yuan">元</span>
                    </b-form-fieldset>
                </div>
            </div>
            
		</b-card>
		<b-card header="退货明细">
		    <div class="table-scrollable mb-2 service-manhour">
                <b-table striped hover bordered show-empty empty-text="暂无数据" :items="tabeList" :fields="fields">
                    <template slot="sel" slot-scope="data">
                        <input type="checkbox" name="radio4" :value="data.item" v-model="detailSel"  :disabled="onlySee"/>
                    </template>
                    <template slot="whName" slot-scope="data">
                        <b-form-select v-if="!data.item.id" :options="data.item.whList" v-model="data.value" @input='selectWh(data.value, data.index)'></b-form-select>
                        <span v-if="data.item.id">{{data.value}}</span>
                    </template>
                    <template slot="returnNums" slot-scope="data">
                        <b-form-input type="number" min="0" v-model="data.value" disabled="" ></b-form-input>
                    </template>
                    <template slot="returnPrice" slot-scope="data">
                        <b-form-input type="number" min="0" v-model="data.value" disabled="" ></b-form-input>
                    </template>
                    <template slot='returnTotalMoney' slot-scope="data">
                    	{{ (data.item.returnPrice * data.item.returnNums).toFixed(2) }}
                    </template>
                    <template slot="batchNumber" slot-scope="data">
                        <a href="###" @click="seeBactchDetail(data.item.skuCode, data.item.whCode)">详情</a>
                    </template>
                </b-table>
            </div>
		</b-card>
		<batchModal ref="myModalRef2" :whCode="batchwhCode" :skuCode='batchSkuCode'></batchModal>
	</div>
</template>

<script>
	import api from 'common/api'
	import AreaTree from 'components/iris-areaqueryshop/index'
	import batchModal from '../purchase-return/batchModal'
	export default{
		components:{
			AreaTree,
			batchModal
		},
		data(){
			return{
				batchwhCode: '',
            	batchSkuCode: '',
				headData: {
	                storeCode: '',
	                supplierCode:'',
	                supplierName:'',
	                purchaseReturnOrderType: '1',
	                estimatedReturnDateStr: '',
	                actualReturnDate:'',
	                auditPassTime:'',
	                returnReason:'',
	                totalNums: 0,
	                totalFreightFee: '0.00',
	                calFreigthFlag: '0',
	                totalMoney: '0.00',
	                createBy:'',
	                createTimeStr:'',
	            },
				tabeList:[],
	            fields: {						
					skuCode: {
						label: "商品编码"
                    },
                    skuName: {
						label: "商品名称"
                    },
                    whName: {
						label: "仓库名称"
					},
					warehouseAddress: {
						label: "仓库地址"
					},
					availableNums: {
						label: "可退货库存数"
					},				
					returnNums: {
						label: "本次退货数"
					},
					returnPrice: {
						label: "退货单价（含税）"
                    },
                    returnTotalMoney: {
						label: "退货金额（含税）"
                    },
                    barCode: {
						label: "69码"
                    },
                    originalCode: {
						label: "原厂编码"
                    },
                    skuModel: {
						label: "型号"
                    },
                    skuStandards: {
						label: "规格"
                    },
                   /* batchNumber: {
						label: "涉及批次"
					},*/
            	},
            }
		},
		mounted(){
			this.getData()
		},
		methods:{
			   seeBactchDetail(val1, val2){
		            this.batchSkuCode = val1;
		            this.batchwhCode = val2;
		            this.$refs.myModalRef2.show();
		        },
		        getData(){
		        	    let param = {
			                purchaseReturnOrderNo: this.$route.query.orderNo,
			            }
			            api.purchaseReturn.getPurchaseReturnOrderInfoByCode(param, (res) => {
			                if(res.data.code == 'success') {	
			                    let data = res.data.obj;
			                    	for(let key of Object.keys(this.headData)){
			                            this.headData[key] = data[key];
			                        }
			                    	if(this.headData.purchaseReturnOrderType == '1'){
			                    		this.headData.purchaseReturnOrderType = '非整车订单'
			                    	}
			                    	let stroeParam = {
			                                value: data.storeCode,
			                                text: data.storeName,
			                            }
			                        this.$refs.areaqueryshop.setselect(stroeParam); 
									this.tabeList = res.data.obj.purchaseReturnSkuDetailInfoVoList
			                   
			                    
			                }
			            })
			        },
		},
		watch:{
			'$route':'getData'
		}
	}
</script>

<style>
</style>