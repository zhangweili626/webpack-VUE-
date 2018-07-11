<template>
    <div class="row">
        <div class="row">
            <div class="col-md-12">
                <b-card header="查询">
                    <div class="row">
                        <div class="col-md-6">
                            <b-form-fieldset horizontal label="销售区域" :label-cols="4" class="text-right">
                                <AreaTree @select-change="selectedfun" ref="area" :storeAll='true'></AreaTree>
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6">
                            <b-form-fieldset horizontal label="仓库名称" :label-cols="4" class="text-right">
                                <b-form-select v-model="queryParams.whCode" :options="entreList"></b-form-select>
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6">
                            <b-form-fieldset horizontal label="要货单编码" :label-cols="4" class="text-right">
                                <b-form-input v-model="queryParams.prOrderNo"/>
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6">
                            <b-form-fieldset horizontal label="要货类型" :label-cols="4" class="text-right">
                                <b-form-select v-model="queryParams.timeLimitedTypeCode" :options="timeLimitedTypeList"/>
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6">
                            <b-form-fieldset horizontal label="来源类型" :label-cols="4" class="text-right">
                                <b-form-select v-model="queryParams.sourceOrderTypeCode" :options="sourceOrderTypeList">
                                </b-form-select>
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6">
                            <b-form-fieldset horizontal label="处理状态" :label-cols="4" class="text-right">
                                <b-form-select v-model="queryParams.prOrderDetailStatus" :options="prOrderDetailStatusList"/>
                            </b-form-fieldset>
                        </div>
                    </div>
                    <query-btn-group @resetClick="reset" @query="query"></query-btn-group>
                </b-card>
            </div>
        </div>
            <b-card>
            <div class="row">
                <div class="col-md-3">
                    <b-form-fieldset horizontal label="" :label-cols="1" class="text-right">
                        <b-form-select v-model="queryParams.orderByFlag" @change="orderByFlagChange" :options="orderByFlagList"/>                        
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-button size="sm" variant="primary" @click="OwnPurchase">授权自采</b-button>
                    <b-button size="sm" variant="primary"  @click="allot">调拨处理</b-button>
                    <b-button class="mr-2" size="sm" variant="primary"  @click="purchase">采购处理</b-button>
                    <el-tooltip placement="top" effect="light">
                        <div slot="content">自采和调拨只能对同一门店进行。采购只能对同一供应商进行批量处理。为方便物流配送，需求处理不建议大批量处理</div>
                        <i class="tipsImportant">i</i>
                    </el-tooltip>
                </div>
            </div>
            <div class="table-scrollable mb-2">
            <el-table
                :data="tableList"
                border
                style="width: 100%">
                <el-table-column
                fixed
                prop="selCont"
                label="选择"
                :width="getColumnW('商品编码', '')">
                    <template slot-scope="scope">
                        <input type="checkbox" name="radio"  v-model="selCont" :value="scope.row"/>                                
                    </template>	
                </el-table-column>
                <el-table-column
                fixed
                prop="skuCode"
                label="商品编码"
                :width="getColumnW('商品编码')">
                </el-table-column>
                <el-table-column
                fixed
                prop="skuTempCode"
                label="临时编码"
                :width="getColumnW('临时编码')">
                </el-table-column>
                <el-table-column
                fixed
                prop="skuName"
                label="商品名称"
                :width="getColumnW('商品名称')">
                </el-table-column>
                <el-table-column
                fixed
                prop="storeName"
                label="要货门店"
                width="140">
                </el-table-column>
                <el-table-column
                fixed
                prop="supplierName"
                label="供应商"
                :width="getColumnW('供应商')">
                </el-table-column>
                  <el-table-column
                prop="brandName"
                label="品牌"
                :width="getColumnW('品牌')">
                </el-table-column>
                <el-table-column
                prop="checkUnitName"
                label="单位"
                :width="getColumnW('单位')">
                </el-table-column>
                <el-table-column
                prop="reqNums"
                label="要货数"
                :width="getColumnW('要货数')">
                </el-table-column>
                <el-table-column
                prop="timeLimitedTypeName"
                label="要货类型"
                :width="getColumnW('要货类型')">
                </el-table-column>
                <el-table-column
                prop="sourceOrderTypeName"
                label="来源类型"
                :width="getColumnW('来源类型')">
                </el-table-column>
                <el-table-column
                prop="prOrderNo"
                label="要货单号"
                :width="getColumnW('要货单号')">
                </el-table-column>
                <el-table-column
                prop="prOrderDetailStatus"
                label="处理状态"
                :width="getColumnW('处理状态')">
                    <template slot-scope="scope">
                        <span v-if="scope.row.prOrderDetailStatus == 0">未处理</span>
                        <span v-else-if="scope.row.prOrderDetailStatus == 1">转采购</span>
                        <span v-else-if="scope.row.prOrderDetailStatus == 2">转调拨</span>
                        <span v-else-if="scope.row.prOrderDetailStatus == 3">转自采</span>
                    </template>
                </el-table-column>
                <el-table-column
                prop="downstreamOrderNo"
                label="处理单号"
                :width="getColumnW('处理单号')">
                </el-table-column>
                <el-table-column
                prop="skuStandards"
                label="规格"
                :width="getColumnW('规格', '')">
                </el-table-column>
                <el-table-column
                prop="skuModel"
                label="型号"
                :width="getColumnW('型号')">
                </el-table-column>
                <el-table-column
                prop="originalCode"
                label="原厂编码"
                :width="getColumnW('原厂编码')">
                </el-table-column>
                <el-table-column
                prop="barCode"
                label="69码"
                :width="getColumnW('69码')">
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
                    <pagination class="pull-right" @page-change="demandOrdSearch" :page-no="obj.pageNo" :page-size="obj.pageSize" :total-result="obj.totalResult" :total-pages="obj.totalPages">
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
import {Table, TableColumn, Input, Message, MessageBox , Tooltip} from "element-ui"
import api from 'common/api'
import config from 'common/config'
import AreaTree from 'components/iris-areaqueryshop/index'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import Search from "components/iris-search/search"
Vue.use(Table);
Vue.use(Tooltip)
Vue.use(TableColumn);
import { alertSuccess } from 'common/api-common'
const PLEASE_SELECT_DATA = '请选择'
const CAN_OWN_PURCHASE = '授权自采后无法撤回'
const CANNOT_OWN_PURCHASE_THE_SAME_STORE = '不同门店无法自采处理'
const CANNOT_OWN_PURCHASE_REPLENISHMENT = '日常补货无法自采处理'
const CANNOT_OWN_DETAIL_STATUS = '非未处理状态无法自采处理'
const REPLENISHMENT_REQUIRE = 'replenishmentRequire'

