<template>
    <div class="row">
        <div class="col-md-12">
            <b-card header="查询">
                <div class="row">
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="自采单号" :label-cols="4" class="text-right">
                            <b-form-input  v-model.trim="queryParams.spoOrderNo" />
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="收货地址 ( 仓库 )" :label-cols="4" class="text-right">
                            <div class="text-left">
                                <search
                                    ref="search"
                                    :dataList="datalist"
                                    option="warehouseName"
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
                        <b-form-fieldset horizontal label="到货处理状态 *" :label-cols="4" class="text-right">
                            <b-form-select v-model="queryParams.orderStatus" :options="statusOptions">
                            </b-form-select>
                        </b-form-fieldset>
                    </div>
                </div>
                <query-btn-group @resetClick="reset" @query="query"></query-btn-group>
            </b-card>
        </div>
    </div>
</template>
<script>

import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import Search from "components/iris-search/search"

import { mapActions } from 'vuex'

import config from 'common/config'
import api from 'common/api'

export default {
    components: {
        QueryBtnGroup,
        Search
    },
    data() {
        return {
            // 查询参数
            queryParams: {
                storeCode: '',
                orderStatus: 2,
                whCode: '',
                pageNums: config.pageNums,
                pageStart: 1,
            },
            statusOptions: [
            	{text: '全部', value: ''},
                {text: '已处理', value: 3},
                {text: '未处理', value: 2},                
            ],
            // 下拉组件查询参数
            datalist: [],
            selectParams: {
                storeCode: '',
                pageNums: config.pageNums,
                pageStart: 1
            },
            isLastPage: false,
        }
    },
    computed: {
       storeInfoVo() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            return userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
        } 
    },
    mounted() {
       if(this.storeInfoVo) {
            this.queryParams.storeCode = this.storeInfoVo.storeCode
            this.selectParams.storeCode = this.storeInfoVo.storeCode
        }
    },
    methods: {
        query() {
            let arriveHandleParams = JSON.parse(JSON.stringify(this.queryParams))
            this.getArriveHandleInfo(arriveHandleParams)
        },
        reset() {
            this.queryParams = {
                storeCode:this.storeInfoVo.storeCode,
                orderStatus: 2,
                whCode: '',
                pageNums: config.pageNums,
                pageStart: 1,
            }
            this.$refs.search.setValue()
        },

        // 仓库名称 - 下拉搜索
        clearValue() {
            this.queryParams.whCode = '';
        },
        firstLoad() {
            if(this.selectParams.warehouseName) {
                delete this.selectParams.warehouseName;
            }else if(this.datalist.length !== 0) {
                return;
            }
            let params = this.selectParams;        
            this.queryWhInfo(params, obj => {
                this.datalist = obj.list;
            });
        },
        querySelect(data) {
            this.selectParams.pageStart = 1;
            this.selectParams.warehouseName = data;
            let params = this.selectParams;        
            this.queryWhInfo(params, obj => {
                this.isLastPage = obj.isLastPage;            
                this.datalist = obj.list;
            });
        },
        itemClick(item) {
            this.queryParams.whCode = item.warehouseCode;
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
        },
        queryWhInfo(params, callback) {
            api.warehouse.query(params).then(res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            });
        },

        ...mapActions('storeStation', [
            'getArriveHandleInfo'
        ])
    }
}
</script>

