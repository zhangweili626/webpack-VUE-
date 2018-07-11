<template>
    <div>
        <b-card header="查询">
            <div class="row">
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="模板编码" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.couponTemplateCode"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="模板名称" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.couponTemplateName"></b-form-input>                                           
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="申请方" label-text-align="right" :label-cols="4">
						<org-tree @getOrgCode="getOrg"  :params="{orgName:queryParams.applyOrgName}" ref="orgSelect"></org-tree>	                        
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="申请人" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.applyEmpName"></b-form-input>                                           
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="有效期类型" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.couponExpireType" :options="validityTermType"></b-form-select>                                                                                      
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="使用类型" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.couponTypeCode" :options="userTypeList" :disabled="true"></b-form-select>                        
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="使用方" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.couponUseTypeCode" :options="carTypeList"></b-form-select>                                                                                      
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="使用性质" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.useNatureTypeCode" :options="userQualityList"></b-form-select>                                                                                      
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="发布状态" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.couponTemplateStatus" :options="publishStateList"></b-form-select>                        
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="制券状态" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.makeStatus" :options="makeCardState"></b-form-select>                                                                                      
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="制券人" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.makeEmpName"></b-form-input>                                                                                                                                                     
					</b-form-fieldset>
				</div>
                <!-- <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="面值范围" label-text-align="right" :label-cols="4">
                        <div class="row">
                            <div class="col-md-5">
                                <el-input v-model="queryParams.fromCardAmout" type="number" min="0"></el-input>
                            </div>
                            ~                                                            
                            <div class="col-md-6">
                                <el-input v-model="queryParams.toCardAmout" type="number" min="0">
                                </el-input>
                            </div>
                        </div>                    
					</b-form-fieldset>
				</div> -->
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="使用范围" label-text-align="right" :label-cols="4">
                        <AreaTree @select-change="selectedfun" ref="area" :storeAll='true'></AreaTree>                                                                                                                                 
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="渠道" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.channelTypeCode" :options="canalList"></b-form-select>                                                                                                                                                                                                                                                                 
					</b-form-fieldset>
				</div>
			</div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset">重置</b-button>                        
                        <b-button size="sm" variant="primary" @click="query">查询</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="success" @click="newAdd">新增</b-button>
                        <b-button size="sm" variant="primary" @click="printTicket">编辑</b-button>                        
                        <b-button size="sm" variant="success" @click="makeTicket">制券</b-button>
                    </div>
                </div>
            </div>
            <div class="table-scrollable mb-2 card-template-counting">
                <el-table
                    :data="tableList"
                    border
                    style="width: 100%">
                    <el-table-column
                    fixed
                    width="70"
                    prop="selCont"
                    label="选择">
                        <template slot-scope="scope">
                            <input type="radio" v-model="selCont" :value="scope.row"/>                                
                        </template>	
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="couponTemplateCode"
                    label="模板编码"
                    width="180">
                        <template slot-scope="scope">
                            <router-link :to="{
                    name:'ticket-template-counting-detail',
                    query:{
                        couponTemplateCode:scope.row.couponTemplateCode,
                        disabled:true
                    }}">{{scope.row.couponTemplateCode}}</router-link>                            
                        </template>	
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="couponTemplateName"
                    label="模板名称"
                    show-overflow-tooltip
                    width="100">
                    </el-table-column>
                    <el-table-column
                    fixed
                    width="100"
                    prop="couponTemplateStatus"
                    label="发布状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.couponTemplateStatus==0">未发布</span>                                                
                            <span v-if="scope.row.couponTemplateStatus==1">已提交</span>                                                
                            <span v-if="scope.row.couponTemplateStatus==2">已发布</span>                          
                            <span v-if="scope.row.couponTemplateStatus==-1">已作废</span>                          
                        </template>
                    </el-table-column>
                    <el-table-column
                    fixed
                    width="100"
                    prop="makeStatus"
                    label="制券状态">
                        <template slot-scope="scope">
                            <span v-if="scope.row.makeStatus==0">未制券</span>                                                
                            <span v-if="scope.row.makeStatus==1">已制券</span>                          
                        </template>
                    </el-table-column>
                    <el-table-column
                    fixed
                    prop="makeNums"
                    width="110"
                    label="已制券数量">
                    </el-table-column>
                    <el-table-column
                    show-overflow-tooltip
                    prop="couponExpireType"
                    width="110"
                    label="有效期类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.couponExpireType==0">固定时长</span>                                                
                            <span v-if="scope.row.couponExpireType==1">有效期限</span>                          
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="couponTypeName"
                    label="使用类型"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="couponUseTypeName"
                    label="使用方"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="useNatureTypeName"
                    label="使用性质"
                    width="100">
                    </el-table-column>
                    <!-- <el-table-column
                    prop="couponAmout"
                    label="面值">
                    </el-table-column> -->
                    <el-table-column
                    show-overflow-tooltip
                    prop="applyOrgName"
                    label="申请方">
                    </el-table-column>
                    <el-table-column
                    show-overflow-tooltip
                    prop="applyEmpName"
                    label="申请人">
                    </el-table-column>
                    <el-table-column
                    show-overflow-tooltip
                    prop="makeEmpName"
                    label="制券人">
                    </el-table-column>
                    <el-table-column
                    show-overflow-tooltip
                    prop="channelTypeName"
                    label="渠道">
                    </el-table-column>
                    <!-- <el-table-column
                    prop="useRange"
                    label="使用范围"
                    width="100"
                    show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.useRange&&scope.row.useRange.replace(/¥P1¥/g,'现有所有门店')}}</span>
                        </template>
                    </el-table-column> -->
                </el-table>
            </div>
            <div class="row"> 
                <div class="col-md-12">
                    <pagination class="pull-right" @page-change="demandOrdSearch" :page-no="pageData.pageNum" :page-size="pageData.pageSize" :total-result="pageData.total" :total-pages="pageData.pages">
                     </pagination>
                </div>
            </div>
        </b-card>
    </div>
