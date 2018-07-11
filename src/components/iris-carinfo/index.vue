<template lang="html">
	<div class="row">
		<div :class="{'col-md-4': col=='3', 'col-md-6': col=='2', 'col-md-12': col=='1'}" v-if="!flag">
			<b-form-fieldset horizontal :label="label[0]" :label-cols="4" class="text-right">
				<b-form-select :state="factoryState" v-model="carCurr.factory" :options="factory" :disabled="isDisabled">
				</b-form-select>
			</b-form-fieldset>
		</div>
		<div :class="{'col-md-4': col=='3', 'col-md-6': col=='2', 'col-md-12': col=='1'}">
			<b-form-fieldset horizontal :label="label[1]" :label-cols="4" class="text-right">
				<b-form-select :state="brandState" v-model="carCurr.brand" :options="brand" :disabled="isDisabled">
				</b-form-select>
			</b-form-fieldset>
		</div>
		<div :class="{'col-md-4': col=='3', 'col-md-6': col=='2', 'col-md-12': col=='1'}">
			<b-form-fieldset horizontal :label="label[2]" :label-cols="4" class="text-right">
				<b-form-select :state="seriesState" v-model="carCurr.series" :options="series" :disabled="isDisabled">
				</b-form-select>
			</b-form-fieldset>
		</div>
		<div :class="{'col-md-4': col=='3', 'col-md-6': col=='2', 'col-md-12': col=='1'}" v-if="showLength > 3">
			<b-form-fieldset horizontal :label="label[3]" :label-cols="4" class="text-right">
				<b-form-select :state="modelState" v-model="carCurr.model" :options="model" :disabled="isDisabled">
				</b-form-select>
			</b-form-fieldset>
		</div>
		<div :class="{'col-md-4': col=='3', 'col-md-6': col=='2', 'col-md-12': col=='1'}" v-if="showLength > 4">
			<b-form-fieldset horizontal :label="label[4]" :label-cols="4" class="text-right">
				<b-form-select :state="opvState" v-model="carCurr.opv" :options="opv" :disabled="isDisabled">
				</b-form-select>
			</b-form-fieldset>
		</div>
		<div :class="{'col-md-4': col=='3', 'col-md-6': col=='2', 'col-md-12': col=='1'}" v-if="showLength > 5">
			<b-form-fieldset horizontal :label="label[5]" :label-cols="4" class="text-right">
				<b-form-select :state="ioTypeState" v-model="carCurr.ioType" :options="ioType" :disabled="isDisabled">
				</b-form-select>
			</b-form-fieldset>
		</div>
	</div>
