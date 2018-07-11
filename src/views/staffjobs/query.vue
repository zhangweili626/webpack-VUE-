<template>
    <div class="row">
        <div class="col-md-12">
            <b-card>
                <div slot="header">
                    <strong>查询</strong>
                </div>
                <div class="row">
                	 <div class="col-md-4">
                        <b-form-fieldset horizontal label="员工姓名" :label-cols="4" class="text-right">
                            <b-form-input  v-model="queryParams.name" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 " style="position: relative;">
                        <b-form-fieldset horizontal label="所属组织" :label-cols="4" class="text-right">
                            <tree @getOrgCode="getOrg" ref="orgSelect" :params="params" :orgCode="userInfo.inCharegOrgVo.orgCode"></tree>
                        </b-form-fieldset>
                        <div class=" tips ml-3">
<!-- 							 <el-tooltip placement="top" effect="light">
	                            <div slot="content">所属组织为人事归属组织</div>
	                            <i class="tipsImportant">i</i>
                        	</el-tooltip> -->
                    	</div>
                    </div>
                    
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="员工性别" :label-cols="4" class="text-right">
                            <b-form-select v-model="queryParams.sex" :options="optations.sex">
                            </b-form-select>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="员工类型" :label-cols="4" class="text-right">
                            <b-form-select v-model="queryParams.Type" :options="optations.type">
                            </b-form-select>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="员工状态" :label-cols="4" class="text-right">
                            <b-form-select v-model="queryParams.status" :options="optations.status">
                            </b-form-select>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="在职情况" :label-cols="4" class="text-right">
                            <b-form-select v-model="queryParams.workon" :options="optations.workOn">
                            </b-form-select>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="员工编码" :label-cols="4" class="text-right">
                            <b-form-input  v-model="queryParams.code" />
                        </b-form-fieldset>
                    </div>

                </div>
                <query-btn-group @resetClick="reset" @query="query(0)"></query-btn-group>
            </b-card>
        </div>
    </div>
</template>
<script>

/*import AreaTree from 'components/iris-areaqueryshop/index'*/
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import { mapActions,mapState, mapMutations } from 'vuex'
import Tree from './orgTree'
import config from 'common/config'
import common from 'common/common'
import api from 'common/api'
import Vue from 'vue'
import { Tooltip,Button } from 'element-ui'
Vue.use(Tooltip)
Vue.use(Button)
export default {
    components: {
        QueryBtnGroup,
       /* AreaTree,*/
        Tree,
    },
    props: {
        statusOptions: [Array]
    },
    data() {
        return {
            queryParams: {
            	code:'',
                name: '',
                sex:'',
                orgCode:'',
                status: '',
                Type: '',
                workon: '',
                pageNums: config.pageNums,
                pageStart: 1,
                
            },
            params:{
					orgName:''
			},
            optations:{
            	sex:[
		            {
		                text: '男',
		                value: 0, 
		            },
		            {
		                text: '女',
		                value: 1, 
		            },
        		],
	            status:[],
	            type:[],
	            workOn:[
	            	{
		                text: '在职',
		                value: 1, 
		            },
		            {
		                text: '离职',
		                value: '0', 
		            },
				],
				userInfo: '',
            }
        }
    },
    created() {
		this.getStoreInfoVo();
    	this.getStatus();
    	this.getType();
        /*this.getStationType(config.storeStation.refCode)*/
    },
    computed: {
       ...mapState('staffjobs',[
				'staffList',
				'page'
		]),
    },
    methods: {
    	...mapActions('staffjobs',[
				'setTableList',
				'setPage',
				'getQuery'
			]),
		getStoreInfoVo() {
			let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
			this.userInfo = userInfo;
			this.params.orgName = userInfo.inCharegOrgVo.orgName
			this.queryParams.orgCode = userInfo.inCharegOrgVo.orgCode
			if(userInfo == null) {
				Message({
					message: '用户信息缺失!',
					type: 'warning'
				});
				return;
			}
		},
		getOrg(val) {
				this.queryParams.orgCode = val.code;
			},
		//获取员工类型
		getType(){
			const _this = this;
			api.ref.getDataDictionarys({refCode:config.staff.refEmpType},function(res){
				if(res.data.code == 'success'){
					let list = res.data.obj.referenceDetailInfos
					if(list){
						list.forEach(function(item,i){
							_this.optations.type.push({
								value:item.refDetailCode,
								text:item.refDetailName
							})
						})
					}
					
				}
			})
		},
		//获取员工状态
		getStatus(){
			const _this = this;
			api.ref.getDataDictionarys({refCode:config.staff.refEmpStatus},function(res){
				if(res.data.code == 'success'){
					let list = res.data.obj.referenceDetailInfos
					if(list){
						list.forEach(function(item,i){
							_this.optations.status.push({
								value:item.refDetailCode,
								text:item.refDetailName
							})
						})
					}
					
				}
			})
		},
        selectChange(sales, stores) {
            this.queryParams.storeCode = stores.value
        },
        query(arg){
        	let _this =this;
        	let option = {
        			orgCodes:JSON.parse(common.getSession('userInfo')).orgCodes,
        			orgCode:this.queryParams.orgCode,
        			empCode:this.queryParams.code,
        			empCnName:this.queryParams.name,
        			empSex:this.queryParams.sex,
        			orgName:this.queryParams.name,
        			empType:this.queryParams.Type,
        			empStatusCode:this.queryParams.status,
        			onJob:this.queryParams.workon,
					pageNums: config.pageNums,
					pageStart:arg === 0 ? 1 : arg,
				}
        	_this.getQuery(option);
        	api.staffJob.query(option,function(res){
        		let obj = res.data;
        		if(obj.code === 'success'){
        			_this.setTableList(obj.obj.list);
                    let tablePage = {
                        pageNo: res.data.obj.pageNum,
                        pageSize: config.pageNums,
                        totalResult: res.data.obj.total,
                        totalPages: res.data.obj.pages
                    }
                    _this.setPage(tablePage)
        		}
        	})
        },
        reset() {
        	this.params = { orgName: ''};
            this.queryParams={};
            
        },
    },
}
</script>
<style lang="css">
	.tips{
		position:absolute;
		right: -20px;
		top:5px; 
		z-index:99999999999;
	}
</style>

