<template>
    <div class="animated fadeIn">
        <b-card header="查询">
           
            <div class="row">
                <div class="col-md-6 col-lg-4">
                    <b-form-fieldset horizontal label="组合编码" label-text-align="right" :label-cols="4">
                        <b-form-input v-model.trim="skuComb.combinationCode" placeholder=""></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-4">
                    <b-form-fieldset horizontal label="组合名称" label-text-align="right" :label-cols="4">
                        <b-form-input v-model.trim="skuComb.combinationName" placeholder=""></b-form-input>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-4">
                    <b-form-fieldset horizontal label="组合分类" label-text-align="right" :label-cols="4">
                        <groupGoryTree  @getgroupGory="getComGory" ref="orgSelect" :params="comGroy"></groupGoryTree>
                    </b-form-fieldset>
                </div>
                 <div class="col-md-6 col-lg-4">
                    <b-form-fieldset horizontal label="组合目录" label-text-align="right" :label-cols="4">
                       <groupLogTree  @getgroupLog="getComLog" ref="orgSelect" :params="comLog"></groupLogTree>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-4">
                    <b-form-fieldset horizontal label="商品分类" label-text-align="right" :label-cols="4">
                    	<salegroyTree  @getSaleGory="getSaleGory1" ref="orgSelect" :params="saleGroy"></salegroyTree>
                    </b-form-fieldset>
                </div>
                 <div class="col-md-6 col-lg-4">
                    <b-form-fieldset horizontal label="商品目录" label-text-align="right" :label-cols="4">
                        <saleLogTree  @getSaleLog="getLogCode" ref="orgSelect" :params="saleLog"></saleLogTree>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-4">
                    <b-form-fieldset horizontal label="是否上架" label-text-align="right" :label-cols="4">
                        <b-form-select v-model.trim="skuComb.onOffFlag" :options="onOffFlags">
                        </b-form-select>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
               <div class="col-md-12">
                   <div class="pull-right">
                       <b-button size="sm" @click="reset">重置</b-button>
                       <b-button size="sm" variant="primary" @click="searchAllSkuComb">查询</b-button>
                  </div>
               </div>
           </div>
        </b-card>
        <b-card class="mb-4">
            <div class="row mb-2">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="success" @click="addSkuComb">新增</b-button>
                        <b-button size="sm" variant="primary" @click="editSkuComb">编辑</b-button>
                       <!-- <b-button size="sm" variant="danger" @click="delet">删除</b-button>-->
                    </div>
                </div>
            </div>
            <div class="table-scrollable mb-2">
                <b-table striped hover bordered show-empty :items="skuCombList" :fields="fields">
                    <template slot="selectRow" slot-scope="data" >
                        <input type="radio" :value="data.index" v-model="selectRow" name="selectRow" @click="setDate(data)"></input>
                    </template>
                    <template slot="createTimeStr" slot-scope="data">
                      {{ data.item.createTimeStr }}
                    </template>
                    
                     <template slot="operate" slot-scope="data">
                      {{ data.item.onOffFlag == '1' ? '上架':'下架'}}
                    </template>
                    <template slot="empty" >暂无数据</template>
                </b-table>
            </div>
            <div class="row">
                <div class="col-md-12">
                     <pagination class="pull-right" @page-change="pageChange" :page-no="pager.pageNo" :page-size="pager.pageSize" :total-result="pager.total" :total-pages="pager.totalPages">
                     </pagination>
                </div>
            </div>
        </b-card>
    </div>
</template>

