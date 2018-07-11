<template>
    <div class="animated fadeIn large-diag">
         <el-dialog size="large" title="添加托外项目"  :visible.sync="dialogPay" :modal="false" ref="modal2">
			 <div class="container-fluid dialog-cont-h">
				 <b-row>
					<div class="col-md-4 pb-3">
                        <span class="mb-3 mb-3">
                            订单号: {{orderNo}}
                        </span>
                    </div>
				</b-row>	
                 <b-row>
					<div class="col-md-6">
                        <table style="width: 100%;">
                            <tr>
                                <td>
                                    <h4>{{carInfo.plateNumber}}</h4>
                                </td>
                                <!-- <td>车主手机号</td> -->
                                <!-- <td>客户姓名</td> -->
                            </tr>
                            <tr>
                                <td>{{carInfo.displayName}}</td>
                                <!-- <td>{{carInfo.mobilePhone}}</td>
                                <td>{{carInfo.customName}}</td> -->
                            </tr>
                        </table>
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
                                   <service-tree :params='params'  @getValue="getServiceClass" ref="serviveSelect2"></service-tree>
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
                                    <input type="number" class="form-control" v-model="serviceAllInfo.workHours" min=0  @input="getInput(serviceAllInfo.workHours, 'workHours')">
                                </td>
                                <td>
                                    <span>{{parseFloat(serviceAllInfo.labourHourUnitPrice).toFixed(2)}}</span>
                                </td>
                                <td>                       
                                    <input type="number" class="form-control" v-model="serviceAllInfo.labourCost" min=0 @input="getInput(serviceAllInfo.labourCost, 'labourCost')">
                                </td>
                                <td>
                                    <input v-model="serviceAllInfo.expectedToTake" type="number" class="form-control" min=0 style="display:inline-block!important; width: 72%!important;">分钟
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-6">
                        <b-row>
                            <div class="col-md-5">
                                <b-form-fieldset horizontal label="委托外包类型" :label-cols="4" class="text-right">
                                    <b-form-select :options="outsideTypeList" v-model="outsideType"></b-form-select>
                                </b-form-fieldset>
                            </div>
                           <div class="col-md-7" v-show="outsideType == '0'">
                                <b-form-fieldset horizontal label="委托单位" :label-cols="4" class="text-right">
                                    <select-search @getValue="getSuppler" :params="searchSupplierParams" :apiName="supplierApiName" :name1="'supplierName'" ref="supplierSelect"></select-search>
                                </b-form-fieldset>
                            </div>
                            <div class="col-md-7" v-show="outsideType == '1'">
                                <b-form-fieldset horizontal label="委托单位" :label-cols="4" class="text-right">
                                    <select-search @getValue="getStore" :params="searchStoreParams" :apiName="storeApiName" :name1="'storeName'" ref="storeSelect"></select-search>
                                </b-form-fieldset>
                            </div>
                        </b-row>
                        <b-row>
                            <div class="col-md-12 mb-3" style="position: relative!important;">
                                 <textarea v-model="outsideDesc" class="form-control remark-textarea" placeholder="委托外包说明" id="data.item.index" @input="checkStrLength(outsideDesc, 'outsideDesc')">
                                </textarea>
                                <span class="hint-text-leng">{{outsideDesc.length}} / 120</span>
                                <b-row class="remark-footer" hidden>                                  
                                    <b-button size="sm">
                                            <i class="el-icon-close"></i>
                                    </b-button>   
                                     &nbsp;
                                    <b-button size="sm" variant="success">
                                            <i class="el-icon-check"></i>
                                    </b-button>                                                                          
                                </b-row>
                            </div>
                            <div class="col-md-12 mb-3" style="position: relative!important;">
                                 <textarea v-model="outsideRemark" class="form-control remark-textarea" placeholder="委托外包备注" id="data.item.index" @input="checkStrLength(outsideRemark, 'outsideRemark')">
                                </textarea>
                                <span class="hint-text-leng">{{outsideRemark.length}} / 120</span>
                                <b-row class="remark-footer" hidden>
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
                     <b-form-group>
                        <b-form-checkbox-group id="checkboxes2" class="mt-1" v-model="isDispatch"  @input="seletIsDispatch">
                            <b-form-checkbox :value="1" :unchecked-value="0">需要进入工位看板跟踪进度</b-form-checkbox> 
                        </b-form-checkbox-group>
                    </b-form-group>
                    <b-form-group>
                        <b-form-checkbox-group id="checkboxes2" class="mt-1" v-model="needSku" @input="seletNeedSku">
                            <b-form-checkbox :value="0" :unchecked-value="1">不需要配件</b-form-checkbox> 
                        </b-form-checkbox-group>
                    </b-form-group>
                </b-row>
                <div class="" v-show="needSku != 0">
                    <h5 class="text-primary mr-3">商品信息</h5>
                    <b-row class="mt-2"  v-show="needSku != 0">
                        <div class="col-md-2">
                             <b-form-select :options="skuOrginList"  v-model="skuOrgin" @change="seletSkuOrgin"></b-form-select>
                        </div>
                        <div class="col-md-3" v-show="skuOrgin == '0'">
                             <b-form-select :options="whList"  v-model="whCode" @input="searchParamChange"></b-form-select>
                        </div>
                        <div class="col-md-2" v-show="skuOrgin == '0'">
                             <sku-class-tree  @getSkuClass="getSkuClass" ref="skuSelect2"></sku-class-tree>
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
				<div class="mt-3 pt-3"  v-show="needSku !== 0">
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
                                <b-form-input v-if="data.item.temporary == '1' && !data.item.id" type="number" min="0" @input="inputNums('price', data.item.skuPrice, data.index)" v-model="data.item.skuPrice"  class="input-min-w"/>   
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
                 <div>
                    人工费： {{parseFloat(serviceAllInfo.labourCost)?parseFloat(serviceAllInfo.labourCost).toFixed(2): '0.00'}}元， &nbsp;&nbsp;材料费： {{materialsExpenses}}元，&nbsp;&nbsp;合计： {{totalPrice}}元
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
import selectSearch from 'components/iris-search2.0'
import {SKU_TEMPCODE_SEQ, SERVICE_ORDER_DETAIL_SEQ, OUTSIDE_ORDER_DETAIL_SEQ} from 'common/sequence.js'
Vue.use(Dialog);

