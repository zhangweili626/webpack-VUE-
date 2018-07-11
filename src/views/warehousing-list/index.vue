<template>
	<div>
		<b-card  header="查询">
			<div class="row">
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="出入库状态" :label-cols="4" class="text-right">
                        <b-form-select v-model="query.stockStatus" :options="configs.stockStatus"></b-form-select>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="区域/门店" :label-cols="4" class="text-right">
					 	<areaqueryshop ref="areaqueryshop"    :storeAll="true" @select-change="selectedfun"></areaqueryshop>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="仓库" :label-cols="4" class="text-right">
                        <b-form-select v-model="query.whCode" :options="configs.house"></b-form-select>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="来源单据号" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="query.inSourceNo"></b-form-input>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="入库单类型" :label-cols="4" class="text-right">
                        <b-form-select v-model="query.inSourceTypeCode" :options="configs.fromtype"></b-form-select>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="入库批次号" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="query.inBatchNo"></b-form-input>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="入库账期" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="query.beTermNo"></b-form-input>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="入库时间" :label-cols="4" class="text-right">
                        	 <el-date-picker
						      v-model="intime"
						      type="daterange"
						      @change="indatechange()"
						      range-separator="至"
						      start-placeholder="开始日期"
						      end-placeholder="结束日期">
						    </el-date-picker>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="入库操作人" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="query.inStockOperatorName"></b-form-input>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="出库单号" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="query.outSourceNo"></b-form-input>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="出库单类型" :label-cols="4" class="text-right">
                        <b-form-select v-model="query.outSourceTypeCode" :options="configs.outType"></b-form-select>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="出库账期" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="query.outBeTermNo"></b-form-input>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="出库时间" :label-cols="4" class="text-right">
                        <el-date-picker
						      v-model="outtime"
						      type="daterange"
						      @change="outdatechange()"
						      range-separator="至"
						      start-placeholder="开始日期"
						      end-placeholder="结束日期">
						    </el-date-picker>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="出库操作人" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="query.outStockOperatorName"></b-form-input>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="出库确认中" :label-cols="4" class="text-right">
                        <b-form-select v-model="query.lockStatus" :options="configs.lockStatus"></b-form-select>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="商品编码" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="query.skuCode"></b-form-input>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="69码" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="query.barCode"></b-form-input>
                    </b-form-fieldset> 
				</div>
				<div class="col-md-3 col-lg-3">
					 <b-form-fieldset horizontal label="原厂编码" :label-cols="4" class="text-right">
                        <b-form-input v-model.trim="query.originalCode"></b-form-input>
                    </b-form-fieldset> 
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 col-lg-12">
					<div class="pull-right">
						<b-button @click="reset" size="sm">重置</b-button>
						<b-button variant="primary" @click="getquery()" size="sm">查询</b-button>
					</div>
				</div>
			</div>
		</b-card>
		<b-card>
			<div class="row mb-2">
				<div class="col-md-12 col-lg-12">
					<b-button variant="success" @click="Export" size="sm">导出</b-button>
				</div>
			</div>
			<el-table :data="list" style="width: 100%;" border ref="elTab" id="elTab">
				<el-table-column prop="skuCode" label="商品编码" fixed width="100"></el-table-column>
				<el-table-column prop="skuName" label="商品名称" fixed width="100"></el-table-column>
				<el-table-column prop="storeName" label="门店" fixed width="100"></el-table-column>
				<el-table-column prop="whName" label="仓库" fixed width="100"></el-table-column>
				<el-table-column prop="skuModel" label="型号" width="100"></el-table-column>
				<el-table-column prop="skuStandards" label="规格" width="100"></el-table-column>
				<el-table-column prop="barCode" label="69码" width="100"></el-table-column>
				<el-table-column prop="originalCode" label="原厂编码" width="100"></el-table-column>
				<el-table-column prop="lockStatus" label="出库确认中" width="130"></el-table-column>
				<el-table-column prop="stockStatus" label="出入库状态" width="120">
					<template slot-scope="scope">
						{{ scope.row['stockStatus'] | statusText}}
					</template>
				</el-table-column>
				<el-table-column prop="inSourceNo" label="来源单据号" width="120"></el-table-column>
				<el-table-column prop="inSourceTypeName" label="入库单类型" width="120"></el-table-column>
				<el-table-column prop="inBatchNo" label="入库批次号" width="120"></el-table-column>
				<el-table-column prop="inBeTermNo" label="入库账期" width="100"></el-table-column>
				<el-table-column prop="inStockSystemTime" label="系统入库时间" width="120"></el-table-column>
				<el-table-column prop="inStockBusinessTime" label="业务入库时间" width="120"></el-table-column>
				<el-table-column prop="outSourceNo" label="出库单号" width="100"></el-table-column>
				<el-table-column prop="outSourceTypeName" label="出库单类型" width="120"></el-table-column>
				<el-table-column prop="outBeTermNo" label="出库账期" width="100"></el-table-column>
				<el-table-column prop="outStockSystemTime" label="系统出库时间" width="120"></el-table-column>
				<el-table-column prop="outStockBusinessTime" label="业务出库时间" width="120"></el-table-column>
			</el-table>
			<div class="row mt-3">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="pageChange" :page-no="pageData.pageNum" :page-size="pageData.pageSize" :total-result="pageData.total" :total-pages="pageData.pages">
                 </pagination>
               </div>
            </div>
		</b-card>
	</div>
</template>

