<template>
	<div class="animated fadeIn service-edit">
	    <!-- 查询 -->
	    <b-card header="服务推荐">
	        <div class="row">
	            <div class="col-md-4">
					<b-form-fieldset horizontal label="服务名称" :label-cols="4" class="text-right">
						<div class="text-left">
							<search
								ref="search"
								:dataList="datalist"
								:disabled="disabled"
								option="serviceName"
								@dataChange="querySelect"
								@itemValue="itemClick"
								@clickShowBack="firstLoad"
								@clearValue="clearValue"
								@comScroll="scrollBottom">
							</search>
						</div>
					</b-form-fieldset>
	            </div>
	            <div class="col-md-4">
					<b-form-fieldset horizontal label="服务编码" :label-cols="4" class="text-right">
						<div class="text-left">
							<search
								ref="codeSearch"
								:dataList="codeDatalist"
								:disabled="true"
								option="serviceCode"
								@dataChange="codeQuerySelect"
								@itemValue="codeItemClick"
								@clickShowBack="codeFirstLoad"
								@clearValue="codeClearValue"
								@comScroll="codeScrollBottom">
							</search>
						</div>
					</b-form-fieldset>
	            </div>
	        </div>
<!--        <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" >取消</b-button>
                        <b-button size="sm" variant="success" @click="save">保存</b-button>
                    </div>
                </div>
            </div> -->
	    </b-card>
	    
		<div class="row">
	    	<div class="col-md-12 mb-15">
				<el-tabs type="border-card">
					<el-tab-pane label="适配车型">
						<div class="row mb-2">
							<div class="table-header col-md-12">
								<car-info ref="carInfo"  @callBack="getCarInfo"></car-info>
								<query-btn-group @resetClick="reset" @query="query"></query-btn-group>
								<hr/>
								<span v-show="readOrEdit">
									<b-button size="sm" v-if="isShowAddOrEdit" variant="success" @click="newAdd">新增项目</b-button>
									<b-button size="sm" v-if="isShowAddOrEdit" variant="primary" @click="edit">编辑</b-button>
									<b-button size="sm" v-if="isShowAddOrEdit" variant="danger" @click="del">删除项目</b-button>
		                            <span v-show="mainInfo.serviceCode">
		                            	<!-- <span v-if="!firstTime"><b-button size="sm" v-if="isShowUpload">导入明细</b-button></span> -->
		                            	<span>
				                            <v-upload ref="uploadFile" id="upload" v-if="isShowUpload"
				                                :addParams="addParams" 
				                                buttonName='导入明细'
				                                :analysisExcelConfirm="true"
				                                :analysisExcelConfirmFun="showModel"
				                                :analysisExcelConfirmFlag="uploadFlag"
				                                :analysisExcel="analysisExcel"
				                                :url="analysisUrl" 
				                                :showBack="showBack">
				                            </v-upload>
		                            	</span>
		                            </span>
	                            </span>
								<!-- <b-button size="sm" @click="upload">导入</b-button> -->
							</div>
						</div>
						
						<!-- <query-btn-group @resetClick="reset" @query="query"></query-btn-group> -->
				        <div class="table-scrollable">
				            <b-table striped hover bordered show-empty :items="tablelist" :fields="fields">
				                <template slot="index" slot-scope="data">
				                    <div>
				                        <input type="radio" name="radio" v-model="selectIndex" :value="data.index"/>
				                    </div>
				                </template>
				                <!-- <template slot="cardExpireType" slot-scope="data">
				                    22
				                </template>
				                <template slot="applyToStores" slot-scope="data">
				                    11
				                </template> -->
				                <template slot="empty">
				                    暂无数据...
				                </template>
				            </b-table>
				        </div>
						<pagination class="pull-right" @page-change="pageChange" :page-no="pageNo" :page-size="pageSize" :total-result="totalResult" :total-pages="totalPages">
						</pagination>
					</el-tab-pane>
					<el-tab-pane label="服务详情页">
						<detail ref="detail" :serviceCode="_serviceCode"></detail>
					</el-tab-pane>

				</el-tabs>
	    	</div>
	    </div>

        <b-modal id="addModal" ref="addModal" size="lg" title="添加适配车型">
			<b-container fluid>
				<carInfo ref="car" :col="2" :star="true" @callBack="selectCar" @validete="validete" :validateLen="6"></carInfo>
				<div class="row">
					<div class="col-md-6">
	                    <b-form-fieldset horizontal label="里程间隔 *" :label-cols="4" class="text-right">
	                        <b-form-input onkeyup="this.value=this.value.replace(/\D/g,'')" :state="mileagePeriodStatus" type="number" v-model="sendParams.mileagePeriod"/>
	                    </b-form-fieldset>
					</div>
					<div class="col-md-6">
	                    <b-form-fieldset horizontal label="时间周期 *" :label-cols="4" class="text-right">
	                        <b-form-input onkeyup="this.value=this.value.replace(/\D/g,'')" :state="monthPeriodStatus" type="number" v-model="sendParams.monthPeriod"/>
	                    </b-form-fieldset>
					</div>
				</div>
				
			</b-container>        
            <div slot="modal-footer" class="text-right">         				
				<b-btn size="sm" variant="default" @click="cancelModal">取消</b-btn>
				<b-btn size="sm" variant="primary" @click="sure">确认</b-btn>
			</div>
        </b-modal>
        <sureModel ref="sureModel" @sureEvent="sureEvent" :warnigTitle="titleText"  :whatStep="whatStep " :tipsTitle="tipsTitle"></sureModel>
	</div>
