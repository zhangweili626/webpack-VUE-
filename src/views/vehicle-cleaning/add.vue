<template>
    <div class="card vehicle-cleaning">
        <div class="card-header">
            <span>新建快速洗车单</span>
            <span class="ml-4">洗车单号：{{param.orderNo || ''}}</span>
            <span class="ml-3">门店：{{param.storeName || ''}}</span>
            <span class="ml-3">接待人：{{param.empCnName}}</span>
            <span class="ml-3">开单日期：{{param.createTimeStr}}</span>
            <span class="ml-3">订单业务类型：{{refDetailName}}</span>
        </div>
        <b-card class="mb-0" style="border:none;">
            <div class="row mb-2">
                <div class="row col-md-6 col-lg-6">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset label="车主手机号" label-text-align="left" :label-cols="2">
                            <input class="form-control" :disabled="accomplishFlag" v-model="param.mobilePhone" @input="mobilePhoneChange" @blur="mobilePhoneSucces" type="text">
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset label="客户姓名" label-text-align="left" :label-cols="2">
                            <div class="form-control">{{customerInfo.customName}}&nbsp;</div>
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row col-md-6 col-lg-6">
                    <div class="col-md-10 col-lg-10">
                        <b-form-fieldset v-if="!(!fold && !haveCar)" label="&nbsp;" class="pt-2" label-text-align="left" :label-cols="2">
                            <div v-if="fold">
                                <input type="checkbox" :disabled="accomplishFlag" v-model="haveCar"/>
                                不采集车辆信息
                            </div>
                            <div v-if="!fold && haveCar">
                                <span>持有卡<a  class="ml-2" href="javascript:;" @click="showCardModal">{{holdingCard}}</a></span>
                                <span class="ml-2">持有券<a class="ml-2 vehicle-cleaning-red" href="javascript:;" @click="showTicketModal">{{holdingCoupon}}</a></span>
                            </div>
                        </b-form-fieldset>
                        <div class="mr-2" v-if="!fold && !haveCar">
                            <h4>{{mancarInfo.plateNumber}}</h4>
                            <span style="width:220px;display: inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" class="mr-4">{{mancarInfo.displayName}}</span>
                            <span>持有卡<a  class="ml-2" href="javascript:;" @click="showCardModal">{{holdingCard}}</a></span>
                            <span class="ml-2">持有券<a class="ml-2 vehicle-cleaning-red" href="javascript:;" @click="showTicketModal">{{holdingCoupon}}</a></span>
                        </div>
                    </div>
                    <div class="col-md-2 col-lg-2">
                        <b-form-fieldset label="&nbsp;" class="pt-2" label-text-align="left" :label-cols="2">
                            <div class="text-right">
                                <a v-if="fold"  href="javascript:;" @click="foldClick">收起 -</a>
                                <a v-if="!fold" href="javascript:;" @click="foldClick">展开+</a>
                            </div>
                        </b-form-fieldset>
                    </div>
                </div>
            </div>
            <div class="row mt-4" v-show="fold && !haveCar">
                <div class="row col-md-6 col-lg-6">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset label="请输入车牌号" label-text-align="left" :label-cols="2">
                            <plate :disabledState="accomplishFlag" v-model="mancarInfo.plateNumber" @losefocus="plateNumberBlur"></plate>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset label="最近一次进厂时间" label-text-align="left" :label-cols="2">
                            <div>{{lastOnce.closingDate || param.createTimeStr}}&nbsp;</div>
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row col-md-6 col-lg-6">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset label="最近一次进厂门店" label-text-align="left" :label-cols="2">
                            <div>{{lastOnce.storeName}}&nbsp;</div>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset label="最近一次消费金额" label-text-align="left" :label-cols="2">
                            <div>{{lastOnce.actualAmountTotal}}&nbsp;</div>
                        </b-form-fieldset>
                    </div>
                </div>
            </div>
            <div class="mt-4 vehicle-cleaning-el-card__body"  v-show="fold && !haveCar">
            <div class="row">
                <div class="col-md-7 col-lg-7 row pl-4">
                    <div class="col-md-4 col-lg-4">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <i class="iconfont icon-baoyanglichengcopy mr-2" style="font-size:18px;"></i>
                                <span>保养里程</span>
                            </div>
                            <b-form-fieldset  label="进店里程数" label-text-align="left" :label-cols="5">
                                <input :disabled="accomplishFlag" class="form-control" v-model="mancarInfo.inMileage" @blur="updateCustomVehicleInfo" type="text">
                            </b-form-fieldset>
                            <b-form-fieldset  label="下次保养里程数" label-text-align="left" :label-cols="5">
                                <div class="form-control">{{mancarInfo.nextMaintenanceMileage}}&nbsp;</div>
                            </b-form-fieldset>
                            <b-form-fieldset  label="离下次保养天数" label-text-align="left" :label-cols="5">
                                <div class="form-control">&nbsp;</div>
                            </b-form-fieldset>
                        </el-card>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <i class="iconfont icon-baoyangcopy mr-2" style="font-size:18px;"></i>
                                <span>保修</span>
                            </div>
                            <b-form-fieldset   label="离保修到期天数" label-text-align="left" :label-cols="5">
                                <div class="form-control">&nbsp;</div>
                            </b-form-fieldset>
                            <b-form-fieldset  label="保修到期日期" label-text-align="left" :label-cols="5">
                                <div class="form-control">&nbsp;</div>
                            </b-form-fieldset>
                        </el-card>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <i class="iconfont icon-baoxiancopy mr-2" style="font-size:18px;"></i>
                                <span>保险</span>
                            </div>
                            <b-form-fieldset  label="商业险公司" label-text-align="left" :label-cols="5">
                                <div class="form-control">{{mancarInfo.commercialInsuranceCompanyName}}&nbsp;</div>
                            </b-form-fieldset>
                            <b-form-fieldset  label="保险到期日" label-text-align="left" :label-cols="5">
                                <div class="form-control">{{mancarInfo.commercialInsuranceEndDate}}&nbsp;</div>
                            </b-form-fieldset>
                            <b-form-fieldset  label="交强险公司" label-text-align="left" :label-cols="5">
                                <div class="form-control">{{mancarInfo.compulsoryInsuranceCompanyName}}&nbsp;</div>
                            </b-form-fieldset>
                            <b-form-fieldset  label="保险到期日" label-text-align="left" :label-cols="5">
                                <div class="form-control">{{mancarInfo.compulsoryInsuranceEndDate}}&nbsp;</div>
                            </b-form-fieldset>
                        </el-card>
                    </div>
                </div>
                <div class="col-md-5 col-lg-5 pr-0">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <i class="iconfont icon-xinxicopy mr-2" style="font-size:18px;"></i>
                            <span>信息</span>
                        </div>
                        <userInfo v-model="fileList"  :disabled="accomplishFlag" :holdingCoupon="holdingCoupon" :holdingCard="holdingCard"  @showTicketModal="showTicketModal" @modalShow="showCardModal" :customerInfo="customerInfo"></userInfo>
                    </el-card>
                </div>
            </div>
            </div>
            <div class="row" v-if="fold && haveCar">
                <div class="col-md-12 col-lg-12">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>信息</span>
                        </div>
                        <div class="row">
                            <div class="col-md-5 col-lg-5 pull-left">
                                <userInfo v-model="fileList" :disabled="accomplishFlag" :holdingCoupon="holdingCoupon"  :holdingCard="holdingCard"  @showTicketModal="showTicketModal" @modalShow="showCardModal" :iscardvoucher="false" :customerInfo="customerInfo"></userInfo>
                            </div>
                            <div class="col-md-3 col-lg-3 pull-left">
                            </div>
                            <div class="col-md-4 col-lg-4">
                                <b-form-fieldset horizontal label="最后一次进厂时间" label-text-align="left" :label-cols="5">
                                    <div class="form-control">{{lastOnce.closingDate || param.createTimeStr}}&nbsp;</div>
                                </b-form-fieldset>
                                <b-form-fieldset horizontal label="最后一次进厂门店" label-text-align="left" :label-cols="5">
                                    <div class="form-control">{{lastOnce.storeName}}&nbsp;</div>
                                </b-form-fieldset>
                                <b-form-fieldset horizontal label="最后一次消费金额" label-text-align="left" :label-cols="5">
                                    <div class="form-control">{{lastOnce.actualAmountTotal}}&nbsp;</div>
                                </b-form-fieldset>
                                <span>持有卡<a  class="ml-2" href="javascript:;" @click="showCardModal">{{holdingCard}}</a></span>
                                <span class="ml-2">持有券<a class="ml-2 vehicle-cleaning-red" href="javascript:;" @click="showTicketModal">{{holdingCoupon}}</a></span>
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
        </b-card>
        <div class="p-4"> 
            <div class="clearfix mb-2">
                 <div class="card-head-left">
                    <span></span>
                    <span>项目确认</span>
                </div>
                <div class="card-head-right">
                    <span></span>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <tabs-carousel ref="carousel" :isDisabled="isDisabled || accomplishFlag" @disabledEnent="disabledEnent" :apiName="serviceItemApi" :itemName="'serviceName'" :addParam="serviceItemAddParam" @seletItem="getServiceItem"></tabs-carousel>
                    </div>
                    <div class="pull-right mt-4">
                        <!-- 记帐类型为0的时候不能添加卡或者券不能填写折扣 -->
                        <b-button :disabled="accomplishFlag" v-if="!isDisabled && !have" v-show="param.accountTypeCode=='normalSale'" class="user-defined" size="sm" variant="default" @click="addCard"><i style="color:#f86c6b;font-size:20px;" class="iconfont icon-shiyongqiacopy mr-2"></i> 使用卡<i class="el-breadcrumb__separator el-icon-arrow-right"></i></b-button>
                        <b-button :disabled="accomplishFlag" v-if="!isDisabled" class="user-defined" size="sm" variant="default" @click="resetService"><i style="color:#f86c6b;font-size:20px;" class="iconfont icon-zhongzhixiangmucopy mr-2"></i>重置项目</b-button>
                    </div>
                </div>
            </div>
            <div class="table-scrollable table-scrollable2 mb-2">
                <b-table style="border:1px solid #c2cfd6" striped hover bordered show-empty :items="tableList" :fields="fields">
                    <template slot="serviceName" slot-scope="data">
                        {{data.item.serviceName}}
                    </template>
                    <template slot="accountType" slot-scope="data">
                        <div v-if="data.item.cardNo || data.item.couponNo"  style="width: 100px;background-color:#c2cfd6;" class="form-control">{{data.item.accountTypeName}}</div>
                        <div class="row" v-if="!data.item.cardNo && !data.item.couponNo">
                            <div class="col-md-6 col-lg-6" style="padding-right:0;">
                                <b-form-select  :disabled="have || accomplishFlag" style="width:250px;" v-model="data.item.accountTypeCode" @input="accountTypeChange(data.item.accountTypeCode)" :options="accountTypeList"/>   
                            </div>
                            <div class="col-md-6 col-lg-6" style="padding-left:8px;">
                                <org-tree :disabled="accomplishFlag"  :orgCode="orgCode" v-if="data.item.accountTypeCode == 'dealerPay'" @getOrgCode="getOrg" :params='{code:data.item.reconciliationTargetCode,orgName:data.item.reconciliationTargetName}'></org-tree>	
                            </div>
                        </div>
                    </template>
                    <template slot="catlogName" slot-scope="data">
                        {{data.item.catlogNameLevel4||data.item.catlogNameLevel3||data.item.catlogNameLevel2||data.item.catlogNameLevel1||data.item.catlogName}}
                    </template>
                    <template slot="originalSalesPrice" slot-scope="data">
                        {{data.item.originalSalesPrice}}
                    </template>
                    <template slot="actualSalesPrice" slot-scope="data">
                        {{data.item.actualSalesPrice}}
                    </template>
                    <template slot="discount" slot-scope="data">
                        <div class="row">
                            <div class="col-md-9">
                                <input :disabled="haveCarTicket || accomplishFlag" class="form-control" v-model="data.item.discount" @blur="discount" type="text">
                            </div>
                        </div>
                    </template>
                    <template slot="discountMoney" slot-scope="data">
                        <div v-if="data.item.discountMoney < 0">{{0}}</div>
                        <input v-if="data.item.discountMoney >= 0" :disabled="haveCarTicket || accomplishFlag" class="form-control" v-model="data.item.discountMoney" @blur="discountMoney" type="text">
                    </template>
                    <template slot="workEmp" slot-scope="data">
                        <search
                            ref="empCode"
                            :hasCheck="required"
                            :dataList="Datalist"
                            option="empCnName"
                            :disabled="accomplishFlag"
                            @dataChange="QuerySelect"
                            @itemValue="ItemValue"
                            @clickShowBack="FirstLoad"
                            @comScroll="ComScroll"
                            @clearValue="ClearValue"
                            >
                        </search>
                    </template>
                    <template slot="cardCouponNo" slot-scope="data">
                        {{data.item.couponNo||data.item.cardNo || '未添加'}}
                    </template>
                    <template slot="cardCouponName" slot-scope="data">
                        {{data.item.couponName||data.item.cardName || '未添加'}}
                    </template>
                    <template slot="empty">
                        暂无数据...
                    </template>
                </b-table>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button :disabled="accomplishFlag" class="user-defined" size="sm" variant="primary" @click="accomplish">竣工</b-button>
                    </div>
                </div>
            </div>
        </div>
        <card-modal ref="cardModal"  :isShowChoose="isShowChoose" :acceptObj="acceptObj" @use="recieveDataCard"></card-modal>
        <ticket-modal ref="ticketModal" :isShowChoose="isShowChoose" :acceptObj="acceptObj" @use="recieveDataTicket"></ticket-modal>
        <customerVehicle  :plateNumber="addPlateNumber" ref="ctmvhc" @selectCusVehicleInfo="selectCusVehicleInfo" :mobilePhone="mobilePhone" :cardUseTypeCode="cardUseTypeCode"></customerVehicle>
    </div>
