<template>
<div class="row">
    <div class="col-md-12">
        <b-button 
            v-if="showInsert"
            :disabled="disabledInsert"
            :size="insertOptions.size" 
            :variant="insertOptions.variant" 
            @click="insertClick">{{insertOptions.name}}</b-button>
        <b-button 
            v-if="showUpdate"
            :disabled="disabledUpdate"
            :size="updateOptions.size" 
            :variant="updateOptions.variant" 
            @click="updateClick">{{updateOptions.name}}</b-button>
        <b-button 
            v-if="showInit"
            :disabled="disabledInit"
            :size="initOptions.size" 
            :variant="initOptions.variant" 
            class="pull-right" 
            @click="initClick">{{initOptions.name}}</b-button>
    </div>
</div>
</template>
<script>
const insertOptions = {
    size: 'sm',
    variant: 'success', 
    name: '新增',
    // show: true        
}
const updateOptions = {
    size: 'sm',
    variant: 'primary', 
    name: '编辑',
    // show: true        
}
const initOptions = {
    size: 'sm',
    variant: 'warning', 
    name: '同步数据',
    // show: true        
}
export default {
    props: {
        insertOptions: {
            type: Object,
            default: () => insertOptions
        },
        updateOptions: {
            type: Object,
            default: () => updateOptions
        },
        initOptions: {
            type: Object,
            default: () => initOptions
        },
        showInsert: {
            type: [Boolean], 
            default: true,
        },
        showUpdate: {
            type: [Boolean], 
            default: true,
        },
        showInit: {
            type: [Boolean], 
            default: true,
        },
        disabledInsert: {
            type: [Boolean], 
            default: false,
        },
        disabledUpdate: {
            type: [Boolean], 
            default: false,
        },
        disabledInit: {
            type: [Boolean], 
            default: false,
        },
    },
    methods: {
        insertClick() {
            this.$emit('insert')
        },
        updateClick() {
            this.$emit('update')
        },
        initClick() {
            this.$emit('init')
        }
    },
}
</script>

