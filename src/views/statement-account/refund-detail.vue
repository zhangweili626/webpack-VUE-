<template>
    <div>
        <b-card header="对账详情">
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账单号" label-text-align="right" :label-cols="4">
                        <b-form-input :value="addParams.reconciliationOrderNo" readonly/>
                    </b-form-fieldset>
                </div>
                <!-- <div class="col-md-4 col-lg-4">
                    <div class="skuNameOrskuCode">
                        <div class="skuNameOrskuCodeLabel">供应商</div>
                        <input type="text" v-model="searchValue" @focus.stop="showFrameAccount" @click.stop="stopPop"/>
                        <div v-if="isShowSearch" class="skuNameOrskuCodeContainerAccount">
                            <div class="skuNameOrskuCodeContainerItem" v-for="(item, index) in modalSkulist" :key="index" @click.stop="itemClick(item)">{{ item.text }}</div>
                        </div>
                    </div>
                </div> -->
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
                        <b-form-input :value="currentMan" readonly />
                    </b-form-fieldset>
                </div>
                <!-- <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="创建时间" label-text-align="right" :label-cols="4">
                        <el-date-picker
                            v-model="amountCreateTime"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </b-form-fieldset>
                </div> -->
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
                        <!-- <areaqueryshop ref="areaqueryshopAddRefund" @select-change="selectedfunqueryRefund"></areaqueryshop> -->
                        <b-form-input :value="addParams.storeName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账确认人" label-text-align="right" :label-cols="4">
                        <b-form-input :value="sureMan" readonly/>
                    </b-form-fieldset>
                </div>
                <!-- <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账确认时间" label-text-align="right" :label-cols="4">
                        <el-date-picker
                            v-model="amountSureTime"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </b-form-fieldset>
                </div> -->
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
                <div class="col-md-4">
                    <div class="pull-left">
                        <b-button size="sm" v-if="isShowAddDetail" variant="danger" @click="deleteItem">删除</b-button>                    
                        <b-button size="sm" v-if="isShowAddDetail" variant="success" @click="showModal">新增</b-button>                                             
                    </div>
                </div>
                <div class="col-md-8">
                    <div>
                        <span>计入退货运费合计: {{ totalDetailMoney }}元</span>
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="detaillist" :fields="fields">
                    <template slot="index" slot-scope="data"> 
                        <input type="radio" name="chooseItem" :disabled="radioDisabled" :value="data.item" v-model="chooseItem"/>
                    </template>
                    <template slot="totalPrice" slot-scope="data">
                        {{ data.item.totalPrice ? (data.item.totalPrice - 0).toFixed(2) : data.item.totalPrice }}
                    </template>
                    <template slot="calFreigthFlag" slot-scope="data">
                        {{ data.item.calFreigthFlag == 1 ? '是' : '否' }}
                    </template>
                    <template slot="totalFreightFee" slot-scope="data">
                        {{ data.item.totalFreightFee ? (data.item.totalFreightFee - 0).toFixed(2) : data.item.totalFreightFee }}
                    </template>
                    <template slot="totalMoney" slot-scope="data">
                        {{ data.item.totalMoney ? (data.item.totalMoney - 0).toFixed(2) : data.item.totalMoney }}
                    </template>
                    <template slot="empty">
                        暂无数据...
                    </template>
                </b-table>
            </div>
            <!-- <div class="row mt-2">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="pageChange" :page-no="page.pageNo" :page-size="page.pageSize" :total-result="page.totalResult" :total-pages="page.totalPages">
                 </pagination>
               </div>
            </div> -->
        </b-card>
        <irismodal ref="myModal" @sureEvent="destroyItem"></irismodal>
        <accountmodal ref="refundModal" :needObj="addParams" @successBack="queryDetail()"></accountmodal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import pagination from 'components/pagination/pagination.vue'
    import accountmodal from './refund-modal.vue'
    import irismodal from 'components/iris-modal'
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
                totalDetailMoney: 0,
                radioDisabled: false,
                isJustShow: false,
                chooseItem: '',
                isShowAddDetail: true,
                isShowDetail: false,
                isShowAccount: false,
                isShowDelete: false,
                isShowSave: true,
                isCanReWrite: true,
                currentMan: '',
                sureMan: '',
                inOutTypeList: [],
                isShowSearch: false,
                modalSkulist: [],
                hexiaolist: [],
                orderstatelist: [],
                accountTypeList: [],
                searchValue: '',
                amountCreateTime: '',
                amountSureTime: '',
                detaillist: [],
                choosedObj: {},
                addParams: {
                    reconciliationOrderNo: '',
                    supplierCode: '',
                    supplierName: '',
                    reconciliationType: 0,
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
                    sourceNo: {
                        label: '退货单号'
                    },
                    skuNums: {
                        label: '退货数量'
                    },
                    totalPrice: {
                        label: '退货总金额'
                    },
                    calFreigthFlag: {
                        label: '是否计入退货金额'
                    },
                    totalFreightFee: {
                        label: '运费(含税)'
                    },
                    totalMoney: {
                        label: '退货金额(含税)'
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
            queryDetail() {
                const _this = this
                _this.$refs.refundModal.hideAddDetail()
                _this.getOrderInfo()
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
            getOrderInfo() {
                const _this = this
                let option = {
                    reconciliationOrderNo: _this.addParams.reconciliationOrderNo
                }
                api.statementAccount.getReconciliationOrderInfoByCode(option, res => {
                    if(res.data.code === 'success') {
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
                        _this.addParams.reconciliationStatus = res.data.obj.reconciliationStatus
                        _this.addParams.orderStatus = res.data.obj.orderStatus
                        _this.detaillist = res.data.obj.reconciliationDetailInfoList ? res.data.obj.reconciliationDetailInfoList : []
                        _this.totalDetailMoney = 0
                        _this.detaillist.forEach(element => {
                            if(element.calFreigthFlag == 1) {
                                _this.totalDetailMoney += (element.totalPrice - element.totalMoney)
                            }
                        })  
                        _this.totalDetailMoney = _this.totalDetailMoney.toFixed(2)
                        _this.sureMan = res.data.obj.reconciliationEmpName
                        _this.currentMan = res.data.obj.createName
                        if(res.data.obj.orderStatus == 0) {
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
            saveAccount() {
                const _this = this
                if(_this.addParams.id) {
                    //暂时的
                    api.statementAccount.updateReconciliationOrderInfo(_this.addParams, res => {
                        if(res.data.code === 'success') {
                            _this.addParams.id = res.data.obj.id
                            Message({
                                type: 'success',
                                message: '保存成功'
                            })
                            _this.isShowDetail = true
                            _this.isShowDelete = true
                            _this.isShowAccount = true
                        }
                    })
                }else {
                    api.statementAccount.insertReconciliationOrderInfo(_this.addParams, res => {
                        if(res.data.code === 'success') {
                            _this.addParams.id = res.data.obj.id
                            Message({
                                type: 'success',
                                message: '保存成功'
                            })
                            _this.isShowDetail = true
                            _this.isShowDelete = true
                            _this.isShowAccount = true
                            _this.addParams.createTimeStr = res.data.obj.createTimeStr 
                        }
                    })
                }
            },
            showFrameAccount() {
                const _this = this
                _this.isShowSearch = true
            },
            hideFrameAccount() {
                const _this = this
                _this.isShowSearch = false
            },
            itemClick(value) {
                const _this = this
                _this.hideFrameAccount()
            },
            stopPop() {

            },
            // pageChange() {

            // },
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
                    }
                })
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
                    }
                })
            },
            showModal() {
                const _this = this
                _this.$refs.refundModal.showAddDetail()
                _this.$refs.refundModal.reset()
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
                if(judgeObj.name === 'statement-account-addrefund') {
                    _this.getSequence()
                    _this.addParams.supplierName = _this.choosedObj.chooseName
                    _this.addParams.supplierCode = _this.choosedObj.chooseCode
                    _this.addParams.inOutType = _this.choosedObj.inOutType
                    _this.addParams.storeName = _this.choosedObj.storeName
                    _this.addParams.storeCode = _this.choosedObj.storeCode
                    _this.addParams.reconciliationType = _this.choosedObj.reconciliationType
                }else if(judgeObj.name === 'statement-account-editrefund') {
                    _this.isShowDetail = true
                    _this.addParams.reconciliationOrderNo = _this.choosedObj.reconciliationOrderNo
                    _this.getOrderInfo()
                }else if(judgeObj.name === 'statement-account-showrefund') {
                    _this.isShowDetail = true
                    _this.isJustShow = true
                    // _this.fields = {
                    //     // index: {
                    //     //     label: '选择'
                    //     // },
                    //     skuCode: {
                    //         label: '商品编码'
                    //     },
                    //     skuName: {
                    //         label: '商品名称'
                    //     },
                    //     barCode: {
                    //         label: '69码'
                    //     },
                    //     originalCode: {
                    //         label: '原厂编码'
                    //     },
                    //     skuNums: {
                    //         label: '入库数量'
                    //     },
                    //     totalPrice: {
                    //         label: '入库总金额(含税)'
                    //     },
                    //     inBatchNo: {
                    //         label: '关联批次号'
                    //     }
                    // }
                    _this.addParams.reconciliationOrderNo = _this.choosedObj.reconciliationOrderNo
                    _this.getOrderInfo()
                }
                
            }
        },
        created() {
            const _this = this
            _this.inOutTypeList = config.statementAccount.inoutType
            _this.accountTypeList = config.statementAccount.accountType
            _this.orderstatelist = config.statementAccount.ticketType
            _this.hexiaolist = config.statementAccount.accountState
            _this.currentMan = JSON.parse(common.getSession('userInfo')).empVo.empCnName
            _this.modalCreateBy = JSON.parse(common.getSession('userInfo')).empVo.empCnName
            _this.sureMan = JSON.parse(common.getSession('userInfo')).empVo.empCnName
            _this.getUrlParams()
        },
        watch: {
            searchValue: function(value) {
                const _this = this
                _this.modalSkulist = []
                let option = {
                    pageNums: 5,
                    supplierName: value
                }
                api.statementAccount.querySupplierInfo(option, res => {
                    if(res.data.code === 'success') {
                        let tempArr = res.data.obj.list
                        tempArr.forEach(element => {
                            let obj = {}
                            obj.text = element.supplierName
                            obj.value = element.supplierCode
                            _this.modalSkulist.push(obj)
                        })
                    }
                })
            }
        }   
    }
</script>
<style>
    .skuNameOrskuCode {
        padding-left: 34%;
        position: relative;
    }
    .skuNameOrskuCode>input {
        width: 100%;
        height: 36px;
        padding-left: 5px;
        border: 1px solid #c2cfd6;
        border-radius: 5px;
    }
    .skuNameOrskuCodeLabel {
        position: absolute;
        width: 34%;
        left: 0px;
        text-align: right;
        padding-right: 2%;
        height: 36px;
        line-height: 36px;
    }
    .skuNameOrskuCodeContainerAccount {
        position: absolute;
        top: 36px;
        width: 66%;
        box-sizing: border-box;
        border: 1px solid #c2cfd6;
        z-index: 9999;
        background-color: #fff;
        max-height: 300px;
    }
    .skuNameOrskuCodeContainerItem {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
    }
    .skuNameOrskuCodeContainerItem:hover {
        background-color: #ccc;
        cursor: pointer;
    }
</style>