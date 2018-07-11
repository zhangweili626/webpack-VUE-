<template>
    <div class="clearfix car-info-content" :style="{width: getContainerWidth + 'px'}">
    <!-- <div class="clearfix car-info-content"> -->
        <div class="car-info-box-card card-info-box-radius pull-left" v-for="(item, index) in list" :key="index" :class="{'active-item-default': activelist[index] ? activelist[index].active : ''}" @click="itemClick(item, index)">
            <div class="car-info-header-special card-info-padding">{{item.orderNo}}</div>
            <div class="car-id-special">
                <!-- <img :src="item."> -->
                <i class="iconfont icon-baoshijie ml-2" style="font-size:15px;vertical-align : middle;"></i>
                <strong>{{item.custPlates}}</strong>
            </div>
            <div class="car-info-con-card card-info-con-submit card-info-padding">
                <p :class="[{'success-color': item.colorType == 2}, {'danger-color' : item.colorType == 1}, {'warnning-color' : item.colorType == 3}, {'block-color' : item.colorType == 0}]">约定交车</p>
                <p :class="[{'success': item.colorType == 2}, {'danger' : item.colorType == 1}, {'warnning' : item.colorType == 3}, {'block' : item.colorType == 0}, {'block-font-color': item.colorType == 0}]">{{item.bookingClosingDate}}</p>
            </div>
            <div class="car-info-wait-special card-info-padding">
                <p><span>已等待</span>&nbsp;&nbsp;<span>{{ item.waitTime | timeReturn }}</span></p>
                <!-- <p class="wait-time">{{item.waitTime}}</p> -->
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
// import {Input} from 'element-ui'
// Vue.use(Input)
import api from 'common/api.js'
export default {
    props: {
        list: [Array],
        isShowSearch: {
            type: Boolean,
            default: true
        },
        isSetTime: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            input:null,
            activelist: [],
            // currentTime: null
            timeSet: '',
            timeNum: 0
        }
    },
    computed: {
        getContainerWidth() {
            return this.list.length * 160
        }
    },
    created() {
        
    },
    methods: {
        // 选中某一项  发布方法
        itemClick(item, index) {
            for(let i = 0; i<this.list.length; i++) {
                this.activelist[i].active = false
            }
            this.activelist[index].active = true
            this.$emit('itemClick', item)
        },
        handleIconClick(){
            const _this = this
            if(_this.input){
                _this.$emit('handleIconClick',_this.input)
            }
        }
    },
    watch: {
        // 监听数据   设置默认选择项
        list: function(value){
            this.activelist = []
            for(let i = 0; i < this.list.length; i++) {
                let obj = {};
                obj.active = false;
                this.activelist.push(obj);
            }
            this.activelist[0].active = true
        },
        // 监听是否   如果当 isSetTime为true时   设置定时器
        isSetTime: function(value) {
            if(this.isSetTime) {
                this.timeSet = setInterval(() => {
                    // this.timeNum+=60000
                    this.list.forEach(element => {
                        element.waitTime+=60000  
                    })
                    // this.list = JSON.parse(JSON.stringify(this.list))
                }, 60000)
            }else {
                clearInterval(this.timeSet)
            }
        }
    },
    filters: {
        // 时间转换
        timeReturn: function(value) {
            if(!value) {
                return
            }else {
                let nowSecond = value/1000
                let nowMinite = Math.floor(nowSecond/60)
                let nowHour = Math.floor(nowMinite/60)
                let shengMinite = nowMinite%60
                let returnHour = nowHour < 10 ? '0' + nowHour : nowHour
                let returnMinite = shengMinite < 10 ? '0' + shengMinite : shengMinite
                let returnDay = Math.floor(returnHour/24)
                let returnMonth = Math.floor(returnDay/31)
                let returnYear = Math.floor(returnMonth/12)
                if(returnYear) {
                    return returnYear + '年'
                }else if(returnMonth) {
                    return returnMonth + '月'
                }else if(returnDay) {
                    return returnDay + '天'
                }else {
                    return returnHour + ':' + returnMinite
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.active-item-default {
    border: 1px solid rgb(121, 145, 241) !important;
}
.success {
    background-color: #37BB68;
}
.danger {
    background-color: #D5303B;
}
.warnning {
    background-color: #FFA43D;
}
.block {
    background-color: #333333;
    // color: #fff;
}
.block-font-color {
    color: #fff !important;
}
.success-color {
    color: #37BB68;
}
.danger-color {
    color: #D5303B;
}
.warnning-color {
    color: #FFA43D;
}
.block-color {
    color: #333333;
}
.car-info-content {
    // width: 150000px;
    // width: auto;
    // min-width: 1000px;
    // height: auto;
    max-width: auto;
}
.card-info-box-radius {
    border-radius: 5px;
}
.card-info-padding {
    padding: 6px 8px !important;
}
.card-info-con-submit p:last-child {
    border-radius: 13px;
    text-align: center;
    color: #fff;
    height: 26px;
    line-height: 26px;
    margin-bottom: 5px;
    // padding-top: 5px;
    // padding-bottom: 5px;
}
.card-info-con-submit p:first-child {
    padding-top: 5px;
    padding-bottom: 5px;
}
.car-info-box-card {
    margin-right: 9px;
    min-width: 120px;  
    // height: 158px;
    border: 1px solid #F2F2F2;
    cursor: pointer;
}
.car-info-header-special {
    // color: #fff;
    padding-left: 8px;
    font-size: 14px;
    // text-align: center;
}
.car-info-wait-special {
    font-size: 12px;
    padding: 3px 0 6px 8px;
    border-top: 1px solid #F2F2F2;
}
.car-info-wait-special p span:first-child {
    color: #dddada;
}
.car-info-wait-special p span:last-child {
    text-align: right;
}
.car-info-wait-special p {
    display: flex
}
.car-info-wait-special p span {
    flex: 1
}
.car-id-special {
    font-size: 14px;
    color: #333333;
    padding:0px 8px;
    // border-bottom: 1px solid #F2F2F2;
}
.car-id-special strong {
    color: #dad4d4;
}
.car-info-con-card {
    font-size: 12px;
    color: #333333;
    padding: 6px 0 6px 8px;
    // border-bottom: 1px solid #F2F2F2;
}
p {
    padding: 0;
    margin: 0; 
}
.car-info-wait {
    
}
.wait-time {
    color: #B54F48;
}
</style>