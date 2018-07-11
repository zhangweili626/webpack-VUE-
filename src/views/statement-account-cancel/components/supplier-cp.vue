<template>
    <div>
        <b-form-fieldset horizontal label="供货方" :label-cols="4" class="text-right">
            <div class="text-left">
                <search
                    ref="search"
                    :dataList="datalist"
                    @clearValue="clearValue"
                    option="supplierName"
                    @dataChange="querySelect"
                    @itemValue="itemClick"
                    @clickShowBack="firstLoad"
                    @comScroll="scrollBottom"
                    :disabled="readOnly">
                </search>
            </div>
        </b-form-fieldset>
    </div>
</template>
<script>
    import api from 'common/api'
    import config from 'common/config'
    import Search from "components/iris-search/search";
    //私有组件
    import Bus from '../bus/bus.js'
    export default {
        components: {
            Search
        },
        props:{
            readOnly:{
                type: Boolean,
                default:false
            }
        },
        data() {
            return {
                disabled:false,
                datalist: [],
                selectParams: {
                    pageNums: config.pageNums,
                    pageStart: 1
                },
                supplierCode:'',
                isLastPage: false
            }
        },
        created(){
            Bus.$on('clearValueSupplier', () => {
                this.$refs.search.setValue('')
            })
            Bus.$on('setSupplierCodeValue', (data) => {
                if(this.$refs.search){
                    this.$refs.search.setValue(data);
                }
            });
            Bus.$on('disabledSup', (data) => {
                if(!(data == '')){
                    this.disabled = true;
                }
            })
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
                api.statementAccount.querySupplierInfo(params, res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        callback(obj);
                    }
                });
            },
            itemClick(item) {
                Bus.$emit('supplier', item)
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

