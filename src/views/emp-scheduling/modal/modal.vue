<template>
    <b-modal id="emp-insert" ref="insert" no-close-on-backdrop hide-header size="lg" @ok="save" ok-title="保存" cancel-title="取消">
        <div class="row">
            <div class="col-md-3">
                <p>{{storeName}}</p>
                <p>{{storeWorkTime}}</p>


                <b-form-fieldset horizontal label="上班时间 *" 
                    :label-cols="4" class="text-left"
                    :class="{ 'el-required' : startRequired }">
                    <!-- <el-time-picker v-model="schedulingStartTime">
                    </el-time-picker> -->

                    <el-time-select
                        :disabled="disabled"
                        v-model="schedulingStartTime"
                        :picker-options="{
                            start: '00:00',
                            step: '00:05',
                            end: '23:30'
                        }">
                    </el-time-select>
                </b-form-fieldset>

                <b-form-fieldset horizontal label="下班时间 *" 
                    :label-cols="4" class="text-left " 
                    :class="{ 'el-required' : endRequired }">
                    <!-- <el-time-picker 
                        v-model="schedulingEndTime"
                        :picker-options="{
                           selectableRange: '18:30:00 - 20:30:00'
                        }">
                    </el-time-picker> -->

                    <el-time-select
                        :disabled="disabled"
                        v-model="schedulingEndTime"
                        :picker-options="{
                            start: '00:00',
                            step: '00:05',
                            end: '23:30'
                        }">
                    </el-time-select>
                </b-form-fieldset> 
                
                <p class="prompt">
                    <span class="el-icon-warning text-warning"></span>
                     必须选定一个上下班时间段才可开始排班, 同一时间段排班可以批量完成, 不同时间段请新建排班</p>

                <div class="row">
                    <div class="col-md-12">
                        <div class="pull-right">
                            <b-button size="sm" variant="primary" @click="scheduling">排班</b-button>    
                        </div>    
                    </div>
                </div>
            </div>
            <div class="col-md-9">
                <transfer left-title="员工列表 ( 仅显示在职非停工员工 )"
                          right-title="排班列表"
                          :schedulingStartTime="schedulingStartTime"
                          :schedulingEndTime="schedulingEndTime"
                          @right-data-change="rightDataChange"
                          :selectTime="selectTime"
                          ref="transfer">
                </transfer>
            </div>            
        </div>
    </b-modal>
</template> 
<script>

import Transfer from './transfer'

import Vue from 'vue'
import { TimePicker, TimeSelect, Message } from 'element-ui'

Vue.use(TimePicker)
Vue.use(TimeSelect)

import api from 'common/api'
import config from 'common/config'
import { getSequenceList, alertSuccess } from 'common/api-common'

import { mapActions, mapGetters } from 'vuex'

export default {
    components: {
        Transfer
    },
    data() {
        return {
            schedulingStartTime: '08:00',
            schedulingEndTime: '18:00',

            disabled: false,
            startRequired: false,
            endRequired: false,
            
            selectTime: false,

            rightData: [],
            editParams: {}
        }
    },
    computed: {
        storeName() {
            return `门店名称: ${this.storeInfo.storeName || ''}`
        },
        storeWorkTime() { 
            return `门店运营时间:  ${this.startTime} - ${this.endTime}`
        },
        startTime() {
            return this.storeInfo.businessStartTime ? this.storeInfo.businessStartTime.substring(0, 5) : ''
        },
        endTime() {
            return this.storeInfo.businessEndTime ? this.storeInfo.businessEndTime.substring(0, 5) : ''
        },
        ...mapGetters('storeStation', [
            'empParams',
            'storeInfo'
        ])
    },
    methods: {
        save(event) {
            if(!this.rightData.length) {
                Message({
                    type: 'warning',
                    message: "请选择排班员工"
                })
                event.preventDefault()
                return
            }
            getSequenceList({
                getNums: this.rightData.length,
                serviceCode: config.empScheduling.seqCode
            }, (res) => {
                let editParams = []
                this.rightData.forEach((item, i) => {
                    let obj = {
                        "schedulingCode": res[i],
                        "empCode": item.empCode,
                        "schedulingDate": this.empParams.schedulingDate,
                        "endTime": item.schedulingEndTime,
                        "startTime": item.schedulingStartTime,
                        "storeCode": this.empParams.storeCode
                    }
                    editParams.push(obj)
                })
                this.edit(editParams)
            })
            
        },
        scheduling() {
            if(!this.schedulingStartTime) {
               this.startRequired = true
            }else if(!this.schedulingEndTime 
                || this.getMinute(this.schedulingEndTime) <= this.getMinute(this.schedulingStartTime)) {
                this.endRequired = true
            }else {
                this.disabled = true
                this.selectTime = true
            }
        },
        getMinute(time) {
            let arr = time.split(':')
            return parseInt(arr[0]) * 60 + parseInt(arr[1])
        },
        rightDataChange(data) {
            this.rightData = data
        },
        edit(params) {
            api.empScheduling.edit(params).then(res => {
                alertSuccess(res, () => {
                    this.getEmpSchedulingObj(this.empParams)
                })
            })
        },
        reset() {
            this.disabled = false
            this.selectTime = false
            this.schedulingStartTime = '08:00'
            this.schedulingEndTime = '18:00'
            this.startRequired = false
            this.endRequired = false
            this.$refs.transfer.reset()
        },
        show() {
            this.$refs.insert.show()
            this.reset()
        },
        ...mapActions({
            getEmpSchedulingObj: 'storeStation/getEmpSchedulingObj'
        }),
    }
}
</script>
<style >
#emp-insert .modal-lg {
    max-width: 1200px !important;
}
#emp-insert .modal-body {
    height: 470px;
}
.prompt {
   font-size: 12px;
}

.el-required .el-input__inner {
    border-color: red
}
</style>

