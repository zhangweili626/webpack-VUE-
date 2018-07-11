<template>
    <b-modal id="insert" ref="insert" title="新增商品适配" size="lg" @ok="handleOk" ok-title="确定" @shown="showmodal" cancel-title="取消">
        <div class="row">
            <div class="col-md-6">
                <b-form-fieldset horizontal label="品牌" :label-cols="4" class="text-right">
                    <div class="text-left">
                        <search 
                        ref="brandsearch"
                        :hasCheck="status.brandRequired"
                        :dataList="brandDatalist"  
                        option="brandName" 
                        @dataChange="brandQuerySelect"
                        @itemValue="brandItemValue"
                        @clickShowBack="brandFirstLoad"
                        @comScroll="brandComScroll"
                        :disabled="brandIsforbidden"
                        @clearValue="brandClearValue"
                        >
                        </search>
                    </div>
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="分类" :label-cols="4" class="text-right">
                    <div @click="showClassify" class="sku-clear-parant" ref="classify">
                        <b-form-input :state="status.skuCategoryCode" v-model="params.skuCategoryName" readonly/>
                        <div class="sku-clear" v-if="params.skuCategoryName" @click.stop="clear()">x</div>                                                                                        
                    </div>
                    <div class="text-left select-tree" v-show="classifyShowarea">
                        <Tree :data="classifyData" :props="classifyProps" :load="classifyLoad" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="classifyNodeClick">
                        </Tree>
                    </div>
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="原厂编码" :label-cols="4" class="text-right">
                    <b-form-input @change="originalCodeChange" v-model="skuSelectParams.originalCode"></b-form-input>                            
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="商品编码／名称" :label-cols="4" class="text-right">
                          <div class="text-left">
                              <search 
                            ref="skusearch"
                            :hasCheck="status.skurequired"
                            :dataList="skuDatalist"  
                            option="skuName" 
                            @dataChange="skuQuerySelect"
                            @itemValue="skuItemValue"
                            @clickShowBack="skuFirstLoad"
                            @comScroll="skuComScroll"
                            :disabled="skuIsforbidden"
                            @clearValue="skuClearValue"
                            >
                            </search>
                          </div>
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="需要个数" :label-cols="4" class="text-right">
                    <b-form-input type="number" min="0" :state="status.needQty" v-model="params.needQty"></b-form-input>                            
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="备注" label-text-align="right" :label-cols="4">
                    <b-form-textarea v-model="params.remark"  :rows="3"></b-form-textarea>
                </b-form-fieldset>
            </div>
        </div>
    </b-modal>
