<template>
      <li>
        <a href="javascript:;" @click="listItemClick(data,dataArray)">
          <span class="icon-chinaarea el-tree-node__expand-icon" :class="{expanded:data.open,visibility:data.nodata}">
          </span>
          {{data.text}}
        </a>
          <ul class="list-wrap-chinaara" v-if="data.open">        
            <item  :dataArray="data.children" :data='item' v-for='(item,index) in data.children' :key="index" :load="load"></item>            
          </ul>
      </li>
</template>
<script>
/**
 *    date : 2018-03-12 
 * @author : joly.Pan
 * @prop :
 * 
 * @event :  
 */            
import api from "../../common/api";
import treeapi from "./treeapi";
export default {
  name: 'item',
  props: {
    data:{
      type:Object,
      dafault:function(){
        return {}
      }
    },
    dataArray:{
      type:Array,
      dafault:function(){
        return []
      }
    },
    load:{
      type:Function,
      dafault:function(){
        return function(){

        }
      }
    }
  },
  data() {
    return {
    };
  },
  methods: {
    listItemClick(data,dataArr){
      const _this = this;
      if(!data.open){
        for (let i = 0; i < dataArr.length; i++) {
          _this.$set(dataArr[i],'open',false)
        }
      }
      _this.load(data,(msg)=>{
        data =  JSON.parse(JSON.stringify(msg))
      })
    },
  },
};
</script>

<style >
.list-wrap-chinaara{
  padding-left: 0;
}
.list-wrap-chinaara li {
  text-align:left;
  background-color: #fff;
}
#app .main  .list-wrap-chinaara li a{
  display: block;
  text-decoration:none;
  color: black;
  width:100%;
  height:100%;  
  padding:5px 0;  
  padding-left: 12px;      
}
#app .main  .list-wrap-chinaara li a:hover{
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
.selectedState{
   background-color: #edf7ff;
}
</style>
