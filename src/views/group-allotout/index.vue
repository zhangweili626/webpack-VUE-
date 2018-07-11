<template>
	<div>
		<b-card>
			<div slot="header">
				<strong>检索</strong>
			</div>
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="调拨出库单号" label-text-align="right" :label-cols="4">
						<b-form-input placeholder="" v-model="search.odd"/>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="单据状态" label-text-align="right" :label-cols="4">
						<b-form-select :options="statusOp" v-model="search.status"></b-form-select>
					</b-form-fieldset>
				</div>
			</div>
			<div class='row'>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="调入区域" label-text-align="right" :label-cols="4">
						<areaqueryshop ref="inareaqueryshop" :rightControl="false"  @control-frame="hideOut" :storeAll="true"  @select-change="selectedfunIn"></areaqueryshop>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="调入仓库" label-text-align="right" :label-cols="4">
						<!--<areaqueryshop ref="areaqueryshop"  @select-change="selectedfun"></areaqueryshop>-->
						<b-form-select :options="pSupplyin" v-model="search.supplyin"></b-form-select>
					</b-form-fieldset>
				</div>
			</div>
			<div class='row'>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="调出区域" label-text-align="right" :label-cols="4">
						<areaqueryshop ref="outareaqueryshop" :storeAll="true" @control-frame="hideIn"  @select-change="selectedfun"></areaqueryshop>
						<!-- <b-form-select v-model="plan.whCode" :options="entreList"></b-form-select>-->
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="调出仓库" label-text-align="right" :label-cols="4">
						<!--<areaqueryshop ref="areaqueryshop"  @select-change="selectedfun"></areaqueryshop>-->
						<b-form-select :options="pSupplyout" v-model="search.supplyout"></b-form-select>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="审核状态" label-text-align="right" :label-cols="4">
						<b-form-select :options="wfStatus" v-model="search.auditState"></b-form-select>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="起止时间" label-text-align="right" :label-cols="4">
						<el-date-picker
							v-model="time"
							type="daterange"
							@change="datechange()"
							:clearable="true"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期">
						</el-date-picker>
					</b-form-fieldset>
				</div>

			</div>

			<div class="row">
				<div class="col-md-12">
					<div class="pull-right">
						<b-button size="sm" variant="default" @click="reset">重置</b-button>
						<b-button size="sm" variant="primary" @click="query(0)">查询</b-button>
					</div>
				</div>
			</div>
		</b-card>
		<b-card>
		<div class="row">
			<div class="col-md-12">
				<div class="pull-left">
					<b-button size="sm" variant="success" @click.Enter="add" v-if="addAllotout">新增</b-button>
					<b-button size="sm" variant="primary" @click="eidtContract" v-if="editAllotout">编辑</b-button>
				</div>
			</div>
		</div>
		<div class="table-scrollable">
			<b-table striped hover bordered show-empty :items="allotoutlist" :fields="fields">
				<template slot="index" slot-scope="data">
					<div>
						<input type="radio" name="radio" v-model="editSelect" :value="data.item.transferOutOrderNo"/>
					</div>
				</template>
				<template slot="transferOutOrderNo" slot-scope="data">
					<a href="javascript:;" @click.prevent="showDetail(data.item.transferOutOrderNo)">{{ data.item.transferOutOrderNo }}</a>
				</template>
				<template slot="transferSkuType" slot-scope="data">
					{{ data.item.transferSkuType =='0' ? '整车':'非整车'}}
				</template>
				<template slot="transferType" slot-scope="data">
					{{  data.item.transferType =='0'? '内部调拨': '集团内转售' }}
				</template>
				<template slot="wfStatus" slot-scope="data">
					{{ data.item.wfStatus == '1'? '审核通过':(data.item.wfStatus =='0'?'已提交':'待提交')}}
				</template>
				<template slot="orderStatus" slot-scope="data">
					{{ backStatus(data.item.orderStatus)}}
				</template>
				<template slot="empty">
					暂无数据...
				</template>

			</b-table>
		</div>
		 <div class="row mt-2">
			<div class="col-md-12">
				<pagination class="pull-right" @page-change="pageChange" :page-no="page.pageNo" :page-size="page.pageSize" :total-result="page.totalResult" :total-pages="page.totalPages">
				</pagination>
			</div>
		</div>
		</b-card>
	</div>