</template>
<script>
import Vue from 'vue'
import AreaTree from 'components/iris-areaqueryshop/index'
import { MessageBox, Message, DatePicker, Input, Table ,TableColumn , Tooltip} from 'element-ui'
import carInfo from 'components/iris-carinfo'
import config from 'common/config.js'
import api from 'common/api.js'
import orgTree from 'views/staff/orgTree.vue'
import Pagination from 'components/pagination/pagination'
import {mapState, mapMutations, mapActions} from 'vuex'
Vue.use(DatePicker)
Vue.use(Input)
Vue.use(Table)
Vue.use(Tooltip)
Vue.use(TableColumn)
    export default {
        data() {
            return {
                queryParams:{
                    carType:null,
                    pageNums:config.pageNums,  
                    CouponTypeCode:'DiscountCoupons',   
                    channelTypeCode:''               
                },
                selCont:{},
                userTypeList:[],
                publishStateList:[{
                    text:'',
                    value:null
                },{
                    text:'已发布',
                    value:2
                },{
                    text:'未发布',
                    value:0
                }],
                carTypeList:[{
                    text:'',
                    value:null
                },{
                    text:"车主",
                    value:'CRecorder'
                },{
                    text:"车辆",
                    value:'VehicleCard'
                }],
                makeCardState:[{
                    text:'',
                    value:null
                },{
                    text:"已制券",
                    value:1
                },{
                    text:"未制券",
                    value:0
                }],
                validityTermType:[{
                    text:'',
                    value:null
                },{
                    text:"固定时长",
                    value:0
                },{
                    text:"有效期限",
                    value:1
                }],
                userQualityList:[{
                    text:'',
                    value:null
                },{
                    text:"专店专用",
                    value:'SpecialShop'
                },{
                    text:"多店范围",
                    value:'MultiStore'
                }],
                canalList:[],
                columW: config.demandOrder.columW,
                tableList:[],
                pageData:{}
            }
        },
        components:{
            AreaTree,
            carInfo,
            orgTree,
            Pagination
        },
        computed:{
            ...mapState('demandOrder',[
                'cardTemplateList',
                'cardTemplatePage',
            ]),
        },
        created(){
            const _this = this;
            _this.getDataDictionarys('ChannelCode',(msg)=>{
                _this.canalList = msg
            })
            _this.getDataDictionarys('CouponType',(msg)=>{
                _this.userTypeList = msg
            })
            _this.getDataDictionarys('CouponUserType',(msg)=>{
                _this.carTypeList = msg
            })
            if(_this.$route.query.couponTemplateCode){
                _this.query()
            }
        },
        methods: {
            ...mapActions('demandOrder',[
                'setCardTemplate',
            ]),
            // 页面路由跳转制券
            makeTicket() {
                const _this = this
                if(!_this.selCont.couponTemplateCode) {
                    Message({
                        type: 'warning',
                        message: '请选择模板'
                    })
                    return;
                }else {
                    if(_this.selCont.couponTemplateStatus === 2) {
                        _this.$router.push(
                            {
                                path: `/ticket-template-counting/makeTicket/${_this.selCont.couponTemplateCode}`
                            }
                        )
                    }else {
                        Message({
                            type: 'warning',
                            message: '模板未发布或已作废不可以制券'
                        })
                        return;
                    }
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
            //重置按钮
            reset(){    
                const _this = this;
                _this.queryParams = {
                    carType:null,
                    pageNums:config.pageNums,   
                    CouponTypeCode:'Metering',   
                    channelTypeCode:'',           
                }
                _this.$refs.area.reset()                
                _this.$refs.area.resetToStart() 
            },
            //申请方
            getOrg(val) {
                const _this = this;
                _this.queryParams.applyOrgCode = val.code
                _this.queryParams.applyOrgName = val.name    
			},
            //查询按钮
            query(){
                const _this = this;
                _this.queryParams.pageStart = 1            
                _this.queryCardTemplateInfos()
            },
            queryCardTemplateInfos(){
                const _this = this;
                api.ticketTemlate.queryCouponTemplateInfos(_this.queryParams,(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.tableList=msg.data.obj.list,
                        _this.pageData=msg.data.obj
                    }
                })                
            },
            // 对券查询 券销售
            newAdd() {
                const _this = this
                _this.$router.push({
                    name: 'ticket-template-counting-add'
                })
            },
            // 对某一条作废
            // deleteItem() {
            //     const _this = this;
            //     if(_this.selCont.couponTemplateCode){
            //         if(_this.selCont.cardTemplateStatus !== -1){
            //             _this.$router.push({
            //             name:'card-template-counting-cancel',
            //             query:{
            //                 couponTemplateCode:_this.selCont.couponTemplateCode,
            //             }})
            //         }else{
            //             Message({
            //                 type: 'warning',
            //                 message: '该模板已作废！'
            //             });
            //         }  
            //     }else{
            //         Message({
            //             type: 'warning',
            //             message: '请选择数据！'
            //         });
            //     }
            // },
            // 对某一条开票
            printTicket() {
                const _this = this;
                if(_this.selCont.couponTemplateCode){
                    if(_this.selCont.couponTemplateStatus==-1){
                        Message({
                            type: 'warning',
                            message: '该模板已作废！'
                        });
                    }else{
                        _this.$router.push({
                        name:'ticket-template-counting-updata',
                        query:{
                            couponTemplateCode:_this.selCont.couponTemplateCode,
                            disabled:false
                        }})
                    }
                }else{
                    Message({
                        type: 'warning',
                        message: '请选择数据！'
                    });
                }
                
            },
            //区域选择门店
            selectedfun(data, data1) {
                const _this = this;
                const options = {
                    storeCodeSet: []
                };
                if(data1 instanceof Array){
                    _this.queryParams.storeCodes = []
                    for (let i = 0; i < data1.length; i++) {
                        _this.$set(_this.queryParams.storeCodes, i, data1[i].value)              
                    }
                }else{
                    _this.queryParams.storeCodes = [data1.value]
                }
            },
            getColumnW(headStr) {
                return (headStr.length) * this.columW +36;
            },
            //分页数据改变
            demandOrdSearch(value){
                const _this = this;
                _this.queryParams.pageStart = value              
                _this.queryCardTemplateInfos()
            }
        }
    }
</script>
<style>
.card-template-counting .el-table__fixed {
    min-height: 1000px !important;
}
</style>


