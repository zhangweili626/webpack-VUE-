<template>
    <div @click="hideFrameAdd">
        <b-card header="查询">
            <div class="row" @click="hideFrame">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="区域经销商店" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshopQuery" :storeAll="true" @select-change="selectedfunquery"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="仓库" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="whCode" :options="whList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="库区" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="whAreaCode" :options="whAreaList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="库位" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryParams.whLocationCode" :options="whLocationList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <!-- <b-form-fieldset horizontal label="商品名称/编码" label-text-align="right" :label-cols="4">
                        <b-form-input />
                    </b-form-fieldset> -->
                    <div class="skuNameOrskuCode">
                        <div class="skuNameOrskuCodeLabel">商品名称</div>
                        <input type="text" v-model="skuName" @click.stop="stopPop" @focus="showFrame"/>
                        <div v-if="isShowFrameQuery" class="skuNameOrskuCodeContainer">
                            <div class="skuNameOrskuCodeContainerItem" v-for="(item, index) in skuList" @click.stop="itemClick(item)">{{ item.skuName }} &nbsp;&nbsp;{{ item.skuCode }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset">重置</b-button>
                        <b-button size="sm" variant="primary" @click="query(1)">查询</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left" @click="hideFrame">
                        <upload :buttonName="buttonName" v-if="addPlace" :messageTip="messageTip" :url="url" :addParams="uploadParams" @error-event="acceptData"></upload>
                        <!-- <b-button size="sm" variant="warning">导入</b-button> -->
                        <b-button size="sm" variant="primary" v-if="editPlace" @click="edit">编辑</b-button>
                        <b-button size="sm" variant="success" v-if="addPlace" @click="add">新增</b-button>
                        <b-button size="sm" variant="danger" v-if="editPlace" @click="sureDelete">作废</b-button>                        
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="skuPlacelist" :fields="fields">
                    <template slot="index" slot-scope="data">
                        <input type="radio" name="index" :value="data.index" v-model="currentIndex" @click="setSkuPlaceCode(data.item)">
                    </template>
                    <template slot="empty">
                        暂无数据...
                    </template>
                </b-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="pageChange" :page-no="page.pageNo" :page-size="page.pageSize" :total-result="page.totalResult" :total-pages="page.totalPages">
                 </pagination>
               </div>
            </div>
        </b-card>
        <b-modal id="modalPrevent"
                ref="mydeletemodalcard"
                size="lg"
                :title="modalTitle"
                :hide-footer="true">
                <!-- <div class="sku-place-modal-title">
                    {{ modalTitle }}页
                </div> -->
                <div class="row" @click="hideFrameAdd">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="目录编码" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="addParams.skuLocationCode" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="创建人" label-text-align="right" :label-cols="4">
                            <b-form-input :value="modalCreateBy" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div v-if="modalCreateTime" class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="创建时间" label-text-align="right" :label-cols="4">
                            <b-form-input :value="modalCreateTime" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div v-if="modalUpdateBy" class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="最后一次修改人" label-text-align="right" :label-cols="4">
                            <b-form-input :value="modalUpdateBy" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div v-if="modalUpdateTime" class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="最后一次更新时间" label-text-align="right" :label-cols="4">
                            <b-form-input :value="modalUpdateTime" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <div class="skuNameOrskuCode" :class="{'judgeSkuOrNumber': addState.skuCode}">
                            <div class="skuNameOrskuCodeLabel">商品名称</div>
                            <input type="text" v-model="addSkuName" @click.stop="stopPop" @focus.stop="showFrameAdd"/>
                            <div v-if="isShowFrameAdd" class="skuNameOrskuCodeContainer">
                                <div class="skuNameOrskuCodeContainerItem" v-for="(item, index) in addSkuList" @click.stop="addItemClick(item)">{{ item.skuName }} &nbsp;&nbsp;{{ item.skuCode }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="区域经销商店*" label-text-align="right" :label-cols="4">
                            <areaqueryshop ref="areaqueryshopAdd" :error="addState.storeCode" @select-change="selectedfunadd"></areaqueryshop>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="仓库*" label-text-align="right" :label-cols="4">
                            <b-form-select v-model="addWhCode"  :options="addWhlist" :state="addState.whCode" :disabled="!addStoreCode"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="库区*" label-text-align="right" :label-cols="4">
                            <b-form-select v-model="addWhAreaCode" :state="addState.whAreaCode" :disabled="!addWhCode" :options="addWhArealist"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="库位*" label-text-align="right" :label-cols="4">
                            <!-- <el-select v-model="addWhLocationCode" @change="selectChange">
                                <el-option
                                v-for="item in addWhLocationlist"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select> -->
                            <b-form-select v-model="addWhLocationCode" :state="addState.whLocationCode" :disabled="!addWhAreaCode" :options="addWhLocationlist"/>
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="pull-right">
                            <b-button size="sm" variant="default" @click="cancel">取消</b-button>
                            <b-button size="sm" variant="success" @click="save">保存</b-button>
                        </div>
                    </div>
                </div>
        </b-modal>
        <b-modal id="modalPrevent"
                ref="backEndErrorTips"
                size="lg"
                title="报错信息"
                :hide-footer="true">
                <div class="backEndErrorTips">
                    {{ errorMessage }}
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="pull-right">
                            <b-button size="sm" variant="default" @click="closeError">关闭</b-button>
                        </div>
                    </div>
                </div>
        </b-modal>
        <irismodal ref="modalofsure" @sureEvent="removeItem"></irismodal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import pagination from 'components/pagination/pagination.vue'
    import upload from 'components/iris-upload'
    import { MessageBox, Message, Select, Option } from 'element-ui'
    import api from 'common/api'
    import config from 'common/config'
    import common from 'common/common'
    import collectionApi from 'common/api-collection.js'
    import {hasBtn} from 'common/api-common.js'
    import irismodal from 'components/iris-modal/'
    import { setTimeout } from 'timers';
    Vue.use(Select)
    Vue.use(Option)
    export default {
        components: {
            areaqueryshop,
            pagination,
            upload,
            irismodal
        },
        data() {
            return {
                messageTip: '导入成功',
                uploadParams: {
                    // relationCode: config.skuPlace.seq,
                    relationCode: '',
                    singleFlag: 1,
                    businessType: 'skuPlace'
                },
                buttonName: '导入',
                currentIndex: '',
                currentSkuPlace: '',
                skuName: '',
                whList: [],
                url: config.skuPlace.url,
                whAreaList: [],
                modalCreateBy: '',
                modalCreateTime: '',
                modalUpdateBy: '',
                modalUpdateTime: '',
                whLocationList: [],
                isShowFrameQuery: false,
                isShowFrameAdd: false,
                skuList: [],
                whCode: '',
                whAreaCode: '',
                addSkuName: '',
                addSkuList: [],
                addStoreCode: '',
                addWhCode: '',
                addWhAreaCode: '',
                addWhLocationCode: '',
                addWhlist: [],
                addWhArealist: [],
                addWhLocationlist: [],
                queryParams: {
                    skuCode: '',
                    skuName: '',
                    storeCode: '',
                    whCode: '',
                    whAreaCode: '',
                    whLocationCode: '',
                    storeCodeList: []
                },
                errorMessage: '',
                addParams: {
                    id: '',
                    skuCode: '',
                    storeCode: '',
                    whCode: '',
                    whAreaCode: '',
                    whLocationCode: '',
                    skuLocationCode: ''
                },
                addState: {
                    skuCode: false,
                    whCode: null,
                    whAreaCode: null,
                    whLocationCode: null,
                    storeCode: false
                },
                skuPlacelist: [],
                editState: false,
                modalTitle: '新增',
                page: {

                },
                fields: {
                    index: {
                        label: '操作'
                    },
                    skuLocationCode: {
                        label: '目录编码'
                    },
                    skuCode: {
                        label: '商品编码'
                    },
                    skuName: {
                        label: '商品名称'
                    },
                    areaName: {
                        label: '区域'
                    },
                    storeName: {
                        label: '门店'
                    },
                    whName: {
                        label: '仓库'
                    },
                    whAreaName: {
                        label: '库区'
                    },
                    createBy: {
                        label: '创建人'
                    },
                    updateBy: {
                        label: '最后一次修改人'
                    },
                    whLocationName: {
                        label: '库位'
                    },
                    createTimeStr: {
                        label: '创建时间'
                    },
                    updateTimeStr: {
                        label: '最后一次更新时间'
                    }
                }
            }
        },
        computed: {
            addPlace(){
				return hasBtn(collectionApi.skuPlace.insertSkuLocationInfo);
			},
            editPlace(){
				return hasBtn(collectionApi.skuPlace.updateSkuLocationInfo);
			}
        },
        methods: {
            stopPop() {

            },
            selectChange() {
                const _this = this
                _this.addWhLocationCode = _this.addWhLocationCode
            },
            // 作废方法  引入提示模态框
            sureDelete() {
                const _this = this
                if(!_this.currentSkuPlace) {
                    Message({
                        type: 'warning',
                        message: '请选择要作废的内容'
                    })
                    return
                }
                _this.$refs.modalofsure.showDeleteModel()
            },
            closeError() {
                const _this = this
                _this.errorMessage = ''
                _this.$refs.backEndErrorTips.hide()
            },
            // 清空模态框事件
            clearModalData() {
                const _this = this
                _this.addParams = {
                    id: '',
                    skuCode: '',
                    storeCode: '',
                    whCode: '',
                    whAreaCode: '',
                    whLocationCode: '',
                    skuLocationCode: ''
                }
                _this.addSkuName = ''
                _this.addStoreCode = ''
                _this.addWhCode = ''
                _this.addWhAreaCode = ''
                _this.addWhLocationCode = ''
                _this.$refs.areaqueryshopAdd.resetToStart()
            },
            acceptData(value) {
                const _this = this
                if(value.data.code === 'fail') {
                    _this.errorMessage = value.data.message
                    _this.$refs.backEndErrorTips.show()
                }
            },
            addItemClick(value) {
                const _this = this
                _this.addParams.skuCode = value.skuCode
                _this.addParams.skuName = value.skuCode
                _this.addSkuName = value.skuName
                _this.hideFrameAdd()
            },
            // 设置选择项
            setSkuPlaceCode(value) {
                const _this = this
                _this.currentSkuPlace = value
                
            },
            selectedfunquery(arg1, arg2) {
                const _this = this
                if(arg1 && Array.isArray(arg1) && arg1[0].code === '000001' && (!arg2 || arg2.length === 0)) {
                    let option = {
                        needPageFlag: '0',
                        salesAreaCodes: [arg1[0].code]
                    }
                    api.area.queryShopInfo(option, res => {
                        if(res.data.code === 'success') {
                            let params = {
                                storeCodeSet: []
                            }
                            res.data.obj.forEach(element => {
                                params.storeCodeSet.push(element.storeCode)
                            })
                            _this.whList = []
                            api.getEntrepot(params, res => {
                                if(res.data.code === 'success') {
                                    res.data.obj.forEach(element => {
                                        let obj = {}
                                        obj.text = element.warehouseName
                                        obj.value = element.warehouseCode
                                        _this.whList.push(obj)
                                    })
                                }
                            })
                        }
                    })
                }
                if(Array.isArray(arg2)) {
                    _this.queryParams.storeCodeList = []
                    _this.queryParams.storeCode = ''
                    arg2.forEach(element => {
                        _this.queryParams.storeCodeList.push(element.value)
                    })
                }else {
                    if(arg2) {
                        _this.queryParams.storeCodeList = []
                        _this.queryParams.storeCode = arg2.value
                        if(!_this.queryParams.storeCode) {
                            return
                        }
                        _this.whList = []
                        let params = {
                            storeCodeSet: []
                        }
                        params.storeCodeSet.push(arg2.value)
                        api.getEntrepot(params, res => {
                            if(res.data.code === 'success') {
                                res.data.obj.forEach(element => {
                                    let obj = {}
                                    obj.text = element.warehouseName
                                    obj.value = element.warehouseCode
                                    _this.whList.push(obj)
                                })
                            }
                        })
                    }
                }
            },
            selectedfunadd(arg1, arg2) {
                const _this = this
                if(Array.isArray(arg2)) {

                }else {
                    if(arg2) {
                        _this.addStoreCode = arg2.value
                    }
                }
            },
            // 重置
            reset() {
                const _this = this
                _this.queryParams = {
                    skuCode: '',
                    skuName: '',
                    storeCode: '',
                    whCode: '',
                    whAreaCode: '',
                    whLocationCode: ''
                }
                _this.currentIndex = -1
                _this.skuName = ''
                _this.whCode = ''
                _this.whAreaCode = ''
                _this.$refs.areaqueryshopQuery.resetToStart()
            },
            // 查询
            query(num) {
                const _this = this
                // debugger
                _this.currentIndex = -1
                if(!_this.queryParams.skuName) {
                    _this.queryParams.skuCode = ''
                }
                if(!_this.queryParams.skuCode) {
                    _this.queryParams.skuName = _this.skuName
                }else {
                    _this.queryParams.skuName = ''
                }
                _this.queryParams.pageNums = config.pageNums
                _this.queryParams.whCode = _this.whCode
                _this.queryParams.whAreaCode = _this.whAreaCode
                _this.queryParams.pageStart = num
                api.skuPlace.querySkuLocationInfos(_this.queryParams, res => {
                    if(res.data.code === 'success') {
                        _this.skuPlacelist = res.data.obj.list
                        let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        _this.page = tempPage
                    }
                })
            },
            // 模态框确定编辑事件
            edit() {
                const _this = this
                _this.editState = true
                if(!_this.currentSkuPlace) {
                    Message({
                        type: 'warning',
                        message: '请选择要编辑的内容'
                    })
                    return
                }
                _this.modalTitle = '编辑页'
                _this.clearModalData()
                _this.modalCreateBy = _this.currentSkuPlace.createBy
                _this.modalCreateTime = _this.currentSkuPlace.createTimeStr
                _this.modalUpdateBy = _this.currentSkuPlace.updateBy
                _this.modalUpdateTime = _this.currentSkuPlace.updateTimeStr
                _this.$refs.mydeletemodalcard.show()
                let option = {
                    text: _this.currentSkuPlace.storeName,
                    value: _this.currentSkuPlace.storeCode
                }
                _this.addParams.skuLocationCode = _this.currentSkuPlace.skuLocationCode
                _this.addParams.skuCode = _this.currentSkuPlace.skuCode
                _this.addParams.skuName = _this.currentSkuPlace.skuName
                _this.$refs.areaqueryshopAdd.setselect(option)
                _this.addStoreCode = _this.currentSkuPlace.storeCode
                _this.addWhCode = _this.currentSkuPlace.whCode
                _this.addWhAreaCode = _this.currentSkuPlace.whAreaCode
                _this.addWhLocationCode = ''
                let params = {
                    whAreaCode: _this.addWhAreaCode
                }
                _this.addWhLocationlist = []
                api.skuPlace.queryWarehouseLocationInfo(params, res => {
                    if(res.data.code === 'success') {
                        let objArr = res.data.obj
                        for(let i = 0; i< objArr.length; i++) {
                            let obj = {}
                            obj.text = objArr[i].whLocationName
                            obj.value = objArr[i].whLocationCode
                            _this.addWhLocationlist.push(obj)
                        }
                        _this.addWhLocationCode = _this.currentSkuPlace.whLocationCode
                        _this.editState = false
                    }
                })
                _this.addParams.id = _this.currentSkuPlace.id
                _this.addSkuName = _this.currentSkuPlace.skuName
            },
            // 控制商品名称选择框显示和隐藏
            showFrame() {
                const _this = this
                _this.isShowFrameQuery = true
            },
            hideFrame() {
                const _this = this
                _this.isShowFrameQuery = false
            },
            showFrameAdd() {
                const _this = this
                _this.isShowFrameAdd = true
            },
            hideFrameAdd() {
                const _this = this
                _this.isShowFrameAdd = false
            },
            // 点击新增  唤起新增模态框
            add() {
                const _this = this 
                _this.editState = false
                _this.modalTitle = '新增页'
                _this.modalCreateBy = JSON.parse(common.getSession('userInfo')).empVo.empCnName
                _this.modalCreateTime = ''
                _this.modalUpdateBy = ''
                _this.modalUpdateTime = ''
                _this.clearModalData()
                _this.$refs.mydeletemodalcard.show()
                _this.getSequence()
            },
            // 换页
            pageChange(num) {
                const _this = this
                _this.currentSkuPlace = ''
                _this.query(num)
            },
            cancel() {
                const _this = this
                _this.$refs.mydeletemodalcard.hide()
            },
            // 新增保存事件
            save() {
                const _this = this
                _this.addParams.storeCode = _this.addStoreCode
                _this.addParams.whCode = _this.addWhCode
                _this.addParams.whAreaCode = _this.addWhAreaCode
                _this.addParams.whLocationCode = _this.addWhLocationCode
                let judge = false
                if(!_this.addParams.storeCode) {
                    _this.addState.storeCode = true
                    judge = true
                }else {
                    _this.addState.storeCode = false
                }
                if(!_this.addParams.skuCode) {
                    _this.addState.skuCode = true
                    judge = true
                }else {
                    _this.addState.skuCode = false
                }
                if(!_this.addParams.whCode) {
                    _this.addState.whCode = false
                    judge = true
                }else {
                    _this.addState.whCode = null
                }
                if(!_this.addParams.whAreaCode) {
                    _this.addState.whAreaCode = false
                    judge = true
                }else {
                    _this.addState.whAreaCode = null
                }
                if(!_this.addParams.whLocationCode) {
                    _this.addState.whLocationCode = false
                    judge = true
                }else {
                    _this.addState.whLocationCode = null
                }
                if(judge) {
                    return
                }
                if(_this.addParams.id) {
                    api.skuPlace.updateSkuLocationInfo(_this.addParams, res => {
                        if(res.data.code === 'success') {
                            Message({
                                type: 'success',
                                message: '保存成功'
                            })
                            _this.$refs.mydeletemodalcard.hide()
                            _this.$refs.areaqueryshopAdd.resetToStart()
                            _this.query()
                        }
                    })
                }else {
                    api.skuPlace.insertSkuLocationInfo(_this.addParams, res => {
                        if(res.data.code === 'success') {
                            Message({
                                type: 'success',
                                message: '保存成功'
                            })
                            _this.$refs.mydeletemodalcard.hide()
                            _this.$refs.areaqueryshopAdd.resetToStart()
                            _this.query()
                        }
                    })
                }
            },
            // 模态框确定作废事件
            removeItem() {
                const _this = this
                let option = {
                    id: _this.currentSkuPlace.id,
                    isDeleted: 1
                }
                api.skuPlace.updateSkuLocationInfo(option, res => {
                    if(res.data.code === 'success') {
                        Message({
                            type: 'success',
                            message: '作废成功'
                        })
                        _this.$refs.modalofsure.closeDeleteModel()
                        _this.currentSkuPlace = ''
                        _this.currentIndex = -1
                        _this.query()
                    }
                })
            },
            // 获取业务编码
            getSequence() {
                const _this = this
                let option = {
                    serviceCode: config.skuPlace.seq
                }
                api.ordinalInfo.getSequence(option, res => {
                    if(res.data.code === 'success') {
                        _this.addParams.skuLocationCode = res.data.obj
                    }
                })
            },
            itemClick(value) {
                const _this = this
                // debugger
                _this.queryParams.skuCode = value.skuCode
                _this.queryParams.skuName = value.skuName
                _this.skuName = value.skuName + '  ' + value.skuCode
                _this.hideFrame()
            }
        },
        watch: {
            skuName: function(value) {
                if(value) {
                    let option = {
                        skuName: value,
                        pageNums: 5
                    }
                    // this.queryParams.skuCode = ''
                    // this.queryParams.skuName = ''
                    api.checkPlan.querySku(option, res => {
                        if(res.data.code === 'success') {
                            this.skuList = res.data.obj.list
                            // this.skuList.forEach(element => {
                            //     if(element.skuName === value) {
                            //         this.queryParams.skuCode = element.skuCode
                            //         this.queryParams.skuName = ''
                            //     }
                            // })
                            // if(!this.queryParams.skuCode) {
                            //     this.queryParams.skuName = value
                            // }
                        }
                    })
                }else {
                    this.skuList = []
                    this.queryParams.skuCode = ''
                    this.queryParams.skuName = ''
                }
            },
            // 监听仓库   仓库改变   库区选项改变
            whCode: function(value) {
                const _this = this
                _this.whAreaList = []
                if(value) {
                    let option = {
                        warehouseCode: value
                    }
                    api.skuPlace.queryWarehouseAreaInfo(option, res => {
                        if(res.data.code === 'success') {
                            res.data.obj.forEach(element => {
                                let obj = {}
                                obj.text = element.whAreaName
                                obj.value = element.whAreaCode
                                _this.whAreaList.push(obj)
                            })
                        }
                    })
                }else {
                    _this.whAreaCode = ''
                    _this.whAreaList = []
                }
            },
            // 监听库区 库区改变 库位选项改变
            whAreaCode: function(value) {
                const _this = this
                _this.whLocationList = []
                if(value) {
                    let option = {
                        whAreaCode: value
                    }
                    api.skuPlace.queryWarehouseLocationInfo(option, res => {
                        if(res.data.code === 'success') {
                            res.data.obj.forEach(element => {
                                let obj = {}
                                obj.text = element.whLocationName
                                obj.value = element.whLocationCode
                                _this.whLocationList.push(obj)
                            })
                        }
                    })
                }else {
                    _this.queryParams.whLocationCode = ''
                    _this.whLocationList = []
                }
            },
            addStoreCode: function(value) {
                const _this = this
                this.addWhlist = []
                if(value) {
                    let params = {
                            storeCodeSet: []
                        }
                    params.storeCodeSet.push(value)
                    api.getEntrepot(params, res => {
                        if(res.data.code === 'success') {
                            res.data.obj.forEach(element => {
                                let obj = {}
                                obj.text = element.warehouseName
                                obj.value = element.warehouseCode
                                _this.addWhlist.push(obj)
                            })
                        }
                    })
                }
            },
            // 监听模态框中仓库   仓库改变   库区改变
            addWhCode: function(value) {
                const _this = this
                _this.addWhArealist = []
                if(value) {
                    let option = {
                        warehouseCode: value
                    }
                    api.skuPlace.queryWarehouseAreaInfo(option, res => {
                        if(res.data.code === 'success') {
                            res.data.obj.forEach(element => {
                                let obj = {}
                                obj.text = element.whAreaName
                                obj.value = element.whAreaCode
                                _this.addWhArealist.push(obj)
                            })
                        }
                    })
                }else {
                    _this.addWhAreaCode = ''
                    // _this.addWhArealist = []
                }
            },
            // 监听库区    库区改变    库位选项改变
            addWhAreaCode: function(value) {
                const _this = this
                let tempValue = value
                if(!_this.editState) {
                    _this.addWhLocationlist = []
                    if(tempValue) {
                        let option = {
                            whAreaCode: tempValue
                        }
                        api.skuPlace.queryWarehouseLocationInfo(option, res => {
                            if(res.data.code === 'success') {
                                let objArr = res.data.obj
                                for(let i = 0; i< objArr.length; i++) {
                                    let obj = {}
                                    obj.text = objArr[i].whLocationName
                                    obj.value = objArr[i].whLocationCode
                                    _this.addWhLocationlist.push(obj)
                                    // _this.$set(_this.addWhLocationlist,i,obj)
                                }
                                // res.data.obj.forEach(element => {
                                //     let obj = {}
                                //     obj.label = element.whLocationName
                                //     obj.value = element.whLocationCode
                                //     tempArr.push(obj)    
                                // })
                                // _this.$set(_this.addWhLocationlist,)
                            }
                        })
                    }else {
                        _this.addWhLocationCode = ''
                        // _this.addWhLocationlist = []
                    }
                }else {
                    return
                }
                
            },
            addSkuName: function(value) {
                if(value) {
                    let option = {
                        skuName: value,
                        pageNums: 5
                    }
                    api.checkPlan.querySku(option, res => {
                        if(res.data.code === 'success') {
                            this.addSkuList = res.data.obj.list
                            // this.skuList.forEach(element => {
                            //     if(element.skuName === value) {
                            //         this.addParams.skuCode = element.skuCode
                            //         this.addParams.skuName = element.skuName
                            //     }
                            // })
                        }
                    })
                }else {
                    this.addParams.skuCode = ''
                    this.addParams.skuName = ''
                    this.addSkuList = []
                }
            }
        }
    }
</script>
<style>
    .backEndErrorTips {
        padding-top: 10px;
        padding-bottom: 10px;
        overflow: auto;
    }
    .judgeSkuOrNumber>input {
        border: 1px solid #f86c6b !important;
    }
    .sku-place-modal-title {
        font-size: 20px;
        padding-bottom: 20px;
    }
    .skuNameOrskuCode {
        padding-left: 34%;
        position: relative;
    }
    .skuNameOrskuCode>input {
        width: 100%;
        height: 36px;
        padding-left: 5px;
        border: 1px solid #c2cfd6;
        border-radius: 5px;
    }
    .skuNameOrskuCodeLabel {
        position: absolute;
        width: 34%;
        left: 0px;
        text-align: right;
        padding-right: 2%;
        height: 36px;
        line-height: 36px;
    }
    .skuNameOrskuCodeContainer {
        position: absolute;
        top: 36px;
        width: 66%;
        box-sizing: border-box;
        border: 1px solid #c2cfd6;
        z-index: 9999;
        background-color: #fff;
        max-height: 150px;
    }
    .skuNameOrskuCodeContainerItem {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
    }
    .skuNameOrskuCodeContainerItem:hover {
        background-color: #ccc;
        cursor: pointer;
    }
</style>