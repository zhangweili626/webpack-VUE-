<template>
	<div>
		<b-modal ref="carInfoModel"
			 id="carInfoModel" 
			 :title="title"
			 @shown="showModel"
		  	 @ok="ok" 
		  	 @cancel="aa"
		  	 @hidden = 'hide'
		  	 ok-title="确定"
		  	 cancel-title="取消"
			>
			<div class="row">
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="车牌" label-text-align="right" :label-cols="4">
						<b-form-input v-model="mainInfo.plateNumber" ></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="临时车牌" label-text-align="right" :label-cols="4">
						<b-form-input v-model="mainInfo.plateNumberTmp"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="VIN码" label-text-align="right" :label-cols="4">
						<b-form-input v-model="mainInfo.vinCode"></b-form-input>
					</b-form-fieldset>
				</div>
			</div>
		 	<addSelectCar :star="true" 
		 		:validateLen ='6'  
		 		@validete="validete" 
		 		@getCarExtendInfo="getCarExtendInfo" 
		 		ref="selectCar">
		 	</addSelectCar>
		 	<div class="border-bottom">
		 		<p class="bold">其他信息</p>
		 	</div>
		 	<div class="row">
		 		<div class="clo-md-4 col-lg-4">
		 			<b-form-fieldset horizontal label="上牌日" label-text-align="right" :label-cols="4">
						<el-date-picker
						 v-model="mainInfo.plateDate"
					      type="date"
					      placeholder="选择日期">
					    </el-date-picker>
					</b-form-fieldset>
		 		</div>
		 		<div class="clo-md-4 col-lg-4">
		 			<b-form-fieldset horizontal label="保险到期" label-text-align="right" :label-cols="4">
						<el-date-picker
					      type="date"
					      v-model="mainInfo.commercialInsuranceEndDate"
					      placeholder="选择日期">
					    </el-date-picker>
					</b-form-fieldset>
		 		</div>
		 		<div class="clo-md-4 col-lg-4">
		 			<b-form-fieldset horizontal label="交强险到期" label-text-align="right" :label-cols="4">
						<el-date-picker
					      type="date"
					      v-model="mainInfo.compulsoryInsuranceEndDate"
					      placeholder="选择日期">
					    </el-date-picker>
					</b-form-fieldset>
		 		</div>
		 		<div class="col-md-4 col-lg-4">
	 				<b-form-fieldset horizontal label="进厂里程" label-text-align="right" :label-cols="4">
						<b-form-input v-model="mainInfo.inMileage"></b-form-input>
					</b-form-fieldset>
	 				
	 			</div>
 				<div class="col-md-4 col-lg-4">
 					<b-form-fieldset horizontal label="商业保险公司" label-text-align="right" :label-cols="4">
						<search
                            ref="search"
                            :hasCheck="required"
                            :dataList="datalist"  
                            option="coName" 
                            @dataChange="querySelect"
                            @itemValue="itemValue"
                            @clickShowBack="firstLoad()"
                            @comScroll="comScroll"
                            @clearValue="clearValue"
                            :disabled="isforbidden">
						</search>
					</b-form-fieldset>
	 			</div>
		 		<div class="col-md-4 col-lg-4">
 					<b-form-fieldset horizontal label="交强险公司" label-text-align="right" :label-cols="4">
						<search
                            ref="search2"
                            :hasCheck="required"
                            :dataList="datalist"  
                            option="coName" 
                            @dataChange="querySelect"
                            @itemValue="itemValue2"
                            @clickShowBack="firstLoad()"
                            @comScroll="comScroll"
                            @clearValue="clearValue2"
                            :disabled="isforbidden">
						</search>
					</b-form-fieldset>
	 			</div>		
	 			<div class="col-md-4 col-lg-4">
	 				<b-form-fieldset horizontal label="保险备注" label-text-align="right" :label-cols="4">
						<b-form-input v-model="mainInfo.commercialInsuranceCompanyRemark"></b-form-input>
					</b-form-fieldset>
	 				
	 			</div>
		 			
		 		<div class="clo-md-4 col-lg-4">
		 			<b-form-fieldset horizontal label="车辆备注" label-text-align="right" :label-cols="4">
						<b-form-input v-model="mainInfo.vehicleRemark"></b-form-input>
					</b-form-fieldset>
		 		</div>
		 	</div>
		 
		</b-modal>
	</div>
