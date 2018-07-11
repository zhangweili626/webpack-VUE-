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
                    <b-form-fieldset horizontal label="券类型" label-text-align="right" :label-cols="4">
                        <b-form-select :disabled="true" v-model="queryParams.couponTypeCode" :options="userTypeList"/>
                    </b-form-fieldset>
                </div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="券使用方" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.couponUseTypeCode" @change="couponUseTypeCodeChange" :options="couponUseTypeList"></b-form-select>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="券号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.couponNo"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="销售单状态" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.orderStatus" :options="saleOderStateList"></b-form-select>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="销售单号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.couponSalesOrderNo"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="销售人" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.salesEmpName"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="使用性质" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.useNatureTypeCode" :options="useNatureType"></b-form-select>                        
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="有效期类型" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.couponExpireType" :options="validityTermType"></b-form-select>                        
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="券有效期时间" label-text-align="right" :label-cols="4">
                            <el-date-picker
                            v-model="couponExpire"
                            type="daterange"
                            align="right"
                            placeholder="选择日期范围"
                            :picker-options="pickerOptions2">
                            </el-date-picker>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="销售时间" label-text-align="right" :label-cols="4">
                        <el-date-picker
                        v-model="salesTime"
                        type="daterange"
                        align="right"
                        placeholder="选择日期范围"
                        :picker-options="pickerOptions1">
                        </el-date-picker>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4" v-if="queryParams.couponUseTypeCode == 'CarOwnerVoucher'">
					<b-form-fieldset horizontal label="客户姓名" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.customName"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4" v-if="queryParams.couponUseTypeCode == 'CarOwnerVoucher'">
					<b-form-fieldset horizontal label="手机号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.mobilePhone"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4" v-if="queryParams.couponUseTypeCode == 'VehicleVoucher'">
					<b-form-fieldset horizontal label="VIN码" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.vinCode"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset  horizontal label="发票号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.invoiceNos"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4" v-if="queryParams.couponUseTypeCode == 'VehicleVoucher'">
					<b-form-fieldset horizontal label="车牌号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.plateNumber"></b-form-input>
					</b-form-fieldset>
				</div>
			</div>
			<car-info v-if="queryParams.couponUseTypeCode == 'VehicleVoucher'" :flag="carFlag" @callBack="carSelect" :col='3' ref="carInfo"></car-info>                
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
                        <b-button size="sm" variant="success" @click="showCouponsModal">券销售</b-button>
                        <b-button size="sm" variant="danger" @click="deleteItem">作废</b-button>
                        <b-button size="sm" variant="primary" @click="printTicket">开票</b-button>
                        <b-button size="sm" variant="primary" @click="update">编辑</b-button>
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
                    <template slot="couponNo" slot-scope="data">
                        <router-link :to="{
                        path: 'detail',
                        query: {
                            pageState: 2,
                            couponNo: data.item.couponNo,
                            couponName: data.item.couponName,
                            couponSalesOrderNo: data.item.couponSalesOrderNo,
                        }
                    }">{{data.item.couponNo}}</router-link>
                    </template>
                    <template slot="couponName" slot-scope="data">
                        {{data.item.couponName}}
                    </template>
                    <template slot="couponSalesOrderNo" slot-scope="data">
                        {{data.item.couponSalesOrderNo}}
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
                    <template slot="couponExpireType" slot-scope="data">
                        {{data.item.couponExpireType == 0?'固定时长':'有效期限'}}
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
                    <template slot="couponStatus" slot-scope="data">
                        <span v-if="data.item.couponStatus == 0">未销售</span>
                        <span v-if="data.item.couponStatus == 1">挂售中</span>
                        <span v-if="data.item.couponStatus == 2">已销售</span>
                        <span v-if="data.item.couponStatus == 8">退卡中</span>
                        <span v-if="data.item.couponStatus == 9">已退卡</span>
                        <span v-if="data.item.couponStatus == -1">已作废</span>
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
        <select-coupons ref="selectCouponsModal" @select="selectCoupons"></select-coupons>
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
import { CARD_SALE_SORDER_SEQ, CARD_SALE_INVOICE_SEQ, CARD_SALE_PAYMENT_SEQ, COUPON_SALES_ORDER_SEQ } from 'common/sequence'
import { getSequence, alertSuccess, getDateRange, formatDate, dateDiff, getType } from 'common/api-common'
import SelectCoupons from './select-coupons'
Vue.use(DatePicker)
    export default {
        data() {
            return {
                queryParams:{
                    cardUseTypeCode: '',
                    couponTypeCode: 'DiscountCoupons',
                    pageNums:config.pageNums,
                },
                couponUseTypeList:[],
                userTypeList: [],
				carFlag: config.carFlag,                
                carTypeList:[],
                saleOderStateList:[{
                    text:'全部',
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
                    text:'全部',
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
                    couponNo:{
                        label: "券号"                        
                    },
                    couponName:{
                        label: "券名称"                        
                    },
                    couponSalesOrderNo:{
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
                    couponExpireType:{
                        label: "券有效类型"                        
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
                    couponStatus:{
                        label: "券状态"                        
                    },
                    invoiceNos:{
                        label: "发票号"                        
                    },
                    // customName:{
                    //     label: "客户姓名"                        
                    // },
                    // mobilePhone:{
                    //     label: "手机号码"                        
                    // },
                    // plateNumber:{
                    //     label: "车牌"                        
                    // },
                    // vinCode:{
                    //     label: "VIN码"                        
                    // },
                    // factoryName:{
                    //     label: "厂家"                        
                    // },
                    // brandName:{
                    //     label: "品牌"                        
                    // },
                    // seriesName:{
                    //     label: "车系"                        
                    // },
                    // modelName:{
                    //     label: "车型"                        
                    // },
                    // opvName:{
                    //     label: "排量"                        
                    // },
                    // iotypeName:{
                    //     label: "进气方式"                        
                    // },
                },
                pickerOptions2: {
                },
                couponExpire:[],
                pickerOptions1: {
                },
                salesTime:[],
                selectIndex: -1,
                useNatureType:[],
                tableList:[],
                pageData:{}
            }
        },
        computed:{
            ...mapState('demandOrder',[
                'cardSaleOrderList',
                'cardSaleOrderPage',
            ]),
            // tableList:function(){
            //     return JSON.parse(JSON.stringify(this.cardSaleOrderList))
            // },
            // pageData:function(){
            //     return JSON.parse(JSON.stringify(this.cardSaleOrderPage))            
            // },
        },
        components:{
            AreaTree,
            carInfo,
            pagination,
            SelectCoupons
        },
        methods: {
            selectCoupons(couponList, couponStoreInfo) {
                sessionStorage.setItem("couponList", JSON.stringify(couponList))
                sessionStorage.setItem("couponStoreInfo", JSON.stringify(couponStoreInfo))
                getSequence(COUPON_SALES_ORDER_SEQ, res => {
                    this.$router.push({
                        path: 'insert',
                        query: {
                            pageState: 0,
                            couponSalesOrderNo: res
                        }
                    })
                })                
            },
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
                    couponTypeCode: 'DiscountCoupons',
                }
                _this.couponExpire = []
                _this.salesTime = []
                _this.$refs.area.reset()                
                _this.$refs.area.resetToStart() 
                _this.$refs.carInfo.clear()
            },
            //查询按钮
            query(){
                const _this = this;
                if(_this.couponExpire.length!=0){
                    let arr = common.formattingTime(_this.couponExpire)
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
                api.couponSale.queryCouponSalesOrderInfosByInvoice(_this.queryParams,(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.tableList = msg.data.obj.list
                        _this.pageData = msg.data.obj
                        // _this.setCardSaleOrder(msg.data.obj)
                    }
                })
            },
            showCouponsModal() {
                this.$refs.selectCouponsModal.show()
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
                        couponNo: this.tableList[this.selectIndex].couponNo,
                        couponName: this.tableList[this.selectIndex].couponName,
                        couponSalesOrderNo: this.tableList[this.selectIndex].couponSalesOrderNo,
                    }
                })
            },
            checkData(index) {
                const _this = this;
                this.selectIndex = index
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
                                couponNo: this.tableList[this.selectIndex].couponNo,
                                couponName: this.tableList[this.selectIndex].couponName,
                                couponSalesOrderNo: this.tableList[this.selectIndex].couponSalesOrderNo,
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
                }else{
                    Message({
                        type: 'warning',
                        message: '请选择数据！'
                    });
                }
                
            },
            // 对某一条开票
            printTicket() {
                const _this = this;
                if(!(this.selectIndex == -1)) {
                    if(this.tableList[this.selectIndex].orderStatus == 1) {
                        this.$router.push({
                            path: 'edit',
                            query: {
                                pageState: 1,
                                couponNo: this.tableList[this.selectIndex].couponNo,
                                couponName: this.tableList[this.selectIndex].couponName,
                                couponSalesOrderNo: this.tableList[this.selectIndex].couponSalesOrderNo,
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
            couponUseTypeCodeChange(value){
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
            _this.getDataDictionarys('CouponUserType', (msg) => {
                _this.couponUseTypeList = msg
            })
            _this.getDataDictionarys('CouponType', (msg) => {
                _this.userTypeList = msg
            })
            _this.getDataDictionarys('UseProperty', (msg) => {
                _this.useNatureType = msg
            })
            
        }
    }
</script>
<style scoped>

</style>


