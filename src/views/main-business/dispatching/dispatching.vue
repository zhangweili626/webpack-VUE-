<template>
<div class="clearfix" style="marginBottom: 20px">
    <left-info class="pull-left" @time="time" @params="getParams" @back="back"></left-info>
    <div class="row pull-left" style="width: calc(100% - 495px)">
        <div class="col-md-12 jishi-tab">
            <div class="pull-right" style="margin-right: 20px">
                <select-date @get-date="getDate"></select-date>
            </div>
            <b-tabs pills>
                <b-tab title="技师" active >
                    <chart :serviceCode="serviceCode" :dataList="dataList" 
                           :startTime="params.startHour" 
                           :endTime="params.endHour"
                           :useTime="params.useTime"
                           :workType="workTypeList"
                           @selectWork="selectWorkInput">
                    </chart>
                </b-tab>
                <b-tab :serviceCode="serviceCode" title="工位" >
                    <chart :dataList="stationList" 
                           :startTime="params.startHour" 
                           :endTime="params.endHour"
                           :useTime="params.useTime">
                    </chart>
                </b-tab>
            </b-tabs> 
        </div>
    </div>     
</div>  
</template>
<script>
import LeftInfo from './left-info'
import Chart from './chart'
import SelectDate from 'components/select-date/select-date'
import api from 'common/api'
import config from 'common/config'
import { getType } from 'common/api-common'
import { Message} from 'element-ui'
export default {
    components: {
       LeftInfo,
       Chart,
       SelectDate
    },
    data() {
        return {
            date: new Date(),
            dataList:[],
            serviceCode:"",
            // dataList: [
            //     {
            //         name: '技师01',
            //         list: [
            //             {
            //                 estimateStartTime: '08:00',
            //                 estimateEndTime: '08:10',
            //                 actualStartTime: '',
            //                 actualEndTime: '',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:10',
            //                 estimateEndTime: '08:20',
            //                 actualStartTime: '08:10',
            //                 actualEndTime: '08:20',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '技师02',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:30',
            //                 estimateEndTime: '08:40',
            //                 actualStartTime: '08:30',
            //                 actualEndTime: '08:45',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '技师03',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:30',
            //                 estimateEndTime: '08:40',
            //                 actualStartTime: '08:30',
            //                 actualEndTime: '08:45',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:20',
            //                 estimateEndTime: '10:30',
            //                 actualStartTime: '10:10',
            //                 actualEndTime: '10:20',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:30',
            //                 estimateEndTime: '10:40',
            //                 actualStartTime: '',
            //                 actualEndTime: '',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '技师04',
            //         list: [
            //             {
            //                 estimateStartTime: '08:00',
            //                 estimateEndTime: '08:10',
            //                 actualStartTime: '',
            //                 actualEndTime: '',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:10',
            //                 estimateEndTime: '08:20',
            //                 actualStartTime: '08:10',
            //                 actualEndTime: '08:20',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '技师05',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:30',
            //                 estimateEndTime: '08:40',
            //                 actualStartTime: '08:30',
            //                 actualEndTime: '08:45',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '技师06',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:30',
            //                 estimateEndTime: '08:40',
            //                 actualStartTime: '08:30',
            //                 actualEndTime: '08:45',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:20',
            //                 estimateEndTime: '10:30',
            //                 actualStartTime: '10:10',
            //                 actualEndTime: '10:20',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:30',
            //                 estimateEndTime: '10:40',
            //                 actualStartTime: '',
            //                 actualEndTime: '',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '技师07',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '技师08',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:30',
            //                 estimateEndTime: '08:40',
            //                 actualStartTime: '08:30',
            //                 actualEndTime: '08:45',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:20',
            //                 estimateEndTime: '10:30',
            //                 actualStartTime: '10:10',
            //                 actualEndTime: '10:20',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:30',
            //                 estimateEndTime: '10:40',
            //                 actualStartTime: '',
            //                 actualEndTime: '',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '技师09',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            // ],
            params: {},
            stationList:[],
            // stationList: [
            //     {
            //         name: '工位01',
            //         list: [
            //             {
            //                 estimateStartTime: '08:00',
            //                 estimateEndTime: '08:10',
            //                 actualStartTime: '',
            //                 actualEndTime: '',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:10',
            //                 estimateEndTime: '08:20',
            //                 actualStartTime: '08:10',
            //                 actualEndTime: '08:20',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '工位02',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:30',
            //                 estimateEndTime: '08:40',
            //                 actualStartTime: '08:30',
            //                 actualEndTime: '08:45',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '工位03',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:30',
            //                 estimateEndTime: '08:40',
            //                 actualStartTime: '08:30',
            //                 actualEndTime: '08:45',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:20',
            //                 estimateEndTime: '10:30',
            //                 actualStartTime: '10:10',
            //                 actualEndTime: '10:20',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:30',
            //                 estimateEndTime: '10:40',
            //                 actualStartTime: '',
            //                 actualEndTime: '',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '工位04',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:30',
            //                 estimateEndTime: '08:40',
            //                 actualStartTime: '08:30',
            //                 actualEndTime: '08:45',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:20',
            //                 estimateEndTime: '10:30',
            //                 actualStartTime: '10:10',
            //                 actualEndTime: '10:20',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:30',
            //                 estimateEndTime: '10:40',
            //                 actualStartTime: '',
            //                 actualEndTime: '',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '工位05',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:30',
            //                 estimateEndTime: '08:40',
            //                 actualStartTime: '08:30',
            //                 actualEndTime: '08:45',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:20',
            //                 estimateEndTime: '10:30',
            //                 actualStartTime: '10:10',
            //                 actualEndTime: '10:20',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:30',
            //                 estimateEndTime: '10:40',
            //                 actualStartTime: '',
            //                 actualEndTime: '',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '工位06',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:30',
            //                 estimateEndTime: '08:40',
            //                 actualStartTime: '08:30',
            //                 actualEndTime: '08:45',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:20',
            //                 estimateEndTime: '10:30',
            //                 actualStartTime: '10:10',
            //                 actualEndTime: '10:20',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:30',
            //                 estimateEndTime: '10:40',
            //                 actualStartTime: '',
            //                 actualEndTime: '',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            //     {
            //         name: '工位07',
            //         list: [
            //             {
            //                 estimateStartTime: '08:20',
            //                 estimateEndTime: '08:30',
            //                 actualStartTime: '08:25',
            //                 actualEndTime: '08:30',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '08:30',
            //                 estimateEndTime: '08:40',
            //                 actualStartTime: '08:30',
            //                 actualEndTime: '08:45',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //             {
            //                 estimateStartTime: '10:20',
            //                 estimateEndTime: '10:30',
            //                 actualStartTime: '10:10',
            //                 actualEndTime: '10:20',  
            //                 station: '工位01',
            //                 remark: '喷漆'  
            //             },
            //         ]
            //     },
            // ],
            status: '',
            queryDate: '',
            workTypeList: [],
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
    created() {
        api.mainBusiness.getTechnicianDetail({dispatchDetailCode:this.$route.query.dispatchDetailCode}).then(res => {
            if(res.data.code === 'success') {
                let dispatchOrderInfo = res.data.obj
                api.mainBusiness.queryServiceWorkTypeInfoNoPage({
                    serviceCode:dispatchOrderInfo.serviceCode
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        this.serviceCode = msg.data.obj[0].workTypeCode
                    }
                })
            }
        })
        getType(config.storeStation.workTypeRef, items => {
            items.forEach(item => {
                let data = {
                    text: item.refDetailName,
                    value: item.refDetailCode
                }
                this.workTypeList.push(data)
            })
        })
        this.getAllTechnicianDetail()
        this.queryStationList()

    },
    methods: {
        time(obj){
            this.$set(this.params,'startHour',obj.startHour)
            this.$set(this.params,'endHour',obj.endHour)
        },
        back(obj){
            this.params = obj
            this.$router.push({
                query: {
                    dispatchNo: this.params.dispatchOrderInfo.dispatchNo
                },
                path: '/resource-utilization/query'
            })
        },
        selectWorkInput(value){
            this.selectWork = value
            this.getAllTechnicianDetail(this.queryDate, this.selectWork)
        },
        getParams(obj) {
            this.params = obj
            let param,relationCode
            if(this.params.reasons == 'FirstDispatch'){
                api.ordinalInfo.getSequence({
                    serviceCode: 'DISPEMPDETAILSEQ'                  
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        relationCode = msg.data.obj
                        param = {
                            id:this.params.dispatchOrderInfo.id,
                            orderNo:this.params.dispatchOrderInfo.orderNo,
                            dispatchNo:this.params.dispatchOrderInfo.dispatchNo,
                            createOrgCode:this.params.dispatchOrderInfo.createOrgCode,
                            dispatchDetailCode:this.params.dispatchOrderInfo.dispatchDetailCode,
                            serviceOrderDetailCode:this.params.dispatchOrderInfo.serviceOrderDetailCode,
                            serviceCode:this.params.dispatchOrderInfo.serviceCode,
                            dispatchStartTime:this.params.startTime,
                            dispatchEndTime:this.params.endTime,
                            stationCode:this.params.station,
                            remark:this.params.remark,
                            dispatchDetailStatus:1,
                            dispatchHistoryTypeCode:this.params.reasons,
                            dispatchEmpDetailInfoList:[{
                                relationCode:relationCode,
                                dispatchDetailCode:this.params.dispatchOrderInfo.dispatchDetailCode,
                                dispatchNo:this.params.dispatchOrderInfo.dispatchNo,
                                empCode:this.params.technician,
                                weight:0
                            }]
                        }
                        api.mainBusiness.editDispatchDetailInfo([param],(res)=>{
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'success',
                                    message: "操作成功"
                                });
                                this.$router.push({
                                    query: {
                                        dispatchNo: this.params.dispatchOrderInfo.dispatchNo
                                    },
                                    path: '/resource-utilization/query'
                                })
                            }
                        })
                    }
                })
                
            }else{
                this.params.dispatchOrderInfo.dispatchEmpDetailInfoList[0].empCode = this.params.technician
                param = {
                    id:this.params.dispatchOrderInfo.id,
                    orderNo:this.params.dispatchOrderInfo.orderNo,
                    dispatchNo:this.params.dispatchOrderInfo.dispatchNo,
                    createOrgCode:this.params.dispatchOrderInfo.createOrgCode,
                    dispatchDetailCode:this.params.dispatchOrderInfo.dispatchDetailCode,
                    serviceOrderDetailCode:this.params.dispatchOrderInfo.serviceOrderDetailCode,
                    serviceCode:this.params.dispatchOrderInfo.serviceCode,
                    dispatchStartTime:this.params.startTime,
                    dispatchEndTime:this.params.endTime,
                    stationCode:this.params.station,
                    dispatchDetailStatus:this.params.dispatchOrderInfo.dispatchDetailStatus,
                    remark:this.params.remark,
                    dispatchHistoryTypeCode:this.params.reasons,
                    dispatchEmpDetailInfoList:this.params.dispatchOrderInfo.dispatchEmpDetailInfoList
                }
                api.mainBusiness.editDispatchDetailInfo([param],(res)=>{
                    if(res.data.code === 'success') {
                        Message({
                            type: 'success',
                            message: "操作成功"
                        });
                        this.$router.push({
                            query: {
                                dispatchNo: this.params.dispatchOrderInfo.dispatchNo
                            },
                            path: '/resource-utilization/query'
                        })
                    }
                })
            }
            
        },
        getDate(date) {
            this.queryDate = date
            if(this.storeInfoVo) {
                this.getAllTechnicianDetail(this.queryDate, this.selectWork)
                this.queryStationList(this.queryDate)
            }     
        },
        queryStationList(date='') {
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
                            code: item.stationCode,
                            list: []
                        }
                        data.list = [{
                            estimateStartTime: item.dispatchStartTime&&item.dispatchStartTime.split(' ')[1],
                            estimateEndTime: item.dispatchEndTime&&item.dispatchEndTime.split(' ')[1],
                            actualStartTime: item.workStartTime&&item.workStartTime.split(' ')[1],
                            actualEndTime: item.workEndTime&&item.workEndTime.split(' ')[1],
                            station: item.stationName,
                            remark: item.serviceName,
                            dispatchNo:item.dispatchNo
                        }]
                        this.stationList.push(data)
                    })
                }
            })
        },
        getAllTechnicianDetail(date = null,selectWork = null) {
            let params = {
                storeCode: this.storeInfoVo.storeCode,
                sechData: date,
                empWorkTypeCodes: selectWork ?  [selectWork] : []
            }
            api.mainBusiness.queryTechnicianListByDate(params).then(res => {
                if(res.data.code === 'success') {
                    this.dataList = []
                    let obj = res.data.obj
                    obj.forEach(item => {
                        let data = {
                            name: item.empName,
                            code: item.empCode,
                            list: []
                        }
                        if(item.dispatchEmpDetailInfos != null) {
                            item.dispatchEmpDetailInfos.forEach((key,index) => {
                                data.list.push({
                                    estimateStartTime: key.dispatchStartTime&&key.dispatchStartTime.split(' ')[1],
                                    estimateEndTime: key.dispatchEndTime&&key.dispatchEndTime.split(' ')[1],
                                    actualStartTime: key.workStartTime&&key.workStartTime.split(' ')[1],
                                    actualEndTime: key.workEndTime&&key.workEndTime.split(' ')[1],
                                    station: key.stationName,
                                    remark: key.serviceName,
                                    dispatchNo:key.dispatchNo
                                })
                                if(index == item.dispatchEmpDetailInfos.length-1){
                                    data.list = data.list
                                }
                            })
                        }else{
                            data.list.push({
                                estimateStartTime: '',
                                estimateEndTime: '',
                                actualStartTime: '',
                                actualEndTime: '',
                                station: '',
                                remark: '',
                                dispatchNo:''
                            })
                        }
                        this.dataList.push(data)
                    })
                }
            })
        },
    }
}
</script>
<style >
.jishi-tab .nav-item {
    /* width: 100px; */
    height: 35px;
    text-align: center;
    line-height: 20px;
    background-color: #B2BEC6;
    border-radius: 3px; 
    margin-bottom: 10px;
    margin-right: 5px;
}
#app .main .left-info-box .error .el-input__inner{
    border-color: #f86c6b;
}
@media screen and (min-width: 1600px) {
    .jishi-tab .nav-item  {
        width: 180px;
    }
}
@media screen and (max-width: 1500px) {
    .jishi-tab .nav-item  {
        width: 100px;
    }
}
.jishi-tab .nav-item a {
    font-size: 16px;
    color: #fff !important; 
    text-decoration: none !important;
}

.jishi-tab .nav-pills .nav-link.active {
    background-color: #fff;
    color: #67737B !important;
}
.jishi-tab .tab-content .tab-pane {
    padding: 0
}
.el-input__inner {
    height: 30px;
}
.icon-box {
    margin-left: 10px;
}
.icon-left {
    margin-right: 5px; 
}
.icon-bg {
    width: 40px;
    height: 30px;
    background-color: #B2BEC6;
    color: #fff;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
}
</style>
