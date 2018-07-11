<template>
    <div @click="controlFromBody">
        <b-card header="查询">
			<div class="row">
                <div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="服务名称" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryCondition.serviceName"/>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="服务分类" label-text-align="right" :label-cols="4">
                        <div @click.stop="inventoryControl" ref="serviceCatelog">
                            <b-form-input v-model="queryCondition.categoryName" readonly />
                        </div>
                        <div class="text-left select-tree self_constrol control-style" v-show="catelogShow">
                            <!-- <el-tree :data="planTreeData" :props="planOptions" :load="planNode" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="planItemClick"> -->
                            <el-tree :data="planTreeData" :props="planOptions" :load="planNode" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="hasExpandClick" @node-click="planItemClick" @node-expand="expandClick">
                            </el-tree>
                        </div>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="是否上架" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryCondition.onOffFlag" :options="itemlist"/>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="用料关系" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryCondition.skuType" :options="itemlist"/>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="价格类型" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryCondition.priceType" :options="priceTypeslist"/>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="pull-right">
						<b-button size="sm" variant="default" @click="reset">重置</b-button>
						<b-button size="sm" variant="primary" @click="query(1)">查询</b-button>
					</div>
				</div>
			</div>
		</b-card>
        <b-card>
			<div class="row">
				<div class="col-md-12">
					<div class="pull-left">
						<b-button size="sm" v-if="addBtn" variant="success" @click="add(0)">新增</b-button>
						<b-button size="sm" v-if="addBtn" variant="primary" @click="edit">编辑</b-button>
					</div>
					<div class="pull-right">
						<b-button size="sm" variant="warning" @click="dataSync">同步数据</b-button>
					</div>
				</div>
			</div>
			<div class="table-scrollable">
				<b-table striped hover bordered show-empty :items="servicelist" :fields="fields">
					<template slot="index" slot-scope="data">
						<div @click="setIndex(data.item.serviceCode)">
							<input type="radio" name="radio" />
						</div>
					</template>
					<template slot="serviceCode" slot-scope="data">
						<a href="javascript:;" @click="showDetail(data.item.serviceCode)">{{ data.item.serviceCode }}</a>
					</template>
					<template slot="skuType" slot-scope="data">
						{{ data.item.skuType === 1 ? '是' : '否' }}
					</template>
					<template slot="priceType" slot-scope="data">
						{{ data.item.priceType === 1 ? '固定' : (data.item.priceType === 2 ?'非固定价格' : '自定义价格') }}
					</template>
                    <template slot="labourPriceType" slot-scope="data">
						{{ data.item.priceType === 2 ? HAS_NO_VALUE : (data.item.labourPriceType === 1 ? '固定值' : '比例') }}
					</template>
                    <template slot="proportion" slot-scope="data">
                        {{ data.item.priceType === 2 ? HAS_NO_VALUE : (data.item.labourPriceType === 0 ? data.item.labourPrice*100 : HAS_NO_VALUE) }}
                    </template>
                    <template slot="labourPrice" slot-scope="data">
                        {{ data.item.priceType === 2 ? HAS_NO_VALUE : (data.item.labourPriceType === 1 ? data.item.labourPrice : HAS_NO_VALUE) }}
                    </template>
                    <!-- <template slot="labourPriceTaxRate" slot-scope="data">
                        {{ data.item.labourPriceTaxRate ? (data.item.labourPriceTaxRate - 0)*100 : 0 }}
                    </template> -->
                    <template slot="outsideFlag" slot-scope="data">
						{{ data.item.outsideFlag === 1 ? '是' : '否' }}
					</template>
                    <template slot="onOffFlag" slot-scope="data">
						{{ data.item.onOffFlag === 1 ? '是' : '否' }}
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
	import {mapState, mapMutations, mapActions} from 'vuex'
	import pagination from 'components/pagination/pagination.vue'
	import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'
	import { MessageBox, Message, DatePicker, Tree } from 'element-ui'
    import common from 'common/common'
	import api from 'common/api'
	Vue.use(Tree)
    Vue.use(DatePicker)
    
    export default {
        components: {
            pagination
        },
        data() {
            return {
                HAS_NO_VALUE: '无值',
                editCode: '',
                planTreeData: [],
                planOptions: {
                    children: 'children',
                    label: 'categoryName'
                },
                hasExpandClick: false,
                catelogShow: false,
                itemlist: [],
                tablelist: [],
                priceTypeslist: [],
                queryCondition: {
                    serviceName: '',
                    categoryCodeList: [],
                    categoryName: '',
                    onOffFlag: '',
                    skuType: '',
                    priceType: ''
                },
                // page: {
                //     pageNo: 1,
                //     pageSize: config.pageNums,
                //     totalResult: 0,
                //     totalPages: 1
                // },
                fields: {
                    index: {
                        label: '选择'
                    },
                    serviceCode: {
                        label: '服务编码'
                    },
                    // externalCode: {
                    //     label: '外部编码'
                    // },
                    categoryName: {
                        label: '服务分类'
                    },
                    serviceName: {
                        label: '服务名称'
                    },
                    workTypeName: {
                        label: '工种类型'
                    },
                    skuType: {
                        label: '配件关系'
                    },
                    priceType: {
                        label: '价格类型'
                    },
                    labourPriceType: {
                        label: '人工成本类型'
                    },
                    proportion: {
                        label: '比例'
                    },
                    // labourPriceTaxRate: {
                    //     label: '人工费税率'
                    // },
                    labourPrice: {
                        label: '人工成本￥'
                    },
                    standardCost: {
                        label: '人工参考成本'
                    },
                    retainHour: {
                        label: '参考工时数'
                    },
                    outsideFlag: {
                        label: '是否外包'
                    },
                    onOffFlag: {
                        label: '上下架状态'
                    }
                }
            }
        },
        computed: {
            addBtn() {
                return hasBtn(collectionApi.serviceitem.insert)
            },
            // editBtn() {
            //     return hasBtn(collectionApi.serviceitem.updateStore)
            // },
            ...mapState('serviceitem', [
                'page',
                'servicelist'
            ])
        },
        methods: {
            ...mapActions('serviceitem', [
                'setPageIndex',
                'setTableList'
            ]),
            // 重置
            reset() {
                const _this = this
                _this.queryCondition= {
                    serviceName: '',
                    categoryCodeList: [],
                    categoryName: '',
                    onOffFlag: '',
                    skuType: '',
                    priceType: ''
                }
            },
            // 服务分类树形图的方法
            inventoryControl() {
                const _this = this
                _this.catelogShow = !_this.catelogShow
            },
            // 选择框消失
            controlFromBody() {
                const _this = this
                _this.catelogShow = false
            },
            // 加载分类数据
            planNode(node, resolve) {
                const _this = this
                if (node.level === 0) {
                    let params = { categoryCode: config.serviceitem.categoryCode }
                    // let params = { categoryCode: '001' };
                    api.serviceitem.queryCategory(params).then(res => {
                        if (res.data.code === 'success') {
                            let obj = res.data.obj;
                            if (obj) {
                                let arr = [{
                                    id: 0,   // 默认展示一级节点
                                    categoryName: obj.categoryName,
                                    categoryCode: obj.categoryCode
                                }];
                                return resolve(arr);
                            }
                        }
                    })
                } else {
                    let params = { categoryCode: node.data.categoryCode };
                    api.serviceitem.queryCategory(params).then(res => {
                        if (res.data.code === 'success') {
                            let items = res.data.obj.serviceCategorySubInfo;
                            let arr = [];
                            if (items !== null) {
                                items.forEach((item, index) => {
                                    let data = {
                                        categoryName: item.categoryName,
                                        categoryCode: item.categoryCode
                                    }
                                    arr.push(data)
                                })
                            } else {
                                return resolve([])
                            }
                            return resolve(arr)
                        }
                    })
                }
            },
            planItemClick(data) {
                this.queryCondition.categoryName = data.categoryName;
                this.queryCondition.categoryCodeList = [data.categoryCode];
                this.catelogShow = false;
            },
            // 数据同步
            dataSync() {
                const _this = this
                api.serviceitem.dataSync((res) => {
                    if(res.data.code === 'success') {
                        Message({
                            type: 'info',
                            message: '数据初始化成功'
                        })
                    }
                })
            },
            // 节点展开事件
            expandClick() {},
            // 服务信息查询
            query(arg) {
                const _this = this
                let option = {}
                if(_this.queryCondition.serviceName !== '') {
                    option.serviceName = _this.queryCondition.serviceName
                }
                // if(_this.queryCondition.categoryCode !== '') {
                //     option.categoryCode = _this.queryCondition.categoryCode
                // }
                option.categoryCodeList = _this.queryCondition.categoryCodeList
                if(_this.queryCondition.onOffFlag !== '') {
                    option.onOffFlag = _this.queryCondition.onOffFlag
                }
                if(_this.queryCondition.skuType !== '') {
                    option.skuType = _this.queryCondition.skuType
                }
                if(_this.queryCondition.priceType !== '') {
                    option.priceType = _this.queryCondition.priceType
                }
                option.pageStart = arg
                option.pageNums = config.pageNums
                api.serviceitem.queryByPage(option, (res) => {
                    if(res.data.code === 'success') {
                        // _this.tablelist = res.data.obj.list 
                        let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        _this.setTableList(res.data.obj.list)
                        _this.setPageIndex(tempPage)
                    }
                })
            },
            setIndex(arg) {
                const _this = this
                _this.editCode = arg
            },
            pageChange(num) {
                const _this = this
                _this.query(num)
            },
            // 仅显示内容
            showDetail(arg) {
                const _this = this
                _this.$router.push({
                    path: `/serviceitem/show/${arg + 'show'}`
                })
            },
            add() {
                const _this = this
                _this.$router.push({
                    path: `/serviceitem/add/${'0'}`
                })
            },
            edit() {
                const _this = this
                if(_this.editCode === '') {
                    Message({
                        type: 'warning',
                        message: '请选择编辑项'
                    })
                    return;
                }
                _this.$router.push({
                    path: `/serviceitem/edit/${_this.editCode}`
                })
            }
        },
        created() {
            const _this = this
            _this.itemlist = config.serviceitem.yesOrno
            _this.priceTypeslist = config.serviceitem.pricetype
            // _this.getPriceTypes()
        }
    }
</script>

<style scoped>
    .select-tree {
        position: absolute;
        margin-top: 6px;
        width: 100%;
        z-index: 1000;
    }
    .special {
        vertical-align: middle !important;
        height: 10px;
    }
    .self_constrol {
        height: auto !important;
    }
    .el-tree {
        max-height: 300px;
        overflow-y: scroll;
    }
</style>
