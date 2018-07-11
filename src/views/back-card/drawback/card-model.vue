<template>
    <b-modal id="model" ref="myModalRef" :title="`操作人：`" @ok="sumit" size="lg" ok-title="保存"  cancel-title="取消">
        <div class="row">
            <div class="col-md-12 col-lg-12">
                <div class="cardModelLine">
                    <span>模板编号: </span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>模板创建人: </span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <b-form-fieldset horizontal label="区域/门店" :label-cols="4" class="text-right">
                    <AreaTree @select-change="selectedfun" ref="area" :storeAll='true'></AreaTree>                                                            
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="操作人" :label-cols="4" class="text-right">
                    <b-form-input></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="操作方" :label-cols="4" class="text-right">
                    <b-form-input></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="客户姓名" :label-cols="4" class="text-right">
                    <b-form-input></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="联系方式" :label-cols="4" class="text-right">
                    <b-form-input></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="卡内剩余金额" :label-cols="4" class="text-right">
                    <b-form-input></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="本次退款金额" :label-cols="4" class="text-right">
                    <b-form-input></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="实退人" :label-cols="4" class="text-right">
                    <b-form-input></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="手机号" :label-cols="4" class="text-right">
                    <b-form-input></b-form-input>                
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="固话好" :label-cols="4" class="text-right">
                    <b-form-input></b-form-input>                
                </b-form-fieldset>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-12 col-lg-12">
                <div class="cardModelLine">
                    <span>退款说明*</span>&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>
            <div class="col-md-8 col-lg-8">
                <b-form-textarea id="textarea1"
                    :rows="3" 
                    :max-rows="6">
                </b-form-textarea>
             </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-12 col-lg-12">
                <div class="cardModelLine">
                    <span>备注</span>&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
            </div>
            <div class="col-md-8 col-lg-8">
                <b-form-textarea id="textarea1"
                    :rows="3"
                    :max-rows="6">
                </b-form-textarea>
             </div>
        </div>
  </b-modal>
</template>
<script>
import Vue from 'vue'
import api from "common/api";
import config from "common/config";   
import {Message, MessageBox, Input, DatePicker, Table ,TableColumn ,} from "element-ui";
import AreaTree from 'components/iris-areaqueryshop/index'
Vue.use(Input)
Vue.use(DatePicker)
Vue.use(Table)
Vue.use(TableColumn)
export default {
    components: {
        AreaTree    
    },
    props: {
        
    },
    data() {
        return {
            vocational:[{
                text:'结算',
                value:0,                
            },{
                text:'已售',
                value:1,                
            },{
                text:'未售',
                value:2,                
            }],
            validityTermType:[{
                text:"固定时长",
                value:0
            },{
                text:"有效期限",
                value:1
            }],
            userTypeList:[{
                text:'计次',
                value:'Metering'
            },{
                text:'储值',
                value:'StoredValue'
            }],
            carTypeList:[{
                text:"车主卡",
                value:'CRecorder'
            },{
                text:"车辆卡",
                value:'VehicleCard'
            }],
            tableList:[]
        }
    },
    methods: {
        getColumnW(headStr) {
            return (headStr.length) * this.columW +36;
        },
        show(){
            const _this = this 
            _this.$refs.myModalRef.show()       
        },
        sumit(){
            const _this = this 
        },
        //区域选择门店
        selectedfun(data, data1) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            if(data1 instanceof Array){
                // _this.queryParams.storeCodes = []
                for (let i = 0; i < data1.length; i++) {
                    // _this.$set(_this.queryParams.storeCodes, i, data1[i].value)              
                }
            }else{
                options.storeCodeSet.push(data1.value);
                // _this.queryParams.storeCodes = [data1.value]
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
    .cardModelLine {
        /* border-bottom: 1px solid #ccc; */
        padding-bottom: 20px;
        /* margin-bottom: 20px; */
    }
</style>

