<template>
    <div class="card-select-modal">
        <b-modal id="modalPrevent"
                @hide="hideBack"
                @show="showBack"
                ref="cardModal"
                title="计次卡"
                size="lg"
                :hide-footer="true">
                <div class="row card-select-modal-search">
                    <div class="col-md-4 col-lg-4">
                        <b-form-input placeholder="输入卡号" v-model="searchValue"/>
                    </div>
                    <!-- <div class="col-md-2 col-lg-2">
                        <div class="pull-left">
                            <b-button size="sm" variant="primary" @click="search">确定</b-button>
                        </div>
                    </div> -->
                </div>
                <div class="row card-select-layout">
                    <div class="col-md-4 col-lg-4 card-select-list">
                        <div class="card-header-title">
                            卡信息
                        </div>
                        <ul>
                            <li v-for="(item, index) in mainlist" :key="index">
                                <a href="javascript:;" @click="showThisCardDetail(item)">{{ item.cardName + '【' + item.cardNo + '】' }}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="col-md-8 col-lg-8">
                        <div class="row">
                            <div class="col-md-8 col-lg-8">
                                <div class="card-select-right-detail">
                                    卡信息: {{ saleCard.cardName ? saleCard.cardName + '【' + saleCard.cardNo + '】' : ''}}
                                </div>
                                <div class="card-select-right-detail">
                                    有效截止日期: {{ saleCard.endDate }}
                                </div>
                            </div>
                            <div class="col-md-4 col-lg-4">
                                <div class="card-select-right-detail">
                                    当前日期: {{ saleCard.currentDay }}
                                </div>
                                <div class="card-select-right-detail">
                                    距离到期还剩: {{ saleCard.availableDays }} 天
                                </div>
                            </div>
                        </div>
                        <div class="card-select-right-detail-container">
                            <div class="table-scrollable card-select-right-detail-table" v-if="!isShowChoose">
                                <b-table striped hover bordered show-empty :items="detaillist" :fields="fields">
                                    <!-- <template slot="index" slot-scope="data">
                                        <input type="radio" :disabled="true" name="currentChoose"/>
                                    </template> -->
                                    <template slot="used" slot-scope="data">
                                        {{ (data.item.detailNums - data.item.availableNums) > data.item.detailNums ? data.item.detailNums : (data.item.detailNums - data.item.availableNums) }}
                                    </template>
                                    <template slot="detailName" slot-scope="data">
                                        {{ data.item.detailName + '【' + data.item.detailCode + '】' }}
                                    </template>
                                    <template slot="availableNums" slot-scope="data">
                                        {{ (data.item.availableNums-0) >= 0 ? data.item.availableNums : 0}}
                                    </template>
                                    <template slot="empty">
                                        暂无数据...
                                    </template>
                                </b-table>
                            </div>
                            <div class="table-scrollable card-select-right-detail-table" v-if="isShowChoose">
                                <b-table striped hover bordered show-empty :items="detaillist" :fields="fieldsChoose">
                                    <template slot="index" slot-scope="data">
                                        <input type="checkbox" :disabled="data.item.disabled" name="currentChoose" :value="data.item" v-model="currentChoose"/>
                                    </template>
                                    <template slot="detailName" slot-scope="data">
                                        {{ data.item.detailName + '【' + data.item.detailCode + '】' }}
                                    </template>
                                    <template slot="used" slot-scope="data">
                                        {{ (data.item.detailNums - data.item.availableNums) > data.item.detailNums ? data.item.detailNums : (data.item.detailNums - data.item.availableNums) }}
                                    </template>
                                    <template slot="availableNums" slot-scope="data">
                                        {{ (data.item.availableNums-0) >= 0 ? data.item.availableNums : 0}}
                                    </template>
                                    <template slot="empty">
                                        暂无数据...
                                    </template>
                                </b-table>
                            </div>
                        </div>
                    </div>
                    <div class="card-select-right-detail-button" v-if="isShowChoose" @click="useNow">
                        立即使用
                    </div>
                </div>
        </b-modal>
    </div>
