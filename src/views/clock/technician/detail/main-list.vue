<template>
    <div class="animated fadeIn open-card-modal-style">
        <div class="row">
            <div class="col-md-12">
                <div class="bg-header" :class="[{'bg-header-bg-warning': dispatchOrderInfo.colorType == 3},{'bg-header-bg-success': dispatchOrderInfo.colorType == 2},{'bg-header-bg-danger': dispatchOrderInfo.colorType == 1},{'bg-header-bg-block': dispatchOrderInfo.colorType == 0},]" ref="header">
                    WIP: {{dispatchOrderInfo.orderNo}}
                    <div class="danger-btn pull-right" :class="[{'bg-header-bg-warning': dispatchOrderInfo.colorType == 3},{'bg-header-bg-success': dispatchOrderInfo.colorType == 2},{'bg-header-bg-danger': dispatchOrderInfo.colorType == 1},{'bg-header-bg-block': dispatchOrderInfo.colorType == 0},]">
                        {{dispatchOrderInfo.colorType == 3 ? '返工' : ''}}
                        {{dispatchOrderInfo.colorType == 2 ? '预约' : ''}}
                        {{dispatchOrderInfo.colorType == 1 ? '紧急' : ''}}
                        {{dispatchOrderInfo.colorType == 0 ? '普通' : ''}}
                    </div>
                </div>
            </div>
        </div>
        <div class="row info-box info-box-after-set">
            <div class="col-md-3 text-center border-col-cut-apart">
                车牌:{{dispatchOrderInfo.custPlates}}
            </div>
            <div class="col-md-3 text-center border-col-cut-apart">
                SA:{{dispatchOrderInfo.saName}}
            </div>
            <div class="col-md-3 text-center border-col-cut-apart">
                预定交车时间: {{dispatchOrderInfo.bookingClosingDate | timeFilter}}
            </div>
            <div class="col-md-3 text-center">
                已等待时间: {{ dispatchOrderInfo.waitTime | timeReturn }}
            </div>
        </div>
        <!-- <div v-if="isShowRequired" class="opencard-custom-required">
            <p>客户需求:</p>
            <p>{{ dispatchOrderInfo.remark }}</p>
        </div> -->
        <!-- <div class="table-scrollable ma-table">
            <table class="table b-table table-hover table-bordered clock-tab"> -->
        <div class="table-scrollable sign-staff-card">
            <b-table striped hover bordered show-empty :items="dispatchOrderInfoTab" :fields="fields">
                <!-- <thead>
                    <tr>
                         <th v-for="(item, index) in tableHead" :key="index">
                             {{item.name}}
                         </th>
                    </tr>                  
                </thead>
                <tbody v-for="(val, ind) in dispatchOrderInfoTab" :key="ind">
                    <tr @click="rowDetail(ind)">
                        <td v-for="(item, index) in tableHead" :key="index">
                            <span>{{val[item.code]}}</span>
                        </td>
                    </tr>
                    <tr v-show="showIndx == ind">
                        <td colspan="8">
                             <div class="clock-tab-box-l clearfix">
                                <span class="clock-tab-detial" v-for="(v, i) in tableCont" :key="i">
                                {{v.name}}:  {{val[v.code]}}
                                </span>                  
                            </div>
                            <div class="clock-tab-box-r text-center pt-3">
                                <span>
                                    <prg-btn :name="'开卡'" :typeName="'green'" :bgWidth='100' :params='val' @clickbtn="openCard" :disabled="false" v-if="showBtn(val) == 'workNotStart'"></prg-btn>
                                    <prg-btn :name="'关卡'" :typeName="'red'" :bgWidth='val.countDown' :params='val' @clickbtn="closeCard" :disabled="countDown!='100'" v-if="showBtn(val) == 'workStart'"></prg-btn>
                                </span>
                            </div>
                        </td>
                    </tr>
                </tbody> -->
                <template slot="serviceCode" slot-scope="data">
                    <a href="javascript:;" @click="showServiceDetail(data.item.serviceCode)">{{ data.item.serviceCode }}</a>
                </template>
                <template slot="planWorkHours" slot-scope="data">
                    {{ data.item.planWorkHours ? data.item.planWorkHours + 'm' : '' }}
                </template>
                <template slot="operation" slot-scope="data">
                    <div class="text-center">
                        <span>
                            <prg-btn :name="'开卡'" :typeName="'green'" :bgWidth='100' :params='data.item' @clickbtn="openCard" :disabled="false || canOperate" v-if="showBtn(data.item) == 'workNotStart'"></prg-btn>
                            <prg-btn :name="'关卡'" :typeName="'red'" :bgWidth='data.item.countDown' :params='data.item' @clickbtn="closeCard" :disabled="data.item.countDown =='100' ? false : true" v-if="showBtn(data.item) == 'workStart'"></prg-btn>
                            {{ showBtn(data.item) == 'workEnd' ? '已关卡' : '' }}
                        </span>
                    </div>
                </template>
                <template slot="empty">
                    暂无数据...
                </template>
            </b-table>
        </div>
        <b-modal id="modalPrevent"
                ref="mydeletemodalcard"
                :hide-footer="true"
                :hide-header="true">
                <div class="">
                    <div class="open-card-mysmall-warning"><span></span><span>{{ warnigTitle }}</span></div>
                    <div class="open-card-mysmall-button">
                        <button v-if="operateName == '开卡'" class="" @click="sureEvent">{{ operateName }}</button>
                        <button v-if="operateName == '关卡'" class="" @click="closeEvent">{{ operateName }}</button>
                        <button class="" @click="closeDeleteModel">返回</button>
                    </div>
                </div>
        </b-modal>
    </div>
