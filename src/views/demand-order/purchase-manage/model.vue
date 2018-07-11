<template>
    <b-modal :hide-footer="true" id="model" ref="myModalRef1" size="lg" @show="showmodal"  ok-title="确定"  cancel-title="取消">
        <div class="row">
            <div class="col-md-6">
                <b-form-fieldset horizontal label="可选供应商*" :label-cols="4" class="text-right">
                    <b-form-select :state="supplierCodeState" v-model="supplierCode" @change="getSupplierInfo" :options="supplier"></b-form-select>                
                </b-form-fieldset>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="pull-left">
                    <b-button size="sm" variant="primary" @click="cancel">返回添加</b-button>
                    <b-button size="sm" variant="primary" @click="insertPurchaseOrderAndPoSkuInfo">生成采购单</b-button>                    
                    <b-button size="sm" variant="primary" @click="preview">采购单预览</b-button>
                </div>
            </div>
        </div>
        <div class="card card-inverse mt-2" v-for="(item,index) in skuList" :key="index">
            <div class="card-block pt-0">
                <div class="fatherControlSpecial">
                    <div class="purchaseManageTable">
                        <div class="row mt-2 mb-4">
                            <div class="col-md-6">
                                    <b-badge variant="light">采购单号：{{item.orderNo}}</b-badge>                
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <b-form-fieldset horizontal label="发票抬头*" :label-cols="4" class="text-right">
                                    <!-- <b-form-select v-model="item.invoiceTitle" :options="invoiceTitleList"/>     -->
                                    <b-form-input type="text" v-model="item.invoiceTitle"/>                                                   
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-4">
                                <b-form-fieldset horizontal label="区域／门店*" :label-cols="4" class="text-right">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <b-form-input type="text" :value="item.storeName" readonly/>   
                                        </div>
                                        <div class="col-md-6">
                                            <b-form-select :state="item.whCodeState" v-model="item.whCode" @input="entreChange(item,item.whCode,item.entreList)" :options="item.entreList"/>                        
                                        </div>
                                    </div>                 
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-4">
                                <b-form-fieldset horizontal label="运费*" :label-cols="4" class="text-right">
                                    <div class="row">
                                        <div class="col-md-9">
                                            <b-form-input type="number" min="0" v-model="item.totalFreightFee"/>
                                        </div>
                                        <div class="pt-2">
                                            元   
                                        </div>
                                    </div>
                                </b-form-fieldset>
                            </div>
                        </div>
                        <div class="table-scrollable">
                            <b-table striped hover bordered show-empty :items="item.poSkuDetailInfoVos" :fields="fields">
                                <template slot="skuCode" slot-scope="data">
                                    {{data.item.skuCode}}
                                </template>
                                <template slot="skuName" slot-scope="data">
                                    {{data.item.skuName}}
                                </template>
                                <template slot="purchaseNum" slot-scope="data">
                                    {{data.item.totalUnitNum}}
                                </template>
                                <template slot="purchaseFee" slot-scope="data">
                                    {{data.item.purchaseFee && data.item.purchaseFee.toFixed(2)}}
                                </template>
                                <template slot="totalNums" slot-scope="data">
                                    {{data.item.totalNums}}
                                </template>
                                <template slot="purchaseUnitName" slot-scope="data">
                                    {{data.item.purchaseUnitName}}
                                </template>
                                <template slot="money" slot-scope="data">
                                    {{data.item.totalMoneyTax && data.item.totalMoneyTax.toFixed(2)}}
                                </template>
                                <template slot="taxRate" slot-scope="data">
                                    {{data.item.purchaseRate == null ? 0 : data.item.purchaseRate}}
                                </template>
                                <template slot="externalCode" slot-scope="data">
                                    {{data.item.externalCode}}
                                </template>
                                <template slot="barCode" slot-scope="data">
                                    {{data.item.barCode}}
                                </template>
                                <template slot="originalCode" slot-scope="data">
                                    {{data.item.originalCode}}
                                </template>
                                <template slot="empty">
                                    暂无数据...                  
                                </template>
                            </b-table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </b-modal>
