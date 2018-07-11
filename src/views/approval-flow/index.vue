<template>
	<div>
		<b-card>
			<div class="row">
				<div class="co-md-4 col-lg-4">
					<b-form-fieldset horizontal label="单号" label-text-align="right" :label-cols="4">
						<b-form-input placeholder="" v-model="query.orderNo" readonly/>
					</b-form-fieldset>
				</div>
				<div class="co-md-4 col-lg-4">
					<b-form-fieldset horizontal label="创建人" label-text-align="right" :label-cols="4">
						<b-form-input placeholder="" v-model="query.createByName" readonly/>
					</b-form-fieldset>
				</div>
				<div class="co-md-4 col-lg-4">
					<b-form-fieldset horizontal label="创建时间" label-text-align="right" :label-cols="4">
						<b-form-input placeholder="" v-model="query.createTimeStr" readonly/>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="co-md-4 col-lg-4">
					<b-form-fieldset horizontal label="单据类型" label-text-align="right" :label-cols="4">
						<b-form-input placeholder="" v-model="query.orderTypeName" readonly/>
					</b-form-fieldset>
				</div>
				<div class="co-md-4 col-lg-4">
					<b-form-fieldset horizontal label="提交时间" label-text-align="right" :label-cols="4">
						<b-form-input placeholder="" v-model="query.updateTimeStr" readonly/>
					</b-form-fieldset>
				</div>
				<div class="co-md-4 col-lg-4">
					<b-form-fieldset horizontal label="提交人" label-text-align="right" :label-cols="4">
						<b-form-input placeholder="" v-model="query.submitByName" readonly/>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="co-md-4 col-lg-4">
					<b-form-fieldset horizontal label="门店" label-text-align="right" :label-cols="4">
						<b-form-input placeholder="" v-model="query.storeName" readonly/>
					</b-form-fieldset>
				</div>
			</div>
		</b-card>
		<b-card>
			<div class="row">
				<div class="co-md-4 col-lg-4">
					<b-form-fieldset horizontal label="审批人类型" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.postTypeName" :readonly="noclick"></b-form-input>
					</b-form-fieldset>
				</div>
				
				
			</div>
			<div class="row">
				<div class="co-md-4 col-lg-4">
					<b-form-fieldset horizontal label="审批人" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.operatorName" readonly></b-form-input>
					</b-form-fieldset>
				</div>
<!--				<div class="co-md-4 col-lg-4">
					<b-form-fieldset horizontal label="审批时间" label-text-align="right" :label-cols="4">
						<b-form-input v-model="Submit.time" ></b-form-input>
					</b-form-fieldset>
				</div>