export default {
    components: {
        Pagination,
        QueryBtnGroup,
        AreaTree,
        Search
    },
    data() {
        return {
            orderByFlagList:[
                {text:'供应商排序',value:0},
                {text:'门店排序',value:1},
                {text:'sku排序',value:2},
            ],//排序
            timeLimitedTypeList:[],//要货类型
            sourceOrderTypeList:[],//商品需求来源类型
            prOrderDetailStatusList:[
                {
                text:'',
                value:null
            },{
                text:'未处理',
                value:0
            },{
                text:'转采购',
                value:1
            },{
                text:'转调拨',
                value:2
            },{
                text:'转自采',
                value:3
            }],//处理状态
            selCont:[],// 已选择项
            entreList:[],//查询条件仓库列表
            columW: config.demandOrder.columW,
            queryParams: {
                prOrderType:1,
                pageNums: config.pageNums,
                pageStart: 1,
                storeCodes: [],
                timeLimitedTypeCode:null,
                sourceOrderTypeName:null,
                orderByFlag:0,
                prOrderDetailStatus:0,
            },//查询数据
        }
    },
    computed: {
    	...mapState('demandOrder',[
    		'orderList',
    		'page',
        ]),
        tableList:function(){
            return JSON.parse(JSON.stringify(this.orderList))
        },
        obj:function(){
            return JSON.parse(JSON.stringify(this.page))            
        }
    },
    methods: {
        ...mapActions('demandOrder',[
            'setAllotData',
            'setPurchaseData',
            'setOrderList',
            'setPage',
        ]),
        //排序
        orderByFlagChange(value){
            const _this = this;
            _this.queryParams.orderByFlag = value
            _this.queryPrSkuDetailInfos()
        },
        //区域选择门店
        selectedfun(data, data1) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            if(data1 instanceof Array){
                _this.queryParams.storeCodes = []
                for (let i = 0; i < data1.length; i++) {
                    _this.$set(_this.queryParams.storeCodes, i, data1[i].value)              
                }
            }else{
                options.storeCodeSet.push(data1.value);
                _this.queryParams.storeCodes = [data1.value]
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
        //查询按钮
        query() {
            const _this = this;
            this.queryParams.pageStart = 1
            _this.queryPrSkuDetailInfos()
        },
        //查询方法
        queryPrSkuDetailInfos(){
            const _this = this
            _this.tableLis = []
            _this.selCont = []
            api.requirement.queryPrSkuDetailInfos(this.queryParams,(msg)=>{
                if(msg.data.message == 'success'){
                    for (let i = 0; i < msg.data.obj.list.length; i++) {
                        const element = msg.data.obj.list[i];
                        element.ids = []
                    }
                    this.setOrderList(msg.data.obj.list)
                    this.setPage({
                    	pageNo:msg.data.obj.pageNum,
				        pageSize: config.pageNums,
				        totalResult:msg.data.obj.total,
				        totalPages:msg.data.obj.pages,
                    })
                }                
            })            
        },
        //重置
        reset() {
            const _this = this;
            _this.queryParams = {
                prOrderType:1,
                pageNums: config.pageNums,
                pageStart: 1,
                timeLimitedTypeCode:null,
                sourceOrderTypeName:null,
                orderByFlag:0
            }
            _this.$refs.area.reset()                
            _this.$refs.area.resetToStart()
        },
        //分页触发
        demandOrdSearch(pageNo) {
            let _this = this;
            pageNo ? this.queryParams.pageStart = pageNo : this.queryParams.pageStart = 1;
            _this.queryPrSkuDetailInfos()
        },
        // creat by lwx start
        OwnPurchase() {
            if(!this.selCont.length) {
                 Message({
                    type: 'warning',
                    message: PLEASE_SELECT_DATA
                })
                return
            }
            const createElement = this.$createElement;
            MessageBox({
                title: '提示',
                message: createElement('p', null, [
                    createElement('span', null, this.getAlertInfo(this.canOwnPurchase(this.selCont))),
                ]),
                showCancelButton: true,
                showConfirmButton: this.canOwnPurchase(this.selCont) === 1,
                confirmButtonText: '授权自采',
                cancelButtonText: this.canOwnPurchase(this.selCont) === 1 ? '取消' : '返回',
                type: 'warning',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.confirmOwnPurchase(this.selCont)
                        done()
                    } else {
                        done();
                        return
                    }
                }
            }).then( action => {}).catch(() => {})
        },
        // -2: 处理状态不是未处理 -1: 门店不同  0: 日常补货  1: 可以自采
        canOwnPurchase(list) {
            let storeCodeList = new Set()
            for(let i = 0, len = list.length; i < len; i++) {
                if(list[i].sourceOrderTypeCode === REPLENISHMENT_REQUIRE) {
                    return 0
                }else if(list[i].prOrderDetailStatus !== 0) {
                    return -2
                }
                storeCodeList.add(list[i].storeCode)
            }
            return storeCodeList.size > 1 ? -1 : 1
        },
        getAlertInfo(status) {
            if(status === -1) {
                return CANNOT_OWN_PURCHASE_THE_SAME_STORE
            }else if(status === -2) {
                return CANNOT_OWN_DETAIL_STATUS
            } else if(status === 0) {
                return CANNOT_OWN_PURCHASE_REPLENISHMENT
            }else if(status === 1) {
                return CAN_OWN_PURCHASE
            }
        },
        confirmOwnPurchase(skuListVo) {
            let idList = []
            skuListVo.forEach(item => {
                idList.push(item.id)
            })
            let params = {
                prOrderDetailStatus: 3,
                detailIds: idList,  
                prSkuDetailInfoVos: skuListVo
            }
            api.arriveHandle.ownPurchaseRequirement(params).then(res => {
                alertSuccess(res, () => {
                    this.queryPrSkuDetailInfos()
                })
            })
        },
        // creat by lwx end

        //调拨处理点击
        allot() {
            const _this = this;
            if(_this.selCont.length !== 0){
                _this.selCont[0].ids = [_this.selCont[0].id]
                _this.selCont[0].id = null
                let skuList = [_this.selCont[0]];
                if(_this.selCont.length == 1){
                    if(_this.selCont[0].prOrderDetailStatus !== 0){
                        MessageBox.confirm('已处理过需求单无法调拨！', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                        }).then(() => {
                        }).catch(() => {
                        });
                        return;                        
                    }
                    _this.setAllotData(skuList)
                    _this.$router.push({
                        name:"allot"
                    })
                }else{
                for (let i = 1; i < _this.selCont.length; i++) {
                    if(_this.selCont[i].prOrderDetailStatus !== 0){
                        MessageBox.confirm('已处理过需求单无法调拨！', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                        }).then(() => {
                        }).catch(() => {
                        });
                        return;
                    }
                    for (let j = 0; j < skuList.length; j++) {
                        if(_this.selCont[i].storeCode !== skuList[j].storeCode){
                            MessageBox.confirm('自采和调拨只能对同一门店进行', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                            }).catch(() => {
                            });
                            return;
                        }else{
                            if(_this.selCont[i].skuCode === skuList[j].skuCode){
                                skuList[j].reqNums = parseInt(_this.selCont[i].reqNums) + parseInt(skuList[j].reqNums)
                                skuList[j].ids.push(_this.selCont[i].id)
                                break;
                            }
                            if(j == skuList.length - 1){
                                _this.selCont[i].ids = [_this.selCont[i].id]
                                _this.selCont[i].id = null
                                skuList.push(_this.selCont[i])
                                break;    
                            }
                        }
                    }
                }
                _this.setAllotData(skuList)
                _this.$router.push({
                    name:"allot"
                })
                }
            }else{
                Message({
                    type: 'warning',
                    message: '请选择数据！'
                });
            }
        },
        //采购管理
        purchase() {
            const _this = this;
            if(_this.selCont.length !== 0){
                _this.selCont[0].ids = [_this.selCont[0].id]
                _this.selCont[0].id = null
                let skuList = [_this.selCont[0]];
                    {
                    let param = [{
                        skuCode:_this.selCont[0].skuCode,
                        storeCode:_this.selCont[0].storeCode
                    }]
                    let storeMap = {}       
                    storeMap[_this.selCont[0].storeCode] = {
                        [_this.selCont[0].skuCode]:_this.selCont[0]
                    }           
                    for (let i = 1; i < _this.selCont.length; i++) {
                        if(_this.selCont[i].prOrderDetailStatus !== 0){
                            MessageBox.confirm('已处理过需求单无法调拨！', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                            }).then(() => {
                            }).catch(() => {
                            });
                            return;
                        }
                        if(storeMap[_this.selCont[i].storeCode]){
                            if(storeMap[_this.selCont[i].storeCode][_this.selCont[i].skuCode]){
                                storeMap[_this.selCont[i].storeCode][_this.selCont[i].skuCode].reqNums = storeMap[_this.selCont[i].storeCode][_this.selCont[i].skuCode].reqNums + _this.selCont[i].reqNums
                                storeMap[_this.selCont[i].storeCode][_this.selCont[i].skuCode].ids.push(_this.selCont[i].id) 
                                _this.selCont[i].id = null                                                          
                            }else{
                                _this.selCont[i].ids = [_this.selCont[i].id]
                                _this.selCont[i].id = null
                                storeMap[_this.selCont[i].storeCode][_this.selCont[i].skuCode] = _this.selCont[i]
                            }
                        }else{
                            _this.selCont[i].ids = [_this.selCont[i].id]
                            _this.selCont[i].id = null
                            storeMap[_this.selCont[i].storeCode] = {
                                [_this.selCont[i].skuCode]:_this.selCont[i]
                            }
                        }
                        for (let j = 0; j < param.length; j++) {
                            const element = param[j];
                            if((_this.selCont[i].skuCode===element.skuCode) && (_this.selCont[i].storeCode===element.storeCode)){
                                break;
                            }
                            if(j==param.length-1){
                                param.push({skuCode:_this.selCont[i].skuCode,storeCode:_this.selCont[i].storeCode})
                            } 
                        }
                    }
                    api.requirement.querySupplierBySkuCodeAndStoreCodes(param,(msg)=>{
                        if(msg.data.message == 'success'){
                            let data = msg.data.obj
                            for (var j = 0; j < data.length; j++) {
                                storeMap[data[j].storeCode][data[j].skuCode].purchaseContractDetailInfoVoList = data[j].purchaseContractDetailInfoVoList   
                                storeMap[data[j].storeCode][data[j].skuCode].purchaseFee = data[j].purchaseFee  
                                storeMap[data[j].storeCode][data[j].skuCode].purchaseRate = data[j].purchaseRate         
                                data[j] = storeMap[data[j].storeCode][data[j].skuCode]                         
                            }
                            _this.setPurchaseData({mapList:storeMap,list:data})
                            _this.$router.push({
                                name:"purchase-manage"
                            })
                        }
                    })
                }
            }else{
                Message({
                    type: 'warning',
                    message: '请选择数据！'
                });
            }
        },
        getColumnW(headStr) {
           return (headStr.length) * this.columW +36;
        },
        detailSkuDemand(val) {
            if(val) {
                this.$router.push({name: 'skuDemand', query: {skuCode: val, onlySee: true}});
                return;
            }
        },
        //查询数据字典
        getDataDictionarys(code,cb = ()=>{}){
            const _this = this;
            api.ref.getDataDictionarys({
                refCode: code
            },(msg)=>{
                if(msg.data.message == 'success'){
                    let data  = msg.data.obj.referenceDetailInfos
                    let list = [{text:'',value:null}]
                    for (let i = 0; i < data.length; i++) {
                        list[i+1] = {
                            text:data[i].refDetailName,
                            value:data[i].refDetailCode
                        }
                    }
                    cb(list)
                }
            })
        }
    },
    created(){
        const _this = this
        _this.getDataDictionarys('RequireTimeLimitedType',(list = [])=>{
            _this.timeLimitedTypeList = list
        })
        _this.getDataDictionarys('RequireSourceType',(list = [])=>{
            _this.sourceOrderTypeList = list
        })
    }
}
</script>


