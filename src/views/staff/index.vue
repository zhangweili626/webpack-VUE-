<template>
    <div>
        <b-card header="查询">
			<div class="row">
				 <b-col md="6">
					<b-form-fieldset horizontal label="员工编码" :label-cols="4" class="text-right">
						<b-form-input v-model="searchModel.empCode"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="员工姓名" :label-cols="4" class="text-right">
						<b-form-input v-model="searchModel.empCnName"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="联系电话" :label-cols="4" class="text-right">
						<b-form-input v-model="searchModel.empMobile"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="性别" :label-cols="4" class="text-right">
						<b-form-select v-model="searchModel.empSex" :options="sexList"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="所属组织" :label-cols="4" class="text-right">
						<org-tree @getOrgCode="getOrg" ref="orgSelect" :params="params" :orgCode="userInfo.inCharegOrgVo.orgCode"></org-tree>	
					</b-form-fieldset>					
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="类型" :label-cols="4" class="text-right">
						<b-form-select :options="empTypeList" v-model="searchModel.empType"></b-form-select>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="状态" :label-cols="4" class="text-right">
						<b-form-select :options="empStatusList" v-model="searchModel.empStatusCode"></b-form-select>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="在职情况" :label-cols="4" class="text-right">
						<b-form-select :options="onJobList" v-model="searchModel.onJob"></b-form-select>
					</b-form-fieldset>
				</b-col>
				
			</div>
			<b-row>
				<div class="col-md-12 text-right">
					<b-button size="sm" variant="default" @click="reset()">重置</b-button>
					<b-button size="sm" variant="primary" @click="staffSearch()">查询</b-button>
				</div>
			</b-row>
		</b-card>
        <b-card>
			<b-row class="mb-0">
				<div class="pull-left ml-3 mb-1">
                    <b-button size="sm" variant="success" @click="createStaff" v-if="isCreatStaff">新建</b-button>
					<b-button size="sm" variant="primary" @click="eidtStaff" v-if="isEidtStaff">编辑</b-button>
				</div>
			</b-row>
			<div class="table-scrollable">
				<b-table striped hover bordered show-empty :items="staffList" :fields="fields">
					<template slot="sel" slot-scope="data">
						<input type="radio" name="radio"  v-model="selCont" :value="data.item" :disabled="!isEidtStaff"/>
					</template>					
					<template slot="empCode" slot-scope="data">
						<a href="javascript:;" @click.prevent="detailStaff(data.value)">{{ data.value }}</a>
					</template>
					<template slot="empCnName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="empSex" slot-scope="data">
						{{ data.value | sex}}
					</template>
					<template slot="empTypeName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="empStatus" slot-scope="data">
						{{ data.value }}
					</template>
					<template slot="onJob" slot-scope="data">
						{{ data.value | obJon}}
					</template>
					<template slot="orgName" slot-scope="data">
						{{ data.value}}
					</template>
                    <template slot="empMobile" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="empIdcard" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="empty">
						暂无数据...
					</template>
				</b-table>
			</div>
			<v-pagination @page-change="staffSearch" :total-result="pages.total"
						  :page-no='pages.pageNo' :total-pages="pages.totalPages"
						  :page-size="paginationData.pageSize"></v-pagination>
		</b-card>
    </div>
