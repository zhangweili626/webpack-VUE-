<template>
    <div class="back-card">
        <b-card :header="`单号：${promotionDiscountOrderNo}&nbsp;&nbsp;操作人：${userInfo.empVo.empCnName}`">
		   <div class="row mt-2">
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="门店" :label-cols="4" class="text-right">
                        <AreaTree @select-change="selectedfun" ref="areaqueryshop" :storeAll='true' :class="{'inp-invalid' : inp.storeCode, 'text-left': true}" :readonly="isHeadSave"></AreaTree>
                    </b-form-fieldset>
                 </div>
                 <div class="col-md-4">
                    <b-form-fieldset horizontal label="有效日期" :label-cols="4" class="text-right">
                        <el-date-picker
                                :disabled="isHeadSave"
                                v-model="headData.date"
                                :class="{'inp-invalid' : inp.date}"
								type="daterange"
								:clearable="true"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
						</el-date-picker>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="提交人" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="headData.confirmOperatorName" disabled/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="提交时间" :label-cols="4" class="text-right">
                        <b-form-input  v-model="headData.confirmOperatorTime" disabled></b-form-input>
                    </b-form-fieldset>
                </div>              
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="审批人" :label-cols="4" class="text-right">
                        <b-form-input v-model="headData.auditPassOperatorName" disabled></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="审批时间" :label-cols="4" class="text-right">
                        <b-form-input  v-model="headData.auditPassTime" disabled></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-12">
                    <b-form-fieldset horizontal label="备注" :label-cols="1" class="text-right ml-3">
                        <b-form-input  v-model="headData.remark" :disabled="isHeadSave"></b-form-input>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mt-3">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="cancel" v-show="true">取消</b-button>
                        <b-button size="sm" variant="success" @click="saveData" v-show=" isBtnSave" v-if="isAddSaleDiscount">保存</b-button>
                        <b-button size="sm" variant="warning" @click="eidtHead" v-show="isBtnEidt">修改</b-button>
                        <b-button size="sm" variant="danger" @click="repealOrder" v-show="isBtnRepeal"  v-if="isRepealSaleDiscount">撤销</b-button>
                        <b-button size="sm" variant="danger" @click="InvalidOrder" v-show="isBtnInvalid"  v-if="isInvailSaleDiscount">作废</b-button>
                        <b-button size="sm" variant="primary" @click="submitOrder" v-show="isBtnSumbit"  v-if="isSubmitSaleDiscount">提交审批</b-button>
                    </div>
                </div>
            </div>
		</b-card>
        <el-tabs type="border-card" v-show="isHeadSave">
            <el-tab-pane label="折扣明细">
                <div class="animated fadeIn">
                    <div class="row">              
                        <div class="col-md-6">
                            <b-button size="sm" variant="danger" @click="delOrderDetail" v-show="isEidtDetail" v-if="isEidtSaleDiscountDetail">删除</b-button>
                            <b-button size="sm" variant="success" @click="addDetailModelShow" v-show="isEidtDetail" v-if="isEidtSaleDiscountDetail">添加</b-button>                                
                        </div>
                    </div>
                    <div class="table-scrollable mb-2 service-manhour">
                        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="tabeList" :fields="fields">
                            <template slot="sel" slot-scope="data">
                                <input type="radio" name="radio2"  v-model="detailSel" :value="data.item" :disabled="onlySee"/>
                            </template>
                            <template slot="useType" slot-scope="data">
                                <span v-if="data.item.useType == 0">全场</span>
                                <span v-if="data.item.useType == 1">人工费</span>
                                <span v-if="data.item.useType == 2">商品</span>
                            </template>
                            <template slot="discountType" slot-scope="data">
                                <span v-if="data.item.orderStatus == 0">固定金额</span>
                                <span v-if="data.item.orderStatus == 1">百分比</span>
                            </template>
                            <template slot="discountType" slot-scope="data">
                                <span v-if="data.item.discountType == 1">百分比</span>
                                <span v-if="data.item.discountType == 0">固定金额</span>
                            </template>
                            <template slot="discountValue" slot-scope="data">
                                <span v-if="data.item.discountType == 1">{{100 - parseFloat(data.value)*100 + '%'}}</span>
                                <span v-if="data.item.discountType == 0">{{parseFloat(data.value).toFixed(2)}}</span>
                            </template>
                            <template slot="radio" slot-scope="data">
                                <input type="radio" name="radio" v-model="selCont" :value="data.item"/>
                            </template>  
                            <template slot="discountItemType" slot-scope="data">
                                <span v-if="data.value == '0'" :title="data.item.discountItemName">{{ data.item.discountItemName | strEllipsisFilter}}</span>    
                                <span v-if="data.value == '2'" :title="data.item.discountItemName">{{ data.item.discountItemName | strEllipsisFilter}}</span>
                            </template>
                            <template slot="discountItemCode" slot-scope="data">
                                <span v-if="data.item.discountItemType == '1'" :title="data.value">{{ data.value | strEllipsisFilter}}</span>    
                                <span v-if="data.item.discountItemType == '3'" :title="data.value">{{  data.value | strEllipsisFilter}}</span>
                            </template>
                            <template slot="discountItemName" slot-scope="data">
                                <span v-if="data.item.discountItemType == '1'" :title="data.value">{{ data.item.discountItemName | strEllipsisFilter}}</span>    
                                <span v-if="data.item.discountItemType == '3'" :title="data.value">{{ data.item.discountItemName | strEllipsisFilter}}</span>
                            </template>
                        </b-table>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="审批履历">
            <div class="animated fadeIn">
                 <approval-record :orderNo='promotionDiscountOrderNo'></approval-record>
            </div> 
            </el-tab-pane>
        </el-tabs>
        <add-modal ref="addDetail" :storeCode='storeCode' :promotionDiscountOrderNo="promotionDiscountOrderNo" @sureDetail="addDetail"></add-modal>
    </div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import {Table, TableColumn, Message, MessageBox, DatePicker,Tabs,  TabPane} from "element-ui"
