<template>
    <div class="animated fadeIn">
        <b-card>
             <div class="row">                       
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="处理类型" :label-cols="4" class="text-right">
                        <b-form-input v-model="hanleType" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="采购单号" :label-cols="4" class="text-right">
                         <b-form-input v-model="spoOrderNo" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="入库地址" :label-cols="4" class="text-right">                      
                         <b-form-select v-model="whouse" :options='wAddresList' :state="whouseInputStatus"></b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 text-right">
                    <b-button size="sm" variant="secondary" @click="submit('0')">暂存</b-button>
                    <b-button size="sm" variant="success" @click="submit('2')">整单采购</b-button>                   
                </div>               
            </div>
            <div class="row mt-3">
                <div class="col-md-12 text-right">
                    <h5> 
                        <span>运费： {{ freightFee }}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>含税价合计： {{ totalPrice }}</span>
                    </h5>              
                </div>               
            </div>
        </b-card>
         <b-card>
            <div class="row">              
                <div class="col-md-12">
                    <b-button size="sm" variant="default" class="mr-3" @click="print">打印预览</b-button>
                    <b-button size="sm" variant="danger" @click="del">撤销</b-button>
                </div>
            </div>
            <b-card class="mt-2 mb-2 pr-2" style="padding-left: 14px;" v-for="(item, i) of purchaseOrderList" :key="i">
                 <div class="row">
                    <div class="col-md-12 pl-3 ml-3" >
                        <div class="demand-checkbox">
                            <input type="checkbox" name="selOrder" v-model="selOrder" :value="item">
                        </div>
                        <div class="row pl-2">                       
                            <div class="col-md-6 col-lg-4">
                                <b-form-fieldset horizontal label="供应商名称*" :label-cols="4" class="text-right">
                                   <search
                                        :class="{'text-left': true,'inp-invalid': item.supplierNameVerify==false?true:false}"
                                        v-model="item.supplierName"                                   
                                        :hasCheck="inp.supplierCode"  
                                        :refIndex="i"                                                                                                                
                                        @nameChange="supplerNameChange">
                                    </search>                                   
                               </b-form-fieldset>
                            </div>
                            <div class="col-md-6 col-lg-4">
                                <b-form-fieldset horizontal label="发票抬头*" :label-cols="4" class="text-right">                                
                                     <b-form-input v-model="item.invoiceTitle" :state="item.invoiceTitleVerify"/>               
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-6 col-lg-4">
                                <b-form-fieldset horizontal label="账号*" :label-cols="4" class="text-right">
                                    <b-form-input v-model="item.bankAccount" :disabled="item.isSelectTit" :state="item.bankAccountVerify"/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-6 col-lg-4">
                                <b-form-fieldset horizontal label="开户行*" :label-cols="4" class="text-right">
                                    <b-form-input v-model="item.bankName" :disabled="item.isSelectTit" :state="item.bankNameVerify"/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-6 col-lg-4">
                                <b-form-fieldset horizontal label="发票类型*" :label-cols="4" class="text-right">
                                     <b-form-select :options="rateRelationlist" v-model="item.invoiceTypeCode"  :disabled="item.isSelectTit" :state="item.invoiceTypeCodeVerify">
                                    </b-form-select>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-6 col-lg-4">
                                <b-form-fieldset horizontal label="供应商联系人" :label-cols="4" class="text-right">
                                    <b-form-input v-model="item.supplierContactName"/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-6 col-lg-4">
                                <b-form-fieldset horizontal label="联系人电话" :label-cols="4" class="text-right">
                                    <b-form-input v-model="item.supplierContactPhone"/>
                                </b-form-fieldset> 
                            </div>
                            <div class="col-md-6 col-lg-4">
                                <b-form-fieldset horizontal label="公司电话*" :label-cols="4" class="text-right">
                                    <b-form-input v-model="item.companyPhoneNumber" :disabled="item.isSelectTit" :state="item.companyPhoneNumberVerify"/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-6 col-lg-4">
                                <b-form-fieldset horizontal label="税号*" :label-cols="4" class="text-right">
                                    <b-form-input v-model="item.taxRegistrationNumber"  :disabled="item.isSelectTit" :state="item.taxRegistrationNumberVerify"/>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-6 col-lg-4">
                                <b-form-fieldset horizontal label="地址*" :label-cols="4" class="text-right">
                                    <b-form-input v-model="item.companyAddress"  :disabled="item.isSelectTit" :state="item.companyAddressVerify"/>
                                </b-form-fieldset>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col md-12 text-right">
                                <b-button size="sm" variant="primary" @click="copySupplerInf(i)" v-if="i != 0 ">复制供应商</b-button>
                            </div>
                        </div>
                        <div class="row ownpurchase-line"></div>
                        <div class="row">
                            <div class="col-md-5">
                                <span inline>
                                   运费&nbsp;&nbsp; <b-form-input type="number" class="ownpurchse-input" v-model="item.totalFreightFee" @input="countTotalPrice(i, -1, 'totalFreightFee')" :state="item.totalFreightFeeVerify"/>&nbsp;元
                                </span>                               
                            </div>
                        </div>
                        <div class="table-scrollable ml-3">
                            <el-table
                                :data="item.spoSkuDetailInfoVos"
                                border
                                style="width: 100%">
                                <el-table-column
                                fixed
                                prop="skuCode"
                                label="零件编码"
                                width="120">
                                </el-table-column>
                                <el-table-column
                                fixed
                                prop="skuTempCode"
                                label="临时编码"
                                 width="130">
                                </el-table-column>
                                <el-table-column
                                fixed
                                prop="skuName"
                                label="零件名称"
                                :width="getColumnW('零件名称')">
                                </el-table-column>
                                <el-table-column
                                fixed
                                prop="brandName"
                                label="品牌"
                                width="140">
                                </el-table-column>
                                <el-table-column
                                fixed
                                prop="skuModel"
                                label="型号"
                                :width="getColumnW('型号')">
                                </el-table-column>
                                <el-table-column
                                fixed
                                prop="skuStandards"
                                label="规格"
                                :width="getColumnW('规格')">
                                </el-table-column>
                                <el-table-column
                                fixed
                                prop="reqNums"
                                label="要货数量"
                                :width="getColumnW('要货数量')">
                                    <template slot-scope="scope">
                                        <span>{{parseInt(scope.row.reqNums)}}</span>
                                    </template>
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
                                prop="skuNums"
                                label="采购数量"
                                width="130">
                                    <template slot-scope="scope">
                                        <b-form-input type="number" v-model="scope.row.skuNums" @input="countTotalPrice(i, scope.$index, 'skuNums')" :state="scope.row.skuNumsVerify"/>
                                    </template>	
                                </el-table-column>
                                <el-table-column
                                prop="purchaseFee"
                                label="采购单价"
                                width="130">
                                    <template slot-scope="scope">
                                        <b-form-input type="number" v-model="scope.row.purchaseFee" @input="countTotalPrice(i, scope.$index, 'skuNums')" :state="scope.row.purchaseFeeVerify"/>
                                    </template>	
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
                    </div>
                </div>
            </b-card>                 
         </b-card>
    </div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import Pagination from 'components/pagination/pagination'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import search from './search-input-suppler.vue'
