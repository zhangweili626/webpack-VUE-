<template>
    <div>
        <b-card header="对账详情">
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账单号" label-text-align="right" :label-cols="4">
                        <b-form-input :value="addParams.reconciliationOrderNo" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="供货方" label-text-align="right" :label-cols="4">
                        <b-form-input :value="addParams.supplierName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="出入库对账" label-text-align="right" :label-cols="4">
                        <b-form-select :value="addParams.inOutType" :options="inOutTypeList" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="创建人" label-text-align="right" :label-cols="4">
                        <b-form-input :value="currentMan" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="创建时间" label-text-align="right" :label-cols="4">
                        <b-form-input :value="addParams.createTimeStr" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账类型" label-text-align="right" :label-cols="4">
                        <b-form-select :value="addParams.reconciliationType" :options="accountTypeList" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4" v-if="addParams.orderStatus || addParams.orderStatus === 0">
                    <b-form-fieldset horizontal label="单据状态" label-text-align="right" :label-cols="4">
                        <b-form-select :options="orderstatelist" :value="addParams.orderStatus" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4" v-if="addParams.reconciliationStatus || addParams.reconciliationStatus === 0">
                    <b-form-fieldset horizontal label="对账单核销状态" label-text-align="right" :label-cols="4">
                        <b-form-select :options="hexiaolist" :value="addParams.reconciliationStatus" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="门店" label-text-align="right" :label-cols="4">
                        <b-form-input :value="addParams.storeName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账确认人" label-text-align="right" :label-cols="4">
                        <b-form-input :value="sureMan" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账确认时间" label-text-align="right" :label-cols="4">
                        <b-form-input :value="addParams.reconciliationTime" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账批次数" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="addParams.totalBatchCount" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账总金额" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="addParams.totalAmount" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账总数量" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="addParams.totalSkuCount" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-8 col-lg-8">
                    <b-form-fieldset horizontal label="备注说明" label-text-align="right" :label-cols="2">
                        <b-form-input v-model="addParams.reconciliationRemark" :readonly="!isCanReWrite"/>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="danger" v-if="isShowDelete" @click="showDeleteModal">作废</b-button>
                        <b-button size="sm" variant="" @click="cancel">取消</b-button>                       
                        <b-button size="sm" variant="success" v-if="isShowSave" @click="saveAccount">保存</b-button>                       
                        <b-button size="sm" variant="success" v-if="isShowAccount" @click="sureAccount">确认对账</b-button>                       
                    </div>
                </div>
            </div>
        </b-card>
        <b-card v-if="isShowDetail">
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" v-if="isShowAddDetail" variant="danger" @click="deleteItem">删除</b-button>                    
                        <b-button size="sm" v-if="isShowAddDetail" variant="success" @click="showModal">新增</b-button>                                             
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="detaillist" :fields="fields">
                    <template slot="index" slot-scope="data">
                        <input type="radio" :disabled="radioDisabled" name="chooseItem" :value="data.item" v-model="chooseItem"/>
                    </template>
                    <template slot="inBatchNo" slot-scope="data">
                        <a href="javascript:;" @click="showBatchDetail(data.item.inBatchNo)">{{ data.item.inBatchNo }}</a>
                    </template>
                    <template slot="skuNums" slot-scope="data">
                        {{ data.item.skuNums ? (data.item.skuNums - 0).toFixed(0) : data.item.skuNums }}
                    </template>
                    <template slot="totalPrice" slot-scope="data">
                        {{ data.item.totalPrice ? (data.item.totalPrice - 0).toFixed(2) : data.item.totalPrice }}
                    </template>
                    <template slot="inStockPrice" slot-scope="data">
                        {{ data.item.inStockPrice ? (data.item.inStockPrice - 0).toFixed(2) : data.item.inStockPrice }}
                    </template>
                    <template slot="empty">
                        暂无数据...
                    </template>
                </b-table>
            </div>
        </b-card>
        <accountmodal :needObj="addParams" ref="accountmodal" @successBack="queryDetail"></accountmodal>
        <b-modal id="detailModal" ref="detailModal" size="lg" title="Large Modal" :hide-footer="true" :hide-header="true">
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="inbatchlist" :fields="inbatchfield">
                    <template slot="inStockIncludingTaxPrice" slot-scope="data">
                        {{ data.item.inStockIncludingTaxPrice ? (data.item.inStockIncludingTaxPrice - 0).toFixed(2) : '' }}
                    </template>
                    <template slot="inStockPrice" slot-scope="data">
                        {{ data.item.inStockPrice ? (data.item.inStockPrice - 0).toFixed(2) : '' }}
                    </template>
                    <template slot="empty">
                        暂无数据...
                    </template>
                </b-table>
            </div>
            <div class="row account-fen-ge-xian">
                <div class="col-md-6">
                    <div class="pull-left">
                        <a v-if="isShowMore" href="javascript:;" @click="moreMums">更多>></a>                                  
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="pull-right">
                        <b-button size="sm" variant="" @click="closeBatchModal">关闭</b-button>                                    
                    </div>
                </div>
            </div>
        </b-modal>
        <irismodal ref="myModal" @sureEvent="destroyItem"></irismodal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import irismodal from 'components/iris-modal'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import pagination from 'components/pagination/pagination.vue'
    import accountmodal from './account-modal.vue'
    import api from 'common/api'
    import config from 'common/config'
    import common from 'common/common'
    import { MessageBox, Message, DatePicker } from 'element-ui'
    Vue.use(DatePicker)
    export default {
        components: {
            areaqueryshop,
            pagination,
            accountmodal,
            irismodal
        },
        data() {
            return {
                inbatchlist: [],
                isJustShow: false,
                radioDisabled: false,
                chooseItem: '',
                isShowAddDetail: true,
                isShowDetail: false,
                isShowAccount: false,
                isShowDelete: false,
                isShowSave: true,
                isCanReWrite: true,
                amountCreateTime: '',
                amountSureTime: '',
                currentMan: '',
                sureMan: '',
                accountTypeList: [],
                inOutTypeList: [],
                orderstatelist: [],
                hexiaolist: [],
                detaillist: [],
                choosedObj: {},
                inbatchNo: '',
                tempNums: 1,
                isShowMore: false,
                inbatchfield: {
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
                },
                addParams: {
                    reconciliationOrderNo: '',
                    supplierCode: '',
                    supplierName: '',
                    reconciliationType: '',
                    reconciliationStatus: '',
                    orderStatus: '',
                    inOutType: '',
                    totalSkuCount: '',
                    totalAmount: '',
                    totalBatchCount: '',
                    reconciliationRemark: '',
                    reconciliationTime: '',
                    createTimeStr: '',
                    storeCode: '',
                    storeName: ''
                },
                fields: {
                    index: {
                        label: '选择'
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
                    skuNums: {
                        label: '入库数量'
                    },
                    totalPrice: {
                        label: '入库总金额(含税)'
                    },
                    inBatchNo: {
                        label: '关联批次号'
                    }
                },
                page: {

                }
            }
        },
        methods: {
            showDeleteModal() {
                const _this = this
                _this.$refs.myModal.showDeleteModel()
            },
            closeBatchModal() {
                const _this = this
                _this.$refs.detailModal.hide()
                _this.tempNums = 1
                _this.inbatchNo = ''
                _this.inbatchlist = []
            },
            moreMums() {
                const _this = this
                _this.tempNums++
                let option = {
                    inBatchNo: _this.inbatchNo,
                    pageNums: 10,
                    isSentStore: false,
                    pageStart: _this.tempNums
                }
                api.statementAccount.queryInventoryList(option, res => {
                    if(res.data.code === 'success') {
                        // _this.inbatchlist = res.data.obj.list
                        res.data.obj.list.forEach(element => {
                            _this.inbatchlist.push(element)
                        })
                        if(res.data.obj.list.length > 9) {
                            _this.isShowMore = true
                        }else {
                            _this.isShowMore = false
                        }
                    }
                })
            },
            showBatchDetail(value) {
                const _this = this
                _this.inbatchNo = value
                let option = {
                    inBatchNo: _this.inbatchNo,
                    pageNums: 10,
                    isSentStore: false,
                    pageStart: 1
                }
                api.statementAccount.queryInventoryList(option, res => {
                    if(res.data.code === 'success') {
                        _this.inbatchlist = res.data.obj.list
                        if(res.data.obj.list.length > 9) {
                            _this.isShowMore = true
                        }else {
                            _this.isShowMore = false
                        }
                        _this.$refs.detailModal.show()
                    }
                })
            },
            queryDetail() {
               const _this = this
               _this.$refs.accountmodal.hideAddDetail()
               _this.getOrderInfo()
            },
            destroyItem() {
                const _this = this
                let option = {
                    reconciliationOrderNo: _this.addParams.reconciliationOrderNo
                }
                api.statementAccount.cleanReconciliationOrderInfo(option, res => {
                    if(res.data.code === 'success') {
                        Message({
                            type: 'success',
                            message: '作废成功'
                        })
                        _this.$refs.myModal.closeDeleteModel()
                        _this.isShowDelete = false
                        _this.isShowSave = false
                        _this.isShowAccount = false
                        _this.isShowAddDetail = false
                        _this.isCanReWrite = false
                        _this.radioDisabled = true
                    }
                })
            },
            cancel() {
                const _this = this
                _this.$router.push({
                    path: 'query'
                })
            },
            deleteItem() {
                const _this = this
                if(_this.chooseItem) {
                    let tempObj = _this.chooseItem
                    tempObj.isDeleted = 1
                    let option = [
                        tempObj
                    ]
                    api.statementAccount.editReconciliationDetailInfo(option, res => {
                        if(res.data.code === 'success') {
                            Message({
                                type: 'success',
                                message: '删除成功'
                            })
                            _this.chooseItem = ''
                            _this.getOrderInfo()
                        }
                    })
                }else {
                    Message({
                        type: 'warning',
                        message: '请选择删除项'
                    })
                }
            },
            sureAccount() {
                const _this = this
                if(_this.detaillist) {
                    if(_this.detaillist.length === 0) {
                        Message({
                            type: 'warning',
                            message: '无明细时不允许确认对账'
                        })
                        return
                    }
                }else {
                    Message({
                        type: 'warning',
                        message: '无明细时不允许确认对账'
                    })
                    return
                }
                let option = {
                    reconciliationOrderNo: _this.addParams.reconciliationOrderNo
                }
                api.statementAccount.confirmReconciliationOrderInfo(option, res => {
                    if(res.data.code === 'success') {
                        _this.addParams.reconciliationTime = res.data.obj.reconciliationTime
                        Message({
                            type: 'success',
                            message: '确认成功'
                        })
                        _this.isShowDelete = false
                        _this.isShowSave = false
                        _this.isShowAccount = false
                        _this.isShowAddDetail = false
                        _this.isCanReWrite = false
                        _this.radioDisabled = true
                    }
                })
            },
            showModal() {
                const _this = this
                _this.$refs.accountmodal.showAddDetail()
                _this.$refs.accountmodal.reset()
            },
            saveAccount() {
                const _this = this
                if(_this.addParams.id) {
                    //暂时的
                    api.statementAccount.updateReconciliationOrderInfo(_this.addParams, res => {
                        if(res.data.code === 'success') {
                            Message({
                                type: 'success',
                                message: '保存成功'
                            })
                            _this.addParams.id = res.data.obj.id
                            _this.isShowDelete = true
                            _this.isShowAccount = true
                            _this.isShowDetail = true  
                        }
                    })
                }else {
                    api.statementAccount.insertReconciliationOrderInfo(_this.addParams, res => {
                        if(res.data.code === 'success') {
                            Message({
                                type: 'success',
                                message: '保存成功'
                            })
                            _this.addParams.id = res.data.obj.id
                            _this.isShowDelete = true
                            _this.isShowAccount = true
                            _this.isShowDetail = true
                            _this.addParams.createTimeStr = res.data.obj.createTimeStr 
                        }
                    })
                }
            },
            // 获取对账单信息
            getOrderInfo() {
                const _this = this
                let option = {
                    reconciliationOrderNo: _this.addParams.reconciliationOrderNo
                }
                api.statementAccount.getReconciliationOrderInfoByCode(option, res => {
                    if(res.data.code === 'success') {
                //         addParams: {
                //     reconciliationOrderNo: '',
                //     supplierCode: '',
                //     supplierName: '',
                //     reconciliationType: '',
                //     reconciliationStatus: '',
                //     orderStatus: '',
                //     inOutType: '',
                //     totalSkuCount: '',
                //     totalAmount: '',
                //     totalBatchCount: '',
                //     reconciliationRemark: '',
                //     reconciliationTime: '',
                //     createTimeStr: '',
                //     storeCode: '',
                //     storeName: ''
                // }
                        _this.addParams.totalAmount = res.data.obj.totalAmount ? (res.data.obj.totalAmount - 0).toFixed(2) : ''
                        _this.addParams.totalSkuCount = res.data.obj.totalSkuCount ? (res.data.obj.totalSkuCount - 0).toFixed(0) : ''
                        _this.addParams.totalBatchCount = res.data.obj.totalBatchCount ? (res.data.obj.totalBatchCount - 0).toFixed(0) : ''
                        _this.addParams.storeName = res.data.obj.storeName
                        _this.addParams.storeCode = res.data.obj.storeCode
                        _this.addParams.reconciliationTime = res.data.obj.reconciliationTime
                        _this.addParams.reconciliationRemark = res.data.obj.reconciliationRemark
                        _this.addParams.inOutType = res.data.obj.inOutType
                        _this.addParams.supplierName = res.data.obj.supplierName
                        _this.addParams.supplierCode = res.data.obj.supplierCode
                        _this.addParams.reconciliationOrderNo = res.data.obj.reconciliationOrderNo
                        _this.addParams.createTimeStr = res.data.obj.createTimeStr
                        _this.addParams.reconciliationType = res.data.obj.reconciliationType
                        _this.detaillist = res.data.obj.reconciliationDetailInfoList ? res.data.obj.reconciliationDetailInfoList : []
                        _this.addParams.reconciliationStatus = res.data.obj.reconciliationStatus
                        _this.addParams.orderStatus = res.data.obj.orderStatus
                        _this.sureMan = res.data.obj.reconciliationEmpName
                        _this.currentMan = res.data.obj.createName
                        if(res.data.obj.orderStatus === 0) {
                            if(_this.isJustShow) {
                                _this.isShowAddDetail = false
                                _this.isShowDelete = false
                                _this.isShowSave = false
                                _this.isShowAccount = false
                                _this.radioDisabled = true
                                _this.isCanReWrite = false
                            }else {
                                _this.isShowAddDetail = true
                                _this.isShowDelete = true
                                _this.isShowSave = true
                                _this.isShowAccount = true
                            }
                        }else {
                            _this.isShowAddDetail = false
                            _this.isShowDelete = false
                            _this.isShowSave = false
                            _this.isShowAccount = false
                            _this.radioDisabled = true
                            _this.isCanReWrite = false
                        }
                    }
                })
            },
            getSequence() {
                const _this = this
                let option = {
                    serviceCode: config.statementAccount.mainSeq
                }
                api.ordinalInfo.getSequence(option, res => {
                    if(res.data.code === 'success') {
                        _this.addParams.reconciliationOrderNo = res.data.obj
                    }
                })
            },
            getUrlParams() {
                const _this = this
                let judgeObj = _this.$route
                _this.choosedObj = _this.$route.query
                console.log(_this.$route)
                console.log(_this.choosedObj)
                if(judgeObj.name === 'statement-account-addaccount') {
                    _this.getSequence()
                    _this.addParams.supplierName = _this.choosedObj.chooseName
                    _this.addParams.supplierCode = _this.choosedObj.chooseCode
                    _this.addParams.inOutType = _this.choosedObj.inOutType
                    _this.addParams.storeName = _this.choosedObj.storeName
                    _this.addParams.storeCode = _this.choosedObj.storeCode
                    _this.addParams.reconciliationType = _this.choosedObj.reconciliationType
                }else if(judgeObj.name === 'statement-account-editaccount') {
                    _this.isShowDetail = true
                    _this.addParams.reconciliationOrderNo = _this.choosedObj.reconciliationOrderNo
                    _this.getOrderInfo()
                }else if(judgeObj.name === 'statement-account-showaccount') {
                    _this.isShowDetail = true
                    _this.isJustShow = true
                    _this.fields = {
                        // index: {
                        //     label: '选择'
                        // },
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
                        skuNums: {
                            label: '入库数量'
                        },
                        totalPrice: {
                            label: '入库总金额(含税)'
                        },
                        inBatchNo: {
                            label: '关联批次号'
                        }
                    }
                    _this.addParams.reconciliationOrderNo = _this.choosedObj.reconciliationOrderNo
                    _this.getOrderInfo()
                }
            },
            
        },
        created() {
            const _this = this
            _this.accountTypeList = config.statementAccount.accountType
            _this.inOutTypeList = config.statementAccount.inoutType
            _this.orderstatelist = config.statementAccount.ticketType
            _this.hexiaolist = config.statementAccount.accountState
            _this.currentMan = JSON.parse(common.getSession('userInfo')).empVo.empCnName
            _this.modalCreateBy = JSON.parse(common.getSession('userInfo')).empVo.empCnName
            _this.sureMan = JSON.parse(common.getSession('userInfo')).empVo.empCnName
            _this.getUrlParams()
        }   
    }
</script>
<style>

</style>


