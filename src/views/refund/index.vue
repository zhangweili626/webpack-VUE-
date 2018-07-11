<template>
	<div>
		<b-card header="查询">
			<div class="row">
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="门店" label-text-align="right" :label-cols="4">
						<areaqueryshop ref="areaqueryshop" :storeAll="true" @select-change="selectedfun"></areaqueryshop>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="红冲类型" label-text-align="right" :label-cols="4">
						<b-form-select :options="configs.orderType" v-model="query.sourceOrderTypeCode" ></b-form-select>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="红冲申请单号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.refundInvoiceOrderNo"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="单据状态" label-text-align="right" :label-cols="4">
						<b-form-select :options="configs.orderStatus" v-model="query.orderStatus"></b-form-select>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="原始发票号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.invoiceNo"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="红冲发票号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.refundInvoiceNo"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="创建人" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.createByName"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="审核人" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.auditPassOperatorName" ></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="单据时间" label-text-align="right" :label-cols="4">
						   <el-date-picker
						      v-model="billtime"
						      type="daterange"
						      range-separator="至"
						      start-placeholder="开始日期"
						      end-placeholder="结束日期">
						    </el-date-picker>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="单据审核通过时间" label-text-align="right" :label-cols="5">
						   <el-date-picker
						      v-model="billpasstime"
						      type="daterange"
						      @change="billpasschange()"
						      range-separator="至"
						      start-placeholder="开始日期"
						      end-placeholder="结束日期">
						    </el-date-picker>
						  
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset">重置</b-button>                        
                        <b-button size="sm" variant="primary" @click="getquery()">查询</b-button>
                    </div>
				</div>
			</div>
		</b-card>
		<b-card>
			<div class="row">
				<div class="col-lg-12">
					<b-button variant="success" @click="add" size="sm">新增</b-button>
					<b-button variant="primary" @click="edit" size="sm">编辑</b-button>
				</div>
			</div>
			<div class="table-scrollable">
				<b-table striped hover bordered :items="list" :fields="field" show-empty empty-text="暂无数据">
					<template slot="radio" slot-scope="data">
						<input type="radio"  v-model="editSelect" :value="data.item.id"/>
					</template>
					<template slot="storeName" slot-scope="data">
						<div class="w-150">
							{{data.item.storeName}}
						</div>
					</template>
					<template slot="refundInvoiceOrderNo" slot-scope="data">
						<router-link :to='{name:"refund-detail",query:{
							refundInvoiceOrderNo:data.item.refundInvoiceOrderNo,
							id:data.item.id,
						}}'>
							{{data.item.refundInvoiceOrderNo}}
						</router-link>
					</template>
					<template slot="orderStatus" slot-scope="data">
						{{data.item.orderStatus | billstatus }}
					</template>
					<template slot="sourceOrderNos" slot-scope="data">
						<div class="w-200">
							{{data.item.sourceOrderNos}}
						</div>
					</template>
					<template slot="refundInvoiceAmount" slot-scope="data">
						{{data.item.refundInvoiceAmount | tofix}}
					</template>
					<template slot="refundInvoiceCount" slot-scope="data">
						{{data.item.refundInvoiceCount | intNum}}
					</template>
				</b-table>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<pagination class="pull-right" 
                        @page-change="pageChange" 
                        :pageNo="pages.pageNo" 
                        :pageSize="pages.pageSize" 
                        :totalPages="pages.totalPages" 
                        :totalResult="pages.total">
                    </pagination>
				</div>
			</div>
		</b-card>
	</div>
</template>

