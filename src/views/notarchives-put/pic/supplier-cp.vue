<template>
    <div>
        <b-form-fieldset horizontal label="供应商" :label-cols="3" class="text-right">
            <div class="text-left">
                <search
                    ref="search"
                    :dataList="datalist"
                    @clearValue="clearValue"
                    option="supplierName"
                    @dataChange="querySelect"
                    @itemValue="itemClick"
                    @clickShowBack="firstLoad"
                    @comScroll="scrollBottom">
                </search>
            </div>
        </b-form-fieldset>
    </div>
</template>
<script>
    import { Tree } from 'element-ui'
    import api from 'common/api'
    import config from 'common/config'
    import Search from "components/iris-search/search";
    import {Message} from "element-ui";
    export default {
        components: {
            Search
        },
        data() {
            return {
                datalist: [],
                selectParams: {
                    pageNums: config.pageNums,
                    pageStart: 1
                },
                supplierCode:'',
                isLastPage: false
            }
        },
        methods:{
           // 供应商名称 - 下拉搜索
            firstLoad() {
                if(this.selectParams.warehouseName) {
                    delete this.selectParams.warehouseName;
                }else if(this.datalist.length !== 0) {
                    return;
                }
                let params = this.selectParams;        
                this.queryWhInfo(params, obj => {
                    this.isLastPage = obj.isLastPage;                
                    this.datalist = obj.list;
                });
            },
            clearValue() {
                this.$emit("clearValue");
            },
            querySelect(data) {
                this.selectParams.pageStart = 1;
                this.selectParams.supplierName = data;
                let params = this.selectParams;    
                this.queryWhInfo(params, obj => {
                    this.isLastPage = obj.isLastPage;            
                    this.datalist = obj.list;
                });
            },
            queryWhInfo(params, callback) {
                params.supplyType = 1;
                api.statementAccount.querySupplierInfo(params, res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        callback(obj);
                    }
                });
            },
            itemClick(item) {
                this.$emit("supVal", item.supplierCode);
            },
            scrollBottom(isEnd) {
                if (isEnd && !this.isLastPage) {
                    this.selectParams.pageStart ++
                    let params = this.selectParams;        
                    this.queryWhInfo(params, obj => {
                        this.isLastPage = obj.isLastPage;
                        this.datalist = this.datalist.concat(obj.list);
                    });
                }
            }
        }
    }
</script>

