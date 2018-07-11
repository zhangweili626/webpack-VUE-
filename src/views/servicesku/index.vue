<template>
    <div>
        <b-card header="查询">
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="服务名称" :label-cols="4" class="text-right">
                        <div class="text-left">
                             <search 
                                ref="search"
                                :hasCheck="status.serviceCode"
                                :dataList="serviceList" 
                                option="serviceName" 
                                @dataChange="serviceQuerySelect"
                                @itemValue="serviceItemValue"
                                @clickShowBack="serviceFirstLoad"
                                @comScroll="serviceComScroll"
                                @clearValue="serviceClearValue"
                                >
                            </search>
                        </div>                      
                    </b-form-fieldset> 
                </div>
              <!--   <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="服务编码" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.serviceCode"></b-form-input>
                    </b-form-fieldset> 
                </div> -->
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset">重置</b-button>                        
                        <b-button size="sm" variant="primary" @click="query">查询</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card v-if="tableShow">
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="success" v-b-modal.insert>新增</b-button>
                        <b-button size="sm" variant="primary" v-b-modal.updata @click="editServiceSku">编辑</b-button> 
                        <b-button size="sm" variant="danger" @click="delateeditServiceSku">删除</b-button>                                           
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
            <b-table striped hover bordered show-empty :items="tableList" :fields="fields">
                <template slot="index" slot-scope="data">
                    <input type="radio" name="radio" @click="checkData(data.index)">
                </template>
                <template slot="skuCode" slot-scope="data">
                    <router-link :to='{
                        name:"servicesku-detail",
                        query:{
                            skuCode:data.item.skuCode,
                            disabled:true                            
                        }
                    }'>
                        {{data.item.skuCode}}
                    </router-link>
                </template>
                <template slot="serviceCode" slot-scope="data">
                    {{data.item.serviceCode}}
                </template>
                <template slot="serviceName" slot-scope="data">
                    {{data.item.serviceName}}
                </template>
                <template slot="skuBrandName" slot-scope="data">
                    {{data.item.skuBrandName}}
                </template>
                <template slot="skuCategoryName" slot-scope="data">
                    {{data.item.skuCategoryName}}
                </template>
                <template slot="originalCode" slot-scope="data">
                    {{data.item.originalCode}}
                </template>
                <template slot="barCode" slot-scope="data">
                    {{data.item.barCode}}
                </template>
                <template slot="skuCode" slot-scope="data">
                    {{data.item.skuCode}}
                </template>
                <template slot="skuName" slot-scope="data">
                    {{data.item.skuName}}
                </template>
                <template slot="needQty" slot-scope="data">
                    {{data.item.needQty}}
                </template>
                <template slot="remark" slot-scope="data">
                    {{data.item.remark}}
                </template>
                <template slot="empty">
                    暂无数据...                  
                </template>
            </b-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="pageChange" :page-no="pageData.pageNum" :page-size="pageData.pageSize" :total-result="pageData.total" :total-pages="pageData.pages">
                 </pagination>
               </div>
            </div>
        </b-card>
        <insertModal :serviceCode="serviceCode" @service-ok="serviceOk"></insertModal>
        <upDataModal :relationCode="relationCode" @service-ok="serviceOk"></upDataModal>        
    </div>
