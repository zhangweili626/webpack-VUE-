<template>
	<div>
		<div class="row">
			<div class="col-md-4 col-lg-4">
				<b-form-fieldset horizontal :label="label[0]" label-text-align="right" :label-cols="4">
					<b-form-select v-model="provinceCode" :state="provinceState" :options="configs.province"></b-form-select>
				</b-form-fieldset>
			</div>
			<div class="col-md-4 col-lg-4">
				<b-form-fieldset horizontal :label="label[1]" label-text-align="right" :label-cols="4">
					<b-form-select v-model="cityCode" :state="cityState" :options="configs.city"></b-form-select>
				</b-form-fieldset>
			</div>
			<div class="col-md-4 col-lg-4">
				<b-form-fieldset horizontal :label="label[2]" label-text-align="right" :label-cols="4">
					<b-form-select v-model="districtCode" :state="districtState" :options="configs.district" ></b-form-select>
				</b-form-fieldset>
			</div>
		</div>
	</div>
</template>

<script>
	import api from 'common/api'
	export default{
		props:{
			star:{
				type:Boolean,
				default:false
			},
		},
		data(){
			return{
				provinceCode:'',
				cityCode:'',
				districtCode:'',
				configs:{
					province:[],
					city:[],
					district:[],
				},
				label:['省','市','区'],
				provinceState:null,
				cityState:null,
				districtState:null,
			}
		},
		mounted(){
			this.getchinaarea();
			if(this.star){
				this.label=['省*','市*','区*']
			}
		},
		methods:{
			setValue(data){
				this.provinceCode = data.provinceCode
				this.cityCode = data.cityCode
				this.districtCode = data.districtCode
			},
			setProvinceState(data){
				this.provinceState = data
			},
			setCityState(data){
				this.cityState = data
			},
			setDistrictState(data){
				this.districtState = data
			},
			//获取省
		    getchinaarea(){
		        api.chinaarea.querychinaarea({levels:1}, (msg) => {
		            if (msg.data.message == 'success') {
		                let data = msg.data.obj
		                data.forEach(item=>{
		                	this.configs.province.push({
		                		text: item.areaName,
		                        value: item.areaCode,
		                	})
		                })
		            
		            }
		        })
		    },
		},
		watch:{
			provinceCode(newDate,oldDate){
				this.configs.city = [];
				api.chinaarea.querychinaarea({"levels":2,"fatherAreaCode":newDate},res => {
					if(res.data.code == 'success'){
						res.data.obj.forEach(item =>{
							this.configs.city.push({
								text: item.areaName,
		                        value: item.areaCode,
							})
						})
						this.$emit('getprovinceCode',newDate)
					}
				})
			},
			cityCode(newDate){
				this.configs.district =[];
				api.chinaarea.querychinaarea({"levels":3,"fatherAreaCode":newDate},res => {
					if(res.data.code == 'success'){
						res.data.obj.forEach(item =>{
							this.configs.district.push({
								text: item.areaName,
		                        value: item.areaCode,
							})
						})
						this.$emit('getcityCode',newDate)
					}
				})
			},
			districtCode(newDate){
				console.log(newDate)
				this.$emit('getdistrictCode',newDate)
			},
		}
	}
</script>

<style>
</style>