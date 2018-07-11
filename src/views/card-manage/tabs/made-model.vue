<template>
    <div class="showDetailBackground">
        <div class="table-scrollable">
            <b-table striped hover bordered show-empty :items="hasMadeArray" :fields="cardfields">
                <template slot="detail" slot-scope="data">
                    <a href="javascript:;" @click="showDetail(data.item.cardMakeOrderNo)">查看</a>
                </template>
                <template slot="empty">
                    暂无数据...
                </template>
            </b-table>
        </div>
        <b-modal id="modalPrevent"
                ref="modal"
                v-model="modelShow"
                size="lg"
                :hide-footer="true"
                :hide-header="true">
            <div class="controlCancelButton"><div class="cancelButton-my" @click="closeModel">×</div></div>
            <h4>批次号: {{ cardMakeOrderNo }}</h4>
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
                        {{ data.item.cardExpireType === 1 ? '标定结束日期' : '' }}
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
            <!-- <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="" @click="closeModel">关闭</b-button>
                    </div>
                </div>
            </div> -->
        </b-modal>
    </div>
</template>
<script>
    import pagination from 'components/pagination/pagination.vue'
    import api from 'common/api.js'
    import config from 'common/config.js'
    export default {
        props: {
            showObj: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            cardTemplateCode: {
                type: String,
                default: ''
            },
            hasMadeArray: {
                type: Array,
                default: function() {
                    return []
                }
            }
        },
        components: {
            pagination
        },
        data() {
            return {
                totalCard: '',
                deleteNums: '',
                saleNums: '',
                unsaleNums: '',
                newcardlist: [],
                modelShow: false,
                modellist: [],
                page: {},
                cardMakeOrderNo: '',
                cardfields: {
                    cardMakeOrderNo: {
                        label: '批次号'
                    },
                    makeCount: {
                        label: '已制数量'
                    },
                    soldCount: {
                        label: '已售数量'
                    },
                    detail: {
                        label: '详情'
                    }
                },
                modelfields: {
                    // cardMakeOrderNo: {
                    //     label: '批次号'
                    // },
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
                    startDateStr: {
                        label: '有效期起始时间'
                    },
                    endDateStr: {
                        label: '有效期结束时间'
                    },
                    effectiveDays: {
                        label: '有效期天数'
                    },
                    cardStatus: {
                        label: '卡状态'
                    }
                }
            }
        },
        methods: {
            // 关闭模态框
            closeModel() {
                const _this = this
                _this.modelShow = false
            },
            // 查看
            showDetail(code) {
                const _this = this
                _this.modelShow = true
                _this.cardMakeOrderNo = code
                _this.query(1)
                _this.queryTotal()
            },
            // 查询总量
            queryTotal() {
                const _this = this
                let option = {
                    cardTemplateCode: _this.cardTemplateCode,
                    cardMakeOrderNo: _this.cardMakeOrderNo
                }
                api.cardManage.queryTableTotal(option, res => {
                    if(res.data.code === 'success') {
                //         totalCard: '',
                // deleteNums: '',
                // saleNums: '',
                // unsaleNums: '',
                        _this.deleteNums = res.data.obj.cancelledCount
                        _this.totalCard = res.data.obj.makeCount
                        _this.saleNums = res.data.obj.soldCount
                        _this.unsaleNums = res.data.obj.didCount
                    }
                })
            },
            // 查询
            query(arg) {
                const _this = this
                let option = {
                    cardTemplateCode: _this.cardTemplateCode,
                    cardMakeOrderNo: _this.cardMakeOrderNo,
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
            // 换页
            pageChange(num) {
                const _this = this
                _this.query(num)
            }
        }
    }
</script>
<style>
    .showDetailBackground .modal-dialog {
        max-width: 1100px !important;
    }
    /* .showDetailofA a {
        color: #006699 !important;
    } */
    /* .showDetailBackground .modal-content {
        background-color: #006699;
        color: #fff;
    } */
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
