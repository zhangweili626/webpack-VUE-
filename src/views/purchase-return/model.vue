<template>
    <b-modal id="model" ref="myModalRef1" @ok="sumit" @show="showmodal" size="lg" ok-title="添加"  cancel-title="取消">
        <div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="商品编码" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.skuCode"></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="商品分类" :label-cols="4" class="text-right">
                        <sku-class-tree  @getSkuClass="getSaleGory" ref="skuSelect"></sku-class-tree>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="商品名称" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.skuName" ></b-form-input>                
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="商品69码" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.barCode" ></b-form-input>                
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="商品品牌" :label-cols="4" class="text-right">
                        <div class="text-left">
                            <search 
                            ref="brand"
                            :hasCheck="brandRequired"
                            :dataList="brandDatalist"  
                            option="brandName" 
                            @dataChange="brandQuerySelect"
                            @itemValue="brandItemValue"
                            @clickShowBack="brandFirstLoad"
                            @comScroll="brandComScroll"
                            :disabled="brandIsforbidden"
                            @clearValue="brandClearValue"
                            >
                            </search>
                        </div>             
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="primary" @click="querySkuInfo">查询</b-button>
                    </div>
                </div>
            </div>
            <div class="table-scrollable sku-model">
                <b-table striped hover bordered show-empty :items="tableList" :fields="fields">
                     <template slot="tool" slot-scope="data">
                        <input type="checkbox" name="radio"  v-model="SkuselCont" :value="data.item"/>                                
                    </template>
                    <template slot="skuCode" slot-scope="data">
                        {{data.item.skuCode}}
                    </template>
                    <template slot="originalCode" slot-scope="data">
                        {{data.item.originalCode}}
                    </template>
                    <template slot="skuName" slot-scope="data">
                        {{data.item.skuName}}
                    </template>
                    <template slot="brandName" slot-scope="data">
                        {{data.item.brandName}}
                    </template>
                    <template slot="skuModel" slot-scope="data">
                        {{data.item.skuModel}}
                    </template>
                    <template slot="skuStandards" slot-scope="data">
                        {{data.item.skuStandards}}
                    </template>
                    <template slot="barCode" slot-scope="data">
                        {{data.item.barCode}}
                    </template>
                    <template slot="empty">
                        暂无数据...                  
                    </template>
                </b-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                   <!-- <div class="pull-right">
                        <b-button v-if="tableList.length !== 0" size="sm" variant="default" @click='nextPage'> 下一页</b-button>                                                
                    </div> -->
                 <pagination class="pull-right" @page-change="skupageChange" :page-no="SkupageData.pageNum" :page-size="SkupageData.pageSize" :total-result="SkupageData.total" :total-pages="SkupageData.pages">
                 </pagination>
               </div>
            </div>
        </div>
    </b-modal>
