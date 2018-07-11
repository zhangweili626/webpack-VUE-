<template>
 	<div>
		 <b-card header="员工信息">
			<b-row>
				<b-col md="6">
					<b-form-fieldset horizontal label="员工编号*" :label-cols="4" class="text-right">
						<b-form-input v-model="model.empCode" disabled :class="{'inp-invalid' : inp.empCode}"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="员工姓名*" :label-cols="4" class="text-right">
						<b-form-input v-model="model.empCnName" :class="{'inp-invalid' : inp.empCnName}" :disabled="onlySee || isHeadSave"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="员工性别*" :label-cols="4" class="text-right">
						<b-form-select :options="sexList" v-model="model.empSex" :class="{'inp-invalid' : inp.empSex}" :disabled="onlySee || isHeadSave"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="联系方式*" :label-cols="4" class="text-right">
						<b-form-input v-model="model.empMobile" :class="{'inp-invalid' : inp.empMobile}" :disabled="onlySee || isHeadSave"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="所属组织*" :label-cols="4" class="text-right">
						<org-tree @getOrgCode="getOrg" :class="{'inp-invalid' : inp.orgCode}" :params='orgParams' :disabled="onlySee || isHeadSave"></org-tree>	
						<i class="el-icon-warning text-primary staff-tooltip" v-b-tooltip.hover title="此处组织为人事组织归属!"></i>											
					</b-form-fieldset>			
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="员工类型*" :label-cols="4" class="text-right">
						<b-form-select :options="empTypeList" v-model="model.empType" :class="{'inp-invalid' : inp.empType}" :disabled="onlySee || isHeadSave"></b-form-select>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="员工状态*" :label-cols="4" class="text-right">
						<b-form-select :options="empStatusList" v-model="model.empStatusCode" :class="{'inp-invalid' : inp.empStatusCode}" :disabled="onlySee || isHeadSave"></b-form-select>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="在职情况*" :label-cols="4" class="text-right">
						<b-form-select :options="onJobList" v-model="model.onJob" :class="{'inp-invalid' : inp.onJob}" :disabled="onlySee || isHeadSave"></b-form-select>
					</b-form-fieldset>
				</b-col>
			</b-row>	
			<b-row>
				<div class="col-md-12 text-right">
					<b-button size="sm" variant="default" @click="cancel" v-show="!onlySee">返回</b-button>														
					<b-button size="sm" variant="success"  @click="eidtStaff('head')"  v-show="!onlySee && !isHeadSave && !isAdd">保存</b-button>				
					<b-button size="sm" variant="success" @click="creatStaffInfo"  v-show="isAdd && !isHeadSave">保存</b-button>				
				</div>
			</b-row>			
		</b-card>
		<b-card v-show="isHeadSave || onlySee" header="基本信息">		
			<b-row>
				<b-col md="6">
					<b-form-fieldset horizontal label="英文名称" :label-cols="4" class="text-right">
						<b-form-input v-model="model.empEnName" :disabled="onlySee"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="护照/身份证号码" :label-cols="4" class="text-right">
						<b-form-input v-model="model.empIdcard" :disabled="onlySee"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="生日" :label-cols="4" class="text-right">
						<el-date-picker
						:disabled="onlySee"
						v-model="model.empBirthday"
						type="date"
						placeholder="选择日期">
						</el-date-picker>
						
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="固定电话" :label-cols="4" class="text-right">
						<b-form-input v-model="model.empPhone" :disabled="onlySee"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="联系地址" :label-cols="4" class="text-right">
						<b-form-input v-model="model.empAddress" :disabled="onlySee"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="E-mail" :label-cols="4" class="text-right">
						<b-form-input type="email" v-model="model.empEmail" :disabled="onlySee"/>
					</b-form-fieldset>
				</b-col>
			</b-row>	
			<b-row>
				<div class="col-md-12 text-right">					
					<b-button size="sm" variant="success" @click="eidtStaff('basics')" v-show="!onlySee">保存</b-button>				
				</div>
			</b-row>	
		</b-card>
		<b-card header="账号信息" v-show="isHeadSave || onlySee">
			<b-row>
				<b-col md="6">
					<b-form-fieldset horizontal label="登录系统账号" :label-cols="4" class="text-right">
						<b-form-input v-model="model.loginName" :disabled="onlySee"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="重置登录密码" :label-cols="4" class="text-right">
						<b-button size="sm" variant="primary" class="pull-left" @click="resetPassw" :disabled="onlySee">重置</b-button>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="考勤卡卡号" :label-cols="4" class="text-right">
						<b-form-input v-model="model.empCheckinCard" :disabled="onlySee"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="外部编码" :label-cols="4" class="text-right">
						<b-form-input v-model="model.externalCode" :disabled="onlySee"/>
					</b-form-fieldset>
				</b-col>
			</b-row>	
			<b-row>
				<div class="col-md-12 text-right">					
					<b-button size="sm" variant="success" @click="eidtStaff('account')" v-show="!onlySee">保存</b-button>				
				</div>
			</b-row>	
		</b-card>
		<b-card header="头像上传" v-show="isHeadSave || onlySee">	
			<b-row>
				<b-col md="6" class="text-right tou-a">
					<p class="tou-text">上传头像</p>
					<el-upload
						class="avatar-uploader"
						accept="image/png,image/jpg,image/jpeg"
						:action="uploadUrl"
						:data="uploadParams"
						:show-file-list="false"
						:before-upload="beforeUpload"
						:on-success="handleSuccess"
						:on-error="handleErr"
						:disabled="onlySee">
						<img v-if="dataUrl" :src="dataUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</b-col>	
				<b-col md="6" class="text-left tou-info-w">
					<P>
						<span class="el-icon-warning text-warning"></span>
						只支持jpg,png格式，图片不得大于500k。
					</P>
				</b-col>							
			</b-row>
			<b-row>
				<div class="col-md-12 text-right">					
					<b-button size="sm" variant="success" @click="eidtStaff('pic')" v-show="!onlySee">保存</b-button>				
				</div>
			</b-row>		
		</b-card>
		<b-card header="附加信息"  v-show="isHeadSave || onlySee">			
			<b-row>
				<b-col md="6" v-for="(item, index) in empAddList" :key="index">
					<b-form-fieldset horizontal :label="item.refDetailName" :label-cols="4" class="text-right">
						<b-form-input v-model="item.refDetailValue" :disabled="onlySee"/>
					</b-form-fieldset>
				</b-col>
			</b-row>
			<b-row>
				<div class="col-md-12 text-right">					
					<b-button size="sm" variant="success" @click="eidtStaff('empAddInfoMaps')" v-show="!onlySee">保存</b-button>				
				</div>
			</b-row>
		</b-card>
	 </div>
