<template>
    <div>
        <b-card header="查询">
			<car-info :flag="carFlag" @callBack="carSelect" :col='2' ref="carInfo"></car-info>
			<div class="row fbz-car-sku-query">
				<b-col md="6">
					<b-form-fieldset horizontal label="商品分类" label-text-align="right" :label-cols="4">
                    	<salegroyTree  @getSaleGory="getSaleGory1" ref="orgSelect" :params="saleGroy"></salegroyTree>
                    </b-form-fieldset>
				</b-col>
			</div>
			<b-row>
				<div class="col-md-12 text-right">
					<b-button size="sm" variant="default" @click="reset()">重置</b-button>
					<b-button size="sm" variant="primary" @click="carSkuSearch()">查询</b-button>
				</div>
			</b-row>
		</b-card>
        <b-card>
			<div class="table-scrollable">
				<el-table
					:data="carSkuList"
					border>
					<!-- <el-table-column label="选择">
						<template slot-scope="scope">
							<input type="radio" name="radio"  v-model="selCont" :value="scope.row" :disabled="!isEidtSkuCar"/>
						</template>					
					</el-table-column> -->
					<el-table-column
						label="商品编号"
						width="120">
						<template slot-scope="scope">
							{{scope.row['skuCode'] }}
							<!-- <a href="javascript:;" @click.prevent="detailSkuCar(scope.row['skuCode'])">{{ scope.row['skuCode'] }}</a> -->
						</template>				
					</el-table-column>
					<el-table-column
						prop="skuName"
						label="商品名称"
						width="100">
					</el-table-column>
					<el-table-column
						prop="brandName"
						label="品牌"
						width="100">
					</el-table-column>
					<el-table-column
						prop="skuStandards"
						label="规格">
					</el-table-column>
					<el-table-column
						prop="skuModel"
						label="型号"
						width="100">
					</el-table-column>
					<el-table-column
						prop="barCode"
						label="69码">
					</el-table-column>
					<el-table-column
						prop="originalCode"
						label="原厂编码"
						width="120">
					</el-table-column>
					<el-table-column
						prop="factoryName"
						label="厂家">
					</el-table-column>
					<el-table-column
						prop="brandName"
						label="品牌">
					</el-table-column>
					<el-table-column
						prop="seriesName"
						label="车系">
					</el-table-column>
					<el-table-column
						prop="modelName"
						label="车型">
					</el-table-column>
					<el-table-column
						prop="opvName"
						label="排量">
					</el-table-column>
					<el-table-column
						prop="iotypeName"
						label="进气方式"
						width="100">
					</el-table-column>
					<el-table-column
						v-for="(item, index) of headAddList"
						:key="index"					
						:label="item.addName"
						width="130">
						<template slot-scope="scope">
							{{getText(item.addCode,scope.row['skuCarAddRelationInfoVos'])}}
						</template>
					</el-table-column>
				</el-table>
			</div>
			<v-pagination @page-change="carSkuSearch" :total-result="carSkuPages.total"
						  :page-no='carSkuPages.pageNo' :total-pages="carSkuPages.totalPages"
						  :page-size="paginationData.pageSize"></v-pagination>
		</b-card>
    </div>
