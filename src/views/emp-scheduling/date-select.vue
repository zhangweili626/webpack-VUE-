<template>
    <div>
        <div class="row">
            <div class="col-md-12 ds" :class="{'clear_today' : clearTodayStyle}">
                <calendar @choseDay="clickDay" ref="calender"></calendar>
            </div>
        </div>

        <div class="row" style="marginTop: 20px">
            <div class="col-md-12">
                <p class="store-time">{{storeWorkTime}}</p>
            </div>
        </div>
        
        <div class="row" style="marginTop: 20px">
            <div class="col-md-9">
                <b-form-fieldset horizontal label="复制此日期排班到" :label-cols="6" class="text-left">
                    <el-date-picker v-model="time" type="date" placeholder="选择日期" >
                    </el-date-picker>
                </b-form-fieldset> 
            </div>
            <div class="col-md-3">
                <query-btn-group @query="copyInsert" :showReset="false" queryText="保存" queryBtnVar="success"></query-btn-group>
            </div>
        </div>
    </div>
</template>
<script>

import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import Vue from 'vue'
import { DatePicker, Message, MessageBox } from 'element-ui'
Vue.use(DatePicker)

import Calendar from 'vue-calendar-component';
Vue.use(Calendar);

import config from 'common/config'
import api from 'common/api'
import { formatDate } from 'common/api-common'

import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
    components: {
        QueryBtnGroup,
        Calendar
    },
    props: {
        storeCode: [String]
    },
    data() {
        return {
           time: new Date(),
           clearTodayStyle: false
        }
    }, 
    computed: {
        storeWorkTime() { 
            return `门店运营时间:  ${this.startTime} - ${this.endTime}`
        },
        startTime() {
            return this.storeInfo.businessStartTime ? this.storeInfo.businessStartTime.substring(0, 5) : ''
        },
        endTime() {
            return this.storeInfo.businessEndTime ? this.storeInfo.businessEndTime.substring(0, 5) : ''
        },
        ...mapGetters('storeStation', [
            'storeInfo',
            'empParams'
        ])
    },
    methods: {
        copyInsert() {
            const createElement = this.$createElement;
            MessageBox({
                title: '提示',
                message: createElement('p', null, [
                        createElement('span', null, '此操作将覆盖(删除)目标日期的排班'),
                    ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        this.confirmCopyInsert()
                        done()
                    } else {
                        done();
                        return
                    }
                }
            }).then( action => {}).catch(() => {}) 
        },
        confirmCopyInsert() {
            let params = {
                schedulingDate: this.empParams.schedulingDate,
                pasteDate: formatDate(this.time),
                storeCode: this.storeInfo.storeCode
            }
            api.empScheduling.copyInsert(params).then(res => {
                if(res.data.code === 'success') {
                    Message({
                        type: 'success',
                        message: config.messInfo.success
                    })
                    this.$nextTick(() => {
                        this.$refs.calender.ChoseMonth(params.pasteDate, true)
                    })
                }
            })
        },
        clickDay(_date) {
            // console.log(this.$refs.calender.$el.children[0].children[2].children)
            // this.$nextTick(() => {
            //     let list = this.$refs.calender.$el.children[0].children[2].children
            //     list.forEach(item => {
            //         if(item.children[0].)
            //     })
            // })
            let date = _date.split('/'),
                y = date[0],
                m = date[1] < 10 ? `0${date[1]}` : date[1],
                d = date[2] < 10 ? `0${date[2]}` : date[2]
        
            let params = {
                storeCode: this.storeCode,
                schedulingDate: `${y}-${m}-${d}`
            }
            if(params.schedulingDate == formatDate(new Date())) {
                this.clearTodayStyle = false
            }else {
                this.clearTodayStyle = true
            }
            if(!this.storeCode) {
                return
            }

            this.setEmpParams(params)
            this.getEmpSchedulingObj(params)
        },
        ...mapActions({
            getEmpSchedulingObj: 'storeStation/getEmpSchedulingObj'
        }),
        ...mapMutations({
            setEmpParams: 'storeStation/SET_EMP_PARAMS'
        })
    }
}
</script>
<style>
.store-time {
    padding-bottom: 20px;
    border-bottom: 2px solid #f5f5f5;
}
.ds .wh_container {
    border-bottom: 2px solid #f5f5f5;
}
.ds .wh_top_changge {
    border-bottom: 2px solid #f5f5f5;
    margin-bottom: 20px;
}
.ds .wh_content {
    margin-bottom: 10px;
}
.ds .wh_content_all {
    background-color: #fff;
    color: #333;
}
.ds .wh_top_changge li {
    color: #333;
    font-size: 20px;
}
.ds .wh_jiantou1 {
    border-color: #8392a6;
}
.ds .wh_jiantou2 {
    border-color: #8392a6;
}
.ds .wh_content_item {
    color: #7d7d7d;
    margin-bottom: 14px;
}
.ds .wh_content_item li:not(.wh_isToday):hover {
    background-color: #f7f7f7 !important;
}
.ds .wh_isToday {
    color: #fff !important;
    background-color: #587eb9 !important;
}
.ds .wh_chose_day {
    color: #fff !important;
    background-color: #587eb9 !important;
}
.clear_today .wh_isToday {
    color: #7d7d7d !important;
    background-color: #fff !important;
}
</style>

