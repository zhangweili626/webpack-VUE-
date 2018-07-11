<template>
<div class="animated fadeIn">
    <query :status-options="statusOptions" @check="check"></query>
    <listbody ref="listbody" :status-options="status"></listbody>
</div>
</template>
<script>
import Query from "./query";
import Listbody from "./listbody";

export default {
    components: {
        Query,
        Listbody
    },
    data() {
        return {
            toListbody: {},
            statusOptions: [
                {text: '', value: ''},
                {text: '启用', value: 0},
                {text: '停用', value: 1}                                               
            ],
            status: [
                {text: '启用', value: 0},
                {text: '停用', value: 1} 
            ]
        }
    },
    methods: {
        getQueryParams(queryParams) {
            this.toListbody = queryParams;
        },
        check(index){
            this.$refs.listbody.check(index)
        },
    }
};
</script>
<style>

</style>