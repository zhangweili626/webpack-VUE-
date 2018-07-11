<template>
<div class="animated fadeIn">
    <!-- 查询 -->
    <b-card header="查询">
        <div class="row">
            <div class="col-md-4">
                <b-form-fieldset horizontal label="服务编码" :label-cols="4" class="text-right">
                    <b-form-input  v-model.trim="queryParams.serviceCode" @onpaste.native="noCopy()"/>
                    <!-- <input type="text" onpaste="return false"> -->
                    <!-- <el-input @onpaste.native="noCopy"></el-input> -->
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="服务名称" :label-cols="4" class="text-right">
                    <b-form-input  v-model.trim="queryParams.serviceName" />
                </b-form-fieldset>
            </div>
            <div class="col-md-4">
                <b-form-fieldset horizontal label="里程间隔(km)" label-text-align="right" :label-cols="4">
                    <div class="row">
                        <div class="col-md-5">

                            <b-form-input onkeyup="this.value=this.value.replace(/\D/g,'')" v-model.trim="queryParams.startMileagePeriod" min="0"  type="number" />

                        </div>
                        <div class="align-center"> ~ </div>
                        <div class="col-md-6">

                            <b-form-input onkeyup="this.value=this.value.replace(/\D/g,'')" v-model.trim="queryParams.endMileagePeriod" min="0" type="number" />

                        </div>
                    </div>
                </b-form-fieldset>
            </div>
        </div>
        <car-info ref="carInfo" @callBack="getCarInfo"></car-info>
        <div class="row">
            <div class="col-md-4">
                <b-form-fieldset horizontal label="时间周期(月)" label-text-align="right" :label-cols="4">
                    <div class="row">
                        <div class="col-md-5">
                            <b-form-input onkeyup="this.value=this.value.replace(/\D/g,'')" v-model.trim="queryParams.startMonthPeriod" min="0" type="number" />
                        </div>
                        <div class="align-center"> ~ </div>
                        <div class="col-md-6">
                            <b-form-input onkeyup="this.value=this.value.replace(/\D/g,'')" v-model.trim="queryParams.endMonthPeriod" min="0" type="number" />
                        </div>
                    </div>
                </b-form-fieldset>
            </div>
        </div>
        <query-btn-group @resetClick="reset" @query="search"></query-btn-group>
    </b-card>
    <!-- 列表 -->
    <b-card>
        <div class="row mb-2">
            <div class="col-md-12">
                <b-button size="sm" variant="success" @click="insertClick">新增</b-button>
                <b-button size="sm" variant="primary" @click="updateClick">编辑</b-button>
                <v-upload v-if="isShowUpload"
                    :disabled= "false"
                    :addParams="addParams"
                    buttonName='导入'
                    :analysisExcel="analysisExcel"
                    :url="analysisUrl">
                </v-upload>
                <!-- <b-button size="sm" variant="default" @click="importClick">导入</b-button> -->
            </div>
        </div>
        <div class="mb-2">
            <el-table
                :data="serviceRecommendInfo.list"
                tooltip-effect="dark"
                border>
                    <el-table-column
                        label="选择">
                        <template slot-scope="scope">
                            <input type="radio" name="radio" @click="toSelect(scope.row.serviceCode, scope.row.serviceName)">
		                </template>
                    </el-table-column>
                    <el-table-column
                        prop="serviceCode"
                        label="服务编码"
                        width="100">
                        <template slot-scope="scope">
                            <a href="javascript:;" @click="toDetail(scope.row.serviceCode, scope.row.serviceName)">{{ scope.row.serviceCode }}</a>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="serviceName"
                        label="服务名称"
                        width="100"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="factoryNum"
                        label="厂家数">
                    </el-table-column>
                    <el-table-column
                        prop="brandNum"
                        label="品牌数">
                    </el-table-column>
                    <el-table-column
                        prop="factoryName"
                        label="厂家"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="brandName"
                        label="品牌"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="seriesName"
                        label="车系"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="modelName"
                        label="车型"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="opvName"
                        label="排量"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="iotypeName"
                        label="进气方式"
                        width="100"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="mileagePeriodNum"
                        label="里程间隔数量"
                        width="130">
                    </el-table-column>
                    <el-table-column
                        prop="monthPeriodNum"
                        label="时间周期数量"
                        width="130">
                    </el-table-column>
            </el-table>
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
    import api from 'common/api'
    import config from 'common/config'
    import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
    import CarInfo from  'components/iris-carinfo'
    import pagination from "components/pagination/pagination.vue"
    import VUpload from 'components/iris-upload'
    import { getSequence, hasBtn} from 'common/api-common'
    import urlMap from 'common/api-collection'
    import Vue from 'vue'
    import { Table, TableColumn, MessageBox, Message, Input } from 'element-ui'
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Input)


