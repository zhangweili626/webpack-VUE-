<template>
    <div class="searchContent" ref="select">
        <div ref="sel" class="oBox"  @click="setSearch">
            <div class="searchBox">
                <input type="text" class="form-control" v-model="oData" placeholder=""  @blur="blurInput">
            </div>
            <div class="dataContent" @scroll="onScroll($event)" ref="oScroll" v-show="showSearch">
                <ul>
                    <li v-show="!dataList.length">无数据...</li>
                    <li @click="itemClick(item)" v-for="(item, index) in dataList" :key="index">{{item[option]}}</li>
                </ul>
            </div>
        </div>  
    </div>
</template>
<script>
/**
 *    date : 2017-08-06 
 * @author : NS-5
 *  @prop :  dataList( 下拉框展示的数据列表 ), 
 *           option( 参数类型名称key ), 
 *           disabled( 默认false ), 
 *           hasCheck( 校验非空 默认false ),
 *           checkText( 自定义校验内容 ),
 * 
 * @event :  dataChange( 搜索框中的值发生变化触发的事件 ),
 *           itemValue( 点击列表中的一条数据触发事件 ),   
 *           clickShowBack( 下拉搜索展示时, 触发事件抛出传入的 option, 也就是说你可以在点击弹出的时候去请求第一组数据),
 *           comScroll( 滚动事件, 返回boolean值 => true 表示滚动到底部了 ),
 *           setValue( 调用此方法默认是清空操作, 也可以传name值 ) 用法: 组件上绑定 ref = 'demo' 属性  this.$refs.demo.setValue()
 *           clearValue( 外部清空事件 => 真实的清空 code)
 *            blurInput(input框失去焦点触发)
 */            
export default {
  props: {
    dataList: {
      type: [Array],
      default: function() {
        return []
      }
    },
    option: {
      type: [String],
      default: "brandName"
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
    };
  },
  mounted() {
    
  },
  methods: {
    setSearch() {
      this.showSearch = !this.showSearch;
      if(this.showSearch) {        
          this.$emit("dataChange", this.oData);
      }
      
    },
    blurInput() {
      setTimeout(() => {
        this.showSearch = false;
        this.$emit("blurInput", this.oData);
      }, 140)
      
    },
    itemClick(item) {
      console.log(item)
      this.$emit("itemValue", item);
      this.oData = item[this.optionName];
      //this.showSearch = false;
    },
    onScroll(event) {
      let _scrollTop = event.target.scrollTop;
      let _offsetHeight = event.target.offsetHeight;
      let _scrollHeight = event.target.scrollHeight;
      if (_scrollTop + _offsetHeight >= _scrollHeight) {
        this.$emit("comScroll", true);
      } else {
        this.$emit("comScroll", false);
      }
    },
    setValue(val = '') {
      this.oData = val;
    },
    clearValue() {
      this.setValue()
      this.$emit('clearValue')
    }
  },
  watch: {
    oData(data) {
      this.$emit("dataChange", this.oData);
      this.$refs.oScroll.scrollTop = 0;
    },
    showBox(val) {
      /*document.addEventListener("click", e => {
        if (!this.$el.contains(e.target)) this.showBox = false;
      });*/
      document.addEventListener('click', (e) => {
          let _select = this.$refs.select;
          if(_select && !_select.contains(e.target))  this.showBox = false           
      })
      let modal = document.getElementsByClassName('modal-content')[1]
      if(modal) {
        modal.onclick = (e) => {
          let _select = this.$refs.select;
          if(_select && !_select.contains(e.target)) {
            this.showBox = false  
          }
      }
      }
    },
    // 组件外传 valueObj, 一个是code值, 一个是这个code的name
    // 前提是组件不是用户点击再加载的 
    // => 注: (想了一下 这种方法还是行不通的, datalist里面的数据并不是全部数据,只有默认的十条,所以并不能准确的找到对应code的name值)
    valueObj(val) {
      if(val) {
        for(let i = 0; i < this.dataList.length; i++) {
          if(val.code === this.dataList[i][val.codeName]) {
            this.oData = this.dataList[i][this.optionName];
          }
        }
      }
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
</style>
