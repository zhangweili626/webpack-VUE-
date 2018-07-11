<template>
<div class="animated fadeIn">
    <div class="row">
        <div class="col-md-12">
            <b-card header="供应商财务信息">
                <div class="row">
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="自采单号" :label-cols="4" class="text-right">
                            <b-form-input  v-model="detailInfo.spoOrderNo" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="批次号" :label-cols="4" class="text-right">
                            <b-form-input  v-model="detailInfo.spoBatchNo" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="供应商" :label-cols="4" class="text-right">
                            <b-form-input  v-model="detailInfo.supplierName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="账号" :label-cols="4" class="text-right">
                            <b-form-input  v-model="detailInfo.bankAccount" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="税号" :label-cols="4" class="text-right">
                            <b-form-input  v-model="detailInfo.taxRegistrationNumber" readonly/>
                        </b-form-fieldset>
                    </div>
                 
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="发票类型" :label-cols="4" class="text-right">
                            <b-form-input  v-model="detailInfo.invoiceTypeName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="开户行" :label-cols="4" class="text-right">
                            <b-form-input  v-model="detailInfo.bankName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="联系人" :label-cols="4" class="text-right">
                            <b-form-input  v-model="detailInfo.supplierContactName" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="联系电话" :label-cols="4" class="text-right">
                            <b-form-input  v-model="detailInfo.supplierContactPhone" readonly/>
                        </b-form-fieldset>
                    </div>
                </div>
            </b-card>
        </div>
    </div>

    <!-- listbody -->
    <div class="row">
        <div class="col-md-12">
            <b-card>
                <div class="row">
                    <div class="col-md-4"></div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="运费" :label-cols="4" class="text-right">
                            <b-form-input  :value="detailInfo.totalFreightFee | toFixed" readonly/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="到货金额 (含税)" :label-cols="4" class="text-right">
                            <b-form-input  :value="detailInfo.totalAmount | toFixed" readonly/>
                        </b-form-fieldset>
                    </div>
                </div>
                <div class="table-scrollable mb-2">
                    <b-table striped hover bordered 
                        show-empty empty-text="暂无数据" 
                        :items="detailInfo.spoSkuDetailInfoVos" 
                        :fields="fields">   
                        <template slot="purchaseFee" slot-scope="row">{{row.value | toFixed}}</template>
                        <template slot="totalAmount" slot-scope="row">{{row.value | toFixed}}</template>
                        <!-- <template slot="purchaseUnitName" slot-scope="row">{{row.value | unitfilter}}</template>  -->
                    </b-table>
                </div>

                <list-btn-group 
                    @init="arriveComfirm" 
                    :showInsert="false"
                    :showUpdate="false"
                    :initOptions="{
                        size: 'sm',
                        variant: 'success', 
                        name: '到货确认',       
                    }">
                </list-btn-group>
            </b-card>
        </div>
    </div>
</div>
</template>
<script>

import ListBtnGroup from 'components/list-btn-group/list-btn-group'

import api from 'common/api'
import { alertSuccess } from 'common/api-common'

import { mapGetters, mapActions } from 'vuex'

export default {
    components: { 
        ListBtnGroup
    },
    data() {
        return {
            fields: {
                spoOrderNo: {
                    label: '自采单号'
                },
                skuCode: {
                    label: '零件编码'
                },
                skuTempCode: {
                    label: '临时编码'
                },
                skuName: {
                    label: '零件名称'
                },
                purchaseUnitName: {
                    label: '核算单位'
                },
                reqNums: {
                    label: '要货数量'
                },
                skuNums: {
                    label: '采购数量'
                },
                arrivalNums: {
                    label: '实际到货数量'
                },
                purchaseFee: {
                    label: '单价'
                },
                totalAmount: {
                    label: '金额'
                },
                brandName: {
                    label: '品牌'
                },
                skuModel: {
                    label: '型号'
                },
                skuStandards: {
                    label: '规格'
                },
                externalCode: {
                    label: '外部编码'
                },
                barCode: {
                    label: '69码'
                },
                originalCode: {
                    label: '原厂编码'
                }
            },
            detailInfo: {},
        }
    },
    computed: {
        ...mapGetters('storeStation', [
            'arriveHandleParams'
        ])
    },
    mounted() {
        this.getDetailByCode()
    },
    methods: {
        getDetailByCode() {
            let params = {
                spoBatchNo: this.$route.query.spoBatchNo
            }
            api.arriveHandle.getDetailByCode(params).then(res => {
                if(res.data.code === 'success') {
                    this.detailInfo = res.data.obj
                }
            })
        },
        arriveComfirm() {
            let params = JSON.parse(JSON.stringify(this.detailInfo))
            params.orderStatus = 3
            api.arriveHandle.arriveComfirm([params]).then(res => {
                alertSuccess(res, () => {
                    this.getArriveHandleInfo(this.arriveHandleParams)
                    this.$router.push({
                        path: 'query'
                    })
                })
            })
        },
        ...mapActions('storeStation', [
            'getArriveHandleInfo'
        ])
    },
    filters: {
        // unitfilter(val) {
        //     return '个'
        // },
        toFixed(val) {
            if(val != null) {
                return val.toFixed(2)
            }
        }
    }
};
</script>