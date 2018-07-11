<template>
    <div class="animated fadeIn">
        <b-card header="查询">
             <div class="row">                       
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="销售区域" :label-cols="4" class="text-right">
                        <AreaTree @select-change="selectedfun" ref="areaqueryshop" :storeAll='true' class="text-left"></AreaTree>
                    </b-form-fieldset>
                 </div>
                 <div class="col-md-4">
                    <b-form-fieldset horizontal label="销售人" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.salesEmpName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="卡号" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.cardNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="客户姓名" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.customName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="审批状态" :label-cols="4" class="text-right">
                        <b-form-select :options="approStatus" v-model="searchModel.aprStatus"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="充值时间" :label-cols="4" class="text-right">
                        <el-date-picker
                                v-model.trim="searchModel.date"
								type="daterange"
								:clearable="true"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
						</el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="充值单号" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.cardRechargeOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="批次号" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.cardMakeOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="手机号" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.customPhone"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="冻结状态" :label-cols="4" class="text-right">
                        <b-form-select :options="frozenStateList" v-model="searchModel.frozenState"></b-form-select>
                    </b-form-fieldset>
                </div>   
                 <div class="col-md-4">
                     <b-row  class="text-right">
                        <div class="col-md-8 pr-0">
                            <b-form-fieldset horizontal label="充值金额" :label-cols="6">
                                <b-form-input type="number" v-model.trim="searchModel.cardStartAmout"/>                              
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-4 pl-0">
                            <b-form-fieldset horizontal label="-" :label-cols="2" class="text-right">
                                <b-form-input type="number" v-model.trim="searchModel.endEndAmout"/>                              
                            </b-form-fieldset>
                        </div>
                     </b-row>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="是否电子账户" :label-cols="4" class="text-right">
                         <b-form-select :options="isElectronicAccountList" v-model="searchModel.isElectronicAccount"></b-form-select>
                    </b-form-fieldset>
                </div>     
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="单据状态" :label-cols="4" class="text-right">
                         <b-form-select :options="orderStatusList" v-model="searchModel.orderStatus"></b-form-select>
                    </b-form-fieldset>
                </div>   
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="开票状态" :label-cols="4" class="text-right">
                         <b-form-select :options="invoiceStatusList" v-model="searchModel.invoiceStatus"></b-form-select>
                    </b-form-fieldset>
                </div>             
            </div>
            <query-btn-group @resetClick="reset" @query="search"></query-btn-group>
        </b-card>
         <b-card>
            <div class="row">              
                <div class="col-md-6">
                    <b-button size="sm" variant="success" v-b-modal.addPay>新增储值</b-button>
                    <b-button size="sm" variant="primary" @click="eidt">编辑</b-button>                                
                </div>
            </div>
            <div class="table-scrollable mb-2">
                 <el-table
                    :data="cardPayList"
                    border
                    style="width: 100%">
                    <el-table-column
                    fixed
                    prop="selCont"
                    label="选择"
                    width="70">
                        <template slot-scope="scope">
                            <input type="radio" name="radio"  v-model="selCont" :value="scope.row"/>
                        </template>	
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="cardRechargeOrderNo"
                    label="充值单号"
                    width="220">
                        <template slot-scope="scope">
                        	<a href="javascript:;" @click.prevent="detail(scope.row)">{{scope.row.cardRechargeOrderNo }}</a>	
                        </template>	
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="orderStatus"
                    label="单据状态"
                    width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row['orderStatus'] | orderStatusFliter}}</span>
                        </template>
                    </el-table-column>
                     <el-table-column
                    fixed
                    prop="invoiceStatus"
                    label="开票状态"
                    width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row['invoiceStatus'] | invoiceStatusFliter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="cardNo"
                    label="卡号"
                    width="190">
                    </el-table-column>
                    <el-table-column
                    show-overflow-tooltip
                    prop="cardName"
                    label="卡名称"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="isElectronicAccount"
                    label="电子账户"
                    width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row['isElectronicAccount'] | isElectFliter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="cardMakeOrderNo"
                    label="批次号"
                    width="200">
                    </el-table-column>
                    <el-table-column                    
                    prop="rechargeActualAmount"
                    label="充值金额（元）"
                    width="140">
                        <template slot-scope="scope">
                            <span>{{parseFloat(scope.row['rechargeActualAmount'])? parseFloat(scope.row['rechargeActualAmount']).toFixed(2) : ''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column                    
                    prop="giftAmount"
                    label="赠送金额（元）"
                    width="140">
                        <template slot-scope="scope">
                            <span>{{parseFloat(scope.row['giftAmount'])? parseFloat(scope.row['giftAmount']).toFixed(2) : ''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column    
                    show-overflow-tooltip          
                    prop="cardSourceName"
                    label="首次来源渠道"
                    :width="140">
                    </el-table-column>
                    <el-table-column
                    show-overflow-tooltip  
                    prop="orderChannelName"
                    label="渠道名"
                   >
                    </el-table-column>
                    <el-table-column
                    :width="120"
                    show-overflow-tooltip
                    prop="storeName"
                    label="门店名称"
                    >
                    </el-table-column>
                    <el-table-column
                    :width="120"
                    show-overflow-tooltip
                    prop="customName"
                    label="客户姓名"
                   >
                    </el-table-column>
                    <el-table-column
                    show-overflow-tooltip  
                    prop="customPhone"
                    label="手机号"
                    >                   
                    </el-table-column>                  
                    <el-table-column
                    show-overflow-tooltip  
                    prop="cardSalesOrderNo"
                    label="销售单"
                    >
                    </el-table-column>
                    <el-table-column
                    show-overflow-tooltip  
                    prop="salesEmpName"
                    label="销售人"
                    >
                    </el-table-column>
                    <el-table-column
                    show-overflow-tooltip  
                    prop="frozenState"
                    label="冻结状态"
                   :width="120">
                        <template slot-scope="scope">
                            <span>{{scope.row['frozenState'] | isCardStatusFliter}}</span>
                        </template>
                    </el-table-column>
                </el-table>
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
        <b-modal id="addPay" title="新建充值单" @show="clearCardNO" ref="addPay">
            <div class="container-fluid">
                <b-row>
                    <div class="col-md-12 text-center">
                        <b-form-fieldset horizontal label="请输入正确的卡号/电子账户" :label-cols="6" class="text-right">
                            <b-form-input v-model.trim="cardNo"/>
                        </b-form-fieldset>
                    </div>
                     <div class="col-md-12 text-center" v-show="isShowWarn">
                         <span><img src="../../../static/image/warning.png" alt=""></span>
                        <span>充值适用范围限制无法对此卡进行充值！</span>
                    </div>
                </b-row>
            </div>
            <div slot="modal-footer" class="w-100 text-center">         				
				<b-btn size="sm" variant="default" @click="cancle">取消</b-btn>
				<b-btn size="sm" variant="success" @click="creatOrder">生成充值单</b-btn>
			</div>
        </b-modal>
         <cardRefund ref="cardRefund"></cardRefund>
    </div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import Pagination from 'components/pagination/pagination'
import AreaTree from 'components/iris-areaqueryshop/index'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import cardRefund from './refund.vue'
import {Table, TableColumn, Message, DatePicker } from "element-ui"
import common from 'common/common.js'
import {CARD_RECHARGE_ORDER_SEQ} from 'common/sequence.js'
import {hasBtn} from 'common/api-common.js'
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);

export default {
    components: {
       QueryBtnGroup,
       Pagination,
       AreaTree,
       cardRefund,
    },
    data() {
        return {
            columW: config.demandOrder.columW,
            approStatus: config.purchaseContract.approStatus,
            frozenStateList: config.cardPay.frozenStateList,
            isElectronicAccountList: config.cardPay.isElectronicAccountList,
            orderStatusList: config.cardPay.orderStatusList,
            invoiceStatusList: config.cardPay.invoiceStatusList,
            selCont:'',
            paginationData: {
                total: 0,
                totalPages: 1,
                pageNo: 1,
                pageSize: config.pageNums
            },
            searchModel: {
                storeCodes: [],
                salesEmpName: '',
                cardNo: '',
                customName: '',
                aprStatus: '',
                date: '',
                rechargeStartTime: '',
                rechargeEndTime: '',
                cardRechargeOrderNo: '',
                cardMakeOrderNo: '',
                customPhone: '',
                frozenState: '',
                cardStartAmout: '',
                endEndAmout: '',
                isElectronicAccount: '',
                orderStatus: '',
                invoiceStatus: '',
            },
            cardNo: '',
            userInfo: '',
            storeInfoVo: '',
            isShowWarn: false,
        }
    },
    computed: {
        ...mapState('cardPay',[
				'cardPayList',
				'searchParam',
				'pages'
            ]),
        isEditCardPay(){
				return hasBtn(collectionApi.cardPay.editCardRechargePaymentInfo);
            },
        isAddCardPay(){
				return hasBtn(collectionApi.cardPay.insertCardRecharge);
			},
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        ...mapActions('cardPay',[
				'setTableList',
				'setSearchParam',
				'setPages',
                'getCardPayTabList',
            ]),
        getUserInfo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            let storeInfoVo = userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
            this.userInfo = userInfo;
            this.storeInfoVo = storeInfoVo;
        },
        // 生成卡充值单号
		createOrder() {
				const option = {
					'serviceCode': CARD_RECHARGE_ORDER_SEQ,			
                }
				return new Promise((reslove,reject) => {
					api.ordinalInfo.getSequence(option, (res) => {
						if(res.data.code === 'success') {							
							reslove(res.data.obj)
						};
					})
				})				
            },
        // 根据卡号获取详情
			getCardDetial(val) {
				const option = {
					'cardNo': val,			
                }
				return new Promise((reslove,reject) => {
					api.cardPay.getCardDetial(option, (res) => {
						if(res.data.code === 'success') {							
							reslove(res.data.obj)
						};
					})
				})				
            },
            // 根据卡号充值范围
			getCardRange(val) {
				const option = {
					'cardTemplateCode': val,			
                }
				return new Promise((reslove,reject) => {
					api.cardPay.getCardRang(option, (res) => {
						if(res.data.code === 'success') {							
							reslove(res.data.obj)
						};
					})
				})				
            },
        //区域选择门店
        selectedfun(data, data1) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            if(data1 instanceof Array){
                _this.searchModel.storeCodes = []
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
            let param = {
                storeCodes: this.searchModel.storeCodes?this.searchModel.storeCodes:[],
                salesEmpName: this.searchModel.salesEmpName,
                cardNo: this.searchModel.cardNo,
                customName: this.searchModel.customName,
                aprStatus: this.searchModel.aprStatus,
                rechargeStartTime: common.eleTimeFormat(this.searchModel.date[0]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.date[0]),
                rechargeEndTime: common.eleTimeFormat(this.searchModel.date[1]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.date[1]),
                cardRechargeOrderNo: this.searchModel.cardRechargeOrderNo,
                cardMakeOrderNo: this.searchModel.cardMakeOrderNo,
                customPhone: this.searchModel.customPhone,
                frozenState: this.searchModel.frozenState,
                cardStartAmout: this.searchModel.cardStartAmout,
                endEndAmout: this.searchModel.endEndAmout,
                isElectronicAccount: this.searchModel.isElectronicAccount,    
                orderStatus: this.searchModel.orderStatus,       
                invoiceStatus: this.searchModel.invoiceStatus,            
                pageNums: this.paginationData.pageSize,
				pageStart: this.paginationData.pageNo
            }
            this.setSearchParam(param);
            this.getCardPayTabList(param);
        },
        add() {
            this.$refs.cardPay.showModal();
        },
        eidt() {
            if(this.selCont === "") {
                Message({
                    message: '未选择卡充值单!',
                    type: 'warning'
                });
            }else {
                this.$router.push({name: 'card-pay-eidt', query: {cardNo: this.selCont.cardNo, cardRechargeOrderNo: this.selCont.cardRechargeOrderNo, onlySee: false, opType: 'eidt'}}); 
            }
        },
        detail(val) {
             this.$router.push({name: 'card-pay-detail', query: {cardNo: val.cardNo, cardRechargeOrderNo: val.cardRechargeOrderNo, onlySee: true, opType: 'detail'}}); 
        },
        creatOrder() {
            this.isShowWarn = false;
            if(this.cardNo === "") {
                Message({
                    message: '未填写卡号或电子账户!',
                    type: 'warning'
                });
            }else {
                this.getCardDetial(this.cardNo).then((res) => {
                     if(res != null) {                                          
                         if(res.cardTypeCode == 'StoredValue'){
                             if(res.frozenState == '1'  ) {
                                 Message({
                                    message: '该储值卡已冻结!',
                                    type: 'warning'
                                });
                                return;
                             }else if(res.cardStatus != '2') {
                                Message({
                                    message: '只有已销售储值卡，可进行充值!',
                                    type: 'warning'
                                });
                                return;
                             }
                            if(this.storeInfoVo == null || this.storeInfoVo.storeCode == '' || this.storeInfoVo.storeCode == null) {
                                 this.isShowWarn = true;
                                 return;
                            }
                            this.getCardRange(res.cardTemplateCode).then(result => {
                                if(result.length != 0) {                                
                                    for(let [i, item] of result.entries()) {                                       
                                        if(item.storeCode === this.storeInfoVo.storeCode) {
                                            this.createOrder().then((res) => {
                                                this.$router.push({name: 'card-pay-add', query: {cardNo: this.cardNo, cardRechargeOrderNo: res, onlySee: false, opType: 'add'}}); 
                                            }) 
                                            return;
                                        }
                                    }
                                    this.isShowWarn = true;
                                }else {
                                    this.isShowWarn = true;
                                }
                            })
                            
                         }else {
                             Message({
                                message: '该卡号不是储值卡!',
                                type: 'warning'
                            });
                         }
                         
                     }else {
                         Message({
                            message: '该卡号或电子账户不存在!',
                            type: 'warning'
                        });
                     }
                })
               
                      
            }        
        },
        cancle() {
            this.$refs.addPay.hide();
        },
        clearCardNO() {
            this.cardNo = '';
            this.isShowWarn = false;
        },
        getColumnW(headStr) {
           return (headStr.length) * this.columW +36;
        },
    },
    filters:{
        isElectFliter(val) {
            if(val == '0') {
                return '否';
            }else if(val == '1') {
                return '是';
            }
        },
        isCardStatusFliter(val) {
            if(val == '0') {
                return '未冻结';
            }else if(val == '1') {
                return '冻结';
            }
        },
        orderStatusFliter(val){
             if(val == '0') {
                return '未结算';
            }else if(val == '1') {
                return '已结算';
            }else if(val == '-1') {
                return '已作废';
            }
        },
        invoiceStatusFliter(val){
             if(val == '0') {
                return '未开票';
            }else if(val == '1') {
                return '已开票';
            }
        },
    }
}
</script>
<style>

</style>