</template>
<script>
    import api from 'common/api'
    import config from 'common/config'
    import pagination from "components/pagination/pagination.vue";
    import search from "components/iris-search/search.vue";
    import insertModal from "./addservicesku.vue"
    import upDataModal from "./updataservicesku.vue" 
    import {Message, MessageBox} from "element-ui";
    export default {
        components: {
            pagination,
            search,
            insertModal,
            upDataModal
        },
        data() {
            return {
                params:{
                    pageNums:config.pageNums,
                    pageStart:1,
                    serviceCode:null,
                    onOffFlag:1
                },
                tableList:[],
                fields:{
                    index: {
                        label: "选择"
                    },
                    serviceCode:{
                        label: "服务编码"
                    },
                    serviceName:{
                        label: "服务名称"                        
                    },
                    skuBrandName:{
                        label: "品牌"                        
                    },
                    skuCategoryName:{
                        label: "分类"                        
                    },
                    originalCode:{
                        label: "原厂编码"                        
                    },
                    barCode:{
                        label: "69码"                                                
                    },
                    skuCode:{
                        label: "商品编码"                        
                    },
                    skuName:{
                        label: "商品名称"                        
                    },
                    needQty:{
                        label: "需要个数"                        
                    },
                    remark:{
                        label: "备注"                        
                    },
                },
                selectParams: {
                    pageNums: config.pageNums,
                    pageStart: 1,
                    skuType:1,
                }, 
                pageData:{},
                status:{
                    serviceCode:null,
                },
                serviceList:[],
                relationCode:null,
                checkIndex:null,
                tableShow:null,
                serviceCode:null
            }
        },
        methods:{
            serviceOk(value){
                const _this = this
                _this.params.serviceCode = value  
                _this.checkIndex = null
                _this.relationCode = null
                _this.queryArchives()                              
            },
            // 搜索框内值改变   触发搜索
            serviceQuerySelect(data) {
                const _this = this;
                _this.selectParams.pageStart = 1;
                _this.selectParams.serviceName = data;
                let params = _this.selectParams;
                _this.queryServiceInfoForPageByVo(params, function(res) {
                    _this.serviceList = res.list
                });
            },
            // 选中某一项    
            serviceItemValue(value) {
                const _this = this
                _this.params.serviceCode = value.serviceCode
            },
            // 第一次加载数据
            serviceFirstLoad() {
                const _this = this
                if(_this.serviceList.length != 0 ){
                    return 
                }
                let params = _this.selectParams
                _this.queryServiceInfoForPageByVo(params, function(res) {
                    _this.serviceList = res.list
                })
            },
            // 滚动加载
            serviceComScroll(isEnd) {
                if (isEnd) {
                    this.selectParams.pageStart ++
                    let params = this.selectParams;        
                    this.queryServiceInfoForPageByVo(params, obj => {
                        if(obj.list){
                            this.serviceList = this.serviceList.concat(obj.list);
                        }
                    });
                }
            },
            // 定义向后台请求服务的方法
            queryServiceInfoForPageByVo(params,callback) {
                api.serviceitem.queryByPage(params, res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        callback(obj);
                    }
                })
            },
            //服务下拉框清除事件
            serviceClearValue(){
                const _this  = this;
                _this.reset()               
            },
              //点击修改
            editServiceSku(){
                const _this = this;
                if(_this.checkIndex !== null){
                    _this.relationCode = _this.tableList[_this.checkIndex].relationCode
                }else{
                    Message({ 
                        type: 'warning', 
                        message: '请选择一条数据！'
                    });
                }
            },
            //列表单选框
            checkData(index){
                const _this = this;
                _this.checkIndex = index
            },
            query(){
                const _this = this;
                _this.params.pageStart = 1
                if(_this.params.serviceCode == null){
                    _this.status.serviceCode = true
                    _this.tableShow = false
                    return ;
                }
                _this.serviceCode = _this.params.serviceCode
                _this.status.serviceCode = null                
                _this.tableShow = true
                _this.queryArchives()
            },
            queryArchives(){
                const _this = this;
                _this.tableList = []
                api.serviceSku.queryServiceSkuRelationInfoForPageByVo(_this.params,(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.tableList = msg.data.obj.list
                        _this.pageData = msg.data.obj
                    }
                })
            },
            pageChange(value){
                const _this = this;
                _this.params.pageStart = value
                _this.queryArchives()
            },
            reset(){
                const _this = this;
                _this.params = {
                    serviceCode:null,
                    pageNums:config.pageNums,
                    pageStart:1,
                }
                _this.status = {
                    serviceCode:null,
                }
                _this.$refs.search.setValue()
                _this.tableShow = false
            },
            delateeditServiceSku(){
                const _this = this;
                if(_this.checkIndex !== null){
                        MessageBox.confirm('是否确认删除', '提示', {
                                confirmButtonText: '是',
                                cancelButtonText: '否',
                                type: 'info'
                        }).then(() => {
                            let params = _this.tableList[_this.checkIndex]
                            params.isDeleted = 1
                            api.serviceSku.editServiceSkuRelationInfo([params],(msg)=>{
                                if(msg.data.message == 'success'){
                                        Message({
                                        type: 'success',
                                        message: "操作成功！"
                                    });
                                _this.checkIndex = null
                                _this.relationCode = null
                                _this.queryArchives()                                    
                                }
                            })
                        }).catch(() => {
                        });
                    
                }else{
                    Message({ 
                        type: 'warning', 
                        message: '请选择一条数据！'
                    });
                }
            }
        },
        created () {
            const _this = this;
        }
    }
</script>
<style>

</style>

