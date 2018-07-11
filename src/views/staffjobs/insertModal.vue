<template>
	<b-modal id="insert"
                title="添加工种"
                @ok="handleOk"
                ok-title="确认"
                cancel-title="取消" size="">
            <div class="row">
            	<div class="col-md-6">
            		<div class="mt-2"><span>人员所属组织：{{staffInfo.orgName}}</span></div>
            		<div class="mt-2"><span>工种所属门店：</span></div>
            		<areaqueryshop ref="areaqueryshop" :storeAll="true"  @select-change="selectedfun"></areaqueryshop>
            	</div>
            </div>
            <div class="row mt-4">
                <div class="col-md-6" v-for="(item, i) in workTypes" :key="i">
                    <el-checkbox v-model="item.check" :disabled = "item.disabled" >
                        {{item.workTypeName}}
                    </el-checkbox>   
                </div> 
            </div>  
	</b-modal>
</template>
<script>
import api from "common/api";
import common from "common/common";
import config from "common/config";   
import {Message,Checkbox, MessageBox} from "element-ui";
import areaqueryshop from 'components/iris-areaqueryshop/'
import {hasBtn } from 'common/api-common'
import Vue from 'vue'
import { mapGetters, mapMutations, mapActions } from 'vuex'
Vue.use(Checkbox)
export default {
    components: {
        areaqueryshop
    },
    props: ['modal'],
    data() {
        return {
            isShowModel: false,
            workTypes:[],
			storeCode:'',
			storeName:'',
			relationCode:[],
        }
    },
    computed: {
    	...mapGetters('staffjobs',[
    	   'staffInfo',
    	   'workType',
    	   'workTypeList',
    	])
    },
    created() {
       let option ={
    	 			'getNums':20,
    	 			'serviceCode':config.staffJobs.getCode
    	 		}
       this.getWorkType(option);
       this.getWorkList();
     
    },
    mounted(){
       const _this = this;
    },
    methods: {
    		...mapActions('staffjobs',['getWorkType','getWorkList']),
    		clearName(){
    			this.storeName = this.storeCode = '';
    			this.$refs.areaqueryshop.reset();
    		},
    	   //新增工位
    	 	handleOk(ev){
    	 		const arr=[],_this = this;
    	 		this.workTypes.filter((val)=>{
    	 			if(val.check == true){
    	 				arr.push({
    	 					storeCode:_this.storeCode,
    	 					storeName:_this.storeName,
    	 					relationCode:val.relationCode,
    	 					empCode:_this.staffInfo.empCode,
    	 					empName:_this.staffInfo.empCnName,
    	 					workTypeName:val.workTypeName,
                    		workTypeCode:val.workTypeCode,
    	 				})
    	 			}
    	 		})
    	 		if(this.storeName === '' || this.storeName == undefined){
    	 			ev.preventDefault();
    	 			Message({
	       					message:'请选择门店',
	       					type:'warning'
	       			})
    	 			return;
    	 		}
    	 		
    	 		if(arr.length == 0){
	    	 			ev.preventDefault();
	    	 			Message({
		       					message:'请选择工种',
		       					type:'warning'
		       			})
	    	 			return;
    	 		}
    	 		
    	 		console.log(JSON.parse(common.getSession('userInfo')));
    	 		api.staffJob.batchWorkTypeInfo(arr,function(res){
    	 			if(res.data.code === 'success'){
    	 				_this.$emit('reload')
    	 				_this.$refs.areaqueryshop.reset();
    	 				Message({
	       					message:'添加成功',
	       					type:'success'
						   })
						   
						if(JSON.parse(common.getSession('userInfo')).userAvailableInfo.availableType != '0'){
							this.clearName();
						}
						
    	 			}
    	 		})
    	 		
    	 	},
    	 	filterWorkTypeList(){
	       	    const _this = this;
	       	     _this.workTypes = [];
	            this.workTypeList.forEach((item,i)=> {
	                let data = {
	                	relationCode:this.workType[i],
	                    workTypeName: item.refDetailName,
	                    workTypeCode: item.refDetailCode,
	                    check: false,
	                    disabled:false,
	                }
	                _this.workTypes.push(data);
	                
	            })
    	 	},
            selectedfun(data,data1){
				if (data1) {
					this.storeCode = data1.value;
					this.storeName = data1.text;
				}
				if (data1.value) {
					this.storeCode = data1.value;
					this.storeName = data1.text;
				}
				if(data1.value){
					this.$refs.areaqueryshop.setselect(data1)
				}
				this.workTypes.forEach(function(item){
					item.disabled = false;
				});
				//通过门店查询当前下面的工种
				const option ={
					storeCode:this.storeCode,
					empCode:this.staffInfo.empCode,
					
				};
				api.staffJob.queryWorkType(option,(res)=>{
					if(res.data.code == 'success'){
						let checked =[];
						checked = res.data.obj;

						this.storeCode = data1.value;
						this.storeName = data1.text;
						if(checked.length==0){
							return 
						}else{
							checked.forEach((item,i)=>{
								let index = this.workTypes.findIndex(v => v.workTypeCode == item.workTypeCode)
									// if(this.workTypes.length > 0){
									// 	this.workTypes[index].disabled = true;
									// }	
							})
						}
					}
				})
			},
    	
    },
    watch: {
    }
}
</script>
<style>
    .modal-dialog {
        margin: 80px auto !important;
    }
    .inp-invalid{
	border-color: #f86c6b!important;
}
</style>

