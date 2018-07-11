<template>
<div>
    <car-info
    	:star="star"
        @callBack="getCarInfo" 
        ref="carInfo"
        @validete='validete' 
        :validateLen = 'validateLen'
        :isDisabled="disabled" >
    </car-info>
    <div v-show="carInfo.iotypeCode">
        <el-tabs v-model="activeCode" type="card" @tab-click="tabClick" >
            <el-tab-pane :disabled="disabled" v-for="item in extendProps" :label="item.text" :key="item.value" :name="item.value">
                <div class="extend-sub-prop" v-for="(ele, i) in subPropList" :key="i" @click="selectSubProp(ele)">
                    {{ ele }}
                </div>
                <p v-show="!subPropList.length">暂无数据...</p>
            </el-tab-pane>
        </el-tabs>
        
        <hr>
        <p>已选扩展属性</p>
        <hr>

        <div class="manhour_borderBottom" v-for="(item, i) in selectedList" :key='i'>
            {{ `【${item.propName}】 ：` }}
            <span v-for="(ele, index) in item.selectedProps" :key="index">
                {{ ele }}  
                <i class="el-icon-circle-cross" @click="removeSubProp(ele, i)" style="marginLeft: 6px; marginRight: 6px; cursor: pointer;"></i>
            </span>
        </div>
    </div>
</div>
</template>
<script>

import CarInfo from  'components/iris-carinfo'
   
import Vue from 'vue'
import { Tabs, TabPane } from 'element-ui'
Vue.use(Tabs)
Vue.use(TabPane)

import { getType } from 'common/api-common'
import { MAIN_MODEL_ADD } from 'common/ref-code'
import api from 'common/api'

export default {
    components: {
        CarInfo,
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        star:{
        	type: Boolean,
            default: true
        },
        validateLen:{
        	type:Number,
			default: 6
        }
    },
    data() {
        return {
            carInfo: {},
            extendProps: [],
            subPropList: [],
            activeCode: 'second',
            saveList: [],
            selectedList: [],
        }
    },
    computed: {
        addInfoMap() {
            let info = {}
            for(let i = 0; i < this.selectedList.length; i ++) {
                info[this.selectedList[i].propCode] = []
                for(let j = 0; j < this.selectedList[i].selectedProps.length; j ++) {
                    info[this.selectedList[i].propCode].push(this.selectedList[i].selectedProps[j])
                }
            }
            return info
        },
    },
    created() {
        this.getExtendProps()
    },
    methods: {
        requireCheck() {
            this.$refs.carInfo.validate()
        },
    	clearInfo(){
    		this.$refs.carInfo.clear()
    	},
    	validete(val) {
    	 	this.$emit('validete',val)
        },
    	setStatus(){
    		this.$refs.carInfo.validate();
    	},
        setValue(carInfo, extendProps) {
            // console.log(extendProps)
            this.$nextTick(() => {
                this.$refs.carInfo.setValue({
                    factoryCode: carInfo.factoryCode,
                    brandCode: carInfo.brandCode,
                    seriesCode: carInfo.seriesCode,
                    modelCode: carInfo.modelCode,
                    opvCode: carInfo.opvCode,
                    ioTypeCode: carInfo.iotypeCode
                })
                this.selectedList = extendProps
            })
        },
        reset() {
            this.$nextTick(() => {
                this.$refs.carInfo.setValue({
                    factoryCode: '',
                    brandCode: '',
                    seriesCode: '',
                    modelCode: '',
                    opvCode: '',
                    ioTypeCode: ''
                })
                this.carInfo = {}
                this.selectedList = []
            })
        },
        tabClick() {
            this.querySubPropList(list => {
                this.saveList = list
            })
        },
        selectSubProp(item) {
            // this.isRemove = false
            let obj = {
                propName: this.findActiveName(this.activeCode),
                propCode: this.activeCode,
                selectedProps: []
            }
            obj.selectedProps.push(item)
            let codeList = new Set([])
            if(this.selectedList.length) {
                this.selectedList.forEach(item => {
                    codeList.add(item.propCode)
                })
            }
            if(!codeList.has(this.activeCode) || !this.selectedList.length) {
                this.selectedList.push(obj)
            }else if(codeList.has(this.activeCode)) {
                for(let i = 0; i < this.selectedList.length; i ++) {
                    if(this.selectedList[i].propCode === this.activeCode
                        && this.selectedList[i].selectedProps.indexOf(item) === -1) {
                            this.selectedList[i].selectedProps.splice(0, 1)                            
                            this.selectedList[i].selectedProps.push(item)
                    }
                }
            }
        },
        removeSubProp(ele, i) {
            if(this.disabled) {
                return
            }
            this.selectedList.splice(i, this.selectedList.length-i)
        },
        getCarInfo(data) {
            this.carInfo = {
                factoryCode: data.factoryCode,
                brandCode: data.brandCode,
                seriesCode: data.seriesCode,
                modelCode: data.modelCode,
                opvCode: data.opvCode,
                iotypeCode: data.ioTypeCode
            }
           /* this.selectedList = []*/
            this.$emit('getCarExtendInfo', this.carInfo, this.selectedList)
        },
        getExtendProps() {
            getType(MAIN_MODEL_ADD, items => {
                this.extendProps = []
                items.forEach(item => {
                    let data = {
                        text: item.refDetailName,
                        value: item.refDetailCode
                    }
                    this.extendProps.push(data)
                })
            })
        },
        querySubPropList(next = () => {}) {
            let params = JSON.parse(JSON.stringify(this.carInfo))
            params.addCode = this.activeCode
            params.addInfoMap = this.addInfoMap
                
            this.subPropList = []
            api.skuCar.getCarAdd(params, res => {
                if(res.data.code === 'success') {
                    let list = res.data.obj
                    next(list)
                    // 后端会根据前端删除逻辑过滤并返回最新的关系池, 前端始终以最新的关系池为准
                    // this.lastRelationList = list
                    let arr = []
                    list.forEach(item => {
                        arr.push(item.addValue)
                    })
                    for(let item of new Set(arr).values()) {
                        this.subPropList.push(item)
                    }
                }
            })
        },
        findActiveName(activeCode, list = this.extendProps) {
            let text = ''
            list.forEach(item => {
                if(activeCode === item.value) {
                    text = item.text
                }
            })
            return text
        },
    },
    watch: {
        selectedList: {
            handler(val) {
                this.$emit('getCarExtendInfo', this.carInfo, val)
            },
            deep: true
        },
    }
}
</script>
<style>
.manhour_borderBottom {
	padding: 0.75rem 1.25rem;
    border-bottom: 1px solid #c2cfd6;
    
}
.manhour_borderBottom .el-icon-circle-cross {
    color:#FF4949
}
.extend-sub-prop {
	display: inline-block;
	padding: 5px 5px;
	margin: 0 10px;
	border: 1px solid #ccc;
	border-radius: 3px;
	cursor: pointer;
}
</style>


