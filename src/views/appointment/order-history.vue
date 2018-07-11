<template>
    <div class="container-fluid bg-box">
        <b-row>
            <span class="title-large">进场历史记录</span>
        </b-row>
        <b-row>
            <span class="title-small">服务记录</span>
        </b-row>
        <b-row class="title-line"></b-row>
        <b-row class="mt-3" v-for="(item, index) in listData" :key="index">
            <b-col md="1">
                <div class="appot-img"  v-if="item.isBookOrder === 0"></div>
                <div class="appot-img2" v-else></div>
            </b-col>  
            <b-col md="10">
                <div>
                    <span class="list-title">{{item.businessTypeName}}</span>
                    <span class="list-title-second ml-3">里程数：{{item.currentMileage}}km</span>
                </div>
                <div class="clearfix">
                    <span class="list-title-second pull-left">{{item.confirmTime}}</span>
                    <span class="list-title pull-right" @click="previewOrder(item)">更多>></span>
                </div>
                <div class="content-box">
                    <div class="clearfix">
                        <span class="pull-left">NO: {{item.historyOrderNo}}</span>
                        <span class="pull-right">{{item.storeName}}</span>
                    </div>
                    <div class="clearfix">
                        <span>{{item.custPlates}}</span>
                        <span class="ml-3">{{item.carDisplayName}}</span>
                    </div>
                    <div class="title-line"></div>
                    <div class="clearfix">
                        <span class="mult_line_ellipsis">{{item.serviceName}}</span>
                    </div>
                    <div class="title-line"></div>
                    <div class="clearfix">
                        <span v-show="item.isBookOrder === 0">￥{{parseFloat(item.bookOrderPrice)? parseFloat(item.bookOrderPrice).toFixed(2) : ''}}</span>
                        <span v-show="item.isBookOrder === 1">{{item.bookOrderPrice}}</span>
                        <span class="ml-3 text-danger" v-show="item.isBookOrder === 0">{{item.orderStatus | orderStatusFliter}}</span>
                        <span class="ml-3 text-danger" v-show="item.isBookOrder === 1">{{item.bookOrderStatus | bookOrderStatusFliter}}</span>
                    </div>
                </div>
            </b-col>  
        </b-row>
    </div>
</template>
<script>
import api from 'common/api'
import common from 'common/common'
import collectionApi from 'common/api-collection.js'

export default {
    props: {
        // 正式车牌
        custPlates: {
            type: String,
            default:''
        },
        // 临时车牌
        plateNumberTmp: {
            type: String,
            default:''
        },
        // 加载历史记录条数
        listNumes: {
            type: Number,
            default: 15
        },
    },
    data() {
        return {
            listData: [],
            serviceList: [],
        }
    },
    mounted() {
        this.getData();
    },
    methods:{
        // 获取历史记录列表
        getDataList() {
            if((!this.custPlates) && !this.plateNumberTmp) {       
                return new Promise((reslove, reject) => {
                    reslove(this.listData);
                })
            }
            let param = {
                custPlates: this.custPlates,
                pageStart: 1,
                pageNums: this.listNumes
            }
            if(this.custPlates) {
                param.custPlates = this.custPlates;
            }else if(this.plateNumberTmp){
                param.plateNumberTmp = this.plateNumberTmp;
            }
            return new Promise((reslove, reject) => {
                api.appointment.queryBookOrderHistoryList(param,res => {
                    if(res.data.code === 'success') {	                      			
                        this.listData = res.data.obj.list;
                        reslove(this.listData)
                    };
                })
            })	
            
        },
        getData() {
            this.getDataList().then(res => {
                if(this.listData.length == 0) return;
                let param =[];
                for(let [i, item] of this.listData.entries()) {
                    param.push({
                        historyOrderNo: item.historyOrderNo,
                        isBookOrder: item.isBookOrder,
                    });
                }
                // 获取历史记录列表中的服务信息
                api.appointment.queryBookOrderDetailListNoPage(param, result => {
                    if(result.data.code === 'success') {	                      			
                        for(let [key, val] of Object.entries(result.data.obj)) {
                            let str = '';
                            for(let [i, item] of val.entries()) {
                                str += item.serviceName + ','
                            }
                            for(let [i, item] of this.listData.entries()) {
                               if(item.historyOrderNo == key) {
                                   this.listData[i].serviceName = str.substr(0, str.length-1);
                                   break;
                               }
                            }
                        };
                        this.listData = JSON.parse(JSON.stringify(this.listData));
                        this.$emit('lengthChange', this.listData.length);
                    };
                })
            })
        },
        previewOrder(val) {
            this.getData();
            if(val.isBookOrder === 0) {
                common.printPreview(common.isdev() + collectionApi.repairOrder.print, {
                    name: 'orderNo',
                    value: val.historyOrderNo
                })
            }else {
                common.printPreview(common.isdev() + collectionApi.appointment.generatePdfReportBookOrderInfo, {
                    name: 'bookOrderNo',
                    value: val.historyOrderNo
                })
            }
        },
        getDataLength() {
            return this.listData.length;
        },
    },
    watch: {
        custPlates(val) {
            this.getData();
        },
        plateNumberTmp(val) {
            this.getData();
        }
    },
    filters:{
        orderStatusFliter(val) {    
            if(val === 0){
                return '【待处理】';
            }else if(val === 1){
                return '【处理中】';
            }else if(val === 9){
                return '【待结算】';
            }else if(val === 10){
                return '【已结算】';
            }
        },
        bookOrderStatusFliter(val) {    
          if(val === 0){
              return '【待确认】';
          }else if(val === 1){
              return '【已确认】';
          }
       },
    }
}
</script>
<style scoped>
.bg-box{
    background: #fff;
}
.title-large{
    font-size: 14px;
    color: #48576A;
    font-weight: 700;
}
.title-small{
    font-size: 12px;
    color: #48576A;
}
.title-line{
    width: 100%;
    border: 1px solid rgb(194, 207, 214);
    margin-top: 6px;
    margin-bottom: 6px;
}
.appot-img{
    width: 18px;
    height: 24px;
    background-image: url(../../../static/image/appoitment1.png)
}
.appot-img2{
    width: 18px;
    height: 24px;
    background-image: url(../../../static/image/appoitment2.png)
}
.list-title{
    font-size: 14px;
    color: #587EB9;
}
.list-title-second{
    font-size: 14px;
    color: #8897A2;
}
.content-box{
    width: 100%;
    background: #F5F8FC;
    border-radius: 3px;
    padding: 8px;
}
.mult_line_ellipsis{
    width:100%;
    overflow: hidden;
    text-overflow:ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    color: #48576A;
}
</style>


