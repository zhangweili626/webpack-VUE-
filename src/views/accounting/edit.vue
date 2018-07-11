<template>
    <div>
        <b-card header="账期账务明细">
            <div class="row specialP">
                <h4>账期：{{ content.beTermNo }}</h4>
            </div>
            <div class="row specialP">
                <p>门店：{{ content.storeName }}</p>
            </div>
            <div class="row specialP">
                <p>业务编码：{{ content.accountCode }}</p>
            </div>
            <div class="row specialP">
                <p>关账状态：{{ content.accountStatus === 1 ? '已关账' : (content.accountStatus === 0 ? '未关账' : '逾期未操作') }}</p>
            </div>
            <div class="row specialP">
                <p>关账日期：{{ content.closedTimeStr }}</p>
            </div>
            <div class="row specialP">
                <p>关账人：{{ content.closedEmpName }}</p>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button v-if="judgeCondition&&closeBtn" size="sm" variant="danger" @click="closeAccount">关账</b-button>
                    </div>
                </div>
            </div>
        </b-card>
    </div>
</template>
<script>
    import collectionApi from 'common/api-collection.js'
	import {hasBtn} from 'common/api-common.js'
    import { MessageBox, Message } from 'element-ui'
    import api from 'common/api.js'
    export default {
        data() {
            return {
                accountingCode: '',
                content: '',
                judgeCondition: false
            }
        },
        computed: {
            closeBtn() {
                return hasBtn(collectionApi.accounting.editState)
            }
        },
        methods: {
            getEditContent() {
                const _this = this
                _this.accountingCode = _this.$route.params.accountingcode
                let option = {
                    accountCode: _this.accountingCode
                }
                api.accounting.queryByCode(option, (res) => {
                    if(res.data.code === 'success') {
                        _this.content = res.data.obj
                        if(_this.content.accountStatus === 0) {
                            _this.judgeCondition = true
                        }
                    }
                })
            },
            closeAccount() {
                const _this = this
                let option = {
                    accountCode: _this.accountingCode 
                }
                const h = this.$createElement;
                MessageBox({
                    title: '提示',
                    // 具体消息提示是由定义的h方法 创建标签 添加进去的
                    message: h('p', null, [
                        h('span', null, '关账为不可逆操作，是否确定关账？'),
                        h('i', { style: 'fontStyle: normal' }, '')
                    ]),
                    // showCanceButton 值为false 取消不显示  值为true 取消显示
                    showCancelButton: true,
                    // 确定按钮的信息
                    confirmButtonText: '确定',
                    // 取消按钮的信息
                    cancelButtonText: '取消',
                    // 提示框关闭之前执行
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            instance.confirmButtonLoading = true;
                            instance.confirmButtonText = '执行中...';
                            api.accounting.closeAccounting(option, function(res){
                                if(res.data.code === "success"){
                                    Message({
                                        type: 'success',
                                        message: '操作成功'
                                    });
                                    // _this.$router.push({
                                    //     path: `/accounting/edit/${_this.accountingCode}`
                                    // })
                                    window.location.href = window.location.href 
                                    _this.judgeCondition = false
                                }else {
                                    // Message({
                                    //     type: 'info',
                                    //     message: '操作失败'
                                    // });
                                }
                            })
                            setTimeout(() => {
                                // done方法不调用  提示框不消失
                                done();
                                setTimeout(() => {
                                    instance.confirmButtonLoading = false;
                                }, 300);
                            }, 300);
                        } else {
                            done();
                        }
                    },
                    callback: function() {
                        // 在MessageBox参数对象中，如果不使用Promise，则需要在对象参数中添加callback，否则控制台会报 Uncaught (in promise) cancel ， 如果callback中可以不做任何事情，但必须有
                        // callback(pager, pageSize)
                    }
                })
            }
        },
        created() {
            const _this = this
            _this.getEditContent()
        }
    }
</script>

<style scoped>
    .specialP {
        padding-left: 30%;
    }
</style>