</template>
<script>
	import Vue from 'vue'
	import {mapState, mapMutations, mapActions} from 'vuex'
	import api from 'common/api.js'
	import config from 'common/config.js'
	import common from 'common/common.js'
	import areaqueryshop from 'components/iris-areaqueryshop/'
	import pagination from 'components/pagination/pagination.vue'
	import { MessageBox, Message, DatePicker } from 'element-ui'
	import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'
	Vue.use(DatePicker)
	export default {
		components: {
			pagination,
			areaqueryshop
		},
		data() {
			return {
				time:'',
				editSelect:'',
				pSupplyin:[],
            	pSupplyout:[],
				search: {
					odd:'',
					status:'',
					areaCodeIn: [],
					storeCodeIn: '',
					areaCodeOut: [],
					storeCodeOut: '',
					supplyin:'',
					supplyout:'',
					auditState:'',
					startTime:'',
					endTime:'',
					instoreList:[],
					outstoreList:[],
				},
				statusOp:config.allotOut.billStatus,
				wfStatus:config.allotOut.approStatus,
				fields: {
					index: {
						label: ' '
					},
					transferOutOrderNo: {
						label: '调拨出库单号'
					},
					transferSkuType: {
						label: '调拨单类型'
					},
					transferType: {
						label: '调拨单子类型'
					},
					outStoreName: {
						label: '调出门店'
					},
					outWhName: {
						label: '调出仓库'
					},
					inStoreName: {
						label: '调入门店'
					},
					inWhName: {
						label: '调入仓库'
					},
					wfStatus: {
						label: '审核状态'
					},
					totalNums: {
						label: '调出总数量'
					},
					realNums: {
						label: '实入总数量'
					},
					billTime: {
						label: '单据时间'
					},
					estimatedArrivalDateString: {
						label: '计划完成时间'
					},
					confirmOperatorName: {
						label: '创建人'
					},
					orderStatus: {
						label: '单据状态'
					},
					totalFreightFee: {
						label: '运费(含税)'
					},
					beTermNo: {
						label: '账期'
					}
				},
				tablelist: []
			}
		},
		computed: {
		 	addAllotout(){
				return hasBtn(collectionApi.allotout.addQuery);
			},
			editAllotout(){
				return hasBtn(collectionApi.allotout.selectQuery);
			},
			...mapState('allotout',['allotoutlist','page']),
		},
		mounted(){
			/*this.query(0)*/
			this.setTableList([])
		},
		methods: {
			...mapActions('allotout',['setTableList','setPage']),
			datechange() {
                const _this = this
                let arriveTime = common.formattingTime(_this.time)
                _this.search.startTime = arriveTime.startTime
                _this.search.endTime = arriveTime.endTime
            },
     // 让出库选择框消失
        hideOut() {
            this.$refs.outareaqueryshop.hideFrame()
        },
        // 让入库选择框消失
        hideIn() {
            this.$refs.inareaqueryshop.hideFrame()
        },
			//重置功能
			reset(){
				this.$refs.inareaqueryshop.reset();
				this.$refs.inareaqueryshop.resetToStart()
				this.$refs.outareaqueryshop.reset();
				this.$refs.outareaqueryshop.resetToStart();
				this.time={};
				this.search = {
					odd:'',
					status:'',
					areaCodeIn: [],
					storeCodeIn: '',
					areaCodeOut: [],
					storeCodeOut: '',
					supplyin:'',
					supplyout:'',
					auditState:'',
					startTime:'',
					endTime:'',
					instoreList:[],
					outstoreList:[],
				};
			},
		    //调拨出库地址
            selectedfun(data,data1){
            	const _this = this
            	if(data1 instanceof Array){
        			_this.search.storeCodeOut = '';
	   		 		_this.search.outstoreList =[];
		   		 	data1.forEach(function(item,i){
		   		 		_this.search.outstoreList.push(item.value)
		   		 	})
		   		  	_this.search.outstoreList.shift()
	   		 	 }else{
			   		  	if (data) {
							for (let i = 0; i < data.length; i++) {
								_this.search.areaCodeOut.push(data[i].code)
							}
						}
						if (data1) {
							_this.search.storeCodeOut = data1.value
						}
					
	   		  }
			   if(data1.length){
					_this.search.storeCodeOut =''
				}else{
						const options = {
							'storeCodeSet' : []
						}
						options.storeCodeSet.push(data1.value);
						// 根据经销商店获取仓库
						api.getEntrepot(options, function(res){
							if(res.data.code === 'success') {
								_this.pSupplyout =[];
								console.log(res)
								const array = res.data.obj
								for(var i =0; i< array.length; i++) {
									let obj = {}
									obj.text = array[i].warehouseName
									obj.value = array[i].warehouseCode
									_this.pSupplyout.push(obj)
								}
							}
						})
				}
			   
			},
			//调拨入库地址
	   		selectedfunIn(data,data1){
	   		console.log(data);
	   		console.log(data1)
	   		  const _this = this;
	   		 if(data1 instanceof Array){
	   		 	_this.search.storeCodeIn = '';
	   		 	_this.search.instoreList =[];
	   		 	data1.forEach(function(item,i){
	   		 		_this.search.instoreList.push(item.value)
	   		 	})
	   		  	_this.search.instoreList.shift()
	   		  }else{
	   		  	if (data) {
					for (let i = 0; i < data.length; i++) {
						_this.search.areaCodeIn.push(data[i].code)
					}
				}
				if (data1) {
					_this.search.storeCodeIn = data1.value
				}
	   		  }
	   		  
	   		  if(data1.length){
					_this.search.storeCodeIn =''
				}else{
					_this.search.storeCodeIn = data1.value
					const options = {
					'storeCodeSet' : []
				     }
				   options.storeCodeSet.push(data1.value)
					// 根据经销商店获取仓库
					api.getEntrepot(options, function(res){
						if(res.data.code === 'success') {
							_this.pSupplyin = [];
							const array = res.data.obj
							for(var i =0; i< array.length; i++) {
								let obj = {}
								obj.text = array[i].warehouseName
								obj.value = array[i].warehouseCode
								_this.pSupplyin.push(obj)
							}
						}
					})
				}
			},
		   backStatus(num){
		    	let text = '';
		    	switch (num)
					{
					case 0:
					  text="未生效";
					  break;
					case 1:
					  text="已提交";
					  break;
					case 2:
					 text="已生效";
					  break;
					case 3:
					 text="已完成";
					  break;
					case 4:
					 text="已关闭";
					  break;
					case -1:
					  text="作废";
					  break;
					};
				 return text;
		    },
			//查询数据
            query(arg){
				const _this = this;
            	let option = {
            		outStoreCodeList:_this.search.outstoreList,
            		inStoreCodeList:_this.search.instoreList,
					transferOutOrderNo: _this.search.odd,
					orderStatus: _this.search.status,
					wfStatus:_this.search.auditState,
					outStoreCode:_this.search.storeCodeOut,
					inStoreCode:_this.search.storeCodeIn,
					outWhCode:_this.search.supplyout,
					inWhCode:_this.search.supplyin,
					confirmOperatorTime:_this.search.startTime,
					estimatedArrivalDate:_this.search.endTime,
					pageNums: config.pageNums,
					pageStart: arg === 0 ? 1 : arg,
					transferType:1,
				}
                api.allotout.query(option, (res) => {
                    if(res.data.code === 'success') {
						_this.setTableList(res.data.obj.list)
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
			add(){
        		const _this = this
                _this.$router.push({
                    path : '/group-allotout/add'
                })
        	},
        	//编辑按钮
        	eidtContract() {
				if (this.editSelect=='') {
					Message({
						message: '未选择调拨出库单号！',
						type: 'warning'
					});
				} else {
					this.$router.push({
					 path: `/group-allotout/edit/${this.editSelect}`
					})
				}
			},
			//查看详情
			showDetail(val){
				this.$router.push({
					path: `/group-allotout/details/${val}`
				})
			},
		  // 下一页
			pageChange(num) {
				this.query(num)
			},
		}
	}
</script>
<style scoped></style>
