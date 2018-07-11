<template>
    <div class="animated fadeIn">
        <b-card header="查询">
             <div class="row">                       
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="销售区域" :label-cols="4" class="text-right">
                        <AreaTree @select-change="selectedfun" ref="areaqueryshop" :storeAll='true'></AreaTree>
                    </b-form-fieldset>
                 </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="模板名称" :label-cols="4" class="text-right">
                        <b-form-input v-model="searchModel.checkTemplateName"/>
                    </b-form-fieldset>
                </div>
                <div class="col-md-4">
                    <b-form-fieldset horizontal label="模板类型" :label-cols="4" class="text-right">
                        <b-form-select :options="templateTypeList" v-model="searchModel.templateType">
                        </b-form-select>
                    </b-form-fieldset>
                </div>
                
            </div>
            <car-info @callBack="carSelect" :col='3' :showLength="4" ref="carInfo"></car-info>
            <span :style="{'position': 'absolute','left': carFlag?'0.6%':'33.6%','margin-top': carFlag?'0px':'-52px', 'width':'66%'}">
                <div class="col-md-6 pull-right">
                    <b-form-fieldset horizontal label="状态" :label-cols="4" class="text-right">
                        <b-form-select :options="checkTemplateStatusList"  v-model="searchModel.checkTemplateStatus">
                        </b-form-select>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 pull-right">
                    <b-form-fieldset horizontal label="检查类型" :label-cols="4" class="text-right">
                        <b-form-select :options="checkTypelList" v-model="searchModel.checkTypeCode">
                        </b-form-select>
                    </b-form-fieldset>
                </div>
            </span>
            <query-btn-group @resetClick="reset" @query="search" :style="{'margin-top':carFlag?'52px':'0px',}"></query-btn-group>
        </b-card>
         <b-card>
            <div class="row">              
                <div class="col-md-6">
                    <b-button size="sm" variant="success" @click="add" v-if="isAddTemplate">新增</b-button>
                    <b-button size="sm" variant="primary" @click="eidt" v-if="isEidtTemplate">编辑</b-button>                 
                </div>
            </div>
            <div class="table-scrollable mb-2">
                 <b-table striped hover bordered show-empty :items="templateList" :fields="fields">
					<template slot="sel" slot-scope="data">
						<input type="radio" name="radio"  v-model="selCont" :value="data.item"/> 
					</template>
					<template slot="checkTemplateCode" slot-scope="data">
						<a href="javascript:;" @click.prevent="detail(data.value)">{{ data.value }}</a>						
					</template>
                    <template slot="checkTypeName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="checkTemplateName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="factoryName" slot-scope="data">
						{{ data.value}}
					</template>		
					<template slot="brandName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="seriesName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="modelName" slot-scope="data">
						{{ data.value}}
					</template>
					<template slot="salesArea" slot-scope="data">
						{{ data.value}}
					</template>
                    <template slot="checkNums" slot-scope="data">
						{{ data.value}}
					</template>
                    <template slot="templateType" slot-scope="data">
						{{ data.value | templateTypeFliter}}
					</template>
                    <template slot="checkTemplateStatus" slot-scope="data">
						{{ data.value | isStatusFliter}}
					</template>
					<template slot="empty">
						暂无数据...
					</template>
				</b-table>
            </div>
            <div class="row"> 
                <div class="col-md-12">
                    <pagination class="pull-right" 
                    @page-change="search" 
                    :page-no="pages.pageNum" 
                    :page-size="paginationData.pageSize" 
                    :total-pages="pages.totalPages" 
                    :total-result="pages.total">
                    </pagination>
                </div>
            </div>
         </b-card>
    </div>
</template>
<script>
import Vue from "vue"
import {mapState, mapMutations, mapActions} from 'vuex'
import Pagination from 'components/pagination/pagination'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import AreaTree from 'components/iris-areaqueryshop/index'
import carInfo from 'components/iris-carinfo'
import {Table, TableColumn, Message } from "element-ui"
import {hasBtn} from 'common/api-common.js'
import collectionApi from 'common/api-collection.js'
import api from 'common/api'
import config from 'common/config'
import {AFTER_SALE_INSPECTION} from 'common/ref-code.js'

Vue.use(Table);
Vue.use(TableColumn);

