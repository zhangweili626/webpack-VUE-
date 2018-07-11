<template>
    <div class="precheck">
        <!-- 表头 -->
        <el-row class="head">
            <el-col 
                v-for="(item, index) in headInfo" 
                v-if="(index == 3 && item.text || index < 3)"
                :key="index"
            >
                <label>{{`${item.label}：`}}</label>
                <span>{{item.text}}</span>
            </el-col>
        </el-row>
        <!-- 车主信息 -->
        <div class="base-css">
            <h3>车主信息</h3>
            <el-row class="base-row">
                <el-col v-for="(item, index) in ownerInfo" :key="index" :span="9">
                    <label>{{item.label}}</label>
                    <el-input
                        v-model="item.text"
                        :value="item.text" 
                        :placeholder="`请输入${item.label}`"
                        :disabled="orderStatus == 1 ? true : false"
                        :autofocus="(index == 2 && !precheckNo) ? true : false"
                        @blur="index >= 2 && searchTel(index)"
                    />
                </el-col>
            </el-row>
        </div>
        <!-- 车辆信息 -->
        <div class="base-css">
            <h3>车辆信息</h3>
            <el-row class="base-row">
                <el-col v-for="(item, index) in carInfo" v-if="index < 4" :key="index" :span="9">
                    <label>{{item.label}}</label>
                    <el-input
                        v-model="item.text" 
                        :class="index == 2 && 'hidden'"
                        :title="index == 2 && item.text"
                        :placeholder="index ==0 ? `请输入${item.label}` : ''"
                        :disabled="index != 0 ? true : orderStatus == 1 ? true : false" 
                        @blur="index == 0 && searchPlate()" 
                    />
                </el-col>
            </el-row>
            <div class="fuel">
                <label>{{fuel.verbalTrick}}</label>
                <el-slider 
                    v-model="fuel.checkResultRemark" 
                    :step="10" 
                    :format-tooltip="formatTooltip" 
                    :disabled="orderStatus == 1 ? true : false" 
                />
            </div>
            <div class="rate">
                <span>E</span>
                <span>1/2</span>
                <span>F</span>
            </div>
            <el-row class="radio">
                <el-col v-for="(item, index) in carRadio" :key="index">
                    <label>{{item.verbalTrick}}</label>
                    <el-radio 
                        v-for="(el, i) in item.infoMap" 
                        v-model="item.checkResultCode" 
                        :key="i"
                        :label="i"
                        :disabled="orderStatus == 1 ? true : false"
                    > 
                        {{el}}
                    </el-radio>
                    <template v-if="index == 0">
                        <label>备胎信息</label>
                        <el-button class="picker" @click.native="showTyre(spareTyre)">
                            <span v-for="(item, index) in spareTyre" v-if="index < 4" :key="index">
                                {{item.checkResultName}}
                            </span>
                        </el-button>
                        <el-button class="picker" @click.native="showTyre(spareTyre)">
                            <span v-for="(item, index) in spareTyre" v-if="index >= 4" :key="index">
                                {{item.checkResultName}}
                            </span>
                        </el-button>
                    </template>
                    <template v-if="fireDate.verbalTrick != '' && index == 3">
                        <label>{{fireDate.verbalTrick}}</label>
                        <el-date-picker
                            class="date-picker"
                            type="date" 
                            placeholder="选择日期"
                            v-model="fireDate.checkResultRemark" 
                            :disabled="orderStatus == 1 || (carRadio[3].checkResultCode == 'checkResult2') ? true : false"
                        />
                    </template>
                </el-col>
            </el-row>
        </div>
        <!-- 热点信息 -->
        <div class="hot-info base-css">
            <h3>热点信息</h3>
            <el-row class="base-row resume-wrap">
                <el-col :span="9">
                    <label>{{hotInfo[0].label}}</label>
                    <el-input class="hidden" v-model="hotInfo[0].text" :title="hotInfo[0].text" :disabled="true" />
                </el-col>
                <el-button class="toggle" @click="toggle = !toggle">{{toggle ? '收起' : '展开'}}</el-button>
            </el-row>
            <div v-show="toggle">
                <el-row class="base-row">
                    <el-col 
                        v-for="(item, index) in hotInfo" 
                        :key="index"
                        :span="index < 5 ? (index % 2 ? 9: 15) : 4"
                        v-if="index"
                    >
                        <label>{{item.label}}</label>
                        <el-input
                            v-if="item.type == 'input'"
                            v-model="item.text"
                            :disabled="orderStatus == 1 ? true : false" 
                        />
                        <search
                            ref="searchDate"
                            option="coName"
                            :disabled="orderStatus == 1 ? true : false" 
                            :dataList="datalist"
                            @dataChange="queryHandle"
                            @itemValue="itemHandle"
                            @clickShowBack="firstLoad"
                            @clearValue="clearValue"
                            @comScroll="scrollBottom"
                            v-if="(item.type == 'select') && index == 1"
                        />
                        <search
                            ref="_searchDate"
                            option="coName"
                            :disabled="orderStatus == 1 ? true : false" 
                            :dataList="datalist"
                            @dataChange="queryHandle"
                            @itemValue="_itemHandle"
                            @clickShowBack="firstLoad"
                            @clearValue="_clearValue"
                            @comScroll="scrollBottom"
                            v-if="(item.type == 'select') && index == 3"
                        />
                        <el-date-picker
                            class="date-picker"
                            v-if="item.type == 'date'"
                            type="date" 
                            placeholder="选择日期"
                            v-model="item.text"
                            :defaultValue="item.text"
                            :disabled="orderStatus == 1 ? true : false"  
                            @change="editCustVehicle"
                        />
                        <div v-if="index > 4" class="overdue"></div>
                    </el-col>
                </el-row>
                <el-row class="coupon">
                    <el-col :span="6">
                        <div>车主持有卡券</div>
                        <div v-for="(item, index) in maxLength" :key="index">
                            {{ownerCoupon[index] ? ownerCoupon[index].couponName || ownerCoupon[index].cardName : ''}}
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div>车辆持有卡券</div>
                        <div v-for="(item, index) in maxLength" :key="index">
                            {{carCoupon[index] ? carCoupon[index].cardName || carCoupon[index].couponName : ''}}
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 环检 -->
        <div class="check base-css">
            <h3>环检</h3>
            <el-row>
                <el-col :span="12">
                    <el-checkbox 
                        v-model="dirtyCar.selected"
                        :disabled="orderStatus == 1 ? true : false"  
                    >
                        {{dirtyCar.verbalTrick }}
                    </el-checkbox>
                    <div class="car">
                        <canvas id="cans" style="display: none" width="1182" height="1182"></canvas>
                        <img :src="src" alt="" width="100%"  />
                        <svg class="car-svg">
                            <rect 
                                v-for="(item, index) in svgRect" 
                                :key="index"
                                :x="item.x"
                                :y="item.y"
                                :width="item.width"
                                :height="item.height"
                                @click="showCarModel((index+1), item.type)"
                            />
                        </svg>
                    </div>
                    <el-row class="car-service">
                        <el-col class="service-code" :span="8">划痕</el-col>
                        <el-col class="service-name" :span="8">凹痕/飞石</el-col>
                        <el-col class="display-name" :span="8">损伤/撞击</el-col>
                    </el-row>
                </el-col>
                <el-col :span="12">
                    <div class="tyre">
                        <label>前轮胎信息</label>
                        <el-button class="picker" @click.native="showTyre(frontTyre)" >
                            <span v-for="(item, index) in frontTyre" :key="index" v-if="index < 4">
                                {{item.checkResultName}}
                            </span>
                        </el-button>
                        <el-button class="picker" @click.native="showTyre(frontTyre)">
                            <span v-for="(item, index) in frontTyre" :key="index" v-if="index >= 4">
                                {{item.checkResultName}}
                            </span>
                        </el-button>
                    </div>
                    <div class="tyre">
                        <label>后轮胎信息</label>
                        <el-button class="picker" @click.native="showTyre(backTyre)" >
                            <span v-for="(item, index) in backTyre" :key="index" v-if="index < 4">
                                {{item.checkResultName}}
                            </span>
                        </el-button>
                        <el-button class="picker" @click.native="showTyre(backTyre)" >
                            <span v-for="(item, index) in backTyre" :key="index" v-if="index >= 4">
                                {{item.checkResultName}}
                            </span>
                        </el-button>
                    </div>
                    <div class="tyre" v-for="(item, index) in tyreTread" :key="index">
                        <label>{{item.verbalTrick.split('￥')[0]}}</label>
                        <el-input 
                            v-model="item.checkResultRemark" 
                            :disabled="orderStatus == 1 ? true : false" 
                        />
                        <span>{{item.verbalTrick.split('￥')[2]}}</span>
                        <el-checkbox 
                            style="margin-left: 10px"
                            v-model="rims[index].selected" 
                            :disabled="orderStatus == 1 ? true : false"
                        >
                            {{rims[index].verbalTrick}}
                        </el-checkbox>
                    </div>
                    <label class="fast-add">快速服务添加</label>
                    <el-row class="service">
                        <el-col :span="8">服务编码</el-col>
                        <el-col :span="8">服务名称</el-col>
                        <el-col :span="8">显示名称</el-col>
                    </el-row> 
                    <el-row v-for="item in tyreService" :key="item.serviceCode" class="service">
                        <el-col :span="8">
                            <el-checkbox 
                                v-model="item.selected" 
                                :disabled="orderStatus == 1 ? true : false" 
                            />
                            {{item.serviceCode}}
                        </el-col>
                        <el-col class="ellipsis" :title="item.serviceName" :span="8">{{item.serviceName}}</el-col>
                        <el-col :span="8">
                            <el-input 
                                v-model="item.serviceDisplayName" 
                                :disabled="!item.selected || orderStatus == 1 ? true : false" 
                            />
                        </el-col>
                    </el-row>
                    <div class="no-data" v-if="!tyreService.length">暂无数据</div>
                    <el-button @click.native="reset" class="reset">重置</el-button>   
                </el-col>
            </el-row>
            <upload :precheckNo="headInfo[0].text" :orderStatus="orderStatus"></upload>
        </div>
        <!-- 模板 -->
        <div v-for="(item, index) in temp" :key="index" class="base-css temp">
            <h3>{{item[0].checkItemTypeName}}</h3>
            <el-row v-for="(dataItem, i) in item" :key="i">
                <el-col class="ellipsis">{{dataItem.checkItem}}</el-col>
                <el-col class="ellipsis" v-for="(el, j) in dataItem.infoMap" :key="j">
                    <el-radio 
                        v-model="dataItem.checkResultCode" 
                        :label="j"
                        :disabled="orderStatus == 1 ? true : false"
                    >
                        {{el}}
                    </el-radio>
                </el-col>
                <el-col>
                    <el-input v-model="dataItem.checkResultRemark" :disabled="orderStatus == 1 ? true : false" />
                </el-col>
                <el-col 
                    class="ellipsis"
                    :style="{maxWidth: `${(8 -  Object.keys(dataItem.infoMap).length) * 10}%`}" 
                    :title="dataItem.verbalTrick"
                >
                    {{dataItem.verbalTrick}}
                </el-col>
            </el-row>
            <el-button @click="getTempService(item[0])">添加快速服务</el-button>
        </div>
        <!-- 其他确认项 -->
        <div class="base-css">
            <h3>其他确认项</h3>
            <label>{{note.verbalTrick}}</label>
            <el-input 
                type="textarea" 
                placeholder="请输入200字以内的备注" 
                v-model="note.checkResultRemark" 
                :maxlength="200"
                :disabled="orderStatus == 1 ? true : false" 
            />
            <div class="tip">
                {{this.addCost.verbalTrick.split('￥')[0]}}
                <el-input 
                    class="money"
                    type="number"
                    placeholder="请输入金额"
                    v-model="iputNum"  
                    :disabled="orderStatus == 1 ? true : false" 
                />
                {{this.addCost.verbalTrick.split('￥')[2]}}
            </div>            
            <el-row class="radio">
                <el-col v-for="(item, index) in otherRadio" :key="index">
                    <label>{{item.verbalTrick}}</label>
                    <el-radio 
                        v-for="(el, i) in item.infoMap" 
                        v-model="item.checkResultCode"
                        :key="i"
                        :label="i"
                        :disabled="orderStatus == 1 ? true : false"
                    >
                        {{el}}
                    </el-radio>
                </el-col>
            </el-row>
        </div>
        <!-- 按钮 -->
        <div class="el-btn">
            <el-button v-if="orderStatus != 1" type="warning" @click.native="update(0)">存草稿</el-button>
            <el-button v-if="orderStatus != 1" type="success" @click.native="update(1)">签名确认</el-button>
            <el-button v-if="orderStatus == 1" type="success" @click.native="redirect">查看工单</el-button>
            <el-button v-if="orderStatus == 1" type="info" @click.native="print">打印预览</el-button>
        </div>
        <!-- 轮胎 -->
        <Tyre ref="tyre" @handle="handle" />
        <!-- 人车主键 -->
        <customer-vehicle 
            ref="cusVehicle"
            @hideEmpCarModal="hideEmpCarModal"
            @selectCusVehicleInfo="selectCusVehicleInfo"
            cardUseTypeCode = "VehicleCard"
            :mobilePhone="mobilePhone"
            :plateNumber="plateNumber"
        />
        <!-- 车辆区域弹窗 -->
        <el-dialog :before-close="closeCarModel" :visible.sync="showCar" class="car-mask">
            <el-row class="mask-row">
                <el-col :span="10" class="canvas-wrap">
                    <canvas 
                        id="canvas" 
                        width="1182" 
                        height="1182"
                        @click="event => drawCanvas(event)"
                        :class="'canvas'+index" 
                    />
                </el-col>
                <el-col :span="14">
                    <el-row class="car-service">
                        <el-col :span="6">服务编码</el-col>
                        <el-col :span="10">服务名称</el-col>
                        <el-col :span="8">显示名称</el-col>
                    </el-row> 
                    <el-row class="car-service" v-for="item in carService" :key="item.serviceCode">
                        <el-col :span="6">
                            <el-checkbox v-model="item.selected" :disabled="orderStatus == 1 ? true : false" />
                            {{item.serviceCode}}
                        </el-col>
                        <el-col class="ellipsis" :span="10" :title="item.serviceName">{{item.serviceName}}</el-col>
                        <el-col :span="8">
                            <el-input 
                                v-model="item.serviceDisplayName" 
                                :disabled="!item.selected || orderStatus == 1 ? true : false" 
                            />
                        </el-col>
                    </el-row>
                    <div class="no-data" v-if="!carService.length">暂无数据</div>
                </el-col>
            </el-row>
            <div class="mask-btn">
                <label class="service-code" @click="canvasType = 2">划痕</label>
                <label class="service-name" @click="canvasType = 1">凹痕/飞石</label>
                <label class="display-name" @click="canvasType = 3">损伤/撞击</label>
                <el-button @click.native="createImage(carService)">保存</el-button>
                <el-button @click.native="resetCarModel(carService)">重置</el-button>
            </div>
        </el-dialog>
        <!-- 模板快速服务弹窗 -->
        <el-dialog :visible.sync="showTemp">
            <el-row class="car-service">
                <el-col :span="8">服务编码</el-col>
                <el-col :span="8">服务名称</el-col>
                <el-col :span="8">显示名称</el-col>
            </el-row>
            <el-row 
                class="car-service" 
                v-for="item in tempService" 
                :key="item.serviceCode"
            >
                <el-col :span="8">
                    <el-checkbox 
                        v-model="item.selected"
                        :disabled="orderStatus == 1 ? true : false" 
                    />
                    {{item.serviceCode}}
                </el-col>
                <el-col :span="8">{{item.serviceName}}</el-col>
                <el-col :span="8">
                    <el-input 
                        :disabled="!item.selected || orderStatus == 1 ? true : false" 
                        v-model="item.serviceDisplayName" 
                    />
                </el-col>
            </el-row>
            <div class="no-data" v-if="!tempService.length">暂无数据</div>
            <div class="temp-btn">
                <el-button @click.native="ensureTempService(tempService)">确定</el-button>
                <el-button @click.native="resetTempService(tempService)">重置</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { Row, Col, Input, Slider, Radio, DatePicker, Button, Select, Option, Checkbox, Dialog, Message, Autocomplete } from 'element-ui'
    import api from 'common/api'
    import common from 'common/common'
    import config from 'common/config'
    import Search from 'components/iris-search/search'
    import CustomerVehicle from 'components/customer-vehicle/customer-vehicle'
    import Tyre from './tyre'
    import Upload from './upload'
    import collectionApi from '@/common/api-collection.js'
    import { getSequence, getType } from 'common/api-common'
    import { PRE_CHECK_ORDER_SEQ } from 'common/sequence'
    import { SHEET_METAL } from 'common/ref-code'
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(Input)
    Vue.use(Slider)
    Vue.use(Radio)
    Vue.use(DatePicker)
    Vue.use(Button)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Checkbox)
    Vue.use(Dialog)
    Vue.use(Autocomplete)
    export default {
        data() {
            return {
                type: '',
                precheckNo: this.$route.query.No,
                id: '', // 预检单id
                orderStatus: -2, // 预检单状态
                info: {}, // 人车组件信息
                headInfo: [ // 表头信息
                    {
                        label: '预检单号',
                        text: '',
                    }, {
                        label: '门店',
                        text: '',
                        code: ''
                    }, {
                        label: '预检人',
                        text: ''
                    }, {
                        label: '创建时间',
                        text: ''
                    }
                ],
                mobilePhone: '', // 车主手机号，该变量不能用v-model监听
                plateNumber: '', // 车牌
                ownerInfo: [ // 车主信息
                    {
                        label: '车主姓名',
                        text: '',
                        code: '' 
                    }, {
                        label: '送修人',
                        text: ''
                    }, {
                        label: '车主手机',
                        text: ''
                    }, {
                        label: '送修人手机',
                        text: ''
                    }
                ],
                vehicleCode: '', // 车辆编码
                carInfo: [ // 车辆信息
                    {
                        label: '车牌号',
                        text: '',
                        type: 'input'
                    }, {
                        label: '车架号',
                        text: ''
                    }, {
                        label: '车型',
                        text: ''
                    }, 
                    // {
                    //     label: '当前里程',
                    //     text: ''
                    // }
                ],
                fuel: {}, // 油量
                
                carRadio: [], // 车辆信息答题卡
                fireDate: { label: '', val: ''}, // 灭火器有效期

                toggle: false,
                hotInfo: [
                    {
                        label: '最近履历',
                        text: '',
                        type: 'button'
                    }, 
                    // {
                    //     label: '商业险承保',
                    //     text: '',
                    //     code: 'commercialInsuranceCompanyCode',                        
                    //     list: [],
                    //     type: 'select'
                    // }, {
                    //     label: '保险到期日',
                    //     text: '',
                    //     code: 'commercialInsuranceEndDate',
                    //     type: 'date'
                    // }, {
                    //     label: '交强险承保',
                    //     text: '',
                    //     code: 'compulsoryInsuranceCompanyCode',
                    //     list: [],
                    //     type: 'select'
                    // }, {
                    //     label: '保险到期日',
                    //     text: '',
                    //     code: 'compulsoryInsuranceEndDate',
                    //     type: 'date'
                    // }, {
                    //     label: '离下次保养天数',
                    //     text: '',
                    //     code: 'compulsoryInsuranceEndDate',
                    // }, {
                    //     label: '离保修到期天数',
                    //     text: '',
                    //     code: 'compulsoryInsuranceEndDate',
                    // }, {
                    //     label: '保修到期日期',
                    //     text: '',
                    //     code: 'compulsoryInsuranceEndDate',
                    // }
                ],
                maxLength: 0, // 车主、车辆 持有卡 中的最大长度
                ownerCoupon: [], // 车主持有卡
                carCoupon: [], // 车辆持有卡

                dirtyCar: { }, //车辆过脏 
                tyreTread: [], 
                
                rims: [],
                tyreType: null, // 轮胎类型
                tyreService: [], // 轮胎快速服务
                carService: [], // 汽车快速服务
                carServiceList: [],
                
                svgRect: [ // svg 热点
                    { type: 'PreInsurance', x: '36%', y: '4%', width: '28%', height: '12%' },
                    { type: 'LeftAnteriorLobe', x: '8%', y: '17%', width:'18%', height: '20%' },
                    { type: 'LeftFrontDoor', x: '10%', y: '37%', width: '20%', height:'14%' },
                    { type: 'LeftPosteriorLobe',x: '8%', y: '51%', width: '24%', height: '28%' },
                    { type: 'Cover', x: '37%', y: '18%', width: '26%', height: '14%' },
                    { type: 'FrontGear', x: '37%', y: '32%', width: '26%', height: '10%' },
                    { type: 'Roof', x: '39%', y: '42%', width: '22%', height: '19%' },
                    { type: 'RearBumper', x: '35%', y: '61%', width: '32%', height: '10%' },
                    { type: 'BackCover', x: '35%', y: '71%', width: '32%', height: '14%' },
                    { type: 'RightAnteriorLobe', x: '73%', y: '17%', width: '18%', height: '20%' },
                    { type: 'RightFrontDoor', x: '69%', y: '37%', width: '20%', height: '14%' },
                    { type: 'RightPosteriorLobe', x: '68%', y: '51%', width: '24%', height: '28%' },
                    { type: 'PostInsurance', x: '36%', y: '86%', width: '28%', height: '12%' }
                ],

                // 车身13个面服务
                PreInsurance: [],
                LeftAnteriorLobe: [],
                LeftFrontDoor: [],
                LeftPosteriorLobe: [],
                Cover: [],
                FrontGear: [],
                Roof: [],
                RearBumper: [],
                BackCover: [],
                RightAnteriorLobe: [],
                RightFrontDoor: [],
                RightPosteriorLobe: [],
                PostInsurance: [],

                answerList: [], // 预检单数据
                tempService: [], // 模板快速服务
                showTemp: false,

                spareTyre: [], // 备胎
                frontTyre: [], // 前胎
                backTyre:[], // 备胎

                note: { verbalTrick: '' }, // 备注
                oldNum: '',
                addCost: { verbalTrick: '' }, // 其他确认项追加费用
                otherRadio: [], // 其他确认项答题卡,

                // 保险
                datalist: [],
                selectParams: {
                    pageNums: config.pageNums,
                    pageStart: 1
                },
                isLastPage: false,

                canvasType: 0, // canvas 类型
                index: 1,
                showCar: false,
                temp: [],
                isBase64: false,
                imgSrc: '/static/image/car.png',
                plateList: [],
                precheckRecommendationInfoList: [],
                isEdit: false, // 是不是编辑状态
                orderNo: '',
                serviceOrderNo: '',
                relPhone: '', // 人车组件点击确认后的手机号

                checkItemTypeCode: '', // 模板服务分类
                checkTemplateCode: '', // 模板分类
                oldCheckTemplateCode: '', // 模板服务分类，为了解决更换车型的时候模板相同，不再调借口
            }
        },

        computed:{
            iputNum: {
                get() {
                    return this.oldNum
                },
                set(val) {
                    this.oldNum = val.replace(/[^\d]/g, '')
                    this.addCost.checkResultRemark = this.oldNum
                }
            }
        },
        watch: {
            carRadio: {
                handler(list) {
                    if(list[3].checkResultCode == 'checkResult2') {
                        this.fireDate.checkResultRemark = ''
                    }
                },
                deep: true
            },
        },
        created() {
            this.setImgUrl()
            this.getUserinfo()
            this.initData()
        },
        mounted() {
            window.vue = this
        },
        methods: {
        
            // 获取表头信息
            getUserinfo() {
                const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                const storeInfoVo = userInfo.userAvailableInfo.storeInfoVo
                if(storeInfoVo) {
                    this.headInfo[1].text = storeInfoVo.storeName
                    this.headInfo[1].code = storeInfoVo.storeCode
                }
                this.headInfo[2].text = userInfo && userInfo.empVo.empCnName
            },
            
            // 格式化油量提示
            formatTooltip(val) {
                return (val / 100).toFixed(1);
            },
            
            // 计算车主、车辆 持有卡 中的最大长度
            calcMaxLength() {
                const ownerLength = this.ownerCoupon.length
                const carLength = this.carCoupon.length
                this.maxLength = ownerLength > carLength ? ownerLength : carLength
            },

            // 获取预检单号
            getPreCode() {
                getSequence(PRE_CHECK_ORDER_SEQ, res => {
                    this.headInfo[0].text = res
                    this.initAnswer()
                })
            },
            
            // 检索车主手机号
            searchTel(index) {
                
                const telReg = /^[1][3,4,5,7,8][0-9]{9}$/
                const tel = this.ownerInfo[index].text

                if(!tel) return 

                if(!telReg.test(tel)) {
                    Message({
                        showClose: true,
                        message: '输入的手机号有误',
                        type: 'warning'
                    })
                    return
                }

                if(index == 3) return
                
                this.mobilePhone = this.ownerInfo[2].text
                this.$refs.cusVehicle.showEmpCarModal()
            },

            // 检索车牌
            searchPlate() {
                if(this.plateNumber == this.carInfo[0].text) return 
                this.plateNumber = this.carInfo[0].text
                this.plateNumber && this.quaryCarInfo(this.plateNumber)
            },
            
            // 获取人车信息
            selectCusVehicleInfo(info) {
                const vehicleVo = info.customVehicleInfoVos[0]
                const plateNumber = vehicleVo.plateNumber || vehicleVo.plateNumberTmp
                this.quaryCarInfo(vehicleVo.plateNumber)
            },

            hideEmpCarModal() {
                this.ownerInfo[2].text = this.relPhone
            },

            // 查询车辆信息
            // plateNumber 车牌号
            quaryCarInfo(plateNumber) {

                const mobilePhone = plateNumber ? '' : this.ownerInfo[2].text                
                const params = { plateNumber, mobilePhone }

                api.mancar.queryCustomInfoByMobilePhone(params).then(res => {
                    if(res && res.data.code == 'success') {
                        if(res.data.obj) {
                            const custVo = res.data.obj
                            const vehicleVo = res.data.obj.customVehicleInfoVos[0]
                            this.info = custVo
                            vehicleVo && this.updateCustVehicleInfo(custVo, vehicleVo)
                        } else {
                            this.$refs.cusVehicle.showEmpCarModal()
                        }
                    }
                })
            },

            // 跟新人车信息
            updateCustVehicleInfo(custVo, vehicleVo) {
                
                this.ownerInfo[0].text = custVo.customName
                this.ownerInfo[0].code = custVo.customCode
                this.ownerInfo[2].text = custVo.mobilePhone
                this.relPhone = custVo.mobilePhone

                this.carInfo[0].text = vehicleVo.plateNumber
                this.carInfo[1].text = vehicleVo.vinCode
                this.carInfo[2].text = vehicleVo.displayName
                this.vehicleCode = vehicleVo.vehicleCode

                this.getLastResume()
                this.getCoupon()
                this.getTemp(vehicleVo)
                ;(this.isEdit || this.precheckNo) && this.update(0)
                ;(!this.isEdit && !this.precheckNo) && this.commit(0)
                
                if(!this.precheckNo)

                this.isEdit = true
                
                // 以下内容本次迭代 不做
                // this.carInfo[3].text = vehicleVo.inMileage
                // vehicleVo.commercialInsuranceCompanyName && this.$refs.searchDate[0].setValue(vehicleVo.commercialInsuranceCompanyName)
                // this.hotInfo[1].code = vehicleVo.commercialInsuranceCompanyCode
                // this.hotInfo[1].text = vehicleVo.commercialInsuranceCompanyName
                // this.hotInfo[2].text = vehicleVo.commercialInsuranceEndDate
                // vehicleVo.compulsoryInsuranceCompanyName && this.$refs._searchDate[0].setValue(vehicleVo.compulsoryInsuranceCompanyName)
                // this.hotInfo[3].code = vehicleVo.compulsoryInsuranceCompanyCode
                // this.hotInfo[3].text = vehicleVo.compulsoryInsuranceCompanyName
                // this.hotInfo[4].text = vehicleVo.compulsoryInsuranceEndDate
            },

            //显示轮胎组件
            showTyre(type) {
                if(this.orderStatus == 1) return
                this.$refs.tyre.show();
                this.tyreType = type
            },
            
            // 获取轮胎组件数据
            handle(info) {
                this.tyreType[0].checkResultName = info.width.name
                this.tyreType[0].checkResultCode = info.width.code
                this.tyreType[1].checkResultName = info.flatness.name
                this.tyreType[1].checkResultCode = info.flatness.code
                this.tyreType[2].checkResultName = info.structure.name
                this.tyreType[2].checkResultCode = info.structure.code
                this.tyreType[3].checkResultName = info.diameter.name
                this.tyreType[3].checkResultCode = info.diameter.code
                this.tyreType[4].checkResultName = info.loadIndex.name
                this.tyreType[4].checkResultCode = info.loadIndex.code
                this.tyreType[5].checkResultName = info.speedLevel.name
                this.tyreType[5].checkResultCode = info.speedLevel.code
            },
            
            // 初始化数据
            initData() {
                
                const params = { checkTemplateCode: 'CHETMP20180101000001' }
                
                api.precheck.queryCheckTemplateInfoNoPage(params, res => {
                    if(res && res.data.code == 'success') {
                        
                        this.getTyres()
                        
                        const { checkTemplateDetailInfoList } = res.data.obj[0]
                        this.id = res.data.obj.id

                        checkTemplateDetailInfoList.map(data => {
                            
                            // 油量 
                            if(data.checkTemplateDetailCode == config.precheck.fuelCode) {
                                
                                const { 
                                    verbalTrick, 
                                    checkTemplateCode,
                                    checkTemplateDetailCode,
                                    checkItem,
                                } = data

                                this.fuel = {
                                    verbalTrick, 
                                    checkTemplateCode,
                                    checkTemplateDetailCode,
                                    checkItem,
                                    checkResultRemark: 0
                                }
                            }

                            // 车辆信息答题卡
                            config.precheck.carRadioCode.map(item => {
                                if(item == data.checkTemplateDetailCode) {
                                   
                                    const { 
                                        verbalTrick, 
                                        checkTemplateDetailInfoMap: infoMap,
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem
                                    } = data

                                    this.carRadio.push({ 
                                        verbalTrick, 
                                        infoMap, 
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem,
                                        checkResultCode: '',
                                        checkResultName: '',
                                        type: 'radio'
                                    })
                                }
                            })

                            // 灭火器有效期 
                            if(data.checkTemplateDetailCode == config.precheck.fireCode) {
                                
                                const { 
                                    verbalTrick, 
                                    checkTemplateCode,
                                    checkTemplateDetailCode,
                                    checkItem,
                                } = data

                                this.fireDate = {
                                    verbalTrick, 
                                    checkTemplateCode,
                                    checkTemplateDetailCode,
                                    checkItem,
                                    checkResultRemark: ''
                                }
                            }

                            // 车辆过脏
                            if(data.checkTemplateDetailCode == config.precheck.dirtyCarCode) {

                                const { 
                                    checkTemplateDetailInfoMap: infoMap,
                                    verbalTrick, 
                                    checkTemplateCode,
                                    checkTemplateDetailCode,
                                    checkItem,
                                } = data

                                this.dirtyCar = {
                                    verbalTrick, 
                                    infoMap,
                                    checkTemplateCode,
                                    checkTemplateDetailCode,
                                    checkItem,
                                    checkResultCode: '',
                                    checkResultName: '',
                                    selected: false,
                                    type: 'checkbox'
                                }
                            }

                            // 轮胎胎纹深度
                            config.precheck.tyreTreadCode.map(item => {
                                if(item == data.checkTemplateDetailCode) {
                                    
                                    const { 
                                        verbalTrick, 
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem,
                                    } = data

                                    this.tyreTread.push({
                                        verbalTrick, 
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem,
                                        checkResultRemark: ''
                                    })
                                }

                                this.sort(this.tyreTread)
                            })

                            // 轮辋损伤情况
                            config.precheck.rimsCode.map(item => {
                                if(item == data.checkTemplateDetailCode) {

                                    const { 
                                        checkTemplateDetailInfoMap: infoMap,
                                        verbalTrick, 
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem,
                                    } = data

                                    this.rims.push({
                                        verbalTrick, 
                                        infoMap,
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem,
                                        checkResultCode: '',
                                        checkResultName: '',
                                        selected: false,
                                        type: 'checkbox'
                                    })

                                    this.rims = this.rims.sort((a, b) => {
                                        if(a.checkTemplateDetailCode > b.checkTemplateDetailCode) {
                                            return 1
                                        } else if (a.checkTemplateDetailCode > b.checkTemplateDetailCode) {
                                            return 0
                                        } else {
                                            return -1
                                        }
                                    })
                                }
                            })

                            // 其他确认项的追加项费用
                            if(data.checkTemplateDetailCode == config.precheck.addCostCode) {
                                
                                const { 
                                    verbalTrick, 
                                    checkTemplateCode,
                                    checkTemplateDetailCode,
                                    checkItem,
                                } = data

                                this.addCost = {
                                    verbalTrick, 
                                    checkTemplateCode,
                                    checkTemplateDetailCode,
                                    checkItem,
                                    checkResultRemark: ''
                                }
                            }

                            // 备注
                            if(data.checkTemplateDetailCode == config.precheck.noteCode) {
                                
                                const { 
                                    verbalTrick, 
                                    checkTemplateCode,
                                    checkTemplateDetailCode,
                                    checkItem,
                                } = data

                                this.note = {
                                    verbalTrick, 
                                    checkTemplateCode,
                                    checkTemplateDetailCode,
                                    checkItem,
                                    checkResultRemark: ''
                                }
                            }

                            // 其它确认项答题卡
                            config.precheck.otherRadioCode.map(item => {
                                if(item == data.checkTemplateDetailCode) {
                                  
                                    const { 
                                        verbalTrick, 
                                        checkTemplateDetailInfoMap: infoMap,
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem
                                    } = data

                                    this.otherRadio.push({ 
                                        verbalTrick, 
                                        infoMap, 
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem,
                                        checkResultCode: '',
                                        checkResultName: '',
                                        type: 'radio'
                                    })
                                }
                            })

                            // 备胎
                            config.precheck.spareTyreCode.map(item => {
                                if(item == data.checkTemplateDetailCode) {
                                    
                                    const { 
                                        verbalTrick, 
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem,
                                    } = data

                                    this.spareTyre.push({
                                        verbalTrick, 
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem,
                                        checkResultRemark: '',
                                        checkResultName: '',
                                        type: 'tyre'
                                    })
                                }
                            })

                            this.sort(this.spareTyre)

                            // 前胎
                            config.precheck.frontTyreCode.map(item => {
                                if(item == data.checkTemplateDetailCode) {
                                    
                                    const { 
                                        verbalTrick, 
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem,
                                    } = data

                                    this.frontTyre.push({
                                        verbalTrick, 
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem,
                                        checkResultRemark: '',
                                        checkResultName: '',
                                        type: 'tyre'
                                    })
                                }
                            })

                            this.sort(this.frontTyre)

                            // 前胎
                            config.precheck.backTyreCode.map(item => {
                                if(item == data.checkTemplateDetailCode) {
                                    const { 
                                        verbalTrick, 
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem,
                                    } = data

                                    this.backTyre.push({
                                        verbalTrick, 
                                        checkTemplateCode,
                                        checkTemplateDetailCode,
                                        checkItem,
                                        checkResultRemark: '',
                                        checkResultName: '',
                                        type: 'tyre'
                                    })
                                }
                            })

                            this.sort(this.backTyre)
                        })
                    }
                })
            },

            // 获取答案
            initAnswer() {
                
                if(!this.precheckNo)  return

                const params = { precheckOrderNo: this.precheckNo }
                
                api.precheck.getPrecheckOrderInfoByCode(params, res => {
                    if(res && res.data.code == 'success') {
                        
                        const Vo = res.data.obj
                        if(!Vo) return 

                        const orderInfo = Vo.orderInfo
                        this.answerList = Vo.precheckAnswerInfoList
                        this.precheckRecommendationInfoList = Vo.precheckRecommendationInfoList

                        // 更新预检单时的id 状态 工单号
                        this.id = Vo.id
                        this.orderStatus = Vo.orderStatus
                        this.orderNo = Vo.orderNo
                        this.serviceOrderNo = Vo.serviceOrderNo

                        // 表头信息
                        this.headInfo[0].text = Vo.precheckOrderNo
                        this.headInfo[3].text = new Date(Vo.createTime).Format('yyyy-MM-dd')
                        
                        // 车主信息
                        this.ownerInfo[0].text = orderInfo.custName
                        this.ownerInfo[0].code = orderInfo.custCode
                        this.ownerInfo[1].text = Vo.repairCustomName
                        this.ownerInfo[2].text = orderInfo.custMobile
                        this.ownerInfo[3].text = Vo.repairMobilePhone

                        const factoryName = orderInfo.carFactoryName ? orderInfo.carFactoryName : ''
                        const brandName = orderInfo.carBrandName ? orderInfo.carBrandName : ''
                        const seriesName = orderInfo.carSeriesName ? orderInfo.carSeriesName : ''
                        const modelName = orderInfo.carModelName ? orderInfo.carModelName : ''
                        const opvName = orderInfo.carOpvName ? orderInfo.carOpvName : ''
                        const iotypeName = orderInfo.carIotypeName ? orderInfo.carIotypeName : ''

                        // 车辆信息
                        this.vehicleCode = orderInfo.vehicleCode
                        this.carInfo[0].text = orderInfo.custPlates
                        this.carInfo[1].text = orderInfo.vinCode
                        this.carInfo[2].text = factoryName + brandName + seriesName + modelName + opvName + iotypeName
                        this.carInfo[2].code = orderInfo.carModelCode
                        // this.carInfo[3].text = orderInfo.mileageIntoStore

                        // 获取模板
                        const codeVo = {
                            factoryCode: orderInfo.carFactoryCode,
                            brandCode: orderInfo.carBrandCode,
                            seriesCode: orderInfo.carSeriesCode,
                            modelCode: orderInfo.carModelCode
                        }

                        this.getTemp(codeVo)
                        
                        Vo.precheckAnswerInfoList.map(item => {
                           
                            // 油量
                            if(item.checkTemplateDetailCode == config.precheck.fuelCode) {
                                this.fuel.checkResultRemark = Number(item.checkResultRemark * 100)
                                this.fuel.id = item.id
                            }

                            // 车辆
                            this.carRadio.map((dataItem, i) => {
                                if(item.checkTemplateDetailCode == dataItem.checkTemplateDetailCode) {
                                    this.carRadio[i].checkResultCode = item.checkResultCode
                                    this.carRadio[i].id = item.id
                                }
                            })

                            // 灭火器有效期
                            if(item.checkTemplateDetailCode == config.precheck.fireCode) {
                                this.fireDate.checkResultRemark = item.checkResultRemark
                                this.fireDate.id = item.id
                            }

                            // 轮胎胎纹
                            this.tyreTread.map((dataItem, i) => {
                                if(item.checkTemplateDetailCode == dataItem.checkTemplateDetailCode) {
                                    this.tyreTread[i].checkResultRemark = item.checkResultRemark
                                    this.tyreTread[i].checkResultCode = item.checkResultCode
                                    this.tyreTread[i].id = item.id
                                }
                            })

                            // 轮胎损伤
                            this.rims.map((dataItem, i) => {
                                if(item.checkTemplateDetailCode == dataItem.checkTemplateDetailCode) {
                                    this.rims[i].selected = item.checkResultCode == 'checkResult1' ? true : false
                                    this.rims[i].id = item.id
                                }
                            })

                            // 车辆状态
                            if(item.checkTemplateDetailCode == config.precheck.dirtyCarCode) {
                                this.dirtyCar.selected = item.checkResultCode == 'checkResult1' ? true : false
                                this.dirtyCar.id = item.id
                            }

                            // 备注
                            if(item.checkTemplateDetailCode == config.precheck.noteCode) {
                                this.note.checkResultRemark = item.checkResultRemark
                                this.note.id = item.id
                            }

                            // 追加费用
                            if(item.checkTemplateDetailCode == config.precheck.addCostCode) {
                                this.iputNum = item.checkResultRemark
                                this.addCost.checkResultRemark = item.checkResultRemark
                                this.addCost.id = item.id
                            }

                            // 其他
                            this.otherRadio.map((dataItem, i) => {
                                if(item.checkTemplateDetailCode == dataItem.checkTemplateDetailCode) {
                                    this.otherRadio[i].checkResultCode = item.checkResultCode
                                    this.otherRadio[i].id = item.id
                                }
                            })

                            // 备胎信息
                            config.precheck.spareTyreCode.map((dataItem, i) => {
                                if(item.checkTemplateDetailCode == dataItem) {
                                    this.spareTyre[i].checkResultCode = item.checkResultCode
                                    this.spareTyre[i].checkResultName = item.checkResultRemark
                                    this.spareTyre[i].id = item.id
                                    this.frontTyre[i].type = 'tyre'
                                }
                            })

                            // 前胎信息
                            config.precheck.frontTyreCode.map((dataItem, i) => {
                                if(item.checkTemplateDetailCode == dataItem) {
                                    this.frontTyre[i].checkResultCode = item.checkResultCode
                                    this.frontTyre[i].checkResultName = item.checkResultRemark
                                    this.frontTyre[i].id = item.id
                                }
                            })

                            // 后台信息
                            config.precheck.backTyreCode.map((dataItem, i) => {
                                if(item.checkTemplateDetailCode == dataItem) {
                                    this.backTyre[i].checkResultCode = item.checkResultCode
                                    this.backTyre[i].checkResultName = item.checkResultRemark
                                    this.backTyre[i].id = item.id
                                }
                            })
                        })

                        // 轮胎服务
                        this.precheckRecommendationInfoList.map(data => {
                            this.tyreService.map((item, index) => {
                                if(item.serviceCode == data.serviceCode) {
                                    this.tyreService[index].selected = true
                                    this.tyreService[index].serviceCode = data.serviceCode
                                    this.tyreService[index].serviceDisplayName = data.serviceDisplayName
                                    this.tyreService[index].id = data.id
                                    this.tyreService[index].isDeleted = data.isDeleted
                                }
                            })
                        })

                        this.sort(this.spareTyre)
                        this.sort(this.frontTyre)
                        this.sort(this.backTyre)

                        this.getImg()
                        this.getCoupon()
                        this.getLastResume()
                    }
                })
            },
            
            // 排序
            sort(typeName) {
                typeName = typeName.sort((a, b) => {
                    if(a.checkTemplateDetailCode > b.checkTemplateDetailCode) {
                        return 1
                    } else if (a.checkTemplateDetailCode > b.checkTemplateDetailCode) {
                        return 0
                    } else {
                        return -1
                    }
                })
            },

            // 获取最近履历
            getLastResume() {
                
                const custPlates = this.carInfo[0].text
                const params = {
                    custPlates, // 客服编码
                    sortRule: 1 // 排序方式
                }

                api.vehicleCleaning.getOrderInfoByCondition(params, res => {
                    if(res && res.data.code == 'success') {
                        
                        const { closingDate, storeName } = res.data.obj
                        
                        if(closingDate) {
                           this.hotInfo[0].text = closingDate.slice(0, closingDate.length-2) + ' ' + storeName
                        } else {
                            if(custPlates) {
                                this.hotInfo[0].text = new Date().Format('yyyy-MM-dd hh:mm:ss') + ' ' + this.headInfo[1].text
                            } else {
                                this.hotInfo[0].text = ''
                            }
                        }
                    }
                })
            },
            
            // 编辑人车组件 功能暂时未开放 该函数暂时没用到 
            editCustVehicle() {
                
                if(!this.carInfo[0].text) {
                    Message({
                        showClose: true,
                        message: '请补全车辆信息',
                        type: 'warning'
                    })
                    return
                }

                const commercialInsuranceEndDate = this.hotInfo[2].text ? new Date(this.hotInfo[2].text).Format('yyyy-MM-dd') : ''
                const compulsoryInsuranceEndDate = this.hotInfo[4].text ? new Date(this.hotInfo[2].text).Format('yyyy-MM-dd') : ''
                const vehicleVo = this.info.customVehicleInfoVos[0]

                let params = {
                    id: vehicleVo.id,
                    vehicleCode: this.vehicleCode,
                    customCode: this.ownerInfo[0].code,
                    customName: this.ownerInfo[0].Name,
                    plateNumber: this.carInfo[0].text,
                    plateNumberTmp: vehicleVo.plateNumberTmp,
                    vinCode: this.carInfo[1].text,
                    vinCode: vehicleVo.text,
                    factoryCode: vehicleVo.factoryCode,
                    brandCode: vehicleVo.brandCode,
                    seriesCode: vehicleVo.seriesCode,
                    modelCode: vehicleVo.modelCode,
                    opvCode: vehicleVo.opvCode,
                    iotypeCode: vehicleVo.iotypeCode,
                    plateDate: vehicleVo.plateDate,
                    commercialInsuranceEndDate,
                    compulsoryInsuranceEndDate,
                    inMileage: this.carInfo[3].text,
                    commercialInsuranceCompanyCode: this.hotInfo[1].code,
                    commercialInsuranceCompanyName: this.hotInfo[1].text,
                    compulsoryInsuranceCompanyCode: this.hotInfo[3].code,
                    compulsoryInsuranceCompanyName: this.hotInfo[3].text,
                    commercialInsuranceCompanyRemark: vehicleVo.commercialInsuranceCompanyRemark,
                    vehicleRemark: vehicleVo.vehicleRemark,
                    // 客户信息
                    customInfoVo: {
                        id: this.info.id,
                        customCode: this.info.customCode,
                        customName: this.ownerInfo[0].text,
                        mobilePhone: this.info.mobilePhone,
                        idType: this.info.idType,
                        idNo: this.info.idNo,
                        birthday: this.info.birthday,
                        email: this.info.email,
                        gender: this.info.gender
                    },
                }

                api.mancar.updateCustomVehicleInfo(params, res => { })
            },

            // 新建预检单
            commit(orderStatus) {

                const params = {
                    precheckOrderNo: this.headInfo[0].text, // 预检单号
                    storeCode: this.headInfo[1].code, // 门店code
                    customCode: this.ownerInfo[0].code, // 客户编码    
                    customName: this.ownerInfo[0].text, // 客户名称 
                    mobilePhone: this.mobilePhone, // 客户手机号
                    repairCustomName: this.ownerInfo[1].text, // 送修人名称  
                    repairMobilePhone: this.ownerInfo[3].text, // 送修人手机 
                    vehicleCode: this.vehicleCode, // 车辆编码  
                    orderStatus, // 0 草稿 1 保存 
                }

                api.precheck.insertPrecheckOrderInfo(params, res => {
                    if(res && res.data.code == 'success') {
                        const Vo = res.data.obj
                        const id = Vo.id
                        this.orderNo = Vo.orderNo
                        this.serviceOrderNo = Vo.serviceOrderNo
                        if(id) this.id = id
                    }
                })
            },

            // 更新预检单
            update(orderStatus) {
                
                if(!this.id) {
                    Message({
                        showClose: true,
                        message: '请补全车辆信息',
                        type: 'warning'
                    })
                    return
                } 

                if(!this.isBase64) this.saveImg()
                
                this.sort(this.spareTyre)
                this.sort(this.frontTyre)
                this.sort(this.backTyre)

                const precheckAnswerInfoList = []
                const precheckRecommendationInfoList = []
                const checkList = [
                    this.fuel, 
                    ...this.carRadio, 
                    this.fireDate, 
                    this.dirtyCar, 
                    ...this.tyreTread, 
                    ...this.rims,
                    this.note,
                    this.addCost,
                    ...this.otherRadio,
                    ...this.spareTyre,
                    ...this.frontTyre,
                    ...this.backTyre
                ]

                // 答案
                checkList.map(item => {
                   
                    const { 
                        verbalTrick,
                        checkTemplateCode,
                        checkTemplateDetailCode,
                        checkItem,
                        id
                    } = item
                    
                    const obj = { 
                        precheckOrderNo: this.headInfo[0].text, 
                        verbalTrick, 
                        checkTemplateCode, 
                        checkTemplateDetailCode, 
                        checkItem,
                        id 
                    }

                    if(item.infoMap) {
                        
                        const { checkResultCode } = item
                        const checkResultName = item.infoMap[checkResultCode]
                        
                        if(item.type === 'radio') { // radio
                            obj.checkResultCode = checkResultCode ? checkResultCode : ''
                            obj.checkResultName = checkResultName  ? checkResultName : ''
                        } else if(item.type == 'checkbox') { // checkbox
                            obj.checkResultCode =  item.selected ? 'checkResult1' : 'checkResult2' 
                            obj.checkResultName =  item.selected ? '是' : '否' 
                        }
                    } else {
                        const { checkResultRemark } = item
                        if(checkTemplateDetailCode == config.precheck.fuelCode) { // 油量
                            obj.checkResultRemark = checkResultRemark ? checkResultRemark / 100 : 0
                        } else if(checkTemplateDetailCode == config.precheck.fireCode) { // 灭火器有效期
                            obj.checkResultRemark = checkResultRemark ? new Date(checkResultRemark).Format('yyyy-MM-dd') : ''
                        } else if(item.type == 'tyre') { // 轮胎
                            obj.checkResultCode = item.checkResultCode ? item.checkResultCode : ''
                            obj.checkResultRemark = item.checkResultName  ? item.checkResultName : ''
                        } else {
                            obj.checkResultRemark = checkResultRemark ? checkResultRemark : ''
                        } 
                    }
                    
                    precheckAnswerInfoList.push(obj)
                })

                // 服务
                this.tyreService.map(item => {
                    const { serviceCode, serviceName, serviceDisplayName, vehicleTypeCode } = item
                    const Vo = {
                        serviceCode,
                        serviceName,
                        serviceDisplayName,
                        vehicleTypeCode,
                        precheckOrderNo: this.headInfo[0].text
                    }

                    // 编辑时的服务
                    if(item.isDeleted && item.selected) {
                        Vo.id = item.id
                        Vo.isDeleted = item.isDeleted
                        precheckRecommendationInfoList.push(Vo)
                    } 

                    if(item.isDeleted && !item.selected) {
                        Vo.id = item.id
                        Vo.isDeleted = 1
                        precheckRecommendationInfoList.push(Vo)
                    } 

                    if(!item.isDeleted && item.selected) {
                        precheckRecommendationInfoList.push(Vo)
                    }
                })

                // 模板
                this.temp.map(data => {
                    data.map(item => {
                        const {
                            verbalTrick,
                            checkTemplateCode,
                            checkTemplateDetailCode,
                            checkItem,
                            checkResultCode,
                            checkResultRemark
                        } = item
                        const checkResultName = item.infoMap[checkResultCode] ? item.infoMap[checkResultCode] : ''
                        const obj = {
                            precheckOrderNo: this.headInfo[0].text, 
                            verbalTrick, 
                            checkTemplateCode, 
                            checkTemplateDetailCode, 
                            checkItem,
                            checkResultCode,
                            checkResultName,
                            checkResultRemark
                        }
                        item.id && (obj.id = item.id)
                        precheckAnswerInfoList.push(obj)
                    })
                })
                
                const params = {
                    id: this.id,
                    precheckOrderNo: this.headInfo[0].text, // 预检单号
                    storeCode: this.headInfo[1].code, // 门店code
                    customCode: this.ownerInfo[0].code, // 客户编码    
                    customName: this.ownerInfo[0].text, // 客户名称 
                    mobilePhone: this.mobilePhone, // 客户手机号
                    repairCustomName: this.ownerInfo[1].text, // 送修人名称  
                    repairMobilePhone: this.ownerInfo[3].text, // 送修人手机 
                    vehicleCode: this.vehicleCode, // 车辆编码  
                    orderStatus, // 0 草稿 1 保存 -1 s 
                    precheckAnswerInfoList,
                    precheckRecommendationInfoList,
                    orderNo: this.orderNo,
                    serviceOrderNo: this.serviceOrderNo
                }

                api.precheck.updatePrecheckOrderInfo(params, res => {
                    if(res && res.data.code == 'success') {
                        Message({
                            showClose: true,
                            message: '预检单保存成功',
                            type: 'success'
                        })
                        orderStatus == 1 && this.print()
                        orderStatus == 1 && (this.orderStatus = 1)
                        this.precheckNo = this.headInfo[0].text
                        this.initAnswer() // 匹配id
                        this.$router.push({ path: '/precheck', query:{ No: this.headInfo[0].text } })
                    }
                })
            },

            // 预检单打印
            print() {
                const params = this.headInfo[0].text
                this.previewNeed(common.isdev() + collectionApi.precheck.generatePdfprecheckOrder, params)
            },

            previewNeed: (URL, params) => {
                var temp_form = document.createElement("form")      
                    temp_form.action = URL      
                    temp_form.target = "_blank"
                    temp_form.method = "get"      
                    temp_form.style.display = "none" 
                    var opt = document.createElement("textarea")
                    opt.name = 'precheckOrderNo'      
                    opt.value = params
                    temp_form.appendChild(opt)
                    document.body.appendChild(temp_form)   
                    temp_form.submit()  
            },

            // 获取卡券
            getCoupon() {

                const params = {
                    customCode: this.ownerInfo[0].code,
                    vehicleCode: this.vehicleCode
                }

                api.precheck.queryusableCardInfosAndCouponDetailInfos(params, res => {
                    if(res && res.data.code == 'success') {
                        this.ownerCoupon = []
                        this.carCoupon = []
                        const { cardCRecorder, cardVehicleCard, couponCRecorder, couponVehicleCard } = res.data.obj
                        this.ownerCoupon = [ ...cardCRecorder, ...couponCRecorder ]
                        this.carCoupon = [ ...cardVehicleCard, ...couponVehicleCard ]
                        this.calcMaxLength()
                    }
                })
            },

            // 显示汽车 Modal
            showCarModel(i, type) {
                this.index = i
                this.showCar = true
                setTimeout(() => this.drawImg('canvas'), 300)
                this.getCarService(type)
            },

            // 汽车服务分类
            getCarService(type) {
                
                const params = { 
                    sheetMetalCode: type, 
                    storeCode: this.headInfo[1].code,
                    vehicleCode: this.vehicleCode,
                    precheckOrderNo: this.headInfo[0].text,   
                    checkItem: type    
                }

                this.type = type
                
                api.precheck.queryServiceInfoByCaraddcode(params, res => {
                    if(res && res.data.code == 'success') {
                        this[type] = []
                        res.data.obj.map(item => {
                            const {
                                id,
                                serviceCode,
                                serviceName,
                                serviceDisplayName,
                                isDeleted,
                                chooseflag,
                            } = item
                            const selected = item.chooseflag ? true : false
                            this[type].push({
                                id,
                                serviceCode,
                                serviceName,
                                serviceDisplayName,
                                vehicleTypeCode: type,
                                isDeleted,
                                chooseflag,
                                selected
                            })
                        })

                        this.carService  = this[type]
                    }
                })
            },
            
            // 轮胎服务分类
            getTyres(categoryCode) {

                const params = { 
                    sheetMetalCode: 'Tyres', 
                    storeCode: this.headInfo[1].code, 
                    vehicleCode: this.vehicleCode
                }

                api.precheck.queryServiceInfoByCaraddcode(params, res => {
                    if(res && res.data.code == 'success') {
                        res.data.obj.map(item => {
                           
                            const {
                                serviceCode,
                                serviceName,
                                serviceDisplayName,
                            } = item

                            this.tyreService.push({
                                serviceCode,
                                serviceName,
                                serviceDisplayName,
                                vehicleTypeCode: 'Tyres',
                                selected: false
                            })                            
                        })

                        this.getPreCode()
                    }
                })
            },
            
            // 重置轮胎快速服务 && canvas
            reset() {
                
                if(this.orderStatus == 1) return

                const serviceList = [
                    'tyreService',
                    'PreInsurance',
                    'LeftAnteriorLobe',
                    'LeftFrontDoor',
                    'LeftPosteriorLobe',
                    'Cover',
                    'FrontGear',
                    'Roof',
                    'RearBumper',
                    'BackCover',
                    'RightAnteriorLobe',
                    'RightFrontDoor',
                    'RightPosteriorLobe',
                    'PostInsurance'
                ]

                const list = [
                    ...this.PreInsurance,
                    ...this.LeftAnteriorLobe,
                    ...this.LeftFrontDoor,
                    ...this.LeftPosteriorLobe,
                    ...this.Cover,
                    ...this.FrontGear,
                    ...this.Roof,
                    ...this.RearBumper,
                    ...this.BackCover,
                    ...this.RightAnteriorLobe,
                    ...this.RightFrontDoor,
                    ...this.RightPosteriorLobe,
                    ...this.PostInsurance
                ] 

                list.length && this.saveService(list, true)

                serviceList.map(item => {
                    this[item] = this[item].map(dataItem => {
                        return {
                            serviceCode: dataItem.serviceCode,
                            serviceName: dataItem.serviceName,
                            serviceDisplayName: '',
                            vehicleTypeCode: item,
                            selected: false
                        }
                    })
                })
                
                this.setImgUrl()
                this.resetCarModel()
            },

            // 设置图片Url
            setImgUrl() {   
                const hostName = 'loc.iris.com'
                if(hostName.indexOf(window.location.hostname) == -1)
                    this.src = '/livecs' + this.imgSrc
                else
                    this.src = this.imgSrc
            },

            // 获取模板
            // Vo 厂家 品牌 车型 车系 code
            getTemp(Vo) {
                
                const params = {
                    factoryCode: Vo.factoryCode,
                    brandCode: Vo.brandCode,
                    seriesCode: Vo.seriesCode,
                    modelCode: Vo.modelCode,
                    storeCodes: [this.headInfo[1].code],
                    precheckFlag: 1,
                    checkTemplateStatus: 0,
                    checktypeCode: 'RingCarInspection',
                    pageNums: 1000
                }

                api.checkTemplate.search(params, res => {
                    if(res && res.data.code == 'success') {
                        if(res.data.obj.list) {
                            
                            this.tempList = res.data.obj.list[0].groupByCheckItemCodeList
                            this.checkTemplateCode = res.data.obj.list[0].checkTemplateCode
                            
                            if(!this.tempList || this.checkTemplateCode == this.oldCheckTemplateCode) return

                            this.temp = []

                            this.tempList.map(data => {
                                const itemList = []
                                data.map(item => {
                                    const {
                                        checkItemTypeCode,
                                        checkItem, 
                                        checkItemTypeName, 
                                        checkTemplateDetailInfoMap: infoMap,
                                        checkTemplateCode, 
                                        checkTemplateDetailCode,
                                        verbalTrick,
                                    } = item

                                    itemList.push({
                                        checkItemTypeCode,
                                        checkItem, 
                                        checkItemTypeName, 
                                        infoMap,
                                        checkTemplateCode, 
                                        checkTemplateDetailCode,
                                        verbalTrick,
                                        checkResultCode: '',
                                        checkResultName: '',
                                        checkResultRemark: '',
                                    })
                                })

                                this.temp.push(itemList)
                            })

                        } else {
                            this.checkTemplateCode = ''
                            this.temp = []
                        } 
                        this.initTempData()
                        this.updateTemp()
                        this.oldCheckTemplateCode = this.checkTemplateCode
                    }
                })
            },

            // 匹配模板数据
            initTempData() {
                this.answerList.map(item => {
                    this.temp.map((data, index) => {
                        data.map((dataItem, i) => {
                            if(dataItem.checkTemplateDetailCode == item.checkTemplateDetailCode) {
                                this.temp[index][i].checkResultCode = item.checkResultCode
                                this.temp[index][i].checkResultRemark = item.checkResultRemark
                                this.temp[index][i].id = item.id
                            }
                        })
                    })
                })
            },

            // 更新模板 
            // 更换车辆的时候 需要重置模板 && 服务
            // checkTemplateCode 模板code 
            // precheckOrderNo 预检单号
            updateTemp() {

                const params = { 
                    checkTemplateCode: this.checkTemplateCode,
                    precheckOrderNo: this.headInfo[0].text 
                }

                api.precheck.checkRecommendationAndAnswerInfo(params, res => { })
            },

            // 获取模板服务
            // Vo 当前服务所在的模板对象
            getTempService(Vo) {    
                
                const params = { 
                    precheckOrderNo: this.headInfo[0].text,
                    vehicleCode: this.vehicleCode, 
                    storeCode: this.headInfo[1].code,
                    checkTypeCode: Vo.checkItemTypeCode, 
                    checkItem: Vo.checkItemTypeCode,
                    checkTemplateCode: Vo.checkTemplateCode, 
                }

                this.checkItemTypeCode = Vo.checkItemTypeCode
                this.checkTemplateCode = Vo.checkTemplateCode

                api.precheck.queryServiceInfoByCaraddcode(params, res => {
                    if(res && res.data.code == 'success') {
                       
                        this.tempService = []
                        res.data.obj.map(item => {
                            
                            const {
                                id,
                                serviceCode,
                                serviceName,
                                serviceDisplayName,
                                isDeleted,
                                chooseflag,
                            } = item

                            const selected = item.chooseflag ? true : false
                            
                            this.tempService.push({
                                id,
                                serviceCode,
                                serviceName,
                                serviceDisplayName,
                                vehicleTypeCode: item.vehicleCode,
                                isDeleted,
                                chooseflag,
                                selected
                            })
                        })
                        
                        this.showTemp = true
                    }
                })
            },

            // 确定模板快速服务
            // serviceList 当前弹框中所有服务
            ensureTempService(serviceList) {
                this.showTemp = false
                this.saveService(serviceList, false, 'temp')
            },

            // 重置模板服务
            // serviceList 当前弹框中所有服务
            resetTempService(serviceList) {

                this.saveService(serviceList, true)
                
                this.tempService = 
                this.tempService.map(item => {
                    return{
                        serviceCode: item.serviceCode,
                        serviceName: item.serviceName,
                        serviceDisplayName: '',
                        vehicleTypeCode: item.type,
                        selected: false
                    }
                })
            },
            
            // 保存服务
            // serviceList 当前模块对应的所有服务
            // isReset 是否重置服务
            // type 区分 车辆区域服务 && 模板快速服务 默认为车辆区域服务
            saveService(serviceList, isReset = false, type) {
                
                if(this.orderStatus == 1) return

                const precheckRecommendationInfoList = []
                let canReset = false

                serviceList.map(item => {
                    
                    const { serviceCode, serviceName, serviceDisplayName } = item
                    const Vo = {
                        serviceCode,
                        serviceName,
                        serviceDisplayName,
                        precheckOrderNo: this.headInfo[0].text
                    }

                    if(type == 'temp') { // 模板快速服务
                        Vo.checkTemplateCode = this.checkTemplateCode
                        Vo.checkItemTypeCode = this.checkItemTypeCode
                    } else { // 车辆区域服务
                        Vo.vehicleTypeCode = item.vehicleTypeCode
                    }

                    // 保存过的服务要给Id
                    if(item.chooseflag == 1) {
                        Vo.id = item.id
                    }
                    
                    // 勾选状态改为不勾选时 isDeleted 置为 1
                    if(!item.selected) {
                        Vo.isDeleted = 1
                    }

                    // 重置时的服务
                    if(isReset) {
                        Vo.id = item.id
                        Vo.isDeleted = 1
                    } 

                    if(item.chooseflag) canReset = true
                    
                    ;(item.selected || item.chooseflag == 1) && precheckRecommendationInfoList.push(Vo)
                })
                
                if(!precheckRecommendationInfoList.length) return
                if(isReset && !canReset) return 

                const params = precheckRecommendationInfoList
                const message = !isReset ? '保存成功' : '重置成功'

                api.precheck.editPrecheckRecommendationInfo(params, res => {
                    if(res && res.data.code == 'success') {
                        Message({
                            showClose: true,
                            message,
                            type: 'success'
                        })
                        this.getCarService(this.type)
                    }
                })
            },

            // 把大图区分图用 canvas 画到弹窗中
            drawImg(id) {
                const canvas = document.getElementById(id)
                const context = canvas.getContext('2d')
                const img = new Image()
                img.onload = createPat
                function createPat(){        
                    context.drawImage(img, 0, 0, 1182, 1182)
                }
                img.src = this.src
            },

            // 在 canvas 画 三角形 圆 X
            drawCanvas(evt) {

                if(this.orderStatus == 1) return

                const x = evt.offsetX
                const y = evt.offsetY
                const h1 = 10
                const h2 = 15
                const h3 = 15
                const canvas = document.getElementById("canvas");
                const context = canvas.getContext("2d");
                context.beginPath();
                
                // 画圆
                if(this.canvasType == 1) {
                    context.arc(x, y, h1, 0, 2*Math.PI);
                }

                // 画三角形
                if(this.canvasType == 2) {
                    context.moveTo(x, y - 0.5 * h2) 
                    context.lineTo(x - h2 / Math.sqrt(3), y + 0.5 * h2)
                    context.lineTo(x + h2 / Math.sqrt(3), y + 0.5 * h2) 
                    context.closePath()
                }

                // 画 X
                if(this.canvasType == 3) {
                    context.moveTo(x - 0.5 * h3, y - 0.5 * h3) 
                    context.lineTo(x + 0.5 * h3, y + 0.5 * h3)
                    context.moveTo(x - 0.5 * h3, y + 0.5 * h3) 
                    context.lineTo(x + 0.5 * h3, y - 0.5 * h3)
                }
                
                context.stroke()
            },

            // 点击车辆服务弹窗 右上角 X 时，需要重置 没有保存的 canvas
            closeCarModel() {
                this.showCar = false
                if(this.orderStatus == 1) return 
                this.resetCarModel()
            },

            // 重置 canvas && 汽车服务
            // serviceList 当前弹窗下的所有服务
            resetCarModel(serviceList = []) {
                
                if(this.orderStatus == 1) return 
                
                const canvas = document.getElementById("canvas")
                if(!canvas) return
                const context = canvas.getContext("2d")
                context.clearRect(0, 0, context.canvas.width, context.canvas.height)

                this.drawImg('canvas')
                this.saveService(serviceList, true)

                this.carService = 
                this.carService.map(item => {
                    return {
                        serviceCode: item.serviceCode,
                        serviceName: item.serviceName,
                        serviceDisplayName: '',
                        vehicleTypeCode: item.type,
                        selected: false
                    }
                })
            },

            // 生成图片 && 保存服务
            // serviceList 当前弹窗下的所有服务
            createImage (serviceList) {
                
                this.showCar = false
                if(this.orderStatus == 1) return
                            
                const canvas = document.getElementById('canvas')
                this.src = canvas.toDataURL('image/png')

                this.saveService(serviceList)
            },

            // 保存图片
            saveImg() {
                if(!this.isBase64) {
                    this.drawImg('cans')
                    this.isBase64 = true
                    setTimeout(() => {
                        const canvas = document.getElementById('cans')
                        this.src = canvas.toDataURL('image/png')
                        this.saveImg()
                    }, 300)
                } else {
                    const params = {
                        imgBase64: this.src,
                        relationCode: this.headInfo[0].text,
                        singleFlag: 1,
                        businessType: 'printBigImg'
                    }
                    api.precheck.uploadbase64Img(params, res => { })
                }
            },

            // 获取图片
            getImg() {
                
                const params = { businessType: 'printBigImg', relationCode: this.precheckNo }
                
                api.accessory.list(params, res => {
                    if(res && res.data.code == 'success') {
                        this.src = common.getUploadUrl() + res.data.obj[0].filePath
                    }
                })
            },

            // 跳转到工单详情
            redirect() {
                this.$router.push({ path: '/repair-order', query:{ orderNo: this.orderNo } })
            },

            // 以下方法功能在本次 迭代中 未开放 2018-06-28
            // 保险相关业务
            clearValue() {
                this.hotInfo[1].code = ''
                this.hotInfo[1].text = ''
            },

            _clearValue() {
                this.hotInfo[3].code = ''
                this.hotInfo[3].text = ''
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

            queryHandle(data) {
                this.selectParams.pageStart = 1;
                this.selectParams.coName = data;
                let params = this.selectParams;        
                this.querySerInfo(params, obj => {
                    this.isLastPage = obj.isLastPage;            
                    this.datalist = obj.list;
                });
            },

            itemHandle(item) {
                this.hotInfo[1].code = item.coCode
                this.hotInfo[1].text = item.coName
                this.editCustVehicle()
            },

            _itemHandle(item) {
                this.hotInfo[3].code = item.coCode
                this.hotInfo[3].text = item.coName
                this.editCustVehicle()
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
        components: {
            CustomerVehicle,
            Search,
            Tyre,
            Upload
        }
    }
</script>

<style lang="scss">
    .precheck {
        font-size: 14px;
        label, h3 {
            margin-bottom: 0;
        }
        .head {
            box-sizing: border-box;
            padding: 18px 0 18px 30px;            
            margin-bottom: 20px;
            background: #FFF;
            .el-col {
                width: auto;
                margin-right: 60px;
            }
        }
        .base-css {
            box-sizing: border-box;
            padding: 0 30px;
            background: #FFF;
            h3 {
                padding: 30px 0 20px;
                font-size: 16px;
                font-weight: 600;
            }
            .base-row {
                border-bottom: 1px solid #F2F2F2;
                .el-col {
                    margin-bottom: 20px;
                    input {
                        width: 80%;
                        height: 36px;
                        margin-top: 10px;
                        border-radius: 3px;
                    }
                }
            }
            .el-radio {
                min-width: 80px;
            }
        }
        .picker {
            width: 126px !important;
            height: 32px;
            margin-left: 10px;
        }
        .hot-info {
            label{
                display: block;
            }
            .searchContent {
                position: relative;
                .dowm, .clear {
                    right: 24%;
                }
            }
        }
        .date-picker {
            width: 126px !important;
            input {
                width: 100% !important;
            }
        }
        .fuel {
            display: flex;
            height: 20px;
            margin-top: 34px;
            align-items: center;
        }
        .el-slider {
            width: 478px;
            margin-left: 20px;
            .el-slider__button-wrapper {
                top: -26px;
            }
            .el-slider__button {
                width: 36px;
                height: 36px;
                background: url('../../../static/image/fuel.png') no-repeat center center;
                background-size: 20px 30px;
                transform: scale(1) !important;
                &:hover {
                    transform: scale(1);
                }
            }
            .el-slider__runway {
                height: 8px;
                border-radius: 2px; 
            }
            .el-slider__bar {
                height: 8px;
                background: #012B5C
            }
        }
        .rate {
            position: relative;
            width: 478px;
            height: 20px;
            margin-left: 47px;
            margin-bottom: 20px;
            line-height: 20px;
            span {
                position: absolute;
                top: 0;
                &:nth-child(1) {
                    left: 0;
                }
                &:nth-child(2) {
                    left: 50%;
                    margin-left: -10px;
                }
                &:nth-child(3) {
                    right: 0;
                }
            }
        }
        .radio {
            padding-top: 32px;
            border-top: 1px solid #F2F2F2;
            .el-col {
                height: 38px;
                margin-bottom: 10px;
                background: #F8F8F8;
                line-height: 38px;
                label:nth-child(1) {
                    width: 120px;
                    text-indent: 10px;
                }
                .el-input__inner {
                    height: 28px;
                    background: #FFF;
                    border: 1px solid #BFCBD9;
                    border-radius: 3px;
                }
            }
            .date-picker {
                margin-left: 10px;
                height: 32px;
            }
        }
        .resume-wrap {
            border: none !important;
            label {
                display: block;
            }
            .resume {
                width: 80%;
                height: 36px;
                margin-top: 8px;
                border: 1px solid #bfcbd9;
                border-radius: 4px;
                text-align: center;
                line-height: 36px;
            }
            .resume-detail {
                width: 126px;
                height: 36px;
                margin-top: 30px;
                color: #FFF;
                border: none;
            }
            .toggle {
                margin-top: 30px;
                float: right
            }
        }
        .coupon{
            margin-top: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solId #F2F2F2;
            .el-col {
                div{
                    height: 50px;
                    text-align: center;
                    line-height: 50px;
                }
                div:nth-child(2n+1) {
                    background: #F6F6F6;
                }
            }
        }
        .el-textarea {
            width: 70%;
            margin-left: 10px;
            vertical-align: middle;
        }
        .tip {
            margin: 20px 0;
            .money {
                width: 172px !important;
                margin: 0 10px;
            }
        }
        .tyre {
            margin-bottom: 10px;
            .el-radio {
                margin-left: 20px;
            }
            .el-input {
                width: 60px !important;
            }
        }
        .fast-add {
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: bold;
        }
        .reset {
            float: right;
            margin-top: 20px;
            margin-right: 30px;
        }
        .el-btn {
            padding: 30px;
            background: #FFF;
            text-align: right;
        }
        .service {
            height: 42px;
            box-sizing: border-box;
            padding-right: 30px;
            background: #F6F6F6;
            border-bottom: 1px solid #ddd;
            text-align: center;
            line-height: 42px;
        }
        .car {
            position: relative;
            margin-top: 30px;
            .car-svg {
               position: absolute;
               top: 0;
               left: 0;
               right: 0;
               bottom: 0;
               width: 100%;
               height: 100%;
               rect {
                   fill: white; 
                   opacity: 0; 
                   cursor: pointer
               }
            } 
        }
        .car-mask {
            padding-bottom: 60px;
            .el-dialog {
                position: relative;
                min-width: 800px;
                height: 520px;
                overflow: hidden;
            }
            .car-mask {
                height: 340px;
                overflow: hidden;
            }
            .canvas-wrap {
                height: 340px;
                overflow: hidden;
                canvas {
                    position: relative;
                }
                .canvas1 {
                    left: -430px;
                    top: 30px;
                }
                .canvas2 {
                    left: -60px;
                    top: -150px;
                }
                .canvas3 {
                    left: -60px;
                    top: -315px;
                }
                .canvas4 {
                    left: -60px;
                    top: -575px;
                }
                .canvas5 {
                    left: -430px;
                    top: -90px;
                }
                .canvas6 {
                    left: -430px;
                    top: -250px;
                }
                .canvas7 {
                    left: -430px;
                    top: -450px;
                }
                .canvas8 {
                    left: -430px;
                    top: -580px;
                }
                .canvas9 {
                    left: -470px;
                    top: -670px;
                }
                .canvas10 {
                    left: -830px;
                    top: -150px;
                }
                .canvas11 {
                    left: -830px;
                    top: -315px;
                }
                .canvas12 {
                    left: -830px;
                    top: -575px;
                }
                .canvas13 {
                    left: -430px;
                    top: -910px;
                }
            }
            .mask-btn {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 60px;
                line-height: 60px;
                label {
                    display: inline-block;
                    width: 100px;
                    text-align: center;
                    cursor: pointer;
                }
                .service-code {
                    background: url(../../../static/image/sanjiao.png) no-repeat 20px center;
                }
                .service-name {
                    background: url(../../../static/image/yuan.png) no-repeat 2px center;
                }
                .display-name {
                    background: url(../../../static/image/cha.png) no-repeat 2px center;
                }
            }
        }
        .temp .el-row {
            height: 50px;
            overflow: hidden;
            background: #F6F6F6;
            border-bottom: 1px solid #DDD;
            text-align: center;
            line-height: 50px;
            .el-col {
                width: auto;
                max-width: 10%;
                margin-left: 10px;
            }
        }
        .temp .el-button {
            float: right;
            margin-top: 10px;
        }
        .car-service {
            height: 50px;
            line-height: 50px;
            text-align: center;
            .service-code {
                background: url(../../../static/image/sanjiao.png) no-repeat 48px center;
            }
            .service-name {
                background: url(../../../static/image/yuan.png) no-repeat 30px center;
            }
            .display-name {
                background: url(../../../static/image/cha.png) no-repeat 30px center;
            }
        }
        .temp-btn {
            margin-top: 10px;
            padding-top: 30px;
            border-top: 1px solid #f2f2f2;
            text-align: center;
        }
        .check {
            .car-service {
                width: 90%;
                height: 40px;
                margin: 0 auto;
                border: 1px solid #F2F2F2;
                line-height: 40px;
            }
        }
        .el-autocomplete {
            width: 100%;
        }
        .overdue {
            width: 125px;
            height: 36px;
            margin-top: 10px;
            border: 1px solid #bfcbd9;
            border-radius: 4px;
        }
        .el-input.is-disabled .el-input__inner {
            color: #3e515b !important;
            background: #EDF1F7 !important
        }
        #uploadUrl {
            margin-top: 20px;
        }
        .no-data {
            margin: 20px 0 10px;
            text-align: center;
        }
        .ellipsis {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .hidden input {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .el-dialog__body {
            padding: 20px 30px !important;
        }
    }
</style>
