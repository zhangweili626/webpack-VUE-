<template>
    <div class="animated fadeIn">
        <b-card header="查询">
            <div class="row">
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单创建时间" :label-cols="4" class="text-right">
                        <date-picker type="daterange"
                            format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="orderCreatedTimeChange"
                            v-model="createTimeStep">
                        </date-picker>   
                    </b-form-fieldset> 
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单业务类型" :label-cols="4" class="text-right">
                        <b-form-select :options="orderTypes" v-model="queryParameter.orderTypeCode">
                        </b-form-select>    
                    </b-form-fieldset>     
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单来源" :label-cols="4" class="text-right">
                        <b-form-select :options="orderSourceTypeList" v-model="queryParameter.orderSourceType">
                        </b-form-select>    
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单号" :label-cols="4" class="text-right">
                        <b-form-input type="text" v-model.trim="queryParameter.orderNo">
                        </b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="领料状态" :label-cols="4" class="text-right">
                        <b-form-select :options="pickingStatusList" v-model="queryParameter.pickingStatus">
                        </b-form-select>    
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单来源单号" :label-cols="4" class="text-right">
                        <b-form-input type="text" v-model.trim="queryParameter.orderSourceNumber">
                        </b-form-input>    
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="客户手机号" :label-cols="4" class="text-right">
                        <b-form-input type="tel" v-model.trim="queryParameter.custMobile">
                        </b-form-input>    
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="车牌" :label-cols="4" class="text-right">
                        <b-form-input type="text" v-model.trim="queryParameter.custPlates">
                        </b-form-input>    
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="" class="text-left">
                        <b-form-group>
                            <b-form-checkbox-group id="checkboxes2" class="mt-1">
                                <b-form-checkbox value="1">保护临时车</b-form-checkbox>
                            </b-form-checkbox-group>
                        </b-form-group>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="客户姓名" :label-cols="4" class="text-right">
                        <b-form-input type="text" v-model.trim="queryParameter.custName">
                        </b-form-input>    
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="VIN" :label-cols="4" class="text-right">
                        <b-form-input type="text" v-model.trim="queryParameter.vinNo">
                        </b-form-input>    
                    </b-form-fieldset>
                </div>
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" @click="clear">重置</b-button>
                        <b-button size="sm" variant="primary" @click="search">查询</b-button>
                    </div>
                </div>
            </div>    
        </b-card>
        <b-card>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :fields="fields" :items="orderList">
                    <template slot="orderNo" slot-scope="row">
                        <a href="#" @click="showDetail(row.item.orderNo)">{{ row.item.orderNo }}</a>
                    </template>
                    <template slot="pickingStatus" slot-scope="row">
                        {{ row.item.pickingStatus | pickingStatus }}
                    </template>
                    <template slot="orderSourceType" slot-scope="row">
                        {{ row.item.orderSourceType | orderSourceType }}
                    </template>
                    <template slot="paymentStatus" slot-scope="row">
                        {{ row.item.paymentStatus | paymentStatus }}
                    </template>
                    <template slot="invoiceStatus" slot-scope="row">
                        {{ row.item.invoiceStatus | invoiceStatus }}
                    </template>
                    <template slot="createTime" slot-scope="row">
                        {{ row.item.createTime | formatDate }}
                    </template>
                    <template slot="checkOrder" slot-scope="row">
                        {{ (row.item.precheckOrderNos ? '预检单': '') + ' ' + (row.item.qaOrderNos ? '质检单': '')}}
                    </template>
                    <template slot="empty">暂无数据</template>
                </b-table>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <pagination class="pull-right" @page-change="pageChange" :page-no="pager.pageNo" :page-size="pager.pageSize" :total-result="pager.total" :total-pages="pager.totalPages">
                    </pagination>
                </div>
            </div>
        </b-card>
    </div>    
</template>

