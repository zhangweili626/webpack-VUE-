<template>
	<div @click="getData">
		<el-select v-model="value4" filterable clearable placeholder="请选择" :ref="getType">
			<el-option
				v-for="(item,index) in options"
				:key="index"
				:label="item.text"
				:value="item.id">
			</el-option>
		</el-select>
	</div>
</template>
<script>

	import config from 'common/config'
	import api from 'common/api'
	import Vue from 'vue'
	import {Select, Option} from 'element-ui'
	Vue.use(Select)
	Vue.use(Option)

	export default {
		components:{
		},
		props:{
			resetData:{
				type: Number,
				default: function() {
					return 0;
				}
			},
			getType:{
				type: String,
				default: function() {
					return '';
				}
			},
			param: {
				type: Object,
				default: function() {
					return {};
				}
			},
			copyData: {
				type: Array,
				default: function() {
					return [];
				}
			},
			seledData:{
				type: Array,
				default: function() {
					return [];
				}
			} ,
			disabled:{
				type: Boolean,
				default: function() {
					return false;
				}
			}
		},
		data() {
			return {
				dataList: [],
				selectParams: {
					pageNums: config.pageNums,
					pageStart: 1
				},
				required: false,
				options: [],
				value4: '',
				isWatchVal: true,
			}
		},
		computed: {

		},
		created(){
		},
		methods: {
			getData() {
				this.getcarAdd();
			},
			getcarAdd(val){
				let param = {};
				let addMap = {};
				if(this.seledData.length != 0) {
					for(let i = 0; i < this.seledData.length; i++) {
						if(this.seledData[i].addValue !== "") {
							addMap[this.seledData[i].addCode] = [this.seledData[i].addValue];
						}
					}
				}

				Object.assign(param,this.param);
				param.addCode = this.getType;
				param.addInfoMap = addMap;
				api.skuCar.getCarAdd(param, (res) => {
					if(res.data.code === 'success') {
						let data = res.data.obj
						let list =[];

						if(data.length == 0){
							this.options = [];
							return;
						}
						for(let [index,elem] of data.entries()) {
							let obj = {text: '',id: ''};
							let oId = {};
							oId.addCode = elem.addCode;
							oId.addValue = elem.addValue;
							oId.addName = elem.addName;
							obj.text = elem.addValue;
							obj.id = JSON.stringify(oId);
							if(list.length == 0 ){
								list.push(obj)
							}else {
								let isExist = false;
								for(let [index,item] of list.entries()) {
									if(item.text === obj.text) {
										isExist = true
										break;
									}
								}
								if(!isExist) {
									list.push(obj)
								}

							}
						}
						this.options = list;
					};
				})
			},
		},
		watch: {
			value4(val){
				if(!this.isWatchVal){
					return
				}
				if(val === '') {
					let param = {};
					param.addCode = this.getType;
					param.addValue = '';
					param = JSON.stringify(param);
					this.$emit('canback',param);
				}else {
					this.$emit('canback',val);
				}
				this.options = [];
			},
			resetData(){
				this.value4 = '';
				this.options = [];
			},
			copyData(val) {
				if(this.getType) {
					if(val.length != 0) {
						this.isWatchVal = false;
						for(let [index, item] of val.entries()) {
							if(this.getType === item.addCode) {
								let arr = [];
								let obj = {
									text: item.addValue,
									id: JSON.stringify(item)
								}
								this.options = arr.push(obj);
								this.$emit('canback', obj.id);
								this.value4 = obj.text;
								setTimeout(() => {
									this.isWatchVal = true;
								},50)
							}
						}
					}

				}
			}
		}
	}
</script>
<style lang="css" scoped>

</style>
