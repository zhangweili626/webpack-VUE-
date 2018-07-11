<template>
    <div class="animated fadeIn">
        <b-card header="查询">
             <div class="row">    
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="门店" :label-cols="4" class="text-right">
                        <AreaTree @select-change="selectedfun" ref="areaqueryshop" :storeAll='true'></AreaTree>
                    </b-form-fieldset>
                 </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单业务类型" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.purchaseReturnOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单来源" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.purchaseReturnOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="单据创建日期" :label-cols="4" class="text-right">
                        <el-date-picker
                                v-model.trim="searchModel.createDate"
								type="daterange"
								:clearable="true"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
						</el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单结算时间" :label-cols="4" class="text-right">
                        <el-date-picker
                                v-model.trim="searchModel.createDate"
								type="daterange"
								:clearable="true"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
						</el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单状态" :label-cols="4" class="text-right">
                        <b-form-select :options="purchaseReturnOrderTypeList" v-model="searchModel.purchaseReturnOrderType" disabled></b-form-select>
                    </b-form-fieldset>
                </div>              
                 <div class="col-md-4">
                    <b-form-fieldset horizontal label="订单来源单号" :label-cols="4" class="text-right">
                         <select-search @getValue="getSuppler" :params="supplierParam" :apiName="supplierApiName" :name1="'supplierName'" ref="supplierSelect"></select-search>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="客户手机号" :label-cols="4" class="text-right">
                        <b-form-select :options="selectObj" v-model="searchModel.orderStatus"></b-form-select>
                    </b-form-fieldset>
                </div>             
                <div class="col-md-4" v-show="false">
                    <b-form-fieldset horizontal label="车牌" :label-cols="4" class="text-right">
                        <b-form-select :options="approStatus" v-model="searchModel.wfStatus"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="" class="text-left">
                        <b-form-group>
                            <b-form-checkbox-group id="checkboxes2" class="mt-1">
                                <b-form-checkbox value="1">保护临时车</b-form-checkbox>
                            </b-form-checkbox-group>
                        </b-form-group>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="支付状态" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.purchaseReturnOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="客户姓名" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.purchaseReturnOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="VIN" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.purchaseReturnOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="开单人" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.purchaseReturnOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="使用卡号" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.purchaseReturnOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="使用劵号" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.purchaseReturnOrderNo"/>
                    </b-form-fieldset>
                </div>
            </div>
            <query-btn-group @resetClick="reset" @query="search"></query-btn-group>
        </b-card>
         <b-card>
            <div class="row">              
                <div class="col-md-6">
                    <b-button size="sm" variant="success" @click="add" v-if="isEditPurchaseReturn">新建</b-button>
                    <b-button size="sm" variant="primary" @click="eidt" v-if="isAddPurchaseReturn">编辑</b-button>                                
                    <b-button size="sm" variant="primary" @click="test">测试</b-button>                                
                    <b-button size="sm" variant="primary" @click="test2">测试2</b-button>                                
                    <b-button size="sm" variant="primary" @click="test3">测试3</b-button>                                
                </div>
            </div>
            <div class="table-scrollable mb-2 service-manhour">
                <b-table striped hover bordered show-empty empty-text="暂无数据" :items="workOrderList" :fields="fields">
                    <template slot="radio" slot-scope="data">
                        <input type="radio" name="radio" v-model="selCont" :value="data.item"/>
                    </template> 
                </b-table>
            </div>
            <div class="row"> 
                <div class="col-md-12">
                    <pagination class="pull-right" 
                    @page-change="search" 
                    :page-no="pages.pageNo" 
                    :page-size="paginationData.pageSize" 
                    :total-pages="pages.totalPages" 
                    :total-result="pages.total">
                    </pagination>
                </div>
            </div>
         </b-card>
         <sku-modal ref="skuModal"></sku-modal>
         <service-modal ref="serviceModal"></service-modal>
         <entrust-modal ref="entrustModal"></entrust-modal>
    </div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import Pagination from 'components/pagination/pagination'
