<template>
	<div>
        <b-button size="sm" varient="success" @click="test">mock</b-button>
        <!-- <scope ref="scope" :multipleSelection="true" :fields="fields" @deletScopeBtn="deletScopeBtn"  :addscope="addscope" :tablist="list" :additionalInput="additionalInput" :additionalSelect="additionalSelect"></scope> -->
        <div class="row">
            <div class="col-md-6 col-lg-6">
                <b-form-fieldset horizontal label="调拨入库单号" label-text-align="right" :label-cols="4">
                    <upload
                    :on-success="bighandleSuccess"
                    :on-error="onError"
                    :file-list="bigfileList"
                    :parame="biguploadParams"
                    :on-remove="bighandleRemove"
                    :uploadBefore="uploadBefore"
                    :limit='5'
                    ></upload>
                </b-form-fieldset>
            </div>
            <div class="col-md-6 col-lg-6">
                <b-form-fieldset horizontal label="调拨入库单号" label-text-align="right" :label-cols="4">
                    <upload></upload>
                </b-form-fieldset>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 col-lg-6">
                <b-form-fieldset horizontal label="请输入车牌号" label-text-align="right" :label-cols="4">
                    <plate @giveData="getData" :disabledState="true"></plate>
                </b-form-fieldset>
            </div>
        </div>
        <div class="row">
            <!-- <tabsCarousel></tabsCarousel>     -->
        </div>
        <card-modal ref="cardModal" :acceptObj="cardParams" :isShowChoose="false" @use="acceptData"></card-modal>
        <ticket-modal ref="ticketModal" :acceptObj="ticketParams" :isShowChoose="false" @use="recieveData"></ticket-modal>
        <div class="row">
            <div class="col-md-6 col-lg-6">
                <b-button @click="showCardModal">显示卡模态框</b-button>
                <b-button @click="showTicketModal">显示券模态框</b-button>
            </div>
        </div>
        <customer-vehicle ref="cusVehicle"
            plateNumber='皖A8888'
            @selectCusVehicleInfo="selectCusVehicleInfo"
            cardUseTypeCode="VehicleCard"
            :mobilePhone="mobilePhone"></customer-vehicle>
        <b-button @click="show">show</b-button>
        <!-- <div class="row"> -->
        <scopeclear :addscope="addscope"></scopeclear>
        <b-row>
            <b-col md='8'></b-col>
            <b-col md='4'>
               <right-history></right-history>
            </b-col>
        </b-row>
        <!-- </div> -->
    </div>
</template>
<script>
    import Vue from 'vue'
    import scope from"components/iris-scope/"
    import upload from"components/iris-upload-2.0"
    import axios from 'axios'
    import common from "common/common";
    import plate from 'components/iris-plate'
    import cardModal from 'components/iris-card-modal'
    import ticketModal from 'components/iris-ticket-modal'
    // import tabsCarousel from "./tabsCarousel";
    import { Tree, Upload, Button, Message, MessageBox } from 'element-ui'
    import mock from '../../mock'

    import CustomerVehicle from 'components/customer-vehicle/customer-vehicle'
    import scopeclear from 'components/iris-scope-clear'

    import rightHistory from '../appointment/order-history'

	export default {
        components:{
            scope,
            upload,
            plate,
            cardModal,
            // tabsCarousel,
            CustomerVehicle,
            ticketModal,
            scopeclear,
            rightHistory

        },
        data(){
            return {
                additionalInput: {

                },
                // multipleSelection: true,
                additionalSelect: {

                },
                ticketParams: {
                    storeCode: 'STORE2000905',
                    customCode: 'CUSTOM2004669',
                    vehicleCode: 'CV20180529000140',
                    detailCodes: []
                },
                cardParams: {
                    storeCode: 'STORE2000905',
                    customCode: 'CUSTOM2004669',
                    vehicleCode: '',
                    detailCodes: []
                },
                bigfileList:[],
                biguploadParams:{
                relationCode: "",
                singleFlag: 1,
                businessType: 'big'
                },
                list:[{name:"适用范围1",code:"1"},{name:"适用范围1",code:"1"},{name:"适用范围1",code:"1"},{name:"适用范围1",code:"1"},{name:"适用范围1",code:"1"}],
                fields:[{label:"适用范围名字",name:"name",},{label:"适用范围code",name:"code",},{label:"适用范围类型",name:""}],

                mobilePhone: ''
            }
        },
        methods:{
            showTicketModal() {
                this.$refs.ticketModal.getFirstData()
                this.$refs.ticketModal.showTicketModal()
            },
            recieveData(value) {
                console.log(value)
            },
            showCardModal() {
                this.$refs.cardModal.getFirstData()
                this.$refs.cardModal.modalShow()
            },
            acceptData(value) {
                console.log(value)
            },
            show() {
                // this.mobilePhone = '18056613516'
                this.$refs.cusVehicle.showEmpCarModal()
                // this.$refs.cusVehicle.setPlateNumber('皖A8888')
            },
            selectCusVehicleInfo(info) {
                console.log(info)
            },

            uploadBefore(){
                const _this = this;
                _this.biguploadParams = {
                    relationCode: "",
                    singleFlag: 1,
                    businessType: 'small'
                }
            },
            bighandleRemove(item){
                const _this = this;
                console.log(item)
                _this.bigfileList = []
            },
            onError(res){
                console.log(res)
            },
            bighandleSuccess(res){
                var file = res.data
                const _this = this
                if(file.message == 'success'){
                    var file = file.obj[0]
                    file.name = '正面发房贷首付说书'
                    file.url = common.getUploadUrl() + file.filePath
                    _this.$set(_this.bigfileList,_this.bigfileList.length,file)
                    Message({
                        type: 'success',
                        message: "操作成功！"
                    });
                }else{
                    Message({
                        type: 'error',
                        message: "上传失败！"
                    });
                    _this.bigfileList = []
                }
            },
            addscope(code , data){
                const _this = this;
                console.log(code, data)
                // if(Array.isArray(data)){
                //     _this.list = [..._this.list,...data]
                // }else{
                //      _this.$set(_this.list , _this.list.length,{
                //         name:data.name,
                //         code:data.code
                //     })
                // }

                // _this.$refs.scope.activePage()
            },
            deletScopeBtn(data){
                console.log(data)
            },
            test() {
                 axios.post('/ceshi.com/1').then((r) => {
                   console.log(r.data.obj)
                })
            },
            getData(arg1, arg2) {
                console.log('打印车牌组件信息')
                console.log(arg1)
                console.log(arg2)
            }
        },
        
	}
</script>
<style scoped>
</style>
