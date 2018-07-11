<template>
    <div class="row" ref="staffList">
        <div class="col-md-12">
            <b-card>
            	<div class="row">
	                <div class="col-md-12">
	                    <div class="pull-left">
	                        <b-button size="sm" variant="success" @click='addJobs'>配置岗位</b-button>
	                        <b-button size="sm" variant="success" @click='addWorks'>配置工种</b-button>
	                    </div>
	                    <div class="pull-right">
	                        <b-button size="sm" variant="warning"@click='init'>同步数据</b-button>
	                    </div>
	                </div>
            	</div>
                <div class="table-scrollable mb-2">
                    <b-table striped hover bordered show-empty empty-text="暂无数据" :items="staffList" :fields="fields">
                        <template slot="radio" slot-scope="data">
                                <input type="radio" name="radio" v-model="editSelect" :value="data.item.empCode"/>
                        </template>  
                        <template slot="empCode" slot-scope="data">
                        	<a href="javascript:;" @click.prevent="detailStaff(data.item.empCode)">{{ data.item.empCode }}</a>
                        </template>
                        <template slot="onJob" slot-scope="data">
                        	{{data.item.onJob =='0'?'离职':'在职'}}
                        </template>
                        <template slot="empSex" slot-scope="data">
                            {{data.item.empSex =='0'?'男':(data.item.empSex =='1'?'女':'')}}
                        </template>    
                        <template slot="stationStatus" slot-scope="row">{{row.value === 0 ? '启用' : '停用'}}</template>    
                    </b-table>
                </div>
                <div class="row"> 
                    <div class="col-md-12">
                       <pagination class="pull-right" 
                        @page-change="pageChange" 
                        :pageNo="page.pageNo" 
                        :pageSize="page.pageSize" 
                        :totalPages="page.totalPages" 
                        :totalResult="page.totalResult">
                        </pagination>
                    </div>
                </div>
            </b-card>
        </div>
    </div>
</template>
<script>

import AreaTree from 'components/iris-areaqueryshop/index'
import ListBtnGroup from 'components/list-btn-group/list-btn-group'
import Pagination from 'components/pagination/pagination'
import Vue from 'vue'
import { Message, Checkbox } from 'element-ui'
Vue.use(Checkbox)
import { mapState, mapMutations, mapActions} from 'vuex'
import config from 'common/config'
import { getSequence, alertSuccess, getType, hasBtn } from 'common/api-common'
import api from 'common/api'
import common from 'common/common'

export default {
    components: {
        AreaTree,
        ListBtnGroup,
        Pagination
    },
    props: {
        statusOptions: [Array]
    },
    data() {
        return {
            fields: {
                radio: {
                    label: ' '
                },
                empCode: {
                    label: '员工编码'
                },
                empCnName: {
                    label: '员工姓名'
                },
                empSex: {
                    label: '性别'
                },
				orgName: {
                    label: '所属组织'
                },
                empTypeName: {
                    label: '员工类型'
                },
                empStatus: {
                    label: '员工状态'
                },
                onJob: {
                    label: '在职情况'
                },
                postAmount: {
                    label: '已配置岗位数量'
                },
                workTypeAmount: {
                    label: '已配置工种数量'
                }
            },
            index: '',
            dialogStatus: 0,   // 弹出框的显示状态: 0 insert, 1 update, 2 watch; 
            dialog: {
                stationCode: '',
                stationName: '',
                stationTypeCode: '',
                stationStatus: '',
                storeCode: '',
                workTypeList: []
            },
            hideFooter: false,
            workTypeList: [],
            stationNameState: '',
            areaRequired: false,
            preWorkTypeList: [],
            editSelect:'',
        }
    },
    created() {
        getType(config.storeStation.workTypeRef, items => {
            items.forEach(item => {
                let data = {
                    workTypeName: item.refDetailName,
                    workTypeCode: item.refDetailCode,
                    check: false,
                    isDeleted: null
                }
                this.workTypeList.push(data)
            })
        })
    },
    computed: {
        dialogTitle() {
            if(this.dialogStatus === 0) {
                return INSERT_TITLE
            }else if(this.dialogStatus === 1) {
                return UPDATE_TITLE
            }else {
                return WATCH_TITLE
            }
        },
        //按钮权限
        canInsert() {
            const insertUrl = url.storeStation.insert 
            return hasBtn(insertUrl)
        },
        canUpdate() {
            const updateUrl = url.storeStation.update
            return hasBtn(updateUrl)
        },
        ...mapState('staffjobs',[
				'staffList',
				'page',
				'queryList'
		]),
    },
    methods: {
    	...mapActions('staffjobs',[
				'setTableList',
				'setPage',
				
			]),
		detailStaff(val) {
				if(val) {
					this.$router.push({name: 'staffDetail', query: {empCode: val, onlySee: true}});
					return;
				}
			},
    	addJobs(){
    		if (this.editSelect=='') {
					Message({
						message: '未选择员工编号！',
						type: 'warning'
					});
				}else {
					this.$router.push({
					 path: `/staffjobs/addJobs/${this.editSelect}`
					})
		    }
    	},
    	addWorks(){
    		if (this.editSelect=='') {
					Message({
						message: '未选择员工编号！',
						type: 'warning'
					});
				}else {
					this.$router.push({
					 path: `/staffjobs/addWorks/${this.editSelect}`
					})
		    }
    	},
        init(){
           api.staffJob.init({},function(res){
        		if(res.data.code === 'success'){
        			Message({
						message: '操作成功！',
						type: 'success'
					});
        		}
        	})	
        },
        pageChange(currentPage) {
           const _this =this;
           _this.query(currentPage)
        },
        query(arg){
        	let _this =this;
        	let option ={
        		pageNums: config.pageNums,
				pageStart:arg === 0 ? 1 : arg,
        	}
        	this.queryList.pageStart = arg;
        	api.staffJob.query(this.queryList,function(res){
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
    watch: {
    }
}
</script>
<style scoped>
.el-checkbox {
    margin-left: 0;
    margin-right: 10px;
}
.work-type .card-body {
    max-height: 250px;
    overflow-y: scroll;
}
</style>

