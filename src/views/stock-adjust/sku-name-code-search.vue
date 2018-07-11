<template>
<div class="row">
    <div class="col-md-6">
        <b-form-fieldset horizontal label="服务名称" :label-cols="4" class="text-right">
            <div class="text-left">
                <search
                    ref="search"
                    :dataList="datalist"
                    option="serviceName"
                    @dataChange="querySelect"
                    @itemValue="itemClick"
                    @clickShowBack="firstLoad"
                    @clearValue="clearValue"
                    @comScroll="scrollBottom">
                </search>
            </div>
        </b-form-fieldset>
    </div>
    <div class="col-md-6">
        <b-form-fieldset horizontal label="服务编码" :label-cols="4" class="text-right">
            <div class="text-left">
                <search
                    ref="codeSearch"
                    :dataList="codeDatalist"
                    option="serviceCode"
                    @dataChange="codeQuerySelect"
                    @itemValue="codeItemClick"
                    @clickShowBack="codeFirstLoad"
                    @clearValue="codeClearValue"
                    @comScroll="codeScrollBottom">
                </search>
            </div>
        </b-form-fieldset>
    </div>
</div>
</template>
<script>

import Search from 'components/iris-search/search'

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
            isLastPage: false,

            codeDatalist: [],
            codeSelectParams: {
                pageNums: config.pageNums,
                pageStart: 1
            },
            codeIsLastPage: false,
        }
    },
    methods: {
        clearValue() {
			this.mainInfo = {}
            this.$refs.codeSearch.setValue()
        },
        firstLoad() {
            if(this.selectParams.serviceName) {
                delete this.selectParams.serviceName;
            }else if(this.datalist.length !== 0) {
                return;
            }
            let params = this.selectParams;        
            this.querySerInfo(params, obj => {
                this.datalist = obj.list;
            });
        },
        querySelect(data) {
            this.selectParams.pageStart = 1;
            this.selectParams.serviceName = data;
            let params = this.selectParams;        
            this.querySerInfo(params, obj => {
                this.isLastPage = obj.isLastPage;            
                this.datalist = obj.list;
            });
        },
        itemClick(item) {
            this.mainInfo = {
                serviceCode: item.serviceCode,
                serviceName: item.serviceName
            }
            this.$refs.codeSearch.setValue(item.serviceCode)
        },
        scrollBottom(isEnd) {
            if (isEnd && !this.isLastPage) {
                this.selectParams.pageStart ++
                let params = this.selectParams;        
                this.querySerInfo(params, obj => {
                    this.isLastPage = obj.isLastPage;
                    this.datalist = this.datalist.concat(obj.list);
                });
            }
        },
        querySerInfo(params, callback) {
            api.serviceitem.queryByPage(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            });
        },

        // code
        codeClearValue() {
            this.mainInfo = {}
            this.$refs.search.setValue()
        },
        codeFirstLoad() {
            if(this.codeSelectParams.serviceCode) {
                delete this.codeSelectParams.serviceCode;
            }else if(this.codeDatalist.length !== 0) {
                return;
            }
            let params = this.codeSelectParams;        
            this.querySerInfo(params, obj => {
                this.codeDatalist = obj.list;
            });
        },
        codeQuerySelect(data) {
            this.codeSelectParams.pageStart = 1;
            this.codeSelectParams.serviceCode = data;
            let params = this.codeSelectParams;        
            this.querySerInfo(params, obj => {
                this.codeIsLastPage = obj.isLastPage;            
                this.codeDatalist = obj.list;
            });
        },
        codeItemClick(item) {
            this.mainInfo = {
                serviceCode: item.serviceCode,
                serviceName: item.serviceName
            }
            this.$refs.search.setValue(item.serviceName)
        },
        codeScrollBottom(isEnd) {
            if (isEnd && !this.isLastPage) {
                this.codeSelectParams.pageStart ++
                let params = this.codeSelectParams;        
                this.querySerInfo(params, obj => {
                    this.codeIsLastPage = obj.isLastPage;
                    this.codeDatalist = this.codeDatalist.concat(obj.list);
                });
            }
        },
    }
}
</script>

