 <template>
   	<div>
   	   	<b-modal 
		  	ref="tyre" 
   	   		size="lg" 
   	   		title="选择轮胎属性"
   	   		cancel-title="取消"
   	   		@ok="handle"
   	   		@shown="open"
   	   		ok-title="确认">
	   			<div class="row">
					<div class="col-md-4 col-lg-4">
	 					<b-form-fieldset horizontal label="宽度" label-text-align="right" :label-cols="4">
							<search
	                            ref="search"
	                            :dataList="datalist"  
	                            option="refDetailName" 
	                            @dataChange="querySelect"
	                            @itemValue="itemValue"
	                            @clickShowBack="firstLoadP(optionWidth,'datalist','isLastPage')"
	                            @comScroll="comScroll"
	                            @clearValue="clearValue"
	                            >
							</search>
						</b-form-fieldset>
		 			</div>
		 			<div class="col-md-4 col-lg-4">
	 					<b-form-fieldset horizontal label="扁平度" label-text-align="right" :label-cols="4">
							<search
	                            ref="search2"
	                            :dataList="Flatnesslist"  
	                            option="refDetailName" 
	                            @dataChange="querySelect2"
	                            @itemValue="itemValue2"
	                            @clickShowBack="firstLoadP(optionFlatness,'Flatnesslist','isLastPage2')"
	                            @comScroll="comScroll2"
	                            @clearValue="clearValue2"
	                            >
							</search>
						</b-form-fieldset>
		 			</div>
		 			<div class="col-md-4 col-lg-4">
	 					<b-form-fieldset horizontal label="结构" label-text-align="right" :label-cols="4">
							<search
	                            ref="search3"
	                            :dataList="StructureList"  
	                            option="refDetailName" 
	                            @dataChange="querySelect3"
	                            @itemValue="itemValue3"
	                            @clickShowBack="firstLoadP(optionStructure,'StructureList','isLastPage3')"
	                            @comScroll="comScroll3"
	                            @clearValue="clearValue3"
	                            >
							</search>
						</b-form-fieldset>
		 			</div>
		 			<div class="col-md-4 col-lg-4">
	 					<b-form-fieldset horizontal label="直径" label-text-align="right" :label-cols="4">
							<search
	                            ref="search4"
	                            :dataList="diameterList"  
	                            option="refDetailName" 
	                            @dataChange="querySelect4"
	                            @itemValue="itemValue4"
	                            @clickShowBack="firstLoadP(optionDiameter,'diameterList','isLastPage4')"
	                            @comScroll="comScroll4"
	                            @clearValue="clearValue4"
	                           >
							</search>
						</b-form-fieldset>
		 			</div>
		 			<div class="col-md-4 col-lg-4">
	 					<b-form-fieldset horizontal label="载重系数" label-text-align="right" :label-cols="4">
							<search
	                            ref="search5"
	                            :dataList="LoadIndexList"  
	                            option="refDetailName" 
	                            @dataChange="querySelect5"
	                            @itemValue="itemValue5"
	                            @clickShowBack="firstLoadP(optionLoadIndex,'LoadIndexList','isLastPage5')"
	                            @comScroll="comScroll5"
	                            @clearValue="clearValue5"
	                            >
							</search>
						</b-form-fieldset>
		 			</div>
		 			<div class="col-md-4 col-lg-4">
	 					<b-form-fieldset horizontal label="速度级别" label-text-align="right" :label-cols="4">
							<search
	                            ref="search6"
	                            :dataList="SpeedLevelList"  
	                            option="refDetailName" 
	                            @dataChange="querySelect6"
	                            @itemValue="itemValue6"
	                            @clickShowBack="firstLoadP(optionSpeedLevel,'SpeedLevelList','isLastPage6')"
	                            @comScroll="comScroll6"
	                            @clearValue="clearValue6"
	                           >
							</search>
						</b-form-fieldset>
		 			</div>
	   			</div>
   	   	</b-modal>
   	</div>
</template>

