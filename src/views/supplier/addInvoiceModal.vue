<template>
    <div class="animated fadeIn supplier-mayuhui">
        <b-modal id="addInvoiceModal" ref="addInvoiceModal" :title="'新增供应商发票信息'" hide-footer>
            <v-invoice ref="supplierInvoice" @hideModal="hide" :supplierCode="addSupplierCode" :listLength="invoiceListLength"></v-invoice>
        </b-modal>
    </div>
</template>
<script>
import VInvoice from './supplierinvoice'

export default {
    components: {
        VInvoice,
    },
    data() {
        return {
            invoiceListLength: 0,
            addSupplierCode: '',
        }
    },
    methods: {
        hide() {
            this.$refs.addInvoiceModal.hide();
        },
        show(code, num) {
            this.invoiceListLength = parseInt(num);
            this.addSupplierCode = code;
            this.$refs.supplierInvoice.clearInvoice()
            this.$refs.addInvoiceModal.show();
        },
    }

}
    
</script>
<style>
    .supplier-mayuhui .modal-dialog {
        max-width: 800px !important;
    }
</style>

