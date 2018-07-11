<template>
    <div>
        <b-table striped hover bordered show-empty :items="invoiceDetailTableData" :fields="invoiceDetailTableFields">
            <template slot="empty">
                暂无数据...                  
            </template>
        </b-table>

    </div>
</template>
<script>
    import config from 'common/config'
    
    //私有组件
    import Bus from '../bus/bus.js'
    export default {
        data() {
            return {
                //对账单类型数据
                invoiceDetailTableData: [], //表格信息
                invoiceDetailTableFields: {

                },//表格信息字段
                //发票明细新增接口
                sunbitInvoiceDetail: []
            }
        },
        methods:{
            //添加发票明细
            addInvoiceDetailData(){

            },
            //删除发票明细
            deleteInvoiceDetailData(){

            }
        }
    }
</script>


