<template>
    <div>
        <b-card header="适配车型信息">			
			<div class="row">
			    <div class="col-md-4" v-show="!isShowFactory">
			        <b-form-fieldset horizontal label="厂家" :label-cols="4" class="text-right">
			            <b-form-input v-model="carInfo.factoryName" :disabled="true"/>
			        </b-form-fieldset>
			    </div>
			    <div class="col-md-4">
			        <b-form-fieldset horizontal label="品牌" :label-cols="4" class="text-right">
			            <b-form-input v-model="carInfo.brandName" :disabled="true"/>
			        </b-form-fieldset>
			    </div>
			    <div class="col-md-4">
			        <b-form-fieldset horizontal label="车系" :label-cols="4" class="text-right">
			            <b-form-input v-model="carInfo.seriesName" :disabled="true"/>
			        </b-form-fieldset>
			    </div>
			    <div class="col-md-4">
			        <b-form-fieldset horizontal label="车型" :label-cols="4" class="text-right">
			            <b-form-input v-model="carInfo.modelName" :disabled="true"/>
			        </b-form-fieldset>
			    </div>
			    <div class="col-md-4">
			        <b-form-fieldset horizontal label="排量" :label-cols="4" class="text-right">
			            <b-form-input v-model="carInfo.opvName" :disabled="true"/>
			        </b-form-fieldset>
			    </div>
			    <div class="col-md-4">
			        <b-form-fieldset horizontal label="进气方式" :label-cols="4" class="text-right">
			            <b-form-input v-model="carInfo.ioTypeName" :disabled="true"/>
			        </b-form-fieldset>
			    </div>
			</div>
			<hr/>
			<h6>扩展属性</h6>
            <el-tabs v-model="activeCode" type="card" @tab-click="tabClick">
			    <el-tab-pane v-for="(item, index) in extendProps" :label="item.text" :key="index" :name="item.value">
					<div class="extend-sub-prop" v-for="(ele, i) in subPropList" :key="i" @click="selectSubProp(ele)">
						{{ ele.addValue }}
					</div>
				</el-tab-pane>
		  	</el-tabs>
		</b-card>

		<b-card id="manhour_selectOption" header="已选扩展属性">
			<div class="manhour_borderBottom" v-for="(item, i) in selectedList" :key='i'>
				{{`【${item.propName}】 ：`}}
				<span v-for="(element, index) in item.selectedProps" :key="index">
					{{element.addValue}}  
					<i class="el-icon-circle-cross" @click="deleteSelectedProp(element, index)" style="marginLeft: 6px; marginRight: 6px; cursor: pointer;"></i>
				</span>
			</div>
		</b-card>

		<b-card header="范围与工时">
			<range :channels="channels" 
			    :datalist="rangeList"
			    @removeItem="removeItem" 
				@confirmInsert="confirmInsert">
			</range>

			<div class="row">
				<div class="col-md-12">
					<div class="pull-right">
						<b-button size="sm" variant="success" @click="save">保存</b-button>
					</div>
				</div>
			</div>
		</b-card>
    </div>
