<template>
<el-dialog ref="dialog" 
    title="发票录入操作人:"
    no-close-on-backdrop 
    size="large"  @open="reset"  :visible.sync="dialogInvoive" :modal-append-to-body="false">
    <span class="modal-pay-invioce-name">{{Modaltitle}}</span>
    <div class="row">
        <div class="col-md-6">
            <b-form-fieldset horizontal label="发票号*" :label-cols="4" class="text-right">
                <!-- <b-form-input v-model="info.invoiceNo" v-invioce-no :state="inp.invoiceNo" min="0"/> -->
                <input type="text" v-invioce-no class="form-control" v-model="info.invoiceNo" :class="{'inp-invalid' : inp.invoiceNo == 'invalid'}">
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="开票人/企业名称*" :label-cols="4" class="text-right">
                <b-form-input v-model.trim="info.invoiceTitle" :state="inp.invoiceTitle"/>
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="确认发票号*" :label-cols="4" class="text-right">
                <!-- <b-form-input v-model.number="info.confirmInvoiceNo" min="0" v-invioce-no :state="inp.confirmInvoiceNo" onpaste="return false;"/> -->
                <input type="text" v-invioce-no class="form-control" v-model="info.confirmInvoiceNo" :class="{'inp-invalid' : inp.confirmInvoiceNo == 'invalid'}" onpaste="return false;">      
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="开户行" :label-cols="4" class="text-right">
                <b-form-input v-model.trim="info.bankName"/>
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="开票内容" :label-cols="4" class="text-right">
                <b-form-input v-model.trim="info.invoiceContentDesc"  :state="inp.invoiceContentDesc"/>
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="账号" :label-cols="4" class="text-right">
                <b-form-input v-model.trim="info.bankAccount"/>
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="发票类型*" :label-cols="4" class="text-right">
                <b-form-select :options="invoiceTypes" v-model.trim="info.invoiceType" @input="selectInoviceType" :state="inp.invoiceType"></b-form-select>
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="税号" :label-cols="4" class="text-right">
                <b-form-input v-model.trim="info.taxRegistrationNo"/>
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="税率*" :label-cols="4" class="text-right">
                <b-form-input v-model.trim="info.invoiceRate" disabled/>
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="去税金额" :label-cols="4" class="text-right">
                <b-form-input type="number" v-model.trim="info.invoiceAmountExcludingTax" disabled/>
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="地址" :label-cols="4" class="text-right">
                <b-form-input v-model.trim="info.companyAddress"/>
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="税金" :label-cols="4" class="text-right">
                <b-form-input type="number" v-model.trim="info.taxAmount" disabled/>
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="发票打印时间*" :label-cols="4" class="text-right">
                <el-date-picker
                    :class="{'inp-invalid' : inp.invoiceTime=='invalid'?true:false}"
                    v-model="info.invoiceTime"
                    type="date"
                    :picker-options="pickerOptions1"
                    placeholder="选择日期">
                </el-date-picker>
            </b-form-fieldset>
        </div>
        <div class="col-md-6">
            <b-form-fieldset horizontal label="开票金额*" :label-cols="4" class="text-right">
                <b-form-input type="number" v-model.trim="info.invoiceAmount" @input="inputInvoiceAmount" :disabled='invoiceAmountDisabled' :state="inp.invoiceAmount"/>
            </b-form-fieldset>
        </div>
        <div class="col-md-12">
            <b-form-fieldset horizontal label="备注" :label-cols="2" class="text-right">
                <b-form-input v-model.trim="info.invoiceRemark"/>
            </b-form-fieldset>
        </div>
    </div>
    <div slot="footer" class="dialog-footer dialog-footer-cla">         				
        <b-btn size="sm" class="float-right" variant="success" @click="addInovice">添加</b-btn>
        <b-btn size="sm" class="float-right mr-2" variant="seconday" @click="cancelModal">取消</b-btn>
    </div>
</el-dialog>
</template>
<script>
import Vue from "vue"
import common from 'common/common.js'
import { getType } from 'common/api-common'
import {RATERELATION, INVOICE_TYPE, INVOICE_CONTENT_CODE } from 'common/ref-code'
import { Message, DatePicker, Dialog} from "element-ui"
import {CAED_RECHARGE_INVOICE_SEQ, CARD_SALE_INVOICE_SEQ} from 'common/sequence.js'
import api from 'common/api'
import directives from 'common/directives'

Vue.use(DatePicker);
Vue.use(Dialog);

