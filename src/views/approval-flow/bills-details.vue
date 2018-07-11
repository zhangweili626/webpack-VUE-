<template>
	<div>
		<!--采购合同-->
		<b-card v-if="this.$route.query.billtype == 'PurchaseContractWfType'">
		   <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="合同编号" :label-cols="4" class="text-right">
                        <b-form-input readonly v-model="contractParams.contractNo"/>                            
                    </b-form-fieldset>
                </div>
                 <div class="col-md-6">
                    <b-form-fieldset horizontal label="合同名称*" :label-cols="4" class="text-right">
                        <b-form-input readonly v-model="contractParams.contractName" />                               
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                  <b-form-fieldset label="供应商*" :label-cols="4" horizontal class="text-right">
                        <b-form-input readonly v-model="contractParams.supplierName" />   
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="外部编码" :label-cols="4" class="text-right">
                    	<b-form-input readonly v-model="contractParams.externalCode"/> 
                    </b-form-fieldset> 
                </div>
                <div class="col-md-6 col-lg-6">
                  <b-form-fieldset label="生效日期" :label-cols="4" horizontal class="text-right">
                        <b-form-input readonly v-model="contractParams.beginDate" />   
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="失效日期" :label-cols="4" class="text-right">
                    	<b-form-input readonly v-model="contractParams.endDate"/> 
                    </b-form-fieldset> 
                </div>
                <div class="col-md-6 col-lg-6">
                  <b-form-fieldset label="结算方式*" :label-cols="4" horizontal class="text-right">
                        <b-form-input readonly v-model="contractParams.settlementTypeName" />   
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="税率*" :label-cols="4" class="text-right">
                    	<b-form-input readonly v-model="contractParams.taxRate"/> 
                    </b-form-fieldset> 
                </div>
            </div>
		</b-card>
		<!--调拨主表信息-->
		<b-card v-if="this.$route.query.billtype == 'TransferOrderWfType'">
		   <div class="row">
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="调拨出库单号" :label-cols="4" class="text-right">
                        <b-form-input readonly v-model="allotoutParams.transferOutOrderNo"/>                            
                    </b-form-fieldset>
                </div>
                 <div class="col-md-4">
                    <b-form-fieldset horizontal label="调拨单类型" :label-cols="4" class="text-right">
                        <b-form-input readonly v-model="allotoutParams.transferSkuType" />                               
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                  <b-form-fieldset label="调拨单子类型" :label-cols="4" horizontal class="text-right">
                        <b-form-input readonly v-model="allotoutParams.transferType" />   
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="审核状态" :label-cols="4" class="text-right">
                    	<b-form-input readonly v-model="allotoutParams.wfStatus"/> 
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4 col-lg-4">
                  <b-form-fieldset label="调出总数量" :label-cols="4" horizontal class="text-right">
                        <b-form-input readonly v-model="allotoutParams.totalNums" />   
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="调出总金额" :label-cols="4" class="text-right">
                    	<b-form-input readonly v-model="allotoutParams.totalMoney"/> 
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4 col-lg-4">
                  <b-form-fieldset label="调入区域" :label-cols="4" horizontal class="text-right">
                        <areaqueryshop readonly   ref="areaqueryin"></areaqueryshop>   
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="调入仓库" :label-cols="4" class="text-right">
                    	<b-form-input readonly v-model="allotoutParams.inWhName"/> 
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4 col-lg-4">
                  <b-form-fieldset label="创建人" :label-cols="4" horizontal class="text-right">
                        <b-form-input readonly v-model="allotoutParams.createName" />   
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="调出区域" :label-cols="4" class="text-right">
                    	<areaqueryshop readonly   ref="areaqueryout"></areaqueryshop> 
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4 col-lg-4">
                  <b-form-fieldset label="调出仓库" :label-cols="4" horizontal class="text-right">
                        <b-form-input readonly v-model="allotoutParams.outWhName" />   
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="运费" :label-cols="4" class="text-right">
                    	<b-form-input readonly v-model="allotoutParams.totalFreightFee"/> 
                    </b-form-fieldset> 
                </div>
                 <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="实入总数量" :label-cols="4" class="text-right">
                    	<b-form-input readonly v-model="allotoutParams.realNums"/> 
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4 col-lg-4">
                  <b-form-fieldset label="实入总金额" :label-cols="4" horizontal class="text-right">
                        <b-form-input readonly v-model="allotoutParams.realMoney" />   
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="单据时间" :label-cols="4" class="text-right">
                    	<b-form-input readonly v-model="allotoutParams.createTimeStr"/> 
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4 col-lg-4">
                  <b-form-fieldset label="计划完成时间" :label-cols="4" horizontal class="text-right">
                        <b-form-input readonly v-model="allotoutParams.estimatedArrivalDate" />   
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="单据状态" :label-cols="4" class="text-right">
                    	<b-form-input readonly v-model="allotoutParams.orderStatus"/> 
                    </b-form-fieldset> 
                </div>
            </div>
		</b-card>
		<!--调整单主表信息-->
		<b-card v-if="this.$route.query.billtype == 'AdjustOrderWfType'">
		   <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="调整商品类型*" :label-cols="4" class="text-right">
                        <b-form-input readonly v-model="adjustParams.adjustSkuType"/>                            
                    </b-form-fieldset>
                </div>
               <!--  <div class="col-md-6">
                    <b-form-fieldset horizontal label="账期*" :label-cols="4" class="text-right">
                        <b-form-input readonly v-model="adjustParams.beTermNo" />                               
                    </b-form-fieldset>
                </div>-->
                <div class="col-md-6 col-lg-6">
                  <b-form-fieldset label="选择经销商店*" :label-cols="4" horizontal class="text-right">
                        <areaqueryshop readonly   ref="areaqueryshop"  @select-change="selectedfun"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="仓库名称*" :label-cols="4" class="text-right">
                    	<b-form-input readonly v-model="adjustParams.whName"/> 
                    </b-form-fieldset> 
                </div>
            </div>
		</b-card>
		<!--采购合同-->
		<b-card header="适用范围" v-if="this.$route.query.billtype == 'PurchaseContractWfType'">
			<table  class="table table-striped table-bordered">
				<thead>
					<tr class="text-center">
						<th class="text-center">全国</th>
						<th class="text-center">销售区域</th>
						<th class="text-center">经销商店</th>						
					</tr>
				</thead>
				<tbody class="text-center">
					<tr v-for="(val, index) in useRanges" :key='index'>
						<th>{{val.nationwide}}</th>
						<th>{{val.salesAreaName}}</th>
						<th>{{val.storeName}}</th>					
					</tr>
				<tr v-if="useRanges.length==0">
					<td colspan='13' class="text-left">暂无数据...</td>
				</tr>
				</tbody>
			</table>
		</b-card>
		<b-card header="合同明细" v-if="this.$route.query.billtype == 'PurchaseContractWfType'">
			<div class="table-scrollable">
				<b-table striped hover bordered show-empty empty-text="暂无数据" :items="contractList" :fields="fields">
					<template slot="isMainSupplier" slot-scope="data">
						{{data.item.isMainSupplier == '0' ? '否':'是'}}
					</template>
					<template slot="skuPriceTax" slot-scope="data">
						{{ data.item.skuPriceTax }}
					</template>
					<template slot="skuPriceCost" slot-scope="data">
						{{ data.item.skuPriceCost | tofix}}
					</template>
					<template slot="taxRate" slot-scope="data">
						{{ data.item.taxRate | rate}}
					</template>
				</b-table>
			</div>
		</b-card>
		<b-card header="报损报溢单明细" v-if="this.$route.query.billtype == 'AdjustOrderWfType'">
			<div class="table-scrollable">
				<b-table striped hover bordered show-empty empty-text="暂无数据" :items="adjustList" :fields="fields4">
					<template slot="adjustType" slot-scope="data">
						{{ data.item.adjustType == '0' ? '报溢':'报损' }}
					</template>
					<template slot="adjustCost" slot-scope="data">
						{{ data.item.adjustCost | tofix}}
					</template>
					<template slot="adjustTaxRate" slot-scope="data">
						{{ data.item.adjustTaxRate | rate}}
					</template>
					<template slot="stockCostTotalBefore" slot-scope="data">
						{{ data.item.stockCostTotalBefore | tofix}}
					</template>
				</b-table>
			</div>
		</b-card>
		<b-card header="调拨单明细" v-if="this.$route.query.billtype == 'TransferOrderWfType'">
			<div class="table-scrollable" v-if="transferType == 0">
				<b-table striped hover bordered show-empty empty-text="暂无数据" :items="allotoutList" :fields="fields2">
				</b-table>
			</div>
			<div class="table-scrollable" v-if="transferType == 1">
				<b-table striped hover bordered show-empty empty-text="暂无数据" :items="allotoutskuList" :fields="fields3">
					<template slot="raiseType" slot-scope="data">
						{{data.item.raiseType == '0' ? '加价系数 ':(data.item.raiseType == '1' ? '固定金额':'引用销售单价')}}
					</template>
					<template slot="raiseValue" slot-scope="data">
						<p v-if ="data.item.raiseType == '0'">{{data.item.salePrice | tofix}}</p>
					</template>
					<template slot="salePrice" slot-scope="data">
						{{data.item.salePrice | tofix}}
					</template>
					<template slot="stockCost" slot-scope="data">
						{{data.item.stockCost | tofix}}
					</template>
					<template slot="salePriceView" slot-scope="data">
						{{data.item.salePriceView | tofix}}
					</template>
					<template slot="taxRateName" slot-scope="data">
						{{data.item.taxRateName | rate}}
					</template>
				</b-table>
			</div>
		</b-card>
		
		<!--退票-->
		<refunds v-if="this.$route.query.billtype == 'RefundTicketType'"></refunds>
		<!--退卡退款-->
		<backCarMoney v-if="this.$route.query.billtype == 'RefundOrderWfType'"></backCarMoney>
		<!--采购退货-->
		<purchaseReturn  v-if="this.$route.query.billtype == 'PurchaseReturnOrderWfType'"></purchaseReturn>
		<!--促销折扣-->
		<saleDiscount v-if="this.$route.query.billtype == 'PromotionOrderWfType'"></saleDiscount>
		<!--对账核销-->
		<statementAccountCancel v-if="this.$route.query.billtype == 'ReconciliationOrderWfType'" ></statementAccountCancel>
		<!--库存调整-->
		<stockAdjust v-if="this.$route.query.billtype == 'StockAdjustOrderWfType'" ></stockAdjust>
	</div>
