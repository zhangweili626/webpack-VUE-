<template>
<div class="animated fadeIn">
    <div class="row">
        <div class="col-md-12">
            <!-- 券信息 -->
            <b-card header="券信息">
                <div class="row">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="销售单号" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.couponSalesOrderNo" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="销售区域" :label-cols="4" class="text-right">
                            <b-form-input v-model="salesName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="门店" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.storeName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="操作人" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.createName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="销售人" :label-cols="4" class="text-right">
                            <b-form-select v-model="cardInfo.salesEmpCode" :options="saleEmpList" :disabled="isWatch || cardInfo.orderStatus != 0">
                            </b-form-select>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="销售单状态" :label-cols="4" class="text-right">
                            <b-form-select v-model="cardInfo.orderStatus" :options="orderStatus" disabled>
                            </b-form-select>
                        </b-form-fieldset>
                    </div>
                    
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="销售时间" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.salesTime" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="销售单创建时间" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.createTimeStr"  readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="张数" :label-cols="4" class="text-right">
                            <b-form-input v-model="selCouponList.length"  readonly/>
                            <!-- cardInfo.couponCount -->
                        </b-form-fieldset>
                    </div>
                
                    <div class="col-md-4" v-show="cardInfo.couponUseTypeCode == 'CarOwnerVoucher' || cardInfo.couponUseTypeCode == 'VehicleVoucher'">
                        <b-form-fieldset horizontal label="客户手机号" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.mobilePhone" @click.native="showEmpCarModal" placeholder="请点击查询客户" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4" v-show="cardInfo.couponUseTypeCode == 'CarOwnerVoucher' || cardInfo.couponUseTypeCode == 'VehicleVoucher'">
                        <b-form-fieldset horizontal label="客户姓名" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.customName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4" v-show="cardInfo.cardUseTypeCode == 'VehicleVoucher'">
                        <b-form-fieldset horizontal label="车牌号码" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.plateNumber" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4" v-show="cardInfo.cardUseTypeCode == 'VehicleVoucher'" >
                        <b-form-fieldset horizontal label="VIN码" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.vinCode"  readonly/>
                        </b-form-fieldset>
                    </div>
                </div>

                <car-info
                    v-if="cardInfo.cardUseTypeCode == 'VehicleVoucher'" 
                    @callBack="getCarInfo" 
                    ref="car" 
                    :isDisabled="true">
                </car-info>

                <div class="row">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="应收金额" :label-cols="4" class="text-right">
                            <b-form-input type="number" min="0" v-model="cardInfo.salesOriginalAmount" :readonly="isWatch || cardInfo.orderStatus != 0"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="实收金额" :label-cols="4" class="text-right">
                            <b-form-input :value="cardInfo.salesActualAmount | toFixed" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="已开票金额" :label-cols="4" class="text-right">
                            <b-form-input :value="cardInfo.salesInvoiceAmount | toFixed" readonly/>
                        </b-form-fieldset>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-md-8"></div>
                    <div class="col-md-4 text-right">
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl"
                            :disabled="isWatch || cardInfo.orderStatus == 0 || cardInfo.orderStatus == -1"
                            :data = 'addParams'
                            :on-success='uploadSuccess'
                            :on-error='uploadError'
                            :on-remove="uploadRemove"
                            :file-list="fileList"
                            :on-preview='preview'
                            multiple
                            :limit="100">
                            <a href="javascript:;" v-show="cardInfo.orderStatus != 0 && (isUpdate || isInsert)">上传归档</a>                            
                            <b-button size="sm" variant="success" v-show="cardInfo.orderStatus != 0 && (isUpdate || isInsert)">上传</b-button>
                        </el-upload>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 text-right">
                        <b-button size="sm" variant="danger" @click="toVoid" 
                            :disabled="isWatch || cardInfo.orderStatus == -1" 
                            v-if="cardInfo.id && cardInfo.orderStatus == 0" >作废</b-button>
                        <b-button size="sm" variant="default" @click="cancel">取消</b-button>
                        <b-button size="sm" variant="primary" @click="temporarySave" 
                            :disabled="cardInfo.orderStatus === 1 || cardInfo.orderStatus == -1"
                            v-show="isInsert || isUpdate && cardInfo.orderStatus == 0">去支付</b-button>                      
                    </div>
                </div>
            </b-card>
            <!-- 券明细 -->
            <div class="row">
                <div class="col-md-12">
                    <b-card header="券明细">
                        <div class="row">
                            <div class="col-md-6">
                                <b-button size="sm" variant="danger" @click="removeCoupon" v-show="cardInfo.orderStatus == 0">删除</b-button>                                             
                                <b-button size="sm" variant="success" @click="showCouponsModal" v-show="cardInfo.orderStatus == 0">新增</b-button>
                            </div>
                            <div class="col-md-6 text-right">     
                                <h4> 已选中券的销售金额合计： {{totalCouponsAmount}}元</h4>                                              
                            </div>
                        </div>
                        <div class="table-scrollable mb-2">
                            <b-table striped hover bordered show-empty :items="selCouponList" :fields="couponFields">
                                <template slot="radio" slot-scope="data" >
                                    <input type="radio" name="radio" :value="data.index" v-model="couponSelectIndex" v-show="cardInfo.orderStatus == 0"/>
                                </template>
                                <template slot="startDate" slot-scope="data">
                                    {{ startDateFilter(data.item) }}
                                </template>
                                <template slot="endDate" slot-scope="data">
                                    {{ endDateFilter(data.item) }}
                                </template>
                                <template slot="couponPrice" slot-scope="data">
                                    {{ data.value | toFixed }}
                                </template>
                                <template slot="empty" >暂无数据</template>
                            </b-table>
                        </div>
                    </b-card>
                </div>
            </div>
            <!-- 收款明细 -->
            <div class="row">
                <div class="col-md-12">
                    <b-card header="收款明细">
                        <b-button size="sm" variant="success" class="header-btn-r" v-show="cardInfo.orderStatus == 0 && selCouponList.length" @click="confirmPay">结算</b-button>   
                        <div class="row">              
                            <div class="col-md-6">              
                                <b-button size="sm" variant="danger" @click="removePay" v-show="cardInfo.orderStatus == 0 && selCouponList.length">删除</b-button>                                             
                                <b-button size="sm" variant="success" @click="addPay" v-show="cardInfo.orderStatus == 0 && selCouponList.length">添加</b-button>                                             
                            </div>
                            <div class="col-md-6 text-right">     
                                <h4> 支付金额合计： {{totalPaymentAmount}}元</h4>                                              
                            </div>
                        </div>
                        <div class="table-scrollable mb-2">
                            <b-table striped hover bordered show-empty :items="cardInfo.couponSalesPaymentInfos" :fields="payFields">
                                <template slot="radio" slot-scope="data" >
                                    <input type="radio" name="radio" :value="data.index" v-model="paySelectIndex" v-show="cardInfo.orderStatus == 0"/>
                                </template>
                                <template slot="empty" >暂无数据</template>
                            </b-table>
                        </div>
                    </b-card>
                </div>
            </div>
            <!-- 收款 - Modal  -->
            <add-pay-detail 
                ref="payModal" 
                :userInfo="userInfo" 
                :refCode="couponPaySeq"
                @surePay="sureAdd">
            </add-pay-detail>

            <!-- 开票明细 -->
            <div class="row">
                <div class="col-md-12">
                    <b-card header="发票明细">
                        <b-button size="sm" 
                            variant="success" 
                            class="header-btn-r" 
                            @click="saveInvoice"
                            v-show="(isInsert || isUpdate) && cardInfo.orderStatus == 1">保存</b-button>   
                        <div class="row">              
                            <div class="col-md-6">              
                                <b-button size="sm" variant="danger" @click="removeInvoice" v-show="(isInsert || isUpdate) && cardInfo.orderStatus == 1">删除</b-button>                                             
                                <b-button size="sm" variant="success" @click="addInvoice" v-show="(isInsert || isUpdate)  && cardInfo.orderStatus == 1">添加</b-button>                                             
                            </div>
                            <div class="col-md-6 text-right">     
                                <h4> 已开票金额： {{totalInvoiceAmount}}元</h4>                                              
                            </div>
                        </div>
                        <div class="table-scrollable mb-2">
                            <b-table striped hover bordered show-empty :items="cardInfo.invoiceDetailInfoVos" :fields="invoiceFields">
                                <template slot="radio" slot-scope="data">
                                    <input type="radio" name="radio" :value="data.index" v-model="invoiceSelectIndex"/>
                                </template> 
                                <template slot="toVoid" slot-scope="row">                        
                                    <b-button
                                        v-show="row.item.id && row.item.operation == 1 && row.item.invoiceStatus != -1"
                                        size="sm" variant="danger"
                                        @click="toVoidInvoice(row)">
                                        作废
                                    </b-button>
                                </template>	
                                <template slot="invoiceRate" slot-scope="row">
                                    {{ row.value * 100 }}%                                   
                                </template>
                                <template slot="invoiceStatus" slot-scope="row">
                                    {{ row.value | invoiceStatusFilte }}
                                </template>
                                <template slot="empty" >暂无数据</template>
                            </b-table>
                        </div>

                        <div class="row">
                            <div class="col-md-12 text-right">                   
                                <b-button size="sm" variant="default"  @click="print">打印</b-button>
                            </div>
                        </div>
                    </b-card>
                </div>
            </div>
            <!-- 开票 - Modal -->
            <open-ticket ref="openTicket" 
                v-if="showInvoiceModal"
                @conOpenTicket='addInvoiceList'
                :invioceNum="cardInfo.salesActualAmount"
                invoiceContentStart='CouponSales' >
            </open-ticket>
                <!-- :invoiceContentSuffix="cardName" -->
            <select-coupons 
                ref="selectCouponsModal" 
                :selectedList="selCouponList" 
                @select="selCoupon">
            </select-coupons>
        </div>
    </div>
