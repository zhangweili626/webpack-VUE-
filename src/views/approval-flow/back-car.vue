<template>
    <div class="back-card">
        <b-card :header="`退卡单号：${this.$route.query.orderNo}&nbsp;&nbsp;审批状态：${oprStatus}`">
		   <div class="row">
                <div class="table-scrollable mb-2">
                    <el-table
                        :data="headTab"
                        border
                        style="width: 100%">
                        <el-table-column
                        prop="empCnName"
                        label="操作人"
                        :width="getColumnW('操作人', '')">
                        </el-table-column>
                        <el-table-column
                        prop="refundTimeStr"
                        label="退卡时间"
                        :width="getColumnW('退卡时间', '')">
                        </el-table-column>
                        <el-table-column
                        prop="refundTotalAmount"
                        label="退款总金额"
                        :width="getColumnW('退款总金额', '')">
                        </el-table-column>
                        <el-table-column
                        prop="refundFeeCount"
                        label="退款手续费"
                        :width="getColumnW('退款手续费', '')">
                        <template slot-scope="scope">
                            <b-form-input v-model.trim="scope.row.refundFeeCount" type="number" min="0" @input="countRefundAmount(scope.row.refundFeeCount)" :disabled="isEditDetail || onlySee"/>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="refundOriginalAmount"
                        label="应退金额"
                        :width="getColumnW('应退金额', '')">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
		</b-card>
		<b-card header="退款金额明细">
			 <div class="animated fadeIn">
               <cardModel :refundDetail='refundDetail' @inputNum="getRefDetail" :isEdit="isEditDetail || onlySee" ref="refDetail"></cardModel>  
            </div>
		</b-card>
        <b-card class="mt-4" v-show="isShowPayDetail" header="退款支付明细">
            <div class="row">
                <div class="col-md-12  mb-2 pl-0">
                    <div class="pull-right">
                        <div class="cardModelLine">
                            <span>应退金额: {{headTab[0].refundOriginalAmount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>实退金额: {{payListTotal}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                    </div>
                </div>
            </div>
		   <div class="row">
                <div class="table-scrollable mb-2 mt-0">
                    <b-table striped hover bordered show-empty :items="payList" :fields="fields">		
                        <template slot="sel" slot-scope="data">
                            <input type="radio" name="payRadio"  v-model="paySel" :value="data.item">					
                        </template>		
                        <template slot="paymentTypeName" slot-scope="data">
                            {{ data.value }}				
                        </template>
                        <template slot="paymentAmount" slot-scope="data">
                            {{ parseFloat(data.value).toFixed(2)}}
                        </template>
                        <template slot="paymentTime" slot-scope="data">
                            {{ data.value}}
                        </template>		
                        <template slot="paymentEmpName" slot-scope="data">
                            {{ data.value}}
                        </template>
                        <template slot="paymentTransactionNo" slot-scope="data">
                            {{ data.value}}
                        </template>
                        <template slot="empty">
                            暂无数据...
                        </template>
                    </b-table>
                </div>
            </div>
		</b-card>
        <add-pay-detail ref="myModalRef" @surePay="addPayList" :userInfo='userInfo' :refCode="payDetailRef"></add-pay-detail>
    </div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import api from "common/api";   
import AreaTree from 'components/iris-areaqueryshop/index'
import approvalRecord from 'components/approval-record/approval-record'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import ListBtnGroup from 'components/list-btn-group/list-btn-group'
import Pagination from 'components/pagination/pagination'
import addPayDetail from 'components/add-pay-detail'
import cardModel from '../back-card/return-card/card-model'
import config from "common/config";
import {CARD_REFUND_ORDER_SEQ, CARD_REFUND_PAYMENT_SEQ} from 'common/sequence.js'
import { MessageBox, Message, DatePicker, Input, Tabs, TabPane, Table ,TableColumn , Tooltip} from 'element-ui'

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tabs);
Vue.use(TabPane);

export default {
    components: {
        AreaTree,
        QueryBtnGroup,
        ListBtnGroup,
        Pagination,
        cardModel,
        approvalRecord,
        addPayDetail,
    },
    data() {
        return {
            OrderId: '',
            cardRefundOrderNo: '',
            oprStatus: '未提交',
            orderStatus: '',
            cardNo: '',
            userInfo: '',
            channelList: [],
            headTab: [
                {
                    empCnName: '',
                    refundTimeStr: '',
                    refundTotalAmount: '',
                    refundFeeCount: '',
                    refundOriginalAmount: '0.00',
                }
            ],
            refundDetail: {
                cardRefundRecordInfoList: [],
            },
            cardcoupons:[],
            param:{
                cardRefundOrderNo:null
            },
            oprList: [],
            field: {
                createTimeStr: {
                    label: "审批时间"
                },
                operatorName: {
                    label: "审批人"
                },
                nodeStatus: {
                    label: "审批结果"
                },
                remark: {
                    label: "反馈意见"
                },
            },
            oprStatus: 0,
            payList: [],
            fields: {},
            fieldsEidt: {	
                    sel: {
						label: "选择"
					},	
					paymentTypeName: {
						label: "支付方式"
					},
					paymentAmount: {
						label: "收款金额"
					},
					paymentTime: {
						label: "收款日期"
					},				
					paymentEmpName: {
						label: "收款人"
					},
					paymentTransactionNo: {
						label: "交易流水号"
					},
            },
            fieldsSee: {				
					paymentTypeName: {
						label: "支付方式"
					},
					paymentAmount: {
						label: "收款金额"
					},
					paymentTime: {
						label: "收款日期"
					},				
					paymentEmpName: {
						label: "收款人"
					},
					paymentTransactionNo: {
						label: "交易流水号"
					},
            },
            payListTotal: '0.00',
            paySel: '',           
            btnStatus: {
                cancel: false,
                saveData: false,
                editOrder: false,
                repealOrder: false,
                InvalidOrder: false,
                submitOrder: false,
            },
            isEditDetail: false,
            isEditPay: false,
            isShowPayDetail: false,
            payDetailRef: CARD_REFUND_PAYMENT_SEQ,
            params:{
                pageNums:config.pageNums,  
            },
        }
    },
     computed: {
    },
    methods: {
        ...mapActions('backCard',[
            'setTableList',
            'setSearchParam',
            'setPages',
            'updateBackCardTabList',
        ]),
        // 生成退卡退款code
        createOrdCode() {
            const option = {
                'serviceCode': CARD_REFUND_ORDER_SEQ,
            }
            return new Promise((reslove,reject) => {
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {							
                        reslove(res.data.obj)
                    };
                })
            })				
        },
         getUserInfo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            let stroe = userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
            this.userInfo = userInfo;
        },
         // 获取支付列表信息
        getPayListInfo(val) {
            let param = {
                cardRefundOrderNo: val
            }
            return new Promise((reslove,reject) => {
                api.returnCard.queryCardRefundPaymentInfoNoPage(param,res => {
                    if(res.data.code === 'success') {	                      			
                        reslove(res.data.obj);
                    };
                })
            })		          
        },
        _initData(val) {
        	this.fields = this.fieldsSee;
            let _this = this;
                api.returnCard.getCardRefundOrderInfoByCardCode({
                    cardRefundOrderNo:this.$route.query.orderNo
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        let dataObj = msg.data.obj
                        if(dataObj != null) {
                            this.orderStatus = dataObj.orderStatus;
                            this.setStatus(this.orderStatus);
                            this.cardRefundOrderNo = dataObj.cardRefundOrderNo;
                            this.oprStatus = this.getOprStatus(dataObj.wfStatus);
                            this.refundDetail = dataObj;
                            this.setHeadTab(dataObj);       
                            if(this.orderStatus == 3 || this.orderStatus == -1) {
                                this.getPayListInfo(this.cardRefundOrderNo).then(res => {
                                    this.payList = res;
                                }) 
                            }       
                        }
                    }
                })
            
        },
        setHeadTab(obj) { 
            this.oprStatus = obj.wfStatus != null ? this.getOprStatus(obj.wfStatus) : '未提交';
            debugger
            this.headTab[0].empCnName =obj.refundEmpName != null ? obj.refundEmpName :this.userInfo.empVo.empCnName; 
            this.headTab[0].refundTimeStr = obj.refundTimeStr; 
            this.headTab[0].refundFeeCount = obj.refundFeeCount != null ? obj.refundFeeCount : '0.00'; 
            this.headTab[0].refundTotalAmount = obj.refundTotalAmount != null ? obj.refundTotalAmount : this.countTotalMoney(obj);                        
            this.headTab[0].refundOriginalAmount = obj.refundOriginalAmount != null ? obj.refundOriginalAmount : this.headTab[0].refundTotalAmount;  
        },
        getRefDetail(val) {        
            this.refundDetail = val;
            this.headTab[0].refundTotalAmount = this.countTotalMoney(val);
            this.headTab[0].refundOriginalAmount =  parseFloat(this.headTab[0].refundTotalAmount - this.headTab[0].refundFeeCount).toFixed(2);
        },
        saveData() {
            let verify = this.$refs.refDetail.verifyData();
            if(!verify) {
                return
            }
            let param = '';
            param = Object.assign({}, this.refundDetail)
            param.cardRefundOrderNo = this.cardRefundOrderNo;
            param.refundTotalAmount = this.headTab[0].refundTotalAmount;
            param.refundFeeCount = this.headTab[0].refundFeeCount;
            param.refundOriginalAmount = this.headTab[0].refundOriginalAmount;
            for( let [i, item] of param.cardRefundRecordInfoList.entries()) {
                param.cardRefundRecordInfoList[i].num = i;
            }
            if(this.OrderId === '') {
                 api.returnCard.insertCardRefundOrderInfo(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "保存成功！"
                        });
                        this._initData(res.data.obj.id);    
                        this.updateBackCardTabList(this.params);        
                    }
                })
            }else {
                api.returnCard.updateCardRefundOrderInfo(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "保存成功！"
                        });
                        this._initData(res.data.obj.id);   
                        this.updateBackCardTabList(this.params);          
                    }
                })
            }
           
        },
        // 编辑
        editOrder() {
            for(let key of Object.keys(this.btnStatus)) {
                this.btnStatus[key] = false;
            } 
            this.btnStatus.cancel = true;
            this.btnStatus.saveData = true;
            this.btnStatus.InvalidOrder = true;
            this.isEditDetail = false;
        },
        // 撤销
        repealOrder() {
            MessageBox.confirm(`确定撤销？`,
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {					
                    let param = {
                        cardRefundOrderNo: this.cardRefundOrderNo
                    }
                    api.returnCard.withDrawCardRefundOrderInfo(param, (res) => {
                        if(res.data.code === 'success') {	
                            Message({
                                type: "success",
                                message: "撤销成功！"
                            });
                            this._initData(res.data.obj.id); 
                            this.updateBackCardTabList(this.params);            
                        }
                    })
				}).catch(() => {
				
				});
        },
         // 作废
        InvalidOrder() {
            MessageBox.confirm(`确定作废？`,
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {					
                let param = {
                    cardRefundOrderNo: this.cardRefundOrderNo
                }
                api.returnCard.cancelCardRefundOrderInfo(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "作废成功！"
                        });
                        this._initData(res.data.obj.id);      
                        this.updateBackCardTabList(this.params);       
                    }
                })
            }).catch(() => {
            
            });

        },
         // 提交
        submitOrder() {
            if(this.headTab[0].refundOriginalAmount <= 0) {
                 Message({
                        type: "warning",
                        message: "应退金额必须大于0"
                    });
                    return
            }
            let param = {
                cardRefundOrderNo: this.cardRefundOrderNo
            }
            api.returnCard.submitRefundOrderInfo(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "提交成功！"
                        });
                        this._initData(res.data.obj.id);  
                        this.updateBackCardTabList(this.params);           
                    }
                })
        },
        addPayList(val) {
            let valObj = Object.assign({}, val);
            valObj.cardRefundOrderNo = this.cardRefundOrderNo;
            if(this.payList.length == 0) {
                this.payList.push(valObj);
            }else {
                let onoff = true;
                for(let [i, item] of this.payList.entries()) {
                    if(item.paymentTransactionNo == valObj.paymentTransactionNo) {
                        Message({
                            type: "warning",
                            message: "该流水号已存在,请重新添加！"
                        });
                        onoff = false;
                        return;
                    }
                };
                if(onoff) {
                    this.payList.push(valObj);
                }
            }
            this.payListTotal = this.countPayTotal(this.payList,'paymentAmount');
        },
        delPayList() {
            if(this.paySel === "") {
                Message({
                    type: "warning",
                    message: "请选择删除项！"
                });
                return;
            }
            for(let [i, item] of this.payList.entries()) {
                if(item.paymentTransactionNo == this.paySel.paymentTransactionNo) {
                    this.payList.splice(this.payList.indexOf(this.paySel), 1);
                    break;
                }
            };
            this.payListTotal = this.countPayTotal(this.payList,'paymentAmount');
        },
        savePaylist() {            
            if(this.payListTotal != this.headTab[0].refundOriginalAmount) {
                Message({
                    type: "warning",
                    message: "应退金额必须等于实退金额！"
                });
                return;
            }
            let param = [...this.payList];
            api.returnCard.editCardRefundPaymentInfo(param, (res) => {
                if(res.data.code === 'success') {	
                    Message({
                        type: "success",
                        message: "完结成功！"
                    });
                    this._initData(this.OrderId);
                    this.updateBackCardTabList(this.params); 
                    // this.getPayListInfo(this.cardRefundOrderNo).then(res => {
                    //      this.payList = res;
                    //  })             
                }
            })
        },
        countPayTotal(arr, key) {
            let num = 0;
            for(let [i, item] of arr.entries()) {
                num += parseFloat(arr[i][key]);         
            };
            return num.toFixed(2);
        },
        countTotalMoney(obj) {
            let totalMoney = 0;
            if(obj.cardRefundRecordInfoList.length != 0) {
                for( let [i, item] of  obj.cardRefundRecordInfoList.entries()) {
                    if(!!parseFloat(item.refundAmount)) {
                       totalMoney += parseFloat(item.refundAmount)
                    }
                }
                totalMoney = totalMoney.toFixed(2)
            }
            return totalMoney;
        },
        countRefundAmount() {
            let feeCoun = parseFloat( this.headTab[0].refundFeeCount) ? parseFloat( this.headTab[0].refundFeeCount) : 0;
            this.headTab[0].refundOriginalAmount = (parseFloat( this.headTab[0].refundTotalAmount) - feeCoun).toFixed(2)
        },
        setStatus(val) {
            this.isEditDetail = false;
            this.isEditPay = false;
            this.isShowPayDetail = false;
            for(let key of Object.keys(this.btnStatus)) {
                this.btnStatus[key] = false;
            } 
            if(val === '-2') {
                this.btnStatus.cancel = true;
                this.btnStatus.saveData = true;
                this.isEditDetail = false;
            }else if(val == '0') {
                this.btnStatus.editOrder = true;
                this.btnStatus.InvalidOrder = true;
                this.btnStatus.submitOrder = true;
                this.isEditDetail = true;
            }else if(val == '1') {
                this.btnStatus.repealOrder = true;
                this.isEditDetail = true;
            }else if(val == '2'){
                this.isShowPayDetail = true;
                this.isEditPay = true;
                this.isEditDetail = true;
            }else{
                this.isShowPayDetail = true;
                this.isEditDetail = true;
                 this.isEditPay = false;
            }
        },
        cancel() {
             this.$router.push({
                                name: 'back-card',    
                            })
        },
        getColumnW(headStr) {
            return (headStr.length) * this.columW +36;
        },
        myModalRefShow(){
            this.$refs.myModalRef.showModal()       
        },
        getOprStatus(val) {
            if(val == '0') {
                return '已提交';
            }else if(val == '1') {
                return '审批通过';
            }else if(val == '-1') {
                return '待提交';
            }
        },
        setValue(obj){
        	     let dataObj = obj
                        if(dataObj != null) {
                            this.orderStatus = dataObj.orderStatus;
                            this.setStatus(this.orderStatus);
                            this.cardRefundOrderNo = dataObj.cardRefundOrderNo;
                            this.oprStatus = this.getOprStatus(dataObj.wfStatus);
                            this.refundDetail = dataObj;
                            this.setHeadTab(dataObj);       
                            if(this.orderStatus == 3 || this.orderStatus == -1) {
                                this.getPayListInfo(this.cardRefundOrderNo).then(res => {
                                    this.payList = res;
                                }) 
                            }       
                        }
        },
    },
    created(){
        this.getUserInfo();
        /*this._initData();*/
        
    },
    watch: {
        /*'$route': '_initData',*/
    },
}
</script>
<style>
    .cardModelLine {
        padding-bottom: 10px;
    }
    @media (min-width: 992px){
        .back-card .modal-lg {
            max-width: 1200px;
        }
    }
</style>
