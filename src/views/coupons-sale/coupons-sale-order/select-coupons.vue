<template>
    <el-dialog ref="dialog" 
        title="券查询" 
        no-close-on-backdrop 
        size="large" 
        :visible.sync="dialogInvoive" 
        :modal-append-to-body="false"
    >
    <div class="row select-coupon">
        <div class="col-md-12">
            <b-card header="查询">
                <div class="row">
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="销售区域" label-text-align="right" :label-cols="4">
                            <areaqueryshop ref="areaqueryshop" :storeAll="true" @select-change="selectedfun" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="券使用方" label-text-align="right" :label-cols="4">
                            <b-form-select v-model="queryCondition.couponUseTypeCode" :options="couponsTypes"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="券使用性质" label-text-align="right" :label-cols="4">
                            <b-form-select v-model="queryCondition.useNatureTypeCode" :options="isDedicated"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="有效期类型" label-text-align="right" :label-cols="4">
                            <b-form-select v-model="queryCondition.couponExpireType" :options="indateTypes"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="券号" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="queryCondition.couponNo" placeholder="" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6 col-lg-6">
                        <b-form-fieldset horizontal label="券名称" label-text-align="right" :label-cols="4">
                            <b-form-input v-model="queryCondition.couponName" placeholder="" />
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="pull-right">
                            <b-button size="sm" variant="" @click="reset">重置</b-button>
                            <b-button size="sm" variant="primary" @click="query(1)">查询</b-button>
                        </div>
                    </div>
                </div>
            </b-card>
            <!-- <b-card> -->
                <div class="table-scrollable">
                    <b-table striped hover bordered show-empty :items="couponInfo.list" :fields="fields">
                        <template slot="index" slot-scope="data">
                            <el-checkbox 
                                v-model="couponInfo.list[data.index].check" 
                                @change="selectCoupon(data.item, couponInfo.list[data.index].check)" 
                            />
                        </template>
                        <template slot="couponExpireType" slot-scope="data">
                            {{ data.item.couponExpireType === 1 ? '标定结束日期': '' }}
                            {{ data.item.couponExpireType === 0 ? '固定时长': '' }}
                            {{ data.item.couponExpireType === -1 ? '储值卡无有效期': '' }}
                        </template>
                        <template slot="applyToStores" slot-scope="data">
                            {{  data.item.applyToStores ? data.item.applyToStores.replace(/¥P1¥/g,'现有所有门店') : ''}}
                        </template>
                        <template slot="empty">
                            暂无数据...
                        </template>
                    </b-table>
                </div>
                <div class="row mt-2">
                    <div class="col-md-12">
                        <pagination class="pull-right" 
                            @page-change="pageChange" 
                            :page-no="couponInfo.pageNum" 
                            :page-size="couponInfo.pageNums" 
                            :total-result="couponInfo.total" 
                            :total-pages="couponInfo.pages">
                        </pagination>
                    </div>
                </div>
            <!-- </b-card> -->
            <b-card v-if="couponList.length">
                <div class="row">
                    <div class="col-md-12">
                        <div class="pull-left">
                            <b-button size="sm" variant="danger" @click="deleteCoupon">删除</b-button>
                        </div>
                        <div class="tip">*已选中券的销售金额合计：<span>{{totalPrice}}</span>元</div>
                    </div>
                </div>
                <div class="seleted-coupon">
                    <div class="row">
                        <div 
                            class="col-md-6"
                            v-for="item in couponList"
                            :key="item.couponNo"
                        >
                            <el-checkbox v-model="item.selected">
                                {{`${item.couponName}-${item.couponNo}（${item.couponPrice}元）`}}
                            </el-checkbox>
                        </div>
                    </div>
                </div>
                <div class="btn-wrap">
                    <b-button size="sm" variant="success" @click="commit">选择</b-button>
                </div>
            </b-card>
        </div>
    </div>
    </el-dialog>
