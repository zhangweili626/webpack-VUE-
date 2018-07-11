<template>
    <div>
        <b-card header="查询">
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="商品名称" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.skuName"></b-form-input>
                    </b-form-fieldset> 
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="商品型号" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.skuModel"></b-form-input>                        
                    </b-form-fieldset> 
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="商品规格" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.skuStandards"></b-form-input>                        
                    </b-form-fieldset> 
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="商品状态" :label-cols="4" class="text-right">
                        <b-form-select v-model="params.onOffFlag" :options="skuStatus"></b-form-select>
                    </b-form-fieldset> 
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="原厂编码" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.originalCode"></b-form-input>                        
                    </b-form-fieldset> 
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="外部编码" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.externalCode"></b-form-input>                                            
                    </b-form-fieldset> 
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="69码" :label-cols="4" class="text-right">
                        <b-form-input v-model="params.barCode"></b-form-input>                        
                    </b-form-fieldset> 
                </div>
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
        <b-card>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="success" @click="addskuinfo">新增</b-button>
                        <b-button size="sm" variant="primary" @click="updataskuinfo">编辑</b-button>                    
                    </div>
                    <div class="pull-right">
                        <b-button class="pull-right" size="sm" variant="warning" @click="cache">同步数据</b-button>
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
                        name:"skuinfo-detail",
                        query:{
                            skuCode:data.item.skuCode,
                            disabled:true                            
                        }
                    }'>
                        {{data.item.skuCode}}
                    </router-link>
                </template>
                <template slot="skuName" slot-scope="data">
                    {{data.item.skuName}}
                </template>
                <template slot="skuStandards" slot-scope="data">
                    {{data.item.skuStandards}}
                </template>
                <template slot="originalCode" slot-scope="data">
                    {{data.item.originalCode}}
                </template>
                <template slot="externalCode" slot-scope="data">
                    {{data.item.externalCode}}
                </template>
                <template slot="skuModel" slot-scope="data">
                    {{data.item.barCode}}
                </template>
                <template slot="skuModel" slot-scope="data">
                    {{data.item.skuModel}}
                </template>
                <template slot="onOffFlag" slot-scope="data">
                    {{data.item.onOffFlag == '0'?'下架':'上架'}}
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
    import {Message} from "element-ui";
    export default {
        components: {
            Tree,
            pagination
        },
        data() {
            return {
                skuStatus:[{
                    text:"",
                    value:"",
                },{
                    
                    text:"上架",
                    value:1,
                },
                {
                    text:"下架",
                    value:0
                }],
                params:{
                    pageNums:config.pageNums,
                    skuType:'goodsTypeGood',                    
                    pageStart:1,
                    onOffFlag:null,
                    skuStandards:null,
                    skuModel:null,
                    skuName:null
                },
                tableList:[],
                fields:{
                    index: {
                        label: "选择"
                    },
                    skuCode:{
                        label: "商品编码"
                    },
                    skuName:{
                        label: "商品名称"                        
                    },
                    originalCode:{
                        label: "原厂编码"                        
                    },
                    externalCode:{
                        label: "外部编码"                        
                    },
                    barCode:{
                        label: "69码"                        
                    },
                    skuStandards:{
                        label: "商品规格"                        
                    },
                    skuModel:{
                        label: "商品型号"                        
                    },
                    onOffFlag:{
                        label: "商品状态"                        
                    },
                },
                pageData:{},
                index:null
            }
        },
        methods:{
            updataskuinfo(){
                const _this = this;
                if(_this.index == null){
                      Message({ 
                        type: 'warning', 
                        message: '请选择一条商品!'
                    });
                }else{
                    const _this = this;
                    _this.$router.push({
                        name:"skuinfo-updata",
                        query:{
                            skuCode:_this.tableList[_this.index].skuCode,
                            disabled:false
                        }
                    })
                }
            },
            checkData(index){
                const _this = this;
                _this.index = index
            },
            addskuinfo(){
                const _this = this;
                _this.$router.push({
                    name:"skuinfo-add"
                })
            },
            query(){
                const _this = this;
                _this.params.pageStart = 1
                _this.queryArchives()
            },
            queryArchives(){
                const _this = this;
                api.skuData.getInfo(_this.params,(msg)=>{
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
                    pageNums:config.pageNums,
                    pageStart:1,
                    onOffFlag:null,
                    skuStandards:null,
                    skuModel:null,
                    skuName:null,
                    skuType:'goodsTypeGood',                    
                }
            },
             //同步数据
            cache: function() {
                api.skuInfo.cogradient({}, (res) => {
                    if (res.data.code == "success") {
                        Message({
                            type: 'success',
                            message: config.messInfo.success
                        });
                    }
                })
            },
        },
        created () {
            const _this = this;
        }
    }
</script>
<style>

</style>

