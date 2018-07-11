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
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="收货人*" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.receiverName" :state="check.receiverName"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="手机*" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.receiverMobilePhone" :state="check.receiverMobilePhone"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="电话" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.receiverPhone"></b-form-input>
					</b-form-fieldset>
				</div>
			    <div class="col-md-12 col-lg-12">
			    	<chinaArea 
			    		ref="chinaArea"
			    		:star='true'
			    		@getprovinceCode="getprovinceCode"
			    		@getdistrictCode="getdistrictCode"
			    		@getcityCode="getcityCode">
			    	</chinaArea>
			    </div>
				<div class="col-md-8 col-lg-8">
					<b-form-fieldset horizontal label="街道地址*" label-text-align="right" :label-cols="2">
						<b-form-input v-model="query.address" :state="check.address"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4 ">
					<div class="pull-right">
						<b-form-checkbox  v-model="query.isDefault"  value="1"
                        unchecked-value="0">设置默认地址</b-form-checkbox>
					</div>
					
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
	Vue.use(DatePicker)
	export default{
		props:['list','isedit','customCode'],
		mounted(){
		},
		data(){
			return{
				check:{
					receiverName:null,
					address:null,
					receiverMobilePhone:null,
				},
				selected:'',
				title:'新增收货地址',
				query:{
					/*customCode:this.customCode,*/
					receiverCode:'',
					receiverName:'',
					address:'',
					receiverPhone:'',
					receiverMobilePhone:'',
					provinceCode:'',
					cityCode:'',
					districtCode:'',
					isDefault:0,
				}
			}
		},
		components:{
			chinaArea
		},
		methods:{
			cancel(){
				this.$refs.chinaArea.setValue({})
			    this.$emit('getAddressList','')
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
					this.title="编辑收货地址";
					for(let k of Object.keys(this.query)){
						this.query[k] = this.list[k]
					}
					this.query.id = this.list.id 
					this.$refs.chinaArea.setValue(this.query)
				}else{
					for(let k of Object.keys(this.query)){
						this.query[k]=''
					}
					this.title="新增收货地址";
				}
				this.query.customCode = this.customCode
			},
			show(){
				this.$refs.addressModel.show()
			},
			hide(){
				this.$refs.addressModel.hide()
			},
			ok(ev){
			   ev.preventDefault()
			   if (!this.query.receiverName) {
                    this.check.receiverName = 'invalid'
                }
                if (!this.query.address) {
                    this.check.address = 'invalid'
                }
                if (!this.query.receiverMobilePhone) {
                    this.check.receiverMobilePhone = 'invalid'
                }
             	if(!this.query.provinceCode){
             		this.$refs.chinaArea.setProvinceState(false)
             	}
             	if(!this.query.cityCode){
             		this.$refs.chinaArea.setCityState(false)
             	}
             	if(!this.query.districtCode){
             		this.$refs.chinaArea.setDistrictState(false)
             	}
                if (!this.query.receiverName || !this.query.address || !this.query.receiverMobilePhone || !this.query.provinceCode || !this.query.cityCode || !this.query.districtCode) {
                    return
                }
				if(this.isedit){
					this.edit()
				}else{
					this.getSequence().then(()=>{
						debugger
						console.log(this.query)
						delete this.query.id
						api.mancar.insertReceiverInfo(this.query,res=>{
							if(res.data.code == 'success'){
								Message({
									type:'success',
									message:'新建地址成功',
								})
								this.check={
									receiverName:null,
									address:null,
									receiverMobilePhone:null,
								}
								/*this.$refs.chinaArea.setProvinceState(null)
								this.$refs.chinaArea.setCityState(null)
								this.$refs.chinaArea.setDistrictState(null)*/
								this.$emit('getAddressList','')
							}
						})
				})
				}
				this.$refs.addressModel.hide();
			},
			getSequence(){
	    		return new Promise((resolve,reject)=>{
	    			getSequence('CUSRECEIVER',res=>{
	    				this.query.receiverCode = res
	    				resolve();
	    			})
	    		})
	    	},
	    	edit(){
	    		//编辑接口
	    			api.mancar.updateReceiverInfo(this.query,res=>{
						if(res.data.code == 'success'){
							Message({
								type:'success',
								message:'编辑地址成功',
							})
							this.$emit('getAddressList','')
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