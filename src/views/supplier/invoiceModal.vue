<template>
    <div class="animated fadeIn supplier-mayuhui">
        <b-modal id="invoiceModal" ref="invoiceModal" size="lg" :title="'编辑供应商发票信息'" hide-footer>
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="发票类型:" :label-cols="4" class="text-right">
                        <b-form-select :options="supplierInvoiceTypeList" v-model="edit.invoiceType"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="发票抬头:" :label-cols="4" class="text-right">
                        <b-form-input placeholder="" v-model="edit.invoiceTitle"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="公司地址:" :label-cols="4" class="text-right">
                        <b-form-input placeholder="" v-model="edit.companyAddress"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="公司电话:" :label-cols="4" class="text-right">
                        <b-form-input placeholder="" v-model="edit.companyPhoneNumber"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="账号:" :label-cols="4" class="text-right">
                        <b-form-input placeholder="" v-model="edit.bankAccount"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="税号:" :label-cols="4" class="text-right">
                        <b-form-input placeholder="" v-model="edit.taxRegistrationNumber"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="开户行:" :label-cols="4" class="text-right">
                        <b-form-input placeholder="" v-model="edit.bankName"/>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="mb-2 text-right">
                <b-button size="sm" @click="hide">取消</b-button>
                <b-button variant="success" size="sm" @click="submit">确定</b-button>
            </div>
        </b-modal>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import config from 'common/config'
import { MessageBox, Message } from 'element-ui'
export default {
    data() {
        return {
            edit: {
                id: '',
                invoiceCode: '',
                supplierCode: '',
                invoiceType: '',
                invoiceTitle: '',
                companyAddress: '',
                companyPhoneNumber: '',
                bankAccount: '',
                taxRegistrationNumber: '',
                bankName: '',
            }
        }
    },
    computed: {
        ...mapState('supplier', [
            'supplierInvoiceTypeList'
        ])
    },
    created() {
        this.getInvoiceType()
    },
    methods: {
        ...mapActions('supplier', [
            'getSupplierInvoiceType',
            'addSupplierInvoice',
            'getSupplierInfo'
        ]),
        setEditInfo: function(editItemInfo) {
            for(let item in this.edit) {
                this.edit[item] = editItemInfo[item]
            }
        },
        getInvoiceType: function() {
            let params = {
                refCode: config.supplier.refSupplierInvoiceType
            }
            this.getSupplierInvoiceType(params)
        },
        submit: function() {
            let params = []
            console.log(this.edit)
            params.push(this.edit)
            this.addSupplierInvoice({
                poros: params,
                callBack: res => {
                    this.getSupplierInfo(
                        {
                            poros: {supplierCode: this.edit.supplierCode},
                            callBack: res => {
                                Message({
                                    type: 'info',
                                    message: config.messInfo.success
                                });
                                this.$emit('clearRadio', '666')
                                this.$refs.invoiceModal.hide();
                            },
                        }
                    )
                    
                }
            })
        },
        hide() {
            this.$refs.invoiceModal.hide();
        },
        show() {
            this.$refs.invoiceModal.show();
        },
        // saveEditInfo: function() {
        //     let params = []
        //     params.push(this.edit)
        //     this.addSupplierInvoice({
        //         poros: params,
        //         callBack: res => {
                    
        //         }
        //     })
        // },
        // getInfo: function() {
        //     this.getSupplierInfo(
        //         {
        //             poros: {supplierCode: this.edit.supplierCode},
        //             callBack: res => {
                        
        //             },
        //         }
        //     )
        // },
        // submit: function() {
        //     axios.all([this.saveEditInfo(), this.getInfo()])
        //     .then(axios.spread((acct, perms) => {
        //         Message({
        //             type: 'info',
        //             message: config.messInfo.success
        //         });
        //         this.$refs.invoiceModal.hide();
        //     }))
        // },
    }
}
</script>

<style>
    /* .modal {
        z-index: 999999 !important;
    } */
    .supplier-mayuhui .modal-dialog {
        max-width: 800px !important;
    }
</style>

