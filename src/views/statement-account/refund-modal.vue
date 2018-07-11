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
                            <b-form-input value="采购对账" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="出入库对账" label-text-align="right" :label-cols="4">
                            <b-form-select :options="inOutTypelist" :value="needObj.inOutType" disabled/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="门店" label-text-align="right" :label-cols="4">
                            <b-form-input :value="needObj.storeName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="采购退货时间" label-text-align="right" :label-cols="4">
                            <el-date-picker
                                v-model="timeRange"
                                type="daterange"
                                placeholder="选择日期范围">
                            </el-date-picker>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="采购退货单号" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="queryOptions.purchaseReturnOrderNo"/>
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
                <div class="table-scrollable my-self-table-style">
                    <b-table striped hover bordered show-empty :items="skulist" :fields="fields">
                        <template slot="index" slot-scope="data">
                            <input type="checkbox" name="selected" :value="data.item" v-model="selectObj"></input>
                        </template>
                        <template slot="totalMoneyHan" slot-scope="data">
                            {{ data.item.isObey == 0 ? (data.item.totalMoney - 0).toFixed(2) : '' }}
                            {{ data.item.isObey == 1 ? (data.item.totalMoney + data.item.totalFreightFee).toFixed(2) : '' }}
                        </template>
                        <template slot="totalFreightFee" slot-scope="data">
                            {{ data.item.totalFreightFee ? (data.item.totalFreightFee - 0).toFixed(2) : data.item.totalFreightFee }}
                        </template>
                        <template slot="totalMoney" slot-scope="data">
                            {{ data.item.totalMoney ? (data.item.totalMoney - 0).toFixed(2) : data.item.totalMoney }}
                        </template>
                        <template slot="isBelong" slot-scope="data">
                            <!-- <b-form-select :options="isBelonglist" v-model="data.item.isObey"/> -->
                            {{ data.item.calFreigthFlag == 1 ? '是' : '否' }}
                        </template>
                        <template slot="empty">
                            暂无数据...
                        </template>
                    </b-table>
                </div>
                <div class="row mt-2">
                    <div class="col-md-6">
                        <input type="checkbox" v-model="isSelectAll">全选
                    </div>
                    <div class="col-md-6">
                        <a v-if="moreNums > 1" class="pull-right" href="javascript:;" @click="moreAndMore">更多>></a>
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
    import { MessageBox, Message, DatePicker, Table, TableColumn } from 'element-ui'
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
                isSelectAll: false,
                isBelonglist: [],
                checkedCities: [],
                moreNums: 1,
                timeRange: [],
                skulist: [],
                selectObj: [],
                submitArr: [],
                fields: {
                    index: {
                        label: '选择'
                    },
                    purchaseReturnOrderNo: {
                        label: '采购退货单号'
                    },
                    actualReturnDate: {
                        label: '实际退货时间'
                    },
                    purchaseReturnOrderType: {
                        label: '退货单类型'
                    },
                    totalNums: {
                        label: '退货总数量'
                    },
                    totalMoneyHan: {
                        label: '退货总金额(含税)'
                    },
                    totalFreightFee: {
                        label: '运费(含税)'
                    },
                    totalMoney: {
                        label: '商品退货总金额(含税)'
                    },
                    isBelong: {
                        label: '运费是否计入退货金额'
                    }
                },
                queryOptions: {
                    purchaseReturnOrderNo: '',
                    storeCode: '',
                    auditPassTimeStart: '',
                    auditPassTimeEnd: '',
                    isReconciliation: 1,
                    orderStatus: 3,
                    stockStatus: 1
                },
                addInfo: {
                    reconciliationDetailInfoList: []
                }
            }
        },
        methods: {
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
                _this.timeRange = []
                _this.queryOptions.auditPassTimeStart = ''
                _this.queryOptions.auditPassTimeEnd = ''
                _this.queryOptions.purchaseReturnOrderNo = ''
                _this.moreNums = 1
                _this.skulist = []
                _this.selectObj = []
                _this.submitArr = []
            },
            submitTicket() {
                const _this = this
                _this.submitArr = []
                console.log(_this.selectObj)
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
                        totalPrice: element.isObey == 1 ? element.totalMoney + element.totalFreightFee : element.totalMoney,
                        sourceNo: element.purchaseReturnOrderNo,
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
                                // Message({
                                //     type: 'success',
                                //     message: '生成成功'
                                // })
                                _this.selectObj = []
                                _this.submitArr = []
                                _this.$emit('successBack')
                            }
                        })
                        console.log(_this.submitArr)
                    }
                })
            },
            query(num) {
                const _this = this
                _this.queryOptions.pageStart = num === 0 ? 1 : num
                let timeObj = _this.timeRange.length > 0 ? common.formattingTime(_this.timeRange) : {}
                _this.queryOptions.auditPassTimeStart = timeObj.startTime === '1970-01-01'? '' : timeObj.startTime
                _this.queryOptions.auditPassTimeEnd = timeObj.endTime === '1970-01-01'? '' : timeObj.endTime
                if(num === 0) {
                    _this.skulist = []
                    _this.selectObj = []
                    _this.submitArr = []
                    _this.moreNums = 1
                    _this.isSelectAll = false
                }
                _this.queryOptions.pageNums = 10
                _this.queryOptions.storeCode = _this.needObj.storeCode
                _this.queryOptions.supplierCode = _this.needObj.supplierCode
                api.statementAccount.queryPurchaseReturnOrderInfos(_this.queryOptions, res => {
                    if(res.data.code === 'success') {
                        res.data.obj.list.forEach(element => {
                            element.isObey = 0
                            _this.skulist.push(element)
                        })
                    }
                })
            },
            moreAndMore() {
                const _this = this
                _this.moreNums++
                _this.query(_this.moreNums)
            }
        },
        created() {
            const _this = this
            _this.isBelonglist = config.statementAccount.isBelong
            _this.inOutTypelist = config.statementAccount.inoutType
        },
        watch: {
            isSelectAll: function(value) {
                if(value) {
                    this.selectObj = this.skulist
                }else {
                    this.selectObj = []
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

