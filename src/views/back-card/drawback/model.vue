<template>
    <b-modal id="model" ref="myModalRef" :title="`操作人：`" @ok="sumit" size="lg" ok-title="保存"  cancel-title="取消">
        <div class="row">
            <div class="col-md-6">
                <b-form-fieldset horizontal label="支付方式" :label-cols="4" class="text-right">
                    <b-form-select :options="paylist"></b-form-select>                                            
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="支付金额" :label-cols="4" class="text-right">
                    <el-input type="number" min="0">
                        <template slot="append">元</template>
                    </el-input>
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="交易流水号" :label-cols="4" class="text-right">
                    <b-form-input></b-form-input>                
                </b-form-fieldset>
            </div>
        </div>
    </b-modal>
</template>
<script>
import Vue from 'vue'
import api from "common/api";
import config from "common/config";   
import {Message, MessageBox, Input} from "element-ui";
Vue.use(Input)
export default {
    components: {
               
    },
    props: {
        
    },
    data() {
        return {
            paylist:[{
                text:'支付宝',
                value:1,                
            },{
                text:'支付宝',
                value:1,                
            }]
        }
    },
    methods: {
        show(){
            const _this = this 
            _this.$refs.myModalRef.show()       
        },
        sumit(){
            const _this = this 
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
</style>

