<template>
    <div class="animated fadeIn">
        <b-card header="主档信息">
            <div class="row">
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="单号" :label-cols="4" class="text-right">
                        <b-form-input type="text" v-model="orderInfo.orderNo" disabled>
                        </b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="门店" :label-cols="4" class="text-right">
                        <b-form-input type="text" v-model="orderInfo.storeName" disabled>
                        </b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="接待人" :label-cols="4" class="text-right">
                        <b-form-input type="text" v-model="orderInfo.salesEmpName" disabled>
                        </b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="开单时间" :label-cols="4" class="text-right">
                        <!-- new
                        <b-form-input type="text" v-model="orderInfo.createTime" disabled>
                        </b-form-input> -->
                        <div id="EditColorPickerFix">
                            <date-picker v-model="orderInfo.createTime" disabled>
                            </date-picker>
                        </div>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单业务类型" :label-cols="4" class="text-right">
                        <b-form-input type="text" v-model="orderInfo.businessTypeName" disabled>
                        </b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="客户姓名" :label-cols="4" class="text-right">
                        <b-form-input type="text" v-model="orderInfo.custName" disabled>
                        </b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="手机号" :label-cols="4" class="text-right">
                        <b-form-input type="tel" v-model="orderInfo.custMobile" disabled>
                        </b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-12">
                    <div class="table-scrollable">
                        <table class="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>车牌</th>
                                    <th>车型</th>
                                    <th>最近一次进厂时间</th>
                                    <th>最近一次进厂门店</th>
                                    <th>最近一次消费金额</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>{{ orderInfo.custPlates }}</th>
                                    <th>{{ orderInfo.carDisplayName }}</th>
                                    <th>{{ orderInfo.closingDate }}</th>
                                    <th>{{ orderInfo.storeName }}</th>
                                    <th>{{ orderInfo.actualAmountTotal }}</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card header="明细">
            <div>
                <div class="row">
                    <div class="col-md-4">
                        <b-form-input type="text" placeholder="search" v-model="searchValue">
                        </b-form-input>
                    </div>
                    <div class="col-md-1">
                        <b-button variant="primary" size="sm" @click="searchSkuOrderOutStockDetail">搜索</b-button>
                    </div>
                </div>
                <div class="table-scrollable">
                    <table class="table table-striped table-hover table-bordered">
                        <thead>
                            <tr>
                                <th v-for="(field, index) in fields" :key="index">
                                    {{ field.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in skuDetaiInfoList" :key="index">
                                <td>
                                    <input type="checkbox" 
                                    name="selectRows" 
                                    :value="item.skuGroupCode" 
                                    v-model="selectRows" 
                                    :disabled="item.detailStatus != 1" />
                                    <!-- @click="checkBoxMutex(item)" -->
                                </td>
                                <td>
                                    {{ item.serviceName }}
                                </td>
                                <td>
                                    {{ item.serviceDisplayName }}
                                </td>
                                <td>
                                    {{ item.skuCode }}
                                </td>
                                <td>
                                    {{ item.skuName }}
                                </td>
                                <td>
                                    {{ item.whName }}
                                </td>
                                <td>
                                    {{ item.detailStatus | detailStatus }}
                                </td>
                                <td>
                                    {{ item.nums }}
                                </td>
                                <td>
                                    {{ item.outSourceNo }}
                                </td>
                                <td>
                                    {{ item.outStockSystemTimeStr }}
                                </td>
                            </tr>
                            <tr v-if="skuDetaiInfoList.length == 0">
                                <td colspan='12' class="text-left">暂无数据...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="row" v-show="showClickChu">
                    <div class="col-md-12">
                        <div class="pull-right">
                            <span class="btn btn-primary btn-sm" @click="updateSkuOrderOutStock">
                                出库
                            </span>
                            <span v-if="showoutBatchNo" class="btn btn-success btn-sm" @click="printList">
                                打印
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </b-card>
    </div>
</template>

<script>
    import {
        mapState, 
        mapGetters,
        mapActions
    } from 'vuex'
    import {
        MessageBox,
        Message,
        DatePicker
    } from 'element-ui'
    import config from '../../common/config'
    export default {
        mounted() {
            let _this = this
            // vuex添加
            _this.getPickingInfoByOrderNo({
                orderNo: _this.$route.params.orderNo,
                callback: (orderInfo, skuDetaiInfos) => {
                    _this.orderInfo = orderInfo
                    _this.skuDetaiInfos = skuDetaiInfos
                    _this.filterData = skuDetaiInfos // 搜索用字段
                    _this.skuDetaiInfoList = skuDetaiInfos
                    // 需求1: 此页面显示，假如所有都不可选，或者为空，出库按钮不显示

                    // 需求2: 假如页面有已出库状态，将显示打印按钮，并点击打印相应的单子？？？？ 单选 OR 多选
                    console.log('领料测试', skuDetaiInfos)
                    // _this.skuDetaiInfoList = skuDetaiInfos.filter(function (val) {
                    //    if (Object.prototype.toString.call(val.whName).search('Null') >= 0 ) {
                    //         val.detailStatus == 1
                    //    }
                    //    return val
                    // }) // 筛选仓库名称不为空的)
                    // _this.filterData = _this.skuDetaiInfoList
                    console.log('主档信息', orderInfo)
                    console.log('筛选', _this.skuDetaiInfoList)
                    if(_this.skuDetaiInfos.length !== 0) { _this.showClickChu = true }
                }
            })
        },
        data: function() {
            return {
                // 储存筛选后的数据
                filterData: [],
                // 显示打印按钮
                showoutBatchNo: false,
                // outBatchNo -- 二次打印按钮(储存上次出库后的outBatchNo)
                outBatchNo: '',
                // 显示出库按钮
                showClickChu: false,
                order: {},
                fields: {
                    selectRows: {
                        label: '选择'
                    },
                    serviceName: {
                        label: '服务名称'
                    },
                    serviceDisplayName: {
                        label: '服务显示名称'
                    },
                    skuCode: {
                        label: '商品编码'
                    },
                    skuName: {
                        label: '商品名称'
                    },
                    whName: {
                        label: '出库仓名称'
                    },
                    detailStatus: {
                        label: '状态'
                    },
                    nums: {
                        label: '数量'
                    },
                    outSourceNo: {
                        label: '出库单号'
                    },
                    outStockSystemTimeStr: {
                        label: '出库时间'
                    }
                },
                searchValue: '',
                selectRows: [],
                items: [],
                orderInfo: {},
                skuDetaiInfos: [],
                skuDetaiInfoList: []
            }
        },
        computed: {},
        watch:{
            outBatchNo (val) {
                if (val) {
                    this.showoutBatchNo = true
                    this.selectRows = []
                }
            }, 
            selectRows () {
                // this.data = '' // 数据库取的数值
                // this.checkDFFboxData = [] // 选中的字段
                // 先去判断是不是去增加选项还是减少选项
                let f = this.selectRows
                if (f.length < 2) { return }
                let a = f[f.length-1] // 倒数第一
                let b = f[f.length-2] // 倒数第二
                // console.log(a, b) // 用box传参去查数据
                // 现在处理倒数第一和倒数第二的仓库是不是相同
                let c1 = this.filterBySkuGroupCode(this.skuDetaiInfoList, a)
                let c2 = this.filterBySkuGroupCode(this.skuDetaiInfoList, b)
                // console.log(c1, c2) // 用box传参去查数据
                if (c1 !== c2) {
                    Message({ 
                        type: 'warning', 
                        message: '出库仓库不相同不能在一张出库单上出库！'
                    })
                    // console.log('仓库名称不同,弹出警告,并删除数组的最后一项')
                    // 提示框，并删除倒数第二个
                    this.selectRows.pop()
                }
            }
        },
        created () {
        },
        methods: {
            // 通过skuGroupCode比较仓库名称
            filterBySkuGroupCode (data, a) {
                return data.filter(function (val) {
                    return val.skuGroupCode === a
                })[0]['whName']
            },
            // 仓库不同互斥按钮选择
            checkBoxMutex (val) {
                // console.log('互斥val', val)
            },
            printList () {
                let _this = this
                this.PdfReportOutStock({
                    // outBatchNo
                   name: 'outBatchNo',
                   value: _this.outBatchNo
                })
            },
            updateSkuOrderOutStock: function() {
                let _this = this
                let groupCodes = []
                _this.selectRows.forEach((code) => {
                    groupCodes.push({
                        skuGroupCode: code
                    })
                })
                if (groupCodes.length > 0) {
                    let h = _this.$createElement
                    MessageBox({
                        title: '提示',
                        message: h('h6', '是否出库该材料!'),
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: (action, instance) => {
                            if (action === 'confirm') {
                                _this.updateSkuOrderOutStockList({
                                    groupCodes,
                                    callback: (batchNo) => { // 出库成功后会返回inBatchNo,拿这个参数去调用打印接口
                                        // 需求打印成功后会出现打印按钮，点击按钮，打印上次出库成功后的数据
                                        _this.outBatchNo = batchNo
                                        
                                        _this.getPickingInfoByOrderNo({
                                            orderNo: _this.$route.params.orderNo,
                                            callback: (orderInfo, skuDetaiInfos) => {
                                                _this.orderInfo = orderInfo
                                                _this.skuDetaiInfoList = skuDetaiInfos
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    })
                } else {
                    Message({ 
                        type: 'warning', 
                        message: '请选择一条订单'
                    });
                    return false
                }
            },
            searchSkuOrderOutStockDetail () { // 商品搜索
                this.skuDetaiInfoList = this.filterData
                // 数据为空就不操作
                let oData = this.skuDetaiInfoList, newStrData = [], filterData, changeData=[]
                if(!oData) return
                for(let i = 0; i < oData.length; i++){
                    newStrData.push(JSON.stringify(oData[i]))
                }
                let value = this.searchValue.replace(/[\'\"\\\/\b\f\n\r\t]/g, '')
                
                filterData = newStrData.filter(function (a) {
                    return a.search(value) > -1
                })
                for(let i = 0; i < filterData.length; i++){
                    changeData.push(JSON.parse(filterData[i]))
                }
                
                this.skuDetaiInfoList = changeData
                //console.log(skuDetaiInfos, changeData)

                // let _this = this
                // // JSON.stringify(a[0])
                // let index = _this.skuDetaiInfos.findIndex((skuDetaiInfo) => {
                //     return (JSON.stringify(skuDetaiInfo).indexOf(value) >= 0)
                // })
                // if (index >= 0) {
                //     _this.skuDetaiInfoList = [_this.skuDetaiInfos[index]]
                // } else {
                //     _this.skuDetaiInfoList = []
                // }
            },
            ...mapActions('storeRequisition', [
                'getPickingInfoByOrderNo',
                'updateSkuOrderOutStockList',
                'PdfReportOutStock'
            ])
        },
        components: {
            DatePicker
        }
    }
</script>

<style scoped>

</style>
