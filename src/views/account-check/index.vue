<template>
	<div>
		<b-card  header="查询">
		   <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="自采单号" :label-cols="4" class="text-right">
                        <b-form-input  v-model.trim="queryParams.spoOrderNo" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="收货地址(仓库 )" :label-cols="4" class="text-right">
                        <div class="text-left">
                            <search
                                ref="search"
                                :dataList="datalist"
                                option="warehouseName"
                                @dataChange="querySelect"
                                @itemValue="itemClick"
                                @clickShowBack="firstLoad"
                                @clearValue="clearValue"
                                @comScroll="scrollBottom">
                            </search>
                        </div>
                    </b-form-fieldset>
                </div>
 
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="到货处理状态 *" :label-cols="4" class="text-right">
                        <b-form-select v-model="queryParams.orderStatus" :options="statusOptions">
                        </b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
			<div class="row">
				<div class="col-md-12 col-lg-12">
					<div class="pull-right">
						<b-button @click="reset" size="sm">重置</b-button>
						<b-button variant="primary" @click="getquery()" size="sm">查询</b-button>
					</div>
				</div>
			</div>
		</b-card>
		<b-card>
			<div class="row mb-2">
				<div class="col-md-12 col-lg-12">
					<b-button variant="primary" size="sm" @click="writeDown">核销处理</b-button>
					 <span class="ml-3 mt-3">
							 <el-tooltip placement="top" effect="light">
	                            <div slot="content">未处理的自采单号无法核销</div>
	                            <i class="tipsImportant">i</i>
                        	</el-tooltip>
                    </span>
				</div>
			</div>
			<div class="table-scrollable">
				<b-table striped hover bordered :items="list" :fields="field" show-empty empty-text="暂无数据">
					<template slot="checkbox"  slot-scope="data" >
						<b-form-checkbox  v-model="selected" :disabled="data.item.disabled" :value="data.item.spoBatchNo"></b-form-checkbox>
					</template>
					<template slot="orderStatus" slot-scope="data">
						{{data.item.orderStatus | orderStatus }}
					</template>
					<template slot="verifyStatus" slot-scope="data">
						{{data.item.verifyStatus | hxStatus }}
					</template>
				</b-table>
			</div>
			<div class="row mt-3">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="pageChange" :page-no="pageData.pageNum" :page-size="pageData.pageSize" :total-result="pageData.total" :total-pages="pageData.pages">
                 </pagination>
               </div>
            </div>
		</b-card>
		<sureModel ref="sureModel" @sureEvent = 'invalid' :warnigTitle="titleText"  :whatStep="whatStep " :tipsTitle="tipsTitle"></sureModel>
	</div>
</template>

