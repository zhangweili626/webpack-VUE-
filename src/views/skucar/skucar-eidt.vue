<template>
    <div>
        <b-card header="SKU">
			<div class="row">
				 <b-col md="4">
					<b-form-fieldset horizontal label="SKU名称" :label-cols="4" class="text-right">
						<sku-search @getValue="skuSelect" :skuName='model.skuName' :isDisabled="isHeaderSave" :class="{'inp-invalid' : inp.skuName}"></sku-search>
					</b-form-fieldset>
				</b-col>
				<b-col md="4">
					<b-form-fieldset horizontal label="SKU编码" :label-cols="4" class="text-right">
						<b-form-input v-model="model.skuCode" disabled/>
					</b-form-fieldset>
				</b-col>
				<b-col md="4">
					<b-form-fieldset horizontal label="品牌" :label-cols="4" class="text-right">
						<b-form-input v-model="model.skuBrandName" disabled/>
					</b-form-fieldset>
				</b-col>
				<b-col md="4">
					<b-form-fieldset horizontal label="规格" :label-cols="4" class="text-right">
						<b-form-input v-model="model.skuStandards" disabled/>
					</b-form-fieldset>
				</b-col>
				<b-col md="4">
					<b-form-fieldset horizontal label="型号" :label-cols="4" class="text-right">
						<b-form-input v-model="model.skuModel" disabled/>
					</b-form-fieldset>
				</b-col>
				<b-col md="4">
					<b-form-fieldset horizontal label="69码" :label-cols="4" class="text-right">
						<b-form-input v-model="model.barCode" disabled/>
					</b-form-fieldset>
				</b-col>	
				<b-col md="4">
					<b-form-fieldset horizontal label="原厂编码" :label-cols="4" class="text-right">
						<b-form-input v-model="model.originalCode" disabled/>
					</b-form-fieldset>
				</b-col>
			</div>
			<b-row>
				<div class="col-md-12 text-right">				
					<b-button size="sm" variant="primary" @click="saveSku" v-show="!isHeaderSave && !onlySee">保存</b-button>
				</div>
			</b-row>
		</b-card>
        <b-card header="SKU适配车型" v-show="isHeaderSave">
			<b-row class="mb-0">
				<div class="pull-left ml-3 mb-1">
                    <b-button size="sm" variant="success" v-b-modal.modal1  v-show="!onlySee" v-if="isCreatSkuCar">添加适配车型</b-button>
					<b-button size="sm" variant="danger" @click="delCar"  v-show="!onlySee" v-if="isEidtSkuCar">删除适配车型</b-button>
				</div>
			</b-row>
			<div class="table-scrollable skucar-inpt-tab-center">
				<b-table striped hover bordered show-empty :items="carlist" :fields="fields">
					<template slot="sel" slot-scope="data">
						<input type="checkbox" name="carModel" :value="data.item" v-model="selCarModel" :disabled="onlySee"/>
					</template>									
					<template slot="factoryName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="brandName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="seriesName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="modelName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="opvName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="iotypeName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="addNo" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="detail" slot-scope="data">						
						<b-btn size="sm" v-show="data.item.iotypeName !== ''" variant="primary" @click="getCarDetial(data.item,data.index)" :disabled="data.index==presentIndex">详情</b-btn>
					</template>
					<template slot="empty">
						暂无数据...
					</template>
				</b-table>
			</div>		
		</b-card>
		<b-card header="车型扩展信息" v-show="isCarAdd">
			<b-row class="mb-0">
				<div class="pull-left ml-3 mb-3">
                    <b-button size="sm" variant="primary" @click="showAddAdd" v-show="isAddBtn && !onlySee" v-if="isEidtSkuCar">{{carAddList.length==0?"添加":'编辑'}}</b-button>
                    <b-button size="sm" variant="warning" @click="showAddAdd" v-show="!isAddBtn && !onlySee" v-if="isEidtSkuCar">取消</b-button>
					<b-button size="sm" variant="danger" @click="delMainAdd"  v-show="!isAddBtn && !onlySee" v-if="isEidtSkuCar">删除</b-button>
					<b-button size="sm" variant="success" @click="saveData"  v-show="!isAddBtn && !onlySee" v-if="isEidtSkuCar">保存</b-button>
				</div>
			</b-row>
			<div class="skucar-box" v-show="!isAddKong">
					<div class="skucar-table-left" style="width:200px;">
						<table class="table b-table table-striped table-hover table-bordered">
							<thead>	
								<tr>
									<th class="skucar-table1 skucar-th">选择</th>
									<th class="skucar-table1 skucar-th text-center">
										<b-button size="sm" variant="success" class="text-center"  v-b-modal.modal2 v-show="!isAddBtn && !onlySee">新增</b-button>
										<span v-show="onlySee || isAddBtn">扩展信息</span>
									</th>
								</tr>
							</thead>   
							<tbody>
								<tr v-for="(val, i) in addedModelList" :key="i">
									<td class="skucar-table1 skucar-td">
										<input type="checkbox" name="mainAdd" :value="val" v-model="selMainAddList" :disabled="onlySee || isAddBtn"/>
									</td>
									<td class="skucar-table1 skucar-td">{{val.refDetailName}}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="skucar-table-right" ref='tableright'>
							<table class="table b-table table-striped table-hover table-bordered" :style="{width: wrapperTab}">
							<thead>
								<tr>
									<th class="skucar-th text-center" v-show="!isAddBtn && !onlySee" style="width: 220px;">
										<b-button size="sm" variant="default" @click="resetAddSel" class="mr-3">重置</b-button>
										<b-button size="sm" variant="success" @click="saveCarAdd">确定</b-button>									
									</th>
									<th class="skucar-th text-center"  v-for="(x, inde) in carAddList" :key="'inde' + inde">
										<b-button size="sm" variant="default" @click="copyAddModel(x)" v-show="!isAddBtn &&!onlySee">复制</b-button>
										<b-button size="sm" variant="danger" @click="delAddModel(x)" v-show="!isAddBtn &&!onlySee">删除</b-button>
										<span v-show="onlySee || isAddBtn">值</span>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(val, i) in addedModelList" :key="'i' + i">
									<td class="skucar-td text-center" v-show="!isAddBtn && !onlySee" style="padding-left: 12px;padding-rigth: 2px; width: 220px;">
										<caradd-select :copyData="copyData" :param="carMoelSel" :seledData="carAddSellList" @canback="getCarAddSel" :getType="val.refDetailCode" :resetData='resetData'></caradd-select>
									</td>
									<td class="skucar-td text-center"  v-for="(x, ind) in carAddList" :key="'ind' + ind">
										{{getText( val.refDetailCode, x)}}
									</td>
								</tr>
							</tbody>
						</table>					
					</div>				
				</div>
			
			<div class="row" v-show="isAddKong">
				<b-col class="ml-3">
					暂无附加信息，请点击编辑添加！
				</b-col>
				
			</div>
		</b-card>
		 <b-modal id="modal1" size="lg" title="车型查询" ref="modal1" @show="modalShow">
			<car-info :flag="carFlag" @callBack="carSelect" :col='2' ref="carInfo"></car-info>
			<div slot="modal-footer" class="w-100">         
				<b-btn size="sm" class="float-right" variant="success" @click="saveCar" v-if="isEidtSkuCar">确定</b-btn>
			</div>
		</b-modal>
		 <b-modal id="modal2" size="sm" title="新增扩展信息" ref="modal2" @show="modal2Show">
			 <div class="container-fluid">
				 <b-row class="car-add-search">
					 <el-input
						placeholder="筛选附加信息"
						icon="close"
						v-model="modelName"
						:on-icon-click="clearText">
					</el-input>
				 </b-row>				 
				<div class="car-add-box">
					<b-form-checkbox-group  id="checkbox" name="checkbox" v-model="selModelAdd">
						<b-form-checkbox class="checkbox-box ml-1"  v-for="(item,index) in modelAddList" :key="index"  :value="item">{{item.refDetailName}}</b-form-checkbox>       
					</b-form-checkbox-group>					
				</div>				
			 </div>
			<div slot="modal-footer" class="w-100">         				
				<b-btn size="sm" class="float-right" variant="success" @click="addModelAdd">确定</b-btn>
				<b-btn size="sm" class="float-right mr-2" variant="seconday" @click="cancelModal2">取消</b-btn>
			</div>
		</b-modal>
    </div>