</div>
</template>
<script>

import CarInfo from  'components/iris-carinfo'
import OpenTicket from 'views/card-sale/edit/open-ticket'
import AddPayDetail from 'components/add-pay-detail'
import SelectCarExtendProp from 'components/select-car-extend-prop/select-car-extend-prop'
import Search from 'components/iris-search/search'
import SelectCoupons from '../coupons-sale-order/select-coupons'


import Vue from 'vue'
import { Upload, Message, DatePicker, MessageBox, Dialog, Checkbox, Table, TableColumn, } from 'element-ui'
Vue.use(Upload)
Vue.use(DatePicker)
Vue.use(Dialog)
Vue.use(Checkbox)
Vue.use(Table)
Vue.use(TableColumn)

import api from 'common/api'
import config from 'common/config'
import common from 'common/common'
import apiUrl from 'common/api-collection'

import { getSequence, alertSuccess, getDateRange, formatDate, dateDiff, getType, getSequenceList, filter } from 'common/api-common'
import { CARD_SALE_INVOICE_SEQ, COUPON_SALES_PAYMENT_SEQ, CUSTOM, CUSTOM_VEHICLE_SEQ, CUSTOM_VEHICLE_ADD_SEQ, COUPON_SALES_DETAIL_SEQ } from 'common/sequence'
import { PAYMENTMODE_TYPE, CERTIFICATE_TYPE, CUSTOM_TYPE } from 'common/ref-code'

