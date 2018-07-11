<template>
    <div>
        <b-card header="查询">
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="区域/门店" :label-cols="3" class="text-right">
                        <AreaTree @select-change="selectedfun" ref="area" :storeAll='true'></AreaTree>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="仓库地址" :label-cols="3" class="text-right">
                        <b-form-select v-model="queryParams.whCode" :options="entreList"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <scp ref="scp" @supVal="supVal"></scp>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="采购单号" :label-cols="3" class="text-right">
                        <b-form-input v-model="queryParams.orderNo" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="承运商" :label-cols="3" class="text-right">
                        <b-form-input v-model="queryParams.commonCarrierName" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="入库状态" :label-cols="3" class="text-right">
                        <b-form-select v-model="queryParams.inStatus" :options="putStorageType"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="采购类型" :label-cols="3" class="text-right">
                        <b-form-select v-model="queryParams.purchaseTypeCode" :options="purchaseType"></b-form-select>
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
                        <b-button size="sm" variant="primary" @click="gotoPut('put')">入库</b-button>                    
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
            <b-table striped hover bordered show-empty id="miWidth" :items="tableList" :fields="fields">
                <template slot="selcet" slot-scope="data">
                    <input type="radio" name="radio" @click="checkData(data.item.orderNo)">
                </template>
                <template slot="orderNo" slot-scope="data">
                    <a href="javascript:;" @click="goToDetail('detail', data.item.orderNo)">{{data.item.orderNo}}</a>
                </template>	
                <template slot="inStatus" slot-scope="data">
                    {{inStatusTypeToString(data.item.inStatus)}}
                </template>
                <template slot="totalMoney" slot-scope="data">
                    {{toFixedFunc(data)}}
                </template>
                <template slot="updateTimeStr" slot-scope="data">
                    <span v-if="!data.item.inStatus == 0">{{data.item.updateTimeStr}}</span>
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
    import common from 'common/common';
    import { getSequence } from 'common/api-common'
    import { PURCHASE_ORDER } from 'common/ref-code.js'
    import pagination from "components/pagination/pagination.vue";
    import scp from "./pic/supplier-cp.vue";
    import {Message} from "element-ui";
    import AreaTree from 'components/iris-areaqueryshop/index';
    export default {
        components: {
            Tree,
            pagination,
            AreaTree,
            scp
        },
        data() {
            return {
                userInfo: JSON.parse(common.getSession('userInfo')),
                entreList:[],
                goToPageData:'',
                curOrderNo: '', //当前采购单号
                queryParams:{
                    pageNums:config.pageNums,
                    //只选区域时传所有区域的code
                    //选区域又选门店时之传递门店的CODE
                    storeCodeSet: [],//区域or门店
                    supplierCode: '',//供应商
                    orderNo: '',//采购单号
                    commonCarrierName:'',//承运商
                    inStatus: '',//入库状态(待定)
                    purchaseTypeCode: '',//采购类型
                    pageStart:1,
                    orderStatus: 1,
                    whCode: ''//仓库编码
                },
                tableList:[],
                purchaseType:[],//采购类型
                putStorageType:[//入库状态
                    {text: "未入库",value:"0"},
                    {text: "已发生入库",value:"1"},
                    {text: "完成入库",value:"2"},
                    {text: "关闭入库",value:"3"}
                ],
                fields:{
                    selcet: {
                        label: '选择'
                    },
                    orderNo: {
                        label: '采购单号'
                    },
                    purchaseTypeName: {
                        label: '采购类型'
                    },
                    inStatus: {
                        label: '入库状态'
                    },
                    whName: {
                        label: '仓库'
                    },
                    totalNums: {
                        label: '采购数量'
                    },
                    totalMoney: {
                        label: '采购总金额'
                    },
                    arrivalNums: {
                        label: '到货数量'
                    },
                    // aogAllPrices: {
                    //     label: '到货总金额'
                    // },
                    deliveryTypeName: {
                        label: '配送类型'
                    },
                    totalFreightFee: {
                        label: '运费'
                    },
                    contactAddress: {
                        label: '仓库地址'
                    },
                    contactName: {
                        label: '联系人'
                    },
                    contactMobile: {
                        label: '联系电话'
                    },
                    updateTimeStr: {
                        label: '最后入库时间'
                    },
                    deadLineTime: {
                        label: '订单截止时间'
                    },
                    estimatedArrivalDate: {
                        label: '预计到货日期'
                    },
                },
                pageData:{},
                index:null
            }
        },
        mounted(){
            api.ref.getDataDictionarys({
                'refCode': PURCHASE_ORDER
            }, (res) => {
                if(res.data.code == 'success'){
                    for(let i = 0; i < res.data.obj.referenceDetailInfos.length; i ++){
                        this.purchaseType.push({
                            text: res.data.obj.referenceDetailInfos[i].refDetailName,
                            value: res.data.obj.referenceDetailInfos[i].refDetailCode
                        })
                    }
                }
            })
        },
        methods:{
            //小数点处理
            toFixedFunc(data){
                let result = data.item.totalMoney - 0
                return result.toFixed(2)
            },
            supVal(item){
                this.queryParams.supplierCode = item;
            },
            //入库状态CODE转文字
            inStatusTypeToString(code){
                switch(code){
                    case 0:
                        return '未入库';
                    case 1:
                        return '已发生入库'
                    case 2:
                        return '完成入库'
                    case 3:
                        return '关闭入库'
                }
            },
            selectedfun(data, data1) {
                const _this = this;
                const options = {
                    storeCodeSet: []
                };
                if(data1 instanceof Array){
                    _this.queryParams.storeCodeSet = []
                    for (let i = 0; i < data1.length; i++) {
                        _this.$set(_this.queryParams.storeCodeSet, i, data1[i].value)              
                    }
                }else{
                    options.storeCodeSet.push(data1.value);
                    _this.queryParams.storeCodeSet = [data1.value]
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
            checkData(orderNo){//采购订单编码,商品编码,仓库编码
                this.curOrderNo = orderNo;
            },
            goToDetail(type, orderNo){
                this.$router.push({path: 'notarchives-detail', query:{orderNo: orderNo, type: type}});
            },
            gotoPut(type){
                if(this.curOrderNo == ''){
                    Message({ 
                        type: 'warning', 
                        message: '请选择一条商品!'
                    });
                }else{
                    this.$router.push({path: 'notarchives-create', query:{orderNo: this.curOrderNo, type: type}})
                }
            },
            query(){
                const _this = this;
                _this.queryParams.pageStart = 1
                _this.queryParams.transferType = 0
                _this.queryArchives()
            },
            queryArchives(){
                const _this = this;
                api.notCarSharePurchaseInfo.queryInfo(_this.queryParams, (msg) => {
                    if(msg.data.message == 'success'){
                        _this.tableList = msg.data.obj.list
                        _this.pageData = msg.data.obj
                    }
                })
                // api.skuData.getInfo(_this.params,(msg)=>{
                //     if(msg.data.message == 'success'){
                //         _this.tableList = msg.data.obj.list
                //         _this.pageData = msg.data.obj
                //     }
                // })
            },
            pageChange(value){
                const _this = this;
                _this.queryParams.pageStart = value
                _this.queryArchives()
            },
            reset(){
                const _this = this;
                let userInfo = JSON.parse(common.getSession('userInfo'));
                _this.queryParams.pageNums = config.pageNums;
                _this.queryParams.shopName = '';
                _this.queryParams.whCode = '';
                _this.queryParams.supplierCode = '';
                _this.queryParams.orderNo = '';
                _this.queryParams.commonCarrierName = '';
                _this.queryParams.purchaseTypeCode = '';
                _this.queryParams.pageStart = 1;
                
                if(userInfo.userAvailableInfo.storeInfoVo == null){
                    _this.queryParams.storeCodeSet = '';
                    _this.queryParams.storeCodeSet = [];//区域or门店
                    _this.$refs.scp.$refs.search.setValue('')
                }
            }
        },
        created () {
            const _this = this;
        }
    }
</script>
<style scoped>
    #miWidth{
        min-width: 2000px;
    }
</style>

