<template>
    <div class="row">
        <div class="col-md-12">
            <b-card>
                <list-btn-group 
                    @insert="comfirmHandle" 
                    @update="print" 
                    :disabledInsert="!canComfirm"
                    :disabledUpdate="!canPrint"
                    :showInit="false"
                    :insertOptions="{
                        size: 'sm',
                        variant: 'primary', 
                        name: '到货处理',       
                    }"
                    :updateOptions="{
                        size: 'sm',
                        variant: 'success', 
                        name: '打印处理单',       
                    }">
                </list-btn-group>
                
                <div class="table-scrollable mb-2">
                    <b-table striped hover bordered show-empty empty-text="暂无数据" :items="arriveHandleInfo.list" :fields="fields">
                        <template slot="radio" slot-scope="data">
                            <input type="radio" name="radio" :value="data.index" v-model="selectIndex"/>
                        </template>  
                        <template slot="totalAmount" slot-scope="row">{{row.value | toFixed}}</template>    
                        
                        <template slot="totalFreightFee" slot-scope="row">{{row.value | toFixed}}</template>    
                        
                        <template slot="orderStatus" slot-scope="row">{{row.value | statusFilter}}</template>    
                    </b-table>
                </div>

                <div class="row"> 
                    <div class="col-md-12">
                        <pagination class="pull-right" 
                            @page-change="pageChange" 
                            :page-no="arriveHandleInfo.pageNum" 
                            :page-size="arriveHandleInfo.pageSize" 
                            :total-pages="arriveHandleInfo.pages" 
                            :total-result="arriveHandleInfo.total">
                        </pagination>
                    </div>
                </div>
            </b-card>
        </div>
    </div>
</template>
<script>

import ListBtnGroup from 'components/list-btn-group/list-btn-group'
import Pagination from 'components/pagination/pagination'

import { Message } from 'element-ui'

import api from 'common/api'
import config from 'common/config'
import common from 'common/common'
import collectionApi from 'common/api-collection'
import { alertSuccess } from 'common/api-common'

import { mapGetters, mapActions } from 'vuex'

const PLEASE_SELECT_ONE_DATA = '请选择一条数据'

export default {
    components: {
        ListBtnGroup,
        Pagination
    },
    data() {
        return {
            fields: {
                radio: {
                    label: '选择'
                },
                spoOrderNo: {
                    label: '自采单号'
                },
                spoBatchNo: {
                    label: '批次号'
                },
                orderStatus: {
                    label: '到货处理状态'
                },
                supplierName: {
                    label: '供应商'
                },
                whName: {
                    label: '收货地址'
                },
                totalAmount: {
                    label: '采购金额'
                },
                totalFreightFee: {
                    label: '运费'
                }
            },
            selectIndex: -1,
        }
    },
    computed: {
        // 处理状态 (未处理) => 确认处理
        canComfirm() {
            // return this.arriveHandleParams.orderStatus == 2
            if(this.selectIndex === -1) {
                return true
            }
            return this.arriveHandleInfo.list[this.selectIndex].orderStatus == 2
        },
        // 处理状态 (已处理) => 打印处理单        
        canPrint() {
            // return this.arriveHandleParams.orderStatus == 3   
            if(this.selectIndex === -1) {
                return true
            } 
            return this.arriveHandleInfo.list[this.selectIndex].orderStatus == 3
        },
        storeInfoVo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            return userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
        },
        ...mapGetters('storeStation', [
            'arriveHandleInfo',
            'arriveHandleParams'
        ])
    },
    methods: {
        comfirmHandle() {
            this.isSelected(() => {
                this.$router.push({
                    path: 'comfirm',
                    query: {
                        spoBatchNo: this.arriveHandleInfo.list[this.selectIndex].spoBatchNo
                    }
                })
            }) 
        },
        // 打印: 先根据批次号拿到详情数据, 再遍历Vo里面的sku (list) 根据detailCode去查自采订单信息拿到维
        // 修合同号, 和预计交车时间, 放到sku (list)对应的 Vo里面去, 最后再调打印接口,把拼接好的数据带过去     
        print() {
            this.isSelected(() => {
                this.getDetailByCode().then(res => {
                    let printParams = res.data.obj
                    let list = printParams.spoSkuDetailInfoVos
                    let promiseList = []
                    for(let i = 0; i < list.length; i ++) {
                        let params = {
                            detailCode: list[i].detailCode
                        }
                        promiseList[i] =  this.queryOrderInfo(params).then(obj => {
                            list[i].orderNo = obj.list[0].orderNo
                            list[i].bookingClosingDate = obj.list[0].bookingClosingDate
                        })
                        // list[i].purchaseUnitName = '个'
                        list[i].purchaseFee = list[i].purchaseFee.toFixed(2)
                        list[i].totalAmount = list[i].totalAmount.toFixed(2)
                        
                    }
                    Promise.all([...promiseList]).then(o => {
                        printParams.totalMoney = printParams.totalAmount.toFixed(2)
                        printParams.totalFreightFee = printParams.totalFreightFee.toFixed(2)
                        common.previewNeed(common.isdev() + collectionApi.arriveHandle.print, {
                            "jrxmlJson": [printParams],
                            "jrxmlCode": "SpoPrintTemplate"
                        })
                    })
                })
            }) 
        },
        isSelected(next) {
            if(this.selectIndex > -1) {
                next()
            }else {
                Message({
                    type: 'warning',
                    message: PLEASE_SELECT_ONE_DATA
                })
            }
        },
        queryOrderInfo(params) {
            return new Promise(resolve => {
                api.ownPurchase.search(params, res => {
                    if(res.data.code === 'success') {
                        resolve(res.data.obj)
                    }
                })
            })
        },
        getDetailByCode() {
            return new Promise((resolve, reject) => {
                let params = {
                    spoBatchNo: this.arriveHandleInfo.list[this.selectIndex].spoBatchNo
                }
                api.arriveHandle.getDetailByCode(params).then(res => {
                    if(res.data.code === 'success') {
                        resolve(res) 
                    }
                })
            })
        },
        pageChange(currentPage) {
            let arriveHandleParams = JSON.parse(JSON.stringify(this.arriveHandleParams))
            if('storeCode' in arriveHandleParams) {
                arriveHandleParams.pageStart = currentPage
                arriveHandleParams.pageNums = config.pageNums
                this.getArriveHandleInfo(arriveHandleParams)
            }  
        },
        ...mapActions('storeStation', [
            'getArriveHandleInfo'
        ])
    },
    filters: {
        statusFilter(val) {
            if(val == 2) {
                return '未处理'
            }else if(val == 3) {
                return '已处理'
            }
        },
        toFixed(val) {
            return val.toFixed(2)
        }
    }
}
</script>


