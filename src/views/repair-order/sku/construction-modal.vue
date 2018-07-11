<template>
    <div class="animated fadeIn">
         <el-dialog size="large" title="施工确认" :visible.sync="visible" :modal-append-to-body="false" ref="dialog">
			 <div class="container-fluid">
				 <b-row>
					<div class="col-md-4 pt-3">
                        <span class="mt-3 mb-3">
                            订单号: {{orderNo}}
                        </span>
                    </div>
                    <div class="col-md-4 pt-3">
                        <span class="mt-3 mb-3">
                            车牌: {{carInfo.plateNumber}}
                        </span>
                    </div>
                    <div class="col-md-4 pt-3">
                         <span class="mt-3 mb-3">
                            车型: {{carInfo.displayName}}
                        </span>
                    </div>
                    <div class="col-md-4 pt-3">
                        <span class="mt-3 mb-3">
                            商品编码: {{skuInfo.skuCode}}
                        </span>
                    </div>
                    <div class="col-md-4 pt-3">
                        <span class="mt-3 mb-3">
                            精品名称: {{skuInfo.skuName}}
                        </span>
                    </div>
                    <div class="col-md-4 pt-3">
                         <span class="mt-3 mb-3">
                            单位: {{skuInfo.checkUnitName}}
                        </span>
                    </div>
                    <div class="col-md-4 pt-3">
                        <span class="mt-3 mb-3">
                            型号: {{skuInfo.skuModel}}
                        </span>
                    </div>
                    <div class="col-md-4 pt-3">
                         <span class="mt-3 mb-3">
                            规格: {{skuInfo.skuStandards}}
                        </span>
                    </div>
                    <div class="col-md-4 pt-3">
                         <span class="mt-3 mb-3">
                            69码: {{skuInfo.barCode}}
                        </span>
                    </div>
                    <div class="col-md-4 pt-3">
                        <span >备货状态: </span>
                        <span :class="{'text-danger' : skuItem.detailStatus == 0, 'text-success' : skuItem.detailStatus == 1}">{{ status }}</span>
                    </div>
                    <div class="col-md-4 pt-3">
                        <span>记账类型: </span>
                        <span>{{skuItem.accountTypeName}} &nbsp;&nbsp; {{skuItem.reconciliationTargetName}}</span>
                        <!-- <account-type-select
                            ref="accountType"
                            :disabled="true" 
                            :accountTypeList="accountTypeList">
                        </account-type-select> -->
                    </div>
				</b-row>	
                <div class="mt-3 pt-3">
                    <div class="table-scrollable mb-2">
                        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="list" :fields="fields">                           
                            <template slot="serviceDisplayName" slot-scope="data">
                               <b-form-input v-model="list[data.index].serviceDisplayName" />
                            </template>
                            <template slot="priceType" slot-scope="data">
                                <b-form-select v-model="list[data.index].priceType" :options="priceTypeList"></b-form-select>
                            </template> 
                            <template slot="actualWorkHours" slot-scope="data">
                                <b-form-input v-model="list[data.index].actualWorkHours" :readonly="list[data.index].priceType == 1" type="number"/>
                            </template> 
                            <template slot="actualSalesPrice" slot-scope="data">
                                <b-form-input v-model="list[data.index].actualSalesPrice" :readonly="list[data.index].priceType == 2" type="number"/>
                            </template>
                            <template slot="costTime" slot-scope="data">
                                <b-form-input v-model="list[data.index].costTime" type="number"/>
                            </template> 
                        </b-table>
                    </div>
                </div>				
			 </div>
			<div slot="footer" class="dialog-footer dialog-footer-cla">         				
				<b-btn size="sm" class="float-right" variant="success" @click="confirmClick">确定</b-btn>
				<b-btn size="sm" class="float-right mr-2" variant="seconday" @click="cancelClick">取消</b-btn>
			</div>
		</el-dialog>
    </div>
</template>
<script>
import Vue from "vue"
import { Message, Input, Dialog } from "element-ui"
// import AccountTypeSelect from 'components/account-type-select/account-type-select'
import config from 'common/config'

import { mapGetters } from 'vuex'

