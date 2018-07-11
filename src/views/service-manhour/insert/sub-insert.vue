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
			<hr v-show="carInfo.ioTypeName" />
			<h6 v-show="carInfo.ioTypeName">扩展属性</h6>
            <el-tabs v-model="activeCode" type="card" @tab-click="tabClick" v-show="carInfo.ioTypeName">
			    <el-tab-pane v-for="(item, index) in extendProps" :label="item.text" :key="index" :name="item.value">
					<div class="extend-sub-prop" v-for="(ele, i) in subPropList" :key="i" @click="selectSubProp(ele)">
						{{ ele }}
					</div>
					<p v-show="!subPropList.length">暂无数据...</p>
				</el-tab-pane>
		  	</el-tabs>
		</b-card>

		<b-card id="manhour_selectOption" header="已选扩展属性" v-show="carInfo.ioTypeName">
			<div class="manhour_borderBottom" v-for="(item, i) in selectedList" :key='i'>
				{{ `【${item.propName}】 ：` }}
				<span v-for="(ele, index) in item.selectedProps" :key="index">
					{{ ele }}  
					<i class="el-icon-circle-cross" @click="removeSubProp(ele, index)" style="marginLeft: 6px; marginRight: 6px; cursor: pointer;"></i>
				</span>
			</div>
		</b-card>

		<b-card header="范围与工时">
			<!-- <range :channels="channels" 
			    :datalist="rangeList"
			    @removeItem="removeItem" 
				@confirmInsert="confirmInsert">
			</range> -->

			<scope ref="scope"  
				:multipleSelection="true" 
				:fields="fields" 
				@deletScopeBtn="deletScopeBtn"  
				:addscope="addscope" 
				:additionalSelect="subSelect"
				:additionalInput="subInput"
				:tablist="rangeList">
			</scope> 

			<div class="row">
				<div class="col-md-12">
					<div class="pull-right">
						<b-button size="sm" variant="defaul" @click="back">返回</b-button>
						<b-button size="sm" variant="default" @click="reset">重置</b-button>
						<b-button size="sm" variant="success" @click="save">保存</b-button>
					</div>
				</div>
			</div>
		</b-card>
    </div>
