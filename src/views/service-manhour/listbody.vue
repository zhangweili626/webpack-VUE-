<template>
    <div>
        <b-card>
            <list-btn-group @insert="insert" 
                @update="odelete" 
                :disabledInsert="!canInsert"
                :disabledUpdate="!canDelete"
                :updateOptions="{
                    size: 'sm',
                    variant: 'danger', 
                    name: '删除',
                }"
                :showInit="false" class="mb-2">
            </list-btn-group>

            <div class="mb-2 service-manhour">
                <el-table
                    :data="serviceHoursObj.list"
                    tooltip-effect="dark"
                    @selection-change="selectChange"
                    border>
                        <el-table-column
                            label="选择"
                            type="selection"
                            fixed>
                        </el-table-column>
                        <el-table-column
                            prop="serviceCode"
                            label="服务编码"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="serviceName"
                            label="服务名称"
                            width="100"
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
                            prop="channelTypeName"
                            label="渠道"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="workHours"
                            label="服务工时"
                            width="100"
                            show-overflow-tooltip>
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
                            prop="addNum"
                            label="车型扩展属性个数"
                            width="160">
                        </el-table-column>
                </el-table>
            </div>	

            <div class="row"> 
                <div class="col-md-12">
                    <pagination class="pull-right" 
                        @page-change="pageChange" 
                        :page-no="serviceHoursObj.pageNum" 
                        :page-size="serviceHoursObj.pageSize" 
                        :total-pages="serviceHoursObj.pages" 
                        :total-result="serviceHoursObj.total">
                    </pagination>
                </div>
            </div>
		</b-card>
    </div>
</template>
<script>
    import ListBtnGroup from 'components/list-btn-group/list-btn-group'
    import Pagination from 'components/pagination/pagination'
    import Vue from 'vue'
    import { Table, TableColumn, MessageBox, Message } from 'element-ui'
    Vue.use(Table)
    Vue.use(TableColumn)

    import config from 'common/config'
    import api from 'common/api'
    import url from 'common/api-collection'
    import { getSequence, alertSuccess, hasBtn } from 'common/api-common'

    import { mapActions, mapGetters, mapMutations } from 'vuex'

    export default {
        components: {
            ListBtnGroup,
			Pagination
        },
        computed: {
            canInsert() {
                return true    // 按钮权限占时不加, 不然没办法测试
                const insertUrl = url.serviceHours.insert 
                return hasBtn(insertUrl)
            },
            canDelete() {
                return true    // 按钮权限占时不加, 不然没办法测试
                const editUrl = url.serviceHours.edit
                return hasBtn(editUrl)
            },
            ...mapGetters('serviceManhour', [
                'serviceHoursObj'
            ])
        },
        props: {
            queryParams: Object
        },
        data() {
            return {
                selectOptions: []
            }
        },
        methods: {
            selectChange(list) {
                this.selectOptions = list
            },
            insert() {
                this.setQueryParams(this.queryParams)
                this.$router.push({
                    path: '/service-manhour/insert'
                })
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
                            done()
                            return
                        }
                    }
                }).then( action => {}).catch(() => {})
            },
            confirmDelete() {
                this.selectOptions.forEach(item => {
                    item.isDeleted = '1'
                })
                api.serviceHours.edit(this.selectOptions).then(res => {
                    if(res.data.code === 'success') {
                        this.getServiceHoursObj(this.queryParams)
                    }
                })
            },
            pageChange(num) {
                this.queryParams.pageStart = num
				this.getServiceHoursObj(this.queryParams)
            },
            ...mapActions('serviceManhour', [
				'getServiceHoursObj'
            ]),
            ...mapMutations({
                setQueryParams: 'serviceManhour/SET_QUERY_PARAMS'
            })
        }
    }
</script>
<style >
.service-manhour .el-table__fixed {
    min-height: 1000px !important;
}
</style>
