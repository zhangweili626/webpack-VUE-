<template>
    <div>
         <el-dialog size="small" id="modalPay" title="收款人：" ref="modalPay" @open="reset" :visible.sync="dialogPay" :modal-append-to-body="false" style="max-width: 900px!important; left: 15%">
             <span class="modal-pay-name">{{Modaltitle}}</span>
			 <div class="container-fluid">
                <b-row>
                    <div class="col-md-12">
                        <b-form-fieldset horizontal label="支付方式*" :label-cols="4" class="text-right">
                             <b-form-select :options="paymentTypeList" v-model="dataModel.paymentType" @input="selectPayment"  :state="inp.paymentType"></b-form-select>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12">
                        <b-form-fieldset horizontal label="支付金额*" :label-cols="4" class="text-right">
                            <b-form-input type="number" v-model.number="dataModel.paymentAmount"  :state="inp.paymentAmount" placeholder="*CYN 0.00"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12">
                        <b-form-fieldset horizontal label="交易流水号" :label-cols="4" class="text-right">
                            <b-form-input  v-model.trim="dataModel.paymentTransactionNo"/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12">
                        <b-form-fieldset horizontal label="操作日期*" :label-cols="4" class="text-right">
                            <el-date-picker
                            :class="{'eldate-box': true,'inp-invalid' : inp.paymentTime=='invalid'?true:false}"
                            v-model="dataModel.paymentTime"
                            type="datetime"
                            :picker-options="pickerOptions1"
                            placeholder="选择日期时间">
                        </el-date-picker>
                        </b-form-fieldset>
                    </div>
                </b-row>
			 </div>
			<div slot="footer" class="dialog-footer dialog-footer-cla">         				
				<b-btn size="sm" class="float-right" variant="success" @click="surePay">保存</b-btn>
				<b-btn size="sm" class="float-right mr-2" variant="seconday" @click="cancelModal">取消</b-btn>
			</div>
		</el-dialog>     
    </div>
</template>
<script>
import Vue from "vue"
import suitScope from 'components/iris-suitscope'
import { Message , DatePicker, Dialog} from "element-ui"
import collectionApi from 'common/api-collection.js'
import common from 'common/common.js'
import {PAYMENTMODE_TYPE} from 'common/ref-code.js'
import {CAED_RECHARGE_PAYMENT_SEQ} from 'common/sequence.js'
import api from 'common/api'
import config from 'common/config'

Vue.use(DatePicker);
Vue.use(Dialog);

//  已添加扩展信息条目 cardInfo
// 选择确定触发事件surePay
export default {
    components: {
        
    },
    props: {
        userInfo: {
                type: Object,
                default: function() {
                    return {};
                }
            },
    },
    data() {
        return {   
            dialogPay: false,
            paymentTypeList: [],    
            Modaltitle: '',
            dataModel: {
                paymentTypeCode: '',
                paymentTypeName: '',
                paymentAmount: '',
                paymentTransactionNo: '',
                paymentTime: '',
                paymentEmpCode: '',
                paymentEmpName: '',
                paymentCode: '',
                paymentType: '',
            },
            inp: {
                paymentType: null,
                paymentAmount: null,
                paymentTime: null,
            },
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
        }
    },
    computed: {
       
    },
    created() {
        this.getPaylist();
        this.dataModel.paymentTime = new Date();
        this.dataModel.paymentEmpCode = this.userInfo.empVo.empCode;
        this.dataModel.paymentEmpName = this.userInfo.empVo.empCnName;
        this.Modaltitle = this.dataModel.paymentEmpName;
    },
    methods: {
        // 获取支付方式
        getPaylist(val) {
            let _this = this;
            const option = {
                'refCode': PAYMENTMODE_TYPE
            }
            api.ref.getDataDictionarys(option, (res) => {
                if (res.data.code === 'success') {
                    let data = res.data.obj.referenceDetailInfos;
                    let arr = []
                    data.forEach((item, index) => {
                        let valStr = JSON.stringify({
                            value: item.refDetailCode,
                            text: item.refDetailName
                        });
                        let obj = {
                            value: valStr,
                            text: item.refDetailName
                        }
                        arr.push(obj);
                    })
                    _this.paymentTypeList = arr;
                    console.log(arr)
                }
            })
        },
        // 生成支付明细code
        createDetailCode() {
            const option = {
                'serviceCode': CAED_RECHARGE_PAYMENT_SEQ,
            }
            return new Promise((reslove,reject) => {
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {							
                        reslove(res.data.obj)
                    };
                })
            })				
        },
        surePay() {
            let isVerify = false
            for(let key of Object.keys(this.inp)) {
                 this.inp[key] = null;
                if(this.dataModel[key] === '') {
                    this.inp[key] = 'invalid'
                    isVerify = true;
                    // Message({
                    //     type: "warning",
                    //     message: "支付信息未填写完整！"
                    // });              
                }
            }
            if(this.dataModel.paymentAmount <= 0) {
                 Message({
                    type: "warning",
                    message: "支付金额不可小于等于0！"
                });
                this.inp.paymentAmount = 'invalid';
                isVerify = true;
            }
            if(this.dataModel.paymentTime > new Date()) {
                Message({
                    type: "warning",
                    message: "支付时间不可大于当前时间！"
                });
                this.inp.paymentTime = 'invalid';
                isVerify = true;
            }
            if(isVerify) {
                return;
            }
            this.createDetailCode().then((res) => {
                this.dataModel.paymentCode = res;
                this.dataModel.paymentTime = common.eleTimeFormatim2(this.dataModel.paymentTime);
                this.dataModel.paymentAmount = parseFloat(this.dataModel.paymentAmount).toFixed(2);
                this.$emit('surePay', this.dataModel);
                this.dialogPay = false;
            })
           
        },
        cancelModal() {
           this.dialogPay = false;
        },
        showModal() {
            this.dialogPay = true;
        },
        selectPayment(val) {
            if(val=== '') {
                return;
            }
            let valObj = JSON.parse(val);
            this.dataModel.paymentTypeCode = valObj.value;
            this.dataModel.paymentTypeName = valObj.text;
        },
        reset() {
            for(let key of Object.keys(this.dataModel)) {
                this.dataModel[key] = ''
            }
            this.dataModel.paymentTime = new Date();
            this.dataModel.paymentEmpCode = this.userInfo.empVo.empCode;
            this.dataModel.paymentEmpName = this.userInfo.empVo.empCnName;
            for(let key of Object.keys(this.inp)) {
                this.inp[key] = null;
            }
        }
    },
    watch:{
        
    }
}
</script>

<style>
.modal-pay-name{
    position: absolute;
    top: 16px;
    left: 98px;
    font-size: 20px;
}
</style>
