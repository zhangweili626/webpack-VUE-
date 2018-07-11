<template>
<div class="animated fadeIn">
    <b-card header="查询">
        <div class="row">
            <div class="col-md-4">
                <b-form-fieldset horizontal label="销售区域" :label-cols="4" class="text-right">
                    <area-tree @select-change="selectChange" ref="area" :storeAll='true'
                    ></area-tree>
                </b-form-fieldset>
            </div>
            <div class="col-md-4 ">
                <b-form-fieldset horizontal label="申请单号" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="params.cardRefundOrderNo"/>
                </b-form-fieldset>
            </div>
            <div class="col-md-4 ">
                <b-form-fieldset horizontal label="卡号" label-text-align="right" :label-cols="4">
                    <b-form-input  v-model="params.cardNo" />
                </b-form-fieldset>
            </div>
            <div class="col-md-4 ">
                <b-form-fieldset horizontal label="销售单" label-text-align="right" :label-cols="4">
                    <b-form-input  v-model="params.cardSalesOrderNo" />
                </b-form-fieldset>
            </div>
            <div class="col-md-4 ">
                <b-form-fieldset horizontal label="销售人" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="params.salesEmpName" />
                </b-form-fieldset>
            </div>
            <div class="col-md-4 ">
                <b-form-fieldset horizontal label="客户姓名" label-text-align="right" :label-cols="4">
                    <b-form-input  v-model="params.customName" />
                </b-form-fieldset>
            </div>
            <div class="col-md-4 ">
                <b-form-fieldset horizontal label="车架号(VIN)" label-text-align="right" :label-cols="4">
                    <b-form-input v-model="params.vinCode" />
                </b-form-fieldset>
            </div>
            <div class="col-md-4 ">
                <b-form-fieldset horizontal label="使用类型" label-text-align="right" :label-cols="4">
                    <b-form-select :options="userTypeList" v-model="params.cardTypeCode"/>
                </b-form-fieldset>
            </div>
            <div class="col-md-4 ">
                <b-form-fieldset horizontal label="业务状态" label-text-align="right" :label-cols="4">
                    <b-form-select :options="orderTypeList" v-model="params.cardStatus"/>
                </b-form-fieldset>
            </div>
            <div class="col-md-4 ">
                <b-form-fieldset horizontal label="审批状态" label-text-align="right" :label-cols="4">
                    <b-form-select :options="wfStatus" v-model="params.wfStatus"/>
                </b-form-fieldset>
            </div>
        </div>
        <query-btn-group @resetClick="reset" @query="query"></query-btn-group>
    </b-card>
    <div class="row">
        <div class="col-md-12">
            <b-card>
                <b-button size="sm" variant="primary" @click="eidtOrder">编辑</b-button>                
                <b-button size="sm" variant="success" @click="newAdd">退卡退款</b-button>  
                <!-- <b-button size="sm" variant="primary" @click="turnToRefund">退款</b-button>                -->
                <div class="table-scrollable mb-2">
                    <b-table striped hover bordered show-empty empty-text="暂无数据" :items="backCardList" :fields="fields">
                        <template slot="cardRefundOrderNo" slot-scope="data">
                            <span href="javascript:;" @click.prevent="detail(data.item)">{{data.value }}</span>
                        </template>
                        <template slot="cardRefundOrderNo" slot-scope="data">
                            <a href="javascript:;" @click="justShowDetail(data.item)">{{ data.item.cardRefundOrderNo }}</a>
                        </template>
                        <template slot="refundType" slot-scope="data">
                            {{data.item.refundType == 0 ?  '退卡' : '退款'}}
                        </template>
                        <template slot="cardStatus" slot-scope="data">
                            <span v-if="data.item.cardStatus == 0">未销售</span>
                            <span v-if="data.item.cardStatus == 1">挂售中</span>
                            <span v-if="data.item.cardStatus == 2">已销售</span>
                            <span v-if="data.item.cardStatus == 8">退办中</span>
                            <span v-if="data.item.cardStatus == 9">已退办</span>
                            <span v-if="data.item.cardStatus == -1">已作废</span>
                        </template>
                        <template slot="orderStatus" slot-scope="data">
                            <span v-if="data.item.orderStatus == 0">未生效</span>
                            <span v-if="data.item.orderStatus == 1">已提交</span>
                            <span v-if="data.item.orderStatus == 2">已生效</span>
                            <span v-if="data.item.orderStatus == 3">已完成</span>
                            <span v-if="data.item.orderStatus == -1">已作废</span>
                        </template>
                        <template slot="wfStatus" slot-scope="data">
                            <span v-if="data.item.wfStatus == -1">待提交</span>
                            <span v-if="data.item.wfStatus == 0">已提交</span>
                            <span v-if="data.item.wfStatus == 1">审批通过</span>
                            <span v-if="data.item.wfStatus == -2">撤销</span>
                        </template>
                        <template slot="radio" slot-scope="data">
                            <input type="radio" name="radio" v-model="selCont" :value="data.item"/>
                        </template>  
                    </b-table>
                </div>
                <div class="row"> 
                    <div class="col-md-12">
                    <pagination class="pull-right" 
                        @page-change="pageChange" 
                        :page-no="pages.pageNo" 
                        :page-size="paginationData.pageSize" 
                        :total-pages="pages.totalPages" 
                        :total-result="pages.total">
                    </pagination>
                </div>
                </div>
            </b-card>
        </div>
    </div>