</template>
<script>
import api from "common/api";
import config from "common/config";   
import common from "common/common.js"
import collectionApi from 'common/api-collection.js'
import { DatePicker, Message, MessageBox} from "element-ui";
export default {
    components: {
    },
    data() {
        return {
            supplier:[],//供应商列表 
            skuList:{},//商品列表
            // invoiceTitleList:[],//发票抬头list
            entreList:[],//仓库
            fields:{
                skuCode:{
                    label: "商品编码"
                },
                skuName:{
                    label: "商品名称"                        
                },
                purchaseNum:{
                    label: "采购数"                        
                },
                purchaseFee:{
                    label: "采购单价"                        
                },
                totalNums:{
                    label: "采购总数"                        
                },
                purchaseUnitName:{
                    label: "采购单位"                        
                },
                money:{
                    label: "采购金额"                        
                },
                taxRate:{
                    label: "税率"                        
                },
                externalCode:{
                    label: "外部编码"                        
                },
                barCode:{
                    label: "69码"                        
                },
                originalCode:{
                    label: "原厂编码"                        
                },
            },
            supplierCode:null,
            supplierCodeState:null,
            supplierDetailInfo:null,
        }
    },
    methods: {
        //仓库改变
        entreChange(item,code,entreList){
            const _this = this;
            for (let index = 0; index < entreList.length; index++) {
                const element = entreList[index];
                if(element.warehouseCode == code){
                    item.contactAddress = element.warehouseAddress || ""
                }
            }
        },
        //区域选择门店
        selectedfun(data, data1) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            if(!(data1 instanceof Array)){
                options.storeCodeSet.push(data1.value);
                _this.params.storeCode = data1.value
                // 根据经销商店获取仓库
                api.getEntrepot({
                storeCodeSet: []
            }, function(res) {
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
        //显示
        show(){
            const _this = this 
            _this.$refs.myModalRef1.show()       
        },
        showmodal(bvEvt){
            const _this = this;
            if(!(JSON.stringify(_this.skuList)=='{}')){
                _this.$refs.myModalRef1.show()       
                return;                               
            }
        },
        //删除明细
        deleteDetail(value){
            const _this = this
            _this.skuList[value.storeCode]
            let list = _this.skuList[value.storeCode].poSkuDetailInfoVos
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                if(element.skuCode == value.skuCode){
                    list.splice(index,1)
                    if(list.length == 0){
                        delete _this.skuList[value.storeCode]
                    } 
                }
            }
        },
        //返回添加
        cancel(){
            const _this = this 
            _this.$refs.myModalRef1.hide()       
        },
        preview(){
            const _this = this;
            let purchaseOrderInfoVos = []
            if(!_this.supplierCode){
                MessageBox.confirm('请选择可用供应商', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                }).catch(() => {
                });
                return;
            }
            for (const key in _this.skuList) {
                if (_this.skuList.hasOwnProperty(key)) {
                    const element = _this.skuList[key];
                    const sku = element.poSkuDetailInfoVos;  
                    element.purchaseTotalMoney = 0       
                    element.totalNums = 0    
                    if(element.totalFreightFee < 0){
                        MessageBox.confirm('运费不能小于0，请填写正确的运费！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                        }).catch(() => {
                        });
                        return;
                    }
                    element.supplierCode = _this.supplierCode
                    element.supplierName = _this.supplierDetailInfo.supplierName || ""
                    element.contactName = _this.supplierDetailInfo.contactName || ""
                    element.contactPhone = _this.supplierDetailInfo.contactMobile || ""                                                       
                    for (let j = 0; j < sku.length; j++) {
                        element.purchaseTotalMoney += sku[j].totalMoneyTax
                        sku[j].skuNums = sku[j].totalNums                        
                        element.totalNums += sku[j].totalNums
                    }
                    element.freightFee = element.totalFreightFee
                    element.skuList = element.poSkuDetailInfoVos 
                    element.totalMoneys = parseInt(element.purchaseTotalMoney) + parseInt(element.totalFreightFee)                                                           
                    purchaseOrderInfoVos.push(element)
                }
            } 
            common.previewNeed(common.isdev() + collectionApi.requirement.generatePdfReport,{
            "jrxmlJson": purchaseOrderInfoVos,
            "jrxmlCode": "PoPrintTemplate"
            });
        },
        //更新供应商
        optionalSupplier(value){
            const _this = this;
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    const element = value[key];
                    element.value = element.supplierCode
                    element.text = element.supplierName
                }
            }
            _this.supplier = value
        },
        //更新商品
        setSkuList(value){
            const _this = this;
            _this.supplierCodeState = null
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    const element1 = value[key];                                                
                    if(_this.skuList[key]){
                        for (const key1 in element1.skuMap) {
                            if (element1.skuMap.hasOwnProperty(key1)) {
                                const element = element1.skuMap[key1];
                                _this.$set(_this.skuList[key].poSkuDetailInfoVos,_this.skuList[key].poSkuDetailInfoVos.length,element)
                            }
                        }
                    }else{
                        api.ordinalInfo.getSequenceList({
                            'serviceCode': config.seqCode.PO,
                            'getNums': 1
                        },(res) => {
                            if(res.data.message == 'success'){
                                let SEQ = res.data.obj
                                    element1.poSkuDetailInfoVos = []
                                    element1.orderNo = SEQ[0]
                                    element1.orderType = 1
                                    element1.purchaseTypeCode = "REFD2000186"
                                    element1.orderStatus = 0    
                                    element1.contactAddress = ""
                                    element1.invoiceTitle = ""                              
                                    _this.$set(element1,'totalFreightFee',0)
                                    api.getEntrepot({
                                        storeCodeSet: [element1.storeCode]
                                    }, function(res) {
                                        if (res.data.code === "success") {
                                        const array = res.data.obj;
                                        const arr = [];
                                        for (var i = 0; i < array.length; i++) {
                                            array[i].text = array[i].warehouseName
                                            array[i].value = array[i].warehouseCode                                    
                                        }
                                        _this.$set(element1,'entreList',array)
                                        for (const key in element1.skuMap) {
                                        if (element1.skuMap.hasOwnProperty(key)) {
                                                const element = element1.skuMap[key];
                                                _this.$set(element1.poSkuDetailInfoVos,element1.poSkuDetailInfoVos.length,element)
                                            }
                                        }
                                         _this.$set(_this.skuList,element1.storeCode,element1)   
                                        }
                                    }); 
                                    
                            }
                        })
                    }
                }
            }
        },
        //生成采购单
        insertPurchaseOrderAndPoSkuInfo(){
            const _this = this;
            let detailIds = []
            let purchaseOrderInfoVos = []
            for (const key in _this.skuList) {
                if (_this.skuList.hasOwnProperty(key)) {
                    const element = _this.skuList[key];
                    const sku = element.poSkuDetailInfoVos;  
                    element.totalMoney = 0       
                    element.totalNums = 0    
                    if(element.totalFreightFee < 0){
                        MessageBox.confirm('运费不能小于0，请填写正确的运费！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                        }).catch(() => {
                        });
                        return;
                    }
                    element.supplierCode = _this.supplierCode
                    for (let j = 0; j < sku.length; j++) {
                        element.totalMoney += sku[j].totalMoneyTax
                        sku[j].skuNums = sku[j].totalNums                        
                        element.totalNums += sku[j].totalNums
                        detailIds = detailIds.concat(sku[j].ids)
                    }
                    purchaseOrderInfoVos.push(element)
                }
            }
                let obj1 = {
                    "detailIds": detailIds,
                    "prOrderDetailStatus": 1,
                    "purchaseOrderInfoVos": purchaseOrderInfoVos
                    }
                api.requirement.operatorRequirementInfo(obj1,(msg)=>{
                    if(msg.data.message == 'success'){
                        Message({
                            type: 'success',
                            message: '生成采购单成功！'
                        });
                        _this.$router.push({
                            name:"require-goods"
                        })
                    }
                })
        },
        //获取发票抬头
        getSupplierInfo(value){
            const _this = this;
            api.supplier.getSupplierInfo({
                supplierCode: value
            }, msg => {
                if(msg.data.message == 'success'){
                    let arr = msg.data.obj.supplierInvoiceInfoList
                    // for (let i = 0; i < arr.length; i++) {
                    //     const element = arr[i];
                    //     element.value = element.invoiceTitle
                    //     element.text = element.invoiceTitle                        
                    // }
                    _this.supplierDetailInfo = msg.data.obj
                    // _this.invoiceTitleList = arr
                }    
            })
            for (const key in _this.skuList) {
                if (_this.skuList.hasOwnProperty(key)) {
                    const element1 = _this.skuList[key].poSkuDetailInfoVos;
                    for (let index = 0; index < element1.length; index++) {
                        const element2 = element1[index];
                        _this.$set(element2,'purchaseFee',element2.purchaseMap[value].purchaseFee)  
                        _this.$set(element2,'purchaseRate',element2.purchaseMap[value].purchaseRate)  
                        _this.$set(element2,'totalMoneyTax',element2.purchaseMap[value].purchaseFee * element2.totalNums)
                    }
                }
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
</style>