</template>
<script>

	import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
	import Search from "components/iris-search/search"
	import Vue from 'vue'
	import { Table,TableColumn, Message, Tabs, TabPane, MessageBox, Input } from 'element-ui'
	Vue.use(Table)
	Vue.use(TableColumn)
	Vue.use(Tabs)
	Vue.use(TabPane)
	Vue.use(Input)
	import config from 'common/config'
	import urlMap from 'common/api-collection'
	import { SERVICE_RECOMMENDATION_SEQ } from 'common/sequence'
	import { getSequence, hasBtn} from 'common/api-common'
	import api from 'common/api'
	import { mapActions } from 'vuex'
	import carInfo from 'components/iris-carinfo'

	import Pagination from 'components/pagination/pagination'
	import detail from 'views/service-recommend/detail.vue'
	import VUpload from 'views/service-recommend/upload-Individualization.vue'
	import sureModel from 'components/iris-modal/index.vue'
export default {
    components: {
        QueryBtnGroup,
        Search,
        carInfo,
        VUpload,
        Pagination,
        detail,
        sureModel
    },
    data() {
        return {
        	uploadFlag:false,
			titleText:'操作将清空当前数据并覆盖',
			tipsTitle:'确认吗？',
			whatStep:'',
        	isCanUpload:true,
        	analysisUrl: urlMap.serviceRecommon.analysisUrl,
			tablelist:[],
			disabled:false,
			inPageType: '', //页面进入状态
			tablelist:[],
            fields: {
                index: {
                    label: '选择'
                },
                factoryName: {
                    label: '厂家'
                },
                brandName: {
                    label: '品牌'
                },
                seriesName: {
                    label: '车系'
                },
                modelName: {
                    label: '车型'
                },
                opvName: {
                    label: '排量'
                },
                iotypeName: {
                    label: '进气方式'
                },
                mileagePeriod: {
                    label: '里程间隔'
                },
                monthPeriod: {
                    label: '时间周期'
                }
            },
			mainInfo: {},
			carInfo: {},

			datalist: [],
			selectParams: {
				onOffFlag: 1,
				pageNums: config.pageNums,
				pageStart: 1
			},
			isLastPage: false,

			codeDatalist: [],
			codeSelectParams: {
				pageNums: config.pageNums,
				pageStart: 1
			},
			codeIsLastPage: false,
			//新增还是编辑
			addOrEdit:false,

			sendParams:{
				//服务推荐编码
				recommendationCode:'',
				//服务编码
				serviceCode:'',
				//主车型
				carCode:'',
				//厂家
				factoryCode:'',
				//品牌
				brandCode:'',
				//车系
				seriesCode:'',
				//车型编码
				modelCode:'',
				//排量
				opvCode:'',
				//进气方式
				iotypeCode:'',
				//里程间隔
				mileagePeriod:'',
				//时间周期
				monthPeriod:'',
			},
			star:true,
			flag:false,
			mileagePeriodStatus:null,
			monthPeriodStatus:null,
            pageNums: config.pageNums,
            pageStart: 1,
            selectIndex:null,
            //弹出层为新增还是编辑，true为新增
            modelFlag:true,
            readOrEdit:true,

            pageNo: 1,
            pageSize: 1,
            totalResult: 0,
            totalPages: 0

        }
	},
    computed: {
    	_serviceCode: function() {
    		return this.mainInfo.serviceCode;
    	},
    	_serviceName: function() {
    		return this.mainInfo.serviceName;
    	},
    	addParams:function(){
    		return { relationCode:this.mainInfo.serviceCode,singleFlag:1, businessType:''};
    	},
    	showBack:function(){
    		return {serviceCode:this.sendParams.serviceCode}
    	},
    	isShowAddOrEdit:function(){
    		//return hasBtn(urlMap.serviceRecommon.insert);
    		return true;
    	},
    	isShowUpload:function(){
    		//return hasBtn(urlMap.serviceRecommon.analysisUrl);
    		return true;
    	}
    },
    watch:{
    	_serviceCode:function(val){
    		if(!val){
    			this.tablelist = [];
    			return;
    		}
    		this.sendParams.serviceCode = val;
    		this.queryServiceRecommendationInfos();
    	},
    	_serviceName:function(val){
    		if(!val){
    			this.tablelist = [];
    			this.mainInfo.serviceName = '';
    			return;
    		}
    	}
    },
    created(){
    	let _this = this;
    	if(this.$route.query.type != 'insert'){    		
    		//查看或者编辑不可以修改
    		this.disabled = true;
			this.firstLoad(() => {
	    		if(this.$route.query.type == 'detail'){
	    			this.readOrEdit = false;	    			
	    		}
				this.$refs.search.setValue(this.$route.query.serviceName)
				this.$refs.codeSearch.setValue(this.$route.query.serviceCode);					
				this.mainInfo.serviceCode = this.$route.query.serviceCode;
				this.sendParams.serviceCode = this.mainInfo.serviceCode;
				this.queryServiceRecommendationInfos();
				this.$refs.detail.getUrlCode(this.mainInfo.serviceCode);
			});
    	}
    },
    mounted(){

    },
    methods: {
    	queryServiceRecommendationInfos(val){
    		let _this = this;
    		_this.sendParams.pageNums = 100;
    		_this.sendParams.pageStart = 1;
    		_this.tablelist = [];
    		var value = {serviceCode:_this.sendParams.serviceCode,pageNums:config.pageNums,pageStart:_this.pageStart},params;

    		if(!val){
    			val = {};
    		}
    		params = Object.assign(value, val);
    		api.serviceRecommend.queryServiceRecommendationInfos(params, function(res){
    			if(res.data.code == 'success'){
    				_this.tablelist = res.data.obj.list;
                    _this.pageNo = res.data.obj.pageNum;
                    _this.totalPages = res.data.obj.pages
                    _this.pageSize = res.data.obj.pageSize
                    _this.totalResult = res.data.obj.total
                    _this.startRow = res.data.obj.startRow
    			}
    		});
    	},
		query() {
			let params = {
				factoryCode: this.carInfo.factoryCode,
				brandCode: this.carInfo.brandCode,
				iotypeCode: this.carInfo.ioTypeCode,
				modelCode: this.carInfo.modelCode,
				opvCode: this.carInfo.opvCode,
				seriesCode: this.carInfo.seriesCode,
			}
			this.pageStart = 1;
			this.queryServiceRecommendationInfos(params)
		},
		newAdd(){
			let _this = this;
			if(!_this.mainInfo.serviceCode){
				Message({
					message: '请选择服务项目',
					type: 'warning'
				});
				return;
			};
			this.clearModal();
			this.modelFlag = true;
			this.$refs.addModal.show();
    		getSequence(SERVICE_RECOMMENDATION_SEQ, function(res){
    			_this.sendParams.recommendationCode = res;
    		});
    	},
		reset() {
			this.$refs.car.clear()
		},
        querySelect(data) {
			this.selectParams.pageStart = 1;
			this.selectParams.serviceName = data;
			let params = this.selectParams;        
			this.querySerInfo(params, obj => {
				this.isLastPage = obj.isLastPage;            
				this.datalist = obj.list;
			});
		},
		itemClick(item) {
			this.mainInfo = {
				serviceCode: item.serviceCode,
				serviceName: item.serviceName
			}
			this.$refs.codeSearch.setValue(item.serviceCode)
		},
		firstLoad(callBack) {
			if(this.selectParams.serviceName) {
				delete this.selectParams.serviceName;
			}else if(this.datalist.length !== 0) {
				return;
			}
			let params = this.selectParams;        
			this.querySerInfo(params, obj => {
				this.datalist = obj.list;
				if(callBack && typeof callBack != 'string'){
					callBack();
				}
				//callBack();
				
			});
		},
		clearValue() {
			this.mainInfo = {}
			this.$refs.codeSearch.setValue();
			this.$refs.search.setValue()
		},
		scrollBottom(isEnd) {
			if (isEnd && !this.isLastPage) {
				this.selectParams.pageStart ++
				let params = this.selectParams;        
				this.querySerInfo(params, obj => {
					this.isLastPage = obj.isLastPage;
					this.datalist = this.datalist.concat(obj.list);
				});
			}
		},
		querySerInfo(params, callback) {
			api.serviceitem.queryByPage(params, res => {
				if (res.data.code === "success") {
					let obj = res.data.obj;
					if(callback){
						callback(obj);
					}
					
				}
			});
		},
		// code
		codeClearValue() {
			this.mainInfo = {}
			this.$refs.search.setValue()
		},
		codeFirstLoad() {
			if(this.codeSelectParams.serviceCode) {
				delete this.codeSelectParams.serviceCode;
			}else if(this.codeDatalist.length !== 0) {
				return;
			}
			let params = this.codeSelectParams;        
			this.querySerInfo(params, obj => {
				this.codeDatalist = obj.list;
			});
		},
		codeQuerySelect(data) {
			this.codeSelectParams.pageStart = 1;
			this.codeSelectParams.serviceCode = data;
			let params = this.codeSelectParams;        
			this.querySerInfo(params, obj => {
				this.codeIsLastPage = obj.isLastPage;            
				this.codeDatalist = obj.list;
			});
		},
		codeItemClick(item) {
			this.mainInfo = {
				serviceCode: item.serviceCode,
				serviceName: item.serviceName
			}
			this.$refs.search.setValue(item.serviceName)
		},
		codeScrollBottom(isEnd) {
			if (isEnd && !this.isLastPage) {
				this.codeSelectParams.pageStart ++
				let params = this.codeSelectParams;        
				this.querySerInfo(params, obj => {
					this.codeIsLastPage = obj.isLastPage;
					this.codeDatalist = this.codeDatalist.concat(obj.list);
				});
			}
		},
        cancelModal() {
            this.$refs.addModal.hide();
        },
        check(){
			let _this = this;
			_this.$refs.car.validate();
			var returnFlag = _this.valideteTxt(_this.sendParams.mileagePeriod, _this.sendParams.monthPeriod)
			if(!_this.flag || !returnFlag)return false;
			if(!this.mainInfo.serviceCode){
				Message({
					message: '请选择服务项目',
					type: 'warning'
				});
				return false;				
			}else{
				return true;
			}
        },
		//业务
		save(){
			let _this = this;
			if(!_this.check())return;			
			api.serviceRecommend.insertServiceRecommendationInfo(_this.sendParams,function(res){
				if(res.data.code == 'success'){
					_this.cancelModal();
					_this.queryServiceRecommendationInfos();
				}
			});
		},
		update(){
			let _this = this;
			if(!_this.check())return;
			var obj = {}
			Object.assign(obj, _this.tablelist[this.selectIndex]);
			Object.assign(obj, _this.sendParams);
			api.serviceRecommend.updateServiceRecommendationInfo(obj, function(res){
				_this.cancelModal();
				_this.queryServiceRecommendationInfos();
			});
		},
		validete(flag){			
			this.flag = flag;
		},
		valideteTxt(mileagePeriod, monthPeriod){
			let _this = this;
			if(!mileagePeriod){
				_this.mileagePeriodStatus = false;
				
			}else{
				_this.mileagePeriodStatus = null;
			}

			if(!monthPeriod){
				_this.monthPeriodStatus = false;
			}else{
				_this.monthPeriodStatus = null;
			}

			if(_this.mileagePeriodStatus == null && _this.monthPeriodStatus == null){
				return true;
			}else{
				return false;
			}

		},
		getCarInfo(data) {
            this.carInfo.factoryCode = data.factoryCode
            this.carInfo.brandCode = data.brandCode
            this.carInfo.seriesCode = data.seriesCode
            this.carInfo.modelCode = data.modelCode
            this.carInfo.opvCode = data.opvCode
            this.carInfo.iotypeCode = data.ioTypeCode

		},
		reset() {
			this.carInfo.factoryCode = ''
            this.carInfo.brandCode = ''
            this.carInfo.seriesCode = ''
            this.carInfo.modelCode = ''
            this.carInfo.opvCode = ''
            this.carInfo.iotypeCode = '' 
			this.$refs.carInfo.clear();
			this.pageStart = 1;
			this.queryServiceRecommendationInfos();
		},
		selectCar(data){
			let _this = this;			
			var carInfo = {
			    "factoryCode":null,
			    "brandCode":null,
			    "seriesCode":null,
			    "modelCode":null,
			    "opvCode":null,
			    "ioTypeCode":null
			}
			Object.assign(carInfo, data);
			for(var key in carInfo){
				_this.sendParams[key] =  carInfo[key];
			}
			_this.sendParams.serviceCode = _this.mainInfo.serviceCode;
			_this.sendParams.iotypeCode = carInfo.ioTypeCode;
			_this.sendParams.iotypeName = carInfo.ioTypeName;
			
		},
		clearModal(){
			this.sendParams.factoryCode = '';
			this.sendParams.brandCode = '';
			this.sendParams.seriesCode = '';
			this.sendParams.modelCode = '';
			this.sendParams.opvCode = '';
			this.sendParams.iotypeCode = '';
			var str = config.carFlag ? 'brand' : 'factory';
			this.$refs.car.resetSelectData(str);
			
			this.sendParams.mileagePeriod = '';
			this.sendParams.monthPeriod = '';

		},
		edit(){
			this.modelFlag = false;
			if(this.selectIndex == null){
				Message({
					message: '请选择数据',
					type: 'warning'
				});
			}else{
				this.$refs.addModal.show();
				this.$refs.car.setValue({
				    "factoryCode":this.tablelist[this.selectIndex].factoryCode,
				    "brandCode":this.tablelist[this.selectIndex].brandCode,
				    "seriesCode":this.tablelist[this.selectIndex].seriesCode,
				    "modelCode":this.tablelist[this.selectIndex].modelCode,
				    "opvCode":this.tablelist[this.selectIndex].opvCode,
				    "ioTypeCode":this.tablelist[this.selectIndex].iotypeCode
				});
				this.sendParams.monthPeriod = this.tablelist[this.selectIndex].monthPeriod;
				this.sendParams.mileagePeriod = this.tablelist[this.selectIndex].mileagePeriod;
				this.sendParams.recommendationCode = this.tablelist[this.selectIndex].recommendationCode;
				
			}
			
		},
		del(){
			let _this = this;
			if(this.selectIndex == null){
				Message({
					message: '请选择需要操作的数据',
					type: 'warning'
				});
			}else{
				MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					showCancelButton:true
				}).then(() => {
					let obj = {};
					Object.assign(obj, _this.tablelist[this.selectIndex]);
					obj.isDeleted = 1;
					api.serviceRecommend.updateServiceRecommendationInfo(obj, function(res){
						if(res.data.code == 'success'){
							_this.selectIndex = null;
							_this.queryServiceRecommendationInfos();
						}
					});
				})
			}
		},
		sure(){
			if(this.modelFlag){
				this.save();
			}else{
				this.update();
			}

		},
        //解析数据
        analysisExcel: function(res) {
            if (res.data.obj === null) {
                Message({
                    type: "success",
                    message: "解析成功"
                });
            } else {
                this.queryServiceRecommendationInfos();
                
            }
        },
        pageChange(page) {                
            this.pageStart = page
			let params = {
				factoryCode: this.carInfo.factoryCode,
				brandCode: this.carInfo.brandCode,
				iotypeCode: this.carInfo.ioTypeCode,
				modelCode: this.carInfo.modelCode,
				opvCode: this.carInfo.opvCode,
				seriesCode: this.carInfo.seriesCode,
			}
            this.queryServiceRecommendationInfos(params)
            //this.queryServiceRecommendationInfos();
        },
        showModel(){
        	//if(this.firstTime)return;
        	console.info(222);
        	this.$refs.sureModel.showDeleteModel();
        },
        sureEvent(val){
        	this.$refs.sureModel.closeDeleteModel();
        	if(val == 'confirm'){
        		this.uploadFlag = true;
        		
        	}
        },

    }
};
</script>
<style lang="scss" scoped>
	.align-center {
    	display: flex;
    	align-items: center;
	}
	.mb-15{
		margin-bottom: 1.5rem;
	}
</style>
