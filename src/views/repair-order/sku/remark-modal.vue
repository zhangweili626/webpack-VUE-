<template>
<el-dialog class="border-none" size="large" title="备注信息"  :visible.sync="visible" :modal-append-to-body="false" ref="remark">
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
                商品编码: {{skuInfo.skuCode}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                商品名称: {{skuInfo.skuName}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                备货状态: {{status}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                型号: {{skuInfo.skuModel}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
                <span class="mt-3 mb-3">
                规格: {{skuInfo.skuStandards}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                69码: {{skuInfo.barCode}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                标准销售单价: {{skuItem.originalSalesPrice}} 元
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                数量: {{skuItem.nums}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                单位: {{skuInfo.checkUnitName}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                销售金额: {{skuItem.originalSalesPrice * skuItem.nums}} 元
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                折后价: {{skuItem.actualSalesPrice}} 元
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                商品折扣率:{{skuItem.discountRate}} %
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                折扣金额: {{skuItem.discountMoney}} 元
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                关联施工服务: <a href="javascript:;" v-show="relationService" @click="showService">是</a>
                <span v-show="!relationService">否</span>
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                施工费: {{skuItem.installationServiceActualPrice || 0}} 元
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                销售合计: {{(skuItem.installationServiceActualPrice - 0) + (skuItem.actualSalesPrice - 0)}} 元
            </span>
        </div>
    </b-row>	
    <b-row>
        <div class="col-md-12">
            <b-form-fieldset horizontal label="备注" :label-cols="1" class="text-right" :rows="3">
                <b-form-textarea id="textarea1"
                                v-model="skuItem.remark"
                                :rows="3"
                                :max-rows="6">
                </b-form-textarea>
            </b-form-fieldset>
        </div>
    </b-row>
    <!-- 施工服务remark -->
    <b-row class="mb-3" v-if="skuItem.installationServiceInfoVo && showServiceRemark">
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                服务编码: {{skuItem.installationServiceInfoVo.serviceCode}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                服务名称: {{skuItem.installationServiceInfoVo.serviceDisplayName}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                标准工时数: {{skuItem.installationServiceInfoVo.actualWorkHours}}
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                标准工时单价: {{skuItem.installationServiceInfoVo.actualWorkHourPrice}} 元
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                人工费折扣率: {{(1 - skuItem.installationServiceInfoVo.discountRate) * 100}} %
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                折扣金额: {{skuItem.installationServiceInfoVo.discountMoney}} 元
            </span>
        </div>
        <div class="col-md-4 pt-3">
            <span class="mt-3 mb-3">
                销售售价: {{skuItem.installationServiceInfoVo.originalSalesPrice}} 元
            </span>
        </div>
    </b-row>	
    <b-row v-if="skuItem.installationServiceInfoVo && showServiceRemark">
        <div class="col-md-12">
            <b-form-fieldset horizontal label="备注" :label-cols="1" class="text-right" :rows="3">
                <b-form-textarea id="textarea1"
                                v-model="skuItem.installationServiceInfoVo.remark"
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
        skuInfo: {
            type: Object,
            default: () => {}
        },
        carInfo: {
            type: Object,
            default: () => {}
        },
        skuItem: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            visible: false,
            remark: '',
            showServiceRemark: false
        }
    },
    computed: {
        status() {
            let detailStatus = this.skuItem.detailStatus
            if(detailStatus == 0) {
                return '缺货'
            }else if(detailStatus == 1) {
                return '已备货'
            }else if(detailStatus == 2) {
                return '已出库'
            }
        },
        relationService() {
            if(this.skuItem.installationServiceInfoVo) {
                return true
            }else {
                return false
            }
        }
    },
    methods: {
        show() {
            this.visible = true
            this.showServiceRemark = false
        },
        hide() {
            this.visible = false
        },
        showService() {
            this.showServiceRemark = true
        },
        confirmClick() {
            let serviceRemark = this.relationService 
                ? this.skuItem.installationServiceInfoVo.remark
                : ''
            this.$emit('confirmClick', this.skuItem.remark, serviceRemark)
            this.hide()
        }
    }
}
</script>
<style>
.border-none .card {
    border: none;
}
</style>

