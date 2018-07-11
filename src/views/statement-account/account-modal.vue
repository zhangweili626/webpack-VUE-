<template>
    <div class="account-style-statement-detail">
        <b-modal id="modalPrevent"
                ref="modal"
                size="lg"
                :hide-footer="true"
                :hide-header="true">
                <div class="row">
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="供货方" label-text-align="right" :label-cols="4">
                            <b-form-input :value="needObj.supplierName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="对账类型" label-text-align="right" :label-cols="4">
                            <b-form-select  :options="accountTypelist" :value="needObj.reconciliationType" disabled/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="处理维度" label-text-align="right" :label-cols="4">
                            <b-form-select v-model="dimensionality" :options="dimensionalities"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="批次号" label-text-align="right" :label-cols="4">
                            <b-form-input :readonly="judgeDimensionality" v-model="queryParams.inBatchNo"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="门店" label-text-align="right" :label-cols="4">
                            <b-form-input :value="needObj.storeName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="出入库对账" label-text-align="right" :label-cols="4">
                            <b-form-select :options="inorOutlist" :value="needObj.inOutType" disabled/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="商品编码" label-text-align="right" :label-cols="4">
                            <b-form-input :readonly="!judgeDimensionality" v-model="queryParams.skuCode"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="69码" label-text-align="right" :label-cols="4">
                            <b-form-input :readonly="!judgeDimensionality" v-model="queryParams.barCode"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="原厂编码" label-text-align="right" :label-cols="4">
                            <b-form-input :readonly="!judgeDimensionality" v-model="queryParams.originalCode"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="商品名称" label-text-align="right" :label-cols="4">
                            <b-form-input :readonly="!judgeDimensionality" v-model="queryParams.skuName"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="入库时间" label-text-align="right" :label-cols="4">
                            <el-date-picker
                                v-model="timeRange"
                                type="daterange"
                                placeholder="选择日期范围">
                            </el-date-picker>
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row account-fen-ge-xian">
                    <div class="col-md-12">
                        <div class="pull-right">
                            <b-button size="sm" variant="" @click="reset">重置</b-button>                                    
                            <b-button size="sm" variant="primary" @click="query(0)">查询</b-button>
                        </div>
                    </div>
                </div>
                <!-- <el-table
                    :data="skulist"
                    height="300"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="index"
                    label="选择">
                    </el-table-column>
                    <el-table-column
                    prop="date"
                    label="批次号">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="系统入库时间">
                    </el-table-column>
                    <el-table-column
                    prop="address"
                    label="业务入库时间">
                    </el-table-column>
                    <el-table-column
                    prop="amount"
                    label="数量">
                    </el-table-column>
                    <el-table-column
                    prop="money"
                    label="入库金额">
                    </el-table-column>
                </el-table> -->
                <div class="table-scrollable my-self-table-style">
                    <b-table striped hover bordered show-empty :items="skulist" :fields="fields">
                        <template slot="index" slot-scope="data">
                            <input type="checkbox" name="selected" :value="data.item" v-model="selectObj"></input>
                        </template>
                        <template slot="inNums" slot-scope="data">
                            {{ data.item.inNums ? (data.item.inNums - 0).toFixed(0) : data.item.inNums }}
                        </template>
                        <template slot="inStockPrice" slot-scope="data">
                            {{ data.item.inStockPrice ? (data.item.inStockPrice - 0).toFixed(2) : data.item.inStockPrice }}
                        </template>
                        <template slot="inStockIncludingTaxPrice" slot-scope="data">
                            {{ data.item.inStockIncludingTaxPrice ? (data.item.inStockIncludingTaxPrice - 0).toFixed(2) : data.item.inStockIncludingTaxPrice }}
                        </template>
                        <!-- <template slot="isBelong" slot-scope="data">
                            <b-form-select :options="isBelonglist"/>
                        </template> -->
                        <template slot="empty">
                            暂无数据...
                        </template>
                    </b-table>
                </div>
                <div class="row mt-2">
                    <div class="col-md-6">
                        <div class="pull-left">
                            <input type="checkbox" v-model="isChooseAll" />全选
                        </div>
                    </div>
                    <div class="col-md-6">
                        <a v-if="isShowMore" class="pull-right" href="javascript:;" @click="moreAndMore">更多>></a>
                    </div>
                </div>
                <div class="row">
                    <div class="bothAccountTicket" @click="submitTicket">生成对账单</div>
                </div>
        </b-modal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import pagination from 'components/pagination/pagination.vue'
    import accountmodal from './account-modal.vue'
    import api from 'common/api'
    import config from 'common/config'
    import common from 'common/common'
    import { MessageBox, Message, DatePicker, Table, TableColumn} from 'element-ui'
    Vue.use(DatePicker)
    Vue.use(Table)
    Vue.use(TableColumn)
    export default {
        components: {
            areaqueryshop,
            pagination,
            accountmodal
        },
        props: {
            needObj: {
                type: Object,
                default: function() {
                    return {}
                }
            }
        },
        data() {
            return {
                judgeDimensionality: false,
                isChooseAll: false,
                isShowMore: false,
                moreNums: 1,
                // isBelonglist: [],
                selectObj: [],
                submitArr: [],
                inorOutlist: [],
                timeRange: [],
                skulist: [],
                dimensionality: 1,
                dimensionalities: [],
                queryParams: {
                    inBatchNo: '',
                    skuCode: '',
                    skuName: '',
                    originalCode: '',
                    barCode: '',
                    supplierType: '',
                    isReconciliation: 1,
                    stockStatus: 0
                },
                fields: {
                    index: {
                        label: '选择'
                    },
                    inBatchNo: {
                        label: '批次号'
                    },
                    inStockSystemTime: {
                        label: '系统入库时间'
                    },
                    inStockBusinessTime: {
                        label: '业务入库时间'
                    },
                    inNums: {
                        label: '入库数量'
                    },
                    inStockPrice: {
                        label: '入库金额含税'
                    }
                }
            }
        },
        methods: {
            submitTicket() {
                const _this = this
                _this.submitArr = []
                _this.selectObj.forEach(element => {
                    let obj = {
                        reconciliationOrderNo: _this.needObj.reconciliationOrderNo,
                        inOutType: _this.needObj.inOutType,
                        skuCode: element.skuCode,
                        skuTempCode: element.skuTempCode,
                        skuName: element.skuName,
                        brandCode: element.brandCode,
                        brandName: element.brandName,
                        skuStandards: element.skuStandards,
                        skuModel: element.skuModel,
                        originalCode: element.originalCode,
                        barCode: element.barCode,
                        externalCode: element.externalCode,
                        inBatchNo: element.inBatchNo,
                        skuNums: element.totalNums,
                        unitPrice: element.unitPrice,
                        totalPrice: element.totalMoney,
                        sourceNo: element.inBatchNo,
                        sourceTypeCode: _this.needObj.reconciliationType == '1' ? config.statementAccount.sourceType.allot : config.statementAccount.sourceType.purchase,
                        sourceTypeName: element.sourceTypeName
                    } 
                    _this.submitArr.push(obj)
                })
                if(_this.submitArr.length === 0) {
                    Message({
                        type: 'warning',
                        message: '请选择明细'
                    })
                    return
                }
                let option = {
                    serviceCode: config.statementAccount.detailSeq,
                    getNums: _this.submitArr.length
                }
                api.ordinalInfo.getSequenceList(option, res => {
                    if(res.data.code === 'success') {
                        let tempArr = res.data.obj
                        for(let i = 0; i< tempArr.length; i++) {
                            _this.submitArr[i].reconciliationDetailCode = tempArr[i]
                        }
                        api.statementAccount.editReconciliationDetailInfo(_this.submitArr, res => {
                            if(res.data.code === 'success') {
                                _this.selectObj = []
                                _this.submitArr = []
                                _this.$emit('successBack')
                            }
                        })
                        console.log(_this.submitArr)
                    }
                })
            },
            showAddDetail() {
                const _this = this
                _this.$refs.modal.show()
            },
            hideAddDetail() {
                const _this = this
                _this.$refs.modal.hide()
            },
            reset() {
                const _this = this
                _this.queryParams = {}
                _this.dimensionality = 1
                _this.moreNums = 1
                _this.skulist = []
                _this.selectObj = []
                _this.submitArr = []
                _this.timeRange = []
            },
            moreAndMore() {
                const _this = this
                _this.moreNums++
                _this.query(_this.moreNums)
            },
            query(value) {
                const _this = this
                let option = _this.queryParams
                let timeObj = _this.timeRange.length > 0 ? common.formattingTime(_this.timeRange) : {}
                _this.queryParams.inStockBusinessStartTime = timeObj.startTime === '1970-01-01'? '': timeObj.startTime
                _this.queryParams.inStockBusinessEndTime = timeObj.endTime === '1970-01-01'? '' : timeObj.endTime
                _this.queryParams.pageNums = 10
                _this.queryParams.pageStart = value == 0 ? 1 : value
                _this.queryParams.isReconciliation = 1
                _this.queryParams.stockStatus = 0
                _this.queryParams.supplierType = _this.needObj.reconciliationType
                if(value == 0) {
                    _this.skulist = []
                    _this.selectObj = []
                    _this.submitArr = []
                    _this.moreNums = 1
                    _this.isChooseAll = false
                }
                _this.queryParams.storeCodes = []
                // _this.queryParams.storeCodes.push('STORE2000905')
                _this.queryParams.storeCodes.push(_this.needObj.storeCode)
                _this.queryParams.supplierCode = _this.needObj.supplierCode
                if(_this.dimensionality == 1) {
                    _this.fields = {
                        index: {
                            label: '选择'
                        },
                        inBatchNo: {
                            label: '批次号'
                        },
                        inStockSystemTime: {
                            label: '系统入库时间'
                        },
                        inStockBusinessTime: {
                            label: '业务入库时间'
                        },
                        inNums: {
                            label: '入库数量'
                        },
                        inStockPrice: {
                            label: '入库金额含税'
                        }
                    }
                }else {
                    _this.fields = {
                        index: {
                            label: '选择'
                        },
                        inBatchNo: {
                            label: '批次号'
                        },
                        skuCode: {
                            label: '商品编码'
                        },
                        skuName: {
                            label: '商品名称'
                        },
                        barCode: {
                            label: '69码'
                        },
                        originalCode: {
                            label: '原厂编码'
                        },
                        inStockSystemTime: {
                            label: '系统入库时间'
                        },
                        inStockBusinessTime: {
                            label: '实际入库时间'
                        },
                        inNums: {
                            label: '数量'
                        },
                        inStockIncludingTaxPrice: {
                            label: '入库单价(含税)'
                        },
                        inStockPrice: {
                            label: '入库金额(含税)'
                        }
                    }
                }
                if(_this.needObj.reconciliationType == '1') {
                    if(_this.dimensionality == 1) {
                        option.skuCode = ''
                        option.barCode = ''
                        option.originalCode = ''
                        option.skuName = ''
                        api.statementAccount.queryCountStockDetailBatch(option, res => {
                            if(res.data.code === 'success') {
                                if(res.data.obj.list.length > 9) {
                                    _this.isShowMore = true
                                }
                                if(res.data.obj.list.length === 0) {
                                    _this.isShowMore = false
                                }
                                res.data.obj.list.forEach(element => {
                                    _this.skulist.push(element)
                                }) 
                                
                            }
                        })
                    }else {
                        option.inBatchNo = ''
                        api.statementAccount.queryInventoryList(option, res => {
                            if(res.data.code === 'success') {
                                if(res.data.obj.list.length > 9) {
                                    _this.isShowMore = true
                                }
                                if(res.data.obj.list.length === 0) {
                                    _this.isShowMore = false
                                }
                                res.data.obj.list.forEach(element => {
                                    _this.skulist.push(element)
                                }) 
                            }
                        })
                    }
                }else {
                    if(_this.dimensionality == 1) {
                        option.skuCode = ''
                        option.barCode = ''
                        option.originalCode = ''
                        option.skuName = ''
                    }else {
                        option.inBatchNo = ''
                    }
                    // api.statementAccount.queryPurchaseOrderInfo(option, res => {
                    //     if(res.data.code === 'success') {
                    //         _this.queryParams.inSourceNoList = []
                    //         res.data.obj.forEach(element => {
                    //             _this.queryParams.inSourceNoList.push(element.orderNo)
                    //         })
                    if(_this.dimensionality === 1) {
                        api.statementAccount.queryCountStockDetailBatch(_this.queryParams, res => {
                            if(res.data.code === 'success') {
                                if(res.data.obj.list.length > 9) {
                                    _this.isShowMore = true
                                }
                                if(res.data.obj.list.length === 0) {
                                    _this.isShowMore = false
                                }
                                console.log(1)
                                res.data.obj.list.forEach(element => {
                                    _this.skulist.push(element)
                                }) 
                                
                            }
                        })
                    }else {
                        api.statementAccount.queryInventoryList(_this.queryParams, res => {
                            if(res.data.code === 'success') {
                                if(res.data.obj.list.length > 9) {
                                    _this.isShowMore = true
                                }
                                if(res.data.obj.list.length === 0) {
                                    _this.isShowMore = false
                                }
                                res.data.obj.list.forEach(element => {
                                    _this.skulist.push(element)
                                }) 
                            }
                        })
                    }
                        // }
                    // })
                }
            }
        },
        created() {
            const _this = this
            _this.dimensionalities = config.statementAccount.dimensionalities
            _this.inorOutlist = config.statementAccount.inoutType
            _this.accountTypelist = config.statementAccount.accountType
            // _this.isBelonglist = config.statementAccount.isBelong
        },
        watch: {
            isChooseAll: function(value) {
                // console.log(value)
                if(value) {
                    this.selectObj = this.skulist
                }else {
                    this.selectObj = []
                }
            },
            dimensionality: function(value) {
                const _this = this
                if(value == 1) {
                    _this.judgeDimensionality = false
                    _this.queryParams.skuCode = ''
                    _this.queryParams.skuName = ''
                    _this.queryParams.barCode = ''
                    _this.queryParams.originalCode = ''
                }else if(value ==2) {
                    _this.judgeDimensionality = true
                    _this.queryParams.inBatchNo = ''
                }
            }
        }   
    }
</script>
<style>
    .account-fen-ge-xian {
        padding-bottom: 10px !important;
    }
    .my-self-table-style {
        max-height: 270px;
        overflow-y: auto;
    }
    .account-style-statement-detail .modal-dialog {
        margin: 10px auto !important;
        min-width: 1100px !important;
    }
    .bothAccountTicket {
        margin: 0 auto;
        width: 200px;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        border-radius: 5px;
        color: #fff;
        text-align: center;
        cursor: pointer;
        background-color: rgb(67, 155, 196);
    }
</style>

