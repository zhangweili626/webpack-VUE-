<template>
    <div>
         <b-modal size="lg" title="新建规则" ref="saleDiscountAdd" >
			 <div class="container-fluid">
                <b-row>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="岗位类型" :label-cols="4" class="text-right">
                             <b-form-select :options="postTypeList" v-model="postTypeCode"  :class="{'inp-invalid' : inp.postTypeCode}"></b-form-select>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="适用类型" :label-cols="4" class="text-right">
                             <b-form-select :options="useTypeAddList" v-model="useType"   :state="inp.useType"></b-form-select>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="岗位编码/名称" :label-cols="4" class="text-right">
                           <select-search @getValue="getPost" :params="postParam" :apiName="postApiName" :name2="'postCode'" :name1="'postName'" :onoffV='true' ref="postSelect" :class="{'inp-invalid' : inp.postCode}"></select-search>
                        </b-form-fieldset>
                    </div>
                     <div class="col-md-6"  v-show="useType=='0'">
                        
                    </div> 
                    <div class="col-md-6"  v-show="useType=='1'">
                        <b-form-fieldset horizontal label="服务分类" :label-cols="4" class="text-right">
                            <serviceClassTree  @getSureData="getServiceClass" ref="serviceClassSelect"></serviceClassTree>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6"  v-show="useType=='2'">
                        <b-form-fieldset horizontal label="商品分类" :label-cols="4" class="text-right">
                           <skuClassTree  @getSureData="getSkuClass" ref="skuClassSelect"  :class="{'inp-invalid' : inp.skuClass}"></skuClassTree>
                        </b-form-fieldset>
                    </div>   
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="人员编码/名称" :label-cols="4" class="text-right">
                            <select-search @getValue="getEmp" :params="empParam" :apiName="empApiName" :onoffEmp='true' :name2="'empCode'" :name1="'empCnName'"  ref="empSelect"  :class="{'inp-invalid' : inp.empCode}"></select-search>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6"  v-show="useType=='0'">
                        
                    </div> 
                    <div class="col-md-6"  v-show="useType=='1'">
                        <b-form-fieldset horizontal label="服务编码/名称" :label-cols="4"  class="text-right">
                             <el-select
                                :class="{'inp-invalid' : inp.serviceCodeList}"
                                style="width: 100%;"
                                v-model="serviceCodeList"
                                multiple
                                filterable
                                remote
                                placeholder="请输入关键词"
                                :remote-method="getServieList"
                                :loading="serviceLoading">
                                <el-option
                                v-for="item in serviceList"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </b-form-fieldset>
                    </div>               
                    <div class="col-md-6" v-show="useType=='2'">
                        <b-form-fieldset horizontal label="商品编码/名称" :label-cols="4" class="text-right">
                            <el-select
                                :class="{'inp-invalid' : inp.skuCodeList}"
                                style="width: 100%;"
                                v-model="skuCodeList"
                                multiple
                                filterable
                                remote
                                placeholder="请输入关键词"
                                :remote-method="getSkuList"
                                :loading="skuLoading">
                                    <el-option
                                    v-for="item in skuList"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                                    </el-option>
                            </el-select>
                        </b-form-fieldset>
                    </div>
                </b-row>
                <b-row>                                    
                    <div class="col-md-12 ml-3">折扣类型</div>
                </b-row>
                <b-row>
                    <div class="col-md-1"></div>
                    <div class="col-md-11 box-border-radio mt-2 pt-3">
                        <b-form-group label="">
                            <b-form-radio-group id="radios2" v-model="discountType" stacked name="discountType" >
                                <b-form-radio value="0">
                                    <span>固定金额</span>
                                    <input :class="{'inp-invalid' : inp.discountValue0}" type="text" class="form-control"  v-number-input v-model="discountValue0" :disabled="discountType == '1'">        
                                    <span>填写200.00表示最大权限为减200.00元</span>
                                </b-form-radio>
                                <b-form-radio value="1" class="mt-3">
                                    <span>百分比</span>
                                    <input :class="{'inp-invalid' : inp.discountValue1}" type="text" class="form-control" v-number-input v-model="discountValue1" :disabled="discountType == '0'">  
                                    <span>% 填写15，表示最大折扣为85折</span>
                                </b-form-radio>                            
                            </b-form-radio-group>
                        </b-form-group>
                    </div>                   
                </b-row>
			 </div>
			<div slot="modal-footer">         				
				<b-btn size="sm" class="float-right" variant="success" @click="surePay">保存</b-btn>
				<b-btn size="sm" class="float-right mr-2" variant="seconday" @click="cancelModal">取消</b-btn>
			</div>
		</b-modal>     
    </div>
