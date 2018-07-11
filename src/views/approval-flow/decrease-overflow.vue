<template>
	<div>
		<b-card :header="`报损报溢单：${params.adjustNo}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;审批状态：${params.wfStatu}`">
            <div class="row">
                <div class="col-md-12">
                    <div class="row">
                        <div class="col-md-6">
                            <b-form-fieldset horizontal label="调整商品类型*" :label-cols="4" class="text-right">
                                <b-form-select :disabled="createdAdjustStatus" v-model="params.adjustSkuType" :options="adjustSkuType"></b-form-select>                            
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6 col-lg-6">
                            <b-form-fieldset label="选择经销商店*" :label-cols="4" horizontal class="text-right">
                                <areaqueryshop :readonly="createdAdjustStatus" ref="areaqueryshop"  @select-change="selectedfun"></areaqueryshop>
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6 col-lg-6">
                            <b-form-fieldset horizontal label="仓库名称*" :label-cols="4" class="text-right">
                                <b-form-select :disabled="createdAdjustStatus"  :state="status.whCodeState" v-model="params.whCode" :options="entreList"></b-form-select>
                            </b-form-fieldset> 
                        </div>
                    </div>
                </div>
            </div> 
        </b-card>
        <b-card header="报损报溢明细">
        	
        </b-card>
	</div>
</template>

<script>
	export default{
		
	}
</script>

<style>
</style>