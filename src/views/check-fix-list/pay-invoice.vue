<template>
    <div>
        <!-- <b-card header="支付要显示实付多少，应付多少"></b-card> -->
        <b-card header="订单开票明细">
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
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
        <b-card header="订单支付明细">
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                    <!--addInvoiceFunction 传参: 新增:0 删除: 1-->
                        <b-button class="btn-success" @click="openModal('myModalRef')" size="sm">新增</b-button>
                        <b-button class="btn-danger" @click="deletePayFunction()" size="sm">删除</b-button>
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="payInfoTableData" :fields="payInfoTableFields">
                    <template slot="select" slot-scope="data">
                        <p class="text-center mb0">
                            <input type="radio" v-model="payInfoData" :value="data.item" />
                        </p>
                    </template>
                    <template slot="empty">
                        暂无数据...                  
                    </template>
                </b-table>
            </div>
        </b-card>
        <!-- 开票明细 - Modal -->
        <open-ticket ref="openTicket" :showInvoiceModal="showInvoiceModal"></open-ticket>
        <!--付款明细 - Modal -->
        <add-pay-detail ref="myModalRef" @surePay="addPayFunction" :userInfo='userInfo' :refCode="refCode"></add-pay-detail>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Message, DatePicker} from "element-ui";
    import { formatDate, getType } from 'common/api-common';
    //内部组件
    import addPayDetail from "components/add-pay-detail";
    import openTicket from './open-ticket.vue';
    import Bus from './bus/bus.js'
    import api from 'common/api'
    import common from 'common/common';
    import { ORDERPAYMENTSEQ } from 'common/sequence.js';
    import {ORDER_INVOICE, ORDER_BUSINESS_TYPE} from 'common/ref-code'
    Vue.use(DatePicker)
    export default {
        components: {
            DatePicker,
            addPayDetail,
            openTicket
        },
        data () {
            return {
                //不知何用的属性(支付组件需要)
                showInvoiceModal: false,
                //获取用户信息(支付组件需要)
                userInfo: JSON.parse(common.getSession('userInfo')),
                //业务编码(支付组件需要)
                refCode: ORDERPAYMENTSEQ,
                //当前选择订单明细
                checkoutCounterData: {},
                closingFlagOptions: [
                    {text: '未交车', value: 0},
                    {text: '已交车', value: 1}
                ], //订单状态主状态select对应option数据
                orderStatusChildOptions: [ //订单状态子选项子状态select对应option数据
                    {text: '待处理', value: 0}, 
                    {text: '处理中', value: 1},
                    {text: '待结算', value: 9},
                    {text: '已结算', value: 10},
                    {text: '已作废', value: -1}
                ],
                paymentStatusOptions: [ //支付状态主状态select对应option数据
                    {text: '未支付', value: 0}, 
                    {text: '已支付', value: 1}
                ],
                invoiceStatusTypeOptions: [ //是否开票主状态select对应option数据: openInvoiceTypeOptions
                    {text: '未开票', value: 0}, 
                    {text: '已开票', value: 1}
                ],
                orderSourceOptions: [ //订单来源selcet option数据
                    {text: '门店散客', value: 0},
                    {text: '售后预约', value: 1},
                    {text: '销售预约', value: 2},
                    {text: '客服预约', value: 3}
                ],
                orderOperationOptions: [], //订单业务类型selcet option数据
                checkoutCounterTableData: [],
                
                //结算订单表格字段
                checkoutCounterTableFields:{
                    select:{
                        label: '选择'
                    },
                    businessTypeName:{
                        label: '订单业务类型'
                    },
                    orderNo:{
                        label: '订单号'
                    },
                    orderStatus:{
                        label: '订单状态'
                    },
                    storeName:{
                        label: '门店名称'
                    },
                    createBy:{
                        label: '开单人'
                    },
                    custName:{
                        label: '客户姓名'
                    },
                    custTypeName:{
                        label: '客户类型'
                    },
                    custMobile:{
                        label: '手机'
                    },
                    custPlates:{
                        label: '车牌'
                    },
                    carModelName:{
                        label: '车型'
                    },
                    actualTotalPrice:{
                        label: '订单金额'
                    },
                    paymentStatus:{
                        label: '支付状态'
                    },
                    invoiceStatus:{
                        label: '是否开票'
                    },
                    createTime:{
                        label: '订单创建时间'
                    },
                    closingDate:{
                        label: '订单结算时间'
                    },
                    orderSourceType:{
                        label: '订单来源'
                    },
                    orderSourceNumber:{
                        label: '订单来源单号'
                    },
                    //临时加的，字段不确定
                    checkssd: {
                        label: '检查单'
                    },
                },
                //跳转到收银开票应该携带的参数
                queryParameter:{
                    cardNo: '', //使用的卡号
                    closingDate: '', //订单结算时间
                    closingFlag: '', //订单状态 = 交车标识符【0：未交车  1：已交车】
                    couponNo: '', //使用的券号
                    createBy: '', //开单人
                    createTime: '', //订单创建时间
                    custMobile: '', //客户手机号
                    custName: '', //客户姓名
                    custPlates: '', //车牌
                    orderTypeCode: '', //订单业务类型
                    orderSourceType: '', //订单来源【0：门店散客、1：售后预约、2：销售预约、3：客服预约】
                    orderSourceNumber: '', //订单来源单号??
                    orderNo: '', //订单号
                    orderStatus:'', //订单子状态 【0：待处理、1：处理中、9：待结算、10：已结算、-1：已作废】
                    includeType: '', //包含零时车牌？？
                    invoiceStatus: '', //开票状态【0：未开票、1：已开票】
                    paymentStatus: '', //支付状态【0：未支付、1：已支付】
                    vinNo: '' //VIN
                },
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
                //添加发票信息
                addInvoiceData:{},
                //发票请求FLAG
                invoiceInfoFlag: true,

                //支付明细表格数据
                payInfoTableData:[],
                payInfoTableFields:{
                    select: {
                        label: '选择'
                    },
                    paymentTypeName:{
                        label: '支付方式'
                    },
                    moneyPrice:{
                        label: '收款金额'
                    },
                    updateTimeStr:{
                        label: '收款日期'
                    },
                    paymentEmpName:{
                        label: '收款员'
                    },
                    paymentTransactionNo:{
                        label: '交易流水号'
                    }
                },
                //当前选择的支付明细信息
                payInfoData:{},
                //支付请求FLAG
                payInfoFlag: true,
            }
        },
        created () { // data ：checkoutCounterData
            let rq = this.$route.query.orderNo || ''
            this.checkoutCounterData.orderNo = rq
            api.repairOrder.queryAllOrderInfo({orderNo: rq}, (res)=>{
                if(res.data.message == "success"){
                    this.checkoutCounterData = res.data.obj;
                    this.queryInvoiceList();//查询发票明细
                    this.queryPayList() //查询支付明细
                }
            })
            this.initPage()
        },
        mounted () {
        },
        methods: {
            //页面初始化
            initPage(){
                Bus.$on('addInvoice', (data) => {
                    this.addInvoiceData = data;
                    this.addInvoiceFunction(0);
                });
                getType(ORDER_BUSINESS_TYPE, (res) => {
                    if(res.length > 0){
                        this.orderOperationOptions = [];
                        for(let i = 0; i < res.length; i ++){
                            this.orderOperationOptions.push({
                                text: res[i].refDetailName,
                                value: res[i].refCode
                            })
                        }
                    }
                });
            },
            /*发票明细相关 */
            //查询发票明细
            queryInvoiceList(){
                if(!this.invoiceInfoFlag){
                    return false;
                }
                this.invoiceInfoFlag = false;
                api.cardPay.queryCardRechargeInvoiceInfoNoPage({
                    sourceOrderNo: this.checkoutCounterData.orderNo, //订单号
                    sourceOrderTypeCode: ORDER_INVOICE, //业务类型
                    storeCode: this.checkoutCounterData.storeCode//门店Code *
                }, (res) => {
                    this.invoiceInfoFlag = true;
                    if(res.data.message == "success"){
                        // console.log('查询发票明细', res.data.obj)
                        this.invoiceInfoTableData = res.data.obj;
                    }
                });
            },
            //弹层控制
            openModal(who){
                // if(!this.checkoutCounterData){
                //     Message({ 
                //         type: 'warning',
                //         message: '信息出错，请返回重试'
                //     });
                //     return false;
                // }
                if(who == 'openTicket'){ // 开票新增

                    Bus.$emit('openTicket');
                }else if(who == 'myModalRef'){ // 支付新增
                    
                    this.$refs.myModalRef.showModal();
                }
                
            },
            //查询支付明细
            queryPayList(){
                api.repairOrder.queryOrderPaymentInfoNoPage({
                    sourceOrderNo: this.checkoutCounterData.orderNo
                }, (res) => {
                    if(res.data.message == "success"){
                        this.payInfoTableData = res.data.obj;
                    }
                });
            },
            //新增及删除发票明细
            addInvoiceFunction(type){
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
                addInvoiceParameter.sourceOrderNo = this.checkoutCounterData.orderNo;
                addInvoiceParameter.sourceOrderTypeCode = this.checkoutCounterData.businessTypeCode;
                addInvoiceParameter.invoiceContentCode = 'Order';
                addInvoiceParameter.sourceOrderTypeCode = 'OrderInvoice';
                addInvoiceParameter.storeCode = this.checkoutCounterData.storeCode;
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
                        this.queryInvoiceList();//查询发票明细
                    }
                })
            },
            //新增支付明细
            addPayFunction(data){
                let option = {
                    paymentCode: data.paymentCode, //支付流水业务编码
                    paymentTypeCode: data.paymentTypeCode, //支付方式编码【数据字典】
                    storeCode: this.checkoutCounterData.storeCode, //门店编码
                    paymentTransactionNo: data.paymentTransactionNo, //支付流水号
                    moneyPrice: data.paymentAmount,//实际金额
                    applyCode: this.checkoutCounterData.orderNo, //订单号
                    //createBy: , //创建人
                }
                if(!this.payInfoFlag){
                    return false;
                }
                this.payInfoFlag = false;
                api.repairOrder.insertOrderPaymentInfo(option, (res) => {
                    if(res.data.message == 'success'){
                        Message({ 
                            type: 'success', 
                            message: '新增支付明细成功'
                        });
                        this.payInfoFlag = true;
                        this.queryPayList();
                    }
                })
            },
            //删除支付明细
            deletePayFunction(){
                if(this.payInfoTableData.length <= 0){
                    Message({ 
                        type: 'warning', 
                        message: '请先添加一条支付明细'
                    });
                    return false;
                }
                if(this.payInfoData.id == undefined){
                    Message({ 
                        type: 'warning', 
                        message: '请先选择一条支付明细'
                    });
                    return false;
                }
                if(!this.payInfoFlag){
                    return false;
                }
                this.payInfoFlag = false;
                this.payInfoData.isDeleted = 1;
                api.repairOrder.updateOrderPaymentInfo(this.payInfoData, (res) => {
                    if(res.data.message == 'success'){
                        Message({ 
                            type: 'success', 
                            message: '删除支付明细成功'
                        });
                        this.payInfoData = {};
                        this.payInfoFlag = true;
                        this.queryPayList();
                    }
                });
            }
        }
    }
</script>
<style>
.bgChange input{
    color: #EDF1F7 !important;
}
</style>


