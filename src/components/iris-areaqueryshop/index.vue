<template>
    <div class="row warp">
        <div class="col-md-6" @click="inputshow" ref="select1">
          <el-tooltip class="item" effect="dark" :content="salesValue" placement="top-start">
              <b-form-input type="text" :state="error ? 'invalid' : null" v-model="salesValue" placeholder="请选择销售区域" readonly></b-form-input>
          </el-tooltip>
        </div>
        <div class="col-md-6">
          <!-- <el-tooltip class="item" effect="dark" :content="selectText" placement="top-start"> -->
              <search 
                ref="area"
                :tooltip="true"
                :hasCheck="error"
                :dataList="options"  
                option="text" 
                @itemValue="brandItemValue"
                :disabled="disabled"
                @clearValue="brandClearValue"
                @dataChange="brandQuerySelect"
                >
                </search>
          <!-- </el-tooltip> -->
            <!-- <b-form-select size="15" v-model="selectValue" :state="error ? 'invalid' : null" :options="options" :disabled="disabled"></b-form-select> -->
        </div>
        <div class="treepick-warp-container" v-if="show" ref="select2">
            <div id="treepick-areashop" class="treepick-warp text-left" >
                <Tree ref="tree" :data="treeData" style="border: none;" :show-checkbox="true" :check-strictly="true" :highlight-current='true' :props="propOption" :load="loadNodeSales" lazy empty-text="暂无数据" @check-change="handleCheckChange">
                </Tree>
            </div>
            <div class="button-control">
                <button type="button" class="btn btn-primary btn-sm pull-right mt-3 mr-3 mb-3 br-50%" @click="confirm('0')">确定</button>
            </div> 
        </div>
    </div>
