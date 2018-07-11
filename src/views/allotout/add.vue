<template>
    <div>
        <b-card>
            <div slot="header">
            	<strong>明细</strong>
            </div>
            <b-form id='addQuery' disabled="">
	            <div class="row">
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="调拨出库单号" label-text-align="right" :label-cols="4">
	                        <b-form-input v-model='addQuery.odd' disabled=""/>
	                    </b-form-fieldset>
	                </div>
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="调拨单类型" label-text-align="right" :label-cols="4">
	                        <b-form-select :options="billType" v-model = "addQuery.billTypeSelected" :disabled="noDisable"></b-form-select>
	                    </b-form-fieldset>
	                </div>
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="调拨单子类型" label-text-align="right" :label-cols="4">
	                        <b-form-select :options="billSubType" v-model = "addQuery.billTypeSubSelected" :disabled="noDisable"></b-form-select>
	                    </b-form-fieldset>
	                </div>
	            </div>
	            <div class="row">
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="审核状态" :label-cols="4" class="text-right">
	                    	<b-form-select :options="wfStatus" v-model="addQuery.auditState" disabled></b-form-select>
	                    </b-form-fieldset> 
	                </div>
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="调出总数量" label-text-align="right" :label-cols="4">
	                        <b-form-input placeholder="" v-model="addQuery.outNum" disabled=""/>
	                    </b-form-fieldset>
	                </div>
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="调出总金额" :label-cols="4" class="text-right">
	                    	<b-form-input placeholder="" v-model="addQuery.money" disabled=""/>
	                    </b-form-fieldset> 
	                </div>
	            </div>
	            <div class='row'>
	            	  <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="调入区域 *" label-text-align="right" :label-cols="4">
	                        <areaqueryshop ref="inareaqueryshop"  @control-frame="hideOut" :rightControl="false" @select-change="selectedfunIn" :readonly="noDisable"></areaqueryshop>
	                    </b-form-fieldset>
	                </div>
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="调入仓库 *" label-text-align="right" :label-cols="4">
	                        <b-form-select :options="pSupplyin" v-model='addQuery.supplyin' :disabled="noDisable" :state="cateState_" ></b-form-select>
	                    </b-form-fieldset>
	                </div>
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="创建人" label-text-align="right" :label-cols="4">
	                        <b-form-input placeholder="" disabled="" v-model="addQuery.user"/>
	                    </b-form-fieldset>
	                </div>
	            </div>
	            <div class='row'>
	            	<div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="调出区域 *" label-text-align="right" :label-cols="4" >
	                        <areaqueryshop ref="outareaqueryshop" :storeAll="true" @control-frame="hideIn" @select-change="selectedfun" :readonly="noDisable" ></areaqueryshop>
	                    </b-form-fieldset>
	                </div>
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="调出仓库 *" label-text-align="right" :label-cols="4">
	                        <b-form-select :options="pSupplyout" v-model="addQuery.supplyout" :disabled="noDisable" :state="cateState"></b-form-select>
	                    </b-form-fieldset>
	                </div>
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="运费（含税）" label-text-align="right" :label-cols="4">
	                        <b-form-input placeholder=""  v-model="addQuery.freight" onkeyup="this.value=this.value.replace(/[^\d^\.]+/g,'')"/>
	                    </b-form-fieldset>
	                </div>
	            </div>
	            <div class="row">
	            	 <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="实入总数量" label-text-align="right" :label-cols="4">
	                        <b-form-input placeholder="" v-model="addQuery.inNum" disabled=""/>
	                    </b-form-fieldset>
	                </div>
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="实入总金额" :label-cols="4" class="text-right">
	                    	<b-form-input placeholder="" v-model="addQuery.realMoney" disabled="" />
	                    </b-form-fieldset> 
	                </div>
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="单据时间" label-text-align="right" :label-cols="4" >
	                        <el-date-picker
							      v-model="addQuery.startTime"
							      type="date"
							      disabled=""
							      placeholder="选择日期">
							  </el-date-picker>
	                    </b-form-fieldset>
	                </div>
	            </div>
	            <div class="row">
	            	 
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="计划完成时间" :label-cols="4" class="text-right">
	                    	<el-date-picker
							      v-model="addQuery.endTime"
							      type="date"
							      :disabled="noDisable"
							      placeholder="选择日期">
							  </el-date-picker>
	                    </b-form-fieldset> 
	                </div>
	                <div class="col-md-4 col-lg-4">
	                    <b-form-fieldset horizontal label="单据状态" :label-cols="4" class="text-right">
	                    	 <b-form-input placeholder="" disabled="" v-model="addQuery.status"/>
	                    	<!--<b-form-select :options="billStatus"  v-model="addQuery.status" :disabled="noDisable"></b-form-select>-->
	                    </b-form-fieldset> 
	                    
	                </div>
	                <!--<div class="col-md-4 col-lg-4">
	                    <input type="tel" v-model="data.item.outNums" min="1"/>
	                    
	                </div>-->
	                
	            </div>
	            <div class="row">
            	 	
	            </div>
	            <div class="row">
	                <div class="col-md-12">
	                    <div class="pull-right">
	                    	<b-button  size="sm" variant="warning" @click="modify" v-show="showButtonT">修改</b-button>
	                    	<b-button  size="sm" variant="danger" @click="destroy" v-show="invalidBton">作废</b-button>
	                        <!--<b-button  size="sm" variant="default" @click="cancel" v-show="cancelButton">取消</b-button>-->
	                        <b-button  size="sm" variant="warning" @click="revocation" v-show="undo">撤销</b-button>
	                        <b-button  size="sm" variant="success" @click="save" v-show="onlyShowBton">保存</b-button>
	                        <b-button  size="sm" variant="success" @click="editOrder" v-show="showButton">保存</b-button>
	                        <b-button  size="sm" variant="success" @click="submitTable" v-show="showButtonSubmit">提交</b-button>
	                    </div>
	                </div>
	            </div>
            </b-form>
        </b-card>
        
        <b-card v-show="showTabel">
        <!-- <b-card> -->
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="danger" @click="deleItem" v-if="destroyBtn">删除</b-button>
                        <b-button size="sm" variant="success" @click="addItem" v-if="destroyBtn">新增</b-button>
                    </div>
                </div>
            </div>
			<el-tabs type="border-card" class="mt-3" id="tab-detail">
				  <el-tab-pane label="商品明细">
				  		<div class="table-scrollable">
			                <b-table striped hover bordered show-empty :items="tablelist1" :fields="fields_1" v-if="addQuery.billTypeSelected=='1'">
			                    <template slot="index" slot-scope="data">
			                        <div @click='getindex(data)'>
			                            <input type="radio" name="radio" :value="data.item.skuCode" v-model="selected" :disabled="subInputDisabled"/>
			                        </div>
			                    </template>
			                    <template slot="skuCode" slot-scope="data">
			                        <search 
			                        	v-show="data.item.skuCode == ''"
			                            ref="search"
			                            :hasCheck="required"
			                            :dataList="datalist"  
			                            option="skuName" 
			                            @dataChange="querySelect"
			                            @itemValue="itemValue"
			                            @clickShowBack="firstLoad(data.index)"
			                            @comScroll="comScroll"
			                            :disabled="isforbidden"
			                            >
			                            </search>
			                            <span v-show="data.item.skuCode != ''">{{data.item.skuCode}}</span>
			                    </template>
			                     <template slot="skuTempCode" slot-scope="data">
			                        <input type="text" v-model="data.item.skuTempCode" :disabled="subInputDisabled" style="width:90%"/>
			                    </template>
			                    <template slot="skuName" slot-scope="data">
			                    	{{data.item.skuName}}
			                    </template>
			                    <template slot="barCode" slot-scope="data">
			                        {{data.item.barCode}}
			                    </template>
			                    <template slot="originalCode" slot-scope="data">
			                        {{ data.item.originalCode }}
			                    </template>
			                    <template slot="externalCode" slot-scope="data">
			                       {{ data.item.externalCode }}
			                    </template>
			                    <template slot="brandName" slot-scope="data">
			                       {{ data.item.brandName }}
			                    </template>
			                    <template slot="skuStandards" slot-scope="data">
			                         {{ data.item.skuStandards }}
			                    </template>
			                    <template slot="skuModel" slot-scope="data">
			                        {{ data.item.skuModel }}
			                    </template>
			                    <template slot="purchaseUnitName" slot-scope="data">
			                         {{ data.item.purchaseUnitName }}
			                    </template>
			                    <template slot="availableNums" slot-scope="data">
			                    	{{data.item.availableNums}}
			                    </template>
			                    <template slot="stockNums" slot-scope="data">
			                    	{{ data.item.stockNums}}
			                    </template>
			                    <template slot="outNums" slot-scope="data">
			                    	<b-form-input  type="tel"  v-model="data.item.outNums"  :ref="'outNums'+data.index" min="0"  @change="countResidue(data.value,data.index)" :disabled="subInputDisabled"/>
			                    </template>
			                    <template slot="inNums" slot-scope="data">
			 						 {{ data.item.inNums ? data.item.inNums : 0 }}
			                    </template>
			                    <template slot="remainNums" slot-scope="data">
			                    	<!--<input type="hidden" v-model="data.item.outNums"/>-->
			                    	{{ data.item.remainNums ? data.item.remainNums :data.item.outNums - data.item.inNums }}
			                    </template>
			                    
			                    <template slot="empty">
			                        暂无数据...
			                    </template>
			                </b-table>
			            </div>
				  </el-tab-pane>
				  <el-tab-pane label="审批履历">
				  		<approvalRecord :orderNo="transferOutOrderNo" ref="myapproval"></approvalRecord>
				  </el-tab-pane>
			</el-tabs>
            

            <div class="row">
                <div class="col-md-12 col-lg-12 mt-3">
                    <div class="pull-right">
                        <b-button size="sm" variant="success" v-if="destroyBtn" @click="editDetail">保存</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        
    </div>
