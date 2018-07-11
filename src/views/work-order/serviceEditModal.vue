<template>
    <div class="animated fadeIn large-diag">
         <el-dialog size="large" title="添加服务"  :visible.sync="dialogPay" :modal="false" ref="modal2">
			 <div class="container-fluid dialog-cont-h">
				 <b-row>
					<div class="col-md-4 pb-3">
                        <span class="mb-3 mb-3">
                            订单号: {{orderNo}}
                        </span>
                    </div>
				</b-row>	
                <b-row>
					<div class="col-md-4" v-show="priceType != '3'">
                        <table class="table b-table table-striped table-hover table-bordered">
                            <tr>
                                <td class="td-w-2text">类型</td>
                                <td>{{priceType | priceTypeName}}</td>
                            </tr>
                            <tr>
                                <td class="td-w-2text">服务名称</td>
                                <td>{{'【'+ serviceAllInfo.serviceCode + '】' + serviceAllInfo.serviceName}}</td>
                            </tr>
                            <tr>
                                <td class="td-w-2text">分类</td>
                                <td>
                                    <span v-for="(item, index) in serviceAllInfo.serviceCategoryInfos" :key="index">
                                        <span v-if="index != 0">></span>
                                        {{item.categoryName}}                                   
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-4" v-show="priceType == '3'">
                        <table class="table b-table table-striped table-hover table-bordered">
                            <tr>
                                <td class="td-w-2text">类型</td>
                                <td>{{priceType | priceTypeName}}</td>
                                <td>服务显示名称</td>
                            </tr>
                            <tr>
                                <td class="td-w-2text">服务名称</td>
                                <td>{{'【'+ serviceAllInfo.serviceCode + '】' + serviceAllInfo.serviceName}}</td>
                                <td rowspan="2">
                                    <input type="text" class="form-control" v-model.trim="serviceDisplayName">
                                </td>
                            </tr>
                            <tr>
                                <td class="td-w-2text">分类</td>
                                <td>
                                    <service-tree :params='params'  @getValue="getServiceClass" ref="serviveSelect"></service-tree>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-4">
                        <table class="table b-table table-striped table-hover table-bordered">
                            <tr>
                                <td class="td-w-2text">车牌</td>
                                <td>{{carInfo.plateNumber}}</td>
                            </tr>
                            <tr>
                                <td class="td-w-2text">车型</td>
                                <td>{{carInfo.displayName}}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-4">
                        <div class="car-add-box form-inline" v-show="carAddInfoList.length != 0">
                            <div  v-for="(item, index) in carAddInfoList" :key="index" style="width: 100%;" class="row text-right">
                                <div class="col-md-4 pl-0 pr-1">
                                    <span>{{item.carAddName}}</span>
                                </div>
                                <div class="col-md-4 pl-0 pr-1 text-left">
                                    <select class="form-control custom-select"  style="width:100%;" v-model="item.value" @change="eidtCarAdd(item, item.value)">
                                        <option  v-for="(selObj, i) in item.list" :key="i" :value="selObj.value">{{selObj.text}}</option>
                                    </select>
                                </div>
                                <div class="col-md-4 pl-0 pr-1">
                                    <input type="text" v-model="item.otherName" class="form-control" style="width:100%;" v-show='item.value == "other01"' @blur="eidtCarAdd(item, item.value, item.otherName)">
                                </div>                     
                            </div>
                        </div>
                    </div>
				</b-row>	
                <b-row  class="mt-3" v-show="priceType == '1'">
                    <div class="col-md-4">
                        标准售价/门市价： {{parseFloat(serviceAllInfo.labourCost).toFixed(2)}}元
                    </div>
                    <div class="col-md-4">
                        预计耗时： {{serviceAllInfo.expectedToTake+ '分钟'}}
                    </div>
                </b-row>
                <b-row class="mt-3"  v-show="priceType != '1'">
                    <div class="col-md-8">
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
                                    <input v-else type="number" class="form-control" v-model="serviceAllInfo.workHours" min=0  @input="getInput(serviceAllInfo.workHours, 'workHours')">
                                </td>
                                <td>
                                    <span>{{parseFloat(serviceAllInfo.labourHourUnitPrice).toFixed(2)}}</span>
                                </td>
                                <td>
                                    <span v-if="priceType == '2'">{{parseFloat(serviceAllInfo.labourCost).toFixed(2)}}</span>
                                     <input v-else type="number" class="form-control" v-model="serviceAllInfo.labourCost" min=0 @input="getInput(serviceAllInfo.labourCost, 'labourCost')">
                                </td>
                                <td>
                                    <span v-if="priceType == '2'">{{serviceAllInfo.expectedToTake}}</span>
                                    <input  v-else  v-model="serviceAllInfo.expectedToTake" type="number" class="form-control" min=0 style="display:inline-block!important; width: 72%!important;">分钟
                                </td>
                            </tr>
                        </table>
                    </div>
                </b-row>
                <div class="mt-3 pt-3" v-show="(priceType == '1' && serviceSkuClassList.length != 0) || priceType == '2' || priceType == '3'">
                    <b-row class="text-left">
                        <div class="col-md-12 form-inline ">
                            <h5 class="text-primary mr-3">商品信息</h5>
                            <b-form-group v-show="priceType != '1'&& serviceNeedSku == 0">
                                <b-form-checkbox-group id="checkboxes2" class="mt-1" v-model="needSku"  @input="seletNeedSku">
                                    <b-form-checkbox :value="0" :unchecked-value="1" >不需要配件</b-form-checkbox> 
                                </b-form-checkbox-group>
                            </b-form-group>
                        </div>
                    </b-row>
                    <b-row class="mt-2" v-show="(priceType == '1' && needSku != 0) || (priceType == '2' && serviceNeedSku == 1 && needSku == 1)">
                        <div class="col-md-3">
                             <b-form-select :options="whList" v-model="whCode" @input="searchParamChange"></b-form-select>
                        </div>
                        <div class="col-md-3">
                             <b-form-select :options="serviceSkuClassList" v-model="serviceSkuClass"  @input="searchParamChange"></b-form-select>
                        </div>
                    </b-row>
                    <b-row class="mt-2"  v-show="priceType == '2' && serviceNeedSku == 0 && needSku == 1">               
                        <div class="col-md-3">
                             <b-form-select :options="whList"  v-model="whCode" @input="searchParamChange"></b-form-select>
                        </div>
                        <div class="col-md-2">
                             <sku-class-tree  @getSkuClass="getSkuClass" ref="skuSelect"></sku-class-tree>
                        </div>
                        <div class="col-md-5">
                             <input class="form-control"  v-model="tempParameter" placeholder="商品编码/商品名称/规格/型号/69码/原厂编码" @input="inputSearchParamChange"/>
                        </div>
                    </b-row>
                    <b-row class="mt-2"  v-show="priceType == '3' && needSku != 0">
                        <div class="col-md-2">
                             <b-form-select :options="skuOrginList"  v-model="skuOrgin" @change="seletSkuOrgin"></b-form-select>
                        </div>
                        <div class="col-md-3" v-show="skuOrgin == '0'">
                             <b-form-select :options="whList"  v-model="whCode" @input="searchParamChange"></b-form-select>
                        </div>
                        <div class="col-md-2" v-show="skuOrgin == '0'">
                             <sku-class-tree  @getSkuClass="getSkuClass" ref="skuSelect"></sku-class-tree>
                        </div>
                        <div class="col-md-5" v-show="skuOrgin == '0'">
                             <input class="form-control"  v-model="tempParameter" placeholder="商品编码/商品名称/规格/型号/69码/原厂编码" @input="inputSearchParamChange"/>
                        </div>
                    </b-row>
                    <div class="table-scrollable mb-2 service-manhour" v-show="needSku != 0 && skuOrgin == '0'">
                        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="searchList" :fields="searchFields">                           
                            <template slot="skuPrice" slot-scope="data">
                               {{parseFloat(data.value).toFixed(2)}}
                            </template>
                            <template slot="selectSku" slot-scope="data">
                                <b-button size="sm" variant="primary" @click="selectSku(data.item)">选择</b-button>
                            </template> 
                        </b-table>
                    </div>
                    <div class="row"  v-show="needSku != 0 && skuOrgin == '0'"> 
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
				<div class="mt-3 pt-3"  v-show="needSku != 0">
                     <b-row class="text-left">
                        <div class="col-md-12  text-primary">
                            <h5>需求信息</h5>
                        </div>
                    </b-row>
                    <b-row class="text-left pl-3" v-show="skuOrgin == '1'">
                        <b-button size="sm" variant="success" @click="addTempNeedSku">添加</b-button>                                
                    </b-row>
                    <div class="table-scrollable mb-2 service-manhour" v-show="skuOrgin == '0'">
                        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="needList" :fields="fields">
                            <template slot="skuName" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" v-model.trim="data.item.skuName" class="input-min-w"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="originalCode" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" v-model.trim="data.item.originalCode" class="input-min-w"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="brandName" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" v-model.trim="data.item.brandName" class="input-min-w"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="skuModel" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id"  v-model.trim="data.item.skuModel" class="input-min-w"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="skuStandards" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id"  v-model.trim="data.item.skuStandards" class="input-min-w"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="nums" slot-scope="data">
                                <b-form-input v-if="!data.item.fixedNums" @input="inputNums('nums', data.item.nums, data.index)" type="number"  min="0" v-model="data.item.nums" :disabled="!!data.item.id" class="input-min-w"/>   
                                <span v-else>{{data.value ? parseFloat(data.value): ''}}</span>                   
                            </template> 
                            <template slot="checkUnitName" slot-scope="data">
                                <span>{{data.value}}</span>     
                            </template>
                            <template slot="skuPrice" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" type="number"  min="0" v-model.trim="data.item.skuPrice"  class="input-min-w"/>   
                                <span v-else> {{data.value ? parseFloat(data.value).toFixed(2): ''}}</span>   
                            </template>
                            <template slot="actualSalesPrice" slot-scope="data">
                               {{data.value ? parseFloat(data.value).toFixed(2): ''}}
                            </template>
                            <template slot="stockUpStatus" slot-scope="data" style="background: red;">
                                <span v-if="data.value === 1" class="text-success">充足</span>                      
                                <span v-if="data.value === 0" class="text-danger">缺货</span>   
                                <span v-if="data.value === 2" class="text-success">已备货</span>                   
                            </template> 
                            <template slot="operation" slot-scope="data">
                                <div style="width: 130px;">
                                    <b-button size="sm" variant="primary" class="pull-left" @click="stockUp(data.item)" v-if="data.item.id && data.item.stockUpStatus === 0">备货</b-button>
                                    <b-button size="sm" variant="danger" class="pull-left ml-3" @click="delSku(data.item)">清空</b-button>
                                </div>                             
                            </template> 
                        </b-table>
                    </div>
                    <div class="table-scrollable mb-2 service-manhour"  v-show="skuOrgin == '1'">
                        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="needList" :fields="tempFields">
                            <template slot="skuName" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" v-model.trim="data.item.skuName" class="input-min-w"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="originalCode" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" v-model.trim="data.item.originalCode" class="input-min-w"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="brandName" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" v-model.trim="data.item.brandName" class="input-min-w"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="skuModel" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id"  v-model.trim="data.item.skuModel" class="input-min-w"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="skuStandards" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id"  v-model.trim="data.item.skuStandards" class="input-min-w"/>   
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="nums" slot-scope="data">
                                <b-form-input v-if="!data.item.fixedNums" @input="inputNums('nums', data.item.nums, data.index)" type="number"  min="0" v-model="data.item.nums" :disabled="!!data.item.id" class="input-min-w"/>   
                                <span v-else>{{data.value ? parseFloat(data.value): ''}}</span>                   
                            </template> 
                            <template slot="checkUnitName" slot-scope="data">
                                 <b-form-input v-if="data.item.temporary == '1' && !data.item.id"  v-model.trim="data.item.checkUnitName" class="input-min-w"/>  
                                <span v-else>{{data.value}}</span>     
                            </template>
                            <template slot="skuPrice" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" type="number"  min="0" @input="inputNums('price', data.item.skuPrice, data.index)" v-model="data.item.skuPrice"  class="input-min-w"/>   
                                <span v-else> {{data.value ? parseFloat(data.value).toFixed(2): ''}}</span>   
                            </template>
                             <template slot="actualSalesPrice" slot-scope="data">
                               {{data.value ? parseFloat(data.value).toFixed(2): ''}}
                            </template>
                            <template slot="skuUsage" slot-scope="data">
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" v-model.trim="data.item.skuUsage"  class="input-min-w"/>   
                                <span v-else> {{data.value}}</span>   
                            </template>
                            <template slot="stockUpStatus" slot-scope="data" style="background: red;">
                                <span v-if="data.value === 1" class="text-success">充足</span>                      
                                <span v-if="data.value === 0" class="text-danger">缺货</span>   
                                <span v-if="data.value === 2" class="text-success">已备货</span>                   
                            </template> 
                            <template slot="operation" slot-scope="data">
                                <div style="width: 130px;">
                                    <b-button size="sm" variant="danger" class="pull-left ml-3" @click="delSku(data.item)">清空</b-button>
                                </div>                             
                            </template> 
                        </b-table>
                    </div>
                </div>				
			 </div>
             <div  class="col-md-12 text-right mt-2 mb-2">
                 <div class="col-md-12 text-right" v-show="priceType != '1'">
                    人工费： {{parseFloat(serviceAllInfo.labourCost)?parseFloat(serviceAllInfo.labourCost).toFixed(2): '0.00'}}元， &nbsp;&nbsp;材料费： {{materialsExpenses}}元，&nbsp;&nbsp;合计： {{totalPrice}}元
                </div>
                <div class="col-md-12  text-right" v-show="priceType == '1'">
                    合计： {{totalPrice}}元
                </div>
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
import { Message, Dialog, MessageBox, Input } from "element-ui"
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'
import Pagination from 'components/pagination/pagination'
import skuClassTree from '../purchase-return/skuClassTree'
import serviceTree from './serviceTree'
import {SKU_TEMPCODE_SEQ, SERVICE_ORDER_DETAIL_SEQ} from 'common/sequence.js'
Vue.use(Dialog);