const JUST_ONLY_STORE = 'SpecialShop'    // 专店专用数据字典 code
const FIXED_DAYS = 0    

Date.prototype.format = function (format) {
    //eg:format="yyyy-MM-dd hh:mm:ss";

    if (!format) {
        format = "yyyy-MM-dd hh:mm:ss";
    }

    var o = {
        "M+": this.getMonth() + 1,  // month
        "d+": this.getDate(),       // day
        "H+": this.getHours(),      // hour
        "h+": this.getHours(),      // hour
        "m+": this.getMinutes(),    // minute
        "s+": this.getSeconds(),    // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }

    return format;
}

export default {
    components: {
        CarInfo,
        OpenTicket,
        AddPayDetail,
        SelectCarExtendProp,
        Search,
        SelectCoupons
    },
    data() {
        return {
            cardInfo: {
                id: '',
                orderStatus: 0,
                createTimeStr: '',
                couponSalesPaymentInfos: [],    // 收款明细
                invoiceDetailInfoVos: [],  // 发票明细 
                salesActualAmount: 0,
                startDate: '',
                endDate: '',
                couponSalesDetailInfoVo: []             
            },
            salesName: '',
            saleEmpList: [],
            orderStatus: [
                {text: '未结算', value: 0},
                {text: '已结算', value: 1},                
                {text: '已作废', value: -1}
            ],
            cardExpireType: [
                {text: '固定时长', value: 0},
                {text: '标定结束日期', value: 1},                
                {text: '储值券无有效期', value: -1}
            ],
            isTemporarySaveEd: false,
            // 上传
            uploadUrl: config.uploadUrl,
            addParams: {
                relationCode: '',
                singleFlag: '0',
                businessType: ''
            },
            fileList: [],
            // 券明细
            couponFields: {
                radio: {
                    label: '选择'
                },
                couponNo: {
                    label: '劵号'
                },
                couponName: {
                    label: '券名称'
                },
                useNatureTypeName: {
                    label: '券使用性质'
                },
                couponUseTypeName: {
                    label: '适用方'
                },
                startDate: {
                    label: '有效期开始时间'
                },
                endDate: {
                    label: '有效期结束时间'
                },
                couponPrice: {
                    label: '销售价'
                },
            },

            // 收款明细
            payFields: {
                radio: {
                    label: '选择'
                },
                paymentTypeName: {
                    label: '支付方式'
                },
                paymentAmount: {
                    label: '收款金额'
                },
                paymentTime: {
                    label: '收款日期'
                },
                paymentEmpName: {
                    label: '收款员'
                },
                paymentTransactionNo: {
                    label: '交易流水号'
                }
            },
            paySelectIndex: -1,
            // 发票明细
            invoiceFields: {
                radio: {
                    label: '选择'
                },
                toVoid: {
                    label: '作废操作'
                },
                invoiceContentDesc: {
                    label: '开票内容'
                },
                invoiceTypeName: {
                    label: '发票类型'
                },
                invoiceRate: {
                    label: '税率'
                },
                invoiceAmount: {
                    label: '开票金额'
                },
                invoiceAmountExcludingTax: {
                    label: '去税金额'
                },
                taxAmount: {
                    label: '税金'
                },
                invoiceNo: {
                    label: '发票号'
                },
                invoiceTitle: {
                    label: '开票人/企业名称'
                },
                taxRegistrationNo: {
                    label: '纳税人识别号'
                },
                bankName: {
                    label: '开户行'
                },
                companyAddress: {
                    label: '地址'
                },
                invoiceStatus: {
                    label: '状态'
                },
                refundInvoiceNo: {
                    label: '红冲票号'
                },
            },
            invoiceSelectIndex: -1,
            showInvoiceModal: false,   // 解决异步props问题
            invoiceList: [],           // 编辑开票暂存数据

            // 收款( 结算 )
            payList: [],
            selectIndex: -1,

            confirmPayInp: '',
            confirmState: null,

            couponPaySeq: COUPON_SALES_PAYMENT_SEQ,

            tempCouponsInfo: {},
            selCouponList: [],
            couponSelectIndex: -1
        } 
    },
    mounted() {
        this.addParams.relationCode = this.$route.query.couponSalesOrderNo
        if(this.isInsert && !this.cardInfo.id) {
            let couponList = JSON.parse(sessionStorage.getItem("couponList"))
            let couponStoreInfo = JSON.parse(sessionStorage.getItem("couponStoreInfo"))
            this.cardInfo.storeCode = couponStoreInfo.storeCode
            this.cardInfo.storeName = couponStoreInfo.storeName
            this.salesName = couponStoreInfo.salesName
            couponList.forEach(item => {
                delete item.id
                this.selCouponList.push(item)
            })
            this.cardInfo.createName = this.userInfo.empVo.empCnName
            this.cardInfo.couponSalesOrderNo = this.$route.query.couponSalesOrderNo
            this.cardInfo.couponCount = this.cardInfo.couponSalesDetailInfoVo.length
            this.cardInfo.salesOriginalAmount = this.totalCouponsAmount
            this.getEmpList({
                storeCode: this.cardInfo.storeCode
            })
        }else {
            this.queryCardSalesInfo(res => {
                if(this.cardInfo.cardUseTypeCode == 'VehicleVoucher') {
                    this.$refs.car.setValue({
                        factoryCode: res.factoryCode,
                        brandCode: res.brandCode,
                        seriesCode: res.seriesCode,
                        modelCode: res.modelCode,
                        opvCode: res.opvCode,
                        ioTypeCode: res.iotypeCode
                    })
                }
                this.getEmpList({
                    storeCode: res.storeCode
                })
                this.querySalesByStoreCode(res.storeCode)
                if(res.fileCode) {
                    this.getFileList(res.fileCode)
                }
            })
        }
    },
    computed: {
        userInfo() {
            return JSON.parse(sessionStorage.getItem('userInfo'))
        },
        isStore() {
            return this.userInfo.userAvailableInfo.availableType == 0
        },
        storeInfoVo() {
            return this.userInfo.userAvailableInfo.storeInfoVo
        },
        // 0: 新增, 1: 编辑, 2: 查看
        pageState() {
            return this.$route.query.pageState
        },
        isInsert() {
            return this.pageState == 0
        },
        isUpdate() {
            return this.pageState == 1
        },
        isWatch() {
            return this.pageState == 2
        },
        cardName() {
            return this.$route.query.cardName
        },
        payState() {
            if(this.paySum == this.cardInfo.salesOriginalAmount) {
                return 0
            }else if(this.paySum - this.cardInfo.salesOriginalAmount > 0) {
                return 1
            }else {
                return -1
            }
        },
        paySum() {
            let sum = 0
            this.payList.forEach(item => {
                sum += parseInt(item.paymentAmount)
            })
            return sum.toFixed(2)
        },
        payAlertInfo() {
            if(this.payState == 1) {
                return `本订单收款总金额: ${this.paySum}, 大于应收金额, 确认大于应收金额: ${this.cardInfo.salesOriginalAmount} 吗?`
            }else if(this.payState == 0) {
                return '收款金额之和等于应收金额'
            }
        },
        totalCouponsAmount() {
            let sum = 0
            if(this.selCouponList != null) {
                this.selCouponList.forEach(item => {
                    sum += item.couponPrice - 0
                })
            }
            return sum.toFixed(2)
        },
        totalPaymentAmount() {
            let sum = 0
            if(this.cardInfo.couponSalesPaymentInfos != null) {
                this.cardInfo.couponSalesPaymentInfos.forEach(item => {
                    sum += parseInt(item.paymentAmount)
                })
            }
            return sum.toFixed(2)
        },
        totalInvoiceAmount() {
            let sum = 0
            if(this.cardInfo.invoiceDetailInfoVos != null) {
                this.cardInfo.invoiceDetailInfoVos.forEach(item => {
                    if( !item.hasOwnProperty('invoiceStatus') || item.invoiceStatus == 0) {
                        sum += parseInt(item.invoiceAmount)
                    }
                })
            }
            return sum.toFixed(2)
        },
    },
    methods: {
        showCouponsModal() {
            this.$refs.selectCouponsModal.show()
        },
        removeCoupon() {
            this.isSelected(this.couponSelectIndex, () => {
                let selectItem = this.selCouponList[this.couponSelectIndex]
                const ce = this.$createElement
                MessageBox({
                    title: '提示',
                    message: ce('p', null, [
                            ce('span', null, '是否确定删除'),
                        ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            if(selectItem.hasOwnProperty('couponSalesDetailCode')) {
                                this.selCouponList[this.couponSelectIndex].isDeleted = 1
                                this.temporarySave()
                            }else {
                                this.selCouponList.splice(this.couponSelectIndex, 1)
                            }
                            this.couponSelectIndex = -1
                            done()
                        } else {
                            done()
                            return
                        }
                    }
                }).then( action => {}).catch(() => {})
            })
        },
        selCoupon(couponList) {
            this.selCouponList = couponList
            this.cardInfo.salesOriginalAmount = this.totalCouponsAmount
        },

        getEmpList(params) {
            api.empScheduling.queryEmpByStore(params).then(res => {
                if (res.data.code === 'success') {
                    let obj = res.data.obj
                    let saleEmpList = []
                    obj.forEach(item => {
                        this.saleEmpList.push({
                            text: item.empCnName,
                            value: item.empCode
                        })
                    })
                }
            })
        },
        querySalesByStoreCode(_storeCode) {
            api.storeInfo.queryShopInfo({
                storeCode: _storeCode
            }, msg => {
                if(msg.data.message === 'success') {
                    this.salesName = msg.data.obj.salesName
                }
            })
        },
        // 上传
        uploadSuccess(res) {
            if(res.code == "success") {
                let obj = res.obj[0]
                let params = JSON.parse(JSON.stringify(this.cardInfo))
                params.fileCode = obj.fileCode
                api.couponSale.updateCouponSalesOrder(params, res => {
                    if(res.data.code === 'success') {
                        Message({
                            type: 'success',
                            message: config.messInfo.success
                        })
                    }
                    // this.queryCardSalesInfo()
                })
                // api.cardSale.update(params).then(res => {
                //     Message({
                //         type: 'success',
                //         message: config.messInfo.success
                //     })
                // })
                // console.log(this.fileList.length)
                // if(this.fileList.length) {
                //     api.accessory.del([{id: this.fileList[0].response.obj[0].id}], res => {
                //         if(res.data.code === 'success') {
                //             this.fileList.splice(0, 1)                                
                //         }
                //     })
                // }
            }
        },
        uploadError(file) {
            Message({
                type: "error",
                message: "上传失败"
            });
        },
        uploadRemove(file) {
            api.accessory.del([{id: file.response.obj[0].id}], res => {
                alertSuccess(res)
            })	
        },
        getFileList(_fileCode) {
            let params = { relationCode: this.cardInfo.couponSalesOrderNo }
            api.accessory.list(params, res => {              
                if(res.data.code === 'success') {
                    this.fileList = []
                    let obj = res.data.obj
                    obj.forEach(item => {
                        let data = {
                            name: item.fileOrgName,
                            response: {
                                obj: [{id: item.id}]
                            }
                        }
                        this.fileList.push(data)
                    })
                }
            })
        },
        preview(res) {
            let params = {
                id: res.response.obj[0].id
            }
            api.accessory.pvw(params, result => {
                let data = result.data;
                if(data.code === 'success') {
                    if(data.obj) {
                        window.open(common.getUploadUrl() + data.obj);
                    }else {
                        Message('该附件不支持预览!');
                    }
                    
                }
            })
        },
        getCarInfo(data) {
            this.cardInfo.factoryCode = data.factoryCode
            this.cardInfo.brandCode = data.brandCode
            this.cardInfo.seriesCode = data.seriesCode
            this.cardInfo.modelCode = data.modelCode
            this.cardInfo.opvCode = data.opvCode
            this.cardInfo.iotypeCode = data.ioTypeCode
        },
        // 作废
        toVoid() {
            if(this.cardInfo.orderStatus === 1) {
                Message({
                    type: "warning",
                    message: "券销售单已结算不可作废"
                })
                return
            }
            const createElement = this.$createElement
            MessageBox({
                title: '提示',
                message: createElement('p', null, [
                        createElement('span', null, '是否确定作废'),
                    ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        let params = {
                            id: this.cardInfo.id, 
                            couponSalesOrderNo: this.cardInfo.couponSalesOrderNo,
                        }
                        api.couponSale.cancelCouponSalesOrderInfo(params, res => {
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'success',
                                    message: config.messInfo.success
                                })
                                this.cardInfo.orderStatus = res.data.obj.orderStatus
                            }
                        })
                        done()
                    } else {
                        done()
                        return
                    }
                }
            }).then( action => {}).catch(() => {})
        },
        // 开票
        addInvoice() {
            this.$refs.openTicket.show()
        },
        removeInvoice() {
            this.isSelected(this.invoiceSelectIndex, () => {
                let selectItem = this.cardInfo.invoiceDetailInfoVos[this.invoiceSelectIndex]
                if(selectItem.hasOwnProperty('id')
                    && selectItem.operation != 0) {
                    Message({
                        type: "warning",
                        message: "该发票号不可删除！"
                    })
                    return 
                }
                const createElement = this.$createElement
                MessageBox({
                    title: '提示',
                    message: createElement('p', null, [
                            createElement('span', null, '是否确定删除'),
                        ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            let index = this.invoiceList.length - this.cardInfo.invoiceDetailInfoVos.length + this.invoiceSelectIndex
                            if(selectItem.hasOwnProperty('id')) {
                                // this.invoiceList = JSON.parse(JSON.stringify(this.cardInfo.invoiceDetailInfoVos))
                                this.invoiceList[index].isDeleted = 1
                            }else {
                                this.invoiceList.splice(index, 1)
                            }
                            this.cardInfo.invoiceDetailInfoVos.splice(this.invoiceSelectIndex, 1)
                            this.invoiceSelectIndex = -1
                            done()
                        } else {
                            done()
                            return
                        }
                    }
                }).then( action => {}).catch(() => {})
            })
        },
        toVoidInvoice(row) {
            const createElement = this.$createElement
            MessageBox({
                title: '提示',
                message: createElement('p', null, [
                        createElement('span', null, '是否确定作废'),
                    ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        if(this.cardInfo.invoiceDetailInfoVos[row.index].hasOwnProperty('id')) {
                            // this.invoiceList = JSON.parse(JSON.stringify(this.cardInfo.invoiceDetailInfoVos))
                            this.cardInfo.invoiceDetailInfoVos[row.index].invoiceStatus = -1
                            this.invoiceList[row.index].invoiceStatus = -1
                        }
                        Message({
                            type: "warning",
                            message: "请单击保存后生效！"
                        })
                        done()
                    } else {
                        done()
                        return
                    }
                }
            }).then( action => {}).catch(() => {})
        },
        saveInvoice() {
            if(this.userInfo.userAvailableInfo.availableType != 0) {
                Message({
                    type: "warning",
                    message: "该账号无门店信息，无法保存！"
                })
                return
            }
            // 开票金额可以等于0 或者 等于支付金额
            if(this.totalInvoiceAmount - this.cardInfo.salesActualAmount == 0 || this.totalInvoiceAmount == 0) {
                let paramsList = JSON.parse(JSON.stringify(this.invoiceList))                
                if(!paramsList.length) {
                    Message({
                        type: 'warning',
                        message: '发票信息不可为空'
                    })
                    return
                }else {
                    // let paramsList = JSON.parse(JSON.stringify(this.invoiceList))
                    paramsList.forEach(item => {
                        delete item.invoiceType
                        item.storeCode = this.cardInfo.storeCode
                        item.sourceOrderNo = this.cardInfo.couponSalesOrderNo
                        item.cardNo = this.cardInfo.cardNo
                        item.sourceOrderTypeCode = "CouponSalesOrder"  
                        item.invoiceContentCode = "CouponSales"
                        item.invoiceEmpCode = this.userInfo.empVo.empCode
                        item.hasOwnProperty('id') ? item.invoiceStatus = item.invoiceStatus : item.invoiceStatus = 0
                        // item.isSyncExternalSystem = 0 
                    })
                    this.editCardSalesInvoice(paramsList)
                } 
            }else {
                Message({
                    type: 'warning',
                    message: '开票金额必须等于实收金额'
                })
            }
        },
        addInvoiceList(info) {
            let obj = JSON.parse(JSON.stringify(info))
            obj.refundInvoiceNo = ''
            // this.cardInfo.invoiceDetailInfoVos = []
            this.cardInfo.invoiceDetailInfoVos.push(obj)
            this.invoiceList.push(obj)
            // this.invoiceList = JSON.parse(JSON.stringify(this.cardInfo.invoiceDetailInfoVos))
        },
        editCardSalesInvoice(params) {
            api.cardPay.editCardRechargeInvoiceInfo(params, res => {
                alertSuccess(res, () => {
                    this.queryCardSalesInfo()
                })
            })
        },

        // 结算
        addPay() {
            this.$refs.payModal.showModal()
        },
        removePay() {
            this.isSelected(this.paySelectIndex, () => {
                this.cardInfo.couponSalesPaymentInfos.splice(this.paySelectIndex, 1)
            })
        },
        sureAdd(info) {
            let obj = JSON.parse(JSON.stringify(info))
            obj.couponSalesOrderNo = this.$route.query.couponSalesOrderNo
            this.cardInfo.couponSalesPaymentInfos.push(obj)
        },
        confirmPay() {
            if(this.cardInfo.salesOriginalAmount - 0 < 0) {
                Message({
                    type: 'warning',
                    message: '应收金额不能小于0'
                })
                return
            }
            // if(this.cardInfo.cardUseTypeCode == 'VehicleVoucher') {
            //     if(!this.cardInfo.customName || !this.cardInfo.mobilePhone || !this.cardInfo.plateNumber) {
            //         this.confirmAlert('请先填写客户车辆信息')
            //         return
            //     }
            // }else {
            //     if(!this.cardInfo.customName || !this.cardInfo.mobilePhone) {
            //         this.confirmAlert('请先填写客户信息')
            //         return
            //     }
            // }
            if(this.totalPaymentAmount - this.cardInfo.salesOriginalAmount < 0) {
                this.confirmAlert('收款金额需大于等于应收金额')
            }else {
                this.confirmAlert('结算后无法再做修改, 确认结算么',  true, () => {
                    let params = this.cardInfo.couponSalesPaymentInfos
                    this.temporarySave(false, () => {
                        this.editCouponSalesPaymentInfo(params, () => {
                            this.queryCardSalesInfo()
                        })
                    })
                })

            }    
        },  
        editCouponSalesPaymentInfo(params, next) {
            api.couponSale.editCouponSalesPaymentInfo(params, res => {
                alertSuccess(res, () => {
                    next()
                })
            })
        },
        isSelected(i, next) {
            if(i === -1) {
                Message({
                    type: 'warning',
                    message: '请选择'
                })
                return
            }else {
                next()
            }
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
        // 暂存
        temporarySave(showAlert = true, next = () => {}) {
            if(this.cardInfo.salesOriginalAmount - 0 < 0) {
                Message({
                    type: 'warning',
                    message: '应收金额不能小于0'
                })
                return
            }
            let params = {
                couponSalesOrderNo: this.cardInfo.couponSalesOrderNo,
                salesOriginalAmount: this.cardInfo.salesOriginalAmount,  
                couponSourceCode: 'InternalCreation',
                orderChannelCode: 'OfflineStoreSales',
                storeCode: this.cardInfo.storeCode,
                salesEmpCode: this.cardInfo.salesEmpCode, 
                couponSalesDetailInfoVo: [],

                // customCode: this.cardInfo.customCode,
                // customName: this.cardInfo.customName,     // 客户名称, 后续传编码 => 手机号, 车票号自动带出
                // vehicleCode: this.cardInfo.vehicleCode,
                // mobilePhone: this.cardInfo.mobilePhone,
                // plateNumber: this.cardInfo.plateNumber,
                // vinCode: this.cardInfo.vinCode,
                // factoryCode: this.cardInfo.factoryCode,
                // brandCode: this.cardInfo.brandCode,
                // seriesCode: this.cardInfo.seriesCode,
                // modelCode: this.cardInfo.modelCode,
                // opvCode: this.cardInfo.opvCode,
                // iotypeCode: this.cardInfo.iotypeCode,                            
            }
            let deleteList = []
            if(this.cardInfo.id) {
                let _detailList = JSON.parse(JSON.stringify(this.tempCouponsInfo.couponSalesDetailInfoVo))
                _detailList.forEach(item => {
                    let i = this.selCouponList.findIndex(v => v.couponNo === item.couponNo)
                    if(i === -1) {
                        item.isDeleted = 1
                        deleteList.push(item)
                    }
                })
            }
            let count = 0
            this.selCouponList.forEach(item => {
                if(!item.hasOwnProperty('couponSalesDetailCode')) {
                    count ++
                }
            })
            if(count > 0) {
                let seqListParams = {
                    serviceCode: COUPON_SALES_DETAIL_SEQ,
                    getNums: count
                }
                getSequenceList(seqListParams, detailCodes => {
                    let paramsList = deleteList.concat(this.selCouponList)
                    paramsList.forEach((item, i) => {
                        if(!item.hasOwnProperty('couponSalesDetailCode')) {
                            count--
                            let info = {
                                couponSalesOrderNo: params.couponSalesOrderNo,
                                couponSalesDetailCode: detailCodes[count],
                                couponNo: item.couponNo,
                                couponPrice: item.couponPrice
                            }
                            params.couponSalesDetailInfoVo.push(info)                            
                        }else {
                            let _info = {
                                id: item.id,
                                couponSalesOrderNo: params.couponSalesOrderNo,
                                couponSalesDetailCode: item.couponSalesDetailCode,
                                couponNo: item.couponNo,
                                couponPrice: item.couponPrice,
                                isDeleted: item.isDeleted
                            }
                            params.couponSalesDetailInfoVo.push(_info) 
                        }
                    })
                    if(this.isInsert && !this.isTemporarySaveEd) {
                        api.couponSale.insertCouponSalesOrder(params, res => {
                            if (res.data.code === 'success') {
                                this.isTemporarySaveEd = true
                                this.cardInfo.id = res.data.obj.id
                                if(showAlert) {
                                    Message({
                                        type: 'success',
                                        message: config.messInfo.success
                                    })
                                }
                                this.queryCardSalesInfo()
                                next()
                            }
                        })
                    }else {
                        params.id = this.cardInfo.id
                        api.couponSale.updateCouponSalesOrder(params, res => {
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'success',
                                    message: config.messInfo.success
                                })
                                this.queryCardSalesInfo()
                                next()
                            }
                        })
                    }
                })
            }else {
                let paramsList = deleteList.concat(this.selCouponList)
                paramsList.forEach((item, i) => {
                    let _info = {
                        id: item.id,
                        couponSalesOrderNo: item.couponSalesOrderNo,
                        couponSalesDetailCode: item.couponSalesDetailCode,
                        couponNo: item.couponNo,
                        couponPrice: item.couponPrice,
                        isDeleted: item.isDeleted
                    }
                    params.couponSalesDetailInfoVo.push(_info) 
                })
                if(this.isInsert && !this.isTemporarySaveEd) {
                    api.couponSale.insertCouponSalesOrder(params, res => {
                        if (res.data.code === 'success') {
                            this.isTemporarySaveEd = true
                            this.cardInfo.id = res.data.obj.id
                            if(showAlert) {
                                Message({
                                    type: 'success',
                                    message: config.messInfo.success
                                })
                            }
                            this.queryCardSalesInfo()
                            next()
                        }
                    })
                }else {
                    params.id = this.cardInfo.id
                    api.couponSale.updateCouponSalesOrder(params, res => {
                        if(res.data.code === 'success') {
                            Message({
                                type: 'success',
                                message: config.messInfo.success
                            })
                            this.queryCardSalesInfo()
                            next()
                        }
                    })
                }
            }
        },
        print() {
            if(this.cardInfo.orderStatus != 1) {
                Message({
                    type: "warning",
                    message: "未结算不能打印"
                })
                return
            }
            common.printPreview(common.isdev() + apiUrl.couponSale.print, {
                name: 'couponSalesOrderNo',
                value: this.cardInfo.couponSalesOrderNo
            })
        },
        getStatus(val) {
            if(val == 0) {
                return '已开票'
            }else if(val == 1) {
                return '已退票'
            }else if(val == -1) {
                return '已作废'
            }
        },
        cancel() {
            this.$router.push({
                path: 'query'
            })
        },
        queryCardSalesInfo(next = () => {}) {
            let params = { couponSalesOrderNo: this.$route.query.couponSalesOrderNo }
            api.couponSale.getCouponSalesOrderInfoByCode(params, res => {
                if (res.data.code === 'success') {
                    let obj = res.data.obj
                    this.cardInfo = obj
                    this.selCouponList = JSON.parse(JSON.stringify(obj.couponSalesDetailInfoVo))
                    this.tempCouponsInfo = obj

                    this.cardInfo.salesOriginalAmount = obj.salesOriginalAmount.toFixed(2)
                    this.cardInfo.createTimeStr = obj.createTimeStr.substring(0, 10)
                    // if(this.cardInfo.orderStatus == 1) {
                    //     this.cardInfo.salesTime = obj.salesTime.substring(0, 10)
                    // }
                    
                    this.showInvoiceModal = true
                    this.invoiceList = JSON.parse(JSON.stringify(this.cardInfo.invoiceDetailInfoVos))

                    // 处理金额保留两位小数
                    if(Array.isArray(this.cardInfo.couponSalesPaymentInfos) 
                        && this.cardInfo.couponSalesPaymentInfos.length) {
                        this.cardInfo.couponSalesPaymentInfos.forEach(item => {
                            item.paymentAmount = item.paymentAmount.toFixed(2)                                                         
                        })
                    }
                    if(Array.isArray(this.cardInfo.invoiceDetailInfoVos) 
                        && this.cardInfo.invoiceDetailInfoVos.length) {
                        this.cardInfo.invoiceDetailInfoVos.forEach(item => {
                            item.invoiceAmount = item.invoiceAmount.toFixed(2)
                            item.invoiceAmountExcludingTax = item.invoiceAmountExcludingTax.toFixed(2)
                            item.taxAmount = item.taxAmount.toFixed(2) 
                        })
                    }
                    next(obj)
                }
            })
        },  
        startDateFilter(item) {
            if(this.cardInfo.orderStatus == 1) {
                return item.startDate
            }else {
                if(!this.cardInfo.createTimeStr) {
                    return ''
                }
                return this.cardInfo.createTimeStr.substring(0, 10)
            }
            // if(item.couponExpireType == 0) {
            //     if(this.cardInfo.orderStatus == 0) {
            //         if(!this.cardInfo.createTimeStr) {
            //             return ''
            //         }
            //         let startTime = this.cardInfo.createTimeStr.substring(0, 10)
            //         return getDateRange(startTime, item.expirePeriod).split('~')[0]
            //     }else if(this.cardInfo.orderStatus == 1) {
            //         if(!this.cardInfo.salesTime) {
            //             return ''
            //         }
            //         let _startTime = this.cardInfo.salesTime.substring(0, 10)
            //         return getDateRange(_startTime, item.expirePeriod).split('~')[0]       
            //     }
            // }else {
            //     if(this.cardInfo.orderStatus == 0) {
            //         if(!this.cardInfo.createTimeStr) {
            //             return ''
            //         }
            //         let startTime = this.cardInfo.createTimeStr.substring(0, 10)
            //         return startTime || ''
            //     }else if(this.cardInfo.orderStatus == 1) {
            //         if(!this.cardInfo.salesTime) {
            //             return ''
            //         }
            //         let _startTime = this.cardInfo.salesTime.substring(0, 10) 
            //         return _startTime || ''                          
            //     }
            // }
        },
        endDateFilter(item) {
            if(this.cardInfo.orderStatus == 1) {
                return item.endDate
            }else {
                if(item.couponExpireType == 0) {
                    if(!this.cardInfo.createTimeStr) {
                        return ''
                    }
                    let startTime = this.cardInfo.createTimeStr.substring(0, 10)
                    return getDateRange(startTime, item.expirePeriod).split('~')[1]
                }else {
                    return item.endDate
                }
            }
            // if(item.couponExpireType == FIXED_DAYS) {
            //     if(this.cardInfo.orderStatus == 0) {
            //         if(!this.cardInfo.createTimeStr) {
            //             return ''
            //         }
            //         let startTime = this.cardInfo.createTimeStr.substring(0, 10)
            //         return getDateRange(startTime, item.expirePeriod).split('~')[1]
            //     }else if(this.cardInfo.orderStatus == 1) {
            //         if(!this.cardInfo.salesTime) {
            //             return ''
            //         }
            //         let _startTime = this.cardInfo.salesTime.substring(0, 10)
            //         return getDateRange(_startTime, item.expirePeriod).split('~')[1]       
            //     }
            // }else {
            //     if(this.cardInfo.orderStatus == 0) {
            //         if(!this.cardInfo.createTimeStr) {
            //             return ''
            //         }
            //         return item.endDate || ''
            //     }else if(this.cardInfo.orderStatus == 1) {
            //         if(!this.cardInfo.salesTime) {
            //             return ''
            //         }
            //         return item.endDate || ''                          
            //     }
            // }
        },
    },
    watch: {
        'cardInfo.orderStatus': {
            handler(val) {
                if(val != 0) {
                    delete this.payFields.radio
                }
            },
            immediate: true
        }
    },
    filters: {
        toFixed(val) {
            if(typeof val == 'number') {
                return val.toFixed(2)
            }
        },
        invoiceStatusFilte(val) {
            if(val == 0) {
                return '已开票'
            }else if(val == 1) {
                return '已退票'
            }else if(val == -1) {
                return '已作废'
            }
        },
    }
}
</script>
<style scoped>
.header-btn-r{
    position: absolute;
    top: 8px;
    right: 20px;
}
</style>
