<template>
<b-modal title="选择商品"
        id="insert"
        ref="modal"
        no-close-on-backdrop 
        no-close-on-esc 
        size="lg" 
        button-size="sm"
        @ok="commitlist"
        @shown='show'
        ok-title="确定" 
        cancel-title="取消">
    <!-- query start -->
    <div v-if ="isSku">
        <div class="row">
            <div class="col-md-6 ">
                <b-form-fieldset horizontal label="商品编码:" label-text-align="right" :label-cols="4">
                    <b-form-input v-model.trim="skuInfo.skuCode"></b-form-input>
                </b-form-fieldset>    
            </div>
            <div class="col-md-6 ">
                <b-form-fieldset horizontal label="商品名称:" label-text-align="right" :label-cols="4">
                    <b-form-input v-model.trim="skuInfo.skuName"></b-form-input>
                </b-form-fieldset>    
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 ">
                <b-form-fieldset horizontal label="69码:" label-text-align="right" :label-cols="4">
                    <b-form-input v-model.trim="skuInfo.barCode"></b-form-input>
                </b-form-fieldset>    
            </div>
            <div class="col-md-6 ">
                <b-form-fieldset horizontal label="商品品牌:" label-text-align="right" :label-cols="4">
                    <b-form-input v-model.trim="skuInfo.brandName"></b-form-input>
                </b-form-fieldset>    
            </div>
        </div>
    </div>
    <div v-if ="isService">
        <div class="row">
            <div class="col-md-6 ">
                <b-form-fieldset horizontal label="服务目录:" label-text-align="right" :label-cols="4">
                    <tree  @getCode="getLog" ref="orgSelect" :params="seviceLog"></tree>
                </b-form-fieldset>    
            </div>
            <div class="col-md-6 ">
                <b-form-fieldset horizontal label="服务分类:" label-text-align="right" :label-cols="4">
                    <goryTree  @getGCode="getgroy" ref="orgSelect" :params="seviceGroy"></goryTree>
                </b-form-fieldset>    
            </div>
            <div class="col-md-6 ">
                <b-form-fieldset horizontal label="服务编码:" label-text-align="right" :label-cols="4">
                    <b-form-input v-model.trim="service.serviceCode"></b-form-input>
                </b-form-fieldset>    
            </div>
            <div class="col-md-6 ">
                <b-form-fieldset horizontal label="服务名称:" label-text-align="right" :label-cols="4">
                    <b-form-input v-model.trim="service.serviceName"></b-form-input>
                </b-form-fieldset>    
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
            <b-form-fieldset horizontal label="选择类型:" label-text-align="right" :label-cols="4">
                <b-form-select v-model="select" :options="options" class="mb-3" />
            </b-form-fieldset>    
        </div>
        <div class="col-md-6">
            <div class="pull-right">
                <b-button size="sm" variant="primary" @click="search">查询</b-button>
            </div>
        </div>
    </div>
    <!-- query end -->

    <!-- tablelist start -->
    <div class="row">
        <div class="col-md-12 com-lg-12">
        <div class="table-scrollable">
        	<b-table striped hover bordered show-empty :items="skuList" :fields="skufield" ref="skuTableList"
                v-show="isSku">
				<template slot="radio" slot-scope="data">
					<div>
						<input type="checkbox" name="radio" v-model="selectList" :value="data.item.skuCode" :disabled="data.item.disabled"/>
					</div>
				</template>
			
				<template slot="num" slot-scope="data">
					 <b-form-input type="number"  step="0" onkeyup="this.value=this.value.replace(/^0|[1-9]*\.[0-9]*$/,'')" v-model="data.item.num" :readonly="data.item.numStatus"></b-form-input>
				</template>
				<template slot="empty">
					暂无数据...
				</template>

			</b-table>
				<b-table striped hover bordered show-empty :items="serviceList" :fields="servicefield" ref="skuTableList"
                 v-show="isService">
				<template slot="radio" slot-scope="data">
					<div>
						<input type="checkbox" name="radio" v-model="selectList" :value="data.item.serviceCode"  :disabled="data.item.disabled"/>
					</div>
				</template>
			
				<template slot="num" slot-scope="data">
					 <b-form-input type="number"  step="0" onkeyup="this.value=this.value.replace(/^0|[1-9]*\.[0-9]*$/,'')" v-model="data.item.num" :readonly="data.item.numStatus"></b-form-input>
				</template>
				<template slot="empty">
					暂无数据...
				</template>

			</b-table>
        </div>
        </div>
    </div>
    <!-- tablelist end -->

    <!-- pagination start -->
    <div class="row">
        <div class="col-md-12" v-if ="isSku">
            <pagination class="pull-right" 
                @page-change="pageChange" 
                :page-no="skuPager.pageNo" 
                :page-size="skuPager.pageSize" 
                :total-result="skuPager.total" 
                :total-pages="skuPager.totalPages">
            </pagination>
        </div>
        <div class="col-md-12" v-if ="isService">
            <pagination class="pull-right" 
                @page-change="pageChangeService" 
                :page-no="servicePager.pageNo" 
                :page-size="servicePager.pageSize" 
                :total-result="servicePager.total" 
                :total-pages="servicePager.totalPages">
            </pagination>
        </div>
    </div>
    <!-- pagination end -->
	</b-modal>