</template>
<script>
import Vue from 'vue'
import config from 'common/config.js'
import api from 'common/api.js'
import userInfo from './components/user-info.vue'
import { Card , Switch, Table, TableColumn, Message} from 'element-ui'
import customerVehicle from 'components/customer-vehicle/customer-vehicle.vue'
import search from "components/iris-search/search.vue";
import cardModal from 'components/iris-card-modal'
import tabsCarousel from "components/iris-tabscarousel";
import orgTree from 'views/staff/orgTree'
import ticketModal from 'components/iris-ticket-modal'
import plate from 'components/iris-plate'
Vue.use(Card)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
export default {
    components: {
        userInfo,
        customerVehicle,
        search,
        cardModal,
        tabsCarousel,
        orgTree,
        ticketModal,
        plate
    },
    data() {
        return {
            fileList:[],
            serviceItemAddParam: {
                storeCode: 'STORE2000905',
            },
            accountTypeList:[
            ],
            //服务组件参数
            serviceItemApi: 'vehicleCleaning.queryIsCarWashAndPriceServiceInfo',
            fields:{
                serviceName: {
                    label: "服务项目"
                },
                accountType:{
                    label: "记帐类型"
                },
                catlogName:{
                    label: "分类"
                },
                originalSalesPrice:{
                    label: "门市价"
                },
                discount:{
                    label: "店长折扣（%）"
                },
                discountMoney:{
                    label: "折扣金额"
                },
                actualSalesPrice:{
                    label: "折后价"
                },
                workEmp:{
                    label: "施工人"
                },
                cardCouponNo:{
                    label: "卡号/券号"
                },
                cardCouponName:{
                    label: "卡/券名称"
                },
            },
            //默认展开
            fold:true,
            //默认采集车辆信息
            haveCar:false,
            isDisabled:true,
            //列表
            tableList:[],
            columW: config.demandOrder.columW,
            //快速洗车单
            param:{
                mobilePhone:null,
                empCnName:"",
                orderNo:null,
                createTimeStr:"",
                accountTypeCode:'normalSale'
            },
            //服务明细
            serviceDetail:{

            },
            //人车组件手机号
            mobilePhone:null,
            //人车组件车辆卡车主卡
            cardUseTypeCode:'VehicleCard',
            //最后一次对象
            lastOnce:{
                storeName:null,
                closingDate:null,
                actualAmountTotal:null
            },
            //客户信息
            customerInfo:{
                birthday:null,
                email:null,
                idNo:null,
                certificateProperty1:null,
                firstGetDate:null,
                expireDate:null
            },
            //人车信息
            mancarInfo:{
                customerName:""
            },
            required:false,
            Datalist:[],
            selectParams: {
                pageNums: config.pageNums,
                pageStart: 1,
            },
            addPlateNumber:"",
            acceptObj:{
                storeCode: "",
                customCode: "",
                vehicleCode: "",
            },
            holdingCard:0,
            holdingCoupon:0,
            //服务第一次flag
            OffFlag:false,
            orgCode:null,
            isShowChoose:false,
            serviceItem:{},
            have:false,
            haveCarTicket: false,
            refDetailName:'',
            accomplishFlag:false,
            // add by lwx on 2018/07/10
            cardParams: {
                customCode: ''
            }
        }
    },
    methods: {
        queryAllServiceOrderInfo(){
            const _this = this;
            api.vehicleCleaning.queryAllServiceOrderInfo({
                serviceOrderNo:_this.param.serviceOrderNo,
                storeCode:_this.selectParams.storeCode,
                isDeleted:0
                },(msg)=>{
                if(msg.data.message == 'success'){
                    let data = msg.data.obj
                    _this.tableList = data.serviceOrderDetailInfoList
                    _this.$refs.empCode.setValue(data.serviceOrderDetailInfoList[0].workEmpName)
                }
            })
        },
        //券立即使用
        recieveDataTicket(value) {
            const _this = this;
            api.vehicleCleaning.updateServiceOrderDetailInfoForDisCount({
            orderNo:_this.param.orderNo,
            serviceOrderNo:_this.param.serviceOrderNo,
            couponNo:value.couponNo
            },(msg)=>{
            if(msg.data.message == 'success'){
                Message({
                    type: 'success',
                    message: "操作成功"
                });
                _this.have = true
                _this.haveCarTicket = true 
                _this.queryAllServiceOrderInfo()
                // _this.$set(_this.tableList[0],'cardNo',value.couponNo)
                // _this.$set(_this.tableList[0],'cardName',value.couponName   )

            }                        
        })
        },
        //卡立即使用
        recieveDataCard(value) {
            const _this = this;
         api.vehicleCleaning.updateServiceOrderDetailInfoForDisCount({
            orderNo:_this.param.orderNo,
            serviceOrderNo:_this.param.serviceOrderNo,
            serviceOrderDetailCode:_this.param.serviceOrderDetailCode,
            cardNo:value.cardNo
            },(msg)=>{
            if(msg.data.message == 'success'){
                Message({
                    type: 'success',
                    message: "操作成功"
                });
                _this.have = true
                _this.haveCarTicket = true 
                _this.queryAllServiceOrderInfo()
                // _this.$set(_this.tableList[0],'cardNo',value.cardNo)
                // _this.$set(_this.tableList[0],'cardName',value.cardName   )

            }                        
        })
        },
        //添加券
        addTicket(){
            const _this = this;
            _this.isShowChoose = true
            _this.acceptObj.detailCodes = _this.detailCodes
            _this.acceptObj.storeCode = _this.selectParams.storeCode
            _this.acceptObj.customCode = _this.customerInfo.customCode
            _this.acceptObj.vehicleCode = _this.mancarInfo.vehicleCode
            _this.$refs.ticketModal.getFirstData(_this.acceptObj)
            _this.$refs.ticketModal.showTicketModal()
        },
        //添加卡
        addCard(){
            const _this = this;
            _this.isShowChoose = true
            _this.acceptObj.detailCodes = _this.detailCodes
            _this.acceptObj.storeCode = _this.selectParams.storeCode
            _this.acceptObj.customCode = _this.customerInfo.customCode
            _this.acceptObj.vehicleCode = _this.mancarInfo.vehicleCode
            _this.$refs.cardModal.modalShow()
            _this.$refs.cardModal.getFirstData(_this.acceptObj)
        },
        //记帐类型变化
        accountTypeChange(value){
            const _this = this;
            // setTimeout(()=>{
                _this.$set(_this.param,'accountTypeCode',value)
                if(value == 'dealerPay'){
                    _this.haveCarTicket = true 
                    _this.$set(_this.tableList[0],'discount',0)
                    _this.$set(_this.tableList[0],'actualSalesPrice',0)
                    // 经销商
                    // api.vehicleCleaning.updateServiceOrderDetailInfoForDisCount({
                    //     orderNo:_this.param.orderNo,
                    //     serviceOrderNo:_this.param.serviceOrderNo,
                    //     serviceOrderDetailCode:_this.param.serviceOrderDetailCode,
                    //     accountTypeCode:value,
                    //     reconciliationTargetCode:_this.tableList[0].applyOrgCode,
                    //     reconciliationTargetName:_this.tableList[0].applyOrgName,
                    //     },(msg)=>{
                    //     if(msg.data.message == 'success'){
                    //         Message({
                    //             type: 'success',
                    //             message: "操作成功"
                    //         });
                    //     }                        
                    // })
                }else if(value == 'normalSale'){
                    //自费
                    _this.haveCarTicket = false 
                    api.vehicleCleaning.updateServiceOrderDetailInfoForDisCount({
                        orderNo:_this.param.orderNo,
                        serviceOrderNo:_this.param.serviceOrderNo,
                        serviceOrderDetailCode:_this.param.serviceOrderDetailCode,
                        accountTypeCode:value,
                        },(msg)=>{
                        if(msg.data.message == 'success'){
                            Message({
                                type: 'success',
                                message: "操作成功"
                            });
                        }                        
                    })
                }
            // },100)
        },
        //服务走马灯禁用的时候点击
        disabledEnent(){
            const _this = this;
            if(!this.accomplishFlag){
                Message({
                    type: 'warning',
                    message: "请补全车主/车辆信息！"
                });
            }
            
        },
        //折扣金额发生变化
        discountMoney(){
            const _this = this;
            if(!_this.tableList[0].discountMoney){
                Message({
                    type: 'warning',
                    message: "请填写正确的折扣！"
                });
            }else{
                let discountMoney = parseFloat(_this.tableList[0].discountMoney)
                if(discountMoney <= _this.tableList[0].originalSalesPrice && discountMoney <= _this.tableList[0].maxDisCountPrice && discountMoney >= 0){
                    _this.$set(_this.tableList[0],'discount',(100-(_this.tableList[0].discountMoney*100)/(_this.tableList[0].originalSalesPrice)).toFixed(0))
                    _this.$set(_this.tableList[0],'actualSalesPrice',(_this.tableList[0].originalSalesPrice - _this.tableList[0].discountMoney).toFixed(2))
                    api.vehicleCleaning.updateServiceOrderDetailInfoForDisCount({
                        orderNo:_this.param.orderNo,
                        serviceOrderNo:_this.param.serviceOrderNo,
                        serviceOrderDetailCode:_this.param.serviceOrderDetailCode,
                        discountMoney:_this.tableList[0].discountMoney,
                        },(msg)=>{
                        if(msg.data.message == 'success'){
                            Message({
                                type: 'success',
                                message: "操作成功"
                            });
                            _this.have = true
                        }                        
                    })
                }else{
                    Message({
                        type: 'warning',
                        message: "已超出折扣权限！"
                    });
                    _this.$set(_this.tableList[0],'discountMoney',0)
                    _this.$set(_this.tableList[0],'actualSalesPrice',_this.tableList[0].originalSalesPrice)
                }
            }
        },
        //组织选中
        getOrg(val) {
            const _this = this;
            _this.tableList[0].applyOrgCode = val.code
            _this.tableList[0].applyOrgName = val.name
            api.vehicleCleaning.updateServiceOrderDetailInfoForDisCount({
                orderNo:_this.param.orderNo,
                serviceOrderNo:_this.param.serviceOrderNo,
                serviceOrderDetailCode:_this.param.serviceOrderDetailCode,
                accountTypeCode:_this.tableList[0].accountTypeCode,
                reconciliationTargetCode:_this.tableList[0].applyOrgCode,
                reconciliationTargetName:_this.tableList[0].applyOrgName,
                },(msg)=>{
                if(msg.data.message == 'success'){
                    Message({
                        type: 'success',
                        message: "操作成功"
                    });
                }                        
            })
        },
        //重置项目按钮
        resetService(){
            const _this = this;
            _this.resetServiceOrderInfo(()=>{
                _this.have = false
                _this.haveCarTicket = false 
                _this.$refs.carousel.setSlectItem()
            })
        },
        //重置项目接口
        resetServiceOrderInfo(callback=()=>{}){
            const _this = this;
            if(_this.param.serviceOrderNo){
                api.vehicleCleaning.resetServiceOrderInfo({
                    orderNo:_this.param.orderNo,
                    id:_this.param.serviceOrderId,
                    serviceOrderNo:_this.param.serviceOrderNo,
                    serviceOrderDetailInfoList:[{
                    serviceOrderDetailCode:_this.param.serviceOrderDetailCode,
                    id:_this.param.serviceOrderDetailId,
                    serviceOrderNo:_this.param.serviceOrderNo,
                    orderNo:_this.param.orderNo,
                    isDeleted:1
                    }]
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        callback()
                    }
                })
            }
        },
        //竣工
        accomplish(){
            const _this = this;
            if(_this.isDisabled){
                _this.disabledEnent()
            }else{
                api.vehicleCleaning.orderCompleteByOrderNo({
                    orderNo:_this.param.orderNo,
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.accomplishFlag = true
                        Message({
                            type: 'success',
                            message: "操作成功"
                        });
                    }
                })
            }
            
        },
        //店长折扣发生变化
        discount(){
            const _this = this;
            if(!/^\d+$/.test(_this.tableList[0].discount)){
                Message({
                    type: 'warning',
                    message: "请填写正确的折扣！"
                });
            }else{
                if(_this.tableList[0].discount <= 100 && _this.tableList[0].discount >= 0){
                    _this.$set(_this.tableList[0],'discountMoney',(((_this.tableList[0].originalSalesPrice) * (100 - _this.tableList[0].discount)) / 100).toFixed(2))
                    _this.$set(_this.tableList[0],'actualSalesPrice',(_this.tableList[0].originalSalesPrice - _this.tableList[0].discountMoney).toFixed(2))
                    let discountMoney = parseFloat(_this.tableList[0].discountMoney)
                    if(discountMoney <= _this.tableList[0].originalSalesPrice&&discountMoney <= _this.tableList[0].maxDisCountPrice && discountMoney >= 0){
                        api.vehicleCleaning.updateServiceOrderDetailInfoForDisCount({
                            orderNo:_this.param.orderNo,
                            serviceOrderNo:_this.param.serviceOrderNo,
                            serviceOrderDetailCode:_this.param.serviceOrderDetailCode,
                            discountMoney:_this.tableList[0].discountMoney,
                            discountRate:(100-_this.tableList[0].discount)/100,
                            },(msg)=>{
                            if(msg.data.message == 'success'){
                                Message({
                                    type: 'success',
                                    message: "操作成功"
                                });
                                _this.have = true
                            }                        
                        })    
                    }else{
                        Message({
                            type: 'warning',
                            message: "已超出折扣权限！"
                        });
                        _this.$set(_this.tableList[0],'discountMoney',0)
                        _this.$set(_this.tableList[0],'actualSalesPrice',_this.tableList[0].originalSalesPrice)

                    }                  
                }else{
                    Message({
                        type: 'warning',
                        message: "请填写正确的折扣！"
                    });
                    _this.$set(_this.tableList[0],'discountMoney',0)
                    _this.$set(_this.tableList[0],'actualSalesPrice',_this.tableList[0].originalSalesPrice)
                }
            }
        },
        //新建洗车单
        insertOrderInfo(obj,callback=()=>{}){
            const _this = this;
            api.vehicleCleaning.insertOrderInfo(obj,(msg)=>{
                if(msg.data.message == 'success'){
                    callback(msg.data)
                }
            })
        },
        //显示卡弹窗
        showCardModal() {
            const _this = this;
            if(_this.acceptObj.customCode || _this.acceptObj.vehicleCode){
                _this.isShowChoose = false
                if(_this.holdingCard > 0){
                    _this.acceptObj = {
                        customCode:_this.customerInfo.customCode
                    }
                    _this.$refs.cardModal.modalShow()
                    _this.$refs.cardModal.getFirstData(_this.acceptObj)
                }
            }
        },
        showTicketModal(){
            const _this = this;
            if(_this.acceptObj.customCode || _this.acceptObj.vehicleCode){
                _this.isShowChoose = false
                if(_this.holdingCoupon > 0){
                    _this.acceptObj = {
                        customCode:_this.customerInfo.customCode
                    }                    
                    _this.$refs.ticketModal.getFirstData(_this.acceptObj)
                    _this.$refs.ticketModal.showTicketModal()
                }
            }
                
        },
        //查询券数量
        getCouponCountByCustomer(){
            const _this = this;
            let param = {
                customCode:_this.customerInfo.customCode
            }
            api.vehicleCleaning.getCouponCountByCustomer(param, res => {
                if(res.data.code === 'success') {
                    _this.holdingCoupon = res.data.obj
                }
            })
        },
        //查询卡数量
        queryusableCardInfos(){
            const _this = this;
            let param = {
                customCode:_this.customerInfo.customCode
            }
            api.cardManage.queryusableCardInfo(param, res => {
                if(res.data.code === 'success') {
                    _this.holdingCard = res.data.obj
                }
            })
        },
        //查询上次进厂进店时间
        getOrderInfoByCondition(){
            const _this = this;
            let param = JSON.parse(JSON.stringify(_this.acceptObj))
            param.sortRule = 1
            param.orderStatus = 10
            param.custCode = param.customCode
            api.vehicleCleaning.getOrderInfoByCondition(param,(msg)=>{
                if (msg.data.code === "success") {
                    let data = msg.data.obj
                    _this.lastOnce = {
                        storeName:data.storeName,
                        closingDate:(data.closingDate&&data.closingDate.substring(0,19) ),
                        actualAmountTotal:data.actualAmountTotal
                    }
                }                 
            })
        },
        //车牌号离开焦点
        plateNumberBlur(arg1,arg2){
            const _this = this;
            _this.addPlateNumber = ""
            if(_this.mancarInfo.plateNumber){
                if(_this.mancarInfo.plateNumber.replace(/(^\s*)|(\s*$)/g, "").replace(/\s/g,"")){
                    _this.mancarInfo.plateNumber = _this.mancarInfo.plateNumber.replace(/(^\s*)|(\s*$)/g, "").replace(/\s/g,"")
                    _this.addPlateNumber = _this.mancarInfo.plateNumber || ""
                    _this.$refs.ctmvhc.showEmpCarModal()
                }
            }
        },
        //获取施工人接口
        getStorePostEmp(params,callback) {
            params.orgCode = this.param.makeOrgCode
            api.empScheduling.queryEmpByStore2(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },
        //施工人模糊搜索
        QuerySelect(data){
            const _this = this;
            _this.selectParams.pageStart = 1;
            _this.selectParams.empCnName = data;
            let params = _this.selectParams;
            _this.getStorePostEmp(params, function(res) {
                _this.Datalist = res
            });
        },
        //施工人选中
        ItemValue(value){
            const _this = this;
            api.vehicleCleaning.updateServiceOrderDatailInfo({
                id:_this.param.serviceOrderDetailId,
                serviceOrderDetailCode:_this.param.serviceOrderDetailCode,
                workEmpCode:value.empCode,
                workEmpName:value.empCnName
            },(msg)=>{
                if (msg.data.code === "success") {
                    Message({
                        type: 'success',
                        message: "操作成功！"
                    });
                }
            })
        },
        //第一次加载施工人
        FirstLoad(){
            const _this = this
            if(_this.Datalist.length != 0 ){
                return
            }
            let params = _this.selectParams
            this.selectParams.pageStart = 1
            _this.getStorePostEmp(params, function(res) {
                _this.Datalist = res
            })
        },
        //施工人下拉
        ComScroll(isEnd){
            if (isEnd) {
                this.selectParams.pageStart ++
                let params = this.selectParams;
                this.getStorePostEmp(params, obj => {
                    if(obj.list){
                        this.getStorePostEmp = this.brandDatalist.concat(obj.list);
                    }
                });
            }
        },
        //清除施工人
        ClearValue(){

        },
        updateCustomVehicleInfo(){
            const _this = this
            if(_this.mancarInfo.id){
                if(_this.mancarInfo.inMileage>_this.mancarInfo.inMileage1){
                    api.mancar.updateCustomVehicleInfo({
                        id:_this.mancarInfo.id,
                        vehicleCode:_this.mancarInfo.vehicleCode,
                        customCode:_this.mancarInfo.customCode,
                        inMileage:_this.mancarInfo.inMileage,
                        plateNumber:_this.mancarInfo.plateNumber,
                        },(msg)=>{
                        if(msg.data.message == 'success'){
                            _this.mancarInfo.nextMaintenanceMileage = msg.data.obj.nextMaintenanceMileage
                            Message({
                                type: 'success',
                                message: "操作成功！"
                            });
                             api.vehicleCleaning.updateOrderInfo({
                                orderNo:_this.param.orderNo,
                                id:_this.param.id,
                                inMileage:_this.mancarInfo.inMileage,
                                },(msg)=>{
                                if(msg.data.message == 'success'){
                                    Message({
                                        type: 'success',
                                        message: "操作成功"
                                    });
                                }                        
                            })
                        }
                    })
                }else{
                    Message({
                        type: 'warning',
                        message: "进店里程不能小于上次进店里程！"
                    });
                }
            }
        },
        //根据车牌号查询车辆信息
        getCustomVehicleInfoByPlateNumber(plateNumber,customCode,plateNumberTmp){
            const _this = this
            api.vehicleCleaning.getCustomVehicleInfoByPlateNumber({plateNumber:plateNumber || plateNumberTmp},(msg)=>{
                if(msg.data.message == 'success'){
                    let data = msg.data.obj
                    if(data){
                        _this.mancarInfo = {
                            id:data.id,
                            customName:data.customInfoVo.customName,
                            customCode:data.customInfoVo.customCode,
                            plateNumber:data.plateNumber,
                            inMileage:data.inMileage,
                            inMileage1:data.inMileage,
                            vehicleCode:data.vehicleCode,
                            nextMaintenanceMileage:data.nextMaintenanceMileage,
                            commercialInsuranceEndDate:data.commercialInsuranceEndDate,
                            compulsoryInsuranceEndDate:data.compulsoryInsuranceEndDate,
                            compulsoryInsuranceCompanyName:data.compulsoryInsuranceCompanyName,
                            commercialInsuranceCompanyCode:data.commercialInsuranceCompanyCode,
                            commercialInsuranceCompanyName:data.commercialInsuranceCompanyName,
                            compulsoryInsuranceCompanyCode:data.compulsoryInsuranceCompanyCode,
                            displayName:data.displayName,
                        }
                        _this.acceptObj.customCode = _this.mancarInfo.customCode
                        _this.acceptObj.vehicleCode = _this.mancarInfo.vehicleCode
                        if(!_this.haveCar){
                            //查卡数量
                            _this.queryusableCardInfos()
                            //查券数量
                            _this.getCouponCountByCustomer()
                            //查上次进店信息
                            _this.getOrderInfoByCondition()
                            if(!_this.param.id){
                                _this.isDisabled = false
                                _this.insertOrderInfo({
                                    orderNo:_this.param.orderNo,
                                    custCode:data.customCode,
                                    vehicleCode:_this.mancarInfo.vehicleCode,
                                    businessTypeCode:'CarWash',
                                },(data)=>{
                                    _this.param.id = data.obj.id
                                    _this.param.createTimeStr = data.obj.createTimeStr
                                    _this.param.serviceOrderNo = data.obj.serviceOrderInfoVo.serviceOrderNo
                                    if(_this.OffFlag){
                                        _this.updateOrderAndServiceInfo()
                                    }
                                })
                            }else{
                                api.vehicleCleaning.updateOrderInfo({
                                    orderNo:_this.param.orderNo,
                                    id:_this.param.id,
                                    inMileage:_this.mancarInfo.inMileage,
                                    custCode:_this.mancarInfo.customCode,
                                    vehicleCode:_this.mancarInfo.vehicleCode,
                                    businessTypeCode:'CarWash',
                                    },(msg)=>{
                                })
                            }
                        }
                    }
                }
            })
        },
        //点击收起展开
        foldClick(){
            const _this = this
            if(_this.param.mobilePhone || _this.mancarInfo.plateNumber){
                _this.fold = !_this.fold
            }
        },
        //列表页th宽度
        getColumnW(headStr) {
            return (headStr.length) * this.columW +36;
        },
        //人车组件点击选择
        selectCusVehicleInfo(data){
            const _this = this
            if(!_this.haveCar){
                //查车信息
                _this.getCustomVehicleInfoByPlateNumber(data.customVehicleInfoVos[0].plateNumber,data.customCode,data.customVehicleInfoVos[0].plateNumberTmp)
            }
            //查人信息
            _this.getCertificateTypeInfoByCustom(data.customCode)
            if(_this.param.customCode !== data.customCode){
                _this.param.mobilePhone = data.mobilePhone
            }
        },
        //输入手机号失去光标打开人车组件
        mobilePhoneSucces(){
            const _this = this
            _this.mobilePhone = ""
            if(_this.param.mobilePhone){
                let mobilePhone = _this.param.mobilePhone.replace(/(^\s*)|(\s*$)/g, "").replace(/\s/g,"")
                if(mobilePhone && mobilePhone.length >= 11){
                    _this.mobilePhone = mobilePhone
                    _this.$refs.ctmvhc.showEmpCarModal()
                }
            }
        },
        mobilePhoneChange(){
            const _this = this
                _this.mobilePhone = ""
                if(_this.param.mobilePhone){
                let str = _this.param.mobilePhone.replace(/(^\s*)|(\s*$)/g, "").replace(/\s/g,"")
                    if(str && str.length == 11){
                        _this.mobilePhone = str
                        _this.$refs.ctmvhc.showEmpCarModal()
                    }
                }
        },
        getCertificateTypeInfoByCustom(customCode){
            const _this = this;
            api.vehicleCleaning.getCertificateTypeInfoByCustom({customCode:customCode,certificateType:'DriverLicense'},(msg)=>{
                if(msg.data.message == 'success'){
                    let data = msg.data.obj
                    _this.customerInfo = {
                        birthday:data.birthday,
                        email:data.email,
                        idNo: data.idType == 'ID' ? data.idNo : null,
                        certificateProperty1:data.certificateTypeInfoVos[0]&&data.certificateTypeInfoVos[0].certificateProperty1,
                        firstGetDate:data.certificateTypeInfoVos[0]&&data.certificateTypeInfoVos[0].firstGetDate,
                        expireDate:data.certificateTypeInfoVos[0]&&data.certificateTypeInfoVos[0].expireDate,
                        customCode:data.customCode,
                        customName:data.customName,
                        mobilePhone:data.mobilePhone,
                        id:data.id,
                        credentialsId:data.certificateTypeInfoVos[0]&&data.certificateTypeInfoVos[0].id,
                        certificateCode:data.certificateTypeInfoVos[0]&&data.certificateTypeInfoVos[0].certificateCode,
                        certificateType:data.certificateTypeInfoVos[0]&&data.certificateTypeInfoVos[0].certificateType,
                        certificateNumber:data.certificateTypeInfoVos[0]&&data.certificateTypeInfoVos[0].certificateNumber,
                    }
                    _this.acceptObj.customCode = _this.customerInfo.customCode
                    if(_this.haveCar){
                        //查卡数量
                        _this.queryusableCardInfos()
                        //查券数量
                        _this.getCouponCountByCustomer()
                        //查最后一次进厂信息
                        _this.getOrderInfoByCondition()
                        if(!_this.param.id){
                            _this.isDisabled = false
                            _this.insertOrderInfo({
                                orderNo:_this.param.orderNo,
                                custCode:data.customCode,
                                vehicleCode:_this.mancarInfo.vehicleCode,
                                businessTypeCode:'CarWash',
                            },(data)=>{
                                _this.param.id = data.obj.id
                                _this.param.createTimeStr = data.obj.createTimeStr
                                _this.param.serviceOrderNo = data.obj.serviceOrderInfoVo.serviceOrderNo
                                if(_this.OffFlag){
                                    _this.updateOrderAndServiceInfo()
                                }
                            })
                        }else{
                            api.vehicleCleaning.updateOrderInfo({
                                orderNo:_this.param.orderNo,
                                id:_this.param.id,
                                inMileage:_this.mancarInfo.inMileage,
                                custCode:_this.mancarInfo.customCode,
                                vehicleCode:_this.mancarInfo.vehicleCode,
                                businessTypeCode:'CarWash',
                                },(msg)=>{
                            })
                        }
                    }
                }
            })
        },
        updateOrderAndServiceInfo(){
            const _this = this
            api.vehicleCleaning.updateOrderAndServiceInfo({
                orderNo:_this.param.orderNo,
                custCode:_this.customerInfo.customCode,
                vehicleCode:_this.mancarInfo.vehicleCode,
                serviceCode:_this.serviceItem.serviceCode,
                serviceOrderNo:_this.param.serviceOrderNo,
                detailStatus:10
            },(msg)=>{
                let data= msg.data.obj
                _this.param.serviceOrderNo = data.serviceOrderInfoList[0].serviceOrderNo
                _this.param.serviceOrderId = data.serviceOrderInfoList[0].id
                _this.param.orderNo = data.serviceOrderInfoList[0].serviceOrderDetailInfoList[0].orderNo
                _this.param.serviceOrderDetailCode = data.serviceOrderInfoList[0].serviceOrderDetailInfoList[0].serviceOrderDetailCode
                _this.param.serviceOrderDetailId = data.serviceOrderInfoList[0].serviceOrderDetailInfoList[0].id
                _this.tableList = [data.serviceOrderInfoList[0].serviceOrderDetailInfoList[0]]
            })
        },
        //选中服务
        getServiceItem(val) {
            const _this = this
            _this.detailCodes = [val.serviceCode]
            if(!_this.OffFlag){
                _this.OffFlag = true
                _this.serviceItem = val
            }else{
                //切换服务
                _this.have = false
                _this.haveCarTicket= false
                if(_this.param.serviceOrderNo){
                    _this.resetServiceOrderInfo(()=>{
                        api.vehicleCleaning.updateOrderAndServiceInfo({
                            orderNo:_this.param.orderNo,
                            custCode:_this.customerInfo.customCode,
                            vehicleCode:_this.mancarInfo.vehicleCode,
                            serviceCode:val.serviceCode,
                            serviceOrderNo:_this.param.serviceOrderNo,
                            detailStatus:10
                        },(msg)=>{
                            let data= msg.data.obj
                            _this.param.serviceOrderNo = data.serviceOrderInfoList[0].serviceOrderNo
                            _this.param.serviceOrderId = data.serviceOrderInfoList[0].id
                            _this.param.orderNo = data.serviceOrderInfoList[0].serviceOrderDetailInfoList[0].orderNo
                            _this.param.serviceOrderDetailCode = data.serviceOrderInfoList[0].serviceOrderDetailInfoList[0].serviceOrderDetailCode
                            _this.param.serviceOrderDetailId = data.serviceOrderInfoList[0].serviceOrderDetailInfoList[0].id
                            _this.tableList = [data.serviceOrderInfoList[0].serviceOrderDetailInfoList[0]]
                        })
                    })
                }
            }
        }
    },
    watch:{
        haveCar:function(){
            const _this = this;
            if(_this.haveCar){
                _this.cardUseTypeCode = 'CRecorder';
            }else{
                _this.cardUseTypeCode = 'VehicleCard';
            }
        }
    },
    created(){
        const _this = this;
        let userInfo = sessionStorage.getItem("userInfo");
        api.ordinalInfo.getSequence({
        serviceCode: 'ORDERSEQ'                    
            },(msg)=>{
            if(msg.data.message == 'success'){
                _this.param.orderNo = msg.data.obj
                
            }
        })
        api.ref.getDataDictionarys({
            refCode: 'AccountType'
        },(msg)=>{
            if(msg.data.message == 'success'){
                let data  = msg.data.obj.referenceDetailInfos
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    if(data[i].refDetailCode=='dealerPay'){
                        this.$set(this.accountTypeList,this.accountTypeList.length,{
                            value:data[i].refDetailCode,
                            text:data[i].refDetailName
                        })
                    }
                    if(data[i].refDetailCode=='normalSale'){
                        this.$set(this.accountTypeList,this.accountTypeList.length,{
                            value:data[i].refDetailCode,
                            text:data[i].refDetailName
                        })
                    }
                }
            }
        })
        if(userInfo){
            let info = JSON.parse(userInfo)
            _this.orgCode = info.userAvailableInfo.storeInfoVo.orgCode
            _this.param.empCnName = info.empVo.empCnName
            _this.param.makeOrgCode = info.empVo.orgCode
            _this.param.makeEmpCode = info.empVo.empCode
            _this.param.storeName = info.userAvailableInfo.storeInfoVo.storeName
            _this.selectParams.storeCode = info.userAvailableInfo.storeInfoVo.storeCode
            _this.serviceItemAddParam.storeCode = info.userAvailableInfo.storeInfoVo.storeCode
            _this.acceptObj.storeCode = info.userAvailableInfo.storeInfoVo.storeCode
        }
        api.ref.getDataDictionarys({
            refCode: 'OrderBusinessType'
        },(msg)=>{
            if(msg.data.message == 'success'){
                let data  = msg.data.obj.referenceDetailInfos
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    if(data[i].refDetailCode=='CarWash'){
                        this.refDetailName = data[i].refDetailName
                    }
                }
            }
        })
    }
};
</script>
<style>
    #app .main a.vehicle-cleaning-red{
        color: red;
    }
    .vehicle-cleaning .el-card__header{
        padding: 14px 16px;
    }
    .vehicle-cleaning .vehicle-cleaning-el-card__body .el-card.box-card{
        overflow-y: auto;
    }
    .vehicle-cleaning .vehicle-cleaning-el-card__body .el-card__body{
        height: 360px;
    }
    .vehicle-cleaning  .card-body  .card{
        border: none;
    }
    .vehicle-cleaning select.user-defined{
        width: 150px;
    }
    .vehicle-cleaning .table-scrollable2{
        overflow: visible;
        overflow-y: auto;
        height: 200px;
        border: none;
    }
    .vehicle-cleaning .table-scrollable2 .self_constrol{
        height: 150px;
    }
    #app .vehicle-cleaning button.user-defined{
        padding: 4px 30px;
    }
    #app .vehicle-cleaning .card-head-left{
        width: 200px;
        height: 20px;
        float:left;
    }
    #app .vehicle-cleaning .card-head-left span:nth-child(1){
        display: inline-block;
        width: 60%;
        height: 8px;
        background-color:#20A0E9;
    }
    #app .vehicle-cleaning .card-head-left span:nth-child(2){
        display: inline-block;
        width: 38%;
        height: 10px;
        text-align: center;
    }
    #app .vehicle-cleaning .card-head-right{
        margin-left: 200px;
        height: 20px;
    }
    #app .vehicle-cleaning .card-head-right span:nth-child(1){
        height: 8px;
        display: inline-block;
        width: 100%;
        background-color:#20A0E9;
    }
</style>
