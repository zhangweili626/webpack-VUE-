<template>
<div class="box clearfix">
    <section v-show="clockType == 'home'">
        <header>
            <p class="hd-1">技术/ 工位打卡页面</p>
            <p class="hd-2"></p>
            <p class="hd-3">请按照情况选择下方按钮就行打卡</p>
        </header>
        <section class="box-sec">
            <div class="box-type">            
                <p><img src="./img/station.jpg" alt=""></p>
                <button class="clock-btn" @click="selectClock('station')">按工位打卡</button>
            </div>
            <div class="box-type">
                <p><img src="./img/technician.jpg" alt=""></p>            
                <button class="clock-btn" @click="selectClock('technician')">按技师打卡</button>
            </div>
        </section>
    </section>
    <section v-show="clockType == 'technician'" class="box-content">
        <technician :workTypeList='workTypeList' @togglepage="toggleInCurrent"></technician>  
    </section>
    <section v-show="clockType == 'station'" class="box-content">
         <station :workTypeList='stationTypeList' @togglepage="toggleInCurrent"></station>
    </section>
</div>
</template>
<script>
import Technician from './technician/technician'
import Station from './station/station'
import common from 'common/common.js'
import config from 'common/config.js'
import api from 'common/api.js'
export default {
    components: {
        Technician,
        Station
    },
    data() {
        return {
            clockType: 'home',
            workTypeList: [],
            stationTypeList: []
        }
    },
    created() {
        this._initStype();
        this.getEmpWorkTypelist();
        this.getstationTypelist()
    },
    methods:{
            // 获取切换页面事件
            toggleInCurrent(arg) {
                this.selectClock(arg)
            },
        // 获取工种
			getEmpWorkTypelist() {
				let _this = this;
				const option = {
					'refCode': config.clock.workTypeCode
				}
				api.ref.getDataDictionarys(option, (res) => {
					if (res.data.code === 'success') {
						let data = res.data.obj.referenceDetailInfos;
						let arr = []
						data.forEach((item, index) => {
							let obj = {
								value: item.refDetailCode,
								text: item.refDetailName
							}
							arr.push(obj);
						})
                        _this.workTypeList = arr;
					}
				})
            },
        // 获取工位
        getstationTypelist() {
                let _this = this;
                let storeInfoVo = JSON.parse(common.getSession('userInfo')).userAvailableInfo.storeInfoVo
				const option = {
                    pageNums: 999,
					storeCode: storeInfoVo ? storeInfoVo.storeCode : ''
				}
				api.storeStation.pagingQuery(option).then(res => {
                    if(res.data.code === 'success') {
                        if(res.data.obj.list) {
                            res.data.obj.list.forEach(element => {
                                let obj = {}
                                obj.text = element.stationName
                                obj.value = element.stationCode
                                _this.stationTypeList.push(obj)
                            })
                        }
                    }
                })
                //, (res) => {
					// if (res.data.code === 'success') {
					// 	let data = res.data.obj.referenceDetailInfos;
					// 	let arr = []
					// 	data.forEach((item, index) => {
					// 		let obj = {
					// 			value: item.refDetailCode,
					// 			text: item.refDetailName
					// 		}
					// 		arr.push(obj);
					// 	})
                    //     _this.workTypeList = arr;
					// }
				//})
            },
        _initStype() {
            let token = common.getCookie('e_token');
            let locToken = localStorage.getItem('locToken');
            let locColckType = localStorage.getItem('clockType');
            if((token === locToken) && locColckType) {
                this.clockType = locColckType;
            }else {
                this.clockType = 'home';
            }
        },
        selectClock(type) {
            let token = common.getCookie('e_token');
            this.clockType = type;
            localStorage.setItem('locToken',token);
            localStorage.setItem('clockType', this.clockType);
        }
    }
}
</script>
<style scoped>
    .box{
        width:100%;
        height: 100%;
        padding: 0;
        background: #fff;
    }
    header{
        width: 100%;
        height: 200px;
        padding: 30px 0px;
        background: url('./img/banner@2x.png');
        background-size: 100% 100%;
        text-align: center;
        line-height: 1.5;
        color: #fff;
    }
    .hd-1{
        font-size: 40px;
    }
    .hd-2{
       display: inline-block;
       width: 340px;
       height: 10px;
       background: #F2E151;
    }
    .hd-3{
        font-size: 16px;
    }
    @media screen and (max-height: 800px){
        .box-sec{
             padding: 50px 150px 10px 150px;
        }
    }
    @media screen and (min-height: 800px){
        .box-sec{
            padding: 180px 150px 10px 150px;
        }
    }
    .box-type{
        width:50%;
        height: 250px;
        text-align: center;
        float: left;
    }
    .box-type img{
        width: 140px;
        height: 120px;
    }
    .box-type img:nth-child(1){
        width: 140px;
        height: 100px;
    }
    .clock-btn{
        width: 140px;
        height: 36px;
        line-height: 30px;
        outline: none;
        background: #fff;
        border: 2px solid #3D69A5;
        border-radius: 75px;
        font-size: 12px;
        color:  #3D69A5;
    }
    .box-content{
        padding: 20px; 
    }
</style>
