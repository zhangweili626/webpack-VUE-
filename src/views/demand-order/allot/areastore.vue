<template>
    <div class="row warp">
        <div class="col-md-6">
            <div @click="inputshow">
                <b-form-input type="text" :state="error ? 'invalid' : null" v-model="salesValue" placeholder="请选择销售区域" readonly></b-form-input>
            </div>
        </div>
        <div class="col-md-6">
            <el-select size="large" style="width:300px;" @change="outStoreModelChange" :class="{'allot-error':error}" no-data-text="无可用门店" v-model="outStoreModel" multiple placeholder="请选择">
                <el-option
                v-for="(item) in options"
                :key="item.value"
                :label="item.text"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="treepick-warp-container" v-if="show">
      <div class="treepick-warp text-left" >
            <Tree ref="tree" :data="treeData" style="border: none;" :show-checkbox="true" :check-strictly="true" :highlight-current='true' :props="propOption" :load="loadNodeSales" lazy empty-text="暂无数据">
            </Tree>
        </div>
        <div class="text-right confirm">
            <button type="button" class=" btn btn-primary btn-sm pull-right mt-3 mr-3 mb-3 br-50%" @click="confirm">确定</button>
        </div> 
        </div>
    </div>
</template>
<script>
import api from "common/api";
import config from "common/config";
import { Tree } from "element-ui";
export default {
  data() {
    return {
      options: [],
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
      salesValue: "",
      skuCodeList:[],
      availableNums: 0,
      outStoreModel:[],
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
    currentStore:{
      type: String,
      default: ''
    },
  },
  methods: {
    stopBubble(e) {
      if (e && e.stopPropagation) {
        e.stopPropagation(); //w3c
      } else {
        window.event.cancelBubble = true; //IE
      }
    },
    loadNodeSales(node, resolve) {
      if (node.level === 0) {
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
    confirm() {
      let data = this.$refs.tree.getCheckedNodes(); //选择的树形结构
      this.show = false;
      this.salesValue = this.renovateValue(data);
      if (data.length !== 0) {
        this.$emit("sales-data", data);
        let arr = [];
        //在这里查询经销商店
        for (var i = 0; i < data.length; i++) {
          arr.push(data[i].code);
        }
        api.allot.queryStockInfoVosBySku(
          {
            skuCodeSet:this.skuCodeList,            
            salesAreaCodes:arr,
            availableNums: this.availableNums,
          },
          msg => {
            if (msg.data.message == "success") {
              let obj = msg.data.obj.storeInfoVos;
              for (var i = 0; i < obj.length; i++) {
                this.$set(this.options, i, {
                  text: obj[i].storeName,
                  value: obj[i].storeCode
                });
              }
            }
            this.selectData = {};
            for (let k = 0; k < this.options.length; k++) {
              const element = this.options[k];
              if(this.options[k].value==this.currentStore){
                this.options.splice(k,1)
              }
            }
            if (this.storeAll) {
              this.$emit("select-change", data, this.options);
            } else {
              this.$emit("select-change", data, "");
            }
          }
        );
        this.treeData = data;
      }
    },
    inputshow() {
      this.stopBubble();
      if (this.disabled) {
        this.show = false;
        return;
      }
      this.show = true;
    },
    renovateValue(data) {
      //因为唯一标识符是code name可能会出现重复所以value需要在datas变化的时候重新计算一遍
      var value = "";
      for (var i = 0; i < data.length; i++) {
        value += data[i].name + " ";
      }
      return value;
    },
    reset() {
      this.options = [];
      this.salesValue = "";
      this.treeData = [];
    },
    skuCodeSet(value, nums){
        const _this = this;
        _this.skuCodeList = value
        _this.availableNums = nums
    },
    outStoreModelChange(value){
        const _this = this;
        this.$emit("select-change", this.treeData, value);                            
    },
    empty(){
      const _this = this;
      _this.options = []
      _this.outStoreModel = []
      _this.salesValue = ''
    }
  },
  watch: {
    readonly: function() {
      if (this.readonly) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    }
  },
  components: {
    Tree
  },
  created() {
    this.$nextTick(function() {
      document.addEventListener("click", event => {
        this.show = false;
      });
    });
    api.getUserAvailableInfo(msg => {
      if (msg.data.message === "success") {
        this.availableType = msg.data.obj.availableType;
      }
    });
  }
};
</script>

<style lang="css">
.treepick-warp {
  width: 100%;
}
 .treepick-warp .el-tree{
  max-height: 100% !important;
  overflow-y: visible !important;
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
}
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
.allot-error input{
    border-color: #f86c6b !important;
}
</style>
