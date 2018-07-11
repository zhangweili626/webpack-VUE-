<template>
<div class="animated fadeIn">
    <query :status-options="statusOptions"></query>
    <listbody :status-options="statusOptions"></listbody>
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
                {text: '启用', value: 0},
                {text: '停用', value: 1}                                               
            ],
        }
    },
    methods: {
        getQueryParams(queryParams) {
            this.toListbody = queryParams;
        },
    }
};
</script>
<style>

</style>