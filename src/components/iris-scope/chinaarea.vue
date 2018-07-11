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
                            <div class="col-md-12 col-lg-12">
                                <b-form-fieldset horizontal label="行政区域" :label-cols="4" class="text-right">
                                    <!-- <el-select v-if="multipleSelection" size="large" :class="{'allot-error':status.checkTree}" no-data-text="请选择区域" v-model="checkTreeList" multiple placeholder="请选择区域">
                                        <el-option
                                        v-for="(item,index) in options"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code">
                                        </el-option>
                                    </el-select> -->
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
                            </div>
                            <div class="col-md-12 col-lg-12" v-for="(item , index) in COMadditionalSelect">
                                <b-form-fieldset horizontal :label="item.name" :label-cols="4" class="text-right">
                                     <b-form-select v-model="item.value" @change="selectClick(item)" :options="item.option" class="mb-3"></b-form-select>                                                                           
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
import { MessageBox, Tree ,Tag, Message} from 'element-ui'
Vue.use(Tag);
export default {
    components:{
        Tree
    },
    props: {
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
            },
            checkTreeList:[],//选中点销售区域            
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
        },
        //加载子树节点的函数
        loadNodeSales(node, resolve) {
            if (node.level === 0) {
                this.getTareaTree({
                    levels:1
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        let data = msg.data.obj
                        let arr = []
                        for (let i = 0; i < data.length; i++) {
                            const element = data[i];
                            arr[i] = {
                                name: data[i].areaName,
                                code: data[i].areaCode,
                                level:data[i].levels
                            }
                        }
                        return resolve(arr);
                    }
                })
            }else{
                this.getTareaTree({
                    levels:parseInt(node.data.level)+1,
                    fatherAreaCode:node.data.code
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        let data = msg.data.obj
                        let arr = []
                        for (let i = 0; i < data.length; i++) {
                            const element = data[i];
                            arr[i] = {
                                name: data[i].areaName,
                                code: data[i].areaCode,
                                level:data[i].levels
                            }
                        }
                        return resolve(arr);
                    }
                })
            }
    /*         this.getTareaTree(node.data.code, (msg) => {
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
            }) */
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
                _this.$set(_this.options,_this.options.length,a)                
                // _this.$set(_this.checkTreeList,_this.checkTreeList.length,a.code)                
            }else{
                _this.checkTree = a
            }
        },
        getTareaTree(obj, sc) {
           api.chinaarea.querychinaarea(obj, sc)
        },
        addScope(){
            const _this = this;
            if(_this.multipleSelection){
                if(_this.options.length == 0){
                    _this.status.checkTree = 'invalid' 
                    Message({
                        type: 'warning',
                        message: "请选择行政区域！"
                    });
                    // MessageBox.confirm(`请选择销售区域！`, '提示', {
                    //     confirmButtonText: '确定',
                    //     cancelButtonText: '取消',
                    //     type: 'warning'
                    // }).then(() => {
                    // }).catch(() => {
                    // });
                    return;   
                }
                let checkTreeList = []
                for (let j = 0; j < _this.options.length; j++) {
                    let element1 = _this.options[j];
                    element1.additionalInput = _this.COMadditionalInput                               
                    element1.additionalSelect = _this.COMadditionalSelect 
                    checkTreeList[j] = element1
                }
                _this.$emit("chinaarea-ok",checkTreeList)                                
            }else{
                if(JSON.stringify(_this.checkTree) == '{}'){
                    _this.status.checkTree = 'invalid'
                }else{
                    _this.checkTree.additionalInput = _this.COMadditionalInput                               
                    _this.checkTree.additionalSelect = _this.COMadditionalSelect 
                    _this.$emit("chinaarea-ok",_this.checkTree)                
                }
            }
        },
        cancel(){
            const _this = this;
            _this.$emit('cancel')
        }
    },
    created(){
        const _this = this;
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