</template>

<script>
import Vue from "vue"
import { Message } from "element-ui"
import prgBtn from 'components/progress-btn'
import api from 'common/api.js'
// Vue.use( Message)
    export default {
        components:{
            prgBtn
        },
        props: {
            dispatchOrderInfo: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            isShowRequired: {
                type: Boolean,
                default: false
            },
            isSetMainTime: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                operateName: '',
                warnigTitle: '',
                canOperate: true,
                operatParams: {},
                tableHead: [
                    {
                        name: '项目编码',
                        code: 'serviceCode'
                    },
                    {
                        name: '项目名称',
                        code: 'serviceName'
                    },
                    {
                        name: '派工开始时间',
                        code: 'dispatchStartTime'
                    },
                    {
                        name: '派工结束时间',
                        code: 'dispatchEndTime'
                    },
                    {
                        name: '计划耗时',
                        code: 'planWorkHours'
                    },
                    {
                        name: '施工开始时间',
                        code: 'workStartTime'
                    },
                    {
                        name: '施工结束时间',
                        code: 'workEndTime'
                    },
                    {
                        name: '派工工位',
                        code: 'stationName'
                    },
                ],
                tableCont: [
                    {
                        name: '项目编码',
                        code: 'serviceCode'
                    },
                    {
                        name: '项目名称',
                        code: 'serviceName'
                    },
                    {
                        name: '派工开始时间',
                        code: 'dispatchStartTime'
                    },
                    {
                        name: '派工结束时间',
                        code: 'dispatchEndTime'
                    },
                    {
                        name: '计划耗时',
                        code: 'planWorkHours'
                    },
                    {
                        name: '施工开始时间',
                        code: 'workStartTime'
                    },
                    {
                        name: '施工结束时间',
                        code: 'workEndTime'
                    },
                    {
                        name: '派工工位',
                        code: 'stationName'
                    },
                    {
                        name: '开卡时间',
                        code: 'workEndTime'
                    },
                    {
                        name: '关卡时间',
                        code: 'workStartTime'
                    },
                ],
                fields: {
                    serviceCode: {
                        label: '项目编码'
                    },
                    serviceName: {
                        label: '项目名称'
                    },
                    remark: {
                        label: '项目备注'
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
                    stationName: {
                        label: '派工工位'
                    },
                    operation: {
                        label: '操作'
                    }
                },
                columns: [],
                showIndx: -1,
                countDown: 0,
                setIndex:-1,
                setInter:'',
                dispatchOrderInfoTab: [],
                setTime: ''
            }
        },
        computed:{
        },
        created() {
            // this.checkCuntDown();
        },
        mounted() {
           
        },
        methods: {
            // 跳转服务详细信息
            showServiceDetail(arg) {
                this.$router.push({
                    path: `/serviceitem/show/${arg + 'show'}`
                })
            },
            // 模态框事件
            closeDeleteModel() {
                this.$refs.mydeletemodalcard.hide()
            },
            // 开卡事件
            sureEvent() {
                let param = {
                    id: this.operatParams.id
                }
                api.clock.openCard(param, (res) => {
                    if(res.data.code === 'success') {
                        Message({
                            type: "success",
                            message: "开卡成功!"
                        })
                        this.closeDeleteModel()
                        // debugger
                        this.$emit('updataDetail', res.data.obj)
                        this.setIndex = this.dispatchOrderInfoTab.indexOf(this.operatParams)
                        this.dispatchOrderInfoTab[this.setIndex].countDown = 0
                        this.dispatchOrderInfoTab[this.setIndex].dispatchDetailStatus = 2
                        this.counDowning()
                    };
                })  
            },
            // 关卡事件
            closeEvent() {
                let param = {
                    id: this.operatParams.id
                }
                api.clock.closeCard(param, (res) => {
                    if(res.data.code === 'success') {
                        Message({
                            type: "success",
                            message: "关卡成功!"
                        });
                        this.closeDeleteModel()
                        this.$emit('closeCardSuccess')
                        for(let i = 0; i < this.dispatchOrderInfoTab.length; i++) {
                            if(this.dispatchOrderInfoTab[i].id === this.operatParams.id) {
                                this.dispatchOrderInfoTab[i].dispatchDetailStatus = 3
                                this.dispatchOrderInfoTab[i].countDown = 0
                            }
                        }
                        this.dispatchOrderInfoTab = JSON.parse(JSON.stringify(this.dispatchOrderInfoTab));
                    };
                })  
            },
            getCountDown(index) {
                if(index == this.setIndex){
                    return this.countDown;
                }else{
                    return 100;
                }
            },
            // 开卡提醒
            openCard(val) {
                this.operatParams = val
                this.warnigTitle = '是否开始施工'
                this.operateName = '开卡'
                this.$refs.mydeletemodalcard.show()
                 
                
            },
            // 关卡提醒
            closeCard(val) {
                this.operatParams = val
                this.warnigTitle = '关卡为不可逆操作,确认关卡么？'
                this.operateName = '关卡'
                this.$refs.mydeletemodalcard.show()
            },
            checkCuntDown() {               
                if(!this.setIndex) {
                    return;
                }
                if(this.countDown < 100 && this.countDown > 0) {
                    this.counDowning()
                }else{
                    this.countDown = 0
                }
            },
            // 开卡后的计时器
            counDowning() {
                // this.countDown = 100
                // this.countDown = 0
                this.setInter =setInterval(() => {
                    this.countDown++
                    if(this.countDown > 100) {
                        this.countDown = 0
                        clearInterval(this.setInter)
                        return
                    }
                    if(this.dispatchOrderInfoTab.length > 0) {
                        this.dispatchOrderInfoTab[this.setIndex].countDown = this.countDown;
                        this.dispatchOrderInfoTab = JSON.parse(JSON.stringify(this.dispatchOrderInfoTab));                        
                    }                  
                }, 700);
            },
            // 判断按钮为开卡还是关卡    还是没有按钮
            showBtn(data) {
                if(data.dispatchDetailStatus == 3) {
                    return 'workEnd'
                }else if(data.dispatchDetailStatus == 2) {
                    return 'workStart'
                }else if(data.dispatchDetailStatus == 1) {
                    return 'workNotStart'
                }
            }
        },
        watch:{
            // 监听数据   并进行赋值操作
            dispatchOrderInfo(val) {
                  let arr = [];
                    if(this.dispatchOrderInfo.dispatchDetailInfoList &&this.dispatchOrderInfo.dispatchDetailInfoList.length != 0) {
                        this.nowTime = this.dispatchOrderInfo.sysData;
                        for(let [i, val] of this.dispatchOrderInfo.dispatchDetailInfoList.entries()) {
                            // if(val.workStartTime && !val.workEndTime) {
                            //     this.setIndex = i;
                            //     this.getTimeInterval(val.workStartTime, this.nowTime);
                            // }
                            // if(val.dispatchDetailStatus == 1) {
                            //     val.countDown = 0
                                // this.setIndex = i;
                            if(val.dispatchDetailStatus == 2){
                                val.countDown = 100
                            }else {
                                val.countDown = 0
                            }
                            arr.push(val);
                        }
                        this.dispatchOrderInfoTab = [...arr];
                    }else {
                        this.dispatchOrderInfoTab = [...arr]
                    }
            },
            dispatchOrderInfoTab: {
                handler: function() {
                    let num = 0
                    // let judgeCanOperate = true
                    this.dispatchOrderInfoTab.forEach(element => {
                        if(element.countDown - 0 > 0) {
                            num++
                        }
                    })
                    if(num == 0) {
                        this.canOperate = false
                    }else {
                        this.canOperate = true
                    }
                },
                deep: true
            },
            isSetMainTime: function(value) {
                if(this.isSetMainTime) {
                    this.setTime = setInterval(() => {
                        this.dispatchOrderInfo.waitTime += 60000
                    }, 60000)
                }else {
                    clearInterval(this.setTime)
                }
            }
        },
        filters: {
            timeFilter(val) {
                if(val) {
                    return val.substring(0, 16).replace(/-/g, '/');
                }
            },
            // 等待时间处理
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
<style>
    .open-card-modal-style .modal-dialog {
        margin: 200px auto !important;
    }
    .opencard-custom-required {
        background-color: #fff;
        padding: 15px;
    }
    .opencard-custom-required>p {
        padding: 0px;
        margin: 0px;
    }
    .open-card-mysmall-warning {
        width: 50%;
        text-align: center;
        margin: 0 auto;
        font-size: 22px;
        /* height: 30px; */
        line-height: 30px;
        padding-left: 30px;
        position: relative;
        margin-bottom: 20px;
    }
    .open-card-mysmall-warning>span:nth-child(1) {
         /* display: inline-block; */
         position: absolute;
         width: 30px;
         top: 0px;
         left: 0px;
         background-image: url(./../../../../../static/image/warning.png);
         background-position: center top;
         /* width: 30px; */
         height: 30px;
    }
    .open-card-mysmall-button {
        text-align: center;
    }
    .open-card-mysmall-button button {
        height: 36px;
        width: 20%;
        margin-right: 20px;
        background-color: #F2F3F5;
        border: none;
        border-radius: 5px;
        /* color: #48576A; */
        color: #fff;
        background-color: rgb(108, 108, 235);
    }
    .open-card-mysmall-button button:last-child {
        margin-right: 0px;
        background-color: rgb(185, 185, 204);
        color: #777;
    }
.info-box-after-set {
    position: relative;
}

.info-box-after-set>div::after {
    position: absolute;
    content: '';
    display: block;
    width: 1px;
    height: 80%;
    left: 0px;
    top: 50%;
    background-color: #ccc;
    transform: translate(0, -50%);
}
.info-box-after-set>div:first-child:after {
    width: 0px;
}
.bg-header {
    height: 50px;
    background: #D5303B;
    color: #fff;
    font-size: 20px;
    padding: 11px 40px;
}
.bg-header-bg-success {
    background-color: #37BB68 !important;
}
.bg-header-bg-danger {
    background-color: #D5303B !important;
}
.bg-header-bg-warning {
    background-color: #FFA43D !important;
}
.bg-header-bg-block {
    background-color: #333333 !important;
}
.sign-staff-card>.table-bordered>thead>tr>th {
    text-align: center;
    border: none;
    color: rgb(138, 136, 136);
    font-style: normal;
}
.sign-staff-card>.table-bordered>thead>tr>th:last-child {
    width: 100px !important;
}
.sign-staff-card>.table-bordered>tbody>tr>td:last-child {
    width: 100px !important;
}
.sign-staff-card>.table-bordered>tbody>tr>td {
    border: none;
    color: rgb(15, 17, 19);
    text-align: center;
    position: relative;
}
.sign-staff-card>.table-bordered>tbody>tr>td::after {
    position: absolute;
    content: '';
    display: block;
    left: 0px;
    top: 50%;
    transform: translate(0, -50%);
    width: 1px;
    height: 50%;
    background-color: #ccc;
}
.sign-staff-card>.table-bordered>tbody>tr>td:first-child::after {
    width: 0px;
}
.sign-staff-card>.table-bordered>tbody>tr>td:first-child>a {
    color: rgb(101, 101, 241);
}
.danger-btn {
    width: 100px;
    height: 28px;
    border: 2px solid #FFFFFF;
    border-radius: 2px;
    background-color: #D5303B;
    font-size: 16px;
    color: #FFFFFF;
    text-align: center;
}

.info-box {
    padding: 18px 0; 
    background: #fff; 
    margin: 0;
    margin-bottom: 10px;
}
.clock-tab td{
    white-space: nowrap;
}
.clock-tab-box-l{
    width: 80%;
    float: left;
}
.clock-tab-box-r{
    /* width: 20%; */
    float: left;
}
.clock-tab-detial{
    display: inline-block;
    box-sizing: border-box;
    width: 33%;
    padding: 5px 5px;
    float: left;
}
.btn-gray{
    background-color: #B2BEC6!important;
    border-color: #B2BEC6!important;
}

</style>
