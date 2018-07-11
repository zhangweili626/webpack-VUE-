<template>
    <div class="left-info-box animated fadeIn">
        <div class="left-info-header" :class="`${getStatus(dispatchOrderInfo.dispatchOrderInfo.colorType)}`">
            <p>
                <span>WIP：</span>
                <span>{{dispatchOrderInfo.dispatchOrderInfo.orderNo}}</span>
            </p>
            <div class="car-info">
                <div class="pull-left">
                    <strong>{{dispatchOrderInfo.dispatchOrderInfo.custPlates}}</strong>
                </div>
                <div class="pull-right">
                    <strong>SA：</strong>
                    <strong>{{dispatchOrderInfo.dispatchOrderInfo.saName}}</strong>
                </div>
            </div>
        </div>

        <div class="give-car-info">
            <p class="mar-botm">预定交车时间：{{dispatchOrderInfo.dispatchOrderInfo.bookingClosingDate}}</p>
            <!-- <p class="mar-botm">预定交车时间：{{dispatchOrderInfo.bookingClosingDate | timeFilter}}</p> -->
            <p class="mar-botm">已在厂时间：{{waitTime}}</p>

            <b-button class="colorType" size="sm" :class="{active:dispatchOrderInfo.dispatchOrderInfo.colorType ==3}">返工</b-button>
            <b-button class="colorType" size="sm" :class="{active:dispatchOrderInfo.dispatchOrderInfo.colorType ==1}">紧急</b-button>
            <b-button class="colorType" size="sm" :class="{active:dispatchOrderInfo.dispatchOrderInfo.colorType ==2}">预约</b-button>
            <b-button class="colorType" size="sm" :class="{active:dispatchOrderInfo.dispatchOrderInfo.colorType ==0}">普通</b-button>
        </div>
        <div class="project-info">
            <p class="mar-botm">项目编码：{{dispatchOrderInfo.serviceCode}}</p>
            <div class="flex">
                <p class="text-left">项目名称：{{dispatchOrderInfo.serviceName}}</p>
                <p class="text-left" v-if="!firstDispatch">技师：{{dispatchOrderInfo.empCnName}}</p>
                <p class="text-left" v-if="!firstDispatch">工位：{{dispatchOrderInfo.stationName}}</p>
            </div>
        </div>

        <div class="title" v-show="firstDispatch">
            <strong>首次派工</strong>
        </div>
        <div class="dispatch-info" v-show="!working">
            <div class="row" v-show="secondDispatch">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="" :label-cols="4" class="text-right">
                        <b-form-select v-model="params.reasons" :options="reasons">
                        </b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-textarea id="textarea1" v-model="params.remark" placeholder="描述 (备注)" :rows="1" :max-rows="6">
                    </b-form-textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="选择技师" :label-cols="4" class="text-right">
                        <b-form-select v-model="params.technician" :state="state.technician" @input="technicianInput()" :options="technicians">
                        </b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <router-link to="/emp-scheduling">查看排班表</router-link>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="选择工位" :label-cols="4" class="text-right">
                        <b-form-select v-model="params.station" :state="state.station" :options="stations">
                        </b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="默认耗时:" :label-cols="4" class="text-right">
                        <div class="text-left padd-top">{{dispatchOrderInfo.defaultWorkHours ? dispatchOrderInfo.defaultWorkHours + 'm' : ''}}</div>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="开始时间" :label-cols="4" class="text-right">
                        <el-date-picker @change="startTimeOnClick" v-model="params.startTime" :class="{error:state.startTime}" :picker-options="pickerOptions0" type="date" placeholder="YYYY/MM/DD">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-3">
                    <el-time-select @change="startTimeOnClick" :class="{error:state.startHour}" placeholder="HH/MM" v-model="params.startHour" :picker-options="{
                        start: '08:00',
                        step: '00:05',
                        end: '24:00'
                    }">
                    </el-time-select>
                </div>
                <div class="col-md-3 padd-top red" v-if="startTimeError">
                    技师/工位冲突
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="结束时间" :label-cols="4" class="text-right">
                        <el-date-picker @change="endTimeOnClick" v-model="params.endTime" :class="{error:state.endTime}" :picker-options="pickerOptions0" type="date" placeholder="YYYY/MM/DD">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-3">
                    <el-time-select @change="endTimeOnClick" placeholder="HH/MM" v-model="params.endHour" :class="{error:state.endHour}" :picker-options="{
                        start: '08:00',
                        step: '00:05',
                        end: '24:00'
                    }">
                    </el-time-select>
                </div>
                <div class="col-md-3 padd-top red" v-if="endTimeError">
                    技师/工位冲突
                </div>
            </div>
            <div class="row text-center" v-if="showWarning">
                <div class="co-md-12 red" style="marginLeft: 136px">
                    此次派工结束时间晚于预计交车时间
                </div>
            </div>
        </div>

        <div class="btn-box">
            <div class="row">
                <div class="col-md-12 text-right">
                    <b-button size="sm" variant="success" @click="save" v-show="!working">保存</b-button>
                    <b-button size="sm" variant="primary" @click="back" v-show="working" style="marginTop: 10px">返回</b-button>
                </div>
            </div>
        </div>
        <div class="title">
            <strong>派工记录</strong>
        </div>
        <div class="record-list" v-if="secondDispatch || working" v-for="(item, index) in dispatchOrderInfo.dispatchDetailHistoryInfoList" :key="index">
            <p class="mar-botm"><span>{{(index + 1) + ',' +(item.dispatchHistoryTypeName || '')}}</span><span class="ml-4" v-if="item.remark">备注：{{item.remark}}</span> <span class="ml-4">技师：{{item.empName}}</span><span class="ml-4">工位：{{item.stationName}}</span></p>
            <div class="flex mar-botm">
                <p class="text-left">派工开始时间：{{item.dispatchStartTime}}</p>
                <p class="text-left">实际开始时间：{{item.workStartTime}}</p>
            </div>
            <div class="flex mar-botm">
                <p class="text-left">派工结束时间：{{item.dispatchEndTime}}</p>
                <p class="text-left">实际结束时间：{{item.workEndTime}}</p>
            </div>
            <div class="flex">
                <p class="text-left">派工预计耗时：{{item.planWorkHours?item.planWorkHours+'m':''}}</p>
                <p class="text-left">施工实际耗时：{{item.actualWorkHours?item.actualWorkHours+'m':''}}</p>
            </div>
        </div>
    </div>