<script>
import search from 'components/iris-search/search.vue'
import api from 'common/api'
import { getType, getSequence, getSequenceList } from 'common/api-common.js'
import upload from './upload'
   export default{
   		components:{
   			search,
   			upload
   		},
   		data(){
   			return{
   				mainInfo:{},
   				datalist:[],
   				Flatnesslist:[],
   				StructureList:[],
   				diameterList:[],
   				LoadIndexList:[],
   				SpeedLevelList:[],
   				optionWidth:{
	           		pageNums:15,
	           		pageStart:1,
	            	refCode:'Width',
	            	refDetailCode:'',
	            	refDetailName:'',
	           },
	           optionFlatness:{
	           		pageNums:15,
	           		pageStart:1,
	            	refCode:'Flatness',
	            	refDetailCode:'',
	            	refDetailName:'',
	           },
	           optionStructure:{
	           		pageNums:15,
	           		pageStart:1,
	            	refCode:'Structure',
	            	refDetailCode:'',
	            	refDetailName:'',
	           },
	           optionDiameter:{
	           		pageNums:15,
	           		pageStart:1,
	            	refCode:'Diameter',
	            	refDetailCode:'',
	            	refDetailName:'',
	           },
	           optionLoadIndex:{
	           		pageNums:15,
	           		pageStart:1,
	            	refCode:'LoadIndex',
	            	refDetailCode:'',
	            	refDetailName:'',
	           },
	           optionSpeedLevel:{
	           		pageNums:15,
	           		pageStart:1,
	            	refCode:'SpeedLevel',
	            	refDetailCode:'',
	            	refDetailName:'',
	           },
	           //轮胎信息
	            tire:{
	   				 width:{
	   				 	code:'',
	   				 	name:'',
	   				 	value:''
	   				 },
	   				 flatness:{
	   				 	code:'',
	   				 	name:'',
	   				 	value:''
	   				 },
	   				 structure:{
	   				 	code:'',
	   				 	name:'',
	   				 	value:''
	   				 },
	   				 diameter:{
	   				 	code:'',
	   				 	name:'',
	   				 	value:''
	   				 },
	   				 loadIndex:{
	   				 	code:'',
	   				 	name:'',
	   				 	value:''
	   				 },
	   				 speedLevel:{
	   				 	code:'',
	   				 	name:'',
	   				 	value:''
	   				 },
   				}
   			}
   			
   		},
   		mounted(){
   			//轮胎宽度
   		},
   		methods:{
   			    open(){
   			    	this.$refs.search.setValue()
   			    	this.$refs.search2.setValue()
   			    	this.$refs.search3.setValue()
   			    	this.$refs.search4.setValue()
   			    	this.$refs.search5.setValue()
   			    	this.$refs.search6.setValue()
   			    },
   				//显示
   				show(){
					this.$refs.tyre.show();
					this.tire = {
						width:{
							code:'',
							name:'',
							value:''
						},
						flatness:{
							code:'',
							name:'',
							value:''
						},
						structure:{
							code:'',
							name:'',
							value:''
						},
						diameter:{
							code:'',
							name:'',
							value:''
						},
						loadIndex:{
							code:'',
							name:'',
							value:''
						},
						speedLevel:{
							code:'',
							name:'',
							value:''
						},
					}
   				},
   				handle(){
					this.$emit('handle', this.tire)
   				},
		    	//轮胎宽度---搜索框内值改变   触发搜索
		        querySelect(data) {
		            this.optionWidth.pageStart = 1;
		            this.optionWidth.refDetailName = data
		            api.ref.getDataDictionarysPages(this.optionWidth,res=>{
		            	if(res.data.code == 'success'){
		            	    this.isLastPage = res.data.obj.isLastPage;
		            		this.datalist = res.data.obj.list
		            	}
		            })
		        },
		         // 滚动加载
		        comScroll(isEnd) {
		            if (isEnd && !this.isLastPage) {
		                 this.optionWidth.pageStart++
		                 api.ref.getDataDictionarysPages(this.optionWidth,res=>{
			            	if(res.data.code == 'success'){
			            		this.isLastPage = res.data.obj.isLastPage;
			            		this.datalist = this.datalist.concat(res.data.obj.list)
			            	}
			            	})
		            	}
		        	},
		        	
		        /*扁平度*/
		        //搜索框内值改变   触发搜索
		        querySelect2(data) {
		            this.optionFlatness.pageStart = 1;
		            this.optionFlatness.refDetailName = data
		            api.ref.getDataDictionarysPages(this.optionFlatness,res=>{
		            	if(res.data.code == 'success'){
		            	    this.isLastPage2 = res.data.obj.isLastPage;
		            		this.Flatnesslist = res.data.obj.list
		            	}
		            })
		        },
		         // 滚动加载
		        comScroll2(isEnd) {
		            if (isEnd && !this.isLastPage2) {
		                 this.optionFlatness.pageStart++
		                 api.ref.getDataDictionarysPages(this.optionFlatness,res=>{
			            	if(res.data.code == 'success'){
			            		this.isLastPage2 = res.data.obj.isLastPage;
			            		this.Flatnesslist = this.Flatnesslist.concat(res.data.obj.list)
			            	}
			            	})
		            	}
		        	},
		        	
		        	
		          /*结构*/
		        //搜索框内值改变   触发搜索
		        querySelect3(data) {
		            this.optionStructure.pageStart = 1;
		            this.optionStructure.refDetailName = data
		            api.ref.getDataDictionarysPages(this.optionStructure,res=>{
		            	if(res.data.code == 'success'){
		            	    this.isLastPage4 = res.data.obj.isLastPage;
		            		this.StructureList = res.data.obj.list
		            	}
		            })
		        },
			 
		         // 滚动加载
		        comScroll3(isEnd) {
		            if (isEnd && !this.isLastPage3) {
		                 this.optionStructure.pageStart++
		                 api.ref.getDataDictionarysPages(this.optionStructure,res=>{
			            	if(res.data.code == 'success'){
			            		this.isLastPage3 = res.data.obj.isLastPage;
			            		this.StructureList = this.StructureList.concat(res.data.obj.list)
			            	}
			            	})
		            	}
		        	},
        	
		           /*直径*/
		        //搜索框内值改变   触发搜索
		        querySelect4(data) {
		            this.optionDiameter.pageStart = 1;
		            this.optionDiameter.refDetailName = data
		            api.ref.getDataDictionarysPages(this.optionDiameter,res=>{
		            	if(res.data.code == 'success'){
		            	    this.isLastPage4 = res.data.obj.isLastPage;
		            		this.diameterList = res.data.obj.list
		            	}
		            })
		        },
		         querySelect5(data) {
		            this.optionLoadIndex.pageStart = 1;
		            this.optionLoadIndex.refDetailName = data
		            api.ref.getDataDictionarysPages(this.optionLoadIndex,res=>{
		            	if(res.data.code == 'success'){
		            	    this.isLastPage5 = res.data.obj.isLastPage;
		            		this.LoadIndexList = res.data.obj.list
		            	}
		            })
		        },
		         querySelect6(data) {
		            this.optionSpeedLevel.pageStart = 1;
		            this.optionSpeedLevel.refDetailName = data
		            api.ref.getDataDictionarysPages(this.optionSpeedLevel,res=>{
		            	if(res.data.code == 'success'){
		            	    this.isLastPage6 = res.data.obj.isLastPage;
		            		this.SpeedLevelList = res.data.obj.list
		            	}
		            })
		        },
	  
		         // 滚动加载
		        comScroll4(isEnd) {
		            if (isEnd && !this.isLastPage4) {
		                 this.optionDiameter.pageStart++
		                 api.ref.getDataDictionarysPages(this.optionDiameter,res=>{
			            	if(res.data.code == 'success'){
			            		this.isLastPage4 = res.data.obj.isLastPage;
			            		this.diameterList = this.diameterList.concat(res.data.obj.list)
			            	}
			            	})
		            	}
		    	},
		    	  comScroll5(isEnd) {
		            if (isEnd && !this.isLastPage5) {
		                 this.optionLoadIndex.pageStart++
		                 api.ref.getDataDictionarysPages(this.optionLoadIndex,res=>{
			            	if(res.data.code == 'success'){
			            		this.isLastPage5 = res.data.obj.isLastPage;
			            		this.LoadIndexList = this.LoadIndexList.concat(res.data.obj.list)
			            	}
			            	})
		            	}
		    	},
		    	  comScroll6(isEnd) {
		            if (isEnd && !this.isLastPage6) {
		                 this.optionSpeedLevel.pageStart++
		                 api.ref.getDataDictionarysPages(this.optionSpeedLevel,res=>{
			            	if(res.data.code == 'success'){
			            		this.isLastPage6 = res.data.obj.isLastPage;
			            		this.SpeedLevelList = this.SpeedLevelList.concat(res.data.obj.list)
			            	}
			            	})
		            	}
		    	},
        		
		        //公共方法 
		        firstLoadP(obj,list,lastPage) {
		        	 obj.pageStart = 1;
		            api.ref.getDataDictionarysPages(obj,res =>{
		            	if(res.data.code == 'success'){
		            	    this[lastPage] = res.data.obj.isLastPage;
		                    this[list] = res.data.obj.list;
		            	}
		            })
		        },

		         // 选中某一项    
		        itemValue(value) {
		        	this.tire.width.code = value.refDetailCode
		        	this.tire.width.name= value.refDetailName
		        },
		        itemValue2(value) {
		        	this.tire.flatness.code = value.refDetailCode
		        	this.tire.flatness.name= value.refDetailName
		        },
		         itemValue3(value) {
		        	this.tire.structure.code = value.refDetailCode
		        	this.tire.structure.name= value.refDetailName
		        },
		        itemValue4(value) {
		        	this.tire.diameter.code = value.refDetailCode
		        	this.tire.diameter.name= value.refDetailName
		        },
		         itemValue5(value) {
		        	this.tire.loadIndex.code = value.refDetailCode
		        	this.tire.loadIndex.name= value.refDetailName
		        },
		        itemValue6(value) {
		        	this.tire.speedLevel.code = value.refDetailCode
		        	this.tire.speedLevel.name= value.refDetailName
		        },
		        clearValue() {
		           	this.tire.width.code = ''
		        	this.tire.width.name= ""
		        },
		        clearValue2(value) {
		        	this.tire.flatness.code = ''
		        	this.tire.flatness.name= ''
		        },
		        clearValue3(value) {
		        	this.tire.structure.code = ''
		        	this.tire.structure.name= ''
		        },
		        clearValue4(value) {
		        	this.tire.diameter.code = ''
		        	this.tire.diameter.name= ''
		        },
		        clearValue5(value) {
		        	this.tire.loadIndex.code = ''
		        	this.tire.loadIndex.name= ''
		        },
		        clearValue6(value) {
		        	this.tire.speedLevel.code = ''
		        	this.tire.speedLevel.name= ''
		        },
	},
   		  
   }
</script>

<style>
    
</style>
