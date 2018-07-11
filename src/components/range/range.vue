<template>
<div>
    <list-btn-group 
        @insert="insert" 
        @update="remove" 
        :updateOptions="{
            size: 'sm',
            variant: 'danger', 
            name: '删除',
        }"
        :showInit="false" class="mb-2">
    </list-btn-group>
    <div class="table-scrollable mb-2">
        <b-table striped hover bordered show-empty :items="datalist" :fields="fields">
            <template slot="radio" slot-scope="data">
                <input type="radio" name="radio" v-model="selectIndex" :value="data.index"/>
            </template>                       
            <template slot="empty" >暂无数据</template>
        </b-table>
    </div>

    <b-modal ref="rangeModal" size="lg" title="新增适用范围" ok-title="确定" cancel-title="取消" @ok="confirm">
        <div class="row">
            <div class="col-md-6">
                <b-form-fieldset horizontal label="适用范围类型" :label-cols="5" class="text-right">
                    <b-form-select v-model="rangeTypeCode" :options="rangeTypes ">
                    </b-form-select>
                </b-form-fieldset>
            </div>
        </div>
        <b-card :title="isChinaArea ? '行政区域' : '销售区域'">
            <div class="row">
                <div class="col-md-5">
                    <sales-area-tree @itemClick="itemClick" v-show="isSalesArea || isStore"></sales-area-tree>
                    <!-- <china-area-tree @itemClick="chinaItemClick" v-show="isChinaArea"></china-area-tree> -->
                </div>
                <div class="col-md-7">
                    <!-- <b-form-fieldset horizontal label="行政区域 *" :label-cols="4" class="text-right" v-if="isChinaArea">
                        <b-form-input v-model="paramsInfo.chinaAreaName" readonly :state="state.china"/>
                    </b-form-fieldset> -->

                    <b-form-fieldset horizontal label="销售区域 *" :label-cols="4" class="text-right" v-if="isSalesArea || isStore">
                        <b-form-input v-model="paramsInfo.salesName" readonly :state="state.sales"/>
                    </b-form-fieldset>

                    <b-form-fieldset horizontal label="经销商店 *" :label-cols="4" class="text-right range-store" v-if="isStore">
                        <b-form-input v-model="storeInfo.storeName" readonly v-if="availableType == 0"/>
                        <el-select
                            ref="select"
                            class="text-left"
                            v-if="availableType != 0"
                            v-model="paramsInfo.storeCodes"
                            multiple
                            :collapse-tags='true'
                            placeholder="请选择">
                            <el-option
                                v-for="item in storeList"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </b-form-fieldset>

                    <b-form-fieldset horizontal label="渠道 *" :label-cols="4" class="text-right">
                        <b-form-select v-model="paramsInfo.channelCode" :options="channels" :state="state.channels">
                        </b-form-select>
                    </b-form-fieldset>

                    <b-form-fieldset horizontal label="工时 *" :label-cols="4" class="text-right">
                        <b-form-input v-model="paramsInfo.workHours" :state="state.workHours" type="number" min="0"/>
                    </b-form-fieldset>
                </div>
            </div>
        </b-card>
       
    </b-modal>
</div>
</template>
<script>

/**
 * create by lwx on 2018/04/25 17:27
 * @prop  fields => 表头数据结构
 * @prop  datalist => 表格数据
 * @prop  channels => 渠道数据集合
 * 
 * @prop  extendColumn => [
 *    {
 *       extendName: '渠道', 
 *       extendFieldName: 'channelName',
 *       options: []
 *    },
 *    {
 *       extendName: '工时', 
 *       extendFieldName: 'workHours',
 *    }
 * ]
 * 
 * 
 */
import ListBtnGroup from 'components/list-btn-group/list-btn-group'

import SalesAreaTree from './sales-area-tree'
import ChinaAreaTree from './china-area-tree'

import Vue from 'vue'
import { Select, Option, Message } from 'element-ui'
Vue.use(Select)
Vue.use(Option)

import api from 'common/api'
import config from 'common/config'
import { getType } from 'common/api-common'

const _fields = {
    radio: {
        label: '选择'
    },
    salesName: {
        label: '销售区域'
    },
    storeName: {
        label: '经销商店'
    },
    channelName: {
        label: '渠道'
    },
    workHours: {
        label: '工时'
    },
}