</template>
<script>
import api from 'common/api'
import config from 'common/config'
import common from 'common/common'
import { getType, getWaitTime, timeMove } from 'common/api-common'
import Vue from 'vue'
import { DatePicker, TimePicker, TimeSelect, Message } from 'element-ui'
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(TimeSelect)
import { mapActions, mapGetters } from 'vuex'

export default {
    data() {
        return {
            pickerOptions0: {
                // disabledDate(time) {
                //     return time.getTime() < Date.now() - 8.64e7;
                // }
            },
            // status: 0,    // 派工状态: 0 未派工, 1 已派工未开始施工, 2 施工中, 3 施工结束
            t: null,
            waitTime: '',
            stations: [],
            reasons: [],
            params: {
                technician: '',
                station: '',
                startTime: '',
                endTime: '',
                startHour: '',
                endHour: '',
                reasons: '',
                remark: null
            },
            state: {
                technician: null,
                station: null,
                startTime: null,
                endTime: null,
                startHour: null,
                endHour: null,
                reasons: null
            },
            showWarning: false,
            dispatchOrderInfo: {
                dispatchOrderInfo: {}
            },
            storeInfoVo: JSON.parse(sessionStorage.getItem('userInfo')).userAvailableInfo.storeInfoVo,
            technicianDate: [],
            startTimeError: false,
            endTimeError: false,
            currentTime: "",
            Timer: []
        }
    },
    computed: {
        firstDispatch() {
            return this.dispatchDetailStatus === 0 //未派工
        },
        secondDispatch() {
            return this.dispatchDetailStatus === 1 || this.dispatchDetailStatus === 3 //未开卡 已关卡
        },
        working() {
            return this.dispatchDetailStatus === 2 //施工中
        },
        dispatchDetailStatus() {
            return this.dispatchOrderInfo.dispatchDetailStatus
        },
        technicians() {
            let arr = []
            this.empList.forEach(item => {
                let data = {
                    text: item.empCnName,
                    value: item.empCode
                }
                arr.push(data)
            })
            return arr
        },
        ...mapGetters('storeStation', [
            'empList'
        ])
    },
    mounted() {
        this.getInfoByCode(this.$route.query.dispatchDetailCode, () => {
            // this.waitTime = getWaitTime(this.dispatchOrderInfo.createTime, '2018-04-03 08:48')
            this.t = setInterval(timeMove(this.waitTime), 1000)
        })
        getType(config.staff.refEmpStatus, (items) => {
            let empStatus = []
            items.forEach(item => {
                if (item.refDetailCode !== 'Shutdown') {
                    empStatus.push(item.refDetailCode)
                }
            })
            let params = {
                orgCode: this.storeInfoVo.orgCode,
                storeCode: this.storeInfoVo.storeCode,
                empType: "empTypeProductiveEmpType",
                // empStatusCodeList: empStatus
            }
            this.getEmpList(params)
        })

        this.getStation(this.storeInfoVo.storeCode)
    },
    methods: {
        ...mapActions('storeStation', [
            'getStoreStationObj',
            'getEmpList'
        ]),
        endTimeOnClick() {
            let getTime = (time) => {
                return new Date(time).getTime()
            }
            this.endTimeError = false
            if (this.params.endHour && this.params.endTime && this.params.startHour && this.params.startTime) {
                let endTime = common.formattingTime([this.params.endTime, this.params.endTime]).endTime + ' ' + this.params.endHour
                let starTime = common.formattingTime([this.params.startTime, this.params.startTime]).endTime + ' ' + this.params.startHour
                for (let index = 0; index < this.technicianDate.length; index++) {
                    const element = this.technicianDate[index];
                    if (element.dispatchEmpDetailInfos !== null) {
                        for (let index = 0; index < element.dispatchEmpDetailInfos.length; index++) {
                            const element1 = element.dispatchEmpDetailInfos[index];
                            if (element.empCode == this.params.technician) {
                                if ((getTime(starTime) > getTime(element1.dispatchStartTime)) && (getTime(endTime) < getTime(element1.dispatchEndTime))) {
                                    this.endTimeError = true
                                    return
                                } else if ((getTime(starTime) > getTime(element1.dispatchStartTime)) && getTime(starTime) < getTime(element1.dispatchEndTime)) {
                                    this.endTimeError = true
                                    return
                                } else if ((getTime(endTime) > getTime(element1.dispatchStartTime)) && getTime(endTime) < getTime(element1.dispatchEndTime)) {
                                    this.endTimeError = true
                                    return
                                }
                            }
                        }
                    }
                }
            }
        },
        startTimeOnClick() {
            let getTime = (time) => {
                return new Date(time).getTime()
            }
            this.startTimeError = false
            if (this.params.startHour && this.params.startTime) {
                let time = common.formattingTime([this.params.startTime, this.params.startTime]).endTime + ' ' + this.params.startHour
                this.params.endTime = new Date(new Date(time).getTime() + (this.dispatchOrderInfo.defaultWorkHours || 0) * 60000)
                function getendHour(val) {
                    return val < 10 ? '0' + val : val
                }
                this.params.endHour = getendHour(this.params.endTime.getHours()) + ':' + getendHour(this.params.endTime.getMinutes())
                for (let index = 0; index < this.technicianDate.length; index++) {
                    const element = this.technicianDate[index];
                    if (element.dispatchEmpDetailInfos !== null) {
                        for (let index = 0; index < element.dispatchEmpDetailInfos.length; index++) {
                            const element1 = element.dispatchEmpDetailInfos[index];
                            if (element.empCode == this.params.technician) {
                                if ((getTime(time) > getTime(element1.dispatchStartTime)) && (getTime(time) < getTime(element1.dispatchEndTime))) {
                                    this.startTimeError = true
                                    return
                                } else if ((getTime(time) > getTime(element1.workStartTime)) && (getTime(time) < getTime(element1.workEndTime))) {
                                    this.startTimeError = true
                                    return
                                }
                            }
                        }
                    }
                }
            }
        },
        technicianInput() {
            let params = {
                storeCode: this.storeInfoVo.storeCode,
                empCode: this.params.technician
            }
            api.mainBusiness.queryTechnicianListByDate(params).then(res => {
                if (res.data.code === 'success') {
                    let obj = res.data.obj
                    this.technicianDate = obj
                }
            })
        },
        save() {
            let getTime = (time) => {
                return new Date(time).getTime()
            }
            if (!this.params.technician) {
                this.state.technician = 'invalid'
            }
            if (!this.params.station) {
                this.state.station = 'invalid'
            }
            if (!this.params.startTime) {
                this.state.startTime = true
            }
            if (!this.params.endTime) {
                this.state.endTime = true
            }
            if (!this.params.startHour) {
                this.state.startHour = true
            }
            if (!this.params.endHour) {
                this.state.endHour = true
            }
            if (!this.params.technician && !this.params.station && !this.params.startTime && !this.params.endTime && !this.params.startHour && !this.params.endHour) {
                return
            }
            let endTime = common.formattingTime([this.params.endTime, this.params.endTime]).endTime + ' ' + this.params.endHour
            let startTime = common.formattingTime([this.params.startTime, this.params.startTime]).endTime + ' ' + this.params.startHour
            if (getTime(endTime) < new Date().getTime() || getTime(startTime) < new Date().getTime()) {
                Message({
                    type: 'warning',
                    message: "开始结束时间不能小于当前时间！"
                });
                return
            }
            if (getTime(startTime) >= getTime(endTime)) {
                Message({
                    type: 'warning',
                    message: "结束时间不得比开始时间小"
                });
                return
            }
            let obj = {
                technician: this.params.technician,
                station: this.params.station,
                startTime: startTime,
                endTime: endTime,
                startHour: this.params.startHour,
                endHour: this.params.endHour,
                dispatchOrderInfo: this.dispatchOrderInfo,
                reasons: this.params.reasons,
                remark: this.params.remark
            }
            let bookingClosingDate = getTime(this.dispatchOrderInfo.bookingClosingDate)
            getTime(endTime) > bookingClosingDate ? this.showWarning = true : this.showWarning = false
            this.$emit('params', obj)
        },
        back() {
            let obj = {
                dispatchOrderInfo: this.dispatchOrderInfo
            }
            this.$emit('back', obj)
        },
        timer(data, addValue) {
            let inFactoryTime = common.getRemainderTime(addValue, data)
            if (inFactoryTime.year) {
                return inFactoryTime.year + '年'
            } else if (inFactoryTime.month) {
                return inFactoryTime.month + '月'
            } else if (inFactoryTime.day) {
                return inFactoryTime.day + '天'
            } else if (inFactoryTime.hour) {
                return (inFactoryTime.hour < 10 ? '0' + inFactoryTime.hour : inFactoryTime.hour) + ':' + (inFactoryTime.minute < 10 ? "0" + inFactoryTime.minute : inFactoryTime.minute)
            } else if (inFactoryTime.minute) {
                return '00' + ':' + (inFactoryTime.minute < 10 ? "0" + inFactoryTime.minute : inFactoryTime.minute)
            }
        },
        getInfoByCode(_dispatchNo, next) {
            let params = {
                dispatchDetailCode: _dispatchNo
            }
            api.mainBusiness.getTechnicianDetail(params).then(res => {
                if (res.data.code === 'success') {
                    this.dispatchOrderInfo = res.data.obj
                    api.currentTime({}, (res) => {
                        this.currentTime = res.data
                        this.$set(this, 'waitTime', this.timer(this.currentTime, this.dispatchOrderInfo.dispatchOrderInfo.addValue))
                        this.Timer.push(setInterval(() => {
                            this.currentTime = new Date(new Date(this.currentTime).getTime() + 60000)
                            this.$set(this, 'waitTime', this.timer(this.currentTime, this.dispatchOrderInfo.dispatchOrderInfo.addValue))
                        }, 60000))
                    })
                    this.params = {
                        technician: this.dispatchOrderInfo.dispatchEmpDetailInfoList&&this.dispatchOrderInfo.dispatchEmpDetailInfoList[0].empCode,
                        station: this.dispatchOrderInfo.stationCode,
                        startTime: this.dispatchOrderInfo.dispatchStartTime && this.dispatchOrderInfo.dispatchStartTime.split(' ')[0],
                        endTime: this.dispatchOrderInfo.dispatchEndTime && this.dispatchOrderInfo.dispatchEndTime.split(' ')[0],
                        startHour: this.dispatchOrderInfo.dispatchStartTime && this.dispatchOrderInfo.dispatchStartTime.split(' ')[1],
                        endHour: this.dispatchOrderInfo.dispatchEndTime && this.dispatchOrderInfo.dispatchEndTime.split(' ')[1],
                        reasons: this.dispatchOrderInfo.dispatchHistoryTypeCode
                    }
                    if (this.dispatchOrderInfo.dispatchDetailStatus == 0) {
                        this.params.reasons = 'FirstDispatch'
                    } else if (this.dispatchOrderInfo.dispatchDetailStatus == 1) {
                        this.reasons = [{ text: '调整', value: 'Adjustment' }]
                        this.params.reasons = 'Adjustment'
                    } else if (this.dispatchOrderInfo.dispatchDetailStatus == 3) {
                        this.reasons = [
                            { text: '其他', value: 'Other' },
                            { text: '返工', value: 'Rework' },
                            { text: '暂停', value: 'Suspend' },]
                        this.params.reasons = 'Other'
                    }
                    this.getStoreStationObj({
                        pageStart: 1,
                        pageNums: config.pageNums,
                        storeCode: this.storeInfoVo.storeCode
                    })
                    next()
                }
            })
        },
        getStation(_storeCode) {
            let params = {
                storeCode: _storeCode
            }
            api.storeStation.queryNoPage(params).then(res => {
                if (res.data.code === 'success') {
                    this.stations = []
                    res.data.obj.forEach(item => {
                        let data = {
                            text: item.stationName,
                            value: item.stationCode
                        }
                        this.stations.push(data)
                    })
                }
            })
        },
        getTime(createTime, currentTime) {
            return getWaitTime(createTime, currentTime)
        },
        getStatus(colorType) {
            if (colorType == 0) {
                return 'block'
            } else if (colorType == 1) {
                return 'danger'
            } else if (colorType == 2) {
                return 'success'
            } else if (colorType == 3) {
                return 'warnning'
            } else {
                return 'block'
            }
        },
    },
    watch: {
        params: {
            handler(val) {
                if (this.params.startHour || this.params.endHour) {
                    let obj = {
                        startHour: this.params.startHour,
                        endHour: this.params.endHour,
                    }
                    this.$emit('time', obj)
                }
                //    let startTime = new Date(val.startTime),
                //        endTime = new Date(val.endTime),
                //         sy = startTime.getFullYear(),
                //         sm = startTime.getMonth() + 1,
                //         sd = startTime.getDate(),
                //         ey = endTime.getFullYear(),
                //         em = endTime.getMonth() + 1,
                //         ed = endTime.getDate()
                //     if(ey !== NaN) {
                //         let bookingClosingDate = new Date(this.dispatchOrderInfo.bookingClosingDate).getTime()
                //         let endTime = new Date((`${obj.endTime} ${obj.endHour}`)).getTime()
                //         endTime > bookingClosingDate ? this.showWarning = true : this.showWarning = false
                //     }
            },
            deep: true
        }
    },
    filters: {
        timeFilter(val) {
            if (val) {
                return val.substring(0, 16).replace(/-/g, '/')
            }
        },
    },
    beforeDestory() {
        for (let index = 0; index < this.Timer.length; index++) {
            const element = this.Timer[index];
            clearInterval(element)
        }
    }
}
</script>
<style scoped>
p {
    padding: 0;
    margin: 0;
}
.mar-botm {
    margin-bottom: 10px;
}
.padd-top {
    padding-top: 6px;
}
.red {
    font-size: 12px;
    color: #cd0100;
}
.left-info-box {
    width: 505px;
    margin-right: 20px;
    z-index: 30;
    box-shadow: -3px 0 20px 0 #bfc7d2;
}
.left-info-header {
    height: 100px;
    padding: 23px 20px;
    color: #fff;
}
.car-info {
    font-size: 22px;
}

