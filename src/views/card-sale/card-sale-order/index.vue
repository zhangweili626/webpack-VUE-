<template>
    <div>
        <b-card header="查询">
            <div class="row">
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="销售区域/门店" label-text-align="right" :label-cols="4">
                        <AreaTree @select-change="selectedfun" ref="area" :storeAll='true'></AreaTree>                        
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="卡使用方" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.cardUseTypeCode" @change="cardUseTypeCodeChange" :options="carTypeList"></b-form-select>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="卡号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.cardNo"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="销售单状态" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.orderStatus" :options="saleOderStateList"></b-form-select>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="销售单号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.cardSalesOrderNo"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="销售人" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.salesEmpName"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="有效期类型" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.cardExpireType" :options="validityTermType"></b-form-select>                        
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="卡有效期时间" label-text-align="right" :label-cols="4">
                            <el-date-picker
                            v-model="cardExpire"
                            type="daterange"
                            align="right"
                            placeholder="选择日期范围"
                            :picker-options="pickerOptions2">
                            </el-date-picker>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="销售时间" label-text-align="right" :label-cols="4">
                         <!-- <el-date-picker
                        v-model="salesTime"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions1">
                        </el-date-picker> -->
                        <el-date-picker
                        v-model="salesTime"
                        type="daterange"
                        align="right"
                        placeholder="选择日期范围"
                        :picker-options="pickerOptions1">
                        </el-date-picker>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="客户姓名" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.customName"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="手机号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.mobilePhone"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4" v-if="showCarInfo">
					<b-form-fieldset horizontal label="VIN码" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.vinCode"></b-form-input>
					</b-form-fieldset>
				</div>
			</div>
			<car-info v-if="showCarInfo" :flag="carFlag" @callBack="carSelect" :col='3' ref="carInfo"></car-info>                
            <div class="row">
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset  horizontal label="发票号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.invoiceNos"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4" v-if="showCarInfo">
					<b-form-fieldset horizontal label="车牌号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.plateNumber"></b-form-input>
					</b-form-fieldset>
				</div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset">重置</b-button>                        
                        <b-button size="sm" variant="primary" @click="query">查询</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="success" @click="newAdd">新建卡销售</b-button>
                        <b-button size="sm" variant="primary" @click="update">编辑</b-button>
                        <b-button size="sm" variant="danger" @click="deleteItem">作废</b-button>
                        <b-button size="sm" variant="primary" @click="printTicket">开票</b-button>
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="tableList" :fields="fields">
                    <template slot="index" slot-scope="data">
                        <input type="radio" name="radio" @click="checkData(data.index)">
                    </template>
                    <template slot="storeName" slot-scope="data">
                            {{data.item.storeName}}
                    </template>
                    <template slot="cardNo" slot-scope="data">
                        <router-link :to="{
                        path: 'detail',
                        query: {
                            pageState: 2,
                            cardNo: data.item.cardNo,
                            cardName: data.item.cardName,
                            cardSalesOrderNo: data.item.cardSalesOrderNo,
                        }
                    }">{{data.item.cardNo}}</router-link>
                    </template>
                    <template slot="cardName" slot-scope="data">
                        {{data.item.cardName}}
                    </template>
                    <template slot="cardSalesOrderNo" slot-scope="data">
                        {{data.item.cardSalesOrderNo}}
                    </template>
                    <template slot="orderStatus" slot-scope="data">
                        <span v-if="data.item.orderStatus == 0">未结算</span>
                        <span v-if="data.item.orderStatus == 1">已结算</span>
                        <span v-if="data.item.orderStatus == -1">已作废</span>
                    </template>
                    <template slot="salesEmpName" slot-scope="data">
                        {{data.item.salesEmpName}}
                    </template>
                    <template slot="salesTime" slot-scope="data">
                        {{data.item.salesTime}}
                    </template>
                    <template slot="cardExpireType" slot-scope="data">
                        {{data.item.cardExpireType == 0?'固定时长':'有效期限'}}
                    </template>
                    <template slot="startDate" slot-scope="data">
                        {{data.item.startDate}}
                    </template>
                    <template slot="endDate" slot-scope="data">
                        {{data.item.endDate}}
                    </template>
                    <template slot="expirePeriod" slot-scope="data">
                        {{data.item.effectiveDays}}
                    </template>
                    <template slot="cardAmout" slot-scope="data">
                        {{data.item.cardAmout}}
                    </template>
                    <template slot="cardStatus" slot-scope="data">
                        <span v-if="data.item.cardStatus == 0">未销售</span>
                        <span v-if="data.item.cardStatus == 1">挂售中</span>
                        <span v-if="data.item.cardStatus == 2">已销售</span>
                        <span v-if="data.item.cardStatus == 8">退卡中</span>
                        <span v-if="data.item.cardStatus == 9">已退卡</span>
                        <span v-if="data.item.cardStatus == -1">已作废</span>
                    </template>
                    <template slot="invoiceNos" slot-scope="data">
                        {{data.item.invoiceNos}}
                    </template>
                    <template slot="customName" slot-scope="data">
                        {{data.item.customName}}
                    </template>
                    <template slot="mobilePhone" slot-scope="data">
                        {{data.item.mobilePhone}}
                    </template>
                    <template slot="plateNumber" slot-scope="data">
                        {{data.item.plateNumber}}
                    </template>
                    <template slot="vinCode" slot-scope="data">
                        {{data.item.vinCode}}
                    </template>
                    <template slot="factoryName" slot-scope="data">
                        {{data.item.factoryName}}
                    </template>
                    <template slot="brandName" slot-scope="data">
                        {{data.item.brandName}}
                    </template>
                    <template slot="seriesName" slot-scope="data">
                        {{data.item.seriesName}}
                    </template>
                    <template slot="modelName" slot-scope="data">
                        {{data.item.modelName}}
                    </template>
                    <template slot="opvName" slot-scope="data">
                        {{data.item.opvName}}
                    </template>
                    <template slot="iotypeName" slot-scope="data">
                        {{data.item.iotypeName}}
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
        <ticket  ref="ticket"  @conOpenTicket="conOpenTicket" :invoiceContentSuffix="invoiceContentSuffix" invoiceContentStart="CardSales"></ticket>
        <!-- 选卡 -->
        <select-card-modal ref="selectCardModal"></select-card-modal>
    </div>
