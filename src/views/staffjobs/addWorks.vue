<template>
    <div>
		<staffInfo></staffInfo>
	    <b-card>
	    	<div class="row">
	            <div class="col-md-12">
	                <div class="pull-left">
	                    <b-button size="sm" variant="danger" @click='Delete'>删除</b-button>
	                    <b-button size="sm" variant="success" v-b-modal.insert @click='add'>添加</b-button>
	                </div>
	            </div>
	    	</div>
	        <div class="table-scrollable mb-2">
	            <b-table striped hover bordered show-empty empty-text="暂无数据" :items="list" :fields="fields">
	               <template slot="radio" slot-scope="data">
	                    <div @click="check(data)">
	                        <input type="radio" name="radio" v-model="deleted.deletedId" :value="data.item.id"/>
	                    </div>
	                </template>  
	            </b-table>
	        </div>
	        <div class="row"> 
	            <div class="col-md-12">
	                <pagination class="pull-right" 
                        @page-change="pageChange" 
                        :page-no="workpage.pageNo" 
                        :page-size="workpage.pageSize" 
                        :total-pages="workpage.totalPages" 
                        :total-result="workpage.totalResult">
                    </pagination>
	            </div>
	        </div>
    	</b-card>
    	<insertModal ref="modal" @reload='reload'></insertModal>
	</div>
</template>

<script>
import api from 'common/api'
import {Message,Checkbox, MessageBox} from "element-ui";
import { mapState, mapMutations, mapActions } from 'vuex'
import staffInfo from './staffInfo'
import insertModal from './insertModal'
import Pagination from 'components/pagination/pagination'
import config from 'common/config'
export default {
    components: {
        staffInfo,
        insertModal,
        Pagination,
    },
    props: {
    },
    data() {
        return {
       		list:[],
       		deleted:{
       			deletedId:'',
       			relationCode:'',
       			empCode:'',
       			workTypeCode:'',
       		},
        	fields: {
                radio: {
                    label: ' '
                },
                workTypeCode: {
                    label: '工种编码'
                },
                workTypeName: {
                    label: '工种'
                },
                storeName: {
                    label: '所属门店'
                },
				remark: {
                    label: '备注'
                },
               
            },
           myModalRef:'myModalRef',
        }
    },
    created() {
    	this.getWorkType(0);
    },
    computed: {
    	...mapState('staffjobs',[
				'workpage'
		]),
    },
    methods: {
    	...mapActions('staffjobs',[
				'setworkPage',
				'setTableList',
				'setPage'
			]),
		reload(){
			this.getWorkType(0);
		},
    	Delete(){
    			const _this =this;
    			
    			if(this.deleted.deletedId == ''){
    				Message({
			           type: 'warning',
			           message: '请选择岗位编号'
		          	});
		          	return
    			}else{
    				MessageBox.confirm('是否删除该工种, 是否继续?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			        let option = [{
			        	id:_this.deleted.deletedId,
			        	isDeleted:'1',
	 					relationCode:_this.deleted.relationCode,
	 					empCode:_this.deleted.empCode,
                		workTypeCode:_this.deleted.workTypeCode,
			        }]
	          		api.staffJob.batchWorkTypeInfo(option,(res) => {
		                    if(res.data.code === 'success') {
		                    	this.deleted.deletedId = '';
		                    	_this.getWorkType(0);
		                    	_this.query(0);
		                    	Message({
						            type: 'success',
						            message: '废除成功!'
					          	});
		                    }
		                })
			        }).catch(() => {
			          Message({
			            type: 'info',
			            message: '已取消操作'
			          });          
			    });
    			}
    			
    	},
    	save(){},
    	add(){
       	    this.$refs.modal.filterWorkTypeList();
    	},
    	//查询工种列表
       	getWorkType(arg){
       		const arr = location.href.split('/'),
    		empCode = arr[arr.length -1],
    		option ={
    			'empCode':empCode,
    			'pageNums': config.pageNums,
				'pageStart': arg === 0 ? 1 : arg,
    		},
    		_this = this;
       		api.staffJob.queryWorkTypeInfo(option,function(res){
        		let obj = res.data;
        		if(obj.code === 'success'){
        			_this.list = obj.obj.list;
        			let tablePage = {
                        pageNo: res.data.obj.pageNum,
                        pageSize: config.pageNums,
                        totalResult: res.data.obj.total,
                        totalPages: res.data.obj.pages
                    }
                    _this.setworkPage(tablePage)
        		}
        	})	
       },
       //绑定关系CODE
       check(data){
       	  /*  this.$emit('getWarning')*/
       		this.deleted.relationCode = data.item.relationCode; 
       		this.deleted.empCode = data.item.empCode;
       		this.deleted.workTypeCode = data.item.workTypeCode;
       },
       pageChange(num){
       		const _this = this;
       		_this.getWorkType(num)
       },
       
       query(arg){
        	let _this =this;
        	let option = {
					pageNums: config.pageNums,
					pageStart:arg === 0 ? 1 : arg,
				}
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
    },
    
}
</script>
<style>
</style>