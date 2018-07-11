<template>
    <div class="daily">
        <b-card header="计划信息">
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="补货单号*" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.replenishmentPlanNo" readonly></b-form-input>                        
                    </b-form-fieldset> 
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="补货周期*" :label-cols="4" class="text-right">
                        <b-form-input :readonly="tableListShow" :state="state.replenishmentPlanPeriod" v-model="params.replenishmentPlanPeriod" type="number" min="0" max='500'></b-form-input>                        
                    </b-form-fieldset> 
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset label="选择经销商店" :label-cols="4" horizontal class="text-right">
                        <areaqueryshop :readonly="tableListShow" ref="areaqueryshop"  @select-change="selectedfun"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="仓库名称" :label-cols="4" class="text-right">
                        <b-form-select :disabled="tableListShow" :state="state.whCode" v-model="params.whCode" @change="entreListChange" :options="entreList"></b-form-select>
                    </b-form-fieldset> 
                </div>
            </div>
            <div class="row" v-if="!disabled">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="edit()">修改</b-button>                        
                        <b-button size="sm" variant="primary" @click="addHeadDailyfill" :disabled="tableListShow">确认</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <div v-if="tableListShow">
        <b-card header="查询" >
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="品牌" :label-cols="4" class="text-right">
                        <div class="text-left">
                        <search 
                        ref="brandsearch"
                        :hasCheck="false"
                        :dataList="brandDatalist"  
                        option="brandName" 
                        @dataChange="brandQuerySelect"
                        @itemValue="brandItemValue"
                        @clickShowBack="brandFirstLoad"
                        @comScroll="brandComScroll"
                        :disabled="false"
                        @clearValue="brandClearValue"
                        >
                        </search>
                    </div>
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="规格" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParams.skuStandards"></b-form-input>                        
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset label="SKU编码" :label-cols="4" horizontal class="text-right">
                        <b-form-input v-model="queryParams.skuCode"></b-form-input>                                                
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="SKU名称" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParams.skuName"></b-form-input>                                                                        
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset label="69码" :label-cols="4" horizontal class="text-right">
                        <b-form-input v-model="queryParams.barCode"></b-form-input>                                                
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="原厂编码" :label-cols="4" class="text-right">
                        <b-form-input v-model="queryParams.originalCode"></b-form-input>                                                                        
                    </b-form-fieldset> 
                </div>
            </div>
            <div class="row" v-if="!disabled">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset()">重置</b-button>                        
                        <b-button size="sm" variant="primary" @click="querySkuInfo">查询</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card header="明细列表">
            <div class="row" v-if="!disabled">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="danger" @click="deletedailyfill()">删除</b-button>                        
                        <v-upload buttonName='批量导入' :show-back="showBackData"
							  :add-params="detailUploadParams" :url='analysisUrl' v-on:updateData="getdetail"></v-upload>                        
                    </div>
                </div>
            </div>
            <div class="table-scrollable mt-2 mb-2">            
            <el-table v-loading="Loading"
					:data="tableList"
					border
					stripe>
                <el-table-column
                    fixed
                    prop="index"
                    label="选择"
                    width="100">
                    <template slot-scope="scope">
                        <input type="radio" name="radio" @click="tableIndex(scope.$index)">
                    </template>
                </el-table-column>
                <el-table-column
                    fixed
                    prop="skuCode"
                    label="商品编码"
                    width="200">
                </el-table-column>
                <el-table-column
                    fixed
                    prop="skuName"
                    label="商品名称"
                    width="200"
                    :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                    fixed
                    prop="standandStockNum"
                    label="最大库存"
                    width="200">
                    <template slot-scope="scope">
                      <input type="text" :state="scope.row.standandStockNumState" v-model="scope.row.standandStockNum">
                    </template>                    
                </el-table-column>
                <el-table-column
                    prop="brandName"
                    label="品牌">
                </el-table-column>
                <el-table-column
                    prop="skuStandards"
                    label="规格">
                </el-table-column>
                <el-table-column
                    prop="originalCode"
                    label="原厂编码">
                </el-table-column>
                <el-table-column
                    prop="barCode"
                    label="69码">
                </el-table-column>
            </el-table>
            </div>
            <div class="row" v-if="!disabled">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="startblockup()">{{params.replenishmentPlanStatus == 0 ? '停用' : '启用'}}</b-button>                        
                        <b-button size="sm" variant="danger" @click="close">取消</b-button>
                        <b-button size="sm" variant="success" @click="submit()">保存</b-button>                    
                    </div>
                </div>
            </div>
        </b-card>
        </div>
        <div class="sku-info-cover" v-if="disabled">
        </div>        
    </div>
