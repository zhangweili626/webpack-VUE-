<template>
    <div>      
        <b-card header="适配车型检索">
			<b-row class="mb-0">
				<div class="pull-left ml-3 mb-1">
                    <b-button size="sm" variant="success" @click="creatSkuCar" v-if="isCreatSkuCar">新建</b-button>
					<b-button size="sm" variant="primary" @click="eidtSkuCar" v-if="isEidtSkuCar">编辑</b-button>
				</div>
			</b-row>
			<div class="table-scrollable">
				<b-table striped hover bordered show-empty :items="skuCarAllList" :fields="fields">
					<template slot="sel" slot-scope="data">
						<input type="radio" name="radio"  v-model="selCont" :value="data.item" :disabled="!isEidtSkuCar"/>
					</template>					
					<template slot="skuCode" slot-scope="data">
						<a href="javascript:;" @click.prevent="detailSkuCar(data.value)">{{ data.value }}</a>
					</template>
					<template slot="skuName" slot-scope="data">
						{{ data.value }}
					</template>
					<template slot="brandName" slot-scope="data">
						{{ data.value }}
					</template>
					<template slot="skuStandards" slot-scope="data">
						{{ data.value }}
					</template>
					<template slot="skuModel" slot-scope="data">
						{{ data.value }}
					</template>
					<template slot="barCode" slot-scope="data">
						{{ data.value}}
					</template>
                    <template slot="originalCode" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="factory" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="brand" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="series" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="model" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="opv" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="iotype" slot-scope="data">
						{{ data.value}}
					</template>					
					<template slot="empty">
						暂无数据...
					</template>
				</b-table>
			</div>
			<v-pagination @page-change="skuCarAllSearch" :total-result="skuCarAllPages.total"
						  :page-no='skuCarAllPages.pageNo' :total-pages="skuCarAllPages.totalPages"
						  :page-size="paginationData.pageSize"></v-pagination>
		</b-card>
    </div>
</template>
<script>
    import Vue from 'vue'
	import {DatePicker, Message} from 'element-ui'
	import {mapState, mapMutations, mapActions} from 'vuex'
	import vPagination from 'components/pagination/pagination.vue'
	import skuSearch from './skuSearch.vue'
	import api from 'common/api'
	import config from 'common/config.js'
	import common from 'common/common.js'
	import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'
	import filters from 'common/filters.js'

    Vue.use(DatePicker)
    export default {
        components: {
			vPagination,
			skuSearch
		},
		data() {
			return {
				paginationData: {
					total: 0,
					totalPages: 1,
					pageNo: 1,
					pageSize: config.pageNums
				},
				searchModel: {
					skuCode: '',
					skuName: '',
					barCode: '',
					skuModel: '',				
				},
				selCont:'',
                fields: {
					sel: {
						label: "选择"
					},
					skuCode: {
						label: "商品编码"
					},
					skuName: {
						label: "商品名称"
					},
					brandName: {
						label: "品牌"
					},
					skuStandards: {
						label: "规格"
					},
					skuModel: {
						label: "型号"
					},
					barCode: {
						label: "69码"
					},
					originalCode: {
						label: "原厂编码"
					},
					factory: {
						label: "厂家"
					},
					brand: {
						label: "品牌"
					},
					series: {
						label: "车系"
					},
					model: {
						label: "车型"
					},
					opv: {
						label: "排量"
					},
					iotype: {
						label: "进气方式"
					},					
				},
				list:[],
				uploadList:[],				
            }
		},
		computed: {
			...mapState('skuCar',[
				'skuCarAllList',
				'skuCarAllParam',
				'skuCarAllPages'
			]),
			isCreatSkuCar(){
				return hasBtn(collectionApi.skuCar.skuCarAdd);;
			},
			isEidtSkuCar(){
				return hasBtn(collectionApi.skuCar.skuCarEidt);;
			}
		},
		created(){
			this.skuCarAllSearch();
		},
		methods: {
			...mapActions('skuCar',[
				'setSkuCarAllTableList',
				'setSkuCarAllParam',
				'setSkuCarAllPages',
				'getSkuCarAllList'
			]),
			skuCarAllSearch(pageNo) {
				let _this = this;
				 pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
				let param = {
					empCode: this.searchModel.skuCode,
					empCnName: this.searchModel.skuName,
					empMobile: this.searchModel.barCode,
					empSex: this.searchModel.skuModel,				
					pageNums: this.paginationData.pageSize,
					pageStart: this.paginationData.pageNo
				};
				// _this.setSkuCarAllParam(param);
				_this.getSkuCarAllList(param);
			},
			creatSkuCar(val) {
				this.$router.push({name: 'skuCarAdd'});
			},
			eidtSkuCar() {
				if (!this.selCont.skuCode) {
					Message({
						message: '未选择SKU！',
						type: 'warning'
					});
				} else {
					this.$router.push({name: 'skuCarEidt', query: {skuCode: this.selCont.skuCode, onlySee: false}})
				}
			},
			detailSkuCar(val) {
				if(val) {
					this.$router.push({name: 'skuCarDetail', query: {skuCode: val, onlySee: true}});
					return;
				}
			},
		},

    }
</script>
<style>
.card-header div{
	font-weight: bold!important;
}
</style>
