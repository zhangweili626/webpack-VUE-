<template>
    <div class="animated fadeIn">
        <b-card header="主表">
             <div class="row">                       
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="模板编码" :label-cols="4" class="text-right">
                        <b-form-input v-model="dataModel.checkTemplateCode" disabled/>
                    </b-form-fieldset>
                 </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="模板名称" :label-cols="4" class="text-right">
                        <b-form-input  v-model.trim="dataModel.checkTemplateName" :state="inp.checkTemplateName" :disabled="isHeadSave"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="是否自定义" :label-cols="4" class="text-right">
                         <b-form-radio-group id="radio1" name="radio1" class="text-left mt-2"  v-model="dataModel.templateType"  :disabled="isHeadSave">
                            <b-form-radio value="0">否</b-form-radio>
                            <b-form-radio value="1">是</b-form-radio>                       
                        </b-form-radio-group>                        
                    </b-form-fieldset>
                </div>
                <div class="col-md-4" v-show="dataModel.templateType=='1'?false:true">
                    <b-form-fieldset horizontal label="引用模板编号" :label-cols="4" class="text-right">
                        <b-form-input  v-model.trim="dataModel.refTemplateCode" :state="inp.refTemplateCode"  :disabled="isHeadSave"/>
                    </b-form-fieldset>
                </div>
            </div>
            <car-info @callBack="carSelect" :col='3' :showLength="4" ref="carInfo" @validete='validCar' :validateLen = 'carValidateLen' :isDisabled='isHeadSave'></car-info>  
            <span :style="{'position': 'absolute','left': carFlag?'0.6%':'33.6%','margin-top': carFlag?'0px':'-52px', 'width':'33%'}">
                <div class="col-md-12 pull-right">
                    <b-form-fieldset horizontal label="检查类型" :label-cols="4" class="text-right" :state="inp.checkTypeCode">
                        <b-form-select :options="checkTempateTypelList" v-model="dataModel.checkTypeCode" :state="inp.checkTypeCode"  :disabled="isHeadSave">
                        </b-form-select>
                    </b-form-fieldset>
                </div>
            </span>       
            <b-row class="text-right" :style="{'margin-top': carFlag?'52px':'0px'}">
                <div class="col-md-12">
                    <b-button size="sm" variant="success" v-show="(!onlySee) && isHeadSave && isStop" @click="startUse('0')">启用</b-button>
                    <b-button size="sm" variant="danger"  v-show="(!onlySee) && isHeadSave && !isStop" @click="startUse('1')">停用</b-button>
                    <b-button size="sm" variant="warning"  v-show="(!onlySee) && isHeadSave && isStop" @click="eidtHead">编辑</b-button>
                    <b-button size="sm" variant="default" v-show="!isHeadSave" @click="getBack">取消</b-button>
                    <b-button size="sm" variant="success" @click="saveHead"  v-show="(!onlySee) && !isHeadSave">保存</b-button>
                </div>
            </b-row>
        </b-card>
        <el-tabs type="border-card" v-show="isHeadSave">
            <el-tab-pane label="检查项目">
                <div class="animated fadeIn">
                     <div class="row">              
                        <div class="col-md-8">
                            <b-button size="sm" variant="success" @click="addCheckItem" v-show="(!onlySee) && isStop">新增项目</b-button>
                            <b-button size="sm" variant="danger" @click="delCheckItem" v-show="(!onlySee) && isStop">删除项目</b-button>                           
                            <b-button size="sm" variant="default" @click="moveItem('up')" v-show="(!onlySee) && isStop">上移</b-button>
                            <b-button size="sm" variant="default" @click="moveItem('down')" v-show="(!onlySee) && isStop">下移</b-button>
                        </div>
                        <div class="col-md-4 text-right">
                            <b-button size="sm" variant="success" @click="saveDetail" v-show="(!onlySee) && isStop">保存</b-button>
                        </div>
                    </div>
                    <div class="table-scrollable mb-2">
                        <b-table striped hover bordered show-empty :items="tabldeList" :fields="fieldsA">
                            <template slot="sel" slot-scope="data">
                                <input type="radio" name="radio"  v-model="selCont" :value="data.item" :disabled="onlySee"/> 
                            </template>
                            <template slot="refTemplateCode" slot-scope="data">
                                {{ data.value }}					
                            </template>
                            <template slot="orderNumber" slot-scope="data">
                                {{ data.index + 1}}
                            </template>
                            <template slot="checkItemTypeCode" slot-scope="data">
                                <b-form-select class="check-t-w160" :options="checkTypelList" v-model="data.value" @input="inputResult(data.value, data.index, 'checkItemTypeCode')" :disabled='data.item.isEdit || onlySee'>
                                </b-form-select>
                            </template>		
                            <template slot="checkItem" slot-scope="data">
                                <b-form-input v-model="data.value" @input="inputResult(data.value, data.index, 'checkItem')" :disabled='data.item.isEdit || onlySee' class="check-t-w100"/>
                            </template>
                            <template slot="checkResult1" slot-scope="data">
                               <b-form-input v-model="data.value" @input="inputResult(data.value, data.index, 'checkResult1')" :disabled='data.item.isEdit || onlySee' class="check-t-w100"/>
                            </template>
                            <template slot="checkResult2" slot-scope="data">
                                <b-form-input v-model="data.value" @input="inputResult(data.value, data.index, 'checkResult2')" :disabled='data.item.isEdit || onlySee' class="check-t-w100"/>
                            </template>
                            <template slot="checkResult3" slot-scope="data">
                                <b-form-input v-model="data.value" @input="inputResult(data.value, data.index, 'checkResult3')" :disabled='data.item.isEdit || onlySee' class="check-t-w100"/>
                            </template>
                            <template slot="checkResult4" slot-scope="data">
                                <b-form-input v-model="data.value" @input="inputResult(data.value, data.index, 'checkResult4')" :disabled='data.item.isEdit || onlySee' class="check-t-w100"/>
                            </template>
                            <template slot="checkResult5" slot-scope="data">
                                <b-form-input v-model="data.value" @input="inputResult(data.value, data.index, 'checkResult5')" :disabled='data.item.isEdit || onlySee' class="check-t-w100"/>
                            </template>
                            <template slot="verbalTrick" slot-scope="data">
                                <a href="javascript:;" @click.prevent="eidtRemark(data.value, data.index, (data.item.isEdit || onlySee))" v-if="data.value!=''&& data.value!=null" class="remark-sm" :title="data.value">{{ data.value }}</a>
                                <b-button size="sm" variant="success" v-b-modal.modalRemark v-else @click.prevent="eidtRemark(data.value, data.index, (data.item.isEdit || onlySee))" v-show="!data.item.isEdit">添加</b-button>
                            </template>
                            <template slot="checkTemplateDetailCarAddInfoList" slot-scope="data">
                                <div class="add-box">
                                    <div class="addcar-item" v-for="(item, index) of data.value" :key="index">
                                    <span>{{item.carAddName}}</span>
                                        <i  v-show="(!onlySee) && !data.item.isEdit" @click="delAddCar(item, data.index, index)" class="fa fa-remove bg-danger p-1  ml-3 float-right white"></i>
                                    </div>
                                    <b-button size="sm" variant="waring"  @click="showModel2(data.value, data.index)" class="addcar-add" v-show=" (!onlySee) && !data.item.isEdit">
                                        <i class="el-icon-plus"></i>
                                    </b-button>
                                </div>
                            </template>
                            <template slot="empty">
                                暂无数据...
                            </template>
                        </b-table>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="适用范围">
            <div class="animated fadeIn">
                 <scope ref="scope" :disabled="(onlySee || !isStop)" :pageData="scopePageData" @page-change="queryCardTemplateUseRangeInfo" :multipleSelection="true" :fields="fields" @deletScopeBtn="deletScopeBtn"  :addscope="addscope" :tablist="scopeList"></scope>
            </div> 
            </el-tab-pane>
        </el-tabs>
        <b-modal id="modalRemark" title="话术编辑" ref="modalRemark" @hidden="modelHidden">
            <textarea v-model="remark" class="remark-textarea" placeholder="最多200字" id="data.item.index" @input="checkStrLength(remark)">
            </textarea>
            <span class="hint-text-leng">{{remark.length}} / 200</span>
            <div slot="modal-footer" class="w-100">         				
				<b-btn size="sm" class="float-right" variant="success" @click="sureRemark">确定</b-btn>
				<b-btn size="sm" class="float-right mr-2" variant="seconday" @click="cancelModal">取消</b-btn>
			</div>
        </b-modal>
        <caraddSelect ref="selectCAddModel" :addedModelList="addedModelList" @selectCarAdd="selectCarAdd"></caraddSelect>     
    </div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import Pagination from 'components/pagination/pagination'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import AreaTree from 'components/iris-areaqueryshop/index'
