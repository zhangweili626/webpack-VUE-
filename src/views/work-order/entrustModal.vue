<template>
    <div class="animated fadeIn">
         <el-dialog size="large" title="添加托外"  :visible.sync="dialogPay" :modal="false" ref="modal2">
			 <div class="container-fluid">
				 <b-row>
					<div class="col-md-4 pb-3">
                        <span class="mb-3 mb-3">
                            订单号: {{ordrNo}}
                        </span>
                    </div>
				</b-row>	
                <b-row>
					<div class="col-md-6">
                        <table style="width: 100%;">
                            <tr>
                                <td>
                                    <h4>{{carInfo.plateNumber}}66</h4>
                                </td>
                                <td>车主手机号</td>
                                <td>客户姓名</td>
                            </tr>
                            <tr>
                                <td>{{carInfo.displayName}}</td>
                                <td>{{carInfo.mobilePhone}}</td>
                                <td>{{carInfo.customName}}</td>
                            </tr>
                        </table>
                        <table class="table b-table table-striped table-hover table-bordered">
                            <tr>
                                <td>类型</td>
                                <td>{{priceType | priceTypeName}}</td>
                                <td>服务显示名称</td>
                            </tr>
                            <tr>
                                <td>服务名称</td>
                                <td>{{'【'+ serviceAllInfo.categoryCode + '】' + serviceAllInfo.categoryName}}</td>
                                <td rowspan="2">
                                    <input type="text" class="form-control" v-model.trim="serviceShowName">
                                </td>
                            </tr>
                            <tr>
                                <td>分类</td>
                                <td>
                                    <service-tree   @getValue="getServiceClass" ref="serviveSelect"></service-tree>
                                </td>
                            </tr>
                        </table>
                        <table class="table b-table table-striped table-hover table-bordered">
                            <tr>
                                <td>标准工时</td>
                                <td>工时单价</td>
                                <td>标准售价/门市价</td>
                                <td>预计耗时</td>
                            </tr>
                            <tr>
                                <td>
                                    <span  v-if="priceType == '2'">{{serviceAllInfo.workHours}}</span>
                                    <input v-else type="number" class="form-control" v-model="serviceAllInfo.workHours" min=0 @input="getInput">
                                </td>
                                <td>
                                    <span>{{parseFloat(serviceAllInfo.labourHourUnitPrice).toFixed(2)}}</span>
                                </td>
                                <td>
                                    <span v-if="priceType == '2'">{{parseFloat(serviceAllInfo.labourCost).toFixed(2)}}</span>
                                     <input v-else type="number" class="form-control" v-model="serviceAllInfo.labourCost" min=0>
                                </td>
                                <td>
                                    <span v-if="priceType == '2'">{{serviceAllInfo.expectedToTake}}</span>
                                    <input  v-else  v-model="serviceAllInfo.expectedToTake" type="number" class="form-control" min=0 style="display:inline-block!important; width: 72%!important;">分钟
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-6">
                        <b-row>
                            <div class="col-md-5">
                                <b-form-fieldset horizontal label="委托外包类型" :label-cols="4" class="text-right">
                                <b-form-select :options="whList" v-model="whCode" @input="searchParamChange"></b-form-select>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-7">
                                <b-form-fieldset horizontal label="委托单位" :label-cols="4" class="text-right">
                                <b-form-select :options="whList" v-model="whCode" @input="searchParamChange"></b-form-select>
                                </b-form-fieldset>
                            </div>
                        </b-row>
                        <b-row>
                            <div class="col-md-12 clearfix">
                                 <textarea v-model="entrustExplian" class="form-control remark-textarea" placeholder="委托外包说明" id="data.item.index" @input="checkStrLength(entrustExplian, 'entrustExplian')">
                                </textarea>
                                <span class="hint-text-leng">{{entrustExplian.length}} / 120</span>
                                <b-row class="remark-footer">                                  
                                    <b-button size="sm">
                                            <i class="el-icon-close"></i>
                                    </b-button>   
                                     &nbsp;
                                    <b-button size="sm" variant="success">
                                            <i class="el-icon-check"></i>
                                    </b-button>                                                                          
                                </b-row>
                            </div>
                            <div class="col-md-12 clearfix">
                                 <textarea v-model="entrustRemark" class="form-control remark-textarea" placeholder="委托外包备注" id="data.item.index" @input="checkStrLength(entrustRemark, 'entrustRemark')">
                                </textarea>
                                <span class="hint-text-leng">{{entrustExplian.length}} / 120</span>
                                <b-row class="remark-footer">
                                    <b-button size="sm">
                                            <i class="el-icon-close"></i>
                                    </b-button>   
                                     &nbsp;
                                    <b-button size="sm" variant="success">
                                            <i class="el-icon-check"></i>
                                    </b-button> 
                                </b-row>
                            </div>
                        </b-row>
                    </div>
				</b-row>	
                <b-row class="mb-0 ml-2">
                     <b-form-group v-show="priceType != '0'">
                        <b-form-checkbox-group id="checkboxes2" class="mt-1" v-model="isNeedParts">
                            <b-form-checkbox value="1">需要进入工位看板跟踪进度</b-form-checkbox> 
                        </b-form-checkbox-group>
                    </b-form-group>
                    <b-form-group v-show="priceType != '0'">
                        <b-form-checkbox-group id="checkboxes2" class="mt-1" v-model="isNeedParts">
                            <b-form-checkbox value="1">不需要配件</b-form-checkbox> 
                        </b-form-checkbox-group>
                    </b-form-group>
                </b-row>
                <div class="" v-show="!(serviceSkuClassList.length == '0' && priceType != '1')">
                    <b-row class="text-left">
                        <div class="col-md-12 form-inline ">
                            <h5 class="text-primary mr-3">商品信息</h5>
                           
                        </div>
                    </b-row>
                    <b-row class="mt-2"  v-show="isNeedParts != '1'">
                        <div class="col-md-3">
                             <b-form-select :options="skuOrginList"  v-model="skuOrgin"></b-form-select>
                        </div>
                        <div class="col-md-3" v-show="skuOrgin == '0'">
                             <b-form-select :options="whList"  v-model="whCode" @input="searchParamChange"></b-form-select>
                        </div>
                        <div class="col-md-3" v-show="skuOrgin == '0'">
                             <sku-class-tree  @getSkuClass="getSkuClass" ref="skuSelect"></sku-class-tree>
                        </div>
                        <div class="col-md-3" v-show="skuOrgin == '0'">
                             <input class="form-control"  v-model="tempParameter" placeholder="模糊查询" @input="searchParamChange"/>
                        </div>
                    </b-row>
                    <div class="table-scrollable mb-2 service-manhour" v-show="isNeedParts != '1' && skuOrgin == '0'">
                        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="searchList" :fields="searchFields">                           
                            <template slot="skuPrice" slot-scope="data">
                               {{parseFloat(data.value).toFixed(2)}}
                            </template>
                            <template slot="selectSku" slot-scope="data">
                                <b-button size="sm" variant="primary" @click="selectSku(data.item)">选择</b-button>
                            </template> 
                        </b-table>
                    </div>
                    <div class="row"  v-show="isNeedParts != '1' && skuOrgin == '0'"> 
                        <div class="col-md-12">
                            <pagination class="pull-right" 
                            @page-change="search" 
                            :page-no="paginationData.pageNo" 
                            :page-size="paginationData.pageSize" 
                            :total-pages="paginationData.totalPages" 
                            :total-result="paginationData.total">
                            </pagination>
                        </div>
                    </div>
                </div>				 
				<div class="mt-3 pt-3"  v-show="isNeedParts != '1' && !(serviceSkuClassList.length == '0' && priceType != '1')">
                     <b-row class="text-left">
                        <div class="col-md-12  text-primary">
                            <h5>需求信息</h5>
                        </div>
                    </b-row>
                    <b-row class="text-left pl-3" v-show="skuOrgin == '1'">
                        <b-button size="sm" variant="success" @click="addTempNeedSku">添加</b-button>                                
                    </b-row>
                    <div class="table-scrollable mb-2 service-manhour">
                        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="needList" :fields="fields">
                            <template slot="skuName" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" v-model.trim="data.value"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="originalCode" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" v-model.trim="data.value"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="brandName" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" v-model.trim="data.value"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="skuModel" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id"  v-model.trim="data.value"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="skuStandards" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id"  v-model.trim="data.value"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="nums" slot-scope="data">
                                <b-form-input v-if="!data.item.fixedNums" @input="inputNums(data.value, data.index)" type="number" v-model="data.value"/>   
                                <span v-else>{{data.value ? parseFloat(data.value): ''}}</span>                   
                            </template> 
                            <template slot="checkUnitName" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id"  v-model.trim="data.value"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="skuPrice" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" type="number" v-model.trim="data.value"/>   
                                <span v-else> {{data.value ? parseFloat(data.value).toFixed(2): ''}}</span>   
                            </template>
                            <template slot="actualSalesPrice" slot-scope="data">
                               {{data.value ? parseFloat(data.value).toFixed(2): ''}}
                            </template>
                            <template slot="stockUpStatus" slot-scope="data" style="background: red;">
                               <span v-if="data.value === '1'" class="text-success">充足</span>                      
                               <span v-if="data.value === '0'" class="text-danger">缺货</span>                      
                            </template> 
                            <template slot="operation" slot-scope="data">
                                <div style="width: 130px;">
                                    <b-button size="sm" variant="primary" class="pull-left" @click="stockUp(data.item)" v-if="data.item.id && data.item.stockUpStatus == '0'">备货</b-button>
                                    <b-button size="sm" variant="danger" class="pull-left ml-3" @click="delSku(data.item)">清空</b-button>
                                </div>                             
                            </template> 
                        </b-table>
                    </div>
                </div>	
                <b-row>
                     <div class="col-md-4">
                       合计： {{totalPrice}}元
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
import { Message, Dialog, MessageBox, Input } from "element-ui"
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'
import Pagination from 'components/pagination/pagination'
import skuClassTree from '../purchase-return/skuClassTree'
import serviceTree from './serviceTree'
import {SKU_TEMPCODE_SEQ} from 'common/sequence.js'
Vue.use(Dialog);

