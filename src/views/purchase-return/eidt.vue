<template>
    <div class="back-card">
        <b-card :header="`单号：${purchaseReturnOrderNo}&nbsp;&nbsp;创建人：${createBy}&nbsp;&nbsp;创建时间：${createTimeStr}`">
		   <div class="row mt-2">
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="门店*" :label-cols="4" class="text-right">
                        <AreaTree @select-change="selectedfun" ref="areaqueryshop" :storeAll='true' :class="{'inp-invalid' : inp.storeCode, 'text-left': true}" :readonly="isOrderSave"></AreaTree>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="供应商*" :label-cols="4" class="text-right">
                        <select-search @getValue="getSuppler" :params="supplierParam" :apiName="supplierApiName" :name1="'supplierName'" ref="supplierSelect" :class="{'inp-invalid' : inp.supplierCode}" :isDisabled="isOrderSave"></select-search>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="退换单类型*" :label-cols="4" class="text-right">
                        <b-form-select :options="purchaseReturnOrderTypeList" v-model="headData.purchaseReturnOrderType" disabled></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="预计退货日期*" :label-cols="4" class="text-right">
                        <el-date-picker
                            :disabled="isOrderSave"
                            :class="{'inp-invalid' : inp.estimatedReturnDateStr}"
                            v-model="headData.estimatedReturnDateStr"
                            type="date"
                            :picker-options="pickerOptions1"
                            placeholder="选择日期">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>              
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="实际退货日期" :label-cols="4" class="text-right">
                        <b-form-input v-model="headData.actualReturnDate" disabled></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="审批通过日期" :label-cols="4" class="text-right">
                        <b-form-input  v-model="headData.auditPassTime" disabled></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-12">
                    <b-form-fieldset horizontal label="退货原因*" :label-cols="1" class="text-right ml-3 pl-3">
                        <b-form-input  v-model.trim="headData.returnReason"  :disabled="isOrderSave"  :class="{'inp-invalid' : inp.returnReason}"></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-3">
                    <b-form-fieldset horizontal label="退货总数*" :label-cols="4" class="text-right  ml-3 pl-3">
                        <b-form-input  v-model="headData.totalNums"  :class="{'inp-invalid' : inp.totalNums}" disabled style=" margin-left: 12px;"></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-3 pr-0">
                    <b-form-fieldset horizontal label="运费" :label-cols="4" class="text-right pr-3">
                        <input type="number" v-model="headData.totalFreightFee" @input="inputFee" min="0" :class="{'inp-invalid' :inp.totalFreightFee, 'form-control':true}" :disabled="isOrderSave"/>
                         <span class="input-append-yuan">元</span>
                    </b-form-fieldset>
                </div>
                <div class="col-md-2">
                    <b-form-fieldset horizontal label="" class="text-left">
                        <b-form-group>
                            <b-form-checkbox-group id="checkboxes2" class="mt-1" v-model="headData.calFreigthFlag"  :disabled="headData.totalFreightFee<=0" @input="inputReckonIn">
                                <b-form-checkbox value="1">计入退货金额</b-form-checkbox>
                            </b-form-checkbox-group>
                        </b-form-group>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="退货总金额*" :label-cols="4" class="text-right pr-3">
                        <b-form-input  v-model="headData.totalMoney" disabled></b-form-input>
                        <span class="input-append-yuan">元</span>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mt-3">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="cancel" v-show="true">取消</b-button>
                        <b-button size="sm" variant="success" @click="saveData" v-show="isBtnSave" v-if="isEditPurchaseReturn">保存</b-button>
                        <b-button size="sm" variant="danger" @click="repealOrder" v-show="isBtnRepeal"  v-if="isRepealPurchaseReturn">撤销</b-button>
                        <b-button size="sm" variant="danger" @click="InvalidOrder" v-show="isBtnInvalid"  v-if="isInvailPurchaseReturn">作废</b-button>
                        <b-button size="sm" variant="primary" @click="submitOrder" v-show="isBtnSumbit" v-if="isSubmitPurchaseReturn" >提交审批</b-button>
                    </div>
                </div>
            </div>
		</b-card>
        <el-tabs type="border-card">
            <el-tab-pane label="退货明细">
                <div class="animated fadeIn">
                    <div class="row">              
                        <div class="col-md-6">
                            <b-button size="sm" variant="danger" @click="delOrderDetail" v-show="isBtnSave" v-if="isEditPurchaseReturn">删除</b-button>
                            <b-button size="sm" variant="success" @click="addDetailModelShow" v-show="isBtnSave" v-if="isEditPurchaseReturn">添加</b-button>                                                                          
                        </div>
                    </div>
                    <div class="table-scrollable mb-2 service-manhour">
                        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="tabeList" :fields="fields">
                            <template slot="sel" slot-scope="data">
                                <input type="checkbox" name="radio4" :value="data.item" v-model="detailSel"  :disabled="onlySee"/>
                            </template>
                            <template slot="whName" slot-scope="data">
                                <b-form-select v-if="!data.item.id" :options="data.item.whList" v-model="data.value" @input='selectWh(data.value, data.index)'></b-form-select>
                                <span v-if="data.item.id">{{data.value}}</span>
                            </template>
                            <template slot="returnNums" slot-scope="data">
                                <b-form-input type="number" min="0" v-model="data.value" @input='inputCount(data.value, data.index, "returnNums")' :disabled="!!data.item.id"></b-form-input>
                            </template>
                            <template slot="returnPrice" slot-scope="data">
                                <b-form-input type="number" min="0" v-model="data.value" @input='inputCount(data.value, data.index, "returnPrice")' :disabled="!!data.item.id"></b-form-input>
                            </template>
                            <template slot="batchNumber" slot-scope="data">
                                <a href="###" @click="seeBactchDetail(data.item.skuCode, data.item.whCode)">详情</a>
                            </template>
                        </b-table>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="审批履历">
            <div class="animated fadeIn">
                 <approval-record :orderNo='purchaseReturnOrderNo'></approval-record>
            </div> 
            </el-tab-pane>
        </el-tabs>
         <model ref="myModalRef1" :orderNo="purchaseReturnOrderNo" :storeCode="headData.storeCode"   @receive="receive"></model>
         <batchModal ref="myModalRef2" :whCode="batchwhCode" :skuCode='batchSkuCode' :outSourceNo="purchaseReturnOrderNo"></batchModal>
    </div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import {Table, TableColumn, Message, MessageBox, DatePicker,Tabs,  TabPane} from "element-ui"
