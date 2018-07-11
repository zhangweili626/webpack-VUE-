<template>
<div class="row">
    <!-- 自费 -->
    <div class="col-md-6">
        <b-form-select v-model="params.accountTypeCode" :options="_accountTypeList" :disabled="disabled" v-if="params.accountTypeCode != 'CountingCard'">
        </b-form-select>
        <b-form-select v-model="params.accountTypeCode" :options="accountTypeList" disabled v-if="params.accountTypeCode == 'CountingCard'">
        </b-form-select>
    </div>
    <div class="col-md-6">
        <!-- 厂家付费 -->
        <search
            v-show="params.accountTypeCode == 'factoryPay'"
            ref="factory"
            :disabled="disabled"
            :dataList="factoryList"
            option="factoryName"
            @dataChange="facQuerySelect"
            @itemValue="facItemClick"
            @clickShowBack="facFirstLoad"
            @clearValue="clearValue"
            @comScroll="facScrollBottom">
        </search>
        <!-- 保险公司 -->
        <search
            v-show="params.accountTypeCode == 'InsuranceCompanyPay'"
            ref="com"
            :disabled="disabled"
            :dataList="comList"
            option="coName"
            @dataChange="querySelect"
            @itemValue="itemClick"
            @clickShowBack="firstLoad"
            @clearValue="clearValue"
            @comScroll="scrollBottom">
        </search>
        <!-- 内部结算 -->
        <org-tree 
            v-if="params.accountTypeCode == 'dealerPay'"
            :disabled="disabled"
            :params="orgParams" 
            :orgCode="orgCode" 
            @getOrgCode="getOrg">
        </org-tree>	
        <!-- :params='{code:data.item.applyOrgCode,orgName:data.item.applyOrgName}'> -->
    </div>
    <!-- 计次卡, 劵兑换, 卷折让 -->
   
</div>   
</template>
<script>

const SELF_PAY = 'selfPay'
const FACTORY_PAY = 'factoryPay'
const INSURANCE_COMPANY = 'InsuranceCompanyPay'
const INSIDE_PAY = 'dealerPay'
const COUNT_CARD = 'countCard'

/**
 * create by lwx on 2018/06/14 12:18
 * 
 * 1. 自费, 计次卡, 卷兑换, 卷折让 => 组件抛出当前选中记账类型编码
 * 2. 厂家付费, 保险公司, 内部结算 => 组件抛出当前选中记账类型编码, 以及对账方编码( reconciliationTargetCode ), 名称( reconciliationTargetName ) 
 * 
 * event: getReconciliationTarget
 */

import Search from 'components/iris-search/search'
import OrgTree from 'views/staff/orgTree'

import config from 'common/config'
import api from 'common/api'
// import { getType } from 'common/api-common'
// import { ACCOUNT_TYPE } from 'common/ref-code'