</template>

<script>
	import Vue from 'vue'
	import {getType,getSequence,getSequenceList} from 'common/api-common.js'
	import { MessageBox, Message,DatePicker} from 'element-ui'
	import api from 'common/api'
	Vue.use(DatePicker)
	import config from 'common/config'
	import common from 'common/common'
	import addSelectCar from 'components/select-car-extend-prop/select-car-extend-prop.vue'
	import search from 'components/iris-search/search.vue'
	export default{
		props:['list','isedit','customCode','customVehicleAddInfoVos','vehicleCode'],
		mounted(){
		},
		components:{
			addSelectCar,
			search,
		},
		data(){
			return{
				flag:false,
				required: false,
				isforbidden: false,
				datalist:[],
				configs:{
					commercialInsuranceCompany:[],
				},
				selected:'',
				title:'新增车辆信息',
				mainInfo:{
					commercialInsuranceEndDate:'',
					compulsoryInsuranceEndDate:'',
					commercialInsuranceCompanyCode:'',
					compulsoryInsuranceCompanyCode:'',
					plateDate:'',
					vehicleRemark:'',
					commercialInsuranceCompanyRemark:'',
					vinCode:'',
					plateNumberTmp:'',
					plateNumber:'',
					inMileage:'',
				},
				check:{
					plateNumber:null
				},
				customVehicle:[],
				selectParams: {
					onOffFlag:'0',
                    pageNums: config.pageNums,
                    pageStart: 1
                },
                contrastArr:[],
                contrastArr2:[],
                carCode:'',
			}
		},
		methods:{
			//查询编辑数据
			//查询车辆信息
		   getCarInfo(){
			const option ={
				customCode:this.$route.query.customCode,
    			vehicleCode:this.vehicleCode
			}
			api.mancar.getCustomVehicleInfoByCode(option,res=>{
				if(res.data.code == 'success'){
					this.mainInfo = res.data.obj
					this.carCode = res.data.obj.carCode
					if(this.mainInfo.customVehicleAddInfoVos.length){
						this.mainInfo.customVehicleAddInfoVos.forEach(item=>{
							this.customVehicle.push({
								propCode:item.addCode,
								propName:item.addName,
								selectedProps:[item.addValue],
							})
							this.contrastArr = JSON.parse(JSON.stringify(this.customVehicle));
						})
					}else{
						this.customVehicle = []
					}
					
					this.$refs.search.setValue(this.mainInfo.commercialInsuranceCompanyName)
					this.$refs.search2.setValue(this.mainInfo.compulsoryInsuranceCompanyName)
					this.$refs.selectCar.setValue(this.mainInfo,this.customVehicle)
				}
			})
		},
			aa(){
					this.$emit('getCarList')
					this.$refs.selectCar.reset()
					this.mainInfo = {}
			},
			setStatus(){
				this.$refs.selectCar.setStatus();
			},
			validete(val){
				console.log(val)
				this.flag = val
			},
			getCarExtendInfo(data,data1){
				//主车型信息、扩展属性变化时触发的方法，返回最新的数据
				if(this.isedit){
					if(data1){
						//用于最后与原始值进行对比，找出已经删除的数据，发送给后端
						this.contrastArr2 = data1
						//判断新增
						data1.forEach(item =>{
							const Index = this.mainInfo.customVehicleAddInfoVos.findIndex(v=>v.addCode == item.propCode);
							if(Index == -1){
								getSequence('CUSTOMVEHICLEADDSEQ',(res) =>{
	    							this.mainInfo.customVehicleAddInfoVos.push({
										vehicleCode:this.mainInfo.vehicleCode,
										carCode:this.carCode,
										carDetailCode:res,
										addCode: item.propCode,
										addName: item.propName,
										addValue:item.selectedProps[0],
									})
	    						})
								
							}else{
								this.mainInfo.customVehicleAddInfoVos[Index].addCode = item.propCode;
								this.mainInfo.customVehicleAddInfoVos[Index].addName = item.propName;
								this.mainInfo.customVehicleAddInfoVos[Index].addValue = item.selectedProps[0];
							}
						})
					}
					for(let k of Object.keys(data)){
						this.mainInfo[k] = data[k]
					}
				}else{
					Object.assign(this.mainInfo,data)
					this.mainInfo.customVehicleAddInfoVos = data1
					if(this.mainInfo.customVehicleAddInfoVos.length){
			    			const option ={
				    			getNums:this.mainInfo.customVehicleAddInfoVos.length,
				    			serviceCode:'CUSTOMVEHICLEADDSEQ'
				    		}
			    			getSequenceList(option,res =>{
			    				   this.mainInfo.customVehicleAddInfoVos.forEach((item,i) => {
										return new Promise((resolve,reject)=>{
										item.vehicleCode = this.mainInfo.vehicleCode;
										/*item.carCode = 'er';*/
										item.carDetailCode = res[i];
										item.addCode = item.propCode;
										item.addName= item.propName;
										item.addValue = item.selectedProps[0];
										})
									})
			    				    
			    			})
			    		}
				}
			},
			hideModel(){
				
			},
			showModel(){
//				console.log(this.isedit)
				
				if(this.isedit){
					this.getCarInfo();
					this.customVehicle = [];
					this.title="编辑车辆扩展信息";
					/*console.log(this.customVehicleAddInfoVos)*/
				
				}else{
					this.title="新增车辆扩展信息";
					this.$refs.search.setValue('')
					this.$refs.search2.setValue('')
					this.$refs.selectCar.reset()
					console.log(this.mainInfo)
					for(let k of Object.keys(this.mainInfo)){
							this.mainInfo[k]='';
						}
				}
				this.mainInfo.customCode = this.customCode
			},
			shModel(){
				if(!this.isedit){
					this.mainInfo={}
				}
			},
			show(){
				this.$refs.carInfoModel.show()
			},
			hide(){
				this.$refs.carInfoModel.hide()
				this.$emit('getCarList')
				this.$emit('modifyEdit',false)
				this.mainInfo = {}
			},
			ok(ev){
				ev.preventDefault();
				this.setStatus();
				if(! this.mainInfo.plateNumber){
					this.check.plateNumber = 'invalid'
				}
				if(!this.mainInfo.plateNumber && !this.mainInfo.plateNumberTmp){
					Message({
							type:'error',
							message:'车牌和临牌必须填写一个',
						})
					return
				}
				if(!this.flag)return;
				if(this.isedit){
					this.edit()
				}else{
					this.getSequence().then(()=>{
						delete this.mainInfo.id
						this.mainInfo.plateDate = common.eleTimeFormat(this.mainInfo.plateDate)
						this.mainInfo.commercialInsuranceEndDate = common.eleTimeFormat(this.mainInfo.commercialInsuranceEndDate)
						this.mainInfo.compulsoryInsuranceEndDate = common.eleTimeFormat(this.mainInfo.compulsoryInsuranceEndDate)
						api.mancar.insertCustomVehicleInfo(this.mainInfo,res=>{
							if(res.data.code == 'success'){
								Message({
									type:'success',
									message:'添加车辆信息成功',
								})
								this.check.plateNumber = null
								this.$emit('getCarList')
								this.$refs.selectCar.reset()
								for(let k of Object.keys(this.mainInfo)){
									this.mainInfo[k]='';
								}
							}
							
						})
				})
				}
				this.$refs.carInfoModel.hide()
				
			},
			getSequence(){
	    		return new Promise((resolve,reject)=>{
	    			getSequence('CUSTOMVEHICLESEQ',res=>{
	    				this.mainInfo.vehicleCode = res
	    				this.mainInfo.customVehicleAddInfoVos.forEach(item=>{
	    					item.vehicleCode = 	this.mainInfo.vehicleCode
	    				})
	    				resolve();
	    			})
	    		})
	    },
    	edit(){ 
    		 	//判断新增、删除
		 		//判断删除
		 		  debugger
					this.contrastArr.forEach((item,index)=>{
						const Index = this.contrastArr2.findIndex(v=>v.propCode == item.propCode);
						const Index2 = this.mainInfo.customVehicleAddInfoVos.findIndex(v=>v.addCode == item.propCode);
						if(Index == -1){
							this.mainInfo.customVehicleAddInfoVos[Index2].isDeleted = 1
						}
					})
    		    this.mainInfo.plateDate = common.eleTimeFormat(this.mainInfo.plateDate)
				this.mainInfo.commercialInsuranceEndDate = common.eleTimeFormat(this.mainInfo.commercialInsuranceEndDate)
				this.mainInfo.compulsoryInsuranceEndDate = common.eleTimeFormat(this.mainInfo.compulsoryInsuranceEndDate)
    			api.mancar.updateCustomVehicleInfo(this.mainInfo,res=>{
					if(res.data.code == 'success'){
						Message({
							type:'success',
							message:'编辑车辆信息成功',
						})
						this.$refs.selectCar.reset()
						for(let k of Object.keys(this.mainInfo)){
							this.mainInfo[k]='';
						}
						this.mainInfo.customVehicleAddInfoVos = []
						this.check.plateNumber = null
						this.$emit('getCarList')
						this.$emit('modifyEdit',false)
						
					}
				})
	    	},
    	//商业保险公司
    	// 搜索框内值改变   触发搜索
        querySelect(data) {
            this.selectParams.pageStart = 1;
            this.selectParams.supplierName = data;
            let params = this.selectParams;
            this.getSupplierName(params, (res)=> {
            this.isLastPage = res.isLastPage;
            this.datalist = res.list;
            });
        },
        // 选中某一项    
        itemValue(value) {
        	console.log(value)
        	this.mainInfo.commercialInsuranceCompanyCode = value.coCode
        	this.mainInfo.commercialInsuranceCompanyName= value.coName
        },
         // 选中某一项    
        itemValue2(value) {
        	this.mainInfo.compulsoryInsuranceCompanyCode = value.coCode
        	this.mainInfo.compulsoryInsuranceCompanyName= value.coName
        },
        //清除保险的值
        clearValue() {
            this.mainInfo.commercialInsuranceCompanyCode = ''
            this.mainInfo.commercialInsuranceCompanyName = ''
        },
         //清除保险的值
        clearValue2() {
            this.mainInfo.compulsoryInsuranceCompanyCode = ''
            this.mainInfo.compulsoryInsuranceCompanyName = ''
        },
	         // 第一次加载数据
        firstLoad(index=1) {
            this.getSupplierName(this.selectParams, (res)=> {
                this.isLastPage = res.isLastPage
                this.datalist = res.list
            })
        },
         // 滚动加载
        comScroll(isEnd) {
            if (isEnd && !this.isLastPage) {
                this.selectParams.pageStart ++
                this.getSupplierName(this.selectParams, obj => {
                    this.isLastPage = obj.isLastPage;
                    if(obj.list){
                        this.datalist = this.datalist.concat(obj.list);
                    }
                });
            }
        },
         // 定义向后台请求supplierName的方法
        getSupplierName(params,callback) {
            api.mancar.queryCompanyInfoByCodesAndPagination(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },
		}
	}
</script>

<style>
	#carInfoModel .modal-dialog{
		min-width: 1000px !important;
	}
	.border-bottom p{
		border-bottom: 1px solid #d1dbe5;
		height: 40px;
		line-height: 40px;
		font-weight: bold;
	}
</style>