<script>
    import {
        mapState,
        mapGetters,
        mapActions,
mapMutations
    } from 'vuex'
      import api from 'common/api'
    import config from 'common/config'
    import pagination from 'components/pagination/pagination'
    import salegroyTree from './salegoryTree'
    import groupLogTree from './groupLogTree'
    import groupGoryTree from './groupGoryTree'
    import saleLogTree from './saleLogTree'
    import { MessageBox, Message } from 'element-ui'

    export default {
        data: function() {
            return {
               selectRow: -1,
               saleLog:{
        		orgName:''
	        	},
	        	saleGroy:{
	        		orgName:''
	        	},
	        	comLog:{
	        		orgName:''
	        	},
	        	comGroy:{
	        		orgName:''
	        	},
               skuComb: {
                   combinationCode: '',
                   combinationName: '',
                   categoryCode: '',
                   catlogCode:'',
                   combinationCatlogCode:'',
                   combinationCategoryCode:'',
                   onOffFlag: null,
                   pageNums: config.pageNums,
                   pageStart: 1
               },
               fields: {
                   selectRow: {
                       label: '选择'
                   },
                   combinationCode: {
                       label: '组合编码'
                   },
                   combinationName: {
                       label: '组合名称'
                   },
                   startTime: {
                       label: '生效时间'
                   },
                   endTime: {
                       label: '失效时间'
                   },
                   createTimeStr: {
                       label: '创建日期'
                   },
                   operate: {
                       label: '状态'
                   }
               },
               onOffFlags: [
           			{
           				text:'全部',
           				value:null
               			
               		},
                   {
                      value: 0,
                      text:  '下架'
                   },
                   {
                      value: 1,
                      text:  '上架'
                   }
               ],
               deletedDate:[],
            }
        },
        computed: {
            ...mapState('skuComb', [
                'pager',
                'skuCombList'
            ])
        },
        methods: {
            reset: function() {
                this.skuComb = {
                    combinationCode:'',
                    combinationName:'',
                    combinationCatlogCode:'',
                   	combinationCategoryCode:'',
                    categoryCode: '',
                    catlogCode:'',
                    onOffFlag: null,
                    pageNums: config.pageNums,
                    pageStart: 1
                }
                this.saleLog.orgName = '';
        		this.saleGroy.orgName = '';
        		this.comLog.orgName = '';
        		this.comGroy.orgName = '';
	        
            },
            getSaleGory1(val){
          		this.skuComb.categoryCodes = [val.categoryCode]
          	},
          	getLogCode(val) {
            	this.skuComb.catlogCode = val.catlogCode
        	},
        	//组合
        	getComGory(val) {
            	this.skuComb.combinationCategoryCodes = [val.categoryCode]
        	},
        	getComLog(val) {
        		debugger
            	this.skuComb.combinationCatlogCode = val.catlogCode
        	},
            setDate(data){
            	console.log(data)
            	this.deletedDate[0] = data.item;
            	this.deletedDate[0].isDeleted = '1'
            	
            },
            delet(){
            	const _this = this;
            	if(this.selectRow == '-1'){
            		  Message({
		                       type: 'warning',
		                       message:'请选择一条数据'
		                    })
            	}else{
            		api.skuComb.editCombinationInfos(this.deletedDate,function(res){
            		if(res.data.code ==='success'){
            			  Message({
		                       type: 'success',
		                       message:'删除成功'
		                    })
            		    _this.selectRow ='-1'
                       _this.getSkuCombList(_this.$data.skuComb)
            		}
            	})
            	}
            	
            },
            searchAllSkuComb: function() {
                let _this = this
                _this.$data.skuComb.pageStart = 1
                _this.getSkuCombList(_this.$data.skuComb)
            },
            search: function() {
                let _this = this
                _this.getSkuCombList(_this.$data.skuComb)
            },
            pageChange: function(num) {
                this.skuComb.pageStart = num
                this.search()
            },
            addSkuComb: function() {
                this.$router.push('/skuComb/add')
                this.setSkuServiceInfo([])
            },
            editSkuComb: function() {
                let _this = this
                if(parseInt(this.selectRow) != -1) {
                    let combinationCode = this.skuCombList[this.selectRow].combinationCode
                    this.$router.push('/skuComb/edit/' + combinationCode)
                 } else {
                    Message.closeAll()
                    Message({
                       type: 'error',
                       message:'请选择一条数据'
                    })
                 }
            },
            ...mapActions('skuComb', [
                'getSkuCombList'
            ]),
            ...mapMutations({
                setSkuServiceInfo: 'skuComb/SET_SKU_SERVICE_INFO'
            })
        },
        components: {
            pagination,
            salegroyTree,
            saleLogTree,
            groupLogTree,
            groupGoryTree,
        }
    }
</script>
