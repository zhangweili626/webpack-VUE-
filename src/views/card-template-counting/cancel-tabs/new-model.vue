<template>
    <div class="showDetailBackground">
        <div class="table-scrollable showDetailofA">
            <b-table striped hover bordered show-empty :items="newcardlist" :fields="cardfields">
                <template slot="nums" slot-scope="data">
                    {{data.item.cancelledCount}}
                </template>
                <template slot="detail" slot-scope="data">
                    <a href="javascript:;" @click="showDetail(data.item)">查看</a>
                </template>
                <template slot="empty">
                    暂无数据...
                </template>
            </b-table>
        </div>
        <b-modal id="modalPrevent"
                ref="modal"
                :hide-footer="true"
                :hide-header="true">
            <div class="controlCancelButton"><div class="cancelButton-my" @click="closeModel">×</div></div>                
            <h4>{{ checkRowData.storeName}}</h4>
            <div class="numsTotal">
                <span>已制卡: {{ totalCard ? totalCard : 0 }}</span>
                <span>已作废: {{ deleteNums ? deleteNums : 0 }}</span>
                <span>已售: {{ saleNums ? saleNums : 0 }}</span>
                <span>未售: {{ unsaleNums ? unsaleNums : 0 }}</span>
            </div>
            <div class="table-scrollable controlfontsize">
                <b-table striped hover bordered show-empty :items="modellist" :fields="modelfields">
                    <template slot="cardExpireType" slot-scope="data">
                        {{ data.item.cardExpireType === 0 ? '固定时长' : '' }}
                        {{ data.item.cardExpireType === 1 ? '标定日期' : '' }}
                        {{ data.item.cardExpireType === -1 ? '储值卡无有效期' : '' }}
                    </template>
                    <template slot="cardStatus" slot-scope="data">
                        {{ data.item.cardStatus === 0 ? '未销售': '' }}
                        {{ data.item.cardStatus === 1 ? '挂售中': '' }}
                        {{ data.item.cardStatus === 2 ? '已销售': '' }}
                        {{ data.item.cardStatus === 8 ? '退卡中': '' }}
                        {{ data.item.cardStatus === 9 ? '已退卡': '' }}
                        {{ data.item.cardStatus === -1 ? '已作废': '' }}
                    </template>
                    <template slot="empty">
                        暂无数据...
                    </template>
                </b-table>
            </div>
            <div class="row mt-2">
               <div class="col-md-12">
                 <pagination class="pull-right" @page-change="pageChange" :page-no="page.pageNo" :page-size="page.pageSize" :total-result="page.totalResult" :total-pages="page.totalPages">
                 </pagination>
               </div>
            </div>
        </b-modal>
    </div>
</template>
<script>
    import pagination from 'components/pagination/pagination.vue'
    import config from 'common/config.js'
    import api from 'common/api.js'
    import common from 'common/common.js'
    import { MessageBox, Message } from 'element-ui'
    export default {
        props: {
            newcard: {
                type: Array,
                default: function(){
                    return []
                }
            },
        },
        computed:{
            newcardlist:function(){
                const _this = this
                return _this.newcard
            }
        },
        components: {
            pagination
        },
        data() {
            return {
                page:{},
                // newcardlist:[],
                modellist:[],
                cardfields: {
                    storeCode: {
                        label: '门店编码'
                    },
                    storeName: {
                        label: '门店名称'
                    },
                    cancelledCount: {
                        label: '作废数量'
                    },
                    detail: {
                        label: '详情'
                    }
                },
                modelfields: {
                    cardMakeOrderNo: {
                        label: '批次号'
                    },
                    storeName: {
                        label: '门店'
                    },
                    cardNo: {
                        label: '卡号'
                    },
                    cardName: {
                        label: '名称'
                    },
                    cardExpireType: {
                        label: '有效期类型'
                    },
                    cardUseTypeName: {
                        label: '使用方'
                    },
                    cardAmout: {
                        label: '面值'
                    },
                    startDate: {
                        label: '有效期起始时间'
                    },
                    endDate: {
                        label: '有效期结束时间'
                    },
                    effectiveDays: {
                        label: '有效期天数'
                    },
                    cardStatus: {
                        label: '卡状态'
                    },
                },
                checkRowData:{},
                page:{},
                deleteNums:null,
                totalCard:null,
                saleNums:null,
                unsaleNums:null,
            }
        },
        methods: {
            pageChange(v){
                const _this = this;
                _this.query(v)
            },
             // 查看
            showDetail(data) {
                const _this = this
                _this.checkRowData = data
                _this.query(1,_this.checkRowData.storeCode)
                _this.queryTotal(_this.checkRowData.storeCode)
                _this.$refs.modal.show()
            },
            // 查询总量
            queryTotal(storeCode) {
                const _this = this
                let option = {
                    cardTemplateCode: _this.$route.query.cardTemplateCode,
                    storeCode:storeCode
                }
                api.cardManage.queryTableTotal(option, res => {
                    if(res.data.code === 'success') {
                        _this.deleteNums = res.data.obj.cancelledCount
                        _this.totalCard = res.data.obj.makeCount
                        _this.saleNums = res.data.obj.soldCount
                        _this.unsaleNums = res.data.obj.didCount
                    }
                })
            },
            query(arg,storeCode){
                const _this = this
                let option = {
                    cardTemplateCode: _this.$route.query.cardTemplateCode,
                    storeCode: storeCode,
                    pageStart: arg,
                    pageNums: config.pageNums
                }
                api.cardManage.queryTableList(option, res => {
                    if(res.data.code === 'success') {
                        _this.modellist = res.data.obj.list
                        let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        _this.page = tempPage
                    }
                })
            },
            // 关闭模态框
            closeModel() {
                const _this = this
                _this.modellist = []
                _this.$refs.modal.hide()                
            },
        },
        watch: {
            
        },
        created(){
            const _this = this; 
        }
    }
</script>
<style>
    .showDetailBackground .modal-dialog {
        max-width: 1100px !important;
    }
    .showDetailofA a {
        color: #006699 !important;
    }
    .controlCancelButton {
        position: relative;
    }
    /* .showDetailBackground .modal-content {
        background-color: #006699;
        color: #fff;
    } */
    .cancelButton-my {
        position: absolute;
        top: -30px;
        right: -30px;
        width: 30px;
        height: 30px;
        /* border: 1px solid #ccc; */
        line-height: 20px;
        border-radius: 50%;
        background-color: #fff;
        text-align: center;
        font-size: 30px;
        cursor: pointer;
    }
    .numsTotal {
        text-align: right;
    }
    .numsTotal span {
        display: inline-block;
        margin-left: 30px;
    }
    /* .controlfontsize {
        color: #000
    } */
</style>
