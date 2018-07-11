<template>
<el-dialog ref="dialog" 
    title="卡查询" 
    no-close-on-backdrop 
    size="large"  :visible.sync="dialogInvoive" :modal-append-to-body="false">
    <b-card header="查询">
        <div class="row">
            <div class="col-md-6 col-lg-6">
                <b-form-fieldset horizontal label="销售区域" label-text-align="right" :label-cols="4">
                    <areaqueryshop ref="areaqueryshop" :storeAll="true" @select-change="selectedfun"></areaqueryshop>
                </b-form-fieldset>
            </div>
            <div class="col-md-6 col-lg-6">
                <b-form-fieldset horizontal label="卡使用方" label-text-align="right" :label-cols="4">
                    <b-form-select v-model="queryCondition.cardUseTypeCode" :options="cardTypes"/>
                </b-form-fieldset>
            </div>
            <div class="col-md-6 col-lg-6">
                <b-form-fieldset horizontal label="卡号" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="queryCondition.cardNo" placeholder="" />
                </b-form-fieldset>
            </div>
            <div class="col-md-6 col-lg-6">
                <b-form-fieldset horizontal label="是否专店专用" label-text-align="right" :label-cols="4">
                    <b-form-select v-model="queryCondition.useNatureTypeCode" :options="isDedicated"/>
                </b-form-fieldset>
            </div>
            <div class="col-md-6 col-lg-6">
                <b-form-fieldset horizontal label="有效期类型" label-text-align="right" :label-cols="4">
                    <b-form-select v-model="queryCondition.cardExpireType" :options="indateTypes"/>
                </b-form-fieldset>
            </div>
            <div class="col-md-6 col-lg-6">
                <b-form-fieldset horizontal label="卡名称" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="queryCondition.cardName" placeholder="" />
                </b-form-fieldset>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="pull-right">
                    <b-button size="sm" variant="" @click="reset">重置</b-button>
                    <!-- <b-button size="sm" variant="danger" @click="deleteItem">作废</b-button> -->
                    <b-button size="sm" variant="primary" @click="query(1)">查询</b-button>
                </div>
            </div>
        </div>
    </b-card>
    <b-card>
        <div class="row">
            <div class="col-md-12">
                <div class="pull-left">
                    <b-button size="sm" variant="success" @click="chooseItem">选择</b-button>
                </div>
            </div>
        </div>
        <div class="table-scrollable">
            <b-table striped hover bordered show-empty :items="tablelist" :fields="fields">
                <template slot="index" slot-scope="data">
                    <div @click="setSign(data.item)">
                        <input type="radio" name="radio" />
                    </div>
                </template>
                <template slot="cardExpireType" slot-scope="data">
                    {{ data.item.cardExpireType === 1 ? '标定结束日期': '' }}
                    {{ data.item.cardExpireType === 0 ? '固定时长': '' }}
                    {{ data.item.cardExpireType === -1 ? '储值卡无有效期': '' }}
                </template>
                <template slot="applyToStores" slot-scope="data">
                    {{  data.item.applyToStores ? data.item.applyToStores.replace(/¥P1¥/g,'现有所有门店') : ''}}
                </template>
                <template slot="empty">
                        暂无数据...
                </template>
            </b-table>
        </div>
        <!-- <div class="row mt-2">
            <div class="col-md-12">
                <pagination class="pull-right" @page-change="pageChange" :page-no="page.pageNo" :page-size="page.pageSize" :total-result="page.totalResult" :total-pages="page.totalPages">
                </pagination>
            </div>
        </div> -->
    </b-card>
