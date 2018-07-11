<template>
    <div class="back-card">
        <b-card header="退卡单号：">
            <!-- <div class="row">
                <div class="col-md-12 col-lg-12">
                    <div class="cardModelLine">
                        <span>退卡单号: ffdsfsdfds</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                </div>
            </div> -->
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="primary">提交审批</b-button>
                    </div>
                </div>
            </div>
		   <div class="row">
                <div class="table-scrollable mb-2">
                    <el-table
                        :data="tableList"
                        border
                        style="width: 100%">
                        <el-table-column
                        prop="car"
                        label="卡号"
                        :width="getColumnW('卡号', '')">
                            <template slot-scope="scope">
                                <a href="javascript:;" @click="toCarModel">{{scope.row.car}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column
                        prop="1"
                        label="操作人"
                        :width="getColumnW('操作人', '')">
                        </el-table-column>
                        <el-table-column
                        prop="2"
                        label="退卡时间"
                        :width="getColumnW('退卡时间', '')">
                        </el-table-column>
                        <el-table-column
                        prop="3"
                        label="退款总金额"
                        :width="getColumnW('退款总金额', '')">
                        </el-table-column>
                        <el-table-column
                        prop="4"
                        label="退款手续费"
                        :width="getColumnW('退款手续费', '')">
                        </el-table-column>
                        <el-table-column
                        prop="5"
                        label="应退金额"
                        :width="getColumnW('应退金额', '')">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
		</b-card>
        <b-card>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <span>退款明细</span>
                    </div>
                    <div class="pull-right">
                        <b-button size="sm" variant="primary">完结</b-button>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 mt-4  ">
                    <div class="pull-left">
                        <b-button size="sm" variant="primary" @click="myModalRefShow">新增</b-button>
                        <b-button size="sm" variant="primary">删除</b-button>
                    </div>
                    <div class="pull-right">
                        <div class="cardModelLine">
                            <span>应退金额: ffdsfsdfds</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>实退金额: ffdsfsdfds</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                    </div>
                </div>
            </div>
		   <div class="row">
                <div class="table-scrollable mb-2">
                    <el-table
                        :data="tableList"
                        border
                        style="width: 100%">
                        <el-table-column
                        prop="1"
                        label="操作人"
                        :width="getColumnW('操作人', '')">
                        </el-table-column>
                        <el-table-column
                        prop="2"
                        label="退卡时间"
                        :width="getColumnW('退卡时间', '')">
                        </el-table-column>
                        <el-table-column
                        prop="3"
                        label="退款总金额"
                        :width="getColumnW('退款总金额', '')">
                        </el-table-column>
                        <el-table-column
                        prop="4"
                        label="退款手续费"
                        :width="getColumnW('退款手续费', '')">
                        </el-table-column>
                        <el-table-column
                        prop="5"
                        label="应退金额"
                        :width="getColumnW('应退金额', '')">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
		</b-card>
        <model ref="myModalRef"></model>
        <cardModel ref="cardModel"></cardModel>
    </div>
</template>
<script>
import Vue from 'vue'
import AreaTree from 'components/iris-areaqueryshop/index'
import QueryBtnGroup from 'components/query-btn-group/query-btn-group'
import ListBtnGroup from 'components/list-btn-group/list-btn-group'
import Pagination from 'components/pagination/pagination'
import model from './model.vue'
import cardModel from './card-model.vue'
import { MessageBox, Message, DatePicker, Input, Table ,TableColumn , Tooltip} from 'element-ui'
Vue.use(Table)
Vue.use(TableColumn)
export default {
    components: {
        AreaTree,
        QueryBtnGroup,
        ListBtnGroup,
        Pagination,
        model,
        cardModel
    },
    data() {
        return {
            tableList:[{
                1:"",
                2:"",
                3:"",
                4:"",
                5:"",
                car:'11111'
            }],
        }
    },
    methods: {
        getColumnW(headStr) {
            return (headStr.length) * this.columW +36;
        },
        myModalRefShow(){
            const _this = this;
            _this.$refs.myModalRef.show()       
        },
        toCarModel(){
            const _this = this;
            _this.$refs.cardModel.show()                   
        }
    }
}
</script>
<style>
    .cardModelLine {
        padding-bottom: 10px;
    }
    @media (min-width: 992px){
        .back-card .modal-lg {
            max-width: 1200px;
        }
    }
</style>
