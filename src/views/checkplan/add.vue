<template>
    <div @click="controlFromBody">
        <b-card v-if="!istempTicket">
            <!-- <div slot="header">
                <strong v-if="judgeEdit === ''">新建</strong>
                <strong v-if="judgeEdit === 'show'">详情</strong>
                <strong v-if="judgeEdit === 'edit'">编辑</strong>
            </div> -->
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="盘点计划名称*" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="plan.name" placeholder="" :state="stateControl.inventoryPlanName" :readonly="stateJudge || isJustShow || editForbidden"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="盘点计划单号*" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="plan.code" placeholder="" :readonly="true"/>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset label="选择经销商店*" :label-cols="4" horizontal class="text-right">
                        <areaqueryshop ref="areaqueryshop" :readonly="editForbidden" :error="stateControl.storeCode" @select-change="selectedfun"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="仓库名称*" :label-cols="4" class="text-right">
                        <b-form-select v-model="plan.whCode" :options="entreList" :state="stateControl.whCode" :disabled="stateJudge || isJustShow || editForbidden"></b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="计划类型*" :label-cols="4" class="text-right">
                        <div class="row">
                            <div class="col-md-6 col-lg-6">
                                <b-form-fieldset horizontal label="月" label-text-align="left" :label-cols="3">
                                    <b-form-select v-model="plan.month" :state="stateControl.inventoryPlanType" :options="months" :disabled="stateJudge || isJustShow || editForbidden"></b-form-select>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-6 col-lg-6">
                                <b-form-fieldset horizontal label="日" label-text-align="left" :label-cols="3">
                                    <b-form-select v-model="plan.day" :state="stateControl.inventoryPlanDay" :options="days" :disabled="stateJudge || isJustShow || editForbidden"></b-form-select>
                                </b-form-fieldset>
                            </div>
                        </div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="盘点类型*" :label-cols="4" class="text-right">
                        <b-form-select v-model="plan.style" :options="typelist" :state="stateControl.inventorySkuType" :disabled="stateJudge || isJustShow || editForbidden"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset label="状态*" :label-cols="4" horizontal class="text-right">
                        <b-form-select v-model="plan.state" :options="statelist" :state="stateControl.inventoryPlanStatus" :disabled="stateJudge || isJustShow"></b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row" v-if="!isJustShow">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button v-if="addControll&&addBtn" size="sm" variant="success" @click="build">新增</b-button>
                        <b-button v-if="editControll&&editBtn" size="sm" variant="success" @click="edit">保存</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card v-if="hasSaved&&editState" no-body class="tab-tempadd-box">
        <!-- <b-card no-body> -->
            <b-tabs card>
                <b-tab title="按商品分类查询" v-if="isShowSort" active>
                    <div class="row">
                        <div class="col-md-6 col-lg-6">
                            <b-form-fieldset horizontal label="按分类筛选" :label-cols="4" horizontal class="text-right">
                                <div @click.stop="inventoryControl" ref="distr">
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
        <b-card v-if="(hasSaved&&!isJustShow)&&editState">
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
                            <input type="checkbox" name="selected" :value="data.item.inventoryPlanRuleCode" v-model="selected"></input>
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
                        {{ data.item.skuCode }}
                    </template>
                    <template slot="skuName" slot-scope="data">
                        {{ data.item.skuName }}
                    </template>
                    <template slot="inventoryChange" slot-scope="data">
                        {{ data.item.isStockInOutChange === 0 ? '否' : (data.item.isStockInOutChange === 1 ? '是' : '全部') }}
                    </template>
                    <template slot="inventoryNum" slot-scope="data">
                        {{ data.item.skuStockAmountCondition === ''? '全部' : (data.item.skuStockAmountCondition === 0 ? '大于等于' : '小于等于') }}{{ data.item.skuStockAmountCondition !== ''? (data.item.rangeType === 1? '' : data.item.skuStockAmount) : '' }}
                    </template>
                    <template slot="inventoryValue" slot-scope="data">
                        {{ data.item.skuStockQuantityCondition === '' ? '全部' : (data.item.skuStockQuantityCondition === 0 ? '大于等于' : '小于等于') }}{{ data.item.skuStockQuantityCondition !== '' ?(data.item.rangeType === 1? '' : data.item.skuStockQuantity) : '' }}
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
                            <input type="checkbox" v-model="isAll" name="check"/>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-6">
                    <div class="pull-right">
                        <b-button size="sm" variant="danger" @click="cancel">取消</b-button>
                        <b-button size="sm" v-if="regulationBtn" variant="success" @click="save">保存</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card v-if="isJustShow || !editState">
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="tablelist" :fields="fields">
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
                        {{ data.item.skuCode }}
                    </template>
                    <template slot="skuName" slot-scope="data">
                        {{ data.item.skuName }}
                    </template>
                    <template slot="inventoryChange" slot-scope="data">
                        {{ data.item.isStockInOutChange === 0 ? '否' : (data.item.isStockInOutChange === 1 ? '是' : '全部') }}
                    </template>
                    <template slot="inventoryNum" slot-scope="data">
                        {{ data.item.skuStockAmountCondition === 0 ? '大于等于' : '小于等于' }}{{ data.item.rangeType === 1? '' : data.item.skuStockAmount }}
                    </template>
                    <template slot="inventoryValue" slot-scope="data">
                        {{ data.item.skuStockQuantityCondition === 0 ? '大于等于' : '小于等于' }}{{ data.item.rangeType === 1? '' : data.item.skuStockQuantity }}
                    </template>
                    <template slot="empty">
                        暂无数据...
                    </template>
                </b-table>
            </div>
        </b-card>
    </div>
