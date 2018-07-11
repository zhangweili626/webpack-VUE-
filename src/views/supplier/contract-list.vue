<template>
    <b-card header="合同信息">
        <div class="table-scrollable pt-1">
            <b-table striped hover bordered show-empty :items="contractList" :fields="fields">
                <template slot="contractNo" slot-scope="data">
                    <a href="javascript:;" @click="routerTo(data.item.contractNo)">{{data.item.contractNo}}</a>
                </template>
                <template slot="wfStatus" slot-scope="data">
                    {{data.item.wfStatus=="0"?'已提交': (data.item.wfStatus=='1')?'审批通过':'待提交'}}
                </template>
                <template slot="empty">
                    暂无数据...
                </template>
            </b-table>
        </div>
    </b-card>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
    data() {
        return {
            fields: {
                contractNo: {
                    label: "合同编码"
                },
                contractName: {
                    label: "合同名称"
                },
                beginDate: {
                    label: "生效日期"
                },
                endDate: {
                    label: "失效日期"
                },
                // supplierCode5: {
                //     label: "区域"
                // },
                // supplierCode6: {
                //     label: "门店"
                // },
                settlementTypeName: {
                    label: "结算方式"
                },
                // accountPeriodName: {
                //     label: "账期"
                // },
                wfStatus: {
                    label: "审批状态"
                },
            },
        }
    },
    computed: {
        ...mapState('supplier', [
            'contractList'
        ])
    },
    methods: {
        routerTo: function(code) {
            this.$router.push({
                path: `/purchasecontract/eidt`,
                query: {contractNo: code}
            })
        }
    }
}
</script>

<style>
    
</style>

