<template>
    <div>
         <b-nav justified>
            <b-nav-item href="#1"><span class="sku-info-anchor">①</span>基本信息</b-nav-item>
            <b-nav-item href="#2"><span class="sku-info-anchor">②</span>车型相关</b-nav-item> 
            <b-nav-item href="#3"><span class="sku-info-anchor">③</span>采购库存</b-nav-item>   
        </b-nav>
        <div class="sku-info-wrap">
         <b-card id="1" header-tag="header" header="基本信息">
                <!-- <div slot="header">
                    <strong>基本信息</strong>
                </div> -->
                <div class="row" >
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="商品名称*" :label-cols="4" class="text-right">
                            <b-form-input :state="status.skuName" v-model="params.skuName"></b-form-input>                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="型号" :label-cols="4" class="text-right">
                            <b-form-input v-model="params.skuModel"></b-form-input>                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="品牌*" :label-cols="4" class="text-right">
                            <div class="text-left">
                                <search 
                                ref="brand"
                                :hasCheck="brandRequired"
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
                        <b-form-fieldset horizontal label="净重" :label-cols="4" class="text-right">
                                <b-form-input v-model="params.netWeight"></b-form-input>                                                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="目录*" :label-cols="4" class="text-right">
                            <div @click="showCatalog" class="sku-clear-parant">
                                <b-form-input :state="status.catlogCode" v-model="params.catlogName" readonly/>
                                <div class="sku-clear" v-if="params.catlogName" @click.stop="clear('catlog')">x</div>
                            </div>
                            <div class="text-left select-tree" v-show="catalogShowarea">
                                <Tree :data="catalogData" :props="catalogProps" :load="catalogLoad" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="catalogNodeClick">
                                </Tree>
                            </div>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="宽" :label-cols="4" class="text-right">
                            <b-form-input v-model="params.skuWeight"></b-form-input>   
                                                                                                       
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="分类*" :label-cols="4" class="text-right">
                            <div @click="showClassify" class="sku-clear-parant">
                                <b-form-input :state="status.categoryCode" v-model="params.categoryName" readonly/>
                                <div class="sku-clear" v-if="params.categoryName" @click.stop="clear('category')">x</div>                                
                            </div>
                            <div class="text-left select-tree" v-show="classifyShowarea">
                                <Tree :data="classifyData" :props="classifyProps" :load="classifyLoad" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="classifyNodeClick">
                                </Tree>
                            </div>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="质保天数" :label-cols="4" class="text-right">
                            <b-form-input v-model="params.warrantyDays"></b-form-input>                               
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="原厂编码" :label-cols="4" class="text-right">
                            <b-form-input  :state="status.originalCode" v-model="params.originalCode"></b-form-input>                                                           
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="产地" :label-cols="4" class="text-right">
                            <div class="text-left">
                                <search 
                                ref="skuArea"
                                :hasCheck="status.skuAreaCode"
                                :dataList="skuAreaDatalist" 
                                option="skuAreaName" 
                                @dataChange="skuAreaQuerySelect"
                                @itemValue="skuAreaCodeItemValue"
                                @clickShowBack="skuAreaCodeFirstLoad"
                                @comScroll="skuAreaCodeComScroll"
                                :disabled="skuAreaCodeIsforbidden"
                                @clearValue="skuAreaCodeClearValue"
                                >
                                </search>
                            </div>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="外部编码" :label-cols="4" class="text-right">
                            <b-form-input :state="status.externalCode" v-model="params.externalCode"></b-form-input>                               
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="规格" :label-cols="4" class="text-right">
                            <b-form-input v-model="params.skuStandards"></b-form-input>                                                           
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="69码" label-text-align="right" :label-cols="4">
                            <b-form-input :state="status.barCode" v-model="params.barCode"></b-form-input>                                                           
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="毛重" label-text-align="right" :label-cols="4">
                            <b-form-input  v-model="params.grossWeight"></b-form-input>                                                           
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="包装类型" label-text-align="right" :label-cols="4">
                            <div class="text-left">
                                <search 
                                ref="pack"
                                :dataList="packDatalist" 
                                option="packName" 
                                @dataChange="packQuerySelect"
                                @itemValue="packItemValue"
                                @clickShowBack="packFirstLoad"
                                @comScroll="packComScroll"
                                :disabled="packIsforbidden"
                                @clearValue="packClearValue"
                                >
                                </search>
                            </div>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="长" label-text-align="right" :label-cols="4">
                            <b-form-input  v-model="params.skuLong"></b-form-input>                                                           
                        </b-form-fieldset>
                    </div>
                    <!-- <div class="col-md-6">
                        <b-form-fieldset horizontal label="销售状态" label-text-align="right" :label-cols="4">
                        </b-form-fieldset>
                    </div> -->
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="高" label-text-align="right" :label-cols="4">
                            <b-form-input  v-model="params.skuHeight"></b-form-input>                                                           
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="上下架状态*" label-text-align="right" :label-cols="4">
                            <b-form-select :state="status.onOffFlag"  v-model="params.onOffFlag" :options="onOffFlagList"/>                        
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="备注" label-text-align="right" :label-cols="4">
                            <b-form-textarea v-model="params.remark"  :rows="5"></b-form-textarea>
                        </b-form-fieldset>
                    </div>
                   <div class="col-md-6">
                        <b-form-fieldset horizontal label="上传大图" label-text-align="right" :label-cols="4">
                          <upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :on-success="bighandleSuccess"
                            :on-remove="bighandleRemove"
                            :file-list="bigfileList"
                            :data="biguploadParams" 
                            :on-error="onError"  
                            :on-preview="onPreview"
						    accept="image/png,image/gif,image/jpg,image/jpeg"                            
                            list-type="picture">
                            <b-button v-if="!disabled" size="small" variant="success">点击上传</b-button>
                            </upload>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="上传中图" label-text-align="right" :label-cols="4">
                          <upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :on-success="midhandleSuccess"
                            :on-remove="midhandleRemove"
                            :file-list="midfileList"
                            :data="miduploadParams"   
                            :on-error="onError"       
                            :on-preview="onPreview"                                                   
						    accept="image/png,image/gif,image/jpg,image/jpeg"                            
                            list-type="picture">
                            <b-button  v-if="!disabled" size="small" variant="success">点击上传</b-button>
                            </upload>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="上传小图" label-text-align="right" :label-cols="4">
                            <upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :on-success="smallhandleSuccess"
                            :on-remove="smallhandleRemove"
                            :file-list="smallfileList"
                            :data="smalluploadParams"  
                            :on-error="onError"   
                            :on-preview="onPreview"                                                        
						    accept="image/png,image/gif,image/jpg,image/jpeg"                            
                            list-type="picture">
                            <b-button v-if="!disabled" size="small" variant="success">点击上传</b-button>
                            </upload>
                        </b-form-fieldset>
                    </div>
                    
                </div>
            </b-card>
            <b-card id="2" header="车型相关">
                <div class="row">
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="是否适配车型*" :label-cols="4" class="text-right">
                            <b-form-select :state="status.matchCarFlag"  v-model="params.matchCarFlag" :options="matchCarFlagList"/>                                                    
                        </b-form-fieldset>
                    </div>
                </div>
            </b-card>
            <b-card id="3" header="采购库存">
                <div class="row" >
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="是否仓库盘点*" :label-cols="4" class="text-right">
                            <b-form-select :state="status.warehouseCheckFlag"  v-model="params.warehouseCheckFlag" :options="matchCarFlagList"/>                                                                                
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="标准成本" :label-cols="4" class="text-right">
                            <b-form-input type="number" :state="status.standardCost" v-model="params.standardCost"></b-form-input>                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="采购单位" :label-cols="4" class="text-right">
                            <b-form-select v-model="params.purchaseUnitCode"  :options="unitList"/>                                
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="核算单位" :label-cols="4" class="text-right">
                            <b-form-select v-model="params.checkUnitCode"  :options="unitList"/>                                                                                        
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6"> 
                        <b-form-fieldset horizontal label="采购转换系数" :label-cols="4" class="text-right">
                            <b-form-input  type="number" :state="status.purchaseToCheckNums" v-model="params.purchaseToCheckNums" @keyup.native="keyUp"></b-form-input>                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="成本计算类型" :label-cols="4" class="text-right">
                            <b-form-select v-model="params.calCostType"  :options="calCostTypeList"/>                                                             
                        </b-form-fieldset>
                    </div>
                </div>
            </b-card>
            <!-- <b-card>
                <div slot="header">
                    <strong>物流信息</strong>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="物流状态" :label-cols="4" class="text-right">
                            <b-form-input ></b-form-input>                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="物流子状态" :label-cols="4" class="text-right">
                            <b-form-input ></b-form-input>                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="锁定冻结状态" :label-cols="4" class="text-right">
                            <b-form-input ></b-form-input>                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="锁定子状态" :label-cols="4" class="text-right">
                            <b-form-input ></b-form-input>                            
                        </b-form-fieldset>
                    </div>
                </div>
            </b-card> -->
             <div class="row mb-3">
                <div class="col-md-12">
                    <div class="pull-right">
                        <!-- <b-button size="sm"  variant="default">批量导入</b-button>                                                 -->
                        <!-- <b-button size="sm"  variant="primary">保存草稿</b-button>                         -->
                        <b-button  v-if="!disabled" size="sm"  variant="primary" @click="submitSkuInfo">提交</b-button>                        
                    </div>
                </div>
            </div>   
            <div class="sku-info-cover" v-if="disabled">
            </div>
        </div>            
    </div>
