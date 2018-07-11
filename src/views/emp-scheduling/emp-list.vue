<template>
  <div>
    <div class="row">
        <div class="col-md-12">
            <div class="pull-right">
                <b-button size="sm" variant="danger" @click="deleteEmp">删除员工</b-button>
                <b-button size="sm" variant="primary" @click="insert">添加员工</b-button>  
            </div>    
        </div>
    </div>
    <div class="table-scrollable mb-2">
        <el-table
            :data="empSchedulingObj"
            tooltip-effect="dark"
            @selection-change="selectChange"
            height="470"
            border>
                <el-table-column
                    label="选择"
                    type="selection">
                </el-table-column>
                <el-table-column
                    prop="empCode"
                    label="员工编码">
                    <template slot-scope="data">
                        <a href="javascript:;" @click="getDetail(data)" v-b-modal.detail>{{data.row.empCode}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="empName"
                    label="员工姓名">
                    <template slot-scope="data">
                        <a href="javascript:;" @click="getDetail(data)" v-b-modal.detail>{{data.row.empName}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="schedulingStartTime"
                    label="上班时间">
                </el-table-column>
                <el-table-column
                    prop="schedulingEndTime"
                    label="下班时间"
                    show-overflow-tooltip>
                </el-table-column>
        </el-table>
    </div>
    <modal ref="modal"></modal>

    <b-modal id="detail" no-close-on-backdrop size="lg" hide-footer title="员工详细信息">
        <div class="row">
            <div class="col-md-6">
                <b-form-fieldset horizontal label="编号" :label-cols="4" class="text-right">
                    <b-form-input v-model="model.empCode" disabled/>
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="姓名" :label-cols="4" class="text-right">
                    <b-form-input v-model="model.empCnName" disabled/>
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="性别" :label-cols="4" class="text-right">
                    <b-form-select :options="sexList" v-model="model.empSex"  disabled/>
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="手机号码" :label-cols="4" class="text-right">
                    <b-form-input v-model="model.empMobile" disabled/>
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="所属组织" :label-cols="4" class="text-right">
                    <b-form-input v-model="model.orgName" disabled/>
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="类型" :label-cols="4" class="text-right">
                    <b-form-select :options="empType" v-model="model.empType" disabled></b-form-select>
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="状态" :label-cols="4" class="text-right">
                    <b-form-input v-model="model.empStatus" disabled/>
                </b-form-fieldset>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="在职状况" :label-cols="4" class="text-right">
                    <b-form-select :options="onJobList" v-model="model.onJob" disabled></b-form-select>
                </b-form-fieldset>
            </div>
        </div>
    </b-modal>
  </div>
</template>
<script>

import Modal from './modal/modal'
import { MessageBox, Message } from 'element-ui'
import config from 'common/config'
import api from 'common/api'
import { formatDate } from 'common/api-common'

import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
    components: {
        Modal
    },
    data() {
        return {
            model: {},
            sexList: config.staff.sexList,
            onJobList: config.staff.onJobList,
            selectOptions: []
        }
    },
    computed: {
        ...mapGetters('storeStation', [
            'empSchedulingObj',
            'empType',
            'empParams',
            'storeInfo',
            // 'empStatus'
        ])
    },
    mounted() {
        this.getEmpStatus(config.staff.refEmpStatus)
    },
    methods: {
        selectChange(val) {
            this.selectOptions = val
        },
        deleteEmp() {
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
            let params = {
                schedulingCodeList: [],
                storeCode: this.storeInfo.storeCode
            }
            this.selectOptions.forEach(item => {
                params.schedulingCodeList.push(item.schedulingCode)
            })
            api.empScheduling.delete(params).then(res => {
                if(res.data.code === 'success') {
                    this.getEmpSchedulingObj(this.empParams)
                }
            })
        },

        insert() {
            if(!this.storeInfo.storeCode) {
                this.setRequiredStore(true)
                return
            }
            if(!this.empParams.hasOwnProperty('schedulingDate')) {
                this.setEmpParams({
                    schedulingDate: formatDate(new Date()),
                    storeCode: this.storeInfo.storeCode
                })
            }
            this.setRequiredStore(false)            
            this.$refs.modal.show()
            // 这里要确定账号权限, 由modal自动查询
            // let params = {
            //     orgCode: this.storeInfo.orgCode,
            //     storeCode: this.storeInfo.storeCode,
            //     empType: "empTypeGroupEmpType",
            //     empStatusCodeList: this.empStatus
            // }
            // this.getEmpList(params)
        },
        getDetail(data) {
            // console.log(data)
            // console.log(this.empType)
            let params = {
                empCode: data.row.empCode
            }
            api.staff.getDetail(params, res => {
                if(res.data.code === 'success') {
                    this.model = res.data.obj
                }
            })
        },
        ...mapActions('storeStation', [
            'getEmpList',
            'getEmpSchedulingObj',
            'getEmpStatus'
        ]),
        ...mapMutations({
            setRequiredStore: 'storeStation/SET_REQUIRED_STORE',
            setEmpParams: 'storeStation/SET_EMP_PARAMS'
        })
    }
}
</script>
<style scoped>

</style>

