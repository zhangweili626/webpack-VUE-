<template>
    <b-modal id="model" ref="myModalRef" @ok="sumit" size="lg" ok-title="添加"  cancel-title="取消">
        <div class="row">
            <div class="col-md-6">
                <b-form-fieldset horizontal label="选择添加类型*" :label-cols="4" class="text-right">
                    <b-form-select v-model="params.detailType" :options="detailTypeList"></b-form-select>                
                </b-form-fieldset>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 col-lg-6">
                <b-form-fieldset horizontal label="折扣类型*" :label-cols="4" class="text-right">
                    <b-form-select v-model="params.discountType" :options="discountTypeList"></b-form-select>                
                </b-form-fieldset>
            </div>
            <div class="col-md-6 col-lg-6">
                <b-form-fieldset horizontal label="" label-text-align="left" :label-cols="2">
                    <div class="row">
                        <div class="col-md-10">
                            <b-form-input type="number" :state="state.discountValue" v-model="params.discountValue" min="0" /> 
                        </div>
                        <div class="pt-1">
                            元
                        </div>
                    </div>
                </b-form-fieldset>
            </div>
        </div>
    </b-modal>
</template>
<script>
import api from "common/api";
import config from "common/config";   
import {Message, MessageBox , Tree} from "element-ui";
import search from "components/iris-search/search.vue";
import Tree1 from "views/sku-comb/cateLogTree"
import GoryTree from "views/sku-comb/categoryTree"
import pagination from "components/pagination/pagination.vue";
export default {
    components: {
        search,
        Tree1,
        Tree,
        GoryTree,
        pagination
    },
    props: {
        couponTemplateCode: {
            type: String,
            required: true,
            default: ""
        },
        containerlist:{
            type: Array,
            default: function(){
                return []
            }
        },
    },
    data() {
        return {   
            discountTypeList:[
                {
                    text:"固定金额",
                    value:0
                }
            ],  
            detailTypeList:[
                {
                    text:"全场",
                    value:-1
                }
            ],  
            params:{
                detailType:-1,
                discountType:0,
                discountValue:0
            },
            state:{
                discountValue:null
            }      
        }
    },
    methods: {
        show(){
            const _this = this 
            _this.$refs.myModalRef.show()       
        },
        //点击保存
        sumit(evt){
            const _this = this;
            if(parseFloat(_this.params.discountValue) <= 0){
                _this.state.discountValue = 'invalid'
                evt.preventDefault()
                return;
            }
            api.ordinalInfo.getSequence({
                serviceCode: 'COUPONTEMPLATEDETAILSEQ'
            }, (msg) => {
                if (msg.data.message == 'success') {
                    _this.params.couponTemplateDetailCode = msg.data.obj
                    let obj = {
                        couponTemplateCode: _this.couponTemplateCode,
                        couponTemplateDetailCode: _this.params.couponTemplateDetailCode,
                        detailType: _this.params.detailType,
                        discountType: _this.params.discountType,
                        discountValue: _this.params.discountValue,
                    }
                    api.ticketTemlate.editCouponTemplateDetailInfo([obj],(msg)=>{
                        if(msg.data.message == 'success'){
                            _this.params.discountValue = 0
                            _this.$emit('query',)
                        }
                    })
                }
            })
            
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
</style>

