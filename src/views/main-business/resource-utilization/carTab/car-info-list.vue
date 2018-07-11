<template>
    <div class="clearfix car-info-content text-center">
        <div style="width:250px !important;">
            <el-input v-if="isShowSearch" placeholder="搜索车牌号" icon="search" v-model="input" :on-icon-click="handleIconClick">
            </el-input>
        </div>
        <div class="car-info-box pull-left " :class="{'mt-3' : isShowSearch}" v-for="(item, index) in list" :key="index" @click="itemClick(item)">
            <div class="car-id">
                <el-tooltip class="item" effect="dark" :content="item.code" placement="top-start">
                    <strong>{{item.code}}</strong>
                </el-tooltip>
            </div>
            <div class="car-info-con">
                <p>
                    <i class="iconfont icon-baoshijie ml-2" style="color:#f3a239;font-size:25px;vertical-align : middle;"></i>
                    <i class="over-time">{{item.carId}}</i>
                </p>
            </div>
            <div class="car-info-con mb-2">
                <p class="mt-2 mb-2 ml-2 color-success" style="font-size: 13px;" :class="`color-${item.bg}`">约定交车</p>
                <p style="border-radius:10px;padding:4px;min-height:25px;" class="ml-2 mr-2" :class="`${item.bg}`">{{item.overTime}}</p>
            </div>
            <div class="car-info-wait">
                <p>
                    <span class="wait-time">已等待</span>
                    <span>{{item.waitTime}}</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { Input , Tooltip} from 'element-ui'
Vue.use(Input)
Vue.use(Tooltip)
export default {
    props: {
        list: [Array],
        isShowSearch: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            input: null
        }
    },
    methods: {
        itemClick(item) {
            this.$emit('itemClick', item)
        },
        handleIconClick() {
            const _this = this
            if (_this.input) {
                _this.$emit('handleIconClick', _this.input)
            }else{
                _this.$emit('handleIconClick', "")
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.color-success {
    color: #5fbc69;
}
.color-danger {
    color: #d63a3c;
}
.color-warnning {
    color: #f3a239;
}
.color-block {
    color: #333333;
}
.success {
    background-color: #5fbc69;
    color: #fff;
}
.danger {
    background-color: #d63a3c;
    color: #fff;
}
.warnning {
    background-color: #f3a239;
    color: #fff;
}
.block {
    color: #fff;
    background-color: #333333;
}
.car-info-box {
    margin-right: 9px;
    width: 160px;
    border: 1px solid #f2f2f2;
    cursor: pointer;
}
.car-info-header {
    color: #fff;
    padding-left: 8px;
    font-size: 14px;
}
.car-id {
    font-size: 14px;
    color: #333333;
    padding: 8px 0 6px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // border-bottom: 1px solid #F2F2F2;
}
.car-info-con {
    font-size: 12px;
    color: #333333;
    // border-bottom: 1px solid #F2F2F2;
}
p {
    padding: 0;
    margin: 0;
}
.car-info-wait {
    font-size: 12px;
    padding: 3px 0 6px 8px;
    border-top: 1px solid #f2f2f2;
    // border-bottom: 1px solid #F2F2F2;
}
.wait-time {
    color: #bec1cd;
    margin-right: 12px;
    font-size: 13px;
}
.over-time {
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 25px;
    font-size: 14px;
    width: 90px;
    line-height: 25px;
    font-style: normal;
}
</style>

