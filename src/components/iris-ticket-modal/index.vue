<template>
    <div class="ticket-select-modal">
        <b-modal id="modalPrevent"
                ref="ticketModal"
                title="券信息"
                size="lg"
                :hide-footer="true">
                <div class="row card-select-modal-search">
                    <div class="col-md-4 col-lg-4">
                        <b-form-input placeholder="请输入券号" v-model="searchValue"/>
                    </div>
                    <!-- <div class="col-md-2 col-lg-2">
                        <div class="pull-left">
                            <b-button size="sm" variant="primary" @click="search">确定</b-button>
                        </div>
                    </div> -->
                </div>
                <div class="ticket-select-layout">
                    <div class="table-scrollable" v-if="isShowChoose">
                        <b-table striped hover bordered show-empty :items="mainlist" :fields="fields">
                            <template slot="index" slot-scope="row">
                                <div>
                                    <input type="radio" name="selected" :value="row.item" v-model="selectObj"/>
                                </div>
                            </template>
                            <template slot="show_details" slot-scope="row">
                                <a @click.stop="queryDetailList(row)">{{ row.item.couponNo }}</a> 
                            </template>
                            <template slot="row-details" slot-scope="row">
                                <div class="tableIntable">
                                    <b-table show-empty :items="row.item.detailList" :fields="fields_detail">
                                        <template slot="index" slot-scope="data">
                                            {{ data.index + 1 }}
                                        </template>
                                        <template slot="empty">
                                            暂无数据...
                                        </template>
                                    </b-table>
                                </div> 
                            </template>
                            <template slot="empty">
                                暂无数据...
                            </template>
                        </b-table>
                    </div>
                    <div class="table-scrollable" v-if="!isShowChoose">
                        <b-table striped hover bordered show-empty :items="mainlist" :fields="showFields">
                            <template slot="show_details" slot-scope="row">
                                <a @click.stop="queryDetailList(row)">{{ row.item.couponNo }}</a> 
                            </template>
                            <template slot="row-details" slot-scope="row">
                                <div class="tableIntable">
                                    <b-table show-empty :items="row.item.detailList" :fields="fields_detail">
                                        <template slot="index" slot-scope="data">
                                            {{ data.index + 1 }}
                                        </template>
                                        <template slot="empty">
                                            暂无数据...
                                        </template>
                                    </b-table>
                                </div> 
                            </template>
                            <template slot="empty">
                                暂无数据...
                            </template>
                        </b-table>
                    </div>
                    <div v-if="isShowTips" class="ticket-warning-tips">
                        <span></span>警示: 本券包含多个服务,仅用于洗车将作废其他服务项目,请确认！
                    </div>
                    <div class="ticket-select-right-detail-button" v-if="isShowChoose" @click="useNow">
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
            acceptObj: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            isShowChoose: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                isShowTips: false,
                selectObj: '',
                searchValue: '',
                detaillist: [],
                mainlist: [],
                fields: {
                    index: {
                        label: '选择'
                    },
                    show_details: {
                        label: '券号'
                    },
                    couponName: {
                        label: '券名称'
                    },
                    couponTypeName: {
                        label: '券类型'
                    },
                    endDateStr: {
                        label: '截止时间'
                    },
                    availableDays: {
                        label: '剩余天数'
                    }
                },
                showFields: {
                    show_details: {
                        label: '券号'
                    },
                    couponName: {
                        label: '券名称'
                    },
                    couponTypeName: {
                        label: '券类型'
                    },
                    endDateStr: {
                        label: '截止时间'
                    },
                    availableDays: {
                        label: '剩余天数'
                    }
                },
                fields_detail: {
                    detailName: {
                        label: '服务'
                    },
                    detailNums: {
                        label: '次数'
                    },
                    discountValue: {
                        label: '折扣'
                    }
                }
            }
        },
        methods: {
            search() {
                if(!this.searchValue) {
                    // Message({
                    //     type: 'warning',
                    //     message: '请输入券号'
                    // })
                    // return
                    // this.getFirstData()
                }else {
                    let option = {
                        couponNo: this.searchValue
                    }   
                    this.mainlist = []
                    this.selectObj = ''
                    api.ticketManage.getCouponInfoByCode(option, res => {
                        if(res.data.code === 'success') {
                            this.mainlist.push(res.data.obj)
                        }
                    })
                }
                
            },
            useNow() {
                if(!this.selectObj) {
                    Message({
                        type: 'warning',
                        message: '请选择要使用的券'
                    })
                    return
                }
                this.$emit('use', this.selectObj)
                this.reset()
                this.hideTicketModal()
            },
            queryDetailList(value) {
                value.toggleDetails()
                if(value.detailsShowing) {
                    
                }else { 
                    let option = {
                        couponNo: value.item.couponNo
                    }
                    api.ticketManage.getCouponInfoByCode(option, res => {
                        if(res.data.code === 'success') {
                            // console.log(value)
                            let currentIndex = value.index
                            for(let i = 0; i< this.mainlist.length; i++) {
                                if(i === currentIndex) {
                                    this.mainlist[currentIndex].detailList = res.data.obj.couponDetailInfoVos
                                }
                            }
                            this.mainlist[currentIndex] = JSON.parse(JSON.stringify(this.mainlist[currentIndex]))
                            this.mainlist = JSON.parse(JSON.stringify(this.mainlist))
                        }
                    })
                }
            },
            reset() {
                this.searchValue = ''
                this.selectObj = ''
                this.mainlist = []
            },
            showTicketModal() {
                this.reset()
                this.$refs.ticketModal.show()
            },
            getFirstData(params) {
                // let option = {
                    // storeCode: 'STORE2000905',
                    // customCode: 'CUSTOM2004669',
                    // vehicleCode: 'CV20180529000140',
                    // detailCodes: []
                // }
                // let option = {
                //     storeCode: this.acceptObj.storeCode,
                //     customCode: this.acceptObj.customCode,
                //     vehicleCode: this.acceptObj.vehicleCode,
                //     detailCodes: this.acceptObj.detailCodes
                // }

                // add by lwx on 2018/07/10
                api.ticketManage.getCouponListByCustomer(params, res => {
                    if(res.data.code === 'success') {
                        this.mainlist = res.data.obj
                        if(this.isShowChoose) {
                            let params = {
                                custCode: this.acceptObj.customCode
                                // custCode: 'CUSTOM2004669'
                            }
                            api.ticketManage.queryOrderServiceCouponInfo(params, res => {
                                if(res.data.code === 'success') {
                                    let judgeObj = res.data.obj
                                    for(let i = 0; i< this.mainlist.length; i++) {
                                        if(judgeObj[this.mainlist[i].couponNo]) {
                                            this.mainlist.splice(i, 1)
                                            i--
                                        }
                                    }
                                }
                            })
                        }else {

                        }  
                    }
                })
            },
            hideTicketModal() {
                this.$refs.ticketModal.hide()
            }
        },
        watch: {
            selectObj: function(value) {
                if(!value) {
                    this.isShowTips = false
                }else {
                    this.isShowTips = true
                }
            },
            searchValue: function(value) {

            }
        }
    }
