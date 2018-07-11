<template>
    <div>
        <b-card header="查询">
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="门店名称" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryOption.storeName" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="门店区域" label-text-align="right" :label-cols="4">
                        <areaqueryshop ref="areaqueryshopin" @select-change="selectedfun"></areaqueryshop>
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="门店缩写" label-text-align="right" :label-cols="4">
                        <b-form-input v-model="queryOption.storeAddrName" placeholder="" />
                    </b-form-fieldset>
                </div>
                <div class="col-md-6 col-lg-6">
                    <b-form-fieldset horizontal label="门店状态" label-text-align="right" :label-cols="4">
                        <b-form-select v-model="queryOption.isDeleted" :options="statelist" placeholder="" />
                    </b-form-fieldset>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-right">
                        <b-button size="sm" variant="default" @click="reset">重置</b-button>
                        <b-button size="sm" variant="primary" @click="query(0)">查询</b-button>
                    </div>
                </div>
            </div>
        </b-card>
        <b-card>
            <div class="row">
                <div class="col-md-12">
                    <div class="pull-left">
                        <b-button size="sm" v-if="addBtn" variant="success" @click="add">新建</b-button>
                        <b-button size="sm" v-if="editBtn" variant="primary" @click="edit">编辑</b-button>
                        <!-- <b-button size="sm" variant="primary" @click="show">查看</b-button> -->
                    </div>
                    <div class="pull-right">
                        <b-button size="sm" variant="warning" @click="dataSync">同步数据</b-button>
                    </div>
                </div>
            </div>
            <div class="table-scrollable">
                <b-table striped hover bordered show-empty :items="storelist" :fields="fields">
                    <template slot="index" slot-scope="data">
                        <div @click="setEditCode(data.item.storeCode)">
							<input type="radio" name="radio" />
						</div>
                    </template>
                    <template slot="storeCode" slot-scope="data">
                        <a href="javascript:;" @click="showDetail(data.item.storeCode)">{{ data.item.storeCode }}</a>
                    </template>
                    <template slot="abbreviation" slot-scope="data">
                        {{ data.item.storeAddrName }}
                    </template>
                    <template slot="linkMan" slot-scope="data">
                        {{ data.item.contactPerson }}
                    </template>
                    <template slot="linkTel" slot-scope="data">
                        {{ data.item.contactPhone }}
                    </template>
                    <template slot="workStartTime" slot-scope="data">
                        {{ data.item.businessStartTime }}
                    </template>
                    <template slot="workEndtTime" slot-scope="data">
                        {{ data.item.businessEndTime }}
                    </template>
                    <template slot="storeStatus" slot-scope="data">
                        {{ data.item.isDeleted === "0" ? '可用' : '不可用' }}
                    </template>
                    <template slot="storeArea" slot-scope="data">
                        {{ data.item.chinaCityName + data.item.storeAddress }}
                    </template>
                    <template slot="organization" slot-scope="data">
                        {{ data.item.orgName }}
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
        </b-card>
    </div>