export default {
    components: {
        ListBtnGroup,
        SalesAreaTree,
        ChinaAreaTree
    },
    props: {
        fields: {
            type: Object,
            default: () => _fields
        },
        datalist: {
            type: Array,
            default: () => []
        },
        showChinaArea: {
            type: Boolean,
            default: false
        },
        channels: {
            type: Array,
            default: () => []
        },
        storeRadio: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            selectIndex: -1,
            rangeTypes : [],
            rangeTypeCode: 'rangeTpyeSalesArea',

            paramsInfo: {
                chinaAreaName: '',
                chinaAreaCode: '',
                salesName: '',
                salesCode: '',
                channelCode: '',
                workHours: '',
                storeCodes: []
            },
            storeList: [],
            state: {
                china: null,
                sales: null,
                channels: null,
                workHours: null
            },

            selectList: []
        }
    },
    computed: {
        isChinaArea() {
            return this.rangeTypeCode === 'rangeTpyeChinaArea'
        },
        isSalesArea() {
            return this.rangeTypeCode === 'rangeTpyeSalesArea'
        },
        isStore() {
            return this.rangeTypeCode === 'rangeTpyeDealer'
        },
        availableType() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            return userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.availableType
                    : null
        },
        storeInfoVo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            return userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
        },
        storeName() {
            return this.availableType == 0 ? this.storeInfoVo.storeName : ''
        },
        storeInfo() {
            if(this.availableType == 0) {
                let info = {
                    storeCode: this.storeInfoVo.storeCode,
                    storeName: this.storeInfoVo.storeName
                }
                return info
            }
        }
    },
    mounted() {
        getType(config.scope, items => {
            this.rangeTypes  = []
            items.forEach(item => {
                let data = {
                    text: item.refDetailName,
                    value: item.refDetailCode
                }
                this.rangeTypes .push(data)
            })
        })
        if(this.availableType == 0) {
            this.paramsInfo.salesCode = this.storeInfoVo.salesCode
            this.paramsInfo.salesName = this.storeInfoVo.salesName
            this.paramsInfo.storeCode = this.storeInfoVo.storeCode
            this.paramsInfo.storeName = this.storeInfoVo.storeName
        }
    },
    methods: {
        insert() {
            this.$refs.rangeModal.show()
        },
        remove() {
            if(this.selectIndex < 0) { 
                Message({
                    type: 'warning',
                    message: "请选择一条数据"
                })
                return 
            }
            this.selectIndex = -1
            this.datalist = JSON.parse(JSON.stringify(this.datalist))
            this.$emit('removeItem', this.selectIndex)
        },
        itemClick(item) {
            this.paramsInfo.salesName = item.name
            this.paramsInfo.salesCode = item.code
            if(this.isStore) {
                this.getStoresBySalesCode(item.code)
                this.paramsInfo.storeCodes = []
            }
        },
        chinaItemClick(item) {
            console.log(item)
            this.paramsInfo.chinaAreaName = item.name
            this.paramsInfo.chinaAreaCode = item.code
        },
        confirm(event) {
            if(!this.paramsInfo.salesCode) {
                this.state.sales = 'invalid'
                this.state.workHours = null
                this.state.channels = null
                event.preventDefault()
                return
            }
            if(!this.paramsInfo.channelCode) {
                this.state.channels = 'invalid'
                this.state.sales = null
                this.state.workHours = null
                event.preventDefault()
                return
            }
            if(!this.paramsInfo.workHours) {
                this.state.workHours = 'invalid'
                this.state.sales = null
                this.state.channels = null
                event.preventDefault()
                return
            }
            this.emitSelectList(event)
        },
        emitSelectList(event) {
            this.paramsInfo.channelName = this.findName(this.paramsInfo.channelCode, this.channels)
            if(this.isStore) {
                this.selectList = []
                if(this.availableType == 0) {
                    this.selectList.push(this.paramsInfo)
                }else {
                    this.paramsInfo.storeCodes.forEach(item => {
                    let info = {
                            salesCode: this.paramsInfo.salesCode,
                            salesName: this.paramsInfo.salesName,
                            storeCode: item,
                            storeName: this.findName(item, this.storeList),
                            channelCode: this.paramsInfo.channelCode,
                            channelName: this.paramsInfo.channelName,
                            workHours: this.paramsInfo.workHours
                        }
                        this.selectList.push(info)
                    })
                }
            }else if(this.isSalesArea) {
                delete this.paramsInfo.storeCodes
                this.selectList = []
                this.selectList.push(this.paramsInfo)
            }
            // 校验重复
            let flag = false
            if(!this.datalist.length) {
                flag = true
            }
            if(this.isSalesArea) {
                this.datalist.forEach(item => {
                    if(item.salesCode === this.selectList[0].salesCode) {
                        Message({
                            type: 'warning',
                            message: "该销售区域已经存在"
                        })
                        event.preventDefault()
                        flag = false
                    }else {
                        flag = true
                    }
                })
            }else if(this.isStore) {
                this.datalist.forEach(item => {
                    if(this.paramsInfo.storeCodes.indexOf(item.storeCode) !== -1) {
                        Message({
                            type: 'warning',
                            message: "经销商店已经存在"
                        })
                        event.preventDefault()
                        flag = false
                    }else {
                        flag = true
                    }
                })
            }
            if(flag) {
                this.$emit('confirmInsert', this.selectList)
            }
        },
        getStoresBySalesCode(salesCode) {
            let params = {
                salesAreaCodes: [salesCode],
                needPageFlag: "0"
            }
            api.finance.queryShopInfo(params, res => {
                if(res.data.message == 'success') {
                    let obj = res.data.obj
                    this.storeList = []
                    obj.forEach(item => {
                        this.storeList.push({
                            text: item.storeName,
                            value: item.storeCode
                        })
                    })
                }
            })
        },
        findName(code, list) {
            let text = ''
            list.forEach(item => {
                if(code === item.value) {
                    text = item.text
                }
            })
            return text
        },
    },
    watch: {
        rangeTypeCode(val) {
            if(this.availableType != 0) {
                if(this.isSalesArea) {
                    this.paramsInfo.salesName = ''
                    this.paramsInfo.salesCode = ''
                }else if(this.isStore) {
                    this.paramsInfo.salesName = ''
                    this.paramsInfo.salesCode = ''
                    // this.paramsInfo.storeCodes = []  bug
                    this.storeList = []
                }
            }
            this.paramsInfo.channelCode = ''
            this.paramsInfo.workHours = ''
        }
    }
}
</script>
<style scoped>
.range-store .el-select {
    width: 100%;
}
</style>

 