</template>
<script>
import vue from "vue";
import treepicker from "../treepicker/treepicker.vue";
import api from "../../common/api";
import config from "../../common/config";
import { Tree , Tooltip} from "element-ui";
import search from "components/iris-search/search.vue";
vue.use(Tooltip)
export default {
  data() {
    return {
      options: [
        // {
        //   value: 0,
        //   text: "请选择经销商门店"
        // }
      ],
      selectValue: 0,
      selectData: {},
      treeData: [],
      availableType: "",
      selesNanme: "",
      disabled: false,
      propOption: {
        label: "name",
        children: "zones"
      },
      show: false,
      salesValue: "请选择销售区域",
      defaultValue: "",
      // 空值容错处理
      nullValue: "",
      storeList:[],
      paramsSales:[],
      selectText:''
    };
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    storeAll: {
      type: Boolean,
      default: false
    },
    error:{
      type: Boolean,
      default: false
    },
    rightControl: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    brandQuerySelect(data){
        const _this = this;
        api.finance.queryShopInfo(
          {
            salesAreaCodes: _this.paramsSales,
            storeName:data,
            needPageFlag: "0"
          },
          msg => {
            if (msg.data.message == "success") {
              this.defaultValue = ""
              this.options = [];
              let obj = msg.data.obj;
              for (var i = 0; i < obj.length; i++) {
                this.$set(this.options, i, {
                  text: obj[i].storeName,
                  value: obj[i].storeCode
                });
              }
            }
          })
    },
    brandClearValue(){
        const _this = this;
        _this.selectValue = 0
    },
    brandItemValue(item){
      const _this = this;
      _this.selectValue = item.value
      _this.selectText = item.text
    },
    // 控制隐藏
    hideFrame() {
      this.show = false
    },
    stopBubble(e) {
      // if (e && e.stopPropagation) {
      //   e.stopPropagation(); //w3c
      // } else {
      //   window.event.cancelBubble = true; //IE
      // }
    },
    loadNodeSales(node, resolve) {
      if (node.level === 0) {
        if(this.rightControl) {
          if (this.availableType === "1" || this.availableType === "2") {
            api.getSalesAreaInfoByUserAvailableAllLevel(msg => {
              if (msg.data.message == "success" && msg.data.obj.length != 0) {
                return resolve([
                  {
                    name: msg.data.obj[0].areaName || "",
                    code: msg.data.obj[0].areaCode || ""
                  }
                ]);
              }
            });
          }
        }else {
          // 手动设置顶层区域-----全国
          return resolve([
            {
              name: '全国',
              code: config.rootArea
            }
          ])
        }
        return;
      }
      api.area.getSalesAreaInfoByAreaCode(
        {
          areaCode: node.data.code
        },
        msg => {
          //获取子集
          let data = msg.data.obj.salesAreaSubInfo || 0;
          let arr = [];
          if (data) {
            for (var i = 0; i < data.length; i++) {
              arr[i] = {
                name: data[i].areaName,
                code: data[i].areaCode
              };
            }
            return resolve(arr);
          }
          return resolve([]);
        }
      );
    },
    handleCheckChange() {},
    confirm() {
      // debugger
      let data 
      if(this.defaultValue) {
        data = this.defaultValue
      }else {
        data = this.$refs.tree.getCheckedNodes(); //选择的树形结构
      }
      this.show = false;
      this.salesValue = this.renovateValue(data);
      if (data.length !== 0) {
        this.$emit("sales-data", data);
        this.paramsSales = [];
        //在这里查询经销商店
        for (var i = 0; i < data.length; i++) {
          this.paramsSales.push(data[i].code);
        }
        this.$refs.area.setValue()
        api.finance.queryShopInfo(
          {
            salesAreaCodes: this.paramsSales,
            needPageFlag: "0"
          },
          msg => {
            if (msg.data.message == "success") {
              this.defaultValue = ""
              this.options = [
                // {
                //   value: 0,
                //   text: "请选择经销商门店"
                // }
              ];
              let obj = msg.data.obj;
              for (var i = 0; i < obj.length; i++) {
                this.$set(this.options, i, {
                  text: obj[i].storeName,
                  value: obj[i].storeCode
                });
              }
            } else if (msg.data.message == "销售区域为空") {
              this.options = [
                // {
                //   value: 0,
                //   text: "请选择经销商门店"
                // }
              ];
            }
            this.selectData = {};
            if (this.storeAll) {
              this.$emit("select-change", data, this.options);
            } else {
              this.$emit("select-change", data, "");
            }
          }
        );
        this.treeData = data;
      }else if(data.length === 0){
        this.salesValue = ''
        if(this.availableType === "1") {
          this.defaultValue = this.nullValue
          this.confirm()
        }else {
          // this.$emit("select-change", "空值", "空值")
          this.getUserRights()
        }
      }
    },
    inputshow() {
      this.stopBubble();
      if (this.disabled) {
        this.show = false;
        return;
      }
      this.show = true;
      this.$emit("control-frame")
    },
    renovateValue(data) {
      //因为唯一标识符是code name可能会出现重复所以value需要在datas变化的时候重新计算一遍
      var value = "";
      for (var i = 0; i < data.length; i++) {
        value += data[i].name + " ";
      }
      return value;
    },
    // 清空值方法
    reset() {
      this.selectValue = 0;
      this.options = [
        // {
        //   value: 0,
        //   text: "请选择经销商门店"
        // }
      ];
      this.salesValue = "";
      this.treeData = [];
      this.$refs.area.setValue('')                    
      // this.getUserRights()
    },
    // 回到原始状态方法
    resetToStart() {
      this.reset()
      this.getUserRights()
    },
    setselect(sotreData) {
      if(typeof sotreData == 'object'){
        api.storeInfo.queryShopInfo({
          storeCode:sotreData.value
        },(msg)=>{
          if(msg.data.message == 'success'){
              this.options = [sotreData]
              this.selectValue = sotreData.value;
              this.salesValue = msg.data.obj.salesName
              this.$refs.area.setValue(sotreData.text)              
          }
        })
      }
    },
    // 获取用户权限信息
    getUserRights() {
      // 通过传入组件的布尔值来判断是否需要权限判断
      if(this.rightControl) {
        api.getUserAvailableInfo(msg => {
          if (msg.data.message === "success") {
            this.availableType = msg.data.obj.availableType;
            if (this.availableType === "0") {
              this.$set(this.options, 0, {
                value: msg.data.obj.storeInfoVo.storeCode,
                text: msg.data.obj.storeInfoVo.storeName
              });
              this.salesValue = msg.data.obj.storeInfoVo.salesName;
              this.selectValue = msg.data.obj.storeInfoVo.storeCode;
              this.$refs.area.setValue(msg.data.obj.storeInfoVo.storeName)
              this.treeData = { 
                code: msg.data.obj.storeInfoVo.salesCode,
                name: this.salesValue
              };
              this.disabled = true;
              this.$emit("select-change", this.treeData, this.selectData);                    
            }else if(this.availableType === "1") {
              let needData = msg.data.obj.storeInfoVo
              let tempArr = []
              let obj = {
                name: needData.salesName,
                code: needData.salesCode
              }
              tempArr.push(obj)
              this.defaultValue = tempArr
              this.nullValue = JSON.parse(JSON.stringify(tempArr))
              this.salesValue = obj.name
              this.confirm()
            }else if(this.availableType === "2") {
              this.$emit("select-change", [{code: '000001', name: '全国'}], []); 
            }
          }
        })
      }else {
        return
      }
    }
  },
  watch: {
    selectValue: function() {
      for (var i = 0; i < this.options.length; i++) {
        if(this.selectValue == 0){
            this.$emit("select-change", this.treeData, this.options);
        }else{
            if (this.options[i].value == this.selectValue) {
              this.selectData = this.options[i];
              this.$emit("select-change", this.treeData, this.selectData);
              return;
            }
        }
      }
    },
    readonly:function(){
      if(this.readonly){
        console.log('锁定');
        this.disabled = true
      }else{
        this.disabled = false
      }
    }
  },
  components: {
    treepicker,
    Tree,
    search
  },
  created() {
    if(this.readonly){
      this.disabled = true
    }else{
      this.disabled = false
    }
    this.$nextTick(function() {
      document.addEventListener("click", event => {
        let _select1 = this.$refs.select1;
        let _select2 = this.$refs.select2;
        if(_select1 && !_select1.contains(event.target) || _select2 && !_select2.contains(event.target)){
          this.show = false
        }
      });
    });
    this.getUserRights()
  }
};
</script>

<style lang="css">
.treepick-warp {
  width: 100%;
}
#treepick-areashop>.el-tree{
  max-height: 250px !important;
  overflow: auto;
}
.treepick-warp-container {
  position: absolute;
  width: 100%;
  height: 250px;
  top: 100%;
  background-color: #fff;
  z-index: 999;  
  box-shadow: 0 6px 8px 0 rgba(155, 155, 155, 0.5);
  box-sizing: border-box;  
  /* overflow: auto; */
}
.button-control {
  position: absolute;
  right: 0px;
  bottom: 0px;
  z-index: 999999999999999;
}
/* .treepick-warp-container .controlStyle-button {
  position: absolute;
  right: 0px;
  bottom: 0px;
  z-index: 9999999;
} */
.warp {
  position: relative;
}
.treepicker-inner {
  width: 100% !important;
  height: 200px !important;
}
.treepicker-popup {
  width: 200% !important;
}
</style>