import AreaTree from 'components/iris-areaqueryshop/index'
import common from 'common/common.js'
import {PURCHASE_RETURN_ORDERINFO_SEQ, PURCHASE_RETURN_SKUDETAIL_SEQ} from 'common/ref-code.js'
import {getSequence, getSequenceList} from 'common/api-common.js'
import {hasBtn} from 'common/api-common.js'
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'
import approvalRecord from 'components/approval-record/approval-record'
import selectSearch from '../sale-discount/selectSearch'
import model from './model.vue'
import batchModal from './batchModal.vue'
import directives from 'common/directives'

Vue.use(DatePicker);
Vue.use(Tabs);
Vue.use(TabPane);

export default {
    components: {
        AreaTree,
        approvalRecord,
        selectSearch,
        model,
        batchModal,
    },
    data() {
        return {
            batchwhCode: '',
            batchSkuCode: '',
            purchaseReturnOrderTypeList: config.purchaseReturn.purchaseReturnOrderTypeList,
            purchaseReturnOrderNo: '',
            orderStatus: '-100',
            wfStatus: '-100',
            userInfo: '',
            storeInfoVo: '',
            storeCode: '',
            createBy: '',
            headData: {
                storeCode: '',
                supplierCode: '',
                supplierName: '',
                purchaseReturnOrderType: '1',
                estimatedReturnDateStr: '',
                actualReturnDate: '',
                auditPassTime: '',
                returnReason: '',
                totalNums: 0,
                totalFreightFee: '0.00',
                calFreigthFlag: '0',
                totalMoney: '0.00',
            },
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() < Date.now()-8.64e7;
                }
            },
            supplierParam: {
                supplyType: '1',
            },
            supplierApiName:'supplier.querySupplierList',
            inp: {
                storeCode: false,
                supplierCode: false,
                estimatedReturnDateStr: false,
                returnReason: false,
                totalNums: false,
                totalFreightFee: false,
            },
            delTabeList:[],
            tabeList:[],
            fields: {},
            fieldsEidt: {	
                    sel: {
						label: "选择"
					},			
					skuCode: {
						label: "商品编码"
                    },
                    skuName: {
						label: "商品名称"
                    },
                    whName: {
						label: "仓库名称"
					},
					warehouseAddress: {
						label: "仓库地址"
					},
					availableNums: {
						label: "可退货库存数"
					},				
					returnNums: {
						label: "本次退货数"
					},
					returnPrice: {
						label: "退货单价（含税）"
                    },
                    returnTotalMoney: {
						label: "退货金额（含税）"
                    },
                    barCode: {
						label: "69码"
                    },
                    originalCode: {
						label: "原厂编码"
                    },
                    skuModel: {
						label: "型号"
                    },
                    skuStandards: {
						label: "规格"
                    },
            },
            fieldsEidtEffect: {	
                    sel: {
						label: "选择"
					},			
					skuCode: {
						label: "商品编码"
                    },
                    skuName: {
						label: "商品名称"
                    },
                    whName: {
						label: "仓库名称"
					},
					warehouseAddress: {
						label: "仓库地址"
					},
					availableNums: {
						label: "可退货库存数"
					},				
					returnNums: {
						label: "本次退货数"
					},
					returnPrice: {
						label: "退货单价（含税）"
                    },
                    returnTotalMoney: {
						label: "退货金额（含税）"
                    },
                    barCode: {
						label: "69码"
                    },
                    originalCode: {
						label: "原厂编码"
                    },
                    skuModel: {
						label: "型号"
                    },
                    skuStandards: {
						label: "规格"
                    },
                     batchNumber: {
						label: "涉及批次"
					},
            },
            fieldsSee: {						
					skuCode: {
						label: "商品编码"
                    },
                    skuName: {
						label: "商品名称"
                    },
                    whName: {
						label: "仓库名称"
					},
					warehouseAddress: {
						label: "仓库地址"
					},
					availableNums: {
						label: "可退货库存数"
					},				
					returnNums: {
						label: "本次退货数"
					},
					returnPrice: {
						label: "退货单价（含税）"
                    },
                    returnTotalMoney: {
						label: "退货金额（含税）"
                    },
                    barCode: {
						label: "69码"
                    },
                    originalCode: {
						label: "原厂编码"
                    },
                    skuModel: {
						label: "型号"
                    },
                    skuStandards: {
						label: "规格"
                    },
            },
            fieldsSeeEffect: {						
					skuCode: {
						label: "商品编码"
                    },
                    skuName: {
						label: "商品名称"
                    },
                    whName: {
						label: "仓库名称"
					},
					warehouseAddress: {
						label: "仓库地址"
					},
					availableNums: {
						label: "可退货库存数"
					},				
					returnNums: {
						label: "本次退货数"
					},
					returnPrice: {
						label: "退货单价（含税）"
                    },
                    returnTotalMoney: {
						label: "退货金额（含税）"
                    },
                    barCode: {
						label: "69码"
                    },
                    originalCode: {
						label: "原厂编码"
                    },
                    skuModel: {
						label: "型号"
                    },
                    skuStandards: {
						label: "规格"
                    },
                    batchNumber: {
						label: "涉及批次"
					},
            },
            detailSel: [],
            onlySee: false,
            isOrderSave: false,
            isDetailSave: false,
            params:{
                pageNums:config.pageNums,  
            },
            createTimeStr: '',
        }
    },
    created() {		
      this.getUserInfo();
      this._initData();
	},
    computed: {
        ...mapState('purchaseReturn',[
				'searchParam',				
            ]),
        isEditPurchaseReturn(){
				return hasBtn(collectionApi.purchaseReturn.updatePurchaseReturnOrderInfo);
            },
        isAddPurchaseReturn(){
				return hasBtn(collectionApi.purchaseReturn.insertPurchaseReturnOrderInfo);
            },
        isSubmitPurchaseReturn(){
				return hasBtn(collectionApi.purchaseReturn.submitPurchaseReturnOrderInfo);
            },
        isInvailPurchaseReturn(){
				return hasBtn(collectionApi.purchaseReturn.cancelPurchaseReturnOrderInfo);
            },
        isRepealPurchaseReturn(){
				return hasBtn(collectionApi.purchaseReturn.withdrawPurchaseReturnOrderInfo);
            },
        isBtnSave() {
            if(this.onlySee) {
                 return false;
            }else if(this.orderStatus == '-100' && !this.isOrderSave) {
                return true;
            }else if(this.orderStatus == '-100' && this.isOrderSave) {
                return false;
            }else if(this.orderStatus == '0' && !this.isOrderSave) {
                return true;
            }else if(this.orderStatus == '0' && this.isOrderSave) {
                return false;
            }else{
                return false;
            }
        },
        isBtnSumbit() {
            if(this.onlySee) {
                 return false;
            }else if(this.orderStatus == '0' && !this.isOrderSave) {
                return false;
            }else if(this.orderStatus == '0' && this.isOrderSave) {
                return true;
            }else{
                return false;
            }
        },  
        isBtnEidt() {
            if(this.onlySee) {
                 return false;
            }else if(this.orderStatus == '0' && !this.isOrderSave) {
                return false;
            }else if(this.orderStatus == '0' && this.isOrderSave) {
                return true;
            }else{
                return false;
            }
        },
        isBtnInvalid() {
            if(this.onlySee) {
                 return false;
            }else if(this.orderStatus == '0') {
                return true;
            }else{
                return false;
            }
        },
        isBtnRepeal() {
            if(this.onlySee) {
                 return false;
            }else if(this.orderStatus == '1') {
                return true;
            }else{
                return false;
            }
        },
        isEidtDetail() {
            if(this.onlySee) {
                 return false;
            }else if(this.orderStatus == '0' || this.orderStatus == '-100') {
                return true;
            }else{
                return false;
            }
        },
    },
    methods: {
        ...mapActions('purchaseReturn',[
				'setTableList',
				'setSearchParam',
				'setPages',
                'updatePurchaseReturnTabList',
            ]),
        getUserInfo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            let stroe = userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
            this.userInfo = userInfo;
            this.storeInfoVo = stroe;
            // if(stroe.storeCode) {
            //     this.storeCode = stroe.storeCode;
            // }
        },
        // 获取折扣明细
        getDetailList(val) {
            const option = {
                'purchaseReturnOrderNo':val,
            }
            return new Promise((reslove,reject) => {
               api.purchaseReturn.queryPromotionDiscountRuleInfoExts(option, (res) => {
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
                _this.headData.storeCode = data1.value;
            }
        },
        getSuppler(val) {
            this.headData.supplierCode = val.supplierCode;
            this.headData.supplierName = val.supplierName;;
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
           
            if(routeQuery.purchaseReturnOrderNo == undefined || routeQuery.purchaseReturnOrderNo == '') {
                    this.$router.push({name: 'purchase-return-search'})              
            }else {
                this.purchaseReturnOrderNo = routeQuery.purchaseReturnOrderNo;
                let param = {
                    purchaseReturnOrderNo: this.purchaseReturnOrderNo
                }
                api.purchaseReturn.getPurchaseReturnOrderInfoByCode(param, (res) => {
                    if(res.data.code === 'success') {	
                        let data = res.data.obj;
                        if(data == null) {

                        }else {
                            this.orderStatus = data.orderStatus;
                            this.wfStatus = data.wfStatus;
                            this.storeCode = data.storeCode;   
                            this.createTimeStr = data.createTimeStr;   
                            this.createBy = data.createBy;                 
                            for(let key of Object.keys(this.headData)) {
                                this.headData[key] = data[key];
                            }
                            this.headData.id = data.id;
                            this.$refs.supplierSelect.setVal(data.supplierName);                   
                            let stroeParam = {
                                    value: data.storeCode,
                                    text: data.storeName,
                                }
                            this.$refs.areaqueryshop.setselect(stroeParam); 
                            for(let [i, item] of data.purchaseReturnSkuDetailInfoVoList.entries()) {
                                let num = parseFloat(item.returnNums) ? parseFloat(item.returnNums) : 0;
                                let price = parseFloat(item.returnPrice) ? parseFloat(item.returnPrice) : 0;
                                data.purchaseReturnSkuDetailInfoVoList[i].returnTotalMoney = (num * price).toFixed(2);
                            };
                            this.tabeList = data.purchaseReturnSkuDetailInfoVoList;
                            if(data.orderStatus != '0') {
                                this.isOrderSave = true;
                            }
                            if((data.orderStatus == '2' || data.orderStatus == '3') && this.onlySee) {
                                this.fields = this.fieldsSeeEffect;
                            }else if((data.orderStatus == '2' || data.orderStatus == '3') && !this.onlySee) {
                                this.fields = this.fieldsEidtEffect;
                            }else if(this.onlySee) {
                                this.fields = this.fieldsSee;
                            }else if(!this.onlySee) {
                                this.fields = this.fieldsEidt;
                            }
                            if(this.onlySee) {
                                this.isOrderSave = true;
                            }
                        }
                    }
                })
            }
        },
        cancel() {
             this.$router.push({
                                name: 'purchase-return-search',    
                            })
        },
        saveData() {
            let isVerity = true;
            for(let key of Object.keys(this.inp)) {
                this.inp[key] = false;
                 if(key == 'totalFreightFee') {            
                    if(this.headData[key] === '' || this.headData[key] === null  || parseFloat(this.headData[key]) < 0) {
                        this.inp[key] = true;
                        isVerity = false;
                    }
                }else {
                    if(this.headData[key] == '' || this.headData[key] == null) {
                        this.inp[key] = true;
                        isVerity = false;
                    }
                }
            }
            
            if(!isVerity) {
                return;
            }
            if(this.tabeList.length != 0) {
                for(let [i, item] of this.tabeList.entries()) {
                    if(item.id) {
                        continue;
                    }                   
                    if(!item.whCode) {
                         Message({
                            type: "warning",
                            message: "请选择仓库！"
                        });
                        return;
                    }                   
                    if(!(parseFloat(item.returnNums) && parseFloat(item.returnNums) > 0)) {                     
                         Message({
                            type: "warning",
                            message: "退货明细退货数量不可小于等于0！"
                        });
                        return;
                    }else {
                        if(parseFloat(item.returnNums) > item.availableNums) {
                             Message({
                                type: "warning",
                                message: "退货数量不可大于可用库存数量！"
                            });
                            return;
                        }
                    }
                    if(!(parseFloat(item.returnPrice) && parseFloat(item.returnPrice) > 0)) {
                         Message({
                            type: "warning",
                            message: "退货明细退货单价不可小于等于0！"
                        });
                        return;
                    }
                    
                };
            }
            let param = Object.assign({}, this.headData);
            param.estimatedReturnDateStr = common.eleTimeFormat(this.headData.estimatedReturnDateStr) == '1970-01-01' ? '': common.eleTimeFormat(this.headData.estimatedReturnDateStr);
            param.purchaseReturnOrderType = param.purchaseReturnOrderType;
            param.purchaseReturnOrderNo = this.purchaseReturnOrderNo;
            param.calFreigthFlag =  param.calFreigthFlag == '1'? '1': '0';
            delete param.actualReturnDate;
            delete param.auditPassTime;
           
            param.purchaseReturnSkuDetailInfoVoList = [...this.tabeList];
            if(!this.headData.id) {
                api.purchaseReturn.insertPurchaseReturnOrderInfo(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "保存成功！"
                        });
                        this.isOrderSave = true;
                        this._initData();     
                        this.updatePurchaseReturnTabList(this.searchParam);                 
                    }
                })          
            }else {    
                param.purchaseReturnSkuDetailInfoVoList = [...this.tabeList, ...this.delTabeList];          
                api.purchaseReturn.updatePurchaseReturnOrderInfo(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "保存成功！"
                        });        
                        this.isOrderSave = true;          
                        this._initData();
                        this.updatePurchaseReturnTabList(this.searchParam);
                    }
                })
            }
           
        },
        repealOrder() {
            let param = {
                purchaseReturnOrderNo: this.purchaseReturnOrderNo,           
            };
           api.purchaseReturn.withdrawPurchaseReturnOrderInfo(param, (res) => {
                if(res.data.code === 'success') {	
                    Message({
                        type: "success",
                        message: "撤销成功！"
                    });
                    this._initData();
                    this.updatePurchaseReturnTabList(this.searchParam);
                }
            })
        },
        InvalidOrder() {
            let param = {
                purchaseReturnOrderNo: this.purchaseReturnOrderNo,
            };
           api.purchaseReturn.cancelPurchaseReturnOrderInfo(param, (res) => {
                if(res.data.code === 'success') {	
                    Message({
                        type: "success",
                        message: "作废成功！"
                    });
                    this._initData();
                    this.updatePurchaseReturnTabList(this.searchParam);
                }
            })
        },
        submitOrder() {
            let param = {
                purchaseReturnOrderNo: this.purchaseReturnOrderNo,
            };
           api.purchaseReturn.submitPurchaseReturnOrderInfo(param, (res) => {
                if(res.data.code === 'success') {	
                    Message({
                        type: "success",
                        message: "提交成功！"
                    });
                    this._initData();
                    this.updatePurchaseReturnTabList(this.searchParam);
                }
            })
        },
        addDetailModelShow() {
          this.$refs.myModalRef1.show();
        },
        addDetail(obj) {
          
        },
        delOrderDetail() {
            if(this.detailSel.length == 0 ) {
                Message({
                    type: "warning",
                    message: "请选择删除项！"
                });
                return;
            } 
            for(let [i, item] of this.detailSel.entries()) {
               if(item.id){
                   let obj = Object.assign({}, item)
                   obj.isDeleted = '1';
                   this.delTabeList.push(obj)
               }
               for(let [j, obj] of this.tabeList.entries()) {
                    if(JSON.stringify(item) == JSON.stringify(obj)){
                        this.tabeList.splice(j, 1);
                    }               
                };
                this.countNumAndMoney();
            };      
            
        },
        receive(val){
            this.tabeList = [...this.tabeList, ...val];
        },
        inputFee(val) {
            if(val <= 0) {
                this.headData.calFreigthFlag = 0;
            }
            this.countNumAndMoney();
        },
        inputReckonIn(val) {
             this.countNumAndMoney();
        },
        selectWh(val, index) {
            let whInfo = JSON.parse(val);
            this.tabeList[index].whCode = whInfo.whCode;
            this.tabeList[index].warehouseAddress = whInfo.warehouseAddress;
            this.tabeList[index].availableNums = whInfo.availableNums;
            this.tabeList[index].returnTotalMoney = 0.00;
            this.tabeList[index].returnNums = 0;
            this.tabeList[index].returnPrice = 0;
            this.tabeList = JSON.parse(JSON.stringify(this.tabeList));
            this.countNumAndMoney();
        },
        inputCount(val, index, key) {
            this.tabeList[index][key] = val;
            if(key == 'returnNums') {
                if(parseFloat(val)) {
                    this.tabeList[index].returnTotalMoney = (parseFloat(val) * parseFloat(this.tabeList[index].returnPrice)).toFixed(2);
                }else{
                    this.tabeList[index].returnTotalMoney = '0.00';
                }   
            }else{
                if(parseFloat(val)) {
                    this.tabeList[index].returnTotalMoney = (parseFloat(val) * parseFloat(this.tabeList[index].returnNums)).toFixed(2);
                }else{
                    this.tabeList[index].returnTotalMoney = '0.00';
                } 
            }
            this.tabeList = JSON.parse(JSON.stringify(this.tabeList));
            this.countNumAndMoney();
        },
        countNumAndMoney() {
            let totalNum = 0;
            let totalMoney = 0;
            for(let [i, item] of this.tabeList.entries()) {
               if(parseFloat(item.returnNums)) {
                   totalNum += parseFloat(item.returnNums);
               }
               if(parseFloat(item.returnTotalMoney)) {
                   totalMoney += parseFloat(item.returnTotalMoney);
               }
            };
            if( this.headData.calFreigthFlag == '1') {
                if(parseFloat(this.headData.totalFreightFee)) {
                   totalMoney += parseFloat(this.headData.totalFreightFee);
                }
            }
            this.headData.totalNums = totalNum;
            this.headData.totalMoney = totalMoney.toFixed(2);
        },
        seeBactchDetail(val1, val2){
            this.batchSkuCode = val1;
            this.batchwhCode = val2;
            this.$refs.myModalRef2.show();
        },
    },
    watch: {
            '$route': '_initData',
            
		},
    filters:{
        
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
