<template>
    <div class="animated fadeIn">
        <!-- 查询 -->
        <b-card header="查询">
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="调整类型" label-text-align="right" :label-cols="4">
                        <b-form-select  v-model="params.adjustType" :options="adjustTypes"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="账期" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="params.beTermNo" :options="beTermList"></b-form-select>                                
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset label="区域门店" :label-cols="4" horizontal class="text-right">
                        <areaqueryshop :storeAll="true"  ref="areaqueryshop"  @select-change="selectChange"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="仓库名称" :label-cols="4" class="text-right">
                        <b-form-select  v-model="params.whCode" :options="whList"></b-form-select>
                    </b-form-fieldset> 
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="商品编码" :label-cols="4" class="text-right">
                        <b-form-input  v-model="params.skuCode" />
                    </b-form-fieldset> 
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="商品名称" label-text-align="right" :label-cols="4">
                        <b-form-input  v-model="params.skuName" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="审批状态" label-text-align="right" :label-cols="4">
                        <b-form-select  v-model="params.wfStatus" :options="wfStatusList"/>
                    </b-form-fieldset>
                </div>
            </div>
            <query-btn-group @resetClick="reset" @query="query"></query-btn-group>
        </b-card>
        <!-- 列表 -->
        <b-card>
            <list-btn-group @insert="insert" @update="update" :showInit="false"></list-btn-group>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="stockAdjustOrderInfo.list" :fields="fields">
                    <template slot="index" slot-scope="data">
                        <input type="radio" name="radio" v-model="selectIndex" :value="data.index">
                    </template>
                    <template slot="adjustOrderNo" slot-scope="data">
                        <a href="javascript:;" @click="seeDetail(data.value, data.index)">{{data.value}}</a>
                    </template>
                    <template slot="storeWhName" slot-scope="data">
                        <span>{{data.item.storeName ? data.item.storeName + '-' : ''}}{{data.item.whName}}</span>
                    </template>
                    <template slot="wfStatus" slot-scope="data">
                        {{ data.value | wfStatusFilter }}
                    </template>
                    <template slot="empty">
                        暂无数据...                  
                    </template>
                </b-table>
            </div>
            <div class="row mt-2">
                <div class="col-md-12">
                    <pagination class="pull-right" 
                        @page-change="pageChange" 
                        :page-no="stockAdjustOrderInfo.pageNum" 
                        :page-size="stockAdjustOrderInfo.pageSize" 
                        :total-result="stockAdjustOrderInfo.total" 
                        :total-pages="stockAdjustOrderInfo.pages">
                    </pagination>
                </div>
            </div>
        </b-card>
        <!-- 弹窗 -->
        <el-dialog ref="dialog" 
                title="请选择调整类型" 
                no-close-on-backdrop 
                size="small" :visible.sync="dialogVisible" :modal-append-to-body="false">
            <div class="row">
                <div class="col-md-6 ">
                    <b-form-fieldset label="区域门店" :label-cols="4" horizontal class="text-right">
                        <areaqueryshop :storeAll="true" @select-change="insertSelectChange"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 ">
                    <b-form-fieldset horizontal label="仓库名称" :label-cols="4" class="text-right">
                        <b-form-select  v-model="insertParams.whCode" :options="insertWhList" :state="whState"></b-form-select>
                    </b-form-fieldset> 
                </div>
                <div class="col-md-6 ">
                    <b-form-fieldset horizontal label="成本计算类型" :label-cols="4" class="text-right">
                        <b-form-select v-model="insertParams.calCostTypeCode" :options="costCalculationTypes" :disabled="calCostType == 'byCount'"></b-form-select>
                    </b-form-fieldset> 
                </div>
            </div>
            <div class="row btn-center" > 
                <b-button size="sm" variant="success" style="marginRight: 10px" @click="adjust(0)" v-show="insertParams.calCostTypeCode != 'byCount'">调整数量</b-button>
                <b-button size="sm" variant="primary" @click="adjust(1)">调整金额</b-button>
            </div>
            <!-- <div slot="footer" class="dialog-footer dialog-footer-cla">     
                <b-button size="sm" variant="warning">下一步</b-button>
            </div> -->
        </el-dialog>
    </div>
