<template>
	<div>
		<b-card>
			<div class="row alig">
				<b-col md="6">
					<b-form-fieldset horizontal label="盘点单编号" :label-cols="4" class="text-right">
						<b-form-input v-model="blitemModel.inventoryNo" disabled/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="盘点单据日期" :label-cols="4" class="text-right">
						<b-form-input v-model="blitemModel.inventoryDate" disabled/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="盘点计划名称" :label-cols="4" class="text-right">
						<b-form-input v-model="blitemModel.inventoryPlanName" disabled/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-fieldset horizontal label="仓库名称" :label-cols="4" class="text-right">
						<b-form-input v-model="blitemModel.whName" disabled/>
					</b-form-fieldset>
				</b-col>
				<b-col md="6">
					<b-form-group horizontal label="计划类型" :label-cols="4" class="text-right">
						<b-form-input v-model="blitemModel.inventoryTypeName" disabled/>
					</b-form-group>
				</b-col>
				<b-col md="6">
					<b-form-group horizontal label="盘点商品类型" :label-cols="4" class="text-right">
						<b-form-select v-model="blitemModel.inventorySkuType" :options="typelist" disabled></b-form-select>						
					</b-form-group>
				</b-col>
				<b-col md="6">
					<b-form-group horizontal label="盘点规则" :label-cols="4" class="text-right" v-show="blitemModel.showRules">
						<b-button class="pull-left" variant="primary" @click="lookRules()">查看规则</b-button>
					</b-form-group>
				</b-col>
				<b-col md="6">
					<b-form-group horizontal label="一盘员工名称" :label-cols="4" class="text-right">
						<b-form-input v-model="blitemModel.empName1st" disabled/>
					</b-form-group>
				</b-col>
				<b-col md="6">
				</b-col>
				<b-col md="6">
					<b-form-group horizontal label="二盘员工名称" :label-cols="4" class="text-right">
						<b-form-input v-model="blitemModel.empName2nd" disabled/>
					</b-form-group>
				</b-col>
			</div>
			<b-row>
				<div class="col-md-2 text-left">
					<div class="small-code" @mouseover="qrcodeShow=true" @mouseleave="qrcodeShow=false" v-show="isQrCode">
						<qrcode-vue :value="qrCode.value" :size="qrCode.size" level="H"></qrcode-vue>
						<div class="big-code" v-show="qrcodeShow">
							<qrcode-vue :value="qrCode.value" :size="200" level="H"></qrcode-vue>
						</div>
					</div>
				</div>
				<div class="col-md-10 text-right">
					<b-button size="sm" variant="success" v-show="btnShowStatus.startBlitem && !onlySee" @click="startBiltem" v-if='startBiltemBtn'>开始盘点
					</b-button>
					<b-button size="sm" variant="danger" v-show="btnShowStatus.Abort && !onlySee" @click="stopWarn()" v-if='eidtBtn'>终止
					</b-button>
					<b-button size="sm" variant="secondary" v-show="btnShowStatus.temporaryStorage && !onlySee" @click="submitData('')" v-if='eidtBtn'>暂存
					</b-button>
					<b-button size="sm" variant="primary" v-show="btnShowStatus.submitNum && !onlySee" @click="submitData()" v-if='eidtBtn'>提交
					</b-button>
					<b-button size="sm" variant="primary" v-show="btnShowStatus.submitRemark && !onlySee" @click="submitData()" v-if='eidtBtn'>
						提交备注
					</b-button>
				</div>
			</b-row>
		</b-card>
		<b-card>
			<b-row class="mb-2">
				<b-col cols="10">					
					<b-button size="sm" variant="secondary" v-show="btnShowStatus.exportTab" @click="exportTab">导出
					</b-button>
					<v-upload buttonName='导入' v-show="btnShowStatus.importTab && !onlySee" :show-back="showBackData"
							  :add-params="uploadParams" :url='analysisUrl' v-if='eidtBtn' v-on:updateData="_initData"></v-upload>
				</b-col>
				<b-col cols="2">
					<b-form-checkbox-group name="checkbox1" v-model="onlyShowDiff" v-show="btnShowStatus.onlyShowDiff">
						<b-form-checkbox :value="true" class="pt-0">仅显示差异</b-form-checkbox>
					</b-form-checkbox-group>
				</b-col>
			</b-row>
			<div class="blitem-input" id="tableI">
				<el-table
					v-loading="loading"
					:data="list"
					border
					max-height="500"
					ref="tableData"
					stripe>
					<el-table-column
						fixed
						prop="skuCode"
						label="SKU编码"
						width="150">
					</el-table-column>
					<el-table-column
						fixed
						prop="skuTempCode"
						label="SKU临时编码"
						width="140">
					</el-table-column>
					<el-table-column
						fixed
						prop="originalCode"
						label="原厂编码"
						width="120">
					</el-table-column>
					<el-table-column
						fixed
						prop="skuName"
						label="商品名称"
						width="140">
					</el-table-column>
					<el-table-column
						fixed
						prop="whAreaName"
						show-overflow-tooltip 
						label="库区"
						width="110">
					</el-table-column>
					<el-table-column
						fixed
						show-overflow-tooltip 
						prop="whLocationName"
						label="库位"
						width="110">
					</el-table-column>
					<el-table-column
						key='Math.random()'
						v-if="isTabColumShow('stockNum')"
						prop="stockNums"
						label="库存数量"
						width="120">			
					</el-table-column>
					<el-table-column
						v-if="isTabColumShow('endDiff')"
						prop="diffNums"
						label="终盘差异"
						width="120">
					</el-table-column>
					<el-table-column
						v-if="isTabColumShow('oneCheckNum')"
						prop="inventoryNums1st"
						label="一盘数量"
						width="120">
						<template slot-scope="scope">
							<el-input
								type="number"	
								min=0						
								size="small"
								v-model="scope.row['inventoryNums1st']"
								:class="{'border-red': verifyInput('num',scope.row['inventoryNums1st'])}"
								:disabled="isTabInputEdit('oneCheckNum')"/>
						</template>
					</el-table-column>
					<el-table-column
						v-if="isTabColumShow('oneCheckDiff')"
						prop="diffNums1st"
						label="一盘差异"
						width="120">
						<template slot-scope="scope">
							<span>{{scope.row['diffNums1st'] | biltemDiffStr}}</span>
						</template>
					</el-table-column>
					<el-table-column
						v-if="isTabColumShow('oneCheckRemark')"
						prop="diffRemark1st "
						label="一盘备注"
						show-overflow-tooltip 
						width="160">
						<template slot-scope="scope">
							<el-input
								type="text"
								size="small"
								v-model="scope.row['diffRemark1st']"
								:class="{'border-red': verifyInput('remark',scope.row['diffRemark1st'])}"
								:disabled="isTabInputEdit('oneCheckRemark',scope.row['diffNums1st'])"/>
						</template>
					</el-table-column>
					<el-table-column
						v-if="isTabColumShow('twoCheckNum')"
						prop="inventoryNums2nd"
						label="二盘数量"
						width="120">
						<template slot-scope="scope">
							<el-input
								type="number"	
								min=0				
								size="small"
								v-model="scope.row['inventoryNums2nd']"
								:class="{'border-red': verifyInput('num',scope.row['inventoryNums2nd'])}"
								:disabled="isTabInputEdit('twoCheckNum')"/>
						</template>
					</el-table-column>
					<el-table-column
						v-if="isTabColumShow('twoCheckDiff')"
						prop="diffNums2nd "
						label="二盘差异"
						width="120">
						<template slot-scope="scope">
							<span>{{scope.row['diffNums2nd'] | biltemDiffStr}}</span>
						</template>
					</el-table-column>
					<el-table-column
						v-if="isTabColumShow('twoCheckRemark')"
						prop="diffRemark2nd"
						label="二盘备注"
						show-overflow-tooltip 
						width="160">
						<template slot-scope="scope">
							<el-input
								type="text"
								size="small"
								v-model="scope.row['diffRemark2nd']"
								:class="{'border-red': verifyInput('remark',scope.row['diffRemark2nd'])}"
								:disabled="isTabInputEdit('twoCheckRemark',scope.row['diffNums2nd'])"/>
						</template>
					</el-table-column>
					<el-table-column
						prop="brandName"
						label="商品品牌名称"
						show-overflow-tooltip 
						>
					</el-table-column>
					<el-table-column
						prop="skuStandards"
						label="商品规格"
					>
					</el-table-column>
					<el-table-column
						prop="skuModel"
						label="商品型号"
						>
					</el-table-column>
					<el-table-column
						prop="checkUnitName"
						label="核算单位名称"
						>
					</el-table-column>
					<el-table-column
						prop="purchaseUnitName"
						label="采购单位名称"
						>
					</el-table-column>
					<el-table-column
						prop="purchaseToCheckNums"
						label="采购转换系数"
						>
					</el-table-column>
				</el-table>
			</div>
		</b-card>
		<b-card hidden>
			<table id="hideTabe">
				<thead>
				<tr>
					<th>SKU编码</th>
					<th>SKU临时编码</th>
					<th>原厂编码</th>
					<th>商品名称</th>
					<th>库区</th>
					<th>库位</th>
					<th v-if="isTabColumShow('stockNum')">库存数量</th>
					<th v-if="isTabColumShow('endDiff')">终盘差异</th>
					<th v-if="isTabColumShow('oneCheckNum')">一盘数量</th>
					<th v-if="isTabColumShow('oneCheckDiff')">一盘差异</th>
					<th v-if="isTabColumShow('oneCheckRemark')">一盘备注</th>
					<th v-if="isTabColumShow('twoCheckNum')">二盘数量</th>
					<th v-if="isTabColumShow('twoCheckDiff')">二盘差异</th>
					<th v-if="isTabColumShow('twoCheckRemark')">二盘备注</th>
					<th>商品品牌名称</th>
					<th>商品规格</th>
					<th>商品型号</th>
					<th>核算单位名称</th>
					<th>采购单位名称</th>
					<th>采购转换系数</th>				
				</tr>
				</thead>
				<tbody v-for=" (item, index) in list" :key="index">
				<tr>
					<td>{{item.skuCode}}</td>
					<td>{{item.skuTempCode}}</td>
					<td>{{item.originalCode}}</td>
					<td>{{item.skuName}}</td>
					<td>{{item.whAreaName}}</td>
					<td>{{item.whLocationName}}</td>
					<td v-if="isTabColumShow('stockNum')">{{item.stockNums}}</td>
					<td v-if="isTabColumShow('endDiff')">{{item.diffNums}}</td>
					<td v-if="isTabColumShow('oneCheckNum')">{{item.inventoryNums1st}}</td>
					<td v-if="isTabColumShow('oneCheckDiff')">{{item.diffNums1st | biltemDiffStr}}</td>
					<td v-if="isTabColumShow('oneCheckRemark')">{{item.diffRemark1st}}</td>
					<td v-if="isTabColumShow('twoCheckNum')">{{item.inventoryNums2nd}}</td>
					<td v-if="isTabColumShow('twoCheckDiff')">{{item.diffNums2nd | biltemDiffStr}}</td>
					<td v-if="isTabColumShow('twoCheckRemark')">{{item.diffRemark2nd}}</td>
					<td>{{item.brandName}}</td>
					<td>{{item.skuStandards}}</td>
					<td>{{item.skuModel}}</td>
					<td>{{item.checkUnitName}}</td>
					<td>{{item.purchaseUnitName}}</td>
					<td>{{item.purchaseToCheckNums}}</td>
				</tr>
				</tbody>

			</table>
		</b-card>
	</div>
