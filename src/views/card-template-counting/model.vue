<template>
    <b-modal id="model" ref="myModalRef" @ok="sumit" size="lg" ok-title="添加"  cancel-title="取消">
        <div class="row">
            <div class="col-md-6">
                <b-form-fieldset horizontal label="选择添加类型*" :label-cols="4" class="text-right">
                    <b-form-select v-model="addTypeValue" :options="addTypeList"></b-form-select>                
                </b-form-fieldset>
            </div>
        </div>
        <div v-if="addTypeValue == 0">
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="商品编码" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.skuCode"></b-form-input>
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
                        <!-- <b-form-input v-model="params.brandName"></b-form-input>    -->
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
                <div class="col-md-6">
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
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="primary" @click="querySku">查询</b-button>
                    </div>
                </div>
            </div>
            <div class="table-scrollable custom">
                <b-table striped hover bordered show-empty :items="tableList" :fields="fields">
                     <template slot="tool" slot-scope="data">
                        <input type="checkbox" name="radio"  v-model="SkuselCont" :value="data.item"/>                                
                    </template>
                    <template slot="skuCode" slot-scope="data">
                        {{data.item.skuCode}}
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
                    <!-- <template slot="detailNums" slot-scope="data">
                        <b-form-input :state="data.item.state" style="width:100px;" type="number" min="0" v-model="data.item.detailNums" ></b-form-input>                                    
                    </template> -->
                    <template slot="empty">
                        暂无数据...                  
                    </template>
                </b-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="skupageChange" :page-no="SkupageData.pageNum" :page-size="SkupageData.pageSize" :total-result="SkupageData.total" :total-pages="SkupageData.pages">
                 </pagination>
               </div>
            </div>
        </div>
        <div v-if="addTypeValue == 1">
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="服务分类" :label-cols="4" class="text-right">
                        <!-- <b-form-input v-model="paramsService.categoryName"></b-form-input> -->
                        <goryTree  @getGCode="getgroy" ref="orgSelect" :params="seviceGroy"></goryTree>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="服务目录" :label-cols="4" class="text-right">
                        <!-- <b-form-input v-model="paramsService.catlogName" ></b-form-input>     -->
                        <tree1  @getCode="getLog" ref="orgSelect" :params="seviceLog"></tree1>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="服务编码" :label-cols="4" class="text-right">
                        <b-form-input v-model="paramsService.serviceCode" ></b-form-input>                
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="服务名称" :label-cols="4" class="text-right">
                        <b-form-input v-model="paramsService.serviceName"></b-form-input>                
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="primary" @click="queryService">查询</b-button>
                    </div>
                </div>
            </div>
            <div class="table-scrollable custom">
                <b-table striped hover bordered show-empty :items="tableListService" :fields="fieldsService">
                    <template slot="tool" slot-scope="data">
                        <input type="checkbox" name="radio"  v-model="SerselCont" :value="data.item"/>                                
                    </template>
                    <template slot="serviceCode" slot-scope="data">
                        {{data.item.serviceCode}}
                    </template>
                    <template slot="serviceName" slot-scope="data">
                        {{data.item.serviceName}}
                    </template>
                    <template slot="categoryName" slot-scope="data">
                        {{data.item.categoryName}}
                    </template>
                    <template slot="catlogName" slot-scope="data">
                        {{data.item.catlogName}}
                    </template>
                    <!-- <template slot="detailNums" slot-scope="data">
                        <b-form-input :state="data.item.state" style="width:100px;" type="number" min="0" v-model="data.item.detailNums" ></b-form-input>                                    
                    </template> -->
                    <template slot="empty">
                        暂无数据...                  
                    </template>
                </b-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="serpageChange" :page-no="SerpageData.pageNum" :page-size="SerpageData.pageSize" :total-result="SerpageData.total" :total-pages="SerpageData.pages">
                 </pagination>
               </div>
            </div>
        </div>
    </b-modal>
