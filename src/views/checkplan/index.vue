<template>
	<div>
		<b-card header="查询">
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="计划名称" label-text-align="right" :label-cols="4">
						<b-form-input v-model="plan.name" placeholder="" />
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="状态" label-text-align="right" :label-cols="4">
						<b-form-select v-model="plan.status" :options="statusList"/>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset label="选择经销商店" :label-cols="4" horizontal class="text-right">
						<areaqueryshop ref="areaqueryshop" :storeAll="true"  @select-change="selectedfun"></areaqueryshop>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="仓库名称" :label-cols="4" class="text-right">
						<b-form-select v-model="plan.whCode" :options="entreList"></b-form-select>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="pull-right">
						<b-button size="sm" variant="default" @click.Enter="reset">重置</b-button>
						<b-button size="sm" variant="primary" @click.Enter="query(0)">查询</b-button>
					</div>
				</div>
			</div>
		</b-card>
		<b-card>
			<div class="row">
				<div class="col-md-12">
					<div class="pull-left">
						<b-button size="sm" v-if="addBtn" variant="success" @click.Enter="add">新增</b-button>
						<b-button size="sm" v-if="editBtn" variant="primary" @click="edit">编辑</b-button>
					</div>
				</div>
			</div>
			<div class="table-scrollable">
				<b-table striped hover bordered show-empty :items="checkplanlist" :fields="fields">
					<template slot="index" slot-scope="data">
						<div @click="setIndex(data.index)">
							<input type="radio" name="radio" />
						</div>
					</template>
					<template slot="planCode" slot-scope="data">
						<a href="javascript:;" @click.prevent="showDetail(data.item.inventoryPlanNo)">{{ data.item.inventoryPlanNo }}</a>
					</template>
					<template slot="planName" slot-scope="data">
						{{ data.item.inventoryPlanName }}
					</template>
					<template slot="style" slot-scope="data">
						{{  data.item.inventoryPlanType ==='0'? '月循环': '' }}
					</template>
					<template slot="planTime" slot-scope="data">
						{{ data.item.inventoryPlanDay }}
					</template>
					<template slot="storeName" slot-scope="data">
						{{ data.item.storeName }}
					</template>
					<template slot="supplyName" slot-scope="data">
						{{ data.item.whName }}
					</template>
					<template slot="planStyle" slot-scope="data">
						{{ data.item.inventorySkuType === 0 ? '整车' : (data.item.inventorySkuType === 1 ? '非整车' : '临时商品') }}
					</template>
					<template slot="status" slot-scope="data">
						{{ data.item.inventoryPlanStatus === 0? '启用' : '停用' }}
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
	import config from 'common/config.js'
	import areaqueryshop from 'components/iris-areaqueryshop/'
	import {mapState, mapMutations, mapActions} from 'vuex'
	import pagination from 'components/pagination/pagination.vue'
	import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'
	import { MessageBox, Message, DatePicker, Tree } from 'element-ui'
	import api from 'common/api'
	Vue.use(Tree)
	Vue.use(DatePicker)
	export default {
		components: {
			pagination,
			areaqueryshop
		},
		data() {
			return {
				plan: {
					name: '',
					status: '',
					areaCode: [],
					storeCode: '',
					storeCodes: [],
					whCode: ''
				},
				entreList: [],
				// tablelist: [],
				statusList: [],
				// page: 1,
				// pageNo: 1,
				// pageSize: 1,
				// totalResult: 0,
				// totalPages: 0,
				fields: {
					index: {
						label: ' '
					},
					// workFlow: {
					//     label: '工作流名称'
					// },
					planCode: {
						label: '盘点计划单号'
					},
					planName: {
						label: '盘点计划名称'
					},
					style: {
						label: '计划类型'
					},
					planTime: {
						label: '盘点日期'
					},
					storeName: {
						label: '门店名称'
					},
					supplyName: {
						label: '仓库名称'
					},
					planStyle: {
						label: '盘点类型'
					},
					status: {
						label: '状态'
					}
				},
				index: ''
			}
		},
		computed: {
			...mapState('checkplan',[
				'checkplanlist',
				'page'
			]),
			// 按钮级权限控制
			addBtn() {
                return hasBtn(collectionApi.checkPlan.addMain)
            },
            editBtn() {
                return hasBtn(collectionApi.checkPlan.stop)
            }
		},
		created() {
			const _this = this
			// 基础配置数据配置
			_this.statusList = config.checkPlan.status
		},
		methods: {
			...mapActions('checkplan',[
				'setTableList',
				'setCheckPage',
				'setQueryCondition'
			]),
			// 重置
			reset() {
				const _this = this
				_this.plan= {
					name: '',
					status: '',
					areaCode: [],
					storeCode: '',
					storeCodes: [],
					whCode: ''
				}
				_this.$refs.areaqueryshop.reset()
				_this.$refs.areaqueryshop.resetToStart()
			},
			// 门店组件 取值方法
			selectedfun(data,data1){
				const _this = this
				let judgeArray = data1 instanceof Array
				if(judgeArray) {
					_this.plan.storeCodes = []
					for(let i = 0; i< data1.length; i++) {
						if(data1[i].value != 0) {
							_this.plan.storeCodes.push(data1[i].value)
						}
					}
					_this.plan.storeCode = ''
				}else {
					_this.plan.storeCode = data1.value
					_this.plan.storeCodes = []
					const options = {
						'storeCodeSet' : []
					}
					if(data1.value) {
						_this.plan.storeCode = data1.value
					}
					options.storeCodeSet.push(data1.value)
					// 根据经销商店获取仓库
					api.getEntrepot(options, function(res){
						if(res.data.code === 'success') {
							console.log(res)
							_this.entreList = []
							const array = res.data.obj
							for(var i =0; i< array.length; i++) {
								let obj = {}
								obj.text = array[i].warehouseName
								obj.value = array[i].warehouseCode
								_this.entreList.push(obj)
							}
						}
					})
				}
			},
			// 查询
			query(arg) {
				// alert(1)
				const _this = this
				let option = {
					inventoryPlanName: _this.plan.name,
					inventoryPlanStatus: _this.plan.status,
					whCode: _this.plan.whCode,
					storeCode: _this.plan.storeCode,
					storeCodes: _this.plan.storeCodes,
					areaCode: _this.plan.areaCode,
					pageNums: config.pageNums,
					pageStart: arg === 0 ? 1 : arg
				}
				let optionTemp = JSON.parse(JSON.stringify(option))
				// _this.setQueryCondition(optionTemp)
				// _this.setTableList([])
				api.checkPlan.query(option, function(res){
					if(res.data.code === 'success') {
						// _this.pageNo= res.data.obj.pageNum ? res.data.obj.pageNum : 0
						// // 页面数据量
						// _this.pageSize= res.data.obj.pageSize ? res.data.obj.pageSize : 0
						// // 总计数据
						// _this.totalResult= res.data.obj.total ? res.data.obj.total : 0
						// _this.totalPages= res.data.obj.pages ? res.data.obj.pages : 0
						let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
							// _this.tablelist = res.data.obj.list
						_this.setTableList(res.data.obj.list)
						_this.setCheckPage(tempPage)	
					}
				})
			},
			// 下一页
			pageChange(num) {
				const _this = this
				_this.query(num)
			},
			// 新增页面切换
			add() {
				const _this = this
				_this.$router.push({
					path : `/checkPlan/add/${'0'}`
				})
			},
			// 设置编辑锚点
			setIndex(arg) {
				const _this = this
				_this.index = arg
			},
			// 编辑跳转
			edit() {
				const _this = this
				// debugger;
				let index = _this.index
				if(index === '') {
					Message({
						type: 'info',
						message: '请选择编辑项'
					})
				}else {
					_this.$router.push({
						path: `/checkPlan/edit/${_this.checkplanlist[index].inventoryPlanNo + 'edit'}`
					})
				}
			},
			// 通过盘点计划编码查询盘点计划信息
			showDetail(arg) {
				const _this = this
				_this.$router.push({
					path: `/checkPlan/overView/${arg + 'show'}`
				})
			},
		}
	}
</script>
<style scoped>

</style>
