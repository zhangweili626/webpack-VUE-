<template>
	<div>
	    <staffInfo></staffInfo>
	    <b-card>
	    	<div class="row">
	            <div class="col-md-6">
	                <div class="pull-left">
	                    <b-button size="sm" variant="primary" @click='setIdentity'>设置默认身份</b-button>
	                    <b-button size="sm" variant="danger" @click='Delete'>删除</b-button>
	                    <b-button size="sm" variant="success" @click='add'>添加</b-button>
	                </div>
	            </div>
	    	</div>
	        <div class="table-scrollable mb-2">
	            <b-table striped hover bordered show-empty empty-text="暂无数据" :items="list" :fields="fields">
	                <template slot="radio" slot-scope="data">
	                    <div @click="check(data)">
	                        <input type="radio" name="radio" :value="data.item.id" v-model="selectcheck" @change="aa"/>
	                    </div>
	                </template> 
	                <template slot="postCode" slot-scope="data">
                        	<a href="javascript:;" @click.prevent="showModal(data)">{{ data.item.postCode }}</a>
                        </template>
	                <template slot="inCharge" slot-scope="data">
	                	<i class="el-icon-circle-check iconGreen ml-4 fs20" v-if="data.item.inCharge =='1'"></i>
	                </template>
	            </b-table>
	        </div>
	        <div class="row"> 
	            <div class="col-md-12">
	                <pagination class="pull-right" @page-change="pageChange" :page-no="jobpage.pageNo" :page-size="jobpage.pageSize" :total-result="jobpage.totalResult" :total-pages="jobpage.totalPages">
					</pagination>
	            </div>
	        </div>
	    </b-card>
	    <b-modal id="insert"
                ref="modal"
                title="添加岗位"
                @ok="handleOk"
                @shown="clearName"
                @cancel ="handlecancel"
                ok-title="确认"
                cancel-title="取消" size="lg">
            <div class="row">
            	<div class="col-md-12">
            		<org-transfer :worktype="worktype" @getWork ="getWork" :empCode="staffInfo.empCode" ref="addSyset"></org-transfer>
            	</div>
            </div>    
    	</b-modal>
    	<b-modal title="岗位详情" 
		       	 @ok=""
		       	 @cancel=""
		       	 hide-footer
		       	 ref="myModalRef">
    		<div class="row">
    			<div class="col-md-6">
                        <b-form-fieldset horizontal label="组织名称" :label-cols="4" class="text-right">
                            <b-form-input  v-model="JobDetail.orgName" disabled="disabled"/>
                        </b-form-fieldset>
                </div>
                <div class="col-md-6">
                        <b-form-fieldset horizontal label="上级岗位" :label-cols="4" class="text-right">
                            <b-form-input  v-model="JobDetail.fatherPostName" disabled="disabled"/>
                        </b-form-fieldset>
                </div>
                <div class="col-md-6">
                        <b-form-fieldset horizontal label="岗位名称" :label-cols="4" class="text-right">
                            <b-form-input  v-model="JobDetail.postnName" disabled="disabled" />
                        </b-form-fieldset>
                </div>
                <div class="col-md-6">
                        <b-form-fieldset horizontal label="岗位类型" :label-cols="4" class="text-right">
                            <b-form-input  v-model="JobDetail.postnTypeName" disabled="disabled"/>
                        </b-form-fieldset>
                </div>
                <div class="col-md-6">
                        <b-form-fieldset horizontal label="状态" :label-cols="4" class="text-right">
                            <b-form-input  v-model="JobDetail.postStatus == '0' ? '可用':'停用'" disabled="disabled"/>
                        </b-form-fieldset>
                </div>
                <div class="col-md-6">
                        <b-form-fieldset horizontal label="备注" :label-cols="4" class="text-right">
                            <b-form-input  v-model="JobDetail.remark" disabled="disabled"/>
                        </b-form-fieldset>
                </div>
    		</div>
    	</b-modal>
    </div>
</template>

