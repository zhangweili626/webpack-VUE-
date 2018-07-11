<template>
    <div class="animated fadeIn">
        <b-card header="卡充值单号：">
            <span class="card-title">{{cardRechargeOrderNo}}</span>
             <div class="row">                       
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="卡号" :label-cols="4" class="text-right">
                        <b-form-input v-model="headModel.cardNo" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="卡名称" :label-cols="4" class="text-right">
                        <b-form-input  v-model="headModel.cardName" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="客户名称" :label-cols="4" class="text-right">
                        <b-form-input  v-model="headModel.customName" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="手机号" :label-cols="4" class="text-right">
                        <b-form-input  v-model="headModel.mobilePhone" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="充值创建时间" :label-cols="4" class="text-right">
                         <el-date-picker
                            v-model="headModel.createTime"
                            disabled
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="充值结算时间" :label-cols="4" class="text-right">
                       <el-date-picker
                            v-model="headModel.rechargeTime"    
                            disabled                      
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="充值渠道*" :label-cols="4" class="text-right">
                        <b-form-select :options="channelList" v-model="headModel.orderChannelCode" :disabled="isPay || onlySee" :class="{'inp-invalid' : inp.orderChannelCode}"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="充值门店*" :label-cols="4" class="text-right">
                        <AreaTree @select-change="selectedfun" ref="areaqueryshop"  :readonly="isPay" :class="{'inp-invalid' : inp.storeCode}"></AreaTree>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="操作人" :label-cols="4" class="text-right">
                        <b-form-input  v-model="headModel.rechargeEmpName" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="操作方" :label-cols="4" class="text-right">
                        <b-form-input  v-model="headModel.createOrgName" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-8">
                    <b-form-fieldset horizontal label="备注" :label-cols="2" class="text-right">
                        <b-form-input  v-model="headModel.remark"  :disabled="isPay || onlySee" style="margin-left: -4px;"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="应充值金额*" :label-cols="4" class="text-right pr-3 ml-2">
                        <b-form-input  type="number"  v-model="headModel.rechargeOriginalAmount"  :disabled="isPay || onlySee" :class="{'inp-invalid' : inp.rechargeOriginalAmount, 'pl-2': true}" min="0"/>
                        <span class="input-append-yuan">元</span>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="实际充值金额" :label-cols="4" class="text-right pr-3 ml-2">
                        <b-form-input  type="number"  v-model="headModel.rechargeActualAmount" disabled class="pl-2"/>
                        <span class="input-append-yuan">元</span>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="开票金额" :label-cols="4" class="text-right pr-3">
                        <b-form-input  type="number" v-model="headModel.rechargeInvoiceAmount" disabled  class="pl-1"/>
                        <span class="input-append-yuan">元</span>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="赠送金额" :label-cols="4" class="text-right pr-3">
                        <b-form-input  type="number" v-model="headModel.giftAmount" disabled  class="pl-1"/>
                        <span class="input-append-yuan">元</span>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">              
                <div class="col-md-12 text-right">                                                         
                    <b-button size="sm" variant="success" @click="goPay()" v-show="(!isPay) && !onlySee">{{orderStatus == '0'?'保存':'去支付'}}</b-button>                                             
                    <b-button size="sm" variant="danger" @click="setInvail()" v-show="(isPay && !onlySee && !isCloseAccount) || (orderStatus == '0') && !onlySee">作废</b-button>                                         
                </div>          
            </div>
        </b-card>
        <b-card header="充值支付记录" v-show="isPay">          
             <b-button size="sm" variant="success" class="header-btn-r" @click="savePaylist" v-show="(!isCloseAccount) && !onlySee" :disabled="(isShowCloseABtn && isPay) || !isPay">结算</b-button>   
             <div class="row">              
                <div class="col-md-6">              
                    <b-button size="sm" variant="warning" @click="delPayList"  v-show="(!isCloseAccount && isShowPayDel )  && !onlySee" :disabled="!isPay">删除</b-button>                                             
                    <b-button size="sm" variant="success" @click="showAddPay"  v-show="(!isCloseAccount) && !onlySee" :disabled="!isPay">添加</b-button>                                             
                </div>
                <div class="col-md-6 text-right">     
                    <h4> 支付金额合计： {{cardRechargeTotal}}元</h4>                                              
                </div>
            </div>
            <div class="table-scrollable mb-2">
                 <b-table striped hover bordered show-empty :items="cardRechargeList" :fields="fields">		
                    <template slot="sel" slot-scope="data">
						<input type="radio" name="payRadio" :disabled="(!(!isPay && isShowPayDel)) && onlySee" v-model="paySel" :value="data.item">					
					</template>		
					<template slot="paymentTypeName" slot-scope="data">
						{{ data.value }}				
					</template>
					<template slot="paymentAmount" slot-scope="data">
						{{ parseFloat(data.value).toFixed(2)}}
					</template>
					<template slot="paymentTime" slot-scope="data">
						{{ data.value}}
					</template>		
					<template slot="paymentEmpName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="paymentTransactionNo" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="empty">
						暂无数据...
					</template>
				</b-table>
            </div>
         </b-card>
         <b-card header="充值发票录入" v-show="isCloseAccount">
             <b-button size="sm" variant="success" class="header-btn-r" @click="saveInvoicelist" v-show="!onlySee" :disabled="isDSaveInvoice">保存</b-button>  
            <div class="row">              
                 <div class="col-md-6">              
                    <b-button size="sm" variant="danger" @click="delInvoiceList" v-show="isShowInvoiceDel && !onlySee && !isDSaveInvoice">删除</b-button>                                             
                    <b-button size="sm" variant="success" @click="showInvoiceModal" v-show="!isMakeInovice  && !onlySee && !isDSaveInvoice">添加</b-button>                                                                                         
                </div>
                <div class="col-md-6 text-right"> 
                    <h4>已开票金额：{{cardInvoiceTotal}}元 </h4>                                                                      
                </div>
            </div>
            <div class="table-scrollable mb-2">
                <el-table
                    :data="cardInvoiceList"
                    border
                    style="width: 100%">
                    <el-table-column
                    v-if="!onlySee"
                    fixed
                    prop="selCont"
                    label="选择"
                    width="70">
                        <template slot-scope="scope">
                            <input type="radio" name="radio2"  v-model="invoiceSel" :value="scope.row" :disabled="onlySee"/>
                        </template>	
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="invoiceNo"
                    label="作废操作"
                    width="120">
                        <template slot-scope="scope">
                            <b-button :disabled="scope.row.invoiceStatus == '-1' || isDSaveInvoice" size="sm" variant="danger" v-show="(scope.row.operation == '1' && !onlySee) && !(scope.row.invoiceStatus == '-1')" @click="invalidInvoice(scope.row)">{{scope.row.invoiceStatus == '-1'?'已作废':'作废'}}</b-button>
                        </template>	
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="invoiceNo"
                    label="发票号"
                    width="170">
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="invoiceTypeName"
                    label="发票类型"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="invoiceRate"
                    label="税率"
                    :width="getColumnW('税率')">
                        <template slot-scope="scope">
                            <span>{{parseFloat(scope.row.invoiceRate) * 100 + '%'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="invoiceAmount"
                    label="开票金额"
                    :width="getColumnW('开票金额')">
                        <template slot-scope="scope">
                            <span>{{parseFloat(scope.row.invoiceAmount).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="invoiceAmountExcludingTax"
                    label="去税金额"
                    :width="getColumnW('开票金额')">
                        <template slot-scope="scope">
                            <span>{{parseFloat(scope.row.invoiceAmountExcludingTax).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column     
                    fixed                  
                    prop="invoiceContentDesc"
                    label="开票内容"
                    width="170">
                    </el-table-column>
                    <el-table-column                      
                    prop="invoiceTitle"
                    label="开票人/企业名称"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="taxRegistrationNo"
                    label="税号"
                    width="170">
                    </el-table-column>
                    <el-table-column
                    prop="bankName"
                    label="开户行"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="companyAddress"
                    label="地址"
                    width="170">                   
                    </el-table-column>                  
                    <el-table-column
                    prop="invoiceStatus"
                    label="开票状态"
                    width="160">
                        <template slot-scope="scope">
                            <span>{{scope.row['invoiceStatus'] | invoiceStatusFliter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="refundInvoiceNo"
                    label="红冲发票号"
                    width="170">
                    </el-table-column>
                </el-table>
            </div>
         </b-card>
         <card-pay @surePay="addPayList" ref="cardPay" :userInfo='userInfo'></card-pay>
         <invoice-modal @conOpenTicket='addInvoice' :invoiceContentSuffix="invoiceContentSuffix" :invoiceContentStart="invoiceContentStart" :invioceNum="invioceNum" ref="incoiceModal" :userInfo='userInfo'></invoice-modal>
    </div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import {Table, TableColumn, Message, MessageBox, DatePicker, Button, Input } from "element-ui"
import AreaTree from 'components/iris-areaqueryshop/index'
import cardPay from './pay.vue'
import common from 'common/common.js'
import {CHANNEL_CODE, FIRST_SOURCE_CHANNEL} from 'common/ref-code.js'
import {hasBtn} from 'common/api-common.js'
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'
import invoiceModal from '../card-sale/edit/open-ticket'

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(Button);
Vue.use(Input);

export default {
    components: {
        AreaTree,
        cardPay,
        invoiceModal,
    },
    data() {
        return {
            sourceOrderTypeCode: config.cardPay.sourceOrderTypeCode,
            columW: config.demandOrder.columW,
            cardRechargeOrderNo:'',
            channelList: [],
            firstSourceChannellList: [],
            userInfo: '',
            storeInfoVo: '',
            selCont:[],
            headModel: {
               cardRechargeOrderNo:'',
               cardNo:'',
               cardName:'',
               customName:'',
               mobilePhone:'',
               createTime: '',
               rechargeTime: '',
               cardSourceCode: '',
               orderChannelCode: '',
               storeCode: '',
               storeName: '',
               rechargeEmpCode: '',
               rechargeEmpName: '',
               createOrgCode: '',
               createOrgName: '',
               remark: '',
               rechargeOriginalAmount: 0,
               rechargeActualAmount: 0,
               rechargeInvoiceAmount: 0,
               giftAmount: 0,
            },
            inp: {
                storeCode: false,
                rechargeOriginalAmount: false,
                orderChannelCode: false,
            },
            cardRechargeTotal: 0,
            cardRechargeList: [],
            origCardRechargeList: [],
            fields: {},
            fieldsEidt: {	
                    sel: {
						label: "选择"
					},			
					paymentTypeName: {
						label: "支付方式"
					},
					paymentAmount: {
						label: "收款金额"
					},
					paymentTime: {
						label: "收款日期"
					},				
					paymentEmpName: {
						label: "收款人"
					},
					paymentTransactionNo: {
						label: "交易流水号"
					},
            },
            fieldsSee: {				
					paymentTypeName: {
						label: "支付方式"
					},
					paymentAmount: {
						label: "收款金额"
					},
					paymentTime: {
						label: "收款日期"
					},				
					paymentEmpName: {
						label: "收款员"
					},
					paymentTransactionNo: {
						label: "交易流水号"
					},
            },
            orgCardInvoiceList: [],
            cardInvoiceList: [],
            invoiceContentSuffix: '充值',
            invoiceContentStart: config.cardPay.invoiceContentStart,
            paySel:'',
            invoiceSel: '',
            cardInvoiceTotal: 0,
            // 是否禁用结算按钮
            isShowCloseABtn: true,
            // 是否已充值
            isPay: false,
            // 是否已结算
            isCloseAccount: false,
            // 是否已充值
            isMakeInovice: false,
            // 是否显示支付记录删除按钮
            isShowPayDel: false,
            // 是否显示发票删除按钮
            isShowInvoiceDel: false,
            // 是否显示发票添加按钮
            isShowInvoiceAdd: false,
            // 是否显示发票作废按钮
            isShowInvalid: false,
            // 是否禁用发票保存按钮
            isInvoiceSaveBtn: true,
            // 默认开票金额
            invioceNum: 0,
            // 是否仅查看
            onlySee: false,
            params:{
                pageNums:config.pageNums,  
            },
            orderId: '',
            orderStatus: '',
            isDSaveInvoice: false,
        }
    },
    created() {		
        this.getChannelist();
        this.getFirstChannelist();
        this.getUserInfo();	
		this._initData();
	},
    computed: {
        isEditCardPay(){
				return hasBtn(collectionApi.cardPay.editCardRechargePaymentInfo);
            },
        isAddCardPay(){
				return hasBtn(collectionApi.cardPay.insertCardRecharge);
			},
    },
    methods: {
        ...mapActions('cardPay',[
				'setTableList',
				'setSearchParam',
				'setPages',
                'updateCardPayTabList',
            ]),
        getUserInfo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            let stroe = userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
            this.userInfo = userInfo;
            this.storeInfoVo = stroe;
        },
        // 获取支付渠道
        getChannelist() {
            let _this = this;
            const option = {
                'refCode': CHANNEL_CODE
            }
            api.ref.getDataDictionarys(option, (res) => {
                if (res.data.code === 'success') {
                    let data = res.data.obj.referenceDetailInfos;
                    let arr = []
                    data.forEach((item, index) => {
                        let obj = {
                            value: item.refDetailCode,
                            text: item.refDetailName
                        }
                        arr.push(obj);
                    })
                    _this.channelList = arr;
                }
            })
        },
        // 获取首次来源渠道
        getFirstChannelist() {
            let _this = this;
            const option = {
                'refCode': FIRST_SOURCE_CHANNEL
            }
            api.ref.getDataDictionarys(option, (res) => {
                if (res.data.code === 'success') {
                    let data = res.data.obj.referenceDetailInfos;
                    let arr = []
                    data.forEach((item, index) => {
                        let obj = {
                            value: item.refDetailCode,
                            text: item.refDetailName
                        }
                        arr.push(obj);
                    })
                    _this.firstSourceChannellList = arr;
                    this.headModel.cardSourceCode = arr[0].value;
                }
            })
        },
        // 根据卡号获取详情
        getCardDetial(val) {
            const option = {
                'cardNo': val,			
            }
            return new Promise((reslove,reject) => {
                api.cardPay.getCardDetial(option, (res) => {
                    if(res.data.code === 'success') {							
                        reslove(res.data.obj)
                    };
                })
            })				
        },
        //区域选择门店
        selectedfun(data, data1) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            if(data1 instanceof Array){
               
            }else{
                options.storeCodeSet.push(data1.value);
                _this.headModel.storeCode = data1.value
            }
        },
        // 获取支付明细
        getPayDetail(val) {
            const option = {
                'cardRechargeOrderNo': val,
            }
            return new Promise((reslove,reject) => {
                api.cardPay.queryCardRechargePaymentInfoNoPage(option, (res) => {
                    if(res.data.code === 'success') {							
                        reslove(res.data.obj)
                    };
                })
            })				
        },
        // 获取开票明细
        getInvoiceDetail(val) {
            const option = {
                "sourceOrderTypeCode": this.sourceOrderTypeCode,
                'sourceOrderNo': val,
                'storeCode': this.headModel.storeCode,
            }
            return new Promise((reslove,reject) => {
                api.cardPay.queryCardRechargeInvoiceInfoNoPage(option, (res) => {
                    if(res.data.code === 'success') {							
                        reslove(res.data.obj)
                    };
                })
            })				
        },
        _initData() {
            let _this = this;
            let param;
            let routeQuery = this.$route.query;
            if(routeQuery.onlySee && routeQuery.onlySee.toString() == 'true') {
                this.onlySee = true;
                this.fields = this.fieldsSee;
            }else {
                this.onlySee = false;
                this.fields = this.fieldsEidt;
            }
            // if(routeQuery.opType && routeQuery.opType.toString() == 'eidt') {
            //     this.isEidtSt = true;
            // }else {
            //     this.isEidtSt = false;               
            // }
            if(routeQuery.cardRechargeOrderNo == undefined || routeQuery.cardRechargeOrderNo == '' || routeQuery.cardNo == undefined || routeQuery.cardNo == '') {
                  this.$router.push({name: 'card-pay-search'});                 
            }else {
                this.cardNo = routeQuery.cardNo;
                this.cardRechargeOrderNo = routeQuery.cardRechargeOrderNo;
                this.headModel.cardNo = this.cardNo;
                this.headModel.cardRechargeOrderNo = this.cardRechargeOrderNo;
                let option = {
                    cardRechargeOrderNo: routeQuery.cardRechargeOrderNo
                }
                api.cardPay.getCardRechargeInfoByCode(option, (res) => {
                    if(res.data.code === 'success') {							
                       if(res.data.obj != null) {
                            for(let key of Object.keys(this.headModel)) {
                                this.headModel[key] =res.data.obj[key];
                            } 
                            this.orderId =  res.data.obj.id;
                            if(parseFloat(this.headModel.rechargeOriginalAmount)){
                                this.headModel.rechargeOriginalAmount = parseFloat(this.headModel.rechargeOriginalAmount).toFixed(2)
                            }
                            if(parseFloat(this.headModel.rechargeActualAmount)){
                                this.headModel.rechargeActualAmount = parseFloat(this.headModel.rechargeActualAmount).toFixed(2)
                            }
                            if(parseFloat(this.headModel.rechargeInvoiceAmount)){
                                this.headModel.rechargeInvoiceAmount = parseFloat(this.headModel.rechargeInvoiceAmount).toFixed(2)
                            }
                            this.orderStatus =  res.data.obj.orderStatus;
                            this.headModel.customName = res.data.obj.cardSalesOrderInfo? res.data.obj.cardSalesOrderInfo.customName : '';
                            this.headModel.mobilePhone = res.data.obj.cardSalesOrderInfo ? res.data.obj.cardSalesOrderInfo.mobilePhone : '';
                            this.cardRechargeList = res.data.obj.cardRechargePaymentInfoVos;
                            this.cardRechargeTotal = this.countPayTotal(this.cardRechargeList,'paymentAmount'); 
                            if(this.headModel.storeCode != '') {
                                let stroeParam = {
                                    value:this.headModel.storeCode,
                                    text:this.headModel.storeName,
                                }
                                this.$refs.areaqueryshop.setselect(stroeParam);                                                            
                            }       
                            this.invoiceContentSuffix = res.data.obj.cardName + '充值';                     
                            this.getInvoiceDetail(routeQuery.cardRechargeOrderNo).then(res =>{
                                if(res.length != 0) {
                                    this.cardInvoiceList = [...res];
                                    this.orgCardInvoiceList =  [...res];
                                    this.cardInvoiceTotal = this.countPayTotal(this.cardInvoiceList,'invoiceAmount');
                                    if( this.cardInvoiceList.length != 0 && parseFloat(this.headModel.rechargeOriginalAmount) <= parseFloat(this.cardInvoiceTotal)) { 
                                        this.isMakeInovice = true;
                                    }else{
                                        this.isMakeInovice = false;
                                    }
                                }
                                if(this.orderStatus == '0') {
                                    this.isCloseAccount =  false;
                                }else if(this.orderStatus == '1'){
                                    this.isCloseAccount =  true;
                                    this.isPay = true;
                                }else if(this.orderStatus == '-1'){
                                    this.onlySee =  true;
                                }
                                if( this.onlySee || this.orderStatus == '1') {
                                    this.fields = this.fieldsSee;
                                }else {
                                    this.fields = this.fieldsEidt;
                                }
                                
                            })
                            
                            
                       }else{
                            this.headModel.rechargeEmpName = this.userInfo.empVo.empCnName;
                            this.headModel.rechargeEmpCode = this.userInfo.empVo.empCode;
                            this.headModel.createOrgCode = this.userInfo.empVo.orgCode;
                            this.headModel.createOrgName = this.userInfo.empVo.orgName;
                            this.headModel.storeCode = this.storeInfoVo?this.storeInfoVo.storeCode:'';
                            this.headModel.storeName = this.storeInfoVo?this.storeInfoVo.storeName:'';                                
                            this.getCardDetial(this.cardNo).then((res) => {
                                this.headModel.cardName = res.cardName;
                                this.headModel.giftAmount = res.giftAmount
                                this.invoiceContentSuffix = res.cardName + '充值';
                                this.headModel.customName = res.cardSalesOrderInfoVo.customName;
                                this.headModel.mobilePhone = res.cardSalesOrderInfoVo.mobilePhone;
                            })
                       }
                    };
                })
            }
        },
        goPay() {
            let isVerity = true;
            for(let key of Object.keys(this.inp)) {
                 this.inp[key] = false;
                if(this.headModel[key] == '' || this.headModel[key] == null) {
                    Message({
                        type: "warning",
                        message: "信息未填写完整！"
                    });
                    this.inp[key] = true;
                    isVerity = false;
                }
            }
            if(this.headModel.rechargeOriginalAmount <= 0) {
                 Message({
                    type: "warning",
                    message: "应充值金额不可小于等于0！"
                });
                this.inp.rechargeOriginalAmount = true;
                isVerity = false;
            }
            if(!isVerity) {
                return;
            }
            let param = Object.assign({},this.headModel);
            let cardSalesOrderInfo = {
                customName: param.customName,
                mobilePhone: param.mobilePhone,
            }
            param.cardSalesOrderInfo = cardSalesOrderInfo;
           
            if(this.orderId == '') {
                delete param.createTime;
                delete param.rechargeTime;
                api.cardPay.insertCardRecharge(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "生成充值单成功！"
                        });
                        this._initData();
                        this.updateCardPayTabList(this.params);
                        this.isPay = true;
                    }
                })
            }else {       
                param.id = this.orderId;    
                param.orderStatus = 0;   
                api.cardPay.updateCardRecharge(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "保存成功！"
                        });
                        this._initData();
                        this.updateCardPayTabList(this.params);
                        this.isPay = true;
                    }
                })
            }
            
        },
        setInvail() {
            MessageBox.confirm('作废后将不可操作，确定作废?', '提示', {
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
            }).then(() => {
                let param = Object.assign({},this.headModel);
                let cardSalesOrderInfo = {
                    customName: param.customName,
                    mobilePhone: param.mobilePhone,
                }
                param.cardSalesOrderInfo = cardSalesOrderInfo;
                param.id = this.orderId;       
                param.orderStatus = -1;       
                api.cardPay.updateCardRecharge(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "作废成功！"
                        });
                        this._initData();
                        this.updateCardPayTabList(this.params);
                    }
                })
            }).catch(() => {
            });
        },
        showAddPay() {
            this.$refs.cardPay.showModal();
        },
        addPayList(val) {
            let valObj = Object.assign({}, val);
            valObj.cardRechargeOrderNo = this.cardRechargeOrderNo;
            // if(this.cardRechargeList.length == 0) {
            //     this.cardRechargeList.push(valObj);
            // }else {
            //     let onoff = true;
            //     for(let [i, item] of this.cardRechargeList.entries()) {
            //         if(item.paymentTransactionNo == valObj.paymentTransactionNo) {
            //             Message({
            //                 type: "warning",
            //                 message: "该流水号已存在,请重新添加！"
            //             });
            //             onoff = false;
            //             return;
            //         }
            //     };
            //     if(onoff) {
            //         this.cardRechargeList.push(valObj);
            //     }
            // }
            this.cardRechargeList.push(valObj);
            this.cardRechargeTotal = this.countPayTotal(this.cardRechargeList,'paymentAmount');
        },
        delPayList() {
            if(this.paySel === "") {
                Message({
                    type: "warning",
                    message: "请选择删除项！"
                });
                return;
            }
            MessageBox.confirm('确定删除吗?', '提示', {
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
            }).then(() => {				  
               if(this.paySel.id == undefined) {
                   for(let [i, item] of this.cardRechargeList.entries()) {
                        if(item.paymentTransactionNo == this.paySel.paymentTransactionNo) {
                            this.cardRechargeList.splice(this.cardRechargeList.indexOf(this.paySel), 1);
                            break;
                        }
                    };
                    this.cardRechargeTotal = this.countPayTotal(this.cardRechargeList,'paymentAmount');
               }else {
                   let param = Object.assign({}, this.paySel);
                    param.isDeleted = '1';
                    api.cardPay.editCardRechargePaymentInfo([param], (res) => {
                        if(res.data.code === 'success') {	
                            Message({
                                type: "success",
                                message: "删除成功！"
                            });
                            this._initData();
                            this.updateCardPayTabList(this.params);
                        }
                    })
               }
                
            }).catch(() => {
            });
            
        },
        savePaylist() {            
            if(parseFloat(this.cardRechargeTotal) < this.headModel.rechargeOriginalAmount) {
                Message({
                    type: "warning",
                    message: "支付记录收款合计必须大于等于应充值金额！"
                });
                return;
            }
            MessageBox.confirm('结算后无法再做修改，确认结算吗?', '提示', {
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
            }).then(() => {
                let param = [...this.cardRechargeList];
                api.cardPay.editCardRechargePaymentInfo(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "保存成功！"
                        });
                        this._initData();
                        this.updateCardPayTabList(this.params);               
                    }
                })
            }).catch(() => {
            });
        },
        showInvoiceModal() {
            this.$refs.incoiceModal.show();
        },
        addInvoice(val) {         
            let valObj = Object.assign({}, val);
            valObj.sourceOrderNo = this.cardRechargeOrderNo;
            if(this.cardInvoiceList.length == 0) {
                this.cardInvoiceList.push(valObj);
                this.orgCardInvoiceList.push(valObj);
            }else {
                let onoff = true;
                for(let [i, item] of this.cardInvoiceList.entries()) {
                    if(item.invoiceNo == valObj.invoiceNo) {
                        Message({
                            type: "warning",
                            message: "该发票号已存在,请重新添加！"
                        });
                        onoff = false;
                        return;
                    }
                };
                if(onoff) {
                    this.cardInvoiceList.push(valObj);
                    this.orgCardInvoiceList.push(valObj);
                }
            }
            this.cardInvoiceTotal = this.countPayTotal(this.cardInvoiceList,'invoiceAmount');
        },
        delInvoiceList() {
            if(this.invoiceSel === "") {
                Message({
                    type: "warning",
                    message: "请选择删除项！"
                });
                return;
            } 
            if(this.invoiceSel.operation && this.invoiceSel.operation != '0') { 
                Message({
                        type: "warning",
                        message: "该发票号不可删除！"
                    });
                 return;
            }
            MessageBox.confirm('确定删除吗?', '提示', {
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
            }).then(() => {				  
                if(this.invoiceSel.id != undefined){
                    if(this.invoiceSel.operation == '0') {
                        for(let [i, item] of this.orgCardInvoiceList.entries()) {
                            if(item.invoiceNo == this.invoiceSel.invoiceNo) {
                                this.orgCardInvoiceList[i].isDeleted = '1';
                                break;
                            }
                        };
                        for(let [i, item] of this.cardInvoiceList.entries()) {
                            if(item.invoiceNo == this.invoiceSel.invoiceNo) {
                                this.cardInvoiceList.splice(this.cardInvoiceList.indexOf(this.invoiceSel), 1);
                                break;
                            }
                        };
                    }else {
                        Message({
                            type: "warning",
                            message: "该发票号不可删除！"
                        });
                    }
                }else {
                    for(let [i, item] of this.orgCardInvoiceList.entries()) {
                            if(item.invoiceNo == this.invoiceSel.invoiceNo) {
                                this.orgCardInvoiceList.splice(this.orgCardInvoiceList.indexOf(this.invoiceSel), 1);
                                break;
                            }
                        };
                    for(let [i, item] of this.cardInvoiceList.entries()) {
                        if(item.invoiceNo == this.invoiceSel.invoiceNo) {
                            this.cardInvoiceList.splice(this.cardInvoiceList.indexOf(this.invoiceSel), 1);
                            break;
                        }
                    };
                }
                this.cardInvoiceTotal = this.countPayTotal(this.cardInvoiceList,'invoiceAmount');
                if( this.cardInvoiceList.length != 0 && parseFloat(this.headModel.rechargeOriginalAmount) <= parseFloat(this.cardInvoiceTotal)) { 
                    this.isMakeInovice = true;
                }else{
                    this.isMakeInovice = false;
                }
                
            }).catch(() => {
            });
           
            
        },
        saveInvoicelist() {          
            if(this.cardInvoiceTotal != this.headModel.rechargeActualAmount && this.cardInvoiceTotal != 0) {
                 MessageBox.alert('发票总金额与实收金额不符！', '提示', {
                    confirmButtonText: '返回',
                    type: "warning",
                    callback: action => {
                       
                    }
                 })
                return;
            }
            if(this.storeInfoVo == null || this.storeInfoVo.storeCode == '') {
                Message({
                        type: "warning",
                        message: "该账号无门店信息，无法保存！"
                    });
                    return;
            }
            let param = [...this.orgCardInvoiceList];
            if(param.length == 0) {
                Message({
                        type: "warning",
                        message: "发票信息不可为空！"
                    });
                    return;
            }
            for(let [i, item] of param.entries()) {
                if(param[i].id == undefined) {
                    param[i].sourceOrderTypeCode = this.sourceOrderTypeCode;   
                    param[i].invoiceStatus = 0;    
                    param[i].storeCode = this.storeInfoVo.storeCode;  
                }else {
                    param[i].storeCode = this.storeInfoVo.storeCode;  
                }              
            };
            api.cardPay.editCardRechargeInvoiceInfo(param, (res) => {
                if(res.data.code === 'success') {	
                    Message({
                        type: "success",
                        message: "保存成功！"
                    });
                    this.isDSaveInvoice = true;
                    this._initData();
                    this.updateCardPayTabList(this.params);
                }
            })
        },
        invalidInvoice(val) {
            if(val === "") {
                Message({
                    type: "warning",
                    message: "请选择作废项！"
                });
                return;
            }
            // if(val.id == undefined) {
            //      Message({
            //         type: "warning",
            //         message: "该发票未保存，不可作废！"
            //     });
            //     return;
            // }
            if(val.operation != '1') {
                 Message({
                    type: "warning",
                    message: "该发票不可作废！"
                });
                return;
            }
            MessageBox.confirm('确定作废吗?', '提示', {
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {		
                for(let [i, item] of this.orgCardInvoiceList.entries()) {
                    if(item.invoiceNo == val.invoiceNo) {
                        this.orgCardInvoiceList[i].invoiceStatus = '-1';
                        break;
                    }
                };
                for(let [i, item] of this.cardInvoiceList.entries()) {
                    if(item.invoiceNo == val.invoiceNo) {
                        this.cardInvoiceList[i].invoiceStatus = '-1';
                        break;
                    }
                };	
                this.cardInvoiceTotal = this.countPayTotal(this.cardInvoiceList,'invoiceAmount');
            }).catch(() => {
            });
        },
        countPayTotal(arr, key) {
            let num = 0;
            for(let [i, item] of arr.entries()) {
                if(item.invoiceStatus != '1' && item.invoiceStatus != '-1' ) {
                    num += parseFloat(arr[i][key]);
                }           
            };
            return num.toFixed(2);
        },
        getColumnW(headStr) {
           return (headStr.length) * this.columW +36;
        },
    },
    watch: {
            '$route': '_initData',
            cardInvoiceList(val){          
                if(val.length == 0) {
                    this.isShowInvoiceDel = false;
                    this.isShowInvalid = false;
                }else {
                    this.isShowInvoiceDel = true;
                    this.isShowInvalid = false;
                    for(let [i, item] of val.entries()) {
                        if(item.id != undefined && item.invoiceStatus == 0) {
                           this.isShowInvalid = true;
                           break;
                        }           
                    };
                    for(let [i, item] of val.entries()) {
                        if(!item.id) {
                           this.isShowInvoiceDel = true;
                           return;
                        }           
                    };
                }
            },
            cardRechargeList(val) {
                if(val.length == 0) {
                    this.isShowPayDel = false;
                }else {
                    this.isShowPayDel = true;
                }
            },
            cardRechargeTotal(val) {
                this.invioceNum = parseFloat(val);
                if(this.invioceNum >= this.headModel.rechargeOriginalAmount) {
                    this.isShowCloseABtn = false;
                }else {
                    this.isShowCloseABtn = true;
                }
            },
            cardInvoiceTotal(val) {
                 this.isInvoiceSaveBtn = val == this.headModel.rechargeActualAmount ? false : true;  
                 if(this.headModel.rechargeActualAmount == 0) {
                     this.isInvoiceSaveBtn = true;
                 }          
            },
		},
    filters:{
        invoiceStatusFliter(val) {
            if(val == '0') {
                return '已开票';
            }else if(val == '1') {
                return '已退票';
            }else if(val == '-1') {
                return '已作废';
            }else if(val == '3') {
                return '已红冲';
            }
        },
    }
}
</script>
<style scoped>
.card-title{
    position: absolute;
    top: 10px;
    left: 120px;
}
.header-btn-r{
    position: absolute;
    top: 8px;
    right: 20px;
}
</style>
