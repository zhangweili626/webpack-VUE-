<template>
    <div class="makeCardpage">
        <b-card>
            <div class="row">
                <div class="col-md-12 col-lg-12">
                    <div>
                		制券批次号: {{ couponMakeOrderNo }}
                    </div>
                    <div class="lineOfCard"></div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="制券人" label-text-align="right" :label-cols="4">
                        <b-form-input :value="operateMan" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="制券部门" label-text-align="right" :label-cols="4">
                        <b-form-input :value="department" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="本次制券数" label-text-align="right" :label-cols="4">
                        <b-form-input :value="madeCount" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="制券日期" label-text-align="right" :label-cols="4">
                        <b-form-input :value="madeDate" readonly/>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="success" :disabled="alreadyMade" @click="makeCouponByModel">模板制券</b-button>
                      <!--  <b-button size="sm" variant="danger" :disabled="!alreadyMade" @click="showDestroyModel">批次作废</b-button>-->
                        <b-button size="sm" variant="default" @click="goBack">取消</b-button>
                        <!-- <el-button type="success" size="medium" :disabled="alreadyMade" @click="makeCardByModel">模板制券</el-button>
                        <el-button type="danger" size="medium" :disabled="!alreadyMade" @click="handleDestroy">批次作废</el-button>
                        <el-button type="" size="medium" @click="goBack">取消</el-button> -->
                    </div>
                </div>
            </div>
        </b-card>
        <b-card no-body>
            <div class="specialTabs">
                <b-tabs card>
                    <b-tab title="新制数量">
                        <newmodel ref="newmodel" @getNumersList = 'getNumersList' @already-made="getChildData" :showObj="showObj" :couponTemplateCode="couponTemplateCode" :couponMakeOrderNo="couponMakeOrderNo"></newmodel>
                    </b-tab>
                    <b-tab title="已制数量">
                        <mademodel ref="mademodel" :hasMadeArray="hasMadeArray" :couponTemplateCode="couponTemplateCode"></mademodel>
                    </b-tab>
                    <b-tab title="模板">
                        <couponmodel :showObj="showObj" :couponTemplateCode="couponTemplateCode"></couponmodel>
                    </b-tab>
                </b-tabs>
            </div>
        </b-card>
        <!-- <b-modal id="modalPrevent"
                ref="mydeletemodalpici"
                :hide-footer="true"
                :hide-header="true">
                <div class="myselfDelete">
                    <h5>将作废本批次所有券<br>确认作废么？</h5>
                    <div class="myselfDelete-mysmall-tips">请在下方输入"作废"后点击作废可确认此操作</div>
                    <div class="myselfDelete-mysmall-input">
                        <input type="text" v-model="sureValue" :class="{'myselfDelete-input' : hasWrite}"/>
                    </div>
                    <div class="myselfDelete-mysmall-button">
                        <b-button size="sm" variant="" @click="hideDestroyModel">返回</b-button>
                        <b-button size="sm" variant="success" @click="destroyCard">确认</b-button>
                    </div>
                </div>
        </b-modal> -->
        <irismodal ref="myModal" :warnigTitle="warnigTitle" :tipsTitle="tipsTitle" @sureEvent="destroyCard"></irismodal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import couponmodel from './tabs/coupon-model.vue'
    import mademodel from './tabs/made-model.vue'
    import newmodel from './tabs/new-model.vue'
    import irismodal from 'components/iris-modal'
    import config from 'common/config.js'
    import api from 'common/api.js'
    import common from 'common/common.js'
    import { MessageBox, Message, Button } from 'element-ui'
    Vue.use(Button)
    export default {
        components: {
            couponmodel,
            mademodel,
            newmodel,
            irismodal
        },
        data() {
            return {
                warnigTitle: '将作废本批次所有券',
                tipsTitle: '确认作废么？',
                sureValue: '',
                alreadyMade: false,
                hasWrite: false,
                madeCount: '',
                madeDate: '',
                couponTemplateCode: '',
                couponMakeOrderNo: '',
                department: '',
                operateMan: '',
                showObj: {},
                storeList: [],
                hasMadeArray: [],
                isSure: '',
                isSureState: null
            }
        },
        methods: {
            showDestroyModel() {
                const _this = this
                _this.$refs.myModal.showDeleteModel()
            },
            // hideDestroyModel() {
            //     const _this = this
            //     _this.hasWrite = false
            //     _this.$refs.mydeletemodalpici.hide()
            // },
            // 获取组件的数据
            getChildData(value) {
                console.log(value)
                const _this = this
                if(value.data.code === 'success') {
                    _this.madeCount = value.data.obj.makeTotalCount
                    _this.madeDate = value.data.obj.createTimeStr ? value.data.obj.createTimeStr.substring(0, 10) : ''
                    if(value.data.fromStore) {
                        _this.alreadyMade = false
                    }else {
                        _this.alreadyMade = true
                    }
                }
            },
            // 获取已制券明细
            getMadeDetail() {
                let option = {
                    couponTemplateCode: this.couponTemplateCode
                }
                api.ticketManage.queryMadeDetail(option, res => {
                    if(res.data.code === 'success') {
                        this.hasMadeArray = res.data.obj
                        console.log('已制券查询')
                        console.log(this.hasMadeArray)
                    }
                })
            },
            // sequence获取批次号
            getPiciSequence() {
                const _this = this
                let option = {
                    serviceCode: config.cardRelative.piciSeq_
                }
                api.ordinalInfo.getSequence(option, res => {
                    if(res.data.code === 'success') {
                        _this.couponMakeOrderNo = res.data.obj
                    }
                })
            },
            // 获取券模板主信息
            getMainInfoCard() {
        	  	const _this = this
                let option = {
                    couponTemplateCode: this.couponTemplateCode
                }
                api.ticketManage.queryMainInfoCard(option, res => {
                    if(res.data.code === 'success') {
                        this.showObj = res.data.obj
                        console.log('获取主信息')
                        console.log(res.data.obj)
                        _this.showObj.cardPic1 = common.getUploadUrl() + _this.showObj.cardPic1 ? _this.showObj.cardPic1 : '' 
                        _this.showObj.cardPic2 = common.getUploadUrl() + _this.showObj.cardPic2 ? _this.showObj.cardPic2 : ''
                        _this.showObj.cardPic3 = common.getUploadUrl() + _this.showObj.cardPic3 ? _this.showObj.cardPic3 : ''
                        _this.showObj.cardPic4 = common.getUploadUrl() + _this.showObj.cardPic4 ? _this.showObj.cardPic4 : ''
                        _this.showObj.cardPic5 = common.getUploadUrl() + _this.showObj.cardPic5 ? _this.showObj.cardPic5 : ''
                    }
                })
            },
            // 返回
            goBack() {
                const _this = this
                _this.$router.push({
                    path: '/ticket-template-counting/ticket-template-counting-query'
                })
            },
            // 获取当前登陆人信息
            getUserAvalibleInfo() {
                const _this = this
                let currentAccount = JSON.parse(common.getSession('userInfo'))
                _this.operateMan = currentAccount.empVo.empCnName
                _this.department = currentAccount.empVo.orgName
            },
            // 模板制券
            makeCouponByModel() {
                const _this = this
                this.$refs.newmodel.makeCoupon()
            },
            //制券成功后重新加载已制数量
            getNumersList(){
            	this.getMadeDetail()
            },
            
            // 制券作废
            destroyCard(value) {
                const _this = this
                let option = {
                    couponMakeOrderNo: _this.couponMakeOrderNo
                }
                // if(value === '作废') {
                api.cardManage.ruinsPici(option, res => {
                    if(res.data.code === 'success') {
                        Message({
                            type: 'info',
                            message: '批次作废成功'
                        })
                        _this.$router.push({
                            path: '/card-template-counting/card-template-counting-query'
                        })
                    }
                })
                _this.$refs.myModal.closeDeleteModel()
                    
                    // _this.hideDestroyModel()
                // }else {
                //     _this.hasWrite = true
                // }  
            }
        },
        created() {
            const _this = this
            _this.couponTemplateCode = _this.$route.params.code
            _this.getPiciSequence()
            _this.getUserAvalibleInfo()
            _this.getMainInfoCard()
            _this.getMadeDetail()
        }
    }
</script>
<style>
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
    .el-message-box__status {
        transform: translateY(-150%)
    }
</style>

