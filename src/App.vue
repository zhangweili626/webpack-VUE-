<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import './assets/css/main';
.el-dialog__title{
    font-size: 1.25rem!important;
    font-weight: normal!important;
}
.el-dialog__body{
     border-top: 1px solid #c2cfd6;
     border-bottom: 1px solid #c2cfd6;
     margin-top: 14px;
}
.el-dialog__close{
    font-size: 12px!important;
}
 .dialog-footer-cla{
     height: 34px;
     padding-top: 4px;
 }
 .inp-invalid{
	border-color: #f86c6b!important;
}
.inp-invalid input{
	border: 1px solid #f86c6b!important;
}
.inp-invalid select{
	border: 1px solid #f86c6b!important;
}
.inp-invalid .is-undefined {
    border: none !important;
}
.input-append-yuan{
    position: absolute;
    margin-top: -30px;
    margin-left: 2px;
}
.el-dialog__body{
    // padding: 10px 0 0 0!important;
}
.el-dialog--large{
    width: 80%!important;
}
.large-diag .el-dialog__wrapper{
    background: rgba(0, 0, 0, 0.5);
}
</style>
