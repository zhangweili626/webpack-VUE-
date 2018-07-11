<template>
<div class="animated fadeIn">
    <!-- 卡信息 -->
    <card-info @cardSaleInfo='getCardSaleInfo'></card-info>
    <!-- 卡内容 和 卡适用范围 -->
    <card-content :cardSaleInfo='cardSaleInfo'></card-content>
    <!-- 收款明细 -->
    <receivables-detail :cardSaleInfo='cardSaleInfo'></receivables-detail>
    <!-- 发票明细 -->
    <invoice-detail :cardSaleInfo='cardSaleInfo'></invoice-detail>
</div>
</template>
<script>

import CardInfo from './card-info'
import CardContent from './card-content'
import ReceivablesDetail from './receivables-detail'
import InvoiceDetail from './invoice-detail'

export default {
    components: {
       CardInfo,
       CardContent,
       ReceivablesDetail,
       InvoiceDetail
    },
    data() {
        return {
            cardSaleInfo: {}
        }
    },
    methods: {
        getCardSaleInfo(info) {
            this.cardSaleInfo = info
        }
    }
}
</script>

