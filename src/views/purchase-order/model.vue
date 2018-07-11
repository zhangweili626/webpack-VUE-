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
                    <b-form-fieldset horizontal label="原厂编码" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.originalCode"></b-form-input>
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
                <!-- <div class="col-md-6">
                    <b-form-fieldset horizontal label="分类" :label-cols="4" class="text-right">
                        <div @click="showClassify" class="sku-clear-parant">
                            <b-form-input v-model="params.categoryName" disabled/>
                            <div class="sku-clear" v-if="params.categoryName" @click.stop="clear('category')">x</div>                                                                
                        </div>
                        <div class="text-left select-tree" v-show="classifyShowarea">
                            <Tree :data="classifyData" :props="classifyProps" :load="classifyLoad" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="classifyNodeClick">
                            </Tree>
                        </div>
                        
                    </b-form-fieldset>
                </div> -->
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="primary" @click="querySkuInfo">查询</b-button>
                    </div>
                </div>
            </div>
            <!-- <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <el-input placeholder="请输入内容" @input="queryChange" v-model="input23" class="input-with-select">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                            <i slot="append" class="el-icon-search"></i>
                        </el-input>
                    </div>
                </div>
            </div> -->
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
// import common from "common/common.js"
import collectionApi from 'common/api-collection.js'
import { DatePicker, Message, MessageBox, Input, Button} from "element-ui";
import pagination from "components/pagination/pagination.vue";
import search from "components/iris-search/search.vue";
Vue.use(Input)
Vue.use(Button)
export default {
    components: {
        search,
        pagination
    },
    props: {
        containerlist:{
            type: Array,
            default: function(){
                return []
            }
        },
        supplierTypeCode:{
            type: String,
            default: function(){
                return ""
            }
        },
        storeCode:{
            type: String,
            default: function(){
                return ""
            }
        },
        supplierCode:{
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
                skuType:'goodsTypeGood',
                pageNums: config.pageNums,
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
        showmodal(){
            const _this = this
            _this.SkuselCont = []
            _this.tableList = []
            _this.SkupageData={}
            
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
            if(_this.supplierTypeCode == 'REFD2000181'){
                _this.querySku()
            }else if(_this.supplierTypeCode == 'REFD2000179'){
                _this.queryPurchaseSkuDetailBySupplierCode()
            }else if(_this.supplierTypeCode == 'REFD2000182'){
                _this.querySku()
            }
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
            if(_this.supplierTypeCode == 'REFD2000181'){
                _this.querySku()
            }else if(_this.supplierTypeCode == 'REFD2000179'){
                _this.queryPurchaseSkuDetailBySupplierCode()
            }else if(_this.supplierTypeCode == 'REFD2000182'){
                _this.querySku()
            }
        },
        queryPurchaseSkuDetailBySupplierCode(){
            const _this = this;
            let containerlist = []
            for (let index = 0; index < _this.containerlist.length; index++) {
                const element = _this.containerlist[index];
                containerlist.push(element.skuCode)
            }
            _this.params.skuCodes = containerlist
            _this.params.storeCode = _this.storeCode
            _this.params.supplierCode = _this.supplierCode
            api.purchaseOrder.queryPurchaseSkuDetailBySupplierCode(_this.params,(msg)=>{
                if(msg.data.message == 'success'){
                    let data = msg.data.obj.list
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        element.purchaseRate = element.taxRate
                        element.purchaseFee = element.skuPriceTax
                        element.id = ""
                        element.orderNo = _this.orderNo
                    }
                    _this.tableList = data
                    _this.SkupageData = msg.data.obj
                }                
            })
        },
        querySku(){
                const _this = this;
                let containerlist = []
                for (let index = 0; index < _this.containerlist.length; index++) {
                    const element = _this.containerlist[index];
                    containerlist.push(element.skuCode)
                }
                _this.params.skuCodeSet = containerlist
                _this.tableList = []            
                // if(_this.params.skuCode || _this.params.skuName || _this.params.barCode || _this.params.brandCode || _this.params.categoryCode){
                    api.skuData.getInfo(_this.params,(msg)=>{
                        if(msg.data.message == 'success'){
                            let data = msg.data.obj.list
                            // let list = []
                            // for (let index = 0; index < data.length; index++) {
                                // const element = data[index];
                                // list[index] = {
                                //     skuCode:element.skuCode,
                                //     skuName:element.skuName,
                                //     skuModel:element.skuModel,
                                //     brandName:element.brandName,
                                //     skuStandards:element.skuStandards,
                                //     state:null,
                                //     detailNums:1
                                // }
                            // }
                            for (let index = 0; index < data.length; index++) {
                                const element = data[index];
                                element.id = ""
                                element.orderNo = _this.orderNo                                
                            }
                            _this.tableList = data
                            _this.SkupageData = msg.data.obj
                        }
                    })
            //     }else{
            //     MessageBox.confirm(`请输入查询条件！`, '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //     }).catch(() => {
            //     });
            // }
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
            _this.params.brandCode = ""                
        },
        sumit(){
            const _this = this;
            if(_this.SkuselCont.length !==0){
                let skuCodes = []
                for (let index = 0; index < _this.SkuselCont.length; index++) {
                    const element = _this.SkuselCont[index];
                    skuCodes.push(element.skuCode)
                }
                api.purchaseOrder.queryContractBySkuAndStoreAndSupplier({supplierCode:_this.supplierCode,storeCode:_this.storeCode,skuCodes:skuCodes},(res)=>{
                    if (res.data.code === "success") {
                        let list = res.data.obj || []
                        for (let index = 0; index < list.length; index++) {
                            const element = list[index];
                            for (let inx = 0; inx < _this.SkuselCont.length; inx++) {
                                const element1 = _this.SkuselCont[inx];
                                if(element.skuCode==element1.skuCode){
                                    element1.unitprice = true//不可编辑
                                }
                            }
                        }
                        _this.$emit('receive',_this.SkuselCont)
                    }
                })
            }
        }
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