</template>
<script>
import Vue from 'vue'
import api from "common/api";
import config from "common/config";   
import common from "common/common.js"
import collectionApi from 'common/api-collection.js'
import { DatePicker, Message, MessageBox, Input, Button} from "element-ui";
import pagination from "components/pagination/pagination.vue";
import search from "components/iris-search/search.vue";
import {PURCHASE_RETURN_ORDERINFO_SEQ, PURCHASE_RETURN_SKUDETAIL_SEQ} from 'common/sequence.js'
import {getSequence, getSequenceList} from 'common/api-common.js'
import skuClassTree from './skuClassTree'
Vue.use(Input)
Vue.use(Button)
export default {
    components: {
        search,
        pagination,
        skuClassTree,
    },
    props: {
        storeCode:{
            type: String,
            default: function(){
                return ""
            }
        },
        orderNo:{
            type: String,
            default: function(){
                return ""
            }
        },
    },
    data() {
        return {
            input23:"",
            brandRequired: false,     
            brandDatalist: [],    
            brandIsforbidden: false,                 
            params:{
                skuCodeOrName: '',
                skuTypeList: [],
                skuType:'goodsTypeGood',
                pageNums: 5,
            },
            tableList:[],
            fields:{
                tool:{
                    label: "操作"
                },
                skuCode:{
                    label: "商品编码"
                },
                originalCode:{
                    label: "原厂编码"
                },
                skuName:{
                    label: "商品名称"                        
                },
                brandName:{
                    label: "品牌"                                            
                },
                skuModel:{
                    label: "型号"                                            
                },
                skuStandards:{
                    label: "规格"                                            
                },
                barCode:{
                    label:'69码'
                }
            },
            selectParams: {
                pageNums: config.pageNums,
                pageStart: 1,
            }, 
            SkupageData:{},
            SkuselCont:[]
        }
    },
    methods: {
        getSaleGory(val){          
            this.params.skuTypeList = [val.categoryCode];
        },
        showmodal(){
            const _this = this
            _this.SkuselCont = []
            _this.tableList = []
            _this.SkupageData={}
            this.params.skuCode ='';
            this.params.skuTypeList =[];
            this.params.skuName = '';
            this.params.barCode ='';
            this.params.brandName = '';
            this.$refs.skuSelect.clear();
            
        },
        queryChange(){
            const _this = this
            _this.$router.push({
                name:"purchase-add"
            })
        },
        skupageChange(value){
            const _this = this;
            _this.params.pageStart = value
            _this.querySku();
        },
        //显示
        show(){
            const _this = this 
            _this.$refs.myModalRef1.show()       
        },
        // 定义向后台请求品牌的方法
        querySkuBrandInfoForPageByVo(params,callback) {
            api.skuInfo.querySkuBrandInfoForPageByVo(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },
        querySkuInfo(){
            const _this = this;
            _this.params.pageStart = 1
             _this.querySku();
        },
        querySku(){
                const _this = this;
                _this.tableList = []            
                api.skuData.getInfo(_this.params,(msg)=>{
                        if(msg.data.message == 'success'){
                            let data = msg.data.obj.list                       
                            for (let index = 0; index < data.length; index++) {
                                let element = data[index];
                                element.purchaseReturnOrderNo = _this.orderNo    
                                element.whList = [];                         
                                element.whName = '';                         
                                element.whCode = '';                         
                                element.returnNums = '0';                         
                                element.returnPrice = '0.00';                         
                                element.returnTotalMoney =' 0.00';      
                                delete  element.id;                 
                            }
                            _this.tableList = data;
                            _this.SkupageData = msg.data.obj
                        }
                    })
        },
        // 搜索框内值改变   触发搜索
        brandQuerySelect(data) {
            const _this = this;
            _this.selectParams.pageStart = 1;
            _this.selectParams.brandName = data;
            let params = _this.selectParams;
            _this.querySkuBrandInfoForPageByVo(params, function(res) {
                _this.brandDatalist = res.list
            });
        },
        // 选中某一项    
        brandItemValue(value) {
            const _this = this
            _this.params.brandCode = value.brandCode
        },
        // 第一次加载数据
        brandFirstLoad() {
            const _this = this
            if(_this.brandDatalist.length != 0 ){
                return 
            }
            let params = _this.selectParams
            this.selectParams.pageStart = 1
            _this.querySkuBrandInfoForPageByVo(params, function(res) {
                _this.brandDatalist = res.list
            })
        },
        // 滚动加载
        brandComScroll(isEnd) {
            if (isEnd) {
                this.selectParams.pageStart ++
                let params = this.selectParams;        
                this.querySkuBrandInfoForPageByVo(params, obj => {
                    if(obj.list){
                        this.brandDatalist = this.brandDatalist.concat(obj.list);
                    }
                });
            }
        },
        //品牌下拉框清除事件
        brandClearValue(){
            const _this  = this;
            _this.params.skuCode = ""                
            _this.params.originalCode = ""                
            _this.params.skuName = ""                
            _this.params.barCode = ""                
            _this.params.brandCode = ""                             
        },
        sumit(){
            let _this = this;
            if(_this.storeCode == '') {
                Message({
                    type: "warning",
                    message: "未选择门店，无法添加商品！"
                });
                return;
            };
            if(_this.SkuselCont.length !==0){
                 let seqParam = {
                    serviceCode: PURCHASE_RETURN_SKUDETAIL_SEQ,
                    getNums: _this.SkuselCont.length,
                }
                getSequenceList(seqParam, result => {
                     let setFun = async function() {
                        for(var i = 0, len = _this.SkuselCont.length; i < len; i++){				
                            let resl = await _this.getStockInfoByStoreSku(_this.SkuselCont[i].skuCode, i);
                        }
                        let arr = [];
                        let hintStr = '';
                        for(var i = 0, len = _this.SkuselCont.length; i < len; i++){	
                            _this.SkuselCont[i].purchaseReturnDetailCode = result[i];
                            if(_this.SkuselCont[i].whList.length != 0) {
                                arr.push(_this.SkuselCont[i]);
                            }else{
                                hintStr += _this.SkuselCont[i].skuName + ','
                            }
                        }
                        if(hintStr !== '') {
                            Message({
                                type: "warning",
                                message: hintStr.substr(0, hintStr.length - 1) + "无可用库存，无法添加！"
                            });
                        }
                        _this.$emit('receive',arr)
                    }
                    setFun();
                    
                    
                })
               
            }
        },
        // 获取sku对应的仓库、库存
        getStockInfoByStoreSku(val, index) {
            let  _this = this;
            const option = {
                'skuCode': val,			// SKU3002273
                'storeCode': this.storeCode,			 // this.storeCode STORE2000080
            }
            return new Promise((reslove,reject) => {
                api.purchaseReturn.queryStockInfoByStoreSku(option, (res) => {
                    if(res.data.code === 'success') {	
                        let data = res.data.obj;
                        let arr = []
                        data.forEach((item, index) => {
                            let valStr = {
                                whName: item.whName,
                                whCode: item.whCode,
                                warehouseAddress: item.warehouseAddress,
                                availableNums: item.availableNums,
                            }
                            let obj = {
                                value: JSON.stringify(valStr),
                                text: item.whName
                            }
                            arr.push(obj);
                        })		
                        _this.SkuselCont[index].whList = [...arr];				
                        reslove(arr)
                    };
                })
            })		
        },
    },
    created () {
        const _this = this;
    },
}
</script>
<style>
    .modal-dialog {
        margin: 80px auto !important;
    }
    .fatherControlSpecial>.purchaseManageTable {
        margin-top: 80px;
    }
    .fatherControlSpecial>.purchaseManageTable:first-child {
        margin-top: 0px;
    }
    .sku-model{
        max-height: 350px;
        overflow: auto; 
    }
</style>

