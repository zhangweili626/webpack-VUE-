<template>
    <div>
        <b-card>
            <div slot="header">
                <strong>账期账务明细</strong>
            </div>
            <div class="row special">
                <h4>账期：YYYY-MM</h4>
            </div>
            <div class="row special">
                <p>门店：辅导教师拉解放东路</p>
            </div>
            <div class="row special">
                <p>业务编码：fdjslajfd</p>
            </div>
            <div class="row special">
                <p>关账状态：fdslajfdlskajl</p>
            </div>
            <div class="row special">
                <p>关账日期：4324-43-43</p>
            </div>
            <div class="row special">
                <p>关账人：马云</p>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="danger" @click="closeAccount">关账</b-button>
                    </div>
                </div>
            </div>
        </b-card>
    </div>
</template>
<script>

    import { MessageBox } from 'element-ui'
    export default {
        data() {
            return {

            }
        },
        methods: {
            closeAccount() {
                const _this = this
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
        }
    }
    // MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    // }).then(() => {
    //     Message({
    //     type: 'success',
    //     message: '删除成功!'
    //     });
    // }).catch(() => {
    //     Message({
    //     type: 'info',
    //     message: '已取消删除'
    //     });          
    // });
</script>

<style scoped>
    .special {
        padding-left: 30%;
    }
</style>
