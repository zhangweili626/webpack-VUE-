<template>
    <div class="animated fadeIn">
         <b-modal id="modalPay" size="lg" title="充值" ref="modalPay">
			 <div class="container-fluid">
                <b-row>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="卡号" :label-cols="4" class="text-right">
                            <b-form-input/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="卡名称" :label-cols="4" class="text-right">
                            <b-form-input/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="客户名称" :label-cols="4" class="text-right">
                            <b-form-input/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="手机号" :label-cols="4" class="text-right">
                            <b-form-input/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="来源渠道" :label-cols="4" class="text-right">
                            <b-form-input/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="门店名称" :label-cols="4" class="text-right">
                            <b-form-input/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="卡内金额" :label-cols="4" class="text-right">
                            <b-form-input/>
                        </b-form-fieldset>
                    </div>
                     <div class="col-md-6">
                        <b-form-fieldset horizontal label="应退金额" :label-cols="4" class="text-right">
                            <b-form-input/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="应退总金额" :label-cols="4" class="text-right">
                            <b-form-input/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="退款手续费" :label-cols="4" class="text-right">
                            <b-form-input/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="实退金额" :label-cols="4" class="text-right">
                            <b-form-input/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12">
                        <b-form-fieldset horizontal label="说明" :label-cols="2" class="text-right">
                            <b-form-input/>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-12">
                        <b-form-fieldset horizontal label="备注" :label-cols="2" class="text-right">
                            <b-form-textarea></b-form-textarea>
                        </b-form-fieldset>
                    </div>
                </b-row>
			 </div>
			<div slot="modal-footer" class="w-100">         				
				<b-btn size="sm" class="float-right" variant="success" @click="sureRefund">退款</b-btn>
				<b-btn size="sm" class="float-right mr-2" variant="seconday" @click="cancelModal">取消</b-btn>
			</div>
		</b-modal>
    </div>
</template>
<script>
import Vue from "vue"
import suitScope from 'components/iris-suitscope'
import { Message } from "element-ui"
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'


//  已添加扩展信息条目 cardInfo
// 选择确定触发事件sureRefund
export default {
    components: {
    },
    props: {
        cardInfo: {
                type: Array,
                default: function() {
                    return [];
                }
            },
    },
    data() {
        return {       
           
        }
    },
    computed: {
       
    },
    created() {
        
    },
    methods: {
        sureRefund() {
            this.$emit('sureRefund', this.selModelAdd);
            this.$refs.modalPay.hide();
        },
        cancelModal() {
            this.$refs.modalPay.hide();
        },
        showModal() {
            this.$refs.modalPay.show();
        },
    },
    watch:{
        
    }
}
</script>

<style scoped>
.car-add-search{
	padding: 5px 14px;
}
.car-add-box{
	width: 100%;
	height: 300px;
	overflow: auto;
}
.checkbox-box{
	display: block;
}
.add-box{
    width: 250px;
}
</style>
