<template>
    <div class="iris-modal-font">
        <b-modal id="modalPrevent"
                ref="mydeletemodalcard"
                :hide-footer="true"
                :hide-header="true">
                <div class="myselfDelete">
                    <div class="myselfDelete-mysmall-warning" v-if="hasWarningTitle"><span></span><span>{{ warnigTitle }}</span></div>
                    <div v-if="hasTipsTitle" class="myselfDelete-mysmall-tips">{{ tipsTitle }}</div>
                    <div class="myselfDelete-mysmall-input-modal">
                        <div v-if="isShowtips" class="myselfDelete-mysmall-input-tips">
                            输入<span>"{{ sureName }}"</span>点击<span>确认</span>完成{{ whatStep }}操作
                        </div>
                        <input class="myself-boxshadow" type="text" @blur="loseFouce" @focus="inFouce" v-model="isSure" :class="{'myselfDelete-input' : hasWrite}"/>
                    </div>
                    <div class="myselfDelete-mysmall-button-modal">
                        <button class="myself-boxshadow" @click="closeDeleteModel">{{ goBackName }}</button>
                        <button class="myself-boxshadow" :class="{'modal-btn-style' : !canSure}" :disabled="canSure" @click="ruins">{{ sureBtnName }}</button>
                    </div>
                </div>
        </b-modal>
    </div>
</template>
<script>
    export default {
        props: {
            // 返回按钮的名称
            goBackName: {
                type: String,
                default: '返回'
            },
            // 确认什么操作
            whatStep: {
                type: String,
                default: '作废'
            },
            // 作废名称
            sureName: {
                type: String,
                default: 'CONFIRM'
            },
            // 作废按钮的名称
            sureBtnName: {
                type: String,
                default: '确认'
            },
            // 模态框未填或填写不合理样式控制
            hasWrite: {
                type: Boolean,
                default: false
            },
            // 提示输入内容标题
            tipsTitle: {
                type: String,
                default: '确认作废吗？'
            },
            // 警告标题文字
            warnigTitle: {
                type: String,
                default: '作废操作无法撤销'
            },
            // 是否需要提示输入标题
            hasTipsTitle: {
                type: Boolean,
                default: true
            },
            // 是否需要警告标题
            hasWarningTitle: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                // 获取到用户输入的内容，并回传
                isSure: '',
                canSure: true,
                isShowtips: true
            }
        },
        methods: {
            closeDeleteModel() {
                this.$refs.mydeletemodalcard.hide()
                this.$emit('goBack')
            },
            ruins() {
                this.$emit('sureEvent', this.isSure)
                this.isShowtips = true
                this.isSure = ''
                this.canSure = true
            },
            showDeleteModel() {
                this.$refs.mydeletemodalcard.show()
                this.isShowtips = true
                this.isSure = ''
                this.canSure = true
            },
            loseFouce() {
                if(!this.isSure) {
                    this.isShowtips = true
                }
            },
            inFouce() {
                this.isShowtips = false
            }
        },
        watch: {
            isSure: function(value) {
                if(value.toLowerCase() === this.sureName.toLowerCase()) {
                    this.canSure = false                    
                }else {
                    this.canSure = true
                }
            }
        }
    }   
</script>
<style>
    .myself-boxshadow {
        box-shadow: 0 1px 5px #ccc;
    }
    .myselfDelete-mysmall-warning {
        width: 50%;
        margin: 0 auto;
        font-size: 22px;
        /* height: 30px; */
        line-height: 30px;
        padding-left: 30px;
        position: relative;
        margin-bottom: 20px;
    }
    .myselfDelete-mysmall-warning>span:nth-child(1) {
         /* display: inline-block; */
         position: absolute;
         width: 30px;
         top: 0px;
         left: 0px;
         background-image: url(./../../../static/image/warning.png);
         background-position: center top;
         /* width: 30px; */
         height: 30px;
     }
     .iris-modal-font .modal-content {
        border-radius: 5px;
    }
    .myselfDelete-mysmall-input-modal {
        width: 100%;
        text-align: center;
        padding: 10px 0px;
        position: relative;
        height: 56px;
        background-color: transparent;
        /* padding-left: 20px; */
    }
    
    .myselfDelete-mysmall-input-tips>span:first-child {
        color: rgb(226, 101, 101);
    }
    .myselfDelete-mysmall-input-tips>span:last-child {
        /* display: inline-block; */
        padding: 2px 5px;
        background-color: rgb(119, 155, 209);
        color: #fff;
        border-radius: 3px;
    }
    .myselfDelete-input {
        border: 1px solid rgb(206, 35, 35);
    }
    .myselfDelete-mysmall-tips {
        padding: 10px 0px;
        font-size: 20px;
    }
    .myselfDelete-mysmall-input-modal input {
        position: absolute;
        left: 20%;
        top: 10px;
        width: 60%;
        height: 36px;
        border-radius: 3px;
        outline: none;
        border-style:none;
        border: 1px solid #ccc;
        padding-left: 5px;
        z-index: 10;
        background-color: transparent;
    }
    .myselfDelete-mysmall-input-tips {
        position: absolute;
        top: 10px;
        left: 15%;
        width: 70%;
        height: 36px;
        line-height: 36px;
        z-index: 0;
    }
    .myselfDelete-mysmall-button-modal {
        text-align: center;
        padding-top: 10px;
    }
    .myselfDelete-mysmall-button-modal button {
        height: 36px;
        width: 20%;
        margin-right: 20px;
        background-color: #F2F3F5;
        border: none;
        border-radius: 5px;
        color: #48576A;
    }
    .myselfDelete-mysmall-button-modal button:last-child {
        margin-right: 0px;
    }
    .myselfDelete {
        text-align: center;
        padding-top: 20px;
        padding-bottom: 10px;
    }
    .modal-btn-style {
        background: #587EB9 !important;
        color: #fff !important;
    }
</style>


