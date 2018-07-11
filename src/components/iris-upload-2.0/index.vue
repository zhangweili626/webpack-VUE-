<template>
    <div class="upload">
      <div class="upload_warp_img  clearfix">
        <div class="upload_warp_img_div" v-for="(item,index) of fileList" :key="index">
          <div class="upload_warp_img_div_top" v-if="!disabled">
            <i class="el-icon-close upload_warp_img_div_del" @click="fileDel(item)"> </i>
          </div>
          <img  class="list-img"  @click="open(item.url)" :src="item.url">
          <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
            <span  style="display: inline-block;width: 80px;overflow: hidden;text-align: center;height:18px;">{{item.name}}</span>
          </el-tooltip>
        </div>
        <div class="upload_warp" v-if="buttonShow">
          <div class="upload_warp_left" @click="fileClick">
            <div class="el-upload el-upload--picture-card">
              <i v-if="!title" class="el-icon-plus"></i>
              {{title}}
            </div>
          </div>
        </div>
      </div>
      <input ref="uploadFile" @input="fileChange($event)" type="file" class="upload_file" accept="image/png,image/gif,image/jpg,image/jpeg" multiple style="display: none"/>
    </div>
</template>
<script>
  import config from 'common/config'
  import axios from 'axios'
  import Vue from 'vue'
  import {Tooltip , Message} from 'element-ui'
  axios.defaults.withCredentials = false
  Vue.use(Tooltip)
  export default {
    name: 'upload',
    props: {
      onSuccess: {
        type: Function,
        default: function() {
          return function(){};
        }
      },
      onError: {
        type: Function,
        default: function() {
          return function(){};
        }
      },
      fileList: {
        type: Array,
        default: function() {
          return [];
        }
      },
      onRemove: {
        type: Function,
        default: function() {
          return function(){};
        }
      },
      uploadBefore: {
        type: Function,
        default: function() {
          return function(){};
        }
      },
      parame: {
        type: Object,
        default: function() {
          return {}
        }
      },
      limit: {
        type: Number,
        validator: function (value) {
            return value > 0
        },
        default: 1
      },
      title:{
        type: String,
        default: function() {
          return ""
        }
      },
      disabled: {
        type: Boolean,
        default: function() {
          return false
        }
      },
      maximum: {
        type: Number,
        validator: function (value) {
            return value > 0
        },
        default: 5000000
      },
      
    },
    data() {
      return {
        imgList: [],
        size: 0,
        uploadUrl:config.uploadUrl,
        buttonShow:true
      }
    },
    watch:{
      fileList:{
        handler:function(){
          const _this = this;
          _this.single()
        },
        deep:true
      }
    },
    created(){
      const _this = this;
      _this.single()        
    },
    methods: {
      single(){
        const _this = this;
        if(_this.limit == 1){
          if(_this.fileList.length > 0){
            _this.buttonShow = false
          }else{
            _this.buttonShow = true
          }
        }
      },
      open(url){
        window.open(url)
      },
      fileClick() {
        const _this = this;
        if(!_this.disabled){
          _this.$refs.uploadFile.click()          
        }
      },
      fileChange(el) {
        if(el.target.files[0]){
          this.handlerFile(el.target);
          el.target.value = ''
        }
      },
      handlerFile(fileList) {
        const _this = this
        let files = fileList.files;
        _this.uploadBefore()
        for (let i = 0; i < files.length; i++) {
          if (files[i].type != '') {
            if(files[i].size > _this.maximum){
              Message({
                  type: 'warning',
                  message: `上传文件不得超过${_this.bytesToSize(_this.maximum)}！`
              });
              return;  
            }
            var formData=new FormData(); 
            formData.append("file" , files[i]);
            for (const key in _this.parame) {
              if (_this.parame.hasOwnProperty(key)) {
                formData.append(key ,_this.parame[key]);
              }
            }
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            }
            axios.post(this.uploadUrl, formData, config).then(function (res) {
                _this.onSuccess(res)
            },function (res) {
                _this.onError(files[i])
            })
          }
        }
      },
      fileDel(item){
        const _this = this;
        _this.onRemove(item)
      },
      bytesToSize(bytes) {
        if (bytes === 0) return '0 B';
        let k = 1000, // or 1024
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
      },
    }
  }
</script>
<style scoped>
  .upload_warp_img_div_del {
    color: #48576a;
  }
  .upload_warp_img_div .item.el-tooltip.tiele{
    display: inline-block;
    width: 80px;
    overflow: hidden;
  }
  .upload_warp_img_div_top {
    position: absolute;
    display: none;
    top: 2px;
    right: 2px;
    font-size: 12px;
    text-indent: 4px;
  }
  .upload_warp_img_div_text {
    white-space: nowrap;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .upload_warp_img_div .list-img {
    width: 80px;
    height: 80px;
    vertical-align: middle;
  }
  .upload_warp_img_div {
    position: relative;
    height: 100px;
    width: 110px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 10px;
    border: 1px solid rgb(192, 204, 218);
    float: left;
    padding: 12px 12px 100px 12px;
    border-radius: 6px;
    background-color: #fff;
    box-sizing: border-box;
    cursor: pointer;
  }
  .upload_warp_img_div:hover .upload_warp_img_div_top{
    display: block;
  }
  .upload_warp_text {
    text-align: left;
    margin-bottom: 10px;
    padding-top: 10px;
    text-indent: 14px;
    border-top: 1px solid #ccc;
    font-size: 14px;
  }
  .upload_warp_left {
    border-radius: 4px;
    margin-top: 6px; 
    cursor: pointer;
  }
  .upload_warp_left .el-upload.el-upload--picture-card{
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  .upload_warp {
    float: left;
    margin-left: 10px;
    margin-top: 10px;   
    margin-right: 10px;   
    padding: 0 6px 0 6px; 
    position: relative;
    min-height: 100px;
  }
  .upload {
    border: 1px solid #ccc;
    background-color: #fff;
    box-shadow: 0px 1px 0px #ccc;
    border-radius: 4px;
    display: inline-block;
  }
  .upload_warp_img{
    padding-bottom: 10px; 
  }
</style>