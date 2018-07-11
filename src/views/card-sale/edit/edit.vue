<template>
<div class="animated fadeIn">
    <div class="row">
        <div class="col-md-12">
            <!-- 卡信息 -->
            <b-card header="卡信息">
                <div class="row">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="销售单号" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.cardSalesOrderNo" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="销售区域" :label-cols="4" class="text-right">
                            <b-form-input v-model="salesName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="门店" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.storeName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="卡使用方" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.cardUseTypeName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="操作人" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.createName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="销售人" :label-cols="4" class="text-right">
                            <b-form-select v-model="cardInfo.salesEmpCode" :options="saleEmpList" :disabled="isWatch || cardInfo.orderStatus != 0">
                            </b-form-select>
                        </b-form-fieldset>
                    </div>
                    
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="卡号" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.cardNo" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="销售单状态" :label-cols="4" class="text-right">
                            <b-form-select v-model="cardInfo.orderStatus" :options="orderStatus" disabled>
                            </b-form-select>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="卡有效期类型" :label-cols="4" class="text-right">
                            <b-form-select v-model="cardInfo.cardExpireType" :options="cardExpireType" disabled>
                            </b-form-select>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="销售时间" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.salesTime" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="销售单创建时间" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.createTimeStr"  readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="卡名称" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.cardName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="卡面值" :label-cols="4" class="text-right">
                            <b-form-input :value="cardInfo.cardAmout | toFixed" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="适用性质" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.useNatureTypeName" readonly/>                        
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="有效期" :label-cols="4" class="text-right">
                            <b-form-input :value="effectiveDate" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="卡有效期天数" :label-cols="4" class="text-right">
                            <b-form-input v-model="effectiveDays" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="客户手机号" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.mobilePhone" @click.native="showEmpCarModal" placeholder="请点击查询客户" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="客户姓名" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.customName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4" v-show="cardInfo.cardUseTypeCode == 'VehicleCard'">
                        <b-form-fieldset horizontal label="车牌号码" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.plateNumber" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4" v-show="cardInfo.cardUseTypeCode == 'VehicleCard'" >
                        <b-form-fieldset horizontal label="VIN码" :label-cols="4" class="text-right">
                            <b-form-input v-model="cardInfo.vinCode"  readonly/>
                            <!-- :state="vinState" -->
                        </b-form-fieldset>
                    </div>
                </div>

                <car-info
                    v-show="cardInfo.cardUseTypeCode == 'VehicleCard'" 
                    @callBack="getCarInfo" 
                    ref="car" 
                    :isDisabled="true">
                </car-info>

                <div class="row">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="应收金额" :label-cols="4" class="text-right">
                            <b-form-input type="number" min="0" v-model="cardInfo.salesOriginalAmount" :readonly="isWatch || cardInfo.orderStatus != 0"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="实收金额" :label-cols="4" class="text-right">
                            <b-form-input :value="cardInfo.salesActualAmount | toFixed" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="已开票金额" :label-cols="4" class="text-right">
                            <b-form-input :value="cardInfo.salesInvoiceAmount | toFixed" readonly/>
                        </b-form-fieldset>
                    </div>
                </div>

                <div class="row mb-2">
                    <div class="col-md-8"></div>
                    <div class="col-md-4 text-right">
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl"
                            :disabled="isWatch || cardInfo.orderStatus == 0 || cardInfo.orderStatus == -1"
                            :data = 'addParams'
                            :on-success='uploadSuccess'
                            :on-error='uploadError'
                            :on-remove="uploadRemove"
                            :file-list="fileList"
                            :on-preview='preview'
                            multiple
                            :limit="100">
                            <a href="javascript:;" v-show="cardInfo.orderStatus != 0 && (isUpdate || isInsert)">上传归档</a>                            
                            <b-button size="sm" variant="success" v-show="cardInfo.orderStatus != 0 && (isUpdate || isInsert)">上传</b-button>
                        </el-upload>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12 text-right">
                    <b-button size="sm" variant="danger" @click="toVoid" :disabled="isWatch || cardInfo.orderStatus == -1" v-if="cardInfo.id && cardInfo.orderStatus == 0" >作废</b-button>
                        <!-- <b-button size="sm" variant="success" 
                            @click="openTicket" 
                            v-show="(isInsert || isUpdate) && cardInfo.orderStatus == 1 && cardInfo.invoiceDetailInfoVos.length == 0">
                            开票
                        </b-button> -->
                        
                        <!-- <b-button size="sm" variant="warning" @click="receivables" :disabled="isWatch || cardInfo.orderStatus == -1 || cardInfo.orderStatus == 1">结算</b-button> -->
                        <b-button size="sm" variant="default" @click="cancel">取消</b-button>
                        <b-button size="sm" variant="primary" @click="temporarySave" 
                            :disabled="cardInfo.orderStatus === 1 || cardInfo.orderStatus == -1"
                            v-show="isInsert || isUpdate">去支付</b-button>                      
                    </div>
                </div>
            </b-card>
            <!-- 卡内容 - 适用范围 --> 
            <div class="row">
                <div class="col-md-6 card-content-style">
                    <b-card header="卡内容">
                        <div class="table-scrollable">
                            <b-table striped hover bordered show-empty :items="cardDetailInfoVos" :fields="contentFields">
                                <template slot="detailType" slot-scope="row">
                                    {{ row.value | serTypeFilter }}                                    
                                </template>
                                <template slot="empty" >暂无数据</template>
                            </b-table>
                        </div>
                    </b-card>
                </div>
                <div class="col-md-6 card-content-style">
                    <b-card header="卡使用范围">
                        <div class="table-scrollable">
                            <b-table striped hover bordered show-empty :items="cardUseRangeInfoVos" :fields="rangeFields">
                                <template slot="empty" >暂无数据</template>
                            </b-table>
                        </div>
                    </b-card>
                </div>
            </div>

            <!-- 收款明细 -->
            <div class="row">
                <div class="col-md-12">
                    <b-card header="收款明细">
                        <b-button size="sm" variant="success" class="header-btn-r" v-show="cardInfo.orderStatus == 0" @click="confirmPay">结算</b-button>   
                        <div class="row">              
                            <div class="col-md-6">              
                                <b-button size="sm" variant="danger" @click="removePay" v-show="cardInfo.orderStatus == 0">删除</b-button>                                             
                                <b-button size="sm" variant="success" @click="addPay" v-show="cardInfo.orderStatus == 0">添加</b-button>                                             
                            </div>
                            <div class="col-md-6 text-right">     
                                <h4> 支付金额合计： {{totalPaymentAmount}}元</h4>                                              
                            </div>
                        </div>
                        <div class="table-scrollable mb-2">
                            <b-table striped hover bordered show-empty :items="cardInfo.cardSalesPaymentInfos" :fields="payFields">
                                <template slot="radio" slot-scope="data" >
                                    <input type="radio" name="radio" :value="data.index" v-model="paySelectIndex" v-show="cardInfo.orderStatus == 0"/>
                                </template>
                                <!-- <template slot="paymentAmount" slot-scope="row">
                                    {{ row.value | toFixed }}                                    
                                </template> -->
                                <template slot="empty" >暂无数据</template>
                            </b-table>
                        </div>
                    </b-card>
                </div>
            </div>
            <!-- 收款 - Modal  -->
            <add-pay-detail 
                ref="payModal" 
                :userInfo="userInfo" 
                :refCode="cardPaySeq"
                @surePay="sureAdd">
            </add-pay-detail>

            <!-- 开票明细 -->
            <div class="row">
                <div class="col-md-12">
                    <b-card header="发票明细">
                        <b-button size="sm" 
                            variant="success" 
                            class="header-btn-r" 
                            @click="saveInvoice"
                            v-show="(isInsert || isUpdate) && cardInfo.orderStatus == 1">保存</b-button>   
                        <div class="row">              
                            <div class="col-md-6">              
                                <b-button size="sm" variant="danger" @click="removeInvoice" v-show="(isInsert || isUpdate) && cardInfo.orderStatus == 1">删除</b-button>                                             
                                <b-button size="sm" variant="success" @click="addInvoice" v-show="(isInsert || isUpdate)  && cardInfo.orderStatus == 1">添加</b-button>                                             
                            </div>
                            <div class="col-md-6 text-right">     
                                <h4> 已开票金额： {{totalInvoiceAmount}}元</h4>                                              
                            </div>
                        </div>
                        <div class="table-scrollable mb-2">
                            <b-table striped hover bordered show-empty :items="cardInfo.invoiceDetailInfoVos" :fields="invoiceFields">
                                <template slot="radio" slot-scope="data">
                                    <input type="radio" name="radio" :value="data.index" v-model="invoiceSelectIndex"/>
                                </template> 
                                <template slot="toVoid" slot-scope="row">                        
                                    <b-button
                                        v-show="row.item.id && row.item.operation == 1 && row.item.invoiceStatus != -1"
                                        size="sm" variant="danger"
                                        @click="toVoidInvoice(row)">
                                        作废
                                    </b-button>
                                </template>	
                                <template slot="invoiceRate" slot-scope="row">
                                    {{ row.value * 100 }}%                                   
                                </template>
                                <!-- <template slot="invoiceAmount" slot-scope="row">
                                    {{ row.value | toFixed }}                                    
                                </template>
                                <template slot="invoiceAmountExcludingTax" slot-scope="row">
                                    {{ row.value | toFixed }}                                    
                                </template>
                                <template slot="taxAmount" slot-scope="row">
                                    {{ row.value | toFixed }}
                                </template> -->
                                <template slot="invoiceStatus" slot-scope="row">
                                    {{ row.value | invoiceStatusFilte }}
                                </template>
                                <template slot="empty" >暂无数据</template>
                            </b-table>
                        </div>

                        <div class="row">
                            <div class="col-md-12 text-right">                   
                                <b-button size="sm" variant="default"  @click="print">打印</b-button>
                            </div>
                        </div>
                    </b-card>
                </div>
            </div>
            <!-- 开票 - Modal -->
            <open-ticket ref="openTicket" 
                v-if="showInvoiceModal"
                @conOpenTicket='addInvoiceList'
                :invoiceContentSuffix="cardName"
                :invioceNum="cardInfo.salesActualAmount"
                invoiceContentStart='CardSales' >
            </open-ticket>

            <!-- 人车 - Modal -->
            <el-dialog ref="dialog" 
                title="人车" 
                no-close-on-backdrop 
                size="large" :visible.sync="dialogVisible"  :modal-append-to-body="false">
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
                                <b-form-input v-model="customerInfo.idNo" @blur.native="idNoBlur" :state="idNoState"/>
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
                <b-card header="车辆信息" v-show="cardInfo.cardUseTypeCode == 'VehicleCard'">
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
                                <b-form-fieldset horizontal label="车牌*" :label-cols="4" class="text-right">
                                    <b-form-input v-model="customerInfo.plateNumber" :state="plateNumberState" :readonly="hasCustomerInfo && !isInsertCusVehicle"/>
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
                        <select-car-extend-prop @getCarExtendInfo="getCarExtendInfo" ref="selectCarExtendProp"></select-car-extend-prop>
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
                                    <b-form-input type="number" v-model="customerInfo.inMileage" @blur.native="judgeMile"/>
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
        </div>
    </div>
