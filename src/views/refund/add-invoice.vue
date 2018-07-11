<template>
	<div>
		<b-modal ref="myModal"
			id="addInvoice"
			ok-title='添加'
			cancel-title="取消"
			hide-footer
			@ok="add()"
			@show="clearData"
			title="可选发票">
			<div class="row">
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="选择查询类型" label-text-align="right" :label-cols="4">
						<b-form-select :options="configs.type" v-model="configs.selectType"  :disabled="isdisabled" @change="selectChange"></b-form-select>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
					<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="业务单类型" label-text-align="right" :label-cols="4">
						<b-form-input v-model="type"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4" v-if="configs.selectType == 1">
					<b-form-fieldset horizontal label="业务单据号*" label-text-align="right" :label-cols="4">
						<b-form-input  :state="check.sourceOrderNo" v-model="query.sourceOrderNo"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4" v-if="configs.selectType == 2">
					<b-form-fieldset horizontal label="发票号*" label-text-align="right" :label-cols="4">
						<b-form-input  :state="check.invoiceNo" v-model="query.invoiceNo"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<div class="pull-right">
						<b-button @click="reset" size="sm">重置</b-button>
						<b-button variant="primary" @click="getquery" size="sm">查询</b-button>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 col-lg-12">
					<div class="pull-left">
						<b-button variant="primary" @click="add" size="sm">选择</b-button>
					</div>
				</div>
			</div>
			<div class="table-scrollable">
				<b-table striped hover bordered :fields="field" :items="list" show-empty empty-text="暂无数据" >
					<template slot="radio" slot-scope="data">
						<input type="checkbox" v-model="checkSelcet" :value="data.item.id" v-if="!isType" :disabled="data.item.disabled"/>
						<input type="checkbox" v-model="checksSelcet" :value="data.item.sourceOrderNo" v-if="isType" @change="checkChange(data.item.sourceOrderNo)" :disabled="data.item.disabled" :check="allCheck"/>
					</template>
					<template slot="invoiceAmount" slot-scope="data">
						{{data.item.invoiceAmount | tofix}}
					</template>
					<template slot="invoiceRate" slot-scope="data">
						{{data.item.invoiceRate | int}}
					</template>
					<template slot="invoiceTimeStr" slot-scope="data">
						{{data.item.invoiceTimeStr.substring(0,10)}}
					</template>
				</b-table>
			</div>
			
			
		</b-modal>
	</div>
</template>