</template>
<script>
	import Vue from 'vue'
	import {mapState, mapMutations, mapActions} from 'vuex'
	import {DatePicker, Message, Upload, Button, MessageBox} from 'element-ui'
	import search from 'components/iris-search/search.vue'
	import api from 'common/api'
	import config from 'common/config.js'
	import common from 'common/common.js'
	import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'
	import orgTree from './orgTree'
	import Croppa from 'vue-croppa'
	import 'vue-croppa/dist/vue-croppa.css'

	Vue.use(DatePicker);
	Vue.use(Upload);
	Vue.use(Button);
	Vue.use(Croppa);
	export default {
		components: {
			orgTree
		},
		data() {
			return {
				isHeadSave: false,
				onlySee:true,
				isAdd: false,
				isVerify: false,
				croppa:{},
				dataUrl:'',
				empTypeList: [],
				sexList:config.staff.sexList,
				onJobList:config.staff.onJobList,
				empStatusList:[],
				empAddList:[],
				orgParams:{
					orgName: ""
				},
				model:{
					id:'',
					empCode:'',
					empCnName:'',
					empSex:'',
					empMobile:'',
					orgCode:'',
					orgName:'',
					empType:'',
					empStatusCode:'',
					onJob:'',
					empEnName:'',
					empIdcard:'',
					empBirthday:'',
					empPhone:'',
					empAddress:'',
					empEmail:'',
					loginName: '',
					empCheckinCard: '',
					externalCode: '',
					empBigPic:'',
					empSmallPic:'',
					empAddInfoMaps:{},
					simpleEmpAddInfoMaps:{}
				},
				inp:{
					empCode: false,
					empCnName: false,
					empSex: false,
					empMobile: false,
					orgCode: false,
					empType: false,
					empStatusCode: false,
					onJob: false,
				},
				modelMap:{
					empCode: '编号',
					empCnName: '姓名',
					empSex: '性别',
					empMobile: '手机号',
					orgCode: '组织',
					empType: '类型',
					empStatusCode: '状态',
					onJob: '在职情况',
				},
				// 头像
				uploadUrl: config.uploadUrl,
				uploadParams: {
					relationCode: '',
					singleFlag: '0',
					businessType: ''
				},
			}
		},
		created() {
			this.getEmpType();
			this.getEmpStatus();		
			this._initData();	
		},
		watch: {
			'$route': '_initData'
		},
		methods:{
			...mapActions('staff',[
				'getStaffTablist'
			]),
			// 生成员工编号
			createEmpCode() {
				let _this = this;
				const option = {
					'serviceCode': config.staff.emp
				}
				api.ordinalInfo.getSequence(option, (res) => {
					if(res.data.code === 'success') {
						_this.model.empCode = res.data.obj;
					};
				})
				MessageBox.alert('初始密码为员工编码', '提示', {
					confirmButtonText: '关闭',
					type: 'warning'
				})
			},
			getOrg(val) {
				 this.model.orgCode = val.code;
			},
			getEmpType() {
				let _this = this;
				let param = {
					refCode: config.staff.refEmpType
				}
				api.ref.getDataDictionarys(param, (res) => {
					if (res.data.code === 'success') {
						let data = res.data.obj.referenceDetailInfos;
						let arr = [];
						if(data != null) {
							data.forEach((item, index) => {
								let obj = {
									text: item.refDetailName,
									value: item.refDetailCode
								}
								arr.push(obj)
							})
							_this.empTypeList = arr;
						}	
					}
				})
			},
			getEmpStatus() {
				let _this = this;
				let param = {
					refCode: config.staff.refEmpStatus
				}
				api.ref.getDataDictionarys(param, (res) => {
					if (res.data.code === 'success') {
						let data = res.data.obj.referenceDetailInfos;
						let arr = [];
						if(data != null) {
							data.forEach((item, index) => {
								let obj = {
									text: item.refDetailName,
									value: item.refDetailCode
								}
								arr.push(obj)
							})
							_this.empStatusList = arr;
						}	
					}
				})
			},
			getEmpAdd() {
				let _this = this;
				let param = {
					refCode: config.staff.refEmpAdd
				}
				return new Promise((resolve, reject) => {
					api.ref.getDataDictionarys(param, (res) => {
						if (res.data.code === 'success') {							
							_this.empAddList = res.data.obj.referenceDetailInfos;
							resolve();
						}
					})
				})
				
			},
			beforeUpload(file) {
				if(file.size > 570000) {
					MessageBox.alert('头像不可大于500k!', '上传失败', {
						confirmButtonText: '确定',
						type: 'warning'
					});
					return false;
				}
				
			},
			handleSuccess(file, fileList) {
				this.dataUrl = config.serviceId + file.obj[0].filePath
			},
			handleErr(file) {
				Message({
					type: "error",
					Message: "上传失败"
				});
			},
			_initData(val) {
				let _this = this;
				let param;
				let routeQuery = this.$route.query;			
				if(routeQuery.onlySee == true) {
					_this.onlySee = true;
				}else if(routeQuery.onlySee === undefined ){
					_this.onlySee = false;
					_this.isAdd = true;
				}else{
					_this.onlySee = false;
					_this.isHeadSave = false;
				}
				if(routeQuery.empCode == undefined && val == undefined) {
					_this.createEmpCode();
					_this.getEmpAdd();
					
				}else {					
					param = {
						empCode: val ? val : routeQuery.empCode
					}
					_this.getEmpAdd().then(() => {
						api.staff.getDetail(param, (res) => {
							if (res.data.code === 'success') {
								let data = res.data.obj;
								_this.orgParams.orgName = data.orgName;
								_this.uploadParams.relationCode = data.empCode;
								_this.dataUrl = data.empSmallPic;
								for(let k of Object.keys(_this.model)){								
									if(k == "simpleEmpAddInfoMaps") {
										if(data[k]) {
											_this.model[k] = data[k];
											for(let item of Object.keys(data[k])) {
												for(let i = 0; i < _this.empAddList.length; i++) {
													if(_this.empAddList[i].refDetailCode == item) {
														_this.empAddList[i].refDetailValue = data[k][item];
													}
												}												
											}
										}
									}else {
										_this.model[k] = data[k];
									}
								}
								if(_this.model.loginName === '') {
									_this.model.loginNam = _this.model.empCode;
								}
							}
						})
					})
					
				}
			},
			creatStaffInfo() {
				let _this = this;
				let param = {
					empCode: _this.model.empCode,
					empCnName: _this.model.empCnName,
					empSex: _this.model.empSex,
					empMobile: _this.model.empMobile,
					orgCode: _this.model.orgCode,
					empType: _this.model.empType,
					empStatusCode: _this.model.empStatusCode,
					onJob: _this.model.onJob,
				}
				_this.verifyTabeHead(param);
				if(!_this.isVerify) {
					return;
				}
				api.staff.creatStaff(param, (res) => {
					if (res.data.code === 'success') {
						_this.isHeadSave = true;
						_this.uploadParams.relationCode = config.staff.uploadCode+ param.empCode;
						_this._initData(param.empCode);
						Message({
							type: "success",
							message: "保存成功!"
						});
						_this.refreshTab();
					}
				})
			},
			eidtStaff(typ) {
				let param;
				let _this = this;
				if(typ === "basics") {
					param = {
						id: _this.model.id,
						empCode: _this.model.empCode,
						empEnName:_this.model.empEnName,
						empIdcard:_this.model.empIdcard,
						empBirthday:common.eleTimeFormat(_this.model.empBirthday),
						empPhone:_this.model.empPhone,
						empAddress:_this.model.empAddress,
						empEmail:_this.model.empEmail,
					};				
					// if(param.empPhone !== '' && !common.isCardNum(param.empPhone)) {
					// 	Message({ 
					// 			type: 'warning', 
					// 			message: `护照/身份证号码员工码格式不正确!`
					// 		});
					// 	return;	
					// }
					// if(param.empPhone !== '' && !common.isTel(param.empPhone)) {
					// 	Message({ 
					// 			type: 'warning', 
					// 			message: `员工电话号码格式不正确!`
					// 		});
					// 	return;	
					// }
				}else if(typ === "account") {
					param = {
						id: _this.model.id,
						empCode: _this.model.empCode,
						loginName: _this.model.loginName,
						empCheckinCard: _this.model.empCheckinCard,
						externalCode: _this.model.externalCode,
					};					
				}else if(typ === "pic") {
					param = {
						id: _this.model.id,
						empCode: _this.model.empCode,
						empBigPic: _this.dataUrl,
						empSmallPic: _this.dataUrl,
					};
				}else if(typ === "empAddInfoMaps") {
					let addlist = {};
					for(let i = 0; i < _this.empAddList.length; i++) {
						addlist[_this.empAddList[i].refDetailCode] = _this.empAddList[i].refDetailValue;
					}
					param = {
						id: _this.model.id,
						empCode: _this.model.empCode,
						simpleEmpAddInfoMaps: addlist,
					};
				}else if(typ === "head") {
					param = {
						empCode: _this.model.empCode,
						empCnName: _this.model.empCnName,
						empSex: _this.model.empSex,
						empMobile: _this.model.empMobile,
						orgCode: _this.model.orgCode,
						empType: _this.model.empType,
						empStatusCode: _this.model.empStatusCode,
						onJob: _this.model.onJob,
					}
					_this.verifyTabeHead(param);
					if(!_this.isVerify) {
						return;
					}
					param.id = _this.model.id;
				}
				
				api.staff.eidtStaff(param, (res) => {
					if (res.data.code === 'success') {
						if(typ === "head") {
							_this.isHeadSave = true;
						}
						Message({
								type: "success",
								message: "保存成功!"
							});
						_this.refreshTab();
					}
				})
			},
			resetPassw() {
				let _this = this;
				let param = {
						id: _this.model.id,
						empCode: _this.model.empCode,					
					};
				MessageBox.confirm(`确定重置密码？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {			
					api.staff.resetPassword(param, (res) => {
						if (res.data.code === 'success') {
							Message({
								type: "success",
								message: "重置密码成功!"
							});
						}
					})		
				});					
			},
			// 刷新员工查询列表
			refreshTab() {
				let param = {
					empCode: '',
					empCnName: '',
					empMobile: '',
					empSex: '',
					orgCode: '',
					empType: '',
					empStatusCode : '',
					onJob : '',
					pageNums: config.pageNums,
					pageStart: 1
				};
				this.getStaffTablist(param);
			},
			// 取消
			cancel() {
				this.$router.push({
					path : `/staff/search`
				})
			},
			verifyTabeHead(val) {
				for(let k of Object.keys(val)) {			
					if(val[k] === "") {
						// Message({ 
						// 	type: 'warning', 
						// 	message: `员工${this.modelMap[k]}不可为空!`
						// });
						this.inp[k] = true;
					}else{
						if(k === 'empMobile' && !common.isMobile(val[k])) {
							Message({ 
								type: 'warning', 
								message: `员工${this.modelMap[k]}格式不正确!`
							});							
							this.inp[k] = true;							
						}else {
							this.inp[k] = false;	
						}
					}
					
				}
				for(let k of Object.keys(this.inp)) {
					if(this.inp[k]) {
						this.isVerify = false;
						return;
					}
				}
				this.isVerify = true;
			}
		},
	}
</script>
<style>
.wd100{
		width: 100px;
}
.width-100{
	width: 100%;
}
.inp-invalid{
	border-color: #f86c6b!important;
}
.inp-invalid input{
	border: 1px solid #f86c6b;
}
.el-input.is-disabled input{
	color:#3e515b!important;
}
.creat-img{
	margin-top: 100px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader .avatar-uploader-icon{
	  line-height: 178px!important;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .tou-text{
	  margin-right: 60px
  }
  .tou-info-w{
	  padding-top: 110px;
  }
  .staff-tooltip{
	  position: absolute;
	  right: -12px;
	  top:10px;
  }
</style>
