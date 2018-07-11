<template>
<div>
    <div class="block-header clearfix">
        <div class="select pull-left">
            <b-form-select v-model="selectWork" :options="workTypeList" ref="select">
            </b-form-select>
        </div>
        <div class="pull-left textStyle">
            <img src="../img/info.png" alt="">
            <span style="marginLeft: 8px">仅显示已被派工的工位和正在施工的工位</span>
        </div>
        <div class="toggle-button-opencard" @click="toggleTypeOfPage">切换</div>
    </div>
    <div class="block-content">
        <station-list :list="list" @itemClick="itemClick"></station-list>
    </div>
</div>
</template>
<script>
import StationList from './station-list'
import api from 'common/api.js'
import common from 'common/common'
export default {
    components: {
        StationList
    },
    props:{
       workTypeList: {
           type: Array,
           default: function() {
               return []
           }
       }
    },
    data() {
       return {
            workType: [
                {
                    text: '机电',
                    value: '0'
                },
                {
                    text: '钣金',
                    value: '1'
                },
                {
                    text: '油漆',
                    value: '2'
                }
            ],
            selectWork: '',
            list: [
                // {stationName: '机电工位', number: 'MO 1'},
                // {stationName: '喷漆工位', number: 'MO 2'},
                // {stationName: '钣金工位', number: 'MO 3'},
                // {stationName: '油漆工位', number: 'MO 4'},
                // {stationName: '美容工位', number: 'BO 1'},
                // {stationName: '机电工位', number: 'BO 2'},
                // {stationName: '钣金工位', number: 'BO 3'},
                // {stationName: '喷漆工位', number: 'BO 4'},
            ]
       }
    },
    created() {
        this._initData();
    },
    computed: {
        //  storeInfoVo() {
        //     let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        //     return userInfo.hasOwnProperty('userAvailableInfo') 
        //             ? userInfo.userAvailableInfo.storeInfoVo
        //             : null
        // }
    },
    methods: {
        // 切换事件(技师打卡与工位打卡相互切换)
        toggleTypeOfPage() {
            this.$emit('togglepage', 'technician')
        },
        // 初始化数据
        _initData() {
            this.storeInfoVo = JSON.parse(common.getSession('userInfo')).userAvailableInfo.storeInfoVo
            let param = {
                    // empWorkTypeCodes: [this.selectWork],
                    stationCode: this.selectWork,
                    storeCode: this.storeInfoVo ? this.storeInfoVo.storeCode : '',
                    isFilter: 1 
                }
            api.clock.getStationList(param, (res) => {
                if(res.data.code === 'success') {
                    this.list = res.data.obj;
                };
            })
        },
        // 选中某一工位跳转
        itemClick(item) {
            this.$router.push({
                path: `/clock/station-tdetail/${item.stationCode}`
            })
        }
    },
    watch: {
        selectWork(val) {
             this._initData();
        }
    }
}
</script>
<style scoped>
.toggle-button-opencard {
    position: absolute;
    right: 0px;
    top: 0px;
    height: 30px;
    width: 60px;
    border-radius: 5px;
    font-size: 15px;
    line-height: 30px;
    text-align: center;
    background-color: rgb(189, 56, 56);
    color: #fff;
    cursor: pointer;
}
.block-header {
    padding-bottom: 10px;
    border-bottom: 3px solid #F2F2F2;
    position: relative;
}
.select {
    width: 270px;
    height: 38px;
}
.select select {
    border-radius: 2px;
    border: 1px solid #E9EFF3;
}
.textStyle {
    margin-left: 40px;
    margin-top: 6px;
}

.block-content {
    /* padding-top: 50px;
    padding-left: 50px; */
}
</style>
