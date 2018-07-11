<template>
    <div class="row">
        <div class="col-md-12">
            <b-card>
                <!-- btn group -->
                <list-btn-group @insert="insert" 
                    @update="update" @init="init"
                    :disabledInsert="!canInsert"
                    :disabledUpdate="!canUpdate">
                </list-btn-group>
                <!-- listbody -->
                <div class="table-scrollable mb-2">
                    <b-table striped hover bordered show-empty empty-text="暂无数据" :items="storeStationObj.list" :fields="fields">
                        <template slot="radio" slot-scope="data">
                            <div @click="check(data.index)">
                                <input type="radio" name="radio" />
                            </div>
                        </template>  
                        <!-- <template slot="index" slot-scope="data">{{data.index + 1 + listIndex}}</template> -->
                        <template slot="stationCode" slot-scope="row">
                            <a href="javascript:;" @click="watch(row.value)">{{row.value}}</a>
                        </template>    
                        <template slot="stationStatus" slot-scope="row">{{row.value === 0 ? '启用' : '停用'}}</template>    
                        <template slot="supportPppointment" slot-scope="row">
                            {{ row.value === 1 ? '支持' : '不支持' }}
                        </template>
                        <template slot="videoSwitch" slot-scope="row">
                            {{ row.value == 1 ? '开' : '关' }}
                        </template>
                    </b-table>
                </div>
                <div class="row"> 
                    <div class="col-md-12">
                        <pagination class="pull-right" 
                        @page-change="pageChange" 
                        :page-no="storeStationObj.pageNum" 
                        :page-size="storeStationObj.pageSize" 
                        :total-pages="storeStationObj.pages" 
                        :total-result="storeStationObj.total">
                        </pagination>
                    </div>
                </div>
                <!-- dialog -->
                <b-modal ref="dialog" 
                    :title="dialogTitle" 
                    no-close-on-backdrop 
                    :hide-header-close="dialogStatus !== 2" 
                    size="lg" ok-title="确定" cancel-title="取消" 
                    @ok="confirm" 
                    :hide-footer="hideFooter">
                    <div class="row">
                        <div class="col-md-6">
                            <b-form-fieldset horizontal label="工位编码" :label-cols="4" class="text-right">
                                <b-form-input  v-model="dialog.stationCode" readonly/>
                            </b-form-fieldset>

                            <b-form-fieldset horizontal label="工位名称 *" :label-cols="4" class="text-right">
                                <b-form-input  v-model="dialog.stationName" :state="stationNameState" :readonly="dialogStatus === 2"/>
                                <b-form-feedback class="text-left">
                                </b-form-feedback>
                            </b-form-fieldset>

                            <b-form-fieldset horizontal label="销售区域 *" :label-cols="4" class="text-right">
                                <area-tree
                                   @select-change="selectChange" 
                                   ref="area" 
                                   :storeAll='true' 
                                   :error="areaRequired"
                                   :readonly="areaSee"
                                ></area-tree>
                            </b-form-fieldset>

                            <b-form-fieldset horizontal label="工位类型" :label-cols="4" class="text-right">
                                <b-form-select v-model="dialog.stationTypeCode" :options="stationTypeList" :disabled="dialogStatus === 2">
                                </b-form-select>
                            </b-form-fieldset>

                            <b-form-fieldset horizontal label="工位状态" :label-cols="4" class="text-right">
                                <b-form-select v-model="dialog.stationStatus" :options="statusOptions" :disabled="dialogStatus === 2">
                                </b-form-select>
                            </b-form-fieldset>
                            <b-form-fieldset horizontal label="支持预约" :label-cols="4" class="text-right">
                                <b-form-select v-model="dialog.supportPppointment" :options="supportPppointmentList" :disabled="dialogStatus === 2">
                                </b-form-select>
                            </b-form-fieldset>
                            <b-form-fieldset horizontal label="视频展示" :label-cols="4" class="text-right">
                                <b-form-select v-model="dialog.videoSwitch" :options="videoSwitchList" :disabled="dialogStatus === 2">
                                </b-form-select>
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6 work-type">
                            <b-form-fieldset horizontal label="工种配置" :label-cols="3" class="text-right">
                                <b-card class="text-left">
                                    <div class="row">
                                        <div class="col-md-6" v-for="(item, i) in workTypeList" :key="i">
                                            <el-checkbox v-model="item.check" 
                                                :disabled="dialogStatus === 2">
                                                {{item.workTypeName}}
                                            </el-checkbox>   
                                        </div> 
                                    </div>                                                                                                                                           
                                </b-card>
                            </b-form-fieldset>
                        </div>
                    </div>
                </b-modal>
            </b-card>
        </div>
    </div>
