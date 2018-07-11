<template>
    <div>
        <b-form-fieldset horizontal label="对账单类型" :label-cols="4" class="text-right">
            <b-form-select v-model="reconciliationType" :options="accountTypes" :disabled="disabled"/>    
        </b-form-fieldset>
    </div>
</template>
<script>
    import config from 'common/config'
    
    //私有组件
    import Bus from '../bus/bus.js'
    export default {
        data() {
            return {
                disabled:false,
                reconciliationType: '', //对账单类型
                //对账单类型数据
                accountTypes:config.statementAccount.accountType
            }
        },
        mounted(){
            Bus.$on('clearStatement', (data) => {
                this.reconciliationType = '';
            })
            Bus.$on('setReconciliationTypeValue', (data) => {
                this.reconciliationType = data;
            })
            Bus.$on('statementDisabled', (data) => {
                this.disabled = true;
            })
        },
        watch:{
            reconciliationType(val){
                let option;
                if(this.accountTypes.length > 0){
                    option = this.accountTypes.filter((data) => {
                        return data.value === val
                    });
                }
                Bus.$emit('reconciliationType', option[0])
            }
        }
    }
</script>


