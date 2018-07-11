<template>
<el-dialog class="border-none" size="large" title="备注信息"  :visible.sync="visible" :modal-append-to-body="false">
<b-card>
    <b-row class="mb-3">
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                订单号: {{orderNo}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                车牌: {{carInfo.plateNumber}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                车型: {{carInfo.displayName}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                服务编码: {{serviceItem.serviceCode}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                服务名称: {{serviceItem.serviceName}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                服务类型: {{serviceItem.priceType | priceType}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                标准工时数: {{serviceItem.actualWorkHours}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                标准工时单价: {{serviceItem.actualWorkHourPrice}} 元
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                备货状态: {{status}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                人工费折扣率: {{serviceItem.discountRate}} %
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                折扣金额: {{serviceItem.discountMoney}} 元
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                销售售价: {{serviceItem.originalSalesPrice}} 元
            </span>
        </div>
    </b-row>	
    <b-row>
        <div class="col-md-12">
            <b-form-fieldset horizontal label="备注" :label-cols="1" class="text-right" :rows="3">
                <b-form-textarea id="textarea1"
                                v-model="serviceItem.remark"
                                :rows="3"
                                :max-rows="6">
                </b-form-textarea>
            </b-form-fieldset>
        </div>
    </b-row>
</b-card>
    <div slot="footer" class="dialog-footer dialog-footer-cla">         				
        <b-btn size="sm" class="float-right" variant="success" @click="confirmClick" >确定</b-btn>
        <b-btn size="sm" class="float-right mr-2" variant="seconday" @click="hide" >取消</b-btn>
    </div>
</el-dialog>
</template>
<script>
export default {
    props: {
        orderNo: {
            type: String,
            default: ''
        },
        // skuInfo: {
        //     type: Object,
        //     default: () => {}
        // },
        carInfo: {
            type: Object,
            default: () => {}
        },
        serviceItem: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            visible: false,
        }
    },
    computed: {
        status() {
            let detailStatus = this.serviceItem.detailStatus
            if(detailStatus == 0) {
                return '缺货'
            }else if(detailStatus == 1) {
                return '已备货'
            }else if(detailStatus == 2) {
                return '已出库'
            }
        }
    },
    methods: {
        show() {
            this.visible = true
        },
        hide() {
            this.visible = false
        },
        confirmClick() {
            this.$emit('confirmClick', this.serviceItem.remark)
            this.hide()
        }
    },
    filters: {
        priceType(val) {
            if(val == 1) {
                return '固定价格'
            }else if(val == 2) {
                return '非固定价格'
            }else if(val == 3) {
                return '自定义价格'
            }
        },
    }
}
</script>
<style>
.border-none .card {
    border: none;
}
</style>