</template>
<script>

import Pagination from "components/pagination/pagination"
import Tree from "./cateLogTree"
import GoryTree from "./categoryTree"

import Vue from "vue"
import { Table, TableColumn, Message } from "element-ui"
Vue.use(Table)
Vue.use(TableColumn)

import api from "common/api"
import config from "common/config"
import { getSequenceList } from "common/api-common"

import { mapState, mapGetters, mapActions } from "vuex"

export default {
    props: ["combinationCode"],
    data() {
        return {
        	skufield:{
        		radio:{
        			label:'选择'
        		},
        		skuCode:{
        			label:'商品编码'
        		},
        		skuName:{
        			label:'商品名称'
        		},
        		skuModel:{
        			label:'型号'
        		},
        		categoryName:{
        			label:'分类'
        		},
        		brandName:{
        			label:'品牌'
        		},
        		num:{
        			label:'数量'
        		},
        		
        	},
        	servicefield:{
        		radio:{
        			label:'选择'
        		},
        		catlogName:{
        			label:'服务目录'
        		},
        		categoryName:{
        			label:'服务分类'
        		},
        		serviceCode:{
        			label:'服务编码'
        		},
        		serviceName:{
        			label:'服务名称'
        		},
        		num:{
        			label:'数量'
        		},
        		
        	},
            skuInfo: {
                skuCode: "",
                skuName: "",
                brandName: "",
                barCode: "",
                skuType: config.archives.boutuqueType,
                pageNums: 10,
                pageStart: 1,
                detailType: 0
            },
            service: {
                serviceCode: "",
                serviceName: "",
                catlogCode: "",
                categoryCode: "",
                pageNums: 10,
                pageStart: 1
            },
            options: [
                { text: "sku商品", value: 0 }, 
                { text: "服务", value: 1 }
            ],
            select: 0,

            skuList: [],
            skuPager: {},
            serviceList: [],

            selectCheckList: [],
            serSelectCheckList: [],
            selectList:[],
            canSelect:[],//记录列表中已存在的编码code
			seviceLog:{
				orgName:''
			},
            seviceGroy:{
				orgName:''
			},
			flag:false,
        }
    },
    computed: {
        isSku() {
            return this.select == 0
        },
        isService() {
            return this.select == 1
        },
        ...mapState("skuComb", [
            "skuInfoList",
            "servicePager"
        ]),
        ...mapGetters('skuComb', [
            'skuServiceInfo'
        ])
    },
    
    methods: {
        show(){
        	this.selectList = [];
        	let pager = {
                        pageNo:1,
                        pageSize: config.pageNums,
                        total: 0,
                        totalPages:1
                    }
            this.serviceDetailPage(pager)
            this.getSelect();
        },
        reset() {
            this.skuInfo = {
                skuCode: "",
                skuName: "",
                brandCode: "",
                barCode: "",
                skuType: config.archives.boutuqueType,
                pageNums: config.pageNums,
                pageStart: 1,
                detailType: 0
            }
            this.service = {
                serviceCode: "",
                serviceName: "",
                catlogCode: "",
                categoryCode: "",
                pageNums: config.pageNums,
                pageStart: 1
            }

            this.serviceList = []
            this.skuList = []

            this.skuPager = {}
            //  所有的分页查询接口 table里的list数据和分页里的数据都是应该拿 
            //  后端返回的obj下面的list属性和分页属性, 这样人为的将其分割开
            //  个人认为完全没有这个必要, 开发和维护都很繁琐并且容易遗漏增加 bug 量
        },
        getSelect() {
        	if(this.skuServiceInfo.length){
        		this.skuServiceInfo.forEach(item => {
	                this.canSelect.push(item.detailCode)
	            })
        	}
         /*   let _codeList = new Set(codeList)
            return this.isSku ?  !_codeList.has(row.skuCode) : !_codeList.has(row.serviceCode) */
        },
        serSelectChange(list) {
            this.serSelectCheckList = list
        },
        serSelectItem(selection, row) {
            let _selection = new Set(selection);
            for (let i = 0, len = this.serviceList.length; i < len; i++) {
                if (row.serviceCode === this.serviceList[i].serviceCode) {
                _selection.has(row)
                    ? this.serviceList[i].numStatus = false
                    : this.serviceList[i].numStatus = true
                }
            }
        },
        getSeqlist(length) {
            return new Promise((resolve, reject) => {
                let params = {
                    serviceCode: config.skuComb.detail.sequence,
                    getNums: length
                }
                getSequenceList(params, res => {
                    resolve(res)
                })
            })
        },
        commitlist() {
            if(this.isSku) {
            	//点击确定时，不切换页码对当前已选信息存入列表中
            	this.selectList.forEach(item=>{
	            	const index = this.skuList.findIndex(v=>v.skuCode == item);
	            	const index2 = this.selectCheckList.findIndex(x=>x.skuCode == item)
	            	if(index != -1 && index2 == -1){
	            		this.selectCheckList.push(this.skuList[index]);
	            	}
	            	
	        	})
                this.insertSkuOrService(this.selectCheckList)
            }else if(this.isService) {
            	//点击确定时，不切换页码对当前已选信息存入列表中
            	this.selectList.forEach(item=>{
	            	const index = this.serviceList.findIndex(v=>v.serviceCode == item);
	            	const index2 = this.selectCheckList.findIndex(x=>x.serviceCode == item)
	            	if(index != -1 && index2 == -1){
	            		this.selectCheckList.push(this.serviceList[index]);
	            	}
	            	
	        	});
                this.insertSkuOrService(this.selectCheckList)
            }
        
        },
        insertSkuOrService(selectList) {
            if (!selectList.length) return;
            this.getSeqlist(selectList.length).then(res => {
                let params = [];
                selectList.forEach((item, i) => {
                    let data = {
                        combinationCode: this.combinationCode,
                        combinationDetailCode: res[i],
                        detailCode: this.isSku ? item.skuCode : item.serviceCode,
                        detailName: this.isSku ? item.skuName : item.serviceName,
                        detailType: this.isSku ? 0 : 1,
                        detailNums: item.num,
                        isDeleted: 0
                    };
                    params.push(data)
                });
                api.skuComb.addOrUpdateCombinationDetailInfoBatch(params, res => {
                    if (res.data.code == "success") {
                    	this.selectCheckList = [];
                    	this.seviceLog.orgName="";
                    	this.seviceGroy.orgName="";
                        Message({
                            type: "success",
                            message: "操作成功!"
                        })
                        this.getSkuServiceInfo({ combinationCode: this.combinationCode })
                    }
                })
            })
        },
        // creat by lwx => end
        getLog(val) {
            this.service.catlogCode = val.catlogCode
        },
        getgroy(val) {
            this.service.categoryCode = val.categoryCode
        },
        search(	num=1) {
        	
            if (this.isSku) {
            	//每次保存前先把已选的select数据存起来
            	this.selectList.forEach(item=>{
	            	const index = this.skuList.findIndex(v=>v.skuCode == item);
	            	const index2 = this.selectCheckList.findIndex(x=>x.skuCode == item)
	            	if(index != -1 && index2 == -1){
	            		this.selectCheckList.push(this.skuList[index]);
	            	}
	            	
	        	});
            	this.skuInfo.onOffFlag = 1;
                api.skuComb.querySkuInfo(this.skuInfo, (res) => {
                    if (res.data.code === 'success') {
                        let obj = res.data.obj
                       	this.skuList = obj.list;
                       	 this.skuList.forEach(item => {
                            item.numStatus = true
                            item.disabled= false
                        });
                       	//列表中已经存在的数据不能再次点击
                       	this.canSelect.forEach(item=>{
                       	 	const inde = this.skuList.findIndex(x=>x.skuCode == item)
                       	 	if(inde != -1){
                       	 		this.skuList[inde].disabled = true
                       	 	}
                       	 })
                       
                        this.skuPager = {
                            pageNo: obj.pageNum,
                            pageSize: obj.pageSize,
                            total: obj.total,
                            totalPages: obj.pages
                        }
                         //切换页码后保存之前的值 
                        this.selectCheckList.forEach(item=>{
                        	const index = this.skuList.findIndex(v=>v.skuCode == item.skuCode)
                        	if(index != -1){
                        		this.skuList[index] = item
                        	}
                        })
                    }
                })
            } else {
            	//每次保存前先把已选的select数据存起来
            	this.selectList.forEach(item=>{
	            	const index = this.serviceList.findIndex(v=>v.serviceCode == item);
	            	const index2 = this.selectCheckList.findIndex(x=>x.serviceCode == item)
	            	if(index != -1 && index2 == -1){
	            		this.selectCheckList.push(this.serviceList[index]);
	            	}
	            	
	        	});
	        	console.log(this.selectCheckList)
            	this.service.onOffFlag = 1;
                api.skuComb.getQueryService(this.service, res => {
                if (res.data.code == "success") {
                    this.serviceList = res.data.obj.list
                    this.serviceList.forEach(item => {
                        item.numStatus = true
                        item.disabled= false
                    });
                    //列表中已经存在的数据不能再次点击
                   	this.canSelect.forEach(item=>{
                   	 	const inde = this.serviceList.findIndex(x=>x.serviceCode == item)
                   	 	if(inde != -1){
                   	 		this.serviceList[inde].disabled = true
                   	 	}
                   	 })
                    let pager = {
                        pageNo: res.data.obj.pageNum,
                        pageSize: res.data.obj.pageSize,
                        total: res.data.obj.total,
                        totalPages: res.data.obj.pages
                    }
                    this.serviceDetailPage(pager)
                  //切换页码后保存之前的值 
                  this.selectCheckList.forEach(item=>{
                    	const index = this.serviceList.findIndex(v=>v.serviceCode == item.serviceCode)
                    	if(index != -1){
                    		this.serviceList[index] = item
                    	}
                    })
                }
                });
            }
        },
        test() {
            this.$refs.skuTableList.toggleRowSelection(this.skuList[0]);
        },
        pageChange(num) {
            this.$data.skuInfo.pageStart = num
            this.search(num)
        },
        pageChangeService(num) {
            this.$data.service.pageStart = num
            this.search(num)
        },
        ...mapActions("skuComb", [
            "serviceDetailPage",
            "getSkuServiceInfo"
        ])
    },
    watch: {
        selectList(val,val1){
        	if(this.skuList.length){
        		this.skuList.forEach(item=>{
	        		const index = val.findIndex(v=>v == item.skuCode);
	        		if(index != -1){
	        			item.numStatus = false
	        			
	        		}else{
	        			item.numStatus = true
	        			item.num = ''
	        		}
	        	})
        	}
        	if(this.serviceList.length){
    		 	this.serviceList.forEach(item=>{
	        		const index = val.findIndex(v=>v == item.serviceCode);
	        		if(index != -1){
	        			item.numStatus = false
	        			
	        		}else{
	        			item.numStatus = true
	        			item.num = ''
	        		}
	        	})
        	}
        },
    },
    components: {
        Pagination,
        Tree,
        GoryTree
    }
}
</script>