<template>
    <div>
        <b-card>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="门店编码*" label-text-align="right" :label-cols="4">
                        <b-form-input v-model='paramsCollection.storeCode' readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="门店名称*" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="paramsCollection.storeName" :state="stateControl.storeName" :readonly="isShowChange || isJustShow" placeholder="" />
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="门店缩写*" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="paramsCollection.storeAddrName" :state="stateControl.storeAddName" :readonly="isShowChange || isJustShow" placeholder=""/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6" :class="{'controlEl_Time' : stateControl.timeStart}">
                    <b-form-fieldset horizontal label="开业时间*" label-text-align="right" :label-cols="4">
                        <el-date-picker
                            v-model="tempTime"
                            :disabled="isShowChange || isJustShow"
                            :editable="false"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </b-form-fieldset> 
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="所属组织*" label-text-align="right" :label-cols="4">
                        <div @click="orgClick" ref="org">
                            <b-form-input v-model="paramsCollection.orgName" :state="stateControl.orgName" readonly/>
                        </div>
                        <div class="text-left special-select-tree self_constrol" v-show="orgShow">
                            <el-tree :data="orgTreeData" :props="orgOptions" :load="orgLoad" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="orgItemClick">
                            </el-tree>
                        </div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="销售区域*" label-text-align="right" :label-cols="4">
                        <!-- <b-form-input placeholder="" /> -->
                        <!-- <b-form-select v-model="paramsCollection.areaCode" :options="arealist"/> -->
                        <div @click="orgClickarea" ref="org">
                            <b-form-input v-model="paramsCollection.areaName" :state="stateControl.saleName" readonly/>
                        </div>
                        <div class="text-left special-select-tree self_constrol" v-show="orgShowarea">
                            <el-tree :data="orgTreeDataarea" :props="orgOptionsarea" :load="orgLoadarea" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="orgItemClickarea">
                            </el-tree>
                        </div>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="门店类型*" label-text-align="right" :label-cols="4">
                        <!-- <b-form-input placeholder="" /> -->
                        <b-form-select v-model="paramsCollection.storeType" :state="stateControl.storeType" :disabled="isShowChange || isJustShow" :options="typelist"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="状态*" label-text-align="right" :label-cols="4">
                        <!-- <b-form-input placeholder=""/> -->
                        <b-form-select v-model="paramsCollection.storeState" :state="stateControl.status" :disabled="isShowChange || isJustShow" :options="statelist"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="门店地址*" label-text-align="right" :label-cols="4">
                        <!-- <b-form-input placeholder="" /> -->
                        <chinarea v-model="provinceCityDistrict" :eorror="stateControl.storeAddress" @check-change="checkChange" :value="chineareaDefault" :readonly="isShowChange || isJustShow"></chinarea>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="详细地址*" label-text-align="right" :label-cols="4">
                        <b-form-input :state="stateControl.detailAddress" v-model="paramsCollection.address" :readonly="isShowChange || isJustShow" placeholder="" @blur.native="getPoint"/>
                        <!-- <b-form-input :state="stateControl.detailAddress" v-model="paramsCollection.address" :readonly="isShowChange || isJustShow" placeholder=""/> -->
                    </b-form-fieldset> 
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="邮编" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="paramsCollection.storePostcode" :readonly="isShowChange || isJustShow" placeholder=""/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="门店坐标X*" label-text-align="right" :label-cols="4">
                        <b-form-input :state="stateControl.xPoint" v-model="paramsCollection.xPosition" placeholder="" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="门店坐标Y*" label-text-align="right" :label-cols="4">
                        <b-form-input :state="stateControl.yPoint" v-model="paramsCollection.yPosition" placeholder="" readonly/>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button v-if="!isJustShow&&!isShowSaveAgain&&!hasSaved" size="sm" variant="success" @click="add">保存</b-button>
                        <b-button v-if="isShowSaveAgain" size="sm" variant="success" @click="addAgain">保存</b-button>
                        <!-- <b-button v-if="isShowChange&&!isJustShow" size="sm" variant="warning" @click="edit">修改</b-button> -->
                        <b-button v-if="!isJustShow" size="sm" variant="default" @click="cancel">取消</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card v-if="hasSaved || isJustShow || isShowSaveAgain">
            <b-card header="业务管理">
                <div class="row">
                    <div v-if="!isJustShow" class="col-md-6 col-lg-6" :class="{'controlEl_Time' : businessControl.time}">
                        <b-form-fieldset horizontal label="营业时间*" label-text-align="right" :label-cols="4">
                            <el-time-picker
                                is-range
                                :disabled="isJustShow"
                                v-model="hourTime"
                                :value="hourTime"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围">
                            </el-time-picker>
                        </b-form-fieldset>
                    </div>
                    <div v-if="isJustShow" class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="营业时间*" label-text-align="right" :label-cols="4">
                            <b-form-input :readonly="isJustShow" :value="businessStartTime + '至' + businessEndTime" placeholder="" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="联系人*" label-text-align="right" :label-cols="4">
                            <b-form-input :state="businessControl.person" :readonly="isJustShow" v-model="business.person" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="电话*" label-text-align="right" :label-cols="4">
                            <b-form-input :state="businessControl.tel" :readonly="isJustShow" v-model="business.tel" placeholder=""/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="手机*" label-text-align="right" :label-cols="4">
                            <b-form-input :state="businessControl.phone" :readonly="isJustShow" v-model="business.phone" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="传真" label-text-align="right" :label-cols="4">
                            <b-form-input :readonly="isJustShow" v-model="business.fax" placeholder=""/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="E-mail" label-text-align="right" :label-cols="4">
                            <b-form-input :readonly="isJustShow" v-model="business.mail" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="" label-text-align="right" :label-cols="4">
                            <input v-model="business.isFcForcedQuote" :disabled="isJustShow" type="checkbox">是否强制金融专员协助报价
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="pull-right">
                            <b-button size="sm" v-if="!isJustShow" variant="success" @click="savebusiness">保存</b-button>
                        </div>
                    </div>
                </div>
            </b-card>
            <b-card header="车间生产">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="维修企业等级*" label-text-align="right" :label-cols="4">
                            <b-form-select :disabled="isJustShow" v-model="product.type" :state="factoryLevel" :options="businesslist"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="工时单价(元)*" label-text-align="right" :label-cols="4">
                            <b-form-input @blur.native="workTime" :readonly="isJustShow" v-model="product.unit" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="工时转换系数(分钟)*" label-text-align="right" :label-cols="4">
                            <b-form-input @blur.native="transferRat" :readonly="isJustShow" v-model="product.coefficient" placeholder=""/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-1 col-lg-1">
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">转换系数：1工时对应的时间单位，<br/>空值时为默认1工时=60分钟</div>
                            <i class="tipsImportant">i</i>
                        </el-tooltip>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="pull-right">
                            <b-button v-if="!isJustShow" size="sm" variant="success" @click="savecar">保存</b-button>
                        </div>
                    </div>
                </div>
            </b-card>
            <b-card header="财务信息">
                <div class="row" v-if="!isJustShow">
                    <div class="col-md-12">
                        <div class="pull-right">
                            <b-button size="sm" variant="success" @click="buildfinance">新增</b-button>
                            <b-button size="sm" v-if="tablelistfinance.length > 0" variant="danger" @click="deletefinance">删除</b-button>
                        </div>
                    </div>
                </div>
                <div class="special store-manage-line-act"></div>
                <div class="row" v-for="(item, index) in tablelistfinance" :key="index">
                    <div class="col-md-1 col-lg-1">
                        <div v-if="item.invoiceTypeCode" class="col-md-1 col-lg-1 special">
                            <input type="radio" name="radio" @click="setFinanceIndex(index)"/>
                        </div>
                    </div>
                    <div class="col-md-11 col-lg-11">
                        <div class="row">
                            <div class="financeCard col-md-12 col-lg-12">
                                <p v-if="!item.invoiceTypeName">{{ index=== 0 ? '暂无财务信息' : '' }}</p>
                                <p>{{ item.invoiceTypeName ? '发票类型: ' + item.invoiceTypeName: ' ' }}</p>
                                <p>{{ item.invoiceTitle ? '发票抬头: ' + item.invoiceTitle : ' ' }}</p>
                                <p>{{ item.taxRegistrationNumber ? '税号：' + item.taxRegistrationNumber : ' '}}</p>
                                <p>
                                    <span>{{ item.bankAccount ? '账号: ' + item.bankAccount : ' '}}</span>
                                    <span>{{ item.bankName ? '开户行: ' + item.bankName : ' ' }}</span>
                                </p>
                                <p>
                                    <span>{{ item.businessAddress ? '地址: ' + item.businessAddress : ' ' }}</span>
                                    <span>{{ item.enterprisePhoneNumber ? '电话: ' + item.enterprisePhoneNumber : ' '}}</span>
                                </p>
                                <p :class="{'lastFinanceCard': index === tablelistfinance.length-1}">&nbsp;</p>
                            </div>
                        </div>
                    </div>
                </div>
            </b-card>
            <b-card header="车型显示">
                <div class="row">
                    <div class="col-md-1 col-lg-1">
                        <el-tooltip placement="top" effect="light">
                            <div slot="content">此表为空时，默认为所有车型。绑定车型适配后此门<br/>店只能对已选车型进行操作（包括销售业务和售后业务）</div>
                            <i class="tipsImportant">i</i>
                        </el-tooltip>
                    </div>
                    <div class="col-md-11" v-if="!isJustShow">
                        <div class="pull-right">
                            <b-button size="sm" variant="success" @click="buildcarshow">新增</b-button>
                            <b-button v-if="tablecarshow.length > 0" size="sm" variant="danger" @click="deletecarshow">删除</b-button>
                        </div>
                    </div>
                </div>
                <div class="table-scrollable">
                    <b-table striped hover bordered show-empty :items="tablecarshow" :fields="fieldscarshow">
                        <template slot="index" slot-scope="data">
                            <div v-if="!isJustShow&&(data.item.brandCode || data.item.factoryCode)" @click="setIndex(data.index)">
                                <input type="radio" name="radio" />
                            </div>
                        </template>
                        <template slot="empty">
                                暂无数据...
                        </template>
                    </b-table>
                </div>
            </b-card>
            <b-card header="附加信息">
                <b-row>
                     <div class="col-md-4">
                         <b-form-fieldset horizontal label="预约时间范围配置" :label-cols="6" class="text-left pl-3 pr-3 ml-0 mr-3">
                            <span class="input-append-t">T+</span>
                            <b-form-input  type="number" :disabled="isJustShow" v-model="storeAdd.DaysInAdvance" onkeyup="this.value=this.value.replace(/\D/g,'')" :class="{'inp-invalid' : storeAddInp.DaysInAdvance}" min="0"/>
                            <span class="input-append-y-t">天</span>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 mt-1">
                         设定后，预约天数将被确定。
                    </div>
                </b-row>
                 <b-row>
                    <div>
                        <span class="ml-3 pl-3">预约限制</span>
                    </div>
                    <div class="col-md-8">
                        <b-row>
                            <div class="col-md-4 pr-2">
                                <b-form-fieldset horizontal label="上午" label-text-align="right" :label-cols="4" class="ml-0">
                                    <el-time-select
                                        :disabled="isJustShow"
                                        :class="{'inp-invalid' : storeAddInp.MorningStartTime}"
                                        v-model="storeAdd.MorningStartTime"
                                        :picker-options="{
                                            start: '00:00',
                                            step: '01:00',
                                            end: '11:00'
                                        }"
                                    placeholder="选择时间">
                                    </el-time-select>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-3  ml-0">
                                <b-form-fieldset horizontal label="-" label-text-align="left" :label-cols="2" class="ml-0">
                                    <el-time-select
                                        :disabled="isJustShow"
                                        :class="{'inp-invalid' : storeAddInp.MorningEndTime}"
                                        v-model="storeAdd.MorningEndTime"
                                        :picker-options="{
                                            start: '00:00',
                                            step: '01:00',
                                            end: '11:00'
                                        }"
                                    placeholder="选择时间">
                                    </el-time-select>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-5">
                                <b-form-fieldset horizontal label="可预约台数" :label-cols="4" class="text-right pr-3 ml-2">
                                    <b-form-input :disabled="isJustShow"  type="number" v-model="storeAdd.MorningAppointment" v-only-number :class="{'inp-invalid' : storeAddInp.MorningAppointment}" placeholder="无限制" />
                                    <span class="input-append-yuan">辆</span>
                                </b-form-fieldset>
                            </div>
                        </b-row>
                        <b-row>
                            <div class="col-md-4 pr-2">
                                <b-form-fieldset horizontal label="上午" label-text-align="right" :label-cols="4" class="ml-0">
                                    <el-time-select
                                        :disabled="isJustShow"
                                        :class="{'inp-invalid' : storeAddInp.AfternoonStartTime}"
                                        v-model="storeAdd.AfternoonStartTime"
                                        :picker-options="{
                                            start: '12:00',
                                            step: '01:00',
                                            end: '23:00'
                                        }"
                                    placeholder="选择时间">
                                    </el-time-select>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-3  ml-0">
                                <b-form-fieldset horizontal label="-" label-text-align="left" :label-cols="2" class="ml-0">
                                    <el-time-select
                                        :disabled="isJustShow"
                                        :class="{'inp-invalid' : storeAddInp.AfternoonEndTime}"
                                        v-model="storeAdd.AfternoonEndTime"
                                        :picker-options="{
                                            start: '12:00',
                                            step: '01:00',
                                            end: '23:00'
                                        }"
                                    placeholder="选择时间">
                                    </el-time-select>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-5">
                                <b-form-fieldset horizontal label="可预约台数" :label-cols="4" class="text-right pr-3 ml-2">
                                    <b-form-input :disabled="isJustShow" v-model="storeAdd.AfternoonAppointment" onkeyup="this.value=this.value.replace(/\D/g,'')" :class="{'inp-invalid' : storeAddInp.AfternoonAppointment}" placeholder="无限制" />
                                    <span class="input-append-yuan">辆</span>
                                </b-form-fieldset>
                            </div>
                        </b-row>
                    </div>
                </b-row>
                <div class="row">
                    <div class="col-md-12">
                        <div class="pull-right">
                            <b-button v-if="!isJustShow" size="sm" variant="success" @click="saveStoreAdd">保存</b-button>
                        </div>
                    </div>
                </div>
            </b-card>
        </b-card>
        <b-modal id="modalPrevent"
                v-model="financeModel"
                ref="modalfinance"
                @ok="financehandleOk"
                @shown="financeclearName"
                ok-title="确认"
                cancel-title="取消">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="发票类型" label-text-align="right" :label-cols="4">
                            <b-form-select v-model="queryFinance.ticketType" :options="ticketTypelist"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="发票抬头" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="queryFinance.ticketHead" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="开户银行" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="queryFinance.bank" placeholder=""/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="账号" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="queryFinance.account" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="税号" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="queryFinance.taxCode" placeholder=""/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="电话" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="queryFinance.phone" placeholder="" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12 col-lg-12">
                        <b-form-fieldset horizontal label="地址" label-text-align="right" :label-cols="2">
                            <b-form-input v-model="queryFinance.address" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
        </b-modal>
        <b-modal id="modalPrevent"
                v-model="carModel"
                ref="modalcar"
                @ok="carhandleOk"
                @shown="carclearName"
                ok-title="确认"
                cancel-title="取消">
                <car ref="car" :col="1" @callBack="callBack" :flag = false></car>
                <!-- <div class="row">
                    <div class="col-md-12 col-lg-12">
                        <b-form-fieldset horizontal label="款型" label-text-align="right" :label-cols="4">
                            <b-form-input placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div> -->
        </b-modal>
        <div id="container" 
            style="position: absolute;
                margin-top:30px; 
                width: 730px; 
                height: 590px; 
                top: 50; 
                border: 1px solid gray;
                overflow:hidden;
                display: none;">
        </div>
        <!-- <baidu-map class="bm-view" ak="UkArFenzleUSM9aszE3B6GlmgA66gQu4">
        </baidu-map> -->
    </div>
