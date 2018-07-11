<template>
    <div class="animated fadeIn">
        <b-card header="查询">
             <div class="row">                       
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="门店" :label-cols="4" class="text-right">
                        <b-form-input v-model="storeName" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="自采单号" :label-cols="4" class="text-right">
                        <search
                            class="text-left"
                            ref="search"                         
                            :dataList="purchaseOrderList"
                            option="spoOrderNo"
                            @dataChange="purchaseOrderLQuerySelect"
                            @itemValue="purchaseOrderLItemValue"
                            @clickShowBack="purchaseOrderLFirstLoad"
                            @comScroll="purchaseOrderLComScroll"
                            @blurInput="getBlurPurchaseOrder">
                        </search>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="维修合同号" :label-cols="4" class="text-right">
                        <b-form-input v-model="searchModel.orderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="商品采购状态" :label-cols="4" class="text-right">
                        <b-form-select :options='purchaseStatusList' v-model="searchModel.spoDetailStatus">
                        </b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
            <query-btn-group @resetClick="reset" @query="search"></query-btn-group>
        </b-card>
         <b-card>
            <div class="row">              
                <div class="col-md-6">
                    <b-button size="sm" variant="success" @click="addPurchase">自采添加</b-button>
                    <b-button size="sm" variant="primary" @click="handleOwnP">暂存列表</b-button>
                </div>
            </div>
            <div class="table-scrollable mb-2">
                <el-table
                    :data="ownPurchaseTabList"
                    border
                    style="width: 100%">
                    <el-table-column
                    fixed
                    prop="selCont"
                    label="选择"
                    width="64">
                        <template slot-scope="scope">
                            <input type="checkbox" name="radio"  v-model="selCont" :value="scope.row" :disabled="scope.row.spoDetailStatus!=0"/>
                        </template>	
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="spoOrderNo"
                    label="自采单号"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="spoBatchNo"
                    label="批次号"
                    width="170">
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="spoDetailStatus"
                    label="处理进度"
                    :width="getColumnW('处理进度')">
                        <template slot-scope="scope">
                            <span>{{scope.row['spoDetailStatus'] | purchaseStatus}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="orderNo"
                    label="来源维修合同"
                    width="170">
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="bookingClosingDate"
                    label="预计交车时间"
                    width="170">
                    </el-table-column>
                    <el-table-column                       
                    prop="skuCode"
                    label="商品编码"
                    width="120">
                    </el-table-column>
                    <el-table-column                      
                    prop="skuTempCode"
                    label="临时编码"
                     width="190">
                    </el-table-column>
                    <el-table-column
                    prop="skuName"
                    label="商品名称"
                    :width="getColumnW('商品名称')">
                    </el-table-column>
                    <el-table-column
                    prop="supplierName"
                    label="供应商"
                    width="130">
                    </el-table-column>
                    <el-table-column
                    prop="brandName"
                    label="品牌"
                    width="170">
                    </el-table-column>
                    <el-table-column
                    prop="checkUnitName"
                    label="核算单位"
                    :width="getColumnW('核算单位')">
                        <!-- <template slot-scope="scope">
                            <span>个</span>
                        </template> -->
                    </el-table-column>
                    <el-table-column
                    prop="reqNums"
                    label="要货数"
                    :width="getColumnW('要货数')">
                        <template slot-scope="scope">
                            <span>{{parseInt(scope.row.reqNums)}}</span>
                        </template>	
                    </el-table-column>
                    <el-table-column
                    prop="skuStandards"
                    label="规格"
                    width="130">
                    </el-table-column>
                    <el-table-column
                    prop="skuModel"
                    label="型号"
                    width="130">
                    </el-table-column>
                    <el-table-column
                    prop="originalCode"
                    label="原厂编码"
                    width="160">
                    </el-table-column>
                    <el-table-column
                    prop="barCode"
                    label="69码"
                    width="170">
                    </el-table-column>
                    <el-table-column
                    prop="externalCode"
                    label="外部编码"
                    :width="getColumnW('外部编码')">
                    </el-table-column>
                </el-table>
            </div>
            <div class="row"> 
                <div class="col-md-12">
                    <pagination class="pull-right" 
                    @page-change="search" 
                    :page-no="ownPurchasePages.pageNo" 
                    :page-size="paginationData.pageSize" 
                    :total-pages="ownPurchasePages.totalPages" 
                    :total-result="ownPurchasePages.total">
                    </pagination>
                </div>
            </div>
         </b-card>
    </div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import Pagination from 'components/pagination/pagination'
import search from 'components/iris-input-search/search.vue'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import {Table, TableColumn, Message } from "element-ui"
import {hasBtn} from 'common/api-common.js'
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import filters from 'common/filters'
import config from 'common/config'

Vue.use(Table);
Vue.use(TableColumn);

export default {
    components: {
       QueryBtnGroup,
       Pagination,
       search
    },
    data() {
        return {
            storeInfoVo: '',
            selCont:[],
            purchaseStatusList:config.ownPurchase.purchaseStatusList,
            paginationData: {
                total: 0,
                totalPages: 1,
                pageNo: 1,
                pageSize: config.pageNums
            },
            searchModel: {
                spoOrderNo: '',
                spoDetailStatus: '',
                orderNo: ''
            },
            purchaseOrderList:[],
            purchaseOrderListisLastPage:'',
            selectPurchaseOParams: {
                    spoOrderNo: '',
					pageNums: 1000,
					pageStart: 1
				},
             columW: config.demandOrder.columW,
        }
    },
    computed: {
        ...mapState('ownPurchase',[
				'ownPurchaseTabList',
				'ownPurchaseParam',
				'ownPurchasePages'
            ]),
        storeName() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            if(userInfo == null) {
                Message({
                    message: '用户信息缺失!',
                    type: 'warning'
                });
                return;
            }
            let stroe = userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
            this.storeInfoVo = stroe;
            if(stroe) {
                return stroe.storeName;
            }else {
                return '';
            }
        },
        isEidt(){
            return hasBtn(collectionApi.ownPurchase.editSelfPurchaseBatchInfo);
        },
    },
    methods: {
        ...mapActions('ownPurchase',[
				'setOwnPurchaseTableList',
				'setOwnPurchaseSearchParam',
				'setOwnPurchasePages',
                'getOwnPurchaseTabList',
                'setOwnPurchaseAddSkuList',
                'setspoOrderNo'
            ]),
        // purchaseOrderList搜索框内值改变   触发搜索
        purchaseOrderLQuerySelect(data) {
            const _this = this
            _this.selectPurchaseOParams.pageStart = 1;
            _this.selectPurchaseOParams.spoOrderNo = data;
            this.searchModel.spoOrderNo = data;
            let params = _this.selectPurchaseOParams;
            _this.getPurchaseOrderList(params, function(res) {
                _this.purchaseOrderListisLastPage = res.isLastPage
                _this.purchaseOrderList = res.obj
            })
        },
        // purchaseOrderList选中某一项
        purchaseOrderLItemValue(value) {
            this.searchModel.skuDetailStatus = value.skuDetailStatus;
        },
        // 第一次加载purchaseOrderList数据
       purchaseOrderLFirstLoad() {
            const _this = this
            if(_this.purchaseOrderList.length != 0 ){
                return
            }
            let params = _this.selectPurchaseOParams
            _this.getPurchaseOrderList(params, function(res) {
                _this.purchaseOrderListisLastPage = res.isLastPage
                _this.purchaseOrderList = res.obj
            })

        },
        // purchaseOrderList滚动加载
        purchaseOrderLComScroll(isEnd) {
            if (isEnd && !this.purchaseOrderListisLastPage) {
                this.selectPurchaseOParams.pageStart ++
                let params = this.selectPurchaseOParams;
                this.getPurchaseOrderList(params, obj => {
                    this.purchaseOrderListisLastPage = obj.isLastPage;
                    if(obj.obj) {
                        this.purchaseOrderList = this.purchaseOrderList.concat(obj.obj);
                    }
                });
            }
        },
        // 定义向后台请求getPurchaseOrderList的方法
        getPurchaseOrderList(params,callback) {
            api.ownPurchase.querySelfPurchaseOrderInfoNoPage(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data;
                    callback(obj);
                }
            })
        },
        getBlurPurchaseOrder(val) {
            console.log(val)
        },
        reset() {
            this.searchModel.spoOrderNo = '';
            this.searchModel.spoDetailStatus = '';
            this.searchModel.orderNo = '';
            this.$refs.search.clearValue();
        },
        search(pageNo){
            if(!(this.storeInfoVo && this.storeInfoVo.storeCode)) {
                Message({
                    message: '缺少门店信息!',
                    type: 'warning'
                });
                return;
            }
            let _this = this;
            pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
            let param = {
                storeCode: this.storeInfoVo ? this.storeInfoVo.storeCode : '',
                spoOrderNo: this.searchModel.spoOrderNo,
                spoDetailStatus: this.searchModel.spoDetailStatus,
                orderNo: this.searchModel.orderNo,
                pageNums: this.paginationData.pageSize,
				pageStart: this.paginationData.pageNo
            }
            this.getOwnPurchaseTabList(param);
        },
        addPurchase() {
            if(this.selCont.length == 0) {
                Message({
                    message: '请选择SKU!',
                    type: 'warning'
                });
            }else {
                for(let i = 0; i < this.selCont.length; i++) {
                    if( this.selCont[0].spoOrderNo != this.selCont[i].spoOrderNo) {
                        Message({
                            message: '采购添加SKU，只能为同一采购单号SKU!',
                            type: 'warning'
                        });
                        return;
                    }
                };
                this. getHoldOrder().then((res) => {
                    if(res.length != 0) {
                        if(res[0].spoOrderNo !== this.selCont[0].spoOrderNo) {
                             Message({
                                message: '已存在其他暂存自采单号!',
                                type: 'warning'
                            });
                        }else {
                            this.setOwnPurchaseAddSkuList(this.selCont);
                            this.setspoOrderNo('')
                            this.$router.push({name: 'store-ownpurchase-handle'});
                        }
                    }else {
                        this.setOwnPurchaseAddSkuList(this.selCont);
                        this.setspoOrderNo('')
                        this.$router.push({name: 'store-ownpurchase-handle'});
                    }
                      
                })              
            }        
        },
        handleOwnP() {
            this. getHoldOrder().then((res) => {
                if(res.length != 0) {
                    this.$router.push({name: 'store-ownpurchase-handle'});
                }else {
                    Message({
                            message: '暂无已暂存自采单号！',
                            type: 'warning'
                        });
                }
            })
             
        },
        getHoldOrder() {
             if(!(this.storeInfoVo && this.storeInfoVo.storeCode)) {
                Message({
                    message: '缺少门店信息!',
                    type: 'warning'
                });
                return;
            }
            let param = {
                storeCode: this.storeInfoVo ? this.storeInfoVo.storeCode : '',
                orderStatus: 0
            }
            return new Promise((reslove,reject) => {
                api.ownPurchase.querySelfPurchaseBatchInfoNoPage(param, res => {
                    if (res.data.code === "success") {
                        let obj = res.data;
                        reslove(res.data.obj)
                    }
                })
            })	
            
        },
        getColumnW(headStr) {
           return (headStr.length) * this.columW +36;
        },
    },
    filters:{
        purchaseStatus(val) {
            if(val == '0') {
                return '未处理';
            }else if(val == '1') {
                return '已暂存';
            }else if(val == '2') {
                return '已采购';
            }else if(val == '3') {
                return '已完成';
            }
        },
    }
}
</script>