</template>
<script>
import api from "common/api";
import config from "common/config";   
import search from "components/iris-search/search.vue";
import { Message, Tree} from "element-ui";
export default {
    components: {
        search,
        Tree
    },
    props: {
        serviceCode:{
            type: String,
            default: null  
        },
    },
    data() {
        return {
            params:{
                skuBrandCode:null,
                skuCode:null,
                skuCategoryCode:null,
                skuCategoryName:null,
                needQty:null,
                remark:null
            },   
            status:{
                brandRequired: false,    
                skurequired: false,
                skuCategoryCode:null,
                needQty:null
            },
            skuDatalist:[],
            brandDatalist: [],  
            brandIsforbidden: false,
            skuIsforbidden:false,
            brandSelectParams: {
                pageNums: config.pageNums,
                pageStart: 1,
            },
            skuSelectParams: {
                pageNums: config.pageNums,
                pageStart: 1,
                skuType: 'goodsTypeGood',
                onOffFlag:1,
            },       
            classifyData:[], 
            classifyProps:{
                children: 'children',
                label: 'categoryName'
            },
            classifyShowarea:false,                                                 
        }
    },
    mounted() {
    
  },
    methods: {
         //下拉框清除事件 
        clear(){
            const _this = this
            _this.params.skuCategoryName = null
            _this.params.skuCategoryCode = null            
        },
        //点击商品分类input
        showClassify(){
            const _this = this;
            _this.classifyShowarea = !_this.classifyShowarea
        },
        //商品分类树节点被点击的时候
        classifyNodeClick(data){
            const _this = this;
            _this.params.skuCategoryName = data.categoryName
            _this.params.skuCategoryCode = data.categoryCode 
            _this.$refs.skusearch.setValue()              
            _this.params.skuCode = null  
            _this.params.skuBrandCode = null               
            _this.$refs.brandsearch.setValue()
            _this.classifyShowarea = false         
        },
        //加载商品分类树
        classifyLoad(node, resolve){
            const _this = this;
            if(node.level == 0){
                api.checkPlan.getSkuCategoryInfoBycategoryCode({
                    categoryCode:"000001"
                }).then((msg)=>{
                    if(msg.data.message == 'success'){
                        resolve(msg.data.obj.skuCategorySubInfo || [])
                    }
                })
            }else{
                api.checkPlan.getSkuCategoryInfoBycategoryCode({
                    categoryCode:node.data.categoryCode
                }).then((msg)=>{
                    if(msg.data.message == 'success'){
                        resolve(msg.data.obj.skuCategorySubInfo || [])
                    }
                })
            }
        },
        //点击确认的回调
        handleOk(evt) {
            const _this = this;
            if((_this.params.skuBrandCode == null) && (_this.params.skuCategoryCode == null) && (_this.params.skuCode == null)){
                evt.preventDefault()  
                if(_this.params.skuBrandCode == null){
                    _this.status.brandRequired = true
                }
                if(_this.params.skuCategoryCode == null){
                    _this.status.skuCategoryCode = 'invalid'
                }
                if((_this.params.skuCode == null)){
                    _this.status.skurequired = true
                }                    
                return;
            }
            
            if(_this.params.needQty){
                if(_this.params.needQty < 0){
                    _this.status.needQty = 'invalid'
                    evt.preventDefault()                  
                    return;                
                }
                if(String(_this.params.needQty).indexOf(".")>-1){
                    _this.status.needQty = 'invalid'
                    evt.preventDefault()                  
                    return;
                }
            }else{
                _this.params.needQty = 0
            }
            api.ordinalInfo.getSequence({
                serviceCode: config.serviceSkurelationseq                    
            },(msg)=>{
                if(msg.data.message == 'success'){
                    _this.params.relationCode = msg.data.obj
                    _this.params.serviceCode = _this.serviceCode
                    api.serviceSku.editServiceSkuRelationInfo([_this.params],(msg)=>{
                        if(msg.data.message == 'success'){
                            _this.$emit('service-ok',_this.serviceCode)
                             Message({
                                type: 'success',
                                message: "操作成功！"
                            });
                        }
                        _this.params.skuCategoryName = null
                        _this.params.skuCategoryCode = null
                        _this.$refs.skusearch.setValue()              
                        _this.params.skuCode = null  
                        _this.params.skuBrandCode = null               
                        _this.$refs.brandsearch.setValue()
                        _this.params.needQty = null,
                        _this.params.remark = null
                    })
                }
            })
          
        },
        //显示之前
        showmodal() {
            const _this = this;
            _this.status = {
                brandRequired: false,    
                skurequired: false,
                skuCategoryCode:null,
                needQty:null                
            }
            _this.brandSelectParams = {
                pageNums: config.pageNums,
                pageStart: 1,
            }
            _this.skuSelectParams = {
                pageNums: config.pageNums,
                pageStart: 1,
            }
            _this.brandDatalist = []          
            _this.skuDatalist = []              
            if(_this.serviceCode == null){
                _this.$refs.insert.hide()  
                Message({ 
                    type: 'warning', 
                    message: '请选择一条服务！'
                });    
            }
        },
         //品牌下拉框清除事件
        brandClearValue(){
            const _this  = this;
            _this.params.skuBrandCode = ""                
        },
         // 搜索框内值改变   触发搜索
        brandQuerySelect(data) {
            const _this = this;
            _this.brandSelectParams.pageStart = 1;
            _this.brandSelectParams.brandName = data;
            let params = _this.brandSelectParams;
            _this.querySkuBrandInfoForPageByVo(params, function(res) {
                _this.brandDatalist = res.list
            });
        },
         // 选中某一项    
        brandItemValue(value) {
            const _this = this
            _this.params.skuBrandCode = value.brandCode
            _this.params.skuCategoryCode = null
            _this.params.skuCategoryName = ''   
            _this.$refs.skusearch.setValue()              
            _this.params.skuCode = null                                                  
        },
        //原厂编码改变
        originalCodeChange(){
            const _this = this    
            let params = _this.skuSelectParams    
            params.pageStart = 1
            _this.querySku(params, function(res) {
                _this.skuDatalist = res.list
            })
        },
        // 第一次加载数据
        brandFirstLoad() {
            const _this = this
            if(_this.brandDatalist.length != 0 ){
                return 
            }
            let params = _this.brandSelectParams
            _this.querySkuBrandInfoForPageByVo(params, function(res) {
                _this.brandDatalist = res.list
            })
        },
         // 滚动加载
        brandComScroll(isEnd) {
            if (isEnd) {
                this.brandSelectParams.pageStart ++
                let params = this.brandSelectParams;        
                this.querySkuBrandInfoForPageByVo(params, obj => {
                    if(obj.list){
                        this.brandDatalist = this.brandDatalist.concat(obj.list);
                    }
                });
            }
        },
         // 定义向后台请求品牌的方法
        querySkuBrandInfoForPageByVo(params,callback) {
            api.skuInfo.querySkuBrandInfoForPageByVo(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },
        //商品下拉框清除事件
        skuClearValue(){
            const _this  = this;
            _this.params.skuCode = ""                
        },
         // 搜索框内值改变   触发搜索
        skuQuerySelect(data) {
            const _this = this;
            _this.skuSelectParams.pageStart = 1;
            _this.skuSelectParams.skuCodeOrName = data;            
            let params = _this.skuSelectParams;
            _this.querySku(params, function(res) {
                _this.skuDatalist = res.list
            });
        },
         // 选中某一项    
        skuItemValue(value) {
            const _this = this
            _this.params.skuCode = value.skuCode
            _this.params.skuCategoryCode = value.categoryCode
            _this.params.skuCategoryName = value.categoryName
            _this.params.skuBrandCode = value.brandCode                 
            _this.$refs.brandsearch.setValue(value.brandName)                                                                    
        },
        // 第一次加载数据
        skuFirstLoad() {
            const _this = this
            let params = _this.skuSelectParams
            if(_this.skuDatalist.length === 0){
                _this.querySku(params, function(res) {
                    _this.skuDatalist = res.list
                })
            }
        },
         // 滚动加载
        skuComScroll(isEnd) {
            if (isEnd) {
                this.skuSelectParams.pageStart ++
                let params = this.skuSelectParams;        
                this.querySku(params, obj => {
                    if(obj.list){
                        this.skuDatalist = this.skuDatalist.concat(obj.list);
                    }
                });
            }
        },
         // 定义向后台请求商品的方法
        querySku(params,callback) {
            params.skuType = 'goodsTypeGood'                                        
            api.skuData.getInfo(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },
    },
    watch: {
        classifyShowarea(val) {
            document.getElementsByClassName('modal-content')[1].onclick = (e) => {
                let _select = this.$refs.classify;
                if(_select && !_select.contains(e.target))  this.classifyShowarea = false  

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
    .select-tree {
        position: absolute;
        margin-top: 6px;
        width: 100%;
        height: 250px;
        overflow: auto;
        z-index: 1000;
    }
    .anchor {
        font-size: 16px;
        margin-right:10px;
    }
    .sku-clear{
        position: absolute;
        top: 8px;
        right: 9px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        color: #fff;
        text-align: center;
        line-height: 18px;
        cursor: pointer;
    }
    .sku-clear-parant{
        position: relative;
    }
</style>