<script>
import Vue from 'vue'
import api from 'common/api'
import config from 'common/config'
import { MessageBox, Message,DatePicker} from 'element-ui'
import {getType} from 'common/api-common'
import {mapState, mapActions } from 'vuex'
import pagination from 'components/pagination/pagination'
import common from 'common/common.js'
import areaqueryshop from 'components/iris-areaqueryshop/'
import{ SOURCE_ORDER_TYPE } from 'common/ref-code'
Vue.use(DatePicker)
	export default{
		components:{
			pagination,
			areaqueryshop
		},
		mounted(){
			//数字字典取值
			getType(SOURCE_ORDER_TYPE,res=>{
				res.forEach( item =>{
					this.configs.orderType.push({
						value:item.refDetailCode,
						text:item.refDetailName,
					})
				})
					
			
			})
		},
		computed:{
			...mapState('refund',[
				'refundList',
				'page'
			])
		},
		data(){
			return{
				configs:{
					orderType:[],
					orderStatus:config.allotOut.AbillStatus,
				},
				billtime:[],
				billpasstime:[],
				query:{
					storeCodes:[],
					storeCode:'',
					sourceOrderTypeCode:'',
					refundInvoiceOrderNo:'',
					orderStatus:null,
					invoiceNo:'',
					refundInvoiceNo:'',
					createByName:'',
					auditPassOperatorName:'',
					createTimeFrom:'',
					createTimeTo:'',
					auditPassTimeFrom:'',
					auditPassTimeTo:'',
				},
				pages:{
					pageNo: 1,
			        pageSize:config.pageNums,
			        total: 1,
			        totalPages: 1
				},
				list:[],
				editSelect:'',
				field:{
					radio:{
						label:'选择'
					},
					storeName:{
						label:'门店'
					},
					refundInvoiceOrderNo:{
						label:'红冲申请单号'
					},
					sourceOrderTypeName:{
						label:'红冲业务单类型'
					},
					sourceOrderNos:{
						label:'红冲业务单号'
					},
					refundInvoiceCount:{
						label:'红冲发票张数'
					},
					refundInvoiceNos:{
						label:'红冲票号'
					},
					refundInvoiceAmount:{
						label:'红冲发票总金额'
					},
					createTimeStr:{
						label:'创建时间'
					},
					createByName:{
						label:'创建人'
					},
					orderStatus:{
						label:'单据状态'
					},
					auditPassOperatorName:{
						label:'审核人'
					},
					
				}
			}
		},
		methods:{
			...mapActions('refund',[
			'getRefundList',
			'getpage'
			]),
			selectedfun(data,data1){
				console.log(data,data1)
				if(Array.isArray(data1)){
					this.query.storeCodes = [];
					for(let i= 1;i<data1.length;i++){
						this.query.storeCodes.push(data1[i].value)
					}
				}else{
					this.query.storeCodes = [];
					this.query.storeCode =  data1.value;
				}
			},
			showAdd(){
				this.$refs.showAdd.show()
			},
			pageChange(num){
				this.getquery(num)
			},
			reset(){
				for(let k of Object.keys(this.query)){
					this.query[k]=''
				}
				this.billtime= [];
				this.billpasstime = [];
				this.query.storeCodes = [];
				this.$refs.areaqueryshop.reset();
				this.$refs.areaqueryshop.resetToStart();
			},
			getquery(num=1){
				const option = {
					pageNums: config.pageNums,
					pageStart:num,
				}
				this.query.createTimeFrom =common.eleTimeFormat(this.billtime[0]) == '1970-01-01' ? '':common.eleTimeFormat(this.billtime[0]),
				this.query.createTimeTo =common.eleTimeFormat(this.billtime[1]) == '1970-01-01' ? '':common.eleTimeFormat(this.billtime[1]),
				this.query.auditPassTimeFrom =common.eleTimeFormat(this.billpasstime[0]) == '1970-01-01' ? '':common.eleTimeFormat(this.billpasstime[0]),
				this.query.auditPassTimeFromTo =common.eleTimeFormat(this.billpasstime[1]) == '1970-01-01' ? '':common.eleTimeFormat(this.billpasstime[1]),
				Object.assign(this.query,option)
				console.log(this.query)
				api.refund.query(this.query,(res)=>{
					if(res.data.code == 'success'){
						this.list = res.data.obj.list;
						this.pages = {
							pageNo:res.data.obj.pageNum,
					        pageSize:res.data.obj.pageSize,
					        total:res.data.obj.total,
					        totalPages:res.data.obj.pages,
						}
					/*	this.getRefundList(res.data.obj.list)
						this.getpage({
							pageNo:res.data.obj.pageNum,
					        pageSize:res.data.obj.pageSize,
					        total:res.data.obj.total,
					        totalPages:res.data.obj.pages,
						})*/
					}
				})
			},
			add(ev){
				ev.preventDefault();
				this.$router.push({
					name:'refund-add',
				})
			},
			edit(){
				if(this.editSelect == ''){
					Message({
						type:'warning',
						message:'请选择一条数据'
					})
					return
				}else{
					this.$router.push({
						name:'refund-edit',
						query:{
							id:this.editSelect,
							onlysee:false,
						}
					})
				}
			
			},
		},
		filters:{
			billstatus(val){
				switch(val){
					case '0' :
					return '未生效'
					break;
					case '1':
					return '已提交'
					break;
					case '2':
					return '已生效'
					break;
					case '3':
					return'已完成'
					break;
					case '4':
					return '已关闭'
					break;
					case '-1':
					return '作废'
					break;
				}
			},
			tofix(val){
        		if(val){
        			if(val == 0){
        				return 0
        			}else{
        				return parseInt(val).toFixed(2)
        			}
        			
        		}else if(val == 0){
        			return 0
        		}
        	},
        	intNum(val){
        		return parseInt(val)
        	}
		}
	}
</script>

<style scoped>
	.w-200{width: 200px;}
	.w-150{width: 150px;}
</style>