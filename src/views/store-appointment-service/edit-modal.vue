<template>
    <b-modal ref="modalAppointServ" size="lg" title="门店推荐服务编辑">
        <div class="container-fluid">
            <b-row>
                <b-form-fieldset horizontal label="门店" :label-cols="2" class="text-right">
                    <AreaTree @select-change="selectedfun" ref="areaqueryshop" :storeAll='true'></AreaTree>
                </b-form-fieldset>
            </b-row>
            <b-row v-show="!!storeCode">
                <b-col md="4">
                    <b-select :options="categoryFlagList" v-model="categoryFlag"></b-select>
                </b-col>
                <b-col md="4"></b-col>
                <b-col md="4">
                    <b-form-fieldset horizontal label="搜索" :label-cols="2" class="text-right">
                        <input class="form-control" v-model.trim="searchStr" @input="inputFliter"/>
                    </b-form-fieldset>
                </b-col>
            </b-row>
            <b-row  v-show="!!storeCode">
                <b-col md="4">
                   <div class="box-bord">
                       <service-class-tree @getData="getServiceClass" v-show="categoryFlag === 1"></service-class-tree>
                       <service-catalog-tree @getData="getServiceCatalog" v-show="categoryFlag === 0"></service-catalog-tree>
                   </div>
                </b-col>
                <b-col md="3">
                   <div class="box-bord">
                        <b-form-checkbox-group  id="checkbox" name="checkbox" v-model="prepareSel">
                            <b-form-checkbox class="checkbox-box ml-1" v-for="(item, index) in prepareList" :key="index"  :value="item" :disabled="item.disabledCheck">{{item.serviceName}}</b-form-checkbox>       
                        </b-form-checkbox-group>
                        <!-- <b-form-checkbox-group id="flavors"
                                            stacked
                                            v-model="prepareSel"
                                            name="flavs"
                                            :options="prepareList"
                                            class="ml-4"
                                            aria-label="Individual flavours"
                        ></b-form-checkbox-group> -->
                        
                   </div>
                </b-col>
                <b-col md="1" class="bt-pt">
                    <b-button size="sm" variant="default" @click="addService">
                        <h5>></h5>
                    </b-button>
                    <b-button size="sm" variant="default" class="mt-3" @click="delService">
                        <h5><</h5>
                    </b-button>
                </b-col>
                <b-col md="4">
                   <div class="box-bord">
                       <b-form-checkbox-group  id="checkbox" name="checkbox" v-model="saveSel">
                            <b-form-checkbox class="checkbox-box ml-1"  v-for="(item,index) in showSaveList" :key="index"  :value="item">{{item.serviceName}}</b-form-checkbox>       
                        </b-form-checkbox-group>
                   </div>
                </b-col>
            </b-row>
            <b-row v-show="!!storeCode">
                 <b-col md="4"></b-col>
                 <b-col md="3" v-show="prepareList.length > 0">
                    <b-form-checkbox v-model="allSelected"
                         :indeterminate="indeterminate"
                         aria-describedby="prepareList"
                         aria-controls="prepareList"
                         @change="toggleAll"
                    >
                    {{ allSelected ? '清空' : '全选' }}
                    </b-form-checkbox>
                 </b-col>
                 <b-col md="5"></b-col>
            </b-row>
        </div>
        <div slot="modal-footer" class="w-100">
            <b-btn size="sm" class="float-right mr-2" variant="success" @click="sure">确定</b-btn>
        </div>
    </b-modal>
</template>
<script>
import Vue from 'vue'
import AreaTree from 'components/iris-areaqueryshop/index'
import config from 'common/config'
import api from 'common/api'
import common from 'common/common'
import serviceClassTree from './serviceClassRadioTree'
import serviceCatalogTree from './serviceCatalogRadioTree'
import {Message, MessageBox } from "element-ui"