</template>
<script>

import Areaqueryshop from 'components/iris-areaqueryshop/'
import Pagination from 'components/pagination/pagination'
import Search from 'components/iris-search/search'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import ListBtnGroup from 'components/list-btn-group/list-btn-group'

import config from 'common/config'
import api from 'common/api'
import { isSelected, getSequence, findTextByValue } from 'common/api-common'
import { STOCK_ADJUST_ORDER_SEQ } from 'common/sequence'
import { COST_CALCULATION_TYPE } from 'common/ref-code'

import Vue from 'vue'
import { DatePicker, Message, Dialog } from 'element-ui'
Vue.use(DatePicker)
Vue.use(Dialog)

import { mapGetters, mapActions } from 'vuex'

export default {
    components: {
        Pagination,
        Areaqueryshop,
        Search,
        QueryBtnGroup,
        ListBtnGroup
    },
    data() {
        return {
            // 查询
            adjustTypes: [
                {
                    text: "非整车",
                    value: 1
                }
            ],
            wfStatusList: [
                { text: "待提交", value: -1 },
                { text: "已提交", value: 0 },
                { text: "审批通过", value: 1 }
            ],
            beTermList: [],
            whList: [],
            params: {
                adjustType: 1,
                skuCode: '',
                skuName: '',
                wfStatus: '',
                beTermNo: '', 
                storeCodes:[],
                whCode: '',                 
                pageNums: config.pageNums,
                pageStart: 1,   
            },
            // 列表
            fields: {
                index: {
                    label: "选择"
                },
                adjustOrderNo: {
                    label: "库存调整单号"
                },
                storeWhName: {
                    label: "门店-仓库"
                },
                beTermNo: {
                    label: "账期"
                },
                wfStatus: {
                    label: "审核状态"
                }
            },
            selectIndex: -1,
            // 弹窗
            dialogVisible: false,
            whState: null,
            insertWhList: [],
            insertParams: {
                whCode: '',
                calCostTypeCode: ''
            },
            calCostType: ''     // 仓库成本计算类型
        }
    },
    computed: {
        ...mapGetters('stockAdjust', [
            'stockAdjustOrderInfo',
            'costCalculationTypes'
        ])
    },
    mounted() {
        this.getCostCalculationTypes(COST_CALCULATION_TYPE)
    },
    methods: {
        // 查询
        queryBeTermInfoNoPage(params) {
            api.stockAdjust.queryBeTermInfoNoPage(params).then(res => {
                if(res.data.code === 'success') {
                    let obj = res.data.obj
                    this.beTermList = []
                    this.params.beTermNo = ''
                    obj.forEach(item => {
                        this.beTermList.push({
                            text: item.beTermNo,
                            value: item.accountCode
                        })
                    })
                }
            })
        },
        selectChange(data, data1) {
            const options = {
                storeCodeSet: []
            }
            this.params.storeCodes = []
            if(data1 instanceof Array) {
                for (let i = 0; i < data1.length; i++) {
                    this.$set(this.params.storeCodes, i, data1[i].value)              
                }
            }else {
                options.storeCodeSet.push(data1.value)
                this.params.storeCodes = [data1.value]
                // 根据经销商店获取仓库
                api.getEntrepot(options, res => {
                    if (res.data.code === "success") {
                        let list = res.data.obj
                        this.whList = []
                        list.forEach(item => {
                            this.whList.push({
                                text: item.warehouseName,
                                value: item.warehouseCode
                            })
                        })
                    }
                })
                // 根据门店查询账期
                let params = {
                    storeCode: this.params.storeCodes[0],
                    accountStatus: 0
                }
                if(params.storeCode) {
                    this.queryBeTermInfoNoPage(params)
                }
            }
        },
        reset() {
            this.params.adjustType = 1
            this.params.skuCode = ''
            this.params.skuName = ''
            this.params.wfStatus = ''
            this.params.whCode = ''
            this.params.beTermNo = ''
            this.params.pageStart = 1   

            this.$refs.areaqueryshop.reset()                
            this.$refs.areaqueryshop.resetToStart()                       
        },
        query() {
            this.selectIndex = -1
            this.getStockAdjustOrderInfo(this.params)
        },
        // 列表
        insert() {
            this.dialogVisible = true
        },
        update() {
            isSelected(this.selectIndex, () => {
                let info = this.stockAdjustOrderInfo.list[this.selectIndex]
                this.getWhInfoByCode(info.whCode, obj => {                
                    this.$router.push({
                        path: 'detail',
                        query: {
                            pageState: 1,
                            adjustState: info.adjustType,    // 调整类型, 0 数量 1 金额
                            costCalculationType: info.calCostTypeCode,
                            adjustOrderNo: info.adjustOrderNo,
                            storeCode: info.storeCode,
                            storeName: info.storeName,
                            whCode: info.whCode,
                            whName: info.whName,
                            calCostType: obj.calCostType
                        }
                    })
                })
            })
        },
        seeDetail(adjustOrderNo, i) {
            let info = this.stockAdjustOrderInfo.list[i]     
            this.getWhInfoByCode(info.whCode, obj => {
                this.$router.push({
                    path: 'detail',
                    query: {
                        pageState: 2,
                        adjustOrderNo: adjustOrderNo,
                        adjustState: info.adjustType,    // 调整类型, 0 数量 1 金额
                        costCalculationType: info.calCostTypeCode,
                        storeCode: info.storeCode,
                        storeName: info.storeName,
                        whCode: info.whCode,
                        whName: info.whName,
                        calCostType: obj.calCostType
                    }
                })
            })       
        },
        pageChange(currentPage) {
            this.selectIndex = -1
            this.params.pageStart = currentPage
            this.getStockAdjustOrderInfo(this.params)
        },
        // 弹窗
        insertSelectChange(sale, store) {
            let params = {
                storeCodeSet: []
            }
            if(!Array.isArray(store)) {
                this.insertParams.storeCode = store.value
                this.insertParams.storeName = store.text
                params.storeCodeSet[0] = store.value
                api.getEntrepot(params, res => {
                    if (res.data.code === "success") {
                        let list = res.data.obj
                        this.insertWhList = []
                        list.forEach(item => {
                            this.insertWhList.push({
                                text: item.warehouseName,
                                value: item.warehouseCode
                            })
                        })
                    }
                })
            }
        },
        adjust(state) {
            this.whRequire(() => {
                getSequence(STOCK_ADJUST_ORDER_SEQ, res => {
                    this.$router.push({
                        path: 'detail',
                        query: {
                            pageState: 0,
                            adjustState: state,
                            costCalculationType: this.insertParams.calCostTypeCode,
                            adjustOrderNo: res,
                            storeCode: this.insertParams.storeCode,
                            storeName: this.insertParams.storeName,
                            whCode: this.insertParams.whCode,
                            whName: findTextByValue(this.insertParams.whCode, this.insertWhList),
                            calCostType: this.calCostType
                        }
                    })
                })
            })
        },
        whRequire(next) {
            if(!this.insertParams.whCode) {
                this.whState = 'invalid'
                return
            }else {
                this.whState = null
                next()
            }
        },
        getWhInfoByCode(whCode, next) {
            let params = { warehouseCode: whCode }
            api.warehouse.queryInfoByCode(params).then(res => {
                if(res.data.code === 'success') {
                    let obj = res.data.obj
                    next(obj)
                }
            })
        },
        ...mapActions('stockAdjust', [
            'getStockAdjustOrderInfo',
            'getCostCalculationTypes'
        ])
    },
    watch: {
        'insertParams.whCode': {
            handler(val) {
                if(val) {
                    this.whState = null
                    this.getWhInfoByCode(val, obj => {
                        this.calCostType = obj.calCostType
                        this.insertParams.calCostTypeCode = obj.calCostType
                    })
                }else {
                    this.whState = 'invalid'
                }
            },
            deep: true
        }
    },
    filters: {
        wfStatusFilter(val) {
            if(val == -1) {
                return '待提交'
            }else if(val == 0) {
                return '已提交'
            }else if(val == 1) {
                return '审批通过'
            }
        }
    }
}
</script>
<style scoped>
.btn-center {
    display: flex;
    justify-content: center;
}
</style>

