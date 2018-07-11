<template>
    <div>
        <b-card header="查询">
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="调拨类型" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.transferType" :options="typesList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="调拨状态" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.orderStatus" :options="statusList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="实际入库时间" label-text-align="right" :label-cols="4">
                        <el-date-picker
                            v-model="actualTime"
                            type="daterange"
                            @change="datechangeAct()"
                            :clearable="true"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="商品名称" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.skuName" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="商品编码" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.skuCode" placeholder="" />
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="调出方" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshopOut" @control-frame="hideIn" :rightControl="false" :storeAll="true"  @select-change="selectedfunout"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="出库单号" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.transferOutOrderNo" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="出库时间" label-text-align="right" :label-cols="4">
                        <el-date-picker
                            v-model="outTime"
                            type="daterange"
                            @change="datechangeOut()"
                            :clearable="true"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="出库单操作人" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.confirmOperatorName" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="出库单审批人" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.auditPassOperatorName" placeholder="" />
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="调入方" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshopIn" @control-frame="hideOut" :storeAll="true"  @select-change="selectedfunin"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="入库单号" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.transferInOrderNo" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="入库时间" label-text-align="right" :label-cols="4">
                        <el-date-picker
                            v-model="inTime"
                            type="daterange"
                            @change="datechangeIn()"
                            :clearable="true"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="入库单操作人" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.inEmpName" placeholder="" />
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset">重置</b-button>
                        <b-button size="sm" variant="primary" @click="query(0)">查询</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="tablelist" :fields="fields">
                    <template slot="index" slot-scope="data">
                        {{ (page.pageNo-1)*page.pageSize + data.index + 1 }}
                    </template>
                    <template slot="transferType" slot-scope="data">
                        {{ data.item.transferType === "1"? "集团内转售":"内部调拨" }}
                    </template>
                    <template slot="orderStatus" slot-scope="data">
                        {{ data.item.orderStatus === '2'? '已生效': '' }}
                        {{ data.item.orderStatus === '3'? '已完成': '' }}
                        {{ data.item.orderStatus === '4'? '已关闭': '' }}
                        {{ data.item.orderStatus === '0'? '未生效': '' }}
                        {{ data.item.orderStatus === '1'? '已提交': '' }}
                        {{ data.item.orderStatus === '-1'? '作废': '' }}
                    </template>
                    <template slot="outNums" slot-scope="data">
                        {{ data.item.outNums ? (data.item.outNums - 0).toFixed(0) : data.item.outNums }}
                    </template>
                    <template slot="errorNum" slot-scope="data">
                        {{ data.item.errorNum ? (data.item.errorNum - 0).toFixed(0) : data.item.errorNum }}
                    </template>
                    <template slot="inNums" slot-scope="data">
                        {{ data.item.inNums ? (data.item.inNums - 0).toFixed(0) : data.item.inNums }}
                    </template>
                    <template slot="empty">
                        	暂无数据...
                    </template>
                </b-table>
            </div>
            <div class="row mt-2">
				<div class="col-md-12">
					<pagination class="pull-right" @page-change="pageChange" :page-no="page.pageNo" :page-size="page.pageSize" :total-result="page.totalResult" :total-pages="page.totalPages">
					</pagination>
				</div>
			</div>
        </b-card>
    </div>
