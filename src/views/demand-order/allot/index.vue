<template>
    <div class="animated fadeIn require-goods">
        <b-card header="查询">
             <div class="row">                       
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="处理类型类型*" :label-cols="4" class="text-right">
                        <b-form-select :value="0" :options="handleType"/> 
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="调入门店*" :label-cols="4" class="text-right">
                        <b-form-input :value="params.storeName" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="调入地址" :label-cols="4" class="text-right">
                        <b-form-select v-model="params.whCode" @change="whCodeChange" :options="entreList"/>                        
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="商品名称*" :label-cols="4" class="text-right">
                        <b-form-select :state="skuModelState" v-model="skuModel" @change="queryStockInfoVosBySku" :options="skuList"/>                        
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="调出门店*" :label-cols="4" class="text-right">
                        <areastore :currentStore="params.storeCode" :error="state.allotError" :storeAll="true"  ref="areastore"  @select-change="selectedChange"/>                       
                    </b-form-fieldset>
                </div>
            </div>
            <query-btn-group :showReset="false" @query="search"></query-btn-group>
        </b-card>
         <b-card>
            <div class="row">              
                <div class="col-md-6">
                    <b-button size="sm" variant="primary" @click="insertTransferOutOrderInfo">加入调拨单</b-button>
                    <b-button size="sm" variant="primary" @click="show">查询预览</b-button>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mt-2">
                    <b-badge variant="light">此商品要货需求总数：{{reqNums}}</b-badge>
                </div>
            </div>
            <div class="table-scrollable mb-2">
                    <el-table
                        :data="WarehouseSku"
                        border
                        style="width: 100%">
                        <el-table-column
                        fixed
                        prop="selCont"
                        label="选择"
                        :width="getColumnW('选择')">
                            <template slot-scope="scope">
                                <input type="radio" name="radio"  v-model="selCont" :value="scope.row"/>
                            </template>	
                        </el-table-column>
                        <el-table-column
                        fixed
                        prop="outStoreCode"
                        label="调出门店编码"
                        :width="getColumnW('调出门店编码')">
                        </el-table-column>
                        <el-table-column
                        fixed
                        prop="outStoreName"
                        label="调出门店名称"
                        :width="getColumnW('调出门店名称')">
                        </el-table-column>
                        <el-table-column
                        fixed
                        prop="outWarehouseAddress"
                        label="调出地址"
                        width="140">
                        </el-table-column>
                         <el-table-column
                        fixed
                        prop="skuCode"
                        label="SKU"
                        :width="getColumnW('SKU')">
                        </el-table-column>
                        <el-table-column
                        fixed
                        prop="skuName"
                        label="商品名称"
                        :width="getColumnW('商品名称')">
                        </el-table-column>
                        <el-table-column
                        fixed
                        prop="availableNums"
                        label="可用数量"
                        :width="getColumnW('可用数量')">
                        </el-table-column>
                        <el-table-column
                        fixed
                        prop="outNums"
                        label="调出数量"
                        :width="getColumnW('调出数量')">
                        </el-table-column>
                        <el-table-column
                        prop="checkUnitName"
                        label="单位"
                        :width="getColumnW('单位')">
                        </el-table-column>       
                        <el-table-column
                        fixed
                        prop="skuModel"
                        label="型号"
                        :width="getColumnW('型号')">
                        </el-table-column>
                        <el-table-column
                        prop="skuStandards"
                        label="规格"
                        :width="getColumnW('规格')">
                        </el-table-column>                                                              
                        <el-table-column
                        prop="originalCode"
                        label="原厂编码"
                        :width="getColumnW('原厂编码')">
                        </el-table-column>
                        <el-table-column
                        prop="barCode"
                        label="69码"
                        :width="getColumnW('69码')">
                        </el-table-column>
                        <el-table-column
                        prop="externalCode"
                        label="外部编码"
                        :width="getColumnW('外部编码')">
                        </el-table-column>
                    </el-table>
                </div>
                <div class="row"> 
                    <div class="col-md-12">
                        <pagination class="pull-right" 
                        @page-change="search" 
                        :page-no="demandPages.pageNum" 
                        :page-size="demandPages.pageSize" 
                        :total-pages="demandPages.pages" 
                        :total-result="demandPages.total">
                        </pagination>
                    </div>
                </div>
         </b-card>
         <model ref="myModalRef" @resetting='resetting' @delete-sku="deleteSku" @recover-sku="recoverSku"></model>
    </div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import Pagination from 'components/pagination/pagination'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import {Table, TableColumn, Message, Tag ,Select, Option } from "element-ui"
