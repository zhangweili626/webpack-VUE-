<template>
    <div>
        <b-card header="查询">
            <div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="服务名称" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryCondition.serviceName" placeholder="" />
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="状态" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryCondition.onOffFlag" :options="statelist"/>
					</b-form-fieldset>
				</div>
			</div>
            <div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="行政区域" label-text-align="right" :label-cols="4">
						<chinarea ref="chinarea" v-model="provinceCityDistrict" @check-change="checkChange"></chinarea>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="销售区域" label-text-align="right" :label-cols="4" class="service-staticprice">
						<areaqueryshop ref="areaqueryshop" :storeAll="true" @select-change="selectedfun"></areaqueryshop>
					</b-form-fieldset>
				</div>
			</div>
            <div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="时间范围" label-text-align="right" :label-cols="4">
						<el-date-picker
                            v-model="timeStep"
                            type="daterange"
                            @change="datechange()"
                            :clearable="true"
                            :editable="false"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="渠道" label-text-align="right" :label-cols="4">
						<b-form-select v-model="queryCondition.channelType" :options="channels"/>
					</b-form-fieldset>
				</div>
			</div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="服务编码" label-text-align="right" :label-cols="4">
						<b-form-input v-model="queryCondition.serviceCode"/>
					</b-form-fieldset>
				</div>
			</div>
            <div class="row">
				<div class="col-md-12">
					<div class="pull-right">
						<b-button size="sm" variant="default" @click="reset">重置</b-button>
						<b-button size="sm" variant="primary" @click="query(0)">查询</b-button>
					</div>
				</div>
			</div>
        </b-card>
        <b-card>
            <div class="row">
				<div class="col-md-12">
					<div class="pull-left">
						<b-button size="sm" variant="success" v-if="priceAdd" @click="add">新增</b-button>
						<!-- <b-button size="sm" variant="primary">编辑</b-button> -->
                        <b-button size="sm" variant="success" v-if="priceEdit" @click="letOn">上架</b-button>
						<b-button size="sm" variant="warning" v-if="priceEdit" @click="letDown">下架</b-button>
						<b-button size="sm" variant="danger" v-if="priceDelete" @click="deleteItems">删除</b-button>
					</div>
				</div>
			</div>
            <div class="table-scrollable">
				<b-table striped hover bordered show-empty :items="serviceStaticlist" :fields="fields">
                    <template slot="index" slot-scope="row">
                        <div>
                            <input type="checkbox" name="selected" :value="row.item.priceCode" v-model="selected"></input>
                        </div>
                    </template>
                    <template slot="show_details" slot-scope="row">
                        <a @click.stop="queryDetailList(row)">显示明细</a>  
                        <!-- <b-form-checkbox @click.native.stop="queryDetailList(row)" @change="row.toggleDetails" v-model="row.detailsShowing">
                            显示明细
                        </b-form-checkbox> -->
                    </template>
                    <template slot="row-details" slot-scope="row">
                        <div class="tableIntable">
                            <b-table show-empty :items="row.item.detailList" :fields="fields_detail">
                                <template slot="index" slot-scope="data">
                                    {{ data.index + 1 }}
                                </template>
                                <template slot="empty">
                                    暂无数据...
                                </template>
                            </b-table>
                        </div> 
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
        </b-card>
    </div>
