<template>
    <div class="animated fadeIn large-diag">
         <el-dialog size="large" title="添加精品"  :visible.sync="dialogPay" :modal="false" ref="modal2">
			 <div class="container-fluid dialog-cont-h">
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
				</b-row>	
                <div class="mt-3 pt-3">
                    <b-row class="text-left">
                        <div class="col-md-12 text-primary">
                            <h5>商品信息</h5>
                        </div>
                    </b-row>
                    <b-row class="mt-2">
                        <div class="col-md-4">
                             <b-form-select :options="whList" size="sm" v-model="whCode" @input="whChange"></b-form-select>
                        </div>
                    </b-row>
                    <div class="table-scrollable mb-2 service-manhour">
                        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="searchList" :fields="searchFields">                           
                            <template slot="skuPrice" slot-scope="data">
                               {{parseFloat(data.value).toFixed(2)}}
                            </template>
                            <template slot="selectSku" slot-scope="data">
                                <b-button size="sm" variant="primary" @click="selectSku(data.item)">选择</b-button>
                            </template> 
                        </b-table>
                    </div>
                </div>				 
				<div class="mt-3 pt-3">
                     <b-row class="text-left">
                        <div class="col-md-12  text-primary">
                            <h5>需求信息</h5>
                        </div>
                    </b-row>
                    <div class="table-scrollable mb-2 service-manhour">
                        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="needList" :fields="fields">
                            <template slot="nums" slot-scope="data">
                                <b-form-input @input="inputNums" v-model="data.value" :disabled="!!data.item.id"/>                      
                            </template> 
                            <template slot="skuPrice" slot-scope="data">
                               {{data.value ? parseFloat(data.value).toFixed(2): ''}}
                            </template>
                            <template slot="actualSalesPrice" slot-scope="data">
                               {{data.value ? parseFloat(data.value).toFixed(2): ''}}
                            </template>
                            <template slot="stockUpStatus" slot-scope="data">
                               <span v-if="data.value === '1'" class="text-success">充足</span>                      
                               <span v-if="data.value === '0'" class="text-danger">缺货</span>                      
                            </template> 
                            <template slot="operation" slot-scope="data">
                                <div style="width: 70px;">
                                    <b-button size="sm" variant="primary" class="pull-left" @click="stockUp(data.item)" v-if="data.item.id && data.item.stockUpStatus == '0'">备货</b-button>
                                    <!-- <b-button size="sm" variant="danger" class="pull-left ml-3" @click="delSku(data.item)">清空</b-button> -->
                                </div>                             
                            </template> 
                        </b-table>
                    </div>
                </div>	
                <b-row>
                    <div class="col-md-12  text-right">
                       合计： {{(needList[0] && needList[0].actualSalesPrice) ? parseFloat(needList[0].actualSalesPrice).toFixed(2) : '0.00'}}元
                    </div>
                </b-row>			
			 </div>
			<div slot="footer" class="dialog-footer dialog-footer-cla">         				
				<b-btn size="sm" class="float-right" variant="success" @click="addModelAdd">确定</b-btn>
				<b-btn size="sm" class="float-right mr-2" variant="seconday" @click="cancelModal2">取消</b-btn>
			</div>
		</el-dialog>
    </div>
</template>
<script>
import Vue from "vue"
import suitScope from 'components/iris-suitscope'
import {mapState, mapMutations, mapGetters} from 'vuex'
import { Message, Input,Dialog, MessageBox} from "element-ui"
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'


Vue.use(Input)
Vue.use(Dialog)

