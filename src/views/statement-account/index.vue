<template>
    <div @click="hideFrameAccount">
        <b-card header="查询">
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="出入库对账" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="tempInOutType" :options="inoutAccount"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账类型" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="tempReconciliationType" :disabled="isCanChoose" :options="accountTypes"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <div class="skuNameOrskuCode">
                        <div class="skuNameOrskuCodeLabel">{{ searchName }}</div>
                        <input type="text" v-model="searchValue" :disabled="!((tempReconciliationType === 0||tempReconciliationType)&&tempInOutType)" @click.stop="stopPop" @focus="showFrame"/>
                        <div v-if="isShowSearchQuery" class="skuNameOrskuCodeContainerAccount">
                            <div class="skuNameOrskuCodeContainerItem" v-for="(item, index) in skuOrSlilist" @click.stop="itemClick(item)">{{ item.text }}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="门店" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshopQuery" :storeAll="true" @select-change="selectedfunquery"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账时间" label-text-align="right" :label-cols="4">
                        <el-date-picker
                            v-model="accountTime"
                            type="daterange"
                            placeholder="选择日期范围">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账核销状态" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryParams.reconciliationStatus" :options="verificationlist"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="对账单号" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryParams.reconciliationOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="单据状态" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryParams.orderStatus" :options="orderStateList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="创建人" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryParams.createName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="创建时间" label-text-align="right" :label-cols="4">
                        <el-date-picker
                            v-model="createTime"
                            type="daterange"
                            placeholder="选择日期范围">
                        </el-date-picker>
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
                        <b-button size="sm" variant="success" v-if="addAccount" @click="showAccountModal">新增</b-button>  
                        <b-button size="sm" variant="primary" v-if="editAccount" @click="edit">编辑</b-button>            
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="accountlist" :fields="fields">
                    <template slot="index" slot-scope="data">
                        <div>
                            <input type="radio" :value="data.item" v-model="selectItem"/>
                        </div>
                        <!-- <input type="radio" name="selectItem" :value="data.item" v-model="selectItem"/> -->
                    </template>
                    <template slot="reconciliationOrderNo" slot-scope="data">
                        <a href="javascript:;" @click="showDetail(data.item)">{{ data.item.reconciliationOrderNo }}</a>
                    </template>
                    <template slot="reconciliationType" slot-scope="data">
                        {{ data.item.reconciliationType == 0 ? '采购对账' : '集团内部对账' }}
                    </template>
                    <template slot="orderStatus" slot-scope="data">
                        {{ data.item.orderStatus == 0 ? '未生效' : '' }}
                        {{ data.item.orderStatus == 1 ? '已生效' : '' }}
                        {{ data.item.orderStatus == -1 ? '已作废' : '' }}
                    </template>
                    <template slot="reconciliationStatus" slot-scope="data">
                        {{ data.item.reconciliationStatus == 0 ? '未对账' : '' }}  
                        {{ data.item.reconciliationStatus == 1 ? '已对账' : '' }}  
                        {{ data.item.reconciliationStatus == 10 ? '已核销' : '' }}  
                    </template>
                    <template slot="totalAmount" slot-scope="data">
                        {{ data.item.totalAmount ? (data.item.totalAmount - 0).toFixed(2) : data.item.totalAmount }}
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
        <b-modal id="modalPrevent"
                ref="modalAccount"
                size="lg"
                :hide-header="true"
                :hide-footer="true">
                <div class="pleaseChooseAccount">
                    请选择要操作的类型
                    <div class="closeButton" @click="hideAccountModal">×</div>
                </div>
                <div class="row" @click="hideFrameAccount">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="出入库对账" label-text-align="right" :label-cols="4">
                            <b-form-select v-model="inOutType" :state="nextState.inOutType" :options="inoutAccountModal"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="当前门店" label-text-align="right" :label-cols="4">
                            <areaqueryshop ref="areaqueryshopModal" :error="nextState.storeCode" @select-change="selectedfunModal"></areaqueryshop>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="当前操作人" label-text-align="right" :label-cols="4">
                            <b-form-input :value="currentMan" readonly/>
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row" v-if="inOutType === 1 ? true : false">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="" label-text-align="right" :label-cols="4">
                            <input type="radio" name="accountType" value="0" v-model="selectAccountType"/>采购入库对账
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="" label-text-align="right" :label-cols="4">
                            <input type="radio" name="accountType" value="1" v-model="selectAccountType"/>集团内部对账
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row" v-if="isShowModalSearch">
                    <div class="col-md-6 col-lg-6">
                        <div class="skuNameOrskuCode">
                            <div class="skuNameOrskuCodeLabel">{{ modalSearchName }}</div>
                            <input type="text" :class="{'canNotPass': nextState.chooseCode}" v-model="modalValue" @focus.stop="showFrameAccount" @click.stop="stopPop"/>
                            <div v-if="isShowSearchModal" class="skuNameOrskuCodeContainerAccount">
                                <div class="skuNameOrskuCodeContainerItem" v-for="(item, index) in modalSkulist" :key="index" @click.stop="itemClickModal(item)">{{ item.text }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="pull-right">
                            <b-button size="sm" variant="success" @click="nextstep">下一步</b-button>                     
                        </div>
                    </div>
                </div>
        </b-modal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import pagination from 'components/pagination/pagination.vue'
    import api from 'common/api'
    import config from 'common/config'
    import common from 'common/common'
    import collectionApi from 'common/api-collection.js'
    import {hasBtn} from 'common/api-common.js'
    import { MessageBox, Message, DatePicker } from 'element-ui'
    Vue.use(DatePicker)
    export default {
        components: {
            areaqueryshop,
            pagination
        },
        data() {
            return {
                nextState: {
                    inOutType: null,
                    storeCode: null,
                    chooseCode: false,
                },
                inoutAccountModal: [],
                selectItem: {},
                createMan: '',
                isShowModalSearch: false,
                modalSearchName: '',
                isShowSearch: false,
                isCanChoose: true,
                modalValue: '',
                searchName: '供应商',
                modalName: '供应商',
                chooseCode: '',
                chooseName: '',
                inOutType: '',
                modalStoreCode: '',
                modalStoreName: '',
                verificationlist: [],
                skuOrSlilist: [],
                modalSkulist: [],
                creatlist: [],
                searchValue: '',
                isShowSearchModal: false,
                isShowSearchQuery: false,
                accountTime: [],
                createTime: [],
                currentMan: '',
                tempReconciliationType: '',
                tempInOutType: '',
                page: {

                },
                queryParams: {
                    reconciliationOrderNo: '',
                    storeCode: '',
                    orderStatus: '',
                    invoiceStatus: '',
                    supplierCode: '',
                    storeCode: '',
                    reconciliationStatus: '',
                    reconciliationTime: '',
                    reconciliationType: '',
                    storeCodeList: [],
                    createName: '',
                    startReconciliationTime: '',
                    endReconciliationTime: '',
                    startCreateTime: '',
                    endCreateTime: ''
                },
                inoutAccount: [],
                accountTypes: [],
                orderStateList: [],
                selectAccountType: '',
                itemList: [],
                accountlist: [],
                fields: {
                    index: {
                        label: '选择'
                    },
                    reconciliationOrderNo: {
                        label: '对账单号'
                    },
                    supplierName: {
                        label: '供应商'
                    },
                    createName: {
                        label: '创建人'
                    },
                    createTimeStr: {
                        label: '创建时间'
                    },
                    reconciliationType: {
                        label: '对账类型'
                    },
                    orderStatus: {
                        label: '单据状态'
                    },
                    reconciliationStatus: {
                        label: '对账核销状态'
                    },
                    reconciliationEmpName: {
                        label: '提交人'
                    },
                    reconciliationTime: {
                        label: '对账确认时间'
                    },
                    totalAmount: {
                        label: '对账总金额'
                    },
                    totalSkuCount: {
                        label: '对账总数量'
                    },
                    totalBatchCount: {
                        label: '对账批次数'
                    }
                }
            }
        },
        computed: {
            addAccount(){
				return hasBtn(collectionApi.statementAccount.insertReconciliationOrderInfo);
			},
            editAccount(){
				return hasBtn(collectionApi.statementAccount.editReconciliationDetailInfo);
			}
        },
        methods: {
            itemClick(value) {
                const _this = this
                _this.queryParams.supplierCode = value.value
                _this.searchValue = value.text
                _this.isShowSearchQuery = false
            },
            showDetail(value) {
                const _this = this
                if(value.inOutType == 1) {
                    _this.$router.push({
                        path: 'showaccount',
                        query: {
                            storeCode: '',
                            storeName: '',
                            inOutType: '',
                            reconciliationType: '',
                            chooseCode: '',
                            chooseName: '',
                            reconciliationOrderNo: value.reconciliationOrderNo
                        }
                    })
                }else if(value.inOutType == -1) {
                    _this.$router.push({
                        path: 'showrefund',
                        query: {
                            storeCode: '',
                            storeName: '',
                            inOutType: '',
                            reconciliationType: '',
                            chooseCode: '',
                            chooseName: '',
                            reconciliationOrderNo: value.reconciliationOrderNo
                        }
                    })
                }
            },
            edit() {
                const _this = this
                if(!_this.selectItem.inOutType) {
                    Message({
                        type: 'warning',
                        message: '请选择编辑项'
                    })
                    return
                }
                if(_this.selectItem.inOutType == 1) {
                    _this.$router.push({
                        path: 'editaccount',
                        query: {
                            storeCode: '',
                            storeName: '',
                            inOutType: '',
                            reconciliationType: '',
                            chooseCode: '',
                            chooseName: '',
                            reconciliationOrderNo: _this.selectItem.reconciliationOrderNo
                        }
                    })
                }else if(_this.selectItem.inOutType == -1) {
                    _this.$router.push({
                        path: 'editrefund',
                        query: {
                            storeCode: '',
                            storeName: '',
                            inOutType: '',
                            reconciliationType: '',
                            chooseCode: '',
                            chooseName: '',
                            reconciliationOrderNo: _this.selectItem.reconciliationOrderNo
                        }
                    })
                }
            },
            reset() {
                const _this = this
                _this.accountTime = []
                _this.createTime = []
                _this.queryParams = {
                    reconciliationOrderNo: '',
                    storeCode: '',
                    orderStatus: '',
                    invoiceStatus: '',
                    supplierCode: '',
                    storeCode: '',
                    reconciliationStatus: '',
                    reconciliationTime: '',
                    reconciliationType: '',
                    storeCodeList: [],
                    createName: '',
                    startReconciliationTime: '',
                    endReconciliationTime: '',
                    startCreateTime: '',
                    endCreateTime: ''
                }
                _this.tempReconciliationType = ''
                _this.tempInOutType =  ''
                _this.$refs.areaqueryshopQuery.resetToStart()
                _this.queryParams.createName = _this.modalCreateBy = JSON.parse(common.getSession('userInfo')).empVo.empCnName
            },
            itemClickModal(value) {
                const _this = this
                _this.chooseCode = value.value
                _this.chooseName = value.text
                _this.modalValue = value.text
                _this.hideFrameAccount()
            },
            query(num) {
                const _this = this
                _this.selectItem = {}
                _this.queryParams.pageStart = num
                _this.queryParams.pageNums = config.pageNums
                _this.queryParams.reconciliationType = _this.tempReconciliationType
                _this.queryParams.inOutType = _this.tempInOutType
                let timeObjOne = _this.accountTime.length > 0 ? common.formattingTime(_this.accountTime) : {}
                _this.queryParams.startReconciliationTime = timeObjOne.startTime === '1970-01-01' ? '' : timeObjOne.startTime
                _this.queryParams.endReconciliationTime = timeObjOne.endTime === '1970-01-01' ? '' : timeObjOne.endTime
                let timeObjTwo = _this.createTime.length > 0 ? common.formattingTime(_this.createTime) : {}
                _this.queryParams.startCreateTime = timeObjTwo.startTime === '1970-01-01' ? '' : timeObjTwo.startTime
                _this.queryParams.endCreateTime = timeObjTwo.endTime === '1970-01-01' ? '' : timeObjTwo.endTime
                api.statementAccount.queryReconciliationVerifyOrderInfoExts(_this.queryParams, res => {
                    if(res.data.code === 'success') {
                        _this.accountlist = res.data.obj.list
                        let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        _this.page = tempPage
                    }
                })
            },
            selectedfunModal(arg1, arg2) {
                const _this = this
                if(Array.isArray(arg2)) {

                }else {
                    if(arg2) {
                        _this.modalStoreCode = arg2.value
                        _this.modalStoreName = arg2.text
                    }
                }
            },
            showFrame() {
                const _this = this
                _this.isShowSearchQuery = true
            },
            stopPop() {

            },
            selectedfunquery(arg1, arg2) {
                const _this = this
                if(Array.isArray(arg2)) {
                    _this.queryParams.storeCodeList = []
                    _this.queryParams.storeCode = ''
                    arg2.forEach(element => {
                        _this.queryParams.storeCodeList.push(element.value)
                    })
                }else {
                    if(arg2) {
                        _this.queryParams.storeCodeList = []
                        _this.queryParams.storeCode = arg2.value
                    }
                }
            },
            pageChange(num) {
                const _this = this
                _this.query(num)
            },
            showFrameAccount() {
                const _this = this
                _this.isShowSearchModal = true
            },
            resetModal() {
                const _this = this
                _this.modalStoreCode = ''
                _this.modalStoreName = ''
                _this.inOutType = ''
                _this.selectAccountType = ''
                _this.chooseCode = ''
                _this.chooseName = ''
                _this.$refs.areaqueryshopModal.resetToStart()
                _this.modalSearchName = ''
            },
            hideFrameAccount() {
                const _this = this
                _this.isShowSearchModal = false
                _this.isShowSearchQuery = false
            },
            nextstep() {
                const _this = this
                let judge = true
                if(_this.inOutType) {
                    _this.nextState.inOutType = null
                }else {
                    _this.nextState.inOutType = false
                    judge = false
                }
                if(_this.modalStoreCode) {
                    _this.nextState.storeCode = false
                }else {
                    _this.nextState.storeCode = true
                    judge = false
                }
                if(_this.chooseCode) {
                    _this.nextState.chooseCode = false
                }else {
                    _this.nextState.chooseCode = true
                    judge = false
                }
                if(_this.inOutType == 1) {
                    if(_this.selectAccountType) {

                    }else {
                        Message({
                            type: 'warning',
                            message: '请选择对账类型'
                        })
                        judge = false
                    }
                }
                if(!judge) {
                    return
                }
                if(_this.inOutType == 1) {
                    _this.$router.push({
                        path: 'addaccount',
                        query: {
                            storeCode: _this.modalStoreCode,
                            storeName: _this.modalStoreName,
                            inOutType: _this.inOutType,
                            reconciliationType: _this.selectAccountType,
                            chooseCode: _this.chooseCode,
                            chooseName: _this.chooseName,
                            reconciliationOrderNo: ''
                        }
                    })
                }else if(_this.inOutType == -1) {
                    _this.$router.push({
                        path: 'addrefund',
                        query: {
                            storeCode: _this.modalStoreCode,
                            storeName: _this.modalStoreName,
                            inOutType: _this.inOutType,
                            chooseCode: _this.chooseCode,
                            chooseName: _this.chooseName,
                            reconciliationType: 0,
                            reconciliationOrderNo: ''
                        }
                    })
                }
            },
            showAccountModal() {
                const _this = this
                _this.resetModal()
                _this.$refs.modalAccount.show()
            },
            hideAccountModal() {
                const _this = this
                _this.$refs.modalAccount.hide()
            }
        },
        created() {
            const _this = this
            _this.inoutAccount = config.statementAccount.inoutType
            _this.inoutAccountModal = config.statementAccount.inOutTypeSpecial
            _this.accountTypes = config.statementAccount.accountType
            _this.orderStateList = config.statementAccount.orderState
            _this.verificationlist = config.statementAccount.accountState
            _this.currentMan = _this.modalCreateBy = JSON.parse(common.getSession('userInfo')).empVo.empCnName
            _this.queryParams.createName = _this.modalCreateBy = JSON.parse(common.getSession('userInfo')).empVo.empCnName
        },
        watch: {
            searchValue: function(value) {
                const _this = this
                _this.skuOrSlilist = []
                if(!value) {
                    return
                }
                if(_this.searchName == '供应商') {
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
                                _this.skuOrSlilist.push(obj)
                            })
                        }
                    })
                }else if(_this.searchName == '门店') {
                    let option = {
                        pageNums: 5,
                        storeName: value
                    }
                    api.statementAccount.queryStoreInfo(option, res => {
                        if(res.data.code === 'success') {
                            let tempArr = res.data.obj.list
                            tempArr.forEach(element => {
                                let obj = {}
                                obj.text = element.storeName
                                obj.value = element.storeCode
                                _this.skuOrSlilist.push(obj)
                            })
                        }
                    })
                }
            },
            selectAccountType: function(value) {
                if(value == '1') {
                    this.modalSearchName = '门店'
                    this.modalValue = ''
                    this.chooseCode = ''
                    this.chooseName = ''
                    this.isShowModalSearch = true
                }else if(value == '0'){
                    this.modalSearchName = '供应商'
                    this.modalValue = ''
                    this.chooseCode = ''
                    this.chooseName = ''
                    this.isShowModalSearch = true
                }else {
                    // this.isShowModalSearch = false
                    this.chooseCode = ''
                    this.chooseName = ''
                }
            },
            inOutType: function(value) {
                if(value == -1) {
                    this.modalSearchName = '供应商'
                    this.isShowModalSearch = true
                    this.selectAccountType = ''
                }else if(value === 1) {
                    if(this.selectAccountType == '1') {
                        this.modalSearchName = '门店'
                        this.isShowModalSearch = true
                    }else if(this.selectAccountType == '0'){
                        this.modalSearchName = '供应商'
                        this.isShowModalSearch = true
                    }else {
                        this.isShowModalSearch = false
                    }
                }else {
                    this.isShowModalSearch = false
                }
            },
            modalValue: function(value) {
                const _this = this
                _this.modalSkulist = []
                if(!value) {
                    return
                }
                if(this.modalSearchName == '门店') {
                    let option = {
                        pageNums: 5,
                        storeName: value
                    }
                    api.statementAccount.queryStoreInfo(option, res => {
                        if(res.data.code === 'success') {
                            let tempArr = res.data.obj.list
                            tempArr.forEach(element => {
                                let obj = {}
                                obj.text = element.storeName
                                obj.value = element.storeCode
                                _this.modalSkulist.push(obj)
                            })
                        }
                    })
                }else if(this.modalSearchName = '供应商') {
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
            },
            tempInOutType: function(value) {
                this.searchValue = ''
                this.queryParams.supplierCode = ''
                this.tempReconciliationType = ''
                if(value) {
                    if(value === -1 ) {
                        this.isCanChoose = true
                        this.tempReconciliationType = 0
                    }else if(value === 1) {
                        this.isCanChoose = false
                    }
                }else {
                    this.isCanChoose = true
                    this.tempReconciliationType = ''
                }
            },
            tempReconciliationType: function(value) {
                this.searchValue = ''
                this.queryParams.supplierCode = ''
                if(value === 1) {
                    this.searchName = '门店'
                }else if(value === 0) {
                    this.searchName = '供应商'
                }
            },
            // queryParams: {
            //     handler: function(value) {
            //         if(!value.inOutType) {
            //             this.isShowSearch = false
            //             this.queryParams.reconciliationType = ''
            //             this.searchValue = ''
            //             this.queryParams.supplierCode = ''
            //             this.isCanChoose = true
            //         }else if(value.inOutType === -1) {
            //             this.isCanChoose = true
            //             this.queryParams.reconciliationType = 0
            //             this.queryParams.supplierCode = ''
            //             this.searchName = '供应商'
            //             this.isShowSearch = true
            //         }else if(value.inOutType === 1){
            //             this.isCanChoose = false
            //             this.queryParams.supplierCode = ''
            //             if(value.reconciliationType === 1) {
            //                 this.searchName = '门店'
            //                 this.isShowSearch = true
            //             }else if(value.reconciliationType === 0){
            //                 this.searchName = '供应商'
            //                 this.isShowSearch = true
            //             }else {
            //                 this.isShowSearch = false
            //             }
            //         }
            //     },
            //     deep: true
            // }
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
    .pleaseChooseAccount {
        position: relative;
        padding-top: 10px;
        padding-bottom: 10px;
        font-size: 20px;
        padding-left: 6%;
    }
    .pleaseChooseAccount>.closeButton {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        line-height: 20px;
        text-align: center;
        font-size: 20px;
        right: -17px;
        top: -20px;
        cursor: pointer;
    }
    .canNotPass {
        border: 1px solid #e43a5e !important;
    }
</style>


