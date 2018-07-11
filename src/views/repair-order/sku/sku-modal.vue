<template>
    <div class="animated fadeIn">
         <el-dialog size="large" title="添加服务"  :visible.sync="dialogPay" :modal-append-to-body="false" ref="modal2">
			 <div class="container-fluid">
				 <b-row>
					<div class="col-md-4 pt-3">
                        <span class="mt-3 mb-3">
                            订单号: {{ordrNo}}
                        </span>
                    </div>
                    <div class="col-md-4 pt-3">
                        <span class="mt-3 mb-3">
                            车牌: {{carInfo.ordrNo}}
                        </span>
                    </div>
                    <div class="col-md-4 pt-3">
                         <span class="mt-3 mb-3">
                            车型: {{carInfo.ordrNo}}
                        </span>
                    </div>
                    <div class="col-md-4 pt-3">
                        <span class="mt-3 mb-3">
                            商品编码: {{carInfo.skuCode}}
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
                             <b-form-select :options="whList" size="sm" v-model="whCode"></b-form-select>
                        </div>
                    </b-row>
                    <div class="table-scrollable mb-2 service-manhour">
                        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="searchList" :fields="searchFields">                           
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
                            <template slot="requireNums" slot-scope="data">
                                <b-form-input @input="inputNums" v-model="data.value"/>                      
                            </template> 
                            <template slot="stockUpStatus" slot-scope="data">
                               <span v-if="data.value === '1'" class="text-success">充足</span>                      
                               <span v-if="data.value === '0'" class="text-danger">缺货</span>                      
                            </template> 
                            <template slot="operation" slot-scope="data">
                                <div style="width: 130px;">
                                    <b-button size="sm" variant="primary" class="pull-left" @click="stockUp">备货</b-button>
                                    <b-button size="sm" variant="danger" class="pull-left ml-3" @click="delSku">清空</b-button>
                                </div>                             
                            </template> 
                        </b-table>
                    </div>
                </div>				
			 </div>
			<div slot="modal-footer" class="w-100">         				
				<b-btn size="sm" class="float-right" variant="success" @click="addModelAdd">确定</b-btn>
				<b-btn size="sm" class="float-right mr-2" variant="seconday" @click="cancelModal2">取消</b-btn>
			</div>
		</el-dialog>
    </div>
</template>
<script>
import Vue from "vue"
import suitScope from 'components/iris-suitscope'
import { Message, Input } from "element-ui"
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'


Vue.use(Input)

export default {
    components: {
    },
    props: {
        ordrNo: {
            type: String,
            default: function() {
                return ''
            }
        },
        detailCode: {
            type: String,
            default: function() {
                return ''
            }
        },
        skuInfo: {
                type: Object,
                default: function() {
                    return {
                        ordrNo: '11',
                    };
                }
            },
        carInfo: {
                type: Object,
                default: function() {
                    return {
                        ordrNo: '11',
                    };
                }
            },
    },
    data() {
        return {   
            dialogPay:false,
            whList: [
                {text: '11', value: '11'},
                {text: '22', value: '22'},
            ],
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
                standardPrice: {
                    label: '标准销售单价'
                },
                availableNums: {
                    label: '可用数量'
                },
                checkUnitName: {
                    label: '单位'
                },
                salePrice: {
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
                skuClass: {
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
                requireNums: {
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
                standardPrice: {
                    label: '标准销售单价'
                },
                salePrice: {
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
            storeInfoVo: {},
            storeCode: '',
        }
    },
    computed: {
       
    },
    created() {
        this.getStoreInfoVo();
    },
    methods: {
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
           if(this.storeInfoVo) {
               this.storeCode =  this.storeInfoVo.storeCode;
           }
        },
        // 获取门店仓库
        getWhlist() {
            let params = {
                storeCode: this.storeCode
            }
            api.warehouse.query(params).then(res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    let arr = [];
                    obj.list.forEach((item, index) => {
                        let obj = {
                            value: item.warehouseCode,
                            text: item.warehouseName
                        }
                        arr.push(obj);
                    })
                    this.whList = [...arr];
                }
            });           
        },
        // 获取工单精品sku信息
        getOrderSkuInfo() {
            let param = {
                code: '',
            }
            let _this = this;	
            return new Promise((resolve, reject) => {
                api.warehouse.query(params).then(res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        resolve(obj);
                    }
                });  
            })   
        },
        showModel() {          
           this.dialogPay = true;
        },
        addModelAdd() {
            if((!this.needList[0].requireNums) || parseFloat(this.needList[0].requireNums) <= 0) {
                 Message({
                    message: '需求数量不可小于等于0!',
                    type: 'warning'
                });
            }else {
                this.$emit('sure', this.needList);
                this.dialogPay = false;
            }
           
        },
        cancelModal2() {
            this.dialogPay = false;
        },
        selectSku(val) {
            if(this.needList.length == 0) {
                this.needList.push(val);
                
            }else {
                 Message({
                    message: '已存在SKU信息，请先清空!',
                    type: 'warning'
                });
            }
        },
        stockUp(val) {

        },
        delSku(val) {
            MessageBox.confirm('确定删除吗?', '提示', {
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
            }).then(() => {				  
                if(val.id != undefined){
                    for(let [i, item] of this.needList.entries()) {
                        val.isDeleted = '1';
                        this.delNeedList.push(val)
                    };
                    for(let [i, item] of this.needList.entries()) {
                        if(item.id == val.id) {
                            this.needList.splice(i, 1);
                            break;
                        }
                    };
                }else {
                    for(let [i, item] of this.needList.entries()) {
                        if(item.skuCode == val.skuCode) {
                            this.needList.splice(i, 1);
                            break;
                        }
                    };
                }
                
            }).catch(() => {
            });
        },
        inputNums(val) {
            this.needList[0].requireNums = val;
            this.needList[0].stockUpStatus = parseFloat(this.needList[0].availableNums) - parseFloat(this.needList[0].requireNums) >=0 ? '1' : '0';
            this.needList = JSON.parse(JSON.stringify(this.needList))
        }
    },
    watch:{
       whCode(val) {
           this.searchList = [{skuName: '111',requireNums: 1, stockUpStatus:10},{skuName: '222',requireNums: 2, stockUpStatus:10}]
       },
       storeCode(val){
           if(val) {
               this.getWhlist();
           }
       },
       detailCode(val) {
           if(val) {
               this.getOrderSkuInfo().then(res => {
                   this.needList = res;
               })
           }
       }
    }
}
</script>

<style scoped>

</style>
