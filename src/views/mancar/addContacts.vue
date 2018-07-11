<template>
	<div>
		<b-modal ref="contactsModel"
			 id="contactsModel" 
			 :title="title"
		  	 @ok="ok" 
		  	 @shown="showModel"
		  	  @hide="cancel"
		  	 @cancel="cancel"
		  	 ok-title="确定"
		  	 cancel-title="取消"
			>
			<div class="row">
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="联系人姓名*" label-text-align="right" :label-cols="5">
						<b-form-input v-model="query.contactName" :state="check.contactName"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="邮箱" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.email"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="生日" label-text-align="right" :label-cols="4">
						<el-date-picker
					      v-model="query.birthday"
					      type="date"
					      placeholder="选择日期">
					    </el-date-picker>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="传真" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.faxNumber"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="性别" label-text-align="right" :label-cols="4">
						<b-form-select v-model="query.gender" :options="configs.gender"></b-form-select>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="证件类型" label-text-align="right" :label-cols="4">
						<b-form-select v-model="query.idType" :options="idType"></b-form-select>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="手机号码*" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.mobilePhone" :state="check.mobilePhone"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="证件号码" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.idNo"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="电话" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.phone"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-12 col-lg-12">
					<chinaArea 
						ref="chinaArea"
			    		@getprovinceCode="getprovinceCode"
			    		@getdistrictCode="getdistrictCode"
			    		@getcityCode="getcityCode">
			    	</chinaArea>
				</div>
				<div class="col-md-8 col-lg-8">
					<b-form-fieldset horizontal label="街道地址" label-text-align="right" :label-cols="2">
						<b-form-input v-model="query.address"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="邮编" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.postalCode"></b-form-input>
					</b-form-fieldset>
				</div>
				
			</div>
		</b-modal>
	</div>
</template>

<script>
	import Vue from 'vue'
	import chinaArea from './area'
	import {getType,getSequence} from 'common/api-common.js'
	import { MessageBox, Message,DatePicker} from 'element-ui'
	import api from 'common/api'
	import common from 'common/common.js'
	Vue.use(DatePicker)
	export default{
		components:{
			chinaArea,
		},
		props:['list','isedit','customCode'],
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
		data(){
			return{
				configs:{
					gender:[                           //联系人性别
				            {
				                text: '男',
				                value: '1',
				            },
				            {
				                text: '女',
				                value: '0',
				            },
				        ],
					
				},
				title:'新增联系人',
				query:{
						contactName:"",
						address:"",
						birthday:"",
						faxNumber:"",
						email:"",
						gender:"",
						idType:'',
						idNo:"",
						mobilePhone:"",
						phone:"",
						postalCode:"",
						countyCode:"",
						contactCode:"CUSCONTACT2000046",
						customCode:this.customCode,
						provinceCode:'',
						cityCode:'',
						districtCode:'',
				},
				idType:[],
				check:{
					contactName:null,
					mobilePhone:null,
				}
			}
		},
		methods:{
			cancel(){
				this.$refs.chinaArea.setValue({})
			  	this.$emit('getContact','')
				this.$emit('modifyEdit',false)
			},
			//获取省的code
			getprovinceCode(data){
				this.query.provinceCode = data
			},
			//获取市的code
			getcityCode(data){
				this.query.cityCode = data
			},
			//获取区的code
			getdistrictCode(data){
				if(data!= undefined){
					this.query.districtCode = data
				}
			},
			showModel(){
				if(this.isedit){
					this.title="编辑联系人";
					/*this.query = this.list*/
					for(let k of Object.keys(this.query)){
						this.query[k]= this.list[k]
					}
					this.$refs.chinaArea.setValue(this.query)
				}else{
					for(let k of Object.keys(this.query)){
						this.query[k]=''
					}
					this.title="新增联系人";
				}
				this.query.customCode = this.customCode
			},
			show(){
				this.$refs.contactsModel.show()
			},
			hide(){
				this.$refs.contactsModel.hide()
			},
			ok(ev){
				ev.preventDefault()
			   if (!this.query.contactName) {
                    this.check.contactName = 'invalid'
                }
                if (!this.query.mobilePhone) {
                    this.check.mobilePhone = 'invalid'
                }
                if(!this.query.contactName || !this.query.mobilePhone ){
                	return
                }
				if(this.isedit){
					this.edit()
				}else{
					this.getSequence().then(()=>{
						delete this.query.id
						this.query.birthday= common.eleTimeFormat(this.query.birthday)
						api.mancar.insertContactInfo(this.query,res=>{
							if(res.data.code == 'success'){
								Message({
									type:'success',
									message:'新建联系人成功',
								})
								this.check.contactName = null
								this.check.mobilePhone = null
								this.$emit('getContact')
							}
							this.$refs.contactsModel.hide()
						})
				})
				}
		
				
			},
			
	    	getSequence(){
	    		return new Promise((resolve,reject)=>{
	    			getSequence('CUSCONTACT',res=>{
	    				this.query.contactCode = res
	    				resolve();
	    			})
	    		})
	    	},
	    	edit(){
	    		//编辑接口
	    		    this.query.id = this.list.id;
	    		    this.query.birthday= common.eleTimeFormat(this.query.birthday)
	    			api.mancar.updateContactInfo(this.query,res=>{
						if(res.data.code == 'success'){
							Message({
								type:'success',
								message:'编辑联系人成功',
							})
							this.$emit('getContact')
							this.$emit('modifyEdit',false)
							this.$refs.contactsModel.hide()
						}
					})
	    	},
	    	
	    	
	    	
    	
		}
	}
</script>

<style>
	#contactsModel .modal-dialog{
		min-width: 800px !important;
	}
</style>