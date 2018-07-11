<template>
<div class="trans-container">
    <div class="row">
        <div class="col-md-4">
            <p class="left-title">{{leftTitle}}</p>
            <div class="row">
                <div class="col-md-6">
                    <!-- 总部员工没去, 因为不知道code -->
                    <b-form-select v-model="queryParams.empType" :options="empType" :disabled="!selectTime">
                    </b-form-select>
                </div>
                <div class="col-md-6" v-if="queryParams.empType === 'empTypeGroupEmpType'">
                    <b-form-select v-model="queryParams.postnTypeCode" :options="postType" :disabled="!selectTime">
                    </b-form-select>
                </div>
                <div class="col-md-6" v-if="queryParams.empType !== 'empTypeGroupEmpType'">
                    <b-form-select v-model="queryParams.workTypeCode" :options="workTypes" :disabled="!selectTime">
                    </b-form-select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12" style="marginTop: 5px; marginBottom: 5px">
                    <b-form-input  v-model="queryParams.empCnName" placeholder="关键字搜索" :readonly="!selectTime"/>
                </div>
            </div>

            <el-table
                ref="leftTable"
                :data="leftData"
                tooltip-effect="dark"
                height="320"
                @selection-change="leftSelectChange"
                border>
                    <el-table-column
                        type="selection"
                        :selectable="canCheck"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="empCnName"
                        label="姓名">
                    </el-table-column>
                    <el-table-column
                        prop="postTypeNameStr"
                        label="岗位类型"
                        width="100"
                        show-overflow-tooltip
                        v-if="queryParams.empType === 'empTypeGroupEmpType'">
                        <template slot-scope="data">
                            {{data.row.postTypeNameStr | selectFirst}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="workTypeNameStr"
                        label="工种"
                        width="100"
                        show-overflow-tooltip
                        v-if="queryParams.empType !== 'empTypeGroupEmpType'">
                        <template slot-scope="data">
                            {{data.row.workTypeNameStr | selectFirst}}
                        </template>
                    </el-table-column>
            </el-table>
        </div>
        <div class="col-md-1 btn-box">
            <div>
                <b-button size="lg" variant="primary" style="marginBottom: 5px" @click="toRight">></b-button> 
                <b-button size="lg" variant="primary" @click="toLeft"><</b-button> 
            </div>
        </div>
        <div class="col-md-7">
            <p>{{rightTitle}}</p>
            <el-table
                ref="rightTable"
                :data="rightData"
                tooltip-effect="dark"
                height="400"
                @selection-change="rightSelectChange"
                border>
                    <el-table-column
                        type="selection">
                    </el-table-column>
                    <el-table-column
                        prop="schedulingStartTime"
                        label="上班时间"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="schedulingEndTime"
                        label="下班时间"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="empCnName"
                        label="姓名">
                    </el-table-column>
                    <el-table-column
                        prop="postOrWorkType"
                        label="岗位/工种"
                        width="100"
                        show-overflow-tooltip>
                        <template slot-scope="data">
                            {{data.row.postOrWorkType | selectFirst}}
                        </template>
                    </el-table-column>
            </el-table>
        </div>       
    </div> 
</div>
</template>
<script>

import Vue from 'vue'
import { Table, TableColumn } from 'element-ui'
Vue.use(Table)
Vue.use(TableColumn)

import config from 'common/config'
import { getType } from 'common/api-common'

import { mapGetters, mapActions } from 'vuex'

const NOT_PRODUCTION_TYPE_CODE = 'empTypeGroupEmpType'

export default {
    props: {
        leftTitle: {
           type: String,
           default: ''
        },
        rightTitle: {
           type: String,
           default: ''
        },
        selectTime: {
            type: Boolean,
            default: false
        },
        schedulingStartTime: String,
        schedulingEndTime: String
    },
    data() {
        return {
            queryParams: {
                postnTypeCode: '',
                empType: NOT_PRODUCTION_TYPE_CODE,
                empCnName: '',
                workTypeCode: ''
            },
            
            leftSelections: [],
            rightData: [],
            rightSelections: [],
            workTypes: []
        }
    },
    created() {
        getType(config.storeStation.workTypeRef, res => {
            this.workTypes = [{
                text: '全部工种',
                value: ''
            }]
            res.forEach(item => {
                let data = {
                    text: item.refDetailName,
                    value: item.refDetailCode
                }
                this.workTypes.push(data)
            })
        })
    },
    computed: {
        leftData() {
            let _emplist = JSON.parse(JSON.stringify(this.empList))
            try {
                for(let j = 0; j < _emplist.length; j ++) {
                    for(let i = 0; i < this.rightData.length; i ++) {
                        if(_emplist[j].hasOwnProperty('empCode')) {
                            if(_emplist[j].empCode === this.rightData[i].empCode) {
                                _emplist.splice(j, 1)
                            }
                        }
                    }
                }
            }catch(e) {}
            
            return _emplist
        },
        ...mapGetters('storeStation', [
            'empList',
            'empType',
            'postType',
            'storeInfo',
            'empStatus'
        ])
    },
    methods: {
        canCheck() {
            return this.selectTime
        },
        leftSelectChange(val) {
            this.leftSelections = val
        },
        
        rightSelectChange(val) {
            this.rightSelections = val
        },
        toRight() {
            if(this.leftSelections.length > 0) {
                for(let i = 0; i < this.leftSelections.length; i ++) {
                    for(let j = 0; j < this.leftData.length; j ++) {
                        if(this.leftData[j].empCode === this.leftSelections[i].empCode) {
                            this.leftData.splice(j, 1)
                        }
                    }
                }
                this.leftSelections.forEach(item => {
                    let obj = {
                        schedulingStartTime: this.schedulingStartTime,
                        schedulingEndTime: this.schedulingEndTime,
                        empCnName: item.empCnName,
                        empCode: item.empCode,
                        postOrWorkType: item.postTypeNameStr || item.workTypeNameStr
                    }
                    this.rightData.push(obj)
                })
                this.$refs.leftTable.clearSelection()
                this.$emit('right-data-change', this.rightData)
            }
            
        },
        toLeft() {
            if(this.rightSelections.length > 0) {
                for(let i = 0; i < this.rightSelections.length; i ++) {
                    for(let j = 0; j < this.rightData.length; j ++) {
                        if(this.rightData[j].empCode === this.rightSelections[i].empCode) {
                            this.rightData.splice(j, 1)
                        }
                    }
                }
                this.rightSelections.forEach(item => {
                    let obj = {
                        schedulingStartTime: this.schedulingStartTime,
                        schedulingEndTime: this.schedulingEndTime,
                        empCnName: item.empCnName,
                        empCode: item.empCode
                        // 岗位类型
                    }
                    // this.leftData.push(obj)
                })
                this.$refs.rightTable.clearSelection()
                this.$emit('right-data-change', this.rightData)
            }
        },
        reset() {
            this.queryParams = {
                postnTypeCode: '',
                empType: "empTypeGroupEmpType",
                empCnName: '',
                workTypeCode: ''
            }
            this.rightData = []
        },
        ...mapActions('storeStation', [
            'getEmpList'
        ]),
    },
    watch: {
        rightData(val) {
            this.$emit('right-data-change', val)
        },
        queryParams: {
            handler(val) {
                console.log(val)
                let params = {
                    orgCode: this.storeInfo.orgCode,
                    storeCode: this.storeInfo.storeCode,
                    postnTypeCode: val.postnTypeCode,
                    empWorkTypeCode: val.workTypeCode,
                    empCnName: val.empCnName,
                    empType: val.empType,
                    empStatusCodeList: this.empStatus
                }
                this.getEmpList(params)
            },
            deep: true
        }
    },
    filters: {
        selectFirst(val) {
            if(val) {
                return val.split(',')[0]
            }else {
                return ''
            }
        }
    }
}
</script>
<style scoped>
.btn-box {
    display: flex;
    align-items: center;
}
</style>
