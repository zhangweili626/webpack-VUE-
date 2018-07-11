<template>
    <div class="row">
        <div class="col-md-12 text-right">
            <b-button size="sm" @click="myReset" v-if="showReset" variant="default">{{resetText}}</b-button>
            <b-button size="sm" :variant="queryBtnVar" @click="myQuery">{{queryText}}</b-button>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        resetText: {
            type: String,
            default: '重置'
        },
        queryText: {
            type: String,
            default: '查询'
        },
        showReset: {
            type: Boolean,
            default: true
        },
        queryBtnVar: {
            type: String,
            default: 'primary'
        }
    },
    methods: {
        myReset() {
            this.$emit('resetClick')
        },
        myQuery() {
            this.$emit('query')
        }
    }
}
</script>
<style>

</style>