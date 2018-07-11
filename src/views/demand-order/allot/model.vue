<template>
    <b-modal :hide-footer="true" id="model" ref="myModalRef" size="lg" ok-title="确定"  cancel-title="取消">
        <div class="row">
            <div class="col-md-6">
                <b-form-fieldset horizontal label="调入门店*" :label-cols="4" class="text-right">
                    <b-form-input :value="inInfo.inStoreName" disabled/>
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="调入地址*" :label-cols="4" class="text-right">
                    <b-form-input :value="inInfo.inWhName" disabled/>                    
                </b-form-fieldset>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="pull-left">
                    <b-button size="sm" variant="primary" @click="cancel">返回添加</b-button>
                    <b-button size="sm" variant="primary" @click="deletereq">删除</b-button>                    
                    <b-button size="sm" variant="primary" @click="preview">生成调拨单</b-button>
                </div>
            </div>
        </div> 
        <div class="controlSpecialLine">
            <div class="table-scrollable" v-for="(item, index) in requisitionData" :key="index">
                <div class="row mb-2" >
                    <div class="col-md-12 mt-2">
                        <b-badge variant="light">调拨单号：{{item.transferOutOrderNo}}</b-badge>
                        <b-badge variant="light">调出门店／仓库：{{item.outStoreName}}／{{item.outWarehouseAddress}}</b-badge>                    
                    </div>
                </div>
                <b-table striped hover bordered show-empty :items="item.transferOutSkuDetailInfoVoList" :fields="fields">
                    <template slot="index" slot-scope="data">
                        <input type="radio" name="radio"  v-model="selCont" :value="data.item"/>                    
                    </template>
                    <template slot="skuCode" slot-scope="data">
                        {{data.item.skuCode}}
                    </template>
                    <template slot="skuName" slot-scope="data">
                        {{data.item.skuName}}
                    </template>
                    <template slot="totalNums" slot-scope="data">
                        {{data.item.outNums}}
                    </template>
                    <template slot="checkUnitName" slot-scope="data">
                        {{data.item.checkUnitName}}
                    </template>
                    <template slot="empty">
                        暂无数据...                  
                    </template>
                </b-table>
            </div>
        </div>
    </b-modal>
</template>
<script>
import api from "common/api";
import config from "common/config";   
import { DatePicker, Message} from "element-ui";
import areaqueryshop from "components/iris-areaqueryshop/";
export default {
    components: {
       areaqueryshop        
    },
    data() {
        return {
            selCont:{},
            skuList:[],//商品列表
            fields:{
                index:{
                    label: "选择"
                },
                skuCode:{
                    label: "商品编码"
                },
                skuName:{
                    label: "商品名称"                        
                },
                totalNums: {
                    label: "调出数量"                                                                
                },
                checkUnitName: {
                    label: "核算单位"                                            
                },
            },
            firstRequisitionData:{},//第一条调拨单
            requisitionData:{},//调拨单列表
            inInfo:{},//调入信息
        }
    },
    methods: {
        //显示
        show(){
            const _this = this 
            _this.$refs.myModalRef.show()       
        },
        //显示之前
        showmodal(){
            const _this = this;
            if(!(JSON.stringify(_this.requisitionData)=='{}')){
                _this.$refs.myModalRef.show()                                    
            }
        },
        //返回添加
        cancel(){
            const _this = this 
            _this.$refs.myModalRef.hide()       
        },
        preview(){
            const _this = this;
                let detailIds = []
                let requisitionData = []
                for (const key in _this.requisitionData) {
                    if (_this.requisitionData.hasOwnProperty(key)) {
                        const element = _this.requisitionData[key];
                        element.inWhCode=_this.inInfo.inWhCode
                        element.inStoreName=_this.inInfo.inStoreName
                        element.inStoreCode=_this.inInfo.inStoreCode
                        if(element.transferOutSkuDetailInfoVoList.length == 0){
                            Message({
                                type: 'error',
                                message: '调拨单明细不能为空！'
                            })
                            return;
                        }
                        detailIds = detailIds.concat(element.detailIds)         
                        requisitionData.push(element) 
                    }
                }
                let obj = {
                    prOrderDetailStatus:2,
                    detailIds:detailIds,
                    transferOutOrderInfoVos:requisitionData
                }
                api.requirement.operatorRequirementInfo(obj,(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.$router.push({
                            name:"require-goods"
                        })
                    }
                })
        },
        Requisition(value){
            const _this = this;
            _this.inInfo = value
        },
        firstRequisition(value, inInfo){
            const _this = this;
            if(!_this.requisitionData[value.outWhCode]){
                api.ordinalInfo.getSequence({
                    serviceCode: 'TRANSFEROUTORDERSEQ'                    
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        api.ordinalInfo.getSequence({
                        serviceCode: 'TRANSFEROUTSKUDETAILSEQ'                    
                        },(res)=>{
                            value.transferOutDetailCode = res.data.obj
                            value.transferOutOrderNo = msg.data.obj
                            _this.$set(_this.requisitionData,value.outWhCode,{
                                transferOutSkuDetailInfoVoList:[value],
                                // inWhCode:inInfo.whCode,       
                                // inStoreName:inInfo.storeName,
                                // inStoreCode:inInfo.storeCode,                                
                                outStoreCode:value.outStoreCode,
                                outStoreName:value.outStoreName,
                                outWarehouseAddress:value.outWarehouseAddress, 
                                outWhCode:value.outWhCode,         
                                detailIds:value.detailIds,                                                                                            
                                transferOutOrderNo:msg.data.obj,
                                transferSkuType:1,
                                transferType:0,
                            })
                        })
                    }
                })
            }else{
                api.ordinalInfo.getSequence({
                    serviceCode: 'TRANSFEROUTSKUDETAILSEQ'                    
                },(res)=>{
                    value.transferOutDetailCode = res.data.obj
                    value.transferOutOrderNo = _this.requisitionData[value.outWhCode].transferOutOrderNo
                    _this.$set(_this.requisitionData[value.outWhCode].transferOutSkuDetailInfoVoList,_this.requisitionData[value.outWhCode].transferOutSkuDetailInfoVoList.length,value)
                })
            }
             _this.$emit('delete-sku',value.skuCode)            
        },
        //删除商品
        deletereq(){
            const _this = this;
            if(_this.requisitionData.length == 0){
                return;
            }
            if(JSON.stringify(_this.selCont) == "{}"){
                Message({
                    type: 'warning',
                    message: '请选择数据！'
                });
            }else{
                for (const key in _this.requisitionData) {
                    if (_this.requisitionData.hasOwnProperty(key)) {
                        const element = _this.requisitionData[key].transferOutSkuDetailInfoVoList;
                        for (let j = 0; j < element.length; j++) {
                            if(element[j].skuCode==_this.selCont.skuCode){
                                _this.$emit('recover-sku',element[j])
                                element.splice(j,1)
                                if(element.length == 0){
                                    delete this.requisitionData[key]
                                    if(this.requisitionData.length == 0){
                                        _this.$emit('resetting')
                                    }
                                }
                            }                        
                        }
                    }
                }
            }
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
    .controlSpecialLine>.table-scrollable {
        margin-top: 60px;
    }
    .controlSpecialLine>.table-scrollable:first-child {
        margin-top: 10px;
    }
    /* .controlSpecialLine:first-child {
        margin-top: 0px !important;
    } */
</style>

