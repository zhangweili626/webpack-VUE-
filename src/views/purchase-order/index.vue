<template>
    <div class="card">
        <b-card header="查询">
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="销售区域" :label-cols="4" class="text-right">
                        <AreaTree @select-change="selectedfun" ref="area" :storeAll='true'></AreaTree>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="仓库名称" :label-cols="4" class="text-right">
                        <b-form-select v-model="params.whCode" :options="entreList"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="供应商" :label-cols="4" class="text-right">
                        <b-form-select v-model="params.supplierCode" :options="supplierList"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="采购单" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.orderNo"></b-form-input>
                    </b-form-fieldset>
                </div>
                <!-- <div class="col-md-6">
                    <b-form-fieldset horizontal label="外部编码" :label-cols="4" class="text-right">
                        <b-form-select v-model="params.whCode" :options="entreList"></b-form-select>
                    </b-form-fieldset>
                </div> -->
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="承运商" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.commonCarrierName"></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="单据状态" :label-cols="4" class="text-right">
                        <b-form-select v-model="params.orderStatus" :options="orderStatus"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="采购类型" :label-cols="4" class="text-right">
                        <b-form-select v-model="params.purchaseTypeCode" :options="purchaseType"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="配送类型" :label-cols="4" class="text-right">
                        <b-form-select v-model="params.deliveryTypeCode" :options="DispatchingType"></b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
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
                        <b-button size="sm" variant="success" @click="addskuinfo">新增</b-button>
                        <b-button size="sm" variant="primary" @click="updataskuinfo">编辑</b-button>                    
                    </div>
                </div>
            </div>
            <div class="table-scrollable mb-2">
                <el-table
                    :data="tableList"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="selCont"
                    label="选择"
                    :width="getColumnW('选择', '')">
                        <template slot-scope="scope">
                            <input type="radio" name="radio"  v-model="selCont" :value="scope.row"/>                                
                        </template>	
                    </el-table-column>
                    <el-table-column
                    prop="orderNo"
                    label="采购单号"
                    :width="getColumnW('采购单号', '')">
                        <template slot-scope="scope">
                            <router-link :to="{
                                name:'purchase-detail',
                                query:{
                                    orderNo:scope.row.orderNo,
                                    disabled:true                            
                                }}">{{scope.row.orderNo}}
                                </router-link>
                        </template>	
                    </el-table-column>
                    <el-table-column
                    prop="orderStatus"
                    label="单据状态"
                    :width="getColumnW('单据状态', '')">
                        <template slot-scope="scope">
                            <span v-if="scope.row.orderStatus == 0">草稿</span>
                            <span v-if="scope.row.orderStatus == 1">正式</span>
                            <span v-if="scope.row.orderStatus == -1">作废</span>
                        </template>	
                    </el-table-column>
                    <el-table-column
                    prop="purchaseTypeName"
                    label="采购类型"
                    :width="getColumnW('采购类型', '')">
                    </el-table-column>
                    <el-table-column
                    prop="storeName"
                    label="门店"
                    fit
                    :width="getColumnW('门店', '')">
                    </el-table-column>
                    <el-table-column
                    prop="supplierName"
                    label="供应商"
                    :width="getColumnW('供应商', '')">
                    </el-table-column>
                    <el-table-column
                    prop="totalNums"
                    label="单据商品总数"
                    :width="getColumnW('单据商品总数', '')">
                    </el-table-column>
                    <el-table-column
                    prop="totalMoney"
                    label="采购金额（含税）"
                    :width="getColumnW('采购金额（含税）', '')">
                        <template slot-scope="scope">
                            {{scope.row.totalMoney.toFixed(2)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="commonCarrierName"
                    label="承运商"
                    :width="getColumnW('承运商', '')">
                    </el-table-column>
                    <el-table-column
                    prop="totalFreightFee"
                    label="运费"
                    :width="getColumnW('运费', '')">
                        <template slot-scope="scope">
                            {{scope.row.totalFreightFee.toFixed(2)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="deliveryTypeName"
                    label="配送类型"
                    :width="getColumnW('配送类型', '')">
                    </el-table-column>
                    <el-table-column
                    prop="whName"
                    label="仓库"
                    :width="getColumnW('仓库', '')">
                    </el-table-column>
                    <el-table-column
                    prop="contactName"
                    label="联系人"
                    :width="getColumnW('联系人', '')">
                    </el-table-column>
                    <el-table-column
                    prop="contactMobile"
                    label="联系人电话"
                    :width="getColumnW('联系人电话', '')">
                    </el-table-column>
                    <el-table-column
                    prop="createTimeStr"
                    label="单据创建日期"
                    :width="getColumnW('单据创建日期', '')">
                    </el-table-column>
                    <el-table-column
                    prop="deadLineTime"
                    label="订单截止日期"
                    :width="getColumnW('订单截止日期', '')">
                    </el-table-column>
                </el-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="pageChange" :page-no="pageData.pageNum" :page-size="pageData.pageSize" :total-result="pageData.total" :total-pages="pageData.pages">
                 </pagination>
               </div>
            </div>
        </b-card>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { Tree } from 'element-ui'
    import api from 'common/api'
    import config from 'common/config'
    import pagination from "components/pagination/pagination.vue";
    import AreaTree from 'components/iris-areaqueryshop/index'        
    import {Table, TableColumn, Input, Message, MessageBox , Tooltip} from "element-ui"
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Tooltip)
    export default {
        components: {
            Tree,
            pagination,
            AreaTree
        },
        data() {
            return {
                selCont:null,
                entreList:[],
                supplierList:[],  
                purchaseType:[],
                DispatchingType:[],  
                orderStatus:[{text:'',value:''},{text:'草稿',value:0},{text:'正式',value:1},{text:'作废',value:-1}],
                params:{
                    pageNums:config.pageNums,
                    pageStart:1,
                    orderType:1
                },
                tableList:[],
                pageData:{},
                columW: config.demandOrder.columW,
            }
        },
        methods:{
            //区域选择门店
            selectedfun(data, data1) {
                const _this = this;
                const options = {
                    storeCodeSet: []
                };
                if(data1 instanceof Array){
                    _this.params.storeCodeSet = []
                    for (let i = 0; i < data1.length; i++) {
                        _this.$set(_this.params.storeCodeSet, i, data1[i].value)              
                    }
                }else{
                    options.storeCodeSet.push(data1.value);
                    _this.params.storeCodeSet = [data1.value]
                    api.purchaseOrder.querySupplierInfoNoPageBySupplierInfo({
                        pageStart: 1,
                        storeCodes:[data1.value]}, (res) => {
                        if (res.data.code === "success") {
                            let obj = res.data.obj;
                            for (let index = 0; index < obj.length; index++) {
                                obj[index].text = obj[index].supplierName
                                obj[index].value = obj[index].supplierCode
                            }
                            _this.supplierList = obj
                        }
                    })
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
            updataskuinfo(){
                const _this = this;
                if(_this.selCont == null){
                      Message({ 
                        type: 'warning', 
                        message: '请选择一条商品!'
                    });
                }else{
                    if(_this.selCont.orderStatus == -1){
                       Message({ 
                            type: 'warning', 
                            message: '该单据已作废无法编辑!'
                        }); 
                    }else{
                        _this.$router.push({
                            name:"purchase-edit",
                            query:{
                                orderNo:_this.selCont.orderNo,
                                disabled:false
                            }
                        })
                    }
                    
                }
            },
            addskuinfo(){
                const _this = this;
                _this.$router.push({
                    name:"purchase-add"
                })
            },
            query(){
                const _this = this;
                _this.params.pageStart = 1
                _this.queryPurchaseOrderInfo()
            },
            queryPurchaseOrderInfo(){
                const _this = this;
                api.purchaseOrder.queryPurchaseOrderInfo(_this.params,(res)=>{
                    if (res.data.code === "success") {
                        _this.pageData = res.data.obj
                        _this.tableList = res.data.obj.list
                    }                    
                })
            },
            pageChange(value){
                const _this = this;
                _this.params.pageStart = value
                _this.queryPurchaseOrderInfo()
            },
            reset(){
                const _this = this;
                _this.params = {
                    pageNums:config.pageNums,
                    pageStart:1,
                    orderType:1,                    
                }
            },
            getColumnW(headStr) {
              return (headStr.length) * this.columW +36;
            },
            //查询数据字典
            getDataDictionarys(code,cb = ()=>{}){
                const _this = this;
                api.ref.getDataDictionarys({
                    refCode: code
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        let data  = msg.data.obj.referenceDetailInfos
                        let list = [{text:'',value:''}]
                        for (let i = 0; i < data.length; i++) {        
                            list[i+1] = {
                                text:data[i].refDetailName,
                                value:data[i].refDetailCode
                            }
                        }
                        cb(list)
                    }
                })
            },
        },
        created () {
            const _this = this;
            _this.getDataDictionarys('PurchaseOrder',(msg)=>{
                _this.purchaseType = msg
            })
            _this.getDataDictionarys('DispatchingType',(msg)=>{
                _this.DispatchingType = msg
            })
        }
    }
</script>
<style>

</style>