</template>
<script>
    import Vue from 'vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import {mapState, mapMutations, mapActions} from 'vuex'
    import search from 'components/iris-search/search.vue'
    import {hasBtn} from 'common/api-common.js'
    import { MessageBox, Message, DatePicker, Tree } from 'element-ui'
    import collectionApi from 'common/api-collection.js'
    import api from 'common/api'
    import config from 'common/config'
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
                // from tempTicket
                tempTicketJudge: '',
                jumpCondition: '0',
                selected: [],
                plan: {
                    style: '',
                    whCode: '',
                    code: '',
                    name: '',
                    areaCode: '',
                    month: '',
                    day: '',
                    state: 1,
                    storeCode: ''
                },
                sortType: '',
                skuName: '',
                skuCode: '',
                // 控制主表按钮
                addControll: true,
                editControll: true,
                isAll: false,
                // 临时盘点单号
                checkCode: '',
                // 判断是否来自临时盘点单
                istempTicket: false,
                isShowSort: true,
                isShowSku: true,
                hasSaved: false,
                planShow: false,
                isforbidden: false,
                isJustShow: false,
                editState: true,
                editForbidden: false,
                judgeEdit: '',
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
                timeStep: '',
                typelist: [],
                fields: {
                    index: {
                        label: '选择'
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
                    },
                    inventoryChange: {
                        label: '库存变动'
                    },
                    inventoryValue: {
                        label: '单件库存数量'
                    },
                    inventoryNum: {
                        label: '单件库存金额'
                    }
                },
                // 下拉数据
                datalist: [],
                selectParams: {
                    pageNums: config.pageNums,
                    pageStart: 1,
                    warehouseCheckFlag: 1
                },
                isLastPage: false,
                required: false,
                stateControl: {
                    inventoryPlanDay: null,
                    inventoryPlanName: null,
                    inventoryPlanType: null,
                    inventorySkuType: null,
                    storeCode: false,
                    whCode: null,
                    inventoryPlanStatus: null
                }
            }
        },
        computed: {
            ...mapState('checkplan',[
                'condition'
            ]),
            addBtn() {
                return hasBtn(collectionApi.checkPlan.addMain)
            },
            editBtn() {
                return hasBtn(collectionApi.checkPlan.stop)
            },
            regulationBtn() {
                return hasBtn(collectionApi.checkPlan.regulation)
            }
        },
        methods: {
            ...mapActions('checkplan',[
                'applicationAgain',
                'setCheckPage',
                'setTableList'
            ]),
            // 新增主表信息
            build() {
                const _this = this
                console.log(_this.plan)
                let judge = true
                let option = {
                    inventoryPlanDay: _this.plan.day,
                    inventoryPlanName: _this.plan.name,
                    inventoryPlanNo: _this.plan.code,
                    inventoryPlanType: _this.plan.month,
                    inventorySkuType: _this.plan.style,
                    storeCode: _this.plan.storeCode,
                    whCode: _this.plan.whCode,
                    inventoryPlanStatus: _this.plan.state
                }
                console.log(option)
                if(option.inventoryPlanDay === '') {
                    _this.stateControl.inventoryPlanDay = false
                    judge = false
                }else {
                    _this.stateControl.inventoryPlanDay = null
                }
                if(option.inventoryPlanName === '') {
                    _this.stateControl.inventoryPlanName = false
                    judge = false
                }else {
                    _this.stateControl.inventoryPlanName = null
                }
                if(option.inventoryPlanType === '') {
                    _this.stateControl.inventoryPlanType = false
                    judge = false
                }else {
                    _this.stateControl.inventoryPlanType = null
                }
                if(option.inventorySkuType === '') {
                    _this.stateControl.inventorySkuType = false
                    judge = false
                }else {
                    _this.stateControl.inventorySkuType = null
                }
                if(option.storeCode === '') {
                    _this.stateControl.storeCode = true
                    console.log(_this.stateControl.storeCode)
                    judge = false
                }else {
                    _this.stateControl.storeCode = false
                }
                if(option.whCode === '') {
                    _this.stateControl.whCode = false
                    judge = false
                }else {
                    _this.stateControl.whCode = null
                }
                if(option.inventoryPlanStatus === '') {
                    _this.stateControl.inventoryPlanStatus = false
                    judge = false
                }else {
                    _this.stateControl.inventoryPlanStatus = null
                }
                if(judge) {
                    api.checkPlan.addMain(option, (res) => {
                        if(res.data.code === 'success') {
                            _this.stateJudge = true
                            _this.hasSaved = true
                            _this.addControll = false
                            _this.editForbidden = true
                            Message({
                                type: 'info',
                                message: '操作成功'
                            });
                        }else {
                            Message({
                                type: 'danger',
                                message: '操作失败'
                            });
                        }
                    })
                }else {

                }
            },
            // vuex里放入列表信息
            getTableList() {
                const _this = this
                let option = {
                    inventoryPlanName: '',
                    inventoryPlanStatus: '',
                    whCode: '',
                    storeCode: '',
                    storeCodes: [],
                    areaCode: [],
                    pageNums: config.pageNums,
                    pageStart: 1
                }
                api.checkPlan.query(option, function(res){
                    if(res.data.code === 'success') {
                        let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                            // _this.tablelist = res.data.obj.list
                        _this.setTableList(res.data.obj.list)
                        _this.setCheckPage(tempPage)
                        _this.cancel()
                    }
                })
            },
            // 区域经销商店
            selectedfun(data,data1){
                const _this = this
                if(data) {
                    for(let i =0; i<data.length; i++) {
                        _this.plan.areaCode = data[i].code
                    }
                }
                if(data1) {
                    _this.plan.storeCode = data1.value ? data1.value: ""
                }
                const options = {
                    'storeCodeSet' : []
                }
                if(data1.value) {
                    _this.plan.storeCode = data1.value ? data1.value: ""
                }
                options.storeCodeSet.push(data1.value)
                // 根据经销商店获取仓库
                _this.entreList = []
                api.getEntrepot(options, function(res){
                    if(res.data.code === 'success') {
                        console.log(res)
                        const array = res.data.obj
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
            // 获取盘点计划单号和盘点类型
            getPlanCode() {
                const _this = this
                const option = {
                    'serviceCode': config.checkPlan.seqCode
                }
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {
                        _this.plan.code = res.data.obj
                    }
                })
            },
            // 获取盘点单号
            getCheckCode() {
                const _this = this
                const option = {
                    'serviceCode': config.checkTicket.seqCode
                }
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {
                        _this.checkCode = res.data.obj
                        _this.tempTicketJudge = 1
                    }
                })
            },
            // 搜索框内值改变   触发搜索
            querySelect(data) {
                // console.log(data)
                const _this = this
                _this.selectParams.pageStart = 1;
                _this.selectParams.skuName = data;
                let params = _this.selectParams;
                console.log(params)
                _this.getSupplierName(params, function(res) {
                    _this.isLastPage = res.isLastPage
                    _this.datalist = res.list
                })
            },
            // 选中某一项
            itemValue(value) {
                console.log(value)
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
                        console.log(obj)
                        callback(obj);
                    }
                })
            },
            // 选择框消失
            controlFromBody() {
                const _this = this
                _this.planShow = false
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
            },
            // 主表启用停用编辑
            edit() {
                const _this = this
                let option = {
                    'inventoryPlanNo': _this.plan.code,
                    'inventoryPlanStatus': _this.plan.state
                }
                api.checkPlan.editMainState(option, function(res){
                    if(res.data.code === "success"){
                        Message({
                            type: 'info',
                            message: '操作成功'
                        });
                        _this.$router.push({
                            path: '/checkplan/query'
                        })
                        _this.getTableList()
                    }else {
                        Message({
                            type: 'info',
                            message: '操作失败'
                        });
                    }
                })
            },
            // 临时新增数据   未调用接口
            tempbuild(arg) {
                const _this = this
                console.log(arg)
                if(arg === 1) {
                    if(!_this.skuCode) {
                        return
                    }
                    _this.fields = {
                        index: {
                            label: ' '
                        },
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
                    _this.isShowSort = false
                }else {
                    let obj = _this.submitRegulation
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
                    _this.isShowSku = false
                    _this.fields = {
                        index: {
                            label: ' '
                        },
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
                        inventoryValue: {
                            label: '单件库存数量'
                        },
                        inventoryNum: {
                            label: '单件库存金额'
                        }
                    }
                }
                // 生产盘点规则单号
                const option = {
                    'serviceCode': config.checkPlan.seqReg
                }
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {
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
                }else {
                    for(let i = 0; i < _this.tablelist.length; i++) {
                        for(let j = 0; j < _this.selected.length; j++) {
                            if(_this.tablelist[i].inventoryPlanRuleCode === _this.selected[j]) {
                                _this.tablelist.splice(i, 1)
                            }
                        }
                    }
                    _this.selected = []
                }
                if(_this.tablelist.length === 0) {
                    _this.isShowSort = true
                    _this.isShowSku = true
                    _this.fields = {
                        index: {
                            label: ' '
                        },
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
                        },
                        inventoryChange: {
                            label: '库存变动'
                        },
                        inventoryValue: {
                            label: '单件库存数量'
                        },
                        inventoryNum: {
                            label: '单件库存金额'
                        }
                    }
                }
            },
            // 保存规则   调用接口
            save() {
                const _this = this
                api.checkPlan.addRegulation(_this.tablelist, (res) => {
                    if(res.data.code === 'success') {
                        _this.getTableList()
                    }
                })
            },
            // 取消
            cancel() {
                const _this = this
                _this.$router.push({
                    path : `/checkplan/query`
                })
            },
            //  获取计划单信息
            getPlanByOrder() {
                const _this = this
                let planCode = _this.$route.params.orderNo
                _this.jumpCondition = planCode
                if(planCode === '0' || planCode === '1') {
                    _this.addControll = true
                    _this.editControll = false
                    if(planCode === '1') {
                        _this.istempTicket = true
                        _this.getCheckCode()
                    }else {
                        _this.getPlanCode()
                    }
                }else {
                    _this.editControll = true
                    _this.addControll = false
                    let option = {
                        inventoryPlanNo: planCode.slice(0, planCode.length-4)
                    }
                    api.checkPlan.queryAccordingCode(option, function(res) {
                        if(res.data.code === 'success') {
                            _this.plan.code = res.data.obj.inventoryPlanNo
                            _this.plan.name = res.data.obj.inventoryPlanName
                            _this.plan.day = res.data.obj.inventoryPlanDay
                            _this.plan.month = res.data.obj.inventoryPlanType
                            _this.plan.style = res.data.obj.inventorySkuType
                            _this.plan.state = res.data.obj.inventoryPlanStatus
                            _this.tablelist = res.data.obj.inventoryPlanRuleInfoVoList
                            let storeOption = {
                                text: res.data.obj.storeName,
                                value: res.data.obj.storeCode
                            }
                            _this.editForbidden = true
                            _this.$refs.areaqueryshop.setselect(storeOption)
                            _this.plan.whCode = res.data.obj.whCode
                            if(_this.tablelist === null || _this.tablelist.length === 0){
                                _this.editState = true
                            }else {
                                _this.editState = false
                            }
                        }
                    })
                    let judgeStr = planCode.slice(planCode.length -4, planCode.length)
                    _this.judgeEdit = planCode.slice(planCode.length -4, planCode.length)
                    if(judgeStr === 'show') {
                        _this.isJustShow = true
                    }else {
                        _this.hasSaved = true
                    }
                }
                _this.days = []
                for(var i =1; i<32; i++) {
                    let obj = {
                        text: i + '',
                        value: i
                    }
                    _this.days.push(obj)
                }
                _this.statelist = config.checkPlan.status
            }
        },
        watch: {
            selected: {
                handler: function(newValue, oldValue) {
                    const _this = this
                    if(_this.tablelist.length === newValue.length) {
                        _this.isAll = true
                    }else {
                        _this.isAll = false
                    }
                },
                deep: true 
            },
            isAll: function(newValue, oldValue) {
                const _this = this
                if(newValue) {
                    let judge = false
                    _this.tablelist.forEach((element) => {
                        for(let i = 0; i < _this.selected.length; i++) {
                            if(_this.selected[i] === element.inventoryPlanRuleCode) {
                                judge = true
                                console.log('进来了')
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
        },
        created() {
            const _this = this
            // 初始化相关数据
            _this.typelist = config.checkPlan.typelist
            _this.comparelist = config.checkPlan.comparelist
            _this.stockChangelist = config.checkPlan.isStockInOutChangeList
            _this.getPlanByOrder()
        }
    }
</script>
<style>
.modal-dialog {
    margin: 80px auto !important;
}

/* .el-tree {
    height: 300px;
    position: absolute;
    width: 100%;
    z-index: 99999;
    overflow-y: auto;
} */
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
    .self_constrol>.el-tree {
        max-height: 300px;
        overflow-y: scroll;
    }
</style>
