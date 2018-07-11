<template>
    <div class="car-template card">
        <div class="row mt-3 ml-2 mr-2">
            <div class="col-md-12 col-lg-12">
                <!-- <b-form-fieldset horizontal label="制卡批次号" label-text-align="right" :label-cols="4">
                    00001
                </b-form-fieldset> -->
                <div class="cardModelLine">
                    模板主信息&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>模板编号: {{param.cardTemplateCode}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>模板创建人: {{param.empCnName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span v-if="param.cardTemplateStatus == 0">发布状态: 未发布</span>                    
                    <span v-if="param.cardTemplateStatus == 2">发布状态: 已发布</span>                    
                    <span v-if="param.cardTemplateStatus == -1">发布状态: 已作废</span>
                </div>
            </div>
        </div>
        <div class="row relative ml-2 mr-2">
            <div class="col-md-6 col-lg-6">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="模板名称*" label-text-align="right" :label-cols="4">
                            <b-form-input  :disabled="true" :state="state.cardTemplateName" v-model="param.cardTemplateName"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="是否电子账户" label-text-align="right" :label-cols="4">
						    <b-form-select :disabled="true" v-model="param.isElectronicAccount" :options="isElectronicAccountList"></b-form-select>                                                                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="前缀*" label-text-align="right" :label-cols="4">
                            <b-form-input :disabled="true" :state="state.cardPrefix" v-model="param.cardPrefix"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="时间戳" label-text-align="right" :label-cols="4">
                            <b-form-select :disabled="true" v-model="param.hasTimestamp" :options="hasTimestampList"/>                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="格式" label-text-align="right" :label-cols="4">
                            <b-form-select :disabled="true" v-model="param.timestampFormat" :options="timestampFormatList"/>                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="制卡方" label-text-align="right" :label-cols="4">
                            <org-tree :disabled="true"  @getOrgCode="getOrg" :class="{'inp-invalid' : state.applyOrgCode}" :params='{code:param.makeOrgCode,orgName:param.makeOrgName}'></org-tree>	                                                     
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="制卡人" label-text-align="right" :label-cols="4">
                            <b-form-input :disabled="true" :state="state.makeEmpName" v-model="param.makeEmpName"/>                            
                            <!-- <b-form-select v-model="param.timestampFormat" :options="timestampFormatList"/>                             -->
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12 col-lg-12">
                        <b-form-fieldset horizontal label="描述" label-text-align="right" :label-cols="2">
                            <b-form-textarea id="textarea1"
                                            :disabled="disabled"
                                            v-model="param.cardDescription"
                                            :rows="3"
                                            @input="strLenght(1)"                                            
                                            :max-rows="6">
                            </b-form-textarea>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12 col-lg-12">
                        <b-form-fieldset horizontal label="备注" label-text-align="right" :label-cols="2">
                            <b-form-textarea id="textarea2"
                                            :disabled="disabled"                            
                                            v-model="param.remark"
                                            :rows="3"
                                            @input="strLenght(2)"                                            
                                            :max-rows="6">
                            </b-form-textarea>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12 col-lg-12">
                        <b-form-fieldset horizontal label="免责条款" label-text-align="right" :label-cols="2">
                            <b-form-textarea id="textarea2"
                                            :disabled="disabled"                            
                                            v-model="param.cardRules"
                                            @input="strLenght(3)"                                            
                                            :rows="3"
                                            :max-rows="6">
                            </b-form-textarea>
                        </b-form-fieldset>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-6">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="制卡申请方*" label-text-align="right" :label-cols="4">
                            <org-tree :disabled="true" @getOrgCode="getOrg" :class="{'inp-invalid' : state.applyOrgCode}" :params='{code:param.applyOrgCode,orgName:param.applyOrgName}'></org-tree>	
						    <!-- <i class="el-icon-warning text-primary staff-tooltip" v-b-tooltip.hover title="此处组织为人事组织归属!"></i> -->
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="申请人" label-text-align="right" :label-cols="4">
                            <b-form-input :disabled="true" v-model="param.applyEmpName"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="使用方*" label-text-align="right" :label-cols="4">
                            <b-form-select :disabled="true" :state="state.cardUseTypeCode" v-model="param.cardUseTypeCode" :options="cardUseTypeList"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="使用性质*" label-text-align="right" :label-cols="4">
                            <b-form-select :disabled="true" :state="state.useNatureTypeCode" v-model="param.useNatureTypeCode" :options="useNatureTypeList"/>
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="pictureStyle">
                    <b-form-fieldset label="充值促销规则" label-text-align="left" :label-cols="2">
                        <div class="col-md-6 col-lg-6">
                            <b-form-fieldset horizontal label="赠送金额*" label-text-align="right" :label-cols="4">
                                <b-form-input type="number" :state="state.giftAmount" v-model="param.giftAmount"/>
                            </b-form-fieldset>
                        </div>
                    </b-form-fieldset>
                </div>
                <div class="pictureStyle">
                        <b-form-fieldset label="图样：" label-text-align="left" :label-cols="2">
                            <div class="needUpload row">
                                <upload 
                            :on-success="fronthandleSuccess"
                            :on-error="onError"  
                            :file-list="frontfileList"
                            :parame="frontuploadParams" 
                            :disabled="disabled"                            
                            :on-remove="fronthandleRemove"
                            :title="'正面'"
                            ></upload>
                            <upload 
                            :disabled="disabled"                            
                            :on-success="reversehandleSuccess"
                            :on-error="onError"  
                            :file-list="reversefileList"
                            :parame="reverseuploadParams" 
                            :on-remove="reversehandleRemove"
                            :title="'反面'"
                            ></upload>
                            <upload 
                            :disabled="disabled"                            
                            :on-success="brand1handleSuccess"
                            :on-error="onError"  
                            :file-list="brand1fileList"
                            :parame="brand1uploadParams" 
                            :on-remove="brand1handleRemove"
                            :title="'宣传页'"
                            ></upload>
                            <upload 
                            :disabled="disabled"                            
                            :on-success="brand2handleSuccess"
                            :on-error="onError"  
                            :file-list="brand2fileList"
                            :parame="brand2uploadParams" 
                            :on-remove="brand2handleRemove"
                            :title="'宣传页'"
                            ></upload>
                            <upload 
                            :disabled="disabled"                            
                            :on-success="brand3handleSuccess"
                            :on-error="onError"  
                            :file-list="brand3fileList"
                            :parame="brand3uploadParams" 
                            :on-remove="brand3handleRemove"
                            :title="'宣传页'"
                            ></upload>
                            </div>
                            仅支持.jpg.jpeg.png格式，不大于5MB尺寸不限
                        </b-form-fieldset>
                </div>
            </div>
        </div>
        <div class="row ml-2 mr-2">
            <div class="col-md-12">
                <div class="pull-right">
                    <b-button v-if="!disabled" size="sm" variant="primary" @click="cancel()">取消</b-button>                        
                    <b-button  v-if="!disabled" size="sm" variant="primary" @click="preserve()">保存</b-button>                        
                </div>
            </div>
        </div>
        <div class="specialTabs" v-if="detailShow">
            <b-tabs>
                <b-tab title="充值使用范围">
                    <scope ref="scope" :disabled="true" @page-change="rechargequeryCardTemplateUseRangeInfo" :multipleSelection="true" :fields="rechargefields" @deletScopeBtn="rechargedeletScopeBtn"  :addscope="rechargeaddscope" :tablist="rechargescopeList"></scope>                                        
                </b-tab>
                <b-tab title="使用范围">
                    <scope ref="scope" :disabled="true" @page-change="queryCardTemplateUseRangeInfo" :multipleSelection="true" :fields="fields" @deletScopeBtn="deletScopeBtn"  :addscope="addscope" :tablist="scopeList"></scope>                    
                </b-tab>
            </b-tabs>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import config from 'common/config.js'
    import common from 'common/common.js'
    import scope from 'components/iris-scope'
    import api from 'common/api.js'
    import { MessageBox, Message, Tree, DatePicker, TimePicker, Tooltip , Upload} from 'element-ui'
    import orgTree from 'views/staff/orgTree'
    import upload from"components/iris-upload-2.0"    
    Vue.use(Tree)
    Vue.use(DatePicker)
    Vue.use(TimePicker)
    Vue.use(Tooltip)
    export default {
        components: {
            Upload,
            orgTree,
            scope,
            upload
        },
        data() {
            return {
                selCont:null,
                arealist: [],
                carTypeList:[],
                scopeList:[],
                rechargescopeList:[],
                isElectronicAccountList:[{
                    text:'是',
                    value:1
                }],
                fields:[{label:"使用渠道",name:"channelTypeName",},{label:"销售区域",name:"salesAreaName",},{label:"行政区域",name:"chinaAreaName",},{label:"门店",name:"storeName"}],                
                rechargefields:[{label:"充值渠道",name:"channelTypeName",},{label:"销售区域",name:"salesAreaName",},{label:"行政区域",name:"chinaAreaName",},{label:"门店",name:"storeName"}],                
                // fields:[{label:"适用范围名字",name:"name",},{label:"适用范围code",name:"code",},{label:"适用范围类型",name:"type"}],                
                // rechargefields:[{label:"适用范围渠道",name:"channelTypeName",},{label:"适用范围名字",name:"name",},{label:"适用范围code",name:"code",},{label:"适用范围类型",name:"type"}],                
                hasTimestampList: [{
                    value: 0,
                    text: "否"
                }, {
                    value: 1,
                    text: "是"
                }],
                cardTemplateStatusList:[
                    {
                        value:0,
                        text:'未发布'
                    },
                    {
                        value:2,
                        text:'已发布'
                    }
                ],
                timestampFormatList:[{
                    value: "YYYYMMDD",
                    text: "YYYYMMDD"
                }, {
                    value: "YYMMDD",
                    text: "YYMMDD"
                }, {
                    value: "YYYY",
                    text: "YYYY"
                }, {
                    value: "YY",
                    text: "YY"
                }, {
                    value: "MMDD",
                    text: "MMDD"
                }, {
                    value: "MM",
                    text: "MM"
                }, {
                    value: "DD",
                    text: "DD"
                }],
                fieldsArea: {
                    quyu: {
                        label: '区域'
                    },
                    mendian: {
                        label: '门店'
                    }
                },
                calCostTypeList:[],
                cardUseTypeList:[],
                useNatureTypeList:[],
                param:{
                    cardTemplateCode:"",
                    cardAmout:0,
                    cardTemplateName:null,
                    cardTypeCode:'Metering',
                    cardTemplateStatus:0,
                    applyOrgCode:null,
                    applyEmpName:null,
                    cardUseTypeCode:null,
                    useNatureTypeCode:null,
                    cardExpireType:0,
                    expirePeriod:0,
                    expireDate:"",
                    makeStatus:0,
                    hasTimestamp:0,
                    giftAmount:0
                },
                state:{
                    cardTemplateCode:null,
                    cardAmout:null,
                    cardTemplateName:null,
                    cardTypeCode:null,
                    cardTemplateStatus:null,
                    applyOrgCode:null,
                    applyEmpName:null,
                    cardUseTypeCode:null,
                    cardPrefix:null,
                    useNatureTypeCode:null,
                    cardExpireType:null,
                    expirePeriod:null,
                    expireDate:null,
                    giftAmount:null
                },
                frontfileList:[],  
                reversefileList:[],    
                brand1fileList:[],    
                brand2fileList:[],    
                brand3fileList:[],                      
                frontuploadParams: {
					relationCode: "",
					singleFlag: 1,
					businessType: 'front'
                },
                reverseuploadParams: {
					relationCode: "",
					singleFlag: 1,
					businessType: 'reverse'
                },
                brand1uploadParams: {
					relationCode: "",
					singleFlag: 1,
					businessType: 'brand1'
                },
                brand2uploadParams: {
					relationCode: "",
					singleFlag: 1,
					businessType: 'brand2'
                },
                brand3uploadParams: {
					relationCode: "",
					singleFlag: 1,
					businessType: 'brand3'
                },          
                uploadUrl: config.uploadUrl,  
                detailShow:false                                                
            }
        },
        computed:{
            disabled:function(){
                const _this = this;
                if(Object.prototype.toString.call(_this.$route.query.disabled ) === "[object String]"){
                    return _this.$route.query.disabled == 'true' ? true : false                    
                }else{
                    return _this.$route.query.disabled                  
                }
            }
        },
        methods: {
            strLenght(v1){
                const _this = this;
                // if(v1 == 1){
                //     if((_this.param.cardDescription && _this.param.cardDescription.length) > 240){
                //         _this.param.cardDescription = _this.param.cardDescription.substring(0,240)
                //         Message({
                //             type: 'warning',
                //             message: '最大输入长度240 ！'
                //         });
                //     }
                // }
                if(v1 == 2){
                    if((_this.param.remark && _this.param.remark.length) > 240){
                        _this.param.remark = _this.param.remark.substring(0,240)
                        Message({
                            type: 'warning',
                            message: '最大输入长度240 ！'
                        });
                    }
                }
                // if(v1 == 3){
                //     if((_this.param.cardRules && _this.param.cardRules.length) > 240){
                //         _this.param.cardRules = _this.param.cardRules.substring(0,240)
                //         Message({
                //             type: 'warning',
                //             message: '最大输入长度240 ！'
                //         });
                //     }
                // }
            },
            cancel(){
                const _this = this;
                _this.$router.push({
                    name:'card-template-storedvalue-query',
                })
            },
            rechargequeryCardTemplateUseRangeInfo(value=1){
                const _this = this;
                _this.rechargescopeList = []                
                api.carTemlate.queryCardTemplateRechargeRangeInfos({cardTemplateCode:_this.param.cardTemplateCode,pageStart:value,pageNums:1000},(msg)=>{
                    if(msg.data.message == 'success'){
                        let data = msg.data.obj.list;
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            element.code = element.chinaAreaCode || element.salesAreaCode || element.storeCode
                            element.name = element.chinaAreaName || element.salesAreaName || element.storeName
                            element.type = (element.chinaAreaCode && '行政区域') || (element.salesAreaCode && '销售区域') || (element.storeCode && '经销商店')
                        }
                        _this.rechargescopeList = data
                    }                    
                })
            },
            //查询适用范围
            queryCardTemplateUseRangeInfo(value=1){
                const _this = this;
                _this.scopeList = []                
                api.carTemlate.queryCardTemplateUseRangeInfo({cardTemplateCode:_this.param.cardTemplateCode,pageStart:value,pageNums:1000},(msg)=>{
                    if(msg.data.message == 'success'){
                        let data = msg.data.obj.list;
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            element.code = element.chinaAreaCode || element.salesAreaCode || element.storeCode
                            element.name = element.chinaAreaName || element.salesAreaName || element.storeName
                            element.type = (element.chinaAreaCode && '行政区域') || (element.salesAreaCode && '销售区域') || (element.storeCode && '经销商店')
                        }
                        _this.scopeList = data
                    }                    
                })
            },
            rechargeaddscope(code , data){
                const _this = this;
                if(Array.isArray(data)){
                    //批量
                    api.ordinalInfo.getSequenceList({
                    'serviceCode': 'CARDTMPUSERANGESEQ',
                    'getNums': data.length
                    },(msg) => {
                        if(msg.data.message == 'success'){
                            let SEQ = msg.data.obj
                            let list = []
                            let codes = []
                            for (let index = 0; index < SEQ.length; index++) {
                                const element = SEQ[index];
                                codes.push(data[index].code)
                                if(code == config.scopeType.sales){
                                    list[index]={
                                        rangeCode:element,
                                        cardTemplateCode:_this.param.cardTemplateCode,
                                        salesAreaCode:data[index].code,
                                        salesAreaName:data[index].name,
                                        channelTypeCode:'OfflineStoreSales'
                                    }
                                }
                                if(code == config.scopeType.shop){
                                    list[index]={
                                        rangeCode:element,
                                        cardTemplateCode:_this.param.cardTemplateCode,
                                        storeCode:data[index].code,
                                        storeName:data[index].name,
                                        channelTypeCode:'OfflineStoreSales'                                        
                                    }
                                }
                                if(code == config.scopeType.government){
                                    list[index]={
                                        rangeCode:element,
                                        cardTemplateCode:_this.param.cardTemplateCode,
                                        chinaAreaCode:data[index].code,
                                        chinaAreaName:data[index].name,
                                        channelTypeCode:'OfflineStoreSales'
                                    }
                                }
                            }
                            let str = ""
                            for (let j = 0; j < _this.scopeList.length; j++) {
                                const element = _this.scopeList[j];
                                if(codes.includes(element.code)){
                                    str += element.name + ' '
                                }
                            }
                            if(str!==""){
                                MessageBox.confirm(`${str}已存在！`, '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                }).catch(() => {
                                });
                                return;
                            }
                            api.carTemlate.batchAddOrEditCardTemplateUseRangeInfo(list,(msg)=>{
                                if(msg.data.message == 'success'){
                                    Message({
                                        type: 'success',
                                        message: '保存成功！'
                                    });
                                    _this.$refs.scope.activePage()   
                                    _this.queryCardTemplateUseRangeInfo()                                  
                                }                    
                            })
                        } 
                    })
                    
                }else{
                    //单条
                }         
            },
            //添加使用范围
            addscope(code , data){
                const _this = this;
                if(Array.isArray(data)){
                    //批量
                    api.ordinalInfo.getSequenceList({
                    'serviceCode': 'CARDTMPUSERANGESEQ',
                    'getNums': data.length
                    },(msg) => {
                        if(msg.data.message == 'success'){
                            let SEQ = msg.data.obj
                            let list = []
                            let codes = []
                            for (let index = 0; index < SEQ.length; index++) {
                                const element = SEQ[index];
                                codes.push(data[index].code)
                                if(code == config.scopeType.sales){
                                    list[index]={
                                        rangeCode:element,
                                        cardTemplateCode:_this.param.cardTemplateCode,
                                        salesAreaCode:data[index].code,
                                        salesAreaName:data[index].name,
                                        channelTypeCode:'OfflineStoreSales'
                                    }
                                }
                                if(code == config.scopeType.shop){
                                    list[index]={
                                        rangeCode:element,
                                        cardTemplateCode:_this.param.cardTemplateCode,
                                        storeCode:data[index].code,
                                        storeName:data[index].name,
                                        channelTypeCode:'OfflineStoreSales'                                        
                                    }
                                }
                                if(code == config.scopeType.government){
                                    list[index]={
                                        rangeCode:element,
                                        cardTemplateCode:_this.param.cardTemplateCode,
                                        chinaAreaCode:data[index].code,
                                        chinaAreaName:data[index].name,
                                        channelTypeCode:'OfflineStoreSales'
                                    }
                                }
                            }
                            let str = ""
                            for (let j = 0; j < _this.scopeList.length; j++) {
                                const element = _this.scopeList[j];
                                if(codes.includes(element.code)){
                                    str += element.name + ' '
                                }
                            }
                            if(str!==""){
                                MessageBox.confirm(`${str}已存在！`, '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                }).catch(() => {
                                });
                                return;
                            }
                            api.carTemlate.batchAddOrEditCardTemplateUseRangeInfo(list,(msg)=>{
                                if(msg.data.message == 'success'){
                                    Message({
                                        type: 'success',
                                        message: '保存成功！'
                                    });
                                    _this.$refs.scope.activePage()   
                                    _this.queryCardTemplateUseRangeInfo()                                  
                                }                    
                            })
                        } 
                    })
                    
                }else{
                    //单条
                }         
            },
            rechargedeletScopeBtn(data){
                const _this = this;
                data.isDeleted = 1
                api.carTemlate.batchAddOrEditCardTemplateUseRangeInfo([data],(msg)=>{
                    if(msg.data.message == 'success'){
                        Message({
                            type: 'success',
                            message: '操作成功！'
                        });
                        _this.rechargequeryCardTemplateUseRangeInfo()                                                          
                    }                    
                })
            },
            //删除使用范围
            deletScopeBtn(data){
                const _this = this;
                data.isDeleted = 1
                api.carTemlate.batchAddOrEditCardTemplateUseRangeInfo([data],(msg)=>{
                    if(msg.data.message == 'success'){
                        Message({
                            type: 'success',
                            message: '操作成功！'
                        });
                        _this.queryCardTemplateUseRangeInfo()                                                          
                    }                    
                })
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
            //正面上传成功
            fronthandleSuccess(res) {
                const _this = this;
                console.log(2)
                let data = res.data
                 if(data.message == 'success'){
                    var file = data.obj[0]
                    file.name = '正面'
                    file.url = common.getUploadUrl() + file.filePath  
                    _this.param.cardPic1 = file.filePath
                    _this.frontfileList = [file]
                    Message({
                        type: 'success',
                        message: "操作成功！"
                    });
                }else{
                    Message({
                        type: 'error',
                        message: "上传失败！"
                    });
                    _this.frontfileList = []                    
                }
            },
            //反面上传成功
            reversehandleSuccess(file) {
                console.log(1)
                const _this = this;
                let data = file.data
                 if(data.message == 'success'){
                    var file = data.obj[0]
                    // file.name = file.fileOrgName
                    file.name = '反面'                                                        
                    file.url = common.getUploadUrl() + file.filePath  
                    _this.param.cardPic2 = file.filePath
                    _this.reversefileList = [file]
                    Message({
                        type: 'success',
                        message: "操作成功！"
                    });
                }else{
                    Message({
                        type: 'error',
                        message: "上传失败！"
                    });
                    _this.reversefileList = []                    
                }
            },
            //宣传1上传成功
            brand1handleSuccess(file) {
                const _this = this;
                let data = file.data
                 if(data.message == 'success'){
                    var file = data.obj[0]
                    // file.name = file.fileOrgName
                    file.name = '宣传页'                                                        
                    file.url = common.getUploadUrl() + file.filePath  
                    _this.param.cardPic3 = file.filePath
                    _this.brand1fileList = [file]
                    Message({
                        type: 'success',
                        message: "操作成功！"
                    });
                }else{
                    Message({
                        type: 'error',
                        message: "上传失败！"
                    });
                    _this.brand1fileList = []                    
                }
            },
            //宣传1上传成功
            brand2handleSuccess(file) {
                const _this = this;
                let data = file.data
                 if(data.message == 'success'){
                    var file = data.obj[0]
                    // file.name = file.fileOrgName
                    file.name = '宣传页'                                                        
                    file.url = common.getUploadUrl() + file.filePath  
                    _this.param.cardPic4 = file.filePath
                    _this.brand2fileList = [file]
                    Message({
                        type: 'success',
                        message: "操作成功！"
                    });
                }else{
                    Message({
                        type: 'error',
                        message: "上传失败！"
                    });
                    _this.brand2fileList = []                    
                }
            },
            //宣传1上传成功
            brand3handleSuccess(file) {
                const _this = this;
                let data = file.data
                 if(data.message == 'success'){
                    var file = data.obj[0]
                    // file.name = file.fileOrgName
                    file.name = '宣传页'                                                        
                    file.url = common.getUploadUrl() + file.filePath  
                    _this.param.cardPic5 = file.filePath
                    _this.brand3fileList = [file]
                    Message({
                        type: 'success',
                        message: "操作成功！"
                    });
                }else{
                    Message({
                        type: 'error',
                        message: "上传失败！"
                    });
                    _this.brand3fileList = []                    
                }
            },
            //正面图删除
            fronthandleRemove(file, fileList) {
                const _this = this
                MessageBox.confirm(`确定移除 ${ file.fileOrgName }？`).then(() => {					
					api.accessory.del([file], function (result) {
						let data = result.data;
						if(data.code === 'success') {
                            _this.frontfileList.splice(_this.frontfileList.indexOf(file),1);
                            _this.param.cardPic1 = ''                                                        
                            Message({
                               type: 'success',
                               message: "操作成功！"
                            });
						}else{
                            _this.frontfileList = [file]
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.frontfileList = [file]					
				});
            },
            //反面图删除
            reversehandleRemove(file, fileList) {
                const _this = this
                MessageBox.confirm(`确定移除 ${ file.fileOrgName }？`).then(() => {					
					api.accessory.del([file], function (result) {
						let data = result.data;
						if(data.code === 'success') {
                            _this.reversefileList.splice(_this.frontfileList.indexOf(file),1);
                            _this.param.cardPic2 = ''                                                       
                            Message({
                               type: 'success',
                               message: "操作成功！"
                            });
						}else{
                            _this.frontfileList = [file]
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.frontfileList = [file]					
				});
            },
            //反面图删除
            brand1handleRemove(file, fileList) {
                const _this = this
                MessageBox.confirm(`确定移除 ${ file.fileOrgName }？`).then(() => {					
					api.accessory.del([file], function (result) {
						let data = result.data;
						if(data.code === 'success') {
                            _this.brand1fileList.splice(_this.frontfileList.indexOf(file),1);
                            _this.param.cardPic3 = ''                                                       
                            Message({
                               type: 'success',
                               message: "操作成功！"
                            });
						}else{
                            _this.frontfileList = [file]
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.frontfileList = [file]					
				});
            },
            //反面图删除
            brand2handleRemove(file, fileList) {
                const _this = this
                MessageBox.confirm(`确定移除 ${ file.fileOrgName }？`).then(() => {					
					api.accessory.del([file], function (result) {
						let data = result.data;
						if(data.code === 'success') {
                            _this.brand2fileList.splice(_this.frontfileList.indexOf(file),1);
                            _this.param.cardPic4 = ''                                                       
                            Message({
                               type: 'success',
                               message: "操作成功！"
                            });
						}else{
                            _this.frontfileList = [file]
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.frontfileList = [file]					
				});
            },
            //反面图删除
            brand3handleRemove(file, fileList) {
                const _this = this
                MessageBox.confirm(`确定移除 ${ file.fileOrgName }？`).then(() => {					
					api.accessory.del([file], function (result) {
						let data = result.data;
						if(data.code === 'success') {
                            _this.brand3fileList.splice(_this.frontfileList.indexOf(file),1);
                            _this.param.cardPic5 = ''                                                       
                            Message({
                               type: 'success',
                               message: "操作成功！"
                            });
						}else{
                            _this.frontfileList = [file]
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.frontfileList = [file]					
				});
            },
            //保存
            preserve(){
                const _this = this;
                _this.state = {
                    cardTemplateCode:null,
                    cardAmout:null,
                    cardTemplateName:null,
                    cardTypeCode:null,
                    cardTemplateStatus:null,
                    applyOrgCode:null,
                    applyEmpName:null,
                    cardUseTypeCode:null,
                    cardPrefix:null,
                    useNatureTypeCode:null,
                    cardExpireType:null,
                    expirePeriod:null,
                    expireDate:null,
                    giftAmount:null,
                }
                if(_this.param.cardTemplateName == null){
                    _this.state.cardTemplateName = 'invalid'
                }
                if(_this.param.cardAmout <= 0){
                    _this.state.cardAmout = 'invalid'
                }
                if(!_this.param.cardPrefix){
                    _this.state.cardPrefix = 'invalid'
                }
                if(!_this.param.applyOrgCode){
                    _this.state.applyOrgCode = true

                }
                if(_this.param.cardUseTypeCode == null){
                    _this.state.cardUseTypeCode = 'invalid'
                }
                if(_this.param.useNatureTypeCode == null){
                    _this.state.useNatureTypeCode = 'invalid'
                }
                if(_this.param.cardExpireType == null){
                    _this.state.cardExpireType = 'invalid'
                }
                if(_this.param.cardExpireType == 0){
                    //固定时长
                    if(_this.param.expirePeriod <= 0){
                        _this.state.expirePeriod = 'invalid'
                        _this.state.expireDate = null                        
                    }
                    if(!Number.isInteger(parseFloat(_this.param.expirePeriod))){
                        _this.state.expirePeriod = 'invalid'
                        _this.state.expireDate = null   
                    }
                }else{
                    if(_this.param.expireDate == ""){
                        _this.state.expireDate = 'invalid'
                        _this.state.expirePeriod = null                        
                    }
                }
                if(!(_this.param.expireDate == "")){
                    _this.param.expireDate = common.formattingTime([_this.param.expireDate,_this.param.expireDate]).endTime                
                }
                if(_this.param.cardTemplateName == null || _this.param.cardAmout < 0 || !_this.param.cardPrefix || !_this.param.applyOrgCode||_this.param.cardUseTypeCode == null||_this.param.useNatureTypeCode == null||_this.param.cardExpireType == null||((_this.param.expirePeriod < 0 || !Number.isInteger(parseFloat(_this.param.expirePeriod))) && _this.param.expireDate == "")){
                    return;
                }
                let patrn=/^([0-9]\d*|0)(\.\d*[0-9])?$/;
                if(!patrn.exec(_this.param.giftAmount)){
                    _this.state.giftAmount = 'invalid'
                    return;
                }
                api.carTemlate.updateCardTemplateInfo(_this.param,(msg)=>{
                    if(msg.data.message == 'success'){
                        Message({
                            type: 'success',
                            message: "操作成功！"
                        });
                        _this.detailShow = true
                    }
                })
            },
            getOrg(val) {
                 this.param.applyOrgCode = val.code;
				 this.param.applyOrgName = val.name;                                  
            },
            //查询数据字典
            getDataDictionarys(code,cb = ()=>{}){
                const _this = this;
                api.ref.getDataDictionarys({
                    refCode: code
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        let data  = msg.data.obj.referenceDetailInfos
                        let list = []
                        for (let i = 0; i < data.length; i++) {
                            list[i] = {
                                text:data[i].refDetailName,
                                value:data[i].refDetailCode
                            }
                        }
                        cb(list)
                    }
                })
            }
        },
        mounted(){
            const _this = this;
            _this.detailShow = true
        },
        created(){
            const _this = this;
            api.carTemlate.getCardTemplateInfoByCode({
                cardTemplateCode: _this.$route.query.cardTemplateCode
            },(msg)=>{
                if(msg.data.message == 'success'){
                    let data = msg.data.obj || {}
                    _this.param = {
                        id:data.id,
                        cardTemplateCode:data.cardTemplateCode,
                        cardAmout:data.cardAmout,
                        cardTemplateName:data.cardTemplateName,
                        cardTypeCode:data.cardTypeCode,
                        cardTemplateStatus:data.cardTemplateStatus,
                        applyOrgCode:data.applyOrgCode,
                        applyEmpName:data.applyEmpName,
                        isElectronicAccount:data.isElectronicAccount,
                        cardUseTypeCode:data.cardUseTypeCode,
                        useNatureTypeCode:data.useNatureTypeCode,
                        cardExpireType:data.cardExpireType,
                        expirePeriod:data.expirePeriod,
                        expireDate:data.expireDate || "",
                        makeOrgName:data.makeOrgName,
                        makeOrgCode:data.makeOrgCode,
                        timestampFormat:data.timestampFormat,
                        cardDescription:data.cardDescription,
                        remark:data.remark,
                        hasTimestamp:data.hasTimestamp,
                        cardPrefix:data.cardPrefix,
                        cardRules:data.cardRules,
                        makeEmpName:data.makeEmpName,
                        makeStatus:data.makeStatus,
                        applyOrgName:data.applyOrgName,
                        giftAmount:data.giftAmount
                    }
                    _this.frontuploadParams.relationCode = _this.param.cardTemplateCode
                    _this.reverseuploadParams.relationCode = _this.param.cardTemplateCode
                    _this.brand1uploadParams.relationCode = _this.param.cardTemplateCode
                    _this.brand2uploadParams.relationCode = _this.param.cardTemplateCode
                    _this.brand3uploadParams.relationCode = _this.param.cardTemplateCode
                    let userInfo = sessionStorage.getItem("userInfo");  
                    if(userInfo){
                        _this.param.empCnName = JSON.parse(userInfo).empVo.empCnName     
                        _this.param.makeOrgCode = JSON.parse(userInfo).empVo.orgCode     
                        _this.param.makeEmpCode = JSON.parse(userInfo).empVo.empCode     
                    }
                    _this.queryCardTemplateUseRangeInfo()
                    _this.rechargequeryCardTemplateUseRangeInfo()
                }
            })
            api.accessory.list({
                relationCode: _this.$route.query.cardTemplateCode
            }, function (result) {
                if(result.data.code === 'success') {
                    let data = result.data.obj
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        element.url =  common.getUploadUrl() + element.filePath
                        if(element.businessType == 'front'){
                            element.name = '正面'
                            _this.frontfileList = [element]
                        }else if(element.businessType == 'reverse'){
                            element.name = '反面'                            
                            _this.reversefileList = [element]                                
                        }else if(element.businessType == 'brand1'){
                            element.name = '宣传页'                                                        
                            _this.brand1fileList = [element]                                
                        }else if(element.businessType == 'brand2'){
                            element.name = '宣传页'                                                                                    
                            _this.brand2fileList = [element]                                
                        }else if(element.businessType == 'brand3'){
                            element.name = '宣传页'                                                                                    
                            _this.brand3fileList = [element]                                
                        }
                    }
                }
            })
            _this.getDataDictionarys('CardType',(msg)=>{
                _this.carTypeList = msg
            })
            _this.getDataDictionarys('CardUserType',(msg)=>{
                _this.cardUseTypeList = msg
            })
            _this.getDataDictionarys('UseProperty',(msg)=>{
                _this.useNatureTypeList = msg
            })
        }
    }
</script>
<style>
    .cardModelLine {
        border-bottom: 1px solid #ccc;
        padding-bottom: 20px;
        margin-bottom: 20px;
    }
    .staticTime>.container-fluid{
        padding: 20px 10px !important;
        border: 1px solid #ccc;
    }
    .lineOfCard {
        height: 1px;
        background-color: #ccc;
        margin: 10px 0px;
    }
    .specialTabs a {
        /* padding: 0px; */
        color: #151b1e !important;
        text-decoration: none !important;
        padding: 10px 30px;
        border-radius: 10px 10px 0px 0px;
    }
    .car-template .relative{
        position: relative;
    }
    .car-template .inp-invalid input{
        border-color: #f86c6b !important;
    }
    .nav-tabs {
        outline:none;
    }
    .sku-info-cover{
        position: absolute;
        top: 0;        
        width: 100%;
        height: 100%;
    }
    .car-template .upload {
        border: none !important;
        background-color: #fff;
        box-shadow: none !important;
        border-radius: 4px;
        display: inline-block;
    }
    .car-template .upload .upload_warp_img_div{
        margin-left: 0 !important;
    }
    .car-template .upload .upload_warp{
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
</style>

