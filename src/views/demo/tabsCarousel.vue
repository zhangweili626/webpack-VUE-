<template>
   <div class="tabs-carou-box" :style="{width: boxWdth + 'px'}">
       <div class="tabc tabc-left-arrow"  @click="next">
           <i class="tabc-left-arrow-img"></i>
        </div>
       <div class="tabc tabc-cotent"  ref="contbox">
           <ul :style="{width: itemList.length *74 + 4 + 'px'}">
               <li v-for="(item, index) in itemList" :key="index" :class="{'tabsc-active': activeIndex == index }" @click="seletItem(index, item)">
                  <p :title="item[itemName]" class="one-line-text"> {{item[itemName]}}</p>
                </li>
           </ul>
       </div>
       <div class="tabc tabc-right-arrow" @click="pre">
            <i class="tabc-right-arrow-img" ></i>
       </div>
   </div>
</template>
<script>
// boxWdth容器宽度 类型Number 默认 438 
// apiName请求接口名 类型String 如：skuData.getInfo
// addParam请求接口附加参数 类型Object
// itemCode 列表数据的code名 类型String 默认code；
// itemName 列表数据的展示名 类型String 默认name；
// seletCode 选中相应code的条目 类型String
// defautSeletIndex 如果没有seletCode，则选中相应索引 类型Number 默认0；
// 点击选中触发seletItem事件
import Vue from 'vue'
import api from "common/api";
import config from "common/config";   
import common from "common/common.js"
import collectionApi from 'common/api-collection.js'


export default {
    components: {
        
    },
    props: {
        addParam:{   
            type: Object,
            default: function(){
                return {};
            }
        },
        boxWdth: {
            type: Number,
            default: function(){
                return 438
            }
        },
        apiName: {
            type: String,
            default: function(){
                return "skuData.getInfo"
            }
        },
        itemCode:{
            type: String,
            default: function(){
                return "code"
            }
        },
        itemName:{
            type: String,
            default: function(){
                return "name"
            }
        },
        defautSeletIndex:{
            type: Number,
            default: function(){
                return 0;
            }
        },
        seletCode: {
            type: String,
            default: function(){
                return ""
            }
        }
    },
    data() {
        return {
            params:{
                 pageNums: config.pageNums,
            },
            itemList: [
                {name: '你好', code: 1},
                {name: '你好', code: 2},
                {name: '你好', code: 3},
                {name: '你好', code: 4},         
            ],
            scroll: '',
            scrollNum: 0,
            activeIndex: -1,
        }
    },
    created() {
       this._initData();
    },
    methods: {
       _initData() {
            let param = Object.assign({}, this.addParam)
            let arrPropt = this.apiName.split('.');
            api[arrPropt[0]][arrPropt[1]](param, res => {
                if (res.data.code === "success") {
                   this.itemList = res.data.obj.list;
                   this. setSlectItem();
                }
            })
        },
        next() { 
            let maxNum = this.itemList.length - 5;
            let currentScrollL = this.$refs.contbox.scrollLeft;
            if(currentScrollL > 70) {        
                let  timerNum = 0;
                let timer = setInterval(() => {
                    this.$refs.contbox.scrollLeft -= 4;
                    timerNum++;
                    if(timerNum >= 19) {
                        clearInterval(timer)
                    }
                }, 20)
            }      
        },
        pre() {
            let maxNum = this.itemList.length - 5;
            let currentScrollL = this.$refs.contbox.scrollLeft;
            if(currentScrollL < (maxNum)*70) {           
                let  timerNum = 0;
                let timer = setInterval(() => {
                    this.$refs.contbox.scrollLeft += 4;
                    timerNum++;
                    if(timerNum >= 19) {
                        clearInterval(timer)
                    }
                }, 20)
            }
        },
        seletItem(ind, val) {
            this.activeIndex = ind;
            this.$emit('seletItem', val);
        },
        setSlectItem() {
            if(this.seletCode !== '') {
                for(let i=0; i < this.itemList.length; i++ ){
                    if(this.itemList[i][this.itemCode] === this.seletCode) {
                        this.activeIndex = i;
                        this.$emit('seletItem', this.itemList[i]);
                        return;
                    }
                }
            }else {
                this.activeIndex = this.defautSeletIndex;
                this.$emit('seletItem', this.itemList[0]);
            }
            
        },
    },
    watch: {
        seletCode(val) {
            this.setSlectItem();
        }
    }
}
</script>
<style scoped> 
   .tabs-carou-box{
        display: flex;
        width: 438px;
        height: 72px;
        background-color: #4a9cd9;
        border-radius: 4px;
        flex-direction: row; 
   }
   .tabc{
        color: #fff;
        font-size: 20px;
   }
   .tabc-left-arrow{
        flex: 0 0 35px;   
        padding-top: 26px;
        padding-left: 8px;
        font-size: 20px;
   }
   .tabc-left-arrow-img{
       display: block;
       width: 20px;
       height: 20px;
       background-image: url(../../../static/image/arrow-circle-left.png);
       background-size: 100% 100%;
   }
   .tabc-cotent{
        flex: 1 1 auto;
        overflow: auto;
   }
    ::-webkit-scrollbar{height: 0;}
   .tabc-right-arrow{
        flex: 0 0 35px;   
        text-align: right;  
        padding-top: 26px;
        padding-left: 6px;
   }
   .tabc-right-arrow-img{
       display: block;
       width: 20px;
       height: 20px;
       background-image: url(../../../static/image/arrow-circle-right.png);
       background-size: 100% 100%;
   }
   .tabc-cotent ul{
        height: 100%;
        overflow: hidden;
        clear: both;
        list-style: none;
        padding: 0;
        margin: 0;
        font-size: 16px;
   }
   .tabc-cotent ul li{
        display: flex;
        height: 64px;
        width: 70px;
        border-radius: 8px;
        margin: 4px 2px;
        align-items: center;
        justify-content: center;
        float: left;
   }
   .tabsc-active{
        background-color: #92c6e8;
   }
   .one-line-text{
        margin: 0;
        white-space: nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
   }
</style>

