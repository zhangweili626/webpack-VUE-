<template>
    <div>
        <b-card header="服务主信息">
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="服务编码*" label-text-align="right" :label-cols="4">
						<b-form-input v-model="addCondition.serviceCode" placeholder="" readonly/>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="服务名称*" label-text-align="right" :label-cols="4">
						<b-form-input v-model="addCondition.serviceName" :state="stateControl.serviceName" :readonly="hasSaved"/>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="服务目录*" label-text-align="right" :label-cols="4">
						<div @click="catlogControl" ref="serviceCatelog">
                            <b-form-input v-model="addCondition.catlogName" :state="stateControl.catlogName" readonly />
                        </div>
                        <div class="text-left select-tree control-style self_control" v-show="catlongShow">
                            <!-- <el-tree :data="planTreeData" :props="planOptions" :load="planNode" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="planItemClick"> -->
                            <el-tree :data="catTreeData" :props="catOptions" :load="catNode" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="hasExpandClick" @node-click="catItemClick" @node-expand="expandClick">
                            </el-tree>
                        </div>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="服务分类*" label-text-align="right" :label-cols="4">
						<div @click="inventoryControl" ref="serviceCategory">
                            <b-form-input v-model="addCondition.categoryName" :state="stateControl.categoryName" readonly />
                        </div>
                        <div class="text-left select-tree control-style self_control" v-show="catelogShow">
                            <!-- <el-tree :data="planTreeData" :props="planOptions" :load="planNode" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="false" @node-click="planItemClick"> -->
                            <el-tree :data="planTreeData" :props="planOptions" :load="planNode" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="hasExpandClick" @node-click="planItemClick" @node-expand="expandClick">
                            </el-tree>
                        </div>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="用料关系*" label-text-align="right" :label-cols="4">
						<b-form-select v-model="addCondition.skuType" :state="stateControl.skuType" :options="itemlist" :disabled="hasSaved"/>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="价格类型*" label-text-align="right" :label-cols="4">
						<b-form-select v-model="addCondition.priceType" :state="stateControl.priceType" :options="priceTypes" :disabled="hasSaved"/>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="人工成本类型*" label-text-align="right" :label-cols="4">
						<b-form-select v-model="addCondition.labourPriceType" :options="personTypes" :disabled="hasSaved"/>
					</b-form-fieldset>
				</div>
				<div v-if="addCondition.labourPriceType === 1" class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="人工成本￥*" label-text-align="right" :label-cols="4">
						<b-form-input v-model="addCondition.labourPrice" :state="stateControl.labourPrice" :readonly="hasSaved"/>
					</b-form-fieldset>
				</div>
				<div v-if="addCondition.labourPriceType === 0" class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="比例%*" label-text-align="right" :label-cols="4">
						<b-form-input v-model="addCondition.labourPrice" :state="stateControl.labourPrice" :readonly="hasSaved"/>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="服务工种*" label-text-align="right" :label-cols="4">
						<b-form-input v-model="workTypesText" :readonly="hasSaved" :state="stateControl.workTypesText" @focus.native="focusOnWork"/>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="是否可外包*" label-text-align="right" :label-cols="4">
						<b-form-select v-model="addCondition.outsideFlag" :options="itemlist" :state="stateControl.outsideFlag" :disabled="hasSaved"/>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="是否上架*" label-text-align="right" :label-cols="4">
						<b-form-select v-model="addCondition.onOffFlag" :options="itemlist" :state="stateControl.onOffFlag" :disabled="hasSaved"/>
					</b-form-fieldset>
				</div>
				<div class="col-md-6 col-lg-6">
					<b-form-fieldset horizontal label="人工费税率*" label-text-align="right" :label-cols="4">
						<b-form-select v-model="addCondition.labourPriceTaxRateCode" :state="stateControl.labourPriceTaxRateCode" :options="manRateList" :disabled="hasSaved"/>
					</b-form-fieldset>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 col-lg-12">
					<b-form-fieldset horizontal label="备注" label-text-align="right" :label-cols="2">
						<b-form-input v-model="addCondition.remark" :readonly="hasSaved"/>
					</b-form-fieldset>
				</div>
			</div>

		</b-card>

        <b-card v-if="hasSaved || editState" header="适配关联信息">
            <div class="row">
				<div class="col-md-12">
					<div class="pull-right">
						<b-button v-if="!isJustShow" size="sm" variant="danger">删除</b-button>
					</div>
				</div>
			</div>
            <div class="table-scrollable">
				<b-table striped hover bordered show-empty :items="tablelist" :fields="fields">
					<template slot="index" slot-scope="data">
						<div @click="setCarIndex(data.index)">
							<input type="radio" name="radio" :disabled="isJustShow"/>
						</div>
					</template>
					<template slot="empty">
						暂无数据...
					</template>
				</b-table>
			</div>
			<!-- <div class="row mt-2">
				<div class="col-md-12">
					<pagination class="pull-right" @page-change="pageChange" :page-no="page.pageNo" :page-size="page.pageSize" :total-result="page.totalResult" :total-pages="page.totalPages">
					</pagination>
				</div>
			</div> -->
        </b-card>
        <b-modal id="workTypes"
                v-model="workTypesShow"
                ref="modalcar"
                @ok="sureTypes"
                @shown="sureClear"
                ok-title="确认"
                cancel-title="取消">
                <!-- <div class="row"> -->
                <b-form-group label="">
                    <b-form-checkbox-group v-model="workTypesArr" name="workTypes" :options="jobTypes">
                    </b-form-checkbox-group>
                </b-form-group>
                <!-- </div> -->
        </b-modal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import pagination from 'components/pagination/pagination.vue'
    import search from 'components/iris-search/search.vue'
    import config from 'common/config'
    import api from 'common/api'
    import { MessageBox, Message, DatePicker, Tree } from 'element-ui'
    import common from 'common/common'
    Vue.use(Tree)
	Vue.use(DatePicker)
    export default {
        components: {
            pagination,
            search
        },
        data() {
            return {
                manRateList: [],
                workTypesShow: false,
                editState: false,
                workTypesArr: [],
                // 判断是否仅显示
                isJustShow: false,
                datalist: [],
                selectParams: {
                    refCode: config.serviceitem.carType,
                    pageNums: config.pageNums,
                    pageStart: 1
                },
                isLastPage: false,
                required: false,
                hasSaved: true,
                // 服务分类的数据
                planTreeData: [],
                planOptions: {
                    children: 'children',
                    label: 'categoryName'
                },
                hasExpandClick: false,
                catelogShow: false,
                // 服务目录的数据
                catTreeData: [],
                catOptions: {
                    children: 'children',
                    label: 'catlogName'
                },
                hasExpandClick: false,
                catlongShow: false,
                // 工种信息显示
                workTypesText: '',
                addCondition: {
                    serviceCode: '',
                    serviceName: '',
                    catlogCode: '',
                    catlogName: '',
                    categoryCode: '',
                    categoryName: '',
                    skuType: '',
                    priceType: '',
                    labourPriceType: 1,
                    labourPrice: '',
                    // stationCode: '',
                    serviceWorkTypeInfoList: [],
                    labourPriceTaxRateCode: '',
                    outsideFlag: '',
                    onOffFlag: '',
                    remark: ''
                },
                jobTypes: [],
                itemlist: [],
                priceTypes: [],
                personTypes: [],
                mainCarList: [],
                // page: {
                //     pageNo: 1,
                //     pageSize: config.pageNums,
                //     totalResult: 0,
                //     totalPages: 1
                // },
                tablelist: [],
                fields: {
                    index: {
                        label: '选择'
                    },
                    carAddName: {
                        label: '扩展信息'
                    }
                },
                expandList: [],
                carAddIndex: '',
                stateControl: {
                    serviceName: null,
                    catlogName: null,
                    categoryName: null,
                    skuType: null,
                    priceType: null,
                    labourPrice: null,
                    workTypesText: null,
                    outsideFlag: null,
                    onOffFlag: null,
                    labourPriceTaxRateCode: null
                    // remark: null
                }
            }
        },
        props:{            
            serviceCode: {
              type: [String],
              default: ''
            }
        },
        watch:{
            serviceCode:function(val){                
                if(val){
                    this.getUrlCode();
                }
                
            }
        },
        methods: {
            // 获取人工费税率
            getManRate() {
                const _this = this
                let option = {
                    refCode: config.serviceitem.rate
                }
                api.ref.getDataDictionarys(option, res => {
                    if(res.data.code === 'success') {
                        res.data.obj.referenceDetailInfos.forEach(element => {
                            let obj = {}
                            obj.text = (element.refDetailName - 0) * 100 + '%'
                            obj.value = element.refDetailCode
                            _this.manRateList.push(obj)
                        })
                    }
                })
            },
            // 取消操作
            cancel() {
                const _this = this
                _this.$router.push({
                    path: `/serviceitem/query`
                })
            },
            // 服务工种
            focusOnWork() {
                const _this = this
                if(_this.hasSaved) {
                    return
                }else {
                    _this.workTypesShow = true
                }
            },
            sureTypes() {
                const _this = this
                console.log(_this.workTypesArr)
                _this.workTypesText = ''
                for(let i = 0; i< _this.workTypesArr.length; i++) {
                    for(let j = 0; j< _this.jobTypes.length; j++){
                        if(_this.workTypesArr[i] === _this.jobTypes[j].value) {
                            _this.workTypesText += _this.jobTypes[j].text + '、'
                        }
                    }
                }
                _this.workTypesText = _this.workTypesText ? _this.workTypesText.substring(0, _this.workTypesText.length - 1) : ''
            },
            sureClear() {
                const _this = this  
            },
            setCarIndex(arg) {
                const _this = this
                _this.carAddIndex = arg
            },
            // 定义向后台请求supplierName的方法
            getSupplierName(params,callback) {
                api.ref.queryDetail(params, res => {
                    if (res.data.code === "success") {
                        let obj = res.data.obj;
                        console.log(obj)
                        callback(obj);
                    }
                })
            },
            // 滚动加载
            comScroll(isEnd) {
                if (isEnd && !this.isLastPage) {
                    this.selectParams.pageStart ++
                    let params = this.selectParams;
                    this.getSupplierName(params, obj => {
                        this.isLastPage = obj.isLastPage;
                        obj.list.forEach(element => {
                            if(element.isDeleted === '0') {
                                this.datalist.push(element)
                            }
                        })
                        // this.datalist = this.datalist.concat(obj.list);
                    });
                }
            },
            // 第一次加载数据
            firstLoad() {
                const _this = this
                if(_this.datalist.length != 0 ){
                    return
                }
                let params = _this.selectParams
                _this.getSupplierName(params, function(res) {
                    _this.isLastPage = res.isLastPage
                    // console.log(res)
                    _this.datalist = []
                    res.list.forEach(element => {
                        if(element.isDeleted === '0') {
                            _this.datalist.push(element)
                        }
                    })
                    //  = res.list
                })
            },
            itemValue(value) {
                console.log(value)
                const _this = this
                for(let i = 0; i< _this.expandList.length; i++) {
                    if(value.refDetailCode === _this.expandList[i].carAddCode) {
                        Message({
                            type: 'warning',
                            message: '该项已存在'
                        })
                        return;
                    }
                }
                for(let j = 0; j< _this.tablelist.length; j++) {
                    if(value.refDetailCode === _this.tablelist[j].carAddCode) {
                        Message({
                            type: 'warning',
                            message: '该项已存在'
                        })
                        return;
                    }
                }
                let option = {
                    serviceCode: config.serviceitem.relseq
                }
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {
                        let obj = {}
                        obj.carAddCode = value.refDetailCode
                        obj.carAddName = value.refDetailName
                        obj.relationCode = res.data.obj
                        _this.expandList.push(obj)
                    }
                })
            },
            querySelect(data) {
                // console.log(data)
                const _this = this
                _this.selectParams.pageStart = 1;
                _this.selectParams.refDetailName = data;
                let params = _this.selectParams;
                console.log(params)
                _this.getSupplierName(params, function(res) {
                    _this.isLastPage = res.isLastPage
                    _this.datalist = []
                    res.list.forEach(element => {
                        if(element.isDeleted === '0') {
                            _this.datalist.push(element)
                        }
                    })
                })
            },
            // 服务目录树形图的方法
            catlogControl() {
                const _this = this
                if(_this.hasSaved) {
                    return
                }
                _this.catlongShow = !_this.catlongShow
            },
            catItemClick(data) {
                this.addCondition.catlogCode = data.catlogCode;
                this.addCondition.catlogName = data.catlogName;
                this.catlongShow = false;
            },
            // 加载分类数据
            catNode(node, resolve) {
                const _this = this
                if (node.level === 0) {
                    let params = { catlogCode: config.serviceitem.catlogCode };
                    api.serviceitem.queryCatalog(params).then(res => {
                        if (res.data.code === 'success') {
                            let obj = res.data.obj;
                            if (obj) {
                                let arr = [{
                                    id: 0,   // 默认展示一级节点
                                    catlogName: obj.catlogName,
                                    catlogCode: obj.catlogCode
                                }];
                                return resolve(arr);
                            }
                        }
                    })
                } else {
                    let params = { catlogCode: node.data.catlogCode };
                    api.serviceitem.queryCatalog(params).then(res => {
                        if (res.data.code === 'success') {
                            let items = res.data.obj.serviceCatLogSubInfo;
                            let arr = [];
                            if (items !== null) {
                                items.forEach((item, index) => {
                                    let data = {
                                        catlogName: item.catlogName,
                                        catlogCode: item.catlogCode
                                    }
                                    arr.push(data)
                                })
                            } else {
                                return resolve([])
                            }
                            return resolve(arr)
                        }
                    })
                }
            },
            // 服务分类树形图的方法
            inventoryControl() {
                const _this = this
                if(_this.hasSaved) {
                    return
                }
                _this.catelogShow = !_this.catelogShow
            },
            // 加载分类数据
            planNode(node, resolve) {
                const _this = this
                if (node.level === 0) {
                    let params = { categoryCode: config.serviceitem.categoryCode };
                    api.serviceitem.queryCategory(params).then(res => {
                        if (res.data.code === 'success') {
                            let obj = res.data.obj;
                            if (obj) {
                                let arr = [{
                                    id: 0,   // 默认展示一级节点
                                    categoryName: obj.categoryName,
                                    categoryCode: obj.categoryCode
                                }];
                                return resolve(arr);
                            }
                        }
                    })
                } else {
                    let params = { categoryCode: node.data.categoryCode };
                    api.serviceitem.queryCategory(params).then(res => {
                        if (res.data.code === 'success') {
                            let items = res.data.obj.serviceCategorySubInfo;
                            let arr = [];
                            if (items !== null) {
                                items.forEach((item, index) => {
                                    let data = {
                                        categoryName: item.categoryName,
                                        categoryCode: item.categoryCode
                                    }
                                    arr.push(data)
                                })
                            } else {
                                return resolve([])
                            }
                            return resolve(arr)
                        }
                    })
                }
            },
            planItemClick(data) {
                this.addCondition.categoryName = data.categoryName;
                this.addCondition.categoryCode = data.categoryCode;
                this.catelogShow = false;
            },
            // 节点展开事件
            expandClick() {},
            pageChange() {

            },
            save() {
                const _this = this
                let judgeMain = true
                for(var k in _this.addCondition) {
                    if(_this.addCondition[k] === '') {
                        _this.stateControl[k] = false
                        judgeMain = false
                        if(k === 'remark') {
                            judgeMain = true
                        }
                    }else {
                        _this.stateControl[k] = null
                    }
                }
                if(_this.workTypesText === '') {
                    _this.stateControl.workTypesText = false
                    judgeMain = false
                }else {
                    _this.stateControl.workTypesText = null
                }
                if(judgeMain) {
                    for(let i = 0; i< _this.addCondition.serviceWorkTypeInfoList.length; i++) {
                        let judge = false
                        for(let j = 0; j< _this.workTypesArr.length; j++) {
                            if(_this.addCondition.serviceWorkTypeInfoList[i].workTypeCode === _this.workTypesArr[j]) {
                                judge = true
                            }
                        }
                        if(!judge) {
                            _this.addCondition.serviceWorkTypeInfoList[i].isDeleted = '1'
                        }
                    }
                    let num = 0
                    for(let k = 0; k< _this.workTypesArr.length; k++) {
                        let judgeTwo = false
                        for(let s = 0; s < _this.addCondition.serviceWorkTypeInfoList.length; s++) {
                            if(_this.workTypesArr[k] === _this.addCondition.serviceWorkTypeInfoList[s].workTypeCode) {
                                judgeTwo = true
                            }
                        }
                        if(!judgeTwo) {
                            num++
                        }
                    }
                    if(num === 0) {
                        let addParams = []
                        let submitCondition = JSON.parse(JSON.stringify(_this.addCondition))
                        if(_this.addCondition.labourPriceType === 0) {
                            submitCondition.labourPrice = common.dealNumberWithSmall(_this.addCondition.labourPrice)
                        }
                        addParams.push(submitCondition)
                        api.serviceitem.insertService(addParams, (res) => {
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'info',
                                    message: '主表编辑成功'
                                })
                                _this.hasSaved = true
                            }
                        })
                    }else {
                        let option = {
                            serviceCode: config.serviceitem.jobseq,
                            getNums: num
                        }
                        api.ordinalInfo.getSequenceList(option, (res) => {
                            if(res.data.code === 'success') {
                                let resArr = res.data.obj
                                // _this.addCondition.serviceWorkTypeInfoList = []
                                for(let i = 0; i< resArr.length; i++){
                                    let obj = {}
                                    obj.workTypeCode = _this.workTypesArr[i]
                                    obj.serviceCode = _this.addCondition.serviceCode
                                    obj.serviceName = _this.addCondition.serviceName
                                    obj.relationCode = resArr[i]
                                    _this.addCondition.serviceWorkTypeInfoList.push(obj)
                                }
                                let addParams = []
                                let submitCondition = JSON.parse(JSON.stringify(_this.addCondition))
                                if(_this.addCondition.labourPriceType === 0) {
                                    submitCondition.labourPrice = common.dealNumberWithSmall(_this.addCondition.labourPrice)
                                }
                                addParams.push(submitCondition)
                                api.serviceitem.insertService(addParams, (res) => {
                                    if(res.data.code === 'success') {
                                        Message({
                                            type: 'info',
                                            message: '保存成功'
                                        })
                                        _this.hasSaved = true
                                    }
                                })
                            }
                        })
                    }
                }
                
            },
            // 获取服务工种
            getServiceJobType() {
                const _this = this
                let option = {
                    refCode: config.serviceitem.jobtype
                }
                api.ref.getDataDictionarys(option, (res) => {
                    if(res.data.code === 'success') {
                        let tempArr = res.data.obj.referenceDetailInfos
                        tempArr.forEach(value => {
                            let obj = {}
                            obj.text = value.refDetailName
                            obj.value = value.refDetailCode
                            _this.jobTypes.push(obj)
                        }) 
                    }
                })
            },
            // 获取新增服务信息的业务编码
            getServiceCodeFromSeq() {
                const _this = this
                let option = {
                    serviceCode: config.serviceitem.seq
                }
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {
                        _this.addCondition.serviceCode = res.data.obj
                    }
                })
            },
            // 根据服务编码获取服务详情
            getDetailFromCode(argOption) {
                const _this = this
                api.serviceitem.queryByCode(argOption, (res) => {
                    if(res.data.code === 'success') {
                        _this.addCondition = {
                            serviceCode: res.data.obj[0].serviceCode,
                            serviceName: res.data.obj[0].serviceName,
                            catlogCode: res.data.obj[0].catlogCode,
                            catlogName: res.data.obj[0].catlogName,
                            categoryCode: res.data.obj[0].categoryCode,
                            categoryName: res.data.obj[0].categoryName,
                            skuType: res.data.obj[0].skuType,
                            priceType: res.data.obj[0].priceType,
                            labourPriceType: res.data.obj[0].labourPriceType,
                            labourPrice: res.data.obj[0].labourPrice,
                            labourPriceTaxRateCode: res.data.obj[0].labourPriceTaxRateCode,
                            // stationCode: res.data.obj[0].stationCode,
                            serviceWorkTypeInfoList: res.data.obj[0].serviceWorkTypeInfoList,
                            outsideFlag: res.data.obj[0].outsideFlag,
                            onOffFlag: res.data.obj[0].onOffFlag,
                            remark: res.data.obj[0].remark
                        }
                        if(_this.addCondition.labourPriceType === 0) {
                            _this.addCondition.labourPrice = common.dealNumberWithPoint(_this.addCondition.labourPrice)
                        }
                        _this.workTypesText = res.data.obj[0].workTypeName
                        if(res.data.obj[0].id) {
                            _this.addCondition.id = res.data.obj[0].id
                        }
                        _this.addCondition.serviceWorkTypeInfoList.forEach(value => {
                            _this.workTypesArr.push(value.workTypeCode)
                        })
                        _this.tablelist = res.data.obj[0].serviceCarAddInfoList
                    }
                })
            },
            getUrlCode(val) {
                
                const _this = this
                let code = _this.serviceCode || val;
                let judge = 'show'
                if(judge === 'show') {
                    let option = {
                        serviceCode: code
                    }
                    _this.getDetailFromCode(option)
                    _this.isJustShow = true
                    _this.hasSaved = true
                }
            },
            // 扩展信息新增
            sure() {
                const _this = this
                let tempObj = JSON.parse(JSON.stringify(_this.addCondition))
                let obj = {
                    serviceCode: _this.addCondition.serviceCode
                }
                api.serviceitem.queryByCode(obj, (res) => {
                    if(res.data.code === 'success') {
                        let tempArr = []
                        for(let i = 0; i< _this.expandList.length; i++) {
                            let itemObj = {}
                            itemObj.carAddCode = _this.expandList[i].carAddCode
                            itemObj.carAddName = _this.expandList[i].carAddName
                            itemObj.relationCode = _this.expandList[i].relationCode
                            itemObj.serviceCode = _this.addCondition.serviceCode
                            itemObj.serviceName = _this.addCondition.serviceName
                            tempArr.push(itemObj)
                        }
                        if(tempArr.length === 0) {
                            Message({
                                info: 'warning',
                                message: '没有选取要保存的扩展信息'
                            })
                            return;
                        }
                        tempObj.id = res.data.obj[0].id
                        tempObj.serviceCarAddInfoList = tempArr
                        tempObj.serviceWorkTypeInfoList = res.data.obj[0].serviceWorkTypeInfoList
                        let submitArr = []
                        submitArr.push(tempObj)
                        api.serviceitem.insertService(submitArr, (res) => {
                            if(res.data.code === 'success') {
                                Message({
                                    type: 'info',
                                    message: '扩展信息保存成功'
                                })
                                _this.expandList = []
                                _this.getDetailOfService()
                            }
                        })
                    }
                })
            },
            // 根据服务编码查询服务信息 
            getDetailOfService() {
                const _this = this
                let option = {
                    serviceCode: _this.addCondition.serviceCode
                }
                api.serviceitem.queryByCode(option, (res) => {
                    if(res.data.code === 'success') {
                        _this.tablelist = res.data.obj[0].serviceCarAddInfoList 
                    }
                })
            },

        },
        created() {

            const _this = this
            _this.itemlist = config.serviceitem.yesOrno
            _this.personTypes = config.serviceitem.personType
            _this.priceTypes = config.serviceitem.pricetype
            _this.getServiceJobType()
            _this.getManRate()
            
            if(this.serviceCode){
                _this.getUrlCode();
            }
            
            
        }
    }
</script>

<style scoped>
    .select-tree {
        position: absolute;
        margin-top: 6px;
        width: 100%;
        z-index: 1000;
    }
    .special {
        vertical-align: middle !important;
        height: 10px;
    }
    .self_control>.el-tree {
        max-height: 300px;
        overflow-y: scroll;
    }
    .self_control {
        height: auto !important;
    }
    /* .self-select-tree {
        overflow: auto;
        position: absolute;
    } */
    .expandItem {
        display: inline-block;
        padding: 5px 20px;
        margin: 10px 10px;
        border: 1px solid #ccc;
        position: relative;
    }
    .expandItem>i {
        position: absolute;
        right: 0;
        top: 0;
        height: 10px;
        width: 10px;
        background-color: red;
        border-radius: 50%;
        transform: translate(50%, -50%);
    }
</style>

