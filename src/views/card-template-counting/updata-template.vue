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
                <!-- <div class="cardModelLine"></div> -->
            </div>
        </div>
        <div class="row relative ml-2 mr-2">
            <div class="col-md-6 col-lg-6">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="模板名称*" label-text-align="right" :label-cols="4">
                            <b-form-input  :disabled="disabled || cardTemplateStatusFlag" :state="state.cardTemplateName" v-model="param.cardTemplateName"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="面值(元)*" label-text-align="right" :label-cols="4">
                            <div class="row">
                                <div class="col-md-10">
                                    <b-form-input  :disabled="disabled || cardTemplateStatusFlag" type="number" :state="state.cardAmout" v-model="param.cardAmout" min="0" />                                
                                </div>
                                <div class="pt-1">
                                    元
                                </div>
                            </div>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="类型" label-text-align="right" :label-cols="4">
                            <b-form-select v-model="param.cardTypeCode" :options="carTypeList" :disabled="true"/>
                        </b-form-fieldset>
                    </div>
                    <!-- <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="发布状态" label-text-align="right" :label-cols="4">
                            <b-form-select :options="cardTemplateStatusList" v-model="param.cardTemplateStatus"/>
                        </b-form-fieldset>
                    </div> -->
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="前缀*" label-text-align="right" :label-cols="4">
                            <b-form-input :disabled="disabled || cardTemplateStatusFlag" :state="state.cardPrefix"  @input="cardPrefixChange()" v-model="param.cardPrefix"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="时间戳" label-text-align="right" :label-cols="4">
                            <b-form-select :disabled="disabled || cardTemplateStatusFlag" v-model="param.hasTimestamp"  @input="changehasTimestamp" :options="hasTimestampList"/>                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="格式" label-text-align="right" :label-cols="4">
                            <b-form-select :state="state.timestampFormat" :disabled="(param.hasTimestamp == 0) || (disabled || cardTemplateStatusFlag)" v-model="param.timestampFormat" :options="timestampFormatList"/>                            
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12 col-lg-12">
                        <b-form-fieldset horizontal label="描述" label-text-align="right" :label-cols="2">
                            <b-form-textarea :disabled="disabled || cardTemplateStatusFlag" id="textarea1"
                                            v-model="param.cardDescription"
                                            :rows="3"
                                            @input="strLenght(1)"
                                            :max-rows="6">
                            </b-form-textarea>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12 col-lg-12">
                        <b-form-fieldset horizontal label="备注" label-text-align="right" :label-cols="2">
                            <b-form-textarea :disabled="disabled || cardTemplateStatusFlag" id="textarea2"
                                            v-model="param.remark"
                                            :rows="3"
                                            @input="strLenght(2)"                                            
                                            :max-rows="6">
                            </b-form-textarea>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12 col-lg-12">
                        <b-form-fieldset horizontal label="免责条款" label-text-align="right" :label-cols="2">
                            <b-form-textarea :disabled="disabled || cardTemplateStatusFlag" id="textarea2"
                                            v-model="param.cardRules"
                                            :rows="3"
                                            @input="strLenght(3)"
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
                            <org-tree :disabled="disabled || cardTemplateStatusFlag" @getOrgCode="getOrg" :class="{'inp-invalid' : state.applyOrgCode}" :params='{code:param.applyOrgCode,orgName:param.applyOrgName}'></org-tree>	
						    <!-- <i class="el-icon-warning text-primary staff-tooltip" v-b-tooltip.hover title="此处组织为人事组织归属!"></i> -->
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="申请人" label-text-align="right" :label-cols="4">
                            <b-form-input :disabled="disabled || cardTemplateStatusFlag" v-model="param.applyEmpName"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="使用方*" label-text-align="right" :label-cols="4">
                            <b-form-select :disabled="disabled || cardTemplateStatusFlag" :state="state.cardUseTypeCode" v-model="param.cardUseTypeCode" :options="cardUseTypeList"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="使用性质*" label-text-align="right" :label-cols="4">
                            <b-form-select :disabled="disabled || cardTemplateStatusFlag"  :state="state.useNatureTypeCode" v-model="param.useNatureTypeCode" :options="useNatureTypeList"/>
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="staticTime">
                    <b-form-fieldset horizontal label="有效期类型*" label-text-align="right" :label-cols="2">
                        <b-container fluid>
                            <b-row class="my-1">
                                <b-col sm="5">
                                    <input :disabled="!(!disabled && (cardTemplateStatus == 0))" @change="cardExpireTypeChange()" :class="{'inp-invalid' : state.cardExpireType}" type="radio" name="time" value="0" v-model="param.cardExpireType">&nbsp;&nbsp;固定时长(天)
                                </b-col>
                                <b-col sm="7">
                                    <div class="row">
                                        <div class="col-md-10">
                                            <b-form-input :disabled="(param.cardExpireType==1) || (disabled || cardTemplateStatusFlag)" :state="state.expirePeriod" v-model="param.expirePeriod" type="number" />
                                        </div>
                                        <div class="pt-1">
                                            天
                                        </div>
                                    </div>
                                </b-col>
                            </b-row>
                            <b-row class="my-1">
                                <b-col sm="5">
                                    <input :disabled="!(!disabled && (cardTemplateStatus == 0))" @change="cardExpireTypeChange()" :class="{'inp-invalid' : state.cardExpireType}" type="radio" name="time" value="1" v-model="param.cardExpireType">&nbsp;&nbsp;标定结束日期
                                </b-col>
                                <b-col sm="7">
                                    <el-date-picker
                                        :disabled="(param.cardExpireType==0) || (disabled || cardTemplateStatusFlag)"
                                        :class="{'inp-invalid' : state.expireDate}"
                                        v-model="param.expireDate"
                                        type="date"
                                        placeholder="选择日期"
                                        :picker-options="pickerOptions1"
                                        >
                                    </el-date-picker>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-form-fieldset>
                </div>
                <div class="pictureStyle">
                    <b-form-fieldset label="图样:" label-text-align="left" :label-cols="2">
                        <div class="needUpload row">
                            <upload 
                            :on-success="fronthandleSuccess"
                            :on-error="onError"  
                            :file-list="frontfileList"
                            :parame="frontuploadParams" 
                            :disabled="!(!disabled && (cardTemplateStatus == 0))"                            
                            :on-remove="fronthandleRemove"
                            :title="'正面'"
                            ></upload>
                            <upload 
                            :disabled="!(!disabled && (cardTemplateStatus == 0))"                            
                            :on-success="reversehandleSuccess"
                            :on-error="onError"  
                            :file-list="reversefileList"
                            :parame="reverseuploadParams" 
                            :on-remove="reversehandleRemove"
                            :title="'反面'"
                            ></upload>
                            <upload 
                            :disabled="!(!disabled && (cardTemplateStatus == 0))"                            
                            :on-success="brand1handleSuccess"
                            :on-error="onError"  
                            :file-list="brand1fileList"
                            :parame="brand1uploadParams" 
                            :on-remove="brand1handleRemove"
                            :title="'宣传页'"
                            ></upload>
                            <upload 
                            :disabled="!(!disabled && (cardTemplateStatus == 0))"                            
                            :on-success="brand2handleSuccess"
                            :on-error="onError"  
                            :file-list="brand2fileList"
                            :parame="brand2uploadParams" 
                            :on-remove="brand2handleRemove"
                            :title="'宣传页'"
                            ></upload>
                            <upload 
                            :disabled="!(!disabled && (cardTemplateStatus == 0))"                            
                            :on-success="brand3handleSuccess"
                            :on-error="onError"  
                            :file-list="brand3fileList"
                            :parame="brand3uploadParams" 
                            :on-remove="brand3handleRemove"
                            :title="'宣传页'"
                            ></upload>
                        <!-- <div class="col-md-4 col-lg-4 mt-2">
                            <upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :on-success="fronthandleSuccess"
                            :on-remove="fronthandleRemove"
                            :file-list="frontfileList"
                            :data="frontuploadParams"  
                            :on-error="onError"   
                            :on-preview="onPreview"                                                        
						    accept="image/png,image/gif,image/jpg,image/jpeg"                            
                            list-type="picture">
                            <b-button v-if="!disabled" size="small" variant="success">正面</b-button>
                            </upload>
                        </div>
                        <div class="col-md-4 col-lg-4 mt-2">
                            <upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :on-success="reversehandleSuccess"
                            :on-remove="reversehandleRemove"
                            :file-list="reversefileList"
                            :data="reverseuploadParams"  
                            :on-error="onError"   
                            :on-preview="onPreview"                                                        
						    accept="image/png,image/gif,image/jpg,image/jpeg"                            
                            list-type="picture">
                            <b-button v-if="!disabled" size="small" variant="success">反面</b-button>
                            </upload>
                        </div>
                        <div class="col-md-4 col-lg-4 mt-2">
                            <upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :on-success="brand1handleSuccess"
                            :on-remove="brand1handleRemove"
                            :file-list="brand1fileList"
                            :data="brand1uploadParams"  
                            :on-error="onError"   
                            :on-preview="onPreview"                                                        
						    accept="image/png,image/gif,image/jpg,image/jpeg"                            
                            list-type="picture">
                            <b-button v-if="!disabled" size="small" variant="success">宣传页</b-button>
                            </upload>
                        </div>
                        <div class="col-md-4 col-lg-4 mt-2">
                            <upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :on-success="brand2handleSuccess"
                            :on-remove="brand2handleRemove"
                            :file-list="brand2fileList"
                            :data="brand2uploadParams"  
                            :on-error="onError"   
                            :on-preview="onPreview"                                                        
						    accept="image/png,image/gif,image/jpg,image/jpeg"                            
                            list-type="picture">
                            <b-button v-if="!disabled" size="small" variant="success">宣传页</b-button>
                            </upload>
                        </div>
                        <div class="col-md-4 col-lg-4 mt-2">
                            <upload
                            class="upload-demo"
                            :action="uploadUrl"
                            :on-success="brand3handleSuccess"
                            :on-remove="brand3handleRemove"
                            :file-list="brand3fileList"
                            :data="brand3uploadParams"  
                            :on-error="onError"   
                            :on-preview="onPreview"                                                        
						    accept="image/png,image/gif,image/jpg,image/jpeg"                            
                            list-type="picture">
                            <b-button v-if="!disabled" size="small" variant="success">宣传页</b-button>
                            </upload>
                        </div> -->
                    </div>
                     <!-- <el-alert
                        title="仅支持.jpg.jpeg.png格式，不大于5MB尺寸不限"
                        type="warning"
                        show-icon
                        :closable="false">
                    </el-alert> -->
                    仅支持.jpg.jpeg.png格式，不大于5MB尺寸不限
                    </b-form-fieldset>
                </div>
            </div>
            <!-- <div class="sku-info-cover" v-if="disabled || cardTemplateStatusFlag">
            </div> -->
        </div>
        <div class="row ml-2 mr-2">
            <div class="col-md-12">
                <div class="pull-right">
                    <b-button v-if="!disabled && (cardTemplateStatus == 0)" size="sm" variant="primary" @click="preserve()">暂存</b-button>  
                    <b-button v-if="!disabled" :disabled="!detailShow"  size="sm" variant="primary" @click="publish">{{cardTemplateStatus == 0 ? '发布' : '撤销发布'}}</b-button>   
                </div>
            </div>
        </div>
        <div class="specialTabs  mb-2 ml-2 mr-2" v-if="detailShow">
            <b-tabs>
                <b-tab title="内容">
                    <div class="row mb-2">
                        <div class="col-md-12">
                            <div class="pull-left">
                                <b-button v-if="!disabled && cardTemplateStatus == 0" size="sm" variant="success" @click="addContainer">新增</b-button>                                                        
                                <b-button v-if="!disabled && cardTemplateStatus == 0" size="sm" variant="danger" @click="deleteDetail">删除</b-button> 
                            </div>
                            <div class="pull-right">
                                <b-button v-if="!disabled && cardTemplateStatus == 0" size="sm" variant="success" @click="submitdetail">保存</b-button>                                                        
                            </div>
                        </div>
                    </div>
                    <div class="table-scrollable">
                        <b-table striped hover bordered show-empty :items="containerlist" :fields="fieldsContainer">
                            <template  v-if="!disabled" slot="operate" slot-scope="data">
                                <input type="radio" name="radio"  v-model="selCont" :value="data.item"/>                                                          
                            </template>
                            <template slot="detailType" slot-scope="data">
                                {{data.item.detailType == 0 ? '商品': '服务'}}
                            </template>
                            <template slot="detailCode" slot-scope="data">
                                {{data.item.detailCode}}
                            </template>
                            <template slot="detailName" slot-scope="data">
                                {{data.item.detailName}}
                            </template>
                            <!-- <template slot="detailNums" slot-scope="data">
                                {{data.item.detailNums}}
                            </template> -->
                            <template slot="detailNums" slot-scope="data">
                                <b-form-input :disabled="cardTemplateStatus == 2" :state="data.item.state" style="width:100px;" type="number" min="0" v-model="data.item.detailNums" ></b-form-input>                                    
                            </template>
                            <template slot="empty">
                        	    暂无数据...
                            </template>
                        </b-table>
                    </div>
                </b-tab>
                <b-tab title="使用范围">
                    <scope ref="scope" :additionalSelect="additionalSelect" :disabled="disabled || cardTemplateStatus == 2" :pageData="scopePageData" @page-change="queryCardTemplateUseRangeInfo" :multipleSelection="true" :fields="fields" @deletScopeBtn="deletScopeBtn"  :addscope="addscope" :tablist="scopeList"></scope>                    
                </b-tab>
            </b-tabs>
        </div>
        <model ref="myModalRef" :containerlist="codes" @query="queryCardTemplateDetailInfoNoPage" :cardTemplateCode="param.cardTemplateCode" :makeOrgCode="param.makeOrgCode"/>
    </div>
