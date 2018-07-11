<template>
    <div>
        <b-card header="供应商发票信息">
            <div class="mb-2">
                <b-button variant="success" size="sm" @click="addInvoice" v-if="supplierInvoiceInfoList < '3'">新增</b-button>
                <b-button variant="primary" size="sm" @click="editInvoice">编辑</b-button>
                <b-button variant="danger" size="sm" @click="deleteInvoice">删除</b-button>
            </div>
            <div class="table-scrollable pt-1">
				<b-table striped hover bordered show-empty :items="supplierInfo.supplierInvoiceInfoList" :fields="fields">
                    <template slot="index" slot-scope="data">
                        <input class="form-control" type="radio" :value="data.item" v-model="supplieritem"/>
                    </template>
					<template slot="empty">
						暂无数据...
					</template>
				</b-table>
			</div>
        </b-card>
        <!-- <v-invoicemodal ref="invoiceModal"></v-invoicemodal> -->
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import config from 'common/config'
import { MessageBox, Message } from 'element-ui'
import VInvoicemodal from './invoiceModal'
export default {
    components: {
        VInvoicemodal
    },
    data() {
        return {
            supplieritem: '',
            fields: {
                index: {
                    label: "选择"
                },
                invoiceName: {
                    label: "发票类型"
                },
                invoiceTitle: {
                    label: "发票抬头"
                },
                companyAddress: {
                    label: "公司地址"
                },
                companyPhoneNumber: {
                    label: "公司电话"
                },
                bankAccount: {
                    label: "账号"
                },
                taxRegistrationNumber: {
                    label: "税号"
                },
                bankName: {
                    label: "开户行"
                },
            }
        }
    },
    computed: {
        ...mapState('supplier', [
            'supplierInfo'
        ]),
        supplierInvoiceInfoList: function() {
            let num = 0;
            num = this.supplierInfo.supplierInvoiceInfoList?this.supplierInfo.supplierInvoiceInfoList.length: 0
            return num
        }
    },
    created() {
        // this.getInvoiceType()
    },
    methods: {
        ...mapActions('supplier', [
            'getSupplierType',
            'addSupplierInvoice',
            'getSupplierInfo'
        ]),
        clearRadio: function(val) {
            this.supplieritem = ''
        },
        editInvoice: function () {
            if(!this.supplieritem) {
                Message({
                    type: 'info',
                    message: config.messInfo.select
                });
                return
            }
            this.$emit('showModal', this.supplieritem)
        },
        deleteInvoice: function() {
            if(!this.supplieritem) {
                Message({
                    type: 'warning',
                    message: '选择要删除的内容'
                })
                return
            }
            
            let params = []
            let obj = {
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
            for(let i in obj) {
                obj[i] = this.supplieritem[i]
            }
            obj.isDeleted = 1
            params.push(obj)
            this.addSupplierInvoice({
                poros: params,
                callBack: res => {
                    this.getSupplierInfo(
                        {
                            poros: {supplierCode: obj.supplierCode},
                            callBack: res => {
                                Message({
                                    type: 'success',
                                    message: config.messInfo.success
                                });
                                this.supplieritem = ''
                            },
                        }
                    )
                    
                }
            })
        },
        addInvoice: function() {
            this.$emit('showAddModal', this.supplierInfo.supplierCode, this.supplierInfo.supplierInvoiceInfoList?this.supplierInfo.supplierInvoiceInfoList.length:0)
        }
    }
}
</script>
