<template>
    <div>
        <b-card header="添加服务">
            <div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="服务名称" label-text-align="right" :label-cols="4">
						<div class="text-left">
                            <search
                                ref="search"
                                :hasCheck="required"
                                :dataList="datalist"
                                option="serviceName"
                                @dataChange="querySelect"
                                @itemValue="itemValue"
                                @clickShowBack="firstLoad"
                                @comScroll="comScroll"
                                :disabled="isforbidden">
                            </search>
                        </div>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="服务编码" label-text-align="right" :label-cols="4">
						<b-form-input :value="addPriceCondition.serviceCode" readonly placeholder="" />
					</b-form-fieldset>
				</div>
			</div>
        </b-card>
        <b-card header="商品用量">
            <div class="row">
				<div class="col-md-12">
					<div class="pull-right">
						<b-button size="sm" variant="success" @click="addPrice">添加价格</b-button>
					</div>
				</div>
			</div>
            <div class="table-scrollable">
				<b-table striped hover bordered show-empty :items="servicelist" :fields="fieldsOne">
                    <template slot="empty">
						暂无数据...
					</template>
				</b-table>
            </div>
        </b-card>
        <b-card header="服务价格信息">
            <div class="row">
				<div class="col-md-12">
					<div class="pull-right">
						<b-button size="sm" variant="success" @click="letOn">上架</b-button>
						<b-button size="sm" variant="warning" @click="letDown">下架</b-button>
						<b-button size="sm" variant="danger" @click="deleteItems">删除</b-button>
					</div>
				</div>
			</div>
            <div class="table-scrollable">
				<b-table striped hover bordered show-empty :items="submitpricelist" :fields="fieldsTwo">
                    <template slot="index" slot-scope="data">
                        <div>
                            <input type="checkbox" name="selected" :value="data.item.priceCode" v-model="selected"></input>
                        </div>
                    </template>
                    <template slot="onOffFlag" slot-scope="data">
                        {{ data.item.onOffFlag === 0? '下架' : '上架' }}
                    </template>
                    <template slot="empty">
						暂无数据...
					</template>
				</b-table>
            </div>
        </b-card>
        <b-modal id="modalPrevent"
                size="lg"
                title="添加价格"
                v-model="addPriceModel"
                ref="modalprice"
                @ok="addOk"
                @shown="addclearName"
                ok-title="确认"
                cancel-title="取消">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="渠道" label-text-align="right" :label-cols="4">
                            <b-form-select v-model="addPriceCondition.channelType" :state="addPriceState.channelType" :options="channels"/>
                        </b-form-fieldset>
                    </div>
                    <!-- <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="行政区域" label-text-align="right" :label-cols="4">
                            <chinarea ref="chinarea" :eorror="addPriceState.storeAddress" v-model="provinceCityDistrict" @check-change="checkChange"></chinarea>
                        </b-form-fieldset>
                    </div> -->
                <!-- </div>
                <div class="row"> -->
                    <!-- <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="销售区域" label-text-align="right" :label-cols="4">
                            <areaqueryshop ref="areaqueryshop" :error="addPriceState.storeState"  @select-change="selectedfun"></areaqueryshop>
                        </b-form-fieldset>
                    </div> -->
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="服务工时" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="addPriceCondition.workHours" :state="addPriceState.workHours" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="服务预售价格" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="addPriceCondition.servicePrice" :state="addPriceState.servicePrice" placeholder="" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6" :class="{'controlEl_Time' : addPriceState.timeStart}">
                        <b-form-fieldset horizontal label="生效时间" label-text-align="right" :label-cols="4">
                            <el-date-picker
                                v-model="timeStep"
                                type="daterange"
                                @change="datechange()"
                                :clearable="true"
                                :editable="false"
                                :picker-options="pickerOptions0"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="市场价（最低）" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="addPriceCondition.marketPriceMin" placeholder="" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="市场价（最高）" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="addPriceCondition.marketPriceMax" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="指导价（最高）" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="addPriceCondition.guidingPriceMax" placeholder="" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="指导价（最低）" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="addPriceCondition.guidingPriceMin" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="扩展价格" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="addPriceCondition.add1Price" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <scopeclear :addscope="addscope"></scopeclear>
                <div class="table-scrollable">
				    <b-table striped hover bordered show-empty :items="rangelist" :fields="rangefields">
                        <template slot="index" slot-scope="data">
                            <input type="radio" :value="data.index" v-model="rangeSelect">
                        </template>
                        <template slot="empty">
                            暂无数据...
                        </template>
				    </b-table>
                </div>
                <div class="row">
				    <div class="col-md-12">
                        <div class="pull-right">
                            <b-button size="sm" variant="danger" @click="deleteRange">删除</b-button>
                        </div>
                    </div>
                </div>
        </b-modal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import config from 'common/config'
    import common from 'common/common'
    import api from 'common/api'
    import search from 'components/iris-search/search.vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import chinarea from 'components/iris-chinaarea/index.vue'
    import { MessageBox, Message, DatePicker } from 'element-ui'
    // import Scope from 'components/iris-scope'
    import scopeclear from 'components/iris-scope-clear'
    Vue.use(DatePicker)
    export default {
        components: {
            search,
            areaqueryshop,
            chinarea,
            // Scope,
            scopeclear
        },
        data() {
            return {
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                rangeSelect: -1,
                selected: [],
                timeStep: [],
                provinceCityDistrict: '',
                channels: [],
                addPriceCondition: {
                    priceCode: '',
                    serviceCode: '',
                    serviceName: '',
                    startTime: '',
                    endTime: '',
                    onOffFlag: 0,
                    chinaAreaCode: '',
                    salesAreaCode: '',
                    workHours: '',
                    storeCode: '',
                    channelType: '',
                    servicePrice: '',
                    marketPriceMin: '',
                    marketPriceMax: '',
                    guidingPriceMin: '',
                    guidingPriceMax: '',
                    add1Price: '',
                    add2Price: '',
                    add3Price: '',
                    add4Price: '',
                    add5Price: '',
                    add6Price: ''
                },
                addPriceState: {
                    timeStart: false,
                    workHours: null,
                    storeAddress: null,
                    channelType: null,
                    servicePrice: null,
                    storeState: false
                },
                selectParams: {
                    priceType: 1,
                    pageNums: config.pageNums,
                    pageStart: 1,
                    onOffFlag: 1
                },
                rangelist: [],
                datalist: [],
                rangefields: {
                    index: {
                        label: '选择'
                    },
                    chinaAreaName: {
                        label: '行政区域'
                    },
                    salesAreaName: {
                        label: '销售区域'
                    },
                    storeName: {
                        label: '门店'
                    }
                },
                isLastPage: false,
                isforbidden: false,
                required: false,
                addPriceModel: false,
                servicelist: [],
                fieldsOne: {
                    skuCode: {
                        label: '商品编码'
                    },
                    skuName: {
                        label: '商品名称'
                    },
                    skuBrandName: {
                        label: '品牌'
                    },
                    skuCategoryName: {
                        label: '分类'
                    },
                    skuStandards: {
                        label: '规格'
                    },
                    skuModel: {
                        label: '型号'
                    },
                    barCode: {
                        label: '69码'
                    },
                    originalCode: {
                        label: '原厂编码'
                    },
                    needQty: {
                        label: '商品用量'
                    }
                },
                submitpricelist: [],
                fieldsTwo: {
                    index: {
                        label: '选择'
                    },
                    channelTypeName: {
                        label: '渠道'
                    },
                    chinaAreaName: {
                        label: '行政区域'
                    },
                    salesAreaName: {
                        label: '销售区域'
                    },
                    storeName: {
                        label: '使用门店'
                    },
                    workHours: {
                        label: '服务工时'
                    },
                    servicePrice: {
                        label: '￥服务销售价格'
                    },
                    marketPriceMin: {
                        label: '￥市场价（最低）'
                    },
                    marketPriceMax: {
                        label: '￥市场价（最高）'
                    },
                    guidingPriceMin: {
                        label: '指导价（最低）'
                    },
                    guidingPriceMax: {
                        label: '指导价（最高）'
                    },
                    startTime: {
                        label: '开始时间'
                    },
                    endTime: {
                        label: '截至时间'
                    },
                    onOffFlag: {
                        label: '状态'
                    }
                }
            }
        },
        methods: {
            // 删除适用范围
            deleteRange() {
                let index = this.rangeSelect
                this.rangelist.splice(index, 1)
                this.rangeSelect = -1
            },
            // 适用范围事件
            addscope(code , data) {
                // console.log(code, data)
                if(code === 'rangeTpyeChinaArea') {
                    let judge = false
                    this.rangelist.forEach(element => {
                        if(element.chinaAreaCode === data.code) {
                            judge = true
                        }
                    })
                    if(judge) {
                        return
                    }
                    let obj = {}
                    obj.chinaAreaName = data.name
                    obj.chinaAreaCode = data.code
                    this.rangelist.push(obj)
                }else if(code === 'rangeTpyeSalesArea') {
                    let judge = false
                    this.rangelist.forEach(element => {
                        if(element.salesAreaCode === data.code) {
                            judge = true
                        }
                    })
                    if(judge) {
                        return
                    }
                    let obj = {}
                    obj.salesAreaName = data.name
                    obj.salesAreaCode = data.code
                    this.rangelist.push(obj)
                }else {
                    let judge = false
                    this.rangelist.forEach(element => {
                        if(element.storeCode === data.store.value) {
                            judge = true
                        }
                    })
                    if(judge) {
                        return
                    }
                    let obj = {}
                    obj.storeCode = data.store.value
                    obj.storeName = data.store.text
                    this.rangelist.push(obj)
                }
            },
            // 模态框时间选择
            datechange() {
                const _this = this
                let timeObj = common.formattingTime(_this.timeStep)
                if(timeObj.startTime === '1970-01-01') {
                    _this.addPriceCondition.startTime = ''
                    _this.addPriceCondition.endTime = ''
                }else {
                    _this.addPriceCondition.startTime = _this.timeStep[0] ? _this.timeStep[0].getTime() : ''
                    _this.addPriceCondition.endTime = _this.timeStep[1] ? _this.timeStep[1].getTime() : ''
                    // console.log(_this.timeStep[0].getTime())
                    // console.log(_this.timeStep[1].getTime())
                }
            },
            // 模态框销售区域 
            selectedfun(data, data1) {
                const _this = this
                if(Array.isArray(data)) {
                    _this.addPriceCondition.salesAreaCode = data[0] ? data[0].code: ''
                }else {
                    _this.addPriceCondition.salesAreaCode = data.code ? data.code : ''
                }
                if(Array.isArray(data1)) {

                }else {
                    if(data1.value) {
                        _this.addPriceCondition.storeCode = data1.value
                    }   
                }
            },
            // 行政区域选择
            checkChange(data) {
                const _this = this
                _this.addPriceCondition.chinaAreaCode = data.node.value
            },
            // 获取渠道
            getChannels() {
                const _this = this
                let option = {
                    refCode: config.serviceStaticPrice.channelRef
                }
                api.ref.getDataDictionarys(option, (res) => {
                    if(res.data.code === 'success') {
                        let tempArr = res.data.obj.referenceDetailInfos
                        for(let i = 0; i<tempArr.length; i++) {
                            let obj = {}
                            obj.text = tempArr[i].refDetailName
                            obj.value = tempArr[i].refDetailCode
                            _this.channels.push(obj)
                        }
                    }
                })
            },
            // 搜索框内值改变   触发搜索
            querySelect(data) {
                const _this = this
                _this.selectParams.pageStart = 1;
                _this.selectParams.serviceName = data;
                let params = _this.selectParams;
                _this.getServiceName(params, function(res) {
                    _this.isLastPage = res.isLastPage
                    _this.datalist = res.list
                })
            },
            // 选中某一项
            itemValue(value) {
                const _this = this
                _this.addPriceCondition.serviceCode = value.serviceCode
                _this.addPriceCondition.serviceName = value.serviceName
                let option = {
                    serviceCode: value.serviceCode
                    // serviceCode: 'S000112'
                }
                api.serviceStatic.queryAmountByCode(option, (res) => {
                    if(res.data.code === 'success') {
                        _this.servicelist = res.data.obj
                    }
                })
                _this.getServicePriceByCode(_this.addPriceCondition.serviceCode)
            },
            firstLoad() {
                const _this = this
                if(_this.datalist.length != 0 ){
                    return
                }
                let params = _this.selectParams
                _this.getServiceName(params, function(res) {
                    _this.isLastPage = res.isLastPage
                    _this.datalist = res.list
                })
            },
            // 滚动加载
            comScroll(isEnd) {
                if (isEnd && !this.isLastPage) {
                    this.selectParams.pageStart ++
                    let params = this.selectParams;
                    this.getServiceName(params, obj => {
                        this.isLastPage = obj.isLastPage;
                        this.datalist = this.datalist.concat(obj.list);
                    });
                }
            },
            // 定义向后台请求serviceName的方法
            getServiceName(params,callback) {
                api.serviceitem.queryByPage(params, res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        callback(obj);
                    }
                })
            },
            // 上架
            letOn() {
                const _this = this
                if(_this.selected.length === 0) {
                    Message({
                        type: 'warning',
                        message: '请选择要上架的条目'
                    })
                    return
                }else {
                    let tempArr = _this.selected
                    let submitArr = []
                    for(let i = 0; i< tempArr.length; i++) {
                        for(let j = 0; j< _this.submitpricelist.length; j++) {
                            if((tempArr[i] === _this.submitpricelist[j].priceCode)&&(_this.submitpricelist[j].onOffFlag===0)) {
                                submitArr.push(tempArr[i])
                            }
                        }
                    }
                    if(submitArr.length === 0) {
                        Message({
                            type: 'warning',
                            message: '已上架商品不可执行上架'
                        })
                        return;
                    }else {
                        // submitArr.forEach(value => {
                        //     value.onOffFlag = 1
                        // })
                        let submitObj = {
                            priceCodeList: submitArr,
                            onOffFlag: 1,
                            isDeleted: 0
                        }
                        api.serviceStatic.update(submitObj, (res) => {
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'info',
                                    message: '上架成功'
                                })
                                _this.selected = []
                                _this.getServicePriceByCode(_this.addPriceCondition.serviceCode)
                            }
                        })
                    }
                }
            },
            // 下架
            letDown() {
                const _this = this
                if(_this.selected.length === 0) {
                    Message({
                        type: 'warning',
                        message: '请选择要下架的条目'
                    })
                    return
                }else {
                    let tempArr = _this.selected
                    let submitArr = []
                    for(let i = 0; i< tempArr.length; i++) {
                        for(let j = 0; j< _this.submitpricelist.length; j++) {
                            if((tempArr[i] === _this.submitpricelist[j].priceCode)&&(_this.submitpricelist[j].onOffFlag===1)) {
                                submitArr.push(tempArr[i])
                            }
                        }
                    }
                    if(submitArr.length === 0) {
                        Message({
                            type: 'warning',
                            message: '已下架商品不可执行下架'
                        })
                        return;
                    }else {
                        // submitArr.forEach(value => {
                        //     value.onOffFlag = 0
                        // })
                        let submitObj = {
                            priceCodeList: submitArr,
                            onOffFlag: 0,
                            isDeleted: 0
                        }
                        api.serviceStatic.update(submitObj, (res) => {
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'info',
                                    message: '下架成功'
                                })
                                _this.selected = []
                                _this.getServicePriceByCode(_this.addPriceCondition.serviceCode)
                            }
                        })
                    }
                }
            },
            // 删除
            deleteItems() {
                const _this = this
                if(_this.selected.length === 0) {
                    Message({
                        type: 'warning',
                        message: '请选择要删除的条目'
                    })
                    return
                }else {
                    let tempArr = _this.selected
                    let submitArr = []
                    for(let i = 0; i< tempArr.length; i++) {
                        for(let j = 0; j< _this.submitpricelist.length; j++) {
                            if((tempArr[i] === _this.submitpricelist[j].priceCode)&&(_this.submitpricelist[j].onOffFlag === 0)) {
                                submitArr.push(tempArr[i])
                            }
                        }
                    }
                    // submitArr.forEach(value => {
                    //     value.isDeleted = '1'
                    // })
                    if(submitArr.length === 0) {
                        Message({
                            type: 'warning',
                            message: '上架商品不可执行删除'
                        })
                        return;
                    }else {
                        MessageBox.confirm('删除为不可逆操作, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            // 配置入库信息
                            let submitObj = {
                                priceCodeList: submitArr,
                                onOffFlag: 0,
                                isDeleted: 1
                            }
                            api.serviceStatic.update(submitObj, (res) => {
                                if(res.data.code === 'success') {
                                    Message({
                                        type: 'info',
                                        message: '删除成功'
                                    })
                                    _this.selected = []
                                    _this.getServicePriceByCode(_this.addPriceCondition.serviceCode)
                                }
                            })
                        }).catch(() => {
                            Message({
                            type: 'info',
                            message: '已取消删除'
                            })        
                        })
                    }
                }
            },
            // 服务项 
            addPrice() {
                const _this = this
                if(_this.addPriceCondition.serviceName === '') {
                    Message({
                        type: 'warning',
                        message: '请选择服务'
                    })
                    return
                }
                _this.reset()
                _this.addPriceModel = true
                // _this.$refs.areaqueryshop.resetToStart()
            },
            // 添加价格模态框确定事件
            addOk(evt) {
                const _this = this
                if(_this.addPriceCondition.workHours - 0) {
                    if(_this.addPriceCondition.workHours - 0 < 0) {
                        _this.addPriceCondition.workHours = ''
                    }
                }else {
                    _this.addPriceCondition.workHours = ''
                }
                if(_this.addPriceCondition.add1Price - 0) {
                    if(_this.addPriceCondition.add1Price - 0 < 0) {
                        _this.addPriceCondition.add1Price = ''
                    }
                }else {
                    _this.addPriceCondition.add1Price = ''
                }
                if(_this.addPriceCondition.marketPriceMax - 0) {
                    if(_this.addPriceCondition.marketPriceMax - 0 < 0) {
                        _this.addPriceCondition.marketPriceMax = ''
                    }
                }else {
                    _this.addPriceCondition.marketPriceMax = ''
                }
                if(_this.addPriceCondition.marketPriceMin - 0) {
                    if(_this.addPriceCondition.marketPriceMin - 0 < 0) {
                        _this.addPriceCondition.marketPriceMin = ''
                    }
                }else {
                    _this.addPriceCondition.marketPriceMin = ''
                }
                if(_this.addPriceCondition.guidingPriceMin - 0) {
                    if(_this.addPriceCondition.guidingPriceMin - 0 < 0) {
                        _this.addPriceCondition.guidingPriceMin = ''
                    }
                }else {
                    _this.addPriceCondition.guidingPriceMin = ''
                }
                if(_this.addPriceCondition.guidingPriceMax - 0) {
                    if(_this.addPriceCondition.guidingPriceMax - 0 < 0) {
                        _this.addPriceCondition.guidingPriceMax = ''
                    }
                }else {
                    _this.addPriceCondition.guidingPriceMax = ''
                }
                if(_this.addPriceCondition.servicePrice - 0) {
                    if(_this.addPriceCondition.servicePrice - 0 < 0) {
                        _this.addPriceCondition.servicePrice = ''
                    }
                }else {
                    _this.addPriceCondition.servicePrice = ''
                }
                if(!this.rangelist.length) {
                    Message({
                        type: 'warning',
                        message: '请选择适用范围'
                    })
                } 
                let option = {
                    serviceCode: _this.addPriceCondition.serviceCode,
                    startTime: _this.addPriceCondition.startTime,
                    endTime: _this.addPriceCondition.endTime,
                    onOffFlag: _this.addPriceCondition.onOffFlag,
                    chinaAreaCode: _this.addPriceCondition.chinaAreaCode,
                    salesAreaCode: _this.addPriceCondition.salesAreaCode,
                    storeCode: _this.addPriceCondition.storeCode,
                    channelType: _this.addPriceCondition.channelType,
                    servicePrice: _this.addPriceCondition.servicePrice,
                    marketPriceMin: _this.addPriceCondition.marketPriceMin,
                    marketPriceMax: _this.addPriceCondition.marketPriceMax,
                    guidingPriceMin: _this.addPriceCondition.guidingPriceMin,
                    guidingPriceMax: _this.addPriceCondition.guidingPriceMax,
                    add1Price: _this.addPriceCondition.add1Price,
                    workHours: _this.addPriceCondition.workHours
                }
                // let currentTime = new Date()
                // let currentYear = currentTime.getFullYear() + ''
                // let currentMonth = (currentTime.getMonth() + 1) < 9 ? ('0' + (currentTime.getMonth() + 1)) : ((currentTime.getMonth() + 1) + '')
                // let currentDay = currentTime.getDate() < 9 ? ('0' + currentTime.getDate()) : (currentTime.getDate() + '')
                // let judgeCurrent = (currentYear+currentMonth+currentDay) - 0
                // let needArr = option.startTime.split('-')
                // let needJudge = (needArr[0]+needArr[1]+needArr[2]) - 0
                if(option.channelType === '') {
                    evt.preventDefault()
                    _this.addPriceState.channelType = false
                    return
                }
                if(option.workHours === '') {
                    evt.preventDefault()
                    _this.addPriceState.workHours = false
                    return
                }
                if(option.servicePrice === '') {
                    evt.preventDefault()
                    _this.addPriceState.servicePrice = false
                    return
                }
                
                // if(judgeCurrent > needJudge) {
                //     evt.preventDefault()
                //     // debugger
                //     _this.addPriceState.timeStart = true
                //     return
                // }
                if(_this.timeStep.length === 0) {
                    evt.preventDefault()
                    // debugger
                    _this.addPriceState.timeStart = true
                    return
                }
                let optionArray = []
                this.rangelist.forEach(element => {
                    let obj = {
                        serviceCode: option.serviceCode,
                        startTime: option.startTime,
                        endTime: option.endTime,
                        onOffFlag: option.onOffFlag,
                        chinaAreaCode: element.chinaAreaCode,
                        salesAreaCode: element.salesAreaCode,
                        storeCode: element.storeCode,
                        channelType: option.channelType,
                        servicePrice: option.servicePrice,
                        marketPriceMin: option.marketPriceMin,
                        marketPriceMax: option.marketPriceMax,
                        guidingPriceMin: option.guidingPriceMin,
                        guidingPriceMax: option.guidingPriceMax,
                        add1Price: option.add1Price,
                        workHours: option.workHours
                    }
                    optionArray.push(obj)
                })
                if(!optionArray.length) {
                    Message({
                        type: 'warning',
                        message: '请选择适用范围'
                    })
                    return
                }
                _this.getPriceCode(optionArray)
            },
            addclearName() {

            },
            // 获取价格编码
            getPriceCode(params) {
                const _this = this
                _this.addPriceState.channelType = null
                _this.addPriceState.storeAddress = false
                _this.addPriceState.storeState = false
                _this.addPriceState.workHours = null
                _this.addPriceState.timeStart = false
                let option = {
                    getNums: params.length,
                    serviceCode: config.serviceStaticPrice.priceSeq
                }
                api.ordinalInfo.getSequenceList(option, (res) => {
                    if(res.data.code === 'success') {
                        // _this.addPriceCondition.priceCode = res.data.obj
                        for(let i = 0; i<res.data.obj.length; i++) {
                            params[i].priceCode = res.data.obj[i]
                        }
                        // params.priceCode = res.data.obj
                        api.serviceStatic.add(params, (res) => {
                            if(res.data.code === 'success') {
                                _this.addPriceModel = false
                                Message({
                                    type: 'success',
                                    message: '新增成功'
                                })
                                _this.reset()
                                _this.getServicePriceByCode(_this.addPriceCondition.serviceCode)
                            }
                        })
                    }
                })
            },
            // 清空模态框数据
            reset() {
                const _this = this
                _this.provinceCityDistrict = ''
                _this.addPriceCondition= {
                    priceCode: '',
                    serviceCode: _this.addPriceCondition.serviceCode,
                    serviceName: _this.addPriceCondition.serviceName,
                    startTime: '',
                    endTime: '',
                    onOffFlag: 0,
                    chinaAreaCode: '',
                    salesAreaCode: '',
                    workHours: '',
                    storeCode: '',
                    channelType: '',
                    servicePrice: '',
                    marketPriceMin: '',
                    marketPriceMax: '',
                    guidingPriceMin: '',
                    guidingPriceMax: '',
                    add1Price: '',
                    add2Price: '',
                    add3Price: '',
                    add4Price: '',
                    add5Price: '',
                    add6Price: ''
                }
                // _this.$refs.areaqueryshop.resetToStart()
                _this.timeStep = []
                _this.rangelist = []
            },
            // 通过serviceCode 获取 服务价格
            getServicePriceByCode(arg) {
                const _this = this
                let option = {
                    serviceCode: arg
                }
                api.serviceStatic.queryByCode(option, (res) => {
                    if(res.data.code === 'success') {
                        _this.submitpricelist = res.data.obj
                    }
                })
            },
            getUrlCode() {
                const _this = this
                let urlCode = _this.$route.params.code
                if(urlCode === '0') {
                    // _this.getPriceCode()
                }else {
                    _this.getServicePriceByCode(urlCode)
                }
            }
        },
        created() {
            const _this = this
            _this.getUrlCode()
            _this.getChannels()
        }
    }
</script>
<style>
    .controlEl_Time .el-input__inner {
        border: 1px solid #ff4949 !important;
    }
</style>
