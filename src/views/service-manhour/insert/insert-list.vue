<template>
<div>
    <b-card>
        <list-btn-group 
            @insert="insert" 
            @update="odelete" 
            :insertOptions="{
                size: 'sm',
                variant: 'success', 
                name: '添加',
            }"
            :updateOptions="{
                size: 'sm',
                variant: 'danger', 
                name: '删除',
            }"
            :showInit="false">
        </list-btn-group>
        <div class="table-scrollable mb-2 insert-service-manhour">
            <el-table
                :data="subServiceHoursList"
                tooltip-effect="dark"
                @selection-change="selectChange"
                height="470"
                border>
                    <el-table-column
                        label="选择"
                        type="selection"
                        fixed>
                    </el-table-column>
                    <!-- <el-table-column
                        prop="serviceCode"
                        label="服务编码"
                        width="100"
                        show-overflow-tooltip>
                    </el-table-column> -->
                    <!-- <el-table-column
                        prop="serviceName"
                        label="服务名称"
                        width="100"
                        show-overflow-tooltip>
                    </el-table-column> -->
                    <el-table-column
                        prop="channelTypeName"
                        label="渠道"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="chinaAreaName"
                        label="行政区域"
                        width="100"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="salesAreaName"
                        label="销售区域"
                        width="100"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{ scope.row.storeName ? '' : scope.row.salesAreaName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="storeName"
                        label="适用门店"
                        width="100"
                        show-overflow-tooltip>
                    </el-table-column>
                    
                    <el-table-column
                        prop="workHours"
                        label="服务工时"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="factoryName"
                        label="厂家"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="brandName"
                        label="品牌"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="seriesName"
                        label="车系"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="modelName"
                        label="车型"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="opvName"
                        label="排量"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="iotypeName"
                        label="进气方式"
                        width="100"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        v-for="(item, i) in addlist"
                        :key="i"
                        :label="item.addName"
                        :width="setWidth(item)"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{getAddValue(scope, item.addCode)}}
                        </template>
                    </el-table-column>
            </el-table>
        </div>	
    </b-card>        
</div>
</template>
<script>

    import ListBtnGroup from 'components/list-btn-group/list-btn-group'
    
    import Vue from 'vue'
    import { Table, TableColumn, MessageBox, Message } from 'element-ui'
    Vue.use(Table)
    Vue.use(TableColumn)

    import config from 'common/config'
    import api from 'common/api'
    import { alertSuccess, filter } from 'common/api-common'

    import { mapActions, mapGetters } from 'vuex'

    export default {
        components: {
            ListBtnGroup
        },
        props: {
            mainInfo: Object,
            carInfo: Object
        },
        data() {
            return {
                selectOptions: []
            }
        },
        computed: {
            ...mapGetters('serviceManhour', [
                'subServiceHoursList'
            ]),
            addlist() {
                let list = []
                this.subServiceHoursList.forEach(item => {
                    list = list.concat(item.serviceCarAddWorkhourInfoVoList || [])
                })
                return filter(list, 'addCode')
            },
        },
        methods: {
            getAddValue(scope, addCode) {
                let sublist = scope.row.serviceCarAddWorkhourInfoVoList
                if(sublist) {
                    for(let i = 0; i < sublist.length; i ++) {
                        if(addCode === sublist[i].addCode) {
                            return sublist[i].addValue
                        }
                    }
                }
            },
            setWidth(item) {
                if(item.addName.length === 2) {
                    return 70
                }
                return item.addName.length * 26
            },

            insert() {
                if(this.mainInfo.serviceCode && this.carInfo.hasOwnProperty('brandName')) {
                    let params = {
                        mainInfo: this.mainInfo,
                        carInfo: this.carInfo
                    }
                    this.setInsertParams(params)   
                    params.carInfo.serviceCode = params.mainInfo.serviceCode                 
                    this.$router.push({
                        name: 'service-manhour-insert-add',
                        query: params.carInfo
                    })
                }else {
                    Message({
                        type: 'warning',
                        message: '服务名称, 车型信息必填'
                    })
                }
            },
            odelete() {
                if(!this.selectOptions.length) {
                    Message({
                        type: 'warning',
                        message: config.messInfo.select
                    })
                    return
                }
                const createElement = this.$createElement;
                MessageBox({
                    title: '提示',
                    message: createElement('p', null, [
                            createElement('span', null, '是否确定删除'),
                        ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            this.confirmDelete()
                            done()
                        } else {
                            done();
                            return
                        }
                    }
                }).then( action => {
                    Message({
                        type: 'success',
                        message: config.messInfo.success
                    });
                }).catch(() => {})
            },
            confirmDelete() {
                this.selectOptions.forEach(item => {
                    item.isDeleted = '1'
                })
                api.serviceHours.edit(this.selectOptions).then(res => {
                    if(res.data.code === 'success') {
                        this.getSubServiceHoursList(this.carInfo)
                    }
                })
            },
            selectChange(list) {
                this.selectOptions = list
            },
            ...mapActions('serviceManhour', [
                'getSubServiceHoursList',
                'setInsertParams'
            ]),
        }
    }
</script>
<style>
.insert-service-manhour .el-table__fixed {
    min-height: 1000px !important;
}
</style>

