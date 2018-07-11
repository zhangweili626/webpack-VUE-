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
                    <b-form-fieldset horizontal label="客户手机" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.custMobile"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="预约创建时间" :label-cols="4" class="text-right">
                        <el-date-picker
                                v-model.trim="searchModel.bookCreate"
								type="daterange"
								:clearable="true"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
						</el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="预约单号" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.bookOrderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="客户姓名" :label-cols="4" class="text-right">
                         <b-form-input v-model.trim="searchModel.custName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="预约确认时间" :label-cols="4" class="text-right">
                        <el-date-picker
                                v-model.trim="searchModel.bookingConfirm"
								type="daterange"
								:clearable="true"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
						</el-date-picker>
                    </b-form-fieldset>
                </div>              
                 <div class="col-md-4">
                    <b-form-fieldset horizontal label="维修工单号" :label-cols="4" class="text-right">
                         <b-form-input v-model.trim="searchModel.orderNo"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="车牌" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.custPlates"/>
                    </b-form-fieldset>
                </div>             
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="预计交车时间" :label-cols="4" class="text-right">
                        <el-date-picker
                                v-model.trim="searchModel.bookingClosing"
								type="daterange"
								:clearable="true"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
						</el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="预约状态" :label-cols="4" class="text-right">
                       <b-form-select :options="bookOrderStatusList" v-model="searchModel.bookOrderStatus"></b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="临时车牌" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="searchModel.plateNumberTmp"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="预约来源" :label-cols="4" class="text-right">
                        <b-form-select :options="channelTypeList" v-model="searchModel.channelTypeCode"></b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
            <query-btn-group @resetClick="reset" @query="search"></query-btn-group>
        </b-card>
         <b-card>
            <div class="row">              
                <div class="col-md-6">
                    <b-button size="sm" variant="success" @click="add" v-if="isAddAppointement">新建</b-button>
                    <b-button size="sm" variant="primary" @click="eidt" v-if="isEditAppointement">编辑</b-button>                                                              
                </div>
            </div>
            <div class="table-scrollable mb-2 service-manhour">
                <b-table striped hover bordered show-empty empty-text="暂无数据" :items="tableList" :fields="fields">
                    <template slot="radio" slot-scope="data">
                        <input type="radio" name="radio" v-model="selCont" :value="data.item"/>
                    </template> 
                    <template slot="bookOrderNo" slot-scope="data">
                       <a href="javascript:;" @click.prevent="detail(data.item)">{{data.value }}</a>
                    </template>
                    <template slot="channelTypeName" slot-scope="data">
                       {{data.value}}
                    </template> 
                    <template slot="actualAmountTotal" slot-scope="data">
                       {{parseFloat(data.value)? parseFloat(data.value).toFixed(2) : ''}}
                    </template>
                    <template slot="bookOrderStatus" slot-scope="data">
                       {{data.value | bookOrderStatusFliter}}
                    </template>
                    <template slot="orderStatus" slot-scope="data">
                        <span v-if="data.item.isCancel == 1">作废</span>
                        <span v-else>
                            <span v-if="data.item.closingFlag === 0">未交车</span>
                            <span v-if="data.item.closingFlag === 1">已交车</span>
                        </span>
                    </template>
                    <template slot="checkOrder" slot-scope="data">
                        <span  v-if="!!data.item.precheckOrderNo">
                            <a :href="'/precheck?No=' + data.item.precheckOrderNo">{{data.value }}</a>
                        </span>
                    </template>
                    <template slot="operation" slot-scope="data">
                         <b-button v-if="data.item.isCancel == 0" size="sm" variant="danger" class="" @click="cancelBookOrder(data.item)">作废</b-button>
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
import {Table, TableColumn, Message, MessageBox, DatePicker } from "element-ui"
import common from 'common/common.js'
import {RETURN_TO_SUPPLIEROR_DER_SEQ} from 'common/sequence.js'
import {CHANNEL_CODE} from 'common/ref-code.js'
import {hasBtn} from 'common/api-common.js'
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'
import filters from 'common/filters'
import selectSearch from '../sale-discount/selectSearch'


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
            bookOrderStatusList: config.appointment.bookOrderStatusList,
            orderStatusList: config.appointment.orderStatusList,
            channelTypeList: [],
            selCont:'',
            paginationData: {
                total: 0,
                totalPages: 1,
                pageNo: 1,
                pageSize: config.pageNums
            },
            searchModel: {
                storeCodeSet: [],
                custMobile: '',
                bookCreate: '',
                bookCreateStart: '',
                bookCreateEnd: '',
                bookOrderNo: '',
                custName: '',
                bookingConfirm: '',
                bookingConfirmStart: '',
                bookingConfirmEnd: '',
                orderNo: '',
                custPlates: '',
                bookingClosing: '',
                bookingClosingStart: '',
                bookingClosingEnd: '',
                bookOrderStatus: '',
                plateNumberTmp: '',
                channelTypeCode: '',
            },
            fields: {
                radio: {
                    label: '选择'
                },
                channelTypeName: {
                    label: '预约来源'
                },
                bookOrderNo: {
                    label: '预约单号'
                },
                bookOrderStatus: {
                    label: '预约状态'
                },
                orderNo: {
                    label: '维修工单号'
                },
                salesEmpName: {
                    label: '预约受理人'
                },
                custName: {
                    label: '客户姓名'
                },
                custTypeName: {
                    label: '客户类型'
                },
                custMobile: {
                    label: '手机'
                },
                custPlates: {
                    label: '车牌'
                },
                carName: {
                    label: '车型'
                },
                actualAmountTotal: {
                    label: '结算金额'
                },
                orderStatus: {
                    label: '订单状态'
                },
                closingDate: {
                    label: '结算时间'
                },
                checkOrder: {
                    label: '检查单'
                },
                operation: {
                    label: '操作'
                },
            },
        }
    },
    computed: {
        ...mapState('appointment',[
				'tableList',
				'searchParam',
				'pages'
            ]),
        isEditAppointement(){
                return hasBtn(collectionApi.appointment.insertOrUpdateBookOrderInfo);
            },
        isAddAppointement(){
				return hasBtn(collectionApi.appointment.updateBookOrderInfo);
            },
    },
    created() {
        this.getChannelTypeList();
    },
    methods: {
        ...mapActions('appointment',[
				'setTableList',
				'setSearchParam',
				'setPages',
                'getAppointmentOrderList',
            ]),
        getUserInfo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            let storeInfoVo = userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
            this.userInfo = userInfo;
            this.storeInfoVo = storeInfoVo;
        },
        // 获取来源渠道
		getChannelTypeList() {
				let _this = this;
                const option = {
                    'refCode': CHANNEL_CODE
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
                        _this.channelTypeList = arr;
                    }
                })		
            },
        //区域选择门店
        selectedfun(data, data1) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            if(data1 instanceof Array){
                _this.searchModel.storeCodeSet = []
                for (let i = 0; i < data1.length; i++) {
                    _this.$set(_this.searchModel.storeCodeSet, i, data1[i].value)              
                }
            }else{
                options.storeCodeSet.push(data1.value);
                _this.searchModel.storeCodeSet = [data1.value]
            }
        },
        reset() {
           for(let key of Object.keys(this.searchModel)) {
               this.searchModel[key] = '';
           }
            this.$refs.areaqueryshop.reset();
            this.$refs.areaqueryshop.resetToStart();
            this.paginationData.total = 0;
            this.paginationData.totalPages = 0;
        },
        search(pageNo){
            pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
            let param = Object.assign({}, this.searchModel);
            param.bookCreateStart = common.eleTimeFormat(this.searchModel.bookCreate[0]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.bookCreate[0]);
            param.bookCreateEnd = common.eleTimeFormat(this.searchModel.bookCreate[1]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.bookCreate[1]);
            param.bookingConfirmStart = common.eleTimeFormat(this.searchModel.bookingConfirm[0]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.bookingConfirm[0]);
            param.bookingConfirmEnd = common.eleTimeFormat(this.searchModel.bookingConfirm[1]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.bookingConfirm[1]);
            param.bookingClosingStart = common.eleTimeFormat(this.searchModel.bookingClosing[0]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.bookingClosing[0]);
            param.bookingClosingEnd = common.eleTimeFormat(this.searchModel.bookingClosing[1]) == '1970-01-01' ? '': common.eleTimeFormat(this.searchModel.bookingClosing[1]);
            param.pageNums = this.paginationData.pageSize;
            param.pageStart = this.paginationData.pageNo;
            delete param.bookCreate;
            delete param.bookingConfirm;
            delete param.bookingClosing;
            this.setSearchParam(param);
            this.getAppointmentOrderList(param);
        },
        add() {
            this.$router.push({name: 'appointment-edit'});        
        },
        eidt() {
            if(this.selCont === "") {
                Message({
                    message: '未选择预约单号!',
                    type: 'warning'
                });
            }else {
                this.$router.push({name: 'appointment-edit', query: {bookOrderNo: this.selCont.bookOrderNo, status: 'edit'}}); 
            }
        },
        detail(val) {
             this.$router.push({name: 'appointment-edit', query: {bookOrderNo: val.bookOrderNo, status: 'see'}}); 
        },
        cancelBookOrder(val) {
                MessageBox.confirm('确定作废吗?', '提示', {
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {			
                    let param = {
                            bookOrderInfoVo:{
                                bookOrderNo: val.bookOrderNo,
                            }
                        }
                    api.appointment.cancelBookOrderInfo(param, res => {
                            if (res.data.code === "success") {
                                Message({
                                    type: "success",
                                    message: "作废成功"
                                });
                                this.search();
                            }
                        });  
                }).catch(() => {});
        },
    },
    filters:{
      bookOrderStatusFliter(val) {    
          if(val === 0){
              return '待确认';
          }else if(val === 1){
              return '已确认';
          }
       },
       orderStatusFliter(val) {    
        //    for(let [i, item] of this.orderStatusList.entries()) {
        //        if(item.value === val) {
        //            return item.text;
        //        }
        //    }
       },
    }
}
</script>
<style>

</style>
