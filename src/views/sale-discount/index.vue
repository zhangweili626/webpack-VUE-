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
                    <b-form-fieldset horizontal label="单号" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.promotionDiscountOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="提交人" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.confirmOperatorName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="岗位类型" :label-cols="4" class="text-right">
                        <b-form-select :options="postTypeList" v-model="searchModel.postTypeCode" @input="getPostType"></b-form-select>
                    </b-form-fieldset>
                </div>              
                 <div class="col-md-4">
                    <b-form-fieldset horizontal label="适用类型" :label-cols="4" class="text-right">
                        <b-form-select :options="useTypeList" v-model="searchModel.useType"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="单据时间" :label-cols="4" class="text-right">
                        <el-date-picker
                                v-model.trim="searchModel.noDate"
								type="daterange"
								:clearable="true"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
						</el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="岗位编码/名称" :label-cols="4" class="text-right">
                        <select-search @getValue="getPost" :params="postParam" :apiName="postApiName" :name2="'postCode'" :name1="'postName'" ref="postSelect"></select-search>
                        <!-- <b-form-select :options="approStatus" v-model="searchModel.postCode"></b-form-select> -->
                    </b-form-fieldset>
                </div>
                <!-- <div class="col-md-4">
                    <b-form-fieldset horizontal label="岗位名称" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.postName"/>
                    </b-form-fieldset>
                </div> -->
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="提交时间" :label-cols="4" class="text-right">
                        <el-date-picker
                                v-model.trim="searchModel.confirmTime"
								type="daterange"
								:clearable="true"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
						</el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="审批状态" :label-cols="4" class="text-right">
                        <b-form-select :options="approStatus" v-model="searchModel.wfStatus"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="人员编码/名称" :label-cols="4" class="text-right">
                        <select-search @getValue="getEmp" :params="empParam" :apiName="empApiName" :name2="'empCode'" :name1="'empCnName'"  ref="empSelect"></select-search>
                        <!-- <b-form-input v-model.trim="searchModel.empCode"/> -->
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="折扣类型" :label-cols="4" class="text-right">
                        <b-form-select :options="discountTypeList" v-model="searchModel.discountType"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="有效日期" :label-cols="4" class="text-right">
                         <el-date-picker
                                v-model.trim="searchModel.date"
								type="daterange"
								:clearable="true"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
						</el-date-picker>
                    </b-form-fieldset>
                </div>     
                <!-- <div class="col-md-4">
                    <b-form-fieldset horizontal label="人员名称" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.empName"/>
                    </b-form-fieldset>
                </div>             -->
            </div>
            <query-btn-group @resetClick="reset" @query="search"></query-btn-group>
        </b-card>
         <b-card>
            <div class="row">              
                <div class="col-md-6">
                    <b-button size="sm" variant="success" @click="add" v-if="isEditSaleDiscount">新建</b-button>
                    <b-button size="sm" variant="primary" @click="eidt" v-if="isAddSaleDiscount">编辑</b-button>                                
                </div>
            </div>
            <div class="table-scrollable mb-2 service-manhour">
                <b-table striped hover bordered show-empty empty-text="暂无数据" :items="saleDiscountList" :fields="fields">
                    <template slot="promotionDiscountOrderNo" slot-scope="data">
                        <a href="javascript:;" @click.prevent="detail(data.item)">{{data.value }}</a>
                    </template>
                    <template slot="wfStatus" slot-scope="data">
                        <span v-if="data.item.wfStatus == -1">待提交</span>
                        <span v-if="data.item.wfStatus == 0">已提交</span>
                        <span v-if="data.item.wfStatus == 1">审批通过</span>
                        <span v-if="data.item.wfStatus == -2">撤销</span>
                    </template>
                    <template slot="postName" slot-scope="data">
                       {{data.value | strFilter}}
                    </template>
                    <template slot="endDate" slot-scope="data">
                       {{ data.item.startDate + '-' + data.value}}
                    </template>
                    <template slot="discountType" slot-scope="data">
                       {{data.value | discountTypeFliter}}
                    </template>
                    <template slot="discountValue" slot-scope="data">
                       {{data.value }}
                    </template>
                    <template slot="useType" slot-scope="data">
                       {{data.value | useTypeFliter}}
                    </template>
                    <template slot="serviceSort" slot-scope="data">
                       <span :title="data.value">{{ data.value | strEllipsisFilter}}</span>
                    </template>
                    <template slot="serviceCode" slot-scope="data">
                       <span :title="data.value">{{ data.value | strEllipsisFilter}}</span>
                    </template>
                    <template slot="service" slot-scope="data">
                       <span :title="data.value">{{ data.value | strEllipsisFilter}}</span>
                    </template>
                    <template slot="skuSort" slot-scope="data">
                       <span :title="data.value">{{ data.value | strEllipsisFilter}}</span>
                    </template>
                    <template slot="skuCode" slot-scope="data">
                       <span :title="data.value">{{ data.value | strEllipsisFilter}}</span>
                    </template>
                    <template slot="sku" slot-scope="data">
                       <span :title="data.value">{{ data.value | strEllipsisFilter}}</span>
                    </template>
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
import {PROMOTION_DISCOUNT_ORDER_SEQ} from 'common/sequence.js'
import {POSITION_TYPE} from 'common/ref-code.js'
import {hasBtn} from 'common/api-common.js'
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'
import selectSearch from './selectSearch'

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);

