<template>
	<div>
		<div class="table-scrollable">
		  	<b-table striped hover bordered :items="list" :fields="field" show-empty empty-text="暂无数据">
		  		<template slot="nodeStatus" slot-scope="data">
		  				{{getText(data.item)}}
		  		</template>
		  		<template slot="operatorName" slot-scope="data">
		  			{{data.item.postName}}  -  {{data.item.operatorName}}
		  		</template>
		  	</b-table>
	  	</div>
	</div>
</template>

<script>
import api from "common/api";
import Pagination from 'components/pagination/pagination'
import config from "common/config"; 
export default{
	 components: {
        Pagination
    },
   // props:['orderNo'],
   props:{
   		 orderNo: {
                type: String,
                default: ''
            },
   },
	data(){
		return{
			list:[],
			field:{
				createTimeStr:{
					label:'审批时间'
				},
				operatorName:{
					label:'审批人'
				},
				nodeStatus:{
					label:'审批结果'
				},
				remark:{
					label:'反馈意见'
				},
			},
			
		}
	},
	created(){
		this.getInfo(this.orderNo)
	},
	methods:{
		getInfo(orderNo){
			if(orderNo==''|| orderNo == null){
				return
			}else{
				api.approval.WfDetailInfo({'orderNo':orderNo},res => {
				if(res.data.code == 'success'){
					this.list = res.data.obj
				}
			})
			}
			
		},
		getText(data){
			let text = '';
			switch(data.nodeStatus){
				case -2:
				text = "撤销"
				break;
				case -1:
				text = '待审批'
				break;
				case 0:
				text="驳回"
				break;
				case 1:
				if(data.nodeName == '提交审批'){
					text ="提交审批"
				}else{
					text ="通过"
				}
				break;
			}
			return text
		}
	},
	watch:{
		orderNo(val) {
			if(this.orderNo != ''){
				this.getInfo(this.orderNo);
			}
		}
	}
/*	filters:{
		setnodeStatus(val){
			let text = '';
			switch(val){
				case -1:
				text = '待审批'
				break;
				case 0:
				text="驳回"
				break;
				case 1:
				text ="通过"
				break;
			}
			return text
		}
	},*/
}
</script>

<style>
#emp-insert .modal-lg {
    max-width: 1200px !important;
}
</style>