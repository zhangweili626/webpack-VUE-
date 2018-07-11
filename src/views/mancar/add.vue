<template>
	<div>
		<b-card header="基本信息">
			<div class="row">
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="客户编号" label-text-align="right" :label-cols="4">
						<b-form-input  v-model="query.customCode" disabled=""></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="客户类型" label-text-align="right" :label-cols="4">
						<b-form-select :options="configs.customType" v-model="query.customType"></b-form-select>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="客户来源*" label-text-align="right" :label-cols="4">
						<b-form-select :options="configs.customSource"  :state="check.customSource" v-model="query.customSource"></b-form-select>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="客户分群*" label-text-align="right" :label-cols="4">
						<b-form-select :options="configs.customGroup" :state="check.customGroup" v-model="query.customGroup"></b-form-select>
					</b-form-fieldset>
				</div>
			</div>
		</b-card>
		<b-card header="主要联系人信息">
			<div class="row">
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="真实姓名*" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.customName" :state="check.customName"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="固定电话" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.customPhone" ></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="移动电话*" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.mobilePhone" :state="check.mobilePhone" ></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="性别" label-text-align="right" :label-cols="4">
						<b-form-select v-model="query.gender" :options="configs.gender"></b-form-select>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="证件类型" label-text-align="right" :label-cols="4">
						<b-form-select v-model="query.idType"  :options="configs.idType"></b-form-select>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="证件号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.idNo" ></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-12 col-lg-12">
					<chinaArea 
						ref="chinaArea"
						@getprovinceCode="getprovinceCode"
			    		@getdistrictCode="getdistrictCode"
			    		@getcityCode="getcityCode">
					</chinaArea>
				</div class="col-md-4 col-lg-4">
				<div class="col-md-8 col-lg-8">
					<b-form-fieldset horizontal label="详细地址" label-text-align="right" :label-cols="2">
						<b-form-input v-model="query.address"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="生日" label-text-align="right" :label-cols="4">
						<!--<b-form-select v-model="query.birthday" ></b-form-select>-->
						<el-date-picker
					      v-model="query.birthday"
					      type="date"
					      placeholder="选择日期">
					    </el-date-picker>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="邮箱" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.email" ></b-form-input>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 col-lg-12">
					<div class="pull-right">
						<b-button size="sm" @click="cancel">取消</b-button>
						<b-button size="sm" variant="primary" @click="save" v-if="show.add">保存</b-button>
						<b-button size="sm" variant="primary" @click="edit" v-if="show.edit">保存</b-button>
					</div>
				</div>
			</div>
		</b-card>
		<b-card no-body v-show="isAddCustom">
			<b-tabs card>
				<b-tab title="财务信息" active>
					<div class="row">
						<div class="col-md-12 col-lg-12">
							<b-button size="sm" variant="success" @click="showFinancial">新增</b-button>
							<b-button size="sm" variant="danger" @click="deletFinancial">删除</b-button>
							<b-button size="sm" variant="primary" @click="editFinancial">编辑</b-button>
						</div>
					</div>
					<div class="table-scrollable">
						<b-table striped hover bordered :items="table.financialList" :fields="table.financialField" show-empty empty-text="暂无数据">
							<template slot="radiow" slot-scope="data">
								<div @click="checksFinancial(data.item)">
									<input type="radio" v-model="selectedFinancial" :value="data.item.id" />
								</div>
							</template>
						</b-table>
					</div>
					<div class="row">
						<div class="col-md-12">
							<pagination class="pull-right" 
								@page-change="finChange" 
								:page-no="page.finPage.pageNo" 
								:page-size="page.finPage.pageSize" 
								:total-result="page.finPage.total" 
								:total-pages="page.finPage.totalPages">
							</pagination>
						</div>
					</div>
				</b-tab>
				<b-tab title="车辆信息">
					<div class="row">
						<div class="col-md-12 col-lg-12">
							<b-button size="sm" variant="success" @click="showAddCar">新增</b-button>
							<b-button size="sm" variant="danger" @click="deletCustomVe">删除</b-button>
							<b-button size="sm" variant="primary" @click="editCustomVe">编辑</b-button>
						</div>
					</div>
					<div class="table-scrollable">
						<b-table striped hover bordered :items="table.customVeList" :fields="table.carField"show-empty empty-text="暂无数据">
							<template slot="radio" slot-scope="data">
								<div @click="checksCustomVe(data.item)">
									<input type="radio" v-model="selectedCustomVe" :value="data.item.vehicleCode" />
								</div>
							</template>
							<template slot="show_details" slot-scope="row">
								<a @click.stop="row.toggleDetails">显示明细</a>
							</template>
							<template slot="row-details" slot-scope="row">
		                        <div class="tableIntable">
		                        	<table style="width: 100%;">
		                        		<tr>
		                        			<th v-for="item in row.item.customVehicleAddInfoVos">{{item.addName}}</th>
		                        		</tr>
		                        		<tr>
		                        			<td v-for="item in row.item.customVehicleAddInfoVos">
		                        			{{ item.addValue}}
		                        			</td>
		                        		</tr>
		                        	</table>
		                        </div> 
		                    </template>
						</b-table>
					</div>
					<div class="row">
						<div class="col-md-12">
							<pagination class="pull-right" 
								@page-change="carInfoChange" 
								:page-no="page.carInfo.pageNo" 
								:page-size="page.carInfo.pageSize" 
								:total-result="page.carInfo.total" 
								:total-pages="page.carInfo.totalPages">
							</pagination>
						</div>
					</div>
				</b-tab>
				<b-tab title="地址信息">
					<div class="row">
						<div class="col-md-12 col-lg-12">
							<b-button size="sm" variant="success" @click="showAdress">新增</b-button>
							<b-button size="sm" variant="danger" @click="deletAddress">删除</b-button>
							<b-button size="sm" variant="primary" @click="editAddress">编辑</b-button>
						</div>
					</div>
					<div class="table-scrollable">
						<b-table striped hover bordered :items="table.addressList" :fields="table.addressField" show-empty empty-text="暂无数据">
							<template slot="countyCode"  slot-scope="data">
								{{data.item.provinceName + data.item.cityName + data.item.districtName}}
							</template>
							<template slot="radio" slot-scope="data">
								<div @click="checksAddress(data.item)">
									<input type="radio" v-model="selectedAddress" :value="data.item.id" />
								</div>
							</template>
							<template slot="isDefault" slot-scope="data">
								<i class="el-icon-circle-check iconGreen ml-4 fs20" v-if="data.item.isDefault =='1'"></i>
							</template>
						</b-table>
					</div>
					<div class="row">
						<div class="col-md-12">
							<pagination class="pull-right" 
								@page-change="addressChange" 
								:page-no="page.addressPage.pageNum" 
								:page-size="page.addressPage.pageSize" 
								:total-result="page.addressPage.total" 
								:total-pages="page.addressPage.totalPages">
							</pagination>
						</div>
					</div>
				</b-tab>
				<b-tab title="联系人信息">
					<div class="row">
						<div class="col-md-12 col-lg-12">
							<b-button size="sm" variant="success" @click="showContact">新增</b-button>
							<b-button size="sm" variant="danger" @click="deletContact">删除</b-button>
							<b-button size="sm" variant="primary" @click="editContact">编辑</b-button>
						</div>
					</div>
					<div class="table-scrollable">
						<b-table striped hover bordered :items="table.contactsList" :fields="table.contactsField"show-empty empty-text="暂无数据">
							<template slot="radio" slot-scope="data">
								<div @click="checks(data.item)">
									<input type="radio" v-model="selected" :value="data.item.id"/>
								</div>
							</template>
							<template slot="address" slot-scope="data">
								{{data.item.provinceName + data.item.cityName + data.item.districtName + data.item.address}}
							</template>
						</b-table>
					</div>
			 		<div class="row">
						<div class="col-md-12">
							<pagination class="pull-right" 
								@page-change="COMPageChange" 
								:page-no="page.contactsPage.pageNo" 
								:page-size="page.contactsPage.pageSize" 
								:total-result="page.contactsPage.total" 
								:total-pages="page.contactsPage.totalPages">
							</pagination>
						</div>
					</div>
				</b-tab>
				<b-tab title="证件信息">
						<div class="row">
						<div class="col-md-12 col-lg-12">
							<b-button size="sm" variant="success" @click="showCF">新增</b-button>
							<b-button size="sm" variant="danger" @click="deletCF">删除</b-button>
							<b-button size="sm" variant="primary" @click="editCF">编辑</b-button>
						</div>
					</div>
					<div class="table-scrollable">
						<b-table striped hover bordered :items="table.certiFicateList" :fields="table.certiFicate"show-empty empty-text="暂无数据">
							<template slot="radio" slot-scope="data">
								<div @click="checksCF(data.item)">
									<input type="radio" v-model="selectedCF" :value="data.item.certificateCode"/>
								</div>
							</template>
							<template slot="address" slot-scope="data">
								{{data.item.provinceName + data.item.cityName + data.item.districtName + data.item.address}}
							</template>
							<template slot="expireDate" slot-scope="data">
								{{ getDateText(data.item.startDate,data.item.expireDate) }}
							</template>
							<!--<template slot="expireDate" slot-scope="data">
								{{data.item.startDate == null? '': data.item.startDate +' - '+ data.item.expireDate}}
							</template>-->
						</b-table>
					</div>
						<div class="row">
						<div class="col-md-12">
							<pagination class="pull-right" 
								@page-change="CFPageChange" 
								:page-no="page.CFPage.pageNo" 
								:page-size="page.CFPage.pageSize" 
								:total-result="page.CFPage.total" 
								:total-pages="page.CFPage.totalPages">
							</pagination>
						</div>
					</div>
				</b-tab>
			</b-tabs>
		</b-card>
		<!--添加地址信息-->
		<addAdress ref="addAdress" 
			:customCode="query.customCode"
			 @getAddressList = 'getAddressList' 
			 :list="delet.addressList" 
			 :isedit="isEdit" 
			 @modifyEdit="modifyEdit">
		</addAdress>
		<!--添加财务信息-->
		<addFinancial ref="addFinancial" 
			:customCode="query.customCode"
			 @getFinanceList = 'getFinanceList' 
			 :list="delet.financialList" 
			 :isedit="isEdit" 
			 @modifyEdit="modifyEdit">
		</addFinancial>
		<!--添加联系人-->
		<addContact ref="addContact" 
			@getContact = 'getContact'
			:customCode="query.customCode"
			 :list="delet.contactsList" 
			 :isedit="isEdit"
			  @modifyEdit="modifyEdit">
		</addContact>
		<!--添加车辆信息-->
		<addCarInfo ref="addCar" 
			:customCode="query.customCode"
			:isedit="isEdit"
			:vehicleCode="selectedCustomVe"
			:list="delet.customVelList" 
			:customVehicleAddInfoVos="delet.customVelList.customVehicleAddInfoVos"
			@modifyEdit="modifyEdit"
			@getCarList="getCarList">
		</addCarInfo>
		<!--添加证件类型-->
		<addCertificate ref="addCertificate"
			@getCF="getCF"
			:certificateCode="selectedCF"
			 :isedit="isEdit"
			@modifyEdit="modifyEdit"
			:customCode="query.customCode">
		</addCertificate>
	</div>