</template>
<script>
    import Vue from 'vue'
    import config from 'common/config.js'
    import api from 'common/api.js'
    // import {mapState, mapMutations, mapActions} from 'vuex'
    import pagination from 'components/pagination/pagination.vue'
    import areaqueryshop from 'components/iris-areaqueryshop/index'
    import chinarea from 'components/iris-chinaarea/index.vue'
    import { MessageBox, Message, DatePicker } from 'element-ui'
    import common from 'common/common'
    import collectionApi from 'common/api-collection.js'
    import {hasBtn} from 'common/api-common.js'
    Vue.use(DatePicker)
    export default {
        components: {
            pagination,
            areaqueryshop,
            chinarea
        },
        data() {
            return {
                channels: [],
                timeStep: [],
                selected: [],
                serviceStaticlist: [],
                page: {

                },
                // 明细列表
                detailList: [],
                fields_detail: {
                    index: {
                        label: '序号'
                    },
                    skuCode: {
                        label: '商品编码'
                    },
                    skuName: {
                        label: '商品名称'
                    },
                    skuBrandName: {
                        label: '品牌'
                    },
                    skuStandards: {
                        label: '规格'
                    },
                    skuModel: {
                        label: '型号'
                    },
                    barCode: {
                        label: '69码'
                    },
                    originalCode: {
                        label: '原厂编码'
                    },
                    needQty: {
                        label: '商品用量'
                    }
                },
                provinceCityDistrict: '',
                queryCondition: {
                    serviceName: '',
                    onOffFlag: '',
                    chinaAreaCode: '',
                    storeCodes: [],
                    storeCode: '',
                    channelType: '',
                    storeCode: '',
                    startTime: '',
                    endTime: '',
                    serviceCode: ''
                },
                statelist: [],
                fields: {
                    index: {
                        label: '选择'
                    },
                    serviceCode: {
                        label: '服务编码'
                    },
                    serviceName: {
                        label: '服务名称'
                    },
                    channelTypeName: {
                        label: '渠道'
                    },
                    chinaAreaName: {
                        label: '行政区域'
                    },
                    salesAreaName: {
                        label: '销售区域'
                    },
                    storeName: {
                        label: '门店'
                    },
                    startTime: {
                        label: '生效时间'
                    },
                    endTime: {
                        label: '失效时间'
                    },
                    servicePrice: {
                        label: '￥服务销售价格'
                    },
                    marketPriceMin: {
                        label: '市场价（最低）'
                    },
                    marketPriceMax: {
                        label: '市场价（最高）'
                    },
                    guidingPriceMin: {
                        label: '指导价（最低）'
                    },
                    guidingPriceMax: {
                        label: '指导价（最高）'
                    },
                    show_details: {
                        label: '服务明细'
                    }
                }
            }
        },
        computed: {
            priceAdd(){
				return hasBtn(collectionApi.serviceStatic.add);
            },
            priceEdit(){
				return hasBtn(collectionApi.serviceStatic.edit);
            },
            priceDelete(){
				return hasBtn(collectionApi.serviceStatic.deleteItem);
			}
            // ...mapState('serviceStatic', [
            //     'page',
            //     'serviceStaticlist'
            // ])
        },
        methods: {
            // 查询明细
            queryDetailList(row) {
                const _this = this
                console.log(row)
                if(row.detailsShowing) {
                    
                }else {
                    let option = {
                        serviceCode: row.item.serviceCode
                        // serviceCode: 'S000112'
                    }
                    api.serviceStatic.queryAmountByCode(option, (res) => {
                        if(res.data.code === 'success') {
                            let currentIndex = row.index
                            // console.log(currentIndex)
                            for(let i = 0; i< _this.serviceStaticlist.length; i++) {
                                if(i === currentIndex) {
                                    _this.serviceStaticlist[currentIndex].detailList = res.data.obj
                                }
                            }
                            // console.log(_this.serviceStaticlist)
                            _this.serviceStaticlist = JSON.parse(JSON.stringify(_this.serviceStaticlist))
                            console.log(_this.serviceStaticlist)
                        }
                    })
                }
                row.toggleDetails()
            },
            // 时间段选择
            datechange() {
                const _this = this
            },
            // 门店选择
            selectedfun(data, data1) {
                // console.log('---------门店信息--------')
                console.log(data, data1)
                const _this = this
                if(data1.length) {
                    _this.queryCondition.storeCodes = []
                    _this.queryCondition.storeCode = ''
                    data1.forEach(element => {
                        if(element) {
                            _this.queryCondition.storeCodes.push(element.value)
                        }
                    })
                }else if(data1){
                    _this.queryCondition.storeCodes = []
                    _this.queryCondition.storeCode = data1.value
                }
            },
            // 上架
            letOn() {
                const _this = this
                if(_this.selected.length === 0) {
                    Message({
                        type: 'warning',
                        message: '请选择要上架的条目'
                    })
                    return
                }else {
                    let tempArr = _this.selected
                    let submitArr = []
                    for(let i = 0; i< tempArr.length; i++) {
                        for(let j = 0; j< _this.serviceStaticlist.length; j++) {
                            if((tempArr[i] === _this.serviceStaticlist[j].priceCode)&&(_this.serviceStaticlist[j].onOffFlag===0)) {
                                submitArr.push(tempArr[i])
                            }
                        }
                    }
                    if(submitArr.length === 0) {
                        Message({
                            type: 'warning',
                            message: '已上架商品不可执行上架'
                        })
                        return;
                    }else {
                        // submitArr.forEach(value => {
                        //     value.onOffFlag = 1
                        // })
                        let submitObj = {
                            priceCodeList: submitArr,
                            onOffFlag: 1,
                            isDeleted: 0
                        }
                        api.serviceStatic.update(submitObj, (res) => {
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'info',
                                    message: '上架成功'
                                })
                                _this.selected = []
                                _this.query(0)
                            }
                        })
                    }
                }
            },
            // 下架
            letDown() {
                const _this = this
                if(_this.selected.length === 0) {
                    Message({
                        type: 'warning',
                        message: '请选择要下架的条目'
                    })
                    return
                }else {
                    let tempArr = _this.selected
                    let submitArr = []
                    for(let i = 0; i< tempArr.length; i++) {
                        for(let j = 0; j< _this.serviceStaticlist.length; j++) {
                            if((tempArr[i] === _this.serviceStaticlist[j].priceCode)&&(_this.serviceStaticlist[j].onOffFlag===1)) {
                                submitArr.push(tempArr[i])
                            }
                        }
                    }
                    if(submitArr.length === 0) {
                        Message({
                            type: 'warning',
                            message: '已下架商品不可执行下架'
                        })
                        return;
                    }else {
                        // submitArr.forEach(value => {
                        //     value.onOffFlag = 0
                        // })
                        let submitObj = {
                            priceCodeList: submitArr,
                            onOffFlag: 0,
                            isDeleted: 0
                        }
                        api.serviceStatic.update(submitObj, (res) => {
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'info',
                                    message: '下架成功'
                                })
                                _this.selected = []
                                _this.query(0)
                            }
                        })
                    }
                }
            },
            // 删除
            deleteItems() {
                const _this = this
                if(_this.selected.length === 0) {
                    Message({
                        type: 'warning',
                        message: '请选择要删除的条目'
                    })
                    return
                }else {
                    let tempArr = _this.selected
                    let submitArr = []
                    for(let i = 0; i< tempArr.length; i++) {
                        for(let j = 0; j< _this.serviceStaticlist.length; j++) {
                            if((tempArr[i] === _this.serviceStaticlist[j].priceCode)&&(_this.serviceStaticlist[j].onOffFlag === 0)) {
                                submitArr.push(tempArr[i])
                            }
                        }
                    }
                    // submitArr.forEach(value => {
                    //     value.isDeleted = '1'
                    // })
                    if(submitArr.length === 0) {
                        Message({
                            type: 'warning',
                            message: '上架商品不可执行删除'
                        })
                        return;
                    }else {
                        MessageBox.confirm('删除为不可逆操作, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let submitObj = {
                                priceCodeList: submitArr,
                                onOffFlag: 0,
                                isDeleted: 1
                            }
                            api.serviceStatic.update(submitObj, (res) => {
                                if(res.data.code === 'success') {
                                    Message({
                                        type: 'info',
                                        message: '删除成功'
                                    })
                                    _this.selected = []
                                    _this.query(0)
                                }
                            })
                        }).catch(() => {
                            Message({
                            type: 'info',
                            message: '已取消删除'
                            })        
                        })
                    }
                }
            },
            // 行政区域
            checkChange(data) {
                const _this = this
                _this.queryCondition.chinaAreaCode = data.node.value
            },
            // 换页
            pageChange(num) {
                const _this = this
                _this.query(num)
            },
            // 新增
            add() {
                const _this = this
                _this.$router.push({
                    path: `/service-staticprice/add/${'0'}`
                })
            },
            // 重置
            reset() {
                const _this = this
                _this.queryCondition= {
                    serviceName: '',
                    onOffFlag: '',
                    salesAreaCode: '',
                    chinaAreaCode: '',
                    channelType: '',
                    storeCode: '',
                    startTime: '',
                    endTime: '',
                    serviceCode: ''
                }
                _this.timeStep = []
                _this.provinceCityDistrict = ''
                _this.$refs.areaqueryshop.reset()
                _this.$refs.areaqueryshop.resetToStart()
            },
            query(arg) {
                const _this = this
                if(_this.timeStep.length > 0) {
                    let timeObj = common.formattingTime(_this.timeStep)
                    _this.queryCondition.startTime = timeObj.startTime
                    _this.queryCondition.endTime = timeObj.endTime
                }
                let option = {
                    serviceName: _this.queryCondition.serviceName,
                    serviceCode: _this.queryCondition.serviceCode,
                    onOffFlag: _this.queryCondition.onOffFlag,
                    salesAreaCode: _this.queryCondition.salesAreaCode,
                    chinaAreaCode: _this.queryCondition.chinaAreaCode,
                    channelType: _this.queryCondition.channelType,
                    storeCode: _this.queryCondition.storeCode,
                    storeCodes: _this.queryCondition.storeCodes,
                    startTime: _this.queryCondition.startTime === '1970-01-01' ? '' : _this.queryCondition.startTime,
                    endTime: _this.queryCondition.endTime === '1970-01-01' ? '' : _this.queryCondition.endTime,
                    pageNums: config.pageNums,
                    pageStart: arg === 0 ? 1: arg
                }
                api.serviceStatic.queryByPage(option, (res) => {
                    if(res.data.code === 'success') {
                        let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        _this.page = tempPage
                        // _this.setPageOfStatic(tempPage)
                        // _this.setTableListOfStatic(res.data.obj.list)
                        _this.serviceStaticlist = JSON.parse(JSON.stringify(res.data.obj.list))
                        for(let i = 0; i< _this.serviceStaticlist.length; i++) {
                            _this.serviceStaticlist[i].detailList = []
                        }
                        console.log(_this.serviceStaticlist)
                    }
                })
            },
            // 获取渠道
            getChannels() {
                const _this = this
                let option = {
                    refCode: config.serviceStaticPrice.channelRef
                }
                api.ref.getDataDictionarys(option, (res) => {
                    if(res.data.code === 'success') {
                        let tempArr = res.data.obj.referenceDetailInfos
                        for(let i = 0; i<tempArr.length; i++) {
                            let obj = {}
                            obj.text = tempArr[i].refDetailName
                            obj.value = tempArr[i].refDetailCode
                            _this.channels.push(obj)
                        }
                    }
                })
            }
        },
        created() {
            const _this = this
            _this.statelist = config.serviceStaticPrice.statelist
            _this.getChannels()
        }
    }
</script>
<style>
    .tableIntable {
        background-color: #ddd;
        width: 80%;
        margin: 0 auto;
    }
    .tableIntable>.table{
            display: table;
            /* border-collapse: separate; */
            border-spacing: 0px !important;
            /* background-color: #c2cfd6 !important; */
            border: 0 !important;
    }
    .tableIntable>.table td {
        border: 0 !important;
    }
    .tableIntable>.table th {
        border: 0 !important;
    }
    .tableIntable>.table tr {
        background-color: #c2cfd6 !important;
        border-bottom: 1px solid #888;
    }
    .b-table-details td {
        background-color: #c2cfd6 !important;
    }
    .tableIntable>.table tr td:nth-child(3) {
        width: 20%;
    }
    .service-staticprice .treepick-warp {
        height: 200px;
        overflow-y: scroll;
    }
</style>