</template>
<script>
import Vue from 'vue'
import AreaTree from 'components/iris-areaqueryshop/index'
import { MessageBox, Message, DatePicker } from 'element-ui'
import {mapState, mapMutations, mapActions} from 'vuex'
import carInfo from 'components/iris-carinfo'
import config from 'common/config.js'
import common from 'common/common.js'
import api from 'common/api.js'
import pagination from "components/pagination/pagination.vue";
import ticket from '../edit/open-ticket.vue'
import SelectCardModal from '../card-sale/index'
import { CARD_SALE_SORDER_SEQ, CARD_SALE_INVOICE_SEQ, CARD_SALE_PAYMENT_SEQ } from 'common/sequence'
import { getSequence, alertSuccess, getDateRange, formatDate, dateDiff, getType } from 'common/api-common'
Vue.use(DatePicker)
    export default {
        data() {
            return {
                invoiceContentSuffix:"",
                queryParams:{
                    cardUseTypeCode: '',
                    pageNums:config.pageNums,
                },
				carFlag: config.carFlag,                
                carTypeList:[],
                saleOderStateList:[{
                    text:'',
                    value:null
                },{
                    text:"未结算",
                    value:0
                },{
                    text:"已结算",
                    value:1
                },{
                    text:"已作废",
                    value:-1
                }],
                validityTermType:[{
                    text:'',
                    value:null
                },{
                    text:"固定时长",
                    value:0
                },{
                    text:"有效期限",
                    value:1
                }],
                fields:{
                    index: {
                        label: "选择"
                    },
                    storeName:{
                        label: "门店"
                    },
                    cardNo:{
                        label: "卡号"                        
                    },
                    cardName:{
                        label: "卡名称"                        
                    },
                    cardSalesOrderNo:{
                        label: "销售单号"                        
                    },
                    orderStatus:{
                        label: "销售单状态"                        
                    },
                    salesEmpName:{
                        label: "销售人"                        
                    },
                    salesTime:{
                        label: "销售时间"                        
                    },
                    cardExpireType:{
                        label: "卡有效类型"                        
                    },
                    startDate:{
                        label: "有效开始时间"                        
                    },
                    endDate:{
                        label: "有效结束时间"                        
                    },
                    expirePeriod:{
                        label: "有效期天数"                        
                    },
                    cardAmout:{
                        label: "面值"                        
                    },
                    cardStatus:{
                        label: "卡状态"                        
                    },
                    invoiceNos:{
                        label: "发票号"                        
                    },
                    customName:{
                        label: "客户姓名"                        
                    },
                    mobilePhone:{
                        label: "手机号码"                        
                    },
                    plateNumber:{
                        label: "车牌"                        
                    },
                    vinCode:{
                        label: "VIN码"                        
                    },
                    factoryName:{
                        label: "厂家"                        
                    },
                    brandName:{
                        label: "品牌"                        
                    },
                    seriesName:{
                        label: "车系"                        
                    },
                    modelName:{
                        label: "车型"                        
                    },
                    opvName:{
                        label: "排量"                        
                    },
                    iotypeName:{
                        label: "进气方式"                        
                    },
                },
                pickerOptions2: {
                    // shortcuts: [{
                    //     text: '最近一周',
                    //     onClick(picker) {
                    //     const end = new Date();
                    //     const start = new Date();
                    //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    //     picker.$emit('pick', [start, end]);
                    //     }
                    // }, {
                    //     text: '最近一个月',
                    //     onClick(picker) {
                    //     const end = new Date();
                    //     const start = new Date();
                    //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    //     picker.$emit('pick', [start, end]);
                    //     }
                    // }, {
                    //     text: '最近三个月',
                    //     onClick(picker) {
                    //     const end = new Date();
                    //     const start = new Date();
                    //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    //     picker.$emit('pick', [start, end]);
                    //     }
                    // }]
                },
                cardExpire:[],
                pickerOptions1: {
                    // shortcuts: [{
                    //     text: '今天',
                    //     onClick(picker) {
                    //     picker.$emit('pick', new Date());
                    //     }
                    // }, {
                    //     text: '昨天',
                    //     onClick(picker) {
                    //     const date = new Date();
                    //     date.setTime(date.getTime() - 3600 * 1000 * 24);
                    //     picker.$emit('pick', date);
                    //     }
                    // }, {
                    //     text: '一周前',
                    //     onClick(picker) {
                    //     const date = new Date();
                    //     date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    //     picker.$emit('pick', date);
                    //     }
                    // }]
                },
                salesTime:[],
                selectIndex: -1
            }
        },
        computed:{
            ...mapState('demandOrder',[
                'cardSaleOrderList',
                'cardSaleOrderPage',
            ]),
            tableList:function(){
                return JSON.parse(JSON.stringify(this.cardSaleOrderList))
            },
            pageData:function(){
                return JSON.parse(JSON.stringify(this.cardSaleOrderPage))            
            },
            showCarInfo() {
                return this.queryParams.cardUseTypeCode == 'VehicleCard' || this.queryParams.cardUseTypeCode == ''
            }
        },
        components:{
            AreaTree,
            carInfo,
            pagination,
            ticket,
            SelectCardModal
        },
        methods: {
            ...mapActions('demandOrder',[
                'setCardSaleOrder',
            ]),
            pageChange(value){
                const _this = this;
                _this.queryParams.pageStart = value   
                _this.queryCardSalesOrderInfos()
            },
            //重置按钮
            reset(){    
                const _this = this;
                _this.queryParams = {
                    pageNums:config.pageNums,
                    cardUseTypeCode: '',
                }
                _this.cardExpire = []
                _this.salesTime = []
                _this.$refs.area.reset()                
                _this.$refs.area.resetToStart() 
                _this.$refs.carInfo.clear()
            },
            //查询按钮
            query(){
                const _this = this;
                if(_this.cardExpire.length!=0){
                    let arr = common.formattingTime(_this.cardExpire)
                    _this.queryParams.startDate = arr.startTime
                    _this.queryParams.endDate = arr.endTime 
                    if(arr.startTime == "1970-01-01"){
                        _this.queryParams.startDate = ""
                    }
                    if(arr.endTime == "1970-01-01"){
                        _this.queryParams.endDate = ""  
                    }                   
                }
                if(_this.salesTime.length!=0){
                    let arr = common.formattingTime(_this.salesTime)
                    _this.queryParams.salesStartTime = arr.startTime                                                            
                    _this.queryParams.salesEndTime = arr.endTime                                                            
                    if(arr.startTime == "1970-01-01"){
                        _this.queryParams.salesStartTime = ""                                                          
                    }
                    if(arr.endTime == "1970-01-01"){
                        _this.queryParams.salesEndTime = ""                                                  
                    }
                    
                }
                _this.queryParams.pageStart = 1  
                _this.queryCardSalesOrderInfos()
            },
            queryCardSalesOrderInfos(){
                const _this = this;
                api.cardSale.queryCardSalesOrderInfos(_this.queryParams,(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.setCardSaleOrder(msg.data.obj)
                    }
                })
            },
            // 对卡查询 卡销售
            newAdd() {
                // this.$router.push({
                //     path: 'card-sale-query'
                // })
                this.$refs.selectCardModal.show()
            },
            update() {
                if(this.selectIndex == -1) {
                    Message({
                        type: 'warning',
                        message: '请选择数据！'
                    })
                    return 
                }
                this.$router.push({
                    path: 'edit',
                    query: {
                        pageState: 1,
                        cardNo: this.tableList[this.selectIndex].cardNo,
                        cardName: this.tableList[this.selectIndex].cardName,
                        cardSalesOrderNo: this.tableList[this.selectIndex].cardSalesOrderNo,
                    }
                })
            },
            checkData(index) {
                const _this = this;
                this.selectIndex = index
                _this.invoiceContentSuffix = _this.tableList[this.selectIndex].cardName
            },
            // 对某一条作废
            deleteItem() {
                const _this = this;
                if(!(this.selectIndex == -1)){
                    if(this.tableList[this.selectIndex].orderStatus == 0) {
                        this.$router.push({
                            path: 'edit',
                            query: {
                                pageState: 1,
                                cardNo: this.tableList[this.selectIndex].cardNo,
                                cardName: this.tableList[this.selectIndex].cardName,
                                cardSalesOrderNo: this.tableList[this.selectIndex].cardSalesOrderNo,
                            }
                        })
                    }else if(this.tableList[this.selectIndex].orderStatus == 1) {
                        Message({
                            type: 'warning',
                            message: '此销售单已结算不可作废'
                        })
                    }else if(this.tableList[this.selectIndex].orderStatus == -1) {
                        Message({
                            type: 'warning',
                            message: '此销售单已作废'
                        })
                    }

                    // api.cardSale.toVoid({
                    //     cardSalesOrderNo:_this.tableList[this.selectIndex].cardSalesOrderNo,
                    //     id:_this.tableList[this.selectIndex].id
                    // },(msg)=>{
                    //     if(msg.data.message == 'success'){
                    //         Message({
                    //             type: 'success',
                    //             message: '操作成功！'
                    //         });
                    //     }
                    // })
                }else{
                    Message({
                        type: 'warning',
                        message: '请选择数据！'
                    });
                }
                
            },
            conOpenTicket(value){
                const _this = this;
                getSequence(CARD_SALE_INVOICE_SEQ, res => {
                    value.invoiceCode = res
                    value.cardSalesOrderNo=_this.tableList[this.selectIndex].cardSalesOrderNo,                    
                    value.cardNo = _this.tableList[this.selectIndex].cardNo
                    value.invoiceContentCode = "CardSales"
                    value.invoiceTypeCode = JSON.parse(value.invoiceType).value
                    let userInfo = sessionStorage.getItem("userInfo");  
                    if(userInfo){
                        value.invoiceEmpCode = JSON.parse(userInfo).empVo.empCode   
                    }
                    value.invoiceStatus = 0
                    value.isSyncExternalSystem = 0
                    api.cardSale.editCardSalesInvoice([value],(msg)=>{
                        if(msg.data.message == 'success'){
                            Message({
                                type: 'success',
                                message: '操作成功！'
                            });
                        }
                    })
                }) 
                
            },
            // 对某一条开票
            printTicket() {
                const _this = this;
                if(!(this.selectIndex == -1)) {
                    // _this.$refs.ticket.show()
                    if(this.tableList[this.selectIndex].orderStatus == 1) {
                        this.$router.push({
                            path: 'edit',
                            query: {
                                pageState: 1,
                                cardNo: this.tableList[this.selectIndex].cardNo,
                                cardName: this.tableList[this.selectIndex].cardName,
                                cardSalesOrderNo: this.tableList[this.selectIndex].cardSalesOrderNo,
                            }
                        })
                    }else {
                        Message({
                            type: 'warning',
                            message: '此销售单已结算才可开票'
                        })
                    }
                }else{
                    Message({
                        type: 'warning',
                        message: '请选择数据！'
                    });
                }
            },
            //区域选择门店
            selectedfun(data, data1) {
                const _this = this;
                const options = {
                    storeCodeSet: []
                };
                if(data1 instanceof Array){
                    _this.queryParams.storeCodes = []
                    for (let i = 0; i < data1.length; i++) {
                        _this.$set(_this.queryParams.storeCodes, i, data1[i].value)              
                    }
                }else{
                    options.storeCodeSet.push(data1.value);
                    _this.queryParams.storeCodes = [data1.value]
                    // 根据经销商店获取仓库
                    api.getEntrepot(options, function(res) {
                        if (res.data.code === "success") {
                        const array = res.data.obj;
                        const arr = [];
                        for (var i = 0; i < array.length; i++) {
                            let obj = {};
                            obj.text = array[i].warehouseName;
                            obj.value = array[i].warehouseCode;
                            arr.push(obj);
                        }
                        _this.entreList = arr;
                        }
                    });
                }
            },
            cardUseTypeCodeChange(value){
                const _this = this
                if(value == 'CRecorder'){
                    _this.queryParams.factoryCode = ""
                    _this.queryParams.brandCode = ""
                    _this.queryParams.seriesCode = ""
                    _this.queryParams.modelCode = ""
                    _this.queryParams.opvCode = ""
                    _this.queryParams.iotypeCode = ""
                }
            },
            carSelect(val) {
                const _this = this;
                _this.queryParams.factoryCode = val.factoryCode
                _this.queryParams.brandCode = val.brandCode
                _this.queryParams.seriesCode = val.seriesCode
                _this.queryParams.modelCode = val.modelCode
                _this.queryParams.opvCode = val.opvCode
                _this.queryParams.iotypeCode = val.iotypeCode
            },
            //查询数据字典
            getDataDictionarys(code,cb = ()=>{}){
                const _this = this;
                api.ref.getDataDictionarys({
                    refCode: code
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        let data  = msg.data.obj.referenceDetailInfos
                        let list = [{text:"全部",value:""}]
                        for (let i = 0; i < data.length; i++) {
                            list[i+1] = {
                                text:data[i].refDetailName,
                                value:data[i].refDetailCode
                            }
                        }
                        cb(list)
                    }
                })
            }
        },
        mounted(){
            const _this = this;
            _this.getDataDictionarys('CardUserType',(msg)=>{
                _this.carTypeList = msg
            })
        }
    }
</script>
<style scoped>

</style>


