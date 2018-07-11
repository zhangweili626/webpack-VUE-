<template>
	<div>
		<b-card header="合同信息">
			<div class="row">
				<b-col md="6">
					<b-form-fieldset horizontal label="合同编号" :label-cols="4" class="text-right">
						<b-form-input v-model="model.contractNo" disabled/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="合同名称*" :label-cols="4" class="text-right">
						<b-form-input v-model="model.contractName" :disabled="tableHeadDisabled" :class="{'inp-invalid' : inp.contractName}"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="供应商*" :label-cols="4" class="text-right">
						<search
							class="text-left"
							ref="search"
							:hasCheck="inp.supplierCode"
							:dataList="supplierList"
							option="supplierName"
							@dataChange="supperLQuerySelect"
							@itemValue="supperLItemValue"
							@clickShowBack="supperLFirstLoad"
							@comScroll="supperLComScroll"
							v-show="!tableHeadDisabled"
							:disabled="supperLIsForbidden">
						</search>
						<b-form-input v-model="model.supplierName" v-show="tableHeadDisabled" disabled/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="外部编码" :label-cols="4" class="text-right">
						<b-form-input v-model="model.externalCode" :disabled="tableHeadDisabled"/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="生效日期*" :label-cols="4" class="text-right">
						<el-date-picker
							:class="{'inp-invalid' : inp.beginDate}"
							:disabled="tableHeadDisabled"
							v-model="model.beginDate"
							type="date"
							placeholder="选择日期">
						</el-date-picker>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="失效日期*" :label-cols="4" class="text-right">
						<el-date-picker
							:class="{'inp-invalid' : inp.endDate}"
							:disabled="tableHeadDisabled"
							v-model="model.endDate"
							type="date"
							placeholder="选择日期">
						</el-date-picker>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="结算方式*" :label-cols="4" class="text-right">
						<b-form-select v-model="model.settlementTypeCode" :options="settlementlist" :disabled="tableHeadDisabled" :class="{'inp-invalid' : inp.settlementTypeCode}"></b-form-select>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="税率*" :label-cols="4" class="text-right">
						<b-form-select v-model="model.taxRateCode" :options="taxRateCodelist" :disabled="tableHeadDisabled" :class="{'inp-invalid' : inp.taxRateCode}"></b-form-select>
					</b-form-fieldset>
				</b-col>
			</div>
			<b-row class="text-left"  v-show="(tableHeadDisabled && !isEidt) || onlySee">
				<b-col  md="1"></b-col>
				<b-col  md="10">
					附件:
				</b-col>
			</b-row>
			<b-row v-for='item in uploadList' :key='item.id' class="text-right mt-3" v-show="tableHeadDisabled && !isEidt">
				<b-col  md="2"></b-col>
				<b-col  md="8" class="text-left">
					<i class="el-icon-document"></i>
					<a href="###" @click="preview(item)">{{item.name}}</a>
					<a :href="getDownloadUrl(urlApi,item.filePath)" download>
						<b-button size="sm" variant="primary" class="p-1 ml-2">下载</b-button>
					</a>
				</b-col>
			</b-row>
			<b-row>
				<div class="col-md-12 text-right">
					<b-button size="sm" variant="primary" @click="approSubmit" v-show="(tableHeadDisabled && !isInvali && isSubmit) && !onlySee">提交</b-button>
					<b-button size="sm" variant="danger" @click="invalidContract" v-show="(tableHeadDisabled && !isInvali && subStatus) && !onlySee" v-if="isInvalidContract">作废</b-button>
					<b-button size="sm" variant="danger" @click="invalidContract" v-show="(tableHeadDisabled && isInvali)" disabled>已作废</b-button>
					<b-button size="sm" variant="secondary" v-show="isBackout && !onlySee" @click="approvalWithdrawn">撤销</b-button>
					<b-button size="sm" variant="default" @click="cancel" v-show="(!tableHeadDisabled) && !onlySee">返回</b-button>
					<b-button size="sm" variant="primary" @click="saveTableHead" v-show="(!tableHeadDisabled) && !onlySee" v-if="isCSaveTableHead">保存</b-button>
				</div>
			</b-row>
			<b-row v-show="(tableHeadDisabled && isEidt) && !onlySee">
				<b-col md="6">
					<b-form-fieldset horizontal label="附件" :label-cols="4" class="text-right">
						<el-upload
							class="upload-demo text-left"
							:action="uploadUrl"
							:data = 'addParams'
							:on-success='handleSuccess'
							:on-error='handleErr'
							:on-remove="handleRemove"
							multiple
							:limit="100"
							:file-list="uploadList">
							<b-button size="sm" variant="success">选择上传文件</b-button>
						</el-upload>
					</b-form-fieldset>
				</b-col>
			</b-row>
			<!-- <b-row  v-show="tableHeadDisabled && isEidt">
				<div class="col-md-12 text-right">
					<b-button size="sm" variant="primary" @click="saveAccessory">保存附件</b-button>
				</div>
			</b-row> -->
		</b-card>
		<b-card header="适用范围" v-if="tableHeadDisabled">
			<div v-if="isEidtCUseRangs">
				<scope :disabled='(!isEidt) || onlySee' ref="scope" :multipleSelection="true" :fields="fields1" @deletScopeBtn="removetr"  :addscope="insertRange" :tablist="useRanges"></scope>
			</div>
		</b-card>
		<div class="contact-card" v-if="tableHeadDisabled">
			<i class="el-icon-warning text-warning contract-i" v-b-tooltip.hover title="如果停采,则同步取消主供应商!"></i>
			<el-tabs type="border-card">
				<el-tab-pane label="采购合同明细">
					<div class="animated fadeIn">
						<b-row class="mb-0 mr-1">
							<b-col  md="6" class="mb-1">
								<v-upload buttonName='导入' v-show="addDetailStatu" :show-back="showBackData"
										:add-params="detailUploadParams" :url='analysisUrl' v-on:updateData="getdetail" v-if="isEidtCDetail"></v-upload>
								<b-button size="sm" variant="success" @click="addDetail" v-show="(isEidt && !addDetailStatu && !isInvali)  && !onlySee" v-if="isEidtCDetail">新增</b-button>
								<b-button size="sm" variant="danger" v-show="addDetailStatu" @click="delSelDetail" v-if="isEidtCDetail">删除</b-button>
								<b-button size="sm" variant="secondary" @click="exportTab" v-show="addDetailStatu">下载模板</b-button>
							</b-col>
						</b-row>
						<div class="table-scrollable purchasecontract pt-1" id="addDetailTab">
							<b-table striped hover bordered show-empty :items="detailList" :fields="fields">
								<template slot="sel" slot-scope="data">
									<input type="checkbox" name='skusel' :value="data.item.skuCode" v-model="selCont" :disabled="!addDetailStatu" v-show="data.item.skuName != ''">
								</template>
								<template slot="skuName" slot-scope="data">
									<search
									class="purchasec-w"
									v-show="data.item.skuName == ''"
									ref="search"
									:hasCheck="required"
									:dataList="datalist"
									option="skuName"
									@dataChange="querySelect"
									@itemValue="itemValue"
									@clickShowBack="firstLoad"
									@comScroll="comScroll"
									:disabled="data.item.skuName != ''">
									</search>
									<span v-show="data.item.skuName != ''">{{ data.value }}</span>
								</template>
								<template slot="skuCode" slot-scope="data">
									{{ data.value}}
								</template>
								<template slot="skuStandards" slot-scope="data">
									{{ data.value}}
								</template>
								<template slot="skuModel" slot-scope="data">
									{{ data.value}}
								</template>
								<template slot="checkUnitName" slot-scope="data">
									{{ data.value}}
								</template>
								<template slot="purchaseUnitName" slot-scope="data">
									{{ data.value}}
								</template>
								<template slot="purchaseToCheckNums" slot-scope="data">
									{{ data.value}}
								</template>
								<template slot="skuPriceTax" slot-scope="data">
									<b-form-input v-model="data.value" type="number" class="wd100" v-show="data.item.skuName != '' && addDetailStatu" @input="countPrce('num',data.value,data.index)"/>
									<span v-show="!addDetailStatu">{{ parseFloat(data.value).toFixed(2)}}</span>
								</template>
								<template slot="skuPriceCost" slot-scope="data">
									<span v-show="data.item.skuName != ''">{{ parseFloat(data.value) ? parseFloat(data.value).toFixed(2): 0.00}}</span>
								</template>
								<template slot="taxRateCode" slot-scope="data">
									<b-form-select v-model="data.value" :options="taxRateCodelist" v-show="data.item.skuName != ''" :disabled="!addDetailStatu" @input="countPrce('tax',data.value,data.index)" style="width: 70px;"></b-form-select>
								</template>
								<template slot="isMainSupplier" slot-scope="data">
									<b-form-select :options="isMainSupplierList"  v-model="data.value"  v-show="data.item.skuName != ''" :disabled="!addDetailStatu"  @input="setMainS(data.value,data.index)"></b-form-select>
								</template>
								<template slot="isStop" slot-scope="data">
									<b-button size="sm" variant="danger" v-show=" data.value=='0'" @click="setStop(data.index)" :disabled="!!( !isAppro || onlySee)" v-if="isEidtCDetail && isAppro">停采</b-button>
									<b-button size="sm" variant="danger" v-show=" data.value=='1'" :disabled="!!( !isAppro || onlySee)" v-if="isAppro">已停采</b-button>
								</template>
								<template slot="empty">
									暂无数据...
								</template>
							</b-table>
						</div>
						<b-col  md="12" class="mb-1 mt-1 text-center">
							<b-button size="sm" variant="default" v-show="addDetailStatu" @click="addDetailCancel">取消</b-button>
							<b-button size="sm" variant="primary" v-show="addDetailStatu" @click="eidtDetail" v-if="isEidtCDetail">保存</b-button>
						</b-col>
					</div>
				</el-tab-pane>
				<el-tab-pane label="审批履历">
				<div class="animated fadeIn">
					<approval-record :orderNo='contractNo'></approval-record>
				</div>
            </el-tab-pane>
        </el-tabs>
		</div>

		<div hidden id="modelTabe">
			<table>
				<thead>
					<tr>
						<th>商品名称</th>
						<th>商品编码</th>
						<th>含税价</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import {mapState, mapMutations, mapActions} from 'vuex'
	import {DatePicker, Message, Upload, Button, MessageBox, Tabs, TabPane} from 'element-ui'
	import vPagination from 'components/pagination/pagination.vue'
	import areaqueryshop from 'components/iris-areaqueryshop/'
	import suitScope from 'components/iris-suitscope'
	import search from 'components/iris-search/search.vue'
	import api from 'common/api'
	import config from 'common/config.js'
	import common from 'common/common.js'
	import XLSX from "xlsx"
	import vUpload from "components/blitem-upload"
	import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'
	import scope from 'components/iris-scope'
	import approvalRecord from 'components/approval-record/approval-record'
	Vue.use(DatePicker);
	Vue.use(Upload);
	Vue.use(Button);
	Vue.use(Tabs);
	Vue.use(TabPane);
	export default {
		components: {
			areaqueryshop,
			suitScope,
			search,
			vUpload,
			scope,
			approvalRecord,
		},
		data() {
			return {
				contractNo: '',
            	fields1:[{label:"销售区域",name:"salesAreaName",},{label:"行政区域",name:"chinaAreaName",},{label:"门店",name:"storeName"}],
				inp: {
					contractName:false,
					supplierCode: false,
					beginDate:false,
					endDate:false,
					settlementTypeCode:false,
					taxRateCode:false,
					taxRateCode:false,
				},
				//验证是否通过
				isVerity: true,
				// 是否仅查看
				onlySee: false,
				// 禁用停采按钮
				isdisabled: false,
				// 禁用主表编辑
				tableHeadDisabled: false,
				// 附件是否可编辑
				isEidtAc: false,
				// 合同是否作废
				isInvali: false,
				// 是否显示提交按钮
				isSubmit: false,
				// 是否显示撤销按钮
				isBackout: false,
				// 适用范围是否可编辑
				isEidtRangs: true,
				// 适用范围是否可编辑
				isEidtDetail: true,
				// 是否可编辑
				isEidt: true,
				// 是否已审批通过
				isAppro: false,
				// 是否已提交
				subStatus: true,
				// 供应商类型
				supplierTypeList: [],
				// 结算方式
				settlementlist:[],
				// 税率
				taxRateCodelist:[],
				saveBtn: true,
				uploadUrl:config.uploadUrl,
				addParams: {
					relationCode: config.purchaseContract.accessory,
					singleFlag: '0',
					businessType: ''
				},
				analysisUrl: collectionApi.purchaseContract.contractdetailsAnalysis,
				detailUploadParams: {
					relationCode: '',
					singleFlag: '1',
					businessType: ''
				},
				showBackData: {
					contractNo: '',
					contractDetailCode: '111',
					taxRateCode: '',
				},
				oldUploadList: [],
				uploadList: [],
				useRanges: [],
				isMainSupplierList: config.purchaseContract.isMainSupplierList,
				// 供应商选择
				supplierList: [],
				selectSuplierParams: {
					contractSupplierFlag: '1',
					pageNums: config.pageNums,
					pageStart: 1
				},
				supplierListisLastPage: '',
				supperLRequired: true,
				supperLIsForbidden:false,
				// 下拉数据
				datalist: [],
				selectParams: {
					skuType: 'goodsTypeGood',
					pageNums: config.pageNums,
					pageStart: 1
				},
				required: false,
				isforbidden: false,
				addDetailStatu: false,
				model: {
					id:'',
					contractNo: '',
					contractName: '',
					supplierType: '',
					supplierCode: '',
					supplierName: '',
					externalCode: '',
					beginDate: '',
					endDate: '',
					beginDateStr: '',
					endDateStr: '',
					settlementTypeCode: '',
					taxRateCode: ''
				},
				// 使用范围
				useRange: [],
				selCont: [],
				fields: {
					sel: {
						label: "选择"
					},
					skuName: {
						label: "商品名称"
					},
					skuCode: {
						label: "商品编码"
					},
					skuStandards: {
						label: "商品规格"
					},
					skuModel: {
						label: "商品型号"
					},
					checkUnitName: {
						label: "核算单位"
					},
					purchaseUnitName: {
						label: "采购单位"
					},
					purchaseToCheckNums: {
						label: "转换系数"
					},
					skuPriceTax: {
						label: "含税价"
					},
					skuPriceCost: {
						label: "去税价"
					},
					taxRateCode: {
						label: "税率类型"
					},
					isMainSupplier: {
						label: "是否主供应商"
					},
					isStop: {
						label: "操作"
					}
				},
				oldDetailList: [],
				detailList: [],
				delDetailList:[],
				eidtDetailKong:{skuName:'',skuCode:''}
			}
		},
		computed: {
			isCSaveTableHead() {
				return hasBtn(collectionApi.purchaseContract.addPurchase);
			},
			isInvalidContract() {
				return hasBtn(collectionApi.purchaseContract.invalidContract);
			},
			isEidtCDetail() {
				return hasBtn(collectionApi.purchaseContract.eidtDetail);
			},
			isEidtCUseRangs() {
				return hasBtn(collectionApi.purchaseContract.eidtUseRange);
			},
			urlApi() {
				return common.getUploadUrl();
			}
		},
		created() {
			this.getSettlementlist();
			this.getTaxRateCodelist();
			this.createRangsOdd();
			this._initData();
			// let userInfo = sessionStorage.getItem("userInfo");
			// if(userInfo){
			// 	let info = JSON.parse(userInfo)
			// 	this.selectSuplierParams.storeCodes = info.userAvailableInfo.storeInfoVo.storeCode
			// }
			this.selectSuplierParams.storeCodes = JSON.parse(common.getSession('userInfo')).userAvailableInfo.storeInfoVo ? [JSON.parse(common.getSession('userInfo')).userAvailableInfo.storeInfoVo.storeCode] : []
			console.log(this.selectSuplierParams)
		},
		watch: {
			'$route': '_initData'
		},
		methods: {
			...mapActions('purchasecontract',[
				'setTableList',
				'setSearchParam',
				'getPurchContractTabList'
			]),
			// 新增适用范围
			insertRange(code, data) {
				const _this = this;
				if(Array.isArray(data)){
					//批量
					api.ordinalInfo.getSequenceList({
					'serviceCode': config.purchaseContract.seqRangs,
					'getNums': data.length
					},(msg) => {
						if(msg.data.message == 'success'){
							let SEQ = msg.data.obj
							let list = []
							let codes = []
								if(code == config.scopeType.sales){
									for (let index = 0; index < SEQ.length; index++) {
										const element = SEQ[index];
										codes.push(data[index].code)
										list[index]={
											rangeCode:element,
											contractNo: _this.model.contractNo,
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
											contractNo: _this.model.contractNo,
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
											contractNo: _this.model.contractNo,
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
							api.purchaseContract.eidtUseRange(list,(msg)=>{
								if(msg.data.message == 'success'){
									Message({
										type: 'success',
										message: '保存成功！'
									});
									_this.$refs.scope.activePage()
									_this.getUseRange()
								}
							})
						}
					})

				}else{
					//单条
				}
				// this.addSupplierSuitScope({
				//     poros: params,
				//     callBack: (res) => {
				//         if(res.data.code === "success") {
				//             callback()
				//             Message({
				//                 type: 'info',
				//                 message: config.messInfo.success
				//             });
				//         }
				//     }
				// })
			},
			_initData(val) {
				let _this = this;
				let param;
				let routeQuery = this.$route.query;
				// console.log(routeQuery)
				if(routeQuery.onlySee) {
					if(routeQuery.onlySee.toString() == 'true') {
						_this.onlySee = true;
					}else {
						_this.onlySee = false;
					}
				}
				if(routeQuery.contractNo == undefined && val == undefined) {
					_this.createOdd();
					_this.createDetialOdd();
				}else {
					param = {
						contractNo: val ? val : routeQuery.contractNo
					}
					_this.addParams.relationCode = param.contractNo;
					api.purchaseContract.PurchaseInfo(param, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						let obj = data.obj;
						_this.contractNo = obj.contractNo;
						_this.model.id = obj.id;
						_this.model.contractNo = obj.contractNo;
						_this.model.contractName = obj.contractName;
						_this.model.supplierCode =  obj.supplierCode;
						_this.model.supplierName =  obj.supplierName;
						_this.model.externalCode =  obj.externalCode;
						_this.model.beginDate =  obj.beginDate;
						_this.model.endDateStr =  obj.endDateStr;
						_this.model.beginDateStr =  obj.beginDateStr;
						_this.model.endDate =  obj.endDate;
						_this.model.settlementTypeCode = obj.settlementTypeCode;
						_this.model.taxRateCode = obj.taxRateCode;
						_this.model.fileNums = obj.fileNums;
						_this.showBackData.contractNo = _this.model.contractNo;
						_this.showBackData.taxRateCode = _this.model.taxRateCode;
						if(obj.wfStatus == '-1' && obj.orderStatus == '0') {
							_this.isSubmit = true;
							_this.isEidt = true;
						}else {
							_this.isSubmit = false;
							_this.isEidt = false;
						}
						if(obj.wfStatus == '0') {
							_this.isBackout = true;
						}else{
							_this.isBackout = false;
						}
						if(obj.wfStatus == '1') {
							_this.isAppro = true;
						}else{
							_this.isAppro = false;
						}
						if(obj.orderStatus == '-1') {
							_this.isInvali = true;
						}else{
							_this.isInvali = false;
						}
						_this.isdisabled =!!( (!_this.addDetailStatu && !_this.isInvali)  || _this.onlySee);

						_this.detailList = obj.purchaseContractDetailInfoVoList;
						_this.oldDetailList =  [...obj.purchaseContractDetailInfoVoList];
						_this.getUseRange();
						_this.getAccessory();
						_this.tableHeadDisabled = true;

					}
				})
				};
			},
			// 获取结算方式
			getSettlementlist() {
				let _this = this;
				const option = {
					'refCode': config.purchaseContract.settlementCode
				}
				api.ref.getDataDictionarys(option, (res) => {
					if (res.data.code === 'success') {
						let data = res.data.obj.referenceDetailInfos;
						let arr = []
						data.forEach((item, index) => {
							let obj = {
								value: item.refDetailCode,
								text: item.refDetailName
							}
							arr.push(obj);
						})
						_this.settlementlist = arr;
					}
				})
			},
			// 获取税率
			getTaxRateCodelist() {
				let _this = this;
				const option = {
					'refCode': config.purchaseContract.rateValueCode
				}
				api.ref.getDataDictionarys(option, (res) => {
					if (res.data.code === 'success') {
						let data = res.data.obj.referenceDetailInfos;
						let arr = []
						data.forEach((item, index) => {
							let obj = {
								value: item.refDetailCode,
								text: item.refDetailName*100 + '%'
							}
							arr.push(obj);
						})
						_this.taxRateCodelist = arr;
					}
				})
			},
			// 生成采购合同单号
			createOdd() {
				let _this = this;
				const option = {
					'serviceCode': config.purchaseContract.seqReg
				}
				api.ordinalInfo.getSequence(option, (res) => {
					if(res.data.code === 'success') {
						_this.contractNo = res.data.obj;
						_this.model.contractNo = res.data.obj;
						_this.addParams.relationCode = res.data.obj;
					};
				})
			},
			// 生成采购合同适用范围单号
			createRangsOdd() {
				let _this = this;
				const option = {
					'serviceCode': config.purchaseContract.seqRangs
				}
				api.ordinalInfo.getSequence(option, (res) => {
					if(res.data.code === 'success') {
						return res.data.obj;
					};
				})
			},
			// 生成采购合同明细单号
			createDetialOdd() {
				let _this = this;
				const option = {
					'serviceCode': config.purchaseContract.seqDetail
				}
				api.ordinalInfo.getSequence(option, (res) => {
					if(res.data.code === 'success') {
						return res.data.obj;
					};
				})
			},
			// 附件查询
			getAccessory() {
				let _this = this;
				let param = {
					relationCode: _this.model.contractNo
				}
				api.accessory.list(param, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						_this.uploadList = data.obj;
						for(let i = 0; i <_this.uploadList.length; i++){
							_this.uploadList[i].name = _this.uploadList[i].fileOrgName;
						}

					}
				})
			},
			// 附件预览
			preview(val) {
				api.accessory.pvw(val, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						window.open(common.getUploadUrl() + data.obj);
					}
				})
			},
			// 预览下载
			download(val) {
				api.accessory.download(val, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						window.open(common.getUploadUrl() + data.obj);
					}
				})
			},
			handleSuccess(res) {
				let _this = this;;
				if(res.code == "success") {
					res.obj[0].name = res.obj[0].fileOrgName;
					_this.uploadList.push(res.obj[0]);
					_this.saveAccessory();
				}
			},
			handleErr(file) {
				Message({
					type: "error",
					message: "上传失败"
				});
			},
			handleRemove(file) {
				let _this = this;
				MessageBox.confirm(`确定移除 ${ file.fileOrgName }？`).then(() => {
					api.accessory.del([file], function (result) {
						let data = result.data;
						if(data.code === 'success') {
							_this.uploadList.splice(_this.uploadList.indexOf(file),1);
							_this.saveAccessory();
						}else{
							_this.uploadList.splice(_this.uploadList.indexOf(file),1);
							file.name =file.fileOrgName;
							_this.uploadList.push(file);
						}
					})
				}).catch(() => {
					_this.uploadList.splice(_this.uploadList.indexOf(file),1);
					file.name =file.fileOrgName;
					_this.uploadList.push(file);
				});
			},
			// 导出表格
			exportTab() {
				let _this = this;
				let worksheet = XLSX.utils.table_to_book(
					document.getElementById("modelTabe")
				);
				XLSX.writeFile(worksheet,_this.model.contractNo+".xlsx");
			},
			// 取消
			cancel() {
				this.$router.push({
					path : `/purchasecontract/search`
				})
			},
			// 搜索框内值改变   触发搜索
			querySelect(data) {
				const _this = this
				_this.selectParams.pageStart = 1;
				_this.selectParams.skuName = data;
				let params = _this.selectParams;
				_this.getSkuName(params, function(res) {
					_this.isLastPage = res.isLastPage
					_this.datalist = res.list
				})
			},
			// skuName选中某一项
			itemValue(value) {
				const _this = this
				const option = {
					'serviceCode': config.purchaseContract.seqDetail
				}
				api.ordinalInfo.getSequence(option, (res) => {
					if(res.data.code === 'success') {
						value.id = '';
						value.skuPriceTax = 0;
						value.skuPriceCost = 0;
						value.taxRateCode = _this.model.taxRateCode;
						value.isMainSupplier = '0';
						value.isStop = '0';
						value.contractDetailCode = res.data.obj;
						value.contractNo = _this.model.contractNo;
						if(_this.detailList.length > 1){
							for(let j = 0; j < _this.detailList.length; j++) {
								if(value.skuCode == _this.detailList[j].skuCode) {
									Message({
										type: "error",
										message: "该商品已添加!"
									});
									return;
								}
							}
							_this.detailList.splice(_this.detailList.length-1,0,value);
						}else{
							_this.detailList.splice(_this.detailList.length-1,0,value);
						}
					};
				})



			},
			// 第一次加载skuName数据
			firstLoad() {
				const _this = this
				if(_this.datalist.length != 0 ){
					return
				}
				let params = _this.selectParams
				_this.getSkuName(params, function(res) {
					_this.isLastPage = res.isLastPage
					_this.datalist = res.list
				})
			},
			// skuName滚动加载
			comScroll(isEnd) {
				if (isEnd && !this.isLastPage) {
					this.selectParams.pageStart ++
					let params = this.selectParams;
					this.getSkuName(params, obj => {
						this.isLastPage = obj.isLastPage;
						if(obj.list) {
							this.datalist = this.datalist.concat(obj.list);
						}
					});
				}
			},
			// 定义向后台请求skuName的方法
			getSkuName(params,callback) {
				api.skuData.getInfo(params, res => {
					if (res.data.code === "success") {
						let obj = res.data.obj;
						callback(obj);
					}
				})
			},
			// SupplierList搜索框内值改变   触发搜索
			supperLQuerySelect(data) {
				const _this = this
				_this.selectSuplierParams.pageStart = 1;
				_this.selectSuplierParams.supplierName = data;
				let params = _this.selectSuplierParams;
				_this.getSupplierList(params, function(res) {
					_this.supplierListisLastPage = res.isLastPage
					_this.supplierList = res.list
				})
			},
			// SupplierList选中某一项
			supperLItemValue(value) {
				const _this = this
				_this.model.supplierCode = value.supplierCode
				_this.model.supplierName = value.supplierName
			},
			// 第一次加载SupplierList数据
			supperLFirstLoad() {
				const _this = this
				if(_this.supplierList.length != 0 ){
					return
				}
				let params = _this.selectSuplierParams
				_this.getSupplierList(params, function(res) {
					_this.supplierListisLastPage = res.isLastPage
					_this.supplierList = res.list
				})

			},
			// SupplierList滚动加载
			supperLComScroll(isEnd) {
				const _this = this
				if (isEnd && !this.supplierListisLastPage) {
					this.selectSuplierParams.pageStart ++
					let params = this.selectSuplierParams;
					this.getSupplierList(params, obj => {
						_this.supplierListisLastPage = obj.isLastPage;
						if(obj.list) {
							_this.supplierList = _this.supplierList.concat(obj.list);
						}
					});
				}
			},
			// 定义向后台请求getSupplierList的方法
			getSupplierList(params,callback) {
				api.supplier.querySupplierList(params, res => {
					if (res.data.code === "success") {
						let obj = res.data.obj;
						callback(obj);
					}
				})
			},
			addOrUpdateUseRangeInfoBatch(val){
				this.useRanges = val;
				this.eidtUseRange();
			},
			shopPreserve: function(data) {
				let _this = this
				if (data) {
					let arr = [];
					const option = {
						'serviceCode': config.purchaseContract.seqRangs
					}
					api.ordinalInfo.getSequence(option, (res) => {
						if(res.data.code === 'success') {
							data.forEach((item) => {
								arr.push({
									contractNo: _this.model.contractNo,
									rangeCode: res.data.obj,
									rangeType: item.rangeType,
									remark: item.remark,
									shop: item.remark,
									storeCode: item.storeCode
								})
							})
							_this.addOrUpdateUseRangeInfoBatch(arr);
						};
					})

				}
			},
			salesPreserve: function(data) {
				let _this = this
				if (data) {
					let arr = []
					const option = {
						'serviceCode': config.purchaseContract.seqRangs
					}
					api.ordinalInfo.getSequence(option, (res) => {
						if(res.data.code === 'success') {
							data.forEach((item) => {
								arr.push({
									contractNo: _this.model.contractNo,
									rangeCode: res.data.obj,
									sales: item.sales,
									shop:item.shop,
									rangeType: item.rangeType,
									remark: item.remark,
									salesAreaCode: item.salesAreaCode
								})
							})
							_this.addOrUpdateUseRangeInfoBatch(arr)
						};
					})
				}
			},
			removetr: function(items) {
				let _this = this
				// if(items.length > 0) {
				// 	items.forEach((item) => {
				// 		item.isDeleted = '1'
				// 	})
				// }
				items.isDeleted = '1'
				_this.addOrUpdateUseRangeInfoBatch([items])
			},
			saveTableHead() {
				let _this = this;
				_this.isVerity = true;
				for(let item of Object.keys(_this.inp)) {
					_this.inp[item] = false;
					if(_this.model[item] === ''){
						_this.inp[item] = true;
						_this.isVerity = false;
					}
				}
				if(!_this.isVerity) {
					return;
				}
				if(_this.model.endDate <  _this.model.beginDate) {
					Message({
                        type: 'warning',
                        message: '失效日期不可小于生效日期!'
					});
					_this.inp.endDate = true;
                    return
				}
				let param = {
					contractNo: _this.model.contractNo,
					contractName: _this.model.contractName,
					supplierCode:  _this.model.supplierCode,
					supplierName:  _this.model.supplierName,
					externalCode:  _this.model.externalCode,
					beginDate:  common.eleTimeFormat(_this.model.beginDate),
					endDate:   common.eleTimeFormat(_this.model.endDate),
					settlementTypeCode:  _this.model.settlementTypeCode,
					taxRateCode:  _this.model.taxRateCode,
					fileNums: _this.uploadList.length
				}
				api.purchaseContract.addPurchase(param, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						Message({
							type: "success",
							message: "保存成功!"
						});
						_this.tableHeadDisabled = true;
						_this._initData(_this.model.contractNo);
						_this.refreshTab();
					}
				})
			},
			saveAccessory() {
				let _this = this;
				let param = {
					contractNo: _this.model.contractNo,
					id: _this.model.id,
					contractName: _this.model.contractName,
					supplierCode:  _this.model.supplierCode,
					supplierName:  _this.model.supplierName,
					externalCode:  _this.model.externalCode,
					beginDate:  _this.model.beginDateStr,
					endDate:   _this.model.endDateStr,
					settlementTypeCode:  _this.model.settlementTypeCode,
					taxRateCode:  _this.model.taxRateCode,
					fileNums: _this.uploadList.length
				}
				api.purchaseContract.eidtPurchase(param, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						Message({
							type: "success",
							message: "修改合同附件数量成功!"
						});
					}
				})
			},
			updateContrat() {
				let _this = this;
				let param = {
					id: _this.model.id,
					contractNo: _this.model.contractNo,
					contractName: _this.model.contractName,
					supplierCode:  _this.model.supplierCode,
					supplierName:  _this.model.supplierName,
					externalCode:  _this.model.externalCode,
					beginDate:  _this.model.beginDate,
					endDate:   _this.model.endDate,
					settlementTypeCode:  _this.model.settlementTypeCode,
					taxRateCode:  _this.model.taxRateCode,
					fileNums: _this.uploadList.length
				}
				api.purchaseContract.eidtPurchase(param, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						Message({
							type: "success",
							message: "修改成功!"
						});
					}
				})
			},
			// 作废合同
			invalidContract() {
				let _this = this;
				let param = {
					contractNo: this.model.contractNo
				}
				MessageBox.confirm(`确定作废该合同？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					api.purchaseContract.invalidContract(param, function (result) {
						let data = result.data;
						if(data.code === 'success') {
							Message({
								type: "success",
								message: "作废成功!"
							});
							_this.isEidt = false;
							_this._initData(_this.model.contractNo);
						}
					})
				});

			},
			// 合同撤销
			approvalWithdrawn() {
				let _this = this;
				let param = {
					contractNo: this.model.contractNo
				}
				MessageBox.confirm(`确定撤销该合同提交？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					api.purchaseContract.contractApprovalWithdrawn(param, function (result) {
						let data = result.data;
						if(data.code === 'success') {
							Message({
								type: "success",
								message: "撤销成功!"
							});
							_this.isInvali = true;
							_this._initData(_this.model.contractNo);
						}
					})
				});

			},
			getUseRange() {
				let _this = this;
				_this.useRanges = []
				let param = {
					contractNo: _this.model.contractNo,
				}
				api.purchaseContract.getUseRange(param, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						_this.useRanges = data.obj;
						for(let i=0; i<data.obj.length; i++) {
							_this.useRanges[i].sales = _this.useRanges[i].salesAreaName;
							_this.useRanges[i].shop = _this.useRanges[i].storeName;
						}

					}
				})
			},
			eidtUseRange() {
				let _this = this;
				let param =_this.useRanges
					api.purchaseContract.eidtUseRange(param, function (result) {
						let data = result.data;
						if(data.code === 'success') {
							_this.getUseRange();
							Message({
								type: "success",
								message: "保存成功!"
							});
							_this.refreshTab();
						}
					})

			},
			getdetail() {
				let _this = this;
				let param = {
					contractNo: _this.model.contractNo,
				}
				api.purchaseContract.getdetail(param, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						_this.detailList = data.obj;
						_this.oldDetailList = [...data.obj];
						_this.addDetailStatu = false;
					}
				})
			},
			eidtDetail() {
				let _this = this;
				let isKong = false;
				let isRepet = false;
				let param =[..._this.detailList];
					for(let i = 0; i <param.length; i++) {
						if(param[i].skuCode === "") {
							param.splice(i, 1)
						}
					}
					for(let i = 0; i<param.length; i++)	{
						if(param[i].skuPriceTax < 0) {
							Message({
								type: "warning",
								message: param[i].skuName + "的含税价不可小于0!"
							});
							return;
						}
						param[i].skuPriceTax = param[i].skuPriceTax ? parseFloat(param[i].skuPriceTax).toFixed(2): 0;
					}
					if(_this.delDetailList != 0){
						for(let i = 0; i < _this.delDetailList.length; i++) {
							for(let j = 0; j < param.length; j++) {
								if(param[j].skuCode == _this.delDetailList[i].skuCode) {
									isRepet = true;
									break;
								}
							}
							if(!isRepet) {
								param.push(_this.delDetailList[i]);
							}
							isRepet = false;
						}
					}
					_this.delDetailList = [];
					api.purchaseContract.eidtDetail(param, function (result) {
						let data = result.data;
						_this.detailList = param;
						if(data.code === 'success') {
							Message({
								type: "success",
								message: "保存成功!"
							});
							_this.addDetailStatu = false;
							_this.getdetail();
							_this.refreshTab();
						}else{
							for(let i = 0; i < _this.detailList.length; i++) {
								if(_this.detailList[i].skuCode === "") {
									return isKong = true;
								}
							}
							if(!isKong) {
								_this.detailList.push(_this.eidtDetailKong);
								isKong = false;
							}
						}
					})

			},
			addDetail() {
				this.addDetailStatu = true;
				this.detailList.push(this.eidtDetailKong);
			},
			addDetailCancel() {
				let _this = this;
				MessageBox.confirm(`确定取消已添加数据？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.addDetailStatu = false;
					_this.detailList =[..._this.oldDetailList];
				}).catch(() => {
				});
			},
			delSelDetail() {
				let _this = this;
				for(let i = 0; i < _this.selCont.length; i++) {
					for(let j = 0; j < _this.detailList.length; j++) {
						if(this.selCont[i] == _this.detailList[j].skuCode) {
							let arr =  _this.detailList[j];
							arr.isDeleted = '1';
							this.delDetailList.push(arr);
							_this.detailList.splice(j , 1);
						}
					}
				}
				 _this.selCont = [];
			},
			setStop(index) {
				let _this = this;
				MessageBox.confirm('确定停采吗?', '提示', {
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(_this.detailList[index].isStop == '0'){
						_this.detailList[index].isStop = '1';
						_this.detailList[index].isMainSupplier = 0;
					}else {
						Message({
							type: "warning",
							message: "不可停采!"
						});
					}
					_this.eidtDetail();
				}).catch(() => {
				});

			},
			setStart(index) {
				let _this = this;
				MessageBox.confirm('确定启用吗?', '提示', {
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(_this.detailList[index].isStop == '1'){
						_this.detailList[index].isStop = '0';
					}else {
						Message({
							type: "warning",
							message: "不可启用!"
						});
					}
					_this.eidtDetail();
				}).catch(() => {
				});
			},
			approSubmit() {
				let _this = this;
				let param = {
					contractNo: _this.model.contractNo
				}
				api.purchaseContract.contractApproSubmit(param, function (result) {
					let data = result.data;
					if(data.code === 'success') {
						Message({
								type: "success",
								message: "提交成功!"
							});
						_this._initData(_this.model.contractNo);
						_this.refreshTab();
					}
				})
			},
			refreshTab() {
				let param = {
					supplierType: '',
					supplierName: '',
					contractNo: '',
					contractName: '',
					beginDate : '',
					endDate  : '',
					wfStatus: '',
					pageNums: config.pageNums,
					pageStart: 1
				};
				this.getPurchContractTabList(param);
			},
			// 计算去税价格
			countPrce(str,val,index) {
				let _this = this;
				let data = _this.detailList[index];
				if(!data.taxRateCode) {
					return;
				}
				if(str == 'num') {
					if(val < 0) {
						Message({
							type: "warning",
							message: "税前价不可小于0!"
						});
						_this.detailList[index].skuPriceTax = 0;
						return;
					}
					_this.detailList[index].skuPriceTax = parseFloat(val)?parseFloat(val):0;
					_this.detailList[index].skuPriceCost = parseFloat((data.skuPriceTax / ((parseInt(data.taxRateCode.substr(9)) + 100) / 100)).toFixed(2));
				}else if(str == 'tax') {
					_this.detailList[index].taxRateCode = val;
					_this.detailList[index].skuPriceCost = parseFloat((data.skuPriceTax / ((parseInt(data.taxRateCode.substr(9)) + 100) / 100)).toFixed(2));
				}
				_this.detailList = JSON.parse(JSON.stringify(_this.detailList));
			},
			//设置是否是主供应商
			setMainS(val, index) {
				let _this = this;
				_this.detailList[index].isMainSupplier = val;
			},
			// 附件下载地址
			getDownloadUrl(a,b) {
				return b;
			}
		},
	}
</script>
<style>
.wd100{
		width: 100px;
}
.width-100{
	width: 100%;
}
.inp-invalid{
	border-color: #f86c6b!important;
}
.inp-invalid input{
	border: 1px solid #f86c6b;
}
.inp-invalid select{
	border: 1px solid #f86c6b;
}
.el-input.is-disabled input{
	color:#3e515b!important;
}
.purchasec-w .oBox{
	width: 340px!important;
}
.card-header div{
	font-weight: bold!important;
}
.contact-card{
	position: relative;
}
.contract-i{
	position: absolute;
	left:102px;
	top:15px;
	z-index: 80;
}
.purchasecontract{
	margin-bottom: 150px;
}
.purchasecontract .dataContent{
	height: 155px;
}
</style>
