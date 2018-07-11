<template>
	<div>
		<b-modal ref="financeModel"
			 id="financeModel" 
			 :title="title"
			 @shown="showModel"
		  	 @ok="ok" 
		  	 @hide="cancel"
		  	 @cancel="cancel"
		  	 ok-title="确定"
		  	 cancel-title="取消"
			>
			<div class="row">
						<div class="col-md-4 col-lg-4">
							<b-form-fieldset horizontal label="结算方式" label-text-align="right" :label-cols="4">
								<b-form-select :options="configs.settlement" v-model="finance.settlement"></b-form-select>
							</b-form-fieldset>
						</div>
						<div class="col-md-4 col-lg-4">
							<b-form-fieldset horizontal label="发票类型" label-text-align="right" :label-cols="4">
								<b-form-select :options="configs.invoiceType"  v-model="finance.invoiceType"></b-form-select>
							</b-form-fieldset>
						</div>
						<div class="col-md-4 col-lg-4">
							<b-form-fieldset horizontal label="发票抬头" label-text-align="right" :label-cols="4">
								<b-form-input  v-model="finance.invoiceTitle"></b-form-input>
							</b-form-fieldset>
						</div>
						<div class="col-md-4 col-lg-4">
							<b-form-fieldset horizontal label="开户行全称" label-text-align="right" :label-cols="4">
								<b-form-input  v-model="finance.bankName"></b-form-input>
							</b-form-fieldset>
						</div>
						<div class="col-md-4 col-lg-4">
							<b-form-fieldset horizontal label="银行账号" label-text-align="right" :label-cols="4">
								<b-form-input v-model="finance.bankAccount" ></b-form-input>
							</b-form-fieldset>
						</div>
						<div class="col-md-4 col-lg-4">
							<b-form-fieldset horizontal label="信用额度" label-text-align="right" :label-cols="4">
								<b-form-input type="number" v-model="finance.creditLine" ></b-form-input>
							</b-form-fieldset>
						</div>
						<div class="col-md-4 col-lg-4">
							<b-form-fieldset horizontal label="账期" label-text-align="right" :label-cols="4">
								<b-form-input type="number" v-model="finance.accountPeriod"></b-form-input>
							</b-form-fieldset>
						</div>
						<div class="col-md-4 col-lg-4">
							<b-form-fieldset horizontal label="可逾越天数" label-text-align="right" :label-cols="4">
								<b-form-input type="number" v-model="finance.overdueDays" ></b-form-input>
							</b-form-fieldset>
						</div>
					</div>
		</b-modal>
	</div>
</template>

<script>
	import Vue from 'vue'
	import {getType,getSequence} from 'common/api-common.js'
	import { MessageBox, Message,DatePicker} from 'element-ui'
	import api from 'common/api'
	Vue.use(DatePicker)
	export default{
		props:['list','isedit','customCode'],
		mounted(){
			//结算方式
			getType('SettlementType',res=>{
				res.forEach(item=>{
					this.configs.settlement.push({
						text:item.refDetailName,
						value:item.refDetailCode
					})
			    })
			})
			//发票类型
			getType('InvoiceType',res=>{
				res.forEach(item=>{
					this.configs.invoiceType.push({
						text:item.refDetailName,
						value:item.refDetailCode
					})
			    })
			})
		},
		data(){
			return{
				selected:'',
				title:'新增财务信息',
				configs:{
					settlement:[],
					invoiceType:[],
				},
				finance:{
					invoiceType:'',
					invoiceTitle:'',
					settlement:'',
					bankAccount:'',
					bankName:'',
					creditLine:'',
					accountPeriod:'',
					overdueDays:'',
					
				},//财务信息
			}
		},
		components:{
		},
		methods:{
			cancel(){
				this.$emit('getFinanceList','')
				this.$emit('modifyEdit',false)
			},
			showModel(){
				//debugger
				/*console.log(this.customCode)
				this.finance.customCode = this.customCode*/
				if(this.isedit){
					this.title="编辑财务信息";
					this.finance = this.list
				}else{
					for(let k of Object.keys(this.finance)){
						this.finance[k]=''
					}
					this.title="新增财务信息";
				}
				this.finance.customCode = this.customCode
			},
			show(){
				this.$refs.financeModel.show()
			},
			hide(){
				this.$refs.financeModel.hide()
			},
			ok(){
				if(this.isedit){
					this.edit()
				}else{
					this.getSequence().then(()=>{
						api.mancar.insertFinanceInfo(this.finance,res=>{
							if(res.data.code == 'success'){
								Message({
									type:'success',
									message:'新建财务信息成功',
								})
								this.$emit('getFinanceList','')
							}
						})
				})
				}
			},
			getSequence(){
	    		return new Promise((resolve,reject)=>{
	    			getSequence('CUSFIN',res=>{
	    				this.finance.financeCode = res
	    				resolve();
	    			})
	    		})
	    	},
	    	edit(){
	    		//编辑接口
	    			api.mancar.updateFinanceInfo(this.finance,res=>{
						if(res.data.code == 'success'){
							Message({
								type:'success',
								message:'编辑财务信息成功',
							})
							this.$emit('getFinanceList','')
							this.$emit('modifyEdit',false)
						}
					})
	    	}
		}
	}
</script>

<style>
	#financeModel .modal-dialog{
		min-width: 800px !important;
	}
</style>