</template>
<script>
    import Vue from 'vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import pagination from 'components/pagination/pagination.vue'
    import config from 'common/config'
    import api from 'common/api'
    import { MessageBox, Message, DatePicker } from 'element-ui'
    import apiCollection from '../../common/api-collection';
    import common from 'common/common.js'
    Vue.use(DatePicker)
    export default {
        components: {
            pagination,
            areaqueryshop
        },
        data() {
            return {  
                typesList: [],
                statusList: [],
                actualTime: [],  
                inTime: [], 
                outTime: [], 
                statelistin: [],
                statelistout: [],
                page: {
                    pageNo: 1,
                    pageSize: config.pageNums,
                    totalResult: 0,
                    totalPages: 0
                },    
                queryCondition: {
                    skuName: '',
                    transferType: '',
                    orderStatus: '',
                    inTimeBefore: '',
                    inTimeAfter: '',
                    skuCode: '',
                    transferOutOrderNo: '',
                    auditPassTimeBefore: '',
                    auditPassTimeAfter: '',
                    confirmOperatorName: '',
                    auditPassOperatorName: '',
                    transferInOrderNo: '',
                    inCreateTimeAfter: '',
                    inCreateTimeBefore: '',
                    inEmpName: '',
                    inStoreCodeList: [],
                    inWhCodeList: [],
                    outStoreCodeList: [],
                    outWhCodeList: []
                },
                tablelist: [],
                fields: {
                    index: {
                        label: '序号'
                    },
                    transferType: {
                        label: '调拨类型'
                    },
                    orderStatus: {
                        label: '调拨状态'
                    },
                    transferOutOrderNo: {
                        label: '出库单号'
                    },
                    outStoreName: {
                        label: '门店名称'
                    },
                    outWhName: {
                        label: '仓库名称'
                    },
                    skuCode: {
                        label: '商品编码'
                    },
                    skuName: {
                        label: '商品名称'
                    },
                    brandName: {
                        label: '品牌'
                    },
                    skuModel: {
                        label: '型号'
                    },
                    skuStandards: {
                        label: '规格'
                    },
                    outNums: {
                        label: '调拨出库数量'
                    },
                    errorNum: {
                        label: '差异'
                    },
                    outCreateTime: {
                        label: '出库单创建时间'
                    },
                    auditPassTime: {
                        label: '出库单确认时间'
                    },
                    confirmOperatorName: {
                        label: '操作人'
                    },
                    auditPassOperatorName: {
                        label: '审批人'
                    },
                    transferInOrderNo: {
                        label: '调拨入库单号'
                    },
                    inStoreName: {
                        label: '门店'
                    },
                    inWhName: {
                        label: '仓库'
                    },
                    inCreateTime: {
                        label: '入库单创建时间'
                    },
                    inNums: {
                        label: '调拨入库实入数量'
                    },
                    inEmpName: {
                        label: '操作人'
                    }
                }
            }
        },
        computed: {

        },
        methods: {
            // 让出库选择框消失
            hideOut() {
                this.$refs.areaqueryshopOut.hideFrame()
            },
            // 让入库选择框消失
            hideIn() {
                this.$refs.areaqueryshopIn.hideFrame()
            },
            // 重置
            reset() {
                const _this = this
                _this.queryCondition = {
                    skuName: '',
                    transferType: '',
                    orderStatus: '',
                    inTimeBefore: '',
                    inTimeAfter: '',
                    skuCode: '',
                    transferOutOrderNo: '',
                    auditPassTimeBefore: '',
                    auditPassTimeAfter: '',
                    confirmOperatorName: '',
                    auditPassOperatorName: '',
                    transferInOrderNo: '',
                    inCreateTimeAfter: '',
                    inCreateTimeBefore: '',
                    inEmpName: '',
                    inStoreCodeList: [],
                    inWhCodeList: [],
                    outStoreCodeList: [],
                    outWhCodeList: []
                }
                _this.$refs.areaqueryshopOut.reset()
                _this.$refs.areaqueryshopOut.resetToStart()
                _this.$refs.areaqueryshopIn.reset()
                _this.$refs.areaqueryshopIn.resetToStart()
            },
            // 分页
            pageChange(nextpage) {
                const _this = this
                _this.query(nextpage)
            },
            // 查询   注意  该查询至少有一个条件才可以查询
            query(arg) {
                const _this = this
                console.log(_this.actualTime)
                if(_this.actualTime.length > 0) {
                    let aTime = common.formattingTime(_this.actualTime)
                    _this.queryCondition.inTimeBefore = aTime.startTime === '1970-01-01'? '' : aTime.startTime
                    _this.queryCondition.inTimeAfter = aTime.endTime === '1970-01-01'? '' : aTime.endTime
                }
                if(_this.outTime.length > 0) {
                    let bTime = common.formattingTime(_this.outTime)
                    _this.queryCondition.auditPassTimeBefore = bTime.startTime === '1970-01-01'? '' : bTime.startTime
                    _this.queryCondition.auditPassTimeAfter = bTime.endTime === '1970-01-01'? '' : bTime.endTime
                }
                if(_this.inTime.length > 0) {
                    let cTime = common.formattingTime(_this.inTime)
                    _this.queryCondition.inCreateTimeBefore = cTime.startTime === '1970-01-01'? '' : cTime.startTime
                    _this.queryCondition.inCreateTimeAfter = cTime.endTime === '1970-01-01'? '' : cTime.endTime
                }
                _this.queryCondition.pageNums = config.pageNums
                _this.queryCondition.pageStart = arg === 0 ? 1: arg
                
                if(_this.queryCondition.skuName === ''&&_this.queryCondition.transferType === ''&& _this.queryCondition.orderStatus === ''&&_this.queryCondition.inTimeBefore === '' &&_this.queryCondition.inTimeAfter === ''&&_this.queryCondition.skuCode === ''&&_this.queryCondition.transferOutOrderNo ===''&&_this.queryCondition.auditPassTimeBefore === ''&&_this.queryCondition.auditPassTimeAfter===''&&_this.queryCondition.confirmOperatorName ==='' && _this.queryCondition.auditPassOperatorName === ''&& _this.queryCondition.transferInOrderNo===''&&_this.queryCondition.auditPassTimeAfter ===''&&_this.queryCondition.inCreateTimeBefore === ''&&_this.queryCondition.inCreateTimeAfter === ''&&_this.queryCondition.inEmpName===''&&_this.queryCondition.inStoreCodeList.length === 0&& _this.queryCondition.inWhCodeList.length === 0&&_this.queryCondition.outStoreCodeList.length === 0&&_this.queryCondition.outWhCodeList.length === 0) {
                    Message({
                        type: 'warning',
                        message: '查询条件至少有一项'
                    })
                    return
                }
                api.allotTicket.queryByPage(_this.queryCondition, (res) => {
                    if(res.data.code === 'success') {
                        let tablePage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        _this.page = tablePage
                        // if(res.data.obj instanceof Array) {
                        //     _this.tablelist = []
                        // }else {
                        _this.tablelist = res.data.obj.list
                        // }
                    }
                })
            },
            // 调拨入库 门店组件
            selectedfunin(data,data1) {
                const _this = this
                if(data1.length) {
                    _this.queryCondition.inStoreCodeList = []
                    data1.forEach(element => {
                        if(element.value === 0) {

                        }else {
                            _this.queryCondition.inStoreCodeList.push(element.value)
                        }
                    })
                }else {
                    
                    _this.queryCondition.inStoreCodeList = []
                    if(data1.value) _this.queryCondition.inStoreCodeList.push(data1.value)
                }
            },
            // 调拨出库门店组件
            selectedfunout(data,data1) {
                const _this = this
                if(data1.length) {
                    _this.queryCondition.outStoreCodeList = []
                    data1.forEach(element => {
                        if(element.value === 0) {

                        }else {
                            _this.queryCondition.outStoreCodeList.push(element.value)
                        }
                    })
                }else {
                    _this.queryCondition.outStoreCodeList = []
                    if(data1.value) _this.queryCondition.outStoreCodeList.push(data1.value)
                }
            },
            datechangeIn() {
                
            },
            datechangeAct() {
                
            },
            datechangeOut() {
                
            }
        },
        created() {
            const _this = this
            // 初始化数据
            _this.typesList = config.allotTicket.transferTypes
            _this.statusList = config.allotTicket.transferStatus
        }
    }
</script>
<style scoped>

</style>


