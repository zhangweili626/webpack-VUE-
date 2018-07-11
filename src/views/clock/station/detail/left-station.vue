<template>
<div class="ls-box">
    <p class="title">MO1</p>
    <div class="station-name-box">
        <div class="clearfix" style="padding: 30px 30px 19px 30px;">
            <div class="icon-box pull-left">
                <img class="icon-box" src="../../img/station.png" alt="" >
            </div>
            <span class="pull-left">{{ stationInfo.stationName }}</span>
        </div>
    </div>

    <div class="thead">
        <div class="head-portrait">
            <!-- <div class="icon-head icon"></div> -->
            <img class="icon-head icon" src="../../img/head-pro.png" alt="">
            <div>员工头像</div>
        </div>
        <div class="name">
            <!-- <div class="icon-name icon"></div> -->
            <img class="icon-name icon" src="../../img/name.png" alt="">            
            <div>员工姓名</div>
        </div>
    </div>

    <div class="station-item" v-for="(item, i) in userList" :key="i" :class="{ 'active' : activeList[i].active }" @click="selUser(item, i)">
        <div class="station-item-img">
            <!-- <div class="img"></div> -->
            <img class="img" :src="item.empBigPic?item.empBigPic:'/static/image/userimg.jpg'" alt="">
        </div>
        <div class="station-item-name">{{ item.empName }}</div>        
        <!-- <div class="station-item-name">{{ '1' }}</div>         -->
    </div>
</div>
</template>
<script>
export default {
    props:{
        userList: [Array],
        stationInfo: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            activeList:[],
            list: [
                {name: '张晓雄', active: true},
                {name: '李小龙'},
                {name: '张晓雄'},
                {name: '李富贵'},
                {name: '张晓雄'},
                {name: '李涛'},                
            ]
        }
    },
    methods:{
        selUser(val, index) {
            for(let i = 0; i < this.userList.length; i++) {
                this.activeList[i].active = false;
            }
            this.activeList[index].active = true;
            //this.activeList = JSON.parse(JSON.stringify(this.activeList));
            this.$emit('selUser', val);
        }
    },
    watch:{
       userList(val) {
           for(let i = 0; i < this.userList.length; i++) {
               let obj = {};
                obj.active = false;
                this.activeList.push(obj);
            }
            this.activeList[0].active = true
       } 
    }
}
</script>
<style scoped>
.ls-box {
    border-radius: 3px;
    padding: 23px 8px;
}

/* title style */
.ls-box .title {
    text-align: center;
    font-size: 18px;
    color: #333333;
    margin-bottom: -18px;
}

.station-name-box {
    margin: 0 auto;
}
.active {
    background: #627A9F;
    color: #fff;
}
.station-name-box .icon-box {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    /* background: #2A4A7C; */
}
.station-name-box span {
    margin-left: 15px;
    line-height: 50px;
}

/* thead style */
.thead {
    display: flex;
    font-size: 12px;
    color: #999999;
    margin-bottom: 5px;
}
.thead > div{
    flex: 1;
    text-align: center;
}
.thead .icon {
    margin: 0 auto;
    width: 20px;
    height: 20px;
    /* background: #999; */
}
.thead .name {
    border-left: 1px solid #999999;
}

/* station style */
.station-item {
    border-top: 1px solid #ddd;
    display: flex;
    height: 50px;
    cursor: pointer;
}
.station-item > div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
.station-item .station-item-img .img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    /* background: #999; */
}
</style>