export default {
    components: {
       QueryBtnGroup,
       Pagination,
       AreaTree,
       selectSearch,
    },
    data() {
        return {
            columW: config.demandOrder.columW,
            approStatus: config.purchaseContract.approStatus,
            postTypeList: [],
            useTypeList: config.saleDiscount.useTypeList,
            discountTypeList: config.saleDiscount.discountTypeList,
            orderStatusList: config.cardPay.orderStatusList,
            selCont:'',
            paginationData: {
                total: 0,
                totalPages: 1,
                pageNo: 1,
                pageSize: config.pageNums
            },
            postParam: {
                storeCode: '',
                postTypeCode: '',
            },
            postApiName:'saleDiscount.getStoreAllPost',
            empParam: {
                storeCode: '',
                postCode: '',
            },
            empApiName:'saleDiscount.getStorePostEmp',
            searchModel: {
                promotionDiscountOrderNo: '',
                confirmOperatorName: '',
                postTypeCode: '',
                noDate: '',
                noStartTime: '',
                noEndTime: '',
                storeCodes: '',
                useType: null,
                postCode: '',
                postName: '',
                confirmTime: '',
                confirmStartTime: '',
                confirmEndTime: '',
                wfStatus: '',
                discountType: '',
                empCode: '',
                empName: '',
                date: '',
                startDate: '',
                endTDate: '',
            },
            fields: {
                radio: {
                    label: '选择'
                },
                promotionDiscountOrderNo: {
                    label: '单号'
                },
                wfStatus: {
                    label: '审批状态'
                },
                updateName: {
                    label: '最后操作人'
                },
                confirmOperatorName: {
                    label: '提交人'
                },
                createTimeStr: {
                    label: '单据时间'
                },
                storeName: {
                    label: '门店'
                },
                endDate: {
                    label: '有效期'
                },
                postTypeName: {
                    label: '岗位类型'
                },
                postName: {
                    label: '岗位名称'
                },
                empName: {
                    label: '人员名称'
                },
                discountType: {
                    label: '折扣类型'
                },
                discountValue: {
                    label: '折扣权限'
                },
                useType: {
                    label: '适用类型'
                },
                serviceSort: {
                    label: '服务分类'
                },
                serviceCode: {
                    label: '服务编码'
                },
                service: {
                    label: '服务名称'
                },
                skuSort: {
                    label: '商品分类'
                },
                skuCode: {
                    label: '商品编码'
                },
                sku: {
                    label: '商品名称'
                },
                
            },
        }
    },
    computed: {
        ...mapState('saleDiscount',[
				'saleDiscountList',
				'searchParam',
				'pages'
            ]),
        isEditSaleDiscount(){
				return hasBtn(collectionApi.saleDiscount.insertPromotionDiscountOrderInfo);
            },
        isAddSaleDiscount(){
				return hasBtn(collectionApi.saleDiscount.updatePromotionDiscountOrderInfo);
			},
    },
    created() {
        this.getPostTypeList();
    },
    methods: {
        ...mapActions('saleDiscount',[
				'setTableList',
				'setSearchParam',
				'setPages',
                'geSaleDiscountList',
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
                        _this.postTypeList = arr;
                    }
                })		
            },
        // 生成促销折扣单号
		createOrder() {
				const option = {
					'serviceCode': PROMOTION_DISCOUNT_ORDER_SEQ,			
                }
				return new Promise((reslove,reject) => {
					api.ordinalInfo.getSequence(option, (res) => {
						if(res.data.code === 'success') {							
							reslove(res.data.obj)
						};
					})
				})				
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
                _this.searchModel.storeCodes = [data1.value];
                 this.postParam.storeCode = data1.value;
                 this.empParam.storeCode = data1.value;
            }
        },
        getPostType(val) {
            this.postParam.postTypeCode = val;
        },
        getPost(val) {
            this.searchModel.postCode = val.postCode;
            this.empParam.postCode = val.postCode;
        },
        getEmp(val) {
            this.searchModel.empCode = val.empCode;
        },
        reset() {
           for(let key of Object.keys(this.searchModel)) {
               this.searchModel[key] = '';
           }
           this.searchModel.useType = null;
            this.$refs.areaqueryshop.reset();
            this.$refs.areaqueryshop.resetToStart();
            this.paginationData.total = 0;
            this.paginationData.totalPages = 0;
        },
        search(pageNo){
            pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
            let param = Object.assign({}, this.searchModel);
            param.noStartTime = common.eleTimeFormat(this.searchModel.noDate[0]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.noDate[0]);
            param.noEndTime = common.eleTimeFormat(this.searchModel.noDate[1]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.noDate[1]);
            param.confirmStartTime = common.eleTimeFormat(this.searchModel.confirmTime[0]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.confirmTime[0]);
            param.confirmEndTime = common.eleTimeFormat(this.searchModel.confirmTime[1]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.confirmTime[1]);
            param.startDate = common.eleTimeFormat(this.searchModel.date[0]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.date[0]);
            param.endDate = common.eleTimeFormat(this.searchModel.date[1]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.date[1]);
            param.pageNums = this.paginationData.pageSize;
            param.pageStart = this.paginationData.pageNo;
            delete param.noDate;
            delete param.confirmTime;
            delete param.date;
            this.setSearchParam(param);
            this.geSaleDiscountList(param);
        },
        add() {
            this.createOrder().then((res) => {
                this.$router.push({name: 'sale-discount-add', query: {promotionDiscountOrderNo: res,onlySee: false}}); 
            })           
        },
        eidt() {
            if(this.selCont === "") {
                Message({
                    message: '未选择促销折扣单!',
                    type: 'warning'
                });
            }else {
                this.$router.push({name: 'sale-discount-eidt', query: {promotionDiscountOrderNo: this.selCont.promotionDiscountOrderNo, onlySee: false}}); 
            }
        },
        detail(val) {
             this.$router.push({name: 'sale-discount-detail', query: {promotionDiscountOrderNo: val.promotionDiscountOrderNo, onlySee: true}}); 
        },
    },
    filters:{
       useTypeFliter(val) {    
           if(val && val.length != 0) {
                let strArr = [];
                let arr = val.split(',');
                for(let [i,item] of arr.entries()) {
                    if(item == 0) {
                        strArr.push('全场');
                    }else if(item == 1) {
                        strArr.push('人工费');
                    }else if(item == 2) {
                        strArr.push('商品');
                    }
                }
                return strArr.join('，');
           }   
       },
       numFliter(val) {    
           if(val && val.length != 0) {           
                let strArr = [];
                let arr = val.split(',');
                for(let [i,item] of arr.entries()) {
                    strArr.push(parseFloat(item).toFixed(2));
                }
                return strArr.join('，');
           }   
       },
       discountTypeFliter(val) {
           if(val && val.length != 0) {
                let strArr = [];
                let arr = val.split(',');
                for(let [i,item] of arr.entries()) {
                    if(item == 0) {
                        strArr.push('固定金额');
                    }else if(item == 1) {
                        strArr.push('百分比');
                    }
                }
                return strArr.join('，');
           }   
       },
       strEllipsisFilter(val) {
           if(val && val.length != 0) {
                val = val.toString();
                let strArr = [];
                let arr = val.split(',');             
                if(arr.length > 3) {
                    for(let i = 0; i < 2; i++) {
                        strArr.push(arr[i]);
                    }                 
                    strArr.push('...');
                    return strArr.join('，');
                }else{
                    return val;
                }
           }
       },
       strFilter(val) {
           if(val && val.length != 0) {
                let arr = val.split(',');              
                return arr.join('，');
           }
       }
    }
}
</script>
<style>

</style>
