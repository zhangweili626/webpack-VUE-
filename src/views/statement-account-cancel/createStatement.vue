<template>
    <div>
        <b-card header="新建对账核销单">
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <!--处理单号 生成 对应参数：reconciliationVerifyOrderNo-->
                    <b-form-fieldset horizontal label="处理单号" :label-cols="4" class="text-right">
                        <b-form-input :disabled="true" v-model="createStatementData.reconciliationVerifyOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--对账单类型 对应参数：reconciliationType-->
                    <get-statement ref="getStatement"></get-statement>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--供货方 对应参数：supplierCode-->
                    <scp v-if="createStatementData.reconciliationType == 0" ref="scp"></scp>
                    <store v-else ref="createStore"></store>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--创建人 对应参数：暂无入参-->
                    <b-form-fieldset horizontal label="创建人" :label-cols="4" class="text-right">
                        <b-form-input v-model="createStatementData.createName" :disabled="true" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--创建时间 对应参数：暂无入参-->
                    <b-form-fieldset horizontal label="创建时间" :label-cols="4" class="text-right">
                        <b-form-input v-model="createStatementData.createTime" :disabled="true" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--应开票金额 对应参数：originalInvoiceAmount-->
                    <b-form-fieldset horizontal label="应开票金额" :label-cols="4" class="text-right">
                        <b-form-input v-model="createStatementData.originalInvoiceAmount" :disabled="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--实开票金额 对应参数：actualInvoiceAmount-->
                    <b-form-fieldset horizontal label="实开票金额" :label-cols="4" class="text-right">
                        <b-form-input v-model="createStatementData.actualInvoiceAmount" :disabled="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--付款总计金额 对应参数：actualInvoiceAmount-->
                    <b-form-fieldset horizontal label="付款总计金额" :label-cols="4" class="text-right">
                        <b-form-input v-model="createStatementData.totalPaymentAmount" :disabled="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--应付金额 对应参数：originalPaymentAmount-->
                    <b-form-fieldset horizontal label="应付金额" :label-cols="4" class="text-right">
                        <b-form-input v-model="createStatementData.originalPaymentAmount" :disabled="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--应付金额 实付金额：actualPaymentAmount-->
                    <b-form-fieldset horizontal label="实付金额" :label-cols="4" class="text-right">
                        <b-form-input v-model="createStatementData.actualPaymentAmount" :disabled="true"/>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button @click="closePage">取消</b-button>
                        <b-button v-if="submitType" class="btn-danger btn-secondary" @click="obsoleteStatement">作废</b-button>
                        <b-button class="btn-primary" @click="saveStatement">保存</b-button>
                        <b-button v-if="submitType" class="btn-primary" @click="submitStatement">提交</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button class="btn-success" size="sm" @click="addReconcile('new')" variant="primary">新增</b-button>
                        <b-button class="btn-danger" size="sm" @click="delteteReconcilationTableData">删除</b-button>
                    </div>
                </div>
            </div>
            <!--对账单号明细-->
            <div class="table-scrollable">
            <b-table striped hover bordered show-empty :items="curSelectReconciliation" :fields="reconciliationFields">
                <template slot="selcet" slot-scope="data">
                    <b-form-checkbox v-model="reconciliationTableSelect" :indeterminate.sync="indeterminate" :value="data.item"></b-form-checkbox>
                </template>
                <template slot="totalAmount" slot-scope="data">
                    {{data.item.totalAmount.toFixed(2)}}
                </template>
                <template slot="updateTimeStr" slot-scope="data">
                    <span v-if="!data.item.inStatus == 0">{{data.item.updateTimeStr}}</span>
                </template>
                <template slot="empty">
                    暂无数据...                  
                </template>
            </b-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="pageChange" :page-no="pageData.pageNum" :page-size="pageData.pageSize" :total-result="pageData.total" :total-pages="pageData.pages">
                 </pagination>
               </div>
            </div>
        </b-card>
        <!--新增对账明细 弹层-->
        <b-modal v-model="reconcileModal" size="lg" ref="reconcileModal" title="新增对账明细">
            <b-card header="新增">
                <div class="row">
                    <div class="col-md-6">
                        <!--处理单号 生成 对应参数：reconciliationVerifyOrderNo-->
                        <b-form-fieldset horizontal label="对账单类型" :label-cols="4" class="text-right">
                            <b-form-input v-model="createStatementData.reconciliationTypeName"  :disabled="true"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <!--供货方 生成 对应参数：supplierName-->
                        <b-form-fieldset horizontal label="供货方"  v-if="createStatementData.reconciliationType == 0" :label-cols="4" class="text-right">
                            <b-form-input v-model="createStatementData.supplierName" :disabled="true"/>
                        </b-form-fieldset>
                        <!--门店 生成 对应参数: storeCode-->
                        <b-form-fieldset horizontal label="门店"  v-else :label-cols="4" class="text-right">
                            <b-form-input v-model="createStatementData.storeName" :disabled="true"/>
                        </b-form-fieldset>
                    </div>
                </div>
            </b-card>
            <div id="createStatementTableScrollable" class="table-scrollable" @scroll="onScroll($event)">
                <b-table striped hover :fields="reconciliationFields" :items="reconcileModalData" >
                    <template slot="selcet" slot-scope="data">
                        <b-form-checkbox v-model="selected" :indeterminate.sync="indeterminate" :value="data.item"></b-form-checkbox>
                    </template>
                </b-table>
            </div>
            <div slot="modal-footer" class="w-100">
                <b-btn size="sm" class="btn-primary" @click="createReconcile">生成</b-btn>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Message} from "element-ui";
    
    //公用组件
    import api from 'common/api'
    import config from 'common/config'
    import pagination from "components/pagination/pagination.vue";
    //私有组件
    import Bus from './bus/bus.js'
    import getStatement from './components/statementAccountTypes'
    import scp from './components/supplier-cp'
    import store from './components/store'
    export default {
        components: {
            pagination,
            getStatement,
            scp,
            store
        },
        data() {
            return {
                createType: false,
                submitType:false,
                pageTypeForSave:false,
                selected:[],
                curSelectReconciliation:[],
                indeterminate: false,
                reconcileModal: false,//添加对账明细弹窗
                reconcileModalData: [], //添加对账明细弹窗列表数据
                //对账单明细查询接口FLAG
                addReconcileFlag: true,
                //提交信息
                createStatementData:{
                    id:'',
                    reconciliationVerifyOrderNo: this.$route.query.reconciliationVerifyOrderNo, //处理单号
                    reconciliationType: '', //对账单类型
                    reconciliationTypeName: '',
                    supplierCode: '', //供货方
                    createName: '',//创建人
                    createTime: '',//创建时间
                    orderStatus:'',
                    storeCode:'',
                    invoiceStatus:0, //开票状态
                    paymentStatus: 0, //登记状态
                    originalInvoiceAmount: 0, //应开票金额
                    actualInvoiceAmount: 0, //实开票金额
                    totalPaymentAmount: 0, //付款总计金额
                    originalPaymentAmount: 0, //应付金额
                    actualPaymentAmount: 0, //实付金额
                    supplierName:''
                },
                reconciliationTableSelect:[],
                reconciliationFields: { //新增 - 对账明细表格字段
                    selcet: {
                        label: '选择'
                    },
                    reconciliationOrderNo:{ //对账单号
                        label: '对账单号'
                    },
                    totalAmount:{ //对账总金额
                        label: '对账总金额'
                    },
                    totalSkuCount:{ //对账总数量
                        label: '对账总数量'
                    }
                },
                //分页对象
                pageData:{
                    pageNums: config.pageNums,
                    pageStart: 1
                },
                lastPage: 0
            }
        },
        watch:{
            'createStatementData.reconciliationType'(val, oldVal){
                if(val == 1){
                    this.createStatementData.supplierCode = '';
                    this.createStatementData.supplierName = '';
                }else{
                    this.createStatementData.storeName = '';
                    this.createStatementData.storeCode = '';
                }
            }
        },
        created(){
            if(this.$route.query.pageType == 0){
                this.submitType = true;
                this.pageTypeForSave = true;
                this.initPageData();
            }else if(this.$route.query.pageType == 'create'){
                this.createType = true;
                this.initPageData()
            }else{
                this.initPageData()
            }
        },
        methods: {
            //BUS时间列队
            BusOnFunc(){
                //获取门店方法
                Bus.$on('getStoreVal', (data) => {
                    this.createStatementData.storeName = data.text;
                    this.createStatementData.storeCode = data.value;
                });
                //供应商组件
                Bus.$on('supplier', (data) => {
                    this.createStatementData.supplierName = data.supplierName
                    this.createStatementData.supplierCode = data.supplierCode
                });

                //获取对账单类型
                Bus.$on('reconciliationType', (obj) => {
                    this.createStatementData.reconciliationType = obj.value;
                    this.createStatementData.reconciliationTypeName = obj.text;
                });
            },
            //滚动到最下方加载
            onScroll(event) {
                let _scrollTop = event.target.scrollTop;
                let _offsetHeight = event.target.offsetHeight;
                let _scrollHeight = event.target.scrollHeight;
                if (_scrollTop + _offsetHeight >= _scrollHeight) {
                    if (this.lastPage > this.pageData.pageStart) {
                        this.pageData.pageStart ++
                        if(this.addReconcileFlag){
                            this.addReconcileFlag = false;
                            this.addReconcile();
                        }
                    }
                }
            },
            closePage(){
                this.$router.push({
                    name:"statement-account-cancel-query"
                })
            },
            //应开票金额,应付金额,付款总计 计算
            treeCpu(){
                let arr = 0 - 0;
                if(this.curSelectReconciliation.length > 0){
                    for(let i = 0; i < this.curSelectReconciliation.length; i ++){
                        arr += (this.curSelectReconciliation[i].totalAmount - 0);
                    }
                }
                this.createStatementData.originalInvoiceAmount = arr.toFixed(2);//应开票金额
                this.createStatementData.originalPaymentAmount = arr.toFixed(2);//应付金额
                this.createStatementData.totalPaymentAmount = arr.toFixed(2);//付款总计
                
            },
            //作废
            obsoleteStatement(){
                api.statementAccountCancel.cancelReconciliationVerifyOrderInfo({
                    reconciliationVerifyOrderNo:this.createStatementData.reconciliationVerifyOrderNo
                }, (res) => {
                    if(res.data.code == "success"){
                        Message({ 
                            type: 'success', 
                            message: '对账核销单作废成功'
                        });
                        this.closePage();
                    }
                })
            },
            //查询基础信息
            queryInfoGet(){
                api.statementAccountCancel.queryReconciliationVerifyOrderInfos({
                    reconciliationVerifyOrderNo:this.createStatementData.reconciliationVerifyOrderNo
                }, (res) => {
                    if(res.data.code == "success"){
                        this.createStatementData.id = res.data.obj.list[0].id;
                        this.createStatementData.orderStatus = res.data.obj.list[0].orderStatus;
                        this.createStatementData.supplierCode = res.data.obj.list[0].supplierCode;
                        this.createStatementData.supplierName = res.data.obj.list[0].supplierName;
                        this.createStatementData.storeCode = res.data.obj.list[0].storeCode;
                        this.createStatementData.storeName = res.data.obj.list[0].storeName;
                        this.createStatementData.createName = res.data.obj.list[0].createName;
                        this.createStatementData.createTime = res.data.obj.list[0].createTimeStr;
                        this.createStatementData.originalInvoiceAmount = res.data.obj.list[0].originalInvoiceAmount.toFixed(2);
                        this.createStatementData.actualInvoiceAmount = res.data.obj.list[0].actualInvoiceAmount.toFixed(2);
                        this.createStatementData.totalPaymentAmount = res.data.obj.list[0].totalPaymentAmount.toFixed(2);
                        this.createStatementData.originalPaymentAmount = res.data.obj.list[0].originalPaymentAmount.toFixed(2);
                        this.createStatementData.actualPaymentAmount = res.data.obj.list[0].actualPaymentAmount.toFixed(2);
                        this.queryReconciliationOrderInfoNoPage();
                    }
                });
            },
            //查询对账单明细
            queryReconciliationOrderInfoNoPage(){
                 //查询对账单明细
                api.statementAccount.queryReconciliationOrderInfoNoPage({
                    reconciliationVerifyOrderNo:this.createStatementData.reconciliationVerifyOrderNo
                }, (res) => {
                    if(res.data.code == "success"){
                        this.curSelectReconciliation = res.data.obj
                        this.selected = this.curSelectReconciliation;
                        this.submitType = true;
                        this.pageTypeForSave = true;
                        //this.treeCpu();//应开票金额,应付金额,付款总计 计算
                    }
                })
            },
            //更新草稿
            initPageData(){
                this.BusOnFunc();
                //基础查询信息获取
                api.statementAccountCancel.queryReconciliationVerifyOrderInfos({
                    reconciliationVerifyOrderNo:this.createStatementData.reconciliationVerifyOrderNo
                }, (res) => {
                    if(res.data.code == "success"){
                        //判断是否是新建对账核销单
                        if(res.data.obj.list.length > 0 && res.data.obj.list[0].orderStatus != 1 && res.data.obj.list[0].orderStatus != 0){
                            this.$router.push({
                                name:"statement-account-cancel-edit",
                                query:{
                                    reconciliationVerifyOrderNo:this.createStatementData.reconciliationVerifyOrderNo,
                                    pageType: res.data.obj.list[0].orderStatus
                                }
                            })
                        }else{//判断对账核销单已保存，更新一下信息
                            if(res.data.obj.list.length > 0){
                                this.createStatementData.id = res.data.obj.list[0].id;
                                this.createStatementData.orderStatus = res.data.obj.list[0].orderStatus;
                                this.createStatementData.supplierCode = res.data.obj.list[0].supplierCode;
                                this.createStatementData.supplierName = res.data.obj.list[0].supplierName;
                                this.createStatementData.storeCode = res.data.obj.list[0].storeCode;
                                this.createStatementData.storeName = res.data.obj.list[0].storeName;
                                this.createStatementData.createName = res.data.obj.list[0].createName;
                                this.createStatementData.createTime = res.data.obj.list[0].createTimeStr;
                                this.createStatementData.reconciliationType = res.data.obj.list[0].reconciliationType;
                                this.createStatementData.originalInvoiceAmount = res.data.obj.list[0].originalInvoiceAmount;
                                this.createStatementData.actualInvoiceAmount = res.data.obj.list[0].actualInvoiceAmount;
                                this.createStatementData.totalPaymentAmount = res.data.obj.list[0].totalPaymentAmount;
                                this.createStatementData.originalPaymentAmount = res.data.obj.list[0].originalPaymentAmount;
                                this.createStatementData.actualPaymentAmount = res.data.obj.list[0].actualPaymentAmount;
                                setTimeout(() => {
                                    Bus.$emit('statementDisabled');
                                    Bus.$emit('disabledSup', '供货方');
                                    Bus.$emit('disabledStroe', '供货方');
                                }, 0);
                            }else{
                                this.createType = true;
                            }
                            setTimeout(() => {
                                Bus.$emit('setStoreValue', this.createStatementData.storeName);
                            }, 0);
                            setTimeout(() => {
                                Bus.$emit('setReconciliationTypeValue', this.createStatementData.reconciliationType);
                            }, 0);
                            setTimeout(() => {
                                Bus.$emit('setSupplierCodeValue', this.createStatementData.supplierName);
                            }, 0);
                            //查询对账单明细
                            this.queryReconciliationOrderInfoNoPage();
                        }
                    }
                })
            },
            //新增对账明细(查询对账单列表)
            addReconcile(type){
                if(!this.checkoutData()){
                    return false;
                }
                this.$refs.reconcileModal.show()
                if(type == 'new' && this.reconcileModalData.length > 0){
                    this.pageData.pageNums = config.pageNums;
                    this.pageData.pageStart = 1;
                    this.reconcileModalData = '';
                    this.reconcileModalData = [];
                }
                let option = {
                    reconciliationType: this.createStatementData.reconciliationType,
                    supplierCode: this.createStatementData.supplierCode,
                    storeCode: this.createStatementData.storeCode,
                    isNotReconciliationStatus: 1,
                    pageNums: this.pageData.pageNums,
                    pageStart: this.pageData.pageStart,
                    reconciliationStatus: 1
                }
                api.statementAccount.queryReconciliationOrderInfos(option, (res) => {
                    if(res.data.code == "success"){
                        this.lastPage = res.data.obj.pages;
                        //添加
                        for(let i = 0; i < res.data.obj.list.length; i ++){
                            this.reconcileModalData.push(res.data.obj.list[i])
                        }
                        this.addReconcileFlag = true;
                    }else{
                        Message({ 
                            type: 'warning', 
                            message: res.data.message
                        });
                    }
                })
            },
            //生成对账明细
            createReconcile(){
                //计算金额
                if(this.selected.length > 0){
                    this.reconcileModal = false;
                    this.curSelectReconciliation = this.selected;
                    this.saveStatement();
                }else{
                    //错误信息
                    Message({ 
                        type: 'warning', 
                        message: '请选择一条对账单!'
                    });
                }
            },
            //删除对账明细
            delteteReconcilationTableData(){
                if(this.reconciliationTableSelect.length <= 0){
                    //错误信息
                    Message({ 
                        type: 'warning', 
                        message: '请选择一条对账明细!'
                    });
                    return false;
                }

                let arr = this.reconciliationTableSelect,
                    option = this.reconciliationTableSelect[0];
                    option.deleteIds = [];
                    delete option.reconciliationVerifyOrderNo;
                    //option.reconciliationVerifyOrderNo = ''
                    option.reconciliationTime = '';
                    //option.reconciliationTime = 
                for(let i = 0; i < this.reconciliationTableSelect.length; i ++){
                    option.deleteIds.push(this.reconciliationTableSelect[i].id)
                }

                api.statementAccount.updateReconciliationOrderInfo(option, (res) => {
                    if(res.data.code == 'success'){
                        Message({ 
                            type: 'success', 
                            message: '删除对账明细成功'
                        });
                        this.queryInfoGet();
                        this.reconciliationTableSelect.splice(0,this.reconciliationTableSelect.length)
                    }
                })
                
            },
            //更新对账核销单
            updataStatement(){
                let option = {
                        id: this.createStatementData.id,
                        reconciliationVerifyOrderNo: this.createStatementData.reconciliationVerifyOrderNo, //处理单号 *
                        reconciliationType: this.createStatementData.reconciliationType, //对账单类型 *
                        supplierCode: this.createStatementData.supplierCode, //供应商(供货方) *
                        storeName: this.createStatementData.storeName,
                        storeCode: this.createStatementData.storeCode,
                        originalInvoiceAmount: this.createStatementData.originalInvoiceAmount, //应开票金额 *
                        actualInvoiceAmount: this.createStatementData.actualInvoiceAmount, //实开票金额 *
                        totalPaymentAmount: this.createStatementData.totalPaymentAmount, //付款总计金额 *
                        originalPaymentAmount: this.createStatementData.originalPaymentAmount, //应付金额 *
                        actualPaymentAmount: this.createStatementData.actualPaymentAmount, //实付金额 *
                        invoiceStatus: this.createStatementData.invoiceStatus, //开票状态【0：未开票、1：已开票】 *
                        paymentStatus: this.createStatementData.paymentStatus, //款项登记状态【0：未登记、1：已登记】 *
                        //orderStatus: 0, //单据状态【0：未生效，1：已提交，2：已生效，3：已完成，-1：已作废】*
                    // wfStatus: -1, //审批状态【-1：待提交，0：已提交，1：审批通过】 * (默认为-1)
                        reconciliationOrderInfoList:[]                    
                    }
                for(let i = 0; i < this.curSelectReconciliation.length; i ++){
                    option.reconciliationOrderInfoList.push({
                        id:this.curSelectReconciliation[i].id
                    })
                }
                api.statementAccountCancel.updateReconciliationVerifyOrderInfo(option, (res) => {
                    if(res.data.code == 'success'){
                        Message({ 
                            type: 'success', 
                            message: '保存对账核销单成功'
                        });
                        Bus.$emit('statementDisabled');
                        Bus.$emit('disabledSup');
                        Bus.$emit('disabledStroe', '');
                        this.queryInfoGet();
                    }
                });
            },
            //保存对账核销单
            saveStatement(){
                if(!this.checkoutData()){
                    return false;
                }
                if(this.pageTypeForSave && !this.createType){
                    this.updataStatement()
                    return false;
                }
                let option = {
                        reconciliationVerifyOrderNo: this.createStatementData.reconciliationVerifyOrderNo, //处理单号 *
                        reconciliationType: this.createStatementData.reconciliationType, //对账单类型 *
                        supplierCode: this.createStatementData.supplierCode, //供应商(供货方) *
                        storeName: this.createStatementData.storeName,
                        storeCode: this.createStatementData.storeCode,
                        originalInvoiceAmount: this.createStatementData.originalInvoiceAmount, //应开票金额 *
                        actualInvoiceAmount: this.createStatementData.actualInvoiceAmount, //实开票金额 *
                        totalPaymentAmount: this.createStatementData.totalPaymentAmount, //付款总计金额 *
                        originalPaymentAmount: this.createStatementData.originalPaymentAmount, //应付金额 *
                        actualPaymentAmount: this.createStatementData.actualPaymentAmount, //实付金额 *
                        invoiceStatus: this.createStatementData.invoiceStatus, //开票状态【0：未开票、1：已开票】 *
                        paymentStatus: this.createStatementData.paymentStatus, //款项登记状态【0：未登记、1：已登记】 *
                        //orderStatus: 0, //单据状态【0：未生效，1：已提交，2：已生效，3：已完成，-1：已作废】*
                    // wfStatus: -1, //审批状态【-1：待提交，0：已提交，1：审批通过】 * (默认为-1)
                        reconciliationOrderInfoList:[]                    
                    }
                for(let i = 0; i < this.curSelectReconciliation.length; i ++){
                    option.reconciliationOrderInfoList.push({
                        id:this.curSelectReconciliation[i].id
                    })
                    
                }
                api.statementAccountCancel.insertReconciliationVerifyOrderInfo(option, (res) => {
                    if(res.data.code == 'success'){
                        this.submitType = true;
                        this.pageTypeForSave = true;
                        this.createType = false;
                        this.createStatementData.id = res.data.obj.id
                        this.createStatementData.reconciliationVerifyOrderNo = res.data.obj.reconciliationVerifyOrderNo
                        Message({ 
                            type: 'success', 
                            message: '保存对账核销单成功'
                        });
                        Bus.$emit('statementDisabled');
                        Bus.$emit('disabledSup');
                        Bus.$emit('disabledStroe', '');
                        this.queryInfoGet();
                    }
                })
            },
            //提交对账核销单
            submitStatement(){
                if(this.curSelectReconciliation.length == 0){
                    Message({ 
                        type: 'warning', 
                        message: '请添加对账明细'
                    });
                    return false;   
                }
                let option = {
                    reconciliationVerifyOrderNo: this.createStatementData.reconciliationVerifyOrderNo, //处理单号 *
                }
                api.statementAccountCancel.submitReconciliationVerifyOrderInfo(option, (res) => {
                    if(res.data.code == 'success'){
                        Message({ 
                            type: 'success', 
                            message: '对账核销单提交成功'
                        });
                        this.$router.push({
                            name:"statement-account-cancel-edit",
                            query:{
                                reconciliationVerifyOrderNo:this.createStatementData.reconciliationVerifyOrderNo,
                                pageType: this.createStatementData.orderStatus
                            }
                        })
                    }
                })
            },
            checkoutData(){
                let result = true
                if(this.createStatementData.reconciliationType === '' || this.createStatementData.reconciliationType < 0){
                    Message({ 
                        type: 'warning', 
                        message: '请先选择对账单类型'
                    });
                    result = false;
                }
                if(this.createStatementData.reconciliationType == 0){
                    if(this.createStatementData.supplierCode == ''){
                        Message({ 
                            type: 'warning',
                            message: '请先选择供货方'
                        });
                        result = false;
                    }
                }
                if(this.createStatementData.reconciliationType == 1){
                    if(this.createStatementData.storeCode == ''){
                        Message({ 
                            type: 'warning',
                            message: '请先选择门店'
                        });
                        result = false;
                    }
                }
                return result;
            },
            //翻页查询
            pageChange(){

            }
        }
    }
</script>
<style>
    #createStatementTableScrollable{
        max-height: 260px;
        overflow-y: scroll;
    }
</style>