Vue.use(Input)

export default {
    components: {
        Pagination,
        skuClassTree,
        serviceTree,
    },
    props: {
        ordrNo: {
            type: String,
            default: function() {
                return '2222'
            }
        },
        serviceDetail: {
            type: String,
            default: function() {
                return ''
            }
        },
        channelTypeCode: {
            type: String,
            default: function() {
                return ''
            }
        },
        serviceInfo: {
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
            entrustExplian: '',
            entrustRemark: '',
            carAddInfo: [],
            serviceShowName: '',
            serviceClassCode: '',
            paginationData: {
                total: 10,
                totalPages: 1,
                pageNo: 1,
                pageSize: 5
            },
            dialogPay: false,
            whList: [
                {text: '11', value: '11'},
                {text: '22', value: '22'},
            ],
            serviceAllInfo: {},
            carAddInfoList: [],
            whCode: '',
            // 售价类型
            priceType: '1',
            serviceSkuClassList: [],
            serviceSkuClass: '',
            skuOrginList: [
                {
                    text: '自店库存件',
                    value: '0'
                },
                {
                    text: '临时采购件',
                    value: '1'
                },
            ],
            skuOrgin: '0',
            skuClass: '',
            tempParameter: '',
            // 服务类型
            serviceType: '0',
            totalPrice: 0,
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
                    label: '标准销售单价'
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
            modelNeedList: [],
            skuListArr: [],
            brandListArr: [],
            classListArr: [],
            needList: [],
            delNeedList: [],
            // 是否需要配件
            isNeedParts: false,
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
                    label: '标准销售单价'
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
            tempSku: {
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
                actualSalesPrice: '',
                temporary: '1',
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
        // 生成车型附加信息refcode
        createCarAddCode(num) {
            const option = {
                'serviceCode': config.skuCar.skuCarAddCode,
                'getNums': num ? num : 1
            }
            return new Promise((reslove,reject) => {
                api.ordinalInfo.getSequenceList(option, (res) => {
                    if(res.data.code === 'success') {							
                        reslove(res.data.obj)
                    };
                })
            })				
        },
        // 生成临时sku编码
        createSkuTempcodeCode() {
            const option = {
                'serviceCode': SKU_TEMPCODE_SEQ
            }
            return new Promise((reslove,reject) => {
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {
                        reslove(res.data.obj)
                    };
                })
            })				
        },
        // 生成临时sku编码
        getCarAddSelList() {
            const option = {
                carCode: 'CAR2000026',
                addCode: 'MainModelAdd0'
            }
            return new Promise((reslove,reject) => {
                api.repairOrder.queryCarAddInfos(option, (res) => {
                    if(res.data.code === 'success') {
                        reslove(res.data.obj)
                    };
                })
            })				
        },
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
        // 获取车型附加信息
        getCarAddInfo() {
            let params = {
                    plateNumber: this.carInfo.plateNumber
                }
                return new Promise((resolve, reject) => {
                    api.mancar.queryCustomInfoByMobilePhone(params).then(res => {
                    if(res.data.code === 'success') {
                        let obj = res.data.obj
                        if(obj) {
                            this.carAddInfo = obj.customVehicleInfoVos[0].customVehicleAddInfoVos;
                            resolve(this.carAddInfo);
                        }
                    }
                })
            })        
        },
        // 获取服务信息
        getServiceInfo() {
            let param = {
                "serviceCode":"S000455",
                "storeCode":"STORE2000905",
                "vehicleCode":"CV20180611000442"
            }
            return new Promise((resolve, reject) => {
                api.repairOrder.queryServicePriceALL(param,res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        resolve(obj);
                    }
                });  
            })        
        },
        // 获取车辆附加信息选项
        getCarAddList(val) {
            let params = {
                storeCode: this.storeCode
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
        // 获取服务商品分类信息
        getServiceSkulist() {
            let params = {
                storeCode: this.storeCode
            }
            api.warehouse.query(params).then(res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    let arr = [];
                    let skuArr = [];
                    obj.list.forEach((item, index) => {
                        let obj = {
                            value: item.warehouseCode,
                            text: item.warehouseName
                        }
                        arr.push(obj);
                        let obj2 = {
                            nums: i,
                        }
                        skuArr.push(obj2);
                    })
                    this.needList = skuArr;
                }
            });           
        },
        // 获取sku列表
        getSelectSkuList(val) {
            let param = {};
            if(this.priceType != '3') {
                if(this.serviceSkuClass == '') {
                    Message({
                        message: '该服务商品分类信息为空!',
                        type: 'warning'
                    });  
                    return;           
                }
                
                let objClass = JSON.parse(this.serviceSkuClass);
                param = {
                    storeCode: this.storeCode,
                    detailCode: objClass.detailCode,
                    detailType: objClass.detailType,
                    whCode: this.whCode,
                    channelTypeCode: this.channelTypeCode,
                    pageNums: 5,
                    pageStart: val ? val : 1,
                }
            }else {
                param = {
                    storeCode: this.storeCode,
                    tempParameter: this.tempParameter,
                    detailCode: this.skuClass ? this.skuClass : '000001',
                    detailType: '3',
                    whCode: this.whCode,
                    channelTypeCode: this.channelTypeCode,
                    pageNums: 5,
                    pageStart: val ? val : 1,
                }
            }
            
            return new Promise((resolve, reject) => {
                api.repairOrder.queryServiceSkuList(param,res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        resolve(obj);
                    }
                });  
            })   
        },
        // 获取以保存工单服务详情
        getOrderServiceInfo() {
            return new Promise((resolve, reject) => {
                // api.repairOrder.queryServiceSkuList(param,res => {
                //     if (res.data.code === "success") {
                //         let obj = res.data.obj;
                //         resolve(obj);
                //     }
                // });  
            })  
        },
        showModel() {    
            let _this = this;
            this.paginationData.total = 0;
            this.paginationData.totalPages = 1;
            this.paginationData.pageNo = 1;
            if((!this.storeInfoVo) || !this.storeCode) {
                Message({
                    message: '该用户无门店信息，请更换账号!',
                    type: 'warning'
                });             
                this.dialogPay = false;
                return;
            }     
            if(this.whList.length != 0) {
                this.whCode = this.whList[0].value;
            } 
            this.$nextTick( () => {
                _this.getServiceInfo().then(res => {
                        if(res.serviceSkuRelationInfos.length != 0) {
                            let arr = [];
                            let modelArr = [];
                            res.serviceSkuRelationInfos.forEach((item, index) => {
                                item.index = index;
                                let obj = {
                                    value: JSON.stringify(item),
                                    text: item.detailName,
                                }
                                arr.push(obj);
                                let modelObj = {};
                                modelObj.skuCode = '';
                                modelObj.detailType = item.detailType;
                                modelObj.detailCode = item.detailCode;
                                modelObj.detailName = item.detailName;
                                modelObj.whName = '';
                                modelObj.availableNums = '';
                                modelObj.temporary = '0';
                                modelObj.index = index;
                                if(item.needQty && parseFloat(item.needQty) > 0) {
                                    modelObj.nums = item.needQty;
                                    modelObj.fixedNums = true;
                                    modelObj._cellVariants = { nums: 'primary' };
                                }else{
                                    modelObj.fixedNums = false;
                                }
                                if(item.detailType == '1') {
                                    modelObj.skuName = item.detailName;
                                    let tempObj = Object.assign({}, modelObj);
                                    this.skuListArr.push(tempObj);
                                }else if(item.detailType == '2') {
                                    modelObj.brandName = item.detailName;
                                    let tempObj = Object.assign({}, modelObj);
                                    this.brandListArr.push(tempObj);
                                }else if(item.detailType == '3') {
                                    modelObj.categoryName = item.detailName;
                                    let tempObj = Object.assign({}, modelObj);
                                    this.classListArr.push(tempObj);
                                }
                            
                                modelArr.push(modelObj);
                            })
                            this.serviceSkuClassList = arr;
                            this.modelNeedList = modelArr;
                            this.serviceSkuClass = arr[0].value;
                        }
                        this.serviceAllInfo = Object.assign({}, res);
                        // this.priceType = res.priceType;
                        this.priceType = 3;

                        this.countTotalPtice();
                        this.search();
                        if(this.serviceDetail) {
                            this.needList = JSON.parse(JSON.stringify(this.modelNeedList));
                            this.getOrderServiceInfo().then(res => {
                                this.setNeedList(res);
                            })
                        }else {
                            if(this.priceType != '3') {
                                this.needList = JSON.parse(JSON.stringify(this.modelNeedList));
                            }else {
                                this.needList = [];
                            }
                        
                        }
                        _this.dialogPay = true;
                    })
                
            })
           
        },
        addModelAdd() {
            this.$emit('sure', this.selModelAdd);
            this.dialogPay = false;
        },
        cancelModal2() {
            this.dialogPay = false;
        },
        getSkuClass(val){          
            this.skuClass = val.categoryCode;
            this.searchParamChange();
        },
        getServiceClass(val) {
           this.serviceClassCode = val;
        },
        selectSku(val) {
            let getObj = Object.assign({}, val);
            delete getObj.id;
            let skuClassObj = JSON.parse(this.serviceSkuClass);
            this.needList.forEach((item, index) =>{
                if(item.skuCode == getObj.skuCode){
                    Message({
                        message: '已存在SKU信息，请先清空!',
                        type: 'warning'
                    });
                    return;
                }
            })
            this.getSkuWhNums(getObj.skuCode).then(res => {
                getObj.availableNums = res[this.whCode].availableNums? res[this.whCode].availableNums: 0;
                if(this.priceType != '3') {               
                    getObj.temporary = '0';
                    this.needList[skuClassObj.index] = Object.assign(this.needList[skuClassObj.index], getObj);
                    if(this.needList[skuClassObj.index].fixedNums) {
                        this.needList[skuClassObj.index].actualSalesPrice = (this.needList[skuClassObj.index].skuPrice ? parseFloat(this.needList[skuClassObj.index].skuPrice) : 0) * this.needList[skuClassObj.index].nums;
                        this.needList[skuClassObj.index].stockUpStatus = parseFloat(this.needList[skuClassObj.index].availableNums) - parseFloat(this.needList[skuClassObj.index].nums) >=0 ? '1' : '0';
                    }
                }else {
                    getObj.temporary = this.skuOrgin;
                    this.needList.push(getObj);
                }
                
                
                // this.needList[skuClassObj.index]._cellVariants.stockUpStatus = this.needList[skuClassObj.index].stockUpStatus == '0' ? 'danger' : 'success'
                this.countTotalPtice();
                this.needList = JSON.parse(JSON.stringify(this.needList));
                
            })  
            
        },
        addTempNeedSku() {           
            let obj = Object.assign({}, this.tempSku);
            this.createSkuTempcodeCode().then(res => {
                obj.skuCode = res;
                obj.skuTempCode = res;
                obj.temporary = '1';
                this.needList.push(obj);
                this.needList = JSON.parse(JSON.stringify(this.needList))
            })
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
                if(this.priceType != '3'){
                    if(val.id != undefined){
                    //    api.repairOrder.deleteSkuOrderDetailByCondition(param, res => {
                    //          if (res.data.code === "success") {
                    //              for(let [i, item] of this.needList.entries()) {
                    //                     if(item.skuCode == val.skuCode) {                          
                    //                         this.needList[i] = this.modelNeedList[i];                      
                    //                         break;
                    //                     }
                    //                 };
                    //         }
                    //     });  
                    }else {
                        for(let [i, item] of this.needList.entries()) {
                            if(item.skuCode == val.skuCode) {                          
                                this.needList[i] = this.modelNeedList[i];                      
                                break;
                            }
                        };
                    }
                }else {
                    if(val.id != undefined){
                    //    api.repairOrder.deleteSkuOrderDetailByCondition(param, res => {
                    //         if (res.data.code === "success") {
                    //             for(let [i, item] of this.needList.entries()) {
                    //                 if(item.skuCode == val.skuCode) {
                    //                     this.needList.splice(i, 1);
                    //                     break;
                    //                 }
                    //             };
                    //         }
                    //     });  
                    }else {
                        for(let [i, item] of this.needList.entries()) {
                            if(item.skuCode == val.skuCode) {
                                this.needList.splice(i, 1);
                                break;
                            }
                        };
                    }
                }
                
                this.needList = JSON.parse(JSON.stringify(this.needList));
                this.countTotalPtice();
            }).catch(() => {
            });
        },
        search(val) {
            this.getSelectSkuList(val).then(result => {
                    this.paginationData.pageNo = result.pageStart,
                    this.paginationData.total = result.total,
                    this.paginationData.totalPages = result.pages
                    this.searchList = result.result;
                });
        },
        countTotalPtice() {
            let price = 0;
            if(this.serviceAllInfo) {
               if(this.serviceAllInfo.priceType == '0') {
                   price += this.serviceAllInfo.labourCost;
               }else if(this.serviceAllInfo.priceType == '1') {
                   let num = 0;
                   if(this.needList.length != 0) {
                       this.needList.forEach(item =>{
                           num += parseFloat(item.actualSalesPrice)?parseFloat(item.actualSalesPrice):0;
                       })
                   }
                   let totalNum = num + (parseFloat(this.serviceAllInfo.labourCost)?parseFloat(this.serviceAllInfo.labourCost):0);
                    price += totalNum

               }
               this.totalPrice = parseFloat(price).toFixed(2);
           }
           
        },
        searchParamChange() {
            let val = 1;
            this.search(val);
        },
        inputNums(val, index) {
            this.needList[index].nums = val ? val : 0;
            this.needList[index].actualSalesPrice = (this.needList[index].skuPrice ? parseFloat(this.needList[index].skuPrice) : 0) * this.needList[index].nums;
            this.needList[index].stockUpStatus = parseFloat(this.needList[index].availableNums) - parseFloat(this.needList[index].nums) >=0 ? '1' : '0';
            // this.needList[index]._cellVariants.stockUpStatus = this.needList[index].stockUpStatus == '0' ? 'danger' : 'success'
            this.needList = JSON.parse(JSON.stringify(this.needList));
            this.countTotalPtice();
        },
        setNeedList(obj) {
            function setNeedListSon(item) {
                obj.forEach((v, i) =>{
                    if(v.skuCode == item.skuCode && (!this.needList[item.index].skuCode)) {
                        let obj = Object.assign({}, v);
                        obj.skuStandards = obj.skuStandards;
                        obj.checkUnitName = obj.unitCode;
                        obj.whName = obj.whName;
                        obj.availableNums = obj.availableNums;
                        obj.skuPrice = obj.originalSalesPrice;
                        obj.temporary = '1';
                        obj.stockUpStatus = obj.detailStatus == '0' ? '0':'1';
                        // this.needList[index]._cellVariants.stockUpStatus = this.needList[index].stockUpStatus == '0' ? 'danger' : 'success'
                        this.needList[item.index] = obj;
                    }
                })
            };
            if(this.priceType != '3') {
                if(this.skuListArr.length != 0) {
                    this.skuListArr.forEach((item, index) =>{
                        setNeedListSon(item);
                    })              
                };
                if(this.brandListArr.length != 0) {
                    this.brandListArr.forEach((item, index) =>{
                        setNeedListSon(item);
                    })              
                };
                if(this.classListArr.length != 0) {
                    this.classListArr.forEach((item, index) =>{
                        setNeedListSon(item);
                    })              
                };
            }else {
                let arr = [];
                obj.forEach((v, i) =>{
                    let obj = Object.assign({}, v);
                    obj.skuStandards = obj.skuStandards;
                    obj.checkUnitName = obj.unitCode;
                    obj.whName = obj.whName;
                    obj.availableNums = obj.availableNums;
                    obj.skuPrice = obj.originalSalesPrice;
                    obj.stockUpStatus = parseFloat(obj.availableNums) - parseFloat(obj.nums) >=0 ? '1' : '0';
                    arr.push(obj);
                })
                this.needList = arr;
            }
            
             this.needList = JSON.parse(JSON.stringify(this.needList));
        },
        eidtCarAdd(obj, value, name) {
            let param = {
                carCode: this.carInfo.carCode,
                vehicleCode: this.carInfo.vehicleCode,
                carDetailCode: '',
            }
            if(value != 'other01') {
                if(obj.addId) {
                    param.carDetailCode = obj.carDetailCode;
                    param.id = obj.addId;
                    param.addCode = obj.carAddCode;
                    param.addValue = value;
                }else {
                    this.createCarAddCode(1).then(res => {
                        param.carDetailCode = res[0];
                        param.addCode = obj.carAddCode;
                        param.addValue = value;
                    });
                    
                }
            }else{
                if(name === undefined || name === '') {
                    // Message({
                    //     message: '车型附加属性不可为空!',
                    //     type: 'warning'
                    // }); 
                    return;
                }
                if(obj.addId) {
                    param.carDetailCode = obj.carDetailCode;
                    param.id = obj.addId;
                    param.addCode = obj.carAddCode;
                    param.addValue = name;
                }else {
                    this.createCarAddCode(1).then(res => {
                        param.carDetailCode = res[0];
                        param.addCode = obj.carAddCode;
                        param.addValue = name;
                    });
                    
                }
            }
            setTimeout(() => {
                api.repairOrder.editCustomVehicleAddInfo([param], res => {
                    if (res.data.code === "success") {
                          Message({
                                message: '修改成功!',
                                type: 'success'
                            });   
                    }
                });  
            }, 200)   
        },
        getInput(){
            console.log(this.serviceAllInfo)
        },
        checkStrLength(val, name) {
            if(val.length > 120) {
                Message({
                    message: '不可超过120字!',
                    type: 'warning'
                });
                this[name] = val.substr(0, 200);
            }
        },
    },
    watch:{
       whCode(val) {

       },
       storeCode(val){
           if(val) {
               this.getWhlist();
           }
       },
       skuOrgin(val) {
          
       },
    },
    filters: {
        priceTypeName(val) {
           if(val == '0') {
               return '固定售价服务';
           }else if(val == '1') {
               return '非固定售价服务';
           }else if(val == '2') {
               return '非固定售价服务';
           }
       },
    },
}
</script>

<style scoped>
.car-add-box{
    width: 100%;
    height: 150px;
    padding: 6px;
    border: 1px solid #c2cfd6;
    overflow-x: hidden;
    overflow-y: auto;
}
@media  screen and (max-height: 800px)  {
    .dialog-cont-h{
        height: 300px !important;
        overflow-y: auto!important;
    }
}
@media  screen and (min-height: 800px)  {
    .dialog-cont-h{
        height: 600px !important;
        overflow-y: auto!important;
    }
}
.remark-textarea{
    width: 100%;
    height: 120px;
}
.hint-text-leng{
    position: absolute;
    right:30px;
    bottom: 56px;
    color: #000;
}
.remark-footer{
    display: flex;
    flex-direction: row-reverse;
    width: 100%;
    padding: 10px 0px;
    margin: 0;
    font-size: 10px;
}
.remark-footer button{
    padding: 2px 6px!important;
}
</style>
 