</template>
<script>
    import { Tree, Upload, Button, Message, MessageBox } from 'element-ui'
    import api from 'common/api'
    import config from 'common/config'
    import common from 'common/common'    
    import search from "components/iris-search/search.vue";
    // Vue.use(Upload);    
    export default {
        components: {
            Tree,
            search,
            Upload,
            Button
        },
        data() {
            return {
                onOffFlagList:[{ 
                     text:"下架",
                    value:0
                    },{ 
                    text:"上架",
                    value:1
                    }
                ],
                matchCarFlagList:[{ 
                    text:"是",
                    value:1
                    },{ 
                    text:"否",
                    value:0
                }],
                uploadUrl: config.uploadUrl,                
                calCostTypeList:[],
                brandRequired: false,
                brandDatalist: [],
                brandIsforbidden: false,     
                selectParams: {
                    pageNums: config.pageNums,
                    pageStart: 1,
                }, 
                skuAreaSelectParams: {
                    pageNums: config.pageNums,
                    pageStart: 1,
                },  
                packSelectParams: {
                    pageNums: config.pageNums,
                    pageStart: 1,
                },  
                params:{
                    skuName:null,
                    brandCode:null,
                    catlogName:null,
                    catlogCode:null,                    
                    categoryName:null,
                    categoryCode:null,
                    warrantyDays:null,
                    originalCode:null,
                    skuAreaCode:null,
                    skuAreaName:null,
                    externalCode:null,
                    skuStandards:null,
                    barCode:null,
                    grossWeight:null,
                    packCode:null,
                    skuLong:null,
                    skuHeight:null,
                    onOffFlag:null,
                    matchCarFlag:null,
                    warehouseCheckFlag:null,
                    bigPic:null,
                    midPic:null,
                    smallPic:null,
                    skuModel:null,
                    netWeight:null,
                    skuWeight:null,
                    standardCost:null,
                    checkUnitCode:null,
                    purchaseUnitCode:null,
                    purchaseToCheckNums: '',
                    calCostType:null,
                    skuType:config.skuInfo.goodsTypeGood,
                    remark:null
                },
                status:{
                    skuName:null,
                    brandCode:null,
                    catlogCode:null,
                    categoryCode:null,
                    originalCode:null,
                    externalCode:null,
                    barCode:null,
                    onOffFlag:null,
                    matchCarFlag:null,
                    warehouseCheckFlag:null,
                    standardCost:null,
                    purchaseToCheckNums:null
                },
                unitList:[],
                catalogShowarea:false,
                catalogData:[],
                classifyData:[],
                catalogProps: {
                    children: 'children',
                    label: 'catlogName'
                },
                classifyProps:{
                    children: 'children',
                    label: 'categoryName'
                },
                classifyShowarea:false,   
                skuAreaDatalist:[],
                skuAreaCodeIsforbidden:false,
                packDatalist:[],
                packIsforbidden:false,
                biguploadParams: {
					relationCode: "",
					singleFlag: 1,
					businessType: 'big'
                },
                bigfileList:[],
                miduploadParams: {
					relationCode: "",
					singleFlag: 1,
					businessType: 'mid'
                },
                midfileList:[],  
                smalluploadParams: {
					relationCode: "",
					singleFlag: 1,
					businessType: 'small'
                },
                smallfileList:[],       
            }
        },
        methods: {
            keyUp() {
                // this.params.purchaseToCheckNums = this.params.purchaseToCheckNums.replace(/\D/g,'')
            },
            //下拉框清除事件 
            clear(value){
                const _this = this
                if(value == 'catlog'){
                    _this.params.catlogCode = null;
                    _this.params.catlogName = null
                }else if(value == 'category'){
                    _this.params.categoryName = null;_this.params.categoryCode = null
                }
            },
            //大图预览
            onPreview(node){
                open(node.url);  
            },
            //上传图片失败            
            onError(){
                Message({
                    type: 'error',
                    message: "上传失败！"
                });
            },
              //小图删除
            smallhandleRemove(file, fileList) {
                const _this = this
                MessageBox.confirm(`确定移除 ${ file.fileOrgName }？`).then(() => {					
					api.accessory.del([file], function (result) {
						let data = result.data;
						if(data.code === 'success') {
                            _this.smallfileList.splice(_this.smallfileList.indexOf(file),1);
                            _this.params.smallPic = file.filePath                                                        
                            Message({
                               type: 'success',
                               message: "操作成功！"
                            });
						}else{
                            _this.smallfileList = [file]
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.smallfileList = [file]					
				});
            },
            //小图上传成功
            smallhandleSuccess(file) {
                const _this = this;
                
                 if(file.message == 'success'){
                    var file = file.obj[0]
                    file.name = file.fileOrgName
                    file.url = common.getUploadUrl() + file.filePath  
                    _this.params.smallPic = file.filePath
                    _this.smallfileList = [file]
                    Message({
                        type: 'success',
                        message: "操作成功！"
                    });
                }else{
                    Message({
                        type: 'error',
                        message: "上传失败！"
                    });
                    _this.smallfileList = []                    
                }
            },
            //中图删除
            midhandleRemove(file, fileList) {
                const _this = this
                MessageBox.confirm(`确定移除 ${ file.fileOrgName }？`).then(() => {					
					api.accessory.del([file], function (result) {
						let data = result.data;
						if(data.code === 'success') {
                            _this.midfileList.splice(_this.midfileList.indexOf(file),1);
                            _this.params.midPic = file.filePath                                                        
                            Message({
                               type: 'success',
                               message: "操作成功！"
                            });
						}else{
                            _this.midfileList = [file]
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.midfileList = [file]					
				});
            },
            //中图上传成功
            midhandleSuccess(file) {
                const _this = this;
                if(file.message == 'success'){
                        var file = file.obj[0]
                    file.name = file.fileOrgName
                    file.url = common.getUploadUrl() + file.filePath  
                    _this.params.midPic = file.filePath
                    _this.midfileList = [file]
                    Message({
                        type: 'success',
                        message: "上传成功！"
                    });
                }else{
                    Message({
                        type: 'error',
                        message: "上传失败！"
                    });
                    _this.midfileList = []                                                         
                }
            },
            //大图删除
            bighandleRemove(file, fileList) {
                const _this = this
                MessageBox.confirm(`确定移除 ${ file.fileOrgName }？`).then(() => {					
					api.accessory.del([file], function (result) {
						let data = result.data;
						if(data.code === 'success') {
                            _this.bigfileList.splice(_this.bigfileList.indexOf(file),1);
                            _this.params.bigPic = file.filePath                                                        
                            Message({
                               type: 'success',
                               message: "操作成功！"
                            });
						}else{
                            _this.bigfileList = [file]
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.bigfileList = [file]					
				});
            },
            //大图上传成功
            bighandleSuccess(file) {
                const _this = this;
               
                if(file.message == 'success'){
                    var file = file.obj[0]
                    file.name = file.fileOrgName
                    file.url = common.getUploadUrl() + file.filePath  
                    _this.params.bigPic = file.filePath
                    _this.bigfileList = [file]
                    Message({
                        type: 'success',
                        message: "操作成功！"
                    });
                }else{
                    Message({
                        type: 'error',
                        message: "上传失败！"
                    });
                    _this.bigfileList = []                    
                }
            },
            bigHandleRemove(file, fileList){
                const _this = this;
                _this.fileList1 = []
                _this.params.bigPic = null                                
            },
            midHandleRemove(){
                const _this = this;
                _this.fileList2 = []
                _this.params.midPic = null                                
            },
            smallHandleRemove(){
                const _this = this;
                _this.fileList3 = []
                _this.params.smallPic = null                
            },
            bigHandlePreview(file) {
                const _this = this;
                if(file.message == 'success'){
                    Message({
                        type: 'success',
                        message: "上传成功！"
                    });
                    file.obj[0].name =  file.obj[0].fileOrgName
                    _this.fileList1 = file.obj
                    _this.params.bigPic = file.obj[0].filePath
                }
            },
            midHandlePreview(file) {
                const _this = this;                
                if(file.message == 'success'){
                    Message({
                        type: 'success',
                        message: "上传成功！"
                    });
                    file.obj[0].name =  file.obj[0].fileOrgName
                    _this.fileList2 = file.obj
                    _this.params.midPic = file.obj[0].filePath
                }
            },
            smallHandlePreview(file) {
                const _this = this;                
                if(file.message == 'success'){
                    Message({
                        type: 'success',
                        message: "上传成功！"
                    });
                    file.obj[0].name =  file.obj[0].fileOrgName
                    _this.fileList3 = file.obj
                    _this.params.smallPic = file.obj[0].filePath
                }
            },
             //商品包裝清除事情回调
            packClearValue(){
                const _this  = this;
                _this.params.packCode = ""  
            },
            //滚动加载商品包裝
            packComScroll(isEnd){
                if (isEnd) {
                    this.packSelectParams.pageStart ++
                    let params = this.packSelectParams;        
                    this.querySkuPackInfoForPageByVo(params, obj => {
                        if(obj.list){
                            this.packDatalist = this.packDatalist.concat(obj.list);
                        }
                    });
                }
            },
            //第一次加载商品包裝
            packFirstLoad(){
                const _this = this
                if(_this.packDatalist.length != 0 ){
                    return 
                }
                let params = _this.packSelectParams
                _this.querySkuPackInfoForPageByVo(params, function(res) {
                    _this.packDatalist = res.list
                })
            },
            //商品包裝被选中
            packItemValue(data){
                const _this = this
                _this.params.packCode = data.packCode
            },
            //商品包裝搜索框内的值改变
            packQuerySelect(data){
               const _this = this;
                _this.packSelectParams.pageStart = 1;
                _this.packSelectParams.packName = data;
                let params = _this.packSelectParams;
                _this.querySkuPackInfoForPageByVo(params, function(res) {
                    _this.packDatalist = res.list
                });
            },
            querySkuPackInfoForPageByVo(params,callback){
                api.skuInfo.querySkuPackInfoForPageByVo(params, res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        callback(obj);
                    }
                })
            },
            //商品产地清除事情回调
            skuAreaCodeClearValue(){
                const _this  = this;
                _this.params.skuAreaCode = ""  
            },
            //滚动加载商品产地
            skuAreaCodeComScroll(isEnd){
                if (isEnd) {
                    this.skuAreaSelectParams.pageStart ++
                    let params = this.skuAreaSelectParams;        
                    this.getSkuAreaInfoByRedisCache(params, obj => {
                        if(obj.list){
                            this.skuAreaDatalist = this.skuAreaDatalist.concat(obj.list);
                        }
                    });
                }
            },
            //第一次加载商品产地
            skuAreaCodeFirstLoad(){
                const _this = this
                if(_this.skuAreaDatalist.length != 0 ){
                    return 
                }
                let params = _this.skuAreaSelectParams
                _this.getSkuAreaInfoByRedisCache(params, function(res) {
                    _this.skuAreaDatalist = res.list
                })
            },
            //商品产地被选中
            skuAreaCodeItemValue(data){
                const _this = this
                _this.params.skuAreaCode = data.skuAreaCode
            },
            //商品产地搜索框内的值改变
            skuAreaQuerySelect(data){
               const _this = this;
                _this.skuAreaSelectParams.pageStart = 1;
                _this.skuAreaSelectParams.skuAreaName = data;
                let params = _this.skuAreaSelectParams;
                _this.getSkuAreaInfoByRedisCache(params, function(res) {
                    _this.skuAreaDatalist = res.list
                });
            },
            getSkuAreaInfoByRedisCache(params,callback){
                api.skuInfo.getSkuAreaInfoByRedisCache(params, res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        callback(obj);
                    }
                })
            },
            //商品分类树节点被点击的时候
            classifyNodeClick(data){
                const _this = this;
                _this.params.categoryName = data.categoryName
                _this.params.categoryCode = data.categoryCode 
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
            //点击商品分类input
            showClassify(){
                const _this = this;
                _this.classifyShowarea = !_this.classifyShowarea
                _this.catalogShowarea = false
            },
            //点击商品目录input
            showCatalog(){
                const _this = this;
                _this.catalogShowarea = !_this.catalogShowarea
                _this.classifyShowarea = false
            },
            //商品目录树节点被点击的时候
            catalogNodeClick(data){
                const _this = this;
                _this.params.catlogName = data.catlogName
                _this.params.catlogCode = data.catlogCode 
                _this.catalogShowarea = false                
            },
            //商品目录加载子节点方法
            catalogLoad(node, resolve){
                const _this = this;
                if(node.level == 0){
                    api.skuInfo.getSkuCatLogInfoByCatlogCode({
                        catlogCode:"000001"
                    },(msg)=>{
                        if(msg.data.message == 'success'){
                            resolve(msg.data.obj.skuCatLogSubInfo || [])
                        }
                    })
                }else{
                    api.skuInfo.getSkuCatLogInfoByCatlogCode({
                        catlogCode:node.data.catlogCode
                    },(msg)=>{
                        if(msg.data.message == 'success'){
                            resolve(msg.data.obj.skuCatLogSubInfo || [])
                        }
                    })
                }
            },
            isNumber(value) {
                var patrn = /^(-)?\d+(\.\d+)?$/;
                if (patrn.exec(value) == null || value == "") {
                    return false
                } else {
                    return true
                }
            },
            //提交商品
            submitSkuInfo(){
                const _this = this;
                if(!_this.params.skuName){
                    _this.status.skuName = "invalid"
                }
                if(!_this.params.brandCode){
                    _this.status.brandCode = "invalid"
                    _this.brandRequired = true
                }
                if(!_this.params.catlogCode){
                    _this.status.catlogCode = "invalid"                    
                }
                if(!_this.params.categoryCode){
                    _this.status.categoryCode = "invalid"                    
                }
                // if(!_this.params.originalCode){
                //     _this.status.originalCode= 'invalid'
                // }
                // if(!_this.params.externalCode){
                //     _this.status.externalCode= 'invalid'                    
                // }
                // if(!_this.params.barCode){
                //     _this.status.barCode= 'invalid'                                        
                // }
                if(_this.params.onOffFlag == null){
                    _this.status.onOffFlag= 'invalid'                                                            
                }
                if(_this.params.matchCarFlag == null){
                    _this.status.matchCarFlag= 'invalid'                                                                                
                }
                if(_this.params.warehouseCheckFlag == null){
                    _this.status.warehouseCheckFlag= 'invalid'                                                                                
                }
                if(!Number.isInteger(parseFloat(_this.params.purchaseToCheckNums))){
                    _this.status.purchaseToCheckNums= 'invalid'                                                                                
                }
                // || !_this.params.originalCode || !_this.params.externalCode || !_this.params.barCode
                if((_this.params.warehouseCheckFlag == null) || (_this.params.matchCarFlag==null) || (_this.params.onOffFlag==null) || !_this.params.skuName || !_this.params.brandCode || !_this.params.catlogCode || !_this.params.categoryCode  || !Number.isInteger(parseFloat(_this.params.purchaseToCheckNums)))
                {
                    return;
                }
                if(this.status.purchaseToCheckNums == 'invalid') {
                    return 
                }
                if(_this.isNumber(_this.params.standardCost)){
                    if(_this.params.standardCost<0){
                        _this.status.standardCost = 'invalid'
                        return
                    }
                }
                api.skuInfo.update(_this.params,(msg)=>{
                    if(msg.data.message == 'success'){
                        Message({
                            type: 'success',
                            message: "提交成功！"
                        });
                    }else{
                        Message({
                            type: 'error',
                            message: "提交失败！"
                        });
                    }
                })
                
            },
            // 搜索框内值改变   触发搜索
            brandQuerySelect(data) {
                const _this = this;
                _this.selectParams.pageStart = 1;
                _this.selectParams.brandName = data;
                let params = _this.selectParams;
                _this.querySkuBrandInfoForPageByVo(params, function(res) {
                    _this.brandDatalist = res.list
                });
            },
            // 选中某一项    
            brandItemValue(value) {
                const _this = this
                _this.params.brandCode = value.brandCode
            },
            // 第一次加载数据
            brandFirstLoad() {
                const _this = this
                if(_this.brandDatalist.length != 0 ){
                    return 
                }
                let params = _this.selectParams
                _this.querySkuBrandInfoForPageByVo(params, function(res) {
                    _this.brandDatalist = res.list
                })
            },
            // 滚动加载
            brandComScroll(isEnd) {
                if (isEnd) {
                    this.selectParams.pageStart ++
                    let params = this.selectParams;        
                    this.getSupplierName(params, obj => {
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
            //品牌下拉框清除事件
            brandClearValue(){
                const _this  = this;
                _this.params.brandCode = ""                
            },
            querySkuUnitAvailableInfo(){
                const _this = this;
                api.skuInfo.querySkuUnitAvailableInfo({},(msg)=>{
                    if(msg.data.code == 'success'){
                        let data = msg.data.obj;
                        let arr = []
                        for (let i = 0; i < data.length; i++) {
                            const element = data[i];
                            arr.push({
                                text:element.unitName,
                                value:element.unitCode
                            })
                        }
                        _this.unitList = arr;
                    }
                })
            }
        },
        created () {
            const _this = this;
            _this.querySkuUnitAvailableInfo()
            api.ref.getDataDictionarys({
                refCode: 'CostCalculationType'
            },(msg)=>{
                if(msg.data.message == 'success'){
                    let data  = msg.data.obj.referenceDetailInfos
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        _this.$set(_this.calCostTypeList,i,{
                            text:data[i].refDetailName,
                            value:data[i].refDetailCode
                        })
                    }
                }
            })
            api.skuInfo.querySkuInfo({
                skuCode:_this.$route.query.skuCode
            },(msg)=>{
                if(msg.data.message == 'success'){
                    let data = msg.data.obj
                    _this.params = {
                        id:data.id,
                        skuCode:data.skuCode,                    
                        skuName:data.skuName,
                        catlogName:data.catlogName,
                        catlogCode:data.catlogCode,                    
                        categoryName:data.categoryName,
                        categoryCode:data.categoryCode,
                        warrantyDays:data.warrantyDays,
                        originalCode:data.originalCode,
                        skuAreaCode:data.skuAreaCode,
                        skuAreaName:data.skuAreaName,
                        externalCode:data.externalCode,
                        skuStandards:data.skuStandards,
                        barCode:data.barCode,
                        grossWeight:data.grossWeight,
                        packCode:data.packCode,
                        skuLong:data.skuLong,
                        skuHeight:data.skuHeight,
                        onOffFlag:data.onOffFlag,
                        matchCarFlag:data.matchCarFlag,
                        warehouseCheckFlag:data.warehouseCheckFlag,
                        bigPic:data.bigPic,
                        midPic:data.midPic,
                        smallPic:data.smallPic,
                        skuType:config.skuInfo.goodsTypeGood,
                        brandCode:data.brandCode,
                        skuModel:data.skuModel,
                        skuWeight:data.skuWeight,
                        netWeight:data.netWeight,
                        purchaseToCheckNums:data.purchaseToCheckNums,
                        standardCost:data.standardCost,
                        checkUnitCode:data.checkUnitCode,
                        calCostType:data.calCostType,
                        purchaseUnitCode:data.purchaseUnitCode,
                        remark:data.remark
                    }
                _this.biguploadParams.relationCode = _this.params.skuCode
                _this.miduploadParams.relationCode = _this.params.skuCode
                _this.smalluploadParams.relationCode = _this.params.skuCode
                _this.$refs.brand.setValue(data.brandName)
                _this.$refs.skuArea.setValue(data.skuAreaName)
                _this.$refs.pack.setValue(data.packName)
				api.accessory.list({
					relationCode: data.skuCode
				}, function (result) {
					if(result.data.code === 'success') {
                        let data = result.data.obj
                        for (let i = 0; i < data.length; i++) {
                            const element = data[i];
                            element.name = element.fileOrgName
                            element.url =  common.getUploadUrl() + element.filePath
                            if(element.businessType == 'small'){
                                _this.smallfileList = [element]
                            }else if(element.businessType == 'mid'){
                                _this.midfileList = [element]                                
                            }else if(element.businessType == 'big'){
                                _this.bigfileList = [element]                                
                            }
                        }
					}
				})
                }
            })
        },
        computed: {
            disabled:function(){
                const _this = this;
                if(Object.prototype.toString.call(_this.$route.query.disabled ) === "[object String]"){
                    return _this.$route.query.disabled == 'true' ? true : false                    
                }else{
                    return _this.$route.query.disabled                  
                }
            }
        },
        watch: {
            'params.purchaseToCheckNums' (val) {
                let reg = /^[1-9]\d*$/
                if(reg.test(val)) {
                    this.status.purchaseToCheckNums = null
                }else {
                    this.status.purchaseToCheckNums = 'invalid'
                }
            }
        }
    }
</script>
<style>
  .select-tree {
        position: absolute;
        margin-top: 6px;
        width: 100%;
        z-index: 1000;
    }
    .sku-info-anchor {
        font-size: 16px;
        margin-right:10px;
    }
    .sku-info-cover{
        position: absolute;
        top: 0;        
        width: 100%;
        height: 100%;
    }
    .sku-info-wrap{
        position: relative;
    }
    .sku-clear-parant{
        position: relative;
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
</style>

