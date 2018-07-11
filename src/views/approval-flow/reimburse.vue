<template>
    <div>
        <b-card>
            <div>
                申请单号: {{ this.$route.query.orderNo }}
            </div>
            <div class="table-scrollable mb-2">
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr class="">
                            <th class="">操作人</th>
                            <th class="">退款申请时间</th>
                            <th class="">退款确认时间</th>
                            <th class="">退款总金额</th>
                            <th class="">退款手续费</th>
                            <th class="">应退金额</th>
                        </tr>
                    </thead>
                    <tbody class="">
                        <tr class="">
                            <td class="">{{ operateMan }}</td>
                            <td class="">{{ submitApplicationTime }}</td>
                            <td class="">{{ approveFinishTime }}</td>
                            <td class="">
                                <b-form-input type="number" :state="mustState.refundTotalAmount" :readonly="isShowRepeal || isShowRefundDetail" v-model="addInfo.refundTotalAmount" :max="accountLimitTotal" min="0"/>
                            </td>
                            <td class="">
                                <b-form-input type="number" :state="mustState.refundFeeCount" :readonly="isShowRepeal || isShowRefundDetail" v-model="addInfo.refundFeeCount" :max="addInfo.refundTotalAmount" min="0"/>
                            </td>
                            <td class="">{{ addInfo.refundOriginalAmount }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </b-card>
        <b-card header="退款金额明细">
        	    <div class="row">
                            <div class="col-md-10 col-lg-10">
                                <div>
                                    卡号: {{ cardInfo.cardNo }}&nbsp;&nbsp;&nbsp;&nbsp;名称: 电子账户卡
                                </div>
                                <div class="lineOfCard"></div>
                            </div>
                        </div>
                        <div class="cardInfoLine"></div>
                        <div class="row">
                            <div class="col-md-4 col-lg-4">
                                <b-form-fieldset horizontal label="首次来源渠道" label-text-align="right" :label-cols="4">
                                    <areaqueryshop ref="areaqueryshop" :readonly="areaReadonly" @select-change="selectedfun"></areaqueryshop>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-4 col-lg-4">
                                <b-form-fieldset horizontal label="客户姓名" label-text-align="right" :label-cols="4">
                                    <b-form-input :value="cardInfo.customName" readonly/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-4 col-lg-4">
                                <b-form-fieldset horizontal label="实退人手机号*" label-text-align="right" :label-cols="4">
                                    <b-form-input v-model="addInfo.refundMobilePhone" :readonly="isShowRepeal || isShowRefundDetail" @blur.native="getCustomerInfo" :state="mustState.refundMobilePhone"/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-4 col-lg-4">
                                <b-form-fieldset horizontal label="卡内剩余金额" label-text-align="right" :label-cols="4">
                                    <b-form-input :value="cardInfo.cardAmout" readonly/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-4 col-lg-4">
                                <b-form-fieldset horizontal label="操作人" label-text-align="right" :label-cols="4">
                                    <b-form-input :value="operateMan" readonly/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-4 col-lg-4">
                                <b-form-fieldset horizontal label="实退人*" label-text-align="right" :label-cols="4">
                                    <b-form-input v-model="addInfo.refundCustomName" :readonly="customNameDisabled || isShowRepeal || isShowRefundDetail" :state="mustState.refundCustomName"/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-4 col-lg-4">
                                <b-form-fieldset horizontal label="操作方" label-text-align="right" :label-cols="4">
                                    <b-form-input :value="department" readonly/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-4 col-lg-4">
                                <b-form-fieldset horizontal label="联系方式" label-text-align="right" :label-cols="4">
                                    <b-form-input readonly/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-4 col-lg-4">
                                <b-form-fieldset horizontal label="固话号" label-text-align="right" :label-cols="4">
                                    <b-form-input v-model="addInfo.refundCustomPhone" :readonly="isShowRepeal || isShowRefundDetail"/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-4 col-lg-4">
                                <b-form-fieldset horizontal label="本次退款金额" label-text-align="right" :label-cols="4">
                                    <b-form-input :value="addInfo.refundTotalAmount" readonly/>
                                </b-form-fieldset>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-8 col-lg-8">
                                <b-form-fieldset horizontal label="退款说明*" label-text-align="right" :label-cols="2">
                                    <b-form-textarea id="textarea1"
                                        v-model="addInfo.refundReason"
                                        placeholder="必填"
                                        :readonly="isShowRepeal || isShowRefundDetail"
                                        :state="mustState.refundReason"
                                        :rows="3"
                                        :max-rows="6">
                                    </b-form-textarea>
                                </b-form-fieldset>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-8 col-lg-8">
                                <b-form-fieldset horizontal label="备注" label-text-align="right" :label-cols="2">
                                    <b-form-textarea id="textarea2"
                                        v-model="addInfo.remark"
                                        placeholder="非必填"
                                        :readonly="isShowRepeal || isShowRefundDetail"
                                        :rows="3"
                                        :max-rows="6">
                                    </b-form-textarea>
                                </b-form-fieldset>
                            </div>
                        </div>
        </b-card>
        <b-card header="退款明细">
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        应退金额: {{ addInfo.refundOriginalAmount }} &nbsp;&nbsp;&nbsp;&nbsp;实退金额合计: {{ myTotalRefund }}
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="tablelist" :fields="fields">
                    <template slot="choise" slot-scope="data">
                        <input type="radio" name="payStyle" @click="setIndex(data.index)">
                    </template>
                    <template slot="index" slot-scope="data">
                        {{ data.index + 1 }}
                    </template>
                    <template slot="operateMan" slot-scope="data">
                        {{ operateMan }}
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
    // import pagination from 'components/pagination/pagination.vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import approve from 'components/approval-record/approval-record.vue'
    import api from 'common/api.js'
    import common from 'common/common.js'
    import config from 'common/config.js'
    import { MessageBox, Message, DatePicker, Dialog } from 'element-ui'
    Vue.use(DatePicker)
    Vue.use(Dialog)
    export default {
        components: {
            areaqueryshop,
            approve
        },
        data() {
            return {
                accountLimitTotal: '',
                // accountLimitFee: '',
                dialogInvoive: false,
                operateTime: '',
                approveList: [],
                fieldsApprove: {
                    createTimeStr: {
                        label: '审批时间'
                    },
                    operatorName: {
                        label: '审批人'
                    },
                    nodeStatus: {
                        label: '审批结果'
                    },
                    remark: {
                        label: '反馈意见'
                    }
                },
                orderHasfinished: false,
                hasShowfinished: false,
                isShowSave: true,
                isShowRepeal: false,
                isShowSubmit: false,
                isShowDelete: false,
                isShowfinished: false,
                isShowRefundDetail: false,
                customNameDisabled: false,
                // hasApproved: false,
                selectDetail: '',
                paymentStyleList: [],
                myTotalRefund: 0,
                addDetail: {
                    paymentAmount: '',
                    paymentCode: '',
                    paymentTypeCode: '',
                    // paymentTypeName: '',
                },
                addDetailState: {
                    paymentAmount: null,
                    paymentCode: null,
                    paymentTypeCode: null,
                    paymentTime: false
                },
                submitApplicationTime: '',
                approveFinishTime: '',
                cardRefundOrderNo: '',
                areaReadonly: false,
                operateMan: '',
                department: '',
                cardInfo: {},
                tablelist: [],
                fields: {
                    choise: {
                        label: '选择'
                    },
                    index: {
                        label: '序号'
                    },
                    paymentTypeName: {
                        label: '支付方式'
                    },
                    paymentAmount: {
                        label: '金额'
                    },
                    paymentCode: {
                        label: '交易流水号'
                    },
                    operateMan: {
                        label: '操作人'
                    }
                },
                addInfo: {
                    refundReason: '',
                    remark: '',
                    refundMobilePhone: '',
                    refundCustomPhone: '',
                    refundCustomName: '',
                    refundActualAmount: '',
                    refundOriginalAmount: '',
                    refundFeeCount: 0,
                    refundTotalAmount: '',
                    cardRefundOrderNo: '',
                    id: '',
                    cardNo: ''
                },
                mustState: {
                    refundCustomName: null,
                    refundMobilePhone: null,
                    refundReason: null,
                    refundTotalAmount: null,
                    refundFeeCount: null
                }
            }
        },
        methods: {
            // 设置表示
            setIndex(arg) {
                const _this = this
                _this.selectDetail = arg
            },
            // 支付明细删除
        /*    deleteItem() {
                const _this = this
                let tempArr = _this.tablelist
                _this.tablelist = []
                // tempArr.forEach(element => {
                //     if(element.)
                // })
                for(let i = 0; i< tempArr.length; i++) {
                    if(i === _this.selectDetail) {

                    }else {
                        _this.tablelist.push(tempArr[i])
                    }
                }
            },*/
            // 模态框取消
           /* cancelModal() {
                const _this = this
                _this.dialogInvoive = false
            },*/
            // 打开模态框
           /* showAddModal() {
                const _this = this
                console.log(_this.paymentStyleList)
                _this.dialogInvoive = true
            },*/
            // 打开模态框重置 
           /* reset() {
                const _this = this
                _this.addDetail = {}
                _this.operateTime = ''
            },*/
            // 查询审批履历的接口
    /*        getOprInfo(val) {
                let param = {
                    orderNo: val
                }
                return new Promise((reslove,reject) => {
                    api.approval.WfDetailInfo(param,res => {
                        if(res.data.code === 'success') {  
                            let obj = res.data.obj;        
                            reslove(res.data.obj);
                        };
                    })
                })              
            },*/
      /*      // 查询审批履历接口方法
            getApproveList() {
                const _this = this
                _this.getOprInfo(_this.addInfo.cardRefundOrderNo).then(res => {
                    _this.approveList = res
                })
            },*/
            // 完结
            finished() {
                const _this = this
                _this.tablelist.forEach(element => {
                    element.cardRefundOrderNo = _this.addInfo.cardRefundOrderNo
                })
                api.returnCard.editCardRefundPaymentInfo(_this.tablelist, res => {
                    if(res.data.code === 'success') {
                        _this.orderHasfinished = true
                        _this.tablelist = res.data.obj
                        _this.fields = {
                            index: {
                                label: '序号'
                            },
                            paymentTypeName: {
                                label: '支付方式'
                            },
                            paymentAmount: {
                                label: '金额'
                            },
                            paymentCode: {
                                label: '交易流水号'
                            },
                            operateMan: {
                                label: '操作人'
                            }
                        }
                    }
                })
            },
            // 取消
          /*  cancelEvent() {
                const _this = this
                _this.$router.push({
                    path: `/back-card/back-card-query`
                })
            },*/
            // 提交审批
          /*  submitApprove() {
                const _this = this
                let option = {
                    cardRefundOrderNo: _this.addInfo.cardRefundOrderNo
                }
                api.returnCard.submitRefundOrderInfo(option, res => {
                    if(res.data.code === 'success') {
                        _this.isShowSave = false
                        _this.isShowRepeal = true
                        _this.isShowSubmit = false
                        _this.isShowDelete = false
                        _this.submitApplicationTime = res.data.obj.refundTimeStr
                    }
                })
            },*/
            // 撤销审批
          /*  cancelSubmit() {
                const _this = this
                let option = {
                    cardRefundOrderNo: _this.addInfo.cardRefundOrderNo
                }
                api.returnCard.withDrawCardRefundOrderInfo(option, res => {
                    if(res.data.code === 'success') {
                        _this.isShowSave = true
                        _this.isShowRepeal = false
                        _this.isShowSubmit = true
                        _this.isShowDelete = true
                    }
                })
            },*/
            // 作废
          /*  deleteSubmit() {
                const _this = this
                let option = {
                    cardRefundOrderNo: _this.addInfo.cardRefundOrderNo
                }
                api.returnCard.cancelCardRefundOrderInfo(option, res => {
                    if(res.data.code === 'success') {
                        _this.isShowSave = false
                        _this.isShowRepeal = false
                        _this.isShowSubmit = false
                        _this.isShowDelete = false
                        // _this.isShowfinished = false
                    }
                })
            },*/
        /*    handleOk() {
                const _this = this
                let judge = false
                if(!_this.addDetail.paymentAmount) {
                    _this.addDetailState.paymentAmount = false
                    judge = true
                }else {
                    _this.addDetailState.paymentAmount = null
                }
                if(!_this.addDetail.paymentCode) {
                    _this.addDetailState.paymentCode = false
                    judge = true
                }else {
                    _this.addDetailState.paymentCode = null
                }
                if(!_this.addDetail.paymentTypeCode) {
                    _this.addDetailState.paymentTypeCode = false
                    judge = true
                }else {
                    _this.addDetailState.paymentTypeCode = null
                }
                if(!_this.operateTime) {
                    _this.addDetailState.paymentTime = true
                    judge = true
                }else {
                    _this.addDetailState.paymentTime = false
                }
                if(judge) {
                    return
                }
                if(_this.addInfo.refundOriginalAmount - 0 > 0) {
                    if(_this.addDetail.paymentAmount - 0 > 0) {
                        let obj = {
                            paymentAmount: _this.addDetail.paymentAmount,
                            paymentCode: _this.addDetail.paymentCode,
                            paymentTypeCode: _this.addDetail.paymentTypeCode,
                            paymentTime: _this.operateTime ? common.eleTimeFormatim2(_this.operateTime) : ''
                        }
                        _this.paymentStyleList.forEach(element => {
                            if(obj.paymentTypeCode === element.value) {
                                obj.paymentTypeName = element.text
                            }
                        })
                        _this.tablelist.push(obj)
                        _this.cancelModal()
                    }else {
                        Message({
                            type: 'warning',
                            message: '明细金额应大于零'
                        })
                    }
                }
                if(_this.addInfo.refundOriginalAmount - 0 === 0) {
                    if(_this.addDetail.paymentAmount - 0 > 0) {
                        Message({
                            type: 'warning',
                            message: '明细金额应等于零'
                        })
                    }else if(_this.addDetail.paymentAmount - 0 < 0){
                        Message({
                            type: 'warning',
                            message: '明细金额应等于零'
                        })
                    }else {
                        if(_this.tablelist.length === 1) {
                            Message({
                                type: 'warning',
                                message: '明细已存在，不可新增'
                            })
                        }else {
                            let obj = {
                                paymentAmount: _this.addDetail.paymentAmount,
                                paymentCode: _this.addDetail.paymentCode,
                                paymentTypeCode: _this.addDetail.paymentTypeCode,
                                paymentTime: _this.operateTime ? common.eleTimeFormatim2(_this.operateTime) : ''
                            }
                            _this.paymentStyleList.forEach(element => {
                                if(obj.paymentTypeCode === element.value) {
                                    obj.paymentTypeName = element.text
                                }
                            }) 
                            _this.tablelist.push(obj)
                            _this.cancelModal()
                        }
                    }
                }  
            },*/
            clearName() {

            },
            // 保存卡信息相关
/*            saveCardInfo() {
                const _this = this
                if(!_this.addInfo.refundReason) {
                    _this.mustState.refundReason = false
                }else {
                    _this.mustState.refundReason = null
                }
                if(!_this.addInfo.refundMobilePhone) {
                    _this.mustState.refundMobilePhone = false
                }else {
                    _this.mustState.refundMobilePhone = null
                }
                if(!_this.addInfo.refundCustomName) {
                    _this.mustState.refundCustomName = false
                }else {
                    _this.mustState.refundCustomName = null
                }
                let judge = false
                if(_this.addInfo.refundFeeCount > _this.addInfo.refundTotalAmount ) {
                    _this.mustState.refundFeeCount = false
                    judge = true
                }else {
                    _this.mustState.refundFeeCount = null
                }

                if(_this.addInfo.refundTotalAmount > _this.accountLimitTotal ) {
                    _this.mustState.refundTotalAmount = false
                    judge = true
                }else {
                    _this.mustState.refundTotalAmount = null
                }
                if(judge) {
                    return
                }
                if(_this.addInfo.refundReason && _this.addInfo.refundMobilePhone && _this.addInfo.refundCustomName) {
                    if(!_this.addInfo.id) {
                        api.returnCard.insertCardRefundOrderInfo(_this.addInfo, res => {
                            if(res.data.code === 'success') {
                                _this.addInfo.id = res.data.obj.id
                                _this.submitApplicationTime = res.data.obj.refundTimeStr
                                _this.isShowSubmit = true
                                Message({
                                    type: 'success',
                                    message: '保存成功'
                                })
                            }
                        })
                    }else {
                        api.returnCard.updateCardRefundOrderInfo(_this.addInfo, res => {
                            if(res.data.code === 'success') {
                                _this.addInfo.id = res.data.obj.id
                                _this.submitApplicationTime = res.data.obj.refundTimeStr                            
                                _this.isShowSubmit = true
                                Message({
                                    type: 'success',
                                    message: '保存成功'
                                })
                            }
                        })
                    }
                }
            },*/
            selectedfun() {

            },
            // 获取sequence
          /*  getSequence() {
                const _this = this
                let option = {
                    serviceCode: config.cardRefund.cardRefundseq
                }
                api.ordinalInfo.getSequence(option, res => {
                    if(res.data.code === 'success') {
                        _this.addInfo.cardRefundOrderNo = res.data.obj
                    }
                })
            },*/
            getUrlCode() {
               /* const _this = this
                let tempCode = _this.$route.params.code
                let judgeStr = tempCode.substring(tempCode.length - 4, tempCode.length)
                if(judgeStr === 'nadd') {
                    _this.getSequence()
                    _this.addInfo.cardNo = tempCode.substring(0, tempCode.length -4)
                    _this.getValueCardInfo(1)
                }else {
                    _this.addInfo.id = tempCode.substring(0, tempCode.length -4)
                    _this.getValueCardInfo()
                }*/
            },
            // 查询储值卡信息
            getValueCardInfo(arg) {
                const _this = this
              /*  let option = {}
                if(arg === 1) {
                    option.cardNo = _this.addInfo.cardNo
                    option.isElectronicAccount = 1 
                }else {
                    option.id = _this.addInfo.id
                }*/
                api.returnCard.getCardRefundOrderInfoByCardCode({cardRefundOrderNo:this.$route.query.orderNo}, res => {
                    if(res.data.code === 'success') {
                        _this.cardInfo = res.data.obj
                        // console.log(_this.cardInfo)
                        // debugger;
                        if(_this.cardInfo.orderStatus === 3 || _this.cardInfo.orderStatus === -1 || _this.cardInfo.orderStatus === 1 || _this.cardInfo.orderStatus === 0 || _this.cardInfo.orderStatus === 2) {
                            _this.addInfo.refundTotalAmount = _this.cardInfo.refundTotalAmount
                        }else {
                            _this.addInfo.refundTotalAmount = _this.cardInfo.cardAmout
                        }
                        _this.accountLimitTotal = _this.cardInfo.cardAmout
                        _this.addInfo.refundOriginalAmount = _this.cardInfo.refundOriginalAmount
                        _this.addInfo.refundFeeCount = _this.cardInfo.refundFeeCount
                        _this.addInfo.refundMobilePhone = _this.cardInfo.refundMobilePhone
                        _this.addInfo.refundReason = _this.cardInfo.refundReason
                        _this.addInfo.remark = _this.cardInfo.remark
                        _this.addInfo.id = res.data.obj.id
                        /*修改操作人*/
                        this.operateMan = res.data.obj.refundEmpName
                        /*修改操作方*/
                        this.department = res.data.obj.refundOrgName
                        /*修改备注*/
                       if(res.data.obj.remark == null){
	                       	this.addInfo.remark = '  '
	                     }
                        if(!arg) {
                            _this.addInfo.cardRefundOrderNo = _this.cardInfo.cardRefundOrderNo
                        }
                        _this.addInfo.refundCustomName = _this.cardInfo.refundCustomName
                        _this.addInfo.refundCustomPhone = _this.cardInfo.refundCustomPhone
                        _this.submitApplicationTime = _this.cardInfo.refundTimeStr
                        _this.approveFinishTime = _this.cardInfo.auditPassTimeStr
                        if(_this.cardInfo.orderStatus === 2) {
                            _this.isShowSave = false
                            _this.isShowRepeal = false
                            _this.isShowSubmit = false
                            _this.isShowDelete = false
                            // _this.isShowfinished = false
                        }
                        if(_this.cardInfo.orderStatus === 1) {
                            _this.isShowSave = false
                            _this.isShowRepeal = true
                            _this.isShowSubmit = false
                            _this.isShowDelete = false
                            // _this.isShowfinished = false
                        }
                        if(_this.cardInfo.orderStatus === 0) {
                            _this.isShowSave = true
                            _this.isShowRepeal = false
                            _this.isShowSubmit = true
                            _this.isShowDelete = true
                            _this.customNameDisabled = true
                            // _this.isShowfinished = false
                        }
                        if(_this.cardInfo.orderStatus === 2) {
                            if(_this.cardInfo.wfStatus === 1) {
                                _this.isShowRefundDetail = true
                                // _this.isShowfinished = true
                                _this.isShowSave = false
                            }
                        }
                        if(_this.cardInfo.orderStatus === 3){
                            _this.isShowSave = false
                            _this.isShowRepeal = false
                            _this.isShowSubmit = false
                            _this.isShowDelete = false
                            _this.isShowRefundDetail = true
                            _this.orderHasfinished = true
                            api.returnCard.queryCardRefundPaymentInfoNoPage({cardRefundOrderNo: _this.cardInfo.cardRefundOrderNo}, res => {
                                if(res.data.code === 'success') {
                                    _this.tablelist = res.data.obj
                                    _this.fields = {
                                        index: {
                                            label: '序号'
                                        },
                                        paymentTypeName: {
                                            label: '支付方式'
                                        },
                                        paymentAmount: {
                                            label: '金额'
                                        },
                                        paymentCode: {
                                            label: '交易流水号'
                                        },
                                        operateMan: {
                                            label: '操作人'
                                        }
                                    }
                                }
                            })
                        }
                        if(_this.cardInfo.orderStatus === -1) {
                            _this.isShowSave = false
                            _this.isShowRepeal = false
                            _this.isShowSubmit = false
                            _this.isShowDelete = false
                            _this.isShowRefundDetail = true
                            _this.orderHasfinished = true
                        }
                        let option = {
                            text: _this.cardInfo.storeName,
                            value: _this.cardInfo.storeCode
                        }
                        if(!option.value) {
                            _this.areaReadonly = true
                        }else {
                            _this.$refs.areaqueryshop.setselect(option)
                            _this.areaReadonly = true
                        }
                        /*_this.getApproveList()*/
                    }
                })
            },
            // 获取当前登陆人信息
            getUserAvalibleInfo() {
                const _this = this
                let currentAccount = JSON.parse(common.getSession('userInfo'))
                _this.operateMan = currentAccount.empVo.empCnName
                _this.department = currentAccount.empVo.orgName
            },
          /*  // 获取支付方式数据字典项
            getPaymentStyle() {
                const _this = this
                let option = {
                    refCode: config.cardRefund.paymentRefCode
                }
                api.ref.getDataDictionarys(option, res => {
                    if(res.data.code === 'success') {
                        res.data.obj.referenceDetailInfos.forEach(element => {
                            let obj = {
                                text: element.refDetailName,
                                value: element.refDetailCode
                            }
                            _this.paymentStyleList.push(obj)
                        })
                    }
                })
            },*/
            // 根据手机号查询客户信息
            getCustomerInfo() {
                
                const _this = this
                let option = {
                    mobilePhone: _this.addInfo.refundMobilePhone
                }
                let judge = common.isMobile(_this.addInfo.refundMobilePhone)
                if(!judge) {
                    _this.mustState.refundMobilePhone = false
                    return
                }else {
                    _this.mustState.refundMobilePhone = null
                    api.returnCard.queryCustomInfoByMobilePhone(option, res => {
                        if(res.data.code === 'success') {
                            _this.addInfo.refundCustomName = res.data.obj.customName
                            if(_this.addInfo.refundCustomName) {
                                _this.customNameDisabled = true
                            }else {
                                _this.customNameDisabled = false
                            }
                        }
                    })
                }
            },
            setValue(obj){
            	      _this.cardInfo = obj
                        // console.log(_this.cardInfo)
                        // debugger;
                        if(_this.cardInfo.orderStatus === 3 || _this.cardInfo.orderStatus === -1 || _this.cardInfo.orderStatus === 1 || _this.cardInfo.orderStatus === 0 || _this.cardInfo.orderStatus === 2) {
                            _this.addInfo.refundTotalAmount = _this.cardInfo.refundTotalAmount
                        }else {
                            _this.addInfo.refundTotalAmount = _this.cardInfo.cardAmout
                        }
                        _this.accountLimitTotal = _this.cardInfo.cardAmout
                        _this.addInfo.refundOriginalAmount = _this.cardInfo.refundOriginalAmount
                        _this.addInfo.refundFeeCount = _this.cardInfo.refundFeeCount
                        _this.addInfo.refundMobilePhone = _this.cardInfo.refundMobilePhone
                        _this.addInfo.refundReason = _this.cardInfo.refundReason
                        _this.addInfo.remark = _this.cardInfo.remark
                        _this.addInfo.id = res.data.obj.id
                        if(!arg) {
                            _this.addInfo.cardRefundOrderNo = _this.cardInfo.cardRefundOrderNo
                        }
                        _this.addInfo.refundCustomName = _this.cardInfo.refundCustomName
                        _this.addInfo.refundCustomPhone = _this.cardInfo.refundCustomPhone
                        _this.submitApplicationTime = _this.cardInfo.refundTimeStr
                        _this.approveFinishTime = _this.cardInfo.auditPassTimeStr
                        if(_this.cardInfo.orderStatus === 2) {
                            _this.isShowSave = false
                            _this.isShowRepeal = false
                            _this.isShowSubmit = false
                            _this.isShowDelete = false
                            // _this.isShowfinished = false
                        }
                        if(_this.cardInfo.orderStatus === 1) {
                            _this.isShowSave = false
                            _this.isShowRepeal = true
                            _this.isShowSubmit = false
                            _this.isShowDelete = false
                            // _this.isShowfinished = false
                        }
                        if(_this.cardInfo.orderStatus === 0) {
                            _this.isShowSave = true
                            _this.isShowRepeal = false
                            _this.isShowSubmit = true
                            _this.isShowDelete = true
                            _this.customNameDisabled = true
                            // _this.isShowfinished = false
                        }
                        if(_this.cardInfo.orderStatus === 2) {
                            if(_this.cardInfo.wfStatus === 1) {
                                _this.isShowRefundDetail = true
                                // _this.isShowfinished = true
                                _this.isShowSave = false
                            }
                        }
                        if(_this.cardInfo.orderStatus === 3){
                            _this.isShowSave = false
                            _this.isShowRepeal = false
                            _this.isShowSubmit = false
                            _this.isShowDelete = false
                            _this.isShowRefundDetail = true
                            _this.orderHasfinished = true
                            api.returnCard.queryCardRefundPaymentInfoNoPage({cardRefundOrderNo: _this.cardInfo.cardRefundOrderNo}, res => {
                                if(res.data.code === 'success') {
                                    _this.tablelist = res.data.obj
                                    _this.fields = {
                                        index: {
                                            label: '序号'
                                        },
                                        paymentTypeName: {
                                            label: '支付方式'
                                        },
                                        paymentAmount: {
                                            label: '金额'
                                        },
                                        paymentCode: {
                                            label: '交易流水号'
                                        },
                                        operateMan: {
                                            label: '操作人'
                                        }
                                    }
                                }
                            })
                        }
                        if(_this.cardInfo.orderStatus === -1) {
                            _this.isShowSave = false
                            _this.isShowRepeal = false
                            _this.isShowSubmit = false
                            _this.isShowDelete = false
                            _this.isShowRefundDetail = true
                            _this.orderHasfinished = true
                        }
                        let option = {
                            text: _this.cardInfo.storeName,
                            value: _this.cardInfo.storeCode
                        }
                        if(!option.value) {
                            _this.areaReadonly = true
                        }else {
                            _this.$refs.areaqueryshop.setselect(option)
                            _this.areaReadonly = true
                        }
                        _this.getApproveList()
            },
        },
        created() {
            const _this = this
            // _this.getSequence()
       /*     _this.getValueCardInfo()*/
            _this.getUrlCode()
            _this.getUserAvalibleInfo()
          /*  _this.getPaymentStyle()*/
        },
        watch: {
        	/*'$route':'getValueCardInfo',*/
           /* addInfo: {
                handler: function(value) {
                    this.addInfo.refundOriginalAmount = this.addInfo.refundTotalAmount - this.addInfo.refundFeeCount
                },
                deep: true
            },
            tablelist: {
                handler: function(value) {
                    this.myTotalRefund = 0
                    this.tablelist.forEach(element => {
                        this.myTotalRefund += (element.paymentAmount - 0)
                    })
                },
                deep: true
            },
            myTotalRefund: function(value) {
                if(this.myTotalRefund === this.addInfo.refundOriginalAmount) {
                    this.isShowfinished = true
                }else {
                    this.isShowfinished = false
                }
            }*/
        },
        filters: {
            payStylemy: function (value) {
                console.log(this)
                if(value === 'paymentModeTypeUnionPay') {
                    return '银联'
                }else if(value === 'paymentModeTypeWeChat') {
                    return '微信'
                }else if(value === 'paymentModeTypeAlipay') {
                    return '支付宝'
                }else if(value === 'paymentModeTypeCash') {
                    return '现金'
                }else if(value === 'paymentModeTypeCheck') {
                    return '支票'
                }else if(value === 'PaymentModeTypeBill') {
                    return '挂账'
                }
            },
            oprResultFilter(val) {
                if(val == '0') {
                    return '驳回';
                }else if(val == '1') {
                    return '通过';
                }else if(val == '-1') {
                    return '待审批';
                }
            }
        }   
    }
</script>
<style>
    .cardInfoLine {
        /* width: 100%; */
        margin: 10px auto;
        border-bottom: 1px solid #ccc;
    }
</style>

