<template>
    <div>
        <b-card>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <!-- <b-form-fieldset horizontal label="制卡批次号" label-text-align="right" :label-cols="4">
                        00001
                    </b-form-fieldset> -->
                    <div>
                        卡号: {{ cardInfo.cardNo }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名称: {{ cardInfo.cardName }}
                    </div>
                </div>
                <div class="col-md-6 col-lg-6">
                    <div class="pull-right my-self-warnig-kuang">
                        <b-button v-if="hasFrozen&&!hasCanceled&&!justShow" size="sm" variant="primary" @click="openFrozen">解冻</b-button>
                        <b-button v-if="!hasFrozen&&!hasCanceled&&!justShow" size="sm" variant="primary" @click="frozenModel">冻结</b-button>
                        <b-button v-if="hasFrozen&&!hasCanceled&&!justShow&&!isStoreValueCard" size="sm" variant="danger" @click="showDeleteModel">作废</b-button>
                        <!-- <el-button type="primary" size="medium" @click="openFrozen">解冻</el-button>
                        <el-button type="primary" size="medium" @click="frozenModel">冻结</el-button>
                        <el-button type="danger" size="medium" @click="handleDestroy">作废</el-button> -->
                    </div>
                </div>
                <div class="col-md-12 col-lg-12">
                    <div class="lineOfCard"></div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="区域选择经销商" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshop" @select-change="selectedfun" :readonly="areaReadonly"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="销售状态" label-text-align="right" :label-cols="4">
                        <b-form-select :value="cardInfo.cardStatus" disabled :options="cardStateList" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="有效期类型" label-text-align="right" :label-cols="4">
                        <b-form-select :value="cardInfo.cardExpireType" disabled :options="indateList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="客户" label-text-align="right" :label-cols="4">
                        <b-form-input :value="cardInfo.cardSalesOrderInfoVo ? cardInfo.cardSalesOrderInfoVo.customName : ''" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="使用类型" label-text-align="right" :label-cols="4">
                        <b-form-select :value="cardInfo.cardUseTypeCode" disabled :options="userStyleList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="销售单" label-text-align="right" :label-cols="4">
                        <b-form-input :value="cardInfo.cardSalesOrderNo" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="销售人" label-text-align="right" :label-cols="4">
                        <b-form-input :value="cardInfo.cardSalesOrderInfoVo.salesEmpName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="车架号(VIN)" label-text-align="right" :label-cols="4">
                        <b-form-input :value="cardInfo.cardSalesOrderInfoVo.vinCode" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="使用人" label-text-align="right" :label-cols="4">
                        <b-form-input :value="cardInfo.cardSalesOrderInfoVo.customName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="起始日期" label-text-align="right" :label-cols="4">
                        <b-form-input :value="cardInfo.startDateStr" readonly/>
                    </b-form-fieldset>
                </div>
                
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="到期日期" label-text-align="right" :label-cols="4">
                        <b-form-input :value="cardInfo.endDateStr" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="车牌" label-text-align="right" :label-cols="4">
                        <b-form-input :value="cardInfo.cardSalesOrderInfoVo.plateNumber" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="面值" label-text-align="right" :label-cols="4">
                        <b-form-input :value="cardInfo.cardAmout ? cardInfo.cardAmout.toFixed(2) : ''" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="管理状态" label-text-align="right" :label-cols="4">
                        <b-form-select :value="cardInfo.frozenState" disabled :options="frozenList" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="有效天数" label-text-align="right" :label-cols="4">
                        <b-form-input :value="cardInfo.effectiveDays" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="使用状态" label-text-align="right" :label-cols="4">
                        <b-form-select :value="cardInfo.isAlreadyUsed" disabled :options="isUsed"/>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 col-lg-12">
                    <div class="lineOfCard"></div>
                </div>
            </div>
            <div class="table-scrollable mb-2">
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr class="">
                            <th class="">厂家</th>
                            <th class="">品牌</th>
                            <th class="">车系</th>
                            <th class="">车型</th>
                            <th class="">排量</th>
                            <th class="">进气方式</th>
                        </tr>
                    </thead>
                    <tbody class="">
                        <tr class="">
                            <td class="">{{ cardInfo.cardSalesOrderInfoVo.factoryName }}</td>
                            <td class="">{{ cardInfo.cardSalesOrderInfoVo.brandName }}</td>
                            <td class="">{{ cardInfo.cardSalesOrderInfoVo.seriesName }}</td>
                            <td class="">{{ cardInfo.cardSalesOrderInfoVo.modelName }}</td>
                            <td class="">{{ cardInfo.cardSalesOrderInfoVo.opvName }}</td>
                            <td class="">{{ cardInfo.cardSalesOrderInfoVo.iotypeName }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </b-card>
        <b-card no-body>
            <div class="specialTabs">
                <b-tabs card>
                    <b-tab title="内容">
                       <div class="table-scrollable">
                            <b-table striped hover bordered show-empty :items="cardInfo.cardDetailInfoVos" :fields="fields">
                                <template slot="detailType" slot-scope="data">
                                    {{ data.item.detailType === 0 ? '商品' : '服务' }}
                                </template>
                                <template slot="useNums" slot-scope="data">
                                    {{ data.item.detailNums - data.item.availableNums }}
                                </template>
                                <template slot="empty">
                                    暂无数据...
                                </template>
                            </b-table>
                        </div>
                    </b-tab>
                    <b-tab title="冻结履历">
                        <div class="table-scrollable">
                            <b-table striped hover bordered show-empty :items="lulilist" :fields="fieldsluli">
                                <template slot="frozenType" slot-scope="data">
                                    {{ data.item.frozenType === 1 ? '冻结' : '解冻' }}
                                </template>
                                <template slot="empty">
                                    暂无数据...
                                </template>
                            </b-table>
                        </div>
                    </b-tab>
                </b-tabs>
            </div>
        </b-card>
        <b-modal id="modalPrevent"
                ref="modal"
                title="冻结说明"
                ok-title="确定"
                cancel-title="取消"
                @ok="handleOk"
                @shown="clearName">
                <div class="row fronzenStyle">
                    <div class="col-md-12 col-lg-12">
                        <b-form-fieldset horizontal label="冻结原因*" label-text-align="right" :label-cols="2">
                            <b-form-input v-model="frozenSeason" :state="frozenSeasonState"/>
                        </b-form-fieldset>
                    </div>
                </div>
        </b-modal>
        <irismodal ref="myModal" @sureEvent="ruins"></irismodal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import irismodal from 'components/iris-modal'
    import common from 'common/common.js'
    import config from 'common/config.js'
    import api from 'common/api.js'
    import { MessageBox, Message, Button } from 'element-ui'
    Vue.use(Button)
    export default {
        components: {
            areaqueryshop,
            irismodal
        },
        data() {
            return {
                hasWrite: false,
                justShow: false,
                isStoreValueCard: false,
                lulilist: [],
                cardInfo: {cardSalesOrderInfoVo: {}},
                isUsed: [],
                frozenList: [],
                cardStateList: [],
                tablelist: [],
                indateList: [],
                userStyleList: [],
                isSure: '',
                isSureState: null,
                areaReadonly: false,
                hasFrozen: false,
                hasCanceled: false,
                frozenSeasonState: null,
                frozenSeason: '',
                fieldsluli: {
                    operationTimeStr: {
                        label: '操作时间'
                    },
                    operationEmpName: {
                        label: '操作人'
                    },
                    frozenType: {
                        label: '操作'
                    },
                    frozenReason: {
                        label: '原因说明'
                    }
                },
                fields: {
                    detailType: {
                        label: '类型'
                    },
                    detailCode: {
                        label: '编码'
                    },
                    detailName: {
                        label: '名称'
                    },
                    detailNums: {
                        label: '总数量'
                    },
                    useNums: {
                        label: '已使用数量'
                    },
                    availableNums: {
                        label: '剩余数量'
                    }
                }
            }
        },
        methods: {
            // 打开模态框
            showDeleteModel() {
                const _this = this
                _this.$refs.myModal.showDeleteModel()
            },
            // 查询履历
            queryRecordFrozen() {
                const _this = this
                let tempStr = _this.$route.params.code
                let option = {
                    cardNo: tempStr.substring(0, tempStr.length - 4)
                }
                api.cardManage.queryRecordFrozen(option, res => {
                    if(res.data.code === 'success') {
                        _this.lulilist = res.data.obj
                    }
                })
            },
            // 冻结模态框显示
            frozenModel() {
                const _this = this
                _this.$refs.modal.show()  
            },
            // 冻结模态框事件
            handleOk(evt) {
                const _this = this
                evt.preventDefault()
                if(_this.frozenSeason) {
                    _this.frozen()
                }else {
                    _this.frozenSeasonState = false
                }
            },
            clearName() {
                const _this = this
                _this.isSureState = null
                // _this.$refs.modalDestroy.hide()
            },
            // 获取冻结解冻sequence并处理
            getSequenceAndDoing(sc) {
                const _this = this
                let option = {
                    serviceCode: config.cardRelative.frozenSeq
                }
                api.ordinalInfo.getSequence(option, res => {
                    if(res.data.code === 'success') {
                        sc(res.data.obj)
                    }
                })
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
                        let tempArr = [
                            {
                                text: '',
                                value: ''
                            }
                        ]
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
            // 
            selectedfun() {

            },
            // 解冻
            openFrozen() {
                const _this = this
                _this.getSequenceAndDoing(function(arg){
                    let option = [{
                        cardNo: _this.cardInfo.cardNo,
                        frozenType: 0,
                        cardFrozenOrderNo: arg,
                        orderStatus: 1
                    }]
                    api.cardManage.frozenOrNot(option, res => {
                        if(res.data.code === 'success') {
                            _this.hasFrozen = false
                            _this.queryRecordFrozen()
                        }
                    })
                })
            },
            // 冻结
            frozen() {
                const _this = this
                _this.getSequenceAndDoing(function(arg){
                    let option = [{
                        cardNo: _this.cardInfo.cardNo,
                        frozenType: 1,
                        cardFrozenOrderNo: arg,
                        orderStatus: 1,
                        frozenReason: _this.frozenSeason
                    }]
                    api.cardManage.frozenOrNot(option, res => {
                        if(res.data.code === 'success') {
                            _this.hasFrozen = true 
                            _this.frozenSeason = ''
                            _this.frozenSeasonState = null
                            _this.$refs.modal.hide()
                            _this.queryRecordFrozen()
                        }
                    })
                })
            },
            // 作废
            ruins(value) {
                const _this = this
                let option = {
                    cardNo: _this.cardInfo.cardNo,
                    cardStatus: -1,
                    isElectronicAccount: 0
                }
                api.cardManage.cancelCard(option, res => {
                    if(res.data.code === 'success') {
                        _this.hasCanceled = true
                        _this.isSureState = null
                        //  _this.$refs.modalDestroy.hide()
                        Message({
                            type: 'success',
                            message: '作废成功'
                        })
                        _this.getCardDetailInfo()
                        _this.hasWrite = false
                        _this.$refs.myModal.closeDeleteModel()
                    }
                })
            },
            // 获取卡详细信息
            getCardDetailInfo() {
                const _this = this
                let tempNo = _this.$route.params.code
                let judgeStr = tempNo.substring(tempNo.length-4, tempNo.length)
                let tempCardNo = tempNo.substring(0, tempNo.length-4)
                if(judgeStr === 'edit') {
                    
                }else if(judgeStr === 'show') {
                    _this.justShow = true
                }
                let option = {
                    cardNo: tempCardNo
                }
                api.cardManage.getCardDetail(option, res => {
                    if(res.data.code === 'success') {
                        _this.cardInfo = res.data.obj
                        let option = {
                            text: _this.cardInfo.storeName,
                            value: _this.cardInfo.storeCode
                        }
                        if(_this.cardInfo.isElectronicAccount === 1) {
                            _this.isStoreValueCard = true
                            _this.cardInfo.effectiveDays = ''
                        }
                        if(option.value) {
                            _this.$refs.areaqueryshop.setselect(option)
                        }
                        _this.areaReadonly = true
                        if(_this.cardInfo.frozenState === 1) {
                            _this.hasFrozen = true
                        }else {
                            _this.hasFrozen = false
                        }
                        if(_this.cardInfo.cardStatus === -1) {
                            _this.hasCanceled = true
                        }
                    }
                })
            }
        },
        created() {
            const _this = this
            // 页面数据初始化
            _this.isUsed = config.cardRelative.isUsed
            _this.cardStateList = config.cardRelative.cardStatus
            _this.frozenList = config.cardRelative.frozenStatus
            _this.indateList = config.cardRelative.indateList
            _this.getCardDetailInfo()
            _this.queryRecordFrozen()
            _this.getDataDictionary(config.cardRelative.cardUserTypeCode, 'userStyleList')
        }
    }
</script>
<style>
    .fronzenStyle .form-row {
        margin-top: 20px;
    }
    .el-message-box__status {
        transform: translateY(-150%)
    }
    .myselfDelete-input {
        border: 1px solid rgb(206, 35, 35);
    }
    .myselfDelete-mysmall-tips {
        padding: 10px 0px;
    }
    .myselfDelete-mysmall-button {
        text-align: center;
        padding-top: 10px;
    }
    .myselfDelete {
        text-align: center;
    }
    .lineOfCard {
        height: 1px;
        background-color: #ccc;
        margin: 10px 0px;
    }
    .specialTabs .nav-item>a {
        /* padding: 0px; */
        color: #151b1e !important;
        text-decoration: none !important;
        padding: 10px 30px;
        border-radius: 10px 10px 0px 0px;
    }
</style>