<script>
import Vue from 'vue'
import api from 'common/api'
import config from 'common/config'
import staffInfo from './staffInfo'
import insertModal from './insertModal'
import { MessageBox, Message} from 'element-ui'
import orgTransfer from './orgTransfer.vue'
import {getType, hasBtn} from 'common/api-common'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Pagination from 'components/pagination/pagination'
import common from 'common/common.js'
export default {
    components: {
        staffInfo,
        insertModal,
        orgTransfer,
        Pagination,
        
    },
   
    data() {
        return {
        	queryPostByEmpCode:'',//当前员工的主岗位
            planShow: false,
            hasExpandClick: false,
        	isShowModel:false,
        	list:[],
        	worktype:[],
        	ischeck:false,
        	Syset:[],//人员关系表
        	JobDetail:{
        		orgName:'',
        		postCode:'',
        		postnName:'',
        		remark:'',
        		fatherPostName:'',
        		postnTypeName:'',
        		postStatus:'',
        		
        	},
        	setMainJob:[{
        		id: "ec28404999c24e5c956126b638e0efae",
			    empCode: "EMP022416",
			    inCharge: "0",
			    orgCode: "02236111",
			    orgName: "保定东风本田4S店",
			    postCode: "022286",
			    postnName: "测试1",
			    postnType: "测试类型1",
			    postnTypeCode: "typeceshi1",
			    postnTypeName: "测试名称1",
			    relationCode: "CESHI0001",
			    remark: ""
        	}],
        	deleteJob:[{
        		id: "ec28404999c24e5c956126b638e0efae",
        		isDeleted:'1',
			    empCode: "EMP022416",
			    inCharge: "0",
			    orgCode: "02236111",
			    orgName: "保定东风本田4S店",
			    postCode: "022286",
			    postnName: "测试1",
			    postnType: "测试类型1",
			    postnTypeCode: "typeceshi1",
			    postnTypeName: "测试名称1",
			    relationCode: "CESHI0001",
			    remark: ""
        	}],
        	fields: {
                radio: {
                    label: ' '
                },
                postCode: {
                    label: '岗位编码'
                },
                postnName: {
                    label: '岗位名称'
                },
                postnTypeName: {
                    label: '岗位类型'
                },
				orgName: {
                    label: '所属组织'
                },
                remark: {
                    label: '备注'
                },
                inCharge: {
                    label: '是否默认身份登陆'
                },
            },
            selectcheck:'',
            selectcheck1:'',// 选择当前的orgCode
        }
    },
    created() {
    	this. getQuery(0);
    	const _this = this;
    	//获取员工主岗位
    	api.staffJob.queryPostByEmpCode({
    		empCode:this.$route.params.staffNo,
    		inCharge:1,
    	},res=>{
    		if(res.data.code == 'success'){
    			this.queryPostByEmpCode = res.data.obj[0].orgCode
    		}
    	})
    	//获取岗位类型
    	getType('PositionType', items => {
            items.forEach(item => {
                _this.worktype.push({
                value:item.refDetailCode,
                text:item.refDetailName
                })
            })
           	_this.worktype.unshift({
           		text:'全部',
           		value:null,
           	})
       });
      
       this.getOrgCode(false);
       
     
    },
    computed: {
    	...mapGetters('staffjobs',[
    	   'staffInfo',
    	   'jobpage',
    	   'orgCodes'
    	]),
    	
    },
    methods: {
    	...mapActions('staffjobs',[
				'setjobPage',
				'getOrgCode',
			]),
		 showModal (data) {
		      this.$refs.myModalRef.show();
		      const option = {
		      	orgCode:data.item.orgCode,
		      	empCode:data.item.empCode,
		      	postCode:data.item.postCode,
		      }
		      const _this = this
		      api.staffJob.queryEmpPost(option,function(res){
		      	if(res.data.code == 'success'){
		      		for(let k of Object.keys(_this.JobDetail)){
		      			/*_this.JobDetail.postnName = res.data.obj.*/
		      			_this.JobDetail[k] = res.data.obj[k]
		      		}
		      	}
		      })
	     },
	     aa(){
	     	console.log(this.selectcheck);
	     },
    	check(data){
    		/*this.setMainJob = [];
    		this.deleteJob = [];*/
    		
    		for(let k of Object.keys(this.setMainJob[0])){
    			this.setMainJob[0][k]= data.item[k];
    			this.deleteJob[0][k]= data.item[k];
    		}
    		this.selectcheck1 = data.item.orgCode
    		console.log(this.selectcheck1)
    	},
    	getWork(){
    		this.getQuery(0)
    	},
    	pageChange(nextpage) {
                const _this = this
                _this.getQuery(nextpage)
            },
    	handleOk(evt){
    		 this.$refs.modal.show();
    		 this.$refs.addSyset.updateJob();
    		 this.getQuery(0);
    	},
    	handlecancel(){
    		this.$refs.addSyset.cancel();
    	},
    	clearName(){},
       	Delete(){
       		
       		const _this = this;
       		if(this.selectcheck == ''){
       			Message({
       	    		type: 'warning',
			        message: '请选择数据'
       	    	})
       			return
       		}
       		let index = _this.orgCodes.findIndex(v => v == this.selectcheck1);
       	    if(index == -1){
       	    	Message({
       	    		type: 'warning',
			        message: '暂无权限'
       	    	})
       	    	return;
       	    }else{
   	    		MessageBox.confirm('是否删除该岗位, 是否继续?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
	          			api.staffJob.updateJob(_this.deleteJob,function(res){
		                    if(res.data.code === 'success') {
		                    	_this.getQuery(0);
		                    	_this.selectcheck ='';	
		                    	Message({
						            type: 'success',
						            message: '废除成功!'
					          	});
		                    }
		                })
			        }).catch(() => {
			          this.selectcheck = ''
			          Message({
			            type: 'info',
			            message: '已取消操作'
			          });          
			    });
       	    }
       	
       },
       //设置默认身份
       setIdentity(){
       		const _this = this;
       		debugger
       		let index = this.orgCodes.findIndex(v => v == this.queryPostByEmpCode);
       		let index1 = this.orgCodes.findIndex(v => v == this.selectcheck1);
       	    if(index == -1 || index1 == -1){
       	    	Message({
       	    		type: 'warning',
			        message: '暂无权限'
       	    	})
       	    	return;
       	    }else if(this.selectcheck === ''){
       	    
       	    	Message({
	       	    		type: 'warning',
				        message: '请选择一条数据'
       	    		})
       	    	return ;
       	    }else{
       	    	_this.setMainJob[0].inCharge = 1,
       	    	api.staffJob.updateJob(_this.setMainJob,function(res){
        		let obj = res.data;
        		if(obj.code === 'success'){
        			_this.getQuery(0)
        			Message({
	       	    		type: 'success',
				        message: '设置成功'
       	    		})
        			
        		}
        	})
       	    }
       },
       add(){
       	 	const _this = this
            this.$refs.modal.show();
            this.$refs.addSyset.setFistLoad();
             this.$refs.addSyset.clearName()
       },
       //查询岗位列表
       getQuery(arg){
       		const arr = location.href.split('/'),
    		empCode = arr[arr.length -1],
    		option ={
    			'empCode':empCode,
    			pageNums: config.pageNums,
                pageStart: arg === 0 ? 1 : arg
    		},
    		_this = this;
       		api.staffJob.queryPostnInfo(option,function(res){
        		let obj = res.data;
        		if(obj.code === 'success'){
        			_this.list = obj.obj.list;
        			let tablePage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                    }
                    _this.setjobPage(tablePage)
        		}
        	})	
       },
    },
}
</script>

<style>
.iconGreen{
	color: #5EB870;
}
.fs20{font-size: 20px;}
#insert .modal-lg {
    max-width: 800px !important;
}
#jobTree{
	/*height:200px;
	overflow: auto;*/
}
.prompt {
   font-size: 12px;
}
</style>