</el-dialog>
</template>
<script>
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import config from 'common/config'
    import api from 'common/api'
    import { getSequence } from 'common/api-common'
    import { CARD_SALE_SORDER_SEQ } from 'common/sequence'
    import pagination from 'components/pagination/pagination.vue'
    import { MessageBox, Message, Dialog } from 'element-ui'
    import common from 'common/common'

    import { mapActions, mapGetters } from 'vuex'
    import Vue from 'vue'
    Vue.use(Dialog)

    export default {
        components: {
            areaqueryshop,
            pagination
        },
        data() {
            return {
                page: {

                },
                tablelist: [],
                isDedicated: [],
                cardTypes: [],
                indateTypes: [
                    {
                        text: '',
                        value: ''
                    },
                    {
                        text: '固定时长',
                        value: 0
                    },
                    {
                        text: '标定结束日期',
                        value: 1
                    }
                ],
                queryCondition: {
                    cardUseTypeCode: '',
                    cardNo: '',
                    useNatureTypeCode: '',
                    cardExpireType: '',
                    cardName: '',
                    storeCode: '',
                    storeCodes: []
                },
                fields: {
                    index: {
                        label: '选择'
                    },
                    cardNo: {
                        label: '卡号'
                    },
                    cardName: {
                        label: '卡名称'
                    },
                    cardUseTypeName: {
                        label: '卡使用方'
                    },
                    cardExpireType: {
                        label: '卡有效期'
                    },
                    useNatureTypeName: {
                        label: '使用性质'
                    },
                    channelType: {
                        label: '渠道'
                    },
                    applyToStores: {
                        label: '适用门店范围'
                    }
                },
                selectItem: {},

                dialogInvoive: false
            }
        },
        methods: {
            show() {
                this.dialogInvoive = true
            },
            // 查询
            query(arg) {
                const _this = this
                _this.queryCondition.pageNums = 10
                _this.queryCondition.pageStart = arg
                _this.queryCondition.cardStatus = 0
                _this.queryCondition.cardNo = common.removeBlank(_this.queryCondition.cardNo)
                _this.queryCondition.cardName = common.removeBlank(_this.queryCondition.cardName)
                api.cardSale.queryCardInfo(_this.queryCondition, res => {
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
            // 换页
            pageChange(num) {
                const _this = this
                _this.query(num)
            },
            // 重置
            reset() {
                const _this = this
                _this.queryCondition = {
                    cardTypeCode: '',
                    cardNo: '',
                    isDesignatedStore: '',
                    cardExpireType: '',
                    cardName: '',
                    storeCode: '',
                    storeCodes: []
                }
                _this.$refs.areaqueryshop.resetToStart()
            },
            // 选择
            chooseItem() {
                if(this.selectItem.cardNo) {
                    let cardParams = {
                        cardNo: this.selectItem.cardNo,
                        next: (res) => {
                            let obj = res.data.obj
                            if(obj.cardStatus == 0 && obj.frozenState == 0) {
                                getSequence(CARD_SALE_SORDER_SEQ, res => {
                                    this.$router.push({
                                        path: 'insert',
                                        query: {
                                            pageState: 0,
                                            cardNo: this.selectItem.cardNo,
                                            cardName: this.selectItem.cardName,
                                            cardSalesOrderNo: res
                                        }
                                    })
                                })
                            }else if(obj.cardStatus == -1) {
                                Message({
                                    type: 'warning',
                                    message: '此卡已作废, 不可销售'
                                })
                                return 
                            }else if(obj.frozenState == 1) {
                                Message({
                                    type: 'warning',
                                    message: '此卡已冻结, 不可销售'
                                })
                                return
                            }
                        }
                    }
                    this.getCardInfoByCode(cardParams)
                }else {
                    Message({
                        type: 'warning',
                        message: '请选择要销售的卡'
                    })
                } 
            },
            setSign(item) {
                this.selectItem = item
            },
            // 区域选择经销商店选择事件
            selectedfun(dataOne, dataTwo) {
                const _this = this
                // console.log(dataOne)
                // console.log(dataTwo)
                let judge = Array.isArray(dataTwo)
                if(judge) {
                    _this.queryCondition.storeCodes = []
                    dataTwo.forEach(element => {
                        if(element.value) {
                            _this.queryCondition.storeCodes.push(element.value)
                        }
                    })
                    _this.queryCondition.storeCode = ''
                }else {
                    _this.queryCondition.storeCodes = []
                    _this.queryCondition.storeCode = dataTwo.value
                }
            },
            // 从数据字段获取卡类型数据
            getCardTypes() {
                const _this = this
                let option = {
                    refCode: config.cardRelative.cardUserTypeCode
                }
                api.ref.getDataDictionarys(option, (res) => {
                    if(res.data.code === 'success') {
                        let tempObj = {
                            text: '',
                            value: ''
                        }
                        _this.cardTypes.push(tempObj)
                        let tempArr = res.data.obj.referenceDetailInfos
                        for(let i = 0; i<tempArr.length; i++) {
                            let obj = {}
                            obj.text = tempArr[i].refDetailName
                            obj.value = tempArr[i].refDetailCode
                            _this.cardTypes.push(obj)
                        }
                    }
                })
            },
            // 从数据字典获取使用性质
            getUseTypes() {
                const _this = this
                let option = {
                    refCode: config.cardRelative.userPropertyCode
                }
                api.ref.getDataDictionarys(option, (res) => {
                    if(res.data.code === 'success') {
                        let tempObj = {
                            text: '',
                            value: ''
                        }
                        _this.isDedicated.push(tempObj)
                        let tempArr = res.data.obj.referenceDetailInfos
                        for(let i = 0; i<tempArr.length; i++) {
                            let obj = {}
                            obj.text = tempArr[i].refDetailName
                            obj.value = tempArr[i].refDetailCode
                            _this.isDedicated.push(obj)
                        }
                    }
                })
            },
            // 从数据字典获取有效期类型
            getTndates() {
                const _this = this
                let option = {
                    refCode: config.cardRelative.indateRefCode
                }
                api.ref.getDataDictionarys(option, (res) => {
                    if(res.data.code === 'success') {
                        let tempObj = {
                            text: '',
                            value: ''
                        }
                        _this.indateTypes.push(tempObj)
                        let tempArr = res.data.obj.referenceDetailInfos
                        for(let i = 0; i<tempArr.length; i++) {
                            let obj = {}
                            obj.text = tempArr[i].refDetailName
                            obj.value = tempArr[i].refDetailCode
                            _this.indateTypes.push(obj)
                        }
                    }
                })
            },
            ...mapActions('storeStation', [
                'getCardInfoByCode',
            ])
        },
        created() {
            const _this = this
            _this.getUseTypes()
            _this.getCardTypes()
        }
    }
</script>
<style scoped>

</style>

