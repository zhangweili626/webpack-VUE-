<template>
	<div>
	<div class="row">
        <div class="col-md-12">
            <b-card header="主档信息">
                <div class="row">
                	 <div class="col-md-4">
                        <b-form-fieldset horizontal label="组合编码" :label-cols="4" class="text-right">
                            <b-form-input  v-model="group.combinationCode" readonly/>
                        </b-form-fieldset>
                    </div>
                    
                    
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="组合名称*" :label-cols="4" class="text-right">
                           <b-form-input  v-model="group.combinationName" :state="check.name" :readonly="inputReadOnly"/>
                        </b-form-fieldset>
                    </div>
                      <div class="col-md-4">
                        <b-form-fieldset horizontal label="组合分类*" :label-cols="4" class="text-right">
                            <groupGoryTree  @getgroupGory="getgroupGory" ref="orgSelect" :checkgroy="check.groy" :isreadonly="isreadonly" :params="comGroy"></groupGoryTree>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="组合目录*" :label-cols="4" class="text-right">
                           <groupLogTree  @getgroupLog="getgroupLog" ref="orgSelect" :checklog="check.log" :isreadonly="isreadonly" :params="comLog"></groupLogTree>
                        </b-form-fieldset>
                    </div>
                   <div class="col-md-4">
                        <b-form-fieldset horizontal label="商品分类" :label-cols="4" class="text-right">
                            <groyTree  @getSaleGory="getSaleGory1" ref="orgSelect" :isreadonly="isreadonly" :params="saleGroy"></groyTree>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="商品目录" :label-cols="4" class="text-right">
                           <logTree  @getSaleLog="getSaleLog1" ref="orgSelect" :isreadonly="isreadonly" :params="saleLog"></logTree>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="生效时间*" :label-cols="4" class="text-right">
                        	<el-date-picker
							v-model="time"
							type="daterange"
							:state="false"
							:readonly="inputReadOnly"
							:disabled="inputReadOnly"
							@change="datechange()"
							:clearable="true"
							range-separator="至"
							start-placeholder="开始日期"
							:picker-options="endPickerOptions"
							:class="{redborder:warning}"
							end-placeholder="结束日期">
						</el-date-picker>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-4">
                        <b-form-fieldset horizontal label="组合备注" :label-cols="4" class="text-right">
                            <b-form-input  v-model="group.remark" :readonly="inputReadOnly" />
                        </b-form-fieldset>
                    </div>

                </div>
                <div class="row">
	                <div class="col-md-12">
	                    <div class="pull-right">
	                    	<b-button  size="sm" variant="warning" v-if="editBtn" @click="editBtnClick">修改</b-button>
	                        <b-button  size="sm" variant="default" v-if="cancelBtn" @click="cancel">取消</b-button>
	                        <b-button  size="sm" variant="success" @click="addCombinationInfo" v-if="saveBtn">保存</b-button>
	                         <b-button  size="sm" variant="success" @click="putaway" v-if="onBtn" >上架</b-button>
	                          <b-button  size="sm" variant="danger" @click="soldOut" v-if="offBtn">下架</b-button>
	                        <b-button  size="sm" variant="success" @click="editCombinationInfo" v-if="editSaveBtn">保存</b-button>
	                    </div>
	                </div>
	            </div>
            </b-card>
        </div>
    </div>
    <div class="row" v-if="showSubTab">
    	<div class="col-md-12">
    		<b-card header="附加信息字段">
                <div>
                	<el-tabs type="border-card">
					  <el-tab-pane label="SKU商品/服务设置">
					  	<tab :combinationCode="group.combinationCode"></tab>
					  </el-tab-pane>
					  <el-tab-pane label="组合销售价格">
					  	<CombSalePrice :combinationCode ="group.combinationCode"></CombSalePrice>
					  </el-tab-pane>
					  <el-tab-pane label="适用范围">
					  	<div class="animated fadeIn">
							<scope ref="scope" :multipleSelection="true" :fields="fields" @deletScopeBtn="removetr"  :addscope="addscope" :tablist="useRanges"></scope>                    
	                       <!-- <suit-scope @shop-preserve="shopPreserve" 
	                           @sales-preserve="salesPreserve"
	                           @remove-tr="removetr" 
	                           :tab-data="useRanges">
	                      </suit-scope> -->
	                   </div> 
					  </el-tab-pane>
					</el-tabs>
                </div>
    		</b-card>
    	</div>
    </div>
    
    </div>