-->			</div>
			<div class="row">
				<div class="co-md-4 col-lg-4">
					<b-form-fieldset horizontal label="审批人意见" label-text-align="right" :label-cols="4">
					 <b-form-radio-group id="radios2" v-model="selected" name="radioSubComponent" @input="judge">
						<b-form-radio value="1" class="mt-2" :disabled="nodeStatus == '0'">同意</b-form-radio>
        				<b-form-radio value="0" class="mt-2" :disabled="nodeStatus == '1'">驳回</b-form-radio>
    				 </b-form-radio-group>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="co-md-8 col-lg-8">
					<b-form-fieldset horizontal label="反馈意见" label-text-align="right" :label-cols="2">
						<b-form-textarea :rows="3" :max-rows="3" :state="issubmit" v-model="query.remark" placeholder="请输入反馈意见" :readonly="bohui"></b-form-textarea>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="pull-right">
					<!--	<b-button size="sm" variant="default" @click="reset">取消</b-button>-->
						<b-button size="sm" variant="primary" @click="submit" v-if="nodeStatus == '-1'">确定</b-button>
					</div>
				</div>
			</div>
		</b-card>
		<div class="mb-3">
			<el-tabs type="border-card">
			  <el-tab-pane label="单据详情页">
			  	<billsDetail ref="bills">
			  	</billsDetail>
			  </el-tab-pane>
			  <el-tab-pane label="审批履历">
			  	<approvalRecord :orderNo = "orderNo" ref="WfDetailInfo"></approvalRecord>
			  </el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import api from 'common/api'
	import { getType } from 'common/api-common'
	import common from 'common/common'
	import {Tabs,TabPane} from 'element-ui'
	import billsDetail from './bills-details'
	/*import approvalRecord from './approval-record'*/
	import approvalRecord from 'components/approval-record/approval-record'
	import {Message, MessageBox} from 'element-ui'
	Vue.use(Tabs)
	Vue.use(TabPane)
	export default{
		data(){
			return{
				text:'',
				PurchaseContractWfType:'PurchaseContractWfType',
				list:[],
				orderNo:this.$route.query.orderNo,
				query:{
					orderNo:'',
					orderTypeName:'',
					createTimeStr:'',
					createByName:'',
					storeName:'',
					operatorName:'',//审批人
					submitByName:'',//提交人
					postTypeName:'',
					postName:'',
					remark:'',
					updateTimeStr:'',
				},
				Submit:{
					time:'',
				},
				approverType:[],
			
				selected:'',
				issubmit:null,
				nodeStatus:null,
				noclick:false,
				bohui:null,
				Href:'',
			}
		},
		mounted(){
			//默认页面跳转，不符合要求
			/*if(!this.$route.query.hasOwnProperty('orderNo')){
				this.$router.push({
					name:'notfile'
				})
			}else{
				this.getDetail();
			}*/
			this.getDetail();
			//this.$refs.WfDetailInfo.getInfo(this.$route.query.orderNo)
		},
		methods:{
			judge(){
				if(this.selected == '1'){
					this.issubmit =  null;
				}
			},
			//获取审批详情信息
			getDetail(){
				api.approval.getDetails({orderWfCode:this.$route.query.orderWfCode},res => {
					if(res.data.code == 'success'){
						const obj = res.data.obj;
						for(let k of Object.keys(this.query)){
							if(obj){
								this.query[k]=obj[k]
								this.query.submitByName = obj.submitPostName 	+" - "+obj.submitByName
								if(this.query.operatorName == null || this.query.operatorName ==''){
									this.query.operatorName = JSON.parse(common.getSession('userInfo')).empVo.empCnName 
								}
							}
							
						}
						this.nodeStatus = obj.nodeStatus
						this.selected = obj.nodeStatus
						//this.list = obj.orderWorkflowDetailInfoVos;
						this.noclick = true
						this.bohui = true
						if(obj.nodeStatus == '-1'){
							/*this.query.operatorName=JSON.parse(common.getSession('userInfo')).inChargePostnVo.postName + ' - '+JSON.parse(common.getSession('userInfo')).empVo.empCnName */
							//this.query.submitByName = obj.postName 	+" - "+obj.submitByName
							this.query.remark = ''
							this.bohui = false
						}
						
					}
				})
			},
			//审批提交同意接口
			agree(){
				api.approval.agree({orderNo:this.$route.query.orderNo,remark:this.query.remark},res => {
					if(res.data.code == 'success'){
						this.getDetail();
						Message({
							type:'success',
							message:'提交成功'
						})
					}
				})
			},
			//审批驳回接口
			reject(){
				api.approval.reject({orderNo:this.$route.query.orderNo,remark:this.query.remark},res => {
					if(res.data.code == 'success'){
						this.issubmit =  null;
						this.getDetail();
						Message({
							type:'success',
							message:'已驳回'
						})
					}
				})
			},
			reset(){
				
			},
			submit(){
				if(this.selected == '-1'){
					Message({
						type:'warning',
						message:'请选择审批意见'
					})
					return
				}else{
					if(this.selected == '1'){
						this.agree()
					}else if(this.selected == '0'){
						if(this.query.remark == '' || this.query.remark == null ){
							this.issubmit = false;
							return
						}
						this.reject()
					}
				}
			},
			get(){
				
				if(!this.$route.query.hasOwnProperty('orderNo')){
					
				}else{
					debugger
					console.log(window.location.href)
					this.$refs.bills.getDetal();
					this.getDetail();
					this.$refs.WfDetailInfo.getInfo(this.$route.query.orderNo);
					this.Href = window.location.href
					}
				
			},
			
		},
		components:{
			billsDetail,
			approvalRecord
		},
		watch:{
        	'$route':'get'
    		},
	}
</script>

<style>
</style>