<template>
    <div class="animated fadeIn">
        <b-card header="查询">
             <div class="row">    
                <div class="col-md-7">
                    <b-form-fieldset horizontal label="门店" :label-cols="4" class="text-right">
                        <AreaTree @select-change="selectedfun" ref="areaqueryshop" :storeAll='true'></AreaTree>
                    </b-form-fieldset>
                 </div>
             </div>
            <query-btn-group @resetClick="reset" @query="search"></query-btn-group>
        </b-card>
        <b-card>
            <div class="row">              
                <div class="col-md-6">
                    <b-button size="sm" variant="danger" @click="del" v-if="isEditStoreService">删除</b-button>
                    <b-button size="sm" variant="primary" @click="eidt" v-if="isEditStoreService">编辑</b-button>                                                              
                </div>
                <div class="col-md-6 text-right"  v-if="isEditStoreService">
                    <v-upload 
                        buttonName='导入' 
                        :confirmStr="uploadConfirmStr"
                        :show-back="showBackData"
						:add-params="uploadParams" 
                        :url='analysisUrl'
                        v-on:updateData="search(1)">
                    </v-upload>                                                           
                    <b-button size="sm" variant="defalut" @click="exportTab">下载模板</b-button>                                                              
                </div>
            </div>
            <div class="table-scrollable mb-2 service-manhour">
                <b-table striped hover bordered show-empty empty-text="暂无数据" :items="tableList" :fields="fields">
                    <template slot="checkbox" slot-scope="data">
                        <input type="checkbox" name="checkbox1" v-model="selCont" :value="data.item"/>
                    </template> 
                </b-table>
            </div>
            <div class="row"> 
                <div class="col-md-12">
                    <pagination class="pull-right" 
                    @page-change="search" 
                    :page-no="pages.pageNo" 
                    :page-size="paginationData.pageSize" 
                    :total-pages="pages.totalPages" 
                    :total-result="pages.total">
                    </pagination>
                </div>
            </div>
         </b-card>
         <edit-modal ref="editModal" @sure="search(1)"></edit-modal>
         <div hidden id="modelTabe">
            <table>
                <thead>
                    <tr>
                        <th>门店编码</th>
                        <th>门店名称</th>
                        <th>服务编码</th>
                        <th>服务编码</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
         </div>
    </div>
</template>
<script>
import Vue from "vue"
import XLSX from "xlsx"
import {mapState, mapMutations, mapActions} from 'vuex'
import Pagination from 'components/pagination/pagination'
import AreaTree from 'components/iris-areaqueryshop/index'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import {Table, TableColumn, Message, MessageBox, DatePicker } from "element-ui"
import common from 'common/common.js'
import {RETURN_TO_SUPPLIEROR_DER_SEQ} from 'common/sequence.js'
import {CHANNEL_CODE} from 'common/ref-code.js'
import {hasBtn} from 'common/api-common.js'
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'
import filters from 'common/filters'
import selectSearch from '../sale-discount/selectSearch'
import editModal from './edit-modal'
import mock from '../../mock'
import vUpload from "components/import-exel"


Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);

export default {
    components: {
       QueryBtnGroup,
       Pagination,
       AreaTree,
       selectSearch,
       editModal,
       vUpload,
    },
    data() {
        return {
            selCont: [],
            paginationData: {
                total: 0,
                totalPages: 1,
                pageNo: 1,
                pageSize: config.pageNums
            },
            pages: {
                pageNo: 1,
                totalPages: 1,
                total: 1,
            },
            searchModel: {
                storeCodes: [],
            },
            fields: {
                checkbox: {
                    label: '选择'
                },
                storeCode: {
                    label: '门店编码'
                },
                storeName: {
                    label: '门店名称'
                },
                serviceCode: {
                    label: '服务编码'
                },
                serviceName: {
                    label: '服务名称'
                },
            },
            tableList: [],
            uploadConfirmStr: '导入列表信息将覆盖已有列表信息，请确认操作？',
            uploadParams: {
                relationCode: config.storeAppointmentService.uploadExeclCode,
                singleFlag: '1',
                businessType: ''
            },
            showBackData: {
                importOrinsertFlag: 1,
            },
            analysisUrl: collectionApi.storeAppointmentService.parseStoreServiceInfoExcelFile,
        }
    },
    computed: {
        isEditStoreService(){
				return hasBtn(collectionApi.storeAppointmentService.editStoreServiceInfoList);
            },
    },
    created() {
        
    },
    methods: {
        //区域选择门店
        selectedfun(data, data1) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            if(data1 instanceof Array){
                _this.searchModel.storeCodeSet = []
                for (let i = 0; i < data1.length; i++) {
                    _this.$set(_this.searchModel.storeCodes, i, data1[i].value)              
                }
            }else{
                options.storeCodeSet.push(data1.value);
                _this.searchModel.storeCodes = [data1.value]
            }
        },
        reset() {
           for(let key of Object.keys(this.searchModel)) {
               this.searchModel[key] = '';
           }
            this.$refs.areaqueryshop.reset();
            this.$refs.areaqueryshop.resetToStart();
            this.paginationData.total = 0;
            this.paginationData.totalPages = 0;
        },
        search(pageNo){
            pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
            let param = Object.assign({}, this.searchModel);
            param.pageStart = this.paginationData.pageNo;
            param.pageNums = this.paginationData.pageSize;
            api.storeAppointmentService.queryStoreServiceInfos(param, res => {
                if (res.data.code === "success") {
                   this.pages = {
                        pageNo: param.pageStart,
                        total:  res.data.obj.total,
                        totalPages: res.data.obj.pages
                    }
                    this.tableList = res.data.obj.list;
                }
            });
         
        },
        del() {
            if(this.selCont.length == 0) {
                Message({
                    message: '未选择删除项!',
                    type: 'warning'
                });
                return;
            };
            MessageBox.confirm('确定删除所选服务吗？', '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let param = [];
                for(let [i, item] of this.selCont.entries()) {
                    item.importOrinsertFlag = 0;
                    item.isDeleted = 1;
                    param.push(item);
                }
                api.storeAppointmentService.editStoreServiceInfoList(param, res => {
                    if (res.data.code === "success") {
                        Message({
                            type: "success",
                            message: "删除成功"
                        });
                        this.search(1);
                        this.selCont = [];
                    }
                })
            }).catch(() => {
            });
            
        },
        eidt() {
            this.$refs.editModal.show();
        },
        // 导出表格
        exportTab() {
            let _this = this;
            let worksheet = XLSX.utils.table_to_book(
                document.getElementById("modelTabe")
            );
            XLSX.writeFile(worksheet,"门店推荐服务.xlsx");
        },
    },
    filters:{
    }
}
</script>
<style>

</style>