</template>
<script>

import AreaTree from 'components/iris-areaqueryshop/index'
import ListBtnGroup from 'components/list-btn-group/list-btn-group'
import Pagination from 'components/pagination/pagination'

import Vue from 'vue'
import { Message, Checkbox } from 'element-ui'
Vue.use(Checkbox)

import { mapGetters, mapMutations, mapActions } from 'vuex'

import api from 'common/api'
import config from 'common/config'
import { getSequence, alertSuccess, getType, hasBtn } from 'common/api-common'
import url from 'common/api-collection'

const INSERT_TITLE = '新增门店工位信息',
      UPDATE_TITLE = '编辑门店工位信息',
      WATCH_TITLE  = '查看门店工位信息'

export default {
    components: {
        AreaTree,
        ListBtnGroup,
        Pagination
    },
    props: {
        statusOptions: [Array]
    },
    data() {
        return {
            fields: {
                radio: {
                    label: '选择'
                },
                storeName: {
                    label: '门店名称'
                },
                stationCode: {
                    label: '工位编码'
                },
                stationName: {
                    label: '工位名称'
                },
                stationTypeName: {
                    label: '工位类型'
                },
                stationStatus: {
                    label: '工位状态'
                },
                supportPppointment: {
                    label: '预约支持'
                },
                videoSwitch: {
                    label: '视频展示'
                },
                workTypeName: {
                    label: '配置工种'
                }
            },
            index: -1,
            dialogStatus: 0,   // 弹出框的显示状态: 0 insert, 1 update, 2 watch; 
            dialog: {
                stationCode: '',
                stationName: '',
                stationTypeCode: '',
                stationStatus: '',
                storeCode: '',
                workTypeList: [],
                supportPppointment: 0,
                videoSwitch: 1
            },
            videoSwitchList: [
                {text: '开', value: 1},
                {text: '关', value: 0},                
            ],
            hideFooter: false,
            workTypeList: [],
            stationNameState: null,
            areaRequired: false,
            preWorkTypeList: [],
            supportPppointmentList: [],
            areaSee:false,
        }
    },
    created() {
        this.supportPppointmentList = config.storeStation.supportPppointmentList
        getType(config.storeStation.workTypeRef, items => {
            items.forEach(item => {
                let data = {
                    workTypeName: item.refDetailName,
                    workTypeCode: item.refDetailCode,
                    check: false,
                    isDeleted: null
                }
                this.workTypeList.push(data)
            })
        })
    },
    computed: {
        listIndex() {
            return (this.storeStationObj.pageNum - 1) * this.storeStationObj.pageSize
        },
        dialogTitle() {
            if(this.dialogStatus === 0) {
                return INSERT_TITLE
            }else if(this.dialogStatus === 1) {
                return UPDATE_TITLE
            }else {
                return WATCH_TITLE
            }
        },
        canInsert() {
            const insertUrl = url.storeStation.insert 
            return hasBtn(insertUrl)
        },
        canUpdate() {
            const updateUrl = url.storeStation.update
            return hasBtn(updateUrl)
        },
        stationTypeList() {
            let list = JSON.parse(JSON.stringify(this.stationType))
            list.shift()
            return list//.shift()
        },
        ...mapGetters('storeStation', [
            'stationType',
            'storeStationObj',
            'params'
        ])
    },
    methods: {
        check(index) {
            this.index = index;
        },
        insert() {
        	this.areaSee = false
            this.dialogStatus = 0
            this.dialog.supportPppointment = 0
            this.dialog.videoSwitch = 1
            this.$refs.dialog.show()
            // 新增前清空 操作 放在 确定之后
            this.dialog.stationTypeCode = this.stationTypeList[0].value
            this.dialog.stationStatus = 0
            this.dialog.stationName = ''
            this.dialog.workTypeList = []

            if(!JSON.parse(sessionStorage.getItem('userInfo')).userAvailableInfo.storeInfoVo) {
                this.$refs.area.reset()
            }

            for(let i = 0; i < this.workTypeList.length; i ++) {
                if(this.workTypeList[i].check) {
                    this.workTypeList[i].check = false
                }
            }
            this.stationNameState = null
            this.areaRequired = false
            getSequence(config.storeStation.seqCode, res => {
                this.dialog.stationCode = res
            })
        },
        update() {
            if (this.index < 0 ) {
                Message({
                    type: 'warning',
                    message: "请选择一条数据"
                });
                return
            } else {
            	this.dialogStatus = 1
                this.areaSee = true
                this.$refs.dialog.show()
                this.stationNameState = null
                this.areaRequired = false
                let stationCode = this.storeStationObj.list[this.index].stationCode
                this.queryByCode(stationCode)
                
            }
        },
        watch(stationCode) {
            this.dialogStatus = 2
            this.$refs.dialog.show()
            this.queryByCode(stationCode)
        },
        init() {
            api.storeStation.init().then(res => {
                alertSuccess(res)
            })
        },
        confirm(event) {
            if(this.dialog.stationName) {
                this.stationNameState = null
            }
            if(this.dialog.storeCode) {
                this.areaRequired = false
            }
            if(!this.dialog.stationName) {
                this.stationNameState = 'invalid'
                event.preventDefault()
                return
            }
            if(!this.dialog.storeCode) {
                event.preventDefault()
                this.areaRequired = true
                return
            }
            this.areaRequired = false
            
            if(this.dialogStatus === 0) {
                delete this.dialog.id
                this.dialog.workTypeList = []
                this.workTypeList.forEach(item => {
                    if(item.check) {
                        let obj = {
                            "stationCode": this.dialog.stationCode,
                            "stationName": this.dialog.stationName,
                            "storeCode": this.dialog.stationCode,
                            "workTypeCode": item.workTypeCode,
                            "supportPppointment": this.dialog.supportPppointment,
                            "videoSwitch": this.dialog.videoSwitch
                        }
                        this.dialog.workTypeList.push(obj)
                    }
                })
                if(!this.dialog.workTypeList.length) {
                    event.preventDefault()
                    Message({
                        type: 'warning',
                        message: "请选择工种"
                    })
                    return
                }
                this.confirmInsert(this.dialog)
            }else if(this.dialogStatus === 1) {
                let list = this.dialog.workTypeList
                this.workTypeList.forEach(item => {
                        // bug item.workTypeCode !== list[i].workTypeCode 为什么是true
                        if(item.check && !item.isDeleted ) {
                            let obj = {
                                "stationCode": this.dialog.stationCode,
                                "stationName": this.dialog.stationName,
                                "storeCode": this.dialog.stationCode,
                                "workTypeCode": item.workTypeCode,
                                "supportPppointment": this.dialog.supportPppointment,
                                "videoSwitch": this.dialog.videoSwitch
                            }
                            this.dialog.workTypeList.push(obj)
                        }
                        // else if(!item.check && item.isDeleted === '0') {
                        //     list[i].isDeleted = '1'
                        //     delete item.isDeleted
                        // }
                        for(let i = 0, len = list.length; i < len; i++) {
                            if(!item.check && item.isDeleted === '0' && item.workTypeCode === list[i].workTypeCode) {
                                list[i].isDeleted = '1'
                                delete item.isDeleted
                            }
                        }
                })
                if(!this.dialog.workTypeList.length) {
                    event.preventDefault()
                    Message({
                        type: 'warning',
                        message: "请选择工种"
                    })
                    return
                }
                this.confirmUpdate(this.dialog)
            }
        },
        confirmInsert(params) {
            api.storeStation.insert(params).then(res => {
                alertSuccess(res, () => {
                    let queryParams = {
                        pageStart: 1,
                        pageNums: config.pageNums,
                        storeCode: this.params.storeCode
                    }
                    this.getStoreStationObj(queryParams)
                })
            })
        },
        confirmUpdate(params) {
            api.storeStation.update(params).then(res => {
                alertSuccess(res, () => {
                    let queryParams = {
                        pageStart: 1,
                        pageNums: config.pageNums,
                        storeCode: this.params.storeCode
                    }
                    this.getStoreStationObj(queryParams)
                })
            })
        },
        queryByCode(stationCode) {
            let params = { "stationCode": stationCode }
            api.storeStation.queryByCode(params).then(res => {
                if(res.data.code === 'success') {
                    let obj = res.data.obj
                    this.dialog = {
                        id: obj.id,
                        stationCode: obj.stationCode,
                        stationName: obj.stationName,
                        stationTypeCode: obj.stationTypeCode,
                        stationStatus: obj.stationStatus,
                        storeCode: obj.storeCode,     // 区域门店组件需要回显
                        supportPppointment: obj.supportPppointment,
                        videoSwitch: obj.videoSwitch,
                        workTypeList: []
                    }
                    this.$refs.area.setselect({
                        value: obj.storeCode,
                        text: obj.storeName
                    })
                    if(obj.workTypeList) {
                        this.dialog.workTypeList = []
                        obj.workTypeList.forEach(item => {
                            let obj = {
                                "id": item.id,
                                "stationCode": item.stationCode,
                                "stationName": item.stationName,
                                "storeCode": item.stationCode,
                                "workTypeCode": item.workTypeCode,
                                "supportPppointment": item.supportPppointment,
                                "videoSwitch": item.videoSwitch
                            }
                            this.dialog.workTypeList.push(obj)
                        })
                        for(let i = 0, len = this.workTypeList.length; i < len; i ++) {
                            this.workTypeList[i].check = false
                            obj.workTypeList.forEach(item => {
                                if(this.workTypeList[i].workTypeCode === item.workTypeCode && item.isDeleted === '0') {
                                    this.workTypeList[i].check = true
                                    this.workTypeList[i].isDeleted = '0'
                                }
                            })
                        }
                    }
                }
            })
        },
        pageChange(currentPage) {
            let params = JSON.parse(JSON.stringify(this.params))
            if('storeCode' in params) {
                params.pageStart = currentPage
                params.pageNums = config.pageNums
                this.getStoreStationObj(params)
            } 
        },
        selectChange(sales, stores) {
            if(!Array.isArray(stores)) {
                this.dialog.storeCode = stores.value                
            }
        },
        ...mapActions({
            getStoreStationObj: 'storeStation/getStoreStationObj'
        }),
        ...mapMutations({
            setParams: 'storeStation/SET_PARAMS'
        })
    },
    watch: {
        dialogStatus(val) {
            if(val === 0) {        // insert
                this.hideFooter = false
            }else if(val === 1) {  // update
                this.hideFooter = false
            }else {                // watch
                this.hideFooter = true
            }
        }
    }
}
</script>
<style scoped>
.el-checkbox {
    margin-left: 0;
    margin-right: 10px;
}
.work-type .card-body {
    max-height: 320px;
    overflow-y: scroll;
}
</style>