</div>
</template>
<script>

import CarInfo from  'components/iris-carinfo'
import OpenTicket from './open-ticket'
import AddPayDetail from 'components/add-pay-detail'
import SelectCarExtendProp from 'components/select-car-extend-prop/select-car-extend-prop'
import Search from 'components/iris-search/search'

import Vue from 'vue'
import { Upload, Message, DatePicker, MessageBox, Dialog, Checkbox, Table, TableColumn, } from 'element-ui'
Vue.use(Upload)
Vue.use(DatePicker)
Vue.use(Dialog)
Vue.use(Checkbox)
Vue.use(Table)
Vue.use(TableColumn)

import api from 'common/api'
import config from 'common/config'
import common from 'common/common'
import apiUrl from 'common/api-collection'

import { getSequence, alertSuccess, getDateRange, formatDate, dateDiff, getType, getSequenceList, filter } from 'common/api-common'
import { CARD_SALE_SORDER_SEQ, CARD_SALE_INVOICE_SEQ, CARD_SALE_PAYMENT_SEQ, CUSTOM, CUSTOM_VEHICLE_SEQ, CUSTOM_VEHICLE_ADD_SEQ } from 'common/sequence'
import { PAYMENTMODE_TYPE, CERTIFICATE_TYPE, CUSTOM_TYPE } from 'common/ref-code'

