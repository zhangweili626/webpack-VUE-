<template>
	<div>
		<b-card header="对账核销单">
            <div class="row">
                <div class="col-md-4 col-lg-4">
                    <!--处理单号 生成 对应参数：reconciliationVerifyOrderNo-->
                    <b-form-fieldset horizontal label="处理单号" :label-cols="4" class="text-right">
                        <b-form-input v-model="verifiedStatementData.reconciliationVerifyOrderNo" :disabled="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--对账单类型 对应参数：reconciliationType-->
                    <b-form-fieldset horizontal label="对账单类型" :label-cols="4" class="text-right">
                        <b-form-input v-model="verifiedStatementData.reconciliationType" :disabled="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--供货方 对应参数：supplierCode-->
                    <b-form-fieldset horizontal label="供货方" :label-cols="4" class="text-right">
                        <b-form-input v-model="verifiedStatementData.supplierName" :disabled="true"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--创建人 对应参数：暂无入参-->
                    <b-form-fieldset horizontal label="创建人" :label-cols="4" class="text-right">
                        <b-form-input readOnly v-model="verifiedStatementData.createName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--创建时间 对应参数：暂无入参-->
                    <b-form-fieldset horizontal label="创建时间" :label-cols="4" class="text-right">
                        <b-form-input readOnly v-model="verifiedStatementData.createTimeStr"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--应开票金额 对应参数：originalInvoiceAmount-->
                    <b-form-fieldset horizontal label="应开票金额" :label-cols="4" class="text-right">
                        <b-form-input :disabled="true" v-model="verifiedStatementData.originalInvoiceAmount" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--实开票金额 对应参数：actualInvoiceAmount-->
                    <b-form-fieldset horizontal label="实开票金额" :label-cols="4" class="text-right">
                        <b-form-input :disabled="true" v-model="verifiedStatementData.actualInvoiceAmount" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--付款总计金额 对应参数：actualInvoiceAmount-->
                    <b-form-fieldset horizontal label="付款总计金额" :label-cols="4" class="text-right">
                        <b-form-input :disabled="true" v-model="verifiedStatementData.totalPaymentAmount" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--应付金额 对应参数：originalPaymentAmount-->
                    <b-form-fieldset horizontal label="应付金额" :label-cols="4" class="text-right">
                        <b-form-input :disabled="true" v-model="verifiedStatementData.originalPaymentAmount" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-4 col-lg-4">
                    <!--应付金额 实付金额：actualPaymentAmount-->
                    <b-form-fieldset horizontal label="实付金额" :label-cols="4" class="text-right">
                        <b-form-input :disabled="true" v-model="verifiedStatementData.actualPaymentAmount" />
                    </b-form-fieldset>
                </div>
            </div>
        </b-card>
        <b-card header="核销明细">
        	<div class="table-scrollable">
        		<b-table striped hover bordered show-empty :items="statementTableData" :fields="statementTableFields">
                        <template slot="totalAmount" slot-scope="data">
                            {{data.item.totalAmount.toFixed(2)}}
                        </template>
                        <template slot="empty">
                           		 暂无数据...                  
                        </template>
                    </b-table>
        	</div>
        </b-card>
	</div>
</template>

<script>
	import api from 'common/api'
	export default{
		data(){
			return{
				verifiedStatementData:{
                   	reconciliationVerifyOrderNo:'', //处理单号
                    reconciliationType: '', //对账单类型
                    reconciliationTypeName: '',//对账单名称
                    supplierCode: '', //供货方
                    supplierName: '',
                    createName:'',//创建人
                    createTimeStr: '',//创建时间
                    originalInvoiceAmount: 0, //应开票金额
                    actualInvoiceAmount: 0, //实开票金额
                    totalPaymentAmount: 0, //付款总计金额
                    originalPaymentAmount: 0, //应付金额
                    actualPaymentAmount: 0, //实付金额
                    updateBy:'',
                },
                statementTableData:[],
               	statementTableFields:{
                    reconciliationOrderNo:{
                        label: '对账单号'
                    },
                    totalAmount:{
                        label: '对账总金额'
                    },
                    totalSkuCount:{
                        label: '对账总数量'
                    }
                },
			}
		},
		mounted(){
			this.queryInfoGet();
			this.queryReconciliationOrderInfos();
		},
		methods:{
			 //查询基础信息
            queryInfoGet(){
                api.statementAccountCancel.queryReconciliationVerifyOrderInfoNoPage({
                    reconciliationVerifyOrderNo:this.$route.query.orderNo,
                }, (res) => {
                    if(res.data.code == "success"){
                    	for(let k of Object.keys(this.verifiedStatementData)){
                    		this.verifiedStatementData[k]=res.data.obj[0][k]
                    	}
                    	this.verifiedStatementData.reconciliationType=this.verifiedStatementData.reconciliationType == 0 ? '采购对账':'集团内部对账'
                    }
                });
            },
             //查询对账明细
            queryReconciliationOrderInfos(){
                api.statementAccount.queryReconciliationOrderInfos({
                    reconciliationVerifyOrderNo: this.$route.query.orderNo
                }, (res) => {
                    if(res.data.code == "success"){
                        this.statementTableData = res.data.obj.list;
                        //this.treeCpu();//应开票金额,应付金额,付款总计 计算
                    }else{
                        Message({ 
                            type: 'warning', 
                            message: res.data.message
                        });
                    }
                })
            },
		},
		watch:{
			'$route':'queryInfoGet'
		},
		filters:{
			getType(val){
				switch(val){
					case 0 :
					return '采购对账'
					break;
					case 1:
					return '集团内部对账'
					break;
				}
			}
		}
	}
</script>

<style>
</style>