</template>
<script>
    
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import config from 'common/config'
    import api from 'common/api'
    import { getSequence } from 'common/api-common'
    import { CARD_SALE_SORDER_SEQ } from 'common/sequence'
    import { COUPON_USER_TYPE } from 'common/ref-code'
    import Pagination from 'components/pagination/pagination.vue'
    import { MessageBox, Message, Dialog, Checkbox } from 'element-ui'
    import common from 'common/common'
    import { mapActions, mapGetters } from 'vuex'
    import Vue from 'vue'
    
    Vue.use(Dialog)
    Vue.use(Checkbox)

    export default {
        data() {
            return {
                couponInfo: {
                    list: []
                },
                isDedicated: [],
                couponsTypes: [],
                indateTypes: [
                    {
                        text: '全部',
                        value: null
                    },
                    {
                        text: '固定时长',
                        value: 0
                    },
                    {
                        text: '有效期限',
                        value: 1
                    }
                ],
                queryCondition: {
                    couponUseTypeCode: '',
                    couponNo: '',
                    useNatureTypeCode: '',
                    couponExpireType: '',
                    couponName: '',
                    storeCode: '',
                    storeCodes: [],

                },
                fields: {
                    index: {
                        label: '选择'
                    },
                    couponNo: {
                        label: '券号'
                    },
                    couponName: {
                        label: '券名称'
                    },
                    couponUseTypeName: {
                        label: '券使用方'
                    },
                    channelType: {
                        label: '渠道'
                    },
                    storeName: {
                        label: '所属门店'
                    },
                    couponPrice: {
                        label: '销售金额'
                    },
                    couponExpireType: {
                        label: '券有效期'
                    },
                    useNatureTypeName: {
                        label: '使用性质'
                    },
                    applyToStores: {
                        label: '适用门店范围'
                    }
                },
                
                // 已选择的卡券
                couponList: [], 
                totalPrice: 0, // 合计金额

                dialogInvoive: false,
                couponStoreInfo: {},
            }
        },
        props: ['selectedList'],
        mounted() {
            window.vue = this
        },
        created() {
            this.getUseTypes()
            this.getCouponsTypes()
        },
        watch: {
            selectedList(val) {
                this.couponList = val
                // this.deleteCoupon()
            }
        },
        methods: {
            
            // 显示弹窗
            show() {
                this.dialogInvoive = true
            },

            // 查询
            query(arg) {
                
                this.queryCondition.pageNums = 10
                this.queryCondition.pageStart = arg
                this.queryCondition.couponStatus = 0
                this.queryCondition.frozenState = 0
                this.queryCondition.couponNo = common.removeBlank(this.queryCondition.couponNo)
                this.queryCondition.couponName = common.removeBlank(this.queryCondition.couponName)
                
                api.coupon.queryCouponPriceInfo(this.queryCondition, res => {
                    let obj = res.data.obj
                    if (res.data.code === 'success' && obj) {
                        this.couponInfo = obj
                        this.couponInfo.list.forEach(item => {
                            item.check = false
                        })
                        this.isSelected()
                    }
                })
            },

            // 重置
            reset() {
                this.queryCondition = {
                    couponTypeCode: '',
                    couponNo: '',
                    isDesignatedStore: '',
                    couponExpireType: '',
                    couponName: '',
                    storeCode: '',
                    storeCodes: [],
                    frozenState: 0,
                    couponStatus: 0
                }
                this.$refs.areaqueryshop.resetToStart()
            },

            // 换页
            pageChange(num) {
                this.query(num)
            },

            // 选择卡券
            selectCoupon(data, check) {
                if (check) {
                    const Vo = { ...data, selected: false }
                    this.couponList.push(Vo)
                    this.totalPrice += data.couponPrice
                } else {
                    this.totalPrice = 0
                    this.couponList = this.couponList.filter(item => item.couponNo != data.couponNo)
                    this.couponList.map(item => { this.totalPrice += item.couponPrice })
                }
            },

            // 删除卡券
            deleteCoupon() {

                const canDelete = this.couponList.every(item => {
                    return item.selected == false
                })
                
                if (canDelete) {
                    Message({
                        type: 'warning',
                        message: '请选择需要删除的券'
                    })
                    return
                } 

                this.totalPrice = 0
                this.couponList = this.couponList.filter(item => !item.selected)
                this.couponList.map(item => { this.totalPrice += item.couponPrice })
                this.isSelected()
            },
            
            // 切换分页 && 删除卡券的时候 去除 table 中相应的勾选
            isSelected() {
                this.couponInfo.list.forEach(dataItem => {
                    dataItem.check = false
                    this.couponList.map(item => {
                        if(item.couponNo == dataItem.couponNo) dataItem.check = true
                    })
                })
            },

            // 点击选择
            commit() {
                this.$emit('select', this.couponList, this.couponStoreInfo)
                this.dialogInvoive = false
            },

            // 选择 功能暂时未用到
            chooseItem() {
                if (this.selectItem.couponNo) {
                    let cardParams = {
                        couponNo: this.selectItem.couponNo,
                        next: (res) => {
                            let obj = res.data.obj
                            if (obj.cardStatus == 0 && obj.frozenState == 0) {
                                getSequence(CARD_SALE_SORDER_SEQ, res => {
                                    this.$router.push({
                                        path: 'insert',
                                        query: {
                                            pageState: 0,
                                            couponNo: this.selectItem.couponNo,
                                            couponName: this.selectItem.couponName,
                                            cardSalesOrderNo: res
                                        }
                                    })
                                })
                            } else if (obj.cardStatus == -1) {
                                Message({
                                    type: 'warning',
                                    message: '此卡已作废, 不可销售'
                                })
                                return 
                            } else if (obj.frozenState == 1) {
                                Message({
                                    type: 'warning',
                                    message: '此卡已冻结, 不可销售'
                                })
                                return
                            }
                        }
                    }
                    this.getCardInfoByCode(cardParams)
                } else {
                    Message({
                        type: 'warning',
                        message: '请选择要销售的卡'
                    })
                } 
            },

            // 区域选择经销商店选择事件
            selectedfun(dataOne, dataTwo) {
                this.couponStoreInfo = {
                    salesName: dataOne.name,
                    salesCode: dataOne.code,
                    storeName: dataTwo.text,
                    storeCode: dataTwo.value,                    
                }
                const _this = this
                let judge = Array.isArray(dataTwo)
                if (judge) {
                    _this.queryCondition.storeCodes = []
                    dataTwo.forEach(element => {
                        if (element.value) {
                            _this.queryCondition.storeCodes.push(element.value)
                        }
                    })
                    _this.queryCondition.storeCode = ''
                } else {
                    _this.queryCondition.storeCodes = []
                    _this.queryCondition.storeCode = dataTwo.value
                }
            },

            // 从数据字段获取卡类型数据
            getCouponsTypes() {

                let option = { refCode: COUPON_USER_TYPE }
                
                api.ref.getDataDictionarys(option, res => {
                    if (res.data.code === 'success') {
                        
                        let tempObj = { text: '全部', value: null }
                        this.couponsTypes.push(tempObj)
                        let tempArr = res.data.obj.referenceDetailInfos
                        
                        for (let i = 0; i<tempArr.length; i++) {
                            let obj = {}
                            obj.text = tempArr[i].refDetailName
                            obj.value = tempArr[i].refDetailCode
                            this.couponsTypes.push(obj)
                        }
                    }
                })
            },

            // 从数据字典获取使用性质
            getUseTypes() {
                
                const _this = this
                let option = { refCode: config.cardRelative.userPropertyCode }
                
                api.ref.getDataDictionarys(option, res => {
                    if(res.data.code === 'success') {
                        
                        let tempObj = { text: '全部', value: null }
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
                
                let option = { refCode: config.cardRelative.indateRefCode }
                
                api.ref.getDataDictionarys(option, res => {
                    if(res.data.code === 'success') {
                        
                        let tempObj = { text: '', value: '' }
                        this.indateTypes.push(tempObj)
                        let tempArr = res.data.obj.referenceDetailInfos
                        
                        for(let i = 0; i<tempArr.length; i++) {
                            let obj = {}
                            obj.text = tempArr[i].refDetailName
                            obj.value = tempArr[i].refDetailCode
                            this.indateTypes.push(obj)
                        }
                    }
                })
            },

            ...mapActions('storeStation', [
                'getCardInfoByCode',
            ])
        },
        components: {
            areaqueryshop,
            Pagination
        },
    }
</script>
<style lang="scss" scoped>
    .seleted-coupon {
        box-sizing: border-box;
        margin: 20px 0 30px;
        padding: 0 15px;
        border: 1px solid #c2cfd6;
        .col-md-6 {
            height: 46px;
            line-height: 46px;
            .el-checkbox {
                margin-right: 10px;
            }
        }
    }
    .btn-wrap {
        text-align: center
    }
    .tip {
        float: left;
        margin-left: 10px;
        line-height: 32px;
        span {
            color: #ff2b05;
        }
    }
</style>
