<template>
    <div class="animated fadeIn clearfix container">
        <div class="card-left">
            <div class="group-title">
                车辆出现何种故障现象
            </div>
            <table class="table table-bordered">
                <tr>
                    <td>
                        1.车辆出现何种故障现象
                    </td>
                    <td>
                        XXX
                    </td>
                </tr>
                <tr>
                    <td>
                        2.大致部位在何处
                    </td>
                    <td>
                        XXX
                    </td>
                </tr>
                <tr>
                    <td>
                        3.在何种操作或状态下出现
                    </td>
                    <td>
                        XXX
                    </td>
                </tr>
                <tr>
                    <td>
                        4.曾经维修或换过什么
                    </td>
                    <td>
                        XXX
                    </td>
                </tr>
                <tr>
                    <td>
                        5.详细问诊记录
                    </td>
                    <td>
                        XXX
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <span><input type="checkbox">是否需要试车</span> <span class="float-right btn-red">保存</span>
                    </td>
                </tr>
            </table>
            <div class="group-title">
                查询项目
            </div>
            <div class="group-body">
                <b-row>
                    <b-col sm="6">
                        <b-form-group>
                            <label class="label-input">车型试用搜索</label>
                            <b-form-input value="车型XXX">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col sm="6">
                        <b-form-group>
                            <label class="label-input">按编号搜索</label>
                            <b-form-input value="请输入服务编号">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="6">
                        <b-form-group>
                            <label class="label-input">按名字搜索</label>
                            <b-form-input value="请输入服务编号">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col sm="6">
                        <b-form-group>
                            <label class="label-input">配件名搜索</label>
                            <b-form-input value="配件名称">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col sm="12">
                        <span class="float-right btn-red">搜索</span>
                    </b-col>
                </b-row>
            </div>
            <div class="group-title">
                选择套餐包
            </div>
            <img src="./img/Bitmap.png" alt="">
            <div class="group-title">
                选择套餐包
            </div>
            <div class="group-item">
                <span class="btn-outline-red">
                    赠品
                </span>
                <span class="group-item-content">
                    2月促销活动，送xxxxx
                </span>
                <b-form-checkbox class="float-right" checked></b-form-checkbox>
            </div>
            <div class="group-item">
                <span class="btn-outline-red">
                    促销
                </span>
                <span class="group-item-content">
                    2月促销活动，送xxxxx
                </span>
                <b-form-checkbox checked class="float-right"></b-form-checkbox>
            </div>
        </div>
        <div class="card-right">
            <b-card class="my-tab">
                <b-tabs pills>
                    <b-tab title="工单信息" active>
                        <div class="appointment-box">
                            <div class="flow-container">
                                <div class="flow">
                                    <div class="flow-item clearfix">
                                        <div class="flow-icon pull-left" style="background: #fff">
                                            <img src="./img/Group 10.png" alt="">
                                        </div>
                                        <div class="text pull-left">
                                            <span>预检</span>
                                        </div>
                                    </div>
                                    <div class="flow-item flow-active clearfix">
                                        <div class="flow-icon pull-left" style="background: #fff">
                                            <img src="./img/loading.png" alt="">
                                        </div>
                                        <div class="text pull-left">
                                            <span>工单</span>
                                        </div>
                                    </div>
                                    <div class="flow-item clearfix">
                                        <div class="flow-icon pull-left">3</div>
                                        <div class="text pull-left">
                                            <span>技师增项</span>
                                        </div>
                                    </div>
                                    <div class="flow-item clearfix">
                                        <div class="flow-icon pull-left">4</div>
                                        <div class="text pull-left">
                                            <span>客户沟通</span>
                                        </div>
                                    </div>
                                    <div class="flow-item clearfix">
                                        <div class="flow-icon pull-left">5</div>
                                        <div class="text pull-left">
                                            <span>施工完成</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="appointment-main">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="precheck-head">
                                            <div class="pre-btn-box">
                                                <div class="pre-btn">已选增项</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <table class="table table-bordered">
                                            <tr>
                                                <td> 项目</td>
                                                <td> 备件</td>
                                                <td> 工时</td>
                                                <td> 工时单价</td>
                                                <td> 付费</td>
                                                <td> 库存</td>
                                                <td> 选择</td>
                                            </tr> 
                                            <tr>
                                                <td> S0011 
                                                     制动片X4 更换
                                                </td>
                                                <td> 6.52 </td>
                                                <td>88TU</td>
                                                <td>6.51</td>
                                                <td>自费</td>
                                                <td>有</td>
                                                <td>
                                                    <img class="item" src="./img/Group 18.png" alt="">
                                                    <img class="item" src="./img/Group 20.png" alt="">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td> S0011 
                                                     制动片X4 更换
                                                </td>
                                                <td> 6.52 </td>
                                                <td>88TU</td>
                                                <td>6.51</td>
                                                <td>自费</td>
                                                <td>有</td>
                                                <td>
                                                    <img class="item" src="./img/Group 18.png" alt="">
                                                    <img class="item" src="./img/Group 20.png" alt="">
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="precheck-head">
                                            <div class="pre-btn-box">
                                                <div class="pre-btn-red">已选增项</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <table class="table table-bordered">
                                            <tr>
                                                <td> 项目</td>
                                                <td> 备件</td>
                                                <td> 工时</td>
                                                <td> 工时单价</td>
                                                <td> 付费</td>
                                                <td> 库存</td>
                                                <td> 选择</td>
                                            </tr> 
                                            <tr>
                                                <td> S0011 
                                                     制动片X4 更换
                                                </td>
                                                <td> 6.52 </td>
                                                <td>88TU</td>
                                                <td>6.51</td>
                                                <td>自费</td>
                                                <td>有</td>
                                                <td><img class="item" src="./img/Group 18.png" alt="">
                                                    <img class="item" src="./img/Group 20.png" alt=""></td>
                                            </tr>
                                            <tr>
                                                <td> S0011 
                                                     制动片X4 更换
                                                </td>
                                                <td> 6.52 </td>
                                                <td>88TU</td>
                                                <td>6.51</td>
                                                <td>自费</td>
                                                <td>有</td>
                                                <td><img class="item" src="./img/Group 18.png" alt="">
                                                    <img class="item" src="./img/Group 20.png" alt=""></td>
                                            </tr>
                                            <tr>
                                                <td> S0011 
                                                     制动片X4 更换
                                                </td>
                                                <td> 6.52 </td>
                                                <td>88TU</td>
                                                <td>6.51</td>
                                                <td>自费</td>
                                                <td>有</td>
                                                <td><img class="item" src="./img/Group 18.png" alt="">
                                                    <img class="item" src="./img/Group 20.png" alt=""></td>
                                            </tr>
                                            <tr>
                                                <td colspan="7">
                                                    <span class="float-left">备注：如果不能简述，请拍照</span>
                                                    <span class="btn-time float-right">工时</span>
                                                    <span class="btn-edit float-right">编辑</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="7">
                                                    <div class="picture">
                                                       <img class="item" src="./img/Group 27.png" alt="">
                                                       <img class="item" src="./img/Group 28.png" alt="">
                                                       <img class="item" src="./img/Group 29.png" alt="">
                                                       <img class="item" src="./img/Group 30.png" alt="">
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="board-title">
                                            <span class="item-selected">工位看板</span>
                                            <span class="item">共2个新增看板</span>
                                            <span class="item">工时总计: ￥ 2,200</span>
                                            <span class="item">备件总计: ￥ 8,800</span>
                                        </div>
                                        <div class="board-body">
                                            <div class="row">
                                                 <div class="col-md-7">
                                                     <div class="row">
                                                         <div class="col-md-12">
                                                            <b-form-fieldset horizontal label="预约来源" :label-cols="4">
                                                               <b-form-select :options="[]" placeholder="" disabled></b-form-select>
                                                             </b-form-fieldset>
                                                         </div>
                                                     </div>
                                                     <div class="row">
                                                         <div class="col-md-12">
                                                            <b-form-fieldset horizontal label="总计金额" :label-cols="4">
                                                               <b-form-select :options="[]" placeholder="" disabled></b-form-select>
                                                             </b-form-fieldset>
                                                         </div>
                                                     </div>
                                                     <div class="row">
                                                         <label class="col-md-4">申请折扣</label>   
                                                         <div class="col-md-3">  
                                                            <b-form-select :options="[]" placeholder="" disabled></b-form-select>
                                                         </div> 
                                                         <div class="col-md-3"> 
                                                            <b-form-select class="col-md-3" :options="[]" placeholder="" disabled></b-form-select>
                                                         </div>
                                                        
                                                         <span class="col-md-2 btn-commit">确定</span>  
                                                         
                                                     </div>
                                                 </div>
                                                 <div class="col-md-5">
                                                     <div class="row">
                                                         <div class="col-md-12">
                                                            <b-form-fieldset horizontal label="维修项目2个，合计：" label-text-align="right" :label-cols="7">
                                                                <span class="item-text">¥ 9,200</span>
                                                             </b-form-fieldset>
                                                         </div>
                                                     </div>
                                                     <div class="row">
                                                         <div class="col-md-12">
                                                            <b-form-fieldset horizontal label="优惠方式：" label-text-align="right" :label-cols="7">
                                                                <span class="item-text">整单9.8折</span>
                                                             </b-form-fieldset>
                                                         </div>
                                                     </div>
                                                     <div class="row">
                                                         <div class="col-md-12">
                                                            <b-form-fieldset horizontal label="折扣/优惠金额:" label-text-align="right" :label-cols="7">
                                                                <span class="item-text">-¥ 184.00</span>
                                                             </b-form-fieldset>
                                                         </div>
                                                     </div>
                                                     <div class="row">
                                                         <div class="col-md-12">
                                                            <b-form-fieldset horizontal label="促销活动：" label-text-align="right" :label-cols="7">
                                                                <span class="item-text">xxxxxxxx</span>
                                                             </b-form-fieldset>
                                                         </div>
                                                     </div>
                                                     <div class="row">
                                                         <div class="col-md-12">
                                                            <b-form-fieldset horizontal label="实际应付：" label-text-align="right" :label-cols="7">
                                                                <span class="item-text">¥ 9,016</span>
                                                            </b-form-fieldset>
                                                         </div>
                                                     </div>
                                                 </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="appointment-footer clearfix">
                                <div class="save-box pull-right">
                                    <div class="f-btn-box customer">
                                        <span>客户签名：</span>
                                        <div class="autograph-box">
                                            <img src="./img/autograph.jpeg" alt="" width="120px">
                                        </div>
                                        <div class="save-btn f-btn pull-left">预览报价</div>
                                        <div class="next-btn f-btn pull-left">提交派工</div>
                                    </div>
                                </div>        
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="客户信息">
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {}
        },
        methods: {},
        components: {}
    }