Vue.use(Input)
Vue.use(Dialog)

export default {
    components: {
        // AccountTypeSelect
    },
    props: {
        orderNo: {
            type: String,
            default: ''
        },
        detailCode: {
            type: String,
            default: ''
        },
        channelTypeCode: {
            type: String,
            default: ''
        },
        skuInfo: {
            type: Object,
            default: () => {}
        },
        carInfo: {
            type: Object,
            default: () => {}
        },
        skuItem: {
            type: Object,
            default: () => {}
        },
        accountTypeList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {   
            visible: false, 
            list: [
                {serviceCode: '', serviceName: '', priceType: 2, serviceDisplayName: '', actualWorkHours: '', actualWorkHourPrice: '', actualSalesPrice: '', costTime: ''}
            ],
            fields: {
                serviceCode: {
                    label: '服务编码'
                },
                serviceName: {
                    label: '服务名称'
                },
                serviceDisplayName: {
                    label: '服务显示名称'
                },
                priceType: {
                    label: '价格类型'
                },
                actualWorkHours: {
                    label: '标准工时'
                },
                actualWorkHourPrice: {
                    label: '工时单价'
                },
                actualSalesPrice: {
                    label: '标准售价门市价(元)'
                },
                costTime: {
                    label: '预计耗时(分钟)'
                }
            },  
            priceTypeList: [
                {text: '固定价格', value: 1},
                {text: '非固定价格', value: 2}               
            ]
        }
    },
    mounted() {
        this.list[0].actualWorkHourPrice = this.storeInfo.labourHourUnitPrice
        this.list[0].serviceCode = this.openServiceInfo.refDetailValue
        this.list[0].serviceName = this.openServiceInfo.refDetailName
    },
    computed: {
        status() {
            let detailStatus = this.skuItem.detailStatus
            if(detailStatus == 0) {
                return '缺货'
            }else if(detailStatus == 1) {
                return '已备货'
            }else if(detailStatus == 2) {
                return '已出库'
            }
        },
        // priceTypeList() {
        //     let list = []
        //     this.priceTypes.forEach(item => {
        //         if(item.value != 'Custom') {
        //             list.push(item)
        //         }
        //     })
        //     return list
        // },
        ...mapGetters('workOrder', [
            'priceTypes',
            'storeInfo',
            'openServiceInfo'
        ])
    },
    methods: {
        show() {
            this.visible = true
        },
        hide() {
            this.visible = false
        },
        confirmClick() {
            if(this.list[0].priceType == 2 && (this.list[0].actualWorkHours - 0 < 0)) {
                Message({ 
                    type: 'warning', 
                    message: '标准工时不能为空, 且不能小于0'
                })
            	return
            }else if(this.list[0].priceType == 1 && (this.list[0].actualSalesPrice - 0 < 0)) {
                Message({ 
                    type: 'warning', 
                    message: '标准售价门市价不能为空, 且不能小于0'
                })
            	return
            }
            this.$emit('skuAddService', this.list[0])
            this.hide()
        },
        cancelClick() {
            this.hide()
        }
    },
    watch: {
        list: {
            handler(val) {
                // 预计耗时 = 工时转化系数 * 标准工时
                this.list[0].costTime = this.storeInfo.labourHourToMinutes * val[0].actualWorkHours
                // 非固定价格
                if(val[0].priceType == 2) {
                    // 标准售价门市价 = 标准工时 * 工时单价
                    this.list[0].actualSalesPrice = (val[0].actualWorkHours * val[0].actualWorkHourPrice).toFixed(2)
                // 固定价格
                }else if(val[0].priceType == 1) {
                    // 标准工时 = 标准售价门市价 / 工时单价
                    this.list[0].actualWorkHours = (val[0].actualSalesPrice / val[0].actualWorkHourPrice).toFixed(2)
                }
            },
            deep: true
        },
        skuItem: {
            handler(val) {
                if(val.installationServiceInfoVo) {
                    for(let key in val.installationServiceInfoVo) {
                        this.list[0][key] = val.installationServiceInfoVo[key]
                    }
                }
            },
            deep: true,
            immediate: true
        }
    }
}
</script>