</template>

<script>
	import Vue from "vue"
	import {mapState, mapMutations, mapActions} from 'vuex'
	import QrcodeVue from "qrcode.vue"
	import {DatePicker, Table, TableColumn, Input, Loading, Message, MessageBox } from "element-ui"
	import vUpload from "components/blitem-upload"
	import XLSX from "xlsx"
	import api from 'common/api'
	import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'
	import config from 'common/config.js'
	import common from 'common/common.js'
	Vue.use(DatePicker);
	Vue.use(Table);
	Vue.use(TableColumn);
	Vue.use(Input);

	export default {
		components: {
			QrcodeVue,
			vUpload
		},
		created() {
			this.typelist = config.checkPlan.typelist
			this._initData();
		},
		data() {
			return {
				qrCode: {
					value: "https://www.baidu.com",
					size: 30
				},
				typelist: [],
				onlySee: true,
				isQrCode: false,
				loading: false,
				blitemNOdd: '',
				onlyShowDiff: false,
				qrcodeShow: false,
				uploadParams: {
					relationCode: config.blitem.blitemUploadCode,
					singleFlag: '1',
					businessType: ''
				},
				showBackData: {
					inventoryNo: '',
					inventoryStatus: ''
				},
				analysisUrl: collectionApi.blitem.BlitemdetailsAnalysis,
				btnShow: {
					startBlitem: false,
					onlyShowDiff: false,
					temporaryStorage: false,
					submitNum: false,
					submitRemark: false,
					Abort: false,
					print: true,
					exportTab: true,
					importTab: true
				},
				biitemStatusType: [
					"setUp",
					"oneCheckStart",
					"oneCheckRemark",
					"twoCheckStart",
					"twoCheckRemark",
					"endCheck",
					'shutoff'
				],
				biitemStatusMap: [
					{key: '0', value: 'setUp'},
					{key: '1', value: 'oneCheckStart'},
					{key: '10', value: 'oneCheckRemark'},
					{key: '11', value: 'twoCheckStart'},
					{key: '20', value: 'twoCheckRemark'},
					{key: '9', value: 'endCheck'},
					{key: '-1', value: 'shutoff'}
				],
				biitemStatus: "setUp",
				blitemWillStatus: "",
				submitOnOff: true,
				blitemModel: {
					inventoryNo: "",
					inventoryTypeName: "",
					inventoryDate: "",
					inventoryPlanNo: "",
					inventoryPlanName: "",
					areaCode: "",
					inventoryPlanRuleInfos: "",
					inventorySkuType: "",
					empName1st: "",
					empName2st: "",
					whName: "",
					id: "",
					blitemNOdd: "",
					inventoryName: '',
					showRules: true
				},
				initList: [],
				list: []
			}
		},
		watch: {
			'$route': '_initData',
			onlyShowDiff: 'ShowDiffFu'
		},
		computed: {
			btnShowStatus() {
				let btnCurrentStatus;
				if (this.biitemStatus === "setUp") {
					this.isQrCode = false;
					btnCurrentStatus = {
						startBlitem: true,
						onlyShowDiff: false,
						temporaryStorage: false,
						submitNum: false,
						submitRemark: false,
						Abort: false,
						print: false,
						exportTab: false,
						importTab: false
					}
				} else if (this.biitemStatus === "oneCheckStart") {
					this.isQrCode = true;
					btnCurrentStatus = {
						startBlitem: false,
						onlyShowDiff: false,
						temporaryStorage: true,
						submitNum: true,
						submitRemark: false,
						Abort: true,
						print: true,
						exportTab: true,
						importTab: true
					}
				} else if (this.biitemStatus === "twoCheckStart") {
					this.isQrCode = true;
					btnCurrentStatus = {
						startBlitem: false,
						onlyShowDiff: true,
						temporaryStorage: true,
						submitNum: true,
						submitRemark: false,
						Abort: true,
						print: true,
						exportTab: true,
						importTab: true
					}
				} else if (
					this.biitemStatus === "oneCheckRemark" ||
					this.biitemStatus === "twoCheckRemark"
				) {
					this.isQrCode = false;
					btnCurrentStatus = {
						startBlitem: false,
						onlyShowDiff: true,
						temporaryStorage: true,
						submitNum: false,
						submitRemark: true,
						Abort: true,
						print: true,
						exportTab: true,
						importTab: true
					}
				} else if (this.biitemStatus === "endCheck" || this.biitemStatus === "shutoff") {
					this.isQrCode = false;
					btnCurrentStatus = {
						startBlitem: false,
						onlyShowDiff: true,
						temporaryStorage: false,
						submitNum: false,
						submitRemark: false,
						Abort: false,
						print: true,
						exportTab: true,
						importTab: false
					}
				}
				return btnCurrentStatus;
			},
			startBiltemBtn(){
				return hasBtn(collectionApi.blitem.creatBlitemDetails);
			},
			eidtBtn(){
				return hasBtn(collectionApi.blitem.BlitemEditDetails);
			}
		},
		methods: {
			...mapActions('blitem',[
                'getBlitemTabList'
            ]),   
			_initData() {
				let _this = this;
				let routeQuery = this.$route.query;
				let param = {
					inventoryNo: routeQuery.inventoryNo
				}
				_this.blitemNOdd = routeQuery.inventoryNo;
				if(routeQuery.onlySee == true) {
					_this.onlySee = true;
				}else {
					_this.onlySee = false;
				}
				api.blitem.getBlitemDetails(param, (result) => {
				if(result.data.code != 'success'){
					return;
				}
				let data = result.data.obj;			
				_this.blitemModel = {
					inventoryNo: data.inventoryNo,
					inventoryDate: data.inventoryDateString,
					inventoryTypeName: data.inventoryTypeName,
					inventoryPlanNo: data.inventoryPlanNo,
					inventoryPlanName: data.inventoryPlanName,
					availableSalesAreaCodeSet: data.availableSalesAreaCodeSet,
					inventoryPlanRuleInfos: data.inventoryPlanRuleInfos,
					inventorySkuType: data.inventorySkuType,
					empName1st: data.empName1st,
					empName2nd: data.empName2nd,
					whName: data.whName,
					id: data.id,
					blitemNOdd: data.inventoryNo,
					inventoryName: data.inventoryName,
					showRules: data.inventoryTypeCode == 'planInventory' ? true : false 
				}
				_this.qrCode.value = `${common.getUploadUrl()}/livecsMobile/blitem?inventoryNo=${data.inventoryNo}`;
				_this.biitemStatusMap.map(function (v, k) {
					if (data.inventoryStatus == v.key) {
						_this.biitemStatus = v.value;
						// if(v.key == '10') {
						// 	_this.blitemWillStatus = '20';
						// }else {
						// 	_this.blitemWillStatus = '9';
						// }
						if (k < _this.biitemStatusMap.length - 1) {
							_this.blitemWillStatus = _this.biitemStatusMap[k + 1].key;
						}
					}
				});
				if (data.inventoryStatus != "0") {
					_this.initList = data.inventorySkuDetailInfos;
					_this.list = data.inventorySkuDetailInfos;		
				}
				_this.showBackData = {
					inventoryNo: _this.blitemNOdd,
					inventoryStatus: _this.blitemWillStatus
				}
			})
			},
			lookRules(){
				let arg = this.blitemModel.inventoryPlanNo;
				if(arg != null && arg != '') {
					this.$router.push({
						path: `/checkPlan/overView/${arg + 'show'}`
					})
				}else {
					Message({
						message: '计划单号不存在,请联系管理员!',
						type: 'warning'
					});
				}
			
			},
			startBiltem() {
				let _this = this;
				let param = {
					inventoryNo: this.blitemNOdd
				}
				api.blitem.creatBlitemDetails(param, function (result) {
					if (result.data.code == 'success') {
						Message({
							message: '生成成功!',
							type: 'success'
						});
						_this._initData();
						_this.refreshTab();
					}

				});
			},
			isTabColumShow(colName) {
				if (colName == "stockNum" || colName == "endDiff" || colName == "whAreaName") {
					return this.biitemStatus == "endCheck";
				} else if (colName == "oneCheckNum") {
					return (
						this.biitemStatus == "oneCheckStart" ||
						this.biitemStatus == "oneCheckRemark" ||
						this.biitemStatus == "endCheck" ||
						this.biitemStatus == "shutoff"
					);
				} else if (colName == "oneCheckDiff") {
					return (
						this.biitemStatus == "oneCheckRemark" ||
						this.biitemStatus == "endCheck" ||
						this.biitemStatus == "shutoff"
					);
				} else if (colName == "oneCheckRemark") {
					return (
						this.biitemStatus == "oneCheckRemark" ||
						this.biitemStatus == "endCheck" ||
						this.biitemStatus == "shutoff"
					);
				} else if (colName == "twoCheckNum") {
					return (
						this.biitemStatus == "twoCheckStart" ||
						this.biitemStatus == "twoCheckRemark" ||
						this.biitemStatus == "endCheck" ||
						this.biitemStatus == "shutoff"
					);
				} else if (colName == "twoCheckDiff") {
					return (
						this.biitemStatus == "twoCheckRemark" ||
						this.biitemStatus == "endCheck" ||
						this.biitemStatus == "shutoff"
					);
				} else if (colName == "twoCheckRemark") {
					return (
						this.biitemStatus == "twoCheckRemark" ||
						this.biitemStatus == "endCheck" ||
						this.biitemStatus == "shutoff"
					);
				}
			},
			isTabInputEdit(colName, diffNum) {
				if(this.onlySee) {
					return true;
				}
				if (colName == "oneCheckNum") {
					return !(this.biitemStatus == "oneCheckStart");
				} else if (colName == "oneCheckRemark") {
					return !((this.biitemStatus == "oneCheckRemark") && diffNum != 0);
				} else if (colName == "twoCheckNum") {
					return !(this.biitemStatus == "twoCheckStart") || this.onlySee;
				} else if (colName == "twoCheckRemark") {
					return !((this.biitemStatus == "twoCheckRemark") && diffNum != 0);
				}
				
			},
			// 验证输入框
			verifyInput(valType, val) {
				if (valType == "num") {
					return (val === "" || val < 0 || val === null) ? true : false;
				} else if (valType == "remark") {
					return (val === "" || val === null) ? true : false;
				}
			},
			// 是否仅显示差异
			ShowDiffFu() {
				let fliterElm = '';
				if (this.onlyShowDiff[0]) {
					if (this.biitemStatus == "oneCheckRemark") {
						fliterElm = 'diffNums1st';
					} else if (this.biitemStatus == "twoCheckRemark") {
						fliterElm = 'diffNums2st';
					} else if (this.biitemStatus == "endCheck") {
						fliterElm = 'diffNums';
					}

					this.list = this.list.filter(elm => elm[fliterElm] != 0);
				} else {
					this.list = this.initList;
				}
			},
			// 导出表格
			exportTab() {
				let _this = this;
				let worksheet = XLSX.utils.table_to_book(
					document.getElementById("hideTabe")
				);
				XLSX.writeFile(worksheet, _this.blitemModel.inventoryName+".xlsx");
			},
			submitData(status) {
				let _this = this;
				if (status == undefined) {
					status = this.blitemWillStatus;
					switch (status) {
						case '10':
							this.verifySubmitData('inventoryNums1st');
							break;
						case '11':
							this.verifySubmitData('diffRemark1st','diffNums1st');
							break;
						case '20':
							this.verifySubmitData('inventoryNums2nd');
							break;
						case '9':
							this.verifySubmitData('diffRemark2nd', 'diffNums2nd');
							break;
					}
					if(this.submitOnOff == false){
						return;
					}
				}
				let param = {
					id: this.blitemModel.id,
					inventoryNo: this.blitemModel.blitemNOdd,
					inventorySkuDetailInfos: this.list,
					inventoryStatus: status
				}
				let messageText = '提交成功!';
				if (status == '') {
					messageText = '暂存成功!';
				} else if (status == "-1") {
					messageText = '终止成功!';
				}else{
					messageText = '提交成功!';
				}			
				api.blitem.BlitemEditDetails(param, function (result) {
					if (result.data.code == 'success') {
						Message({
							message: messageText,
							type: 'success'
						});
						_this._initData();
						_this.refreshTab();
					}
				});
			},
			stopWarn() {
				let _this = this;
				MessageBox.confirm('此操作将永久终止该盘点单, 是否继续?', '提示', {
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {				  
					_this.submitData('-1');
				}).catch(() => {
					Message({
						type: 'info',
						message: '已取消终止'
					});          
				});
			},
			// 更新盘点单列表页数据
			refreshTab() {
				 let param = {
                    inventoryNo: '',
                    inventoryName: '',
                    inventoryPlanName:'',
                    storeCodes: [],
                    whCodes: [],
                    pageNums: config.pageNums,
                    pageStart: 1
                }
                this.getBlitemTabList(param)
			},
			// 提交数据验证
			verifySubmitData(val1, val2) {
				let _this = this;
				if (!val2) {
					for (let v of this.list) {
						if (!v[val1] || v[val1] < 0) {
							Message({
								message: '请完整并正确填写表格!',
								type: 'warning'
							});
							_this.submitOnOff = false;
							
							return;
						} else {
							_this.submitOnOff = true;
						}
					}
				} else {
					for (let v of this.list) {
						if (v[val2] > 0 && (v[val1] === '' ||  v[val1] === null)) {
							Message({
								message: '差异备注未填写!',
								type: 'warning'
							});
							_this.submitOnOff = false;
							return;
						} else {
							_this.submitOnOff = true;
						}
					}
				}
			}
		},
		filters: {
			biltemDiffStr(val) {
				return val == 0 ? '否' : '是';
			}
		}
	}
</script>

<style>
	.el-input .el-input__inner {
		border-radius: 0 !important;
	}

	.el-input.is-disabled .el-input__inner {
		background-color: #c2cfd6 !important;
		border-radius: 0 !important;
	}

	.el-input__icon {
		color: #536c79 !important;
	}

	.el-input {
		width: 100% !important;
	}

	.small-code {
		display: inline-block;
		position: relative;
		width: 30px;
		height: 30px;
		vertical-align: bottom;
		margin-left: 10px;
	}

	.big-code {
		position: absolute;
		right: -230px;
		top: -210px;
		width: 210px;
		height: 210px;
		background: #fff;
		border: 5px solid #fff;
	}

	.blitem-input .el-input,
	.blitem-input .el-input__inner {
		border: none;
		outline: none;
		background-color: #e9ecef !important;
	}

	.blitem-input .el-input.is-disabled .el-input__inner {
		border: none;
		outline: none;
		background-color: #fff !important;
		color: #000 !important;
	}

	.blitem-input .el-textarea__inner {
		border: none;
		outline: none;
	}

	.blitem-input .border-red .el-input__inner {
		border: 1px solid red;
	}
	/* .blitem-input .el-table__header, .blitem-input .el-el-table__body{
		width: 1200px!important;
	} */
</style>
