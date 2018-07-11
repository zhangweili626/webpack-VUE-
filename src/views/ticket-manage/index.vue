<template>
    <div>
        <b-card header="查询">
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="区域选择经销商" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshop" @select-change="selectedfun"  :storeAll='true'></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="批次号" label-text-align="right" :label-cols="4">
                        <b-form-input v-model.trim="queryCondition.couponMakeOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="券号" label-text-align="right" :label-cols="4">
                        <b-form-input v-model.trim="queryCondition.couponNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="使用类型" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.couponTypeCode" :options="carStyleList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="使用方" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.couponUseTypeCode" :options="userStyleList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="业务状态" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.couponStatus" :options="cardStatusList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="销售单" label-text-align="right" :label-cols="4">
                        <b-form-input v-model.trim="queryCondition.couponSalesOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="销售人" label-text-align="right" :label-cols="4">
                        <b-form-input v-model.trim="queryCondition.salesEmpName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="有效期类型" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.couponExpireType" :options="indateList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="有效期范围" label-text-align="right" :label-cols="4">
                        <el-date-picker
                            v-model="indateTime"
                            type="daterange"
                            @change="datechangeIn()"
                            :clearable="true"
                            :editable="false"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="冻结状态" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.frozenState" :options="frozenStateList"/>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset">重置</b-button>
                        <b-button size="sm" variant="primary" @click="query()">查询</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="primary" v-if="frozenCard" @click="operateItem">冻结/解冻</b-button>
                        <!-- <b-button size="sm" variant="danger" @click="frozenOrNot">作废</b-button> -->
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="tablelist" :fields="fields">
                    <template slot="index" slot-scope="data">
                        <div>
                            <input type="radio" :value="data.item" v-model="selectItem" />
                        </div>
                    </template>
                    <template slot="frozenState" slot-scope="data">
                        {{ data.item.frozenState === 0 ? '未冻结' : '' }}
                        {{ data.item.frozenState === 1 ? '已冻结' : '' }}
                    </template>
                    <template slot="couponExpireType" slot-scope="data">
                        {{ data.item.couponExpireType === 0? '固定时长': '' }}
                        {{ data.item.couponExpireType === 1? '有效期限': '' }}
                    </template>
                    <template slot="couponNo" slot-scope="data">
                        <a href="javascript:;" @click="showDetail(data.item.couponNo)">{{ data.item.couponNo }}</a>
                    </template>
                    <template slot="couponStatus" slot-scope="data">
                        {{ data.item.couponStatus === 0? '未销售' : '' }}
                        {{ data.item.couponStatus === 1? '挂售中' : '' }}
                        {{ data.item.couponStatus === 2? '已销售' : '' }}
                        {{ data.item.couponStatus === 8? '退办中' : '' }}
                        {{ data.item.couponStatus === 9? '已退办' : '' }}
                        {{ data.item.couponStatus === -1? '已作废' : '' }}
                    </template>
                    <template slot="customNamStr" slot-scope="data">
                        {{ data.item.couponUseTypeName ? data.item.couponUseTypeName.substring(0,2) : '' }}
                    </template>
                    <template slot="couponAmout" slot-scope="data">
                        {{ data.item.couponAmout ? data.item.couponAmout.toFixed(2) : '0' }}
                    </template>
                    <template slot="isAlreadyUsed" slot-scope="data">
                        {{ data.item.isAlreadyUsed === 0 ? '未使用': '已使用' }}
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
    import pagination from 'components/pagination/pagination.vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import api from 'common/api.js'
    import common from 'common/common.js'
    import config from 'common/config.js'
    import {hasBtn} from 'common/api-common.js'
    import { MessageBox, Message, DatePicker } from 'element-ui'
    import collectionApi from 'common/api-collection'
  /*  import mock from '../../mock'*/
    Vue.use(DatePicker)
    export default {
        components: {
            pagination,
            areaqueryshop
        },
        data() {
            return {
                selectItem: {},
                indateTime: [],
                indateList: [],
                cardStatusList: [],
                carStyleList: [],
                userStyleList: [],
                frozenStateList: [],
                tablelist: [],
                page: {

                },
                queryCondition: {
                    couponStatus: '',
                    couponExpireType: '',
                    startDate: '',
                    endDate: '',
                    salesEmpName: '',
                    couponSalesOrderNo: '',
                    couponUseTypeCode: '',
                    couponTypeCode: '',
                    couponNo: '',
                    couponMakeOrderNo: '',
                    storeCode: '',
                    storeCodes: [],
                    frozenState: ''
                },
                fields: {
                    index: {
                        label: '选择'
                    },
                    frozenState: {
                        label: '冻结状态'
                    },
                    couponTypeName: {
                        label: '使用类型'
                    },
                    storeName: {
                        label: '门店'
                    },
                    couponNo: {
                        label: '券号'
                    },
                    couponMakeOrderNo: {
                        label: '批次号'
                    },
                    couponName: {
                        label: '名称'
                    },
                    couponUseTypeName: {
                        label: '使用方'
                    },
                    useNatureTypeName: {
                        label: '使用性质'
                    },
                   
                    couponExpireType: {
                        label: '有效期类型'
                    },
                    startDateStr: {
                        label: '起始时间'
                    },
                    endDateStr: {
                        label: '到期时间'
                    },
                    effectiveDays: {
                        label: '有效期天数'
                    },
                   /* couponAmout: {
                        label: '售价'
                    },*/
                    couponStatus: {
                        label: '业务状态'
                    },
                    couponSalesOrderNo: {
                        label: '销售单号'
                    },
                    salesEmpName: {
                        label: '销售人'
                    },
                    isAlreadyUsed: {
                        label: '使用状态'
                    },
                    customName: {
                        label: '客户姓名'
                    },
                    plateNumber: {
                        label: '车牌'
                    },
                    factoryName: {
                        label: '厂家'
                    },
                    brandName: {
                        label: '品牌'
                    },
                    seriesName: {
                        label: '车系'
                    },
                    modelName: {
                        label: '车型'
                    },
                    opvName: {
                        label: '排量'
                    },
                    iotypeName: {
                        label: '进气方式'
                    }
                }
            }
        },
        computed: {
            frozenCard(){
				return hasBtn(collectionApi.cardManage.frozenOrNot);
			}
        },
        methods: {
            // 跳转查看
            showDetail(arg) {
                const _this = this
                _this.$router.push({
                    path: `operate/${arg + 'show'}`
                })
            },
            // 时间选择方法
            datechangeIn() {

            },
            // 获取数据字典项
            getDataDictionary(arg1, arg2) {
                let option = {
                    refCode: arg1
                }
                api.ref.getDataDictionarys(option, res => {
                    if(res.data.code === 'success') {
                        let arr = res.data.obj.referenceDetailInfos
                        let tempArr = []
                        if(arg2 === 'userStyleList') {
                            tempArr.push({
                                text: '',
                                value: ''
                            })
                        }
                        arr.forEach(element => {
                            let obj = {}
                            obj.text = element.refDetailName
                            obj.value = element.refDetailCode
                            tempArr.push(obj)
                        })
                        this[arg2] = tempArr
                    }
                })
            },
            // 重置方法
            reset() {
                this.queryCondition = {
                    couponStatus: '',
                    couponExpireType: '',
                    startDate: '',
                    endDate: '',
                    salesEmpName: '',
                    couponSalesOrderNo: '',
                    couponUseTypeCode: '',
                    couponTypeCode: '',
                    couponNo: '',
                    couponMakeOrderNo: '',
                    storeCode: '',
                    storeCodes: [],
                    frozenState: ''
                }
                this.indateTime = []
                this.$refs.areaqueryshop.resetToStart()
            },
            // 查询
            query(arg = 1) {
            	const _this = this
                if(this.indateTime.length > 0) {
                    let aTime = common.formattingTime(this.indateTime)
                    this.queryCondition.startDate = aTime.startTime
                    this.queryCondition.endDate = aTime.endTime
                }
                if(this.queryCondition.startDate == '1970-01-01'){this.queryCondition.startDate = ''}
                if(this.queryCondition.startDate == '1970-01-01'){this.queryCondition.endDate = ''}
                this.queryCondition.pageNums = config.pageNums
                this.queryCondition.pageStart = arg === 0 ? 1: arg
               api.ticketManage.queryTableList(this.queryCondition, res => {
                    if(res.data.code === 'success') {
                        this.tablelist = res.data.obj.list
                        let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        this.page = tempPage
                    }
                })
            },
            //冻结解冻
            operateItem() {
                if(this.selectItem.couponNo) {
                    this.$router.push({
                        path: `operate/${this.selectItem.couponNo + 'edit'}`
                    })
                }else {
                    Message({
                        type: 'warning',
                        message: '请选择需要操作的券'
                    })
                    return
                }
            },
            // 换页
            pageChange(num) {
                this.query(num)
            },
            // 区域门店变更事件
         /*   selectedfun(data1, data2) {
                let judge = Array.isArray(data2)
                if(judge) {
                    // _this.queryCondition.storeCodes = data2
                    data2.forEach(element => {
                        if(element === '0') {
                            
                        }else {
                            this.queryCondition.storeCodes.push(element)
                        }
                    })
                    this.queryCondition.storeCode = ''
                }else {
                    this.queryCondition.storeCodes = []
                    this.queryCondition.storeCode = data2.value
                }
            },*/
            selectedfun(data, data1) {
            	console.log(data)
            	console.log(data1)
                const _this = this;
                if(data1 instanceof Array){
                    _this.queryCondition.storeCodes = []
                    for (let i = 0; i < data1.length; i++) {
                        _this.$set(_this.queryCondition.storeCodes, i, data1[i].value)              
                    }
                }else{
                    _this.queryCondition.storeCodes = [data1.value]
                }
            },
        },
        created() {
            this.cardStatusList = config.cardRelative.cardStatus
            this.frozenStateList = config.cardRelative.frozenStatus
            this.indateList = config.cardRelative.couponIndateList
            this.getDataDictionary('CouponType', 'carStyleList')
            this.getDataDictionary(config.cardRelative.couponUserTypeCode, 'userStyleList')
        }
    }
</script>
<style scoped>

</style>
