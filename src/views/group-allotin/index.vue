<template>
    <div>
        <b-card header="查询">
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调拨入库单号" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.codein" placeholder="" />
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调入方" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshopin" @control-frame="hideOut" :storeAll="true" @select-change="selectedfunin"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调入方仓库" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.supplyin" :options="statelistin"></b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调出方" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshopout" @control-frame="hideIn" :rightControl="false" :storeAll="true" @select-change="selectedfunout"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调出方仓库" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.supplyout" :options="statelistout"></b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="预计到货时间" label-text-align="right" :label-cols="4">
                        <el-date-picker
                            v-model="arrivetime"
                            type="daterange"
                            @change="datechangein()"
                            :clearable="true"
                            :editable="false"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="单据时间" label-text-align="right" :label-cols="4">
                        <el-date-picker
                            v-model="tickettime"
                            type="daterange"
                            @change="datechangeticket()"
                            :clearable="true"
                            :editable="false"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
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
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="success" v-if="addAllotIn" @click="add">新增</b-button>
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="allotinlist" :fields="fields">
                    <template slot="transferInOrderNo" slot-scope="data">
                        <a href="javascript:;" @click="showDetail(data.item.transferInOrderNo)">{{ data.item.transferInOrderNo }}</a>
                    </template>
                    <template slot="realMoney" slot-scope="data">
                        {{ data.item.realMoney ? data.item.realMoney.toFixed(2) : '' }}
                    </template>
                    <template slot="createBy" slot-scope="data">
                        {{ data.item.inEmpName }}
                    </template>
                    <template slot="sureTime" slot-scope="data">
                        {{ data.item.inTime }}
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
        <b-modal id="modalPrevent"
                v-model="isShowModel"
                ref="modal"
                size="lg"
                title="输入调拨出库单号"
                @ok="handleOk"
                @shown="clearName"
                ok-title="确认"
                cancel-title="取消">
                <div class="row">
                    <div class="col-md-8 col-lg-8">
                        <b-form-fieldset horizontal label="单号" label-text-align="right" :label-cols="3">
                            <b-form-input type="text"
                                        placeholder="单号"
                                        v-model="ticketCode">
                            </b-form-input>
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8 col-lg-8">
                        <b-form-fieldset horizontal label="调出方区域" label-text-align="right" :label-cols="3">
                            <areaqueryshop ref="areaqueryshopOne" :rightControl="false" :readonly="showObj.shopState"  @select-change="selectedfun"></areaqueryshop>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="调出方仓库" label-text-align="right" :label-cols="4">
                            <b-form-input :value="showObj.outWhName" :readonly="true" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8 col-lg-8">
                        <b-form-fieldset horizontal label="调入方区域" label-text-align="right" :label-cols="3">
                            <areaqueryshop ref="areaqueryshopTwo" :readonly="showObj.shopState"  @select-change="selectedfun"></areaqueryshop>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <b-form-fieldset horizontal label="调入方仓库" label-text-align="right" :label-cols="4">
                            <b-form-input :value="showObj.inWhName" :readonly="true" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8 col-lg-8">
                        <b-form-fieldset horizontal label="计划完成时间" label-text-align="right" :label-cols="3">
                            <b-form-input :value="showObj.completeTime" :readonly="true" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
        </b-modal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import pagination from 'components/pagination/pagination.vue'
    import config from 'common/config'
    import api from 'common/api'
    import {mapState, mapMutations, mapActions} from 'vuex'
    import { MessageBox, Message, DatePicker } from 'element-ui'
    import apiCollection from '../../common/api-collection';
    // import collectionApi from 'common/api-collection.js'
    import common from 'common/common.js'
    import {hasBtn} from 'common/api-common.js'
    Vue.use(DatePicker)
    export default {
        components: {
            pagination,
            areaqueryshop
        },
        data() {
            return {
                arrivetime: '',
                tickettime: '',
                // pageNo: 1,
                // pageSize: config.pageNums,
                // totalResult: 0,
                // totalPages: 1,  
                statelistout: [],
                statelistin: [],            
                queryCondition: {
                    codein: '',
                    areain: '',
                    storeCodein: '',
                    supplyin: '',
                    areaout: '',
                    storeCodeout: '',
                    supplyout: '',
                    timeinStart: '',
                    timeinEnd: '',
                    ticketStart: '',
                    ticketEnd: '',
                    inStoreCodeList: [],
                    outStoreCodeList: []
                },
                isShowModel: false,
                ticketCode: 'A003',
                inCode: '',
                fields: {
                    // workFlow: {
                    //     label: '工作流名称'
                    // },
                    transferInOrderNo: {
                        label: '调拨入库单号'
                    },
                    transferOutOrderNo: {
                        label: '调拨出库单号'
                    },
                    inStoreName: {
                        label: '调入门店'
                    },
                    inWhName: {
                        label: '调入仓库'
                    },
                    outStoreName: {
                        label: '调出门店'
                    },
                    outWhName: {
                        label: '调出仓库'
                    },
                    realNums: {
                        label: '实入总数量'
                    },
                    realMoney: {
                        label: '实入总金额(含税)'
                    },
                    createTimeStr: {
                        label: '单据时间'
                    },
                    sureTime: {
                        label: '确认时间'
                    },
                    createBy: {
                        label: '创建人'
                    },
                    inEmpName: {
                        label: '提交人'
                    },
                    inTime: {
                        label: '提交时间'
                    },
                    totalFreightFee: {
                        label: '运费(含税)'
                    },
                    beTermNo: {
                        label: '账期'
                    }
                },
                tablelist: [],
                allotinlist: [],
                page: {},
                showObj: {
                    inWhName: '',
                    outWhName: '',
                    completeTime: '',
                    shopState: false
                }
            }
        },
        computed: {
            addAllotIn(){
				return hasBtn(apiCollection.allotin.instorage);
			}
            // ...mapState('allotin',[
            //     'allotinlist',
            //     'page'
            // ])
        },
        methods: {
            // ...mapActions('allotin', [
            //     'setTableList',
            //     'setPage'
            // ]),
            // 让出库选择框消失
            hideOut() {
                this.$refs.areaqueryshopout.hideFrame()
            },
            // 让入库选择框消失
            hideIn() {
                this.$refs.areaqueryshopin.hideFrame()
            },
            selectedfun() {

            },
            // 重置
            reset() {
                const _this = this
                _this.queryCondition= {
                    codein: '',
                    areain: '',
                    storeCodein: _this.queryCondition.storeCodein,
                    supplyin: '',
                    areaout: '',
                    storeCodeout: '',
                    supplyout: '',
                    timeinStart: '',
                    timeinEnd: '',
                    ticketStart: '',
                    ticketEnd: '',
                    outStoreCodeList: [],
                    inStoreCodeList: []
                }
                _this.arrivetime= ''
                _this.tickettime= ''
                _this.$refs.areaqueryshopout.reset()
                _this.$refs.areaqueryshopout.resetToStart()
                _this.$refs.areaqueryshopin.reset()
                _this.$refs.areaqueryshopin.resetToStart()
            },
            pageChange(nextpage) {
                const _this = this
                _this.query(nextpage)
            },
            query(arg) {
                const _this = this
                let queryOption = {
                    transferInOrderNo: _this.queryCondition.codein,
                    outStoreCode: _this.queryCondition.storeCodeout,
                    outWhCode: _this.queryCondition.supplyout,
                    inStoreCode: _this.queryCondition.storeCodein,
                    inWhCode: _this.queryCondition.supplyin,
                    estimatedArrivalDateBefore: _this.queryCondition.timeinStart,
                    estimatedArrivalDateAfter: _this.queryCondition.timeinEnd,
                    createTimeBefore: _this.queryCondition.ticketStart,
                    createTimeAfter: _this.queryCondition.ticketEnd,
                    pageNums: config.pageNums,
                    pageStart: arg === 0 ? 1 : arg,
                    inStoreCodeList: _this.queryCondition.inStoreCodeList,
                    outStoreCodeList: _this.queryCondition.outStoreCodeList,
                    transferType: 1,
                    transferSkuType: 1
                }
                api.allotin.query(queryOption, (res) => {
                    if(res.data.code === 'success') {
                        // _this.setTableList(res.data.obj.list)
                        _this.allotinlist = res.data.obj.list
                        let tablePage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        _this.page = tablePage
                        // _this.setPage(tablePage)
                    }
                })
            },
            handleOk(evt) {
                evt.preventDefault()
                const _this = this
                _this.isShowModel = false
                let params = {
                    "transferOutOrderNo": _this.ticketCode,
                    "wfStatus": 1,
                    "transferType": 1,
                    "transferSkuType": 1
                    // "transferInOrderNo": res.data.obj
                }
                // _this.inCode = res.data.obj
                api.allotin.queryByCode(params, (res) => {
                    if(res.data.code === 'success') {
                        if(res.data.obj === null) {
                            Message({
                                type: 'info',
                                message: '该出库单不可操作'
                            })
                            return;
                        }
                        let judge = false
                        let tempArr = res.data.obj.transferSaleOutSkuDetailInfoVoList
                        for(let i = 0; i< tempArr.length; i++) {
                            if(tempArr[i].remainNums > 0) {
                                judge = true;
                                break;
                            }
                        }
                        if(judge) {
                            _this.$router.push({
                                path: '/group-allotin/add',
                                query: {
                                    inCode: '',
                                    outCode: _this.ticketCode,
                                    code: '0'
                                }
                            })
                        }else {
                            Message({
                                type: 'info',
                                message: '该出库单已全部入库'
                            })
                        } 
                    }
                })
            },
            clearName(evt) {
                evt.preventDefault()
                const _this = this
                _this.ticketCode = ''
                // _this.isShowModel = false
            },
            add() {
                const _this = this
                _this.isShowModel = !_this.isShowModel
            },
            selectedfunin(data,data1) {
                const _this = this
                if(data === "空值") {
                    _this.queryCondition.storeCodeout = ''
                    _this.queryCondition.outStoreCodeList = []
                    return;
                }
                if(data.length === 0) {
                    return;
                }
                // _this.queryCondition.areain = data[0].code
                if(data1.length) {
                    _this.queryCondition.storeCodein = ''
                    _this.queryCondition.inStoreCodeList = []
                    data1.forEach(element => {
                        if(element.value === 0) {

                        }else {
                            _this.queryCondition.inStoreCodeList.push(element.value)
                        }
                    })
                }else {
                    _this.queryCondition.storeCodein = data1.value
                    _this.queryCondition.inStoreCodeList = []
                    // _this.queryCondition.storeCodein = data1.value
                    const options = {
						'storeCodeSet' : []
					}
                    options.storeCodeSet.push(data1.value)
					// 根据经销商店获取仓库
					api.getEntrepot(options, function(res){
						if(res.data.code === 'success') {
                            _this.statelistin = []
                            const array = res.data.obj
							for(var i =0; i< array.length; i++) {
								let obj = {}
								obj.text = array[i].warehouseName
								obj.value = array[i].warehouseCode
								_this.statelistin.push(obj)
							}
						}
					})
                }
            },
            selectedfunout(data,data1) {
                const _this = this
                if(data === "空值") {
                    _this.queryCondition.storeCodeout = ''
                    _this.queryCondition.outStoreCodeList = []
                    return;
                }
                if(data.length === 0) {
                    return;
                }
                _this.queryCondition.areaout = data[0].code
                if(data1.length) {
                    _this.queryCondition.storeCodeout = ''
                    _this.queryCondition.outStoreCodeList = []
                    data1.forEach(element => {
                        if(element.value === 0) {

                        }else {
                            _this.queryCondition.outStoreCodeList.push(element.value)
                        }
                    })
                }else {
                    _this.queryCondition.storeCodeout = data1.value
                    _this.queryCondition.outStoreCodeList = []
                    const options = {
						'storeCodeSet' : []
					}
                    options.storeCodeSet.push(data1.value)
					// 根据经销商店获取仓库
					api.getEntrepot(options, function(res){
						if(res.data.code === 'success') {
                            _this.statelistout = []
							const array = res.data.obj
							for(var i =0; i< array.length; i++) {
								let obj = {}
								obj.text = array[i].warehouseName
								obj.value = array[i].warehouseCode
								_this.statelistout.push(obj)
							}
						}
					})
                }
            },
            datechangein() {
                const _this = this
                let arriveTime = common.formattingTime(_this.arrivetime)
                _this.queryCondition.timeinStart = arriveTime.startTime
                _this.queryCondition.timeinEnd = arriveTime.endTime
            },
            datechangeticket() {
                const _this = this
                let tickettime = common.formattingTime(_this.tickettime)
                _this.queryCondition.ticketStart = tickettime.startTime
                _this.queryCondition.ticketEnd = tickettime.endTime
            },
            showDetail(arg) {
                const _this = this
                _this.$router.push({
                    path: '/group-allotin/show',
                    query: {
                        inCode: arg,
                        outCode: '',
                        code: '1'
                    }
                })
            }
        },
        watch: {
            ticketCode: function(value) {
                if(value === '') {
                    return
                }
                const _this = this
                let params = {
                    "transferOutOrderNo": value,
                    "wfStatus": 1,
                    "transferType": 1,
                    "transferSkuType": 1
                    // "transferInOrderNo": res.data.obj
                }
                api.allotin.queryByCode(params, (res) => {
                    if(res.data.code === 'success') {
                        _this.showObj.inWhName = res.data.obj.inWhName
                        _this.showObj.outWhName = res.data.obj.outWhName
                        _this.showObj.completeTime = res.data.obj.estimatedArrivalDate
                        let storeTwoOption = {
                            text: res.data.obj.inStoreName,
                            value: res.data.obj.inStoreCode
                        }
                        let storeOneOption = {
                            text: res.data.obj.outStoreName,
                            value: res.data.obj.outStoreCode
                        }
                        _this.$refs.areaqueryshopOne.setselect(storeOneOption)
                        _this.$refs.areaqueryshopTwo.setselect(storeTwoOption)
                        _this.showObj.shopState = true
                    }
                })
            }
        },
        created() {
            const _this = this
            // _this.tablelist = _this.allotinlist
        }
    }
</script>
<style scoped>

</style>

