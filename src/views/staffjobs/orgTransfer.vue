<template>
	<div>
    <div class="row">
    	<div class="col-md-5">
    	<h6>人员所属组织:   {{staffInfo.orgName}}</h6>
        </div>
    </div>
    <div class="row">
    	<div class="col-md-4">
            <h6>岗位所属组织:</h6>
             <div class="row" @click="boxClick"> 
			        <div class="col-md-12" >
		           		<div @click="orgClick" ref="org">             
		                    <b-form-input v-model="params.orgName" readonly/>
		                </div>
		                <div class="text-left select-tree self_constrol" v-show="orgShow">
		                    <el-tree :data="orgTreeData" :props="orgOptions" :load="orgLoad" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="orgItemClick">
		                    </el-tree>
		                </div>
			        </div>
			    </div>
     	</div>
    </div>
    <div class='row'>
    	<div class="col-md-4 mt-2" >
            <b-form-select v-model="stationTypeCode" :options="worktype" @input='getPost'>
            </b-form-select>
        </div>
    </div>
    <div class="row" >
    	<div class="col-md-4 mt-2 select-job ml-3" >
    		<div v-if="empty">暂无数据</div>
	    		<b-form-group> 
				      <b-form-checkbox-group  stacked  name="flavs" v-model = "leftselected" :options = "options"> 
				      </b-form-checkbox-group> 
				</b-form-group> 
    	</div>
    	<div class="col-md-1 addJob mt-2">
    		<b-button variant="primary" @click ='leftPush' style="vertical-align:middle;justify-content: center;"> > </b-button>
    	</div>
    	<div class="col-md-6 select-job mt-2">
    		<div v-for="(item,i) in options2">
    			<p style="margin-bottom:0;font-size:16px;"><span class="">{{item.text}}</span><span class="pull-right el-icon-circle-close" @click='rightPush(i)'></span></p>
    			<p class="" style="color: #666;">{{item.orgName}}</p>
			</div>
      				<!--<b-form-checkbox   :value="item.value"><span class="pull-right">*</span><p></p></b-form-checkbox>-->
		     
    	</div>
    </div>
	</div>
</template>
<script>