export default {
    props: {
        preIndex: {
            type: Number,
            default: 0
        },
        index: {
            type: Number,
            default: 0
        },
        accountTypeList: {
            type: Array
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Search,
        OrgTree
    },
    data() {
        return {
            params: {
                accountTypeCode: 'selfPay',
                reconciliationTargetCode: '',
                reconciliationTargetName: ''
            },
            // 占时前端写死, 后续拿数据字典
            // accountTypeList: [
            //     {text: '自费', value: 'selfPay'},
            //     {text: '厂家付费', value: 'factoryPay'},
            //     {text: '保险公司', value: 'InsuranceCompanyPay'},
            //     {text: '内部结算', value: 'dealerPay'},
            //     // {text: '计次卡', value: 'countCard'},                
            // ],
            // 厂家
            factoryList: [],
            facSelectParams: {
                pageNums: config.pageNums,
                pageStart: 1
            },
            facIsLastPage: false,

            // 保险公司
            comList: [],
            selectParams: {
                pageNums: config.pageNums,
                pageStart: 1
            },
            isLastPage: false,

            // 组织
            orgParams: {
                orgName: ''
            }
        }
    },
    computed: {
        userInfo() {
            return JSON.parse(sessionStorage.getItem("userInfo"))
        },
        orgCode() {
            return this.userInfo.empVo.orgCode
        },
        _accountTypeList() {
            let arr = []
            this.accountTypeList.forEach(item => {
                if(item.value != 'CountingCard') {
                    arr.push(item)
                }
            })
            return arr
        }
    },
    methods: {
        // 厂家搜索
        facFirstLoad() {
            if(this.facSelectParams.factoryName) {
                delete this.facSelectParams.factoryName;
            }else if(this.factoryList.length !== 0) {
                return;
            }
            let params = this.facSelectParams;    
            this.queryFacInfo(params, obj => {
                this.facIsLastPage = obj.isLastPage;                            
                this.factoryList = obj.list;
            });
        },
        facQuerySelect(data) {
            this.facSelectParams.pageStart = 1;
            this.facSelectParams.factoryName = data;
            let params = this.facSelectParams;        
            this.queryFacInfo(params, obj => {
                this.facIsLastPage = obj.isLastPage;            
                this.factoryList = obj.list;
            });
        },
        facItemClick(item) {
            this.params.reconciliationTargetCode = item.factoryCode
            this.params.reconciliationTargetName = item.factoryName
            this.$emit('getValue', this.params, this.index, this.preIndex)            
        },
        facScrollBottom(isEnd) {
            if (isEnd && !this.facIsLastPage) {
                this.facSelectParams.pageStart ++
                let params = this.facSelectParams;        
                this.queryFacInfo(params, obj => {
                    this.facIsLastPage = obj.isLastPage;
                    this.factoryList = this.factoryList.concat(obj.list);
                });
            }
        },
        queryFacInfo(params, callback) {
            api.factory.queryFactoryInfo(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },
        // 保险公司搜索
        clearValue() {
            this.params.reconciliationTargetCode = ''
            this.params.reconciliationTargetName = ''
        },
        firstLoad() {
            if(this.selectParams.coName) {
                delete this.selectParams.coName;
            }else if(this.comList.length !== 0) {
                return;
            }
            let params = this.selectParams;    
            this.queryComInfo(params, obj => {
                this.isLastPage = obj.isLastPage;                            
                this.comList = obj.list;
            });
        },
        querySelect(data) {
            this.selectParams.pageStart = 1;
            this.selectParams.coName = data;
            let params = this.selectParams;        
            this.queryComInfo(params, obj => {
                this.isLastPage = obj.isLastPage;            
                this.comList = obj.list;
            });
        },
        itemClick(item) {
            this.params.reconciliationTargetCode = item.coCode
            this.params.reconciliationTargetName = item.coName
            this.$emit('getValue', this.params, this.index, this.preIndex)                
        },
        scrollBottom(isEnd) {
            if (isEnd && !this.isLastPage) {
                this.selectParams.pageStart ++
                let params = this.selectParams;        
                this.queryComInfo(params, obj => {
                    this.isLastPage = obj.isLastPage;
                    this.comList = this.comList.concat(obj.list);
                });
            }
        },
        queryComInfo(params, callback) {
            api.mancar.queryCompanyInfoByCodesAndPagination(params, res => {
                if (res.data.code === "success") {
                    let obj = res.data.obj;
                    callback(obj);
                }
            })
        },
        // 组织
        getOrg(item) {
            this.params.reconciliationTargetCode = item.code
            this.params.reconciliationTargetName = item.name
            this.$emit('getValue', this.params, this.index, this.preIndex)            
        },
        setValue(info) {
            for(let key in this.params) {
                this.params[key] = info[key]
            }
            if(this.params.accountTypeCode == 'factoryPay') {
                this.$nextTick(() => {
                    this.$refs.factory.setValue(this.params.reconciliationTargetName)
                })
            }else if(this.params.accountTypeCode == 'InsuranceCompanyPay') {
                this.$nextTick(() => {
                    this.$refs.com.setValue(this.params.reconciliationTargetName)
                })
            }else if(this.params.accountTypeCode == 'dealerPay') {
                this.$nextTick(() => {
                    this.orgParams.orgName = this.params.reconciliationTargetName
                })
            }
        }
    },
    watch: {
        'params.accountTypeCode'(val) {
            if(val == 'normalSale') {
                this.params.reconciliationTargetCode = ''
                this.params.reconciliationTargetName = ''
                this.$emit('getValue', this.params, this.index, this.preIndex)
                this.$nextTick(() => {
                    this.$refs.com.setValue()
                    this.$refs.factory.setValue()                    
                })
            }else if(val === 'factoryPay') {
                this.$nextTick(() => {
                    this.$refs.com.setValue()
                })
            }else if(val === 'InsuranceCompanyPay') {
                this.$nextTick(() => {
                    this.$refs.factory.setValue()
                })
            }
        }
    }
}
</script>
