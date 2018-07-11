<template>
    <div>
        <b-card header="查询">
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <!--处理单号 对应参数：暂无入参-->
                    <b-form-fieldset horizontal label="处理单号" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParams.reconciliationVerifyOrderNo" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--对账单类型 对应参数：reconciliationType-->
                    <get-statement @getVal="getPrivateCpVal" ref="getStatement"></get-statement>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--供货方 对应参数：supplierCode-->
                    <scp v-if="queryParams.reconciliationType == 0" :readOnly="scpReadOnly" ref="scp" @clearValue="clearValue"></scp>
                    <store v-else ref="createStore"></store>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--对账时间 对应参数：暂无入参-->
                    <b-form-fieldset horizontal label="对账时间" :label-cols="4" class="text-right">
                        <el-date-picker
                        v-model="statementTime"
                        type="daterange"
                        align="right"
                        placeholder="选择日期范围">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--创建人 对应参数：暂无入参-->
                    <b-form-fieldset horizontal label="创建人" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParams.createName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--创建时间 对应参数：暂无入参-->
                    <b-form-fieldset horizontal label="创建时间" :label-cols="4" class="text-right">
                        <el-date-picker
                        v-model="createTime"
                        type="daterange"
                        align="right"
                        placeholder="选择日期范围">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--对账单号 对应参数：reconciliationVerifyOrderNo -->
                    <b-form-fieldset horizontal label="对账单号" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParams.reconciliationOrderNo" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--发票类型 对应参数：暂无入参-->
                    <b-form-fieldset horizontal label="发票类型" :label-cols="4" class="text-right">
                        <b-form-select v-model="queryParams.invoiceType" :options="invoiceTypes" :value="invoiceTypes.value"></b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
            <query-btn-group @resetClick="reset" @query="query"></query-btn-group>
        </b-card>
        <b-card header="查询" :fields="tableFields">
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button class="btn-success" v-b-modal.modallg size="sm" @click="addReconciliation" variant="primary">新增</b-button>
                        <b-button class="btn-primary" v-b-modal.modallg size="sm" @click="toEdit()" variant="primary">编辑</b-button>
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="tableData" :fields="tableFields">
                    <template slot="select" slot-scope="data">
                         <input type="radio" name="radio" @click="checkData(data.item)">
                    </template>
                    <template slot="supplierName" slot-scope="data">
                        <span v-if="data.item.supplierName != ''">{{data.item.supplierName}}</span>
                        <span v-else>{{data.item.storeName}}</span>
                    </template>
                    <template slot="reconciliationVerifyOrderNo" slot-scope="data">
                        <a href="javascript:;" @click="toDetail(data.item.reconciliationVerifyOrderNo)">{{data.item.reconciliationVerifyOrderNo}}</a>
                    </template>
                    <template slot="originalInvoiceAmount" slot-scope="data">
                        {{(data.item.originalInvoiceAmount - 0).toFixed(2)}}
                    </template>
                    <template slot="actualInvoiceAmount" slot-scope="data">
                        {{(data.item.actualInvoiceAmount - 0).toFixed(2)}}
                    </template>
                    <template slot="originalPaymentAmount" slot-scope="data">
                        {{(data.item.originalPaymentAmount - 0).toFixed(2)}}
                    </template>
                    <template slot="actualPaymentAmount" slot-scope="data">
                        {{(data.item.actualPaymentAmount - 0).toFixed(2)}}
                    </template>
                    <template slot="totalPaymentAmount" slot-scope="data">
                        {{(data.item.totalPaymentAmount - 0).toFixed(2)}}
                    </template>
                    <template slot="reconciliationType" slot-scope="data">
                        {{filterReconciliationType(data.item.reconciliationType)}}
                    </template>
                    <template slot="empty">
                        暂无数据...                  
                    </template>
                </b-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                 <pagination v-if="paginationShow" class="pull-right" @page-change="pageChange" :page-no="pageData.pageNum" :page-size="pageData.pageSize" :total-result="pageData.total" :total-pages="pageData.pages">
                 </pagination>
               </div>
            </div>
        </b-card>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {Message} from "element-ui";
    import { getType } from 'common/api-common'
    import {RATERELATION} from 'common/ref-code'
    import { formatDate } from 'common/api-common';
    //内部组件
    import api from 'common/api'
    import config from 'common/config'
    import { DatePicker } from 'element-ui'
    import QueryBtnGroup from 'components/query-btn-group/query-btn-group' //查询重置按钮组
    import pagination from "components/pagination/pagination.vue";
    import { getSequence } from 'common/api-common.js'
    import { RECONCILIATIONVERIFYORDERSEQ } from 'common/sequence.js'
    //私有组件
    import Bus from './bus/bus.js'
    import getStatement from './components/statementAccountTypes'
    import scp from './components/supplier-cp'
    import store from './components/store'
    Vue.use(DatePicker)
    export default {
        components: {
            getStatement,
            QueryBtnGroup,
            pagination,
            scp,
            store
        },
        data() {
            return {
                scpReadOnly: true,
                paginationShow: false,
                tableData:[],
                //查询结果表格字段
                tableFields:{
                    select:{
                        label: '选择'
                    },
                    reconciliationVerifyOrderNo:{
                        label: '处理单号'
                    },
                    reconciliationType: {//【0：采购对账、1：集团内部对账】
                        label: '对账类型'
                    },
                    supplierName:{
                        label: '供货方名称'
                    },
                    originalInvoiceAmount:{
                        label: '应开票金额'
                    },
                    actualInvoiceAmount:{
                        label: '实开票金额'
                    },
                    originalPaymentAmount:{
                        label: '应付金额'
                    },
                    actualPaymentAmount:{
                        label:'实付金额'
                    },
                    totalPaymentAmount:{
                        label: '付款总计金额'
                    },
                    createName:{
                        label: '创建人'
                    },
                    createTime:{
                        label: '创建时间'
                    }
                },
                //主页面信息
                mainInfo:{
                    reconciliationType: '', //对账类型
                },
                //当前选择
                curData:'',
                createTime: [],
                statementTime: [],
                auditPassTime:'',
                //查询参数(*为必填参数)
                //所有浮点数前端展示保留2位，四舍五入，提交时无需截取
                queryParams:{
                    reconciliationOrderNo: '', // 对账单号 [String]
                    reconciliationVerifyOrderNo: '', //	//处理单号
                    reconciliationType: '', //对账类型【0：采购对账、1：集团内部对账】[Long]
                    supplierCode: '', //供货方编码【供应商/门店】[String]
                    startCreateTime: '',//创建时间开始
                    endCreateTime: '',//创建时间结束
                    startReconciliationTime: '',//对账时间开始
                    endReconciliationTime: '',//对账时间结束
                    createName:'',//创建人
                    invoiceType:'',//发票类型
                    pageNums: config.pageNums
                },
                //分页对象
                pageData:{
                    pageSize: 1,
                    pageNums: config.pageNums
                },
                pageStart: 1,
                //选择时间组件获取
                salesTime:[],

                //开票类型数据
                invoiceTypes: []
            }
        },
        watch:{
            'mainInfo.reconciliationType'(val, oldVal){
                if(val == 1){
                    this.queryParams.supplierCode = '';
                    this.queryParams.supplierName = '';
                    this.scpReadOnly = false;
                }else if(val == 0){
                    this.queryParams.storeName = '';
                    this.queryParams.storeCode = '';
                    this.scpReadOnly = false;
                }else{
                    console.log(val);
                    this.scpReadOnly = true;
                }
            }
        },
        mounted(){
            //供应商组件
            Bus.$on('supplier', (data) => {
                this.queryParams.supplierCode = data.supplierCode
            });
            //获取对账单类型
            Bus.$on('reconciliationType', (data) =>{
                this.queryParams.reconciliationType = data.value;
                this.mainInfo.reconciliationType = data.value;
            });
            getType(RATERELATION, items => {
                this.invoiceTypes = []
                items.forEach(item => {
                    this.invoiceTypes.push({
                        text: item.refDetailName,
                        value: item.refDetailCode
                    })
                })
            })
        },
        methods: {
            checkData(item){
                this.curData = item;
            },
            query(){
                this.queryParams.startCreateTime = formatDate(this.createTime[0]);
                this.queryParams.endCreateTime = formatDate(this.createTime[1]);
                this.queryParams.startReconciliationTime = formatDate(this.statementTime[0]);
                this.queryParams.endReconciliationTime = formatDate(this.statementTime[1]);
                this.queryParams.pageStart = this.pageStart;
                api.statementAccountCancel.queryReconciliationVerifyOrderInfoExts(this.queryParams, (res) => {
                    if(res.data.code == 'success'){
                        this.tableData = res.data.obj.list;
                        this.paginationShow = this.tableData.length > 0 ? true : false;
                        this.pageData.pageSize = (res.data.obj.pageSize - 0)
                        this.pageData.total = (res.data.obj.total - 0)
                        this.pageData.pages = (res.data.obj.pages - 0)
                    }
                })
            },
            pageChange(value){
                this.pageStart = value
                this.query()
            },
            clearValue(){

            },
            reset(){
                this.queryParams = {
                    pageNums:config.pageNums,
                    reconciliationType: '',
                    invoiceType:'',
                    startCreateTime:'',
                    endCreateTime:''
                }
                Bus.$emit('clearStatement')
                this.createTime = [];
                this.statementTime = [];
                this.pageStart = 1;
                this.$refs.scp.$refs.search.setValue('')
            },
            toDetail(reconciliationVerifyOrderNo){
                this.$router.push({
                    name:"statement-account-cancel-edit",
                    query:{
                        reconciliationVerifyOrderNo:reconciliationVerifyOrderNo,
                        pageType: 5
                    }
                })
            },
            toEdit(){
                //orderStatus //单据状态【0：未生效，1：已提交，2：已生效，3：已完成，-1：已作废】
                if(!this.curData){
                    //信息
                    Message({ 
                        type: 'warning', 
                        message: '请要编辑的对账核销单'
                    });
                    return false;
                }
                switch(this.curData.orderStatus - 0){
                    case 0:
                        this.$router.push({
                            name:"statement-account-cancel-create",
                            query:{
                                reconciliationVerifyOrderNo:this.curData.reconciliationVerifyOrderNo,
                                pageType: this.curData.orderStatus
                            }
                        })
                        break;
                    case 1:
                        this.$router.push({
                            name:"statement-account-cancel-edit",
                            query:{
                                reconciliationVerifyOrderNo:this.curData.reconciliationVerifyOrderNo,
                                pageType: this.curData.orderStatus
                            }
                        })
                        break;
                    case 2:
                        this.$router.push({
                            name:"statement-account-cancel-edit",
                            query:{
                                reconciliationVerifyOrderNo:this.curData.reconciliationVerifyOrderNo,
                                pageType: this.curData.orderStatus
                            }
                        })
                        break;
                    case 3:
                        this.$router.push({
                            name:"statement-account-cancel-edit",
                            query:{
                                reconciliationVerifyOrderNo:this.curData.reconciliationVerifyOrderNo,
                                pageType: this.curData.orderStatus
                            }
                        })
                        break;
                    case -1:
                        this.$router.push({
                            name:"statement-account-cancel-edit",
                            query:{
                                reconciliationVerifyOrderNo:this.curData.reconciliationVerifyOrderNo,
                                pageType: this.curData.orderStatus
                            }
                        })
                        break;
                }
            },
            //新增对账核销单
            addReconciliation(){
                //获取对账核销单业务编码 处理单号
                getSequence(RECONCILIATIONVERIFYORDERSEQ, (data) => {
                    this.$router.push({
                        name:"statement-account-cancel-create",
                        query:{
                            reconciliationVerifyOrderNo: data,
                            orderStatus: 0,
                            pageType: 'create'
                        }
                    })
                });
            },
            //获取各种组件的值
            getPrivateCpVal(obj){
                switch(obj.name){
                    //对账类型
                    case 'statementAccountTypes':
                        this.queryParams.reconciliationType = obj.val
                        break;
                }
            },
            //过滤对账类型
            filterReconciliationType(val){
               let arr = config.statementAccount.accountType.filter((data) => {
                   return val == data.value
               });
               return arr[0].text
            }
        }
    }
</script>


