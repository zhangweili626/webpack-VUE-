<template>
    <b-button size="sm" variant="success">
        <div class="text-left">
            <div>
                <el-upload
                    class="upload-demo"
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
            <div :class="{'cover': proshow}">
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
import { Upload, Button, Progress, Loading, Message, MessageBox } from "element-ui";
Vue.use(Upload);
Vue.use(Button);
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
    confirmStr: {
        type: String,
        default: ''
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
    }
  },
  data() {
    return {
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
  methods: {
    showMadelImg: function() {
      this.showMadel = true;
    },
    loading: function() {
      for (let i = 0; i < 50; i++) {
        this.schedule = i++;
      }
    },
    handleSuccess(file, fileList) {
        const $this = this;
        let fileName = fileList.name;
        let filepath = config.serviceId + file.obj[0].filePath;
        for (let i = 50; i < 50; i++) {
            $this.schedule = i++;
        }
        this.theEcho(fileName, filepath);
      
        if ($this.url != "") {
            if($this.confirmStr === '') {
                $this.analysisExcelMethod($this, file);
            }else {
                MessageBox.confirm($this.confirmStr, '提示', {
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(() => {		
                    $this.analysisExcelMethod($this, file);
                }).catch(() => {});
            }
            
        } else {
            this.proshow = false;
        }
    },
    analysisExcelMethod($this, file) {
        console.log(file)	
        $this.loading2 = true;
        this.analysisExcelprops = file.obj[0];
        this.analysisExcelprops.filePath = config.serviceId + file.obj[0].filePath;;
        this.analysisExcelprops.fileRelativePath = config.serviceId + file.obj[0].fileRelativePath;;
        Object.assign($this.analysisExcelprops,  $this.showBack);
        delete $this.analysisExcelprops.id
        if (this.validate && this.validate()) {
          api.analysisExcel.methods(this.analysisExcelprops, $this.url).then(res => {
              this.proshow = false;
              this.loading2 = false;
              if (res.data.code == "success") {
                  $this.analysisExcel(res);
                  Message({
                    type: "success",
                    message: "解析成功"
                  });
                  this.$emit('updateData',res.data);
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
