<template>
    <div>
        <b-card header="查询">
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="SKU编码" :label-cols="4" class="text-right">
                        <b-form-input  v-model="params.skuCode" />
                    </b-form-fieldset> 
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="商品名称" label-text-align="right" :label-cols="4">
                        <search 
                        ref="search"
                        :hasCheck="required"
                        :dataList="datalist"  
                        option="skuName" 
                        @dataChange="querySelect"
                        @itemValue="itemValue"
                        @clickShowBack="firstLoad"
                        @comScroll="comScroll"
                        :disabled="isforbidden"
                        >
                        </search>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="审批状态" label-text-align="right" :label-cols="4">
                        <b-form-select  v-model="params.wfStatus" :options="approvaStateList"/>
                    </b-form-fieldset>
                </div>
                <!-- <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="账期" label-text-align="right" :label-cols="4">
                            <b-form-select v-model="params.beTermNo" :options="beTermList"></b-form-select>                                
                    </b-form-fieldset>
                </div> -->
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="调整单类型" label-text-align="right" :label-cols="4">
                        <b-form-select  v-model="params.adjustSkuType" :options="stockAdjustType"/>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset label="选择经销商店" :label-cols="4" horizontal class="text-right">
                        <areaqueryshop :storeAll="true"  ref="areaqueryshop"  @select-change="selectedfun"></areaqueryshop>
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="仓库名称" :label-cols="4" class="text-right">
                        <b-form-select  v-model="params.whCodes[0]" :options="entreList"></b-form-select>
                    </b-form-fieldset> 
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset()">重置</b-button>                        
                        <b-button size="sm" variant="primary" @click.Enter="query">查询</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" variant="success" @click="inserAdjust" >新增</b-button>
                        <b-button size="sm" variant="primary" @click="editAdjust">编辑</b-button>                    
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
            <b-table striped hover bordered show-empty :items="tablelist" :fields="fields">
                <template slot="index" slot-scope="data">
                    <input type="radio" name="radio" @click="checkData(data.index)">
                </template>
                <template slot="adjustNo" slot-scope="data">
                    <router-link :to='{name:"detaildecreaseoverflow",query:{
                        adjustNo:data.item.adjustNo,
                        disabled:true
                    }}'>
                        {{data.item.adjustNo}}
                    </router-link>
                </template>
                <template slot="storeWhName" slot-scope="data">
                    <span>{{data.item.storeName ? data.item.storeName + '-' : ''}}{{data.item.whName}}</span>
                </template>
                <template slot="beTerm" slot-scope="data">
                    {{data.item.beTermNo}}
                </template>
                <template slot="auditStatus" slot-scope="data">
                    <span v-if="data.item.wfStatus==-1">待提交</span>
                    <span v-else-if="data.item.wfStatus== 0">已提交</span>
                    <span v-else-if="data.item.wfStatus== 1">审核通过</span> 
                </template>
                <template slot="orderStatus" slot-scope="data">
                    <span v-if="data.item.orderStatus==0">未生效</span>
                    <span v-else-if="data.item.orderStatus== 1">已提交</span>
                    <span v-else-if="data.item.orderStatus== 2">已生效</span> 
                    <span v-else-if="data.item.orderStatus== 3">已完成</span> 
                    <span v-else-if="data.item.orderStatus== 4">已关闭</span> 
                    <span v-else-if="data.item.orderStatus== -1">已作废</span>                                                             
                </template>
                <template slot="empty">
                    暂无数据...                  
                </template>
            </b-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="pageChange" :page-no="pageData.pageNum" :page-size="pageData.pageSize" :total-result="pageData.total" :total-pages="pageData.pages">
                 </pagination>
               </div>
            </div>
        </b-card>
    </div>
