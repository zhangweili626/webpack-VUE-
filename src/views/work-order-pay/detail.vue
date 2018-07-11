<template>
    <div class="animated fadeIn">
        <b-card header="工单详情">
            <div class="row">
                <div class="col-md-4">
                    <!--订单创建时间 对应参数: createTime-->
                    <b-form-fieldset horizontal label="订单创建时间:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.createTimeStr}}</div>
                    </b-form-fieldset>
                </div>
                <!--<div class="col-md-4">
                    订单结算时间 对应参数: closingDate
                    <b-form-fieldset horizontal label="订单结算时间:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.closingDate}}</div>
                    </b-form-fieldset>
                </div>-->
                <div class="col-md-4">
                    <!--订单业务类型 对应参数: businessTypeName-->
                    <b-form-fieldset horizontal label="订单业务类型:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.businessTypeName}}</div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--订单来源 对应参数: orderSourceType-->
                    <b-form-fieldset horizontal label="订单来源:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.orderSourceType | orderSourceTypeFunc}}</div>
                    </b-form-fieldset>
                </div>
                <!--<div class="col-md-4">
                    订单来源单号 对应参数：暂无入参
                    <b-form-fieldset horizontal label="订单来源单号" :label-cols="4" class="text-right">
                        <div class="mt-2 text-right">{{detailMain.createTimeStr}}</div>
                    </b-form-fieldset>
                </div>-->
                <div class="col-md-4">
                    <!--订单号 对应参数: orderNo-->
                    <b-form-fieldset horizontal label="订单号:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.orderNo}}</div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单状态:" :label-cols="4" class="text-right">
                        <!--订单状态 对应参数: orderStatus-->
                        <div class="mt-2 text-left">{{detailMain.orderStatus | orderStatusFunc}}</div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--支付状态 对应参数: paymentStatus-->
                    <b-form-fieldset horizontal label="支付状态:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.paymentStatus | paymentStatusFunc}}</div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--是否开票 对应参数: invoiceStatus 主状态select对应option数据: invoiceStatusTypeOptions-->
                    <b-form-fieldset horizontal label="是否开票:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.invoiceStatus | invoiceStatusFunc}}</div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--客户姓名 对应参数: custName-->
                    <b-form-fieldset horizontal label="客户姓名:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.custName}}</div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--客户手机号 对应参数: custMobile-->
                    <b-form-fieldset horizontal label="客户手机号:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.custMobile}}</div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--VIN 对应参数: vinCode-->
                    <b-form-fieldset horizontal label="VIN:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.vinCode}}</div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--开单人: 对应参数: salesEmpName-->
                    <b-form-fieldset horizontal label="开单人:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.salesEmpName}}</div>
                    </b-form-fieldset>
                </div>
                <!--<div class="col-md-4">
                    使用的卡号: 对应参数: cardNo
                    <b-form-fieldset horizontal label="使用的卡号:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.cardNo}}</div>
                    </b-form-fieldset>
                </div>-->
                <!--<div class="col-md-4">
                    使用的券号: 对应参数: couponNo
                    <b-form-fieldset horizontal label="使用的券号:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.couponNo}}</div>
                    </b-form-fieldset>
                </div>-->
                <div class="col-md-4">
                    <!--车牌 对应参数: custPlates-->
                    <b-form-fieldset horizontal label="车牌:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">{{detailMain.custPlates}}</div>
                    </b-form-fieldset>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="应收总额:" class="mb-0" label-text-align="right" :label-cols="4">
                        <div class="text-left mt-2">{{(this.detailMain.actualTotalPrice - 0).toFixed(2)}}</div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="已收金额:" class="mb-0" label-text-align="right" :label-cols="4">
                        <div class="text-left mt-2">{{amountMoney.toFixed(2)}}</div>
                    </b-form-fieldset>
                </div>
            </div>
        </b-card>
        <b-card header="收款历史">
            <div v-if="isCancelTrue">
                <div v-if="!currentOderType">
                    <b-button class="btn-success" size="sm" variant="info" @click="refund">收款</b-button>
                    <b-button size="sm" variant="danger" @click="deletePayInfo">删除</b-button>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="payInfoTableData" :fields="fields">
                    <template slot="index" slot-scope="data">
                        {{data.index + 1}}
                    </template>
                    <template slot="checkbox" slot-scope="data">
                        <input type="radio" 
                            v-model="radioData" 
                            @click="selectPayInfo(data.item)" 
                            :value="data.item.id"
                            :disabled="currentOderType" 
                            name="models" >
                    </template>
                    <template slot="empty">
                        暂无数据...
                    </template>
                </b-table>
            </div>
            <!-- <pagination class="pull-right"
                        @page-change="pageChange"
                        :page-no="pager.pageNo"
                        :page-size="pager.pageSize"
                        :total-result="pager.total"
                        :total-pages="pager.totalPages">
            </pagination> -->
        </b-card>
        <div class="row" v-show="isCancelTrue">
            <div class="col-md-12 text-center">
                <b-button size="lg" class="btn-success mt-2 mb-4" v-if="!currentOderType" :disabled="orderOverType" @click="settlementOrderInfo">订单结算</b-button>
                <b-button size="lg" class="btn-success mt-2 mb-4" v-if="currentOderType" @click="printPut">打印预览</b-button>
            </div>
        </div>
        <!--支付弹层-->
        <collectmodel :pageData="detailMain" :customCode="detailMain.custCode" @queryPayList="queryOrderList" ref="collectmodel"></collectmodel>
    </div>
