<template>
	<div>
		<b-card header="">
			<div class="row border-bottom mb-3 pl-3">
				<p class=" col-lg-5">红冲申请单：<strong class="ml-3">{{this.query.refundInvoiceOrderNo}}</strong></p>
				<p class="col-lg-3">单据状态：<span class="ml-3">{{this.query.orderStatus | billstatus}}</span></p>
				<p class="col-lg-3">创建时间：<span class="ml-3">{{this.query.createTimeStr}}</span></p>
			</div>
			<div class="row">
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="门店*" :label-cols="4" class="text-right">
						<areaqueryshop ref='areaqueryshop' @select-change="selectedfun" :readonly="show.readonly" :error="check.storeCode"></areaqueryshop>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="创建人*" :label-cols="4" class="text-right">
						<b-form-input  v-model="query.confirmOperatorName" :state="check.refundEmpCode" :readonly="show.readonly">
						</b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="流程确认人" :label-cols="4" class="text-right">
						<b-form-input  v-model="query.auditPassOperatorName" readonly>
						</b-form-input>
					</b-form-fieldset>
				</div>
					<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="红冲业务类型*" :label-cols="4" class="text-right">
						<b-form-select  v-model="query.sourceOrderTypeCode" :options="configs.orderType" @input = 'selectChange' :state="check.sourceOrderTypeCode" :disabled="show.readonly">
						</b-form-select>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="红冲发票张数" :label-cols="4" class="text-right" >
						<b-form-input  v-model="query.refundInvoiceCount" readonly >
						</b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="红冲发票金额" :label-cols="4" class="text-right">
						<b-form-input  v-model="query.refundInvoiceAmount" readonly >
						</b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="说明*" :label-cols="4" class="text-right">
						<b-form-input  v-model="query.retundReason" :state="check.retundReason" :readonly="show.readonly">
						</b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="备注" :label-cols="4" class="text-right">
						<b-form-input  v-model="query.remark" :readonly="show.readonly">
						</b-form-input>
					</b-form-fieldset>
				</div>
			</div>
			
		</b-card>
		<b-card header="退票明细">
			<div class="row mb-2">
				<div class="col-md-12 col-lg-12">
					<div class="pull-left">
						<b-button variant="success" @click="showAdd" v-if="show.add" size="sm">新增</b-button>
						<b-button variant="danger" @click="delet" v-if="show.delet" size="sm">删除</b-button>
					</div>
				</div>
			</div>
			<div class="table-scrollable">
				<b-table striped hover bordered :items="detailList" :fields="fields" show-empty empty-text="暂无数据">
					<template slot="radio" slot-scope="data">
						<input type="radio" v-model="index" :value="data.index" v-if="!isType"/>
						<input type="checkbox" v-model="checkAll" :value="data.item.sourceOrderNo" v-if="isType" @change="selectAll(data.item.sourceOrderNo)"/>
					</template>
					<template slot="refundInvoiceNo" slot-scope="data">
						<b-form-input v-model="data.item.refundInvoiceNo" onkeyup="this.value=this.value.replace(/\D/g,'')"  :readonly="show.readonly" style="color:red; width:120px;" :state="data.item.checkRefundInvoiceNo"></b-form-input>
					</template>
					<template slot="refundInvoiceTime" slot-scope="data">
						<div style="width: 140px;">
								<el-date-picker
						      		v-model="data.item.refundInvoiceTime"
							      	type="date"
							      	:class ="data.item.checkRefundInvoicetime ? 'checkred':''"
							      	:readonly="show.readonly"
							      	@input="changetime(data.index)"
							      	placeholder="选择日期时间">
							    </el-date-picker>
						</div>
					</template>
					<template slot="invoiceTimeStr" slot-scope="data">
						<div class="w-130">{{data.item.invoiceTimeStr.substring(0,10)}}</div>
					</template>
					<template slot="bankName" slot-scope="data">
						<div class="w-130">{{data.item.bankName}}</div>
					</template>
					<template slot="companyAddress" slot-scope="data">
						<div class="w-130">{{data.item.companyAddress}}</div>
					</template>
					<template slot="invoiceAmount" slot-scope="data">
						{{ data.item.invoiceAmount | tofix}}
					</template>
					<template slot="invoiceRate" slot-scope="data">
						{{data.item.invoiceRate | int}}
					</template>
				</b-table>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<div class="pull-right">
						<b-button variant="dafault" @click="cancel" v-if="show.cancel" size="sm">取消</b-button>
						<b-button variant="success" @click="add" v-if="show.save" size="sm">保存</b-button>
						<b-button variant="success" @click="edit" v-if="show.edit" size="sm">保存</b-button>
						<b-button variant="primary" v-if="show.bSubmit" @click="submit" size="sm">流程确认</b-button>
						<b-button variant="primary" v-if="show.recall" @click="undo" size="sm">撤销</b-button>
						<b-button variant="danger"  v-if="show.invalid" @click="showSureModel" size="sm">作废</b-button>
					</div>
				</div>
			</div>
		</b-card>
		<addInvoice ref="myshow" :storeCode="query.storeCode" @getDate = 'getDates' :type="query.sourceOrderTypeName" :code="query.sourceOrderTypeCode" :detailListSelect="detailListSelect"></addInvoice>
		<sureModel ref="sureModel" @sureEvent = 'invalid'></sureModel>
	</div>
