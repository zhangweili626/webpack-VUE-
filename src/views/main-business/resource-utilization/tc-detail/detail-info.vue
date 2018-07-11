<template>
<div class="detail-info-box animated fadeIn">
    <div class="detail-info-header" :class="`${getStatus(dispatchDetailInfoVo.colorType)}`">
        <p>
            <span>WIP：{{dispatchDetailInfoVo.orderNo}}</span>
            <!-- <span>{{dispatchNo.dispatchNo}}</span> -->
        </p>
        <div class="car-info">
            <div class="pull-left"><strong>{{dispatchDetailInfoVo.custPlates}}</strong></div>
            <div class="pull-right"><strong>SA：</strong><strong>{{dispatchDetailInfoVo.saName}}</strong></div>            
        </div>
    </div>
    <div class="give-car-info">
        <p class="mar-botm">预定交车时间：{{dispatchDetailInfoVo.bookingClosingDate}}</p>
        <p class="mar-botm">已在厂时间：{{inFactoryTime}}</p>
        <b-button class="colorType" size="sm" :class="{active:dispatchDetailInfoVo.colorType ==3}">返工</b-button>
        <b-button class="colorType" size="sm" :class="{active:dispatchDetailInfoVo.colorType ==1}">紧急</b-button>
        <b-button class="colorType" size="sm" :class="{active:dispatchDetailInfoVo.colorType ==2}">预约</b-button>
        <b-button class="colorType" size="sm" :class="{active:dispatchDetailInfoVo.colorType ==0}">普通</b-button>
    </div>
    <div class="project-info">
        <p class="mar-botm">项目编码：{{dispatchNo.serviceCode}}</p>
        <div class="flex">
            <p class="text-left">项目名称：{{dispatchNo.serviceName}}</p>
        </div>
    </div>
    <div class="title">
        <strong>派工记录</strong>
    </div>
    <div class="record-list" v-for="(item, index) in dispatchDetailHistoryInfoList" :key="index">
        <p class="mar-botm"><span>{{(index + 1) + ',' +(item.dispatchHistoryTypeName || '')}}</span><span class="ml-4" v-if="item.remark">备注：{{item.remark}}</span> <span class="ml-4">技师：{{item.empName}}</span><span class="ml-4">工位：{{item.stationName}}</span></p>
        <div class="flex mar-botm">
            <p class="text-left">派工开始时间：{{item.dispatchStartTime&&item.dispatchStartTime.substring(0,16)}}</p>
            <p class="text-left">实际开始时间：{{item.workStartTime&&item.workStartTime.substring(0,16)}}</p>
        </div>
        <div class="flex mar-botm">
            <p class="text-left">派工结束时间：{{item.dispatchEndTime&&item.dispatchEndTime.substring(0,16)}}</p>
            <p class="text-left">实际结束时间：{{item.workEndTime&&item.workEndTime.substring(0,16)}}</p>
        </div>
        <div class="flex">
            <p class="text-left">派工预计耗时：{{item.planWorkHours ?item.planWorkHours + 'm' :''}}</p>
            <p class="text-left">施工实际耗时：{{item.actualWorkHours ?item.actualWorkHours + 'm':''}}</p>
        </div>
    </div>
</div>
</template>
<script>
import api from 'common/api'
import common from 'common/common'
export default {
    props:{
        dispatchNo:{
            type:Object,
            default:function(){
                return {
                }
            }
        }
    },
    computed:{
        dispatchDetailInfoVo:function(){
            return (this.dispatchNo.dispatchOrderInfo) || {}
        },
        dispatchDetailHistoryInfoList:function(){
            return  this.dispatchNo.dispatchDetailHistoryInfoList || []
        },
        addValue:function(){
            return this.dispatchDetailInfoVo.addValue
        }
    },
    watch:{
        addValue:function(){
            this.setinFactoryTime(this.addValue)
        }
    },
    methods:{
        setinFactoryTime(addValue){
            api.currentTime({},(res)=>{
                this.currentTime = res.data
                this.inFactoryTime = this.timer(res.data , addValue)
                clearInterval(this.Timer)
                this.Timer.push(setInterval(()=>{
                    this.currentTime = new Date(new Date(this.currentTime).getTime() + 60000)
                    this.inFactoryTime = this.timer(this.currentTime , addValue)
                },60000))
            })
        },
        getStatus(colorType) {
            if(colorType == 0) {
            return 'block'
            }else if(colorType == 1) {
                return 'danger'
            }else if(colorType == 2) {
                return 'success'
            }else if(colorType == 3) {
                return 'warnning'
            }else{
                return 'block'
            }
        },
        timer(data,addValue){
            let inFactoryTime = common.getRemainderTime(addValue,data)
            if(inFactoryTime.year){
                return inFactoryTime.year + '年'
            }else if(inFactoryTime.month){
                return inFactoryTime.month + '月'
            }else if(inFactoryTime.day){
                return inFactoryTime.day + '天'
            }else if(inFactoryTime.hour){
                return (inFactoryTime.hour < 10 ? '0' + inFactoryTime.hour : inFactoryTime.hour) + ':' + (inFactoryTime.minute < 10 ? "0" + inFactoryTime.minute : inFactoryTime.minute)
            }else if(inFactoryTime.minute){
                return '00' + ':' + (inFactoryTime.minute < 10 ? "0" + inFactoryTime.minute : inFactoryTime.minute)
            }
        },
    },
    data() {
        return {
            list: [
            ],
            setInterTime:null,
            inFactoryTime:null,
            currentTime:null,
            Timer:[]
        }
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
.detail-info-box {
    z-index: 30;
    box-shadow: -3px 0 20px 0 #BFC7D2;
}
.detail-info-header {
    height: 100px;
    padding: 23px 20px;
    /* background-color: #D5303B; */
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
    border: 1px solid #D5303B;
    border-radius: 3px;
    margin-right: 10px;
    cursor: pointer;
}
.m-btn:hover {
    background-color: #D5303B;
    color: #fff;
}
.bg-fff-btn {
    color: #D5303B;
}
.bg-red-btn {
    color: #fff;
    background-color: #D5303B;
}

.project-info {
    height: 100px;
    background-color: #F6F6F6;
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

.custom-remark {
    height: 100px;
    background-color: #fff;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0;
    line-height: 20px;
    padding: 20px;
}

.title {
    height: 40px;
    border-top: 1px solid #EEEEEE;
    border-bottom: 1px solid #EEEEEE;
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
    border-bottom: 1px solid #EEEEEE;
}
 #app .give-car-info .btn.colorType{
    padding:1px 16px;
    border-color: #d63a3c;
    color:#d63a3c;
}
 #app .give-car-info .btn.active{
    border-color: #d63a3c;
    background-color: #d63a3c;
    color:#fff;
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