</template>
<script>
import { MessageBox, Message} from 'element-ui'
import config from "common/config";
import api from "common/api";
import { ORDER_INVOICE, ORDER_BUSINESS_TYPE } from 'common/ref-code'
import apiCollection from 'common/api-collection';
import Bus from './bus/bus.js'
import common from 'common/common.js'
//支付弹层
import collectmodel from './collectmodel.vue'
export default {
    components: {
        collectmodel
    },
    data() {
        return {
            //是否是作废单子
            isCancelTrue: false,
            //当前订单状态
            currentOderType: false,
            //已收金额
            amountMoney: 0,
            //订单结算状态
            orderOverType: true,
            //支付明细表格标题
            fields: {
                checkbox: {
                    label: '选择'
                },
                index: {
                    label: '序号'
                },
                paymentTypeName: {
                    label: "支付方式"
                },
                moneyPrice: {
                    label: "收款金额"
                },
                updateTimeStr: {
                    label: "收款日期"
                },
                paymentTransactionNo: {
                    label: "交易凭证号"
                },
                payeeName: {
                    label: "收款员"
                },
                remark: {
                    label: "备注"
                }
            },
            //当前选择明细
            curPayInfo:{},
            radioData:'',
            //支付明细表格数据
            payInfoTableData:[],
            payStatus: '',
            detailMain:{},
            collectmodelType: false,
            moneyPrice:'',
            //查询订单详情防重提
            checkoutCounterFlag: true
        }
    },
    created() {
        this.initPage();
    },
    filters:{
        orderSourceTypeFunc(value){
            switch(value){
                case 0:
                    return '门店散客'
                    break;
                case 1:
                    return '售后预约'
                    break;
                case 2:
                    return '销售预约'
                    break;
                case 3:
                    return '客服预约'
                    break;
            }
        },
        paymentStatusFunc(value){
            switch(value){
                case 0:
                    return '未支付'
                    break;
                case 1:
                    return '已支付'
                    break;
            }
        },
        invoiceStatusFunc(value){
            switch(value){
                case 0:
                    return '未开票'
                    break;
                case 1:
                    return '已开票'
                    break;
            }
        },
        orderStatusFunc(value){
            switch(value){
                case 0:
                    return '待处理'
                    break;
                case 1:
                    return '处理中'
                    break;
                case 9:
                    return '待结算'
                    break;
                case 10:
                    return '已结算'
                    break;
            }
        }
    },
    methods: {
        //页面初始
        initPage(){
            this.queryOrderList();
        },
        //查询订单详情
        queryOrderList(){
            if(!this.checkoutCounterFlag){
                return false;
            }
            this.checkoutCounterFlag = false;
            api.vehicleCleaning.getOrderInfoByCondition({
                orderNo: this.$route.query.orderNo // route - message
            }, (res) => {
                if(res.data.message == "success"){
                    this.detailMain = res.data.obj;
                    // console.log('creatInformation', this.detailMain)
                    this.queryPayList();
                    if(this.detailMain.orderStatus == 10){
                        this.currentOderType = true;
                    }
                    this.isCancelTrue = res.data.obj.isCancel == '0' ? true : false
                    // 并且工单状态不是作废的状态不能显示 || this.detailMain.isCancel != '1'
                    // console.log('是不是显示', this.detailMain.isCancel, this.currentOderType)
                }
                this.checkoutCounterFlag = true;
            })
        },
        //选择支付明细
        selectPayInfo(data){
            this.curPayInfo = data;
        },
        //查询支付明细
        queryPayList(){
            api.repairOrder.queryOrderPaymentInfoNoPage({
                sourceOrderNo: this.$route.query.orderNo
            }, (res) => {
                if(res.data.message == "success"){
                    this.amountMoney = 0
                    this.payInfoTableData = res.data.obj;
                    let i = this.payInfoTableData.length;
                    while(i--){
                        this.amountMoney += this.payInfoTableData[i].moneyPrice;
                    }
                    this.orderOverType = this.amountMoney >= this.detailMain.actualTotalPrice ? false : true;
                }
            });
        },
        //删除支付明细
        deletePayInfo(){
            if(this.curPayInfo == '' || !this.curPayInfo.id){
                Message({ 
                    type: 'warning', 
                    message: '请选择要删除的明细'
                });
                return false;
            }
            MessageBox.confirm('确定执行此操作', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.curPayInfo.isDeleted = 1;
                        api.repairOrder.editOrderPaymentInfoList([this.curPayInfo], (res) => {
                            if(res.data.code == 'success'){
                                Message({ 
                                    type: 'success', 
                                    message: '删除支付明细成功'
                                });
                                this.curPayInfo = '';
                                this.queryOrderList();
                                done();
                            }
                        });
                    } else {
                        done();
                        return
                    }
                }
            })
            
        },
        //工单结算
        settlementOrderInfo(){
            if(!(this.amountMoney >= this.detailMain.actualTotalPrice)){
                Message({ 
                    type: 'success', 
                    message: '应付金额必须大于等于已支付金额'
                });
                return false;
            }
            api.repairOrder.settlementOrderInfo({
                orderNo: this.$route.query.orderNo
            }, (res) => {
                if(res.data.message == 'success'){
                    this.currentOderType = true;
                    this.queryOrderList();
                    Message({ 
                        type: 'success', 
                        message: '工单结算成功'
                    });
                    return false;
                }
            });
        },
        //打印
        printPut(){
            common.printPreview( common.isdev() + apiCollection.repairOrder.print, {
                name: 'orderNo',
                value: this.$route.query.orderNo
            })
        },
        refund() {
            this.$refs.collectmodel.showMadel(this.detailMain.paymentStatus)
            this.moneyPrice = '';
        },
    }
}
</script>


