<template>
<div class="animated fadeIn">
    <b-card header="调整单信息">
        <div class="row">
            <div class="col-md-4">
                <b-form-fieldset horizontal label="调整单号" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="adjustOrderInfo.adjustOrderNo" readonly/>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="门店" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="adjustOrderInfo.storeName" readonly/>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="仓库" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="adjustOrderInfo.whName" readonly/>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="调整原因" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="adjustOrderInfo.adjustReason" :readonly="pageState == 2 || adjustOrderInfo.orderStatus != 0"/>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="商品编码*" :label-cols="4" class="text-right">
                    <div class="text-left">
                        <search
                            ref="codeSearch"
                            :disabled="pageState == 2 || adjustOrderInfo.orderStatus != 0"
                            :hasCheck='skuCheck'
                            :dataList="codeDatalist"
                            option="skuCode"
                            @dataChange="codeQuerySelect"
                            @itemValue="codeItemClick"
                            @clickShowBack="codeFirstLoad"
                            @clearValue="codeClearValue"
                            @comScroll="codeScrollBottom">
                        </search>
                    </div>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="商品名称" :label-cols="4" class="text-right">
                    <div class="text-left">
                        <search
                            ref="search"
                            :disabled="pageState == 2 || adjustOrderInfo.orderStatus != 0"
                            :dataList="datalist"
                            option="skuName"
                            @dataChange="querySelect"
                            @itemValue="itemClick"
                            @clickShowBack="firstLoad"
                            @clearValue="clearValue"
                            @comScroll="scrollBottom">
                        </search>
                    </div>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="创建时间" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="adjustOrderInfo.createTimeStr" readonly/>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="单据状态" label-text-align="right" :label-cols="4">
                    <b-form-select v-model="adjustOrderInfo.orderStatus" :options="orderStatus" disabled></b-form-select>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="提交人" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="adjustOrderInfo.confirmOperatorName" readonly />
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="提交时间" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="adjustOrderInfo.confirmOperatorTime" readonly/>
                </b-form-fieldset>
            </div>
        </div>
    </b-card>
    <el-tabs type="border-card" class="mb-2">
        <el-tab-pane label="调整详情">
            <!-- 移动平均 -->
            <div v-show="average">
                <div class="row">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="商品编码" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="averageAdjustDetail.skuCode" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="商品名称" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="averageAdjustDetail.skuName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="成本计算类型" :label-cols="4" class="text-right">
                            <b-form-select v-model="adjustOrderInfo.calCostTypeCode" :options="costCalculationTypes" disabled></b-form-select>
                        </b-form-fieldset> 
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="仓库" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="averageAdjustDetail.whName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="库区" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="averageAdjustDetail.whAreaName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="库位" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="averageAdjustDetail.whLocationName" readonly/>
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="当前库存数" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="averageAdjustDetail.stockNumsBefore"  readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="当前库存总金额" label-text-align="right" :label-cols="4">
                            <b-form-input :value="averageAdjustDetail.stockCostTotalBefore | toFixed" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="当前库存单位成本" label-text-align="right" :label-cols="4">
                            <b-form-input :value="averageAdjustDetail.stockCostBefore | toFixed" readonly />
                        </b-form-fieldset>
                    </div>
                </div>
                <hr>
                <strong v-show="adjustMoney">期末预览</strong>
                <hr v-show="adjustMoney">
                <div class="row" v-show="adjustMoney">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="期末库存数" label-text-align="right" :label-cols="4">
                            <!-- <b-form-input v-model="averageAdjustDetail.endStockNums"  readonly/> -->
                            <b-form-input v-model="averageAdjustDetail.stockNumsBefore"  readonly/>
                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="期末库存总金额" label-text-align="right" :label-cols="4">
                            <!-- <b-form-input v-model="averageAdjustDetail.endTotalMoney" readonly/> -->
                            <b-form-input :value="averageAdjustDetail.stockCostTotalBefore | toFixed" readonly/>
                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="期末库存单位成本" label-text-align="right" :label-cols="4">
                            <!-- <b-form-input v-model="averageAdjustDetail.endCost" readonly /> -->
                            <b-form-input :value="averageAdjustDetail.stockCostBefore | toFixed" readonly />
                            
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal :label="adjustNum ? '调整差异数*' : '调整库存总金额差异数(含税)*'" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="averageAdjustDetail.adjustValue" type="number" :state="adjustValueState" :readonly="pageState == 2 || adjustOrderInfo.orderStatus != 0"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4" v-show="adjustMoney">
                        <b-form-fieldset horizontal label="税率*" label-text-align="right" :label-cols="4">
                             <b-form-select v-model="averageAdjustDetail.adjustTaxRateCode" :options='rateValueList' :state="rateState" :disabled="pageState == 2 || adjustOrderInfo.orderStatus != 0"></b-form-select>
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="调整原因" label-text-align="right" :label-cols="4">
                            <b-form-textarea id="textarea1" v-model="averageAdjustDetail.adjustReason" :disabled="pageState == 2 || adjustOrderInfo.orderStatus != 0"></b-form-textarea>
                        </b-form-fieldset>
                    </div>
                </div>
                <hr>
                <div class="row" v-show="adjustNum">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="调整后库存数" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="averageAdjustDetail.stockNumsAfter" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="调整后库存总金额" label-text-align="right" :label-cols="4">
                            <b-form-input :value="averageAdjustDetail.stockCostTotalAfter | toFixed" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="调整后库存单位成本" label-text-align="right" :label-cols="4">
                            <b-form-input :value="averageAdjustDetail.stockCostAfter | toFixed" readonly/>
                        </b-form-fieldset>
                    </div>
                </div>
                <strong v-show="adjustMoney">调整后结果</strong>
                <hr>
                <div class="row" v-show="adjustMoney">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="期末库存数量" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="averageAdjustDetail.stockNumsAfter" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="期末库存总金额" label-text-align="right" :label-cols="4">
                            <b-form-input :value="averageAdjustDetail.stockCostTotalAfter | toFixed" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="期末库存单位成本" label-text-align="right" :label-cols="4">
                            <b-form-input :value="averageAdjustDetail.stockCostAfter | toFixed" readonly/>
                        </b-form-fieldset>
                    </div>
                </div>
            </div>
            <!-- 计件 -->
            <div v-show="byCount">
                <div class="row mb-2" v-show="pageState != 2 && adjustOrderInfo.orderStatus == 0">
                    <div class="col-md-12">
                        <b-button size="sm" variant="success" @click="add">添加</b-button>
                        <b-button size="sm" variant="danger" @click="remove">删除</b-button>
                    </div>
                </div>
                <div class="mb-2">
                    <el-table
                        ref="table1"
                        :data="list"
                        tooltip-effect="dark"
                        height="200"
                        @selection-change="handleSelectionChange"
                        border>
                        <el-table-column
                            label="选择"
                            type="selection"
                            :selectable="selectableTable1"
                            fixed>
                        </el-table-column>
                        <el-table-column
                            prop="skuCode"
                            label="商品编码"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="skuName"
                            label="商品名称"
                            width="100"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="inBatchNo"
                            label="入库批次号"
                            width="280"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="stockNums"
                            label="入库数量(未出库)"
                            width="160"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="inStockTotalAmountTax"
                            label="入库总金额(未出库-含税)"
                            width="200"
                            show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div :title="scope.row.inStockTotalAmountTax">
                                    {{ scope.row.inStockTotalAmountTax | toFixed }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="inStockIncludingTaxPrice"
                            label="入库单价(含税)"
                            width="160"
                            show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div :title="scope.row.inStockIncludingTaxPrice">
                                    {{ scope.row.inStockIncludingTaxPrice | toFixed }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="inStockRate"
                            label="入库税率"
                            width="160"
                            show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{ scope.row.inStockRate | inStockRateFilter }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="inStockCost"
                            label="入库单位成本"
                            width="130"
                            show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div :title="scope.row.inStockCost">
                                    {{ scope.row.inStockCost | toFixed }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="inStockTotalAmount"
                            label="入库总金额(未出库)"
                            width="160"
                            show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div :title="scope.row.inStockTotalAmount">
                                    {{ scope.row.inStockTotalAmount | toFixed }}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <strong>金额调整</strong>
                <div class="mb-2">
                    <el-table
                        ref="table2"
                        :data="selectedList"
                        tooltip-effect="dark"
                        height="200"
                        border>
                        <el-table-column
                            label="选择"
                            type="selection"
                            :selectable="selectable"
                            fixed>
                        </el-table-column>
                        <el-table-column
                            prop="skuCode"
                            label="商品编码"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="skuName"
                            label="商品名称"
                            width="100"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="inBatchNo"
                            label="入库批次号"
                            width="280"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="stockNums"
                            label="入库数量"
                            width="160"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="inStockTotalAmountTax"
                            label="入库总金额(含税)"
                            width="200"
                            show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div :title="scope.row.inStockTotalAmountTax">
                                    {{ scope.row.inStockTotalAmountTax | toFixed }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="inStockIncludingTaxPrice"
                            label="入库单价(含税)"
                            width="160"
                            show-overflow-tooltip>
                            <template slot-scope="scope">
                                <b-form-input type="number" v-model="selectedList[scope.$index].inStockIncludingTaxPrice"
                                    :readonly="pageState == 2 || adjustOrderInfo.orderStatus != 0"
                                     />
                                     <!-- v-number-input  -->
                                    <!-- @keyup.native="price(scope.$index)" -->
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="inStockRateCode"
                            label="入库税率"
                            width="160"
                            show-overflow-tooltip>
                            <template slot-scope="scope">
                                <b-form-select v-model="selectedList[scope.$index].inStockRateCode" 
                                    :options='rateValueList'
                                    :disabled="pageState == 2 || adjustOrderInfo.orderStatus != 0">
                                </b-form-select>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="inStockCost"
                            label="入库单位成本"
                            width="130"
                            show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div :title="scope.row.inStockCost">
                                    {{ scope.row.inStockCost | toFixed }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="inStockTotalAmount"
                            label="入库总金额"
                            width="160"
                            show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div :title="scope.row.inStockTotalAmount">
                                    {{ scope.row.inStockTotalAmount | toFixed }}    
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="商品详情">
            <sku-detail :skuInfo="skuDetail"></sku-detail>            
        </el-tab-pane>
        <el-tab-pane label="审批履历">
            <approval-record :orderNo="adjustOrderInfo.adjustOrderNo" v-if="showApproval"></approval-record>
        </el-tab-pane>
    </el-tabs>
    <div class="row mb-3">
        <div class="col-md-12 text-right">
            <b-button size="sm" variant="default" @click="cancel">取消</b-button>
            <b-button size="sm" variant="success" @click="save" v-show="pageState != 2 && adjustOrderInfo.orderStatus == 0">保存</b-button>
            <b-button size="sm" variant="danger" @click="toVoid" v-show="pageState != 2 && adjustOrderInfo.orderStatus === 0">作废</b-button>
            <b-button size="sm" variant="warning" @click="revoke" v-show="pageState != 2 && adjustOrderInfo.orderStatus == 1">撤回</b-button>
            <b-button size="sm" variant="primary" @click="submit" v-show="pageState != 2 && adjustOrderInfo.orderStatus === 0">提交</b-button>
        </div>
    </div>

    <el-dialog ref="dialog" 
            no-close-on-backdrop 
            size="large" :visible.sync="dialogVisible"  :modal-append-to-body="false">
        <b-card header="查询">
            <div class="row">
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="门店" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="dialogParams.storeName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="仓库" :label-cols="4" class="text-right">
                        <b-form-input v-model="dialogParams.whName" readonly/>
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="商品编码" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="dialogParams.skuCode" readonly/>                               
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="商品名称" :label-cols="4" class="text-right">
                        <b-form-input v-model="dialogParams.skuName" readonly/>                        
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="系统入库时间" :label-cols="4" class="text-right">
                        <el-date-picker
                            v-model="dialogParams.systemStorageTime"
                            type="daterange"
                            align="right"
                            placeholder="选择日期范围">
                        </el-date-picker>
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="批次号" label-text-align="right" :label-cols="4">
                        <b-form-input  v-model="dialogParams.inBatchNo" />
                    </b-form-fieldset>
                </div>
            </div>
            <query-btn-group @resetClick="reset" @query="query"></query-btn-group>
        </b-card>
        <b-card header="批次号明细">
            <div class="row">
                <div class="col-lg-6 col-md-6" v-for="item in inBatchNoDetail.list" :key="item.inBatchNo">
                    <el-checkbox v-model="item.check">
                        {{item.inBatchNo}} 【{{item.inStockSystemTime}}】
                    </el-checkbox>
                </div>
            </div>
        </b-card>
        <div class="row mt-2">
            <div class="col-md-12">
                <pagination class="pull-right" 
                   @page-change="pageChange" 
                   :page-no="inBatchNoDetail.pageNum" 
                   :page-size="inBatchNoDetail.pageSize" 
                   :total-result="inBatchNoDetail.total" 
                   :total-pages="inBatchNoDetail.pages">
                </pagination>
            </div>
        </div>
        
        <div slot="footer" class="dialog-footer dialog-footer-cla text-center">     
            <b-button size="sm" variant="primary" @click="generate">生成</b-button>
        </div>
    </el-dialog>
</div>
</template>
<script>

import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import Pagination from 'components/pagination/pagination'
import SkuDetail from './sku-detail'
import Search from 'components/iris-search/search'
import ApprovalRecord from 'components/approval-record/approval-record'

import config from 'common/config'
import api from 'common/api'
import { formatDate, getSequence, getSequenceList, getType, alertSuccess, filter, getCountByProp } from 'common/api-common'
import { STOCK_ADJUST_SKUDETAIL_SEQ } from 'common/sequence'
import { RATE_VALUE, COST_CALCULATION_TYPE } from 'common/ref-code'
import directives from 'common/directives'

import Vue from 'vue'
import { Table, TableColumn, Tabs, TabPane, Message, MessageBox, Dialog, Checkbox, DatePicker } from 'element-ui'
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Checkbox)
Vue.use(DatePicker)

import { mapGetters, mapActions } from 'vuex'

export default {
    components: {
        Pagination,
        QueryBtnGroup,
        SkuDetail,
        Search,
        ApprovalRecord
    },
    data() {
        return {
            // sku-code-name-search Start
            datalist: [],
            selectParams: {
                pageNums: config.pageNums,
                pageStart: 1
            },
            isLastPage: false,

            codeDatalist: [],
            codeSelectParams: {
                pageNums: config.pageNums,
                pageStart: 1
            },
            codeIsLastPage: false,
            skuCheck: false,
            // sku-code-name-search End
            orderStatus: [
                {text: '作废', value: -1},
                {text: '未生效', value: 0},
                {text: '已提交', value: 1},
                {text: '已生效', value: 2},
                {text: '已完成', value: 3},
                {text: '已关闭', value: 4},                
            ],
            adjustOrderInfo: {
                adjustOrderNo: '',
                storeCode: '',
                storeName: '',
                whCode: '',
                whName: '',
                skuCode: '',
                skuName: '',
                orderStatus: '',
                createTimeStr: formatDate(new Date()),
                confirmOperatorName: '',
                confirmOperatorTime: '',
                adjustReason: '',
                calCostTypeCode: '',
                adjustType: '',
                stockAdjustSkuDetailInfoVoList: []
            },
            averageAdjustDetail: {
                whCode: '',
                whName: '',
                skuCode: '',
                skuName: '',
                calCostTypeCode: '',
                whAreaName: '',
                whLocationName: '',
                adjustValue: '',
                adjustTaxRateCode: '',
                adjustReason: '',
                // endStockNums: '',
                // endTotalMoney: '',
                // endCost: '',
                stockNumsBefore: '',
                stockCostTotalBefore: '',
                stockCostBefore: '',
                stockNumsAfter: '',
                stockCostTotalAfter: '',
                stockCostAfter: ''
            },
            list: [],
            selectedList: [],
            dialogVisible: false,
            inBatchNoDetail: {},
            scrollTop: 0,
            scrollLeft: 0,
            skuDetail: {},
            dialogParams: {
                storeCode: '',
                storeName: '',
                whCode: '',
                whName: '',
                skuCode: '',
                skuName: '',
                systemStorageTime: '',
                inBatchNo: ''
            },
            showApproval: false,
            adjustValueState: null,
            rateState: null,
            rateValueList: [],
            stockAdjustInfo: {},
            tempSelectList: [],      // 更新数据暂存 
            notRelation: false,
            isSave: true,
        }
    },
    created() {
        if(this.adjustMoney) {
            getType(RATE_VALUE, items => {
                this.rateValueList = []
                items.forEach(item => {
                    let data = {
                        text: (item.refDetailName - 0) * 100 + '%',
                        value: item.refDetailCode
                    }
                    this.rateValueList.push(data)
                })
            })
        }
        if(!this.costCalculationTypes.length) {
            this.getCostCalculationTypes(COST_CALCULATION_TYPE)
        }
    },
    mounted() {
        // table 同步滑动
        let selectWrap = document.getElementsByClassName('el-table__body-wrapper')
        selectWrap[0].addEventListener('scroll', e => {
            this.scrollTop = e.target.scrollTop
            this.scrollLeft = e.target.scrollLeft
        })
        selectWrap[1].addEventListener('scroll', e => {
            this.scrollTop = e.target.scrollTop
            this.scrollLeft = e.target.scrollLeft
        })
        // 新增初始化逻辑
        let query = this.$route.query
        this.showApproval = true
        if(this.pageState == 0) {
            this.adjustOrderInfo.adjustOrderNo = query.adjustOrderNo
            this.adjustOrderInfo.storeCode = query.storeCode
            this.adjustOrderInfo.storeName = query.storeName
            this.adjustOrderInfo.whCode = query.whCode
            this.adjustOrderInfo.whName = query.whName
            this.adjustOrderInfo.adjustOrderNo = query.adjustOrderNo
            this.adjustOrderInfo.adjustOrderNo = query.adjustOrderNo   
            // this.adjustOrderInfo.confirmOperatorName = this.userInfo.empVo.empCnName
            this.adjustOrderInfo.calCostTypeCode = query.costCalculationType
        }else {
            let params = {adjustOrderNo: query.adjustOrderNo}
            this.queryByCode(params)
        }
    },
    computed: {
        userInfo() {
            return JSON.parse(sessionStorage.getItem('userInfo'))
        },
        pageState() {
            return this.$route.query.pageState
        },
        adjustNum() {
            return this.$route.query.adjustState == 0
        },
        adjustMoney() {
            return this.$route.query.adjustState == 1
        },
        average() {
            return this.$route.query.costCalculationType === 'average'
        },
        byCount() {
            return this.$route.query.costCalculationType === 'byCount'
        },
        ...mapGetters('stockAdjust', [
            'costCalculationTypes'
        ])
    },
    methods: {
        clearValue() {
            this.adjustOrderInfo.skuCode = ''
			this.adjustOrderInfo.skuName = ''            
            this.$refs.codeSearch.setValue()
        },
        firstLoad() {
            if(this.selectParams.skuName) {
                delete this.selectParams.skuName;
            }else if(this.datalist.length !== 0) {
                return;
            }
            let params = this.selectParams;        
            this.querySerInfo(params, obj => {
                this.datalist = obj.list;
            });
        },
        querySelect(data) {
            this.selectParams.pageStart = 1;
            this.selectParams.skuName = data;
            let params = this.selectParams;        
            this.querySerInfo(params, obj => {
                this.isLastPage = obj.isLastPage;            
                this.datalist = obj.list;
            });
        },
        itemClick(item) {
            this.adjustOrderInfo.skuCode = item.skuCode
			this.adjustOrderInfo.skuName = item.skuName
            this.$refs.codeSearch.setValue(item.skuCode)
        },
        scrollBottom(isEnd) {
            if (isEnd && !this.isLastPage) {
                this.selectParams.pageStart ++
                let params = this.selectParams;        
                this.querySerInfo(params, obj => {
                    this.isLastPage = obj.isLastPage;
                    this.datalist = this.datalist.concat(obj.list);
                });
            }
        },
        querySerInfo(_params, callback) {
            // 1. 调整单成本计算类型 = 计件, 仓库成本计算类型 = 计件   商品成本计算类型 =  计件 / 平均 
            // 2. 调整单成本计算类型 = 计件, 仓库成本计算类型 = 平均   商品成本计算类型 =  计件 
        // 3. 调整单成本就算类型 = 平均, 仓库成本计算类型 = 平均   商品成本计算类型 = 平均
            let params = _params
            let calCostTypeCode = this.$route.query.costCalculationType     // 调整单成本计算类型
            let calCostType = this.$route.query.calCostType                 // 仓库成本计算类型
    
            if(calCostTypeCode == 'byCount' && calCostType == 'byCount') {
                if(params.hasOwnProperty('calCostType')) {
                    delete params.calCostType
                }
            }else if(calCostTypeCode == 'byCount' && calCostType == 'average') {
                params.calCostType = 'byCount'
            }else if(calCostTypeCode == 'average' && calCostType == 'average') {
                params.calCostType = 'average'
            }
            api.skuData.getInfo(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },

        // code
        codeClearValue() {
            this.adjustOrderInfo.skuCode = ''
			this.adjustOrderInfo.skuName = ''
            this.$refs.search.setValue()
        },
        codeFirstLoad() {
            if(this.codeSelectParams.skuCode) {
                delete this.codeSelectParams.skuCode;
            }else if(this.codeDatalist.length !== 0) {
                return;
            }
            let params = this.codeSelectParams;        
            this.querySerInfo(params, obj => {
                this.codeDatalist = obj.list;
            });
        },
        codeQuerySelect(data) {
            this.codeSelectParams.pageStart = 1;
            this.codeSelectParams.skuCode = data;
            let params = this.codeSelectParams;        
            this.querySerInfo(params, obj => {
                this.codeIsLastPage = obj.isLastPage;            
                this.codeDatalist = obj.list;
            });
        },
        codeItemClick(item) {
            this.adjustOrderInfo.skuCode = item.skuCode
			this.adjustOrderInfo.skuName = item.skuName
            this.$refs.search.setValue(item.skuName)
        },
        codeScrollBottom(isEnd) {
            if (isEnd && !this.isLastPage) {
                this.codeSelectParams.pageStart ++
                let params = this.codeSelectParams;        
                this.querySerInfo(params, obj => {
                    this.codeIsLastPage = obj.isLastPage;
                    this.codeDatalist = this.codeDatalist.concat(obj.list);
                });
            }
        },

        selectableTable1() {
            if(this.pageState == 2 || this.adjustOrderInfo.orderStatus != 0) {
                return false
            }else {
                return true
            }
        },
        selectable() {
            return false
        },
        cancel() {
            this.$router.push({
                path: 'query'
            })
        },
        toVoid() {
            this.confirmAlert('是否确认作废', true, () => {
                let params = {adjustOrderNo: this.adjustOrderInfo.adjustOrderNo}
                api.stockAdjust.toVoid(params).then(res => { 
                    alertSuccess(res, () => {
                        this.queryByCode(params)
                    })
                })
            })
        },
        revoke() {
            let params = {adjustOrderNo: this.adjustOrderInfo.adjustOrderNo}
            api.stockAdjust.revoke(params).then(res => { 
                alertSuccess(res, () => {
                    this.queryByCode(params)
                })
            })
        },
        submit() {
            let params = {adjustOrderNo: this.adjustOrderInfo.adjustOrderNo}
            api.stockAdjust.submit(params).then(res => { 
                alertSuccess(res, () => {
                    this.queryByCode(params)
                })
            })
        },
        confirmAlert(title, showCancel = false, handOk = () => {}) {
            MessageBox.confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showCancelButton: showCancel,
                type: 'warning',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        handOk()
                        done()
                    } else {
                        done()
                        return
                    }
                }
            }).then(() => {}).catch(() => {})
        },
        queryByCode(params) {
            api.stockAdjust.queryByCode(params).then(res => { 
                if(res.data.code === 'success') {
                    let obj = res.data.obj
                    this.stockAdjustInfo = obj
                    for(let key in this.adjustOrderInfo) {
                        this.adjustOrderInfo[key] = obj[key]
                    }
                    let detail = obj.stockAdjustSkuDetailInfoVoList[0]
                    this.adjustOrderInfo.id = obj.id                    
                    this.adjustOrderInfo.skuCode = detail.skuCode
                    this.adjustOrderInfo.skuName = detail.skuName
                    // 审批通过之后拿到提交人, 和提交时间
                    if(this.stockAdjustInfo.wfStatus == 1) {
                        this.adjustOrderInfo.confirmOperatorName = this.stockAdjustInfo.confirmOperatorName
                        this.adjustOrderInfo.confirmOperatorTime = this.stockAdjustInfo.confirmOperatorTime                        
                    }
                    this.$refs.codeSearch.setValue(this.adjustOrderInfo.skuCode)
                    this.$refs.search.setValue(this.adjustOrderInfo.skuName) 
                    if(this.average) {
                        this.averageAdjustDetail.adjustReason = detail.adjustReason
                        this.averageAdjustDetail.adjustValue = detail.adjustValue
                        this.averageAdjustDetail.adjustTaxRateCode = detail.adjustTaxRateCode
                            
                    }else if(this.byCount) {
                        // 页面之前调整的批次
                        this.selectedList = []
                        let list = filter(obj.stockAdjustSkuDetailInfoVoList, 'inBatchNo')
                        list.forEach(item => {
                            this.selectedList.push({
                                id: item.id,
                                adjustDetailCode: item.adjustDetailCode,
                                adjustOrderNo: item.adjustOrderNo,
                                skuCode: item.skuCode,
                                skuName: item.skuName,
                                inBatchNo: item.inBatchNo,
                                stockNums: getCountByProp(item, obj.stockAdjustSkuDetailInfoVoList, 'inBatchNo'),
                                inStockIncludingTaxPrice: item.adjustValue,
                                inStockRateCode: item.adjustTaxRateCode,
                                inStockRateBefore: item.inStockRateBefore,
                                inStockIncludingTaxPriceBefore: item.inStockIncludingTaxPriceBefore
                            })
                        })
                        
                        this.tempSelectList = JSON.parse(JSON.stringify(this.selectedList))
                        
                        this.getList()
                    }  
                }
            })
        },
        getList() {
            let params = {
                storeCode: this.adjustOrderInfo.storeCode,
                whCode: this.adjustOrderInfo.whCode,
                skuCode: this.adjustOrderInfo.skuCode,
                pageNums: 100,      // 暂定100 取全量
                pageStart: 1,  
                stockStatus: 1
            }
            api.stockAdjust.queryStockDetailBatch(params).then(res => {
                if(res.data.code === 'success') {
                    let obj = res.data.obj
                    this.list = []
                    obj.list.forEach((item, index) => {
                        let i = this.tempSelectList.findIndex(v => v.inBatchNo === item.inBatchNo)
                        if(i !== -1) {
                            // 审批通过之后, 入库税率, 入库单价 => 取调整前的
                            if(this.adjustOrderInfo.orderStatus == 3) {
                                // item.inStockRate = this.tempSelectList[index].inStockRateBefore
                                // item.inStockIncludingTaxPrice = this.tempSelectList[index].inStockIncludingTaxPriceBefore

                                item.inStockRate = this.getPropValueByInBatchNo(item.inBatchNo, 'inStockRateBefore')
                                item.inStockIncludingTaxPrice = this.getPropValueByInBatchNo(item.inBatchNo, 'inStockIncludingTaxPriceBefore')
                                item.inStockCost = item.inStockIncludingTaxPrice / (1 + (item.inStockRate - 0))
                            }
                            // 入库总金额(含税) = 入库总数量 * 入库单价(含税)
                            item.inStockTotalAmountTax = item.stockNums * item.inStockIncludingTaxPrice
                            // 入库总金额 = 入库总数量 * 入库单位成本
                            item.inStockTotalAmount = item.stockNums * item.inStockCost
                            
                            this.list.push(item)
                        }
                    })
                    // 加也不是, 不加也不是
                    this.$nextTick(() => {
                        // if(this.isSave) {
                            this.notRelation = true
                            this.list.forEach(row => {
                                this.$refs.table1.toggleRowSelection(row)
                            })
                            // this.notRelation = false
                        // }
                    })
                    
                }
            })
        },
        getPropValueByInBatchNo(inBatchNo, prop) {
            let res = ''
            this.tempSelectList.forEach(item => {
                if(item.inBatchNo === inBatchNo) {
                    res = item[prop]
                }
            })
            return res
        },
        getValueByInBatchNo(inBatchNo, prop) {
            let res = ''
            this.selectedList.forEach(item => {
                if(item.inBatchNo === inBatchNo) {
                    res = item[prop]
                }
            })
            return res
        },
        // 保存
        save() {
            if(!this.adjustOrderInfo.skuCode) {
                this.skuCheck = true
                return
            }else {
                this.skuCheck = false
            }
            // this.isSave = false
            // 成本计算类型 - 移动平均  ( 调整数量, 调整金额 )
            if(this.average) {
                if(!this.averageAdjustDetail.adjustValue) {
                    this.adjustValueState = 'invalid'
                    return
                }else {
                    this.adjustValueState = null                    
                }
                if(this.adjustMoney && !this.averageAdjustDetail.adjustTaxRateCode) {
                    this.rateState = 'invalid'
                    return
                }else {
                    this.rateState = null
                }
                // 校验调整数量或者调整金额是否合法
                let sumNum = this.averageAdjustDetail.stockNumsBefore - 0 + (this.averageAdjustDetail.adjustValue - 0)
                    // sumMoney = this.averageAdjustDetail.stockCostTotalBefore - 0 + (this.averageAdjustDetail.adjustValue - 0)
                if(this.adjustNum) {
                    if(sumNum <= 0) {
                        Message({
                            type: 'warning',
                            message: '调整库存数量与库存数量之和必须大于0'
                        })
                        return
                    }
                }else if(this.adjustMoney) {
                    if(this.averageAdjustDetail.stockCostTotalAfter < 0) {
                        Message({
                            type: 'warning',
                            message: '调整库存总金额与当前库存总金额之和不能小于0'
                        })
                        return
                    }
                }
                if(this.pageState == 0 && !this.adjustOrderInfo.hasOwnProperty('id')) {
                    getSequence(STOCK_ADJUST_SKUDETAIL_SEQ, res => {
                        let params = {
                            adjustOrderNo: this.adjustOrderInfo.adjustOrderNo,
                            adjustType: this.$route.query.adjustState,
                            storeCode: this.adjustOrderInfo.storeCode,
                            whCode: this.adjustOrderInfo.whCode,
                            calCostTypeCode: this.adjustOrderInfo.calCostTypeCode,
                            adjustReason: this.adjustOrderInfo.adjustReason,
                            skuCode: this.adjustOrderInfo.skuCode,
                            stockAdjustSkuDetailInfoVoList: [
                                {
                                    adjustDetailCode: res,
                                    adjustOrderNo: this.adjustOrderInfo.adjustOrderNo,
                                    skuCode: this.averageAdjustDetail.skuCode,
                                    adjustValue: this.averageAdjustDetail.adjustValue,
                                    adjustReason: this.averageAdjustDetail.adjustReason,
                                    adjustTaxRateCode: this.averageAdjustDetail.adjustTaxRateCode
                                }
                            ]
                        }
                        this.insert(params)
                    })
                }else {
                    let params = {
                        id: this.adjustOrderInfo.id,
                        adjustOrderNo: this.adjustOrderInfo.adjustOrderNo,
                        adjustType: this.adjustOrderInfo.adjustType,
                        storeCode: this.adjustOrderInfo.storeCode,
                        whCode: this.adjustOrderInfo.whCode,
                        calCostTypeCode: this.adjustOrderInfo.calCostTypeCode,
                        adjustReason: this.adjustOrderInfo.adjustReason,
                        skuCode: this.adjustOrderInfo.skuCode,
                        stockAdjustSkuDetailInfoVoList: [
                            {
                                id: this.stockAdjustInfo.stockAdjustSkuDetailInfoVoList[0].id,
                                adjustDetailCode: this.stockAdjustInfo.stockAdjustSkuDetailInfoVoList[0].adjustDetailCode,
                                adjustOrderNo: this.adjustOrderInfo.adjustOrderNo,
                                skuCode: this.averageAdjustDetail.skuCode,
                                adjustValue: this.averageAdjustDetail.adjustValue,
                                adjustReason: this.averageAdjustDetail.adjustReason,
                                adjustTaxRateCode: this.averageAdjustDetail.adjustTaxRateCode
                            }
                        ]
                    }
                    this.update(params)
                }
            // 成本计算类型 - 计件                
            }else if(this.byCount) {
                if(!this.selectedList.length && !this.adjustOrderInfo.stockAdjustSkuDetailInfoVoList.length) {
                    Message({
                        type: 'warning',
                        message: '请添加批次'
                    })
                    return
                }
                let flag = false
                this.selectedList.forEach(item => {
                    if(!item.inStockIncludingTaxPrice || !item.inStockRateCode) {
                        Message({
                            type: 'warning',
                            message: '入库单价和税率不可为空'
                        })
                        flag = true
                    }
                    if(item.inStockIncludingTaxPrice < 0) {
                        Message({
                            type: 'warning',
                            message: '入库单价不能小于0'
                        })
                        flag = true
                    }
                })
                if(flag) {
                    return 
                }
                // 新增
                if(this.pageState == 0 && !this.adjustOrderInfo.hasOwnProperty('id')) {
                    let params = {
                        adjustOrderNo: this.adjustOrderInfo.adjustOrderNo,
                        adjustType: this.$route.query.adjustState,
                        storeCode: this.adjustOrderInfo.storeCode,
                        whCode: this.adjustOrderInfo.whCode,
                        calCostTypeCode: this.adjustOrderInfo.calCostTypeCode,
                        adjustReason: this.adjustOrderInfo.adjustReason,
                        stockAdjustSkuDetailInfoVoList: []
                    }
                    let tempList = []
                    this.selectedList.forEach(item => {
                        for(let i = 0; i < item.stockNums; i++) {
                            tempList.push(item)
                        }
                    })
                    let seqListParams = {
                        serviceCode: STOCK_ADJUST_SKUDETAIL_SEQ,
                        getNums: tempList.length
                    }
                    getSequenceList(seqListParams, res => {
                        tempList.forEach((item, i) => {
                            params.stockAdjustSkuDetailInfoVoList.push({
                                adjustDetailCode: res[i],
                                adjustOrderNo: this.adjustOrderInfo.adjustOrderNo,
                                skuCode: this.averageAdjustDetail.skuCode,
                                adjustValue: item.inStockIncludingTaxPrice,      // 入库单价(含税)
                                adjustTaxRateCode: item.inStockRateCode,
                                inBatchNo: item.inBatchNo,
                            })
                        })
                        this.insert(params)
                    })
                }else {
                    let params = {
                        id: this.adjustOrderInfo.id,
                        adjustOrderNo: this.adjustOrderInfo.adjustOrderNo,
                        adjustType: this.adjustOrderInfo.adjustType,
                        storeCode: this.adjustOrderInfo.storeCode,
                        whCode: this.adjustOrderInfo.whCode,
                        calCostTypeCode: this.adjustOrderInfo.calCostTypeCode,
                        adjustReason: this.adjustOrderInfo.adjustReason,
                        stockAdjustSkuDetailInfoVoList: []
                    }
                    
                    let count = 0       // 编辑时新增的获取seq的长度
                    let tempList = []   // 后端数据转换暂存
                    this.adjustOrderInfo.stockAdjustSkuDetailInfoVoList.forEach(item => {
                        tempList.push({
                            id: item.id,
                            adjustDetailCode: item.adjustDetailCode,
                            adjustOrderNo: item.adjustOrderNo,
                            skuCode: item.skuCode,
                            adjustValue: this.getValueByInBatchNo(item.inBatchNo, 'inStockIncludingTaxPrice') || item.adjustValue,      // 入库单价(含税)
                            adjustTaxRateCode: this.getValueByInBatchNo(item.inBatchNo, 'inStockRateCode') || item.adjustTaxRateCode,
                            inBatchNo: item.inBatchNo,
                        })
                    })
                    // 
                    let _tempList = []  // 前端页面数据转换暂存
                    this.selectedList.forEach(item => {
                        for(let i = 0; i < item.stockNums; i++) {
                            _tempList.push(item)
                        }
                    })
                    // console.log(_tempList)

                    params.stockAdjustSkuDetailInfoVoList = tempList
                    
                    tempList.forEach((item, index) => {
                        let i = _tempList.findIndex(v => v.inBatchNo === item.inBatchNo)
                        if(i === -1) {
                            // 删除
                            params.stockAdjustSkuDetailInfoVoList[index].isDeleted = 1
                            // params.stockAdjustSkuDetailInfoVoList[index].adjustValue = _tempList[index].inStockIncludingTaxPrice 
                            // params.stockAdjustSkuDetailInfoVoList[index].adjustTaxRateCode = _tempList[index].inStockRateCode                         
                                                
                        }else {
                            // 编辑
                            // params.stockAdjustSkuDetailInfoVoList[index].adjustValue = _tempList[index].inStockIncludingTaxPrice
                            // params.stockAdjustSkuDetailInfoVoList[index].adjustTaxRateCode = _tempList[index].inStockRateCode                         
                        }
                    })
                    _tempList.forEach(item => {
                        let i = tempList.findIndex(v => v.adjustDetailCode === item.adjustDetailCode)
                        if(i === -1) {
                            // 新增
                            count++
                            params.stockAdjustSkuDetailInfoVoList.push({
                                adjustDetailCode: '',
                                adjustOrderNo: this.adjustOrderInfo.adjustOrderNo,
                                skuCode: this.averageAdjustDetail.skuCode,
                                adjustValue: item.inStockIncludingTaxPrice,      // 入库单价(含税)
                                adjustTaxRateCode: item.inStockRateCode,
                                inBatchNo: item.inBatchNo,
                            })
                        }
                    })

                    this.selectedList.forEach((item, index) => {
                        let i = this.list.findIndex(v => v.inBatchNo === item.inBatchNo)
                        let diffNum = item.stockNums - this.list[index].stockNums
                        if(i !== -1 && diffNum > 0) {
                            params.stockAdjustSkuDetailInfoVoList.forEach(ele => {
                                if(ele.inBatchNo == item.inBatchNo) {
                                    diffNum--
                                    if(diffNum > 0) {
                                        ele.isDeleted = 1
                                    }
                                }
                            })
                        }
                    })
                    if(count > 0) {
                        let seqListParams = {
                            serviceCode: STOCK_ADJUST_SKUDETAIL_SEQ,
                            getNums: count
                        }
                        getSequenceList(seqListParams, res => {
                            params.stockAdjustSkuDetailInfoVoList.forEach(item => {
                                if(!item.adjustDetailCode) {
                                    count--
                                    item.adjustDetailCode = res[count]
                                }
                            })
                            this.update(params)
                        })
                    }else {
                        this.update(params)
                    }
                }                
            }
        },
        insert(params) {
            api.stockAdjust.insert(params).then(res => { 
                if(res.data.code === 'success') {
                    alertSuccess(res, () => {
                        let params = {adjustOrderNo: this.adjustOrderInfo.adjustOrderNo}
                        this.queryByCode(params)
                    })
                }
            })
        },
        update(params) {
            api.stockAdjust.update(params).then(res => { 
                if(res.data.code === 'success') {
                    alertSuccess(res, () => {
                        let params = {adjustOrderNo: this.adjustOrderInfo.adjustOrderNo}
                        this.queryByCode(params)
                    })
                }
            })
        },
        add() {
            if(!this.adjustOrderInfo.skuCode) {
                this.skuCheck = true
            }else {
                this.skuCheck = false
                this.dialogVisible = true
            }
        },
        remove() {
            this.selectedList.forEach((item, index) => {
                let i = this.list.findIndex(v => v.inBatchNo === item.inBatchNo)
                if(i !== -1) {
                    this.list.splice(i, 1)
                }
            })
            // this.list = this.diff(this.list, this.selectedList)
        },
        diff(arr1, arr2) {
            return arr1.filter(i => {
                return arr2.indexOf(i) < 0
            })
        },
        handleSelectionChange(val) {
            this.selectedList = []              
            let list = filter(this.adjustOrderInfo.stockAdjustSkuDetailInfoVoList, 'inBatchNo')
            list.forEach(item => {
                let index = val.findIndex(v => v.inBatchNo === item.inBatchNo)
                if(index !== -1) {
                    this.selectedList.push({
                        id: item.id,
                        adjustDetailCode: item.adjustDetailCode,
                        adjustOrderNo: item.adjustOrderNo,
                        skuCode: item.skuCode,
                        skuName: item.skuName,
                        inBatchNo: item.inBatchNo,
                        stockNums: getCountByProp(item, this.adjustOrderInfo.stockAdjustSkuDetailInfoVoList, 'inBatchNo'),
                        inStockIncludingTaxPrice: item.adjustValue,
                        inStockRateCode: item.adjustTaxRateCode,
                    })
                }
            })

            val.forEach(item => {
                let info = {}
                item.inStockRateCode = this.findValueByText(item.inStockRate)
                for(let key in item) {
                    info[key] = item[key]
                }
                let i = this.selectedList.findIndex(v => v.inBatchNo === item.inBatchNo)
                if(i === -1) {
                    this.selectedList.push(info)
                }
            })
        },
        reset() {
            this.dialogParams.inBatchNo = '',
            this.dialogParams.systemStorageTime = ''
        },
        query() {
            this.queryStockDetailBatch()
        },
        pageChange(pageStart) {
            this.queryStockDetailBatch(pageStart)
        },
        // 生成
        generate() {
            this.list = []
            this.inBatchNoDetail.list.forEach(item => {
                if(item.check) {
                    // 入库总金额(含税) = 入库总数量 * 入库单价(含税)
                    item.inStockTotalAmountTax = item.stockNums * item.inStockIncludingTaxPrice
                    // 入库总金额 = 入库总数量 * 入库单位成本
                    item.inStockTotalAmount = item.stockNums * item.inStockCost
                    this.list.push(item)
                }
            })
            this.dialogVisible = false
        },
        queryStockDetailBatch(pageStart = 1) {
            let time = this.dialogParams.systemStorageTime
            let params = {
                storeCode: this.dialogParams.storeCode,
                whCode: this.dialogParams.whCode,
                skuCode: this.dialogParams.skuCode,
                inBatchNo: this.dialogParams.inBatchNo,
                // 后续加上系统入库开始时间, 结束时间, 目前后端暂无字段
                pageNums: config.pageNums,
                pageStart: pageStart,  
                inStockSystemTimeStart: time ? formatDate(time[0]) : '',
                inStockSystemTimeEnd: time ? formatDate(time[1]) : '',
                stockStatus: 1
            }
            api.stockAdjust.queryStockDetailBatch(params).then(res => {
                if(res.data.code === 'success') {
                    let obj = res.data.obj
                    this.inBatchNoDetail = JSON.parse(JSON.stringify(obj))
                    this.inBatchNoDetail.list = []
                    obj.list.forEach(item => {
                        let info = {
                            check: false
                        }
                        for(let key in item) {
                           info[key] = item[key]
                        }
                        this.inBatchNoDetail.list.push(info)
                    })
                }
            })
        },
        findValueByText(text, list = this.rateValueList) {
            let value = ''
            list.forEach(item => {
                if(text == item.text) {
                    value = item.value
                }
            })
            return value
        },
        findTextByValue(value, list) {
            let text = ''
            list.forEach(item => {
                if(value === item.value) {
                    text = item.text.split('%')[0] / 100
                }
            })
            return text
        },
        ...mapActions('stockAdjust', [
            'getCostCalculationTypes'
        ])
    },
    watch: {
        scrollTop(val) {
            this.$refs.table1.$el.children[2].scrollTop = val
            this.$refs.table2.$el.children[2].scrollTop = val
        },
        scrollLeft(val) {
            this.$refs.table1.$el.children[2].scrollLeft = val
            this.$refs.table2.$el.children[2].scrollLeft = val
        },
        'adjustOrderInfo.skuCode' (val) {
            if(val) {
                let params = {skuCode: val}
                api.skuInfo.querySkuInfo(params, res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        this.skuDetail = obj
                    }
                }) 
            }
        },
        adjustOrderInfo: {
            handler(val) {
                // 调整详情
                this.averageAdjustDetail.skuCode = val.skuCode
                this.averageAdjustDetail.skuName = val.skuName
                this.averageAdjustDetail.whCode = val.whCode
                this.averageAdjustDetail.whName = val.whName
                
                // 弹窗
                this.dialogParams.storeCode = val.storeCode
                this.dialogParams.storeName = val.storeName
                this.dialogParams.skuCode = val.skuCode
                this.dialogParams.skuName = val.skuName
                this.dialogParams.whCode = val.whCode
                this.dialogParams.whName = val.whName
            },
            deep: true
        },
        'averageAdjustDetail.skuCode': {
            handler(val) {
                if(val && this.averageAdjustDetail.whCode) {
                    let params = {
                        skuCode: val,
                        whCode: this.averageAdjustDetail.whCode
                    }
                    api.skuPlace.querySkuLocationInfoNoPage(params, res => {
                        if(res.data.code === 'success') {
                            let info = res.data.obj[0]
                            if(info) {
                                this.averageAdjustDetail.whAreaCode = info.whAreaCode
                                this.averageAdjustDetail.whAreaName = info.whAreaName
                                this.averageAdjustDetail.whLocationCode = info.whLocationCode
                                this.averageAdjustDetail.whLocationName = info.whLocationName                           
                            }else {
                                this.averageAdjustDetail.whAreaCode = ''
                                this.averageAdjustDetail.whAreaName = ''
                                this.averageAdjustDetail.whLocationCode = ''
                                this.averageAdjustDetail.whLocationName = ''
                            }
                        }
                    })
                    // 审批通过之后
                    if(this.stockAdjustInfo.wfStatus == 1) {
                            let info = this.stockAdjustInfo.stockAdjustSkuDetailInfoVoList[0]
                            // 调整前
                            this.averageAdjustDetail.stockNumsBefore = info.stockNumsBefore
                            this.averageAdjustDetail.stockCostTotalBefore = info.stockCostTotalBefore
                            this.averageAdjustDetail.stockCostBefore = info.stockCostBefore
                            // 调整后
                            
                            this.averageAdjustDetail.stockNumsAfter = info.stockNumsAfter
                            this.averageAdjustDetail.stockCostTotalAfter = info.stockCostTotalAfter
                            this.averageAdjustDetail.stockCostAfter = info.stockCostAfter

                    }else {
                        api.stockAdjust.queryBeStockInfo(params).then(res => {
                            if(res.data.code === 'success') {
                                let obj = res.data.obj[0]
                                if(obj) {
                                    this.$nextTick(() => {
                                        // 当前库存数 = 期初库存数量 + 本期入库总数量 - 本期出库总数量
                                        this.averageAdjustDetail.stockNumsBefore = obj.beginStockNums + obj.currentInTotalNums - obj.currentOutTotalNums
                                        // 当前库存总金额 = 期初库存总金额 + 本期入库总金额 - 本期出库总金额
                                        this.averageAdjustDetail.stockCostTotalBefore = obj.beginTotalMoney + obj.currentInTotalMoney - obj.currentOutTotalMoney
                                        // 当前库存单位成本 = 期初库存单位成本   update 2018/06/08 = 当前库存总金额 / 当前库存数
                                        this.averageAdjustDetail.stockCostBefore = this.averageAdjustDetail.stockCostTotalBefore / this.averageAdjustDetail.stockNumsBefore
                                    })
                                }else {
                                    this.$nextTick(() => {
                                        this.averageAdjustDetail.stockNumsBefore = ''
                                        this.averageAdjustDetail.stockCostTotalBefore = ''
                                        this.averageAdjustDetail.stockCostBefore = ''
                                    })
                                } 
                                if(this.pageState != 0 || this.adjustOrderInfo.id) {
                                    if(this.adjustNum) {
                                        let _adjustValue = this.averageAdjustDetail.adjustValue - 0
                                        this.$nextTick(() => {
                                            this.averageAdjustDetail.stockNumsAfter = this.averageAdjustDetail.stockNumsBefore + _adjustValue
                                            this.averageAdjustDetail.stockCostTotalAfter = this.averageAdjustDetail.stockCostTotalBefore
                                            this.averageAdjustDetail.stockCostAfter = (this.averageAdjustDetail.stockCostTotalAfter / this.averageAdjustDetail.stockNumsAfter)
                                        })
                                    }else if(this.adjustMoney) {
                                        let _adjustValue = this.averageAdjustDetail.adjustValue - 0 
                                        let _adjustValueMoney = _adjustValue / (1 + (this.findTextByValue(this.averageAdjustDetail.adjustTaxRateCode, this.rateValueList) - 0))
                                        this.$nextTick(() => {
                                            this.averageAdjustDetail.stockNumsAfter = this.averageAdjustDetail.stockNumsBefore
                                            this.averageAdjustDetail.stockCostTotalAfter = this.averageAdjustDetail.stockCostTotalBefore + _adjustValueMoney
                                            this.averageAdjustDetail.stockCostAfter = (this.averageAdjustDetail.stockCostTotalAfter / this.averageAdjustDetail.stockNumsAfter)
                                        })
                                    }
                                }                           
                            }
                        })
                    }
                }else if(!val) {
                    this.averageAdjustDetail.whAreaCode = ''
                    this.averageAdjustDetail.whAreaName = ''
                    this.averageAdjustDetail.whLocationCode = ''
                    this.averageAdjustDetail.whLocationName = ''

                    this.averageAdjustDetail.stockNumsBefore = ''
                    this.averageAdjustDetail.stockCostTotalBefore = ''
                    this.averageAdjustDetail.stockCostBefore = ''
                }
            },
            deep: true
        },
        'averageAdjustDetail.adjustValue': {
            handler(val) {
                if(this.adjustNum) {
                    let _adjustValue = this.averageAdjustDetail.adjustValue - 0
                    this.averageAdjustDetail.stockNumsAfter = this.averageAdjustDetail.stockNumsBefore + _adjustValue
                    this.averageAdjustDetail.stockCostTotalAfter = this.averageAdjustDetail.stockCostTotalBefore
                    this.averageAdjustDetail.stockCostAfter = (this.averageAdjustDetail.stockCostTotalAfter / this.averageAdjustDetail.stockNumsAfter)
                }else if(this.adjustMoney && this.averageAdjustDetail.adjustTaxRateCode) {
                    let _adjustValue = this.averageAdjustDetail.adjustValue - 0 
                    let _adjustValueMoney = _adjustValue / (1 + (this.findTextByValue(this.averageAdjustDetail.adjustTaxRateCode, this.rateValueList) - 0 ))
                    this.averageAdjustDetail.stockNumsAfter = this.averageAdjustDetail.stockNumsBefore
                    this.averageAdjustDetail.stockCostTotalAfter = this.averageAdjustDetail.stockCostTotalBefore + _adjustValueMoney
                    this.averageAdjustDetail.stockCostAfter = (this.averageAdjustDetail.stockCostTotalAfter / this.averageAdjustDetail.stockNumsAfter)
                }
            },
            deep: true,
            // immediate: true
        },
        'averageAdjustDetail.adjustTaxRateCode': {
            handler(val) {
                if(val && this.averageAdjustDetail.adjustValue) {
                    let _adjustValue = this.averageAdjustDetail.adjustValue - 0 
                    let _adjustValueMoney = _adjustValue / (1 + (this.findTextByValue(this.averageAdjustDetail.adjustTaxRateCode, this.rateValueList) - 0))
                    this.averageAdjustDetail.stockNumsAfter = this.averageAdjustDetail.stockNumsBefore
                    this.averageAdjustDetail.stockCostTotalAfter = this.averageAdjustDetail.stockCostTotalBefore + _adjustValueMoney
                    this.averageAdjustDetail.stockCostAfter = (this.averageAdjustDetail.stockCostTotalAfter / this.averageAdjustDetail.stockNumsAfter)
                }
            },
            deep: true
        },
        // 计件
        selectedList: {
            handler(val) {
                val.forEach(item => {
                    item.inStockTotalAmountTax = item.stockNums * item.inStockIncludingTaxPrice
                    // 入库单位成本 = 入库单价 / (1 + 税率)
                    item.inStockCost = item.inStockIncludingTaxPrice / ( 1 + (this.findTextByValue(item.inStockRateCode, this.rateValueList) - 0))
                    item.inStockTotalAmount = item.stockNums * item.inStockCost
                })
            },
            deep: true,
            // immediate: true
        }
    },
    filters: {
        toFixed(val) {
            if(val) {
                let _val = val - 0
                return _val.toFixed(2)
            }
        },
        inStockRateFilter(val) {
            if(val) {
                return (val - 0 ) * 100 + '%'
            }
        }
    }
}
</script>
