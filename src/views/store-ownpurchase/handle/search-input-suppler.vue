<template>
    <div class="searchContent">
        <div class="oBox"  @click="setSearch" tabindex="1" @blur="blurBox" style="outline:none" ref="oBox">
            <div class="searchBox">
                <input type="text" class="form-control" :value="value" @input="updateValue($event.target.value)" @blur="blurInput"   @focus="focusInput" :key="refIndex">
                <i class="el-icon-caret-bottom i-postion" @click="hideSearch" v-show="showSearch"></i>
            </div>
            <div class="dataContent" @scroll="onScroll($event)" ref="oScroll" v-show="showSearch">
                <ul>
                    <li v-show="!supplierList.length">无数据...</li>
                    <li @click="itemClick(item)" v-for="(item, index) in supplierList" :key="index">{{item[option]}}</li>
                </ul>
            </div>
        </div>  
    </div>
</template>
<script>
/**
 *    date : 2017-08-06 
 * @author : NS-5
 *  @prop :  
 *           option( 参数类型名称key ), 
 *           disabled( 默认false ), 
 *           hasCheck( 校验非空 默认false ),
 *           checkText( 自定义校验内容 ),
 * 
 * @event :  dataChange( 搜索框中的值发生变化触发的事件 ),
 *           itemValue( 点击列表中的一条数据触发事件 ),   
 *            blurInput(input框失去焦点触发)
 */         
import api from 'common/api'
import config from 'common/config'   
export default {
  props: {
     value: {
      type: [String],
      default: ""
    },
    refIndex: {
      type: Number,
      default: -1
    },
    option: {
      type: [String],
      default: "supplierName"
    },
    disabled: {
      type: [Boolean],
      default: false
    },
    hasCheck: {
      type: [Boolean],
      default: false
    },
    // checkText: {
    //   type: [String],
    //   default: '必填项'
    // },
    valueObj: {
      type: [Object],
      default: function() {
        return {
          codeName: '',
          code: ''
        }
      }
    }
  },
  computed: {
 
  },
  data() {
    return {
        oData: "",
        showSearch: false,
        optionName: this.option,
        items: [],
        supplierList: [],
        supplierListisLastPage:'',
        selectSuplierParams: {
            pageNums: config.pageNums,
            pageStart: 1
        },
        valueStr: '',
        timer: undefined,
        reqTimer: undefined,
    };
  },
  mounted() {
    
  },
  methods: {
    setSearch() {
      if(this.showSearch) {        
          this.supperLQuerySelect(this.value)
      }     
    },
    hideSearch(){
        this.showSearch = false; 
    },
    focusInput() {
        this.showSearch = true;
    },
    blurBox() {
        let obj = {
            value: this.value,
            refIndex: this.refIndex
        }  
    },
    blurInput() {
        let obj = {
            value: this.value,
            refIndex: this.refIndex
        }
    },
    itemClick(item) {
        let obj = Object.assign({}, item);
        obj.refIndex = this.refIndex;
        this.updateValue(item[this.optionName]);
        this.showSearch = false;
    },
    onScroll(event) {
      let _scrollTop = event.target.scrollTop;
      let _offsetHeight = event.target.offsetHeight;
      let _scrollHeight = event.target.scrollHeight;
      if (_scrollTop + _offsetHeight >= _scrollHeight) {
         this.supperLComScroll(true);
      } else {
        this.supperLComScroll(false);
      }
    },
    updateValue(value) {
        var formattedValue = value.trim().replace(/\s/g,"");        
        this.$emit('input', formattedValue)
        this.$emit('dataChange', formattedValue)
        this.supperLQuerySelect(formattedValue)
        this.$refs.oScroll.scrollTop = 0;
    },
     // SupplierList搜索框内值改变   触发搜索
        supperLQuerySelect(data) {
            const _this = this
            _this.selectSuplierParams.pageStart = 1;
            _this.selectSuplierParams.supplierName = data;
            let params = _this.selectSuplierParams;
            _this.getSupplierList(params, function(res) {
                _this.supplierListisLastPage = res.isLastPage
                _this.supplierList = res.list
            })
        },
        // SupplierList选中某一项
        supperLItemValue(value) {
            this.supplierSelect(value);
        },
        // 第一次加载SupplierList数据
        supperLFirstLoad() {
            const _this = this
            if(_this.supplierList.length != 0 ){
                return
            }
            let params = _this.selectSuplierParams
            _this.getSupplierList(params, function(res) {
                _this.supplierListisLastPage = res.isLastPage
                _this.supplierList = res.list
            })

        },
        // SupplierList滚动加载
        supperLComScroll(isEnd) {
            if (isEnd && !this.supplierListisLastPage) {
                this.selectSuplierParams.pageStart ++
                let params = this.selectSuplierParams;
                this.getSupplierList(params, obj => {
                    this.supplierListisLastPage = obj.isLastPage;
                    if(obj.list) {
                        this.supplierList = this.supplierList.concat(obj.list);
                    }
                });
            }
        },
        // 定义向后台请求getSupplierList的方法
        getSupplierList(params,callback) {
            if( this.reqTimer) {
                clearTimeout(this.reqTimer)
            }
            this.reqTimer = setTimeout(() => {           
               api.supplier.querySupplierList(params, res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        callback(obj);
                    }
                })
            }, 400)
            
        },
  },
  watch: {
    value(val, oldV) {
        let obj = {
            value: this.value,
            refIndex: this.refIndex
        }
        if( this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {           
            this.$emit("nameChange", obj);
        }, 500)
        
    }
  }
};
</script>

<style  scoped>
.oBox {
  box-sizing: border-box;
  position: absolute;
  border: 1px solid #e3e3e3;
  background-color: #fff;
  z-index: 10000;
  margin-top: 6px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
  border-radius: 5px !important;
  width: 96%;
}
.searchBox {
  padding: 0px;
}
.oBox div ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 10px;
}
.oBox div ul li {
  padding: 5px 10px;
  margin-left: 10px;
}
.oBox div ul li:hover {
  background-color: rgba(102, 175, 233, 0.6);
}
.dowm {
  position: absolute;
  top: 14px;
  right: 22px;
  width: 6px;
  height: 6px;
  border-top: 6px solid #666;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 6px solid transparent;
}
.dataContent {
  max-height: 260px;
  overflow-y: scroll;
}
.clear {
    position: absolute;
    top: 8px;
    right: 14px;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    color: #fff;
    /* background-color: rgba(102, 175, 233, 0.6); */
    text-align: center;
    line-height: 18px;
    cursor: pointer;
}
.input-box input{
    border: 1px solid #f86c6b;
}
.input-box p {
    margin-top: .25rem;
    font-size: .875rem;
    color: #f86c6b;
}
.i-postion{
    position: absolute;
    top: 12px;
    right: 6px;
}
</style>
