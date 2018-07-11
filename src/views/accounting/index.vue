<template>
    <div>
        <b-card header="查询">
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="门店" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshop" :storeAll="true" @select-change="selectedfun"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="起止时间" label-text-align="right" :label-cols="4">
                        <el-date-picker
                            v-model="timeStep"
                            type="daterange"
                            @change="datechange()"
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
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="账期状态" label-text-align="right" :label-cols="4">
                        <b-form-select :options="accountList" v-model="option.accountStatus"></b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset">重置</b-button>
                        <b-button size="sm" variant="primary" @click="query">查询</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card>
            <!-- <div slot="header">
                <strong>账期账务列表</strong>
            </div> -->
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="primary" v-if="closeBtn" @click="edit">编辑</b-button>
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="accountTablelist" :fields="fields">
                    <template slot="index" slot-scope="data">
                        <div @click="setIndex(data.item.accountCode)">
                            <input type="radio" name="radio" />
                        </div>
                    </template>
                    <!-- <template slot="workFlow" scope="data">
                        {{ data.item.wfName }}
                    </template> -->
                    <template slot="planCode" slot-scope="data">
                        <!-- <a href="javascript:;" @click.prevent="showDetail(data.item.inventoryPlanNo)">{{ data.item.inventoryPlanNo }}</a> -->
                        {{ data.item.accountCode }}
                    </template>
                    <template slot="planName" slot-scope="data">
                        {{ data.item.storeName }}
                    </template>
                    <template slot="style" slot-scope="data">
                        {{  data.item.beTermNo }}
                    </template>
                    <template slot="planTime" slot-scope="data">
                        {{ data.item.accountStartDateStr }}
                    </template>
                    <template slot="storeName" slot-scope="data">
                        {{ data.item.accountEndDateStr }}
                    </template>
                    <template slot="supplyName" slot-scope="data">
                        {{ data.item.accountStatus === 1 ? '已关账' : (data.item.accountStatus === 0 ? '未关账' : '逾期未操作') }}
                    </template>
                    <template slot="planStyle" slot-scope="data">
                        {{ data.item.closedEmpName }}
                    </template>
                    <template slot="status" slot-scope="data">
                        {{ data.item.closedTimeStr }}
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
    import {mapState, mapMutations, mapActions} from 'vuex'
    import config from 'common/config.js'
    import api from 'common/api.js'
    import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import pagination from 'components/pagination/pagination.vue'
    import { MessageBox, Message, DatePicker } from 'element-ui'
    Vue.use(DatePicker)
    export default {
        components: {
            areaqueryshop,
            pagination
        },
        data() {
            return {
                timeStep: '',
                accountList: [],
                tablelist: [],
                editCode: '',
                pageNo: 1,
                pageSize: 1,
                totalResult: 0,
                totalPages: 0,
                option: {
                    accountStartDate: '',
                    accountEndDate: '',
                    accountStatus: '',
                    areaCode: [],
                    storeCode: '',
                    storeCodeList: null,
                    pageNums: config.pageNums,
                    pageStart: 1
                },
                fields: {
                    index: {
                        label: ' '
                    },
                    // workFlow: {
                    //     label: '工作流名称'
                    // },
                    planCode: {
                        label: '业务编码'
                    },
                    planName: {
                        label: '门店'
                    },
                    style: {
                        label: '账期'
                    },
                    planTime: {
                        label: '账期开始日期'
                    },
                    storeName: {
                        label: '账期结束日期'
                    },
                    supplyName: {
                        label: '账期状态'
                    },
                    planStyle: {
                        label: '关账操作人'
                    },
                    status: {
                        label: '关账操作时间'
                    }
                },
            }
        },
        computed: {
            closeBtn() {
                return hasBtn(collectionApi.accounting.editState)
            },
			...mapState('accounting', [
                'page',
                'accountTablelist'
			])
			
		},
        methods: {
            ...mapActions('accounting',[
                'setPageIndex',
                'setTableList'
            ]),
            // 重置
            reset() {
                const _this = this
                _this.option= {
                    accountStartDate: '',
                    accountEndDate: '',
                    accountStatus: '',
                    areaCode: [],
                    storeCode: '',
                    storeCodeList: null,
                    pageNums: config.pageNums,
                    pageStart: 1
                }
                _this.$refs.areaqueryshop.reset()
                _this.$refs.areaqueryshop.resetToStart()
            },
            datechange() {
                const _this = this
                let startDate = new Date(_this.timeStep[0])
                let endDate = new Date(_this.timeStep[1])
                let startYear = startDate.getFullYear()
                let startMonth = startDate.getMonth() + 1
                let startDay = startDate.getDate()

                let endYear = endDate.getFullYear()
                let endMonth = endDate.getMonth() + 1
                let endDay = endDate.getDate()
                
                let startTime = startYear + '-' + (startMonth > 9 ? startMonth : ('0' + startMonth)) + '-' + (startDay > 9 ? startDay : ('0' + startDay))
                let endTime = endYear + '-' + (endMonth > 9 ? endMonth : ('0' + endMonth)) + '-' + (endDay > 9 ? endDay : ('0' + endDay))
                _this.option.accountStartDate = startTime
                _this.option.accountEndDate = endTime
            },
            edit() {
                const _this = this
                if(_this.editCode === '') {
                    Message({
                        type: 'info', 
                        message: '请选择编辑项'
                    })
                }else {
                    _this.$router.push({
                        path: `/accounting/edit/${_this.editCode}`
                    })
                }
            },
            query() {
                const _this = this
                api.accounting.query(_this.option, (res) => {
                    if(res.data.code === 'success') {
                        _this.setTableList(res.data.obj.list)
                        let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        _this.setPageIndex(tempPage)
                    }
                })
            },
            setIndex(code) {
                const _this = this
                _this.editCode = code
            },
            pageChange(num) {
                const _this = this
                _this.setPageIndex(num)
                _this.option.pageStart = num
                _this.query()
            },
            selectedfun(data,data1){
				const _this = this
                let judgeArray = data1 instanceof Array
                if(judgeArray) {
                    _this.option.storeCodeList = []
                    for(let i = 0; i < data1.length; i++) {
                        _this.option.storeCodeList.push(data1[i].value)
                    }
                }else {
                    _this.option.storeCodeList = []
                    _this.option.storeCodeList.push(data1.value)
                }
                console.log(_this.option.storeCodeList)
			},
        },
        created() {
            const _this = this
            _this.accountList = config.account.list
            // _this.option.pageStart = _this.page
        }
    }
</script>
<style scoped>
    /* .el-icon-close::before {
        display: none !important;
    }
    .el-icon-date::before {
        display: none !important;
    } */
</style>

