<template>
<div>
    <div class="his-box" v-for="(item, index) in data" :key="index">
        <div class="his-left">
            <div class="his-lefticon" :class="{ 'his-background0': item.status, 'his-background1': !item.status}">

            </div>
            <div v-if="index!==(data.length-1)" class="his-bottomwire">

            </div>
        </div>
        <div class="his-right">
            <div class="his-content">
                <p class="his-icon"></p>
                <div class="his-info">
                    <p class="his-saver">
                        <span>服务：</span>
                        <span  class="saver">{{item.saver}}</span>
                    </p>
                    <p class="his-time">
                        <span>时间：</span>
                        <span>{{item.time}}</span>
                    </p>
                    <p class="his-name">
                        <span>姓名：</span>
                        <span>{{item.name}}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
           data: [
                {
                    saver: '首次保养',
                    time: '15:10pm-2017.12.20',
                    name: 'kelvin',
                    status: true
                },
                {
                    saver: '20000km保养，更换雨刷',
                    time: '15:10pm-2017.12.20',
                    name: 'kelvin',
                    status: false,
                },
                {
                    saver: '20000km保养，更换雨刷',
                    time: '15:10pm-2017.12.20',
                    name: 'kelvin',
                    status: false,
                },
                {
                    saver: '20000km保养，更换雨刷',
                    time: '15:10pm-2017.12.20',
                    name: 'kelvin',
                    status: false,
                },
                {
                    saver: '20000km保养，更换雨刷',
                    time: '15:10pm-2017.12.20',
                    name: 'kelvin',
                    status: false,
                },
            ]
        }
    },

}
</script>
<style>
    .his-box {
        position: relative;
        height: 205px;
        font-size: 12px;
    }
    .his-box .his-right {
        position: absolute;
        left: 50px;
        top: 0;
        overflow: hidden;
    }
    .his-box .his-right .his-content {
        position: relative;
        /* border: 1px solid #ccc; */
        overflow: hidden;
        padding-left: 10px;
        padding-bottom: 100px;
        /* width: 200px;
        height: 80px;
        background: #ccc */
    }
    .his-icon {
        position: absolute;
        top: 20px;
        left: 3px;
        width: 15px;
        height: 15px;
        background-color: #f0f2f4;
        transform: rotate(45deg);
        margin: 0;
    }
    .his-info {
        background-color: #f0f2f4;
        border-radius: 3px;
        padding-top: 15px;
        padding-bottom: 5px;
        padding-left: 10px;
        padding-right: 20px;
    }
    .his-info p {
        margin-bottom: 10px;
    }
    .his-saver .saver {
        font-size: 13px;
        font-weight: 600;
        margin: 0;
    }
    .his-box .his-left {
        width: 50px;
        /* height: 500px; */
        position: absolute;
        left: 0;
        overflow: hidden;
    }
    .his-left .his-lefticon {
        width: 40px;
        height: 40px;
        border: 5px solid #f0f2f4;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: 50% 50%;  
        /* background-image: url(../../../../static/icon/copy2.png)  */
    }
    .his-background0 {
        background-color: #19B393;
    }
    .his-background1 {
        background-color: #f0f2f4;
    }
    /* .his-background-imge {

    } */
    .his-left .his-bottomwire {
        width: 0px;
        border: 4px solid #f0f2f4;
        height: 165px;
        position: relative;
        left: 16px;
    }
</style>