</div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import AreaTree from 'components/iris-areaqueryshop/index'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import ListBtnGroup from 'components/list-btn-group/list-btn-group'
import Pagination from 'components/pagination/pagination'
import api from "common/api";
import config from "common/config";
import { MessageBox, Message} from 'element-ui'
export default {
    components: {
        AreaTree,
        QueryBtnGroup,
        ListBtnGroup,
        Pagination
    },
    data() {
        return {
            fields: {
                radio: {
                    label: '选择'
                },
                cardRefundOrderNo: {
                    label: '申请单号'
                },
                cardNo: {
                    label: '卡号'
                },
                refundType: {
                    label: '申请类型'
                },
                orderStatus: {
                    label: '单据状态'
                },
                wfStatus: {
                    label: '审批状态'
                },
                cardTypeName: {
                    label: '类型'
                },
                cardStatus: {
                    label: '业务状态'
                },
                cardSalesOrderNo: {
                    label: '销售单'
                },
                salesEmpName: {
                    label: '销售人'
                },
                customName: {
                    label: '客户姓名'
                },
                vinCode: {
                    label: '车架号(VIN)'
                },
            },
            obj: {},
            selCont: '',
            paginationData: {
                total: 0,
                totalPages: 1,
                pageNo: 1,
                pageSize: config.pageNums
            },
            params:{
                pageNums:config.pageNums,  
            },
            wfStatus:config.purchaseContract.approStatus, 
            frozenStateList: config.cardPay.frozenStateList, 
            orderTypeList:  config.cardPay.orderTypeList,                      
            userTypeList:[],
        }
    },
    computed: {
        ...mapState('backCard',[
				'backCardList',
				'searchParam',
				'pages'
            ]),
    },
    created(){
        const _this = this;
        _this.getDataDictionarys('CardType',(msg)=>{
            _this.userTypeList = msg
        })
    },
    methods: {
        ...mapActions('backCard',[
				'setTableList',
				'setSearchParam',
				'setPages',
                'getBackCardTabList',
            ]),
        // 临时跳转退款页面
        turnToRefund() {
            const _this = this
            _this.$router.push({
                path: `back-card-refund/${'123214214'}`
            })
        },
        // 显示详情查看事件
        justShowDetail(arg) {
            const _this = this
            console.log(arg)
            // _this.$router.push({
            //     path: `back-card-refund/${'123214214'}`
            // })
            if(arg.refundType == 0){
            //退卡界面
                _this.$router.push({
                    name: 'back-card-add',
                    query: {cardNo: arg.cardNo, id: '', onlySee: true}
                })
                
            }else{
                //退款界面
                console.log(arg)
                _this.$router.push({
                    path: `back-card-refund/${arg.id + 'show'}`
                })
            }   
        },
        //查询数据字典
        getDataDictionarys(code,cb = ()=>{}){
            const _this = this;
            api.ref.getDataDictionarys({
                refCode: code
            },(msg)=>{
                if(msg.data.message == 'success'){
                    let data  = msg.data.obj.referenceDetailInfos
                    let list = [{text:'',value:''}]
                    for (let i = 0; i < data.length; i++) {
                        list[i+1] = {
                            text:data[i].refDetailName,
                            value:data[i].refDetailCode
                        }
                    }
                    cb(list)
                }
            })
        },
        selectChange(data, data1) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            _this.params.storeCodes = []
            if(data1 instanceof Array && data1.length != 0){
                for (let i = 0; i < data1.length; i++) {
                    _this.$set(_this.params.storeCodes, i, data1[i].value)              
                }
            }else{
                if(data1.value) {
                    _this.params.storeCodes = [data1.value];
                }else {
                    this.params.storeCodes = [];
                }
                
            }
        },
        reset() {
            for(let key of Object.keys(this.params)) {
                this.params[key] = '';
            }
            this.params.pageNums = this.paginationData.pageSize;
            this.params.pageStart = 1;
            this.$refs.area.reset();
            this.$refs.area.resetToStart();
        },
        query() {
            const _this = this;
            _this.params.pageStart = 1;
            _this.search();                  
        },
        pageChange(val){
            const _this = this;
            _this.params.pageStart = val;   
            _this.search();
        },
        search(){
            let param = Object.assign({}, this.params)
            this.setSearchParam(param);
            this.getBackCardTabList(param);
        },
        newAdd(){
            const _this = this;
            MessageBox.prompt('请输入正确的卡号/电子账户', '提示', {
            confirmButtonText: '生成退卡/退款',
            cancelButtonText: '取消',
            inputPlaceholder:'不能对他店销售卡进行退卡/退款操作',
            inputErrorMessage: '输入错误'
            }).then(({ value }) => {
                if(value === '' || value == null) {
                    Message({
                        message: '卡号不可为空!',
                        type: 'warning'
                    });
                    return;
                }
                api.returnCard.getCardRefundOrderInfoByCardCode({
                    cardNo:value
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        if(msg.data.obj.refundType == 0){
                        //退卡界面
                            _this.$router.push({
                                name: 'back-card-add',
                                query: {cardNo: value, id: '', onlySee: false}
                            })
                            
                        }else{
                            //退款界面
                            _this.$router.push({
                                path: `back-card-refund/${value + 'nadd'}`
                            })
                        }        
                    }
                })
            }).catch(() => {
                
            });
        },
        eidtOrder() {
            if(this.selCont === "") {
                Message({
                    message: '未选择卡!',
                    type: 'warning'
                });
            }else {
                if(this.selCont.refundType == 0){
                //退卡界面
                   this.$router.push({
                                    name: 'back-card-edit',
                                    query: {cardNo: this.selCont.cardNo, id: this.selCont.id, onlySee: false}
                                })
                    
                }else{
                    //退款界面
                    this.$router.push({
                        path: `back-card-refund/${this.selCont.id + 'edit'}`
                    })
                }        
                
            }
        },
        detail(val) {
            console.log(val)
        }
    }
}
</script>
<style>
.el-button--primary{
    background-color: #577EB9!important;
    border-color: #577EB9!important;
}
</style>

