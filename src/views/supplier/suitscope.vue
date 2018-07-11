<template>
    <div>
        <!-- <suitscope @shop-preserve="saveStores"
                   :tab-data="tabdata"
                   @sales-preserve="saveSales" 
                   @remove-tr="remove">
        </suitscope> -->
        <scope ref="scope" :multipleSelection="true" :fields="fields" @deletScopeBtn="remove"  :addscope="insertRange" :tablist="tabdata"></scope>                    
    </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
import { MessageBox, Message } from 'element-ui'
import config from 'common/config'
import api from 'common/api'
import Suitscope from 'components/iris-suitscope/'
import scope from 'components/iris-scope'
export default {
    components: {
        Suitscope,
        scope
    },
    props: {
        supplierCode: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            tabdata: [],
            rangeCode: '',
            fields:[{label:"销售区域",name:"salesAreaName",},{label:"行政区域",name:"chinaAreaName",},{label:"门店",name:"storeName"}],                
        }
    },
    computed: {
        ...mapState('supplier', [
                'supplierTypeList',
			])
    },
    mounted() {
        this.queryREange()
    },
    methods: {
        ...mapActions('supplier', [
				'getSuitScopeCode',
                'querySupplierSuitScope',
                'addSupplierSuitScope'
            ]),
            // 查询适用范围
        getQueryRange: function(params, callback) {
            this.querySupplierSuitScope({
                poros: params,
                callBack: (res) => {
                    if (res.data.code === "success") {
                        let data = res.data.obj.list
                        callback(data)
                    }
                }
            })
        },
        //初始化适用范围
        queryREange: function() {
            let obj = {
                supplierCode: this.supplierCode,
                pageStart: 1,
                pageNums: config.maxPageNums
            }
            this.getQueryRange(obj, res => {
                        this.tabdata = [];
                        for (let index = 0; index < res.length; index++) {
                            const element = res[index];
                            element.code = element.chinaAreaCode || element.salesAreaCode || element.storeCode
                            element.name = element.chinaAreaName || element.salesAreaName || element.storeName
                            element.type = (element.chinaAreaCode && '行政区域') || (element.salesAreaCode && '销售区域') || (element.storeCode && '经销商店')
                        }
                        this.tabdata = res
                        // res.forEach(item => {
                        //     let data = {
                        //         nationwide: "",
                        //         sales: item.salesAreaName,
                        //         shop: item.storeName,
                        //         id: item.id,
                        //         supplier: item.supplier,
                        //         rangeCode: item.rangeCode
                        //     }
                        //     this.tabdata.push(data)
                        // })
                    })
        },
        //获取适用范围编码
        getUseRangeer: function (par, fun) {
            this.getSuitScopeCode((msg) => {
                this.rangeCode = msg
                fun()
            })
        },
        saveSales: function (salelists) {
            const $this = this
            $this.getUseRangeer('', () => {
                $this.save(salelists)
            })
        },
        saveStores: function (storelists) {
            const $this = this
            $this.getUseRangeer('', () => {
                $this.save(storelists)
            })
            
        },
        remove: function (item) {
            let params = []
            console.log(item)
            if (item.length != 0) {
                let data = {
                    'supplierCode': this.supplierCode,
                    'rangeCode': item.rangeCode,
                    "isDeleted": '1',
                    "id": item.id
                }
                params.push(data)
            }
            
            this.editRange(params)
        },
        //编辑适用范围信息
        editRange: function(params) {
            this.addSupplierSuitScope({
                poros: params,
                callBack: (res) => {
                    if(res.data.code === "success") {
                        Message({
                            type: 'info',
                            message: config.messInfo.success
                        });
                        let param = { 
                            supplierCode: this.supplierCode,
                            pageStart: 1,
                            pageNums: config.maxPageNums
                        };
                    this.getQueryRange(param, res => {
                        this.tabdata = [];
                        this.tabdata = res
                    })
                    }
                }
            })
        },
        // 新增适用范围
        insertRange(code, data) {
            const _this = this;
            if(Array.isArray(data)){
                //批量
                api.ordinalInfo.getSequenceList({
                'serviceCode': 'CARDTMPUSERANGESEQ',
                'getNums': data.length
                },(msg) => {
                    if(msg.data.message == 'success'){
                        let SEQ = msg.data.obj
                        let list = []
                        let codes = []
                        console.log(data)
                            if(code == config.scopeType.sales){
                                for (let index = 0; index < SEQ.length; index++) {
                                    const element = SEQ[index];
                                    codes.push(data[index].code)                                        
                                    list[index]={
                                        rangeCode:element,
                                        supplierCode: this.supplierCode,
                                        salesAreaCode:data[index].code,
                                        salesAreaName:data[index].name,
                                    }
                                }
                            }
                            if(code == config.scopeType.shop){
                                for (let index = 0; index < SEQ.length; index++) {
                                    const element = SEQ[index];
                                    codes.push(data[index].code)
                                    list[index]={
                                        rangeCode:element,
                                        supplierCode: this.supplierCode,
                                        storeCode:data[index].code,
                                        storeName:data[index].name,
                                    }
                                }
                            }
                            if(code == config.scopeType.government){
                                for (let index = 0; index < SEQ.length; index++) {
                                    const element = SEQ[index];
                                    codes.push(data[index].code)
                                    list[index]={
                                        rangeCode:element,
                                        supplierCode: this.supplierCode,
                                        chinaAreaCode:data[index].code,
                                        chinaAreaName:data[index].name,
                                    }
                                }
                            }
                        let str = ""
                        for (let j = 0; j < _this.tabdata.length; j++) {
                            const element = _this.tabdata[j];
                            if(codes.includes(element.code)){
                                str += element.name + ' '
                            }
                        }
                        if(str!==""){
                            MessageBox.confirm(`${str}已存在！`, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                            }).catch(() => {
                            });
                            return;
                        }
                        api.supplier.addSupplierSuitScope(list,(msg)=>{
                            if(msg.data.message == 'success'){
                                Message({
                                    type: 'success',
                                    message: '保存成功！'
                                });
                                _this.$refs.scope.activePage()   
                                   let param = { 
                                            supplierCode: this.supplierCode,
                                            pageStart: 1,
                                            pageNums: config.maxPageNums
                                        };
                                    this.getQueryRange(param, res => {
                                        this.tabdata = [];
                                        this.tabdata = res
                                    })                            
                            }                    
                        })
                    } 
                })
                
            }else{
                //单条
            }
            // this.addSupplierSuitScope({
            //     poros: params,
            //     callBack: (res) => {
            //         if(res.data.code === "success") {
            //             callback()
            //             Message({
            //                 type: 'info',
            //                 message: config.messInfo.success
            //             });
            //         }
            //     }
            // })
        },
        save(e) {
            let saveParams = [];
            let promise = new Promise((resolve, reject) => {
                resolve()
            })
            promise.then(() => {
                e.forEach(item => {
                    let data = {
                        "supplierCode": this.supplierCode,
                        // "useRangeCode": this.useRangeCode,
                        "rangeCode": this.rangeCode || item.rangeCode,
                        "salesAreaCode": item.salesAreaCode,
                        "storeCode": item.storeCode || ''
                    }
                    saveParams.push(data)
                });
            }).then(() => {
                this.insertRange(saveParams, () => {
                    let param = { 
                            supplierCode: this.supplierCode,
                            pageStart: 1,
                            pageNums: config.maxPageNums
                        };
                    this.getQueryRange(param, res => {
                        this.tabdata = [];
                        for (let index = 0; index < res.length; index++) {
                            const element = res[index];
                            element.code = element.chinaAreaCode || element.salesAreaCode || element.storeCode
                            element.name = element.chinaAreaName || element.salesAreaName || element.storeName
                            element.type = (element.chinaAreaCode && '行政区域') || (element.salesAreaCode && '销售区域') || (element.storeCode && '经销商店')
                        }
                        this.tabdata = res
                        // res.forEach(item => {
                        //     let data = {
                        //         nationwide: "",
                        //         sales: item.salesAreaName,
                        //         shop: item.storeName,
                        //         id: item.id,
                        //         supplierCode: item.supplierCode,
                        //         rangeCode: item.rangeCode
                        //     }
                        //     this.tabdata.push(data)
                        // })
                    })
                })

            })
        },
        
    },
}
</script>

