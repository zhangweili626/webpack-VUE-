<template>
<div class="row">
    <div class="col-md-12 js-tab">
        <div class="pull-right" style="margin-right: 20px">
            <div>
                <select-date @get-date="getDate"></select-date>
            </div>
        </div>
        
        <b-tabs pills>
            <b-tab title="技师" active>
                <technician-chart 
                    :defaultStartTime="defaultStartTime"
                    :defaultEndTime="defaultEndTime"
                    :selectDate="queryDate"
                    :list="technicianList" 
                    @itemClick="toDetail">
                </technician-chart>                
            </b-tab>
            <b-tab title="工位">
                <technician-chart 
                    :list="stationList" 
                    :defaultStartTime="defaultStartTime"
                    :defaultEndTime="defaultEndTime"
                    :tempWidth="120"
                    :tempMinutes="30"
                    :lineWidth="0"
                    :selectDate="queryDate">
                </technician-chart>
            </b-tab>
        </b-tabs>
    </div>
</div>
</template>
<script>

import TechnicianChart from './technician-chart'

import SelectDate from 'components/select-date/select-date'

import api from 'common/api'
import { formatDate } from 'common/api-common'

import Vue from 'vue'
import { DatePicker } from 'element-ui'
Vue.use(DatePicker)

export default {
    components: {
        TechnicianChart,
        SelectDate
    },
    data() {
        return {
            technicianList: [],
            stationList: [],
            queryDate: '',
            defaultStartTime: '08:00',
            defaultEndTime: '24:00'
        }
    },
    computed: {
        storeInfoVo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            return userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
        } 
    },

    methods: {
        toDetail(item) {
            this.$router.push({
                path: `/resource-utilization/detail/${item.code}`,
                query:{
                    queryDate:this.queryDate
                }
            })
        },
        getDate(date) {
            this.queryDate = date
            if(this.storeInfoVo) {
                this.queryTechnicianList(this.queryDate)
                this.queryStationList(this.queryDate) 
            }     
        },
        mergeEmp(obj){
            let empObj = {}
            for (let index = 0; index < obj.length; index++) {
                const element = obj[index];
                if(empObj[element.empCode]){
                    empObj[element.empCode].dispatchEmpDetailInfos = [...empObj[element.empCode].dispatchEmpDetailInfos,...(element.dispatchEmpDetailInfos||[])] 
                }else{
                    element.dispatchEmpDetailInfos =  element.dispatchEmpDetailInfos || []
                    empObj[element.empCode] = element
                }
            }
            let arr = []
            for (const key in empObj) {
                if (empObj.hasOwnProperty(key)) {
                    const element = empObj[key];
                    arr.push(element)
                }
            }
            return arr
        },
        queryTechnicianList(date) {
            let params = {
                storeCode: this.storeInfoVo.storeCode,
                sechData: date
            }
            api.mainBusiness.queryTechnicianListByDate(params).then(res => {
                if(res.data.code === 'success') {
                    this.technicianList = []
                    let obj = this.mergeEmp(res.data.obj)
                    obj.forEach(item => {
                        let data = {
                            name: item.empName,
                            code: item.empCode,
                            queryDate:this.queryDate,
                            duration: []
                        }
                        if(item.dispatchEmpDetailInfos != null) {
                            item.dispatchEmpDetailInfos.forEach((key,index) => {
                                data.duration.push({
                                    startTime: key.dispatchStartTime, 
                                    endTime: key.dispatchEndTime,
                                    dispatchDetailCode: key.dispatchDetailCode
                                })
                                if(index == item.dispatchEmpDetailInfos.length-1){
                                    data.duration = this.dateListMerge(data.duration)
                                }
                            })
                        }
                        this.technicianList.push(data)
                    })
                }
            })
        },
        queryStationList(date) {
            let params = {
                storeCode: this.storeInfoVo.storeCode,
                sechData: date
            }
            api.mainBusiness.queryStationListByDate(params).then(res => {
                if(res.data.code === 'success') {
                    this.stationList = []
                    let obj = res.data.obj
                    obj.forEach((item,index) => {
                        let data = {
                            name: item.stationName,
                            duration: []
                        }
                        data.duration = this.dateListMerge([{
                            startTime: item.dispatchStartTime, 
                            endTime: item.dispatchEndTime 
                        }])
                        this.stationList.push(data)
                    })
                }
            })
        },
        dateListMerge(list) {
            let arr = []
            for(let i = 0; i < list.length; i++) {
                let startDate = list[i].startTime && list[i].startTime.substring(0, 10)
                let endDate = list[i].endTime && list[i].endTime.substring(0, 10)
                let currentStartTime = list[i].startTime && list[i].startTime.substring(11, 16)
                let currentEndTime = list[i].endTime && list[i].endTime.substring(11, 16)
                    
                if(startDate === endDate) {
                    arr.push({
                        startTime: currentStartTime,
                        endTime: currentEndTime,
                        dispatchDetailCode: list[i].dispatchDetailCode
                    })
                }else if(startDate === this.queryDate) {
                    arr.push({
                        startTime: currentStartTime,
                        endTime: this.defaultEndTime,
                        dispatchDetailCode: list[i].dispatchDetailCode
                    })
                }else if(this.getTimes(startDate) < this.getTimes(this.queryDate)) {
                    arr.push({
                        startTime: this.defaultStartTime,
                        endTime: endDate === this.queryDate ? currentEndTime : this.defaultEndTime,
                        dispatchDetailCode: list[i].dispatchDetailCode
                    })
                }
            }
            return arr
        },
        getTimes(date) {
            if(typeof date === 'string') {
                return new Date(date).getTime()
            }
        }
    }
}
</script>
<style>

.js-tab .nav-item {
    width: 180px;
    height: 35px;
    text-align: center;
    line-height: 20px;
    background-color: #B2BEC6;
    border-radius: 3px; 
    margin-bottom: 10px;
    margin-right: 5px;
}
.js-tab .nav-item a {
    font-size: 16px;
    color: #fff !important; 
    text-decoration: none !important;
}

.js-tab .nav-pills .nav-link.active {
    background-color: #fff;
    color: #67737B !important;
}
.js-tab .tab-content {
    padding-right: 20px;
}
</style>



