<template>
    <div>
       <b-card>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <div>
                        卡号: {{ couponInfo.couponNo }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名称: {{ couponInfo.couponName }}
                    </div>
                </div>
                <div class="col-md-6 col-lg-6">
                    <div class="pull-right my-self-warnig-kuang">
                        <b-button v-if="hasFrozen&&!hasCanceled&&!justShow" size="sm" variant="primary" @click="openFrozen">解冻</b-button>
                        <b-button v-if="!hasFrozen&&!hasCanceled&&!justShow" size="sm" variant="primary" @click="frozenModel">冻结</b-button>
                      <!--  <b-button v-if="hasFrozen&&!hasCanceled&&!justShow&&!isStoreValuecoupon" size="sm" variant="danger" @click="showDeleteModel">作废</b-button>-->
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
                        <b-form-select v-model="couponInfo.couponStatus" disabled :options="couponStateList" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="有效期类型" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="couponInfo.couponExpireType" disabled :options="indateList"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="客户" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="couponInfo.customName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="使用类型" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="couponInfo.couponTypeName" readonly />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="销售单" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="couponInfo.couponSalesOrderNo" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="销售人" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="couponInfo.salesEmpName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="车架号(VIN)" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="couponInfo.vinCode" readonly/>
                    </b-form-fieldset>
                </div>
               <!-- <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="使用人" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="couponInfo.customName" readonly/>
                    </b-form-fieldset>
                </div>-->
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="起始日期" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="couponInfo.startDateStr" readonly/>
                    </b-form-fieldset>
                </div>
                
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="到期日期" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="couponInfo.endDateStr" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="车牌" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="couponInfo.plateNumber" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="使用方" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="couponInfo.couponUseTypeName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="业务状态" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="couponInfo.frozenState" disabled :options="frozenList" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="有效天数" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="couponInfo.effectiveDays" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <b-form-fieldset horizontal label="使用状态" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="couponInfo.isAlreadyUsed" disabled :options="isUsed"/>
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
                            <td class="">{{ couponInfo.factoryName }}</td>
                            <td class="">{{ couponInfo.brandName }}</td>
                            <td class="">{{ couponInfo.seriesName }}</td>
                            <td class="">{{ couponInfo.modelName }}</td>
                            <td class="">{{ couponInfo.opvName }}</td>
                            <td class="">{{ couponInfo.iotypeName }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </b-card>
        <b-card no-body>
            <div class="specialTabs">
                <b-tabs card>
                    <b-tab title="模板明细内容">
                       <div class="table-scrollable">
                            <b-table striped hover bordered show-empty :items="couponInfo.couponDetailInfoVos" :fields="fields">
                                <template slot="detailType" slot-scope="data">
                                    <span v-if="data.item.detailType == 0">商品分类</span>
	                                <span v-if="data.item.detailType == 1">商品</span>
	                                <span v-if="data.item.detailType == 2">服务分类</span>
	                                <span v-if="data.item.detailType == 3">服务</span>
	                                <span v-if="data.item.detailType == -1">全场</span>
                                </template>
                                <template slot="discountType" slot-scope="data">
	                                <span v-if="data.item.discountType == 0">固定金额</span>
	                                <span v-if="data.item.discountType == 1">百分比</span>
	                            </template>
	                            <template slot="couponType" slot-scope="data">
	                                {{data.item.couponTypeName}}
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
                isStoreValuecoupon: false,
                lulilist: [],
                couponInfo: {
                	effectiveDays:'',
                	frozenState:'',
                	plateNumber:'',
                	endDateStr:'',
                	startDateStr:'',
                	vinCode:'',
                	couponStatus:'',
                	couponExpireType:'',
                	salesEmpName:'',
                	couponUseTypeName:'',
                	couponTypeName:'',
                	isAlreadyUsed:'',
                	customName:'',
                	couponSalesOrderNo:'',
                	factoryName:'',
                	brandName:'',
                	seriesName:'',
                	opvName:'',
                	modelName:'',
                	iotypeName:'',
                	couponSalesOrderInfoVo: {},
                	couponDetailInfoVos:[],
                	},
                isUsed: [],
                frozenList: [],
                couponStateList: [],
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
                    couponTypeName: {
                        label: '券类型'
                    },
                    detailType: {
                        label: '类型'
                    },
                    detailClassifyCode: {
                        label: '服务/商品编码'
                    },
                    detailName: {
                        label: '名称'
                    },
                    discountType: {
                        label: '折扣类型'
                    },
                    discountValue: {
                        label: '抵扣金额（元）'
                    },
                    discount: {
                        label: '折扣（%）'
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
                    couponNo: tempStr.substring(0, tempStr.length - 4)
                }
                api.ticketManage.queryRecordFrozen(option, res => {
                    if(res.data.code === 'success') {
                        _this.lulilist = res.data.obj
                    }
                })
            },
            // 冻结模态框显示
            frozenModel() {
                this.$refs.modal.show()  
            },
            // 冻结模态框事件
            handleOk(evt) {
                evt.preventDefault()
                if(this.frozenSeason) {
                    this.frozen()
                }else {
                    this.frozenSeasonState = false
                }
            },
            clearName() {
                this.isSureState = null
                // _this.$refs.modalDestroy.hide()
            },
            // 获取冻结解冻sequence并处理
            getSequenceAndDoing(sc) {
                let option = {
                    serviceCode: config.cardRelative.frozenSeq_
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
                this.getSequenceAndDoing(function(arg){
                    let option = {
                        couponNo: _this.couponInfo.couponNo,
                        frozenType: 0,
                        couponFrozenOrderNo: arg,
                        orderStatus: 1
                    }
                    api.ticketManage.frozenOrNot(option, res => {
                        if(res.data.code === 'success') {
                            _this.hasFrozen = false
                            _this.queryRecordFrozen()
                            _this.couponInfo.frozenState = res.data.obj.frozenType
                             Message({
	                            type: 'success',
	                            message: '解冻成功'
	                        })
                        }
                    })
                })
            },
            // 冻结
            frozen() {
            	 const _this = this
                this.getSequenceAndDoing(function(arg){
                    let option = {
                        couponNo: _this.couponInfo.couponNo,
                        frozenType: 1,
                        couponFrozenOrderNo: arg,
                        orderStatus: 1,
                        frozenReason: _this.frozenSeason
                    }
                    api.ticketManage.frozenOrNot(option, res => {
                        if(res.data.code === 'success') {
                            _this.hasFrozen = true 
                            _this.frozenSeason = ''
                            _this.frozenSeasonState = null
                            _this.$refs.modal.hide()
                            _this.queryRecordFrozen()
                            _this.couponInfo.frozenState = res.data.obj.frozenType
                             Message({
	                            type: 'success',
	                            message: '冻结成功'
	                        })
                        }
                    })
                })
            },
            // 作废
            ruins(value) {
                const _this = this
                let option = {
                    couponNo: this.couponInfo.couponNo,
                    couponStatus: -1,
                    isElectronicAccount: 0
                }
                // if(value === '') {
                api.cardManage.cancelCard(option, res => {
                    if(res.data.code === 'success') {
                        _this.hasCanceled = true
                        _this.isSureState = null
                        //  _this.$refs.modalDestroy.hide()
                        Message({
                            type: 'success',
                            message: '作废成功'
                        })
                        _this.getCouponDetailInfo()
                        _this.hasWrite = false
                        _this.$refs.myModal.closeDeleteModel()
                        // _this.closeDeleteModel()
                    }
                })
                // }else {
                //     _this.hasWrite = true
                // }
            },
            // 获取详细信息
            getCouponDetailInfo() {
                const _this = this
                let tempNo = _this.$route.params.code
                let judgeStr = tempNo.substring(tempNo.length-4, tempNo.length)
                let tempcouponNo = tempNo.substring(0, tempNo.length-4)
                if(judgeStr === 'edit') {
                    
                }else if(judgeStr === 'show') {
                    _this.justShow = true
                }
                let option = {
                    couponNo: tempcouponNo
                }
                api.ticketManage.getCardDetail(option, res => {
                    if(res.data.code === 'success') {
                        this.couponInfo = res.data.obj
                        for(let k of Object.keys(this.couponInfo)){
                        	this.couponInfo[k] = res.data.obj[k]
                        }
                       this.couponInfo.couponDetailInfoVos.forEach(item=>{
                       		item.couponTypeName =  res.data.obj.couponTypeName
                       })
                        let option = {
                            text: _this.couponInfo.storeName,
                            value: _this.couponInfo.storeCode
                        }
                        if(_this.couponInfo.isElectronicAccount === 1) {
                            _this.isStoreValuecoupon = true
                            _this.couponInfo.effectiveDays = ''
                        }
                        if(option.value) {
                            _this.$refs.areaqueryshop.setselect(option)
                        }
                        _this.areaReadonly = true
                        if(_this.couponInfo.frozenState === 1) {
                            _this.hasFrozen = true
                        }else {
                            _this.hasFrozen = false
                        }
                        if(_this.couponInfo.couponStatus === -1) {
                            _this.hasCanceled = true
                        }
                    }
                })
            }
        },
        created() {
            const _this = this
            _this.isUsed = config.cardRelative.isUsed
            _this.couponStateList = config.cardRelative.couponStatus
            _this.frozenList = config.cardRelative.frozenStatus
            _this.indateList = config.cardRelative.couponIndateList
            _this.getCouponDetailInfo()
            _this.queryRecordFrozen()
            _this.getDataDictionary(config.cardRelative.couponUserTypeCode, 'userStyleList')
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
