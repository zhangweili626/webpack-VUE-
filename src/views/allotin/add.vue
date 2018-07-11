<template>
    <div>
        <b-card header="入库单">
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调拨入库单号" label-text-align="right" :label-cols="4">
                        <b-form-input :value="inCode" :readonly="stateControl" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="账期" label-text-align="right" :label-cols="4">
                        <b-form-input :value="tempData.beTermNo" :readonly="stateControl" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调入区域" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshopIn" :readonly="areaControl" @select-change="selectedfunin"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调入仓库" label-text-align="right" :label-cols="4">
                        <b-form-input :value="tempData.inWhName" :readonly="areaControl" placeholder="" />
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调拨出库单号" label-text-align="right" :label-cols="4">
                        <b-form-input :value="tempData.transferOutOrderNo" :readonly="stateControl" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="单据时间" label-text-align="right" :label-cols="4">
                        <b-form-input :value="tempData.createTimeStr" :readonly="stateControl" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调出区域" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshopOut" :readonly="areaControl" @select-change="selectedfunout"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调出仓库" label-text-align="right" :label-cols="4">
                        <b-form-input :value="tempData.outWhName" :readonly="areaControl" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调出总数量" label-text-align="right" :label-cols="4">
                        <b-form-input :value="tempData.totalNums" :readonly="stateControl" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调出总金额" label-text-align="right" :label-cols="4">
                        <b-form-input :value="tempData.totalMoney" :readonly="stateControl" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="运费" label-text-align="right" :label-cols="4">
                        <b-form-input :value="tempData.totalFreightFee" :readonly="stateControl" placeholder="" />
                    </b-form-fieldset>
                </div>
            </div>
        </b-card>
        <b-card header="入库明细">
            <div v-if="canSaveDetail" class="table-scrollable">
                <b-table striped hover bordered show-empty :items="tempData.transferOutSkuDetailInfoVoList" :fields="fields">
                    <template slot="skuCode" slot-scope="data">
                        {{ data.item.skuCode }}
                    </template>
                    <template slot="skuName" slot-scope="data">
                        {{ data.item.skuName }}
                    </template>
                    <template slot="barCode" slot-scope="data">
                        {{ data.item.barCode }}
                    </template>
                    <template slot="originalCode" slot-scope="data">
                        {{ data.item.originalCode }}
                    </template>
                    <template slot="externalCode" slot-scope="data">
                        {{ data.item.externalCode }}
                    </template>
                    <template slot="brandName" slot-scope="data">
                        {{ data.item.brandName }}
                    </template>
                    <template slot="skuStandards" slot-scope="data">
                        {{ data.item.skuStandards }}
                    </template>
                    <template slot="skuModel" slot-scope="data">
                        {{ data.item.skuModel }}
                    </template>
                    <template slot="purchaseUnitName" slot-scope="data">
                        {{ data.item.purchaseUnitName }}
                    </template>
                    <template slot="whAreaCode" slot-scope="data">
                        {{ data.item.whAreaName ? data.item.whAreaName : '' }}
                        <b-form-select v-if="!data.item.whAreaName" style="width:100px;" v-model="data.item.whAreaCode" :options="whList" @change="chooseWhCode(data.item, data)"/>
                    </template>
                    <template slot="whLocationCode" slot-scope="data">
                        {{ data.item.whLocationName ? data.item.whLocationName : '' }}
                        <b-form-select v-if="!data.item.whLocationName" style="width:100px;" v-model="data.item.whLocationCode" :options="data.item.whLocationCodelist"/>
                    </template>
                    <template slot="outNums" slot-scope="data">
                        {{ data.item.outNums }}
                    </template>
                    <template slot="inNums" slot-scope="data">
                        <b-form-input type="number" min="0" :state="((data.item.remainNums - data.item.inNums) >= 0)&&((data.item.inNums - 0) >= 0)" v-if="data.item.remainNums > 0" v-model="data.item.inNums" placeholder="" />
                    </template>
                    <template slot="surplus" slot-scope="data">
                        {{ data.item.remainNums - data.item.inNums }}
                    </template>
                    <template slot="thisMoney" slot-scope="data">
                        {{ data.item.thisMoney }}
                    </template>
                    <template slot="empty">
                        暂无数据...
                    </template>
                </b-table>
            </div>
            <div v-if="canSaveDetail" class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button v-if="!hasInstorage" size="sm" variant="success" @click="showModal">入库</b-button>
                        <!-- <b-button v-if="isPrint" @click="printPut" size="sm" variant="primary" >打印</b-button> -->
                    </div>
                </div>
            </div>
            <div v-if="justShowDetail" class="table-scrollable">
                <b-table striped hover bordered show-empty :items="tempData.transferInSkuDetailInfoVoList" :fields="fieldsShow">
                    <template slot="skuCode" slot-scope="data">
                        {{ data.item.skuCode }}
                    </template>
                    <template slot="skuName" slot-scope="data">
                        {{ data.item.skuName }}
                    </template>
                    <template slot="barCode" slot-scope="data">
                        {{ data.item.barCode }}
                    </template>
                    <template slot="originalCode" slot-scope="data">
                        {{ data.item.originalCode }}
                    </template>
                    <template slot="externalCode" slot-scope="data">
                        {{ data.item.externalCode }}
                    </template>
                    <template slot="brandName" slot-scope="data">
                        {{ data.item.brandName }}
                    </template>
                    <template slot="skuStandards" slot-scope="data">
                        {{ data.item.skuStandards }}
                    </template>
                    <template slot="skuModel" slot-scope="data">
                        {{ data.item.skuModel }}
                    </template>
                    <template slot="purchaseUnitName" slot-scope="data">
                        {{ data.item.purchaseUnitName }}
                    </template>
                    <template slot="whAreaCode" slot-scope="data">
                        {{ data.item.whAreaName }}
                    </template>
                    <template slot="whLocationCode" slot-scope="data">
                        {{ data.item.whLocationName }}
                    </template>
                    <template slot="outNums" slot-scope="data">
                        {{ data.item.outNums }}
                    </template>
                    <template slot="inNums" slot-scope="data">
                        <!-- <b-form-input v-if="data.item.remainNums > 0" v-model="data.item.inNums" placeholder="" /> -->
                        {{ data.item.inNums }}
                    </template>
                    <template slot="surplus" slot-scope="data">
                        {{ data.item.remainNums ? data.item.remainNums : 0 }}
                    </template>
                    <template slot="thisMoney" slot-scope="data">
                        {{ data.item.thisMoney }}
                    </template>
                    <template slot="empty">
                        暂无数据...
                    </template>
                </b-table>
            </div>
            <div v-if="justShowDetail" class="col-md-12 col-lg-12">
                <!-- <b-form-fieldset horizontal label="入库总金额" label-text-align="right" :label-cols="4">
                    <b-form-input :value="instorageTotalMoney" :readonly="true" placeholder="" />
                </b-form-fieldset> -->
                <!-- <div v-if="canSaveDetail" class="row">
                    <div class="col-md-12"> -->
                <div class="pull-right">
                    <!-- <b-button v-if="!hasInstorage" size="sm" variant="success" @click="showModal">入库</b-button> -->
                    <b-button v-if="isPrint" @click="printPut" size="sm" variant="primary" >打印</b-button>
                </div>
                    <!-- </div>
                </div> -->
                <div>入库总金额 : {{ tempData.realMoney }}</div>
            </div>
        </b-card>
        <b-modal id="modalPrevent"
                ref="allotinModal"
                :hide-footer="true"
                :hide-header="true">
                <div>
                    <div class="allotinModalTips">{{ allotinTips }}</div>
                    <div class="allotinWarningTips"><span></span><span>此入库为不可逆操作</span></div>
                    <div class="myselfDelete-mysmall-button allotinButton">
                        <button class="myself-boxshadow" @click="closeDeleteModel">否</button>
                        <button class="myself-boxshadow" @click="instorage">是</button>
                    </div>
                </div>
        </b-modal>
    </div>
