<template>
    <div>
        <div class="row">
            <div class="col-md-12 col-lg-12">
                <div class="cardModelLine">
                    <span>卡号: {{cardInfo.cardNo}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>名称: {{cardInfo.cardName}}</span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <b-form-fieldset horizontal label="区域/门店" :label-cols="4" class="text-right">
                    <AreaTree  :readonly="shopReadonly" @select-change="selectedfun" ref="area" :storeAll='true'></AreaTree>                                                            
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="使用类型" :label-cols="4" class="text-right">
                    <b-form-select :disabled="true"  v-model="cardInfo.cardTypeCode" :options="userTypeList"></b-form-select>                                            
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="使用方" :label-cols="4" class="text-right">
                    <b-form-select :disabled="true"  v-model="cardInfo.cardUseTypeCode" :options="carTypeList"></b-form-select>                                            
                </b-form-fieldset>
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="面值(元)*" label-text-align="right" :label-cols="4">
                    <b-form-input  :disabled="true" v-model="cardInfo.cardAmout" type="number" min="0" />
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="业务状态" :label-cols="4" class="text-right">
                    <b-form-select :disabled="true" v-model="cardInfo.cardStatus" :options="orderTypeList"></b-form-select>                                            
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="销售单" :label-cols="4" class="text-right">
                    <b-form-input :disabled="true" v-model="cardInfo.cardSalesOrderNo"></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="销售人" :label-cols="4" class="text-right">
                    <b-form-input :disabled="true" v-model="cardInfo.salesEmpName"></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="有效期类型" :label-cols="4" class="text-right">
                    <b-form-select :options="validityTermType" v-model="cardInfo.cardExpireType" :disabled="true"></b-form-select>                                            
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="起始日期" :label-cols="4" class="text-right">
                    <b-form-input  v-model="cardInfo.startDateStr" :disabled="true"></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="到期日期" :label-cols="4" class="text-right">
                    <b-form-input v-model="cardInfo.endDateStr" :disabled="true"></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="有效天数" :label-cols="4" class="text-right">
                    <b-form-input  v-if="cardInfo.cardExpireType == 0" v-model="cardInfo.effectiveDays" :disabled="true"></b-form-input>                
                    <b-form-input  v-if="cardInfo.cardExpireType == 1"  v-model="cardInfo.expirePeriod" :disabled="true"></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="客户" :label-cols="4" class="text-right">
                    <b-form-input v-model="cardInfo.customName" :disabled="true"></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="车架号(VIN)" :label-cols="4" class="text-right">
                    <b-form-input v-model="cardInfo.vinCode" :disabled="true"></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="车牌号" :label-cols="4" class="text-right">
                    <b-form-input  v-model="cardInfo.plateNumber" :disabled="true"></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="使用状态" :label-cols="4" class="text-right">
                    <b-form-select  v-model="cardInfo.cardIsAlreadyUsed" :options="isAlreadyUsed" :disabled="true"></b-form-select>                                            
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="实退人*" :label-cols="4" class="text-right">
                    <b-form-input :disabled="isGetName || isEdit" v-model.trim="cardInfo.refundCustomName"  @input="inputNum()" :state="inp.refundCustomName"></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="实退人手机号*" :label-cols="4" class="text-right">
                    <b-form-input :disabled="isEdit" v-model.trim="cardInfo.refundMobilePhone" @input="inputNum('-11', cardInfo.refundMobilePhone)" :state="inp.refundMobilePhone"></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="固话号" :label-cols="4" class="text-right">
                    <b-form-input :disabled="isEdit" v-model.trim="cardInfo.refundCustomPhone"  @input="inputNum()"></b-form-input>                
                </b-form-fieldset>
            </div>
        </div>
        <div class="table-scrollable mb-2" v-show="cardInfo.cardUseTypeCode=='VehicleCard'">
            <b-table striped hover bordered show-empty :items="carList" :fields="carFields">
                <template slot="factoryName" slot-scope="data">
                    {{ data.value}}
                </template>
                <template slot="brandName" slot-scope="data">
                    {{ data.value}}					
                </template>
                <template slot="seriesName" slot-scope="data">
                    {{ data.value}}
                </template>
                <template slot="modelName" slot-scope="data">
                    {{ data.value}}
                </template>
                <template slot="opvName" slot-scope="data">
                    {{ data.value}}
                </template>		
                <template slot="iotypeName" slot-scope="data">
                    {{ data.value}}
                </template>              
                <template slot="empty">
                    暂无数据...
                </template>
            </b-table> 
        </div>
        <div class="table-scrollable mb-2">
           <b-table striped hover bordered show-empty :items="cardInfo.cardRefundRecordInfoList" :fields="fields">
                <template slot="detailType" slot-scope="data">
                    {{ data.value == 0 ? '商品' : '服务'}}
                </template>
                <template slot="detailCode" slot-scope="data">
                   <span v-if=" data.item.detailType == '1'">{{ data.value}}</span> 					
                </template>
                <template slot="detailName" slot-scope="data">
                     <span v-if=" data.item.detailType == '1'">{{ data.value}}</span> 
                </template>
                <template slot="skuCode" slot-scope="data">
                   <span v-if=" data.item.detailType == '0'">{{ data.item.detailCode}}</span> 
                </template>
                <template slot="skuName" slot-scope="data">
                     <span v-if=" data.item.detailType == '0'">{{ data.item.detailName}}</span> 
                </template>		
                <template slot="detailStatus" slot-scope="data">
                    {{ data.value | detailStatusFilter}}
                </template>
                <template slot="orderNo" slot-scope="data">
                    {{ data.value}}
                </template>
                <template slot="labourCost" slot-scope="data">
                   {{ data.value ? parseFloat(data.value).toFixed(2): ''}}
                </template>
                <template slot="labourTaxRate" slot-scope="data">
                    {{ data.value === '0%' ? 0 :data.value}}
                </template>
                <template slot="skuTotalCost" slot-scope="data">
                    {{ data.value ? parseFloat(data.value).toFixed(2): ''}}
                </template>
                <template slot="skuTotalTaxRate" slot-scope="data">
                    {{ data.value === '0%' ? 0 :data.value}}
                </template>
                <template slot="usedTotalTaxPrice" slot-scope="data">
                    {{ data.value ? parseFloat(data.value).toFixed(2): ''}}
                </template>
                <template slot="historyPrice" slot-scope="data">
                    {{ data.value }}
                </template>
                <template slot="currentPrice" slot-scope="data">
                    {{ data.value }}
                </template>
                <template slot="refundAmount" slot-scope="data">
                        <b-form-input v-if="!isEdit" :disabled="isEdit || (data.item.detailStatus != 0)" v-model.trim="data.value" @input="inputNum(data.index, data.value)" type="number" min="0" :state="data.item.inpVerify"/>
                        <span v-if="isEdit"> {{parseFloat(data.value).toFixed(2)}}</span>
                </template>
                <template slot="empty">
                    暂无数据...
                </template>
            </b-table>        
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import api from "common/api";
import config from "common/config";   
import {Message, MessageBox, Input, DatePicker, Table ,TableColumn ,} from "element-ui";
import AreaTree from 'components/iris-areaqueryshop/index'
import common from 'common/common.js'
Vue.use(Input)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(TableColumn)
export default {
    components: {
        AreaTree    
    },
    props: {
        refundDetail: {
            type: Object,
            default: function(){
                return {}
            }
        },
        isEdit: {
            type: Boolean,
            default: true
        },
    },
    data() {
        return {
            shopReadonly: false,
            isAlreadyUsed:[
                {
                    text:'已使用',
                    value:1,                
                },{
                    text:'未使用',
                    value:0,                
                }
                ],
                vocational:[{
                    text:'结算',
                    value:0,                
                },{
                    text:'已售',
                    value:1,                
                },{
                    text:'未售',
                    value:2,                
                }
            ],
            validityTermType:[
                {
                    text:"固定时长",
                    value:0
                },{
                    text:"有效期限",
                    value:1
                }],
                userTypeList:[{
                    text:'计次',
                    value:'Metering'
                },{
                    text:'储值',
                    value:'StoredValue'
                }],
                carTypeList:[{
                    text:"车主卡",
                    value:'CRecorder'
                },{
                    text:"车辆卡",
                    value:'VehicleCard'
                }
            ],
            carFields: {
                factoryName: {
                    label: '厂家'
                },
                brandName: {
                    label: '品牌'
                },
                seriesName: {
                    label: '车系'
                },
                modelName: {
                    label: '车型'
                },
                opvName: {
                    label: '排量'
                },
                iotypeName: {
                    label: '进气方式'
                },
            },
            fields: {
                detailType: {
                    label: '类型'
                },
                detailCode: {
                    label: '服务编码'
                },
                detailName: {
                    label: '服务名称'
                },
                skuCode: {
                    label: '商品编码'
                },
                skuName: {
                    label: '商品名称'
                },
                detailStatus: {
                    label: '使用状态'
                },
                orderNo: {
                    label: '维修合同号'
                },
                labourCost: {
                    label: '人工费成本（不含税）'
                },
                labourTaxRate: {
                    label: '人工费税率'
                },
                skuTotalCost: {
                    label: '商品成本（不含税）'
                },
                skuTotalTaxRate: {
                    label: '商品税率'
                },
                usedTotalTaxPrice: {
                    label: '成本（含税）'
                },
                historyPrice: {
                    label: '售卡时售价'
                },
                currentPrice: {
                    label: '当前售价'
                },
                refundAmount: {
                    label: '退款金额（CNY）'
                },
            },
            carList: [],
            inp: {
                refundCustomName: null,
                refundMobilePhone: null,
            },
            tempData: {
                refundCustomName: '',
                refundMobilePhone: '',
                refundCustomPhone: '',
            },
            timer: undefined,
            isGetName: false,
            refundMobilePhone: '',
            orderTypeList:  config.cardPay.orderTypeList, 
        }
    },
    computed:{
        cardInfo: function(value){ 
            this.carList = [
                {
                    factoryName: this.refundDetail.factoryName,
                    brandName: this.refundDetail.brandName,
                    seriesName: this.refundDetail.seriesName,
                    modelName: this.refundDetail.modelName,
                    opvName: this.refundDetail.opvName,
                    iotypeName: this.refundDetail.iotypeName,
                }
            ]
            let obj = Object.assign({}, this.refundDetail);
            if(this.refundDetail.cardRefundRecordInfoList.length != 0) {
                for( let [i, item] of obj.cardRefundRecordInfoList.entries()) {
                    obj.cardRefundRecordInfoList[i].cardRefundOrderNo =  this.refundDetail.cardRefundOrderNo;
                    obj.cardRefundRecordInfoList[i].cardNo =  this.refundDetail.cardNo;
                    if(item.refundAmount == null|| item.refundAmount == NaN || parseFloat(item.refundAmount) == 0 ) {
                        obj.cardRefundRecordInfoList[i].refundAmount = '0.00';
                    }
                }
            }
            this.$nextTick(() => {
                this.setShop(obj);
            })
            
            return obj;
        }
    },
    methods: {
        getColumnW(headStr) {
            return (headStr.length) * this.columW +36;
        },
        //区域选择门店
        selectedfun(data, data1) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            if(data1 instanceof Array){
                //_this.searchModel.storeCodes = []
                for (let i = 0; i < data1.length; i++) {
                   // _this.$set(_this.searchModel.storeCodes, i, data1[i].value)              
                }
            }else{
                options.storeCodeSet.push(data1.value);
                // _this.searchModel.storeCodes = [data1.value]
            }
        },
        inputNum(index, val) {   
            if(index >= 0) {
                for(let key of Object.keys(this.tempData)) {
                    this.tempData[key] = this.cardInfo[key];
                }
                let num = 0;
                if(val < 0) {
                    Message({
                        type: "warning",
                        message: "退款金额不可小于0！"
                    });           
                    this.cardInfo.cardRefundRecordInfoList[index].inpVerify = 'invalid';               
                    num = parseFloat(-val); 
                }else if(val === '') {
                    this.cardInfo.cardRefundRecordInfoList[index].inpVerify = 'invalid';               
                    num = val;
                } else {
                    this.cardInfo.cardRefundRecordInfoList[index].inpVerify = null;
                    num = parseFloat(val);
                }
                this.cardInfo.cardRefundRecordInfoList[index].refundAmount = num;
            }else if(index == '-11') {              
                let param = {
                    mobilePhone: val
                }
                
                if(val != '' && val != null) {
                    if( this.timer) {
                        clearTimeout(this.timer)
                    }
                    this.timer = setTimeout(() => {           
                       api.returnCard.queryCustomInfoByMobilePhone(param, (res) => {
                            if(res.data.code === 'success') {	
                                if(res.data.obj && res.data.obj.customName) {                                   
                                    this.cardInfo.refundCustomName = res.data.obj.customName;
                                    this.isGetName = true;
                                }else {
                                    this.isGetName = false;
                                }      
                            }else {
                                this.isGetName = false;
                            }  
                        })
                        this.$emit('inputNum', this.cardInfo);
                    }, 400) 
                }else {
                    // for(let key of Object.keys(this.tempData)) {
                    //     this.cardInfo[key] = this.tempData[key];
                    // }
                }
            }
            this.$emit('inputNum', this.cardInfo);
        },
        verifyData() {
            let verify = true;
            for( let key of Object.keys(this.inp)) {
                this.inp[key] = 'null';
                if(this.cardInfo[key] == '' || this.cardInfo[key] == null) {
                    this.inp[key] = 'invalid';
                    Message({
                        type: "warning",
                        message: "退款金额明细信息未填写完整！"
                    });
                    verify = false;
                }
            }
            for( let [i, item] of  this.cardInfo.cardRefundRecordInfoList.entries()) {
                if(item.refundAmount === '') {
                    this.cardInfo.cardRefundRecordInfoList[i].inpVerify = 'invalid';
                    // Message({
                    //     type: "warning",
                    //     message: "退款金额不可为空！"
                    // });
                    verify = false;
                }
            }
            
            if(!common.isMobile(this.cardInfo.refundMobilePhone)) {
                //  Message({
                //     type: "warning",
                //     message: "手机号码格式不正确！"
                // });
                this.inp.refundMobilePhone = 'invalid';
                verify = false;
            }else {
               this.inp.refundMobilePhone = null;
            }
            return verify;
        },
        setData() {
            for( let [i, item] of  this.cardInfo.cardRefundRecordInfoList) {
                if(parseFloat(item.refundAmount) < 0) {
                    this.cardInfo.cardRefundRecordInfoList[i].inpVerify = 'invalid';
                }
            }
        },
        setShop(obj) {
            if(!obj.storeCode) {
                this.shopReadonly = true;
               return;
            }
            this.$refs.area.setselect({
                text: obj.storeName,
                value: obj.storeCode
            })
            this.shopReadonly = true;
        },
    },
    created () {
       
    },
    mounted() {
       // this.setShop(this.cardInfo);
    },
    filters: {
         detailStatusFilter(val) {
            if(val == '0') {
                return '未使用';
            }else if(val == '1') {
                return '已使用';
            }else if(val == '2') {
                return '已退款';
            }
        },
    }
}
</script>
<style>
    .modal-dialog {
        margin: 80px auto !important;
    }
    .controlSpecialLine>.table-scrollable {
        margin-top: 60px;
    }
    .controlSpecialLine>.table-scrollable:first-child {
        margin-top: 10px;
    }
    .custom{
        max-height: 300px;
        overflow: auto;
    }
</style>

