<template>
    <div class="car-template card">
        <b-card header="采购单信息">
        <div class="row mt-3 ml-2 mr-2">
            <div class="col-md-12 col-lg-12">
                <div class="cardModelLine">
                    <span>采购单号: {{params.orderNo}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>创建人: {{empName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <!-- <span>创建时间: {{params.createTimeStr}}</span>                     -->
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <b-form-fieldset horizontal label="销售区域*" :label-cols="4" class="text-right">
                    <AreaTree   :error="AreaTreeError" @select-change="selectedfun" ref="area" :storeAll='true'></AreaTree>
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="仓库名称*" :label-cols="4" class="text-right">
                    <b-form-select :state="state.whCode" v-model="params.whCode" :options="entreList"></b-form-select>
                </b-form-fieldset>
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="采购类型*" :label-cols="4" class="text-right">
                    <b-form-select disabled :state="state.purchaseTypeCode" v-model="params.purchaseTypeCode" :options="purchaseType"></b-form-select>                        
                </b-form-fieldset> 
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="供应商类型*" :label-cols="4" class="text-right">
                    <b-form-select :state="state.supplierTypeCode" @input="supplierTypeChange" v-model="params.supplierTypeCode" :options="SupplierType"></b-form-select>                        
                </b-form-fieldset> 
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="供应商*" :label-cols="4" class="text-right">
                    <!-- <search 
                    class="text-left"
                    ref="supplier"
                    :hasCheck="brandRequired"
                    :dataList="brandDatalist"  
                    option="supplierName" 
                    @dataChange="brandQuerySelect"
                    @itemValue="brandItemValue"
                    @clickShowBack="brandFirstLoad"
                    @comScroll="brandComScroll"
                    @clearValue="brandClearValue"
                    >
                    </search>        -->
                    <b-form-select :state="state.supplierCode" v-model="params.supplierCode" @input="supplierCodeInput" :options="supplierList"></b-form-select>
                </b-form-fieldset> 
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="外部编码" :label-cols="4" class="text-right">
                    <b-form-input disabled></b-form-input>                        
                </b-form-fieldset> 
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="配送类型*" :label-cols="4" class="text-right">
                    <b-form-select  :state="state.deliveryTypeCode" v-model="params.deliveryTypeCode" :options="DispatchingType"></b-form-select>                        
                </b-form-fieldset> 
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="承运商" :label-cols="4" class="text-right">
                    <b-form-input v-model="params.commonCarrierName"></b-form-input>                        
                </b-form-fieldset> 
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="预计到货时间*" :label-cols="4" class="text-right">
                    <el-date-picker
                        :class="{'inp-invalid' : state.estimatedArrivalDate}"
                        v-model="params.estimatedArrivalDate"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions1"
                        >
                    </el-date-picker>                      
                </b-form-fieldset> 
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="订单截止时间*" :label-cols="4" class="text-right">
                    <!-- <b-form-input v-model="params.deadLineTime"></b-form-input>   -->
                    <el-date-picker
                        v-model="params.deadLineTime"
                        :class="{'inp-invalid' : state.deadLineTime}"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerOptions1"
                        >
                    </el-date-picker>                      
                </b-form-fieldset> 
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="采购总数" :label-cols="4" class="text-right">
                    <b-form-input v-model="params.totalNums" disabled></b-form-input>                        
                </b-form-fieldset> 
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="采购总金额" :label-cols="4" class="text-right">
                    <b-form-input v-model="params.totalMoney" disabled></b-form-input>                        
                </b-form-fieldset> 
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="运费" :label-cols="4" class="text-right">
                    <b-form-input :state="state.totalFreightFee" type="number" v-model="params.totalFreightFee"></b-form-input>                        
                </b-form-fieldset> 
            </div>
            <div class="col-md-4 col-lg-4">
                <b-form-fieldset horizontal label="备注" :label-cols="4" class="text-right">
                    <b-form-input v-model="params.remark"></b-form-input>                        
                </b-form-fieldset> 
            </div>
        </div>
        <div class="row ml-2 mr-2">
            <div class="col-md-12">
                <div class="pull-right">
                    <b-button size="sm" variant="default" @click="callback()">取消</b-button>                        
                    <b-button size="sm" variant="primary" @click="preserve()">保存</b-button>                        
                    <!-- <b-button  :disabled="!flag" size="sm" variant="primary" @click="submit()">提交</b-button>                         -->
                    <!-- <b-button size="sm" variant="primary" @click="preserve()">作废</b-button>                         -->
                </div>
            </div>
        </div>
        </b-card>        
        <b-card header="明细">
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="danger" @click="cancel()">删除</b-button>                        
                        <b-button size="sm" variant="primary" @click="addDetail">增加</b-button>                        
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
                            <input type="checkbox" name="radio"  v-model="selCont" :value="scope.row"/>                                
                        </template>	
                    </el-table-column>
                    <el-table-column
                    prop="skuCode"
                    label="商品编码"
                    :width="getColumnW('商品编码', '')">
                    </el-table-column>
                    <el-table-column
                    prop="skuName"
                    label="商品名称"
                    :width="getColumnW('商品名称', '')">
                    </el-table-column>
                    <el-table-column
                    prop="originalCode"
                    label="原厂编码"
                    :width="getColumnW('原厂编码', '')">
                    </el-table-column>
                    <el-table-column
                    prop="skuModel"
                    label="型号"
                    fit
                    :width="getColumnW('型号', '')">
                    </el-table-column>
                    <el-table-column
                    prop="skuStandards"
                    label="规格"
                    :width="getColumnW('规格', '')">
                    </el-table-column>
                    <el-table-column
                    prop="purchaseUnitName"
                    label="采购单位"
                    :width="getColumnW('采购单位', '')">
                    </el-table-column>
                    <el-table-column
                    prop="checkUnitName"
                    label="核算单位"
                    :width="getColumnW('核算单位', '')">
                    </el-table-column>
                    <el-table-column
                    prop="purchaseToCheckNums"
                    label="转换系数"
                    :width="getColumnW('转换系数', '')">
                    </el-table-column>
                    <el-table-column
                    prop="skuNums"
                    label="需求数量"
                    :width="getColumnW('需求数量需求数量需求数量', '')">
                    <template slot-scope="scope">
                        <input  class="form-control" type="number" min="0" @blur="requirementNum(scope.row)" v-model="scope.row.skuNums"/>                                
                    </template>	
                    </el-table-column>
                    <el-table-column
                    prop="purchaseFee"
                    label="单价（含税）"
                    :width="getColumnW('单价（含税）单价（含税）', '')">
                    <template slot-scope="scope">
                        <input :disabled="fieldDisabled"  class="form-control" v-if="!scope.row.unitprice" @blur="purchaseFeeBlur(scope.row)" type="number" min="0" v-model="scope.row.purchaseFee"/>  
                        <span v-if="scope.row.unitprice">{{scope.row.purchaseFee.toFixed(2)}}</span>                              
                    </template>	
                    </el-table-column>
                    <el-table-column
                    prop="IncludingTax"
                    label="金额（含税）"
                    :width="getColumnW('金额（含税）', '')">
                    <template slot-scope="scope">
                        {{scope.row.IncludingTax = ((parseFloat(scope.row.purchaseFee) *  parseInt(scope.row.skuNums)) || 0).toFixed(2)}}
                    </template>	
                    </el-table-column>
                    <el-table-column
                    prop="purchaseRate"
                    label="税率"
                    :width="getColumnW('税率税率税率税率', '')">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.id">
                            <b-form-select :disabled="fieldDisabled" v-if="!scope.row.unitprice" v-model="scope.row.purchaseRate" :options="purchaseRateList"></b-form-select>
                            <span v-if="scope.row.unitprice">{{scope.row.purchaseRate*100 + '%'}}</span>                              
                        </div>
                        <div v-if="scope.row.id">
                            <b-form-select :disabled="fieldDisabled" v-if="!scope.row.contractDetailCode" v-model="scope.row.purchaseRate" :options="purchaseRateList"></b-form-select>
                            <span v-if="scope.row.contractDetailCode">{{scope.row.purchaseRate*100 + '%'}}</span>                              
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="Tax"  
                    label="税金"
                    :width="getColumnW('税金税金', '')">
                    <template slot-scope="scope">
                        <span>{{ scope.row.Tax = ((scope.row.IncludingTax / (1+scope.row.purchaseRate)*scope.row.purchaseRate) || 0).toFixed(2) || 0}}</span>                              
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="exclusiveOfTax"
                    label="金额（不含税）"
                    :width="getColumnW('金额（不含税）', '')">
                     <template slot-scope="scope">
                         <span>{{scope.row.exclusiveOfTax =  ((scope.row.IncludingTax - scope.row.Tax) || 0).toFixed(2) }}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="barCode"  
                    label="69码">
                    </el-table-column>
                </el-table>
            </div>
        </b-card>        
        <irisModal ref="irisModal" :tipsTitle="'确认变更么？'" :warnigTitle="'供应商发生改变，单据数据需要重新生成'" @sureEvent="sureEvent"></irisModal>
        <model ref="myModalRef1"  :orderNo="params.orderNo" :supplierCode="params.supplierCode" :storeCode="params.storeCode"  :containerlist="tableList" :supplierTypeCode='params.supplierTypeCode'  @receive="receive"></model>
    </div>
</template>
<script>
    import Vue from 'vue'
    import config from 'common/config.js'
    import common from 'common/common.js'
    import api from 'common/api.js'
    import {Table, TableColumn, Input, Message, MessageBox , Tooltip,DatePicker} from "element-ui"
    import model from './model.vue'
    import search from "components/iris-search/search.vue";
    import AreaTree from 'components/iris-areaqueryshop/index'     
    import irisModal from 'components/iris-modal'
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Tooltip)
    Vue.use(DatePicker)
    export default {
        components: {
            model,
            search,
            AreaTree,
            irisModal
        },
        data() {
            return {
                selCont:[],
                tableList:[],
                params:{
                    orderNo:null,
                    orderType:1,
                    purchaseTypeCode:'TemporaryPurchase',
                    totalFreightFee:0
                },
                state:{
                    purchaseTypeCode:null,
                    supplierTypeCode:null,
                    deliveryTypeCode:null,
                    whCode:null,
                    supplierCode:null,
                    totalFreightFee:null
                },
                AreaTreeError:false,
                brandRequired: false,
                SupplierType:[],
                brandDatalist: [],
                purchaseType:[],
                DispatchingType:[],
                selectParams: {
                    pageNums: config.pageNums,
                    pageStart: 1,
                    supplierType:null
                }, 
                entreList:[],
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() < (Date.now()-24*60*60*1000);
                    }
                },
                purchaseRateList:[],
                flag:false,
                supplierList:[],
                columW: config.demandOrder.columW,
            }
        },
        methods: {
            supplierCodeInput(){
                const _this = this;                
                if(_this.flag){
                    _this.$refs.irisModal.showDeleteModel()
                    // if(_this.params.supplierTypeCode == 'REFD2000181'){
                    //     //非合同供应商
                    // }else if(_this.params.supplierTypeCode == 'REFD2000179'){
                    //     //合同供应商
                    //     _this.$refs.irisModal.showDeleteModel()
                    // }
                }else{
                    if(_this.params.supplierTypeCode == 'REFD2000179'){
                        //合同供应商
                        _this.tableList = []
                    }
                }
            },
            sureEvent(){
                const _this = this;
                location.reload();
            },
            submit(){
                const _this = this;
                if(!_this.flag){
                    Message({ 
                        type: 'warning', 
                        message: '请先保存采购订单!'
                    });
                }else{
                    api.purchaseOrder.submitPurchaseOrderInfo({
                        orderType:1,
                        orderNo:_this.params.orderNo},(res)=>{
                        if(res.data.message == 'success'){
                            Message({
                                type: 'success',
                                message: '操作成功！'
                            });
                            _this.$router.push({
                                name:"purchase-query",
                            })
                        }                    
                    })
                }
                
            },
            callback(){
                const _this = this                
                _this.$router.push({
                    name:"purchase-query",
                })
            },
            gettotalMoney(){
                const _this = this
                let totalMoney = 0
                for (let index = 0; index < _this.tableList.length; index++) {
                    const element = _this.tableList[index];
                    if(parseFloat(element.IncludingTax) > 0 ){
                        totalMoney += parseFloat(element.IncludingTax)
                    }
                }
                _this.$set( _this.params,'totalMoney',totalMoney.toFixed(2))
            },
            purchaseFeeBlur(){
                const _this = this
                _this.gettotalMoney()
            },
            gettotalNums(){
                const _this = this
                let totalNums = 0
                for (let index = 0; index < _this.tableList.length; index++) {
                    const element = _this.tableList[index];
                    if(parseInt(element.skuNums) > 0 ){
                        totalNums += parseInt(element.skuNums)
                    }
                }
                _this.$set( _this.params,'totalNums',totalNums)
            },
            requirementNum(obj){
                const _this = this
                if(typeof parseFloat(obj.skuNums) === 'number' && parseFloat(obj.skuNums)%1 === 0){
                    if(obj.skuNums > obj.purchaseToCheckNums){
                        if(obj.skuNums%obj.purchaseToCheckNums > 0){
                            MessageBox.confirm('需求数量是否补齐到最小可用采购数！', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                            }).then(() => {
                                obj.skuNums = (parseInt(obj.skuNums/obj.purchaseToCheckNums)+1) * obj.purchaseToCheckNums
                                _this.gettotalNums()
                                _this.gettotalMoney()
                            }).catch(() => {
                            });
                        }
                    }else if(obj.skuNums < obj.purchaseToCheckNums){
                        MessageBox.confirm('需求数量是否补齐到最小可用采购数！', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                        }).then(() => {
                            obj.skuNums = obj.purchaseToCheckNums
                            _this.gettotalNums()
                            _this.gettotalMoney()
                        }).catch(() => {
                        });
                    }
                    _this.gettotalNums()
                    _this.gettotalMoney()
                }else{
                    Message({ 
                        type: 'warning', 
                        message: '请填写正确的需求数!'
                    });
                }
            },
            receive(value){
                const _this = this;
                api.ordinalInfo.getSequenceList({
                'serviceCode': config.seqCode.PODETAIL,
                'getNums': value.length
            },(res) => {
                if(res.data.message == 'success'){
                    let SEQ = res.data.obj                    
                    for (let index = 0; index < value.length; index++) {
                        const element = value[index];
                        element.detailCode = SEQ[index]
                    }
                }
            })
                _this.tableList = [..._this.tableList,...value]
            },
            //区域选择门店
            selectedfun(data, data1) {
                const _this = this;
                const options = {
                    storeCodeSet: []
                };
                if(data1 instanceof Array){
                    _this.params.storeCodes = []
                    for (let i = 0; i < data1.length; i++) {
                        _this.$set(_this.params.storeCodes, i, data1[i].value)              
                    }
                }else{
                    options.storeCodeSet.push(data1.value);
                    _this.selectParams.storeCodes = [data1.value]
                    _this.params.storeCode = data1.value
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
            querySkuBrandInfoForPageByVo(params,callback) {
                const _this = this
                if(_this.selectParams.supplierType == null){
                    
                }else{
                    api.purchaseOrder.querySupplierInfoNoPageBySupplierInfo(params, (res) => {
                        if (res.data.code === "success") {
                            let obj = res.data.obj;
                            callback(obj);
                        }
                    })
                }
                
            },
            brandClearValue(){
                const _this  = this;
                _this.params.supplierCode = ""                
            },
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
            brandFirstLoad() {
                const _this = this
                if(_this.brandDatalist.length != 0 ){
                    return 
                }
                let params = _this.selectParams
                _this.querySkuBrandInfoForPageByVo(params, function(res) {
                    _this.brandDatalist = res.list
                })
            },
            // 选中某一项    
            brandItemValue(value) {
                const _this = this
                _this.params.supplierCode = value.supplierCode
                _this.tableList = []
            },
            // 搜索框内值改变   触发搜索
            brandQuerySelect(data) {
                const _this = this;
                _this.selectParams.pageStart = 1;
                _this.selectParams.supplierName = data;
                let params = _this.selectParams;
                _this.querySkuBrandInfoForPageByVo(params, function(res) {
                    _this.brandDatalist = res.list
                });
            },
            supplierTypeChange(value){
                const _this = this;
                if(_this.flag){
                    // _this.$refs.irisModal.showDeleteModel()
                }else{
                    _this.supplierList = []
                    _this.tableList = []
                    _this.selectParams.supplierType = value
                    // _this.selectParams.pageStart = 1;
                    _this.params.supplierCode = null
                    api.purchaseOrder.querySupplierInfoNoPageBySupplierInfo(_this.selectParams, (res) => {
                        if (res.data.code === "success") {
                            let obj = res.data.obj;
                            for (let index = 0; index < obj.length; index++) {
                                obj[index].text = obj[index].supplierName
                                obj[index].value = obj[index].supplierCode
                            }
                            _this.supplierList = obj
                        }
                    })
                    // _this.$refs.supplier.clearValue()
                    // let params = _this.selectParams;
                    // _this.querySkuBrandInfoForPageByVo(params, function(res) {
                    //     _this.brandDatalist = res.list
                    // })
                }
            },
            preserve(){
                const _this = this;
                _this.state = {
                    purchaseTypeCode:null,
                    supplierTypeCode:null,
                    deliveryTypeCode:null,
                    whCode:null,
                    supplierCode:null,
                    totalFreightFee:null
                }
                if(!_this.params.purchaseTypeCode){
                    _this.state.purchaseTypeCode = 'invalid'
                }
                if(!_this.params.supplierCode){
                    _this.state.supplierCode = 'invalid'
                    // _this.brandRequired = true
                }
                if(!_this.params.deliveryTypeCode){
                    _this.state.deliveryTypeCode = 'invalid'
                }
                if(!_this.params.supplierTypeCode){
                    _this.state.supplierTypeCode = 'invalid'
                }
                if(!_this.params.storeCode){
                    _this.AreaTreeError = true
                }
                if(!_this.params.whCode){
                    _this.state.whCode = 'invalid'
                }
                if(!_this.params.estimatedArrivalDate){
                    _this.state.estimatedArrivalDate = true
                }
                if(!_this.params.deadLineTime){
                    _this.state.deadLineTime = true
                }
                if((_this.params.estimatedArrivalDate)){
                    _this.params.estimatedArrivalDate = common.formattingTime([_this.params.estimatedArrivalDate,_this.params.estimatedArrivalDate]).endTime                
                }
                if((_this.params.deadLineTime)){
                    _this.params.deadLineTime = common.formattingTime([_this.params.deadLineTime,_this.params.deadLineTime]).endTime                
                }
                if(_this.params.totalFreightFee<0){
                    _this.state.totalFreightFee = 'invalid'
                }
                if(!_this.params.purchaseTypeCode || !_this.params.supplierCode || !_this.params.deliveryTypeCode || !_this.params.supplierTypeCode || !_this.params.whCode || !_this.params.estimatedArrivalDate || !_this.params.deadLineTime||_this.params.totalFreightFee<0){
                    return;
                }
                // if(_this.tableList.length == 0){
                //     Message({ 
                //         type: 'warning', 
                //         message: '请填写采购订单明细！'
                //     });
                //     return;
                // }
                
                if((_this.params.supplierTypeCode == 'REFD2000181') ||(_this.params.supplierTypeCode == 'REFD2000182')){
                    //非合同供应商
                    for (let index = 0; index < _this.tableList.length; index++) {
                        const element = _this.tableList[index];
                        if(!element.skuNums){
                            Message({ 
                                type: 'warning', 
                                message: '请填写正确的需求数量！'
                            });
                            return
                        }
                        if(parseFloat(element.skuNums)%1 !== 0){
                            Message({ 
                                type: 'warning', 
                                message: '请填写正确的需求数量！'
                            });
                            return
                        }
                        if(parseFloat(element.skuNums) <= 0){
                            Message({ 
                                type: 'warning', 
                                message: '请填写正确的需求数量！'
                            });
                            return
                        }
                        if(!element.purchaseFee){
                            Message({ 
                                type: 'warning', 
                                message: '请填写正确的单价！'
                            });
                            return
                        }
                        if(!element.purchaseRate){
                            Message({ 
                                type: 'warning', 
                                message: '请填写正确的税率！'
                            });
                            return
                        }
                    }
                }else if(_this.params.supplierTypeCode == 'REFD2000179'){
                    //合同供应商
                    for (let index = 0; index < _this.tableList.length; index++) {
                        const element = _this.tableList[index];
                        if(!element.skuNums){
                            Message({ 
                                type: 'warning', 
                                message: '请填写正确的需求数量！'
                            });
                            return
                        }
                        if(parseFloat(element.skuNums)%1 !== 0){
                            Message({ 
                                type: 'warning', 
                                message: '请填写正确的需求数量！'
                            });
                            return
                        }                        
                        if(parseFloat(element.skuNums) <= 0){
                            Message({ 
                                type: 'warning', 
                                message: '请填写正确的需求数量！'
                            });
                            return
                        }
                    }
                }
                _this.params.poSkuDetailInfoVos = _this.tableList
                api.requirement.insertPurchaseOrderAndPoSkuInfo(_this.params,(msg)=>{
                    if(msg.data.message == 'success'){
                        Message({
                            type: 'success',
                            message: '操作成功！'
                        });
                        _this.$router.push({
                            name:"purchase-edit",
                            query:{
                                orderNo:_this.params.orderNo,
                                disabled:false
                            }
                        })
                        _this.flag = true
                    }
                })
            },
            deletedDetail(location = []){
                const _this = this
                for (let index = 0; index < location.length; index++) {
                    const element = location[index];
                    for (let index = 0; index < _this.tableList.length; index++) {
                        const element1 = _this.tableList[index];
                        if(element1.skuCode == element.skuCode){
                            _this.tableList.splice(index,1)
                        }
                    }
                }
                _this.gettotalNums()
            },
            cancel(){
                const _this = this
                if(_this.selCont.length!=0){
                    let service = []
                    let location = []
                    for (let index = 0; index < _this.selCont.length; index++) {
                        const element = _this.selCont[index];
                        if(element.id){
                            element.isDeleted = 1
                            service.push(element)
                        }else{
                            location.push(element)
                        }
                    }
                    if(service.length!=0){
                        api.purchaseOrder.editPoSkuDetailInfo(service,(msg)=>{
                            if(msg.data.message == 'success'){
                                _this.deletedDetail(service)
                            }
                        })
                    }
                    _this.deletedDetail(location)
                }else{
                    Message({ 
                        type: 'warning', 
                        message: '请选择一条数据!'
                    });
                }
                _this.selCont = []
            },
            addDetail(){
                const _this = this;
                _this.state = {
                    purchaseTypeCode:null,
                    supplierTypeCode:null,
                    deliveryTypeCode:null,
                    whCode:null,
                    supplierCode:null
                }
                _this.brandRequired = false   
                _this.AreaTreeError = false    
                _this.state.deadLineTime = false
                _this.state.estimatedArrivalDate = false                                         
                if(!_this.params.purchaseTypeCode){
                    _this.state.purchaseTypeCode = 'invalid'
                }
                if(!_this.params.supplierCode){
                    // _this.brandRequired = true
                    _this.state.supplierCode = 'invalid'
                }
                if(!_this.params.deliveryTypeCode){
                    _this.state.deliveryTypeCode = 'invalid'
                }
                if(!_this.params.supplierTypeCode){
                    _this.state.supplierTypeCode = 'invalid'
                }
                if(!_this.params.storeCode){
                    _this.AreaTreeError = true
                }
                if(!_this.params.whCode){
                    _this.state.whCode = 'invalid'
                }
                if(!_this.params.estimatedArrivalDate){
                    _this.state.estimatedArrivalDate = true
                }
                if(!_this.params.deadLineTime){
                    _this.state.deadLineTime = true
                }
                if((_this.params.estimatedArrivalDate)){
                    _this.params.estimatedArrivalDate = common.formattingTime([_this.params.estimatedArrivalDate,_this.params.estimatedArrivalDate]).endTime                
                }
                if((_this.params.deadLineTime)){
                    _this.params.deadLineTime = common.formattingTime([_this.params.deadLineTime,_this.params.deadLineTime]).endTime                
                }
                if(_this.params.totalFreightFee<0){
                    _this.state.totalFreightFee = 'invalid'
                }
                if(!_this.params.purchaseTypeCode || !_this.params.supplierCode || !_this.params.deliveryTypeCode || !_this.params.supplierTypeCode || !_this.params.whCode || !_this.params.estimatedArrivalDate || !_this.params.deadLineTime||_this.params.totalFreightFee<0){
                    return;
                }
                _this.$refs.myModalRef1.show()
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
                        let list = []
                        for (let i = 0; i < data.length; i++) {        
                            list[i] = {
                                text:data[i].refDetailName,
                                value:data[i].refDetailCode
                            }
                        }
                        cb(list)
                    }
                })
            },
        },
        mounted(){
            const _this = this;
        },
        computed:{
            empName:function(){
                let userInfo = sessionStorage.getItem("userInfo");  
                if(userInfo){
                    return JSON.parse(userInfo).empVo.empCnName  
                }
            },
        },
        created(){
            const _this = this;
            api.ordinalInfo.getSequence({
                serviceCode: config.seqCode.PO                    
            },(msg)=>{
                if(msg.data.message == 'success'){
                    _this.params.orderNo = msg.data.obj
                }
            })
            _this.getDataDictionarys('PurchaseOrder',(msg)=>{
                _this.purchaseType = msg
            })
            _this.getDataDictionarys('DispatchingType',(msg)=>{
                _this.DispatchingType = msg
            })
            _this.getDataDictionarys('SupplierType',(msg)=>{
                _this.SupplierType = msg
            })
            api.ref.getDataDictionarys({
                refCode: 'RateValue'
            },(msg)=>{
                if(msg.data.message == 'success'){
                    let data  = msg.data.obj.referenceDetailInfos
                    let list = []
                    for (let i = 0; i < data.length; i++) {   
                        list[i] = {
                            text:parseFloat(data[i].refDetailName)*100 + '%',
                            value:data[i].refDetailValue
                        }
                    }
                    _this.purchaseRateList = list
                }
            })
            
        }
    }
</script>
<style>
    .cardModelLine {
        border-bottom: 1px solid #ccc;
        padding-bottom: 20px;
        margin-bottom: 20px;
    }
    .car-template .inp-invalid input{
        border-color: #f86c6b !important;
    }
</style>

