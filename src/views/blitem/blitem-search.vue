<template>
	<div>
		<b-card header="查询">
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
						<areaqueryshop ref="areaqueryshop" @select-change="selectedfun" :storeAll="true"></areaqueryshop>
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
					<b-button size="sm" variant="default" @click="reset()">重置</b-button>
					<b-button size="sm" variant="primary" @click="blitemSearch()">查询</b-button>
				</div>
			</b-row>
		</b-card>
		<b-card>
			<b-row class="mb-0">
				<div class="pull-left ml-3 mb-1">
					<b-button size="sm" variant="success"  @click="createBlitem" v-if="creatTampblitem">新增</b-button>
					<b-button size="sm" variant="primary" @click="eidtBlit"  v-if="isEidtblitem">编辑</b-button>
				</div>
			</b-row>
			<div class="table-scrollable">
				<b-table striped hover bordered show-empty :items="blitemlist" :fields="fields">
					<template slot="sel" slot-scope="data">
						<input type="radio" name="radio"  v-model="selBlit" :value="data.item"/>
					</template>
					<template slot="inventoryNo" slot-scope="data">
						<a href="javascript:;" @click.prevent="detailBlit(data.value)">{{ data.value }}</a>
					</template>
					<template slot="inventoryName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="inventoryDate" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="storeName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="whName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="inventoryTypeName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="inventoryRealTime1st" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="inventoryRealTime2st" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="inventoryStatus" slot-scope="data">
						{{ data.value | blitemStatus}}
					</template>
					<template slot="empty">
						暂无数据...
					</template>
				</b-table>
			</div>
			<v-pagination @page-change="blitemSearch" :total-result="pages.total"
						  :page-no='pages.pageNo' :total-pages="pages.totalPages"
						  :page-size="paginationData.pageSize"></v-pagination>
		</b-card>
	</div>
</template>

<script>
    import Vue from 'vue'
    import {DatePicker, Message} from 'element-ui'
    import {mapState, mapMutations, mapActions} from 'vuex'
    import vPagination from 'components/pagination/pagination.vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import api from 'common/api'
    import config from 'common/config.js'
    import common from 'common/common.js'
    import filters from 'common/filters.js'
    import collectionApi from 'common/api-collection.js'
    import {hasBtn} from 'common/api-common.js'


    Vue.use(DatePicker)
    export default {
        components: {
            vPagination,
            areaqueryshop,
        },
        data() {
            return {
                paginationData: {
                    total: 0,
                    totalPages: 1,
                    pageNo: 1,
                    pageSize: config.pageNums
                },
                entreList: [],
                searchModel: {
                    inventoryNo: '',
                    inventoryName: '',
                    inventoryPlanName: '',
                    inventoryDate: [],
                    areaCodes: [],
                    storeCodes: [],
                    storeCode: "",
                    whCode: '',
                },
                selBlit: {},
                fields: {
                    sel: {
                        label: "选择"
                    },
                    inventoryNo: {
                        label: "盘点单编号"
                    },
                    inventoryName: {
                        label: "盘点名称"
                    },
                    inventoryDateString: {
                        label: "单据日期"
                    },
                    storeName: {
                        label: "门店名称"
                    },
                    whName: {
                        label: "仓库名称"
                    },
                    inventoryTypeName: {
                        label: "盘点类型"
                    },
                    inventoryRealTime1stString: {
                        label: "一盘提交时间"
                    },
                    inventoryRealTime2ndString: {
                        label: "二盘提交时间"
                    },
                    inventoryStatus: {
                        label: "盘点状态"
                    }
                },
                list: []
            }
        },
        computed:{
            ...mapState('blitem',[
                'blitemlist',
                'searchParam',
                'pages'
            ]),
            creatTampblitem(){
                return hasBtn(collectionApi.blitem.creatTampblitem);
            },
            isEidtblitem(){
                return hasBtn(collectionApi.blitem.BlitemEditDetails);
            }
        },
        methods: {
            ...mapActions('blitem',[
                'setTableList',
                'setSearchParam',
                'setPages',
                'getBlitemTabList'
            ]),
            selectedfun(data, data1) {
                const _this = this
                if (data) {
                    _this.searchModel.areaCode = [];
                    for (let i = 0; i < data.length; i++) {
                        _this.searchModel.areaCode.push(data[i].code)
                    }
                }
                if (data1 && data1.length > 0) {
                    let arr = [];
                    for(let i = 1; i < data1.length; i++) {
                        arr.push(data1[i].value)
                    }
                    _this.searchModel.storeCodes = arr;
                } else if(data1) {
                    if(data1.value) {
                        _this.searchModel.storeCodes = [data1.value];
                    }
                     
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
                        const array = res.data.obj
                        _this.entreList = [];
                        for (var i = 0; i < array.length; i++) {
                            let obj = {}
                            obj.text = array[i].warehouseName
                            obj.value = array[i].warehouseCode
                            _this.entreList.push(obj)
                        }
                    }
                })
            },
            reset() {
                this.searchModel.inventoryNo = '';
                this.searchModel.inventoryName = '';
                this.searchModel.inventoryPlanName = '';
                this.searchModel.inventoryDate = [];
                this.searchModel.areaCodes = [];
                this.searchModel.storeCodes = [];
                this.searchModel.whCodes = [];
                this.paginationData.pageNo = 0;
                this.$refs.areaqueryshop.reset();
                this.$refs.areaqueryshop.resetToStart();
                this.paginationData.total = 0;
                this.paginationData.totalPages = 0;
                this.setTableList([]);
            },
            blitemSearch(pageNo) {
                let _this = this;
                let arrK = [];
                pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
                let param = {
                    inventoryNo: this.searchModel.inventoryNo,
                    inventoryName: this.searchModel.inventoryName,
                    inventoryPlanName:this.searchModel.inventoryPlanName,
                    inventoryDateStart: common.eleTimeFormat(this.searchModel.inventoryDate[0]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.inventoryDate[0]),
                    inventoryDateEnd: common.eleTimeFormat(this.searchModel.inventoryDate[1]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.inventoryDate[1]),
                    storeCodes: this.searchModel.storeCodes?this.searchModel.storeCodes:[],
                    whCodes: this.searchModel.whCode?[this.searchModel.whCode]:[],
                    pageNums: this.paginationData.pageSize,
                    pageStart: this.paginationData.pageNo
                }
                _this.getBlitemTabList(param)
                // _this.setSearchParam(param);
                // api.blitem.getBlitemSearch(param, function (result) {
                //     let data = result.data;
                //     if(data.code === 'success') {
                //         _this.paginationData.total = data.obj.total;
                //         _this.paginationData.totalPages = data.obj.pages;
                //         _this.list = data.obj.list;
                //         _this.setTableList(data.obj.list);
                //         _this.setPages({
                //             pageNo: _this.paginationData.pageNo,
                //             total:  data.obj.total,
                //             totalPages: data.obj.pages
                //         });
                //     }

                // })
            },
            eidtBlit() {
                if (!this.selBlit.inventoryNo) {
                    Message({
                        message: '未选择盘点单！',
                        type: 'warning'
                    });
                } else {
                    this.$router.push({name: 'blitemDetails', query: {inventoryNo: this.selBlit.inventoryNo, onlySee: false}})
                }
            },
            detailBlit(val) {
                if(val) {
                    this.$router.push({name: 'blitemDetails', query: {inventoryNo: val, onlySee: true}});
                    return;
                }
            },
            createBlitem() {
                 this.$router.push({name: 'tempadd'});
            }
        }
    }
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