import AreaTree from 'components/iris-areaqueryshop/index'
import addModal from './addmodal.vue'
import common from 'common/common.js'
import {CHANNEL_CODE, FIRST_SOURCE_CHANNEL} from 'common/ref-code.js'
import {hasBtn} from 'common/api-common.js'
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'
import approvalRecord from 'components/approval-record/approval-record'

Vue.use(DatePicker);
Vue.use(Tabs);
Vue.use(TabPane);

export default {
    components: {
        AreaTree,
        addModal,
        approvalRecord,
    },
    data() {
        return {
            promotionDiscountOrderNo: '',
            orderStatus: '-100',
            wfStatus: '-100',
            userInfo: '',
            storeInfoVo: '',
            storeCode: '',
            headData: {
                storeCode: '',
                date: '',
                startDate: '',
                endDate: '',
                confirmOperatorName: '',
                confirmOperatorTime: '',
                auditPassOperatorName: '',
                auditPassTime: '',
                remark: '',
            },
            inp: {
                storeCode: false,
                date: false,
            },
            tabeList:[],
            fields: {},
            fieldsEidt: {	
                    sel: {
						label: "选择"
					},			
					postTypeName: {
						label: "岗位类型"
                    },
                    postName: {
						label: "岗位名称"
					},
					postCode: {
						label: "岗位编码"
					},
					empCode: {
						label: "人员编码"
					},				
					empName: {
						label: "人员名称"
					},
					discountType: {
						label: "折扣类型"
                    },
                    discountValue: {
						label: "折扣权限"
                    },
                    useType: {
						label: "适用类型"
                    },
                    discountItemType: {
						label: "服务/商品分类"
                    },
                    discountItemCode: {
						label: "服务/商品编码"
                    },
                    discountItemName: {
						label: "服务/商品名称"
					},
            },
            fieldsSee: {			
					postTypeName: {
						label: "岗位类型"
                    },
                    postName: {
						label: "岗位名称"
					},
					postCode: {
						label: "岗位编码"
					},
					empCode: {
						label: "人员编码"
					},				
					empName: {
						label: "人员名称"
					},
					discountType: {
						label: "折扣类型"
                    },
                    discountValue: {
						label: "折扣权限"
                    },
                    useType: {
						label: "适用类型"
                    },
                    discountItemType: {
						label: "服务/商品分类"
                    },
                    discountItemCode: {
						label: "服务/商品编码"
                    },
                    discountItemName: {
						label: "服务/商品名称"
					},
            },
            detailSel: '',
            onlySee: false,
            isHeadSave: false,
            isDetailSave: false,
            params:{
                pageNums:config.pageNums,  
            },
        }
    },
    created() {		
      this.getUserInfo();
      this._initData();
	},
    computed: {
        ...mapState('saleDiscount',[
				'searchParam',				
            ]),
        isEditSaleDiscount(){
				return hasBtn(collectionApi.saleDiscount.insertPromotionDiscountOrderInfo);
            },
        isAddSaleDiscount(){
				return hasBtn(collectionApi.saleDiscount.updatePromotionDiscountOrderInfo);
            },
        isSubmitSaleDiscount(){
				return hasBtn(collectionApi.saleDiscount.submitPromotionDiscountOrderInfo);
            },
        isInvailSaleDiscount(){
				return hasBtn(collectionApi.saleDiscount.cancelPromotionDiscountOrderInfo);
            },
        isRepealSaleDiscount(){
				return hasBtn(collectionApi.saleDiscount.withdrawPromotionDiscountOrderInfo);
            },
        isInvailSaleDiscount(){
				return hasBtn(collectionApi.saleDiscount.cancelPromotionDiscountOrderInfo);
            },
        isEidtSaleDiscountDetail(){
				return hasBtn(collectionApi.saleDiscount.editPromotionDiscountRuleInfoDiscountRuleDetailInfo);
			},
        isBtnSave() {
            if(this.onlySee) {
                 return false;
            }else if(this.orderStatus == '-100' && !this.isHeadSave) {
                return true;
            }else if(this.orderStatus == '-100' && this.isHeadSave) {
                return false;
            }else if(this.orderStatus == '0' && !this.isHeadSave) {
                return true;
            }else if(this.orderStatus == '0' && this.isHeadSave) {
                return false;
            }else{
                return false;
            }
        },
        isBtnSumbit() {
            if(this.onlySee) {
                 return false;
            }else if(this.orderStatus == '0' && !this.isHeadSave) {
                return false;
            }else if(this.orderStatus == '0' && this.isHeadSave) {
                return true;
            }else{
                return false;
            }
        },  
        isBtnEidt() {
            if(this.onlySee) {
                 return false;
            }else if(this.orderStatus == '0' && !this.isHeadSave) {
                return false;
            }else if(this.orderStatus == '0' && this.isHeadSave) {
                return true;
            }else{
                return false;
            }
        },
        isBtnInvalid() {
            if(this.onlySee) {
                 return false;
            }else if(this.orderStatus == '0') {
                return true;
            }else if(this.orderStatus == '2') {
                return true;
            }else{
                return false;
            }
        },
        isBtnRepeal() {
            if(this.onlySee) {
                 return false;
            }else if(this.orderStatus == '1') {
                return true;
            }else{
                return false;
            }
        },
        isEidtDetail() {
            if(this.onlySee) {
                 return false;
            }else if(this.orderStatus == '0') {
                return true;
            }else{
                return false;
            }
        },
    },
    methods: {
        ...mapActions('saleDiscount',[
				'setTableList',
				'setSearchParam',
				'setPages',
                'updateSaleDiscountTabList',
            ]),
        getUserInfo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            let stroe = userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
            this.userInfo = userInfo;
            this.storeInfoVo = stroe;
            // if(stroe.storeCode) {
            //     this.storeCode = stroe.storeCode;
            // }
        },
        // 获取折扣明细
        getDetailList(val) {
            const option = {
                'promotionDiscountOrderNo':val,
            }
            return new Promise((reslove,reject) => {
                api.saleDiscount.queryPromotionDiscountRuleInfoExts(option, (res) => {
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
               
            }else{
                options.storeCodeSet.push(data1.value);
                _this.headData.storeCode = data1.value;
            }
        },
        _initData() {
            let _this = this;
            let param;
            let routeQuery = this.$route.query;
            if(routeQuery.onlySee && routeQuery.onlySee.toString() == 'true') {
                this.onlySee = true;
                this.fields = this.fieldsSee;
            }else {
                this.onlySee = false;
                this.fields = this.fieldsEidt;
            }
           
            if(routeQuery.promotionDiscountOrderNo == undefined || routeQuery.promotionDiscountOrderNo == '') {
                    this.$router.push({name: 'sale-discount-search'})              
            }else {
                this.promotionDiscountOrderNo = routeQuery.promotionDiscountOrderNo;
                let param = {
                    promotionDiscountOrderNo: this.promotionDiscountOrderNo
                }
                api.saleDiscount.getPromotionDiscountOrderInfoByCode(param, (res) => {
                    if(res.data.code === 'success') {	
                        let data = res.data.obj;
                        if(data == null) {

                        }else {
                            this.orderStatus = data.orderStatus;
                            this.wfStatus = data.wfStatus;
                            this.storeCode = data.storeCode;                      
                            for(let key of Object.keys(this.headData)) {
                                this.headData[key] = data[key];
                            }
                            this.headData.id = data.id;
                            this.headData.date =  [this.headData.startDate, this.headData.endDate];                        
                            let stroeParam = {
                                    value: data.storeCode,
                                    text: data.storeName,
                                }
                            this.$refs.areaqueryshop.setselect(stroeParam); 
                            if(data.orderStatus != '0') {
                                this.isHeadSave = true;
                            }
                            if(this.onlySee) {
                                this.isHeadSave = true;
                            }
                            this.getDetailList(this.promotionDiscountOrderNo).then( res => {
                                this.tabeList = res;                          
                            })
                        }
                    }
                })
            }
        },
        cancel() {
             this.$router.push({
                                name: 'sale-discount-search',    
                            })
        },
        eidtHead() {
            this.isHeadSave = false;
        },
        saveData() {
            let isVerity = true;
            for(let key of Object.keys(this.inp)) {
                this.inp[key] = false;
                if(this.headData[key] == '' || this.headData[key] == null) {
                    
                    Message({
                        type: "warning",
                        message: "信息未填写完整！"
                    });
                    this.inp[key] = true;
                    isVerity = false;
                }
            }
            if(!isVerity) {
                return;
            }
            let param = {
                storeCode: this.headData.storeCode,
                promotionDiscountOrderNo: this.promotionDiscountOrderNo,
                newStartDate: common.eleTimeFormat(this.headData.date[0]) == '1970-01-01' ? '': common.eleTimeFormat(this.headData.date[0]),
                newEndDate: common.eleTimeFormat(this.headData.date[1]) == '1970-01-01' ? '': common.eleTimeFormat(this.headData.date[1]),
                remark: this.headData.remark,
                wfStatus: '-1'
            }
            if(!this.headData.id) {
                api.saleDiscount.insertPromotionDiscountOrderInfo(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "保存成功！"
                        });
                        this.isHeadSave = true;
                        this._initData();
                        this.updateSaleDiscountTabList(this.searchParam);
                    }
                })
            }else {
                param.id = this.headData.id;
                if(!param.newStartDate) {
                    param.newStartDate = this.headData.startDate;
                    param.newEndDate = this.headData.endDate;
                }               
                api.saleDiscount.updatePromotionDiscountOrderInfo(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "保存成功！"
                        });
                        this.isHeadSave = true;
                        this._initData();
                        this.updateSaleDiscountTabList(this.searchParam);
                    }
                })
            }
           
        },
        repealOrder() {
            let param = {
                promotionDiscountOrderNo: this.promotionDiscountOrderNo,
                orderStatus: 0,
            };
            api.saleDiscount.withdrawPromotionDiscountOrderInfo(param, (res) => {
                if(res.data.code === 'success') {	
                    Message({
                        type: "success",
                        message: "撤销成功！"
                    });
                    this._initData();
                    this.updateSaleDiscountTabList(this.searchParam);
                }
            })
        },
        InvalidOrder() {
            MessageBox.confirm('作废操作不可逆，确定作废吗?', '提示', {
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
            }).then(() => {				  
                let param = {
                    promotionDiscountOrderNo: this.promotionDiscountOrderNo,
                    orderStatus: -1,
                };
                api.saleDiscount.cancelPromotionDiscountOrderInfo(param, (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "作废成功！"
                        });
                        this._initData();
                        this.updateSaleDiscountTabList(this.searchParam);
                    }
                })
            }).catch(() => {
            });
        },
        submitOrder() {
            let param = {
                promotionDiscountOrderNo: this.promotionDiscountOrderNo,
                orderStatus: 1,
                empToken: this.userInfo.empToken,
            };
            if(this.tabeList.length == 0) {
                Message({
                    type: "warning",
                    message: "折扣明细不可为空！"
                });
                return;
            }
            api.saleDiscount.submitPromotionDiscountOrderInfo(param, (res) => {
                if(res.data.code === 'success') {	
                    Message({
                        type: "success",
                        message: "提交成功！"
                    });
                    this._initData();
                    this.updateSaleDiscountTabList(this.searchParam);
                }
            })
        },
        addDetailModelShow() {
            this.$refs.addDetail.reset();
            this.$refs.addDetail.showModal();
        },
        addDetail(obj) {
            if(!obj.postTypeCode) {
               delete obj.postTypeCode;
           }
           if(!obj.postCode) {
               delete obj.postCode;
           }
           if(!obj.empCode) {
               delete obj.empCode;
            }
            //    if(obj.postTypeCode === '' || obj.postTypeCode === null || obj.postTypeCode === undefined) {
            //        delete obj.postTypeCode;
            //    }
            //    if(obj.postCode === '' || obj.postCode === null || obj.postCode === undefined) {
            //        delete obj.postCode;
            //    }
            //    if(obj.empCode === '' || obj.empCode === null || obj.empCode === undefined) {
            //        delete obj.empCode;
            //    }
            api.saleDiscount.editPromotionDiscountRuleInfoDiscountRuleDetailInfo([obj], (res) => {
                if(res.data.code === 'success') {	
                    Message({
                        type: "success",
                        message: "保存成功！"
                    });
                    this.getDetailList(this.promotionDiscountOrderNo).then( res => {
                        this.tabeList = res;
                    })
                    this.updateSaleDiscountTabList(this.searchParam);
                }
            })
        },
        delOrderDetail() {
            if(this.detailSel === "") {
                Message({
                    type: "warning",
                    message: "请选择删除项！"
                });
                return;
            } 
            MessageBox.confirm('确定删除吗?', '提示', {
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
            }).then(() => {				  
                let param = Object.assign({}, this.detailSel);
                param.isDeleted = '1';
                api.saleDiscount.editPromotionDiscountRuleInfoDiscountRuleDetailInfo([param], (res) => {
                    if(res.data.code === 'success') {	
                        Message({
                            type: "success",
                            message: "删除成功！"
                        });
                        this.detailSel = '';
                        this.getDetailList(this.promotionDiscountOrderNo).then( res => {
                            this.tabeList = res;
                        })
                        this.updateSaleDiscountTabList(this.searchParam);
                    }
                }) 
            }).catch(() => {
            });
           
            
        },
    },
    watch: {
            '$route': '_initData',
            
		},
    filters:{
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
    }
}
</script>
<style scoped>
.card-title{
    position: absolute;
    top: 10px;
    left: 120px;
}
.header-btn-r{
    position: absolute;
    top: 8px;
    right: 20px;
}
</style>
