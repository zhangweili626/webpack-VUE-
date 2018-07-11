<template>
    <b-modal id="updata" ref="updata" title="编辑报损报溢明细" size="lg" @ok="handleOk" ok-title="确定" @shown="showmodal" cancel-title="取消">
        <div class="row">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="商品名称*" :label-cols="4" class="text-right">
                            <search 
                            ref="search"
                            class="text-left"
                            :hasCheck="required"
                            :dataList="datalist"  
                            option="skuName" 
                            @dataChange="querySelect"
                            @itemValue="itemValue"
                            @clickShowBack="firstLoad"
                            @comScroll="comScroll"
                            :disabled="isforbidden"
                            @clearValue="clearValue"
                            >
                            </search>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset label="商品编码*" :label-cols="4" horizontal class="text-right">
                            <b-form-input  :state="status.skuCodeStatus"  :value="param.skuCode" readonly/>                                                                                      
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset label="69码" :label-cols="4" horizontal class="text-right">
                            <b-form-input  :value="param.barCode" readonly/>                                                                                      
                        </b-form-fieldset> 
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset label="原厂编码" :label-cols="4" horizontal class="text-right">
                            <b-form-input  :value="param.originalCode" readonly/>                                                                                      
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset label="外部编码" :label-cols="4" horizontal class="text-right">
                            <b-form-input  :value="param.externalCode" readonly/>                                                                                      
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset label="成本计算类型" :label-cols="4" horizontal class="text-right">
                            <b-form-select :options='CostCalculationType' :value="param.calCostTypeCode" disabled/>                                                                   
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset label="调整前库存数量" :label-cols="4" horizontal class="text-right">
                            <b-form-input   :value="param.stockNumsBefore" readonly/>                                                                                      
                        </b-form-fieldset>
                    </div>
                    <!-- <div class="col-md-6">
                        <b-form-fieldset label="调整前单位成本" :label-cols="4" horizontal class="text-right">
                            <b-form-input   :value="param.stockCostBefore" readonly/>                                                                                      
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset label="调整前库存总金额" :label-cols="4" horizontal class="text-right">
                            <b-form-input   :value="param.stockCostTotalBefore" readonly/>                                                                                      
                        </b-form-fieldset>
                    </div> -->
                    <div class="col-md-6">
                        <b-form-fieldset label="报损报溢类型" :label-cols="4" horizontal class="text-right">
                            <b-form-select :options='adjustTypeList' :value="param.adjustType" disabled/>                                                                   
                        </b-form-fieldset>
                    </div>
                    <!-- <div class="col-md-6">
                        <b-form-fieldset label="调整类型*" :label-cols="4" horizontal class="text-right">
                            <b-form-select  v-model="param.adjustType" :options="adjustTypeList"/>                                                                                                            
                        </b-form-fieldset>
                    </div> -->
                    <div class="col-md-6">
                        <!-- 提交后不显示 -->                                                
                        <b-form-fieldset label="调整值（数量）*" :label-cols="4" horizontal class="text-right">
                            <b-form-input :state="status.adjustValueStatus" type="number" @input="adjustValueInput" v-model="param.adjustValue" />                                                                                      
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6" v-if="calCostTypeStockFlag || calCostTypeSkuFlag" v-show="param.adjustType == 0">
                        <!-- 提交后不显示 -->                                                
                        <b-form-fieldset label="成本（含税价）*" :label-cols="4" horizontal class="text-right">
                            <b-form-input :state="status.inStockIncludingTaxPriceStatus" type="number" min="0" v-model="param.adjustCost" />                                                                                      
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6" v-if="calCostTypeStockFlag || calCostTypeSkuFlag" v-show="param.adjustType == 0">
                        <!-- 提交后不显示 -->                                                
                        <b-form-fieldset label="税率*" :label-cols="4" horizontal class="text-right">
                            <b-form-select :state="status.inStockRateStatus" v-model="param.adjustTaxRateCode" :options="inStockRateList"/>                                                                                                                                        
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12">
                        <b-form-fieldset label="调整原因" :label-cols="2" horizontal class="text-right">
                             <b-form-textarea v-model="param.adjustReason" :rows="3" >
                            </b-form-textarea>                                                                                  
                        </b-form-fieldset>
                    </div>
                    <!-- <div class="col-md-6">
                        <b-form-fieldset label="入库税率" :label-cols="4" horizontal class="text-right">
                            <b-form-input  value="" />                                                                                      
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset label="入库含税价" :label-cols="4" horizontal class="text-right">
                            <b-form-input  value="" />                                                                                      
                        </b-form-fieldset>
                    </div> -->
                    <!-- <div class="col-md-6">
                        审批通过后显示
                        <b-form-fieldset label="调整后库存数量" :label-cols="4" horizontal class="text-right">
                            <b-form-input  value="" readonly/>                                                                                      
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        审批通过后显示                        
                        <b-form-fieldset label="调整后单位成本" :label-cols="4" horizontal class="text-right">
                            <b-form-input  value="" readonly/>                                                                                      
                        </b-form-fieldset>
                    </div>
                     -->
                </div>
            </div>
        </div>
    </b-modal>