<script>
	import Vue from 'vue'
	import api from 'common/api'
	import { getType } from 'common/api-common'
	import common from 'common/common'
	import areaqueryshop from 'components/iris-areaqueryshop/'
	import config from 'common/config'
	import {Table, TableColumn,DatePicker,Message} from 'element-ui'
	import pagination from "components/pagination/pagination.vue";
	Vue.use(Table)
	Vue.use(TableColumn)
	Vue.use(DatePicker)
	export default{
		components:{
			pagination,
			areaqueryshop
		},
		mounted(){
			//来源单类型
			getType('InWhSourceType',res => {
				res.forEach((item)=>{
					this.configs.fromtype.push({
						value:item.refDetailCode,
						text:item.refDetailName,
					})
				})
			})
			//出库类型
			getType('OutWhSourceType',res => {
				res.forEach((item)=>{
					this.configs.outType.push({
						value:item.refDetailCode,
						text:item.refDetailName,
					})
				})
			})
			/*this.getScroll();*/
		},
		data(){
			return{
				configs:{
					stockStatus:[{
						value:-1,
						text:'全部'
					},{
						value:0,
						text:'入库'
					},{
						value:1,
						text:'出库'
					}],
					lockStatus:[{
						value:0,
						text:'NO'
					},{
						value:-1,
						text:'YES'
					}],
					whCodes:[],
					house:[],
					fromtype:[],
					outType:[],
				},
				whCodes:'',
				list:[],
				intime:'',
				outtime:'',
				query:{
					 lockStatus:"",
					 stockStatus:null,
					  outSourceNo:"",
					  outSourceTypeCode:"",
					  outBeTermNo:"",
					  outStockBusinessEndTime: "",
					  outStockBusinessStartTime: "",
					  outStockOperatorName:"",
					  beTermNo: "",
					  inSourceTypeCode:"",
					  inBatchNo:"",
					  inStockOperatorName:"",
					  skuCode: "",
					  barCode: "",
					  inStockBusinessEndTime: "",
					  inStockBusinessStartTime: "",
					  originalCode: "",
					   inSourceNo:"",
					  storeCodes:[],
					  whCode:'',
				},
				pageData:{
					pageNum:1,
					pageSize:config.pageNums,
					total:1,
					pages:1,
				}
			}
		},
		methods:{
			//控制el-tab 的滚动条
			getScroll(){
				/*this.$refs.elTab.scrollLeft = 300*/
				alert(this.$refs.elTab.scrollLeft)
				 alert(document.getElementById('container').scrollLeft);
			},
			//
			hideOut() {
                this.$refs.areaqueryshop.hideFrame()
            },
			reset(){
				for(let k of Object.keys(this.query)){
					this.query[k]=''
				}
				this.query.storeCodes=[];
				this.intime = this.outtime ='';
				this.$refs.areaqueryshop.reset();
				this.$refs.areaqueryshop.resetToStart()
			},
			//导出
			Export(){
				if(this.list.length == 0){
					Message({
						type:'warning',
						message:'暂无数据'
					})
					return
				}
				api.outInWarehouse.exportOutInventoryList(this.query,res =>{
					if(res.data.code == 'success'){
						const fileName = res.data.obj.fileName
						this.downloadFile(fileName,common.getUploadUrl()+res.data.obj.filePath)
					}
				})
			},
			downloadFile(filename,content){
				let alink = document.createElement('a');
				alink.download = filename;
				alink.href = content;
				alink.click();
			},
			indatechange(){
				let arriveTime = common.formattingTime(this.intime)
                this.query.inStockBusinessStartTime = arriveTime.startTime
                this.query.inStockBusinessEndTime = arriveTime.endTime
			},
			outdatechange(){
				let arriveTime = common.formattingTime(this.outtime)
                this.query.outStockBusinessStartTime = arriveTime.startTime
                this.query.outStockBusinessEndTime = arriveTime.endTime
			},
			getquery(num = 1){
				const option = {
					pageNums: config.pageNums,
					pageStart:num,
				}
				Object.assign(this.query,option);
				api.outInWarehouse.queryOutInventoryList(this.query,res => {
					if(res.data.code == 'success'){
						this.list = res.data.obj.list;
						this.pageData.pageNum = res.data.obj.pageNum;
						this.pageData.total = res.data.obj.total;
						this.pageData.pages = res.data.obj.pages;
					}
				})
			},
			pageChange(num){
				this.getquery(num)
			},
			selectedfun(data,data1){
				if(Array.isArray(data1)){
					this.query.storeCodes = [];
					for(let i= 1;i<data1.length;i++){
						this.query.storeCodes.push(data1[i].value)
					}
				}else{
					this.query.storeCodes = [];
					this.query.storeCodes.push(data1.value);
					//加载仓库
					this.configs.whCodes.push(data1.value)
					api.getEntrepot({'storeCodeSet':this.configs.whCodes},res => {
						if(res.data.code == 'success'){
							this.configs.house = [];
							const array = res.data.obj;
							array.forEach((item,i)=> {
								this.configs.house.push({
									value:item.warehouseCode,
									text:item.warehouseName
								})
							})
							
						}
					})
				}
		
			},
		},
		filters:{
			statusText(val){
				switch(val){
					case '-1':
					return '入库(已锁定)'
					break;
					case '0':
					return "入库"
					break;
					case '1':
					return '出库'
					break;
				}
			}
		}
	}
</script>

<style>
</style>