.give-car-info {
    height: 124px;
    background-color: #fff;
    padding: 20px;
    font-size: 14px;
}
.m-btn {
    width: 63px;
    height: 22px;
    text-align: center;
    line-height: 22px;
    border: 1px solid #d5303b;
    border-radius: 3px;
    margin-right: 10px;
    cursor: pointer;
}
.m-btn:hover {
    background-color: #d5303b;
    color: #fff;
}
.bg-fff-btn {
    color: #d5303b;
}
.bg-red-btn {
    color: #fff;
    background-color: #d5303b;
}

.project-info {
    height: 100px;
    background-color: #f6f6f6;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0;
    line-height: 20px;
    padding: 20px;
}
.flex {
    display: flex;
}
.flex p {
    flex: 1;
}

.textarea-box {
    background-color: #fff;
    margin-bottom: -20px;
    padding-top: 20px;
    padding-left: 20px;
}
.dispatch-info {
    background-color: #fff;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0;
    line-height: 20px;
    padding: 20px;
}

.btn-box {
    background-color: #fff;
    padding: 0 30px 6px 0;
    margin-top: -20px;
}
.title {
    height: 40px;
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    font-size: 14px;
    color: #000000;
    padding: 10px 20px;
    background-color: #fff;
}

.record-list {
    background-color: #fff;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0;
    line-height: 20px;
    padding: 20px;
    border-bottom: 1px solid #eeeeee;
}
#app .give-car-info .btn.colorType {
    padding: 1px 16px;
}
.bg-black {
    background-color: #1f2d3d;
}
.overflow {
    width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
#app .give-car-info .btn.colorType {
    padding: 1px 16px;
    border-color: #d63a3c;
    color: #d63a3c;
}
#app .give-car-info .btn.active {
    border-color: #d63a3c;
    background-color: #d63a3c;
    color: #fff;
}
.color-success {
    color: #5fbc69;
}
.color-danger {
    color: #d63a3c;
}
.color-warnning {
    color: #f3a239;
}
.color-block {
    color: #333333;
}
.success {
    background-color: #5fbc69;
    color: #fff;
}
.danger {
    background-color: #d63a3c;
    color: #fff;
}
.warnning {
    background-color: #f3a239;
    color: #fff;
}
.block {
    color: #fff;
    background-color: #333333;
}
</style>

