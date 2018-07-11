<template>
    <div>
        <b-card header="对账核销单">
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <!--处理单号 生成 对应参数：reconciliationVerifyOrderNo-->
                    <b-form-fieldset horizontal label="处理单号" :label-cols="4" class="text-right">
                        <b-form-input v-model="verifiedStatementData.reconciliationVerifyOrderNo" :disabled="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--对账单类型 对应参数：reconciliationType-->
                    <b-form-fieldset horizontal label="对账单类型" :label-cols="4" class="text-right">
                        <b-form-input v-model="verifiedStatementData.reconciliationTypeName" :disabled="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--供货方 对应参数：supplierCode-->
                    <b-form-fieldset horizontal v-if="!verifiedStatementData.supplierCode == ''" label="供货方" :label-cols="4" class="text-right">
                        <b-form-input v-model="verifiedStatementData.supplierName" :disabled="true"/>
                    </b-form-fieldset>
                    <b-form-fieldset horizontal v-else label="供货方" :label-cols="4" class="text-right">
                        <b-form-input v-model="verifiedStatementData.storeName" :disabled="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--创建人 对应参数：暂无入参-->
                    <b-form-fieldset horizontal label="创建人" :label-cols="4" class="text-right">
                        <b-form-input v-model="verifiedStatementData.createName" :disabled="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--创建时间 对应参数：暂无入参-->
                    <b-form-fieldset horizontal label="创建时间" :label-cols="4" class="text-right">
                        <b-form-input v-model="verifiedStatementData.createTime" :disabled="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--应开票金额 对应参数：originalInvoiceAmount-->
                    <b-form-fieldset horizontal label="应开票金额" :label-cols="4" class="text-right">
                        <b-form-input :disabled="true" v-model="verifiedStatementData.originalInvoiceAmount" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--实开票金额 对应参数：actualInvoiceAmount-->
                    <b-form-fieldset horizontal label="实开票金额" :label-cols="4" class="text-right">
                        <b-form-input :disabled="true" v-model="verifiedStatementData.actualInvoiceAmount" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--付款总计金额 对应参数：totalPaymentAmount-->
                    <b-form-fieldset horizontal label="付款总计金额" :label-cols="4" class="text-right">
                        <b-form-input :disabled="true" v-model="verifiedStatementData.totalPaymentAmount" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--应付金额 对应参数：originalPaymentAmount-->
                    <b-form-fieldset horizontal label="应付金额" :label-cols="4" class="text-right">
                        <b-form-input :disabled="true" v-model="verifiedStatementData.originalPaymentAmount" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--应付金额 实付金额：actualPaymentAmount-->
                    <b-form-fieldset horizontal label="实付金额" :label-cols="4" class="text-right">
                        <b-form-input :disabled="true" v-model="verifiedStatementData.actualPaymentAmount" />
                    </b-form-fieldset>
                </div>
                    <div class="col-md-12">
                        <div class="pull-right">
                            <!--pageType【0：未生效，1：已提交，2：已生效，3：已完成，-1：已作废】-->
                            <b-button v-if="pageType == 1" @click="revocationStatement" class="btn-primary">撤回</b-button>
                            <b-button v-if="pageType == 3" class="btn-danger btn-secondary" @click="obsoleteStatement">作废</b-button>
                            <b-button v-if="pageType == 2" class="btn-primary" @click="ReconciliationCloseOrderInfo" :disabled="reconciliationCloseBtnType">核销完结</b-button>
                        </div>
                    </div>
            </div>
        </b-card>
        <b-card no-body>
            <b-tabs card>
                <b-tab title="对账明细" active>
                    <b-table striped hover bordered show-empty :items="statementTableData" :fields="statementTableFields">
                        <template slot="totalAmount" slot-scope="data">
                            {{data.item.totalAmount.toFixed(2)}}
                        </template>
                        <template slot="empty">
                            暂无数据...                  
                        </template>
                    </b-table>
                </b-tab>
                <b-tab title="发票明细">
                    <!--pageType【0：未生效，1：已提交，2：已生效，3：已完成，-1：已作废】-->
                    <div v-if="pageType == 2" class="row">
                        <div class="col-md-12">
                            <div class="pull-left">
                            <!--operation操作：0-只可删除 1-只可作废 2-只可红冲-->
                                <b-button class="btn-success" @click="newInvoice" size="sm">新增</b-button>
                                <b-button v-if="invoiceType == 2" class="btn-danger" size="sm" @click="deleteInvoice">红冲</b-button>
                                <b-button v-if="invoiceType == 1" class="btn-danger" size="sm" @click="deleteInvoice">作废</b-button>
                                <b-button v-if="invoiceType == 0" class="btn-danger" size="sm" @click="deleteInvoice">删除</b-button>
                            </div>
                        </div>
                    </div>
                    <div class="table-scrollable">
                        <b-table striped hover bordered show-empty ref="invoiceTable" :items="invoiceTableData" :fields="invoiceTableFields">
                            <template slot="selcet" slot-scope="data">
                                <input type="radio" :ref="'invoiceTableRadio' + data.index" name="invoiceTableRadio" :value="data.item.id" @click="checkInvoiceData(data.item.id, data.index)">
                            </template>
                            <template slot="invoiceAmount" slot-scope="data">
                                {{data.item.invoiceAmount.toFixed(2)}}
                            </template>
                            <template slot="invoiceRate" slot-scope="data">
                                {{(data.item.invoiceRate * 100) + '%'}}
                            </template>
                            <template slot="invoiceAmountExcludingTax" slot-scope="data">
                                {{data.item.invoiceAmountExcludingTax.toFixed(2)}}
                            </template>
                            <template slot="invoiceStatus" slot-scope="data">
                                {{invoiceTypeFunc(data.item.invoiceStatus)}}
                            </template>
                            <template slot="empty">
                                暂无数据...                  
                            </template>
                        </b-table>
                    </div>
                </b-tab>
                <b-tab title="付款明细">
                    <div v-if="pageType == 2" class="row">
                        <div class="col-md-12">
                            <div class="pull-left">
                                <b-button class="btn-success" @click="addPayDetailFunc" size="sm">新增</b-button>
                                <b-button class="btn-danger" @click="delPayDetailFunc" size="sm">删除</b-button>
                            </div>
                        </div>
                    </div>
                    <div class="table-scrollable">
                        <b-table striped hover bordered show-empty :items="payDetailTableData" :fields="payDetailFields">
                            <template slot="selcet" slot-scope="data">
                                <input type="radio" name="radio" @click="checkPayDetailData(data.item)">
                            </template>
                            <template slot="empty">
                                暂无数据...                  
                            </template>
                        </b-table>
                    </div>
                </b-tab>
                <b-tab title="审批履历">
                    <approval-record :orderNo="adjustOrderInfo.adjustOrderNo"></approval-record>
                </b-tab>
            </b-tabs>
        </b-card>
        <div class="row mt-2">
            <div class="col-md-12">
                <pagination class="pull-right" @page-change="pageChange" :page-no="pageData.pageNum" :page-size="pageData.pageSize" :total-result="pageData.total" :total-pages="pageData.pages">
                </pagination>
            </div>
        </div>
        <!-- 开票明细 - Modal -->
        <open-ticket ref="openTicket" :showInvoiceModal="showInvoiceModal"></open-ticket>
        <!--付款明细 - Modal -->
        <add-pay-detail ref="myModalRef" @surePay="addPayList" :userInfo='userInfo' :refCode="refCode"></add-pay-detail>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Message, MessageBox } from "element-ui";

    //内部组件
    import api from 'common/api'
    import config from 'common/config'
    import { RECONCILIATION_VERIFY, RECONCILIATION_VERIFY_ORDER, PAYMENTMODE_TYPE } from 'common/ref-code';
    import { RECONCILIATIONVERIFYPAYMENTSEQ } from 'common/sequence.js';
    import common from 'common/common';
    import pagination from "components/pagination/pagination.vue";
    import addPayDetail from "components/add-pay-detail";
    import ApprovalRecord from 'components/approval-record/approval-record';
    //私有组件
    import Bus from './bus/bus.js'
    import getStatement from './components/statementAccountTypes'
    import openTicket from './components/open-ticket'
    export default {
        components: {
            openTicket,
            getStatement,
            pagination,
            addPayDetail,
            ApprovalRecord
        },
        data() {
            return {
                pageType:'',
                submitNewInvoiceType: true,
                refCode:RECONCILIATIONVERIFYPAYMENTSEQ,
                //
                adjustOrderInfo:{
                    adjustOrderNo: this.$route.query.reconciliationVerifyOrderNo
                },
                userInfo: JSON.parse(common.getSession('userInfo')),
                //当前对账核销单基本信息
                curStatementMainInfo:{},
                //发票明细弹层所需
                showInvoiceModal: false,   // 解决异步props问题
                //提交信息
                verifiedStatementData:{
                    reconciliationVerifyOrderNo: this.$route.query.reconciliationVerifyOrderNo, //处理单号
                    reconciliationType: '', //对账单类型
                    reconciliationTypeName: '',//对账单名称
                    supplierCode: '', //供货方
                    supplierName: '',
                    createName:'',//创建人
                    createTime: '',//创建时间
                    originalInvoiceAmount: 0, //应开票金额
                    actualInvoiceAmount: 0, //实开票金额
                    totalPaymentAmount: 0, //付款总计金额
                    originalPaymentAmount: 0, //应付金额
                    actualPaymentAmount: 0, //实付金额
                    createBy:'',
                    updateBy:'',
                },
                //对账单明细表格数据
                statementTableData:[],
                statementTableFields:{
                    reconciliationOrderNo:{
                        label: '对账单号'
                    },
                    totalAmount:{
                        label: '对账总金额'
                    },
                    totalSkuCount:{
                        label: '对账总数量'
                    }
                },
                invoiceType:'',
                invoiceCheckBoxIndex:'',
                //发票明细数据
                invoiceTableData:[],
                //发票明细数据字段
                invoiceTableFields:{
                    selcet: {
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
                invoiceTableSelectId:'',
                invoiceTableSelectData:'',
                //当前选择付款明细数据
                curPayDetailData:'',
                //付款明细
                payDetailTableData:[],
                //付款明细数据字段
                payDetailFields:{
                    selcet: {
                        label: '选择'
                    },
                    paymentTypeName:{
                        label: '支付方式'
                    },
                    paymentAmount:{
                        label: '收款金额'
                    },
                    paymentTime:{
                        label: '收款日期'
                    },
                    paymentEmpName:{
                        label: '收款员'
                    },
                    paymentTransactionNo:{
                        label: '交易流水号'
                    }
                },
                //核销完结按钮状态
                reconciliationCloseBtnType: true,
                //分页对象
                pageData:{
                    total: 0,
                    totalPages: 1,
                    pageNo: 1,
                    pageSize: config.pageNums
                }
            }
        },
        mounted(){
            //发票信息填充
            Bus.$on('addInvoice', (data) => {
                console.log('发票信息添加点击完成');
                if(this.submitNewInvoiceType){
                    this.submitNewInvoiceType = false;
                }else{
                    return false;
                }
                this.submitNewInvoice(data);
            });
            this.initPage()
        },
        methods: {
            pageChange(){},
            initPage(){
                //查询基本信息
                this.queryReconciliationVerifyOrderInfoNoPage(() => {
                    //查询对账明细
                    this.queryReconciliationOrderInfos();
                    //查询发票明细
                    this.queryCardRechargeInvoiceInfoNoPage();
                    //查询付款明细
                    this.queryReconciliationVerifyPaymentInfoNoPage();
                })
            },
            /**查询信息
             */
            //查询基本信息
            queryReconciliationVerifyOrderInfoNoPage(callback){
                api.statementAccountCancel.queryReconciliationVerifyOrderInfoNoPage({
                        reconciliationVerifyOrderNo: this.verifiedStatementData.reconciliationVerifyOrderNo
                    }, (res) => {
                        if(res.data.code == "success"){
                            this.curStatementMainInfo = res.data.obj[0]
                            if(this.curStatementMainInfo.reconciliationType == 0){
                                this.verifiedStatementData.reconciliationTypeName =  '采购对账'
                            }else if(this.curStatementMainInfo.reconciliationType == 1){
                                this.verifiedStatementData.reconciliationTypeName =  '集团内部对账'
                            }
                            //金额获取
                            this.verifiedStatementData.originalInvoiceAmount = (this.curStatementMainInfo.originalInvoiceAmount - 0).toFixed(2);
                            this.verifiedStatementData.actualInvoiceAmount = (this.curStatementMainInfo.actualInvoiceAmount - 0).toFixed(2);
                            this.verifiedStatementData.totalPaymentAmount = (this.curStatementMainInfo.totalPaymentAmount - 0).toFixed(2);
                            this.verifiedStatementData.originalPaymentAmount = (this.curStatementMainInfo.originalPaymentAmount - 0).toFixed(2);
                            this.verifiedStatementData.actualPaymentAmount = (this.curStatementMainInfo.actualPaymentAmount - 0).toFixed(2);
                            //供应商
                            this.verifiedStatementData.supplierCode = this.curStatementMainInfo.supplierCode
                            this.verifiedStatementData.supplierName = this.curStatementMainInfo.supplierName

                            //门店
                            this.verifiedStatementData.storeCode = this.curStatementMainInfo.storeCode
                            this.verifiedStatementData.storeName = this.curStatementMainInfo.storeName
                            //创建人
                            this.verifiedStatementData.createName = res.data.obj[0].createName;
                            //创建时间
                            this.verifiedStatementData.createTime = res.data.obj[0].createTimeStr;
                            //核销单审批状态【0：未生效，1：已提交，2：已生效，3：已完成，-1：已作废】
                            if(this.$route.query.pageType == 5){
                                this.pageType = 5
                            }else{
                                this.pageType = this.curStatementMainInfo.orderStatus
                            }
                            //查询发票明细
                            if(callback){
                                callback()
                            }
                            this.reconciliationCheck();
                        }else{
                            Message({ 
                                type: 'warning', 
                                message: res.data.message
                            });
                        }
                    })
            },
            //查询对账明细
            queryReconciliationOrderInfos(){
                api.statementAccount.queryReconciliationOrderInfos({
                    reconciliationVerifyOrderNo: this.verifiedStatementData.reconciliationVerifyOrderNo
                }, (res) => {
                    if(res.data.code == "success"){
                        this.statementTableData = res.data.obj.list;
                        this.reconciliationCheck();
                        //this.treeCpu();//应开票金额,应付金额,付款总计 计算
                    }else{
                        Message({ 
                            type: 'warning', 
                            message: res.data.message
                        });
                    }
                })
            },
            //查询发票明细
            queryCardRechargeInvoiceInfoNoPage(){
                api.cardPay.queryCardRechargeInvoiceInfoNoPage({
                    sourceOrderNo: this.curStatementMainInfo.reconciliationVerifyOrderNo,
                    sourceOrderTypeName: RECONCILIATION_VERIFY_ORDER,
                    storeCode: this.userInfo.userAvailableInfo.storeInfoVo.storeCode//门店Code *
                }, (res) => {
                    if(res.data.message == 'success'){
                        this.invoiceTableData = res.data.obj
                        this.reconciliationCheck();
                        //实开票金额累加
                        //this.actualInvoiceAmountCpu();
                    }
                })
            },
            //查询付款明细
            queryReconciliationVerifyPaymentInfoNoPage(){
                api.statementAccountCancel.queryReconciliationVerifyPaymentInfoNoPage({
                    reconciliationVerifyOrderNo: this.verifiedStatementData.reconciliationVerifyOrderNo
                }, (res) => {
                    if(res.data.message == 'success'){
                        this.payDetailTableData = res.data.obj
                        this.reconciliationCheck();
                        //this.actualPaymentAmountCpu();//实付金额累加
                    }else{
                        Message({ 
                            type: 'warning', 
                            message: res.data.message
                        });
                    }
                });
            },
            closePage(){
                this.$router.push({
                    name:"statement-account-cancel-query"
                })
            },
            //撤回对账核销
            revocationStatement(){
                api.statementAccountCancel.withdrawReconciliationVerifyOrderInfo({
                    reconciliationVerifyOrderNo: this.verifiedStatementData.reconciliationVerifyOrderNo
                }, (res) => {
                    if(res.data.message == 'success'){
                        Message({ 
                            type: 'success', 
                            message: '撤销成功'
                        });
                        this.$router.push({
                            name:"statement-account-cancel-create",
                            query:{
                                reconciliationVerifyOrderNo:this.verifiedStatementData.reconciliationVerifyOrderNo,
                                pageType: 1
                            }
                        })
                    }else{
                        Message({ 
                            type: 'warning', 
                            message: res.data.message
                        });
                    }
                });
            },
            //新增开票
            newInvoice(){
                Bus.$emit('openTicket')
            },
            //发票状态过滤
            //<!--operation操作：0-已开票 1-已退票 -1-已作废-->
            invoiceTypeFunc(type){
                let result = '';
                switch(type){
                    case 0:
                        result = '已开票';
                        break;
                    case 1:
                        result = '已退票';
                        break;
                    case -1:
                        result = '已作废';
                        break;
                }
                return result;
            },
            //应开票金额,应付金额,付款总计 计算
            treeCpu(){
                let arr = 0;
                if(this.statementTableData.length > 0){
                    for(let i = 0; i < this.statementTableData.length; i ++){
                        arr += this.statementTableData[i].totalAmount;
                    }
                }
                this.verifiedStatementData.originalInvoiceAmount = arr.toFixed(2);//应开票金额
                this.verifiedStatementData.originalPaymentAmount = arr.toFixed(2);//应付金额
                this.verifiedStatementData.totalPaymentAmount = arr.toFixed(2);//付款总计
                this.reconciliationCheck();
                
            },
            //实际开票金额计算
            actualInvoiceAmountCpu(){
                let arr = 0;
                if(this.invoiceTableData.length > 0){
                    for(let i = 0; i < this.invoiceTableData.length; i ++){
                        arr += this.invoiceTableData[i].invoiceAmount
                    }
                }
                this.verifiedStatementData.actualInvoiceAmount = arr.toFixed(2);
                this.reconciliationCheck();
            },
            //实付金额 计算
            actualPaymentAmountCpu(){
                let arr = 0;
                if(this.payDetailTableData.length > 0){
                    for(let i = 0; i < this.payDetailTableData.length; i ++){
                        arr += this.payDetailTableData[i].paymentAmount
                    }
                }
                this.verifiedStatementData.actualPaymentAmount = arr.toFixed(2);
                this.reconciliationCheck();
            },
            //提交新增开票
            submitNewInvoice(data){
                //提交发票接口参数
                let invoiceAdd = [{
                        id: "", //数据库主键id *
                        invoiceCode: data.invoiceCode, //单据发票明细业务编码 *
                        sourceOrderTypeCode: RECONCILIATION_VERIFY_ORDER, //业务单类型编码【数据字典：卡销售单、卡充值单】 *
                        sourceOrderNo: this.verifiedStatementData.reconciliationVerifyOrderNo, //业务单据号 *
                        invoiceContentCode: RECONCILIATION_VERIFY, //开票内容前缀编码【数据字典：卡销售、卡充值等】 *
                        invoiceTypeCode:data.invoiceTypeCode, //发票类型编码【数据字典】 *
                        invoiceTypeName:data.invoiceTypeName, //发票类型名称【数据字典】 *
                        invoiceTitle:data.invoiceTitle, //发票抬头 *
                        invoiceAmount: data.invoiceAmount, //开票金额 *
                        invoiceAmountExcludingTax: data.invoiceAmountExcludingTax, //去税金额【开票金额/(1+税率)】 *
                        taxAmount: data.taxAmount, //税金 *
                        invoiceNo: data.invoiceNo, //发票号 *
                        invoiceEmpCode: "", //开票员工编码 *
                        invoiceStatus: 0, //开票状态【0：已开票、1：已退票、-1：已作废】 *
                        isSyncExternalSystem: 0,//是否同步外部系统【0：否、1：是】 *
                        invoiceTime: data.invoiceTime,
                        companyAddress: data.companyAddress,//公司地址
                        bankName: data.bankName,//开户行
                        taxRegistrationNo: data.taxRegistrationNo, //纳税人识别号
                        invoiceContentDesc: data.invoiceContentDesc,//开票内容
                        storeCode: this.userInfo.userAvailableInfo.storeInfoVo.storeCode//门店Code *
                    }]
                api.cardPay.editCardRechargeInvoiceInfo(invoiceAdd, (res) => {
                    if(res.data.message == "success"){
                        Message({ 
                            type: 'success', 
                            message: '新增发票成功'
                        });
                        this.initPage();
                    }
                    this.submitNewInvoiceType = true;
                })
            },
            //选择发票
            checkInvoiceData(id, index){
                let curItem = this.invoiceTableData.filter((data, index) => {
                    return data.id == id
                })
                this.invoiceTableSelectId = id;
                this.invoiceTableSelectData = curItem[0];
                this.invoiceType = curItem[0].operation;
                this.invoiceCheckBoxIndex = index;
            },
            //删除发票
            deleteInvoice(){
                if(this.invoiceTableSelectId != ''){
                    let option = [{
                        id: this.invoiceTableSelectId, //数据库主键id *
                        invoiceCode: this.invoiceTableSelectData.invoiceCode, //单据发票明细业务编码 *
                        sourceOrderTypeCode: RECONCILIATION_VERIFY_ORDER, //业务单类型编码【数据字典：卡销售单、卡充值单】 *
                        sourceOrderNo: this.verifiedStatementData.reconciliationVerifyOrderNo, //业务单据号 *
                        invoiceContentCode: RECONCILIATION_VERIFY, //开票内容前缀编码【数据字典：卡销售、卡充值等】 *
                        invoiceTypeCode: this.invoiceTableSelectData.invoiceTypeCode, //发票类型编码【数据字典】 *
                        invoiceTypeName: this.invoiceTableSelectData.invoiceTypeName, //发票类型名称【数据字典】 *
                        invoiceTitle: this.invoiceTableSelectData.invoiceTitle, //发票抬头 *
                        invoiceAmount: this.invoiceTableSelectData.invoiceAmount, //开票金额 *
                        invoiceAmountExcludingTax: this.invoiceTableSelectData.invoiceAmountExcludingTax, //去税金额【开票金额/(1+税率)】 *
                        taxAmount: this.invoiceTableSelectData.taxAmount, //税金 *
                        invoiceNo: this.invoiceTableSelectData.invoiceNo, //发票号 *
                        invoiceEmpCode: this.invoiceTableSelectData.invoiceEmpCode, //开票员工编码 *
                        invoiceStatus: this.invoiceTableSelectData.invoiceStatus, //开票状态【0：已开票、1：已退票、-1：已作废】 *
                        isSyncExternalSystem: this.invoiceTableSelectData.isSyncExternalSystem,//是否同步外部系统【0：否、1：是】 *
                        invoiceTime: this.invoiceTableSelectData.invoiceTime,
                        companyAddress: this.invoiceTableSelectData.companyAddress,//公司地址
                        bankName: this.invoiceTableSelectData.bankName,//开户行
                        taxRegistrationNo: this.invoiceTableSelectData.taxRegistrationNo, //纳税人识别号
                        invoiceContentDesc: this.invoiceTableSelectData.invoiceContentDesc,//开票内容
                        storeCode: this.userInfo.userAvailableInfo.storeInfoVo.storeCode//门店Code *
                    }]
                    if(this.invoiceType == 0){//只可删除
                        option[0].isDeleted = 1
                    }else if(this.invoiceType == 1){//只可作废
                        option[0].invoiceStatus = -1
                    }
                    api.cardPay.editCardRechargeInvoiceInfo(option, (res) => {
                        if(res.data.message == "success"){
                            this.initPage();
                            Message({ 
                                type: 'success', 
                                message: '发票删除成功'
                            });
                            this.$refs['invoiceTableRadio' + this.invoiceCheckBoxIndex].checked = false;
                        }else{
                            Message({ 
                                type: 'warning', 
                                message: res.data.message
                            });
                        }
                    })
                }else{
                    Message({ 
                        type: 'warning', 
                        message: '请选择要删除的发票!'
                    });
                }
            },
            //新增付款明细
            addPayList(data){
                let option = [{
                        id: "", //数据库主键id *
                        paymentCode: data.paymentCode, //支付流水业务编码 *
                        paymentTransactionNo: data.paymentTransactionNo, //支付流水号
                        reconciliationVerifyOrderNo: this.curStatementMainInfo.reconciliationVerifyOrderNo, //对账核销单号 *
                        paymentTypeCode: data.paymentTypeCode, //支付方式编码【数据字典】 *
                        paymentAmount: data.paymentAmount, //收款金额 *
                        paymentEmpCode: data.paymentEmpCode, //收款员工编码 *
                        paymentTime: data.paymentTime //收款日期 *
                    }];
                api.statementAccountCancel.editReconciliationVerifyPaymentInfo(option, (res) => {
                    if(res.data.code == 'success'){
                        Message({ 
                            type: 'success', 
                            message: '添加付款明细成功'
                        });
                        this.initPage();
                    }
                })
            },
            //选择付款明细
            checkPayDetailData(data){
                this.curPayDetailData = data;
            },
            //删除付款明细
            delPayDetailFunc(){
                if(this.curPayDetailData == ''){
                    Message({ 
                        type: 'warning', 
                        message: '请选择要删除的付款明细'
                    });
                    return false;
                }
                this.curPayDetailData.isDeleted = 1
                let option = [];
                    option.push(this.curPayDetailData)
                api.statementAccountCancel.editReconciliationVerifyPaymentInfo(option, (res) => {
                    if(res.data.code == 'success'){
                        Message({ 
                            type: 'success', 
                            message: '删除付款明细成功'
                        });
                        this.initPage();
                    }
                })
            },
            //新增付款明细
            addPayDetailFunc(){
                this.$refs.myModalRef.showModal()
            },
            //作废
            obsoleteStatement(){
                MessageBox.confirm('作废后不可逆操作，确认作废吗',{
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				          }).then(()=>{
                            api.statementAccountCancel.cancelReconciliationVerifyOrderInfo({
                                reconciliationVerifyOrderNo:this.verifiedStatementData.reconciliationVerifyOrderNo
                            }, (res) => {
                                if(res.data.code == "success"){
                                    Message({ 
                                        type: 'success', 
                                        message: '对账核销单作废成功'
                                    });
                                    this.pageType = 4;
                                    this.initPage()
                                }
                            })
                })
            },
            //核销完结验证
            reconciliationCheck(){
                let result = true;
                if(this.invoiceTableData.length <= 0){
                    result = false;
                }
                if(this.payDetailTableData.length <= 0){
                    result = false;
                }

                if(!(this.verifiedStatementData.actualInvoiceAmount == this.verifiedStatementData.originalInvoiceAmount)){
                    result = false;
                }
                if(!(this.verifiedStatementData.actualPaymentAmount >= this.verifiedStatementData.actualInvoiceAmount)){
                    result = false;
                }

                if(result){
                    this.reconciliationCloseBtnType = false;
                }else{
                    this.reconciliationCloseBtnType = true;
                }
                
            },
            //核销完结
            ReconciliationCloseOrderInfo(){
                MessageBox.confirm('核销后不可逆操作，确认核销吗',{
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				          }).then(()=>{
                            let option = {
                                reconciliationVerifyOrderNo: this.verifiedStatementData.reconciliationVerifyOrderNo
                            }
                            api.statementAccountCancel.ReconciliationCloseOrderInfo(option, (res) => {
                                Message({
                                    type: 'success', 
                                    message: '核销成功'
                                });
                                this.pageType = 3;
                            })
                })
            }
        }
    }
</script>


