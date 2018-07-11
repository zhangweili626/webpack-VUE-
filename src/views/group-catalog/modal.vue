<template>
    <b-modal id="insert" ref="insert" :title="isInsert ? '新增组合目录' : '编辑组合目录'" size="lg" @ok="handleOk" ok-title="确定" cancel-title="取消" v-if="showModal">
        <div class="row">
            <div class="col-md-6 catalog">
                <el-tree :data="treeData" :props="propOption" :load="loadNode" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="hasExpandClick" @node-click="handleNodeClick">
                </el-tree>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="组合目录编码" :label-cols="4" class="text-right">
                    <b-form-input v-model="insertParams.catlogCode" readonly/>
                </b-form-fieldset>
                <b-form-fieldset horizontal label="父级组合目录名称" :label-cols="4" class="text-right">
                    <b-form-input v-model="fatherName" :state="catlFatherState" readonly/>
                </b-form-fieldset>
                <b-form-fieldset horizontal label="组合目录名称 *" :label-cols="4" class="text-right">
                    <b-form-input v-model="insertParams.catlogName" :state="catlState" placeholder="必填项"/>
                    <b-form-feedback class="text-left">
                    </b-form-feedback>
                </b-form-fieldset>
                <b-form-fieldset horizontal label="备注" :label-cols="4" class="text-right">
                    <b-form-input v-model="insertParams.remark" />
                </b-form-fieldset>
                <b-form-fieldset horizontal label="状态" :label-cols="4" class="text-right">
                    <b-form-select v-model="insertParams.isDeleted" :options="statusOptions">
                    </b-form-select>
                </b-form-fieldset>
            </div>
        </div>
    </b-modal>
</template> 
<script>
import Vue from 'vue'
import { Tree, Message } from 'element-ui'
Vue.use(Tree);
import api from 'common/api'
import config from 'common/config'
import { mapGetters, mapMutations,mapState } from 'vuex'

export default {
    components: {
        Tree
    },
    props: [ 'queryParams', 'showModal'],
    data() {
        return {
            treeData: [],
            propOption: {
                children: 'children',
                label: 'catlogName'
            },
            insertParams: {
                catlogCode: '',
                catlogName: '',
                fatherCatlogCode: '',
                remark: ''
            },
            fatherName: '',
            isInsert: true,
            hasExpandClick: false,   // 箭头节点严格区分
            statusOptions: [
                {
                    value: 0,
                    text: '可用'
                },
                {
                    value: 1,
                    text: '停用'
                }
            ],
            catlState: null,
            catlFatherState: null
        }
    },
    computed: {
        ...mapGetters('classification', [
            'catalogDetail'
        ]),
        ...mapState('classification',['obj',])
    },
    methods: {
        // 加载子树数据
        loadNode(node, resolve) {
            if (node.level === 0) {
                let params = { catlogCode: config.groupCatalog.rootCode };
                api.groupCatalog.getSubInfoByCode(params).then(res => {
                    if (res.data.code === 'success') {
                        let obj = res.data.obj;
                        if (obj) {
                            let arr = [{
                                id: 0,   // 默认展示一级节点
                                catlogName: obj.catlogName,
                                catlogCode: obj.catlogCode
                            }];
                            return resolve(arr);
                        }
                    }
                })
            } else {
                let params = { catlogCode: node.data.catlogCode };
                api.groupCatalog.getSubInfoByCode(params).then(res => {
                    if (res.data.code === 'success') {
                        let items = res.data.obj.combinationCatLogSubInfo;
                        let arr = [];
                        if (items !== null) {
                            items.forEach((item, index) => {
                                let data = {
                                    catlogName: item.catlogName,
                                    catlogCode: item.catlogCode
                                }
                                arr.push(data)
                            })
                        } else {
                            return resolve([])
                        }
                        return resolve(arr)
                    }
                })
            }
        },
        // 节点点击事件
        handleNodeClick(data) {
            this.insertParams.fatherCatlogCode = data.catlogCode;
            this.fatherName = data.catlogName
        },
        // 获取服务目录编码
        getcatlogCode() {
            let params = { serviceCode: config.groupCatalog.seqCode };
            api.ordinalInfo.getSequence(params, res => {
                if (res.data.code === 'success') {
                    let obj = res.data.obj;
                    this.insertParams.catlogCode = obj;
                }
            })
        },
        // 确定新增or编辑
        handleOk(event) {
            if (this.isInsert) {
                this.required(this.insertParams.catlogName, this.fatherName, event, () => {
                    this.$refs.insert.hide();   
                    delete this.insertParams.id
                    let params = this.insertParams;
                    api.groupCatalog.insert(params).then(res => {
                        this.alertInfo(res)
                    })
                }); 
            } else {
                this.required(this.insertParams.catlogName, this.fatherName, event, () => {
                    this.$refs.insert.hide();                    
                    let params = this.insertParams;
                    api.groupCatalog.update(params).then(res => {
                        this.alertInfo(res)
                    })
                });
            }
        },
        alertInfo(res) {
            if (res.data.code === 'success') {
                Message({
                    type: 'success',
                    message: "操作成功"
                });
                this.queryInfo()
            } 
        },
        queryInfo() {
            let params = {
                catlogCode: this.insertParams.catlogCode
            };
            api.groupCatalog.query(params).then(res => {
                if (res.data.code === 'success') {
                    let obj = res.data.obj;
                    this.getObj(obj)
                }
            })
        },
        // 校验必填项
        required(data1, data2, event, success) {
            if(!data1) {
                event.preventDefault();
                this.catlState = 'invalid';
                // return;
            }
            if(!data2) {
                event.preventDefault();
                this.catlFatherState = 'invalid';
            }
            if(data1&&data2) {
                this.catlState = null
                this.catlFatherState = null
                success()
            }
        },
        // 新增
        insertClick() {
            this.$refs.insert.show();
            this.catlState = null;
            this.catlFatherState = null;
            this.isInsert = true;
            this.getcatlogCode()
            this.insertParams.catlogName = '';
            this.insertParams.fatherCatlogCode = '';
            this.insertParams.relationCodes = '';
            this.insertParams.remark = '';
            this.insertParams.isDeleted = 0;
            this.fatherName = ''
        },
        // 编辑
        updateClick() {
            let val = this.catalogDetail
            if (val && this.showModal) {
                this.catlState = null;
                this.catlFatherState = null;
                this.$refs.insert.show();
                this.isInsert = false;
                // 待优化
                this.insertParams.id = val[0].id;
                this.insertParams.catlogCode = val[0].catlogCode;
                this.insertParams.catlogName = val[0].catlogName;
                this.insertParams.fatherCatlogCode = val[0].fatherCatlogCode;
                this.insertParams.relationCodes = val[0].relationCodes;
                this.insertParams.remark = val[0].remark;
                this.insertParams.isDeleted = val[0].isDeleted;
                this.fatherName = val[0].fatherCatlogName; 
            }
           /* console.log(this.obj)*/
        },
        ...mapMutations({
            getObj: 'classification/GET_OBJ'
        })
    },
    watch: {
        insertParams(val) {
            if(val.catlogName) {
                this.cateState = '';
            }
        }
    }
};

</script>
<style lang="css" scoped>
.modal-dialog {
    margin: 80px auto !important;
}

.catalog .el-tree {
    height: 300px;
    overflow-y: scroll;
}
</style>
