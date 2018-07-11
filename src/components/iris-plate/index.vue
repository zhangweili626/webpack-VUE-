<template>
    <div class="iris-plate-component" ref="areaSelect">
        <!-- <b-form-select :disabled="disabledState" :state="proviceState ? null : proviceState" :options="provincesAbbr" v-model="provinceCode"/> -->
        <!-- <span class="iris-plate-component-delete">x</span> -->
        <b-form-input readonly @focus.native="showSelect" :value="provinceCode"/><div class="iris-plate-component-delete"><span v-if="!disabledState" @click="reset">x</span><b-form-input :readonly="disabledState" :state="plateState ? null : plateState" v-model="plateCode"  @input="inputFun" @blur.native="losefocus" :maxLength="7"/></div>
        <div v-if="isShowFrame&&!disabledState" class="area-plate-choose">
            <span v-for="(item, index) in provincesAbbr" v-if="item.text" :key="index" @click="chooseArea(item)">{{ item.text ? item.text: ' ' }}</span>
        </div>
    </div>
</template>
<script>
    import config from 'common/config'
    export default {
        model: {
            prop: 'plateNumber',
            event: 'giveData'
        },
        props: {
            // 禁用状态
            disabledState: {
                type: Boolean,
                default: false
            },
            // 控制车牌输入框的颜色
            plateState: {
                type: Boolean,
                default: true
            },
            // 控制区域选择框的颜色
            proviceState: {
                type: Boolean,
                default: true
            },
            // 是否需要监控区域的改变
            isWatchProvince: {
                type: Boolean,
                default: false
            },
            plateNumber: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                plateCode: '',
                provinceCode: '',
                provincesAbbr: config.provincesAbbr,
                isShowFrame: false
            }
        },
        methods: {
            chooseArea(value) {
                this.provinceCode = value.text
                this.isShowFrame = false
            },
            inputFun(){
                this.$emit('giveData', this.provinceCode + this.plateCode )
            },
            losefocus() {
                if(!this.disabledState){
                    this.$emit('losefocus', this.provinceCode+this.plateCode )
                }
            },
            setValue(arg1, arg2) {
                this.plateCode = arg1
                this.provinceCode = arg2
            },
            showSelect() {
                this.isShowFrame = true
            },
            reset() {
                this.provinceCode = ''
                this.plateCode = ''
                this.isShowFrame = false
                this.$emit('giveData', this.provinceCode + this.plateCode)
                this.$emit('losefocus', this.provinceCode+this.plateCode )
            }
        },
        watch: {
            provinceCode: function(value) {
                if(this.isWatchProvince) {
                    this.plateCode = ''
                }
                this.$emit('giveData', this.provinceCode + this.plateCode)
                // this.$emit('losefocus', this.provinceCode , this.plateCode )
            },
            plateNumber: function(value) {
                if(value == this.provinceCode + this.plateCode){
                    return
                }else{
                    for (let index = 0; index < config.provincesAbbr.length; index++) {
                        const element = config.provincesAbbr[index];
                        if(element.value == value.substring(0,1)){
                            this.provinceCode = value.substring(0,1)
                            this.plateCode = value.substring(1)
                            return;
                        }
                    }
                    this.plateCode = value.substring(0)
                }
            },
            isShowFrame: function(value) {
                const _this = this
                document.addEventListener('click', (e) => {
                    let areaSelect = _this.$refs.areaSelect
                    if(areaSelect && !areaSelect.contains(e.target))  this.isShowFrame = false    
                })
            }
        },
    }
</script>
<style>
    .iris-plate-component {
        position: relative;
    }
    /* .iris-plate-component::after {
        position: absolute;
        content: 'x';
        width: 10px;
        height: 10px;
        line-height: 10px;
        text-align: center;
        color: #ccc;
        right: 5px;
        top: 50%;
        transform: translate(0, -50%);
        font-size: 10px;
    } */
    .iris-plate-component>.area-plate-choose {
        position: absolute;
        top: 110%;
        left: 0px;
        width: 100%;
        border: 1px solid rgb(214, 209, 209);
        border-radius: 5px;
        z-index: 9999;
        background-color: #fff;
    }
    .iris-plate-component>.area-plate-choose>span {
        display: inline-block;
        border-radius: 3px;
        margin-right: 5px;
        margin-left: 5px;
        margin-top: 5px;
        margin-bottom: 5px;
        padding: 3px;
        cursor: pointer;
    }
    .iris-plate-component>.area-plate-choose>span:hover {
        background-color: rgb(128, 128, 243);
        color: #fff;
    }
    .iris-plate-component>input:first-child{
        width: 22%;
        margin-right: 3%;
        /* vertical-align: middle; */
    }
    .iris-plate-component>input {
        width: 75%;
        height: 100%;
        display: inline-block;
        /* vertical-align: middle; */
    }
    .iris-plate-component>.iris-plate-component-delete {
        display: inline-block;
        width: 75%;
        height: 37px;
        position: relative;
    }
    .iris-plate-component>.iris-plate-component-delete>span {
        position: absolute;
        content: '';
        width: 10px;
        height: 10px;
        line-height: 10px;
        text-align: center;
        right: 3px;
        top: 50%;
        transform: translate(0, -50%);
        color: #ccc;
        cursor: pointer;
    }
    .iris-plate-component>.iris-plate-component-delete>input {
        height: 37px;
    }
    /* .iris-plate-component>input:last-child {
        padding-right: 10px;
    } */
    /* .iris-plate-component-delete {
        position: absolute;
        width: 10px;
        height: 10px;
        line-height: 10px;
        text-align: center;
        color: #ccc;
        right: 0px;
        top: 50%;
        transform: translate(0, -50%);
    } */
</style>

