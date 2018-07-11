<template>
<div class="animated fadeIn clear-card">
    <b-card header="维修工单">
        <div class="col-md-3 fixd-right">
            <b-form-fieldset horizontal label="订单业务类型" :label-cols="6" class="text-right">
                <b-form-select v-model="repairOrderInfo.businessTypeCode" :options="businessTypeList" :disabled="isPayed" v-if="repairOrderInfo.businessTypeCode != 'CarWash'">
                </b-form-select>
                <b-form-select v-model="repairOrderInfo.businessTypeCode" :options="businessType" disabled v-if="repairOrderInfo.businessTypeCode == 'CarWash'">
                </b-form-select>
            </b-form-fieldset>
        </div>
        <div class="row">
            <div class="col-md-4">
                <p class="font-size-20">
                    <strong>订单号: {{repairOrderInfo.orderNo}}</strong>
                </p>
            </div>
            <div class="col-md-8 flow-container" v-show="false">
                <div class="flow">
                    <div class="flow-item clearfix">
                        <div class="flow-icon pull-left" style="background: #fff">
                            <img src="./img/Group 10.png" alt="">
                        </div>
                        <div class="text pull-left">
                            <span>预检</span>
                        </div>
                    </div>
                    <div class="flow-item flow-active clearfix">
                        <div class="flow-icon pull-left" style="background: #fff">
                            <img src="./img/loading.png" alt="">
                        </div>
                        <div class="text pull-left">
                            <span>工单</span>
                        </div>
                    </div>
                    <div class="flow-item clearfix">
                        <div class="flow-icon pull-left">3</div>
                        <div class="text pull-left">
                            <span>施工</span>
                        </div>
                    </div>
                    <div class="flow-item clearfix">
                        <div class="flow-icon pull-left">4</div>
                        <div class="text pull-left">
                            <span>竣工</span>
                        </div>
                    </div>
                    <div class="flow-item clearfix">
                        <div class="flow-icon pull-left">5</div>
                        <div class="text pull-left">
                            <span>质检</span>
                        </div>
                    </div>
                    <div class="flow-item clearfix">
                        <div class="flow-icon pull-left">6</div>
                        <div class="text pull-left">
                            <span>结算</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-2">
                <p class="font-size-20">
                    <strong>{{repairOrderInfo.custPlates}}</strong>
                </p>
                <p class="line-limit" :title="repairOrderInfo.carDisplayName">
                    <strong class="font-size-16">
                        {{repairOrderInfo.carDisplayName}}
                    </strong>
                </p>
            </div> 
            <div class="col-md-2">
                <p class="font-size-16">车主手机号</p>
                <P class="font-size-16">
                    <strong>{{repairOrderInfo.custMobile}}</strong>
                </P>
            </div> 
            <div class="col-md-2">
                <p class="font-size-16">客户姓名</p>
                <P class="font-size-16">
                    <strong>{{repairOrderInfo.custName}}</strong>
                </P>
            </div> 
            <div class="col-md-2">
                <p class="font-size-16">最后一次进厂时间</p>
                <P class="font-size-16">
                    <strong>{{ custVehicleInfo.closingDate || repairOrderInfo.createTimeStr | timeSubstring }}</strong>
                </P>
            </div> 
            <div class="col-md-2">
                <p class="font-size-16">最近一次进厂门店</p>
                <P class="font-size-16">
                    <strong>{{ custVehicleInfo.storeName }}</strong>
                </P>
            </div> 
            <div class="col-md-2">
                <p class="font-size-16">最近一次消费金额</p>
                <P class="font-size-16">
                    <strong>{{ custVehicleInfo.actualTotalPrice }}</strong>
                </P>
            </div>
        </div>
        <div class="row">
            <div class="col-md-7">
                <table class="table b-table table-striped table-hover table-bordered">
                    <tr>
                        <td>进店里程数: {{ custVehicleInfo.inMileage }}</td>
                        <td>保修到期日: </td>
                    </tr>
                    <tr>
                        <td>下次保养里程数: {{ custVehicleInfo.nextMaintenanceMileage }}</td>
                        <td>距离保修到期: </td>
                    </tr>
                    <tr>
                        <td>距离下次保养: {{ days }} 天</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>商业险公司: {{ custVehicleInfo.commercialInsuranceCompanyName }}</td>
                        <td>交强险公司: {{ custVehicleInfo.compulsoryInsuranceCompanyName }}</td>
                    </tr>
                    <tr>
                        <td>商业险到期日: {{ custVehicleInfo.commercialInsuranceEndDate }}</td>
                        <td>交强险到期日: {{ custVehicleInfo.compulsoryInsuranceEndDate }}</td>
                    </tr>
                </table>
            </div>
            <div class="col-md-5">
                <div class="row" style="border: 1px solid #c2cfd6">
                    <div class="col-md-4 text-center padding-top-7">
                        <p>驾驶证</p>
                        <div style="height: 111px">
                            <img :src="custVehicleInfo.filePath" alt="" width="100px" height="111px">
                        </div>
                        <div>
                            <p>持有卡:
                                <a  class="ml-2" href="javascript:;" @click="showCardModal">{{custVehicleInfo.cardNums || 0}}</a> &nbsp;&nbsp;张
                            </p>
                            <p>持有卷:
                                <a  class="ml-2" href="javascript:;" >{{custVehicleInfo.couponNums || 0}}</a> &nbsp;&nbsp;张
                            </p>
                        </div>
                    </div>
                    <div class="col-md-8 padding-top-7"> 
                        <p>生日:  {{ custVehicleInfo.birthday }}</p> 
                        <p>Email: {{ custVehicleInfo.email }}</p>    
                        <p>身份证:  {{ custVehicleInfo.idNo }}</p>    
                        <p>准驾车型:  {{ custVehicleInfo.certificateProperty1 }}</p>    
                        <p>初次领证日期: {{ custVehicleInfo.firstGetDate }} </p>    
                        <p>驾照到期日期: {{ custVehicleInfo.expireDate }} </p>                              
                    </div>                    
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <b-button size="sm" variant="primary" class="pull-right" @click="showUseCardModel" :disabled="isPayed">用卡</b-button>
            </div>
        </div>
        <!-- 服务信息 -->
        <!-- <hr> -->
        <h5><strong>服务信息</strong></h5>
        <div class="mb-2 repair-order">
            <el-table
                ref="serviceTable"
                v-if="reloadService"
                :data="serviceList"
                tooltip-effect="dark"
                min-height="300"
                @expand="expandChange"
                :expand-row-keys="serviceExpands"
                :row-key="getServiceRowKeys"
                @current-change="serviceToggleRowExpansion"
                border>
                <el-table-column type="expand">
                    <template slot-scope="scope" v-if="scope.$index != serviceList.length - 1">
                        <el-table
                            v-show="serviceList[scope.$index].skuOrderDetailInfoList"
                            :data="serviceList[scope.$index].skuOrderDetailInfoList"  
                            tooltip-effect="dark"
                            border>
                            <el-table-column
                                prop="skuCode"
                                label="商品编码"
                                width="200"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                        {{ subScope.row.skuCode || subScope.row.skuTempCode }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="skuName"
                                label="商品名称"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                        {{ subScope.row.skuName }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="skuDisplayName"
                                label="显示名称"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                        <b-form-input v-model="subScope.row.skuDisplayName" :readonly="subScope.row.isDeleted == '1' || isPayed"  @blur.native="updateService(scope.$index)"/>
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="accountTypeName"
                                label="记账类型"
                                width="300"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    <account-type-select
                                        :ref="'serviceSkuAccountType' + scope.$index + subScope.$index"
                                        :preIndex="scope.$index"
                                        :disabled="true"
                                        :index="subScope.$index"
                                        :accountTypeList="accountTypeList"
                                        @getValue="getServiceSkuAccountType">
                                    </account-type-select>
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                    <!-- :disabled="scope.row.isDeleted == '1' || isPayed || scope.row.dispatchDetailStatus != null"  -->
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="detailStatus"
                                label="状态"
                                width="100"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    <span ref="detailStatus" :class="{'text-danger' : subScope.row.detailStatus == 0}">{{ subScope.row.detailStatus | detailStatus }}</span>
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="nums"
                                label="材料数量"
                                width="100"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                        {{ subScope.row.nums }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="originalSalesPrice"
                                label="标准销售单价门市单价(元)"
                                width="220"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    {{ subScope.row.originalSalesPrice | toFixed }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="salesPrice"
                                label="销售售价(元)"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    {{ subScope.row.salesPrice | toFixed }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="discountRate"
                                label="商品折扣(%)"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                        <input v-model="subScope.row.discountRate" 
                                        type="number"
                                        style="width: 120px"
                                        :disabled="subScope.row.isDeleted == '1' || scope.row.priceType == 1 || isPayed || scope.row.dispatchDetailStatus != null || scope.row.accountTypeCode != 'normalSale' || subScope.row.skuTempCode" 
                                        @blur="serviceSkuRateBlur(scope.$index, subScope)"
                                        @input="serviceSkuDiscountRateChange(subScope)"/>
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="discountMoney"
                                label="折扣金额"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                        <input v-model="subScope.row.discountMoney"
                                            type="number"
                                            style="width: 120px"
                                            disabled
                                            @blur="updateService(scope.$index)"/>
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="actualSalesPrice"
                                label="折后价"
                                width="100"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                        {{ subScope.row.actualSalesPrice | toFixed }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="cardNo"
                                label="卡号/劵号"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                        {{ subScope.row.cardNo }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="cardName"
                                label="卡/卷名称"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                        {{ subScope.row.cardName }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="serviceCode"
                    label="服务编码"
                    width="160">
                    <template slot-scope="scope">
                        <search
                            v-if="scope.$index == serviceList.length - 1"
                            ref="codeSearch"
                            :dataList="codeDatalist"
                            :disabled="isPayed"
                            option="serviceCode"
                            propName="service"
                            searchPlaceholder="请输入编码/名称"
                            @dataChange="codeQuerySelect"
                            @itemValue="codeItemClick"
                            @clickShowBack="codeFirstLoad"
                            @clearValue="codeClearValue"
                            @comScroll="codeScrollBottom">
                        </search>
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <a href="javascript:;" @click="watchService(scope)">{{ scope.row.serviceCode }}</a>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="serviceName"
                    label="服务名称"
                    width="250"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <a href="javascript:;" @click="watchService(scope)">{{ scope.row.serviceName }}</a>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="serviceDisplayName"
                    label="显示名称"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <b-form-input v-model="serviceList[scope.$index].serviceDisplayName"
                                :readonly="scope.row.isDeleted == '1' || isPayed"  @blur.native="updateService(scope.$index)" v-if="scope.$index != serviceList.length - 1"/>
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="stockNums"
                    label="记账类型"
                    width="300"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <account-type-select v-if="scope.$index != serviceList.length - 1"
                                :ref='"serviceAccountType" + scope.$index'
                                :index="scope.$index"
                                :disabled="scope.row.isDeleted == '1' || isPayed || scope.row.dispatchDetailStatus != null" 
                                :accountTypeList="accountTypeList"
                                @getValue="getServiceAccountType">
                            </account-type-select>
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="detailStatus"
                    label="状态"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <span :class="{'text-danger' : scope.row.detailStatus == -1}">
                                {{ scope.row.detailStatus | serviesDetailStatus }}
                            </span>
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="priceType"
                    label="服务类型"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.priceType | priceType }}
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="actualWorkHours"
                    label="标准工时"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <b-form-input v-if="scope.$index != serviceList.length - 1"
                                v-model="serviceList[scope.$index].actualWorkHours"
                                :readonly="readonlyWorkHours(scope)"  
                                @blur.native="updateService(scope.$index)"/>
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="actualWorkHourPrice"
                    label="工时单价"
                    width="130"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <b-form-input v-if="scope.$index != serviceList.length - 1"
                                v-model="serviceList[scope.$index].actualWorkHourPrice"
                                :readonly="readonlyWorkHours(scope)"  
                                @blur.native="updateService(scope.$index)"/>
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="totalSkuNums"
                    label="材料数量"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.totalSkuNums }}
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="totalSkuMoney"
                    label="材料费"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.totalSkuMoney | toFixed }}
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="originalSalesPrice"
                    label="标准售价门市价(元)"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.originalSalesPrice | toFixed }}
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="salesPrice"
                    label="销售售价(元)"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.salesPrice | toFixed }}    
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="discountRate"
                    label="人工费折扣(%)"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <input v-model="serviceList[scope.$index].discountRate" 
                                type="number"
                                style="width: 120px"
                                :disabled="scope.row.isDeleted == '1' || scope.row.accountTypeCode != 'normalSale' || isPayed || scope.row.dispatchDetailStatus != null" 
                                v-if="scope.$index != serviceList.length - 1"
                                @blur="serviceRateBlur(scope.$index)"
                                @input="serviceDiscountRateChange(scope)"/>
                            <!--  || !scope.row.maxDisCountPrice -->
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="discountMoney"
                    label="折扣金额"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <input v-model="serviceList[scope.$index].discountMoney"
                                type="number"
                                style="width: 120px"
                                disabled
                                v-if="scope.$index != serviceList.length - 1"/>
                        
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="actualSalesPrice"
                    label="折后价"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.actualSalesPrice | toFixed }}
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="workEmpName"
                    label="施工人"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <span >{{ scope.row.workEmpName}}</span>                           
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cardNo"
                    label="卡号/劵号"
                    width="180"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <span >{{ scope.row.cardNo}}</span>                           
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cardName"
                    label="卡/卷名称"
                    width="250"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <span >{{ scope.row.cardName}}</span>                           
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <a href="javascript:;" v-if="scope.$index != serviceList.length - 1" @click="showServiceRemarkModal(scope)">备注</a>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operation"
                    label="操作"
                    show-overflow-tooltip>
                    <template slot-scope="scope" >
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <b-button size="sm" variant="danger" 
                                :disabled="scope.row.isDeleted == '1' || isPayed" 
                                v-if="scope.$index != serviceList.length - 1" 
                                @click="serviceToVoid(scope)">
                                {{scope.row.isDeleted == '0' ? '作废' : '已作废'}}
                            </b-button>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 精品信息 -->
        <!-- <hr> -->
        <h5 class="margin-top-20"><strong>精品信息</strong></h5>
        <div class="mb-2 repair-order">
            <el-table
                ref="skuTable"
                v-if="reloadSku"
                :data="skuList"
                tooltip-effect="dark"
                min-height="300"
                border>
                <el-table-column
                    prop="skuCode"
                    label="商品编码"
                    width="160">
                    <template slot-scope="scope">
                        <search
                            v-if="scope.$index == skuList.length - 1"
                            ref="skuCode"
                            :dataList="skuCodeList"
                            :disabled="isPayed"
                            option="skuCode"
                            propName="sku"
                            searchPlaceholder="请输入编码/名称"
                            @dataChange="skuCodeQuery"
                            @itemValue="skuCodeItemClick"
                            @clickShowBack="skuCodeFirstLoad"
                            @clearValue="skuCodeClearValue"
                            @comScroll="skuCodeScrollBottom">
                        </search>
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}" v-if="scope.$index != skuList.length - 1">
                            <a href="javascript:;" @click="watchSku(scope)">{{ scope.row.skuCode }}</a>
                            <hr class="disabled-line"  v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="skuName"
                    label="商品名称"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}" v-if="scope.$index != skuList.length - 1">
                            <a href="javascript:;" @click="watchSku(scope)" >{{ scope.row.skuName }}</a>
                            <hr class="disabled-line"  v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="skuDisplayName"
                    label="显示名称"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <b-form-input v-model="skuList[scope.$index].skuDisplayName" :readonly="scope.row.isDeleted == '1' || isPayed"  @blur.native="updateSku" v-if="scope.$index != skuList.length - 1"/>
                            <hr class="disabled-line"  v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="accountTypeName"
                    label="记账类型"
                    width="300"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <account-type-select v-if="scope.$index != skuList.length - 1"
                                :ref='"accountType" + scope.$index'
                                :disabled="scope.row.isDeleted == '1' || isPayed" 
                                :index="scope.$index"
                                :accountTypeList="accountTypeList"
                                @getValue="getSkuAccountType">
                            </account-type-select>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="detailStatus"
                    label="状态"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}" v-if="scope.$index != skuList.length - 1">
                            <span ref="detailStatus" :class="{'text-danger' : scope.row.detailStatus == 0}">
                                {{ scope.row.detailStatus | detailStatus }}
                            </span>
                            <hr class="disabled-line"  v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="skuStandards"
                    label="规格"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.skuStandards }}
                            <hr class="disabled-line"  v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="skuModel"
                    label="型号"
                    width="130"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.skuModel }}
                            <hr class="disabled-line"  v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="nums"
                    label="数量"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.nums }}
                            <hr class="disabled-line"  v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="unitName"
                    label="单位"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.unitName }}
                            <hr class="disabled-line"  v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="originalSalesPrice"
                    label="标准销售单价门市单价(元)"
                    width="220"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.originalSalesPrice | toFixed }}
                            <hr class="disabled-line"  v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="salesPrice"
                    label="销售售价(元)"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.salesPrice | toFixed }}
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="discountRate"
                    label="商品折扣(%)"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <input v-model="skuList[scope.$index].discountRate" 
                                style="width: 120px"
                                type="number"
                                :disabled="scope.row.isDeleted == '1' || scope.row.accountTypeCode != 'normalSale' || isPayed" 
                                v-if="scope.$index != skuList.length - 1"
                                @blur="skuRateBlur(scope.$index)"
                                @input="skuDiscountRateChange(scope)"/>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="discountMoney"
                    label="折扣金额"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <input v-model="skuList[scope.$index].discountMoney"
                                style="width: 120px"
                                type="number"
                                :disabled="scope.row.isDeleted == '1' || scope.row.accountTypeCode != 'normalSale' || isPayed" 
                                v-if="scope.$index != skuList.length - 1"
                                @blur="skuMoneyBlur(scope.$index)"
                                @input="skuDiscountMoneyChange(scope)"/>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="actualSalesPrice"
                    label="折后价"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.actualSalesPrice | toFixed }}
                            <hr class="disabled-line"  v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="serviceName"
                    label="	施工服务"
                    width="100">
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <b-button size="sm" variant="primary" 
                                :disabled="scope.row.isDeleted == '1' || isPayed" 
                                v-if="scope.$index != skuList.length - 1 && !scope.row.installationServiceInfoVo" 
                                @click="showConstructionModal(scope)">
                                去施工
                            </b-button>
                            <a href="javascript:;" @click="showConstructionModal(scope)" v-if="scope.row.installationServiceInfoVo">{{scope.row.installationServiceInfoVo.serviceDisplayName}}</a>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="installationServiceActualPrice"
                    label="施工费"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <span v-if="scope.$index != skuList.length - 1">
                                {{ scope.row.installationServiceActualPrice || 0 }}
                            </span>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cardNo"
                    label="卡号/劵号"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!-- , 'height25' : !scope.row.cardName -->
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <span >{{ scope.row.cardNo}}</span>                           
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cardName"
                    label="卡/卷名称"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!-- , 'height25' : !scope.row.cardName -->
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <span>{{ scope.row.cardName}}</span>                                                   
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注">
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <a href="javascript:;" v-if="scope.$index != skuList.length - 1" @click="showRemarkModal(scope)">备注</a>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operation"
                    label="操作">
                    <template slot-scope="scope" >
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <b-button size="sm" variant="danger" 
                                :disabled="scope.row.isDeleted == '1' || isPayed" 
                                v-if="scope.$index != skuList.length - 1" 
                                @click="skuToVoid(scope)">
                                {{scope.row.isDeleted == '0' ? '作废' : '已作废'}}
                            </b-button>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 托外信息 -->
        <!-- <hr> -->
        <h5 class="margin-top-20"><strong>托外信息</strong></h5>
        <div class="mb-3 repair-order">
            <el-table
                ref="outsideTable"
                v-if="reloadOutside"
                :data="outsideList"
                tooltip-effect="dark"  
                :expand-row-keys="outsideExpands"
                :row-key="getOutsideRowKeys"
                @current-change="outsideToggleRowExpansion"
                @expand="outsideExpandChange"
                border>
                <el-table-column type="expand">
                    <template slot-scope="scope" v-if="scope.$index != outsideList.length - 1">
                        <el-table
                            v-show="outsideList[scope.$index].skuOrderDetailInfoList"
                            :data="outsideList[scope.$index].skuOrderDetailInfoList"  
                            tooltip-effect="dark"
                            border>
                            <el-table-column
                                prop="skuCode"
                                label="商品编码"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    {{ subScope.row.skuCode || subScope.row.skuTempCode }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="skuName"
                                label="商品名称"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    {{ subScope.row.skuName }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="skuDisplayName"
                                label="显示名称"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    <b-form-input v-model="subScope.row.skuDisplayName" :readonly="subScope.row.isDeleted == '1' || isPayed"  @blur.native="updateOutside(scope.$index)"/>
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="accountTypeName"
                                label="记账类型"
                                width="300"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    <account-type-select
                                        :ref="'outsideSkuAccountType' + scope.$index + subScope.$index"
                                        :preIndex="scope.$index"
                                        :index="subScope.$index"
                                        :disabled="true"
                                        :accountTypeList="accountTypeList"
                                        @getValue="getOutsideSkuAccountType">
                                    </account-type-select>
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                    <!-- :disabled="scope.row.isDeleted == '1' || isPayed"  -->
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="detailStatus"
                                label="状态"
                                width="100"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    <span ref="detailStatus" :class="{'text-danger' : subScope.row.detailStatus == 0}">{{ subScope.row.detailStatus | detailStatus }}</span>
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="nums"
                                label="材料数量"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                        {{ subScope.row.nums }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="originalSalesPrice"
                                label="标准销售单价门市单价(元)"
                                width="220"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    {{ subScope.row.originalSalesPrice | toFixed }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="salesPrice"
                                label="销售售价(元)"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    {{ subScope.row.salesPrice | toFixed }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="discountRate"
                                label="商品折扣(%)"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    {{ subScope.row.discountRate }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="discountMoney"
                                label="折扣金额"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    {{ subScope.row.discountMoney | toFixed }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="actualSalesPrice"
                                label="折后价"
                                width="160"
                                show-overflow-tooltip>
                                <template slot-scope="subScope">
                                    <div :class="{'disabled-box' : subScope.row.isDeleted == '1'}">
                                    {{ subScope.row.actualSalesPrice | toFixed }}
                                        <hr class="disabled-line" v-show="subScope.row.isDeleted == '1'"/>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="serviceCode"
                    label="服务编码"
                    width="160">
                    <template slot-scope="scope">
                        <search
                            v-if="scope.$index == outsideList.length - 1"
                            ref="outSideCode"
                            :dataList="outSideServiceCodeList"
                            :disabled="isPayed"
                            option="serviceCode"
                            propName="service"
                            :showSearch='false'
                            @itemValue="outSideCodeItemClick"
                            @clickShowBack="outSideCodeFirstLoad">
                        </search>
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <a href="javascript:;" @click="watchOutSide(scope)">{{ scope.row.serviceCode }}</a>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="serviceName"
                    label="服务名称"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <a href="javascript:;" @click="watchOutSide(scope)">{{ scope.row.serviceName }}</a>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="serviceDisplayName"
                    label="显示名称"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <b-form-input v-model="outsideList[scope.$index].serviceDisplayName"
                                :readonly="scope.row.isDeleted == '1' || isPayed"  @blur.native="updateOutside(scope.$index)"
                                v-if="scope.$index != outsideList.length - 1"/>
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="stockNums"
                    label="记账类型"
                    width="300"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <account-type-select v-if="scope.$index != outsideList.length - 1"
                                :ref='"outsideAccountType" + scope.$index'
                                :index="scope.$index"
                                :disabled="scope.row.isDeleted == '1' || isPayed" 
                                :accountTypeList="accountTypeList"
                                @getValue="getOutsideAccountType">
                            </account-type-select>
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="detailStatus"
                    label="状态"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <span :class="{'text-danger' : scope.row.detailStatus == -1}">
                                {{ scope.row.detailStatus | serviesDetailStatus }}
                            </span>
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="priceType"
                    label="服务类型"
                    width="160"
                    show-overflow-tooltip> priceType
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.priceType | priceType }}
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="outsideType"
                    label="委托外包类型"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.outsideType | outsideType }}
                            <hr class="disabled-line"  v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="supplierName"
                    label="供应商名称"
                    width="130"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.supplierName }}
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="needSku"
                    label="是否提供材料"
                    width="130"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.needSku | needSku }}
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="totalSkuNums"
                    label="材料数量"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.totalSkuNums }}
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="totalSkuMoney"
                    label="材料费"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.totalSkuMoney | toFixed }}
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="originalSalesPrice"
                    label="销售价格(元)"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.originalSalesPrice | toFixed }}
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="actualWorkHours"
                    label="工时数"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.actualWorkHours }}
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="actualWorkHourPrice"
                    label="工时单价"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.actualWorkHourPrice | toFixed }}
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="isDispatch"
                    label="是否进入调度看板"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            {{ scope.row.isDispatch | isDispatch }}
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="workEmpName"
                    label="施工人"
                    width="100"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}" >
                            {{ scope.row.workEmpName }}
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}">
                            <a href="javascript:;" v-if="scope.$index != outsideList.length - 1" @click="showOutsideRemarkModal(scope)">备注</a>
                            
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="operation"
                    label="操作"
                    width="160"
                    show-overflow-tooltip>
                    <template slot-scope="scope" >
                        <div :class="{'disabled-box' : scope.row.isDeleted == '1'}" v-if="scope.$index != outsideList.length - 1" >
                            <b-button size="sm" variant="danger" 
                                :disabled="scope.row.isDeleted == '1' || isPayed" 
                                @click="outsideToVoid(scope)">
                                {{scope.row.isDeleted == '0' ? '作废' : '已作废'}}
                            </b-button>
                            <b-button size="sm" variant="primary" 
                                :disabled="scope.row.isDeleted == '1' || isPayed" 
                                v-if="scope.row.detailStatus != 10 && scope.row.isDispatch == 0"
                                @click="rowCompleted(scope)">
                                竣工
                            </b-button>
                            <hr class="disabled-line" v-show="scope.row.isDeleted == '1'"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 报价预览 -->
        <h5><strong>报价预览</strong></h5>
        <hr>
        <div class="row">
            <div class="col-md-3  padding-top-70">
                <b-form-fieldset horizontal label="预计交车时间: " :label-cols="5" class="text-right">
                    <el-date-picker
                        :disabled="isPayed"
                        v-model="repairOrderInfo.bookingClosingDate"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </b-form-fieldset>
            </div>
            <div class="col-md-3  padding-top-70">
                <b-form-fieldset horizontal label="车辆进店标签" :label-cols="5" class="text-right">
                    <b-form-select :options="inStoreFlagList" v-model="repairOrderInfo.inStoreFlag" :disabled="isPayed"></b-form-select>
                </b-form-fieldset>
            </div>
            <div class="col-md-3  padding-top-70">
                <b-form-fieldset horizontal label="最后出厂公里数" :label-cols="5" class="text-right">
                    <b-form-input type="number" min="0" v-model="repairOrderInfo.mileageOutStore" :readonly="isPayed" @blur.native="saveMileageOutStore"/>
                </b-form-fieldset>
            </div>
            <div class="col-md-3 text-right">
                <p>维修项目<span>{{repairNums}}</span>个, 合计: ￥{{repairOrderInfo.originalTotalPrice | moneyFilter}}</p>
                <p>折扣/优惠金额: ￥{{repairOrderInfo.discountTotalPrice | moneyFilter}}</p>
                <p>实际应付: <span class="color-red">￥{{repairOrderInfo.actualTotalPrice | moneyFilter}}</span></p>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-6">
                <div class="font-size-20">
                    <span>开单 : {{ repairOrderInfo.salesEmpName }}</span>
                    <span class="margin-left-30">日期 : {{repairOrderInfo.createTimeStr | timeFilter}}</span>
                </div>
            </div>
            <div class="col-md-6 text-right">
                <!-- <span class="margin-right-30">客户签名: ___________</span> -->
                <b-button size="sm" variant="success" @click="saveOrder" :disabled="isPayed || emptyOrder" v-show="repairOrderInfo.orderStatus != 10 && repairOrderInfo.isCancel != 1">保存</b-button>                
                <b-button size="sm" variant="warning" @click="preview" :disabled="emptyOrder" v-show="repairOrderInfo.isCancel != 1">预览报价</b-button>
                <b-button size="sm" variant="primary" @click="submitDispatch" :disabled="isPayed || emptyOrder" v-show="repairOrderInfo.orderStatus != 10 && repairOrderInfo.isCancel != 1">提交派工</b-button>
                <b-button size="sm" variant="primary" @click="completed" :disabled="isPayed || emptyOrder" v-show="repairOrderInfo.orderStatus != 10 && repairOrderInfo.isCancel != 1">竣工</b-button>
                <b-button size="sm" variant="success" @click="settlement" :disabled="isPayed || emptyOrder" v-show="repairOrderInfo.orderStatus == 9">结算</b-button>

                <!-- <b-button size="sm" variant="success" @click="saveOrder" :disabled="isPayed || emptyOrder">保存</b-button>                
                <b-button size="sm" variant="warning" @click="preview" :disabled="emptyOrder" >预览报价</b-button>
                <b-button size="sm" variant="primary" @click="submitDispatch" :disabled="isPayed || emptyOrder">提交派工</b-button>
                <b-button size="sm" variant="primary" @click="completed" :disabled="isPayed || emptyOrder">竣工</b-button>
                <b-button size="sm" variant="success" @click="settlement" :disabled="isPayed || emptyOrder" v-show="repairOrderInfo.orderStatus == 9">结算</b-button> -->
            </div>
        </div>
    </b-card>
    <!-- service-components -->
    <service-modal ref="serviceModal"
        :orderNo="repairOrderInfo.orderNo"
        :serviceCode="serviceCode"
        :storeCode="repairOrderInfo.storeCode"
        :serviceOrderNo="serviceOrderNo"
        :serviceOrderDetailCode="serviceOrderDetailCode"
        :skuOrderNo="skuOrderNo"
        :carInfo="carInfo"
        @sure="skuSure"
        @visibleChange="serviceVisibleChange">
    </service-modal>
    <service-remark-modal ref="serviceRemarkModal"
        :orderNo="repairOrderInfo.orderNo"
        :serviceItem="serviceItem"
        :carInfo="carInfo"
        @confirmClick="addServiceRemark">
    </service-remark-modal>
    <!-- sku-components -->
    <sku-modal ref="skuModal"
        :orderNo="repairOrderInfo.orderNo"
        :storeCode="repairOrderInfo.storeCode"
        :detailCode="skuOrderNo"
        :skuInfo="skuInfo"
        :skuItem="skuItem"
        :carInfo="carInfo"
        @sure="skuSure"
        @visibleChange="skuVisibleChange">
    </sku-modal>
    <remark-modal ref="remarkModal"
        :orderNo="repairOrderInfo.orderNo"
        :skuInfo="skuInfo"
        :skuItem="skuItem"
        :carInfo="carInfo"
        @confirmClick="confirmClick">
    </remark-modal>
    <construction-modal ref="constructionModal"
        v-if="constructionVisible"
        :orderNo="repairOrderInfo.orderNo"
        :skuInfo="skuInfo"
        :skuItem="skuItem"
        :carInfo="carInfo"
        :accountTypeList="accountTypeList"
        @skuAddService="skuAddService">
    </construction-modal>

    <card-modal ref="cardModal"  
        :isShowChoose="isShowChoose" 
        :orderNo="repairOrderInfo.orderNo"
        :serviceOrderNo="serviceOrderNo"
        :skuOrderNo="skuOrderNo"
        @use="skuSure"
        @visibleChange="cardVisibleChange"
        :acceptObj="{
            storeCode: repairOrderInfo.storeCode,
            customCode: repairOrderInfo.custCode,
            vehicleCode: repairOrderInfo.vehicleCode
        }">
    </card-modal>
    <!-- outside -->
    <entrust-edit-modal ref="outSideModal"
        :orderNo="repairOrderInfo.orderNo"
        :serviceCode="outSideServiceCode"
        :storeCode="repairOrderInfo.storeCode"
        :outsideOrderNo="outsideOrderNo"
        :outsideOrderDetailCode="outsideOrderDetailCode"
        :skuOrderNo="skuOrderNo"
        :serviceOrderNo="serviceOrderNo"
        :serviceOrderDetailCode="serviceOrderDetailCode"
        :carInfo="carInfo"
        @sure="skuSure"
        @visibleChange="outsideVisibleChange">
    </entrust-edit-modal>
    <service-remark-modal ref="outsideRemarkModal"
        :orderNo="repairOrderInfo.orderNo"
        :serviceItem="serviceItem"
        :carInfo="carInfo"
        @confirmClick="addOutsideRemark">
    </service-remark-modal>