</template>
<script>
	import Vue from 'vue'
	import {mapActions} from 'vuex'
	import {Input, Message, MessageBox} from 'element-ui'
	import vPagination from 'components/pagination/pagination.vue'
	import carInfo from 'components/iris-carinfo'
	import caraddSelect from './caradd-select'
	import skuSearch from './skuSearch.vue'
	import api from 'common/api'
	import config from 'common/config.js'
	import common from 'common/common.js'
	import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'

    Vue.use(Input)
    export default {
        components: {
			vPagination,
			skuSearch,
			carInfo,
			caraddSelect
		},
		data() {
			return {
				inp:{
					skuName:false
				},
				isHeaderSave: false,
				onlySee:false,
				isAddBtn:true,
				// 附加信息是否为空
				isAddKong: false,
				// 当前选择车型详情
				presentIndex:-1,
				// 是否显示附加信息详情
				isCarAdd:false,
				carFlag: config.carFlag,
				paginationData: {
					total: 0,
					totalPages: 1,
					pageNo: 1,
					pageSize: config.pageNums
				},
				model: {
					skuCode: '',
					skuName: '',
					skuBrandCode: '',
					skuBrandName: '',
					skuModel:'',
					skuStandards: '',
					barCode: '',
					originalCode: '',		
					relationCode:''		
				},
				modelName:'',
				selCont:'',
				selModelAdd:[],
                fields: {
					sel: {
						label: "选择"
					},				
					factoryName: {
						label: "厂家"
					},
					brandName: {
						label: "品牌"
					},
					seriesName: {
						label: "车系"
					},
					modelName: {
						label: "车型"
					},
					opvName: {
						label: "排量"
					},
					iotypeName: {
						label: "进气方式"
					},
					addNo: {
						label: "适配车型数量"
					},
					detail: {
						label: "车辆扩展信息维护"
                    },
				},
				carInfoModel:{
					factoryCode:'',
					factoryName: '',
					brandCode:'',
					brandName:'',
					seriesCode:'',
					seriesName:'',
					modelCode:'',
					modelName:'',
					opvCode: '',
					opvName: '',
					iotypeCode: '',
					iotypeName: ''
				},
				carlist:[],	
				// 总扩展信息条目
				originalAddList: [],
				// 未添加扩展信息条目
				modelAddList: [],
				// 已添加扩展信息条目
				addedModelList: [],	
				list:[{d:"d"}],
				carMoelSel:{},
				// 当前选择车型信息
				carAddSellList:[],
				// 保存附加信息列表
				carAddList:[],
				// 删除附加信息条目列表
				selMainAddList:[],
				// 删除出车型
				selCarModel:[],
				// 控制是否重置扩展信息值选择值（该值变化，即可重置）
				resetData:0,
				beforeEidet:{
					addedModelList:[],
					carAddList:[],
				},
				copyData: [],
            }
		},
		computed: {
			isCreatSkuCar(){
				return hasBtn(collectionApi.skuCar.skuCarAdd);;
			},
			isEidtSkuCar(){
				return hasBtn(collectionApi.skuCar.skuCarEidt);;
			},
			wrapperTab() {
				let wd;
				if((!this.isAddBtn) && (!this.onlySee)) {
					wd = this.carAddList.length * 160 + 220 + 'px'
				}else{
					wd = this.carAddList.length * 160 + 'px'
				}
				return wd;
			},
		},
		created(){
			this._initData();
			this.getModelAdd();
		},
		methods: {
			...mapActions('skuCar',[
				'getSkuCarList'
			]),
			// 生成车型refcode
			createSkuCarCode() {
				const option = {
					'serviceCode': config.skuCar.skuCarCode
				}
				return new Promise((reslove,reject) => {
					api.ordinalInfo.getSequence(option, (res) => {
						if(res.data.code === 'success') {
							reslove(res.data.obj)
						};
					})
				})				
			},
			// 生成车型附加信息refcode
			createCarAddCode(num) {
				const option = {
					'serviceCode': config.skuCar.skuCarAddCode,
					'getNums': num ? num : 1
				}
				return new Promise((reslove,reject) => {
					api.ordinalInfo.getSequenceList(option, (res) => {
						if(res.data.code === 'success') {							
							reslove(res.data.obj)
						};
					})
				})				
			},
			// 获取carCode
			getCarCode(param) {
				return new Promise((reslove,reject) => {
					api.skuCar.getCarCode(param, (res) => {
						if(res.data.code === 'success') {
							reslove(res.data.obj)
						};
					})
				})				
			},
			_initData(val) {
				let param;
				let routeQuery = this.$route.query;
				if(routeQuery.onlySee == true) {
					this.onlySee = true;
				}else {
					this.onlySee = false;
				}
				if(routeQuery.skuCode == undefined && val == undefined) {
					
				}else {
					param = {
						skuCode: val ? val : routeQuery.skuCode
						
					}
					api.skuCar.getSkuCar(param, (res) => {
						if(res.data.code === 'success') {
							if( res.data.obj.length == 0) {
								this.carlist = [];
								return
							}
							this.carlist = res.data.obj;	
							if(routeQuery.skuCode) {
								for(let key of Object.keys(this.model)){
									this.model[key]=this.carlist[0][key];
								}
							}													
							this.isHeaderSave = true;
							this.presentIndex = -1;
							this.isAddBtn = true;
						};
					})
				}
				
			},
			// 获取车型的扩展信息列表
			getSkuCarAdd(param) {				
				this.beforeEidet.addedModelList = [];
				this.beforeEidet.carAddList = [];
				this.addedModelList = [];
				this.carAddList = [];
				api.skuCar.getSkuCarAdd(param, (res) => {
					if(res.data.code === 'success') {
						let data = res.data.obj;
						let codeList = [];
						let optionList = [];
						if(!data || data.length == 0) {
							this.isAddKong = true;
							return
						}
						this.isAddKong = false;
						for(let [index, item] of data.entries()) {
							if(!codeList.includes(item.carDetailCode)) {
								codeList.push(item.carDetailCode);
							}
							for(let [j, addV] of this.originalAddList.entries()) {
								if(addV.refDetailCode === item.addCode) {
									let lObj = addV;
									if(!optionList.includes(addV)) {
										optionList.push(addV);
									}
								}
							}							
						}
						this.addedModelList = [...optionList];
						this.beforeEidet.addedModelList = [...optionList];
						let list = [];
						for(let [i, val] of codeList.entries()) {
							let arr = [];
							for(let [index, item] of data.entries()) {								
								if(item.carDetailCode == val) {
									let obj= {};
									obj.addCode = item.addCode;
									obj.addValue = item.addValue;
									obj.addName = item.addName;
									arr.push(obj);
								}								
							}
							list.push(arr);
						}						
						this.carAddList =  [...list];
						this.beforeEidet.carAddList = [...list];
					};
				})
			},
			// 获取车型扩展信息
			getModelAdd(val) {			
				let refName = val?val:'';
				const option = {
					'refCode': config.skuCar.modelAdd,
					'refDetailName': refName.trim(),
					'pageNums': 1000,
                	'pageStart': 1
				}
				api.ref.getDataDictionarysPages(option, (res) => {
					if(res.data.code === 'success') {
						let arr = res.data.obj.list;						
						let data = [];
						for(let [i,item] of arr.entries()) {
							if(item.isDeleted != 1) {
								let obj = {};
								obj.refDetailName = item.refDetailName;
								obj.refDetailCode = item.refDetailCode;
								data.push(obj);
							}							
						}		
						this.originalAddList = [...data];					
						if(this.addedModelList.length != 0 ) {
							for(let i = 0; i < this.addedModelList.length; i++) {
								let strData = JSON.stringify(this.addedModelList[i]);
								for(let j = 0; j < data.length; j++) {
									if(strData === JSON.stringify(data[j])) {
										data.splice(j,1);
										break;
									}
									
								}
							}
						}
						this.modelAddList = [...data];						
					};
				})
			},
			skuSelect(val) {
				this.model.skuName = val.skuName;
				this.model.skuCode = val.skuCode;
				this.model.skuBrandCode = val.brandCode;
				this.model.skuBrandName = val.brandName;
				this.model.skuModel = val.skuModel;
				this.model.skuStandards = val.skuStandards;
				this.model.originalCode = val.originalCode;			
				this.model.barCode = val.barCode;				
			},	
			saveSku() {
				this.inp.skuName = false;
				if(this.model.skuName == '') {
					this.inp.skuName = true;
				}else {
					this.isHeaderSave = true;
					this._initData(this.model.skuCode);
				}
			},
			carSelect(val) {
				let obj = {};
				for(let item of Object.keys(val)) {
					if(item == "ioTypeCode") {
						obj["iotypeCode"] = val[item];
					}else if(item == "ioTypeName") {
						obj["iotypeName"] = val[item];
					}else {
						obj[item] = val[item];
					}		
				}
				let reObject = Object.assign({},this.carInfoModel, obj);
				this.carInfoData = reObject;
			},	
			saveCar() {
				let onOff = false;
				for(let item of Object.values(this.carInfoData)){
					if(item){
						onOff = true;
						break;
					}
				}
				if(!onOff){
					Message({ 
						type: 'warning', 
						message: `该车型信息不可为空!`
					});	
					return;
				}
				let strData = JSON.stringify(this.carInfoData);
				if(this.carlist.length > 0) {
					for(let i = 0; i < this.carlist.length; i++) {
						let obj = {};
						for(let key of Object.keys(this.carInfoData)){
							obj[key]=this.carlist[i][key];
						}
						if(JSON.stringify(obj) === strData) {
							Message({ 
								type: 'warning', 
								message: `该车型信息已添加!`
							});	
							return;
						}
					}
				}
				let isNeedCarCode = false
				for(let [key, item] of Object.entries(this.carInfoData)){
					if(!item && (key !== 'factoryCode')){
						isNeedCarCode = true;
						break;
					}
				}				
				let param = Object.assign({}, this.model, this.carInfoData)
				this.createSkuCarCode().then((res) => {
					param.relationCode = res;	
					if(!isNeedCarCode){
						this.getCarCode(this.carInfoData).then((res) => {
							param.carCode = res[0].carCode;
							api.skuCar.skuCarAdd(param, (res) => {
								if(res.data.code === 'success') {							
									Message({
										type: "success",
										message: "保存车型成功!"
									});
									this._initData(this.model.skuCode);
									this.refreshTab();
								};
							})
						})
					}else {
						api.skuCar.skuCarAdd(param, (res) => {
						if(res.data.code === 'success') {							
							Message({
								type: "success",
								message: "保存车型成功!"
							});
							this._initData(this.model.skuCode);
							this.refreshTab();
						};
					})
					}				
					
				})
				this.isCarAdd = false;
				this.$refs.modal1.hide();
			},
			// 删除车型
			delCar(){
				let param = [];
				if(this.selCarModel.length == 0) {
					Message({
						type: "warning",
						message: "未选择删除车型!"
					});
					return;
				}
				MessageBox.confirm(`确定移除已选车型？`, '提示',{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {					
						for(let [index,item] of this.selCarModel.entries()) {
							let obj={};
							obj.id = item.id;
							obj.relationCode = item.relationCode;
							obj.isDeleted = 1;
							param.push(obj)					
							// for(let [i,elem] of this.carlist.entries()){
							// 	if(JSON.stringify(item) == JSON.stringify(elem)) {
							// 		this.carlist.splice(i,1);
							// 		break;
							// 	}
							// };
						}
						api.skuCar.skuCarEidtList(param, (res) => {
								if(res.data.code === 'success') {
									Message({
										type: "success",
										message: "删除车型成功!"
									});
									this._initData(this.model.skuCode)
								};
							})
						this.selCarModel = [];
				}).catch(() => {					
				});
				
			},
			// 获取车型信息
			getCarDetial(val,index) {
				this.presentIndex = index;
				this.carMoelSel = val;
				let option = {
					// id: this.carMoelSel.id,
					relationCode: this.carMoelSel.relationCode,
				}
				this.getSkuCarAdd(option);
				this.isCarAdd = true;
				this.isAddBtn = true;
				this.carAddSellList =[];
			},
			modalShow() {
				this.$refs.carInfo.clear();
			},
			modal2Show() {
				this.selModelAdd = [];
				this.getModelAdd();
			},
			cancelModal2() {
				this.$refs.modal2.hide();
			},
			// 添加车型扩展选项
			addModelAdd() {
				let addVal = this.selModelAdd; 			
				if(addVal.length == 0){
					this.$refs.modal2.hide();
					return;
				}
				if(this.addedModelList.length == 0) {
					this.addedModelList = [...addVal];
					addVal = [];
					this.getModelAdd();
					this.$refs.modal2.hide();
					return;
				}
				for(let i = 0; i < addVal.length; i++) {
					let strData = JSON.stringify(addVal[i]);
					let isAdded = false;
					for(let j = 0; j < this.addedModelList.length; j++) {
						if(JSON.stringify(this.addedModelList[j]) === strData) {
							isAdded = true;
							break;
						}
					}
					if(!isAdded) {
						this.addedModelList.push(addVal[i]);						
					}
				}	
				this.getModelAdd(this.modelName);
				addVal = [];	
				this.$refs.modal2.hide();	
			},
			clearText(){
				this.modelName = '';
			},
			getCarAddSel(value){
				let val = JSON.parse(value)
				if(this.carAddSellList.length == 0) {
					this.carAddSellList.push(val);					
				}else {
					for(let i = 0; i < this.carAddSellList.length; i++) {
						if(this.carAddSellList[i].addCode == val.addCode) {
							if(val.addValue === '') {
								this.carAddSellList.splice(i,1);
								return;
							}else {
								this.carAddSellList[i].addValue = val.addValue;
								return;
							}							
						}
					}
					this.carAddSellList.push(val);
				}
				
			},
			saveCarAdd() {
				let arr = [];
				if(this.carAddSellList.length == 0) {
					Message({ 
								type: 'warning', 
								message: `请选择车型附加信息!`
							});	
					return
				}
				for(let [index,elem] of this.carAddSellList.entries()) {
					let obj = {};
					Object.assign(obj,elem)
					arr.push(obj);
				}
				if(this.carAddList.length == 0) {
					this.carAddList.push(arr);
				}else {
					for(let [index,elem] of this.carAddList.entries()) {	
						if(common.compareArr(elem, arr)) {
							Message({ 
								type: 'warning', 
								message: `该车型附加信息已添加!`
							});	
							return;
						}
					}
					this.carAddList.unshift(arr);
				}
			},
			// 删除已添加附加信息条目
			delMainAdd() {
				if(this.selMainAddList.length == 0) {
					Message({
						type: "warning",
						message: "未选择车辆附加信息目录!"
					});
					return;
				}
				MessageBox.confirm(`确定删除已选附加信息目录？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {					
					for(let [index,item] of this.selMainAddList.entries()) {
						//过滤已选择附件项目条目
						for(let [i,elem] of this.addedModelList.entries()){
							if(JSON.stringify(item) == JSON.stringify(elem)) {
								this.addedModelList.splice(i, 1);
								break;
							}
						};
						// 过滤已选择附加信息的删除项
						for(let [i,elem] of this.carAddSellList.entries()) {
							if(elem.addCode === item.refDetailCode) {
								this.carAddSellList.splice(i, 1);
								break;
							}
						}
						// 过滤已添加附加信息（方法1）
						// for(let [j,val] of this.carAddList.entries()) {
						// 	for(let ind = 0; ind < val.length; ind++) {
						// 		if(val[ind].addCode === item.refDetailCode) {
						// 			this.carAddList[j].splice(ind, 1);
						// 			break;
						// 		}
						// 	}
						// }					
					}
					// 过滤已添加附加信息（方法2）
					let Addarr = [];
					for(let [index, item] of this.carAddList.entries()) {
							let arrC =[];
							for(let ind = 0; ind < item.length; ind++) {
								let isAdd = true;
								for(let [i, val] of this.selMainAddList.entries()) {
									if(item[ind].addCode == val.refDetailCode){
										isAdd = false;
									}
								}
								if(isAdd){
									arrC.push(item[ind])
								}
								
							}
							if(arrC.length != 0) {
								Addarr.push(arrC);
							}
						}
					this.carAddList	= [...Addarr];	

					// 去重
					let arr =[];
					for(let [i,val] of this.carAddList.entries()) {
						if(val.length != 0) {
							if(arr.length == 0) {
								arr.push(val)
							}else {
								let onoff = true;
								for(let [j,v] of arr.entries()) {
									if(common.compareArr(v, val)) {
										onoff = false;
										break;
									}
								}
								if(onoff) {
									arr.push(val);
								}
							}
						}					
					}	
					this.carAddList = arr;
					this.getModelAdd();
					this.selMainAddList = [];
					this.selModelAdd = [];
					this.resetData++;
					this.carAddSellList =[];
				});			
				
			},
			// 删除已添加扩展车型信息
			delAddModel(val) {
				MessageBox.confirm(`确定删除该附加信息？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {	
					for(let [index,elem] of this.carAddList.entries()) {
						if(JSON.stringify(elem) == JSON.stringify(val)) {
							this.carAddList.splice(index,1);
							return;
						}
					}
				});
				
			},
			// 复制已添加扩展车型信息
			copyAddModel(val) {
				this.resetData++;
				this.copyData = val;
				setTimeout(() => {
					this.copyData = [];
				}, 50)
			},
			// 表格显示对应的附加信息
			getText(str,arr) {
				if(arr.length == 0) {
					return;
				}
				for(let i = 0; i < arr.length; i++) {
					if(arr[i].addCode === str) {
						return arr[i].addValue;
					}
				}
			},
			// 重置附加信息选择
			resetAddSel() {
				this.resetData++;
			},
			saveData() {				
				if(this.carAddList.length == 0) {
					let obj = {
						relationCode: this.carMoelSel.relationCode,
						isDeleted: 1
					}
					this.carAddList = [[obj]];
				}
				this.getCarCode(this.carMoelSel).then((res) => {
					if(res.length == 0) {
						Message({
							type: "warning",
							message: "查询车型信息失败!"
						});
						this.carAddList = [];
						return;
					}
					let carCode = res[0].carCode;
					let addLen = this.carAddList.length;
					this.createCarAddCode(addLen).then((res) => {
						let param = [];
						for(let [index, item] of this.carAddList.entries()) {
							for(let [i, val] of item.entries()) {
								val.id = this.carMoelSel.id;
								val.carCode = carCode;
								val.carDetailCode = res[index];
								val.relationCode = this.carMoelSel.relationCode;
								param.push(val)
							}
						}
						api.skuCar.carAddEidt(param,(res) => {
							 if(res.data.code === 'success') {
								Message({
									type: "warning",
									message: "保存附加信息成功!"
								});
								this.beforeEidet.addedModelList = [...this.addedModelList];
								this.beforeEidet.carAddList = [...this.carAddList];
								this.isAddBtn = true;
								// 刷新附加信息列表
								this.getCarDetial(this.carMoelSel,this.presentIndex);
								this.refreshTab();
							 }							
						})
					})
				})
				
			},			
			// 控制是否显示添加扩展信息
			showAddAdd() {
				this.isAddBtn = !this.isAddBtn; 
				if(this.isAddBtn) {
					this.resetData++;
					this.addedModelList = [...this.beforeEidet.addedModelList];
					this.carAddList = [...this.beforeEidet.carAddList];
					if(this.addedModelList.length == 0) {
						this.isAddKong = true;
					}
				}else {
					this.isAddKong = false;
					this.beforeEidet.addedModelList = [...this.addedModelList];
					this.beforeEidet.carAddList = [...this.carAddList];
				}			
			},
			// 刷新sku适配车型列表
			refreshTab() {
				let param = {
					skuCode: '',
					skuName: '',
					barCode: '',
					skuModel: '',				
					pageNums: config.pageNums,
					pageStart: 1
				};
				this.getSkuCarList(param);
			}
		},
		watch:{
			modelName(val){
				this.getModelAdd(val);
			}
		}
    }
</script>
<style>
.inp-invalid{
	border-color: #f86c6b!important;
}
.inp-invalid input{
	border: 1px solid #f86c6b!important;
}
.card-header div{
	font-weight: bold!important;
}
.car-add-search{
	padding: 5px 14px;
}
.car-add-box{
	width: 100%;
	height: 300px;
	overflow: auto;
}
.skucar-box{
	display: flex;
	width: 100%;
	flex-flow: row nowrap;

}
.skucar-table-left{
	flex: 0 0 200px!important;
	-webkit-box-flex: 0 0 200px!important;	
}
.skucar-table-left>table td{
	white-space:nowrap!important;
}
.skucar-table-right{
	flex: 1 1 auto;
	overflow: auto;
}
.skucar-th{
	height: 28px;
}
.skucar-th button{
	padding: 0 4px!important;
}
.skucar-td{
	height: 50px;
}
.skucar-table1{
	width: 30px;
}
.skucar-table2{
	width: 170px;
}
.skucar-box table{
	margin: 0;
}
.skucar-box, .skucar-box::before, *::after {
    box-sizing: content-box; 
}
.checkbox-box{
	display: block;
}
.skucar-inpt-tab-center table tr td:nth-child(1){
	text-align: center!important;
}
</style>
