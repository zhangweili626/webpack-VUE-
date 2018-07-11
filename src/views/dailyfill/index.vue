<template>
    <div>
        <b-card header="查询">
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset label="选择经销商店" :label-cols="4" horizontal class="text-right">
                        <areaqueryshop :storeAll="true"  ref="areaqueryshop"  @select-change="selectedfun"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="仓库名称" :label-cols="4" class="text-right">
                        <b-form-select v-model="params.whCode" :options="entreList"></b-form-select>
                    </b-form-fieldset> 
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="补货单号" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.replenishmentPlanNo"></b-form-input>                        
                    </b-form-fieldset> 
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset()">重置</b-button>                        
                        <b-button size="sm" variant="primary" @click="query()">查询</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="danger" @click="deletedailyfill">删除</b-button>          
                        <b-button size="sm" variant="primary" @click="editdailyfill">编辑</b-button>                                                          
                        <b-button size="sm" variant="success" @click="adddailyfill">新增计划</b-button>
                        <b-button size="sm" variant="primary" @click='immediateAttentionByCode'>立即处理</b-button>                                                                                  
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
            <b-table striped hover bordered show-empty :items="tableList" :fields="fields">
                <template slot="index" slot-scope="data">
                    <input type="radio" name="radio" @click="tableIndex(data.index)">
                </template>
                <template slot="replenishmentPlanNo" slot-scope="data">
                    <router-link :to='{name:"dailyfill-detail",query:{
                        replenishmentPlanNo:data.item.replenishmentPlanNo,
                        disabled:true
                    }}'>
                        {{data.item.replenishmentPlanNo}}
                    </router-link>
                </template>
                <template slot="storeName" slot-scope="data">
                    {{data.item.storeName}}
                </template>
                <template slot="whName" slot-scope="data">
                    {{data.item.whName}}
                </template>
                <template slot="replenishmentPlanPeriod" slot-scope="data">
                    {{data.item.replenishmentPlanPeriod}}
                </template>
                <template slot="lastOperateDate" slot-scope="data">
                    {{data.item.lastOperateDate}}
                </template>
                <template slot="nextOperateDate" slot-scope="data">
                    {{data.item.nextOperateDate}}
                </template>
                <template slot="skuModel" slot-scope="data">
                    {{data.item.skuModel}}
                </template>
                <template slot="replenishmentPlanStatus" slot-scope="data">
                    {{data.item.replenishmentPlanStatus == '0'?'启用':'停用'}}
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
    </div>
