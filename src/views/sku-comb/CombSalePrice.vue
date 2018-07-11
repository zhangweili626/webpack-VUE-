<template>
	<div>
		<div class="row">
	  		<div class="col-md-12">
	  			<b-button size="sm" variant="success" @click="addList">新增</b-button>
				<b-button size="sm" variant="danger" @click="deleted">删除</b-button>
				<b-button size="sm" variant="success" @click="save">保存</b-button>
	  		</div>
	  	</div>
	     <div class="table-scrollable mb-2">
	        <b-table striped hover bordered show-empty empty-text="暂无数据" :items="list" :fields="fields">
	            <template slot="radio" slot-scope="data">
	                <div @click="check(data)">
	                    <input type="radio" name="radio" :value="data.item.id" v-model="selectcheck"/>
	                </div>
	            </template> 
	            <template slot="channelType" slot-scope="data">
	                	<b-form-select v-model="data.item.channelType" :options="options"/>
	            </template>
	            <template slot="combinationPrice" slot-scope="data">
	            	<b-form-input v-model="data.item.combinationPrice"  type="number" onkeyup="this.value=this.value.replace(/^0$/,'')"/>
	            </template>
	        </b-table>
	    </div>
	    <!--<div class="row"> 
	        <div class="col-md-12">
	            <pagination class="pull-right" @page-change="pageChange" :page-no="jobpage.pageNo" :page-size="jobpage.pageSize" :total-result="jobpage.totalResult" :total-pages="jobpage.totalPages">
				</pagination>
	        </div>
	    </div>-->
	</div>
</template>

<script>
import { mapActions,mapState, mapMutations } from 'vuex'
import api from 'common/api'
import config from 'common/config'
import { MessageBox, Message} from 'element-ui'
	export default{
    props:['combinationCode'],
    data() {
        return {
     		options:[],
           list:[],
           fields: {
                radio: {
                    label: ' '
                },
                channelType:{
                    label: '渠道'
                },
                combinationPrice: {
                    label: '组合销售价格'
                },
            },
            selected:'',
            selectcheck:'',
            delet:[{
            	'id':'',
            	"combinationCode":"SKUCOMB201804112000628",
	            "combinationPrice":1,
	            "combinationPriceCode":"COMBPRICE201804112000097",
	            "channelType":"OfflineStoreSales",
	            "remark":"",
	            'isDeleted':1,
            }],
            checkDelet:[],
            isreArr:[],
        }
    },
    created() {
    	this.getPriceChannel();
    	
    },
    mounted(){
    	if(this.$route.params.hasOwnProperty('combinationCode')){
			this.getPriceList();
    	}
    	
    },
    computed: {
    },
    methods: {
    	...mapActions('skuComb',[
    	   'editSkuCombPriceInfoList',
    	]),
    	addList(){
    		const _this = this;
    		this.list.push({
    			"combinationCode":_this.combinationCode,
	            "combinationPrice":1,
	            "combinationPriceCode":"",
	            "channelType":"OfflineStoreSales",
	            "remark":"",
	    		})
    	},
    	
    	check(data){
    		for(let k of Object.keys(this.delet[0])){
    			this.delet[0][k]= data.item[k]
    		}
    	},
    	deleted(){
    		debugger
    		const _this =this;
    		if(this.selectcheck == ''){
    			Message({
    				message:'请选择一条数据',
    				type:'warning'
    			})
    			return;
    		}
    		//判断是保存后的还是未保存的
    		const option={
    			combinationCode:this.combinationCode,
    		}
    		api.skuComb.getCombinationPriceInfo(option,(res)=>{
    			if(res.data.code == 'success'){
    				_this.checkDelet = res.data.obj;
    				const index = this.checkDelet.findIndex(v => v.id == this.delet[0].id);
    				if(index != -1){
		    			this.delet[0].isDeleted = 1;
			    		this.getPublicComb(this.delet,function(){
			    				Message({
					                	message:'删除成功',
					                	type:'success',
					                })
			    		})
		    		}else{
		    			this.list.splice(index,1)
		    		}
    			}
    		})
    		
    		
    	},
    	getSequenceList(){
    		return new Promise((resolve,reject)=>{
    			const option ={
    				serviceCode:'COMBPRICESEQ',
    				getNums:this.list.length,
    			}
    			api.ordinalInfo.getSequenceList(option,(res)=>{
    				if(res.data.code == 'success'){
    					this.list.forEach((item,i)=>{
    						item.combinationPriceCode = res.data.obj[i]
    					})
    					resolve()
    				}
    			})
    		})
    	},
    	//判断是不是存在重复
    	 arrRepeat(arr){
			let arrStr = JSON.stringify(arr);
			debugger
			for(var i=0;i<arr.length;i++){
				if(arrStr.indexOf(arr[i]) != arrStr.lastIndexOf(arr[i])){
					return true
				}
			}
			return false
		},
    	isrepeat(){
    		 this.isreArr =[];
    		 this.list.forEach((item,i)=>{
    		 	this.isreArr.push(item.channelType)
    		 })
    	},
    	save(){
    		this.isrepeat();
    		let flag = false
    		this.list.forEach(item=>{
    		  if(item.combinationPrice == 0){
    				flag = true
    			}
    		})
    		if(flag){
    			Message({
    	    		type:'warning',
    	    		message:'价格不能为0',
    	    	})
    			return 
    		}
    	    if(this.arrRepeat(this.isreArr)){
    	    	Message({
    	    		type:'warning',
    	    		message:'渠道类型重复',
    	    	})
    	    }else{
    	    	this.getSequenceList().then(()=>{
	    			this.getPublicComb(this.list,()=>{
	    				this.selectcheck =''
	    				Message({
			                	message:'保存销售价格明细成功',
			                	type:'success',
			                })
	    			})
    			})
    	    }
    		
    	},
    	//公共接口调用方法，保存，删除，编辑接口
    	getPublicComb(list,callback){
    		 api.skuComb.addOrUpdateCombinationPriceInfoBatch(list, (res) => {
		            if (res.data.code === 'success') {
		            	this.getPriceList();
		               	callback();
		            }
		        })
    	},
    	//获取价格列表
    	getPriceList(){
    		const option={
    			combinationCode:this.combinationCode,
    		}
    		api.skuComb.getCombinationPriceInfo(option,(res)=>{
    			if(res.data.code == 'success'){
    				this.list = res.data.obj;
    			}
    		})
    	},
    	//获取渠道类型
    	getPriceChannel(){
    		const option = {
    			refCode:config.channelType.refCode
    		}
    		api.ref.getDataDictionarys(option,(res)=>{
    			let list = res.data.obj.referenceDetailInfos;
    			if(res.data.code == 'success'){
    				list.forEach((item)=>{
    					this.options.push({
    						value:item.refDetailCode,
    						text:item.refDetailName,
    					})
    				})
    				
    			}
    		})
    	}
    },
	}
</script>

<style>
</style>