</template>
<script>
    import Vue from 'vue'
	import {Message, Table, TableColumn} from 'element-ui'
	import {mapState, mapMutations, mapActions} from 'vuex'
	import vPagination from 'components/pagination/pagination.vue'
	import carInfo from 'components/iris-carinfo'
	import api from 'common/api'
	import config from 'common/config.js'
	import common from 'common/common.js'
	import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'
	import filters from 'common/filters.js'
	import salegroyTree from './../sku-comb/salegoryTree'
	Vue.use(Table);
	Vue.use(TableColumn);
    export default {
        components: {
			vPagination,
			carInfo,
			salegroyTree
		},
		data() {
			return {
				carFlag: config.carFlag,
				paginationData: {
					total: 0,
					totalPages: 1,
					pageNo: 1,
					pageSize: config.pageNums
				},
				searchModel: {
					factoryCode:'',
					brandCode:'',
					seriesCode:'',
					modelCode:'',
					opvCode: '',
					ioTypeCode: '',
					categoryCodes: []		
				},
				saleGroy:{
	        		orgName:''
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
					factoryName: {
						label: "厂家"
					},
					brandName: {
						label: "品牌"
					},
					seriesName: {
						label: "车系"
					},
					modelName: {
						label: "车型"
					},
					opvName: {
						label: "排量"
					},
					iotypeName: {
						label: "进气方式"
					},
					skuCarAddRelationInfoVos: {
						label: "附加信息"
					},
				},
				list:[],
				headAddList:[],				
            }
		},
		computed: {
			...mapState('skuCar',[
				'carSkuList',
				'carSkuParam',
				'carSkuPages'
			]),
			isCreatSkuCar(){
				return hasBtn(collectionApi.skuCar.skuCarAdd);;
			},
			isEidtSkuCar(){
				return hasBtn(collectionApi.skuCar.skuCarEidt);;
			}
		},
		created(){
		
		},
		methods: {
			...mapActions('skuCar',[
				'setCarSkuTableList',
				'setCarSkuParam',
				'setCarSkuPages',
				'getCarSkuList'
			]),
			carSelect(val) {
				for(let item of Object.keys(val)) {
					this.searchModel[item] = val[item];
				}
			},
			getSaleGory1(val){
				// console.log(val)
          		this.searchModel.categoryCodes = [val.categoryCode]
          	},
			reset() {
				this.$refs.carInfo.clear();
				for(let item of Object.keys(this.searchModel)) {
					this.searchModel[item] = '';
				}
				this.searchModel.categoryCodes = []
				this.saleGroy.orgName = ''
				this.paginationData.pageNo = 0;				
				this.paginationData.total = 0;
				this.paginationData.totalPages = 0;
				this.setCarSkuTableList([]);
			},
			carSkuSearch(pageNo) {
				let _this = this;
				 pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
				let param = {
					factoryCode: this.searchModel.factoryCode,
					brandCode: this.searchModel.brandCode,
					seriesCode: this.searchModel.seriesCode,
					modelCode: this.searchModel.modelCode,				
					opvCode: this.searchModel.opvCode,				
					iotypeCode: this.searchModel.ioTypeCode,
					categoryCodes: this.searchModel.categoryCodes,				
					pageNums: this.paginationData.pageSize,
					pageStart: this.paginationData.pageNo
				};
				//_this.setCarSkuParam(param);
				_this.getCarSkuList(param);
			},
			getText(str,arr) {
				if(!arr || arr.length == 0) {
					return '';
				}
				let text = ''
				arr.forEach(item => {
					if(str === item.addCode) {
						text = item.addValue
					}
				})
				return text;
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
		watch:{
			carSkuList(val){
				let addTitle = [];
				this.headAddList = [];
				for(let [index, item] of val.entries()) {
					if(item.skuCarAddRelationInfoVos && item.skuCarAddRelationInfoVos.length != 0) {
						for(let [i, val] of item.skuCarAddRelationInfoVos.entries()) {
							let obj = {};
							obj.addName = val.addName;
							obj.addValue = val.addValue;
							obj.addCode = val.addCode;
							if(addTitle.length != 0) {
								let onoff = true;
								for(let [i, val] of addTitle.entries()) {
									if(val.addCode === obj.addCode) {
										onoff = false;
									}
								}
								if(onoff){
									addTitle.push(obj);
								}
								
							}else{
								addTitle.push(obj);
							}
						}
					}
				}
				this.headAddList = addTitle;
				console.log(this.headAddList)
			}
		}

    }
</script>
<style>
.carsku-table{
	margin: -8px;
}
.card-header div{
	font-weight: bold!important;
}
.fbz-car-sku-query .zwlTree {
	position: absolute;
	/* width: 89% !important; */
	/* max-height: 300px;
	overflow-y: auto; */
    z-index: 99;
}
</style>