export default {
    components: {
       QueryBtnGroup,
       Pagination,
       carInfo,
       AreaTree,
    },
    data() {
        return {
            carFlag: config.carFlag,
            storeInfoVo: '',
            selCont:[],
            paginationData: {
                total: 0,
                totalPages: 1,
                pageNo: 1,
                pageSize: config.pageNums
            },
            searchModel: {
                storeCodes: [],
                checkTemplateName: '',
                factoryCode: '',
                brandCode: '',
                seriesCode: '',
                modelCode: '',
                checkTemplateStatus: '',
                templateType: '0',
            },
            checkTemplateStatusList: config.checkTemplate.checkTemplateStatusList,
            templateTypeList: config.checkTemplate.templateTypeList,
            fields: {
					sel: {
						label: "选择"
					},
					checkTemplateCode: {
						label: "模板编码"
                    },
                    checkTypeName: {
                        label: "检查类型"
                    },
					checkTemplateName: {
						label: "名称"
					},
					factoryName: {
						label: "厂家"
					},				
					brandName: {
						label: "品牌"
					},
					seriesName: {
						label: "车系"
					},
					modelName: {
						label: "车型"
					},
					salesArea: {
						label: "使用范围（销售区域）"
                    },
                    checkNums: {
						label: "检查项目个数"
                    },
                    templateType: {
						label: "模板类型"
                    },
                    checkTemplateStatus: {
						label: "状态"
                    },
            },
            tabldeList:[
                {
                    code: '1',
                    name: '1',
                    factroy: '1',
                    brand: '1',
                    serise: '1',
                    model: '1',
                    rangs: '1',
                    num: '1',
                    type: '1',
                    status: '1',
                }
            ],
            checkTypelList: [],
        }
    },
    created() {
        this.getCheckTempateTypelist();
    },
    computed: {
        ...mapState('checkTemplate',[
				'templateList',
				'searchParam',
				'pages'
            ]),
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
        isEidtTemplate(){
				return hasBtn(collectionApi.checkTemplate.updateCheckTemplateInfo);
        },
        isAddTemplate(){
				return hasBtn(collectionApi.checkTemplate.insertCheckTemplateInfo);
		},
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
                    let arr = [{
                        value: '',
                        text: ''
                    }]
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
        //区域选择门店
        selectedfun(data, data1) {
            const _this = this;
            const options = {
                storeCodeSet: []
            };
            if(data1 instanceof Array){
                _this.searchModel.storeCodes = []
                for (let i = 0; i < data1.length; i++) {
                    _this.$set(_this.searchModel.storeCodes, i, data1[i].value);              
                }
            }else{
                options.storeCodeSet.push(data1.value);
                _this.searchModel.storeCodes = [data1.value];
            }
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
            this.searchModel.factoryCode = reObject.factoryCode;
            this.searchModel.brandCode = reObject.brandCode;
            this.searchModel.seriesCode = reObject.seriesCode;
            this.searchModel.modelCode = reObject.modelCode;
        },	
        reset() {
            for(let key of Object.keys(this.searchModel)) {
                this.searchModel[key] = '';
            }
            this.$refs.areaqueryshop.reset();
            this.$refs.areaqueryshop.resetToStart();
            this.$refs.carInfo.clear();
        },
        search(pageNo){
           
            pageNo ? this.paginationData.pageNo = pageNo : this.paginationData.pageNo = 1;
            let param = {
                pageNums: this.paginationData.pageSize,
				pageStart: this.paginationData.pageNo
            }
            Object.assign(param, this.searchModel)
             console.log(param)
            this.setSearchParam(param);
            this.getTemplateTabList(param);
        },
        eidt() {
            if(this.selCont.length == 0) {
                Message({
                    message: '请选择模板!',
                    type: 'warning'
                });
            }else {
                this.$router.push({name: 'check-template-eidt', query: {checkTemplateCode: this.selCont.checkTemplateCode,  onlySee: false}});        
            }        
        },
        add() {
            this.$router.push({name: 'check-template-add'});
        },
        detail(val) {
             this.$router.push({name: 'check-template-detail', query: {checkTemplateCode: val,  onlySee: true}});  
        }
    },
    filters:{
        isStatusFliter(val) {
            if(val == '0') {
                return '启用';
            }else if(val == '1') {
                return '停用';
            }
        },
        templateTypeFliter(val) {
            if(val == '0') {
                return '通用';
            }else if(val == '1') {
                return '自定义';
            }
        },
    }
}
</script>