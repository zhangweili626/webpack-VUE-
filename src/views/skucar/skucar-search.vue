<template>
    <div>
        <b-card header="查询">
			<div class="row">
				<b-col md="6">
					<b-form-fieldset horizontal label="SKU名称" :label-cols="4" class="text-right">
						<sku-search @getValue="skuSelect" ref="skuSearch"></sku-search>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="SKU编码" :label-cols="4" class="text-right">
						<b-form-input v-model="searchModel.skuCode"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="69码" :label-cols="4" class="text-right">
						<b-form-input v-model="searchModel.barCode"/>
					</b-form-fieldset>
				</b-col>	
				<b-col md="6">
					<b-form-fieldset horizontal label="型号" :label-cols="4" class="text-right">
						<b-form-input v-model="searchModel.skuModel"/>
					</b-form-fieldset>
				</b-col>
			</div>
			<b-row>
				<div class="col-md-12 text-right">
					<b-button size="sm" variant="default" @click="reset()">重置</b-button>
					<b-button size="sm" variant="primary" @click="skuCarSearch()">查询</b-button>
				</div>
			</b-row>
		</b-card>
        <b-card>
			<b-row class="mb-0">
				<div class="pull-left ml-3 mb-1">
                    <b-button size="sm" variant="success" @click="creatSkuCar" v-if="isCreatSkuCar">新建</b-button>
					<b-button size="sm" variant="primary" @click="eidtSkuCar" v-if="isEidtSkuCar">编辑</b-button>
				</div>
			</b-row>
			<div class="table-scrollable">
				<b-table striped hover bordered show-empty :items="skuCarList" :fields="fields">
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
					<template slot="relation" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="empty">
						暂无数据...
					</template>
				</b-table>
			</div>
			<v-pagination @page-change="skuCarSearch" :total-result="skuCarPages.total"
						  :page-no='skuCarPages.pageNo' :total-pages="skuCarPages.totalPages"
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
					relation: {
						label: "车型扩展属性"
                    },
				},
				list:[],
				uploadList:[],				
            }
		},
		computed: {
			...mapState('skuCar',[
				'skuCarList',
				'skuCarParam',
				'skuCarPages'
			]),
			isCreatSkuCar(){
				return hasBtn(collectionApi.skuCar.skuCarAdd);
			},
			isEidtSkuCar(){
				return hasBtn(collectionApi.skuCar.skuCarEidt);
			}
		},
		created(){
		
		},
		methods: {
			...mapActions('skuCar',[
				'setSkuCarTableList',
				'setSkuCarParam',
				'setSkuCarPages',
				'getSkuCarList'
			]),
			skuSelect(val) {
				this.searchModel.skuName = val.skuName;
				// this.searchModel.skuCode = val.skuCode;
				// this.searchModel.barCode = val.barCode;
				// this.searchModel.skuModel = val.skuModel;
			},
			reset() {
				this.$refs.skuSearch.clear();
				this.searchModel.skuCode = '';
				this.searchModel.skuName = '';
				this.searchModel.barCode = '';
				this.searchModel.skuModel = '';

				this.paginationData.pageNo = 0;				
				this.paginationData.total = 0;
				this.paginationData.totalPages = 0;
				this.setSkuCarTableList([]);
			},
			skuCarSearch(pageNo) {
				let _this = this;
				 pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
				let param = {
					skuName: this.searchModel.skuName,				
					skuCode: this.searchModel.skuCode,				
					barCode: this.searchModel.barCode,				
					skuModel: this.searchModel.skuModel,				
					pageNums: this.paginationData.pageSize,
					pageStart: this.paginationData.pageNo
				};
				// _this.setSkuCarParam(param);
				_this.getSkuCarList(param);
				// api.skuCar.skuCarSearch(param, function (result) {
				// 	let data = result.data;
				// 	if(data.code === 'success') {
				// 		_this.paginationData.total = data.obj.total;
				// 		_this.paginationData.totalPages = data.obj.pages;
				// 		_this.setSkuCarTableList(data.obj.list);
				// 		_this.setSkuCarPages({
                //             pageNo: _this.paginationData.pageNo,
                //             total:  data.obj.total,
                //             totalPages: data.obj.pages
                //         });
				// 	}

				// })
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
