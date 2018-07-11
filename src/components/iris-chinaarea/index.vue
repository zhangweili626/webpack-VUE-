<template>
    <div class="wrap-chinaara">
      <div @click="inputClick">
        <b-form-input :value="text" :state="eorror ? 'invalid' : null"  readonly/> 
      </div>
      <div class="clear" v-if="data.text && clear && !readonly" @click="clearClick()">x</div>      
      <div class="external-box-chinaara" v-show="areaShow">
        <ul class="list-wrap-chinaara">
            <item  :dataArray="firstFloor" :data='item'  v-for='(item,index) in firstFloor' :key="index" :load="firstFloorClick"></item>
        </ul>    
        <div class="text-right">
            <button type="button" class=" btn btn-primary btn-sm pull-right mr-3 br-50%" @click="confirm">确定</button>
        </div> 
      </div>
    </div>
</template>
<script>
/**
 *    date : 2018-03-12 
 * @author : joly.Pan
 * @prop : 
 * readonly 默认false  不禁用
 * value 设置默认值 示列：{text:"上海市"，value:"00001"}
 * eorror  true的话会提示红框
 * clear   true的话会显示清除按钮
 * @event :  checkChange (value) 
 * value  返回选择的数据 示列：{text:"上海市"，value:"00001"}
 */            
import api from "../../common/api";
import item from "./list-item"
import treeapi from "./treeapi";
export default {
  model:{
    prop: 'text',
    event: 'textChange',
  },
  props: {
    text:{
      type:String,
      default:""
    },
    readonly:{
      type:Boolean,
      default:false
    },
    value:{
      type:Object,
      default:function(){
        return null
      }
    },
    eorror:{
      type:Boolean,
      default:false
    },
    clear:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      areaShow:false,//控制列表区域是否显示
      firstFloor:[],//第一层数据
      data:{},
    };
  },
  components: {
    item
  },
  methods: {
    //input框呗点击的时候触发
  inputClick(){
    const _this = this;
    //让列表框显示隐藏状态切换
    if(!_this.readonly){
       _this.areaShow = !_this.areaShow;
    }
  },
  clearClick(){
    const _this = this;
    _this.data = {} 
  },
  firstFloorClick(data,resolve){
    const _this = this;    
    _this.data  = data
    _this.$emit('textChange',_this.data.text)    
    if(!data.open){
        //折叠状态需要打开
        treeapi.getchinaarea({
          levels:parseInt(data.levels)+1,
          fatherAreaCode:data.value
        },(msg)=>{
          if(msg.length ==0){
            data.nodata = true
            data.open = true                                    
          }else{
            for (let i = 0; i < msg.length; i++) {
              _this.$set(data.children,i,msg[i])
            }
            data.open = true
          }
          resolve(data)          
        })
      }else{
        //打开状态需要折叠        
        data.children = []  
        data.open = false    
        resolve(data)            
      }
  },
  confirm(){
    const _this = this;
    _this.inputClick()
    let data = _this.firstFloor;
    let checkData = _this.data;
    let parentNode = [];
    let node = null;
    function getNode(json, nodeId) {
            //1.第一层 root 深度遍历整个JSON
      for (var i = 0; i < json.length; i++) {
          //找到子节点直接结束for
          if (node) {
              break;
          }
          var obj = json[i];
          //没有节点就下一个for
          if (!obj || !obj.value) {
              continue;
          }
          //2.有节点就开始找，一直递归下去
          if (obj.value == nodeId) {
              //找到了与nodeId匹配的节点，结束递归
              node = obj;
              break;
          } else {
              //3.如果有子节点就开始找
              if (obj.children.length!==0) {
                  //4.递归前，记录当前节点，作为parent父亲
                  parentNode.push({
                    value:obj.value,
                    text:obj.text,
                    levels:obj.levels,
                    children:obj.children
                  });
                  //递归往下找
                  getNode(obj.children, nodeId);
              } else {
                  //跳出当前循环，进行下一次递归
                  continue;
              }
          }
      }
      //5.没有找到匹配的子节点，那也就没有父节点没有，删除父节点
      if (!node) {
          parentNode.splice(parentNode.length-1,1);
      }
      //6.返回结果obj
      return {
          parentNode: parentNode,
          node: {
            value:node && node.value,
            text:node && node.text,
            levels:node && node.levels,
            children:node && node.children
          }
      };
    }
    // console.log(getNode(data,checkData.value))
    _this.$emit('check-change',getNode(data,checkData.value))
  },
  viewScroll(event) {
        // let divscroll = event.target
        // var wholeHeight = divscroll.scrollHeight;
        // var scrollTop = divscroll.scrollTop;
        // var divHeight = divscroll.clientHeight;
        // if(scrollTop + divHeight >= wholeHeight){
        //     alert('滚动到底部了！');  
        // }
        // if(scrollTop == 0){
        //     alert('滚动到头部了！');
        // }
    },
  },
  mounted () {
    const _this = this;
    treeapi.getchinaarea({
        levels:1
    },(msg)=>{
      _this.firstFloor = msg
    })
  },
  watch:{
    value:function(){
      const _this = this;
      if(_this.value){
        _this.data = _this.value
      }
    }
  }
};
</script>

<style scoped>
.wrap-chinaara{
  position: relative;
}
.external-box-chinaara{
  position:absolute;
  left: 0;
  width: 100%;
  margin-top: 5px;
  box-shadow: 0 6px 8px 0 rgba(155, 155, 155 ,.8);  
  z-index: 1;
  background-color:#fff;
}
.list-wrap-chinaara{
  padding-left: 0;
  padding-top: 5px;
  overflow-y: auto;  
  height: 200px;  
}
.list-wrap-chinaara li {
  text-align:left;
  background-color: #fff;
}
#app .main .list-wrap-chinaara li a{
  display: block;
  text-decoration:none;
  color: black;
  width:100%;
  height:100%;  
  padding:5px 0;  
  padding-left: 12px;      
}
#app .main .list-wrap-chinaara li a:hover{
  background-color: #e4e8f1;
}
.icon-chinaarea{
  margin-right:5px;
}
#app .main  .list-wrap-chinaara li .list-wrap-chinaara li a {
  padding-left: 32px; 
}
#app .main  .list-wrap-chinaara li .list-wrap-chinaara li .list-wrap-chinaara li a{
  padding-left: 48px; 
}
#app .main  .list-wrap-chinaara li .list-wrap-chinaara li .list-wrap-chinaara li .list-wrap-chinaara li a{
  padding-left: 60px;   
} 
.visibility{
  visibility:hidden;
}
.clear {
    position: absolute;
    top: 8px;
    right: 14px;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    color: #fff;
    text-align: center;
    line-height: 18px;
    cursor: pointer;
}
</style>
