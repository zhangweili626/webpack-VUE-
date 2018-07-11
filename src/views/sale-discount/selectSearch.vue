<template>
    <div class="row"> 
         <div class="col-md-12" v-show="isDisabled">
           <b-form-input v-model="itemName" disabled/>
        </div>
        <div class="col-md-12" v-show="!isDisabled">
           <search
                class="text-left"
                ref="search"
                :hasCheck="required"
                :dataList="dataList"
                :option="name1"
                @dataChange="querySelect"
                @clearValue="itemValue"
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

// 选择完触发事件getValue
export default {
    components:{
        search
    },
    props:{
        // 接口名 如：skuData.getInfo
        apiName:{
            type: String,
            default: function() {
                return 'skuData.getInfo';
            }
        },
        // 搜索值得key 如skuName
        name1:{
            type: String,
            default: function() {
                return 'skuName';
            }
        },
        // 搜索值得key 如skuName
        name2:{
            type: String,
            default: function() {
                return 'skuName';
            }
        },
        // 附加搜索参数
        params: {
            type: Object,
            default: function() {
                return {};
            }
        },  
        // 是否禁用
        isDisabled:{
            type: Boolean,
            default: function() {
                return false;
            }
        },
        onoffV: {
           type: Boolean,
            default: function() {
                return false;
            }
        },
        onoffEmp: {
           type: Boolean,
            default: function() {
                return false;
            }
        },
    },
    data() {
        return {
            dataList: [], 
            selectParams: {
                pageNums: config.pageNums,
                pageStart: 1
            },
            itemName: '',
            required: false,
            isforbidden: false,     
            isLastPage:'',        
        }
    },
    computed: {
       
    },
    methods: {
       // 搜索框内值改变   触发搜索
        querySelect(data) {
            const _this = this
            _this.selectParams.pageStart = 1;
            _this.selectParams[this.name1] = data;
            if(this.name2 !== 'skuName') {
                _this.selectParams[this.name2] = data;
            }
            let params = _this.selectParams;
            _this.getSkuName(params, function(res) {
                _this.isLastPage = res.isLastPage
                _this.dataList = res.list
            })
        },
        // 选中某一项
        itemValue(value) {	
           if(value === undefined) {
               value = {};
           }	
           this.$emit('getValue', value);                
        },
        // 第一次加载数据
        firstLoad() {
            const _this = this;
            let params = _this.selectParams
            params.pageStart = 1;
            _this.getSkuName(params, function(res) {
                _this.isLastPage = res.isLastPage
                _this.dataList = res.list
            })
        },
        // 滚动加载
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
        // 定义向后台请求的方法
        getSkuName(params,callback) {
            let param = Object.assign(params, this.params)
            if(this.onoffV && param.postTypeCode === ''){     
                this.dataList = [];        
                return;
            }
            if(this.onoffEmp && param.postCode === ''){     
                this.dataList = [];        
                return;
            }
            let arrPropt = this.apiName.split('.');
            api[arrPropt[0]][arrPropt[1]](param, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },
        // 清楚数据
        clear() {
            this.itemName = '';
            this.$refs.search.clearValue();
        },
        setVal(val) {
            this.$refs.search.setValue(val);
            this.itemName = val;
        }
    },
    watch: {       
       
    }
}
</script>
<style lang="css" scoped>

</style>