</template>
<script>
    import api from 'common/api'
    import { Message, MessageBox } from 'element-ui'
    export default {
        props: {
            //是否显示选择框
            isShowChoose: {
                type: Boolean,
                default: true
            },
            // 接收的主信息
            acceptObj: {
                type: Object,
                default: function() {
                    return {}
                },
            },
            orderNo: {
                type: String,
                default: ''
            },
            serviceOrderNo: {
                type: String,
                default: ''
            },
            skuOrderNo: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                mainlist: [],
                detaillist: [],
                saleCard: {},
                currentChoose: [],
                searchValue: '',
                fields: {
                    // index: {
                    //     label: '选择'
                    // },
                    detailName: {
                        label: '商品/服务名称'
                    },
                    detailNums: {
                        label: '总次数'
                    },
                    used: {
                        label: '已使用'
                    },
                    availableNums: {
                        label: '剩余'
                    }
                },
                fieldsChoose: {
                    index: {
                        label: '选择'
                    },
                    detailName: {
                        label: '商品/服务名称'
                    },
                    detailNums: {
                        label: '总次数'
                    },
                    used: {
                        label: '已使用'
                    },
                    availableNums: {
                        label: '剩余'
                    }
                }
            }
        },
        methods: {
            search() {
                let option = {
                    cardNo: this.searchValue,
                    storeCode: this.acceptObj.storeCode,
                    customCode: this.acceptObj.customCode,
                    vehicleCode: this.acceptObj.vehicleCode,
                    // detailCodes: this.acceptObj.detailCodes
                }
                // if(!this.searchValue) {
                //     Message({
                //         type: 'warning',
                //         message: '请输入卡号'
                //     })
                //     return
                // }
                this.detaillist = []
                this.mainlist = []
                this.saleCard = {}
                api.cardManage.queryusableCardInfos(option, res => {
                    if(res.data.code === 'success') {
                        if(!res.data.obj) {
                            this.saleCard = {}
                            return
                        }
                        this.mainlist = res.data.obj
                        if(this.mainlist.length > 0) {
                            let option = {
                                cardNo: this.mainlist[0].cardNo,
                            }
                            api.cardManage.getCardDetail(option, res => {
                                if(res.data.code === 'success') {
                                    this.detaillist = res.data.obj.cardDetailInfoVos
                                    this.saleCard = res.data.obj.cardSalesOrderInfoVo
                                    this.saleCard.currentDay = res.data.obj.currentDay
                                    this.saleCard.availableDays = res.data.obj.availableDays
                                    if(this.isShowChoose) {
                                        let params = {
                                            cardNo: res.data.obj.cardNo,
                                            // cardNo: 'wzh-test-card-001',
                                            custCode: this.acceptObj.customCode
                                            // custCode: 'CUSTOM2004669'
                                        }
                                        api.cardManage.queryOrderServiceCardLockNum(params, res => {
                                            if(res.data.code === 'success') {
                                                let judgeObj = res.data.obj
                                                this.detaillist.forEach(element => {
                                                    element.availableNums = element.availableNums - (judgeObj[element.detailCode] ? judgeObj[element.detailCode] : 0)
                                                })
                                                this.detaillist.forEach(element => {
                                                    if(element.availableNums > 0) {
                                                        element.disabled = false
                                                    }else {
                                                        element.disabled = true
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        }
                        
                    }
                })
            },
            reset() {
                this.detaillist = []
                this.mainlist = []
                this.saleCard = {}
                this.currentChoose = []
                this.searchValue = ''
            },
            modalShow() {
                this.reset()
                this.$refs.cardModal.show()
                this.getFirstData();
            },
            modalHide() {
                this.$refs.cardModal.hide()
            },
            showThisCardDetail(value) {
                this.currentChoose = [];
                let option = {
                    cardNo: value.cardNo
                }
                api.cardManage.getCardDetail(option, res => {
                    if(res.data.code === 'success') {
                        this.detaillist = res.data.obj.cardDetailInfoVos
                        this.saleCard = res.data.obj.cardSalesOrderInfoVo
                        this.saleCard.currentDay = res.data.obj.currentDay
                        this.saleCard.availableDays = res.data.obj.availableDays
                        let params = {
                            cardNo: res.data.obj.cardNo,
                            // cardNo: 'wzh-test-card-001',
                            custCode: this.acceptObj.customCode
                            // custCode: 'CUSTOM2004669'
                        }
                        api.cardManage.queryOrderServiceCardLockNum(params, res => {
                            if(res.data.code === 'success') {
                                let judgeObj = res.data.obj
                                this.detaillist.forEach(element => {
                                    element.availableNums = element.availableNums - (judgeObj[element.detailCode] ? judgeObj[element.detailCode] : 0)
                                })
                                this.detaillist.forEach(element => {
                                   if(element.availableNums > 0) {
                                        element.disabled = false
                                    }else {
                                        element.disabled = true
                                    }   
                                })
                                this.detaillist = JSON.parse(JSON.stringify(this.detaillist))
                            }
                        })
                    }
                })
            },
            useNow() {
                if(this.currentChoose.length == 0) {
                    Message({
                        type: 'warning',
                        message: '请选择商品或服务'
                    })
                    return
                }
                let skuInfoList = [];
                let serviceInfoList = [];
                this.currentChoose.forEach((item) => {
                    if(item.detailType == 0) {
                        let obj = {
                            cardNo: item.cardNo,
                            orderNo: this.orderNo,
                            skuOrderNo: this.skuOrderNo,
                            skuCode: item.detailCode,
                            cardCouponDetailCode: item.cardDetailCode,
                        }
                        skuInfoList.push(obj);
                    }else if(item.detailType == 1) {
                        let obj = {
                            cardNo: item.cardNo,
                            orderNo: this.orderNo,
                            serviceOrderNo: this.serviceOrderNo,
                            serviceCode: item.detailCode,
                            cardCouponDetailCode: item.cardDetailCode,
                        }
                        serviceInfoList.push(obj);
                    }
                })
                let param = {
                    orderServiceDetailInfos: serviceInfoList,
                    orderSkuDetailInfos: skuInfoList,
                }
                api.repairOrder.insertOrUpdateOrderInfo(param, res => {
                    if (res.data.code === "success") {
                        Message({
                            message: '保存成功!',
                            type: 'success'
                        });
                        this.$emit('use')
                        this.modalHide()            
                    }
                })
               
            },
            getFirstData() {
                let option = {
                    storeCode: this.acceptObj.storeCode,
                    customCode: this.acceptObj.customCode,
                    vehicleCode: this.acceptObj.vehicleCode,
                    // s
                }
                // let option = {
                //     storeCode: 'STORE2000905',
                //     customCode: 'CUSTOM2004669',
                //     vehicleCode: '',
                //     detailCodes: []
                // }
                api.cardManage.queryusableCardInfos(option, res => {
                    if(res.data.code === 'success') {
                        this.mainlist = res.data.obj
                        if(this.mainlist.length === 0) {
                            return
                        }else {
                            this.showThisCardDetail(this.mainlist[0])
                        }
                    }
                })
            },
            hideBack() {
               this.$emit('visibleChange', false);
            },
            showBack() {
               this.$emit('visibleChange', true);
            }
        },
        watch: {
            searchValue: function(value) {
                if(!value) {
                    this.getFirstData()
                }else {
                    this.search()
                }
            }
        }   
    }
</script>
<style>
    .card-select-modal .modal-body {
        padding-top: 0px;
    }
    .card-select-modal-search {
        margin-bottom: 10px;
    }
    .card-select-right-detail-button {
        position: absolute;
        right: 5%;
        bottom: 5px;
        height: 34px;
        line-height: 34px;
        padding: 0 20px;
        font-size: 14px;
        text-align: center;
        border-radius: 5px;
        border: 1px solid #ccc;
        margin: 0 auto;
        cursor: pointer;
    }
    .card-select-right-detail-container {
        margin-top: 20px;
    }
    .card-select-right-detail-table {
        max-height: 240px !important;
        overflow-y: auto !important;
    }
    /* .card-select-right-detail-container table th {
        text-align: center;
    }
    .card-select-right-detail-container table td {
        text-align: center;
    } */
    .card-select-right-detail-title {
        font-size: 0px;
        background-color: rgb(74, 118, 199);
    }
    .card-select-right-detail-title>span {
        display: inline-block;
        box-sizing: border-box;
        width: 20%;
        height: 30px;
        line-height: 30px;
        font-size: 15px;
        text-align: center;
        letter-spacing: none;
        color: #fff;
        border-left: 1px solid #fff;
    }
    .card-select-right-detail-title>span:first-child {
        width: 40%;
    }
    .card-select-right-detail {
        height: 30px;
        line-height: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .card-select-layout {
        padding-bottom: 40px;
        position: relative;
    }
    .card-select-modal header {
        border-bottom: none;
    }
    .card-select-modal header h5 {
        padding-bottom: 5px;
        border-bottom: 2px solid rgb(228, 96, 96);
    }
    .card-header-title {
        background-color: rgb(74, 118, 199);
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        text-align: center;
        color: #fff;
    }
    .card-select-list ul {
        padding: 0;
        margin: 0;
        max-height: 330px;
        overflow: auto;
    }
    .card-select-list ul li {
        list-style: none;
        text-align: left;
        height: 30px;
        line-height: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .card-select-list ul li a {
        color: #999 !important;
    }
</style>


