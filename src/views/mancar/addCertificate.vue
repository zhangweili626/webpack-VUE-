<template>
	<div>
		<b-modal ref="addressModel"
			 id="addressModel" 
			 :title="title"
			 @shown="showModel"
		  	 @ok="ok" 
		  	  @hide="cancel"
		  	 @cancel="cancel"
		  	 ok-title="确定"
		  	 cancel-title="取消"
			>
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="证件号码*" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.certificateNumber" :state="check.certificateNumber"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="证件类型*" label-text-align="right" :label-cols="4">
						<b-form-select v-model="query.certificateType" :state="check.certificateType" :options="idType"></b-form-select>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="初次领证日期" label-text-align="right" :label-cols="4">
						<el-date-picker
					      v-model="query.firstGetDate"
					      type="date"
					      placeholder="选择日期">
					    </el-date-picker>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="证件期起始日期" label-text-align="right" :label-cols="4">
						<el-date-picker
					      v-model="query.startDate"
					      type="date"
					      placeholder="选择日期">
					    </el-date-picker>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="证件到期日期" label-text-align="right" :label-cols="4">
						<el-date-picker
					      v-model="query.expireDate"
					      type="date"
					      placeholder="选择日期">
					    </el-date-picker>
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
	Vue.use(DatePicker)
	import common from 'common/common.js'
	import api from 'common/api'
	export default{
		mounted(){
				//证件类型
			getType('CertificateType',res=>{
				res.forEach(item=>{
					this.idType.push({
						text:item.refDetailName,
						value:item.refDetailCode
					})
			    })
			})
			
		},
		props:['isedit','customCode','certificateCode'],
		data(){
			return{
				idType:[],
				check:{
					receiverName:null,
					address:null,
					receiverMobilePhone:null,
				},
				title:'新增证件类型',
				query:{
					certificateCode:'',
					certificateNumber:'',
					certificateType:'',
					customCode:this.customCode,
					firstGetDate:'',
					expireDate:'',
					startDate:''
				},
				check:{
					certificateNumber:null,
					certificateType:null,
				},
			}
		},
		methods:{
			cancel(){
			  this.$emit('getCF')
				this.$emit('modifyEdit',false)
			},
			showModel(){
				if(this.isedit){
					this.title="编辑证件类型";
					this.queryCertificateTypeInfoByCode();
				
				}else{
					for(let k of Object.keys(this.query)){
						this.query[k]=''
					}
					this.title="新增证件类型";
				}
				this.query.customCode = this.customCode
			},
			show(){
				this.$refs.addressModel.show()
			},
			hide(){
				this.$refs.addressModel.hide()
			},
			queryCertificateTypeInfoByCode(){
				api.mancar.queryCertificateTypeInfoByCode({certificateCode:this.certificateCode},res=>{
					if(res.data.code =='success'){
						for(let k of Object.keys(this.query)){
							this.query[k]= res.data.obj[k]
						}
						this.query.id = res.data.obj.id
					}
				})
			},
			ok(ev){
			   ev.preventDefault()
			   if (!this.query.certificateNumber) {
                    this.check.certificateNumber = 'invalid'
                }
                if (!this.query.certificateType) {
                    this.check.certificateType = 'invalid'
                }
                if (!this.query.certificateNumber || !this.query.certificateType) {
                    return
                }
				if(this.isedit){
					this.edit()
				}else{
					this.getSequence().then(()=>{
						delete this.query.id
						this.query.firstGetDate= common.eleTimeFormat(this.query.firstGetDate)
						this.query.expireDate= common.eleTimeFormat(this.query.expireDate)
						this.query.startDate= common.eleTimeFormat(this.query.startDate)
						api.mancar.insertcertificateTypeInfo(this.query,res=>{
							if(res.data.code == 'success'){
								Message({
									type:'success',
									message:'新建证件成功',
								})
								this.check={
									receiverName:null,
									address:null,
									receiverMobilePhone:null,
								}
								this.$emit('getCF')
							}
						})
				})
				}
				this.$refs.addressModel.hide();
			},
			getSequence(){
	    		return new Promise((resolve,reject)=>{
	    			getSequence('CUSIDTYPE',res=>{
	    				this.query.certificateCode = res
	    				resolve();
	    			})
	    		})
	    	},
	    	edit(){
	    		//编辑接口
	    		    this.query.firstGetDate= common.eleTimeFormat(this.query.firstGetDate)
					this.query.expireDate= common.eleTimeFormat(this.query.expireDate)
					this.query.startDate= common.eleTimeFormat(this.query.startDate)
	    			api.mancar.updatecertificateTypeInfo(this.query,res=>{
						if(res.data.code == 'success'){
							Message({
								type:'success',
								message:'编辑证件成功',
							})
							this.$emit('getCF')
							this.$emit('modifyEdit',false)
						}
					})
	    	}
		}
	}
</script>

<style>
	#addressModel .modal-dialog{
		min-width: 800px !important;
	}
</style>