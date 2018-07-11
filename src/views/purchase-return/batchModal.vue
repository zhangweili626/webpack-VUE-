<template>
    <b-modal id="model" ref="myModalRef2" size="lg" ok-title="批次查看">
        <div class="container-fluid">
            <div class="table-scrollable sku-model">
                <b-table striped hover bordered show-empty :items="tableList" :fields="fields">
                    <template slot="empty">
                        暂无数据...                  
                    </template>
                </b-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="batchPageChange" :page-no="pageData.pageNum" :page-size="pageData.pageSize" :total-result="pageData.total" :total-pages="pageData.pages">
                 </pagination>
               </div>
            </div>
        </div>
        <div slot="modal-footer" class="w-100">         				
				<b-btn size="sm" class="float-right mr-2" variant="seconday" @click="cancelModal2">返回</b-btn>
			</div>
    </b-modal>
</template>
<script>
import Vue from 'vue'
import api from "common/api";
import config from "common/config";   
import common from "common/common.js"
import collectionApi from 'common/api-collection.js'
import { DatePicker, Message, MessageBox, Input, Button} from "element-ui";
import pagination from "components/pagination/pagination.vue";
import search from "components/iris-search/search.vue";
import {PURCHASE_RETURN_ORDERINFO_SEQ, PURCHASE_RETURN_SKUDETAIL_SEQ} from 'common/sequence.js'
import {getSequence, getSequenceList} from 'common/api-common.js'
Vue.use(Input)
Vue.use(Button)
export default {
    components: {
        search,
        pagination
    },
    props: {
        whCode:{
            type: String,
            default: function(){
                return ""
            }
        },
        skuCode:{
            type: String,
            default: function(){
                return ""
            }
        },
        outSourceNo:{
            type: String,
            default: function(){
                return ""
            }
        },
    },
    data() {
        return {
            params:{
                 pageNums: config.pageNums,
            },
            tableList:[],
            pageData:{},
            fields:{
                skuCode:{
                    label: "商品编码"
                },
                skuName  :{
                    label: "商品名称"                        
                },
                inBatchNo:{
                    label: "入库批次号"                                            
                },
                stockNums:{
                    label: "数量"                                            
                },
            },
            
        }
    },
    methods: {
        batchPageChange(value){          
            this.params.pageStart = value
            this.queryBatch();
        },
        //显示
        show(){
            this.$refs.myModalRef2.show()     
            this.params.pageStart = 1
            setTimeout(() => {
                this.queryBatch();
            }, 200)
            
        },
        queryBatch(){          
                this.params.whCode = this.whCode;
                this.params.skuCode = this.skuCode;
                this.params.outSourceNo = this.outSourceNo;
                this.tableList = []            
                api.purchaseReturn.queryStockDetailBatch(this.params,(msg)=>{
                        if(msg.data.message == 'success'){
                            this.pageData = msg.data.obj;
                            this.tableList = msg.data.obj.list;
                        }
                    })
        },
        cancelModal2() {
            this.$refs.myModalRef2.hide();
        }
    
    }
}
</script>
<style>
    .modal-dialog {
        margin: 80px auto !important;
    }
    .fatherControlSpecial>.purchaseManageTable {
        margin-top: 80px;
    }
    .fatherControlSpecial>.purchaseManageTable:first-child {
        margin-top: 0px;
    }
    .sku-model{
        max-height: 350px;
        overflow: auto; 
    }
</style>

