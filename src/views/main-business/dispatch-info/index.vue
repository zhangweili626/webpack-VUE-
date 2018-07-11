<template>
    <div class="animated fadeIn">
        <div class="row">
            <div class="col-md-12">
                <div class="bg-header" :class="`${getStatus(dispatchOrderInfo.colorType)}`" ref="header">
                    WIP: {{dispatchOrderInfo.orderNo}}
                    <div class="danger-btn pull-right" :class="`${getStatus(dispatchOrderInfo.colorType)}`" v-if="dispatchOrderInfo.colorType == 0">普通</div>
                    <div class="danger-btn pull-right" :class="`${getStatus(dispatchOrderInfo.colorType)}`" v-else-if="dispatchOrderInfo.colorType == 3">返工</div>
                    <div class="danger-btn pull-right" :class="`${getStatus(dispatchOrderInfo.colorType)}`" v-else-if="dispatchOrderInfo.colorType == 2">预约</div>
                    <div class="danger-btn pull-right" :class="`${getStatus(dispatchOrderInfo.colorType)}`" v-else-if="dispatchOrderInfo.colorType == 1">紧急</div>
                    <div class="danger-btn pull-right" :class="`${getStatus(dispatchOrderInfo.colorType)}`" v-else>普通</div>
                </div>
            </div>
        </div>
        <div class="row info-box">
            <div class="col-md-3 text-center border-col-cut-apart">
                车牌: &nbsp;&nbsp;{{dispatchOrderInfo.custPlates}}
            </div>
            <div class="col-md-3 text-center border-col-cut-apart">
                SA: &nbsp;&nbsp;{{dispatchOrderInfo.saName}}
            </div>
            <div class="col-md-3 text-center border-col-cut-apart">
                预定交车时间: &nbsp;&nbsp;{{dispatchOrderInfo.bookingClosingDate}}
            </div>
            <div class="col-md-3 text-center">
                在厂时间: &nbsp;&nbsp; {{dispatchOrderInfo.waitTime}}
            </div>
        </div>
    <b-card>
        <div class="table-scrollable">
            <b-table striped hover bordered show-empty :items="dispatchOrderInfo.dispatchDetailInfoList" :fields="fields" ref="table">
                <template slot="select" slot-scope="data">
                    <input type="radio" :value="data.index" v-model="select" name="radio"/>
                </template>
                <template slot="defaultWorkHours" slot-scope="data">
                    {{data.item.defaultWorkHours ? data.item.defaultWorkHours + 'm': ""}}
                </template>
                <template slot="planWorkHours" slot-scope="data">
                    {{data.item.planWorkHours ? data.item.planWorkHours + 'm' : ""}}
                </template>
                <template slot="actualWorkHours" slot-scope="data">
                    {{data.item.actualWorkHours ? data.item.actualWorkHours + 'm': ""}}
                </template>
                <template slot="empCnName" slot-scope="data">{{data.item.dispatchEmpDetailInfoList.length > 0 ? data.item.dispatchEmpDetailInfoList[0].empName : ''}}</template>
                <template slot="dispatchDetailStatus" slot-scope="row">{{row.value | statusFilter}}</template>                
                <template slot="serviceCode" slot-scope="data">
                    <router-link :to="{
                        path: `/serviceitem/edit/${data.value}`
                    }">{{data.value}}</router-link>
                </template>
                <template slot="dispatchStartTime" slot-scope="row">{{row.value | timeFilter}}</template>
                <template slot="dispatchEndTime" slot-scope="row">{{row.value | timeFilter}}</template>
                <template slot="empty">
                    暂无数据...
                </template> 
            </b-table>
        </div>
         <div class="row mt-2">
            <div class="col-md-12">
                <button @click="showDetail" class="btn-succ pull-right"> 派工/调整 </button>
            </div> 
        </div>
    </b-card>
    </div>
</template>