</template>
<script>
import { mapActions,mapState, mapMutations } from 'vuex'
import logTree from './saleLogTree'
import groyTree from './salegoryTree'
import groupLogTree from './groupLogTree'
import groupGoryTree from './groupGoryTree'
import config from 'common/config'
import common from 'common/common'
import api from 'common/api'
import Vue from 'vue'
import tab from './tab1'
import CombSalePrice from './CombSalePrice'
import scope from"components/iris-scope/"
import suitScope from 'components/iris-suitscope'
import { MessageBox, Message, DatePicker,Tabs,TabPane  } from 'element-ui'
Vue.use(DatePicker)
Vue.use(Tabs)
Vue.use(TabPane)
export default {
    components: {
        logTree,
        groyTree,
        tab,
        CombSalePrice,
        scope,
        suitScope,
        groupLogTree,
        groupGoryTree,
    },
    props: {
        statusOptions: [Array]
    },
    data() {
        return {
        	endPickerOptions: {
			   disabledDate(time) {
			       let timeSpace = time.getTime() <= Date.now() - 8.64e7;
			            return timeSpace;
			        }
		    },
			fields:[{label:"销售区域",name:"salesAreaName",},{label:"行政区域",name:"chinaAreaName",},{label:"门店",name:"storeName"}],                			
        	isreadonly:false,
        	warning:false,
        	showSubTab:false,
        	saleLog:{
        		orgName:''
        	},
        	saleGroy:{
        		orgName:''
        	},
        	comLog:{
        		orgName:''
        	},
        	comGroy:{
        		orgName:''
        	},
        	inputReadOnly:false,
        	editBtn:false,
        	cancelBtn:true,
        	saveBtn:true,
        	editSaveBtn:false,
        	time:[],
        	combinationNameState:null,
        	comId:'',
            group: {
            	combinationCode:'',
                categoryCode: '',
                catlogCode:'',
                combinationName:'',
                endTime:'',
                startTime:'',
                remark:"",
                combinationCatlogCode:'',
                combinationCategoryCode:'',
            },
            params:{
					orgName: ''
			},
			check:{
				name:null,
				log:null,
				groy:null,
				time:null,
			},
             useRanges: [],
             putway:[{
             	'id':'',
              	'onOffFlag':1,
	  	    	'combinationCode':'',
	  	    	'combinationName':'',
             }],
             onBtn:false,
             offBtn:false,
             
        }
    },
    created() {
        this.$route.params.hasOwnProperty('combinationCode')
            ? this.group.combinationCode = this.$route.params.combinationCode
            : this.getCode();
        this.isEdit();
    },
    mounted(){
    	  const _this = this;
	  	if(this.$route.params.hasOwnProperty('combinationCode')){
	  		this.getSkuCombUseRangeList({
                    'combinationCode': _this.$route.params.combinationCode
            })
	  	}
    	  
    },
    computed: {
       ...mapState('skuComb',[
       		'skuCombUseRangeList',
		]),
    },
    methods: {
    	...mapActions('skuComb',[
    			'getSkuCombCode',
				'editCombinationInfos',
				'getCombinationInfo',
				'editSkuCombUseRangeList',
				'getSkuCombUseRangeList',
			]),
			addscope(code,data){
				const _this = this;
				if(Array.isArray(data)){
					//批量
					api.ordinalInfo.getSequenceList({
					'serviceCode': 'CARDTMPUSERANGESEQ',
					'getNums': data.length
					},(msg) => {
						if(msg.data.message == 'success'){
							let SEQ = msg.data.obj
							let list = []
							let codes = []
							console.log(data)
								if(code == config.scopeType.sales){
									for (let index = 0; index < SEQ.length; index++) {
										const element = SEQ[index];
										codes.push(data[index].code)
										
										list[index]={
											rangeCode:element,
											combinationCode: this.$route.params.hasOwnProperty('combinationCode') ? this.$route.params.combinationCode : this.group.combinationCode,
											salesAreaCode:data[index].code,
											salesAreaName:data[index].name,
										}
									}
								}
								if(code == config.scopeType.shop){
									for (let index = 0; index < SEQ.length; index++) {
										const element = SEQ[index];
										codes.push(data[index].code)
										list[index]={
											rangeCode:element,
											combinationCode:  this.$route.params.hasOwnProperty('combinationCode') ? this.$route.params.combinationCode : this.group.combinationCode,
											storeCode:data[index].code,
											storeName:data[index].name,
										}
									}
								}
								if(code == config.scopeType.government){
									for (let index = 0; index < SEQ.length; index++) {
										const element = SEQ[index];
										codes.push(data[index].code)
										list[index]={
											rangeCode:element,
											combinationCode: this.$route.params.hasOwnProperty('combinationCode') ? this.$route.params.combinationCode : this.group.combinationCode,
											chinaAreaCode:data[index].code,
											chinaAreaName:data[index].name,
										}
									}
								}
							let str = ""
							for (let j = 0; j < _this.useRanges.length; j++) {
								const element = _this.useRanges[j];
								if(codes.includes(element.code)){
									str += element.name + ' '
								}
							}
							if(str!==""){
								MessageBox.confirm(`${str}已存在！`, '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
								}).catch(() => {
								});
								return;
							}
							api.skuComb.addOrUpdateCombinationUseRangeBatch(list,(msg)=>{
								if(msg.data.message == 'success'){
									Message({
										type: 'success',
										message: '保存成功！'
									});
									_this.$refs.scope.activePage()   
									
										this.getSkuCombUseRangeList({
												'combinationCode': this.$route.params.hasOwnProperty('combinationCode') ? this.$route.params.combinationCode : this.group.combinationCode
										})
									
								}                    
							})
						} 
					})
					
				}else{
					//单条
				}
			},
		  //返回
		  cancel(){
		  	this.$router.push({
		  		path:'/skuComb/query'
		  	})
		  },
		  //判断是新增还是编辑
		  isEdit(){
		  	if(this.$route.params.hasOwnProperty('combinationCode')){
		  		this.offBtn = true;
		  		this.saveBtn = false;
		  		this.editBtn = true;
		  		this.inputReadOnly = true;
		  		this.showSubTab = true;
		  		 this.isreadonly = true
		  		this.getComInfo()
		  	}
		  },
		  //获得组合信息
		  getComInfo(){
		  	 
		  	api.skuComb.queryCombinationInfoForPageByVo({'combinationCode':this.$route.params.combinationCode},(res)=>{
		  		if(res.data.code == 'success'){
			  		for(let k of Object.keys(this.group)){
			  			this.group[k]= res.data.obj.list[0][k];
			  			this.group.id = res.data.obj.list[0].id;
			  			this.saleLog.orgName = res.data.obj.list[0].catlogName;
			  			this.saleGroy.orgName = res.data.obj.list[0].categoryName;
			  			this.comLog.orgName = res.data.obj.list[0].combinationCatlogName;
			  			this.comGroy.orgName = res.data.obj.list[0].combinationCategoryName;
			  			if(res.data.obj.list[0].onOffFlag == '0'){
			  				this.offBtn = false;
			  				this.onBtn = true
			  			}
	  				};
  			  	let startTimeArr 
                let endTimeArr
                let obj = res.data.obj.list[0]
	  			if(obj.startTime){
                    startTimeArr = obj.startTime.substring(0,10)
                    startTimeArr = startTimeArr.split('-');
                    
                }
                if(obj.endTime) {
                    endTimeArr = obj.endTime.substring(0,10)
                    endTimeArr = endTimeArr.split('-')
                };
              
	  			if(obj.startTime&&obj.endTime) {
                    this.time = [new Date(startTimeArr[0]-0, (startTimeArr[1]-0)-1, startTimeArr[2] -0), new Date(endTimeArr[0]-0,(endTimeArr[1]-0)-1, endTimeArr[2] - 0)]
                }
		  		for(let k of Object.keys(this.putway[0])){
		  			this.putway[0][k] = res.data.obj.list[0][k];
		  		}
		  		}
	
		  	})
		  },
		  editBtnClick(){
		  	this.inputReadOnly = false
		  	this.saveBtn = false;
		  	this.editBtn = !this.editBtn
		  	this.editSaveBtn = true
		  	this.isreadonly = false
		  },
		  //上架
		  putaway(){
		  	    this.putway[0].onOffFlag = 1;
		  		api.skuComb.editCombinationInfos(this.putway,(res)=>{
            		if(res.data.code ==='success'){
            			 this.onBtn = false;
            			 this.offBtn = true;
            			  Message({
		                       type: 'success',
		                       message:'上架成功'
		                    })
            		}
            	})
		  },
		  //下架
		  soldOut(){
		  	   this.putway[0].onOffFlag = 0;
		  		api.skuComb.editCombinationInfos(this.putway,(res)=>{
            		if(res.data.code ==='success'){
            			 this.onBtn = true;
            			 this.offBtn = false;
            			  Message({
		                       type: 'success',
		                       message:'下架成功'
		                    })
            		}
            	})
		  },
		  getSaleLog1(val){
          	this.group.catlogCode = val.catlogCode
          },
          getSaleGory1(val){
          	this.group.categoryCode = val.categoryCode
          },
          //组合
           getgroupLog(val){
          	this.group.combinationCatlogCode = val.catlogCode
          },
          getgroupGory(val){
          	this.group.combinationCategoryCode = val.categoryCode
          },
		 //获取组合编码
		 getCode(){
		 	 const _this = this;
		 	  _this.getSkuCombCode({
                    callback: (skuCombCode) => {
                        _this.group.combinationCode = skuCombCode
                    }
                })
		 },
		 //新增主表
		 addCombinationInfo: function() {
		 	   if(this.group.combinationName == ''){
			 	   	this.check.name = false
			 	   	return
		 	   }
		 	   if(this.group.combinationCategoryCode == ''){
			 	   	 this.check.groy = false
			 	   	 return
		 	   }
		 		if(this.group.combinationCatlogCode == ''){
			 	   	 this.check.log = false
			 	   	 return
		 	   }
		 	    if(this.time == ''){
			 	   	 this.warning = true
			 	   	 return
		 	   }
		 	    let arriveTime = common.formattingTime(this.time)
                this.group.startTime = arriveTime.startTime
                this.group.endTime = arriveTime.endTime
                let _this = this
                api.skuComb.editCombinationInfos([_this.group],(res) => {
		            if (res.data.code === 'success') {
		                let list = res.data.obj
		                if (list != null && list.length > 0) {
		                    _this.comId = list[0].id
		                }
		                this.editBtn = !this.editBtn
			        	this.saveBtn = !this.saveBtn
			        	this.editSaveBtn = false
			        	this.inputReadOnly = true
			        	this.showSubTab = true
			        	this.isreadonly = true
			        	//校验去红框
			        	this.check.name = null
			        	this.check.log = null
			        	this.check.groy = null
			        	this.warning = false
		               Message({
		       	    		type: 'success',
					        message: '新增主表成功'
		       	    	})
		            }
        		})
            },
         //编辑主表
		 editCombinationInfo: function(){
                let _this = this
                if(!this.$route.params.hasOwnProperty('combinationCode')){
                	 _this.group.id =  _this.comId;
                }
                let arriveTime = common.formattingTime(this.time)
                this.group.startTime = arriveTime.startTime
                this.group.endTime = arriveTime.endTime
                api.skuComb.editCombinationInfos([_this.group],(res) => {
		            if (res.data.code === 'success') {
		            this.inputReadOnly = true
		            this.editBtn = true
		            this.editSaveBtn = false
		            this.isreadonly = true
		               Message({
		       	    		type: 'success',
					        message: '主表保存成功'
		       	    	})
		            }
        		})
            },
         datechange() {
            //    console.log(this.time)
            },
         //名称验证信息
         checkValues: function() {
                let _this = this
                if(_this.group.name == '') {
                    _this.combinationNameState = 'invalid'
                    return false
                } else {
                    _this.combinationNameState = null
                } 
                return true
            },
        //适用范围
       	 removetr: function(items) {
                let _this = this
				items.combinationCode = this.group.combinationCode
				items.isDeleted = '1'
                // if(items.length > 0) {
                //    items.forEach((item) => {
                //        item.isDeleted = '1'
                //    })
                // }
				_this.editSkuCombUseRangeList([items]) 
            },
          salesPreserve: function(data) {
                let _this = this
                if (data) {
                   let arr = []
                   data.forEach((item) => {
                       arr.push({
                           combinationCode: this.group.combinationCode,
                           rangeCode: item.rangeCode,
                           rangeType: item.rangeType,
                           remark: item.remark,
                           salesAreaCode: item.salesAreaCode
                       })
                   })  
                   _this.editSkuCombUseRangeList(arr) 
                }
            },
         shopPreserve: function(data) {           
                let _this = this
                if (data) {
                    let arr = []
                    data.forEach((item) => {
                        arr.push({
                            combinationCode: this.group.combinationCode,
                            rangeCode: item.rangeCode,
                            rangeType: item.rangeType,
                            remark: item.remark,
                            storeCode: item.storeCode 
                        })
                    })
                    _this.editSkuCombUseRangeList(arr)
                }
            },
    },
    watch:{
    	 skuCombUseRangeList: {
                handler(data) {
                    let _this = this
					_this.useRanges = []
					console.log(data)
                    data.forEach((item) => {
                        _this.useRanges.push(item)
                    })
                },
                deep: true
            },
    }
}
</script>
<style>
	.redborder{
		border:1px solid #f86c6b
	}
</style>