export default {
    components: {
    },
    props: {
        orderNo: {
            type: String,
            default: function() {
                return ''    // OR201806132002798
            }
        },
        detailCode: {
            type: String,
            default: function() {
                return ''
            }
        },
        skuItem: {
            type: Object,
            default: function() {
                return {
                    orderNo: '11',
                };
            }
        },
        channelTypeCode: {
            type: String,
            default: function() {
                return ''
            }
        },
        storeCode: {
            type: String,
            default: function() {
                return ''
            }
        },
        skuInfo: {
                type: Object,
                default: function() {
                    return {
                        orderNo: '11',
                    };
                }
            },
        carInfo: {
                type: Object,
                default: function() {
                    return {
                        orderNo: '11',
                    };
                }
            },
    },
    data() {
        return {   
            dialogPay:false,
            whCode: '',
            searchList: [],
            searchFields: {
                skuCode: {
                    label: '商品编码'
                },
                skuName: {
                    label: '商品名称'
                },
                originalCode: {
                    label: '原厂编码'
                },
                brandName: {
                    label: '品牌'
                },
                skuModel: {
                    label: '型号'
                },
                skuStandards: {
                    label: '规格'
                },
                skuPrice: {
                    label: '标准销售单价/门市单价（元）'
                },
                availableNums: {
                    label: '可用数量'
                },
                checkUnitName: {
                    label: '单位'
                },
                actualSalesPrice: {
                    label: '优选推荐'
                },
                selectSku: {
                    label: '选择'
                },
            },    
            needList: [],
            delNeedList: [],
            fields: {
                skuCode: {
                    label: '商品编码'
                },
                skuName: {
                    label: '商品名称'
                },
                categoryName: {
                    label: '商品分类'
                },
                originalCode: {
                    label: '原厂编码'
                },
                brandName: {
                    label: '品牌'
                },
                skuModel: {
                    label: '型号'
                },
                skuStandards: {
                    label: '规格'
                },
                nums: {
                    label: '需求数量'
                },
                checkUnitName: {
                    label: '单位'
                },
                whName: {
                    label: '仓库'
                },
                availableNums: {
                    label: '可用数量'
                },
                skuPrice: {
                    label: '标准销售单价/门市单价（元）'
                },
                actualSalesPrice: {
                    label: '销售价格'
                },
                stockUpStatus: {
                    label: '备货状态'
                },
                operation: {
                    label: '操作'
                },
            },
            userInfo: {},
            modelListObj: {
                skuCode: '',
                skuName: '',
                categoryName: '',
                originalCode: '',
                skuName: '',
                skuModel: '',
                skuStandards: '',
                nums: '',
                checkUnitName: '',
                whName: '',
                availableNums: '',
                skuPrice: '',
                salePrice: '',
            }
        }
    },
    computed: {
       ...mapGetters('workOrder', [
            'priceTypes',
            'storeInfo',
            'openServiceInfo',
            'whList',
        ])
    },
    created() {
       
    },
    methods: {
        // 获取工单精品sku信息
        getOrderSkuInfo() {
            let param = {
                orderNo: this.orderNo,
                skuOrderType: '1',
                skuGroupCode: this.skuItem.skuGroupCode,
                skuOrderNo: this.detailCode,
                isDeleted: 0,
            }
            let _this = this;	
            return new Promise((resolve, reject) => {
                api.repairOrder.getSkuOrderInfo(param, res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        resolve(obj);
                    }
                });  
            })   
        },
        // 获取sku列表
        getSelectSkuList() {
            let param = {
                detailCode: this.skuInfo.skuCode,
                detailType: '1',
                whCode: this.whCode,
                storeCode: this.storeCode,
                channelTypeCode: this.channelTypeCode,
                pageNums: 100,
                pageStart: 1,
            }
            let _this = this;	
            return new Promise((resolve, reject) => {
                api.repairOrder.queryServiceSkuList(param,res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        resolve(obj);
                    }
                });  
            })   
        },
        // 获取sku可用库存
        getSkuWhNums(val) {
            let param = {
                whCode: this.whCode,
                skuCodeSet: [val]
            }
            let _this = this;	
            return new Promise((resolve, reject) => {
                api.allotout.queryStockInfoVosByCodeAndSku(param, res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        resolve(obj);
                    }
                });  
            })   
        },
        showModel() {     
            this.needList = [];
            if(!this.storeCode) {
                Message({
                    message: '该用户无门店信息，请更换账号!',
                    type: 'warning'
                });             
                this.dialogPay = false;
                return;
            }                   
            this.$nextTick(() => {
                if(this.whList.length != 0) {
                    this.whCode = this.whList[0].value;
                } 
                this.getSelectSkuList().then(res => {
                    if(res.result.length == 0) {
                        Message({
                            message: '该SKU无价格信息!',
                            type: 'warning'
                        }); 
                        this.dialogPay = false;
                        return;
                    }
                    this.searchList = res.result;
                    this.dialogPay = true;
                    if(this.skuItem.skuGroupCode) {
                        this.getOrderSkuInfo().then(res => {
                            let resObj = res[0];
                            if(resObj.skuOrderDetailInfoVos.length != 0) {
                                let obj = Object.assign({}, resObj.skuOrderDetailInfoVos[0])
                                obj.skuStandards = obj.skuStandards;
                                obj.checkUnitName = obj.unitName;
                                obj.whName = obj.whName;
                                obj.availableNums = obj.availableNums;
                                obj.skuPrice = obj.originalSalesPrice;
                                obj.skuGroupCode = obj.skuGroupCode;
                                obj.stockUpStatus = obj.detailStatus == '0' ? '0':'1';
                                this.needList = [obj];
                            }else {
                                let obj = Object.assign({}, this.modelListObj)
                                obj.skuName = this.skuInfo.skuName;
                                this.needList = [obj];
                            }
                            
                        })
                    }else {
                        let obj = Object.assign({}, this.modelListObj)
                        obj.skuName = this.skuInfo.skuName;
                        this.needList = [obj];
                    }   
                        
                })                  
            })
            
        },
        addModelAdd() {
            if(!this.needList[0].skuCode) {
                Message({
                    message: '请选择精品商品!',
                    type: 'warning'
                });
                return;
            }
            if((!this.needList[0].nums) || parseFloat(this.needList[0].nums) <= 0) {
                Message({
                    message: '需求数量不可小于等于0!',
                    type: 'warning'
                });
                return;
            }
            let paramObj = {
                orderNo: this.orderNo,
                skuCode: this.needList[0].skuCode,
                brandCode: this.needList[0].brandCode,
                categoryCode: this.needList[0].categoryCode,
                storeCode: this.storeCode,
                whCode: this.needList[0].whCode,
                nums: this.needList[0].nums,
                originalSalesPrice: this.needList[0].skuPrice,
                actualSalesPrice: this.needList[0].actualSalesPrice,
                relationCodes: this.needList[0].relationCodes,
            }
            if(this.needList[0].skuGroupCode) {
                paramObj.skuGroupCode = this.needList[0].skuGroupCode;
            }
            if(!paramObj.whCode) {
                paramObj.whCode = this.whCode;
            }
            if(this.detailCode) {
                paramObj.skuOrderNo = this.detailCode;
            }
            let param = {
                orderSkuDetailInfos: [paramObj],
            }
            api.repairOrder.insertOrUpdateOrderInfo(param, res => {
                if (res.data.code === "success") {
                    Message({
                        message: '保存成功!',
                        type: 'success'
                    });
                    this.$emit('sure');
                    this.dialogPay = false;                
                }
            })
            
           
        },
        cancelModal2() {
            this.dialogPay = false;
        },
        selectSku(val) {
            if(this.needList.length != 0) {           
                if(!this.needList[0].id) {
                    let obj = Object.assign({}, val);
                    delete obj.id;
                    this.getSkuWhNums(val.skuCode).then(res => {
                        obj.availableNums = res[this.whCode].availableNums?res[this.whCode].availableNums: 0;
                        this.needList = [obj];
                    })               
                }else {
                    Message({
                        message: '数据已存在，只可作废!',
                        type: 'warning'
                    });
                }              
            }
        },
        stockUp(val) {
            api.repairOrder.editOrderSkuInfoList([val], res => {
                if (res.data.code === "success") {
                    if(res.data.obj.length != 0) {
                        if(res.data.obj[0].detailStatus != '0') {
                            Message({
                                message: '备货成功!',
                                type: 'success'
                            });  
                            this.showModel();
                        }else {
                            Message({
                                message: '备货失败!',
                                type: 'error'
                            }); 
                        }
                    }
                             
                }
            })
        },
        delSku(val) {
            MessageBox.confirm('确定删除吗?', '提示', {
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
            }).then(() => {				  
                if(val.id != undefined){
                    let param = {
                        orderSkuDetailInfos:[{
                            skuGroupCode: val.skuGroupCode,
                            clearFlag: true,
                        }]
                    }
                    api.repairOrder.toVoidOrderInfo(param, res => {
                        if (res.data.code === "success") {
                            this.needList = [{skuName: val.skuName}];
                        }
                    });    
                   
                }else {
                   let obj = Object.assign({}, this.modelListObj)
                    obj.skuName = this.skuInfo.skuName;
                    this.needList = [obj];
                }
                
            }).catch(() => {
            });
        },
        inputNums(val) {
            this.needList[0].nums = val ? val : 0;
            this.needList[0].actualSalesPrice = (this.needList[0].skuPrice ? parseFloat(this.needList[0].skuPrice) : 0) * this.needList[0].nums;
            this.needList[0].stockUpStatus = parseFloat(this.needList[0].availableNums) - parseFloat(this.needList[0].nums) >=0 ? '1' : '0';
            this.needList = JSON.parse(JSON.stringify(this.needList))
        },
        whChange() {
            this.getSelectSkuList().then(res => {
                   this.searchList = res.result;
           }) 
        }
    },
    watch:{ 
       dialogPay(val) {
          this.$emit('visibleChange', val);
        }
    }
}
</script>

<style scoped>
@media  screen and (max-height: 800px)  {
    .dialog-cont-h{
         max-height: 310px !important;
        overflow-y: auto!important;
    }
}
@media  screen and (min-height: 800px)  {
    .dialog-cont-h{
         max-height: 610px !important;
        overflow-y: auto!important;
    }
}
</style>
