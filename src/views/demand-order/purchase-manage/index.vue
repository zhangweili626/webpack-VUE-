<template>
    <div class="animated fadeIn require-goods">
         <b-card>
            <div class="row">              
                <div class="col-md-6">
                    <b-button size="sm" variant="primary" @click="addPurchase">加入采购单</b-button>
                    <b-button size="sm" variant="primary" @click="preview">查询预览</b-button>
                </div>
            </div>
            <div class="table-scrollable mb-2">
                    <el-table
                        :data="acceptPurchase"
                        border
                        style="width: 100%">
                        <el-table-column
                        prop="selCont"
                        label="选择"
                        :width="getColumnW('商品编码', '')">
                            <template slot-scope="scope">
                                <input type="checkbox" v-show="scope.row.disabled" :checked="scope.row.disabled" @click="checkboxChange(scope.row)"/>                                
                                <input type="checkbox" v-show="!scope.row.disabled" v-model="selCont" :value="scope.row"/>
                            </template>	
                        </el-table-column>
                        <el-table-column
                        prop="skuCode"
                        label="商品编码"
                        :width="getColumnW('商品编码')">
                        </el-table-column>
                        <el-table-column
                        prop="skuName"
                        label="零件名称"
                        :width="getColumnW('零件名称')">
                        </el-table-column>
                        <el-table-column
                        prop="brandName"
                        label="品牌"
                        width="140">
                        </el-table-column>
                        <el-table-column
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
                        prop="supplierName"
                        label="供应商"
                        :width="getColumnW('供应商')">
                        </el-table-column>
                        <el-table-column
                        prop="storeName"
                        label="来源门店"
                        :width="getColumnW('来源门店')">
                        </el-table-column>
                        <el-table-column
                        prop="totalUnitNum"
                        label="采购数"
                        :width="getColumnW('采购数      ')">
                        <template slot-scope="scope">
                                <input type="number" v-model="scope.row.totalUnitNum" @change="totalUnitNumChange(scope.row,scope.$index)"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="purchaseUnitName"
                        label="采购单位"
                        :width="getColumnW('采购单位')">
                        </el-table-column>
                        <el-table-column
                        prop="purchaseToCheckNums"
                        label="转换系数"
                        :width="getColumnW('转换系数')">
                        </el-table-column>
                        <el-table-column
                        label="核算单位"
                        prop="checkUnitName"                        
                        :width="getColumnW('核算单位')">
                        </el-table-column>
                        <el-table-column
                        prop="reqNums"
                        label="要货数量"
                        :width="getColumnW('要货数量')">
                        </el-table-column>
                        <el-table-column
                        prop="totalNums"
                        label="采购总数"
                        :width="getColumnW('采购总数')">
                        </el-table-column>
                        <el-table-column
                        prop="purchaseFee"
                        label="采购单价"
                        :width="getColumnW('采购单价')">
                            <template slot-scope="scope">
                                {{scope.row.purchaseFee && scope.row.purchaseFee.toFixed(2)}}
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="totalMoneyTax"
                        label="金额(含税)"
                        :width="getColumnW('金额(含税)')">
                            <template slot-scope="scope">
                                {{scope.row.totalMoneyTax && scope.row.totalMoneyTax.toFixed(2)}}
                            </template>
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
                        :page-no="paginationData.pageNum" 
                        :page-size="paginationData.pageSize" 
                        :total-pages="paginationData.pages" 
                        :total-result="paginationData.total">
                        </pagination>
                    </div>
                </div>
         </b-card>
         <model ref="myModalRef"></model>
    </div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import Pagination from 'components/pagination/pagination'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import {Table, TableColumn, Message ,MessageBox } from "element-ui"