import carInfo from 'components/iris-carinfo'
import caraddSelect from './caradd-select'
import scope from 'components/iris-scope'
import {Table, TableColumn, Message,Tabs, TabPane, Input, MessageBox } from "element-ui"
import {hasBtn} from 'common/api-common.js'
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'
import {AFTER_SALE_INSPECTION, CHECK_TYPE} from 'common/ref-code.js'
import {CHECK_TEMPLATE_SEQ, CHECK_TEMPLATE_DETAIL_SEQ, CHECK_TEMPLATE_USERANGE_SEQ, CHECK_TEMPLATE_DETAIL_CARADD_SEQ} from 'common/sequence.js'

Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Input);


export default {
    components: {
       QueryBtnGroup,
       Pagination,
       carInfo,
       AreaTree,
       scope,
       caraddSelect,
    },
    data() {
        return {
            checkTemplateCode:'',
            refTemplateCode: '',
            carFlag: config.carFlag,
            dataModel: {
                checkTemplateCode: '',
                checkTemplateName: '',
                checkTypeCode: '',
                templateType: '1',
                refTemplateCode: '',
                factoryCode: '',
                brandCode: '',
                seriesCode: '',
                modelCode: '',
            },
            inp: {
                 checkTemplateName: null,
                 refTemplateCode: null,
                 checkTypeCode: null,
            },
            headVerify: true,
            isHeadSave: false,
            scopeList:[],
            scopePageData:{},
            fields:[{label:"销售区域",name:"salesAreaName",},{label:"行政区域",name:"chinaAreaName",},{label:"门店",name:"storeName"}],
            storeInfoVo: '',
            selCont:'',
            paginationData: {
                total: 0,
                totalPages: 1,
                pageNo: 1,
                pageSize: config.pageNums
            },
            carInfoModel: {

            },
            model: {
                code: "1",
            },
            useRanges: [],
            fieldsA:{

            },
            fieldsEidt: {
					sel: {
						label: "选择"
					},
					refTemplateCode: {
						label: "引用模板编码"
					},
					orderNumber: {
						label: "顺序号"
					},
					checkItemTypeCode: {
						label: "检查分类"
					},				
					checkItem: {
						label: "检查项"
					},
					checkResult1: {
						label: "结果1"
					},
					checkResult2: {
						label: "结果2"
					},
					checkResult3: {
						label: "结果3"
                    },
                    checkResult4: {
						label: "结果4"
                    },
                    checkResult5: {
						label: "结果5"
                    },
                    verbalTrick: {
						label: "话术"
                    },
                    checkTemplateDetailCarAddInfoList: {
						label: "扩展属性关联"
                    },
            },
            fieldsSee: {
					refTemplateCode: {
						label: "引用模板编码"
					},
					orderNumber: {
						label: "顺序号"
					},
					checkItemTypeCode: {
						label: "检查分类"
					},				
					checkItem: {
						label: "检查项"
					},
					checkResult1: {
						label: "结果1"
					},
					checkResult2: {
						label: "结果2"
					},
					checkResult3: {
						label: "结果3"
                    },
                    checkResult4: {
						label: "结果4"
                    },
                    checkResult5: {
						label: "结果5"
                    },
                    verbalTrick: {
						label: "话术"
                    },
                    checkTemplateDetailCarAddInfoList: {
						label: "扩展属性关联"
                    },
            },
            tabldeList:[],
            // 已添加扩展信息条目
            addedModelList: [],	
            // 当前编辑index
            eidtInd: -1,
            remark: '',
            checkTempateTypelList: [],
            checkTypelList: [],
            addModel: {
                refTemplateCode: '',
                orderNumber: '',
                checkItemTypeCode: '',
                checkItem: '',
                checkResult1: '',
                checkResult2: '',
                checkResult3: '',
                checkResult4: '',
                checkResult5: '',
                verbalTrick: '',
                checkTemplateDetailCarAddInfoList: [],
                isEdit: false,
            },
            skuCarAddCode: config.skuCar.skuCarAddCode,
            // 是否停用
            isStop: false,
            onlySee: false,
            isEidtHead: false,
        }
    },
    computed: {
        ...mapState('checkTemplate',[
				'templateList',
				'searchParam',
				'pages'
            ]),
        carValidateLen() {
            let  a = this.carFlag ? 2 : 1;
            return a;
        },
        storeName() {
            let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            let stroe = userInfo.hasOwnProperty('userAvailableInfo') 
                    ? userInfo.userAvailableInfo.storeInfoVo
                    : null
            this.storeInfoVo = stroe;
            if(stroe) {
                return stroe.storeName;
            }else {
                return '';
            }
        },
        isEidtParchaseCar(){
				return hasBtn(collectionApi.skuCar.editSelfPurchaseBatchInfo);
			},
    },
    created() {
       this.getCheckTempateTypelist();
       this.getCheckTypelist();
       this._initData();
    },
    methods: {
        ...mapActions('checkTemplate',[
				'setTableList',
				'setSearchParam',
				'setPages',
                'getTemplateTabList',
            ]),
        // 获取检查类型
        getCheckTempateTypelist() {
            let _this = this;
            const option = {
                'refCode': AFTER_SALE_INSPECTION
            }
            api.ref.getDataDictionarys(option, (res) => {
                if (res.data.code === 'success') {
                    let data = res.data.obj.referenceDetailInfos;
                    let arr = []
                    data.forEach((item, index) => {
                        let obj = {
                            value: item.refDetailCode,
                            text: item.refDetailName
                        }
                        arr.push(obj);
                    })
                    _this.checkTempateTypelList = arr;
                }
            })
        },
        // 获取检查分类
        getCheckTypelist() {
            let _this = this;
            const option = {
                'refCode': CHECK_TYPE
            }
            api.ref.getDataDictionarys(option, (res) => {
                if (res.data.code === 'success') {
                    let data = res.data.obj.referenceDetailInfos;
                    let arr = []
                    data.forEach((item, index) => {
                        let obj = {
                            value: item.refDetailCode,
                            text: item.refDetailName
                        }
                        arr.push(obj);
                    })
                    _this.checkTypelList = arr;
                }
            })
        },
        // 生成明细code
        createDetailCode(val) {
            const option = {
                'serviceCode': val,
            }
            return new Promise((reslove,reject) => {
                api.ordinalInfo.getSequence(option, (res) => {
                    if(res.data.code === 'success') {							
                        reslove(res.data.obj)
                    };
                })
            })				
        },
        // 批量生成明细refcode
        createDetailCodeList(code, num) {
            const option = {
                'serviceCode': code,
                'getNums': num ? num : 1
            }
            return new Promise((reslove,reject) => {
                api.ordinalInfo.getSequenceList(option, (res) => {
                    if(res.data.code === 'success') {							
                        reslove(res.data.obj)
                    };
                })
            })				
        },
        // 验证车型选择
        validCar(val) {
            this.headVerify = val;
        },
        // 获取表头信息
        getHeadInfo(val) {
            let param = {
                checkTemplateCode: val
            }
            return new Promise((reslove,reject) => {
                api.checkTemplate.queryCheckTemplateInfoNoPage(param,res => {
                    if(res.data.code === 'success') {							
                        reslove(res.data.obj);
                    };
                })
            })		          
        },
        // 获取明细信息
        getDetailInfo(val) {
            let param = {
                checkTemplateCode: val
            }
            return new Promise((reslove,reject) => {
                api.checkTemplate.queryCheckTemplateDetailInfoNoPage(param,res => {
                    if(res.data.code === 'success') {	
                        let obj = res.data.obj;
                        for(let [i, item] of  obj.entries()) {
                            if(item.refTemplateCode) {
                                obj[i].isEdit = true;
                            }                         
                        }						
                        reslove(res.data.obj);
                    };
                })
            })		          
        },
        // 获取使用范围信息
        getUseRangeInfo(val) {
            let param = {
                checkTemplateCode: val
            }
            return new Promise((reslove,reject) => {
                api.checkTemplate.queryCheckTemplateUseRangeInfoNoPage(param,res => {
                    if(res.data.code === 'success') {							
                        reslove(res.data.obj);
                    };
                })
            })		          
        },
        _initData(val) {
             let _this = this;
            let param;
            let routeQuery = this.$route.query;
            if(routeQuery.onlySee && routeQuery.onlySee.toString() == 'true') {
                _this.onlySee = true;
                this.fieldsA = this.fieldsSee;
            }else {
                _this.onlySee = false;
                this.fieldsA = this.fieldsEidt;
            }
            if((routeQuery.checkTemplateCode == undefined || routeQuery.checkTemplateCode == '') && val == undefined ) {
				 this.createDetailCode(CHECK_TEMPLATE_SEQ).then(res => {
                    this.dataModel.checkTemplateCode = res;
                })
            }else {
                this.checkTemplateCode =  val ? val : routeQuery.checkTemplateCode;
                let param = {
                    checkTemplateCode:this.checkTemplateCode
                }
                
                api.checkTemplate.getCheckTemplateInfoByCode(param, res => {
                     if(res.data.code === 'success') {		
                        let reslut = res.data.obj					
                        if(reslut != null) {
                            this.dataModel = Object.assign({}, reslut);
                            this.refTemplateCode =  this.dataModel.refTemplateCode;
                            delete this.dataModel.checkTemplateDetailInfoList;
                            delete this.dataModel.checkTemplateUseRangeInfoList;
                            let carInfo = {
                                factoryCode: reslut.factoryCode,
                                brandCode: reslut.brandCode,
                                seriesCode: reslut.seriesCode,
                                modelCode: reslut.modelCode,
                            }
                            this.$refs.carInfo.setValue(carInfo);
                            this.isHeadSave = true;
                            if(reslut.checkTemplateStatus == 0) {
                                this.isStop = false;
                            }else {
                                this.isStop = true;
                            }
                            if(reslut.checkTemplateDetailInfoList.length != 0) {
                                for(let [i, item] of reslut.checkTemplateDetailInfoList.entries()) {
                                    if(item.refTemplateCode) {
                                        reslut.checkTemplateDetailInfoList[i].isEdit = true;
                                    }else if( this.isStop && !item.refTemplateCode ){
                                        reslut.checkTemplateDetailInfoList[i].isEdit = false;
                                    }else if( (!this.isStop) && !item.refTemplateCode ){
                                        reslut.checkTemplateDetailInfoList[i].isEdit = true;
                                    }
                                }
                                this.tabldeList = [...reslut.checkTemplateDetailInfoList];
                            }else {
                                this.tabldeList = [];
                            }
                            if(reslut.checkTemplateUseRangeInfoList.length != 0) {

                            }
                        }else {
                            this.isHeadSave = false;
                        }
                    };
                })
                // this.getHeadInfo(routeQuery.checkTemplateCode).then(res => {
                //     this.dataModel = res;
                //     let carInfo = {
                //         factoryCode: res.factoryCode,
                //         brandCode: res.brandCode,
                //         seriesCode: res.seriesCode,
                //         modelCode: res.modelCode,
                //     }
                //     this.$refs.carInfo.setValue(carInfo);
                //     this.isHeadSave = false;
                // });
                // this.getDetailInfo(routeQuery.checkTemplateCode).then(reslut => {
                //     for(let [i, item] of reslut.entries()) {
                //         if(item.refTemplateCode) {
                //             reslut[i].isEdit = true;
                //         }
                //     }
                //     this.tabldeList = [...reslut];
                // });
                this.queryCardTemplateUseRangeInfo(this.checkTemplateCode);
            }
        },
        saveHead() {
            this.$refs.carInfo.validate();
            for(let key of Object.keys(this.inp)) {
                 this.inp[key] = null;
                if(this.dataModel[key] === '') {
                    if(key == 'refTemplateCode' && this.dataModel.templateType == '1') {
                        continue
                    }
                    this.inp[key] = 'invalid'
                    this.headVerify = false;
                    Message({
                        type: "warning",
                        message: "信息未填写完整！"
                    }); 
                                          
                }
            }
            if(this.dataModel.templateType == '1') {
                this.dataModel.refTemplateCode = '';
            }else if(this.dataModel.templateType == '0'){
                if(this.dataModel.checkTemplateCode == this.dataModel.refTemplateCode) {
                    this.headVerify = false;
                    this.inp.refTemplateCode = 'invalid'
                    Message({
                        type: "warning",
                        message: "引用模板号不可与本模板号相同！"
                    }); 
                }
            }
           
            if(!this.headVerify) {
                return;
            }
            let param = Object.assign({}, this.dataModel);
            param.checkTemplateStatus = '1';
            if(!param.id) {
                api.checkTemplate.insertCheckTemplateInfo(param,res => {
                    if(res.data.code == 'success'){
                         Message({
                            type: "success",
                            message: "保存成功！"
                        });
                        this.setData(res.data.obj);
                        this.getTemplateTabList(this.searchParam);
                    }
                   
                })
            }else {
                api.checkTemplate.updateCheckTemplateInfo(param,res => {
                    if(res.data.code == 'success'){
                        Message({
                            type: "success",
                            message: "保存成功！"
                        });
                        this.setData(res.data.obj);
                        this.getTemplateTabList(this.searchParam);
                    }
                })
            }
            
            
        },
        setData(obj) {
            this.isEidtHead = false;
            this.dataModel.id = obj.id;
            this.dataModel.isDeleted = obj.isDeleted;
            this.isStop = true;
            this.isHeadSave = true;
            let arr = [];
            if(this.tabldeList.length != 0) {
                let param = []
                for( let [i, item] of this.tabldeList.entries()) {
                    if(item.id) {
                        param.push(item);
                    }
                }
                for( let [i, item] of param.entries()) {
                    if(!item.refTemplateCode) {
                        arr.push(item);
                    }else {
                        param[i].isDeleted = 1;
                    }
                }
                if(param.length != 0) {
                     api.checkTemplate.editCheckTemplateDetailInfo(param, res => {
                        // Message({
                        //     type: "success",
                        //     message: "保存成功！"
                        // });
                    })
                }
            }
            
            this.tabldeList = arr;
            let orgLen = arr.length;
            if(this.dataModel.templateType == '0' && this.dataModel.refTemplateCode != '') {
                this.getDetailInfo(this.dataModel.refTemplateCode).then(res => {                 
                    if(res.length == 0) {
                        Message({
                            type: "warning",
                            message: "该引入模板明细为空！"
                        });
                        return
                    }
                    this.tabldeList = [ ...res, ...arr];
                    let refLen = res.length;
                    this.createDetailCodeList(CHECK_TEMPLATE_DETAIL_SEQ, this.tabldeList.length).then( reslut => {                  
                        for(let [i, item] of  this.tabldeList.entries()) {
                            if(i < refLen ) {
                                this.tabldeList[i].refTemplateCode = this.tabldeList[i].checkTemplateCode;
                                this.tabldeList[i].refTemplateDetailCode = this.tabldeList[i].templateDetailCode;                              
                                this.tabldeList[i].isEdit = true;
                                delete this.tabldeList[i].id;
                            }      
                            if(!this.tabldeList[i].id) {
                                this.tabldeList[i].checkTemplateDetailCode = reslut[i];                         
                                this.tabldeList[i].checkTemplateCode = this.dataModel.checkTemplateCode;   
                            }                           
                            let carAddL = this.tabldeList[i].checkTemplateDetailCarAddInfoList;
                            if(carAddL.length != 0) {
                                this.createDetailCodeList(this.skuCarAddCode, carAddL.length).then( resAdd => {                                                                      
                                    for(let [j, val] of this.tabldeList[i].checkTemplateDetailCarAddInfoList.entries()) {
                                        if(i < refLen ) {
                                            delete this.tabldeList[i].checkTemplateDetailCarAddInfoList[j].id;
                                            this.tabldeList[i].checkTemplateDetailCarAddInfoList[j].refTemplateCode =  this.tabldeList[i].checkTemplateDetailCarAddInfoList[j].checkTemplateCode;
                                            this.tabldeList[i].checkTemplateDetailCarAddInfoList[j].refTemplateDetailCode =  this.tabldeList[i].checkTemplateDetailCarAddInfoList[j].checkTemplateDetailCode;
                                            this.tabldeList[i].checkTemplateDetailCarAddInfoList[j].refRelationCode =  this.tabldeList[i].checkTemplateDetailCarAddInfoList[j].relationCode;
                                        }
                                        this.tabldeList[i].checkTemplateDetailCarAddInfoList[j].checkTemplateCode =this.dataModel.checkTemplateCode;
                                        this.tabldeList[i].checkTemplateDetailCarAddInfoList[j].checkTemplateDetailCode =this.tabldeList[i].checkTemplateDetailCode;
                                        this.tabldeList[i].checkTemplateDetailCarAddInfoList[j].relationCode = resAdd[j];
                                    }      
                                                                                              
                                })
                            }                 
                        }
                    })                     
                })
            }else if(this.dataModel.templateType == '1') {
                let arr = [];
                for( let [i, item] of this.tabldeList.entries()) {
                    if(!item.refTemplateCode) {
                        arr.push(item);
                    }
                }
                this.tabldeList = arr;
            }
        },
        eidtHead() {
            this.isHeadSave = false;
            this.isEidtHead = true;
        },
        startUse(onoff) {
            let param = Object.assign({}, this.dataModel);
            param.checkTemplateStatus = onoff;
            api.checkTemplate.updateCheckTemplateInfo(param,res => {
                if(res.data.code == 'success'){
                    Message({
                        type: "success",
                        message: onoff?"启用成功":"停用成功！"
                    });
                    this._initData(this.dataModel.checkTemplateCode);
                    this.getTemplateTabList(this.searchParam);
                }
            })
        },
        addCheckItem() {
            let param = Object.assign({}, this.addModel)
            this.createDetailCode(CHECK_TEMPLATE_DETAIL_SEQ).then(res => {
                param.checkTemplateDetailCode = res;
                param.checkTemplateCode = this.dataModel.checkTemplateCode;
                this.tabldeList.push(param);
            })
        },
        delCheckItem() {
            if(this.selCont === "") {
                Message({
                    type: "warning",
                    message: "请选择删除项！"
                });
                return;
            }
            if(this.selCont.refTemplateCode != '' && this.selCont.refTemplateCode != undefined) {
                Message({
                    type: "warning",
                    message: "引用模板不可删除"
                });
                return;
            }
            if(this.selCont.id != undefined) {
                this.selCont.isDeleted = '1';
                api.checkTemplate.editCheckTemplateDetailInfo([this.selCont],res => {
                    if(res.data.code == 'success'){ 
                        Message({
                            type: "success",
                            message: "删除成功！"
                        });
                        this.getDetailInfo(this.dataModel.checkTemplateCode).then(reslut => {   
                            this.tabldeList = [...reslut];
                        })
                        this.getTemplateTabList(this.searchParam);
                    }
                })
            }else {
                for(let [i, item] of this.tabldeList.entries()) {
                    this.tabldeList.splice(this.tabldeList.indexOf(this.selCont), 1);
                    break;
                };
            }
            
            this.selCont = "";
        },
        saveDetail() {
            for(let [i, item] of this.tabldeList.entries()) {
                this.tabldeList[i].orderNumber = i + 1;
                if(item.checkItem == '') {
                    Message({
                        type: "warning",
                        message: "检查项目不可为空！"
                    });
                    return;
                }else if(item.checkResult1 == '') {
                     Message({
                        type: "warning",
                        message: "结果1不可为空！"
                    });
                    return;
                }
            }
            let param = [...this.tabldeList];
            api.checkTemplate.editCheckTemplateDetailInfo(param,res => {
                if(res.data.code == 'success'){ 
                    Message({
                        type: "success",
                        message: "保存成功！"
                    });
                    this.getDetailInfo(this.dataModel.checkTemplateCode).then(reslut => {
                        for(let [i, item] of reslut.entries()) {
                            if(item.refTemplateCode) {
                                reslut[i].isEdit = true;
                            }
                        }
                        this.tabldeList = [...reslut];
                    })
                    this.getTemplateTabList(this.searchParam);
                }
            })
           
        },
        showModel2(val, index) {
            this.addedModelList = [...val];
            this.eidtInd = index;
            this.$refs.selectCAddModel.showModel();
        },  
        // 编辑话术
        eidtRemark(val, index, onoff) {
            if(onoff == true) {
                return
            }
            this.$refs.modalRemark.show();
            this.remark = val;
            this.eidtInd = index;
        },  
        sureRemark() {
            this.tabldeList[this.eidtInd].verbalTrick = this.remark;
            this.$refs.modalRemark.hide();
        },
        cancelModal() {
            this.$refs.modalRemark.hide();
        },    
        modelHidden() {
            this.remark = '';
            this.eidtInd = -1;
        },     
        // 删除关联车型扩展属性
        delAddCar(item, index, i) {
            this.tabldeList[index].checkTemplateDetailCarAddInfoList[i].isDeleted = '1';
            api.checkTemplate.editCheckTemplateDetailInfo([this.tabldeList[index]],res => {
                if(res.data.code == 'success'){ 
                     Message({
                        type: "success",
                        message: "删除成功！"
                    });
                    this.getDetailInfo(this.dataModel.checkTemplateCode).then(reslut => {
                        this.tabldeList = [...reslut];
                    })
                }
               
            })
            // this.tabldeList[index].checkTemplateDetailCarAddInfoList.splice(i, 1);
        },
        selectCarAdd(val) {
            let len = val.length;
            this.createDetailCodeList(this.skuCarAddCode, len).then( res => {
                for(let [i, item] of val.entries()) {
                    val[i].checkTemplateCode =this.dataModel.checkTemplateCode;
                    val[i].checkTemplateDetailCode =this.tabldeList[this.eidtInd].checkTemplateDetailCode;
                    val[i].relationCode = res[i];
                }
                this.tabldeList[this.eidtInd].checkTemplateDetailCarAddInfoList = this.tabldeList[this.eidtInd].checkTemplateDetailCarAddInfoList.concat(val);
            })
           
        },
        //查询适用范围
        queryCardTemplateUseRangeInfo(val){
            const _this = this;
            _this.scopeList = []                
            api.checkTemplate.queryCheckTemplateUseRangeInfoNoPage({checkTemplateCode: val},(msg)=>{
                if(msg.data.code == 'success'){
                    let data = msg.data.obj;
                    _this.scopePageData = msg.data.obj
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        element.code = element.chinaAreaCode || element.salesAreaCode || element.storeCode
                        element.name = element.chinaAreaName || element.salesAreaName || element.storeName
                        element.type = (element.chinaAreaCode && '行政区域') || (element.salesAreaCode && '销售区域') || (element.storeCode && '经销商店')
                    }
                    _this.scopeList = data;
                }                    
            })
        },
        //添加使用范围
        addscope(code , data){
            const _this = this;
            if(Array.isArray(data)){
                //批量
                api.ordinalInfo.getSequenceList({
                'serviceCode': 'CHECKTEMPLATEUSERANGESEQ',
                'getNums': data.length
                },(msg) => {
                    if(msg.data.message == 'success'){
                        let SEQ = msg.data.obj
                        let list = []
                        let codes = []
                            if(code == config.scopeType.sales){
                                for (let index = 0; index < SEQ.length; index++) {
                                    const element = SEQ[index];
                                    codes.push(data[index].code)                                        
                                    list[index]={
                                        rangeCode:element,
                                        checkTemplateCode:_this.dataModel.checkTemplateCode,
                                        salesAreaCode:data[index].code,
                                        salesAreaName:data[index].name,                                          
                                    }
                                }
                            }
                            if(code == config.scopeType.shop){
                                for (let index = 0; index < SEQ.length; index++) {
                                    const element = SEQ[index];
                                    codes.push(data[index].code)
                                    list[index]={
                                        rangeCode:element,
                                        checkTemplateCode:_this.dataModel.checkTemplateCode,
                                        storeCode:data[index].code,
                                        storeName:data[index].name,                                                                                 
                                    }
                                }
                            }
                            if(code == config.scopeType.government){
                                for (let index = 0; index < SEQ.length; index++) {
                                    const element = SEQ[index];
                                    codes.push(data[index].code)
                                    list[index]={
                                        rangeCode:element,
                                        checkTemplateCode:_this.dataModel.checkTemplateCode,
                                        chinaAreaCode:data[index].code,
                                        chinaAreaName:data[index].name,                                          
                                    }
                                }
                            }
                        let str = ""
                        for (let j = 0; j < _this.scopeList.length; j++) {
                            const element = _this.scopeList[j];
                            if(codes.includes(element.code)){
                                str += element.name + ' '
                            }
                        }
                        if(str!==""){
                            MessageBox.confirm(`${str}已存在！`, '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                            }).catch(() => {
                            });
                            return;
                        }
                        api.checkTemplate.editCheckTemplateUseRangeInfo(list, (res) => {
                            if(res.data.code === 'success') {							
                                Message({
                                    type: "success",
                                    message: "保存成功！"
                                });
                                this.queryCardTemplateUseRangeInfo(this.dataModel.checkTemplateCode);
                                this.getTemplateTabList(this.searchParam);
                            };
                        })
                        _this.$refs.scope.activePage()
                    } 
                })             
            }       
        },
        //删除使用范围
        deletScopeBtn(data){
            const _this = this;
            data.isDeleted = 1
            api.checkTemplate.editCheckTemplateUseRangeInfo([data], (res) => {
                if(res.data.code === 'success') {							
                    Message({
                        type: "success",
                        message: "删除成功！"
                    });
                    this.queryCardTemplateUseRangeInfo(this.dataModel.checkTemplateCode);
                    this.getTemplateTabList(this.searchParam);
                };
            })
        },
        carSelect(val) {
            let obj = {};
            for(let item of Object.keys(val)) {
                if(item == "ioTypeCode") {
                    obj["iotypeCode"] = val[item];
                }else if(item == "ioTypeName") {
                    obj["iotypeName"] = val[item];
                }else {
                    obj[item] = val[item];
                }		
            }
            let reObject = Object.assign({},this.carInfoModel, obj);
            this.dataModel.factoryCode = reObject.factoryCode;
            this.dataModel.brandCode = reObject.brandCode;
            this.dataModel.seriesCode = reObject.seriesCode;
            this.dataModel.modelCode = reObject.modelCode;
        },
        moveItem(type) {
            if(!this.selCont) {
                Message({
                    type: 'warning',
                    message:'未选择条目'
                });
                return;
            }
            let index = this.tabldeList.indexOf(this.selCont);
            let insetIndUp = index - 1;
            let insetIndDown = index + 1;           
            if(type === "up") {     
                if(insetIndUp == -1) {
                    Message({
                        type: 'warning',
                        message:'已移动到顶部'
                    });
                    return;
                }
                this.tabldeList.splice(index, 1);
                this.tabldeList.splice(insetIndUp, 0, this.selCont);
            }else if(type === "down") {               
                if(insetIndDown == this.tabldeList.length) {
                    Message({
                        type: 'warning',
                        message:'已移动到底部'
                    });
                    return;
                }
                this.tabldeList.splice(index, 1);
                this.tabldeList.splice(insetIndDown, 0, this.selCont);
            }
            
        },	
        getBack() {
             this.$router.push({name: 'check-template'}); 
        },
        checkStrLength(val) {
            if(val.length > 200) {
                Message({
                    message: '不可超过200字!',
                    type: 'warning'
                });
                this.remark = val.substr(0, 200);
            }
        },
        inputResult(val, ind, key) {
            this.tabldeList[ind][key] = val;
        },
    },
    watch:{
        modelName(val){
            this.getModelAdd(val);
        },
        '$route': '_initData',
    }
}
</script>

<style scoped>
.check-t-w100{
    width: 100px!important;
}
.check-t-w160{
     width: 160px!important;
}
.check-textarea-w170{
    width: 170px!important;
    border-radius: 6px!important;
}
.car-add-search{
	padding: 5px 14px;
}
.car-add-box{
	width: 100%;
	height: 370px;
	overflow: auto;
}
.checkbox-box{
	display: block;
}
.addcar-item {
    display: inline-block;
    border: 1px solid #c2cfd6;
    font-size: 14px;
    margin-right: 4px;
    margin-bottom: 4px;
}
.add-box{
    width: 250px;
}
.addcar-add{
    color: #fff;
    padding: 2px 8px!important;
    background-color: #5EB870!important;
    margin-top: -2px!important;
}
.remark-textarea{
    width: 100%;
    height: 200px;
}
.hint-text-leng{
    position: absolute;
    right:20px;
    bottom: 34px;
    color: #000;
}
.remark-sm{
    display: inline-block;
    width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border: none;
    outline: none;
}
</style>
