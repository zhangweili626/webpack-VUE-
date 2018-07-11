<template>
    <div>
        <div class="row navtestcss nav-top-test-css">
            <div class="">
                <span>预约单号：</span>
                <span>{{bookOrderNo}}</span>
            </div>
            <div class="col-md-4">
                <span class='appSelectPosition'>
                    <b-form-fieldset horizontal label="预约门店:" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshopin" @select-change="selectedfun"></areaqueryshop>
                    </b-form-fieldset>
                </span>
            </div>
            <div class="col-md-3">
                <span>创建时间：</span>
                <span>{{createTime}}</span>
            </div>
            <div class="col-md-2">
                <span>预约受理人：</span>
                <span>{{bookingConfirmTime}}</span>
            </div>
        </div>
        <div class="row navtestcss">
            <div class="col-md-2 lineC2 pl0" ref="lineC2">
                <div class="messLeft">
                    <div class="mgbt15">
                        <!-- 客户手机 -->
                        <label for="input-small">客户手机：</label>
                        <b-form-input id="input-small" type="text" max='11'
                        @blur.native="custPhoneTestHandle"
                        v-model="pepoleCar.custMobile"
                        :disabled="isSee"
                        placeholder="客户手机">
                        </b-form-input>
                    </div>
                    <div class="mgbt15">
                        <!-- 客户姓名 -->
                        <label for="input-small">客户姓名</label>
                        <b-form-input id="input-small" type="text"
                            v-model="pepoleCar.customName" 
                            :disabled="noCanFix"
                            placeholder="客户姓名">
                        </b-form-input>
                    </div>
                    <div class="mgbt15">
                        <label for="input-from">预约来源</label>
                        <b-form-select id="input-from" 
                            v-model="channelTypeCode" 
                            :disabled="isSee"
                            :options="ChannelCodeSelect" />
                    </div>
                    <div class="mgbt15">
                        <label for="input-from">预约类型</label>
                        <b-form-select id="input-from" 
                            v-model="businessTypeCode"
                            :disabled="isSee"
                            :options="orderOperationOptions" />
                    </div>
                    <div class="mgbt15">
                        <!-- 车牌 -->
                        <label for="input-small">车牌</label>
                        <b-form-input id="input-small" type="text"
                            v-model="pepoleCar.plateNumber" 
                            :disabled="noCanFix"
                            placeholder="车牌">
                        </b-form-input>
                    </div>
                    <div class="mgbt5">
                        <b-form-checkbox
                            v-model="iSplateNumberTmp"
                            value=""
                            :disabled="noCanFix">
                            临时车牌
                        </b-form-checkbox>
                    </div>
                    <div class="mgbt15">
                        <!-- 车型 -->
                        <label for="input-small">车型</label>
                        <b-form-input id="input-small" type="text"
                            v-model="pepoleCar.modelCode" 
                            placeholder="车型"
                            :disabled="noCanFix">
                        </b-form-input>
                    </div>
                    <div class="mgbt15">
                        <!-- 车架号 -->
                        <label for="input-small">车架号/VIN</label>
                        <b-form-input id="input-small" type="text"
                            v-model="pepoleCar.vinCode" 
                            :disabled="noCanFix"
                            placeholder="车架号">
                        </b-form-input>
                    </div>
                    <div class="mgbt15" id="EditColorPickerFix">
                        <label for="input-small">选择日期</label>
                        <el-date-picker
                        v-model="bookingEnteringTime"
                        :picker-options="pickerOptions0"
                        :disabled="isSee"
                        align="right"
                        type="date"
                        :value='bookingEnteringTime'
                        placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <div class="mgbt15">
                        <!-- 送修人 -->
                        <label for="input-small">送修人</label>
                        <b-form-input id="input-small" type="text"
                            @blur.native="custPhoneTestHandle12"
                            v-model="pepoleCar.repairCustomName"
                            :disabled="isSee" 
                            placeholder="送修人">
                        </b-form-input>
                    </div>
                    <div class="mgbt15">
                        <!-- 送修电话 -->
                        <label for="input-small">送修电话</label>
                        <b-form-input id="input-small" type="text"
                            @blur.native="custPhoneTestHandle13"
                            :disabled="isSee"
                            v-model="pepoleCar.repairMobilePhone" 
                            placeholder="送修电话">
                        </b-form-input>
                    </div>
                    <div class="mgbt15">
                        <!-- 公里数 -->
                        <label for="input-small">公里数</label>
                        <b-form-input id="input-small" type="number"
                            @blur.native="custPhoneTestHandle14"
                            :disabled="isSee"
                            v-model="pepoleCar.currentMileage" 
                            placeholder="公里数">
                        </b-form-input>
                    </div>
                    <div class="mgbt15">
                        <!-- 最后一次出场里程 -->
                        <label for="input-small">最后一次出场里程</label>
                        <b-form-input id="input-small" type="text"
                            v-model="pepoleCar.inMileage"
                            :disabled="noCanFix"
                            placeholder="最后一次出场里程">
                        </b-form-input>
                    </div>
                    
                </div>
            </div>
            <div :class="showHistory ? 'col-md-7' : 'col-md-10'">
                <div class="centerMd8">
                    <!-- tabs切换 start   -->
                    <div class="fixCardStyle" v-if="tabShow">
                        <!-- <div v-if="tabsMo.length > 0"> -->
                            <el-tabs style="height: 200px;" @tab-click='tabClick'>
                                <!-- label显示的title内容 -->
                                <!-- 选中时候触发 -->
                                <el-tab-pane v-for="(item, index) in tabsMo" 
                                    :key=index 
                                    :label="item.categoryName">
                                </el-tab-pane>
                                <template>
                                    <div class="serverButtonStyle">
                                        <!-- 标签样式 -->
                                        <a v-for="(item, index) in contentSelf" :key=index
                                            href="javascript:;"
                                            @click="serverButtonHandler(item, index)">
                                            {{item.serviceName}}
                                        </a>
                                    </div>
                                </template>
                            </el-tabs>
                        <!-- </div> -->
                    </div>
                    <!-- tabs切换 end -->
                    <!-- 服务信息 start -->
                    <div class="tableMess" ref="tableServer">
                        <h6>服务信息</h6>
                        <!-- <div class="tabMaxHeight"> -->
                        <div>
                            <!-- BV-TABLE -->
                            <template>
                                <b-table :items="items" :fields="fields">
                                    <template slot="originalSalesPrice" slot-scope="row">
                                        <span class="cursorPointe"
                                            @click.stop="row.toggleDetails">
                                            {{row.item.originalSalesPrice}}
                                        </span>
                                    </template>
                                    <!-- 上面是主表信息 start -->
                                    <!-- 待确认分发显示 -->
                                    <template slot="row-details" slot-scope="row">
                                        <b-card v-if="row.item.jiashujv != ''"> <!-- 子table的显示 -->
                                            <b-row class="mb-2">
                                                <!-- <b-col sm="3" class="text-sm-right"><b>row-details:</b></b-col> -->
                                                <b-col>{{ row.item.bookOrderServiceDetailInfos && row.item.bookOrderServiceDetailInfos.bookOrderServiceDetailSkuInfos }}</b-col>
                                            </b-row>
                                        </b-card>
                                        <span v-if="row.item.jiashujv == ''">暂无数据...</span>
                                    </template>
                                    <template slot="accountTypeCode" slot-scope="row">
                                        <!-- lwx - start -->
                                        <account-type-select
                                            :ref='"serviceAccountType" + row.index'
                                            :index="row.index"
                                            :disabled="isSee"
                                            :accountTypeList="accountTypeList"
                                            @getValue="getServiceAccountType">
                                        </account-type-select>
                                        <!-- lwx - end -->
                                        <!-- <b-form-select 
                                            @change='accountTypeNameHandle(row)'
                                            v-model="row.item.accountTypeCode"
                                            :options="accountTypeCodeOptions"
                                            class="mb-2" /> -->
                                    </template>
                                    <!-- 下面是分发信息 end -->
                                    <template v-if="!isSee" slot="operation" slot-scope="row">
                                        <b-button size="sm" @click="trashMess(row)" variant="danger">作废</b-button>
                                    </template>
                                    <template slot="detailRemark" slot-scope="row">
                                        <b-button 
                                            @click="remarkHandle(row)" 
                                            size="sm" 
                                            variant="link">
                                            备注
                                        </b-button>
                                    </template>
                                </b-table>
                                <template v-if="items.length <= 0">
                                    暂无数据...
                                </template>
                            </template>
                        </div>
                    </div>
                    <!-- 服务信息 end -->
                    <!-- 精品信息 start -->
                    <div class="tableMess" v-if="fineQualityItems.length > 0">
                        <h6>精品信息</h6>
                        <span v-if="fineQualityItems.length <= 0">暂无数据...</span>
                        <div class="tabMaxHeight">
                            <!-- BV-TABLE -->
                            <template>
                                <b-table :items="fineQualityItems" :fields="fineQualityFields">
                                    <template slot="detailRemark" slot-scope="row">
                                        <b-button size="sm" @click="detailRemarkfine(row)" variant="link">备注</b-button>
                                    </template>
                                    <template slot="serviceName2" slot-scope="row">
                                        <b-form-checkbox
                                            :disabled="true"
                                            v-model="row.item.serviceName2">
                                        </b-form-checkbox>
                                    </template>
                                    <template slot="empty" slot-scope="row">
                                        暂无数据
                                    </template>
                                </b-table>
                            </template>
                        </div>

                    </div>
                    <!-- 精品信息 end -->
                </div>
                <div class="row cancelSave" v-if="!isSee">
                    <b-button @click="cancelApp" size="" variant="warning">取消</b-button>
                    <b-button @click="saveApp" size="" variant="success">保存</b-button>
                </div>
            </div>
            <div class="col-md-3" v-if="showHistory" ref="maxHeightHistory">
                <div class="maxHeightHistory">
                    <order-history 
                        :custPlates="pepoleCar.plateNumber" 
                        @lengthChange="lengthChange">
                    </order-history>    
                </div>
            </div>
            <div class="lengthChangeShow">
                <order-history 
                    :custPlates="pepoleCar.plateNumber" 
                    @lengthChange="lengthChange">
                </order-history> 
            </div>
        </div>
        <!-- model备注修改框 -->
        <b-modal id="modalRemark" title="备注编辑" ref="modalRemark" @hidden="modelHidden">
            <textarea class="remark-textarea" 
                v-model="remark"
                :disabled="isSee"
                placeholder="最多200字" 
                id="data.item.index" 
                @input="checkStrLength(remark)">
            </textarea>
            <span class="hint-text-leng">{{remark.length}} / 200</span>
            <div slot="modal-footer" class="w-100">         				
				<b-btn size="sm" class="float-right" variant="success" @click="sureRemark">确定</b-btn>
				<b-btn size="sm" class="float-right mr-2" variant="seconday" @click="cancelModal">取消</b-btn>
			</div>
        </b-modal>
        <!-- 人车组件 -->
        <!-- 人车落确认后的selectCusVehicleInfo -->
        <customer-vehicle 
            ref="cusVehicle"
            @hideEmpCarModal="hideEmpCarModal"
            @selectCusVehicleInfo="selectCusVehicleInfo"
            cardUseTypeCode = "VehicleCard"
            :mobilePhone="custMobileEnd"
        /> 
        <!-- 绑定手机号 :mobilePhone="custMobile" -->
        <!-- :plateNumber="plateNumber" 车牌 -->
        <!-- hideEmpCarModal 隐藏组件  -->
    </div>
