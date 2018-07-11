<template>
	<div id='uploadUrl'>
		<el-upload
			class="upload-demo text-left"
			:action="uploadUrl"
			:data = 'addParams'
			:on-success='handleSuccess'
			:on-error='handleErr'
			:on-remove="handleRemove"
			:on-preview="openImg"
			multiple
			:limit="2"
			list-type="picture"
			:file-list="fileList"
			:on-exceed="handleExceed"
			:disabled="disabled"
		>
			<b-button size="sm" variant="primary">点击上传</b-button>
		</el-upload>
	</div>
</template>

<script>
import Vue from 'vue'
import {Upload,Carousel,CarouselItem,MessageBox, Message, } from 'element-ui'
import api from 'common/api'
import config from 'common/config'
import common from 'common/common'	
Vue.use(Upload)
Vue.use(Carousel)
Vue.use(CarouselItem)
export default {
	data(){
		return{
			uploadUrl:config.uploadUrl,
			addParams: {
				relationCode: '12',
				singleFlag: '0',
				businessType: 'imageArray'
			},
			fileList: [],
			copyList:[],
			disabled: false
		}
	},
	props: [
		'precheckNo',
		'orderStatus'
	],
	methods:{
		handleExceed(files,fileList){
			Message({
				type: "error",
				message: "一次只能上传一张"
			});
		},
		handleSuccess(res) {
			if(res.code == "success") {
				res.obj[0].name = res.obj[0].fileOrgName;
				this.copyList.push({
					name:res.obj[0].name,
					url:'http://sit.iris.com'+res.obj[0].fileRelativePath,
				})
			}
		},
		handleErr(file) {
			Message({
				type: "error",
				message: "上传失败"
			});
		},
		handleRemove(file) {
			api.accessory.del([file], result => {
				let data = result.data;
				if(data.code === 'success') {
					Message({
						type: "success",
						message: "删除成功"
					});
				}
			})		
		},
		// 获取上传的图片
		getUpLoadImage() {
			const params = { relationCode: this.precheckNo, singleFlag: 1, businessType: 'imageArray' }
			api.accessory.list(params, res => {
				if(res && res.data.code == 'success') {
					this.fileList = []
					res.data.obj.map(item => {
						item.name = item.fileOrgName
						item.url = common.getUploadUrl() + item.filePath
						this.fileList.push(item)
					}) 
				}
			})
		},
		openImg(file){
			if(file.url && file.url!= ''){
				window.open(file.url)
			}else{
				window.open(common.getUploadUrl()+file.response.obj[0].filePath)
			}
			
		}
	},
	watch:{
		precheckNo() {
			this.addParams.relationCode = this.precheckNo;
		},
		orderStatus() {
			(this.orderStatus == 1 || this.orderStatus == 0) && this.getUpLoadImage()
			this.orderStatus == 1 && (this.disabled = true)
		}
	}
}
</script>

<style>
	#uploadUrl .el-upload-list--picture .el-upload-list__item{
		width: auto;
		margin-right: 15px;
		display: inline-block;
	}
	#uploadUrl .el-upload-list{
		white-space: nowrap;
		overflow: auto;
	}
</style>