</template>

<script>
import Vue from 'vue'
import {getType,getSequence} from 'common/api-common.js'
import api from 'common/api'
import config from 'common/config.js'
import common from 'common/common.js'
import { MessageBox, Message,DatePicker} from 'element-ui'
import chinaArea from 'views/mancar/area'
Vue.use(DatePicker)
import addAdress from 'views/mancar/addAdress.vue'
import addContact from 'views/mancar/addContacts.vue'
import addFinancial from 'views/mancar/addFinancial.vue'
import addCarInfo from 'views/mancar/addCarInfo.vue'
import addCertificate from './addCertificate.vue'
import pagination from 'components/pagination/pagination.vue'
export default{
	components:{
		chinaArea,
		addAdress,
		addContact,
		addFinancial,
		addCarInfo,
		addCertificate,
		pagination,
	},
	mounted(){
	
		//客户类型
		getType('CustomType',res=>{
			res.forEach(item=>{
				this.configs.customType.push({
					text:item.refDetailName,
					value:item.refDetailCode
				})
			})
			
		})
		//客户编号
		if(!this.$route.query.hasOwnProperty('customCode')){
			getSequence('CUSTOM',res=>{
				this.query.customCode =  res
			})
		}
		
		//客户来源
		getType('CustomSourceType',res=>{
			res.forEach(item=>{
				this.configs.customSource.push({
					text:item.refDetailName,
					value:item.refDetailCode
				})
			})
			
		})
		//客户群体
		getType('CustomGroupType',res=>{
			res.forEach(item=>{
				this.configs.customGroup.push({
					text:item.refDetailName,
					value:item.refDetailCode
				})
		    })
		})
	
		//证件类型
		getType('CertificateType',res=>{
			res.forEach(item=>{
				this.configs.idType.push({
					text:item.refDetailName,
					value:item.refDetailCode
				})
		    })
		})
		//判断是否编辑页，是编辑执行下面的操作
		if(this.$route.query.hasOwnProperty('customCode')){
			this.show.edit = true;
			this.show.add= false;
			this.isAddCustom = true;
			this.getInfo();
			this.queryContactInfo();//获取联系人信息
			this.getAddressList();//获取收货地址信息
			this.getFinanceList();//获取财务信息
			this.getCarInfo();//获取车辆信息
			this.getCF();//获取证件类型
		}
	},
	data(){
		return{
			customCode:'',
			show:{
				add:true,
				edit:false,
			},
			isEdit:false,
			isAddCustom:false,
			selected:'',
			selectedAddress:'',
			selectedFinancial:'',
			selectedCustomVe:'',
			selectedCF:'',
			configs:{
				customType:[],
				customSource:[],
				customGroup:[],
				idType:[],
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
			table:{
				carList:[],
				addressList:[],
				contactsList:[],
				financialList:[],
				customVeList:[],
				certiFicateList:[],
				financialField:{
					radiow:{
						label:'选择',
					},
					bankAccount:{
						label:'银行账号',
					},
					bankName:{
						label:'开户行名称（全称）',
					},
					settlementName:{
						label:'结算类型',
					},
					
				},
				carField:{
					radio:{
						label:'选择',
					},
					plateNumber:{
						label:'车牌',
					},
					plateNumberTmp:{
						label:'临时牌照',
					},
					vinCode:{
						label:'VIN码',
					},
					factoryName:{
						label:'厂家',
					},
					brandName:{
						label:'品牌',
					},
					seriesName:{
						label:'车系',
					},
					modelName:{
						label:'车型',
					},
					opvName:{
						label:'排量',
					},
					iotypeName:{
						label:'进气方式',
					},
					show_details:{
						label:'操作',
					},
				},
				addressField:{
					radio:{
						label:'选择',
					},
					receiverName:{
						label:'收货人姓名',
					},
					countyCode:{
						label:'所在地区',
					},
					address:{
						label:'街道地址',
					},
/*					postalCode:{
						label:'邮编',
					},
*/					receiverMobilePhone:{
						label:'手机',
					},
					receiverPhone:{
						label:'电话',
					},
					isDefault:{
						label:'是否默认',
					},
				},
				contactsField:{
					radio:{
						label:'选择',
					},
					contactName:{
						label:'联系人姓名',
					},
					mobilePhone:{
						label:'手机号',
					},
					address:{
						label:'联系地址',
					},
					idNo:{
						label:'证件号码',
					},
					email:{
						label:'邮箱',
					},
				},
				certiFicate:{
					radio:{
						label:'选择',
					},
					certificateNumber:{
						label:'证件号码',
					},
					certificateTypeName:{
						label:'证件类型',
					},
					expireDate:{
						label:'证件有效期'
					},
					firstGetDate:{
						label:'初次领证日期'
					},
				},
			},
			query:{
				customCode:'',
				customType:'',
				customSource:'',
				customGroup:'',
				customName:'',
				customPhone:'',
				mobilePhone:'',
				gender:'',
				idType:'',
				idNo:'',
				birthday:'',
				email:'',
				address:'',
				provinceCode:'',
				cityCode:'',
				districtCode:'',
				
			},
			check:{
				customSource:null,
				customGroup:null,
				mobilePhone:null,
				customName:null,
				
			},
			delet:{
				contactsList:{},
				addressList:{},
				financialList:{},
				customVelList:{},
				certiFicateList:{},
			},
			page:{
				addressPage:{},
				finPage:{},
				contactsPage:{},
				carInfo:{},
				CFPage:{},
			},
		}
	},
	methods:{
		//证件日期组合
		getDateText(val,val2){
			if(val == null && val2 == null){
				return ''
			}
			else{
				if(val == null){
					val = ''
				}
				if(val2 == null){
					val2 = ''
				}
				return val + ' - '+ val2
			}
			
		},
		//获取证件类型列表
		getCF(num = 1){
			const option ={
					customCode:this.query.customCode,
	    			pageNums:config.pageNums,
					pageStart:num,
			}
			api.mancar.querycertificateTypeInfo(option,res=>{
				if(res.data.code == 'success'){
					const obj = res.data.obj
					this.table.certiFicateList = res.data.obj.list
					this.page.CFPage = {
						pageNo:obj.pageNum,
				        pageSize:config.pageNums,
				        total:obj.total,
				        totalPages:obj.pages,
					}
					this.selectedCF =''
				}
			})
		},
		confirmAlert(title, handOk = () => {}) {
            MessageBox.confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
            	handOk()
            }).catch(() => {
            	
            })
        },
		cancel(){
			this.$router.push({
				path:'/mancar/query'
			})
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
			this.query.districtCode = data
		},
		//查看列表扩展信息
		queryDetailList(){
			 row.toggleDetails();
		},
		carInfoChange(num){
			this.getCarInfo(num)
		},
		//联系人页码切换
		COMPageChange(num){
			this.queryContactInfo(num)
		},
		CFPageChange(num){
			this.getCF(num)
		},
		addressChange(num){
			this.getAddressList(num)
		},
		finChange(num){
			this.getFinanceList(num)
		},
		//显示添加车辆弹层
		showAddCar(){
			this.isEdit = false
			this.$refs.addCar.show();
		},
		showFinancial(){
			this.$refs.addFinancial.show();
			this.customCode =  this.query.customCode
		},
		//获取收货信息列表
		getAddressList(num=1){
			const option ={
					customCode:this.query.customCode,
	    			pageNums:config.pageNums,
					pageStart:num,
			}
			api.mancar.queryReceiverInfo(option,res=>{
				if(res.data.code == 'success'){
					const obj = res.data.obj
					this.table.addressList = res.data.obj.list
					this.page.addressPage = {
						pageNo:obj.pageNum,
				        pageSize:config.pageNums,
				        total:obj.total,
				        totalPages:obj.pages,
					}
				}
			})
		},
		getCarList(){
			
			this.getCarInfo();
		},
		//查询车辆信息
		getCarInfo(num=1){
			this.selectedCustomVe = ''
			const option ={
				customCode:this.query.customCode,
    			pageNums:config.pageNums,
				pageStart:num,
			}
			api.mancar.queryCustomVehicleInfos(option,res=>{
				if(res.data.code == 'success'){
					const obj = res.data.obj
					this.table.customVeList = res.data.obj.list;
					this.page.carInfo = {
						pageNo:obj.pageNum,
				        pageSize:config.pageNums,
				        total:obj.total,
				        totalPages:obj.pages,
					}
				}
			})
		},
		//获取财务信息
		getFinanceList(num=1){
			this.selectedFinancial = '';
			const option ={
					customCode:this.query.customCode,
	    			pageNums:config.pageNums,
					pageStart:num,
			}
			api.mancar.queryFinanceInfo(option,res=>{
				if(res.data.code == 'success'){
					const obj = res.data.obj
					this.table.financialList = res.data.obj.list;
					this.page.finPage = {
						pageNo:obj.pageNum,
				        pageSize:config.pageNums,
				        total:obj.total,
				        totalPages:obj.pages,
					}
				}
			})
		},
		checks(data){
			this.delet.contactsList =  data
		},
		checksAddress(data){
			this.delet.addressList =  data
		},
		checksFinancial(data){
			this.delet.financialList =  data
		},
		checksCustomVe(data){
			this.delet.customVelList =  data
		},
		checksCF(data){
			this.delet.certiFicateList =  data
		},
		//公共返回提示信息
		returnMess(){
			Message({
				type:'warning',
				message:'请选择一条数据'
			})
		},
		//删除联系人信息
		deletContact(){
			if(this.selected == ''){
					this.returnMess();
					return
				}
			this.confirmAlert('确定要删除吗？',()=>{
				this.delet.contactsList.isDeleted = 1;
				api.mancar.updateContactInfo(this.delet.contactsList,res=>{
					if(res.data.code == 'success'){
						this.selected ='';
						Message({
						type:'success',
						message:'删除成功'
						})
						this.queryContactInfo();
					}
				})
			})
				
		},
		//删除证件类型
		deletCF(){
			if(this.selectedCF == ''){
					this.returnMess();
					return
				}
			   this.confirmAlert('确定要删除吗',()=>{
			   		this.delet.certiFicateList.isDeleted = 1;
					api.mancar.updatecertificateTypeInfo(this.delet.certiFicateList,res=>{
						if(res.data.code == 'success'){
							this.selectedCF ='';
							Message({
							type:'success',
							message:'删除成功'
							})
							this.getCF(1);
						}
					})
			   })
		},
		//删除收货地址
		deletAddress(){
			if(this.selectedAddress == ''){
					this.returnMess();
					return
				}
			   this.confirmAlert('确定要删除吗',()=>{
			   		this.delet.addressList.isDeleted = 1;
					api.mancar.updateReceiverInfo(this.delet.addressList,res=>{
						if(res.data.code == 'success'){
							this.selectedAddress ='';
							Message({
							type:'success',
							message:'删除成功'
							})
							this.getAddressList(1);
						}
					})
			   })
				
		},
		//删除车辆信息
		deletCustomVe(){
			if(this.selectedCustomVe == ''){
					this.returnMess();
					return
				}
			 this.confirmAlert('确定要删除吗',()=>{
				this.delet.customVelList.isDeleted = 1;
				api.mancar.updateCustomVehicleInfo(this.delet.customVelList,res=>{
					if(res.data.code == 'success'){
						this.selectedCustomVe ='';
						Message({
						type:'success',
						message:'删除成功'
						})
						this.getCarInfo();
					}
				})
		 	})
		},
		//删除财务信息
		deletFinancial(){
			if(this.selectedFinancial == ''){
					this.returnMess();
					return
				}
			 this.confirmAlert('确定要删除吗',()=>{
				this.delet.financialList.isDeleted = 1;
				api.mancar.updateFinanceInfo(this.delet.financialList,res=>{
					if(res.data.code == 'success'){
						this.selectedFinancial ='';
						Message({
						type:'success',
						message:'删除成功'
						})
						this.getFinanceList();
					}
			})
		})
	}, 
	   //编辑证件类型
	   editCF(){
	   		if(this.selectedCF == ''){
					this.returnMess();
					return
			}
			this.isEdit = true;
			this.$refs.addCertificate.show();
	   },
		//编辑联系人
		editContact(){
			if(this.selected == ''){
					this.returnMess();
					return
			}
			this.isEdit = true;
			this.$refs.addContact.show();
			
		},
		//编辑车辆信息
		editCustomVe(){
			if(this.selectedCustomVe == ''){
					this.returnMess();
					return
			}
			this.isEdit = true;
			this.$refs.addCar.show();
			
		},
		//编辑收货地址
		editAddress(){
			if(this.selectedAddress == ''){
					this.returnMess();
					return
			}
			this.isEdit = true;
			this.$refs.addAdress.show();
			
		},
		//编辑财务信息
		editFinancial(){
			if(this.selectedFinancial == ''){
					this.returnMess();
					return
			}
			this.isEdit = true;
			this.$refs.addFinancial.show();
			
		},
		//获取联系人
		getContact(data){
			this.queryContactInfo();
			//this.table.contactsList = data
		},
		modifyEdit(data){
			this.selected ='';
			this.selectedAddress ='';
			this.selectedCustomVe = '';
			this.isEdit = data;
		},
		//查询联系人
		queryContactInfo(num=1){
	    		const option={
	    			customCode:this.query.customCode,
	    			pageNums:config.pageNums,
					pageStart:num,
	    		}
	    		api.mancar.queryContactInfo(option,res=>{
	    			if(res.data.code == 'success'){
	    				let obj = res.data.obj
	    				this.table.contactsList = obj.list
	    				this.page.contactsPage = {
								pageNo:obj.pageNum,
						        pageSize:config.pageNums,
						        total:obj.total,
						        totalPages:obj.pages,
							}
	    			}
	    		})
	    },
		//保存客户
		save(){
	            this.checkCustom()
	            if (!this.query.customSource || !this.query.customName || !this.query.customGroup || !this.query.mobilePhone) {
                    return
                }
                this.query.birthday= common.eleTimeFormat(this.query.birthday)
                api.mancar.insertCustomInfo(this.query, (msg) => {
                    if (msg.data.code === 'success') {
                    	this.isAddCustom = true
                        Message({
                            message:"保存成功",
                            type: "success"
                        })
                        this.show.add = false
                        this.show.edit =  true
                          this.check.customName = this.check.mobilePhone=this.check.customGroup = this.check.customSource = null
                    } else if (msg.data.code === 'fail' && msg.data.message === '系统中已存在相同的手机号码') {
                        Message({
                            message: "系统中已存在相同的手机号码",
                            type: "error"
                        })
                    }
                })
		},
		//客户主档必填校验
		checkCustom(){
			if (!this.query.customSource) {
                    this.check.customSource = 'invalid'
                }
                if (!this.query.customGroup) {
                    this.check.customGroup = 'invalid'
                }
                if (!this.query.mobilePhone) {
                    this.check.mobilePhone = 'invalid'
                }
                if (!this.query.customName) {
                    this.check.customName = 'invalid'
                }
		},
		//编辑客户信息
		edit(){
		  	this.checkCustom()
		    if (!this.query.customSource || !this.query.customName || !this.query.customGroup || !this.query.mobilePhone) {
                return
            }
		    this.query.birthday= common.eleTimeFormat(this.query.birthday)
		    console.log(this.query)
			api.mancar.updateCustomInfo(this.query,res=>{
				if (res.data.code === 'success'){
					this.getInfo();
					Message({
                            message:"编辑成功",
                            type: "success"
                        })
					  this.check.customName = this.check.mobilePhone=this.check.customGroup = this.check.customSource = null  
					 
				}
			})
		},
		showAdress(){
			this.$refs.addAdress.show();
			this.customCode =  this.query.customCode
		},
		showCF(){
			this.$refs.addCertificate.show();
			this.customCode =  this.query.customCode
		},
		showContact(){
			this.$refs.addContact.show();
			this.customCode =  this.query.customCode
		},
		//获取客户主档信息
		getInfo(){
			if(!this.$route.query.hasOwnProperty('customCode')){
				this.query.customCode = this.query.customCode
			}else{
				this.query.customCode = this.$route.query.customCode
			}
			api.mancar.customInfo({customCode:this.query.customCode},res=>{
				if(res.data.code == 'success'){
					for(let k of Object.keys(this.query)){
						this.query[k] = res.data.obj[k]
					}
					this.query.id= res.data.obj.id
					this.$refs.chinaArea.setValue(this.query)
				}
			})
		}
	}
}
</script>

<style scoped>
.iconGreen{
	color: #5EB870;
}
 .tableIntable {
        background-color: #ddd;
        width: 100%;
        margin: 0 auto;
    }
    .tableIntable{
            display: table;
            border-spacing: 0px !important;
            border: 0 !important;
    }
    .tableIntable td {
        border: 0 !important;
    }
    .tableIntable  th {
        border: 0 !important;
    }
    .tableIntable tr {
        background-color: #edf1f7 !important;
        border-bottom: 0px solid #888;
    }
    .b-table-details td {
        background-color: #edf1f7 !important;
    }
    /*#c2cfd6*/
</style> 