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
                <div class="col-md-4">
                    <!--订单结算时间 对应参数: closingDate-->
                    <b-form-fieldset horizontal label="订单结算时间:" :label-cols="4" class="text-right">
                        <div class="mt-2 text-left">
                            {{detailMain.closingDate ? detailMain.closingDate.substring(0,19) : ''}}
                        </div>
                    </b-form-fieldset>
                </div>
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
                    <!--VIN 对应参数: vinNo-->
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
        </b-card>
       <b-card header="订单开票明细">
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left" v-if="isCancelTrue">
                    <!--addInvoiceFunction 传参: 新增:0 删除: 1-->
                        <b-button class="btn-success" @click="openModal('openTicket')" size="sm">新增</b-button>
                        <b-button class="btn-danger" @click="addInvoiceFunction(1)" size="sm">删除</b-button>
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty id="invoiceInfoTableData" :items="invoiceInfoTableData" :fields="invoiceInfoTableFields">
                    <template slot="select" slot-scope="data">
                        <p class="text-center mb0">
                            <input type="radio" v-model="addInvoiceData" :value="data.item" />
                        </p>
                    </template>
                    <template slot="empty">
                        暂无数据...                  
                    </template>
                </b-table>
            </div>
        </b-card>
        <!-- 开票明细 - Modal -->
        <open-ticket ref="openTicket" @addInvoiceFunction="addInvoiceFunction" :showInvoiceModal="showInvoiceModal"></open-ticket>
    </div>
