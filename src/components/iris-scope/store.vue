<template lang="html">
    <div>
        <div class="card card-inverse">
            <div class="card-block">
                <div class="row mt-3">
                    <div class="col-6">
                        <div class="border">
                            <div class="tabBodyScroll">
                                <Tree :expand-on-click-node=false :highlight-current=true :props="props" :load="loadNodeSales" lazy empty-text="暂无数据" node-key='value' @current-change="currentchange">
                                </Tree>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 pb-3">
                        <div class="border pt-3">
                            <!-- <div class="col-md-12 col-lg-12">
                                <b-form-fieldset horizontal label="销售区域" :label-cols="4" class="text-right">
                                    <div class="text-left mt-2">
                                        <el-tag
                                        class="ml-2 mb-2"                                        
                                        v-for="tag in options"
                                        :key="tag.code"
                                        :closable="true"
                                        type="primary"
                                        @close="handleClose(tag)">
                                        {{tag.name}}
                                        </el-tag>
                                    </div>
                                    <b-form-input v-if="!multipleSelection" :state="status.checkTree" v-model="checkTree.name" disabled></b-form-input>                        
                                </b-form-fieldset> 
                            </div> -->
                            <div class="col-md-12 col-lg-12">
                                <b-form-fieldset horizontal label="经销商店" :label-cols="4" class="text-right">
                                    <el-select style="width:308px;" v-if="multipleSelection" size="large" :class="{'allot-error':status.checkTree}" no-data-text="请选择经销商门店" v-model="storeCheckList" multiple placeholder="请选择经销商门店">
                                        <el-option
                                        v-for="(item,index) in storeList"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code">
                                        </el-option>
                                    </el-select>
                                     <b-form-select v-if="!multipleSelection" :state="status.storeCode" v-model="storeCode" size="15" :options="storeList"></b-form-select>                                                                           
                                </b-form-fieldset> 
                            </div>
                            <div class="col-md-12 col-lg-12" v-for="(item , index) in COMadditionalSelect">
                                <b-form-fieldset horizontal :label="item.name" :label-cols="4" class="text-right">
                                     <b-form-select size="15" v-model="item.value" @input="selectClick(item)" :options="item.option"></b-form-select>                                                                           
                                </b-form-fieldset> 
                            </div>
                            <div class="col-md-12 col-lg-12" v-for="(item , index) in COMadditionalInput">
                                <b-form-fieldset horizontal :label="item.name" :label-cols="4" class="text-right">
                                    <b-form-input  v-model="item.value"></b-form-input>                                                            
                                </b-form-fieldset> 
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col-md-12 col-lg-12">
                        <div class="pull-right">
                            <b-button size="sm"  variant="default" @click="cancel">取消</b-button>                                                    
                            <b-button size="sm"  variant="primary" @click="addScope">添加适用范围</b-button>                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import api from 'common/api'
