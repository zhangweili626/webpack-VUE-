<template>
    <div>
        <b-card header="查询">
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="区域选择经销商" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshop" @select-change="selectedfun"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="批次号" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.cardMakeOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="卡号" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.cardNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="卡类型" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.cardTypeCode" :options="carStyleList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="使用类型" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.cardUseTypeCode" :options="userStyleList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="业务状态" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.cardStatus" :options="cardStatusList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="销售单" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.cardSalesOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="销售人" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.salesEmpName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="有效期类型" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryCondition.cardExpireType" :options="indateList"/>
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
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="客户姓名" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.customName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="客户手机号码" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryCondition.mobilePhone"/>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset">重置</b-button>
                        <b-button size="sm" variant="primary" @click="query(1)">查询</b-button>
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
                    <template slot="cardExpireType" slot-scope="data">
                        {{ data.item.cardExpireType === 0? '固定时长': '' }}
                        {{ data.item.cardExpireType === 1? '标定天数': '' }}
                        {{ data.item.cardExpireType === -1? '储值卡无有效期': '' }}
                    </template>
                    <template slot="cardNo" slot-scope="data">
                        <a href="javascript:;" @click="showDetail(data.item.cardNo)">{{ data.item.cardNo }}</a>
                    </template>
                    <template slot="cardStatus" slot-scope="data">
                        {{ data.item.cardStatus === 0? '未销售' : '' }}
                        {{ data.item.cardStatus === 1? '挂售中' : '' }}
                        {{ data.item.cardStatus === 2? '已销售' : '' }}
                        {{ data.item.cardStatus === 8? '退办中' : '' }}
                        {{ data.item.cardStatus === 9? '已退办' : '' }}
                        {{ data.item.cardStatus === -1? '已作废' : '' }}
                    </template>
                    <template slot="customNamStr" slot-scope="data">
                        {{ data.item.cardUseTypeName ? data.item.cardUseTypeName.substring(0,2) : '' }}
                    </template>
                    <template slot="cardAmout" slot-scope="data">
                        {{ data.item.cardAmout ? data.item.cardAmout.toFixed(2) : '0' }}
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
                    cardStatus: '',
                    cardExpireType: '',
                    startDate: '',
                    endDate: '',
                    salesEmpName: '',
                    cardSalesOrderNo: '',
                    cardUseTypeCode: '',
                    cardTypeCode: 'Metering',
                    cardNo: '',
                    cardMakeOrderNo: '',
                    storeCode: '',
                    storeCodes: [],
                    frozenState: '',
                    customName: '',
                    mobilePhone: ''
                },
                fields: {
                    index: {
                        label: '选择'
                    },
                    frozenState: {
                        label: '冻结状态'
                    },
                    cardStatus: {
                        label: '状态'
                    },
                    cardTypeName: {
                        label: '卡类型'
                    },
                    storeName: {
                        label: '门店'
                    },
                    cardNo: {
                        label: '卡号'
                    },
                    cardMakeOrderNo: {
                        label: '批次号'
                    },
                    cardName: {
                        label: '名称'
                    },
                    cardUseTypeName: {
                        label: '使用类型'
                    },
                    useNatureTypeName: {
                        label: '使用性质'
                    },
                    customName: {
                        label: '客户姓名'
                    },
                    mobilePhone: {
                        label: '客户手机号码'
                    },
                    customNamStr: {
                        label: '使用方'
                    },
                    cardExpireType: {
                        label: '有效期类型'
                    },
                    startDateStr: {
                        label: '开始时间'
                    },
                    endDateStr: {
                        label: '到期时间'
                    },
                    effectiveDays: {
                        label: '有效期天数'
                    },
                    cardAmout: {
                        label: '余额'
                    },
                    cardStatus: {
                        label: '业务状态'
                    },
                    cardSalesOrderNo: {
                        label: '销售单号'
                    },
                    salesEmpName: {
                        label: '销售人'
                    },
                    isAlreadyUsed: {
                        label: '使用状态'
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
            // 按钮级权限控制
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
                const _this = this
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
                        _this[arg2] = tempArr
                    }
                })
            },
            // 重置方法
            reset() {
                const _this = this
                _this.queryCondition = {
                    cardStatus: '',
                    cardExpireType: '',
                    startDate: '',
                    endDate: '',
                    salesEmpName: '',
                    cardSalesOrderNo: '',
                    cardUseTypeCode: '',
                    cardTypeCode: 'Metering',
                    cardNo: '',
                    cardMakeOrderNo: '',
                    storeCode: '',
                    storeCodes: [],
                    frozenState: '',
                    customName: '',
                    mobilePhone: ''
                }
                _this.indateTime = []
                _this.$refs.areaqueryshop.resetToStart()
            },
            // 查询
            query(arg) {
                const _this = this
                if(_this.indateTime.length > 0) {
                    let aTime = common.formattingTime(_this.indateTime)
                    _this.queryCondition.startDate = aTime.startTime === '1970-01-01' ? '' : aTime.startTime
                    _this.queryCondition.endDate = aTime.endTime === '1970-01-01' ? '' : aTime.endTime
                }
                if(_this.queryCondition.cardTypeCode === 'StoredValue') {
                    _this.queryCondition.storeCode = ''
                    _this.queryCondition.storeCodes = []
                    _this.fields = {
                        index: {
                            label: '选择'
                        },
                        frozenState: {
                            label: '冻结状态'
                        },
                        cardStatus: {
                            label: '状态'
                        },
                        cardTypeName: {
                            label: '卡类型'
                        },
                        storeName: {
                            label: '门店'
                        },
                        cardNo: {
                            label: '卡号'
                        },
                        cardMakeOrderNo: {
                            label: '批次号'
                        },
                        cardName: {
                            label: '名称'
                        },
                        cardUseTypeName: {
                            label: '使用类型'
                        },
                        useNatureTypeName: {
                            label: '使用性质'
                        },
                        customName: {
                            label: '客户姓名'
                        },
                        mobilePhone: {
                            label: '客户手机号码'
                        },
                        customNamStr: {
                            label: '使用方'
                        },
                        cardExpireType: {
                            label: '有效期类型'
                        },
                        startDateStr: {
                            label: '开始时间'
                        },
                        endDateStr: {
                            label: '到期时间'
                        },
                        effectiveDays: {
                            label: '有效期天数'
                        },
                        cardAmout: {
                            label: '余额'
                        },
                        cardStatus: {
                            label: '业务状态'
                        },
                        cardSalesOrderNo: {
                            label: '销售单号'
                        },
                        salesEmpName: {
                            label: '销售人'
                        },
                        isAlreadyUsed: {
                            label: '使用状态'
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
                }else {
                    _this.fields = {
                        index: {
                            label: '选择'
                        },
                        frozenState: {
                            label: '冻结状态'
                        },
                        cardStatus: {
                            label: '状态'
                        },
                        cardTypeName: {
                            label: '卡类型'
                        },
                        storeName: {
                            label: '门店'
                        },
                        cardNo: {
                            label: '卡号'
                        },
                        cardMakeOrderNo: {
                            label: '批次号'
                        },
                        cardName: {
                            label: '名称'
                        },
                        cardUseTypeName: {
                            label: '使用类型'
                        },
                        useNatureTypeName: {
                            label: '使用性质'
                        },
                        customName: {
                            label: '客户姓名'
                        },
                        mobilePhone: {
                            label: '客户手机号码'
                        },
                        customNamStr: {
                            label: '使用方'
                        },
                        cardExpireType: {
                            label: '有效期类型'
                        },
                        startDateStr: {
                            label: '开始时间'
                        },
                        endDateStr: {
                            label: '到期时间'
                        },
                        effectiveDays: {
                            label: '有效期天数'
                        },
                        cardAmout: {
                            label: '面值'
                        },
                        cardStatus: {
                            label: '业务状态'
                        },
                        cardSalesOrderNo: {
                            label: '销售单号'
                        },
                        salesEmpName: {
                            label: '销售人'
                        },
                        isAlreadyUsed: {
                            label: '使用状态'
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
                _this.queryCondition.pageNums = config.pageNums
                _this.queryCondition.pageStart = arg === 0 ? 1: arg
                // }
                
                api.cardSale.queryCardSaleInfo(_this.queryCondition, res => {
                    if(res.data.code === 'success') {
                        this.tablelist = res.data.obj.list
                        let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        _this.page = tempPage
                    }
                })
            },
            // 冻结/解冻操作
            operateItem() {
                const _this = this
                if(_this.selectItem.cardNo) {
                    _this.$router.push({
                        path: `operate/${_this.selectItem.cardNo + 'edit'}`
                    })
                }else {
                    Message({
                        type: 'warning',
                        message: '请选择需要操作的卡'
                    })
                    return
                }
            },
            // 换页
            pageChange(num) {
                const _this = this
                _this.query(num)
            },
            // 区域门店变更事件
            selectedfun(data1, data2) {
                const _this = this
                let judge = Array.isArray(data2)
                if(judge) {
                    // _this.queryCondition.storeCodes = data2
                    data2.forEach(element => {
                        if(element === '0') {
                            
                        }else {
                            _this.queryCondition.storeCodes.push(element)
                        }
                    })
                    _this.queryCondition.storeCode = ''
                }else {
                    _this.queryCondition.storeCodes = []
                    _this.queryCondition.storeCode = data2.value
                }
            }
        },
        created() {
            const _this = this
            // 数据初始化
            _this.cardStatusList = config.cardRelative.cardStatus
            _this.frozenStateList = config.cardRelative.frozenStatus
            _this.indateList = config.cardRelative.indateList
            _this.getDataDictionary(config.cardRelative.cardTypesRefCode, 'carStyleList')
            _this.getDataDictionary(config.cardRelative.cardUserTypeCode, 'userStyleList')
        }
    }
</script>
<style scoped>

</style>
