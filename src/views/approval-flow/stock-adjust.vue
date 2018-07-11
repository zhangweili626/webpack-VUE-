<template>
	<div>
		<b-card header="调整单信息" v-show="isShow">
	        <div class="row">
	            <div class="col-md-4">
	                <b-form-fieldset horizontal label="调整单号" label-text-align="right" :label-cols="4">
	                    <b-form-input v-model="adjustOrderInfo.adjustOrderNo" readonly/>
	                </b-form-fieldset>
	            </div>
	            <div class="col-md-4">
	                <b-form-fieldset horizontal label="门店" label-text-align="right" :label-cols="4">
	                    <b-form-input v-model="adjustOrderInfo.storeName" readonly/>
	                </b-form-fieldset>
	            </div>
	            <div class="col-md-4">
	                <b-form-fieldset horizontal label="仓库" label-text-align="right" :label-cols="4">
	                    <b-form-input v-model="adjustOrderInfo.whName" readonly/>
	                </b-form-fieldset>
	            </div>
	            <div class="col-md-4">
	                <b-form-fieldset horizontal label="调整原因" label-text-align="right" :label-cols="4">
	                    <b-form-input v-model="adjustOrderInfo.adjustReason" readonly/>
	                </b-form-fieldset>
	            </div>
	            <div class="col-md-4">
	                <b-form-fieldset horizontal label="商品编码*" :label-cols="4" class="text-right">
	                	 <b-form-input v-model="adjustOrderInfo.skuCode" readonly/>
	                </b-form-fieldset>
	            </div>
	            <div class="col-md-4">
	                <b-form-fieldset horizontal label="商品名称" :label-cols="4" class="text-right">
	                	 <b-form-input v-model="adjustOrderInfo.skuName" readonly/>
	                </b-form-fieldset>
	            </div>
	            <div class="col-md-4">
	                <b-form-fieldset horizontal label="创建时间" label-text-align="right" :label-cols="4">
	                    <b-form-input v-model="adjustOrderInfo.createTimeStr" readonly/>
	                </b-form-fieldset>
	            </div>
	            <div class="col-md-4">
	                <b-form-fieldset horizontal label="单据状态" label-text-align="right" :label-cols="4">
	                    <b-form-input v-model="adjustOrderInfo.orderStatus" readonly/>
	                </b-form-fieldset>
	            </div>
	            <div class="col-md-4">
	                <b-form-fieldset horizontal label="提交人" label-text-align="right" :label-cols="4">
	                    <b-form-input v-model="adjustOrderInfo.confirmOperatorName" readonly />
	                </b-form-fieldset>
	            </div>
	            <div class="col-md-4">
	                <b-form-fieldset horizontal label="提交时间" label-text-align="right" :label-cols="4">
	                    <b-form-input v-model="adjustOrderInfo.confirmOperatorTime" readonly/>
	                </b-form-fieldset>
	            </div>
	        </div>
	    </b-card>
	    <b-card v-if=" type == 0">
	    	<div class="table-scrollable">
                <b-table striped hover bordered show-empty empty-text="暂无数据" :items="tabeList2" :fields="fields">
                </b-table>
            </div>
            <strong>金额调整</strong>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty empty-text="暂无数据" :items="tabeList" :fields="field">
                </b-table>
            </div>
	    </b-card>
	    <b-card v-if="type == 1 || type == 2">
	    	<div class="row">
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="商品编码" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="averageAdjustDetail.skuCode" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="商品名称" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="averageAdjustDetail.skuName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="成本计算类型" :label-cols="4" class="text-right">
                        <b-form-input v-model="averageAdjustDetail.calCostTypeCode" readonly/>
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="仓库" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="averageAdjustDetail.whName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="库区" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="averageAdjustDetail.whAreaName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="库位" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="averageAdjustDetail.whLocationName" readonly/>
                    </b-form-fieldset>
                </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <b-form-fieldset horizontal label="当前库存数" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="averageAdjustDetail.stockNumsBefore"  readonly/>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="当前库存总金额" label-text-align="right" :label-cols="4">
                    <b-form-input :value="averageAdjustDetail.stockCostTotalBefore | tofixed" readonly/>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="当前库存单位成本" label-text-align="right" :label-cols="4">
                    <b-form-input :value="averageAdjustDetail.stockCostBefore | tofixed" readonly />
                </b-form-fieldset>
            </div>
        </div>
          <hr>
        <div v-if="type == 0 || type == 2">
    	   <strong>期末预览</strong>
          
            <div class="row">
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="期末库存数" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="averageAdjustDetail.stockNumsBefore"  readonly/>
                        
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="期末库存总金额" label-text-align="right" :label-cols="4">
                        <b-form-input :value="averageAdjustDetail.stockCostTotalBefore | tofixed" readonly/>
                        
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="期末库存单位成本" label-text-align="right" :label-cols="4">
                        <b-form-input :value="averageAdjustDetail.stockCostBefore | tofixed" readonly />
                    </b-form-fieldset>
                </div>
                 <div class="col-md-4">
                    <b-form-fieldset horizontal label="调整库存总金额差异数(含税)" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="averageAdjustDetail.adjustValue" readonly/>
                        
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="税率*" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="averageAdjustDetail.adjustTaxRate" readonly/>
                    </b-form-fieldset>
                </div>
            </div>
        </div>
         <div class="row" v-if="type == 1 ">
            <div class="col-md-4">
                <b-form-fieldset horizontal label="调整差异数" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="averageAdjustDetail.adjustValue" type="number" readonly/>
                </b-form-fieldset>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <b-form-fieldset horizontal label="调整原因" label-text-align="right" :label-cols="4">
                    <b-form-textarea id="textarea1" v-model="averageAdjustDetail.adjustReason" readonly></b-form-textarea>
                </b-form-fieldset>
            </div>
        </div>
        <hr>
         <div class="row" v-if="type == 1 ">
            <div class="col-md-4">
                <b-form-fieldset horizontal label="调整后库存数" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="averageAdjustDetail.TY1stockNumsAfter" readonly/>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="调整后库存总金额" label-text-align="right" :label-cols="4">
                    <b-form-input :value="averageAdjustDetail.TY1stockCostTotalAfter | tofixed" readonly/>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="调整后库存单位成本" label-text-align="right" :label-cols="4">
                    <b-form-input :value="averageAdjustDetail.TY1stockCostAfter | tofixed" readonly/>
                </b-form-fieldset>
            </div>
        </div>
    	<div v-if="type == 2 ">
		    <strong>调整后结果</strong>
            <hr>
            <div class="row" >
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="期末库存数量" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="averageAdjustDetail.stockNumsAfter" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="期末库存总金额" label-text-align="right" :label-cols="4">
                        <b-form-input :value="averageAdjustDetail.stockCostTotalAfter | tofixed" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="期末库存单位成本" label-text-align="right" :label-cols="4">
                        <b-form-input :value="averageAdjustDetail.stockCostAfter | tofixed" readonly/>
                    </b-form-fieldset>
                </div>
            </div>
    	</div>
        
    </b-card>
	</div>