export default {
    props: {
        invoiceContentSuffix: { // 卡开票内容
            type: String,
            default: ''
        },
        invoiceContentStart: { // 卡票内容前缀 1.CardSales： 卡销售； 2.CardRecharge：卡充值
            type: String,
            default: ''
        },
        invioceNum: { // 默认开票金额
            type: Number,
            default: 0
        },
        invoiceAmountDisabled: { // 默认开票金额
            type: Boolean,
            default: false
        },
        userInfo: {
                type: Object,
                default: function() {
                    return {};
                }
            },
    },
    data() {
        return {
            dialogInvoive: false,
            Modaltitle: '',
            info: {
                invoiceNo: '',
                invoiceTitle: '',
                confirmInvoiceNo: '',
                bankName: '',
                invoiceContentCode: '',
                invoiceContentName: '',
                invoiceContentDesc: '',
                bankAccount: '',
                invoiceType: '',
                invoiceTypeCode: '',
                invoiceTypeName: '',
                taxRegistrationNo: '',
                invoiceRate: '',
                invoiceAmountExcludingTax: '',
                companyAddress: '',
                invoiceRemark: '',
                taxAmount: '',
                invoiceTime: '',
                invoiceAmount: '',
            },
            inp: {
                invoiceNo: null,
                invoiceTitle: null,
                confirmInvoiceNo: null,            
                invoiceType: null,                        
                invoiceAmount: null,              
                taxAmount: null,
                invoiceTime: null,    
                invoiceContentDesc: null,         
            },
            invoiceType:'',
            invoiceTypes: [],
            invoiceContentStartList: [],
            confirmState: null,
            // showModal: false
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
        }
    },
    computed: {
      
    },
    mounted() {
        getType(RATERELATION, items => {
            this.invoiceTypes = []
            items.forEach(item => {
                let valStr = JSON.stringify({
                        value: item.refDetailCode,
                        text: item.refDetailName
                    });
                let data = {
                    text: item.refDetailName,
                    value: valStr
                }
                this.invoiceTypes.push(data)
            })
        })
        getType(INVOICE_CONTENT_CODE, items => {
            this.invoiceContentStartList = []
            items.forEach(item => {
                let data = {
                    text: item.refDetailName,
                    value: item.refDetailCode
                }
                this.invoiceContentStartList.push(data);
            })
            this.setInoviceStart(this.invoiceContentStart);
            
        });
         this.Modaltitle = this.userInfo.empVo ? this.userInfo.empVo.empCnName: '';
    },
    methods: {
         // 生成发票明细code
        createDetailCode() {
            let code = 'INVOICEDETAILINFOSEQ';
            // if(this.invoiceContentStart == 'CardSales') {
            //     code = CARD_SALE_INVOICE_SEQ;
            // }else if(this.invoiceContentStart == 'CardRecharge') {
            //     code = CAED_RECHARGE_INVOICE_SEQ;
            // }
            const option = {
                'serviceCode': code,
            }
            return new Promise((reslove,reject) => {
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {							
                        reslove(res.data.obj)
                    };
                })
            })				
        },
        selectInoviceType() {
            if(this.info.invoiceType === '') {
                return;
            }
            let obj = JSON.parse(this.info.invoiceType);
            this.info.invoiceTypeCode = obj.value;
            this.info.invoiceTypeName = obj.text;
            this.info.invoiceRate = obj.text.replace(/[^0-9]/ig,"");
            this.countPrice(this.info.invoiceAmount, this.info.invoiceRate);
        },
        setInoviceStart(val) {          
            for(let [i, item] of this.invoiceContentStartList.entries()) {
                if(item.value === val) {
                    this.info.invoiceContentCode = item.value;
                    this.info.invoiceContentName = item.text;
                    this.info.invoiceContentDesc = this.invoiceContentSuffix;                
                }
            }
        },
        inputInvoiceAmount() {
            this.countPrice(this.info.invoiceAmount, this.info.invoiceRate);
        },
        countPrice(price, tax) {
            if(price === '' || this.info.invoiceRate === '') {
                return;
            }
            this.info.invoiceAmountExcludingTax = ((parseFloat(price) * 100) / (parseFloat(tax) + 100)).toFixed(2);
            this.info.taxAmount = (parseFloat(price) - parseFloat(this.info.invoiceAmountExcludingTax) ).toFixed(2);
        },
        show() {
            this.dialogInvoive = true;
        },
        addInovice() {
            let isVerify = false;
            for(let key of Object.keys(this.inp)) {
                this.inp[key] = null;
                if(this.info[key] === '') {
                    this.inp[key] = 'invalid';
                    isVerify = true;
                    Message({
                        type: "warning",
                        message: "发票信息未填写完整！"
                    });                
                }
            }
            if(this.info.invoiceAmount == 0) {
                this.inp.invoiceAmount = 'invalid';
                isVerify = true;
                Message({
                    type: "warning",
                    message: "开票金额不可为0！"
                });   
            }
            if(isVerify) {
                return;
            }
            if(this.info.invoiceNo !== this.info.confirmInvoiceNo) {
                this.inp.confirmInvoiceNo = 'invalid'
                event.preventDefault()
            }else {
                this.inp.confirmInvoiceNo = null
                this.info.invoiceRate = this.info.invoiceRate / 100;
                this.info.invoiceTime = common.eleTimeFormatim2(this.info.invoiceTime);
                this.createDetailCode().then((res) => {
                    this.info.invoiceCode = res;
                    this.$emit('conOpenTicket', this.info)              
                    this.dialogInvoive = false;
                })
               
            }
        },
        setDsc() {
            this.setInoviceStart(this.invoiceContentStart);
        },
        cancelModal() {
            this.dialogInvoive = false;
        },
        reset() {
            for(let key of Object.keys(this.info)) {
                this.info[key] = ''
            }
            for(let key of Object.keys(this.inp)) {
                this.inp[key] = null;
            }
            this.info.invoiceAmount = parseFloat(this.invioceNum).toFixed(2);
            this.setDsc();
        },
        fliterNoNum(key, val){
            let num = val.toString().replace(/[^0-9]/ig,"");
             this.info[key] =  num ? parseInt(num): ''
            
        },
    },
}
</script>

<style scoped>
.modal-pay-invioce-name{
    position: absolute;
    top: 16px;
    left: 180px;
    font-size: 20px;
}
</style>
