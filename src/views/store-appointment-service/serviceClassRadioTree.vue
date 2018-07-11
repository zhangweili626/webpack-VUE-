<template>
    <div> 
       <el-tree  :data="orgTreeData" :props="orgOptions" :load="goryLoad" node-key="categoryCode" lazy accordion check-strictly :default-expanded-keys="['000001']" :expand-on-click-node="false" @node-click="handleNodeClick" ref="serivceClassTree">
        </el-tree>
    </div>
</template>
<script>

import config from 'common/config'
import api from 'common/api'
import Vue from 'vue'
import { Tree } from 'element-ui'
Vue.use(Tree)

export default {
	props:{
        params: {
            type: Object,
            default: function() {
                return { orgName: ''};
            }
        },  
    },
    
    data() {
        return {
            orgTreeData: [],
            orgOptions: {
                children: 'children',
                label: 'categoryName'
            },
            orgShow: false,  
            dataName: '',         
        }
    },
    computed: {
        
    },
    methods: {
        // 服务分类
        goryLoad(node, resolve) {
                 if (node.level === 0) {
                let params = { categoryCode: config.classification.rootCode };
                api.serviceCategory.getService(params,(res) => {
                    if (res.data.code === 'success') {
                        let obj = res.data.obj;
                        if (obj) {
                            let arr = [{
                                // id: 0,   // 默认展示一级节点
                                categoryName: obj.categoryName,
                                categoryCode: obj.categoryCode,
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
        handleNodeClick(data) {
            this.$emit('getData', data);
        },
        clear() {
            this.dataName = '';
            this.$refs.serivceClassTree.setCheckedKeys([]);
        },
    },
    watch: {       
        orgShow(val) {
            document.addEventListener('click', (e) => {
                let _oTree = this.$refs.org;
                if(_oTree && !_oTree.contains(e.target))  this.orgShow = false
            })
        },      
    }
}
</script>
<style lang="css">
</style>
