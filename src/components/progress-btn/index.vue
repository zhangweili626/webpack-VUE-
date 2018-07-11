<template>
    <button class="progress-btn" @click.stop="clickbtn">
        <div class="progress-btn-bg1"></div>
        <div class="progress-btn-bg2" v-if="typeName=='red'" :style="{width: bgWidth+'%'}"></div>
        <div class="progress-btn-bg3" v-if="typeName=='green'" :style="{width: bgWidth+'%'}"></div>
        <span>{{name}}</span>
    </button>
</template>
<script>
// 开关类型： green:打卡（绿），red:关闭（红）
export default {
    props:{
        disabled:{
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: '开关'
        },
        typeName: {
            type: String,
            default: 'green'
        },
        bgWidth: {
            type: Number,
            default: 100
        },
        params: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data(){
        return {

        }
    },
    methods:{
        clickbtn() {
            if(this.disabled){
                return
            };
            this.$emit('clickbtn', this.params);
        }
    }
}
</script>

<style scoped>
.progress-btn{
    display: inline-block;
    height: 32px;
    padding: 0px 12px;
    border-radius: 4px;
    position: relative;
    border: none;
    line-height: 1;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 32px;
    background-color: transparent;
    z-index: 0;
    overflow: hidden;
    outline: snow;
}
.progress-btn-bg1{
    width: 100%;
    height: 100%;  
    position: absolute;
    top:0;
    left: 0;
    background: #B2BEC6;
    z-index: -10;
}
.progress-btn-bg2{
    width: 50%;
    height: 100%;  
    position: absolute;
    top:0;
    left: 0;
    background: red;
    z-index: -6;
}
.progress-btn-bg3{
    width: 50%;
    height: 100%;  
    position: absolute;
    top:0;
    left: 0;
    background:#5EB870;
    z-index: -4;
}
</style>