</template>
<script>
import api from "common/api";
import config from "common/config";   
import {Message, MessageBox , Tree} from "element-ui";
import search from "components/iris-search/search.vue";
import Tree1 from "views/sku-comb/cateLogTree"
import GoryTree from "views/sku-comb/categoryTree"
import pagination from "components/pagination/pagination.vue";
export default {
    components: {
        search,
        Tree1,
        Tree,
        GoryTree,
        pagination
    },
    props: {
        cardTemplateCode: {
            type: String,
            required: true,
            default: ""
        },
        makeOrgCode:{
            type: String,
            required: true,
            default: ""
        },
        containerlist:{
            type: Array,
            default: function(){
                return []
            }
        },
    },
    data() {
        return {
            SkuselCont:[],
            SerselCont:[],
            SkupageData:{},
            SerpageData:{},
            brandIsforbidden: false,                 
            brandDatalist: [],
            brandRequired: false,            
            addTypeList:[
                {
                    text:"商品",
                    value:0
                },{
                    text:"服务",
                    value:1
                }
            ],
            addTypeValue:0,
            params:{
                skuType:'goodsTypeGood',
                pageNums: config.pageNums,
                categoryName:null
            },
            paramsService:{
                pageNums: config.pageNums,
                priceType:1,
            },
            tableList:[],
            tableListService:[],
            fields:{
                tool:{
                    label: "操作"
                },
                skuCode:{
                    label: "商品编码"
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
                // detailNums:{
                //     label:'数量'
                // }
            },
            fieldsService:{
                tool:{
                    label: "操作"
                },
                serviceCode:{
                    label: "服务编码"
                },
                serviceName:{
                    label: "服务名称"                        
                },
                categoryName:{
                    label: "服务分类"                                            
                },
                catlogName:{
                    label: "服务目录"                                            
                },
                // detailNums:{
                //     label:'数量'
                // }
            },
            selectParams: {
                pageNums: config.pageNums,
                pageStart: 1,
            }, 
            seviceLog:{
				orgName:''
            },
            seviceGroy:{
				orgName:''
            },
            classifyData:[],
            classifyProps:{
                children: 'children',
                label: 'categoryName'
            },
            classifyShowarea:false,               
        }
    },
    methods: {
        skupageChange(value){
            const _this = this;
            _this.params.pageStart = value
            _this.querySku()
        },
        serpageChange(value){
            const _this = this;
            _this.paramsService.pageStart = value
            _this.queryService()
        },
        //商品分类树节点被点击的时候
        classifyNodeClick(data){
            const _this = this;
            _this.params.categoryName = data.categoryName
            _this.params.categoryCode = data.categoryCode 
            _this.classifyShowarea = false                
        },
        //加载商品分类树
        classifyLoad(node, resolve){
            const _this = this;
            if(node.level == 0){
                api.checkPlan.getSkuCategoryInfoBycategoryCode({
                    categoryCode:"000001"
                }).then((msg)=>{
                    if(msg.data.message == 'success'){
                        resolve(msg.data.obj.skuCategorySubInfo || [])
                    }
                })
            }else{
                api.checkPlan.getSkuCategoryInfoBycategoryCode({
                    categoryCode:node.data.categoryCode
                }).then((msg)=>{
                    if(msg.data.message == 'success'){
                        resolve(msg.data.obj.skuCategorySubInfo || [])
                    }
                })
            }
        },
         //下拉框清除事件 
        clear(value){
            const _this = this
            _this.params.categoryName = null;
            _this.params.categoryCode = null
        },
        //点击商品分类input
        showClassify(){
            const _this = this;
            _this.classifyShowarea = !_this.classifyShowarea
        },
        getgroy(val) {
            this.paramsService.categoryCode = val.categoryCode || null
        },
        getLog(val) {
            this.paramsService.catlogCode = val.catlogCode || null
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
        //品牌下拉框清除事件
        brandClearValue(){
            const _this  = this;
            _this.params.brandCode = ""                
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
        // 选中某一项    
        brandItemValue(value) {
            const _this = this
            _this.params.brandCode = value.brandCode
        },
        show(){
            const _this = this 
            _this.$refs.myModalRef.show()       
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
        queryService(){
            const _this = this;
            _this.tableListService = []
            // if(_this.paramsService.categoryCode || _this.paramsService.catlogCode || _this.paramsService.serviceCode || _this.paramsService.serviceName){
                _this.paramsService.serviceCodeList = _this.containerlist            
                api.serviceitem.queryByPage(_this.paramsService,(msg)=>{
                    if(msg.data.message == 'success'){
                        let data = msg.data.obj.list
                        let list = []
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            list[index] = {
                                serviceCode:element.serviceCode,
                                serviceName:element.serviceName,
                                catlogName:element.catlogName,
                                categoryName:element.categoryName,
                                state:null,                            
                                detailNums:1
                            }
                        }
                        _this.tableListService = list
                        _this.SerpageData = msg.data.obj
                    }
                })    
            // }else{
            //     MessageBox.confirm(`请输入查询条件！`, '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //     }).catch(() => {
            //     });
            // }
        },
        querySku(){
                const _this = this;
                _this.tableList = []
                // if(_this.params.skuCode || _this.params.skuName || _this.params.barCode || _this.params.brandCode || _this.params.categoryCode){
                    _this.params.skuCodeSet = _this.containerlist
                    api.skuData.getInfo(_this.params,(msg)=>{
                        if(msg.data.message == 'success'){
                            let data = msg.data.obj.list
                            let list = []
                            for (let index = 0; index < data.length; index++) {
                                const element = data[index];
                                list[index] = {
                                    skuCode:element.skuCode,
                                    skuName:element.skuName,
                                    skuModel:element.skuModel,
                                    brandName:element.brandName,
                                    skuStandards:element.skuStandards,
                                    state:null,
                                    detailNums:1
                                }
                            }
                            _this.tableList = list
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
            //点击保存
            sumit(evt){
                const _this = this;
                let data = []
                if(_this.addTypeValue == 0){
                    for (let index = 0; index < _this.SkuselCont.length; index++) {
                        const element = _this.SkuselCont[index];
                        if(element.detailNums > 0){
                            if(Number.isInteger(parseFloat(element.detailNums))){
                                element.cardTemplateCode = _this.cardTemplateCode
                                element.detailType = 0
                                element.detailCode = element.skuCode   
                                element.detailName = element.skuName                                                     
                                element.createOrgCode = _this.makeOrgCode
                                data.push(element)
                            }else{
                                _this.$set(_this.SkuselCont[index],'state','invalid')
                            }
                        }
                    }
                }else{
                    for (let index = 0; index < _this.SerselCont.length; index++) {
                        const element = _this.SerselCont[index];
                        if(element.detailNums > 0){
                            if(Number.isInteger(parseFloat(element.detailNums))){
                                element.cardTemplateCode = _this.cardTemplateCode
                                element.detailType = 1
                                element.detailCode = element.serviceCode
                                element.detailName = element.serviceName
                                element.createOrgCode = _this.makeOrgCode
                                data.push(element)
                            }else{
                                _this.$set(_this.SerselCont[index],'state','invalid')                                
                            }                            
                        }
                    }
                }
                // if(data.length == 0){
                //     MessageBox.confirm('请填写需求数量！', '提示', {
                //         confirmButtonText: '确定',
                //         cancelButtonText: '取消',
                //         type: 'warning'
                //     }).then(() => {
                //     }).catch(() => {
                //     });
                //     evt.preventDefault()
                // }else{
                    api.ordinalInfo.getSequenceList({
                    'serviceCode': 'CARDTEMPLATEDETAILSEQ',
                    'getNums': data.length
                    },(msg) => {
                        if(msg.data.message == 'success'){
                            let SEQ = msg.data.obj
                            for (let index = 0; index < SEQ.length; index++) {
                                const element = SEQ[index];
                                data[index].cardTemplateDetailCode = element
                            }
                            api.carTemlate.editCardTemplateDetailInfo(data,(msg)=>{
                                if(msg.data.message == 'success'){
                                    Message({
                                        type: 'success',
                                        message: '保存成功！'
                                    });
                                    _this.tableList = []
                                    _this.tableListService = []
                                    _this.SkuselCont=[]
                                    _this.SerselCont=[]
                                    _this.$emit('query')
                                }                    
                            })
                        } 
                    })
                // }
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
    #model .card-template-counting .zwlTree{
        position: absolute;
        width: 90%;
        z-index: 1;
        height: 300px;
        overflow: auto;
    }
    .select-tree {
        position: absolute;
        margin-top: 6px;
        width: 100%;
        height: 250px;
        overflow: auto;
        z-index: 1000;
    }
    .anchor {
        font-size: 16px;
        margin-right:10px;
    }
    .sku-clear{
        position: absolute;
        top: 8px;
        right: 9px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        color: #fff;
        background-color: rgba(102, 175, 233, 0.6);
        text-align: center;
        line-height: 18px;
        cursor: pointer;
    }
    .sku-clear-parant{
        position: relative;
    }
</style>

