<template>
    <div class="showDetailBackground">
        <div class="myself-checkBox">
            <div class="myself-checkBox-tips"><span class="el-icon-warning"></span>每批次制卡总数不可超过10000张！</div>
            <input type="text" v-model="checkBoxValue" :readonly="hasMade" placeholder="搜索门店">
            <div class="myself-checkBox-search"><span class="el-icon-search"></span></div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="pull-right">
                    <b-button v-if="!hasMade" size="sm" variant="danger" @click="clear">清空</b-button>
                </div>
            </div>
        </div>
        <div class="table-scrollable">
            <b-table striped hover bordered show-empty :items="newcardlist" :fields="cardfields">
                <template slot="nums" slot-scope="data">
                    <b-form-input type="number" :readonly="hasMade || data.item.disabled" v-model="data.item.makeCount"/>
                </template>
                <template slot="detail" slot-scope="data">
                    <a href="javascript:;" v-if="data.item.hasMade" @click="showDetail(data.item.storeCode)">查看</a>
                </template>
                <template slot="empty">
                    暂无数据...
                </template>
            </b-table>
        </div>
        <b-modal id="modalPrevent"
                ref="modal"
                v-model="modelShow"
                size="lg"
                :hide-footer="true"
                :hide-header="true">
            <div class="controlCancelButton"><div class="cancelButton-my" @click="closeModel">×</div></div>
            <h4>门店名称: {{ modelStoreName }}</h4>
            <div class="numsTotal">
                <span>已制卡: {{ totalCard ? totalCard : 0 }}</span>
                <span>已作废: {{ deleteNums ? deleteNums : 0 }}</span>
                <span>已售: {{ saleNums ? saleNums : 0 }}</span>
                <span>未售: {{ unsaleNums ? unsaleNums : 0 }}</span>
            </div>
            <div class="table-scrollable controlfontsize">
                <b-table striped hover bordered show-empty :items="modellist" :fields="modelfields">
                    <template slot="cardExpireType" slot-scope="data">
                        {{ data.item.cardExpireType === 0 ? '固定时长' : '' }}
                        {{ data.item.cardExpireType === 1 ? '标定结束日期' : '' }}
                        {{ data.item.cardExpireType === -1 ? '储值卡无有效期' : '' }}
                    </template>
                    <template slot="cardStatus" slot-scope="data">
                        {{ data.item.cardStatus === 0 ? '未销售': '' }}
                        {{ data.item.cardStatus === 1 ? '挂售中': '' }}
                        {{ data.item.cardStatus === 2 ? '已销售': '' }}
                        {{ data.item.cardStatus === 8 ? '退卡中': '' }}
                        {{ data.item.cardStatus === 9 ? '已退卡': '' }}
                        {{ data.item.cardStatus === -1 ? '已作废': '' }}
                    </template>
                    <template slot="empty">
                        暂无数据...
                    </template>
                </b-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="pageChange" :page-no="page.pageNo" :page-size="page.pageSize" :total-result="page.totalResult" :total-pages="page.totalPages">
                 </pagination>
               </div>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import pagination from 'components/pagination/pagination.vue'
    import config from 'common/config.js'
    import api from 'common/api.js'
    import common from 'common/common.js'
    import { MessageBox, Message } from 'element-ui'
    export default {
        props: {
            showObj: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            cardTemplateCode: {
                type: String,
                default: ''
            },
            cardMakeOrderNo: {
                type: String,
                default: ''
            }
        },
        components: {
            pagination
        },
        data() {
            return {
                checkBoxValue: '',
                checkBoxOptions: [],
                selected: [],
                hasMade: false,
                modelStoreName: '',
                totalCard: '',
                deleteNums: '',
                saleNums: '',
                unsaleNums: '',
                newcardlist: [],
                tempNewcardlist: [],
                modelShow: false,
                modellist: [1],
                page: {},
                storeList: [],
                manInfo: '',
                storeCode: '',
                cardfields: {
                    storeCode: {
                        label: '门店编码'
                    },
                    storeName: {
                        label: '门店名称'
                    },
                    nums: {
                        label: '制作数量'
                    },
                    detail: {
                        label: '详情'
                    }
                },
                modelfields: {
                    cardMakeOrderNo: {
                        label: '批次号'
                    },
                    cardNo: {
                        label: '卡号'
                    },
                    cardName: {
                        label: '名称'
                    },
                    cardExpireType: {
                        label: '有效期类型'
                    },
                    cardUseTypeName: {
                        label: '使用方'
                    },
                    cardAmout: {
                        label: '面值'
                    },
                    startDateStr: {
                        label: '有效期起始时间'
                    },
                    endDateStr: {
                        label: '有效期结束时间'
                    },
                    effectiveDays: {
                        label: '有效期天数'
                    },
                    cardStatus: {
                        label: '卡状态'
                    },
                }
            }
        },
        methods: {
            searchInputClick() {
                const _this = this
                _this.newcardlist = []
                if(_this.checkBoxValue) { 
                    let tempArrOne = common.removeBlank(_this.checkBoxValue).split(' ')
                    let tempArrTwo = []
                    tempArrOne.forEach(element => {
                        if(element) {
                            tempArrTwo.push(element)
                        }
                    })
                    for(let i = 0; i< _this.tempNewcardlist.length; i++) {
                        let judge = true
                        let judgeStr = JSON.stringify(_this.tempNewcardlist[i])
                        for(let j = 0; j< tempArrTwo.length; j++) {
                            if(!judgeStr.includes(tempArrTwo[j])) {
                                judge = false
                            }
                        }
                        if(judge && !_this.tempNewcardlist[i].disabled) {
                            _this.newcardlist.push(_this.tempNewcardlist[i])
                        }
                    }
                    // for(let i = 0; i< _this.tempNewcardlist.length; i++) {
                    //     if(_this.tempNewcardlist[i].storeName.startsWith(_this.checkBoxValue) && _this.tempNewcardlist[i].disabled) {
                    //         _this.newcardlist.push(_this.tempNewcardlist[i])
                    //     }
                    // }
                    for(let i = 0; i< _this.tempNewcardlist.length; i++) {
                        let judge = true
                        let judgeStr = JSON.stringify(_this.tempNewcardlist[i])
                        for(let j = 0; j< tempArrTwo.length; j++) {
                            if(!judgeStr.includes(tempArrTwo[j])) {
                                judge = false
                            }
                        }
                        if(judge && _this.tempNewcardlist[i].disabled) {
                            _this.newcardlist.push(_this.tempNewcardlist[i])
                        }
                    }
                }else {
                    for(let i = 0; i< _this.tempNewcardlist.length; i++) {
                        if(!_this.tempNewcardlist[i].disabled) {
                            _this.newcardlist.push(_this.tempNewcardlist[i])
                        }
                    }
                    for(let i = 0; i< _this.tempNewcardlist.length; i++) {
                        if(_this.tempNewcardlist[i].disabled) {
                            _this.newcardlist.push(_this.tempNewcardlist[i])
                        }
                    }
                }
                
            },
            // 关闭模态框
            closeModel() {
                const _this = this
                _this.modelShow = false
            },
            // 制卡 
            makeCard() {
                const _this = this
                let tempArr = []
                _this.tempNewcardlist.forEach(element => {
                    if(element.makeCount) {
                        tempArr.push(element)
                    }
                })
                let option = {
                    cardMakeOrderNo: _this.cardMakeOrderNo,
                    cardTemplateCode: _this.cardTemplateCode,
                    hasTimestamp: _this.showObj.hasTimestamp,
                    cardPrefix: _this.showObj.cardPrefix,
                    cardMakeDetailInfoVoList: tempArr
                }
                for(let i = 0; i< option.cardMakeDetailInfoVoList.length; i++) {
                    if((option.cardMakeDetailInfoVoList[i].makeCount-0) < 0) {
                        Message({
                            type: 'warning',
                            message: '制卡数量不能为负数'
                        })
                        return
                    }
                }
                let judgeNums = 0
                for(let i = 0; i<option.cardMakeDetailInfoVoList.length; i++) {
                    if(option.cardMakeDetailInfoVoList[i].makeCount === undefined) {
                        option.cardMakeDetailInfoVoList[i].makeCount = 0
                    }
                    judgeNums+=(option.cardMakeDetailInfoVoList[i].makeCount - 0)
                }
                if(judgeNums>10000) {
                    Message({
                        type: 'warning',
                        message: '批次制卡总数量不能超过10000'
                    })
                    return;
                }
                let judgeEmpty = true
                for(let i = 0; i< option.cardMakeDetailInfoVoList.length; i++) {
                    if(option.cardMakeDetailInfoVoList[i].makeCount === undefined) {
                        option.cardMakeDetailInfoVoList[i].makeCount = 0
                    }
                    if((option.cardMakeDetailInfoVoList[i].makeCount-0) > 0) {
                        judgeEmpty = false
                        break;
                    }
                }
                if(judgeEmpty) {
                    Message({
                        type: 'warning',
                        message: '门店制卡数量全部为空或为零，不允许制卡'
                    })
                    return
                }
                for(let i = 0; i< option.cardMakeDetailInfoVoList.length; i++) {
                    if(Math.floor(option.cardMakeDetailInfoVoList[i].makeCount - 0) === (option.cardMakeDetailInfoVoList[i].makeCount - 0) ) {
                        
                    }else {
                        Message({
                            type: 'warning',
                            message: '门店制卡数量必须为整数'
                        })
                        return
                    }
                }

                let param = {
                    serviceCode: config.cardRelative.detailSeq,
                    getNums: option.cardMakeDetailInfoVoList.length
                }
                _this.manInfo = JSON.parse(common.getSession('userInfo'))
                option.makeEmpName = _this.manInfo.empVo.empCnName
                option.makeEmpCode = _this.manInfo.empVo.empCode
                option.makeOrgCode = _this.manInfo.empVo.orgCode
                option.makeOrgName = _this.manInfo.empVo.orgName
                api.ordinalInfo.getSequenceList(param, res => {
                    if(res.data.code === 'success') {
                        for(let i = 0; i<res.data.obj.length; i++) {
                            option.cardMakeDetailInfoVoList[i].cardMakeDetailCode = res.data.obj[i]
                            option.cardMakeDetailInfoVoList[i].cardMakeOrderNo = _this.cardMakeOrderNo
                            option.cardMakeDetailInfoVoList[i].cardTemplateCode = _this.cardTemplateCode
                        }
                        api.cardManage.makeCardPici(option, res => {
                            if(res.data.code === 'success') {
                                this.$emit('already-made', res)
                                this.hasMade = true
                                Message({
                                    type: 'info',
                                    message: '制卡成功'
                                })
                            }
                        })
                    }
                })
            },
            clear() {
                const _this = this
                _this.newcardlist.forEach(element => {
                    element.makeCount = 0
                })
            },
            // // 查询总量
            queryTotal() {
                const _this = this
                let option = {
                    cardTemplateCode: _this.cardTemplateCode,
                    storeCode: _this.storeCode
                }
                api.cardManage.queryTableTotal(option, res => {
                    if(res.data.code === 'success') {
                        _this.deleteNums = res.data.obj.cancelledCount
                        _this.totalCard = res.data.obj.makeCount
                        _this.saleNums = res.data.obj.soldCount
                        _this.unsaleNums = res.data.obj.didCount
                        _this.modelStoreName = res.data.obj.storeName
                    }
                })
            },
            // 查询
            query(arg) {
                const _this = this
                let option = {
                    cardTemplateCode: _this.cardTemplateCode,
                    storeCode: _this.storeCode,
                    pageStart: arg,
                    pageNums: config.pageNums
                }
                api.cardManage.queryTableList(option, res => {
                    if(res.data.code === 'success') {
                        _this.modellist = res.data.obj.list
                        let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        _this.page = tempPage
                    }
                })
            },
            // 换页
            pageChange(num) {
                const _this = this
                _this.query(num)
            },
            // 保存
            save() {

            },
            // 查看
            showDetail(code) {
                const _this = this
                _this.modelShow = true
                _this.storeCode = code
                _this.query(1)
                _this.queryTotal()
            },
            // 对新增页面进行新制卡门店赋值
            giveDataToNew() {
                const _this = this
                for(let i = 0; i< _this.storeList.length; i++) {
                    if(!_this.storeList[i].disabled) {
                        let obj = {}
                        obj.storeName = _this.storeList[i].storeName
                        obj.storeCode = _this.storeList[i].storeCode
                        obj.disabled = _this.storeList[i].disabled
                        obj.hasMade = _this.storeList[i].hasMade
                        _this.tempNewcardlist.push(obj)
                    }
                }
                for(let i = 0; i< _this.storeList.length; i++) {
                    if(_this.storeList[i].disabled) {
                        let obj = {}
                        obj.storeName = _this.storeList[i].storeName
                        obj.storeCode = _this.storeList[i].storeCode
                        obj.disabled = _this.storeList[i].disabled
                        obj.hasMade = _this.storeList[i].hasMade
                        _this.tempNewcardlist.push(obj)
                    }
                }
                _this.newcardlist = _this.tempNewcardlist
            },
            // 获取区域   并查询门店是否制卡
            getShouldAreaCard() {
                const _this = this
                let option = {
                    cardTemplateCode: _this.cardTemplateCode,
                    status: 0
                }
                api.carTemlate.queryShouldAreaCard(option, res => {
                    if(res.data.code === 'success') {
                        let arr = res.data.obj
                        if(arr) {
                            arr.forEach(element => {
                                let obj = {}
                                obj.storeName = element.storeName
                                obj.storeCode = element.storeCode
                                _this.storeList.push(obj)
                            })
                        }
                        let option = {
                            cardTemplateCode: _this.cardTemplateCode,
                            storeCodes: []
                        }
                        _this.storeList.forEach(element => {
                            option.storeCodes.push(element.storeCode)
                        })
                        api.cardManage.queryStoreStatus(option, res => {
                            if(res.data.code === 'success') {
                                for(let i = 0; i< _this.storeList.length; i++) {
                                    if(res.data.obj[_this.storeList[i].storeCode]) {
                                        _this.storeList[i].hasMade = true
                                    }else {
                                        _this.storeList[i].hasMade = false
                                    }
                                }
                                let sessionInfo = JSON.parse(common.getSession('userInfo'))
                                if(sessionInfo.userAvailableInfo) {
                                    if(sessionInfo.userAvailableInfo.availableType === '2') {
                                        _this.giveDataToNew() 
                                        return
                                    }else if(sessionInfo.userAvailableInfo.availableType === '0') {
                                        for(let i = 0; i< _this.storeList.length; i++) {
                                            if(_this.storeList[i].storeCode === sessionInfo.userAvailableInfo.storeInfoVo.storeCode) {
                                                _this.storeList[i].disabled = false
                                            }else {
                                                _this.storeList[i].disabled = true
                                            }
                                        }
                                        _this.giveDataToNew() 
                                    }else if(sessionInfo.userAvailableInfo.availableType === '1') {
                                        let option = {
                                                needPageFlag: '0',
                                                salesAreaCodes: [sessionInfo.userAvailableInfo.storeInfoVo.salesCode]
                                            }
                                        api.area.queryShopInfo(option, res => {
                                            if(res.data.code === 'success') {
                                                for(let j = 0; j < _this.storeList.length; j++) {
                                                    let storeJudge = false
                                                    for(let k = 0; k < res.data.obj.length; k++) {
                                                        if(_this.storeList[j].storeCode === res.data.obj[k].storeCode) {
                                                            storeJudge = true
                                                        }
                                                    }
                                                    if(storeJudge) {
                                                        _this.storeList[j].disabled = false
                                                    }else {
                                                        _this.storeList[j].disabled = true
                                                    }
                                                }
                                                _this.giveDataToNew()
                                            }
                                        })
                                    }
                                }else {
                                    _this.giveDataToNew()  
                                }
                            }
                        })                 
                    }
                })
            },
        },
        watch: {
            tempNewcardlist: {
                handler: function() {
                    let res = {}
                    res.data = {}
                    res.data.code = 'success'
                    res.data.fromStore = true
                    res.data.obj = {}
                    res.data.obj.createTimeStr = ''
                    res.data.obj.makeTotalCount = 0
                    this.tempNewcardlist.forEach(element => {
                        if(element.makeCount) {
                            res.data.obj.makeTotalCount += (element.makeCount - 0)
                        }
                    })
                    this.$emit('already-made', res)
                },
                deep: true
            },
            checkBoxValue: function(value) {
                const _this = this
                _this.searchInputClick()
            }
        },
        created() {
            const _this = this
            _this.getShouldAreaCard()
        }
    }