</div>
</template>
<script>

import SelectSearch from 'components/iris-search2.0'
import Search from 'components/iris-search/search'
import CardModal from './card-modal'
import ServiceModal from 'views/work-order/serviceEditModal'
import ServiceRemarkModal from './service/service-remark-modal'
import SkuModal from 'views/work-order/skuModal'
import RemarkModal from './sku/remark-modal'
import ConstructionModal from './sku/construction-modal'
import AccountTypeSelect from 'components/account-type-select/account-type-select'
import EntrustEditModal from 'views/work-order/entrustEditModal'

import Vue from 'vue'
import { Table, TableColumn, MessageBox, DatePicker, Tooltip, Message } from 'element-ui'
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Tooltip)

import config from 'common/config'
import common from 'common/common'
import api from 'common/api'
import collectionApi from 'common/api-collection'
import { getType, alertSuccess, getSequence, formatMoney, dateDiff } from 'common/api-common'
import { ORDER_BUSINESS_TYPE, PRICE_TYPE, ACCOUNT_TYPE, SERVICE_SETTING } from 'common/ref-code'
import { SERVICE_ORDER_DETAIL_SEQ } from 'common/sequence'
import { mapActions, mapGetters } from 'vuex'

Date.prototype.format = function (format) {
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
        SelectSearch,
        Search,
        CardModal,
        ServiceModal,
        ServiceRemarkModal,
        SkuModal,
        RemarkModal,
        ConstructionModal,
        AccountTypeSelect,
        EntrustEditModal
    },
    data() {
        return {
            custVehicleInfo: {
                closingDate: '',
                storeName: '',
                actualTotalPrice: '',

                inMileage: '',
                nextMaintenanceMileage: '',
                commercialInsuranceCompanyName: '',
                compulsoryInsuranceCompanyName: '',
                commercialInsuranceEndDate: '',
                compulsoryInsuranceEndDate: '',
                birthday: '',
                email: '',
                idNo: '',
                nextMaintenanceDate: '',

                certificateProperty1: '',
                firstGetDate: '',
                expireDate: '',
                filePath: '',

                cardNums: 0,
                couponNums: 0
            },
            // 服务
            serviceList: [
                {serviceCode: '', serviceName: '', serviceDisplayName: ''}
            ],
            // 精品
            skuList: [
                {skuCode: '', skuName: '', skuDisplayName: '', remark: '备注'},
            ],
            // 托外
            outsideList: [
                {serviceCode: '', serviceName: '', serviceDisplayName: ''}
            ],
            // 服务名称编码查询
            codeDatalist: [],
            codeSelectParams: {
                pageNums: config.pageNums,
                pageStart: 1
            },
            codeIsLastPage: false,
            // sku名称编码查询
            skuCodeList: [],
            skuCodeParams: {
                pageNums: config.pageNums,
                pageStart: 1
            },
            skuCodeIsLastPage: false,

            repairOrderInfo: {
                orderNo: '',
                custName: '',
                serviceOrderInfoList: [{serviceOrderNo: ''}],
                skuOrderTotalInfoVoList: [{skuOrderNo: ''}],
                outsideOrderInfoList: [{outsideOrderNo: ''}],                
            },
            tempOrderInfo: {},
            // skuModal 参数
            skuInfo: {},
            carInfo: {},
            // skuOrderNo: '',

            cardParams: {},
            // serviceOrderNo: '',
            serviceOrderDetailCode: '',
            serviceCode: '',
            businessType: [],
            businessTypeList: [],
            skuItem: {},
            accountTypeList: [],
            isShowChoose: true,

            constructionVisible: false,
            serviceItem: {},
            serviceIndex: -1,

            outSideServiceCodeList: [],

            outSideServiceNameList: [],
            // outsideOrderNo: '',
            outsideOrderDetailCode: '',
            outSideServiceCode: '',

            inStoreFlagList: [
                {text: '普通', value: '0'},
                {text: '紧急', value: '1'},
                {text: '预约', value: '2'},
                {text: '返工', value: '3'},                
            ],
            outsideIndex: -1,

            reloadSku: true,
            reloadService: true,
            reloadOutside: true,

            visibleFlag: true,

            serviceExpands: [],
            outsideExpands: []
        }
    },
    mounted() {
        this.getPriceType(PRICE_TYPE)
        this.getOpenService(SERVICE_SETTING)

        getType(ORDER_BUSINESS_TYPE, items => {
            this.businessType = []
            this.businessTypeList = []
            items.forEach(item => {
                let data = {
                    text: item.refDetailName,
                    value: item.refDetailCode
                }
                if(item.refDetailCode != 'CarWash') {
                    this.businessTypeList.push(data)
                }
                this.businessType.push(data)
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

                let orderNo = this.$route.query.orderNo
                // OR201806191021346, OR201806132002798,  OR201806212003427, OR201806222003533
                this.queryAllOrderInfo(orderNo, () => {
                    let params = {
                        plateNumber: this.repairOrderInfo.custPlates
                    }
                    this.queryByPhone(params)
                    this.getOrderInfoByCondition()
                    this.getDriverInfoByCustom()
                    this.getDriverImage()
                    this.getCardNums()
                    this.getCouponNums()
                    // 获取门店工时单价
                    this.getStoreInfo({
                        storeCode: this.repairOrderInfo.storeCode
                    })
                    this.getWhListByStoreCode({
                        storeCode: this.repairOrderInfo.storeCode                        
                    })
                })
            })
        })
        // this.columnMerger()
    },
    computed: {
        repairNums() {
            return this.serviceList.length + this.skuList.length + this.outsideList.length -3
        },
        serviceOrderNo() {
            return this.repairOrderInfo.serviceOrderInfoList[0].serviceOrderNo
        },
        skuOrderNo() {
            return this.repairOrderInfo.skuOrderTotalInfoVoList[0].skuOrderNo
        },
        outsideOrderNo() {
            return this.repairOrderInfo.outsideOrderInfoList[0].outsideOrderNo
        },
        // 已结算状态, 工单不可编辑 整单作废
        isPayed() {
            return this.repairOrderInfo.orderStatus == 10 || this.repairOrderInfo.isCancel == 1
        },
        emptyOrder() {
            if(this.serviceList.length == 1 
                && this.skuList.length == 1 
                && this.outsideList.length == 1) {
                return true
            }else {
                return false
            }
        },
        days() {
            if(!this.custVehicleInfo.nextMaintenanceDate) {
                return 0
            }else {
                let st = new Date().format('yyyy-MM-dd'),
                    et = new Date(this.custVehicleInfo.nextMaintenanceDate).format('yyyy-MM-dd')
                    // et = new Date('2018-08-19 08:45:56').format('yyyy-MM-dd') test
                return dateDiff(st, et)
            }
        },
        ...mapGetters('workOrder', [
            'priceTypes',
            'openServiceInfo'
        ])
    },
    methods: {
        getServiceRowKeys(row) {
            return row.id
        },
        serviceToggleRowExpansion(row) {
            if(row) {
                this.serviceExpands = []
                this.serviceExpands.push(row.id)
            }
        },
        getOutsideRowKeys(row) {
            return row.id
        },
        outsideToggleRowExpansion(row) {
            if(row) {
                this.outsideExpands = []
                this.outsideExpands.push(row.id)
            }
        },
        cardVisibleChange(visible) {
            if(this.visibleFlag) {
                this.reloadService = !visible
                this.reloadSku = !visible
                this.reloadOutside = !visible
                if(!visible) {
                    this.columnMerger()
                    this.setAccountTypeValue(this.serviceList)
                    this.setAccountTypeValue(this.skuList)
                    this.setAccountTypeValue(this.outsideList)
                }
            }
        },
        serviceVisibleChange(visible) {
            if(this.visibleFlag) {
                this.reloadService = !visible
                if(!visible) {
                    this.columnMerger()
                    this.setAccountTypeValue(this.serviceList)
                }
            }
        },
        skuVisibleChange(visible) {
            if(this.visibleFlag) {
                this.reloadSku = !visible
                if(!visible) {
                    this.columnMerger()
                    this.setAccountTypeValue(this.skuList)
                }
            }
        },
        outsideVisibleChange(visible) {
            if(this.visibleFlag) {
                this.reloadOutside = !visible
                if(!visible) {
                    this.columnMerger()
                    this.setAccountTypeValue(this.outsideList)
                }
            }
        },
        columnMerger() {
            // this.reloadSku = true
            // this.reloadService = true
            // this.reloadOutside = true
            this.$nextTick(() => {
                let serviceLastTrList = this.$refs.serviceTable.$el.children[2].children[0].children[1].children
                for(let i = 0; i < serviceLastTrList.length; i ++) {
                    if(i == serviceLastTrList.length - 1) {
                        serviceLastTrList[i].children[1].colSpan = 2
                        serviceLastTrList[i].children[2].remove(0)                     
                    }else {
                        serviceLastTrList[i].children[1].colSpan = 1
                    }
                }

                let skuLastTrList = this.$refs.skuTable.$el.children[2].children[0].children[1].children
                for(let j = 0; j < skuLastTrList.length; j ++) {
                    if(j == skuLastTrList.length - 1) {
                        skuLastTrList[j].children[0].colSpan = 2
                        skuLastTrList[j].children[1].remove(0)                     
                    }else if(j == skuLastTrList.length - 2) {
                        skuLastTrList[j].children[0].colSpan = 1
                    }
                }
                
                let outsideLastTrList = this.$refs.outsideTable.$el.children[2].children[0].children[1].children
                 for(let k = 0; k < outsideLastTrList.length; k ++) {
                    if(k == outsideLastTrList.length - 1) {
                        outsideLastTrList[k].children[1].colSpan = 2
                        outsideLastTrList[k].children[2].remove(0)                     
                    }else {
                        outsideLastTrList[k].children[1].colSpan = 1
                    }
                }
            })
        },
        setAccountTypeValue(list) {
            list.forEach((item, i) => {
                let info = {
                    accountTypeCode: item.accountTypeCode,
                    reconciliationTargetCode: item.reconciliationTargetCode,
                    reconciliationTargetName: item.reconciliationTargetName
                }
                this.$nextTick(() => {
                    if(list == this.serviceList) {
                        this.$refs[`serviceAccountType${i}`].setValue(info)
                    }else if(list == this.skuList) {
                        this.$refs[`accountType${i}`].setValue(info)
                    }else if(list == this.outsideList) {
                        this.$refs[`outsideAccountType${i}`].setValue(info)
                    }
                })
            })
        },
        findServiceIndex(serviceOrderDetailCode) {
            let i = 0
            this.serviceList.forEach((item, index) => {
                if(item.serviceOrderDetailCode == serviceOrderDetailCode) {
                    i = index
                }
            })
            return i
        },
        serviceDiscountRateChange(scope) {
            let i = scope.$index
            if(scope.row.discountRate < 0 || scope.row.discountRate > 100) {
                this.serviceList[i].discountRate = 100    
            }
            if(this.serviceList[i].priceType == 1) {
                this.serviceList[i].discountMoney = (this.serviceList[i].salesPrice * (100 - this.serviceList[i].discountRate) / 100).toFixed(2)
            }else {
                this.serviceList[i].discountMoney = ((this.serviceList[i].actualWorkHours - 0) * (this.serviceList[i].actualWorkHourPrice - 0) * (100 - (this.serviceList[i].discountRate - 0)) / 100 + (this.serviceList[i].skuTotalDiscountMoney - 0)).toFixed(2)
            }
            
            // 折扣金额 = 标准工时 * 工时单价 * ((100 - 人工费折扣) / 100) + 配件折扣金额总和
            // this.serviceList[i].discountMoney = (this.serviceList[i].actualWorkHours * this.serviceList[i].actualWorkHourPrice * (100 - (this.serviceList[i].discountRate - 0)) / 100 + this.serviceList[i].skuTotalDiscountMoney)
        },
        serviceRateBlur(i) {
            let empDiscountMoney = (this.serviceList[i].actualWorkHours - 0) * (this.serviceList[i].actualWorkHourPrice - 0) * (100 - (this.serviceList[i].discountRate - 0)) / 100
            if(empDiscountMoney - this.serviceList[i].maxDisCountPrice > 0) {
                Message({
                    type: 'warning',
                    message: '折扣金额不能大于最大折扣金额'
                })
                let tempSerList = this.tempOrderInfo.serviceOrderInfoList[0].serviceOrderDetailInfoList
                this.serviceList[i].discountRate = (100 - tempSerList[i].discountRate * 100).toFixed(2) // 100
                this.serviceList[i].discountMoney = ((this.serviceList[i].actualWorkHours - 0) * (this.serviceList[i].actualWorkHourPrice - 0) * (100 - (this.serviceList[i].discountRate - 0)) / 100 + (this.serviceList[i].skuTotalDiscountMoney - 0)).toFixed(2)    
                return                           
            }
            this.updateService(i)
        },
        serviceSkuDiscountRateChange(scope) {
            let j = scope.$index
            let i = this.findServiceIndex(scope.row.serviceOrderDetailCode)
            if(scope.row.discountRate < 0 || scope.row.discountRate > 100) {
                this.serviceList[i].skuOrderDetailInfoList[j].discountRate = 100    
            }
        },
        serviceSkuRateBlur(i, subScope) {
            let j = subScope.$index
            if(this.serviceList[i].skuOrderDetailInfoList[j].discountMoney - this.serviceList[i].skuOrderDetailInfoList[j].maxDisCountPrice > 0) {
                Message({
                    type: 'warning',
                    message: '折扣金额不能大于最大折扣金额'
                })
                let tempSerList = this.tempOrderInfo.serviceOrderInfoList[0].serviceOrderDetailInfoList
                this.serviceList[i].skuOrderDetailInfoList[j].discountRate =  (100 - tempSerList[i].skuOrderDetailInfoList[j].discountRate * 100).toFixed(2)// 100  
                // 折扣金额 = (100 - 商品折扣(%)) * 销售售价
                this.serviceList[i].skuOrderDetailInfoList[j].discountMoney = ((100 - (this.serviceList[i].skuOrderDetailInfoList[j].discountRate - 0)) * this.serviceList[i].skuOrderDetailInfoList[j].salesPrice / 100)              
                return
            }
            this.updateService(i)
        },
        skuDiscountRateChange(scope) {
            let i = scope.$index
            if(scope.row.discountRate < 0 || scope.row.discountRate > 100) {
                this.skuList[i].discountRate = 100    
            }
            // 折扣金额 = (100 - 商品折扣(%)) * 销售售价
            this.skuList[i].discountMoney = ((100 - (this.skuList[i].discountRate - 0)) * this.skuList[i].salesPrice / 100).toFixed(2)
        },
        skuRateBlur(i) {
            if(this.skuList[i].discountMoney - this.skuList[i].maxDisCountPrice > 0) {
                Message({
                    type: 'warning',
                    message: '折扣金额不能大于最大折扣金额'
                })
                let tempSkuList = this.tempOrderInfo.skuOrderTotalInfoVoList[0].skuOrderDetailInfoVos
                this.skuList[i].discountRate = (100 - tempSkuList[i].discountRate * 100).toFixed(2)// 100 
                this.skuList[i].discountMoney = tempSkuList[i].discountMoney // ((100 - (this.skuList[i].discountRate - 0)) * this.skuList[i].salesPrice / 100).toFixed(2)               
                return
            }
            this.updateSku()
        },
        skuDiscountMoneyChange(scope) {
            let i = scope.$index
            // 商品折扣(%) = (销售售价 - 折扣金额) / 销售售价 * 100
            let salesPrice = this.skuList[i].salesPrice - 0
            this.skuList[i].discountRate = ((salesPrice  - (this.skuList[i].discountMoney - 0) ) / salesPrice * 100).toFixed(2)
            if(this.skuList[i].discountMoney < 0) {
                this.skuList[i].discountMoney = 0
            }
        },
        skuMoneyBlur(i) {
            if(this.skuList[i].discountMoney - this.skuList[i].maxDisCountPrice > 0) {
                Message({
                    type: 'warning',
                    message: '折扣金额不能大于最大折扣金额'
                })
                let tempSkuList = this.tempOrderInfo.skuOrderTotalInfoVoList[0].skuOrderDetailInfoVos
                
                this.skuList[i].discountMoney = (100 - tempSkuList[i].discountRate * 100).toFixed(2)// 0  
                this.skuList[i].discountRate = tempSkuList[i].discountMoney// 100// ((salesPrice  - (this.skuList[i].discountMoney - 0) ) / salesPrice * 100).toFixed(2)                              
                return
            }
            this.updateSku()
        },
        showUseCardModel() {
            this.isShowChoose = true
            this.visibleFlag = true
            this.$refs.cardModal.modalShow()
        },
        showCardModal() {
            this.isShowChoose = false
            this.$refs.cardModal.modalShow()
        },
        // 服务下拉搜索
        querySerInfo(params, callback) {
            api.repairOrder.queryServiceInfoCodeOrName(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            });
        },
        codeClearValue() {
            this.serviceList[this.serviceList.length - 1].serviceDisplayName = ''

            this.$refs.search.setValue()
        },
        codeFirstLoad() {
            if(this.codeSelectParams.serviceCodeOrName) {
                delete this.codeSelectParams.serviceCodeOrName;
            }else if(this.codeDatalist.length !== 0) {
                //return;
            }
            let params = this.codeSelectParams;
            this.querySerInfo(params, obj => {
                this.codeDatalist = obj.list;
                this.codeDatalist.unshift({
                    serviceCode: this.openServiceInfo.refDetailValue,
                    serviceName: this.openServiceInfo.refDetailName
                })
            });
        },
        codeQuerySelect(data) {
            this.codeSelectParams.pageStart = 1;
            this.codeSelectParams.serviceCodeOrName = data;
            let params = this.codeSelectParams;
            this.querySerInfo(params, obj => {
                this.codeIsLastPage = obj.isLastPage;
                this.codeDatalist = obj.list;
                if(!params.serviceCode) {
                    this.codeDatalist.unshift({
                        serviceCode: this.openServiceInfo.refDetailValue,
                        serviceName: this.openServiceInfo.refDetailName
                    })
                }
            });
        },
        codeItemClick(item) {
            if(this.repairOrderInfo) {
                this.serviceOrderDetailCode = ''
            }
            this.serviceItem = {}
            this.serviceCode = item.serviceCode
            this.serviceList[this.serviceList.length - 1].serviceDisplayName = item.serviceName
            // this.$refs.search.setValue(item.serviceName)
            this.$refs.serviceModal.showModel()
            this.visibleFlag = true
        },
        codeScrollBottom(isEnd) {
            if (isEnd && !this.isLastPage) {
                this.codeSelectParams.pageStart ++
                let params = this.codeSelectParams;
                this.querySerInfo(params, obj => {
                    this.codeIsLastPage = obj.isLastPage;
                    this.codeDatalist = this.codeDatalist.concat(obj.list);
                })
            }
        },
        // sku下拉搜索
        querySkuInfo(params, callback) {
            params.onOffFlag = 1
            params.skuType = 'goodsTypeGood'
            api.skuData.getInfo(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            });
        },
        skuCodeClearValue() {
            this.skuList[this.skuList.length - 1].skuDisplayName = ''
            this.$refs.skuName.setValue()
        },
        skuCodeFirstLoad() {
            if(this.skuCodeParams.skuCodeOrName) {
                delete this.skuCodeParams.skuCodeOrName;
            }else if(this.skuCodeList.length !== 0) {
                return;
            }
            let params = this.skuCodeParams;
            this.querySkuInfo(params, obj => {
                this.skuCodeList = obj.list;
            });
        },
        skuCodeQuery(data) {
            this.skuCodeParams.pageStart = 1;
            this.skuCodeParams.skuCodeOrName = data;
            let params = this.skuCodeParams;
            this.querySkuInfo(params, obj => {
                this.skuCodeIsLastPage = obj.isLastPage;
                this.skuCodeList = obj.list;
            });
        },
        skuCodeItemClick(item) {
            this.skuList[this.skuList.length - 1].skuDisplayName = item.skuName
            // this.$refs.skuName.setValue(item.skuName)
            this.skuItem = {}
            this.querySkuInfoByCode(item.skuCode, () => {
                this.$refs.skuModal.showModel() 
                this.visibleFlag = true
            })
        },
        skuCodeScrollBottom(isEnd) {
            if (isEnd && !this.skuCodeIsLastPage) {
                this.skuCodeParams.pageStart ++
                let params = this.skuCodeParams;
                this.querySkuInfo(params, obj => {
                    this.skuCodeIsLastPage = obj.isLastPage;
                    this.skuCodeList = this.skuCodeList.concat(obj.list);
                });
            }
        },
        watchSku(scope) {
            if(scope.row.isDeleted == '0' && !this.isPayed) {
                this.skuItem = scope.row
                this.querySkuInfoByCode(scope.row.skuCode, () => {
                    this.$refs.skuModal.showModel()
                })
            }
        },
        watchService(scope) {
            if(scope.row.isDeleted == '0' && !this.isPayed && !scope.row.dispatchDetailStatus) {
                this.serviceCode = scope.row.serviceCode
                this.serviceOrderDetailCode = scope.row.serviceOrderDetailCode                            
                this.$refs.serviceModal.showModel()
            }
        },
        watchOutSide(scope) {
            if(scope.row.isDeleted == '0' && !this.isPayed) {
                this.outSideServiceCode = scope.row.serviceCode
                this.outsideOrderDetailCode = scope.row.outsideOrderDetailCode   
                this.serviceOrderDetailCode = scope.row.serviceOrderDetailCode               
                this.$refs.outSideModal.showModel()
            }
        },
        showConstructionModal(scope) {
            if(scope.row.isDeleted == '0' && !this.isPayed) {
                this.constructionVisible = true
                this.skuItem = scope.row
                this.querySkuInfoByCode(scope.row.skuCode, () => {
                    this.$refs.constructionModal.show()
                })
            }
        },
        showRemarkModal(scope) {
            if(scope.row.isDeleted == '0' && !this.isPayed) {
                this.skuItem = scope.row
                this.querySkuInfoByCode(scope.row.skuCode, () => {
                    this.$refs.remarkModal.show()
                })
            }
        },

        getSkuAccountType(item, i) {
            if(item.accountTypeCode != 'normalSale') {
                this.skuList[i].discountRate = 100
                this.skuList[i].discountMoney = 0                
            }
            if(item.accountTypeCode != this.tempOrderInfo.skuOrderTotalInfoVoList[0].skuOrderDetailInfoVos[i].accountTypeCode) {
                this.skuList[i].accountTypeCode = item.accountTypeCode
                this.skuList[i].reconciliationTargetCode = item.reconciliationTargetCode
                this.skuList[i].reconciliationTargetName = item.reconciliationTargetName
                this.updateSku()
            }
        },
        skuToVoid(scope) {
            this.confirmAlert('是否确认作废', true, () => {
                let params = { 
                    orderSkuDetailInfos: [{
                        orderNo: this.repairOrderInfo.orderNo,
                        skuGroupCode: scope.row.skuGroupCode
                    }]
                }
                api.repairOrder.toVoidOrderInfo(params, res => {
                    alertSuccess(res, () => {
                        this.queryAllOrderInfo()
                    })
                })
            })
        },

        querySkuInfoByCode(skuCode, next) {
            let params = {skuCode: skuCode}
            api.skuInfo.querySkuInfo(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj
                    this.skuInfo = obj
                    next()
                }
            })
        },
        skuSure() {
            this.visibleFlag = false
            this.queryAllOrderInfo(this.repairOrderInfo.orderNo)
        },

        // 服务编辑
        readonlyWorkHours(scope) {
            if(scope.row.isDeleted == '1' || !scope.row.skuOrderDetailInfoList) {
                return true
            }
            if(scope.row.priceType == 3 && scope.row.skuOrderDetailInfoList[0].skuTempCode) {
                return false
            }else {
                return true
            }
        },
        expandChange(row, expanded) {
            if(!expanded) {
                return
            }
            this.serviceList.forEach((item, i) => {
                if(item.serviceOrderDetailCode == row.serviceOrderDetailCode && item.skuOrderDetailInfoList) {
                    this.$nextTick(() => {
                        item.skuOrderDetailInfoList.forEach((skuItem, j) => {
                            let subInfo = {
                                accountTypeCode: skuItem.accountTypeCode,
                                reconciliationTargetCode: skuItem.reconciliationTargetCode,
                                reconciliationTargetName: skuItem.reconciliationTargetName
                            }
                            this.$refs[`serviceSkuAccountType${i}${j}`].setValue(subInfo)
                        }) 
                    })
                }
            })
        },
        getServiceAccountType(item, i) {
            if(item.accountTypeCode != 'normalSale') {
                this.serviceList[i].discountRate = 100
                this.serviceList[i].discountMoney = 0                
            }
            if(item.accountTypeCode != this.serviceList[i].accountTypeCode) {
                this.serviceList[i].accountTypeCode = item.accountTypeCode
                this.serviceList[i].reconciliationTargetCode = item.reconciliationTargetCode
                this.serviceList[i].reconciliationTargetName = item.reconciliationTargetName
                if(this.serviceList[i].skuOrderDetailInfoList) {
                    for(let j = 0; j < this.serviceList[i].skuOrderDetailInfoList.length; j ++) {
                        this.serviceList[i].skuOrderDetailInfoList[j].accountTypeCode = item.accountTypeCode
                        this.serviceList[i].skuOrderDetailInfoList[j].reconciliationTargetCode = item.reconciliationTargetCode
                        this.serviceList[i].skuOrderDetailInfoList[j].reconciliationTargetName = item.reconciliationTargetName 
                        this.$nextTick(() => {
                            if(this.$refs[`serviceSkuAccountType${i}${j}`]) {
                                this.$refs[`serviceSkuAccountType${i}${j}`].setValue(item)
                            }
                        })  
                        this.serviceList[i].skuOrderDetailInfoList[j].discountRate = 100
                        this.serviceList[i].skuOrderDetailInfoList[j].discountMoney = 0                   
                    }
                }
                this.updateService(i)
            }
        },
        getServiceSkuAccountType(item, i, j) {
            if(item.accountTypeCode != 'normalSale') {
                this.serviceList[j].skuOrderDetailInfoList[i].discountRate = 100
                this.serviceList[j].skuOrderDetailInfoList[i].discountMoney = 0                
            }
            if(item.accountTypeCode != this.serviceList[j].skuOrderDetailInfoList[i].accountTypeCode) {
                this.serviceList[j].skuOrderDetailInfoList[i].accountTypeCode = item.accountTypeCode
                this.serviceList[j].skuOrderDetailInfoList[i].reconciliationTargetCode = item.reconciliationTargetCode
                this.serviceList[j].skuOrderDetailInfoList[i].reconciliationTargetName = item.reconciliationTargetName
                this.updateService(i)
            }
        },
        showServiceRemarkModal(scope) {
            this.serviceItem = scope.row
            this.serviceIndex = scope.$index
            this.$refs.serviceRemarkModal.show()
        },
        addServiceRemark(remark) {
            this.updateService(this.serviceIndex, remark)
        },
        updateService(i, remark = '') {
            let tempExpandList = JSON.parse(JSON.stringify(this.serviceExpands))
            if(i == this.serviceList.length - 1) {
                return
            }
            let item = this.serviceList[i]
            let params = {
                orderServiceDetailInfos: [{
                    orderNo: item.orderNo,
                    serviceOrderNo: item.serviceOrderNo,
                    serviceOrderDetailCode: item.serviceOrderDetailCode,
                    serviceCode: item.serviceCode,
                    serviceName: item.serviceName,                    
                    id: item.id,
                    serviceDisplayName: item.serviceDisplayName,
                    discountMoney: item.discountMoney,
                    discountRate: (100 - item.discountRate) / 100, // 1 - item.discountRate / 100,
                    accountTypeCode: item.accountTypeCode,
                    reconciliationTargetCode: item.reconciliationTargetCode,
                    reconciliationTargetName: item.reconciliationTargetName,
                    remark: remark || item.remark
                }],
                orderServiceDetailSkuInfos: []
            }
            if(item.priceType == 3) {
                params.orderServiceDetailInfos[0].actualWorkHours = item.actualWorkHours
                params.orderServiceDetailInfos[0].actualWorkHourPrice = item.actualWorkHourPrice
                params.orderServiceDetailInfos[0].costTime = item.costTime
                params.orderServiceDetailInfos[0].priceType = item.priceType                
            }
            if(item.skuOrderDetailInfoList) {
                item.skuOrderDetailInfoList.forEach(item => {
                    if(item.isDeleted == '0') {
                        let info = {
                            orderNo: item.orderNo,
                            skuGroupCode: item.skuGroupCode,
                            storeCode: this.repairOrderInfo.storeCode,
                            whCode: item.whCode,
                            nums: item.nums,
                            originalSalesPrice: item.originalSalesPrice,
                            actualSalesPrice: item.actualSalesPrice,
                            accountTypeCode: item.accountTypeCode,
                            reconciliationTargetCode: item.reconciliationTargetCode,
                            reconciliationTargetName: item.reconciliationTargetName,
                            serviceOrderNo: item.serviceOrderNo,
                            serviceOrderDetailCode: item.serviceOrderDetailCode,
                            skuOrderNo: item.skuOrderNo,
                            skuCode: item.skuCode,
                            skuDisplayName: item.skuDisplayName,
                            skuTempCode: item.skuTempCode,
                            discountMoney: item.discountMoney,
                            discountRate: (100 - item.discountRate) / 100 // 1 - item.discountRate / 100,
                        }
                        params.orderServiceDetailSkuInfos.push(info)
                    }
                })
            }
            api.repairOrder.insertOrUpdateOrderInfo(params, res => {
                if(res.data.code === 'success') {
                    this.queryAllOrderInfo(this.repairOrderInfo.orderNo, () => {
                        this.serviceExpands = tempExpandList
                    })
                }
            })
        },
        serviceToVoid(scope) {
            this.confirmAlert('是否确认作废', true, () => {
                let params = { 
                    orderServiceDetailInfos: [{
                        orderNo: this.repairOrderInfo.orderNo,
                        serviceOrderDetailCode: scope.row.serviceOrderDetailCode
                    }]
                }
                api.repairOrder.toVoidOrderInfo(params, res => {
                    alertSuccess(res, () => {
                        this.queryAllOrderInfo()
                    })
                })
            })
        },

        // 托外
        outSideCodeFirstLoad() {
            this.outSideServiceCodeList = [{
                serviceCode: this.openServiceInfo.refDetailValue,
                serviceName: this.openServiceInfo.refDetailName
            }]
        },
        outSideCodeItemClick(item) {
            this.outsideOrderDetailCode = ''
            this.serviceOrderDetailCode = ''            
            this.outSideServiceCode = item.serviceCode  
            this.outsideList[this.outsideList.length - 1].serviceDisplayName = item.serviceName
            // this.$refs.outSideName.setValue(item.serviceName)
            this.$refs.outSideModal.showModel()
            this.visibleFlag = true
        },
        
        showOutsideRemarkModal(scope) {
            this.serviceItem = scope.row
            this.outsideIndex = scope.$index
            this.$refs.outsideRemarkModal.show()
        },
        addOutsideRemark(remark) {
            this.updateOutside(this.outsideIndex, remark)
        },
        updateOutside(i, remark = '', flag = false) {
            let item = this.outsideList[i]
            let tempExpandList = JSON.parse(JSON.stringify(this.outsideExpands))
            // console.log(item)
            let params = {
                orderOutsideDetailInfos: [{
                    id: item.id,
                    orderNo: this.repairOrderInfo.orderNo,
                    outsideOrderNo: this.outsideOrderNo,
                    outsideOrderDetailCode: item.outsideOrderDetailCode,
                    serviceOrderDetailCode: item.serviceOrderDetailCode
                }],
                orderServiceDetailInfos: [{
                    orderNo: item.orderNo,
                    serviceOrderNo: item.serviceOrderNo,
                    serviceOrderDetailCode: item.serviceOrderDetailCode,
                    serviceCode: item.serviceCode,
                    serviceName: item.serviceName,                    
                    id: item.serviceId,
                    serviceDisplayName: item.serviceDisplayName,
                    discountMoney: item.discountMoney,
                    // discountRate: flag ? 0 : 1 - item.discountRate / 100,
                    discountRate: item.discountRate,
                    accountTypeCode: item.accountTypeCode,
                    reconciliationTargetCode: item.reconciliationTargetCode,
                    reconciliationTargetName: item.reconciliationTargetName,
                    remark: remark || item.remark,
                    detailStatus: flag ? 10 : item.detailStatus,
                    isDispatch: item.isDispatch
                }],
                orderServiceDetailSkuInfos: []
            }
            if(!flag) {
                delete params.orderServiceDetailInfos[0].detailStatus
            }
            if(item.priceType == 3) {
                params.orderServiceDetailInfos[0].actualWorkHours = item.actualWorkHours
                params.orderServiceDetailInfos[0].actualWorkHourPrice = item.actualWorkHourPrice
                params.orderServiceDetailInfos[0].costTime = item.costTime
                params.orderServiceDetailInfos[0].priceType = item.priceType                
            }
            if(item.skuOrderDetailInfoList) {
                item.skuOrderDetailInfoList.forEach(item => {
                    if(item.isDeleted == '0') {
                        let info = {
                            orderNo: item.orderNo,
                            skuGroupCode: item.skuGroupCode,
                            storeCode: this.repairOrderInfo.storeCode,
                            whCode: item.whCode,
                            nums: item.nums,
                            originalSalesPrice: item.originalSalesPrice,
                            actualSalesPrice: item.actualSalesPrice,
                            accountTypeCode: item.accountTypeCode,
                            reconciliationTargetCode: item.reconciliationTargetCode,
                            reconciliationTargetName: item.reconciliationTargetName,
                            serviceOrderNo: item.serviceOrderNo,
                            serviceOrderDetailCode: item.serviceOrderDetailCode,
                            skuOrderNo: item.skuOrderNo,
                            skuCode: item.skuCode,
                            skuDisplayName: item.skuDisplayName,
                            skuTempCode: item.skuTempCode
                        }
                        params.orderServiceDetailSkuInfos.push(info)
                    }
                })
            }
            api.repairOrder.insertOrUpdateOrderInfo(params, res => {
                if(res.data.code === 'success') {
                    this.queryAllOrderInfo(this.repairOrderInfo.orderNo, () => {
                        debugger
                        this.outsideExpands = tempExpandList 
                    })
                }
            })
        },
        getOutsideAccountType(item, i) {
            if(item.accountTypeCode != 'normalSale') {
                this.outsideList[i].discountRate = 0
                this.outsideList[i].discountMoney = 0                
            }
            if(item.accountTypeCode != this.tempOrderInfo.outsideOrderInfoList[0].outsideOrderDetailInfoList[i].serviceOrderDetailInfoList[0].accountTypeCode) {
                this.outsideList[i].accountTypeCode = item.accountTypeCode
                this.outsideList[i].reconciliationTargetCode = item.reconciliationTargetCode
                this.outsideList[i].reconciliationTargetName = item.reconciliationTargetName
                if(this.outsideList[i].skuOrderDetailInfoList) {
                    for(let j = 0; j < this.outsideList[i].skuOrderDetailInfoList.length; j ++) {
                        this.outsideList[i].skuOrderDetailInfoList[j].accountTypeCode = item.accountTypeCode
                        this.outsideList[i].skuOrderDetailInfoList[j].reconciliationTargetCode = item.reconciliationTargetCode
                        this.outsideList[i].skuOrderDetailInfoList[j].reconciliationTargetName = item.reconciliationTargetName 
                        this.$nextTick(() => {
                            if(this.$refs[`outsideSkuAccountType${i}${j}`]) {
                                this.$refs[`outsideSkuAccountType${i}${j}`].setValue(item)
                            }
                        })                   
                    }
                }
                this.updateOutside(i)
            }
        },
        getOutsideSkuAccountType(item, i, j) {
            if(item.accountTypeCode != 'normalSale') {
                this.outsideList[j].skuOrderDetailInfoList[i].discountRate = 100
                this.outsideList[j].skuOrderDetailInfoList[i].discountMoney = 0                
            }
            if(item.accountTypeCode != this.tempOrderInfo.outsideOrderInfoList[0].outsideOrderDetailInfoList[j].serviceOrderDetailInfoList[0].skuOrderDetailInfoList[i].accountTypeCode) {
                this.outsideList[j].skuOrderDetailInfoList[i].accountTypeCode = item.accountTypeCode
                this.outsideList[j].skuOrderDetailInfoList[i].reconciliationTargetCode = item.reconciliationTargetCode
                this.outsideList[j].skuOrderDetailInfoList[i].reconciliationTargetName = item.reconciliationTargetName
                this.updateOutside(i)
            }
        }, 
        outsideExpandChange(row, expanded) {
            if(!expanded) {
                return
            }
            this.outsideList.forEach((item, i) => {
                if(item.serviceOrderDetailCode == row.serviceOrderDetailCode && item.skuOrderDetailInfoList) {
                    this.$nextTick(() => {
                        item.skuOrderDetailInfoList.forEach((skuItem, j) => {
                            let subInfo = {
                                accountTypeCode: skuItem.accountTypeCode,
                                reconciliationTargetCode: skuItem.reconciliationTargetCode,
                                reconciliationTargetName: skuItem.reconciliationTargetName
                            }
                            this.$refs[`outsideSkuAccountType${i}${j}`].setValue(subInfo)
                        }) 
                    })
                }
            })
        },
        outsideToVoid(scope) {
            this.confirmAlert('是否确认作废', true, () => {
                let params = { 
                    orderOutsideDetailInfos: [{
                        orderNo: this.repairOrderInfo.orderNo,
                        outsideOrderDetailCode: scope.row.outsideOrderDetailCode
                    }]
                }
                api.repairOrder.toVoidOrderInfo(params, res => {
                    alertSuccess(res, () => {
                        this.queryAllOrderInfo()
                    })
                })
            })
        },
        // 不需要进工时看板, 可以竣工
        rowCompleted(scope) {
            this.updateOutside(scope.$index, scope.row.remark, true)
        },
        
        // 查询订单信息
        queryAllOrderInfo(orderNo = this.repairOrderInfo.orderNo, next = () => {}) {
            let params = { orderNo: orderNo }
            api.repairOrder.queryAllOrderInfo(params, res => {
                if(res.data.code === 'success') {
                    let obj = res.data.obj
                    this.repairOrderInfo = obj
                    this.tempOrderInfo = JSON.parse(JSON.stringify(obj))
                    next()
                    this.carInfo.plateNumber = obj.custPlates
                    this.carInfo.displayName = obj.carDisplayName
                    for(let key in this.repairOrderInfo) {
                        this.carInfo[key] = this.repairOrderInfo[key]
                    }
                    // this.visibleFlag = false
                    this.reloadService = true
                    this.reloadSku = true
                    this.reloadOutside = true
                    // service
                    let serviceList = obj.serviceOrderInfoList[0].serviceOrderDetailInfoList
                    this.serviceList = []
                    if(serviceList) {
                        serviceList.forEach(item => {
                            item.totalSkuNums = 0
                            item.totalSkuMoney = 0
                            item.discountRate = item.accountTypeCode == 'CountingCard' ? '' : ((1 - item.discountRate) * 100).toFixed(2)
                            item.discountMoney = item.accountTypeCode == 'CountingCard' ? '' : item.discountMoney.toFixed(2)
                            item.salesPrice = item.originalSalesPrice
                            if(item.needSku == 1 && !item.skuOrderDetailInfoList) {
                                item.detailStatus = -1
                            }
                            if(item.skuOrderDetailInfoList) {
                                item.skuOrderDetailInfoList.forEach(skuItem => {
                                    item.totalSkuNums += skuItem.nums
                                    item.totalSkuMoney += skuItem.originalSalesPrice * skuItem.nums
                                    skuItem.discountRate = skuItem.accountTypeCode == 'CountingCard' ? '' : ((1 - skuItem.discountRate) * 100).toFixed(2)
                                    skuItem.discountMoney = skuItem.accountTypeCode == 'CountingCard' ? '' : skuItem.discountMoney.toFixed(2)
                                    if(skuItem.detailStatus == 0 && skuItem.isDeleted == '0') {
                                        item.detailStatus = -1
                                    }
                                    skuItem.salesPrice = skuItem.nums * skuItem.originalSalesPrice
                                }) 
                            }
                            this.serviceList.push(item)
                        })
                    }
                    this.serviceList.forEach((item, i) => {
                        let info = {
                            accountTypeCode: item.accountTypeCode,
                            reconciliationTargetCode: item.reconciliationTargetCode,
                            reconciliationTargetName: item.reconciliationTargetName
                        }
                        this.$nextTick(() => {
                            this.$refs[`serviceAccountType${i}`].setValue(info)
                        })
                    })
                    this.serviceList.push({
                        serviceCode: '', serviceName: '', serviceDisplayName: ''
                    })
                    // sku
                    let skuList = obj.skuOrderTotalInfoVoList[0].skuOrderDetailInfoVos
                    this.skuList = []
                    if(skuList) {
                        skuList.forEach((item, i) => {
                            item.discountRate = item.accountTypeCode == 'CountingCard' ? '' : ((1 - item.discountRate) * 100).toFixed(2)
                            item.discountMoney = item.accountTypeCode == 'CountingCard' ? '' : item.discountMoney.toFixed(2)
                            item.salesPrice = item.originalSalesPrice * item.nums
                            this.skuList.push(item)
                        })
                    }
                    this.skuList.forEach((item, i) => {
                        let info = {
                            accountTypeCode: item.accountTypeCode,
                            reconciliationTargetCode: item.reconciliationTargetCode,
                            reconciliationTargetName: item.reconciliationTargetName
                        }
                        this.$nextTick(() => {
                            this.$refs[`accountType${i}`].setValue(info)
                        })
                    })
                    this.skuList.push({
                        skuCode: '', skuName: '', skuDisplayName: ''
                    })
                    // outSide
                    let outsideList = obj.outsideOrderInfoList[0].outsideOrderDetailInfoList
                    this.outsideList = []
                    if(outsideList) {
                        outsideList.forEach(item => {
                            for(let key in item.serviceOrderDetailInfoList[0]) {
                                if(key != 'id') {
                                    item[key] = item.serviceOrderDetailInfoList[0][key]
                                }
                            }
                            item.serviceId = item.serviceOrderDetailInfoList[0].id

                            item.totalSkuNums = 0
                            item.totalSkuMoney = 0
                            if(item.skuOrderDetailInfoList) {
                                item.skuOrderDetailInfoList.forEach(skuItem => {
                                    item.totalSkuNums += skuItem.nums
                                    item.totalSkuMoney += skuItem.originalSalesPrice * skuItem.nums
                                    skuItem.discountRate = skuItem.accountTypeCode == 'CountingCard' ? '' : ((1 - skuItem.discountRate) * 100).toFixed(2)
                                    if(skuItem.detailStatus == 0 && skuItem.isDeleted == '0') {
                                        item.detailStatus = -1
                                    }
                                    skuItem.salesPrice = skuItem.nums * skuItem.originalSalesPrice
                                }) 
                            }                         
                            this.outsideList.push(item)
                        })
                    }
                    this.outsideList.forEach((item, i) => {
                        let info = {
                            accountTypeCode: item.accountTypeCode,
                            reconciliationTargetCode: item.reconciliationTargetCode,
                            reconciliationTargetName: item.reconciliationTargetName
                        }
                        this.$nextTick(() => {
                            this.$refs[`outsideAccountType${i}`].setValue(info)
                        })
                    })
                    this.outsideList.push({
                        serviceCode: '', serviceName: '', serviceDisplayName: ''
                    })

                    this.columnMerger()
                    // this.setAccountTypeValue(this.skuList) 
                }
            })
        },
        // 添加备注
        confirmClick(skuRemark, serviceRemark) {
            let params = {
                orderSkuDetailInfos: [{
                    orderNo: this.skuItem.orderNo,
                    skuOrderNo: this.skuItem.skuOrderNo,
                    skuGroupCode: this.skuItem.skuGroupCode,
                    skuCode: this.skuItem.skuCode,
                    whCode: this.skuItem.whCode,
                    storeCode: this.repairOrderInfo.storeCode,
                    skuDisplayName: this.skuItem.skuDisplayName,
                    accountTypeCode: this.skuItem.accountTypeCode,                   // 记账类型
                    reconciliationTargetCode: this.skuItem.reconciliationTargetCode, // 对账方编码
                    reconciliationTargetName: this.skuItem.reconciliationTargetName, // 对账方名称
                    discountRate: 1 - this.skuItem.discountRate / 100,
                    discountMoney: this.skuItem.discountMoney,
                    originalSalesPrice: this.skuItem.originalSalesPrice,
                    remark: skuRemark
                }]
            }
            if(serviceRemark) {
                let skuServiceInfo = this.skuItem.installationServiceInfoVo
                params.orderSkuDetailServiceInfos = [{
                    id: skuServiceInfo.id,
                    orderNo: this.repairOrderInfo.orderNo,
                    serviceOrderNo: this.repairOrderInfo.serviceOrderInfoList[0].serviceOrderNo,
                    serviceOrderDetailCode: skuServiceInfo.serviceOrderDetailCode,
                    serviceCode: skuServiceInfo.serviceCode,
                    serviceName: skuServiceInfo.serviceName,
                    serviceDisplayName: skuServiceInfo.serviceDisplayName,
                    priceType: skuServiceInfo.priceType,
                    actualWorkHours: skuServiceInfo.actualWorkHours,
                    actualWorkHourPrice: skuServiceInfo.actualWorkHourPrice,
                    costTime: skuServiceInfo.costTime,
                    remark: serviceRemark
                }]
            }
            api.repairOrder.insertOrUpdateOrderInfo(params, res => {})            
        },
        // 精品添加施工服务
        skuAddService(info) {
            let params = {
                orderSkuDetailInfos: [{
                    orderNo: this.skuItem.orderNo,
                    skuOrderNo: this.skuItem.skuOrderNo,
                    skuGroupCode: this.skuItem.skuGroupCode,
                    skuCode: this.skuItem.skuCode,
                    whCode: this.skuItem.whCode,
                    storeCode: this.repairOrderInfo.storeCode,
                    skuDisplayName: this.skuItem.skuDisplayName,
                    accountTypeCode: this.skuItem.accountTypeCode,                   // 记账类型
                    reconciliationTargetCode: this.skuItem.reconciliationTargetCode, // 对账方编码
                    reconciliationTargetName: this.skuItem.reconciliationTargetName, // 对账方名称
                    discountRate: 1 - this.skuItem.discountRate / 100 ,
                    discountMoney: this.skuItem.discountMoney,
                    originalSalesPrice: this.skuItem.originalSalesPrice,
                    installationServiceDetailCode: ''
                }],
                orderSkuDetailServiceInfos: [{
                    orderNo: this.repairOrderInfo.orderNo,
                    serviceOrderNo: this.repairOrderInfo.serviceOrderInfoList[0].serviceOrderNo,
                    serviceOrderDetailCode: '',
                    serviceCode: info.serviceCode,
                    serviceName: info.serviceName,
                    serviceDisplayName: info.serviceDisplayName,
                    priceType: info.priceType,
                    actualWorkHours: info.actualWorkHours,
                    actualWorkHourPrice: info.actualWorkHourPrice,
                    costTime: info.costTime,
                    accountTypeCode: this.skuItem.accountTypeCode,                   // 记账类型
                    reconciliationTargetCode: this.skuItem.reconciliationTargetCode, // 对账方编码
                    reconciliationTargetName: this.skuItem.reconciliationTargetName, // 对账方名称
                }]
            }
            if(this.skuItem.installationServiceInfoVo) {
                params.orderSkuDetailServiceInfos[0].id = info.id   
                params.orderSkuDetailInfos[0].installationServiceDetailCode = this.skuItem.installationServiceDetailCode
                params.orderSkuDetailServiceInfos[0].serviceOrderDetailCode = this.skuItem.installationServiceDetailCode

                api.repairOrder.insertOrUpdateOrderInfo(params, res => {
                    if(res.data.code === 'success') {
                        this.queryAllOrderInfo()
                    }
                }) 
            }else {
                getSequence(SERVICE_ORDER_DETAIL_SEQ, res => {
                    params.orderSkuDetailInfos[0].installationServiceDetailCode = res
                    params.orderSkuDetailServiceInfos[0].serviceOrderDetailCode = res
                    api.repairOrder.insertOrUpdateOrderInfo(params, res => {
                        if(res.data.code === 'success') {
                            this.queryAllOrderInfo()
                        }
                    })  
                })
            }
        },
        // 编辑精品
        updateSku() {
            let params = {
                orderSkuDetailInfos: []
            }
            this.skuList.forEach(item => {
                if(item.hasOwnProperty('orderNo') && item.isDeleted == '0') {
                    let info = {
                        orderNo: item.orderNo,
                        skuOrderNo: item.skuOrderNo,
                        skuGroupCode: item.skuGroupCode,
                        skuCode: item.skuCode,
                        whCode: item.whCode,
                        storeCode: this.repairOrderInfo.storeCode,
                        skuDisplayName: item.skuDisplayName,
                        accountTypeCode: item.accountTypeCode,                   // 记账类型
                        reconciliationTargetCode: item.reconciliationTargetCode, // 对账方编码
                        reconciliationTargetName: item.reconciliationTargetName, // 对账方名称
                        discountRate: (100 - item.discountRate) / 100,
                        discountMoney: item.discountMoney,
                        originalSalesPrice: item.originalSalesPrice
                    }
                    params.orderSkuDetailInfos.push(info)
                }
            })
            api.repairOrder.insertOrUpdateOrderInfo(params, res => {
                if(res.data.code === 'success') {
                    this.queryAllOrderInfo()
                }
            })
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
        queryByPhone(params) {
            api.mancar.queryCustomInfoByMobilePhone(params).then(res => {
                if(res.data.code === 'success') {
                    let obj = res.data.obj
                    if(obj) {
                        this.carInfo = obj.customVehicleInfoVos[0]
                        let info = {
                            inMileage: '',
                            nextMaintenanceDate: '',
                            nextMaintenanceMileage: '',
                            commercialInsuranceCompanyName: '',
                            compulsoryInsuranceCompanyName: '',
                            commercialInsuranceEndDate: '',
                            compulsoryInsuranceEndDate: '',
                            birthday: '',
                            email: '',
                            idNo: '',
                        }
                        for(let key in info) {
                            this.custVehicleInfo[key] = obj.customVehicleInfoVos[0][key]
                            if(!this.custVehicleInfo[key]) {
                                this.custVehicleInfo[key] = obj[key]
                            }
                        }
                    }
                }
            })
        },
        // 查询上次进厂进店时间
        getOrderInfoByCondition() {
            let params = {
                storeCode: this.repairOrderInfo.storeCode,
                customCode: this.repairOrderInfo.custCode,
                vehicleCode: this.repairOrderInfo.vehicleCode,
                sortRule: 1
            }
            api.vehicleCleaning.getOrderInfoByCondition(params, msg => {
                let obj = msg.data.obj
                if (msg.data.code === "success" && obj) {
                    this.custVehicleInfo.storeName = obj.storeName
                    this.custVehicleInfo.closingDate = obj.closingDate
                    this.custVehicleInfo.actualTotalPrice = obj.actualTotalPrice                    
                }                 
            })
        },
        // 查询驾驶证信息
        getDriverInfoByCustom() {
            let params = {
                customCode: this.repairOrderInfo.custCode,
                certificateType: 'DriverLicense'
            }
            api.vehicleCleaning.getCertificateTypeInfoByCustom(params, msg => { 
                let data = msg.data.obj
                if(msg.data.message == 'success' && data) {
                    this.custVehicleInfo.certificateProperty1 = data.certificateTypeInfoVos[0]&&data.certificateTypeInfoVos[0].certificateProperty1
                    this.custVehicleInfo.firstGetDate = data.certificateTypeInfoVos[0]&&data.certificateTypeInfoVos[0].firstGetDate
                    this.custVehicleInfo.expireDate = data.certificateTypeInfoVos[0]&&data.certificateTypeInfoVos[0].expireDate
                }
            })
        },
        getDriverImage() {
            let params = {
                relationCode: this.repairOrderInfo.custCode,
                businessType: 'driverlicense'
            }
            api.accessory.list(params, res => {
                let obj = res.data.obj
                if(res.data.code === 'success' && obj[0]) {
                    this.custVehicleInfo.filePath = `${common.getUploadUrl()}${obj[0].filePath}`
                }
            })
        },
        // 查询券数量
        getCouponNums() {
            let params = {
                // storeCode: this.repairOrderInfo.storeCode,
                customCode: this.repairOrderInfo.custCode,
                // vehicleCode: this.repairOrderInfo.vehicleCode
            }
            api.vehicleCleaning.getCouponCountByCustomer(params, res => {
                let obj = res.data.obj
                if(res.data.code === 'success' && obj) {
                    this.custVehicleInfo.couponNums = obj
                }
            })
        },
        // 查询卡数量
        getCardNums() {
            let params = {
                // storeCode: this.repairOrderInfo.storeCode,
                customCode: this.repairOrderInfo.custCode,
                // vehicleCode: this.repairOrderInfo.vehicleCode
            }
            api.cardManage.queryusableCardInfo(params, res => {
                let obj = res.data.obj
                if(res.data.code === 'success' && obj) {
                    this.custVehicleInfo.cardNums = obj
                }
            })
        },
        // 预览报价
        preview() {
            let params = {
                orderNo: this.repairOrderInfo.orderNo
            }
            api.repairOrder.preview(params, res => {
                if(res.data.code === 'success') {
                    common.printPreview(common.isdev() + collectionApi.repairOrder.print, {
                        name: 'orderNo',
                        value: params.orderNo
                    })
                }
            })
        },
        // 提交派工
        submitDispatch() {
            if(!this.repairOrderInfo.bookingClosingDate) {
                Message({
                    type: 'warning',
                    message: '请填写预计交车时间'
                })
                return
            }
            let params = {
                orderNo: this.repairOrderInfo.orderNo
            }
            api.repairOrder.editDispatch(params, res => {
                alertSuccess(res, () => {
                    this.queryAllOrderInfo()
                })
            })
        },
        // 竣工
        completed() {
            if(!this.repairOrderInfo.mileageOutStore) {
                Message({
                    type: 'warning',
                    message: '最后出厂公里数必填'
                })
                return
            }
            let params = {
                orderNo: this.repairOrderInfo.orderNo
            }
            api.repairOrder.orderCompleteByOrderNo(params, res => {
                alertSuccess(res, () => {
                    this.queryAllOrderInfo()
                })
            })
        },
        // 结算
        settlement() {
            let params = {
                orderNo: this.repairOrderInfo.orderNo
            }
            api.repairOrder.settlementOrderInfo(params, res => {
                alertSuccess(res, () => {
                    this.queryAllOrderInfo()
                })
            })
        },
        // 保存
        saveOrder() {
            if(!this.repairOrderInfo.bookingClosingDate) {
                Message({
                    type: 'warning',
                    message: '请填写预计交车时间'
                })
                return
            }
            if(this.repairOrderInfo.mileageOutStore - 0 < 0) {
                Message({
                    type: 'warning',
                    message: '最后出厂公里数不能小于0'
                })
                return
            }
            let params = {
                orderInfoVo: {
                    id: this.repairOrderInfo.id,
                    orderNo: this.repairOrderInfo.orderNo,
                    businessTypeCode: this.repairOrderInfo.businessTypeCode,
                    bookingClosingDate: new Date(this.repairOrderInfo.bookingClosingDate).format(),
                    inStoreFlag: this.repairOrderInfo.inStoreFlag,
                    mileageOutStore: this.repairOrderInfo.mileageOutStore
                }
            }
            api.repairOrder.insertOrUpdateOrderInfo(params, res => {
                alertSuccess(res)
            })
        },
        saveMileageOutStore() {
            if(!this.repairOrderInfo.mileageOutStore) {
                return
            }
            let params = {
                orderInfoVo: {
                    id: this.repairOrderInfo.id,
                    orderNo: this.repairOrderInfo.orderNo,
                    mileageOutStore: this.repairOrderInfo.mileageOutStore
                }
            }
            api.repairOrder.insertOrUpdateOrderInfo(params, res => {
                // alertSuccess(res)
            })
        },
        ...mapActions('workOrder', [
            'getPriceType',
            'getStoreInfo',
            'getWhListByStoreCode',
            'getOpenService'
        ])
    },
    watch: {
        serviceList: {
            handler(val) {
                for(let i = 0; i < val.length; i ++) {
                    let skuTotalDiscountMoney = 0
                    this.serviceList[i].skuTotalDiscountMoney = 0
                    if(val[i].skuOrderDetailInfoList) {
                        for(let j = 0; j < val[i].skuOrderDetailInfoList.length; j ++) {
                            // if(val[i].skuOrderDetailInfoList[j].discountMoney) {
                                // 销售售价 = 标准销售单价 * 数量
                                this.serviceList[i].skuOrderDetailInfoList[j].salesPrice = (val[i].skuOrderDetailInfoList[j].originalSalesPrice - 0) * (val[i].skuOrderDetailInfoList[j].nums - 0)
                                // 折扣金额 = (100 - 商品折扣(%)) * 销售售价
                                this.serviceList[i].skuOrderDetailInfoList[j].discountMoney = this.serviceList[i].skuOrderDetailInfoList[j].accountTypeCode == 'CountingCard' ? '' : ((100 - (this.serviceList[i].skuOrderDetailInfoList[j].discountRate - 0)) * this.serviceList[i].skuOrderDetailInfoList[j].salesPrice / 100)
                                // 折后价 = 销售售价 - 折扣金额
                                this.serviceList[i].skuOrderDetailInfoList[j].actualSalesPrice = this.serviceList[i].skuOrderDetailInfoList[j].accountTypeCode != 'normalSale' ? 0 : (val[i].skuOrderDetailInfoList[j].salesPrice - 0) - (val[i].skuOrderDetailInfoList[j].discountMoney - 0)
                                skuTotalDiscountMoney += this.serviceList[i].skuOrderDetailInfoList[j].discountMoney

                                this.serviceList[i].skuTotalDiscountMoney = skuTotalDiscountMoney
                            // }
                        }
                    }
                    if(val[i].orderNo) {
                        // 销售售价 = 标准销售门市价 => 服务没有数量
                        this.serviceList[i].salesPrice = val[i].originalSalesPrice
                        // 折扣金额 = 标准工时 * 工时单价 * ((100 - 人工费折扣) / 100) + 配件折扣金额总和
                        // if(val[i].priceType == 1) {
                        //     this.serviceList[i].discountMoney = (this.serviceList[i].salesPrice * (100 - this.serviceList[i].discountRate) / 100).toFixed(2)
                        // }else {
                        //     this.serviceList[i].discountMoney = (this.serviceList[i].actualWorkHours * this.serviceList[i].actualWorkHourPrice * (100 - (this.serviceList[i].discountRate - 0)) / 100 + skuTotalDiscountMoney).toFixed(2)
                        // }
                        // 折后价 = 销售售价 - 折扣金额
                        this.serviceList[i].actualSalesPrice = this.serviceList[i].accountTypeCode != 'normalSale' ? 0 : (val[i].salesPrice - 0) - (val[i].discountMoney - 0)
                    }
                }
            },
            deep: true
        },
        skuList: {
            handler(val) {
                for(let i = 0; i < val.length; i ++) {
                    if(val[i].orderNo) {
                        // 销售售价 = 标准销售单价 * 数量
                        this.skuList[i].salesPrice = (val[i].originalSalesPrice - 0) * (val[i].nums - 0)
                        // 商品折扣(%) = (销售售价 - 折扣金额) / 销售售价 * 100
                        // this.skuList[i].discountRate = (((val[i].salesPrice - 0)  - (val[i].discountMoney - 0) ) / val[i].salesPrice * 100).toFixed(2)
                        // 折扣金额 = (100 - 商品折扣(%)) * 销售售价
                        this.skuList[i].discountMoney = this.skuList[i].accountTypeCode == 'CountingCard' ? '' :((100 - (this.skuList[i].discountRate - 0)) * val[i].salesPrice / 100).toFixed(2)
                        // 折后价 = 销售售价 - 折扣金额
                        this.skuList[i].actualSalesPrice = this.skuList[i].accountTypeCode != 'normalSale' ? 0 : (val[i].salesPrice - 0) - (val[i].discountMoney - 0)
                    }
                }
            },
            deep: true
        },
        'repairOrderInfo.businessTypeCode'(val) {
            if(val != this.tempOrderInfo.businessTypeCode) {
                let params = {
                    orderInfoVo: {
                        orderNo: this.repairOrderInfo.orderNo,
                        businessTypeCode: val,
                        id: this.repairOrderInfo.id
                    }
                }
                api.repairOrder.insertOrUpdateOrderInfo(params, res => {})
            }
        },
        'repairOrderInfo.bookingClosingDate'(val) {
            if(val != this.tempOrderInfo.bookingClosingDate && val) {
                let params = {
                    orderInfoVo: {
                        orderNo: this.repairOrderInfo.orderNo,
                        bookingClosingDate: new Date(val).format(),
                        id: this.repairOrderInfo.id
                    }
                }
                api.repairOrder.insertOrUpdateOrderInfo(params, res => {})            
            }
        },
        'repairOrderInfo.inStoreFlag'(val) {
            if(val != this.tempOrderInfo.inStoreFlag) {
                let params = {
                    orderInfoVo: {
                        orderNo: this.repairOrderInfo.orderNo,
                        inStoreFlag: val,
                        id: this.repairOrderInfo.id
                    }
                }
                api.repairOrder.insertOrUpdateOrderInfo(params, res => {}) 
            }
        }
    },
    filters: {
        serviesDetailStatus(val) {
            if(val == -1) {
                return '缺货'
            }else if(val == 0) {
                return '待派工'
            }else if(val == 1) {
                return '已派工'
            }else if(val == 2) {
                return '待施工'
            }else if(val == 8) {
                return '施工中'
            }else if(val == 10) {
                return '已竣工'
            }
        },
        priceType(val) {
            if(val == 1) {
                return '固定价格'
            }else if(val == 2) {
                return '非固定价格'
            }else if(val == 3) {
                return '自定义价格'
            }
        },
        detailStatus(val) {
            if(val == 0) {
                return '缺货'
            }else if(val == 1) {
                return '已备货'
            }else if(val == 2) {
                return '已出库'
            }
        },
        toFixed(val) {
            if(typeof val == 'number') {
                return val.toFixed(2)
            }
        },
        timeFilter(val) {
            if(val) {
                return val.substring(0, 10).replace(/-/g, '/')
            }
        },
        timeSubstring(val) {
            if(val) {
                return val.substring(0, 19)
            }
        },
        moneyFilter(val) {
            return val ? formatMoney(val, 2) : '0.00'
        },
        outsideType(val) {
            if(val == 0) {
                return '供应商外包'
            }else if(val == 1) {
                return '集团内外包'
            }
        },
        needSku(val) {
            if(val == 0) {
                return '不需要'
            }else if(val == 1) {
                return '需要'
            }
        },
        isDispatch(val) {
            if(val == 0) {
                return '不需要'
            }else if(val == 1) {
                return '需要'
            }
        }
    }
}
</script>
<style>