</template>
<script>
    import Vue from 'vue'
    import config from 'common/config.js'
    import { MessageBox, Message, Tree, DatePicker, TimeSelect, TimePicker, Tooltip } from 'element-ui'
    // import MapMvvm from 'baidu-map-mvvm'
    import chinarea from 'components/iris-chinaarea/index.vue'
    import car from 'components/iris-carinfo/index.vue'
    import api from 'common/api.js'
    import common from 'common/common.js'
    import directives from 'common/directives.js'
    import {STORE_ADD} from 'common/ref-code.js'
    Vue.use(Tree)
    Vue.use(DatePicker)
    Vue.use(TimePicker)
    Vue.use(TimeSelect)
    Vue.use(Tooltip)
    // Vue.use(MapMvvm, {
    //     ak: 'UkArFenzleUSM9aszE3B6GlmgA66gQu4'
    // })
    export default {
        components: {
            chinarea,
            car
            // BaiduMap
        },
        data() {
            return {
                tipsShow: false,
                hasSaved: false,
                hourTime: '',
                isShowSave: true,
                isJustShow: false,
                isShowSaveAgain: false,
                isShowChange: false,
                specialAddress: '',
                financeModel: false,
                carModel: false,
                typelist: [],
                statelist: [],
                arealist: [],
                orgTreeData: [],
                factoryLevel: null,
                orgOptions: {
                    children: 'children',
                    label: 'name'
                },
                orgTreeDataarea: [],
                orgOptionsarea: {
                    children: 'children',
                    label: 'name'
                },
                product: {
                    type: '',
                    coefficient: 60,
                    unit: 50
                },
                queryFinance: {
                    ticketType: '',
                    ticketHead: '',
                    bank: '',
                    account: '',
                    taxCode: '',
                    phone: '',
                    address: ''
                },
                orgShow: false,
                orgShowarea: false,
                tempTime: '',
                tablelistfinance: [{},{}],
                tablecarshow: [{},{},{},{},{}],
                baiduaddress: '',
                paramsCollection: {
                    id: '',
                    storeCode: '',
                    storeName: '',
                    storeAddrName: '',
                    businessStartTime: '',
                    businessEndTime: '',
                    orgCode: '',
                    orgName: '',
                    storeType: '',
                    storeState: '',
                    areaCode: '',
                    areaName: '',
                    xPosition: '',
                    yPosition: '',
                    address: '',
                    storePostcode: '',
                    cityCode: '',
                    cityName: '',
                    storeProvinceCode: '',
                    storeProvinceName: '',
                    storeCityCode: '',
                    storeCityName: '',
                    storeDistrictCode: '',
                    storeDistrictName: ''
                },
                business: {
                    person: '',
                    tel: '',
                    phone: '',
                    fax: '',
                    mail: '',
                    isFcForcedQuote: false,
                    startTime: '',
                    endTime: ''  
                },
                businessControl: {
                    person: null,
                    tel: null,
                    phone: null,
                    time: false
                },
                fieldscar: {
                    index: {
                        label: ' '
                    },
                    type: {
                        label: '工位类型'
                    },
                    amount: {
                        label: '工位数量'
                    },
                    configuration: {
                        label: '配置工种'
                    }
                },
                fieldscarshow: {
                    index: {
                        label:' '
                    },
                    factoryName: {
                        label: '厂家'
                    },
                    brandName: {
                        label: '品牌'
                    },
                    seriesName: {
                        label: '车系'
                    },
                    modelName: {
                        label: '车型'
                    },
                    opvName: {
                        label: '排量'
                    },
                    iotypeName: {
                        label: '进气方式'
                    },
                    // style: {
                    //     label: '款型'
                    // }
                },
                tempCarIndex: '',
                tempFinanceIndex: '',
                tempCarData: {},
                ticketTypelist: [],
                businesslist: [],
                financeId: '',
                carshowId: '',
                chineareaDefault: {},
                businessStartTime: '',
                businessEndTime: '',
                stateControl: {
                    storeName: null,
                    storeAddName: null,
                    orgName: null,
                    saleName: null,
                    storeType: null,
                    status: null,
                    storeAddress: null,
                    detailAddress: null,
                    xPoint: null,
                    yPoint: null,
                    timeStart: false
                },
                // 省市区联动显示
                provinceCityDistrict: '',
                storeAdd: {
                    DaysInAdvance: 0,
                    MorningStartTime: '08:00',
                    MorningEndTime: '11:00',
                    MorningAppointment: '',
                    AfternoonStartTime: '12:00',
                    AfternoonEndTime: '15:00',
                    AfternoonAppointment: '',
                },
                storeAddInp: {
                    DaysInAdvance: false,
                    MorningStartTime: false,
                    MorningEndTime: false,
                    MorningAppointment: false,
                    AfternoonStartTime: false,
                    AfternoonEndTime: false,
                    AfternoonAppointment: false,
                },
            }
        },
        methods: {
            // 获取数据字典门店附加信息
            getStoreAdd() {
				const option = {
                    'refCode': STORE_ADD
                }
				return new Promise((reslove,reject) => {
					api.ref.getDataDictionarys(option, (res) => {
						if(res.data.code === 'success') {
							reslove(res.data.obj)
						};
					})
				})				
            },
            // 地图相关
            loadBMapScript () {
                let script = document.createElement('script');
                //script.src = 'http://api.map.baidu.com/api?v=3.0&ak=UkArFenzleUSM9aszE3B6GlmgA66gQu4&callback=bMapInit';
                script.src = 'http://api.map.baidu.com/api?v=3.0&ak=jTvKCUKko2uGDHC4Y6Ac8737lzkqEG1g&callback=bMapInit';
                //script.src = 'http://api.map.baidu.com/api?v=3.0&ak=VFjxQSQ1TokZ5nvWxrl318yt2GiAbF6w&callback=bMapInit';
                document.body.appendChild(script);
            },
            qeuryLocation () {
                const _this = this
                if(!_this.baiduaddress) {
                    return
                }
                let myGeo = new BMap.Geocoder();
                // 地址转换成坐标系
                myGeo.getPoint(_this.baiduaddress + _this.paramsCollection.address, function (point) {
                    if (point) {
                        _this.paramsCollection.xPosition = point.lng 
                        _this.paramsCollection.yPosition = point.lat
                    }else {
                        myGeo.getPoint(_this.baiduaddress, function (point) {
                            if(point) {
                                _this.paramsCollection.xPosition = point.lng 
                                _this.paramsCollection.yPosition = point.lat
                            }
                        },_this.baiduaddress)
                    }
                },
                _this.baiduaddress);
            },
            // 工时校验
            workTime() {
                const _this = this
                let judge = _this.product.unit - 0
                if(judge) {
                    if(judge === 0) {
                        _this.product.unit = 0
                    }else {
                        _this.product.unit = _this.product.unit - 0
                    }
                }else { 
                    _this.product.unit = 0
                }
                _this.product.unit = _this.product.unit.toFixed(2) - 0
                if(_this.product.unit < 0) {
                    _this.product.unit = 50
                }
                _this.product.unit = _this.product.unit.toFixed(2)
            },
            // 工时系数校验
            transferRat() {
                const _this = this
                let judge = _this.product.coefficient - 0
                if(judge) {
                    if(judge === 0) {
                        _this.product.coefficient = 0
                    }else {
                        _this.product.coefficient = _this.product.coefficient - 0
                    }
                }else { 
                    _this.product.coefficient = 0
                }
                _this.product.coefficient = _this.product.coefficient.toFixed(2)-0
                if(_this.product.coefficient < 0) {
                    _this.product.coefficient = 60
                }
                _this.product.coefficient = _this.product.coefficient.toFixed(2)
            },
            getPoint() {
                const _this = this
                if(!_this.baiduaddress) {
                    return
                }
                this.qeuryLocation();
            },
            // 获取行政区域的数据
            checkChange(data) {
                const _this = this
                _this.paramsCollection.storeDistrictCode = data.node.value
                _this.paramsCollection.storeDistrictName = data.node.text
                _this.paramsCollection.storeProvinceName = ''
                _this.paramsCollection.storeProvinceCode = ''
                _this.paramsCollection.storeCityName = ''
                _this.paramsCollection.storeCityCode = ''
                _this.baiduaddress = data.node.text
                _this.provinceCityDistrict = ''
                if(data.parentNode.length > 0) {
                    if(data.parentNode.length ===1) {
                        _this.paramsCollection.storeProvinceName = data.parentNode[0].text
                        _this.paramsCollection.storeProvinceCode = data.parentNode[0].value
                        _this.provinceCityDistrict += (data.parentNode[0].text + data.node.text)
                        _this.baiduaddress = data.parentNode[0].text + _this.baiduaddress
                    }else if(data.parentNode.length ===2) {
                        _this.provinceCityDistrict += (data.parentNode[0].text + data.parentNode[1].text + data.node.text)
                        _this.paramsCollection.storeProvinceName = data.parentNode[0].text
                        _this.paramsCollection.storeProvinceCode = data.parentNode[0].value
                        _this.paramsCollection.storeCityName = data.parentNode[1].text
                        _this.paramsCollection.storeCityCode = data.parentNode[1].value
                        _this.paramsCollection.cityCode = data.parentNode[1].value
                        _this.paramsCollection.cityName = data.parentNode[1].text
                        _this.baiduaddress = data.parentNode[0].text + data.parentNode[1].text + _this.baiduaddress
                    }
                }else {
                    _this.provinceCityDistrict += data.node.text
                    _this.paramsCollection.cityCode = data.node.value
                    _this.paramsCollection.cityName = data.node.text
                }
            },
            // 设置删除标记
            setIndex(arg) {
                const _this = this
                _this.tempCarIndex = arg
            },
            setFinanceIndex(arg) {
                const _this = this
                _this.tempFinanceIndex = arg
            },  
            // 车型显示新增
            carhandleOk() {
                const _this = this
                let obj = {}
                let submitArr = []
                let option = {
                    serviceCode: config.storeManage.carseq
                }
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {
                        if(_this.carshowId != '') {
                            obj.id = _this.carshowId
                        }
                        obj.storeCarCode = res.data.obj
                        obj.storeCode = _this.paramsCollection.storeCode
                        obj.factoryCode = _this.tempCarData.factoryCode
                        obj.brandCode = _this.tempCarData.brandCode
                        obj.iotypeCode = _this.tempCarData.ioTypeCode
                        obj.modelCode = _this.tempCarData.modelCode
                        obj.opvCode = _this.tempCarData.opvCode
                        obj.seriesCode = _this.tempCarData.seriesCode
                        obj.factoryName = _this.tempCarData.factoryName
                        obj.brandName = _this.tempCarData.brandName
                        obj.iotypeName = _this.tempCarData.ioTypeName
                        obj.modelName = _this.tempCarData.modelName
                        obj.opvName = _this.tempCarData.opvName
                        obj.seriesName = _this.tempCarData.seriesName
                        submitArr.push(obj)
                        api.storeManage.updateCar(submitArr, (res) => {
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'info',
                                    message: '操作成功'
                                })
                                
                                let optionArr = {
                                    storeCodeSet: []
                                }
                                optionArr.storeCodeSet.push(_this.paramsCollection.storeCode)
                                _this.getCarData(optionArr)
                            }
                        })
                    }
                })
            },
            callBack(data) {
                const _this = this
                _this.tempCarData = data
                let option = {
                    factoryCode: data.factoryCode,
                    brandCode: data.brandCode,
                    seriesCode: data.seriesCode,
                    modelCode: data.modelCode,
                    opvCode: data.opvCode,
                    ioTypeCode: data.ioTypeCode
                }
                // api.storeManage.getCarStyles(option, (res) => {
                //     if(res.data.code === 'success') {
                //         for(let i = 0; i< res.data.obj.length; i++) {
                //             // let obj = {}
                //             // obj.value = res.data.obj[i].
                //         }
                //     }
                // })
            },
            carclearName() {

            },
            // 财务信息新增
            financehandleOk() {
                const _this = this
                let obj = {}
                let submitArr = []
                let option = {
                    'serviceCode': config.storeManage.financeseq
                }
                api.ordinalInfo.getSequence(option, (res) => {
                        if(res.data.code === 'success') {
                            obj.financeCode = res.data.obj
                            obj.storeCode = _this.paramsCollection.storeCode
                            obj.invoiceTypeCode = _this.queryFinance.ticketType
                            obj.invoiceTitle = _this.queryFinance.ticketHead
                            obj.taxRegistrationNumber = _this.queryFinance.taxCode
                            obj.businessAddress = _this.queryFinance.address
                            obj.bankAccount = _this.queryFinance.account
                            obj.bankName = _this.queryFinance.bank
                            obj.enterprisePhoneNumber = _this.queryFinance.phone
                            submitArr.push(obj)
                            api.storeManage.updateFinance(submitArr, (res) => {
                                if(res.data.code === 'success') {
                                    _this.queryFinance = {
                                        ticketHead: '',
                                        ticketType: '',
                                        taxCode: '',
                                        address: '',
                                        account: '',
                                        bank: '',
                                        phone: ''
                                    }
                                    let option = {
                                        storeCode: _this.paramsCollection.storeCode
                                    }
                                    _this.getFinanceData(option)
                                }
                            })
                        }
                    })
            },
            financeclearName() {

            },
            orgClickarea() {
                const _this = this
                if(_this.hasSaved || _this.isJustShow) {
                    return
                }else {
                    _this.orgShowarea = !_this.orgShowarea
                    _this.orgShow = false
                }
            },
            orgLoadarea(node, resolve) {
                if (node.level === 0) {
                    api.getSalesAreaInfoByUserAvailableAllLevel((res) => {
                        if (res.data.code === 'success') {
                            let obj = res.data.obj;
                            let arr = [{
                                id: 0,
                                name: obj[0].areaName,
                                code: obj[0].areaCode
                            }];
                            return resolve(arr);
                        }
                    })
                } else {
                    let params = { areaCode: node.data.code };
                    api.area.getSalesAreaInfoByAreaCode(params, (res) => {
                        if (res.data.code === 'success') {
                            let items = res.data.obj.salesAreaSubInfo;
                            let arr = [];
                            if (items !== null) {
                                items.forEach((item, index) => {
                                    let data = {
                                        name: item.areaName,
                                        code: item.areaCode
                                    }
                                    arr.push(data)
                                })
                            } else {
                                return resolve([])
                            }
                            return resolve(arr)
                        }
                    })
                }
            },
            orgItemClickarea(data) {
                const _this = this
                _this.paramsCollection.areaName = data.name
                _this.paramsCollection.areaCode = data.code
                _this.orgShowarea = false
            },
            // 组织方法
            orgClick() {
                const _this = this
                if(_this.hasSaved || _this.isJustShow) {
                    return
                }else {
                    _this.orgShow = !_this.orgShow
                    _this.orgShowarea = false
                }
                
            },
            orgLoad(node, resolve) {
                if (node.level === 0) {
                    let params = { orgCode: config.areaRoot.org };
                    api.area.getOrg(params).then(res => {
                        if (res.data.code === 'success') {
                            let obj = res.data.obj;
                            let arr = [{
                                id: 0,
                                name: obj.orgName,
                                code: obj.orgCode
                            }];
                            return resolve(arr);
                        }
                    })
                } else {
                    let params = { orgCode: node.data.code };
                    api.area.getOrg(params).then(res => {
                        if (res.data.code === 'success') {
                            let items = res.data.obj.childOrganizations;
                            let arr = [];
                            if (items !== null) {
                                items.forEach((item, index) => {
                                    let data = {
                                        name: item.orgName,
                                        code: item.orgCode
                                    }
                                    arr.push(data)
                                })
                            } else {
                                return resolve([])
                            }
                            return resolve(arr)
                        }
                    })
                }
            },
            orgItemClick(data) {
                const _this = this
                _this.paramsCollection.orgName = data.name
                _this.paramsCollection.orgCode = data.code
                _this.orgShow = false
            },
            // 获取门店的业务编码
            getStoreCode() {
                const _this = this
                let option = {
                    serviceCode: config.storeManage.seq
                }
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {
                        _this.paramsCollection.storeCode = res.data.obj
                    }
                })
            },
            add() {
                const _this = this
                let timeTemp = {}
                let judge = false
                // debugger
                // 门店名称校验
                if(_this.paramsCollection.storeName === '') {
                    _this.stateControl.storeName = false
                    judge = true
                }else {
                    _this.stateControl.storeName = null
                }
                // 门店缩写校验
                if(_this.paramsCollection.storeAddrName === '') {
                    _this.stateControl.storeAddName = false
                    judge = true
                }else {
                    _this.stateControl.storeAddName = null
                }
                // 组织校验
                if(_this.paramsCollection.orgName === '') {
                    _this.stateControl.orgName = false
                    judge = true
                }else {
                    _this.stateControl.orgName = null
                }
                // 销售区域校验
                if(_this.paramsCollection.areaName === '') {
                    _this.stateControl.saleName = false
                    judge = true
                }else {
                    _this.stateControl.saleName = null
                }
                // 门店类型校验
                if(_this.paramsCollection.storeType === '') {
                    _this.stateControl.storeType = false
                    judge = true
                }else {
                    _this.stateControl.storeType = null
                }
                // 门店状态校验
                if(_this.paramsCollection.storeState === '') {
                    _this.stateControl.status = false
                    judge = true
                }else {
                    _this.stateControl.status = null
                }
                // 详细地址校验
                if(_this.paramsCollection.address === '') {
                    _this.stateControl.detailAddress = false
                    judge = true
                }else {
                    _this.stateControl.detailAddress = null
                }
                // 经纬度校验
                if(_this.paramsCollection.xPosition === '') {
                    _this.stateControl.xPoint = false
                    judge = true
                }else {
                    _this.stateControl.xPoint = null
                }
                if(_this.paramsCollection.yPosition === '') {
                    _this.stateControl.yPoint = false
                    judge = true
                }else {
                    _this.stateControl.yPoint = null
                }
                // 行政区域校验
                if(_this.paramsCollection.cityName === '') {
                    _this.stateControl.storeAddress = true
                    judge = true
                }else {
                    _this.stateControl.storeAddress = null
                }
                // 开业时间校验
                if(_this.tempTime === '') {
                    _this.stateControl.timeStart = true
                    judge = true
                }else {
                    _this.stateControl.timeStart = false
                }
                
                if(judge) {
                    return;
                }


                if(_this.hourTime != '') {
                    timeTemp = common.formattingTime2(_this.hourTime)
                }
                let addObj = {
                    "id": _this.paramsCollection.id,
                    "businessEndTime": timeTemp.endTime,
                    "businessStartTime": timeTemp.startTime, 
                    "chinaAreaCodes": [
                        ""
                    ],
                    "chinaCityCode": _this.paramsCollection.cityCode,
                    "chinaCityName": _this.paramsCollection.cityName,
                    "contactMobile": _this.business.phone,
                    "contactPerson": _this.business.person,
                    "contactPhone": _this.business.tel,
                    "displayOnline": "",
                    "email": _this.business.mail,
                    "enterpriseLevelCode": _this.product.type,
                    "enterpriseLevelName": "",
                    "externalCode": "",
                    "faxNumber": _this.business.fax,
                    "isFcForcedQuote": _this.business.isFcForcedQuote == false ? 0 : 1,
                    "isDeleted": _this.paramsCollection.storeState,
                    "labourHourToMinutes": _this.product.coefficient === '' ? 60 : _this.product.coefficient,
                    "labourHourUnitPrice": _this.product.unit === '' ? 50 : _this.product.unit,
                    "needPageFlag": "",
                    "openHours": common.eleTimeFormat(_this.tempTime),
                    "orgCode": _this.paramsCollection.orgCode,
                    "orgName": _this.paramsCollection.orgName,
                    "pageNums": 0,
                    "pageStart": 0,
                    "prefixValue": "",
                    "purchasingAreaCode": "",
                    "purchasingAreaName": "",
                    "relationType": [
                        ""
                    ],
                    "remark": "",
                    "salesAreaCodes": [
                        ""
                    ],
                    "salesCode": _this.paramsCollection.areaCode,
                    "salesName": _this.paramsCollection.areaName,
                    "simpleStoreAddInfoMaps": {},
                    "storeAddInfoMaps": {},
                    "storeAddrName": _this.paramsCollection.storeAddrName,
                    "storeAddress": _this.paramsCollection.address,
                    "storeCityCode": _this.paramsCollection.cityCode,
                    "storeCityName": _this.paramsCollection.cityName,
                    "storeCode": _this.paramsCollection.storeCode,
                    "storeDistrictCode": _this.paramsCollection.storeDistrictCode,
                    "storeDistrictName": _this.paramsCollection.storeDistrictName,
                    "storeLifeType": "",
                    "storeLocalX": _this.paramsCollection.xPosition,
                    "storeLocalY": _this.paramsCollection.yPosition,
                    "storeName": _this.paramsCollection.storeName,
                    "storePostcode": _this.paramsCollection.storePostcode,
                    "storeProvinceCode": _this.paramsCollection.storeProvinceCode,
                    "storeProvinceName": _this.paramsCollection.storeProvinceName,
                    "storeType": _this.paramsCollection.storeType,
                    "storeTypeName": ""
                    }
                    api.storeManage.addStore(addObj, (res) => {
                        if(res.data.code === 'success') {
                            _this.isShowChange = true
                            _this.isShowSave = false
                            _this.hasSaved = true
                            let option = {
                                storeCode: _this.paramsCollection.storeCode
                                // storeCode: 'STORE2000424'
                            }
                            // _this.isShowSaveAgain = true
                            api.storeManage.queryByCode(option, (res) => {
                                if(res.data.code === 'success') {
                                    _this.paramsCollection.id = res.data.obj.id
                                }
                            })
                        }
                    })
            },
            addAgain() {
                const _this = this
                // _this.isShowSaveAgain = true
                let timeTemp = {}
                let judge = false
                // debugger
                if(_this.isShowSaveAgain) {
                    if(_this.business.person === '') {
                        _this.businessControl.person = false
                        judge = true
                    }else {
                        _this.businessControl.person = null
                    }
                    if(_this.business.tel === '') {
                        _this.businessControl.tel = false
                        judge = true
                    }else {
                        _this.businessControl.tel = null
                    }
                    if(_this.business.phone === '') {
                        _this.businessControl.phone = false
                        judge = true
                    }else {
                        _this.businessControl.phone = null
                    }
                    if(_this.hourTime === '') {
                        _this.businessControl.time = true
                        judge = true
                    }else {
                        _this.businessControl.time = false
                    }
                    if(_this.product.type === '') {
                        _this.factoryLevel = false
                        judge = true
                    }else {
                        _this.factoryLevel = null
                    }
                }
                // 门店名称校验
                if(_this.paramsCollection.storeName === '') {
                    _this.stateControl.storeName = false
                    judge = true
                }else {
                    _this.stateControl.storeName = null
                }
                // 门店缩写校验
                if(_this.paramsCollection.storeAddrName === '') {
                    _this.stateControl.storeAddName = false
                    judge = true
                }else {
                    _this.stateControl.storeAddName = null
                }
                // 组织校验
                if(_this.paramsCollection.orgName === '') {
                    _this.stateControl.orgName = false
                    judge = true
                }else {
                    _this.stateControl.orgName = null
                }
                // 销售区域校验
                if(_this.paramsCollection.areaName === '') {
                    _this.stateControl.saleName = false
                    judge = true
                }else {
                    _this.stateControl.saleName = null
                }
                // 门店类型校验
                if(_this.paramsCollection.storeType === '') {
                    _this.stateControl.storeType = false
                    judge = true
                }else {
                    _this.stateControl.storeType = null
                }
                // 门店状态校验
                if(_this.paramsCollection.storeState === '') {
                    _this.stateControl.status = false
                    judge = true
                }else {
                    _this.stateControl.status = null
                }
                // 详细地址校验
                if(_this.paramsCollection.address === '') {
                    _this.stateControl.detailAddress = false
                    judge = true
                }else {
                    _this.stateControl.detailAddress = null
                }
                // 经纬度校验
                if(_this.paramsCollection.xPosition === '') {
                    _this.stateControl.xPoint = false
                    judge = true
                }else {
                    _this.stateControl.xPoint = null
                }
                if(_this.paramsCollection.yPosition === '') {
                    _this.stateControl.yPoint = false
                    judge = true
                }else {
                    _this.stateControl.yPoint = null
                }
                // 行政区域校验
                if(_this.paramsCollection.cityName === '') {
                    _this.stateControl.storeAddress = true
                    judge = true
                }else {
                    _this.stateControl.storeAddress = null
                }
                // 开业时间校验
                if(_this.tempTime === '') {
                    _this.stateControl.timeStart = true
                    judge = true
                }else {
                    _this.stateControl.timeStart = false
                }
                
                if(judge) {
                    return;
                }

                if(_this.hourTime != '') {
                    timeTemp = common.formattingTime2(_this.hourTime)
                }
                let updateData = {
                    "id": _this.paramsCollection.id,
                    "businessEndTime": timeTemp.endTime,
                    "businessStartTime": timeTemp.startTime, 
                    "chinaAreaCodes": [
                        ""
                    ],
                    "chinaCityCode": _this.paramsCollection.cityCode,
                    "chinaCityName": _this.paramsCollection.cityName,
                    "contactMobile": _this.business.phone,
                    "contactPerson": _this.business.person,
                    "contactPhone": _this.business.tel,
                    "displayOnline": "",
                    "email": _this.business.mail,
                    "enterpriseLevelCode": _this.product.type,
                    "enterpriseLevelName": "",
                    "externalCode": "",
                    "faxNumber": _this.business.fax,
                    "isFcForcedQuote": _this.business.isFcForcedQuote == false ? 0 : 1,
                    "isDeleted": _this.paramsCollection.storeState,
                    "labourHourToMinutes": _this.product.coefficient === '' ? 60 : _this.product.coefficient,
                    "labourHourUnitPrice": _this.product.unit === '' ? 50 : _this.product.unit,
                    "needPageFlag": "",
                    "openHours": common.eleTimeFormat(_this.tempTime),
                    "orgCode": _this.paramsCollection.orgCode,
                    "orgName": _this.paramsCollection.orgName,
                    "pageNums": 0,
                    "pageStart": 0,
                    "prefixValue": "",
                    "purchasingAreaCode": "",
                    "purchasingAreaName": "",
                    "relationType": [
                        ""
                    ],
                    "remark": "",
                    "salesAreaCodes": [
                        ""
                    ],
                    "salesCode": _this.paramsCollection.areaCode,
                    "salesName": _this.paramsCollection.areaName,
                    "simpleStoreAddInfoMaps": {},
                    "storeAddInfoMaps": {},
                    "storeAddrName": _this.paramsCollection.storeAddrName,
                    "storeAddress": _this.paramsCollection.address,
                    "storeCityCode": _this.paramsCollection.cityCode,
                    "storeCityName": _this.paramsCollection.cityName,
                    "storeCode": _this.paramsCollection.storeCode,
                    "storeDistrictCode": _this.paramsCollection.storeDistrictCode,
                    "storeDistrictName": _this.paramsCollection.storeDistrictName,
                    "storeLifeType": "",
                    "storeLocalX": _this.paramsCollection.xPosition,
                    "storeLocalY": _this.paramsCollection.yPosition,
                    "storeName": _this.paramsCollection.storeName,
                    "storePostcode": _this.paramsCollection.storePostcode,
                    "storeProvinceCode": _this.paramsCollection.storeProvinceCode,
                    "storeProvinceName": _this.paramsCollection.storeProvinceName,
                    "storeType": _this.paramsCollection.storeType,
                    "storeTypeName": ""
                }
                api.storeManage.updateStore(updateData, (res) => {
                    if(res.data.code === 'success') {
                        Message({
                            type: 'info',
                            message: '保存成功'
                        })
                        _this.hasSaved = true
                        _this.isShowChange = true
                        _this.isShowSaveAgain = false
                    }
                })
            },
            cancel() {
                const _this = this
                _this.$router.push({
                    path: `/storemanage/query`
                })
            },
            // 业务管理保存
            savebusiness() {
                const _this = this
                let timeTemp = {}
                let judge = false
                if(_this.isShowSaveAgain) {
                    // 门店名称校验
                    if(_this.paramsCollection.storeName === '') {
                        _this.stateControl.storeName = false
                        judge = true
                    }else {
                        _this.stateControl.storeName = null
                    }
                    // 门店缩写校验
                    if(_this.paramsCollection.storeAddrName === '') {
                        _this.stateControl.storeAddName = false
                        judge = true
                    }else {
                        _this.stateControl.storeAddName = null
                    }
                    // 组织校验
                    if(_this.paramsCollection.orgName === '') {
                        _this.stateControl.orgName = false
                        judge = true
                    }else {
                        _this.stateControl.orgName = null
                    }
                    // 销售区域校验
                    if(_this.paramsCollection.areaName === '') {
                        _this.stateControl.saleName = false
                        judge = true
                    }else {
                        _this.stateControl.saleName = null
                    }
                    // 门店类型校验
                    if(_this.paramsCollection.storeType === '') {
                        _this.stateControl.storeType = false
                        judge = true
                    }else {
                        _this.stateControl.storeType = null
                    }
                    // 门店状态校验
                    if(_this.paramsCollection.storeState === '') {
                        _this.stateControl.status = false
                        judge = true
                    }else {
                        _this.stateControl.status = null
                    }
                    // 详细地址校验
                    if(_this.paramsCollection.address === '') {
                        _this.stateControl.detailAddress = false
                        judge = true
                    }else {
                        _this.stateControl.detailAddress = null
                    }
                    // 经纬度校验
                    if(_this.paramsCollection.xPosition === '') {
                        _this.stateControl.xPoint = false
                        judge = true
                    }else {
                        _this.stateControl.xPoint = null
                    }
                    if(_this.paramsCollection.yPosition === '') {
                        _this.stateControl.yPoint = false
                        judge = true
                    }else {
                        _this.stateControl.yPoint = null
                    }
                    // 行政区域校验
                    if(_this.paramsCollection.cityName === '') {
                        _this.stateControl.storeAddress = true
                        judge = true
                    }else {
                        _this.stateControl.storeAddress = null
                    }
                    // 开业时间校验
                    if(_this.tempTime === '') {
                        _this.stateControl.timeStart = true
                        judge = true
                    }else {
                        _this.stateControl.timeStart = false
                    }

                    if(_this.product.type === '') {
                        _this.factoryLevel = false
                        judge = true
                    }else {
                        _this.factoryLevel = null
                    }
                }
                if(_this.business.person === '') {
                    _this.businessControl.person = false
                    judge = true
                }else {
                    _this.businessControl.person = null
                }
                if(_this.business.tel === '') {
                    _this.businessControl.tel = false
                    judge = true
                }else {
                    _this.businessControl.tel = null
                }
                if(_this.business.phone === '') {
                    _this.businessControl.phone = false
                    judge = true
                }else {
                    _this.businessControl.phone = null
                }
                if(_this.hourTime === '') {
                    _this.businessControl.time = true
                    judge = true
                }else {
                    _this.businessControl.time = false
                }
                if(judge) {
                    return
                }
                if(_this.hourTime != '') {
                    timeTemp = common.formattingTime2(_this.hourTime)
                }
                let updateData = {
                    "id": _this.paramsCollection.id,
                    "businessEndTime": timeTemp.endTime,
                    "businessStartTime": timeTemp.startTime, 
                    "chinaAreaCodes": [
                        ""
                    ],
                    "chinaCityCode": _this.paramsCollection.cityCode,
                    "chinaCityName": _this.paramsCollection.cityName,
                    "contactMobile": _this.business.phone,
                    "contactPerson": _this.business.person,
                    "contactPhone": _this.business.tel,
                    "displayOnline": "",
                    "email": _this.business.mail,
                    "enterpriseLevelCode": _this.product.type,
                    "enterpriseLevelName": "",
                    "externalCode": "",
                    "faxNumber": _this.business.fax,
                    "isFcForcedQuote": _this.business.isFcForcedQuote == false ? 0 : 1,
                    "isDeleted": _this.paramsCollection.storeState,
                    "labourHourToMinutes": _this.product.coefficient === '' ? 60 : _this.product.coefficient,
                    "labourHourUnitPrice": _this.product.unit === '' ? 50 : _this.product.unit,
                    "needPageFlag": "",
                    "openHours": common.eleTimeFormat(_this.tempTime),
                    "orgCode": _this.paramsCollection.orgCode,
                    "orgName": _this.paramsCollection.orgName,
                    "pageNums": 0,
                    "pageStart": 0,
                    "prefixValue": "",
                    "purchasingAreaCode": "",
                    "purchasingAreaName": "",
                    "relationType": [
                        ""
                    ],
                    "remark": "",
                    "salesAreaCodes": [
                        ""
                    ],
                    "salesCode": _this.paramsCollection.areaCode,
                    "salesName": _this.paramsCollection.areaName,
                    "simpleStoreAddInfoMaps": {},
                    "storeAddInfoMaps": {},
                    "storeAddrName": _this.paramsCollection.storeAddrName,
                    "storeAddress": _this.paramsCollection.address,
                    "storeCityCode": _this.paramsCollection.cityCode,
                    "storeCityName": _this.paramsCollection.cityName,
                    "storeCode": _this.paramsCollection.storeCode,
                    "storeDistrictCode": _this.paramsCollection.storeDistrictCode,
                    "storeDistrictName": _this.paramsCollection.storeDistrictName,
                    "storeLifeType": "",
                    "storeLocalX": _this.paramsCollection.xPosition,
                    "storeLocalY": _this.paramsCollection.yPosition,
                    "storeName": _this.paramsCollection.storeName,
                    "storePostcode": _this.paramsCollection.storePostcode,
                    "storeProvinceCode": _this.paramsCollection.storeProvinceCode,
                    "storeProvinceName": _this.paramsCollection.storeProvinceName,
                    "storeType": _this.paramsCollection.storeType,
                    "storeTypeName": ""
                }
                api.storeManage.updateStore(updateData, (res) => {
                    if(res.data.code === 'success') {
                        Message({
                            type: 'info',
                            message: '保存成功'
                        })
                    }
                })
            },
            getBusinessLevel() {
                const _this = this
                let option = {
                    pageNums: config.pageNums,
                    pageStart: 1,
                    refCode: "RepairCompanyLevel"
                }
                api.ref.getDataDictionarys(option, (res) => {
                    if(res.data.code === 'success') {
                        let array = res.data.obj.referenceDetailInfos
                        for(let i = 0; i<array.length; i++) {
                            let obj = {}
                            obj.text = array[i].refDetailName
                            obj.value = array[i].refDetailCode
                            _this.businesslist.push(obj)
                        }  
                    }
                }) 
            },
            // 发票类型的数据
            getTicketType() {
                const _this = this
                let option = {
                    // pageNums: config.pageNums,
                    // pageStart: 1,
                    refCode: config.storeManage.refCode
                }
                api.ref.getDataDictionarys(option, (res) => {
                    if(res.data.code === 'success') {
                        let array = res.data.obj.referenceDetailInfos
                        for(let i = 0; i<array.length; i++) {
                            let obj = {}
                            obj.text = array[i].refDetailName
                            obj.value = array[i].refDetailCode
                            _this.ticketTypelist.push(obj)
                        }     
                    }
                })
            },
            // 车间生产保存
            savecar() {
                const _this = this
                let timeTemp = {}
                
                if(_this.hourTime != '') {
                    timeTemp = common.formattingTime2(_this.hourTime)
                }
                let judge = false
                if(_this.isShowSaveAgain) {
                    if(_this.business.person === '') {
                        _this.businessControl.person = false
                        judge = true
                    }else {
                        _this.businessControl.person = null
                    }
                    if(_this.business.tel === '') {
                        _this.businessControl.tel = false
                        judge = true
                    }else {
                        _this.businessControl.tel = null
                    }
                    if(_this.business.phone === '') {
                        _this.businessControl.phone = false
                        judge = true
                    }else {
                        _this.businessControl.phone = null
                    }
                    if(_this.hourTime === '') {
                        _this.businessControl.time = true
                        judge = true
                    }else {
                        _this.businessControl.time = false
                    }
                    // 门店名称校验
                    if(_this.paramsCollection.storeName === '') {
                        _this.stateControl.storeName = false
                        judge = true
                    }else {
                        _this.stateControl.storeName = null
                    }
                    // 门店缩写校验
                    if(_this.paramsCollection.storeAddrName === '') {
                        _this.stateControl.storeAddName = false
                        judge = true
                    }else {
                        _this.stateControl.storeAddName = null
                    }
                    // 组织校验
                    if(_this.paramsCollection.orgName === '') {
                        _this.stateControl.orgName = false
                        judge = true
                    }else {
                        _this.stateControl.orgName = null
                    }
                    // 销售区域校验
                    if(_this.paramsCollection.areaName === '') {
                        _this.stateControl.saleName = false
                        judge = true
                    }else {
                        _this.stateControl.saleName = null
                    }
                    // 门店类型校验
                    if(_this.paramsCollection.storeType === '') {
                        _this.stateControl.storeType = false
                        judge = true
                    }else {
                        _this.stateControl.storeType = null
                    }
                    // 门店状态校验
                    if(_this.paramsCollection.storeState === '') {
                        _this.stateControl.status = false
                        judge = true
                    }else {
                        _this.stateControl.status = null
                    }
                    // 详细地址校验
                    if(_this.paramsCollection.address === '') {
                        _this.stateControl.detailAddress = false
                        judge = true
                    }else {
                        _this.stateControl.detailAddress = null
                    }
                    // 经纬度校验
                    if(_this.paramsCollection.xPosition === '') {
                        _this.stateControl.xPoint = false
                        judge = true
                    }else {
                        _this.stateControl.xPoint = null
                    }
                    if(_this.paramsCollection.yPosition === '') {
                        _this.stateControl.yPoint = false
                        judge = true
                    }else {
                        _this.stateControl.yPoint = null
                    }
                    // 行政区域校验
                    if(_this.paramsCollection.cityName === '') {
                        _this.stateControl.storeAddress = true
                        judge = true
                    }else {
                        _this.stateControl.storeAddress = null
                    }
                    // 开业时间校验
                    if(_this.tempTime === '') {
                        _this.stateControl.timeStart = true
                        judge = true
                    }else {
                        _this.stateControl.timeStart = false
                    }
                }
                if(_this.product.type === '') {
                    _this.factoryLevel = false
                    judge = true
                }else {
                    _this.factoryLevel = null
                }
                if(judge) {
                    return
                }
                let updateData = {
                    "id": _this.paramsCollection.id,
                    "businessEndTime": timeTemp.endTime,
                    "businessStartTime": timeTemp.startTime, 
                    "chinaAreaCodes": [
                        ""
                    ],
                    "chinaCityCode": _this.paramsCollection.cityCode,
                    "chinaCityName": _this.paramsCollection.cityName,
                    "contactMobile": _this.business.phone,
                    "contactPerson": _this.business.person,
                    "contactPhone": _this.business.tel,
                    "displayOnline": "",
                    "email": _this.business.mail,
                    "enterpriseLevelCode": _this.product.type,
                    "enterpriseLevelName": "",
                    "externalCode": "",
                    "faxNumber": _this.business.fax,
                    "isFcForcedQuote": _this.business.isFcForcedQuote == false ? 0 : 1,
                    "isDeleted": _this.paramsCollection.storeState,
                    "labourHourToMinutes": _this.product.coefficient === '' ? 60 : _this.product.coefficient,
                    "labourHourUnitPrice": _this.product.unit === '' ? 50 : _this.product.unit,
                    "needPageFlag": "",
                    "openHours": common.eleTimeFormat(_this.tempTime),
                    "orgCode": _this.paramsCollection.orgCode,
                    "orgName": _this.paramsCollection.orgName,
                    "pageNums": 0,
                    "pageStart": 0,
                    "prefixValue": "",
                    "purchasingAreaCode": "",
                    "purchasingAreaName": "",
                    "relationType": [
                        ""
                    ],
                    "remark": "",
                    "salesAreaCodes": [
                        ""
                    ],
                    "salesCode": _this.paramsCollection.areaCode,
                    "salesName": _this.paramsCollection.areaName,
                    "simpleStoreAddInfoMaps": {},
                    "storeAddInfoMaps": {},
                    "storeAddrName": _this.paramsCollection.storeAddrName,
                    "storeAddress": _this.paramsCollection.address,
                    "storeCityCode": _this.paramsCollection.cityCode,
                    "storeCityName": _this.paramsCollection.cityName,
                    "storeCode": _this.paramsCollection.storeCode,
                    "storeDistrictCode": _this.paramsCollection.storeDistrictCode,
                    "storeDistrictName": _this.paramsCollection.storeDistrictName,
                    "storeLifeType": "",
                    "storeLocalX": _this.paramsCollection.xPosition,
                    "storeLocalY": _this.paramsCollection.yPosition,
                    "storeName": _this.paramsCollection.storeName,
                    "storePostcode": _this.paramsCollection.storePostcode,
                    "storeProvinceCode": _this.paramsCollection.storeProvinceCode,
                    "storeProvinceName": _this.paramsCollection.storeProvinceName,
                    "storeType": _this.paramsCollection.storeType,
                    "storeTypeName": ""
                }
                api.storeManage.updateStore(updateData, (res) => {
                    if(res.data.code === 'success') {
                        Message({
                            type: 'info',
                            message: '保存成功'
                        })
                    }
                })
            },
            buildfinance() {
                const _this = this
                _this.queryFinance.address = _this.paramsCollection.address
                _this.queryFinance.ticketHead = _this.paramsCollection.storeName
                _this.queryFinance.phone = _this.business.phone
                _this.financeModel = true
            },
            // 财务信息删除
            deletefinance() {
                const _this = this
                let submit = []
                if(_this.tempFinanceIndex === '') {
                    Message({
                        type: 'warning',
                        message: '请选择删除项'
                    })
                    return
                }
                let obj = _this.tablelistfinance[_this.tempFinanceIndex]
                obj.isDeleted = 1
                submit.push(obj)
                api.storeManage.updateFinance(submit, (res) => {
                    if(res.data.code === 'success') {
                        let option = {
                            storeCode: _this.paramsCollection.storeCode
                        }
                        _this.tempFinanceIndex = ''
                        _this.getFinanceData(option)
                    }
                })
            },
            buildcarshow() {
                const _this = this
                _this.carModel = true
                _this.$refs.car.clear()
            },
            // 车型显示删除
            deletecarshow() {
                const _this = this
                let submit = []
                if(_this.tempCarIndex === '') {
                    Message({
                        type: 'warning',
                        message: '请选择删除项'
                    })
                    return;
                }
                let obj = _this.tablecarshow[_this.tempCarIndex]
                obj.isDeleted = 1
                submit.push(obj)
                api.storeManage.updateCar(submit, (res) => {
                    if(res.data.code === 'success') {
                        _this.tempCarIndex = ''
                        let option = {
                            storeCodeSet: []
                        }
                        option.storeCodeSet.push(_this.paramsCollection.storeCode)        
                        _this.getCarData(option)
                    }
                })
            },
            getUrlCode() {
                const _this = this
                let tempCode = _this.$route.params.code
                if(tempCode === '0') {// 新增门店
                    _this.getStoreCode()
                }else {
                    let judge = tempCode.indexOf('show')
                    if(judge === -1) {// 编辑门店
                        _this.isShowSaveAgain = true
                        let arg  = tempCode
                        let option = {
                            storeCode: arg
                        }
                        _this.getMainData(option)
                        _this.getFinanceData(option)
                        let optionArr = {
                            storeCodeSet: []
                        }
                        optionArr.storeCodeSet.push(arg)
                        _this.getCarData(optionArr)
                        _this.getStoreAddInfo(arg)
                        
                    }else {// 仅仅查看的内容
                        let arg = tempCode.substr(0, tempCode.length - 4)
                        let option = {
                            storeCode: arg
                        }
                        _this.getMainData(option)
                        _this.getFinanceData(option)
                        let optionArr = {
                            storeCodeSet: []
                        }
                        optionArr.storeCodeSet.push(arg)
                        _this.getCarData(optionArr)
                        _this.isJustShow = true
                         _this.getStoreAddInfo(arg)
                    }
                }
            },
            //  获取主表信息 包括 业务管理和车间生产
            getMainData(arg) {
                const _this = this
                api.storeManage.queryByCode(arg, (res) => {
                    if(res.data.code === 'success') {
                        _this.paramsCollection = {
                            id: res.data.obj.id,
                            storeCode: res.data.obj.storeCode,
                            storeName: res.data.obj.storeName,
                            storeAddrName: res.data.obj.storeAddrName,
                            businessStartTime: res.data.obj.businessStartTime,
                            businessEndTime: res.data.obj.businessEndTime,
                            orgCode: res.data.obj.orgCode,
                            orgName: res.data.obj.orgName,
                            storeType: res.data.obj.storeType,
                            storeState: res.data.obj.isDeleted,
                            areaCode: res.data.obj.salesCode,
                            areaName: res.data.obj.salesName,
                            xPosition: res.data.obj.storeLocalX,
                            yPosition: res.data.obj.storeLocalY,
                            address: res.data.obj.storeAddress,
                            cityCode: res.data.obj.chinaCityCode,
                            cityName: res.data.obj.chinaCityName,
                            storePostcode: res.data.obj.storePostcode,
                            storeProvinceCode: res.data.obj.storeProvinceCode,
                            storeProvinceName: res.data.obj.storeProvinceName,
                            storeCityCode: res.data.obj.chinaCityCode,
                            storeCityName: res.data.obj.chinaCityName,
                            storeDistrictCode: res.data.obj.storeDistrictCode,
                            storeDistrictName: res.data.obj.storeDistrictName
                        }
                        _this.business =  {
                            person: res.data.obj.contactPerson,
                            tel: res.data.obj.contactPhone,
                            phone: res.data.obj.contactMobile,
                            fax: res.data.obj.faxNumber,
                            mail: res.data.obj.email,
                            isFcForcedQuote: res.data.obj.isFcForcedQuote === 0 ? false : true,
                            startTime: '',
                            endTime: ''  
                        }
                        // _this.hourTime = []
                        // _this.hourTime.push(res.data.obj.businessStartTime)
                        // _this.hourTime.push(res.data.obj.businessEndTime)
                        let startTime = res.data.obj.businessStartTime
                        let endTime = res.data.obj.businessEndTime
                        let startTimeArr 
                        let endTimeArr
                        if(startTime) {
                            startTimeArr = startTime.split(':')
                        }
                        if(endTime) {
                            endTimeArr = endTime.split(':')
                        }
                        // let startTimeArr = startTime.split(':')
                        // let endTimeArr = endTime.split(':')
                        if(startTime&&endTime) {
                            let currentDate = new Date()
                            let year = currentDate.getFullYear()
                            let month = currentDate.getMonth()
                            let day = currentDate.getDate()
                            _this.hourTime = [new Date(year, month, day, startTimeArr[0]-0, startTimeArr[1]-0, startTimeArr[2] -0), new Date(year, month, day, endTimeArr[0]-0, endTimeArr[1]-0, endTimeArr[2] - 0)]
                        }
                        _this.businessStartTime = res.data.obj.businessStartTime
                        _this.businessEndTime = res.data.obj.businessEndTime
                        _this.product = {
                            type: res.data.obj.enterpriseLevelCode,
                            coefficient: res.data.obj.labourHourToMinutes === null ? 60 : res.data.obj.labourHourToMinutes,
                            unit: res.data.obj.labourHourUnitPrice === null ? 50 : res.data.obj.labourHourUnitPrice
                        }
                        // 组装省市区
                        _this.provinceCityDistrict = res.data.obj.storeProvinceName + res.data.obj.chinaCityName + res.data.obj.storeDistrictName
                        _this.chineareaDefault = {
                            text: res.data.obj.storeCityName,
                            value: res.data.obj.storeCityCode
                        }
                        _this.tempTime = new Date(res.data.obj.openHours)
                        let tempobj= {
                                "displayOnline": "",
                                "enterpriseLevelName": "",
                                "externalCode": "",
                                "needPageFlag": "",
                                "pageNums": 0,
                                "pageStart": 0,
                                "prefixValue": "",
                                "purchasingAreaCode": "",
                                "purchasingAreaName": "",
                                "relationType": [
                                    ""
                                ],
                                "remark": "",
                                "salesAreaCodes": [
                                    ""
                                ],
                                "simpleStoreAddInfoMaps": {},
                                "storeAddInfoMaps": {},
                                "storeDistrictCode": "",
                                "storeDistrictName": "",
                                "storeLifeType": "",
                                "storePostcode": "",
                                "storeProvinceCode": "",
                                "storeProvinceName": "",
                            }
                    }
                })
            },
            // 获取门店类型数据字典项
            getStoreTypeList() {
                const _this = this
                let option = {
                    refCode: config.storeManage.storeTypeRef
                }
                api.ref.getDataDictionarys(option, res => {
                    if(res.data.code === 'success') {
                        let arr = res.data.obj.referenceDetailInfos
                        arr.forEach(element => {
                            let obj = {}
                            obj.text = element.refDetailName
                            obj.value = element.refDetailCode
                            _this.typelist.push(obj)
                        })
                    }
                })
            },
            //  获取财务信息 
            getFinanceData(arg) {
                const _this = this
                api.storeManage.queryFinance(arg, (res) => {
                    if(res.data.code === 'success') {
                         _this.tablelistfinance = res.data.obj
                         let num = 2 - _this.tablelistfinance.length
                         for(let i = 0; i< num; i++){
                             let obj = {}
                             _this.tablelistfinance.push(obj)
                         }
                    }
                })
            },
            //  获取车型显示信息
            getCarData(arg) {
                const _this = this
                arg.isDeleted = 0
                arg.pageNums = 1000
                _this.tablecarshow = []
                api.storeManage.queryCar(arg, (res) => {
                    if(res.data.code === 'success') {
                        _this.tablecarshow = res.data.obj.list
                        let num = 5 - _this.tablecarshow.length
                        for(let i = 0; i< num; i++) {
                            let obj = {}
                            _this.tablecarshow.push(obj)
                        }
                    }
                }) 
            },
            // 根据门店code获取门店附加信息
            getStoreAddInfo(val) {
				const option = {
                    'storeCode': val
                }
				api.storeManage.queryAllInfo(option, (res) => {
                    if(res.data.code === 'success') {
                       if(!res.data.obj.simpleStoreAddInfoMaps) {
                           return;
                       }
                        for(let key of Object.keys(this.storeAddInp)) {
                            res.data.obj.simpleStoreAddInfoMaps[key] = res.data.obj.simpleStoreAddInfoMaps[key] ? res.data.obj.simpleStoreAddInfoMaps[key] : '';
                            if(key == 'MorningAppointment' || key == 'AfternoonAppointment') {
                                if( res.data.obj.simpleStoreAddInfoMaps[key] === '-1') {
                                    this.storeAdd[key] = '';
                                }else {
                                    this.storeAdd[key] = res.data.obj.simpleStoreAddInfoMaps[key];
                                }
                            }else {
                                this.storeAdd[key] = res.data.obj.simpleStoreAddInfoMaps[key];
                            }
                            if(key == 'DaysInAdvance') {
                                if( !res.data.obj.simpleStoreAddInfoMaps[key]) {
                                    this.storeAdd[key] = 0;
                                }else {
                                    this.storeAdd[key] = res.data.obj.simpleStoreAddInfoMaps[key];
                                }
                            }
                            
                        }
                    };
                })			
            },
            // 保存附加信息
            saveStoreAdd() {
                let param = {
                    "id": this.paramsCollection.id,
                    "storeCode": this.paramsCollection.storeCode,
                    "orgCode": this.paramsCollection.orgCode,
                    simpleStoreAddInfoMaps: {},
                }
               let obj = Object.assign({}, this.storeAdd);
               if(obj.MorningAppointment === '') obj.MorningAppointment = -1;
               if(obj.AfternoonAppointment === '') obj.AfternoonAppointment = -1;
               for(let key of Object.keys(this.storeAddInp)) {
                    this.storeAddInp[key] = false;
                   if(obj[key] === '' || obj[key] === undefined) {
                       Message({
                            type: 'warning',
                            message: '门店附加信息未填写完整！'
                        })
                        this.storeAddInp[key] = true;
                        return
                   }
               }
                if(obj.DaysInAdvance < 0){
                    Message({
                        type: 'warning',
                        message: '预约时间范围配置不可小于0！'
                    })
                    this.storeAddInp.DaysInAdvance = true;
                    return
                }
                if(parseFloat(obj.MorningStartTime) > parseFloat(obj.MorningStartTime)){
                    Message({
                        type: 'warning',
                        message: '上午预约开始时间不可小于结束时间！'
                    })
                    this.storeAddInp.MorningStartTime = true;
                    this.storeAddInp.MorningEndTime = true;
                    return
                }
                if(parseFloat(obj.AfternoonStartTime) > parseFloat(obj.AfternoonEndTime)){
                    Message({
                        type: 'warning',
                        message: '下午预约开始时间不可小于结束时间！'
                    })
                    this.storeAddInp.AfternoonStartTime = true;
                    this.storeAddInp.AfternoonEndTime = true;
                    return
                }
                if(obj.MorningAppointment < 0 && obj.MorningAppointment !== -1){
                    Message({
                        type: 'warning',
                        message: '上午预约量不可小于0！'
                    })
                    this.storeAddInp.MorningAppointment = true;
                    return
                }
                if(obj.AfternoonAppointment < 0 && obj.AfternoonAppointment !== -1){
                    Message({
                        type: 'warning',
                        message: '下午预约量不可小于0！'
                    })
                    this.storeAddInp.AfternoonAppointment = true;
                    return
                }
                param.simpleStoreAddInfoMaps = obj;
                api.storeManage.updateStore2(param, (res) => {
                    if(res.data.code === 'success') {
                        Message({
                            type: 'success',
                            message: '保存成功'
                        })
                    }
                })
            },
        },
        created() {
            const _this = this
            // _this.typelist = config.storeManage.typelist
            _this.statelist = config.storeManage.statelist
            _this.getStoreTypeList()
            _this.getUrlCode()
            _this.getBusinessLevel()
            _this.getTicketType()
            _this.loadBMapScript()
           
            
        },
        mounted() {
            // this.loadBMapScript();
            
        },
        watch: {

        }
    }