<script>
import Vue from 'vue'
import { getType } from 'common/api-common'
import common from 'common/common'
import {Table, TableColumn,DatePicker,Message,MessageBox,Tooltip} from 'element-ui'
import pagination from "components/pagination/pagination.vue";
import Search from "components/iris-search/search"
import config from 'common/config'
import api from 'common/api'
Vue.use(Tooltip)
import sureModel from 'components/iris-modal/index.vue'
	export default{
		components:{
			pagination,
			Search,
			sureModel
		},
		computed: {
        storeInfoVo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                return userInfo.hasOwnProperty('userAvailableInfo') ? userInfo.userAvailableInfo.storeInfoVo
                    : null
	        }
	    },   
        
		mounted(){
			 if(this.storeInfoVo) {
	            this.queryParams.storeCode = this.storeInfoVo.storeCode
	            this.selectParams.storeCode = this.storeInfoVo.storeCode
	        }
		},
		data(){
			return{
				selected:[],
				titleText:'发票金额合计小于自采单总金额',
				tipsTitle:'确认核销吗',
				whatStep:'核销',
				list:[],
				queryParams:{
					   storeCode: '',
		               orderStatus:null,
		               whCode: '',
		               pageNums: config.pageNums,
		               pageStart: 1,
				},
				statusOptions: [
						{text: '全部', value: null},
		                {text: '已处理', value: 3},
		                {text: '未处理', value: 2},                
		            ],
				pageData:{
					pageNum:1,
					pageSize:config.pageNums,
					total:1,
					pages:1,
				},
				// 下拉组件查询参数
	            datalist: [],
	            selectParams: {
	                storeCode: '',
	                pageNums: config.pageNums,
	                pageStart: 1
	            },
	            totalMoney:0,
	            invoiceTotalMoney:0,
	            isLastPage: false,
				field:{
				  	checkbox: {
	                    label: '选择'
	                },
	                spoOrderNo: {
	                    label: '自采单号'
	                },
	                spoBatchNo: {
	                    label: '批次号'
	                },
	                orderStatus: {
	                    label: '到货处理状态'
	                },
	                supplierName: {
	                    label: '供应商'
	                },
	                whName: {
	                    label: '收货地址'
	                },
	                totalAmount: {
	                    label: '采购金额'
	                },
	                totalFreightFee: {
	                    label: '运费'
	                },
	                verifyStatus: {
	                    label: '核销状态'
	                },
				},
			}
		},
		methods:{
			pageChange(){
				
			},
			writeDown(){
				if(!this.selected.length){
			   	  		Message({
							message:'请选择自采单',
							type:'warning',
						})
			   	  		return 
			   	    }
				
			 /*   this.list.forEach(item=>{
			    	this.invoiceTotalMoney += item.totalMoney
			    	this.totalMoney += item.totalMoney
			    })
		   	    if(this.invoiceTotalMoney <  this.totalMoney){
		   	    	this.showSureModel()
		   	    }
		   	    if(this.invoiceTotalMoney >  this.totalMoney){
		   	    	MessageBox.confirm('发票总金额合计大于自采单总金额,确认核销吗',{
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				          }).then(()=>{
				          		this.invalid();
				          })
		   	    }*/
		   	    this.invalid();
			},
			 showSureModel(){
				this.$refs.sureModel.showDeleteModel();
			},
			hideSureModel(){
				this.$refs.sureModel.closeDeleteModel();
			},
			 //确认核销处理
			invalid(){
					 MessageBox.confirm('核销后不可逆操作，确认核销吗','提示',{
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				          }).then(()=>{
		          				api.statementAccountCancel.verifyPurchaseBatchInfo({spoOrderNos:this.selected},res =>{
									if(res.data.code == 'success'){
										Message({
											message:'核销成功',
											type:'success',
										})
										this.selected = [];
										this.$refs.sureModel.closeDeleteModel();
										this.getquery();
									}
								})
				          })
				},
			   reset() {
		            this.queryParams = {
		                storeCode:this.storeInfoVo.storeCode,
		              /*  storeCode:'',*/
		                orderStatus:null,
		                whCode: '',
		                pageNums: config.pageNums,
		                pageStart: 1,
		            }
		            this.$refs.search.setValue()
		        },
			getquery(){
				api.arriveHandle.query(this.queryParams).then(res => {
			        if (res.data.code === 'success') {
			           this.list = res.data.obj.list
			           this.list.forEach(item=>{
				           	if(item.verifyStatus == 1 || item.orderStatus == 2){
				           		item.disabled = true
				           	}else{
				           		item.disabled = false
				           	}
			           })
			        }
			    })
			},
			// 仓库名称 - 下拉搜索
	        clearValue() {
	            this.queryParams.whCode = '';
	        },
	        firstLoad() {
	            if(this.selectParams.warehouseName) {
	                delete this.selectParams.warehouseName;
	            }else if(this.datalist.length !== 0) {
	                return;
	            }
	            let params = this.selectParams;        
	            this.queryWhInfo(params, obj => {
	                this.datalist = obj.list;
	            });
	        },
	        querySelect(data) {
	            this.selectParams.pageStart = 1;
	            this.selectParams.warehouseName = data;
	            let params = this.selectParams;        
	            this.queryWhInfo(params, obj => {
	                this.isLastPage = obj.isLastPage;            
	                this.datalist = obj.list;
	            });
	        },
	        itemClick(item) {
	            this.queryParams.whCode = item.warehouseCode;
	        },
	        scrollBottom(isEnd) {
	            if (isEnd && !this.isLastPage) {
	                this.selectParams.pageStart ++
	                let params = this.selectParams;        
	                this.queryWhInfo(params, obj => {
	                    this.isLastPage = obj.isLastPage;
	                    this.datalist = this.datalist.concat(obj.list);
	                });
	            }
	        },
	        queryWhInfo(params, callback) {
	            api.warehouse.query(params).then(res => {
	                if (res.data.code === "success") {
	                    let obj = res.data.obj;
	                    callback(obj);
	                }
	            });
	        },
		},
		filters:{
			orderStatus(val){
				switch(val){
					case 2:
					return '未处理'
					break;
					case 3:
					return "已处理"
					break;
				}
			},
			hxStatus(val){
				switch(val){
					case 1:
					return '已核销'
					break;
					case 0:
					return "未核销"
					break;
				}
			}
		}
	}
</script>

<style>

</style>