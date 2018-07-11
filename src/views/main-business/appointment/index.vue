<template>
	<div class="row">
		<div class="col-md-4">
			<b-card>
				<div class="his-maxheight">
					<h6>搜索车辆</h6>
					<div class="col-md-12">
						<b-form-fieldset horizontal label="预约来源" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="车主联系电话" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="车牌号码" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="车主编号" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="车主" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="车主联系人" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="送修人姓名" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="送修人电话" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="计划入场日期" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="车架号" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="车型" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="预估公里数" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="故障描述" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="其他备注" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="SA编号" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
						<b-form-fieldset horizontal label="SA姓名" :label-cols="4" class="text-right">
							<b-form-input/>
						</b-form-fieldset>
					</div>
				</div>      
			</b-card>
			
		</div>
		<div class="col-md-3">
			<b-card>
				<div class="his-maxheight">
					<h6>进厂历史纪录</h6>
					<!-- <el-steps :space="100" direction="vertical" :active="1">
					<el-step title="步骤 1"></el-step>
					<el-step title="步骤 2"></el-step>
					<el-step title="步骤 3"></el-step>
					</el-steps> -->
					<div>
						<v-history></v-history>
					</div>
				</div>
			</b-card>
		</div>
		<div class="col-md-5">
			<b-card>
				<div class="his-maxheight">
					<h6>系统推荐套餐</h6>
					<div class="row">
						<div class="col-md-12">
							<b-tabs>
							<b-tab title="套餐一" active>
								<div class="box">
									<strong>信息</strong>								
									<p>2000KM 小保养</p>
								</div>
								<div class="box">
									<strong>安全</strong>								
									<p>更新刹车油</p>
								</div>
								<div class="box">
									<strong>信息</strong>								
									<p>2000KM 小保养</p>
								</div>
								<div class="box">
									<strong>信息</strong>								
									<p>2000KM 小保养</p>
								</div>
							</b-tab>
							<b-tab title="套餐二" >
								<div class="box">
									<strong>信息</strong>								
									<p>2000KM 小保养</p>
								</div>
								<div class="box">
									<strong>安全</strong>								
									<p>更新刹车油</p>
								</div>
								<div class="box">
									<strong>信息</strong>								
									<p>2000KM 小保养</p>
								</div>
								<div class="box">
									<strong>信息</strong>								
									<p>2000KM 小保养</p>
								</div>
							</b-tab>

							</b-tabs>
						</div>
					</div>
					<h6 style="margin-top:40px;">服务明细项</h6>
					<b-table :fields="fields" :items="items">
						<!-- A virtual column -->
						<template slot="index" slot-scope="data">
						{{data.index + 1}}
						</template>
						<!-- A custom formatted column -->
						<template slot="name" slot-scope="data">
						{{data.item.name}}
						</template>
						<template slot="worktime" slot-scope="data">
						{{data.item.worktime}}
						</template>
						<template slot="backmachine" slot-scope="data">
						{{data.item.num}}
						</template>
						<!-- A virtual composite column -->
						<template slot="makesure" slot-scope="data">
						<input type="checkbox" v-model="data.item.issure">
						</template>
					</b-table>
					<button class="btn btn-success btn-sm mb-20">新增服务项目</button>
			
					<b-alert show style="background: #F5F7FA;">
						<span>已选套餐数:3个</span>
						<span class="ml-20">预计耗时：2小时</span>
						<span class="pull-right ">预计费用：<span class="red">¥4,600</span></span>
					</b-alert>
					<div class="row">
						<div class="col-md-12 text-right">
							<button class="btn btn-primary">保存</button>
						</div>
					</div>
				
				</div>
			</b-card>
		</div>
	</div>
</template>
<style>
	.his-maxheight {
		height: 1050px;
	}
	.box{
		background: #fff;
		width: 100px;
		height: 85px;
		border: 1px solid #ddd;
		padding:5px  10px;
		display: inline-block;
		overflow: hidden;
	}
	.box p{
		font-size: 12px;
		color: #999;

	}
</style>
<script>
	import Vue from "vue";
	import {steps} from "element-ui";
	import VHistory from './history'


	export default {
		data() {
			return {
				from:'',
				options:[					
					{ value: 'a', text: '电话邀约' },
					{ value: 'b', text: '自主上门' },
					{ value:'c', text: '市场活动' }					
				],
				fields: [
					// A virtual column that doesn't exist in items
					{ key: 'index', label: '序号' },
					// A column that needs custom formatting
					{ key: 'name', label: '项目' },
					// A regular column
					{ key: 'worktime', label: '工时' },
					// A regular column
					{ key: 'backmachine', label: '备件' },
					// A virtual column made up from two fields
					{ key: 'makesure', label: '确认' }
				],
				items: [
					{ name:'[保养]50000公里保养', sex: 'Male', worktime: '1MH ¥680',num:'1,649',issure:true},
					{ name:'[钣金]车门喷漆*2', sex: 'Female', worktime: '1MH ¥680',num:'1,649',issure:true},
					{ name:'[美容]发动机舱清洁镀膜', sex: 'Male', worktime: '1MH ¥680',num:'1,649',issure:true},
					{ name:'[美容]发动机舱清洁镀膜', sex: 'Female', worktime: '1MH ¥680',num:'1,649',issure:true}
				]

			}
		},
        components:{
			steps,
			VHistory
        },
		methods: {
		}
	}
	
</script>