<template>
<div class="animated fadeIn">
    <div class="row">
        <div class="col-md-12">
            <b-card>
                <div class="row">
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="销售区域 *" :label-cols="4" class="text-right">
                            <area-tree 
                               @select-change="selectChange" ref="area" :storeAll='true'
                               :error="requiredStore"
                            ></area-tree>
                        </b-form-fieldset>
                    </div>
                </div>
            </b-card>
        </div>
    </div>

    <div class="row">
        <div class="col-md-4">
            <b-card>
                <date-select :storeCode="storeCode"></date-select>
            </b-card>
        </div>
        <div class="col-md-8">
            <b-card>
                <emp-list></emp-list>    
            </b-card>
        </div>
    </div>
</div>
</template>
<script>

import AreaTree from 'components/iris-areaqueryshop/index'
import DateSelect from './date-select'
import EmpList from './emp-list'
import config from 'common/config'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { formatDate } from 'common/api-common'

export default {
    components: {
        AreaTree,
        DateSelect,
        EmpList
    },
    data() {
        return {
            storeCode: ''
        }
    },
    created() {
        this.getEmpType(config.staff.refEmpType)
        this.getPostType(config.empScheduling.postRefCode)
        
    },
    computed: {
        ...mapGetters('storeStation', [
            'requiredStore',
            'empParams'
        ])
    },
    methods: {
        selectChange(sales, stores) {
            this.storeCode = stores.value
            if(!Array.isArray(stores)) {
                if(stores.value) {
                    this.getStoreInfo({storeCode: stores.value})
                }
                this.setEmpParams({
                    schedulingDate: this.empParams.schedulingDate || formatDate(new Date()),
                    storeCode: this.storeCode
                })
                this.getEmpSchedulingObj(this.empParams)
            }
        },
        ...mapActions('storeStation', [
            'getEmpType',
            'getPostType',
            'getStoreInfo',
            'getEmpSchedulingObj'
        ]),
        ...mapMutations({
            setEmpParams: 'storeStation/SET_EMP_PARAMS'
        })
    }
};
</script>