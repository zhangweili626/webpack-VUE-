<template>
    <div class="animated fadeIn" style="marginBottom: 20px;position: relative;">
        <div class="back-btn" @click="backClick">返回</div>
        <div class="row">
            <div class="col-md-12">
                <div class="detail-box" ref="detailChart">
                    <detail-chart :detail="detailInfo" @modelClick="modelClick"></detail-chart>
                </div>  
                <div class="right-model" v-show="showModel" ref="detailInfo">
                   <detail-info ref="detailInfo1" :dispatchNo="dispatchNo"></detail-info>
                </div>                       
            </div>
        </div>
    </div>
</template>
<script>

import DetailInfo from './detail-info'
import DetailChart from './detail-chart'
import api from 'common/api'
import common from 'common/common'
export default {
    components: { 
        DetailInfo,
        DetailChart,
    },
    data() {
        return {
            date: new Date(),
            showModel: false,
            dispatchNo:{},
            detailInfo:{
                name:"",
                list:[],
            },
            // detailInfo: {
            //     name: '技师01',
            //     list: [
            //         {
            //             estimateStartTime: '11:10',
            //             estimateEndTime: '11:30',
            //             actualStartTime: '11:11',
            //             actualEndTime: '11:40',  
            //             station: '工位01',
            //             remark: '喷漆'  
            //         },
            //         {
            //             estimateStartTime: '14:00',
            //             estimateEndTime: '14:20',
            //             actualStartTime: '14:02',
            //             actualEndTime: '',  
            //             station: '工位01',
            //             remark: '喷漆'  
            //         },
            //         {
            //             estimateStartTime: '',
            //             estimateEndTime: '',
            //             actualStartTime: '',
            //             actualEndTime: '',  
            //             station: '',
            //             remark: ''
            //         },
            //         {
            //             estimateStartTime: '',
            //             estimateEndTime: '',
            //             actualStartTime: '',
            //             actualEndTime: '',  
            //             station: '',
            //             remark: ''
            //         },
            //     ]
            // },
        }
    },
    mounted() {
        this.getDetailInfo(this.$route.params.id,this.$route.query.queryDate)
        document.addEventListener('click', (e) => {
        let _select = this.$refs.detailInfo;
        let _select1 = document.querySelectorAll('.detail-box .model-containent')[0];
        if(_select && !_select.contains(e.target) && _select1 && !(_select1.contains(e.target))){
            clearInterval(this.$refs.detailInfo1.Timer)
            this.showModel = false
        }             
      })
    },
    methods: {
        backClick() {
            this.$router.push({
                path: '/resource-utilization'
            })
        },
        modelClick(item) {
            if(item.dispatchDetailCode){
                console.log(item)
                api.mainBusiness.getStationDetailByDate({
                    dispatchDetailCode:item.dispatchDetailCode
                },(res)=>{
                    if(res.data.message === 'success') {
                        this.showModel = !this.showModel
                        this.dispatchNo = res.data.obj
	                    clearInterval(this.$refs.detailInfo1.Timer)
                        this.$refs.detailInfo1.setinFactoryTime()
                    }
                })
            }
        },
        getDetailInfo(code,sechData) {
            const _this = this;
            let params = {
                empCode: code,
                sechData:sechData,
            }
            api.mainBusiness.queryDispatchEmpDetailInfoNoPage(params,(res => {
                if(res.data.code === 'success') {
                    let obj = res.data.obj
                    let list = []
                    // let dispatchDetailHistoryInfoList = obj.dispatchDetailHistoryInfoList
                    this.detailInfo.name = obj[0].empName
                    for (let index = 0; index < obj.length; index++) {
                        const element = obj[index];
                        if(element.dispatchEmpDetailInfos){
                            element.dispatchEmpDetailInfos.forEach((item,index) => {
                            let data = {
                                estimateStartTime: item.dispatchStartTime&&item.dispatchStartTime.split(' ')[1],
                                estimateEndTime: item.dispatchEndTime&&item.dispatchEndTime.split(' ')[1],
                                actualStartTime: item.workStartTime&&item.workStartTime.split(' ')[1].substring(0,5),
                                actualEndTime: item.workEndTime&&item.workEndTime.split(' ')[1].substring(0,5),
                                station: item.stationName,
                                remark: item.serviceName,
                                dispatchNo:item.dispatchNo,
                                dispatchDetailCode:item.dispatchDetailCode,
                            }
                            list.push(data)
                        })
                    }
                    if(index ==  obj.length-1){
                        this.detailInfo.list = list
                    }
                    }
                    
                }
            })) 
        }
    },
    watch: {
        showModel() {
            document.addEventListener('click', (e) => {
                let _model = this.$refs.model;   //  数组
                // if(_model && !_model.contains(e.target))  this.showModel = false
            })
        }
    }
}
</script>
<style>
.el-input__inner {
    height: 30px;
}
.back-btn {
    width: 120px;
    height: 38px;
    background-color:#5EB870;
    border-radius: 2px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 38px;
    margin-bottom: 10px;
    cursor: pointer;
}

.detail-box {
    border: 1px solid #ccc;
    border-bottom: none;
    background-color: #fff;
    /* overflow-x: scroll; */
}
.header-time {
    /* width: 1900px; */
    height: 48px;
    border-bottom: 1px solid #ccc;
    padding: 10px 23px;
}
.icon-btn {
    width: 20px;
    height: 20px;
    background-color: #fff;
    border: 1px solid #E4E6EF;
    border-radius: 50%;
    text-align: center;
    line-height: 17px;
    color: #4C6681;
    margin-top: 5px;
}

.right-model {
    position: absolute;
    top: 0;
    right: -15px;
    width: 560px;
}
</style>