</template>
<script>
    import Vue from 'vue'
	import {DatePicker, Message} from 'element-ui'
	import {mapState, mapMutations, mapActions} from 'vuex'
	import vPagination from 'components/pagination/pagination.vue'
	import api from 'common/api'
	import config from 'common/config.js'
	import common from 'common/common.js'
	import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'
	import filters from 'common/filters.js'
	import orgTree from './orgTree'

    Vue.use(DatePicker)
    export default {
        components: {
			vPagination,
			orgTree
		},
		data() {
			return {
				testData:{
					factoryCode:'CARF022238',
					factoryName: '测试1',
					brandCode:'CARB022229',
					brandName:'奥迪',
					seriesCode:'CARS022253',
					seriesName:'URV',
					modelCode:'CARM022233',
					modelName:'2.0T动感型',
					opvCode: 'CAROPV022256',
					opvName: '6.0L',
					iotypeCode: 'CARIO022226',
					iotypeName: '自然吸气'
				},
				paginationData: {
					total: 0,
					totalPages: 1,
					pageNo: 1,
					pageSize: config.pageNums
				},
				empTypeList: [],
				sexList:config.staff.sexList,
				onJobList:config.staff.onJobList,
				empStatusList:[],
				entreList: [],
				searchModel: {
					empCode: '',
					empCnName: '',
					empMobile: '',
					empSex: '',
					orgCode: '',
					empType:'',
					empStatusCode: '',
					onJob: '',
				},
				params:{
					orgName: ''
				},
				selCont:'',
                fields: {
					sel: {
						label: "选择"
					},
					empCode: {
						label: "员工编码"
					},
					empCnName: {
						label: "员工姓名"
					},
					empSex: {
						label: "性别"
					},
					empTypeName: {
						label: "类型"
					},
					empStatus: {
						label: "状态"
					},
					onJob: {
						label: "在职状况"
					},
					orgName: {
						label: "所属组织"
					},
					empMobile: {
						label: "联系电话"
					},
					empIdcard: {
						label: "身份证号码"
                    },
				},
				list:[],
				uploadList:[],		
				userInfo: '',		
            }
		},
		computed: {
			...mapState('staff',[
				'staffList',
				'searchParam',
				'pages'
			]),
			isCreatStaff(){
				return  hasBtn(collectionApi.staff.creatStaff);
			},
			isEidtStaff(){
				return  hasBtn(collectionApi.staff.eidtStaff);
			}
		},
		created(){
			this.getStoreInfoVo();
			this.getEmpType();
			this.getEmpStatus();		
		},
		methods: {
			...mapActions('staff',[
				'setTableList',
				'setSearchParam',
				'setPages',
				'getStaffTablist'
			]),
			getStoreInfoVo() {
				let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
				this.userInfo = userInfo;
				this.params.orgName = userInfo.inCharegOrgVo.orgName
				this.searchModel.orgCode = userInfo.inCharegOrgVo.orgCode
				if(userInfo == null) {
					Message({
						message: '用户信息缺失!',
						type: 'warning'
					});
					return;
				}
			},
			getOrg(val) {
				this.searchModel.orgCode = val.code;
			},
			getEmpType() {
				let _this = this;
				let params = {
					refCode: config.staff.refEmpType
				}
				api.ref.getDataDictionarys(params, (res) => {
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
			reset() {
				this.searchModel.empCode = '';
				this.searchModel.empCnName = '';
				this.searchModel.empMobile = '';
				this.searchModel.empSex = '';
				this.searchModel.orgCode = '';
				this.searchModel.empType = '';
				this.searchModel.empStatus = '';
				this.searchModel.empStatusCode = '';
				this.searchModel.onJob = '';
				this.paginationData.pageNo = 0;
				
				this.paginationData.total = 0;
				this.paginationData.totalPages = 0;
				this.params = { orgName: ''};
				this.setTableList([]);
			},
			staffSearch(pageNo) {
				let _this = this;
				 pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
				let param = {
					empCode: this.searchModel.empCode,
					empCnName: this.searchModel.empCnName,
					empMobile: this.searchModel.empMobile,
					empSex: this.searchModel.empSex,
					orgCode: this.searchModel.orgCode,
					empType: this.searchModel.empType,
					empStatusCode : this.searchModel.empStatusCode,
					onJob : this.searchModel.onJob,
					pageNums: this.paginationData.pageSize,
					pageStart: this.paginationData.pageNo
				};
				_this.getStaffTablist(param);
				// api.staff.search(param, function (result) {
				// 	let data = result.data;
				// 	if(data.code === 'success') {
				// 		_this.paginationData.total = data.obj.total;
				// 		_this.paginationData.totalPages = data.obj.pages;
				// 		_this.list = data.obj.list;
				// 		_this.setTableList(data.obj.list);
				// 		_this.setPages({
                //             pageNo: _this.paginationData.pageNo,
                //             total:  data.obj.total,
                //             totalPages: data.obj.pages
                //         });
				// 	}

				// })
			},
			eidtStaff() {
				if (!this.selCont.empCode) {
					Message({
						message: '未选择员工！',
						type: 'warning'
					});
				} else {
					this.$router.push({name: 'staffEidt', query: {empCode: this.selCont.empCode, onlySee: false}})
				}
			},
			detailStaff(val) {
				if(val) {
					this.$router.push({name: 'staffDetail', query: {empCode: val, onlySee: true}});
					return;
				}
			},
			createStaff() {
				this.$router.push({path: '/staff/add'});
			}
		},

    }
</script>
<style scoped>
.wd100{
	width: 100px;
}
</style>
