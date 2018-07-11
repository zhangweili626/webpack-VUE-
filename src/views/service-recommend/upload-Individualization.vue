<template>
    <b-button size="sm">
        <div class="text-left">
            <div>
                <el-upload
                    class="upload-demo"
                    :before-upload="beforeUpload"
                    :action="uploadUrl"
                    :data = 'addParams'
                    :show-file-list = 'false'
                    :on-progress = 'loading'
                    :on-success="handleSuccess"
                    :on-error="handleErr"
                    :disabled="disabled"
                    >
                    {{ buttonName }}
                </el-upload>
            </div>
            
            <!-- <div class="img-name" v-else>
                {{imageName}}
            </div> -->
            <!-- <div class="imgModal" @onMouseOver="showMadelImg">
                <div>1231312</div>
                <img>
            </div> -->
            <div :class="{'cover': proshow}">
                <!-- <el-progress v-if="proshow" :stroke-width="18" :percentage="schedule"></el-progress> -->
                <div class="loading"  v-if="loading2">
                    <div v-loading="loading2" element-loading-text="解析中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="width: 100%"></div>
                </div>
            </div> 
        </div>
    </b-button>
</template>

<script>
import api from "../../common/api";
import config from "../../common/config";
import Vue from "vue";
import { Upload, Button, Progress, Loading, Message } from "element-ui";
Vue.use(Upload);
Vue.use(Button);
// Vue.use(Progress)
Vue.use(Loading);
export default {
  props: {
    addParams: {
      type: Object,
      default: function() {
        return {};
      }
    },
    buttonName: {
      type: String,
      default: ""
    },
    analysisExcel: {
      type: Function,
      default: function() {}
    },
    url: {
      type: String,
      default: ""
    },
    messageTip: {
      type: String,
      default: "上传成功"
    },
    showBack: {
      type: Object,
      default: function() {
        return {};
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    theEcho: {
      type: Function,
      default: function() {}
    },
    validate: {
      type: Function,
      default: function() {
        return true;
      }
    },
    beforeUpload:{
      type:Function,
      default: function(){
        return true;
      }
    },
    analysisExcelConfirm: {
      type: Boolean,
      default: false
    },
    analysisExcelConfirmFun:{
      type:Function,
      default: function(){
        
      }
    },
    analysisExcelConfirmFlag: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      file:'',
      fileList:'',
      showMadel: false,
      imgPath: "",
      showImg: false,
      imageName: "",
      analysisExcelprops: {},
      uploadUrl: config.uploadUrl,
      proshow: false,
      schedule: "",
      loading2: false
    };
  },
  watch:{
    analysisExcelConfirmFlag:function(val){
      if(val){
        this.handleSuccess(this.file, this.fileList);
      }
    }
  },
  methods: {
    showMadelImg: function() {
      this.showMadel = true;
    },
    loading: function() {
      // this.proshow = true
      for (let i = 0; i < 50; i++) {
        this.schedule = i++;
      }
    },
    handleSuccess(file, fileList) {
      const $this = this;
      
      if(this.analysisExcelConfirm && !this.analysisExcelConfirmFlag){
        this.file = file;
        this.fileList = fileList;
        $this.analysisExcelConfirmFun();
      }
      
      
      if(!this.analysisExcelConfirmFlag  && this.analysisExcelConfirm)return;      
      // $this.imageName = fileList.name
      // $this.imgPath = config.serviceId + file.obj[0].filePath
      // $this.showImg = true
      let fileName = fileList.name;
      let filepath = config.serviceId + file.obj[0].filePath;
      for (let i = 50; i < 50; i++) {
        $this.schedule = i++;
      }
      this.theEcho(fileName, filepath);
      Message({
        type: "success",
        message: this.messageTip
      });
      if ($this.url != "") {
        $this.loading2 = true;
        this.analysisExcelprops = this.showBack;
        this.analysisExcelprops.fileName = file.obj[0].fileName;
        if (this.validate && this.validate()) {
          api.analysisExcel
            .methods(this.analysisExcelprops, $this.url)
            .then(res => {
              this.proshow = false;
              this.loading2 = false;
              if (res.data.code == "success") {
                $this.analysisExcel(res);
                Message({
                  type: "success",
                  message: "解析成功"
                });
              }else {
                $this.$emit('error-event', res)
              }
            });
        } else {
          Message({
            type: "error",
            message: "解析参数不全"
          });
          this.loading2 = false;
          this.proshow = false;
        }
      } else {
        this.proshow = false;
      }
    },
    handleErr(file) {
      Message({
        type: "error",
        Message: "上传失败"
      });
    }
  }
};
</script>
<style>
.img-name {
  /* background: red; */
}
.upload {
  /* display: inline */
  /* position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0,0,0,.5);
        z-index: 9999; */
}
.imgModal {
  position: fixed;
  left: 0;
  top: 0;
  height: 50%;
  width: 50%;
  /* background-color: rgba(0,0,0,.5); */
  z-index: 99999;
}
.cover {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}
.loading {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.loading > div {
  position: absolute !important;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
