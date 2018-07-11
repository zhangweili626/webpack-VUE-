<template>
<div class="row">
    <div class="col-md-12">
        <b-card class="mb-3 my-tab">
            <b-tabs pills>
                <b-tab title="当天车" active>
                    <div :style="{width: toDaylistWidth + 'px'}">
                       <car-info-list :list="toDayList" @handleIconClick="handleIconToDay" @itemClick="itemClick"></car-info-list>
                    </div>
                </b-tab>
                <b-tab title="非当天车">
                    <div :style="{width: notToDaylistWidth + 'px'}">
                       <car-info-list :list="notToDayList" @handleIconClick="handleIconNotToDay" @itemClick="itemClick"></car-info-list>
                    </div>                    
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</div>
</template>
<script>
import CarInfoList from './car-info-list'
import api from 'common/api'
import common from 'common/common'
export default {
    components: {
        CarInfoList,
    },
    data() {
        return {
            toDayList: [],
            notToDayList: [], 
            t: null,
            currentTime:null,
            Timer:[],
        }
    },
    computed: {
        toDaylistWidth() {
            return (this.toDayList.length || 1) * 180
        },
        notToDaylistWidth() {
            return (this.notToDayList.length || 1) * 180
        },
        storeInfoVo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            return userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
        } 
    },
    mounted() {
        if(this.storeInfoVo) {
            this.handleIconToDay()
            this.handleIconNotToDay()
            // this.queryCarList({
            //     storeCode: this.storeInfoVo.storeCode,
            //     isToDay: true ,   // 区分当天车和非当天车
            //     orderStatus:1,// 区分当天车和非当天车
            // }, list => {
            //     this.toDayList = []
            //     list.forEach(item => {
            //         let data = {
            //             code: item.orderNo,
            //             carId: item.custPlates,
            //             name: '约定交车',
            //             overTime: item.bookingClosingDate,    
            //             waitTime: "",
            //             bg: this.getStatus(item.colorType),
            //             dispatchNo: item.dispatchNo,
            //             addValue:item.addValue
            //         }
            //         this.toDayList.push(data)
            //     })
            //     api.currentTime({},(res)=>{
            //         this.currentTime = res.data
            //         this.Timer.push(setInterval(()=>{
            //             for (let index = 0; index < this.toDayList.length; index++) {
            //                 this.currentTime = new Date(new Date(this.currentTime).getTime() + 60000)
            //                 this.$set(this.toDayList[index],'waitTime',this.timer(this.currentTime))
            //             }
            //         },60000))
            //     })
            // })
            // this.queryCarList({
            //     storeCode: this.storeInfoVo.storeCode,
            //     isToDay: false,    // 区分当天车和非当天车
            //     orderStatus:2,// 区分当天车和非当天车
            // }, list => {
            //     this.notToDayList = []
            //     list.forEach(item => {
            //         let data = {
            //             code: item.orderNo,
            //             carId: item.custPlates,
            //             name: '约定交车',
            //             overTime: item.bookingClosingDate,   
            //             waitTime: "",
            //             bg: this.getStatus(item.colorType),
            //             dispatchNo: item.dispatchNo,
            //             addValue:item.addValue
            //         }
            //         this.notToDayList.push(data)
            //     })
            //     api.currentTime({},(res)=>{
            //         this.currentTime = res.data
            //         for (let index = 0; index < this.toDayList.length; index++) {
            //             this.$set(this.toDayList[index],'waitTime',this.timer(this.currentTime))
            //         }
            //         this.Timer.push(setInterval(()=>{
            //             for (let index = 0; index < this.notToDayList.length; index++) {
            //                 this.currentTime = new Date(new Date(this.currentTime).getTime() + 60000)
            //                 this.$set(this.notToDayList[index],'waitTime',this.timer(this.currentTime))
            //             }
            //         },60000))
            //     })
            // })            
        }

    },
    methods: {
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
        handleIconNotToDay(value){
            const _this = this;
            this.queryCarList({
                storeCode: this.storeInfoVo.storeCode,
                isToDay: false ,   // 区分当天车和非当天车
                orderStatus:2,// 区分当天车和非当天车
                custPlates:value
            }, list => {
                this.notToDayList = []
                list.forEach(item => {
                    let data = {
                        code: item.orderNo,
                        carId: item.custPlates,
                        name: '约定交车',
                        overTime: item.bookingClosingDate,   
                        waitTime: "",
                        bg: this.getStatus(item.colorType),
                        dispatchNo: item.dispatchNo,
                        addValue:item.addValue
                    }
                    this.notToDayList.push(data)
                })
                for (let index = 0; index < this.Timer.length; index++) {
                    const element = this.Timer[index];
                    clearInterval(element)
                }
                api.currentTime({},(res)=>{
                    this.currentTime = res.data
                    for (let index = 0; index < this.notToDayList.length; index++) {
                        this.$set(this.notToDayList[index],'waitTime',this.timer(this.currentTime,this.notToDayList[index].addValue))
                    }
                    this.Timer.push(setInterval(()=>{
                        for (let index = 0; index < this.notToDayList.length; index++) {
                            this.currentTime = new Date(new Date(this.currentTime).getTime() + 60000)
                            this.$set(this.notToDayList[index],'waitTime',this.timer(this.currentTime,this.notToDayList[index].addValue))
                        }
                    },60000))
                })
            })
        },
        handleIconToDay(value){
            const _this = this;
            this.queryCarList({
                storeCode: this.storeInfoVo.storeCode,
                isToDay: true,    // 区分当天车和非当天车
                orderStatus:1,// 区分当天车和非当天车
                custPlates:value
            }, list => {
                this.toDayList = []
                list.forEach(item => {
                    let data = {
                        code: item.orderNo,
                        carId: item.custPlates,
                        name: '约定交车',
                        overTime: item.bookingClosingDate,    
                        waitTime: "",
                        bg: this.getStatus(item.colorType),
                        dispatchNo: item.dispatchNo,
                        addValue:item.addValue
                    }
                    this.toDayList.push(data)
                })
                for (let index = 0; index < this.Timer.length; index++) {
                    const element = this.Timer[index];
                    clearInterval(element)
                }
                api.currentTime({},(res)=>{
                    this.currentTime = res.data
                    for (let index = 0; index < this.toDayList.length; index++) {
                        this.$set(this.toDayList[index],'waitTime',this.timer(this.currentTime,this.toDayList[index].addValue))
                    }
                    this.Timer.push(setInterval(()=>{
                        for (let index = 0; index < this.toDayList.length; index++) {
                            this.currentTime = new Date(new Date(this.currentTime).getTime() + 60000)
                            this.$set(this.toDayList[index],'waitTime',this.timer(this.currentTime,this.toDayList[index].addValue))
                        }
                    },60000))
                })
            })
            
        },
        itemClick(item) {
            this.$router.push({
                query: {
                    dispatchNo: item.dispatchNo
                },
                path: '/resource-utilization/query'
            })
        },
        queryCarList(params, next) {
            api.mainBusiness.queryCar(params).then(res => {
                if(res.data.code === 'success') {
                    let obj = res.data.obj
                    next(obj)
                }
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
    },
    beforeDestory() {
        for (let index = 0; index < this.Timer.length; index++) {
            const element = this.Timer[index];
            clearInterval(element)
        }
    }
}
</script>
<style >
.my-tab .nav-item {
    width: 146px;
    text-align: center;
    background-color: #fff;

    border-bottom: 1px solid #c2cfd6;
}
.my-tab .nav-item a {
    color: #333 !important;
    text-decoration: none !important;
}

.my-tab .nav-pills .nav-link.active {
    background-color: #fff;
    border-bottom: 2px solid  #ED6F64 !important;    
}

.tab-content .tab-pane {
    overflow-x: auto;
}
</style>



