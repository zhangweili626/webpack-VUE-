<template>
    <div class="card">
    </div>
</template>
<script>
    import Vue from 'vue'
    import { Tree } from 'element-ui'
    import api from 'common/api'
    import config from 'common/config'
    import pagination from "components/pagination/pagination.vue";
    import AreaTree from 'components/iris-areaqueryshop/index'
    import {Table, TableColumn, Input, Message, MessageBox , Tooltip} from "element-ui"
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Tooltip)
    export default {
        components: {
            Tree,
            pagination,
            AreaTree
        },
        data() {
            return {
            }
        },
        methods:{
            //查询数据字典
            getDataDictionarys(code,cb = ()=>{}){
                const _this = this;
                api.ref.getDataDictionarys({
                    refCode: code
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        let data  = msg.data.obj.referenceDetailInfos
                        let list = [{text:'',value:''}]
                        for (let i = 0; i < data.length; i++) {
                            list[i+1] = {
                                text:data[i].refDetailName,
                                value:data[i].refDetailCode
                            }
                        }
                        cb(list)
                    }
                })
            },
        },
        created () {
            const _this = this;
            _this.getDataDictionarys('PurchaseOrder',(msg)=>{
                _this.purchaseType = msg
            })
        }
    }
</script>
<style>

</style>