</script>
<style>
    .ticket-select-layout table a {
        cursor: pointer;
    }
    .ticket-select-layout table td .tableIntable {
        width: 50%;
        margin: 0 auto;
    }
    .ticket-select-layout table td .tableIntable table th {
        color: rgb(102, 126, 233);
        border: none;
    }
    .ticket-select-layout table td .tableIntable table td {
        border: none;
    }
    .ticket-select-layout table .b-table-details:hover {
        background-color: #fff;
    }
    .ticket-select-layout table td .tableIntable table tr {
        background-color: #fff !important;
    }
    /* .ticket-select-layout table td .tableIntable table tbody tr {
        background-color: #fff;
    } */
    .ticket-select-layout table td .tableIntable table tr:hover {
        background-color: #fff;
    }
    .ticket-select-layout table td .tableIntable table {
        border: none;
    }
    .ticket-warning-tips {
        margin-top: 10px;
        display: inline-block;
        color: rgb(170, 32, 32);
        padding: 5px;
        background-color: rgb(138, 127, 127);
    }
    .ticket-warning-tips>span:first-child {
        display: inline-block;
        height: 15px;
        width: 15px;
        background-image: url(../../../static/image/warning.png);
        background-size: 15px 15px;
        background-position: bottom center;
        vertical-align: middle;
    }
    .ticket-select-modal .modal-body {
        padding-top: 0px;
    }
    .ticket-select-modal header {
        border-bottom: none;
    }
    .ticket-select-modal header h5 {
        padding-bottom: 5px;
        border-bottom: 2px solid rgb(228, 96, 96);
    }
    .ticket-select-layout {
        padding-bottom: 40px;
        position: relative;
    }
    .card-select-modal-search {
        margin-bottom: 10px;
    }
    .ticket-select-right-detail-button {
        position: absolute;
        right: 5%;
        bottom: 5px;
        height: 30px;
        line-height: 30px;
        width: 15%;
        font-size: 18px;
        text-align: center;
        border-radius: 5px;
        border: 1px solid #ccc;
        margin: 0 auto;
        cursor: pointer;
    }
</style>

