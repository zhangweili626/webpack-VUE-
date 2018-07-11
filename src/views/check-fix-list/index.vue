<template>
    <div>
        <b-card header="查询">
            <div class="row" v-if="!byPreHtml">
                <div class="col-md-4">
                    <!--订单创建时间 对应参数: createTime-->
                    <b-form-fieldset horizontal label="订单创建时间" :label-cols="4" class="text-right">
                        <el-date-picker
                        v-model="createTimeC"
                        type="daterange"
                        align="right"
                        placeholder="选择日期范围">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <!-- 领料搜索区别///领料下订单结算时间不显示 -->
                <div class="col-md-4" v-if="!btnc.get">
                    <!--订单结算时间 对应参数: closingDate-->
                    <b-form-fieldset horizontal label="订单结算时间" :label-cols="4" class="text-right">
                        <el-date-picker
                        v-model="closingDateC"
                        type="daterange"
                        align="right"
                        placeholder="选择日期范围">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--订单业务类型 对应参数: businessTypeCode 状态对应数据: orderOperationOptions-->
                    <b-form-fieldset horizontal label="订单业务类型" :label-cols="4" class="text-right">
                        <b-form-select v-model="queryParameter.businessTypeCode" :options="orderOperationOptions" class="mb-3" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--订单来源 对应参数: orderSourceType 状态对应数据: orderSourceOptions-->
                    <b-form-fieldset horizontal label="订单来源" :label-cols="4" class="text-right">
                        <b-form-select v-model="queryParameter.orderSourceType" :options="orderSourceOptions" class="mb-3" />
                    </b-form-fieldset>
                </div>
                <!-- <div class="col-md-4">
                    订单来源单号 对应参数：暂无入参
                    <b-form-fieldset horizontal label="订单来源单号" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParameter.orderSourceNumber"/>
                    </b-form-fieldset>
                </div> -->
                <div class="col-md-4">
                    <!--订单号 对应参数: orderNo-->
                    <b-form-fieldset horizontal label="订单号" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParameter.orderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单状态" :label-cols="4" class="text-right">
                        <!--订单状态 对应参数: closingFlag 主状态select对应option数据: closingFlagOptions-->
                        <div class="row">
                            <div class="col-md-6">
                                <b-form-select v-model="queryParameter.closingFlag" :options="closingFlagOptions"/>
                            </div>
                            <!--订单子状态 对应参数: orderStatus 订单状态子选项子状态select对应option数据 orderStatusChildOptions-->
                            <div class="col-md-6">
                                <b-form-select v-model="queryParameter.orderStatus" :options="orderStatusChildOptions"/>
                            </div>
                        </div>
                    </b-form-fieldset>
                </div>
                <!-- 领料搜索区别///领料下支付状态不显示 -->
                <div class="col-md-4" v-if="!btnc.get">
                    <!--支付状态 对应参数: paymentStatus 主状态select对应option数据: paymentStatusOptions-->
                    <b-form-fieldset horizontal label="支付状态" :label-cols="4" class="text-right">
                        <b-form-select v-model="queryParameter.paymentStatus" :options="paymentStatusOptions" class="mb-3" />
                    </b-form-fieldset>
                </div>
                <!-- 领料搜索区别///领料下是否开票不显示 -->
                <div class="col-md-4" v-if="!btnc.get">
                    <!--是否开票 对应参数: invoiceStatus 主状态select对应option数据: invoiceStatusTypeOptions-->
                    <b-form-fieldset horizontal label="是否开票" :label-cols="4" class="text-right">
                        <b-form-select v-model="queryParameter.invoiceStatus" :options="invoiceStatusTypeOptions" class="mb-3" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--客户姓名 对应参数: custName-->
                    <b-form-fieldset horizontal label="客户姓名" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParameter.custName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--客户手机号 对应参数: custMobile-->
                    <b-form-fieldset horizontal label="客户手机号" :label-cols="4" class="text-right">
                        <b-form-input class="mb-3" v-model="queryParameter.custMobile"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--VIN 对应参数: vinCode-->
                    <b-form-fieldset horizontal label="VIN" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParameter.vinCode"/>
                    </b-form-fieldset>
                </div>
                <!-- 领料搜索区别///领料下开单人不显示 -->
                <div class="col-md-4" v-if="!btnc.get">
                    <!--开单人: 对应参数: salesEmpName -->
                    <b-form-fieldset horizontal label="开单人" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParameter.salesEmpName" class="mb-3"/>
                    </b-form-fieldset>
                </div>
                <!-- 领料搜索区别///领料下使用的卡号不显示 -->
                <!-- <div class="col-md-4" v-if="!btnc.get">
                    使用的卡号: 对应参数: cardNo
                    <b-form-fieldset horizontal label="使用的卡号" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParameter.cardNo"/>
                    </b-form-fieldset>
                </div> -->
                <!-- 领料搜索区别///领料下使用的券号不显示 -->
                <!-- <div class="col-md-4" v-if="!btnc.get">
                    使用的券号: 对应参数: couponNo
                    <b-form-fieldset horizontal label="使用的券号" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParameter.couponNo"/>
                    </b-form-fieldset>
                </div> -->
                <div class="col-md-4">
                    <!--车牌 对应参数: custPlates-->
                    <b-form-fieldset horizontal label="车牌" :label-cols="4" class="text-right">
                        <div class="row">
                            <div class="col-md-6">
                                <b-form-input v-model="queryParameter.custPlates"/>
                            </div>
                            <!--包含临时车牌 对应参数: includeTempPlates-->
                            <b-form-checkbox class="pull-left" v-model="queryParameter.includeTempPlates" value="1">包含临时车牌</b-form-checkbox>
                        </div>
                    </b-form-fieldset>
                </div>
                <!-- 领料搜索区别///领料下领料状态显示状态 -->
                <div class="col-md-4" v-if="btnc.get">
                    <b-form-fieldset horizontal label="领料状态" :label-cols="4" class="text-right">
                        <b-form-select :options="pickingStatusList" v-model="queryParameter.pickingStatus"><!-- pageData -->
                        </b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
            <!-- 以上是领料和工单的差别 end -->

            <div class="row" v-if="byPreHtml">
                <!-- 预检单搜索条件的添加000000000000000000000000**start -->
                <div class="col-md-4">
                    <!--订单创建时间 对应参数: createTime-->
                    <b-form-fieldset horizontal label="订单创建时间" :label-cols="4" class="text-right">
                        <el-date-picker
                        v-model="createTimeC"
                        type="daterange"
                        align="right"
                        placeholder="选择日期范围">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单状态" :label-cols="4" class="text-right">
                        <!--订单状态 对应参数: closingFlag 主状态select对应option数据: closingFlagOptions-->
                        <div class="row">
                            <div class="col-md-6">
                                <b-form-select v-model="queryParameter.closingFlag" :options="closingFlagOptions"/>
                            </div>
                            <!--订单子状态 对应参数: orderStatus 订单状态子选项子状态select对应option数据 orderStatusChildOptions-->
                            <div class="col-md-6">
                                <b-form-select v-model="queryParameter.orderStatus" :options="orderStatusChildOptions"/>
                            </div>
                        </div>
                    </b-form-fieldset>
                </div>
                <!-- 车牌 -->
                <div class="col-md-4">
                    <!--车牌 对应参数: custPlates-->
                    <b-form-fieldset horizontal label="车牌" :label-cols="4" class="text-right">
                        <div class="row">
                            <div class="col-md-6">
                                <b-form-input v-model="queryParameter.custPlates"/>
                            </div>
                            <!--包含临时车牌 对应参数: includeTempPlates-->
                            <b-form-checkbox class="pull-left" v-model="queryParameter.includeTempPlates" value="1">包含临时车牌</b-form-checkbox>
                        </div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--客户手机号 对应参数: custMobile-->
                    <b-form-fieldset horizontal label="客户手机号" :label-cols="4" class="text-right">
                        <b-form-input class="mb-3" v-model="queryParameter.custMobile"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <!--VIN 对应参数: vinCode-->
                    <b-form-fieldset horizontal label="VIN" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParameter.vinCode"/>
                    </b-form-fieldset>
                </div>
                <!-- 预检单搜索条件的添加000000000000000000000000**end -->
            </div>
            <query-btn-group 
            @resetClick="reset" 
            @query="queryOrderList"
            ></query-btn-group>
        </b-card>

        <p><b-button v-if="btnc.pre" @click="preJump" size="sm" variant="success">新建预检单</b-button></p>
        <!-- <p><b-button v-if="btnc.gdl" @click="gdlJump" size="sm" variant="success">新建工单</b-button></p> -->

        <b-card>
            <div header="维修工单查询明细">
                <div class="table-scrollable">
                    <b-table class="minWidth" striped hover bordered show-empty
                    id="checkoutCounterTableData" 
                    :items="checkoutCounterTableData" 
                    :fields="checkoutCounterTableFields">
                        <!-- actualTotalPrice 订单金额 -->
                        <template slot="actualTotalPrice" slot-scope="data">
                            {{ new Number(data.item.actualTotalPrice).toFixed(2) }}
                        </template>
                        <!-- 订单显示子状态 【0：待处理、1：处理中、9：待结算、10：已结算、-1：已作废】 -->
                        <!-- <template slot="orderStatus" slot-scope="data">
                            {{ data.item.orderStatus | orderStatusF }}
                        </template> -->
                        <!-- 订单主状态 -->
                        <template slot="closingFlag" slot-scope="data">
                            {{ data.item.closingFlag | closingFlagF }}
                        </template>
                        <template slot="businessTypeName" slot-scope="data">
                            {{ data.item.businessTypeName }}
                        </template>
                        <template slot="orderNo" slot-scope="row">
                            <!-- 订单号点击 orderNo -->
                            <a href="javascript:;" @click="showDetail(row.item)">{{ row.item.orderNo }}</a>
                        </template>
                        <template slot="paymentStatus" slot-scope="row">
                            {{ row.item.paymentStatus | paymentStatusF }}
                        </template>
                        <template slot="invoiceStatus" slot-scope="row">
                            {{ row.item.invoiceStatus | invoiceStatusF }}
                        </template>
                        <!--  pickingStatus 领料状态 -->
                        <template slot="pickingStatus" slot-scope="data"><!--  v-if="btnc.get" -->
                            {{ data.item.pickingStatus | pickingStatusF }}<!--   -->
                        </template>
                        <template slot="precheckOrderNos" slot-scope="data"><!-- .............. -->
                            <a href="javascript:;" @click="precheckOrderNoS(data.item.precheckOrderNos)">
                                {{data.item.precheckOrderNos!==''?'预检单':''}}
                            </a>
                        </template>
                        <template slot="orderSourceType" slot-scope="data">
                            {{ data.item.orderSourceType | orderSourceTypeF }}
                        </template>
                        <!-- 已交车 -->
                        <!-- <template slot="orderSourceType" slot-scope="data">
                            <p>{{ data.item.orderSourceType | orderSourceTypeF }}</p>
                        </template> -->
                        <template slot="operation" slot-scope="data">
                            <!-- 结算 -->
                            <!-- <p>{{ data.item.orderStatus | orderStatusF }}</p> -->
                            <!-- <a href="javascript:;" @click="toVoid(data.item.precheckOrderNos)">{{data.item.orderStatus == '9' ? '结算' : ''}}</a> -->
                            <a href="javascript:;" 
                             @click="iDeletedOrderNo(data.item)">
                             {{ isDeletedShow(data.item) }}
                            </a>
                            {{data.item.isCancel=='1'?'已作废':''}}
                        </template>
                        <template slot="closingDate" slot-scope="data">
                            {{data.item.closingDate ? data.item.closingDate.substring(0, 19) : ''}}
                        </template>
                        <template slot="empty">
                            暂无数据...
                        </template>
                    </b-table>
                </div>
                <div class="row mt-2">
                    <div class="col-md-12">
                        <pagination 
                        v-if="paginationShow"
                        class="pull-right" 
                        @page-change="pageChange" 
                        :page-no="pageData.pageNum" 
                        :page-size="pageData.pageSize" 
                        :total-result="pageData.total" 
                        :total-pages="pageData.pages">
                        </pagination>
                        <!-- page-no 当前第2页
                        page-size 显示多少条
                        total-result 总共多少条信息
                        total-pages 共多少页
                        -->
                    </div>
                </div>
            </div>
        </b-card>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Message, DatePicker, MessageBox} from "element-ui";
    //内部组件
    import api from 'common/api'
    import config from 'common/config';
    import common from 'common/common';
    import {ORDER_INVOICE, ORDER_BUSINESS_TYPE} from 'common/ref-code'
    import { formatDate, getType } from 'common/api-common';
    import { ORDERPAYMENTSEQ } from 'common/sequence.js';
    import pagination from "components/pagination/pagination.vue";
    import QueryBtnGroup from 'components/query-btn-group/query-btn-group' //查询重置按钮组
    import Bus from './bus/bus.js'
    //私有组件
    Vue.use(DatePicker)
    export default {
        components: {
            QueryBtnGroup,
            pagination
        },
        watch: {
            'value6': function (val) {
                //cconsole.log(val)
            },
            'createTimeC': function(val){
                this.queryParameter.createTimeFrom = this.fmtDate(`${val[0]}`)
                this.queryParameter.createTimeTo = this.fmtDate(`${val[1]}`)
            },
            'closingDateC': function(val){
                this.queryParameter.closingDateFrom = this.fmtDate(`${val[0]}`)
                this.queryParameter.closingDateTo = this.fmtDate(`${val[1]}`)
            }
        },
        created () {
            let rq = this.$route.name || ''
            // console.log('跳转的routeNAME', rq)
            if (rq === 'store-requisition-queryFix') { // 领料
                this.btnc = {
                    get: true,
                    pre: false,
                    gdl: true
                }
            }  else if (rq === 'precheck-fix-query') { // 预检单
                this.btnc = {
                    get: false,
                    pre: true,
                    gdl: false
                }
            } else {
                // 就显示工单查询列表
                this.btnc = {
                    get: false,
                    pre: false,
                    gdl: true
                }
            }
            // 是否是预检单
            this.byPreHtml = (rq === 'precheck-fix-query') ? true : false
            // this.addEnterSeach() // 添加回车搜索事件
            // document.body.addEventListener('keydown', addEnterSeach(event), false)
        },
        mounted () {
            this.initPage()
        },
        beforeDestroy () {
        },
        methods: {
            // 【0：待处理、1：处理中、9：待结算、10：已结算】
            isDeletedShow (val) {
                // 作废的不显示有几种状态  1.已经结算 2.正在处理{派工}的时候不会显示 3.已经作废
                let DATA = val //.isDeleted
                let str = ''
                if (DATA.isCancel=='0') {
                    if (DATA.orderStatus=='10') { /* 处理中包含太广，暂时除’已结算‘’已作废‘都显示作废按钮 DATA.orderStatus=='1' ||  */
                        str = ''
                    } else {
                        str = '作废'
                    }
                } else {
                    str = ''
                }
                return str

            },
            // 新建预检单
            preJump () {
                this.$router.push({ // 新建预检单
                    path: '/precheck'
                })
            },
            // elm时间选择器的校准
            fmtDate (obj){
                var date =  new Date(obj)
                var y = 1900 + date.getYear()
                var m = "0" + (date.getMonth() + 1)
                var d = "0" + date.getDate()
                return y + "-" + m.substring(m.length-2,m.length) + "-" + d.substring(d.length-2,d.length)
            },
            // 订单作废提示
            iDeletedOrderNo (val){
                let pamase = {
                    "orderInfoVo":
                    {
                        "orderNo": val.orderNo
                    }
                }
                MessageBox.confirm('此操作将作废该工单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.repairOrder.routeCancelOrderInfo(pamase, (res) => {
                        if(res.data.message == "success"){
                            Message({
                                type: 'success', 
                                message: '您已成功作废'
                            });
                            val.isCancel = '1'
                        }
                    })
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },
            // 订单结算
            toVoid(val){
                this.$router.push({ // 工单详情页面
                    path: '/repair-order/repair-order-detail',
                    query: {
                        orderNo: `${val}`,
                    }
                })
            },
            // 质检单跳转
            precheckOrderNoS(val){
                this.$router.push({ // 详情页面
                    path: '/precheck',
                    query: {
                        No: `${val}`,
                    }
                })
            },
            // 订单的跳转
            showDetail (val) { // 此页面根据不同的route.那么判断进入不同的页面
                let rq = this.$route.name || ''
                // 点击按钮前检测选项
                if(rq === 'workOrderInvoiceFix'){ // 开票
                    this.$router.push({
                        path: '/workOrderInvoice/workOrderInvoiceDetail',
                        query:{
                            orderNo: `${val.orderNo}`
                        }
                    })
                } else if (rq === 'workOrderPayFix') { // 支付
                    this.$router.push({
                        path: '/workOrderPay/workOrderPayDetail',
                        query:{
                            orderNo: `${val.orderNo}`
                        }
                    })
                } else if (rq === 'store-requisition-queryFix') { // 领料
                
                    this.$router.push(`/store-requisition/edit/${val.orderNo}`)

                } else if (rq === 'precheck-fix-query') { // 预检单详情页面
                    this.$router.push({ 
                        path: '/precheck',
                        query: {
                            No: `${val.precheckOrderNos}`,
                        }
                    })
                } else { // 详情页面
                    // 假如是洗车工单，跳转到洗车列表就行了。。。。。。。。。。。。。洗车详情列表
                    if(val.businessTypeName.indexOf('洗车') > -1) {
                        this.$router.push({
                            path: '/vehicle-cleaning/vehicle-cleaning-detailed',
                            query: {
                                orderNo: `${val.orderNo}`,
                            }
                        })
                    } else {
                        this.$router.push({
                            path: '/repair-order/repair-order-detail',
                            query: {
                                orderNo: `${val.orderNo}`,
                            }
                        })
                    }
                }
            },
            // 重置
            reset(){
                for(let key in this.queryParameter){
                    this.queryParameter[key] = '';
                }
                this.pageStart = 1
                this.closingDateC = ''
                this.createTimeC = ''
                this.checkoutCounterFlag = true
            },
            // 页面初始化
            initPage(){ //..............................数据字典
                getType(ORDER_BUSINESS_TYPE, (res) => {
                    if(res.length > 0){
                        this.orderOperationOptions = [];
                        for(let i = 0; i < res.length; i ++){
                            this.orderOperationOptions.push({
                                text: res[i].refDetailName,
                                value: res[i].refDetailCode
                            })
                        }
                        let rq = this.$route.name || ''
                        if (rq === 'store-requisition-queryFix') { // 领料
                            this.orderOperationOptions = this.orderOperationOptions.filter(function(val){
                                return val.value != "CarWash"
                            })
                        }
                    }
                })
            },
            // 查询条件查询订单列表
            queryOrderList() {
                if(!this.checkoutCounterFlag){
                    return false;
                }
                this.pageStart = 1
                this.queryParameter.pageNums = config.pageNums;
                this.queryParameter.pageStart = this.pageStart;
                this.checkoutCounterFlag = false;
                // 如果是预检单页面，不显示不含有预检单的内容的页面
                if (this.byPreHtml) {
                    this.queryParameter.includeCheckOrderNo = '1';
                }
                if(!this.queryParameter.includeTempPlates){ // 是否包含临时车牌
                    this.queryParameter.includeTempPlates = ''
                }
                console.log('请求参数调试', this.queryParameter)
                api.repairOrder.queryOrderInfoPageForPicking(this.queryParameter, (res) => {
                    if(res.data.message == "success"){
                        this.checkoutCounterTableData = res.data.obj.list;
                        this.pageData = res.data.obj
                        this.paginationShow = this.checkoutCounterTableData.length > 0 ? true : false
                        this.checkoutCounterFlag = true;
                        document.documentElement.scrollTop = 0;
                    }
                })
            },
            // 分页回调方法
            pageChange(value){
                this.pageStart = value;
                this.queryOrderList();
            }
        },
        data() {
            return {
                paginationShow: false,
                // 判断预检单页面，筛选数据
                byPreHtml: false,
                // 领料状态下显示下拉
                pickingStatusList: [
                    {
                        text: '未领料',
                        value: 0
                    },
                    {
                        text: '部分领料',
                        value: 1
                    },
                    {
                        text: '完全领料',
                        value: 2
                    }
                ],
                storeReqShow: true,
                // 结算flag
                settlementOrderInfo: true,
                // 路由判断orderNo跳转的路径
                btnc:{ // 负责显示三个的不同
                    dzk: true, // 工单==支付==开票
                    get: true, // 领料
                    pre: true, // 预检
                },
                // 储存单选订单号
                radioIdSave: '',
                //查询参数
                createTimeC: '', //订单创建时间(是个范围要重新处理)
                closingDateC: '', //订单结算时间(是个范围要重新处理)
                queryParameter:{
                    // orderTypeCode: '', //订单业务类型
                    orderTypeCode: 'transactionNoteTypeAftherSales', // 传入此字段只能查询售后的列表
                    cardNo: '', //使用的卡号
                    closingFlag: '', //订单状态 = 交车标识符【0：未交车  1：已交车】
                    couponNo: '', //使用的券号
                    createBy: '', //开单人
                    // 创建是个范围createTimeFrom （开始时间）createTimeTo（结束时间
                    createTimeFrom: '', //订单创建开始时间
                    createTimeTo:'', //订单创建结束时间
                    closingDateFrom: '',//订单结算开始时间
                    closingDateTo:'',//订单结算结束时间
                    custMobile: '', //客户手机号
                    custName: '', //客户姓名
                    custPlates: '', //车牌
                    businessTypeCode: '', //订单业务类型thf
                    orderSourceType: '', //订单来源【0：门店散客、1：售后预约、2：销售预约、3：客服预约】
                    // orderSourceNumber: '', //订单来源单号??
                    orderNo: '', //订单号
                    orderStatus:'', //订单子状态 【0：待处理、1：处理中、9：待结算、10：已结算、-1：已作废】
                    includeType: '', //???？？
                    invoiceStatus: '', //开票状态【0：未开票、1：已开票】
                    paymentStatus: '', //支付状态【0：未支付、1：已支付】
                    vinCode: '', //VIN
                    storeCode: '',//storeCode
                    pickingStatus: '', // 领料状态
                    includeTempPlates: '', // 是否包含临时车牌【1：是, 否则不传】
                    includeCheckOrderNo: '' // 是否仅仅是预检单【1：预检  2：质检", 否则不传】
                },
                value1: '',
                value2: '',
                //当前选择订单ID
                checkoutCounterId: '',
                checkoutCounterFlag: true,
                checkoutCounterTableData: [],
                //结算订单表格字段
                checkoutCounterTableFields:{
                    businessTypeName:{
                        label: '订单业务类型'
                    },
                    orderNo:{
                        label: '订单号'
                    },
                    closingFlag:{
                        label: '订单状态'
                    },
                    pickingStatus:{
                        label: '领料状态'
                    },
                    storeName:{
                        label: '门店名称'
                    },
                    salesEmpName:{
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
                    carDisplayName:{
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
                    createTimeStr:{
                        label: '订单创建时间'
                    },
                    closingDate:{
                        label: '订单结算时间'
                    },
                    orderSourceType:{
                        label: '订单来源'
                    },
                    // orderSourceNumber:{
                    //     label: '订单来源单号'
                    // },
                    precheckOrderNos:{
                        label: '检查单'
                    },
                    operation:{
                        label: '操作'
                    },
                },
                //分页对象
                pageData:{
                    pageSize: 1,
                    pageNum: config.pageNums
                },
                //分页
                pageStart: 1,
                /*查询条件各类状态*/
                orderOperationOptions: [], //订单业务类型selcet option数据----从数据字典拿

                orderSourceOptions: [ //订单来源selcet option数据
                    {text: '门店散客', value: 0},
                    {text: '售后预约', value: 1},
                    {text: '销售预约', value: 2},
                    {text: '客服预约', value: 3}
                ],

                closingFlagOptions: [{text: '未交车', value: 0}, {text: '已交车', value: 1}], //订单状态主状态select对应option数据

                orderStatusChildOptions: [ //订单状态子选项子状态select对应option数据
                    {text: '待处理', value: 0}, 
                    {text: '处理中', value: 1},
                    {text: '待结算', value: 9},
                    {text: '已结算', value: 10}
                    // {text: '已作废', value: -1},
                ],

                paymentStatusOptions: [ //支付状态主状态select对应option数据
                    {text: '未支付', value: 0}, 
                    {text: '已支付', value: 1}
                ],

                invoiceStatusTypeOptions: [ //是否开票主状态select对应option数据: openInvoiceTypeOptions
                    {text: '未开票', value: 0}, 
                    {text: '已开票', value: 1}
                ],
            }
        },
        filters: {
            paymentStatusF(val){
                return (val-0) ? '已支付' : '未支付'
            },
            invoiceStatusF(val){
                return (val-0) ? '已开票' : '未开票'
            },
            closingFlagF (val) {
                return (val-0) ? '已交车' : '未交车'
            },
            orderStatusF(val){
                // 【0：待处理、1：处理中、9：待结算、10：已结算、-1：已作废
                switch(val)
                {
                    case '0':
                        return "待处理"
                    break;
                    case '1':
                        return "处理中"
                    break;
                    case '9':
                        return "待结算"
                    break;
                    case '10':
                        return "已结算"
                    break;
                    case '-1':
                        return "已作废"
                    break;
                    default:
                        return ""
                }
            },
            orderSourceTypeF(val){
                // 订单来源【0：门店散客、1：售后预约、2：销售预约、3：客服预约】
                switch(val)
                {
                    case '0':
                        return "门店散客"
                    break;
                    case '1':
                        return "售后预约"
                    break;
                    case '2':
                        return "销售预约"
                    break;
                    case '3':
                        return "客服预约"
                    break;
                    default:
                        return ""
                }
            },
            pickingStatusF(val){
                switch(val)
                {
                    case '0':
                        return "未领料"
                    break;
                    case '1':
                        return "部分领料"
                    break;
                    case '2':
                        return "全部领料"
                    break;
                    default:
                        return ""
                }
            }
        },
        computed: {
        }
    }
</script>
<style scoped>
.minWidth{
    min-width: 2500px;
}
</style>