</template>
<script>
    import api from 'common/api'
    import config from 'common/config'
    import common from 'common/common'  
    import areaqueryshop from "components/iris-areaqueryshop/";  
    import search from "components/iris-search/search.vue";
    import {Message, Table, TableColumn} from "element-ui";    
    import vUpload from "components/blitem-upload"  
	import Vue from "vue"    
    Vue.use(Table);      
	Vue.use(TableColumn);          
    export default {
        components: {
            areaqueryshop,
            search,
            vUpload
        },
        data() {
            return {
                Loading:false,
                showBackData: {
                    replenishmentPlanNo:null
                },
                detailUploadParams: {
					relationCode: '',
					singleFlag: '1',
					businessType: ''
                },
                analysisUrl:'/v2/fileSys/file/replenishmentPlanDetailInfoExcelFile.htm',
                params:{
                    storeCode:"",
                    replenishmentPlanPeriod:null,
                    replenishmentPlanNo:null,
                    whCode:null,
                    replenishmentPlanStatus:0
                },    
                queryParams:{
                    brandCode:null,
                    skuStandards:null,
                    skuType:'goodsTypeGood'                                                
                },
                brandDatalist: [],                  
                state:{
                    whCode:null,
                    replenishmentPlanPeriod:null
                },
                brandSelectParams: {
                    pageNums: config.pageNums,
                    pageStart: 1,
                }, 
                entreList:[],//仓库列表 
                tableList:[],//tab列表数据  
                tableListShow:false,//显示列表   
                index:null,//下标                          
            }
        },
        methods: {
            reset(){
                const _this = this;
                _this.queryParams = {
                    brandCode:null,
                    skuStandards:null,
                    skuCode:null,
                    skuName:null,
                    barCode:null,
                    originalCode:null,
                    skuType:'goodsTypeGood'                                                
                }
            _this.$refs.brandsearch.setValue()                              
            },
            //修改
            edit(){
                const _this = this;
                _this.tableListShow = false;
            },
            entreListChange(value){
                const _this = this;
                for (let i = 0; i < _this.entreList.length; i++) {
                    const element = _this.entreList[i];
                    if(element.value == value){
                        _this.params.whName = element.text
                    }
                }
            },
            //判断是否重复
            isrepeat(arr = [],arr2 = []){
                let listCode  = arr.map(v=>{return v.skuCode})
                let tableListCode = arr2.map(v=>{return v.skuCode})
                if(arr.length + arr2.length !== new Set([...listCode,...tableListCode]).size){
                    return true
                }
                return false
            },
            //解析成功
            getdetail(data){
                const _this = this;
                api.dailyfill.getReplenishmentPlanDetailInfoByCode(_this.params,(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.tableList = msg.data.obj
                        _this.index = null
                    }
                })
            },
            //删除数据
            deletedailyfill(){
                const _this = this;
                if(_this.index == null){
                    Message({
                        type: 'warning',
                        message: "请选择数据！"
                    });
                }else{
                    if(_this.tableList[_this.index].id){
                        _this.tableList[_this.index].isDeleted = 1;
                        api.dailyfill.editReplenishmentPlanDetailInfo([_this.tableList[_this.index]],(res)=>{
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'success',
                                    message: "删除成功！"
                                });
                                _this.tableList.splice(_this.index,1)                                
                            }                          
                        })
                    }else{
                        _this.tableList.splice(_this.index,1)
                        Message({
                            type: 'success',
                            message: "删除成功！"
                        });
                    }
                }
            },
            //记录下标 
            tableIndex(value){
                const _this = this;
                _this.index = value
            },
            //选择门店仓库
            selectedfun(data, data1) {
                const _this = this;
                const options = {
                    storeCodeSet: []
                };
                if(data1 instanceof Array){
                    
                }else{
                    options.storeCodeSet.push(data1.value);
                    _this.$set(_this.params, 'storeCode' , data1.value)   
                    _this.$set(_this.params, 'storeName' , data1.text)                                                                                     
                    _this.params.storeCodes = [data1.value]
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
            //点击保存
            submit(){
                const _this = this
                if(_this.isrepeat(_this.tableList)){
                     Message({
                        type: 'error',
                        message: "商品中有重复商品无法保存！"
                    });
                    return;
                }
                let array = []
                let array1 = []                
                for (let i = 0; i < _this.tableList.length; i++) {
                    const element = _this.tableList[i];
                    if(!element.id){
                        array.push(element)
                    }else{
                        array1.push(element)
                    }
                }
                if(array.length !== 0){
                    api.ordinalInfo.getSequenceList({
                    'serviceCode': config.dailyfill.dailyfillDetailSEQ,
                    'getNums': array.length
                },(res) => {
                    if(res.data.code === 'success') {
                        let arr = res.data.obj
                        let data = []
                        for (let i = 0; i < arr.length; i++) {
                            const element = arr[i];
                            data[i] = {
                                skuCode:array[i].skuCode,
                                replenishmentPlanNo:_this.params.replenishmentPlanNo,
                                replenishmentPlanDetailCode:element,
                                standandStockNum:array[i].standandStockNum
                            }
                            if(!data[i].standandStockNum){
                                data[i].standandStockNumState = 'invalid'
                                Message({
                                    type: 'error',
                                    message: "请填写最大库存数量！"
                                });
                                return
                            }else if(data[i].standandStockNum <= 0){
                                data[i].standandStockNumState = 'invalid'                                
                                Message({
                                    type: 'error',
                                    message: "最大库存数量不能小于0！"
                                });
                                return;
                            }
                        }
                         api.dailyfill.editReplenishmentPlanDetailInfo(data,(res)=>{
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'success',
                                    message: "保存成功！"
                                });
                                _this.$router.push({
                                    name:'dailyfill-query' 
                                })
                            }                            
                        }) 
                    };
                })
                }
                if(array1.length !== 0){
                    for (let i = 0; i < array1.length; i++) {
                        const element = array1[i];
                        if(!array1[i].standandStockNum){
                                data[i].standandStockNumState = 'invalid'
                                Message({
                                    type: 'error',
                                    message: "请填写最大库存数量！"
                                });
                                return
                        }else if(array1[i].standandStockNum <= 0){
                            array1[i].standandStockNumState = 'invalid'                                
                            Message({
                                type: 'error',
                                message: "最大库存数量不能小于0！"
                            });
                            return;
                        }
                    }
                    api.dailyfill.editReplenishmentPlanDetailInfo(array1,(res)=>{
                        if(res.data.code === 'success') {
                            Message({
                                type: 'success',
                                message: "保存成功！"
                            });
                            _this.$router.push({
                                name:'dailyfill-query' 
                            })
                        }                            
                    })
                }
            },
            //查询商品
            querySkuInfo(){
                const _this = this;
                let skuCodeSet = []
                for (let index = 0; index < _this.tableList.length; index++) {
                    const element = _this.tableList[index];
                    skuCodeSet.push(element.skuCode)
                }
                _this.queryParams.skuCodeSet = skuCodeSet
                api.dailyfill.dailyfillQuerySku(_this.queryParams,(msg)=>{
                    if(msg.data.message == 'success'){
                        let data = msg.data.obj
                        let list = []
                        for (let i = 0; i < data.length; i++) {
                            const element = data[i];
                            list[i] = {
                                skuCode:data[i].skuCode,
                                skuName:data[i].skuName,
                                brandCode:data[i].brandCode,
                                brandName:data[i].brandName,
                                skuStandards:data[i].skuStandards,
                                skuModel:data[i].skuModel,
                                originalCode:data[i].originalCode,
                                barCode:data[i].barCode,
                                standandStockNum:null,
                                skuName:data[i].skuName,
                                skuName:data[i].skuName,
                            }
                        }
            　　         if(_this.isrepeat(list,_this.tableList)){
                            Message({
                                type: 'error',
                                message: "商品中有重复商品！"
                            });
                            return;
                        }
                        _this.tableList = _this.tableList.concat(list)
                    }
                })
            },
            // 搜索框内值改变   触发搜索
            brandQuerySelect(data) {
                const _this = this;
                _this.brandSelectParams.pageStart = 1;
                _this.brandSelectParams.brandName = data;
                let params = _this.brandSelectParams;
                _this.querySkuBrandInfoForPageByVo(params, function(res) {
                    _this.brandDatalist = res.list
                });
            },
            // 选中某一项    
            brandItemValue(value) {
                const _this = this
                _this.queryParams.brandCode = value.brandCode
            },
            // 第一次加载数据
            brandFirstLoad() {
                const _this = this
                if(_this.brandDatalist.length != 0 ){
                    return 
                }
                let params = _this.brandSelectParams
                _this.querySkuBrandInfoForPageByVo(params, function(res) {
                    _this.brandDatalist = res.list
                })
            },
            // 滚动加载
            brandComScroll(isEnd) {
                if (isEnd) {
                    this.brandSelectParams.pageStart ++
                    let params = this.brandSelectParams;        
                    this.querySkuBrandInfoForPageByVo(params, obj => {
                        if(obj.list){
                            this.brandDatalist = this.brandDatalist.concat(obj.list);
                        }
                    });
                }
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
                _this.queryParams.brandCode = null
            },
            //新增日常补货主表
            addHeadDailyfill(){
                const _this = this;
                if((_this.params.replenishmentPlanPeriod == null) ||(_this.params.whCode == null)){
                    if(_this.params.replenishmentPlanPeriod == null){
                        _this.state.replenishmentPlanPeriod = 'invalid'
                    }
                    if(_this.params.whCode == null){
                        _this.state.whCode = 'invalid'                    
                    }
                    return;
                }
                if(_this.params.replenishmentPlanPeriod <= 0 || _this.params.replenishmentPlanPeriod > 500){
                    _this.state.replenishmentPlanPeriod = 'invalid'
                    return;                    
                }
                api.dailyfill.updateReplenishmentPlanInfo(_this.params,(msg)=>{
                if(msg.data.message == 'success'){
                    _this.showBackData = _this.params                    
                    _this.tableListShow=true//显示列表    
                    _this.state = {
                        whCode:null,
                        replenishmentPlanPeriod:null
                    }  
                }
                })
            },
            //取消新增
            close(){
                const _this = this;
                _this.$router.push({
                    name:'dailyfill-query' 
                })
            },
            startblockup(){
                const _this = this;
                if(_this.params.replenishmentPlanStatus == 0){
                    _this.params.replenishmentPlanStatus = 1
                    api.dailyfill.updateReplenishmentPlanInfo(_this.params,(msg)=>{
                        if(msg.data.message == 'success'){
                            Message({
                                type: 'success',
                                message: "停用成功！"
                            });
                        }else{
                            _this.params.replenishmentPlanStatus = 0                        
                        }
                    })
                }else{
                    _this.params.replenishmentPlanStatus = 0
                    api.dailyfill.updateReplenishmentPlanInfo(_this.params,(msg)=>{
                        if(msg.data.message == 'success'){
                            Message({
                                type: 'success',
                                message: "启用成功！"
                            });
                        }else{
                            _this.params.replenishmentPlanStatus = 1                                               
                        }
                    })
                }
            }
        },
    created () {
        const _this = this;
        api.dailyfill.getReplenishmentPlanInfoByCode({
            replenishmentPlanNo:_this.$route.query.replenishmentPlanNo
        },(msg)=>{
            if(msg.data.message == 'success'){
                let data = msg.data.obj
                let dataDetail = msg.data.obj.replenishmentPlanDetailInfoVoList
                let list = []
                _this.params = { 
                    id:data.id,
                    storeCode:data.storeCode,
                    replenishmentPlanPeriod:data.replenishmentPlanPeriod,
                    replenishmentPlanNo:data.replenishmentPlanNo,
                    whCode:data.whCode,
                    replenishmentPlanStatus:data.replenishmentPlanStatus
                }
                _this.showBackData = _this.params
                _this.entreList = [{text:data.whName,value:data.whCode}]
                _this.$refs.areaqueryshop.setselect({
                    text:data.storeName,
                    value:data.storeCode
                })
                _this.tableListShow = true;
                
                for (let i = 0; i < dataDetail.length; i++) {
                    list[i] = {
                        id:dataDetail[i].id,
                        replenishmentPlanDetailCode:dataDetail[i].replenishmentPlanDetailCode,
                        replenishmentPlanNo:dataDetail[i].replenishmentPlanNo,
                        skuCode:dataDetail[i].skuCode,
                        skuName:dataDetail[i].skuName,
                        brandCode:dataDetail[i].brandCode,
                        brandName:dataDetail[i].brandName,
                        skuStandards:dataDetail[i].skuStandards,
                        skuModel:dataDetail[i].skuModel,
                        originalCode:dataDetail[i].originalCode,
                        barCode:dataDetail[i].externalCode,
                        standandStockNum:dataDetail[i].standandStockNum,
                        skuName:dataDetail[i].skuName,
                    }
                }
                _this.tableList = _this.tableList.concat(list)                
            }            
        })
    },
    computed: {
        disabled:function(){
            const _this = this;
            if(Object.prototype.toString.call(_this.$route.query.disabled ) === "[object String]"){
                return _this.$route.query.disabled == 'true' ? true : false                    
            }else{
                return _this.$route.query.disabled                  
            }
        }
    },
    }
</script>
<style>
   .sku-info-cover{
        position: absolute;
        top: 0;        
        width: 100%;
        height: 100%;
    }
    .daily{
        position: relative;
    }
</style>