</script>

<style lang="scss" scoped>
    .container {
        display: flex;
        margin: 0;
        padding: 0; 
        width: 1840px !important;
    }
    .card-left {
        width: 430px;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        float: left;
    }
    .card-right {
        width: calc(100% - 432px);
        background: #ffffff;
        margin-left: 2px;
        display: flex;
        flex-direction: column;
        float: left;
    }
    .board-title {
        width: 100%;
        padding: 12px 2px;
        border-bottom: 1px solid #F2F2F2;
    }
    .board-title .item-selected {
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #333333;
    }
    .board-title .item {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        margin-left: 30px;
    }
    .board-body {
        padding-top: 15px;
    }
    .group-title {
        width: 100%;
        background: #F5F7FA;
        text-align: center;
        vertical-align: middle;
        font-family: PingFangSC-Regular;
        color: #333333;
        font-size: 14px;
        padding: 12px 0;
    }
    .group-body {
        padding: 17px 12px;
    }
    .group-item {
        padding: 12px 15px 12px 20px;
    }
    .group-item-content {
        margin-left: 13px;
    }
    .picture {
        padding-left: 42px;
        padding-top: 12px;
        padding-bottom: 12px;
        display: flex;
        flex-direction: row;
    }
    .picture .item {
        margin-right: 14px;
    }
    .btn-red {
        width: 51px;
        height: 24px;
        background: #ED6F64;
        border-radius: 2px;
        text-align: center;
        vertical-align: middle;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        padding: 2px 0;
        color: #FFFFFF;
    }
    .label-input {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #333333;
        padding-left: 10px;
    }
    .select-packages {
        width: 100%;
    }
    .btn-outline-red {
        width: 42px;
        height: 18px;
        border: 1px solid #ED6F64;
        border-radius: 2px;
        vertical-align: middle;
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 10px;
        line-height: 10px;
        padding: 2px 4px 2px 4px;
        color: #ED6F64;
    }
    .btn-edit {
       font-family: PingFangSC-Regular;
       font-size: 14px;
       line-height: 14px;
       color: #504C4D;
       background: #F5F5F5;
       border-radius: 2px;
       width: 100px;
       height: 30px;
       padding: 8px 0;
       vertical-align: middle;
       text-align: center;
    }
    .btn-time {
       font-family: PingFangSC-Regular;
       font-size: 14px;
       line-height: 14px;
       color: #FFFFFF;
       background: #5FB870;
       border-radius: 2px;
       width: 100px;
       height: 30px;
       padding: 8px 0;
       vertical-align: middle;
       text-align: center; 
       margin-left: 20px;
    }
    .btn-commit {
        width: 50px;
        height: 30px;
        background: #ED6F64;
        border-radius: 2px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        line-height: 14px;
        color: #FFFFFF; 
        vertical-align: middle;
        text-align: center;
        padding: 8px 0;
    }
    /* appointment style */
    .flow-container {
        padding: 10px 60px;
        border-bottom: 2px solid #F2F2F2;
    }
    .flow {
        display: flex;
    }
    .flow-item {
        flex: 1;
        height: 30px;
        border-bottom: 2px solid #EEEEEE;
    }
    .flow-active {
        border-bottom: 2px solid #7197FF;
    }
    .flow-icon {
        width: 25px;
        height: 25px;
        background: #71757E;
        color: #fff;
        text-align: center;
        line-height: 25px;
        border-radius: 50%;
    }
    .text {
        margin-left: 10px;
    }
    .step {
        padding: 30px 20px 0 20px;
    }
    .step-text {
        font-size: 22px;
        color: #333;
        margin-right: 50px;
    }
    .text-item {
        margin-right: 10px;
    }
    .item-text {
        text-align: center;
        vertical-align: middle;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        margin: 0;
        padding-top: 30px;
    }
    .step-icon {
        width: 13px;
        height: 13px;
        border-radius: 50%;
        margin-top: 5px;
        margin-right: 5px;
    }
    .step-success {
        background: #5FB870;
    }
    .step-default {
        background: #EEEEEE;
    }
    .step-danger {
        background: #FA6144;
    }
    .text-item span {
        font-size: 12px;
        color: #333;
    }
    .step .car-img {
        height: 246px;
    }
    .step .btn-box {
        display: flex;
        justify-content: center;
    }
    .step .btn-box .btn-item {
        width: 46px;
        height: 23px;
        background: #fff;
        border: 1px solid #79797B;
        border-radius: 2px;
        font-size: 12px;
        color: #79797B;
        text-align: center;
        line-height: 23px;
        margin-right: 10px;
    }
    .btn-active {
        background: #ED6F64 !important;
        color: #fff !important;
        border: none !important;
    }
    .info-box {}
    .info-item {
        width: 110px;
        height: 25px;
        text-align: center;
        line-height: 25px;
        border-radius: 100px;
        background: #eee;
        color: #fff;
        font-size: 12px;
        margin-right: 30px;
        margin-top: 10px;
    }
    .info-active {
        background: #5FB870;
    }
    .remark-box {
        margin-top: 10px;
    }
    .remark-box textarea {
        font-size: 12px;
        color: #504C4D;
        width: 100%;
        border: 1px solid #EDEDED;
    }
    .problem-box {
        padding: 5px 10px;
        border: 1px solid #EDEDED;
    }
    .problem-item {
        width: 79px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        background: #fff;
        font-size: 12px;
        color: #4C90CC;
        border: 1px solid #66ADEB;
        border-radius: 100px;
        margin-right: 5px;
    }
    .problem-active {
        border: none;
        background: #7197FF;
        color: #fff;
    }
    /* right style */
    .precheck-head {
        margin-top: 10px;
        margin-bottom: 20px;
    }
    .precheck-head .pre-title {
        height: 40px;
        padding: 8px 0;
        background: #2A4A7C;
        border-radius: 2px;
        font-size: 18px;
        color: #FFFFFF;
        margin-bottom: 11px;
    }
    .precheck-head .left-icon {
        width: 50px;
        height: 24px;
        border-right: 1px solid #8D9198;
        margin-right: 10px;
    }
    .pre-btn-box .pre-btn {
        flex: 1;
        width: 170px;
        height: 30px;
        background: #71757E;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        color: #FFFFFF;
    }
    .pre-btn-box .pre-btn-red {
        flex: 1;
        width: 170px;
        height: 30px;
        background: #ED6F64;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        color: #ffffff;
    }
    .pre-btn-box .pre-btn-left {
        margin-right: 10px;
    }
    .info-list {
        margin-bottom: 40px;
    }
    .info-title {
        font-size: 18px;
        color: #333333;
        border-bottom: 1px solid #CCCCCC;
        padding-left: 20px;
        height: 41px;
    }
    .info-list-item {
        display: flex;
        align-items: center;
        padding: 0 60px 0 20px;
        border-bottom: 1px solid #CCCCCC;
        font-size: 14px;
        color: #333333;
        height: 41px;
    }
    .appointment-footer {
        border-top: 3px solid #CCCCCC;
        padding: 13px 40px;
    }
    .appointment-footer .customer {
        display: flex;
        align-items: flex-end;
        height: 73px;
        padding-left: 20px;
        margin-bottom: 23px;
    }
    .appointment-footer .customer .autograph-box {
        width: 120px;
        border-bottom: 1px solid #000;
    }
    .appointment-footer .f-btn-box .f-btn {
        width: 120px;
        height: 30px;
        border-radius: 2px;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        color: #504C4D;
        border: 1px solid #CCCCCC;
        margin-left: 30px;
    }
    .next-btn {
        background: #ED6F64;
        color: #fff !important;
        border: none !important;
    }
</style>