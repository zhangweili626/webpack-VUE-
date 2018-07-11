<template>
    <div>
        <b-card header="采购单信息">
            <div class="row">
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="区域/门店" :label-cols="3" class="text-right">
                        <AreaTree ref="area" :storeAll='true' :readonly="true"></AreaTree>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="仓库" :label-cols="3" class="text-right">
                        <b-form-input v-model="detailInfo.whName" :readonly="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="供应商" :label-cols="3" class="text-right">
                        <b-form-input v-model="detailInfo.supplierName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="采购单号" :label-cols="3" class="text-right">
                        <b-form-input v-model="detailInfo.orderNo" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="外部编码" :label-cols="3" class="text-right">
                        <b-form-input v-model="detailInfo.externalCode" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="承运商" :label-cols="3" class="text-right">
                        <b-form-input v-model="detailInfo.commonCarrierName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="入库状态" :label-cols="3" class="text-right">
                        <b-form-input v-model="detailInfo.inStatusName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="采购类型" :label-cols="3" class="text-right">
                        <b-form-input v-model="detailInfo.purchaseTypeName" readonly/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6">
                    <b-form-fieldset horizontal label="订单截至日期" :label-cols="3" class="text-right">
                        <b-form-input v-model="detailInfo.deadLineTime" readonly/>
                    </b-form-fieldset>
                </div>
            </div>
        </b-card>
        <b-card header="明细">
            <div class="table-scrollable">
                <b-col md="6" class="my-1">
                <b-form-group horizontal label="智能搜索引擎" class="mb-1">
                    <b-input-group>
                        <b-form-input v-model="filter" placeholder="Type to Search" />
                    </b-input-group>
                    </b-form-group>
                </b-col>
                <b-table striped hover bordered show-empty id="miWidth" :filter="filter" :items="tableList" :fields="fields">
                    <template slot="thisPutNum" slot-scope="data">
                        <b-form-input :disabled="pageDisabled" min="0" type="number" class="w75" v-model="data.item.inNums"></b-form-input>
                    </template>
                    <template slot="whAreaName" slot-scope="data">
                        <b-form-select :disabled="pageDisabled" v-if="!data.item.whAreaName" class="col-md-6 whAreaName" size="sm" @change="getWhLocation(data.index)" v-model="tableList[data.index].whAreaCode" :options="whAreaList" :value="whAreaList.value"/>
                        <span v-else>{{data.item.whAreaName}}</span>
                    </template>
                    <template slot="whLocationName" slot-scope="data">
                        <b-form-select :disabled="pageDisabled" v-if="!data.item.whLocationName" class="whLocationName" size="sm" v-model="data.item.whLocationCode" :options="data.item.whLocationList" :value="data.item.whLocationList.value"/>
                        <span v-else>{{data.item.whLocationName}}</span>
                    </template>
                    <template slot="purchaseRate" slot-scope="data">
                        {{(data.item.purchaseRate * 100) + '%'}}
                    </template>
                    <template slot="purchaseFee" slot-scope="data">
                        {{data.item.purchaseFee.toFixed(2)}}
                    </template>
                    <template slot="putAllPrice" slot-scope="data">
                        {{totalAmountPrice(data.item, data.index)}}
                    </template>
                    <template slot="putAllTaxPrice" slot-scope="data">
                        {{totalPutTaxes(data.item, data.index)}}
                    </template>
                    <template slot="putALLOnlyPrice" slot-scope="data">
                        {{totalOnlyPrice(data.item, data.index)}}
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
            <div class="row">
                <div class="col-md-12">
                    <div v-if="!printType && !pageDisabled" class="pull-right mt-2">
                        <b-button size="sm" @click="goBack">取消</b-button>
                        <b-button size="sm" variant="primary" @click="insertSkuLocationInfoList">入库</b-button>
                    </div>
                    <div v-if="printType || pageDisabled" class="pull-right mt-2">
                        <b-button @click="printPut" size="sm" variant="primary" >打印</b-button>
                    </div>
                </div>
            </div>
        </b-card>
    </div>
