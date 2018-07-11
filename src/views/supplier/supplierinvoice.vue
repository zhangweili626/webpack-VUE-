<template>
    <div>
        <div class="mb-2 ofh">
            <b-button variant="success" size="sm" class="pull-left mr-2" @click="addInvoice">新增</b-button>
            <b-button variant="danger" size="sm" class="pull-left" @click="remove(num)">删除</b-button>
            <b-button variant="primary" size="sm" class="pull-right" @click="saveSupplierInvoice">保存</b-button>
        </div>
        <div class="table-scrollable supplier">
            <table class="table table-striped table-bordered">
                <thead>
                    <tr class="text-center">
                        <th class="text-center" v-for="(item, index) in tHead" :key="index">{{item}}</th>
                    </tr>
                </thead>
                <tbody class="text-center">
                    <tr v-for="(item, index) in invoiceList" :key="index">
                        <td class="text-center">
                            <input class="form-control" type="radio" :value="index" v-model="num"/>
                        </td>
                        <td class="text-center">
                            <select class="form-control" v-model="item.invoiceType" :disabled="addStatus">
                                <option v-for="(item, index) in supplierInvoiceTypeList" :value="item.value" :key="index">{{item.text}}</option>
                            </select>
                        </td>
                        <td class="text-center">
                            <input class="form-control" type="text" v-model="item.invoiceTitle" :readonly="addStatus"/>
                        </td>
                        <td class="text-center">
                            <input class="form-control" type="text" v-model="item.companyAddress" :readonly="addStatus"/>
                        </td>
                        <td class="text-center">
                            <input class="form-control" type="text" v-model="item.companyPhoneNumber" :readonly="addStatus"/>
                        </td>
                        <!-- <td class="text-center">
                            <input class="form-control" type="text" v-model="item.invoiceTitle"/>
                        </td> -->
                        <td class="text-center">
                            <input class="form-control" type="text" v-model="item.bankAccount" :readonly="addStatus"/>
                        </td>
                        <td class="text-center">
                            <input class="form-control" type="text" v-model="item.taxRegistrationNumber" :readonly="addStatus"/>
                        </td>
                        <td class="text-center">
                            <input class="form-control" type="text" v-model="item.bankName" :readonly="addStatus"/>
                        </td>
                    </tr>
                    <tr v-if="invoiceList.length == '0'">
                        <td colspan="20" class="text-left">暂无数据...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import config from 'common/config'
import { MessageBox, Message } from 'element-ui'
export default {
    props: {
        supplierCode: {
            type: String,
            default: ''
        },
        listLength: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            addStatus: false,
            showbtn: true,
            num: 'num',
            tHead: ['选择', '发票类型','发票抬头', '公司地址 ', '公司电话', '账号', '税号', '开户行'],
            invoiceList: [],
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
            'getSupplierInvoiceCode',
            'getSupplierInfo',
        ]),
        clearInvoice: function () {
            this.invoiceList = [];
        },
        getInvoiceType: function() {
            let params = {
                refCode: config.supplier.refSupplierInvoiceType
            }
            this.getSupplierInvoiceType(params)
        },
        addInvoice: function () {
            if ((this.listLength + this.invoiceList.length) > '2') {
                Message({
                    type: 'info',
                    message: config.messInfo.suppliceInvoice
                });
                return
            }
            this.getSupplierInvoiceCode(msg => {
                this.addStatus = false
                let obj = {};
                obj.supplierCode = this.supplierCode;
                obj.invoiceCode = msg;
                obj.invoiceType = '';   
                obj.invoiceName = '';
                // obj.taxRate = '0.17';
                obj.invoiceTitle = '';
                obj.companyAddress = '';
                obj.companyPhoneNumber = '';
                obj.bankAccount = '';
                obj.taxRegistrationNumber = '';
                obj.bankName = '';
                this.invoiceList.push(obj)
            })
            
        },
        remove: function(num) {
            const $this = this
            if(this.invoiceList.length != 0) {
                console.log(this.num != 'num')
                if(this.num != 'num') {
                    MessageBox.confirm('确定执行此操作', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info',
                        beforeClose: (action, instance, done) => {
                            if (action === 'confirm') {
                                let len = $this.invoiceList.length
                                $this.invoiceList.splice(num, 1);
                                if ($this.invoiceList.length === len-1) {
                                    $this.num = 'num'
                                    done();
                                }
                            } else {
                                done();
                                return
                            }
                        },
                        callBack: function () {
                            
                        }
                    })
                } else {
                    Message({
                        type: 'info',
                        message: config.messInfo.select
                    })
                    return
                }
            } else {
                return
            }
            
        },
        saveSupplierInvoice: function() {
            if(this.invoiceList.length == 0) {
                return
            }
            console.log(this.invoiceList)
            if (this.invoiceList) {
                let judge;
                this.invoiceList.forEach((item, index) => {
                    if (item.invoiceType == '') {
                        Message({
                            type: 'warning',
                            message: '发票类型不能为空',
                        });
                        judge = true
                    }
                })
                if(!judge) {
                    this.addSupplierInvoice({
                        poros: this.invoiceList,
                        callBack: res => {
                            if(res.data.obj) {
                                res.data.obj.forEach((item, index) => {
                                    let obj = this.invoiceList[index]
                                    obj.id = item.id
                                })
                            }
                            this.getSupplierInfo(
                                {
                                    poros: {supplierCode: this.supplierCode},
                                    callBack: res => {
                                        Message({
                                            type: 'info',
                                            message: config.messInfo.success
                                        });
                                        this.addStatus = true
                                        this.$emit('hideModal', '');
                                    },
                                }
                            )
                        }
                    })
                }
            } 
            
        },
    },
}
</script>
<style>
    .supplier tr td {
        max-width: 150px !important;
        min-width: 150px !important;
    }
    .supplier tr td:first-child {
        max-width: 50px !important;
        min-width: 50px !important;
    }
	.ofh {
		overflow: hidden;
	}
</style>