</template>

<script>
import Vue from 'vue'
import api from 'common/api'
import config from 'common/config'
import{getType,getSequence} from 'common/api-common'
import addInvoice from './add-invoice'
import { MessageBox, Message,DatePicker} from 'element-ui'
import common from 'common/common.js'
import{ REFUND_INVOICE_ORDER_SEQ } from 'common/sequence'
import{ SOURCE_ORDER_TYPE } from 'common/ref-code'
import sureModel from 'components/iris-modal/index.vue'
import areaqueryshop from 'components/iris-areaqueryshop/'
Vue.use(DatePicker)
	export default{
		components:{
			addInvoice,
			areaqueryshop,
			sureModel
			
		},
		data(){
			return{
				filterAll:[],
				refDetailRemark:[],
				flag:true,
				editId:'',
				index:-1,
				checkAll:[],
				isType:false,
				detailListSelect:[],
				detailList:[],
				check:{
					storeCode:false,
					retundReason:null,
					refundEmpCode:null,
					sourceOrderTypeCode:null,
				},
				show:{
					readonly:false,
					add:true,
					delet:true,
					cancel:true,
					save:true,
					edit:false,
					bSubmit:false,
					recall:false,
					invalid:false,
				},
				configs:{
					orderType:[],
					refundEmpCode:[],
					
				},
				fields:{
					radio:{
						label:'选择'
					},
					sourceOrderTypeName:{
						label:'红冲业务类型'
					},
					sourceOrderNo:{
						label:'红冲业务单号'
					},
					refundInvoiceNo:{
						label:'红冲发票号'
					},
					refundInvoiceTime:{
						label:'红冲发票时间'
					},
					refundInvoiceBeTermNo:{
						label:'红冲账期'
					},
					invoiceNo:{
						label:'原发票号'
					},
					invoiceTimeStr:{
						label:'开票时间'
					},
					invoiceAmount:{
						label:'开票金额'
					},
					invoiceBeTermNo:{
						label:'开票账期'
					},
					invoiceRate:{
						label:'税率'
					},
					bankAccount:{
						label:'账号'
					},
					taxRegistrationNo:{
						label:'税号'
					},
					bankName:{
						label:'开户行'
					},
					companyAddress:{
						label:'地址'
					},
				},
				query:{
					storeCode:'',
					storeName:'',
					refundInvoiceOrderNo:'',
					orderStatus:'',
					createTimeStr:'',
					confirmOperatorName:'',
					auditPassOperatorName:'',
					sourceOrderTypeCode:null,
					sourceOrderTypeName:'',
					refundInvoiceAmount:0,
					refundInvoiceCount:0,
					retundReason:'',
					remark:'',
				},
			}
		},
		mounted(){
			if(!this.$route.query.hasOwnProperty('id')){
				this.query.orderStatus = 0
			}
			
		},
		created(){
			
			if(this.$route.query.hasOwnProperty('id')){
				this.getDetail()
				this.show.save = false;
				this.show.edit = true;
				this.show.invalid = true;
			}else{
				//获取红冲单号
				getSequence(REFUND_INVOICE_ORDER_SEQ,res => {
					this.query.refundInvoiceOrderNo = res
				})
				//获取创建人
				this.query.confirmOperatorName = JSON.parse(common.getSession('userInfo')).empVo.empCnName
			}
			
			//数字字典取值
			getType(SOURCE_ORDER_TYPE,res=>{
				res.forEach( item =>{
					this.configs.orderType.push({
						value:item.refDetailCode,
						text:item.refDetailName,
					})
					this.refDetailRemark.push({
						refDetailCode:item.refDetailCode,
						refDetailName:item.refDetailName,
						isFullRefund:JSON.parse(item.refDetailRemark).isFullRefund
					})
				})
					
			
			})
			console.log(4444)
			console.log(this.query.storeCode)
		},
		methods:{
			//卡、券全选
			selectAll(data){
				 this.filterAll = this.detailList.filter(v=> v.sourceOrderNo != data);
			},
			//取消
			cancel(){
				this.$router.push({
					name:'refund-query'
				})
			},
			submit(){
				if(this.detailList.length == 0){
					Message({
							type:'warning',
							message:'明细不能为空',
						})
					return
				}
				api.refund.submitRefund({'refundInvoiceOrderNo':this.query.refundInvoiceOrderNo},res =>{
					if(res.data.code == 'success'){
						this.getDetail();
						Message({
							message:'提交流程成功',
							type:'success',
						})
					}
				})
			},
			undo(){
				api.refund.withdrawRefund({'refundInvoiceOrderNo':this.query.refundInvoiceOrderNo},res =>{
					if(res.data.code == 'success'){
						this.getDetail();
						Message({
							message:'撤销成功',
							type:'success',
						})
					}
				})
			},
			showSureModel(){
				this.$refs.sureModel.showDeleteModel();
			},
			invalid(){
				api.refund.cancelRefund({'refundInvoiceOrderNo':this.query.refundInvoiceOrderNo},res =>{
					if(res.data.code == 'success'){
						this.getDetail();
						Message({
							message:'作废成功',
							type:'success',
						})
						this.cancel();
					}
				})
			},
			changetime(index){
				this.detailList[index].refundInvoiceTime = common.eleTimeFormat(this.detailList[index].refundInvoiceTime)
			},
			//获取红冲单号
			showAdd(){
				if(this.query.sourceOrderTypeCode == null){
					this.check.sourceOrderTypeCode = false
				}
				if(this.query.storeCode ==''){
					this.check.storeCode = true
				}
				if(this.query.storeCode =='' || this.query.sourceOrderTypeCode == null ){
					return
				}
				this.$refs.myshow.show();
				this.detailListSelect =[];
				this.detailList.forEach(item =>{
					this.detailListSelect.push(item.invoiceNo)
				})
			},
			getDates(data){
				//this.detailList = [this.detailList, ...data];
				this.checkAll = []
				this.query.refundInvoiceAmount = 0;
				this.detailList.push(...data)
				this.query.refundInvoiceCount = this.detailList.length;
				this.detailList.forEach(item =>{
					this.query.refundInvoiceAmount +=  item.invoiceAmount
				})
				
			},
			selectChange(){
				this.configs.orderType.forEach(item =>{
					if(this.query.sourceOrderTypeCode == item.value){
						this.query.sourceOrderTypeName = item.text
					}
				})
				//判断是卡、券类型还是其他类型,新增逻辑
				const index = this.refDetailRemark.findIndex(v=> v.refDetailCode==this.query.sourceOrderTypeCode)
				if(this.refDetailRemark[index].isFullRefund == '1'){
					//是卡、券类型
					this.isType = true
					
				}else{
					this.isType = false
				}
				if(this.detailList.length && this.flag){
					MessageBox.confirm('此操作将删除退票明细列表，是否继续','提示',{
						confirmButtonText:'确定',
						cancelButtonText:'取消',
						type:'warning',
					}).then(()=>{
						//删除接口
						const option = []
						/*this.detailList.forEach(item =>{
							if(item.id){
								item.isDelet = 1
								option.push(item)
							}
						})*/
						this.detailList = []
				
					}).catch(()=>{
						Message({
							message:'已取消操作',
							type:'info'
						})
					})
				}
			  this.flag = true
			},
			add(){
				debugger
				const {retundReason,sourceOrderTypeCode,storeCode} = this.query;
				if(storeCode ==''){
					this.check.storeCode = true
					return
				}
				if(sourceOrderTypeCode == null){
					this.check.sourceOrderTypeCode = false
					return 
				}
				if(retundReason == ''){
					this.check.retundReason = false
					return 
				}
				this.checkDetail();
				const index =  this.detailList.findIndex(v => v.checkRefundInvoiceNo == false)
				const index2 =  this.detailList.findIndex(v => v.checkRefundInvoiceTime == false)
			    if(index != -1){
			    	return
			    	
			    } else if(index2 != -1){
			    	return
			    }
				if(this.$route.query.hasOwnProperty('id')){
					this.query.id = this.$route.query.id
				}else{
					this.query.id = this.editId
				}
				Object.assign(this.query,{refundInvoiceDetailList:this.detailList})
				api.refund.insertRefund(this.query,res => {
					if(res.data.code == 'success'){
						this.editId = res.data.obj.id
						this.query.createTimeStr = res.data.obj.createTimeStr;
						this.check.refundEmpCode = null;
						this.check.retundReason = null;
						this.check.sourceOrderTypeCode = null;
						this.check.storeCode = false
						//按钮显示状态
						this.show.save = false;
						this.show.edit = true;
						this.show.bSubmit= true;
						this.show.invalid = true;
						/*this.getDetail();*/
						Message({
							type:'success',
							message:'新增退票单成功'
						})
					}
				})
				
			
			},
			//校验红冲单号,红冲时间不能为空
			checkDetail(){
				
				this.detailList.forEach((item,index) => {
					debugger
					if(item.refundInvoiceNo == ''){
						item.checkRefundInvoiceNo = false
					}else{
						item.checkRefundInvoiceNo = true
					}
					if(item.refundInvoiceTime == ''){
						item.checkRefundInvoicetime = true
					}else{
						item.checkRefundInvoicetime = false
					}
				})
				
			},
			edit(){
				this.checkDetail();
				const index =  this.detailList.findIndex(v => v.checkRefundInvoiceNo == false)
				const index2 =  this.detailList.findIndex(v => v.checkRefundInvoicetime == true)
			    if(index != -1){
			    	return
			    	
			    } else if(index2 != -1){
			    	return
			    }
				
				if(this.$route.query.hasOwnProperty('id')){
					this.query.id = this.$route.query.id
				}else{
					this.query.id = this.editId
				}
				
				Object.assign(this.query,{refundInvoiceDetailList:this.detailList})
				api.refund.updateRefund(this.query,res => {
					if(res.data.code == 'success'){
						/*this.getDetail();
						this.query.createTimeStr=res.data.obj.updateTimeStr*/
						this.getDetail()
						Message({
							type:'success',
							message:'保存成功',
						})
					}
				})
			},
			//删除明细
			delet(){
				if(this.isType){
					if(!this.checkAll.length){
						Message({
						type:'warning',
						message:'请选择数据',
						})
						return
					}else{
						this.detailList = this.filterAll
					}
					
				}else{
					//不是卡、券类型的删除
					if(this.index < 0){
					Message({
						type:'warning',
						message:'请选择数据',
					})
					return
					}else{  
						this.detailList.splice(this.index,1)
						console.log(this.detailList)
						this.index = -1;
					}
				}
				
			},
			//获取明细
			getDetail(){
				this.flag=false
				if(this.$route.query.hasOwnProperty('id')){
					this.query.id = this.$route.query.id
				}else{
					this.query.id = this.editId
				}
				api.refund.queryRefund({id:this.query.id},(res)=>{
					if(res.data.code == 'success'){
						for(let k of Object.keys(this.query)){
							this.query[k]=res.data.obj[k]
						}
						this.query.refundInvoiceAmount = this.query.refundInvoiceAmount.toFixed(2)
						this.$refs.areaqueryshop.setselect({text:res.data.obj.storeName,value:res.data.obj.storeCode})
						this.detailList = res.data.obj.refundInvoiceDetailList
						this.btnStatus(this.query.orderStatus)
						if(this.detailList.length == 0){
							this.show.bSubmit = false
						}
						//判断是不是详情页
						if(this.$route.query.hasOwnProperty('refundInvoiceOrderNo')){
							 this.show.cancel = true
							this.show.readonly = true
							this.show.add = this.show.delet = false
						     this.show.save = this.show.edit = this.show.bSubmit = this.show.recall= this.show.invalid = false
						}
						
					}
				})
			},
			//选择门店关联创建人
			selectedfun(data,data1){
				if(Array.isArray(data1)){
					/*this.query.storeCodes = [];
					for(let i= 1;i<data1.length;i++){
						this.query.storeCodes.push(data1[i].value)
					}*/
				}else{
					this.query.storeCode = data1.value
					this.query.storeName = data1.text
			
				}
			},
			//根据状态判断按钮显示
		    btnStatus(num){
    			switch (num){
					case 0:
					//未生效
					this.show.readonly = false
				    this.show.bSubmit = this.show.invalid = true
				    this.show.recall=false
				    this.show.edit =  this.show.add = this.show.delet= true
				    
					  break;
					case 1:
					//已提交
					this.show.readonly = true
					this.show.add = this.show.delet = false
				   this.show.save = this.show.edit = this.show.bSubmit = this.show.invalid = false
				    this.show.recall= true
				     this.show.cancel = true
				     
					  break;
				  	case 2:
				  		this.show.readonly = true
					this.show.add = this.show.delet = false
				   this.show.save = this.show.edit = this.show.bSubmit = this.show.invalid = false
				    this.show.recall= false
				     this.show.cancel = true
					  break;
					case 3:
					  break;
					case -1:
					//做废
					 this.show.cancel = true
					this.show.readonly = true
					this.show.add = this.show.delet = false
				     this.show.save = this.show.edit = this.show.bSubmit = this.show.recall= this.show.invalid = false
					  break;
					};
        		
		    	
		    },
		    //设置只读
		    setOnlySee(){
	    	 	this.show.cancel = false
				this.show.readonly = true
				this.show.add = this.show.delet = false
		     	this.show.save = this.show.edit = this.show.bSubmit = this.show.recall= this.show.invalid = false
		    },
		    setValue(data){
		    	this.flag = false
		    	for(let k of Object.keys(this.query)){
							this.query[k]=data[k]
						}
					this.query.refundInvoiceAmount = this.query.refundInvoiceAmount.toFixed(2)
					this.$refs.areaqueryshop.setselect({text:data.storeName,value:data.storeCode})
					this.detailList = data.refundInvoiceDetailList
		    },
		},
		watch:{
		},
		filters:{
			billstatus(val){
				switch(val){
					case 0 :
					return '未生效'
					break;
					case 1:
					return '已提交'
					break;
					case 2:
					return '已生效'
					break;
					case 3:
					return'已完成'
					break;
					case 4:
					return '已关闭'
					break;
					case -1:
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
        	int(val){
        		return val*100+'%'
        	}
		}
	}
</script>

<style scoped>
	.border-bottom{
		border-bottom:1px solid #ddd
	}
	.w-130{width:130px;}
	.checkred{border:1px solid red}
</style>