<script>
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'

    import {
        MessageBox,
        Message,
        DatePicker
    } from 'element-ui'

    import config from '../../common/config'
    import pagination from '../../components/pagination/pagination'

    export default {
        mounted() {
            let _this = this
            _this.getOrderTypes()
        },
        destroyed() {
            let _this = this
        },
        data: function() {
            return {
                createTimeStep: [],
                queryParameter: {
                    createTimeFrom: '',
                    createTimeTo: '',
                    custMobile: '',
                    custName: '',
                    custPlates: '',
                    pickingStatus: 0,
                    orderTypeCode: '',
                    orderSourceType: '',
                    orderSourceNumber: '', 
                    orderNo: '',
                    vinNo: '',
                    pageStart: 1,
                    pageNums: config.pageNums
                },
                pickingStatusList: [
                    {
                        text: '未领料',
                        value: 0
                    },
                    {
                        text: '部分领料',
                        value: 1
                    },
                    {
                        text: '完全领料',
                        value: 2
                    }
                ],
                orderSourceTypeList: [
                    {
                        text: '请选择',
                        value: ''
                    },
                    {
                        text: '门店散客',
                        value: 0
                    },
                    {
                        text: '售后预约',
                        value: 1
                    },
                    {
                        text: '销售预约',
                        value: 2
                    },
                    {
                        text: '客服预约',
                        value: 3
                    }
                ],
                fields: {
                    orderTypeName:{
                        label: '订单业务类型'
                    },
                    orderNo:{
                        label: '订单号'
                    },
                    pickingStatus:{
                        label: '领料状态'
                    },
                    storeName:{
                        label: '门店名称'
                    },
                    createBy:{
                        label: '开单人'
                    },
                    custName:{
                        label: '客户姓名'
                    },
                    custTypeName:{
                        label: '客户类型'
                    },
                    custMobile:{
                        label: '手机'
                    },
                    custPlates:{
                        label: '车牌'
                    },
                    carModelName:{
                        label: '车型'
                    },
                    actualTotalPrice:{
                        label: '订单金额'
                    },
                    paymentStatus:{
                        label: '支付状态'
                    },
                    invoiceStatus:{
                        label: '是否开票'
                    },
                    createTime:{
                        label: '订单创建时间'
                    },
                    closingDate:{
                        label: '订单结算时间'
                    },
                    orderSourceType:{
                        label: '订单来源'
                    },
                    orderSourceNumber:{
                        label: '订单来源单号'
                    },
                    checkOrder: {
                        label: '检查单'
                    }
                }
            }
        },
        computed: {
            ...mapState('storeRequisition', [
                'orderList',
                'orderTypes',
                'pager',
            ])
        },
        methods: {
            clear: function() {
                let _this = this
                _this.$data.queryParameter = {
                    createTimeFrom: '',
                    createTimeTo: '',
                    custMobile: '',
                    custName: '',
                    custPlates: '',
                    pickingStatus: 0,
                    orderTypeCode: '',
                    orderSourceType: '',
                    orderSourceNumber: '',
                    orderNo: '',
                    vinNo: '',
                    pageStart: 1,
                    pageNums: config.pageNums
                }
            },
            search: function() {
                let _this = this
                _this.getOrderInfoList(_this.$data.queryParameter) 
            }, 
            pageChange: function(num) {
                let _this = this
                _this.$data.queryParameter.pageStart = num
                _this.getOrderInfoList(_this.$data.queryParameter) 
            },
            orderCreatedTimeChange: function() {
                let _this = this
                if (_this.$data.createTimeStep && _this.$data.createTimeStep.length > 0) {
                    let timeOne = _this.createTimeStep[0]
                    let timeTwo = _this.createTimeStep[1]
                    _this.$data.queryParameter.createTimeFrom = timeOne.getFullYear() + '-' + (timeOne.getMonth() + 1) + '-' + timeOne.getDate()
                    _this.$data.queryParameter.createTimeTo = timeTwo.getFullYear() + '-' + (timeTwo.getMonth() + 1) + '-' + timeTwo.getDate()
                } else {
                    _this.$data.queryParameter.createTimeFrom = ''
                    _this.$data.queryParameter.createTimeTo = ''
                }
            },
            showDetail: function(orderNo) {
                let _this = this
                _this.$router.push('/store-requisition/edit/' + orderNo)
            },
            ...mapActions('storeRequisition', [
                'getOrderTypes',
                'getOrderInfoList'
            ])
        },
        components: {
            DatePicker,
            pagination
        }
    }
</script>

<style lang="scss" scope>
</style>
