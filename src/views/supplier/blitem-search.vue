<template>
	<div>
		<b-card>
			<div slot="header">
				<strong>查询</strong>
			</div>
			<div class="row">
				<b-col md="6">
					<b-form-fieldset horizontal label="盘点单号" :label-cols="4" class="text-right">
						<b-form-input v-model="searchModel.inventoryNo"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="盘点名称" :label-cols="4" class="text-right">
						<b-form-input v-model="searchModel.inventoryName"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="盘点计划名称" :label-cols="4" class="text-right">
						<b-form-input v-model="searchModel.inventoryPlanName"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="单据日期" :label-cols="4" class="text-right">
						<el-date-picker
							v-model="searchModel.inventoryDate"
							type="daterange"
							:clearable="true"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期">
						</el-date-picker>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset label="选择经销商店" :label-cols="4" horizontal class="text-right">
						<areaqueryshop ref="areaqueryshop" @select-change="selectedfun"></areaqueryshop>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="仓库名称" :label-cols="4" class="text-right">
						<b-form-select v-model="searchModel.whCode" :options="entreList"></b-form-select>
					</b-form-fieldset>
				</b-col>
			</div>
			<b-row>
				<div class="col-md-12 text-right">
					<b-button size="sm" variant="success">新增</b-button>
					<b-button size="sm" variant="primary" @click="blitemSearch">查询</b-button>
				</div>
			</b-row>
		</b-card>
		<b-card>
			<b-row class="mb-0">
				<div class="pull-left ml-3 mb-1">
					<b-button size="sm" variant="primary" to="/blitem/blitemDetails">编辑</b-button>
				</div>
			</b-row>
			<div class="table-scrollable pt-1">
				<b-table striped hover bordered show-empty :items="list" :fields="fields">
					<template slot="sel" slot-scope="data">
						<input type="radio" name="models" :value="data.item" @change="selectBlit" v-model="selBlit">
					</template>
					<template slot="a" slot-scope="data">
						{{ data.value }}
					</template>
					<template slot="b" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="c" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="d" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="e" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="f" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="g" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="h" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="i" slot-scope="data">
						{{ data.value}}
					</template>

					<template slot="empty" slot-scope="row">
						暂无数据...
					</template>
				</b-table>
			</div>
			<v-pagination :pageNo='1'></v-pagination>
		</b-card>


	</div>
</template>

<script>
	import Vue from 'vue'
	import {DatePicker} from 'element-ui'
	import vPagination from 'components/pagination/pagination.vue'
	import areaqueryshop from 'components/iris-areaqueryshop/'
	import api from 'common/api'

	Vue.use(DatePicker)
	export default {
		components: {
			vPagination,
			areaqueryshop
		},
		data() {
			return {
				entreList: {},
				searchModel: {
					inventoryNo: '',
					inventoryName: '',
					inventoryPlanName: '',
					inventoryDate: '',
					areaCode: [],
					storeCode: '',
					whCode: '',
					pageNums: '',
					pageStart: ''
				},
				selBlit: {},
				fields: {
					sel: {
						label: "选择"
					},
					a: {
						label: "盘点单编号"
					},
					b: {
						label: "盘点名称"
					},
					c: {
						label: "单据日期"
					},
					d: {
						label: "门店名称"
					},
					e: {
						label: "仓库名称"
					},
					f: {
						label: "盘点类型"
					},
					g: {
						label: "一盘提交时间"
					},
					h: {
						label: "二盘提交时间"
					},
					i: {
						label: "盘点状态"
					}
				},
				list: [
					{
						sel: true,
						a: "aa11",
						b: "bb",
						c: "cc",
						d: "dd",
						e: "ee",
						f: "ff",
						g: "gg",
						h: "hh",
						i: "ii"
					},
					{
						sel: true,
						a: "aa22",
						b: "bb",
						c: "cc",
						d: "dd",
						e: "ee",
						f: "ff",
						g: "gg",
						h: "hh",
						i: "ii"
					}
				]
			};
		},
		methods: {
			selectedfun(data, data1) {
				const _this = this
				if (data) {
					for (let i = 0; i < data.length; i++) {
						_this.searchModel.areaCode.push(data[i].code)
					}
				}
				if (data1) {
					_this.searchModel.storeCode = data1.value
				}
				const options = {
					'storeCodeSet': []
				}
				if (data1.value) {
					_this.searchModel.storeCode = data1.value
				}
				options.storeCodeSet.push(data1.value)
				// 根据经销商店获取仓库
				api.getEntrepot(options, function (res) {
					if (res.data.code === 'success') {
						console.log(res)
						const array = res.data.obj
						for (var i = 0; i < array.length; i++) {
							let obj = {}
							obj.text = array[i].warehouseName
							obj.value = array[i].warehouseCode
							_this.entreList.push(obj)
						}
					}
				})
			},
			blitemSearch(pageNo) {
				pageNo ? this.searchModel.pageStart = pageNo : this.searchModel.pageStart = 1;
				let param = {
					inventoryNo: this.searchModel.inventoryNo,
					inventoryName: this.searchModel.inventoryName,
					inventoryPlanName: this.searchModel.inventoryPlanName,
					inventoryDate: this.searchModel.date,
					areaCode: this.searchModel.areaCode,
					storeCodes: this.searchModel.storeCode,
					whCode: this.searchModel.whCode,
					pageNums: this.searchModel.pageNums,
					pageStart: this.searchModel.pageStart,
				}
				api.blitem.getBlitemSearch(param, function (data) {
					console.log(data)
				})
			},
			selectBlit(val) {
				if (val.isTrusted == true) {
					console.log(this.selBlit);
				}
			}
		}
	};
</script>

<style>
	.el-input .el-input__inner {
		border-radius: 0 !important;
	}

	.el-input.is-disabled .el-input__inner {
		background-color: #c2cfd6 !important;
		border-radius: 0 !important;
	}

	.el-input__icon {
		color: #536c79 !important;
	}

	.el-input {
		width: 100% !important;
	}
</style>
