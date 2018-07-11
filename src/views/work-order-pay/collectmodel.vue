<template>
    <div class="animated fateIn">
        <b-modal id="money" ref="money" size="lg" hide-footer title="收款">
            <div class="mb-2">
                <b-button variant="info" size="sm" @click="add">新增</b-button>
                <b-button variant="success" size="sm" @click="savePayInfo">保存</b-button>
            </div>
            <div class="scroll">
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr class="text-center">
                            <th class="text-center" v-for="(item, index) in fields" :key="index">{{item}}</th>
                        </tr>
                    </thead>
                    <tbody class="text-center">
                        <tr v-for="(item, index) in moneyList" :key="index">
                            <td class="text-center">{{index + 1}}</td>
                            <!--支付方式-->
                            <td class="text-center">
                                <b-form-select v-model="item.paymentTypeCode" @change="selectPaymentType(index)" :options="paymentTypeList"></b-form-select>
                            </td>
                            <!--金额-->
                            <td class="text-center">
                                <span v-if="item.paymentTypeCode !== 'PaymentModeTypeVoucher'"><input class="form-control" type="text" v-model="item.moneyPrice"/></span>
                                <span v-if="item.paymentTypeCode == 'PaymentModeTypeVoucher'"><input class="form-control" type="text" v-model="item.discountValue"  disabled="true" /></span>
                            </td>
                            <!--交易凭证号-->
                            <td class="text-center">
                                <input class="form-control" type="text" v-model="item.paymentTransactionNo"/>
                            </td>
                            <!--券号-->
                            <td class="text-center">
                                <input class="form-control" v-model ="item.couponsNo"  v-on:blur="checkCoupon(item,index)" type="text" :disabled="item.isCoupon" />
                            </td>
                            <!--卡号-->
                            <td class="text-center">
                                <input class="form-control" v-model="item.cardNo" type="text" disabled="true"/>
                            </td>
                            <!--储值卡余额-->
                            <td class="text-center">
                                <input class="form-control" v-model="item.cardAmout" type="text" disabled="true"/>
                            </td>
                            <!--备注-->
                            <td class="text-center">
                                <input class="form-control" type="text" v-model="item.remark"/>
                            </td>
                            <!--操作-->
                            <td class="text-center">
                                <b-button size="sm" variant="danger" @click="removeMoney(index)">删除</b-button>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="20" class="text-left" v-if="moneyList.length=='0'">暂无数据...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import { MessageBox, Message } from 'element-ui'
    import config from 'common/config'
    import api from 'common/api'
    import {PAYMENTMODE_TYPE} from 'common/ref-code.js'
    import {ORDERPAYMENTSEQ} from 'common/sequence.js'
    export default {
        data() {
            return {
                title: '',
                payStatus: '',
                fields: ['序号', '支付方式', '金额', '交易凭证号','券号','卡号', '储值卡余额', '备注', '操作'],
                moneyList: [],
                //支付方式select
                paymentTypeList:[],
                watchCouponsNo:false,//监控券号有没有变化
            }
        },
        props:{
            pageData: {
                type: Object,
                default: {}
            },
            customCode: {
                type: String,
                default: ''
            }
        },
        created() {
            this.getPaylist();
        },
        methods: {
            // 生成支付明细code
            createDetailCode() {
                if(this.refCode == '') {
                    Message({
                        type: "warning",
                        message: "明细编码不可为空！"
                    });
                    return;
                }
                const option = {
                    'serviceCode': ORDERPAYMENTSEQ,
                }
                return new Promise((reslove,reject) => {
                    api.ordinalInfo.getSequence(option, (res) => {
                        if(res.data.code === 'success') {							
                            reslove(res.data.obj)
                        };
                    })
                })				
            },
            showMadel() {
                this.moneyList = [];
                if(this.pageData.paymentStatus == '1') {
                    this.title = '收款'
                } else {
                    this.title = '退款'
                }
                this.$refs.money.show()
            },
            add(){
                const $this = this;
                this.createDetailCode().then((res) => {
                    let obj = {
                        paymentCode: res, //支付流水业务编码
                        paymentTypeCode: '', //支付方式编码【数据字典】
                        storeCode: this.pageData.storeCode, //门店编码
                        paymentTransactionNo: '', //支付流水号
                        moneyPrice: '',//实际金额
                        cardNo: '', //卡号
                        sourceOrderNo: this.pageData.orderNo, //订单号
                        remark: '', //备注
                        cardAmout: '',
                        isCoupon:true,//默认券不能编辑
                        // 新增支付
                        sourceOrderTypeCode: this.pageData.orderTypeCode// 'transactionNoteTypeAftherSales'
                    }
                    $this.moneyList.push(obj);
                });
            },
            // 获取支付方式
            getPaylist(val) {
                let _this = this;
                const option = {
                    'refCode': PAYMENTMODE_TYPE
                }
                api.ref.getDataDictionarys(option, (res) => {
                    if (res.data.code === 'success') {
                        let i = res.data.obj.referenceDetailInfos.length, arr = []
                        while(i--){
                            arr.push({
                                value: res.data.obj.referenceDetailInfos[i].refDetailCode,
                                text: res.data.obj.referenceDetailInfos[i].refDetailName
                            })
                        }
                        _this.paymentTypeList = arr;
                    }
                });
            },
            //保存
            savePayInfo() {
                const $this = this;
                if(!($this.moneyList.length > 0)){
                    Message({
                        type: 'warning',
                        message: '请先添加支付明细'
                    });
                    return false;
                }
                for (let i = 0, len = $this.moneyList.length; i<len; i++ ) {
                    if($this.moneyList[i].paymentTypeCode == ''){
                        Message({
                            type: 'warning',
                            message: '请选择支付方式'
                        });
                        return false
                    }
                    
                   if($this.moneyList[i].moneyPrice == '' && $this.moneyList[i].paymentTypeCode == 'PaymentModeTypeStoredValue'){
                        Message({
                            type: 'warning',
                            message: '请填写支付金额'
                        });
                        return false
                    }
                    //备用，券支付校验
                    // if($this.moneyList[i].paymentTypeCode == 'PaymentModeTypeVoucher') {
                    //     Message({
                    //         type: 'warning',
                    //         message: config.messInfo.supplierInfo
                    //     });
                    //     return false
                    // }
                }
                $this.api()
            },
            //判断当前支付方式是否为电子会员 
          /*  selectPaymentType(index){
                setTimeout(() => {
                    if(this.moneyList[index].paymentTypeCode != 'PaymentModeTypeStoredValue'){
                        this.moneyList[index].cardNo = "";
                        this.moneyList[index].cardAmout = "";
                        return false;
                    }
                    api.repairOrder.queryCardinfoByCustCode({
                        customCode: this.customCode
                    }, (res) => {
                        if(res.data.message == 'success'){
                            this.moneyList[index].cardNo = res.data.obj.cardNo;
                            this.moneyList[index].cardAmout = res.data.obj.cardAmout;
                        }
                    });
                }, 0);
            },*/
            //根据不同的支付方式操作方式也不同,新加券支付，张伟莉修改
            selectPaymentType(index){
                setTimeout(() => {
                	/*数据清空*/
                	this.moneyList[index].cardNo = "";
                    this.moneyList[index].cardAmout = "";
                    this.moneyList[index].couponsNo = '';
                	this.moneyList[index].moneyPrice = '';
                	this.moneyList[index].discountValue = '';
                	this.moneyList[index].isCoupon = true;
                	switch(this.moneyList[index].paymentTypeCode){
                		case 'PaymentModeTypeStoredValue':
                			this.moneyList[index].isCoupon = true
	                		api.repairOrder.queryCardinfoByCustCode({
		                        customCode: this.customCode
		                    }, (res) => {
		                        if(res.data.message == 'success'){
		                            this.moneyList[index].cardNo = res.data.obj.cardNo;
		                            this.moneyList[index].cardAmout = res.data.obj.cardAmout;
		                        }
		                    });
	                		break;
                		case'PaymentModeTypeVoucher':
                			this.moneyList[index].isCoupon = false
                			break;
                		default:
                		
                		
                		
                		
                	}
      
                }, 0);
            },
            api() {
                //$this.$refs.money.hide(); 
                api.repairOrder.editOrderPaymentInfoList(this.moneyList, (res) => {
                    this.$emit('queryPayList');
                    this.$refs.money.hide();
                });
            },
            //删除支付明细
            removeMoney: function (num) {
                const $this = this
                MessageBox.confirm('确定执行此操作', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            let len = $this.moneyList.length
                            $this.moneyList.splice(num, 1);
                            if ($this.moneyList.length === len-1) {
                                done();
                            }
                        } else {
                            done();
                            return
                        }
                    },
                    callBack: function () {

                    }
                })
            },
            //校验券号
            checkCoupon(val,index){
            	const option = {
            		"couponNo":val.couponsNo,
    				"storeCode":val.storeCode,
            	}
            	if(val.couponsNo == ''){
            		return false
            	}
            	api.repairOrder.checkCoupon(option, (res) => {
            		if(res.data.code == 'success'){
            			/*this.watchCouponsNo = false*/
        				let obj = res.data.obj.couponDetailInfoVos[0]
        				let a = {
        					discountValue: obj.discountValue,
        					moneyPrice: obj.discountValue,
        				}
        				const b = Object.assign(this.moneyList[index],a)
        				this.$set(this.moneyList,index, b);
            		}
                });
            }
        },
        watch:{
        	/*moneyList(val,val2){
        		debugger
        		this.watchCouponsNo = true
        	},*/
        	moneyList:{
        	    handler(val,val2){
        	    	console.log(val)
        	    	console.log(2222)
        	    	console.log(val2)
        	    },
        	    deep:true
        	}
        },
    }
</script>
<style lang="css" scoped>
    .scroll {
        height: 300px;
        overflow-y: scroll;
        /* overflow-x: hidden */
    }
    .text-center tr td {
        max-width: 120px !important;
        min-width: 120px !important;
    }
    .text-center tr td:first-child {
        max-width: 50px !important;
        min-width: 50px !important;
    }
    .text-center tr td:last-child {
        max-width: 80px !important;
        min-width: 80px !important;
    }
</style>
