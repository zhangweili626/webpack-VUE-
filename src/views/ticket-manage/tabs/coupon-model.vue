<template>
    <div class="car-template card">
        <div class="row  mt-3 ml-2 mr-2">
            <div class="col-md-12 col-lg-12">
                <div class="cardModelLine">
                    模板主信息&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>模板编号: {{param.couponTemplateCode}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>模板创建人: {{param.empCnName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <span v-if="param.couponTemplateStatus == 0">发布状态: 未发布</span>
                    <span v-if="param.couponTemplateStatus == 2">发布状态: 已发布</span>
                    <span v-if="param.couponTemplateStatus == -1">发布状态: 已作废</span>
                </div>
            </div>
        </div>
        <div class="row ml-2 mr-2">
            <div class="col-md-6 col-lg-6">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="模板名称*" label-text-align="right" :label-cols="4">
                            <b-form-input :disabled="disabled" :state="state.couponTemplateName" v-model="param.couponTemplateName" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="类型" label-text-align="right" :label-cols="4">
                            <b-form-select :disabled="disabled"  v-model="param.couponTypeCode" :options="userTypeList"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="前缀*" label-text-align="right" :label-cols="4">
                            <b-form-input :disabled="disabled" :state="state.couponPrefix" v-model="param.couponPrefix" @input="couponPrefixChange()" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="时间戳" label-text-align="right" :label-cols="4">
                            <b-form-select :disabled="disabled" v-model="param.hasTimestamp" @input="changehasTimestamp" :options="hasTimestampList" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="格式" label-text-align="right" :label-cols="4">
                            <b-form-select :state="state.timestampFormat" :disabled="(param.hasTimestamp == 0) || disabled" v-model="param.timestampFormat" :options="timestampFormatList" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12 col-lg-12">
                        <b-form-fieldset horizontal label="描述" label-text-align="right" :label-cols="2">
                            <b-form-textarea :disabled="disabled" id="textarea1" v-model="param.couponDescription" :rows="3" @input="strLenght(1)" :max-rows="6">
                            </b-form-textarea>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12 col-lg-12">
                        <b-form-fieldset horizontal label="备注" label-text-align="right" :label-cols="2">
                            <b-form-textarea :disabled="disabled" id="textarea2" v-model="param.remark" :rows="3" @input="strLenght(2)" :max-rows="6">
                            </b-form-textarea>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12 col-lg-12">
                        <b-form-fieldset horizontal label="免责条款" label-text-align="right" :label-cols="2">
                            <b-form-textarea :disabled="disabled" id="textarea2" v-model="param.couponRules" @input="strLenght(3)" :rows="3" :max-rows="6">
                            </b-form-textarea>
                        </b-form-fieldset>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-6">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="制券申请方*" label-text-align="right" :label-cols="4">
                            <org-tree :disabled="disabled" @getOrgCode="getOrg" :class="{'inp-invalid' : state.applyOrgCode}" :params='{code:param.applyOrgCode,orgName:param.applyOrgName}'></org-tree>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="申请人" label-text-align="right" :label-cols="4">
                            <b-form-input :disabled="disabled" v-model="param.applyEmpName" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="使用方*" label-text-align="right" :label-cols="4">
                            <b-form-select :disabled="disabled" :state="state.couponUseTypeCode" v-model="param.couponUseTypeCode" :options="cardUseTypeList" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="使用性质*" label-text-align="right" :label-cols="4">
                            <b-form-select :disabled="disabled" :state="state.useNatureTypeCode" v-model="param.useNatureTypeCode" :options="useNatureTypeList" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="staticTime">
                    <b-form-fieldset horizontal label="有效期类型*" label-text-align="right" :label-cols="2">
                        <b-container fluid>
                            <b-row class="my-1">
                                <b-col sm="5">
                                    <input :disabled="disabled" @change="couponExpireTypeChange()" :class="{'inp-invalid' : state.couponExpireType}" type="radio" name="time" value="0" v-model="param.couponExpireType">&nbsp;&nbsp;固定时长
                                </b-col>
                                <b-col sm="7">
                                    <div class="row">
                                        <div class="col-md-10">
                                            <b-form-input :disabled="(param.couponExpireType==1) || disabled" :state="state.expirePeriod" v-model="param.expirePeriod" type="number" />
                                        </div>
                                        <div class="pt-1">
                                            天
                                        </div>
                                    </div>
                                </b-col>
                            </b-row>
                            <b-row class="my-1">
                                <b-col sm="5">
                                    <input :disabled="disabled" @change="couponExpireTypeChange()" :class="{'inp-invalid' : state.couponExpireType}" type="radio" name="time" value="1" v-model="param.couponExpireType">&nbsp;&nbsp;有效期限
                                </b-col>
                                <b-col sm="7">
                                   <!-- <el-date-picker :disabled="(param.couponExpireType==0)||disabled" :class="{'inp-invalid' : state.expireDate}" v-model="param.expireDate" type="date" placeholder="选择日期" :picker-options="pickerOptions1">
                                    </el-date-picker>-->
                                    <b-form-input readonly v-model="param.expireDate"></b-form-input>
                                </b-col>
                            </b-row>
                        </b-container>
                    </b-form-fieldset>
                </div>
                <div class="pictureStyle">
                    <b-form-fieldset label="图样：" label-text-align="left" :label-cols="2">
                        <div class="needUpload row">
                            <upload :disabled="disabled" :on-success="fronthandleSuccess" :on-error="onError" :file-list="frontfileList" :parame="frontuploadParams" :on-remove="fronthandleRemove" :title="'正面'"></upload>
                            <upload :disabled="disabled" :on-success="reversehandleSuccess" :on-error="onError" :file-list="reversefileList" :parame="reverseuploadParams" :on-remove="reversehandleRemove" :title="'反面'"></upload>
                            <upload :disabled="disabled" :on-success="brand1handleSuccess" :on-error="onError" :file-list="brand1fileList" :parame="brand1uploadParams" :on-remove="brand1handleRemove" :title="'宣传页'"></upload>
                            <upload :disabled="disabled" :on-success="brand2handleSuccess" :on-error="onError" :file-list="brand2fileList" :parame="brand2uploadParams" :on-remove="brand2handleRemove" :title="'宣传页'"></upload>
                            <upload :disabled="disabled" :on-success="brand3handleSuccess" :on-error="onError" :file-list="brand3fileList" :parame="brand3uploadParams" :on-remove="brand3handleRemove" :title="'宣传页'"></upload>
                        </div>
                        仅支持.jpg.jpeg.png格式，不大于5MB尺寸不限
                    </b-form-fieldset>
                </div>
            </div>
        </div>

        <div class="specialTabs" v-if="detailShow">
            <b-tabs>
                <b-tab title="内容">

                    <div class="table-scrollable">
                        <b-table striped hover bordered show-empty :items="containerlist" :fields="fieldsContainer">

                            <template slot="couponTypeName" slot-scope="data">
                                {{data.item.couponTypeName}}
                            </template>
                            <template slot="detailType" slot-scope="data">
                                <span v-if="data.item.detailType == 0">商品分类</span>
                                <span v-if="data.item.detailType == 1">商品</span>
                                <span v-if="data.item.detailType == 2">服务分类</span>
                                <span v-if="data.item.detailType == 3">服务</span>
                                <span v-if="data.item.detailType == -1">全场</span>
                            </template>
                            <template slot="discountType" slot-scope="data">
                                <span v-if="data.item.discountType == 0">固定金额</span>
                                <span v-if="data.item.discountType == 1">百分比</span>
                            </template>
                            <template slot="discountValue" slot-scope="data">
                                {{data.item.discountValue}}
                            </template>
                            <template slot="empty">
                                暂无数据...
                            </template>
                        </b-table>
                    </div>
                </b-tab>
                <b-tab title="使用范围">
                    <scope :disabled="disabled" ref="scope" :additionalSelect="additionalSelect" :multipleSelection="true" :fields="fields" @deletScopeBtn="deletScopeBtn" :addscope="addscope" :tablist="scopeList"></scope>
                </b-tab>
                <b-tab title="售价设定">
                    <pricesetting :disabled="disabled" ref="scope1" :additionalSelect="additionalSelectprice" :multipleSelection="true" :fields="pricesettingfields" @deletScopeBtn="pricesettingdeletScopeBtn" :addscope="addpricesetting" :tablist="pricesettingscopeList"></pricesetting>
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
import { MessageBox, Message, Tree, DatePicker, TimePicker, Tooltip, Upload } from 'element-ui'
import orgTree from 'views/staff/orgTree'
import upload from "components/iris-upload-2.0"
import pricesetting from "views/ticket-template-counting/pricesetting.vue"
Vue.use(Tree)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Tooltip)
export default {
    components: {
        Upload,
        orgTree,
        scope,
        upload,
        pricesetting
    },
    data() {
        return {
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            },
            containerlist: [],
            selCont: null,
            arealist: [],
            userTypeList: [],
            scopeList: [],
            pricesettingscopeList:[],
            fields: [{ label: "使用渠道", name: "channelTypeName", }, { label: "销售区域", name: "salesAreaName", }, { label: "行政区域", name: "chinaAreaName", }, { label: "门店", name: "storeName" }],
            pricesettingfields: [{ label: "使用渠道", name: "channelTypeName", }, { label: "销售区域", name: "salesAreaName", }, { label: "行政区域", name: "chinaAreaName", }, { label: "门店", name: "storeName" },{ label: "售价（元）", name: "couponPrice",edit:true }],
            hasTimestampList: [{
                value: 0,
                text: "无"
            }, {
                value: 1,
                text: "有"
            }],
            cardTemplateStatusList: [
                {
                    value: 0,
                    text: '未发布'
                },
                {
                    value: 2,
                    text: '已发布'
                }
            ],
            timestampFormatList: [{
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

                couponTypeName:{
                    label:'券类型'
                },
                detailType: {
                    label: '类型'
                },
                detailClassifyCode: {
                    label: '服务/商品分类编码'
                },
                detailClassifyName: {
                    label: '分类名称'
                },
                detailCode: {
                    label: '服务/商品编码'
                },
                detailName: {
                    label: '名称'
                },
                discountType: {
                    label: '折扣类型'
                },
                discountValue:{
                    label: '折扣金额（元）'
                },
                discount:{
                    label: '折扣（%）'
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
            calCostTypeList: [],
            cardUseTypeList: [],
            useNatureTypeList: [],
            param: {
                couponTemplateCode: "",
                // couponAmout: 0,
                couponTemplateName: null,
                couponTypeCode: null,
                couponTemplateStatus: 0,
                applyOrgCode: null,
                applyEmpName: null,
                couponUseTypeCode: null,
                useNatureTypeCode: null,
                couponExpireType: 0,
                expirePeriod: null,
                expireDate:'',
                makeStatus: 0,
                hasTimestamp: 0
            },
            state: {
                couponTemplateCode: null,
                // couponAmout: null,
                couponTemplateName: null,
                couponTypeCode: null,
                couponTemplateStatus: null,
                applyOrgCode: null,
                applyEmpName: null,
                couponUseTypeCode: null,
                couponPrefix: null,
                useNatureTypeCode: null,
                couponExpireType: null,
                expirePeriod: null,
                expireDate: null,
                timestampFormat: null
            },
            frontfileList: [],
            reversefileList: [],
            brand1fileList: [],
            brand2fileList: [],
            brand3fileList: [],
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
            detailShow: false,
            additionalSelect: {
                canalList: {
                    name: "渠道",
                    code: "canal",
                    option: []
                },
            },
            additionalSelectprice: {
                canalList: {
                    name: "渠道",
                    code: "canal",
                    option: []
                },
            },
            disabled:true,
        }
    },
    methods: {
        couponPrefixChange() {
            const _this = this
            _this.state.couponPrefix = null
            if (!_this.param.couponPrefix) {
                _this.state.couponPrefix = 'invalid'
                Message({
                    type: 'warning',
                    message: '格式不对'
                });
            } else if (!(/^[A-Za-z]+$/.test(_this.param.couponPrefix))) {
                _this.state.couponPrefix = 'invalid'
                Message({
                    type: 'warning',
                    message: '格式不对'
                });
            }
        },
        submitdetail() {
            const _this = this;
        },
        changehasTimestamp(val) {
            const _this = this;
            if (val == 0) {
                //无
                _this.param.timestampFormat = null
            }
        },
        strLenght(v1) {
            const _this = this;
            if (v1 == 2) {
                if ((_this.param.remark && _this.param.remark.length) > 240) {
                    _this.param.remark = _this.param.remark.substring(0, 240)
                    Message({
                        type: 'warning',
                        message: '最大输入长度240 ！'
                    });
                }
            }
        },
        //有效期类型
        couponExpireTypeChange() {
            const _this = this;
            if (_this.param.couponExpireType == 0) {
                _this.param.expireDate = ''
            } else {
                _this.param.expirePeriod = null
            }
        },
/*        recallpublish(){
            const _this = this;
            _this.param.couponTemplateStatus = 0
            api.ticketTemlate.updateCouponTemplateInfo(_this.param,(msg)=>{
                if(msg.data.message == 'success'){
                    Message({
                        type: 'success',
                        message: '保存成功！'
                    });
                }
            })
        },*/
       
        queryCouponTemplatePriceRangeInfoNoPage(value = 0){
            const _this = this;
            api.ticketTemlate.queryCouponTemplatePriceRangeInfoNoPage({ couponTemplateCode: _this.param.couponTemplateCode, pageStart: value, pageNums: config.pageNums }, (msg) => {
                if (msg.data.message == 'success') {
                    let data = msg.data.obj;
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        element.code = element.chinaAreaCode || element.salesAreaCode || element.storeCode
                        element.name = element.chinaAreaName || element.salesAreaName || element.storeName
                        element.type = ('行政区域' && element.chinaAreaCode) || ('销售区域' && element.salesAreaCode) || ('经销商店' && element.storeCode)
                    }
                    _this.pricesettingscopeList = data
                }
            })
        },
        //查询适用范围
        queryCouponTemplateUseRangeInfoNoPage(value = 0) {
            const _this = this;
            api.ticketTemlate.queryCouponTemplateUseRangeInfoNoPage({ couponTemplateCode: _this.param.couponTemplateCode, pageStart: value, pageNums: config.pageNums }, (msg) => {
                if (msg.data.message == 'success') {
                    let data = msg.data.obj;
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        element.code = element.chinaAreaCode || element.salesAreaCode || element.storeCode
                        element.name = element.chinaAreaName || element.salesAreaName || element.storeName
                        element.type = ('行政区域' && element.chinaAreaCode) || ('销售区域' && element.salesAreaCode) || ('经销商店' && element.storeCode)
                    }
                    _this.scopeList = data
                }
            })
        },
        addpricesetting(code, data){
            const _this = this;
            if (Array.isArray(data)) {
                //批量
                api.ordinalInfo.getSequenceList({
                    'serviceCode': 'COUPONTEMPLATEPRICERANGESEQ',
                    'getNums': data.length
                }, (msg) => {
                    if (msg.data.message == 'success') {
                        let SEQ = msg.data.obj
                        let list = []
                        let codes = []
                        if (code == config.scopeType.sales) {
                            for (let index = 0; index < SEQ.length; index++) {
                                const element = SEQ[index];
                                if (!data[index].additionalSelect.canalList.value) {
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
                                list[index] = {
                                    priceRangeCode: element,
                                    couponTemplateCode: _this.param.couponTemplateCode,
                                    salesAreaCode: data[index].code,
                                    salesAreaName: data[index].name,
                                    channelTypeCode: data[index].additionalSelect.canalList.value
                                }
                            }
                        }
                        if (code == config.scopeType.shop) {
                            for (let index = 0; index < SEQ.length; index++) {
                                const element = SEQ[index];
                                if (!data[index].additionalSelect.canalList.value) {
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
                                list[index] = {
                                    priceRangeCode: element,
                                    couponTemplateCode: _this.param.couponTemplateCode,
                                    storeCode: data[index].code,
                                    storeName: data[index].name,
                                    channelTypeCode: data[index].additionalSelect.canalList.value
                                }
                            }
                        }
                        if (code == config.scopeType.government) {
                            for (let index = 0; index < SEQ.length; index++) {
                                const element = SEQ[index];
                                if (!data[index].additionalSelect.canalList.value) {
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
                                list[index] = {
                                    priceRangeCode: element,
                                    couponTemplateCode: _this.param.couponTemplateCode,
                                    chinaAreaCode: data[index].code,
                                    chinaAreaName: data[index].name,
                                    channelTypeCode: data[index].additionalSelect.canalList.value,

                                }
                            }
                        }
                        let str = ""
                        for (let j = 0; j < _this.pricesettingscopeList.length; j++) {
                            const element = _this.pricesettingscopeList[j];
                            if (codes.includes(element.code)) {
                                if (element.channelTypeCode == data[0].additionalSelect.canalList.value) {
                                    str += element.name + ' '
                                }
                            }
                        }
                        if (str !== "") {
                            MessageBox.confirm(`${str}已存在！`, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                            }).catch(() => {
                            });
                            return;
                        }
                        api.ticketTemlate.editCouponTemplatePriceRangeInfo(list, (msg) => {
                            if (msg.data.message == 'success') {
                                Message({
                                    type: 'success',
                                    message: '保存成功！'
                                });
                                _this.$refs.scope1.activePage()
                                _this.queryCouponTemplatePriceRangeInfoNoPage()
                            }
                        })
                    }
                })

            } else {
                //单条
            }
        },
        //添加使用范围
        addscope(code, data) {
            const _this = this;
            if (Array.isArray(data)) {
                //批量
                api.ordinalInfo.getSequenceList({
                    'serviceCode': 'COUPONTEMPLATEUSERANGESEQ',
                    'getNums': data.length
                }, (msg) => {
                    if (msg.data.message == 'success') {
                        let SEQ = msg.data.obj
                        let list = []
                        let codes = []
                        if (code == config.scopeType.sales) {
                            for (let index = 0; index < SEQ.length; index++) {
                                const element = SEQ[index];
                                if (!data[index].additionalSelect.canalList.value) {
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
                                list[index] = {
                                    rangeCode: element,
                                    couponTemplateCode: _this.param.couponTemplateCode,
                                    salesAreaCode: data[index].code,
                                    salesAreaName: data[index].name,
                                    channelTypeCode: data[index].additionalSelect.canalList.value,
                                    couponPrice:0
                                }
                            }
                        }
                        if (code == config.scopeType.shop) {
                            for (let index = 0; index < SEQ.length; index++) {
                                const element = SEQ[index];
                                if (!data[index].additionalSelect.canalList.value) {
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
                                list[index] = {
                                    rangeCode: element,
                                    couponTemplateCode: _this.param.couponTemplateCode,
                                    storeCode: data[index].code,
                                    storeName: data[index].name,
                                    channelTypeCode: data[index].additionalSelect.canalList.value,
                                    couponPrice:0
                                }
                            }
                        }
                        if (code == config.scopeType.government) {
                            for (let index = 0; index < SEQ.length; index++) {
                                const element = SEQ[index];
                                if (!data[index].additionalSelect.canalList.value) {
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
                                list[index] = {
                                    rangeCode: element,
                                    couponTemplateCode: _this.param.couponTemplateCode,
                                    chinaAreaCode: data[index].code,
                                    chinaAreaName: data[index].name,
                                    channelTypeCode: data[index].additionalSelect.canalList.value,
                                    couponPrice:0
                                }
                            }
                        }
                        let str = ""
                        for (let j = 0; j < _this.scopeList.length; j++) {
                            const element = _this.scopeList[j];
                            if (codes.includes(element.code)) {
                                if (element.channelTypeCode == data[0].additionalSelect.canalList.value) {
                                    str += element.name + ' '
                                }
                            }
                        }
                        if (str !== "") {
                            MessageBox.confirm(`${str}已存在！`, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                            }).catch(() => {
                            });
                            return;
                        }
                        api.ticketTemlate.editCouponTemplateUseRangeInfo(list, (msg) => {
                            if (msg.data.message == 'success') {
                                Message({
                                    type: 'success',
                                    message: '保存成功！'
                                });
                                _this.$refs.scope.activePage()
                                _this.queryCouponTemplateUseRangeInfoNoPage()
                            }
                        })
                    }
                })

            } else {
                //单条
            }
        },
        pricesettingdeletScopeBtn(data){
            const _this = this;
            data.isDeleted = 1
            api.ticketTemlate.editCouponTemplatePriceRangeInfo([data], (msg) => {
                if (msg.data.message == 'success') {
                    Message({
                        type: 'success',
                        message: '操作成功！'
                    });
                    _this.queryCouponTemplatePriceRangeInfoNoPage()
                }
            })
        },
        //删除使用范围
        deletScopeBtn(data) {
            const _this = this;
            data.isDeleted = 1
            api.ticketTemlate.editCouponTemplateUseRangeInfo([data], (msg) => {
                if (msg.data.message == 'success') {
                    Message({
                        type: 'success',
                        message: '操作成功！'
                    });
                    _this.queryCouponTemplateUseRangeInfoNoPage()
                }
            })
        },
        //大图预览
        onPreview(node) {
            open(node.url);
        },
        //上传图片失败
        onError() {
            Message({
                type: 'error',
                message: "上传失败！"
            });
        },
        //正面上传成功
        fronthandleSuccess(res) {
            const _this = this;
            let data = res.data
            if (data.message == 'success') {
                var file = data.obj[0]
                file.name = '正面'
                file.url = common.getUploadUrl() + file.filePath
                _this.param.cardPic1 = file.filePath
                _this.frontfileList = [file]
                Message({
                    type: 'success',
                    message: "操作成功！"
                });
            } else {
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
            if (data.message == 'success') {
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
            } else {
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
            if (data.message == 'success') {
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
            } else {
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
            if (data.message == 'success') {
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
            } else {
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
            if (data.message == 'success') {
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
            } else {
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
            MessageBox.confirm(`确定移除 ${file.fileOrgName}？`).then(() => {
                api.accessory.del([file], function (result) {
                    let data = result.data;
                    if (data.code === 'success') {
                        _this.frontfileList.splice(_this.frontfileList.indexOf(file), 1);
                        _this.param.cardPic1 = ''
                        Message({
                            type: 'success',
                            message: "操作成功！"
                        });
                    } else {
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
            MessageBox.confirm(`确定移除 ${file.fileOrgName}？`).then(() => {
                api.accessory.del([file], function (result) {
                    let data = result.data;
                    if (data.code === 'success') {
                        _this.reversefileList.splice(_this.frontfileList.indexOf(file), 1);
                        _this.param.cardPic2 = ''
                        Message({
                            type: 'success',
                            message: "操作成功！"
                        });
                    } else {
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
            MessageBox.confirm(`确定移除 ${file.fileOrgName}？`).then(() => {
                api.accessory.del([file], function (result) {
                    let data = result.data;
                    if (data.code === 'success') {
                        _this.brand1fileList.splice(_this.frontfileList.indexOf(file), 1);
                        _this.param.cardPic3 = ''
                        Message({
                            type: 'success',
                            message: "操作成功！"
                        });
                    } else {
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
            MessageBox.confirm(`确定移除 ${file.fileOrgName}？`).then(() => {
                api.accessory.del([file], function (result) {
                    let data = result.data;
                    if (data.code === 'success') {
                        _this.brand2fileList.splice(_this.frontfileList.indexOf(file), 1);
                        _this.param.cardPic4 = ''
                        Message({
                            type: 'success',
                            message: "操作成功！"
                        });
                    } else {
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
            MessageBox.confirm(`确定移除 ${file.fileOrgName}？`).then(() => {
                api.accessory.del([file], function (result) {
                    let data = result.data;
                    if (data.code === 'success') {
                        _this.brand3fileList.splice(_this.frontfileList.indexOf(file), 1);
                        _this.param.cardPic5 = ''
                        Message({
                            type: 'success',
                            message: "操作成功！"
                        });
                    } else {
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
        //添加券内容
        addContainer() {
            const _this = this;
            _this.$refs.myModalRef.show()
        },
        //查询券内容明细
        queryCouponTemplateDetailInfoNoPage() {
            const _this = this;
            api.ticketTemlate.queryCouponTemplateDetailInfoNoPage({
                couponTemplateCode: _this.param.couponTemplateCode
            }, (msg) => {
                if (msg.data.message == 'success') {
                    _this.containerlist = msg.data.obj
                    
                }
            })
        },
        //删除券内容明细
        deleteDetail() {
            const _this = this;
            if (_this.selCont == null) {
                Message({
                    type: 'warning',
                    message: '请选择数据！'
                });
            } else {
                let obj = {
                    isDeleted : 1,
                    id: _this.selCont.id,
                    couponTemplateCode: _this.selCont.couponTemplateCode,
                    couponTemplateDetailCode: _this.selCont.couponTemplateDetailCode,
                    detailType: _this.selCont.detailType,
                    discountType: _this.selCont.discountType,
                    discountValue: _this.selCont.discountValue,
                }
                api.ticketTemlate.editCouponTemplateDetailInfo([obj],(msg)=>{
                    if (msg.data.message == 'success') {
                        Message({
                            type: 'success',
                            message: '操作成功！'
                        });
                        _this.queryCouponTemplateDetailInfoNoPage()
                        _this.selCont = null
                    }
                })
            }
        },
        //保存
        preserve() {
            const _this = this;
            _this.state = {
                couponTemplateCode: null,
                // couponAmout: null,
                couponTemplateName: null,
                couponTypeCode: null,
                couponTemplateStatus: null,
                applyOrgCode: null,
                applyEmpName: null,
                couponUseTypeCode: null,
                couponPrefix: null,
                useNatureTypeCode: null,
                couponExpireType: null,
                expirePeriod: null,
                expireDate: null
            }
            if (_this.param.couponTemplateName == null) {
                _this.state.couponTemplateName = 'invalid'
            }
            // if (_this.param.couponAmout < 0) {
            //     _this.state.couponAmout = 'invalid'
            // }
            if (!_this.param.couponPrefix) {
                _this.state.couponPrefix = 'invalid'
            } else if (!(/^[A-Za-z]+$/.test(_this.param.couponPrefix))) {
                _this.state.couponPrefix = 'invalid'
            }
            if (!_this.param.applyOrgCode) {
                _this.state.applyOrgCode = true

            }
            if (_this.param.couponUseTypeCode == null) {
                _this.state.couponUseTypeCode = 'invalid'
            }
            if (_this.param.useNatureTypeCode == null) {
                _this.state.useNatureTypeCode = 'invalid'
            }
            if (_this.param.couponExpireType == null) {
                _this.state.couponExpireType = 'invalid'
            }
            if (_this.param.hasTimestamp == 1) {
                if (!_this.param.timestampFormat) {
                    _this.state.timestampFormat = 'invalid'
                }
            }
            if (_this.param.couponExpireType == 0) {
                //固定时长
                if (_this.param.expirePeriod <= 0) {
                    _this.state.expirePeriod = 'invalid'
                    _this.state.expireDate = null
                }
                if (!Number.isInteger(parseFloat(_this.param.expirePeriod))) {
                    _this.state.expirePeriod = 'invalid'
                    _this.state.expireDate = null
                }
            } else {
                if (_this.param.expireDate == "") {
                    _this.state.expireDate = 'invalid'
                    _this.state.expirePeriod = null
                }
            }
            if (!(_this.param.expireDate == "")) {
                _this.param.expireDate = common.formattingTime([_this.param.expireDate, _this.param.expireDate]).endTime
            }
            // || _this.param.couponAmout < 0
            if (_this.param.couponTemplateName == null  || !_this.param.couponPrefix || !(/^[A-Za-z]+$/.test(_this.param.couponPrefix)) || !_this.param.applyOrgCode || _this.param.couponUseTypeCode == null || _this.param.useNatureTypeCode == null || _this.param.couponExpireType == null || ((_this.param.expirePeriod <= 0 || !Number.isInteger(parseFloat(_this.param.expirePeriod))) && _this.param.expireDate == "")) {
                return;
            }
            if (_this.param.hasTimestamp == 1) {
                if (!_this.param.timestampFormat) {
                    return;
                }
            }
            if (_this.detailShow) {
                api.ticketTemlate.updateCouponTemplateInfo(_this.param, (msg) => {
                    if (msg.data.message == 'success') {
                        Message({
                            type: 'success',
                            message: "操作成功！"
                        });
                        _this.detailShow = true
                    }
                })
            } else {
                api.ticketTemlate.insertCouponTemplateInfo(_this.param, (msg) => {
                    if (msg.data.message == 'success') {
                        _this.param.id = msg.data.obj.id
                        Message({
                            type: 'success',
                            message: "操作成功！"
                        });
                        _this.detailShow = true
                    }
                })
            }
        },
        getOrg(val) {
            this.param.applyOrgCode = val.code;
            this.param.applyOrgName = val.name;
        },
        //查询数据字典
        getDataDictionarys(code, cb = () => { }) {
            const _this = this;
            api.ref.getDataDictionarys({
                refCode: code
            }, (msg) => {
                if (msg.data.message == 'success') {
                    let data = msg.data.obj.referenceDetailInfos
                    let list = []
                    for (let i = 0; i < data.length; i++) {
                        list[i] = {
                            text: data[i].refDetailName,
                            value: data[i].refDetailCode
                        }
                    }
                    cb(list)
                }
            })
        }
    },
    watch:{
        disabled:function(){
            const _this = this;
            if(_this.disabled){
                delete _this.fieldsContainer.operate
            }
        }
    },
    created() {
    	console.log(this.$route)
        const _this = this;
        _this.getDataDictionarys('CouponType', (msg) => {
            _this.userTypeList = msg
        })
        _this.getDataDictionarys('CouponUserType', (msg) => {
            _this.cardUseTypeList = msg
        })
        _this.getDataDictionarys('UseProperty', (msg) => {
            _this.useNatureTypeList = msg
        })
        _this.getDataDictionarys('ChannelCode', (msg) => {
            _this.additionalSelect.canalList.option = msg
            _this.additionalSelectprice.canalList.option = msg
        })
        api.ticketManage.queryMainInfoCard({
            couponTemplateCode: _this.$route.params.code                   
        },(msg)=>{
            if(msg.data.message == 'success'){
                let data = msg.data.obj || {}
                _this.param = {
                    id:data.id,
                    couponTemplateCode: data.couponTemplateCode,
                    // couponAmout: 0,
                    couponDescription:data.couponDescription,
                    remark:data.remark,
                    couponRules:data.couponRules,
                    applyOrgName:data.applyOrgName,
                    applyOrgCode:data.applyOrgCode,
                    couponTemplateName: data.couponTemplateName,
                    couponTypeCode: data.couponTypeCode,
                    couponPrefix:data.couponPrefix,
                    timestampFormat:data.timestampFormat,
                    couponTemplateStatus: data.couponTemplateStatus,
                    applyOrgCode: data.applyOrgCode,
                    applyEmpName: data.applyEmpName,
                    couponUseTypeCode: data.couponUseTypeCode,
                    useNatureTypeCode: data.useNatureTypeCode,
                    couponExpireType: data.couponExpireType,
                    expirePeriod: data.expirePeriod || '',
                    makeStatus: data.makeStatus,
                    hasTimestamp: data.hasTimestamp,
                }
                if(this.param.couponExpireType==1){
                	this.param.expireDate = new Date(data.startDate).Format('yyyy-MM-dd')+" - " +new Date(data.endDate).Format('yyyy-MM-dd')
                }else{
                	this.param.expireDate = ''
                }
                _this.detailShow = true
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
                _this.queryCouponTemplateUseRangeInfoNoPage()
                _this.queryCouponTemplatePriceRangeInfoNoPage()
                _this.queryCouponTemplateDetailInfoNoPage()
            }
        })
        api.accessory.list({
                relationCode: _this.$route.params.code
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
    }
}
</script>
<style>
.cardModelLine {
    border-bottom: 1px solid #ccc;
    padding-bottom: 20px;
    margin-bottom: 20px;
}
.staticTime > .container-fluid {
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
.car-template .inp-invalid input {
    border-color: #f86c6b !important;
}
.nav-tabs {
    outline: none;
}
.car-template .upload {
    border: none !important;
    background-color: #fff;
    box-shadow: none !important;
    border-radius: 4px;
    display: inline-block;
}
.car-template .upload .upload_warp_img_div {
    margin-left: 0 !important;
}
.car-template .upload .upload_warp {
    margin-left: 0 !important;
    margin-right: 0 !important;
}
</style>