</template>
<script>
    import Vue from 'vue'
    import config from 'common/config.js'
    import common from 'common/common.js'
    // import upload from 'components/iris-upload
    import scope from 'components/iris-scope'
    import api from 'common/api.js'
    import model from './model.vue'
    import { MessageBox, Message, Tree, DatePicker, TimePicker, Tooltip , Upload , Alert} from 'element-ui'
    import orgTree from 'views/staff/orgTree'
    import upload from"components/iris-upload-2.0"
    Vue.use(Tree)
    Vue.use(DatePicker)
    Vue.use(TimePicker)
    Vue.use(Tooltip)
    Vue.use(Alert)
    export default {
        components: {
            Upload,
            model,
            orgTree,
            scope,
            upload
        },
        data() {
            return {
                fileList:[],
                uploadParams:{
                    relationCode: "",
					singleFlag: 1,
					businessType: 'front'
                },
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    }
                },
                containerlist: [],
                selCont:null,
                arealist: [],
                carTypeList:[],
                scopeList:[],
                scopePageData:{},
                fields:[{label:"使用渠道",name:"channelTypeName",},{label:"销售区域",name:"salesAreaName",},{label:"行政区域",name:"chinaAreaName",},{label:"门店",name:"storeName"}],                
                hasTimestampList: [{
                    value: 0,
                    text: "无"
                }, {
                    value: 1,
                    text: "有"
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
                fieldsContainer: {
                    operate:{
                        label: '选择'
                    },
                    detailType: {
                        label: '类型'
                    },
                    detailCode: {
                        label: '编号'
                    },
                    detailName: {
                        label: '名称'
                    },
                    detailNums: {
                        label: '数量'
                    }
                },
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
                    expirePeriod:null,
                    expireDate:"",
                    makeStatus:0,
                    hasTimestamp:0
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
                    timestampFormat:null
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
                detailShow:false,
                additionalSelect:{
                    canalList:{
                        name:"渠道",
                        code:"canal",
                        option:[]
                    },
                },    
                codes:[],
                cardTemplateStatus:null,
                cardTemplateStatusFlag:false                                   
            }
        },
        computed:{
            disabled:{
                get: function(){
                    const _this = this;
                    if(Object.prototype.toString.call(_this.$route.query.disabled ) === "[object String]"){
                        return _this.$route.query.disabled == 'true' ? true : false                    
                    }else{
                        return _this.$route.query.disabled                  
                    }
                },
                set: function (v) {
                    return v;                 
                }
            }
        },
        methods: {
            cardPrefixChange(){
                const _this = this
                if(!_this.param.cardPrefix){
                    _this.state.cardPrefix = 'invalid'
                    Message({
                        type: 'warning',
                        message: '格式不对'
                    });
                }else if(!(/^[A-Za-z]+$/.test(_this.param.cardPrefix))){
                    _this.state.cardPrefix = 'invalid'
                    Message({
                        type: 'warning',
                        message: '格式不对'
                    });
                }
            },
            submitdetail(){
                const _this = this;
                let data = []
                for (let index = 0; index < _this.containerlist.length; index++) {
                    const element = _this.containerlist[index];
                    if(element.detailNums > 0){
                        if(Number.isInteger(parseFloat(element.detailNums))){
                            data.push(element)
                        }else{
                            _this.$set(_this.containerlist[index],'state','invalid')                                
                        }                            
                    }else{
                        Message({
                            type: 'warning',
                            message: '请填写正确单需求数量！'
                        });
                        return
                    }
                }
                if(data.length == 0){
                    MessageBox.confirm('请填写需求数量！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    }).catch(() => {
                    });
                }else{
                    api.carTemlate.editCardTemplateDetailInfo(data,(msg)=>{
                        if(msg.data.message == 'success'){
                            Message({
                                type: 'success',
                                message: '保存成功！'
                            });
                            _this.queryCardTemplateDetailInfoNoPage()
                        }                    
                    })
                }
            },
            handleSuccess(res){
                var file = res.data
                const _this = this
                if(file.message == 'success'){
                    var file = file.obj[0]
                    file.name = '正面'
                    file.url = common.getUploadUrl() + file.filePath  
                    _this.fileList = [file]
                    Message({
                        type: 'success',
                        message: "操作成功！"
                    });
                }else{
                    Message({
                        type: 'error',
                        message: "上传失败！"
                    });
                }
            },
            changehasTimestamp(val){
                const _this = this;
                if(val == 0){
                    //无
                _this.param.timestampFormat = null
                }
            },
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
            publish(){
                const _this = this;
                if(_this.cardTemplateStatus == 0){
                    //发布
                    if((_this.containerlist.length == 0) || (_this.scopeList.length == 0)){
                        Message({
                            type: 'warning',
                            message: '未填写模板内容和使用范围！'
                        });
                        return
                    }
                    let param = {
                        cardTemplateCode:_this.param.cardTemplateCode,
                    }
                    api.carTemlate.releaseCardTemplateInfo(param,(msg)=>{
                        if(msg.data.message == 'success'){
                            _this.$router.push({
                                name: 'card-template-counting-query'
                            })
                            _this.disabled = false 
                            _this.cardTemplateStatus = 2    
                            _this.cardTemplateStatusFlag = true                                                   
                        }
                    })
                }else{
                    _this.param.cardTemplateStatus = 0
                    api.carTemlate.updateCardTemplateInfo(_this.param,(msg)=>{
                        if(msg.data.message == 'success'){
                            Message({
                                type: 'success',
                                message: '保存成功！'
                            });
                            _this.disabled = false                                                    
                            _this.cardTemplateStatus = 0
                            _this.cardTemplateStatusFlag = false                                                                               
                        }
                    })
                }
            },
            //有效期类型
            cardExpireTypeChange(){
                const _this = this;
                if(_this.param.cardExpireType == 0){
                    _this.param.expireDate = ""
                }else{
                    _this.param.expirePeriod = null
                }
            },
            //查询适用范围
            queryCardTemplateUseRangeInfo(value=1){
                const _this = this;
                _this.scopeList = []                
                api.carTemlate.queryCardTemplateUseRangeInfo({cardTemplateCode:_this.param.cardTemplateCode,pageStart:value,pageNums:1000},(msg)=>{
                    if(msg.data.message == 'success'){
                        let data = msg.data.obj.list;
                        _this.scopePageData = msg.data.obj
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
                                if(code == config.scopeType.sales){
                                    for (let index = 0; index < SEQ.length; index++) {
                                        const element = SEQ[index];
                                        if(!data[index].additionalSelect.canalList.value){
                                            MessageBox.confirm(`请选择渠道！`, '提示', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                type: 'warning'
                                            }).then(() => {
                                            }).catch(() => {
                                            });
                                            return;
                                        }
                                        codes.push(data[index].code)                                        
                                        list[index]={
                                            rangeCode:element,
                                            cardTemplateCode:_this.param.cardTemplateCode,
                                            salesAreaCode:data[index].code,
                                            salesAreaName:data[index].name,
                                            channelTypeCode:data[index].additionalSelect.canalList.value
                                        }
                                    }
                                }
                                if(code == config.scopeType.shop){
                                    for (let index = 0; index < SEQ.length; index++) {
                                        const element = SEQ[index];
                                        if(!data[index].additionalSelect.canalList.value){
                                            MessageBox.confirm(`请选择渠道！`, '提示', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                type: 'warning'
                                            }).then(() => {
                                            }).catch(() => {
                                            });
                                            return;
                                        }
                                        codes.push(data[index].code)
                                        list[index]={
                                            rangeCode:element,
                                            cardTemplateCode:_this.param.cardTemplateCode,
                                            storeCode:data[index].code,
                                            storeName:data[index].name,
                                            channelTypeCode:data[index].additionalSelect.canalList.value                                        
                                        }
                                    }
                                }
                                if(code == config.scopeType.government){
                                    for (let index = 0; index < SEQ.length; index++) {
                                        const element = SEQ[index];
                                        if(!data[index].additionalSelect.canalList.value){
                                            MessageBox.confirm(`请选择渠道！`, '提示', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                type: 'warning'
                                            }).then(() => {
                                            }).catch(() => {
                                            });
                                            return;
                                        }
                                        codes.push(data[index].code)
                                        list[index]={
                                            rangeCode:element,
                                            cardTemplateCode:_this.param.cardTemplateCode,
                                            chinaAreaCode:data[index].code,
                                            chinaAreaName:data[index].name,
                                            channelTypeCode:data[index].additionalSelect.canalList.value
                                        }
                                    }
                                }
                            let str = ""
                            for (let j = 0; j < _this.scopeList.length; j++) {
                                const element = _this.scopeList[j];
                                if(codes.includes(element.code)){
                                    if(element.channelTypeCode == data[0].additionalSelect.canalList.value){
                                        str += element.name + ' '
                                    }
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
                            _this.reversefileList = [file]
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.reversefileList = [file]					
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
                            _this.brand1fileList = [file]
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.brand1fileList = [file]					
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
                            _this.brand2fileList = [file]
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.brand2fileList = [file]					
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
                            _this.brand3fileList = [file]
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.brand3fileList = [file]					
				});
            },
            //添加卡内容
            addContainer(){
                const _this = this;
                _this.$refs.myModalRef.show()                
            },
            //查询卡内容明细
            queryCardTemplateDetailInfoNoPage(){
                const _this = this;
                api.carTemlate.queryCardTemplateDetailInfoNoPage({
                    cardTemplateCode:_this.param.cardTemplateCode
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.containerlist = msg.data.obj
                        _this.codes = []                                                
                        for (let index = 0; index < _this.containerlist.length; index++) {
                            const element = _this.containerlist[index];
                            _this.codes.push(element.detailCode)
                        }
                    }
                })
            },
            //删除卡内容明细
            deleteDetail(){
                const _this = this;
                if(_this.selCont == null){
                    Message({
                        type: 'warning',
                        message: '请选择数据！'
                    });
                }else{
                    let obj = {
                        isDeleted:1,
                        id:_this.selCont.id,
                        cardTemplateDetailCode:_this.selCont.cardTemplateDetailCode,
                        cardTemplateCode:_this.selCont.cardTemplateCode,
                        detailType:_this.selCont.detailType,
                        detailCode:_this.selCont.detailCode,
                        detailNums:_this.selCont.detailNums,
                    }
                    api.carTemlate.editCardTemplateDetailInfo([obj],(msg)=>{
                        if(msg.data.message == 'success'){
                            Message({
                                type: 'success',
                                message: '操作成功！'
                            });
                            _this.queryCardTemplateDetailInfoNoPage()
                            _this.selCont = null
                        }                    
                    })
                }
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
                    expireDate:null
                }
                if(!_this.param.cardTemplateName){
                    _this.state.cardTemplateName = 'invalid'
                }
                if(_this.param.cardAmout < 0){
                    _this.state.cardAmout = 'invalid'
                }
                if(!_this.param.cardPrefix){
                    _this.state.cardPrefix = 'invalid'
                }else if(!(/^[A-Za-z]+$/.test(_this.param.cardPrefix))){
                    _this.state.cardPrefix = 'invalid'
                }
                if(!_this.param.applyOrgCode){
                    _this.state.applyOrgCode = true

                }
                if(!_this.param.cardUseTypeCode){
                    _this.state.cardUseTypeCode = 'invalid'
                }
                if(!_this.param.useNatureTypeCode){
                    _this.state.useNatureTypeCode = 'invalid'
                }
                if(!_this.param.cardExpireType){
                    _this.state.cardExpireType = 'invalid'
                }
                if(_this.param.hasTimestamp == 1){
                    if(!_this.param.timestampFormat){
                        _this.state.timestampFormat = 'invalid'
                    }
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
                if((_this.param.expireDate)){
                    _this.param.expireDate = common.formattingTime([_this.param.expireDate,_this.param.expireDate]).endTime                
                }
                if(!_this.param.cardTemplateName || _this.param.cardAmout < 0 || !_this.param.cardPrefix || !(/^[A-Za-z]+$/.test(_this.param.cardPrefix)) || !_this.param.applyOrgCode||!_this.param.cardUseTypeCode||!_this.param.useNatureTypeCode||!_this.param.cardExpireType||((_this.param.expirePeriod <= 0 || !Number.isInteger(parseFloat(_this.param.expirePeriod))) && _this.param.expireDate == "")){
                    return;
                }
                if(_this.param.hasTimestamp == 1){
                    if(!_this.param.timestampFormat){
                        return;
                    }
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
                        cardUseTypeCode:data.cardUseTypeCode,
                        useNatureTypeCode:data.useNatureTypeCode,
                        cardExpireType:data.cardExpireType,
                        expirePeriod:data.expirePeriod || "",
                        expireDate:data.expireDate || "",
                        timestampFormat:data.timestampFormat,
                        cardDescription:data.cardDescription,
                        remark:data.remark,
                        hasTimestamp:data.hasTimestamp,
                        cardPrefix:data.cardPrefix,
                        cardRules:data.cardRules,
                        makeStatus:data.makeStatus,
                        applyOrgName:data.applyOrgName
                    }
                    if(_this.param.cardTemplateStatus == 2){
                        _this.cardTemplateStatusFlag = true
                    }
                    _this.cardTemplateStatus = _this.param.cardTemplateStatus
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
                    _this.queryCardTemplateDetailInfoNoPage()
                }
            })
            api.accessory.list({
                relationCode: _this.$route.query.cardTemplateCode
            }, function (result) {
                if(result.data.code === 'success') {
                    let data = result.data.obj
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        // element.name = element.fileOrgName
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
            _this.getDataDictionarys('ChannelCode',(msg)=>{
                _this.additionalSelect.canalList.option = msg
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
    .staticTime{
        padding: 20px 10px !important;
        border: 1px solid #ccc;
        margin-bottom: 10px; 
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

