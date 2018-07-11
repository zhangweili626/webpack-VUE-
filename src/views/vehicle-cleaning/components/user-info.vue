<template>
    <div class="row vehicle-cleaning-user-info">
        <div class="col-md-4 col-lg-4 text-center p-0">
            <h6 class="mb-3">驾驶证IMG</h6>
            <upload-img
            :on-success="handleSuccess"
            :on-error="onError"
            :file-list="fileList"
            :parame="uploadParams"
            :on-remove="handleRemove"
            :uploadBefore="uploadBefore"
            :disabled='disabled'
            ></upload-img>
            <div class="mt-4">
                <span v-if="iscardvoucher">持有卡<a  class="ml-2" href="javascript:;" @click="modalShow">{{holdingCard}}</a></span>
                <span v-if="iscardvoucher" class="ml-2">持有券<a class="ml-2 vehicle-cleaning-red" href="javascript:;" @click="showTicketModal">{{holdingCoupon}}</a></span>
            </div>
        </div>
        <div class="col-md-8 col-lg-8">
            <b-form-fieldset horizontal label="生日" label-text-align="left" :label-cols="4">
                <div class="form-control" v-if="!status.birthdayUpdata" @click="updataStatus('birthday')">{{customerInfoVo.birthday}}&nbsp;</div>
                <div class="row" v-if="status.birthdayUpdata">
                    <div class="col-md-8 col-lg-8 birthday-date-picker">
                        <el-date-picker
                            :clearable="false"
                            v-model="newCustomerInfoVo.birthday"
                            type="date"
                            placeholder="选择日期"
                            >
                        </el-date-picker>
                    </div>
                    <div class="col-md-4 col-lg-4 birthday">
                        <i class="el-icon-circle-check" @click="updataUserInfo('birthday')"></i>
                        <i class="el-icon-circle-cross" @click="resetUserInfo('birthday')"></i>
                    </div>
                </div>
            </b-form-fieldset>
            <b-form-fieldset horizontal label="email" label-text-align="left" :label-cols="4">
                <div class="form-control" v-if="!status.emailUpdata" @click="updataStatus('email')">{{customerInfoVo.email}}&nbsp;</div>
                <el-input placeholder="请输入内容" v-if="status.emailUpdata" v-model="newCustomerInfoVo.email">
                    <template slot="append">
                        <i class="el-icon-circle-check" @click="updataUserInfo('email')"></i>
                        <i class="el-icon-circle-cross" @click="resetUserInfo('email')"></i>
                    </template>
                </el-input>
            </b-form-fieldset>
            <b-form-fieldset horizontal label="身份证" label-text-align="left" :label-cols="4">
                <div class="form-control" v-if="!status.idNoUpdata" @click="updataStatus('idNo')">{{customerInfoVo.idNo}}&nbsp;</div>
                <el-input placeholder="请输入内容" v-if="status.idNoUpdata" v-model="newCustomerInfoVo.idNo">
                    <template slot="append">
                        <i class="el-icon-circle-check" @click="updataUserInfo('idNo')"></i>
                        <i class="el-icon-circle-cross" @click="resetUserInfo('idNo')"></i>
                    </template>
                </el-input>
            </b-form-fieldset>
            <b-form-fieldset horizontal label="准驾车型" label-text-align="left" :label-cols="4">
                <div class="form-control" v-if="!status.certificateProperty1Updata" @click="updataStatus('certificateProperty1')">{{customerInfoVo.certificateProperty1}}&nbsp;</div>
                <el-input placeholder="请输入内容" v-if="status.certificateProperty1Updata" v-model="newCustomerInfoVo.certificateProperty1">
                    <template slot="append">
                        <i class="el-icon-circle-check" @click="updataUserInfo('certificateProperty1')"></i>
                        <i class="el-icon-circle-cross" @click="resetUserInfo('certificateProperty1')"></i>
                    </template>
                </el-input>
            </b-form-fieldset>
            <b-form-fieldset horizontal label="初次领证日期" label-text-align="left" :label-cols="4">
                <div class="form-control" v-if="!status.firstGetDateUpdata" @click="updataStatus('firstGetDate')">{{customerInfoVo.firstGetDate}}&nbsp;</div>
                <div class="row" v-if=" status.firstGetDateUpdata">
                    <div class="col-md-8 col-lg-8 birthday-date-picker">
                        <el-date-picker
                            :clearable="false"
                            v-model="newCustomerInfoVo.firstGetDate"
                            type="date"
                            placeholder="选择日期"
                            >
                        </el-date-picker>
                    </div>
                    <div class="col-md-4 col-lg-4 birthday">
                        <i class="el-icon-circle-check" @click="updataUserInfo('firstGetDate')"></i>
                        <i class="el-icon-circle-cross" @click="resetUserInfo('firstGetDate')"></i>
                    </div>
                </div>
            </b-form-fieldset>
            <b-form-fieldset horizontal label="驾照到期日期" label-text-align="left" :label-cols="4">
                <div class="form-control" v-if="!status.expireDateUpdata" @click="updataStatus('expireDate')">{{customerInfoVo.expireDate}}&nbsp;</div>
                <div class="row" v-if="status.expireDateUpdata">
                    <div class="col-md-8 col-lg-8 birthday-date-picker">
                        <el-date-picker
                            :clearable="false"
                            v-model="newCustomerInfoVo.expireDate"
                            type="date"
                            placeholder="选择日期"
                            >
                        </el-date-picker>
                    </div>
                    <div class="col-md-4 col-lg-4 birthday">
                        <i class="el-icon-circle-check" @click="updataUserInfo('expireDate')"></i>
                        <i class="el-icon-circle-cross" @click="resetUserInfo('expireDate')"></i>
                    </div>
                </div>
            </b-form-fieldset>
            </div>
    </div>