</template>

<script>
	import api from 'common/api'
	import common from 'common/common'
	import areaqueryshop from "components/iris-areaqueryshop/";
	import saleDiscount from "./sale-discount";
	import refunds from "./refund";
	import backCarMoney from "./backCarMoney";
	import reimburse from "./reimburse";
	import purchaseReturn from './purchase-return.vue'
	import stockAdjust from'./stock-adjust.vue'
	import statementAccountCancel from'./statement-account-cancel.vue'
	export default{
		components:{
			areaqueryshop,
			saleDiscount,
			refunds,
			backCarMoney,
			reimburse,
			purchaseReturn,
			stockAdjust,
			statementAccountCancel,
			/*cardModel,*/
		},
		props:['billTYpe'],
		data(){
			return{
				contractParams:{//采购合同主表信息
					contractNo:'',
					contractName:'',
					supplierName:'',
					externalCode:'',
					beginDate:'',
					endDate:'',
					settlementTypeName:'',
					taxRate:'',
				},
				contractList:[],//采购合同子明细
				useRanges:[],
				adjustParams:{//调整单主表
					adjustSkuType:null,
					storeCode:'',
					storeName:'',
					whName:'',
					beTermNo:'',
				},
				saleDiscount:{//促销折扣
					date:'',
					
				},
				adjustList:[],//调整单明细
				allotoutList:[],
				allotoutskuList:[],
				transferType:'',
				allotoutParams:{
					transferOutOrderNo:'',
					transferSkuType:'',
					transferType:'',
					wfStatus:'',
					totalNums:'',
					totalMoney:'',
					inStoreCode:'',
					inStoreName:'',
					inWhName:'',
					outStoreCode:'',
					outStoreName:'',
					outWhName:'',
					totalFreightFee:'',
					realNums:'',
					realMoney:'',
					confirmOperatorTime:'',
					estimatedArrivalDate:'',
					orderStatus:'',
					createName:'',
					createTimeStr:'',
				},
				params:{
					adjustSkuType:'',
					whCode:'',
					beTermNo:''
				},
				//采购合同
				fields: {
					skuName: {
						label: "商品名称"
					},
					skuCode: {
						label: "商品编码"
					},
					skuStandards: {
						label: "商品规格"
					},
					skuModel: {
						label: "商品型号"
					},
					checkUnitName: {
						label: "核算单位"
					},
					purchaseUnitName: {
						label: "采购单位"
					},
					purchaseToCheckNums: {
						label: "转换系数"
					},
					skuPriceTax: {
						label: "含税价"
					},
					skuPriceCost: {
						label: "去税价"
					},
					taxRate: {
						label: "税率类型"
					},
					isMainSupplier: {
						label: "是否主供应商"
					},
				},
				//内部调拨
				fields2: {
                    skuCode: {
                        label: 'SKU编码'
                    },
                    skuTempCode: {
                        label: '临时商品编码'
                    },
                    skuName: {
                        label: '商品名称'
                    },
                    barCode: {
                        label: '69码'
                    },
                    originalCode: {
                        label: '原厂编码'
                    },
                    externalCode: {
                        label: '外部编码'
                    },
                    brandName: {
                        label: '品牌'
                    },
                    skuStandards:{
                    	label:'规格'
                    },
                    skuModel: {
                        label: '型号'
                    },
                    purchaseUnitName: {
                        label: '采购单位'
                    },
                    stockNums: {
                        label: '当前库存'
                    },
                    availableNums: {
                        label: '可用库存'
                    },
                    outNums: {
                        label: '调出数量'
                    },
                    inNums: {
                        label: '实入数量'
                    },
                    remainNums: {
                        label: '剩余数量'
                    },
				},
				//集团内转售
				fields3: {
                    skuCode: {
                        label: 'SKU编码'
                    },
                    skuName: {
                        label: '商品名称'
                    },
                    barCode: {
                        label: '69码'
                    },
                    originalCode: {
                        label: '原厂编码'
                    },
                    externalCode: {
                        label: '外部编码'
                    },
                    brandName: {
                        label: '品牌'
                    },
                    skuStandards:{
                    	label:'规格'
                    },
                    skuModel: {
                        label: '型号'
                    },
                    purchaseUnitName: {
                        label: '采购单位'
                    },
                    stockNums: {
                        label: '当前库存'
                    },
                     availableNums: {
                        label: '可用库存'
                    },
                  	outNums: {
                        label: '调出数量'
                    },
                    stockCost: {
                        label: '单位成本'
                    },
                    salePriceView: {
                        label: '销售定价'
                    },
                    raiseType:{
                    	label: '加价类型'
                    },
                    raiseValue:{
                    	label: '加价值'
                    },
                    taxRateName: {
                        label: '税率'
                    },
                     salePrice: {
                        label: '销售价'
                    },
                    inNums: {
                        label: '实入数量'
                    },
                    remainNums: {
                        label: '剩余数量'
                    },
				},
				//库存调整单
				fields4: {
                    skuCode: {
                        label: "sku编码"
                    },
                    skuName: {
                        label: "商品名称"
                    },
                    barCode:{
                        label: "69码"
                    },
                    originalCode:{
                        label: "原厂编码"
                    },
                    externalCode:{
                        label: '外部编码'
                    },
                    calCostTypeName:{
                        label: '成本计算类型'
                    },
                    stockNumsBefore:{
                        label: "调整前库存数量"
                    },
                    stockCostBefore:{
                    	label: "调整前单位成本"
                    },
                    stockCostTotalBefore:{
                    	label: "调整前库存总金额"
                    },
                    adjustType:{
                        label:"报损报溢类型"
                    },
                    adjustValue:{
                        label:"调整数值（数量）"
                    },
                    adjustCost:{
                        label:"成本（含税价）"                
                    },
                    adjustTaxRate:{
                        label:"税率"                
                    },
                    adjustReason:{
                    	label:'调整原因'
                    }
				},
			}
		},
		mounted(){
			setTimeout(this.getDetal,1000)
			
		},
		methods:{
			//
			selectedfun(){},
			//根据单号查询详情
			getDetal(){
				let billNo = this.$route.query.orderNo;
				switch(this.$route.query.billtype){
					//退卡退款
					case'RefundOrderWfType':
					break;
					case 'PurchaseContractWfType':
					//获取合同主表信息
					api.purchaseContract.PurchaseInfo({contractNo:billNo},(res)=>{
						if(res.data.code == 'success'){
							for(let k of Object.keys(this.contractParams)){
								this.contractParams[k]= res.data.obj[k]
							}
							this.contractParams.taxRate = (this.contractParams.taxRate *100)+"%"
							this.contractList = res.data.obj.purchaseContractDetailInfoVoList
						}
					});
					//获取适用范围
					api.purchaseContract.getUseRange({contractNo:billNo},(res)=>{
						if(res.data.code == 'success'){
							this.useRanges = res.data.obj
						}
					});
					break;
					case 'AdjustOrderWfType':
					//调整单主表信息
					api.approval.ajustByCode({adjustNo:billNo},(res)=>{
						if(res.data.code == 'success'){
							for(let k of Object.keys(this.adjustParams)){
								this.adjustParams[k]= res.data.obj[k]
							}
							this.adjustParams.adjustSkuType = this.adjustParams.adjustSkuType == 0 ?'整车':'非整车'
							this.adjustList = res.data.obj.adjustSkuDetailInfoVoList
							this.$refs.areaqueryshop.setselect({text:this.adjustParams.storeName,value:this.adjustParams.storeCode})
						}
					})
					break;
					case 'TransferOrderWfType':
					api.allotout.selectQuery({transferOutOrderNo:billNo,'empToken':JSON.parse(common.getSession('userInfo')).empToken,},(res)=>{
						if(res.data.code == 'success'){
							for(let k of Object.keys(this.allotoutParams)){
								this.allotoutParams[k]= res.data.obj[k]
							}
							api.staff.getDetail({empCode:res.data.obj.createBy},(res)=>{
								if(res.data.code == 'success'){
									this.allotoutParams.createName=res.data.obj.empCnName
								}
							})
							this.transferType = res.data.obj.transferType
							this.allotoutParams.totalMoney = this.allotoutParams.totalMoney.toFixed(2);
							this.allotoutParams.transferSkuType = res.data.obj.transferSkuType == 0 ? '整车':'非整车'
							this.allotoutParams.transferType = res.data.obj.transferType == 0 ? '内部调拨':'集团内转售'
							this.allotoutParams.wfStatus = res.data.obj.wfStatus == 0 ? '审批中':(res.data.obj.wfStatus == 1 ? '审批通过':'待提交')
							this.allotoutParams.orderStatus = this.billuStatus(res.data.obj.orderStatus)
							if(this.transferType == '0'){
								this.allotoutList = res.data.obj.transferOutSkuDetailInfoVoList
							}else{
								this.allotoutskuList = res.data.obj.transferSaleOutSkuDetailInfoVoList
							}
							this.$refs.areaqueryin.setselect({text:this.allotoutParams.inStoreName,value:this.allotoutParams.inStoreCode})
							this.$refs.areaqueryout.setselect({text:this.allotoutParams.outStoreName,value:this.allotoutParams.outStoreCode})
						}
					})
					break;
				}
			},
			//单据状态
         	billuStatus(num){
		    	let text = '';
		    	switch (num)
					{
					case 0:
					  text="未生效";
					  break;
					case 1:
					  text="已提交";
					  break;
					case 2:
					 text="已生效";
					  break;
					case 3:
					 text="已完成";
					  break;
					case 4:
					 text="已关闭";
					  break;
					case -1:
					  text="作废";
					  break;
					};
				 return text;
		    },
		    //根据code拿创建人
		},
	  	filters:{
        	tofix(val){
        		if(val){
        			if(val == 0){
        				return 0
        			}else{
        				return val.toFixed(2)
        			}
        			
        		}else if(val == 0){
        			return 0
        		}
        	},
        	//税率的处理
        	rate(val){
        		return val*100 + '%'
        	}
        },
	}
</script>

<style scoped>
	.table-scrollable{
		max-height: 400px;
		overflow: auto;
	}
</style>