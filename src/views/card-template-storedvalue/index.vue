<template>
    <div>
        <b-card header="查询">
            <div class="row">
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="模板编码" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.cardTemplateCode"></b-form-input>
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="模板名称" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.cardTemplateName"></b-form-input>                                           
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="是否电子账户" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.isElectronicAccount" :options="isElectronicAccountList" :disabled="true"></b-form-select>                                                
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="发布状态" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.cardTemplateStatus" :options="publishStateList"></b-form-select>                        
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="制卡状态" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryParams.makeStatus" :options="makeCardState"></b-form-select>                                                                                      
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="申请方" label-text-align="right" :label-cols="4">
						<org-tree @getOrgCode="getOrg"  :params='{code:queryParams.applyOrgCode,orgName:queryParams.applyOrgName}' ref="orgSelect"></org-tree>	                        
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="申请人" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.applyEmpName"></b-form-input>                                           
					</b-form-fieldset>
				</div>
                <div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="制卡人" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.makeEmpName"></b-form-input>                                                                                                                                                     
					</b-form-fieldset>
				</div>
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
                        <!-- <b-button :disabled="true" size="sm" variant="success" @click="newAdd">新增</b-button> -->
                        <b-button size="sm" variant="primary" @click="printTicket">编辑</b-button>                        
                        <!-- <b-button :disabled="true" size="sm" variant="danger" @click="deleteItem">制卡</b-button> -->
                        <!-- <b-button :disabled="true" size="sm" variant="danger" @click="deleteItem">模板作废</b-button> -->
                    </div>
                </div>
            </div>
                <div class="table-scrollable mb-2">
            <el-table
                :data="tableList"
                border
                style="width: 100%">
                <el-table-column
                fixed
                prop="selCont"
                label="选择"
                :width="getColumnW('选择', '')">
                    <template slot-scope="scope">
                        <input type="radio" v-model="selCont" :value="scope.row"/>                                
                    </template>	
                </el-table-column>
                <el-table-column
                fixed
                prop="cardTemplateCode"
                label="模板编码"
                :width="getColumnW('模板编码')">
                      <template slot-scope="scope">
                        <router-link :to="{
                name:'card-template-storedvalue-detail',
                query:{
                    cardTemplateCode:scope.row.cardTemplateCode,
                    disabled:true
                }}">{{scope.row.cardTemplateCode}}</router-link>                            
                    </template>	
                </el-table-column>
                <el-table-column
                fixed
                prop="cardTemplateName"
                label="模板名称"
                :width="getColumnW('模板名称')">
                </el-table-column>
                <el-table-column
                fixed
                prop="isElectronicAccount"
                label="是否电子账户"
                :width="getColumnW('发布状态')">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isElectronicAccount==0">否</span>                          
                        <span v-if="scope.row.isElectronicAccount==1">是</span>                          
                    </template>
                </el-table-column>
                <el-table-column
                prop="cardTemplateStatus"
                label="发布状态"
                :width="getColumnW('发布状态')">
                    <template slot-scope="scope">
                        <span v-if="scope.row.cardTemplateStatus==0">未发布</span>                                                
                        <span v-if="scope.row.cardTemplateStatus==1">已提交</span>                                                
                        <span v-if="scope.row.cardTemplateStatus==2">已发布</span>                          
                        <span v-if="scope.row.cardTemplateStatus==-1">已作废</span>                          
                    </template>
                </el-table-column>
                <el-table-column
                prop="makeStatus"
                label="制卡状态"
                :width="getColumnW('制卡状态')">
                    <template slot-scope="scope">
                        <span v-if="scope.row.makeStatus==0">未制卡</span>                                                
                        <span v-if="scope.row.makeStatus==1">已制卡</span>                          
                    </template>
                </el-table-column>
                <el-table-column
                prop="makeNums"
                label="已制卡数量"
                :width="getColumnW('已制卡数量')">
                </el-table-column>
                <el-table-column
                prop="applyOrgName"
                label="制卡申请方"
                :width="getColumnW('制卡申请方')">
                </el-table-column>
                <el-table-column
                prop="applyEmpName"
                label="申请人">
                </el-table-column>
                <el-table-column
                prop="makeEmpName"
                label="制卡人">
                </el-table-column>
                <el-table-column
                prop="channelTypeName"
                label="渠道">
                </el-table-column>
                <el-table-column
                prop="useRange"
                label="使用范围"
                :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{scope.row.useRange.replace(/¥P1¥/g,'现有所有门店')}}</span>
                    </template>
                </el-table-column>
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
                    isElectronicAccount:1,
                    pageNums:config.pageNums,  
                    cardTypeCode:'StoredValue',   
                    channelTypeCode:'OfflineStoreSales'               
                },
                isElectronicAccountList:[{
                    text:'是',
                    value:1
                }],
                selCont:{},
                userTypeList:[{
                    text:'计次',
                    value:'Metering'
                },{
                    text:'储值',
                    value:'StoredValue'
                }],
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
                    text:"车主卡",
                    value:'CRecorder'
                },{
                    text:"车辆卡",
                    value:'VehicleCard'
                }],
                makeCardState:[{
                    text:'',
                    value:null
                },{
                    text:"已制卡",
                    value:1
                },{
                    text:"未制卡",
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
                    text:"多店",
                    value:'MultiStore'
                }],
                canalList:[],
                columW: config.demandOrder.columW,
                tableList:[],
                pageData:[]
            }
        },
        components:{
            AreaTree,
            carInfo,
            orgTree,
            Pagination
        },
        created(){
            const _this = this;
            _this.getDataDictionarys('CardType',(msg)=>{
                _this.userTypeList = msg
            })
            _this.getDataDictionarys('ChannelCode',(msg)=>{
                _this.canalList = msg
            })
        },
        computed:{
            ...mapState('demandOrder',[
                'cardTemplateList',
                'cardTemplatePage',
            ]),
            // tableList:function(){
            //     return JSON.parse(JSON.stringify(this.cardTemplateList))
            // },
            // pageData:function(){
            //     return JSON.parse(JSON.stringify(this.cardTemplatePage))            
            // }
        },
        methods: {
            ...mapActions('demandOrder',[
                'setCardTemplate',
            ]),
            //查询数据字典
            getDataDictionarys(code,cb = ()=>{}){
                const _this = this;
                api.ref.getDataDictionarys({
                    refCode: code
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        let data  = msg.data.obj.referenceDetailInfos
                        let list = []
                        for (let i = 0; i < data.length; i++) {
                            list[i] = {
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
                    isElectronicAccount:1,
                    pageNums:config.pageNums,  
                    cardTypeCode:'StoredValue',   
                    channelTypeCode:'OfflineStoreSales'               
                }
                _this.$refs.area.reset()                
                _this.$refs.area.resetToStart() 
            },
            //申请方
            getOrg(val) {
                const _this = this;
                _this.queryParams.applyOrgCode = val.code
                _this.queryParams.applyOrgName = val.text                
			},
            //查询按钮
            query(){
                const _this = this;
                _this.queryParams.pageStart = 1                
                _this.queryCardTemplateInfos()
            },
            queryCardTemplateInfos(){
                const _this = this;
                api.carTemlate.queryCardTemplateInfos(_this.queryParams,(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.tableList = msg.data.obj.list
                        _this.pageData = msg.data.obj
                        // _this.setCardTemplate(msg.data.obj)
                    }
                })                
            },
            // 对卡查询 卡销售
            newAdd() {
                const _this = this
                _this.$router.push({
                name:'card-template-storedvalue-add',
                query:{
                    cardTemplateCode:'DZH000001',
                    disabled:true
                }})
            },
            // 对某一条作废
            deleteItem() {
                const _this = this;
                MessageBox.confirm(`所选卡为电子账户卡不支持此操作`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                }).catch(() => {
                });
            },
            // 对某一条开票
            printTicket() {
                const _this = this;
                if(_this.selCont.cardTemplateCode){
                    _this.$router.push({
                    name:'card-template-storedvalue-updata',
                    query:{
                        cardTemplateCode:_this.selCont.cardTemplateCode,
                        disabled:false
                    }})
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
<style scoped>

</style>


