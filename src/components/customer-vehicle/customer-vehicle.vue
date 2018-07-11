<template>
    <el-dialog ref="dialog" 
        title="人车" 
        no-close-on-backdrop 
        size="large" :before-close="hideEmpCarModal" :visible.sync="dialogVisible"  :modal-append-to-body="false">
        <!-- 基本信息 -->
        <b-card header="基本信息">
            <div class="row">
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="移动电话*" :label-cols="4" class="text-right">
                        <b-form-input v-model="customerInfo.mobilePhone" @blur.native="mobilePhoneBlur" :state="mobilePhoneState"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="客户姓名*" :label-cols="4" class="text-right">
                        <b-form-input v-model="customerInfo.customName" :state="customNameState"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="客户性别" :label-cols="4" class="text-right">
                        <b-form-select v-model="customerInfo.gender" :options="customerSex"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="客户类型" :label-cols="4" class="text-right">
                        <b-form-select v-model="customerInfo.customType" :options="customType"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="证件类型" :label-cols="4" class="text-right">
                        <b-form-select 
                            v-model="customerInfo.idType" 
                            :options="certificateType">
                        </b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="证件号码" :label-cols="4" class="text-right">
                        <b-form-input v-model="customerInfo.idNo" />
                        <!-- @blur.native="idNoBlur" :state="idNoState" -->
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="生日" :label-cols="4" class="text-right">
                        <el-date-picker
                            type="date"
                            v-model="customerInfo.birthday"
                            placeholder="选择日期">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="邮箱" :label-cols="4" class="text-right">
                        <b-form-input v-model="customerInfo.email" @blur.native="emailBlur" :state="emailState"/>
                    </b-form-fieldset>
                </div>
            </div>
        </b-card>
        <!-- 车辆信息 -->
        <b-card header="车辆信息" v-show="cardUseTypeCode == 'VehicleCard'">
            <b-button size="sm" 
                variant="primary" 
                class="car-list-btn" 
                v-show="carListBtn"
                @click="carListBtnClick">
                车辆列表
            </b-button>   
            <b-button size="sm" 
                variant="success" 
                class="add-car-btn"
                @click="insertCarBtnClick" >
                新增车辆
            </b-button>  
            <!-- 新增车辆信息 -->
            <div v-show="!showCarList">
                <div class="row">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="车牌" :label-cols="4" class="text-right">
                            <b-form-input v-model="customerInfo.plateNumber" 
                                :readonly="disabledPlateNumber"/>
                                <!-- :state="plateNumberState"  -->
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="临牌" :label-cols="4" class="text-right">
                            <b-form-input v-model="customerInfo.plateNumberTmp"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="VIN码" :label-cols="4" class="text-right">
                            <b-form-input v-model="customerInfo.vinCode"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12 text-right">
                        <el-checkbox v-model="isDefaultCar">是否默认车辆</el-checkbox>
                    </div>
                </div>
                <hr>
                <p>添加车辆信息</p>
                <hr>
                <select-car-extend-prop 
                    @getCarExtendInfo="getCarExtendInfo" 
                    ref="selectCarExtendProp">
                </select-car-extend-prop>
                <hr>
                <p>其他信息</p>
                <hr>
                <div class="row">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="上牌日" :label-cols="4" class="text-right">
                            <el-date-picker
                                type="date"
                                v-model="customerInfo.plateDate"
                                placeholder="选择日期">
                            </el-date-picker>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="商业险到期" :label-cols="4" class="text-right">
                            <el-date-picker
                                type="date"
                                v-model="customerInfo.commercialInsuranceEndDate"
                                placeholder="选择日期">
                            </el-date-picker>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="交强险到期" :label-cols="4" class="text-right">
                            <el-date-picker
                                type="date"
                                v-model="customerInfo.compulsoryInsuranceEndDate"
                                placeholder="选择日期">
                            </el-date-picker>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="进厂里程" :label-cols="4" class="text-right">
                            <b-form-input type="number" v-model="customerInfo.inMileage"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="商业险公司" :label-cols="4" class="text-right">
                            <search
                                ref="search"
                                :dataList="datalist"
                                option="coName"
                                @dataChange="querySelect"
                                @itemValue="itemClick"
                                @clickShowBack="firstLoad"
                                @clearValue="clearValue"
                                @comScroll="scrollBottom">
                            </search>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="交强险公司" :label-cols="4" class="text-right">
                            <search
                                ref="_search"
                                :dataList="datalist"
                                option="coName"
                                @dataChange="querySelect"
                                @itemValue="_itemClick"
                                @clickShowBack="firstLoad"
                                @clearValue="_clearValue"
                                @comScroll="scrollBottom">
                            </search>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="保险备注" :label-cols="4" class="text-right">
                            <b-form-input v-model="customerInfo.commercialInsuranceCompanyRemark" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="车辆备注" :label-cols="4" class="text-right">
                            <b-form-textarea id="textarea1" v-model="customerInfo.vehicleRemark">
                            </b-form-textarea>
                        </b-form-fieldset>
                    </div>
                </div>
            </div>
                
            <!-- 车辆列表 -->
            <div v-show="showCarList">
                <el-table
                    :data="customerInfo.customVehicleInfoVos"
                    tooltip-effect="dark"
                    height="200"
                    border>
                        <el-table-column
                            label="选择"
                            type="radio">
                            <template slot-scope="scope">
                                <input type="radio" name="radio" :value="scope.$index" v-model="selIndex"/>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="plateNumber"
                            label="车牌"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="plateNumberTmp"
                            label="临牌"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="factoryName"
                            label="厂家"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="brandName"
                            label="品牌"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="seriesName"
                            label="车系"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="modelName"
                            label="车型"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="opvName"
                            label="排量"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="iotypeName"
                            label="进气方式"
                            width="100"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            v-for="(item, i) in addlist"
                            :key="i"
                            :label="item.addName"
                            :width="setWidth(item)"
                            show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{getAddValue(scope, item.addCode)}}
                            </template>
                        </el-table-column>
                </el-table>
            </div>

        </b-card>
        <div slot="footer" class="dialog-footer dialog-footer-cla">     
            <b-button size="sm" variant="default" @click="hideEmpCarModal">取消</b-button>
            <b-button size="sm" variant="success" @click="selectCustomerCar">选择</b-button>
        </div>
    </el-dialog>