export default {
     components: {
       AreaTree,
       serviceClassTree,
       serviceCatalogTree,
    },
    data() {
        return {
            searchStr: '',
            categoryFlagList: config.storeAppointmentService.categoryFlagList,
            categoryFlag: 1,
            storeCode: '',
            serviceClass: '',
            serviceCatalog: '',
            prepareList: [],
            prepareSel: [],
            showSaveList: [],
            saveList: [],
            saveSel: [],
            timer: undefined,
            allSelected: false,
            indeterminate: false,
        }
    },
    methods: {
        //区域选择门店
        selectedfun(data, data1) {
            const _this = this;
            if(data1 instanceof Array){
                _this.storeCode = '';
                
            }else{
               _this.storeCode = data1.value; 
            }
        },
        getServiceClass(val) {
            this.serviceClass = val.categoryCode;
            this.getServiceList();
        },
        getServiceCatalog(val) {
            this.serviceCatalog = val.catalogCode;
            this.getServiceList();
        },
        getServiceList() {
            this.prepareSel = [];
            let param = {};
            if(this.categoryFlag === 1) {
                param.categoryCode = this.serviceClass;
            }else if(this.categoryFlag === 0) {
                param.catlogCode = this.serviceClass;
            }
            api.serviceitem.queryByCode(param, res => {
                if (res.data.code === "success") {
                    this.prepareList = [];
                    if(res.data.obj.length != 0) {
                        for(let [i, item] of res.data.obj.entries()) {
                            this.prepareList.push({
                                serviceCode: item.serviceCode,
                                serviceName: item.serviceName
                            })
                        }
                    }
                    this.prepareListIsDisabled();
                }
            })
        },
        addService() {
            this.searchStr = '';
            for(let [i, item] of this.prepareSel.entries()) {
                let isExist = false;
                for(let [i, val] of this.saveList.entries()) {
                    if(item.serviceCode === val.serviceCode) {
                        isExist = true;
                        break;
                    }
                }
                if(!isExist) {
                    this.saveList.push({
                        serviceCode: item.serviceCode,
                        serviceName: item.serviceName,
                    });
                }
            }
            this.showSaveList = JSON.parse(JSON.stringify(this.saveList));
            this.prepareListIsDisabled();
        },
        delService() {
            for(let [i, item] of this.saveSel.entries()) {
                let isExist = false;
                for(let [j, val] of this.saveList.entries()) {
                    if(item.serviceCode === val.serviceCode) {
                       this.saveList.splice(j, 1);
                       break;
                    }
                }
                for(let [j, val] of this.showSaveList.entries()) {
                    if(item.serviceCode === val.serviceCode) {
                       this.showSaveList.splice(j, 1);
                       break;
                    }
                }
            };
            this.saveSel = [];
            this.searchStr = '';
            this.inputFliter();
            this.prepareListIsDisabled();
        },
        prepareListIsDisabled() {
            if(this.prepareList.lenght == 0) {
                return;
            }
            for(let [i, item] of this.prepareList.entries()) {  
                this.prepareList[i].disabledCheck = false;             
                for(let [j, val] of this.saveList.entries()) {
                    if(item.serviceCode === val.serviceCode) {
                        this.prepareList[i].disabledCheck = true;  
                        let isSel = true;
                        let isSelIndex = -1;
                        for(let [index, value] of this.prepareSel.entries()) {
                            if(value.serviceCode == val.serviceCode) {
                                isSel = false;
                                isSelIndex = index;
                                break;
                            }
                        }  
                        if(isSel){
                            this.prepareSel.push(this.prepareList[i]);
                        }else{
                            this.prepareSel.splice(isSelIndex, 1, this.prepareList[i]);
                        }
                        break;            
                    }
                }
            }
        },
        inputFliter() {
            if(this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                if(this.searchStr && this.searchStr !== '') {
                    this.showSaveList = common.filterArrOfAnd(this.showSaveList, this.searchStr);
                }else {
                    this.showSaveList = JSON.parse(JSON.stringify(this.saveList));
                }
            }, 700);
        },
        show() {
            this.$refs.modalAppointServ.show();  
            this.reset();   
            this.getStoreService();
        },
        reset() {
            this.searchStr = '';
            this.prepareList = [];
            this.prepareSel = [];
            this.saveSel = [];
            this.saveList = [];
            this.showSaveList = [];
            this.showSaveList = [];
            this.serviceClass = '';
            this.serviceCatalog = '';
            this.categoryFlag = 1;
            this.timer = undefined;
        },
        getStoreService() {
            let param = {
                storeCode: this.storeCode
            }
            api.storeAppointmentService.queryStoreServiceInfoNoPage(param, res => {
                if (res.data.code === "success") {
                    this.prepareList = [];
                    if(res.data.obj.length != 0) {
                        for(let [i, item] of res.data.obj.entries()) {
                            this.saveList.push({
                                serviceCode:item.serviceCode,
                                serviceName:item.serviceName
                            });
                        }
                        this.showSaveList = JSON.parse(JSON.stringify(this.saveList));
                    }
                }
            })
        },
        sure() {
            if(!this.storeCode) {
                Message({
                    type: "warning",
                    message: "未选择门店!"
                });
                return;
            }
            let param = [];
            if(this.saveList.length == 0) {
                Message({
                    type: "warning",
                    message: "服务不可为空!"
                });
                return;
            }
            for(let [i, item] of this.saveList.entries()) {
                param.push({
                    serviceCode: item.serviceCode,
                    serviceName: item.serviceName,
                    importOrinsertFlag: 1,
                    storeCode: this.storeCode,
                })
            }
            api.storeAppointmentService.editStoreServiceInfoList(param, res => {
                if (res.data.code === "success") {
                    Message({
                        type: "success",
                        message: "保存成功"
                    });
                    this.$emit("sure");
                    this.$refs.modalAppointServ.hide(); 
                }
            })
        },
        toggleAll(checked) {
            if(checked) {
                let arr = [];
                for(let [i, item] of this.prepareList.entries()) {
                   arr.push(item)
                }
                this.prepareSel = arr;
            }else{
                this.prepareSel = [];
            }
            this.prepareListIsDisabled();
        }
    },
    watch: {
        categoryFlag(val) {
            this.prepareList = [];
            this.prepareSel = [];
        },
        storeCode(val) {
            this.showSaveList = [];
            this.saveList = [];
            this.saveSel = [];
            if(val) {
                this.getStoreService();
            }
        },
        prepareSel(newVal, oldVal) {
            if (newVal.length === 0) {
                this.indeterminate = false
                this.allSelected = false
            } else if (newVal.length === this.prepareList.length) {
                this.indeterminate = false
                this.allSelected = true
            } else {
                this.indeterminate = true
                this.allSelected = false
            }
        },
    },
}
</script>
<style>
.box-bord{
    border: 1px solid #c2cfd6;
    height: 300px;
    overflow: auto;
}
.bt-pt {
    padding-top: 104px;
}
.checkbox-box{
	display: block;
    white-space: nowrap;
}
</style>


