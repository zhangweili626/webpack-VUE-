<template>
    <div class="index">
        <ul>
            <li  v-for="item in listData" :key="item.id">
                <router-link :to="item.path">{{item.meta.label}}</router-link>
            </li>
        </ul>
        <!-- <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-12">
                <div style="text-align: center;">
                    <file-upload url='https://posttestserver.com/post.php?dump' :thumb-url='thumbUrl' :accept="accept" :btn-label="btnLabel" :btn-uploading-label="btnUploadingLabel" @success="onSucess">
                    </file-upload>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
    import router from '../../router/index.js'
    import common from 'common/common'
    // import {
    //     FileUpload
    // } from 'v-file-upload'
    export default {
        data() {
            return {
                listData:[],
                fileUploadSuccess: false, //上传文件是否正常标志位
                accept: '.mp4,.doc,.png,.jpg,.xlsx', // 文件类型筛选
                btnLabel: '选择文件', // 按钮标题
                btnUploadingLabel: '正在上传...', // 上传进度标题
            }
        },
        methods: {
            // thumbUrl(file) {
            //     return ''
            // },
            // onSucess() { // 上传成功回调
            //     this.fileUploadSuccess = true
            //     //   Toast('上传文件成功')
            // }
        },
        mounted(){
            this.listData = router.options.routes[0].children;
        },
        components: {
          // FileUpload 
        }
    }
</script>
<style>
    .index ul li {
        cursor: pointer
    }
</style>
