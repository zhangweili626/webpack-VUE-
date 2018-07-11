<template>
	<div>
		<b-card header="查询">
			<div class="row">
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="客户姓名" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.customName"></b-form-input>
					</b-form-fieldset>
				</div>
				<div class="col-md-4 col-lg-4">
					<b-form-fieldset horizontal label="手机号" label-text-align="right" :label-cols="4">
						<b-form-input v-model="query.mobilePhone"></b-form-input>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 col-lg-12">
					<div class="pull-right">
						<b-button size="sm" @click="reset">重置</b-button>
						<b-button size="sm" variant="primary" @click="getQuery()">查询</b-button>
					</div>
				</div>
			</div>
		</b-card>
		<b-card>
			<div class="row">
				<div class="col-md-12 col-lg-12">
					<b-button size="sm" variant="success" @click="add">新增</b-button>
					<b-button size="sm" variant="danger" @click="delet">删除</b-button>
					<b-button size="sm" variant="primary" @click="edit">编辑</b-button>
				</div>
			</div>
			<div class="table-scrollable">
				<b-table striped hover bordered :items="list" :fields="field" show-empty empty-text="暂无数据">
					<template slot="radio" slot-scope="data">
						<div @click="check(data.item)">
							<input type="radio" v-model="selected" :value="data.item.customCode"/>
						</div>
					</template>
				</b-table>
			</div>
			<div class="row">
				<div class="col-lg-12">
					<pagination class="pull-right" 
                        @page-change="pageChange" 
                        :page-no="pages.pageNo" 
                        :page-size="pages.pageSize" 
                        :total-pages="pages.totalPages" 
                        :total-result="pages.total">
                    </pagination>
				</div>
			</div>
		</b-card>
	</div>
</template>

<script>
	import api from 'common/api'
	import config from 'common/config'
	import pagination from 'components/pagination/pagination'
	import { MessageBox, Message,DatePicker} from 'element-ui'
	export default{
		components:{
			pagination,
		},
		mounted(){
			
		},
		data(){
			return{
				deletList:{},
				selected:'',
				list:[],
				field:{
					radio:{
						label:'选择'
					},
					customName:{
						label:'客户姓名'
					},
					mobilePhone:{
						label:'手机号'
					},
				},
				query:{
					customName:'',
					mobilePhone:''
				},
				pages:{},
			}
		},
		methods:{
			check(data){
				this.deletList =  data
			},
			edit(){
				if(this.selected == ''){
					Message({
						type:'warning',
						message:'请选择一条数据'
					})
					return
				}
				this.$router.push({
					name:'mancar-edit',
					query:{
						customCode:this.selected
					}
				})
			},
			add(){
				this.$router.push({
					name:'mancar-add'
				})
			},
			delet(){
				if(this.selected == ''){
					Message({
						type:'warning',
						message:'请选择一条数据'
					})
					return
				}
				this.deletList.isDeleted = 1;
				api.mancar.update(this.deletList,res=>{
					if(res.data.code == 'success'){
						this.selected ='';
						Message({
						type:'success',
						message:'删除成功'
						})
						this.getQuery();
					}
				})
			},
			reset(){
				for(let k of Object.keys(this.query)){
					this.query[k]=''
				}
			},
			getQuery(num=1){
				this.selected = '';
				const option ={
					pageNums: config.pageNums,
					pageStart:num,
				}
				this.query.customName = this.query.customName.trim();
				this.query.mobilePhone = this.query.mobilePhone.trim();
				Object.assign(this.query,option)
				api.mancar.query(this.query,res=>{
					if(res.data.code =='success'){
						this.list = res.data.obj.list
						this.pages={
							pageSize:config.pageNums,
							pageNo: res.data.obj.pageNum,
					        total:res.data.obj.total,
					        totalPages:res.data.obj.pages,
						}
					}
				})
			},
			pageChange(num){
				this.getQuery(num)
			}
		}
	}
</script>

<style>
</style>