</template>
<script>

import api from 'common/api'
import config from 'common/config'
import common from 'common/common'
// mock数据 start
import orderHistory from './order-history'
import './mock/appointmentThf.js'
// mock数据 end apponitmentThf
import { getSequence } from 'common/api-common'
import { BOOK_ORDER_SERVICE_DETAIL_SEQ } from 'common/sequence'
import AccountTypeSelect from 'components/account-type-select/account-type-select'
import {ORDER_INVOICE, ORDER_BUSINESS_TYPE, ACCOUNT_TYPE} from 'common/ref-code'
import Vue from 'vue'
import customerVehicle from 'components/customer-vehicle/customer-vehicle.vue'
import areaqueryshop from 'components/iris-areaqueryshop/'
import { DatePicker, Message } from 'element-ui'
import { formatDate, getType } from 'common/api-common';
//  Tabs, Table, Form, FormItem, TableColumn, OptionGroup,
// Vue.use()
export default {
    created () {
        // this.serverGetall()
        // 根据status状态去判断是add,see或者edit
        let status = this.$route.query.status || ''
        this.bookOrderNo = this.$route.query.bookOrderNo || ''
        // statusPageHandler
        if(status == 'see') {
            this.statusPageHandler = 'see'
            this.isSee = true
            this.queryAllBookOrderHandler(this.bookOrderNo)
            // let queryAll = {
            //     "bookOrderNo": this.bookOrderNo,
            //     "isDeleted":"0"
            // }
            // api.appointment.queryAllBookOrder(queryAll, (res) => {
            //     if(res.data.code == 'success') {
            //         console.log('查询大接口edit', res.data.obj)
            //         // 服务信息的渲染
            //         this.AllBookOrder = res.data.obj
            //         this.items = res.data.obj.bookOrderServiceDetailInfos
            //         // //精品信息的渲染
            //         this.fineQualityItems = res.data.obj.bookOrderSkuDetailInfos
            //         this.editeBand(res.data.obj)
            //         this.serverGetall(res.data.obj.storeCode)
            //         this.bookOrderNo = res.data.obj.bookOrderNo
            //         // 预约单号被冲突
            //         this.AllBookOrder.bookOrderServiceDetailInfos.forEach((item, i) => {
            //             let info = {
            //                 accountTypeCode: item.accountTypeCode,
            //                 reconciliationTargetCode: item.reconciliationTargetCode,
            //                 reconciliationTargetName: item.reconciliationTargetName
            //             }
            //             this.$nextTick(() => {
            //                 this.$refs[`serviceAccountType${i}`].setValue(info)
            //             })
            //         })
            //     }
            // })
        } else if (status == 'edit') { // custMobile
            this.statusPageHandler = 'edit'
            this.queryAllBookOrderHandler(this.bookOrderNo)
            // let queryAll = {
            //     "bookOrderNo": this.bookOrderNo,
            //     "isDeleted":"0"
            // }
            // api.appointment.queryAllBookOrder(queryAll, (res) => {
            //     if(res.data.code == 'success') {
            //         console.log('查询大接口edit', res.data.obj)
            //         // 服务信息的渲染
            //         this.AllBookOrder = res.data.obj
            //         this.items = res.data.obj.bookOrderServiceDetailInfos
            //         // //精品信息的渲染
            //         this.fineQualityItems = res.data.obj.bookOrderSkuDetailInfos
            //         this.editeBand(res.data.obj)
            //         this.serverGetall(res.data.obj.storeCode)
            //         this.bookOrderNo = res.data.obj.bookOrderNo
            //         // 预约单号被冲突
            //         this.AllBookOrder.bookOrderServiceDetailInfos.forEach((item, i) => {
            //             let info = {
            //                 accountTypeCode: item.accountTypeCode,
            //                 reconciliationTargetCode: item.reconciliationTargetCode,
            //                 reconciliationTargetName: item.reconciliationTargetName
            //             }
            //             this.$nextTick(() => {
            //                 this.$refs[`serviceAccountType${i}`].setValue(info)
            //             })
            //         })
            //     }
            // })
        } else {
            // 进行add
            this.statusPageHandler = 'add'
        }
    },
    mounted () {
        this.getChannelCode() // 获取数据字典中渠道
        this.getAccountTypeOptions() // 记账类型
        this.topmessage()
    },
    data () {
        return {
            // 历史list.length == 0
            listStory: 0,
            // 是否是查看页面 false是”是“
            isSee: false,
            // 是否显示history
            showHistory: false,
            // 预约时间
            bookingEnteringTime: '',
            // 大接口数据
            AllBookOrder: {},
            // 备注的单条数据信息
            remarkTypeSave: '',
            // 记账类型
            accountTypeList: [],
            // 数据是btn请求过来的content
            contentSelf: [],
            statusPageHandler: 'add', // 判断此订单是add,edit还是see, // 默认是add
            businessTypeCode: 'CarWash', // 业务类型-默认洗车
            // 预约类型选项options
            orderOperationOptions: [],
            queryOption: {
                storeName: '',
                storeAddrName: '',
                isDeleted: '',
                storeCode: '',
                storeDistrictCode: ''
            },
            // input不能编辑
            noCanFix: true,
            ChannelCodeSelect:[], // 预约来源的option
            channelTypeCode: "ShopReservation", // 预约来源的选择
            // 创建时间
            createTime: '',
            // 预约受理人
            bookingConfirmTime:'', 
            // 预约单号
            bookOrderNo:'',
            /* top is nav */
            // 计费类型
            accountTypeCodeOptions: [],
            // 禁用范围
            noCanselectDayNum: 0,
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7 + 1*24*60*60*1000;//this.noCanselectDayNum
                }
            },
            // 是否是临时车牌
            iSplateNumberTmp: false,
            // 人车组件带出来的数据
            pepoleCar: {
                customName: '', // 姓名
                custMobile: '', // 手机
                plateNumber: '', // 车牌-
                plateNumberTmp: false, // 是不是临时车牌-
                vinCode: '', // VIN码-
                inMileage: '', // 最后一次进厂公里数-
                modelName: '', // 车型
                repairCustomName: '',// 送修名称
                repairMobilePhone: '',// 送修手机
                currentMileage: '', // 公里数
                // 送修电话
                //   `repair_custom_code` varchar(240) DEFAULT NULL COMMENT '送修人编码',
                //   `repair_custom_name` varchar(240) DEFAULT NULL COMMENT '送修人名称',
                //   `repair_mobile_phone` varchar(240) DEFAULT NULL COMMENT '送修人手机号码',
            },
            // 精品
            fineQualityFields: {
                skuName:{
                    label: '商品名称'
                },
                accountTypeCode:{
                    label: '记账类型'
                },
                originalSalesPrice:{
                    label: '商品单价'
                },
                skuNums:{
                    label: '商品数量'
                },
                serviceName1:{
                    label: '总价'
                },
                serviceName2:{
                    label: '加装'
                },
                detailRemark:{
                    label: '备注'
                }
                // ,
                // operation:{
                //     label: '操作'
                // }
            },
            fineQualityItems: [],
                // {
                //     skuName: '哇哈哈', 
                //     accountTypeCode: '自费',
                //     originalSalesPrice: '300元', 
                //     skuNums: '2', // items.accountTypeCode
                //     serviceName1: "600",//'记账类型编码',
                //     serviceName2: 0, // 0为false，不加装
                //     detailRemark: '备注',
                //     operation: '',
                // },
            // BV-TABLE
            fields: {
                    serviceName:{
                        label: '项目名称'
                    },
                    accountTypeCode:{
                        label: '记账类型'
                    },
                    costTime:{
                        label: '预计施工时间'
                    },
                    originalSalesPrice:{
                        label: '标准售价'
                    },
                    detailRemark:{
                        label: '备注'
                    },
                    operation:{
                        label: '操作'
                    }
            },/* 主表分发信息 */
    // '项目名称',      '记账类型',      '预计施工时间',      '标准售价',           '备注',       '操作'
    //serviceName    accountTypeName      costTime       originalSalesPrice   detailRemark   operation
            items: [],
                // { 
                //     operation: '作废',
                //     detailRemark: '备66', 
                //     originalSalesPrice: '300元~700元',
                //     costTime: '预计工间66',
                //     serviceName: '项名66', 
                //     accountTypeName: '记账类型', // items.accountTypeCode
                //     accountTypeCode: "CountingCard",//'记账类型编码',
                //     remark: '备注信息111',
                //     jiashujv: '',
                //     arrLast:[
                //         {
                //            arrLast: 'arrLast1111' 
                //         }
                //     ]
                // }
            // 人车落下信息 start
            custMobileEnd: '',
            custMobile: '',
            // 当前编辑index
            eidtInd: -1,
            remark: '',
            // 人车信息 end
            
            text1: '',
            status:'',
            options: [1,2,3,4],
            value2: '',
            tabsMo: [],
        }
    },
    components: {
        orderHistory,
        customerVehicle,
        areaqueryshop,
        AccountTypeSelect,
        // ele
        // DatePicker,
        // Tabs,
        // Table,
        // Form,
        // FormItem,
        // TableColumn,
        // Option,
        // OptionGroup,
        Message
    },
    watch: {
        bookingEnteringTime () { // 选择日期bookingEnteringTime
            if(!/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.pepoleCar.custMobile)) {
                Message({ type: 'warning', message: '请先输入客户手机号'})
                return
            }
            let bookOrderInfoVo = {
                "bookOrderInfoVo": {
                    "id": this.AllBookOrder.id,
                    "bookOrderNo": this.AllBookOrder.bookOrderNo,
                    "bookingEnteringTime": this.bookingEnteringTime
                }
            }
            console.log("bookOrderInfoVo", this.bookingEnteringTime)
            api.appointment.insertOrUpdateBookOrderInfo(bookOrderInfoVo, (res) => {
                if(res.data.code == 'success') {
                    console.log("选择日期保存成功")
                }
            })
        },
        businessTypeCode () {    
            if(!/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.pepoleCar.custMobile)) {
                Message({ type: 'warning', message: '请先输入客户手机号'})
                return
            }
            let bookOrderInfoVo = {
                "bookOrderInfoVo": {
                    "id": this.AllBookOrder.id,
                    "bookOrderNo": this.AllBookOrder.bookOrderNo,
                    "businessTypeCode": this.businessTypeCode
                }
            }
            api.appointment.insertOrUpdateBookOrderInfo(bookOrderInfoVo, (res) => {
                if(res.data.code == 'success') {
                    console.log("预约类型保存成功")
                }
            })
        },
        channelTypeCode () { // 预约来源
            if(!/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.pepoleCar.custMobile)) {
                Message({ type: 'warning', message: '请先输入客户手机号'})
                return
            }
            let bookOrderInfoVo = {
                "bookOrderInfoVo": {
                    "id": this.AllBookOrder.id,
                    "bookOrderNo": this.AllBookOrder.bookOrderNo,
                    "channelTypeCode": this.channelTypeCode
                }
            }
            api.appointment.insertOrUpdateBookOrderInfo(bookOrderInfoVo, (res) => {
                if(res.data.code == 'success') {
                    console.log("预约来源保存成功")
                }
            })
        },
        listStory () {
            // showHistory
            this.showHistory = this.listStory > 0 ? true : false
            if(this.showHistory){
                setTimeout(() => {
                    this.$refs.maxHeightHistory.style.height = window.screen.availHeight + 266 + 'px'
                }, 300)
            }
        },
    },
    computed: {
        // 让tab显示
        tabShow () {
            console.log(this.isSee, this.tabsMo, this.tabsMo.length)
            if (this.isSee) {
                return false
            }
            if (!(this.tabsMo && this.tabsMo.length > 0)) {
                return false
            }
            return true
        }
    },
    methods: {
        lengthChange (val) {
            this.listStory = val
        },
        getServiceAccountType(item, i) {
            // console.log('item', item, i)
            this.items[i].accountTypeCode = item.accountTypeCode // 记账类型编码
            this.items[i].accountTypeName = item.accountTypeName // 记账类型名称
            this.items[i].reconciliationTargetCode = item.reconciliationTargetCode // 对账方编码
            this.items[i].reconciliationTargetName = item.reconciliationTargetName // 对账方名称
            this.$nextTick(() => {
                if(this.$refs[`accountTypeCode${i}`]) {
                    this.$refs[`accountTypeCode${i}`].setValue(item)
                }
            }) 
            let jsonReqs = {
                "bookOrderServiceDetailInfos": [{
                    "bookOrderNo": this.items[i].bookOrderNo,
                    "id":  this.items[i].id,
                    "accountTypeCode":  this.items[i].accountTypeCode,
                    "reconciliationTargetCode":  this.items[i].reconciliationTargetCode,
                    "reconciliationTargetName":  this.items[i].reconciliationTargetName,
                    "serviceCode":  this.items[i].serviceCode,
                    "serviceName":  this.items[i].serviceName,
                    "bookOrderServiceDetailCode":  this.items[i].bookOrderServiceDetailCode
                }]
            }
            api.appointment.insertOrUpdateBookOrderInfo(jsonReqs, (res) => {
                if(res.data.code == "success"){
                    console.log('记账类型修改成功')
                }
            })
        },
        custPhoneTestHandle12 () { // 送修人repairCustomName
            if(!/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.pepoleCar.custMobile)) {
                Message({ type: 'warning', message: '请先输入客户手机号'})
                return
            }
            let bookOrderInfoVo = {
                "bookOrderInfoVo": {
                    "id": this.AllBookOrder.id,
                    "bookOrderNo": this.AllBookOrder.bookOrderNo,
                    "repairCustomName": this.pepoleCar.repairCustomName
                }
            }
            api.appointment.insertOrUpdateBookOrderInfo(bookOrderInfoVo, (res) => {
                if(res.data.code == 'success') {
                    console.log("送修人保存成功")
                }
            })
        },
        custPhoneTestHandle13 () { // 送修电话repairMobilePhone
            if(!/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.pepoleCar.custMobile)) {
                Message({ type: 'warning', message: '请先输入客户手机号'})
                return
            }
            let bookOrderInfoVo = {
                "bookOrderInfoVo": {
                    "id": this.AllBookOrder.id,
                    "bookOrderNo": this.AllBookOrder.bookOrderNo,
                    "repairMobilePhone": this.pepoleCar.repairMobilePhone
                }
            }
            api.appointment.insertOrUpdateBookOrderInfo(bookOrderInfoVo, (res) => {
                if(res.data.code == 'success') {
                    console.log("送修电话保存成功")
                }
            })
        },
        custPhoneTestHandle14 () { // 公里数保存成功
            if(!/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.pepoleCar.custMobile)) {
                Message({ type: 'warning', message: '请先输入客户手机号'})
                return
            }
            let bookOrderInfoVo = {
                "bookOrderInfoVo": {
                    "id": this.AllBookOrder.id,
                    "bookOrderNo": this.AllBookOrder.bookOrderNo,
                    "currentMileage": this.pepoleCar.currentMileage
                }
            }
            api.appointment.insertOrUpdateBookOrderInfo(bookOrderInfoVo, (res) => {
                if(res.data.code == 'success') {
                    console.log("公里数保存成功")
                }
            })
        },
        saveApp () {
            this.$router.push({
                path: '/appointment-new'
            })
        },
        cancelApp () {
            this.$router.push({
                path: '/appointment-new'
            })
            // if (this.statusPageHandler == 'edit') {
                
            // } else {
            //     this.$router.push({
            //         path: '/appointment-new'
            //     })
            // }
        },
        detailRemarkfine () {
            console.log('精品的备注')
        },
        // 精品作废(暂时没有)
        // fineQuality(item){
        //     console.log('精品的作废', item)
        // },
        serverButtonHandler (val, index) {
            console.log('点击内容中的button对象', val)
            console.log('数据传输一般和父级同步比如数据修改后', this.tabsMo[index])
            // 通过上面的button去处理下面服务信息的添加内容并保存
            // 新增服务信息
            // categoryName
            let bookOrderServiceCODE = ''
            getSequence(BOOK_ORDER_SERVICE_DETAIL_SEQ, res => {
                bookOrderServiceCODE = res
                let newServerDate = {
                        "bookOrderServiceDetailInfos":[{
                            "bookOrderNo": this.bookOrderNo,
                            "serviceCode": val.serviceCode,
                            "serviceName": val.categoryName,
                            "id": "",
                            "accountTypeCode": "",
                            "remark": "",
                            "bookOrderServiceDetailCode": bookOrderServiceCODE
                        }]
                }
                // 调用服务信息新增数据 - insertOrUpdateServiceAndSkuInfo
                api.appointment.insertOrUpdateBookOrderInfo(newServerDate, (res) => {
                    if(res.data.code == 'success') {
                        // console.log('新增服务信息', res.data.obj.bookOrderServiceDetailInfos[0]) //items
                        // let getData = res.data.obj.bookOrderServiceDetailInfos[0]
                        this.queryAllBookOrderHandler(this.bookOrderNo)
                    }
                })
            })
            
        },
        // select
        tabClick (tab) {
            // 改变相应的tabsMo中的参数 ajax请求
            let thisDate = this.tabsMo[tab.index]
            let tabClickSend = {
                relationCode: '', //	关系编码	String	N	
                storeCode: thisDate.storeCode,    //	门店编码	String	YES
                categoryCode: thisDate.categoryCode, //	类别编码  分类/目录	string	YES
                channelType: thisDate.channelType,   //	渠道 【数据字典】	string	YES   
                storeName: '',    //	门店名称	String	N	
                serviceCode: '',  //	服务编码	String	N	
                serviceName: '',  //	服务名称	String	N	
                categoryName: '', //	类别名称  分类/目录	string	N	
                categoryFlag: ''  //	类别标识   0:目录  1:分类  2:其他	string	N	
            }
            console.log(this.tabsMo[tab.index])
            let btnContent = {
                storeCode: this.tabsMo[tab.index].storeCode,
                categoryCode: this.tabsMo[tab.index].categoryCode,
                channelType: this.tabsMo[tab.index].channelType,
                categoryFlag: this.tabsMo[tab.index].categoryFlag
            }
            api.appointment.getServiceInfoByStoreCodeAndCategoryCode(btnContent, (res) => {
                if(res.data.code == 'success') {
                    this.contentSelf = res.data.obj
                    console.log('内容信息', res.data.obj)
                }
            })
        },
        remarkHandle (val) {
            if(val.item.remark=="" && this.isSee == true){
                Message({ type: 'warning', message: '此信息无备注'})
                return
            }
            this.remarkTypeSave = val
            this.eidtRemark(val.item.remark, val.index, false)// 参数三是：是否可编辑
            // console.log('备注开始保存', val.item)
        },
        accountTypeNameHandle (val) {
            console.log('选择开始保存', val)
        },
        trashMess (val) {
            let rabish = {
                "bookOrderServiceDetailInfos": [{
                    "bookOrderNo": val.item.bookOrderNo,
                    "bookOrderServiceDetailCode": val.item.bookOrderServiceDetailCode
                }]
            }
            console.log('rabish', JSON.stringify(rabish))
            api.appointment.cancelBookOrderInfo(rabish, (res) => {
                if(res.data.code == "success"){
                    this.items.splice(val.index, 1) // 删除数据
                    console.log('删除数据成功')
                }
            })
            
            
        },
        // queryAllBookOrderHandler 
        queryAllBookOrderHandler (bookOrderNo) {
            let queryAll = {
                "bookOrderNo": bookOrderNo,
                "isDeleted": "0"
            }
            api.appointment.queryAllBookOrder(queryAll, (res) => {
                if(res.data.code == 'success') {
                    console.log('queryAllBookOrder', res.data.obj)
                    this.AllBookOrder = res.data.obj
                    this.editeBand(res.data.obj)
                    this.serverGetall (res.data.obj.storeCode)
                    this.items = res.data.obj.bookOrderServiceDetailInfos
                    //精品信息的渲染
                    this.fineQualityItems = res.data.obj.bookOrderSkuDetailInfos
                    // 创建时间
                    this.createTime = res.data.obj.createTimeStr
                    this.AllBookOrder.bookOrderServiceDetailInfos.forEach((item, i) => {
                        let info = {
                            accountTypeCode: item.accountTypeCode,
                            reconciliationTargetCode: item.reconciliationTargetCode,
                            reconciliationTargetName: item.reconciliationTargetName
                        }
                        this.$nextTick(() => {
                            this.$refs[`serviceAccountType${i}`].setValue(info)
                        })
                    })

                }
            })
        },
        checkStrLength(val) {
            if(val.length > 200) {
                Message({
                    message: '不可超过200字!',
                    type: 'warning'
                });
                this.remark = val.substr(0, 200);
            }
        },
        showModel2(val, index) {
            this.addedModelList = [...val];
            this.eidtInd = index;
            this.$refs.selectCAddModel.showModel();
        },  
        // 编辑话术
        eidtRemark(val, index, onoff) {
            if(onoff == true) {
                return
            }
            this.$refs.modalRemark.show();
            this.remark = val;
            this.eidtInd = index;
        },
        sureRemark() { // 确定val
            // remark
            this.items[this.eidtInd]['remark'] = this.remark
            console.log(this.remark, this.eidtInd)
            let val = this.remarkTypeSave
            // 开始调用保存信息
            this.$refs.modalRemark.hide();
            let jsonReqs = { // 更新服务信息的参数结构
                "bookOrderServiceDetailInfos": [{
                    "bookOrderNo":  val.item.bookOrderNo,
                    "id": val.item.id,
                    "remark": this.remark,
                    "serviceCode": val.item.serviceCode,
                    "serviceName": val.item.serviceName,
                    "bookOrderServiceDetailCode": val.item.bookOrderServiceDetailCode
                }]
            }
            console.log('更新服务备注信息传参', JSON.stringify(jsonReqs))
            api.appointment.insertOrUpdateBookOrderInfo(jsonReqs, (res) => {
                if(res.data.code == "success"){
                    console.log('修改备注成功', res.data)
                }
            })

        },
        cancelModal() {
            this.$refs.modalRemark.hide();
        },    
        modelHidden() {
            this.remark = '';
            this.eidtInd = -1;
        },  
        query(arg) {
            const _this = this
            let option = {
                storeName: _this.queryOption.storeName,
                storeAddrName: _this.queryOption.storeAddrName,
                isDeleted: _this.queryOption.isDeleted,
                salesAreaCodes: _this.queryOption.areaCode,
                storeCode: _this.queryOption.storeCode === 0 ? '' : _this.queryOption.storeCode,
                storeDistrictCode: _this.queryOption.storeDistrictCode,
                pageNums: config.pageNums,
                pageStart: arg === 0? 1: arg
            }
            api.storeManage.queryByPage(option, (res) => {
                if(res.data.code === 'success') {
                    // _this.tablelist = res.data.obj.list
                    let tempPage = {
                        pageNo: res.data.obj.pageNum,
                        pageSize: config.pageNums,
                        totalResult: res.data.obj.total,
                        totalPages: res.data.obj.pages
                    }
                    _this.setStorePage(tempPage)
                    _this.setStoreList(res.data.obj.list)
                }
            })
        },
        // 重置
        reset() {
            const _this = this
            _this.queryOption= {
                storeName: '',
                storeAddrName: '',
                isDeleted: '',
                storeCode: '',
                storeDistrictCode: ''
            }
            _this.$refs.areaqueryshopin.reset()
            _this.$refs.areaqueryshopin.resetToStart()
        },
        // 门店区域
        selectedfun(data, data1) {
            const _this = this
            if (data) {
                this.queryOption.areaCode = [];
                for (let i = 0; i < data.length; i++) {
                    this.queryOption.areaCode.push(data[i].code)
                }
            }
            if (data1) {
                this.queryOption.storeCode = data1.value
            }
        },
        topmessage () {
            // 预约单号自动生成 bookOrderNo
            if (this.statusPageHandler == 'add') {
                let option = {
                    serviceCode: 'BOOKORDERSEQ'
                }
                api.ordinalInfo.getSequence(option, res => {
                    if(res.data.code === 'success') {
                        this.bookOrderNo = res.data.obj
                    }
                })
                // 创建时间 createTime
                this.createTime = common.getTime()
            }
            // 预约受理人 bookingConfirmTime : empVo.empCnName
            this.bookingConfirmTime = JSON.parse(sessionStorage.getItem('userInfo')).empVo.empCnName
            // 预约门店
        },
        // 预约来源的数据字典的获取
        getChannelCode () {
            api.ref.getDataDictionarys({refCode: 'ChannelCode'}, (val) => {
                if(val.data.code == "success"){
                    this.ChannelCodeSelect = [];
                    let a = val.data.obj.referenceDetailInfos
                    for(let i = 0; i < a.length; i++){
                       this.ChannelCodeSelect.push({
                            text: a[i].refDetailName, 
                            value: a[i].refDetailCode
                        })
                    }
                }
            })
            // console.log('预约单来源的select', this.ChannelCodeSelect)
            // 订单类型的option
            getType(ORDER_BUSINESS_TYPE, (res) => {
                if(res.length > 0){
                    this.orderOperationOptions = [];
                    for(let i = 0; i < res.length; i ++){
                        this.orderOperationOptions.push({
                            text: res[i].refDetailName,
                            value: res[i].refDetailCode
                        })
                    }
                }
            })
            getType(ACCOUNT_TYPE, items => {
                this.accountTypeList = []
                items.forEach(item => {
                    let data = {
                        text: item.refDetailName,
                        value: item.refDetailCode
                    }
                    if(item.refDetailCode !== 'thirdSale') {
                        this.accountTypeList.push(data)
                    }
                })
            })
        },
        // accountTypeCodeOptions 服务类型编码的数据字典的获取
        getAccountTypeOptions () {
            let _this = this
            api.ref.getDataDictionarys({refCode: 'AccountType'}, (val) => {
                if(val.data.code == "success"){
                    let i = val.data.obj.referenceDetailInfos
                    let j = i.length
                    while (j--) {
                        _this.accountTypeCodeOptions.push({
                            text: i[j].refDetailName, 
                            value: i[j].refDetailCode
                        })
                    }
                }
            })
        },
        selectCusVehicleInfo (val) { // 人车组件的信息传递
            // console.log('人车组件传递', val) // 最后一次出场里程需要渲染
            this.addBookOrderList(val) // 人车落下再次刷新预约单信息
            this.pepoleCar.inMileage = val.customVehicleInfoVos[0].inMileage // 最后一次公里数
        },
        // 人车落下调用新增预约单接口,之后刷新页面去调用查询预检单
        addBookOrderList (val) {
            let jsonReqs = { // 活参数待后台调试好
                "bookOrderInfoVo": {
                    "id": "", // 为空新增
                    "bookOrderNo": this.bookOrderNo,
                    "businessTypeCode": this.businessTypeCode,
                    "channelTypeCode": this.channelTypeCode,
                    "custCode": val.customCode, // 
                    "vehicleCode": val.customVehicleInfoVos[0].vehicleCode //vehicleCode
                }
            }
            /** 真实逻辑 start **/
            if (this.statusPageHandler == 'add') {  // 先编写新增页面
                api.appointment.insertOrUpdateBookOrderInfo(jsonReqs, (res) => {
                    if(res.data.code == "success"){
                        jsonReqs["bookOrderInfoVo"]["id"] = res.data.obj.bookOrderInfoVo.id
                        api.appointment.insertOrUpdateBookOrderInfo(jsonReqs, (res) => {
                            if(res.data.code == "success"){
                                console.log("res.data.obj[bookOrderInfoVo]", res.data.obj["bookOrderInfoVo"])
                                this.AllBookOrder = res.data.obj["bookOrderInfoVo"]
                                // 往里面填数据
                                this.editeBand(res.data.obj['bookOrderInfoVo'])
                                this.serverGetall(res.data.obj['bookOrderInfoVo'].storeCode)
                                // 创建时间 createTime
                                this.createTime = common.getTime()
                            }
                        })
                    }
                })
            } else if (this.statusPageHandler == 'edit') {
                jsonReqs["bookOrderInfoVo"]["id"] = this.$route.query.bookOrderNo
                api.appointment.insertOrUpdateBookOrderInfo({bookOrderInfoVo: jsonReqs}, (res) => {
                    if(res.data.code == "success"){
                        console.log("this.AllBookOrder", res.data.obj)
                        this.AllBookOrder = res.data.obj["bookOrderInfoVo"]
                        this.editeBand(res.data.obj['bookOrderInfoVo'])
                        this.serverGetall(res.data.obj['bookOrderInfoVo'].storeCode)

                    }
                })
                // 调用大接口, 查询所有的信息先, 把所有能查询到的信息都往里面放置
            }
            /** 真实逻辑 end **/
            // 此时可以调用N的限制天数：pickerOptions0pickerOptions0
            // 待沟通？？
            // axios.get('https://thf.queryAllInfo.htm').then((res) => {
            //     if(res.data.code == 'success') {
            //         this.pickerOptions0 = {
            //             disabledDate(time) {
            //                 return time.getTime() < Date.now() - 8.64e7 + res.data.obj['limitDay']*24*60*60*1000;
            //             }
            //         }
            //     }
            // })
        },
        // 服务信息的请求方法
        serverGetall (storeCode) {
            // Step1 先渲染button。。。 btn 请求开始 排除see
            /** 真实逻辑 start **/
            let serBtn = {
                relationCode: '', //	关系编码	String	N	
                // storeCode: storeCode,    //	门店编码	String	Y
                storeCode: storeCode,    //	门店编码	String	Y	测试死数据 后期可变更
                storeName: '',    //	门店名称	String	N	
                serviceCode: '',  //	服务编码	String	N	
                serviceName: '',  //	服务名称	String	N	
                categoryName: '', //	类别名称  分类/目录	string	N	
                categoryCode: '', //	类别编码  分类/目录	string	N	
                categoryFlag: '', //	类别标识   0:目录  1:分类  2:其他	string	N
            }
            api.appointment.getCategoryInfoByStoreCode(serBtn, (res) => {
                if(res.data.code == "success"){
                    this.tabsMo = res.data.obj
                    // 渲染button
                    let btnContent = {
                        storeCode: storeCode,
                        categoryCode: res.data.obj[0].categoryCode,
                        channelType: res.data.obj[0].channelType,
                        categoryFlag: res.data.obj[0].categoryFlag
                    }
                    api.appointment.getServiceInfoByStoreCodeAndCategoryCode(btnContent, (res) => {
                        if(res.data.code == 'success') {
                            this.contentSelf = res.data.obj
                        }
                    })
                }
            })
            /** 真实逻辑 end **/
        },
        // 绑定数据公用函数
        editeBand (val) {
            this.bookOrderNo = val["bookOrderNo"]
            this.createTime = this.status != 'add' ? val["createTimeStr"] : val["createTime"]
            // this.createTime = val["createTime"]
            // 预约受理人 新增和编辑都是当前登陆人
            // this.bookingConfirmTime = val["createBy"]
            this.channelTypeCode = val["channelTypeCode"]
            this.businessTypeCode = val["businessTypeCode"]
            this.custMobile = val["custMobile"]
            this.iSplateNumberTmp = this.status != 'add' ? val["plateNumberTmp"] : false
            //this.plateNumberTmp = val["plateNumberTmp"] || ''
            // ??待确认??临时车牌的判定 iSplateNumberTmp
            this.pepoleCar.customName = val["custName"]
            this.pepoleCar.plateNumber = val["custPlates"]
            this.pepoleCar.modelCode = val["carModelName"]
            this.pepoleCar.vinCode = val["vinCode"]
            this.pepoleCar.repairCustomName = val["repairCustomName"] || val["custName"]
            this.pepoleCar.repairMobilePhone = val["repairMobilePhone"] || val["custMobile"]
            this.pepoleCar.custMobile = val["custMobile"]
            // this.pepoleCar.inMileage = val["currentMileage"]
            // ??待确认??选择日期
            this.pepoleCar.bookOrderPrice = val["bookOrderPrice"]
            this.pepoleCar.currentMileage = val["currentMileage"]
            this.bookingEnteringTime = val["bookingEnteringTime"]
        },
        changeTime (val) { // 
            if (val) {
                new date(val)
            }
        },
        hideEmpCarModal() {
        },
        custPhoneTestHandle (obj) { // 校验手机号
            if(this.pepoleCar.custMobile != '') {
                if(/^1[3|4|5|6|7|8|9]\d{9}$/.test(this.pepoleCar.custMobile)) {
                    this.custMobileEnd = this.pepoleCar.custMobile
                    this.$refs.cusVehicle.showEmpCarModal()
                } else {
                    Message({ type: 'warning', message: '手机号码输入有误'})
                }
            }
        }
    }
}
</script>
<style lang="scss">
.lengthChangeShow{
    position: absolute;
    right: -3000%;
    top: -3000%;
    width: 10px;
    height: 10px;
}
.maxHeightHistory{
    max-height: 100%;
    overflow: auto;
}
.cursorPointe{
    cursor: pointer;
}
.remark-textarea{
    width: 100%;
    height: 200px;
}
.cancelSave button{
    text-align: center;
}
.cancelSave .btn{
    padding: 7px 15px;
    margin: 40px 15px 0;
}
.appSelectPosition{
    position: relative;
    top: -9px;
    left: -20px;
}
.navtestcss{
    background-color: #fff;
    padding: 15px 0 15px 10px;
    border-width: 1px 0;
    border-style: solid;
    border-color: #c2cfd6;
}
.rightMd{
    background-color: #ff6400;
}
.leftMd{
    background-color: palevioletred;
}
.lineC2{
    border-right: 1px solid #c2cfd6;
}
.messLeft{
    .mgbt15{
        margin-bottom: 15px;
    }
    .mgbt5{
        margin-bottom: 5px;
    }
}
.pl0{
    padding-left: 0;
}
.nav-top-test-css{
    border-width: 0;
    padding-top: 25px;
}
.centerMd8{
    .fixCardStyle{
        .el-tabs__nav {
            display: inline-block !important;
            float: none !important;
        }
        .el-tabs__nav-scroll{
            text-align: center !important;
        }
        .el-tabs__item{
            color: #587EB9;
        }
        .el-tabs__item.is-active{
            color: #48576A;
            font-weight: bold;
        }
        .el-tabs__active-bar{
            background-color: #587EB9;
        }
        .el-tabs__item{
            height: 50px;
            line-height: 50px;
        }
        .el-tabs__item{
            padding: 0 30px;
            font-size: 14px;
        }
        .el-tabs{
            border-bottom: 1px solid #ECECEC;
        }
    }
    .tableMess{
        .tabMaxHeight {
            // max-height: 460px;
            overflow: auto;
        }
        th{
            background-color: #fff;
        }
        .spanPoint{
            cursor: pointer;
        }
        h6{
            padding: 30px 0 20px;
        }
    }
    .btnAdd{
        margin-top: 30px;
    }
}
.serverButtonStyle {
    a:hover{
        // box-shadow: 3px 3px 4px #587EB9;
        background-color: #587EB9;
        color:#fff !important;
    }
    a{
        transition: 0.3s;
        display: inline-block;
        margin: 5px;
        padding: 4px 6px;
        height: 34px;
        line-height: 24px;
        font-size: 12px;
        color: rgb(99, 137, 194) !important;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid rgb(99, 137, 194);
        white-space: nowrap;
        text-decoration: none !important;
        // box-shadow: 0 0 0 #587EB9
    }
}
// input[type="checkbox"]:focus{

// }
</style>