import AreaTree from 'components/iris-areaqueryshop/index'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import {Table, TableColumn, Message, DatePicker } from "element-ui"
import common from 'common/common.js'
import {RETURN_TO_SUPPLIEROR_DER_SEQ} from 'common/sequence.js'
import {POSITION_TYPE} from 'common/ref-code.js'
import {hasBtn} from 'common/api-common.js'
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'
import filters from 'common/filters'
import selectSearch from '../sale-discount/selectSearch'
import skuModal from './skuModal.vue'
import serviceModal from './serviceEditModal.vue'
import entrustModal from './entrustEditModal.vue'

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);

export default {
    components: {
       QueryBtnGroup,
       Pagination,
       AreaTree,
       selectSearch,
       skuModal,
       serviceModal,
       entrustModal,
    },
    data() {
        return {
            columW: config.demandOrder.columW,
            approStatus: config.purchaseContract.approStatus,
            purchaseReturnOrderTypeList: config.purchaseReturn.purchaseReturnOrderTypeList,
            orderStatusList: config.purchaseReturn.orderStatusList,
            selCont:'',
            paginationData: {
                total: 0,
                totalPages: 1,
                pageNo: 1,
                pageSize: config.pageNums
            },
            searchModel: {
                storeCodes: [],
                purchaseReturnOrderNo: '',
                createDate: '',
                orderStatus: '',
                purchaseReturnOrderType: '1',
                supplierCode: '',
                wfStatus: '',
                returnDate: '',
            },
            supplierParam: {
                supplyType: '1',
            },
            supplierApiName:'supplier.querySupplierList',
            fields: {
                radio: {
                    label: '选择'
                },
                purchaseReturnOrderNo: {
                    label: '订单单号'
                },
                orderStatus: {
                    label: '单据状态'
                },
                purchaseReturnOrderType: {
                    label: '门店状态'
                },
                storeName: {
                    label: '开单人'
                },
                supplierName: {
                    label: '客户姓名'
                },
                totalNums: {
                    label: '客户类型'
                },
                totalMoney: {
                    label: '手机'
                },
                createBy: {
                    label: '车牌'
                },
                createTimeStr: {
                    label: '车型'
                },
                estimatedReturnDate: {
                    label: '订单金额'
                },
                auditPassTime: {
                    label: '支付状态'
                },
                actualReturnDate: {
                    label: '是否开票'
                },
                a: {
                    label: '订单创建时间'
                },
                b: {
                    label: '订单结算时间'
                },
                c: {
                    label: '订单来源'
                },
                d: {
                    label: '订单来源单号'
                },
                e: {
                    label: '检查单'
                },
            },
        }
    },
    computed: {
        ...mapState('workOrder',[
				'workOrderList',
				'searchParam',
				'pages'
            ]),
        isEditPurchaseReturn(){
				return hasBtn(collectionApi.purchaseReturn.insertPurchaseReturnOrderInfo);
            },
        isAddPurchaseReturn(){
				return hasBtn(collectionApi.purchaseReturn.updatePurchaseReturnOrderInfo);
            },
        selectObj() {
            let arr = [
                {
                    value: 'rr',
                    text: 'rr'
                },
                {
                    value: 'aa',
                    text: 'aa'
                },
            ];
            return arr;
        }
    },
    created() {
        this.getPostTypeList();
    },
    methods: {
        ...mapActions('workOrder',[
				'setTableList',
				'setSearchParam',
				'setPages',
                'getWorkOrderList',
            ]),
        getUserInfo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            let storeInfoVo = userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
            this.userInfo = userInfo;
            this.storeInfoVo = storeInfoVo;
        },
        // 获取岗位类型
		getPostTypeList() {
				let _this = this;
                const option = {
                    'refCode': POSITION_TYPE
                }
                api.ref.getDataDictionarys(option, (res) => {
                    if (res.data.code === 'success') {
                        let data = res.data.obj.referenceDetailInfos;
                        let arr = [{
                            value: '',
                            text: ''
                        }]
                        data.forEach((item, index) => {
                            let obj = {
                                value: item.refDetailCode,
                                text: item.refDetailName
                            }
                            arr.push(obj);
                        })
                        return arr;
                        // _this.postTypeList = arr;
                    }
                })		
            },
        // 生成促销折扣单号
		createOrder() {
				const option = {
					'serviceCode': RETURN_TO_SUPPLIEROR_DER_SEQ,			
                }
				return new Promise((reslove,reject) => {
					api.ordinalInfo.getSequence(option, (res) => {
						if(res.data.code === 'success') {							
							reslove(res.data.obj)
						};
					})
				})				
            },
        // 获取供应商
        getSuppler(val) {
            this.searchModel.supplierCode = val.supplierCode;
        },
        //区域选择门店
        selectedfun(data, data1) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            if(data1 instanceof Array){
                _this.searchModel.storeCodes = []
                for (let i = 0; i < data1.length; i++) {
                    _this.$set(_this.searchModel.storeCodes, i, data1[i].value)              
                }
            }else{
                options.storeCodeSet.push(data1.value);
                _this.searchModel.storeCodes = [data1.value]
            }
        },
        reset() {
           for(let key of Object.keys(this.searchModel)) {
               this.searchModel[key] = '';
           }
            this.searchModel.purchaseReturnOrderType = '1';
            this.$refs.areaqueryshop.reset();
            this.$refs.supplierSelect.clear();
            this.$refs.areaqueryshop.resetToStart();
            this.paginationData.total = 0;
            this.paginationData.totalPages = 0;
        },
        search(pageNo){
            pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
            let param = Object.assign({}, this.searchModel);
            param.returnTimeStart = common.eleTimeFormat(this.searchModel.returnDate[0]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.returnDate[0]);
            param.returnTimeEnd = common.eleTimeFormat(this.searchModel.returnDate[1]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.returnDate[1]);
            param.createTimeStart = common.eleTimeFormat(this.searchModel.createDate[0]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.createDate[0]);
            param.createTimeEnd = common.eleTimeFormat(this.searchModel.createDate[1]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.createDate[1]);
            param.pageNums = this.paginationData.pageSize;
            param.pageStart = this.paginationData.pageNo;
            delete param.returnDate;
            delete param.createDate;
            if( param.createTimeStart == '') {
                  delete param.createTimeStart;
            }
            if( param.returnTimeEnd == '') {
                  delete param.returnTimeEnd;
            }
            this.setSearchParam(param);
            this.getWorkOrderList(param);
        },
        add() {
            this.createOrder().then((res) => {
                this.$router.push({name: 'purchase-return-add', query: {purchaseReturnOrderNo: res,onlySee: false}}); 
            })           
        },
        eidt() {
            if(this.selCont === "") {
                Message({
                    message: '未选择采购退货单!',
                    type: 'warning'
                });
            }else {
                this.$router.push({name: 'purchase-return-eidt', query: {purchaseReturnOrderNo: this.selCont.purchaseReturnOrderNo, onlySee: false}}); 
            }
        },
        detail(val) {
             this.$router.push({name: 'purchase-return-detail', query: {purchaseReturnOrderNo: val.purchaseReturnOrderNo, onlySee: true}}); 
        },
        test() {
            this.$refs.skuModal.showModel();
        },
        test2() {
            this.$refs.serviceModal.showModel();
        },
        test3() {
            this.$refs.entrustModal.showModel();
        },
    },
    filters:{
       purchaseReturnOrderTypeFliter(val) {    
           if(val == '0') {
               return '整车订单'
           }else if(val == '1') {
                return '非整车订单'
           }
       },
    }
}
</script>
<style>

</style>