</template>
<script>
import api from "common/api";
import config from "common/config";   
import search from "components/iris-search/search.vue";
import { DatePicker, Message} from "element-ui";
export default {
    components: {
        search
    },
    props: {
        adjustDetail:{
            type: String,
            default: null  
        },
        whCode:{
            type: String,
            default: null  
        },
    },
    data() {
        return {
            text:"",
            adjustTypeList:[{text:'报溢',value:0},{text:'报损',value:1}],
            required: false,
            datalist: [],    
            isforbidden: true,
            selectParams: {
                pageNums: config.pageNums,
                pageStart: 1,
                skuType: "goodsTypeGood"
            },
            param:{
                skuName:null,
                skuCode:null,
                barCode:null,
                originalCode:null,
                externalCode:null,
                stockNumsBefore:null,
                adjustType:0,
                adjustValue:null,
                adjustNo:null,
                adjustReason:null,
                adjustCost:null,
                adjustTaxRateCode:null
            },   
            status:{
                adjustValueStatus:null,
                inStockIncludingTaxPriceStatus:null,
                inStockRateStatus:null,
                skuCodeStatus:null
            },
            inStockRateList:[],
            calCostType:null,
            calCostTypeStockFlag:null,
            calCostTypeSkuFlag:null,
            CostCalculationType:[]
            // examineStatus: 0                                                       
        }
    },
    methods: {
        show(){
            const _this = this;
            _this.$refs.updata.show()
        },
        adjustValueInput(){
            const _this = this;
            if(_this.param.adjustValue>0){
                _this.param.adjustType = 0
            }else if(_this.param.adjustValue<0){
                _this.param.adjustType = 1
            }
        },
        getcalCostTypeCode(){
            const _this = this;
            if(_this.calCostTypeStockFlag || _this.calCostTypeSkuFlag){
                _this.param.calCostTypeCode = 'byCount'
            }else{
                _this.param.calCostTypeCode = 'average'
            }
        },
        //点击确认的回调
        handleOk(evt) {
            const _this = this;
            if(_this.param.adjustValue == null){
                _this.status.adjustValueStatus = 'invalid'
            }
            if(!_this.param.skuCode){
                _this.status.skuCodeStatus = 'invalid'
                _this.required = true
            }
            if(_this.calCostTypeStockFlag || _this.calCostTypeSkuFlag){
                if(_this.param.adjustType == 0){
                    if(!_this.param.adjustCost){
                        _this.status.inStockIncludingTaxPriceStatus = 'invalid'                    
                    }
                    if(!_this.param.adjustTaxRateCode){
                        _this.status.inStockRateStatus = 'invalid'
                    }
                    if((_this.param.adjustValue == null)||!_this.param.adjustCost||!_this.param.adjustTaxRateCode || !_this.param.skuCode){
                        evt.preventDefault()
                        return                
                    }
                }
            }
            if(_this.param.adjustValue == 0){
                _this.status.adjustValueStatus = 'invalid'
                evt.preventDefault()
                return
            }
            if((_this.param.adjustValue == null) || !_this.param.skuCode){
                    evt.preventDefault()
                    return                
            }
            if(_this.param.stockNumsBefore != null){
                if(_this.param.adjustValue<0){                
                if(Math.abs(_this.param.adjustValue) > parseFloat(_this.param.stockNumsBefore)){
                    _this.status.adjustValueStatus = 'invalid'      
                    evt.preventDefault()  
                    return                                                                    
                }}
            }
            if(_this.param.adjustCost < 0){
                _this.status.inStockIncludingTaxPriceStatus = 'invalid'
                evt.preventDefault()                  
                return;
            }
            api.adjust.addAdjustDetail([_this.param],msg=>{
                if(msg.data.message ==  'success'){
                    _this.$emit("handle-ok",_this.param.adjustDetailCode)
                    Message({ 
                        type: 'success', 
                        message: '操作成功！'
                    });
                }else{
                    _this.$emit("handle-ok",_this.param.adjustDetailCode)
                }
            })
            _this.$refs.search.setValue()                
            _this.param={
                skuName:null,
                skuCode:null,
                barCode:null,
                originalCode:null,
                externalCode:null,
                stockNumsBefore:null,
                adjustType:0,
                adjustValue:null,
                adjustNo:_this.adjustNo,
                adjustReason:null,
                adjustCost:null,
                adjustTaxRateCode:null
            }
            
        },
        // 选中某一项    
        itemValue(value) {
            const _this = this
            _this.getSupplierName({skuCode:value.skuCode}, obj => {
                let list = obj.list[0]
                if(list){
                    if(list.calCostType == config.CostCalculationType.average){
                        //移动平均 不需要填写入库含税价 税率
                        _this.calCostTypeSkuFlag = 0
                    }else if(list.calCostType == config.CostCalculationType.byCount){
                        //计件 需要填写入库含税价 税率
                        _this.calCostTypeSkuFlag = 1                    
                    }
                    _this.getcalCostTypeCode()
                    _this.$set(_this.param, 'skuCode' ,list.skuCode)                    
                    _this.$set(_this.param, 'barCode' ,list.barCode)
                    _this.$set(_this.param, 'originalCode' ,list.originalCode)
                    _this.$set(_this.param, 'externalCode' ,list.externalCode)
                    _this.$set(_this.param, 'skuName' ,list.skuName)
                }
            });
            api.stockInfo.queryBatchStockInfoVosByWhCode({
              skuCodeSet: [value.skuCode],
              whCode:_this.whCode
            },(msg)=>{
                if(msg.data.message == 'success'){
                    let data = msg.data.obj[_this.whCode] || {}
                    _this.param.stockNumsBefore = data.stockNums || 0
                }
            })
        },
        clearValue(){
            const _this  = this;
            _this.$set(_this.param, 'barCode' , null)
            _this.$set(_this.param, 'originalCode' ,null)
            _this.$set(_this.param, 'externalCode' ,null)
            _this.$set(_this.param, 'skuName' ,null)
            _this.$set(_this.param, 'skuCode' ,null)
        },
        // 搜索框内值改变   触发搜索
        querySelect(data) {
            const _this = this;
            _this.selectParams.pageStart = 1;
            _this.selectParams.skuName = data;
            let params = _this.selectParams;
            _this.getSupplierName(params, function(res) {
            _this.isLastPage = res.isLastPage;
            _this.datalist = res.list;
            });
        },
        // 第一次加载数据
        firstLoad() {
            const _this = this
            if(_this.datalist.length != 0 ){
                return 
            }
            let params = _this.selectParams
            _this.getSupplierName(params, function(res) {
                _this.isLastPage = res.isLastPage
                _this.datalist = res.list
            })
        },
        // 滚动加载
        comScroll(isEnd) {
            if (isEnd && !this.isLastPage) {
                this.selectParams.pageStart ++
                let params = this.selectParams;        
                this.getSupplierName(params, obj => {
                    this.isLastPage = obj.isLastPage;
                    if(obj.list){
                        this.datalist = this.datalist.concat(obj.list);
                    }
                });
            }
        },
         // 定义向后台请求supplierName的方法
        getSupplierName(params,callback) {
            api.checkPlan.querySku(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },
        //显示之前
        showmodal() {
            const _this = this;
            _this.status={
                adjustValueStatus:null,
                inStockIncludingTaxPriceStatus:null,
                inStockRateStatus:null,
                skuCodeStatus:null
            }
            _this.required = false
        },
        setCalCostType(value){
            const _this = this;
            _this.calCostType = value
        }
    },
    created () {
        const _this = this;
        api.ref.getDataDictionarys({
            refCode:'RateValue'
        },(msg)=>{
            if(msg.data.message == 'success'){
                let data = msg.data.obj.referenceDetailInfos
                for (let i = 0; i < data.length; i++) {
                    _this.$set(_this.inStockRateList,i,{
                        text:data[i].refDetailName * 100 + '%',
                        value:data[i].refDetailCode
                    }) 
                }
                
            }
        })
        api.ref.getDataDictionarys({
            refCode:'CostCalculationType'
        },(msg)=>{
            if(msg.data.message == 'success'){
                let data = msg.data.obj.referenceDetailInfos
                for (let i = 0; i < data.length; i++) {
                    _this.$set(_this.CostCalculationType,i,{
                        text:data[i].refDetailName,
                        value:data[i].refDetailCode
                    }) 
                }
            }
        })
        
    },
    watch: {
        adjustDetail:function(value){
            const _this = this;
            if(value){
                api.adjust.getAdjustSkuDetailInfoByCode({
                    adjustDetailCode:value
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        let data = msg.data.obj;
                        _this.$refs.search.setValue(data.skuName)
                        if(data.calCostTypeCode == config.CostCalculationType.average){
                            //移动平均 不需要填写入库含税价 税率
                            _this.calCostTypeSkuFlag = 0
                        }else if(data.calCostTypeCode == config.CostCalculationType.byCount){
                            //计件 需要填写入库含税价 税率
                            _this.calCostTypeSkuFlag = 1                    
                        }
                        api.stockInfo.queryBatchStockInfoVosByWhCode({
                            skuCodeSet: [data.skuCode],
                            whCode:_this.whCode
                            },(msg)=>{
                                if(msg.data.message == 'success'){
                                    let data = msg.data.obj[_this.whCode] || {}
                                    _this.param.stockNumsBefore = data.stockNums || 0
                                }
                            })
                        _this.param = {
                            skuName:data.skuName,
                            skuCode:data.skuCode,
                            barCode:data.barCode,
                            originalCode:data.originalCode,
                            externalCode:data.externalCode,
                            stockNumsBefore:data.stockNumsBefore,
                            adjustType:data.adjustType,
                            adjustNo:data.adjustNo,/*  */
                            adjustValue:data.adjustValue,
                            adjustDetailCode:data.adjustDetailCode,
                            id:data.id,
                            adjustReason:data.adjustReason,
                            inStockIncludingTaxPrice:data.inStockIncludingTaxPrice,
                            inStockRate:data.inStockRate
                        } 
                        _this.param = {
                            adjustDetailCode:data.adjustDetailCode,
                            id:data.id,
                            skuName:data.skuName,
                            skuCode:data.skuCode,
                            barCode:data.barCode,
                            originalCode:data.originalCode,
                            externalCode:data.externalCode,
                            adjustType:data.adjustType,
                            adjustValue:data.adjustValue,
                            adjustNo:data.adjustNo,
                            adjustReason:data.adjustReason,
                            adjustCost:data.adjustCost,
                            adjustTaxRateCode:data.adjustTaxRateCode
                        }
                        _this.getcalCostTypeCode()
                    }
                })
            }
        },
        calCostType:{
            handler:function(value){
                const _this = this;
                if(value == config.CostCalculationType.average){
                    //移动平均 不需要填写入库含税价 税率
                    _this.calCostTypeStockFlag = 0
                }else if(value == config.CostCalculationType.byCount){
                    //计件 需要填写入库含税价 税率
                    _this.calCostTypeStockFlag = 1                    
                }
                _this.getcalCostTypeCode()
            },
            deep:true
        }
    }
}
</script>
<style>
    .modal-dialog {
        margin: 80px auto !important;
    }
</style>