</template>
<script>
import Vue from "vue";
import config from "common/config.js";
import areaqueryshop from "components/iris-areaqueryshop/";
import pagination from "components/pagination/pagination.vue";
import api from "common/api";
import { DatePicker, Message} from "element-ui";
import search from "components/iris-search/search.vue";
Vue.use(DatePicker);
export default {
  components: {
    pagination,
    areaqueryshop,
    search,
  },
  data() {
    return {
        stockAdjustType: [
        {
            text: "非整车",
            value: 1
        }
        ],
        adjustTypeList:[{text:"金额",value:1},{text:"数量",value:1}],
        approvaStateList: [
        { text: "待提交", value: -1 },
        { text: "已提交", value: 0 },
        { text: "审批通过", value: 1 }
        ],
        entreList: [],
        fields: {
        index: {
            label: "选择"
        },
        adjustNo: {
            label: "调整单号"
        },
        storeWhName: {
            label: "门店-仓库"
        },
        // beTerm: {
        //     label: "账期"
        // },
        auditStatus: {
            label: "审核状态"
        },
        orderStatus: {
            label: "单据状态"            
        }
        },
        tablelist: [],
        required: false,
        datalist: [],
        isforbidden: false,
        selectParams: {
            pageNums: config.pageNums,
            pageStart: 1,
            skuType: "goodsTypeGood"
        },
        checkIndex:null,
        params:{
            adjustSkuType:1,
            skuCode:null,
            wfStatus:null,
            whCodes:[],
            beTermNo: null, 
            pageNums:config.pageNums,
            pageStart:1,
            storeCodes:[]    
        },
        pageData:{},
        adjustNo:null,
        beTermList:[]
    };
  },
  methods: {
    selectedfun(data, data1) {
      const _this = this;
      const options = {
        storeCodeSet: []
      };
      _this.params.storeCodes = []
      if(data1 instanceof Array){
          for (let i = 0; i < data1.length; i++) {
            _this.$set(_this.params.storeCodes, i, data1[i].value)              
          }
      }else{
        options.storeCodeSet.push(data1.value);
        _this.params.storeCodes = [data1.value]
        // 根据经销商店获取仓库
        api.getEntrepot(options, function(res) {
            if (res.data.code === "success") {
            const array = res.data.obj;
            const arr = [];
            for (var i = 0; i < array.length; i++) {
                let obj = {};
                obj.text = array[i].warehouseName;
                obj.value = array[i].warehouseCode;
                arr.push(obj);
            }
            _this.entreList = arr;
            }
        });
      }
      
    },
    //点击查询
    query() {
        const _this = this;
        _this.tablelist = []   
        api.adjust.queryAdjust(_this.params,(msg)=>{
            if(msg.data.message == 'success'){
                _this.pageData = msg.data.obj
                _this.tablelist = msg.data.obj.list
            }else{
                _this.pageData = {}
                _this.tablelist = []
            }
        })
    },
    // 搜索框内值改变   触发搜索
    querySelect(data) {
        const _this = this;
        _this.selectParams.pageStart = 1;
        _this.selectParams.skuName = data;
        let params = _this.selectParams;
        _this.getSupplierName(params, function(res) {
        _this.isLastPage = res.isLastPage;
        _this.datalist = res.list;
        });
    },
    // 选中某一项    
    itemValue(value) {
        const _this = this
        _this.params.skuName = value.skuName
        _this.skuName = value.skuName
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
            _this.datalist = res.list
        })
    },
    // 滚动加载
    comScroll(isEnd) {
        if (isEnd && !this.isLastPage) {
            this.selectParams.pageStart ++
            let params = this.selectParams;        
            this.getSupplierName(params, obj => {
                this.isLastPage = obj.isLastPage;
                if(obj.list){
                    this.datalist = this.datalist.concat(obj.list);
                }
            });
        }
    },
     // 定义向后台请求skuname的方法
    getSupplierName(params,callback) {
        api.checkPlan.querySku(params, res => {
            if (res.data.code === "success") {
                let obj = res.data.obj;
                callback(obj);
            }
        })
    },
    //单选框选中的下标
    checkData(index){
        const _this = this;
        _this.checkIndex = index
    },
    //点击修改
    editAdjust(){
        const _this = this;
        if(_this.checkIndex !== null){
            if(_this.tablelist[_this.checkIndex].orderStatus==-1){
                Message({ 
                    type: 'warning', 
                    message: '已作废调整单不可以编辑！'
                });
            }else{
                    _this.$router.push({name:"updatadecreaseoverflow",query:{
                    adjustNo:_this.tablelist[_this.checkIndex].adjustNo,
                    disabled:false
                }}) 
            }
        }else{
            Message({ 
                type: 'warning', 
                message: '请选择一条调整单!'
            });
        }
    },
    //分页改变
    pageChange(value){
        const _this = this;
        _this.params.pageStart = value;
        _this.query()
    },
    inserAdjust(){
        const _this = this;
        this.$router.push({
            name: "insertdecreaseoverflow"
        });
    },
    reset(){
        const _this = this;
        _this.params.adjustSkuType=1,
        _this.params.skuCode=null,
        _this.params.wfStatus=null,
        _this.params.whCodes=[],
        _this.params.beTermNo= null, 
        _this.params.pageNums=config.pageNums,
        _this.params.pageStart=1       
        _this.$refs.search.setValue() 
        _this.$refs.areaqueryshop.reset()                
        _this.$refs.areaqueryshop.resetToStart()                       
    },
    getDataDictionarys(){
        const _this = this;
        api.ref.queryRefDetail({
            refDetailCode: 'accountRelationDefaultAccount'
        },(msg)=>{
            if(msg.data.message == 'success'){
                let data  = msg.data.obj
                _this.beTermList = [{
                    text:data.refDetailValue,
                    value:data.refDetailValue
                }]
                // _this.params.beTermNo = data.refDetailValue
            }
        })
    },
    queryDetail(value){
        const _this = this;
        _this.$router.push({name:"updatadecreaseoverflow",query:{
            adjustNo:value,
            disabled:true
        }})   
    }
  },
  created () {
        const _this = this;
        _this.getDataDictionarys()
  }
};
</script>
