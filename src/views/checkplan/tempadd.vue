<template>
    <div>
        <b-card>
            <!-- <div slot="header">
                <strong>新建</strong>
            </div> -->
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="盘点单号*" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="plan.no" placeholder="" :readonly="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="盘点名称*" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="plan.name" placeholder="" :readonly="showRulsSel"/>
                    </b-form-fieldset>
                </div>                
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset label="选择经销商店*" :label-cols="4" horizontal class="text-right">
                        <areaqueryshop ref="areaqueryshop" @select-change="selectedfun" :readonly="showRulsSel"  class="text-left"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="仓库名称*" :label-cols="4" class="text-right">
                        <b-form-select v-model="plan.whCode" :options="entreList"  :disabled="showRulsSel"></b-form-select>
                    </b-form-fieldset> 
                </div>
            </div>         
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="盘点类型*" :label-cols="4" class="text-right">
                        <b-form-select v-model="plan.skuType" :options="typelist" disabled></b-form-select>
                    </b-form-fieldset> 
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="盘单类型*" :label-cols="4" class="text-right">
                        <b-form-input value="手动" :readonly="true"></b-form-input>
                    </b-form-fieldset> 
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="success" @click="build" v-show="!showRulsSel">新增</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card no-body v-show="showRulsSel" class="tab-tempadd-box">
        <!-- <b-card no-body> -->
            <b-tabs card>
                <b-tab title="按商品分类查询" v-if="isShowSort" active>
                    <div class="row">
                        <div class="col-md-6 col-lg-6">
                            <b-form-fieldset horizontal label="按分类筛选" :label-cols="4" horizontal class="text-right">
                                <div @click="inventoryControl" ref="distr">
                                    <b-form-input v-model="regulation.categoryName" readonly />
                                </div>
                                <div class="text-left select-tree self_constrol control-style" v-show="planShow">
                                    <!-- <el-tree :data="planTreeData" :props="planOptions" :load="planNode" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="planItemClick"> -->
                                    <el-tree :data="planTreeData" :props="planOptions" :load="planNode" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="hasExpandClick" @node-click="planItemClick" @node-expand="expandClick">
                                    </el-tree>
                                </div>
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6 col-lg-6">
                            <b-form-fieldset horizontal label="库存变动" :label-cols="4" class="text-right">
                                <b-form-select v-model="submitRegulation.isStockInOutChange" :options="stockChangelist"></b-form-select>
                            </b-form-fieldset> 
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 col-lg-6">
                            <b-form-fieldset horizontal label="单件库存数量" :label-cols="4" horizontal class="text-right">
                                <div class="row">
                                    <div class="col-md-6 col-lg-6">
                                        <b-form-select v-model="submitRegulation.skuStockQuantityCondition" :options="comparelist"></b-form-select>
                                    </div>
                                    <div class="col-md-6 col-lg-6">
                                        <b-form-input v-model="submitRegulation.skuStockQuantity" placeholder=""/>
                                    </div>
                                </div>
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6 col-lg-6">
                            <b-form-fieldset horizontal label="单件库存金额" :label-cols="4" class="text-right">
                                <div class="row">
                                    <div class="col-md-6 col-lg-6">
                                        <b-form-select v-model="submitRegulation.skuStockAmountCondition" :options="comparelist"></b-form-select>
                                    </div>
                                    <div class="col-md-6 col-lg-6">
                                        <b-form-input v-model="submitRegulation.skuStockAmount" placeholder=""/>
                                    </div>
                                </div>
                            </b-form-fieldset> 
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="pull-right">
                                <b-button size="sm" variant="success" @click="tempbuild(0)">新增</b-button>
                            </div>
                        </div>
                    </div>
                </b-tab>
                <b-tab title="按SKU查询" v-if="isShowSku">
                    <div class="row">
                        <div class="col-md-6 col-lg-6">
                            <b-form-fieldset horizontal label="SKU名称" :label-cols="4" horizontal class="text-right">
                                <div class="text-left">
                                    <search 
                                        ref="search"
                                        :hasCheck="required"
                                        :dataList="datalist"  
                                        option="skuName" 
                                        @dataChange="querySelect"
                                        @itemValue="itemValue"
                                        @clickShowBack="firstLoad"
                                        @comScroll="comScroll"
                                        :disabled="isforbidden">
                                    </search>
                                </div>
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6 col-lg-6">
                            <b-form-fieldset horizontal label="SKU编码" :label-cols="4" class="text-right">
                                <b-form-input v-model="skuCode" placeholder="" :readonly="true"/>
                            </b-form-fieldset> 
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="pull-right">
                                <b-button size="sm" variant="success" @click="tempbuild(1)">新增</b-button>
                            </div>
                        </div>
                    </div>
                </b-tab>
            </b-tabs>   
        </b-card>
        <b-card v-show="showRulsSel">
        <!-- <b-card> -->
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="danger" @click="deleteItem">删除条目</b-button>
                    </div>
                </div>
            </div>
            <!-- <b-form-group>
                <b-form-checkbox-group id="checkboxes2" name="flavour2" v-model="selected"> -->
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="tablelist" :fields="fields">
                    <template slot="index" slot-scope="data">
                        <div>
                            <!-- <input type="checkbox" :value="data.item" name="check" /> -->
                            <!-- <b-form-checkbox :value="data.item.inventoryPlanRuleCode">{{data.item.inventoryPlanRuleCode}}</b-form-checkbox> -->
                            <input type="checkbox" name="selected" :value="data.item.inventoryPlanRuleCode" v-model="selected"/>
                            <!-- <b-form-checkbox-group v-model="selected" name="flavour1" :options="data.item.inventoryPlanRuleCode">
                            </b-form-checkbox-group> -->
                        </div>
                    </template>
                    <!-- <template slot="workFlow" scope="data">
                        {{ data.item.wfName }}
                    </template> -->
                    <template slot="rulesCode" slot-scope="data">
                        {{ data.item.inventoryPlanRuleCode }}
                    </template>
                    <template slot="rangeStyle" slot-scope="data">
                        <!-- {{ data.item.carBrandName }} -->
                        <!-- {{ sortType }} -->
                        {{ data.item.rangeType === 1? 'SKU查询' : '商品分类查询' }}
                    </template>
                    <template slot="productsort" slot-scope="data">
                        {{ data.item.categoryName4 ? data.item.categoryName4:'' }}
                        {{ data.item.categoryName4 ? '': data.item.categoryName3 }}
                        {{ data.item.categoryName3 ? '': data.item.categoryName2 }}
                        {{ data.item.categoryName2 ? '': data.item.categoryName1 }}
                    </template>
                    <template slot="skuCode" slot-scope="data">
                        {{ data.value }}
                    </template>
                    <template slot="skuName" slot-scope="data">
                        {{ data.value }}
                    </template>
                    <template slot="inventoryChange" slot-scope="data">
                        {{ data.item.isStockInOutChange === 0 ? '否' : (data.item.isStockInOutChange === 1 ? '是' : '全部') }}
                    </template>
                    <template slot="inventoryNum" slot-scope="data">
                        {{ data.item.skuStockQuantityCondition === '' ? '全部' : (data.item.skuStockQuantityCondition === 0 ? '大于等于' : '小于等于') }}{{ data.item.skuStockQuantityCondition !== '' ?(data.item.rangeType === 1? '' : data.item.skuStockQuantity) : '' }}
                    </template>
                    <template slot="inventoryValue" slot-scope="data">
                        {{ data.item.skuStockAmountCondition === ''? '全部' : (data.item.skuStockAmountCondition === 0 ? '大于等于' : '小于等于') }}{{ data.item.skuStockAmountCondition !== ''? (data.item.rangeType === 1? '' : data.item.skuStockAmount) : '' }}
                    </template>
                    <template slot="empty">
                        暂无数据...
                    </template>
                </b-table>
            </div>
                <!-- </b-form-checkbox-group>
            </b-form-group> -->
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <div class="row">
                        <div class="col-md-6 col-lg-6">
                            全选&nbsp;&nbsp;&nbsp;
                            <input type="checkbox" v-model="isAll" name="check" @click="chooseAll"/>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-6">
                    <div class="pull-right">
                        <b-button size="sm" variant="danger" @click="cancel">取消</b-button>
                        <b-button size="sm" variant="success" @click="creatBlitem" v-if="creatTampblitem">生成盘点单</b-button>
                    </div>
                </div>
            </div>
        </b-card>
    </div>
