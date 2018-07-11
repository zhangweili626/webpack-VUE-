<template>
   <div>
       <b-card header="查询">
			<div class="row">
				<div class="col-md-6">
					<b-form-fieldset horizontal label="服务名称" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.serviceName"/>
					</b-form-fieldset>
				</div>
				<div class="col-md-6">
					<b-form-fieldset horizontal label="服务编码" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryParams.serviceCode"/>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6">
					<b-form-fieldset horizontal label="行政区域" :label-cols="4" class="text-right">
						<div @click="chinaClick" ref="china">
							<b-form-input v-model="chinaName" readonly/>
						</div>
						<div class="text-left serive-select-tree self_constrol" v-show="chinaShow">
							<el-tree :data="chinaTreeData" 
								:props="chinaOptions" 
								:load="chinaLoad" node-key="id" 
								lazy accordion check-strictly 
								:default-expanded-keys="[0]" 
								:expand-on-click-node="false" 
								@node-click="chinaItemClick">
							</el-tree>
						</div>
					</b-form-fieldset>
				</div>
				<div class="col-md-6">
					<b-form-fieldset horizontal label="销售区域" :label-cols="4" class="text-right">
						<area-tree @select-change="selectChange" ref="area" :storeAll='true'
						></area-tree>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6">
					<b-form-fieldset horizontal label="渠道" :label-cols="4" class="text-right">
						<b-form-select v-model="queryParams.channelType" :options="channelOptions"/>
					</b-form-fieldset>
				</div>
			</div>
			
			<query-btn-group @resetClick="reset" @query="query"></query-btn-group>
		</b-card>
        <listbody  ref="listbody" :queryParams="queryParams"></listbody>
   </div>
</template>
<script>

    import AreaTree from 'components/iris-areaqueryshop/index'
    import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
	import listbody from './listbody.vue'
	import Vue from 'vue'
	import { Tree } from 'element-ui'
	Vue.use(Tree)
	import { mapActions } from 'vuex'
	import config from 'common/config'
	import api from 'common/api'
	import { getType } from 'common/api-common'

    export default {
        components: {
			listbody,
			AreaTree,
			QueryBtnGroup,
		},
        data() {
            return {
				chinaTreeData: [],
				chinaOptions: {
					children: 'children',
					label: 'name'
				},
				chinaShow: false,
				chinaName: '',

				channelOptions: [],

				queryParams: {
					serviceCode: '',
					serviceName: '',
					chinaAreaCode: '',
					storeCode: '',
					channelType: '',
					pageNums: config.pageNums,
                    pageStart: 1,
				}
            }
		},
		created() {
			getType(config.serManhours.channel, items => {
                this.channelOptions = []
				items.forEach(item => {
					let data = {
						text: item.refDetailName,
						value: item.refDetailCode
					}
					this.channelOptions.push(data)
				})
			})
		},
        methods: {
			// 行政区域
			chinaLoad(node, resolve) {
				if (node.level === 0) {
					let params = { areaCode: config.areaRoot.area }
					api.area.getChinaAreaInfoByAreaCode(params).then(res => {
						if (res.data.code === 'success') {
							let obj = res.data.obj
							let arr = [{
								id: 0,
								name: obj.areaName,
								code: obj.areaCode
							}];
							return resolve(arr)
						}
					})
				} else {
					let params = { areaCode: node.data.code };
					api.area.getChinaAreaInfoByAreaCode(params).then(res => {
						if (res.data.code === 'success') {
							let items = res.data.obj.chinaAreaSubInfo;
							let arr = [];
							if (items !== null) {
								items.forEach((item, index) => {
									let data = {
										name: item.areaName,
										code: item.areaCode
									}
									arr.push(data)
								})
							} else {
								return resolve([])
							}
							return resolve(arr)
						}
					})
				}
			},
			chinaClick() {
				this.chinaShow = !this.chinaShow
			},
			chinaItemClick(data) {
				this.chinaName = data.name
				this.chinaShow = false
				this.queryParams.chinaAreaCode = data.code
			},

            selectChange(sales, stores) {
				if(!Array.isArray(stores)) {
					if(stores.value == 0) {
						this.queryParams.storeCode = ''
						this.queryParams.saleCodes = []
						sales.forEach(item => {
							this.queryParams.saleCodes.push(item.code)
						})
					}else {
						delete this.queryParams.saleCodes
						this.queryParams.storeCode = stores.value
					}
				}else {
					this.queryParams.storeCode = ''
					this.queryParams.saleCodes = []
					sales.forEach(item => {
						this.queryParams.saleCodes.push(item.code)
					})
				}
			},

            reset() {
				this.queryParams.serviceCode = ''
				this.queryParams.serviceName = ''
				this.queryParams.chinaAreaCode = ''
				this.queryParams.channelType = ''
				this.chinaName = ''
				this.$refs.area.reset()
				this.$refs.area.resetToStart()
            },
            query() {
				this.queryParams.pageStart = 1
				this.$refs.listbody.selectChange([])
				this.getServiceHoursObj(this.queryParams)
			},
			
			...mapActions('serviceManhour', [
				'getServiceHoursObj'
			])
		},
		watch: {
			chinaShow(val) {
				document.addEventListener('click', (e) => {
					let _oTree = this.$refs.china;
					if(_oTree && !_oTree.contains(e.target))  this.chinaShow = false 
				})
			},
		}
    }
</script>

<style scoped>
.serive-select-tree {
    position: absolute;
    margin-top: 6px;
    width: 100%;
    z-index: 1000;
}

.self_constrol>.el-tree {
    max-height: 300px;
    overflow-y: scroll;
}
</style>