</template>
<script>
    import { MessageBox, Message } from 'element-ui'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import {mapState, mapMutations, mapActions} from 'vuex'
    import config from 'common/config'
    import apiCollection from 'common/api-collection'
    import api from 'common/api'
// import { setTimeout } from 'timers';
    export default {
        components: {
            areaqueryshop
        },
        data() {
            return {
                whList: [],
                hasInstorage: false,
                justShowDetail: false,
                canSaveDetail: false, 
                tempCode: '',
                areaControl: false,
                stateControl: true,
                isPrint: false,
                tablelist: [],
                outCode: '',
                inCode: '',
                printCode: '',
                allotinTips: '是否确认入库',
                tempData: {
                    transferInSkuDetailInfoVoList: []
                },
                fields: {
                    skuCode: {
                        label: 'SKU编码'
                    },
                    skuName: {
                        label: '商品名称'
                    },
                    barCode: {
                        label: '69码'
                    },
                    originalCode: {
                        label: '原厂编码'
                    },
                    externalCode: {
                        label: '外部编码'
                    },
                    brandName: {
                        label: '品牌'
                    },
                    skuStandards: {
                        label: '规格'
                    },
                    skuModel: {
                        label: '型号'
                    },
                    purchaseUnitName: {
                        label: '单位'
                    },
                    whAreaCode: {
                        label: '库区'
                    },
                    whLocationCode: {
                        label: '库位'
                    },
                    stockNums: {
                        label: '当前库存'
                    },
                    availableNums: {
                        label: '可用库存'
                    },
                    outNums: {
                        label: '调出总数量'
                    },
                    inNums: {
                        label: '实入数量'
                    },
                    surplus: {
                        label: '剩余数量'
                    }
                },
                fieldsShow: {
                    skuCode: {
                        label: 'SKU编码'
                    },
                    skuName: {
                        label: '商品名称'
                    },
                    barCode: {
                        label: '69码'
                    },
                    originalCode: {
                        label: '原厂编码'
                    },
                    externalCode: {
                        label: '外部编码'
                    },
                    brandName: {
                        label: '品牌'
                    },
                    skuStandards: {
                        label: '规格'
                    },
                    skuModel: {
                        label: '型号'
                    },
                    purchaseUnitName: {
                        label: '单位'
                    },
                    whAreaCode: {
                        label: '库区'
                    },
                    whLocationCode: {
                        label: '库位'
                    },
                    stockNums: {
                        label: '当前库存'
                    },
                    availableNums: {
                        label: '可用库存'
                    },
                    outNums: {
                        label: '调出总数量'
                    },
                    inNums: {
                        label: '实入数量'
                    },
                    inPrice: {
                        label: '本次入库金额'
                    }
                }
            }
        },
        methods: {
            ...mapActions('allotin', [
                'setTableList',
                'setPage'
            ]),
            // 打印的方法
            printPut(){
                var temp_form = document.createElement("form");      
                    temp_form.action = apiCollection.notCarSharePurchaseInfo.generatePdfReportInStock;      
                    temp_form.target = "_blank";
                    temp_form.method = "post";      
                    temp_form.style.display = "none"; 
                    var opt = document.createElement("input");
                    opt.type = 'hidden';
                    opt.name = 'inBatchNo';
                    opt.value = this.printCode;
                    temp_form.appendChild(opt);
                    document.body.appendChild(temp_form);
                    temp_form.submit();
            },
            // 库区事件改变   引起库位选项发生改变
            chooseWhCode(arg,data) {
                const _this = this
                let tempArr = []
                setTimeout(() => {
                    let option = {
                        whAreaCode: arg.whAreaCode
                    }
                    api.skuPlace.queryWarehouseLocationInfo(option, res => {
                        if(res.data.code === 'success') {
                            res.data.obj.forEach(element => {
                                let obj = {}
                                obj.text = element.whLocationName
                                obj.value = element.whLocationCode
                                tempArr.push(obj)
                            })
                            this.$set(_this.tempData.transferOutSkuDetailInfoVoList[data.index], 'whLocationCodelist', tempArr)
                            _this.tempData.transferOutSkuDetailInfoVoList = JSON.parse(JSON.stringify(_this.tempData.transferOutSkuDetailInfoVoList))
                        }
                    })
                },10)
            },
            // 入库模态框触发
            showModal() {
                const _this = this
                _this.$refs.allotinModal.show()
            },
            // 入库模态框关闭
            closeDeleteModel() {
                const _this = this
                _this.$refs.allotinModal.hide()
            },
            // 入库操作  入库操作分为两步   如果该商品还没有制定的库区库位   那么就会先更新该商品的库区库位信息    如果该商品的库区库位信息已存在  那么就直接进行入库操作
            instorage() {
                const _this = this
                _this.tempData.transferInOrderNo = _this.inCode
                let judgeWhCode = false
                _this.tempData.transferOutSkuDetailInfoVoList.forEach(element => {
                    if(!element.whLocationCode) {
                        judgeWhCode = true
                    }
                })
                if(judgeWhCode) {
                    Message({
                        type: 'warning',
                        message: '请补全库区库位信息'
                    })
                    return
                }
                _this.tempData.transferInSkuDetailInfoVoList = _this.tempData.transferOutSkuDetailInfoVoList ? _this.tempData.transferOutSkuDetailInfoVoList : _this.tempData.transferInSkuDetailInfoVoList
                _this.tempData.transferType = 0
                _this.tempData.transferSkuType = 1
                delete _this.tempData.transferOutSkuDetailInfoVoList
                for(let i = 0; i< _this.tempData.transferInSkuDetailInfoVoList.length; i++) {
                    if(_this.tempData.transferInSkuDetailInfoVoList[i].inNums - _this.tempData.transferInSkuDetailInfoVoList[i].remainNums > 0) {
                        Message({
                            type: 'warning',
                            message: '商品入库数量数量不合理'
                        })
                        _this.closeDeleteModel()
                        return;
                    }
                }
                let judge = false
                let tempArr = _this.tempData.transferInSkuDetailInfoVoList
                for(let i = 0; i<tempArr.length; i++) {
                    if(!tempArr[i].whLocationName) {
                        judge = true
                    }
                }
                let submitArr = []
                if(judge) {
                    for(let i = 0; i<tempArr.length; i++) {
                        if(!tempArr[i].whLocationName) {
                            let obj = {}
                            obj.storeCode = _this.tempData.inStoreCode
                            obj.whCode = _this.tempData.inWhCode
                            obj.skuCode = tempArr[i].skuCode
                            obj.whAreaCode = tempArr[i].whAreaCode
                            obj.whLocationCode = tempArr[i].whLocationCode
                            submitArr.push(obj)
                        }
                    }
                }
                if(submitArr.length > 0) {
                    _this.allotinTips = '正在新增商品摆放目录...'
                    let seqParams = {
                        serviceCode: config.skuPlace.seq,
                        getNums: submitArr.length
                    }
                    api.ordinalInfo.getSequenceList(seqParams, res => {
                        if(res.data.code === 'success') {
                            let arr = res.data.obj
                            for(let j = 0; j<arr.length; j++) {
                                submitArr[j].skuLocationCode = arr[j]
                            }
                            api.skuPlace.insertSkuLocationInfoList(submitArr, res => {
                                if(res.data.code === 'success') {
                                    _this.allotinTips = '正在入库...'
                                    api.allotin.instorage(_this.tempData, (res) => {
                                        if(res.data.code === 'success') {
                                            Message({
                                                type: 'success',
                                                message: '入库成功'
                                            })
                                            _this.printCode = res.data.obj
                                            _this.isPrint = true
                                            _this.allotinTips = '是否确认入库'
                                            _this.justShowDetail = true
                                            _this.hasInstorage = true
                                            _this.closeDeleteModel()
                                            // _this.getDetailData()
                                            _this.getTableDataAfterIn(_this.tempData.transferInOrderNo)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }else {
                    _this.allotinTips = '正在入库...'
                    api.allotin.instorage(_this.tempData, (res) => {
                        if(res.data.code === 'success') {
                            Message({
                                type: 'success',
                                message: '入库成功'
                            })
                            _this.allotinTips = '是否确认入库'
                            _this.printCode = res.data.obj
                            _this.hasInstorage = true
                            _this.closeDeleteModel()
                            _this.getTableDataAfterIn(_this.tempData.transferInOrderNo)
                        }
                    })
                }
            },
            selectedfunin() {

            },
            selectedfunout() {

            },
            // 入库成功后获取入库单信息列表信息
            getTableDataAfterIn(code) {
                const _this = this
                let option = {
                    transferInOrderNo: code,
                    transferType: 0,
                    transferSkuType: 1
                }
                api.allotin.queryByInCode(option, (res) => {
                    if(res.data.code === 'success') {
                        _this.tempData = res.data.obj
                        _this.justShowDetail = true
                        _this.canSaveDetail = false
                        _this.isPrint = true
                        _this.setAreaValueIn(_this.tempData.inStoreName, _this.tempData.inStoreCode)
                        _this.setAreaValueOut(_this.tempData.outStoreName, _this.tempData.outStoreCode)
                        _this.areaControl = true
                    }
                })
            },
            // 门店组件赋值操作
            setAreaValueIn(argName, argValue) {
                const _this = this
                let storeOption = {
                    text: argName,
                    value: argValue
                }
                _this.$refs.areaqueryshopIn.setselect(storeOption)
            },
            // 门店组件赋值操作
            setAreaValueOut(argName, argValue) {
                const _this = this
                let storeOption = {
                    text: argName,
                    value: argValue
                }
                _this.$refs.areaqueryshopOut.setselect(storeOption)
            },
            // 获取出库单信息 并获取sequence
            getOutCode() {
                const _this = this                
                _this.outCode = _this.$route.query.outCode
                _this.inCode = _this.$route.query.inCode
                let options = {
                    transferOutOrderNo: _this.outCode,
                    wfStatus: 1,
                    isTransfrtInOrder: true,
                    transferType: 0,
                    transferSkuType: 1
                }
                api.allotin.queryByCode(options, (res) => {
                    if(res.data.code === 'success') {
                        _this.tempData = res.data.obj
                        let params = {
                            warehouseCode: res.data.obj.inWhCode
                        }
                        api.skuPlace.queryWarehouseAreaInfo(params, res => {
                            if(res.data.code === 'success') {
                                res.data.obj.forEach(element => {
                                    let obj = {}
                                    obj.text = element.whAreaName
                                    obj.value = element.whAreaCode
                                    _this.whList.push(obj)
                                })
                            }
                        })
                        _this.tempData.transferOutSkuDetailInfoVoList.forEach(element => {
                            element.inNums = 0,
                            element.whLocationCodelist = []
                        })
                        _this.setAreaValueIn(_this.tempData.inStoreName, _this.tempData.inStoreCode)
                        _this.setAreaValueOut(_this.tempData.outStoreName, _this.tempData.outStoreCode)
                        _this.areaControl = true
                        let option = {
                            'serviceCode': config.allotin.seqCode
                        }
                        api.ordinalInfo.getSequence(option, (res) => {
                            if(res.data.code === 'success') {
                                // _this.inCode = res.data.obj
                                _this.inCode = res.data.obj
                            }
                        })
                    }
                })
            },
            // 获取查询的信息
            getDetailData() {
                const _this = this
                let tempIncode = _this.$route.query.inCode
                _this.inCode = tempIncode
                let option = {
                    transferInOrderNo: tempIncode,
                    transferType: 0,
                    transferSkuType: 1
                }
                api.allotin.queryByInCode(option, (res) => {
                    if(res.data.code === 'success') {
                        _this.tempData = res.data.obj
                        
                        _this.setAreaValueIn(_this.tempData.inStoreName, _this.tempData.inStoreCode)
                        _this.setAreaValueOut(_this.tempData.outStoreName, _this.tempData.outStoreCode)
                        _this.areaControl = true
                    }
                })
            },
            // 判断是新增还是查询
            getCodeFromUrl() {
                const _this = this
                let tempCode = _this.$route.query.code
                if(tempCode === '0') {
                    _this.canSaveDetail = true
                    _this.getOutCode()
                }else if(tempCode === '1'){
                    _this.justShowDetail = true
                    _this.getDetailData()
                }
            }
        },
        created() {
            const _this = this
            // 初始化数据
            _this.getCodeFromUrl()
        }
    }
</script>
<style>
    .allotinModalTips {
        text-align: center;
        padding-top: 10px;
        padding-bottom: 10px;
        font-size: 30px;
    }
    .myselfDelete-mysmall-button {
        text-align: center;
        padding-top: 10px;
    }
    .myselfDelete-mysmall-button button {
        height: 36px;
        width: 20%;
        margin-right: 20px;
        background-color: #F2F3F5;
        border: none;
        border-radius: 5px;
        color: #48576A;
    }
    .myselfDelete-mysmall-button button:last-child {
        background-color: #5EB870;
        color: #fff;
        margin-right: 0px;
    }
    .allotinWarningTips {
        text-align: center;
        padding-top: 10px;
        padding-bottom: 20px;
        font-size: 20px;
        height: 40px;
        line-height: 40px;
    }
    .allotinWarningTips>span {
        display: inline-block;
    }
    .allotinWarningTips>span:first-child {
        height: 20px;
        width: 20px;
        background-image: url(./../../../static/image/warning.png);
        background-position: center bottom;
        background-size: 20px 20px;
        vertical-align: text-bottom;
    }
    .allotinWarningTips>span:last-child {
        height: 20px;
        line-height: 20px;
    }
    .allotinButton {
        margin-top: 10px;
    }
</style>