Vue.use(Input)

export default {
    components: {
        Pagination,
        skuClassTree,
        serviceTree,
        selectSearch,
    },
    props: {
        orderNo: {
            type: String,
            default: function() {
                return '2222'
            }
        },
        outsideOrderNo: {
            type: String,
            default: function() {
                return ''
            }
        },
        serviceOrderNo: {
            type: String,
            default: function() {
                return ''
            }
        },
        outsideOrderDetailCode: {
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
            outsideTypeList: config.repairOrder.outsideTypeList,
            outsideType: '0',
            supplierApiName: 'supplier.querySupplierList',
            searchSupplierParams: {
                supplierType: "REFD2000178"
            },
            storeApiName: 'storeManage.queryByPage',
            searchStoreParams: {
            },
            supplierData: {},
            storeData: {},
            outsideDesc: '',
            outsideRemark: '',
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
            skuListArr: [],
            brandListArr: [],
            classListArr: [],
            needList: [],
            delNeedList: [],
            // 是否需要配件
            needSku: 0,
            isDispatch: 0,
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
            timer: undefined, // 关键字搜索延时
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
         // 生成工单托外服务明细编码
        createOutsideDetailCodeList(num) {
            const option = {
                'serviceCode': OUTSIDE_ORDER_DETAIL_SEQ,
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
                    detailCode: objClass.detailCode,
                    detailType: objClass.detailType,
                }
            }else {
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
        getOrderOutsideInfo(val) {
            let param = {
                "outsideOrderDetailCode": val,
                "needSku": 1
            }
            return new Promise((resolve, reject) => {
                api.repairOrder.getOutsideOrderDetailInfoByCode(param,res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        resolve(obj);
                    }
                });  
            })  
        },
        resetData() {
            this.needList = [];
            this.outsideType = 0;
            this.outsideDesc = '';
            this.outsideRemark = '';
            this.params.orgName = '';
            this.serviceDisplayName = '';
            this.params.orgName = '';
            this.tempParameter = '';
            this.serviceAllInfo = {};
            this.skuClass = '000001';
            this.skuOrgin = '0'
            this.paginationData.total = 0;
            this.paginationData.totalPages = 1;
            this.paginationData.pageNo = 1;
            this.storeData = {};
            this.supplierData = {};
            this.serviceAllInfo = {};
        },
        showModel() {    
            this.resetData();
            let _this = this;
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
                if(this.serviceCode === this.openServiceInfo.refDetailValue) {
                    this.priceType = '3';
                    this.needSku = 1;
                    this.isDispatch = 1;
                    this.serviceAllInfo.serviceCode = this.serviceCode;
                    this.serviceAllInfo.serviceName = this.openServiceInfo.refDetailName;
                    this.serviceAllInfo.labourHourUnitPrice = this.storeInfo.labourHourUnitPrice;
                    this.search();
                    this.setServiceData();
                }else {
                    Message({
                        message: '服务编码不正确!',
                        type: 'error'
                    });
                }
            })
           
        },
        // 设置页面服务显示数据
        setServiceData() {
            this.dialogPay = true;  
            if(this.outsideOrderDetailCode !== '') {                                
                this.getOrderOutsideInfo(this.outsideOrderDetailCode).then(resl => {
                    this.needSku = resl.needSku;
                    if(this.priceType == '3') {
                        this.outsideType = resl.outsideType;
                        this.outsideDesc = resl.outsideDesc ? resl.outsideDesc : '';
                        this.outsideRemark = resl.outsideRemark ? resl.outsideRemark : '';
                        this.needSku = resl.serviceOrderDetailInfoList[0].needSku;
                        this.isDispatch = resl.serviceOrderDetailInfoList[0].isDispatch;

                        this.serviceAllInfo.outsideId = resl.id;
                        this.serviceAllInfo.serviceId = resl.serviceOrderDetailInfoList[0].id;
                        this.serviceAllInfo.workHours = resl.serviceOrderDetailInfoList[0].actualWorkHours;
                        this.serviceAllInfo.labourHourUnitPrice = resl.serviceOrderDetailInfoList[0].actualWorkHourPrice;
                        this.serviceAllInfo.labourCost = ((parseFloat(this.serviceAllInfo.workHours) ? parseFloat(this.serviceAllInfo.workHours) : 0) * (parseFloat(this.serviceAllInfo.labourHourUnitPrice) ? parseFloat(this.serviceAllInfo.labourHourUnitPrice) : 0)).toFixed(2);
                        this.serviceAllInfo.expectedToTake = resl.serviceOrderDetailInfoList[0].costTime;
                        this.serviceDisplayName = resl.serviceOrderDetailInfoList[0].serviceDisplayName;
                        this.serviceAllInfo.categoryName = resl.serviceOrderDetailInfoList[0].categoryName;
                        this.serviceAllInfo.categoryCode = resl.serviceOrderDetailInfoList[0].categoryCode;
                        this.params.orgName = resl.serviceOrderDetailInfoList[0].categoryName;
                        this.serviceClassCode = resl.serviceOrderDetailInfoList[0].categoryCode;                     
                        if(this.outsideType == '1') {
                            this.storeData.storeCode = resl.supplierCode;
                            this.storeData.storeName = resl.supplierName;
                            this.$refs.storeSelect.setVal(this.storeData.storeName);
                        }else {
                            this.supplierData.supplierCode = resl.supplierCode;
                            this.supplierData.supplierName = resl.supplierName;
                            this.$refs.supplierSelect.setVal(this.supplierData.supplierName);
                        }
                        
                    }
                    this.setNeedList(resl.serviceOrderDetailInfoList[0].skuOrderDetailInfoList);
                    if(resl.serviceOrderDetailInfoList[0].skuOrderDetailInfoList.length > 0 && resl.serviceOrderDetailInfoList[0].skuOrderDetailInfoList[0].skuTempCode) {
                        this.skuOrgin = '1';
                    }else {
                        this.skuOrgin = '0';
                    }
                })
            }else {
                this.$nextTick(() => {
                    this.$refs.storeSelect.setVal('');
                    this.$refs.supplierSelect.setVal('');
                    this.serviceDisplayName = this.serviceAllInfo.serviceName;
                    this.skuOrgin = '0';
                    this.needList = [];
                    this.countTotalPtice();
                })                             
            }                      
        },
        // 确定触发
        addModelAdd() {
            let outsideObj = {};
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
            }
            outsideObj.orderNo = this.orderNo;
            outsideObj.outsideOrderNo = this.outsideOrderNo;
            outsideObj.outsideType = this.outsideType;
            outsideObj.outsideDesc = this.outsideDesc;
            outsideObj.outsideRemark = this.outsideRemark;
            if(this.outsideType == '1') {
                outsideObj.supplierCode = this.storeData.storeCode;
                outsideObj.supplierName = this.storeData.storeName;
            }else {
                outsideObj.supplierCode = this.supplierData.supplierCode;
                outsideObj.supplierName = this.supplierData.supplierName; 
            }
            if(this.serviceAllInfo.outsideId) {
                outsideObj.id = this.serviceAllInfo.outsideId;
            }
            if(outsideObj.supplierCode == undefined || outsideObj.supplierName == undefined) {
                Message({
                    message: '请选择委托单位!',
                    type: 'warning'
                });
                return;
            }
            this.createOutsideDetailCodeList(1).then(resCode1 => {
                if(!this.outsideOrderDetailCode) {
                    outsideObj.outsideOrderDetailCode = resCode1[0];
                }else {
                    outsideObj.outsideOrderDetailCode = this.outsideOrderDetailCode;
                    outsideObj.serviceOrderDetailCode = this.serviceOrderDetailCode;
                }
                serviceObj.orderNo = this.orderNo;
                serviceObj.priceType = this.priceType;
                serviceObj.serviceName = this.serviceAllInfo.serviceName;
                serviceObj.serviceCode = this.serviceAllInfo.serviceCode;
                serviceObj.serviceOrderNo = this.serviceOrderNo;
                serviceObj.categoryCode = this.serviceAllInfo.categoryCode;
                serviceObj.categoryName = this.serviceAllInfo.categoryName;
                serviceObj.actualWorkHours = this.serviceAllInfo.workHours;
                serviceObj.actualWorkHourPrice = this.serviceAllInfo.labourHourUnitPrice;
                serviceObj.costTime = this.serviceAllInfo.expectedToTake;
                serviceObj.serviceDisplayName = this.serviceDisplayName;
                serviceObj.needSku = (this.needSku == 0 ) ? 0 : 1;
                serviceObj.isDispatch = (this.isDispatch == 0 ) ? 0 : 1;
                if(this.serviceAllInfo.serviceId) {
                    serviceObj.id = this.serviceAllInfo.serviceId;
                }
                
                this.createServiceDetailCodeList(1).then(resCode2 => {
                    let onoff = true;
                    if(!this.serviceOrderDetailCode) {
                        serviceObj.serviceOrderDetailCode = resCode2[0];
                        outsideObj.serviceOrderDetailCode = resCode2[0];
                    }else {
                        serviceObj.serviceOrderDetailCode = this.serviceOrderDetailCode;
                    }
                    if(serviceObj.needSku == '1') {
                        if(this.needList.length == 0) {
                            Message({
                                message: '未添加配件信息!',
                                type: 'warning'
                            });     
                            onoff = false;                 
                            return;
                        }
                        this.needList.forEach((item, i) => {                   
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
                                skuStandards: item.skuStandards,
                                unitName: item.checkUnitName,
                                skuModel: item.skuModel,
                                categoryCode: item.categoryCode,
                                nums: item.nums,
                                originalSalesPrice: item.skuPrice,
                                actualSalesPrice: item.actualSalesPrice,
                                serviceOrderNo: this.serviceOrderNo,
                                outsideOrderNo: this.outsideOrderNo,
                                serviceOrderDetailCode: serviceObj.serviceOrderDetailCode,
                                skuOrderNo:  this.skuOrderNo,
                                skuGroupCode:  item.skuGroupCode,
                                relationCodes: item.skuCategoryRelationCodes,
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
                            this.saveDataM(outsideObj, serviceObj, skuList);
                        }                                     
                    }else {
                        if(onoff) {
                            this.saveDataM(outsideObj, serviceObj, skuList);
                        }
                    }
                })
            })                  
        },
        saveDataM(val1, val2, val3) {
             let param = {
                    orderOutsideDetailInfos: [val1],
                    orderOutsideDetailServiceInfos: [val2],
                    orderOutsideDetailServiceSkuInfos: val3,
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
        getSuppler(val) {
            this.supplierData = val;
        },
        getStore(val) {
           this.storeData = val;
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
                getObj.temporary = this.skuOrgin;
                this.needList.push(getObj);
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
                                 for(let [i, item] of this.needList.entries()) {
                                        if(item.skuCode == val.skuCode) {                          
                                            this.needList.splice(i, 1);     
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
                                this.needList.splice(i, 1);                 
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
                // obj.stockUpStatus = parseFloat(obj.availableNums) - parseFloat(obj.nums) >=0 ? '1' : '0';
                obj.stockUpStatus = obj.detailStatus;
                arr.push(obj);
            })
            this.$nextTick(() => {
                this.needList = JSON.parse(JSON.stringify(arr));
                this.countTotalPtice();
           })
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
        checkStrLength(val, name) {
            if(val.length > 120) {
                this[name] = val.substr(0, 120);
            }
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
        seletIsDispatch(val) {
            if(this.serviceOrderDetailCode && val === 0) {
                let param = {
                    serviceOrderDetailCode: this.serviceOrderDetailCode
                }
                api.repairOrder.queryDispatchDetailInfos(param, (res) => {
                    if(res.data.code === 'success') {
                       if(res.data.obj.list.length != 0 && res.data.obj.list[0].dispatchDetailStatus > 1) {
                           let dispatchDetailStatus =  res.data.obj.list[0].dispatchDetailStatus;
                        //    let warnStr = '';
                        //    if(dispatchDetailStatus === 2) {
                        //        warnStr = '施工中';
                        //    }else if(dispatchDetailStatus === 3) {
                        //        warnStr = '已关卡';
                        //    }
                           Message({
                                message: `该服务派工状态已开卡后，无法编辑！`,
                                type: 'warning'
                            }); 
                            this.isDispatch = 1;
                       }
                    };
                })
            }
            
        }
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
.remark-textarea{
    position: relative;
    width: 100%;
    height: 120px;
    resize: none;
}
.hint-text-leng{
    position: absolute;
    right:30px;
    bottom: 8px;
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
.input-min-w{
    width: 90px!important;
}
.td-w-2text{
    width: 60px!important;
}
</style>
 