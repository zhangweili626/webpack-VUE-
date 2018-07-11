<template>
    <div>
        <b-card class="mt-0 mb-0" header="新增适用范围">
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="适用范围类型" :label-cols="4" class="text-right">
                        <b-form-select @input="affirm" v-model="scopeTypeValue" :options="scopeType" class="mb-3"></b-form-select>                       
                    </b-form-fieldset> 
                </div>
            </div>            
        </b-card>
        <!-- 销售区域 -->
        <div v-if="scopeTypeShow == 1"> 
            <salesarea  :multipleSelection="multipleSelection" @cancel="cancel" :availableType="availableType" :additionalInput="additionalInput" :additionalSelect="additionalSelect" @area-ok="areaOk"></salesarea>
        </div>
        <!-- 经销商店 -->
        <div v-if="scopeTypeShow == 2">
            <store :storeInfoVo="storeInfoVo" :multipleSelection="multipleSelection" @cancel="cancel" :availableType="availableType" :additionalInput="additionalInput" :additionalSelect="additionalSelect" @store-ok="storeOk"></store>            
        </div>
        <!-- 行政区域 -->
        <div v-if="scopeTypeShow == 3">
            <chinaarea :multipleSelection="multipleSelection" @cancel="cancel" :availableType="availableType" :additionalInput="additionalInput" :additionalSelect="additionalSelect" @chinaarea-ok="chinaareaOk"></chinaarea>               
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import api from 'common/api'
    import common from 'common/common'
    import config from 'common/config'
    import salesarea from './../iris-scope/area'
    import chinaarea from './../iris-scope/chinaarea'
    import store from './store'
    import { MessageBox, Message, Tree , Select, Option } from 'element-ui'
    Vue.use(Select);
    Vue.use(Option);
    export default {
        components:{
            salesarea,
            chinaarea,
            store
        },
        props: {
            additionalSelect:{
                type:Object,
                default:function(){
                    return {}
                }
            },
            additionalInput:{
                type:Object,
                default:function(){
                    return {}
                }
            },
            multipleSelection:{
                type:Boolean,
                default: false
            },
            addscope:{
                type:Function,
                default:function(){
                    return function(){

                    }
                }
            }
        },
        data() {
            return {
                scopeTypeValue: '',
                scopeType: [],
                availableType: '',
                scopeTypeShow:'',
                // tableShow: true,
                storeInfoVo: {}
            }
        },
        methods: {
            //返回列表页
            cancel(){
                const _this = this;
                // _this.tableShow = true
                _this.scopeTypeShow = null   
                _this.scopeTypeValue = null  
                // _this.$refs.modal.hide()           
            },
            // 
            affirm(){
                const _this = this;
                if(_this.scopeTypeValue == config.scopeType.sales){
                    _this.scopeTypeShow = 1
                }
                if(_this.scopeTypeValue == config.scopeType.shop){
                    _this.scopeTypeShow = 2
                }
                if(_this.scopeTypeValue == config.scopeType.government){
                    _this.scopeTypeShow = 3
                }
            },
            //销售区域选择完成
            areaOk(data){
                const _this = this;
                _this.addscope(config.scopeType.sales, data)
            },
            //行政区域选择完成
            chinaareaOk(data){
                const _this = this;
                _this.addscope(config.scopeType.government, data)
            },
            //门店数据选择完成
            storeOk(data){
                const _this = this;
                _this.addscope(config.scopeType.shop, data)
            },
        },
        created(){
            const _this = this;
            api.getUserAvailableInfo((msg) => {
                if (msg.data.message === 'success') {
                _this.availableType = msg.data.obj.availableType
                if(_this.availableType == 0){
                    _this.storeInfoVo = {
                        storeCode:msg.data.obj.storeInfoVo ? msg.data.obj.storeInfoVo.storeCode : '',
                        storeName:msg.data.obj.storeInfoVo ? msg.data.obj.storeInfoVo.storeName : '',
                        salesCode:msg.data.obj.storeInfoVo ? msg.data.obj.storeInfoVo.salesCode : '',
                        salesName:msg.data.obj.storeInfoVo ? msg.data.obj.storeInfoVo.salesName : '',
                    }
                    console.log('测试数据')
                    console.log(_this.storeInfoVo)
                }
                api.menu.getReferenceInfo({
                        refCode: config.scope
                    }, (msg) => {
                        let list = msg.data.obj.referenceDetailInfos
                        _this.scopeType = [{
                                value: '请选择类型',
                                text: '请选择类型'
                            }]
                        for (var j = 0; j < list.length; j++) {
                            if ((_this.availableType == 0) && (list[j].refDetailCode == config.scopeType.sales)) {
                                list.splice(j, 1)
                            }
                            _this.$set(_this.scopeType, j+1, {
                                value: list[j].refDetailCode,
                                text: list[j].refDetailName
                            })
                        }
                    })
                }
            })
        }
    }
</script>
<style>

</style>


