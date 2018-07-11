<template>
<div class="row">
    <div class="col-md-4">
        <b-form-fieldset horizontal label="商品名称" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.skuName" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="型号" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.skuModel" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="品牌" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.brandName" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="净重" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.netWeight" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="目录" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.catlogName" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="分类" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.categoryName" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="质保天数" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.warrantyDays" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="原厂编码" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.originalCode" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="产地" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.skuAreaName" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="外部编码" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.externalCode" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="规格" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.skuStandards" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="69码" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.barCode" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="毛重" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.grossWeight" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="包装类型" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.packName" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="长" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.skuLong" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="宽" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.skuWeight" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="高" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.skuHeight" readonly/>
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="状态" label-text-align="right" :label-cols="4">
            <b-form-input :value="skuInfo.onOffFlag | flagFilter" readonly/>                                   
        </b-form-fieldset>
    </div>
    <div class="col-md-4">
        <b-form-fieldset horizontal label="备注" label-text-align="right" :label-cols="4">
            <b-form-input v-model="skuInfo.remark" readonly/>
        </b-form-fieldset>
    </div>
</div>
</template>
<script>
export default {
    props: {
        skuInfo: {
            type: Object,
        }
    },
    filters: {
        flagFilter(val) {
            if(val == 0) {
                return '下架'
            }else if(val == 1) {
                return '上架'
            }
        }
    }
}
</script>
