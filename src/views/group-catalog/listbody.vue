<template>
    <div class="row">
        <div class="col-md-12">
            <b-card>
                <div class="row">
                    <div class="col-md-12">
                        <b-button size="sm" variant="success" @click="insert">新增</b-button>
                        <b-button size="sm" variant="primary" @click="update">编辑</b-button>
                        <b-button size="sm" variant="warning" class="pull-right" @click="init">同步数据</b-button>
                    </div>
                </div>
                <div class="table-scrollable mb-2">
                    <b-table striped hover bordered show-empty :items="obj.list" :fields="fields">
                        <template slot="radio" slot-scope="data">
                            <div @click="check(data.index)">
                                <input type="radio" name="radio" />
                            </div>
                        </template>
                        <template slot="isDeleted" slot-scope="row">{{row.value === '0' ? '可用' : '停用'}}</template>                        
                        <template slot="empty" >暂无数据</template>
                    </b-table>
                </div>
                <div class="row"> 
                    <div class="col-md-12">
                       <pagination class="pull-right" @page-change="pageChange" :page-no="obj.pageNo" :page-size="obj.pageSize" :total-result="obj.total" :total-pages="obj.pages">
						</pagination>
                    </div>
                </div>
                <!-- insert - and - update - modal -->
                <modal :queryParams="queryParams" :showModal="showModal" ref="model"></modal>
            </b-card>
        </div>
    </div>
</template>
<script>

import Pagination from 'components/pagination/pagination.vue'
import Modal from './modal'
import { mapGetters, mapMutations } from 'vuex'
import { Message } from 'element-ui'
import api from 'common/api'
import url from 'common/api-collection'
import { hasBtn } from 'common/api-common.js'

export default {
    components: {
        Pagination,
        Modal
    },
    props: ['queryParams'],
    data() {
        return {
            fields: {
                radio: {
                    label: ' '
                },
                catlogCode: {
                    label: '组合目录编码'
                },
                catlogName: {
                    label: '组合目录名称'
                },
                remark: {
                    label: '备注'
                },
                isDeleted: {
                    label: '状态'
                }
            },
            index: '',
            showModal: true,
        }
    },
    computed: {
        listIndex() {
            return (this.obj.pageNum - 1) * this.obj.pageSize
        },
        // 新增按钮权限示例
        canInsert() {
            const insertUrl = url.groupCatalog.insert 
            return hasBtn(insertUrl)
        },
        canUpdate() {
            const updateUrl = url.groupCatalog.update
            return hasBtn(updateUrl)
        },
        ...mapGetters('classification', [
            'obj'
        ])
    },
    methods: {
        check(index) {
            this.index = index;
        },
        insert() {
            this.showModal = true;
            this.$refs.model.insertClick()
        },
        update() {
            if (this.index === '') {
                Message({
                    type: 'warning',
                    message: "请选择一条数据"
                });
                this.showModal = false;
                return;
            } else {
                this.showModal = true;
                let params = {
                    catlogCode: this.obj.list[this.index].catlogCode
                };
                api.groupCatalog.query(params).then(res => {
                    if (res.data.code === 'success') {
                        let list = res.data.obj.list;
                        this.getCatalogDetail(list)
                        this.$refs.model.updateClick() 
                    }
                })
            }
        },
        init() {
            this.showModal = false
            api.groupCatalog.init().then(res => {
                if (res.data.code === 'success') {
                    Message({
                        type: 'success',
                        message: "操作成功"
                    })
                    this.showModal = true
                }
            })
        },
        pageChange(page) {
            this.queryParams.pageStart = page;
            let params = this.queryParams;
            api.groupCatalog.query(params).then(res => {
                if (res.data.code === 'success') {
                    let obj = res.data.obj;
                    this.getObj(obj)
                }
            })
        },
        ...mapMutations({
            getObj: 'classification/GET_OBJ',
            getCatalogDetail: 'classification/GET_CATALOG_DETAIL'
        })
    }
}
</script>