<script>
    import api from 'common/api'
    import common from 'common/common'
    
    import { Message } from 'element-ui'
    export default {
        data() {
            return {
                dispatchOrderInfo: {},
                fields: {
                    select: {
                        label: '选择'
                    },
                    dispatchDetailStatus: {
                        label: '状态'
                    },
                    serviceCode: {
                        label: '项目编码'
                    },
                    serviceName: {
                        label: '项目名称'
                    },
                    remark:{
                        label: '项目备注'
                    },
                    defaultWorkHours: {
                        label: '默认耗时'
                    },
                    dispatchStartTime: {
                        label: '派工开始时间'
                    },
                    dispatchEndTime: {
                        label: '派工结束时间'
                    },
                    planWorkHours: {
                        label: '计划耗时'
                    },
                    workStartTime: {
                        label: '施工开始时间'
                    },
                    workEndTime: {
                        label: '施工结束时间'
                    },
                    actualWorkHours: {
                        label: '实际耗时'
                    },
                    empCnName: {
                        label: '施工技师'
                    },
                    stationName: {
                        label: '施工工位'
                    },
                },
                select: -1,
                Timer:[]
            }
        },
        mounted() {
            this.getInfoByCode(this.$route.query.dispatchNo, () => {
                this.changeStyle()
            })
            
        },
        beforeDestory() {
            for (let index = 0; index < this.Timer.length; index++) {
                const element = this.Timer[index];
                clearInterval(element)
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
            showDetail() {
                if(this.select === -1) {
                    Message({
                        type: 'warning',
                        message: "请选择一条数据"
                    })
                    return 
                }
                this.$router.push({
                    path: '/resource-utilization/dispatching',
                    query: {
                        dispatchNo: this.dispatchOrderInfo.dispatchDetailInfoList[this.select].dispatchNo,
                        dispatchDetailCode: this.dispatchOrderInfo.dispatchDetailInfoList[this.select].dispatchDetailCode,
                        index: this.select
                    }
                })
            },
            getInfoByCode(_dispatchNo, next) {
                let params = {
                    dispatchNo: _dispatchNo
                }
                api.mainBusiness.getInfoByCode(params,res => {
                    if(res.data.code === 'success') {
                        this.dispatchOrderInfo = res.data.obj
                        console.log(this.dispatchOrderInfo);
                        api.currentTime({},(res)=>{
                            this.currentTime = res.data
                            this.$set(this.dispatchOrderInfo,'waitTime',this.timer(this.currentTime,this.dispatchOrderInfo.addValue))
                            this.Timer.push(setInterval(()=>{
                                this.$set(this.dispatchOrderInfo,'waitTime',this.timer(this.currentTime,this.dispatchOrderInfo.addValue))
                            },60000))
                        })
                        next()
                    }
                })
            },
            changeStyle() {
                this.$refs.table.$el.childNodes[2].childNodes[0].style.background = '#F6F6F6';
                let thlist = this.$refs.table.$el.childNodes[2].childNodes[0].childNodes
                for(let i = 0; i < thlist.length; i ++) {
                    this.$refs.table.$el.childNodes[2].childNodes[0].childNodes[i].style.border = 'none'
                    this.$refs.table.$el.childNodes[2].childNodes[0].childNodes[i].style.color = '#7a7a7a'
                }
            },
            // getWaitTime(item) {
            //     let currentTime = item.sysDate,
            //         time = new Date(currentTime).getTime() - item.createTime,
            //         hourTime =  1000 * 60 * 60,
            //         dayTime = 1000 * 60 * 60 * 24, 
            //         _hour = time / hourTime > 100 ? time / hourTime : `0${time / hourTime}`,
            //         minute = Math.round(time % hourTime * 60),
            //         _minute = minute > 10 ? minute : `0${minute}`

            //     if(time / (dayTime * 365) >= 1) {
            //         return `${parseInt(time / (dayTime * 365))} 年`
            //     }else if(time / (dayTime * 31) >= 1) {
            //         return `${parseInt(time / (dayTime * 31))} 月`
            //     }else if(time / dayTime >= 1) {
            //         return `${parseInt(time / dayTime)} 天`
            //     }else if(time / hourTime >= 1) {
            //         return `${parseInt(_hour)}:${_minute}`
            //     }else {
            //         return `000:${_minute}`
            //     }
            // }
        },
        filters: {
            timeFilter(val) {
                if(val) {
                    return val.substring(0, 16).replace(/-/g, '/')
                }
            },
            statusFilter(val) {
                if(val == 0) {
                    return '未派工'
                }else if(val == 1) {
                    return '未开卡'
                }else if(val == 2) {
                    return '施工中'
                }else if(val == 3) {
                    return '已关卡'
                }
            }
        }
    }
</script>
<style scoped>
.bg-header {
    height: 50px;
    background: #fff;
    color: #fff;
    font-size: 20px;
    padding: 11px 40px;
}
.bg-black{
    background-color: #1f2d3d;
}
.danger-btn {
    width: 100px;
    height: 28px;
    border: 2px solid #FFFFFF;
    border-radius: 2px;
    font-size: 16px;
    color: #FFFFFF;
    text-align: center;
}

.info-box {
    padding: 18px 0; 
    background: #fff; 
    margin: 0;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 600;
}
.border-col-cut-apart {
    border-right: 2px solid #D1D2D4;
}
.btn-succ {
    width: 120px;
    height: 30px;
    background: #5FB870;
    border: 1px solid #979797;
    border-radius: 2px;
    font-family: PingFangSC-Semibold;
    color: #FFFFFF;
    font-size: 16px;
    line-height: 16px;
    text-align: center;
    vertical-align: middle;
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
