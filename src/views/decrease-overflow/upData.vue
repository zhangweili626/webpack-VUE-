<template>
    <div>
        <b-card :header="`报损报溢单：${params.adjustNo}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;审批状态：${params.wfStatu}`">
            <div class="row">
                <div class="col-md-12">
                    <div class="row">
                        <div class="col-md-6">
                            <b-form-fieldset horizontal label="调整商品类型*" :label-cols="4" class="text-right">
                                <b-form-select :disabled="createdAdjustStatus" v-model="params.adjustSkuType" :options="adjustSkuType"></b-form-select>                            
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6 col-lg-6">
                            <b-form-fieldset label="选择经销商店*" :label-cols="4" horizontal class="text-right">
                                <areaqueryshop :readonly="createdAdjustStatus" ref="areaqueryshop"  @select-change="selectedfun"></areaqueryshop>
                            </b-form-fieldset>
                        </div>
                        <div class="col-md-6 col-lg-6">
                            <b-form-fieldset horizontal label="仓库名称*" :label-cols="4" class="text-right">
                                <b-form-select :disabled="createdAdjustStatus"  :state="status.whCodeState" v-model="params.whCode" :options="entreList"></b-form-select>
                            </b-form-fieldset> 
                        </div>
                        <!-- <div class="col-md-6">
                            <b-form-fieldset horizontal label="账期*" :label-cols="4" class="text-right">
                                <b-form-select :disabled="createdAdjustStatus" v-model="params.beTermNo" :options="beTermList"></b-form-select>                                
                            </b-form-fieldset>
                        </div> -->
                    </div>
                </div>
            </div> 
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right" v-if="!disabled && oldAdjustData.wfStatus!= 1 && oldAdjustData.wfStatus!= 0">
                        <b-button size="sm" variant="default" @click="cancel()">取消</b-button>                                                
                        <b-button size="sm"  variant="primary" @click.Enter="createdAdjust()">{{createdAdjustStatus ? '编辑' : '保存'}}</b-button>                        
                    </div>
                </div>
            </div>           
        </b-card>
        <!-- <b-card v-if="createdAdjustStatus" header="报损报溢明细"> -->
            <el-tabs type="border-card">
            <el-tab-pane label="报损报溢明细"><div class="row">
                <div class="col-md-12">
                    <div class="pull-left" v-if="!disabled && oldAdjustData.wfStatus!= 1 && oldAdjustData.wfStatus!= 0">
                        <b-button size="sm" variant="success"  v-b-modal.insert>新增</b-button>   
                        <b-button size="sm" variant="primary" @click="editAdjust">编辑</b-button>                                                                    
                        <b-button size="sm" variant="danger" @click="deleteDetail">删除</b-button>                                                                                         
                    </div>
                    <div class="pull-right" v-if="!disabled">
                        <b-button size="sm" variant="primary" v-if="oldAdjustData.wfStatus==-1"  @click="submitExamine">提交审批</b-button>                         
                        <b-button size="sm" variant="danger"  v-if="oldAdjustData.wfStatus==-1" @click="cancelAdjust">作废</b-button>
                        <b-button size="sm" variant="primary" v-if="oldAdjustData.wfStatus== 0" @click="recall">撤销</b-button> 
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
            <b-table striped hover bordered show-empty :items="tablelist" :fields="fields">
                <template slot="index" slot-scope="data">
                    <input type="radio" name="radio" @click="checkData(data.index)">
                </template>
                <template slot="skuCode" slot-scope="data">
                    {{data.item.skuCode}}
                </template>
                <template slot="skuName" slot-scope="data">
                    {{data.item.skuName}}
                </template>
                <template slot="barCode" slot-scope="data">
                    {{data.item.barCode}}
                </template>
                <template slot="originalCode" slot-scope="data">
                    {{data.item.originalCode}}
                </template>
                <template slot="externalCode" slot-scope="data">
                    {{data.item.externalCode}}
                </template>
                <template slot="calCostTypeName" slot-scope="data">
                    {{data.item.calCostTypeName}}
                </template>
                <template slot="stockNumsBefore" slot-scope="data">
                    {{data.item.stockNumsBefore}}
                </template>
                <template slot="stockCostBefore" slot-scope="data">
                    {{data.item.stockCostBefore&&data.item.stockCostBefore.toFixed(2)}}
                </template>
                <template slot="stockCostTotalBefore" slot-scope="data">
                    {{data.item.stockCostTotalBefore&&data.item.stockCostTotalBefore.toFixed(2)}}
                </template>
                <template slot="adjustType" slot-scope="data">
                    <span v-if="data.item.adjustType == 0">报溢</span>
                    <span v-else-if="data.item.adjustType == 1">报损</span>
                </template>
                <template slot="adjustValue" slot-scope="data">
                    {{data.item.adjustValue}}
                </template>
                <!-- <template slot="inStockIncludingTaxPrice" slot-scope="data">
                    {{data.item.inStockIncludingTaxPrice}}
                </template> -->
                 <template slot="adjustCost" slot-scope="data">
                    {{data.item.adjustCost&&data.item.adjustCost.toFixed(2)}}
                </template>
                <template slot="inStockRate" slot-scope="data">
                    {{data.item.adjustTaxRateName * 100 + '%'}}
                </template>
                <template slot="stockNumsAfter" slot-scope="data">
                    {{data.item.stockNumsAfter}}
                </template>
                <template slot="stockCostAfter" slot-scope="data">
                    {{data.item.stockCostAfter}}
                </template>
                <template slot="adjustReason" slot-scope="data">
                    {{methodGetByteLen(data.item.adjustReason,15)}}                    
                </template>
                <template slot="empty">
                    暂无数据...                  
                </template>
            </b-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="pageChange" :page-no="pageData.pageNums" :page-size="pageData.pageSize" :total-result="pageData.total" :total-pages="pageData.pages">
                 </pagination>
               </div>
            </div>
            </el-tab-pane>
            <el-tab-pane label="审批履历">
                <approval :orderNo="params.adjustNo"></approval>
            </el-tab-pane>
            </el-tabs>
        <!-- </b-card> -->
        <insertModal ref="insert" :calCostType="calCostType" :adjustNo="params.adjustNo" :whCode="params.whCode"  @handle-ok="handleOk"></insertModal>
        <upDataModal ref="updata" :calCostType="calCostType" :adjustDetail="adjustDetail" :whCode="params.whCode"  @handle-ok="handleOk"></upDataModal>
    </div>