</template>
<script>
    import {mapState, mapMutations, mapActions} from 'vuex'
    import areaqueryshop from 'components/iris-areaqueryshop/'
    import pagination from 'components/pagination/pagination.vue'
    import { MessageBox, Message} from 'element-ui'
    import {hasBtn} from 'common/api-common.js'
    import api from 'common/api.js'
    import config from 'common/config.js'
    import collectionApi from 'common/api-collection.js'
    export default {
        components: {
            areaqueryshop,
            pagination
        },
        data() {
            return {
                tempStoreCode: '',
                queryOption: {
                    storeName: '',
                    storeAddrName: '',
                    isDeleted: '',
                    storeCode: '',
                    storeDistrictCode: ''
                },
                tablelist: [],
                statelist: [],
                fields: {
                    index: {
                        label: ' '
                    },
                    storeCode: {
                        label: '门店编码'
                    },
                    storeName: {
                        label: '门店名称'
                    },
                    abbreviation: {
                        label: '门店缩写'
                    },
                    linkMan: {
                        label: '联系人'
                    },
                    linkTel: {
                        label: '联系电话'
                    },
                    workStartTime: {
                        label: '开始营业时间'
                    },
                    workEndtTime: {
                        label: '结束营业时间'
                    },
                    storeStatus: {
                        label: '门店状态'
                    },
                    storeArea: {
                        label: '门店区域'
                    },
                    organization: {
                        label: '所属组织'
                    }
                }
            }   
        },
        computed: {
            addBtn() {
                return hasBtn(collectionApi.store.addStore)
            },
            editBtn() {
                return hasBtn(collectionApi.store.updateStore)
            },
            ...mapState('storemanage', [
                'page',
                'storelist'
            ])
        },
        methods: {
            ...mapActions('storemanage', [
                'setStoreList',
                'setStorePage'
            ]),
            // 重置
            reset() {
                const _this = this
                _this.queryOption= {
                    storeName: '',
                    storeAddrName: '',
                    isDeleted: '',
                    storeCode: '',
                    storeDistrictCode: ''
                }
                _this.$refs.areaqueryshopin.reset()
                _this.$refs.areaqueryshopin.resetToStart()
            },
            // 数据同步
            dataSync() {
                api.storeManage.dataSync((res) => {
                    if(res.data.code === 'success') {
                        Message({
                            type: 'info',
                            message: '数据初始化成功'
                        })
                    }
                })
            },
            pageChange(num) {
                const _this = this
                _this.query(num)
            },
            selectedfun(data, data1) {
                const _this = this
               if (data) {
                    this.queryOption.areaCode = [];
                    for (let i = 0; i < data.length; i++) {
                        this.queryOption.areaCode.push(data[i].code)
                    }
                }
                if (data1) {
                    this.queryOption.storeCode = data1.value
                }
            },
            setEditCode(arg) {
                const _this = this
                _this.tempStoreCode = arg
            },
            showDetail(arg) {
                const _this = this
                _this.$router.push({
                    path: `/storemanage/show/${arg + 'show'}`
                })
            },
            query(arg) {
                // queryOption: {
                //     storeName: '',
                //     storeAddrName: '',
                //     isDeleted: '',
                //     storeCode: ''
                // }
                const _this = this
                let option = {
                    storeName: _this.queryOption.storeName,
                    storeAddrName: _this.queryOption.storeAddrName,
                    isDeleted: _this.queryOption.isDeleted,
                    salesAreaCodes: _this.queryOption.areaCode,
                    storeCode: _this.queryOption.storeCode === 0 ? '' : _this.queryOption.storeCode,
                    storeDistrictCode: _this.queryOption.storeDistrictCode,
                    pageNums: config.pageNums,
                    pageStart: arg === 0? 1: arg
                }
                api.storeManage.queryByPage(option, (res) => {
                    if(res.data.code === 'success') {
                        // _this.tablelist = res.data.obj.list
                        let tempPage = {
                            pageNo: res.data.obj.pageNum,
                            pageSize: config.pageNums,
                            totalResult: res.data.obj.total,
                            totalPages: res.data.obj.pages
                        }
                        _this.setStorePage(tempPage)
                        _this.setStoreList(res.data.obj.list)
                    }
                })
            },
            add() {
                const _this = this
                _this.$router.push({
                    path: `/storemanage/add/${'0'}`
                })
            },
            edit() {
                const _this = this
                if(_this.tempStoreCode === '') {
                    Message({
                        type: 'info',
                        message: '请选择编辑项'
                    })
                }else {
                    _this.$router.push({
                        path: `/storemanage/edit/${_this.tempStoreCode}`
                    })
                }
            }
        },
        created() {
            const _this = this
            _this.statelist = config.storeManage.statelist
        }
    }
</script>
<style scoped>

</style>

