<template>
<div>
    <div class="block-header clearfix">
        <div class="select pull-left">
            <b-form-select v-model="selectWork" :options="workTypeList" ref="select">
            </b-form-select>
        </div>
        <div class="pull-left textStyle">
            <img src="../img/info.png" alt="">
            <span style="marginLeft: 8px">仅显示已被派工的技师和正在施工的技师</span>
        </div>
        <div class="toggle-button-opencard" @click="toggleTypeOfPage">切换</div>
    </div>
    <div class="block-content">
        <technician-list :list="list" @itemClick="itemClick" :workTypeList="workTypeList"></technician-list>
    </div>
</div>
</template>
<script>
import TechnicianList from './technician-list'
import api from 'common/api.js'
import common from 'common/common'
export default {
    components: {
        TechnicianList
    },
    props:{
       workTypeList: {
           type: Array,
           default: function() {
               return []
           }
       }
    },
    data() {
       return {
            workType: [
                {
                    text: '机电',
                    value: '0'
                },
                {
                    text: '钣金',
                    value: '1'
                },
                {
                    text: '油漆',
                    value: '2'
                }
            ],
            selectWork: 'MechanicTechnician',
            list: [
                // {
                //     technicianName: '张晓俊',
                //     workType: '钣金维修工',
                //     img: '/livepro/static/image/userimg.jpg'
                // },
                // {
                //     technicianName: '刘涛',
                //     workType: '机电维修工',
                //     img: '/livepro/static/image/person1.png'
                // },
                // {
                //     technicianName: '李富贵',
                //     workType: '喷漆维修工',
                //     img: '/livepro/static/image/person2.png'
                // },
                // {
                //     technicianName: '张顺',
                //     workType: '钣金维修工',
                //     img: '/livepro/static/image/person3.png'
                // },
                // {
                //     technicianName: '王建国',
                //     workType: '机电维修工',
                //     img: '/livepro/static/image/person4.png'
                // },
                // {
                //     technicianName: '李子俊',
                //     workType: '钣金维修工',
                //     img: '/livepro/static/image/person5.png'
                // },
                // {
                //     technicianName: '王强',
                //     workType: '喷漆维修工',
                //     img: '/livepro/static/image/person6.png'
                // },
                // {
                //     technicianName: '李磊',
                //     workType: '钣金维修工',
                //     img: '/livepro/static/image/person1.png'
                // },
                // {
                //     technicianName: '李涛',
                //     workType: '机电维修工',
                //     img: '/livepro/static/image/person2.png'
                // },
            ]
       }
    },
    computed: {
        //  storeInfoVo() {
        //     let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        //     return userInfo.hasOwnProperty('userAvailableInfo') 
        //             ? userInfo.userAvailableInfo.storeInfoVo
        //             : null
        // }
    },
    created() {
        this._initData();
    },
    methods: {
        // 打卡切换(工位打卡与技师打卡切换)
        toggleTypeOfPage() {
            this.$emit('togglepage', 'station')
        },
        // 初始化数据
        _initData() {
            this.storeInfoVo = JSON.parse(common.getSession('userInfo')).userAvailableInfo.storeInfoVo
            let option = {
                    empWorkTypeCodes: [this.selectWork],
                    // storeCode: this.storeInfoVo ? this.storeInfoVo.storeCode : ''
                    storeCode: this.storeInfoVo ? this.storeInfoVo.storeCode : '',
                    isFilter: 1 
				}
				api.clock.getTechnicianList(option, (res) => {
					if(res.data.code === 'success') {
                        this.list = res.data.obj;
					};
				})
        },
        // 选中某一个技师  切换页面
        itemClick(item) {
            this.$router.push({
                path: `/clock/technician-tdetail/${item.empCode}`
            })
        }
    },
    watch: {
        selectWork(val) {
             this._initData();
        }
    }
}
</script>
<style scoped>
.block-header {
    padding-bottom: 10px;
    border-bottom: 3px solid #F2F2F2;
    position: relative;
}
.toggle-button-opencard {
    position: absolute;
    right: 0px;
    top: 0px;
    height: 30px;
    width: 60px;
    border-radius: 5px;
    font-size: 15px;
    line-height: 30px;
    text-align: center;
    background-color: rgb(189, 56, 56);
    color: #fff;
    cursor: pointer;
}
.select {
    width: 270px;
    height: 38px;
}
.select select {
    border-radius: 2px;
    border: 1px solid #E9EFF3;
}
.textStyle {
    margin-left: 40px;
    margin-top: 6px;
}
.textStyle::before {
    content: "";
    width: 20px;
    height: 20px;
    background-image: url('../img/info.png');
    background-size: 100%;
}

.block-content {
    /* padding-top: 50px;
    padding-left: 50px; */
}
</style>
