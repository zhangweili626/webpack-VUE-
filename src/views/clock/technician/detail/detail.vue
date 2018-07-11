<template>
<div class="animated fadeIn" style="marginBottom: 20px">
    <div class="row">
        <div class="col-md-12">
            <div class="td-top clearfix">
                <div class="left-info pull-left">
                    <div class="left-info-con">
                        <!-- <div class="img-box"></div> -->
                        <img class="img-box" :src="empUrl" alt="">
                        <p class="text-center">{{ empName }}</p>
                    </div>
                    <!-- <div class="left-info-bottom">
                        <p>打卡信息</p>
                        <p class="month"><span style="marginLeft: 12px">本月已打卡工时：</span><span>1046</span></p>
                        <p class="today"><span style="marginLeft: 12px">今日已打卡工时：</span><span>16</span></p>                
                    </div> -->
                </div>
                <div class="task-box pull-left" style="width: calc(100% - 230px);">
                    <div class="title">
                        <span>当前任务</span>
                        <!-- <b-button class="pull-right" size="sm" variant="danger" @click="updataData" >刷新</b-button> -->
                    </div>
                    <div class="wrapper-box">
                        <div style="overflow: auto;">
                            <car-info-list :list="toDayList" :isSetTime="setTime" @itemClick="getDispatchDetail"></car-info-list>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <main-list :dispatchOrderInfo="dispatchOrderInfo" :isShowRequired="true" :isSetMainTime="isSetMainTime" @closeCardSuccess="getDispatchDetailAgain"></main-list>
        </div>
    </div>
    
</div>
</template>
<script>
import CarInfoList from 'views/clock/station/detail/car-info-list'
import MainList from './main-list'
import api from 'common/api.js'
import common from '../../../../common/common';
export default {
    components: {
        CarInfoList,
        MainList
    },
    data() {
        return {
            empName: '',
            empUrl: '',
            setTime: false,
            isSetMainTime: false,
            dispatchOrderInfo: {},
            model:{
                id: '',
                dispatchNo: ''
            },
            dispatchNo: '',
            userInfo: {},
            toDayList: [
                // {code: '123456789012', carId: '沪A1213', name: '约定交车', overTime: '2018/02/29 00:00', waitTime: '010:00', bg: 'success'},
                // {code: '123456789012', carId: '沪A1213', name: '约定交车', overTime: '2018/02/29 00:00', waitTime: '010:00', bg: 'success'},
                // {code: '123456789012', carId: '沪A1213', name: '约定交车', overTime: '2018/02/29 00:00', waitTime: '010:00', bg: 'warnning'},
                // {code: '123456789012', carId: '沪A1213', name: '约定交车', overTime: '2018/02/29 00:00', waitTime: '010:00', bg: 'danger'},
                // {code: '123456789012', carId: '沪A1213', name: '约定交车', overTime: '2018/02/29 00:00', waitTime: '010:00', bg: 'warnning'},
                // {code: '123456789012', carId: '沪A1213', name: '约定交车', overTime: '2018/02/29 00:00', waitTime: '010:00', bg: 'warnning'},
                // {code: '123456789012', carId: '沪A1213', name: '约定交车', overTime: '2018/02/29 00:00', waitTime: '010:00', bg: 'warnning'},
                // {code: '123456789012', carId: '沪A1213', name: '约定交车', overTime: '2018/02/29 00:00', waitTime: '010:00', bg: 'warnning'},
                // {code: '123456789012', carId: '沪A1213', name: '约定交车', overTime: '2018/02/29 00:00', waitTime: '010:00', bg: 'warnning'},
            ],
            currentTime: ''
        }
    },
    created() {
        this._initData();
        // this.getDispatchDetail();
    },
    computed: {
        toDaylistWidth() {
            return this.toDayList.length * 150
        },      
    },
    methods: {
        // 初始化数据
         _initData() {
            let routeParams = this.$route.params;
            this.userInfo.empCode = routeParams.id
            this.model.id = routeParams.id;
            let option = {
                    empCode: routeParams.id
                }
            api.staff.getDetail(option, (res) => {
                if(res.data.code === 'success') {
                    this.empName = res.data.obj.empCnName
                    this.empUrl = res.data.obj.empBigPic
                }
            })
            // api.clock.getTechnicianList(option, (res) => {
            //     if(res.data.code === 'success') {
            //         this.empName = res.data.obj[0].empName
            //         this.empUrl = res.data.obj[0].empBigPic
            //     }
            // })
            let param = {
                    empCode: routeParams.id,
                    orderStatus: 3
                }
             api.mainBusiness.queryCar(param).then((res) => {
                if(res.data.code === 'success') {
                    //this.userList = res.data.obj;
                    
                    this.toDayList = res.data.obj
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
                    this.getDispatchDetail(this.toDayList[0])
                };
            })   
        },
        // 选中某一个任务  获取任务详情
       getDispatchDetail(val) {
           this.dispatchNo = val.dispatchNo
           let param = {
                    dispatchNo: val.dispatchNo,
                    empCode: this.userInfo.empCode
                }
             api.mainBusiness.getInfoByCode(param, (res) => {
                if(res.data.code === 'success') {
                    this.dispatchOrderInfo = res.data.obj;
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
       // 关卡后   再次获取任务详情   刷新数据
       getDispatchDetailAgain(val) {
           let param = {
                    dispatchNo: this.dispatchNo,
                }
            api.mainBusiness.getInfoByCode(param, (res) => {
                if(res.data.code === 'success') {
                    this.dispatchOrderInfo = res.data.obj;
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
.left-info {
    position: relative;
    width: 200px;
    height: 225px;
    background-color: #fff;
    border-radius: 7px;
}
.left-info-con {
    padding: 10px 50px;
    margin-top: 40px;
}
.left-info-con p {
    margin-top: 6px;
}
.img-box {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    /* background-color: rgb(133, 104, 104); */
}

.left-info .left-info-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 80px;
    background: #FAFAFA;
    padding: 15px 30px;
    font-size: 12px;
    color: #323C47;
    border-radius: 4px;    
}
.left-info-bottom p {
    position: relative;
    padding: 0;
    margin-bottom: 2px;
}
.month::before {
    position: absolute;
    top: 7px;
    display: inline-block;
    content: '';
    width: 5px;
    height: 5px;
    background-color: #3E89DA;
    border-radius: 50%;
}
.today::before {
    position: absolute;
    top: 7px;
    display: inline-block;
    content: '';
    width: 5px;
    height: 5px;
    background-color: #E2E2E2;
    border-radius: 50%;    
}
.today::after {
    position: absolute;
    top: -8px;
    left: 1.5px;
    display: inline-block;
    content: '';
    width: 1px;
    height: 16px;
    background-color: #E2E2E2;  
}


.task-box {
    margin-left: 30px;
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