</template>
<script>
	// 是否禁用isDisabled (禁用:true, 启用: false)
	// 设置默认值 setValue(data) data:{
	//   factoryCode:'',
	//   brandCode:'',
	//   seriesCode:'',
	//   modelCode:'',
	//   opvCode: '',
	//   ioTypeCode: ''
	// }
	// 选择后触发callBack事件
	// validateLen需要验证的数据是否为空的个数(大于0,小于6的整数)
	// 验证后触发validete事件
	// flag: false 从厂家开始，true从品牌开始
	import api from '../../common/api'
	import config from '../../common/config'
	import vm from "vue";
	export default {
		props: {
			// flag: {
			// 	type: Boolean,
			// 	default: true
			// },
			showLength: {
				type: Number,
				default: 6
			},
			col: {
				type: Number,
				default: 3
			},
			initData:{},
			isDisabled:{
				type:Boolean,
				default:false
			},
			star:{
				type:Boolean,
				default:false
			},
			validateLen:{
				type:Number,
				default:0
			}
		},
		data(){
			return {
				flag: config.carFlag,
				factory:[],
				brand:[],
				series:[],
				model:[],
				opv: [],
				ioType: [],
				carCurr:{
					factory:'',
					brand:'',
					series:'',
					model:'',
					opv: '',
					ioType: '',
				},
				carinfo:{
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
					ioTypeCode: '',
					ioTypeName: ''
				},
				factoryState:null,
				brandState:null,
				seriesState:null,
				modelState:null,
				opvState:null,
				ioTypeState:null,
				mapArr:['factory', 'brand', 'series', 'model', 'opv', 'ioType'],
				label:['厂家','品牌','车系','车型','排气量','进气方式'],
				isWChange: true
			}
		},
		created(){
			if(this.star){
				this.label = ['厂家 *','品牌 *','车系 *','车型 *','排气量 *','进气方式 *'];
			}
			//this.flag = config.carFlag;
			this.once()
		},
		computed:{
			_factory:function(){
				return this.carCurr.factory;
			},
			_brand:function(){
				return this.carCurr.brand;
			},
			_series:function(){
				return this.carCurr.series;
			},
			_model:function(){
				return this.carCurr.model;
			},
			_opv:function(){
				return this.carCurr.opv;
			},
			_ioType:function(){
				return this.carCurr.ioType;
			}

		},
		methods:{
			setValue(val){
				this.clear()
				let _this = this;
				let data = val;
				let num = this.flag?1:0, len;		
				let setFun = async function() {
					for(var i = num, len = _this.mapArr.length; i < len; i++){				
						let code = 	data[_this.mapArr[i]+'Code'];						
						if(code) {				
							let arrCode = i === num ? '' : data[_this.mapArr[i-1]+'Code'];
							let resl = await _this.getDa(arrCode, _this.mapArr[i], i);
							_this.fliterVal(_this[_this.mapArr[i]], data[_this.mapArr[i]+'Code'], _this.mapArr[i])
						}				
					}
					_this.isWChange = true;
				}
				setFun();
				
			},
			getDa(code, type,i) {
				let _this = this;	
				return new Promise((resolve, reject) => {
					_this.isWChange = false;
					if((!_this.flag) && type == 'factory') {
						_this.getData('', 1, 0, 'factory').then((res) => {						
							resolve(res);
						})
					}else if(_this.flag && type == 'brand') {
						_this.getData('', 2, 0, 'brand').then((res) => {
							resolve(res);
						})
					}else {
						_this.getData(code, Math.pow(2,i), i-1, type).then((res) => {
							resolve(res);
						})
					}
				})
			},
			fliterVal(arr, code, str) {			
				if(arr.length == 0) return;
				for(let [index, item] of arr.entries()) {
					if(item.value[str+'Code'] === code) {
						this.carCurr[str] = item.value;
					}
				}
			},
			// 增加重置功能 by lwx
			clear() {
				this.carCurr = {
					factory:'',
					brand:'',
					series:'',
					model:'',	
					opv: '',
					ioType: '',
				};
				this.series = [];
				this.model = [];
				this.opv = [];
				this.ioType = [];
				if(!this.flag) {
					this.brand = [];
				}
				this.factoryState = null;
				this.brandState = null;
				this.seriesState = null;
				this.modelState = null;
				this.opvState = null;
				this.ioTypeState = null;
				this.$emit('callBack', this.carCurr);
			},
			validate(){			 
				var flag = true;
				var num = this.flag?1:0, i, len;
				for(i = num, len = this.validateLen; i < len; i++){
					if(this.carCurr[this.mapArr[i]] == '' || this.carCurr[this.mapArr[i]] == undefined){
						this[this.mapArr[i]+'State'] = false;
						flag = false;
					}else{
						this[this.mapArr[i]+'State'] = null;
					}
				}
				this.$emit('validete',flag);
			},

			once: function() {
				if(!this.flag) {
					this.getData('', 1, 0, 'factory');
				}else{
					this.getData('', 2, 0, 'brand');
				}
			},

			//获取车节点数据
			getData(code, level, type, name){
				var $this = this, code = code || '';
				return new Promise((reslove,reject) => {
					api.car.queryCarInfoByCarSearch({
						code:code,
						level:level,
						type:type,
						//厂家编码
						carFactoryCode:$this.carCurr.factory.factoryCode,
						// 品牌编码
						carBrandCode:$this.carCurr.brand.brandCode,
						// 车系编码
						carSeriesCode:$this.carCurr.series.seriesCode,
						// 车型编码
						carModelCode:$this.carCurr.model.modelCode,
						// 排量编码
						carOpvCode:$this.carCurr.opv.opvCode,
						// 进气方式编码
						carIoTypeCode:$this.carCurr.ioType.ioTypeCode
					},function(res){
						if(res.data.code == 'success'){
							$this[name] = [];
							if(!res.data.obj)return;
							$this.setOptions($this[name], res.data.obj, name);
							reslove(res.data.obj)
						}
					})
				})
				
			},
			//给选项添加数据
			setOptions(obj, data, nav){
				if(data.length == 0 && typeof data != 'object') return;
				for(var i = 0, len = data.length; i < len; i++){
					if(nav == 'car'){
						obj.push({text:data[i]['displayName'], value:{['carName']:data[i]['displayName'],[nav+'Code']:data[i][nav+'Code']}})
					}else if(nav == 'ioType') {
						obj.push({text:data[i]['iotypeName'], value:{ioTypeName:data[i]['iotypeName'], ioTypeCode:data[i][nav+'Code']}})
					}else{
						obj.push({text:data[i][nav+'Name'], value:{[nav+'Name']:data[i][nav+'Name'],[nav+'Code']:data[i][nav+'Code']}})
					}
				}
			},
			selectBack(type, val){
				if(!type || !val)return;
				this.getData(val, 2, 0, 'brand');
			},
			resetSelectData(str){
				var num = this.mapArr.indexOf(str);
				if(this[str].length == 0)return;
				for(var i = num, len = this.mapArr.length; i < len; i++){
					for(var key in this.carCurr[this.mapArr[i]]){
						this.carCurr[this.mapArr[i]][key] = ''						
					}
					this.carCurr[this.mapArr[i]] = [];
					//this[str] = [];

				}
			},
			analysisData(val) {
				let obj = Object.assign({}, this.carinfo);
				for( let item of Object.values(val)){
					Object.assign(obj,item)
				}	
				return obj;
			},
			getName(arr,val,str) {
				for(let i=0; i<arr.length; i++) {
					if(!arr[i].value[str + 'Code']){
						return;
					}
					if(val == arr[i].value[str + 'Code']) {				
						return arr[i].value
					}
				}
			}
		},
		watch:{
			//监听厂家获取品牌
			_factory(val){				
				if((!this.isWChange) || !val || !val.factoryCode ) {
					return;
				}
				this.resetSelectData('brand');
				let param = this.analysisData(this.carCurr);
				this.$emit('callBack',param);
				this.getData(val.factoryCode, 2, 0, 'brand');
			},
			//监听品牌获取车系
			_brand(val){
				if((!this.isWChange) || !val || !val.brandCode) {
					return;
				}
				this.resetSelectData('series');
				let param = this.analysisData(this.carCurr);				
				this.$emit('callBack',param);
				this.getData(val.brandCode, 4, 1, 'series');
			},
			//监听车系获取车型
			_series(val){
				if((!this.isWChange) || !val  || !val.seriesCode) {
					return;
				}
				this.resetSelectData('model');
				let param = this.analysisData(this.carCurr);				
				this.$emit('callBack',param);
				this.getData(val.seriesCode, 8, 2, 'model');
			},
			//监听车型获取排量
			_model(val){
				if((!this.isWChange) || !val || !val.modelCode) {
					return;
				}				
				this.resetSelectData('opv');
				let param = this.analysisData(this.carCurr);
				this.$emit('callBack',param);
				this.getData(val.modelCode, 16, 3, 'opv');
			},
			//监听排量获取进气方式
			_opv(val){
				if((!this.isWChange) || !val || !val.opvCode) {
					return;
				}
				this.resetSelectData('ioType');
				let param = this.analysisData(this.carCurr);				
				this.$emit('callBack',param);
				this.getData(val.opvCode, 32, 4, 'ioType');
			},
			//监听进气方式
			_ioType(val){
				if((!this.isWChange) || !val) {
					return;
				}
				let param = this.analysisData(this.carCurr);
				this.$emit('callBack',param);
			}
		}

	}
</script>
<style lang="scss" scoped>

</style>