import {Table, TableColumn, Message, Input, Autocomplete, MessageBox } from "element-ui"
import {hasBtn} from 'common/api-common.js'
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import filters from 'common/filters'
import common from 'common/common'
import config from 'common/config'
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Input);
Vue.use(Autocomplete);


export default {
    components: {
       QueryBtnGroup,
       Pagination,
       search
    },
    data() {
        return {
            isSumbit: true,
            hanleType: '自采处理',
            spoOrderNo: '',
            wAddresList: [],
            wAddres: '',
            // 是否响应供应商名称变化，查询供应商信息
            isSelectSupplierInf: true,
            rateRelationlist:[],
            supplierList: [],
            invoiceTitlelist:[],
            supplierListisLastPage:'',
            selectSuplierParams: {
					pageNums: config.pageNums,
					pageStart: 1
				},
            selCont:[],
            selOrder:[],
            typeInput: '1',
            searchModel: {
                order: ''
            },
            model: {
                supplierName: '',
                supplierCode: '',
                invoiceTitle: '',
                bankAccount: '',
                bankName:'',
                invoiceTypeCode:'',          
                contactMobile:'',                           
                taxRegistrationNumber:'',
                companyAddress:'',
            },
            inp: {
                supplierCode: false
            },
            purchaseOrderList: [],
            columW: config.demandOrder.columW,
            storeInfoVo: '',
            lastIndex: -1,
            totalPrice: 0,
            freightFee:0,
            whouse:'',
            whouseInputStatus: null,
            verifyMap: {
                supplierName: '供应商名称',
                invoiceTitle: '发票抬头',
                bankAccount: '账号',
                bankName: '开户行',
                invoiceTypeCode: '发票类型',
                companyPhoneNumber: '公司电话',
                taxRegistrationNumber: '税号',
                companyAddress: '地址',
            },
        }
    },
    computed: {
        ...mapState('ownPurchase',[
                'addSkuList'
            ]),
        isEidtParchase() {
            return hasBtn(collectionApi.ownPurchase.editSelfPurchaseBatchInfo);
        },
        isDel() {
            return hasBtn(collectionApi.ownPurchase.delPurchaseBatch);
        },
    },
    created() {
        this.getStoreInfoVo();
        this.getRateRelationlist().then(() => {
             this.getOwnPurchase();
        });
       
    },
    methods: {
        ...mapActions('ownPurchase',[
                'setOwnPurchaseAddSkuList',
                'getOwnPurchaseTabList'
            ]),
        // 生成供应商批次号refcode
        createSupplierBatchOrder(num) {
            const option = {
                'serviceCode': config.ownPurchase.supplierBatchOrder,
                'getNums': num ? num : 1
            }
            return new Promise((reslove,reject) => {
                api.ordinalInfo.getSequenceList(option, (res) => {
                    if(res.data.code === 'success') {							
                        reslove(res.data.obj)
                    };
                })
            })				
        },
        getStoreInfoVo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
            if(userInfo == null) {
                Message({
                    message: '用户信息缺失!',
                    type: 'warning'
                });
                return;
            }
            this.storeInfoVo = userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null;
        },
        supplerNameChange(val) {
            let params = {
                pageNums: 10,
                pageStart: 1,
                supplierName: val.value,
                selectFlag: 1,
            }
            if(!this.isSelectSupplierInf) {
                return;
            }
           if(val.value != '' ) {
                api.supplier.querySupplierList(params, res => {
                    if (res.data.code === "success") {                       
                        if(res.data.obj.list.length == 0) {                          
                            this.purchaseOrderList[val.refIndex].isSelectTit = false;
                            this.purchaseOrderList[val.refIndex] = this.setval( this.purchaseOrderList[val.refIndex], {});
                            this.purchaseOrderList[val.refIndex].supplierContactName = '';
                            this.purchaseOrderList[val.refIndex].supplierCode = '';
                            this.purchaseOrderList[val.refIndex].contactMobile = '';
                            this.purchaseOrderList[val.refIndex].taxRegistrationNumber = '';
                            this.purchaseOrderList[val.refIndex].companyPhoneNumber = '';
                            this.purchaseOrderList[val.refIndex].supplierContactPhone = '';
                            this.purchaseOrderList[val.refIndex].invoiceTitlelist = [];
                            this.purchaseOrderList[val.refIndex].invoiceTitleObj = '';
                            this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
                            return;
                        }
                        let param = res.data.obj.list[0];
                        param.refIndex = val.refIndex;
                        // this.supplierSelect(param);
                    }
                })
           }
          
        },
        // 获取税率
        getRateRelationlist() {
            let _this = this;
            const option = {
                'refCode': config.ownPurchase.rateRelation
            }
            return new Promise((reslove, reject) => {
                api.ref.getDataDictionarys(option, (res) => {
                    if (res.data.code === 'success') {
                        let data = res.data.obj.referenceDetailInfos;
                        let arr = []
                        data.forEach((item, index) => {
                            let obj = {
                                value: item.refDetailCode,
                                text: item.refDetailName
                            }
                            arr.push(obj);
                        })
                        _this.rateRelationlist = arr;
                        reslove()
                    }
                })
            })
            
        },
        // 获取发票抬头下拉选项
        getInvioceTit(val){
            return new Promise((reslove, reject) => {
                let param = {
                    supplierCode: val
                }
                api.supplier.getSupplierInfo(param, res => {
                    if (res.data.code === "success") {                  
                        let resObj = res.data.obj;
                        let titArr = [];                            
                        resObj.supplierInvoiceInfoList.forEach((item, index) => {                   
                            let data = this.getInvioce(item);
                            let Obj = {
                                value: JSON.stringify(data),
                                text: data.invoiceTitle
                            }
                            titArr.push(Obj);   
                        })
                        reslove(titArr);
                    }
                })
            })
        },
        countTotalPrice() {
            // if(index == -1) {
            //     this.purchaseOrderList[i][key] = parseFloat(this.purchaseOrderList[i][key]).toFixed(2);
            // }else {
            //     this.purchaseOrderList[i][index][key] = parseFloat(this.purchaseOrderList[i][index][key]).toFixed(2);
            // }
            // this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
            let temporaryPrice = 0;
            let freightFee = 0;
            if(this.purchaseOrderList.lenght == 0) {
                this.totalPrice = parseFloat(temporaryPrice).toFixed(2);
                return;
            }
            for(let [index, item] of this.purchaseOrderList.entries()) {
                freightFee += parseFloat(item.totalFreightFee) ? parseFloat(item.totalFreightFee) : 0;
                // temporaryPrice +=  parseFloat(item.totalFreightFee) ? parseFloat(item.totalFreightFee) : 0;
                for(let [i, v] of item.spoSkuDetailInfoVos.entries()) {
                    let skuNums = parseInt(v.skuNums) ? parseInt(v.skuNums) : 0;
                    let purchaseFee = parseFloat(v.purchaseFee) ? parseFloat(v.purchaseFee) : 0;
                    temporaryPrice += purchaseFee * 100* skuNums / 100;
                }
            }
            this.freightFee = parseFloat(freightFee).toFixed(2);;
            this.totalPrice =  parseFloat(temporaryPrice).toFixed(2);
        },
        // 复制上一个供应商信息
        copySupplerInf(index) {
            this.isSelectSupplierInf = false;
            let obj = Object.assign({}, this.purchaseOrderList[index-1]);
            for(let k of Object.keys(this.model)) {
                this.purchaseOrderList[index][k] = obj[k];
            } 
            this.purchaseOrderList[index].invoiceTitlelist = obj.invoiceTitlelist;
            this.purchaseOrderList[index].invoiceTitleObj = obj.invoiceTitleObj;
            this.purchaseOrderList[index].isSelectTit = obj.isSelectTit;
            this.purchaseOrderList[index].invoiceTypeCode = obj.invoiceTypeCode;
            this.purchaseOrderList[index].supplierContactName = obj.supplierContactName;
            this.purchaseOrderList[index].contactMobile = obj.contactMobile;
            this.purchaseOrderList[index].companyPhoneNumber = obj.companyPhoneNumber;
            this.purchaseOrderList[index].supplierContactPhone = obj.supplierContactPhone;
            this.purchaseOrderList[index].taxRegistrationNumber = obj.taxRegistrationNumber;
            if(obj.invoiceTitleObj !== undefined) {
                this.purchaseOrderList[index] = this.setval( this.purchaseOrderList[index], JSON.parse( obj.invoiceTitleObj));
            }else {
                //this.purchaseOrderList[index] = this.setval( this.purchaseOrderList[index], {});
            }
            this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
            let timer = setTimeout(() => {
                this.isSelectSupplierInf = true;
            },1600);
        },
        submit(status){
            if(this.whouse == '') {
                Message({
                    message: '请选择仓库地址!',
                    type: 'warning'
                });
                this.whouseInputStatus = false;
                return;
            }else{
                this.whouseInputStatus = null;
            }
            if(this.purchaseOrderList.length == 0) {
                Message({
                    message: '数据为空!',
                    type: 'warning'
                });
                return;
            }
            MessageBox.confirm(status == '0'?'确定暂存采购单？' : '确定提交采购单？', '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(status === '2') {
                    let verityObj = [...this.purchaseOrderList]
                    for(let [ind, item] of verityObj.entries()) {
                        if(!item.id){
                            Message({
                                message:'未暂存的数据不可提交！',
                                type: 'warning'
                            });
                            return;
                        }
                    }
                }
                this.getHoldOrder().then((res) => {
                    if(res.length != 0) {
                        if(res[0].spoOrderNo !== this.purchaseOrderList[0].spoOrderNo) {
                            Message({
                                message: '该自采单号与已存自采单号不一致!',
                                type: 'warning'
                            });
                            return;
                        }                       
                    }
                    for(let [index, item] of this.purchaseOrderList.entries()) {
                        for(let k of Object.keys(this.verifyMap)) {
                            if(item[k] === '' || item[k] === null || !item[k]) {
                                this.purchaseOrderList[index][k+'Verify'] = false;
                            }else{
                                this.purchaseOrderList[index][k+'Verify'] = null;
                            }
                        }
                        for(let k of Object.keys(this.verifyMap)) {
                            if(item[k+'Verify'] == false) {
                                this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
                                return;
                            }
                        }
                        // if(!common.isTel(item.supplierContactPhone)) {
                        //     Message({ 
                        //             type: 'warning', 
                        //             message: `电话号码格式不正确!`
                        //         });
                        //     return;	
                        // }
                        // if(!common.isMobile(item.supplierContactPhone)) {
                        //     Message({ 
                        //             type: 'warning', 
                        //             message: `手机格式不正确!`
                        //         });
                        //     return;	
                        // }
                        if( parseFloat(item.totalFreightFee) < 0 ) {
                            this.purchaseOrderList[index].totalFreightFeeVerify = false;
                            this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
                            Message({
                                message: '运费不可小于0!',
                                type: 'warning'
                            });
                            return;
                        }else if(item.totalFreightFee === '') {
                            this.purchaseOrderList[index].totalFreightFeeVerify = false;
                            Message({
                                message: '运费不可为空!',
                                type: 'warning'
                            });
                            return;
                        }else {
                            this.purchaseOrderList[index].totalFreightFeeVerify = null;
                        }
                        for(let [i, v] of item.spoSkuDetailInfoVos.entries()) {
                            if( parseFloat(v.skuNums) < 0) {
                                this.purchaseOrderList[index].spoSkuDetailInfoVos[i].skuNumsVerify = false;
                                this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
                                Message({
                                    message: '采购数量不可小于0!',
                                    type: 'warning'
                                });
                                return;
                            }else if(parseFloat(v.skuNums) < parseFloat(v.reqNums)){
                                this.purchaseOrderList[index].spoSkuDetailInfoVos[i].skuNumsVerify = false;
                                this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
                                Message({
                                    message: '采购数量不小于要货数量!',
                                    type: 'warning'
                                });
                                return;
                            }else if(parseFloat(v.skuNums) > parseInt(v.skuNums)){
                                this.purchaseOrderList[index].spoSkuDetailInfoVos[i].skuNumsVerify = false;
                                this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
                                Message({
                                    message: '采购数量必须为整数!',
                                    type: 'warning'
                                });
                                return;
                            }else {
                                this.purchaseOrderList[index].spoSkuDetailInfoVos[i].skuNumsVerify = null;
                            }
                            if( parseFloat(v.purchaseFee) <= 0) {
                                this.purchaseOrderList[index].spoSkuDetailInfoVos[i].purchaseFeeVerify = false;
                                this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
                                Message({
                                    message: '采购单价不可小于等于0!',
                                    type: 'warning'
                                });
                                return;
                            }else {
                                this.purchaseOrderList[index].spoSkuDetailInfoVos[i].purchaseFeeVerify = null;
                            }                  
                        }
                    }
                    this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
                    let param = [];
                    for(let [i, v] of this.purchaseOrderList.entries()) {
                        for(let [ind, item] of v.spoSkuDetailInfoVos.entries()) {
                            delete  v.spoSkuDetailInfoVos[ind].orderNo; 
                            delete  v.spoSkuDetailInfoVos[ind].bookingClosingDate; 
                        }
                        if(status == 0) {
                            param.push(v);
                        }else {
                            if(v.id){
                                param.push(v);
                            }
                        }
                    }
                    this.isSelectSupplierInf = false;
                    this.createSupplierBatchOrder(param.length).then((res) => {
                        for(let i = 0; i < param.length; i++) {
                            param[i].orderStatus = status;                
                            if( !param[i].spoBatchNo ) {
                                param[i].spoBatchNo = res[i];
                            }
                            let whouse = JSON.parse(this.whouse);
                            param[i].whCode = whouse.warehouseCode;
                            param[i].whName  = whouse.warehouseName;
                            param[i].storeName  = this.storeInfoVo.storeName;
                            param[i].storeCode = this.storeInfoVo.storeCode;
                        }
                        api.ownPurchase.editSelfPurchaseBatchInfo(param, res => {
                            if (res.data.code === "success") {
                                Message({
                                    message: status == '0'?'暂存成功!' : '提交成功！',
                                    type: 'success'
                                });
                                this.getOwnPurchase();
                                let timer = setTimeout(() => {
                                    this.isSelectSupplierInf = true;
                                },1200);
                                let option = {
                                    storeCode: this.storeInfoVo ? this.storeInfoVo.storeCode : '',
                                    spoOrderNo: '',
                                    spoDetailStatus: '',
                                    orderNo: '',
                                    pageNums: config.pageNums,
                                    pageStart: 1
                                }
                                this.getOwnPurchaseTabList(option);
                                if(status === '2') {
                                    this.$router.push({name: 'store-ownpurchase-search'});
                                }                   
                            }
                        })
                    })
                })
            })         
        },
        // 打印
        print() {
            if(this.selOrder.length == 0) {
                Message({
                    message:'未选择要打印的采购单！',
                    type: 'warning'
                });
            }else {
                let param = []
                for(let [ind, item] of this.selOrder.entries()) {
                    let listItem = {};
                    listItem.supplierName = item.supplierName;
                    listItem.contactName = item.supplierContactName;
                    listItem.contactPhone = item.supplierContactPhone;
                    listItem.invoiceTitle = item.invoiceTitle;
                    listItem.orderNo = item.spoOrderNo;
                    listItem.storeName = this.storeInfoVo.storeName;
                    listItem.contactAddress = JSON.parse(this.whouse).warehouseAddress;
                    listItem.skuList = item.spoSkuDetailInfoVos;
                    let purchaseTotalMoney = 0;
                    for(let [i, v] of listItem.skuList.entries()) {
                        let skuNums = parseFloat(v.skuNums) ? parseFloat(v.skuNums) : 0;
                        let purchaseFee = parseFloat(v.purchaseFee) ? parseFloat(v.purchaseFee) : 0;
                        purchaseTotalMoney += skuNums * purchaseFee;
                        listItem.skuList[i].purchaseFee = parseFloat(purchaseFee).toFixed(2);
                        listItem.skuList[i].skuNums = parseFloat(skuNums).toFixed(2);
                    }                                
                    listItem.freightFee = parseFloat(item.totalFreightFee) ? parseFloat(item.totalFreightFee).toFixed(2) : 0.00;
                    listItem.purchaseTotalMoney = purchaseTotalMoney.toFixed(2);
                    listItem.totalMoneys = (parseFloat(listItem.freightFee) + parseFloat(listItem.purchaseTotalMoney)).toFixed(2);
                    
                    if(param.length == 0) {
                        param.push(listItem);
                    }else {
                        let onoff = true;
                        for(let [i, v] of param.entries()) {
                            if(listItem.supplierName == v.supplierName) {    
                                param[i].freightFee =  parseFloat(param[i].freightFee)  + parseFloat(listItem.freightFee);                     
                                param[i].purchaseTotalMoney =  parseFloat(param[i].purchaseTotalMoney)  + parseFloat(listItem.purchaseTotalMoney);                     
                                param[i].totalMoneys =  parseFloat(param[i].totalMoneys)  + parseFloat(listItem.totalMoneys);                     
                                param[i].skuList = param[i].skuList.concat(listItem.skuList);
                                onoff = false;
                            }
                        }
                        if(onoff) {
                             param.push(listItem);
                        }
                    }
                }
                common.previewNeed(common.isdev() + collectionApi.requirement.generatePdfReport,{
                "jrxmlJson": param,
                "jrxmlCode": "SpaoPrintTemplate"
                });
                this.selOrder = [];
            }
        },
        // 撤销
        del() {
            if(this.selOrder.length == 0) {
                Message({
                    message:'未选择要撤销的采购单！',
                    type: 'warning'
                });
                return;
            };
            MessageBox.confirm(`确定撤销已选供应商采购单？`, '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let param = [...this.selOrder]
                for(let [ind, item] of param.entries()) {
                    if(!item.id){
                        Message({
                            message:'未暂存的数据不可撤销！',
                            type: 'warning'
                        });
                        return;
                    }
                }
                this.isSelectSupplierInf = false;
                setTimeout(() => {
                    this.isSelectSupplierInf = true;
                },1600);	
                let _this = this;
                api.ownPurchase.delPurchaseBatch(param, res => {
                    if (res.data.code === "success") {
                        for(let [ind, item] of param.entries()) {
                            _this.purchaseOrderList.splice(_this.purchaseOrderList.indexOf(item), 1);
                        };   
                        if(_this.purchaseOrderList.lenght == 0) {
                            this.isSumbit = false;
                        }else {
                            this.isSumbit = false;
                            for(let [i, val] of _this.purchaseOrderList.entries()) {
                                if(val.id){
                                    this.isSumbit = true;
                                    break;
                                }
                            };  
                        }
                        this.countTotalPrice();
                        let option = {
                            storeCode: this.storeInfoVo ? this.storeInfoVo.storeCode : '',
                            spoOrderNo: '',
                            spoDetailStatus: '',
                            orderNo: '',
                            pageNums: config.pageNums,
                            pageStart: 1
                        }
                        this.getOwnPurchaseTabList(option);                  
                        Message({
                            message: '撤销成功！',
                            type: 'success'
                        });
                        this.selOrder = [];
                    }              
                })
            });                  
        },
        // 根据供应商code设置发票信息
        supplierSelect(val) {
            let param = {
                supplierCode: val.supplierCode
            }
             api.supplier.getSupplierInfo(param, res => {
                if (res.data.code === "success") {                  
                    let resObj = res.data.obj;
                    let titArr = [];  
                    if(resObj.supplierInvoiceInfoList.length == 0) {
                        this.purchaseOrderList[val.refIndex].isSelectTit = true;
                        this.purchaseOrderList[val.refIndex] = this.setval( this.purchaseOrderList[val.refIndex], {});
                        this.purchaseOrderList[val.refIndex].supplierCode = '',
                        this.purchaseOrderList[val.refIndex].supplierContactName = '',
                        this.purchaseOrderList[val.refIndex].contactMobile = '',
                        this.purchaseOrderList[val.refIndex].taxRegistrationNumber = '',
                        this.purchaseOrderList[val.refIndex].companyPhoneNumber = '',
                        this.purchaseOrderList[val.refIndex].supplierContactPhone = '',
                        this.purchaseOrderList[val.refIndex].invoiceTitlelist = [];
                        this.purchaseOrderList[val.refIndex].invoiceTitleObj = '';
                        this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
                        Message({
                                message: '供应商无发票信息,请先补全！',
                                type: 'warning'
                            });
                        return;
                    }                          
                    resObj.supplierInvoiceInfoList.forEach((item, index) => {                   
                        let data = this.getInvioce(item);
                        let tObj = {
                            value: JSON.stringify(data),
                            text: data.invoiceTitle
                        }
                        titArr.push(tObj);                 
                        for(let k of Object.keys(this.model)) {
                            this.purchaseOrderList[val.refIndex][k] = resObj[k];
                            }   
                            this.purchaseOrderList[val.refIndex].invoiceTitlelist = [...titArr];
                            this.purchaseOrderList[val.refIndex].isSelectTit = true;
                            if( titArr[0] == undefined) {
                                Message({
                                    message: '供应商发票信息不全,请先补全！',
                                    type: 'warning'
                                });
                                return;
                            }
                            this.purchaseOrderList[val.refIndex].invoiceTitleObj = titArr[0].value;
                            this.purchaseOrderList[val.refIndex].supplierContactName = resObj.contactName;
                            this.purchaseOrderList[val.refIndex].supplierContactPhone = resObj.contactMobile;              
                            this.purchaseOrderList[val.refIndex] = this.setval( this.purchaseOrderList[val.refIndex], JSON.parse(titArr[0].value));                       
                            this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
                    })                                                                                                 
                }
            })
        },
        seletTit(val, index) {
             this.purchaseOrderList[index] = this.setval( this.purchaseOrderList[index], JSON.parse(val));
             this.purchaseOrderList = JSON.parse(JSON.stringify(this.purchaseOrderList));
        },
        setval(obj, val) {
            obj.bankAccount = val.bankAccount;
            obj.bankName = val.bankName;
            obj.invoiceTitle = val.invoiceTitle;
            obj.invoiceCode = val.invoiceCode;
            obj.invoiceTypeCode = val.invoiceTypeCode;
            obj.invoiceTypeName = val.invoiceTypeName;
            obj.invoiceTaxRate = val.invoiceTaxRate;
            obj.companyAddress = val.companyAddress;
            obj.companyPhoneNumber = val.companyPhoneNumber;
            obj.taxRegistrationNumber = val.taxRegistrationNumber;
            return obj;
        },
        getColumnW(headStr) {
           return (headStr.length) * this.columW + 36;
        },
        getOwnPurchase() {
             let params = {
                storeCode: this.storeInfoVo.storeCode
            }
            api.warehouse.query(params).then(res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    let arr = [];
                    obj.list.forEach((item, index) => {
                        let val = {
                            warehouseAddress: item.warehouseAddress,
                            warehouseAddress: item.warehouseAddress,
                        };
                        let obj = {
                            value: JSON.stringify(item),
                            text: item.warehouseAddress
                        }
                        arr.push(obj);
                    })
                    this.wAddresList = [...arr];
                    this.whouse = arr[0].value;
                    this.getHoldOrder().then((res => {
                        let arr = res;
                        let obj = {};
                        if(this.addSkuList.length != 0) {                  
                            obj.spoSkuDetailInfoVos = JSON.parse(JSON.stringify(this.addSkuList));  
                            obj.storeCode = JSON.parse(JSON.stringify(this.addSkuList));  
                            obj.storeCode = this.storeInfoVo.storeCode;  
                            obj.spoOrderNo = obj.spoSkuDetailInfoVos[0].spoOrderNo;
                            obj.totalFreightFee = 0;  
                            for(let i = 0; i < obj.spoSkuDetailInfoVos.length; i++) {
                                obj.spoSkuDetailInfoVos[i].skuNums = parseFloat(obj.spoSkuDetailInfoVos[i].reqNums).toFixed(0);
                                obj.spoSkuDetailInfoVos[i].purchaseFee = 0;
                            }
                            arr.push(obj);                   
                            this.setInitData(arr);
                            this.setOwnPurchaseAddSkuList([]);
                            this.countTotalPrice();                                                                                                 
                        }else {
                            if(arr.length != 0) {
                                this.setInitData(arr);
                                this.countTotalPrice();                       
                            }else{
                                this.purchaseOrderList = [];
                            }
                        }                       
                    }))
                }
            });
             
        },
        // 获取已暂存数据
        getHoldOrder() {
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
        // 初始化页面暂时数据处理
        setInitData(arr) {
            this.lastIndex =  arr.length - 1;
            this.spoOrderNo = arr[0].spoSkuDetailInfoVos[0].spoOrderNo;                           
            for(let i = 0; i < arr.length; i++) {
                for(let k of Object.keys(this.verifyMap)) {
                    arr[i][k+'Verify'] = null;
                }
                arr[i].totalFreightFeeVerify = null;
                arr[i].rateRelationlist = this.rateRelationlist;        
                if(arr[i].id && arr[i].id != "") {
                    for(let j = 0; j < this.wAddresList.length; j++) {
                        if(arr[i].whCode == JSON.parse(this.wAddresList[j].value).warehouseCode) {
                            this.whouse = this.wAddresList[j].value;
                        }
                    }
                }         
            }
            this.purchaseOrderList = [...arr];
        },
        // 组装发票数据
        getInvioce(val) {
            let obj = {};
            obj.bankAccount = val.bankAccount;
            obj.bankName = val.bankName;
            obj.invoiceTitle = val.invoiceTitle;
            obj.invoiceCode = val.invoiceCode;
            obj.invoiceTypeName = val.invoiceName;
            obj.invoiceTaxRate = val.invoiceTaxRate;
            obj.companyAddress = val.companyAddress;
            obj.companyPhoneNumber = val.companyPhoneNumber;
            obj.taxRegistrationNumber = val.taxRegistrationNumber;
            if(val.invoiceType) {
                obj.invoiceTypeCode = val.invoiceType;
            }else {
                obj.invoiceTypeCode = val.invoiceTypeCode;
            }
            return obj;
        }
    }
}
</script>
<style>
    .demand-checkbox{
        position: absolute;
        top: 50%;
        left: -12px;
    }
    .ownpurchase-input{
        width: 100%!important;
    }
    .ownpurchase-input .el-input__inner{
        border-radius: 4px!important;
    }
    .ownpurchase-line{
        width: 100%;
        height: 2px;
        background: darkgrey;
        margin: 10px -6px 10px 0px
    }
    .ownpurchase-selet-l .form-control{
        width: 76px!important;
    }
    .inp-invalid{
        border-color: #f86c6b!important;
    }
    .inp-invalid input{
        border: 1px solid #f86c6b;
    }
    .ownpurchse-input{
        display: inline-block;
        width: 150px;
    }
</style>