</template>
<script>
    import { Tree } from 'element-ui'
    import api from 'common/api'
    import apiCollection from 'common/api-collection';
    import common from 'common/common.js';
    import { getSequence, getSequenceList } from 'common/api-common.js';
    import config from 'common/config'
    import pagination from "components/pagination/pagination.vue";
    import {Message} from "element-ui";
    import { CARD_REFUND_ORDER_SEQ, SKU_LOCATION_INFO_SEQ } from "common/sequence.js";
    import AreaTree from 'components/iris-areaqueryshop/index'
    export default {
        components: {
            Tree,
            pagination,
            AreaTree
        },
        data() {
            return {
                //入库明细表格输入本次入库数组件状态
                userInfo: JSON.parse(common.getSession('userInfo')),
                printType: false,//打印按钮显示隐藏状态
                printCode: '', //打印所需code
                pageDisabled: true,//表格明细中的一些锁定，入库按钮锁定控制
                filter: null,
                curUpData:[], //需要更新摆放目录的商品
                CARD_REFUND_ORDER_SEQ:'',//
                SKU_LOCATION_INFO_SEQ: '',//
                thisPutNum:0,//本次入库数量
                tableList:[],
                pageStart:'',
                pageData:{
                    pageNums:config.pageNums
                },
                params:{
                    orderNo:'PO201805142002711',
                    skuCode:'SKU3002784',
                    whCode:'WH2000117'
                },
                whAreaCode:'',//库区code
                //库区
                whAreaList:[],
                detailInfo:{},
                putInfo:{
                    areaShop:'',//区域门店
                    warehouse:'',//仓库
                    supplier:'',//供应商
                    purchaseNumbers:'',//采购单号
                    outCode:'',//外部编码
                    commonCarrier:'',//承运商
                    putType:'',//入库状态
                    purchaseType:'',//采购类型
                    orderSuspendDate:''//订单截止日期
                },
                //入库总额税金
                putAllTaxes:'',
                
                fields:{},
                fieldsEdit:{
                    skuCode: {
                        label: "商品编码"
                    },
                    skuName:{
                        label: "商品名称"                        
                    },
                    brandName:{
                        label: "品牌"                        
                    },
                    skuModel:{
                        label: "型号"                        
                    },
                    skuStandards:{
                        label: "规格"                        
                    },
                    originalCode:{
                        label: "原厂编码"                        
                    },
                    skuNums:{
                        label: "采购数量"                        
                    },
                    whAreaName:{
                        label: "库区"                        
                    },
                    whLocationName:{
                        label: "库位"                        
                    },
                    arrivalNums:{
                        label: "已入库数"                        
                    },
                    thisPutNum:{
                        label: "本次入库数量",
                    },
                    purchaseFee:{
                        label: "入库单价(含税)"                        
                    },
                    putAllPrice:{
                        label: "入库总金额(含税)"                        
                    },
                    purchaseRate:{
                        label: "税率"                        
                    },
                    putAllTaxPrice:{
                        label: "入库总额税金"                        
                    },
                    putALLOnlyPrice:{
                        label: "入库总金额(去税)"                        
                    },
                    externalCode:{
                        label: "外部编码"                        
                    },
                    barCode:{
                        label: "69码"                        
                    }
                },
                fieldsDetail:{
                    skuCode: {
                        label: "商品编码"
                    },
                    skuName:{
                        label: "商品名称"                        
                    },
                    brandName:{
                        label: "品牌"                        
                    },
                    skuModel:{
                        label: "型号"                        
                    },
                    skuStandards:{
                        label: "规格"                        
                    },
                    originalCode:{
                        label: "原厂编码"                        
                    },
                    skuNums:{
                        label: "采购数量"                        
                    },
                    whAreaName:{
                        label: "库区"                        
                    },
                    whLocationName:{
                        label: "库位"                        
                    },
                    arrivalNums:{
                        label: "已入库数"                        
                    },
                    purchaseFee:{
                        label: "入库单价(含税)"                        
                    },
                    putAllPrice:{
                        label: "入库总金额(含税)"                        
                    },
                    purchaseRate:{
                        label: "税率"                        
                    },
                    putAllTaxPrice:{
                        label: "入库总额税金"                        
                    },
                    putALLOnlyPrice:{
                        label: "入库总金额(去税)"                        
                    },
                    externalCode:{
                        label: "外部编码"                        
                    },
                    barCode:{
                        label: "69码"                        
                    }
                }
            }
        },
        mounted(){
            getSequence(CARD_REFUND_ORDER_SEQ, (data) => {
                this.CARD_REFUND_ORDER_SEQ = data
            });
            this.initPageFunc();
        },
        methods:{
            initPageFunc(){
                if(this.$route.query.type == 'detail'){
                    this.fields = this.fieldsDetail
                    this.pageDisabled = true;
                }else{
                    this.fields = this.fieldsEdit;
                    this.pageDisabled = false;
                }
                api.notCarSharePurchaseInfo.queryInfo({orderNo: this.$route.query.orderNo}, (msg) => {
                    if(msg.data.message == 'success'){
                        this.detailInfo = msg.data.obj.list[0];
                        switch(this.detailInfo.inStatus){
                            case 0:
                                this.detailInfo.inStatusName = '未入库';
                                break;
                            case 1:
                                this.detailInfo.inStatusName = '已发生入库';
                                break;
                            case 2:
                                this.detailInfo.inStatusName = '完成入库';
                                break;
                            case 3:
                                this.detailInfo.inStatusName = '关闭入库';
                                break;
                        }
                        this.$refs.area.setselect({
                            text:this.detailInfo.storeName,
                            value: this.detailInfo.storeCode
                        })
                        this.queryArchives();
                    }
                })
            },
            pageChange(value){
                const _this = this;
                _this.pageStart = value
                _this.queryArchives()
            },
            //查询
            queryArchives(){
                const _this = this;
                let InvoiceDetailInfoVo = {
                    orderNo: _this.$route.query.orderNo,
                    whCode: _this.detailInfo.whCode,
                    pageNums: config.pageNums
                }
                //查询入库明细
                api.notCarSharePurchaseInfo.getDetailInfo(InvoiceDetailInfoVo, (msg) => {
                    if(msg.data.message == 'success'){
                        let _this = this;
                            this.curUpData = []; //用于收集当前没有库区库位的数据
                            
                        //对表格数据进行赋值，类型为数组
                        this.tableList = msg.data.obj.list;
                        //为pageData赋值作用是让分页对象获取分页信息
                        this.pageData = msg.data.obj;
                        for(let i = 0; i < msg.data.obj.list.length; i++){
                            //向表格数据中添加选择库位的数组，作为备用，无论当前默认有无库区库位；
                            this.$set(_this.tableList[i], 'whLocationList' , []);
                            //向表格数据中添加本次入库数量的属性
                            this.$set(_this.tableList[i], 'inNums', 0);
                            //判断当前有哪些数据是没有库区库位的，等待后续入库时请求商品摆放目录。有库区库位的时候不可以请求商品摆放目录
                            if(this.tableList[i].whAreaCode == null || this.tableList[i].whLocationCode == null){
                                this.curUpData.push(this.tableList[i]);
                            }
                        }
                        this.whAreaFunc();
                    }
                })
            },
            //获取库区列表
            whAreaFunc(){
                const _this = this;
                let option = {
                    warehouseCode: this.detailInfo.whCode
                }
                api.skuPlace.queryWarehouseAreaInfo(option, res => {
                    if(res.data.code === 'success') {
                        res.data.obj.forEach(element => {
                            let obj = {}
                            obj.text = element.whAreaName
                            obj.value = element.whAreaCode
                            _this.whAreaList.push(obj)
                        })
                    }
                })
            },
            //获取库位列表
            getWhLocation(index){
                let _this = this;
                setTimeout(() => {
                   let option = {
                            whAreaCode: this.tableList[index].whAreaCode
                        }
                    api.skuPlace.queryWarehouseLocationInfo(option, res => {
                        if(res.data.code === 'success') {
                            res.data.obj.forEach(element => {
                                let obj = {}
                                obj.text = element.whLocationName;
                                obj.value = element.whLocationCode;
                                _this.tableList[index].whLocationList.push(obj);
                            })
                        }
                    })
                }, 0);
            },
            //计算入库总金额
            totalAmountPrice(val, index){
                let result;
                if(this.pageDisabled){
                    result = val.purchaseFee * this.tableList[index].arrivalNums;
                }else{
                    result = val.purchaseFee * this.tableList[index].inNums;
                }
                this.pageData.list[index].putAllPrice = result;
                return result.toFixed(2)
            },
            //计算入库总额税金
            //入库总金额 税金
            //入库总金额（含税）- 入库总金额 (去税)
            totalPutTaxes(val, index){
                let result;
                if(this.pageDisabled){
                    result = (val.purchaseFee * this.tableList[index].arrivalNums) - ((val.purchaseFee * this.tableList[index].arrivalNums) / (1 + val.purchaseRate));
                }else{
                    result = (val.purchaseFee * this.tableList[index].inNums) - ((val.purchaseFee * this.tableList[index].inNums) / (1 + val.purchaseRate));   
                }
                this.pageData.list[index].putAllTaxPrice = result;
                return result.toFixed(2)
            },
            //计算入库总金额去税
            //入库总金额 去税
            //入库总金额（含税） /  （1 + 税率）
            totalOnlyPrice(val, index){
                let result;
                if(this.pageDisabled){
                    result = (val.purchaseFee * this.tableList[index].arrivalNums) / (1 + val.purchaseRate)
                }else{
                    result = (val.purchaseFee * this.tableList[index].inNums) / (1 + val.purchaseRate)   
                }
                this.pageData.list[index].putALLOnlyPrice = result;
                return result.toFixed(2)
            },
            goBack(){
                this.$router.push({path: 'notarchives-query'})
            },
            //入库请求
            putData(data){
               // let option = this.pageData.list;
               let option = [],
                   vType = true; //校验标识
               for(let i = 0; i < data.length; i++){
                   option.push({
                        beTermNo: '',//账期【默认为*】
                        calFreigthFlag: 1, //运费是否需要计算入采购价中【0:不需要，1:需要】
                        freightFee: this.detailInfo.totalFreightFee, //运费
                        inBatchNo: this.CARD_REFUND_ORDER_SEQ, //入库批次号
                        inNums: data[i].inNums, //入库数量
                        inSourceNo: data[i].orderNo, //入库来源单号
                        inSourceNoDetailCode: data[i].detailCode, //入库来源单号的明细记录中的行号
                        inSourceTypeCode:'inWhSourceTypeGoodPurchase', //入库来源类型编码
                        //inStockBusinessCost:'', //业务-仓库成本【不含税】
                        //inStockBusinessTime:'', //业务入库时间
                        inStockIncludingTaxPrice: data[i].purchaseFee, //入库含税价
                        inStockRate: data[i].purchaseRate, //入库税率【1:百分之百】
                        rowStatus: 1, //采购单明细状态 ,
                        skuCode: data[i].skuCode, //商品编码
                        skuName: data[i].skuName, //商品名称
                        //skuUnitCode: , //商品单位编码
                        skuUnitName: data[i].checkUnitCode, //商品单位名称
                        storeCode:this.detailInfo.storeCode, //门店编码
                        storeName:this.detailInfo.storeName, //门店名称
                        //whAreaCode:'', //库区编码
                        //whAreaName:'', //库区名称
                        whCode: this.detailInfo.whCode //仓库编码
                        //whLocationCode:'',//库位编码
                        //whLocationName:'', //库位名称
                        //whName:'' //仓库名称
                   })
               }
                api.notCarSharePurchaseInfo.inStockListV2(option, res => {
                    if(res.data.code === 'success') {
                        Message({ 
                            type: 'success', 
                            message: '入库成功'
                        });
                        this.printCode = res.data.obj;
                        this.detailInfo.whCode = '';
                        this.pageDisabled = true;
                        this.printType = true;
                        this.initPageFunc();
                    }
                })
            },
            //筛选出需要更新库区库位的数据
            filtrateData(data){
                let flag = false;
                for(let i = 0; i < this.curUpData.length; i++){
                    if(this.curUpData[i].id == data.id){
                        flag = true;
                    }
                }
                return flag;
            },
            //目录摆放批量新增
            insertSkuLocationInfoList(){
                let option = [],
                    type = false,
                    errorSku = '',//处理未选择库区库位的sku
                    //本次入库的数据
                    curPutData = [],
                    //需要更新商品摆放目录的数据
                    updataCatalog = [];
                    for(let i = 0; i < this.tableList.length; i++){
                        //将已输入本次入库数量的数据筛选出来
                        if(this.tableList[i].inNums > 0){
                            if(this.tableList[i].inNums > this.tableList[i].skuNums){
                                Message({ 
                                    type: 'warning', 
                                    message: '入库数量不能大于采购数量'
                                });
                                return false;
                            }
                            if(this.tableList[i].inNums > (this.tableList[i].skuNums - this.tableList[i].arrivalNums)){
                                Message({ 
                                    type: 'warning', 
                                    message: '本次入库数量与已入库数量总和不得大于采购数量'
                                });
                                return false;
                            }
                            curPutData.push(this.tableList[i]);
                            //筛选出需要更新库区库位的数据
                            if(this.filtrateData(this.tableList[i])){
                                if(this.tableList[i].whLocationCode == null || this.tableList[i].whAreaCode == null){
                                    errorSku += this.tableList[i].skuCode + ';';
                                    type = true;
                                }
                                updataCatalog.push(this.tableList[i])
                            }
                        }
                    }

                    if(curPutData.length <= 0){
                        Message({ 
                            type: 'warning',
                            message: '请在需要入库的数据中填写本次入库数量'
                        });
                        return false;
                    }
                    if(type){
                        Message({ 
                            type: 'warning',
                            message: '当前有商品未选库区库位' + errorSku
                        });
                        return false;
                    }
                    //更新商品摆放目录
                    if(updataCatalog.length > 0){
                        let option = [];
                        for(let j = 0; j < updataCatalog.length; j++){
                            option.push({
                                skuLocationCode: '',//this.SKU_LOCATION_INFO_SEQ[i],
                                skuCode: updataCatalog[j].skuCode,
                                storeCode: this.detailInfo.storeCode, //门店编码
                                whCode: this.detailInfo.whCode, //仓库编码
                                whAreaCode: updataCatalog[j].whAreaCode,//库区编码
                                whLocationCode: updataCatalog[j].whLocationCode//库位编码
                            })
                        }
                        getSequenceList({getNums: option.length, serviceCode: SKU_LOCATION_INFO_SEQ}, (res) => {
                            for(let x = 0; x < option.length; x++){
                                option[x].skuLocationCode = res[x];
                            }
                            api.skuPlace.insertSkuLocationInfoList(option, res => {
                                if(res.data.code === 'success') {
                                    this.printCode = res.data.obj;
                                    this.printType = true;
                                    this.putData(curPutData);
                                }
                            })
                        });
                    }else{
                        this.putData(curPutData);
                    }
            },
            printPut(){
                var temp_form = document.createElement("form");      
                    temp_form.action = apiCollection.notCarSharePurchaseInfo.generatePdfReportInStock;      
                    temp_form.target = "_blank";
                    temp_form.method = "post";      
                    temp_form.style.display = "none"; 
                    var opt = document.createElement("input");
                    opt.type = 'hidden';
                    opt.name = 'inBatchNo';
                    opt.value = this.printCode;
                    temp_form.appendChild(opt);
                    console.log(opt.value);
                    console.log(opt.name);
                    console.log(opt);
                    console.log(temp_form);
                    document.body.appendChild(temp_form);
                    temp_form.submit();
            }
        }
    }
</script>
<style scoped>
    .w75{
        width:75px;
    }
    #miWidth{
        min-width: 2500px;
    }
</style>