<script>
	import api from 'common/api'
	import{getType} from 'common/api-common'
	import{ SOURCE_ORDER_TYPE } from 'common/ref-code'
	export default{
		created(){
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
			
			
			
		},
		props:['detailListSelect','type','code','storeCode'],
		data(){
			return{
				isdisabled:false,
				isType:false,
				filterAll:[],
				allCheck:false,
				refDetailRemark:[],
				configs:{
					orderType:[],
					type:[{
						value:1,
						text:'根据业务单查询'
					},{
						value:2,
						text:'根据发票号查询'
					}],
					selectType:'1',
				},
				checkSelcet:[],
				checksSelcet:[],
				check:{
					sourceOrderNo:null,
					invoiceNo:null,
				},
				query:{
					sourceOrderTypeCode:null,
					sourceOrderNo:'',
					invoiceNo:'',
					storeCode:this.storeCode,
				},
				list:[],
				checkArr:[],
				field:{
					radio:{
						label:'选择'
					},
					sourceOrderTypeName:{
						label:'业务单类型'
					},
					sourceOrderNo:{
						label:'业务单据号'
					},
					invoiceNo:{
						label:'发票号'
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
					
				}
			}
		},
		methods:{
			checkChange(data){
				console.log(data)
				
				 //this.filterAll = this.detailList.filter(v=> v.refundInvoiceNo != data);
			},
			selectChange(){
				this.query.sourceOrderNo = '';
				this.query.invoiceNo='';
			},
			reset(){
				for(let k of Object.keys(this.query)){
					this.query[k]=''
				}
			},
			getquery(){
				this.list = [];
				this.checkSelcet = []
				if(this.configs.selectType == '1'){
					if(this.query.sourceOrderNo == ''){
						this.check.sourceOrderNo = false
						return
					}
					
					
				}else{
					if(this.query.invoiceNo==''){
						this.check.invoiceNo = false
						return
					}
				}
				this.query.storeCode = this.storeCode
				this.configs.orderType.forEach(item =>{
					if(this.type == item.text){
						this.query.sourceOrderTypeCode = item.value
					}
				})
				api.refund.chooseRefund(this.query,res =>{
					if(res.data.code == 'success'){
						this.check.sourceOrderNo = null
						this.check.invoiceNo = null
						this.list = res.data.obj
						this.list.forEach(item =>{
							item.disabled = false
						})
						const Index = this.refDetailRemark.findIndex(v=>v.refDetailName == this.type )
						if(this.refDetailRemark[Index].isFullRefund == '1'){
						  	//针对卡、券相关的类型。默认全选
						  	this.isdisabled =  true
						  	this.isType = true
						  	if(this.list.length){
								if(this.detailListSelect.length){
									this.detailListSelect.forEach(item => {
										const index =  this.list.findIndex(v => v.invoiceNo == item)
										if(index != -1){
											this.list[index].disabled = true
										}
									})
									this.allCheck = false
								}else{
									this.list.forEach(item =>{
										this.checkSelcet.push(item.id)
									})
								}
							}
						  
						  	//
						}else{
							this.isdisabled =  false
							this.isType = false
							//不针对卡、券相关的类型
							if(this.list.length){
							if(this.detailListSelect.length){
								this.detailListSelect.forEach(item => {
									const index =  this.list.findIndex(v => v.invoiceNo == item)
									if(index != -1){
										this.list[index].disabled = true
									}
									
								})
							}
							}
						}
						
						
					
					}
				})
			},
			add(){
				this.checkArr = [];
				if(this.isType){
				debugger
					this.list.forEach((item,i)=>{
						if(item.sourceOrderNo == this.checksSelcet[0]){
							 this.filterDate(i)
						}
					   
					})
				}else{
						this.checkSelcet.forEach((item) => {
							const index = this.list.findIndex(v => v.id == item);
							let arrList =  this.list[index];
							this.filterDate(index)
						})
				}
				this.$emit('getDate',this.checkArr);
				this.list = [];
				this.$refs.myModal.hide();
			},
			filterDate(index){
					if( index != -1){
								/*const {
								sourceOrderNo,
								sourceOrderTypeName,
								invoiceNo,
								invoiceTimeStr,
								invoiceBeTermNo,
								invoiceAmount,
								invoiceRate,
								bankAccount,
								taxRegistrationNo,
								bankName,
								companyAddress,
								companyPhoneNumber,
								id
							   } =  this.list[index];*/
								this.checkArr.push({
									id:this.list[index].id,
									sourceOrderNo:this.list[index].sourceOrderNo,
									sourceOrderTypeName:this.list[index].sourceOrderTypeName,
									invoiceNo:this.list[index].invoiceNo,
									invoiceTimeStr:this.list[index].invoiceTimeStr,
									invoiceBeTermNo:this.list[index].invoiceBeTermNo,
									invoiceAmount:this.list[index].invoiceAmount,
									invoiceRate:this.list[index].invoiceRate,
									bankAccount:this.list[index].bankAccount,
									taxRegistrationNo:this.list[index].taxRegistrationNo,
									bankName:this.list[index].bankName,
									companyAddress:this.list[index].companyAddress,
									companyPhoneNumber:this.list[index].companyPhoneNumber,
									checkRefundInvoiceNo:null,
									checkRefundInvoicetime:false,
									refundInvoiceNo:'',
									refundInvoiceTime:'',
									
								})
					}
			},
			show(){
				this.$refs.myModal.show();
			},
			clearData(){
				debugger
				const Index = this.refDetailRemark.findIndex(v=>v.refDetailName == this.type )
				if(this.refDetailRemark[Index].isFullRefund == '1'){
				  	//针对卡、券相关的类型。默认全选
				  	this.isdisabled =  true
				  	this.configs.selectType = '1'
				}else{
					this.isdisabled =  false
				}
				this.checkSelcet = [];
				this.checksSelcet = [];
				this.list =[]
				this.query.sourceOrderNo = '';
				this.query.invoiceNo='';
			},
		},
		filters:{
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

<style>
	#addInvoice .modal-dialog{
		min-width: 1200px !important;
	}
</style>