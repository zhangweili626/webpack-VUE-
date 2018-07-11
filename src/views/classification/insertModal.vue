<template>
    <b-modal id="insert" ref="insert" :title="isInsert ? '新增服务分类' : '编辑服务分类'" size="lg" @ok="handleOk" ok-title="确定" cancel-title="取消" v-if="showModal">
        <div class="row">
            <div class="col-md-6 ser-class">
                <el-tree :data="treeData" :props="propOption" :load="loadNode" node-key="id" lazy accordion check-strictly :default-expanded-keys="[0]" :expand-on-click-node="hasExpandClick" @node-click="handleNodeClick" @node-expand="expandClick">
                </el-tree>
            </div>
            <div class="col-md-6">
                <b-form-fieldset horizontal label="服务分类编码" :label-cols="5" class="text-right">
                    <b-form-input v-model="insertParams.categoryCode" readonly/>
                </b-form-fieldset>
                <b-form-fieldset horizontal label="父级服务分类名称*" :label-cols="5" class="text-right">
                    <b-form-input v-model="fatherName" readonly/>
                </b-form-fieldset>
                <b-form-fieldset horizontal label="服务分类名称 *" :label-cols="5" class="text-right">
                    <b-form-input v-model="insertParams.categoryName" :state="cateState" placeholder="必填项"/>
                    <b-form-feedback class="text-left">
                    </b-form-feedback>
                </b-form-fieldset>
                <b-form-fieldset horizontal label="备注" :label-cols="5" class="text-right">
                    <b-form-input v-model="insertParams.remark" />
                </b-form-fieldset>
                <b-form-fieldset horizontal label="状态" :label-cols="5" class="text-right">
                    <b-form-select v-model="insertParams.isDeleted" :options="statusOptions">
                    </b-form-select>
                </b-form-fieldset>
                <b-form-fieldset horizontal label="是否洗车" :label-cols="5" class="text-right">
                    <b-form-select v-model="insertParams.isCarWash" :options="isCarWash">
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
import { mapGetters, mapMutations } from 'vuex'

export default {
    components: {
        Tree
    },
    props: ['queryParams', 'showModal'],
    data() {
        return {
            treeData: [],
            propOption: {
                children: 'children',
                label: 'categoryName'
            },
            insertParams: {
                categoryCode: '',
                categoryName: '',
                remark: '',
                fatherCategoryCode: '',
                isCarWash:null,
            },
            isCarWash:[
            	 {
                    value: 0,
                    text: '否'
                },
                {
                    value: 1,
                    text: '是'
                }
            ],
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
            cateState: null
        }
    },
    computed: {
        ...mapGetters('classification', [
            'detail'
        ])
    },
    methods: {
        // 加载子树数据
        loadNode(node, resolve) {
            if (node.level === 0) {
                let params = { categoryCode: config.serviceCategory.rootCode };
                api.serviceCategory.getService(params,(res) => {
                    if (res.data.code === 'success') {
                        let obj = res.data.obj;
                        if (obj) {
                            let arr = [{
                                id: 0,   // 默认展示一级节点
                                categoryName: obj.categoryName,
                                categoryCode: obj.categoryCode
                            }];
                            return resolve(arr);
                        }
                    }
                })
            } else {
                let params = { categoryCode: node.data.categoryCode };
                api.serviceCategory.getService(params,(res) => {
                    if (res.data.code === 'success') {
                        let items = res.data.obj.serviceCategorySubInfo;
                        let arr = [];
                        if (items !== null && items!='undefined') {
                        	console.log(items)
                            items.forEach((item, index) => {
                                let data = {
                                    categoryName: item.categoryName,
                                    categoryCode: item.categoryCode
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
        // 节点展开事件
        expandClick() {},
        // 节点点击事件
        handleNodeClick(data) {
            this.insertParams.fatherCategoryCode = data.categoryCode;
            this.fatherName = data.categoryName;
        },
        // 获取服务分类编码
        getCategoryCode() {
            let params = { serviceCode: config.serviceCategory.seqCode };
            api.ordinalInfo.getSequence(params, res => {
                if (res.data.code === 'success') {
                    let obj = res.data.obj;
                    this.insertParams.categoryCode = obj;
                }
            })
        },
        // 确定新增or编辑
        handleOk(event) {
        	event.preventDefault();
        	if(this.fatherName == ''){
        		 Message({
                    type: 'warning',
                    message: "父级服务目录名称不能为空"
                });
        		return
        	}
            if (this.isInsert) {
                this.required(this.insertParams.categoryName, event, () => {
                    this.$refs.insert.hide();   
                    delete this.insertParams.id
                    let params = this.insertParams;
                    api.serviceCategory.insert(params,(res) => {
                        this.alertInfo(res)
                    })
                });   
            } else {
                this.required(this.insertParams.categoryName, event, () => {
                    this.$refs.insert.hide();                    
                    let params = this.insertParams;
                    api.serviceCategory.update(params,(res) => {
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
                categoryCode: this.insertParams.categoryCode
            };
            api.serviceCategory.query(params,(res) => {
                if (res.data.code === 'success') {
                    let obj = res.data.obj;
                    this.getDatalist(obj)
                }
            })
        },
        // 校验必填项
        required(data, event, success) {
           if(!data) {
                event.cancel();
                this.cateState = 'invalid';
                return;
            }else {
                this.cateState = null;
                success()
            }
        },
        // 新增
        insertClick() {
            this.$refs.insert.show();
            this.cateState = null; 
            this.isInsert = true;
            this.getCategoryCode()
            this.insertParams.categoryName = '';
            this.insertParams.fatherCategoryCode = '';
            this.insertParams.relationCodes = '';
            this.insertParams.remark = '';
            this.insertParams.isDeleted = 0;
            this.fatherName = '';
            this.insertParams.isCarWash = null;
        },
        // 编辑
        updateClick() {
            let val = this.detail
            if (val && this.showModal) {
                this.cateState = null;
                this.$refs.insert.show();
                this.isInsert = false;
                // 待优化
                this.insertParams.id = val[0].id;
                this.insertParams.categoryCode = val[0].categoryCode;
                this.insertParams.categoryName = val[0].categoryName;
                this.insertParams.fatherCategoryCode = val[0].fatherCategoryCode;
                this.insertParams.relationCodes = val[0].relationCodes;
                this.insertParams.remark = val[0].remark;
                this.insertParams.isDeleted = val[0].isDeleted;
                this.fatherName = val[0].fatherCategoryName;
                this.insertParams.isCarWash = val[0].isCarWash;
                
            }
        },
        ...mapMutations({
            getDatalist: 'classification/GET_DATALIST'
        })
    },
    watch: {
        insertParams(val) {
            if(val.categoryName) {
                this.cateState = null;
            }
        }
    }
};

</script>
<style lang="css" scoped>
.modal-dialog {
    margin: 80px auto !important;
}
.ser-class .el-tree {
    height: 300px;
    overflow-y: scroll;
} 
</style>
