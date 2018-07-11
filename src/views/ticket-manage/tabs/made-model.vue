<template>
    <div class="showDetailBackground">
        <div class="table-scrollable">
            <b-table striped hover bordered show-empty :items="hasMadeArray" :fields="couponfields">
                <template slot="detail" slot-scope="data">
                    <a href="javascript:;" @click="showDetail(data.item.couponMakeOrderNo)">查看</a>
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
                :title="modalTitle"
                :hide-footer="true"
               >
           <!-- <div class="controlCancelButton"><div class="cancelButton-my" @click="closeModel">×</div></div>
            <h4>批次号: {{ couponMakeOrderNo }}</h4>-->
            <div class="numsTotal">
                <span>已制券: {{ totalcoupon ? totalcoupon : 0 }}</span>
                <span>已作废: {{ deleteNums ? deleteNums : 0 }}</span>
                <span>已售: {{ saleNums ? saleNums : 0 }}</span>
                <span>未售: {{ unsaleNums ? unsaleNums : 0 }}</span>
            </div>
            <div class="table-scrollable controlfontsize">
                <b-table striped hover bordered show-empty :items="modellist" :fields="modelfields">
                    <template slot="couponExpireType" slot-scope="data">
                        {{ data.item.couponExpireType === 0 ? '固定时长' : '' }}
                        {{ data.item.couponExpireType === 1 ? '有效期限' : '' }}
                    </template>
                    <template slot="couponStatus" slot-scope="data">
                        {{ data.item.couponStatus === 0 ? '未销售': '' }}
                        {{ data.item.couponStatus === 1 ? '挂售中': '' }}
                        {{ data.item.couponStatus === 2 ? '已销售': '' }}
                        {{ data.item.couponStatus === 8 ? '退卡中': '' }}
                        {{ data.item.couponStatus === 9 ? '已退卡': '' }}
                        {{ data.item.couponStatus === -1 ? '已作废': '' }}
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
            couponTemplateCode: {
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
            	modalTitle:'',
                totalcoupon: '',
                deleteNums: '',
                saleNums: '',
                unsaleNums: '',
                newcouponlist: [],
                modelShow: false,
                modellist: [],
                page: {},
                couponMakeOrderNo: '',
                couponfields: {
                    couponMakeOrderNo: {
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
                    // couponMakeOrderNo: {
                    //     label: '批次号'
                    // },
                    storeName: {
                        label: '门店'
                    },
                    couponNo: {
                        label: '券号'
                    },
                    couponName: {
                        label: '名称'
                    },
                    couponExpireType: {
                        label: '有效期类型'
                    },
                    couponUseTypeName: {
                        label: '使用方'
                    },
                  /*  couponPrice: {
                        label: '售价'
                    },*/
                    startDateStr: {
                        label: '有效期起始时间'
                    },
                    endDateStr: {
                        label: '有效期结束时间'
                    },
                    effectiveDays: {
                        label: '有效期天数'
                    },
                    couponStatus: {
                        label: '业务状态'
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
                _this.couponMakeOrderNo = code
                this.modalTitle=`批次号:${this.couponMakeOrderNo}`
                _this.query()
                _this.queryTotal()
            },
            // 查询总量
            queryTotal() {
                const _this = this
                let option = {
                    couponTemplateCode: _this.couponTemplateCode,
                    couponMakeOrderNo: _this.couponMakeOrderNo
                }
                api.ticketManage.queryTableTotal(option, res => {
                    if(res.data.code === 'success') {
                //         totalcoupon: '',
                // deleteNums: '',
                // saleNums: '',
                // unsaleNums: '',
                        _this.deleteNums = res.data.obj.cancelledCount
                        _this.totalcoupon = res.data.obj.makeCount
                        _this.saleNums = res.data.obj.soldCount
                        _this.unsaleNums = res.data.obj.didCount
                    }
                })
            },
            // 查询
            query(arg = 1) {
                const _this = this
                let option = {
                    couponTemplateCode: this.couponTemplateCode,
                    couponMakeOrderNo:this.couponMakeOrderNo,
                    pageStart: arg,
                    pageNums: config.pageNums
                }
                /*queryCouponPriceInfo*/
                api.ticketManage.queryTableList(option, res => {
                    if(res.data.code === 'success') {
                        this.modellist = res.data.obj.list
                        let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        this.page = tempPage
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
    .specialTabs a{
   	border-radius: 0 !important;
   }
</style>
