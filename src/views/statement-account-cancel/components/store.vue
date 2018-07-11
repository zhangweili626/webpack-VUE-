<template>
    <div class="skuNameOrskuCode">
        <div class="skuNameOrskuCodeLabel">{{labelName}}</div>
        <input type="text" :disabled="disabled" v-model="searchValue" @focus="showFrame" @blur="clearData"/>
        <div v-if="isShowSearchQuery" class="skuNameOrskuCodeContainerAccount">
            <div class="skuNameOrskuCodeContainerItem" v-for="(item, index) in skuOrSlilist" @click.stop="itemClick(item)">{{ item.text }}</div>
        </div>
    </div>
</template>
<script>
    import api from 'common/api'
    import config from 'common/config'
    import Search from "components/iris-search/search";
    //私有组件
    import Bus from '../bus/bus.js'
    export default {
        components: {
            Search
        },
        data() {
            return {
                labelName:'门店',
                disabled:false,
                isShowSearchQuery: false,
                skuOrSlilist:[],
                queryParams:{
                    supplierCode:''
                },
                searchValue:'',
                isSelect: false
            }
        },
        created(){
            Bus.$on('setStoreValue', (data) => {
                this.searchValue = data;
            })
            Bus.$on('disabledStroe', (data) => {
                this.disabled = true;
                if(data != ''){
                    this.labelName = data
                }
            })
        },
        watch:{
            searchValue(value){
                let option = {
                        pageNums: 5,
                        storeName: value
                    }
                    this.skuOrSlilist = []
                    api.statementAccount.queryStoreInfo(option, res => {
                        if (res.data.code === 'success') {
                            let tempArr = res.data.obj.list
                            tempArr.forEach(element => {
                                let obj = {}
                                obj.text = element.storeName
                                obj.value = element.storeCode
                                this.skuOrSlilist.push(obj)
                            })
                        }
                    })
            }
        },
        methods:{
            itemClick(value) {
                Bus.$emit('getStoreVal', value)
                this.isSelect = true;
                this.searchValue = value.text;
                this.isShowSearchQuery = false;
            },
            showFrame() {
                this.isShowSearchQuery = true
            },
            clearData(){
                setTimeout(() => {
                    this.isShowSearchQuery = false;
                },500)
            }
        }
    }
</script>
<style>
    .skuNameOrskuCode {
        padding-left: 34%;
        position: relative;
    }
    .skuNameOrskuCode>input {
        width: 100%;
        height: 36px;
        padding-left: 5px;
        border: 1px solid #c2cfd6;
        border-radius: 5px;
    }
    .skuNameOrskuCodeLabel {
        position: absolute;
        width: 34%;
        left: 0px;
        text-align: right;
        padding-right: 2%;
        height: 36px;
        line-height: 36px;
    }
    .skuNameOrskuCodeContainerAccount {
        position: absolute;
        top: 36px;
        width: 66%;
        box-sizing: border-box;
        border: 1px solid #c2cfd6;
        z-index: 9999;
        background-color: #fff;
        max-height: 300px;
    }
    .skuNameOrskuCodeContainerItem {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
    }
    .skuNameOrskuCodeContainerItem:hover {
        background-color: #ccc;
        cursor: pointer;
    }
    .pleaseChooseAccount {
        position: relative;
        padding-top: 10px;
        padding-bottom: 10px;
        font-size: 20px;
        padding-left: 6%;
    }
    .pleaseChooseAccount>.closeButton {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        line-height: 20px;
        text-align: center;
        font-size: 20px;
        right: -17px;
        top: -20px;
        cursor: pointer;
    }
    .canNotPass {
        border: 1px solid #e43a5e !important;
    }
</style>