</template>
<script>
	import Range from"components/range/range"

	import Vue from 'vue'
    import { Tabs, TabPane } from 'element-ui'
	
	import config from 'common/config'
	import api from 'common/api'
	import { getType, filter } from 'common/api-common'
	
	Vue.use(Tabs)
	Vue.use(TabPane)

    export default {
		components: {
			Range
		},
        data() {
            return {
				isShowFactory: config.isShowFactory,
				carInfo: {
					factoryName:'',
					brandName:'',
					seriesName:'',
					modelName:'',
					opvName:'',
					ioTypeName:''
				},

				extendProps: [],      // 扩展属性列表
				subPropList: [],      // 扩展子属性列表
				activeCode: 'second',
				selectedList: [],    // 已经选择的扩展属性 => 页面展示用
                allSelectedList: [], // 包含重复的扩展子属性 => 后续删除用
				
				channels: [],
				rangeList: []
            }
        },
        computed: {
			addInfoMap() {
				let info = {}
				for(let i = 0; i < this.selectedList.length; i ++) {
					info[this.selectedList[i].propCode] = []
                    for(let j = 0; j < this.selectedList[i].selectedProps.length; j ++) {
                        info[this.selectedList[i].propCode].push(this.selectedList[i].selectedProps[j].addValue)
					}
				}
				return info
			}
        },
        created() {
			this.carInfo = this.$route.query
			this.getExtendProps()
			this.getChannels()
        },
        methods: {
			// 车型扩展属性 => 子属性选择删除
			selectSubProp(item) {
				let obj = {
					propName: this.findActiveName(this.activeCode),
					propCode: this.activeCode,
					selectedProps: []
				}
				obj.selectedProps.push(item)
				let codeList = new Set([])
				if(this.selectedList.length) {
					this.selectedList.forEach(item => {
						codeList.add(item.propCode)
					})
				}
				if(!codeList.has(this.activeCode) || !this.selectedList.length) {
				    this.selectedList.push(obj)
				}else if(codeList.has(this.activeCode)) {
					for(let i = 0; i < this.selectedList.length; i ++) {
						// 这里有个小bug, 二次选择重复 => 已修复
						// this.selectedList[i].selectedProps.indexOf(item) === -1
						if(this.selectedList[i].propCode === this.activeCode
							&& !this.isSelected(item, this.selectedList[i].selectedProps)) {
							    this.selectedList[i].selectedProps.push(item)
						}
					}
				}
				// console.log(this.selectedList)
			},
			// 1. 如果子属性被多个父属性包含, 除非父属性全部被删除才删除子属性, 反之不删除
			// 2. 如果父属性包含多个子属性, 能被删除的子属性不可以被其他的父属性所包含  =>  需求确认不必考虑这一点 => 后续考虑不对还是需要
			deleteSelectedProp(item, currentIndex) {
				let itemCodeValue = `${item.addCode}-${item.addValue}`
				// console.log(itemCodeValue)
				let itemGroupList = item.addGroup.split(',')
				// console.log(itemGroupList)
				for(let i = 0; i < this.selectedList.length; i ++) {
                    for(let j = 0; j < this.selectedList[i].selectedProps.length; j ++) {	
						let selectedProps = this.selectedList[i].selectedProps[j]		
						if(item.addValue === selectedProps.addValue) {
							this.selectedList[i].selectedProps.splice(currentIndex, 1)
						}
						else {
							let everyGroupList = selectedProps.addGroup.split(',')
							let everyCodeValue = `${selectedProps.addCode}-${selectedProps.addValue}`
							// console.log(everyGroupList)
							if( everyGroupList.indexOf(itemCodeValue) !== -1 ) {
								this.selectedList[i].selectedProps.splice(j--, 1)
							}else if(itemGroupList.indexOf(everyCodeValue) !== -1) {
								console.log(i, j)
								console.log(this.selectedList[i + 1].selectedProps)
								// let _curGroupList = this.selectedList[i + 1].selectedProps[j].addGroup.split(',')
								// console.log(_curGroupList, everyCodeValue)
								let curSelectedProps = this.selectedList[i + 1].selectedProps
								curSelectedProps.forEach((item, index) => {
									let _curGroupList = item.addGroup.split(',')
									console.log(_curGroupList, everyCodeValue)
									if(_curGroupList.indexOf(everyCodeValue) !== -1) {
										console.log('------remove up --- ' + selectedProps.addValue)
										this.selectedList[i].selectedProps.splice(index--, 1)							
									}
								})
								// if(_curGroupList.indexOf(everyCodeValue) == -1) {
								// 	console.log('------remove up --- ' + selectedProps.addValue)
								// 	this.selectedList[i].selectedProps.splice(j--, 1)							
								// }
							}
						}
					}
				}
				this.tabClick()
			},
        	tabClick() {
				let option = {
					factoryCode: this.carInfo.factoryCode,
					brandCode: this.carInfo.brandCode,
					seriesCode: this.carInfo.seriesCode,
					modelCode: this.carInfo.modelCode,
					opvCode: this.carInfo.opvCode,
					iotypeCode: this.carInfo.ioTypeCode,
					addCode: this.activeCode,
					addInfoMap: this.addInfoMap
				}
				this.subPropList = []
				api.skuCar.getCarAdd(option, res => {
					if(res.data.code === 'success') {
						let list = res.data.obj
						
						this.subPropList = filter(list, 'addValue')
						let _subPropList = new Set(filter(list, 'addValue'))
						
                        
						let difference = new Set([...list].filter(x => !_subPropList.has(x)))
                        console.log(this.subPropList)
						console.log(difference)

						this.subPropList.forEach(ele => {
							ele.prevGroup = []
							// let groups = ele.addGroup.split(',')
							// ele.prevGroup.push(groups[groups.length - 1])
							ele.prevGroup.push(ele.groups)
							for (let item of difference.values()) {
							    if(item.addValue === ele.addValue) {
									// let _groups = item.addGroup.split(',')
									// ele.prevGroup.push(_groups[_groups.length - 1])		
							        ele.prevGroup.push(item.addGroup)																									
								}
							}
							console.log(ele)
						})
						// 数据占存
						let obj = {
							propCode: this.activeCode,
							allSelectedProps: list
						}
						this.allSelectedList.push(obj)
					}
				})
			},
			getExtendProps() {
				getType(config.serManhours.extendCode, items => {
					this.extendProps = []
					items.forEach(item => {
						let data = {
							text: item.refDetailName,
							value: item.refDetailCode
						}
						this.extendProps.push(data)
					})
				})
			},
			findActiveName(activeCode, list = this.extendProps) {
				let text = ''
				list.forEach(item => {
					if(activeCode === item.value) {
						text = item.text
					}
				})
				return text
			},
			isSelected(item, list) {
				let valueList = new Set()
				list.forEach(key => {
					valueList.add(key.addValue)
				})
				return valueList.has(item.addValue)
			},
            // 范围与工时
			getChannels() {
				getType(config.serviceStaticPrice.channelRef, items => {
					this.channels = []
					items.forEach(item => {
						let data = {
							text: item.refDetailName,
							value: item.refDetailCode
						}
						this.channels.push(data)
					})
				})
			},
			removeItem(i) {
				this.rangeList.splice(i, 1)
			},
			confirmInsert(selectList) {
                let _selectList = JSON.parse(JSON.stringify(selectList))
				_selectList.forEach(item => {
					this.rangeList.push(item)
				})
			},
			// 保存
			save() {
				this.rangeList.forEach(item => {
					
				})
			}
		},
		watch: {
			selectedList: {
				handler(val) {
					for(let i = 0; i < val.length; i ++) {
						if(!val[i].selectedProps.length) {
							this.selectedList.splice(i, 1)
						}
					}
				},
				deep: true
			}
		}
    }
</script>
<style>
.manhour_borderBottom{
	padding: 0.75rem 1.25rem;
	border-bottom: 1px solid #c2cfd6;
}
#manhour_selectOption .el-icon-circle-cross{
	color:#FF4949
}
.extend-sub-prop {
	display: inline-block;
	padding: 5px 5px;
	margin: 0 10px;
	border: 1px solid #ccc;
	border-radius: 3px;
	cursor: pointer;
}
</style>