</script>
<style>
    .myself-checkBox-search {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 20px;
        height: 30px;
        line-height: 30px;
        width: 20px;
        cursor: pointer;
    }
    .delete-newcardlist {
        color: red !important;
    }
    .myself-checkBox {
        width: 30%;
        height: 30px;
        position: relative;
    }
    .myself-checkBox-tips {
        position: absolute;
        width: 100%;
        height: 30px;
        line-height: 30px;
        top: 0px;
        left: 110%;
    }
    .myself-checkBox>input {
        width: 100%;
        height: 100%;
        padding-left: 10px;
        padding-right: 20px;
    }
    .myself-checkBox-options {
        position: absolute;
        top: 30px;
        left: 0px;
        width: 100%;
        /* height: 200px; */
        border: 1px solid #ccc;
        background-color: #fff;
        z-index: 99999;
        padding-left: 10px;
        /* padding-bottom: 30px; */
    }
    .myself-checkBox-options-container {
        height: 150px;
        overflow-y: auto;
    }
    .myself-checkBox-options-button {
        position: absolute;
        height: 20px;
        width: 40px;
        text-align: center;
        line-height: 20px;
        font-size: 14px;
        bottom: 10px;
        right: 20px;
        border-radius: 3px;
        background-color: #4067A2;
        color: #fff;
        cursor: pointer;
    }
    /* .showDetailofA a {
        color: #006699 !important;
    } */
    /* .showDetailBackground .modal-content {
        background-color: #006699;
        color: #fff;
    } */
    .controlCancelButton {
        position: relative;
    }
    .showDetailBackground .modal-dialog .table-scrollable {
        height: 330px;
        overflow-y: auto;
    }
    .showDetailBackground .modal-dialog .table-scrollable a {
        color: skyblue !important;
        text-decoration: underline !important;
    }
    .cancelButton-my {
        position: absolute;
        top: -20px;
        right: -20px;
        width: 30px;
        height: 30px;
        /* border: 1px solid #ccc; */
        line-height: 20px;
        border-radius: 50%;
        background-color: #fff;
        text-align: center;
        font-size: 30px;
        cursor: pointer;
    }
    .numsTotal {
        text-align: right;
        padding-right: 10px;
    }
    .numsTotal span {
        display: inline-block;
        margin-left: 30px;
    }
    .modal-body h4 {
        padding-top: 10px;
        padding-left: 10px;
    }
    /* .controlfontsize {
        color: #000
    } */
</style>