</template>
<script>
    import Vue from 'vue'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import {mapState, mapMutations, mapActions} from 'vuex'
    import { MessageBox, Message, DatePicker,Tabs,TabPane} from 'element-ui'
    import api from 'common/api'
    import common from 'common/common.js'
    import search from 'components/iris-search/search.vue'
    import config from 'common/config'
    import {hasBtn} from 'common/api-common.js'
    import approvalRecord from 'components/approval-record/approval-record'
    Vue.use(DatePicker)
    Vue.use(Tabs)
    Vue.use(TabPane)
    export default {
        components: {
            areaqueryshop,
            search,
            approvalRecord
        },
        data() {
            return {
            	transferOutOrderNo:'',
            	required: false,
            	datalist: [],
            	isforbidden: false,
            	showButton:false,
            	showButtonT:false,
            	showTabel:false,
            	noDisable:false,
            	invalidBton:false,
            	skuCodeEdit:false,
            	destroyBtn:true,
            	onlyShowBton:true,
            	showButtonSubmit:false,
            	cancelButton:true,
            	sublistShow:true,
            	undo:false,
            	editOne:1,
            	subInputDisabled:false,
            	statusOp:config.allotOut.billStatus,
				wfStatus:config.purchaseContract.approStatus,
            	billType:config.allotOut.billType,
            	billSubType:config.allotOut.billSubType,
            	billStatus:config.allotOut.billStatus,
            	pSupplyin:[],
            	pSupplyout:[],
            	
            	addQuery:{
            		id:'',
            		odd:'',
            		billTypeSelected:'1',
            		billTypeSubSelected:'0',
            		outNum:'',
            		inNum:'',
            		money:'',
					status:this.billuStatus(0),
					outStoreName:'',
					inStoreName:'',
					outStoreCode:'',
					inStoreCode:'',
					supplyin:'',
					supplyout:'',
					auditState:'',
					startTime:'',
					endTime:'',
					freight:'',
					realMoney:'',
					user:'',
					
            	},
            	submitStatus:0,
            	areaCodeIn:[],
            	areaCodeOut:[],
            	outWhCode:'',
            	inWhCode:'',
            	selected:'',
                
              	fields_1: {//调拨出库非整车数据列表
                    index: {
                        label: ' '
                    },
                    skuCode: {
                        label: 'SKU编码'
                    },
                    skuTempCode: {
                        label: '临时商品编码'
                    },
                    skuName: {
                        label: '商品名称'
                    },
                    barCode: {
                        label: '69码'
                    },
                    originalCode: {
                        label: '原厂编码'
                    },
                    externalCode: {
                        label: '外部编码'
                    },
                    brandName: {
                        label: '品牌'
                    },
                    skuStandards:{
                    	label:'规格'
                    },
                    skuModel: {
                        label: '型号'
                    },
                    purchaseUnitName: {
                        label: '采购单位'
                    },
                    availableNums: {
                        label: '当前库存'
                    },
                    usableKu: {
                        label: '可用库存'
                    },
                    outNums: {
                        label: '调出数量'
                    },
                    inNums: {
                        label: '实入数量'
                    },
                    remainNums: {
                        label: '剩余数量'
                    },
                },
                // 下拉数据
                tablelist1: [],
                tablelist2: [],
                selectParams: {
                    pageNums: config.pageNums,
                    pageStart: 1
                },
                cateState: '',
                cateState_:'',
                availableNums:[],
                deleList:[],
                addTable:[],
                deletIs:true,
                getIndex:null,
                realNums:null,
                editBefore:false,
            }
        },
        computed: {
            ...mapState('checkplan',[
                'condition'
            ]),
        },
        created() {
        	
        	this.getUser();
            
			//this.getAllotoutCode();
		},
		mounted(){
				this.judge();
				if(!this.$route.params.hasOwnProperty('transferOutOrderNo')){
	        		this.transferOutOrderNo = this.addQuery.odd
	        	}else{
	        		this.transferOutOrderNo = this.$route.params.transferOutOrderNo
	        	}
		},
        methods: {
            ...mapActions('checkplan',[
                'applicationAgain'
            ]),
            checkNum(){
            	
            },
            // 让出库选择框消失
            hideOut() {
                this.$refs.outareaqueryshop.hideFrame()
            },
            // 让入库选择框消失
            hideIn() {
                this.$refs.inareaqueryshop.hideFrame()
            },
            //获取下标
            getindex(data){
            	this.getIndex = data.index;
            },
            // 判断编辑与添加页面的方法
            judge(){
            	const _href=location.href.split('/');
            	if(_href.indexOf('add')!='-1'){
            		this.getAllotCode();
            	}else{
            	/*	this.invalidBton = true;*/
            		this.showTabel = true;
            		this.skuCodeEdit = true;
            		this.onlyShowBton = false;
            		//this.getSkuQuery();
            		this.getQuery();
            		if(_href.indexOf('details')!='-1'){
            			this.noDisable = false;
            		}
            		//this.destroy();
            	}
            },
            //撤销接口
            revocation(){
            	const _this = this;
                let option = {
					'transferOutOrderNo':this.addQuery.odd,
					'empToken':JSON.parse(common.getSession('userInfo')).empToken,
				}
                api.allotout.revocation(option, (res) => {
                    if(res.data.code === 'success') {
	                    _this.showButtonT = true;
	                    _this.cancelButton = false;
	                    _this.showButtonSubmit = true;
	                    _this.invalidBton = true;
	                    _this.undo = false;
	                    _this.destroyBtn = true;
	                    _this.subInputDisabled = false;
	                	_this.getQuery();
	                	Message({	
	       					message:'撤销成功',
	       					type:'success'
	       				})
                    }
                })
            },
            //提交接口
            submitTable(){
            	const _this = this;
                let option = {
					transferOutOrderNo:this.addQuery.odd,
					transferSkuType:this.addQuery.billTypeSelected,
					transferType:this.addQuery.billTypeSubSelected,
					orderStatus: this.submitStatus,
					wfStatus:this.addQuery.auditState,
					totalNums:this.addQuery.outNum,
					totalMoney:this.addQuery.money,
					realNums:this.addQuery.inNum,
					realMoney:this.addQuery.realMoney,
					totalFreightFee:this.addQuery.freight,
					estimatedArrivalDate:this.addQuery.endTime,
					billTime:this.addQuery.startTime,
					inStoreCode:this.addQuery.inStoreCode,
					outStoreCode:this.addQuery.outStoreCode,
					outWhCode:this.addQuery.supplyout,
					inWhCode:this.addQuery.supplyin,
					'empToken':JSON.parse(common.getSession('userInfo')).empToken,
				}
                if(this.addQuery.supplyin=='' || this.addQuery.supplyin == null){
	       			this.cateState_ = 'invalid';
	                return;
       			}
                else if(this.addQuery.supplyout=='' || this.addQuery.supplyin == null){
       				this.cateState= 'invalid';
	                return;
       			}else{
       				this.cateState = '';
       			}
                if(this.tablelist1.length == 0 ){
                	Message({
	       					message:'请添加商品明细',
	       					type:'warning'
	       				})
                	return;
                }
                if(this.isFalse()){
                	return
                }
                api.allotout.submitTable(option, (res) => {
                    if(res.data.code === 'success') {
	                    //执行下更新回调
	                    //只显示作废按钮
	                    _this.showButtonT = false;
	                    _this.cancelButton = false;
	                    _this.showButtonSubmit = false;
	                    _this.invalidBton = true;
	                    _this.undo = true;
	                	_this.getQuery();
	                	_this.subInputDisabled = true;
	                	Message({
	       					message:'提交成功',
	       					type:'success'
	       				})
                    }
                })
            },
            //判断库存为0
             isFalse(){
             	let flag = 0;
             	this.tablelist1.forEach(item=>{
               	 if(item.availableNums == 0 || item.stockNums == 0 ||item.availableNums == null || item.stockNums == null){
               	 	Message({
	       					message:'调出库存数量大于可用库存数量',
	       					type:'warning'
	       				})
                	flag++;
               	 }
               	})
             	 return flag
             },
            //作废接口
            destroy(){
            	const _this = this;
            	let hrefArr = location.href.split('/');
                let option;
                if(this.realNums > 0){
                	Message({
       					message:'已存在入库信息，不能作废',
       					type:'warning'
       				})
                	return
                }
                if(hrefArr.indexOf('add')!='-1'){
            		option= {
                    'transferOutOrderNo':_this.addQuery.odd,
                	};
            	}else{
            		 option = {
                    'transferOutOrderNo':hrefArr[hrefArr.length - 1],
                	};
            	}
            	MessageBox.confirm('此操作将永久废除该订单, 是否继续?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
	          			api.allotout.destroy(option, (res) => {
	          				this. getQuery();
		                    if(res.data.code === 'success') {
		                    	_this.undo = false;
		                    	Message({
						            type: 'success',
						            message: '废除成功!'
					          	});
		                    }
		                })
			        }).catch(() => {
			          Message({
			            type: 'info',
			            message: '已取消操作'
			          });          
			    });
            },
            //编辑页面获取子表信息
            getSkuQuery(){
            	const _this = this;
                const option = {
                    'transferOutOrderI':location.href.split('?')[1].split('=')[1],
                };
                api.allotout.seleSkuQuery(option, (res) => {
                    if(res.data.code === 'success') {
                    
                    }
                })
            },
            //编辑页面的获取明细单
            getQuery(){
            	let option;
            	if(!this.$route.params.hasOwnProperty('transferOutOrderNo')){
            		option= {
                    'transferOutOrderNo':this.addQuery.odd,
                     transferType:0,
                	};
            	}else{
            		 option = {
                    'transferOutOrderNo':this.$route.params.transferOutOrderNo,
                     transferType:0,
                	};
            	}
                api.allotout.selectQuery(option, (res) => {
                    if(res.data.code === 'success') {
                    	this.editOne = 0;
                    	const obj = res.data.obj;
                       this.addQuery.id=obj.id;
                       this.addQuery.statussave=obj.orderStatus;
                       this.addQuery.odd = obj.transferOutOrderNo;
                       this.addQuery.billTypeSelected = obj.transferSkuType;
                       this.addQuery.billTypeSubSelected = obj.transferType;
                       this.addQuery.outNum = obj.totalNums;
                       this.addQuery.inNum = obj.realNums;
                       this.addQuery.auditState=obj.wfStatus;
                       this.addQuery.supplyin= obj.inWhCode;
                       this.addQuery.supplyout= obj.outWhCode;
                       this.addQuery.inStoreName= obj.inStoreName;
                       this.addQuery.outStoreName= obj.outStoreName;
                       this.addQuery.money= obj.totalMoney;
                       this.addQuery.realMoney= obj.realMoney;
                       this.addQuery.startTime= obj.confirmOperatorTime;
                       this.addQuery.endTime= obj.estimatedArrivalDate;
                       this.addQuery.freight= obj.totalFreightFee;
                       this.addQuery.status= this.billuStatus(obj.orderStatus);
                       this.realNums = obj.realNums;
                       console.log(obj.transferOutSkuDetailInfoVoList)
                       if(obj.transferOutSkuDetailInfoVoList == null){
                       		this.tablelist1 = []
                       }else{
                       		this.tablelist1 = obj.transferOutSkuDetailInfoVoList;
                       }
                      this.btnStatus(obj.orderStatus);
                      this.$refs.inareaqueryshop.setselect({text:obj.inStoreName,value:obj.inStoreCode})
                      this.$refs.outareaqueryshop.setselect({text:obj.outStoreName,value:obj.outStoreCode})
                      // _this.addQuery.billTypeSubSelected = obj.transferType;
                    }
                })
            },
           // setValue(){}
            // 搜索框内值改变   触发搜索
	        querySelect(data) {
	            const _this = this;
	            _this.selectParams.pageStart = 1;
	            _this.selectParams.supplierName = data;
	             this.selectParams.skuType = "goodsTypeGood"
	            let params = _this.selectParams;
	            _this.getSupplierName(params, function(res) {
	            _this.isLastPage = res.isLastPage;
	            _this.datalist = res.list;
	            });
	        },
	        // 选中某一项    
	        itemValue(value) {
	            const _this = this;
	            let option = {
	            	skuCode:value.skuCode
	            }
	            for(let i = 0; i< _this.tablelist1.length; i++) {
	            	if(_this.tablelist1[i].skuCode == option.skuCode){
	            		Message({
	       					message:'商品信息已经存在',
	       					type:'warning'
	       				})
	            		return;
	            }};
	            _this.tablelist1[_this.index].skuCode = value.skuCode;
	            _this.availableNums = [];
	             api.allotout.queryStockInfoVosByCodeAndSku({
			            	whCode:_this.addQuery.supplyout,
			            	skuCodeSet:[value.skuCode],
			            },function(res){
			            	if(res.data.code == 'success'){
		            			 for(let k of Object.keys(res.data.obj)){
			            		 	_this.availableNums = res.data.obj[k];
			            		 }
		            			_this.getSupplierName(option, res => {
								if(res) {
									let obj = res
									for(let i = 0; i< _this.tablelist1.length; i++) {
										if(_this.tablelist1[i].skuCode === option.skuCode) {
											_this.tablelist1[i].transferOutOrderNo=_this.addQuery.odd;
											_this.tablelist1[i].outNums=obj.list[0].outNums;
											_this.tablelist1[i].originalCode=obj.list[0].originalCode;
											_this.tablelist1[i].externalCode=obj.list[0].externalCode;
											_this.tablelist1[i].brandName=obj.list[0].brandName;
											_this.tablelist1[i].skuStandards=obj.list[0].skuStandards;
											_this.tablelist1[i].skuModel=obj.list[0].skuModel;
											_this.tablelist1[i].purchaseUnitName=obj.list[0].purchaseUnitName;
											_this.tablelist1[i].skuTempCode=obj.list[0].tempSkuCode;
											_this.tablelist1[i].skuName=obj.list[0].skuName;
											_this.tablelist1[i].availableNums=_this.availableNums.availableNums;
											_this.tablelist1[i].stockNums=_this.availableNums.stockNums;
											_this.tablelist1[i].barCode = obj.list[0].barCode;
										}
									}
				         	}});
			            	}
			     })
	            
	         	 
	           
	        },
	         // 第一次加载数据
        firstLoad(index) {
            const _this = this
            _this.index = index
            if(_this.datalist.length != 0 ){
                return 
            }
            this.selectParams.skuType = "goodsTypeGood"
            let params = _this.selectParams
            _this.getSupplierName(params, function(res) {
                _this.isLastPage = res.isLastPage
                _this.datalist = res.list
            })
        },
         // 滚动加载
        comScroll(isEnd) {
            if (isEnd && !this.isLastPage) {
                this.selectParams.pageStart ++
                let params = this.selectParams;   
                this.selectParams.skuType = "goodsTypeGood"
                this.getSupplierName(params, obj => {
                    this.isLastPage = obj.isLastPage;
                    if(obj.list){
                        this.datalist = this.datalist.concat(obj.list);
                    }
                });
            }
        },
         // 定义向后台请求supplierName的方法
        getSupplierName(params,callback) {
            api.skuData.getInfo(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },
        //获取当前用户
        getUser(){
         let obj = JSON.parse(common.getSession('userInfo'));
         this.addQuery.user = obj.empVo.empCnName;
         console.log(this.addQuery.user)
        },
            //获取出库单号方法
            getAllotCode() {
            	const _this = this;
            	const option = {
                    'serviceCode': config.allotOut.seqCode,
                }
                api.ordinalInfo.getSequence(option, res => {
                    if (res.data.code === "success") {
                    	_this.addQuery.odd= res.data.obj
                    }
                })
            },
            //调拨出库地址
            selectedfun(data,data1){
			   const _this = this;
		    	if(this.editBefore){
			   	 	this.addQuery.supplyout = '';
			   	 	 //修改门店警示开始
		   		 	this.editStore(data1);
		   		 	//修改门店警示结束
			   }
			    if (data) {
					for (let i = 0; i < data.length; i++) {
						_this.areaCodeOut.push(data[i].code)
					}
					_this.addQuery.outStoreCode='';
				}
				if(data1) {
					_this.addQuery.outStoreCode = data1.value
				}
				const options = {
					'storeCodeSet' : []
				}
				if(data1.value) {
					_this.addQuery.outStoreCode = data1.value
				}
				options.storeCodeSet.push(data1.value);
				// 根据经销商店获取仓库
				api.getEntrepot(options, function(res){
					if(res.data.code === 'success') {
						_this.pSupplyout =[];
						const array = res.data.obj;
						for(var i =0; i< array.length; i++) {
							let obj = {}
							obj.text = array[i].warehouseName
							obj.value = array[i].warehouseCode
							_this.pSupplyout.push(obj)
						}
						_this.editOne=1;
					}
				})
			},
			//调拨入库地址
	   		selectedfunIn(data,data1){
			   const _this = this;
			   if(this.editBefore){
			   	 this.addQuery.supplyin = '';
			   }
			    if (data) {
					for (let i = 0; i < data.length; i++) {
						_this.areaCodeIn.push(data[i].code)
					}
					_this.addQuery.inStoreCode='';
				}
				if(data1) {
					_this.addQuery.inStoreCode = data1.value
				}
				if(data1.value) {
					_this.addQuery.inStoreCode = data1.value
				}
				const options = {
					'storeCodeSet' : []
				}
				options.storeCodeSet.push(data1.value)
				// 根据经销商店获取仓库
				api.getEntrepot(options, function(res){
					if(res.data.code === 'success') {
						_this.pSupplyin =[];
						const array = res.data.obj
						for(var i =0; i< array.length; i++) {
							let obj = {}
							obj.text = array[i].warehouseName
							obj.value = array[i].warehouseCode
							_this.pSupplyin.push(obj)
						}
					}
				})
			},
			//修改门店清空SKU编码商品公共方法
			editStore(data1){
            	if(!this.$route.params.hasOwnProperty('transferOutOrderNo')){
            		if(this.tablelist1.length > 0){
	   		   			if(data1){
		   		   		MessageBox.confirm('此操作将删除SKU商品明细表, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				        	this.publicDelet()
				        }).catch(() => {
				          Message({
				            type: 'info',
				            message: '已取消操作'
				          });          
					    });
			   		   }
	   		   		}
            	}else{
            		if(this.tablelist1.length == 0){
            			return
            		}
            		if(this.editOne){
	   		   			if(data1){
		   		   		MessageBox.confirm('此操作将删除SKU商品明细表, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
		          			this.publicDelet();
				        }).catch(() => {
				          Message({
				            type: 'info',
				            message: '已取消操作'
				          });          
					    });
			   		   }
	   		   		}
        		}
			},
            // 取消
            cancel(){
            	const _this = this
                _this.$router.push({
                    path : '/allotout/query'
                })
            },
            //删除操作
            publicDelet(){
            		this.deleList = [];
		          				//接口删除列表
				        	this.tablelist1.forEach((item)=>{
				        		this.deleList.push({
				        			id:item.id,
				        			isDeleted:1,
				        			transferOutDetailCode:item.transferOutDetailCode,
				        			transferOutOrderNo:item.transferOutOrderNo
				        		})
				        	})
			        	   api.allotout.editDetail(this.deleList, (res) => {
			                    if(res.data.code === 'success') {
			                    	/*_this.getQuery();*/
			                    	this.tablelist1 =[];
			                    	Message({
				       					message:'删除成功',
				       					type:'success'
				       				})
			                     
			                    }
			                })
            },
           //修改
           modify(){
           	this.noDisable=false;
           	this.showButtonT = false;
           	this.showButtonSubmit = false;
           	this.showButton = !this.showButton;
           	//判断第一次加载后，修改验证状态
           	this.editBefore = true ;
           },
           //编辑修改
           editOrder(){
           		if(this.addQuery.supplyin==''){
	       			this.cateState_ = 'invalid';
	                return;
       			}else if(this.addQuery.supplyout==''){
       				this.cateState= 'invalid';
	                return;
       			}else{
       				this.cateState = '';
       			}
       			if(this.addQuery.supplyin == this.addQuery.supplyout){
       				Message({
       					type:'warning',
       					message:'调入仓库与调出仓库相同'
       				})
       				return
       			}
       			let _this =this;
       			let option = {
       				id:this.addQuery.id,
					transferOutOrderNo:this.addQuery.odd,
					transferSkuType:this.addQuery.billTypeSelected,
					transferType:this.addQuery.billTypeSubSelected,
					orderStatus:this.submitStatus,
					wfStatus:this.addQuery.auditState,
					totalNums:this.addQuery.outNum,
					totalMoney:this.addQuery.money,
					realNums:this.addQuery.inNum,
					realMoney:this.addQuery.realMoney,
					totalFreightFee:this.addQuery.freight,
					estimatedArrivalDate:common.eleTimeFormatim2(this.addQuery.endTime),
					billTime:common.eleTimeFormatim2(this.addQuery.startTime),
					inStoreCode:this.addQuery.inStoreCode,
					outStoreCode:this.addQuery.outStoreCode,
					outWhCode:this.addQuery.supplyout,
					inWhCode:this.addQuery.supplyin,
				}
                api.allotout.editQuery(option, (res) => {
                    if(res.data.code === 'success') {
                		_this.showTabel = true;
           				_this.showButton = !this.showButton;
           				_this.noDisable=true;
           				_this.showButtonT = true;
           				_this.showButtonSubmit = true;
           				_this.cateState = '';
           				_this.cateState_='';
           				Message({
	       					message:'修改成功',
	       					type:'success'
	       				})
                    }
                })
           },
           //添加保存
           	save(){
           		let _this =this;
       			let option = {
					transferOutOrderNo:this.addQuery.odd,
					transferSkuType:this.addQuery.billTypeSelected,
					transferType:this.addQuery.billTypeSubSelected,
					orderStatus:this.submitStatus,
					wfStatus:this.addQuery.auditState,
					totalNums:this.addQuery.outNum,
					totalMoney:this.addQuery.money,
					realNums:this.addQuery.inNum,
					realMoney:this.addQuery.realMoney,
					totalFreightFee:this.addQuery.freight,
					estimatedArrivalDate:common.eleTimeFormatim2(this.addQuery.endTime),
					billTime:this.addQuery.startTime,
					inStoreCode:this.addQuery.inStoreCode,
					outStoreCode:this.addQuery.outStoreCode,
					outWhCode:this.addQuery.supplyout,
					inWhCode:this.addQuery.supplyin,
					/*confirmOperatorName:this.addQuery.user,*/
				}
       			if(this.addQuery.supplyin==''){
	       			this.cateState_ = 'invalid';
	                return;
       			}else if(this.addQuery.supplyout==''){
       				this.cateState= 'invalid';
	                return;
       			}else{
       				this.cateState = '';
       			}
       			if(this.addQuery.supplyin == this.addQuery.supplyout){
       				Message({
       					type:'warning',
       					message:'调入仓库与调出仓库相同'
       				})
       				
       				return
       			}
		 		api.allotout.addQuery(option, (res) => {
                    if(res.data.code === 'success') {
                    	_this.onlyShowBton = false;
                		_this.showTabel = true;
           				_this.noDisable=true;
           				_this.showButtonT = true;
           				_this.showButton = false;
                    	_this.showButtonSubmit = true;
                    	_this.invalidBton = true;
                    	_this.addQuery.id = res.data.obj.id;
                    	_this.cateState = '';
                    	_this.cateState_ ='';
           				Message({
	       					message:'主表信息保存成功',
	       					type:'success'
	       				})
                    }
                })
       			
                
                
           },
          
           
           //新增条目
           addItem(){
			const _this = this;
           	if(this.tablelist1.length==0){
           		this.pushItem();
           	}else{
           		let judge = true;
	       		this.tablelist1.forEach(function(item,index){
	       			console.log(item.skuCode)
	       			if(item.skuCode === ''){
	       				Message({
	       					message:'请选择SKU编码',
	       					type:'warning'
	       				})
	       				judge = false;
	       			}else {
	       				judge = true
	       			}
	       		});
	       		if(judge){
	       			_this.pushItem();
	       			
	       		}
	       		
           	}
           },
           //编辑产品明细,
           editDetail(){
           		let _this =this;
           		for(let i = 0; i < _this.tablelist1.length; i++) {
           					if(_this.tablelist1[i].skuCode == '') {
                                Message({
			       					message:'请选择商品的SKU编码',
			       					type:'warning'
			       				})
                                return;
                            }
                            if(_this.tablelist1[i].outNums <= 0) {
                                Message({
			       					message:'商品的调出数量不能为空且必须大于0',
			       					type:'warning'
			       				})
                                return;
                            }
            	}
           		if(this.isFalse()){
                	return
                }
   				const option = _this.tablelist1
                api.allotout.editDetail(option, (res) => {
                    if(res.data.code === 'success') {
                    	_this.getQuery();
                    	Message({
	       					message:'子表商品明细信息保存成功',
	       					type:'success'
	       				})
                     
                    }
                })
           },
           //生成明细编码
           getDetailCode() {
            	const _this = this;
            	const option = {
                    'serviceCode': config.allotOut.salesCode,
                }
                api.ordinalInfo.getSequence(option, res => {
                    if (res.data.code === "success") {
                    	_this.tablelist1.push({
	           	 	        transferOutOrderNo:_this.addQuery.odd,
	           	 	        transferOutDetailCode:res.data.obj,
			           		skuCode:'',
			           		skuTempCode:'',
			           		skuName:'',
			           		barCode:'',
			           		originalCode:'',
			           		externalCode:'',
			           		brandName:'',
			           		skuStandards:'',
			           		skuModel:'',
			           		purchaseUnitName:'',
			           		currentKu:'',
			           		usableKu:'',
			           		outNums:0,
			           		inNums:'',
			           		remainNums:'',
           				})
                    	_this.addTable = _this.tablelist1;
                    }
                })
            },
            
           //新增条目公共方法,非整车
           pushItem(){
           	this.getDetailCode();
           	console.log(this.selected )
           	this.selected = '-1'
          
           },
          //删除条目，非整车
          deleItem(){
          	//查一遍数据
          	    const _this = this;
            	const hrf = location.href.split('/');
            	let option;
            	if(hrf.indexOf('add')!='-1'){
            		option= {
                    'transferOutOrderNo':_this.addQuery.odd,
                	};
            	}else{
            		 option = {
                    'transferOutOrderNo':hrf[hrf.length - 1],
                	};
            	}
            	console.log(this.getIndex)
            	if(_this.selected == '' && this.tablelist1[this.getIndex].skuName != ''){
            		Message({
	       					message:'请选择一条数据',
	       					type:'warning'
	       				})
            		return
            	}else{  
            		api.allotout.selectQuery(option, (res) => {
	                    if(res.data.code === 'success') {
	                      let arry = res.data.obj.transferOutSkuDetailInfoVoList;
	                      if(arry == null){
	                      	 this.tablelist1.splice(this.getIndex, 1);
	                      	   const Index = this.tablelist1.findIndex(v=>v.skuCode == '')
			                       if(Index!= -1){
			                       	this.tablelist1.splice(Index, 1);
			                      	this.addItem();
			                       }
	                      	return 
	                      }else{
	                      		let index = arry.findIndex(v => v.skuCode == _this.selected );
			                      if(index != -1){
			                      	   _this.deleList = [];
			                      		 _this.deleList.push({
			                                	id:_this.tablelist1[index].id,
			                                	isDeleted:1,
			                                	transferOutDetailCode:_this.tablelist1[index].transferOutDetailCode,
			                                	transferOutOrderNo:_this.tablelist1[index].transferOutOrderNo
			                                })
			                      	   api.allotout.editDetail(_this.deleList, (res) => {
						                    if(res.data.code === 'success') {
						                    	_this.getQuery();
						                    	Message({
							       					message:'删除成功',
							       					type:'success'
							       				})
						                     
						                    }
						                })
			                      }
			                       _this.tablelist1.splice(this.getIndex, 1);
			                        const Index = this.tablelist1.findIndex(v=>v.skuCode == '')
			                       if(Index!= -1){
			                       	this.tablelist1.splice(Index, 1);
			                      	this.addItem();
			                       }
			                       
			                      
	                      }
	                      
	                 		
	                    }
                	})
            	}
                
           },
            // 获取盘点单号
           getCheckCode() {
                const _this = this
                const option = {
                    'serviceCode': config.checkTicket.seqCode
                }
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {
                        _this.checkCode = res.data.obj
                        _this.tempTicketJudge = 1
                    }
                })
            },
            // 搜索框内值改变   触发搜索 
            querySelect(data) {
                console.log(data)
                const _this = this
                _this.selectParams.pageStart = 1;
                _this.selectParams.skuCodeOrName = data;
                 this.selectParams.skuType = "goodsTypeGood"
                let params = _this.selectParams; 
                console.log(params)
                _this.getSupplierName(params, function(res) {
                    _this.isLastPage = res.isLastPage
                    _this.datalist = res.list              
                })
            },
            // 滚动加载
            comScroll(isEnd) {
                if (isEnd && !this.isLastPage) {
                    this.selectParams.pageStart ++
                     this.selectParams.skuType = "goodsTypeGood"
                    let params = this.selectParams;  
                    this.getSupplierName(params, obj => {
                        this.isLastPage = obj.isLastPage;
                        this.datalist = this.datalist.concat(obj.list);
                    });
                }
            },
          	//单据状态
         	billuStatus(num){
		    	let text = '';
		    	switch (num)
					{
					case 0:
					  text="未生效";
					  break;
					case 1:
					  text="已提交";
					  break;
					case 2:
					 text="已生效";
					  break;
					case 3:
					 text="已完成";
					  break;
					case 4:
					 text="已关闭";
					  break;
					case -1:
					  text="作废";
					  break;
					};
				 return text;
		    },
		    //根据状态判断按钮显示
		    btnStatus(num){
		    	const _this = this;
		    	const _href=location.href.split('/');
		    	if(_href.indexOf('details')!='-1'){
    				  _this.showButton = false;
					  _this.noDisable=true;
					  _this.cancelButton = false;
					  _this.showButtonT = false;
					  _this.invalidBton = false;
					  _this.destroyBtn = false;
					  _this.subInputDisabled = true;
					  _this.showButtonSubmit = false;
					  _this.sublistShow = false;
					  
            		}else{
            			switch (num){
							case 0:
							 _this.showButtonSubmit = true;
							  _this.showButton = false;
							  _this.showButtonT = true;
							  _this.invalidBton = true;
							  _this.noDisable=true;
							  break;
							case 1:
							  _this.noDisable=true;
							  _this.invalidBton = true;
							  _this.cancelButton = false;
							  _this.destroyBtn = false;
							  _this.undo = true;
							  break;
						  	case 2:
						  	  _this.noDisable=true;
							  _this.invalidBton = true;
							  _this.cancelButton = false;
							  _this.destroyBtn = false;
							  _this.subInputDisabled = true;
							  break;
							 case 3:
						  	  _this.noDisable=true;
							  _this.invalidBton = false;
							  _this.cancelButton = false;
							  _this.destroyBtn = false;
							  _this.subInputDisabled = true;
							  break;
							case -1:
							  _this.showButton = false;
							  _this.noDisable=true;
							  _this.cancelButton = false;
							  _this.showButtonT = false;
							  _this.invalidBton = false;
							  _this.destroyBtn = false;
							  _this.showButtonSubmit = false;
							  _this.sublistShow = false;
							   _this.undo = false;
							  break;
							};
        		}
		    	
		    },
		    //计算剩余数量
		    countResidue(val,index){
		    	let _this = this;
		    	if(val< 0){
					this.tablelist1[index].outNums = 0;
					 val = 0;
				}
				_this.tablelist1[index].remainNums = parseFloat(val);
				_this.tablelist1 = JSON.parse(JSON.stringify(_this.tablelist1))
				
		    },
        },
        watch:{
        	addQuery:{
        		handler(newval, oldval){
        		if(newval.billTypeSubSelected=='1'){
        			this.fields_1 = {
        				index: {
                        label: ' '
                    },
                    skuCode: {
                        label: 'SKU编码'
                    },
                    temGoodsCode: {
                        label: '临时商品编码'
                    },
                    goodsName: {
                        label: '商品名称'
                    },
                    barCode: {
                        label: '69码'
                    },
                    originalCode: {
                        label: '原厂编码'
                    },
                    externalCode: {
                        label: '外部编码'
                    },
                    brand: {
                        label: '品牌'
                    },
                    spec:{
                    	label:'规格'
                    },
                    model: {
                        label: '型号'
                    },
                    unit: {
                        label: '单位'
                    },
                    availableNums: {
                        label: '当前库存'
                    },
                    usableKu: {
                        label: '可用库存'
                    },
                    unitCost: {
                        label: '单位成本'
                    },
                    salesPrice: {
                        label: '销售定价'
                    },
                    exportNum: {
                        label: '调出数量'
                    },
                    runInNum: {
                        label: '实入数量'
                    },
                    resNum: {
                        label: '剩余数量'
                    },
        			}
        		}else{
        			this.fields_1 = {
        			 index: {
                        label: ' '
                    },
                    skuCode: {
                        label: 'SKU编码'
                    },
                    skuTempCode: {
                        label: '临时商品编码'
                    },
                    skuName: {
                        label: '商品名称'
                    },
                    barCode: {
                        label: '69码'
                    },
                    originalCode: {
                        label: '原厂编码'
                    },
                    externalCode: {
                        label: '外部编码'
                    },
                    brandName: {
                        label: '品牌'
                    },
                    skuStandards:{
                    	label:'规格'
                    },
                    skuModel: {
                        label: '型号'
                    },
                    purchaseUnitName: {
                        label: '采购单位'
                    },
                    stockNums: {
                        label: '当前库存'
                    },
                    availableNums: {
                        label: '可用库存'
                    },
                    outNums: {
                        label: '调出数量'
                    },
                    inNums: {
                        label: '实入数量'
                    },
                    remainNums: {
                        label: '剩余数量'
                    },
        			}
        		};
        		},
        		deep:true
        		
        	}
        }
    }
</script>
<style>
.modal-dialog {
    margin: 80px auto !important;
}
#tab-detail .table {
    position: static !important;
}

</style>