import { mapActions, mapGetters } from 'vuex'

const JUST_ONLY_STORE = 'SpecialShop'    // 专店专用数据字典 code
const FIXED_DAYS = 0    

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

export default {
    components: {
        CarInfo,
        OpenTicket,
        AddPayDetail,
        SelectCarExtendProp,
        Search
    },
    data() {
        return {
            cardInfo: {
                id: '',
                orderStatus: 0,
                createTimeStr: '',
                cardSalesPaymentInfos: [],    // 收款明细
                invoiceDetailInfoVos: [],  // 发票明细 
                salesActualAmount: 0,
                startDate: '',
                endDate: ''               
            },
            salesName: '',
            saleEmpList: [],
            orderStatus: [
                {text: '未结算', value: 0},
                {text: '已结算', value: 1},                
                {text: '已作废', value: -1}
            ],
            cardExpireType: [
                {text: '固定时长', value: 0},
                {text: '标定结束日期', value: 1},                
                {text: '储值卡无有效期', value: -1}
            ],
            // vinState: null,
            isTemporarySaveEd: false,
            // 上传
            uploadUrl: config.uploadUrl,
            addParams: {
                relationCode: '',
                singleFlag: '0',
                businessType: ''
            },
            fileList: [],
            // 卡内容 - 适用范围
            contentFields: {
                detailType: {
                    label: '类型(商品/服务)'
                },
                detailCode: {
                    label: '编码(商品/服务)'
                },
                detailName: {
                    label: '名称(商品/服务)'
                },
                detailNums: {
                    label: '数量'
                },
            },
            rangeFields: {
                channelTypeName: {
                    label: '渠道'
                },
                storeName: {
                    label: '门店'
                },
            },
            cardDetailInfoVos: [],
            cardUseRangeInfoVos: [],

            // 收款明细
            payFields: {
                radio: {
                    label: '选择'
                },
                paymentTypeName: {
                    label: '支付方式'
                },
                paymentAmount: {
                    label: '收款金额'
                },
                paymentTime: {
                    label: '收款日期'
                },
                paymentEmpName: {
                    label: '收款员'
                },
                paymentTransactionNo: {
                    label: '交易流水号'
                }
            },
            paySelectIndex: -1,
            // 发票明细
            invoiceFields: {
                radio: {
                    label: '选择'
                },
                toVoid: {
                    label: '作废操作'
                },
                invoiceContentDesc: {
                    label: '开票内容'
                },
                invoiceTypeName: {
                    label: '发票类型'
                },
                invoiceRate: {
                    label: '税率'
                },
                invoiceAmount: {
                    label: '开票金额'
                },
                invoiceAmountExcludingTax: {
                    label: '去税金额'
                },
                taxAmount: {
                    label: '税金'
                },
                invoiceNo: {
                    label: '发票号'
                },
                invoiceTitle: {
                    label: '开票人/企业名称'
                },
                taxRegistrationNo: {
                    label: '纳税人识别号'
                },
                // companyPhoneNumber: {
                //     label: '电话'
                // },
                bankName: {
                    label: '开户行'
                },
                companyAddress: {
                    label: '地址'
                },
                invoiceStatus: {
                    label: '状态'
                },
                refundInvoiceNo: {
                    label: '红冲票号'
                },
            },
            invoiceSelectIndex: -1,
            showInvoiceModal: false,   // 解决异步props问题
            invoiceList: [],           // 编辑开票暂存数据

            // 收款( 结算 )
            payList: [],
            selectIndex: -1,

            confirmPayInp: '',
            confirmState: null,

            cardPaySeq: CARD_SALE_PAYMENT_SEQ,

            // 人车 
            dialogVisible: false,
            showCarList: false,
            customerInfo: {
                idType: '',
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

            selectVehicleCode: '',

            customType: []
        }
    },
    mounted() {
        this.addParams.relationCode = this.$route.query.cardSalesOrderNo

        if(this.isInsert) {
            this.cardInfo.createName = this.userInfo.empVo.empCnName
            this.cardInfo.cardSalesOrderNo = this.$route.query.cardSalesOrderNo
            
            // 根据卡号拿卡基本信息
            let cardParams = { 
                cardNo: this.$route.query.cardNo,
                next: () => {
                    this.cardInfo.storeName = this.cardInfoVo.storeName
                    this.cardInfo.cardTypeName = this.cardInfoVo.cardTypeName
                    this.cardInfo.cardNo = this.cardInfoVo.cardNo
                    this.cardInfo.cardExpireType = this.cardInfoVo.cardExpireType
                    this.cardInfo.cardName = this.cardInfoVo.cardName
                    this.cardInfo.cardAmout = this.cardInfoVo.cardAmout
                    this.cardInfo.useNatureTypeName = this.cardInfoVo.useNatureTypeName
                    this.cardInfo.cardUseTypeName = this.cardInfoVo.cardUseTypeName
                    this.cardInfo.cardUseTypeCode = this.cardInfoVo.cardUseTypeCode

                    this.cardInfo.startDate = this.cardInfoVo.startDateStr
                    this.cardInfo.endDate = this.cardInfoVo.endDateStr
                    this.cardInfo.effectiveDays = this.cardInfoVo.effectiveDays

                    this.cardInfo.expirePeriod = this.cardInfoVo.expirePeriod

                    // 应收金额默认等于卡面值
                    this.cardInfo.salesOriginalAmount = this.cardInfo.cardAmout.toFixed(2) 
                    // 卡内容
                    this.cardDetailInfoVos = this. cardInfoVo.cardDetailInfoVos
                    this.cardInfo.createTimeStr = formatDate(new Date())
                    // this.cardInfo.createTimeStr = this.cardInfoVo.createTimeStr.substring(0, 10)

                    // 根据卡模板号查询卡适用范围
                    let rangeParams = {
                        cardTemplateCode: this.cardInfoVo.cardTemplateCode,
                        storeCode: this.cardInfoVo.useNatureTypeCode == JUST_ONLY_STORE 
                                        ?  this.cardInfoVo.storeCode
                                        :  ''
                    }
                    this.getEmpList({
                        storeCode: this.cardInfoVo.storeCode
                    })
                    this.queryRange(rangeParams)
                    this.querySalesByStoreCode(this.cardInfoVo.storeCode)
                } 
            }
            this.getCardInfoByCode(cardParams)
        }else {
            this.queryCardSalesInfo(res => {
                // 根据销售单上的客户手机号, 查客户车辆信息
                if(this.cardInfo.mobilePhone && this.dialogVisible) {
                    let params = {
                        mobilePhone: this.cardInfo.mobilePhone
                    }
                    this.queryByPhone(params)
                }

                if(this.cardInfo.cardUseTypeCode == 'VehicleCard') {
                    this.$refs.car.setValue({
                        factoryCode: res.factoryCode,
                        brandCode: res.brandCode,
                        seriesCode: res.seriesCode,
                        modelCode: res.modelCode,
                        opvCode: res.opvCode,
                        ioTypeCode: res.iotypeCode
                    })
                }
                this.getEmpList({
                    storeCode: res.storeCode
                })
                this.querySalesByStoreCode(res.storeCode)
                if(res.fileCode) {
                    this.getFileList(res.fileCode)
                }
                
            })
        }
        // 人车
        this.getCertificateType()
        this.getCustomType()
    },
    computed: {
        userInfo() {
            return JSON.parse(sessionStorage.getItem('userInfo'))
        },
        isStore() {
            return this.userInfo.userAvailableInfo.availableType == 0
        },
        storeInfoVo() {
            return this.userInfo.userAvailableInfo.storeInfoVo
        },
        // 0: 新增, 1: 编辑, 2: 查看
        pageState() {
            return this.$route.query.pageState
        },
        isInsert() {
            return this.pageState == 0
        },
        isUpdate() {
            return this.pageState == 1
        },
        isWatch() {
            return this.pageState == 2
        },
        cardName() {
            return this.$route.query.cardName
        },
        effectiveDate() {
            if(this.cardInfo.cardExpireType == FIXED_DAYS) {
                if(this.cardInfo.orderStatus == 0) {
                    if(!this.cardInfo.createTimeStr) {
                        return ''
                    }
                    let startTime = this.cardInfo.createTimeStr.substring(0, 10)
                    return getDateRange(startTime, this.cardInfo.expirePeriod)
                }else if(this.cardInfo.orderStatus == 1) {
                    if(!this.cardInfo.salesTime) {
                        return ''
                    }
                    let _startTime = this.cardInfo.salesTime.substring(0, 10)
                    return getDateRange(_startTime, this.cardInfo.expirePeriod)         
                }
            }else {
                if(this.cardInfo.orderStatus == 0) {
                    if(!this.cardInfo.createTimeStr) {
                        return ''
                    }
                    let startTime = this.cardInfo.createTimeStr.substring(0, 10)
                    return `${startTime || ''} ~ ${this.cardInfo.endDate || ''}`
                }else if(this.cardInfo.orderStatus == 1) {
                    if(!this.cardInfo.salesTime) {
                        return ''
                    }
                    let _startTime = this.cardInfo.salesTime.substring(0, 10) 
                    return `${_startTime || ''} ~ ${this.cardInfo.endDate || ''}`                           
                }
            }
        },
        effectiveDays: {
            get() {
                if(this.effectiveDate) {
                    let dates = this.effectiveDate.split('~'),
                        startDate = dates[0].trim(),
                        endDate = dates[1].trim()
                    
                    if(!startDate || !endDate) {
                        return ''
                    }
                    return dateDiff(startDate, endDate)
                }
            },
            set() {}
        },
        payState() {
            if(this.paySum == this.cardInfo.salesOriginalAmount) {
                return 0
            }else if(this.paySum - this.cardInfo.salesOriginalAmount > 0) {
                return 1
            }else {
                return -1
            }
        },
        paySum() {
            let sum = 0
            this.payList.forEach(item => {
                sum += parseInt(item.paymentAmount)
            })
            return sum.toFixed(2)
        },
        payAlertInfo() {
            if(this.payState == 1) {
                return `本订单收款总金额: ${this.paySum}, 大于应收金额, 确认大于应收金额: ${this.cardInfo.salesOriginalAmount} 吗?`
            }else if(this.payState == 0) {
                return '收款金额之和等于应收金额'
            }
        },
        totalPaymentAmount() {
            let sum = 0
            if(this.cardInfo.invoiceDetailInfoVos != null) {
                this.cardInfo.cardSalesPaymentInfos.forEach(item => {
                    sum += parseInt(item.paymentAmount)
                })
            }
            return sum.toFixed(2)
        },
        totalInvoiceAmount() {
            let sum = 0
            if(this.cardInfo.invoiceDetailInfoVos != null) {
                this.cardInfo.invoiceDetailInfoVos.forEach(item => {
                    if( !item.hasOwnProperty('invoiceStatus') || item.invoiceStatus == 0) {
                        sum += parseInt(item.invoiceAmount)
                    }
                })
            }
            return sum.toFixed(2)
        },
        ...mapGetters('storeStation', [
            'cardInfoVo',
        ]),
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
        }
    },
    methods: {
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
        judgeMile() {
            console.log(1)
            if(this.customerInfo.inMileage - 0 < 0) {
                this.customerInfo.inMileage = ''
            }
        },
        setWidth(item) {
            if(item.name) {
                if(item.addName.length === 2) {
                    return 70
                }
                return item.addName.length * 26
            }
        },
        getEmpList(params) {
            api.empScheduling.queryEmpByStore(params).then(res => {
                if (res.data.code === 'success') {
                    let obj = res.data.obj
                    let saleEmpList = []
                    obj.forEach(item => {
                        this.saleEmpList.push({
                            text: item.empCnName,
                            value: item.empCode
                        })
                    })
                }
            })
        },
        querySalesByStoreCode(_storeCode) {
            api.storeInfo.queryShopInfo({
                storeCode: _storeCode
            }, msg => {
                if(msg.data.message === 'success') {
                    this.salesName = msg.data.obj.salesName
                }
            })
        },
        queryRange(params) {
            api.cardSale.queryRange(params).then(res => {
                if (res.data.code === 'success') {
                    let obj = res.data.obj
                    this.cardUseRangeInfoVos = Array.isArray(obj) ? obj : []
                }
            })
        },
        // 上传
        uploadSuccess(res) {
            if(res.code == "success") {
                let obj = res.obj[0]
                let params = JSON.parse(JSON.stringify(this.cardInfo))
                params.fileCode = obj.fileCode
                api.cardSale.update(params).then(res => {
                    Message({
                        type: 'success',
                        message: config.messInfo.success
                    })
                })
                // console.log(this.fileList.length)
                // if(this.fileList.length) {
                //     api.accessory.del([{id: this.fileList[0].response.obj[0].id}], res => {
                //         if(res.data.code === 'success') {
                //             this.fileList.splice(0, 1)                                
                //         }
                //     })
                // }
            }
        },
        uploadError(file) {
            Message({
                type: "error",
                message: "上传失败"
            });
        },
        uploadRemove(file) {
            api.accessory.del([{id: file.response.obj[0].id}], res => {
                alertSuccess(res)
            })	
        },
        getFileList(_fileCode) {
            let params = { relationCode: this.cardInfo.cardSalesOrderNo }
            api.accessory.list(params, res => {
            // let params = { fileCode: _fileCode }                
            // api.cardSale.queryFileInfo(params).then( res => {                
                if(res.data.code === 'success') {
                    this.fileList = []
                    let obj = res.data.obj
                    obj.forEach(item => {
                        let data = {
                            name: item.fileOrgName,
                            response: {
                                obj: [{id: item.id}]
                            }
                        }
                        this.fileList.push(data)
                    })
                }
            })
        },
        preview(res) {
            let params = {
                id: res.response.obj[0].id
            }
            api.accessory.pvw(params, result => {
                let data = result.data;
                if(data.code === 'success') {
                    if(data.obj) {
                        window.open(common.getUploadUrl() + data.obj);
                    }else {
                        Message('该附件不支持预览!');
                    }
                    
                }
            })
        },
        getCarInfo(data) {
            this.cardInfo.factoryCode = data.factoryCode
            this.cardInfo.brandCode = data.brandCode
            this.cardInfo.seriesCode = data.seriesCode
            this.cardInfo.modelCode = data.modelCode
            this.cardInfo.opvCode = data.opvCode
            this.cardInfo.iotypeCode = data.ioTypeCode
        },
        // 作废
        toVoid() {
            if(this.cardInfo.orderStatus === 1) {
                Message({
                    type: "warning",
                    message: "卡销售单已结算不可作废"
                })
                return
            }
            const createElement = this.$createElement
            MessageBox({
                title: '提示',
                message: createElement('p', null, [
                        createElement('span', null, '是否确定作废'),
                    ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        let params = {
                            id: this.cardInfo.id, 
                            cardSalesOrderNo: this.cardInfo.cardSalesOrderNo,
                        }
                        api.cardSale.toVoid(params).then(res => {
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'success',
                                    message: config.messInfo.success
                                })
                                this.cardInfo.orderStatus = res.data.obj.orderStatus
                            }
                        })
                        done()
                    } else {
                        done()
                        return
                    }
                }
            }).then( action => {}).catch(() => {})
        },
        // 开票
        addInvoice() {
            this.$refs.openTicket.show()
        },
        removeInvoice() {
            this.isSelected(this.invoiceSelectIndex, () => {
                let selectItem = this.cardInfo.invoiceDetailInfoVos[this.invoiceSelectIndex]
                if(selectItem.hasOwnProperty('id')
                    && selectItem.operation != 0) {
                    Message({
                        type: "warning",
                        message: "该发票号不可删除！"
                    })
                    return 
                }
                const createElement = this.$createElement
                MessageBox({
                    title: '提示',
                    message: createElement('p', null, [
                            createElement('span', null, '是否确定删除'),
                        ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            let index = this.invoiceList.length - this.cardInfo.invoiceDetailInfoVos.length + this.invoiceSelectIndex
                            if(selectItem.hasOwnProperty('id')) {
                                // this.invoiceList = JSON.parse(JSON.stringify(this.cardInfo.invoiceDetailInfoVos))
                                this.invoiceList[index].isDeleted = 1
                            }else {
                                this.invoiceList.splice(index, 1)
                            }
                            this.cardInfo.invoiceDetailInfoVos.splice(this.invoiceSelectIndex, 1)
                            this.invoiceSelectIndex = -1
                            done()
                        } else {
                            done()
                            return
                        }
                    }
                }).then( action => {}).catch(() => {})
            })
        },
        toVoidInvoice(row) {
            const createElement = this.$createElement
            MessageBox({
                title: '提示',
                message: createElement('p', null, [
                        createElement('span', null, '是否确定作废'),
                    ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        if(this.cardInfo.invoiceDetailInfoVos[row.index].hasOwnProperty('id')) {
                            // this.invoiceList = JSON.parse(JSON.stringify(this.cardInfo.invoiceDetailInfoVos))
                            this.cardInfo.invoiceDetailInfoVos[row.index].invoiceStatus = -1
                            this.invoiceList[row.index].invoiceStatus = -1
                        }
                        Message({
                            type: "warning",
                            message: "请单击保存后生效！"
                        })
                        done()
                    } else {
                        done()
                        return
                    }
                }
            }).then( action => {}).catch(() => {})
        },
        saveInvoice() {
            if(this.userInfo.userAvailableInfo.availableType != 0) {
                Message({
                    type: "warning",
                    message: "该账号无门店信息，无法保存！"
                })
                return
            }
            // 开票金额可以等于0 或者 等于支付金额
            if(this.totalInvoiceAmount - this.cardInfo.salesActualAmount == 0 || this.totalInvoiceAmount == 0) {
                if(!this.cardInfo.invoiceDetailInfoVos.length) {
                    Message({
                        type: 'warning',
                        message: '发票信息不可为空'
                    })
                    return
                }else {
                    let paramsList = JSON.parse(JSON.stringify(this.invoiceList))
                    paramsList.forEach(item => {
                        delete item.invoiceType
                        item.storeCode = this.cardInfo.storeCode
                        item.sourceOrderNo = this.cardInfo.cardSalesOrderNo
                        item.cardNo = this.cardInfo.cardNo
                        item.sourceOrderTypeCode = "CardSalesOrder"  
                        item.invoiceContentCode = "CardSales"
                        item.invoiceEmpCode = this.userInfo.empVo.empCode
                        item.hasOwnProperty('id') ? item.invoiceStatus = item.invoiceStatus : item.invoiceStatus = 0
                        // item.isSyncExternalSystem = 0 
                    })
                    this.editCardSalesInvoice(paramsList)
                } 
            }else {
                Message({
                    type: 'warning',
                    message: '开票金额必须等于实收金额'
                })
            }
        },
        addInvoiceList(info) {
            let obj = JSON.parse(JSON.stringify(info))
            obj.refundInvoiceNo = ''
            // this.cardInfo.invoiceDetailInfoVos = []
            this.cardInfo.invoiceDetailInfoVos.push(obj)
            this.invoiceList.push(obj)
            // this.invoiceList = JSON.parse(JSON.stringify(this.cardInfo.invoiceDetailInfoVos))
        },
        editCardSalesInvoice(params) {
            api.cardPay.editCardRechargeInvoiceInfo(params, res => {
                alertSuccess(res, () => {
                    this.queryCardSalesInfo()
                })
            })
        },

        // 结算
        addPay() {
            this.$refs.payModal.showModal()
        },
        removePay() {
            this.isSelected(this.paySelectIndex, () => {
                this.cardInfo.cardSalesPaymentInfos.splice(this.paySelectIndex, 1)
            })
        },
        sureAdd(info) {
            let obj = JSON.parse(JSON.stringify(info))
            obj.cardSalesOrderNo = this.$route.query.cardSalesOrderNo
            this.cardInfo.cardSalesPaymentInfos.push(obj)
        },
        confirmPay() {
            if(this.cardInfo.salesOriginalAmount - 0 < 0) {
                Message({
                    type: 'warning',
                    message: '应收金额不能小于0'
                })
                return
            }
            if(this.cardInfo.cardUseTypeCode == 'VehicleCard') {
                if(!this.cardInfo.customName || !this.cardInfo.mobilePhone || !this.cardInfo.plateNumber) {
                    this.confirmAlert('请先填写客户车辆信息')
                    return
                }
            }else {
                if(!this.cardInfo.customName || !this.cardInfo.mobilePhone) {
                    this.confirmAlert('请先填写客户信息')
                    return
                }
            }
            if(this.totalPaymentAmount - this.cardInfo.salesOriginalAmount < 0) {
                this.confirmAlert('收款金额需大于等于应收金额')
            }else {
                this.confirmAlert('结算后无法再做修改, 确认结算么',  true, () => {
                    let params = this.cardInfo.cardSalesPaymentInfos
                    // if(this.isInsert && !this.cardInfo.id) {
                        this.temporarySave(false, () => {
                            this.editCardSalesPayment(params, () => {
                                this.queryCardSalesInfo()
                            })
                        })
                    //     return
                    // }
                    // this.editCardSalesPayment(params, () => {
                    //     this.queryCardSalesInfo()
                    // })
                })

            }    
        },  
        editCardSalesPayment(params, next) {
            api.cardSale.editCardSalesPayment(params).then(res => {
                alertSuccess(res, () => {
                    next()
                })
            })
        },
        isSelected(i, next) {
            if(i === -1) {
                Message({
                    type: 'warning',
                    message: '请选择'
                })
                return
            }else {
                next()
            }
        },
        confirmAlert(title, showCancel = false, handOk = () => {}) {
            MessageBox.confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showCancelButton: showCancel,
                type: 'warning',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        handOk()
                        done()
                    } else {
                        done()
                        return
                    }
                }
            }).then(() => {}).catch(() => {})
        },
        // 暂存
        temporarySave(showAlert = true, next = () => {}) {
            if(this.cardInfo.salesOriginalAmount - 0 < 0) {
                Message({
                    type: 'warning',
                    message: '应收金额不能小于0'
                })
                return
            }
            let params = {
                cardNo: this.cardInfo.cardNo,
                cardSalesOrderNo: this.cardInfo.cardSalesOrderNo,
                storeCode: this.cardInfo.storeCode,       // 取卡上的门店
                salesEmpCode: this.cardInfo.salesEmpCode,
                customCode: this.cardInfo.customCode,
                customName: this.cardInfo.customName,     // 客户名称, 后续传编码 => 手机号, 车票号自动带出
                vehicleCode: this.cardInfo.vehicleCode,
                mobilePhone: this.cardInfo.mobilePhone,
                plateNumber: this.cardInfo.plateNumber,
                vinCode: this.cardInfo.vinCode,
                factoryCode: this.cardInfo.factoryCode,
                brandCode: this.cardInfo.brandCode,
                seriesCode: this.cardInfo.seriesCode,
                modelCode: this.cardInfo.modelCode,
                opvCode: this.cardInfo.opvCode,
                iotypeCode: this.cardInfo.iotypeCode,
                salesOriginalAmount: this.cardInfo.salesOriginalAmount,  
                cardSourceCode: 'InternalCreation',
                orderChannelCode: 'OfflineStoreSales'              
            }
            
            if(this.isInsert && !this.isTemporarySaveEd) {
                api.cardSale.insert(params).then(res => {
                    if (res.data.code === 'success') {
                        this.isTemporarySaveEd = true
                        this.cardInfo.id = res.data.obj.id
                        if(showAlert) {
                            Message({
                                type: 'success',
                                message: config.messInfo.success
                            })
                        }
                        next()
                    }
                })
            }else {
                params.id = this.cardInfo.id
                // this.update(params, next = () => {})
                api.cardSale.update(params).then(res => {
                    Message({
                        type: 'success',
                        message: config.messInfo.success
                    })
                    next()
                })
            }
        },
        print() {
            if(this.cardInfo.orderStatus != 1) {
                Message({
                    type: "warning",
                    message: "未结算不能打印"
                })
                return
            }
            let cardRechargeInvoices = JSON.parse(JSON.stringify(this.cardInfo.invoiceDetailInfoVos))
            cardRechargeInvoices.forEach(item => {
                item.invoiceStatus = this.getStatus(item.invoiceStatus)
                item.invoiceRate  = `${item.invoiceRate * 100} %`
                item.invoiceEmpName = item.invoiceTitle
            })
            // 适用范围装换
            let useRangeList = [], temp = {}
            this.cardUseRangeInfoVos.forEach(item => {
                temp[item.channelTypeCode] = item.channelTypeCode
            })
            this.cardUseRangeInfoVos.forEach(item => {
                let info = {
                    channelTypeName: '',
                    storeName: []
                }
                if(item.channelTypeCode == temp[item.channelTypeCode]) {
                    info.channelTypeName = item.channelTypeName
                    info.storeName.push(item.storeName)
                }
                useRangeList.push(info)
            })
            useRangeList.forEach(item => {
                item.storeName = item.storeName.join(',')
            })

            let printParams = {
                "cardRules": this.isInsert && !this.cardInfo.id ? this.cardInfo.cardRules : this.cardInfo.cardInfoVo.cardRules,
                "cardDescription": this.isInsert && !this.cardInfo.id ? this.cardInfo.cardDescription : this.cardInfo.cardInfoVo.cardDescription,
                "remark": this.isInsert && !this.cardInfo.id ? this.cardInfo.remark : this.cardInfo.cardInfoVo.remark,
                "storeName": this.cardInfo.storeName,
                // "cardTypeName": this.cardInfo.cardTypeName,
                "cardUseTypeName": this.cardInfo.cardUseTypeName,                
                "createName": this.cardInfo.createName,
                "salesEmpName": this.cardInfo.salesEmpName,
                "cardSalesOrderNo": this.cardInfo.cardSalesOrderNo,
                "cardNo": this.cardInfo.cardNo,
                "orderStatus": this.cardInfo.orderStatus,
                "cardExpireType": this.cardInfo.cardExpireType,
                "salesTime": this.cardInfo.salesTime,
                "createTime": this.cardInfo.createTimeStr,
                "cardName": this.cardInfo.cardName,
                "cardAmout": this.cardInfo.cardAmout,
                "useNatureTypeName": this.cardInfo.useNatureTypeName,
                "startDate": this.cardInfo.startDate,
                "endDate": this.cardInfo.endDate,

                "effectiveDays": this.effectiveDays,

                "customName": this.cardInfo.customName,
                "mobilePhone": this.cardInfo.mobilePhone,
                "plateNumber": this.cardInfo.plateNumber,
                "vinCode": this.cardInfo.vinCode,
                "factoryName": this.cardInfo.factoryName,
                "brandName": this.cardInfo.brandName,
                "seriesName": this.cardInfo.seriesName,
                "modelName": this.cardInfo.modelName,
                "opvName": this.cardInfo.opvName,
                "iotypeName": this.cardInfo.iotypeName,
                "salesOriginalAmount": this.cardInfo.salesOriginalAmount,
                "salesActualAmount": this.cardInfo.salesActualAmount,
                "salesInvoiceAmount": this.cardInfo.salesInvoiceAmount,

                "cardDetails": this.cardDetailInfoVos,
                "cardUseRanges": useRangeList,
                "cardSalesPayments": this.cardInfo.cardSalesPaymentInfos,
                "cardRechargeInvoices": cardRechargeInvoices
            }
            if(printParams.cardDetails.length) {
                printParams.cardDetails.forEach(item => {
                    item.detailTypeName = item.detailType == 0 ? '商品' : '服务'
                })
            }
            common.previewNeed(common.isdev() + apiUrl.cardSale.print, {
                "jrxmlJson": printParams,
                "jrxmlCode": "CardSalesPrintTemplate"
            })
        },
        getStatus(val) {
            if(val == 0) {
                return '已开票'
            }else if(val == 1) {
                return '已退票'
            }else if(val == -1) {
                return '已作废'
            }
        },
        cancel() {
            this.$router.push({
                path: 'query'
            })
        },
        queryCardSalesInfo(next = () => {}) {
            let params = { cardSalesOrderNo: this.$route.query.cardSalesOrderNo }
            api.cardSale.getCardSalesOrderInfo(params).then(res => {
                if (res.data.code === 'success') {
                    let obj = res.data.obj
                    this.cardInfo = obj
                    // 门店取的是卡信息上的门店, 而不是卡销售单上的门店
                    this.cardInfo.storeName = obj.cardInfoVo.storeName
                    this.cardInfo.storeCode = obj.cardInfoVo.storeCode

                    this.cardInfo.salesOriginalAmount = obj.salesOriginalAmount.toFixed(2)
                    this.cardInfo.createTimeStr = obj.createTimeStr.substring(0, 10)
                    if(this.cardInfo.orderStatus == 1) {
                        this.cardInfo.salesTime = obj.salesTime.substring(0, 10)
                    }else {    // if(this.cardInfo.orderStatus == 0) 
                        this.cardInfo.endDate = obj.cardInfoVo.endDateStr
                    }
                    
                    this.showInvoiceModal = true
                    this.invoiceList = JSON.parse(JSON.stringify(this.cardInfo.invoiceDetailInfoVos))

                    // 新增不更新卡内容和适用范围
                    if(this.isUpdate || this.isWatch) {
                        this.cardUseRangeInfoVos = obj.cardInfoVo ? obj.cardInfoVo.cardUseRangeInfoVos : []
                        this.cardDetailInfoVos = obj.cardInfoVo ? obj.cardInfoVo.cardDetailInfoVos : []
                    }
                    // 处理金额保留两位小数
                    if(Array.isArray(this.cardInfo.cardSalesPaymentInfos) 
                        && this.cardInfo.cardSalesPaymentInfos.length) {
                        this.cardInfo.cardSalesPaymentInfos.forEach(item => {
                            item.paymentAmount = item.paymentAmount.toFixed(2)                                                         
                        })
                    }
                    if(Array.isArray(this.cardInfo.invoiceDetailInfoVos) 
                        && this.cardInfo.invoiceDetailInfoVos.length) {
                        this.cardInfo.invoiceDetailInfoVos.forEach(item => {
                            item.invoiceAmount = item.invoiceAmount.toFixed(2)
                            item.invoiceAmountExcludingTax = item.invoiceAmountExcludingTax.toFixed(2)
                            item.taxAmount = item.taxAmount.toFixed(2) 
                        })
                    }
                    next(obj)
                }
            })
        },
        ...mapActions('storeStation', [
            'getCardInfoByCode',
        ]),

        // 人车
        showEmpCarModal() {
            if(this.cardInfo.orderStatus == 0) {
                this.dialogVisible = true
                if(this.cardInfo.mobilePhone) {
                    let params = {
                        mobilePhone: this.cardInfo.mobilePhone
                    }
                    this.queryByPhone(params)
                }
                // if(this.carSubInfo.customVehicleAddInfoVos) {
                //     let _extendList = []
                //     this.carSubInfo.customVehicleAddInfoVos.forEach(item => {
                //         let info = {
                //             propName: item.addName,
                //             propCode: item.addCode,
                //             selectedProps: [item.addValue]
                //         }
                //         _extendList.push(info)
                //     })
                //     // 可能不再需要
                //     // this.$nextTick(() => {
                //     //     if(this.$refs.selectCarExtendProp) {
                //             // this.$refs.selectCarExtendProp.setValue(this.carSubInfo, _extendList)
                //     //     }
                //     // })
                // }
            }
        },
        hideEmpCarModal() {
            this.dialogVisible = false
        },
        carListBtnClick() {
            let params = {
                mobilePhone: this.customerInfo.mobilePhone
            }
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
                                let addInfoVos = this.carSubInfo.customVehicleInfoVos || []
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
                                this.customerInfo[key] = ''
                                if(key === 'customVehicleInfoVos') {
                                    this.customerInfo[key] = []
                                }
                            }
                        }
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
            this.extendList = extendInfo
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
            if(this.cardInfo.cardUseTypeCode == 'VehicleCard' && !this.customerInfo.plateNumber && !this.showCarList) {
                this.plateNumberState = 'invalid'
                return
            }
            if(this.emailState == 'invalid' || this.idNoState == 'invalid') {
                return
            }
            // 时间格式转换
            this.customerInfo.birthday 
                ? this.customerInfo.birthday = new Date(this.customerInfo.birthday).format('yyyy-MM-dd')
                : this.customerInfo.birthday = ''
            if(this.cardInfo.cardUseTypeCode == 'VehicleCard') {
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

            if(this.cardInfo.cardUseTypeCode == 'VehicleCard') {
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

                    this.selectVehicleCode = vehicleInfo.vehicleCode

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
                        // console.log(this.customerInfo)
                        if(!cusCarParams.iotypeCode) {
                            Message({
                                type: 'warning',
                                message: '车型主信息必填'
                            })
                            return
                        }
                        this.updateCustomerCar(cusCarParams, () => {
                            this.selIndex = 0
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
                                    this.updateCustomerCar(cusCarParams, () => {
                                        this.setCardCusVeehicle()
                                    })
                                })
                            })
                        }else {
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
            // console.log(this.customerInfo)
            // console.log(this.customerInfo.customVehicleInfoVos[0].vehicleCode)
            this.cardInfo.customCode = this.customerInfo.customCode
            this.cardInfo.vehicleCode = this.selectVehicleCode
            this.cardInfo.customName = this.customerInfo.customName
            this.cardInfo.mobilePhone = this.customerInfo.mobilePhone

            this.cardInfo.plateNumber = this.customerInfo.plateNumber
            this.cardInfo.vinCode = this.customerInfo.vinCode

            this.cardInfo.factoryCode = this.customerInfo.factoryCode
            this.cardInfo.brandCode = this.customerInfo.brandCode
            this.cardInfo.seriesCode = this.customerInfo.seriesCode
            this.cardInfo.modelCode = this.customerInfo.modelCode
            this.cardInfo.opvCode = this.customerInfo.opvCode
            this.cardInfo.iotypeCode = this.customerInfo.iotypeCode

            this.$refs.car.setValue(this.carInfoParams)  
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
                this.updateCustomInfo(params, () => {
                    success()
                })
            }else {
                getSequence(CUSTOM, res => {
                    if(params.hasOwnProperty('id')) {
                        delete params.id
                    }
                    params.customCode = res
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
                this.selectVehicleCode = _vehicleCode
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
                                this.insertCustomerCar(cusCarParams, () => {
                                    success()
                                })
                            })
                        })
                    }else {
                        this.insertCustomerCar(cusCarParams, () => {
                            success()
                        })
                    }
                })
            })
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
        'cardInfo.orderStatus': {
            handler(val) {
                if(val != 0) {
                    delete this.payFields.radio
                }
            },
            immediate: true
        },
        dialogVisible(val) {
            if(val) {
                this.customNameState = null
                this.mobilePhoneState = null
                this.plateNumberState = null
            }
        },
    },
    filters: {
        toFixed(val) {
            if(typeof val == 'number') {
                return val.toFixed(2)
            }
        },
        invoiceStatusFilte(val) {
            if(val == 0) {
                return '已开票'
            }else if(val == 1) {
                return '已退票'
            }else if(val == -1) {
                return '已作废'
            }
        },
        serTypeFilter(val) {
            if(val == 0) {
                return '商品'
            }else if(val == 1) {
                return '服务'
            }
        }
    }
}
</script>
<style scoped>
.card-content-style .table-scrollable {
    height: 200px;
    overflow-y: scroll;
}
.header-btn-r{
    position: absolute;
    top: 8px;
    right: 20px;
}
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