</template>
<script>
    import Vue from 'vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import search from 'components/iris-search/search.vue'
    import { MessageBox, Message, DatePicker, Tree } from 'element-ui'
    import api from 'common/api'
    import config from 'common/config'
    import collectionApi from 'common/api-collection.js'
    import {hasBtn} from 'common/api-common.js'
    Vue.use(DatePicker)
    Vue.use(Tree)
    export default {
        components: {
            areaqueryshop,
            search
        },
        data() {
            return {
                planTreeData: [],
                comparelist: [],
                inventoryChange: '',
                hasExpandClick: false,
                selected: [],
                plan: {
                    style: 'manualInventory',
                    skuType:'1',
                    whCode: '',
                    storeCode: '',
                    name: '',
                    no:'',
                    areaCode: '',                                      
                    state: ''
                },
                skuName: '',
                skuCode: '',
                // 控制主表按钮
                editControll: true,
                isAll: false,
                // 临时盘点单号
                showRulsSel:false,
                // 判断是否来自临时盘点单
                itemChoose: false,
                isShowSort: true,
                isShowSku: true,
                hasSaved: false,
                planShow: false,
                isforbidden: false,
                regulation: {
                    categoryCode: '022242',
                    categoryName: '精品',
                    categoryCode1: '',
                    categoryName1: '',
                    categoryCode2: '',
                    categoryName2: '',
                    categoryCode3: '',
                    categoryName3: '',
                    categoryCode4: '',
                    categoryName4: '',

                },
                submitRegulation: {
                    inventoryPlanNo: '',
                    inventoryPlanRuleCode: '',
                    categoryCode1: '',
                    categoryCode2: '',
                    categoryCode3: '',
                    categoryCode4: '',
                    categoryName1: '',
                    categoryName2: '',
                    categoryName3: '',
                    categoryName4: '',
                    skuStockAmountCondition: '',
                    skuStockAmount: '',
                    skuStockQuantityCondition: '',
                    skuStockQuantity: '',
                    isStockInOutChange: -1
                },
                planOptions: {
                    children: 'children',
                    label: 'categoryName'
                },
                stateJudge: false,// 主表禁用状态
                statelist: [],
                tablelist: [],
                entreList: [],
                days: [],
                months: [
                    {
                        text: '月循环',
                        value: 0
                    }
                ],
                typelist: [],
                fields: {
                    index: {
                        label: ' '
                    },
                    // workFlow: {
                    //     label: '工作流名称'
                    // },
                    rulesCode: {
                        label: '盘点计划规则编码'
                    },
                    rangeStyle: {
                        label: '盘点范围类型'
                    },
                    skuCode: {
                        label: 'SKU编码'
                    },
                    skuName: {
                        label: 'SKU名称'
                    },
                    inventoryChange: {
                        label: '库存变动'
                    },
                    inventoryNum: {
                        label: '单件库存数量'
                    },
                    inventoryValue: {
                        label: '单件库存金额'
                    }
                },
                // 下拉数据
                datalist: [],
                selectParams: {
                    skuType: 'goodsTypeGood',
                    pageNums: config.pageNums,
                    pageStart: 1,
                    warehouseCheckFlag: 1
                },
                isLastPage: false,
                required: false
            }
        },
        computed: {
            creatTampblitem(){
				return hasBtn(collectionApi.blitem.creatTampblitem);
			}
        },
        methods: {
            // 新增主表信息
            build() {
                const _this = this
                if( _this.plan.name == '') {
                    Message({ 
                        type: 'warning', 
                        message: '请填写盘点单名称!'
                    });
                    return
                }else if( _this.plan.storeCode == '') {
                    Message({ 
                        type: 'warning', 
                        message: '请选择门店!'
                    });
                    return
                }else if( _this.plan.whCode == '') {
                    Message({ 
                        type: 'warning', 
                        message: '请选择仓库!'
                    });
                    return
                }else if( _this.plan.skuType == '') {
                    Message({ 
                        type: 'warning', 
                        message: '请选择盘点类型!'
                    });
                    return
                }
                _this.showRulsSel = true;
            },
            // 区域经销商店
            selectedfun(data,data1){
                const _this = this
                if(data) {
                    for(let i =0; i<data.length; i++) {
                        _this.plan.areaCode = data[i].code
                    }
                }             
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
                        const array = res.data.obj
                        _this.entreList = [];
                        for(var i =0; i< array.length; i++) {
                            let obj = {}
                            obj.text = array[i].warehouseName
                            obj.value = array[i].warehouseCode
                            _this.entreList.push(obj)
                        }
                    }
                })
            },
            datechange() {

            },
            planItemClick(data) {
                this.regulation.categoryName = data.categoryName;
                this.regulation.categoryCode = data.categoryCode;
                this.planShow = false;
            },
            // 获取盘点单号
            getCheckCode() {
                const _this = this
                const option = {
                    'serviceCode': config.checkTicket.seqCode
                }
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {
                        _this.plan.no = res.data.obj
                    }
                })
            },
            // 搜索框内值改变   触发搜索 
            querySelect(data) {
                const _this = this
                _this.selectParams.pageStart = 1;
                _this.selectParams.skuName = data;
                let params = _this.selectParams; 
                _this.getSupplierName(params, function(res) {
                    _this.isLastPage = res.isLastPage
                    _this.datalist = res.list              
                })
            },
            // 选中某一项
            itemValue(value) {
                const _this = this 
                _this.skuCode = value.skuCode
                _this.skuName = value.skuName
            },
            // 第一次加载数据
            firstLoad() {
                const _this = this
                if(_this.datalist.length != 0 ){
                    return 
                }
                let params = _this.selectParams
                _this.getSupplierName(params, function(res) {
                    _this.isLastPage = res.isLastPage
                    _this.datalist = res.list
                })
            },
            // 滚动加载
            comScroll(isEnd) {
                if (isEnd && !this.isLastPage) {
                    this.selectParams.pageStart ++
                    let params = this.selectParams;        
                    this.getSupplierName(params, obj => {
                        this.isLastPage = obj.isLastPage;
                        this.datalist = this.datalist.concat(obj.list);
                    });
                }
            },
            // 定义向后台请求supplierName的方法
            getSupplierName(params,callback) {
                api.checkPlan.querySkuInfo(params, res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        callback(obj);
                    }
                })
            },

            // 分类列表展示和隐藏控制
            inventoryControl() {
                const _this = this
                _this.planShow = !_this.planShow
            },
            // 节点展开事件
            expandClick() {},
            // 加载分类数据
            planNode(node, resolve) {
                const _this = this
                if (node.level === 0) {
                    let params = { categoryCode: config.classification.rootCode };
                    api.checkPlan.getSkuCategoryInfoBycategoryCode(params).then(res => {
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
                    if(node.level === 1) {
                        _this.regulation.categoryCode1 = node.data.categoryCode
                        _this.regulation.categoryName1 = node.data.categoryName
                    }else if(node.level === 2) {
                        _this.regulation.categoryCode2 = node.data.categoryCode
                        _this.regulation.categoryName2 = node.data.categoryName
                    }else if(node.level === 3) {
                        _this.regulation.categoryCode3 = node.data.categoryCode
                        _this.regulation.categoryName3 = node.data.categoryName
                    }else if(node.level === 4) {
                        _this.regulation.categoryCode4 = node.data.categoryCode
                        _this.regulation.categoryName4 = node.data.categoryName
                    }
                    let params = { categoryCode: node.data.categoryCode };
                    api.checkPlan.getSkuCategoryInfoBycategoryCode(params).then(res => {
                        if (res.data.code === 'success') {
                            let items = res.data.obj.skuCategorySubInfo;
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
            // 全选
            chooseAll() {
                const _this = this
                if(_this.isAll) {
                    _this.itemChoose = false
                }else {
                    _this.itemChoose = true
                }
            },
            // 临时新增数据   未调用接口
            tempbuild(arg) {
                const _this = this
                if(arg === 1) {
                    if(!_this.skuCode) {
                        Message({
                            type: 'warning',
                            message: '请选择商品'
                        })
                        return
                    }
                    _this.fields = {
                        index: {
                            label: ' '
                        },
                        // workFlow: {
                        //     label: '工作流名称'
                        // },
                        rulesCode: {
                            label: '盘点计划规则编码'
                        },
                        rangeStyle: {
                            label: '盘点范围类型'
                        },
                        productsort: {
                            label: '商品分类'
                        },
                        skuCode: {
                            label: 'SKU编码'
                        },
                        skuName: {
                            label: 'SKU名称'
                        }
                    }
                    for(let i = 0; i < _this.tablelist.length; i++) {
                        if(_this.tablelist[i].skuCode === _this.skuCode) {
                            return;
                        }
                    }
                    _this.submitRegulation.skuName = _this.skuName
                    _this.submitRegulation.skuCode = _this.skuCode
                    _this.submitRegulation.rangeType = 1
                    // _this.sortType = '按SKU分类'
                    _this.isShowSort = false
                }else {
                    _this.fields = {
                        index: {
                            label: ' '
                        },
                        // workFlow: {
                        //     label: '工作流名称'
                        // },
                        rulesCode: {
                            label: '盘点计划规则编码'
                        },
                        rangeStyle: {
                            label: '盘点范围类型'
                        },
                        productsort: {
                            label: '商品分类'
                        },
                        inventoryChange: {
                            label: '库存变动'
                        },
                        inventoryNum: {
                            label: '单件库存数量'
                        },
                        inventoryValue: {
                            label: '单件库存金额'
                        }
                    }
                    if((_this.submitRegulation.skuStockAmountCondition != '')&&(_this.submitRegulation.skuStockAmount === '')) {
                        Message({
                            type: 'info',
                            message: '请补全单件库存金额'
                        });
                        return
                    }
                    if((_this.submitRegulation.skuStockQuantityCondition != '')&&(_this.submitRegulation.skuStockQuantity === '')) {
                        Message({
                            type: 'info',
                            message: '请补全单件库存数量'
                        });
                        return
                    }
                    if((_this.submitRegulation.skuStockAmount != '')&&(_this.submitRegulation.skuStockAmountCondition === '')) {
                        Message({
                            type: 'info',
                            message: '请补全单件库存金额条件'
                        });
                        return
                    }
                    if((_this.submitRegulation.skuStockQuantity != '')&&(_this.submitRegulation.skuStockQuantityCondition === '')) {
                        Message({
                            type: 'info',
                            message: '请补全单件库存数量条件'
                        });
                        return
                    }
                    let obj = _this.submitRegulation
                    // 分类数据拼装 categoryCode
                    for(let j = 0; j < _this.tablelist.length; j++) {
                        if(_this.regulation.categoryCode === _this.tablelist[j].categoryCode1 || 
                        _this.regulation.categoryCode === _this.tablelist[j].categoryCode2 || 
                        _this.regulation.categoryCode === _this.tablelist[j].categoryCode3 ||
                        _this.regulation.categoryCode === _this.tablelist[j].categoryCode4) {
                            return;
                        }
                    }
                    let judgeCondition = _this.regulation.categoryCode
                    _this.submitRegulation.categoryCode1 = _this.regulation.categoryCode1
                    _this.submitRegulation.categoryCode2 = _this.regulation.categoryCode2
                    _this.submitRegulation.categoryCode3 = _this.regulation.categoryCode3
                    _this.submitRegulation.categoryCode4 = _this.regulation.categoryCode4
                    _this.submitRegulation.categoryName1 = _this.regulation.categoryName1
                    _this.submitRegulation.categoryName2 = _this.regulation.categoryName2
                    _this.submitRegulation.categoryName3 = _this.regulation.categoryName3
                    _this.submitRegulation.categoryName4 = _this.regulation.categoryName4
                    let k, j
                    for (k in obj) {
                        if(obj[k] === '') {
                            if(k.startsWith('categoryCode')) {
                                _this.submitRegulation[k] = _this.regulation.categoryCode
                                break
                            }
                        } 
                    }
                    for (j in obj) {
                        if(obj[j] === '') {
                            if(j.startsWith('categoryName')) {
                                _this.submitRegulation[j] = _this.regulation.categoryName
                                break
                            }
                        } 
                    }
                    _this.submitRegulation.rangeType = 0
                    // _this.sortType = '按商品分类'
                    _this.isShowSku = false
                }
                // 生产盘点规则单号
                const option = {
                    'serviceCode': config.checkPlan.seqReg
                }
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {
                        // debugger

                        // _this.submitRegulation.inventoryPlanRuleCode = res.data.obj
                        // _this.submitRegulation.inventoryPlanNo = _this.plan.code
                        let objOne = JSON.parse(JSON.stringify(_this.submitRegulation))
                        objOne.inventoryPlanRuleCode = res.data.obj
                        objOne.inventoryPlanNo = _this.plan.code
                        _this.tablelist.push(objOne)
                        console.log(_this.tablelist)
                    }
                })
            },
            // 删除条目
            deleteItem() {
                const _this = this
                if(_this.isAll) {
                    _this.tablelist = []
                    _this.isAll = false
                    _this.itemChoose = false
                }else {
                    for(let i = 0; i < _this.tablelist.length; i++) {
                        for(let j = 0; j < _this.selected.length; j++) {
                            if(_this.tablelist[i].inventoryPlanRuleCode === _this.selected[j]) {
                                _this.tablelist.splice(i, 1)
                            }
                        }
                    }
                }
                if(_this.tablelist.length === 0) {
                    _this.isShowSort = true
                    _this.isShowSku = true
                    _this.fields = {
                        index: {
                            label: ' '
                        },
                        // workFlow: {
                        //     label: '工作流名称'
                        // },
                        rulesCode: {
                            label: '盘点计划规则编码'
                        },
                        rangeStyle: {
                            label: '盘点范围类型'
                        },
                        skuCode: {
                            label: 'SKU编码'
                        },
                        skuName: {
                            label: 'SKU名称'
                        },
                        inventoryChange: {
                            label: '库存变动'
                        },
                        inventoryNum: {
                            label: '单件库存数量'
                        },
                        inventoryValue: {
                            label: '单件库存金额'
                        }
                    }
                }
            },
            // 保存规则   调用接口
            creatBlitem() {
                const _this = this
                if( _this.tablelist.length == 0) {
                    Message({ 
                        type: 'warning', 
                        message: '请选择生成盘点单规则!!'
                    });
                    return
                }
                let params = {
                    inventoryNo: _this.plan.no,
                    inventoryName: _this.plan.name,
                    storeCode: _this.plan.storeCode,
                    whCode: _this.plan.whCode,
                    inventoryTypeCode: _this.plan.style,
                    inventorySkuType: _this.plan.skuType,
                    inventoryPlanRuleInfos:_this.tablelist,
                };  
                 api.blitem.creatTampblitem(params, (res) => {
                        if(res.data.code === 'success') {
                            this.$router.push({name: 'blitemDetails', query: {inventoryNo: res.data.obj.inventoryNo}})
                        }
                })
                
            },
            // 取消
            cancel() {
                const _this = this
                _this.$router.push({
                    path : `/blitem/blitemSearch`
                })
            },
            // 删除条目
            removeItem() {

            },
            //  获取计划单信息 
            getPlanByOrder() {
                const _this = this
                _this.getCheckCode()
            }
        },
        created() {
            const _this = this
            _this.typelist = config.checkPlan.typelist
            _this.comparelist = config.checkPlan.comparelist
            _this.stockChangelist = config.checkPlan.isStockInOutChangeList
            _this.getPlanByOrder()
        },
        watch: {
            isAll: function(newValue, oldValue) {
                const _this = this
                if(newValue) {
                    let judge = false
                    _this.tablelist.forEach((element) => {
                        for(let i = 0; i < _this.selected.length; i++) {
                            if(_this.selected[i] === element.inventoryPlanRuleCode) {
                                judge = true
                            }
                        }
                        if(!judge) {
                            _this.selected.push(element.inventoryPlanRuleCode)
                        }
                    })
                }else {
                     _this.selected = []
                }
            }
        }
    }
</script>
<style>
.modal-dialog {
    margin: 80px auto !important;
}
.tab-tempadd-box .tab-content .tab-pane {
    overflow: inherit!important;
}
/* .el-tree {
    height: 300px;
    position: absolute;
    width: 100%;
    z-index: 99999;
    overflow-y: auto;
} */
</style>