import areaqueryshop from "components/iris-areaqueryshop/";
import api from 'common/api'
import config from 'common/config'
import areastore from './areastore'
import model from './model'
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tag);
Vue.use(Select);
Vue.use(Option);
export default {
    components: {
       QueryBtnGroup,
       Pagination,
       areaqueryshop,
       areastore,
       model
    },
    data() {
        return {
            params:{
                whCode:null,
                storeCode:null,
            },
            state:{
                allotError:false             
            },
            WarehouseSku:[],
            reqNums:null,//当前sku需求数
            handleType:[
                {value:"0",text:"调拨处理"}
            ],//处理类型
            selCont:{},//多选数据
            demandPages:{},//分页数据
            acceptAllot:[],//接收到的调拨数据
            paginationData: {
                total: 0,
                totalPages: 1,
                pageNo: 1,
                pageSize: config.pageNums
            },//分页参赛
            skuList:[],//商品下拉框列表
            columW: config.demandOrder.columW,
            areaqueryshoperror:false,//区域门店校验
            skuModel:null,//sku下拉框双向绑定
            outStoreModel:[],//调出门店下拉列表双向绑定
            entreList:[],//调入仓库
            currentSku:{},//当前选中sku
            first:null,
            skuModelState:null,
            deleteSkuMemory:[]
        }
    },
    computed: {
        ...mapState('demandOrder',[
            'allot'
			]),
    },
    methods: {
        ...mapActions('demandOrder',[
			'setAllotData'
        ]),
        whCodeChange(value){
            const _this = this;
            for (let index = 0; index < _this.entreList.length; index++) {
                const element = _this.entreList[index];
                if(value == _this.entreList[index].value){
                     _this.$refs.myModalRef.Requisition({
                        inStoreName:_this.params.storeName,
                        inStoreCode:_this.params.storeCode,    
                        inWhName:_this.entreList[index].text,
                        inWhCode:_this.entreList[index].value,                        
                    })  
                }
            }
        },
        show(){
            const _this = this
            _this.$refs.myModalRef.showmodal()            
        },
        resetting(){
            const _this = this;
            _this.first = null
        },
        //恢复商品
        recoverSku(sku){
            const _this = this
            for (let index = 0; index < _this.deleteSkuMemory.length; index++) {
                const element = _this.deleteSkuMemory[index];
                if(sku.skuCode == element.value){
                    _this.$set(_this.skuList,_this.skuList.length,element)
                    return;
                }
            }
        },
        //删除商品
        deleteSku(value){
            const _this = this
            for (let index = 0; index < _this.skuList.length; index++) {
                const element = _this.skuList[index];
                if(value == element.value){
                    _this.deleteSkuMemory.push(_this.skuList[index])
                     _this.skuList.splice(index,1)
                     _this.reqNums = 0
                     _this.WarehouseSku = []
                     _this.$refs.areastore.empty()
                     _this.skuModel = ''
                     _this.selCont = {}
                     return;
                }
            }
        },
        //加入调拨
        insertTransferOutOrderInfo(){
            const _this = this;
            if(JSON.stringify(_this.selCont) == "{}"){
                Message({
                    type: 'warning',
                    message: '请选择数据！'
                });
            }else{
                if(_this.selCont.availableNums < _this.selCont.outNums){
                    Message({
                        type: 'warning',
                        message: '仓库可用数量不能小于调出数量'
                    });
                    return;
                }
                 _this.$refs.myModalRef.show()
                    for (let i = 0; i < _this.entreList.length; i++) {
                        const element = _this.entreList[i];
                        if(element.value == _this.params.whCode){
                            _this.params.warehouseAddress = element.text
                        }
                    }
                    _this.$refs.myModalRef.firstRequisition(_this.selCont, _this.params)
                // if(_this.first == null){
                //     _this.$refs.myModalRef.show()
                //     for (let i = 0; i < _this.entreList.length; i++) {
                //         const element = _this.entreList[i];
                //         if(element.value == _this.params.whCode){
                //             _this.params.warehouseAddress = element.text
                //         }
                //     }
                //     _this.$refs.myModalRef.firstRequisition(_this.selCont, _this.params)
                //     _this.first = 1
                // }else{
                //     _this.$refs.myModalRef.show()
                //     for (let i = 0; i < _this.entreList.length; i++) {
                //         const element = _this.entreList[i];
                //         if(element.value == _this.params.whCode){
                //             _this.params.warehouseAddress = element.text
                //         }
                //     }
                //     _this.$refs.myModalRef.Requisition(_this.selCont, _this.params)
                //     _this.first = 1
                // }
            }
        },
        //查询sku可用门店
        queryStockInfoVosBySku(value){
            const _this = this;
            _this.outStore = []//清空调出门店     
            for (let i = 0; i < _this.acceptAllot.length; i++) {
                if(_this.acceptAllot[i].skuCode == value){
                    _this.currentSku = _this.acceptAllot[i]
                    _this.reqNums = _this.currentSku.reqNums
                }
            }
            _this.$refs.areastore.skuCodeSet([value], _this.reqNums)
        },
        //区域选择门店
        selectedfun(data) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            options.storeCodeSet.push(data);
            _this.params.storeCode = data
            // 根据经销商店获取仓库
            api.getEntrepot(options, function(res) {
                if (res.data.code === "success") {
                const array = res.data.obj;
                for (var i = 0; i < array.length; i++) {
                    let obj = {};
                    array[i].text = array[i].warehouseAddress;
                    array[i].value = array[i].warehouseCode;               
                }
                _this.entreList = array;
                }
            });
        },
        //区域选择门店
        selectedChange(data, data1) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            if(data1 instanceof Array){
                _this.outStoreModel = data1
            }
        },
        //查询按钮
        search(pageNo){
            let _this = this;
            if(!_this.skuModel){
                _this.skuModelState = 'invalid'
                return;
            }
            _this.skuModelState = null            
            if(_this.params.storeCode == null){
                _this.areaqueryshoperror = true
            }else{
                _this.areaqueryshoperror = false
                if(_this.outStoreModel.length == 0){
                    _this.state.allotError = true                    
                    return;
                }
                // 根据经销商店获取仓库
                api.getEntrepot({
                    storeCodeSet: _this.outStoreModel
                }, function(res) {
                    if (res.data.code === "success") {
                    let array = res.data.obj;
                    let arr = []
                    for (let index = 0; index < array.length; index++) {
                        arr.push(array[index].warehouseCode)
                    }
                    //根据sku查询仓库可用数量
                    api.allotout.queryStockInfoVosByCodeAndSku({
                        whCodes:arr,
                        skuCode:_this.skuModel
                    },(msg)=>{
                        if (msg.data.code === "success") {
                            let list  = msg.data.obj
                            for (let i = 0; i < array.length; i++) {
                                const element = array[i];
                                _this.$set(_this.WarehouseSku, i ,{
                                    availableNums: (list[element.warehouseCode] && list[element.warehouseCode].availableNums) || 0 ,
                                    outStoreCode: element.storeCode,
                                    outStoreName: element.storeName,
                                    outWhCode: element.warehouseCode,
                                    outWhName: element.warehouseName,
                                    outWarehouseAddress:element.warehouseAddress,
                                    skuCode:_this.currentSku.skuCode,
                                    skuName:_this.currentSku.skuName,    
                                    outNums:_this.reqNums,
                                    skuModel:_this.currentSku.skuModel,
                                    skuStandards:_this.currentSku.skuStandards,
                                    originalCode:_this.currentSku.originalCode,
                                    barCode:_this.currentSku.barCode,
                                    externalCode:_this.currentSku.externalCode,
                                    checkUnitName:_this.currentSku.checkUnitName,
                                    detailIds:_this.currentSku.ids
                                })
                            }
                        }                        
                    }) 
                    }
                });
            }
        },
        getColumnW(headStr) {
           return (headStr.length) * this.columW +36;
        },
    },
    mounted(){
        const _this = this;
        _this.acceptAllot = JSON.parse(JSON.stringify(_this.allot))
        if(_this.allot == null){
            _this.$router.push({
                name:"require-goods"
            })
        }else{
            for (let i = 0; i < _this.acceptAllot.length; i++) {
                const element = _this.acceptAllot[i];
                _this.$set(_this.skuList, i, {
                    text:element.skuName,
                    value:element.skuCode
                })
            }
            _this.params.storeCode = _this.acceptAllot[0].storeCode
            _this.params.storeName = _this.acceptAllot[0].storeName
            _this.$refs.myModalRef.Requisition({
                inStoreName:_this.params.storeName,
                inStoreCode:_this.params.storeCode,    
            })
            _this.selectedfun(_this.acceptAllot[0].storeCode)
            _this.skuModel = _this.skuList[0].value
            _this.queryStockInfoVosBySku(_this.skuModel)
            _this.setAllotData(null)
        }
    }
}
</script>
<style>
@media (min-width: 992px){
    .require-goods .modal-lg {
    max-width: 1200px;
}
}
</style>
