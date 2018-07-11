<template>
    <div>
        <b-card>
            <div class="row">
                <div class="col-md-12 col-lg-12">
                    <!-- <b-form-fieldset horizontal label="制卡批次号" label-text-align="right" :label-cols="4">
                        00001
                    </b-form-fieldset> -->
                    <div>
                        制卡批次号: {{ cardMakeOrderNo }}
                    </div>
                    <div class="lineOfCard"></div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="操作人" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="empName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="操作部门" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="orgName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="涉及作废卡数" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="cancelledCount" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="作废日期" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="today" readonly/>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="danger" @click="cancelTemplate()">模版作废</b-button>
                        <b-button size="sm" variant="default" @click="cancel()">取消</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card no-body>
            <div class="specialTabs">
                <b-tabs card>
                    <b-tab title="涉及门店">
                        <newModel :newcard="newcardlist"></newModel>
                    </b-tab>
                    <b-tab title="涉及批次">
                        <batch></batch>
                    </b-tab>
                    <b-tab title="模板">
                        <cardtemplate></cardtemplate>
                    </b-tab>
                </b-tabs>
            </div>
        </b-card>
        <irisModal :warnigTitle="'模版作废将同时作废此模版下未售出的所有卡'" ref="irisModal" @sureEvent="sureEvent"></irisModal>
    </div>
</template>
<script>
    import config from 'common/config.js'
    import api from 'common/api.js'
    import common from 'common/common.js'
    import cardtemplate from './cancel-tabs/template-tabs.vue'
    import newModel from './cancel-tabs/new-model.vue'   
    import batch from './cancel-tabs/batch.vue'    
    import { MessageBox, Message} from 'element-ui'
    import irisModal from 'components/iris-modal'
    export default {
        components: {
            cardtemplate,
            newModel,
            batch,
            irisModal
        },
        data() {
            return {
                alreadyMade: false,
                cardTemplateCode: '',
                cardMakeOrderNo: '',
                department: '',
                operateMan: '',
                showObj: {},
                storeList: [],
                hasMadeArray: [],
                // orgName:null,
                // empName:null,
                today:null,
                newcardlist:[],
                cancelledCount:0
            }
        },
        methods: {
            cancel(){
                const _this = this;
                _this.$router.push({
                    name: 'card-template-counting-query'
                })
            },
            sureEvent(){
                const _this = this;
                api.carTemlate.cleanCardTemplateInfo({
                    cardTemplateCode:_this.$route.query.cardTemplateCode,
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.$router.push({
                            name: 'card-template-counting-query'
                        })
                    }
                })
            },
            cancelTemplate(){
                const _this = this;
                _this.$refs.irisModal.showDeleteModel()
                // MessageBox.prompt('请在下面输入作废后点击”作废“可确认此操作！', '提示', {
                // confirmButtonText: '作废',
                // cancelButtonText: '取消',
                // inputErrorMessage: '输入错误'
                // }).then(({ value }) => {
                //     if(value == '作废'){
                //         api.carTemlate.cleanCardTemplateInfo({
                //             cardTemplateCode:_this.$route.query.cardTemplateCode,
                //         },(msg)=>{
                //             if(msg.data.message == 'success'){
                //                 _this.$router.push({
                //                     name: 'card-template-counting-query'
                //                 })
                //             }
                //         })
                //     }else{
                //         Message({
                //             type: 'warning',
                //             message: '输入错误'
                //         })
                //         return false
                //     }
                       
                // }).catch(() => {
                 
                // });             
            },
            getNowFormatDate() {
                var date = new Date();
                var seperator1 = "-";
                var seperator2 = ":";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                        // + " " + date.getHours() + seperator2 + date.getMinutes()
                        // + seperator2 + date.getSeconds();
                return currentdate;
            }
        },
        computed:{
            orgName:function(){
                let userInfo = sessionStorage.getItem("userInfo");  
                if(userInfo){
                    return JSON.parse(userInfo).empVo.orgName   
                }
            },
            empName:function(){
                let userInfo = sessionStorage.getItem("userInfo");  
                if(userInfo){
                    return JSON.parse(userInfo).empVo.empCnName  
                }
            },
        },
        created() {
            const _this = this
            _this.today = _this.getNowFormatDate()
            api.carTemlate.queryMakeCardInfos({
                cardTemplateCode:_this.$route.query.cardTemplateCode,
                storeCode:"00001"
            },(msg)=>{
                if(msg.data.message == 'success'){
                    _this.newcardlist = msg.data.obj
                    let count = 0
                    for (let index = 0; index < _this.newcardlist.length; index++) {
                        const element = _this.newcardlist[index];
                        count+=element.cancelledCount
                    }
                    _this.cancelledCount = count
                }
            })
        }
    }
</script>
<style>
    .lineOfCard {
        height: 1px;
        background-color: #ccc;
        margin: 10px 0px;
    }
    .specialTabs a {
        /* padding: 0px; */
        color: #151b1e !important;
        text-decoration: none !important;
        padding: 10px 30px;
        border-radius: 10px 10px 0px 0px;
    }
</style>