</script>
<style>
    .store-manage-line-act {
        position: relative;
    }
    .store-manage-line-act::after {
        position: absolute;
        content: '';
        display: block;
        width: 92%;
        height: 1px;
        background-color: #ccc;
        top: 50%;
        left: 54%;
        transform: translate(-50%, -50%);
    }
    .special-select-tree {
        position: absolute;
        margin-top: 6px;
        width: 100%;
        z-index: 1000;
    }
    .special {
        vertical-align: middle !important;
        height: 10px;
    }
    .self_constrol>.el-tree {
        max-height: 300px;
        overflow-y: scroll;
    }
    .financeCard {
        width: 100% !important;
        /* position: relative; */
    }
    .financeCard>p {
        width: 100% !important;
        display: flex;
    }
    .financeCard>p>span {
        flex: 1;
    }
    .financeCard>p:last-child {
        border-bottom: 1px solid #ccc;
    }
    .lastFinanceCard {
        border-bottom: none !important;
    }
    /* .financeCard:nth-last-child(1)>p:last-child {
        border-bottom: 1px solid red;
    } */
    .controlEl_Time .el-input__inner {
        border: 1px solid #ff4949 !important;
    }
    /* .tipsImportant {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 50%;
        background-color: #FF5335;
        width: 20px;
        font-size: 16px;
        color: #fff;
        font-weight: bolder;
    } */
    .input-append-t{
        position: absolute;
        margin-top: 10px;
        margin-left: -20px;
    }
    .input-append-y-t{
        position: absolute;
        right: -16px;
        top: 8px;
    }
</style>