</template>
<script>
    import Vue from "vue";
    import api from "common/api";
    import config from "common/config"; 
    import { DatePicker, Message, MessageBox, Tabs, TabPane} from "element-ui";       
    import areaqueryshop from "components/iris-areaqueryshop/";
    import pagination from "components/pagination/pagination.vue";    
    import insertModal from "./stockadjustdetail/insertModal.vue"
    import upDataModal from "./stockadjustdetail/upDataModal.vue"  
    import  approval from "components/approval-record/approval-record.vue";  
    Vue.use(DatePicker);
    Vue.use(Tabs);
    Vue.use(TabPane);
    export default {
        components: {
            approval,
            areaqueryshop,
            pagination,
            insertModal,
            upDataModal
        },
        data() {
            return {
                params:{
                    whCode:null,
                    adjustSkuType:1,
                    // beTermNo:null,
                    storeCode:null,
                    adjustNo:null,
                    wfStatu:''
                },
                status:{
                    whCodeState:null,
                    beTermNoState:null
                },
                entreList: [],
                beTermList:[],
                adjustSkuType:[
                    // {
                    //     text: "整车",
                    //     value: 0
                    // },
                    {
                        text: "非整车",
                        value: 1
                    }
                ],
                tablelist:[],
                adjustNo:null,
                fields:{
                    index: {
                        label: "选择"
                    },
                    skuCode: {
                        label: "sku编码"
                    },
                    skuName: {
                        label: "商品名称"
                    },
                    barCode:{
                        label: "69码"
                    },
                    originalCode:{
                        label: "原厂编码"
                    },
                    externalCode:{
                        label: '外部编码'
                    },
                    calCostTypeName:{
                        label: '成本计算类型'
                    },
                    stockNumsBefore:{
                        label: "调整前库存数量"
                    },
                    stockCostBefore:{
                        label: "调整前单位成本"
                    },
                    stockCostTotalBefore:{
                        label: "调整前库存总金额"
                    },
                    adjustType:{
                        label: "报损报溢类型"
                    },
                    adjustValue:{
                        label:"调整数值（数量）"
                    },
                    adjustCost:{
                        label:"成本（含税价）"
                    },
                    // adjustType:{
                    //     label:"调整类型"
                    // },
                    // inStockIncludingTaxPrice:{
                    //     label:"入库含税价"                
                    // },
                    inStockRate:{
                        label:"税率"                
                    },
                    adjustReason: {
                        label:"调整原因"                
                    }

                },
                checkIndex:null,
                pageData:{},
                pageStart:0,
                adjustDetail:null,
                examineStatus: null,
                editStatus:null,
                createdAdjustStatus:null,
                oldAdjustData: {},
                calCostType:null,
            }
        },
        methods: {
            selectedfun(data, data1) {
                const _this = this;
                const options = {
                    storeCodeSet: []
                };
                _this.params.storeCode = data1.value                
                options.storeCodeSet.push(data1.value);
                // 根据经销商店获取仓库
                api.getEntrepot(options, function(res) {
                    if (res.data.code === "success") {
                    const array = res.data.obj;
                    const arr = [];
                    for (var i = 0; i < array.length; i++) {
                        let obj = {};
                        obj.text = array[i].warehouseName;
                        obj.value = array[i].warehouseCode;
                        obj.calCostType = array[i].calCostType                        
                        arr.push(obj);
                    }
                    _this.entreList = arr;
                    }
                });
            },
            cancel(){
                const _this = this;
                _this.$router.push({
                    name:"decrease-overflow"
                })
            },
            createdAdjust(){
                const _this = this
                if(_this.createdAdjustStatus){
                    _this.createdAdjustStatus = !_this.createdAdjustStatus
                }else{
                    if(!_this.params.whCode){
                        _this.status.whCodeState = "invalid"
                        evt.cancel()
                    }else{
                        //获取调整单号
                        api.adjust.upDataAdjust(_this.params,(msg)=>{
                            if(msg.data.message == 'success'){
                                Message({
                                    type: 'success',
                                    message: "操作成功！"
                                });
                                const array = _this.entreList
                                for (let index = 0; index < array.length; index++) {
                                    const element = array[index];
                                    if(element.value === _this.params.whCode){
                                        _this.$refs.insert.setCalCostType(element.calCostType)
                                        _this.$refs.updata.setCalCostType(element.calCostType)                                        
                                        break;
                                    }
                                }
                                _this.createdAdjustStatus = true
                                _this.queryAdjustDetail()
                            }
                            
                        })
                        _this.status.whCodeState = ""                    
                    }
                }
               
            },
            queryAdjustDetail(){
                const _this = this;
                _this.tablelist = []    
                _this.checkIndex = null    
                api.adjust.queryAdjustDetail({
                    pageNums:config.pageNums,  
                    pageStart:_this.pageStart,
                    adjustNo: _this.params.adjustNo
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        _this.pageData =  msg.data.obj      
                        console.log(2222) 
                        console.log(msg.data.obj.list)         
                        _this.tablelist = msg.data.obj.list
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
                    _this.adjustDetail = _this.tablelist[_this.checkIndex].adjustDetailCode
                    _this.$refs.updata.show()                    
                }else{
                    Message({ 
                        type: 'warning', 
                        message: '请选择一条数据！'
                    });
                }
            },
            //分页改变
            pageChange(value,){
                const _this = this;
                _this.pageStart = value;
                _this.queryAdjustDetail()
            },
            //新增或者编辑成功
            handleOk(value){
                const _this = this
                _this.tablelist = []; 
                _this.adjustDetail = null 
                _this.queryAdjustDetail()
                // api.adjust.queryAdjustDetail({
                //     adjustDetailCode: value
                //   },(msg)=>{
                //       if(msg.data.message == 'success'){
                //           console.log(11)
                //         _this.pageData =  msg.data.obj                
                //         _this.tablelist = msg.data.obj.list
                //       }
                //   })
            },
            //点击删除
            deleteDetail(){
                const _this = this;
                if(_this.checkIndex !== null){
                     let data = _this.tablelist[_this.checkIndex]
                    MessageBox.confirm('是否确认删除', '提示', {
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        type: 'info'
                    }).then(() => {
                        data.isDeleted = 1;
                        api.adjust.addAdjustDetail([data],msg=>{
                            if(msg.data.message ==  'success'){
                                Message({ 
                                    type: 'success', 
                                    message: '删除成功！'
                                });
                                _this.queryAdjustDetail()
                            }else{
                                Message({ 
                                    type: 'error', 
                                    message: '删除失败！'
                                });
                            }
                        })
                    }).catch(() => {
                    });
                }else{
                    Message({ 
                        type: 'warning', 
                        message: '请选择一条数据！'
                    });
                }
               
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
                        _this.params.beTermNo = data.refDetailValue
                    }
                })
            },
            //提交审批
            submitExamine(){
                const _this = this;
                if(_this.tablelist.length!=0){
                    api.adjust.submitExamine(_this.params,(msg)=>{
                        if(msg.data.message == 'success'){
                            Message({ 
                                type: 'success', 
                                message: '成功提交审批!'
                            }); 
                            location.reload()                        
                        }
                    })
                }else{
                    Message({ 
                        type: 'warning', 
                        message: '请添加报损报溢明细！'
                    });
                }
            },
            //作废
            cancelAdjust(){
                const _this = this;
                let data = _this.params.adjustNo
                MessageBox.confirm('是否确认作废', '提示', {
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        type: 'info'
                }).then(() => {
                    api.adjust.cancelAdjustOrderInfo({adjustNo:data},(msg)=>{
                        if(msg.data.message == 'success'){
                            Message({ 
                                type: 'success', 
                                message: '操作成功！'
                            });
                            _this.$router.push({name:"updatadecreaseoverflow",query:{
                            adjustNo:data,
                            disabled:true
                        }})
                        }
                    })
                }).catch(() => {
                });
            },
            recall(){
                const _this = this;
                let {adjustNo} = _this.params 
                api.adjust.withdrawAdjustOrderInfo({adjustNo:adjustNo},(msg)=>{
                    if(msg.data.message == 'success'){
                        Message({ 
                            type: 'success', 
                            message: '操作成功！'
                        });
                        location.reload()
                    }
                })
            },
            /**
             * str 需要控制的字符串
             * len 字节的长度，如5个汉字，10个英文，输入参数就是10
             */
            methodGetByteLen(str = '', len = 0) {
                // 如果字节的长度小于控制的长度，那么直接返回
                let st  = str || ''
                if(st.length < len){
                    return st
                }else{
                    return st.substring(0, len) + '...'
                }
            },
        },
        created() {
            const _this = this;
            api.adjust.queryAdjust({
                    adjustNo:_this.$route.query.adjustNo
                },(msg)=>{
                    if(msg.data.message == 'success'){
                        let data = msg.data.obj.list[0];
                        _this.oldAdjustData = data
                        _this.examineStatus = _this.oldAdjustData.wfStatus       
                        _this.params = {
                            adjustSkuType:data.adjustSkuType,
                            id:data.id,
                            adjustNo:data.adjustNo,
                            whCode:data.whCode,
                            wfStatu:''
                            // beTermNo:data.beTermNo
                        }
                        if(data.wfStatus == -1){
                            _this.params.wfStatu = '待提交'
                        }else if(data.wfStatus == 0){
                            _this.params.wfStatu = '已提交'
                        }else if(data.wfStatus == 1){
                            _this.params.wfStatu = '审核通过'
                        }
                        _this.entreList = [{text:data.whName,value:data.whCode}]
                        _this.createdAdjustStatus = true                        
                        _this.queryAdjustDetail()
                        _this.$refs.areaqueryshop.setselect({
                            text:data.storeName,
                            value:data.storeCode
                        })
                        api.stockInfo.queryInfoByCode({warehouseCode:data.whCode}, function(res) {
                            if (res.data.code === "success") {
                                const array = res.data.obj;
                                _this.calCostType = array.calCostType
                                _this.$refs.insert.setCalCostType(_this.calCostType )
                                _this.$refs.updata.setCalCostType(_this.calCostType ) 
                            }
                        });
                    }
            })
            // _this.getDataDictionarys()
        },
        computed: {
            disabled:function(){
                const _this = this;
                if(Object.prototype.toString.call(_this.$route.query.disabled ) === "[object String]"){
                    return _this.$route.query.disabled == 'true' ? true : false                    
                }else{
                    return _this.$route.query.disabled                  
                }
            }
        },
        watch: {
            examineStatus:{
                handler:function(value){
                    const _this = this
                    if(value > -1){
                        if(value > 0){
                            //1审批通过
                            // delete _this.fields.adjustType
                            // delete _this.fields.adjustValue
                            _this.fields.stockNumsAfter = {
                                label:"调整后库存数量"
                            }
                            _this.fields.stockCostAfter = {
                                label:"调整后单位成本"                
                            }
                            _this.fields.stockCostTotalAfter = {
                                label:"调整后库存总金额"                
                            }
                            
                        }
                    }
                },
                deep:true
            }
        }
    }
</script>
<style>
    .modal-dialog {
        margin: 80px auto !important;
    }
</style>

