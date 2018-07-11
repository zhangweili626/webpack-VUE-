<template>
	<div>
		<b-card>
			<div class="row mt-2">
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="门店" :label-cols="4" class="text-right">
                       <areaqueryshop  ref="areaqueryshop" :storeAll='true' ></areaqueryshop>
                    </b-form-fieldset>
                 </div>
                 <div class="col-md-4">
                    <b-form-fieldset horizontal label="有效日期" :label-cols="4" class="text-right">
                        <b-form-input v-model="query.date"></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="提交人" :label-cols="4" class="text-right">
                        <b-form-input disabled v-model="query.confirmOperatorName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="提交时间" :label-cols="4" class="text-right">
                        <b-form-input  disabled v-model="query.confirmOperatorTime"></b-form-input>
                    </b-form-fieldset>
                </div>              
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="审批人" :label-cols="4" class="text-right">
                        <b-form-input  disabled v-model="query.auditPassOperatorName"></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="审批时间" :label-cols="4" class="text-right">
                        <b-form-input  disabled v-model="query.auditPassTime"></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-8">
                    <b-form-fieldset horizontal label="备注" :label-cols="2" class="text-right">
                        <b-form-input  disabled v-model="query.remark"></b-form-input>
                    </b-form-fieldset>
                </div>
            </div>
		</b-card>
		<b-card header="折扣明细">
			<div class="table-scrollable mb-2 service-manhour">
	            <b-table striped hover bordered show-empty empty-text="暂无数据" :items="tabeList" :fields="fields">
	                <template slot="sel" slot-scope="data">
	                    <input type="radio" name="radio2"  v-model="detailSel" :value="data.item" :disabled="onlySee"/>
	                </template>
	                <template slot="useType" slot-scope="data">
	                    <span v-if="data.item.useType == 0">全场</span>
	                    <span v-if="data.item.useType == 1">人工费</span>
	                    <span v-if="data.item.useType == 2">商品</span>
	                </template>
	                <template slot="discountType" slot-scope="data">
	                    <span v-if="data.item.discountType == 1">百分比</span>
	                    <span v-if="data.item.discountType == 0">固定金额</span>
	                </template>
	               <template slot="discountValue" slot-scope="data">
                        <span v-if="data.item.discountType == 1">{{100 - parseFloat(data.value)*100 + '%'}}</span>
                        <span v-if="data.item.discountType == 0">{{parseFloat(data.value).toFixed(2)}}</span>
                    </template>
	                <template slot="radio" slot-scope="data">
	                    <input type="radio" name="radio" v-model="selCont" :value="data.item"/>
	                </template>  
	                <template slot="discountItemType" slot-scope="data">
	                   <span v-if="data.value == '0'" :title="data.item.discountItemName">{{ data.item.discountItemName | strEllipsisFilter}}</span>    
                       <span v-if="data.value == '2'" :title="data.item.discountItemName">{{ data.item.discountItemName | strEllipsisFilter}}</span>
	                </template>
	                <template slot="discountItemCode" slot-scope="data">
	                	<span v-if="data.item.discountItemType == '1'" :title="data.value">{{ data.value | strEllipsisFilter}}</span>    
                        <span v-if="data.item.discountItemType == '3'" :title="data.value">{{  data.value | strEllipsisFilter}}</span>
	                </template>
	                <template slot="discountItemName" slot-scope="data">
	                    <span v-if="data.item.discountItemType == '1'" :title="data.value">{{ data.item.discountItemName | strEllipsisFilter}}</span>    
                        <span v-if="data.item.discountItemType == '3'" :title="data.value">{{ data.item.discountItemName | strEllipsisFilter}}</span>
	                </template>
	            </b-table>
	        </div>
		</b-card>
	</div>
</template>

<script>
	import api from 'common/api'
	import common from 'common/common'
	import areaqueryshop from "components/iris-areaqueryshop/";
	export default{
		components:{
			areaqueryshop,
		},
		mounted(){
			    this.getData();
                
		},
		data(){
			return{
				query:{
					date:'',
					confirmOperatorName:'',
					confirmOperatorTime:'',
					auditPassOperatorName:'',
					auditPassTime:'',
					remark:'',
				},
				tabeList:[],
				 fields: {			
					postTypeName: {
						label: "岗位类型"
                    },
                    postName: {
						label: "岗位名称"
					},
					postCode: {
						label: "岗位编码"
					},
					empCode: {
						label: "人员编码"
					},				
					empName: {
						label: "人员名称"
					},
					discountType: {
						label: "折扣类型"
                    },
                    discountValue: {
						label: "折扣权限"
                    },
                    useType: {
						label: "适用类型"
                    },
                    discountItemType: {
						label: "服务/商品分类"
                    },
                    discountItemCode: {
						label: "服务/商品编码"
                    },
                    discountItemName: {
						label: "服务/商品名称"
					},
            },
			}
		},
		methods:{
			getData(){
				let param = {
                    promotionDiscountOrderNo: this.$route.query.orderNo
                }
                api.saleDiscount.getPromotionDiscountOrderInfoByCode(param, (res) => {
                    if(res.data.code === 'success') {	
                        let data = res.data.obj;
                        if(data != null) {
                        	for(let k of Object.keys(this.query)){
                        		this.query[k]= data[k]
                        	}
                        	this.query.date = data.startDate + ' - '+ data.endDate
     						this.$refs.areaqueryshop.setselect({text:data.storeName,value:data.storeCode})
                        }
                    }
                });
                this.getDetail();
			},
			getDetail(){
				let param = {
                    promotionDiscountOrderNo: this.$route.query.orderNo
                }
				//获取折扣明细
                api.saleDiscount.queryPromotionDiscountRuleInfoExts(param, (res) => {
                    if(res.data.code === 'success') {							
                       this.tabeList = res.data.obj
                    };
                })
			}
		},
		watch:{
			'$route':'getData'
		}
	}
</script>

<style>
</style>