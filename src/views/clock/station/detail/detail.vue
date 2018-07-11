<template>
<div class="animated fadeIn" style="marginBottom: 20px">
    <div class="row">
        <div class="col-md-12 clearfix">
            <div class="left-box pull-left">
                <left-station :stationInfo="stationInfo" :userList="userList" @selUser="selUser"></left-station>
            </div>
            <div class="td-top pull-left" style="width: calc(100% - 210px)">
                <div class="task-box">
                    <div class="title">当前任务</div>
                    <div class="wrapper-box">
                        <div style="overflow: auto;">
                            <car-info-list :isShowSearch="false" :isSetTime="setTime" :list="toDayList" @itemClick="getDetailInfo"></car-info-list>
                        </div>
                    </div>                
                </div>
                <main-list :isShowRequired="true" :isSetMainTime="isSetMainTime" :dispatchOrderInfo="dispatchOrderInfo"></main-list>  
            </div>
        </div>
    </div>
    
</div>
</template>
<script>
import LeftStation from './left-station'
import CarInfoList from './car-info-list'
import MainList from '../../technician/detail/main-list'
import api from 'common/api.js'
export default {
    components: {
        CarInfoList,
        MainList,
        LeftStation
    },
    data() {
        return {
            userList:[],
            dispatchOrderInfo: {},
            // toDaylistWidth: '0',
            userInfo: {},
            toDayList: [
                // {code: '123456789012', carId: '沪A1213', name: '约定交车', overTime: '2018/02/29 00:00', waitTime: '010:00', bg: 'success',fc: 'success-color'},
                // {code: '123456789012', carId: '沪A1213', name: '约定交车', overTime: '2018/02/29 00:00', waitTime: '010:00', bg: 'success',fc: 'success-color'},
                // {code: '123456789012', carId: '沪A1213', name: '约定交车', overTime: '2018/02/29 00:00', waitTime: '010:00', bg: 'warnning',fc: 'warnning-color'}
            ],
            stationInfo: {},
            currentTime: null,
            setTime: false,
            isSetMainTime: false
        }
    },
    computed: {
        toDaylistWidth() {
            // return 1000
            return this.toDayList.length * 150
        },
    },
    created() {
        this._initData();
        this.getStationInfoByCode()
    },
    methods:{
        /// 初始化数据
        _initData() {
            let routeParams = this.$route.params;
            let param = {
                    stationCode: routeParams.id,
                    empIsDisplay: 1
                }
            api.clock.getEmpList(param, (res) => {
                if(res.data.code === 'success') {
                    this.userList = res.data.obj;
                    if(this.userList.length > 0) {
                        let option = {
                            empCode: this.userList[0].empCode,
                            orderStatus: 3
                        }
                        this.userInfo.empCode = this.userList[0].empCode
                        api.mainBusiness.queryCar(option).then((res) => {
                            if(res.data.code === 'success') {
                                this.toDayList = res.data.obj
                                // this.toDaylistWidth = this.toDayList.length * 150
                                if(this.toDayList.length > 0) {
                                    this.toDayList[0].active = true
                                    this.getDetailInfo(this.toDayList[0])
                                }
                                api.currentTime({},(res)=>{
                                    this.currentTime = res.data
                                    let currentObj = new Date(this.currentTime)
                                    let currentMilliSecond = currentObj.getTime()
                                    this.toDayList.forEach(element => {
                                        let eachObj = new Date(element.addValue)
                                        let eachCurrentMilliSecond = eachObj.getTime()
                                        element.waitTime = currentMilliSecond - eachCurrentMilliSecond
                                    })
                                    this.toDayList = JSON.parse(JSON.stringify(this.toDayList))
                                    this.setTime = true
                                })
                            };
                        }) 
                    }
                };
            })
        },
        // 获取工位信息
        getStationInfoByCode() {
            let routeParams = this.$route.params;
            let option = {
                stationCode: routeParams.id
            }
            api.storeStation.queryByCode(option).then((res) => {
                if(res.data.code === 'success') {
                    this.stationInfo.stationCode = res.data.obj.stationCode
                    this.stationInfo.stationName = res.data.obj.stationName
                }
            })
        },
        // 获取用户的任务详情
        getDetailInfo(value) {
            let param = {
                dispatchNo: value.dispatchNo,
                empCode: this.userInfo.empCode
            }
            api.mainBusiness.getInfoByCode(param, res => {
                if(res.data.code === 'success') {
                    this.dispatchOrderInfo = res.data.obj
                    api.currentTime({},(res)=>{
                        this.currentTime = res.data
                        let currentObj = new Date(this.currentTime)
                        let currentMilliSecond = currentObj.getTime()
                        let eachObj= new Date(this.dispatchOrderInfo.addValue)
                        let eachCurrentMilliSecond = eachObj.getTime()
                        this.dispatchOrderInfo.waitTime = currentMilliSecond - eachCurrentMilliSecond
                        this.dispatchOrderInfo = JSON.parse(JSON.stringify(this.dispatchOrderInfo))
                        this.isSetMainTime = true
                    })
                }
            })
            
        },
        // 获取用户的任务信息
        selUser(val){
            let param = {
                    empCode: val.empCode,
                }
             api.clock.getDispatch(param, (res) => {
                if(res.data.code === 'success') {
                    this.toDayList = res.data.obj
                    this.getDetailInfo(this.toDayList[0])
                    api.currentTime({},(res)=>{
                        this.currentTime = res.data
                        let currentObj = new Date(this.currentTime)
                        let currentMilliSecond = currentObj.getTime()
                        this.toDayList.forEach(element => {
                            let eachObj = new Date(element.addValue)
                            let eachCurrentMilliSecond = eachObj.getTime()
                            element.waitTime = currentMilliSecond - eachCurrentMilliSecond
                        })
                        this.toDayList = JSON.parse(JSON.stringify(this.toDayList))
                        this.setTime = true
                    })
                };
            })   
        }
    },
    watch:{
        '$route': '_initData'	
    }
}
</script>
<style scoped>
.td-top {
    margin-bottom: 30px;
}

.left-box {
    width: 200px;
    height: 100%;
    background-color: #fff;
    margin-right: 10px;
    border-radius: 4px;
}

.task-box {
    margin-bottom: 30px;
    padding: 12px 30px;
    background-color: #fff;
    border-radius: 4px;
}
.task-box .title {
    font-size: 22px;
    color: #333333;
    margin-bottom: 10px;
}
.wrapper-box{
    width: 100%;
    overflow: auto;
}
</style>