</template>
<script>
import Vue from "vue"
import suitScope from 'components/iris-suitscope'
import { Message , DatePicker, Dialog, Select, Option} from "element-ui"
import collectionApi from 'common/api-collection.js'
import common from 'common/common.js'
import {getSequence, getSequenceList} from 'common/api-common.js'
import {PROMOTION_DISCOUNT_RULE_SEQ, PROMOTION_DISCOUNT_RULE_DETAIL_SEQ} from 'common/sequence.js'
import {POSITION_TYPE} from 'common/ref-code.js'
import api from 'common/api'
import config from 'common/config'
import selectSearch from './selectSearch'
import skuClassTree from './skuClassTree'
import serviceClassTree from './serviceClassTree'
import directives from 'common/directives'

Vue.use(DatePicker);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Option);


// 选择确定触发事件surePay
export default {
    components: {
        selectSearch,
        skuClassTree,
        serviceClassTree
    },
    props: {
        userInfo: {
                type: Object,
                default: function() {
                    return {};
                }
            },
        storeCode: {
                type: String,
                default: function() {
                    return '';
                }
            },
        promotionDiscountOrderNo: {
                type: String,
                default: function() {
                    return '';
                }
            },
    },
    data() {
        return {           
            useTypeAddList: config.saleDiscount.useTypeAddList,
            skuClassAllList: [],
            skuList: [],
            serviceClassAllList: [],
            serviceList: [],
            postTypeList: [],    
            postTypeCode: '',
            postCode: '',
            empCode: '',
            useType: '0',
            skuClass: '',
            skuCodeList: '',
            serviceClass: '',
            serviceCodeList: '',
            discountType: '0',
            discountValue0: '',
            discountValue1: '',
            postParam: {
                storeCode: this.storeCode,
                postTypeCode: '',
            },
            postApiName:'saleDiscount.getStoreAllPost',
            empParam: {
                storeCode: this.storeCode,
                postCode: '',
            },
            empApiName:'saleDiscount.getStorePostEmp',
            dataModel: {
                postTypeCode: '',
                postCode: '',
                empCode: '',
                useType: '',
                discountType: '',
                discountValue0: '',
                discountValue1: '',
            },
            inp: {
                postTypeCode: false,
                postCode: false,
                empCode: false,
                serviceCodeList: false,
                skuClass: false,
                skuListCodeList: false,
                discountValue0: false,
                discountValue1: false,
            },
            serviceLoading: false,
            skuLoading: false,
        }
    },
    computed: {
       
    },
    created() {       
        this.getPostTypeList();
    },
    mounted() {
         
    },
    methods: {
        // 获取岗位类型
		getPostTypeList() {
            let _this = this;
            const option = {
                'refCode': POSITION_TYPE
            }
            api.ref.getDataDictionarys(option, (res) => {
                if (res.data.code === 'success') {
                    let data = res.data.obj.referenceDetailInfos;    
                    let arr =[
                        {
                            value: '',
                            text: ''
                        }
                    ];                
                    data.forEach((item, index) => {
                        let obj = {
                            value: item.refDetailCode,
                            text: item.refDetailName
                        }
                        arr.push(obj);
                    })
                    _this.postTypeList = arr;
                }
            })		
        },
        // 获取商品分类
        getSkuClassAll() {
             const option = {
                    'categoryCode': '000001'
                }
                api.saleDiscount.getSkuInfoByCategoryCodeAll(option, (res) => {
                    if (res.data.code === 'success') {
                        let data = res.data.obj.skuCategorySubInfo;    
                        let arr =[];                
                        data.forEach((item, index) => {
                            let obj = {
                                value: item.categoryCode,
                                text: item.categoryName
                            }
                            arr.push(obj);
                        })
                        this.skuClassAllList = arr;
                    }
                })		
        },
        // 获取商品列表
        getSkuList(val) {
            // if(this.skuClass.length == 0) {
            //     return;
            // }
            let option = {
                    'skuType': 'goodsTypeGood',
                    'skuTypeList': this.skuClass, 
                    'skuCodeOrName': val,
                    'pageNums': 200,
                    'pageStart': 1
                }
             setTimeout(() => {        
                api.skuData.getInfo(option, (res) => {
                    if (res.data.code === 'success') {
                        let data = res.data.obj.list;    
                        let arr =[];      
                        if(data.length != 0) {
                            data.forEach((item, index) => {
                                let obj = {
                                    value: item.skuCode,
                                    text: item.skuName
                                }
                                arr.push(obj);
                            })
                            this.skuLoading = false;
                            this.skuList = arr;
                        }else{
                            this.skuList = [];
                        }          
                    }
                })		
            }, 200);	
        },
        // 获取服务分类
        getServiceClassAll() {
             let option = {
                    'categoryCode': '000001'
                }
                api.saleDiscount.getServiceCategoryInfoByCategoryCodeAll(option, (res) => {
                    if (res.data.code === 'success') {
                        let data = res.data.obj.serviceCategorySubInfo;    
                        let arr =[];                
                        data.forEach((item, index) => {
                            let obj = {
                                value: item.categoryCode,
                                text: item.categoryName
                            }
                            arr.push(obj);
                        })
                        this.serviceClassAllList = arr;
                    }
                })		
        },
        // 获取服务列表
        getServieList(val) {
            // if(this.serviceClass.length == 0) {
            //     return;
            // }
            let option = {
                    'categoryCodeList': this.serviceClass,
                    'serviceCodeOrName': val,
                }
             setTimeout(() => {
                 
                api.saleDiscount.queryServiceAvailableInfo(option, (res) => {
                    if (res.data.code === 'success') {
                        let data = res.data.obj;    
                        let arr =[];    
                        if(data.length != 0) { 
                            data.forEach((item, index) => {
                                let obj = {
                                    value: item.serviceCode,
                                    text: item.serviceName
                                }
                                arr.push(obj);
                            })
                            this.serviceLoading = false;
                            this.serviceList = arr;
                        }else{
                            this.serviceList = [];
                        }             
                    }
                })		
            }, 200);
            
        },
        surePay() {
            let param = {
                promotionDiscountRuleDetailInfo: []
            };
            let itemType = '';
            let isVerify = false;
            for(let key of Object.keys(this.inp)) {
                this.inp[key] = false;
            }
            // if(this.postTypeCode === '' && this.postCode == '' && this.empCode == '') {
            //     Message({
            //         type: "warning",
            //         message: "请选择岗位类型或岗位或人员！"
            //     });
            //     this.inp.postTypeCode = true;
            //     this.inp.postCode = true;
            //     this.inp.empCode = true;
            //     isVerify = true;
            // }
            param.promotionDiscountOrderNo = this.promotionDiscountOrderNo;
            param.postTypeCode = this.postTypeCode;
            param.postCode = this.postCode;
            param.empCode = this.empCode;
            param.useType = this.useType;
            param.discountType = this.discountType;
            if(param.empCode) {
                param.postTypeCode = '';
                param.postCode = '';
            }else if(param.postCode){
                param.postTypeCode = '';
                param.empCode = '';
            }else if(param.postTypeCode){
                param.postCode = '';
                param.empCode = '';
            }else{
                Message({
                    type: "warning",
                    message: "请选择岗位类型或岗位或员工！"
                });
                return
            }
            if(this.useType == '1') {
                if(this.serviceClass.length == 0 && this.serviceCodeList.length == 0) {
                    Message({
                        type: "warning",
                        message: "请选择服务分类或服务！"
                    });
                    this.inp.serviceClass = true;
                    this.inp.serviceCodeList = true;
                    isVerify = true;
                }else {
                    if(this.serviceCodeList.length != 0) {
                        itemType = 3;
                        for(let [i, item] of this.serviceCodeList.entries()) {
                           let obj = {
                                promotionDiscountOrderNo: this.promotionDiscountOrderNo,
                                discountItemCode: item,
                                discountItemType: 3,
                            }
                            param.promotionDiscountRuleDetailInfo.push(obj);
                        }
                    }else if(this.serviceClass.length != 0){
                        itemType = 2;
                        for(let [i, item] of this.serviceClass.entries()) {
                           let obj = {
                                promotionDiscountOrderNo: this.promotionDiscountOrderNo,
                                discountItemCode: item,
                                discountItemType: 2,
                            }
                            param.promotionDiscountRuleDetailInfo.push(obj);
                        }
                    }
        
                }
            }else if(this.useType == '2') {
                if(this.skuClass.length == 0 && this.skuCodeList.length == 0) {
                    Message({
                        type: "warning",
                        message: "请选择商品分类或商品！"
                    });
                    this.inp.skuClass = true;
                    this.inp.skuCodeList = true;
                    isVerify = true;
                }else {
                    if(this.skuCodeList.length != 0) {
                        itemType = 1;
                        for(let [i, item] of this.skuCodeList.entries()) {
                           let obj = {
                                promotionDiscountOrderNo: this.promotionDiscountOrderNo,
                                discountItemCode: item,
                                discountItemType: 1,
                            }
                            param.promotionDiscountRuleDetailInfo.push(obj);
                        }
                    }else if(this.skuClass.length != 0){
                        itemType = 0;
                        for(let [i, item] of this.skuClass.entries()) {
                           let obj = {
                                promotionDiscountOrderNo: this.promotionDiscountOrderNo,
                                discountItemCode: item,
                                discountItemType: 0,
                            }
                            param.promotionDiscountRuleDetailInfo.push(obj);
                        }
                    }
        
                }
            };
           if(this.discountType == '0'){
                if(this.discountValue0 == '' || parseFloat(this.discountValue0) == 0) {
                    Message({
                        type: "warning",
                        message: "固定金额填写错误！"
                    });
                    this.inp.discountValue0 = true;
                    isVerify = true;
                }
                param.discountValue = this.discountValue0;
            }else if(this.discountType == '1'){
                if(this.discountValue1 == '' || parseFloat(this.discountValue1) == 0 || parseFloat(this.discountValue1) > 100) {
                    Message({
                        type: "warning",
                        message: "百分比写错误！"
                    });
                    this.inp.discountValue1 = true;
                    isVerify = true;
                }
                param.discountValue = (100 - this.discountValue1) / 100;
            }
            if(isVerify) {
                return;
            }
            getSequence(PROMOTION_DISCOUNT_RULE_SEQ, (res) => {
                param.promotionDiscountRuleCode = res;
                param.discountItemType = itemType;
                if(param.promotionDiscountRuleDetailInfo.length > 0) {
                    let seqParam = {
                        serviceCode: PROMOTION_DISCOUNT_RULE_DETAIL_SEQ,
                        getNums: param.promotionDiscountRuleDetailInfo.length,
                    }
                    getSequenceList(seqParam, result => {
                        for(let [i, item] of result.entries()) {
                            param.promotionDiscountRuleDetailInfo[i].promotionDiscountRuleCode = res;
                            param.promotionDiscountRuleDetailInfo[i].promotionDiscountRuleDetailCode = item;
                        }
                        
                        this.$emit('sureDetail', param);
                        this.cancelModal();
                    })
                }else {
                    this.$emit('sureDetail', param);
                    this.cancelModal();
                }
                
            })
           
        },
        getPost(val) {
            this.postCode = val.postCode;
        },
        getEmp(val) {
            this.empCode = val.empCode;
        },
        cancelModal() {
           this.$refs.saleDiscountAdd.hide(); 
        },
        showModal() {
            this.$refs.saleDiscountAdd.show();        
        },
        selectPayment(val) {
            if(val=== '') {
                return;
            }
            let valObj = JSON.parse(val);
            this.dataModel.postTypeCodeCode = valObj.value;
            this.dataModel.postTypeCodeName = valObj.text;
        },
        // 获取sku分类
        getSkuClass(val){
            let arr = [];
            if(val.length != 0) {             
                val.forEach((item, index) => {
                    arr.push(item.categoryCode)
                })            
            }
            this.skuClass = arr;
        },
        // 获取服务分类
        getServiceClass(val) {
             let arr = [];
            if(val.length != 0) {             
                val.forEach((item, index) => {
                    arr.push(item.categoryCode)
                })            
            }
            this.serviceClass = arr;
        },
        reset() {
            this.$refs.serviceClassSelect.clear();
            this.$refs.skuClassSelect.clear();
            this.$refs.postSelect.clear();  
            this.$refs.empSelect.clear();
            for(let key of Object.keys(this.dataModel)) {
                this[key] = '';
            }
            this.serviceClass = [];
            this.serviceCodeList = [];
            this.skuClass = [];
            this.skuCodeList = [];
            this.useType = '0';
            this.postTypeCode = '';
            this.discountType = '0'; 
            this.postParam.postTypeCode = '';            
            this.empParam.postCode = '';         
        }
    },
    watch:{
        useType(val) {        
            this.$refs.serviceClassSelect.clear();
            this.$refs.skuClassSelect.clear();
            this.skuClass = [];
            this.skuCodeList = [];
            this.serviceClass = [];
            this.serviceCodeList = [];  
            if(val == '0') {
                
            }else if(val == '1') {
                this.getServieList('');
            }else if(val == '2') {
                this.getSkuList('');
            }
        },
        skuClass(val) {
            if(val.length != 0) {
                this.getSkuList('');
            }
            this.skuCodeList = [];
        },
        serviceClass(val) {
            if(val.length != 0) {
                this.getServieList('');
            }
            this.serviceCodeList = [];
        },
        postTypeCode(val) {
            if(val !== '' && val !== undefined) {
                this.postParam.postTypeCode = val;    
                this.postCode = '';
                this.$refs.postSelect.clear();  
                this.empCode = '';
                this.$refs.empSelect.clear();  
            }  
        },
        postCode(val){
            if(val !== '' && val !== undefined) { 
                this.empParam.postCode = val;
                this.postTypeCode = '';
                this.empCode = '';
                this.$refs.empSelect.clear();
            }
            
        },
        empCode(val) {
            if(val !== '' && val !== undefined) {              
                this.postTypeCode = '';
                this.$refs.postSelect.clear();  
                this.postParam.postTypeCode = ''; 
                this.postTypeCode = '';
            }
            
        },
        storeCode(val) {
            this.postParam.storeCode = val;
            this.empParam.storeCode = val;
        },
        
    }
}
</script>

<style>
.box-border-radio{
   border: 1px solid #c2cfd6;
}
.box-border-radio .form-control{
    display: inline-block!important;
    width: 33%!important;
}
.box-border-radio .custom-control-indicator{
   margin-top:6px;
}
</style>