import config from 'common/config'
import api from 'common/api'
import common from 'common/common.js'
import Vue from 'vue'
import { Tree, Transfer,Message} from 'element-ui'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import orgTree from './orgTree'
Vue.use(Tree)
export default {
	 components: {
        orgTree,
    },
	props:['worktype','empCode'],
    data() {
        return {
            params: {
                orgName: '',
                orgNameArr:[],
            }, 
            
            orgTreeData: [],
            orgOptions: {
                children: 'children',
                label: 'name'
            },
            orgShow: false,
            stationTypeCode:'',
        	value1: [1, 4],
        	userInfo:'',
        	orgCode:'',
        	postTypeCode:'',
        	selectJobs:[],
        	leftselected:[],
        	rightSelected:[],
	      	options: [],
		    options2:[],
		    userInfo2:'',
		    data:[],
		    addJob:[],
		    empty:false,
		    fisrtLoad:false,
		    sysetList:[],
        }
    },
     created() {
		/*const option ={
				"getNums":40,
				"serviceCode":config.staffJobs.getSyset,
		};
		this.getSyset(option);
		console.log(this.addJob)*/
    },
    computed: {
        ...mapGetters('staffjobs',[
    	/*   'sysetList',*/
    	   'staffInfo'
    	])
    },
    methods: {
    	...mapActions('staffjobs',['getSyset']),
    	//判断在右侧有没有重复数据
    	 isInOptions2(){
    	 	let _this =this,judge =false;
    	 	this.leftselected.forEach(function(item,i){
    			let index = _this.options2.findIndex(v => v.value === item);
    			if( index != -1){
    				judge= true
	    		}
    		})
    	 	return judge;
    	 },
    	leftPush(){
    		const _this =this;
    		if(this.isInOptions2()){
    			Message({
					message: '该岗位已添加！',
					type: 'warning'
				});
    			return;
    		}else{
    			for(let i= 0; i<=this.leftselected.length;i++){
	    			let index = _this.data.findIndex(v => v.postCode == _this.leftselected[i]);
	    			let Index = _this.options.findIndex(v =>v.value == _this.leftselected[i] )
	    			if( index != -1){
	    				_this.options2.push({
	    					'text':_this.data[index].postName,
	    					'value':_this.data[index].postCode,
	    					'orgName':_this.data[index].orgName,
	    					'postTypeCode':_this.data[index].postTypeCode
	    				})
	    				_this.options.splice(Index,1);
		    		}
    		}
    		_this.leftselected = [];
    		}
    	},
    	rightPush(index){
    		const _this =this;
    		if(this.stationTypeCode == null || this.stationTypeCode ==''){
    			_this.empty = false;
				_this.options.push({
					'text':_this.options2[index].text,
					'value':_this.options2[index].value,
				})
    			_this.options2.splice(index,1);
    		}else if(_this.options2[index].orgName !== this.params.orgName || _this.options2[index].postTypeCode !== this.stationTypeCode){
    			_this.options2.splice(index,1);
    		}else{
    			_this.empty = false;
				_this.options.push({
					'text':_this.options2[index].text,
					'value':_this.options2[index].value,
				})
    			_this.options2.splice(index,1);
    		}
    		
    	},
        // 组织
        orgLoad(node, resolve) {
        	console.log(node)
//      	return
            if (node.level === 0) {
            	const user = common.getSession('userInfo');
        		this.userInfo = JSON.parse(user).orgCodes[0];
                 let params = { orgCode:'*'};
                api.staffJob.getPostOrg(params).then(res => {
                    if (res.data.code === 'success') {
                        let obj = res.data.obj;
                        let arr = []
                        obj.forEach(item => {
                        	arr.push({
                        		name: item.orgName,
                                code: item.orgCode
                        	})
                        })
//                      let arr = [{
////                          id: 0,
//                          name: obj.orgName,
//                          code: obj.orgCode
//                      }];
                        return resolve(arr);
                    }
                })
            } else {
                let params = { orgCode: node.data.code };
                api.staffJob.getPostOrg(params).then(res => {
                    if (res.data.code === 'success') {
                        let items = res.data.obj.childOrganizations;
                        let arr = [];
                        if (items !== null) {
                            items.forEach((item, index) => {
                                let data = {
                                    name: item.orgName,
                                    code: item.orgCode
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
        orgItemClick(data) {
            this.params.orgName = data.name;
            this.orgCode =data.code;
            this.$emit('getOrgCode', data);
            this.orgShow = false;
            this.getPost();
        },
        orgClick() {
            this.orgShow = !this.orgShow;
        },
        boxClick() {
            try{
                this.$refs.org.firstChild.id = ''                           
            }catch (e) {
                return
            }
        },
        getPost(){
        	if(this.fisrtLoad){
        		return
        		
        	}else{
    			const option ={
	        	 	orgCode: this.orgCode,  
	        	 	postTypeCode:this.stationTypeCode,
	        	},
        		_this = this;
	        	_this.options =[];
	        	_this.leftselected =[];
	        	 api.staffJob.getPostn(option,function(res){
	        	 	let obj = res.data;
	        	 	if(obj.code == 'success'){
	        	 		if(obj.obj.length == 0 ){
	        	 			_this.leftselected =[];
	        	 			_this.options = [];
	        	 			_this.empty = true
	        	 			return 
	        	 		}else{
	        	 			_this.empty = false
	        	 			for (let i = 0; i< obj.obj.length; i++){
	        	 				let index = i,Obj = obj.obj;
					          _this.data.push({
					          	orgCode:Obj[index].orgCode,
					          	orgName:Obj[index].orgName,
					            postName:Obj[index].postName,
					            postCode:Obj[index].postCode,
					            postTypeCode:Obj[index].postTypeCode,
					            postTypeName:Obj[index].postTypeName,
					            disabled:false,
					          });
					          _this.options.push({
					          	text:Obj[index].postName,
					          	value:Obj[index].postCode,
					          })
		        			}
	        	 		}
	        	 	}
	        	 	
	        	 })
        	}
        
        },
        //更新岗位
    	updateJob(){
    		const arr = location.href.split('/'),
    		empCode = arr[arr.length -1],
    		sysetArr=[],
    		_this = this;
    		this.filterOptins();
    		console.log(this.addJob)
      /* 		api.staffJob.updateJob(this.addJob,(res)=>{
        		let obj = res.data;
        		if(obj.code === 'success'){
        			this.$emit('getWork');
        			Message({
						message: '添加岗位成功！',
						type: 'success'
					});
        		}
        		this.fisrtLoad = true ;
        		this.params.orgName ='';
    			this.options2 = [];
    			this.stationTypeCode = '';
        	})	*/
    	},
    	//取消操作
    	cancel(){
    		
    	},
    	clearName(){
    		this.params.orgName ='';
    		this.options2 = [];
    		this.options = [];
    		this.stationTypeCode = '';
    	},
    	setFistLoad(){
    		this.fisrtLoad = false ;
    	},
    	//岗位关系编码
    	filterSysetList(){
	       	    const _this = this;
	       	     _this.workTypes = [];
	            this.workTypeList.forEach((item,i)=> {
	                let data = {
	                	relationCode:this.workType[i],
	                    workTypeName: item.refDetailName,
	                    workTypeCode: item.refDetailCode,
	                    check: false,
	                    isDeleted: null
	                }
	                _this.workTypes.push(data);
	                
	            })
    	 	},
    	//筛选数据
    	filterOptins(){
    		this.addJob = [];//数组清空
    		this.sysetList = [];
    		this.getSequenceList().then(()=>{
    					this.options2.forEach((item,i)=>{
		    			let index = this.data.findIndex(v => v.postCode == item.value);
		    			if( index != -1){
		        		this.addJob.push({
			    			empCode:this.empCode,
						    inCharge: "0",
						    orgCode:this.data[index].orgCode,
						    orgName:this.data[index].orgName,
						    postCode:this.data[index].postCode,
						    postnName: this.data[index].postName,
						    postnType:this.data[index].postnType,
						    postnTypeCode:this.data[index].postTypeCode,
						    postnTypeName: this.data[index].postTypeName,
						    relationCode:this.sysetList[i],
						    remark: ""
		        		})
		        			
			    		}
		    		})
    					
    					api.staffJob.updateJob(this.addJob,(res)=>{
				        		let obj = res.data;
				        		if(obj.code === 'success'){
				        			this.$emit('getWork');
				        			Message({
										message: '添加岗位成功！',
										type: 'success'
									});
				        		}
				        		this.fisrtLoad = true ;
				        		this.params.orgName ='';
				    			this.options2 = [];
				    			this.stationTypeCode = '';
				        	})	
    		})
    
    	},
    	   //获取squnceList
    	getSequenceList(){
    		return new Promise((resolve,reject)=>{
    				const option ={
						"getNums":this.options2.length,
						"serviceCode":config.staffJobs.getSyset,
					};
		    		api.ordinalInfo.getSequenceList(option, (res) => {
						if(res.data.code === 'success'){
							this.sysetList = res.data.obj
							resolve()
							/*commit(types.GET_JOB_SYSET,res.data.obj)*/
						}
				    })
    		})
    	
    	},
    	
    },
 
    watch: {       
        orgShow(val) {
            document.addEventListener('click', (e) => {
                let _oTree = this.$refs.org;
                if(_oTree && !_oTree.contains(e.target))  this.orgShow = false
            })
        },    
    }
}
</script>
<style lang="css">
.addJob .btn-primary{
	margin-top:120px;
}
.select-tree {
    position: absolute;
    margin-top: 6px;
    width: 100%;
    z-index: 1000;
}

.self_constrol>.el-tree {
    max-height: 300px;
    overflow-y: scroll;
}
.el-transfer-panel{
	width: 46% !important;
	height: 300px !important;
}
.select-job{
	border:1px solid #c2cfd6;
	padding:15px;
	height: 300px;
	overflow:scroll;
}
</style>