export default {
    components: {
        QueryBtnGroup,
        CarInfo,
        pagination,
        VUpload
    },
    data() {
        return {
            showBack:{},
            serviceCode: '',//服务编码
            serviceName: '',//服务名称

            queryParams: {
                id: '',                 //数据库主键id
                recommendationCode: '', //服务推荐编码
                serviceCode: '',        //服务编码
                serviceName: '',        //服务名称
                carCode: '',            //主车型名称
                factoryCode: '',        //厂家编码
                factoryName: '',        //厂家名称
                brandCode: '',          //品牌编码
                brandName: '',          //品牌名称
                seriesCode: '',         //车系编码
                seriesName: '',         //车系名称
                modelCode: '',          //车型编码
                modelName: '',          //车型名称
                opvCode: '',            //排量编码
                opvName: '',            //排量名称
                iotypeCode: '',         //进气方式编码
                iotypeName: '',         //进气方式名称
                //mileagePeriod: '',      //里程间隔（km）
                startMonthPeriod: '',        //时间周期（月）
                endMonthPeriod: '',        //时间周期（月）
                pageStart: 1,           //分页起始    
                pageNums:config.pageNums,
                startMileagePeriod: '',//里程数(之前)
                endMileagePeriod: '',//里程数(现在)
            },
            pageData:{
                pageNum: config.pageNums,
                pageSize: 1,
                total: 0,
                pages: 0
            },
            serviceRecommendInfo: {}, //页面信息汇总
            analysisUrl:urlMap.serviceRecommon.analysisUrlList


        }
    },
    // watch:{
    //     beforeLegend(val, oldVal){
    //         if(this.nowLegend !== '' && val !== ''){
    //             this.queryParams.mileagePeriod = this.nowLegend - val;
    //         }
    //     },
    //     nowLegend(val, oldVal){
    //         if(this.beforeLegend !== '' && val !== ''){
    //             this.queryParams.mileagePeriod = val - this.beforeLegend;
    //         }
    //     }
    // },
    computed: {
        isShowUpload:function(){
            //return hasBtn(urlMap.serviceRecommon.analysisUrl);
            return true;
        },
        addParams:function(){
            return {singleFlag:1, businessType:'', relationCode:1111};
        },
    },
    methods: {
        noCopy() {
            return false
        },
        pageChange(value){            
            const _this = this;
            _this.queryParams.pageStart = value
            _this.query()
        },
        getCarInfo(data) {
            this.queryParams.factoryCode = data.factoryCode
            this.queryParams.brandCode = data.brandCode
            this.queryParams.seriesCode = data.seriesCode
            this.queryParams.modelCode = data.modelCode
            this.queryParams.opvCode = data.opvCode
            this.queryParams.iotypeCode = data.ioTypeCode
        },

        //校验数据
        verifyFunc(){
            

            return true;
        },
        search(){
            this.queryParams.pageStart = 1;
            this.query();
        },
        query() {
            //this.queryParams.pageStart = 1;
            //校验
            if(this.verifyFunc()){
                api.afterSaleServiceRecommend.queryService(this.queryParams, (d) => {
                    if(d.data.message == 'success'){
                        this.pageData.pageNum = d.data.obj.pageNum
                        this.pageData.pageSize = d.data.obj.pageSize
                        this.pageData.total = d.data.obj.total
                        this.pageData.pages = d.data.obj.pages
                        this.serviceRecommendInfo = d.data.obj
                    }
                });
            }

        },
        reset() {
                this.queryParams.id = ''
                this.queryParams.recommendationCode = ''
                this.queryParams.serviceCode = ''
                this.queryParams.serviceName = ''                
                this.queryParams.startMileagePeriod = ''
                //this.queryParams.monthPeriod = ''
                this.queryParams.startMonthPeriod = ''
                this.queryParams.endMonthPeriod = ''
                this.queryParams.pageStart = 1                
                this.queryParams.endMileagePeriod = ''
                this.queryParams.factoryCode = ''
                this.queryParams.brandCode = ''
                this.queryParams.seriesCode = ''
                this.queryParams.modelCode = ''
                this.queryParams.opvCode = ''
                this.queryParams.iotypeCode = ''
                this.$refs.carInfo.clear();
        },
        toDetail(code, name){
            this.$router.push({path: '/service-recommend/detail', query: {serviceCode: code,serviceName: name, type: "detail"}});
        },
        insertClick() {
            this.$router.push({path: '/service-recommend/insert', query: {type: "insert"}});
        },
        updateClick() {
            if(!this.serviceCode){
                Message({
                    message: '请选择服务项目',
                    type: 'warning'
                });
                return;
            }
            this.$router.push({ path: '/service-recommend/edit', query: {serviceCode: this.serviceCode,serviceName:this.serviceName, type:"update"}});
        },
        //解析数据
        analysisExcel: function(res) {
            if (res.data.obj === null) {
                Message({
                    type: "success",
                    message: "解析成功"
                });
            } else {
                this.query();
            }
        },
        toSelect(code, name){
            this.serviceCode = code;
            this.serviceName = name;
        }
    }
};
</script>
<style scoped>
.align-center {
    display: flex;
    align-items: center;
}
</style>