</template>
<script>
import { MessageBox, Message} from 'element-ui'
import config from "common/config";
import api from "common/api";
import {ORDER_INVOICE, ORDER_BUSINESS_TYPE} from 'common/ref-code'
//开票
import openTicket from './component/open-ticket.vue';
import Bus from './bus/bus.js'
export default {
    components: {
        openTicket
    },
    data() {
        return {
            //这个工单是不是已经作废
            isCancelTrue: false,
            //详情主信息
            detailMain: {},

            //结算请求FLAG
            checkoutCounterFlag: true,
            //不知何用的属性(支付组件需要)
            showInvoiceModal: false,
            //发票明细表格数据
            invoiceInfoTableData:[],
            //发票明细表格数据字段
            invoiceInfoTableFields:{
                select: {
                    label: '选择'
                },
                invoiceContentDesc:{
                    label: '开票内容'
                },
                invoiceTypeName:{
                    label: '发票类型'
                },
                invoiceRate:{
                    label: '税率'
                },
                invoiceAmount:{
                    label: '开票金额'
                },
                invoiceAmountExcludingTax:{
                    label: '去税金额'
                },
                invoiceNo:{
                    label: '发票号'
                },
                invoiceTitle:{
                    label: '开票人/企业名称'
                },
                taxRegistrationNo:{
                    label: '纳税人识别号'
                },
                bankName:{
                    label: '开户行'
                },
                companyAddress:{
                    label: '地址'
                },
                invoiceStatus:{
                    label: '状态'
                },
                refundInvoiceNo:{
                    label: '红冲票号'
                }
            },
            //发票请求FLAG
            invoiceInfoFlag: true,
            //添加发票信息
            addInvoiceData:{},
            //当前选择订单明细
            checkoutCounterData: {},
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
            // Bus.$on('addInvoiceFunction', (data) => {
            //     this.addInvoiceData = data;
            //     this.addInvoiceFunction(0, data);
            //     console.log(12345);
            // });
            this.queryOrderList();
        },
        //弹层控制
        openModal(who){
            if(who == 'openTicket'){ // 开票新增

                Bus.$emit('openTicket');
            }else if(who == 'myModalRef'){ // 支付新增
                
                this.$refs.myModalRef.showModal();
            }
        },

        //查询订单详情
        queryOrderList(){
            if(!this.checkoutCounterFlag){
                return false;
            }
            this.checkoutCounterFlag = false;
            api.vehicleCleaning.getOrderInfoByCondition({
                orderNo: this.$route.query.orderNo
            }, (res) => {
                if(res.data.message == "success"){
                    this.detailMain = res.data.obj;
                    this.queryInvoiceList();
                    this.isCancelTrue = res.data.obj.isCancel == '0' ? true : false
                }
                this.checkoutCounterFlag = true;
            })
        },

        //查询发票明细
        queryInvoiceList(){
            if(!this.invoiceInfoFlag){
                return false;
            }
            this.invoiceInfoFlag = false;
            // console.log(this.detailMain);
            api.cardPay.queryCardRechargeInvoiceInfoNoPage({
                sourceOrderNo: this.detailMain.orderNo, //订单号
                sourceOrderTypeCode: ORDER_INVOICE, //业务类型
                storeCode: this.detailMain.storeCode//门店Code *
            }, (res) => {
                this.invoiceInfoFlag = true;
                if(res.data.message == "success"){
                    // console.log('查询发票明细', res.data.obj)
                    this.invoiceInfoTableData = res.data.obj;
                }
            });
        },
        //新增及删除发票明细
        addInvoiceFunction(type, data){
            if(type == 0){
                this.addInvoiceData = data;
            }
            if(this.addInvoiceData.id == undefined && type == 1){
                Message({ 
                    type: 'warning', 
                    message: this.addInvoiceData.length > 0 ? '请先选择一张要删除的发票' : '请先添加发票'
                });
                return false;
            }
            if(!this.invoiceInfoFlag){
                return false
            }
            this.invoiceInfoFlag = false;
            //提交发票接口参数
            let addInvoiceParameter = {
                    "bankName": '', //开户行名称
                    "bankAccount": '', //开户行账号
                    "companyAddress": '', //公司地址
                    //"createBy": "EMP2000472", //创建人编码
                    //"createOrgCode": "2000260", //创建人所属组织编码
                    //"createTime": 1528793881258, //创建时间
                    //"empToken": "429de3e5a2384f05a6f07f5fe4f66996",
                    "id": "", //新增不传 更新要传 比如删除
                    "invoiceAmount": '', //开票金额
                    "invoiceAmountExcludingTax": '', //去税金额【开票金额/(1+税率)】
                    "invoiceCode": '', //单据发票明细业务编码
                    "invoiceContentCode": "Order", //开票内容前缀编码
                    "invoiceContentDesc": '', //开票内容
                    "invoiceEmpCode": '', //开票员工编码
                    "invoiceNo": '', //发票号
                    "invoiceStatus": 0, //开票状态【0：已开票、1：已退票、-1：已作废】
                    "invoiceTime": '', //发票打印时间
                    "invoiceTitle": '', //发票抬头
                    "invoiceTypeCode": '', //发票类型编码【数据字典】
                    "invoiceTypeName": '', //发票类型名称【数据字典】
                    "isDeleted": '', //删除传1
                    "isSyncExternalSystem": 0, //是否同步外部系统【0：否、1：是】
                    "pageNums": 2,
                    "pageStart": 1,
                    "sourceOrderNo": '', //业务单据号
                    "sourceOrderTypeCode": '',//"OrderInvoice", //业务单类型编码
                    "storeCode": '', //门店编码
                    "taxAmount": '', //税金
                    "taxRegistrationNo": '' //纳税人识别号
                    //"updateBy": "EMP2000472", //编辑人编码
                    //"updateTime": 1528793881258 //编辑时间
                }
            for(let key in addInvoiceParameter){
                addInvoiceParameter[key] = this.addInvoiceData[key];
            }
            addInvoiceParameter.isDeleted = type;
            addInvoiceParameter.sourceOrderNo = this.detailMain.orderNo;
            addInvoiceParameter.sourceOrderTypeCode = this.detailMain.businessTypeCode;
            addInvoiceParameter.invoiceContentCode = 'Order';
            addInvoiceParameter.sourceOrderTypeCode = 'OrderInvoice';
            addInvoiceParameter.storeCode = this.detailMain.storeCode;
            addInvoiceParameter.isSyncExternalSystem = 0;
            if(type == 0){
                addInvoiceParameter.invoiceStatus = 0;
            }
            api.cardPay.editCardRechargeInvoiceInfo([addInvoiceParameter], (res) => {
                this.invoiceInfoFlag = true;
                if(res.data.message == "success"){
                    Message({
                        type: 'success', 
                        message: type == 1 ? '删除发票成功' : '新增发票成功'
                    });
                    this.queryOrderList();//查询订单详情
                }
            })
        },
    }
}
</script>
<style lang="css" scoped>
    .border-none {
        border: none !important;
    }
    .table-scrollable tr td {
        max-width: 150px !important;
        min-width: 150px !important;
    }
    .table-scrollable tr td:first-child {
        max-width: 50px !important;
        min-width: 50px !important;
    }
    .table-scrollable tr td:nth-child(2) {
        max-width: 80px !important;
        min-width: 80px !important;
    }
</style>