</template>

<script>
	import api from 'common/api'
	import common from 'common/common'
	export default{
		data(){
			return{
				isShow:true,
				type:null,
				tabeList:[],
				tabeList2:[],
				a:[],
			    adjustOrderInfo: {
	                adjustOrderNo: '',
	                storeCode: '',
	                storeName: '',
	                whCode: '',
	                whName: '',
	                skuCode: '',
	                skuName: '',
	                orderStatus: '',
	                createTimeStr:'',
	                confirmOperatorName: '',
	                confirmOperatorTime: '',
	                adjustReason: '',
	                calCostTypeCode: '',
	                adjustType: '',
	                stockAdjustSkuDetailInfoVoList: []
	            },
	            averageAdjustDetail:{
	        	    whCode: '',
	                whName: '',
	                skuCode: '',
	                skuName: '',
	                calCostTypeCode: '',
	                whAreaName: '',
	                whLocationName: '',
	                adjustValue: '',
	                adjustTaxRate: '',
	                adjustReason: '',
	                stockNumsBefore: '',
	                stockCostTotalBefore: '',
	                stockCostBefore: '',
	                stockNumsAfter: '',
	                stockCostTotalAfter: '',
	                stockCostAfter: '',
	                TY1stockNumsAfter:'',
	                TY1stockCostTotalAfter:'',
	                TY1stockCostAfter:'',
	            },
	            fields:{
	            	skuCode:{
	            		label:'商品编码'
	            	},
	            	skuName:{
	            		label:'商品名称'
	            	},
	            	inBatchNo:{
	            		label:'入库批次号'
	            	},
	            	stockNums:{
	            		label:'入库数量(未出库)'
	            	},
	            	inStockTotalAmountTax:{
	            		label:'入库总金额(未出库-含税)'
	            	},
	            	inStockIncludingTaxPrice:{
	            		label:'入库单价(含税)'
	            	},
	            	inStockRate:{
	            		label:'入库税率'
	            	},
	            	inStockCost:{
	            		label:'入库单位成本'
	            	},
	            	inStockTotalAmount:{
	            		label:'入库总金额(未出库)'
	            	},
	            },
               field:{
	            	skuCode:{
	            		label:'商品编码'
	            	},
	            	skuName:{
	            		label:'商品名称'
	            	},
	            	inBatchNo:{
	            		label:'入库批次号'
	            	},
	            	stockNums:{
	            		label:'入库数量'
	            	},
	            	inStockTotalAmountTax:{
	            		label:'入库总金额(未出库-含税)'
	            	},
	            	inStockIncludingTaxPrice:{
	            		label:'入库单价(含税)'
	            	},
	            	inStockRate:{
	            		label:'入库税率'
	            	},
	            	inStockCost:{
	            		label:'入库单位成本'
	            	},
	            	inStockTotalAmount:{
	            		label:'入库总金额(未出库)'
	            	},
	            }
			}
		},
		mounted(){
			this.getData();
		
		},
		methods:{
			getNum(list,item){
			   const arr=list.filter(x=>{ return x.inBatchNo == item});
			   return arr.length
			},
			getData(){
				this.tabeList = [];
				api.stockAdjust.queryByCode({adjustOrderNo:this.$route.query.orderNo}).then((res)=>{
					if(res.data.obj == null){
						this.type = null
						this.isShow = false
						return
					}
					if(res.data.obj.calCostTypeCode == 'average'){
						this.isShow = true
						//单据状态，
						this.adjustOrderInfo.orderStatus = res.data.obj.wfStatus
						for(let k of Object.keys(this.averageAdjustDetail)){
							this.averageAdjustDetail[k] =  res.data.obj.stockAdjustSkuDetailInfoVoList[0][k]
						}
						/*税率优化*/
						this.averageAdjustDetail.adjustTaxRate = (this.averageAdjustDetail.adjustTaxRate * 100)+"%"
						const obj = res.data.obj.stockAdjustSkuDetailInfoVoList[0];
						this.averageAdjustDetail.whName = res.data.obj.whName
						this.averageAdjustDetail.calCostTypeCode = res.data.obj.calCostTypeCode == 'average' ? '平均':'计件'
					    let params = {
	                        skuCode: this.averageAdjustDetail.skuCode,
	                        whCode: res.data.obj.whCode
	                    }
	                    api.skuPlace.querySkuLocationInfoNoPage(params, res => {
	                        if(res.data.code === 'success') {
	                            let info = res.data.obj[0]
	                            if(info) {
	                                this.averageAdjustDetail.whAreaCode = info.whAreaCode
	                                this.averageAdjustDetail.whAreaName = info.whAreaName
	                                this.averageAdjustDetail.whLocationCode = info.whLocationCode
	                                this.averageAdjustDetail.whLocationName = info.whLocationName                           
	                            }else {
	                                this.averageAdjustDetail.whAreaCode = ''
	                                this.averageAdjustDetail.whAreaName = ''
	                                this.averageAdjustDetail.whLocationCode = ''
	                                this.averageAdjustDetail.whLocationName = ''
	                            }
	                        }
	                    })
	                    //获取库存数及库存总金额
	                    api.stockAdjust.queryBeStockInfo(params).then(res=>{
	                    	this.averageAdjustDetail.stockNumsBefore = res.data.obj[0].currentInTotalNums
	                    	this.averageAdjustDetail.stockCostTotalBefore = res.data.obj[0].currentInTotalMoney
	                    	this.averageAdjustDetail.stockCostBefore = this.averageAdjustDetail.stockCostTotalBefore/this.averageAdjustDetail.stockNumsBefore
							this.averageAdjustDetail.stockCostTotalAfter = this.averageAdjustDetail.stockCostTotalBefore + obj.adjustValue/(1+obj.adjustTaxRate);
							this.averageAdjustDetail.stockNumsAfter = this.averageAdjustDetail.stockNumsBefore
							this.averageAdjustDetail.stockCostAfter = (this.averageAdjustDetail.stockCostTotalAfter / this.averageAdjustDetail.stockNumsAfter)
	                    })
	                    //类型判断
	                    if(res.data.obj.adjustType == 0){
							this.type = 1;
							debugger
							if(this.adjustOrderInfo.orderStatus == 1){
								this.averageAdjustDetail.TY1stockNumsAfter = obj.stockNumsAfter
								this.averageAdjustDetail.TY1stockCostTotalAfter = obj.stockCostTotalAfter
								this.averageAdjustDetail.TY1stockCostAfter = obj.stockCostAfter
							}else{
								api.stockAdjust.queryBeStockInfo(params).then(res=>{
									if(res.data.code == 'success'){
									   let obj = res.data.obj[0]
		                                if(obj) {
		                                        // 当前库存数 = 期初库存数量 + 本期入库总数量 - 本期出库总数量
		                                        this.averageAdjustDetail.stockNumsBefore = obj.beginStockNums + obj.currentInTotalNums - obj.currentOutTotalNums
		                                        // 当前库存总金额 = 期初库存总金额 + 本期入库总金额 - 本期出库总金额
		                                        this.averageAdjustDetail.stockCostTotalBefore = obj.beginTotalMoney + obj.currentInTotalMoney - obj.currentOutTotalMoney
		                                        // 当前库存单位成本 = 期初库存单位成本   update 2018/06/08 = 当前库存总金额 / 当前库存数
		                                        this.averageAdjustDetail.stockCostBefore = this.averageAdjustDetail.stockCostTotalBefore / this.averageAdjustDetail.stockNumsBefore
	                                        	this.averageAdjustDetail.TY1stockNumsAfter = this.averageAdjustDetail.stockNumsBefore + this.averageAdjustDetail.adjustValue
												this.averageAdjustDetail.TY1stockCostTotalAfter = this.averageAdjustDetail.stockCostTotalBefore
												this.averageAdjustDetail.TY1stockCostAfter = this.averageAdjustDetail.stockCostTotalBefore/this.averageAdjustDetail.TY1stockNumsAfter 
		                                }
									}
			                    	
			                    })
							}
							
							
						}else{
							this.type = 2;
						}
	                    
					}else if(res.data.obj.calCostTypeCode == 'byCount' && res.data.obj.adjustType == 1){
						this.isShow = true
						this.type = 0;
						this.a =  res.data.obj.stockAdjustSkuDetailInfoVoList.map(res=>{
							return res.inBatchNo
						})
						for(let k of Object.keys(this.adjustOrderInfo)){
							this.adjustOrderInfo[k]= res.data.obj[k]
						}
						const objList = res.data.obj.stockAdjustSkuDetailInfoVoList[0];
						this.adjustOrderInfo.skuCode = objList.skuCode
						this.adjustOrderInfo.skuName = objList.skuName
						this.a =Array.from(new Set(this.a))
						this.a.forEach(item => {
							this.tabeList.push({
								skuCode:this.adjustOrderInfo.skuCode,
								skuName:this.adjustOrderInfo.skuName,
								inBatchNo:item,
								stockNums:this.getNum(res.data.obj.stockAdjustSkuDetailInfoVoList,item),
								inStockIncludingTaxPrice:objList.inStockIncludingTaxPriceAfter,
								inStockRate:objList.adjustTaxRate,
								inStockTotalAmountTax:(this.getNum(res.data.obj.stockAdjustSkuDetailInfoVoList,item)*objList.inStockIncludingTaxPriceAfter).toFixed(2),
								inStockCost:(objList.inStockIncludingTaxPriceAfter/(1+objList.adjustTaxRate)).toFixed(2),
								inStockTotalAmount:(objList.inStockIncludingTaxPriceAfter/(1+objList.adjustTaxRate).toFixed(2)* this.getNum(res.data.obj.stockAdjustSkuDetailInfoVoList,item)).toFixed(2),
							})
						})
						this.getDetail();
					}
					//调整单主表信息公共
					for(let k of Object.keys(this.adjustOrderInfo)){
						this.adjustOrderInfo[k]= res.data.obj[k]
					}
					this.adjustOrderInfo.orderStatus = this.billuStatus(this.adjustOrderInfo.orderStatus)
					const objList = res.data.obj.stockAdjustSkuDetailInfoVoList[0];
					this.adjustOrderInfo.skuCode = objList.skuCode
					this.adjustOrderInfo.skuName = objList.skuName
				})
			},
			getDetail(){
				this.tabeList2 = [];
				const params = {
					pageNums:100,
					pageStart:1,
					skuCode:this.adjustOrderInfo.skuCode,
					stockStatus:1,
					storeCode:this.adjustOrderInfo.storeCode,
					whCode:this.adjustOrderInfo.whCode,
				}
			  	api.stockAdjust.queryStockDetailBatch(params).then(res => {
	                if(res.data.code === 'success') {
	                    let obj = res.data.obj.list
	                    //调整前
	                    obj.forEach(item=>{
	                    	this.tabeList2.push({
	                    		skuCode:item.skuCode,
	                    		skuName:item.skuName,
	                    		inBatchNo:item.inBatchNo,
	                    		stockNums:item.stockNums,
	                    		inStockCost:item.inStockCost.toFixed(2),
	                    		inStockRate:item.inStockRate,
	                    		inStockIncludingTaxPrice:item.inStockIncludingTaxPrice,
	                    		inStockTotalAmountTax:(item.stockNums*item.inStockIncludingTaxPrice).toFixed(2),
	                    		inStockTotalAmount:(item.inStockCost*item.stockNums).toFixed(2),
	                    	})
	                    })
	                }
	            })
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
		},
		filters:{
			tofixed(val){
				return Number(val).toFixed(2)
			},
		},
		watch:{
			'$route':'getData'
		},
	}
</script>

<style>
</style>