</template>
<script>
	import Range from"components/range/range"
	import Scope from 'components/iris-scope'
	
	import Vue from 'vue'
    import { Tabs, TabPane, Message, MessageBox } from 'element-ui'
	
	import config from 'common/config'
	import api from 'common/api'
	import { getType, filter, getCount, getSequenceList, alertSuccess } from 'common/api-common'
	
	Vue.use(Tabs)
	Vue.use(TabPane)

	import { mapActions, mapGetters } from 'vuex'

	const CHINA_AREA = 'rangeTpyeChinaArea',
		  SALES_AREA = 'rangeTpyeSalesArea',
		  STORE = 'rangeTpyeDealer'

    export default {
		components: {
			Range,
			Scope
		},
        data() {
            return {
				isShowFactory: config.carFlag,   //  config.isShowFactory,
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
				selectedList: [],     // 已经选择的扩展属性 => 页面展示用
				lastRelationList: [], // 包含重复的扩展子属性( 所有级联关系 ) 
				saveList: [],         // 中间占存关系, 防止关系错乱

				relationPool: [],     // 暂存关系池 => 子属性的新增删除用
				
				isRemove: false,
				subRelationLength: 0,
				
				channels: [],
				rangeList: [],
				mainCarInfos: [],


				fields:[
					{label:"渠道", name:"channelTypeName"},
					{label:"工时", name:"workHours"},					
					{label:"销售区域", name:"salesAreaName"},
					{label:"行政区域", name:"chinaAreaName"},
					{label:"门店", name:"storeName"}
				], 
				subSelect: {
                    channelTypeList:{
						name:"渠道",
						code:"channelTypeCode",
						option:[]
					},
				},
				
				subInput: {
                    workHours: {
						name: '工时', code: 'workHours'
					}
				}
					
				
            }
        },
        computed: {
			addInfoMap() {
				let info = {}
				for(let i = 0; i < this.selectedList.length; i ++) {
					info[this.selectedList[i].propCode] = []
                    for(let j = 0; j < this.selectedList[i].selectedProps.length; j ++) {
                        info[this.selectedList[i].propCode].push(this.selectedList[i].selectedProps[j])
					}
				}
				return info
			},
			...mapGetters('serviceManhour', [
				'queryParams'
			])
			
        },
        created() {
			this.carInfo = this.$route.query
			this.getExtendProps()
			this.getChannels()
			this.getMainCarInfo()
        },
        methods: {
			deletScopeBtn(i) {
				this.rangeList.splice(i, 1)
				let list = JSON.parse(JSON.stringify(this.rangeList))
				this.rangeList = []
				this.rangeList = list
			},
			addscope(code, data) {
				let hide = false
				let tempList = []
				data.forEach(item => {
					let info = {
						chinaAreaCode: code == CHINA_AREA ? item.code : '',
						chinaAreaName: code == CHINA_AREA ? item.name : '',
						salesAreaCode: code == SALES_AREA ? item.code : '',
						salesAreaName: code == SALES_AREA ? item.name : '',
						storeCode: code == STORE ? item.code : '',
						storeName: code == STORE ? item.name : '',
						channelTypeCode: item.additionalSelect.channelTypeList.value,
						channelTypeName: this.findActiveName(item.additionalSelect.channelTypeList.value, item.additionalSelect.channelTypeList.option)				
					}
					info = JSON.stringify(info)
					tempList.push(info)
				})
				if(!this.canInsert(tempList)) {
					this.confirmAlert()
					return 
				}

				data.forEach(item => {
					let info = {
						chinaAreaCode: code == CHINA_AREA ? item.code : '',
						chinaAreaName: code == CHINA_AREA ? item.name : '',
						salesAreaCode: code == SALES_AREA ? item.code : '',
						salesAreaName: code == SALES_AREA ? item.name : '',
						storeCode: code == STORE ? item.code : '',
						storeName: code == STORE ? item.name : '',	
						workHours: code == STORE ? item.COMadditionalInput.workHours.value : item.additionalInput.workHours.value,
						channelTypeCode: item.additionalSelect.channelTypeList.value,
						channelTypeName: this.findActiveName(item.additionalSelect.channelTypeList.value, item.additionalSelect.channelTypeList.option)				
					}
					if(!info.channelTypeCode) {
						hide = false
						this.confirmAlert('请选择渠道')
						return
					}else if(!info.workHours) {
						hide = false
						this.confirmAlert('请输入工时')
						return
					} 
					hide = true
					this.rangeList.push(info)
				})
				if(hide) {
				    this.$refs.scope.activePage()
				}
				this.subSelect.channelTypeList.value = "" 
				this.subInput.workHours.value = "" 
			},
			canInsert(tempList) {
				let _rangList = [],
				    flag = false
				this.rangeList.forEach(item => {
					let info = {
						chinaAreaCode: item.chinaAreaCode,
						chinaAreaName: item.chinaAreaName,
						salesAreaCode: item.salesAreaCode,
						salesAreaName: item.salesAreaName,
						storeCode: item.storeCode,
						storeName: item.storeName,	
						channelTypeCode: item.channelTypeCode,
						channelTypeName: item.channelTypeName
					}
					info = JSON.stringify(info)
					_rangList.push(info)
				})	
				if(!_rangList.length) {
					flag = true
				}else {
					for(let i = 0; i < tempList.length; i ++) {
						if(_rangList.indexOf(tempList[i]) !== -1) {
							flag = false
							break 
						}else {
							flag = true
						}
					}
				}
				return flag
			},
            confirmAlert(title = '适用范围已存在!') {
                MessageBox.confirm(title, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {}).catch(() => {})
			},
			
			setRelation(item, flag = true) {
				this.lastRelationList.forEach(key => {
					let addGroups = key.addGroup.split(',')
					let values = addGroups.map(x => x.substring(14, x.length))
					if(values.indexOf(item) !== -1 || item === key.addValue) {
                        flag ? this.relationPool.push(key) : this.relationPool.splice(this.relationPool.indexOf(key), 1)
					}
				})
			},
			// 车型扩展属性 => 子属性选择
			selectSubProp(item) {
				this.isRemove = false
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
						if(this.selectedList[i].propCode === this.activeCode
							&& this.selectedList[i].selectedProps.indexOf(item) === -1) {
							    this.selectedList[i].selectedProps.push(item)
						}
					}
				}
			},
			removeSubProp(item, currentIndex) {
				this.isRemove = true
				this.setRelation(item, false)
				// console.log(this.getRemoveSubProps())
				for(let i = 0; i < this.selectedList.length; i ++) {
					for(let j = 0; j < this.selectedList[i].selectedProps.length; j ++) {
						let subProp = this.selectedList[i].selectedProps[j]
						if(this.getRemoveSubProps().indexOf(subProp) === -1) {
							this.selectedList[i].selectedProps.splice(j--, 1)
						}
					}
				}
				this.querySubPropList()
			},
			lastSelectList() {
				let arr = [], 
					i = 0
				for( ; i < this.lastRelationList.length; i ++ ) {
                    if(this.selectedList[this.selectedList.length - 1].selectedProps.indexOf(this.lastRelationList[i].addValue) != -1) {
						arr.push(this.lastRelationList[i])
					}
				}
				return arr
			},
			
			// 1. 如果子属性被多个父属性包含, 除非父属性全部被删除才删除子属性, 反之不删除
			// 2. 如果父属性包含多个子属性, 能被删除的子属性不可以被其他的父属性所包含
			// 3. 如果只有两级关系, 并且最后一级只有一个子属性, 这时候删除子属性不影响父属性 => 待确认

			// 返回被删除后的子属性列表
			getRemoveSubProps(list = this.relationPool) {
				let shouldRemoveList = []
				list.forEach(item => {
					let addGroups = item.addGroup.split(',')
					let values = addGroups.map(x => x.substring(14, x.length))
					values.push(item.addValue)
					shouldRemoveList = shouldRemoveList.concat(values)
				})
				return shouldRemoveList
			},
        	tabClick() {
				this.querySubPropList(list => {
					this.saveList = list
				})
			},
			querySubPropList(next = () => {}) {
                let params = {
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
				api.skuCar.getCarAdd(params, res => {
					if(res.data.code === 'success') {
						let list = res.data.obj
						next(list)
						// 后端会根据前端删除逻辑过滤并返回最新的关系池, 前端始终以最新的关系池为准
						// this.lastRelationList = list
						let arr = []
						list.forEach(item => {
                            arr.push(item.addValue)
						})
						for(let item of new Set(arr).values()) {
							this.subPropList.push(item)
						}
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

            // 范围与工时
			getChannels() {
				getType(config.serviceStaticPrice.channelRef, items => {
					this.channels = []
					items.forEach(item => {
						let data = {
							text: item.refDetailName,
							value: item.refDetailCode
						}
						// this.channels.push(data)
						this.subSelect.channelTypeList.option.push(data)
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
			// 根据用户最终选择的扩展属性生成二维数组
			returnCarExtendList(lastSelectList) {
				let resultList = []
				// this.subRelationLength = lastSelectList.length  // 1.需要获取子属性relation长度初始值
				lastSelectList.forEach(item => {
					let itemList = []
					let addGroupList = item.addGroup.split(',')
					// this.subRelationLength += addGroupList.length     //  2.再加上每一个addGroup的长度就是总共要拿的subRelationLength
					for(let i = 0; i < addGroupList.length; i ++) {
						if(item.addGroup) {
							let itemAddGroup = addGroupList[i].split('-')
							itemList.push({
								addCode: itemAddGroup[0],
								addValue: itemAddGroup[1]
							})
						}
					}
					itemList.push({
						addCode: item.addCode,
						addValue: item.addValue
					})
					resultList.push(itemList)
				})
				return resultList
			},
			save() {
				if(!this.rangeList.length) {
					Message({
                        type: "warning",
                        message: "请添加适用范围工时"
                    })
					return 
				}
				let relationLength = this.rangeList.length * (this.returnCarExtendList(this.lastSelectList()).length || 1)
				this.subRelationLength = relationLength * this.selectedList.length
                let seqParams = {
					serviceCode: config.serManhours.seqCode,
					getNums: relationLength
				}
				let subSeqParams = {
					serviceCode: config.serManhours.subSeqCode,
					getNums: this.subRelationLength
				}
				if(!this.selectedList.length) {
					getSequenceList(seqParams, seqList => {
						let editParams = []
						// 两层遍历放入主数据
						this.rangeList.forEach(rangeItem => {
							let info = {
								relationCode: '',
								// 车型 - 服务信息
								serviceCode: this.carInfo.serviceCode,
								carCode: this.mainCarInfos[0].carCode,
								displayName: this.mainCarInfos[0].displayName,
								factoryCode: this.carInfo.factoryCode,
								brandCode: this.carInfo.brandCode,
								seriesCode: this.carInfo.seriesCode,
								modelCode: this.carInfo.modelCode,
								opvCode: this.carInfo.opvCode,
								iotypeCode: this.carInfo.ioTypeCode,
								// 更换组件之后参数
								chinaAreaCode: rangeItem.chinaAreaCode,									
								salesAreaCode: rangeItem.salesAreaCode,
								storeCode: rangeItem.storeCode,
								channelType: rangeItem.channelTypeCode,
								workHours: rangeItem.workHours,
								// 车型扩展信息列表
								serviceCarAddWorkhourInfoVoList: [],
							}
							editParams.push(info)
						})
						this.edit(editParams)
					})
					return
				}

				getSequenceList(seqParams, seqList => {
					getSequenceList(subSeqParams, subSeqList => {
						let _subSeqList = subSeqList
						let editParams = []
						// 两层遍历放入主数据
						this.rangeList.forEach(rangeItem => {
							this.returnCarExtendList(this.lastSelectList()).forEach(subList => {
								let info = {
									relationCode: '',
									// 车型 - 服务信息
									serviceCode: this.carInfo.serviceCode,
									carCode: this.mainCarInfos[0].carCode,
									displayName: this.mainCarInfos[0].displayName,
									factoryCode: this.carInfo.factoryCode,
									brandCode: this.carInfo.brandCode,
									seriesCode: this.carInfo.seriesCode,
									modelCode: this.carInfo.modelCode,
									opvCode: this.carInfo.opvCode,
									iotypeCode: this.carInfo.ioTypeCode,
                                    // 适用范围信息
									// salesAreaCode: rangeItem.salesCode,
									// storeCode: rangeItem.storeCode,
									// channelType: rangeItem.channelCode,
									// workHours: rangeItem.workHours,
									// 更换组件之后参数
									chinaAreaCode: rangeItem.chinaAreaCode,									
									salesAreaCode: rangeItem.salesAreaCode,
									storeCode: rangeItem.storeCode,
									channelType: rangeItem.channelTypeCode,
									workHours: rangeItem.workHours,
                                    // 车型扩展信息列表
									serviceCarAddWorkhourInfoVoList: subList,
								}
								editParams.push(info)
							})
						})
						editParams.forEach((editParamsItem, index) => {
							editParamsItem.relationCode = seqList[index]
							editParamsItem.serviceCarAddWorkhourInfoVoList.forEach(key => {
								key.relationCode = editParamsItem.relationCode
								// subSeqence要取一个删一个
								key.carDetailCode = _subSeqList[0]
								_subSeqList.splice(0, 1)
							})
						})
						this.edit(editParams)
					})
				})
			},
			edit(params) {
				api.serviceHours.edit(params).then(res => {
                    alertSuccess(res, () => {
						this.$router.push({
                            path: 'query'
						})
					})
					this.getServiceHoursObj(this.queryParams)
				})
			},
			getMainCarInfo() {
				let params = {
					factoryCode: this.carInfo.factoryCode,
					brandCode: this.carInfo.brandCode,
					seriesCode: this.carInfo.seriesCode,
					modelCode: this.carInfo.modelCode,
					opvCode: this.carInfo.opvCode,
					iotypeCode: this.carInfo.iotypeCode,
				}
				api.storeManage.getCarStyles(params, res => {
					if(res.data.code === 'success') {
						this.mainCarInfos = res.data.obj
					}
				})
			},
			back() {
				this.$router.push({
					path: 'insert'
				})
			},
			reset() {
				this.selectedList = []
				this.rangeList = []
			},
			...mapActions('serviceManhour', [
				'getServiceHoursObj'
			])
		},
		watch: {
			selectedList: {
				handler(val) {
					for(let i = 0; i < val.length; i ++) {
						if(!val[i].selectedProps.length) {
							this.selectedList.splice(i, 1)
						}
					}
					if(val.length && !this.isRemove) {
						this.relationPool = []
						let _selectedProps = val[val.length - 1].selectedProps
						for(let j = 0; j < _selectedProps.length; j ++) {
							this.setRelation(_selectedProps[j])
						}
					}
				},
				deep: true
			},
			relationPool: {
				handler(val) {
					// console.log(val)
				},
				deep: true
			},
			'selectedList.length' (val) {
				this.lastRelationList = this.saveList
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


