<template lang="html">
  <div class="scope">
    <div v-if="disabled" class="scope-disabled">

    </div>
    <div>
        <button v-if="!disabled" @click="addScopeBtn" type="button" class="btn btn-success btn-sm mb-2">新增</button>
        <button v-if="!disabled" @click="deletScopeBtn" type="button" class="btn btn-danger btn-sm mb-2">删除</button>
        <table  class="table table-striped table-bordered">
        <thead>
            <tr class="text-left">
                <th>选择</th>                
                <th v-for="(item, index) in fields" :key="index" >{{item.label}}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="val in tablist">
                <td>
                    <input type="radio" :value="val" name="radio"  v-model='index'>
                </td>                
                <td v-for="(item, index) in fields" :key="index">{{val[item.name]}}</td>
            </tr>
        <tr v-if="tablist.length==0">
            <td colspan='13'>暂无数据...</td>
        </tr>
        </tbody>
        </table>
    </div>
    <b-modal id="modalPrevent"
                ref="modal"
                :hide-footer="true">
                <div v-if="!tableShow" style="min-height:530px;">
                    <b-card class="mt-0 mb-0" header="新增范围">
                        <div class="row">
                            <div class="col-md-6 col-lg-6">
                                <b-form-fieldset horizontal label="适用范围类型" :label-cols="4" class="text-right">
                                    <b-form-select @input="affirm" v-model="scopeTypeValue" :options="scopeType" class="mb-3"></b-form-select>                       
                                </b-form-fieldset> 
                            </div>
                        </div>    
                        <div class="row">
                            <div class="col-md-12 col-lg-12">
                                <div class="pull-right">
                                    <!-- <b-button size="sm"  variant="default" @click="cancel">取消</b-button>                                                                                                                          -->
                                    <!-- <b-button size="sm"  variant="primary" @click="affirm">确认</b-button>                         -->
                                </div>
                            </div>
                        </div>         
                    </b-card>
                    <!-- 销售区域 -->
                    <div v-if="scopeTypeShow == 1"> 
                        <salesArea  :multipleSelection="multipleSelection" @cancel="cancel" :availableType="availableType" :additionalInput="additionalInput" :additionalSelect="additionalSelect" @area-ok="areaOk"></salesArea>
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
        </b-modal>
    
  </div>
</template>
<script>
/**
 *    date : 2018-03-28 
 * @author : joly.Pan
 * @prop : 
 * addscope 新增适用范围的钩子 code , data code：适用范围类型编码 config.scopeType  由数据字典配置  data：适用范围数据
 * tablist 列表页数据 示列：[{text:"上海市"，value:"00001"}]
 * additional  附加信息 示列：additional:{
                    qudao:{
                        name:"渠道",
                        code:"qudao",
                        option:[{text:"1",value:"1"},{text:"2",value:"2"},{text:"3",value:"3"},{text:"4",value:"4"}]
                    },
                    gongshi:{
                        name:"工时",
                        code:"gongshi",                        
                        option:[{text:"1",value:"1"},{text:"2",value:"2"},{text:"3",value:"3"},{text:"4",value:"4"}]
                    },
                }
    disabled  只可查看列表不可操作 默认false 可编辑状态
    fields   表头信息 [{label:"表头名",name:"子表对应字段"}]
 * clear   true的话会显示清除按钮
 * multiple-selection true的话会是多选的 如果多选附加信息的功能会失去
 * @event :  checkChange (value) 
 * deletScopeBtn  列表删除触发的事件 返回需要删除的行数据
 */    
import Vue from 'vue'
import api from 'common/api'
import common from 'common/common'
import config from 'common/config'
import salesArea from './area'
import chinaarea from './chinaarea'
import store from './store'
import { MessageBox, Message, Tree , Select, Option } from 'element-ui'
Vue.use(Select);
Vue.use(Option);
export default {
    components:{
        salesArea,
        chinaarea,
        store,
    },
  props: {
      fields:{
        type: Array,
        default: function() {
          return []
        }
      },
      tablist:{
        type: Array,
        default: function() {
          return []
        }
      },
      additionalSelect:{
          type:Object,
          default:function(){
              return {}
          }
      },
      addscope:{
        type:Function,
        default:function(){
          return function(){

          }
        }
      },
      disabled:{
        type: Boolean,
        default: false
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
  },
  data() {
    return {
        tableShow:true,//控制列表页显示与隐藏
        scopeType:[],//使用范围类型
        availableType:null,//权限控制
        scopeTypeValue:null,//适用范围类型值
        scopeTypeShow:null,//显示下面适用范围类型
        index:null,//列表选中的下标
        storeInfoVo:{},
    }
  },
  methods: {
      //分页
    scopePageChange(value){
        const _this = this;
        _this.$emit('page-change',value)
    },
    //新增适用范围
    addScopeBtn(){
        const _this = this;
        _this.tableShow = false
        _this.$refs.modal.show()
    },
    //选好使用范围类型
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
    //返回列表页
    cancel(){
        const _this = this;
        _this.tableShow = true
        _this.scopeTypeShow = null   
        _this.scopeTypeValue = null  
        _this.$refs.modal.hide()           
    },
    //切换页面
    activePage(value){
        const _this = this;
        if(value){
            if(value == config.scopeType.sales){
                _this.scopeTypeShow = 1
            }
            if(value== config.scopeType.shop){
                _this.scopeTypeShow = 2
            }
            if(value == config.scopeType.government){
                _this.scopeTypeShow = 3
            }
        }else{
            _this.tableShow = true
            _this.$refs.modal.hide()    
            _this.scopeTypeValue = null                                 
            _this.scopeTypeShow = null     
        }
       
    },
    //记录列表选中的下标
    checkData(index){
        const _this = this;
        _this.index = index
    },
    //删除
    deletScopeBtn(){
        const _this = this;
        if(_this.index==null){
            Message({
                type: 'warning',
                message: '请选择数据！'
            });
        }else{
            _this.$emit('deletScopeBtn',_this.index)
            _this.index = null    
        }
    }
  }, 
  created(){
      const _this = this;
      api.getUserAvailableInfo((msg) => {
        if (msg.data.message === 'success') {
          _this.availableType = msg.data.obj.availableType
          if(_this.availableType == 0){
            _this.storeInfoVo = {
                storeCode:msg.data.obj.storeInfoVo.storeCode,
                storeName:msg.data.obj.storeInfoVo.storeName,
                salesCode:msg.data.obj.storeInfoVo.salesCode,
                salesName:msg.data.obj.storeInfoVo.salesName,
            }
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

<style lang="css">
.scope{
    position: relative;
}
.scope .modal-dialog {
    max-width: 1100px !important;
}
.scope-disabled{
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