</template>
<script>
import Vue from 'vue'
import { Message, DatePicker, MessageBox, Dialog, Checkbox, Table, TableColumn, } from 'element-ui'
Vue.use(Dialog)
Vue.use(Checkbox)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)

import SelectCarExtendProp from 'components/select-car-extend-prop/select-car-extend-prop'
import Search from 'components/iris-search/search'

import api from 'common/api'
import config from 'common/config'
import common from 'common/common'

import { getSequence, alertSuccess, formatDate, getType, getSequenceList, filter } from 'common/api-common'
import { CUSTOM, CUSTOM_VEHICLE_SEQ, CUSTOM_VEHICLE_ADD_SEQ } from 'common/sequence'
import { CERTIFICATE_TYPE, CUSTOM_TYPE } from 'common/ref-code'

Date.prototype.format = function (format) {
    //eg:format="yyyy-MM-dd hh:mm:ss";

    if (!format) {
        format = "yyyy-MM-dd hh:mm:ss";
    }

    var o = {
        "M+": this.getMonth() + 1,  // month
        "d+": this.getDate(),       // day
        "H+": this.getHours(),      // hour
        "h+": this.getHours(),      // hour
        "m+": this.getMinutes(),    // minute
        "s+": this.getSeconds(),    // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }

    return format;
}
/**
 * create by lwx on 2018/06/05 23:02
 * 
 * props: mobilePhone ( 客户手机号码 ) => 编辑时传入
 *        cardUseTypeCode = 'VehicleCard' ( 卡使用方类型 1.车辆卡 2. 车主卡) => 车辆卡时必传, 不传默认车主卡
 * 
 * emit:  selectCusVehicleInfo ( 获取人 - 车信息 ) Vo 套 List => 包含当前客户信息以及选中车辆信息
 * 
 */
export default {
    components: {
        SelectCarExtendProp,
        Search
    },
    props: {
        mobilePhone: {
            type: String,
            default: ''
        },
        cardUseTypeCode: {
            type: String,
            default: ''
        },
        plateNumber: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            // 人车 
            dialogVisible: false,
            showCarList: false,
            customerInfo: {
                idType: '',
                plateNumber: '',
                customVehicleInfoVos: [],
                plateDate: '',
                commercialInsuranceEndDate: '',
                compulsoryInsuranceEndDate: '',
                inMileage: '',
                commercialInsuranceCompanyCode: '',
                commercialInsuranceCompanyRemark: '',
                vehicleRemark: '',
                customType: 'customTypeIndividualCus'
            },
            tempCustomInfo: {},
            customerSex: [
                {text: '男', value: 1},
                {text: '女', value: 0},                
            ],
            certificateType: [],
            isDefaultCar: true,
            extendList: [],
            carSubInfo: [],          // 一辆车的时候车型( 包含扩展属性 )
            carInfoParams: {},       // 车型六大编码, => 获取主车型编码
            customNameState: null,
            mobilePhoneState: null,
            plateNumberState: null,
            emailState: null,
            idNoState: null,

            hasCustomerInfo: false,
            isInsertCusVehicle: false,   // 区分客户车辆, 新增还是编辑
            selIndex: 0,
            // 保险公司
            datalist: [],
            selectParams: {
                pageNums: config.pageNums,
                pageStart: 1
            },
            isLastPage: false,

            // 给组件使用方的数据结构 => 一人一车加上车型扩展属性
            cusVehicleInfo: {
                customCode: '',
                customName: '',
                mobilePhone: '',
                gender: '',
                idType: '',
                idNo: '',
                birthday: '',
                email: '',
                customType: '',
                customVehicleInfoVos: [{
                    vehicleCode: '',
                    plateNumber: '',
                    plateNumberTmp: '',
                    vinCode: '',
                    plateDate: '',
                    commercialInsuranceEndDate: '',
                    compulsoryInsuranceEndDate: '',
                    commercialInsuranceCompanyCode: '',
                    commercialInsuranceCompanyName: '',
                    compulsoryInsuranceCompanyCode: '',
                    compulsoryInsuranceCompanyName: '',
                    inMileage: '',
                    commercialInsuranceCompanyRemark: '',
                    vehicleRemark: '',  
                    // 主车型信息
                    factoryCode: '',
                    brandCode: '',
                    seriesCode: '',
                    modelCode: '',
                    opvCode: '',
                    iotypeCode: '',
                    // 车型扩展属性
                    customVehicleAddInfoVos: []
                }]
            },

            customType: []
        }
    },
    mounted() {
        this.getCertificateType()
        this.getCustomType()
    },
    computed: {
        addlist() {
            let list = []
            if(!this.customerInfo || !this.customerInfo.customVehicleInfoVos) {
                return []
            }
            this.customerInfo.customVehicleInfoVos.forEach(item => {
                list = list.concat(item.customVehicleAddInfoVos || [])
            })
            return filter(list, 'addCode')
        },
        carListBtn() {
            if(!this.tempCustomInfo) {
                return false
            }else if(!this.tempCustomInfo.customVehicleInfoVos 
               || this.tempCustomInfo.customVehicleInfoVos.length <= 1) {
                return false
            }else {
                return true
            }
        },
        disabledPlateNumber() {
            if(this.hasCustomerInfo && !this.isInsertCusVehicle && this.customerInfo.plateNumber) {
                return true
            }else {
                return false
            }
        }
    },
    methods: {
        setWidth(item) {
            if(item.name) {
                if(item.addName.length === 2) {
                    return 70
                }
                return item.addName.length * 26
            }
        },
        // 人车
        showEmpCarModal() { // 组件显示
            this.dialogVisible = true
//         this.mobilePhoneBlur();*/
        },
        hideEmpCarModal() { // 组件隐藏
            this.dialogVisible = false
            this.$emit('hideEmpCarModal')
        },
        carListBtnClick() {
            let params = {
                mobilePhone: this.customerInfo.mobilePhone
            }
            // if(this.plateNumber) {
            //     delete params.mobilePhone
            // }
            this.queryByPhone(params, () => {
                this.showCarList = true
            })
        },
        insertCarBtnClick() {
            this.showCarList = false
            this.isInsertCusVehicle = true
            // 重置车牌, 临牌, Vin码
            this.customerInfo.plateNumber = ''
            this.customerInfo.plateNumberTmp = ''
            this.customerInfo.vinCode = ''
            // 重置车型 - 扩展属性
            this.customerInfo.customVehicleInfoVos = []
            this.$refs.selectCarExtendProp.reset()
            // 重置其他信息
            this.customerInfo.plateDate = ''
            this.customerInfo.commercialInsuranceEndDate = ''
            this.customerInfo.compulsoryInsuranceEndDate = ''
            this.customerInfo.inMileage = ''
            this.customerInfo.commercialInsuranceCompanyCode = ''
            this.customerInfo.compulsoryInsuranceCompanyCode = ''
            this.$refs.search.setValue()
            this.$refs._search.setValue()
            this.customerInfo.commercialInsuranceCompanyRemark = ''
            this.customerInfo.vehicleRemark = ''

            this.selIndex === 0
        },
        getCertificateType() {
            getType(CERTIFICATE_TYPE, items => {
                this.certificateType = []
                items.forEach(item => {
                    let data = {
                        text: item.refDetailName,
                        value: item.refDetailCode
                    }
                    this.certificateType.push(data)
                })
            })
        },
        getCustomType() {
            getType(CUSTOM_TYPE, items => {
                this.customType = []
                items.forEach(item => {
                    let data = {
                        text: item.refDetailName,
                        value: item.refDetailCode
                    }
                    this.customType.push(data)
                })
            })
        },
        getAddValue(scope, addCode) {
            let sublist = scope.row.customVehicleAddInfoVos
            if(sublist) {
                for(let i = 0; i < sublist.length; i ++) {
                    if(addCode === sublist[i].addCode) {
                        return sublist[i].addValue
                    }
                }
            }
        },
        // 根据手机号查询客户信息
        mobilePhoneBlur() {
            if(!this.customerInfo.mobilePhone) {
                return
            }
            if(common.isMobile(this.customerInfo.mobilePhone)) {
                this.mobilePhoneState = null
            }else {
                this.mobilePhoneState = 'invalid'
                return
            } 
            let params = {
                mobilePhone: this.customerInfo.mobilePhone
            }
            this.queryByPhone(params)
        },
        queryByPhone(params, next = () => {}) {
            api.mancar.queryCustomInfoByMobilePhone(params).then(res => {
                if(res.data.code === 'success') {
                    let obj = res.data.obj
                    this.tempCustomInfo = obj
                    // 车辆卡: 四种状态
                    // 1. 无人无车: insert  => isInsertCusVehicle = true
                    // 2. 有人无车: insert  => isInsertCusVehicle = true
                    // 3. 有人一车: update  => isInsertCusVehicle = false ( 点击新增车辆, 变为insert )
                    // 4. 有人多车: update  => isInsertCusVehicle = false ( 点击新增车辆, 变为insert )
                    
                    if(obj != null) {
                        this.hasCustomerInfo = true
                        // 解决model改变, 页面不渲染问题
                        for(let key in obj) {
                            this.customerInfo[key] = obj[key]
                        }
                        if(obj.customVehicleInfoVos && obj.customVehicleInfoVos.length > 0) {
                            if(obj.customVehicleInfoVos.length == 1) {
                                this.showCarList = false
                                this.isInsertCusVehicle = false

                                let vehicleInfo = obj.customVehicleInfoVos[0]
                                this.customerInfo.plateNumber = vehicleInfo.plateNumber
                                this.customerInfo.plateNumberTmp = vehicleInfo.plateNumberTmp
                                this.customerInfo.vinCode = vehicleInfo.vinCode
                                //有车且无车牌 那么车牌可编辑 by wjl
                                // if(!vehicleInfo.plateDate){
                                //     this.isInsertCusVehicle = true
                                // }else{
                                //     this.isInsertCusVehicle = false
                                // }
                                // 其他信息
                                this.customerInfo.plateDate = vehicleInfo.plateDate
                                this.customerInfo.commercialInsuranceEndDate = vehicleInfo.commercialInsuranceEndDate
                                this.customerInfo.compulsoryInsuranceEndDate = vehicleInfo.compulsoryInsuranceEndDate
                                this.customerInfo.inMileage = vehicleInfo.inMileage
                                this.customerInfo.commercialInsuranceCompanyCode = vehicleInfo.commercialInsuranceCompanyCode
                                this.customerInfo.compulsoryInsuranceCompanyCode = vehicleInfo.compulsoryInsuranceCompanyCode
                        
                                this.$refs.search.setValue(vehicleInfo.commercialInsuranceCompanyName)
                                this.$refs._search.setValue(vehicleInfo.compulsoryInsuranceCompanyName)
                                
                                this.customerInfo.commercialInsuranceCompanyRemark = vehicleInfo.commercialInsuranceCompanyRemark
                                this.customerInfo.vehicleRemark = vehicleInfo.vehicleRemark
                                
                                // 一辆车, 车型信息, 扩展属性回显
                                this.carSubInfo = obj.customVehicleInfoVos[0]

                                let _extendList = [] 
                                let addInfoVos = this.carSubInfo.customVehicleAddInfoVos || []
                                addInfoVos.forEach(item => {
                                    let info = {
                                        propName: item.addName,
                                        propCode: item.addCode,
                                        selectedProps: [item.addValue]
                                    }
                                    _extendList.push(info)
                                })
                                this.$refs.selectCarExtendProp.setValue(this.carSubInfo, _extendList)
                                this.showCarList = false                            
                            }else if(obj.customVehicleInfoVos.length > 1) {
                                this.showCarList = true
                                this.isInsertCusVehicle = false
                            }
                        }else {
                            let arr = ['mobilePhone', 'customCode', 'customName', 'gender', 'idType', 'idNo', 'birthday', 'email', 'id']
                            for(let key in this.customerInfo) {
                                if(arr.indexOf(key) === -1) {
                                    this.customerInfo[key] = ''
                                    if(key === 'customVehicleInfoVos') {
                                        this.customerInfo[key] = []
                                    }
                                }
                            }
                            this.$refs.selectCarExtendProp.reset()
                            this.$refs.search.setValue()
                            this.$refs._search.setValue()                            
                            this.isInsertCusVehicle = true
                            this.showCarList = false
                        }
                    }else {
                        this.showCarList = false
                        this.hasCustomerInfo = false
                        this.isInsertCusVehicle = true
                        for(let key in this.customerInfo) {
                            if(key !== 'mobilePhone') {
                                // if(key !== 'plateNumber' && !this.plateNumber) {
                                    this.customerInfo[key] = ''
                                // }
                                if(key === 'customVehicleInfoVos') {
                                    this.customerInfo[key] = []
                                }
                            }
                        }
                        this.customerInfo.plateNumber = this.plateNumber
                        this.customerInfo.customType = 'customTypeIndividualCus'

                        this.$refs.selectCarExtendProp.reset()
                        this.$refs.search.setValue()
                        this.$refs._search.setValue()
                    }
                    next()
                }
            })
        },
        emailBlur() {
            let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
            if(!this.customerInfo.email) {
                this.emailState = null
                return                
            }
            if(!reg.test(this.customerInfo.email)) {
                this.emailState = 'invalid'
            }else {
                this.emailState = null
            }
        },
        idNoBlur() {
            let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
            if(!this.customerInfo.idNo) {
                this.idNoState = null
                return
            }
            if(!reg.test(this.customerInfo.idNo)) {
                this.idNoState = 'invalid'
            }else {
                this.idNoState = null
            }
        },
        getCarExtendInfo(carInfo, extendInfo) {
            for(let key in carInfo) {
                this.customerInfo[key] = carInfo[key]
            }
            if(extendInfo.length){
            	this.extendList = extendInfo
            }
            console.log(this.extendList)
        },
        // 暂时没有用到
        requiredCarInfo() {
            let flag = true
            for(let key in this.carInfoParams) {
                if(!this.carInfoParams[key]) {
                    flag = false
                }
            }
            return flag
        },
        selectCustomerCar() {
            if(!this.customerInfo.customName) {
                this.customNameState = 'invalid'
                return
            }
            if(!this.customerInfo.mobilePhone) {
                this.mobilePhoneState = 'invalid'
                return
            }
            // if(this.cardUseTypeCode == 'VehicleCard' && !this.customerInfo.plateNumber && !this.showCarList) {
            //     this.plateNumberState = 'invalid'
            //     return
            // }
            if(this.cardUseTypeCode == 'VehicleCard' 
                && !this.showCarList
                && !this.customerInfo.plateNumber 
                && !this.customerInfo.plateNumberTmp) {
                Message({
                    type: 'warning',
                    message: '车牌和临牌必须选填一个'
                })
                return
            }
            if(this.emailState == 'invalid' || this.idNoState == 'invalid') {
                return
            }
            if(this.customerInfo.inMileage && this.customerInfo.inMileage - 0 < 0) {
                Message({
                    type: 'warning',
                    message: '进店里程数不能小于0'
                })
                return
            }
            // 时间格式转换
            this.customerInfo.birthday 
                ? this.customerInfo.birthday = new Date(this.customerInfo.birthday).format('yyyy-MM-dd')
                : this.customerInfo.birthday = ''
            if(this.cardUseTypeCode == 'VehicleCard') {
                this.customerInfo.plateDate
                    ? this.customerInfo.plateDate = new Date(this.customerInfo.plateDate).format('yyyy-MM-dd')
                    : this.customerInfo.plateDate = ''
                this.customerInfo.commercialInsuranceEndDate 
                    ? this.customerInfo.commercialInsuranceEndDate = new  Date(this.customerInfo.commercialInsuranceEndDate).format('yyyy-MM-dd')
                    : this.customerInfo.commercialInsuranceEndDate =  ''
                this.customerInfo.compulsoryInsuranceEndDate
                    ? this.customerInfo.compulsoryInsuranceEndDate = new Date(this.customerInfo.compulsoryInsuranceEndDate).format('yyyy-MM-dd')
                    : this.customerInfo.compulsoryInsuranceEndDate = ''
            }
            
            this.carInfoParams = {
                factoryCode: this.customerInfo.factoryCode,
                brandCode: this.customerInfo.brandCode,
                seriesCode: this.customerInfo.seriesCode,
                modelCode: this.customerInfo.modelCode,
                opvCode: this.customerInfo.opvCode,
                ioTypeCode: this.customerInfo.iotypeCode
            }

            // 车主卡
            // 1. 根据手机号没有查到客户信息, 调insert
            // 2. 根据手机号查到客户信息, 如果更改了客户信息, 调update
            
            // 车辆卡
            // 1. 根据手机号没有查到客户信息或者车辆信息, 调insert ( 添加客户信息, 以及车辆信息 )
            // 2. 根据手机号查到客户信息
            //    1.) 没有车: 添加车辆信息, 调update      =>   有人无车 ( 产品没有列出 )
            //    2.) 有一辆车: 用户可以直接选择这辆车, 也可以新增车辆 ( 电话, 证件类型, 证件号不可修改 ) 调update
            //    3.) 有多辆车: 用户可以从多辆车中选择一辆车, 也可以新增车辆 ( 除电话号码之外客户信息都可以修改 ) 调update

            if(this.cardUseTypeCode == 'VehicleCard') {
                if(!this.isInsertCusVehicle) {
                    if(this.showCarList && this.selIndex === -1) {
                        Message({
                            type: 'warning',
                            message: '请选择车辆'
                        })
                        return
                    }
                    let vehicleInfo = !this.showCarList  
                        ? this.customerInfo.customVehicleInfoVos[0]
                        : this.customerInfo.customVehicleInfoVos[this.selIndex]
                    let info = !this.showCarList ? this.customerInfo : vehicleInfo
                    let cusCarParams = {
                        id: vehicleInfo.id,
                        vehicleCode: vehicleInfo.vehicleCode,
                        customCode: this.customerInfo.customCode,
                        customName: this.customerInfo.customName,
                        plateNumber: info.plateNumber,
                        plateNumberTmp: info.plateNumberTmp,
                        vinCode: info.vinCode,
                        factoryCode: info.factoryCode,
                        brandCode: info.brandCode,
                        seriesCode: info.seriesCode,
                        modelCode: info.modelCode,
                        opvCode: info.opvCode,
                        iotypeCode: info.iotypeCode,
                        plateDate: info.plateDate,
                        commercialInsuranceEndDate: info.commercialInsuranceEndDate,
                        compulsoryInsuranceEndDate: info.compulsoryInsuranceEndDate,
                        inMileage: info.inMileage,
                        commercialInsuranceCompanyCode: info.commercialInsuranceCompanyCode,
                        commercialInsuranceCompanyName: info.commercialInsuranceCompanyName,
                        compulsoryInsuranceCompanyCode: info.compulsoryInsuranceCompanyCode,
                        compulsoryInsuranceCompanyName: info.compulsoryInsuranceCompanyName,
                        commercialInsuranceCompanyRemark: info.commercialInsuranceCompanyRemark,
                        vehicleRemark: info.vehicleRemark,
                        // 客户信息
                        customInfoVo: {
                            id: this.customerInfo.id,
                            customCode: this.customerInfo.customCode,
                            customName: this.customerInfo.customName,
                            mobilePhone: this.customerInfo.mobilePhone,
                            idType: this.customerInfo.idType,
                            idNo: this.customerInfo.idNo,
                            birthday: this.customerInfo.birthday,
                            email: this.customerInfo.email,
                            gender: this.customerInfo.gender,
                            customType: this.customerInfo.customType
                        },
                        // 车型扩展属性信息
                        customVehicleAddInfoVos: !this.showCarList ? [] : vehicleInfo.customVehicleAddInfoVos,
                        isMainCar: 0
                    }
                    if(this.showCarList) {
                        cusCarParams.isMainCar = 0
                    }else if(!this.showCarList && this.isDefaultCar) {
                        cusCarParams.isMainCar = 1                        
                    }
                    if(this.showCarList) {
                        this.customerInfo.plateNumber = vehicleInfo.plateNumber
                        this.customerInfo.vinCode = vehicleInfo.vinCode

                        this.customerInfo.factoryCode = vehicleInfo.factoryCode
                        this.customerInfo.brandCode = vehicleInfo.brandCode
                        this.customerInfo.seriesCode = vehicleInfo.seriesCode
                        this.customerInfo.modelCode = vehicleInfo.modelCode
                        this.customerInfo.opvCode = vehicleInfo.opvCode
                        this.customerInfo.iotypeCode = vehicleInfo.iotypeCode

                        this.carInfoParams = {
                            factoryCode: vehicleInfo.factoryCode,
                            brandCode: vehicleInfo.brandCode,
                            seriesCode: vehicleInfo.seriesCode,
                            modelCode: vehicleInfo.modelCode,
                            opvCode: vehicleInfo.opvCode,
                            ioTypeCode: vehicleInfo.iotypeCode
                        }
                        
                        if(!cusCarParams.iotypeCode) {
                            Message({
                                type: 'warning',
                                message: '车型主信息必填'
                            })
                            return
                        }

                        this.setCusVehicleInfo(true, cusCarParams)                        
                        this.updateCustomerCar(cusCarParams, () => {
                            this.selIndex = 0      // 重置selIndex
                            // let params = {
                            //     mobilePhone: this.customerInfo.mobilePhone
                            // }
                            // this.queryByPhone(params)
                            this.setCardCusVeehicle()
                        })
                        return
                    }
                    // 编辑车型扩展属性 => 一人一车
                    this.updateCarAddInfo(cusCarParams).then(params => {
                        if(params.count > 0) {
                            let seqListParams = {
                                serviceCode: CUSTOM_VEHICLE_ADD_SEQ,
                                getNums: params.count
                            }
                            this.getMainCarInfo(this.carInfoParams, obj => {
                                getSequenceList(seqListParams, carDetailCodes => {
                                    params.tempArr.forEach((item, i) => {
                                        let info = {
                                            carCode: obj[0].carCode,
                                            addCode: item.propCode,
                                            addValue: item.selectedProps[0],
                                            vehicleCode: cusCarParams.vehicleCode,
                                            carDetailCode: carDetailCodes[i]
                                        }
                                        cusCarParams.customVehicleAddInfoVos.push(info)
                                    })
                                    this.setCusVehicleInfo(true, cusCarParams)
                                    this.updateCustomerCar(cusCarParams, () => {
                                        this.setCardCusVeehicle()
                                    })
                                })
                            })
                        }else {
                            this.setCusVehicleInfo(true, cusCarParams)                            
                            this.updateCustomerCar(cusCarParams, () => {
                                this.setCardCusVeehicle()
                            })
                        }
                    })
                }else {
                    this.insertCusVehicle(() => {
                        this.setCardCusVeehicle()                        
                    })
                }
            }else {
                this.editCrecorder(() => {
                    this.setCardCusVeehicle()
                })
            }
        },
        updateCarAddInfo(cusCarParams) {
            return new Promise(resolve => {
                cusCarParams.customVehicleAddInfoVos = this.carSubInfo.customVehicleAddInfoVos || []
                cusCarParams.customVehicleAddInfoVos.forEach(item => {
                    let i = this.extendList.findIndex(v => v.propCode === item.addCode)
                    if(i === -1) {
                        item.isDeleted = 1
                    }else {
                        item.addValue = this.extendList[i].selectedProps[0]
                    }
                })
                let params = {
                    count: 0,
                    tempArr: []
                } 
            
                this.extendList.forEach(item => {
                    let i = cusCarParams.customVehicleAddInfoVos.findIndex(v => v.addCode === item.propCode)
                    if(i === -1) {
                        params.count++
                        params.tempArr.push(item)
                    }else {
                        cusCarParams.customVehicleAddInfoVos[i].addCode = item.propCode
                        cusCarParams.customVehicleAddInfoVos[i].addName = item.propName
                        cusCarParams.customVehicleAddInfoVos[i].addValue = item.selectedProps[0]
                    }
                })
                resolve(params)
            })
        },
        setCardCusVeehicle() {
            // console.log(this.cusVehicleInfo)
            this.$emit('selectCusVehicleInfo', this.cusVehicleInfo)
            this.hideEmpCarModal()          
        },
        getMainCarInfo(params, next) {
            api.storeManage.getCarStyles(params, res => {
                if(res.data.code === 'success') {
                    next(res.data.obj)
                }
            })
        },
        // 车主卡 - 人车关系逻辑
        editCrecorder(success) {
            let params = {
                customName: this.customerInfo.customName,
                mobilePhone: this.customerInfo.mobilePhone,
                idType: this.customerInfo.idType,
                idNo: this.customerInfo.idNo,
                birthday: this.customerInfo.birthday,
                email: this.customerInfo.email,
                gender: this.customerInfo.gender,
                customType: this.customerInfo.customType
            }
            if(this.hasCustomerInfo) {
                params.id = this.customerInfo.id
                params.customCode = this.customerInfo.customCode
                this.setCusVehicleInfo(false, params)
                this.updateCustomInfo(params, () => {
                    success()
                })
            }else {
                getSequence(CUSTOM, res => {
                    if(params.hasOwnProperty('id')) {
                        delete params.id
                    }
                    params.customCode = res
                    this.setCusVehicleInfo(false, params)
                    this.insertCustomInfo(params, () => {
                        success()
                    })
                })
            }
        },
        insertCusVehicle(success) {
            if(!this.customerInfo.iotypeCode) {
                Message({
                    type: 'warning',
                    message: '车型主信息必填'
                })
                return
            }
            getSequence(CUSTOM_VEHICLE_SEQ, _vehicleCode => {
                getSequence(CUSTOM, _customCode => {
                    let cusCarParams = {
                        vehicleCode: _vehicleCode,
                        customCode: this.hasCustomerInfo ? this.customerInfo.customCode : _customCode,
                        plateNumber: this.customerInfo.plateNumber,
                        plateNumberTmp: this.customerInfo.plateNumberTmp,
                        vinCode: this.customerInfo.vinCode,
                        factoryCode: this.customerInfo.factoryCode,
                        brandCode: this.customerInfo.brandCode,
                        seriesCode: this.customerInfo.seriesCode,
                        modelCode: this.customerInfo.modelCode,
                        opvCode: this.customerInfo.opvCode,
                        iotypeCode: this.customerInfo.iotypeCode,
                        plateDate: this.customerInfo.plateDate,
                        commercialInsuranceEndDate: this.customerInfo.commercialInsuranceEndDate,
                        compulsoryInsuranceEndDate: this.customerInfo.compulsoryInsuranceEndDate,
                        inMileage: this.customerInfo.inMileage,
                        commercialInsuranceCompanyCode: this.customerInfo.commercialInsuranceCompanyCode,
                        commercialInsuranceCompanyName: this.customerInfo.commercialInsuranceCompanyName,

                        compulsoryInsuranceCompanyCode: this.customerInfo.compulsoryInsuranceCompanyCode,
                        compulsoryInsuranceCompanyName: this.customerInfo.compulsoryInsuranceCompanyName,
                        commercialInsuranceCompanyRemark: this.customerInfo.commercialInsuranceCompanyRemark,
                        vehicleRemark: this.customerInfo.vehicleRemark,
                        // 客户信息
                        customInfoVo: {
                            customCode: this.hasCustomerInfo ? this.customerInfo.customCode : _customCode,
                            customName: this.customerInfo.customName,
                            mobilePhone: this.customerInfo.mobilePhone,
                            idType: this.customerInfo.idType,
                            idNo: this.customerInfo.idNo,
                            birthday: this.customerInfo.birthday,
                            email: this.customerInfo.email,
                            gender: this.customerInfo.gender,
                            customType: this.customerInfo.customType
                        },
                        // 车型扩展属性信息
                        customVehicleAddInfoVos: [],
                        isMainCar: this.isDefaultCar ? 1 : 0
                    }
                    if(this.hasCustomerInfo) {
                        cusCarParams.customInfoVo.id = this.customerInfo.id
                    }
                    
                    if(this.extendList.length) {
                        let seqListParams = {
                            serviceCode: CUSTOM_VEHICLE_ADD_SEQ,
                            getNums: this.extendList.length
                        }
                        this.getMainCarInfo(this.carInfoParams, obj => {
                            getSequenceList(seqListParams, carDetailCodes => {
                                this.extendList.forEach((item, i) => {
                                    let info = {
                                        carCode: obj[0].carCode,
                                        addCode: item.propCode,
                                        addValue: item.selectedProps[0],
                                        vehicleCode: _vehicleCode,
                                        carDetailCode: carDetailCodes[i]
                                    }
                                    cusCarParams.customVehicleAddInfoVos.push(info)
                                })
                                // add cusVehicleInfo by lwx
                                // for(let key in cusCarParams.customInfoVo) {
                                //     this.cusVehicleInfo[key] = cusCarParams.customInfoVo[key]
                                // }
                                // for(let key in this.cusVehicleInfo.customVehicleInfoVos[0]) {
                                //     this.cusVehicleInfo.customVehicleInfoVos[0][key] = cusCarParams[key]
                                // }
                                this.setCusVehicleInfo(true, cusCarParams)
                                this.insertCustomerCar(cusCarParams, () => {
                                    success()
                                })
                            })
                        })
                    }else {
                        // add cusVehicleInfo by lwx
                        // for(let key in cusCarParams.customInfoVo) {
                        //     this.cusVehicleInfo[key] = cusCarParams.customInfoVo[key]
                        // }
                        // for(let key in this.cusVehicleInfo.customVehicleInfoVos[0]) {
                        //     this.cusVehicleInfo.customVehicleInfoVos[0][key] = cusCarParams[key]
                        // }
                        this.setCusVehicleInfo(true, cusCarParams)                        
                        this.insertCustomerCar(cusCarParams, () => {
                            success()
                        })
                    }
                })
            })
        },
        // add cusVehicleInfo by lwx
        setCusVehicleInfo(isVehicle, params) {
            if(!isVehicle) {
                for(let key in params) {
                    if(key != 'id') {
                        this.cusVehicleInfo[key] = params[key]
                    }
                }
            }else {
                for(let key in params.customInfoVo) {
                    if(key != 'id') {
                        this.cusVehicleInfo[key] = params.customInfoVo[key]
                    }
                }
                for(let key in this.cusVehicleInfo.customVehicleInfoVos[0]) {
                    this.cusVehicleInfo.customVehicleInfoVos[0][key] = params[key]
                }
            }
        },
        // 新增客户信息
        insertCustomInfo(params, next) {
            api.mancar.insertCustomInfo(params, res => {
                if(res.data.code === 'success') {
                    alertSuccess(res)
                    next()
                }
            })
        },
        // 编辑客户信息
        updateCustomInfo(params, next) {
            api.mancar.updateCustomInfo(params, res => {
                if(res.data.code === 'success') {
                    alertSuccess(res)
                    next()
                }
            })
        },
        // 新增客户车辆信息
        insertCustomerCar(params, next) {
            api.mancar.insertCustomVehicleInfo(params, res => {
                if(res.data.code === 'success') {
                    alertSuccess(res)
                    next()
                }
            })
        },
        // 编辑客户车辆信息
        updateCustomerCar(params, next) {
            api.mancar.updateCustomVehicleInfo(params, res => {
                if(res.data.code === 'success') {
                    alertSuccess(res)
                    next()
                }
            })
        },

        // 保险公司搜索
        clearValue() {
            this.customerInfo.commercialInsuranceCompanyCode = ''
            this.customerInfo.commercialInsuranceCompanyName = ''
        },
        _clearValue() {
            this.customerInfo.compulsoryInsuranceCompanyCode = ''
            this.customerInfo.compulsoryInsuranceCompanyName = ''
        },
        firstLoad() {
            if(this.selectParams.coName) {
                delete this.selectParams.coName;
            }else if(this.datalist.length !== 0) {
                return;
            }
            let params = this.selectParams;     
            this.querySerInfo(params, obj => {
                this.isLastPage = obj.isLastPage;                            
                this.datalist = obj.list;
            });
        },
        querySelect(data) {
            this.selectParams.pageStart = 1;
            this.selectParams.coName = data;
            let params = this.selectParams;        
            this.querySerInfo(params, obj => {
                this.isLastPage = obj.isLastPage;            
                this.datalist = obj.list;
            });
        },
        itemClick(item) {
            this.customerInfo.commercialInsuranceCompanyCode = item.coCode
            this.customerInfo.commercialInsuranceCompanyName = item.coName
        },
        _itemClick(item) {
            this.customerInfo.compulsoryInsuranceCompanyCode = item.coCode
            this.customerInfo.compulsoryInsuranceCompanyName = item.coName
        },
        scrollBottom(isEnd) {
            if (isEnd && !this.isLastPage) {
                this.selectParams.pageStart ++
                let params = this.selectParams;        
                this.querySerInfo(params, obj => {
                    this.isLastPage = obj.isLastPage;
                    this.datalist = this.datalist.concat(obj.list);
                });
            }
        },
        querySerInfo(params, callback) {
            // 回头加权限
            api.mancar.queryCompanyInfoByCodesAndPagination(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },
    },
    watch: {
        mobilePhone(val) {
            this.customerInfo.mobilePhone = val
            let params = {
                mobilePhone: this.customerInfo.mobilePhone,
                plateNumber: this.plateNumber
            }
            if(this.plateNumber) {
                delete params.mobilePhone
            }
            if(params.mobilePhone || params.plateNumber) {
                this.queryByPhone(params)
            }
        },
        plateNumber(val) {
            this.customerInfo.plateNumber = val
            let params = {
                plateNumber: val
            }
            if(this.plateNumber) {
                delete params.mobilePhone
            }
            if(params.mobilePhone || params.plateNumber) {
                this.queryByPhone(params)
            }
        }
    }
}
</script>
<style scoped>
.car-list-btn {
    position: absolute;
    top: 8px;
    left: 100px;
}
.add-car-btn {
    position: absolute;
    top: 8px;
    left: 200px;
}
</style>
