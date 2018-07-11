<template>
    <div class="row"> 
         <div class="col-md-12" v-show="isDisabled">
           <b-form-input v-model="skuName" disabled/>
        </div>
        <div class="col-md-12" v-show="!isDisabled">
           <search
                class="text-left"
                ref="search"
                :hasCheck="required"
                :dataList="dataList"
                option="skuName"
                @dataChange="querySelect"
                @itemValue="itemValue"
                @clickShowBack="firstLoad"
                @comScroll="comScroll">
                </search>
        </div>
    </div>
</template>
<script>

import config from 'common/config'
import api from 'common/api'
import Vue from 'vue'
import search from 'components/iris-search/search.vue'

export default {
    components:{
        search
    },
    props:{
        skuName:{
            type: String,
            default: function() {
                return '';
            }
        },
        params: {
            type: Object,
            default: function() {
                return { matchCarFlag: '1',onOffFlag:1};
            }
        },  
        isDisabled:{
            type: Boolean,
            default: function() {
                return false;
            }
        } 
    },
    data() {
        return {
            dataList: [], 
            selectParams: {
                onOffFlag: '1',
                 matchCarFlag: '1',
                skuType: 'goodsTypeGood',
                pageNums: config.pageNums,
                pageStart: 1
            },
            required: false,
            isforbidden: false,     
            isLastPage:''          
        }
    },
    computed: {
       
    },
    methods: {
       // 搜索框内值改变   触发搜索
        querySelect(data) {
            const _this = this
            _this.selectParams.pageStart = 1;
            _this.selectParams.skuName = data;
            let params = _this.selectParams;
            _this.getSkuName(params, function(res) {
                _this.isLastPage = res.isLastPage
                _this.dataList = res.list
            })
        },
        // skuName选中某一项
        itemValue(value) {			
           this.$emit('getValue', value)
                  
        },
        // 第一次加载skuName数据
        firstLoad() {
            const _this = this
            if(_this.dataList.length != 0 ){
                return
            }
            let params = _this.selectParams
            _this.getSkuName(params, function(res) {
                _this.isLastPage = res.isLastPage
                _this.dataList = res.list
            })
        },
        // skuName滚动加载
        comScroll(isEnd) {
            if (isEnd && !this.isLastPage) {
                this.selectParams.pageStart ++
                let params = this.selectParams;
                this.getSkuName(params, obj => {
                    this.isLastPage = obj.isLastPage;
                    if(obj.list) {
                        this.dataList = this.dataList.concat(obj.list);
                    }
                });
            }
        },
        // 定义向后台请求skuName的方法
        getSkuName(params,callback) {
            api.skuData.getInfo(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },
        // 清楚数据
        clear() {
            this.skuName = '';
            this.$refs.search.clearValue();
        }
    },
    watch: {       
       
    }
}
</script>
<style lang="css" scoped>

</style>
