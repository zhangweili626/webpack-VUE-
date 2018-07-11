<template>
    <div class="row">
        <div class="col-md-12">
            <b-card header="查询">
                <div class="row">
                    <!-- <div class="col-md-6">
                        <b-form-fieldset horizontal label="工位名称" :label-cols="4" class="text-right">
                            <b-form-input  v-model="queryParams.stationName" />
                        </b-form-fieldset>
                    </div> -->
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="销售区域" :label-cols="4" class="text-right">
                            <area-tree @select-change="selectChange" ref="area" :storeAll='true'
                            ></area-tree>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="工位类型" :label-cols="4" class="text-right">
                            <b-form-select v-model="queryParams.stationTypeCode" :options="stationType">
                            </b-form-select>
                        </b-form-fieldset>
                    </div>
                    <div class="col-md-6">
                        <b-form-fieldset horizontal label="工位状态" :label-cols="4" class="text-right">
                            <b-form-select v-model="queryParams.stationStatus" :options="statusOptions">
                            </b-form-select>
                        </b-form-fieldset>
                    </div>
                </div>
                <query-btn-group @resetClick="reset" @query="query"></query-btn-group>
            </b-card>
        </div>
    </div>
</template>
<script>

import AreaTree from 'components/iris-areaqueryshop/index'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'

import { mapActions, mapGetters, mapMutations } from 'vuex'

import config from 'common/config'

export default {
    components: {
        QueryBtnGroup,
        AreaTree
    },
    props: {
        statusOptions: [Array]
    },
    data() {
        return {
            queryParams: {
                // stationName: '',
                stationStatus: '',
                stationTypeCode: '',
                storeCode: '',
                pageNums: config.pageNums,
                pageStart: 1,
                storeCodeList: []
            },
        }
    },
    created() {
        this.getStationType(config.storeStation.refCode)
    },
    computed: {
        ...mapGetters('storeStation', [
            'stationType'
        ])
    },
    methods: {
        selectChange(sales, stores) {
            if(Array.isArray(stores)) {
                stores.splice(0, 1)
                this.queryParams.storeCodeList = []
                stores.forEach(item => {
                    this.queryParams.storeCodeList.push(item.value)
                })
            }else {
                this.queryParams.storeCodeList = []
                this.queryParams.storeCode = stores.value
            }          
        },
        query() {
            this.queryParams.pageStart = 1; 
            let params = JSON.parse(JSON.stringify(this.queryParams))
            this.getStoreStationObj(params)
            this.$emit('check',-1)
        },
        reset() {
            // this.queryParams.stationName = ''
            this.queryParams.stationTypeCode = ''
            this.queryParams.stationStatus = ''
        },
        ...mapActions({
            getStationType: 'storeStation/getStationType',
            getStoreStationObj: 'storeStation/getStoreStationObj'
        }),
    }
}
</script>
<style lang="css" scoped>
</style>