import common from 'common/common'
import config from 'common/config'
import { MessageBox, Tree , Tag, Message} from 'element-ui'
Vue.use(Tag);
export default {
    components:{
        Tree
    },
    props: {
        storeInfoVo:{
            type: Object,
            default: function(){
                return {}
            }
        },
        availableType:{
            type: String,
            default: null
        },
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
        }
    },
    computed:{
        COMadditionalSelect:function(){
            const _this = this;
            return _this.additionalSelect
        },
        COMadditionalInput:function(){
            const _this = this;
            return _this.additionalInput
        },
    },
    data() {
        return {
            props: {
                label: 'name',
                children: 'zones',
            },
            checkTree:{},//选中点销售区域
            status:{
                checkTree:null,
                storeCode:null
            },
            storeCode:null,
            storeList:[],//门店列表
            checkTreeList:[],//选中点销售区域   
            storeCheckList:[],//选中单门店         
            options:[],//多选框的数据
        }
    },
    methods: {
        handleClose(value){
            const _this = this;
            for (let index = 0; index < _this.options.length; index++) {
                const element = _this.options[index];
                if(element.code == value.code){
                    _this.options.splice(index,1)
                }
            }
            _this.StoreModelChange()
        },
        //加载子树节点的函数
        loadNodeSales(node, resolve) {
            if (node.level === 0) {
                if (this.availableType === '1' || this.availableType === '2') {
                    api.getSalesAreaInfoByUserAvailableAllLevel((msg) => {
                        if (msg.data.message == "success" && msg.data.obj.length != 0) {
                            return resolve([{
                                name: msg.data.obj[0].areaName || "",
                                code: msg.data.obj[0].areaCode || "",
                            }]);
                        }
                    })
                }
            return;
            }
            this.getTareaTree(node.data.code, (msg) => {
            //获取子集
            let data = msg.data.obj.salesAreaSubInfo || 0
            let arr = [];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                arr[i] = {
                    name: data[i].areaName,
                    code: data[i].areaCode
                }
                }
                return resolve(arr);
            }
            return resolve([])
            })
        },
        selectClick(item){
            const _this = this;
            let value = item.value;
            let option = item.option;
            for (var i = 0; i < option.length; i++) {
                if(option[i].value == value){
                    _this.$set(item, 'checkItem', option[i])
                }
            }
        },
        currentchange(a) {
            const _this = this;
            if(_this.multipleSelection){
                for (let index = 0; index < _this.options.length; index++) {
                    const element = _this.options[index];
                    if(element.code == a.code){
                        return;
                    }
                }
                _this.options = [a]
                _this.StoreModelChange()              
                // _this.$set(_this.checkTreeList,_this.checkTreeList.length,a.code)                
            }else{
                _this.checkTree = a
                api.finance.queryShopInfo({
                    salesAreaCodes: [a.code],
                    needPageFlag: "0"
                }, (msg)=>{
                    if(msg.data.message == 'success'){
                        let data = msg.data.obj
                        for (let i = 0; i < data.length; i++) {
                            const element = data[i];
                            _this.$set(_this.storeList, _this.storeList.length ,{
                                text:element.storeName,
                                value:element.storeCode
                            })
                        }
                    }
                })
            }
            
        },
        getTareaTree(code, sc) {
        api.area.getSalesAreaInfoByAreaCode({
            areaCode: code
        }, sc)
        },
        addScope(){
            const _this = this;
            if(_this.multipleSelection){
                if(_this.storeCheckList.length == 0){
                    _this.status.checkTree = 'invalid' 
                    Message({
                        type: 'warning',
                        message: "请选择经销商门店！"
                    });
                    return;   
                }
                let storeCheckList = []
                for (let index = 0; index < _this.storeCheckList.length; index++) {
                    let element = _this.storeCheckList[index];
                    for (let j = 0; j < _this.storeList.length; j++) {
                        let element1 = _this.storeList[j];
                        if(element == element1.code){
                            element1.additionalSelect = _this.COMadditionalSelect 
                            element1.COMadditionalInput = _this.COMadditionalInput 
                            storeCheckList[index] = element1
                        }
                    }
                }
                _this.$emit("store-ok",storeCheckList)
            }else{
                const _this = this;
                const salesArea = JSON.stringify(_this.checkTree)
                if(_this.storeCode == null){
                    _this.status.storeCode = 'invalid' 
                }
                if(salesArea == '{}'){
                    _this.status.checkTree = 'invalid'
                }
                if((_this.storeCode == null) || salesArea == '{}'){
                    return;
                }
                _this.checkTree.additionalSelect = _this.COMadditionalSelect 
                _this.checkTree.COMadditionalInput = _this.COMadditionalInput 
                for (let index = 0; index < _this.storeList.length; index++) {
                    const element = _this.storeList[index];
                    if(_this.storeCode == element.value){
                        _this.checkTree.store = element
                    }
                }                                     
                _this.$emit("store-ok",_this.checkTree)
            }
                                
        },
        cancel(){
            const _this = this;
            _this.$emit('cancel')
        },
        //销售区域改变的时候
        StoreModelChange(){
            const _this = this;
            _this.storeList = []
            let checkTreeList = []
            for (let index = 0; index < _this.options.length; index++) {
                const element = _this.options[index];
                checkTreeList.push(element.code)
            }
            if(checkTreeList.length !== 0){
                api.finance.queryShopInfo({
                    salesAreaCodes: checkTreeList,
                    needPageFlag: "0"
                }, (msg)=>{
                    if(msg.data.message == 'success'){
                        let data = msg.data.obj
                        for (let i = 0; i < data.length; i++) {
                            const element = data[i];
                            _this.$set(_this.storeList, _this.storeList.length ,{
                                name:element.storeName,
                                code:element.storeCode
                            })
                        }
                        for (let index = 0; index < _this.storeCheckList.length; index++) {
                            const element = _this.storeCheckList[index];
                            for (let index1 = 0; index1 < _this.storeList.length; index1++) {
                                const element1 = _this.storeList[index1];
                                if(element == element1.code){
                                    break;
                                }
                                if(index1 == _this.storeList.length-1){
                                    _this.storeCheckList.splice(index,1)
                                }
                            }
                        }
                    }
                })
            }
        }
    },
    watch:{
        storeInfoVo:function(){
            const _this = this;
            // 获取经销商店
        }
    },
    mounted(){
        const _this = this;
        if((JSON.stringify(_this.storeInfoVo) != "{}")){
            _this.storeList = [{name:_this.storeInfoVo.storeName,code:_this.storeInfoVo.storeCode}]
            _this.storeCheckList = [_this.storeInfoVo.storeCode]
            _this.options = [{
                code:_this.storeInfoVo.salesCode,
                name:_this.storeInfoVo.salesName
            }]
        }
    }
}
</script>

<style lang="css">
    .tabBodyScroll {
        height: 250px;
        overflow: auto;
        overflow-x: hidden;
    }
    .white {
        color: #fff;
    }
    .border {
        border: 2px solid #ccc;
    }
    .allot-error input{
        border-color: #f86c6b !important;
    }
</style>