Vue.use(Input)

export default {
    components: {
        Pagination,
        skuClassTree,
        serviceTree,
    },
    props: {
        orderNo: {
            type: String,
            default: function() {
                return '2222'
            }
        },
        serviceOrderNo: {
            type: String,
            default: function() {
                return ''
            }
        },
        serviceOrderDetailCode: {
            type: String,
            default: function() {
                return ''
            }
        },
        skuOrderNo: {
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
        serviceCode: {
            type: String,
            default: function() {
                return ''
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
        storeCode: {
            type: String,
            default: function() {
                return ''
            }
        },
    },
    data() {
        return { 
            params: {
                orgName: ''
            },
            carAddInfo: [],
            serviceDisplayName: '',
            serviceClassCode: '',
            paginationData: {
                total: 10,
                totalPages: 1,
                pageNo: 1,
                pageSize: 5
            },
            dialogPay: false,
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
                    label: '标准销售单价/门市单价（元）'
                },
                whName: {
                    label: '仓库'
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
            // 服务是否需要配件
            serviceNeedSku: 1,
            // 是否需要配件
            needSku: 1,
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
            tempFields: {
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
                nums: {
                    label: '需求数量'
                },
                checkUnitName: {
                    label: '单位'
                },
                skuPrice: {
                    label: '标准销售单价/门市单价（元）'
                },
                actualSalesPrice: {
                    label: '销售价格'
                },
                skuUsage: {
                    label: '用途'
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
                nums: 1,
                checkUnitName: '个',
                whName: '',
                availableNums: '',
                skuPrice: 0,
                actualSalesPrice: '',
                temporary: '1', // 1： 临时商品； 0: 自由商品；
            },
            userInfo: {},
            storeInfoVo: {},
            timer: undefined,
        }
    },
    computed: {
        ...mapGetters('workOrder', [
            'priceTypes',
            'storeInfo',
            'openServiceInfo',
            'whList',
        ]),
        materialsExpenses() {
            let labourCost = parseFloat(this.serviceAllInfo.labourCost) ? parseFloat(this.serviceAllInfo.labourCost) : 0;
            return (parseFloat(this.totalPrice) - labourCost).toFixed(2);
        },
    },
    created() {
        
    },
    methods: {
         // 获取门店仓库
        getWhlist() {
            let params = {
                storeCode: this.storeCode
            }
            return new Promise((resolve, reject) => {
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
                        //this.whList = [...arr];
                        resolve(obj);
                    }
                });    
            })
                   
        },
         // 生成工单服务明细编码
        createServiceDetailCodeList(num) {
            const option = {
                'serviceCode': SERVICE_ORDER_DETAIL_SEQ,
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
        // 获取车辆附加属性值列表
        getCarAddSelList(val) {
            const option = {
                carCode: this.carInfo.carCode,
                addCode: val
            }
            return new Promise((reslove,reject) => {
                api.repairOrder.queryCarAddInfos(option, (res) => {
                    if(res.data.code === 'success') {
                        reslove(res.data.obj)
                    };
                })
            })				
        },
        // 获取人车信息
        getCarAddInfo() {
            let params = {
                    // plateNumber: '京25852'
                    plateNumber: this.carInfo.plateNumber
                }
                return new Promise((resolve, reject) => {
                    api.mancar.queryCustomInfoByMobilePhone(params).then(res => {
                    if(res.data.code === 'success') {
                        let obj = res.data.obj
                        if(obj) {
                            this.carAddInfo = obj.customVehicleInfoVos[0].customVehicleAddInfoVos;
                            resolve(this.carAddInfo);
                        }else {
                            Message({
                                message: '获取车辆信息失败!',
                                type: 'error'
                            });  
                        }
                    }
                })
            })        
        },
        // 获取服务信息
        getServiceInfo() {
            let param = {
                serviceCode: this.serviceCode,
                storeCode: this.storeCode,
                vehicleCode: this.carInfo.vehicleCode,
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
            if(this.priceType == '1' || (this.priceType == '2' && this.serviceNeedSku == 1)) {
                if(this.serviceSkuClass == '') {
                    Message({
                        message: '该服务商品分类信息为空!',
                        type: 'warning'
                    });  
                    return;           
                }
                
                let objClass = JSON.parse(this.serviceSkuClass);
                param = {
                    detailCode: objClass.detailCode,
                    detailType: objClass.detailType,
                }
            }else if(this.priceType == '3' || (this.priceType == '2' && this.serviceNeedSku == 0)){
                param = {
                    tempParameter: this.tempParameter,
                    detailCode: this.skuClass ? this.skuClass : '000001',
                    detailType: '3',
                }
            }
            param.vehicleCode = this.carInfo.vehicleCode;
            param.storeCode = this.storeCode;
            param.whCode = this.whCode;
            param.pageNums = 5;
            param.pageStart = val ? val : 1;
            
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
        getOrderServiceInfo(val) {
            let param = {
                "serviceOrderDetailCode": val,
                "needSku": 1
            }
            return new Promise((resolve, reject) => {
                api.repairOrder.getServiceOrderDetailInfoByCode(param,res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        resolve(obj);
                    }
                });  
            })  
        },
        resetData() {
            this.needList = [];
            this.serviceSkuClassList = [];
            this.carAddInfoList = [];
            this.serviceDisplayName = '';
            this.params.orgName = '';
            this.tempParameter = '';
            this.serviceAllInfo = {};
            this.skuClass = '000001';
            this.skuOrgin = '0'
            this.paginationData.total = 0;
            this.paginationData.totalPages = 1;
            this.paginationData.pageNo = 1;
            this.skuListArr = [];
            this.brandListArr = [];
            this.classListArr = [];
        },
        showModel() {    
            let _this = this;
            this.resetData();
            if(!this.storeCode) {
                Message({
                    message: '该用户无门店信息，请更换账号!',
                    type: 'warning'
                });             
                this.dialogPay = false;
                return;
            }     
            this.$nextTick( () => {
                if(this.whList.length != 0) {
                    this.whCode = this.whList[0].value;
                } 
                this.getCarAddInfo().then(r => {
                    if(this.serviceCode !== this.openServiceInfo.refDetailValue) {
                         _this.getServiceInfo().then(res => {
                            _this.carAddInfoList = [];
                            if(res.serviceCarAddInfoList.length != 0){
                                let setFun = async function() {
                                    let carAddArr = [];
                                    for(let i = 0; i < res.serviceCarAddInfoList.length; i++){
                                        let carAddObj = Object.assign({}, res.serviceCarAddInfoList[i]);
                                        let resl = await _this.getCarAddSelList( res.serviceCarAddInfoList[i].carAddCode);
                                        let arr = [];
                                        for(let j = 0; j < resl.length; j++){
                                            let obj = {
                                                value: resl[j].addValue,
                                                text: resl[j].addValue
                                            }
                                            arr.push(obj);
                                        }
                                        let otherObj = {
                                            value: 'other01',
                                            text: '其他'
                                        }
                                        arr.push(otherObj);
                                        carAddObj.list = [...arr];
                                        carAddObj.otherName = '';
                                        if(_this.carAddInfo && _this.carAddInfo.length != 0) {
                                            _this.carAddInfo.forEach((v, ind) => {
                                                if(v.addCode ==  res.serviceCarAddInfoList[i].carAddCode) {
                                                    carAddObj.value = v.addValue;
                                                    carAddObj.addId = v.id;
                                                    carAddObj.carDetailCode = v.carDetailCode;
                                                    let isMatched = false;
                                                    carAddObj.list.forEach((val, j) => {
                                                        if(val.text ==  v.addValue) {
                                                        isMatched = true;
                                                        }
                                                    });
                                                    if(!isMatched) {
                                                        carAddObj.list.unshift({value: v.addValue, text: v.addValue})
                                                    }
                                                }
                                            });
                                            
                                        }
                                        carAddArr.push(carAddObj)
                                    }
                                    _this.carAddInfoList = [...carAddArr];
                                }
                                setFun()
                            }
                            if(res.serviceSkuRelationInfos && res.serviceSkuRelationInfos.length != 0) {
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
                                        modelObj.categoryName = item.skuCategoryName;
                                        let tempObj = Object.assign({}, modelObj);
                                        this.skuListArr.push(tempObj);
                                    }else if(item.detailType == '2') {
                                        modelObj.brandName = item.detailName;
                                        modelObj.categoryName = '';
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
                            }else {
                                this.serviceSkuClassList = [];
                                this.modelNeedList = [];                              
                            }
                            this.serviceAllInfo = Object.assign({}, res);
                            delete this.serviceAllInfo.id;
                            this.priceType = res.priceType;
                            this.serviceNeedSku = res.skuType;
                            this.needSku = res.skuType;
                            if(this.serviceNeedSku == 0 && this.priceType == '2') {
                                this.serviceSkuClassList = [];
                                this.needSku = 1;
                            }
                            if(res.skuType == 1 && this.serviceSkuClassList.length == 0 && this.priceType == '1') {
                                 Message({
                                    message: `${res.serviceName}未配置SKU关联关系！`,
                                    type: 'error'
                                }); 
                                this.dialogPay = false;
                                return
                            }
                            if(this.priceType == '1' || (this.priceType == '1' && this.serviceNeedSku == 0)) {
                                if(this.serviceSkuClassList.length > 0) {                                
                                    this.search();
                                }
                            }else {
                                this.search();
                            }                           
                            _this.setServiceData();
                        })
                    }else {
                        this.priceType = '3';
                        this.serviceNeedSku = 0;
                        this.needSku = 1;
                        this.serviceAllInfo.serviceCode = this.serviceCode;
                        this.serviceAllInfo.serviceName = this.openServiceInfo.refDetailName;
                        this.serviceDisplayName = this.openServiceInfo.refDetailName;
                        this.serviceAllInfo.labourHourUnitPrice = this.storeInfo.labourHourUnitPrice;
                        this.search();
                        this.setServiceData();
                    }
                })  
            })
           
        },
        // 设置页面服务显示数据
        setServiceData() {
            if(this.serviceOrderDetailCode !== '') {                      
                this.needList = JSON.parse(JSON.stringify(this.modelNeedList));
                this.getOrderServiceInfo(this.serviceOrderDetailCode).then(resl => {
                    this.needSku = resl.needSku;
                    if(this.priceType == '3') {
                        this.serviceAllInfo.id = resl.id;
                        this.serviceAllInfo.workHours = resl.actualWorkHours;
                        this.serviceAllInfo.labourHourUnitPrice = resl.actualWorkHourPrice;
                        this.serviceAllInfo.labourCost = ((parseFloat(this.serviceAllInfo.workHours) ? parseFloat(this.serviceAllInfo.workHours) : 0) * (parseFloat(this.serviceAllInfo.labourHourUnitPrice) ? parseFloat(this.serviceAllInfo.labourHourUnitPrice) : 0)).toFixed(2);
                        this.serviceAllInfo.expectedToTake = resl.costTime;
                        this.serviceAllInfo.categoryName = resl.categoryName;
                        this.serviceAllInfo.categoryCode = resl.categoryCode;
                        this.params.orgName = resl.categoryName;
                        this.serviceClassCode = resl.categoryCode;
                        this.needList = resl.needList;
                    }
                    this.serviceDisplayName = resl.serviceDisplayName;
                    this.serviceAllInfo.id = resl.id;
                    this.setNeedList(resl.skuOrderDetailInfoList);
                    if(resl.skuOrderDetailInfoList.length > 0 && resl.skuOrderDetailInfoList[0].skuTempCode) {
                        this.skuOrgin = '1';
                    }
                    this.countTotalPtice();
                    this.dialogPay = true;
                })
            }else {
                if(this.priceType != '3') {
                    this.needList = JSON.parse(JSON.stringify(this.modelNeedList));
                }else {
                    this.needList = [];
                }
                this.countTotalPtice();
                this.dialogPay = true;
            }           
        },
        // 确定触发
        addModelAdd() {
            let serviceObj = {};
            let skuList = [];
            if(this.priceType == '3') {
                if(!this.serviceAllInfo.categoryCode) {
                    Message({
                        message: '服务分类不可为空!',
                        type: 'warning'
                    });
                    return
                }
                if(!this.serviceDisplayName) {
                    Message({
                        message: '服务显示名称不可为空!',
                        type: 'warning'
                    });
                    return
                }
                if(!this.serviceAllInfo.workHours) {
                    Message({
                        message: '服务工时不可为空!',
                        type: 'warning'
                    });
                    return
                }
                if(!this.serviceAllInfo.expectedToTake) {
                    Message({
                        message: '服务耗时不可为空!',
                        type: 'warning'
                    });
                    return
                }
            }else {
                // if(this.needList.length ) {
                //     Message({
                //         message: '服务耗时不可为空!',
                //         type: 'success'
                //     });
                //     return
                // }
            }
            serviceObj.orderNo = this.orderNo;
            serviceObj.serviceOrderNo = this.serviceOrderNo;
            serviceObj.priceType = this.priceType;
            serviceObj.serviceName = this.serviceAllInfo.serviceName;
            serviceObj.serviceCode = this.serviceAllInfo.serviceCode;
            serviceObj.categoryCode = this.serviceAllInfo.categoryCode;
            serviceObj.categoryName = this.serviceAllInfo.categoryName;
            serviceObj.catlogCode = this.serviceAllInfo.catlogCode;
            serviceObj.actualWorkHours = this.serviceAllInfo.workHours;
            serviceObj.actualWorkHourPrice = this.serviceAllInfo.labourHourUnitPrice;
            serviceObj.costTime = this.serviceAllInfo.expectedToTake;
            serviceObj.serviceDisplayName = this.serviceDisplayName;
            serviceObj.needSku = (this.needSku == 0 ) ? 0 : 1;
            if(this.serviceAllInfo.id) {
                serviceObj.id = this.serviceAllInfo.id;
            }
            this.createServiceDetailCodeList(1).then(res => {
                let onoff = true;
                if(!this.serviceOrderDetailCode) {
                    serviceObj.serviceOrderDetailCode = res[0];
                }else {
                    serviceObj.serviceOrderDetailCode = this.serviceOrderDetailCode;
                }
                if(serviceObj.needSku == '1') {
                    if(this.needList.length == 0) {
                        Message({
                            message: '未添加配件信息!',
                            type: 'warning'
                        });                      
                        return;
                    }
                    this.needList.forEach((item, i) => {
                        if((!item.skuCode) || item.skuCode == '') {
                            Message({
                                message: '配件未填写完整!',
                                type: 'warning'
                            });
                            onoff = false;
                            return;
                        }
                        if((!item.nums) || parseFloat(item.nums) <= 0) {
                            Message({
                                message: `${item.skuName}需求数量不可小于等于0！`,
                                type: 'warning'
                            });
                            onoff = false;
                            return;
                        }  
                        let obj = {
                            orderNo: this.orderNo,
                            storeCode: this.storeCode,
                            skuName: item.skuName,
                            originalCode: item.originalCode,
                            whCode: item.whCode,
                            brandCode: item.brandCode,
                            brandName: item.brandName,
                            unitName: item.checkUnitName,
                            skuStandards: item.skuStandards,
                            skuModel: item.skuModel,
                            categoryCode: item.categoryCode,
                            nums: item.nums,
                            originalSalesPrice: item.skuPrice,
                            actualSalesPrice: item.actualSalesPrice,
                            serviceOrderNo: this.serviceOrderNo,
                            serviceOrderDetailCode: serviceObj.serviceOrderDetailCode,
                            skuOrderNo:  this.skuOrderNo,
                            relationCodes: item.skuCategoryRelationCodes,
                            skuGroupCode:  item.skuGroupCode,
                        };                
                        if(item.temporary == '1') {
                            obj.skuTempCode = item.skuCode;
                            obj.skuUsage = item.skuUsage;
                            if(!obj.skuName) {
                                Message({
                                    message: `商品名称不可为空！`,
                                    type: 'warning'
                                });
                                onoff = false;
                                return;
                            }  
                            if((!obj.originalCode) && (!obj.brandName) && (!obj.skuStandards) && (!obj.skuModel)) {
                                 Message({
                                    message: `原厂编码、品牌、型号、规格至少填写一个！`,
                                    type: 'warning'
                                });
                                onoff = false;
                                return;
                            }
                            if(!obj.skuUsage) {
                                Message({
                                    message: `用途不可为空！`,
                                    type: 'warning'
                                });
                                onoff = false;
                                return;
                            }  
                        }else {
                            obj.skuCode = item.skuCode;
                        }  
                        skuList.push(obj)                    
                    });
                    if(onoff) {
                        this.saveDataM(serviceObj, skuList);
                    }                                     
                }else {
                    if(onoff) {
                        this.saveDataM(serviceObj, skuList);
                    }
                }
            })            
        },
        saveDataM(val1, val2) {
             let param = {
                    orderServiceDetailInfos: [val1],
                    orderServiceDetailSkuInfos: val2,
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
        getSkuClass(val){          
            this.skuClass = val.categoryCode;
            this.searchParamChange();
        },
        getServiceClass(val) {
            this.serviceClassCode = val.categoryCode;
            this.serviceAllInfo.categoryCode = val.categoryCode;
            this.serviceAllInfo.categoryName = val.categoryName;
        },
        selectSku(val) {
            let getObj = Object.assign({}, val);
            delete getObj.id;
            for(let [i, item] of this.needList.entries()){
                if(item.skuCode == getObj.skuCode){
                    Message({
                        message: '已存在SKU信息，请先清空!',
                        type: 'warning'
                    });
                    return;
                }
            }
            this.getSkuWhNums(getObj.skuCode).then(res => {
                getObj.availableNums = res[this.whCode].availableNums? res[this.whCode].availableNums: 0;
                if(this.priceType == '1' || (this.priceType == '2' && this.serviceNeedSku == 1)) {      
                    let skuClassObj = JSON.parse(this.serviceSkuClass);         
                    getObj.temporary = '0';                   
                    this.needList[skuClassObj.index] = Object.assign(this.needList[skuClassObj.index], getObj);
                    if(this.needList[skuClassObj.index].fixedNums) {
                        this.needList[skuClassObj.index].actualSalesPrice = (this.needList[skuClassObj.index].skuPrice ? parseFloat(this.needList[skuClassObj.index].skuPrice) : 0) * this.needList[skuClassObj.index].nums;   
                    }else{
                        this.needList[skuClassObj.index].nums = 0; 
                    }
                    if(this.needList[skuClassObj.index].nums <= 0) {
                        this.needList[skuClassObj.index].stockUpStatus = '';
                    }else {
                         this.needList[skuClassObj.index].stockUpStatus = parseFloat(this.needList[skuClassObj.index].availableNums) - parseFloat(this.needList[skuClassObj.index].nums) >=0 ? 1 : 0;
                    }
                   
                }else {
                    getObj.temporary = this.skuOrgin;
                    this.needList.push(getObj);
                }
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
                                message: '库存数量不足!',
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
                                 for(let [i, item] of this.needList.entries()) {
                                        if(item.skuCode == val.skuCode) {    
                                            console.log(this.modelNeedList)                      
                                            if(this.priceType == '1' || (this.priceType == '2' && this.serviceNeedSku == 1)) {
                                                this.needList[i] = {...this.modelNeedList[i]};
                                            }else {
                                                this.needList.splice(i, 1);                                 
                                            }     
                                            this.needList = JSON.parse(JSON.stringify(this.needList));     
                                            this.countTotalPtice();             
                                            break;
                                        }
                                    };
                            }
                        });  
                    }else {
                        for(let [i, item] of this.needList.entries()) {
                            if(item.skuCode == val.skuCode) {  
                                if(this.priceType == '1' || (this.priceType == '2' && this.serviceNeedSku == 1)) {
                                    this.needList[i] = {...this.modelNeedList[i]};
                                }else {
                                    this.needList.splice(i, 1);                                 
                                }               
                                break;
                            }
                        };
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
               if(this.serviceAllInfo.priceType == '1') {
                   price += this.serviceAllInfo.labourCost;
               }else if(this.serviceAllInfo.priceType != '1') {
                   let num = 0;
                   if(this.needList.length != 0) {
                       this.needList.forEach(item =>{
                           num += parseFloat(item.actualSalesPrice)?parseFloat(item.actualSalesPrice):0;
                       })
                   }
                   let totalNum = num + (parseFloat(this.serviceAllInfo.labourCost)?parseFloat(this.serviceAllInfo.labourCost):0);
                    price += totalNum;                
               }
               this.totalPrice = parseFloat(price).toFixed(2);
           }
           
        },
        searchParamChange() {
            let val = 1;
            this.search(val);
        },
        inputSearchParamChange() {
            if(this.timer) {
                clearTimeout(this.timer);
            }
           this.timer = setTimeout(() => {
               this.searchParamChange()
           }, 700);
        },
        inputNums(type, val, index) {
            if(type == 'nums') {
                this.needList[index].nums = val ? val : 0;
            }else if(type == 'price') {
                this.needList[index].skuPrice = val ? val : 0;
            }   
            this.needList[index].actualSalesPrice = (this.needList[index].skuPrice ? parseFloat(this.needList[index].skuPrice) : 0) * this.needList[index].nums;
            this.needList[index].stockUpStatus = parseFloat(this.needList[index].availableNums) - parseFloat(this.needList[index].nums) >=0 ? 1 : 0;
            this.needList = JSON.parse(JSON.stringify(this.needList));
            this.countTotalPtice();
        },
        setNeedList(objA) {
            let _this = this;
            function setNeedListSon(item, str) {
                objA.forEach((v, i) =>{
                    if((v[str] == item.detailCode && (!_this.needList[item.index][str])) || ( v.relationCodes && item[str] && v.relationCodes.includes(item[str]) && (!_this.needList[item.index][str]))) {
                        let obj = Object.assign({}, v);
                        obj.fixedNums = item.fixedNums;
                        obj._cellVariants = item.fixedNums ? { nums: 'primary' } : {};
                        obj.skuStandards = obj.skuStandards;
                        obj.checkUnitName = obj.unitName;
                        obj.availableNums = obj.availableNums;
                        obj.skuPrice = obj.originalSalesPrice;
                        obj.temporary = '0';
                        obj.stockUpStatus = obj.detailStatus;
                        _this.needList[item.index] = obj;
                        objA.splice(i, 1);
                    }
                })
            };
            if(this.priceType == '1' || (this.priceType == '2' && this.serviceNeedSku == 1)) {
                if(this.skuListArr.length != 0) {
                    this.skuListArr.forEach((item, index) =>{
                        setNeedListSon(item, 'skuCode');
                    })              
                };
                if(this.brandListArr.length != 0) {
                    this.brandListArr.forEach((item, index) =>{
                        setNeedListSon(item, 'brandCode');
                    })              
                };
                if(this.classListArr.length != 0) {
                    this.classListArr.forEach((item, index) =>{
                        setNeedListSon(item, 'categoryCode');
                    })              
                };
            }else {
                let arr = [];
                objA.forEach((v, i) =>{
                    let obj = Object.assign({}, v);
                    obj.skuStandards = obj.skuStandards;
                    obj.checkUnitName = obj.unitName;
                    obj.availableNums = obj.availableNums;
                    obj.skuPrice = obj.originalSalesPrice;
                    if(obj.skuTempCode != null && obj.skuTempCode != '') {
                        obj.skuCode = obj.skuTempCode;
                        obj.temporary = '1';
                    }else {
                        obj.temporary = '0';
                    }
                    obj.stockUpStatus = obj.detailStatus;
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
            }, 300)   
        },
        // 根据输入计算工时、售价
        getInput(val, str){
            let num = parseFloat(val) ? parseFloat(val) : 0;
            if(str == 'workHours') {
                this.serviceAllInfo.labourCost =(num * 1000) * (this.serviceAllInfo.labourHourUnitPrice * 1000) / 1000000;
                this.serviceAllInfo.expectedToTake = (num * 1000) * (this.storeInfo.labourHourToMinutes * 1000) / 1000000;
            }else if(str == 'labourCost') {
                this.serviceAllInfo.workHours = ((num * 1000) / (this.serviceAllInfo.labourHourUnitPrice * 1000)).toFixed(1);
                this.serviceAllInfo.expectedToTake = (this.serviceAllInfo.workHours*1000) * (this.storeInfo.labourHourToMinutes * 1000) / 1000000;
            }
            this.countTotalPtice();
        },
        seletSkuOrgin(val) {
            for(let [i, item] of this.needList.entries()) {
                if(item.id) {
                    Message({
                        message: `已存在${item.temporary == '1'? '临时采购商品' : '自店库存商品'}，请先清空！`,
                        type: 'warning'
                    }); 
                    setTimeout(() => {
                        this.skuOrgin = item.temporary == '1' ? '1': '0';
                    }) 
                    return;
                }
            }
            this.skuOrgin = val
            this.needList = [];
            this.countTotalPtice();
        },
        seletNeedSku(val) {
            if(val == 0) {
                for(let [i, item] of this.needList.entries()) {
                    if(item.skuCode) {
                        Message({
                            message: `已存在商品，请先清空！`,
                            type: 'warning'
                        }); 
                        setTimeout(() => {
                            this.needSku = 1;
                        }) 
                        return;
                    }
                }
            } 
        },
    },
    watch:{
        dialogPay(val) {
          this.$emit('visibleChange', val);
        }
    },
    filters: {
        priceTypeName(val) {
           if(val == '1') {
               return '固定售价服务';
           }else if(val == '2') {
               return '非固定售价服务';
           }else if(val == '3') {
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
.input-min-w{
    width: 90px!important;
}
.td-w-2text{
    width: 60px!important;
}
</style>
 