.font-size-20 {
    font-size: 20px;
}
.font-size-16 {
    font-size: 16px;
}
.color-red {
    color: red;
}
.padding-top-70 {
    padding-top: 70px;
}
.padding-top-7 {
    padding-top: 7px;
}
.margin-left-30 {
    margin-left: 30px;
}
.margin-right-30 {
    margin-right: 30px;
}
.margin-right-60 {
    margin-right: 60px;
}
.margin-top-20 {
    margin-top: 20px;
}

.fixd-right {
    position: absolute;
    top: 127px;
    right: 16px;
}
.repair-order .el-table::after, .el-table::before {
    position: relative;
}
.repair-order .el-table, .el-table td, .el-table th{
    position: unset !important;
}
.repair-order .el-table__body-wrapper {
    position: unset !important;
}
.repair-order .col-md-6, .col-md-12 {
    position: unset !important;
}
.repair-order .el-tree {
    width: 200px;
}
.clear-card .card {
    position: unset !important;
}

.flow-container {
    /* padding: 10px 100px; */
    /* border-bottom: 2px solid #F2F2F2; */
}
.flow {
    display: flex;
}
.flow-item {
    flex: 1;
    height: 30px;
    border-bottom: 2px solid #EEEEEE;
}
.flow-active {
    border-bottom: 2px solid #7197FF;
}
.flow-icon {
    width: 25px;
    height: 25px;
    background: #71757E;
    color: #fff;
    text-align: center;
    line-height: 25px;
    border-radius: 50%;
    margin-top: -4px;
}
.text {
    margin-left: 10px;
}

.disabled-box {
    position: relative;
    height: 40px;
    padding-top: 3px; 
}

.disabled-line {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 200%;
    margin-left: -20px;
    border-top: 2px solid rgba(0, 0, 0, 0.4)
}
.line-limit {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; 
}
</style>