import api from 'common/api'
import config from 'common/config'
import model from './model.vue'
import index from 'vue';
Vue.use(Table);
Vue.use(TableColumn);
export default {
    components: {
       QueryBtnGroup,
       Pagination,
       model
    },
    data() {
        return {
            skuList:[],
            selCont:[],
            paginationData: {
                total: 0,
                totalPages: 1,
                pageNo: 1,
                pageSize: config.pageNums
            },
            columW: config.demandOrder.columW,
            acceptPurchase:[],//接收到的采购数据
            optionalSupplier:[],//可选供应商
            checklist:[],
            acceptPurchaseMap:[]
        }
    },
    computed: {
        ...mapState('demandOrder',[
            'purchase'
			]),
    },
    methods: {
        ...mapActions('demandOrder',[
            'setPurchaseData'
        ]),
        //  采购数改变
        totalUnitNumChange(value,index){
            const _this = this
            console.log(!Number.isInteger(parseInt(value.totalUnitNum)))
            if(!Number.isInteger(parseFloat(value.totalUnitNum)) || parseInt(value.totalUnitNum) <= 0){
                Message({
                    type: 'error',
                    message: '请填写正确的采购数！'
                });
            }else{
                _this.$set(value,'purchaseFee',value.purchaseFee == null ? 0 : value.purchaseFee)
                _this.$set(value,'totalNums',(parseInt(value.totalUnitNum) * parseInt(value.purchaseToCheckNums)))            
                _this.$set(value,'totalMoneyTax',(parseInt(value.totalNums) * parseInt(value.purchaseFee)))            
            }
        },
        //预览
        preview() {
            const _this = this;
            _this.$refs.myModalRef.showmodal()            
        },
        search(pageNo){
            let _this = this;
            pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
            let param = {

            }
        },
        getColumnW(headStr) {
           return (headStr.length) * this.columW + 36;
        },
        //多选框状态改变
        checkboxChange(value){
            const _this = this;
            if(value.disabled){
                value.disabled = false
                _this.acceptPurchase = JSON.parse(JSON.stringify(_this.acceptPurchase))                 
                _this.$refs.myModalRef.deleteDetail(value)                        
            }
        },
        //加入采购管理
        addPurchase(){
            const _this = this
            if(_this.selCont.length !== 0){
                let arr = []  
                let acceptPurchaseMap = {}
                for (let i = 0; i < _this.selCont.length; i++) {
                    if(parseInt(_this.selCont[i].totalUnitNum) <= 0 || !Number.isInteger(parseFloat(_this.selCont[i].totalUnitNum))){
                        Message({
                            type: 'error',
                            message: '请填写正确的采购数！'
                        });
                        return 
                    }
                    if(acceptPurchaseMap[_this.selCont[i].storeCode]){
                        acceptPurchaseMap[_this.selCont[i].storeCode].skuMap[_this.selCont[i].skuCode] = _this.selCont[i]
                    }else{
                        acceptPurchaseMap[_this.selCont[i].storeCode] = {
                            storeCode:_this.selCont[i].storeCode,
                            storeName:_this.selCont[i].storeName,
                            skuMap:{
                                [_this.selCont[i].skuCode]:_this.selCont[i]
                            }
                        }                        
                    }
                    if(_this.acceptPurchaseMap[_this.selCont[i].storeCode][_this.selCont[i].skuCode].purchaseContractDetailInfoVoList.length == 0){
                        MessageBox.confirm(`所选商品${_this.selCont[i].skuName}无法提供供应商`, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                        }).catch(() => {
                        });
                        return;
                    }
                    arr = arr.concat(_this.acceptPurchaseMap[_this.selCont[i].storeCode][_this.selCont[i].skuCode].purchaseContractDetailInfoVoList)
                    let purchaseMap = _this.acceptPurchaseMap[_this.selCont[i].storeCode][_this.selCont[i].skuCode].purchaseContractDetailInfoVoList
                    acceptPurchaseMap[_this.selCont[i].storeCode].skuMap[_this.selCont[i].skuCode].purchaseMap = {}
                    for (let index = 0; index < purchaseMap.length; index++) {
                        const element = purchaseMap[index];
                        acceptPurchaseMap[_this.selCont[i].storeCode].skuMap[_this.selCont[i].skuCode].purchaseMap[element.supplierCode] = element
                    }
                }
                let hash = {}
                for (var i = 0; i < arr.length; i++) {  
                    if(hash[arr[i].supplierCode]){
                        hash[arr[i].supplierCode].number ++
                    }else{
                        arr[i].number = 1 
                        hash[arr[i].supplierCode] = arr[i]                        
                    }
                }
                for (const k in hash) {
                    if (hash.hasOwnProperty(k)) {
                        if(hash[k].number < _this.selCont.length){
                            delete hash[k]
                        }
                    }
                }
                if(JSON.stringify(hash) == '{}'){
                    MessageBox.confirm('所选供应商无法提供共同供应商', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    }).catch(() => {
                    });
                }else{
                    _this.$refs.myModalRef.optionalSupplier(hash)
                    _this.$refs.myModalRef.setSkuList(acceptPurchaseMap)
                    _this.$refs.myModalRef.show()
                    for (let i = 0; i < _this.selCont.length; i++) {
                        const element = _this.selCont[i];
                        _this.$set(_this.selCont[i],'disabled',true)                        
                    }
                    _this.selCont = []
                    _this.acceptPurchase = JSON.parse(JSON.stringify(_this.acceptPurchase)) 
                }
            }else{
                Message({
                    type: 'warning',
                    message: '请选择数据！'
                });
            }  
        }
    },
    created(){
        const _this = this;
        if(_this.purchase == null){
            _this.$router.push({
                name:"require-goods"
            })
        }else{
            _this.acceptPurchase = JSON.parse(JSON.stringify(_this.purchase.list))
            _this.acceptPurchaseMap = JSON.parse(JSON.stringify(_this.purchase.mapList))
            _this.setPurchaseData(null)
            api.ordinalInfo.getSequenceList({
                'serviceCode': config.seqCode.PODETAIL,
                'getNums': _this.acceptPurchase.length
            },(res) => {
                if(res.data.message == 'success'){
                    let SEQ = res.data.obj
                    for (let i = 0; i < _this.acceptPurchase.length; i++) {
                        _this.acceptPurchaseMap[_this.acceptPurchase[i].storeCode][_this.acceptPurchase[i].skuCode].detailCode =  SEQ[i]
                        const element = _this.acceptPurchase[i];
                        element.detailCode = SEQ[i]                        
                        element.purchaseFee = element.purchaseFee == null ? 0 : element.purchaseFee                  
                        if(parseInt(element.reqNums) <= parseInt(element.purchaseToCheckNums)){
                            _this.$set(element,'totalUnitNum',1)         
                        }else{
                            if(parseInt(element.reqNums) % parseInt(element.purchaseToCheckNums)){
                                _this.$set(element,'totalUnitNum',Math.floor((parseInt(element.reqNums) / parseInt(element.purchaseToCheckNums))) + 1)                                         
                            }else{
                                _this.$set(element,'totalUnitNum',Math.floor((parseInt(element.reqNums) / parseInt(element.purchaseToCheckNums))))         
                            }
                        }
                        _this.$set(element,'totalNums',(parseInt(element.totalUnitNum) * parseInt(element.purchaseToCheckNums)))                                 
                        _this.$set(element,'totalMoneyTax',(parseInt(element.totalNums) * parseInt(element.purchaseFee)))                                 
                    }
                }
            })
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