</template>
<script>
import Vue from 'vue'
import {Input, Message, MessageBox} from 'element-ui'
import api from 'common/api.js'
import common from 'common/common.js'
import config from 'common/config'
import uploadImg from"components/iris-upload-2.1"
Vue.use(Input)
export default {
    model:{
        props:'file',
        event:'change',
    },
    components: {
        uploadImg,
    },
    props: {
        customerInfo: {
            type: Object,
            default: function(){
                return {}
            }
        },
        iscardvoucher: {
            type: Boolean,
            default: true
        },
        orderNo: {
            type: String,
            default: function(){
                return ''
            }
        },
        holdingCard:{
            type: Number,
            default: function(){
                return 0
            }
        },
        holdingCoupon:{
            type: Number,
            default: function(){
                return 0
            }
        },
        disabled:{
            type: Boolean,
            default: function(){
                return false
            }
        },
        file:{
            type: Array,
            default: function(){
                return []
            }
        }
    },
    data() {
        return {
            uploadParams:{
                relationCode: "",
                singleFlag: 0,
                businessType: 'driverlicense'
            },
            status:{
                birthdayUpdata:false,
                emailUpdata:false,
                idNoUpdata:false,
                certificateProperty1Updata:false,
                firstGetDateUpdata:false,
                expireDateUpdata:false,
            },
            newCustomerInfoVo:{},
            fileList:this.file
        }
    },
    computed:{
        customerInfoVo:function(){
            const _this = this
            return this.customerInfo
        },
    },
    mounted(){
        const _this = this
        _this.uploadParams.relationCode = _this.customerInfoVo.customCode;
            if(_this.uploadParams.relationCode){
                api.accessory.list({
                relationCode: _this.uploadParams.relationCode
                }, function (result) {
                if(result.data.code === 'success') {
                    let data = result.data.obj
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        element.name = element.fileOrgName
                        element.url =  common.getUploadUrl() + element.filePath
                        if(element.businessType == _this.uploadParams.businessType){
                            _this.fileList = [element]
                            _this.$emit('change',_this.fileList)
                        }
                    }
                }
                })
            }
        _this.newCustomerInfoVo = JSON.parse(JSON.stringify(_this.customerInfoVo))
    },
    watch:{
        file:{
            handler:function(){
                this.fileList = this.file
                console.log(this.fileList)
            },
            deep:true
        },
        customerInfoVo:{
            handler:function(){
                const _this = this
                _this.uploadParams.relationCode = _this.customerInfoVo.customCode;
                if(_this.uploadParams.relationCode){
                    api.accessory.list({
                    relationCode: _this.uploadParams.relationCode
                    }, function (result) {
                    if(result.data.code === 'success') {
                        let data = result.data.obj
                        for (let i = 0; i < data.length; i++) {
                            const element = data[i];
                            element.name = element.fileOrgName
                            element.url =  common.getUploadUrl() + element.filePath
                            if(element.businessType == _this.uploadParams.businessType){
                                _this.fileList = [element]
                                _this.$emit('change',_this.fileList)
                            }
                        }
                    }
                    })
                }
                _this.newCustomerInfoVo = JSON.parse(JSON.stringify(_this.customerInfoVo))
            },
            deep:true
        }
    },
    methods: {
        showTicketModal(){
            const _this = this
            _this.$emit('showTicketModal') 
        },
        modalShow(){
            const _this = this
            _this.$emit('modalShow')            
        },
        updataUserInfo(type){
            const _this = this
            if(_this.customerInfoVo.id){
                if(type=='birthday'){
                    if(_this.newCustomerInfoVo.birthday){
                        _this.newCustomerInfoVo.birthday = common.formattingTime([_this.newCustomerInfoVo.birthday,_this.newCustomerInfoVo.birthday]).endTime
                        api.mancar.update({
                            id:_this.customerInfoVo.id,
                            customCode:_this.customerInfoVo.customCode,
                            customName:_this.customerInfoVo.customName,
                            mobilePhone:_this.customerInfoVo.mobilePhone,
                            birthday:_this.newCustomerInfoVo.birthday,
                        },(msg)=>{
                            if(msg.data.message == 'success'){
                                Message({
                                    type: 'success',
                                    message: "操作成功！"
                                });
                                _this.customerInfoVo.birthday=_this.newCustomerInfoVo.birthday,
                                _this.status.birthdayUpdata = false
                            }
                        })
                    }
                }else if(type=='email'){
                    api.mancar.update({
                        id:_this.customerInfoVo.id,
                        customCode:_this.customerInfoVo.customCode,
                        customName:_this.customerInfoVo.customName,
                        mobilePhone:_this.customerInfoVo.mobilePhone,
                        email:_this.newCustomerInfoVo.email,
                    },(msg)=>{
                        if(msg.data.message == 'success'){
                            Message({
                                type: 'success',
                                message: "操作成功！"
                            });
                            _this.customerInfoVo.email=_this.newCustomerInfoVo.email,
                            _this.status.emailUpdata = false
                        }
                    })
                }else if(type=='idNo'){
                    api.mancar.update({
                        id:_this.customerInfoVo.id,
                        customCode:_this.customerInfoVo.customCode,
                        customName:_this.customerInfoVo.customName,
                        mobilePhone:_this.customerInfoVo.mobilePhone,
                        idNo:_this.newCustomerInfoVo.idNo,
                        idType:"ID"
                    },(msg)=>{
                        if(msg.data.message == 'success'){
                            Message({
                                type: 'success',
                                message: "操作成功！"
                            });
                            _this.customerInfoVo.idNo=_this.newCustomerInfoVo.idNo,
                            _this.status.idNoUpdata = false
                        }
                    })
                }else if(type=='certificateProperty1'){
                    if(!_this.customerInfoVo.credentialsId){
                        if(_this.customerInfoVo.idNo){
                            api.ordinalInfo.getSequence({
                                serviceCode: 'CUSIDTYPE'                    
                            },(msg)=>{
                                if(msg.data.message == 'success'){
                                    let Sequence = msg.data.obj
                                    api.vehicleCleaning.insertcertificateTypeInfo({
                                        customCode:_this.customerInfoVo.customCode,
                                        customName:_this.customerInfoVo.customName,
                                        certificateCode:Sequence,
                                        certificateType:'DriverLicense',
                                        certificateNumber:_this.newCustomerInfoVo.idNo,
                                        certificateProperty1:_this.newCustomerInfoVo.certificateProperty1,
                                    },(msg)=>{
                                        if(msg.data.message == 'success'){
                                            Message({
                                                type: 'success',
                                                message: "操作成功！"
                                            });
                                            let data = msg.data.obj
                                            _this.customerInfoVo.credentialsId = data.id
                                            _this.customerInfoVo.certificateCode = data.certificateCode
                                            _this.customerInfoVo.certificateType = data.certificateType
                                            _this.customerInfoVo.certificateProperty1 = _this.newCustomerInfoVo.certificateProperty1,
                                            _this.customerInfoVo.certificateNumber = data.certificateNumber
                                            _this.status.certificateProperty1Updata = false                            
                                        }
                                    })
                                }
                            })
                        }else{
                            Message({
                                type: 'warning',
                                message: "请填写身份证号！"
                            });
                        }
                        
                    }else{
                        api.mancar.updatecertificateTypeInfo({
                            id:_this.customerInfoVo.credentialsId,
                            certificateCode:_this.customerInfoVo.certificateCode,
                            certificateType:_this.customerInfoVo.certificateType,
                            certificateNumber:_this.customerInfoVo.certificateNumber,
                            customCode:_this.customerInfoVo.customCode,
                            customName:_this.customerInfoVo.customName,
                            certificateProperty1:_this.newCustomerInfoVo.certificateProperty1,
                        },(msg)=>{
                            if(msg.data.message == 'success'){
                                Message({
                                    type: 'success',
                                    message: "操作成功！"
                                });
                                _this.customerInfoVo.certificateProperty1 = _this.newCustomerInfoVo.certificateProperty1,
                                _this.status.certificateProperty1Updata = false                            
                            }
                        })
                    }
                }else if(type=='firstGetDate'){
                    if(_this.newCustomerInfoVo.firstGetDate){
                        _this.newCustomerInfoVo.firstGetDate = common.formattingTime([_this.newCustomerInfoVo.firstGetDate,_this.newCustomerInfoVo.firstGetDate]).endTime
                    if(!_this.customerInfoVo.credentialsId){
                        if(_this.customerInfoVo.idNo){
                            api.ordinalInfo.getSequence({
                                serviceCode: 'CUSIDTYPE'                    
                            },(msg)=>{
                                if(msg.data.message == 'success'){
                                    let Sequence = msg.data.obj
                                    api.vehicleCleaning.insertcertificateTypeInfo({
                                        customCode:_this.customerInfoVo.customCode,
                                        customName:_this.customerInfoVo.customName,
                                        certificateCode:Sequence,
                                        certificateType:'DriverLicense',
                                        certificateNumber:_this.newCustomerInfoVo.idNo,
                                        firstGetDate:_this.newCustomerInfoVo.firstGetDate,
                                    },(msg)=>{
                                        if(msg.data.message == 'success'){
                                            Message({
                                                type: 'success',
                                                message: "操作成功！"
                                            });
                                            let data = msg.data.obj
                                            _this.customerInfoVo.credentialsId = data.id
                                            _this.customerInfoVo.certificateCode = data.certificateCode
                                            _this.customerInfoVo.certificateType = data.certificateType
                                            _this.customerInfoVo.firstGetDate = _this.newCustomerInfoVo.firstGetDate,
                                            _this.customerInfoVo.certificateNumber = data.certificateNumber
                                            _this.status.certificateProperty1Updata = false                            
                                        }
                                    })
                                }
                            })
                        }else{
                            Message({
                                type: 'warning',
                                message: "请填写身份证号！"
                            });
                        }
                    }else{
                        api.mancar.updatecertificateTypeInfo({
                            id:_this.customerInfoVo.credentialsId,
                            certificateCode:_this.customerInfoVo.certificateCode,
                            certificateType:_this.customerInfoVo.certificateType,
                            certificateNumber:_this.customerInfoVo.certificateNumber,
                            customCode:_this.customerInfoVo.customCode,
                            customName:_this.customerInfoVo.customName,
                            firstGetDate:_this.newCustomerInfoVo.firstGetDate,
                        },(msg)=>{
                            if(msg.data.message == 'success'){
                                Message({
                                    type: 'success',
                                    message: "操作成功！"
                                });
                                _this.customerInfoVo.firstGetDate = _this.newCustomerInfoVo.firstGetDate,
                                _this.status.firstGetDateUpdata = false
                            }
                        })
                    }
                    }
                }else if(type=='expireDate'){
                    if(_this.newCustomerInfoVo.expireDate){
                        _this.newCustomerInfoVo.expireDate = common.formattingTime([_this.newCustomerInfoVo.expireDate,_this.newCustomerInfoVo.expireDate]).endTime
                    if(!_this.customerInfoVo.credentialsId){
                        if(_this.customerInfoVo.idNo){
                            api.ordinalInfo.getSequence({
                                serviceCode: 'CUSIDTYPE'                    
                            },(msg)=>{
                                if(msg.data.message == 'success'){
                                    let Sequence = msg.data.obj
                                    api.vehicleCleaning.insertcertificateTypeInfo({
                                        customCode:_this.customerInfoVo.customCode,
                                        customName:_this.customerInfoVo.customName,
                                        certificateCode:Sequence,
                                        certificateType:'DriverLicense',
                                        certificateNumber:_this.newCustomerInfoVo.idNo,
                                        expireDate:_this.newCustomerInfoVo.expireDate,
                                    },(msg)=>{
                                        if(msg.data.message == 'success'){
                                            Message({
                                                type: 'success',
                                                message: "操作成功！"
                                            });
                                            let data = msg.data.obj
                                            _this.customerInfoVo.credentialsId = data.id
                                            _this.customerInfoVo.certificateCode = data.certificateCode
                                            _this.customerInfoVo.certificateType = data.certificateType
                                            _this.customerInfoVo.expireDate = _this.newCustomerInfoVo.expireDate,
                                            _this.customerInfoVo.certificateNumber = data.certificateNumber
                                            _this.status.certificateProperty1Updata = false                            
                                        }
                                    })
                                }
                            })
                        }else{
                            Message({
                                type: 'warning',
                                message: "请填写身份证号！"
                            });
                        }    
                    }else{
                        api.mancar.updatecertificateTypeInfo({
                            id:_this.customerInfoVo.credentialsId,
                            certificateCode:_this.customerInfoVo.certificateCode,
                            certificateType:_this.customerInfoVo.certificateType,
                            certificateNumber:_this.customerInfoVo.certificateNumber,
                            customCode:_this.customerInfoVo.customCode,
                            customName:_this.customerInfoVo.customName,
                            expireDate:_this.newCustomerInfoVo.expireDate,
                        },(msg)=>{
                            if(msg.data.message == 'success'){
                                Message({
                                    type: 'success',
                                    message: "操作成功！"
                                });
                               _this.customerInfoVo.expireDate = _this.newCustomerInfoVo.expireDate
                                _this.status.expireDateUpdata = false
                            }
                        })
                    }
                    }
                }
            }
        },
        updataStatus(type){
            const _this = this
            if(_this.customerInfoVo.id && !this.disabled){
                if(type=='birthday'){
                    _this.status.birthdayUpdata = true
                }else if(type=='email'){
                    _this.status.emailUpdata = true
                }else if(type=='idNo'){
                    _this.status.idNoUpdata = true
                }else if(type=='certificateProperty1'){
                    _this.status.certificateProperty1Updata = true
                }else if(type=='firstGetDate'){
                    _this.status.firstGetDateUpdata = true
                }else if(type=='expireDate'){
                    _this.status.expireDateUpdata = true
                }
            }
        },
        resetUserInfo(type){
            const _this = this
            if(_this.customerInfoVo.id){
                if(type=='birthday'){
                    _this.status.birthdayUpdata = false
                }else if(type=='email'){
                    _this.status.emailUpdata = false
                }else if(type=='idNo'){
                    _this.status.idNoUpdata = false
                }else if(type=='certificateProperty1'){
                    _this.status.certificateProperty1Updata = false
                }else if(type=='firstGetDate'){
                    _this.status.firstGetDateUpdata = false
                }else if(type=='expireDate'){
                    _this.status.expireDateUpdata = false
                }
            }
        },
        // resetUserInfo(type){
        //     const _this = this
        //     if(_this.customerInfoVo.id){
        //         if(type=='birthday'){
        //             _this.customerInfoVo.birthday = ""
        //         }else if(type=='email'){
        //             _this.customerInfoVo.email = ""
        //         }else if(type=='idNo'){
        //             _this.customerInfoVo.idNo = ""
        //         }else if(type=='certificateProperty1'){
        //             _this.customerInfoVo.certificateProperty1 = ""
        //         }else if(type=='firstGetDate'){
        //             _this.customerInfoVo.firstGetDate = ""
        //         }else if(type=='expireDate'){
        //             _this.customerInfoVo.expireDate = ""
        //         }
        //     }
        // },
        uploadBefore(){
           const _this = this
            if(!_this.customerInfoVo.customCode) {
                // Message({
                //     type: 'warning',
                //     message: "请填写单号！"
                // });
                // return false;
            }            
            return true;
        },
        handleRemove(file){
           const _this = this
                MessageBox.confirm(`确定移除 ${ file.fileOrgName }？`).then(() => {					
					api.accessory.del([file], function (result) {
						let data = result.data;
						if(data.code === 'success') {
                            _this.fileList = [];    
                            _this.$emit('change',_this.fileList)
                            Message({
                               type: 'success',
                               message: "操作成功！"
                            });
						}else{
                            _this.fileList = [file]
                            _this.$emit('change',_this.fileList)
                            Message({
                               type: 'error',
                               message: "操作失败！"
                            });
                        }
					})				
				}).catch(() => {
                    _this.fileList = [file]	
                    _this.$emit('change',_this.fileList)
				});
        },
        onError(res){
            console.log(res)
        },
        handleSuccess(res){
            var file = res.data
            const _this = this
            if(file.message == 'success'){
                var file = file.obj[0]
                file.url = common.getUploadUrl() + file.filePath
                _this.$set(_this.fileList,_this.fileList.length,file)
                _this.$emit('change',_this.fileList)

                Message({
                    type: 'success',
                    message: "操作成功！"
                });
            }else{
                Message({
                    type: 'error',
                    message: "上传失败！"
                });
                _this.fileList = []
                _this.$emit('change',_this.fileList)
            }
        },
    },
};
</script>
<style>
    .vehicle-cleaning-user-info .el-icon-circle-check{
        color: #13ce66;
    }
    .vehicle-cleaning-user-info .el-icon-circle-cross{
        color: #ff4949;
    }
    .vehicle-cleaning-user-info .el-input-group__append{
        background-color:#fff;
        color:none;
        border:none;
    }
    .vehicle-cleaning-user-info .birthday{
        padding-left: 8px;
        padding-top: 8px;
    }
    .vehicle-cleaning-user-info .birthday-date-picker{
        padding-right: 2px;
    }
    .vehicle-cleaning-user-info .b-form-group.form-group{
        margin-bottom: 6px;
    }
</style>