</template>
<script>
    import { Tree } from 'element-ui'
    import api from 'common/api'
    import config from 'common/config'
    import pagination from "components/pagination/pagination.vue";
    import areaqueryshop from "components/iris-areaqueryshop/";    
    import {Message, MessageBox} from "element-ui";
    export default {
        components: {
            Tree,
            pagination,
            areaqueryshop
        },
        data() {
            return {
                params:{
                    pageNums:config.pageNums,
                    pageStart:1,
                    storeCodes:[],
                    whCode:null
                },
                fields:{
                    index: {
                        label: "选择"
                    },
                    replenishmentPlanNo:{
                        label: "补货单号"
                    },
                    storeName:{
                        label: "门店"                        
                    },
                    whName:{
                        label: "仓库"                        
                    },
                    replenishmentPlanPeriod:{
                        label: "补货周期"                        
                    },
                    lastOperateDate:{
                        label: "最近一次执行时间"                        
                    },
                    nextOperateDate:{
                        label: "预计下次执行时间"                        
                    },
                    replenishmentPlanStatus:{
                        label: "状态"                        
                    },
                },
                pageData:{},
                index:null,
                tableList:[],//tab列表数据
                entreList:[],//仓库列表
            }
        },
        methods:{
            immediateAttentionByCode(){
                const _this = this
                if(_this.index == null){
                    Message({ 
                        type: 'warning', 
                        message: '请选择数据！'
                    });
                }else{
                    let data  = _this.tableList[_this.index]
                    if(data.replenishmentPlanStatus == 0){
                        api.requirement.immediateAttentionByCode({
                            id:data.id,
                            replenishmentPlanNo:data.replenishmentPlanNo,
                            replenishmentPlanPeriod:data.replenishmentPlanPeriod,
                            replenishmentPlanStatus:data.replenishmentPlanStatus
                        },(msg)=>{
                            if(msg.data.message ==  'success'){
                                Message({ 
                                    type: 'success', 
                                    message: '立即处理成功！'
                                });
                            }                    
                        })
                    }else{
                        Message({ 
                            type: 'warning', 
                            message: '请选择启用数据！'
                        });
                    }
                }
            },
            reset(){
                const _this = this;
                _this.params= {
                    pageNums:config.pageNums,
                    pageStart:1,
                    storeCodes:[],
                    whCode:null
                }
                _this.$refs.areaqueryshop.reset()                
                _this.$refs.areaqueryshop.resetToStart()
            },
            //点击编辑
            editdailyfill(){
                const _this = this;
                if(_this.index == null){
                    Message({ 
                        type: 'warning', 
                        message: '请选择一条数据'
                    });
                }else{
                     _this.$router.push({name:"dailyfill-updata",query:{
                        replenishmentPlanNo:_this.tableList[_this.index].replenishmentPlanNo,
                        disabled:false
                    }}) 
                }
            },
            //点击删除按钮
            deletedailyfill(){
                const _this = this;
                if(_this.index == null){
                    Message({ 
                        type: 'warning', 
                        message: '请选择一条数据'
                    });
                }else{
                    MessageBox.confirm('是否确认删除', '提示', {
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        type: 'info'
                    }).then(() => {
                    _this.tableList[_this.index].isDeleted = 1
                        api.dailyfill.updateReplenishmentPlanInfo(_this.tableList[_this.index],(msg)=>{
                            if(msg.data.message ==  'success'){
                                Message({ 
                                    type: 'success', 
                                    message: '删除成功！'
                                });
                                _this.query()
                            }else{
                                Message({ 
                                    type: 'error', 
                                    message: '删除失败！'
                                });
                            }
                        })
                    }).catch(() => {
                    });
                }
            },
            //记录下标
            tableIndex(value){
                const _this = this
                _this.index = value
            },
            //查询列表
            query(){
                const _this = this;
                _this.index = null
                _this.tableList = []                
                _this.params.pageStart = 1
                api.dailyfill.queryReplenishmentPlanInfos(_this.params,(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.tableList = msg.data.obj.list
                        _this.pageData = msg.data.obj
                    }
                })
            },
            //选择门店仓库
            selectedfun(data, data1) {
                const _this = this;
                const options = {
                    storeCodeSet: []
                };
                if(data1 instanceof Array){
                    for (let i = 0; i < data1.length; i++) {
                        _this.$set(_this.params.storeCodes, i, data1[i].value)              
                    }
                }else{
                    options.storeCodeSet.push(data1.value);
                    _this.params.storeCodes = [data1.value]
                    // 根据经销商店获取仓库
                    api.getEntrepot(options, function(res) {
                        if (res.data.code === "success") {
                        const array = res.data.obj;
                        const arr = [];
                        for (var i = 0; i < array.length; i++) {
                            let obj = {};
                            obj.text = array[i].warehouseName;
                            obj.value = array[i].warehouseCode;
                            arr.push(obj);
                        }
                        _this.entreList = arr;
                        }
                    });
                }   
            },
            //分页改变
            pageChange(value){
                const _this = this
                _this.params.pageStart = value                
                api.dailyfill.queryReplenishmentPlanInfos(_this.params,(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.tableList = msg.data.obj.list
                        _this.pageData = msg.data.obj
                    }
                })
            },
            //跳转新增页面
            adddailyfill(){
                const _this = this;
                _this.$router.push({
                    name:"dailyfill-add"
                })
            }
        },
        created () {
            const _this = this;
        }
    }
</script>
<style>
</style>

